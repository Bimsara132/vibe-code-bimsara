'use client'

import { TemplateCard } from './template-card'
import { RESOURCE_TEMPLATES } from './templates-data'

export function ResourcesPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white"
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8">
          <h1 className="text-[19px] font-semibold tracking-tight text-ibl-neutral">
            Resources
          </h1>
          <p className="mt-1 text-[15px] text-[#9ca3af]">
            Start from a template to build your next project
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {RESOURCE_TEMPLATES.map((template) => (
            <TemplateCard key={template.name} {...template} />
          ))}
        </div>
      </div>
    </main>
  )
}
