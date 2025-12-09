import FeedbackButton from './FeedbackButton'

export default function FeedbackLayout(props, onCreate, integrationOnly) {
  return (
    <>
      <FeedbackButton onCreate={onCreate} integrationOnly={integrationOnly} />
      {props.renderDefault(props)}
    </>
  )
}
