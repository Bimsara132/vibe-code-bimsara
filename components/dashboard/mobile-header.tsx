'use client'

import Image from 'next/image'

import { SidebarRailToggleIcon } from './sidebar'

type MobileHeaderProps = {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-center px-4 md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="absolute left-4 flex size-8 items-center justify-center rounded-[5px] border border-black/[0.06] bg-white/80 text-[#7d7e82] shadow-sm backdrop-blur-sm"
        aria-label="Open menu"
      >
        <SidebarRailToggleIcon className="size-4 shrink-0 rotate-180" />
      </button>
      <a href="/" className="flex items-center gap-2" aria-label="vibe.ibl.ai home">
        <Image
          src="/logo.png"
          alt=""
          width={15}
          height={15}
          className="size-[15px] shrink-0 object-contain"
          priority
          aria-hidden
        />
        <span className="bg-gradient-to-r from-ibl to-ibl-indigo bg-clip-text text-lg font-semibold lowercase tracking-normal text-transparent">
          vibe.ibl.ai
        </span>
      </a>
    </header>
  )
}
