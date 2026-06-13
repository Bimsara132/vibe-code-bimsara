'use client'

import { UserProfileModal } from '@iblai/iblai-js/web-containers/next'
import { useMemo } from 'react'

import { useOnyxUI } from '@/components/onyx-shell-context'
import config from '@/lib/iblai/config'
import { resolveAppTenant } from '@/lib/iblai/tenant'
import { readTenants } from '@/lib/iblai/read-tenants'
import { useIblaiUser } from '@/lib/iblai/use-iblai-user'

export function ProfileDialog() {
  const { profileOpen, setProfileOpen } = useOnyxUI()
  const { email, username } = useIblaiUser()

  const session = useMemo(() => {
    if (!profileOpen) return null

    const tenantKey = resolveAppTenant()
    if (!tenantKey) return null

    const tenants = readTenants()
    const match = tenants.find((tenant) => tenant.key === tenantKey)

    return {
      tenantKey,
      tenants,
      isAdmin: !!match?.is_admin,
    }
  }, [profileOpen])

  if (!profileOpen || !session || !username) return null

  return (
    <UserProfileModal
      isOpen
      onClose={() => setProfileOpen(false)}
      params={{
        tenantKey: session.tenantKey,
        isAdmin: session.isAdmin,
      }}
      email={email ?? ''}
      mainPlatformKey={config.mainTenantKey() || session.tenantKey}
      tenants={session.tenants}
      authURL={config.authUrl()}
      useGravatarPicFallback
      targetTab="basic"
      currentPlatformBaseDomain={config.platformBaseDomain()}
      onTenantUpdate={(tenant) => {
        if (tenant?.key) {
          localStorage.setItem('app_tenant', tenant.key)
          localStorage.setItem('tenant', tenant.key)
        }
      }}
    />
  )
}
