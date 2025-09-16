'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { MessageCircle, MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface MessageItemProps {
  message: {
    id: string
    senderId: string
    content: string
    createdAt: string
    editedAt?: string
    reactions: Array<{
      userId: string
      emoji: string
    }>
    _count?: {
      threadMessages: number
    }
    sender?: {
      id: string
      name: string
      email: string
    }
  }
  isOwn: boolean
  showAvatar: boolean
  onReaction?: (emoji: string) => void
}

export function MessageItem({ message, isOwn, showAvatar, onReaction }: MessageItemProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  
  // リアクション絵文字の集計
  const reactionCounts = (message.reactions || []).reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const commonEmojis = ['👍', '❤️', '😊', '🎉', '👏', '😮']

  return (
    <div className={cn("flex gap-3 group", isOwn && "flex-row-reverse")}>
      {/* アバター */}
      {showAvatar ? (
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
            {message.sender?.name
              ? message.sender.name.slice(0, 2).toUpperCase()
              : message.senderId.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-9 flex-shrink-0" />
      )}

      {/* メッセージ本体 */}
      <div className={cn("flex-1 max-w-[70%]", isOwn && "flex flex-col items-end")}>
        {/* 名前と時刻 */}
        {showAvatar && (
          <div className={cn("flex items-center gap-2 mb-1", isOwn && "flex-row-reverse")}>
            <span className="text-sm font-medium">
              {message.sender?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        )}

        {/* メッセージコンテンツ */}
        <div className="relative">
          <div className={cn(
            "inline-block max-w-full",
            isOwn 
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-2.5" 
              : "bg-muted rounded-2xl rounded-tl-md px-4 py-2.5"
          )}>
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
            {message.editedAt && (
              <span className="text-xs opacity-70 ml-2">(編集済み)</span>
            )}
          </div>

          {/* リアクション */}
          {(Object.keys(reactionCounts).length > 0 || showReactionPicker) && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReaction?.(emoji)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-xs border transition-colors"
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="font-medium">{count}</span>}
                </button>
              ))}
              
              {/* リアクション追加ボタン */}
              <div className="relative">
                <button
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  +
                </button>
                
                {showReactionPicker && (
                  <div className="absolute bottom-full left-0 mb-1 p-2 bg-popover rounded-lg shadow-lg border z-10">
                    <div className="flex gap-1">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            onReaction?.(emoji)
                            setShowReactionPicker(false)
                          }}
                          className="hover:bg-muted p-1 rounded"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* スレッド */}
          {message._count?.threadMessages ? (
            <button className="flex items-center gap-1.5 mt-2 text-xs text-primary hover:text-primary/80 transition-colors">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-medium">{message._count.threadMessages}件の返信</span>
            </button>
          ) : null}
        </div>

        {/* アクションボタン（ホバー時のみ表示） */}
        <div className={cn(
          "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
          isOwn ? "left-0 -ml-8" : "right-0 -mr-8"
        )}>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}