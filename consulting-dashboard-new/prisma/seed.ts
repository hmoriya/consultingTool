import { seedCore } from './seeds/core-seed'
import { seedProjects } from './seeds/project-seed'
import { seedResources } from './seeds/resource-seed'
import { seedTimesheets } from './seeds/timesheet-seed'
import { seedNotifications } from './seeds/notification-seed'
import { seedKnowledge } from './seeds/knowledge-seed'
import { seedParasolFull } from './seeds/parasol-seed-full'

// 各サービスの実行結果を追跡
interface SeedResult {
  service: string
  success: boolean
  error?: Error
  data?: any
}

async function seedService<T>(
  serviceName: string, 
  seedFunction: () => Promise<T>,
  required = true
): Promise<SeedResult> {
  try {
    console.log(`🌱 Starting ${serviceName} seeding...`)
    const data = await seedFunction()
    console.log(`✅ ${serviceName} seeded successfully`)
    return { service: serviceName, success: true, data }
  } catch (error) {
    const errorMessage = `❌ Failed to seed ${serviceName}: ${error instanceof Error ? error.message : String(error)}`
    console.error(errorMessage)
    
    if (required) {
      console.error(`💥 ${serviceName} is required for other services. Stopping execution.`)
      throw new Error(`Required service ${serviceName} failed: ${error instanceof Error ? error.message : String(error)}`)
    } else {
      console.warn(`⚠️  ${serviceName} failed but is not required. Continuing with other services.`)
      return { service: serviceName, success: false, error: error instanceof Error ? error : new Error(String(error)) }
    }
  }
}

async function main() {
  console.log('🚀 Starting database seeding...')
  console.log('================================')
  
  const results: SeedResult[] = []
  let coreData: any = null
  let projectData: any = null
  let usersWithDetails: any = null
  
  try {
    // 1. コアサービス（必須）
    const coreResult = await seedService('Core Service', () => seedCore(), true)
    results.push(coreResult)
    coreData = coreResult.data
    
    // ユーザー情報の準備
    if (coreData?.users) {
      usersWithDetails = {
        pmUser: coreData.users.find((u: any) => u.email === 'pm@example.com'),
        consultantUser: coreData.users.find((u: any) => u.email === 'consultant@example.com'),
        execUser: coreData.users.find((u: any) => u.email === 'exec@example.com'),
        allUsers: coreData.users
      }
      
      // 重要なユーザーの存在確認
      if (!usersWithDetails.pmUser) {
        console.warn('⚠️  PM user not found. Some features may not work correctly.')
      }
      if (!usersWithDetails.consultantUser) {
        console.warn('⚠️  Consultant user not found. Some features may not work correctly.')
      }
    }
    
    // 2. プロジェクトサービス（必須）
    const projectResult = await seedService(
      'Project Service', 
      () => seedProjects(coreData?.users, coreData?.organizations), 
      true
    )
    results.push(projectResult)
    projectData = projectResult.data
    
    // 3. リソースサービス（オプショナル）
    const resourceResult = await seedService(
      'Resource Service',
      () => seedResources(usersWithDetails),
      false
    )
    results.push(resourceResult)
    
    // 4. タイムシートサービス（オプショナル）
    const timesheetResult = await seedService(
      'Timesheet Service',
      () => seedTimesheets(usersWithDetails, projectData),
      false
    )
    results.push(timesheetResult)
    
    // 5. 通知サービス（オプショナル）
    const notificationResult = await seedService(
      'Notification Service',
      () => seedNotifications(usersWithDetails, projectData),
      false
    )
    results.push(notificationResult)
    
    // 6. ナレッジサービス（オプショナル）
    const knowledgeResult = await seedService(
      'Knowledge Service',
      () => seedKnowledge(usersWithDetails),
      false
    )
    results.push(knowledgeResult)
    
    // 7. パラソルサービス（オプショナル）
    const parasolResult = await seedService(
      'Parasol Service',
      () => seedParasolFull(),
      false
    )
    results.push(parasolResult)
    
  } catch (error) {
    console.error('\n💥 Critical error during seeding process:')
    console.error(error instanceof Error ? error.message : String(error))
    
    // 部分的な成功状況を報告
    const successfulServices = results.filter(r => r.success)
    const failedServices = results.filter(r => !r.success)
    
    if (successfulServices.length > 0) {
      console.log(`\n✅ Successfully seeded services: ${successfulServices.map(s => s.service).join(', ')}`)
    }
    if (failedServices.length > 0) {
      console.log(`\n❌ Failed services: ${failedServices.map(s => s.service).join(', ')}`)
    }
    
    throw error
  }
  
  // 最終結果レポート
  console.log('\n================================')
  
  const successfulServices = results.filter(r => r.success)
  const failedServices = results.filter(r => !r.success)
  
  if (failedServices.length === 0) {
    console.log('✅ All services seeded successfully!')
  } else {
    console.log(`✅ ${successfulServices.length}/${results.length} services seeded successfully`)
    console.log(`⚠️  ${failedServices.length} services failed (non-critical):`)
    failedServices.forEach(service => {
      console.log(`   - ${service.service}: ${service.error?.message || 'Unknown error'}`)
    })
  }
  
  console.log('')
  console.log('📧 Test users:')
  console.log('  - exec@example.com / password123 (Executive)')
  console.log('  - pm@example.com / password123 (PM)')
  console.log('  - consultant@example.com / password123 (Consultant)')
  console.log('  - client@example.com / password123 (Client)')
  
  // 警告メッセージ
  if (failedServices.length > 0) {
    console.log('')
    console.log('⚠️  Some non-critical services failed. The application should still work,')
    console.log('   but some features may be limited. Check the error messages above.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })