import {defineBlueprint, defineDocumentFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'translate',
      event: {
        on: ['create', 'update'],
        filter: "_type == 'news' && language == 'en'",
        projection: '{_id}',
      },
    }),
  ],
})
