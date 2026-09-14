// article-review-workflow.ts
import {
  defineAction,
  defineActivity,
  defineField,
  defineStage,
  defineTransition,
  defineWorkflow,
} from '@sanity/workflow-engine/define'
export const articleReview = defineWorkflow({
  name: 'article-review',
  title: 'Article review',
  initialStage: 'drafting',
  fields: [
    defineField({
      type: 'subject',
      name: 'subject',
      required: true,
      initialValue: {type: 'input'},
    }),
  ],
  stages: [
    defineStage({
      name: 'drafting',
      activities: [
        defineActivity({
          name: 'write',
          actions: [defineAction({name: 'submit', status: 'done'})],
        }),
      ],
      transitions: [defineTransition({name: 'to-review', to: 'review'})],
    }),
    defineStage({
      name: 'review',
      activities: [
        defineActivity({
          name: 'sign-off',
          actions: [defineAction({name: 'approve', status: 'done'})],
        }),
      ],
      transitions: [defineTransition({name: 'to-published', to: 'published'})],
    }),
    defineStage({name: 'published'}),
  ],
})
