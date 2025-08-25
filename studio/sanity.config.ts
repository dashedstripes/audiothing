import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {assist} from '@sanity/assist'
import ApproveButton from './actions/ApproveButton'
import {InReviewBadge} from './badges/InReviewBadge'
import {ReadyToPublishBadge} from './badges/ReadyToPublishBadge'
import PublishButton from './actions/PublishButton'

export default defineConfig({
  name: 'default',
  title: 'AudioThing',

  projectId: 'n3ipr1xb',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) => {
        return S.list()
          .id('main')
          .title('Content')
          .items([
            S.listItem()
              .id('News')
              .title('News')
              .child(
                S.list()
                  .id('NewsList')
                  .title('News')
                  .items([
                    S.listItem()
                      .id('NewsInReview')
                      .title('In Review')
                      .child(
                        S.documentList()
                          .id('InReview')
                          .filter(`_type == "news" && workflow.status == "review"`),
                      ),
                    S.listItem()
                      .id('NewsApproved')
                      .title('Approved')
                      .child(
                        S.documentList()
                          .id('NewsApproved')
                          .filter(`_type == "news" && workflow.status == "approved"`),
                      ),
                    S.divider(),
                    S.listItem()
                      .id('AllNews')
                      .title('All News')
                      .child(S.documentList().id('NewsAll').filter(`_type == "news"`)),
                  ]),
              ),
          ])
      },
    }),
    visionTool(),
    assist(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType == 'news') {
        return [
          ApproveButton,
          ...prev.map((originalAction) => {
            if (originalAction.action == 'publish') {
              return PublishButton
            } else {
              return originalAction
            }
          }),
        ]
      } else {
        return prev
      }
    },
    badges: (prev, context) => {
      return [InReviewBadge, ReadyToPublishBadge, ...prev]
    },
  },
})
