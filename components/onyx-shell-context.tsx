'use client'

import * as React from 'react'

type OnyxUIContextValue = {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebarCollapsed: () => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  connectorsOpen: boolean
  setConnectorsOpen: (open: boolean) => void
  createProjectOpen: boolean
  setCreateProjectOpen: (open: boolean) => void
}

const OnyxUIContext = React.createContext<OnyxUIContextValue | null>(null)

export function OnyxUIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [connectorsOpen, setConnectorsOpen] = React.useState(false)
  const [createProjectOpen, setCreateProjectOpen] = React.useState(false)

  const value = React.useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebarCollapsed: () => setSidebarCollapsed((prev) => !prev),
      searchOpen,
      setSearchOpen,
      connectorsOpen,
      setConnectorsOpen,
      createProjectOpen,
      setCreateProjectOpen,
    }),
    [sidebarCollapsed, searchOpen, connectorsOpen, createProjectOpen],
  )

  return <OnyxUIContext.Provider value={value}>{children}</OnyxUIContext.Provider>
}

export function useOnyxUI() {
  const context = React.useContext(OnyxUIContext)
  if (!context) {
    throw new Error('useOnyxUI must be used within OnyxUIProvider')
  }
  return context
}
