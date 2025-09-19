import { cookies } from 'next/headers'
import { authDb } from '@/lib/db'

export async function createSession(userId: string) {
  // 開発環境では8時間、本番環境では2時間の有効期限
  const sessionDuration = process.env.NODE_ENV === 'development' 
    ? 8 * 60 * 60 * 1000  // 8時間
    : 2 * 60 * 60 * 1000  // 2時間
  
  const expiresAt = new Date(Date.now() + sessionDuration)
  
  const session = await authDb.session.create({
    data: {
      userId,
      token: crypto.randomUUID(),
      expiresAt,
      ipAddress: '', // TODO: リクエストから取得
      userAgent: '', // TODO: リクエストから取得
    }
  })
  
  const cookieStore = await cookies()
  cookieStore.set('session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDuration / 1000 // 秒単位に変換
  })
  
  return session
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    return null
  }
  
  const session = await authDb.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: {
          role: true,
          organization: true
        }
      }
    }
  })
  
  if (!session || session.expiresAt < new Date()) {
    return null
  }
  
  // セッションの有効期限を自動延長（DB側のみ更新）
  // Cookie自体の更新はServer ActionまたはRoute Handlerで行う必要がある
  const remainingTime = session.expiresAt.getTime() - Date.now()
  const sessionDuration = process.env.NODE_ENV === 'development' 
    ? 8 * 60 * 60 * 1000  // 8時間
    : 2 * 60 * 60 * 1000  // 2時間
  
  // 残り時間が元の有効期限の半分以下の場合、DBのセッション期限のみ延長
  if (remainingTime < sessionDuration / 2) {
    const newExpiresAt = new Date(Date.now() + sessionDuration)
    await authDb.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt }
    })
  }
  
  return session
}

export async function deleteSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (sessionId) {
    await authDb.session.delete({
      where: { id: sessionId }
    }).catch(() => {})
    
    cookieStore.delete('session')
  }
}