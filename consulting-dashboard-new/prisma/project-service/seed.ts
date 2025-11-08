import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'

const projectDb = new ProjectPrismaClient({
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db'
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

export async function seedProjectService() {
  console.log('🌱 Seeding Project Service...')

  try {
    // 組織情報を取得
    const clientOrg = await authDb.organization.findFirst({
      where: { type: 'client' }
    })
    
    if (!clientOrg) {
      throw new Error('Client organization not found. Please run auth service seed first.')
    }

    // ユーザー情報を取得
    const pmUser = await authDb.user.findFirst({
      where: { role: { name: 'PM' } },
      include: { role: true }
    })
    
    const consultantUser = await authDb.user.findFirst({
      where: { role: { name: 'Consultant' } },
      include: { role: true }
    })

    if (!pmUser || !consultantUser) {
      throw new Error('Required users not found. Please run auth service seed first.')
    }

    // プロジェクトを作成または取得
    const projectData = [
      {
        name: 'デジタルトランスフォーメーション推進',
        code: 'DX001',
        clientId: clientOrg.id,
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        budget: 30000000,
        description: '既存業務プロセスのデジタル化と新規ビジネスモデル構築',
      },
      {
        name: 'ビジネスオペレーション最適化',
        code: 'BPO001',
        clientId: clientOrg.id,
        status: 'planning',
        priority: 'medium',
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-09-30'),
        budget: 15000000,
        description: '業務効率化と生産性向上を目的としたプロセス改善',
      },
      {
        name: 'データ分析基盤構築',
        code: 'DAP001',
        clientId: clientOrg.id,
        status: 'active',
        priority: 'high',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-11-30'),
        budget: 25000000,
        description: '全社データ統合とAI活用に向けた基盤整備',
      }
    ]

    const projects = await Promise.all(
      projectData.map(async (data) => {
        // 既存のプロジェクトを確認
        const existing = await projectDb.project.findUnique({
          where: { code: data.code }
        })
        
        if (existing) {
          console.log(`✅ Project ${data.code} already exists`)
          return existing
        }
        
        // 存在しない場合は作成
        return await projectDb.project.create({ data })
      })
    )

    console.log(`✅ Ensured ${projects.length} projects exist`)

    // 既存のProjectMemberを削除してから追加
    console.log('Clearing existing project members...')
    await projectDb.projectMember.deleteMany({})
    
    // プロジェクトメンバーを追加
    const pmUserId = pmUser.id
    const consultantUserId = consultantUser.id
    
    const memberData = [
      {
        projectId: projects[0].id,
        userId: pmUserId,
        role: 'PM',
        allocation: 0.5,
        startDate: new Date('2024-01-15')
      },
      {
        projectId: projects[0].id,
        userId: consultantUserId,
        role: 'consultant',
        allocation: 1.0,
        startDate: new Date('2024-01-15')
      },
      {
        projectId: projects[1].id,
        userId: pmUserId,
        role: 'PM',
        allocation: 0.3,
        startDate: new Date('2024-04-01')
      },
      {
        projectId: projects[2].id,
        userId: pmUserId,
        role: 'PM',
        allocation: 0.5,
        startDate: new Date('2024-03-01')
      }
    ]

    await projectDb.projectMember.createMany({
      data: memberData
    })
    
    console.log(`✅ Added ${memberData.length} project members with correct user IDs`)

    console.log('✅ Added project members')

    // マイルストーンを作成
    await projectDb.milestone.createMany({
      data: [
        {
          projectId: projects[0].id,
          name: '要件定義完了',
          description: 'ビジネス要件と技術要件の確定',
          dueDate: new Date('2024-03-31'),
          status: 'completed'
        },
        {
          projectId: projects[0].id,
          name: '基本設計完了',
          description: 'システムアーキテクチャと主要機能の設計',
          dueDate: new Date('2024-06-30'),
          status: 'active'
        }
      ]
    })

    console.log('✅ Created milestones')

    // タスクを作成
    await projectDb.task.createMany({
      data: [
        {
          projectId: projects[0].id,
          title: '現行業務フロー分析',
          description: '各部門の業務プロセスをヒアリングし、文書化する',
          assigneeId: consultantUser.id,
          status: 'completed',
          priority: 'high',
          estimatedHours: 80,
          actualHours: 92,
          dueDate: new Date('2024-02-28')
        },
        {
          projectId: projects[0].id,
          title: 'システム要件定義書作成',
          description: 'ビジネス要件を基にシステム要件を定義',
          assigneeId: consultantUser.id,
          status: 'in_progress',
          priority: 'high',
          estimatedHours: 120,
          actualHours: 45,
          dueDate: new Date('2024-03-15')
        }
      ]
    })

    console.log('✅ Created tasks')

    console.log('✅ Project Service seeded successfully')

  } catch (_error) {
    console.error('❌ Error seeding project service:', error)
    throw error
  }
}

if (require.main === module) {
  seedProjectService()
    .then(() => {
      console.log('Project seed completed')
    })
    .catch((e) => {
      console.error('Error seeding project data:', e)
      process.exit(1)
    })
    .finally(async () => {
      await projectDb.$disconnect()
      await authDb.$disconnect()
    })
}