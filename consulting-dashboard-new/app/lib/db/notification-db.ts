// 通知サービス用の独立したPrismaクライアント
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'
import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var notificationDb: NotificationPrismaClient | undefined
}

// 通知データベースのパスを決定
function getNotificationDbPath() {
  if (process.env.NOTIFICATION_DATABASE_URL) {
    // 環境変数が相対パスの場合、絶対パスに変換
    if (process.env.NOTIFICATION_DATABASE_URL.startsWith('file:./')) {
      const relativePath = process.env.NOTIFICATION_DATABASE_URL.replace('file:./', '')
      return `file:${path.resolve(process.cwd(), relativePath)}`
    }
    return process.env.NOTIFICATION_DATABASE_URL
  }
  return `file:${path.resolve(process.cwd(), 'prisma/notification-service/data/notification.db')}`
}

const notificationDbPath = getNotificationDbPath()
console.log('Notification DB Path:', notificationDbPath)

// 通知データベース用のクライアントインスタンス
export const notificationDb = global.notificationDb || new NotificationPrismaClient({
  datasources: {
    db: {
      url: notificationDbPath
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.notificationDb) {
  global.notificationDb = notificationDb
}