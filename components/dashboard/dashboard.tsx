'use client'

import { OnyxUIProvider } from '@/components/onyx-shell-context'
import { ProjectsProvider } from '@/components/projects-context'

import { DashboardShell } from './dashboard-shell'

export function Dashboard() {
  return (
    <OnyxUIProvider>
      <ProjectsProvider>
        <div className="flex h-screen bg-white">
          <DashboardShell />
        </div>
      </ProjectsProvider>
    </OnyxUIProvider>
  )
}
