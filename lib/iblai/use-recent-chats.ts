'use client'

import { useGetChatHistoryQuery } from '@iblai/iblai-js/data-layer'
import { useUsername } from '@iblai/iblai-js/web-utils'

import { resolveAppTenant } from '@/lib/iblai/tenant'

const RECENT_CHAT_LIMIT = 8

export type RecentChatItem = {
  id: string
  label: string
  mentorId: string
  href: string
}

export function buildRecentChatHref(sessionId: string, mentorId?: string) {
  const params = new URLSearchParams({ session: sessionId })
  if (mentorId) params.set('mentor', mentorId)
  return `/app?${params.toString()}`
}

function formatRecentChatLabel(messages: string | undefined) {
  const trimmed = messages?.trim()
  if (!trimmed) return 'Untitled chat'
  if (trimmed.length <= 52) return trimmed
  return `${trimmed.slice(0, 52)}…`
}

export function useRecentChats() {
  const tenantKey = resolveAppTenant()
  const username = useUsername() ?? ''

  const { data, isLoading, isFetching } = useGetChatHistoryQuery(
    {
      org: tenantKey,
      // @ts-expect-error userId is required by the API but omitted from generated types
      userId: username,
      filterUserId: username,
      page: 1,
      pageSize: RECENT_CHAT_LIMIT,
    },
    { skip: !tenantKey || !username },
  )

  const items: RecentChatItem[] =
    data?.results?.map((conversation) => ({
      id: conversation.id,
      label: formatRecentChatLabel(conversation.messages),
      mentorId: conversation.mentor,
      href: buildRecentChatHref(conversation.id, conversation.mentor),
    })) ?? []

  return {
    items,
    isLoading: isLoading || isFetching,
  }
}
