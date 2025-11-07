import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ビジネスケーパビリティのMD形式定義
export const businessCapabilityDefinitions = {
  projectSuccess: `# ビジネスケーパビリティ: プロジェクトを成功に導く能力 [ProjectSuccess] [PROJECT_SUCCESS]

## ケーパビリティ概要
コンサルティングプロジェクトを期限内・予算内で価値を提供し、クライアントの期待を超える成果を出す能力

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
- プロジェクトマネージャー
- ビジネスアナリスト
- 品質管理スペシャリスト
- リスク管理エキスパート

### プロセス・方法論
- プロジェクト管理手法（アジャイル/ウォーターフォール）
- 品質管理プロセス
- リスク管理フレームワーク
- ステークホルダー管理手法

### ツール・システム
- プロジェクト管理ツール
- コラボレーションプラットフォーム
- 品質管理システム
- レポーティングツール`,

  teamProductivity: `# ビジネスケーパビリティ: チームの生産性を最大化する能力 [TeamProductivity] [TEAM_PRODUCTIVITY]

## ケーパビリティ概要
コンサルタントの能力を最大限に引き出し、チーム全体の生産性と成果を最大化する能力

## ビジネス価値
- **クライアント価値**: 高品質な成果物の迅速な提供、専門性の高いサービス
- **内部価値**: 稼働率の最適化、人材の成長、離職率の低減
- **社会価値**: 知識労働者の生産性向上、ワークライフバランスの実現

## 実現する成果
- チーム稼働率 85%以上
- スキルマッチング率 90%以上
- 従業員満足度 4.0以上（5点満点）
- 生産性向上率 年20%

## 必要な要素
### 人材・スキル
- リソースマネージャー
- 人材開発スペシャリスト
- チームリーダー
- メンター・コーチ

### プロセス・方法論
- リソース配分最適化手法
- スキル評価・開発プロセス
- チームビルディング手法
- パフォーマンス管理プロセス

### ツール・システム
- リソース管理システム
- スキル管理データベース
- 工数管理ツール
- 学習管理システム`,

  knowledgeAsset: `# ビジネスケーパビリティ: 知識を組織資産化する能力 [KnowledgeAsset] [KNOWLEDGE_ASSET]

## ケーパビリティ概要
プロジェクトで得られた知識・ノウハウを体系化し、組織の競争優位の源泉となる知的資産として蓄積・活用する能力

## ビジネス価値
- **クライアント価値**: 過去の知見を活かした高品質なソリューション、迅速な課題解決
- **内部価値**: ナレッジの再利用による効率化、新人の早期戦力化、イノベーション創出
- **社会価値**: 業界知識の向上、ベストプラクティスの普及

## 実現する成果
- ナレッジ再利用率 70%以上
- 問題解決時間の短縮 50%
- 新人育成期間の短縮 30%
- イノベーション提案数 年100件以上

## 必要な要素
### 人材・スキル
- ナレッジマネージャー
- コンテンツキュレーター
- 分類・体系化エキスパート
- ナレッジエンジニア

### プロセス・方法論
- ナレッジ抽出・体系化プロセス
- コンテンツ品質管理
- ナレッジ共有文化醸成
- 知識移転メソッド

### ツール・システム
- ナレッジ管理システム
- 検索・推薦エンジン
- コラボレーションツール
- 分析・可視化ツール`
}

// サービスごとのビジネスケーパビリティマッピング
const serviceCapabilityMapping: Record<string, Array<{
  name: string
  displayName: string
  description: string
  definition: string
  category: string
}>> = {
  'project-service': [
    {
      name: 'ProjectSuccess',
      displayName: 'プロジェクトを成功に導く能力',
      description: 'コンサルティングプロジェクトを期限内・予算内で価値を提供し、クライアントの期待を超える成果を出す能力',
      definition: businessCapabilityDefinitions.projectSuccess,
      category: 'Core'
    }
  ],
  'resource-service': [
    {
      name: 'TeamProductivity',
      displayName: 'チームの生産性を最大化する能力',
      description: 'コンサルタントの能力を最大限に引き出し、チーム全体の生産性と成果を最大化する能力',
      definition: businessCapabilityDefinitions.teamProductivity,
      category: 'Core'
    }
  ],
  'knowledge-service': [
    {
      name: 'KnowledgeAsset',
      displayName: '知識を組織資産化する能力',
      description: 'プロジェクトで得られた知識・ノウハウを体系化し、組織の競争優位の源泉となる知的資産として蓄積・活用する能力',
      definition: businessCapabilityDefinitions.knowledgeAsset,
      category: 'Core'
    }
  ]
}

// ビジネスケーパビリティの作成
export async function createBusinessCapabilities(services: unknown[]) {
  console.log('  Creating business capabilities...')

  const allCapabilities = []
  
  for (const service of services) {
    const capabilities = serviceCapabilityMapping[service.name] || []
    
    for (const capDef of capabilities) {
      const created = await parasolDb.businessCapability.create({
        data: {
          serviceId: service.id,
          ...capDef
        }
      })
      allCapabilities.push(created)
    }
  }

  return allCapabilities
}