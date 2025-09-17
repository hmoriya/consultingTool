// タイムシートサービス用の独立したPrismaクライアント
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import path from 'path'

// グローバル変数として定義（開発環境でのホットリロード対応）
declare global {
  var timesheetDb: TimesheetPrismaClient | undefined
}

// タイムシートデータベースのパスを決定
function getTimesheetDbPath() {
  if (process.env.TIMESHEET_DATABASE_URL) {
    // 環境変数が相対パスの場合、絶対パスに変換
    if (process.env.TIMESHEET_DATABASE_URL.startsWith('file:./')) {
      const relativePath = process.env.TIMESHEET_DATABASE_URL.replace('file:./', '')
      return `file:${path.resolve(process.cwd(), relativePath)}`
    }
    return process.env.TIMESHEET_DATABASE_URL
  }
  return `file:${path.resolve(process.cwd(), 'prisma/timesheet-service/data/timesheet.db')}`
}

const timesheetDbPath = getTimesheetDbPath()
console.log('Timesheet DB Path:', timesheetDbPath)

// タイムシートデータベース用のクライアントインスタンス
export const timesheetDb = global.timesheetDb || new TimesheetPrismaClient({
  datasources: {
    db: {
      url: timesheetDbPath
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV === 'development' && !global.timesheetDb) {
  global.timesheetDb = timesheetDb
}