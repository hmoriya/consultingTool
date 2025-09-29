import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'
import { PrismaClient as KnowledgePrismaClient } from '../../knowledge-service/generated/client'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

// 各サービスのPrismaクライアントインスタンス
const authDb = new AuthPrismaClient()
const projectDb = new ProjectPrismaClient()
const resourceDb = new ResourcePrismaClient()
const timesheetDb = new TimesheetPrismaClient()
const notificationDb = new NotificationPrismaClient()
const knowledgeDb = new KnowledgePrismaClient()
const parasolDb = new ParasolPrismaClient()

/**
 * 認証サービスのデータをクリア
 */
export async function clearAuthData() {
  console.log('🧹 Clearing Auth Service data...')
  
  // 依存関係を考慮した削除順序
  await authDb.organizationContact.deleteMany()
  await authDb.user.deleteMany()
  await authDb.role.deleteMany()
  await authDb.organization.deleteMany()
  
  console.log('✅ Auth Service data cleared')
}

/**
 * プロジェクトサービスのデータをクリア
 */
export async function clearProjectData() {
  console.log('🧹 Clearing Project Service data...')
  
  // 依存関係を考慮した削除順序
  await projectDb.deliverableApproval.deleteMany()
  await projectDb.deliverable.deleteMany()
  await projectDb.task.deleteMany()
  await projectDb.milestone.deleteMany()
  await projectDb.riskMitigation.deleteMany()
  await projectDb.risk.deleteMany()
  await projectDb.projectMember.deleteMany()
  await projectDb.project.deleteMany()
  
  console.log('✅ Project Service data cleared')
}

/**
 * リソースサービスのデータをクリア
 */
export async function clearResourceData() {
  console.log('🧹 Clearing Resource Service data...')
  
  await resourceDb.userSkill.deleteMany()
  await resourceDb.teamMember.deleteMany()
  await resourceDb.skill.deleteMany()
  await resourceDb.team.deleteMany()
  
  console.log('✅ Resource Service data cleared')
}

/**
 * タイムシートサービスのデータをクリア
 */
export async function clearTimesheetData() {
  console.log('🧹 Clearing Timesheet Service data...')
  
  await timesheetDb.timesheetApproval.deleteMany()
  await timesheetDb.timesheetEntry.deleteMany()
  await timesheetDb.timesheet.deleteMany()
  
  console.log('✅ Timesheet Service data cleared')
}

/**
 * 通知サービスのデータをクリア
 */
export async function clearNotificationData() {
  console.log('🧹 Clearing Notification Service data...')
  
  await notificationDb.message.deleteMany()
  await notificationDb.notification.deleteMany()
  
  console.log('✅ Notification Service data cleared')
}

/**
 * ナレッジサービスのデータをクリア
 */
export async function clearKnowledgeData() {
  console.log('🧹 Clearing Knowledge Service data...')
  
  await knowledgeDb.knowledgeArticle.deleteMany()
  await knowledgeDb.category.deleteMany()
  await knowledgeDb.tag.deleteMany()
  
  console.log('✅ Knowledge Service data cleared')
}

/**
 * パラソルサービスのデータをクリア
 */
export async function clearParasolData() {
  console.log('🧹 Clearing Parasol Service data...')
  
  // 依存関係を考慮した削除順序
  await parasolDb.testDefinition.deleteMany()
  await parasolDb.pageDefinition.deleteMany()
  await parasolDb.useCase.deleteMany()
  await parasolDb.businessOperation.deleteMany()
  await parasolDb.businessCapability.deleteMany()
  await parasolDb.service.deleteMany()
  
  console.log('✅ Parasol Service data cleared')
}

/**
 * すべてのサービスのデータをクリア
 */
export async function clearAllData() {
  console.log('🧹 Clearing all service data...')
  console.log('================================')
  
  const disconnectList: Promise<void>[] = []
  
  try {
    // 依存関係の逆順でクリア
    try {
      await clearParasolData()
      disconnectList.push(parasolDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Parasol data:', e)
    }
    
    try {
      await clearKnowledgeData()
      disconnectList.push(knowledgeDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Knowledge data:', e)
    }
    
    try {
      await clearNotificationData()
      disconnectList.push(notificationDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Notification data:', e)
    }
    
    try {
      await clearTimesheetData()
      disconnectList.push(timesheetDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Timesheet data:', e)
    }
    
    try {
      await clearResourceData()
      disconnectList.push(resourceDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Resource data:', e)
    }
    
    try {
      await clearProjectData()
      disconnectList.push(projectDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Project data:', e)
    }
    
    try {
      await clearAuthData()
      disconnectList.push(authDb.$disconnect())
    } catch (e) {
      console.warn('⚠️  Could not clear Auth data:', e)
    }
    
    console.log('================================')
    console.log('✅ Data clearing process completed')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
    throw error
  } finally {
    // 接続をクローズ
    await Promise.all(disconnectList)
  }
}

/**
 * 特定のサービスのデータをクリア
 */
export async function clearServiceData(serviceName: string) {
  switch (serviceName.toLowerCase()) {
    case 'auth':
    case 'core':
      return clearAuthData()
    case 'project':
      return clearProjectData()
    case 'resource':
      return clearResourceData()
    case 'timesheet':
      return clearTimesheetData()
    case 'notification':
      return clearNotificationData()
    case 'knowledge':
      return clearKnowledgeData()
    case 'parasol':
      return clearParasolData()
    default:
      throw new Error(`Unknown service: ${serviceName}`)
  }
}

// CLIから直接実行可能
if (require.main === module) {
  const serviceName = process.argv[2]
  
  if (serviceName && serviceName !== 'all') {
    clearServiceData(serviceName)
      .then(() => console.log(`${serviceName} data cleared`))
      .catch(e => {
        console.error(`Error clearing ${serviceName} data:`, e)
        process.exit(1)
      })
  } else {
    clearAllData()
      .then(() => console.log('All data cleared'))
      .catch(e => {
        console.error('Error clearing data:', e)
        process.exit(1)
      })
  }
}