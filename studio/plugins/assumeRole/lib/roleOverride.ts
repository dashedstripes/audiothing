import type {CurrentUser, Role} from 'sanity'

export interface RoleOverride {
  version: 1
  roles: Role[]
  updatedAt: string
}

// Keyed per project + dataset so multiple studios/workspaces don't share an override
export const storageKey = (projectId: string, dataset: string) =>
  `assumeRole:v1:${projectId}:${dataset}`

export function readOverride(key: string): RoleOverride | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== 1 || !Array.isArray(parsed.roles)) return null
    return parsed as RoleOverride
  } catch {
    return null
  }
}

export function writeOverride(key: string, roles: Role[]): void {
  const record: RoleOverride = {version: 1, roles, updatedAt: new Date().toISOString()}
  localStorage.setItem(key, JSON.stringify(record))
}

export function clearOverride(key: string): void {
  localStorage.removeItem(key)
}

// The config file is also evaluated by the Sanity CLI in node, where window doesn't exist
export function isDev(): boolean {
  if ((import.meta as {env?: {DEV?: boolean}}).env?.DEV === true) return true
  return (
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname)
  )
}

/**
 * Mutates the shared currentUser reference in place so every role-gated config
 * resolver sees the assumed roles. Only affects client-side role checks — never
 * server-enforced permissions.
 */
export function applyRoleOverride(currentUser: CurrentUser | null | undefined, key: string): void {
  if (!currentUser || !isDev()) return
  const override = readOverride(key)
  if (!override) return
  currentUser.roles = override.roles
}
