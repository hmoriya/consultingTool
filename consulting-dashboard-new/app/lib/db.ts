// 認証サービスのクライアントをデフォルトとして使用
// 各サービスは独自のクライアントを持つ
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})
export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 各サービスのクライアントを明示的にエクスポート
export { authDb } from './db/auth-db'
export { projectDb } from './db/project-db'
export { financeDb } from './db/finance-db'
export { parasolDb } from './db/parasol-db'