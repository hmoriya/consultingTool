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
    const baseChannel = {
      ...channel,
      type: channel.type as 'PROJECT' | 'GROUP' | 'DIRECT',
      lastMessage: channel.lastMessage ? {
        content: channel.lastMessage.content,
        createdAt: channel.lastMessage.createdAt instanceof Date 
          ? channel.lastMessage.createdAt.toISOString() 
          : channel.lastMessage.createdAt
      } : null
    }

    // exactOptionalPropertyTypes対応: undefinedのプロパティを除外
    if (channel.name === null || channel.name === undefined) {
      const { name, ...rest } = baseChannel
      return rest
    }

    if (channel.description === null || channel.description === undefined) {
      const { description, ...rest } = baseChannel
      return rest
    }

    if (channel.projectId === null || channel.projectId === undefined) {
      const { projectId, ...rest } = baseChannel
      return rest
    }

    return baseChannel
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