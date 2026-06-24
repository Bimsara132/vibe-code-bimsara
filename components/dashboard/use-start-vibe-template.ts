'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { useProjects } from '@/components/projects-context'
import { startVibeTemplateProject } from '@/lib/iblai/start-vibe-template'
import type { VibeTemplate } from '@/lib/iblai/vibe-templates'

export function useStartVibeTemplate() {
  const router = useRouter()
  const { createProject, isCreating } = useProjects()
  const [startingTemplateId, setStartingTemplateId] = useState<string | null>(null)

  const startTemplate = useCallback(
    async (template: VibeTemplate) => {
      if (startingTemplateId || isCreating) return

      setStartingTemplateId(template.id)
      try {
        const started = await startVibeTemplateProject(template, createProject, router)
        if (!started) {
          toast.error('Could not create project. Try again.')
        }
      } catch {
        toast.error('Could not create project. Try again.')
      } finally {
        setStartingTemplateId(null)
      }
    },
    [createProject, isCreating, router, startingTemplateId],
  )

  return {
    startTemplate,
    startingTemplateId,
    isStarting: Boolean(startingTemplateId) || isCreating,
  }
}
