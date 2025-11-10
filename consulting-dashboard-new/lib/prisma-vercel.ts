/**
 * Vercel環境対応Prismaクライアント統合管理
 */

// Vercel環境対応統合Prismaクライアント
// 注意: 各サービスは環境変数で異なるデータベースを参照
import { PrismaClient } from '@prisma/client'

// Vercel環境検出
const isVercel = !!process.env.VERCEL
const isProduction = process.env.NODE_ENV === 'production'

// 基本Prisma設定
const basePrismaConfig = {
  log: isProduction ? ['error'] : ['error', 'warn'] as any,
  errorFormat: 'pretty' as const
}

// グローバル接続管理（Vercel Hot Reload対応）
const globalForPrisma = globalThis as unknown as {
  authDb: PrismaClient | undefined
  projectDb: PrismaClient | undefined
  resourceDb: PrismaClient | undefined
  timesheetDb: PrismaClient | undefined
  notificationDb: PrismaClient | undefined
  financeDb: PrismaClient | undefined
  knowledgeDb: PrismaClient | undefined
  parasolDb: PrismaClient | undefined
}

// 認証サービス - 環境変数: AUTH_DATABASE_URL
export const authDb = globalForPrisma.authDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL || 'file:./prisma/auth-service/data/auth.db'
    }
  }
})

// プロジェクトサービス - 環境変数: PROJECT_DATABASE_URL
export const projectDb = globalForPrisma.projectDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.PROJECT_DATABASE_URL || 'file:./prisma/project-service/data/project.db'
    }
  }
})

// リソースサービス - 環境変数: RESOURCE_DATABASE_URL
export const resourceDb = globalForPrisma.resourceDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.RESOURCE_DATABASE_URL || 'file:./prisma/resource-service/data/resource.db'
    }
  }
})

// タイムシートサービス - 環境変数: TIMESHEET_DATABASE_URL
export const timesheetDb = globalForPrisma.timesheetDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.TIMESHEET_DATABASE_URL || 'file:./prisma/timesheet-service/data/timesheet.db'
    }
  }
})

// 通知サービス - 環境変数: NOTIFICATION_DATABASE_URL
export const notificationDb = globalForPrisma.notificationDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.NOTIFICATION_DATABASE_URL || 'file:./prisma/notification-service/data/notification.db'
    }
  }
})

// 財務サービス - 環境変数: FINANCE_DATABASE_URL
export const financeDb = globalForPrisma.financeDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.FINANCE_DATABASE_URL || 'file:./prisma/finance-service/data/finance.db'
    }
  }
})

// ナレッジサービス - 環境変数: KNOWLEDGE_DATABASE_URL
export const knowledgeDb = globalForPrisma.knowledgeDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.KNOWLEDGE_DATABASE_URL || 'file:./prisma/knowledge-service/data/knowledge.db'
    }
  }
})

// パラソルサービス - 環境変数: PARASOL_DATABASE_URL
export const parasolDb = globalForPrisma.parasolDb ?? new PrismaClient({
  ...basePrismaConfig,
  datasources: {
    db: {
      url: process.env.PARASOL_DATABASE_URL || 'file:./prisma/parasol-service/data/parasol.db'
    }
  }
})

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