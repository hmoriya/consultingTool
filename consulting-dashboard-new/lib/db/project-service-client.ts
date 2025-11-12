/**
 * プロジェクトサービス専用Prismaクライアント
 * Project service specific Prisma client
 */

import { PrismaClient } from '@prisma/client'

// Vercel環境検出
const isProduction = process.env.NODE_ENV === 'production'

// グローバル接続管理（Hot Reload対応）
const globalForProject = globalThis as unknown as {
  projectServiceClient: PrismaClient | undefined
}

// プロジェクトサービス専用クライアント - メインのPrismaClientを使用
export const projectServiceClient = globalForProject.projectServiceClient ?? new PrismaClient({
  log: isProduction ? ['error'] : (['error', 'warn'] as const),
  errorFormat: 'pretty' as const
})

// 開発環境でのグローバル保持（Hot Reload対応）
if (!isProduction) {
  globalForProject.projectServiceClient = projectServiceClient
}

// 便利なエイリアス
export const projectDb = projectServiceClient