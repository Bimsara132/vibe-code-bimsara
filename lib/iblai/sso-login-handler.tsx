'use client'

import { clearAuthCookies, syncAuthToCookies } from '@iblai/iblai-js/web-utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { LocalStorageService } from '@/lib/iblai/storage-service'

const LOCAL_STORAGE_KEYS = {
  CURRENT_TENANT: 'current_tenant',
  USER_DATA: 'userData',
  TENANTS: 'tenants',
  AXD_TOKEN: 'axd_token',
  AXD_TOKEN_EXPIRES: 'axd_token_expires',
  DM_TOKEN: 'dm_token',
  DM_TOKEN_EXPIRES: 'dm_token_expires',
  EDX_TOKEN_KEY: 'edx_jwt_token',
} as const

export const SSO_HANDOFF_KEY = 'ibl_sso_handoff'
const SSO_PROCESSING_KEY = 'ibl_sso_processing'

const storageService = LocalStorageService.getInstance()

async function initializeLocalStorageWithObject(data: Record<string, string>) {
  clearAuthCookies()

  localStorage.removeItem('visiting_tenant')
  localStorage.removeItem('current_tenant')
  localStorage.removeItem('tenants')

  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })

  if (data.tenant) {
    localStorage.setItem('tenant', data.tenant)
  }

  await syncAuthToCookies(storageService)
}

type SsoLoginHandlerProps = {
  redirectPathKey?: string
  defaultRedirectPath?: string
}

export function SsoLoginHandler({
  redirectPathKey = 'redirectTo',
  defaultRedirectPath = '/app',
}: SsoLoginHandlerProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const queryParamData = searchParams.get('data')
    if (!queryParamData) return

    if (sessionStorage.getItem(SSO_PROCESSING_KEY)) return
    sessionStorage.setItem(SSO_PROCESSING_KEY, '1')

    const parsedData = JSON.parse(queryParamData) as Record<string, string>

    initializeLocalStorageWithObject(parsedData).then(() => {
      const redirectPath =
        localStorage.getItem(redirectPathKey) ||
        searchParams.get('redirect-path') ||
        defaultRedirectPath

      localStorage.removeItem(redirectPathKey)
      sessionStorage.setItem(SSO_HANDOFF_KEY, '1')
      sessionStorage.removeItem(SSO_PROCESSING_KEY)
      router.replace(redirectPath)
    })
  }, [searchParams, redirectPathKey, defaultRedirectPath, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-gray-400">Completing login…</p>
    </div>
  )
}
