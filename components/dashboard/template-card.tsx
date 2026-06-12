'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'

import type { Template } from './templates-data'

export function TemplateCard({
  name,
  description,
  image,
  className,
}: Template & { className?: string }) {
  return (
    <article
      className={cn('group relative flex w-full flex-col', className)}
      aria-label={name}
    >
      <div className="relative mb-2 aspect-video">
        <button
          type="button"
          className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted"
          aria-label={name}
        >
          {image ? (
            <Image
              alt={name}
              src={image}
              fill
              className="rounded-xl border border-black/[0.06] object-cover object-top transition-opacity duration-150 hover:opacity-80"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-black/[0.06] ibl-card-gradient">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 object-contain opacity-40"
                aria-hidden
              />
            </div>
          )}
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <span className="truncate font-normal text-ibl-neutral">{name}</span>
        <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>
      </div>
    </article>
  )
}
