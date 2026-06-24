'use client'

import {
  AgentSettingsProvider,
  McpTab,
} from '@iblai/iblai-js/web-containers/next'

import { useDefaultMentorId } from '@/lib/iblai/use-default-mentor'
import { useIblaiUser } from '@/lib/iblai/use-iblai-user'
import { resolveAppTenant } from '@/lib/iblai/tenant'

export function SdkMcpConnectors() {
  const tenantKey = resolveAppTenant()
  const { username } = useIblaiUser()
  const { mentorId, isLoading } = useDefaultMentorId()

  if (!tenantKey || !username) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-[14px] text-[#9ca3af]">
        Sign in to manage connectors.
      </div>
    )
  }

  if (isLoading || !mentorId) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-[14px] text-[#9ca3af]">
        Loading connectors...
      </div>
    )
  }

  return (
    <AgentSettingsProvider
      tenantKey={tenantKey}
      mentorId={mentorId}
      username={username}
      enableRBAC={false}
    >
      <div className="h-full min-h-0 overflow-y-auto bg-white px-4 py-4 md:px-6">
        <McpTab />
      </div>
    </AgentSettingsProvider>
  )
}
