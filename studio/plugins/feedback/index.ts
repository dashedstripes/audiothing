import {definePlugin} from 'sanity'
import FeedbackLayout from './components/FeedbackLayout'
import devRequest from './schemaTypes/devRequest'

export const feedback = ({
  onCreate,
  integrations,
  integrationOnly,
}: {
  onCreate: (document: any) => void
  integrations: [{onCreate: (document: any) => Promise<void>}]
  integrationOnly?: boolean
}) => {
  async function internalOnCreate(document) {
    onCreate(document)

    integrations.forEach(async (integration) => {
      await integration.onCreate(document)
    })
  }

  return definePlugin({
    name: 'feedback',
    schema: {
      types: [devRequest],
    },
    studio: {
      components: {
        layout: (props) => FeedbackLayout(props, internalOnCreate, integrationOnly),
      },
    },
  })()
}
