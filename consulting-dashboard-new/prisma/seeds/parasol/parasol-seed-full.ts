import { seedProjectServiceFullParasol } from './full/project-service-full'
import { seedResourceServiceFullParasol } from './full/resource-service-full'
import { seedTimesheetServiceFullParasol } from './full/timesheet-service-full'
import { seedNotificationServiceFullParasol } from './full/notification-service-full'
import { seedKnowledgeServiceFullParasol } from './full/knowledge-service-full'
import { seedFinanceServiceFullParasol } from './full/finance-service-full'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

async function main() {
  console.log('Starting Parasol full seed...')
  
  // 既存データをクリア
  console.log('Clearing existing data...')
  await parasolDb.testDefinition.deleteMany()
  await parasolDb.pageDefinition.deleteMany()
  await parasolDb.useCase.deleteMany()
  await parasolDb.businessOperation.deleteMany()
  await parasolDb.businessCapability.deleteMany()
  await parasolDb.service.deleteMany()
  
  try {
    // サービスを先に作成
    const projectService = await parasolDb.service.upsert({
      where: { name: 'ProjectManagementService' },
      update: {},
      create: {
        name: 'ProjectManagementService',
        displayName: 'プロジェクト管理サービス',
        description: 'プロジェクトの計画、実行、監視、完了までを管理',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    const resourceService = await parasolDb.service.upsert({
      where: { name: 'ResourceManagementService' },
      update: {},
      create: {
        name: 'ResourceManagementService',
        displayName: 'リソース管理サービス',
        description: 'チーム、スキル、人材配置を管理',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    const timesheetService = await parasolDb.service.upsert({
      where: { name: 'TimesheetService' },
      update: {},
      create: {
        name: 'TimesheetService',
        displayName: 'タイムシート管理サービス',
        description: '工数管理、承認、稼働率分析を実施',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    const notificationService = await parasolDb.service.upsert({
      where: { name: 'NotificationService' },
      update: {},
      create: {
        name: 'NotificationService',
        displayName: '通知・コミュニケーションサービス',
        description: '通知、メッセージ、コミュニケーションを管理',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    const knowledgeService = await parasolDb.service.upsert({
      where: { name: 'KnowledgeManagementService' },
      update: {},
      create: {
        name: 'KnowledgeManagementService',
        displayName: '知識管理サービス',
        description: 'ナレッジ記事、FAQ、ベストプラクティスを管理',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    const financeService = await parasolDb.service.upsert({
      where: { name: 'FinanceService' },
      update: {},
      create: {
        name: 'FinanceService',
        displayName: '財務管理サービス',
        description: '収益、コスト、予算、請求を管理',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    
    // 1. プロジェクト管理サービス
    console.log('\n=== Seeding Project Service ===')
    await seedProjectServiceFullParasol(projectService)
    
    // 2. リソース管理サービス
    console.log('\n=== Seeding Resource Service ===')
    await seedResourceServiceFullParasol(resourceService)
    
    // 3. タイムシート管理サービス
    console.log('\n=== Seeding Timesheet Service ===')
    await seedTimesheetServiceFullParasol(timesheetService)
    
    // 4. 通知サービス
    console.log('\n=== Seeding Notification Service ===')
    await seedNotificationServiceFullParasol(notificationService)
    
    // 5. 知識管理サービス
    console.log('\n=== Seeding Knowledge Service ===')
    await seedKnowledgeServiceFullParasol(knowledgeService)
    
    // 6. 財務管理サービス
    console.log('\n=== Seeding Finance Service ===')
    await seedFinanceServiceFullParasol(financeService)
    
    // 統計情報を表示
    console.log('\n=== Seeding Summary ===')
    
    const serviceCount = await parasolDb.service.count()
    const capabilityCount = await parasolDb.businessCapability.count()
    const operationCount = await parasolDb.businessOperation.count()
    
    console.log(`Services: ${serviceCount}`)
    console.log(`Business Capabilities: ${capabilityCount}`)
    console.log(`Business Operations: ${operationCount}`)
    
    // サービスごとの詳細を表示
    const services = await parasolDb.service.findMany({
      include: {
        capabilities: {
          include: {
            businessOperations: true
          }
        }
      }
    })
    
    for (const service of services) {
      console.log(`\n${service.displayName}:`)
      for (const capability of service.capabilities) {
        console.log(`  - ${capability.displayName}: ${capability.businessOperations.length} operations`)
      }
    }
    
    console.log('\n✅ Parasol full seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding Parasol data:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })