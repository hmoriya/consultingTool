import { seedAllocateResourcesOptimally } from './resource-operations/01-allocate-resources-optimally'
import { seedDevelopSkills } from './resource-operations/02-develop-skills'
import { seedBuildAndEmpowerTeams } from './resource-operations/03-build-and-empower-teams'
import { seedEvaluatePerformance } from './resource-operations/04-evaluate-performance'
import { seedDevelopAndSupportCareers } from './resource-operations/05-develop-and-support-careers'

export async function seedResourceOperationsFull(service: unknown, capability: unknown) {
  console.log('  Seeding resource operations full data...')
  
  // 1. リソースを最適配置する
  await seedAllocateResourcesOptimally(service, capability)
  
  // 2. スキルを開発する
  await seedDevelopSkills(service, capability)
  
  // 3. チームを編成・強化する
  await seedBuildAndEmpowerTeams(service, capability)
  
  // 4. パフォーマンスを評価する
  await seedEvaluatePerformance(service, capability)
  
  // 5. キャリアを開発・支援する
  await seedDevelopAndSupportCareers(service, capability)
  
  console.log('  ✓ Resource operations full data seeded')
}