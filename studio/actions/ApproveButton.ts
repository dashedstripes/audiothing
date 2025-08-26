import {useState} from 'react'
import {DocumentActionProps} from 'sanity'
import {useDocumentOperation} from 'sanity'

export default function ApproveButton(props: DocumentActionProps) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isUpdating, setIsUpdating] = useState(false)

  if (props?.draft?.workflow?.status != 'review') return null

  return {
    label: isUpdating ? 'Updating…' : 'Approve',
    disabled: publish.disabled,
    onHandle: () => {
      setIsUpdating(true)
      patch.execute([{set: {workflow: {status: 'approved'}}}])
      props.onComplete()
    },
  }
}
