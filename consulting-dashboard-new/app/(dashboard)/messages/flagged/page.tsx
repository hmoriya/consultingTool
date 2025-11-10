import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getFlaggedMessages } from '@/actions/messages'
import { MessageItem } from '@/components/messages/message-item'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Flag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface FlaggedMessage {
  id: string
  senderId: string
  content: string
  type?: string
  metadata?: string | null
  createdAt: string
  editedAt?: string
  channelId: string
  channel?: {
    name: string
  }
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

export default async function FlaggedMessagesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const result = await getFlaggedMessages()
  const messages = result.success ? result.data || [] : []

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* ヘッダー */}
      <div className="border-b bg-background px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 fill-orange-500 text-orange-500" />
            <h1 className="text-xl font-semibold">フラグ付きメッセージ</h1>
          </div>
          <span className="text-sm text-muted-foreground ml-auto">
            {messages.length}件のメッセージ
          </span>
        </div>
      </div>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <Card className="p-8 text-center">
            <Flag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              フラグ付きメッセージはありません
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {messages.map((message: FlaggedMessage) => (
              <Card key={message.id} className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>#{message.channel?.name || 'チャンネル'}</span>
                  <span>•</span>
                  <time>
                    {new Date(message.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
                <MessageItem
                  message={message}
                  isOwn={message.senderId === user.id}
                  showAvatar={true}
                  currentUserId={user.id}
                />
                <div className="mt-3 flex justify-end">
                  <Link href={`/messages/${message.channelId}`}>
                    <Button variant="outline" size="sm">
                      チャンネルで表示
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}