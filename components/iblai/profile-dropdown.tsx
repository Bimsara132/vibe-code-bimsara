'use client'

/**
 * ibl.ai Profile Dropdown — SDK avatar menu with profile, tenant switch, logout.
 */

import { UserProfileDropdown } from '@iblai/iblai-js/web-containers/next'
import { useMemo } from 'react'

import { handleLogout, redirectToAuthSpa } from '@/lib/iblai/auth-utils'
import config from '@/lib/iblai/config'
import { resolveAppTenant } from '@/lib/iblai/tenant'

type ProfileDropdownProps = {
  className?: string
}

export function ProfileDropdown({ className }: ProfileDropdownProps) {
  const username = useMemo(() => {
    if (typeof window === 'undefined') return ''
    try {
      const raw = localStorage.getItem('userData')
      return raw ? (JSON.parse(raw).user_nicename ?? '') : ''
    } catch {
      return ''
    }
  }, [])

  const tenantKey = useMemo(() => resolveAppTenant(), [])

  const userTenants = useMemo(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('tenants')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  const isAdmin = useMemo(() => {
    if (typeof window === 'undefined' || !tenantKey) return false
    try {
      const match = userTenants.find(
        (tenant: { key?: string }) => tenant.key === tenantKey,
      )
      return !!match?.is_admin
    } catch {
      return false
    }
  }, [tenantKey, userTenants])

  return (
    <UserProfileDropdown
      username={username}
      tenantKey={tenantKey}
      userIsAdmin={isAdmin}
      userTenants={userTenants}
      showProfileTab
      showAccountTab={false}
      showTenantSwitcher
      showHelpLink={false}
      showLogoutButton
      authURL={config.authUrl()}
      onLogout={handleLogout}
      onTenantChange={(tenant: string) => {
        localStorage.setItem('app_tenant', tenant)
        localStorage.setItem('tenant', tenant)
        redirectToAuthSpa(undefined, tenant, false, true)
      }}
      onTenantUpdate={(tenant: { key?: string }) => {
        if (tenant?.key) {
          localStorage.setItem('app_tenant', tenant.key)
          localStorage.setItem('tenant', tenant.key)
        }
      }}
      className={className}
    />
  )
}
