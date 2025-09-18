import { seedCore } from './seeds/core-seed'
import { seedProjects } from './seeds/project-seed'
import { seedResources } from './seeds/resource-seed'
import { seedTimesheets } from './seeds/timesheet-seed'
import { seedNotifications } from './seeds/notification-seed'

async function main() {
  console.log('🚀 Starting database seeding...')
  console.log('================================')
  
  try {
    // 1. コアサービス（ユーザー、組織、ロール）
    const coreData = await seedCore()
    
    // 2. プロジェクトサービス（ユーザー情報と組織情報を渡す）
    await seedProjects(coreData.users, coreData.organizations)
    
    // 3. リソースサービス
    await seedResources()
    
    // 4. タイムシートサービス
    await seedTimesheets()
    
    // 5. 通知サービス
    await seedNotifications()
    
    console.log('================================')
    console.log('✅ All services seeded successfully!')
    console.log('')
    console.log('📧 Test users:')
    console.log('  - exec@example.com / password123 (Executive)')
    console.log('  - pm@example.com / password123 (PM)')
    console.log('  - consultant@example.com / password123 (Consultant)')
    console.log('  - client@example.com / password123 (Client)')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })