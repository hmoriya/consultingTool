import { ProjectWithDetails, CreateProjectInput, UpdateProjectInput, ProjectMemberWithUser } from '@/types/project'

// Mock data for testing
const mockProjects: any[] = [
  {
    id: 'proj1',
    name: 'デジタル変革プロジェクト',
    code: 'DX001',
    clientId: 'org1',
    status: 'in_progress',
    priority: 'high',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    budget: 15000000,
    description: 'クライアントのDX推進支援',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    projectMembers: [],
    tasks: [],
    milestones: [],
    _count: {
      tasks: 8,
      milestones: 3,
      projectMembers: 4
    }
  },
  {
    id: 'proj2',
    name: '業務プロセス最適化',
    code: 'BPO001',
    clientId: 'org2',
    status: 'planning',
    priority: 'medium',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    budget: 8000000,
    description: '業務効率化のためのプロセス見直し',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    projectMembers: [],
    tasks: [],
    milestones: [],
    _count: {
      tasks: 5,
      milestones: 2,
      projectMembers: 3
    }
  }
]

const mockClients = [
  { id: 'org1', name: '株式会社ABC', type: 'client' },
  { id: 'org2', name: '株式会社XYZ', type: 'client' }
]

const mockTasks = [
  {
    id: 'task1',
    projectId: 'proj1',
    title: '要件定義完了',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-02-15'),
    assigneeId: 'user1',
    assignee: { id: 'user1', name: '田中太郎' },
    project: {
      id: 'proj1',
      name: 'デジタル変革プロジェクト',
      client: { id: 'org1', name: '株式会社ABC' }
    }
  },
  {
    id: 'task2',
    projectId: 'proj1',
    title: 'システム設計',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: new Date('2024-01-20'),
    assigneeId: 'user2',
    assignee: { id: 'user2', name: '佐藤花子' },
    project: {
      id: 'proj1',
      name: 'デジタル変革プロジェクト',
      client: { id: 'org1', name: '株式会社ABC' }
    }
  }
]

const mockMilestones = [
  {
    id: 'ms1',
    projectId: 'proj1',
    name: 'フェーズ1完了',
    status: 'in_progress',
    targetDate: new Date('2024-01-25'),
    project: {
      id: 'proj1',
      name: 'デジタル変革プロジェクト',
      client: { id: 'org1', name: '株式会社ABC' }
    }
  }
]

const mockMembers = [
  {
    user: { id: 'user1', name: '田中太郎' },
    allocation: 80,
    projects: [
      { id: 'proj1', name: 'デジタル変革プロジェクト', allocation: 60 },
      { id: 'proj2', name: '業務プロセス最適化', allocation: 20 }
    ]
  },
  {
    user: { id: 'user2', name: '佐藤花子' },
    allocation: 65,
    projects: [
      { id: 'proj1', name: 'デジタル変革プロジェクト', allocation: 65 }
    ]
  }
]

export class ProjectServiceMock {
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
    let projects = [...mockProjects]

    if (options?.status) {
      projects = projects.filter(p => p.status === options.status)
    }

    if (options?.clientId) {
      projects = projects.filter(p => p.clientId === options.clientId)
    }

    // Add client information
    return projects.map(project => ({
      ...project,
      client: mockClients.find(c => c.id === project.clientId) || null,
    })) as ProjectWithDetails[]
  }

  /**
   * Get risky tasks (overdue or near deadline)
   */
  async getRiskyTasks(daysAhead: number = 7) {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + daysAhead)

    return mockTasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      return dueDate <= futureDate && task.status !== 'completed'
    })
  }

  /**
   * Get upcoming milestones
   */
  async getUpcomingMilestones(daysAhead: number = 7) {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setDate(today.getDate() + daysAhead)

    return mockMilestones.filter(milestone => {
      const targetDate = new Date(milestone.targetDate)
      return targetDate >= today && targetDate <= futureDate
    })
  }

  /**
   * Get team utilization
   */
  async getTeamUtilization() {
    return mockMembers
  }

  /**
   * プロジェクトを作成
   */
  async createProject(input: CreateProjectInput) {
    const newProject = {
      id: `proj${Date.now()}`,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectMembers: [],
      tasks: [],
      milestones: [],
      _count: {
        tasks: 0,
        milestones: 0,
        projectMembers: 0
      }
    }
    mockProjects.push(newProject)
    return newProject
  }

  /**
   * プロジェクトを更新
   */
  async updateProject(projectId: string, input: UpdateProjectInput) {
    const projectIndex = mockProjects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) {
      throw new Error('Project not found')
    }

    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...input,
      updatedAt: new Date()
    }

    return mockProjects[projectIndex]
  }

  /**
   * プロジェクトの進捗状況を取得
   */
  async getProjectProgress(projectId: string) {
    const project = mockProjects.find(p => p.id === projectId)
    if (!project) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        todoTasks: 0,
        progressRate: 0,
        taskProgress: 0
      }
    }

    // Mock progress data
    const totalTasks = project._count.tasks
    const completedTasks = Math.floor(totalTasks * 0.3)
    const inProgressTasks = Math.floor(totalTasks * 0.4)
    const todoTasks = totalTasks - completedTasks - inProgressTasks

    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      progressRate: taskProgress,
      taskProgress
    }
  }

  /**
   * プロジェクトのリスクを取得
   */
  async getProjectRisks(projectId: string, options?: {
    status?: string
    severity?: string
  }) {
    // Return empty array for now
    return []
  }
}

export const projectService = new ProjectServiceMock()