type ChatMessageLike = {
  id: string
  role: 'user' | 'assistant' | 'system' | string
  content: string
  visible?: boolean
}

/** Match SDK thread shaping — skip leading assistant welcome message. */
export function buildChatThread(messages: ChatMessageLike[]) {
  const visible = messages.filter(
    (message) => message.visible !== false && message.role !== 'system',
  )

  if (visible.length === 0) return []

  return visible[0]?.role === 'assistant' ? visible.slice(1) : visible
}

export function splitStreamingThread(
  thread: ChatMessageLike[],
  streamingContent: string,
  isStreaming: boolean,
) {
  if (!streamingContent) {
    return { thread, streamingContent: '' }
  }

  const last = thread[thread.length - 1]
  if (last?.role === 'assistant' && (!last.content?.trim() || isStreaming)) {
    return {
      thread: thread.slice(0, -1),
      streamingContent,
    }
  }

  return { thread, streamingContent: '' }
}
