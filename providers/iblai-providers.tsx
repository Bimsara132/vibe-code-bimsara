'use client'

/**
 * ibl.ai Provider wrapper — Redux, AuthProvider, TenantProvider.
 */

import { initializeDataLayer } from '@iblai/iblai-js/data-layer'
import { AuthProvider, TenantProvider } from '@iblai/iblai-js/web-utils'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import {
  hasNonExpiredAuthToken,
  redirectToAuthSpa,
} from '@/lib/iblai/auth-utils'
import config from '@/lib/iblai/config'
import { SSO_HANDOFF_KEY } from '@/lib/iblai/sso-login-handler'
import { LocalStorageService } from '@/lib/iblai/storage-service'
import { checkTenantMismatch, resolveAppTenant } from '@/lib/iblai/tenant'
import { iblaiStore } from '@/store/iblai-store'

const storageService = LocalStorageService.getInstance()

const PUBLIC_ROUTES = new Map<RegExp, () => Promise<boolean>>([
  [new RegExp('^/sso-login'), async () => false],
])

export function IblaiProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const [enableStorageSync, setEnableStorageSync] = useState(() => {
    if (typeof window === 'undefined') return true
    return !sessionStorage.getItem(SSO_HANDOFF_KEY)
  })

  useEffect(() => {
    if (enableStorageSync) return
    sessionStorage.removeItem(SSO_HANDOFF_KEY)
    setEnableStorageSync(true)
  }, [enableStorageSync])

  const [isInitialized] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      initializeDataLayer(
        config.dmUrl(),
        config.lmsUrl(),
        config.lmsUrl(),
        storageService,
        {
          401: () => redirectToAuthSpa(undefined, undefined, true),
        },
      )
    } catch (error) {
      console.error('[ibl.ai] initializeDataLayer failed:', error)
    }
    return true
  })

  const username = useMemo(() => {
    if (typeof window === 'undefined') return ''
    try {
      const raw = localStorage.getItem('userData')
      if (raw) return JSON.parse(raw).user_nicename ?? ''
    } catch {
      /* ignore */
    }
    return ''
  }, [isInitialized, pathname])

  const tenantKey = useMemo(() => resolveAppTenant(), [isInitialized, pathname])
  const isSsoRoute = pathname?.startsWith('/sso-login') ?? false

  if (!isInitialized) return null

  return (
    <ReduxProvider store={iblaiStore}>
      <AuthProvider
        skip={isSsoRoute}
        redirectToAuthSpa={redirectToAuthSpa}
        hasNonExpiredAuthToken={hasNonExpiredAuthToken}
        username={username}
        pathname={pathname ?? '/'}
        storageService={storageService}
        middleware={PUBLIC_ROUTES}
        enableStorageSync={enableStorageSync && !isSsoRoute}
        fallback={null}
      >
        <TenantProvider
          skip={isSsoRoute}
          skipCustomDomainCheck
          currentTenant={tenantKey}
          requestedTenant={tenantKey}
          saveCurrentTenant={(t: unknown) => {
            const key = typeof t === 'string' ? t : (t as { key?: string })?.key ?? String(t)
            localStorage.setItem('current_tenant', key)
            localStorage.setItem('tenant', key)
            checkTenantMismatch()
          }}
          saveUserTenants={(t: unknown) =>
            localStorage.setItem('tenants', JSON.stringify(t))
          }
          handleTenantSwitch={async () => {
            const tenant = resolveAppTenant()
            redirectToAuthSpa(undefined, tenant, false, true)
          }}
          redirectToAuthSpa={redirectToAuthSpa}
          username={username}
          fallback={null}
        >
          {children}
        </TenantProvider>
      </AuthProvider>
    </ReduxProvider>
  )
}
