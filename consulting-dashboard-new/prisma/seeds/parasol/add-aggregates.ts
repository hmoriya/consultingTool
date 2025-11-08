/**
 * 既存のドメイン言語定義にアグリゲート分析を追加するスクリプト
 */

// import { addAggregatesToAllServices } from '../../../app/actions/parasol-aggregate'

async function main() {
  console.log('🔍 Starting aggregate analysis for all services...\n')
  
  try {
    
    if (result.success && result.results) {
      console.log('\n📊 Results by service:')
      result.results.forEach((serviceResult: unknown) => {
        console.log(`\n  ${serviceResult._serviceName}:`)
        if (serviceResult.success) {
          console.log(`    ✅ Success`)
          console.log(`       - Entities: ${serviceResult.entityCount}`)
          console.log(`       - Aggregates: ${serviceResult.aggregateCount}`)
          if (serviceResult.aggregates && serviceResult.aggregates.length > 0) {
            serviceResult.aggregates.forEach((agg: unknown) => {
              console.log(`       - ${agg.name}: ${agg.rootEntity} + ${agg.entityCount} entities`)
            })
          }
        } else {
          console.log(`    ❌ Failed: ${serviceResult.error}`)
        }
      })
      
      if (result.summary) {
        console.log('\n📈 Summary:')
        console.log(`  Total services processed: ${result.summary.totalServices}`)
        console.log(`  Successful: ${result.summary.successCount}`)
        console.log(`  Total aggregates identified: ${result.summary.totalAggregates}`)
      }
    } else {
      console.error('\n❌ Batch analysis failed:', result.error)
      process.exit(1)
    }
    
    console.log('\n✅ Aggregate analysis completed successfully!')
    
  } catch (_error) {
    console.error('\n❌ Error during aggregate analysis:', error)
    process.exit(1)
  }
}

// スタンドアロン実行
if (require.main === module) {
  main()
    .then(() => {
      console.log('\nAggregate analysis script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\nScript error)', error)
      process.exit(1)
    })
}

export { main as addAggregatesToServices }