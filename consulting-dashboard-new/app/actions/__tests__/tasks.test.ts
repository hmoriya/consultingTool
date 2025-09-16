import { 
  getProjectTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask
} from '../tasks'
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

describe('tasks actions', () => {
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
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockTask = {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'タスク1',
    description: 'タスクの説明',
    status: 'todo',
    priority: 'high',
    estimatedHours: 8,
    actualHours: null,
    startDate: new Date(),
    dueDate: new Date(),
    completedAt: null,
    assigneeId: '3',
    milestoneId: null,
    assignee: {
      id: '3',
      name: 'コンサルタント',
      email: 'consultant@example.com'
    },
    milestone: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  describe('getProjectTasks', () => {
    test('プロジェクトのタスク一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      // PMがプロジェクトメンバー
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [{ userId: '2' }]
      } as any)

      const mockTasks = [mockTask, { ...mockTask, id: 'task-2', priority: 'medium' }]
      prismaMock.task.findMany.mockResolvedValue(mockTasks as any)

      const result = await getProjectTasks('proj-1')

      expect(result).toHaveLength(2)
      expect(prismaMock.task.findMany).toHaveBeenCalledWith({
        where: { projectId: 'proj-1' },
        include: expect.objectContaining({
          assignee: expect.any(Object),
          milestone: expect.any(Object)
        }),
        orderBy: expect.any(Array)
      })
    })

    test('プロジェクトアクセス権限がない場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)
      prismaMock.project.findFirst.mockResolvedValue(null)

      await expect(getProjectTasks('proj-1')).rejects.toThrow(
        'プロジェクトが見つからないか、権限がありません'
      )
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getProjectTasks('proj-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('createTask', () => {
    test('PMがタスクを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [{ userId: '2', role: 'pm' }]
      } as any)

      prismaMock.task.create.mockResolvedValue(mockTask as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await createTask({
        projectId: 'proj-1',
        title: 'タスク1',
        description: 'タスクの説明',
        priority: 'high',
        estimatedHours: 8,
        startDate: '2024-03-01',
        dueDate: '2024-03-08',
        assigneeId: '3'
      })

      expect(result).toMatchObject({
        id: 'task-1',
        title: 'タスク1',
        priority: 'high'
      })
      expect(prismaMock.auditLog.create).toHaveBeenCalled()
    })

    test('コンサルタントはタスクを作成できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      // コンサルタントはPMやリードではないため、権限チェックで弾かれる
      prismaMock.project.findFirst.mockResolvedValue(null)

      await expect(createTask({
        projectId: 'proj-1',
        title: 'タスク1',
        priority: 'high'
      })).rejects.toThrow('タスクを作成する権限がありません')
    })

    test('未認証の場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await expect(createTask({
        projectId: 'proj-1',
        title: 'タスク1',
        priority: 'high'
      })).rejects.toThrow('認証が必要です')
    })
  })

  describe('updateTaskStatus', () => {
    test('アサインされたユーザーがステータスを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      prismaMock.task.findFirst.mockResolvedValue({
        ...mockTask,
        project: mockProject
      } as any)

      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        status: 'in_progress'
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateTaskStatus('task-1', 'in_progress')

      expect(result).toMatchObject({
        id: 'task-1',
        status: 'in_progress'
      })
    })

    test('PMがチームメンバーのタスクステータスを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.task.findFirst.mockResolvedValue({
        ...mockTask,
        project: {
          ...mockProject,
          projectMembers: [{ userId: '2', role: 'pm' }]
        }
      } as any)

      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        status: 'completed',
        completedAt: new Date()
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateTaskStatus('task-1', 'completed')

      expect(result).toMatchObject({
        id: 'task-1',
        status: 'completed'
      })
      expect(prismaMock.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            completedAt: expect.any(Date)
          })
        })
      )
    })

    test('関係ないユーザーはステータスを更新できない', async () => {
      const otherUser = { ...mockConsultantUser, id: '999' }
      mockedAuth.getCurrentUser.mockResolvedValue(otherUser as any)

      prismaMock.task.findFirst.mockResolvedValue(null)

      await expect(updateTaskStatus('task-1', 'in_progress')).rejects.toThrow(
        'タスクが見つからないか、権限がありません'
      )
    })
  })

  describe('updateTask', () => {
    test('PMがタスク情報を更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.task.findFirst.mockResolvedValue({
        ...mockTask,
        project: {
          ...mockProject,
          projectMembers: [{ userId: '2', role: 'pm' }]
        }
      } as any)

      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        title: '更新されたタスク',
        priority: 'low'
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateTask('task-1', {
        title: '更新されたタスク',
        priority: 'low'
      })

      expect(result).toMatchObject({
        id: 'task-1',
        title: '更新されたタスク',
        priority: 'low'
      })
    })

    test('アサインされたユーザー自身もタスクを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      prismaMock.task.findFirst.mockResolvedValue(mockTask as any)

      prismaMock.task.update.mockResolvedValue({
        ...mockTask,
        actualHours: 10
      } as any)

      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await updateTask('task-1', {
        actualHours: 10
      })

      expect(result).toMatchObject({
        id: 'task-1',
        actualHours: 10
      })
    })

    test('日付の更新処理が正しく動作する', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.task.findFirst.mockResolvedValue({
        ...mockTask,
        project: {
          ...mockProject,
          projectMembers: [{ userId: '2', role: 'pm' }]
        }
      } as any)

      prismaMock.task.update.mockResolvedValue(mockTask as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      await updateTask('task-1', {
        startDate: '2024-03-15',
        dueDate: '2024-03-22'
      })

      expect(prismaMock.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            startDate: expect.any(Date),
            dueDate: expect.any(Date)
          })
        })
      )
    })
  })

  describe('deleteTask', () => {
    test('PMがタスクを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as any)

      prismaMock.task.findFirst.mockResolvedValue({
        ...mockTask,
        project: {
          ...mockProject,
          projectMembers: [{ userId: '2', role: 'pm' }]
        }
      } as any)

      prismaMock.task.delete.mockResolvedValue(mockTask as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await deleteTask('task-1')

      expect(result).toEqual({ success: true })
      expect(prismaMock.task.delete).toHaveBeenCalledWith({
        where: { id: 'task-1' }
      })
    })

    test('エグゼクティブもタスクを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as any)

      prismaMock.task.findFirst.mockResolvedValue(mockTask as any)

      prismaMock.task.delete.mockResolvedValue(mockTask as any)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await deleteTask('task-1')

      expect(result).toEqual({ success: true })
    })

    test('コンサルタントはタスクを削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as any)

      prismaMock.task.findFirst.mockResolvedValue(null)

      await expect(deleteTask('task-1')).rejects.toThrow(
        'タスクが見つからないか、権限がありません'
      )
    })

    test('未認証の場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await expect(deleteTask('task-1')).rejects.toThrow('認証が必要です')
    })
  })
})