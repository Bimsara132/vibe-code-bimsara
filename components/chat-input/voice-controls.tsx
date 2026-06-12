'use client'

import { ArrowUp, Mic } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VoiceControlsProps {
  isRecording?: boolean
  onVoiceInput?: () => void
  onPhoneCallClick?: () => void
}

export function VoiceControls({
  isRecording = false,
  onVoiceInput,
  onPhoneCallClick,
}: VoiceControlsProps) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          'size-8 h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:border hover:border-ibl-soft-border hover:bg-ibl-soft md:size-9 md:h-9 md:w-9',
          isRecording && 'border border-ibl-soft-border bg-ibl-soft text-ibl',
        )}
        aria-label="Voice input"
        onClick={onVoiceInput}
      >
        <Mic
          className={cn(
            'size-3.5 md:size-4',
            isRecording ? 'text-ibl' : 'text-gray-400',
          )}
        />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="mr-0.5 size-8 h-8 w-8 shrink-0 rounded-lg text-gray-400 hover:border hover:border-ibl-soft-border hover:bg-ibl-soft md:mr-1 md:size-9 md:h-9 md:w-9"
        aria-label="Voice call"
        onClick={onPhoneCallClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="scale-110 text-gray-400 md:scale-125"
          aria-hidden="true"
        >
          <path d="M280-240v-480h80v480h-80ZM440-80v-800h80v800h-80ZM120-400v-160h80v160h-80Zm480 160v-480h80v480h-80Zm160-160v-160h80v160h-80Z" />
        </svg>
      </Button>
      <Button
        type="submit"
        size="icon"
        className="chat-submit-message-button size-8 h-8 w-8 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#93C5FD] shadow-xs hover:opacity-90 md:size-9 md:h-9 md:w-9"
        aria-label="Send message"
      >
        <ArrowUp className="size-4 text-white md:size-5" aria-hidden="true" />
      </Button>
    </div>
  )
}
