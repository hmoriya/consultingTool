'use server'

import { cookies } from 'next/headers'
import { db } from '@/lib/db'

/**
 * セッションを延長するServer Action
 * クライアントサイドから定期的に呼び出すことで、セッションを維持
 */
export async function extendSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    return { success: false, error: 'No session' }
  }
  
  try {
    const session = await db.session.findUnique({
      where: { id: sessionId }
    })
    
    if (!session || session.expiresAt < new Date()) {
      return { success: false, error: 'Session expired' }
    }
    
    // セッション期限を延長
    const sessionDuration = process.env.NODE_ENV === 'development' 
      ? 8 * 60 * 60 * 1000  // 8時間
      : 2 * 60 * 60 * 1000  // 2時間
    
    const newExpiresAt = new Date(Date.now() + sessionDuration)
    
    await db.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt }
    })
    
    // Cookieも更新
    cookieStore.set('session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: sessionDuration / 1000
    })
    
    return { success: true }
  } catch (_error) {
    console.error('Failed to extend session:', error)
    return { success: false, error: 'Failed to extend session' }
  }
}