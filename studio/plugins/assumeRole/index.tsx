import {definePlugin, type Role} from 'sanity'
import {AssumeRoleNavbar} from './components/AssumeRoleNavbar'
import {applyRoleOverride, isDev, storageKey} from './lib/roleOverride'

export interface AssumeRoleOptions {
  /** Roles always shown in the picker, and the fallback if the Roles API is unavailable */
  roles?: Role[]
  /** Fetch the project's real roles from the Sanity Roles API (default: true) */
  fetchProjectRoles?: boolean
}

/**
 * Dev-only role switcher. Adds a navbar control to assume any project role and
 * spoofs `currentUser.roles` so role-gated studio logic (document actions,
 * badges, structure) behaves as that role. Client-side only — server-enforced
 * permissions are unaffected. Inert outside local dev.
 */
export const assumeRole = definePlugin<AssumeRoleOptions | void>((options) => ({
  name: 'assume-role',
  // `tools` resolves eagerly during workspace resolution — before any UI mounts
  // and before document action/badge resolvers run — so the override applies
  // regardless of plugin order, and re-applies whenever the auth store re-emits
  // a fresh currentUser object.
  tools: (prev, context) => {
    applyRoleOverride(context.currentUser, storageKey(context.projectId, context.dataset))
    return prev
  },
  document: {
    actions: (prev, context) => {
      applyRoleOverride(context.currentUser, storageKey(context.projectId, context.dataset))
      return prev
    },
    badges: (prev, context) => {
      applyRoleOverride(context.currentUser, storageKey(context.projectId, context.dataset))
      return prev
    },
  },
  ...(isDev()
    ? {
        studio: {
          components: {
            navbar: (props) => <AssumeRoleNavbar {...props} options={options ?? {}} />,
          },
        },
      }
    : {}),
}))
