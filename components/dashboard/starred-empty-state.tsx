'use client'

import { Star } from 'lucide-react'

import { ProjectsFilterEmptyState } from './projects-filter-empty-state'

export function StarredEmptyState() {
  return (
    <ProjectsFilterEmptyState
      icon={Star}
      title="Star projects to access them quickly from any workspace"
      ctaLabel="Browse projects"
      ctaHref="/app/projects"
    />
  )
}
