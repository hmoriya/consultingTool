/**
 * URLを検出するための正規表現
 */
export const URL_REGEX = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g

/**
 * テキストからURLを抽出
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX)
  return matches ? [...new Set(matches)] : []
}

/**
 * URLが画像かどうかを判定
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
  const urlLower = url.toLowerCase()
  return imageExtensions.some(ext => urlLower.includes(ext))
}

/**
 * URLが動画かどうかを判定
 */
export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi']
  const urlLower = url.toLowerCase()
  return videoExtensions.some(ext => urlLower.includes(ext))
}

/**
 * ドメインからファビコンURLを生成
 */
export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch {
    return '/favicon.ico'
  }
}

/**
 * URLのメタデータ
 */
export interface UrlMetadata {
  url: string
  title?: string
  description?: string
  image?: string
  favicon?: string
  siteName?: string
  type?: 'website' | 'article' | 'video' | 'image' | 'other'
}

/**
 * URLからドメインを取得
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
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