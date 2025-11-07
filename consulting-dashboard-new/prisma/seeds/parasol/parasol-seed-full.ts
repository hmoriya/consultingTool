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
    // 1. プロジェクト成功支援サービス（旧：プロジェクト管理サービス）
    console.log('\n=== Seeding Project Success Support Service ===')
    const projectService = await parasolDb.service.create({
      data: {
        name: 'project-success-support',
        displayName: 'プロジェクト成功支援サービス',
        description: 'プロジェクトを成功に導くための計画策定、実行支援、リスク管理、成果創出を統合的にサポート',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    await seedProjectServiceFullParasol(projectService)

    // 2. タレント最適化サービス（旧：リソース管理サービス）
    console.log('\n=== Seeding Talent Optimization Service ===')
    const resourceService = await parasolDb.service.create({
      data: {
        name: 'talent-optimization',
        displayName: 'タレント最適化サービス',
        description: '人材の能力を最大化し、適材適所の配置と成長機会を提供',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    await seedResourceServiceFullParasol(resourceService)

    // 3. 生産性可視化サービス（旧：タイムシート管理サービス）
    console.log('\n=== Seeding Productivity Visualization Service ===')
    const timesheetService = await parasolDb.service.create({
      data: {
        name: 'productivity-visualization',
        displayName: '生産性可視化サービス',
        description: '工数データを分析し、生産性向上のインサイトを提供',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    await seedTimesheetServiceFullParasol(timesheetService)

    // 4. コラボレーション促進サービス（旧：通知・コミュニケーションサービス）
    console.log('\n=== Seeding Collaboration Facilitation Service ===')
    const notificationService = await parasolDb.service.create({
      data: {
        name: 'collaboration-facilitation',
        displayName: 'コラボレーション促進サービス',
        description: 'チーム間の円滑なコミュニケーションと情報共有を実現',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    await seedNotificationServiceFullParasol(notificationService)

    // 5. ナレッジ共創サービス（旧：知識管理サービス）
    console.log('\n=== Seeding Knowledge Co-creation Service ===')
    const knowledgeService = await parasolDb.service.create({
      data: {
        name: 'knowledge-cocreation',
        displayName: 'ナレッジ共創サービス',
        description: '組織の知見を集約し、新たな価値を創造する知識基盤を構築',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
    await seedKnowledgeServiceFullParasol(knowledgeService)

    // 6. 収益最適化サービス（旧：財務管理サービス）
    console.log('\n=== Seeding Revenue Optimization Service ===')
    const financeService = await parasolDb.service.create({
      data: {
        name: 'revenue-optimization',
        displayName: '収益最適化サービス',
        description: 'プロジェクト収益を最大化し、コスト効率を改善',
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })
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
  } catch (_error) {
    console.error('❌ Error seeding Parasol data:', error)
    throw _error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })