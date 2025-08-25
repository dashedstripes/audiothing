import {DocumentBadgeProps} from 'sanity'

export function InReviewBadge(props: DocumentBadgeProps) {
  if (props.published) return null
  return {
    label: 'In Review',
    color: 'warning',
  }
}
