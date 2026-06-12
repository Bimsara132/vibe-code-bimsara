'use client'

import { Suspense } from 'react'

import { SsoLoginHandler } from '@/lib/iblai/sso-login-handler'

function SsoLoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <p className="text-sm text-gray-400">Completing login…</p>
    </div>
  )
}

export default function SsoLoginCompletePage() {
  return (
    <Suspense fallback={<SsoLoginFallback />}>
      <SsoLoginHandler defaultRedirectPath="/app" redirectPathKey="redirectTo" />
    </Suspense>
  )
}
