'use client'

import { useEffect, useState } from 'react'

import { hasNonExpiredAuthToken } from '@/lib/iblai/auth-utils'

function hasChatAuthTokens(): boolean {
  if (typeof window === 'undefined') return false
  if (!hasNonExpiredAuthToken()) return false
  return Boolean(localStorage.getItem('dm_token')?.trim())
}

/**
 * Wait for SSO tokens TenantProvider stores before mounting SDK Chat.
 * Prevents early WebSocket connections that return empty `{}` errors.
 */
export function useAuthTokensReady(timeoutMs = 20_000) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (hasChatAuthTokens()) {
      setReady(true)
      return
    }

    const interval = window.setInterval(() => {
      if (hasChatAuthTokens()) {
        setReady(true)
        window.clearInterval(interval)
        window.clearTimeout(timeout)
      }
    }, 200)

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval)
      console.warn(
        '[ibl.ai] dm_token not ready after timeout — mounting chat anyway',
      )
      setReady(true)
    }, timeoutMs)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [timeoutMs])

  return ready
}
