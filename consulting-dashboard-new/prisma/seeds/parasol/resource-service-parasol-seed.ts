import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedResourceServiceParasol(service: any) {
  console.log('  Seeding resource-service parasol data...')
  
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'TeamProductivity',
      displayName: 'チームの生産性を最大化する能力',
      description: 'コンサルタントの能力を最大限に引き出す',
      definition: `# ビジネスケーパビリティ: チームの生産性を最大化する能力
## 実現する成果
- チーム稼働率 85%以上
- スキルマッチング率 90%以上`,
      category: 'Core'
    }
  })
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ResourceOptimization',
      displayName: 'リソースを最適配置する',
      design: `# ビジネスオペレーション: リソースを最適配置する
## 目的
スキルマッチングによる適材適所を実現`,
      pattern: 'Analytics',
      goal: 'プロジェクトニーズとスキルの最適マッチング',
      roles: JSON.stringify(['ResourceManager', 'ProjectManager']),
      operations: JSON.stringify({ steps: ['DemandAnalysis', 'SupplyAnalysis', 'Matching'] }),
      businessStates: JSON.stringify(['RequestReceiving', 'Analyzing', 'Allocated']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { capability, operation }
}