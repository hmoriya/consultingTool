import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getChannelDetails, getChannelMessages } from '@/actions/messages'
import { notFound } from 'next/navigation'
import ChatClient from './client-page'

interface Props {
  params: Promise<{
    channelId: string
  }>
}

export default async function ChatPage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const { channelId } = await params

  const [channelResult, messagesResult] = await Promise.all([
    getChannelDetails(channelId),
    getChannelMessages(channelId)
  ])

  if (!channelResult.success || !channelResult.data) {
    notFound()
  }

  const messages = messagesResult.success ? messagesResult.data || [] : []

  return (
    <ChatClient 
      channel={channelResult.data}
      initialMessages={messages}
      currentUserId={user.id}
      currentUser={user}
    />
  )
}