'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Hash, Lock, ChevronDown, ChevronRight, Plus, Users, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Channel {
  id: string
  name: string | null
  type: 'PROJECT' | 'GROUP' | 'DIRECT'
  description?: string | null
  isPrivate?: boolean
  lastMessage?: {
    content: string
    createdAt: string
  } | null
  unreadCount?: number
  members?: Array<{
    userId: string
    user?: {
      name: string
    }
  }>
  memberUsers?: Array<{
    userId: string
    user?: {
      id: string
      name: string
      email: string
    }
  }>
}

interface ChannelSidebarProps {
  channels: Channel[]
  currentUserId?: string
}

export function ChannelSidebar({ channels, currentUserId }: ChannelSidebarProps) {
  const router = useRouter()
  const params = useParams()
  const currentChannelId = params?.channelId as string

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projects: true,
    groups: true,
    direct: true
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // 重複を削除（DIRECTチャンネルは相手のユーザーIDで判定）
  const uniqueChannels = channels.reduce((acc: Channel[], channel) => {
    if (channel.type === 'DIRECT') {
      // ダイレクトメッセージの場合は、相手のユーザーIDで重複判定
      const otherUserId = channel.memberUsers?.find(m => m.userId !== currentUserId)?.userId ||
                          channel.members?.find(m => m.userId !== currentUserId)?.userId

      const isDuplicate = acc.some(c => {
        if (c.type !== 'DIRECT') return false
        const existingOtherUserId = c.memberUsers?.find(m => m.userId !== currentUserId)?.userId ||
                                    c.members?.find(m => m.userId !== currentUserId)?.userId
        return existingOtherUserId === otherUserId
      })

      if (!isDuplicate) {
        acc.push(channel)
      }
    } else {
      // プロジェクトやグループチャンネルは名前で重複判定
      const key = `${channel.type}-${channel.name}`
      if (!acc.some(c => c.type === channel.type && c.name === channel.name)) {
        acc.push(channel)
      }
    }
    return acc
  }, [])

  // チャンネルをタイプ別に分類
  const projectChannels = uniqueChannels.filter(c => c.type === 'PROJECT')
  const groupChannels = uniqueChannels.filter(c => c.type === 'GROUP')
  const directChannels = uniqueChannels.filter(c => c.type === 'DIRECT')

  // ダイレクトメッセージの相手の名前を取得
  const getDirectMessageName = (channel: Channel) => {
    // memberUsers を優先的に使用
    if (channel.memberUsers && channel.memberUsers.length > 0) {
      const otherMember = channel.memberUsers.find(m => m.userId !== currentUserId)
      return otherMember?.user?.name || 'Unknown User'
    }
    // フォールバック: members を使用
    if (!channel.members || channel.members.length === 0) return 'Unknown'
    const otherMember = channel.members.find(m => m.userId !== currentUserId)
    return otherMember?.user?.name || 'Unknown User'
  }

  const ChannelItem = ({ channel }: { channel: Channel }) => {
    const isActive = channel.id === currentChannelId
    const isDirectMessage = channel.type === 'DIRECT'
    const displayName = isDirectMessage ? getDirectMessageName(channel) : channel.name

    return (
      <button
        onClick={() => router.push(`/messages/${channel.id}`)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1 text-sm rounded-md transition-colors group",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        <span className="flex-shrink-0">
          {channel.type === 'PROJECT' && <Hash className="h-4 w-4" />}
          {channel.type === 'GROUP' && (channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />)}
          {channel.type === 'DIRECT' && <div className="w-2 h-2 rounded-full bg-green-500" />}
        </span>
        <span className="flex-1 truncate text-left">{displayName}</span>
        {channel.unreadCount && channel.unreadCount > 0 && (
          <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
          </span>
        )}
      </button>
    )
  }

  const ChannelSection = ({
    title,
    channels,
    sectionKey,
    icon
  }: {
    title: string
    channels: Channel[]
    sectionKey: string
    icon: React.ReactNode
  }) => {
    const isExpanded = expandedSections[sectionKey]

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <button
            onClick={() => toggleSection(sectionKey)}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            {icon}
            <span className="ml-1">{title}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        {isExpanded && (
          <div className="space-y-0.5">
            {channels.length > 0 ? (
              channels.map(channel => (
                <ChannelItem key={channel.id} channel={channel} />
              ))
            ) : (
              <p className="px-3 py-1 text-xs text-muted-foreground">なし</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-60 bg-background border-r h-full flex flex-col">
      {/* ヘッダー */}
      <div className="p-3 border-b">
        <h2 className="font-semibold text-sm">チャンネル</h2>
      </div>

      {/* チャンネルリスト */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        <ChannelSection
          title="プロジェクト"
          channels={projectChannels}
          sectionKey="projects"
          icon={<Hash className="h-3 w-3" />}
        />

        <ChannelSection
          title="グループ"
          channels={groupChannels}
          sectionKey="groups"
          icon={<Users className="h-3 w-3" />}
        />

        <ChannelSection
          title="ダイレクトメッセージ"
          channels={directChannels}
          sectionKey="direct"
          icon={<MessageSquare className="h-3 w-3" />}
        />
      </div>

      {/* フッター */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          チャンネルを作成
        </Button>
      </div>
    </div>
  )
}