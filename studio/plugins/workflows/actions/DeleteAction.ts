import {DocumentActionDescription, useDocumentOperation} from 'sanity'
import {DocumentActionProps, useClient} from 'sanity'
import {TrashIcon} from '@sanity/icons'

export default function DeleteAction(props: DocumentActionProps): DocumentActionDescription {
  const client = useClient({apiVersion: '2024-07-11'})
  const {del} = useDocumentOperation(props.id, props.type)

  return {
    label: 'Delete',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: async () => {
      await client.delete(`workflow-${props.id}`)
      del.execute()
      props.onComplete()
    },
  }
}
