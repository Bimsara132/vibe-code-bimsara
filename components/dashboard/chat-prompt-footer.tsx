'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  selectArtifactsEnabled,
  selectSessionId,
  TOOLS,
  useMentorTools,
  useUsername,
} from '@iblai/iblai-js/web-utils'

import { buildPromptWithCanvas } from '@/lib/iblai/build-canvas-prompt'
import { upsertLocalRecentChat } from '@/lib/iblai/local-recent-chats'
import { submitSdkChatMessageWithRetry } from '@/lib/iblai/submit-sdk-chat'
import {
  triggerSdkVoiceCallWithRetry,
  triggerSdkVoiceInputWithRetry,
} from '@/lib/iblai/trigger-sdk-voice'

import { PromptInput } from './prompt-input'

type ChatPromptFooterProps = {
  mentorId: string
  tenantKey: string
}

export function ChatPromptFooter({ mentorId, tenantKey }: ChatPromptFooterProps) {
  const dispatch = useDispatch()
  const sessionId = useSelector(selectSessionId)
  const lastSentRef = useRef('')
  const artifactsEnabled = useSelector(selectArtifactsEnabled)
  const username = useUsername() ?? ''
  const { updateSessionTools } = useMentorTools({
    tenantKey,
    mentorId,
    username,
  })

  const handleSend = useCallback(
    async (text: string, options?: { useCanvas?: boolean }) => {
      const trimmed = text.trim()
      if (!trimmed) return

      lastSentRef.current = trimmed

      const useCanvas = options?.useCanvas ?? true
      if (useCanvas && sessionId && !artifactsEnabled) {
        await updateSessionTools(TOOLS.CANVAS)
      }

      const prompt = buildPromptWithCanvas(trimmed, useCanvas)
      submitSdkChatMessageWithRetry(dispatch, prompt, {
        intervalMs: 300,
        timeoutMs: 60000,
      })

      if (sessionId) {
        upsertLocalRecentChat({ id: sessionId, label: trimmed, mentorId })
      }
    },
    [artifactsEnabled, dispatch, mentorId, sessionId, updateSessionTools],
  )

  useEffect(() => {
    const label = lastSentRef.current.trim()
    if (!sessionId || !label) return

    upsertLocalRecentChat({ id: sessionId, label, mentorId })
  }, [mentorId, sessionId])

  return (
    <div className="shrink-0 bg-white/90 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] backdrop-blur-sm md:pt-4 md:pb-4">
      <PromptInput
        onSubmit={handleSend}
        onVoiceCall={() => triggerSdkVoiceCallWithRetry()}
        onVoiceInput={() => triggerSdkVoiceInputWithRetry()}
        placeholder="Ask vibe.ibl.ai to build..."
        defaultCanvasSelected
        mentorId={mentorId}
        tenantKey={tenantKey}
      />
    </div>
  )
}
