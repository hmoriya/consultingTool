import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// 全サービスのデータ定義
const servicesData = {
  'secure-access-service': {
    service: {
      name: 'secure-access-service',
      displayName: 'セキュアアクセスサービス',
      description: '認証・認可・監査を通じて、システムへの安全なアクセスを保証'
    },
    capabilities: {
      'access-management': {
        name: 'access-management',
        displayName: 'アクセスを安全に管理する能力',
        operations: ['authenticate-user', 'manage-permissions', 'audit-access']
      }
    }
  },
  'project-success-service': {
    service: {
      name: 'project-success-service',
      displayName: 'プロジェクト成功支援サービス',
      description: 'プロジェクトの計画、実行、監視を通じて成功を支援'
    },
    capabilities: {
      'project-leadership': {
        name: 'project-leadership',
        displayName: 'プロジェクトを成功に導く能力',
        operations: ['plan-project', 'manage-risks', 'deliver-outcomes']
      }
    }
  },
  'talent-optimization-service': {
    service: {
      name: 'talent-optimization-service',
      displayName: 'タレント最適化サービス',
      description: 'チームメンバーの能力を最大化し、最適な配置を実現'
    },
    capabilities: {
      'team-productivity': {
        name: 'team-productivity',
        displayName: 'チームの生産性を最大化する能力',
        operations: ['optimize-resources', 'develop-skills', 'build-teams']
      }
    }
  },
  'productivity-visualization-service': {
    service: {
      name: 'productivity-visualization-service',
      displayName: '生産性可視化サービス',
      description: '工数の正確な記録と分析により生産性を可視化'
    },
    capabilities: {
      'workload-tracking': {
        name: 'workload-tracking',
        displayName: '工数を正確に把握する能力',
        operations: ['record-time', 'approve-timesheet', 'analyze-utilization']
      }
    }
  },
  'knowledge-co-creation-service': {
    service: {
      name: 'knowledge-co-creation-service',
      displayName: 'ナレッジ共創サービス',
      description: '組織知識の蓄積、共有、活用により新たな価値を創造'
    },
    capabilities: {
      'knowledge-management': {
        name: 'knowledge-management',
        displayName: '知識を組織資産化する能力',
        operations: ['capture-knowledge', 'share-knowledge', 'apply-knowledge']
      }
    }
  },
  'revenue-optimization-service': {
    service: {
      name: 'revenue-optimization-service',
      displayName: '収益最適化サービス',
      description: '財務状況の可視化と分析により収益性を最適化'
    },
    capabilities: {
      'financial-optimization': {
        name: 'financial-optimization',
        displayName: '収益性を最適化する能力',
        operations: ['track-revenue', 'manage-costs', 'optimize-profitability']
      }
    }
  },
  'collaboration-facilitation-service': {
    service: {
      name: 'collaboration-facilitation-service',
      displayName: 'コラボレーション促進サービス',
      description: 'チーム間のコミュニケーションと協働を促進'
    },
    capabilities: {
      'communication-delivery': {
        name: 'communication-delivery',
        displayName: '情報を即座に届ける能力',
        operations: ['send-notification', 'facilitate-communication', 'manage-meetings']
      }
    }
  }
}

// テンプレート関数
const generateServiceMD = (service: any) => `# ${service.displayName}

## サービス概要
**名前**: ${service.name}
**表示名**: ${service.displayName}
**説明**: ${service.description}

## ビジネス価値
- **効率化**: 業務プロセスの自動化と最適化
- **品質向上**: サービス品質の継続的改善
- **リスク低減**: 潜在的リスクの早期発見と対処

## パラソルドメイン言語

### ユビキタス言語定義

#### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト
EMAIL: メールアドレス形式
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
BOOLEAN: 真偽値
ENUM: 列挙型
\`\`\`

### エンティティ定義

[サービスに応じた詳細なエンティティ定義をここに記載]

### ドメインサービス

[サービスに応じたドメインサービス定義をここに記載]

### ドメインイベント

[サービスに応じたドメインイベント定義をここに記載]

## API仕様概要
- RESTful API設計
- JWT認証
- Rate Limiting実装
- OpenAPI仕様準拠

## データベース設計概要
- PostgreSQL/SQLite対応
- マイクロサービス対応
- 監査ログテーブル
- パフォーマンス最適化

## 提供ケーパビリティ
- ${Object.values(service.capabilities || {}).map((c: any) => c.displayName).join('\n- ')}
`

const generateCapabilityMD = (capability: any, serviceName: string) => `# ${capability.displayName}

## 定義
${capability.displayName}を実現し、組織の競争優位性を確立する能力

## 責務
- 主要な責務1
- 主要な責務2
- 主要な責務3
- 主要な責務4

## 提供価値
- **価値1**: 具体的な提供価値の説明
- **価値2**: 具体的な提供価値の説明
- **価値3**: 具体的な提供価値の説明

## 実現手段（ビジネスオペレーション）
${capability.operations.map((op: string) => `- ${op}`).join('\n')}

## KPI
- **指標1**: 目標値と測定方法
- **指標2**: 目標値と測定方法
- **指標3**: 目標値と測定方法

## 成熟度レベル
- **現在**: レベル3（標準化済み）
- **目標**: レベル4（管理された）
- **改善計画**: 継続的改善のための具体的計画

## 依存関係
- **前提ケーパビリティ**: 必要な前提となる能力
- **関連ケーパビリティ**: 密接に関連する他の能力
`

const generateOperationMD = (operationName: string, capabilityName: string) => {
  const displayNames: any = {
    'authenticate-user': 'ユーザーを認証する',
    'manage-permissions': '権限を管理する',
    'audit-access': 'アクセスを監査する',
    'plan-project': 'プロジェクトを正確に計画する',
    'manage-risks': 'リスクを先回りして管理する',
    'deliver-outcomes': '成果物を確実に配信する',
    'optimize-resources': 'リソースを最適配分する',
    'develop-skills': 'スキルを育成する',
    'build-teams': 'チームを編成する',
    'record-time': '工数を記録する',
    'approve-timesheet': 'タイムシートを承認する',
    'analyze-utilization': '稼働率を分析する',
    'capture-knowledge': '知識を蓄積する',
    'share-knowledge': '知識を共有する',
    'apply-knowledge': '知識を活用する',
    'track-revenue': '収益を追跡する',
    'manage-costs': 'コストを管理する',
    'optimize-profitability': '収益性を最適化する',
    'send-notification': '通知を配信する',
    'facilitate-communication': 'コミュニケーションを促進する',
    'manage-meetings': '会議を効率化する'
  }

  const displayName = displayNames[operationName] || operationName

  return `# ビジネスオペレーション: ${displayName}

## 概要
**目的**: ${displayName}ことで、ビジネス価値を創出する
**パターン**: ${operationName.includes('manage') || operationName.includes('crud') ? 'CRUD' : operationName.includes('analyze') || operationName.includes('track') ? 'Analytics' : 'Workflow'}
**ゴール**: 効率的かつ確実に${displayName}

## 関係者とロール
- **主要アクター**: このオペレーションを実行する主体
- **関係者1**: オペレーションに関与する関係者
- **関係者2**: オペレーションから影響を受ける関係者

## プロセスフロー

\`\`\`mermaid
flowchart LR
    A[開始] --> B[ステップ1]
    B --> C[ステップ2]
    C --> D{判定}
    D -->|成功| E[ステップ3]
    D -->|失敗| F[エラー処理]
    E --> G[完了]
    F --> B
\`\`\`

### ステップ詳細
1. **ステップ1**: 初期処理の実行
2. **ステップ2**: メイン処理の実行
3. **ステップ3**: 完了処理の実行

## ビジネス状態

\`\`\`mermaid
stateDiagram-v2
    [*] --> 初期状態
    初期状態 --> 処理中: 開始
    処理中 --> 完了: 成功
    処理中 --> エラー: 失敗
    エラー --> 初期状態: リトライ
    完了 --> [*]
\`\`\`

## KPI
- **処理成功率**: 99%以上
- **平均処理時間**: 目標値以内
- **エラー率**: 1%未満

## ビジネスルール
- ルール1: 重要なビジネスルール
- ルール2: 制約事項
- ルール3: 必須要件

## 入出力仕様

### 入力
- **入力1**: 説明
- **入力2**: 説明

### 出力
- **出力1**: 説明
- **出力2**: 説明

## 例外処理
- **エラー1**: 対処方法
- **エラー2**: 対処方法

## 関連ユースケース
- ユースケース1
- ユースケース2
`
}

// フォルダ構造を作成
async function createFolderStructure() {
  const basePath = path.join(process.cwd(), 'docs', 'parasol', 'services')

  for (const [serviceName, serviceData] of Object.entries(servicesData)) {
    const servicePath = path.join(basePath, serviceName)

    // サービスディレクトリ作成
    await fs.mkdir(servicePath, { recursive: true })

    // service.mdを作成
    const serviceMD = generateServiceMD({
      ...serviceData.service,
      capabilities: serviceData.capabilities
    })
    await fs.writeFile(path.join(servicePath, 'service.md'), serviceMD)

    // capabilities作成
    const capabilitiesPath = path.join(servicePath, 'capabilities')
    await fs.mkdir(capabilitiesPath, { recursive: true })

    for (const [capabilityName, capabilityData] of Object.entries(serviceData.capabilities)) {
      const capabilityPath = path.join(capabilitiesPath, capabilityName)
      await fs.mkdir(capabilityPath, { recursive: true })

      // capability.mdを作成
      const capabilityMD = generateCapabilityMD(capabilityData, serviceName)
      await fs.writeFile(path.join(capabilityPath, 'capability.md'), capabilityMD)

      // operations作成
      const operationsPath = path.join(capabilityPath, 'operations')
      await fs.mkdir(operationsPath, { recursive: true })

      for (const operationName of capabilityData.operations) {
        const operationPath = path.join(operationsPath, operationName)
        await fs.mkdir(operationPath, { recursive: true })

        // operation.mdを作成
        const operationMD = generateOperationMD(operationName, capabilityName)
        await fs.writeFile(path.join(operationPath, 'operation.md'), operationMD)

        // use-cases, pages, testsディレクトリも作成
        await fs.mkdir(path.join(operationPath, 'use-cases'), { recursive: true })
        await fs.mkdir(path.join(operationPath, 'pages'), { recursive: true })
        await fs.mkdir(path.join(operationPath, 'tests'), { recursive: true })
      }
    }

    console.log(`✅ Created structure for ${serviceData.service.displayName}`)
  }
}

// 実行
async function main() {
  console.log('🚀 Starting MD files generation...')

  try {
    await createFolderStructure()
    console.log('\n✨ All MD files generated successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Services: ${Object.keys(servicesData).length}`)
    console.log(`- Capabilities: ${Object.values(servicesData).reduce((sum, s) => sum + Object.keys(s.capabilities).length, 0)}`)
    console.log(`- Operations: ${Object.values(servicesData).reduce((sum, s) =>
      sum + Object.values(s.capabilities).reduce((cSum, c: any) => cSum + c.operations.length, 0), 0)}`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()