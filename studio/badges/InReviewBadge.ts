export function InReviewBadge(props) {
  const status = props?.draft?.workflow?.status || null

  if (status !== 'inReview') return null

  return {
    label: 'In Review',
    color: 'warning',
  }
}
