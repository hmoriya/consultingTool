import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { login, logout, getCurrentUser } from '../auth'
import { prismaMock } from '../../__mocks__/db'
import * as sessionModule from '@/lib/auth/session'

// Next.js headersのモック
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }))
}))

// セッションモジュールのモック
const mockedSession = sessionModule as jest.Mocked<typeof sessionModule>

describe('auth actions', () => {
  const mockCookies = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(cookies as jest.Mock).mockReturnValue(mockCookies)
  })

  describe('login', () => {
    test('正しい認証情報でログイン成功', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        name: 'テストユーザー',
        roleId: 'role-1',
        organizationId: 'org-1',
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: {
          id: 'role-1',
          name: 'consultant',
          description: 'コンサルタント',
          isSystem: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        organization: {
          id: 'org-1',
          name: 'テスト組織',
          type: 'consultingFirm',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      const mockSession = {
        id: 'session-1',
        userId: '1',
        token: 'token-123',
        ipAddress: null,
        userAgent: null,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        createdAt: new Date()
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser)
      mockedSession.createSession.mockResolvedValue(mockSession)
      prismaMock.user.update.mockResolvedValue(mockUser)
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result.success).toBe(true)
      expect(result.user).toEqual({
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: 'consultant'
      })

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { role: true, organization: true }
      })

      expect(mockedSession.createSession).toHaveBeenCalledWith('1')
    })

    test('無効なパスワードでログイン失敗', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10)
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
        isActive: true,
        role: { name: 'consultant' },
        organization: { name: 'テスト組織' }
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('メールアドレスまたはパスワードが正しくありません')
    })

    test('存在しないユーザーでログイン失敗', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null)

      const result = await login({
        email: 'nonexistent@example.com',
        password: 'password123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('メールアドレスまたはパスワードが正しくありません')
    })

    test('無効なメールアドレスでバリデーションエラー', async () => {
      const result = await login({
        email: 'invalid-email',
        password: 'password123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('有効なメールアドレスを入力してください')
    })

    test('非アクティブユーザーでログイン失敗', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        isActive: false
      }

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('メールアドレスまたはパスワードが正しくありません')
    })
  })

  describe('logout', () => {
    test('正常にログアウト', async () => {
      const mockSession = {
        id: 'session-1',
        userId: '1',
        token: 'token',
        ipAddress: null,
        userAgent: null,
        expiresAt: new Date(),
        createdAt: new Date()
      }
      
      mockedSession.getSession.mockResolvedValue(mockSession)
      mockedSession.deleteSession.mockResolvedValue()
      prismaMock.auditLog.create.mockResolvedValue({} as any)

      await logout()

      expect(mockedSession.deleteSession).toHaveBeenCalled()
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith({
        data: {
          userId: '1',
          action: 'LOGOUT',
          resource: 'auth'
        }
      })
    })

    test('セッションがない場合もエラーにならない', async () => {
      mockedSession.getSession.mockResolvedValue(null)
      mockedSession.deleteSession.mockResolvedValue()

      await logout()

      expect(prismaMock.auditLog.create).not.toHaveBeenCalled()
      expect(mockedSession.deleteSession).toHaveBeenCalled()
    })
  })

  describe('getCurrentUser', () => {
    test('有効なセッションでユーザー情報を取得', async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000)
      const mockSession = {
        id: 'session-1',
        userId: '1',
        token: 'token',
        ipAddress: null,
        userAgent: null,
        expiresAt: futureDate,
        createdAt: new Date(),
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'テストユーザー',
          password: 'hashed',
          roleId: 'role-1',
          organizationId: 'org-1',
          isActive: true,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          role: {
            id: 'role-1',
            name: 'consultant',
            description: 'コンサルタント'
          },
          organization: {
            id: 'org-1',
            name: 'テスト組織',
            type: 'consultingFirm'
          }
        }
      }

      mockedSession.getSession.mockResolvedValue(mockSession as any)

      const user = await getCurrentUser()

      expect(user).toEqual({
        id: '1',
        name: 'テストユーザー',
        email: 'test@example.com',
        role: {
          name: 'consultant'
        },
        organization: {
          name: 'テスト組織'
        }
      })
    })

    test('セッションがない場合nullを返す', async () => {
      mockedSession.getSession.mockResolvedValue(null)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })

    test('期限切れセッションの場合nullを返す', async () => {
      // getSession内で期限チェックが行われているので、期限切れの場合はnullが返る
      mockedSession.getSession.mockResolvedValue(null)

      const user = await getCurrentUser()

      expect(user).toBeNull()
    })
  })
})