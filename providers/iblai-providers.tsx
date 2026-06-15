'use client'

/**
 * ibl.ai Provider wrapper — Redux, AuthProvider, TenantProvider.
 */

import { initializeDataLayer } from '@iblai/iblai-js/data-layer'
import {
  AuthProvider,
  ServiceWorkerProvider,
  TenantProvider,
  syncAuthToCookies,
} from '@iblai/iblai-js/web-utils'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import {
  handleAuthHttp401,
  hasNonExpiredAuthToken,
  redirectToAuthSpa,
} from '@/lib/iblai/auth-utils'
import config from '@/lib/iblai/config'
import { LocalStorageService } from '@/lib/iblai/storage-service'
import { checkTenantMismatch, resolveAppTenant } from '@/lib/iblai/tenant'
import { iblaiStore } from '@/store/iblai-store'

const storageService = LocalStorageService.getInstance()

const PUBLIC_ROUTES = new Map<RegExp, () => Promise<boolean>>([
  [new RegExp('^/sso-login'), async () => false],
  [new RegExp('^/login'), async () => false],
])

export function IblaiProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const [isInitialized] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      initializeDataLayer(
        config.dmUrl(),
        config.lmsUrl(),
        config.lmsUrl(),
        storageService,
        {
          401: handleAuthHttp401,
        },
      )
    } catch (error) {
      console.error('[ibl.ai] initializeDataLayer failed:', error)
    }
    return true
  })

  const username = useMemo(() => {
    if (!isInitialized || typeof window === 'undefined') return ''
    try {
      const raw = localStorage.getItem('userData')
      if (raw) return JSON.parse(raw).user_nicename ?? ''
    } catch {
      /* ignore */
    }
    return ''
  }, [isInitialized, pathname])

  const tenantKey = useMemo(() => {
    if (!isInitialized) return ''
    return resolveAppTenant()
  }, [isInitialized, pathname])

  const isSsoRoute = pathname?.startsWith('/sso-login') ?? false

  const saveCurrentTenant = useCallback((t: unknown) => {
    if (typeof t === 'string') {
      localStorage.setItem('current_tenant', JSON.stringify({ key: t }))
      localStorage.setItem('tenant', t)
      localStorage.setItem('app_tenant', t)
    } else {
      const tenant = t as {
        key: string
        is_admin?: boolean
        org?: string
        platform_name?: string
      }
      localStorage.setItem('current_tenant', JSON.stringify(tenant))
      localStorage.setItem('tenant', tenant.key)
      localStorage.setItem('app_tenant', tenant.key)
    }
    void syncAuthToCookies(storageService)
    checkTenantMismatch()
  }, [])

  const handleTenantSwitch = useCallback(async () => {
    const tenant = resolveAppTenant()
    redirectToAuthSpa(undefined, tenant, false, true)
  }, [])

  if (!isInitialized) {
    return <AppLoadingScreen />
  }

  return (
    <ReduxProvider store={iblaiStore}>
      <ServiceWorkerProvider>
        <AuthProvider
          skip={isSsoRoute}
          redirectToAuthSpa={redirectToAuthSpa}
          hasNonExpiredAuthToken={hasNonExpiredAuthToken}
          username={username}
          pathname={pathname ?? '/'}
          storageService={storageService}
          middleware={PUBLIC_ROUTES}
          enableStorageSync
          fallback={<AppLoadingScreen />}
        >
          <TenantProvider
            skip={isSsoRoute}
            skipCustomDomainCheck
            currentTenant={tenantKey}
            requestedTenant={tenantKey}
            saveCurrentTenant={saveCurrentTenant}
            saveUserTenants={(t: unknown) =>
              localStorage.setItem('tenants', JSON.stringify(t))
            }
            handleTenantSwitch={handleTenantSwitch}
            redirectToAuthSpa={redirectToAuthSpa}
            username={username}
            fallback={<AppLoadingScreen />}
          >
            {children}
          </TenantProvider>
        </AuthProvider>
      </ServiceWorkerProvider>
    </ReduxProvider>
  )
}
