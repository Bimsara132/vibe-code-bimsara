'use client'

import { Link2, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import { ProjectCardMenu } from './project-card-menu'

type ProjectCardProps = {
  id?: string
  name: string
  edited: string
  starred?: boolean
  onToggleStar?: () => void
  className?: string
}

export function ProjectCard({
  id,
  name,
  edited,
  starred = false,
  onToggleStar,
  className,
}: ProjectCardProps) {
  const projectHref = id ? `/app/projects/${id}` : undefined

  const thumbnail = (
    <div className="relative mb-3 flex flex-col">
      <div className="group/thumb relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-black/[0.06] bg-white">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 object-contain opacity-40"
            aria-hidden
          />
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onToggleStar?.()
          }}
          aria-label={starred ? 'Unstar project' : 'Star project'}
          aria-pressed={starred}
          className={cn(
            'absolute top-2 right-2 z-[5] flex size-8 items-center justify-center rounded-md bg-muted/80 text-neutral-500 backdrop-blur-sm transition-all',
            starred
              ? 'opacity-100'
              : 'opacity-100 md:opacity-0 md:group-hover/thumb:opacity-100 md:group-hover:opacity-100',
          )}
        >
          <Star
            className={cn('size-5', starred && 'fill-amber-400 text-amber-400')}
            strokeWidth={starred ? 0 : 1.75}
          />
        </button>
      </div>
    </div>
  )

  const meta = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
        B
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="min-w-0 truncate text-[14px] font-normal text-ibl-neutral">{name}</p>
        <p className="text-sm text-[#9ca3af]">{edited}</p>
      </div>
    </>
  )

  const actions = (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label={`Copy link for ${name}`}
        className="flex size-7 items-center justify-center rounded-lg text-neutral-600 opacity-100 transition-opacity hover:bg-muted md:opacity-0 md:group-hover:opacity-100"
      >
        <Link2 className="size-5" />
      </button>
      <ProjectCardMenu projectId={id} projectName={name} />
    </div>
  )

  const classNames = cn(
    'group relative flex w-full flex-col text-left select-none',
    className,
  )

  if (projectHref) {
    return (
      <div data-project-card="true" className={classNames}>
        <Link href={projectHref} className="block">
          {thumbnail}
        </Link>
        <div className="flex items-center gap-2">
          <Link href={projectHref} className="flex min-w-0 flex-1 items-center gap-2">
            {meta}
          </Link>
          {actions}
        </div>
      </div>
    )
  }

  return (
    <div data-project-card="true" className={classNames}>
      <div className="block">{thumbnail}</div>
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">{meta}</div>
        {actions}
      </div>
    </div>
  )
}
