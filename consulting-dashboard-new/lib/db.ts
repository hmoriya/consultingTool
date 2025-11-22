/**
 * サービス別Prismaクライアント統合エクスポート
 * Vercel環境対応とマイクロサービス設計準拠
 */

export {
  authDb,
  projectDb,
  resourceDb,
  timesheetDb,
  notificationDb,
  financeDb,
  knowledgeDb,
  parasolDb,
  connectAllDatabases,
  disconnectAllDatabases,
  checkDatabaseHealth,
  prismaClients,
  vercelInfo
} from './prisma-vercel'