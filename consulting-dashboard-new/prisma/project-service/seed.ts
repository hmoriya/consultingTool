import { PrismaClient } from '@prisma/project-client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db'
    }
  }
})

async function main() {
  console.log('Seeding project database...')
  console.log('Database URL:', process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db')

  // Clean existing data
  console.log('Cleaning existing data...')
  await prisma.task.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  console.log('Existing data cleaned.')

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'デジタルトランスフォーメーション推進',
      code: 'DX001',
      clientId: 'client-1',
      status: 'active',
      priority: 'high',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 50000000,
      description: 'クライアント企業のDX推進を支援するプロジェクト',
      projectMembers: {
        create: [
          {
            userId: 'cmflvzkcb000hz5jxuduxtr7d', // PM user from main database
            role: 'PM',
            allocation: 0.5,
            startDate: new Date('2024-01-01'),
            responsibilities: 'プロジェクト全体の管理、ステークホルダーとの調整',
          },
          {
            userId: '3',
            role: 'lead',
            allocation: 1.0,
            startDate: new Date('2024-01-01'),
            responsibilities: 'テクニカルリード、アーキテクチャ設計',
          },
          {
            userId: '4',
            role: 'consultant',
            allocation: 1.0,
            startDate: new Date('2024-01-01'),
            responsibilities: 'ビジネス分析、要件定義',
          }
        ]
      },
      milestones: {
        create: [
          {
            name: 'Phase 1 完了',
            description: '現状分析と要件定義の完了',
            dueDate: new Date('2024-03-31'),
            status: 'completed',
          },
          {
            name: 'Phase 2 完了',
            description: 'システム設計の完了',
            dueDate: new Date('2024-06-30'),
            status: 'completed',
          },
          {
            name: 'Phase 3 完了',
            description: '開発とテストの完了',
            dueDate: new Date('2024-09-30'),
            status: 'in_progress',
          },
          {
            name: 'プロジェクト完了',
            description: '本番リリースと移行完了',
            dueDate: new Date('2024-12-31'),
            status: 'not_started',
          }
        ]
      },
      tasks: {
        create: [
          {
            title: 'API設計書作成',
            description: 'マイクロサービス間のAPI仕様を定義',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date('2024-09-20'),
            assigneeId: '3',
            estimatedHours: 40,
            actualHours: 25,
          },
          {
            title: '認証機能実装',
            description: 'OAuth2.0による認証機能の実装',
            status: 'not_started',
            priority: 'high',
            dueDate: new Date('2024-09-25'),
            assigneeId: '4',
            estimatedHours: 60,
          },
          {
            title: 'データベース設計',
            description: 'マスターデータのDB設計',
            status: 'completed',
            priority: 'medium',
            dueDate: new Date('2024-09-10'),
            assigneeId: '3',
            estimatedHours: 30,
            actualHours: 35,
          },
          {
            title: 'UIモックアップ作成',
            description: '管理画面のUIモックアップ',
            status: 'review',
            priority: 'medium',
            dueDate: new Date('2024-09-15'),
            assigneeId: '4',
            estimatedHours: 20,
            actualHours: 18,
          },
          {
            title: '統合テスト計画書作成',
            description: 'システム統合テストの計画書作成',
            status: 'not_started',
            priority: 'low',
            dueDate: new Date('2024-10-01'),
            assigneeId: '3',
            estimatedHours: 15,
          }
        ]
      }
    }
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'ビジネスプロセス最適化',
      code: 'BPO001',
      clientId: 'client-2',
      status: 'active',
      priority: 'medium',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-10-31'),
      budget: 30000000,
      description: '業務プロセスの見直しと効率化',
      projectMembers: {
        create: [
          {
            userId: 'cmflvzkcb000hz5jxuduxtr7d', // PM user
            role: 'PM',
            allocation: 0.3,
            startDate: new Date('2024-04-01'),
            responsibilities: 'プロジェクト管理、クライアント対応',
          },
          {
            userId: '4',
            role: 'senior',
            allocation: 0.8,
            startDate: new Date('2024-04-01'),
            responsibilities: 'プロセス分析、改善提案',
          }
        ]
      },
      milestones: {
        create: [
          {
            name: '現状分析完了',
            description: '現状業務の可視化と課題抽出',
            dueDate: new Date('2024-05-31'),
            status: 'completed',
          },
          {
            name: '改善案策定',
            description: 'To-Beプロセスの設計',
            dueDate: new Date('2024-07-31'),
            status: 'completed',
          },
          {
            name: '実装完了',
            description: '新プロセスの導入と定着',
            dueDate: new Date('2024-10-31'),
            status: 'in_progress',
          }
        ]
      },
      tasks: {
        create: [
          {
            title: 'ワークフロー図作成',
            description: '新規承認ワークフローの設計',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date('2024-09-18'),
            assigneeId: '4',
            estimatedHours: 25,
            actualHours: 15,
          },
          {
            title: 'KPI設定',
            description: '改善効果測定のためのKPI定義',
            status: 'review',
            priority: 'medium',
            dueDate: new Date('2024-09-20'),
            assigneeId: '2',
            estimatedHours: 10,
            actualHours: 8,
          },
          {
            title: '研修資料作成',
            description: '新プロセスの研修資料作成',
            status: 'not_started',
            priority: 'low',
            dueDate: new Date('2024-10-05'),
            assigneeId: '4',
            estimatedHours: 20,
          }
        ]
      }
    }
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'データ分析基盤構築',
      code: 'DAP001',
      clientId: 'client-3',
      status: 'planning',
      priority: 'high',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-03-31'),
      budget: 40000000,
      description: 'ビッグデータ分析基盤の構築',
      projectMembers: {
        create: [
          {
            userId: 'cmflvzkcb000hz5jxuduxtr7d',
            role: 'PM',
            allocation: 0.2,
            startDate: new Date('2024-10-01'),
            responsibilities: 'プロジェクト企画、予算管理',
          }
        ]
      },
      milestones: {
        create: [
          {
            name: 'キックオフ',
            description: 'プロジェクトキックオフミーティング',
            dueDate: new Date('2024-10-01'),
            status: 'not_started',
          },
          {
            name: '要件定義完了',
            description: 'データ分析要件の確定',
            dueDate: new Date('2024-11-30'),
            status: 'not_started',
          }
        ]
      }
    }
  })

  console.log('Created projects:', {
    project1: project1.name,
    project2: project2.name,
    project3: project3.name,
  })

  // Verify data was inserted
  const projectCount = await prisma.project.count()
  console.log(`Total projects in database: ${projectCount}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })