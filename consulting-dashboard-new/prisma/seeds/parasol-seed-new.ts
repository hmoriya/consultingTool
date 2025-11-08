import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
// import { createServices } from './parasol/services-seed'
import { createBusinessCapabilities } from './parasol/business-capabilities-seed'
import { createBusinessOperations } from './parasol/business-operations-seed'
import { createUseCases } from './parasol/use-cases-seed'
import { createPageDefinitions } from './parasol/page-definitions-seed'

const parasolDb = new ParasolPrismaClient()

// サービスレベルのMD形式定義
const serviceDefinitions = {
  description: `# コンサルティングダッシュボードサービス

## サービス概要
コンサルティングファームの業務を統合的に支援し、プロジェクトの成功率向上とチームの生産性最大化を実現するサービス

## 提供価値
- **顧客価値**: プロジェクトの透明性向上、迅速な意思決定、高品質な成果物
- **内部価値**: 業務効率化、ナレッジの蓄積と活用、人材の最適配置
- **社会価値**: コンサルティング業界の生産性向上、知識集約型産業の発展

## サービスの特徴
- プロジェクトライフサイクル全体をカバー
- リアルタイムな情報共有と可視化
- AIを活用した最適化提案
- 蓄積されたナレッジの活用`,

  domainLanguage: `# パラソルドメイン言語: コンサルティングドメイン

## ドメイン概要
コンサルティング業務における中核概念と、それらの関係性を定義する

## 主要なエンティティ

### プロジェクト [Project] [PROJECT]
クライアントの課題解決のための一連の活動単位

### タスク [Task] [TASK]
プロジェクトを構成する作業単位

### 成果物 [Deliverable] [DELIVERABLE]
プロジェクトで作成される具体的な成果

### チームメンバー [TeamMember] [TEAM_MEMBER]
プロジェクトに参画する人材

### ナレッジ [Knowledge] [KNOWLEDGE]
プロジェクトで得られた知識・ノウハウ

### リソース [Resource] [RESOURCE]
プロジェクトで活用される人的・物的資源

## ドメインルール
- プロジェクトには必ず1名以上のプロジェクトマネージャーが必要
- タスクの工数見積もりは実績の±20%以内に収める
- ナレッジは公開前に必ずレビューを通す
- リソースの稼働率は100%を超えてはならない`,

  apiSpecification: `# API仕様概要

## 設計方針
- RESTfulアーキテクチャに準拠
- リソース指向の設計
- 統一的なエラーハンドリング
- ページネーション対応

## 認証・認可
- JWTトークンによる認証
- ロールベースアクセス制御
- APIキー管理

## 共通仕様
- レスポンス形式: JSON
- 文字エンコード: UTF-8
- 日時形式: ISO8601
- エラーコード体系の統一`,

  databaseDesign: `# データベース設計概要

## 設計方針
- マイクロサービスを前提とした分離設計
- イベントソーシングパターンの採用
- 読み書き分離（CQRS）の検討
- 監査ログの完備

## データ整合性
- トランザクション境界の明確化
- 結果整合性の許容
- 冪等性の保証

## パフォーマンス
- 適切なインデックス設計
- クエリ最適化
- キャッシュ戦略`
}

// イテレーション計画のMD形式定義

/*
## 計画概要

### プロジェクト情報
- **プロジェクト名**: パラソル仕様準拠データ移行 [ParasolMigration] [PARASOL_MIGRATION]
- **目的**: 既存のシードデータをパラソル仕様に準拠した形式で再作成・投入
- **期間**: 2024年1月（1イテレーション）
- **イテレーション数**: 1

## イテレーション詳細

### イテレーション1: パラソル仕様データ投入

#### 基本情報
- **期間**: 1日
- **目標**: パラソル仕様に完全準拠したシードデータの投入
- **前提**: パラソルスキーマ定義完了、テンプレート作成済み

#### 実現機能
1. **サービス定義投入**
   - 内容: コンサルティングダッシュボードサービスの定義
   - 価値: サービス全体像の明確化

2. **ビジネスケーパビリティ投入**
   - 内容: 3つのコアケーパビリティ定義
   - 価値: 組織能力の可視化

3. **ビジネスオペレーション投入**
   - 内容: 各ケーパビリティのオペレーション定義
   - 価値: 業務プロセスの標準化

4. **ユースケース投入**
   - 内容: システム機能の詳細定義
   - 価値: 開発スコープの明確化

5. **ページ・テスト定義投入**
   - 内容: UI/UXとテストケースの定義
   - 価値: 品質基準の確立

#### 成果物
- 動作するパラソルサービスDB
- 完全なドメイン定義
- ビジネスオペレーション体系

#### 完了基準
- [ ] 全データ投入成功
- [ ] データ整合性確認
- [ ] 参照可能性確認
*/

export async function seedParasolService() {
  console.log('🌱 Seeding Parasol Service with new specification...')

  try {
    // 既存データをクリア
    console.log('  Clearing existing data...')
    await parasolDb.pageDefinition.deleteMany({})
    await parasolDb.useCase.deleteMany({})
    await parasolDb.businessOperation.deleteMany({})
    await parasolDb.businessCapability.deleteMany({})
    await parasolDb.domainService.deleteMany({})
    await parasolDb.valueObject.deleteMany({})
    await parasolDb.domainEntity.deleteMany({})
    await parasolDb.service.deleteMany({})

    // サービス定義を作成
    console.log('  Creating service definition...')
    const service = await parasolDb.service.create({
      data: {
        name: 'consulting-dashboard',
        displayName: 'コンサルティングダッシュボード',
        description: 'コンサルティングファームの業務を統合的に支援するサービス',
        serviceDescription: serviceDefinitions.description,
        domainLanguageDefinition: serviceDefinitions.domainLanguage,
        apiSpecificationDefinition: serviceDefinitions.apiSpecification,
        databaseDesignDefinition: serviceDefinitions.databaseDesign,
        domainLanguage: JSON.stringify({}),
        apiSpecification: JSON.stringify({}),
        dbSchema: JSON.stringify({})
      }
    })

    // ビジネスケーパビリティを作成
    const capabilities = await createBusinessCapabilities(service.id)
    console.log(`  Created ${capabilities.length} business capabilities`)

    // ビジネスオペレーションを作成
    const operations = await createBusinessOperations(capabilities)
    console.log(`  Created ${operations.length} business operations`)

    // ユースケースを作成
    const useCases = await createUseCases(operations)
    console.log(`  Created ${useCases.length} use cases`)

    // ページ定義を作成
    const pageDefinitions = await createPageDefinitions(useCases)
    console.log(`  Created ${pageDefinitions.length} page definitions`)


    // ドメインエンティティを作成
    console.log('  Creating domain entities...')
    const domainEntities = [
      {
        serviceId: service.id,
        name: 'Project',
        displayName: 'プロジェクト',
        description: 'クライアントの課題解決のための活動単位',
        isAggregate: true,
        properties: JSON.stringify({
          id: 'UUID',
          name: 'STRING_100',
          code: 'STRING_20',
          clientId: 'UUID',
          status: 'ProjectStatus',
          startDate: 'DATE',
          endDate: 'DATE',
          budget: 'MONEY'
        }),
        businessRules: JSON.stringify(['必ず1名以上のPMが必要', '予算は0以上']),
        domainEvents: JSON.stringify(['ProjectCreated', 'ProjectStarted', 'ProjectCompleted'])
      },
      {
        serviceId: service.id,
        name: 'Task',
        displayName: 'タスク',
        description: 'プロジェクトを構成する作業単位',
        isAggregate: false,
        properties: JSON.stringify({
          id: 'UUID',
          projectId: 'UUID',
          title: 'STRING_255',
          description: 'TEXT',
          status: 'TaskStatus',
          estimatedHours: 'INTEGER',
          actualHours: 'INTEGER'
        }),
        businessRules: JSON.stringify(['工数は0以上', '実績は見積もりの±20%以内が望ましい'])
      },
      {
        serviceId: service.id,
        name: 'Knowledge',
        displayName: 'ナレッジ',
        description: 'プロジェクトで得られた知識',
        isAggregate: true,
        properties: JSON.stringify({
          id: 'UUID',
          title: 'STRING_255',
          content: 'MARKDOWN',
          category: 'KnowledgeCategory',
          status: 'KnowledgeStatus',
          authorId: 'UUID'
        }),
        businessRules: JSON.stringify(['公開前に必ずレビュー', '機密情報のチェック'])
      }
    ]

    for (const entity of domainEntities) {
      await parasolDb.domainEntity.create({ data: entity })
    }

    // 値オブジェクトを作成
    console.log('  Creating value objects...')
    const valueObjects = [
      {
        serviceId: service.id,
        name: 'ProjectStatus',
        displayName: 'プロジェクトステータス',
        description: 'プロジェクトの進行状態',
        properties: JSON.stringify({
          value: 'ENUM["planning", "active", "completed", "cancelled"]'
        }),
        validationRules: JSON.stringify(['必須項目', '定義された値のみ'])
      },
      {
        serviceId: service.id,
        name: 'Money',
        displayName: '金額',
        description: '通貨単位を含む金額',
        properties: JSON.stringify({
          amount: 'DECIMAL',
          currency: 'STRING_3'
        }),
        validationRules: JSON.stringify(['金額は0以上', '通貨コードはISO4217準拠'])
      }
    ]

    for (const valueObj of valueObjects) {
      await parasolDb.valueObject.create({ data: valueObj })
    }

    // ドメインサービスを作成
    console.log('  Creating domain services...')
    await parasolDb.domainService.create({
      data: {
        serviceId: service.id,
        name: 'ResourceAllocationService',
        displayName: 'リソース配分サービス',
        description: 'プロジェクトへの最適なリソース配分を計算',
        methods: JSON.stringify([
          'findOptimalAllocation',
          'checkResourceAvailability',
          'calculateUtilization'
        ]),
        aggregates: JSON.stringify(['Project', 'Resource'])
      }
    })

    // イテレーション計画（インパクト分析）を記録
    console.log('  Creating iteration plan (impact analysis)...')
    await parasolDb.impactAnalysis.create({
      data: {
        serviceId: service.id,
        analysisType: 'design',
        changedElements: JSON.stringify(['全要素新規作成']),
        impactedAreas: JSON.stringify(['データベース', 'API', 'UI']),
        tasks: JSON.stringify([
          'サービス定義の投入',
          'ビジネスケーパビリティの投入',
          'ビジネスオペレーションの投入',
          'ユースケースの投入',
          'ページ・テスト定義の投入'
        ]),
        createdBy: 'seed-script'
      }
    })

    console.log('✅ Parasol Service seeded successfully with new specification!')
    
    // サマリーを表示
    const summary = await parasolDb.service.findFirst({
      where: { id: service.id },
      include: {
        capabilities: {
          include: {
            businessOperations: {
              include: {
                useCaseModels: true
              }
            }
          }
        }
      }
    })

    if (summary) {
      console.log('\n📊 Seed Summary:')
      console.log(`  Service: ${summary.displayName}`)
      console.log(`  Capabilities: ${summary.capabilities.length}`)
      const totalOperations = summary.capabilities.reduce((sum, cap) => sum + cap.businessOperations.length, 0)
      const totalUseCases = summary.capabilities.reduce((sum, cap) => 
        sum + cap.businessOperations.reduce((opSum, op) => opSum + op.useCaseModels.length, 0), 0
      )
      console.log(`  Business Operations: ${totalOperations}`)
      console.log(`  Use Cases: ${totalUseCases}`)
      console.log(`  Domain Entities: ${domainEntities.length}`)
      console.log(`  Value Objects: ${valueObjects.length}`)
      console.log(`  Domain Services: 1`)
    }

  } catch (_error) {
    console.error('❌ Error seeding Parasol Service:', error)
    throw _error
  } finally {
    await parasolDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  seedParasolService()
    .then(() => {
      console.log('Parasol seed completed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('Error seeding parasol data:', e)
      process.exit(1)
    })
}