'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useProjects } from '@/components/projects-context'
import { cn } from '@/lib/utils'

import { ProjectCard } from './project-card'
import { TemplateCard } from './template-card'
import { useStartVibeTemplate } from './use-start-vibe-template'
import { VIBE_TEMPLATES } from '@/lib/iblai/vibe-templates'

const tabs = ['My projects', 'Recently viewed', 'Vibe templates'] as const

type Tab = (typeof tabs)[number]

export function ProjectPanel() {
  const { projects, isProjectStarred, toggleStarProject } = useProjects()
  const { startTemplate, startingTemplateId, isStarting } = useStartVibeTemplate()
  const [activeTab, setActiveTab] = useState<Tab>('My projects')

  const editedLabel = (project: (typeof projects)[number]) =>
    activeTab === 'Recently viewed'
      ? 'Viewed 2 days ago'
      : (project.edited ?? 'Edited 2 days ago')

  return (
    <div className="flex w-full flex-col">
      <div className="relative mb-5 flex shrink-0 items-center justify-between gap-2 px-4 lg:px-8">
        <div
          role="tablist"
          className="inline-flex max-w-fit overflow-x-auto rounded-lg bg-black/[0.04] p-1 shadow-sm max-md:mx-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative z-10 inline-flex h-8 min-w-12 shrink-0 items-center justify-center rounded-lg px-3 text-sm whitespace-nowrap transition-colors',
                activeTab === tab
                  ? 'bg-white font-medium text-ibl-neutral shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800',
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <Link
          href="/app/resources"
          className="hidden h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-sm font-normal text-ibl-neutral transition-colors hover:bg-black/[0.04] md:flex"
        >
          <span className="px-0.5">Browse all</span>
          <ArrowRight className="size-5" />
        </Link>
      </div>

      <div
        role="tabpanel"
        className="mt-2 px-4 lg:px-8"
        aria-label={activeTab}
      >
        {activeTab === 'Vibe templates' ? (
          <div className="grid w-full grid-cols-1 justify-items-center gap-5 pb-8 md:grid-cols-[repeat(auto-fill,minmax(345px,1fr))]">
            {VIBE_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                {...template}
                className="max-w-md"
                disabled={isStarting}
                isStarting={startingTemplateId === template.id}
                onSelect={() => void startTemplate(template)}
              />
            ))}
          </div>
        ) : (
          <div className="pb-8">
            <div className="flex flex-col gap-5">
              <div className="relative grid w-full grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(min(345px,calc((100%-40px)/3)),1fr))]">
                {projects.map((project) => (
                  <div key={project.id} className="w-full max-w-[420px]">
                    <ProjectCard
                      id={project.id}
                      name={project.name}
                      edited={editedLabel(project)}
                      starred={isProjectStarred(project.id)}
                      onToggleStar={() => toggleStarProject(project.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
