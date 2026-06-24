'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  selectActiveChatMessages,
  selectCurrentStreamingArtifact,
  selectCurrentStreamingMessage,
  selectIsError,
  selectIsPending,
  selectIsTyping,
  selectStreaming,
  selectStreamingArtifactContentBuffer,
} from '@iblai/iblai-js/web-utils'

import { buildChatThread, splitStreamingThread } from '@/lib/iblai/chat-thread'
import { displayChatContent } from '@/lib/iblai/display-chat-content'
import { cn } from '@/lib/utils'

type ChatMessageLike = {
  id: string
  role: string
  content: string
  artifactVersions?: Array<{ title?: string; is_current?: boolean }>
}

function formatChatTimestamp(date: Date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function scrollToBottom(element: HTMLDivElement | null) {
  if (!element) return
  requestAnimationFrame(() => {
    element.scrollTop = element.scrollHeight
  })
}

function ThinkingBubble({ detail }: { detail?: string }) {
  return (
    <div className="w-full max-w-full rounded-lg border border-ibl-soft-border bg-ibl-soft px-4 py-3 text-sm md:text-base">
      <p className="font-medium text-ibl">Working...</p>
      <p className="mt-1 text-ibl-muted">
        {detail ?? 'Designing your project — this may take a moment.'}
      </p>
    </div>
  )
}

function CanvasArtifactCard({ title }: { title: string }) {
  return (
    <div className="w-full max-w-full rounded-lg border border-ibl-soft-border bg-ibl-soft px-4 py-3 text-sm text-ibl-neutral md:text-base">
      <p className="font-medium text-ibl">{title}</p>
      <p className="mt-1 text-ibl-muted">
        Your prototype is building in Canvas — it will open automatically when ready.
      </p>
    </div>
  )
}

function getArtifactTitle(message: ChatMessageLike) {
  const versions = message.artifactVersions
  if (!versions?.length) return null

  const current = versions.find((version) => version.is_current) ?? versions[0]
  const title = current?.title?.trim()
  return title || 'Canvas prototype'
}

function messageHasArtifact(message: ChatMessageLike) {
  return Boolean(message.artifactVersions?.length)
}

function hasAssistantReply(messages: ChatMessageLike[]) {
  return messages.some(
    (message) =>
      message.role === 'assistant' &&
      (displayChatContent(message.content).trim().length > 0 ||
        messageHasArtifact(message)),
  )
}

type ChatMessageListProps = {
  className?: string
  initialPrompt?: string
  isRestoringSession?: boolean
}

export function ChatMessageList({
  className,
  initialPrompt = '',
  isRestoringSession = false,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const startedAtRef = useRef(new Date())
  const restoringStartedAtRef = useRef<number | null>(null)
  const [restoreTimedOut, setRestoreTimedOut] = useState(false)

  const messages = useSelector(selectActiveChatMessages)
  const isStreaming = useSelector(selectStreaming)
  const isPending = useSelector(selectIsPending)
  const isTyping = useSelector(selectIsTyping)
  const isError = useSelector(selectIsError)
  const streamingMessage = useSelector(selectCurrentStreamingMessage)
  const streamingArtifact = useSelector(selectCurrentStreamingArtifact)
  const streamingArtifactBuffer = useSelector(selectStreamingArtifactContentBuffer)
  const [pendingTimedOut, setPendingTimedOut] = useState(false)

  const thread = useMemo(() => buildChatThread(messages), [messages])

  const streamingContent = streamingMessage?.content?.trim() ?? ''
  const { thread: threadForRender, streamingContent: liveStream } = useMemo(
    () => splitStreamingThread(thread, streamingContent, isStreaming),
    [isStreaming, streamingContent, thread],
  )

  const pendingPrompt = initialPrompt.trim()
  const hasUserMessage = threadForRender.some((message) => message.role === 'user')
  const showPendingUser = Boolean(pendingPrompt) && !hasUserMessage

  const isGenerating = isPending || isStreaming || isTyping
  const artifactStreamTitle =
    streamingArtifact?.title?.trim() ||
    (streamingArtifactBuffer?.trim() ? 'Canvas prototype' : '')

  const awaitingAssistant =
    !liveStream &&
    !artifactStreamTitle &&
    !hasAssistantReply(threadForRender) &&
    (hasUserMessage || (showPendingUser && isGenerating))

  const lastMessage = threadForRender[threadForRender.length - 1]
  const lastRole = lastMessage?.role
  const lastIsEmptyAssistant =
    lastMessage?.role === 'assistant' &&
    !displayChatContent(lastMessage.content).trim() &&
    !messageHasArtifact(lastMessage)

  const showThinking =
    !liveStream &&
    !artifactStreamTitle &&
    !isError &&
    !pendingTimedOut &&
    awaitingAssistant &&
    (isGenerating || lastRole === 'user' || lastIsEmptyAssistant)

  useEffect(() => {
    if (!isGenerating || liveStream || hasAssistantReply(threadForRender)) {
      setPendingTimedOut(false)
      return
    }

    const timer = window.setTimeout(() => setPendingTimedOut(true), 90000)
    return () => window.clearTimeout(timer)
  }, [isGenerating, liveStream, threadForRender])

  const showLoading =
    isRestoringSession &&
    threadForRender.length === 0 &&
    !showPendingUser &&
    !liveStream &&
    !artifactStreamTitle &&
    !isGenerating &&
    !restoreTimedOut

  useEffect(() => {
    if (!isRestoringSession) {
      restoringStartedAtRef.current = null
      setRestoreTimedOut(false)
      return
    }

    if (threadForRender.length > 0 || showPendingUser || liveStream || artifactStreamTitle) {
      setRestoreTimedOut(false)
      return
    }

    if (!restoringStartedAtRef.current) {
      restoringStartedAtRef.current = Date.now()
    }

    const timer = window.setTimeout(() => {
      setRestoreTimedOut(true)
    }, 10000)

    return () => window.clearTimeout(timer)
  }, [
    artifactStreamTitle,
    isRestoringSession,
    liveStream,
    showPendingUser,
    threadForRender.length,
  ])

  useEffect(() => {
    scrollToBottom(scrollRef.current)
  }, [
    threadForRender,
    liveStream,
    artifactStreamTitle,
    showThinking,
    showPendingUser,
    showLoading,
  ])

  const hasContent =
    threadForRender.length > 0 ||
    showThinking ||
    showPendingUser ||
    Boolean(liveStream) ||
    Boolean(artifactStreamTitle) ||
    showLoading ||
    restoreTimedOut ||
    isError ||
    pendingTimedOut

  return (
    <div
      ref={scrollRef}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white',
        className,
      )}
    >
      <div className="flex flex-col gap-6 py-6 md:py-8">
        {hasContent ? (
          <p className="text-center text-xs text-neutral-400">
            {formatChatTimestamp(startedAtRef.current)}
          </p>
        ) : null}

        {showLoading ? (
          <div className="flex justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-2 border-ibl-soft-border border-t-ibl" />
          </div>
        ) : null}

        {restoreTimedOut ? (
          <div className="w-full max-w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-ibl-neutral md:text-base">
            This chat is taking longer than expected to load. Try refreshing the
            page or starting a new chat.
          </div>
        ) : null}

        {showPendingUser ? (
          <div className="flex justify-end">
            <div className="max-w-[min(85%,28rem)] rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-ibl-neutral md:text-base">
              {displayChatContent(pendingPrompt)}
            </div>
          </div>
        ) : null}

        {threadForRender.map((message) => {
          if (message.role === 'user') {
            return (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[min(85%,28rem)] rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-ibl-neutral md:text-base">
                  {displayChatContent(message.content)}
                </div>
              </div>
            )
          }

          const assistantContent = displayChatContent(message.content)
          const artifactTitle = getArtifactTitle(message)

          if (!assistantContent.trim() && artifactTitle) {
            return <CanvasArtifactCard key={message.id} title={artifactTitle} />
          }

          if (!assistantContent.trim() && isGenerating) {
            return <ThinkingBubble key={message.id} />
          }

          if (!assistantContent.trim()) {
            return null
          }

          return (
            <div
              key={message.id}
              className="w-full max-w-full rounded-lg border border-ibl-soft-border bg-ibl-soft px-4 py-3 text-sm text-ibl-neutral md:text-base"
            >
              <p className="whitespace-pre-wrap break-words">{assistantContent}</p>
            </div>
          )
        })}

        {liveStream ? (
          <div className="w-full max-w-full rounded-lg border border-ibl-soft-border bg-ibl-soft px-4 py-3 text-sm text-ibl-neutral md:text-base">
            <p className="whitespace-pre-wrap break-words">{liveStream}</p>
          </div>
        ) : null}

        {artifactStreamTitle && !liveStream ? (
          <ThinkingBubble
            detail={`Building ${artifactStreamTitle} in Canvas — hang tight while the preview generates.`}
          />
        ) : null}

        {showThinking && !lastIsEmptyAssistant ? <ThinkingBubble /> : null}

        {isError ? (
          <div className="w-full max-w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 md:text-base">
            Something went wrong while generating a response. Try sending your
            message again.
          </div>
        ) : null}

        {pendingTimedOut && !isError && !liveStream ? (
          <div className="w-full max-w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 md:text-base">
            This is taking longer than expected. Try sending your message again.
          </div>
        ) : null}
      </div>
    </div>
  )
}
