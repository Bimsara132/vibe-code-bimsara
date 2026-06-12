'use client'

import { useEffect, useState } from 'react'

export type IblaiUser = {
  username: string
  displayName: string
  email: string
  initials: string
}

export function formatDisplayName(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return trimmed

  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.trim()
  if (!source) return '?'

  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

function readUserFromStorage(): IblaiUser {
  if (typeof window === 'undefined') {
    return { username: '', displayName: '', email: '', initials: '?' }
  }

  try {
    const raw = localStorage.getItem('userData')
    if (!raw) return { username: '', displayName: '', email: '', initials: '?' }

    const parsed = JSON.parse(raw) as Record<string, string>
    const username = parsed.user_nicename ?? parsed.username ?? ''
    const displayName = formatDisplayName(
      parsed.user_nicename ?? parsed.username ?? parsed.display_name ?? '',
    )
    const email = parsed.user_email ?? parsed.email ?? ''

    return {
      username,
      displayName,
      email,
      initials: getInitials(displayName, email),
    }
  } catch {
    return { username: '', displayName: '', email: '', initials: '?' }
  }
}

export function useIblaiUser(): IblaiUser {
  const [user, setUser] = useState<IblaiUser>(() => readUserFromStorage())

  useEffect(() => {
    setUser(readUserFromStorage())

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'userData' || event.key === null) {
        setUser(readUserFromStorage())
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return user
}
