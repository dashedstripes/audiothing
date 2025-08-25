import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import ApproveButton from './actions/ApproveButton'
import {InReviewBadge} from './badges/InReviewBadge'
import {ReadyToPublishBadge} from './badges/ReadyToPublishBadge'

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
      return [ApproveButton, ...prev]
    },
    badges: (prev, context) => {
      return [InReviewBadge, ReadyToPublishBadge, ...prev]
    },
  },
})
