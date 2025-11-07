/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@prisma/client'
import { PrismaClient as AuthPrismaClient } from '@prisma/auth-client'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PrismaClient as ResourcePrismaClient } from '@prisma/resource-client'
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import { PrismaClient as NotificationPrismaClient } from '@prisma/notification-client'
import { seedCore } from './seeds/core-seed'
import { seedProjects } from './seeds/project-seed'
import { seedResources } from './seeds/resource-seed'
import { seedTimesheets } from './seeds/timesheet-seed'
import { seedNotifications } from './seeds/notification-seed'

const db = new PrismaClient()
const authDb = new AuthPrismaClient()
const projectDb = new ProjectPrismaClient()
const resourceDb = new ResourcePrismaClient()
const timesheetDb = new TimesheetPrismaClient()
const notificationDb = new NotificationPrismaClient()

async function resetAndSeed() {
  console.log('🧹 Resetting all databases...')
  console.log('================================')
  
  try {
    // 1. 全データを削除（逆順で依存関係を考慮）
    console.log('Clearing Notification Service...')
    await notificationDb.notification.deleteMany({})
    
    console.log('Clearing Timesheet Service...')
    await timesheetDb.approvalHistory.deleteMany({})
    await timesheetDb.timeEntry.deleteMany({})
    await timesheetDb.timesheet.deleteMany({})
    await timesheetDb.workingHours.deleteMany({})
    await timesheetDb.holiday.deleteMany({})
    
    console.log('Clearing Resource Service...')
    await resourceDb.userSkill.deleteMany({})
    await resourceDb.skill.deleteMany({})
    await resourceDb.skillCategory.deleteMany({})
    await resourceDb.team.deleteMany({})
    
    console.log('Clearing Project Service...')
    await projectDb.deliverable.deleteMany({})
    await projectDb.issue.deleteMany({})
    await projectDb.risk.deleteMany({})
    await projectDb.task.deleteMany({})
    await projectDb.milestone.deleteMany({})
    await projectDb.projectMember.deleteMany({})
    await projectDb.project.deleteMany({})
    
    console.log('Clearing Main Database...')
    // Main database is now auth service database
    // Skip clearing as it will be cleared in the Auth Service section below
    
    console.log('Clearing Auth Service...')
    await authDb.session.deleteMany({})
    await authDb.user.deleteMany({})
    await authDb.role.deleteMany({})
    await authDb.organization.deleteMany({})
    
    console.log('✅ All data cleared successfully')
    console.log('')
    
    // 2. 新規データを投入
    console.log('🚀 Starting fresh database seeding...')
    console.log('================================')
    
    // コアサービス（ユーザー、組織、ロール）
    const coreData = await seedCore()
    
    // プロジェクトサービス
    const projects = await seedProjects(coreData.users, coreData.organizations)
    
    // ユーザー情報を整理
    const usersWithDetails = {
      pmUser: coreData.users.find((u: any) => u.email === 'pm@example.com'),
      consultantUser: coreData.users.find((u: any) => u.email === 'consultant@example.com'),
      execUser: coreData.users.find((u: any) => u.email === 'exec@example.com'),
      allUsers: coreData.users
    }
    
    // リソースサービス
    await seedResources(usersWithDetails)
    
    // タイムシートサービス
    await seedTimesheets(usersWithDetails, projects)
    
    // 通知サービス
    await seedNotifications(usersWithDetails, projects)
    
    console.log('================================')
    console.log('✅ All services seeded successfully!')
    console.log('')
    console.log('📧 Test users:')
    console.log('  - exec@example.com / password123 (Executive)')
    console.log('  - pm@example.com / password123 (PM)')
    console.log('  - consultant@example.com / password123 (Consultant)')
    console.log('  - client@example.com / password123 (Client)')
    console.log('')
    console.log('🏢 Client organizations:')
    console.log('  - 株式会社テックイノベーション')
    console.log('  - グローバル製造株式会社')
    console.log('  - 金融ソリューションズ株式会社')
    console.log('  - ヘルスケアイノベーション株式会社')
    console.log('  - リテールチェーン株式会社')
    console.log('  - エネルギー開発株式会社')
    
  } catch (_error) {
    console.error('❌ Reset and seeding failed:', error)
    throw error
  } finally {
    await db.$disconnect()
    await authDb.$disconnect()
    await projectDb.$disconnect()
    await resourceDb.$disconnect()
    await timesheetDb.$disconnect()
    await notificationDb.$disconnect()
  }
}

resetAndSeed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })