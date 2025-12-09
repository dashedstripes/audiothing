import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import {assumeRole} from './plugins/assumeRole'
import {workflows} from './plugins/workflows'
import {documentInternationalization} from '@sanity/document-internationalization'
import {feedback} from './plugins/feedback'

export default defineConfig({
  name: 'default',
  title: 'AudioThing',

  projectId: 'n3ipr1xb',
  dataset: process.env.SANITY_STUDIO_DATASET!,

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
    assumeRole([{title: 'writer', name: 'Writer'}]),
    workflows(['news', 'tutorial']),
    documentInternationalization({
      supportedLanguages: [
        {id: 'en', title: 'English'},
        {id: 'es', title: 'Spanish'},
      ],
      schemaTypes: ['news'],
    }),
    feedback({
      onCreate: (document) => console.log(document),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
