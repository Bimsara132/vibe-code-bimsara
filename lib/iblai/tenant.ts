/**
 * Tenant resolution for ibl.ai apps.
 */

import config from '@/lib/iblai/config'

const PLACEHOLDER_PLATFORMS = new Set([
  'your-main-platform',
  'your-platform',
  'your-tenant',
  'your-tenant-key',
  'test-tenant',
  'main',
  '',
])

export function resolveAppTenant(): string {
  if (typeof window === 'undefined') return ''

  const appTenant = localStorage.getItem('app_tenant')
  if (appTenant) return appTenant

  const envTenant = config.mainTenantKey()
  if (envTenant && !PLACEHOLDER_PLATFORMS.has(envTenant)) {
    localStorage.setItem('app_tenant', envTenant)
    return envTenant
  }

  const sdkTenant = localStorage.getItem('tenant')
  if (sdkTenant) {
    localStorage.setItem('app_tenant', sdkTenant)
    return sdkTenant
  }

  return ''
}

export function checkTenantMismatch(): boolean {
  if (typeof window === 'undefined') return false

  const appTenant = resolveAppTenant()
  const sdkTenant = localStorage.getItem('tenant') ?? ''

  if (appTenant && sdkTenant && sdkTenant !== appTenant) {
    import('./auth-utils').then(({ redirectToAuthSpa }) => {
      redirectToAuthSpa(undefined, appTenant, false, false)
    })
    return true
  }
  return false
}
