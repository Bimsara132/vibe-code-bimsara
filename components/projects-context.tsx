'use client'

import * as React from 'react'
import {
  useCreateUserProjectMutation,
  useDeleteUserProjectMutation,
  useGetMentorsQuery,
  useGetUserProjectsQuery,
  useUpdateUserProjectMutation,
} from '@iblai/iblai-js/data-layer'
import { useUsername } from '@iblai/iblai-js/web-utils'

import { formatEditedDate } from '@/lib/iblai/format-edited-date'
import { resolveAppTenant } from '@/lib/iblai/tenant'
import { useAuthTokensReady } from '@/lib/iblai/use-auth-tokens-ready'

export type Project = {
  id: string
  name: string
  description?: string
  shared: boolean
  ownerUsername?: string
  edited?: string
}

type ProjectsContextValue = {
  projects: Project[]
  starredProjectIds: string[]
  isLoading: boolean
  isCreating: boolean
  isError: boolean
  createProject: (options?: {
    name?: string
    description?: string
  }) => Promise<Project | null>
  renameProject: (id: string, name: string) => Promise<void>
  removeProject: (id: string) => Promise<void>
  toggleStarProject: (id: string) => void
  isProjectStarred: (id: string) => boolean
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null)

const STARRED_PROJECTS_STORAGE_KEY = 'iblai-starred-project-ids'

function readStarredProjectIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STARRED_PROJECTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

function writeStarredProjectIds(ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STARRED_PROJECTS_STORAGE_KEY, JSON.stringify(ids))
}

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const tenantKey = React.useMemo(() => resolveAppTenant(), [])
  const username = useUsername() ?? ''
  const tokensReady = useAuthTokensReady()

  const { data: accessibleMentors } = useGetMentorsQuery(
    {
      org: tenantKey,
      username,
      limit: 1,
      includeMainPublicMentors: true,
      orderBy: 'recently_accessed_at',
      orderDirection: 'desc',
    },
    { skip: !tokensReady || !tenantKey || !username },
  )

  const accessibleMentorId =
    accessibleMentors?.results?.find((mentor) => mentor.unique_id)?.unique_id ?? ''

  const [starredProjectIds, setStarredProjectIds] = React.useState<string[]>([])

  React.useEffect(() => {
    setStarredProjectIds(readStarredProjectIds())
  }, [])

  const { data, isLoading, isFetching, isError } = useGetUserProjectsQuery(
    {
      tenantKey,
      username,
      params: { limit: 100, sort: '-updated_at' },
    },
    { skip: !tokensReady || !tenantKey || !username },
  )

  const [updateUserProject] = useUpdateUserProjectMutation()
  const [deleteUserProject] = useDeleteUserProjectMutation()
  const [createUserProject, { isLoading: isCreating }] = useCreateUserProjectMutation()

  const projects = React.useMemo<Project[]>(() => {
    return (data?.results ?? []).map((project) => ({
      id: String(project.id),
      name: project.name,
      description: project.description,
      shared: project.shared,
      ownerUsername: project.owner_username,
      edited: formatEditedDate(project.updated_at),
    }))
  }, [data?.results])

  const mapApiProject = React.useCallback(
    (project: {
      id: number
      name: string
      description: string
      shared: boolean
      owner_username: string
      updated_at: string
    }): Project => ({
      id: String(project.id),
      name: project.name,
      description: project.description,
      shared: project.shared,
      ownerUsername: project.owner_username,
      edited: formatEditedDate(project.updated_at),
    }),
    [],
  )

  const createProject = React.useCallback(async (options?: { name?: string; description?: string }) => {
    if (!tenantKey) return null

    const baseData = {
      name: options?.name?.trim() || 'Untitled project',
      description: options?.description?.trim() || '',
      shared: false,
    }

    try {
      const created = await createUserProject({
        tenantKey,
        username,
        data: accessibleMentorId
          ? { ...baseData, mentors_to_add: [accessibleMentorId] }
          : baseData,
      }).unwrap()

      return mapApiProject(created)
    } catch (error) {
      const mentorError =
        accessibleMentorId &&
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 400

      if (!mentorError) {
        console.error('[ibl.ai] Failed to create project', error)
        return null
      }

      try {
        const created = await createUserProject({
          tenantKey,
          username,
          data: baseData,
        }).unwrap()

        return mapApiProject(created)
      } catch (retryError) {
        console.error('[ibl.ai] Failed to create project', retryError)
        return null
      }
    }
  }, [accessibleMentorId, createUserProject, mapApiProject, tenantKey, username])

  const renameProject = React.useCallback(
    async (id: string, name: string) => {
      const trimmed = name.trim()
      if (!trimmed || !tenantKey) return

      await updateUserProject({
        tenantKey,
        username,
        id: Number(id),
        data: { name: trimmed },
      }).unwrap()
    },
    [tenantKey, updateUserProject, username],
  )

  const removeProject = React.useCallback(
    async (id: string) => {
      if (!tenantKey) return

      await deleteUserProject({
        tenantKey,
        username,
        id: Number(id),
      }).unwrap()

      setStarredProjectIds((prev) => {
        const next = prev.filter((starredId) => starredId !== id)
        writeStarredProjectIds(next)
        return next
      })
    },
    [deleteUserProject, tenantKey, username],
  )

  const toggleStarProject = React.useCallback((id: string) => {
    setStarredProjectIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((starredId) => starredId !== id)
        : [...prev, id]
      writeStarredProjectIds(next)
      return next
    })
  }, [])

  const isProjectStarred = React.useCallback(
    (id: string) => starredProjectIds.includes(id),
    [starredProjectIds],
  )

  const value = React.useMemo(
    () => ({
      projects,
      starredProjectIds,
      isLoading: !tokensReady || isLoading || isFetching,
      isCreating,
      isError,
      createProject,
      renameProject,
      removeProject,
      toggleStarProject,
      isProjectStarred,
    }),
    [
      projects,
      starredProjectIds,
      tokensReady,
      isLoading,
      isFetching,
      isCreating,
      isError,
      createProject,
      renameProject,
      removeProject,
      toggleStarProject,
      isProjectStarred,
    ],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
  const context = React.useContext(ProjectsContext)
  if (!context) {
    throw new Error('useProjects must be used within ProjectsProvider')
  }
  return context
}
