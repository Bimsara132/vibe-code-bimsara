import { SsoLoginHandler } from '@/lib/iblai/sso-login-handler'

export default function SsoLoginCompletePage() {
  return (
    <SsoLoginHandler defaultRedirectPath="/app" redirectPathKey="redirectTo" />
  )
}
