'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Search, 
  Plus,
  Hash,
  Lock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { NewChannelDialog } from '@/components/messages/new-channel-dialog'
import { cn } from '@/lib/utils'
import { useUser } from '@/contexts/user-context'
import { Channel } from '@/lib/utils/message-converter'

interface MessageListClientProps {
  initialChannels: Channel[]
}

export default function MessageListClient({ initialChannels }: MessageListClientProps) {
  const router = useRouter()
  const { user } = useUser()
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'project' | 'direct'>('all')
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false)
  
  // デバッグ: チャンネルデータを確認
  useEffect(() => {
    if (channels.length > 0) {
      const firstChannel = channels[0]
      if (firstChannel) {
        console.log('First channel:', firstChannel)
        console.log('Channel type:', firstChannel.type)
        console.log('Channel memberUsers:', firstChannel.memberUsers)
      }
    }
  }, [channels])

  // チャンネルをフィルタリング
  const filteredChannels = channels.filter(channel => {
    // タブでフィルタリング
    if (selectedTab === 'project' && channel.type !== 'PROJECT') return false
    if (selectedTab === 'direct' && channel.type !== 'DIRECT') return false

    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        channel.name?.toLowerCase().includes(query) ||
        channel.lastMessage?.content.toLowerCase().includes(query)
      )
    }

    return true
  })

  // チャンネルのアイコンを取得
  const getChannelIcon = (channel: Channel) => {
    if (channel.type === 'DIRECT') {
      return <MessageCircle className="h-4 w-4" />
    }
    return channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />
  }

  // チャンネル名を取得（ダイレクトメッセージの場合は相手の名前）
  const getChannelName = (channel: Channel) => {
    if (channel.type === 'DIRECT' && channel.memberUsers) {
      const otherUser = channel.memberUsers?.find((m) => m.userId !== user?.id)
      if (otherUser?.user) {
        return otherUser.user.name
      }
      return 'ダイレクトメッセージ'
    }
    return channel.name || '無題のチャンネル'
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-foreground">
            メッセージ
          </h1>
          <p className="text-muted-foreground mt-1">
            チームメンバーとのコミュニケーション
          </p>
        </div>
        <Button 
          onClick={() => setShowNewChannelDialog(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="メッセージやチャンネルを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* タブ */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'all' | 'project' | 'direct')}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            すべて
          </TabsTrigger>
          <TabsTrigger value="project" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            プロジェクト
          </TabsTrigger>
          <TabsTrigger value="direct" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            ダイレクト
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-2">
              {filteredChannels.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      メッセージがありません
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      新しいチャンネルを作成するか、ダイレクトメッセージを始めましょう
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredChannels.map((channel) => (
                  <Card
                    key={channel.id}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-all duration-200 border-l-4",
                      (channel.unreadCount || 0) > 0 
                        ? "border-l-primary bg-primary/5" 
                        : "border-l-transparent hover:border-l-primary/30"
                    )}
                    onClick={() => router.push(`/messages/${channel.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* アイコン/アバター */}
                        {channel.type === 'DIRECT' && channel.memberUsers ? (
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {(() => {
                                const otherUser = channel.memberUsers?.find((m) => m.userId !== user?.id)
                                const name = otherUser?.user?.name || 'U'
                                return name.slice(0, 2).toUpperCase()
                              })()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={cn(
                            "p-3 rounded-lg flex-shrink-0",
                            channel.type === 'PROJECT' 
                              ? "bg-gradient-to-br from-indigo-500 to-blue-600" 
                              : "bg-gradient-to-br from-green-500 to-emerald-600"
                          )}>
                            <div className="text-white">
                              {getChannelIcon(channel)}
                            </div>
                          </div>
                        )}

                        {/* コンテンツ */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg truncate max-w-[200px] text-foreground">
                              {getChannelName(channel)}
                            </h3>
                            <div className="flex items-center gap-2">
                              {(channel.unreadCount || 0) > 0 && (
                                <Badge variant="default" className="h-5 px-2 text-xs font-medium">
                                  {channel.unreadCount || 0}
                                </Badge>
                              )}
                              {channel.lastMessage && (
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {formatDistanceToNow(new Date(channel.lastMessage.createdAt), {
                                    addSuffix: true,
                                    locale: ja
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          {channel.lastMessage ? (
                            <p className="text-base text-muted-foreground truncate mt-1 leading-relaxed">
                              {channel.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-base text-muted-foreground/70 italic mt-1">
                              まだメッセージがありません
                            </p>
                          )}
                          {channel.type !== 'DIRECT' && (
                            <div className="flex items-center gap-3 mt-3">
                              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <span className="text-muted-foreground">{channel.members.length}人のメンバー</span>
                              </span>
                              {(channel._count?.messages || 0) > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  <span>{channel._count.messages}件のメッセージ</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* 新規チャンネル作成ダイアログ */}
      <NewChannelDialog
        open={showNewChannelDialog}
        onClose={() => setShowNewChannelDialog(false)}
        onSuccess={(newChannel) => {
          setChannels([newChannel, ...channels])
          router.push(`/messages/${newChannel.id}`)
        }}
      />
    </div>
  )
}