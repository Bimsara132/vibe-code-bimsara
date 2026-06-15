'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

import { Chat, type ChatConfig } from '@iblai/iblai-js/web-containers/next'
import {
  useAxdToken,
  useCachedSessionId,
  useIsAdmin,
  useUserTenants,
  useUsername,
  useVisitingTenant,
} from '@iblai/iblai-js/web-utils'
import { useRouter } from 'next/navigation'

import { VoiceBootstrap } from '@/components/iblai/voice-bootstrap'
import { redirectToAuthSpa } from '@/lib/iblai/auth-utils'
import config from '@/lib/iblai/config'
import { resolveAppTenant } from '@/lib/iblai/tenant'
import { useDefaultMentorId } from '@/lib/iblai/use-default-mentor'

type HomeSdkVoiceHostProps = {
  mode: 'call' | 'record'
  onHostReady?: () => void
}

export function HomeSdkVoiceHost({ mode, onHostReady }: HomeSdkVoiceHostProps) {
  const router = useRouter()
  const { mentorId, isLoading: isMentorLoading } = useDefaultMentorId()
  const [tenantKey, setTenantKey] = useState('')
  const [cachedSessionId, saveCachedSessionId] = useCachedSessionId()
  const [seeded, setSeeded] = useState(false)

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
      setSeeded(false)
      return
    }

    const map = { ...((cachedSessionId ?? {}) as Record<string, string>) }
    if (map[mentorId]) {
      delete map[mentorId]
      saveCachedSessionId(map)
    }
    setSeeded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once per mount
  }, [mentorId])

  useEffect(() => {
    if (!mentorId || !tenantKey || !seeded || isMentorLoading) return
    onHostReady?.()
  }, [isMentorLoading, mentorId, onHostReady, seeded, tenantKey])

  if (!mentorId || !tenantKey || !seeded || isMentorLoading) {
    return null
  }

  const chatConfig: ChatConfig = {
    baseWsUrl: () => config.baseWsUrl(),
    supportEmail: () => config.supportEmail(),
    authUrl: () => config.authUrl(),
    mainTenantKey: config.mainTenantKey(),
    navigateToAdminBilling: () => router.push('/app/profile'),
    navigateToExplore: () => router.push('/app'),
    navigateToMentor: () => router.push('/app'),
  }

  return (
    <div
      id="sdk-voice-host"
      className="pointer-events-none fixed top-0 left-0 h-px w-px overflow-hidden opacity-0"
      aria-hidden
    >
      <Chat
        key={`home-voice:${mentorId}:${mode}`}
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
        showConversationStarters={false}
      />
      <VoiceBootstrap
        startVoiceCall={mode === 'call'}
        startVoiceRecord={mode === 'record'}
      />
    </div>
  )
}
