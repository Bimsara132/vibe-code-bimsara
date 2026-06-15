'use client'

import * as React from 'react'

import { getTemplatePreview } from '@/components/dashboard/templates-data'

export type Project = {
  id: string
  name: string
  templateName?: string
  image?: string
  previewClass?: string
  edited?: string
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

function projectFromTemplate(
  id: string,
  name: string,
  templateName: string,
  edited: string,
): Project {
  const template = getTemplatePreview(templateName)
  return {
    id,
    name,
    templateName,
    image: template?.image,
    previewClass: template?.previewClass,
    edited,
  }
}

const INITIAL_PROJECTS: Project[] = [
  projectFromTemplate(
    'presentation-showcase',
    'Presentation Showcase',
    'vibe.ibl.ai',
    'Edited 1 hour ago',
  ),
  projectFromTemplate(
    'build-your-dream-site',
    'Build Your Dream Site',
    'Architect Portfolio Website Template',
    'Edited yesterday',
  ),
  projectFromTemplate('hello-friend', 'Hello Friend', 'EventSpark', 'Edited 2 days ago'),
  projectFromTemplate(
    'friendly-assistant',
    'Your Friendly Assistant',
    'AssetWise',
    'Edited 2 days ago',
  ),
  projectFromTemplate(
    'commission-tracker',
    'Commission Tracker',
    'CommCalc',
    'Edited 4 days ago',
  ),
  projectFromTemplate('habit-flow', 'Habit Flow', 'Continuum', 'Edited 1 week ago'),
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
