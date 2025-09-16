import { 
  getDashboardData,
  getProjectDetails,
  getResourceData 
} from '../dashboard'
import { prismaMock } from '../../__mocks__/db'
import * as authModule from '../auth'
import { redirect } from 'next/navigation'

// getCurrentUserのモック
jest.mock('../auth')
const mockedAuth = authModule as jest.Mocked<typeof authModule>

// redirectのモック
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}))

describe('dashboard actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-03-01'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const mockExecutiveUser = {
    id: '1',
    name: 'エグゼクティブ',
    email: 'exec@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-1',
    role: { 
      id: 'role-1',
      name: 'executive',
      description: 'Executive role'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockConsultantUser = {
    id: '2',
    name: 'コンサルタント',
    email: 'consultant@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-2',
    role: { 
      id: 'role-2',
      name: 'consultant',
      description: 'Consultant role'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('getDashboardData', () => {
    test('エグゼクティブがダッシュボードデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      // モックプロジェクト
      const mockProjects = [
        {
          id: 'proj-1',
          name: 'プロジェクトA',
          code: 'PROJ-A',
          status: 'active',
          budget: 10000000,
          client: { name: 'クライアントA' },
          projectMetrics: [
            { progressRate: 75, margin: 2000000, utilization: 0.85 }
          ],
          _count: { projectMembers: 5 }
        },
        {
          id: 'proj-2',
          name: 'プロジェクトB',
          code: 'PROJ-B',
          status: 'completed',
          budget: 5000000,
          client: { name: 'クライアントB' },
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
      const mockMetrics = [
        {
          id: 'metric-1',
          projectId: 'proj-1',
          date: new Date('2024-02-15'),
          revenue: 3000000,
          cost: 2000000,
          utilization: 0.85,
          progressRate: 75,
          margin: 1000000
        }
      ]

      prismaMock.project.findMany.mockResolvedValue(mockProjects as any)
      prismaMock.project.groupBy.mockResolvedValue(mockProjectStats as any)
      prismaMock.projectMetric.findMany.mockResolvedValue(mockMetrics as any)
      prismaMock.user.count.mockResolvedValue(8)
      
      // 月別集計のモック
      prismaMock.projectMetric.aggregate.mockResolvedValue({
        _sum: { revenue: 3000000, cost: 2000000 }
      } as any)

      const result = await getDashboardData()

      expect(result).toMatchObject({
        projects: expect.arrayContaining([
          expect.objectContaining({
            id: 'proj-1',
            name: 'プロジェクトA'
          })
        ]),
        stats: {
          total: 2,
          active: 1,
          completed: 1,
          onhold: 0
        },
        financials: {
          revenue: 3000000,
          cost: 2000000,
          margin: 1000000,
          marginRate: expect.any(Number)
        },
        resources: {
          utilization: 85,
          totalMembers: 8
        }
      })
    })

    test('エグゼクティブ以外はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      await getDashboardData()

      expect(redirect).toHaveBeenCalledWith('/login')
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getDashboardData()

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('getProjectDetails', () => {
    test('プロジェクト詳細を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      const mockProject = {
        id: 'proj-1',
        name: 'プロジェクトA',
        code: 'PROJ-A',
        status: 'active',
        budget: 10000000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        client: {
          id: 'client-1',
          name: 'クライアントA'
        },
        projectMembers: [
          {
            userId: '1',
            role: 'pm',
            allocation: 100,
            user: {
              name: 'PM太郎',
              email: 'pm@example.com'
            }
          }
        ],
        milestones: [
          {
            id: 'milestone-1',
            name: 'フェーズ1',
            dueDate: new Date('2024-06-30'),
            status: 'pending'
          }
        ],
        projectMetrics: [
          {
            date: new Date('2024-02-01'),
            revenue: 1000000,
            cost: 700000,
            progressRate: 25
          }
        ]
      }

      prismaMock.project.findUnique.mockResolvedValue(mockProject as any)

      const result = await getProjectDetails('proj-1')

      expect(result).toMatchObject({
        id: 'proj-1',
        name: 'プロジェクトA',
        client: expect.objectContaining({
          name: 'クライアントA'
        })
      })
    })

    test('存在しないプロジェクトはエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)
      prismaMock.project.findUnique.mockResolvedValue(null)

      await expect(getProjectDetails('non-existent')).rejects.toThrow(
        'プロジェクトが見つかりません'
      )
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getProjectDetails('proj-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('getResourceData', () => {
    test('リソースデータを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      const mockMembers = [
        {
          id: 'user-1',
          name: 'メンバー1',
          email: 'member1@example.com',
          role: { name: 'consultant' },
          projectMembers: [
            {
              allocation: 50,
              project: { status: 'active' }
            },
            {
              allocation: 30,
              project: { status: 'active' }
            }
          ]
        },
        {
          id: 'user-2',
          name: 'メンバー2',
          email: 'member2@example.com',
          role: { name: 'pm' },
          projectMembers: [
            {
              allocation: 100,
              project: { status: 'active' }
            }
          ]
        }
      ]

      const mockRoles = [
        {
          name: 'consultant',
          users: [
            {
              projectMembers: [
                { allocation: 80 }
              ]
            }
          ]
        },
        {
          name: 'pm',
          users: [
            {
              projectMembers: [
                { allocation: 100 }
              ]
            }
          ]
        },
        {
          name: 'executive',
          users: []
        }
      ]

      prismaMock.user.findMany.mockResolvedValue(mockMembers as any)
      prismaMock.role.findMany.mockResolvedValue(mockRoles as any)

      const result = await getResourceData()

      expect(result).toMatchObject({
        members: expect.arrayContaining([
          expect.objectContaining({
            id: 'user-1',
            name: 'メンバー1',
            utilization: 80
          }),
          expect.objectContaining({
            id: 'user-2',
            name: 'メンバー2',
            utilization: 100
          })
        ]),
        roleDistribution: expect.arrayContaining([
          expect.objectContaining({
            role: 'consultant',
            count: 1,
            avgUtilization: 80
          }),
          expect.objectContaining({
            role: 'pm',
            count: 1,
            avgUtilization: 100
          })
        ])
      })
    })

    test('エグゼクティブ以外はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      await getResourceData()

      expect(redirect).toHaveBeenCalledWith('/login')
    })

    test('メンバーがいない場合も正常に処理', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)
      
      prismaMock.user.findMany.mockResolvedValue([])
      prismaMock.role.findMany.mockResolvedValue([])

      const result = await getResourceData()

      expect(result).toMatchObject({
        members: [],
        roleDistribution: []
      })
    })
  })
})