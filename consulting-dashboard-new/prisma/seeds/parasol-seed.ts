import { config } from 'dotenv'
import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import path from 'path'

// .envファイルを読み込み
config({ path: path.resolve(process.cwd(), '.env') })

const parasolDb = new ParasolPrismaClient({
  log: ['error', 'warn'],
})

async function main() {
  console.log('🎨 パラソルサービス用シードデータの投入を開始...')

  try {
    // 既存データをクリア
    await parasolDb.service.deleteMany({})
    console.log('✅ 既存サービスデータをクリアしました')

    // 7つのサービスを作成
    const services = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'knowledge-co-creation-service',
        displayName: 'ナレッジ共創サービス',
        description: '組織の知識を蓄積・共有・活用し、新たな価値を創造するサービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'revenue-optimization-service',
        displayName: '収益最適化サービス',
        description: '収益性を最適化し、ビジネス価値を最大化するサービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'project-success-service',
        displayName: 'プロジェクト成功支援サービス',
        description: 'プロジェクトを成功に導くための包括的支援サービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'secure-access-service',
        displayName: 'セキュアアクセスサービス',
        description: '安全なアクセス管理と認証・認可機能を提供するサービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'talent-optimization-service',
        displayName: 'タレント最適化サービス',
        description: '人材の能力を最大化し、チームパフォーマンスを向上させるサービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'collaboration-facilitation-service',
        displayName: 'コラボレーション促進サービス',
        description: 'チーム間のコラボレーションを促進し、コミュニケーションを活性化するサービス',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'productivity-visualization-service',
        displayName: '生産性可視化サービス',
        description: '生産性を可視化し、業務効率の改善を支援するサービス',
      },
    ]

    // サービスを一括作成
    for (const service of services) {
      await parasolDb.service.create({
        data: {
          id: service.id,
          name: service.name,
          displayName: service.displayName,
          description: service.description,
          // 空の設計ドキュメントフィールドを初期化
          domainLanguageDefinition: '',
          apiSpecificationDefinition: '',
          databaseDesignDefinition: '',
          integrationSpecificationDefinition: '',
          // 旧形式のフィールドも初期化（必須のため）
          domainLanguage: '{}',
          apiSpecification: '{}',
          dbSchema: '{}',
        }
      })
      console.log(`✅ サービス作成完了: ${service.displayName} (${service.name})`)
    }

    console.log('🎉 パラソルサービス用シードデータの投入が完了しました！')
    console.log(`📊 作成されたサービス数: ${services.length}`)

  } catch (_error) {
    console.error('❌ シードデータ投入中にエラーが発生しました:', error)
    throw _error
  } finally {
    await parasolDb.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })