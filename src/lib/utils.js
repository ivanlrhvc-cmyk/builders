export function formatUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()
  if (trimmed === '') return ''
  
  // Prevent javascript: or data: XSS payloads
  const lower = trimmed.toLowerCase()
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
    return ''
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  
  return trimmed
}
