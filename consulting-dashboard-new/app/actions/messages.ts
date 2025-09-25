'use server'

import { notificationDb } from '@/lib/db/notification-db'
import { db } from '@/lib/db'
import { getCurrentUser } from './auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// メンション抽出関数
function extractMentions(content: string): string[] {
  // @username または @[Full Name] パターンにマッチ
  const mentionPattern = /@\[([^\]]+)\]|@(\S+)/g
  const mentions: string[] = []
  let match

  while ((match = mentionPattern.exec(content)) !== null) {
    const mentionText = match[1] || match[2]
    // ここでは仮のユーザーID変換を行う
    // 実際の実装では、ユーザー名からIDを検索する必要がある
    mentions.push(mentionText)
  }

  return mentions
}

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
      const existingChannel = await notificationDb.channel.findFirst({
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
    const channel = await notificationDb.channel.create({
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
    const member = await notificationDb.channelMember.findUnique({
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
    const message = await notificationDb.message.create({
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
    await notificationDb.channel.update({
      where: { id: validated.channelId },
      data: { 
        lastMessageId: message.id,
        updatedAt: new Date()
      }
    })

    // メンション処理
    const mentions = extractMentions(validated.content)
    if (mentions.length > 0) {
      await notificationDb.messageMention.createMany({
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

    const channels = await notificationDb.channel.findMany({
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

        const unreadCount = await notificationDb.message.count({
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
    const member = await notificationDb.channelMember.findUnique({
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

    const messages = await notificationDb.message.findMany({
      where: {
        channelId,
        deletedAt: null,
        parentId: null // 親メッセージのみ取得（スレッド内のメッセージは除外）
      },
      include: {
        reactions: true,
        mentions: true,
        readReceipts: {
          where: {
            userId: user.id
          }
        },
        flags: {
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
    await notificationDb.channelMember.update({
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

    await notificationDb.messageReadReceipt.upsert({
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

    const existing = await notificationDb.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: user.id,
          emoji
        }
      }
    })

    if (existing) {
      await notificationDb.messageReaction.delete({
        where: { id: existing.id }
      })
    } else {
      await notificationDb.messageReaction.create({
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

    const channel = await notificationDb.channel.findUnique({
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

// チャンネルの既読時刻を更新（Server Action用）
export async function markChannelAsRead(channelId: string) {
  'use server'

  console.log('markChannelAsRead called for channel:', channelId)

  try {
    const user = await getCurrentUser()
    console.log('Current user:', user?.id, user?.email)

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // メンバーか確認し、既読時刻を更新
    const member = await notificationDb.channelMember.update({
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

    console.log('Updated member lastReadAt:', member.lastReadAt)

    if (!member) {
      return { success: false, error: 'このチャンネルにアクセスできません' }
    }

    revalidatePath('/messages')
    revalidatePath(`/messages/${channelId}`)
    return { success: true, data: { lastReadAt: member.lastReadAt } }
  } catch (error) {
    console.error('markChannelAsRead error:', error)
    return { success: false, error: '既読の更新に失敗しました' }
  }
}

// チャンネルの既読時刻を更新（Server Component用）
export async function updateChannelReadStatus(channelId: string, userId: string) {
  try {
    // メンバーか確認し、既読時刻を更新
    const member = await notificationDb.channelMember.update({
      where: {
        channelId_userId: {
          channelId,
          userId: userId
        }
      },
      data: {
        lastReadAt: new Date()
      }
    })

    return { success: true, data: { lastReadAt: member.lastReadAt } }
  } catch (error) {
    console.error('updateChannelReadStatus error:', error)
    return { success: false, error: '既読の更新に失敗しました' }
  }
}

// リアクションを追加
export async function addReaction(messageId: string, emoji: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // メッセージが存在するか確認
    const message = await notificationDb.message.findUnique({
      where: { id: messageId },
      include: { reactions: true }
    })

    if (!message) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    // 既存のリアクションを確認
    const existingReaction = await notificationDb.messageReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId: user.id,
          emoji
        }
      }
    })

    if (existingReaction) {
      // 既存のリアクションを削除（トグル動作）
      await notificationDb.messageReaction.delete({
        where: { id: existingReaction.id }
      })

      return { success: true, data: { action: 'removed' } }
    } else {
      // 新しいリアクションを追加
      await notificationDb.messageReaction.create({
        data: {
          messageId,
          userId: user.id,
          emoji
        }
      })

      return { success: true, data: { action: 'added' } }
    }
  } catch (error) {
    console.error('addReaction error:', error)
    return { success: false, error: 'リアクションの追加に失敗しました' }
  }
}

// スレッドメッセージを送信
export async function sendThreadMessage({
  messageId,
  content
}: {
  messageId: string
  content: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 親メッセージが存在するか確認
    const parentMessage = await notificationDb.message.findUnique({
      where: { id: messageId }
    })

    if (!parentMessage) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    // スレッドメッセージを作成（親メッセージのIDを設定）
    const threadMessage = await notificationDb.message.create({
      data: {
        channelId: parentMessage.channelId,
        senderId: user.id,
        content,
        type: 'text',
        parentId: messageId // 親メッセージのIDを設定
      }
    })

    return { success: true, data: threadMessage }
  } catch (error) {
    console.error('sendThreadMessage error:', error)
    return { success: false, error: 'スレッドメッセージの送信に失敗しました' }
  }
}

// スレッドメッセージを取得
export async function getThreadMessages(messageId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 指定されたメッセージIDを親とするメッセージを取得
    const threadMessages = await notificationDb.message.findMany({
      where: { parentId: messageId },
      orderBy: { createdAt: 'asc' }
    })

    // ユーザー情報を取得
    const senderIds = [...new Set(threadMessages.map(m => m.senderId))]
    const senders = await db.user.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, email: true }
    })
    const senderMap = new Map(senders.map(s => [s.id, s]))

    // メッセージにユーザー情報を追加
    const messagesWithSender = threadMessages.map(msg => ({
      ...msg,
      sender: senderMap.get(msg.senderId) || { id: msg.senderId, name: 'Unknown', email: '' }
    }))

    return { success: true, data: messagesWithSender }
  } catch (error) {
    console.error('getThreadMessages error:', error)
    return { success: false, error: 'スレッドメッセージの取得に失敗しました' }
  }
}

// メッセージを編集
export async function editMessage(messageId: string, content: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 自分のメッセージか確認
    const message = await notificationDb.message.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    if (message.senderId !== user.id) {
      return { success: false, error: '自分のメッセージのみ編集できます' }
    }

    // メッセージを更新
    const updated = await notificationDb.message.update({
      where: { id: messageId },
      data: {
        content,
        editedAt: new Date()
      }
    })

    return { success: true, data: updated }
  } catch (error) {
    console.error('editMessage error:', error)
    return { success: false, error: 'メッセージの編集に失敗しました' }
  }
}

// メッセージを編集
export async function updateMessage(messageId: string, content: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 自分のメッセージか確認
    const message = await notificationDb.message.findUnique({
      where: { id: messageId }
    })

    if (!message) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    if (message.senderId !== user.id) {
      return { success: false, error: '自分のメッセージのみ編集できます' }
    }

    // 24時間以内か確認
    const createdAt = new Date(message.createdAt)
    const now = new Date()
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)

    if (hoursSinceCreation > 24) {
      return { success: false, error: '投稿から24時間を過ぎたメッセージは編集できません' }
    }

    // メッセージを更新
    const updated = await notificationDb.message.update({
      where: { id: messageId },
      data: {
        content,
        editedAt: new Date()
      }
    })

    // 更新されたメッセージに送信者情報を追加
    const messageWithSender = await notificationDb.message.findUnique({
      where: { id: messageId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        thread: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      }
    })

    return { success: true, data: messageWithSender }
  } catch (error) {
    console.error('updateMessage error:', error)
    return { success: false, error: 'メッセージの編集に失敗しました' }
  }
}

// メッセージを削除
export async function deleteMessage(messageId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // メッセージとチャンネル情報を取得
    const message = await notificationDb.message.findUnique({
      where: { id: messageId },
      include: {
        channel: {
          include: {
            members: {
              where: { userId: user.id }
            }
          }
        }
      }
    })

    if (!message) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    // 削除権限の確認（送信者またはチャンネル管理者）
    const isOwner = message.senderId === user.id
    const isAdmin = message.channel.members[0]?.role === 'Admin' ||
                    message.channel.members[0]?.role === 'Owner'

    if (!isOwner && !isAdmin) {
      return { success: false, error: '削除権限がありません' }
    }

    // ソフトデリート
    await notificationDb.message.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('deleteMessage error:', error)
    return { success: false, error: 'メッセージの削除に失敗しました' }
  }
}

// メッセージをピン留め
export async function pinMessage(messageId: string, channelId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // チャンネルメンバーか確認
    const member = await notificationDb.channelMember.findUnique({
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

    // TODO: ピン留め機能の実装
    // 現在のスキーマにピン留め用のフィールドがないため、スキーマ更新が必要

    return { success: true }
  } catch (error) {
    console.error('pinMessage error:', error)
    return { success: false, error: 'メッセージのピン留めに失敗しました' }
  }
}

// メッセージにフラグを立てる/解除する
export async function toggleMessageFlag(messageId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // メッセージが存在するか確認
    const message = await notificationDb.message.findUnique({
      where: { id: messageId },
      include: {
        channel: {
          include: {
            members: {
              where: { userId: user.id }
            }
          }
        }
      }
    })

    if (!message) {
      return { success: false, error: 'メッセージが見つかりません' }
    }

    if (message.channel.members.length === 0) {
      return { success: false, error: 'このメッセージにアクセスできません' }
    }

    // 既存のフラグを確認
    const existingFlag = await notificationDb.messageFlag.findUnique({
      where: {
        messageId_userId: {
          messageId,
          userId: user.id
        }
      }
    })

    if (existingFlag) {
      // フラグが存在する場合は削除
      await notificationDb.messageFlag.delete({
        where: { id: existingFlag.id }
      })
      return { success: true, data: { flagged: false } }
    } else {
      // フラグが存在しない場合は作成
      await notificationDb.messageFlag.create({
        data: {
          messageId,
          userId: user.id
        }
      })
      return { success: true, data: { flagged: true } }
    }
  } catch (error) {
    console.error('toggleMessageFlag error:', error)
    return { success: false, error: 'フラグの設定に失敗しました' }
  }
}

// フラグ付きメッセージ一覧を取得
export async function getFlaggedMessages() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const flags = await notificationDb.messageFlag.findMany({
      where: {
        userId: user.id
      },
      include: {
        message: {
          include: {
            channel: true,
            reactions: true,
            mentions: true,
            flags: {
              where: {
                userId: user.id
              }
            },
            _count: {
              select: {
                threadMessages: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // ユーザー情報を取得
    const senderIds = [...new Set(flags.map(f => f.message.senderId))]
    const users = await db.user.findMany({
      where: { id: { in: senderIds } },
      select: { id: true, name: true, email: true }
    })

    const userMap = new Map(users.map(u => [u.id, u]))

    const messagesWithSender = flags.map(flag => ({
      ...flag.message,
      sender: userMap.get(flag.message.senderId) || {
        id: flag.message.senderId,
        name: 'Unknown User',
        email: ''
      }
    }))

    return { success: true, data: messagesWithSender }
  } catch (error) {
    console.error('getFlaggedMessages error:', error)
    return { success: false, error: 'フラグ付きメッセージの取得に失敗しました' }
  }
}