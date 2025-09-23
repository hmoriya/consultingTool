'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import { ExternalLink, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UrlMetadata } from '@/lib/utils/url-utils'
import { formatUrlForDisplay } from '@/lib/utils/url-utils'

interface LinkPreviewProps {
  url: string
  className?: string
}

export function LinkPreview({ url, className }: LinkPreviewProps) {
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true)
        setError(false)

        const response = await fetch('/api/og-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch metadata')
        }

        const data = await response.json()
        setMetadata(data)
      } catch (err) {
        console.error('Error fetching link preview:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [url])

  if (loading) {
    return (
      <div className={cn("border rounded-lg p-2 animate-pulse", className)}>
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-muted rounded" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-2 bg-muted rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !metadata) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline",
          className
        )}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {formatUrlForDisplay(url, 60)}
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors",
        className
      )}
    >
      {metadata.image && (
        <div className="relative w-full h-32 bg-muted">
          <NextImage
            src={metadata.image}
            alt={metadata.title || 'Link preview'}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <div className="p-2">
        <div className="flex items-start gap-2">
          {metadata.favicon && !metadata.image && (
            <div className="flex-shrink-0">
              <NextImage
                src={metadata.favicon}
                alt=""
                width={24}
                height={24}
                className="rounded"
                unoptimized
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                {metadata.title && (
                  <h3 className="font-semibold text-xs line-clamp-1">
                    {metadata.title}
                  </h3>
                )}

                {metadata.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {metadata.description}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span className="truncate text-xs">
                    {metadata.siteName || new URL(url).hostname}
                  </span>
                </div>
              </div>

              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

// 複数のリンクプレビューを含むコンポーネント
interface LinkPreviewsProps {
  text: string
  className?: string
}

export function LinkPreviews({ text, className }: LinkPreviewsProps) {
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    // URLを検出
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
    const matches = text.match(urlRegex)
    if (matches) {
      setUrls([...new Set(matches)])
    }
  }, [text])

  if (urls.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-2 mt-2", className)}>
      {urls.map((url, index) => (
        <LinkPreview key={`${url}-${index}`} url={url} />
      ))}
    </div>
  )
}