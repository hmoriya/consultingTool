'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from './auth'

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: '認証が必要です' }
    }

    const users = await db.user.findMany({
      where: {
        id: {
          not: currentUser.id
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            name: true
          }
        },
        organization: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return { success: true, data: users }
  } catch (error) {
    console.error('getAllUsers error:', error)
    return { success: false, error: 'ユーザー一覧の取得に失敗しました' }
  }
}