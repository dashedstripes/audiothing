import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {assumeRole} from './plugins/assumeRole'
import {workflows} from './plugins/workflows'
import {documentInternationalization} from '@sanity/document-internationalization'

export default defineConfig({
  name: 'default',
  title: 'AudioThing',

  projectId: 'n3ipr1xb',
  dataset: 'development',

  plugins: [
    structureTool(),
    visionTool(),
    assist({
      translate: {
        document: {
          languageField: 'language',
          documentTypes: ['news'],
        },
      },
    }),
    assumeRole([]),
    workflows(['news', 'tutorial']),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'es', title: 'Spanish'},
      ],
      schemaTypes: ['news'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
