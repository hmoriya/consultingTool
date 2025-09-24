export function extractUrls(text: string): string[] {
  // URLを検出する正規表現パターン
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex)
  return matches || []
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch (_) {
    return ''
  }
}

export function getPathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch (_) {
    return ''
  }
}

export function formatUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url

  const urlObj = new URL(url)
  const domain = urlObj.hostname
  const path = urlObj.pathname

  if (domain.length + path.length <= maxLength) {
    return `${domain}${path}`
  }

  const halfLength = Math.floor((maxLength - 3) / 2)
  return `${url.substring(0, halfLength)}...${url.substring(url.length - halfLength)}`
}

/**
 * URLを短縮表示用にフォーマット
 */
export function formatUrlForDisplay(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url

  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    const path = urlObj.pathname + urlObj.search + urlObj.hash

    if (domain.length + path.length <= maxLength) {
      return url
    }

    const remainingLength = maxLength - domain.length - 3 // "..." の分
    if (remainingLength > 10) {
      return domain + path.substring(0, remainingLength) + '...'
    }

    return domain + '/...'
  } catch {
    return url.substring(0, maxLength - 3) + '...'
  }
}

/**
 * URLメタデータの型定義
 */
export interface UrlMetadata {
  title?: string
  description?: string
  image?: string
  domain?: string
  favicon?: string
}