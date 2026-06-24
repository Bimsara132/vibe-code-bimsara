import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { savePendingBuild } from '@/lib/iblai/pending-build'
import type { VibeTemplate } from '@/lib/iblai/vibe-templates'

type CreateProjectFn = (options?: {
  name?: string
  description?: string
}) => Promise<{ id: string } | null>

export async function startVibeTemplateProject(
  template: VibeTemplate,
  createProject: CreateProjectFn,
  router: AppRouterInstance,
) {
  const project = await createProject({
    name: template.projectName,
    description: template.description,
  })

  if (!project) return false

  const nonce = String(Date.now())
  savePendingBuild({
    nonce,
    prompt: template.starterPrompt,
    useCanvas: template.useCanvas ?? true,
  })

  router.push(`/app/projects/${project.id}?new=${nonce}`)
  return true
}
