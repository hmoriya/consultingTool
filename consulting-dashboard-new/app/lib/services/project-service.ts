import { projectDb } from '@/lib/db/project-db'
import { db } from '@/lib/db'
import { ProjectWithDetails, CreateProjectInput, UpdateProjectInput, ProjectMemberWithUser } from '@/types/project'

export class ProjectService {
  /**
   * プロジェクト一覧を取得（詳細情報付き）
   */
  async getProjectsWithDetails(options?: {
    includeMembers?: boolean
    includeTasks?: boolean
    includeMilestones?: boolean
    status?: string
    clientId?: string
  }): Promise<ProjectWithDetails[]> {
    const projects = await projectDb.project.findMany({
      where: {
        ...(options?.status && { status: options.status }),
        ...(options?.clientId && { clientId: options.clientId }),
      },
      include: {
        projectMembers: options?.includeMembers || false,
        tasks: options?.includeTasks || false,
        milestones: options?.includeMilestones || false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // クライアント情報を取得
    const clientIds = [...new Set(projects.map(p => p.clientId))]
    const clients = await db.organization.findMany({
      where: {
        id: { in: clientIds },
      },
    })
    const clientMap = new Map(clients.map(c => [c.id, c]))

    // メンバー情報を取得（必要な場合）
    if (options?.includeMembers) {
      const memberUserIds = [...new Set(
        projects.flatMap(p => p.projectMembers.map(m => m.userId))
      )]
      const users = await db.user.findMany({
        where: {
          id: { in: memberUserIds },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })
      const userMap = new Map(users.map(u => [u.id, u]))

      // プロジェクトメンバーにユーザー情報を追加
      projects.forEach(project => {
        project.projectMembers.forEach(member => {
          const memberWithUser = member as ProjectMemberWithUser
          memberWithUser.user = userMap.get(member.userId) || undefined
        })
      })
    }

    // プロジェクトにクライアント情報を追加
    return projects.map(project => ({
      ...project,
      client: clientMap.get(project.clientId) || null,
    })) as ProjectWithDetails[]
  }

  /**
   * プロジェクトを作成
   */
  async createProject(input: CreateProjectInput) {
    // クライアントが存在するか確認
    const client = await db.organization.findUnique({
      where: { id: input.clientId },
    })
    if (!client) {
      throw new Error('Client not found')
    }

    // プロジェクトを作成
    const project = await projectDb.project.create({
      data: {
        name: input.name,
        code: input.code,
        clientId: input.clientId,
        status: input.status || 'planning',
        priority: input.priority,
        startDate: input.startDate,
        endDate: input.endDate,
        budget: input.budget,
        description: input.description,
      },
    })

    // プロジェクトメンバーを追加
    if (input.members && input.members.length > 0) {
      await projectDb.projectMember.createMany({
        data: input.members.map(member => ({
          projectId: project.id,
          userId: member.userId,
          role: member.role,
          allocation: member.allocation,
          startDate: member.startDate,
          endDate: member.endDate,
        })),
      })
    }

    return project
  }

  /**
   * プロジェクトを更新
   */
  async updateProject(projectId: string, input: UpdateProjectInput) {
    return await projectDb.project.update({
      where: { id: projectId },
      data: {
        name: input.name,
        status: input.status,
        priority: input.priority,
        endDate: input.endDate,
        budget: input.budget,
        description: input.description,
      },
    })
  }

  /**
   * プロジェクトメンバーを追加
   */
  async addProjectMember(
    projectId: string,
    userId: string,
    role: string,
    allocation: number,
    startDate: Date
  ) {
    // ユーザーが存在するか確認
    const user = await db.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      throw new Error('User not found')
    }

    return await projectDb.projectMember.create({
      data: {
        projectId,
        userId,
        role,
        allocation,
        startDate,
      },
    })
  }

  /**
   * タスクを作成
   */
  async createTask(projectId: string, input: {
    title: string
    description?: string
    assigneeId?: string
    priority: string
    estimatedHours?: number
    dueDate?: Date
    milestoneId?: string
  }) {
    // アサイン先ユーザーが存在するか確認（指定された場合）
    if (input.assigneeId) {
      const user = await db.user.findUnique({
        where: { id: input.assigneeId },
      })
      if (!user) {
        throw new Error('Assignee not found')
      }
    }

    return await projectDb.task.create({
      data: {
        projectId,
        title: input.title,
        description: input.description,
        assigneeId: input.assigneeId,
        status: 'todo',
        priority: input.priority,
        estimatedHours: input.estimatedHours,
        dueDate: input.dueDate,
        milestoneId: input.milestoneId,
      },
    })
  }

  /**
   * プロジェクトの進捗状況を取得
   */
  async getProjectProgress(projectId: string) {
    const tasks = await projectDb.task.findMany({
      where: { projectId },
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
    const todoTasks = tasks.filter(t => t.status === 'todo').length

    const progressRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progressRate,
    }
  }

  /**
   * プロジェクトのリスクを取得
   */
  async getProjectRisks(projectId: string, options?: {
    status?: string
    severity?: string
  }) {
    return await projectDb.risk.findMany({
      where: {
        projectId,
        ...(options?.status && { status: options.status }),
        ...(options?.severity && { severity: options.severity }),
      },
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    })
  }
}

export const projectService = new ProjectService()