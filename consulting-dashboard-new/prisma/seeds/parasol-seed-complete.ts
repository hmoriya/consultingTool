import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'
import { createServices } from './parasol/services-seed'

const parasolDb = new ParasolPrismaClient()

// 各サービスのケーパビリティとビジネスオペレーションを定義
const serviceCapabilitiesAndOperations = {
  'secure-access': {
    capability: {
      name: 'SecureAccess',
      displayName: 'アクセスを安全に管理する能力',
      description: 'システムへの適切なアクセス制御と監査証跡を実現する能力',
      definition: `# ビジネスケーパビリティ: アクセスを安全に管理する能力

## ケーパビリティ概要
システムへのセキュアなアクセスを実現し、認証・認可・監査の完全性を保証する能力

## ビジネス価値
- **セキュリティ**: 不正アクセスの防止とデータ保護
- **コンプライアンス**: 監査要件の充足と規制対応
- **生産性**: シングルサインオンによる利便性向上

## 実現する成果
- 不正アクセス率 0%
- 監査証跡の完全性 100%
- ログイン成功率 99.9%以上
- パスワードポリシー準拠率 100%

## 必要な要素
### 人材・スキル
- セキュリティエンジニア
- 認証基盤エンジニア
- 監査スペシャリスト

### プロセス・方法論
- ゼロトラストセキュリティ
- 多要素認証（MFA）
- ロールベースアクセス制御（RBAC）

### ツール・システム
- 認証サーバー
- 監査ログシステム
- アクセス管理ツール`,
      category: 'Core'
    },
    operations: [
      {
        name: 'UserRegistration',
        displayName: 'ユーザーを登録・管理する',
        description: 'システムユーザーの登録から退職までのライフサイクル管理',
        pattern: 'CRUD'
      },
      {
        name: 'Authentication',
        displayName: '認証を実行する',
        description: 'ユーザーの本人確認とセッション管理',
        pattern: 'Workflow'
      },
      {
        name: 'AccessControl',
        displayName: 'アクセス権限を制御する',
        description: 'ロールベースのアクセス制御',
        pattern: 'Administration'
      }
    ]
  },
  'project-success-support': {
    capability: {
      name: 'ProjectSuccess',
      displayName: 'プロジェクトを成功に導く能力',
      description: 'プロジェクトを計画通りに遂行し、期待を超える価値を提供する能力',
      definition: `# ビジネスケーパビリティ: プロジェクトを成功に導く能力

## ケーパビリティ概要
コンサルティングプロジェクトを期限内・予算内で価値を提供し、クライアントの期待を超える成果を創出する能力

## ビジネス価値
- **クライアント価値**: プロジェクトの確実な成果達成、投資対効果の最大化
- **内部価値**: 収益性の向上、ブランド価値の向上、リピート案件の獲得
- **社会価値**: 企業変革の実現、産業競争力の向上

## 実現する成果
- プロジェクト成功率 95%以上
- 顧客満足度 4.5以上（5点満点）
- 計画からの乖離率 ±10%以内
- 品質基準達成率 100%

## 必要な要素
### 人材・スキル
- プロジェクトマネージャー（PMP保有者優遇）
- ビジネスアナリスト
- 品質管理スペシャリスト
- リスク管理エキスパート

### プロセス・方法論
- プロジェクト管理手法（アジャイル/ウォーターフォール）
- 品質管理プロセス（ISO 9001準拠）
- リスク管理フレームワーク（PMBOK準拠）
- ステークホルダー管理手法

### ツール・システム
- プロジェクト管理ツール
- コラボレーションプラットフォーム
- 品質管理システム
- レポーティングツール`,
      category: 'Core'
    },
    operations: [
      {
        name: 'ProjectPlanning',
        displayName: 'プロジェクトを正確に計画する',
        description: '要件定義から計画策定まで',
        pattern: 'Workflow'
      },
      {
        name: 'RiskManagement',
        displayName: 'リスクを先回りして管理する',
        description: 'リスクの識別・評価・対応',
        pattern: 'Workflow'
      },
      {
        name: 'ProgressControl',
        displayName: '進捗を可視化し統制する',
        description: 'プロジェクト進捗の監視と制御',
        pattern: 'Analytics'
      },
      {
        name: 'QualityAssurance',
        displayName: '品質を保証する',
        description: '成果物の品質管理',
        pattern: 'Workflow'
      }
    ]
  },
  'talent-optimization': {
    capability: {
      name: 'TalentOptimization',
      displayName: 'チームの生産性を最大化する能力',
      description: '人材の能力を最大限に引き出し、最適な配置を実現する能力',
      definition: `# ビジネスケーパビリティ: チームの生産性を最大化する能力

## 概要
適材適所の人材配置とスキル開発により、チーム全体の生産性を最大化する

## 提供価値
- 最適なリソース配分
- スキルの可視化と育成
- 高いチームパフォーマンス`,
      category: 'Core'
    },
    operations: [
      {
        name: 'ResourceAllocation',
        displayName: 'リソースを最適配分する',
        description: 'プロジェクトへの人材アサイン',
        pattern: 'Workflow'
      },
      {
        name: 'SkillDevelopment',
        displayName: 'スキルを育成する',
        description: 'スキル評価と教育計画',
        pattern: 'CRUD'
      },
      {
        name: 'TeamBuilding',
        displayName: 'チームを編成する',
        description: '最適なチーム構成の実現',
        pattern: 'Workflow'
      }
    ]
  },
  'productivity-visualization': {
    capability: {
      name: 'ProductivityTracking',
      displayName: '工数を正確に把握する能力',
      description: '作業時間を正確に記録し、生産性を可視化する能力',
      definition: `# ビジネスケーパビリティ: 工数を正確に把握する能力

## 概要
日々の作業時間を正確に記録し、プロジェクトの収益性と個人の生産性を可視化する

## 提供価値
- 正確な工数記録
- 収益性の可視化
- 生産性の改善`,
      category: 'Core'
    },
    operations: [
      {
        name: 'TimeRecording',
        displayName: '工数を記録する',
        description: '日々の作業時間入力',
        pattern: 'CRUD'
      },
      {
        name: 'TimesheetApproval',
        displayName: 'タイムシートを承認する',
        description: '工数の承認ワークフロー',
        pattern: 'Workflow'
      },
      {
        name: 'UtilizationAnalysis',
        displayName: '稼働率を分析する',
        description: '稼働状況の分析とレポート',
        pattern: 'Analytics'
      }
    ]
  },
  'knowledge-cocreation': {
    capability: {
      name: 'KnowledgeAsset',
      displayName: '知識を組織資産化する能力',
      description: 'プロジェクトの知識を体系化し、組織の資産として活用する能力',
      definition: `# ビジネスケーパビリティ: 知識を組織資産化する能力

## 概要
プロジェクトで得られた知識・ノウハウを組織の競争優位の源泉として蓄積・活用する

## 提供価値
- ナレッジの体系化
- ベストプラクティスの共有
- 継続的な学習と改善`,
      category: 'Core'
    },
    operations: [
      {
        name: 'KnowledgeAccumulation',
        displayName: '知識を蓄積する',
        description: 'ナレッジ記事の作成と管理',
        pattern: 'CRUD'
      },
      {
        name: 'KnowledgeSharing',
        displayName: '知識を共有する',
        description: '組織内での知識共有',
        pattern: 'Communication'
      },
      {
        name: 'BestPracticeExtraction',
        displayName: 'ベストプラクティスを抽出する',
        description: '成功パターンの体系化',
        pattern: 'Analytics'
      }
    ]
  },
  'revenue-optimization': {
    capability: {
      name: 'RevenueOptimization',
      displayName: '収益性を最適化する能力',
      description: 'プロジェクトの収益性を最大化し、財務健全性を維持する能力',
      definition: `# ビジネスケーパビリティ: 収益性を最適化する能力

## 概要
プロジェクトごとの収益性を正確に把握し、利益率を最大化する

## 提供価値
- 収益性の可視化
- コスト管理
- 利益率の改善`,
      category: 'Core'
    },
    operations: [
      {
        name: 'RevenueTracking',
        displayName: '収益を追跡する',
        description: 'プロジェクト別収益管理',
        pattern: 'CRUD'
      },
      {
        name: 'CostManagement',
        displayName: 'コストを管理する',
        description: 'プロジェクトコストの管理',
        pattern: 'CRUD'
      },
      {
        name: 'ProfitabilityOptimization',
        displayName: '収益性を最適化する',
        description: '利益率の分析と改善',
        pattern: 'Analytics'
      }
    ]
  },
  'collaboration-facilitation': {
    capability: {
      name: 'InformationDelivery',
      displayName: '情報を即座に届ける能力',
      description: '重要な情報をタイムリーに関係者に届ける能力',
      definition: `# ビジネスケーパビリティ: 情報を即座に届ける能力

## 概要
プロジェクトの重要情報をリアルタイムで共有し、迅速な意思決定を支援する

## 提供価値
- リアルタイム通知
- 効果的なコミュニケーション
- 迅速な意思決定`,
      category: 'Core'
    },
    operations: [
      {
        name: 'NotificationDelivery',
        displayName: '通知を配信する',
        description: 'システム通知の管理と配信',
        pattern: 'Communication'
      },
      {
        name: 'CommunicationFacilitation',
        displayName: 'コミュニケーションを促進する',
        description: 'チームコミュニケーションの活性化',
        pattern: 'Communication'
      }
    ]
  }
}

export async function seedParasolServiceComplete() {
  console.log('🌱 Seeding Parasol Service (Complete)...')

  try {
    // 既存データをクリア
    console.log('  Clearing existing data...')
    await parasolDb.testDefinition.deleteMany({})
    await parasolDb.pageDefinition.deleteMany({})
    await parasolDb.useCase.deleteMany({})
    await parasolDb.businessOperation.deleteMany({})
    await parasolDb.businessCapability.deleteMany({})
    await parasolDb.domainService.deleteMany({})
    await parasolDb.valueObject.deleteMany({})
    await parasolDb.domainEntity.deleteMany({})
    await parasolDb.impactAnalysis.deleteMany({})
    await parasolDb.service.deleteMany({})

    // 全サービス定義を作成
    const services = await createServices()
    console.log(`  Created ${services.length} services`)

    // 各サービスにケーパビリティとビジネスオペレーションを作成
    let totalCapabilities = 0
    let totalOperations = 0

    for (const service of services) {
      const data = serviceCapabilitiesAndOperations[service.name]
      if (data) {
        // ケーパビリティを作成
        const capability = await parasolDb.businessCapability.create({
          data: {
            serviceId: service.id,
            ...data.capability
          }
        })
        totalCapabilities++
        console.log(`    ✅ Created capability: ${capability.displayName}`)

        // ビジネスオペレーションを作成
        for (const opData of data.operations) {
          const operation = await parasolDb.businessOperation.create({
            data: {
              serviceId: service.id,
              capabilityId: capability.id,
              name: opData.name,
              displayName: opData.displayName,
              pattern: opData.pattern,
              goal: `${opData.description}を効率的かつ確実に実行し、ビジネス価値を最大化する`,
              roles: JSON.stringify(['PM', 'コンサルタント', '管理者']),
              operations: JSON.stringify({
                steps: [
                  { step: 1, name: '要件確認', description: '実行する内容の確認' },
                  { step: 2, name: '実行', description: '実際の作業実行' },
                  { step: 3, name: '確認・承認', description: '結果の確認と承認' },
                  { step: 4, name: '完了', description: '作業の完了処理' }
                ]
              }),
              businessStates: JSON.stringify({
                states: [
                  { name: '未着手', description: '作業開始前' },
                  { name: '実行中', description: '作業実行中' },
                  { name: '確認中', description: '結果確認中' },
                  { name: '完了', description: '作業完了' }
                ]
              }),
              useCases: JSON.stringify([]),
              uiDefinitions: JSON.stringify({}),
              testCases: JSON.stringify({}),
              design: `# ビジネスオペレーション: ${opData.displayName}

## 目的
${opData.goal}

## 関係者とロール
- **PM**: オペレーション全体の管理・承認
- **コンサルタント**: 実作業の実行
- **管理者**: システム設定・監督

## ビジネスプロセス
### 1. 要件確認（準備フェーズ）
- 実施内容の詳細確認
- 必要リソースの確認
- 前提条件のチェック

### 2. 実行（実施フェーズ）
- 計画に基づく作業実施
- 品質基準の遵守
- 進捗の記録

### 3. 確認・承認（検証フェーズ）
- 実施結果の検証
- 品質チェック
- 承認者による確認

### 4. 完了（完了フェーズ）
- 完了処理の実施
- ドキュメント更新
- 次工程への引き継ぎ

## 状態遷移
\`\`\`mermaid
stateDiagram-v2
    [*] --> 未着手
    未着手 --> 実行中: 開始
    実行中 --> 確認中: 実施完了
    確認中 --> 完了: 承認
    確認中 --> 実行中: 差戻し
    完了 --> [*]
\`\`\`

## KPI
- 完了率: 95%以上（月次）
- 品質スコア: 4.5/5以上（四半期）
- 処理時間: 基準値以内（週次）

## リスクと対策
- **リスク1**: 要件の不明確さ
  - 対策: 事前確認の徹底
- **リスク2**: リソース不足
  - 対策: 早期のリソース調整

## 成果物
- 実施記録
- 品質チェックリスト
- 完了報告書`
            }
          })
          totalOperations++
        }
      }
    }

    console.log('\n✅ Parasol Service seeded successfully!')
    console.log(`\n📊 Seed Summary:`)
    console.log(`  Services: ${services.length}`)
    console.log(`  Capabilities: ${totalCapabilities}`)
    console.log(`  Business Operations: ${totalOperations}`)

  } catch (error) {
    console.error('❌ Error seeding Parasol Service:', error)
    throw error
  } finally {
    await parasolDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  seedParasolServiceComplete()
    .then(() => {
      console.log('Parasol seed completed')
      process.exit(0)
    })
    .catch((e) => {
      console.error('Error seeding parasol data:', e)
      process.exit(1)
    })
}