'use client'

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'

import { Chat, type ChatConfig } from '@iblai/iblai-js/web-containers/next'
import {
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
import { redirectToAuthSpa } from '@/lib/iblai/auth-utils'
import { buildPromptWithCanvas } from '@/lib/iblai/build-canvas-prompt'
import { clearPendingBuild } from '@/lib/iblai/pending-build'
import config from '@/lib/iblai/config'
import { submitSdkChatMessageWithRetry } from '@/lib/iblai/submit-sdk-chat'
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
  const canvasRequestedRef = useRef(false)
  const sessionId = useSelector(selectSessionId)
  const artifactsEnabled = useSelector(selectArtifactsEnabled)
  const { updateSessionTools } = useMentorTools({
    tenantKey,
    mentorId,
    username,
  })

  useEffect(() => {
    if (!useCanvas || !sessionId || artifactsEnabled || canvasRequestedRef.current) {
      return
    }

    canvasRequestedRef.current = true
    void updateSessionTools(TOOLS.CANVAS)
  }, [artifactsEnabled, mentorId, sessionId, updateSessionTools, useCanvas])

  useEffect(() => {
    const prompt = buildPromptWithCanvas(initialPrompt, useCanvas)
    if (skipInitialSubmit || !prompt || submittedRef.current || !sessionId) return

    const cleanup = submitSdkChatMessageWithRetry(dispatch, prompt, {
      onSuccess: () => {
        submittedRef.current = true
        if (buildNonce) clearPendingBuild(buildNonce)
      },
    })

    return cleanup
  }, [
    buildNonce,
    dispatch,
    initialPrompt,
    sessionId,
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
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none md:rounded-[10px]">
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
        <CanvasBuildBootstrap
          mentorId={mentorId}
          tenantKey={tenantKey}
          username={username}
          initialPrompt={initialPrompt}
          useCanvas={useCanvas}
          buildNonce={buildNonce}
          skipInitialSubmit={skipInitialSubmit}
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
