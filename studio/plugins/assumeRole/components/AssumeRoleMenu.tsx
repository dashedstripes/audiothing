import {CheckmarkIcon, UserIcon} from '@sanity/icons'
import {Button, Menu, MenuButton, MenuDivider, MenuItem} from '@sanity/ui'
import {useCallback} from 'react'
import type {Role} from 'sanity'
import {clearOverride, writeOverride, type RoleOverride} from '../lib/roleOverride'

export function AssumeRoleMenu({
  storageKey,
  override,
  roles,
  loading,
}: {
  storageKey: string
  override: RoleOverride | null
  roles: Role[]
  loading: boolean
}) {
  const activeRoleName = override?.roles[0]?.name

  // Reload so every role-gated resolver (actions, badges, structure) re-resolves
  // consistently — resolved document actions are memoized per pane and won't pick
  // up a live role change.
  const selectRole = useCallback(
    (role: Role) => {
      writeOverride(storageKey, [role])
      window.location.reload()
    },
    [storageKey],
  )

  const reset = useCallback(() => {
    clearOverride(storageKey)
    window.location.reload()
  }, [storageKey])

  return (
    <MenuButton
      id="assume-role-menu"
      button={
        <Button
          fontSize={1}
          padding={2}
          mode="ghost"
          icon={UserIcon}
          text={override ? `Role: ${override.roles.map((r) => r.title).join(', ')}` : 'Assume role'}
          tone={override ? 'caution' : 'default'}
          loading={loading}
        />
      }
      menu={
        <Menu>
          {roles.map((role) => (
            <MenuItem
              key={role.name}
              text={role.title}
              iconRight={role.name === activeRoleName ? CheckmarkIcon : undefined}
              onClick={() => selectRole(role)}
            />
          ))}
          <MenuDivider />
          <MenuItem
            text="Use real roles"
            iconRight={override ? undefined : CheckmarkIcon}
            disabled={!override}
            onClick={reset}
          />
        </Menu>
      }
      popover={{portal: true, placement: 'bottom-end'}}
    />
  )
}
