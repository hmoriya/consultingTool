import { seedTrackRevenue } from './finance-operations/01-track-revenue'
import { seedManageCosts } from './finance-operations/02-manage-costs'
import { seedOptimizeProfitability } from './finance-operations/03-optimize-profitability'

// 財務管理サービスのビジネスオペレーション群
export async function seedFinanceOperationsFull(service: any, capability: any) {
  console.log('  Creating finance business operations...')
  
  // 収益を正確に追跡する
  await seedTrackRevenue(service, capability)
  
  // コストを厳密に管理する
  await seedManageCosts(service, capability)
  
  // 収益性を最適化する
  await seedOptimizeProfitability(service, capability)
}