const PROJECT_DETAIL_PATH = /^\/app\/projects\/([^/?#]+)$/

export function parseProjectIdFromPath(path: string): string | null {
  const match = path.match(PROJECT_DETAIL_PATH)
  if (!match?.[1]) return null
  return decodeURIComponent(match[1])
}

export function buildProjectHref(projectId: string | number): string {
  return `/app/projects/${projectId}`
}
