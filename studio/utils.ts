import {SlugValidationContext} from 'sanity'

export async function isUniqueOtherThanLanguage(slug: string, context: SlugValidationContext) {
  const {document, getClient} = context
  if (!document?.language) {
    return true
  }
  const client = getClient({apiVersion: '2025-02-19'})
  const id = document._id.replace(/^drafts\./, '')
  const params = {
    id,
    language: document.language,
    slug,
  }
  const query = `!defined(*[
    !(sanity::versionOf($id)) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`
  const result = await client.fetch(query, params)
  return result
}
