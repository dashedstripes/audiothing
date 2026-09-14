import {defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

const hero = defineType({
  type: 'object',
  name: 'hero',
  icon: StarIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'text',
      name: 'subtitle',
      rows: 2,
    }),
    defineField({
      type: 'image',
      name: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          type: 'text',
          name: 'alt',
          title: 'Alternative Text',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled',
        subtitle: 'Hero',
        media: media ?? StarIcon,
      }
    },
  },
})

export default hero
