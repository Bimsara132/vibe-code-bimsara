import type { Metadata } from 'next'

import { VibeLoginPage } from '@/components/auth/vibe-login-page'
import { LOGIN_BRAND } from '@/lib/iblai/login-brand'

export const metadata: Metadata = {
  title: LOGIN_BRAND.pageTitle,
}

export default function LoginRoute() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <VibeLoginPage />
    </div>
  )
}
