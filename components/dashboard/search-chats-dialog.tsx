'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import {
  BookOpen,
  CornerDownLeft,
  ExternalLink,
  Gem,
  History,
  Home,
  Plus,
  Settings,
} from 'lucide-react'

import { useOnyxUI } from '@/components/onyx-shell-context'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type SearchItem = {
  id: string
  label: string
  section: 'recent' | 'navigate' | 'settings'
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  href?: string
  external?: boolean
  action?: 'create-project'
  detail?: {
    createdBy: string
    status: string
    created: string
    lastEdited: string
    lastOpened: string
  }
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'hello-friend',
    label: 'Hello Friend',
    section: 'recent',
    icon: Gem,
    href: '/app',
    detail: {
      createdBy: 'Bimsara Marapana',
      status: 'Private',
      created: '3 days ago',
      lastEdited: '3 days ago',
      lastOpened: '3 days ago',
    },
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    section: 'navigate',
    icon: Home,
    href: '/app',
  },
  {
    id: 'create-project',
    label: 'Create new project',
    section: 'navigate',
    icon: Plus,
    action: 'create-project',
  },
  {
    id: 'documentation',
    label: 'Documentation',
    section: 'navigate',
    icon: BookOpen,
    href: 'https://docs.vibe.ibl.ai',
    external: true,
  },
  {
    id: 'changelog',
    label: 'Changelog',
    section: 'navigate',
    icon: History,
    href: 'https://vibe.ibl.ai/changelog',
    external: true,
  },
  {
    id: 'workspace',
    label: 'Workspace',
    section: 'settings',
    icon: Settings,
    href: '/app/settings',
  },
]

const SECTION_LABELS = {
  recent: 'Recent projects',
  navigate: 'Navigate to',
  settings: 'Settings',
} as const

const searchRowActiveClass = 'btn-primary-gradient font-medium text-white'

const searchRowHoverClass =
  'btn-primary-gradient-ghost transition-[background,color] duration-150 hover:font-medium hover:text-white'

function SearchResultRow({
  item,
  selected,
  onSelect,
}: {
  item: SearchItem
  selected: boolean
  onSelect: () => void
}) {
  const Icon = item.icon

  const highlighted = item.section === 'navigate'

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={highlighted ? onSelect : undefined}
      className={cn(
        'group flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] transition-[background,color] duration-150',
        selected
          ? searchRowActiveClass
          : highlighted
            ? cn('text-neutral-800', searchRowHoverClass)
            : 'text-neutral-800 hover:bg-neutral-100',
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            'size-4 shrink-0',
            selected
              ? 'text-white'
              : highlighted
                ? 'text-neutral-500 group-hover:text-white'
                : 'text-neutral-500',
          )}
          strokeWidth={1.75}
        />
      ) : (
        <span className="size-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.external ? (
        <ExternalLink
          className={cn(
            'size-3.5 shrink-0',
            selected
              ? 'text-white/90'
              : highlighted
                ? 'text-neutral-400 group-hover:text-white/90'
                : 'text-neutral-400',
          )}
          strokeWidth={2}
        />
      ) : null}
    </button>
  )
}

function hidesPreviewPlaceholder(item: SearchItem) {
  return item.section === 'navigate' && !item.detail
}

function ProjectPreview({ item }: { item: SearchItem }) {
  if (!item.detail) {
    if (hidesPreviewPlaceholder(item)) {
      return <div className="flex flex-1" aria-hidden />
    }

    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5 text-center text-[13px] text-neutral-500">
        Select an item to see details
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
      <div className="mb-3 flex h-[100px] w-full items-center justify-center overflow-hidden rounded-lg border border-black/[0.06] bg-neutral-100">
        <Image
          src="/logo.png"
          alt=""
          width={36}
          height={36}
          className="size-9 object-contain opacity-25"
          aria-hidden
        />
      </div>

      <h2 className="mb-3 text-[17px] font-semibold tracking-tight text-neutral-900">
        {item.label}
      </h2>

      <dl className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-[12px]">
        <div>
          <dt className="mb-0.5 text-neutral-500">Created by</dt>
          <dd className="text-neutral-900">{item.detail.createdBy}</dd>
        </div>
        <div>
          <dt className="mb-0.5 text-neutral-500">Status</dt>
          <dd className="text-neutral-900">{item.detail.status}</dd>
        </div>
        <div>
          <dt className="mb-0.5 text-neutral-500">Created</dt>
          <dd className="text-neutral-900">{item.detail.created}</dd>
        </div>
        <div>
          <dt className="mb-0.5 text-neutral-500">Last edited</dt>
          <dd className="text-neutral-900">{item.detail.lastEdited}</dd>
        </div>
        <div className="col-span-2">
          <dt className="mb-0.5 text-neutral-500">Last opened</dt>
          <dd className="text-neutral-900">{item.detail.lastOpened}</dd>
        </div>
      </dl>
    </div>
  )
}

export function SearchChatsDialog() {
  const router = useRouter()
  const { searchOpen, setSearchOpen, setCreateProjectOpen } = useOnyxUI()
  const [query, setQuery] = React.useState('')
  const [selectedId, setSelectedId] = React.useState('hello-friend')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SEARCH_ITEMS
    return SEARCH_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
  }, [query])

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    SEARCH_ITEMS[0]

  React.useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setSelectedId('hello-friend')
      return
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [searchOpen])

  React.useEffect(() => {
    if (!filteredItems.some((item) => item.id === selectedId) && filteredItems[0]) {
      setSelectedId(filteredItems[0].id)
    }
  }, [filteredItems, selectedId])

  const openSelected = React.useCallback(() => {
    if (!selectedItem) return

    if (selectedItem.action === 'create-project') {
      setSearchOpen(false)
      setCreateProjectOpen(true)
      return
    }

    if (selectedItem.external && selectedItem.href) {
      window.open(selectedItem.href, '_blank', 'noopener,noreferrer')
      setSearchOpen(false)
      return
    }

    if (selectedItem.href) {
      setSearchOpen(false)
      router.push(selectedItem.href)
    }
  }, [router, selectedItem, setCreateProjectOpen, setSearchOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      openSelected()
    }
  }

  const sections = (['recent', 'navigate', 'settings'] as const).map((section) => ({
    section,
    items: filteredItems.filter((item) => item.section === section),
  }))

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(520px,calc(100dvh-2rem))] max-w-[min(680px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.3)]"
      >
        <div className="border-b border-neutral-200 px-4 py-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-full border-0 bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
            aria-label="Search"
          />
        </div>

        <div className="grid min-h-[300px] grid-cols-[minmax(0,220px)_1fr]">
          <div className="min-h-0 overflow-y-auto border-r border-neutral-200 px-2.5 py-2.5">
            {sections.map(({ section, items }) =>
              items.length > 0 ? (
                <div key={section} className="mb-3 last:mb-0">
                  <p className="mb-1 px-1.5 text-[10px] font-medium text-neutral-500">
                    {SECTION_LABELS[section]}
                  </p>
                  <div className="space-y-0.5">
                    {items.map((item) => (
                      <SearchResultRow
                        key={item.id}
                        item={item}
                        selected={selectedItem.id === item.id}
                        onSelect={() => setSelectedId(item.id)}
                      />
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>

          <ProjectPreview item={selectedItem} />
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={16}
            height={16}
            className="size-4 shrink-0 object-contain opacity-70"
            aria-hidden
          />
          {selectedItem?.detail ? (
            <button
              type="button"
              onClick={openSelected}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
            >
              Open project
              <span className="inline-flex size-4 items-center justify-center rounded border border-neutral-300 bg-neutral-50 text-neutral-500">
                <CornerDownLeft className="size-2.5" strokeWidth={2} />
              </span>
            </button>
          ) : selectedItem?.href || selectedItem?.action ? (
            <button
              type="button"
              onClick={openSelected}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
            >
              {selectedItem.external ? 'Open link' : 'Open'}
              <span className="inline-flex size-4 items-center justify-center rounded border border-neutral-300 bg-neutral-50 text-neutral-500">
                <CornerDownLeft className="size-2.5" strokeWidth={2} />
              </span>
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
