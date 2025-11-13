import { 
  getTeamMembers,
  searchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getMemberUtilization
} from '../team'
import { prismaMock } from '../../__mocks__/db'
import * as authModule from '../auth'
import * as bcrypt from 'bcryptjs'

// bcryptのモック
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password')
}))

// getCurrentUserのモック
jest.mock('../auth')
const mockedAuth = authModule as jest.Mocked<typeof authModule>

describe('team actions', () => {
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

  const mockMembers = [
    {
      ...mockExecutiveUser,
      projectMembers: [],
      _count: { projectMembers: 0 }
    },
    {
      ...mockPMUser,
      projectMembers: [
        {
          userId: '2',
          projectId: 'proj-1',
          role: 'pm',
          allocation: 100,
          project: {
            id: 'proj-1',
            name: 'プロジェクトA',
            status: 'active'
          }
        }
      ],
      _count: { projectMembers: 1 }
    },
    {
      ...mockConsultantUser,
      projectMembers: [
        {
          userId: '3',
          projectId: 'proj-1',
          role: 'consultant',
          allocation: 80,
          project: {
            id: 'proj-1',
            name: 'プロジェクトA',
            status: 'active'
          }
        }
      ],
      _count: { projectMembers: 1 }
    }
  ]

  describe('getTeamMembers', () => {
    test('エグゼクティブがチームメンバー一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findMany.mockResolvedValue(mockMembers as unknown)

      const result = await getTeamMembers()

      expect(result).toHaveLength(3)
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-1',
          role: {
            name: {
              in: ['executive', 'pm', 'consultant']
            }
          }
        },
        include: expect.any(Object),
        orderBy: expect.any(Array)
      })
    })

    test('PMもチームメンバー一覧を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      prismaMock.user.findMany.mockResolvedValue(mockMembers as unknown)

      const result = await getTeamMembers()

      expect(result).toHaveLength(3)
    })

    test('コンサルタントはチームメンバー一覧にアクセスできない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as unknown)

      await expect(getTeamMembers()).rejects.toThrow('アクセス権限がありません')
    })

    test('未認証の場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await expect(getTeamMembers()).rejects.toThrow('認証が必要です')
    })
  })

  describe('searchTeamMembers', () => {
    test('名前でメンバーを検索できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      const searchResult = [mockConsultantUser]
      prismaMock.user.findMany.mockResolvedValue(searchResult as unknown)

      const result = await searchTeamMembers('コンサル')

      expect(result).toHaveLength(1)
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-1',
          role: {
            name: {
              in: ['executive', 'pm', 'consultant']
            }
          },
          OR: [
            { name: { contains: 'コンサル', mode: 'insensitive' } },
            { email: { contains: 'コンサル', mode: 'insensitive' } }
          ]
        },
        include: expect.any(Object),
        orderBy: expect.any(Object)
      })
    })

    test('エグゼクティブも検索できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findMany.mockResolvedValue([])

      await searchTeamMembers('test')

      expect(prismaMock.user.findMany).toHaveBeenCalled()
    })

    test('コンサルタントは検索できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as unknown)

      await expect(searchTeamMembers('test')).rejects.toThrow('アクセス権限がありません')
    })
  })

  describe('createTeamMember', () => {
    test('エグゼクティブが新規メンバーを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findUnique.mockResolvedValue(null) // 重複なし
      prismaMock.user.create.mockResolvedValue({
        id: 'new-user-1',
        email: 'new@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003',
        role: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'consultant',
          description: 'Consultant role'
        },
        password: 'hashed_password',
        organizationId: 'org-1',
        createdAt: new Date(),
        updatedAt: new Date()
      } as unknown)

      const result = await createTeamMember({
        email: 'new@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003', // UUID形式
        password: 'password123'
      })

      expect(result).toMatchObject({
        email: 'new@example.com',
        name: '新規メンバー'
      })
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
    })

    test('PMも新規メンバーを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      prismaMock.user.findUnique.mockResolvedValue(null)
      prismaMock.user.create.mockResolvedValue({
        id: 'new-user-1',
        email: 'new@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003',
        role: { name: 'consultant' }
      } as unknown)

      const result = await createTeamMember({
        email: 'new@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003', // UUID形式
        password: 'password123'
      })

      expect(result).toBeTruthy()
    })

    test('メールアドレスが重複している場合はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-user' } as unknown)

      await expect(createTeamMember({
        email: 'existing@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003', // UUID形式
        password: 'password123'
      })).rejects.toThrow('このメールアドレスは既に使用されています')
    })

    test('コンサルタントはメンバーを作成できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as unknown)

      await expect(createTeamMember({
        email: 'new@example.com',
        name: '新規メンバー',
        roleId: '550e8400-e29b-41d4-a716-446655440003', // UUID形式
        password: 'password123'
      })).rejects.toThrow('アクセス権限がありません')
    })
  })

  describe('updateTeamMember', () => {
    test('エグゼクティブがメンバー情報を更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findFirst.mockResolvedValue(mockConsultantUser as unknown)
      prismaMock.user.update.mockResolvedValue({
        ...mockConsultantUser,
        name: '更新されたコンサルタント',
        roleId: '550e8400-e29b-41d4-a716-446655440002', // UUID形式
        role: { name: 'pm' }
      } as unknown)

      const result = await updateTeamMember('3', {
        name: '更新されたコンサルタント',
        roleId: '550e8400-e29b-41d4-a716-446655440002'
      })

      expect(result).toMatchObject({
        name: '更新されたコンサルタント',
        roleId: '550e8400-e29b-41d4-a716-446655440002'
      })
    })

    test('PMもメンバー情報を更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      prismaMock.user.findFirst.mockResolvedValue(mockConsultantUser as unknown)
      prismaMock.user.update.mockResolvedValue({
        ...mockConsultantUser,
        name: '更新名'
      } as unknown)

      const result = await updateTeamMember('3', {
        name: '更新名',
        roleId: '550e8400-e29b-41d4-a716-446655440003'
      })

      expect(result).toBeTruthy()
    })

    test('他組織のメンバーは更新できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findFirst.mockResolvedValue(null)

      await expect(updateTeamMember('999', {
        name: '更新名',
        roleId: '550e8400-e29b-41d4-a716-446655440003'
      })).rejects.toThrow('メンバーが見つかりません')
    })
  })

  describe('deleteTeamMember', () => {
    test('エグゼクティブがメンバーを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findFirst.mockResolvedValue({
        ...mockConsultantUser,
        _count: { projectMembers: 0 }
      } as unknown)
      prismaMock.projectMember.count.mockResolvedValue(0)
      prismaMock.user.delete.mockResolvedValue(mockConsultantUser as unknown)

      await deleteTeamMember('3')

      expect(prismaMock.user.delete).toHaveBeenCalledWith({
        where: { id: '3' }
      })
    })

    test('自分自身は削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      await expect(deleteTeamMember('1')).rejects.toThrow('自分自身は削除できません')
    })

    test('アクティブプロジェクトに参加中のメンバーは削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      prismaMock.user.findFirst.mockResolvedValue(mockConsultantUser as unknown)
      prismaMock.projectMember.count.mockResolvedValue(2)

      await expect(deleteTeamMember('3')).rejects.toThrow(
        'アクティブなプロジェクトに参加しているメンバーは削除できません'
      )
    })

    test('エグゼクティブ以外はメンバーを削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      await expect(deleteTeamMember('3')).rejects.toThrow(
        'エグゼクティブのみメンバーを削除できます'
      )
    })
  })

  describe('getMemberUtilization', () => {
    test('メンバーの稼働率を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser as unknown)

      const mockUtilizationData = [
        {
          id: '2',
          name: 'PM',
          email: 'pm@example.com',
          projectMembers: [
            {
              allocation: 50,
              project: {
                name: 'プロジェクトA',
                clientId: 'client-1'
              }
            },
            {
              allocation: 30,
              project: {
                name: 'プロジェクトB',
                clientId: 'client-2'
              }
            }
          ]
        }
      ]

      prismaMock.user.findMany.mockResolvedValue(mockUtilizationData as unknown)

      const result = await getMemberUtilization()

      expect(result).toMatchObject([
        {
          id: '2',
          name: 'PM',
          totalAllocation: 80,
          projects: expect.arrayContaining([
            { name: 'プロジェクトA', allocation: 50 },
            { name: 'プロジェクトB', allocation: 30 }
          ])
        }
      ])
    })

    test('特定メンバーの稼働率を取得できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser as unknown)

      prismaMock.user.findMany.mockResolvedValue([{
        id: '3',
        name: 'コンサルタント',
        email: 'consultant@example.com',
        projectMembers: []
      }] as unknown)

      const result = await getMemberUtilization('3')

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: 'org-1',
          role: {
            name: {
              in: ['pm', 'consultant']
            }
          },
          id: '3'
        },
        include: expect.any(Object)
      })
      expect(result[0].totalAllocation).toBe(0)
    })

    test('コンサルタントは稼働率を確認できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser as unknown)

      await expect(getMemberUtilization()).rejects.toThrow('アクセス権限がありません')
    })
  })
})