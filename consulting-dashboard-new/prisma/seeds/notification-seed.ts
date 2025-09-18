// 通知サービス用シード
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'

const notificationDb = new NotificationPrismaClient({
  log: ['error', 'warn']
})

export async function seedNotifications() {
  console.log('🌱 Seeding Notification Service...')
  
  try {
    // ユーザーID（メインDBから取得した実際のID）
    const users = {
      exec: 'cln8abc120001qs01example1',      // 山田 太郎 (Executive)
      pm: 'cln8abc120001qs01example2',        // 鈴木 花子 (PM)
      consultant: 'cln8abc120001qs01example3', // 佐藤 次郎 (Consultant)
      takahashi: 'cln8abc120001qs01example4',  // 高橋 愛
      watanabe: 'cln8abc120001qs01example5'    // 渡辺 健
    }

    // プロジェクトID（プロジェクトDBから取得した実際のID）
    const projects = {
      dataAnalysis: 'cmfoljjs70000ymz8dp1fjx01',    // データ分析基盤構築
      businessProcess: 'cmfoljjs70002ymz86nhvz1w5',  // ビジネスプロセス最適化
      dx: 'cmfoljjs70001ymz8x34kumf1'                // デジタルトランスフォーメーション推進
    }

    // 1. プロジェクトチャンネルの作成
    const projectChannels = await Promise.all([
      notificationDb.channel.create({
        data: {
          name: 'データ分析PJ',
          description: 'データ分析基盤構築プロジェクトの専用チャンネル',
          type: 'PROJECT',
          projectId: projects.dataAnalysis,
          isPrivate: false,
          createdBy: users.pm,
          members: {
            create: [
              { userId: users.pm, role: 'admin' },
              { userId: users.consultant, role: 'member' },
              { userId: users.takahashi, role: 'member' },
            ]
          }
        }
      }),
      notificationDb.channel.create({
        data: {
          name: 'DX推進PJ',
          description: 'デジタルトランスフォーメーション推進プロジェクトの専用チャンネル',
          type: 'PROJECT',
          projectId: projects.dx,
          isPrivate: false,
          createdBy: users.exec,
          members: {
            create: [
              { userId: users.exec, role: 'admin' },
              { userId: users.pm, role: 'member' },
              { userId: users.watanabe, role: 'member' },
            ]
          }
        }
      })
    ])

    // 2. 一般チャンネルの作成
    const generalChannels = await Promise.all([
      notificationDb.channel.create({
        data: {
          name: '全社情報共有',
          description: '全社レベルの重要な情報を共有するチャンネル',
          type: 'GROUP',
          isPrivate: false,
          createdBy: users.exec,
          members: {
            create: [
              { userId: users.exec, role: 'admin' },
              { userId: users.pm, role: 'member' },
              { userId: users.consultant, role: 'member' },
              { userId: users.takahashi, role: 'member' },
              { userId: users.watanabe, role: 'member' },
            ]
          }
        }
      }),
      notificationDb.channel.create({
        data: {
          name: 'ランチ情報',
          description: 'カジュアルな情報交換とランチの相談',
          type: 'GROUP',
          isPrivate: false,
          createdBy: users.consultant,
          members: {
            create: [
              { userId: users.pm, role: 'member' },
              { userId: users.consultant, role: 'admin' },
              { userId: users.takahashi, role: 'member' },
              { userId: users.watanabe, role: 'member' },
            ]
          }
        }
      })
    ])

    // 3. ダイレクトメッセージチャンネルの作成
    const dmChannels = await Promise.all([
      notificationDb.channel.create({
        data: {
          type: 'DIRECT',
          isPrivate: true,
          createdBy: users.pm,
          members: {
            create: [
              { userId: users.pm, role: 'member' },
              { userId: users.consultant, role: 'member' },
            ]
          }
        }
      })
    ])

    const allChannels = [...projectChannels, ...generalChannels, ...dmChannels]

    // 4. サンプルメッセージの作成
    const messages = []

    // データ分析PJチャンネルのメッセージ
    const dataAnalysisMessages = await Promise.all([
      notificationDb.message.create({
        data: {
          channelId: projectChannels[0].id,
          senderId: users.pm,
          content: 'データ分析基盤構築プロジェクトのキックオフを行います。',
          type: 'text',
          createdAt: new Date('2024-01-15T09:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[0].id,
          senderId: users.consultant,
          content: 'データモデルの設計について、来週までに初期案を作成します。',
          type: 'text',
          createdAt: new Date('2024-01-15T10:30:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[0].id,
          senderId: users.takahashi,
          content: 'ETLプロセスの要件定義書を共有します。',
          type: 'text',
          createdAt: new Date('2024-01-16T14:00:00Z')
        }
      })
    ])

    // DX推進PJチャンネルのメッセージ
    const dxMessages = await Promise.all([
      notificationDb.message.create({
        data: {
          channelId: projectChannels[1].id,
          senderId: users.exec,
          content: 'DX推進の戦略について、来月のボードミーティングで発表予定です。',
          type: 'text',
          createdAt: new Date('2024-01-20T11:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[1].id,
          senderId: users.pm,
          content: '現在の進捗は70%です。予定通り来月末には完了予定です。',
          type: 'text',
          createdAt: new Date('2024-01-21T15:30:00Z')
        }
      })
    ])

    // 全社情報共有チャンネルのメッセージ
    const generalMessages = await Promise.all([
      notificationDb.message.create({
        data: {
          channelId: generalChannels[0].id,
          senderId: users.exec,
          content: '来月から新しいセキュリティポリシーが適用されます。詳細は添付資料をご確認ください。',
          type: 'text',
          createdAt: new Date('2024-01-18T09:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: generalChannels[0].id,
          senderId: users.pm,
          content: 'Q1の業績報告会は2月15日に開催予定です。',
          type: 'text',
          createdAt: new Date('2024-01-19T16:00:00Z')
        }
      })
    ])

    // ランチ情報チャンネルのメッセージ
    const lunchMessages = await Promise.all([
      notificationDb.message.create({
        data: {
          channelId: generalChannels[1].id,
          senderId: users.consultant,
          content: '今日のランチは新しくできたイタリアンレストランはいかがですか？',
          type: 'text',
          createdAt: new Date('2024-01-22T11:30:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: generalChannels[1].id,
          senderId: users.takahashi,
          content: '良いですね！12:30に1階のロビーで待ち合わせしましょう。',
          type: 'text',
          createdAt: new Date('2024-01-22T11:35:00Z')
        }
      })
    ])

    // DMのメッセージ
    const dmMessages = await Promise.all([
      notificationDb.message.create({
        data: {
          channelId: dmChannels[0].id,
          senderId: users.pm,
          content: 'お疲れ様です。来週のプロジェクトレビューの件でご相談があります。',
          type: 'text',
          createdAt: new Date('2024-01-23T17:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: dmChannels[0].id,
          senderId: users.consultant,
          content: 'お疲れ様です。明日の午前中でしたら時間がありますが、いかがでしょうか？',
          type: 'text',
          createdAt: new Date('2024-01-23T17:30:00Z')
        }
      })
    ])

    messages.push(...dataAnalysisMessages, ...dxMessages, ...generalMessages, ...lunchMessages, ...dmMessages)

    // 5. 最新メッセージの関連付け
    for (let i = 0; i < allChannels.length; i++) {
      const channel = allChannels[i]
      const channelMessages = messages.filter(msg => msg.channelId === channel.id)
      if (channelMessages.length > 0) {
        const latestMessage = channelMessages[channelMessages.length - 1]
        await notificationDb.channel.update({
          where: { id: channel.id },
          data: { lastMessageId: latestMessage.id }
        })
      }
    }

    // 6. 通知設定の作成
    const notificationPreferences = await Promise.all(
      Object.values(users).map(userId =>
        notificationDb.notificationPreference.create({
          data: {
            userId,
            emailEnabled: true,
            pushEnabled: true,
            inAppEnabled: true,
            messageNotification: true,
            mentionNotification: true,
            taskNotification: true,
            approvalNotification: true,
            projectNotification: true
          }
        })
      )
    )

    // 7. サンプル通知の作成
    const notifications = await Promise.all([
      notificationDb.notification.create({
        data: {
          userId: users.pm,
          type: 'MESSAGE',
          title: '新しいメッセージ',
          content: 'データ分析PJチャンネルに新しいメッセージが投稿されました',
          metadata: JSON.stringify({ 
            channelId: projectChannels[0].id,
            messageId: dataAnalysisMessages[0].id 
          }),
          link: `/messages/${projectChannels[0].id}`,
          isRead: false,
          createdAt: new Date('2024-01-15T09:01:00Z')
        }
      }),
      notificationDb.notification.create({
        data: {
          userId: users.consultant,
          type: 'MENTION',
          title: 'メンションされました',
          content: '佐藤 次郎さんがあなたをメンションしました',
          metadata: JSON.stringify({ 
            channelId: generalChannels[0].id,
            senderId: users.pm
          }),
          link: `/messages/${generalChannels[0].id}`,
          isRead: false,
          createdAt: new Date('2024-01-19T16:05:00Z')
        }
      }),
      notificationDb.notification.create({
        data: {
          userId: users.exec,
          type: 'PROJECT',
          title: 'プロジェクト更新',
          content: 'DX推進プロジェクトのマイルストーンが更新されました',
          metadata: JSON.stringify({ 
            projectId: projects.dx,
            type: 'milestone_update'
          }),
          link: `/projects/${projects.dx}`,
          isRead: true,
          readAt: new Date('2024-01-22T10:00:00Z'),
          createdAt: new Date('2024-01-21T18:00:00Z')
        }
      })
    ])

    console.log(`✅ Notification Service seeded successfully:`)
    console.log(`   - Channels: ${allChannels.length}`)
    console.log(`   - Messages: ${messages.length}`)
    console.log(`   - Notifications: ${notifications.length}`)
    console.log(`   - Notification Preferences: ${notificationPreferences.length}`)
    
  } catch (error) {
    console.error('❌ Error seeding Notification Service:', error)
    throw error
  } finally {
    await notificationDb.$disconnect()
  }
}

// スクリプトが直接実行された場合の処理
if (require.main === module) {
  seedNotifications()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
}