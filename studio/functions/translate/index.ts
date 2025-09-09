import {documentEventHandler} from '@sanity/functions'
import {createClient} from '@sanity/client'
import {KeyedObject, Reference} from 'sanity'
import {uuid} from '@sanity/uuid'
import {SanityClient} from 'sanity'

type TranslationReference = KeyedObject & {
  _type: 'internationalizedArrayReferenceValue'
  value: Reference
}

function createReference(
  key: string,
  ref: string,
  type: string,
  strengthenOnPublish: boolean = true,
): TranslationReference {
  return {
    _key: key,
    _type: 'internationalizedArrayReferenceValue',
    value: {
      _type: 'reference',
      _ref: ref,
      _weak: true,
      // If the user has configured weakReferences, we won't want to strengthen them
      ...(strengthenOnPublish ? {_strengthenOnPublish: {type}} : {}),
    },
  }
}

async function createTranslationMetadata(
  client: SanityClient,
  schemaType: string,
  sourceDocumentId: string,
  sourceLanguageId: string,
  targetDocumentId: string,
  targetLanguageId: string,
) {
  const transaction = client.transaction()

  sourceDocumentId = sourceDocumentId.replace('drafts.', '')
  targetDocumentId = targetDocumentId.replace('drafts.', '')

  const sourceReference = createReference(
    sourceLanguageId,
    sourceDocumentId,
    schemaType,
    true, // autosetting weak reference to true for now
  )

  const newTranslationReference = createReference(
    targetLanguageId,
    targetDocumentId,
    schemaType,
    true, // autosetting weak reference to true for now
  )

  const existingMetadata = await client.fetch(
    `*[_type == "translation.metadata" && $sourceId in translations[].value._ref]`,
    {
      sourceId: sourceDocumentId,
    },
  )

  const id = existingMetadata._id || uuid()

  // Create new metadata object to create a new metadata document if it doesn't exist
  const newMetadataDocument: any = {
    _id: id,
    _type: 'translation.metadata',
    schemaTypes: [schemaType], // This will need to be changed to the schema type that is 'selected'
    translations: [sourceReference],
  }

  transaction.createIfNotExists(newMetadataDocument)

  // Patch translation to metadata document
  const metadataPatch = client
    .patch(id)
    .setIfMissing({translations: [sourceReference]})
    .insert(`after`, `translations[-1]`, [newTranslationReference])

  transaction.patch(metadataPatch)

  await transaction.commit()
}

export const handler = documentEventHandler(async ({context, event}) => {
  const {data} = event

  const client = createClient({
    ...context.clientOptions,
    apiVersion: 'vX',
  })

  const sourceLanguage = {
    id: 'en',
    title: 'English',
  }

  const targetLanguage = {
    id: 'es',
    title: 'Spanish',
  }

  // Create a consistent ID based on the source and target language.
  // This allows the function to override the document in the future
  const targetId = `${data._id}-${targetLanguage.id}`

  try {
    const result = await client.agent.action.translate({
      // Replace with your schema ID
      schemaId: '_.schemas.default',
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
      fromLanguage: {id: sourceLanguage.id, title: sourceLanguage.title},
      toLanguage: {id: targetLanguage.id, title: targetLanguage.title},

      protectedPhrases: ['AudioThing'],
    })

    // Optionally: create or update the Translation Metadata document
    await createTranslationMetadata(
      client,
      'news',
      data._id,
      sourceLanguage.id,
      result._id,
      targetLanguage.id,
    )
  } catch (error) {
    console.error(error)
  }
})
