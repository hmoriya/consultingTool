import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db'
    }
  }
})

async function main() {
  console.log('Adding sample project data...')

  // Get PM user ID
  const pmUserId = 'cmfn8r0cp000az5jh1yty461s' // From the database

  // Create sample projects
  const project1 = await projectDb.project.create({
    data: {
      name: 'デジタルトランスフォーメーション推進',
      code: 'DX001',
      clientId: 'client1',
      status: 'active',
      priority: 'high',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      budget: 50000000,
      description: 'クライアント企業のDX推進プロジェクト',
      projectMembers: {
        create: [
          {
            userId: pmUserId,
            role: 'PM',
            allocation: 100,
            startDate: new Date('2024-01-01')
          }
        ]
      },
      tasks: {
        create: [
          {
            title: '要件定義',
            description: 'システム要件の定義と文書化',
            status: 'completed',
            priority: 'high',
            startDate: new Date('2024-01-01'),
            dueDate: new Date('2024-02-28'),
            completedAt: new Date('2024-02-25'),
            estimatedHours: 160,
            actualHours: 150,
            assigneeId: pmUserId
          },
          {
            title: '設計フェーズ',
            description: 'システムアーキテクチャの設計',
            status: 'in_progress',
            priority: 'high',
            startDate: new Date('2024-03-01'),
            dueDate: new Date('2024-04-30'),
            estimatedHours: 200,
            actualHours: 120,
            assigneeId: pmUserId
          },
          {
            title: '実装フェーズ',
            description: 'システムの実装と単体テスト',
            status: 'todo',
            priority: 'medium',
            startDate: new Date('2024-05-01'),
            dueDate: new Date('2024-08-31'),
            estimatedHours: 480,
            assigneeId: pmUserId
          }
        ]
      },
      milestones: {
        create: [
          {
            name: '要件定義完了',
            description: '要件定義書の承認',
            dueDate: new Date('2024-02-28'),
            status: 'completed'
          },
          {
            name: '設計レビュー',
            description: '設計書のレビューと承認',
            dueDate: new Date('2024-04-30'),
            status: 'in_progress'
          },
          {
            name: 'システムリリース',
            description: '本番環境へのリリース',
            dueDate: new Date('2024-09-30'),
            status: 'pending'
          }
        ]
      }
    }
  })

  const project2 = await projectDb.project.create({
    data: {
      name: 'ビジネスプロセス最適化',
      code: 'BPO001',
      clientId: 'client2',
      status: 'active',
      priority: 'medium',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-07-31'),
      budget: 20000000,
      description: '業務プロセスの分析と最適化',
      projectMembers: {
        create: [
          {
            userId: pmUserId,
            role: 'PM',
            allocation: 50,
            startDate: new Date('2024-02-01')
          }
        ]
      },
      tasks: {
        create: [
          {
            title: '現状分析',
            description: '現在の業務プロセスの調査と分析',
            status: 'completed',
            priority: 'high',
            startDate: new Date('2024-02-01'),
            dueDate: new Date('2024-03-15'),
            completedAt: new Date('2024-03-10'),
            estimatedHours: 80,
            actualHours: 75,
            assigneeId: pmUserId
          },
          {
            title: '改善案策定',
            description: 'プロセス改善案の策定',
            status: 'in_progress',
            priority: 'high',
            startDate: new Date('2024-03-16'),
            dueDate: new Date('2024-04-30'),
            estimatedHours: 120,
            actualHours: 96,
            assigneeId: pmUserId
          }
        ]
      },
      milestones: {
        create: [
          {
            name: '現状分析完了',
            description: '現状分析レポートの提出',
            dueDate: new Date('2024-03-15'),
            status: 'completed'
          },
          {
            name: '改善案承認',
            description: '改善案の承認',
            dueDate: new Date('2024-04-30'),
            status: 'pending'
          }
        ]
      }
    }
  })

  // Create a risky task (overdue)
  await projectDb.task.create({
    data: {
      projectId: project1.id,
      title: '緊急：セキュリティパッチ適用',
      description: '重要なセキュリティパッチの適用が必要',
      status: 'in_progress',
      priority: 'critical',
      startDate: new Date('2024-03-01'),
      dueDate: new Date('2024-03-15'), // Past due
      estimatedHours: 16,
      actualHours: 5,
      assigneeId: pmUserId
    }
  })

  console.log('Sample project data added successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await projectDb.$disconnect()
  })