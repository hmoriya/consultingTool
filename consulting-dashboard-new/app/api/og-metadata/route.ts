import { NextRequest, NextResponse } from 'next/server'
import type { UrlMetadata } from '@/lib/utils/url-utils'

/**
 * HTMLからメタタグを抽出
 */
function extractMetaTags(html: string): UrlMetadata {
  const metadata: UrlMetadata = {
    url: '',
  }

  // タイトル取得（優先順位: og:title > twitter:title > title tag）
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
  const twitterTitle = html.match(/<meta\s+name="twitter:title"\s+content="([^"]+)"/i)
  const titleTag = html.match(/<title>([^<]+)<\/title>/i)

  metadata.title =
    ogTitle?.[1] ||
    twitterTitle?.[1] ||
    titleTag?.[1] ||
    undefined

  // 説明取得
  const ogDescription = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)
  const twitterDescription = html.match(/<meta\s+name="twitter:description"\s+content="([^"]+)"/i)
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)

  metadata.description =
    ogDescription?.[1] ||
    twitterDescription?.[1] ||
    description?.[1] ||
    undefined

  // 画像取得
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
  const twitterImage = html.match(/<meta\s+name="twitter:image"\s+content="([^"]+)"/i)

  metadata.image =
    ogImage?.[1] ||
    twitterImage?.[1] ||
    undefined

  // サイト名取得
  const siteName = html.match(/<meta\s+property="og:site_name"\s+content="([^"]+)"/i)
  metadata.siteName = siteName?.[1] || undefined

  // タイプ取得
  const ogType = html.match(/<meta\s+property="og:type"\s+content="([^"]+)"/i)
  if (ogType?.[1]) {
    const type = ogType[1].toLowerCase()
    if (['website', 'article', 'video', 'image'].includes(type)) {
      metadata.type = type as UrlMetadata['type']
    } else {
      metadata.type = 'other'
    }
  }

  return metadata
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URLが指定されていません' }, { status: 400 })
    }

    // URLの検証
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: '無効なURLです' }, { status: 400 })
    }

    // ローカルホストへのアクセスを制限（セキュリティ対策）
    const urlObj = new URL(url)
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return NextResponse.json({ error: 'ローカルホストへのアクセスは許可されていません' }, { status: 403 })
    }

    // HTMLを取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ConsultingDashboard/1.0; +http://example.com/bot)',
      },
      // タイムアウト設定
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const metadata = extractMetaTags(html)

    // URLとファビコンを設定
    metadata.url = url
    metadata.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`

    // 相対URLを絶対URLに変換
    if (metadata.image && !metadata.image.startsWith('http')) {
      if (metadata.image.startsWith('//')) {
        metadata.image = urlObj.protocol + metadata.image
      } else if (metadata.image.startsWith('/')) {
        metadata.image = `${urlObj.protocol}//${urlObj.host}${metadata.image}`
      } else {
        metadata.image = `${urlObj.protocol}//${urlObj.host}/${metadata.image}`
      }
    }

    // タイトルと説明のフォールバック
    if (!metadata.title) {
      metadata.title = urlObj.hostname
    }

    if (!metadata.description) {
      metadata.description = 'クリックしてリンクを開く'
    }

    return NextResponse.json(metadata)
  } catch (_error) {
    console.error('OG metadata fetch error:', error)

    // エラーでも最低限の情報を返す
    try {
      const urlObj = new URL(request.url)
      return NextResponse.json({
        url: request.url,
        title: urlObj.hostname,
        description: 'リンクのプレビューを取得できませんでした',
        favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`,
        type: 'website' as const,
      })
    } catch {
      return NextResponse.json({ error: 'メタデータの取得に失敗しました' }, { status: 500 })
    }
  }
}