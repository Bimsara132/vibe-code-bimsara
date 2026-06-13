'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import { ProfileDialog } from '@/components/iblai/profile-dialog'
import { useOnyxUI } from '@/components/onyx-shell-context'
import { cn } from '@/lib/utils'

import { ConnectorsPanel } from './connectors-panel'
import { MainContent } from './main-content'
import { MobileHeader } from './mobile-header'
import { ProjectsPage } from './projects-page'
import { ResourcesPage } from './resources-page'
import { SearchChatsDialog } from './search-chats-dialog'
import { DashboardSidebar } from './sidebar'

function DashboardPage({ path }: { path: string }) {
  if (path.startsWith('/app/resources')) {
    return <ResourcesPage />
  }

  if (path.startsWith('/app/projects')) {
    return (
      <Suspense fallback={null}>
        <ProjectsPage />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={null}>
      <MainContent />
    </Suspense>
  )
}

export function DashboardShell() {
  const pathname = usePathname()
  const router = useRouter()
  const { connectorsOpen, setProfileOpen } = useOnyxUI()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [connectorsBackdropPath, setConnectorsBackdropPath] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (pathname.startsWith('/app/profile')) {
      setProfileOpen(true)
      router.replace('/app')
    }
  }, [pathname, router, setProfileOpen])

  useEffect(() => {
    if (!connectorsOpen) {
      setConnectorsBackdropPath(null)
      return
    }

    setConnectorsBackdropPath((current) => current ?? pathname)
  }, [connectorsOpen, pathname])

  const backgroundPath =
    connectorsOpen && connectorsBackdropPath ? connectorsBackdropPath : pathname

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 flex min-h-0 flex-col',
              connectorsOpen && 'pointer-events-none overflow-hidden',
            )}
            aria-hidden={connectorsOpen}
          >
            <DashboardPage path={backgroundPath} />
          </div>
          {connectorsOpen ? <ConnectorsPanel /> : null}
        </div>
      </div>

      <SearchChatsDialog />
      <ProfileDialog />
    </>
  )
}
