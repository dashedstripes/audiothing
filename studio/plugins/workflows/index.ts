import {definePlugin} from 'sanity'
import DeleteAction from './actions/DeleteAction'
import SubmitReviewAction from './actions/SubmitReviewAction'
import {InReviewBadge} from './badges/InReviewBadge'
import workflow from './schemaTypes/workflow'

export const workflows = (enabledTypes: string[]) => {
  return definePlugin({
    name: 'workflows',
    schema: {
      types: [workflow],
    },
    document: {
      actions: (prev, context) => {
        const workflowsEnabled = enabledTypes

        if (context.currentUser?.roles.some((role) => role.name === 'administrator')) {
          if (workflowsEnabled.includes(context.schemaType)) {
            return prev.map((action) => (action.action === 'delete' ? DeleteAction : action))
          }
          return prev
        }

        if (context.currentUser?.roles.some((role) => role.name === 'reviewer')) {
          if (workflowsEnabled.includes(context.schemaType)) {
            return prev.filter((action) => action.action !== 'delete')
          }
        }

        if (context.currentUser?.roles.some((role) => role.name === 'writer')) {
          if (workflowsEnabled.includes(context.schemaType) && context.versionType == 'draft') {
            return [SubmitReviewAction, ...prev.filter((action) => action.action !== 'publish')]
          }
        }

        return prev
      },
      badges: (prev, context) => {
        return [InReviewBadge, ...prev]
      },
    },
  })()
}
