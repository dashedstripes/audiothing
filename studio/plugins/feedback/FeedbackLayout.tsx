import FeedbackButton from './FeedbackButton'

export default function FeedbackLayout(props, onCreate) {
  return (
    <>
      <FeedbackButton onCreate={onCreate} />
      {props.renderDefault(props)}
    </>
  )
}
