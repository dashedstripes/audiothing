import {DocumentActionProps, useClient} from 'sanity'
import {useDocumentOperation} from 'sanity'

export default function DeleteButton(props: DocumentActionProps) {
  const client = useClient({apiVersion: '2024-07-11'})

  const {del} = useDocumentOperation(props.id, props.type)

  function handle() {
    try {
      client.delete(`workflow-${props.id}`)
    } catch {
      console.log('no workflow to delete')
    }

    del.execute()
    props.onComplete()
  }

  return {
    label: 'Delete',
    tone: 'critical',
    onHandle: handle,
  }
}
