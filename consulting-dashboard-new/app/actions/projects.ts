'use server'

import { db } from '@/lib/db'
import { projectService } from '@/lib/services/project-service'
import { getCurrentUser } from './auth'
import { redirect } from 'next/navigation'
import { PROJECT_MEMBER_ROLES, USER_ROLES } from '@/constants/roles'

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'onhold'

export interface ProjectListItem {
  id: string
  name: string
  code: string
  status: ProjectStatus
  client: {
    name: string
  }
  startDate: Date
  endDate: Date | null
  budget: number
  progress: number
  teamSize: number
  pmName: string
}

export async function getProjects() {
  const user = await getCurrentUser()
  if (!user) {
    return []
  }

  console.log('Current user:', user.id, user.name, user.role.name)

  // プロジェクトサービスから詳細情報付きでプロジェクトを取得
  const projects = await projectService.getProjectsWithDetails({
    includeMembers: true,
    includeTasks: true,
    includeMilestones: false,
  })

  console.log('Total projects found:', projects.length)
  console.log('First project members:', projects[0]?.projectMembers)

  // ユーザーの権限に基づいてフィルタリング
  const filteredProjects = user.role.name === 'Executive'
    ? projects
    : projects.filter(project => {
        const isPM = project.projectMembers.some(m => m.userId === user.id && m.role === PROJECT_MEMBER_ROLES.PM)
        if (isPM) {
          console.log(`User ${user.id} is PM for project: ${project.name}`)
        }
        return isPM
      })
  
  console.log('Filtered projects:', filteredProjects.length)

  // プロジェクトの進捗を計算（タスクベース）
  const projectsWithProgress = await Promise.all(
    filteredProjects.map(async (project) => {
      let progressRate = 0
      
      if (project.tasks && project.tasks.length > 0) {
        const completedTasks = project.tasks.filter(t => t.status === 'completed').length
        progressRate = Math.round((completedTasks / project.tasks.length) * 100)
      }
      
      const pm = project.projectMembers.find(m => m.role === PROJECT_MEMBER_ROLES.PM)
      
      return {
        id: project.id,
        name: project.name,
        code: project.code,
        status: project.status as ProjectStatus,
        client: {
          name: project.client?.name || 'Unknown Client'
        },
        startDate: project.startDate,
        endDate: project.endDate,
        budget: project.budget,
        progress: progressRate,
        teamSize: project.projectMembers.length,
        pmName: pm?.user?.name || '未割当'
      }
    })
  )

  return projectsWithProgress
}

export async function createProject(data: {
  name: string
  description: string
  clientId: string
  budget: number
  startDate: string
  endDate: string
  status: string
  priority: string
  tags?: string[]
}) {
  const user = await getCurrentUser()
  if (!user || (user.role.name !== USER_ROLES.PM && user.role.name !== USER_ROLES.EXECUTIVE)) {
    throw new Error('権限がありません')
  }

  // プロジェクトコード生成（名前の略称 + 年月）
  const now = new Date()
  const yearMonth = now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0')
  const namePrefix = data.name.slice(0, 3).toUpperCase()
  let code = `${namePrefix}${yearMonth}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`

  // プロジェクトサービスを使用してプロジェクトを作成
  try {
    const project = await projectService.createProject({
      name: data.name,
      code,
      clientId: data.clientId,
      status: data.status,
      priority: data.priority,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      budget: data.budget,
      description: data.description,
      members: [{
        userId: user.id,
        role: PROJECT_MEMBER_ROLES.PM,
        allocation: 1.0,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate)
      }]
    })

    // 監査ログ
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        resource: 'project',
        resourceId: project.id,
        details: `プロジェクト「${project.name}」を作成しました`
      }
    })

    return project
  } catch (error: any) {
    // コードが重複している場合は再生成
    if (error.message?.includes('Unique constraint failed')) {
      return createProject(data)
    }
    throw error
  }
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('認証が必要です')
  }

  // プロジェクトサービスでプロジェクト情報を取得
  const projects = await projectService.getProjectsWithDetails({
    includeMembers: true,
  })
  
  const project = projects.find(p => p.id === projectId)
  
  if (!project) {
    throw new Error('プロジェクトが見つかりません')
  }

  // 権限チェック
  const hasPermission = user.role.name === USER_ROLES.EXECUTIVE ||
    project.projectMembers.some(m => m.userId === user.id && m.role === PROJECT_MEMBER_ROLES.PM)
  
  if (!hasPermission) {
    throw new Error('このプロジェクトを更新する権限がありません')
  }

  // ステータス更新
  await projectService.updateProject(projectId, { status })

  // 監査ログ
  await db.auditLog.create({
    data: {
      userId: user.id,
      action: 'UPDATE',
      resource: 'project',
      resourceId: projectId,
      details: `プロジェクトのステータスを「${status}」に変更しました`
    }
  })
}

export async function getProjectDetails(projectId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // プロジェクトサービスから詳細情報を取得
  const projects = await projectService.getProjectsWithDetails({
    includeMembers: true,
    includeTasks: true,
    includeMilestones: true,
  })

  const project = projects.find(p => p.id === projectId)

  if (!project) {
    throw new Error('プロジェクトが見つかりません')
  }

  // アクセス権限チェック
  const hasAccess = user.role.name === USER_ROLES.EXECUTIVE || 
    project.projectMembers.some(member => member.userId === user.id)

  if (!hasAccess) {
    throw new Error('このプロジェクトへのアクセス権限がありません')
  }

  // プロジェクトメトリクスを取得（現在は空配列を返す）
  // TODO: 将来的に財務サービスから取得
  const projectMetrics: any[] = []

  // メンバーのロール情報を追加
  const memberUserIds = project.projectMembers.map(m => m.userId)
  const memberUsers = await db.user.findMany({
    where: { id: { in: memberUserIds } },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          name: true
        }
      }
    }
  })
  const userMap = new Map(memberUsers.map(u => [u.id, u]))

  // レスポンスを整形
  return {
    ...project,
    projectMembers: project.projectMembers.map(member => ({
      ...member,
      user: userMap.get(member.userId) || { id: member.userId, name: 'Unknown', email: '', role: { name: 'unknown' } }
    })),
    projectMetrics,
  }
}

export async function getActiveProjects() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // プロジェクトサービスからアクティブなプロジェクトを取得
    const projects = await projectService.getProjectsWithDetails({
      status: 'active',
      includeMembers: false,
    })

    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      code: project.code,
      client: {
        name: project.client?.name || 'Unknown Client'
      }
    }))

    return { success: true, data: formattedProjects }
  } catch (error) {
    console.error('getActiveProjects error:', error)
    return { success: false, error: 'プロジェクト一覧の取得に失敗しました' }
  }
}