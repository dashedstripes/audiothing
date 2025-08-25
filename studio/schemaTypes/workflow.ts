import {defineField} from 'sanity'
import {defineType} from 'sanity'

const workflow = defineType({
  type: 'object',
  name: 'workflow',
  fields: [
    defineField({
      type: 'string',
      name: 'status',
      options: {
        list: [
          {title: 'In Review', value: 'inReview'},
          {title: 'Accepted', value: 'accepted'},
        ],
      },
    }),
  ],
  initialValue: {
    status: 'inReview',
  },
})

export default workflow
