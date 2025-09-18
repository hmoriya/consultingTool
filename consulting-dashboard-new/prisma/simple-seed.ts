import { PrismaClient } from '@prisma/client'  // 通常のPrismaクライアント（dev.db用）
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

const authDb = new PrismaClient()  // dev.dbに接続
const projectDb = new ProjectPrismaClient()

async function simpleSeed() {
  console.log('🌱 Simple Seed: Creating projects for current PM user...')

  try {
    // ログで確認したPMユーザーのIDとクライアント組織IDを直接使用
    const pmUserId = 'cmfp4im4w000mz5d6cgmnik5w'  // 鈴木花子のID（ログから確認）
    const pmUserName = '鈴木 花子'
    const clientOrgId = 'cmfp4im4w000tz5d63t8wvhpg'  // クライアント組織のID（仮）

    console.log(`Using PM user: ${pmUserName} (${pmUserId})`)

    // 既存のプロジェクトを削除
    await projectDb.projectMember.deleteMany({})
    await projectDb.task.deleteMany({})
    await projectDb.milestone.deleteMany({})
    await projectDb.project.deleteMany({})

    // プロジェクトを作成
    const project1 = await projectDb.project.create({
      data: {
        name: 'デジタルトランスフォーメーション推進',
        code: 'DX001',
        clientId: clientOrgId,
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        budget: 30000000,
        description: '既存業務プロセスのデジタル化と新規ビジネスモデル構築',
      }
    })

    const project2 = await projectDb.project.create({
      data: {
        name: 'ビジネスプロセス最適化',
        code: 'BPO001',
        clientId: clientOrgId,
        status: 'planning',
        priority: 'medium',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        budget: 15000000,
        description: '業務効率化と生産性向上を目的としたプロセス改善',
      }
    })

    const project3 = await projectDb.project.create({
      data: {
        name: 'データ分析基盤構築',
        code: 'DAP001',
        clientId: clientOrgId,
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-11-30'),
        budget: 25000000,
        description: '全社データ統合とAI活用に向けた基盤整備',
      }
    })

    console.log('✅ Created 3 projects')

    // PMユーザーをプロジェクトメンバーとして追加
    await projectDb.projectMember.createMany({
      data: [
        {
          projectId: project1.id,
          userId: pmUserId,
          role: 'PM',
          allocation: 0.5,
          startDate: new Date('2024-01-15')
        },
        {
          projectId: project2.id,
          userId: pmUserId,
          role: 'PM',
          allocation: 0.3,
          startDate: new Date('2024-04-01')
        },
        {
          projectId: project3.id,
          userId: pmUserId,
          role: 'PM',
          allocation: 0.5,
          startDate: new Date('2024-03-01')
        }
      ]
    })

    console.log(`✅ Assigned PM user ${pmUserName} to all projects`)

    // サンプルタスクを作成
    await projectDb.task.createMany({
      data: [
        {
          projectId: project1.id,
          title: '現行業務フロー分析',
          description: '各部門の業務プロセスをヒアリングし、文書化する',
          assigneeId: pmUserId,
          status: 'completed',
          priority: 'high',
          estimatedHours: 80,
          actualHours: 92,
          dueDate: new Date('2024-02-28')
        },
        {
          projectId: project1.id,
          title: 'システム要件定義書作成',
          description: 'ビジネス要件を基にシステム要件を定義',
          assigneeId: pmUserId,
          status: 'in_progress',
          priority: 'high',
          estimatedHours: 120,
          actualHours: 45,
          dueDate: new Date('2024-03-15')
        }
      ]
    })

    console.log('✅ Created sample tasks')
    console.log('✅ Simple seed completed successfully!')

  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await authDb.$disconnect()
    await projectDb.$disconnect()
  }
}

simpleSeed()
  .catch(console.error)
  .finally(() => process.exit())