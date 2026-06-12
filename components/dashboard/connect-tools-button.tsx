'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

const connectors = [
  'https://assets.lovable.dev/img/connectors/salesforce.svg',
  'https://assets.lovable.dev/img/connectors/databricks.svg',
  'https://assets.lovable.dev/img/connectors/snowflake.svg',
  'https://assets.lovable.dev/img/connectors/google_drive.svg',
  'https://assets.lovable.dev/img/connectors/notion.svg',
  'https://assets.lovable.dev/img/connectors/slack.svg',
]

const VISIBLE_COUNT = 4
const CYCLE_MS = 2800
const TRANSITION_MS = 400

export function ConnectToolsButton() {
  const [offset, setOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setOffset((current) => (current + 1) % connectors.length)
        setIsAnimating(false)
      }, TRANSITION_MS)
    }, CYCLE_MS)

    return () => clearInterval(interval)
  }, [])

  const visible = Array.from(
    { length: VISIBLE_COUNT },
    (_, index) => connectors[(offset + index) % connectors.length],
  )

  return (
    <button
      type="button"
      className="group mb-4 flex items-center gap-2 rounded-full bg-white/40 py-1.5 ps-1.5 pe-3 text-xs font-medium md:text-sm shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),inset_0_0_0_0.5px_rgba(255,255,255,0.48),0_2px_2px_-1px_rgba(0,0,0,0.02),0_4px_4px_-2px_rgba(0,0,0,0.02)] backdrop-blur-[10px] transition-all duration-300 hover:bg-white/60 hover:shadow-[0_0_0_0.5px_rgba(0,0,0,0.12),inset_0_0_0_0.5px_rgba(255,255,255,0.64),0_2px_2px_-1px_rgba(0,0,0,0.02),0_4px_4px_-2px_rgba(0,0,0,0.02),0_8px_8px_-4px_rgba(0,0,0,0.02),0_16px_16px_-8px_rgba(0,0,0,0.02)] dark:bg-black/40 dark:hover:bg-black/50 dark:shadow-[0_0_0_0.5px_rgba(0,0,0,0.80),inset_0_0_0_0.5px_rgba(255,255,255,0.12),0_2px_2px_-1px_rgba(0,0,0,0.02),0_4px_4px_-2px_rgba(0,0,0,0.02)] dark:hover:shadow-[0_0_0_0.5px_rgba(0,0,0,0.80),inset_0_0_0_0.5px_rgba(255,255,255,0.16),0_2px_2px_-1px_rgba(0,0,0,0.08),0_4px_4px_-2px_rgba(0,0,0,0.08),0_8px_8px_-4px_rgba(0,0,0,0.08),0_16px_16px_-8px_rgba(0,0,0,0.08)] md:mb-6"
    >
      <div className="relative h-6 w-[60px] overflow-hidden rounded-full">
        <div className="absolute flex items-center">
          {visible.map((src, index) => {
            const isFirst = index === 0
            const isLast = index === VISIBLE_COUNT - 1
            const opacity = isAnimating
              ? isFirst
                ? 0
                : isLast
                  ? 1
                  : 1
              : isLast
                ? 0
                : 1
            const scale = isAnimating
              ? isFirst
                ? 0.85
                : 1
              : isLast
                ? 0.85
                : 1

            return (
              <img
                key={`${offset}-${index}-${src}`}
                alt=""
                width={24}
                height={24}
                src={src}
                className={cn(
                  'bg-background size-6 shrink-0 rounded-full object-contain',
                  index < VISIBLE_COUNT - 1 && '-mr-1.5',
                )}
                style={{
                  zIndex: index,
                  opacity,
                  transform: `scale(${scale})`,
                  transition: `opacity ${TRANSITION_MS}ms, transform ${TRANSITION_MS}ms`,
                }}
              />
            )
          })}
        </div>
      </div>
      <span>Connect all your tools</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        width="100%"
        height="100%"
        className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M13.47 6.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H5a.75.75 0 0 1 0-1.5h12.19l-3.72-3.72a.75.75 0 0 1 0-1.06"
        />
      </svg>
    </button>
  )
}
