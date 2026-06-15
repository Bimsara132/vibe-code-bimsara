'use client'

import { clearAuthCookies, syncAuthToCookies } from '@iblai/iblai-js/web-utils'
import { useEffect, useState } from 'react'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import { COMPLETING_LOGIN_MESSAGE } from '@/lib/iblai/auth-utils'
import { LocalStorageService } from '@/lib/iblai/storage-service'

const SSO_PROCESSING_KEY = 'ibl_sso_processing'

const REQUIRED_SSO_KEYS = [
  'axd_token',
  'axd_token_expires',
  'dm_token',
  'userData',
] as const

const storageService = LocalStorageService.getInstance()

function resolveTenantKey(data: Record<string, string>): string | undefined {
  if (data.tenant) return data.tenant

  if (data.current_tenant) {
    try {
      const parsed = JSON.parse(data.current_tenant) as { key?: string }
      if (parsed.key) return parsed.key
    } catch {
      return data.current_tenant
    }
  }

  return undefined
}

function normalizeRedirectPath(
  rawPath: string | null | undefined,
  defaultRedirectPath: string,
): string {
  const fallback =
    defaultRedirectPath.startsWith('/') ? defaultRedirectPath : `/${defaultRedirectPath}`

  if (!rawPath?.trim()) return fallback

  const path = rawPath.trim()

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path)
      if (typeof window !== 'undefined' && url.origin === window.location.origin) {
        const relative = `${url.pathname}${url.search}${url.hash}`
        return relative.startsWith('/') ? relative : fallback
      }
    } catch {
      return fallback
    }
    return fallback
  }

  return path.startsWith('/') ? path : `/${path}`
}

function hasRequiredSsoKeys(data: Record<string, string>): boolean {
  return REQUIRED_SSO_KEYS.every((key) => Boolean(data[key]?.trim()))
}

async function initializeLocalStorageWithObject(data: Record<string, string>) {
  clearAuthCookies()

  localStorage.removeItem('visiting_tenant')
  localStorage.removeItem('current_tenant')
  localStorage.removeItem('tenants')
  localStorage.removeItem('app_tenant')

  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })

  const tenantKey = resolveTenantKey(data)
  if (tenantKey) {
    localStorage.setItem('tenant', tenantKey)
    localStorage.setItem('app_tenant', tenantKey)
    localStorage.setItem('current_tenant', JSON.stringify({ key: tenantKey }))
  }

  await syncAuthToCookies(storageService)
  await syncAuthToCookies(storageService)
}

type SsoLoginHandlerProps = {
  redirectPathKey?: string
  defaultRedirectPath?: string
}

export function SsoLoginHandler({
  redirectPathKey = 'redirectTo',
  defaultRedirectPath = '/app',
}: SsoLoginHandlerProps) {
  const [mounted, setMounted] = useState(false)
  const [message, setMessage] = useState(COMPLETING_LOGIN_MESSAGE)

  useEffect(() => {
    setMounted(true)

    const searchParams = new URLSearchParams(window.location.search)
    const queryParamData = searchParams.get('data')

    if (!queryParamData) {
      setMessage('Login session missing. Redirecting…')
      window.location.replace('/login')
      return
    }

    if (sessionStorage.getItem(SSO_PROCESSING_KEY)) return
    sessionStorage.setItem(SSO_PROCESSING_KEY, '1')

    let parsedData: Record<string, string>
    try {
      parsedData = JSON.parse(queryParamData) as Record<string, string>
    } catch {
      sessionStorage.removeItem(SSO_PROCESSING_KEY)
      setMessage('Login failed. Redirecting…')
      window.location.replace('/login')
      return
    }

    if (!hasRequiredSsoKeys(parsedData)) {
      sessionStorage.removeItem(SSO_PROCESSING_KEY)
      console.error('[sso-login-complete] Missing required auth keys', {
        keys: Object.keys(parsedData),
      })
      setMessage('Login incomplete. Redirecting…')
      window.location.replace('/login')
      return
    }

    initializeLocalStorageWithObject(parsedData).then(async () => {
      const redirectPath = normalizeRedirectPath(
        localStorage.getItem(redirectPathKey) ||
          searchParams.get('redirect-path'),
        defaultRedirectPath,
      )

      localStorage.removeItem(redirectPathKey)
      sessionStorage.removeItem(SSO_PROCESSING_KEY)

      await new Promise((resolve) => setTimeout(resolve, 150))
      window.location.replace(`${window.location.origin}${redirectPath}`)
    })
  }, [redirectPathKey, defaultRedirectPath])

  if (!mounted) return null

  return <AppLoadingScreen message={message} />
}
