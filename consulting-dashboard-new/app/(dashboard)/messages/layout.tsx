import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getUserChannels } from '@/actions/messages'
import { ChannelSidebar } from '@/components/messages/channel-sidebar'
import { Channel } from '@/lib/utils/message-converter'

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const channelsResult = await getUserChannels()
  const rawChannels = channelsResult.success ? channelsResult.data || [] : []
  
  // 型変換してChannelSidebarが期待する形式にする
  const channels = rawChannels.map((channel: Channel) => {
    const transformedChannel: {
      id: string
      name: string | null
      type: 'PROJECT' | 'GROUP' | 'DIRECT'
      description: string | null
      isPrivate: boolean
      lastMessage: {
        content: string
        createdAt: string
      } | null
      unreadCount: number
      members: Array<{
        userId: string
        user?: {
          name: string
        }
      }>
      memberUsers: Array<{
        userId: string
        user?: {
          id: string
          name: string
          email: string
        }
      }>
    } = {
      id: channel.id,
      name: channel.name ?? null,
      type: channel.type as 'PROJECT' | 'GROUP' | 'DIRECT',
      description: channel.description ?? null,
      isPrivate: channel.isPrivate,
      lastMessage: channel.lastMessage ? {
        content: channel.lastMessage.content,
        createdAt: channel.lastMessage.createdAt instanceof Date 
          ? channel.lastMessage.createdAt.toISOString() 
          : channel.lastMessage.createdAt
      } : null,
      unreadCount: channel.unreadCount || 0,
      members: channel.members || [],
      memberUsers: channel.memberUsers || []
    }
    return transformedChannel
  })

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChannelSidebar channels={channels} currentUserId={user.id} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}