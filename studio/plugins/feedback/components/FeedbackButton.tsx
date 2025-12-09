import {Box, Button, Card, Dialog, Stack, Text, TextArea, useToast} from '@sanity/ui'
import {EnvelopeIcon} from '@sanity/icons'
import {useCallback, useState} from 'react'
import {useClient, useCurrentUser} from 'sanity'

export default function FeedbackButton({onCreate, integrationOnly}) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const onClose = useCallback(() => setOpen(false), [])
  const onOpen = useCallback(() => setOpen(true), [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const client = useClient({apiVersion: '2024-01-01'})

  const currentUser = useCurrentUser()

  async function submit() {
    if (!value) return

    setIsSubmitting(true)
    try {
      if (!integrationOnly) {
        // Create the document
        const result = await client.create({
          _type: 'devRequest',
          message: value,
          url: window.location.href || '',
          createdAt: new Date().toISOString(),
          submittedBy: {
            id: currentUser?.id,
            name: currentUser?.name,
            email: currentUser?.email,
          },
        })

        console.log('Document created:', result)

        onCreate(result)
      } else {
        onCreate({
          _type: 'devRequest',
          message: value,
          url: window.location.href || '',
          createdAt: new Date().toISOString(),
          submittedBy: {
            id: currentUser?.id,
            name: currentUser?.name,
            email: currentUser?.email,
          },
        })
      }

      // Clear form and close dialog
      setValue('')
      onClose()

      // Optional: Show success message
      toast.push({
        status: 'success',
        title: 'Feedback submitted successfully!',
        description: 'Your development team will review your message.',
      })
    } catch (error) {
      console.error('Error creating document:', error)
      toast.push({
        status: 'error',
        title: 'Failed to submit feedback',
        description: 'Please try again or contact support if the problem persists.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: '99999',
        bottom: '1rem',
        left: '1rem',
      }}
    >
      <Button
        fontSize={[1]}
        icon={EnvelopeIcon}
        padding={[3]}
        text="Contact Dev Team"
        tone="default"
        onClick={onOpen}
        disabled={open}
      />

      {open && (
        <Dialog
          header={
            <Stack padding={2} space={[4]}>
              <Text weight="semibold">Contact Your Development Team</Text>
              <Text muted={true}>
                Use this form to report issues or request features from the team that manages your
                Sanity setup
              </Text>
            </Stack>
          }
          id="request-feedback-dialog"
          onClose={onClose}
          zOffset={1000}
          width={[1]}
        >
          <Box padding={4}>
            <TextArea
              fontSize={[1]}
              onChange={(event) => setValue(event.currentTarget.value)}
              padding={[3, 3, 3, 4]}
              placeholder="Describe the issue or feature you'd like your development team to address..."
              value={value}
            />
            <Card paddingTop={[4]}>
              <Button
                fontSize={[1]}
                padding={[3]}
                icon={EnvelopeIcon}
                text="Send to Development Team"
                tone="default"
                type="submit"
                onClick={submit}
                disabled={!value || isSubmitting}
                loading={isSubmitting}
              />
            </Card>
          </Box>
        </Dialog>
      )}
    </div>
  )
}
