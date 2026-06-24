'use client'

import { useEffect, useState } from 'react'

import config from '@/lib/iblai/config'

type Status = 'working' | 'success' | 'error'

export function GoogleOAuthCallbackHandler() {
  const [status, setStatus] = useState<Status>('working')
  const [message, setMessage] = useState('Completing connection...')

  useEffect(() => {
    let cancelled = false

    async function completeOAuth() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const state = params.get('state')
      const error = params.get('error')

      if (error) {
        setStatus('error')
        setMessage('Authorization was cancelled or denied.')
        return
      }

      if (!code || !state) {
        setStatus('error')
        setMessage('Missing authorization parameters.')
        return
      }

      const token = localStorage.getItem('axd_token')?.trim()
      if (!token) {
        setStatus('error')
        setMessage('Session expired. Sign in and try connecting again.')
        return
      }

      try {
        const query = new URLSearchParams({ code, state })
        const response = await fetch(
          `${config.dmUrl()}/api/ai-account/connected-services/callback/?${query}`,
          { headers: { Authorization: `Token ${token}` } },
        )

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as {
            detail?: string
          }
          throw new Error(body.detail ?? `Request failed (${response.status})`)
        }

        const data = (await response.json()) as {
          id: number
          provider: string
          service: string
        }

        const payload = {
          connectedServiceId: data.id,
          provider: data.provider,
          serviceName: data.service,
        }

        localStorage.setItem('oauth_connection_complete', JSON.stringify(payload))

        if (window.opener) {
          window.opener.postMessage(
            { type: 'GOOGLE_AUTH_SUCCESS', ...payload },
            window.location.origin,
          )
        }

        if (!cancelled) {
          setStatus('success')
          setMessage('Connected successfully. You can close this window.')
        }

        if (window.opener) {
          window.setTimeout(() => window.close(), 800)
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setMessage(err instanceof Error ? err.message : 'Connection failed.')
        }
      }
    }

    void completeOAuth()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="max-w-sm text-center">
        <p className="text-[15px] font-medium text-neutral-900">{message}</p>
        {status === 'success' ? (
          <p className="mt-2 text-[13px] text-neutral-500">Returning to Connectors...</p>
        ) : null}
      </div>
    </main>
  )
}
