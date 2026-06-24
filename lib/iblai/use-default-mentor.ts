'use client'

import { useGetMentorsQuery, useGetPublicMentorsQuery } from '@iblai/iblai-js/data-layer'
import { useUsername } from '@iblai/iblai-js/web-utils'

import config from '@/lib/iblai/config'
import { resolveAppTenant } from '@/lib/iblai/tenant'

function pickMentorId(
  results: Array<{ unique_id?: string }> | undefined,
): string {
  return results?.find((mentor) => mentor.unique_id)?.unique_id ?? ''
}

export function useDefaultMentorId() {
  const configuredId = config.defaultAgentId()
  const tenantKey = resolveAppTenant()
  const username = useUsername() ?? ''
  const skipDiscovery = !tenantKey

  const {
    data: featuredMentors,
    isLoading: isFeaturedLoading,
    isFetching: isFeaturedFetching,
  } = useGetMentorsQuery(
    {
      org: tenantKey,
      username,
      featured: true,
      limit: 1,
      includeMainPublicMentors: true,
    },
    { skip: skipDiscovery || !username },
  )

  const featuredId = pickMentorId(featuredMentors?.results)

  const {
    data: userMentors,
    isLoading: isUserMentorsLoading,
    isFetching: isUserMentorsFetching,
  } = useGetMentorsQuery(
    {
      org: tenantKey,
      username,
      limit: 1,
      includeMainPublicMentors: true,
      orderBy: 'recently_accessed_at',
      orderDirection: 'desc',
    },
    { skip: skipDiscovery || !username || Boolean(featuredId) },
  )

  const userMentorId = pickMentorId(userMentors?.results)

  const {
    data: publicMentors,
    isLoading: isPublicLoading,
    isFetching: isPublicFetching,
  } = useGetPublicMentorsQuery(
    {
      tenant: tenantKey,
      query: 'website',
      limit: 1,
      includeMainPublicMentors: true,
    },
    { skip: skipDiscovery || Boolean(featuredId || userMentorId) },
  )

  const publicMentorId = pickMentorId(publicMentors?.results)

  // Prefer API-discovered mentors — env default may not exist for this user/tenant.
  const mentorId = featuredId || userMentorId || publicMentorId || configuredId

  const isLoading =
    !mentorId &&
    (isFeaturedLoading ||
      isFeaturedFetching ||
      isUserMentorsLoading ||
      isUserMentorsFetching ||
      isPublicLoading ||
      isPublicFetching)

  return {
    mentorId,
    isLoading,
  }
}
