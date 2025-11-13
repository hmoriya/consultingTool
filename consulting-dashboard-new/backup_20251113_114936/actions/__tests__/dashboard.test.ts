import { 
  getDashboardData,
  getProjectDetails,
  getResourceData 
} from '../dashboard'
import { prismaMock } from '../../__mocks__/db'
import * as authModule from '../auth'
import { redirect } from 'next/navigation'
import type { Project, Organization, ProjectMetric, User, Role, ProjectMember, Milestone } from '@prisma/client'

// getCurrentUserのモック
jest.mock('../auth')
const mockedAuth = authModule as jest.Mocked<typeof authModule>

// redirectのモック
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

// 型定義
type UserWithRole = User & {
  role: {
    name: string
  }
  organization?: {
    name: string
  }
}

type ProjectWithRelations = Project & {
  client: Organization
  projectMetrics: ProjectMetric[]
  _count: {
    projectMembers: number
  }
}

type ProjectWithFullRelations = Project & {
  client: Organization
  projectMembers: (ProjectMember & {
    user: User
  })[]
  milestones: Milestone[]
}

type UserWithRoleAndProjects = User & {
  role: Role
  projects: Project[]
}

describe('dashboard actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-03-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mockExecutiveUser: UserWithRole = {
    id: '1',
    name: 'エグゼクティブ',
    email: 'exec@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-1',
    role: { 
      name: 'executive'
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockConsultantUser: UserWithRole = {
    id: '2',
    name: 'コンサルタント',
    email: 'consultant@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-2',
    role: { 
      name: 'consultant'
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('getDashboardData', () => {
    test('エグゼクティブがダッシュボードデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)

      // モックプロジェクト
      const mockProjects: ProjectWithRelations[] = [
        {
          id: 'proj-1',
          name: 'プロジェクトA',
          code: 'PROJ-A',
          status: 'active',
          clientId: 'client-1',
          budgetAmount: 10000000,
          budgetCurrency: 'JPY',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          client: { 
            id: 'client-1',
            name: 'クライアントA',
            type: 'client',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          projectMetrics: [
            { 
              id: 'metric-1',
              projectId: 'proj-1',
              progressRate: 75, 
              margin: 2000000, 
              utilization: 0.85,
              metricDate: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          _count: { projectMembers: 5 }
        },
        {
          id: 'proj-2',
          name: 'プロジェクトB',
          code: 'PROJ-B',
          status: 'completed',
          clientId: 'client-2',
          budgetAmount: 5000000,
          budgetCurrency: 'JPY',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
          client: { 
            id: 'client-2',
            name: 'クライアントB',
            type: 'client',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          projectMetrics: [],
          _count: { projectMembers: 3 }
        }
      ]

      // プロジェクト統計
      const mockProjectStats = [
        { status: 'active', _count: 1 },
        { status: 'completed', _count: 1 }
      ]

      // メトリクス
      const mockMetrics: ProjectMetric[] = [
        {
          id: 'metric-1',
          projectId: 'proj-1',
          progressRate: 75,
          margin: 2000000,
          utilization: 0.85,
          metricDate: new Date('2024-03-01'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      // タイムシート統計
      const mockTimesheetStats = [
        { status: 'submitted', _sum: { totalHours: 320 } }
      ]

      prismaMock.project.findMany.mockResolvedValue(mockProjects)
      prismaMock.project.groupBy.mockResolvedValue(mockProjectStats as {
        status: string
        _count: number
      }[])
      prismaMock.projectMetric.findMany.mockResolvedValue(mockMetrics)
      prismaMock.timesheet.groupBy.mockResolvedValue(mockTimesheetStats as {
        status: string
        _sum: { totalHours: number }
      }[])
      prismaMock.projectMember.count.mockResolvedValue(8)

      const result = await getDashboardData()

      expect(result.overview).toEqual({
        activeProjects: 1,
        completedProjects: 1,
        totalRevenue: 15000000,
        activeConsultants: 8
      })
      
      expect(result.projectMetrics).toEqual({
        averageProgress: 75,
        totalMargin: 2000000,
        averageUtilization: 0.85
      })

      expect(result.projects).toHaveLength(2)
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getDashboardData()

      expect(redirect).toHaveBeenCalledWith('/login')
    })

    test('コンサルタントもダッシュボードデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      prismaMock.project.findMany.mockResolvedValue([])
      prismaMock.project.groupBy.mockResolvedValue([])
      prismaMock.projectMetric.findMany.mockResolvedValue([])
      prismaMock.timesheet.groupBy.mockResolvedValue([])
      prismaMock.projectMember.count.mockResolvedValue(0)

      const result = await getDashboardData()

      expect(result).toBeDefined()
      expect(prismaMock.project.findMany).toHaveBeenCalled()
    })
  })

  describe('getProjectDetails', () => {
    test('プロジェクト詳細を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)

      const mockProject: ProjectWithFullRelations = {
        id: 'proj-1',
        name: 'プロジェクトA',
        code: 'PROJ-A',
        status: 'active',
        clientId: 'client-1',
        budgetAmount: 10000000,
        budgetCurrency: 'JPY',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
        client: {
          id: 'client-1',
          name: 'クライアントA',
          type: 'client',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        projectMembers: [
          {
            id: 'pm-1',
            projectId: 'proj-1',
            userId: 'user-1',
            roleOnProject: 'lead',
            allocationRate: 1.0,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
              id: 'user-1',
              name: 'ユーザー1',
              email: 'user1@example.com',
              password: 'hashed',
              roleId: 'role-1',
              organizationId: 'org-1',
              isActive: true,
              lastLogin: null,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        ],
        milestones: [
          {
            id: 'milestone-1',
            projectId: 'proj-1',
            name: 'フェーズ1',
            description: '要件定義',
            dueDate: new Date('2024-03-31'),
            deliverables: '要件定義書',
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }

      prismaMock.project.findUnique.mockResolvedValue(mockProject)

      const result = await getProjectDetails('proj-1')

      expect(result).toEqual(mockProject)
    })

    test('存在しないプロジェクトの場合nullを返す', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      prismaMock.project.findUnique.mockResolvedValue(null)

      const result = await getProjectDetails('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('getResourceData', () => {
    test('リソースデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)

      const mockMembers: UserWithRoleAndProjects[] = [
        {
          id: 'user-1',
          name: 'コンサルタント1',
          email: 'consultant1@example.com',
          password: 'hashed',
          roleId: 'role-consultant',
          organizationId: 'org-1',
          isActive: true,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: {
            id: 'role-consultant',
            name: 'consultant',
            description: 'コンサルタント',
            isSystem: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          projects: [
            {
              id: 'proj-1',
              name: 'プロジェクトA',
              code: 'PROJ-A',
              clientId: 'client-1',
              status: 'active',
              startDate: new Date(),
              endDate: new Date(),
              budgetAmount: 10000000,
              budgetCurrency: 'JPY',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: 'proj-2',
              name: 'プロジェクトB',
              code: 'PROJ-B',
              clientId: 'client-2',
              status: 'active',
              startDate: new Date(),
              endDate: new Date(),
              budgetAmount: 5000000,
              budgetCurrency: 'JPY',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      ]

      const mockRoles: Role[] = [
        {
          id: 'role-consultant',
          name: 'consultant',
          description: 'コンサルタント',
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      prismaMock.user.findMany.mockResolvedValue(mockMembers)
      prismaMock.role.findMany.mockResolvedValue(mockRoles)

      const result = await getResourceData()

      expect(result.members).toHaveLength(1)
      expect(result.members[0]).toMatchObject({
        id: 'user-1',
        name: 'コンサルタント1',
        role: 'consultant',
        projectCount: 2,
        utilization: 2
      })
      
      expect(result.roles).toHaveLength(1)
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getResourceData()

      expect(redirect).toHaveBeenCalledWith('/login')
    })

    test('コンサルタントもリソースデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      prismaMock.user.findMany.mockResolvedValue([])
      prismaMock.role.findMany.mockResolvedValue([])

      const result = await getResourceData()

      expect(result).toBeDefined()
    })

    test('roleがundefinedのユーザーも適切に処理される', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)

      const mockMembers = [
        {
          id: 'user-1',
          name: 'ユーザー1',
          email: 'user1@example.com',
          password: 'hashed',
          roleId: null,
          organizationId: 'org-1',
          isActive: true,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: undefined,
          projects: []
        }
      ]

      prismaMock.user.findMany.mockResolvedValue(mockMembers as User[])
      prismaMock.role.findMany.mockResolvedValue([])

      const result = await getResourceData()

      expect(result.members[0].role).toBe('Unknown')
    })
  })
})