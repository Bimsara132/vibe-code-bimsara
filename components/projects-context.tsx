'use client'

import * as React from 'react'

export type Project = {
  id: string
  name: string
}

type ProjectsContextValue = {
  projects: Project[]
  starredProjectIds: string[]
  sharedProjectIds: string[]
  renameProject: (id: string, name: string) => void
  removeProject: (id: string) => void
  toggleStarProject: (id: string) => void
  isProjectStarred: (id: string) => boolean
}

const ProjectsContext = React.createContext<ProjectsContextValue | null>(null)

const INITIAL_PROJECTS: Project[] = [
  { id: 'hello-friend', name: 'Hello Friend' },
  { id: 'friendly-assistant', name: 'Your Friendly Assistant' },
]

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(INITIAL_PROJECTS)
  const [starredProjectIds, setStarredProjectIds] = React.useState<string[]>([])
  const [sharedProjectIds] = React.useState<string[]>([])

  const renameProject = React.useCallback((id: string, name: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)))
  }, [])

  const removeProject = React.useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setStarredProjectIds((prev) => prev.filter((starredId) => starredId !== id))
  }, [])

  const toggleStarProject = React.useCallback((id: string) => {
    setStarredProjectIds((prev) =>
      prev.includes(id) ? prev.filter((starredId) => starredId !== id) : [...prev, id],
    )
  }, [])

  const isProjectStarred = React.useCallback(
    (id: string) => starredProjectIds.includes(id),
    [starredProjectIds],
  )

  const value = React.useMemo(
    () => ({
      projects,
      starredProjectIds,
      sharedProjectIds,
      renameProject,
      removeProject,
      toggleStarProject,
      isProjectStarred,
    }),
    [
      projects,
      starredProjectIds,
      sharedProjectIds,
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
