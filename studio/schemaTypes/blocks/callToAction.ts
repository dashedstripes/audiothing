import {defineField, defineType} from 'sanity'
import {BoltIcon} from '@sanity/icons'

const callToAction = defineType({
  type: 'object',
  name: 'callToAction',
  icon: BoltIcon,
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'string',
      name: 'buttonText',
    }),
    defineField({
      type: 'url',
      name: 'buttonUrl',
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ['http', 'https', 'mailto'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'buttonText',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `Call to Action · ${subtitle}` : 'Call to Action',
        media: BoltIcon,
      }
    },
  },
})

export default callToAction
