/**
 * Auth SPA URL helpers — same contract as login.iblai.app (app=custom, redirect-to, tenant).
 */

import { redirectToAuthSpa as sdkRedirectToAuthSpa } from '@iblai/iblai-js/web-utils'
import type { RedirectToAuthSpaOptions } from '@iblai/iblai-js/web-utils'

import { hasNonExpiredAuthToken, isTauri } from './auth-utils'
import config from './config'
import { resolveAppTenant } from './tenant'

type MfeProvider = {
  id?: string
  name?: string
  loginUrl?: string
}

type MfeContextResponse = {
  context_data?: { providers?: MfeProvider[] }
  contextData?: { providers?: MfeProvider[] }
}

export function authSpaOptions(): RedirectToAuthSpaOptions {
  return {
    authUrl: config.authUrl(),
    appName: 'custom',
    platformKey: resolveAppTenant(),
    redirectPathStorageKey: 'redirectTo',
    hasNonExpiredAuthToken,
    isNativeApp: isTauri,
    preserveTokenKey: 'edx_jwt_token',
  }
}

export function saveLoginRedirectPath(path?: string) {
  if (typeof window === 'undefined') return
  const redirectPath =
    path ?? `${window.location.pathname}${window.location.search}`
  if (
    !redirectPath.startsWith('/sso-login') &&
    !redirectPath.startsWith('/sso-login-complete') &&
    !redirectPath.startsWith('/login')
  ) {
    localStorage.setItem('redirectTo', redirectPath)
  }
}

export function buildAuthSpaLoginUrl(options?: { email?: string; provider?: string }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const tenant = resolveAppTenant()
  const params = new URLSearchParams({
    app: 'custom',
    'redirect-to': origin,
  })
  if (tenant) params.set('tenant', tenant)
  if (options?.email) params.set('email', options.email)
  if (options?.provider) params.set('provider', options.provider)
  return `${config.authUrl()}/login?${params.toString()}`
}

/** Strip the LMS default dashboard next target — auth SPA does the same before SSO. */
function stripDefaultDashboardNext(loginUrl: string): string {
  const marker = 'next=%2Fdashboard'
  const idx = loginUrl.indexOf(marker)
  return idx > 0 ? loginUrl.slice(0, idx) : loginUrl
}

/** Match login.iblai.app provider URL builder (1192 chunk, function `u`). */
export function buildSsoProviderUrl(loginUrl: string): string {
  const lmsUrl = config.lmsUrl()
  const authSpaOrigin = config.authUrl().replace(/\/$/, '')
  const stripped = stripDefaultDashboardNext(loginUrl)

  let completePath = isTauri() ? '/login/mobile/complete' : '/login/complete'
  if (isTauri()) {
    const scheme =
      typeof window !== 'undefined'
        ? localStorage.getItem('scheme') || config.tauriCustomScheme()
        : config.tauriCustomScheme()
    if (scheme) {
      completePath = `/login/mobile/complete/${scheme}`
    }
  }

  const authorizePath =
    `/oauth2/authorize?response_type=code` +
    `&client_id=${config.ssoClientId()}` +
    `&scope=profile email` +
    `&redirect_uri=${authSpaOrigin}${completePath}`

  return `${lmsUrl}${stripped}next=${encodeURIComponent(authorizePath)}`
}

async function fetchGoogleLoginUrl(): Promise<string> {
  const response = await fetch(`${config.lmsUrl()}/api/mfe_context`, {
    credentials: 'omit',
  })
  if (!response.ok) {
    throw new Error(`Failed to load SSO providers (${response.status})`)
  }

  const data = (await response.json()) as MfeContextResponse
  const providers =
    data.context_data?.providers ?? data.contextData?.providers ?? []

  const google = providers.find(
    (provider) =>
      provider.id?.includes('google') ||
      provider.name?.toLowerCase().includes('google'),
  )

  if (!google?.loginUrl) {
    throw new Error('Google SSO provider is not configured')
  }

  return google.loginUrl
}

/** Minimal auth SPA URL — only seeds redirect-to on login.iblai.app (no visible UI). */
function buildAuthSpaSeedUrl(): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const params = new URLSearchParams({
    app: 'custom',
    'redirect-to': origin,
  })
  return `${config.authUrl()}/login?${params.toString()}`
}

/**
 * Write redirect-to into login.iblai.app localStorage without navigating the main window
 * through the auth SPA login screen.
 */
function seedAuthSpaRedirectTarget(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()

  const seedUrl = buildAuthSpaSeedUrl()

  return new Promise((resolve) => {
    const finish = () => resolve()
    const timeout = window.setTimeout(finish, 2500)

    const popup = window.open(
      seedUrl,
      'ibl_auth_seed',
      'width=1,height=1,left=-10000,top=-10000,noopener,noreferrer',
    )

    if (popup) {
      window.setTimeout(() => {
        popup.close()
        window.clearTimeout(timeout)
        finish()
      }, 600)
      return
    }

    const iframe = document.createElement('iframe')
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText =
      'position:absolute;width:0;height:0;border:0;visibility:hidden'
    iframe.onload = () => {
      window.setTimeout(() => {
        iframe.remove()
        window.clearTimeout(timeout)
        finish()
      }, 500)
    }
    document.body.appendChild(iframe)
    iframe.src = seedUrl
  })
}

async function navigateToExternalUrl(url: string): Promise<void> {
  if (isTauri()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      await invoke('open_external_url', { url })
      return
    } catch {
      // fall through to full navigation
    }
  }
  window.location.href = url
}

/** Email magic-link flow — auth SPA reads `email` and sends the verification link. */
export function startEmailLogin(email: string) {
  saveLoginRedirectPath()
  window.location.href = buildAuthSpaLoginUrl({ email: email.trim() })
}

/**
 * Google SSO — open the LMS Google OAuth URL directly (no auth SPA login UI).
 * A hidden popup seeds redirect-to on login.iblai.app so the post-OAuth handoff
 * still returns to this app via /sso-login-complete.
 */
export async function startGoogleLogin(): Promise<void> {
  if (typeof window === 'undefined') return

  saveLoginRedirectPath()

  try {
    const loginUrl = await fetchGoogleLoginUrl()
    const providerUrl = buildSsoProviderUrl(loginUrl)
    await seedAuthSpaRedirectTarget()
    await navigateToExternalUrl(providerUrl)
  } catch (error) {
    console.error('[auth] Direct Google login failed, falling back to auth SPA:', error)
    window.location.href = buildAuthSpaLoginUrl()
  }
}

/** Full SDK redirect (clears storage, syncs cookies) when a hard handoff is required. */
export async function startSdkAuthRedirect(options?: {
  logout?: boolean
  redirectTo?: string
}) {
  await sdkRedirectToAuthSpa({
    ...authSpaOptions(),
    logout: options?.logout,
    redirectTo: options?.redirectTo,
    forceRedirect: true,
  })
}
