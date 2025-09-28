import { seedTrackRevenue } from './finance-operations/01-track-revenue'
import { seedOptimizeCosts } from './finance-operations/02-optimize-costs'
import { seedOptimizeProfitability } from './finance-operations/03-optimize-profitability'

// 財務管理サービスのビジネスオペレーション群
export async function seedFinanceOperationsFull(service: any, capability: any) {
  console.log('  Creating finance business operations...')
  
  // 収益を正確に追跡する
  await seedTrackRevenue(service, capability)
  
  // コストを最適化する
  await seedOptimizeCosts(service, capability)
  
  // 収益性を最適化する
  await seedOptimizeProfitability(service, capability)
}