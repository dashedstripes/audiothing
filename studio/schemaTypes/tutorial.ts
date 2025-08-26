import {defineField} from 'sanity'
import {defineType} from 'sanity'

const tutorial = defineType({
  type: 'document',
  name: 'tutorial',
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
        source: 'title',
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
      name: 'steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'step',
          fields: [
            {
              type: 'string',
              name: 'heading',
            },
            {type: 'array', name: 'details', of: [{type: 'block'}]},
          ],
        },
      ],
    }),
    defineField({
      name: 'workflow',
      type: 'workflow',
      group: 'workflow',
    }),
  ],
})

export default tutorial
