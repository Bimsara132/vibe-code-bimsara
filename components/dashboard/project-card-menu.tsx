'use client'

import type { ReactNode } from 'react'

import {
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  CopyPlus,
  ExternalLink,
  Folder,
  MoreHorizontal,
  Pencil,
  Settings,
  Trash2,
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type ProjectCardMenuProps = {
  projectId?: string
  projectName: string
}

function MenuItemIcon({ children }: { children: ReactNode }) {
  return <span className="flex size-4 shrink-0 items-center justify-center">{children}</span>
}

export function ProjectCardMenu({ projectId, projectName }: ProjectCardMenuProps) {
  const projectHref = projectId ? `/app/projects/${projectId}` : undefined

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`More actions for ${projectName}`}
          className="flex size-7 items-center justify-center rounded-lg text-neutral-600 opacity-100 transition-opacity hover:bg-muted md:opacity-0 md:group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          <MoreHorizontal className="size-5" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={6}
        className="min-w-[220px] rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <DropdownMenuItem
          className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100"
          disabled={!projectHref}
          onClick={() => {
            if (projectHref) window.open(projectHref, '_blank', 'noopener,noreferrer')
          }}
        >
          <MenuItemIcon>
            <ExternalLink className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Open in new tab
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled
          className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-neutral-400"
        >
          <MenuItemIcon>
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          View published site
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled
          className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-neutral-400"
        >
          <MenuItemIcon>
            <BarChart3 className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Analytics
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100">
          <MenuItemIcon>
            <Folder className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Move to folder
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100">
          <MenuItemIcon>
            <CopyPlus className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Remix
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100">
          <MenuItemIcon>
            <Pencil className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Rename
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100">
          <MenuItemIcon>
            <ArrowLeftRight className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Transfer to workspace
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ibl-neutral hover:bg-neutral-100">
          <MenuItemIcon>
            <Settings className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-neutral-200" />

        <DropdownMenuItem
          variant="destructive"
          className={cn(
            'gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-red-600 hover:bg-red-50',
          )}
        >
          <MenuItemIcon>
            <Trash2 className="size-4" strokeWidth={1.75} />
          </MenuItemIcon>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
