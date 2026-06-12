'use client'

import { clearAuthCookies, syncAuthToCookies } from '@iblai/iblai-js/web-utils'
import { useEffect, useState } from 'react'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import {
  COMPLETING_LOGIN_MESSAGE,
  markSsoRedirectSuppression,
} from '@/lib/iblai/auth-utils'
import { LocalStorageService } from '@/lib/iblai/storage-service'

const SSO_PROCESSING_KEY = 'ibl_sso_processing'

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
  }

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

  useEffect(() => {
    setMounted(true)

    const searchParams = new URLSearchParams(window.location.search)
    const queryParamData = searchParams.get('data')
    if (!queryParamData) return

    if (sessionStorage.getItem(SSO_PROCESSING_KEY)) return
    sessionStorage.setItem(SSO_PROCESSING_KEY, '1')

    const parsedData = JSON.parse(queryParamData) as Record<string, string>

    initializeLocalStorageWithObject(parsedData).then(async () => {
      const redirectPath =
        localStorage.getItem(redirectPathKey) ||
        searchParams.get('redirect-path') ||
        defaultRedirectPath

      localStorage.removeItem(redirectPathKey)
      markSsoRedirectSuppression()
      sessionStorage.removeItem(SSO_PROCESSING_KEY)

      // Match SDK timing so cookies/localStorage are settled before navigation.
      await new Promise((resolve) => setTimeout(resolve, 100))
      window.location.href = `${window.location.origin}${redirectPath}`
    })
  }, [redirectPathKey, defaultRedirectPath])

  if (!mounted) return null

  return <AppLoadingScreen message={COMPLETING_LOGIN_MESSAGE} />
}
