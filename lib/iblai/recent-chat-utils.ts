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
