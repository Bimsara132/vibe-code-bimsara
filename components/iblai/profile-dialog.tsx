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
  const { email } = useIblaiUser()

  const session = useMemo(() => {
    if (!profileOpen) {
      return {
        tenantKey: '',
        tenants: [] as ReturnType<typeof readTenants>,
        isAdmin: false,
      }
    }

    const tenantKey = resolveAppTenant()
    const tenants = readTenants()
    const match = tenants.find((tenant) => tenant.key === tenantKey)

    return {
      tenantKey,
      tenants,
      isAdmin: !!match?.is_admin,
    }
  }, [profileOpen])

  if (!session.tenantKey) return null

  return (
    <UserProfileModal
      isOpen={profileOpen}
      onClose={() => setProfileOpen(false)}
      params={{
        tenantKey: session.tenantKey,
        isAdmin: session.isAdmin,
      }}
      email={email}
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
