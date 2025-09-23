import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'
import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'

const notificationDb = new NotificationPrismaClient({
  datasources: {
    db: {
      url: process.env.NOTIFICATION_DATABASE_URL || 'file:./prisma/notification-service/data/notification.db'
    }
  }
})

const authDb = new AuthPrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL || 'file:./prisma/auth-service/data/auth.db'
    }
  }
})

async function main() {
  console.log('🌱 Seeding notification service...')

  // Get users from auth database
  const users = await authDb.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  })

  if (users.length === 0) {
    console.error('❌ No users found. Please run auth-service seed first.')
    return
  }

  const pmUser = users.find(u => u.email === 'pm@example.com')
  const consultantUser = users.find(u => u.email === 'consultant@example.com')
  const clientUser = users.find(u => u.email === 'client@example.com')
  const execUser = users.find(u => u.email === 'exec@example.com')

  if (!pmUser || !consultantUser || !clientUser || !execUser) {
    console.error('❌ Required users not found')
    return
  }

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await notificationDb.messageReaction.deleteMany()
  await notificationDb.messageMention.deleteMany()
  await notificationDb.messageReadReceipt.deleteMany()
  await notificationDb.message.deleteMany()
  await notificationDb.channelMember.deleteMany()
  await notificationDb.channel.deleteMany()

  // Create channels
  console.log('📢 Creating channels...')

  // Project channels
  const dxChannel = await notificationDb.channel.create({
    data: {
      name: 'DX推進PJ',
      description: 'デジタルトランスフォーメーション推進プロジェクトの連絡用',
      type: 'PROJECT',
      projectId: 'dx-project-001',
      isPrivate: false,
      createdBy: pmUser.id,
      members: {
        create: [
          { userId: pmUser.id, role: 'admin', lastReadAt: new Date('2025-09-20') },
          { userId: consultantUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: clientUser.id, role: 'member', lastReadAt: new Date('2025-09-20') }
        ]
      }
    }
  })

  const dataChannel = await notificationDb.channel.create({
    data: {
      name: 'データ分析PJ',
      description: 'データ分析基盤構築プロジェクトの連絡用',
      type: 'PROJECT',
      projectId: 'data-project-001',
      isPrivate: false,
      createdBy: pmUser.id,
      members: {
        create: [
          { userId: pmUser.id, role: 'admin', lastReadAt: new Date('2025-09-20') },
          { userId: consultantUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: execUser.id, role: 'member', lastReadAt: new Date('2025-09-20') }
        ]
      }
    }
  })

  // Group channels
  const companyChannel = await notificationDb.channel.create({
    data: {
      name: '全社情報共有',
      description: '全社員への連絡事項',
      type: 'GROUP',
      isPrivate: false,
      createdBy: execUser.id,
      members: {
        create: [
          { userId: execUser.id, role: 'admin', lastReadAt: new Date('2025-09-20') },
          { userId: pmUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: consultantUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: clientUser.id, role: 'member', lastReadAt: new Date('2025-09-20') }
        ]
      }
    }
  })

  const lunchChannel = await notificationDb.channel.create({
    data: {
      name: 'ランチ情報',
      description: 'ランチのお誘いや情報共有',
      type: 'GROUP',
      isPrivate: false,
      createdBy: consultantUser.id,
      members: {
        create: [
          { userId: consultantUser.id, role: 'admin', lastReadAt: new Date('2025-09-20') },
          { userId: pmUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: execUser.id, role: 'member', lastReadAt: new Date('2025-09-20') }
        ]
      }
    }
  })

  // Direct message channel
  const dmChannel = await notificationDb.channel.create({
    data: {
      type: 'DIRECT',
      isPrivate: true,
      createdBy: pmUser.id,
      members: {
        create: [
          { userId: pmUser.id, role: 'member', lastReadAt: new Date('2025-09-20') },
          { userId: consultantUser.id, role: 'member', lastReadAt: new Date('2025-09-20') }
        ]
      }
    }
  })

  // Create messages
  console.log('💬 Creating messages...')

  // Messages in DX channel
  const dxMessage1 = await notificationDb.message.create({
    data: {
      channelId: dxChannel.id,
      senderId: pmUser.id,
      content: 'DX推進の戦略について、来月のボードミーティングで発表予定です。',
      type: 'text',
      createdAt: new Date('2025-09-22T10:00:00Z')
    }
  })

  const dxMessage2 = await notificationDb.message.create({
    data: {
      channelId: dxChannel.id,
      senderId: consultantUser.id,
      content: 'これは素晴らしい戦略ですね！',
      type: 'text',
      createdAt: new Date('2025-09-22T10:30:00Z'),
      reactions: {
        create: [
          { userId: pmUser.id, emoji: '👍' },
          { userId: clientUser.id, emoji: '🎉' }
        ]
      }
    }
  })

  const dxMessage3 = await notificationDb.message.create({
    data: {
      channelId: dxChannel.id,
      senderId: clientUser.id,
      content: '私も賛成です。',
      type: 'text',
      parentId: dxMessage2.id,  // スレッドメッセージ
      createdAt: new Date('2025-09-22T11:00:00Z')
    }
  })

  // Messages in data channel
  await notificationDb.message.create({
    data: {
      channelId: dataChannel.id,
      senderId: consultantUser.id,
      content: 'データ分析基盤の設計書を共有します。',
      type: 'text',
      createdAt: new Date('2025-09-22T09:00:00Z')
    }
  })

  await notificationDb.message.create({
    data: {
      channelId: dataChannel.id,
      senderId: execUser.id,
      content: '確認しました。良い設計だと思います。',
      type: 'text',
      createdAt: new Date('2025-09-22T09:30:00Z'),
      reactions: {
        create: [
          { userId: consultantUser.id, emoji: '✨' }
        ]
      }
    }
  })

  // Messages in company channel
  await notificationDb.message.create({
    data: {
      channelId: companyChannel.id,
      senderId: execUser.id,
      content: '今月の全社会議は9月30日（月）15:00からです。',
      type: 'text',
      createdAt: new Date('2025-09-22T08:00:00Z'),
      mentions: {
        create: [
          { userId: pmUser.id, type: 'user' },
          { userId: consultantUser.id, type: 'user' }
        ]
      }
    }
  })

  await notificationDb.message.create({
    data: {
      channelId: companyChannel.id,
      senderId: pmUser.id,
      content: '承知しました。参加します。',
      type: 'text',
      createdAt: new Date('2025-09-22T08:30:00Z')
    }
  })

  // Messages in lunch channel
  await notificationDb.message.create({
    data: {
      channelId: lunchChannel.id,
      senderId: consultantUser.id,
      content: '今日のランチは新しいイタリアンレストランはどうですか？',
      type: 'text',
      createdAt: new Date('2025-09-22T11:30:00Z'),
      reactions: {
        create: [
          { userId: pmUser.id, emoji: '🍕' },
          { userId: execUser.id, emoji: '👍' }
        ]
      }
    }
  })

  // Direct messages
  await notificationDb.message.create({
    data: {
      channelId: dmChannel.id,
      senderId: pmUser.id,
      content: '明日のミーティングの資料を送ります。',
      type: 'text',
      createdAt: new Date('2025-09-22T14:00:00Z')
    }
  })

  await notificationDb.message.create({
    data: {
      channelId: dmChannel.id,
      senderId: consultantUser.id,
      content: 'ありがとうございます。確認します。',
      type: 'text',
      createdAt: new Date('2025-09-22T14:30:00Z')
    }
  })

  console.log('✅ Notification service seeding completed!')
  console.log(`   - Created ${5} channels`)
  console.log(`   - Created ${10} messages`)
  console.log(`   - Added reactions and mentions`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await notificationDb.$disconnect()
    await authDb.$disconnect()
  })