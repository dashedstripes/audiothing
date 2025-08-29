import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {InReviewBadge} from './badges/InReviewBadge'
import SubmitReviewAction from './actions/SubmitReviewAction'

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
        return [SubmitReviewAction, ...prev]
      } else {
        return prev
      }
    },
    badges: (prev, context) => {
      return [InReviewBadge, ...prev]
    },
  },
})
