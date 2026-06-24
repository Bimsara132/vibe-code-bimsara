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
  LayoutGrid,
  Plus,
  Settings,
  Users,
} from 'lucide-react'

import { useOnyxUI } from '@/components/onyx-shell-context'
import { useProjects } from '@/components/projects-context'
import { useRecentChats } from '@/lib/iblai/use-recent-chats'
import { buildProjectHref } from '@/lib/iblai/project-route'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type SearchItem = {
  id: string
  label: string
  section: 'recent' | 'navigate' | 'settings'
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>
  href?: string
  external?: boolean
  action?: 'create-project' | 'open-profile'
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
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
  {
    id: 'people',
    label: 'People',
    section: 'settings',
    icon: Users,
    action: 'open-profile',
  },
  {
    id: 'templates',
    label: 'Templates',
    section: 'settings',
    icon: LayoutGrid,
    href: '/app/resources',
  },
]

const SECTION_LABELS = {
  recent: 'Recent chats',
  navigate: 'Navigate to',
  settings: 'Settings',
} as const

const searchRowActiveClass = 'btn-primary-gradient font-medium text-white shadow-sm'

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

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={cn(
        'group flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-sm transition-[background,color] duration-150',
        selected
          ? searchRowActiveClass
          : cn('text-neutral-800', searchRowHoverClass),
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            'size-[18px] shrink-0',
            selected ? 'text-white' : 'text-neutral-500 group-hover:text-white',
          )}
          strokeWidth={1.75}
        />
      ) : (
        <span className="size-[18px] shrink-0" />
      )}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.external ? (
        <ExternalLink
          className={cn(
            'size-4 shrink-0',
            selected ? 'text-white/90' : 'text-neutral-400 group-hover:text-white/90',
          )}
          strokeWidth={2}
        />
      ) : null}
    </button>
  )
}

export function SearchChatsDialog() {
  const router = useRouter()
  const { searchOpen, setSearchOpen, setProfileOpen } = useOnyxUI()
  const { createProject } = useProjects()
  const { items: recentChats } = useRecentChats()
  const [query, setQuery] = React.useState('')
  const [selectedId, setSelectedId] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  const searchItems = React.useMemo(() => {
    const recent: SearchItem[] = recentChats.map((chat) => ({
      id: chat.id,
      label: chat.label,
      section: 'recent',
      icon: Gem,
      href: chat.href,
    }))

    return [...recent, ...STATIC_SEARCH_ITEMS]
  }, [recentChats])

  const filteredItems = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return searchItems
    return searchItems.filter((item) => item.label.toLowerCase().includes(q))
  }, [query, searchItems])

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ?? filteredItems[0]

  React.useEffect(() => {
    if (!searchOpen) {
      setQuery('')
      setSelectedId('')
      return
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [searchOpen])

  React.useEffect(() => {
    if (!selectedId && filteredItems[0]) {
      setSelectedId(filteredItems[0].id)
    }
  }, [filteredItems, selectedId])

  const openSelected = React.useCallback(() => {
    if (!selectedItem) return

    if (selectedItem.action === 'create-project') {
      setSearchOpen(false)
      void createProject().then((project) => {
        if (project) router.push(buildProjectHref(project.id))
      })
      return
    }

    if (selectedItem.action === 'open-profile') {
      setSearchOpen(false)
      setProfileOpen(true)
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
  }, [createProject, router, selectedItem, setProfileOpen, setSearchOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (filteredItems.length === 0) return

      const currentIndex = filteredItems.findIndex((item) => item.id === selectedId)
      const nextIndex =
        event.key === 'ArrowDown'
          ? (currentIndex + 1) % filteredItems.length
          : (currentIndex - 1 + filteredItems.length) % filteredItems.length

      setSelectedId(filteredItems[nextIndex]?.id ?? filteredItems[0].id)
      return
    }

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
        className="max-h-[min(600px,calc(100dvh-2rem))] max-w-[min(560px,calc(100vw-2rem))] gap-0 overflow-hidden rounded-xl border border-[rgba(115,185,255,0.28)] bg-[#fafcff] p-0 shadow-[0_20px_60px_-20px_rgba(0,120,255,0.22)]"
      >
        <div className="border-b border-[rgba(115,185,255,0.2)] bg-white px-5 py-3.5">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-full border-0 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400"
            aria-label="Search"
          />
        </div>

        <div className="min-h-[320px] overflow-y-auto px-3 py-3">
          {sections.map(({ section, items }) =>
            items.length > 0 ? (
              <div key={section} className="mb-3.5 last:mb-0">
                <p className="mb-1.5 px-2 text-[11px] font-medium text-neutral-500">
                  {SECTION_LABELS[section]}
                </p>
                <div className="space-y-1">
                  {items.map((item) => (
                    <SearchResultRow
                      key={item.id}
                      item={item}
                      selected={selectedItem?.id === item.id}
                      onSelect={() => setSelectedId(item.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null,
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[rgba(115,185,255,0.2)] bg-white px-5 py-3">
          <Image
            src="/logo.png"
            alt=""
            width={18}
            height={18}
            className="size-[18px] shrink-0 object-contain opacity-80"
            aria-hidden
          />
          {selectedItem?.href || selectedItem?.action ? (
            <button
              type="button"
              onClick={openSelected}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#0078FF] transition-colors hover:text-[#0069E0]"
            >
              {selectedItem.external ? 'Open link' : 'Open'}
              <span className="inline-flex size-[18px] items-center justify-center rounded border border-[rgba(115,185,255,0.45)] bg-[#f5f8ff] text-[#0078FF]">
                <CornerDownLeft className="size-3" strokeWidth={2} />
              </span>
            </button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
