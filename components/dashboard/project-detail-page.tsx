'use client'

import { useParams, useSearchParams } from 'next/navigation'

import { VibeBuildChat } from '@/components/iblai/vibe-build-chat'
import { resolvePendingBuild } from '@/lib/iblai/pending-build'

export function ProjectDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const newParam = searchParams.get('new')
  const pendingBuild = resolvePendingBuild(newParam)

  const projectId =
    typeof params.projectId === 'string'
      ? params.projectId
      : Array.isArray(params.projectId)
        ? params.projectId[0]
        : ''

  if (!projectId) return null

  return (
    <VibeBuildChat
      projectId={projectId}
      initialPrompt={pendingBuild?.prompt ?? ''}
      useCanvas={pendingBuild?.useCanvas ?? false}
      buildNonce={pendingBuild?.nonce}
    />
  )
}
