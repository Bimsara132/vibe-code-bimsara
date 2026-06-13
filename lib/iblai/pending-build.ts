const STORAGE_KEY = 'vibe-pending-build'

export type PendingBuild = {
  nonce: string
  prompt: string
  useCanvas: boolean
}

export function savePendingBuild(build: PendingBuild) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(build))
}

export function readPendingBuild(nonce: string | null): PendingBuild | null {
  if (!nonce) return null

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as PendingBuild
    if (parsed.nonce === nonce) return parsed
  } catch {
    return null
  }

  return null
}

export function clearPendingBuild(nonce: string) {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw) as PendingBuild
    if (parsed.nonce === nonce) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
