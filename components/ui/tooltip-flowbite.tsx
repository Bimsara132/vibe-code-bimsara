'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

export function TooltipFlowbite({
  content,
  position = 'right',
  delay = 0,
  triggerClassName,
  children,
}: {
  content: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  delay?: number
  triggerClassName?: string
  children: React.ReactElement
}) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLSpanElement>(null)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const [tooltipStyle, setTooltipStyle] = React.useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden',
  })

  const show = () => {
    timeoutRef.current = setTimeout(() => setOpen(true), delay)
  }

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const offset = 8

    if (position === 'right') {
      setTooltipStyle({
        position: 'fixed',
        left: rect.right + offset,
        top: rect.top + rect.height / 2,
        transform: 'translateY(-50%)',
        zIndex: 300,
      })
      return
    }

    if (position === 'left') {
      setTooltipStyle({
        position: 'fixed',
        left: rect.left - offset,
        top: rect.top + rect.height / 2,
        transform: 'translate(-100%, -50%)',
        zIndex: 300,
      })
      return
    }

    if (position === 'top') {
      setTooltipStyle({
        position: 'fixed',
        left: rect.left + rect.width / 2,
        top: rect.top - offset,
        transform: 'translate(-50%, -100%)',
        zIndex: 300,
      })
      return
    }

    setTooltipStyle({
      position: 'fixed',
      left: rect.left + rect.width / 2,
      top: rect.bottom + offset,
      transform: 'translateX(-50%)',
      zIndex: 300,
    })
  }, [open, position])

  return (
    <span
      ref={anchorRef}
      className={cn('relative inline-flex', triggerClassName)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && typeof document !== 'undefined'
        ? createPortal(
            <span
              role="tooltip"
              className="pointer-events-none whitespace-nowrap rounded-lg border border-[#e6e6e8] bg-white px-2.5 py-1.5 text-[12px] font-medium text-ibl-neutral shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)]"
              style={tooltipStyle}
            >
              {content}
            </span>,
            document.body,
          )
        : null}
    </span>
  )
}
