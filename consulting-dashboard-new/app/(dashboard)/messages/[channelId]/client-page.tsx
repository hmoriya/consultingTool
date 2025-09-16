'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Send, 
  Paperclip, 
  MoreVertical,
  Hash,
  Lock,
  MessageCircle,
  Smile,
  ArrowLeft,
  Users
} from 'lucide-react'
import { format, formatDistanceToNow, isSameDay, isToday, isYesterday } from 'date-fns'
import { ja } from 'date-fns/locale'
import { sendMessage, markMessageAsRead, toggleReaction } from '@/actions/messages'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MessageItem } from '@/components/messages/message-item'
import { ChannelHeader } from '@/components/messages/channel-header'

interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
  type: string
  metadata?: string
  editedAt?: string
  deletedAt?: string
  createdAt: string
  reactions: Array<{
    id: string
    userId: string
    emoji: string
  }>
  mentions: Array<{
    id: string
    userId: string
    type: string
  }>
  readReceipts: Array<{
    id: string
    userId: string
    readAt: string
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

interface Channel {
  id: string
  name?: string | null
  description?: string | null
  type: string
  isPrivate: boolean
  members: Array<{
    userId: string
    role: string
  }>
  _count: {
    messages: number
  }
}

interface ChatClientProps {
  channel: Channel
  initialMessages: Message[]
  currentUserId: string
  currentUser?: {
    id: string
    name: string
    email: string
  }
}

export default function ChatClient({ channel, initialMessages, currentUserId, currentUser }: ChatClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // 最下部にスクロール
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    const tempMessage = newMessage
    setNewMessage('')

    try {
      const result = await sendMessage({
        channelId: channel.id,
        content: tempMessage,
        type: 'text'
      })

      if (result.success && result.data) {
        // 送信したメッセージを一時的に追加（sender情報を含む）
        const tempMsg: Message = {
          ...result.data,
          reactions: result.data.reactions || [],
          mentions: result.data.mentions || [],
          readReceipts: result.data.readReceipts || [],
          _count: result.data._count || { threadMessages: 0 },
          sender: currentUser || { 
            id: currentUserId, 
            name: 'You', 
            email: '' 
          }
        }
        setMessages(prev => [...prev, tempMsg])
        // バックグラウンドでページを更新
        router.refresh()
      } else {
        toast.error(result.error || 'メッセージの送信に失敗しました')
        setNewMessage(tempMessage) // 失敗時は復元
      }
    } catch (error) {
      toast.error('エラーが発生しました')
      setNewMessage(tempMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // メッセージを日付でグループ化
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt)
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(message)
    return groups
  }, {} as Record<string, Message[]>)

  // 日付ラベルを生成
  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return '今日'
    if (isYesterday(date)) return '昨日'
    return format(date, 'M月d日(E)', { locale: ja })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ヘッダー */}
      <ChannelHeader channel={channel} />

      {/* メッセージエリア */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-6 max-w-4xl mx-auto">
          {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              {/* 日付セパレーター */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border">
                  {getDateLabel(dateKey)}
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
              </div>

              {/* メッセージ */}
              <div className="space-y-4">
                {dateMessages.map((message, index) => {
                  const prevMessage = index > 0 ? dateMessages[index - 1] : null
                  const showAvatar = !prevMessage || 
                    prevMessage.senderId !== message.senderId ||
                    new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000 // 5分以上の差


                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      isOwn={message.senderId === currentUserId}
                      showAvatar={showAvatar}
                      onReaction={(emoji) => toggleReaction(message.id, emoji)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* 入力エリア */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <Button variant="ghost" size="icon" className="flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="メッセージを入力..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={isLoading}
                className="pr-10 py-6 text-base bg-muted/50 border-input focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
              >
                <Smile className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200" />
              </Button>
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              size="icon"
              className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}