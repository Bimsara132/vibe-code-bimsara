'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { SdkMcpConnectors } from '@/components/iblai/sdk-mcp-connectors'
import { useOnyxUI } from '@/components/onyx-shell-context'

export function ConnectorsPanel() {
  const { setConnectorsOpen } = useOnyxUI()

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConnectorsOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [setConnectorsOpen])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Connectors"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      <div className="pointer-events-auto absolute inset-x-0 top-14 bottom-0 flex min-h-0 flex-col overflow-hidden rounded-none bg-white shadow-none md:top-[196px] md:right-[10px] md:bottom-[10px] md:rounded-[10px] md:border md:border-neutral-200 md:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-ibl-neutral">Connectors</h2>
            <p className="mt-0.5 text-[13px] text-[#9ca3af]">
              Connect external tools to your agent via MCP.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConnectorsOpen(false)}
            className="inline-flex size-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100"
            aria-label="Close connectors"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <SdkMcpConnectors />
        </div>
      </div>
    </div>
  )
}
