import { seedPlanProjectAccurately } from './project-operations/01-plan-project-accurately'
import { seedAnticipateAndManageRisks } from './project-operations/02-anticipate-manage-risks'
// import { seedAllocateResourcesOptimally } from './project-operations/03-allocate-resources-optimally' // リソース管理サービスの責務のため除外
import { seedVisualizeAndControlProgress } from './project-operations/04-visualize-control-progress'
import { seedAssureQuality } from './project-operations/05-assure-quality'
import { seedResolveIssuesQuickly } from './project-operations/06-resolve-issues-quickly'
import { seedAlignExpectations } from './project-operations/07-align-expectations'
// import { seedFacilitateCommunication } from './project-operations/08-facilitate-communication' // 通知サービスの責務のため除外
import { seedDeliverDeliverablesReliably } from './project-operations/09-deliver-deliverables-reliably'

export async function seedProjectOperationsFull(service: unknown, capability: unknown) {
  console.log('  Seeding project operations full data...')
  
  const operations = []
  
  // 1. プロジェクトを的確に計画する
  const { operation: operation1 } = await seedPlanProjectAccurately(service, capability)
  operations.push(operation1)
  
  // 2. リスクを先読みして対処する
  const { operation: operation2 } = await seedAnticipateAndManageRisks(service, capability)
  operations.push(operation2)
  
  // 3. 進捗を可視化して統制する
  const { operation: operation3 } = await seedVisualizeAndControlProgress(service, capability)
  operations.push(operation3)
  
  // 4. 品質を保証する
  const { operation: operation4 } = await seedAssureQuality(service, capability)
  operations.push(operation4)
  
  // 5. 課題を迅速に解決する
  const { operation: operation5 } = await seedResolveIssuesQuickly(service, capability)
  operations.push(operation5)
  
  // 6. 期待値をすり合わせる
  const { operation: operation6 } = await seedAlignExpectations(service, capability)
  operations.push(operation6)
  
  // 7. コミュニケーションを円滑化する - 通知サービスへ移動
  // const { operation: operation7 } = await seedFacilitateCommunication(service, capability)
  // operations.push(operation7)
  
  // 8. 成果物を確実にデリバリーする
  const { operation: operation8 } = await seedDeliverDeliverablesReliably(service, capability)
  operations.push(operation8)
  
  console.log(`  ✅ Created ${operations.length} business operations for project management`)
  
  return { 
    operations,
    count: operations.length
  }
}