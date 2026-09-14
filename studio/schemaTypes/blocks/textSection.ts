import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

const textSection = defineType({
  type: 'object',
  name: 'textSection',
  icon: BlockContentIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'array',
      name: 'body',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Untitled',
        subtitle: 'Text Section',
        media: BlockContentIcon,
      }
    },
  },
})

export default textSection
