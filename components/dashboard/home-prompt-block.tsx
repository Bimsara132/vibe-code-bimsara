'use client'

import { useState } from 'react'

import { useDefaultMentorId } from '@/lib/iblai/use-default-mentor'
import { resolveAppTenant } from '@/lib/iblai/tenant'

import { PromptInput } from './prompt-input'
import { PromptSuggestions } from './prompt-suggestions'

type HomePromptBlockProps = {
  onSend?: (message: string, options?: { useCanvas?: boolean }) => void
  onVoiceCall?: () => void
  onVoiceInput?: () => void
}

export function HomePromptBlock({
  onSend,
  onVoiceCall,
  onVoiceInput,
}: HomePromptBlockProps) {
  const [promptValue, setPromptValue] = useState('')
  const { mentorId } = useDefaultMentorId()
  const tenantKey = resolveAppTenant()

  return (
    <div className="flex w-full flex-col gap-5 md:gap-6">
      <div className="mx-auto w-full max-w-[720px]">
        <PromptInput
          value={promptValue}
          onValueChange={setPromptValue}
          onSubmit={onSend}
          onVoiceCall={onVoiceCall}
          onVoiceInput={onVoiceInput}
          placeholder="Ask vibe.ibl.ai to build..."
          defaultCanvasSelected
          mentorId={mentorId}
          tenantKey={tenantKey}
        />
      </div>
      <PromptSuggestions onSelect={setPromptValue} />
    </div>
  )
}
