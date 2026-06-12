'use client'

import { useGetUserMetadataEdxQuery } from '@iblai/iblai-js/data-layer'
import { useState } from 'react'

import { useIblaiUser } from '@/lib/iblai/use-iblai-user'
import { cn } from '@/lib/utils'

type UserAvatarProps = {
  className?: string
  size?: 'xs' | 'sm'
}

export function UserAvatar({ className, size = 'xs' }: UserAvatarProps) {
  const { username, initials } = useIblaiUser()
  const [imageFailed, setImageFailed] = useState(false)

  const { data } = useGetUserMetadataEdxQuery(
    { params: { username } },
    { skip: !username },
  )

  const imageUrl =
    !imageFailed && data?.profile_image?.has_image
      ? data.profile_image.image_url_small ??
        data.profile_image.image_url_large ??
        data.profile_image.image_url_full ??
        null
      : null

  return (
    <span
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded border border-[#e0e0e2] bg-white font-semibold leading-none text-ibl-neutral',
        size === 'xs' ? 'size-4 text-[9px]' : 'size-8 text-[10px]',
        className,
      )}
      aria-hidden
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  )
}
