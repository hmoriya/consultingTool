import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { createServices } from './parasol/services-seed'
import { seedProjectServiceParasol } from './parasol/project-service-parasol-seed'
import { seedResourceServiceParasol } from './parasol/resource-service-parasol-seed'
import { seedKnowledgeServiceParasol } from './parasol/knowledge-service-parasol-seed'

const parasolDb = new ParasolPrismaClient()

export async function seedParasolServiceV2() {
  console.log('🌱 Seeding Parasol Service (v2 - service-separated)...')

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

    // サービスごとのパラソルデータを投入
    const serviceSeeds: Record<string, (service: any) => Promise<any>> = {
      'project-service': seedProjectServiceParasol,
      'resource-service': seedResourceServiceParasol,
      'knowledge-service': seedKnowledgeServiceParasol
    }

    let totalCapabilities = 0
    let totalOperations = 0

    for (const service of services) {
      const seedFunc = serviceSeeds[service.name]
      if (seedFunc) {
        const result = await seedFunc(service)
        if (result.capability) totalCapabilities++
        if (result.operation) totalOperations++
      }
    }

    console.log('✅ Parasol Service seeded successfully (v2)!')
    console.log(`\n📊 Seed Summary:`)
    console.log(`  Services: ${services.length}`)
    console.log(`  Capabilities: ${totalCapabilities}`)
    console.log(`  Business Operations: ${totalOperations}`)
    
    // サービス一覧を表示
    console.log('\n📋 Services:')
    services.forEach(s => console.log(`  - ${s.displayName} (${s.name})`))

  } catch (error) {
    console.error('❌ Error seeding Parasol Service:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  seedParasolServiceV2()
    .then(() => {
      console.log('Parasol seed (v2) completed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('Error seeding parasol data:', e)
      process.exit(1)
    })
}