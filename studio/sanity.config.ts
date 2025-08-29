import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {InReviewBadge} from './badges/InReviewBadge'
import SubmitReviewAction from './actions/SubmitReviewAction'
import DeleteAction from './actions/DeleteAction'

export default defineConfig({
  name: 'default',
  title: 'AudioThing',

  projectId: 'n3ipr1xb',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), assist()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      const roles = {
        admin: false,
        writer: false,
        reviewer: false,
      }

      context.currentUser?.roles.forEach((role) => {
        switch (role.name) {
          case 'administrator':
            roles.admin = true
            break
          case 'writer':
            roles.writer = true
            break
          case 'reviewer':
            roles.reviewer = true
            break
        }
      })

      const workflowsEnabled = ['news', 'tutorials']

      if (roles.admin) {
        if (workflowsEnabled.includes(context.schemaType)) {
          return prev.map((action) => (action.action === 'delete' ? DeleteAction : action))
        }
        return prev
      }

      if (roles.reviewer) {
        if (workflowsEnabled.includes(context.schemaType)) {
          return prev.filter((action) => action.action !== 'delete')
        }
      }

      if (roles.writer) {
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
})
