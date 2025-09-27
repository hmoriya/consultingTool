import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ナレッジ管理サービスの完全なパラソルデータ
export async function seedKnowledgeServiceFullParasol() {
  console.log('  Seeding knowledge-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'knowledge-management' }
  })
  
  if (existingService) {
    console.log('  知識管理サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'knowledge-management',
      displayName: '知識管理サービス',
      description: 'ナレッジの蓄積、共有、活用を促進し組織学習を支援',

      domainLanguage: JSON.stringify({}),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: 知識を組織資産化する能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'KnowledgeAssetCapability',
      displayName: '知識を組織資産化する能力',
      description: 'プロジェクトで得られた知識やノウハウを体系的に蓄積・共有し、組織の知的資産として活用可能にする能力',
      definition: `# ビジネスケーパビリティ: 知識を組織資産化する能力 [KnowledgeAssetCapability] [KNOWLEDGE_ASSET_CAPABILITY]

## ケーパビリティ概要

### 定義
コンサルティング活動を通じて得られた知識、ノウハウ、ベストプラクティスを組織的に収集・整理・体系化し、検索可能な形で保存することで、将来のプロジェクトで再利用可能にし、組織全体の問題解決能力を向上させる組織的能力。

### ビジネス価値
- **直接的価値**: プロジェクト立ち上げ時間30%短縮、同様課題の解決時間50%削減、提案品質20%向上
- **間接的価値**: 新人の立ち上がり速度2倍、ベストプラクティスの標準化、失敗の繰り返し防止
- **戦略的価値**: 組織の知的資産の可視化と蓄積、競合優位性の構築、ナレッジベース経営の実現

### 成熟度レベル
- **現在**: レベル2（管理段階） - 個人や部門単位での知識管理が存在
- **目標**: レベル4（予測可能段階） - AIによる知識推薦と自動分類で活用を最大化（2025年Q4）

## ビジネスオペレーション群

### 知識収集グループ
- 知識を記録する [CaptureKnowledge] [CAPTURE_KNOWLEDGE]
  - 目的: プロジェクトで得られた知見を記事として記録
- 暗黙知を形式知化する [ExternalizeKnowledge] [EXTERNALIZE_KNOWLEDGE]
  - 目的: 個人の頭の中にある暗黙知を言語化・文書化
- 教訓を抽出する [ExtractLessonsLearned] [EXTRACT_LESSONS_LEARNED]
  - 目的: プロジェクト完了時に成功要因・失敗要因を明確化

### 知識整理グループ
- 知識を分類する [CategorizeKnowledge] [CATEGORIZE_KNOWLEDGE]
  - 目的: 知識を体系的なカテゴリに整理
- 知識を関連付ける [LinkKnowledge] [LINK_KNOWLEDGE]
  - 目的: 関連する知識同士を相互参照可能にする
- 知識を評価する [EvaluateKnowledge] [EVALUATE_KNOWLEDGE]
  - 目的: 知識の有用性と正確性を評価

### 知識活用グループ
- 知識を検索する [SearchKnowledge] [SEARCH_KNOWLEDGE]
  - 目的: 必要な知識を迅速に発見
- 知識を推薦する [RecommendKnowledge] [RECOMMEND_KNOWLEDGE]
  - 目的: 文脈に応じた関連知識を自動提示
- 知識を共有する [ShareKnowledge] [SHARE_KNOWLEDGE]
  - 目的: ナレッジセッションやワークショップで知識を伝達

### 知識更新グループ
- 知識を更新する [UpdateKnowledge] [UPDATE_KNOWLEDGE]
  - 目的: 古くなった知識を最新情報に更新
- 知識を廃止する [RetireKnowledge] [RETIRE_KNOWLEDGE]
  - 目的: 陳腐化した知識をアーカイブまたは削除

## 関連ケーパビリティ

### 前提ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 依存理由: プロジェクトが知識創造の源泉
- 情報を即座に届ける能力 [InstantCommunicationCapability] [INSTANT_COMMUNICATION_CAPABILITY]
  - 依存理由: 知識共有には通知とコミュニケーション基盤が必要

### 連携ケーパビリティ
- チームの生産性を最大化する能力 [TeamProductivityCapability] [TEAM_PRODUCTIVITY_CAPABILITY]
  - 連携価値: 知識活用がスキル向上とチーム生産性向上に貢献
- 顧客満足を高める能力 [CustomerSatisfactionCapability] [CUSTOMER_SATISFACTION_CAPABILITY]
  - 連携価値: 蓄積された知識が高品質なサービス提供を支援

## パラソルドメインモデル概要

### 中核エンティティ
- ナレッジ記事 [Article] [ARTICLE]
- ナレッジカテゴリ [Category] [CATEGORY]
- テンプレート [Template] [TEMPLATE]
- FAQ [FAQ] [FAQ]
- エキスパート [Expert] [EXPERT]

### 主要な集約
- 記事集約（記事、バージョン、コメント、評価）
- カテゴリ集約（カテゴリ、サブカテゴリ、タグ）
- テンプレート集約（テンプレート、セクション、変数）

## 評価指標（KPI）

1. **知識記事数**: 組織全体で蓄積されたナレッジ記事の総数
   - 目標値: 1000記事以上（年間200記事増）
   - 測定方法: 公開済み記事の総数
   - 測定頻度: 月次

2. **知識活用率**: ナレッジが実際にプロジェクトで活用された割合
   - 目標値: 70%以上
   - 測定方法: (知識を参照したプロジェクト数 / 全プロジェクト数) × 100
   - 測定頻度: 四半期

3. **知識検索ヒット率**: 検索で有用な知識が見つかった割合
   - 目標値: 80%以上
   - 測定方法: (有用だった検索数 / 全検索数) × 100（検索後のフィードバックから算出）
   - 測定頻度: 月次

4. **知識貢献率**: 全コンサルタントに対する知識投稿者の割合
   - 目標値: 50%以上（年間で50%以上が最低1記事投稿）
   - 測定方法: (投稿者数 / 全コンサルタント数) × 100
   - 測定頻度: 四半期

5. **知識評価スコア**: 投稿された知識の平均評価
   - 目標値: 4.0/5.0以上
   - 測定方法: 全記事の評価スコアの平均（5段階評価）
   - 測定頻度: 月次

## 必要なリソース

### 人的リソース
- **全コンサルタント**: 知識の記録と活用
  - 人数: 全コンサルタント
  - スキル要件: 文書化能力、知識共有意識

- **ナレッジマネージャー**: 知識管理の統制
  - 人数: 組織全体で2-3名
  - スキル要件: 情報整理能力、体系化スキル、編集能力

- **エキスパート**: 専門領域の知識監修
  - 人数: 各専門領域に1-2名
  - スキル要件: 専門分野の深い知識、レビュー能力

### 技術リソース
- **ナレッジ管理システム**: 知識の蓄積・検索・共有
  - 用途: 記事投稿、全文検索、タグ管理、評価機能
  - 要件: 直感的なエディタ、強力な検索、バージョン管理

- **AI検索エンジン**: 意味検索と知識推薦
  - 用途: 自然言語検索、関連記事の推薦
  - 要件: 意味理解、パーソナライズ、学習機能

- **コラボレーションツール**: 知識共有セッション
  - 用途: ナレッジシェア会議、質疑応答
  - 要件: ビデオ会議、画面共有、録画機能

### 情報リソース
- **知識分類体系**: 組織標準のカテゴリ構造
  - 用途: 知識の体系的整理
  - 更新頻度: 年次

- **テンプレートライブラリ**: 再利用可能なドキュメント
  - 用途: 提案書、報告書、設計書のひな形
  - 更新頻度: 四半期

- **エキスパートディレクトリ**: 専門家の連絡先
  - 用途: 質問や相談の橋渡し
  - 更新頻度: リアルタイム

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- ナレッジ管理システムの導入
- 知識分類体系の策定
- 記事投稿ワークフローの確立
- 全文検索機能の実装

### Phase 2: 機能拡張（2024 Q3-Q4）
- AI検索機能の導入（意味検索）
- 関連記事の自動推薦
- ナレッジ評価・コメント機能
- テンプレートライブラリの構築

### Phase 3: 最適化（2025 Q1-Q2）
- 知識の自動分類と自動タグ付け
- プロジェクト文脈に応じた知識プッシュ通知
- 暗黙知の自動抽出（会議録からの知識抽出）
- ナレッジグラフの可視化`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedKnowledgeOperationsFull } = await import('./knowledge-operations-full')
  await seedKnowledgeOperationsFull(service, capability)
  
  return { service, capability }
}