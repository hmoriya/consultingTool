import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedProjectServiceParasol(service: unknown) {
  console.log('  Seeding project-service parasol data...')
  
  // ビジネスケーパビリティ
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'ProjectSuccess',
      displayName: 'プロジェクトを成功に導く能力',
      description: 'コンサルティングプロジェクトを期限内・予算内で価値を提供する',
      definition: `# ビジネスケーパビリティ: プロジェクトを成功に導く能力
## ケーパビリティ概要
クライアントの期待を超える成果を確実に出す能力
## 実現する成果
- プロジェクト成功率 95%以上
- 顧客満足度 4.5以上`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーション
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ProjectPlanning',
      displayName: 'プロジェクトを的確に計画する',
      design: `# ビジネスオペレーション: プロジェクトを的確に計画する
## 目的
実現可能で価値を最大化するプロジェクト計画を立案`,
      pattern: 'Workflow',
      goal: 'クライアントの要求を正確に把握し計画を立案',
      roles: JSON.stringify(['ProjectManager', 'BusinessAnalyst']),
      operations: JSON.stringify({ steps: ['RequirementGathering', 'PlanFormulation'] }),
      businessStates: JSON.stringify(['Planning', 'Approved']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { capability, operation }
}