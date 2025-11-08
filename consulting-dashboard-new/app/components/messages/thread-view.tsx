'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, MessageCircle, X } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
// import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ThreadMessage {
  id: string
  messageId: string
  senderId: string
  content: string
  createdAt: string
  sender?: {
    id: string
    name: string
    email: string
  }
}

interface ThreadViewProps {
  parentMessage: {
    id: string
    content: string
    senderId: string
    createdAt: string
    sender?: {
      name: string
      email: string
    }
  }
  isOpen: boolean
  onClose: () => void
  onSendReply: (content: string) => Promise<void>
  threadMessages: ThreadMessage[]
  currentUserId: string
}

export function ThreadView({
  parentMessage,
  isOpen,
  onClose,
  onSendReply,
  threadMessages,
  currentUserId: _currentUserId
}: ThreadViewProps) {
  const [replyContent, setReplyContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen, threadMessages])

  const handleSendReply = async () => {
    if (!replyContent.trim() || isSending) return

    setIsSending(true)
    try {
      await onSendReply(replyContent)
      setReplyContent('')
    } catch (_error) {
      toast.error('返信の送信に失敗しました')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-lg z-50 flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">スレッド</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 元のメッセージ */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {parentMessage.sender?.name?.slice(0, 2).toUpperCase() || 'UN'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">
                {parentMessage.sender?.name || 'Unknown'}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(parentMessage.createdAt), 'HH:mm', { locale: ja })}
              </span>
            </div>
            <p className="text-sm">{parentMessage.content}</p>
          </div>
        </div>
      </div>

      {/* スレッドメッセージ */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {threadMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">まだ返信がありません</p>
              <p className="text-xs mt-1">最初の返信を送信してください</p>
            </div>
          ) : (
            threadMessages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.sender?.name?.slice(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {message.sender?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.createdAt), 'HH:mm', { locale: ja })}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* 入力エリア */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="返信を入力..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendReply()
              }
            }}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSendReply}
            disabled={!replyContent.trim() || isSending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}