/**
 * ibl.ai auth helper utilities.
 */

import config from './config'
import { resolveAppTenant } from './tenant'

export const COMPLETING_LOGIN_MESSAGE = 'Completing login…'

export const SSO_HANDOFF_KEY = 'ibl_sso_handoff'
export const SSO_SUPPRESS_REDIRECT_KEY = 'ibl_sso_suppress_redirect'
export const SSO_REDIRECT_GRACE_UNTIL_KEY = 'ibl_sso_redirect_grace_until'
export const SSO_LOGIN_UI_KEY = 'ibl_sso_login_ui'

const SSO_REDIRECT_GRACE_MS = 30_000

export function isSsoLoginUiActive(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SSO_LOGIN_UI_KEY) === '1'
}

export function clearSsoLoginUi(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SSO_LOGIN_UI_KEY)
}

export function isSsoRedirectSuppressed(): boolean {
  if (typeof window === 'undefined') return false
  if (sessionStorage.getItem(SSO_SUPPRESS_REDIRECT_KEY) === '1') return true

  const graceUntil = Number(sessionStorage.getItem(SSO_REDIRECT_GRACE_UNTIL_KEY))
  return Number.isFinite(graceUntil) && Date.now() < graceUntil
}

export function isSsoHandoffActive(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem(SSO_SUPPRESS_REDIRECT_KEY) === '1'
}

export function clearSsoHandoffFlags() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(SSO_SUPPRESS_REDIRECT_KEY)
  sessionStorage.removeItem(SSO_HANDOFF_KEY)
}

export function clearSsoRedirectSuppression() {
  if (typeof window === 'undefined') return
  clearSsoHandoffFlags()
  sessionStorage.removeItem(SSO_REDIRECT_GRACE_UNTIL_KEY)
  clearSsoLoginUi()
}

export function getSsoRedirectGraceRemainingMs(): number {
  if (typeof window === 'undefined') return 0
  const graceUntil = Number(sessionStorage.getItem(SSO_REDIRECT_GRACE_UNTIL_KEY))
  if (!Number.isFinite(graceUntil)) return 0
  return Math.max(0, graceUntil - Date.now())
}

export function markSsoRedirectSuppression() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(SSO_HANDOFF_KEY, '1')
  sessionStorage.setItem(SSO_SUPPRESS_REDIRECT_KEY, '1')
  sessionStorage.setItem(SSO_LOGIN_UI_KEY, '1')
  sessionStorage.setItem(
    SSO_REDIRECT_GRACE_UNTIL_KEY,
    String(Date.now() + SSO_REDIRECT_GRACE_MS),
  )
}

export function isTauri(): boolean {
  if (typeof window === 'undefined') return false
  return '__TAURI_INTERNALS__' in window || '__TAURI__' in window
}

export function isTauriMobile(): boolean {
  if (!isTauri()) return false
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent)
}

function getRedirectOrigin(): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  if (isTauriMobile()) {
    const scheme = config.tauriCustomScheme()
    if (scheme) return `${scheme}://`
  }
  return origin
}

export async function redirectToAuthSpa(
  redirectTo?: string,
  platformKey?: string,
  logout?: boolean,
  saveRedirect?: boolean,
) {
  if (isSsoRedirectSuppressed()) {
    return
  }

  const redirectOrigin = getRedirectOrigin()
  const path =
    redirectTo ??
    (typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/')

  if (logout) {
    const tenant = platformKey || resolveAppTenant()
    window.location.href = `${config.authUrl()}/logout?redirect-to=${redirectOrigin}&tenant=${encodeURIComponent(tenant)}`
    return
  }

  if (saveRedirect !== false) {
    if (
      !path.startsWith('/sso-login') &&
      !path.startsWith('/sso-login-complete') &&
      !path.startsWith('/login')
    ) {
      localStorage.setItem('redirectTo', path)
    }
  }

  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export function handleAuthHttp401() {
  if (isSsoRedirectSuppressed()) return
  void redirectToAuthSpa(undefined, undefined, true)
}

export function hasNonExpiredAuthToken(): boolean {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('axd_token')
  if (!token) return false
  const expiry = localStorage.getItem('axd_token_expires')
  if (!expiry) return false
  return new Date(expiry) > new Date()
}

export function handleLogout() {
  clearSsoRedirectSuppression()
  const tenant = resolveAppTenant()
  const redirectOrigin = getRedirectOrigin()
  localStorage.clear()
  window.location.href = `${config.authUrl()}/logout?redirect-to=${redirectOrigin}&tenant=${encodeURIComponent(tenant)}`
}
