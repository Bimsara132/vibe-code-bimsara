/**
 * ibl.ai runtime configuration.
 *
 * Supports two modes:
 *   1. Consolidated API (recommended): set NEXT_PUBLIC_API_BASE_URL to a
 *      single origin (e.g. https://api.iblai.app). LMS, DM, and AXD
 *      endpoints are derived as /lms, /dm, /axd path prefixes.
 *   2. Distributed: set NEXT_PUBLIC_PLATFORM_BASE_DOMAIN and each service
 *      resolves to its own subdomain (learn.{domain}, base.manager.{domain}).
 *
 * Priority: runtime window.__ENV__ → build-time process.env → fallback.
 */

const env = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  NEXT_PUBLIC_BASE_WS_URL: process.env.NEXT_PUBLIC_BASE_WS_URL,
  NEXT_PUBLIC_PLATFORM_BASE_DOMAIN:
    process.env.NEXT_PUBLIC_PLATFORM_BASE_DOMAIN,
  NEXT_PUBLIC_MAIN_TENANT_KEY: process.env.NEXT_PUBLIC_MAIN_TENANT_KEY,
  NEXT_PUBLIC_DEFAULT_AGENT_ID: process.env.NEXT_PUBLIC_DEFAULT_AGENT_ID,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_TAURI_CUSTOM_SCHEME: process.env.NEXT_PUBLIC_TAURI_CUSTOM_SCHEME,
  NEXT_PUBLIC_IBL_SSO_CLIENT_ID: process.env.NEXT_PUBLIC_IBL_SSO_CLIENT_ID,
}

declare global {
  interface Window {
    __ENV__?: Record<string, string>
  }
}

const runtimeEnv = () =>
  typeof window !== 'undefined' ? window.__ENV__ || {} : {}

const getEnv = (key: keyof typeof env, fallback = ''): string =>
  runtimeEnv()[key] ?? env[key] ?? fallback

const domain = () =>
  getEnv('NEXT_PUBLIC_PLATFORM_BASE_DOMAIN', 'iblai.app')

const config = {
  authUrl: () => getEnv('NEXT_PUBLIC_AUTH_URL', `https://login.${domain()}`),

  /** OAuth client used by login.iblai.app for Google / Apple SSO handoff. */
  ssoClientId: () =>
    getEnv(
      'NEXT_PUBLIC_IBL_SSO_CLIENT_ID',
      'lXQ7MrnumvXXb79zgIwdpcovRRqE4OzyOOUXKdVs',
    ),

  lmsUrl: () => {
    const apiBase = getEnv('NEXT_PUBLIC_API_BASE_URL')
    if (apiBase) return `${apiBase}/lms`
    return `https://learn.${domain()}`
  },

  dmUrl: () => {
    const apiBase = getEnv('NEXT_PUBLIC_API_BASE_URL')
    if (apiBase) return `${apiBase}/dm`
    return `https://base.manager.${domain()}`
  },

  axdUrl: () => {
    const apiBase = getEnv('NEXT_PUBLIC_API_BASE_URL')
    if (apiBase) return `${apiBase}/axd`
    return `https://base.manager.${domain()}`
  },

  baseWsUrl: () =>
    getEnv('NEXT_PUBLIC_BASE_WS_URL', `wss://asgi.data.${domain()}`),

  wsUrl: () =>
    getEnv('NEXT_PUBLIC_BASE_WS_URL', `wss://asgi.data.${domain()}`),

  mainTenantKey: () => getEnv('NEXT_PUBLIC_MAIN_TENANT_KEY', ''),
  defaultAgentId: () => getEnv('NEXT_PUBLIC_DEFAULT_AGENT_ID', ''),
  supportEmail: () => getEnv('NEXT_PUBLIC_SUPPORT_EMAIL', 'support@ibl.ai'),
  tauriCustomScheme: () => getEnv('NEXT_PUBLIC_TAURI_CUSTOM_SCHEME', ''),
  platformBaseDomain: () => domain(),
}

export default config
export { getEnv }
