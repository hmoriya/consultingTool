import { seedAllocateResourcesOptimally } from './resource-operations/01-allocate-resources-optimally'
import { seedDevelopSkills } from './resource-operations/02-develop-skills'
import { seedManageTeams } from './resource-operations/03-manage-teams'
import { seedEvaluatePerformance } from './resource-operations/04-evaluate-performance'
import { seedManageCareers } from './resource-operations/05-manage-careers'

export async function seedResourceOperationsFull(service: any, capability: any) {
  console.log('  Seeding resource operations full data...')
  
  // 1. リソースを最適配置する
  await seedAllocateResourcesOptimally(service, capability)
  
  // 2. スキルを開発する
  await seedDevelopSkills(service, capability)
  
  // 3. チームを管理する
  await seedManageTeams(service, capability)
  
  // 4. パフォーマンスを評価する
  await seedEvaluatePerformance(service, capability)
  
  // 5. キャリアを管理する
  await seedManageCareers(service, capability)
  
  console.log('  ✓ Resource operations full data seeded')
}