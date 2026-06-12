'use client'

import { useCallback, useRef, useState } from 'react'

import { useIblaiUser, formatDisplayName } from '@/lib/iblai/use-iblai-user'

import { ConnectToolsButton } from './connect-tools-button'
import { LovableBackground } from './lovable-background'
import { PromptInput } from './prompt-input'
import { ProjectPanel } from './project-panel'

export function MainContent() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const [scrollY, setScrollY] = useState(0)
  const { displayName, email } = useIblaiUser()
  const greetingName =
    displayName ||
    (email.split('@')[0] ? formatDisplayName(email.split('@')[0]) : '') ||
    'there'

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(scrollRef.current?.scrollTop ?? 0)
    })
  }, [])

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden py-0 md:py-[10px]"
    >
      <LovableBackground scrollY={scrollY} />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-none px-0 md:rounded-[10px] md:px-8"
      >
        <div className="relative flex min-h-full w-full flex-col pt-6 md:pt-0">
          <div
            id="create-form-1"
            className="relative z-10 flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col items-center px-4 md:min-h-[800px] md:flex-none md:justify-center md:px-0"
          >
            <div className="flex-[1.2] md:hidden" />

            <div className="relative mb-6 flex flex-col items-center text-center md:mb-8 md:px-4">
              <div className="flex flex-col items-center">
                <ConnectToolsButton />
              </div>
              <h1 className="text-foreground flex items-center gap-1 text-base leading-none font-medium transition-opacity duration-500 md:gap-0 md:text-[25px]">
                <span className="min-h-6 pt-0.5 text-[#4f4f4f] md:pt-0">
                  What&apos;s on your mind, {greetingName}?
                </span>
              </h1>
            </div>

            <div className="w-full max-w-[672px] shrink-0">
              <PromptInput />
            </div>

            <div className="flex-[1.8] md:hidden" />
          </div>

          <div className="relative z-20 w-full shrink-0 md:flex md:flex-col">
            <div className="bg-card/95 mb-8 flex min-h-[100px] w-full flex-col rounded-3xl pt-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] md:mb-4 md:pb-4">
              <ProjectPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
