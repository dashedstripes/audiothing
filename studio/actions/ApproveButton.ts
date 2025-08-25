import {useState} from 'react'
import {useDocumentOperation} from 'sanity'

export default function ApproveButton(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const [isUpdating, setIsUpdating] = useState(false)

  const status = props?.draft?.workflow?.status || null
  if (status !== 'inReview') return null

  return {
    label: isUpdating ? 'Updating…' : 'Approve',
    disabled: publish.disabled,
    onHandle: () => {
      setIsUpdating(true)
      patch.execute([{set: {workflow: {status: 'accepted'}}}])
      props.onComplete()
    },
  }
}
