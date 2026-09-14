import {defineField, defineType} from 'sanity'

const page = defineType({
  type: 'document',
  name: 'page',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
    }),
    defineField({
      type: 'slug',
      name: 'slug',
      options: {source: 'title'},
    }),
    defineField({
      type: 'pageBuilder',
      name: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})

export default page
