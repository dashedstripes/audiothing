import {DocumentBadgeProps} from 'sanity'

export function ReadyToPublishBadge(props: DocumentBadgeProps) {
  if (props.published) return null

  return {
    label: 'Ready to Publish',
    color: 'success',
  }
}
