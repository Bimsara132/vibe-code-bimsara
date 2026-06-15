import {
  buildRecentChatHref,
  type RecentChatItem,
} from '@/lib/iblai/recent-chat-utils'

const STORAGE_KEY = 'vibe-recent-chats'
const MAX_LOCAL = 12
export const RECENT_CHATS_UPDATED_EVENT = 'vibe-recent-chats-updated'

type StoredRecentChat = {
  id: string
  label: string
  mentorId: string
  updatedAt: number
}

function readStored(): StoredRecentChat[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as StoredRecentChat[]
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item) =>
        typeof item.id === 'string' &&
        typeof item.label === 'string' &&
        typeof item.mentorId === 'string',
    )
  } catch {
    return []
  }
}

function writeStored(items: StoredRecentChat[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(RECENT_CHATS_UPDATED_EVENT))
}

export function upsertLocalRecentChat(input: {
  id: string
  label: string
  mentorId: string
}) {
  const label = input.label.trim()
  if (!input.id || !input.mentorId || !label) return

  const next: StoredRecentChat = {
    id: input.id,
    label: label.length <= 52 ? label : `${label.slice(0, 52)}…`,
    mentorId: input.mentorId,
    updatedAt: Date.now(),
  }

  const items = readStored().filter((item) => item.id !== next.id)
  items.unshift(next)
  writeStored(items.slice(0, MAX_LOCAL))
}

export function listLocalRecentChatItems(limit: number): Array<
  RecentChatItem & { updatedAt: number }
> {
  return readStored()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      label: item.label,
      mentorId: item.mentorId,
      href: buildRecentChatHref(item.id, item.mentorId),
      updatedAt: item.updatedAt,
    }))
}

export function mergeRecentChatSources(
  sources: Array<RecentChatItem & { updatedAt?: number }>,
  limit: number,
): RecentChatItem[] {
  const byId = new Map<string, RecentChatItem & { updatedAt: number }>()

  for (const item of sources) {
    const existing = byId.get(item.id)
    const updatedAt = item.updatedAt ?? existing?.updatedAt ?? 0
    byId.set(item.id, {
      id: item.id,
      label: item.label || existing?.label || 'Untitled chat',
      mentorId: item.mentorId,
      href: item.href || buildRecentChatHref(item.id, item.mentorId),
      updatedAt: Math.max(updatedAt, existing?.updatedAt ?? 0),
    })
  }

  return Array.from(byId.values())
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit)
    .map(({ id, label, mentorId, href }) => ({ id, label, mentorId, href }))
}
