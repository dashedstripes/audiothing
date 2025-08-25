import {defineField} from 'sanity'
import {defineType} from 'sanity'

const news = defineType({
  type: 'document',
  name: 'news',
  groups: [{title: 'Workflow', name: 'workflow'}],
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      options: {
        source: (doc, context) => context.parent.title,
      },
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      fields: [
        defineField({
          type: 'text',
          name: 'imagePrompt',
          title: 'ImagePrompt',
        }),
        defineField({
          type: 'text',
          name: 'alt',
          title: 'Alternative Text',
        }),
      ],
      options: {
        aiAssist: {
          imageInstructionField: 'imagePrompt',
          imageDescriptionField: 'alt',
        },
      },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'workflow',
      type: 'workflow',
      group: 'workflow',
    }),
  ],
})

export default news
