import {useState} from 'react'
import {DocumentActionProps} from 'sanity'
import {useDocumentOperation} from 'sanity'

export default function PublishButton(props: DocumentActionProps) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isUpdating, setIsUpdating] = useState(false)

  if (props?.draft?.workflow?.status != 'approved') return null

  return {
    label: isUpdating ? 'Updating…' : 'Publish',
    disabled: publish.disabled,
    onHandle: () => {
      setIsUpdating(true)
      publish.execute()
      // patch.execute([{set: {workflow: {status: 'review'}}}])
      props.onComplete()
    },
  }
}
