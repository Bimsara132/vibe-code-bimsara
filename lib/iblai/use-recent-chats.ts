'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCachedSessionId } from '@iblai/iblai-js/web-utils'

import {
  listLocalRecentChatItems,
  mergeRecentChatSources,
  RECENT_CHATS_UPDATED_EVENT,
} from '@/lib/iblai/local-recent-chats'
import {
  buildRecentChatHref,
  type RecentChatItem,
} from '@/lib/iblai/recent-chat-utils'
import { useDefaultMentorId } from '@/lib/iblai/use-default-mentor'

const RECENT_CHAT_LIMIT = 8

export type { RecentChatItem } from '@/lib/iblai/recent-chat-utils'
export { buildRecentChatHref } from '@/lib/iblai/recent-chat-utils'

export function useRecentChats() {
  const { mentorId, isLoading: isMentorLoading } = useDefaultMentorId()
  const [cachedSessionId] = useCachedSessionId()
  const [localVersion, setLocalVersion] = useState(0)

  useEffect(() => {
    const onUpdate = () => setLocalVersion((version) => version + 1)
    window.addEventListener(RECENT_CHATS_UPDATED_EVENT, onUpdate)
    return () => window.removeEventListener(RECENT_CHATS_UPDATED_EVENT, onUpdate)
  }, [])

  const items = useMemo(() => {
    const localItems = listLocalRecentChatItems(RECENT_CHAT_LIMIT)

    const cachedItems = Object.entries(cachedSessionId ?? {})
      .filter(([, sessionId]) => Boolean(sessionId))
      .map(([cachedMentorId, sessionId]) => ({
        id: sessionId,
        label: 'Untitled chat',
        mentorId: cachedMentorId,
        href: buildRecentChatHref(sessionId, cachedMentorId),
        updatedAt: 0,
      }))

    const preferredMentorItems =
      mentorId && cachedSessionId?.[mentorId]
        ? [
            {
              id: cachedSessionId[mentorId],
              label: 'Untitled chat',
              mentorId,
              href: buildRecentChatHref(cachedSessionId[mentorId], mentorId),
              updatedAt: Date.now(),
            },
          ]
        : []

    return mergeRecentChatSources(
      [...localItems, ...preferredMentorItems, ...cachedItems],
      RECENT_CHAT_LIMIT,
    )
  }, [cachedSessionId, localVersion, mentorId])

  return {
    items,
    isLoading: isMentorLoading,
  }
}
