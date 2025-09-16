import { PrismaClient } from '@prisma/client'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import bcrypt from 'bcryptjs'

const coreDb = new PrismaClient()
const projectDb = new ProjectPrismaClient()

async function clearProjectData() {
  // Clear project database
  await projectDb.projectMember.deleteMany()
  await projectDb.task.deleteMany()
  await projectDb.milestone.deleteMany()
  await projectDb.risk.deleteMany()
  await projectDb.issue.deleteMany()
  await projectDb.deliverable.deleteMany()
  await projectDb.project.deleteMany()
}

async function seedProjects(clientIds: string[]) {
  // Create projects for each client
  const projects = []
  
  // テックイノベーション projects
  if (clientIds[0]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: 'DXプラットフォーム構築',
          code: 'TECH-DX-001',
          clientId: clientIds[0],
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          budget: 50000000,
          description: 'デジタル変革を推進するための統合プラットフォーム構築プロジェクト',
        }
      }),
      await projectDb.project.create({
        data: {
          name: 'AIチャットボット開発',
          code: 'TECH-AI-002',
          clientId: clientIds[0],
          status: 'active',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-09-30'),
          budget: 20000000,
          description: 'カスタマーサポート用AIチャットボットの開発',
        }
      })
    )
  }

  // グローバル製造 projects
  if (clientIds[1]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: 'スマートファクトリー導入',
          code: 'MFG-SF-001',
          clientId: clientIds[1],
          status: 'active',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-11-30'),
          budget: 80000000,
          description: 'IoT技術を活用した次世代工場の構築',
        }
      }),
      await projectDb.project.create({
        data: {
          name: 'サプライチェーン最適化',
          code: 'MFG-SC-002',
          clientId: clientIds[1],
          status: 'planning',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2025-03-31'),
          budget: 45000000,
          description: 'グローバルサプライチェーンの可視化と最適化',
        }
      })
    )
  }

  // 金融ホールディングス projects
  if (clientIds[2]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: 'デジタルバンキング刷新',
          code: 'FIN-DB-001',
          clientId: clientIds[2],
          status: 'active',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-10-31'),
          budget: 120000000,
          description: '次世代デジタルバンキングシステムの構築',
        }
      })
    )
  }

  // リテール商事 projects
  if (clientIds[3]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: 'オムニチャネル統合',
          code: 'RET-OC-001',
          clientId: clientIds[3],
          status: 'active',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-12-31'),
          budget: 60000000,
          description: '店舗・EC・アプリの統合顧客体験基盤構築',
        }
      })
    )
  }

  // ヘルスケアソリューションズ projects
  if (clientIds[4]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: '電子カルテシステム導入',
          code: 'HC-EMR-001',
          clientId: clientIds[4],
          status: 'active',
          startDate: new Date('2024-02-15'),
          endDate: new Date('2024-11-30'),
          budget: 90000000,
          description: 'クラウドベース電子カルテシステムの導入',
        }
      }),
      await projectDb.project.create({
        data: {
          name: '遠隔医療プラットフォーム',
          code: 'HC-TM-002',
          clientId: clientIds[4],
          status: 'completed',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2024-01-31'),
          budget: 40000000,
          description: '遠隔診療を可能にするプラットフォームの構築',
        }
      })
    )
  }

  // エネルギー開発 projects
  if (clientIds[5]) {
    projects.push(
      await projectDb.project.create({
        data: {
          name: 'スマートグリッド構築',
          code: 'ENG-SG-001',
          clientId: clientIds[5],
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-06-30'),
          budget: 150000000,
          description: '次世代電力網の構築プロジェクト',
        }
      })
    )
  }

  return projects
}

async function seedProjectMembers(projects: any[], userIds: { pmId: string, consultantIds: string[] }) {
  // Assign PM and consultants to projects
  for (const project of projects) {
    // Assign PM
    await projectDb.projectMember.create({
      data: {
        projectId: project.id,
        userId: userIds.pmId,
        role: 'pm',
        allocation: 50,
        startDate: project.startDate,
        endDate: project.endDate,
      }
    })

    // Assign consultants (2-3 per project)
    const numConsultants = Math.floor(Math.random() * 2) + 2 // 2-3
    for (let i = 0; i < numConsultants && i < userIds.consultantIds.length; i++) {
      await projectDb.projectMember.create({
        data: {
          projectId: project.id,
          userId: userIds.consultantIds[i],
          role: 'member',
          allocation: 100,
          startDate: project.startDate,
          endDate: project.endDate,
        }
      })
    }
  }
}

async function seedTasks(projects: any[]) {
  const taskTemplates = [
    { name: '要件定義', description: '詳細な要件の収集と文書化' },
    { name: '現状分析', description: '現行システムと業務プロセスの分析' },
    { name: '設計', description: 'システムアーキテクチャと詳細設計' },
    { name: '実装', description: 'システムの開発と構築' },
    { name: 'テスト', description: '単体・結合・総合テストの実施' },
    { name: '移行計画', description: 'データ移行とシステム切り替え計画' },
    { name: '教育・研修', description: 'エンドユーザー向けトレーニング' },
    { name: '本番稼働', description: 'システムの本番環境への展開' },
  ]

  for (const project of projects) {
    for (let i = 0; i < taskTemplates.length; i++) {
      const template = taskTemplates[i]
      const startDate = new Date(project.startDate)
      startDate.setMonth(startDate.getMonth() + i)
      
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + 1)

      let status = 'todo'
      if (project.status === 'completed') {
        status = 'done'
      } else if (i < 3) {
        status = 'done'
      } else if (i === 3) {
        status = 'in_progress'
      }

      await projectDb.task.create({
        data: {
          projectId: project.id,
          title: `${template.name} - ${project.name}`,
          description: template.description,
          status,
          priority: i < 4 ? 'high' : 'medium',
          startDate,
          dueDate: endDate,
          estimatedHours: 160,
          actualHours: status === 'done' ? 150 : status === 'in_progress' ? 80 : 0,
        }
      })
    }
  }
}

async function seedMilestones(projects: any[]) {
  const milestoneTemplates = [
    { name: 'キックオフ完了', description: 'プロジェクト開始と体制確立' },
    { name: '要件定義完了', description: '要件定義書の承認' },
    { name: '設計完了', description: '基本設計・詳細設計の承認' },
    { name: '開発完了', description: '開発フェーズの完了' },
    { name: 'UAT完了', description: 'ユーザー受入テストの完了' },
    { name: '本番稼働', description: 'システムの本番稼働開始' },
  ]

  for (const project of projects) {
    for (let i = 0; i < milestoneTemplates.length; i++) {
      const template = milestoneTemplates[i]
      const dueDate = new Date(project.startDate)
      dueDate.setMonth(dueDate.getMonth() + i * 2)

      let status = 'pending'
      if (project.status === 'completed') {
        status = 'completed'
      } else if (i < 2) {
        status = 'completed'
      }

      await projectDb.milestone.create({
        data: {
          projectId: project.id,
          name: template.name,
          description: template.description,
          dueDate,
          status,
        }
      })
    }
  }
}

async function main() {
  try {
    console.log('Clearing project database...')
    await clearProjectData()

    console.log('Getting client IDs from core database...')
    const clients = await coreDb.organization.findMany({
      where: { type: 'client' },
      orderBy: { name: 'asc' }
    })
    const clientIds = clients.map(c => c.id)

    console.log('Getting user IDs from core database...')
    const pm = await coreDb.user.findFirst({
      where: { email: 'pm@example.com' }
    })
    const consultants = await coreDb.user.findMany({
      where: { email: { in: ['consultant@example.com', 'consultant2@example.com', 'consultant3@example.com'] } }
    })

    if (!pm) {
      throw new Error('PM user not found')
    }

    const userIds = {
      pmId: pm.id,
      consultantIds: consultants.map(c => c.id)
    }

    console.log('Seeding projects...')
    const projects = await seedProjects(clientIds)

    console.log('Seeding project members...')
    await seedProjectMembers(projects, userIds)

    console.log('Seeding tasks...')
    await seedTasks(projects)

    console.log('Seeding milestones...')
    await seedMilestones(projects)

    console.log('Project database seeding completed!')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await coreDb.$disconnect()
    await projectDb.$disconnect()
  }
}

main()