// リソースサービス用の独立したPrismaクライアント
import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'
import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var resourceDb: ResourcePrismaClient | undefined
}

// リソースデータベースのパスを決定
function getResourceDbPath() {
  if (process.env.RESOURCE_DATABASE_URL) {
    // 環境変数が相対パスの場合、絶対パスに変換
    if (process.env.RESOURCE_DATABASE_URL.startsWith('file:./')) {
      const relativePath = process.env.RESOURCE_DATABASE_URL.replace('file:./', '')
      return `file:${path.resolve(process.cwd(), relativePath)}`
    }
    return process.env.RESOURCE_DATABASE_URL
  }
  return `file:${path.resolve(process.cwd(), 'prisma/resource-service/data/resource.db')}`
}

const resourceDbPath = getResourceDbPath()
console.log('Resource DB Path (updated):', resourceDbPath)

// リソースデータベース用のクライアントインスタンス
export const resourceDb = global.resourceDb || new ResourcePrismaClient({
  datasources: {
    db: {
      url: resourceDbPath
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.resourceDb) {
  global.resourceDb = resourceDb
}