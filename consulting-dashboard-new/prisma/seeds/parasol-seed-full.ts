import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { createServices } from './parasol/services-seed'
import { seedProjectServiceFullParasol } from './parasol/full/project-service-full'
import { seedResourceServiceFullParasol } from './parasol/full/resource-service-full'
import { seedTimesheetServiceFullParasol } from './parasol/full/timesheet-service-full'
import { seedNotificationServiceFullParasol } from './parasol/full/notification-service-full'
import { seedKnowledgeServiceFullParasol } from './parasol/full/knowledge-service-full'
import { seedFinanceServiceFullParasol } from './parasol/full/finance-service-full'
import { seedAuthServiceFullParasol } from './parasol/full/auth-service-full'

const parasolDb = new ParasolPrismaClient()

export async function seedParasolServiceFull() {
  console.log('🌱 Seeding Parasol Service (Full Specification Compliant)...')

  try {
    // 既存データをクリア
    console.log('  Clearing existing data...')
    await parasolDb.testDefinition.deleteMany({})
    await parasolDb.pageDefinition.deleteMany({})
    await parasolDb.useCase.deleteMany({})
    await parasolDb.businessOperation.deleteMany({})
    await parasolDb.businessCapability.deleteMany({})
    await parasolDb.domainService.deleteMany({})
    await parasolDb.valueObject.deleteMany({})
    await parasolDb.domainEntity.deleteMany({})
    await parasolDb.impactAnalysis.deleteMany({})
    await parasolDb.service.deleteMany({})

    // 全サービス定義を作成
    const services = await createServices()
    console.log(`  Created ${services.length} services`)

    // 各サービスの完全なパラソルデータを投入
    let fullSpecCount = 0
    
    // 1. Project Service
    const projectService = services.find(s => s.name === 'project-success-support')
    if (projectService) {
      await seedProjectServiceFullParasol(projectService)
      console.log('  ✅ Project service parasol data seeded (full spec)')
      fullSpecCount++
    }
    
    // 2. Resource Service
    const resourceService = services.find(s => s.name === 'talent-optimization')
    if (resourceService) {
      await seedResourceServiceFullParasol(resourceService)
      console.log('  ✅ Resource service parasol data seeded (full spec)')
      fullSpecCount++
    }
    
    // 3. Timesheet Service
    const timesheetService = services.find(s => s.name === 'productivity-visualization')
    if (timesheetService) {
      await seedTimesheetServiceFullParasol(timesheetService)
      console.log('  ✅ Timesheet service parasol data seeded (full spec)')
      fullSpecCount++
    }
    
    // 4. Notification Service
    const notificationService = services.find(s => s.name === 'collaboration-facilitation')
    if (notificationService) {
      await seedNotificationServiceFullParasol(notificationService)
      console.log('  ✅ Notification service parasol data seeded (full spec)')
      fullSpecCount++
    }
    
    // 5. Knowledge Service
    const knowledgeService = services.find(s => s.name === 'knowledge-cocreation')
    if (knowledgeService) {
      await seedKnowledgeServiceFullParasol(knowledgeService)
      console.log('  ✅ Knowledge service parasol data seeded (full spec)')
      fullSpecCount++
    }
    
    // 6. Finance Service
    const financeService = services.find(s => s.name === 'revenue-optimization')
    if (financeService) {
      await seedFinanceServiceFullParasol(financeService)
      console.log('  ✅ Finance service parasol data seeded (full spec)')
      fullSpecCount++
    }

    // 7. Auth Service
    const authService = services.find(s => s.name === 'secure-access')
    if (authService) {
      await seedAuthServiceFullParasol(authService)
      console.log('  ✅ Auth service parasol data seeded (full spec)')
      fullSpecCount++
    }

    console.log('\n✅ Parasol Service seeded successfully (Full Specification)!')
    console.log(`\n📊 Seed Summary:`)
    console.log(`  Total Services: ${services.length}`)
    console.log(`  Full Spec Services: ${fullSpecCount}`)
    console.log(`  - ビジネスケーパビリティ: 完全仕様準拠`)
    console.log(`  - ビジネスオペレーション: 完全仕様準拠（6-7ステップ、6-8状態定義）`)
    console.log(`  - パラソルドメインモデル: 定義済み`)
    console.log(`  - KPI: 測定可能な指標設定済み（3-5指標）`)
    
    console.log('\n📋 Services:')
    const fullSpecServices = ['project-success-support', 'talent-optimization', 'productivity-visualization', 
                               'collaboration-facilitation', 'knowledge-cocreation', 'revenue-optimization', 'secure-access']
    services.forEach(s => {
      const status = fullSpecServices.includes(s.name) ? '✅ Full Spec' : '⚠️ Basic'
      console.log(`  ${status} ${s.displayName} (${s.name})`)
    })

  } catch (error) {
    console.error('❌ Error seeding Parasol Service:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  seedParasolServiceFull()
    .then(() => {
      console.log('\nParasol seed (full specification) completed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('Error seeding parasol data:', e)
      process.exit(1)
    })
}