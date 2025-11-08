// 認証サービス用の独立したPrismaクライアント
import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
// import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var authDb: AuthPrismaClient | undefined
}

// 認証データベース用のクライアントインスタンス
// 環境変数から直接URLを取得（Prismaのデフォルト動作と一致させる）
export const authDb = global.authDb || new AuthPrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.authDb) {
  global.authDb = authDb
}