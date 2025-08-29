import {useCallback, useEffect, useState} from 'react'
import {DocumentActionProps, useClient} from 'sanity'
import {useDocumentOperation} from 'sanity'
import {Workflow} from '../sanity.types'

export default function PublishButton(props: DocumentActionProps) {
  const client = useClient({apiVersion: '2024-07-11'})

  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(true)

  const {publish} = useDocumentOperation(props.id, props.type)

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

    setLoading(false)
  }, [client, props.id])

  useEffect(() => {
    getWorkflow()
  }, [client, props.id, getWorkflow])

  const getLabel = useCallback(() => {
    if (loading) {
      return 'Loading...'
    }

    if (!workflow) {
      return 'Submit for Review'
    }

    if (workflow.status == 'review') {
      return 'Publish'
    }

    return '...'
  }, [workflow, loading])

  function handle() {
    if (!workflow) {
      client.createIfNotExists({
        _id: `workflow-${props.id}`,
        _type: 'workflow',
        documentId: props.id,
        status: 'review',
      })
      getWorkflow()
      props.onComplete()
    }

    if (workflow?.status == 'review') {
      publish.execute()

      client.delete(`workflow-${props.id}`)
      props.onComplete()
    }
  }

  return {
    label: getLabel(),
    disabled: loading,
    onHandle: handle,
  }
}
