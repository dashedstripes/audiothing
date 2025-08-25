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
          {title: 'In Review', value: 'review'},
          {title: 'Approved', value: 'approved'},
        ],
      },
    }),
  ],
  initialValue: {
    status: 'review',
  },
})

export default workflow
