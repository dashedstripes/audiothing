import {WarningOutlineIcon} from '@sanity/icons'
import {Card, Flex, Text} from '@sanity/ui'
import {useWorkspace, type NavbarProps} from 'sanity'
import type {AssumeRoleOptions} from '../index'
import {readOverride, storageKey} from '../lib/roleOverride'
import {useAvailableRoles} from '../lib/useAvailableRoles'
import {AssumeRoleMenu} from './AssumeRoleMenu'

export function AssumeRoleNavbar(props: NavbarProps & {options: AssumeRoleOptions}) {
  const {options, ...navbarProps} = props
  const {projectId, dataset} = useWorkspace()
  const key = storageKey(projectId, dataset)
  const override = readOverride(key)
  const {roles, loading} = useAvailableRoles(options.roles, options.fetchProjectRoles ?? true)

  return (
    <>
      <Card tone={override ? 'caution' : 'transparent'} padding={1} borderBottom>
        <Flex align="center" gap={3} justify={override ? 'center' : 'flex-end'} paddingX={2}>
          {override && (
            <Flex align="center" gap={2}>
              <Text size={1}>
                <WarningOutlineIcon />
              </Text>
              <Text size={1} weight="medium">
                Assuming role: {override.roles.map((r) => r.title).join(', ')} — dev override (UI
                role checks only)
              </Text>
            </Flex>
          )}
          <AssumeRoleMenu storageKey={key} override={override} roles={roles} loading={loading} />
        </Flex>
      </Card>
      {navbarProps.renderDefault(navbarProps)}
    </>
  )
}
