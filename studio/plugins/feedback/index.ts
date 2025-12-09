import {definePlugin} from 'sanity'
import FeedbackLayout from './components/FeedbackLayout'
import devRequest from './schemaTypes/devRequest'

export const feedback = ({onCreate, integrations}) => {
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
        layout: (props) => FeedbackLayout(props, internalOnCreate),
      },
    },
  })()
}
