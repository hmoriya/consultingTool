import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getUserChannels } from '@/actions/messages'
import { ChannelSidebar } from '@/components/messages/channel-sidebar'

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
  const channels = channelsResult.success ? channelsResult.data || [] : []

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChannelSidebar channels={channels} currentUserId={user.id} />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}