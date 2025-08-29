import {useState, useCallback, useEffect} from 'react'
import {useClient} from 'sanity'
import {DocumentBadgeProps} from 'sanity'
import {Workflow} from '../sanity.types'

export function InReviewBadge(props: DocumentBadgeProps) {
  const client = useClient({apiVersion: '2024-07-11'})

  const [workflow, setWorkflow] = useState<Workflow | null>(null)

  const getWorkflow = useCallback(async () => {
    const fetchedWorkflow = await client.fetch(
      `*[_type == "workflow" && documentId == $documentId]`,
      {
        documentId: props.id,
      },
    )

    if (fetchedWorkflow.length) {
      setWorkflow(fetchedWorkflow[0])
    }
  }, [client, props.id])

  useEffect(() => {
    getWorkflow()
  }, [client, props.id, getWorkflow])

  if (workflow?.status === 'review') {
    return {
      label: 'In Review',
      color: 'warning',
    }
  }

  return null
}
