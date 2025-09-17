'use server'

import { notificationDb } from '@/lib/db/notification-db'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// スキーマ定義
const createChannelSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['PROJECT', 'DIRECT', 'GROUP']),
  projectId: z.string().optional(),
  isPrivate: z.boolean().default(false),
  memberIds: z.array(z.string()).optional()
})

const sendMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1, 'メッセージを入力してください'),
  type: z.enum(['text', 'file', 'image', 'system']).default('text'),
  metadata: z.any().optional(),
  parentId: z.string().optional()
})

// チャンネル作成
export async function createChannel(data: z.infer<typeof createChannelSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const validated = createChannelSchema.parse(data)

    // ダイレクトメッセージの場合、既存のチャンネルを確認
    if (validated.type === 'DIRECT' && validated.memberIds) {
      const existingChannel = await notificationDb.Channel.findFirst({
        where: {
          type: 'DIRECT',
          members: {
            every: {
              userId: {
                in: [...validated.memberIds, user.id]
              }
            }
          }
        },
        include: {
          members: true
        }
      })

      if (existingChannel && existingChannel.members.length === validated.memberIds.length + 1) {
        return { success: true, data: existingChannel }
      }
    }

    // 新しいチャンネルを作成
    const channel = await notificationDb.Channel.create({
      data: {
        name: validated.name,
        description: validated.description,
        type: validated.type,
        projectId: validated.projectId,
        isPrivate: validated.isPrivate,
        createdBy: user.id,
        members: {
          create: [
            { userId: user.id, role: 'admin' },
            ...(validated.memberIds?.map(id => ({ userId: id, role: 'member' })) || [])
          ]
        }
      },
      include: {
        members: true
      }
    })

    revalidatePath('/messages')
    return { success: true, data: channel }
  } catch (error) {
    console.error('createChannel error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'チャンネルの作成に失敗しました' }
  }
}

// メッセージ送信
export async function sendMessage(data: z.infer<typeof sendMessageSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const validated = sendMessageSchema.parse(data)

    // チャンネルメンバーか確認
    const member = await notificationDb.ChannelMember.findUnique({
      where: {
        channelId_userId: {
          channelId: validated.channelId,
          userId: user.id
        }
      }
    })

    if (!member) {
      return { success: false, error: 'このチャンネルにアクセスできません' }
    }

    // メッセージを作成
    const message = await notificationDb.Message.create({
      data: {
        channelId: validated.channelId,
        senderId: user.id,
        content: validated.content,
        type: validated.type,
        metadata: validated.metadata ? JSON.stringify(validated.metadata) : null,
        parentId: validated.parentId
      }
    })

    // チャンネルの最終メッセージを更新
    await notificationDb.Channel.update({
      where: { id: validated.channelId },
      data: { 
        lastMessageId: message.id,
        updatedAt: new Date()
      }
    })

    // メンション処理
    const mentions = extractMentions(validated.content)
    if (mentions.length > 0) {
      await notificationDb.MessageMention.createMany({
        data: mentions.map(userId => ({
          messageId: message.id,
          userId,
          type: 'user'
        }))
      })
    }

    revalidatePath('/messages')
    revalidatePath(`/messages/${validated.channelId}`)
    return { success: true, data: message }
  } catch (error) {
    console.error('sendMessage error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'メッセージの送信に失敗しました' }
  }
}

// チャンネル一覧取得
export async function getUserChannels() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const channels = await notificationDb.Channel.findMany({
      where: {
        members: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        members: {
          select: {
            userId: true,
            role: true,
            lastReadAt: true
          }
        },
        lastMessage: {
          include: {
            _count: {
              select: {
                readReceipts: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // ユーザー情報を取得
    const userIds = [...new Set(channels.flatMap(c => c.members.map(m => m.userId)))]
    const users = await db.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true }
    })
    const userMap = new Map(users.map(u => [u.id, u]))

    // 未読メッセージ数を計算し、ユーザー情報を追加
    const channelsWithUnread = await Promise.all(
      channels.map(async (channel) => {
        const member = channel.members.find(m => m.userId === user.id)
        if (!member) return { ...channel, unreadCount: 0, memberUsers: [] }

        const unreadCount = await notificationDb.Message.count({
          where: {
            channelId: channel.id,
            createdAt: {
              gt: member.lastReadAt || new Date(0)
            },
            senderId: {
              not: user.id
            }
          }
        })

        // メンバー情報にユーザー詳細を追加
        const memberUsers = channel.members.map(m => ({
          ...m,
          user: userMap.get(m.userId) || { id: m.userId, name: 'Unknown', email: '' }
        }))

        return { ...channel, unreadCount, memberUsers }
      })
    )

    return { success: true, data: channelsWithUnread }
  } catch (error) {
    console.error('getUserChannels error:', error)
    return { success: false, error: 'チャンネル一覧の取得に失敗しました' }
  }
}

// メッセージ一覧取得
export async function getChannelMessages(channelId: string, limit = 50, cursor?: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // メンバーか確認
    const member = await notificationDb.ChannelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId: user.id
        }
      }
    })

    if (!member) {
      return { success: false, error: 'このチャンネルにアクセスできません' }
    }

    const messages = await notificationDb.Message.findMany({
      where: {
        channelId,
        deletedAt: null
      },
      include: {
        reactions: true,
        mentions: true,
        readReceipts: {
          where: {
            userId: user.id
          }
        },
        threadMessages: {
          take: 1
        },
        _count: {
          select: {
            threadMessages: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      cursor: cursor ? { id: cursor } : undefined
    })

    // 最終既読時刻を更新
    await notificationDb.ChannelMember.update({
      where: {
        channelId_userId: {
          channelId,
          userId: user.id
        }
      },
      data: {
        lastReadAt: new Date()
      }
    })

    // ユーザー情報を取得
    const senderIds = [...new Set(messages.map(m => m.senderId))]
    const senders = await db.user.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, email: true }
    })
    const senderMap = new Map(senders.map(s => [s.id, s]))
    
    // メッセージにユーザー情報を追加
    const messagesWithSender = messages.map(msg => ({
      ...msg,
      sender: senderMap.get(msg.senderId) || { id: msg.senderId, name: 'Unknown', email: '' }
    }))

    return { success: true, data: messagesWithSender.reverse() }
  } catch (error) {
    console.error('getChannelMessages error:', error)
    return { success: false, error: 'メッセージの取得に失敗しました' }
  }
}

// メッセージに既読をつける
export async function markMessageAsRead(messageId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    await notificationDb.MessageReadReceipt.upsert({
      where: {
        messageId_userId: {
          messageId,
          userId: user.id
        }
      },
      create: {
        messageId,
        userId: user.id
      },
      update: {
        readAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('markMessageAsRead error:', error)
    return { success: false, error: '既読の更新に失敗しました' }
  }
}

// リアクション追加/削除
export async function toggleReaction(messageId: string, emoji: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const existing = await notificationDb.MessageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: user.id,
          emoji
        }
      }
    })

    if (existing) {
      await notificationDb.MessageReaction.delete({
        where: { id: existing.id }
      })
    } else {
      await notificationDb.MessageReaction.create({
        data: {
          messageId,
          userId: user.id,
          emoji
        }
      })
    }

    return { success: true }
  } catch (error) {
    console.error('toggleReaction error:', error)
    return { success: false, error: 'リアクションの更新に失敗しました' }
  }
}

// チャンネル詳細取得
export async function getChannelDetails(channelId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const channel = await notificationDb.Channel.findUnique({
      where: { id: channelId },
      include: {
        members: true,
        _count: {
          select: {
            messages: true
          }
        }
      }
    })

    if (!channel) {
      return { success: false, error: 'チャンネルが見つかりません' }
    }

    // メンバーか確認
    const isMember = channel.members.some(m => m.userId === user.id)
    if (!isMember) {
      return { success: false, error: 'このチャンネルにアクセスできません' }
    }

    return { success: true, data: channel }
  } catch (error) {
    console.error('getChannelDetails error:', error)
    return { success: false, error: 'チャンネル情報の取得に失敗しました' }
  }
}

// ユーティリティ関数
function extractMentions(content: string): string[] {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g
  const mentions: string[] = []
  let match

  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[2]) // userId
  }

  return mentions
}