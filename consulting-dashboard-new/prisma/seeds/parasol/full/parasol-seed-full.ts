import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

async function main() {
  console.log('🚀 Starting full Parasol domain seed...')
  
  // 1. 認証サービス
  const { seedAuthServiceFullParasol } = await import('./auth-service-full')
  await seedAuthServiceFullParasol()
  
  // 2. プロジェクト管理サービス
  const { seedProjectServiceFullParasol } = await import('./project-service-full')
  await seedProjectServiceFullParasol()
  
  // 3. リソース管理サービス
  const { seedResourceServiceFullParasol } = await import('./resource-service-full')
  await seedResourceServiceFullParasol()
  
  // 4. タイムシート管理サービス
  const { seedTimesheetServiceFullParasol } = await import('./timesheet-service-full')
  await seedTimesheetServiceFullParasol()
  
  // 5. 通知・メッセージングサービス
  const { seedNotificationServiceFullParasol } = await import('./notification-service-full')
  await seedNotificationServiceFullParasol()
  
  // 6. 知識管理サービス
  const { seedKnowledgeServiceFullParasol } = await import('./knowledge-service-full')
  await seedKnowledgeServiceFullParasol()
  
  // 7. 財務管理サービス
  const { seedFinanceServiceFullParasol } = await import('./finance-service-full')
  await seedFinanceServiceFullParasol()
  
  // 統計情報
  const services = await parasolDb.service.findMany({
    include: {
      capabilities: {
        include: {
          businessOperations: true
        }
      }
    }
  })
  
  console.log('\n✅ Parasol seed completed successfully!')
  console.log(`   Total services created: ${services.length}`)
  
  services.forEach(service => {
    const totalOps = service.capabilities.reduce(
      (sum, cap) => sum + cap.businessOperations.length, 
      0
    )
    console.log(`   - ${service.displayName}: ${totalOps} operations`)
  })
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await parasolDb.$disconnect()
  })