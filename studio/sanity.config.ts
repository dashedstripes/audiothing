import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {assumeRole} from './plugins/assumeRole'
import {workflows} from './plugins/workflows'

export default defineConfig({
  name: 'default',
  title: 'AudioThing',

  projectId: 'n3ipr1xb',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    assist(),
    assumeRole([]),
    workflows(['news', 'tutorial']),
  ],

  schema: {
    types: schemaTypes,
  },
})
