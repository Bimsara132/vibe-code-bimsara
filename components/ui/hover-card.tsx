'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

type HoverCardContextValue = {
  open: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
  scheduleShow: () => void
  scheduleHide: () => void
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null)

function useHoverCardContext() {
  const context = React.useContext(HoverCardContext)
  if (!context) throw new Error('HoverCard components must be used within HoverCard')
  return context
}

function HoverCard({
  openDelay = 0,
  closeDelay = 0,
  children,
}: {
  openDelay?: number
  closeDelay?: number
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const openTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleShow = React.useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    openTimeout.current = setTimeout(() => setOpen(true), openDelay)
  }, [openDelay])

  const scheduleHide = React.useCallback(() => {
    if (openTimeout.current) clearTimeout(openTimeout.current)
    closeTimeout.current = setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay])

  React.useEffect(() => {
    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current)
      if (closeTimeout.current) clearTimeout(closeTimeout.current)
    }
  }, [])

  return (
    <HoverCardContext.Provider
      value={{ open, anchorRef, scheduleShow, scheduleHide }}
    >
      <div ref={anchorRef} className="relative inline-flex">
        {children}
      </div>
    </HoverCardContext.Provider>
  )
}

function HoverCardTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactElement
}) {
  const { scheduleShow, scheduleHide } = useHoverCardContext()

  const child = React.Children.only(children)
  return React.cloneElement(child, {
    onMouseEnter: (event: React.MouseEvent) => {
      child.props.onMouseEnter?.(event)
      scheduleShow()
    },
    onMouseLeave: (event: React.MouseEvent) => {
      child.props.onMouseLeave?.(event)
      scheduleHide()
    },
    onFocus: (event: React.FocusEvent) => {
      child.props.onFocus?.(event)
      scheduleShow()
    },
    onBlur: (event: React.FocusEvent) => {
      child.props.onBlur?.(event)
      scheduleHide()
    },
  })
}

function getFixedPosition(
  rect: DOMRect,
  side: 'top' | 'right' | 'bottom' | 'left',
  align: 'start' | 'center' | 'end',
  sideOffset: number,
): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 200,
  }

  if (side === 'right') {
    style.left = rect.right + sideOffset
    if (align === 'start') style.top = rect.top
    else if (align === 'end') {
      style.top = rect.bottom
      style.transform = 'translateY(-100%)'
    } else {
      style.top = rect.top + rect.height / 2
      style.transform = 'translateY(-50%)'
    }
    return style
  }

  if (side === 'left') {
    style.left = rect.left - sideOffset
    style.transform = 'translateX(-100%)'
    if (align === 'start') style.top = rect.top
    else if (align === 'end') {
      style.top = rect.bottom
      style.transform = 'translate(-100%, -100%)'
    } else {
      style.top = rect.top + rect.height / 2
      style.transform = 'translate(-100%, -50%)'
    }
    return style
  }

  if (side === 'bottom') {
    style.top = rect.bottom + sideOffset
    if (align === 'start') style.left = rect.left
    else if (align === 'end') {
      style.left = rect.right
      style.transform = 'translateX(-100%)'
    } else {
      style.left = rect.left + rect.width / 2
      style.transform = 'translateX(-50%)'
    }
    return style
  }

  style.top = rect.top - sideOffset
  style.transform = 'translateY(-100%)'
  if (align === 'start') style.left = rect.left
  else if (align === 'end') {
    style.left = rect.right
    style.transform = 'translate(-100%, -100%)'
  } else {
    style.left = rect.left + rect.width / 2
    style.transform = 'translate(-50%, -100%)'
  }
  return style
}

function HoverCardContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  children,
}: {
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  children: React.ReactNode
}) {
  const { open, anchorRef, scheduleShow, scheduleHide } = useHoverCardContext()
  const [position, setPosition] = React.useState<React.CSSProperties>({
    position: 'fixed',
    visibility: 'hidden',
  })

  React.useLayoutEffect(() => {
    if (!open || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    setPosition(getFixedPosition(rect, side, align, sideOffset))
  }, [open, side, align, sideOffset, anchorRef])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(className)}
      style={position}
      onMouseEnter={scheduleShow}
      onMouseLeave={scheduleHide}
    >
      {children}
    </div>,
    document.body,
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
