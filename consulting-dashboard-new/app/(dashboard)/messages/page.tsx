import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getUserChannels } from '@/actions/messages'
import MessageListClient from './client-page'

export default async function MessagesPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const channelsResult = await getUserChannels()
  const channels = channelsResult.success ? channelsResult.data || [] : []
  
  // デバッグ: 全チャンネルデータの構造を確認
  console.log('Total channels:', channels.length)
  channels.forEach((channel, index) => {
    console.log(`Channel ${index + 1}:`, {
      name: channel.name,
      type: channel.type,
      memberUsersCount: 'memberUsers' in channel && Array.isArray(channel.memberUsers) ? channel.memberUsers.length : 0
    })
  })

  return <MessageListClient initialChannels={channels} />
}