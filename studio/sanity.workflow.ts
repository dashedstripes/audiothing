// sanity.workflow.ts
import {defineWorkflowConfig} from '@sanity/workflow-engine/define'
import {articleReview} from './workflows/article-review-workflow'
export default defineWorkflowConfig({
  deployments: [
    {
      name: 'default',
      tag: 'default',
      expectedMinReaderModel: 2,
      workflowResource: {
        type: 'dataset',
        id: 'n3ipr1xb.production',
      },
      definitions: [articleReview],
    },
  ],
})
