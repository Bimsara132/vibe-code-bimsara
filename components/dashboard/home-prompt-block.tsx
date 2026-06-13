'use client'

import { useState } from 'react'

import { PromptInput } from './prompt-input'
import { PromptSuggestions } from './prompt-suggestions'

type HomePromptBlockProps = {
  onSend?: (message: string, options?: { useCanvas?: boolean }) => void
}

export function HomePromptBlock({ onSend }: HomePromptBlockProps) {
  const [promptValue, setPromptValue] = useState('')

  return (
    <div className="flex w-full flex-col gap-5 md:gap-6">
      <div className="mx-auto w-full max-w-[720px]">
        <PromptInput
          value={promptValue}
          onValueChange={setPromptValue}
          onSubmit={onSend}
          placeholder="Ask vibe.ibl.ai to build..."
          defaultCanvasSelected
        />
      </div>
      <PromptSuggestions onSelect={setPromptValue} />
    </div>
  )
}
