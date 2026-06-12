'use client'

import {
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Plus,
  Settings,
  UserPlus,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

function WorkspaceAvatar({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden border border-[#e0e0e2] bg-white text-ibl-neutral select-none',
        size === 'sm'
          ? 'size-6 rounded text-[10px] font-semibold'
          : 'size-10 rounded-lg text-base font-semibold',
      )}
    >
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium leading-none">
        B
      </span>
    </span>
  )
}

function WorkspaceMenuPanel() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6e6e8] bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)]">
      <div className="border-b border-black/[0.06] p-4">
        <div className="flex items-center gap-3">
          <WorkspaceAvatar size="lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-900">
              Bimsara&apos;s vibe.ibl.ai
            </p>
            <p className="truncate whitespace-nowrap text-xs text-neutral-500">
              Free Plan • 1 member
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs text-neutral-700 transition-colors hover:bg-black/[0.03]"
          >
            <Settings className="size-3.5 shrink-0" />
            <span className="truncate whitespace-nowrap">Settings</span>
          </button>
          <button
            type="button"
            className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs text-neutral-700 transition-colors hover:bg-black/[0.03]"
          >
            <UserPlus className="size-3.5 shrink-0" />
            <span className="truncate whitespace-nowrap">Invite members</span>
          </button>
        </div>
      </div>

      <div className="space-y-2 border-b border-black/[0.06] p-3">
        <div className="flex items-center justify-between rounded-lg bg-[#faf8f5] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-800">
            <Zap className="size-4 shrink-0" />
            <span className="truncate whitespace-nowrap">Turn Pro</span>
          </div>
          <button
            type="button"
            className="rounded-lg bg-violet-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-700"
          >
            Upgrade
          </button>
        </div>

        <div className="rounded-lg bg-[#faf8f5] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="truncate whitespace-nowrap text-sm font-medium text-neutral-800">
              Credits
            </span>
            <button
              type="button"
              className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-sm text-neutral-500 transition-colors hover:text-neutral-700"
            >
              5 left
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full w-[92%] rounded-full bg-blue-500" />
          </div>
          <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] text-neutral-400">
            <span className="size-1 shrink-0 rounded-full bg-neutral-300" />
            <span className="truncate whitespace-nowrap">
              Daily credits reset at midnight UTC
            </span>
          </p>
        </div>
      </div>

      <div className="border-b border-black/[0.06] p-3">
        <p className="mb-2 truncate whitespace-nowrap px-1 text-[11px] font-medium text-neutral-400">
          All workspaces
        </p>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-black/[0.03]"
        >
          <WorkspaceAvatar size="sm" />
          <span className="min-w-0 flex-1 truncate whitespace-nowrap text-sm font-medium text-neutral-800">
            Bimsara&apos;s vibe.ibl.ai
          </span>
          <span className="shrink-0 rounded-md bg-black/[0.06] px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-neutral-500">
            FREE
          </span>
          <Check className="size-4 text-neutral-500" />
        </button>
      </div>

      <div className="p-2">
        <button
          type="button"
          className="flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-black/[0.03]"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
            <Plus className="size-3.5" />
          </span>
          <span className="truncate whitespace-nowrap">Create new workspace</span>
        </button>
        <button
          type="button"
          className="flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-neutral-700 transition-colors hover:bg-black/[0.03]"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-black/[0.04]">
            <Globe className="size-3.5" />
          </span>
          <span className="truncate whitespace-nowrap">Find workspaces</span>
        </button>
      </div>
    </div>
  )
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div
      ref={containerRef}
      className={cn('relative', collapsed ? 'w-fit' : 'w-full')}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-neutral-200 bg-white text-[10px] font-semibold text-ibl-neutral transition-colors hover:bg-[#f8f8f9]',
            open && 'ring-2 ring-[#c4c4c8] ring-offset-2 ring-offset-[#fafafa]',
          )}
          aria-label="Bimsara's vibe.ibl.ai"
          aria-expanded={open}
        >
          B
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Bimsara's vibe.ibl.ai workspace menu"
          className={cn(
            'flex h-9 w-full min-w-0 items-center justify-start overflow-hidden rounded-md border border-neutral-200 bg-white px-0 text-left text-[14px] font-normal text-ibl-neutral transition-colors hover:bg-[#f8f8f9]',
            open && 'bg-[#f4f4f4]',
          )}
          aria-expanded={open}
        >
          <span className="flex w-full min-w-0 items-center gap-1.5 whitespace-nowrap">
            <span className="flex w-[30px] shrink-0 justify-center">
              <WorkspaceAvatar size="sm" />
            </span>
            <span className="min-w-0 flex-1 truncate text-neutral-800">
              Bimsara&apos;s vibe.ibl.ai
            </span>
            <span className="ml-auto flex shrink-0 items-center pr-2">
              <ChevronDown
                className={cn(
                  'size-5 text-neutral-700 transition-transform',
                  open && 'rotate-180',
                )}
              />
            </span>
          </span>
        </button>
      )}

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1',
            collapsed ? 'left-full ml-2 w-[280px]' : 'inset-x-0',
          )}
        >
          <WorkspaceMenuPanel />
        </div>
      )}
    </div>
  )
}
