import { SsoLoginHandler } from '@/lib/iblai/sso-login-handler'

export const dynamic = 'force-dynamic'

export default function SsoLoginCompletePage() {
  return (
    <SsoLoginHandler defaultRedirectPath="/app" redirectPathKey="redirectTo" />
  )
}
