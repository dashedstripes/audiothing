import {defineField} from 'sanity'
import {defineType} from 'sanity'

const devRequest = defineType({
  type: 'document',
  name: 'devRequest',
  title: 'Development Request',
  fields: [
    defineField({
      type: 'text',
      name: 'message',
      title: 'Message',
      readOnly: true,
    }),
    defineField({
      type: 'url',
      name: 'url',
      title: 'URL',
      readOnly: true,
    }),
    defineField({
      name: 'submittedBy',
      title: 'Submitted By',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({
          name: 'id',
          title: 'User ID',
          type: 'string',
        }),
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'In Progress', value: 'in_progress'},
          {title: 'Under Review', value: 'under_review'},
          {title: 'Completed', value: 'completed'},
          {title: 'Rejected', value: 'rejected'},
        ],
      },
      initialValue: 'new',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'message',
      date: 'createdAt',
    },
    prepare(selection) {
      const {title, date} = selection

      function formatDate(date) {
        const d = new Date(date)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
        const year = d.getFullYear()
        return `${day}-${month}-${year}`
      }

      return {
        title: title,
        subtitle: formatDate(date),
      }
    },
  },
})

export default devRequest
