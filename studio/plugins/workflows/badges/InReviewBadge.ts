import {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {DocumentBadgeProps} from 'sanity'
import {DocumentBadgeDescription} from 'sanity'

export function InReviewBadge(props: DocumentBadgeProps): DocumentBadgeDescription | null {
  const client = useClient({apiVersion: '2024-07-11'})
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function fetchWorkflow() {
      const fetchedWorkflow = await client.fetch(
        `*[_type == "workflow" && documentId == $documentId]`,
        {
          documentId: props.id,
        },
      )

      if (fetchedWorkflow.length) {
        setStatus(fetchedWorkflow[0].status)
      }
    }

    fetchWorkflow()
  }, [client, props.id])

  if (status === 'review') {
    return {
      label: 'In Review',
      color: 'warning',
    }
  }

  return null
}
