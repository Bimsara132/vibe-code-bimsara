'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

type DropdownMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error('DropdownMenu components must be used within DropdownMenu')
  return context
}

function DropdownMenu({
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
    <DropdownMenuContext.Provider value={{ open: currentOpen, setOpen }}>
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({
  asChild,
  children,
}: {
  asChild?: boolean
  children: React.ReactElement
}) {
  const { open, setOpen } = useDropdownMenuContext()
  const child = React.Children.only(children)

  return React.cloneElement(child, {
    onClick: (event: React.MouseEvent) => {
      child.props.onClick?.(event)
      setOpen(!open)
    },
    'aria-expanded': open,
  })
}

function DropdownMenuContent({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  children,
}: {
  className?: string
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  children: React.ReactNode
  sideOffset?: number
}) {
  const { open, setOpen } = useDropdownMenuContext()
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

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-[250] min-w-[8rem] overflow-hidden',
        side === 'top' ? 'bottom-full mb-1' : 'top-full mt-1',
        align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0',
        className,
      )}
      style={{ marginTop: side === 'bottom' ? sideOffset : undefined, marginBottom: side === 'top' ? sideOffset : undefined }}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({
  className,
  variant,
  onSelect,
  children,
  ...props
}: React.ComponentProps<'button'> & {
  variant?: 'destructive'
  onSelect?: (event: Event) => void
}) {
  const { setOpen } = useDropdownMenuContext()

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm outline-none disabled:pointer-events-none disabled:opacity-100',
        variant === 'destructive' ? 'text-destructive' : '',
        className,
      )}
      onClick={(event) => {
        onSelect?.(event.nativeEvent)
        props.onClick?.(event)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-border', className)} />
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
