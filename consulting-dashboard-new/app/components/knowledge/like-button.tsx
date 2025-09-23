'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { likeArticle } from '@/actions/knowledge'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  articleId: string
  initialLikeCount: number
  isInitiallyLiked?: boolean
  className?: string
}

export function LikeButton({
  articleId,
  initialLikeCount,
  isInitiallyLiked = false,
  className
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLikeToggle = async () => {
    if (isLoading) return

    setIsLoading(true)

    // 楽観的更新
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      const result = await likeArticle(articleId)

      if (!result.success) {
        // エラーの場合は元に戻す
        setIsLiked(isLiked)
        setLikeCount(initialLikeCount)
        console.error('Failed to toggle like:', result.error)
      } else {
        // サーバーからの実際の値で更新
        if ('liked' in result) {
          setIsLiked(result.liked)
        }

        // ページをリフレッシュして最新のカウントを取得
        router.refresh()
      }
    } catch (error) {
      // エラーの場合は元に戻す
      setIsLiked(isLiked)
      setLikeCount(initialLikeCount)
      console.error('Failed to toggle like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-2 hover:text-red-500 transition-colors",
        isLiked && "text-red-500",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          isLiked && "fill-current",
          isLoading && "animate-pulse"
        )}
      />
      <span className="font-medium">{likeCount}</span>
    </Button>
  )
}