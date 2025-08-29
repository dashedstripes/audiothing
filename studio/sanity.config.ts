import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {InReviewBadge} from './badges/InReviewBadge'
import {ReadyToPublishBadge} from './badges/ReadyToPublishBadge'
import PublishButton from './actions/PublishButton'
import DeleteButton from './actions/DeleteButton'

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
      if (context.schemaType == 'news') {
        return [
          ...prev.map((originalAction) => {
            if (originalAction.action == 'publish') {
              return PublishButton
            } else if (originalAction.action == 'delete') {
              return DeleteButton
            } else {
              return originalAction
            }
          }),
        ]
      } else {
        return prev
      }
    },
    badges: (prev, context) => {
      return [InReviewBadge, ReadyToPublishBadge, ...prev]
    },
  },
})
