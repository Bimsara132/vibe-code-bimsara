'use client'

import { Star, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ProjectsEmptyIllustration } from './projects-empty-illustration'

type ProjectsFilterEmptyStateProps = {
  icon?: LucideIcon
  iconFilled?: boolean
  title: string
  ctaLabel: string
  ctaHref: string
}

export function ProjectsFilterEmptyState({
  icon: Icon = Star,
  iconFilled = true,
  title,
  ctaLabel,
  ctaHref,
}: ProjectsFilterEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-[520px] flex-col items-center text-center">
        <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-neutral-100">
          <Icon
            className={cn(
              'size-5 text-neutral-700',
              iconFilled && 'fill-neutral-700',
            )}
            strokeWidth={iconFilled ? 0 : 1.75}
          />
        </div>

        <h2 className="max-w-sm text-[22px] leading-snug font-semibold tracking-tight text-ibl-neutral">
          {title}
        </h2>

        <Link
          href={ctaHref}
          className="mt-2 inline-flex h-8 items-center rounded-lg px-4 text-sm font-normal text-ibl-neutral shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] transition-colors hover:bg-neutral-100"
        >
          {ctaLabel}
        </Link>

        <div className="mt-3 w-full px-2 pb-2 sm:px-4">
          <ProjectsEmptyIllustration />
        </div>
      </div>
    </div>
  )
}
