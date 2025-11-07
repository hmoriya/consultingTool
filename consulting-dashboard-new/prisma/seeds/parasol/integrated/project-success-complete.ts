import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { readFileSync } from 'fs'
import { join } from 'path'

const parasolDb = new ParasolPrismaClient()

export async function seedProjectSuccessComplete() {
  console.log('🚀 Seeding Project Success Support Service...')

  try {
    // ドメイン言語を読み込み
    const domainLanguagePath = join(__dirname, '../domain-languages/project-success-v2.md')
    const domainLanguage = readFileSync(domainLanguagePath, 'utf-8')

    // 1. サービスを作成
    const service = await parasolDb.service.create({
      data: {
        name: 'project-success-support',
        displayName: 'プロジェクト成功支援サービス',
        description: 'プロジェクトを成功に導くための計画策定、実行支援、リスク管理、成果創出を統合的にサポート',
        domainLanguage: domainLanguage,
        apiSpecification: JSON.stringify({
          endpoints: [
            '/api/projects',
            '/api/projects/{id}',
            '/api/projects/{id}/tasks',
            '/api/projects/{id}/risks',
            '/api/projects/{id}/milestones',
            '/api/projects/{id}/deliverables'
          ]
        }),
        dbSchema: JSON.stringify({
          tables: [
            'projects',
            'tasks',
            'milestones',
            'risks',
            'deliverables',
            'project_members'
          ]
        })
      }
    })
    console.log('  ✅ Service created:', service.displayName)

    // 2. ケーパビリティを作成
    const capabilities = [
      {
        name: 'project-success-capability',
        displayName: 'プロジェクトを成功に導く能力',
        description: 'プロジェクトを期限内・予算内で成功に導き、クライアントの期待を超える成果を提供',
        category: 'Core' as const,
        definition: `# プロジェクトを成功に導く能力

## 定義
プロジェクトの計画から完了まで、全体を統括し成功に導く組織的能力

## 提供価値
- プロジェクト成功率の向上
- 計画精度の向上
- リスクの最小化
- ステークホルダー満足度の向上`,
        operations: [
          {
            name: 'plan-project-accurately',
            displayName: 'プロジェクトを的確に計画する',
            pattern: 'Workflow' as const,
            goal: 'プロジェクトの目標、スコープ、スケジュール、リソース計画を策定し、成功への道筋を明確にする',
            roles: ['PM', 'ビジネスアナリスト', 'クライアント'],
            businessStates: ['planning', 'reviewing', 'approved'],
            kpis: {
              '計画精度': '初期見積もりとの乖離±10%以内',
              'ステークホルダー合意': '全員合意達成'
            }
          },
          {
            name: 'manage-risks-proactively',
            displayName: 'リスクを先読みして対処する',
            pattern: 'Analytics' as const,
            goal: 'プロジェクトのリスクを早期に特定し、予防的な対策を講じることで問題を未然に防ぐ',
            roles: ['PM', 'リスクアナリスト', 'チームリード'],
            businessStates: ['identified', 'assessed', 'mitigated', 'closed'],
            kpis: {
              'リスク事前識別率': '90%以上',
              'リスク顕在化率': '10%以下'
            }
          },
          {
            name: 'visualize-progress',
            displayName: '進捗を可視化して統制する',
            pattern: 'Analytics' as const,
            goal: '進捗状況をリアルタイムで把握し、遅延やボトルネックに迅速に対応する',
            roles: ['PM', 'チームリード', 'ステークホルダー'],
            businessStates: ['onTrack', 'delayed', 'recovered'],
            kpis: {
              'スケジュール遵守率': '95%以上',
              '遅延検知速度': '24時間以内'
            }
          },
          {
            name: 'ensure-quality',
            displayName: '品質を保証する',
            pattern: 'Workflow' as const,
            goal: '成果物の品質基準を定義し、継続的な品質管理を実施して高品質な成果物を提供する',
            roles: ['品質管理者', 'レビュワー', 'PM'],
            businessStates: ['draft', 'review', 'approved', 'delivered'],
            kpis: {
              '品質基準達成率': '100%',
              'クライアント満足度': '4.5/5.0以上'
            }
          },
          {
            name: 'resolve-issues',
            displayName: '課題を迅速に解決する',
            pattern: 'Workflow' as const,
            goal: '発生した課題を早期に特定し、効果的な解決策を実施して影響を最小化する',
            roles: ['PM', 'チームメンバー', 'エスカレーション担当'],
            businessStates: ['reported', 'assigned', 'inProgress', 'resolved'],
            kpis: {
              '平均解決時間': '48時間以内',
              '再発防止実施率': '100%'
            }
          },
          {
            name: 'deliver-results',
            displayName: '成果物を確実にデリバリーする',
            pattern: 'Workflow' as const,
            goal: '計画通りに成果物を完成させ、クライアントに価値を提供する',
            roles: ['PM', 'デリバリーマネージャー', 'クライアント'],
            businessStates: ['prepared', 'reviewed', 'approved', 'delivered'],
            kpis: {
              '納期遵守率': '100%',
              '成果物受入率': '一回で95%以上'
            }
          }
        ]
      }
    ]

    let totalOperations = 0

    for (const capData of capabilities) {
      const { operations, ...capInfo } = capData

      const capability = await parasolDb.businessCapability.create({
        data: {
          ...capInfo,
          serviceId: service.id
        }
      })
      console.log(`  ✅ Capability created: ${capability.displayName}`)

      // ビジネスオペレーションを作成
      for (const opData of operations) {
        const { kpis, ...opInfo } = opData

        await parasolDb.businessOperation.create({
          data: {
            ...opInfo,
            serviceId: service.id,
            capabilityId: capability.id,
            operations: JSON.stringify([]),
            businessStates: JSON.stringify(opInfo.businessStates),
            roles: JSON.stringify(opInfo.roles),
            useCases: JSON.stringify([]),
            uiDefinitions: JSON.stringify([]),
            testCases: JSON.stringify([]),
            robustnessModel: JSON.stringify({}),
            design: JSON.stringify({ kpis })
          }
        })
        totalOperations++
      }
      console.log(`     Created ${operations.length} operations`)
    }

    return {
      service: service.displayName,
      capabilities: capabilities.length,
      operations: totalOperations
    }

  } catch (_error) {
    console.error('❌ Error in seedProjectSuccessComplete:', error)
    throw _error
  }
}

// 直接実行の場合
if (require.main === module) {
  seedProjectSuccessComplete()
    .then(result => {
      console.log('✅ Seed completed:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
}