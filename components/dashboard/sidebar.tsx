'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeftRight,
  Bell,
  BookOpen,
  CheckCheck,
  ChevronLeft,
  CircleHelp,
  Cog,
  Coins,
  Compass,
  Cpu,
  FileSearch,
  Folder,
  Globe,
  Hexagon,
  History,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  LineChart,
  Link2,
  LogOut,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  PaintRoller,
  Pencil,
  PlusSquare,
  Settings,
  SlidersHorizontal,
  SquarePen,
  Star,
  Terminal,
  TextSearch,
  Trash2,
  User,
  UserCog,
  Users,
  Wallet,
  Waypoints,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TooltipFlowbite } from '@/components/ui/tooltip-flowbite'
import { ChatPreferencesIcon } from '@/components/icons/chat-preferences-icon'
import { DiscordIntegrationMarkIcon } from '@/components/icons/discord-integration-mark-icon'
import { SlackIntegrationMarkIcon } from '@/components/icons/slack-integration-mark-icon'
import { VoiceSettingsIcon } from '@/components/icons/voice-settings-icon'
import { useOnyxUI } from '@/components/onyx-shell-context'
import { useProjects } from '@/components/projects-context'
import { cn } from '@/lib/utils'

const USERNAME = 'bimsaraimalkabm'
const USER_INITIALS = 'BI'
const USER_EMAIL = `${USERNAME}@gmail.com`

const SIDEBAR_SECTION_LABEL_CLASS =
  'px-2 pt-2.5 pb-0 text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]'

const PROJECT_FILTER_LINKS = [
  { id: 'all', label: 'All projects', icon: LayoutGrid, href: '/app/projects' },
  {
    id: 'starred',
    label: 'Starred',
    icon: Star,
    href: '/app/projects?filter=starred',
  },
  {
    id: 'created',
    label: 'Created by me',
    icon: User,
    href: '/app/projects?filter=created',
  },
  {
    id: 'shared',
    label: 'Shared with me',
    icon: Users,
    href: '/app/projects?filter=shared',
  },
] as const

const RECENT_CHATS = [
  { id: 'hello-friend', label: 'Hello Friend', href: '/app' },
] as const

const navRowClassName =
  'flex h-9 w-full min-w-0 items-center gap-2 rounded-md px-2 text-left text-[14px] font-normal text-ibl-neutral transition-colors hover:bg-[#f4f4f4]'

const navIconButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-ibl-neutral transition-colors hover:bg-[#f0f0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4c4c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]'

const newSessionExpandedClassName =
  'inline-flex w-full items-center justify-start gap-2 rounded-[8px] border border-neutral-200 bg-white px-3 py-1.5 text-sm font-normal text-neutral-600 antialiased transition-colors hover:bg-[#f8f8f9] active:bg-[#f2f2f3]'

const newSessionCollapsedClassName =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-[#f8f8f9]'

const brandWordmarkClassName =
  'min-w-0 truncate bg-gradient-to-r from-ibl to-ibl-indigo bg-clip-text text-[18px] font-semibold lowercase tracking-normal text-transparent'

const sidebarDropdownItemClassName =
  'flex h-9 w-full min-w-0 items-center rounded-md px-2 text-left text-[14px] font-normal transition-colors'

const flyoutPanelClassName =
  'z-[200] w-max min-w-[200px] max-w-[280px] rounded-2xl border border-[#e6e6e8] bg-white px-3 py-2.5 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.18)]'

const collapsedTriggerButtonClassName =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#c4c4c8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa]'

export function SidebarRailToggleIcon({ className }: { className?: string }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M16.5 4A1.5 1.5 0 0 1 18 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14.5v-9A1.5 1.5 0 0 1 3.5 4zM7 15h9.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H7zM3.5 5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H6V5z" />
    </svg>
  )
}

export type SidebarNavVariant = 'expanded' | 'collapsed'

type NavIcon = React.ComponentType<{
  className?: string
  strokeWidth?: number
}>

export const DEFAULT_ADMIN_TAB = 'language-models'

export type AdminSidebarNavItem = {
  id: string
  label: string
  icon: NavIcon
  href?: string
}

export type AdminSidebarNavSection = {
  heading?: string
  items: AdminSidebarNavItem[]
}

export function adminNavItemHref(item: AdminSidebarNavItem): string {
  return item.href ?? `/app/admin?tab=${encodeURIComponent(item.id)}`
}

export const ADMIN_NAV_SECTIONS: AdminSidebarNavSection[] = [
  {
    items: [
      { id: 'language-models', label: 'Language Models', icon: Cpu },
      { id: 'web-search', label: 'Web Search', icon: Globe },
      { id: 'image-generation', label: 'Image Generation', icon: ImageIcon },
      { id: 'voice', label: 'Voice', icon: VoiceSettingsIcon },
      { id: 'code-interpreter', label: 'Code Interpreter', icon: Terminal },
      { id: 'chat-preferences', label: 'Chat Preferences', icon: ChatPreferencesIcon },
    ],
  },
  {
    heading: 'Agents & Actions',
    items: [
      { id: 'agents', label: 'Agents', icon: Hexagon },
      { id: 'mcp-actions', label: 'MCP Actions', icon: Cog },
      { id: 'openapi-actions', label: 'OpenAPI Actions', icon: SlidersHorizontal },
    ],
  },
  {
    heading: 'Documents & Knowledge',
    items: [
      { id: 'existing-connectors', label: 'Existing Connectors', icon: BookOpen },
      { id: 'add-connector', label: 'Add Connector', icon: PlusSquare },
      { id: 'document-sets', label: 'Document Sets', icon: Layers },
      { id: 'index-settings', label: 'Index Settings', icon: FileSearch },
      {
        id: 'document-index-migration',
        label: 'Document Index Migration',
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    heading: 'Integrations',
    items: [
      { id: 'service-accounts', label: 'Service Accounts', icon: UserCog },
      { id: 'slack-integration', label: 'Slack Integration', icon: SlackIntegrationMarkIcon },
      { id: 'discord-integration', label: 'Discord Integration', icon: DiscordIntegrationMarkIcon },
    ],
  },
  {
    heading: 'Permissions',
    items: [
      { id: 'users', label: 'Users', icon: User },
      { id: 'groups', label: 'Groups', icon: Users },
      { id: 'scim', label: 'SCIM', icon: Link2 },
    ],
  },
  {
    heading: 'Organization',
    items: [
      { id: 'plans-billing', label: 'Plans & Billing', icon: Wallet },
      { id: 'spending-limits', label: 'Spending Limits', icon: Coins },
      { id: 'appearance-theming', label: 'Appearance & Theming', icon: PaintRoller },
    ],
  },
  {
    heading: 'Usage',
    items: [
      { id: 'usage-statistics', label: 'Usage Statistics', icon: LineChart },
      { id: 'query-history', label: 'Query History', icon: History },
    ],
  },
]

export function isRegisteredAdminTab(tab: string): boolean {
  return ADMIN_NAV_SECTIONS.some((section) =>
    section.items.some((item) => item.id === tab),
  )
}

function SidebarCollapsedLabelFlyout({
  label,
  children,
}: {
  label: string
  children: React.ReactElement
}) {
  return (
    <TooltipFlowbite
      content={label}
      position="right"
      delay={180}
      triggerClassName="block w-full"
    >
      {children}
    </TooltipFlowbite>
  )
}

type CollapsedFlyoutItem = {
  id: string
  label: string
  emptyState?: boolean
  href?: string
}

const ADMIN_NAV_FLAT_FLYOUT: CollapsedFlyoutItem[] = ADMIN_NAV_SECTIONS.flatMap(
  (section) =>
    section.items.map((item) => ({
      id: item.id,
      label: item.label,
      href: adminNavItemHref(item),
    })),
)

function CollapsedNavFlyout({
  icon: Icon,
  label,
  active,
  items,
  onIconClick,
  onItemSelect,
  afterNavigate,
}: {
  icon: NavIcon
  label: string
  active?: boolean
  items: readonly CollapsedFlyoutItem[]
  onIconClick?: () => void
  onItemSelect?: (itemId: string) => void
  afterNavigate?: () => void
}) {
  const router = useRouter()

  return (
    <HoverCard openDelay={180} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={onIconClick}
          className={cn(
            collapsedTriggerButtonClassName,
            active
              ? 'bg-[#eef6fc] hover:bg-[#e8f2fc]'
              : 'hover:bg-[#f0f0f0]',
          )}
          aria-label={label}
        >
          <Icon
            className={cn(
              'size-4 shrink-0',
              active ? 'text-[#1e40af]' : 'text-ibl-neutral',
            )}
            strokeWidth={1.5}
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        sideOffset={10}
        className={cn(flyoutPanelClassName, 'p-0')}
      >
        <div className="mb-1.5 px-3 pt-2.5">
          <span className="text-[14px] font-medium leading-snug text-ibl-flyout-title">
            {label}
          </span>
        </div>
        <ul className="m-0 list-none space-y-0 px-3 pb-2.5">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  if (item.emptyState) return
                  onItemSelect?.(item.id)
                  if (item.href) {
                    router.push(item.href)
                    afterNavigate?.()
                  }
                }}
                className={cn(
                  sidebarDropdownItemClassName,
                  item.emptyState
                    ? 'cursor-default text-[#94a3b8] italic hover:bg-transparent'
                    : 'cursor-pointer text-ibl-flyout-item hover:bg-[#f4f4f4]',
                )}
              >
                <span className="min-w-0 truncate text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}

export function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
  variant = 'default',
  activeTone = 'brand',
}: {
  href: string
  icon: NavIcon
  label: string
  active?: boolean
  onClick?: () => void
  collapsed: boolean
  variant?: 'default' | 'primary'
  activeTone?: 'brand' | 'neutral'
}) {
  if (variant === 'primary') {
    if (collapsed) {
      return null
    }
    return (
      <Link
        href={href}
        onClick={onClick}
        className={newSessionExpandedClassName}
      >
        <SquarePen className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
        <span>{label}</span>
      </Link>
    )
  }

  if (collapsed) {
    return null
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      title={label}
      className={cn(
        'flex h-9 w-full min-w-0 items-center gap-2 rounded-md px-2 text-left text-[14px] font-normal transition-colors',
        active
          ? activeTone === 'neutral'
            ? 'bg-[#f4f4f4] text-ibl-neutral hover:bg-[#f4f4f4]'
            : 'bg-[#eef6fc] text-[#1e40af] hover:bg-[#e8f2fc]'
          : 'text-ibl-neutral hover:bg-[#f4f4f4]',
      )}
    >
      <Icon
        strokeWidth={1.5}
        className={cn(
          'size-4 shrink-0',
          active
            ? activeTone === 'neutral'
              ? 'text-ibl-neutral'
              : 'text-[#1e40af]'
            : 'text-ibl-neutral',
        )}
      />
      <span
        className={cn(
          'min-w-0 flex-1 truncate',
          active && activeTone === 'brand' && 'text-[#1e40af]',
        )}
      >
        {label}
      </span>
    </Link>
  )
}

function SidebarProjectLink({
  projectId,
  href,
  label,
  active,
  onClick,
  collapsed,
}: {
  projectId: string
  href: string
  label: string
  active?: boolean
  onClick?: () => void
  collapsed: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { renameProject, removeProject } = useProjects()
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [renameDraft, setRenameDraft] = React.useState(label)
  const [deleteOpen, setDeleteOpen] = React.useState(false)

  React.useEffect(() => {
    if (renameOpen) setRenameDraft(label)
  }, [renameOpen, label])

  const saveRename = React.useCallback(() => {
    const next = renameDraft.trim()
    if (!next) return
    renameProject(projectId, next)
    setRenameOpen(false)
  }, [renameDraft, renameProject, projectId])

  const confirmDelete = React.useCallback(() => {
    removeProject(projectId)
    setDeleteOpen(false)
    if (pathname === `/app/projects/${projectId}`) {
      router.push('/app')
    }
    onClick?.()
  }, [removeProject, projectId, pathname, router, onClick])

  if (collapsed) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          'group relative flex h-9 w-full min-w-0 items-center rounded-md pr-0.5',
          active
            ? 'bg-[#eef6fc] text-[#1e40af] hover:bg-[#e8f2fc]'
            : 'text-ibl-neutral hover:bg-[#f4f4f4]',
        )}
      >
        <Link
          href={href}
          onClick={onClick}
          title={label}
          className={cn(
            'flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-0 text-left text-[14px] font-normal transition-colors',
            active ? 'text-[#1e40af]' : 'text-ibl-neutral',
          )}
        >
          <Folder
            strokeWidth={1.5}
            className={cn(
              'size-4 shrink-0',
              active ? 'text-[#1e40af]' : 'text-ibl-neutral',
            )}
          />
          <span
            className={cn('min-w-0 flex-1 truncate', active && 'text-[#1e40af]')}
          >
            {label}
          </span>
        </Link>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-600 outline-none transition-opacity',
                'opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100',
                'focus-visible:pointer-events-auto focus-visible:opacity-100',
                'data-[state=open]:pointer-events-auto data-[state=open]:opacity-100',
                'hover:bg-black/[0.06] focus-visible:ring-2 focus-visible:ring-[#c4c4c8] focus-visible:ring-offset-1 focus-visible:ring-offset-[#fafafa]',
              )}
              aria-label={`More options for ${label}`}
            >
              <MoreHorizontal className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="right"
            sideOffset={6}
            className="w-[min(calc(100vw-2rem),220px)] rounded-xl border border-neutral-200 bg-white p-1 text-neutral-900 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)]"
          >
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
              onClick={() => {
                setPopoverOpen(false)
                setRenameOpen(true)
              }}
            >
              <Pencil className="size-4 shrink-0 text-neutral-600" strokeWidth={2} aria-hidden />
              Rename Project
            </button>
            <div className="my-0.5 h-px bg-neutral-200" />
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-ibl transition-colors hover:bg-ibl-soft"
              onClick={() => {
                setPopoverOpen(false)
                setDeleteOpen(true)
              }}
            >
              <Trash2 className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              Delete Project
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="gap-4 sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Update how this project appears in the sidebar.</DialogDescription>
          </DialogHeader>
          <Input
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                saveRename()
              }
            }}
            className="text-[14px]"
            autoFocus
            aria-label="Project name"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveRename}
              disabled={!renameDraft.trim()}
              className="border-0 bg-gradient-to-r from-ibl to-ibl-indigo text-white shadow-sm transition-[filter,box-shadow] hover:brightness-[1.04] hover:shadow-[0_2px_10px_rgba(114,132,255,0.35)] active:brightness-[0.98] disabled:opacity-40"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes &ldquo;{label}&rdquo; from your sidebar. Files and instructions stored for
              this project will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="border-0 bg-gradient-to-r from-ibl to-ibl-indigo text-white shadow-sm transition-[filter,box-shadow] hover:brightness-[1.04] hover:shadow-[0_2px_10px_rgba(114,132,255,0.35)] active:brightness-[0.98]"
              onClick={() => {
                confirmDelete()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function SidebarButton({
  icon: Icon,
  label,
  onClick,
  collapsed,
  active,
  activeTone = 'neutral',
}: {
  icon: NavIcon
  label: string
  onClick: () => void
  collapsed: boolean
  active?: boolean
  activeTone?: 'brand' | 'neutral'
}) {
  if (collapsed) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        navRowClassName,
        active &&
          (activeTone === 'neutral'
            ? 'bg-[#f4f4f4] hover:bg-[#f4f4f4]'
            : 'bg-[#eef6fc] text-[#1e40af] hover:bg-[#e8f2fc]'),
      )}
    >
      <Icon
        strokeWidth={1.5}
        className={cn(
          'size-4 shrink-0',
          active && activeTone === 'brand' ? 'text-[#1e40af]' : 'text-ibl-neutral',
        )}
      />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
    </button>
  )
}

function SidebarRecentLink({
  href,
  label,
  active,
  onClick,
  collapsed,
}: {
  href: string
  label: string
  active?: boolean
  onClick?: () => void
  collapsed: boolean
}) {
  if (collapsed) {
    return null
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      title={label}
      className={cn(
        'flex h-9 w-full min-w-0 items-center rounded-md px-2 pl-8 text-left text-[14px] font-normal transition-colors',
        active
          ? 'bg-[#eef6fc] text-[#1e40af] hover:bg-[#e8f2fc]'
          : 'text-ibl-neutral hover:bg-[#f4f4f4]',
      )}
    >
      <span className={cn('min-w-0 flex-1 truncate', active && 'text-[#1e40af]')}>
        {label}
      </span>
    </Link>
  )
}

function SidebarNavDivider() {
  return (
    <div
      role="separator"
      className="my-3 h-px w-full shrink-0 bg-[#e9e9ea]"
      aria-hidden
    />
  )
}

type SidebarNotification = {
  id: string
  title: string
  description: string
  timeAgo: string
  unread: boolean
}

const DEMO_SIDEBAR_NOTIFICATIONS: SidebarNotification[] = [
  {
    id: 'permissions',
    title: 'Permissions are changing in Onyx',
    description: 'Roles are moving to group-based permissions. Click for details.',
    timeAgo: '3 hours ago',
    unread: true,
  },
  {
    id: 'v320',
    title: 'Onyx v3.2.0 is available!',
    description: "Check out what's new in v3.2.0",
    timeAgo: '23 hours ago',
    unread: true,
  },
  {
    id: 'connectors',
    title: 'New connector: Google Drive',
    description: 'Index shared drives and files from your workspace.',
    timeAgo: '2 days ago',
    unread: true,
  },
  {
    id: 'maintenance',
    title: 'Scheduled maintenance complete',
    description: 'All services are operating normally.',
    timeAgo: '4 days ago',
    unread: false,
  },
]

function formatUnreadBadge(count: number) {
  if (count <= 0) return null
  if (count > 9) return '9+'
  return String(count)
}

function SidebarNotificationsPanel({
  notifications,
  onBack,
  onMarkAllRead,
  onNotificationClick,
}: {
  notifications: SidebarNotification[]
  onBack: () => void
  onMarkAllRead: () => void
  onNotificationClick: (id: string) => void
}) {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="flex max-h-[min(420px,calc(100dvh-8rem))] flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-2 py-2.5">
        <div className="flex min-w-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-ibl-neutral transition-colors hover:bg-[#f4f4f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4c4c8]"
            aria-label="Back to profile menu"
          >
            <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden />
          </button>
          <span className="truncate text-[14px] font-normal text-ibl-neutral">Notifications</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {unreadCount > 0 ? (
            <span className="text-[13px] font-medium text-ibl">{unreadCount} unread</span>
          ) : null}
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex size-8 items-center justify-center rounded-md text-ibl-neutral transition-colors hover:bg-[#f4f4f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4c4c8] disabled:pointer-events-none disabled:opacity-40"
            aria-label="Mark all as read"
          >
            <CheckCheck className="size-4" strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2">
        <span className="shrink-0 text-[11px] font-medium text-[#9ca3af]">New</span>
        <div className="h-px min-w-0 flex-1 bg-[#e9e9ea]" aria-hidden />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
        <ul className="flex flex-col">
          {notifications.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNotificationClick(item.id)}
                className="flex w-full gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-[#f4f4f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c4c4c8] focus-visible:ring-offset-1"
              >
                <Megaphone
                  className="mt-0.5 size-4 shrink-0 text-ibl-neutral"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold leading-snug text-ibl-neutral">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-[#9ca3af]">
                    {item.description}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
                  <span className="whitespace-nowrap text-[11px] text-[#9ca3af]">{item.timeAgo}</span>
                  {item.unread ? (
                    <span
                      className="size-2 shrink-0 rounded-full bg-ibl"
                      aria-label="Unread"
                    />
                  ) : (
                    <span className="size-2 shrink-0" aria-hidden />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function SidebarProfileDropdown({
  collapsed,
  afterNavigate,
}: {
  collapsed: boolean
  afterNavigate?: () => void
}) {
  const router = useRouter()
  const done = () => afterNavigate?.()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [view, setView] = React.useState<'menu' | 'notifications'>('menu')
  const [notifications, setNotifications] = React.useState(DEMO_SIDEBAR_NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => n.unread).length
  const unreadBadge = formatUnreadBadge(unreadCount)

  React.useEffect(() => {
    if (!menuOpen) setView('menu')
  }, [menuOpen])

  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }, [])

  const markOneRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    )
  }, [])

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        {collapsed ? (
          <button
            type="button"
            aria-label={USERNAME}
            className={cn(
              newSessionCollapsedClassName,
              'relative font-semibold text-[10px] text-ibl-neutral',
            )}
          >
            {USER_INITIALS}
            {unreadBadge ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-[3px] text-[9px] font-bold text-white">
                {unreadBadge}
              </span>
            ) : null}
          </button>
        ) : (
          <button
            type="button"
            className={cn(navRowClassName, 'rounded-lg')}
            title="Profile"
          >
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded border border-[#e0e0e2] bg-white text-[9px] font-semibold leading-none text-ibl-neutral"
              aria-hidden
            >
              {USER_INITIALS}
            </span>
            <span className="min-w-0 flex-1 truncate text-left text-[14px] font-normal">
              {USERNAME}
            </span>
            {unreadBadge ? (
              <Badge className="h-5 min-w-5 justify-center rounded-full border-transparent bg-[#2563EB] px-1.5 py-0 text-[10px] font-semibold leading-none text-white hover:bg-[#2563EB]">
                {unreadBadge}
              </Badge>
            ) : null}
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={10}
        className="w-[min(calc(100vw-1rem),320px)] rounded-xl border border-neutral-200 bg-white p-0 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.2)] dark:border-border dark:bg-popover"
      >
        {view === 'notifications' ? (
          <SidebarNotificationsPanel
            notifications={notifications}
            onBack={() => setView('menu')}
            onMarkAllRead={markAllRead}
            onNotificationClick={markOneRead}
          />
        ) : (
          <>
            <div className="border-b border-neutral-200 px-3 py-3 dark:border-border">
              <p className="truncate text-[14px] font-semibold leading-snug text-ibl-neutral">
                {USER_EMAIL}
              </p>
            </div>
            <div className="p-1.5">
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-normal text-ibl-neutral focus:bg-[#f4f4f4] dark:text-foreground"
                onSelect={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  done()
                  router.push('/app/settings')
                }}
              >
                <SlidersHorizontal
                  className="size-4 shrink-0 text-ibl-neutral"
                  strokeWidth={1.75}
                  aria-hidden
                />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[14px] font-normal text-ibl-neutral focus:bg-[#f4f4f4] dark:text-foreground"
                onSelect={(e) => {
                  e.preventDefault()
                  setView('notifications')
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Bell
                    className="size-4 shrink-0 text-ibl-neutral"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="truncate">Notifications</span>
                </span>
                {unreadBadge ? (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-neutral-200 px-1.5 text-[10px] font-semibold leading-none text-ibl-neutral dark:bg-muted dark:text-foreground">
                    {unreadBadge}
                  </span>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-normal text-ibl-neutral focus:bg-[#f4f4f4] dark:text-foreground"
                onSelect={(e) => {
                  e.preventDefault()
                  done()
                }}
              >
                <CircleHelp
                  className="size-4 shrink-0 text-ibl-neutral"
                  strokeWidth={1.75}
                  aria-hidden
                />
                Help & FAQ
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-lg px-3 py-2.5 text-[14px] font-normal focus:bg-red-50 dark:focus:bg-red-950/30"
                onSelect={(e) => {
                  e.preventDefault()
                  setMenuOpen(false)
                  done()
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('isAuthenticated')
                  }
                  router.push('/')
                }}
              >
                <LogOut className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                Log Out
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0 bg-neutral-200 dark:bg-border" />
            <div className="flex items-center justify-end gap-2 px-3 py-2.5">
              <span className="text-[11px] font-medium text-[#9ca3af] underline decoration-[#9ca3af]/60 underline-offset-2">
                Onyx v3.3.0-cloud.12
              </span>
              <Image
                src="/logo.png"
                alt=""
                width={18}
                height={18}
                className="size-[18px] shrink-0 object-contain opacity-90"
              />
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarContentImpl({
  variant,
  afterNavigate,
}: {
  variant: SidebarNavVariant
  afterNavigate?: () => void
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { setSearchOpen, setConnectorsOpen, connectorsOpen, toggleSidebarCollapsed, setSidebarCollapsed } =
    useOnyxUI()

  const collapsed = variant === 'collapsed'
  const isAppHome = pathname === '/app'
  const isAdmin = pathname.startsWith('/app/admin')
  const isResources = pathname.startsWith('/app/resources')
  const isProjectsSection = pathname.startsWith('/app/projects')
  const projectFilter = searchParams.get('filter')

  const adminTab = isAdmin
    ? (searchParams.get('tab') ?? DEFAULT_ADMIN_TAB)
    : null
  const [adminNavFilter, setAdminNavFilter] = React.useState('')

  const filteredAdminSections = React.useMemo(() => {
    const q = adminNavFilter.trim().toLowerCase()
    if (!q) return ADMIN_NAV_SECTIONS
    return ADMIN_NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
    })).filter((s) => s.items.length > 0)
  }, [adminNavFilter])

  const done = () => afterNavigate?.()

  const expandRail = React.useCallback(() => {
    setSidebarCollapsed(false)
    done()
  }, [setSidebarCollapsed, done])

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col font-sans antialiased',
        collapsed ? 'overflow-visible px-2 pt-0 pb-5' : 'px-[10px] pt-0 pb-0',
      )}
    >
      <div
        className={cn(
          'mb-0 flex w-full shrink-0 items-center',
          collapsed
            ? 'h-[68px] flex-col justify-center py-2'
            : 'h-[70px] gap-2 px-1',
        )}
      >
        {!collapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2.5 leading-none tracking-tight">
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              className="size-[30px] shrink-0 object-contain"
              priority
              aria-hidden
            />
            <span className={brandWordmarkClassName}>vibe.ibl.ai</span>
          </div>
        )}
        {collapsed ? (
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#7d7e82] transition-colors hover:bg-[#f0f0f0] max-md:hidden"
          >
            <SidebarRailToggleIcon className="shrink-0 rotate-180" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleSidebarCollapsed}
            aria-label="Collapse sidebar"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#7d7e82] transition-colors hover:bg-[#f0f0f0] max-md:hidden"
          >
            <SidebarRailToggleIcon className="shrink-0" />
          </button>
        )}
      </div>

      <nav
        className={cn(
          'min-h-0 flex-1 pt-1',
          collapsed
            ? 'flex flex-col items-center gap-1 overflow-visible px-2 pb-2'
            : 'overflow-y-auto px-0 pb-2',
        )}
        aria-label={isAdmin ? 'Admin navigation' : 'Main navigation'}
      >
        {collapsed ? (
          isAdmin ? (
            <CollapsedNavFlyout
              icon={Settings}
              label="Admin"
              active={isAdmin}
              items={ADMIN_NAV_FLAT_FLYOUT}
              onIconClick={expandRail}
              afterNavigate={done}
            />
          ) : (
            <>
              <SidebarCollapsedLabelFlyout label="New Chat">
                <Link
                  href="/app"
                  onClick={done}
                  aria-label="New Chat"
                  className={newSessionCollapsedClassName}
                >
                  <SquarePen className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                </Link>
              </SidebarCollapsedLabelFlyout>

              <SidebarCollapsedLabelFlyout label="Search Chats">
                <button
                  type="button"
                  aria-label="Search Chats"
                  onClick={() => {
                    setSearchOpen(true)
                    done()
                  }}
                  className={navIconButtonClassName}
                >
                  <TextSearch
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-ibl-neutral"
                  />
                </button>
              </SidebarCollapsedLabelFlyout>

              <SidebarCollapsedLabelFlyout label="Resources">
                <Link
                  href="/app/resources"
                  onClick={done}
                  aria-label="Resources"
                  className={navIconButtonClassName}
                >
                  <Compass
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-ibl-neutral"
                  />
                </Link>
              </SidebarCollapsedLabelFlyout>

              <SidebarCollapsedLabelFlyout label="Connectors">
                <button
                  type="button"
                  onClick={() => {
                    setConnectorsOpen(true)
                    done()
                  }}
                  aria-label="Connectors"
                  className={cn(
                    navIconButtonClassName,
                    connectorsOpen && 'bg-[#f4f4f4]',
                  )}
                >
                  <Waypoints
                    strokeWidth={1.5}
                    className="size-4 shrink-0 text-ibl-neutral"
                  />
                </button>
              </SidebarCollapsedLabelFlyout>

              <SidebarNavDivider />

              <CollapsedNavFlyout
                icon={LayoutGrid}
                label="Projects"
                active={isProjectsSection}
                items={PROJECT_FILTER_LINKS.map((item) => ({
                  id: item.id,
                  label: item.label,
                  href: item.href,
                }))}
                onIconClick={expandRail}
                afterNavigate={done}
              />

              <SidebarNavDivider />

              <CollapsedNavFlyout
                icon={MessageSquare}
                label="Recents"
                items={RECENT_CHATS.map((chat) => ({
                  id: chat.id,
                  label: chat.label,
                  href: chat.href,
                }))}
                onIconClick={expandRail}
                afterNavigate={done}
              />
            </>
          )
        ) : isAdmin ? (
          <div className="space-y-1">
            <div className="px-1 pb-2 pt-0">
              <div className="relative">
                <TextSearch
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]"
                  strokeWidth={2}
                  aria-hidden
                />
                <Input
                  value={adminNavFilter}
                  onChange={(e) => setAdminNavFilter(e.target.value)}
                  placeholder="Search..."
                  className="h-9 border-[#e2e8f0] bg-white pl-9 text-[13px] text-neutral-800 placeholder:text-[#9ca3af]"
                  aria-label="Search admin navigation"
                />
              </div>
            </div>
            {filteredAdminSections.map((section, si) => (
              <div key={section.heading ?? `admin-sec-${si}`} className="space-y-0.5">
                {section.heading ? (
                  <p className={SIDEBAR_SECTION_LABEL_CLASS}>{section.heading}</p>
                ) : null}
                {section.items.map((item) => (
                  <SidebarLink
                    key={item.id}
                    href={adminNavItemHref(item)}
                    icon={item.icon}
                    label={item.label}
                    active={adminTab === item.id}
                    collapsed={collapsed}
                    onClick={done}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="px-0 pb-1">
              <SidebarLink
                href="/app"
                icon={SquarePen}
                label="New Chat"
                active={isAppHome && !connectorsOpen}
                collapsed={collapsed}
                onClick={() => {
                  setConnectorsOpen(false)
                  done()
                }}
                variant="primary"
              />
            </div>
            <SidebarButton
              icon={TextSearch}
              label="Search Chats"
              collapsed={collapsed}
              onClick={() => {
                setSearchOpen(true)
                done()
              }}
            />

            <SidebarLink
              href="/app/resources"
              icon={Compass}
              label="Resources"
              active={isResources && !connectorsOpen}
              activeTone="neutral"
              collapsed={collapsed}
              onClick={() => {
                setConnectorsOpen(false)
                done()
              }}
            />
            <SidebarButton
              icon={Waypoints}
              label="Connectors"
              active={connectorsOpen}
              collapsed={collapsed}
              onClick={() => {
                setConnectorsOpen(true)
                done()
              }}
            />

            <SidebarNavDivider />

            <p className={SIDEBAR_SECTION_LABEL_CLASS}>Projects</p>
            {PROJECT_FILTER_LINKS.map((item) => (
              <SidebarLink
                key={item.id}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={
                  item.id === 'all'
                    ? isProjectsSection && !projectFilter
                    : isProjectsSection && projectFilter === item.id
                }
                collapsed={collapsed}
                onClick={() => {
                  setConnectorsOpen(false)
                  done()
                }}
              />
            ))}

            <SidebarNavDivider />

            <p className={SIDEBAR_SECTION_LABEL_CLASS}>Recents</p>
            {RECENT_CHATS.map((chat) => (
              <SidebarRecentLink
                key={chat.id}
                href={chat.href}
                label={chat.label}
                collapsed={collapsed}
                onClick={done}
              />
            ))}
          </div>
        )}
      </nav>

      {collapsed ? (
        <div className="mt-auto flex shrink-0 flex-col items-center gap-0.5 border-t border-[#e2e8f0] px-2 py-3">
          <SidebarProfileDropdown collapsed afterNavigate={done} />
        </div>
      ) : (
        <div className="mt-auto shrink-0 space-y-0.5 border-t border-[#e2e8f0] px-0 py-2">
          <SidebarProfileDropdown collapsed={false} afterNavigate={done} />
        </div>
      )}
    </div>
  )
}

export function SidebarContent(props: {
  variant: SidebarNavVariant
  afterNavigate?: () => void
}) {
  return (
    <Suspense fallback={null}>
      <SidebarContentImpl {...props} />
    </Suspense>
  )
}

export function SidebarRail() {
  const { sidebarCollapsed } = useOnyxUI()
  const variant: SidebarNavVariant = sidebarCollapsed ? 'collapsed' : 'expanded'

  return (
    <aside
      className={cn(
        'relative hidden shrink-0 flex-col border-r border-[#e9e9ea] bg-[#fafafa] transition-[width] duration-200 ease-out md:flex',
        sidebarCollapsed
          ? 'w-sidebar-collapsed overflow-visible md:z-30'
          : 'w-sidebar-expanded',
      )}
    >
      <SidebarContent variant={variant} />
    </aside>
  )
}

export const Sidebar = SidebarRail

export function DashboardSidebar({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const { sidebarCollapsed } = useOnyxUI()
  const variant: SidebarNavVariant =
    mobileOpen || !sidebarCollapsed ? 'expanded' : 'collapsed'

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        'flex h-screen shrink-0 flex-col border-r border-[#e9e9ea] bg-[#fafafa] transition-[width,transform] duration-200 ease-out',
        'fixed inset-y-0 left-0 z-50 md:relative',
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        variant === 'collapsed'
          ? 'w-sidebar-collapsed overflow-visible md:z-30'
          : 'w-sidebar-expanded md:z-auto',
      )}
    >
      <SidebarContent variant={variant} afterNavigate={onMobileClose} />
    </aside>
  )
}
