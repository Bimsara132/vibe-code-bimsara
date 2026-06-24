'use client'

import {
  ChevronDown,
  LayoutGrid,
  List,
  Rows3,
  Search,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUsername } from '@iblai/iblai-js/web-utils'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { AppLoadingScreen } from '@/components/app-loading-screen'
import { useProjects } from '@/components/projects-context'
import { Button } from '@/components/ui/button'
import { buildProjectHref } from '@/lib/iblai/project-route'
import { cn } from '@/lib/utils'

import { ProjectCard } from './project-card'
import { ProjectsFilterEmptyState } from './projects-filter-empty-state'
import { StarredEmptyState } from './starred-empty-state'

const ALL_FILTER_OPTIONS = [
  'Last edited',
  'Any visibility',
  'Any status',
  'All creators',
] as const

const OWNED_FILTER_OPTIONS = [
  'Last edited',
  'Any visibility',
  'Any status',
] as const

type ViewMode = 'grid' | 'list' | 'compact'
type ProjectFilter = 'starred' | 'created' | 'shared' | null

function ProjectsToolbar({
  query,
  onQueryChange,
  view,
  onViewChange,
  searchPlaceholder,
  filterOptions,
}: {
  query: string
  onQueryChange: (value: string) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  searchPlaceholder: string
  filterOptions: readonly string[]
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative min-w-0 flex-1 lg:max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9ca3af]"
          strokeWidth={2}
          aria-hidden
        />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-lg border border-neutral-200 bg-white pr-3 pl-10 text-[14px] text-ibl-neutral outline-none placeholder:text-[#9ca3af] focus-visible:border-neutral-300"
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((label) => (
          <button
            key={label}
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[13px] text-ibl-neutral transition-colors hover:bg-neutral-50"
          >
            {label}
            <ChevronDown className="size-3.5 text-neutral-500" strokeWidth={2} />
          </button>
        ))}

        <div className="ml-1 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-0.5">
          {(
            [
              { id: 'grid' as const, icon: LayoutGrid, label: 'Grid view' },
              { id: 'list' as const, icon: List, label: 'List view' },
              { id: 'compact' as const, icon: Rows3, label: 'Compact view' },
            ] as const
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={view === id}
              onClick={() => onViewChange(id)}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-md transition-colors',
                view === id
                  ? 'bg-neutral-100 text-ibl-neutral'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-ibl-neutral',
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectsGrid({
  projects,
  view,
  isProjectStarred,
  toggleStarProject,
}: {
  projects: {
    id: string
    name: string
    image?: string
    previewClass?: string
    edited?: string
  }[]
  view: ViewMode
  isProjectStarred: (id: string) => boolean
  toggleStarProject: (id: string) => void
}) {
  return (
    <div
      className={cn(
        'grid gap-5',
        view === 'grid' &&
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
        view === 'list' && 'grid-cols-1',
        view === 'compact' &&
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      )}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          edited={project.edited ?? 'Edited 3 days ago'}
          image={project.image}
          previewClass={project.previewClass}
          starred={isProjectStarred(project.id)}
          onToggleStar={() => toggleStarProject(project.id)}
        />
      ))}
    </div>
  )
}

function getPageTitle(filter: ProjectFilter) {
  switch (filter) {
    case 'starred':
      return 'Starred'
    case 'created':
      return 'Created by me'
    case 'shared':
      return 'Shared with me'
    default:
      return 'Projects'
  }
}

export function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')
  const filter: ProjectFilter =
    filterParam === 'starred' ||
    filterParam === 'created' ||
    filterParam === 'shared'
      ? filterParam
      : null

  const { projects, starredProjectIds, toggleStarProject, isProjectStarred, isLoading, isCreating, isError, createProject } =
    useProjects()
  const username = useUsername() ?? ''
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('grid')

  const handleCreateProject = useCallback(async () => {
    const project = await createProject()
    if (project) {
      router.push(buildProjectHref(project.id))
    }
  }, [createProject, router])

  const starredProjects = useMemo(
    () => projects.filter((project) => starredProjectIds.includes(project.id)),
    [projects, starredProjectIds],
  )

  const sharedProjects = useMemo(
    () => projects.filter((project) => project.shared),
    [projects],
  )

  const ownedProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          !project.shared ||
          (username && project.ownerUsername?.toLowerCase() === username.toLowerCase()),
      ),
    [projects, username],
  )

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = projects

    if (filter === 'starred') {
      list = starredProjects
    } else if (filter === 'shared') {
      list = sharedProjects
    } else if (filter === 'created') {
      list = ownedProjects
    }

    if (!q) return list
    return list.filter((project) => project.name.toLowerCase().includes(q))
  }, [filter, ownedProjects, projects, query, sharedProjects, starredProjects])

  const pageTitle = getPageTitle(filter)
  const showCreateButton = filter === null
  const searchPlaceholder =
    filter === 'created' ? 'Search your projects...' : 'Search projects...'
  const filterOptions = filter === null ? ALL_FILTER_OPTIONS : OWNED_FILTER_OPTIONS

  const showStarredEmptyState =
    filter === 'starred' && starredProjects.length === 0 && !query.trim()

  const showSharedEmptyState =
    filter === 'shared' && sharedProjects.length === 0 && !query.trim()

  if (isLoading) {
    return <AppLoadingScreen message="Loading projects…" />
  }

  if (showStarredEmptyState) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
      >
        <StarredEmptyState />
      </main>
    )
  }

  if (showSharedEmptyState) {
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
      >
        <ProjectsFilterEmptyState
          icon={Users}
          iconFilled={false}
          title="Projects you are invited to will appear here"
          ctaLabel="Start building"
          ctaHref="/app"
        />
      </main>
    )
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
        <header
          className={cn(
            'mb-6 flex items-center justify-between gap-4',
            !showCreateButton && 'justify-start',
          )}
        >
          <h1 className="text-[19px] font-semibold tracking-tight text-ibl-neutral">
            {pageTitle}
          </h1>
          {showCreateButton ? (
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={() => void handleCreateProject()}
              className="h-9 gap-1 rounded-lg border-neutral-200 bg-white px-3 text-[14px] font-normal text-ibl-neutral shadow-none hover:bg-neutral-50"
            >
              {isCreating ? 'Creating…' : 'Create'}
              <ChevronDown className="size-4 text-neutral-500" strokeWidth={2} />
            </Button>
          ) : null}
        </header>

        <ProjectsToolbar
          query={query}
          onQueryChange={setQuery}
          view={view}
          onViewChange={setView}
          searchPlaceholder={searchPlaceholder}
          filterOptions={filterOptions}
        />

        <p className="mb-4 text-[13px] text-[#9ca3af]">
          {isError ? 'Could not load projects' : 'Active in last 14 days'}
        </p>

        {filteredProjects.length > 0 ? (
          <ProjectsGrid
            projects={filteredProjects}
            view={view}
            isProjectStarred={isProjectStarred}
            toggleStarProject={toggleStarProject}
          />
        ) : (
          <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-[#fafafa] px-6 py-12 text-center">
            <p className="text-[15px] font-medium text-ibl-neutral">
              {query ? 'No projects match your search' : 'No projects yet'}
            </p>
            <p className="mt-1 max-w-sm text-[13px] text-[#9ca3af]">
              Create a new project to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
