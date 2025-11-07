import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedKnowledgeServiceParasol(service: unknown) {
  console.log('  Seeding knowledge-service parasol data...')
  
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'KnowledgeAsset',
      displayName: '知識を組織資産化する能力',
      description: '知識を体系化し知的資産として蓄積・活用する',
      definition: `# ビジネスケーパビリティ: 知識を組織資産化する能力
## 実現する成果
- ナレッジ再利用率 70%以上
- 問題解決時間の短縮 50%`,
      category: 'Core'
    }
  })
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'KnowledgeCapture',
      displayName: 'プロジェクト知識を保全する',
      design: `# ビジネスオペレーション: プロジェクト知識を保全する
## 目的
プロジェクトで得られた知識を確実に記録`,
      pattern: 'CRUD',
      goal: '知識を組織の知的資産として保全',
      roles: JSON.stringify(['Consultant', 'KnowledgeManager']),
      operations: JSON.stringify({ steps: ['KnowledgeExtraction', 'Documentation', 'QualityAssurance'] }),
      businessStates: JSON.stringify(['Draft', 'UnderReview', 'Published']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { capability, operation }
}