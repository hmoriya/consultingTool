import { PrismaClient } from '@prisma/notification-client'

declare global {
  var notificationPrisma: PrismaClient | undefined
}

export const notificationDb = globalThis.notificationPrisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.NOTIFICATION_DATABASE_URL || 'file:./data/notification.db'
    }
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.notificationPrisma = notificationDb
}