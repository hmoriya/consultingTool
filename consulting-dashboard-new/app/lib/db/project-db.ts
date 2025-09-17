// プロジェクトサービス用の独立したPrismaクライアント
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var projectDb: ProjectPrismaClient | undefined
}

// プロジェクトデータベースのパスを決定
function getProjectDbPath() {
  if (process.env.PROJECT_DATABASE_URL) {
    // 環境変数が相対パスの場合、絶対パスに変換
    if (process.env.PROJECT_DATABASE_URL.startsWith('file:./')) {
      const relativePath = process.env.PROJECT_DATABASE_URL.replace('file:./', '')
      return `file:${path.resolve(process.cwd(), relativePath)}`
    }
    return process.env.PROJECT_DATABASE_URL
  }
  return `file:${path.resolve(process.cwd(), 'prisma/project-service/data/project.db')}`
}

const projectDbPath = getProjectDbPath()
console.log('Project DB Path:', projectDbPath)

// プロジェクトデータベース用のクライアントインスタンス
export const projectDb = global.projectDb || new ProjectPrismaClient({
  datasources: {
    db: {
      url: projectDbPath
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.projectDb) {
  global.projectDb = projectDb
}