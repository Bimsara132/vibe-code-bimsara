'use client'

/**
 * ibl.ai Provider wrapper — Redux, AuthProvider, TenantProvider.
 */

import { initializeDataLayer } from '@iblai/iblai-js/data-layer'
import { AuthProvider, TenantProvider, syncAuthToCookies } from '@iblai/iblai-js/web-utils'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import {
  clearSsoHandoffFlags,
  clearSsoLoginUi,
  COMPLETING_LOGIN_MESSAGE,
  getSsoRedirectGraceRemainingMs,
  handleAuthHttp401,
  hasNonExpiredAuthToken,
  isSsoHandoffActive,
  isSsoLoginUiActive,
  isSsoRedirectSuppressed,
  redirectToAuthSpa,
} from '@/lib/iblai/auth-utils'
import config from '@/lib/iblai/config'
import { LocalStorageService } from '@/lib/iblai/storage-service'
import { checkTenantMismatch, resolveAppTenant } from '@/lib/iblai/tenant'
import { iblaiStore } from '@/store/iblai-store'

const storageService = LocalStorageService.getInstance()

const PUBLIC_ROUTES = new Map<RegExp, () => Promise<boolean>>([
  [new RegExp('^/sso-login'), async () => false],
])

function AuthLoadingFallback({ completingLogin }: { completingLogin?: boolean }) {
  return (
    <AppLoadingScreen
      message={completingLogin ? COMPLETING_LOGIN_MESSAGE : undefined}
    />
  )
}

function CompletingLoginOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white">
      <AppLoadingScreen message={COMPLETING_LOGIN_MESSAGE} />
    </div>
  )
}

export function IblaiProviders({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const [isInitialized, setIsInitialized] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [enableStorageSync, setEnableStorageSync] = useState(true)
  const [ssoSessionReady, setSsoSessionReady] = useState(false)
  const [graceTick, setGraceTick] = useState(0)
  const [completingLoginVisible, setCompletingLoginVisible] = useState(false)

  const dismissCompletingLogin = useCallback(() => {
    clearSsoLoginUi()
    setCompletingLoginVisible(false)
  }, [])

  useEffect(() => {
    setHasMounted(true)
    if (isSsoLoginUiActive()) {
      setCompletingLoginVisible(true)
    }
  }, [])

  useEffect(() => {
    const remaining = getSsoRedirectGraceRemainingMs()
    if (remaining <= 0) return

    const timer = window.setTimeout(() => {
      setGraceTick((value) => value + 1)
    }, remaining + 50)

    return () => window.clearTimeout(timer)
  }, [isInitialized, graceTick])

  useEffect(() => {
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

    const finishingSsoHandoff = isSsoHandoffActive()

    if (finishingSsoHandoff) {
      setEnableStorageSync(false)

      void (async () => {
        try {
          // Push SSO localStorage into cookies before cross-SPA sync starts.
          await syncAuthToCookies(storageService)
          await syncAuthToCookies(storageService)
        } finally {
          clearSsoHandoffFlags()
          setSsoSessionReady(true)
          setEnableStorageSync(true)
        }
      })()
    } else {
      setSsoSessionReady(true)
    }

    setIsInitialized(true)
  }, [])

  const isSsoRoute = pathname?.startsWith('/sso-login') ?? false

  const blockAuthRedirects = hasMounted
    ? isSsoRedirectSuppressed() ||
      isSsoHandoffActive() ||
      (!ssoSessionReady && hasNonExpiredAuthToken())
    : false

  const allowStorageSync =
    hasMounted &&
    enableStorageSync &&
    !isSsoRoute &&
    !isSsoRedirectSuppressed()

  useEffect(() => {
    if (!completingLoginVisible || !ssoSessionReady) return

    if (blockAuthRedirects) {
      const timer = window.setTimeout(() => {
        dismissCompletingLogin()
      }, 600)
      return () => window.clearTimeout(timer)
    }
  }, [blockAuthRedirects, completingLoginVisible, dismissCompletingLogin, ssoSessionReady])

  const username = useMemo(() => {
    if (!isInitialized) return ''
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

  const saveCurrentTenant = useCallback((t: unknown) => {
    if (typeof t === 'string') {
      localStorage.setItem('current_tenant', JSON.stringify({ key: t }))
      localStorage.setItem('tenant', t)
    } else {
      const tenant = t as {
        key: string
        is_admin?: boolean
        org?: string
        platform_name?: string
      }
      localStorage.setItem('current_tenant', JSON.stringify(tenant))
      localStorage.setItem('tenant', tenant.key)
    }
    void syncAuthToCookies(storageService)
    checkTenantMismatch()
  }, [])

  const handleTenantSwitch = useCallback(
    async (tenant: string, saveRedirect?: boolean) => {
      localStorage.setItem('current_tenant', JSON.stringify({ key: tenant }))
      localStorage.setItem('tenant', tenant)
      if (saveRedirect && typeof window !== 'undefined') {
        localStorage.setItem('redirectTo', window.location.pathname)
      }
      await syncAuthToCookies(storageService)
      window.location.reload()
    },
    [],
  )

  if (!hasMounted || !isInitialized) {
    return <AppLoadingScreen />
  }

  return (
    <>
      <ReduxProvider store={iblaiStore}>
        <AuthProvider
          skip={isSsoRoute}
          skipAuthCheck={blockAuthRedirects}
          redirectToAuthSpa={redirectToAuthSpa}
          hasNonExpiredAuthToken={hasNonExpiredAuthToken}
          username={username}
          pathname={pathname ?? '/'}
          storageService={storageService}
          middleware={PUBLIC_ROUTES}
          enableStorageSync={allowStorageSync}
          onAuthSuccess={dismissCompletingLogin}
          fallback={
            <AuthLoadingFallback completingLogin={completingLoginVisible} />
          }
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
            fallback={null}
          >
            {children}
          </TenantProvider>
        </AuthProvider>
      </ReduxProvider>
      {completingLoginVisible ? <CompletingLoginOverlay /> : null}
    </>
  )
}
