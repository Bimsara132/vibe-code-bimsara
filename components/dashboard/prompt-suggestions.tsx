'use client'

import { cn } from '@/lib/utils'

const STARTER_PROMPTS = [
  'A habit tracker with streaks and gentle reminders',
  'A reading list with notes, highlights, and quotes',
  'A simple budget tracker that visualizes monthly spend',
  'A meal planner that generates a weekly grocery list',
  'A personal portfolio with project write-ups and a blog',
  'A travel itinerary planner with day-by-day schedule',
] as const

type PromptSuggestionsProps = {
  onSelect: (prompt: string) => void
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div
      className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3.5"
      role="list"
      aria-label="Suggested prompts"
    >
      {STARTER_PROMPTS.map((prompt, index) => (
        <div
          key={prompt}
          className={cn(
            'flex min-w-0 w-full justify-center',
            index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start',
          )}
        >
          <button
            type="button"
            role="listitem"
            onClick={() => onSelect(prompt)}
            className="inline-flex max-w-full min-w-0 rounded-[8px] border border-black/[0.06] bg-white/75 px-4 py-2.5 text-left text-[13px] leading-snug whitespace-normal text-[#5c5c5c] shadow-[0_0_0_0.5px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[6px] transition-[background-color,border-color,box-shadow] duration-200 hover:border-black/[0.08] hover:bg-white/90 hover:text-[#454545] hover:shadow-[0_0_0_0.5px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.03)] md:px-5 md:text-sm"
          >
            {prompt}
          </button>
        </div>
      ))}
    </div>
  )
}
