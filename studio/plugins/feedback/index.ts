import {definePlugin} from 'sanity'
import FeedbackLayout from './FeedbackLayout'
import devRequest from './schemaTypes/devRequest'

export const feedback = ({onCreate}) => {
  return definePlugin({
    name: 'feedback',
    schema: {
      types: [devRequest],
    },
    studio: {
      components: {
        layout: (props) => FeedbackLayout(props, onCreate),
      },
    },
  })()
}
