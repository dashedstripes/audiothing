import {documentEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'
import {uuid} from '@sanity/uuid'

export const handler = documentEventHandler(async ({context, event}) => {
  const {data} = event

  const client = createClient({
    ...context.clientOptions,
    apiVersion: 'vX',
  })

  const targetLanguage = {
    id: 'es',
    title: 'Spanish',
  }

  // Create a consistent ID based on the source and target language.
  // This allows the function to override the document in the future
  const targetId = `${data._id}-${targetLanguage.id}`

  try {
    await client.agent.action.translate({
      // Replace with your schema ID
      schemaId: '_.schemas.default',

      // Tell the client to run the action asynchronously.
      // We don't need to wait for it to complete.
      async: true,

      // Tell the client the ID of the document to use as the source.
      documentId: data._id,

      // Set the language field to the target language.
      languageFieldPath: 'language',

      // Set the operation mode
      // createOrReplace will override the ID in future invocations.
      targetDocument: {
        operation: 'createOrReplace',
        _id: targetId,
      },

      // Set the 'from' and 'to' language
      fromLanguage: {id: 'en', title: 'English'},
      toLanguage: {id: targetLanguage.id, title: targetLanguage.title},

      protectedPhrases: ['AudioThing'],
    })
  } catch (error) {
    console.error(error)
  }
})
