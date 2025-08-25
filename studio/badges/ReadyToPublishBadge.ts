export function ReadyToPublishBadge(props) {
  const status = props?.draft?.workflow?.status || null

  if (status !== 'accepted') return null

  return {
    label: 'Ready to Publish',
    color: 'success',
  }
}
