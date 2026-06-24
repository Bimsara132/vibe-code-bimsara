'use client'

import { useAxdToken } from '@iblai/iblai-js/web-utils'
import { useSyncExternalStore } from 'react'

function readAxdTokenFromStorage() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('axd_token')?.trim() ?? ''
}

function subscribeToAxdToken(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === 'axd_token') onStoreChange()
  }

  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

/** Hook token + direct localStorage read (useLocalStorage can lag one render). */
export function useResolvedAxdToken() {
  const hookToken = useAxdToken()
  const storageToken = useSyncExternalStore(
    subscribeToAxdToken,
    readAxdTokenFromStorage,
    () => '',
  )

  return hookToken?.trim() || storageToken
}
