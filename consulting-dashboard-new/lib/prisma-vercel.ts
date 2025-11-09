/**
 * Vercel環境対応Prismaクライアント統合管理
 */

import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'
import { PrismaClient as FinancePrismaClient } from '@prisma/finance-client'
import { PrismaClient as KnowledgePrismaClient } from '../prisma/knowledge-service/generated/client'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

// Vercel環境検出
const isVercel = !!process.env.VERCEL
const isProduction = process.env.NODE_ENV === 'production'

// Prismaクライアント設定
const prismaConfig = {
  log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty' as const,
  datasources: {
    db: {
      url: undefined // 環境変数から自動取得
    }
  }
}

// グローバル接続管理（Vercel Hot Reload対応）
const globalForPrisma = globalThis as unknown as {
  authDb: AuthPrismaClient | undefined
  projectDb: ProjectPrismaClient | undefined
  resourceDb: ResourcePrismaClient | undefined
  timesheetDb: TimesheetPrismaClient | undefined
  notificationDb: NotificationPrismaClient | undefined
  financeDb: FinancePrismaClient | undefined
  knowledgeDb: KnowledgePrismaClient | undefined
  parasolDb: ParasolPrismaClient | undefined
}

// 認証サービス
export const authDb = globalForPrisma.authDb ?? new AuthPrismaClient(prismaConfig)

// プロジェクトサービス
export const projectDb = globalForPrisma.projectDb ?? new ProjectPrismaClient(prismaConfig)

// リソースサービス
export const resourceDb = globalForPrisma.resourceDb ?? new ResourcePrismaClient(prismaConfig)

// タイムシートサービス
export const timesheetDb = globalForPrisma.timesheetDb ?? new TimesheetPrismaClient(prismaConfig)

// 通知サービス
export const notificationDb = globalForPrisma.notificationDb ?? new NotificationPrismaClient(prismaConfig)

// 財務サービス
export const financeDb = globalForPrisma.financeDb ?? new FinancePrismaClient(prismaConfig)

// ナレッジサービス
export const knowledgeDb = globalForPrisma.knowledgeDb ?? new KnowledgePrismaClient(prismaConfig)

// パラソルサービス
export const parasolDb = globalForPrisma.parasolDb ?? new ParasolPrismaClient(prismaConfig)

// 開発環境でのグローバル保持（Hot Reload対応）
if (!isProduction) {
  globalForPrisma.authDb = authDb
  globalForPrisma.projectDb = projectDb
  globalForPrisma.resourceDb = resourceDb
  globalForPrisma.timesheetDb = timesheetDb
  globalForPrisma.notificationDb = notificationDb
  globalForPrisma.financeDb = financeDb
  globalForPrisma.knowledgeDb = knowledgeDb
  globalForPrisma.parasolDb = parasolDb
}

// Vercel環境での接続最適化
export async function connectAllDatabases() {
  const connections = [
    authDb.$connect(),
    projectDb.$connect(),
    resourceDb.$connect(),
    timesheetDb.$connect(),
    notificationDb.$connect(),
    financeDb.$connect(),
    knowledgeDb.$connect(),
    parasolDb.$connect()
  ]

  try {
    await Promise.all(connections)
    console.log('✅ All databases connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

// グレースフルシャットダウン
export async function disconnectAllDatabases() {
  const disconnections = [
    authDb.$disconnect(),
    projectDb.$disconnect(),
    resourceDb.$disconnect(),
    timesheetDb.$disconnect(),
    notificationDb.$disconnect(),
    financeDb.$disconnect(),
    knowledgeDb.$disconnect(),
    parasolDb.$disconnect()
  ]

  try {
    await Promise.all(disconnections)
    console.log('✅ All databases disconnected successfully')
  } catch (error) {
    console.error('❌ Database disconnection failed:', error)
  }
}

// Vercel Function用ヘルスチェック
export async function checkDatabaseHealth() {
  const checks = [
    { name: 'auth', client: authDb },
    { name: 'project', client: projectDb },
    { name: 'resource', client: resourceDb },
    { name: 'timesheet', client: timesheetDb },
    { name: 'notification', client: notificationDb },
    { name: 'finance', client: financeDb },
    { name: 'knowledge', client: knowledgeDb },
    { name: 'parasol', client: parasolDb }
  ]

  const results = await Promise.allSettled(
    checks.map(async ({ name, client }) => {
      const start = Date.now()
      await client.$queryRaw`SELECT 1`
      const duration = Date.now() - start
      return { name, status: 'healthy', duration }
    })
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return {
        name: checks[index].name,
        status: 'unhealthy',
        error: result.reason?.message || 'Unknown error'
      }
    }
  })
}

// 使用例エクスポート
export const prismaClients = {
  auth: authDb,
  project: projectDb,
  resource: resourceDb,
  timesheet: timesheetDb,
  notification: notificationDb,
  finance: financeDb,
  knowledge: knowledgeDb,
  parasol: parasolDb
}

// Vercel環境情報
export const vercelInfo = {
  isVercel,
  isProduction,
  region: process.env.VERCEL_REGION || 'unknown',
  env: process.env.VERCEL_ENV || 'development'
}