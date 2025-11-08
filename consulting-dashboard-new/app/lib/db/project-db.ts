// プロジェクトサービス用の独立したPrismaクライアント
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
// import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var projectDb: ProjectPrismaClient | undefined
}

// プロジェクトデータベース用のクライアントインスタンス
// 環境変数から直接URLを取得（Prismaのデフォルト動作と一致させる）
export const projectDb = global.projectDb || new ProjectPrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.projectDb) {
  global.projectDb = projectDb
}