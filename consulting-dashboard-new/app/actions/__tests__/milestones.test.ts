import { 
  getProjectMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestoneStats,
  getMilestoneTasks
} from '../milestones'
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

describe('milestones actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  const mockPMUser = {
    id: '2',
    name: 'PM',
    email: 'pm@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-2',
    role: { 
      id: 'role-2',
      name: 'pm',
      description: 'PM role'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockConsultantUser = {
    id: '3',
    name: 'コンサルタント',
    email: 'consultant@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-3',
    role: { 
      id: 'role-3',
      name: 'consultant',
      description: 'Consultant role'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockProject = {
    id: 'proj-1',
    name: 'プロジェクトA',
    code: 'PROJ-A',
    status: 'active',
    clientId: 'client-1',
    budget: 10000000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockMilestone = {
    id: 'milestone-1',
    projectId: 'proj-1',
    name: 'フェーズ1完了',
    description: '初期開発フェーズの完了',
    dueDate: new Date('2024-06-30'),
    status: 'pending',
    tasks: [
      { id: 'task-1', status: 'completed' },
      { id: 'task-2', status: 'in_progress' },
      { id: 'task-3', status: 'todo' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('getProjectMilestones', () => {
    test('プロジェクトのマイルストーン一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [{ userId: '2' }]
      } as any)

      prismaMock.milestone.findMany.mockResolvedValue([mockMilestone] as any)

      const result = await getProjectMilestones('proj-1')

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'milestone-1',
        name: 'フェーズ1完了',
        taskCount: 3,
        completedTaskCount: 1,
        progressRate: 33
      })
    })

    test('プロジェクトアクセス権限がない場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)
      prismaMock.project.findFirst.mockResolvedValue(null)

      await expect(getProjectMilestones('proj-1')).rejects.toThrow(
        'プロジェクトが見つからないか、権限がありません'
      )
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getProjectMilestones('proj-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('createMilestone', () => {
    test('PMがマイルストーンを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [{ userId: '2', role: 'pm' }]
      } as any)

      prismaMock.milestone.create.mockResolvedValue({
        ...mockMilestone,
        tasks: []
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        description: '初期開発フェーズの完了',
        dueDate: '2024-06-30'
      })

      expect(result).toMatchObject({
        id: 'milestone-1',
        name: 'フェーズ1完了'
      })
      expect(prismaMock.auditLog.create).toHaveBeenCalled()
    })

    test('エグゼクティブもマイルストーンを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      prismaMock.project.findFirst.mockResolvedValue(mockProject as any)
      prismaMock.milestone.create.mockResolvedValue(mockMilestone as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        dueDate: '2024-06-30'
      })

      expect(result).toBeTruthy()
    })

    test('コンサルタントはマイルストーンを作成できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      await expect(createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        dueDate: '2024-06-30'
      })).rejects.toThrow('権限がありません')
    })

    test('プロジェクト終了日を超えるマイルストーンはエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.project.findFirst.mockResolvedValue(mockProject as any)

      await expect(createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        dueDate: '2025-01-01' // プロジェクト終了日より後
      })).rejects.toThrow('マイルストーンの期日がプロジェクトの終了日を超えています')
    })
  })

  describe('updateMilestone', () => {
    test('PMがマイルストーンを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: {
          ...mockProject,
          projectMembers: [{ userId: '2', role: 'pm' }]
        }
      } as any)

      prismaMock.milestone.update.mockResolvedValue({
        ...mockMilestone,
        name: '更新されたマイルストーン',
        status: 'completed'
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateMilestone('milestone-1', {
        name: '更新されたマイルストーン',
        status: 'completed'
      })

      expect(result).toMatchObject({
        name: '更新されたマイルストーン',
        status: 'completed'
      })
    })

    test('エグゼクティブもマイルストーンを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: mockProject
      } as any)

      prismaMock.milestone.update.mockResolvedValue({
        ...mockMilestone,
        status: 'delayed'
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateMilestone('milestone-1', {
        status: 'delayed'
      })

      expect(result).toMatchObject({
        status: 'delayed'
      })
    })

    test('期日の更新でプロジェクト終了日チェック', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: mockProject
      } as any)

      await expect(updateMilestone('milestone-1', {
        dueDate: '2025-01-01'
      })).rejects.toThrow('マイルストーンの期日がプロジェクトの終了日を超えています')
    })
  })

  describe('deleteMilestone', () => {
    test('PMがマイルストーンを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        tasks: [] // タスクなし
      } as any)

      prismaMock.milestone.delete.mockResolvedValue(mockMilestone as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await deleteMilestone('milestone-1')

      expect(result).toEqual({ success: true })
      expect(prismaMock.milestone.delete).toHaveBeenCalledWith({
        where: { id: 'milestone-1' }
      })
    })

    test('タスクが紐づいているマイルストーンは削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue(mockMilestone as any)

      await expect(deleteMilestone('milestone-1')).rejects.toThrow(
        'このマイルストーンには3件のタスクが紐づいています。先にタスクを移動してください。'
      )
    })

    test('コンサルタントはマイルストーンを削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      await expect(deleteMilestone('milestone-1')).rejects.toThrow('権限がありません')
    })
  })

  describe('getMilestoneStats', () => {
    test('マイルストーン統計を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.project.findFirst.mockResolvedValue(mockProject as any)

      const mockMilestones = [
        {
          ...mockMilestone,
          status: 'completed',
          tasks: [
            { status: 'completed' },
            { status: 'completed' }
          ]
        },
        {
          id: 'milestone-2',
          status: 'pending',
          dueDate: new Date('2023-12-31'), // 過去の日付
          tasks: [
            { status: 'in_progress' }
          ]
        },
        {
          id: 'milestone-3',
          status: 'delayed',
          dueDate: new Date('2024-09-30'),
          tasks: []
        }
      ]

      prismaMock.milestone.findMany.mockResolvedValue(mockMilestones as any)

      const result = await getMilestoneStats('proj-1')

      expect(result).toMatchObject({
        totalMilestones: 3,
        completedMilestones: 1,
        delayedMilestones: 1,
        pendingMilestones: 1,
        overdueMilestones: 2, // pending(過去)とdelayedの2つ
        overallProgress: 67, // 2/3 タスク完了
        completionRate: 33  // 1/3 マイルストーン完了
      })
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getMilestoneStats('proj-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('getMilestoneTasks', () => {
    test('マイルストーンのタスク一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.milestone.findFirst.mockResolvedValue(mockMilestone as any)

      const mockTasks = [
        {
          id: 'task-1',
          milestoneId: 'milestone-1',
          title: 'タスク1',
          status: 'completed',
          priority: 'high',
          dueDate: new Date('2024-06-15'),
          assignee: {
            id: '3',
            name: 'コンサルタント',
            email: 'consultant@example.com'
          }
        },
        {
          id: 'task-2',
          milestoneId: 'milestone-1',
          title: 'タスク2',
          status: 'in_progress',
          priority: 'medium',
          dueDate: new Date('2024-06-20'),
          assignee: null
        }
      ]

      prismaMock.task.findMany.mockResolvedValue(mockTasks as any)

      const result = await getMilestoneTasks('milestone-1')

      expect(result).toHaveLength(2)
      expect(prismaMock.task.findMany).toHaveBeenCalledWith({
        where: { milestoneId: 'milestone-1' },
        include: {
          assignee: expect.any(Object)
        },
        orderBy: expect.any(Array)
      })
    })

    test('アクセス権限がない場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)
      
      prismaMock.milestone.findFirst.mockResolvedValue(null)

      await expect(getMilestoneTasks('milestone-1')).rejects.toThrow(
        'マイルストーンが見つからないか、権限がありません'
      )
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getMilestoneTasks('milestone-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})