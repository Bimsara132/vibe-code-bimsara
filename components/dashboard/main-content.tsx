'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { VibeBuildChat } from '@/components/iblai/vibe-build-chat'
import { useOnyxUI } from '@/components/onyx-shell-context'
import { readPendingBuild, savePendingBuild } from '@/lib/iblai/pending-build'
import { useIblaiUser } from '@/lib/iblai/use-iblai-user'

import { HomePromptBlock } from './home-prompt-block'
import { LovableBackground } from './lovable-background'
import { ProjectPanel } from './project-panel'

export function MainContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restoreSessionId = searchParams.get('session')
  const newParam = searchParams.get('new')
  const { homeChatResetSeq } = useOnyxUI()
  const scrollRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const [scrollY, setScrollY] = useState(0)
  const titleCurveGradientId = useId()
  const { displayName } = useIblaiUser()
  const firstName = displayName.split(/\s+/)[0] ?? ''

  const handleScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(scrollRef.current?.scrollTop ?? 0)
    })
  }, [])

  const handleSendMessage = useCallback(
    (text: string, options?: { useCanvas?: boolean }) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const nonce = String(Date.now())
      savePendingBuild({
        nonce,
        prompt: trimmed,
        useCanvas: options?.useCanvas ?? true,
      })
      router.replace(`/app?new=${nonce}`)
    },
    [router],
  )

  useEffect(() => {
    router.replace('/app')
  }, [homeChatResetSeq, router])

  const showChat = Boolean(restoreSessionId || newParam)

  if (showChat) {
    const pendingBuild = readPendingBuild(newParam)
    const isNewBuild = Boolean(newParam && pendingBuild)

    return (
      <VibeBuildChat
        initialPrompt={isNewBuild ? pendingBuild!.prompt : ''}
        useCanvas={isNewBuild ? pendingBuild!.useCanvas : false}
        buildNonce={isNewBuild ? pendingBuild!.nonce : undefined}
      />
    )
  }

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
        <div className="relative flex min-h-full w-full flex-col pt-4 md:pt-0">
          <div
            id="create-form-1"
            className="relative z-10 flex flex-col items-center px-4 pb-8 md:pb-10 md:px-0 lg:pb-12"
          >
            <div className="relative mb-8 flex w-full max-w-[672px] flex-col items-center text-center md:mb-10 md:pt-14 lg:mb-12 lg:pt-16">
              <h1 className="max-w-[18ch] text-[28px] leading-[1.15] font-semibold tracking-tight md:max-w-none md:text-[2.75rem] lg:text-[3.25rem]">
                <span className="bg-gradient-to-r from-[#38bdf8] via-ibl to-ibl-indigo bg-clip-text text-transparent">
                  {firstName ? `Welcome, ${firstName}` : 'Welcome'}
                </span>
              </h1>
              <svg
                aria-hidden
                className="mt-1.5 h-[6px] w-[min(52%,7rem)] md:mt-2 md:h-[7px] md:w-[min(48%,8rem)]"
                viewBox="0 0 176 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id={titleCurveGradientId}
                    x1="0"
                    y1="0"
                    x2="176"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
                    <stop offset="0.14" stopColor="#38bdf8" />
                    <stop offset="0.5" stopColor="#7284FF" />
                    <stop offset="0.86" stopColor="#7284FF" />
                    <stop offset="1" stopColor="#7284FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 3.5C44 6.5 132 6.5 174 3.5"
                  stroke={`url(#${titleCurveGradientId})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-foreground mt-3 max-w-[36ch] text-base leading-relaxed font-normal md:mt-4 md:max-w-none md:text-lg">
                Describe what you&apos;d like to build
              </p>
            </div>

            <div className="w-full max-w-[820px] shrink-0">
              <HomePromptBlock onSend={handleSendMessage} />
            </div>
          </div>

          <div className="relative z-20 w-full shrink-0 md:flex md:flex-col">
            <div className="mb-6 px-4 text-center md:mb-8 lg:px-8">
              <h2 className="text-foreground text-[1.35rem] leading-snug font-semibold tracking-tight md:text-2xl">
                Recent projects & vibe launches
              </h2>
            </div>
            <div className="bg-card/95 mb-8 flex min-h-[100px] w-full flex-col rounded-3xl pt-4 pb-[max(2rem,env(safe-area-inset-bottom,0px))] md:mb-6 md:pb-6">
              <ProjectPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
