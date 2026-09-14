import {defineArrayMember, defineType} from 'sanity'

const pageBuilder = defineType({
  type: 'array',
  name: 'pageBuilder',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'textSection'}),
    defineArrayMember({type: 'callToAction'}),
  ],
})

export default pageBuilder
