// 通知サービス用シード
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'

const notificationDb = new NotificationPrismaClient({
  log: ['error', 'warn']
})

export async function seedNotifications(users?: unknown, projects?: unknown) {
  console.log('🌱 Seeding Notification Service...')
  
  try {
    // ユーザーIDとプロジェクトIDが渡されていない場合はスキップ
    if (!users || !projects) {
      console.log('⚠️  Users or projects not provided. Skipping notification seed.')
      return
    }

    // ユーザーIDマッピング
    const userIds = {
      exec: users.execUser?.id,
      pm: users.pmUser?.id,
      consultant: users.consultantUser?.id,
      client: users.clientUser?.id,
      takahashi: users.allUsers?.find((u: unknown) => (u as { name: string }).name === '高橋 愛')?.id,
      watanabe: users.allUsers?.find((u: unknown) => (u as { name: string }).name === '渡辺 健')?.id
    }

    // プロジェクトIDマッピング
    const projectIds = {
      dataAnalysis: projects.find((p: unknown) => (p as { name: string }).name === 'データ分析基盤構築')?.id,
      businessProcess: projects.find((p: unknown) => (p as { name: string }).name === 'ビジネスオペレーション最適化')?.id,
      dx: projects.find((p: unknown) => (p as { name: string }).name === 'デジタルトランスフォーメーション推進')?.id
    }

    // IDが不足している場合はスキップ
    if (!userIds.pm || !userIds.consultant || !projectIds.dataAnalysis) {
      console.log('⚠️  Required user or project IDs not found. Skipping notification seed.')
      return
    }

    // 1. プロジェクトチャンネルの作成
    const projectChannels = await Promise.all([
      notificationDb.channel.create({
        data: {
          name: 'データ分析PJ',
          description: 'データ分析基盤構築プロジェクトの専用チャンネル',
          type: 'PROJECT',
          projectId: projectIds.dataAnalysis,
          isPrivate: false,
          createdBy: userIds.pm,
          members: {
            create: [
              { userId: userIds.pm, role: 'admin' },
              { userId: userIds.consultant, role: 'member' },
              ...(userIds.takahashi ? [{ userId: userIds.takahashi, role: 'member' as const }] : []),
            ]
          }
        }
      }),
      notificationDb.channel.create({
        data: {
          name: 'DX推進PJ',
          description: 'デジタルトランスフォーメーション推進プロジェクトの専用チャンネル',
          type: 'PROJECT',
          projectId: projectIds.dx,
          isPrivate: false,
          createdBy: userIds.exec || userIds.pm,
          members: {
            create: [
              ...(userIds.exec ? [{ userId: userIds.exec, role: 'admin' as const }] : []),
              { userId: userIds.pm, role: userIds.exec ? 'member' as const : 'admin' as const },
              ...(userIds.watanabe ? [{ userId: userIds.watanabe, role: 'member' as const }] : []),
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
          createdBy: userIds.exec || userIds.pm,
          members: {
            create: [
              ...(userIds.exec ? [{ userId: userIds.exec, role: 'admin' as const }] : []),
              { userId: userIds.pm, role: userIds.exec ? 'member' as const : 'admin' as const },
              { userId: userIds.consultant, role: 'member' as const },
              ...(userIds.client ? [{ userId: userIds.client, role: 'member' as const }] : []),
              ...(userIds.takahashi ? [{ userId: userIds.takahashi, role: 'member' as const }] : []),
              ...(userIds.watanabe ? [{ userId: userIds.watanabe, role: 'member' as const }] : []),
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
          createdBy: userIds.consultant,
          members: {
            create: [
              { userId: userIds.pm, role: 'member' as const },
              { userId: userIds.consultant, role: 'admin' as const },
              ...(userIds.takahashi ? [{ userId: userIds.takahashi, role: 'member' as const }] : []),
              ...(userIds.watanabe ? [{ userId: userIds.watanabe, role: 'member' as const }] : []),
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
          createdBy: userIds.pm,
          members: {
            create: [
              { userId: userIds.pm, role: 'member' },
              { userId: userIds.consultant, role: 'member' },
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
          senderId: userIds.pm,
          content: 'データ分析基盤構築プロジェクトのキックオフを行います。',
          type: 'text',
          createdAt: new Date('2024-01-15T09:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[0].id,
          senderId: userIds.consultant,
          content: 'データモデルの設計について、来週までに初期案を作成します。',
          type: 'text',
          createdAt: new Date('2024-01-15T10:30:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[0].id,
          senderId: userIds.takahashi || userIds.consultant,
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
          senderId: userIds.exec || userIds.pm,
          content: 'DX推進の戦略について、来月のボードミーティングで発表予定です。',
          type: 'text',
          createdAt: new Date('2024-01-20T11:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: projectChannels[1].id,
          senderId: userIds.pm,
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
          senderId: userIds.exec || userIds.pm,
          content: '来月から新しいセキュリティポリシーが適用されます。詳細は添付資料をご確認ください。',
          type: 'text',
          createdAt: new Date('2024-01-18T09:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: generalChannels[0].id,
          senderId: userIds.pm,
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
          senderId: userIds.consultant,
          content: '今日のランチは新しくできたイタリアンレストランはいかがですか？',
          type: 'text',
          createdAt: new Date('2024-01-22T11:30:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: generalChannels[1].id,
          senderId: userIds.takahashi || userIds.consultant,
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
          senderId: userIds.pm,
          content: 'お疲れ様です。来週のプロジェクトレビューの件でご相談があります。',
          type: 'text',
          createdAt: new Date('2024-01-23T17:00:00Z')
        }
      }),
      notificationDb.message.create({
        data: {
          channelId: dmChannels[0].id,
          senderId: userIds.consultant,
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
    const validUserIds = Object.values(userIds).filter(id => id !== undefined)
    const notificationPreferences = await Promise.all(
      validUserIds.map(userId =>
        notificationDb.notificationPreference.create({
          data: {
            userId: userId as string,
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
          userId: userIds.pm,
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
          userId: userIds.consultant,
          type: 'MENTION',
          title: 'メンションされました',
          content: '佐藤 次郎さんがあなたをメンションしました',
          metadata: JSON.stringify({ 
            channelId: generalChannels[0].id,
            senderId: userIds.pm
          }),
          link: `/messages/${generalChannels[0].id}`,
          isRead: false,
          createdAt: new Date('2024-01-19T16:05:00Z')
        }
      }),
      ...(userIds.exec ? [
        await notificationDb.notification.create({
          data: {
            userId: userIds.exec,
            type: 'PROJECT',
            title: 'プロジェクト更新',
            content: 'DX推進プロジェクトのマイルストーンが更新されました',
            metadata: JSON.stringify({ 
              projectId: projectIds.dx,
              type: 'milestone_update'
            }),
            link: `/projects/${projectIds.dx}`,
            isRead: true,
            readAt: new Date('2024-01-22T10:00:00Z'),
            createdAt: new Date('2024-01-21T18:00:00Z')
          }
        })
      ] : [])
    ])

    console.log(`✅ Notification Service seeded successfully:`)
    console.log(`   - Channels: ${allChannels.length}`)
    console.log(`   - Messages: ${messages.length}`)
    console.log(`   - Notifications: ${notifications.length}`)
    console.log(`   - Notification Preferences: ${notificationPreferences.length}`)
    
  } catch (_error) {
    console.error('❌ Error seeding Notification Service:', error)
    throw _error
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