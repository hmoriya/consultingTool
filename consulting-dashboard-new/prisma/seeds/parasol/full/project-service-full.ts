import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// プロジェクト成功支援サービスのケーパビリティとオペレーション
export async function seedProjectServiceFullParasol(service: unknown) {
  console.log('    Creating business operations for project service...')

  // ケーパビリティとオペレーションが既に存在するかチェック
  const existingCapability = await parasolDb.businessCapability.findFirst({
    where: { serviceId: service.id }
  })

  if (existingCapability) {
    console.log('    Capability already exists for this service, skipping...')
    return
  }

  // ビジネスケーパビリティ: プロジェクトを成功に導く能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'ProjectSuccessCapability',
      displayName: 'プロジェクトを成功に導く能力',
      description: 'プロジェクトを期限内・予算内で成功に導き、クライアントの期待を超える成果を提供',
      category: 'Core'
    }
  })

  // ビジネスオペレーション作成
  const operations = [
    {
      name: 'plan-project-accurately',
      displayName: 'プロジェクトを的確に計画する',
      goal: 'プロジェクトの目標、スコープ、スケジュール、リソース計画を策定し、成功への道筋を明確にする'
    },
    {
      name: 'manage-risks-proactively',
      displayName: 'リスクを先読みして対処する',
      goal: 'プロジェクトのリスクを早期に特定し、予防的な対策を講じることで問題を未然に防ぐ'
    },
    {
      name: 'visualize-and-control-progress',
      displayName: '進捗を可視化して統制する',
      goal: '進捗状況をリアルタイムで把握し、遅延やボトルネックに迅速に対応する'
    },
    {
      name: 'ensure-quality',
      displayName: '品質を保証する',
      goal: '成果物の品質基準を定義し、継続的な品質管理を実施して高品質な成果物を提供する'
    },
    {
      name: 'resolve-issues-quickly',
      displayName: '課題を迅速に解決する',
      goal: '発生した課題を早期に特定し、効果的な解決策を実施して影響を最小化する'
    },
    {
      name: 'align-expectations',
      displayName: '期待値をすり合わせる',
      goal: 'ステークホルダーとの期待値を調整し、満足度の高い成果物を提供する'
    },
    {
      name: 'deliver-results-reliably',
      displayName: '成果物を確実にデリバリーする',
      goal: '計画通りに成果物を完成させ、クライアントに価値を提供する'
    }
  ]

  for (const op of operations) {
    await parasolDb.businessOperation.create({
      data: {
        serviceId: service.id,
        capabilityId: capability.id,
        name: op.name,
        displayName: op.displayName,
        pattern: 'Workflow',
        goal: op.goal,
        roles: JSON.stringify(['PM', 'コンサルタント', 'クライアント']),
        operations: JSON.stringify([]),
        businessStates: JSON.stringify([]),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([]),
        robustnessModel: JSON.stringify({})
      }
    })
    console.log(`    Creating business operation: ${op.displayName}...`)
  }

  console.log(`    ✅ Created ${operations.length} business operations for project management`)
}