import { getClients, createClient, updateClient, deleteClient } from '../clients'
import { prismaMock } from '../../__mocks__/db'
import * as authModule from '../auth'
import { redirect } from 'next/navigation'
import type { AuditLog, Organization, Project, User } from '@prisma/client'

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

type OrganizationWithRelations = Organization & {
  projects: Project[]
  users: User[]
}

describe('clients actions', () => {
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

  describe('getClients', () => {
    test('クライアント一覧を取得できる', async () => {
      const mockClients: OrganizationWithRelations[] = [
        {
          id: 'client-1',
          name: 'クライアントA',
          type: 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
          projects: [
            { 
              id: 'proj-1', 
              name: 'Project 1',
              clientId: 'client-1',
              status: 'active',
              startDate: new Date(),
              endDate: new Date(),
              budgetAmount: 1000000,
              budgetCurrency: 'JPY',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: 'proj-2', 
              name: 'Project 2',
              clientId: 'client-1',
              status: 'completed',
              startDate: new Date(),
              endDate: new Date(),
              budgetAmount: 2000000,
              budgetCurrency: 'JPY',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          users: []
        }
      ]

      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)
      prismaMock.organization.findMany.mockResolvedValue(mockClients)

      const result = await getClients()

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'client-1',
        name: 'クライアントA',
        projectCount: 2,
        activeProjectCount: 1
      })
    })

    test('未認証の場合はリダイレクト', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(null)

      await getClients()

      expect(redirect).toHaveBeenCalledWith('/login')
      expect(prismaMock.organization.findMany).not.toHaveBeenCalled()
    })
  })

  describe('createClient', () => {
    test('エグゼクティブがクライアントを作成できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      prismaMock.organization.findFirst.mockResolvedValue(null) // 重複なし
      prismaMock.organization.create.mockResolvedValue({
        id: 'new-client-1',
        name: '新規クライアント',
        type: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-1',
        userId: '1',
        action: 'CREATE',
        resource: 'client',
        resourceId: 'new-client-1',
        details: JSON.stringify({ name: '新規クライアント' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await createClient({ name: '新規クライアント' })

      expect(result).toMatchObject({
        id: 'new-client-1',
        name: '新規クライアント'
      })

      expect(prismaMock.auditLog.create).toHaveBeenCalled()
    })

    test('コンサルタントはクライアントを作成できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      await expect(createClient({ name: '新規クライアント' })).rejects.toThrow('権限がありません')
      expect(prismaMock.organization.create).not.toHaveBeenCalled()
    })

    test('重複するクライアント名の場合エラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      prismaMock.organization.findFirst.mockResolvedValue({
        id: 'existing-client',
        name: '新規クライアント',
        type: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await expect(createClient({ name: '新規クライアント' })).rejects.toThrow('同名のクライアントが既に存在します')
    })
  })

  describe('updateClient', () => {
    test('エグゼクティブがクライアント情報を更新できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      
      // findFirstで既存クライアントを探す（実装に合わせる）
      prismaMock.organization.findFirst.mockResolvedValueOnce({
        id: 'client-1',
        name: '既存クライアント',
        type: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      // 重複チェック用のfindFirst（自分自身を除く）
      prismaMock.organization.findFirst.mockResolvedValueOnce(null)

      prismaMock.organization.update.mockResolvedValue({
        id: 'client-1',
        name: '更新クライアント',
        type: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-2',
        userId: '1',
        action: 'UPDATE',
        resource: 'client',
        resourceId: 'client-1',
        details: JSON.stringify({ name: '更新クライアント' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await updateClient('client-1', { name: '更新クライアント' })

      expect(result).toMatchObject({
        name: '更新クライアント'
      })
    })

    test('存在しないクライアントの更新はエラー', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      prismaMock.organization.findFirst.mockResolvedValue(null)

      await expect(updateClient('non-existent', { name: '更新クライアント' })).rejects.toThrow('クライアントが見つかりません')
    })

    test('コンサルタントはクライアント情報を更新できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockConsultantUser)

      await expect(updateClient('client-1', { name: '更新クライアント' })).rejects.toThrow('権限がありません')
    })
  })

  describe('deleteClient', () => {
    test('エグゼクティブがクライアントを削除できる', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      
      const mockClientWithoutProjects: OrganizationWithRelations = {
        id: 'client-1',
        name: '削除対象クライアント',
        type: 'client',
        projects: [], // 空の配列
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      prismaMock.organization.findFirst.mockResolvedValue(mockClientWithoutProjects)

      prismaMock.organization.delete.mockResolvedValue({
        id: 'client-1',
        name: '削除対象クライアント',
        type: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit-3',
        userId: '1',
        action: 'DELETE',
        resource: 'client',
        resourceId: 'client-1',
        details: JSON.stringify({ name: '削除対象クライアント' }),
        ipAddress: null,
        createdAt: new Date()
      } as AuditLog)

      const result = await deleteClient('client-1')

      expect(result).toEqual({ success: true })
      expect(prismaMock.organization.delete).toHaveBeenCalledWith({
        where: { id: 'client-1' }
      })
    })

    test('プロジェクトが紐付いているクライアントは削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockExecutiveUser)
      
      const mockClientWithProjects: OrganizationWithRelations = {
        id: 'client-1',
        name: 'アクティブクライアント',
        type: 'client',
        projects: [
          { 
            id: 'proj-1',
            name: 'Project 1',
            clientId: 'client-1',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(),
            budgetAmount: 1000000,
            budgetCurrency: 'JPY',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          { 
            id: 'proj-2',
            name: 'Project 2',
            clientId: 'client-1',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(),
            budgetAmount: 2000000,
            budgetCurrency: 'JPY',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          { 
            id: 'proj-3',
            name: 'Project 3',
            clientId: 'client-1',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(),
            budgetAmount: 3000000,
            budgetCurrency: 'JPY',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ], // 3つのプロジェクト
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      prismaMock.organization.findFirst.mockResolvedValue(mockClientWithProjects)

      await expect(deleteClient('client-1')).rejects.toThrow('このクライアントには3件のプロジェクトが存在します。削除できません。')
      expect(prismaMock.organization.delete).not.toHaveBeenCalled()
    })

    test('エグゼクティブ以外はクライアントを削除できない', async () => {
      mockedAuth.getCurrentUser.mockResolvedValue(mockPMUser)

      await expect(deleteClient('client-1')).rejects.toThrow('権限がありません（エグゼクティブのみ削除可能）')
    })
  })
})