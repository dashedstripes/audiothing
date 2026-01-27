/**
 * Converts kebab-case or camelCase type names to Title Case
 * e.g., "blog-post" -> "Blog Post", "blogPost" -> "Blog Post"
 */
export function formatTypeName(typeName: string): string {
  return typeName
    // Insert space before uppercase letters (for camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace hyphens and underscores with spaces
    .replace(/[-_]/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Formats a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      if (diffMinutes < 1) {
        return 'Just now'
      }
      return `${diffMinutes}m ago`
    }
    return `${diffHours}h ago`
  }

  if (diffDays === 1) {
    return 'Yesterday'
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Truncates a string to a maximum length, adding ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
