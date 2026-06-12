'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopoverContext() {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error('Popover components must be used within Popover')
  return context
}

function Popover({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : uncontrolledOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <PopoverContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </PopoverContext.Provider>
  )
}

function PopoverTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactElement
}) {
  const { open, setOpen } = usePopoverContext()

  const child = React.Children.only(children)
  const props = {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event)
      setOpen(!open)
    },
    'aria-expanded': open,
  }

  return asChild ? React.cloneElement(child, props) : <button type="button" {...props}>{children}</button>
}

function PopoverContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
}: {
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  children: React.ReactNode
}) {
  const { open, setOpen } = usePopoverContext()
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open, setOpen])

  if (!open) return null

  const sideClass =
    side === 'right'
      ? `left-full top-0 ml-[${sideOffset}px]`
      : side === 'left'
        ? `right-full top-0 mr-[${sideOffset}px]`
        : side === 'top'
          ? 'bottom-full left-0 mb-1'
          : 'top-full left-0 mt-1'

  const alignClass =
    align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2'

  return (
    <div
      ref={ref}
      className={cn('absolute z-[200]', sideClass, alignClass, className)}
      style={{ marginTop: side === 'bottom' ? sideOffset : undefined }}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverContent, PopoverTrigger }
