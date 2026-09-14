import {useEffect, useMemo, useState} from 'react'
import {useClient, useWorkspace, type Role} from 'sanity'

interface ProjectRole {
  name: string
  title: string
  description?: string
  appliesToUsers?: boolean
}

export type RoleSource = 'api' | 'config' | 'defaults'

const DEFAULT_ROLES: Role[] = [
  {name: 'administrator', title: 'Administrator'},
  {name: 'editor', title: 'Editor'},
  {name: 'contributor', title: 'Contributor'},
  {name: 'viewer', title: 'Viewer'},
]

/**
 * Roles offered in the picker: the project's real roles from the Roles API when
 * available, merged with any roles passed in plugin config. Falls back to the
 * config list, then built-in defaults, if the API call fails (e.g. 403 for
 * non-admin members).
 */
export function useAvailableRoles(
  configRoles: Role[] | undefined,
  fetchProjectRoles: boolean,
): {roles: Role[]; source: RoleSource; loading: boolean} {
  const client = useClient({apiVersion: '2024-01-01'})
  const {projectId} = useWorkspace()
  const [apiRoles, setApiRoles] = useState<Role[] | null>(null)
  const [loading, setLoading] = useState(fetchProjectRoles)

  useEffect(() => {
    if (!fetchProjectRoles) return undefined
    let cancelled = false

    client
      .request<ProjectRole[]>({url: `/projects/${projectId}/roles`})
      .then((result) => {
        if (cancelled) return
        setApiRoles(
          result
            .filter((role) => role.appliesToUsers !== false)
            .map((role) => ({name: role.name, title: role.title || role.name})),
        )
      })
      .catch((error) => {
        console.warn(
          '[assumeRole] Could not fetch project roles, falling back to configured roles.',
          error,
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client, projectId, fetchProjectRoles])

  return useMemo(() => {
    const merged = new Map<string, Role>()
    for (const role of apiRoles ?? []) merged.set(role.name, role)
    for (const role of configRoles ?? []) merged.set(role.name, role)
    if (merged.size === 0) for (const role of DEFAULT_ROLES) merged.set(role.name, role)

    const source: RoleSource = apiRoles ? 'api' : configRoles?.length ? 'config' : 'defaults'
    return {roles: [...merged.values()], source, loading}
  }, [apiRoles, configRoles, loading])
}
