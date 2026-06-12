export type TenantRecord = {
  key?: string
  is_admin?: boolean
}

export function readTenants(): TenantRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const tenantsRaw = localStorage.getItem('tenants')
    if (!tenantsRaw) return []

    const parsed = JSON.parse(tenantsRaw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
