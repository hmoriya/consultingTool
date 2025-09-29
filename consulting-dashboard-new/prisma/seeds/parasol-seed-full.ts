import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

// 各サービスのシードデータをインポート
import { createServices } from './parasol/services-seed'
import { createSecureAccessData } from './parasol/secure-access-seed'
import { createProjectSuccessData } from './parasol/project-success-seed'
import { createTalentOptimizationData } from './parasol/talent-optimization-seed'
import { createProductivityVisualizationData } from './parasol/productivity-visualization-seed'
import { createCollaborationFacilitationData } from './parasol/collaboration-facilitation-seed'
import { createKnowledgeCocreationData } from './parasol/knowledge-cocreation-seed'
import { createRevenueOptimizationData } from './parasol/revenue-optimization-seed'

const parasolDb = new ParasolPrismaClient()

// サービス名とシード関数のマッピング
const serviceDataCreators: Record<string, (serviceId: string) => Promise<{ capabilities: number, operations: number }>> = {
  'secure-access': createSecureAccessData,
  'project-success-support': createProjectSuccessData,
  'talent-optimization': createTalentOptimizationData,
  'productivity-visualization': createProductivityVisualizationData,
  'collaboration-facilitation': createCollaborationFacilitationData,
  'knowledge-cocreation': createKnowledgeCocreationData,
  'revenue-optimization': createRevenueOptimizationData
}

export async function seedParasolFull() {
  console.log('🌱 Starting Parasol full data seed...')
  
  try {
    // 既存データのクリア
    console.log('\n🧹 Clearing existing data...')
    await parasolDb.testDefinition.deleteMany()
    await parasolDb.pageDefinition.deleteMany()
    await parasolDb.useCase.deleteMany()
    await parasolDb.businessOperation.deleteMany()
    await parasolDb.businessCapability.deleteMany()
    await parasolDb.impactAnalysis.deleteMany()
    await parasolDb.domainService.deleteMany()
    await parasolDb.valueObject.deleteMany()
    await parasolDb.domainEntity.deleteMany()
    await parasolDb.service.deleteMany()
    
    console.log('✅ Existing data cleared')
    
    // サービスの作成
    console.log('\n📦 Creating services...')
    const services = await createServices()
    
    // 統計情報
    let totalCapabilities = 0
    let totalOperations = 0
    const stats: { service: string, capabilities: number, operations: number }[] = []
    
    // 各サービスのケーパビリティとオペレーションを作成
    console.log('\n🔧 Creating capabilities and operations for each service...')
    for (const service of services) {
      console.log(`\n📌 Processing ${service.displayName}...`)
      
      const dataCreator = serviceDataCreators[service.name]
      if (dataCreator) {
        const result = await dataCreator(service.id)
        totalCapabilities += result.capabilities
        totalOperations += result.operations
        
        stats.push({
          service: service.displayName,
          capabilities: result.capabilities,
          operations: result.operations
        })
      } else {
        console.warn(`  ⚠️  No data creator found for ${service.name}`)
      }
    }
    
    // 結果サマリーの表示
    console.log('\n' + '='.repeat(60))
    console.log('📊 SEED COMPLETE - SUMMARY')
    console.log('='.repeat(60))
    console.log(`\n📦 Services: ${services.length}`)
    console.log(`📋 Total Capabilities: ${totalCapabilities}`)
    console.log(`⚙️  Total Operations: ${totalOperations}`)
    console.log(`📈 Average per Service: ${Math.round(totalCapabilities / services.length)} capabilities, ${Math.round(totalOperations / services.length)} operations`)
    
    console.log('\n🔍 Breakdown by Service:')
    console.log('-'.repeat(60))
    stats.forEach(s => {
      console.log(`  ${s.service}:`)
      console.log(`    - Capabilities: ${s.capabilities}`)
      console.log(`    - Operations: ${s.operations}`)
    })
    
    console.log('\n✨ Parasol full seed completed successfully!')
    
  } catch (error) {
    console.error('\n❌ Error during Parasol full seed:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// このファイルを直接実行した場合
if (require.main === module) {
  seedParasolFull()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}