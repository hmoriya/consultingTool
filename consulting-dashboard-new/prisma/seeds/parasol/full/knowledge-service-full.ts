import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ナレッジ管理サービスの完全なパラソルデータ
export async function seedKnowledgeServiceFullParasol() {
  console.log('  Seeding knowledge-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'knowledge-cocreation' }
  })
  
  if (existingService) {
    console.log('  ナレッジ共創サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'knowledge-cocreation',
      displayName: 'ナレッジ共創サービス',
      description: '知識を共有し、組織全体で新たな価値を創造する仕組みを提供',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: 'ナレッジ記事 [Article] [ARTICLE]',
            attributes: [
              { name: 'ID [id] [ARTICLE_ID]', type: 'UUID' },
              { name: 'タイトル [title] [TITLE]', type: 'STRING_200' },
              { name: '概要 [summary] [SUMMARY]', type: 'TEXT' },
              { name: '本文 [content] [CONTENT]', type: 'TEXT' },
              { name: 'カテゴリID [categoryId] [CATEGORY_ID]', type: 'UUID' },
              { name: '作成者ID [authorId] [AUTHOR_ID]', type: 'UUID' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '公開レベル [visibility] [VISIBILITY]', type: 'ENUM' },
              { name: 'タグ [tags] [TAGS]', type: 'JSON' },
              { name: '評価スコア [rating] [RATING]', type: 'DECIMAL' },
              { name: '閲覧数 [viewCount] [VIEW_COUNT]', type: 'INTEGER' },
              { name: '最終更新日 [updatedAt] [UPDATED_AT]', type: 'TIMESTAMP' }
            ],
            businessRules: [
              'タイトルと概要は必須',
              'ドラフト状態から公開への変更は承認が必要',
              '評価スコアは5段階評価の平均'
            ]
          },
          {
            name: 'ナレッジカテゴリ [Category] [CATEGORY]',
            attributes: [
              { name: 'ID [id] [CATEGORY_ID]', type: 'UUID' },
              { name: 'カテゴリ名 [name] [NAME]', type: 'STRING_100' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: '親カテゴリID [parentId] [PARENT_ID]', type: 'UUID' },
              { name: '表示順 [displayOrder] [DISPLAY_ORDER]', type: 'INTEGER' },
              { name: 'アクティブフラグ [isActive] [IS_ACTIVE]', type: 'BOOLEAN' }
            ],
            businessRules: [
              '階層は最大3階層まで',
              'カテゴリ名は階層内で一意',
              '記事が存在するカテゴリは削除不可'
            ]
          },
          {
            name: 'テンプレート [Template] [TEMPLATE]',
            attributes: [
              { name: 'ID [id] [TEMPLATE_ID]', type: 'UUID' },
              { name: 'テンプレート名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'カテゴリID [categoryId] [CATEGORY_ID]', type: 'UUID' },
              { name: 'テンプレート内容 [content] [CONTENT]', type: 'TEXT' },
              { name: '変数定義 [variables] [VARIABLES]', type: 'JSON' },
              { name: '利用回数 [useCount] [USE_COUNT]', type: 'INTEGER' }
            ],
            businessRules: [
              'テンプレートは再利用可能な文書構造',
              '変数は{{variable}}形式で定義',
              'カテゴリ別にテンプレートを管理'
            ]
          },
          {
            name: 'FAQ [FAQ] [FAQ]',
            attributes: [
              { name: 'ID [id] [FAQ_ID]', type: 'UUID' },
              { name: '質問 [question] [QUESTION]', type: 'TEXT' },
              { name: '回答 [answer] [ANSWER]', type: 'TEXT' },
              { name: 'カテゴリID [categoryId] [CATEGORY_ID]', type: 'UUID' },
              { name: '関連記事ID [relatedArticles] [RELATED_ARTICLES]', type: 'JSON' },
              { name: '有用性スコア [helpfulScore] [HELPFUL_SCORE]', type: 'INTEGER' },
              { name: '表示回数 [displayCount] [DISPLAY_COUNT]', type: 'INTEGER' }
            ],
            businessRules: [
              '質問と回答はペアで必須',
              '有用性スコアはユーザー投票による',
              '頻度の高いFAQは上位表示'
            ]
          },
          {
            name: 'エキスパート [Expert] [EXPERT]',
            attributes: [
              { name: 'ID [id] [EXPERT_ID]', type: 'UUID' },
              { name: 'ユーザーID [userId] [USER_ID]', type: 'UUID' },
              { name: '専門分野 [expertise] [EXPERTISE]', type: 'JSON' },
              { name: '経歴 [biography] [BIOGRAPHY]', type: 'TEXT' },
              { name: '貢献度 [contributionScore] [CONTRIBUTION_SCORE]', type: 'INTEGER' },
              { name: '回答数 [answerCount] [ANSWER_COUNT]', type: 'INTEGER' },
              { name: '評価スコア [rating] [RATING]', type: 'DECIMAL' }
            ],
            businessRules: [
              'エキスパートは特定分野の専門家',
              '貢献度は記事投稿と回答の質で評価',
              '一定の貢献度でエキスパート認定'
            ]
          },
          {
            name: 'ナレッジリクエスト [KnowledgeRequest] [KNOWLEDGE_REQUEST]',
            attributes: [
              { name: 'ID [id] [KNOWLEDGE_REQUEST_ID]', type: 'UUID' },
              { name: 'リクエスト者ID [requesterId] [REQUESTER_ID]', type: 'UUID' },
              { name: 'タイトル [title] [TITLE]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'カテゴリID [categoryId] [CATEGORY_ID]', type: 'UUID' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '優先度 [priority] [PRIORITY]', type: 'ENUM' },
              { name: '回答期限 [deadline] [DEADLINE]', type: 'DATE' }
            ],
            businessRules: [
              'リクエストは知識ギャップを埋める要求',
              '優先度は業務への影響度で決定',
              '期限内に回答がない場合はエスカレーション'
            ]
          }
        ],
        valueObjects: [
          {
            name: 'タグ [Tag] [TAG]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'STRING_50' }],
            businessRules: [
              'タグは記事の分類に使用',
              '最大10個まで付与可能',
              '頻繁に使用されるタグは自動提案'
            ]
          },
          {
            name: '評価 [Rating] [RATING]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'DECIMAL' }],
            businessRules: [
              '1-5の5段階評価',
              '小数点1位まで',
              '3件以上の評価で表示'
            ]
          },
          {
            name: '公開レベル [Visibility] [VISIBILITY]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'ENUM' }],
            businessRules: [
              '全体公開、部門限定、プロジェクト限定、非公開',
              'プロジェクト関連知識はプロジェクトメンバーのみ',
              'セキュリティレベルに応じた制御'
            ]
          }
        ],
        domainServices: [
          {
            name: 'ナレッジ検索サービス [KnowledgeSearchService] [KNOWLEDGE_SEARCH_SERVICE]',
            operations: [
              '全文検索の実行',
              '意味検索（AI活用）',
              '関連記事の推薦',
              '検索履歴の学習'
            ]
          },
          {
            name: 'ナレッジ評価サービス [KnowledgeEvaluationService] [KNOWLEDGE_EVALUATION_SERVICE]',
            operations: [
              '記事の品質評価',
              '有用性スコアの算出',
              'エキスパートの認定',
              '改善提案の生成'
            ]
          },
          {
            name: 'テンプレート管理サービス [TemplateManagementService] [TEMPLATE_MANAGEMENT_SERVICE]',
            operations: [
              'テンプレートの作成・管理',
              '変数の置換処理',
              '利用統計の収集',
              'テンプレートの推奨'
            ]
          }
        ]
      }),
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