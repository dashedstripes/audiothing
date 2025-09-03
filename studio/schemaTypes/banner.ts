import {defineField} from 'sanity'
import {defineType} from 'sanity'

const banner = defineType({
  type: 'document',
  name: 'banner',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'string',
      name: 'subtitle',
    }),
  ],
})

export default banner
