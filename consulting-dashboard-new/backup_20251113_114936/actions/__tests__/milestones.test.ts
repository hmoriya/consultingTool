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
import type { User, Project, Milestone, Task, AuditLog } from '@prisma/client'

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


// type ProjectWithMilestones = Project & {
//   milestones: Milestone[]
// }

describe('milestones actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  const mockPMUser: UserWithRole = {
    id: '2',
    name: 'PM',
    email: 'pm@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-2',
    role: { 
      name: 'pm'
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockConsultantUser: UserWithRole = {
    id: '3',
    name: 'コンサルタント',
    email: 'consultant@example.com',
    password: 'hashed',
    organizationId: 'org-1',
    roleId: 'role-3',
    role: { 
      name: 'consultant'
    },
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const mockProject: Project = {
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
    updatedAt: new Date()
  }

  const mockMilestone: Milestone = {
    id: 'milestone-1',
    projectId: 'proj-1',
    name: 'フェーズ1完了',
    description: '初期開発フェーズの完了',
    dueDate: new Date('2024-06-30'),
    deliverables: '成果物リスト',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // Unused variable - removed to fix lint

  describe('getProjectMilestones', () => {
    test('PMがプロジェクトのマイルストーン一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [
          { id: 'pm-1', userId: '2' }
        ]
      } as Project & { projectMembers: { id: string; userId: string }[] })
      prismaMock.milestone.findMany.mockResolvedValue([mockMilestone])

      const result = await getProjectMilestones('proj-1')

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'milestone-1',
        name: 'フェーズ1完了'
      })

      expect(prismaMock.milestone.findMany).toHaveBeenCalledWith({
        where: { projectId: 'proj-1' },
        orderBy: { dueDate: 'asc' },
        include: { tasks: true }
      })
    })

    test('プロジェクトに参加していないユーザーはアクセスできない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)
      prismaMock.project.findFirst.mockResolvedValue(null)

      await expect(getProjectMilestones('proj-1')).rejects.toThrow('プロジェクトへのアクセス権限がありません')
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getProjectMilestones('proj-1')

      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('createMilestone', () => {
    test('PMがマイルストーンを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [
          { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
        ]
      } as Project & { projectMembers: { id: string; userId: string; roleOnProject: string }[] })
      prismaMock.milestone.create.mockResolvedValue({
        ...mockMilestone,
        id: 'new-milestone'
      })
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-1',
        userId: '2',
        action: 'CREATE',
        resource: 'milestone',
        resourceId: 'new-milestone',
        details: JSON.stringify({ name: 'フェーズ1完了' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        description: '初期開発フェーズの完了',
        dueDate: new Date('2024-06-30'),
        deliverables: '成果物リスト'
      })

      expect(result.id).toBe('new-milestone')
    })

    test('エグゼクティブもマイルストーンを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      
      prismaMock.project.findFirst.mockResolvedValue(mockProject)
      prismaMock.milestone.create.mockResolvedValue(mockMilestone)
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-2',
        userId: '1',
        action: 'CREATE',
        resource: 'milestone',
        resourceId: 'milestone-1',
        details: JSON.stringify({ name: 'フェーズ1完了' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        description: '初期開発フェーズの完了',
        dueDate: new Date('2024-06-30'),
        deliverables: '成果物リスト'
      })

      expect(result).toBeTruthy()
    })

    test('コンサルタントはマイルストーンを作成できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [
          { id: 'pm-1', userId: '3', roleOnProject: 'member' }
        ]
      } as Project & { projectMembers: { id: string; userId: string; roleOnProject: string }[] })

      await expect(createMilestone({
        projectId: 'proj-1',
        name: 'フェーズ1完了',
        description: '初期開発フェーズの完了',
        dueDate: new Date('2024-06-30'),
        deliverables: '成果物リスト'
      })).rejects.toThrow('マイルストーンの作成権限がありません')
    })

    test('存在しないプロジェクトの場合エラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      
      prismaMock.project.findFirst.mockResolvedValue(mockProject)

      // プロジェクトメンバーではない
      prismaMock.project.findFirst.mockResolvedValue(null)

      await expect(createMilestone({
        projectId: 'non-existent',
        name: 'フェーズ1完了',
        description: '初期開発フェーズの完了',
        dueDate: new Date('2024-06-30'),
        deliverables: '成果物リスト'
      })).rejects.toThrow('プロジェクトが見つかりません')
    })
  })

  describe('updateMilestone', () => {
    test('PMがマイルストーンを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: {
          ...mockProject,
          projectMembers: [
            { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
          ]
        }
      } as Milestone & { 
        project: Project & { 
          projectMembers: { id: string; userId: string; roleOnProject: string }[] 
        }
      })
      prismaMock.milestone.update.mockResolvedValue({
        ...mockMilestone,
        status: 'completed'
      })
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-3',
        userId: '2',
        action: 'UPDATE',
        resource: 'milestone',
        resourceId: 'milestone-1',
        details: JSON.stringify({ status: 'completed' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await updateMilestone('milestone-1', { status: 'completed' })

      expect(result.status).toBe('completed')
    })

    test('エグゼクティブもマイルストーンを更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: mockProject
      } as Milestone & { project: Project })
      prismaMock.milestone.update.mockResolvedValue({
        ...mockMilestone,
        status: 'completed'
      })
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-4',
        userId: '1',
        action: 'UPDATE',
        resource: 'milestone',
        resourceId: 'milestone-1',
        details: JSON.stringify({ status: 'completed' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await updateMilestone('milestone-1', { status: 'completed' })

      expect(result.status).toBe('completed')
    })

    test('存在しないマイルストーンの更新はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.milestone.findFirst.mockResolvedValue(null)

      await expect(updateMilestone('non-existent', { status: 'completed' })).rejects.toThrow('マイルストーンが見つかりません')
    })
  })

  describe('deleteMilestone', () => {
    test('PMがマイルストーンを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: {
          ...mockProject,
          projectMembers: [
            { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
          ]
        }
      } as Milestone & { 
        project: Project & { 
          projectMembers: { id: string; userId: string; roleOnProject: string }[] 
        }
      })
      prismaMock.milestone.delete.mockResolvedValue(mockMilestone)
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-5',
        userId: '2',
        action: 'DELETE',
        resource: 'milestone',
        resourceId: 'milestone-1',
        details: JSON.stringify({ name: 'フェーズ1完了' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await deleteMilestone('milestone-1')

      expect(result.success).toBe(true)
    })

    test('completedステータスのマイルストーンは削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        status: 'completed',
        project: {
          ...mockProject,
          projectMembers: [
            { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
          ]
        }
      } as Milestone & { 
        project: Project & { 
          projectMembers: { id: string; userId: string; roleOnProject: string }[] 
        }
      })

      await expect(deleteMilestone('milestone-1')).rejects.toThrow('完了済みのマイルストーンは削除できません')
    })

    test('コンサルタントはマイルストーンを削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: {
          ...mockProject,
          projectMembers: [
            { id: 'pm-1', userId: '3', roleOnProject: 'member' }
          ]
        }
      } as Milestone & { 
        project: Project & { 
          projectMembers: { id: string; userId: string; roleOnProject: string }[] 
        }
      })

      await expect(deleteMilestone('milestone-1')).rejects.toThrow('マイルストーンの削除権限がありません')
    })
  })

  describe('getMilestoneStats', () => {
    test('プロジェクトのマイルストーン統計を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.project.findFirst.mockResolvedValue({
        ...mockProject,
        projectMembers: [
          { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
        ]
      } as Project & { projectMembers: { id: string; userId: string; roleOnProject: string }[] })

      const mockMilestones = [
        { ...mockMilestone, status: 'completed' },
        { ...mockMilestone, id: 'milestone-2', status: 'pending' },
        { ...mockMilestone, id: 'milestone-3', status: 'pending', dueDate: new Date('2023-12-31') }, // 期限切れ
      ]

      prismaMock.milestone.findMany.mockResolvedValue(mockMilestones as Milestone[])

      const result = await getMilestoneStats('proj-1')

      expect(result).toEqual({
        total: 3,
        completed: 1,
        pending: 2,
        delayed: 1,
        progressPercentage: 33.33
      })
    })
  })

  describe('getMilestoneTasks', () => {
    test('マイルストーンのタスク一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.milestone.findFirst.mockResolvedValue({
        ...mockMilestone,
        project: {
          ...mockProject,
          projectMembers: [
            { id: 'pm-1', userId: '2', roleOnProject: 'pm' }
          ]
        }
      } as Milestone & { 
        project: Project & { 
          projectMembers: { id: string; userId: string; roleOnProject: string }[] 
        }
      })

      const mockTasks: Task[] = [
        {
          id: 'task-1',
          milestoneId: 'milestone-1',
          name: 'タスク1',
          description: '要件定義',
          assignedToId: 'user-1',
          status: 'completed',
          priority: 'high',
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'task-2',
          milestoneId: 'milestone-1',
          name: 'タスク2',
          description: '設計',
          assignedToId: 'user-2',
          status: 'in_progress',
          priority: 'medium',
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      prismaMock.task.findMany.mockResolvedValue(mockTasks)

      const result = await getMilestoneTasks('milestone-1')

      expect(result).toHaveLength(2)
      expect(result).toMatchObject([
        { status: 'completed', priority: 'high' },
        { status: 'in_progress', priority: 'medium' }
      ])
    })

    test('プロジェクトメンバー以外はタスクを取得できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)
      prismaMock.milestone.findFirst.mockResolvedValue(null)

      await expect(getMilestoneTasks('milestone-1')).rejects.toThrow('マイルストーンへのアクセス権限がありません')
    })
  })
})