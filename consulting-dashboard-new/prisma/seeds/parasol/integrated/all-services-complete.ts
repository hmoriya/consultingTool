import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { readFileSync } from 'fs'
import { join } from 'path'

const parasolDb = new ParasolPrismaClient()

interface ServiceConfig {
  name: string
  displayName: string
  description: string
  domainLanguageFile: string
  capabilities: Array<{
    name: string
    displayName: string
    description: string
    operations: Array<{
      name: string
      displayName: string
      goal: string
    }>
  }>
}

const services: ServiceConfig[] = [
  {
    name: 'secure-access',
    displayName: 'セキュアアクセスサービス',
    description: '認証・認可・監査を通じて、システムへの安全なアクセスを保証',
    domainLanguageFile: 'secure-access-v2.md',
    capabilities: [
      {
        name: 'access-control',
        displayName: 'アクセスを安全に管理する能力',
        description: 'ユーザー認証、権限管理、監査ログを通じて安全性を確保',
        operations: [
          { name: 'authenticate-user', displayName: 'ユーザーを認証する', goal: 'ユーザーの身元を確認し、システムへのアクセスを許可' },
          { name: 'manage-permissions', displayName: '権限を管理する', goal: 'ロールベースのアクセス制御を実施' },
          { name: 'audit-access', displayName: 'アクセスを監査する', goal: 'セキュリティイベントを記録し、コンプライアンスを確保' }
        ]
      }
    ]
  },
  {
    name: 'project-success-support',
    displayName: 'プロジェクト成功支援サービス',
    description: 'プロジェクトを成功に導くための計画策定、実行支援、リスク管理を統合的にサポート',
    domainLanguageFile: 'project-success-v2.md',
    capabilities: [
      {
        name: 'project-success',
        displayName: 'プロジェクトを成功に導く能力',
        description: 'プロジェクトを期限内・予算内で成功に導き、期待を超える成果を提供',
        operations: [
          { name: 'plan-project', displayName: 'プロジェクトを計画する', goal: '目標・スコープ・スケジュールを策定' },
          { name: 'manage-risks', displayName: 'リスクを管理する', goal: 'リスクを早期識別し対策を講じる' },
          { name: 'track-progress', displayName: '進捗を追跡する', goal: '進捗を可視化し遅延に対応' },
          { name: 'ensure-quality', displayName: '品質を保証する', goal: '成果物の品質基準を満たす' },
          { name: 'deliver-results', displayName: '成果物を納品する', goal: '計画通りに価値を提供' }
        ]
      }
    ]
  },
  {
    name: 'talent-optimization',
    displayName: 'タレント最適化サービス',
    description: '人材の能力を最大化し、適材適所の配置と成長機会を提供',
    domainLanguageFile: 'talent-optimization-v2.md',
    capabilities: [
      {
        name: 'talent-management',
        displayName: 'チームの生産性を最大化する能力',
        description: 'スキル管理、配置最適化、パフォーマンス向上を実現',
        operations: [
          { name: 'manage-skills', displayName: 'スキルを管理する', goal: 'メンバーのスキルを可視化し育成' },
          { name: 'optimize-allocation', displayName: 'リソースを最適配置する', goal: '適材適所の人材配置を実現' },
          { name: 'develop-talent', displayName: 'タレントを育成する', goal: 'キャリア開発と成長支援' }
        ]
      }
    ]
  },
  {
    name: 'productivity-visualization',
    displayName: '生産性可視化サービス',
    description: '工数データを分析し、生産性向上のインサイトを提供',
    domainLanguageFile: 'productivity-visualization-v2.md',
    capabilities: [
      {
        name: 'productivity-analysis',
        displayName: '工数を正確に把握する能力',
        description: '工数記録、分析、最適化提案を通じて生産性を向上',
        operations: [
          { name: 'record-timesheet', displayName: '工数を記録する', goal: '正確な作業時間を記録' },
          { name: 'analyze-productivity', displayName: '生産性を分析する', goal: '工数データから改善点を発見' },
          { name: 'optimize-workload', displayName: '作業負荷を最適化する', goal: 'チームの負荷を平準化' }
        ]
      }
    ]
  },
  {
    name: 'collaboration-facilitation',
    displayName: 'コラボレーション促進サービス',
    description: 'チーム間の円滑なコミュニケーションと情報共有を実現',
    domainLanguageFile: 'collaboration-facilitation-v2.md',
    capabilities: [
      {
        name: 'communication',
        displayName: '情報を即座に届ける能力',
        description: '通知、メッセージング、情報共有を通じてコラボレーションを促進',
        operations: [
          { name: 'send-notifications', displayName: '通知を配信する', goal: '重要情報をタイムリーに伝達' },
          { name: 'facilitate-discussion', displayName: '議論を促進する', goal: 'チーム内の対話を活性化' },
          { name: 'share-knowledge', displayName: '知識を共有する', goal: 'ナレッジの蓄積と活用' }
        ]
      }
    ]
  },
  {
    name: 'knowledge-cocreation',
    displayName: 'ナレッジ共創サービス',
    description: '組織の知見を集約し、新たな価値を創造する知識基盤を構築',
    domainLanguageFile: 'knowledge-cocreation-v2.md',
    capabilities: [
      {
        name: 'knowledge-management',
        displayName: '知識を組織資産化する能力',
        description: 'ナレッジの蓄積、共有、活用を通じて組織知を強化',
        operations: [
          { name: 'capture-knowledge', displayName: '知識を蓄積する', goal: 'プロジェクトの学びを記録' },
          { name: 'organize-knowledge', displayName: '知識を体系化する', goal: 'ナレッジを検索可能に整理' },
          { name: 'apply-knowledge', displayName: '知識を活用する', goal: 'ベストプラクティスの展開' }
        ]
      }
    ]
  },
  {
    name: 'revenue-optimization',
    displayName: '収益最適化サービス',
    description: 'プロジェクト収益を最大化し、コスト効率を改善',
    domainLanguageFile: 'revenue-optimization-v2.md',
    capabilities: [
      {
        name: 'financial-management',
        displayName: '収益性を最適化する能力',
        description: '収益追跡、コスト管理、利益率改善を実現',
        operations: [
          { name: 'track-revenue', displayName: '収益を追跡する', goal: 'プロジェクト収益を正確に把握' },
          { name: 'manage-costs', displayName: 'コストを管理する', goal: '予算内でのプロジェクト遂行' },
          { name: 'optimize-profitability', displayName: '収益性を最適化する', goal: '利益率の向上施策を実施' }
        ]
      }
    ]
  }
]

async function seedAllServices() {
  console.log('🚀 Starting complete Parasol seed for all services...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await parasolDb.testDefinition.deleteMany()
    await parasolDb.pageDefinition.deleteMany()
    await parasolDb.useCase.deleteMany()
    await parasolDb.businessOperation.deleteMany()
    await parasolDb.businessCapability.deleteMany()
    await parasolDb.service.deleteMany()

    let totalServices = 0
    let totalCapabilities = 0
    let totalOperations = 0

    for (const serviceConfig of services) {
      console.log(`\n📦 Creating ${serviceConfig.displayName}...`)

      // Load domain language
      const domainLanguagePath = join(__dirname, '../domain-languages', serviceConfig.domainLanguageFile)
      let domainLanguage = ''
      try {
        domainLanguage = readFileSync(domainLanguagePath, 'utf-8')
      } catch (error) {
        console.warn(`  ⚠️ Domain language file not found: ${serviceConfig.domainLanguageFile}`)
        domainLanguage = '# Domain Language\nNot yet defined.'
      }

      // Create service
      const service = await parasolDb.service.create({
        data: {
          name: serviceConfig.name,
          displayName: serviceConfig.displayName,
          description: serviceConfig.description,
          domainLanguage: JSON.stringify({ content: domainLanguage }),
          apiSpecification: JSON.stringify({ endpoints: [] }),
          dbSchema: JSON.stringify({ tables: [] })
        }
      })
      totalServices++
      console.log(`  ✅ Service created: ${service.displayName}`)

      // Create capabilities and operations
      for (const capConfig of serviceConfig.capabilities) {
        const capability = await parasolDb.businessCapability.create({
          data: {
            serviceId: service.id,
            name: capConfig.name,
            displayName: capConfig.displayName,
            description: capConfig.description,
            category: 'Core',
            definition: `# ${capConfig.displayName}\n\n${capConfig.description}`
          }
        })
        totalCapabilities++
        console.log(`    ✅ Capability created: ${capability.displayName}`)

        // Create operations
        for (const opConfig of capConfig.operations) {
          await parasolDb.businessOperation.create({
            data: {
              serviceId: service.id,
              capabilityId: capability.id,
              name: opConfig.name,
              displayName: opConfig.displayName,
              pattern: 'Workflow',
              goal: opConfig.goal,
              operations: JSON.stringify([]),
              businessStates: JSON.stringify(['initial', 'processing', 'completed']),
              roles: JSON.stringify(['PM', 'Consultant', 'Client']),
              useCases: JSON.stringify([]),
              uiDefinitions: JSON.stringify([]),
              testCases: JSON.stringify([]),
              robustnessModel: JSON.stringify({}),
              design: JSON.stringify({})
            }
          })
          totalOperations++
        }
        console.log(`      Created ${capConfig.operations.length} operations`)
      }
    }

    console.log('\n📊 Summary:')
    console.log(`  ✅ Services: ${totalServices}`)
    console.log(`  ✅ Capabilities: ${totalCapabilities}`)
    console.log(`  ✅ Operations: ${totalOperations}`)
    console.log('\n✨ Complete Parasol seed finished successfully!')

    return { services: totalServices, capabilities: totalCapabilities, operations: totalOperations }

  } catch (error) {
    console.error('❌ Error in seedAllServices:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// Direct execution
if (require.main === module) {
  seedAllServices()
    .then(result => {
      console.log('✅ Seed completed successfully')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seed failed:', error)
      process.exit(1)
    })
}

export { seedAllServices }