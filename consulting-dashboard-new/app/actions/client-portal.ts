'use server'

import { authDb, projectDb } from '@/lib/db'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { hasAnyUserRole } from '@/lib/auth/role-check'

export async function getClientPortalData() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  console.log('Current user:', JSON.stringify(user, null, 2))

  if (!hasAnyUserRole(user.role.name, ['CLIENT', 'EXECUTIVE'])) {
    throw new Error('権限がありません')
  }

  // ユーザーが所属する組織を取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organization = await (authDb as any).organization.findUnique({
    where: { id: user.organizationId }
  })

  console.log('Organization found:', JSON.stringify(organization, null, 2))

  if (!organization) {
    throw new Error('組織が見つかりません')
  }

  // 組織に関連するプロジェクトを取得
  console.log('Looking for projects with clientId:', organization.id)
  console.log('Organization:', organization)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = await (projectDb as any).project.findMany({
    where: {
      clientId: organization.id
    },
    include: {
      projectMembers: true,
      _count: {
        select: {
          tasks: true,
          milestones: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  console.log('Found projects:', projects.length, projects.map(p => ({ id: p.id, name: p.name, clientId: p.clientId })))

  // 各プロジェクトのマイルストーンと進捗を取得
  const projectsWithDetails = await Promise.all(
    projects.map(async (project) => {
      const milestones = await projectDb.milestone.findMany({
        where: {
          projectId: project.id
        },
        orderBy: {
          dueDate: 'asc'
        }
      })

      const tasks = await projectDb.task.findMany({
        where: {
          projectId: project.id
        }
      })

      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

      // プロジェクトマネージャーを特定
      const pm = project.projectMembers.find(member => member.role === 'pm')

      return {
        ...project,
        milestones,
        progress,
        pmId: pm?.userId || null,
        totalTasks: tasks.length,
        completedTasks
      }
    })
  )

  // アクティブプロジェクトの統計
  const activeProjects = projects.filter(p => p.status === 'active')
  const totalBudget = activeProjects.reduce((sum, p) => sum + p.budget, 0)

  // 最近のプロジェクト活動（簡易版）
  const recentActivities = await projectDb.task.findMany({
    where: {
      project: {
        clientId: organization.id
      },
      updatedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 過去7日間
      }
    },
    include: {
      project: true
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 10
  })

  return {
    organization,
    projects: projectsWithDetails,
    stats: {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      totalBudget
    },
    recentActivities
  }
}

export async function getProjectDocuments(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // プロジェクトへのアクセス権を確認
  const project = await projectDb.project.findFirst({
    where: {
      id: projectId,
      clientId: user.organizationId
    }
  })

  if (!project) {
    throw new Error('プロジェクトが見つかりません')
  }

  // ここでは仮のドキュメントデータを返す
  // 実際の実装では、ファイルストレージサービスと連携
  return [
    {
      id: '1',
      name: 'プロジェクト計画書.pdf',
      type: 'pdf',
      size: '2.5MB',
      uploadedAt: new Date('2024-01-15'),
      uploadedBy: 'PM'
    },
    {
      id: '2', 
      name: '要件定義書.docx',
      type: 'docx',
      size: '1.8MB',
      uploadedAt: new Date('2024-01-20'),
      uploadedBy: 'コンサルタント'
    },
    {
      id: '3',
      name: '進捗報告書_2024年1月.xlsx',
      type: 'xlsx',
      size: '856KB',
      uploadedAt: new Date('2024-02-01'),
      uploadedBy: 'PM'
    }
  ]
}