'use client'

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'

import { Chat, type ChatConfig } from '@iblai/iblai-js/web-containers/next'
import {
  chatActions,
  selectArtifactsEnabled,
  selectSessionId,
  TOOLS,
  useAxdToken,
  useCachedSessionId,
  useIsAdmin,
  useMentorTools,
  useUserTenants,
  useUsername,
  useVisitingTenant,
} from '@iblai/iblai-js/web-utils'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import { ChatMessageList } from '@/components/dashboard/chat-message-list'
import { ChatPromptFooter } from '@/components/dashboard/chat-prompt-footer'
import { VoiceBootstrap } from '@/components/iblai/voice-bootstrap'
import { redirectToAuthSpa } from '@/lib/iblai/auth-utils'
import { buildPromptWithCanvas } from '@/lib/iblai/build-canvas-prompt'
import { upsertLocalRecentChat } from '@/lib/iblai/local-recent-chats'
import { clearPendingBuild } from '@/lib/iblai/pending-build'
import config from '@/lib/iblai/config'
import {
  isSdkChatInputMounted,
  submitSdkChatMessageWithRetry,
} from '@/lib/iblai/submit-sdk-chat'
import { useDefaultMentorId } from '@/lib/iblai/use-default-mentor'
import { resolveAppTenant } from '@/lib/iblai/tenant'

type VibeBuildChatProps = {
  initialPrompt?: string
  useCanvas?: boolean
  buildNonce?: string
}

function CanvasBuildBootstrap({
  mentorId,
  tenantKey,
  username,
  initialPrompt = '',
  useCanvas = false,
  buildNonce,
  skipInitialSubmit = false,
}: {
  mentorId: string
  tenantKey: string
  username: string
  initialPrompt?: string
  useCanvas?: boolean
  buildNonce?: string
  skipInitialSubmit?: boolean
}) {
  const dispatch = useDispatch()
  const submittedRef = useRef(false)
  const canvasEnabledForSessionRef = useRef<string | null>(null)
  const updateSessionToolsRef = useRef<
    ReturnType<typeof useMentorTools>['updateSessionTools']
  >(() => Promise.resolve())
  const sessionId = useSelector(selectSessionId)
  const [sessionSettled, setSessionSettled] = useState(false)
  const artifactsEnabled = useSelector(selectArtifactsEnabled)
  const { updateSessionTools } = useMentorTools({
    tenantKey,
    mentorId,
    username,
  })

  updateSessionToolsRef.current = updateSessionTools

  useEffect(() => {
    if (!sessionId) {
      setSessionSettled(false)
      canvasEnabledForSessionRef.current = null
      return
    }

    const timer = window.setTimeout(() => setSessionSettled(true), 900)
    return () => window.clearTimeout(timer)
  }, [sessionId])

  useEffect(() => {
    if (!useCanvas || !sessionId || artifactsEnabled) return
    if (canvasEnabledForSessionRef.current === sessionId) return

    canvasEnabledForSessionRef.current = sessionId
    void updateSessionToolsRef.current(TOOLS.CANVAS)
  }, [artifactsEnabled, sessionId, useCanvas])

  useEffect(() => {
    const prompt = buildPromptWithCanvas(initialPrompt, useCanvas)
    if (
      skipInitialSubmit ||
      !prompt ||
      submittedRef.current ||
      !sessionId ||
      !sessionSettled ||
      (useCanvas && !artifactsEnabled)
    ) {
      return
    }

    let cleanupSubmit: (() => void) | undefined

    const startSubmit = () => {
      if (submittedRef.current || !isSdkChatInputMounted()) return false

      cleanupSubmit = submitSdkChatMessageWithRetry(dispatch, prompt, {
        intervalMs: 300,
        timeoutMs: 60000,
        onSuccess: () => {
          submittedRef.current = true
          if (buildNonce) clearPendingBuild(buildNonce)
        },
      })
      return true
    }

    if (startSubmit()) {
      return () => cleanupSubmit?.()
    }

    const waitForInput = window.setInterval(() => {
      if (startSubmit()) {
        window.clearInterval(waitForInput)
      }
    }, 200)

    return () => {
      window.clearInterval(waitForInput)
      cleanupSubmit?.()
    }
  }, [
    artifactsEnabled,
    buildNonce,
    dispatch,
    initialPrompt,
    sessionId,
    sessionSettled,
    skipInitialSubmit,
    useCanvas,
  ])

  return null
}

function VibeBuildChatInner({
  initialPrompt = '',
  useCanvas = false,
  buildNonce,
}: VibeBuildChatProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restoreSessionId = searchParams.get('session') ?? undefined
  const restoreMentorId = searchParams.get('mentor') ?? undefined
  const newParam = searchParams.get('new') ?? undefined
  const startVoiceCall = searchParams.get('voice') === 'call'
  const startVoiceRecord = searchParams.get('voice') === 'record'

  const { mentorId: defaultMentorId, isLoading: isMentorLoading } =
    useDefaultMentorId()
  const mentorId = restoreMentorId || defaultMentorId

  const [cachedSessionId, saveCachedSessionId] = useCachedSessionId()
  const [seededFor, setSeededFor] = useState<string | undefined>(
    restoreSessionId || newParam ? undefined : 'none',
  )
  const [tenantKey, setTenantKey] = useState('')

  const username = useUsername() ?? ''
  const axdToken = useAxdToken()
  const { userTenants } = useUserTenants()
  const { visitingTenant } = useVisitingTenant()
  const isAdmin = useIsAdmin()
  const dispatch = useDispatch()
  const sessionId = useSelector(selectSessionId)

  useLayoutEffect(() => {
    if (!newParam || !mentorId) return

    dispatch(chatActions.setStatus('idle'))
    dispatch(chatActions.setStreaming(false))
    dispatch(chatActions.resetIsTyping(undefined))
    dispatch(chatActions.resetCurrentStreamingMessage(undefined))
  }, [dispatch, mentorId, newParam])

  useEffect(() => {
    if (!mentorId) return

    if (restoreSessionId) {
      upsertLocalRecentChat({
        id: restoreSessionId,
        label: initialPrompt.trim() || 'Untitled chat',
        mentorId,
      })
      return
    }

    const label = initialPrompt.trim()
    if (!sessionId || !label) return

    upsertLocalRecentChat({ id: sessionId, label, mentorId })
  }, [initialPrompt, mentorId, restoreSessionId, sessionId])

  useEffect(() => {
    setTenantKey(resolveAppTenant())
  }, [])

  useLayoutEffect(() => {
    if (!mentorId) {
      setSeededFor('none')
      return
    }

    const map = { ...((cachedSessionId ?? {}) as Record<string, string>) }

    if (restoreSessionId) {
      if (map[mentorId] !== restoreSessionId) {
        saveCachedSessionId({ ...map, [mentorId]: restoreSessionId })
      }
      setSeededFor(restoreSessionId)
    } else if (newParam) {
      if (map[mentorId]) {
        delete map[mentorId]
        saveCachedSessionId(map)
      }
      setSeededFor(`new:${newParam}`)
    } else {
      setSeededFor('none')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed session once per URL change
  }, [restoreSessionId, newParam, mentorId])

  const sessionReady = restoreSessionId
    ? seededFor === restoreSessionId
    : newParam
      ? seededFor === `new:${newParam}`
      : true

  const chatConfig: ChatConfig = {
    baseWsUrl: () => config.baseWsUrl(),
    supportEmail: () => config.supportEmail(),
    authUrl: () => config.authUrl(),
    mainTenantKey: config.mainTenantKey(),
    navigateToAdminBilling: () => router.push('/app/profile'),
    navigateToExplore: () => router.push('/app'),
    navigateToMentor: () => router.push('/app'),
  }

  if ((restoreMentorId ? false : isMentorLoading) || !tenantKey || !sessionReady) {
    return <AppLoadingScreen />
  }

  if (!mentorId) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-2">
          <p className="text-base font-medium text-neutral-900">
            No agent configured
          </p>
          <p className="text-sm text-neutral-500">
            Set <code className="text-xs">NEXT_PUBLIC_DEFAULT_AGENT_ID</code> in
            your environment.
          </p>
        </div>
      </div>
    )
  }

  const skipInitialSubmit = Boolean(restoreSessionId && !initialPrompt.trim())

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden py-0 md:py-[10px]"
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-none md:rounded-[10px]">
        <div
          id="vibe-custom-chat"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <Chat
            key={`${mentorId}:${restoreSessionId ?? ''}:${newParam ?? ''}:${initialPrompt ? 'build' : ''}`}
            isPreviewMode={false}
            hasBorder={false}
            mentorId={mentorId}
            tenantKey={tenantKey}
            config={chatConfig}
            redirectToAuthSpa={(redirectTo, platformKey, logout) => {
              void redirectToAuthSpa(redirectTo, platformKey, logout)
            }}
            username={username || null}
            userTenants={userTenants ?? []}
            visitingTenant={visitingTenant}
            axdToken={axdToken ?? ''}
            userIsStudent={!isAdmin}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[720px] flex-1 flex-col px-4 md:px-8">
          <ChatMessageList
            initialPrompt={initialPrompt}
            isRestoringSession={Boolean(restoreSessionId)}
          />
          <ChatPromptFooter mentorId={mentorId} tenantKey={tenantKey} />
        </div>

        <CanvasBuildBootstrap
          mentorId={mentorId}
          tenantKey={tenantKey}
          username={username}
          initialPrompt={initialPrompt}
          useCanvas={useCanvas}
          buildNonce={buildNonce}
          skipInitialSubmit={skipInitialSubmit}
        />
        <VoiceBootstrap
          startVoiceCall={startVoiceCall}
          startVoiceRecord={startVoiceRecord}
        />
      </div>
    </main>
  )
}

export function VibeBuildChat(props: VibeBuildChatProps) {
  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <VibeBuildChatInner {...props} />
    </Suspense>
  )
}
