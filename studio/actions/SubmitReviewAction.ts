import {useEffect, useState} from 'react'
import {DocumentActionProps, useClient} from 'sanity'

export default function SubmitReviewAction(props: DocumentActionProps) {
  const client = useClient({apiVersion: '2024-07-11'})

  const [hasWorkflow, setHasWorkflow] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWorkflow() {
      const fetchedWorkflow = await client.fetch(
        `*[_type == "workflow" && documentId == $documentId]`,
        {
          documentId: props.id,
        },
      )

      if (fetchedWorkflow.length) {
        setHasWorkflow(true)
      }

      setLoading(false)
    }

    fetchWorkflow()
  }, [client, props.id])

  if (hasWorkflow) return null

  return {
    label: 'Submit for Review',
    disabled: loading,
    onHandle: async () => {
      setLoading(true)
      await client.createIfNotExists({
        _id: `workflow-${props.id}`,
        _type: 'workflow',
        documentId: props.id,
        status: 'review',
      })
      props.onComplete()
    },
  }
}
