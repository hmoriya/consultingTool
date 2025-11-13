'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { authDb } from '@/lib/db'
import { LoginSchema } from '@/lib/schemas/auth'
import { createSession, deleteSession, getSession } from '@/lib/auth/session'

export async function login(data: z.infer<typeof LoginSchema>) {
  try {
    // バリデーション
    const validated = LoginSchema.parse(data)
    
    // デバッグ用ログ
    console.log('Login attempt for:', validated.email)
    
    // ユーザー検索
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await (authDb as any).user.findUnique({
      where: { email: validated.email },
      include: { role: true, organization: true }
    })
    
    if (!user) {
      console.log('User not found')
      return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' }
    }
    
    if (!user.isActive) {
      console.log('User is not active')
      return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' }
    }
    
    // パスワード検証
    const validPassword = await bcrypt.compare(validated.password, user.password)
    console.log('Password validation result:', validPassword)
    
    if (!validPassword) {
      return { success: false, error: 'メールアドレスまたはパスワードが正しくありません' }
    }
    
    // セッション作成
    await createSession(user.id)
    
    // 最終ログイン更新
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (authDb as any).user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // 監査ログ
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (authDb as any).auditLog.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          resource: 'auth',
          resourceId: user.id,
          details: JSON.stringify({ email: user.email, role: user.role.name })
        }
      })
    } catch (error) {
      console.error('Failed to create audit log during login:', error)
      // Continue with login even if audit log fails
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle ZodError using the correct 'issues' property
      if (error.issues && Array.isArray(error.issues) && error.issues.length > 0) {
        const firstIssue = error.issues[0];
        return { success: false, error: firstIssue?.message || 'バリデーションエラー' }
      } else if (error.message) {
        // Extract the first error message from the stringified error
        const match = error.message.match(/message": "([^"]+)"/);
        if (match) {
          return { success: false, error: match[1] }
        }
      }
      return { success: false, error: 'バリデーションエラー' }
    }
    return { success: false, error: 'サーバーエラーが発生しました' }
  }
}

export async function logout() {
  const session = await getSession()
  
  if (session) {
    try {
      // 監査ログ
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (authDb as any).auditLog.create({
        data: {
          userId: session.userId,
          action: 'LOGOUT',
          resource: 'auth',
          resourceId: session.userId
        }
      })
    } catch (error) {
      console.error('Failed to create audit log during logout:', error)
      // Continue with logout even if audit log fails
    }
  }
  
  await deleteSession()
  redirect('/login')
}

export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session) {
    return null
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    organizationId: session.user.organization.id,
    role: {
      name: session.user.role.name
    },
    organization: {
      id: session.user.organization.id,
      name: session.user.organization.name
    }
  }
}