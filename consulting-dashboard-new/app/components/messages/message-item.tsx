'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { MessageCircle, Download } from 'lucide-react'
import { useState } from 'react'
import NextImage from 'next/image'
import { getFileIcon, isImageFile, getFileTypeLabel, getFileTypeColor } from '@/lib/utils/file-utils'
import { extractUrls } from '@/lib/utils/url-utils'
import { LinkPreviews } from './link-preview'
import { MessageActions } from './message-actions'

interface MessageItemProps {
  message: {
    id: string
    senderId: string
    content: string
    type?: string
    metadata?: string | null
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
    flags?: Array<{
      userId: string
    }>
  }
  isOwn: boolean
  showAvatar: boolean
  currentUserId?: string
  onReaction?: (emoji: string) => void
  onThreadClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
  onFlag?: () => void
}

export function MessageItem({ message, isOwn, showAvatar, currentUserId, onReaction, onThreadClick, onEdit, onDelete, onPin, onFlag }: MessageItemProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  
  // フラグ状態を判定
  const isFlagged = currentUserId && message.flags?.some(flag => flag.userId === currentUserId)

  // リアクション絵文字の集計
  const reactionCounts = (message.reactions || []).reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const commonEmojis = ['👍', '❤️', '😊', '🎉', '👏', '😮']

  // ファイルメタデータをパース
  let fileMetadata: any = null
  if (message.type === 'file' && message.metadata) {
    try {
      fileMetadata = typeof message.metadata === 'string' ? JSON.parse(message.metadata) : message.metadata
    } catch (e) {
      console.error('Failed to parse file metadata:', e)
    }
  }


  // ファイルサイズをフォーマット
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <div className="flex gap-3 group hover:bg-muted/30 px-4 py-1 transition-colors relative">
      {/* アバター */}
      {showAvatar ? (
        <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
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
      <div className="flex-1 relative">
        {/* 名前と時刻 */}
        {showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">
              {message.sender?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        )}

        {/* メッセージコンテンツ */}
        <div className="relative pr-8">
          <div className="inline-block max-w-full">
            {message.type === 'file' && fileMetadata ? (
              // ファイルメッセージ
              isImageFile(fileMetadata.fileName, fileMetadata.fileType) ? (
                // 画像ファイルの場合、サムネイル表示
                <div className="space-y-2">
                  <div className="relative group inline-block">
                    <NextImage
                      src={fileMetadata.fileUrl}
                      alt={fileMetadata.fileName}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => window.open(fileMetadata.fileUrl, '_blank')}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            const response = await fetch(fileMetadata.fileUrl)
                            const blob = await response.blob()
                            const url = window.URL.createObjectURL(blob)
                            const link = document.createElement('a')
                            link.href = url
                            link.download = fileMetadata.fileName
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            window.URL.revokeObjectURL(url)
                          } catch (error) {
                            console.error('Download error:', error)
                          }
                        }}
                      >
                        <Download className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{fileMetadata.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(fileMetadata.fileSize)}</span>
                  </div>
                </div>
              ) : (
                // その他のファイルの場合、アイコン表示
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  getFileTypeColor(fileMetadata.fileName, fileMetadata.fileType)
                )}>
                  <div className="flex-shrink-0">
                    {(() => {
                      const IconComponent = getFileIcon(fileMetadata.fileName, fileMetadata.fileType)
                      return <IconComponent className="h-8 w-8" />
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {fileMetadata.fileName}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {getFileTypeLabel(fileMetadata.fileName, fileMetadata.fileType)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(fileMetadata.fileSize)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={async () => {
                      try {
                        const response = await fetch(fileMetadata.fileUrl)
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = fileMetadata.fileName
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        window.URL.revokeObjectURL(url)
                      } catch (error) {
                        console.error('Download error:', error)
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )
            ) : (
              // テキストメッセージ
              <>
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </p>
                {/* URLプレビュー */}
                {message.content && extractUrls(message.content).length > 0 && (
                  <LinkPreviews text={message.content} className="mt-2" />
                )}
              </>
            )}
            {message.editedAt && (
              <span className="text-xs opacity-70 ml-2">(編集済み)</span>
            )}
          </div>

          {/* リアクション */}
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
                className={cn(
                  "px-2 py-0.5 rounded-full bg-muted hover:bg-muted/80 text-xs transition-opacity",
                  Object.keys(reactionCounts).length === 0 && !showReactionPicker
                    ? "opacity-0 group-hover:opacity-100"
                    : ""
                )}
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

          {/* スレッド */}
          {message._count?.threadMessages ? (
            <button
              onClick={onThreadClick}
              className="flex items-center gap-1.5 mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-medium">{message._count.threadMessages}件の返信</span>
            </button>
          ) : (
            <button
              onClick={onThreadClick}
              className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="font-medium">返信する</span>
            </button>
          )}
        </div>

        {/* アクションボタン（ホバー時のみ表示） */}
        <div className={cn(
          "absolute -top-1 opacity-0 group-hover:opacity-100 transition-opacity z-10",
          "right-0"
        )}>
          <div data-message-id={message.id} className="hidden">
            {message.content}
          </div>
          <MessageActions
            messageId={message.id}
            isOwn={isOwn}
            isFlagged={isFlagged}
            onEdit={isOwn ? onEdit : undefined}
            onDelete={isOwn ? onDelete : undefined}
            onPin={onPin}
            onReply={onThreadClick}
            onFlag={onFlag}
          />
        </div>
      </div>
    </div>
  )
}