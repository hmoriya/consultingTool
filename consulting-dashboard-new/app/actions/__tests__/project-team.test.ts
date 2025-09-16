import { 
  getProjectTeamMembers, 
  addProjectMember, 
  updateProjectMember, 
  removeProjectMember,
  getProjectTeamStatistics 
} from '../project-team'
import { prismaMock } from '../../__mocks__/db'
import * as authModule from '../auth'

// getCurrentUserのモック
jest.mock('../auth')
const mockedAuth = authModule as jest.Mocked<typeof authModule>

describe('project-team actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockPMUser = {
    id: '1',
    name: 'PM',
    email: 'pm@example.com',
    role: { name: 'pm' },
    organization: { id: 'org-1', name: 'テスト組織' }
  }

  const mockConsultantUser = {
    id: '2',
    name: 'コンサルタント',
    email: 'consultant@example.com',
    role: { name: 'consultant' },
    organization: { id: 'org-1', name: 'テスト組織' }
  }

  describe('getProjectTeamMembers', () => {
    test('プロジェクトのチームメンバーを取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      const mockProject = {
        id: 'proj-1',
        name: 'テストプロジェクト',
        projectMembers: [
          {
            userId: '1',
            projectId: 'proj-1',
            role: 'pm',
            allocation: 50,
            startDate: new Date('2024-01-01'),
            endDate: null,
            user: {
              id: '1',
              name: 'PM太郎',
              email: 'pm@example.com',
              role: { name: 'pm' }
            }
          },
          {
            userId: '2',
            projectId: 'proj-1',
            role: 'consultant',
            allocation: 100,
            startDate: new Date('2024-01-01'),
            endDate: null,
            user: {
              id: '2',
              name: 'コンサル花子',
              email: 'consultant@example.com',
              role: { name: 'consultant' }
            }
          }
        ]
      }

      prismaMock.projectMember.findMany.mockResolvedValue(mockProject.projectMembers as any)

      const result = await getProjectTeamMembers('proj-1')

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        userId: '1',
        role: 'pm',
        allocation: 50,
        user: {
          name: 'PM太郎'
        }
      })
    })

    test('存在しないプロジェクトの場合もメンバーの一覧を返す', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.projectMember.findMany.mockResolvedValue([])

      const result = await getProjectTeamMembers('non-existent')

      expect(result).toEqual([])
    })

    test('未認証の場合はエラーをスローする', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await expect(getProjectTeamMembers('proj-1')).rejects.toThrow('認証が必要です')
      expect(prismaMock.projectMember.findMany).not.toHaveBeenCalled()
    })
  })

  describe.skip('addProjectMember', () => {
    const validMemberData = {
      userId: '3',
      projectId: 'proj-1',
      role: 'consultant' as const,
      allocation: 50,
      startDate: '2024-04-01'
    }

    test('PMがプロジェクトメンバーを追加できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      // プロジェクトの権限チェック
      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      // ユーザーの存在確認
      prismaMock.user.findFirst.mockResolvedValue({
        id: '3',
        organizationId: 'org-1',
        roleId: 'consultant-role',
        role: { name: 'consultant' }
      } as any)

      // 既存メンバーチェック
      prismaMock.projectMember.findUnique.mockResolvedValue(null)

      // 現在の稼働率チェック
      prismaMock.projectMember.groupBy.mockResolvedValue([
        { userId: '3', _sum: { allocation: 30 } }
      ] as any)

      prismaMock.projectMember.create.mockResolvedValue({
        ...validMemberData,
        startDate: new Date(validMemberData.startDate),
        endDate: null
      } as any)

      const result = await addProjectMember(validMemberData)

      expect(result.success).toBe(true)
      expect(prismaMock.projectMember.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '3',
          projectId: 'proj-1',
          role: 'consultant',
          allocation: 50
        })
      })
    })

    test('既にアサイン済みのメンバーは追加できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      prismaMock.user.findFirst.mockResolvedValue({
        id: '3',
        organizationId: 'org-1'
      } as any)

      // 既にアサイン済み
      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '3',
        projectId: 'proj-1'
      } as any)

      const result = await addProjectMember(validMemberData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('このメンバーは既にプロジェクトにアサインされています')
    })

    test('稼働率が100%を超える場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      prismaMock.user.findFirst.mockResolvedValue({
        id: '3',
        organizationId: 'org-1'
      } as any)

      prismaMock.projectMember.findUnique.mockResolvedValue(null)

      // 現在の稼働率が70%
      prismaMock.projectMember.groupBy.mockResolvedValue([
        { userId: '3', _sum: { allocation: 70 } }
      ] as any)

      const result = await addProjectMember(validMemberData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('このメンバーの稼働率が100%を超えてしまいます（現在: 70%, 追加: 50%）')
    })

    test('他組織のメンバーは追加できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      // 他組織のユーザー
      prismaMock.user.findFirst.mockResolvedValue({
        id: '3',
        organizationId: 'other-org'
      } as any)

      const result = await addProjectMember(validMemberData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('指定されたユーザーが見つかりません')
    })

    test('権限がない場合は追加できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '2', role: 'consultant' }]
      } as any)

      const result = await addProjectMember(validMemberData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('プロジェクトメンバーを追加する権限がありません')
    })
  })

  describe.skip('updateProjectMember', () => {
    test('プロジェクトメンバーの情報を更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1',
        role: 'consultant',
        allocation: 50
      } as any)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      // 他のプロジェクトでの稼働率チェック
      prismaMock.projectMember.groupBy.mockResolvedValue([
        { userId: '2', _sum: { allocation: 30 } }
      ] as any)

      prismaMock.projectMember.update.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1',
        role: 'consultant',
        allocation: 80
      } as any)

      const result = await updateProjectMember({
        userId: '2',
        projectId: 'proj-1',
        allocation: 80
      })

      expect(result.success).toBe(true)
      expect(prismaMock.projectMember.update).toHaveBeenCalledWith({
        where: {
          userId_projectId: {
            userId: '2',
            projectId: 'proj-1'
          }
        },
        data: { allocation: 80 }
      })
    })

    test('稼働率が100%を超える場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1',
        allocation: 50
      } as any)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      // 他プロジェクトで既に60%稼働
      prismaMock.projectMember.groupBy.mockResolvedValue([
        { userId: '2', _sum: { allocation: 60 } }
      ] as any)

      const result = await updateProjectMember({
        userId: '2',
        projectId: 'proj-1',
        allocation: 50 // 60% + 50% = 110%
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('このメンバーの稼働率が100%を超えてしまいます（現在: 60%, 変更後: 50%）')
    })

    test('存在しないメンバーの更新はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.projectMember.findUnique.mockResolvedValue(null)

      const result = await updateProjectMember({
        userId: 'non-existent',
        projectId: 'proj-1',
        allocation: 50
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('プロジェクトメンバーが見つかりません')
    })
  })

  describe.skip('removeProjectMember', () => {
    test('プロジェクトメンバーを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1',
        role: 'consultant'
      } as any)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [
          { userId: '1', role: 'pm' },
          { userId: '2', role: 'consultant' }
        ]
      } as any)

      // アクティブなタスクがない
      prismaMock.task.count.mockResolvedValue(0)

      prismaMock.projectMember.delete.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1'
      } as any)

      const result = await removeProjectMember('2', 'proj-1')

      expect(result.success).toBe(true)
      expect(prismaMock.projectMember.delete).toHaveBeenCalledWith({
        where: {
          userId_projectId: {
            userId: '2',
            projectId: 'proj-1'
          }
        }
      })
    })

    test('PMは削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '1',
        projectId: 'proj-1',
        role: 'pm'
      } as any)

      const result = await removeProjectMember('1', 'proj-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('プロジェクトマネージャーは削除できません')
    })

    test('アクティブなタスクがある場合は削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '2',
        projectId: 'proj-1',
        role: 'consultant'
      } as any)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '1', role: 'pm' }]
      } as any)

      // アクティブなタスクがある
      prismaMock.task.count.mockResolvedValue(3)

      const result = await removeProjectMember('2', 'proj-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('アクティブなタスクが割り当てられているメンバーは削除できません')
    })

    test('権限がない場合は削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      prismaMock.projectMember.findUnique.mockResolvedValue({
        userId: '3',
        projectId: 'proj-1',
        role: 'consultant'
      } as any)

      prismaMock.project.findFirst.mockResolvedValue({
        id: 'proj-1',
        projectMembers: [{ userId: '2', role: 'consultant' }]
      } as any)

      const result = await removeProjectMember('3', 'proj-1')

      expect(result.success).toBe(false)
      expect(result.error).toBe('プロジェクトメンバーを削除する権限がありません')
    })
  })

  describe.skip('getProjectTeamStatistics', () => {
    test('プロジェクトチームの統計を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      const mockProject = {
        id: 'proj-1',
        name: 'テストプロジェクト',
        projectMembers: [
          {
            user: {
              id: '1',
              name: 'PM太郎',
              role: { name: 'pm' },
              userSkills: [
                { skill: { name: 'Project Management', category: 'management' } }
              ]
            },
            allocation: 50,
            role: 'pm'
          },
          {
            user: {
              id: '2',
              name: 'コンサル花子',
              role: { name: 'consultant' },
              userSkills: [
                { skill: { name: 'React', category: 'frontend' } },
                { skill: { name: 'Node.js', category: 'backend' } }
              ]
            },
            allocation: 100,
            role: 'consultant'
          }
        ],
        tasks: [
          { status: 'completed' },
          { status: 'completed' },
          { status: 'in_progress' },
          { status: 'todo' }
        ]
      }

      prismaMock.project.findUnique.mockResolvedValue(mockProject as any)

      const result = await getProjectTeamStatistics('proj-1')

      expect(result).toMatchObject({
        totalMembers: 2,
        roleDistribution: {
          pm: 1,
          consultant: 1
        },
        totalAllocation: 150,
        skillCategories: {
          'management': ['Project Management'],
          'frontend': ['React'],
          'backend': ['Node.js']
        },
        taskCompletion: {
          total: 4,
          completed: 2,
          inProgress: 1,
          todo: 1,
          completionRate: 50
        }
      })
    })

    test('存在しないプロジェクトの場合はnullを返す', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.project.findUnique.mockResolvedValue(null)

      const result = await getProjectTeamStatistics('non-existent')

      expect(result).toBeNull()
    })

    test('未認証の場合はnullを返す', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      const result = await getProjectTeamStatistics('proj-1')

      expect(result).toBeNull()
    })
  })
})