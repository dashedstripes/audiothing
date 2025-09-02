import {definePlugin, Role} from 'sanity'

export const assumeRole = (roles: Role[]) => {
  return definePlugin({
    name: 'assume-role',
    document: {
      actions: (prev, context) => {
        if (roles && context.currentUser) {
          context.currentUser.roles = roles
        }
        return prev
      },
    },
  })()
}
