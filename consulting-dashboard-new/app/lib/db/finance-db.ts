// 財務サービス用の独立したPrismaクライアント
import { PrismaClient as FinancePrismaClient } from '@prisma/finance-client'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var financeDb: FinancePrismaClient | undefined
}

// 財務データベース用のクライアントインスタンス
export const financeDb = global.financeDb || new FinancePrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.financeDb) {
  global.financeDb = financeDb
}