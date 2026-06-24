'use client'

import Image from 'next/image'

import { cn } from '@/lib/utils'
import type { VibeTemplate } from '@/lib/iblai/vibe-templates'

export function TemplateCard({
  name,
  description,
  image,
  previewClass,
  className,
  onSelect,
  disabled,
  isStarting,
}: VibeTemplate & {
  className?: string
  onSelect?: () => void
  disabled?: boolean
  isStarting?: boolean
}) {
  return (
    <article
      className={cn('group relative flex w-full flex-col', className)}
      aria-label={name}
    >
      <div className="relative mb-2 aspect-video">
        <button
          type="button"
          onClick={onSelect}
          disabled={disabled}
          className={cn(
            'group relative aspect-video w-full overflow-hidden rounded-xl bg-muted transition-opacity',
            disabled ? 'cursor-not-allowed opacity-70' : 'hover:opacity-90',
          )}
          aria-label={`Start from ${name} template`}
          aria-busy={isStarting}
        >
          {image ? (
            <Image
              alt={name}
              src={image}
              fill
              className="rounded-xl border border-black/[0.06] object-cover object-top"
              unoptimized
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border border-black/[0.06]',
                previewClass ?? 'ibl-card-gradient',
              )}
            >
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
          {isStarting ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-[13px] font-medium text-ibl-neutral">
              Creating project…
            </span>
          ) : null}
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <span className="truncate font-normal text-ibl-neutral">{name}</span>
        <span className="line-clamp-2 text-sm text-muted-foreground">{description}</span>
      </div>
    </article>
  )
}
