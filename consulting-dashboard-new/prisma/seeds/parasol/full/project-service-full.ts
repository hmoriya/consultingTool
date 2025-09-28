import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// プロジェクト管理サービスの完全なパラソルデータ
export async function seedProjectServiceFullParasol() {
  console.log('  Seeding project-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'project-success-support' }
  })
  
  if (existingService) {
    console.log('  プロジェクト成功支援サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'project-success-support',
      displayName: 'プロジェクト成功支援サービス',
      description: 'プロジェクトを成功に導くための計画策定、実行支援、リスク管理、成果創出を統合的にサポート',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: 'プロジェクト [Project] [PROJECT]',
            attributes: [
              { name: 'ID [id] [PROJECT_ID]', type: 'UUID' },
              { name: 'プロジェクトコード [code] [CODE]', type: 'STRING_20' },
              { name: 'プロジェクト名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: '開始日 [startDate] [START_DATE]', type: 'DATE' },
              { name: '終了日 [endDate] [END_DATE]', type: 'DATE' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '予算 [budget] [BUDGET]', type: 'MONEY' },
              { name: 'クライアントID [clientId] [CLIENT_ID]', type: 'UUID' },
              { name: 'プロジェクトマネージャーID [pmId] [PM_ID]', type: 'UUID' },
              { name: '進捗率 [progress] [PROGRESS]', type: 'PERCENTAGE' }
            ],
            businessRules: [
              'プロジェクトコードは企業全体で一意',
              '終了日は開始日以降であること',
              'ステータス変更には正当な理由と承認が必要'
            ]
          },
          {
            name: 'タスク [Task] [TASK]',
            attributes: [
              { name: 'ID [id] [TASK_ID]', type: 'UUID' },
              { name: 'タスク名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'マイルストーンID [milestoneId] [MILESTONE_ID]', type: 'UUID' },
              { name: '担当者ID [assigneeId] [ASSIGNEE_ID]', type: 'UUID' },
              { name: '予定工数 [estimatedHours] [ESTIMATED_HOURS]', type: 'DECIMAL' },
              { name: '実績工数 [actualHours] [ACTUAL_HOURS]', type: 'DECIMAL' },
              { name: '期限 [dueDate] [DUE_DATE]', type: 'DATE' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '優先度 [priority] [PRIORITY]', type: 'ENUM' }
            ],
            businessRules: [
              'タスクは必ず1つのプロジェクトに所属',
              '完了には実績工数の記録が必須',
              '期限延長にはPMの承認が必要'
            ]
          },
          {
            name: 'マイルストーン [Milestone] [MILESTONE]',
            attributes: [
              { name: 'ID [id] [MILESTONE_ID]', type: 'UUID' },
              { name: 'マイルストーン名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '計画日 [plannedDate] [PLANNED_DATE]', type: 'DATE' },
              { name: '実績日 [actualDate] [ACTUAL_DATE]', type: 'DATE' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '成果物 [deliverables] [DELIVERABLES]', type: 'JSON' }
            ],
            businessRules: [
              'マイルストーンはプロジェクトの重要な節目を表す',
              'マイルストーン達成には成果物の提出が必須',
              '遅延時は影響分析と対策が必要'
            ]
          },
          {
            name: 'リスク [Risk] [RISK]',
            attributes: [
              { name: 'ID [id] [RISK_ID]', type: 'UUID' },
              { name: 'リスク名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'カテゴリ [category] [CATEGORY]', type: 'ENUM' },
              { name: '発生確率 [probability] [PROBABILITY]', type: 'ENUM' },
              { name: '影響度 [impact] [IMPACT]', type: 'ENUM' },
              { name: 'リスクスコア [riskScore] [RISK_SCORE]', type: 'INTEGER' },
              { name: '対応戦略 [strategy] [STRATEGY]', type: 'ENUM' },
              { name: '対策 [mitigation] [MITIGATION]', type: 'TEXT' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' }
            ],
            businessRules: [
              'リスクスコアは確率×影響度で自動算出',
              '高リスク（スコア8以上）は必ず対策が必要',
              'リスクの状況は週次でレビュー'
            ]
          },
          {
            name: 'イシュー [Issue] [ISSUE]',
            attributes: [
              { name: 'ID [id] [ISSUE_ID]', type: 'UUID' },
              { name: 'イシュー名 [title] [TITLE]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '報告者ID [reporterId] [REPORTER_ID]', type: 'UUID' },
              { name: '担当者ID [assigneeId] [ASSIGNEE_ID]', type: 'UUID' },
              { name: 'カテゴリ [category] [CATEGORY]', type: 'ENUM' },
              { name: '重要度 [severity] [SEVERITY]', type: 'ENUM' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '解決日 [resolvedDate] [RESOLVED_DATE]', type: 'DATE' }
            ],
            businessRules: [
              'イシューは24時間以内に初期対応が必須',
              '重大イシューはエスカレーションフローが発動',
              '解決時は根本原因の記録が必須'
            ]
          },
          {
            name: '成果物 [Deliverable] [DELIVERABLE]',
            attributes: [
              { name: 'ID [id] [DELIVERABLE_ID]', type: 'UUID' },
              { name: '成果物名 [name] [NAME]', type: 'STRING_200' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'タイプ [type] [TYPE]', type: 'ENUM' },
              { name: 'バージョン [version] [VERSION]', type: 'STRING_20' },
              { name: 'ファイルパス [filePath] [FILE_PATH]', type: 'STRING_500' },
              { name: '作成者ID [createdBy] [CREATED_BY]', type: 'UUID' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: 'レビューステータス [reviewStatus] [REVIEW_STATUS]', type: 'ENUM' }
            ],
            businessRules: [
              '成果物はバージョン管理が必須',
              'クライアント提出前に品質レビューが必須',
              '最終版は承認記録を保持'
            ]
          }
        ],
        valueObjects: [
          {
            name: 'プロジェクトコード [ProjectCode] [PROJECT_CODE]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'STRING_20' }],
            businessRules: [
              'フォーマット: [PREFIX][YEAR][SEQUENCE]',
              '例: PRJ2024001',
              '一度発番されたコードは変更不可'
            ]
          },
          {
            name: '進捗率 [Progress] [PROGRESS]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'PERCENTAGE' }],
            businessRules: [
              '0から100の整数値',
              'タスク完了率から自動算出',
              '手動上書きはPM権限が必要'
            ]
          }
        ],
        domainServices: [
          {
            name: 'プロジェクト管理サービス [ProjectManagementService] [PROJECT_MANAGEMENT_SERVICE]',
            operations: [
              'プロジェクトの作成・初期化',
              'プロジェクトステータスの変更',
              'プロジェクト進捗の集計',
              'プロジェクト完了処理'
            ]
          },
          {
            name: 'リスク管理サービス [RiskManagementService] [RISK_MANAGEMENT_SERVICE]',
            operations: [
              'リスクの評価・スコアリング',
              'リスクマトリクスの更新',
              'リスク対策の追跡',
              'リスクレポートの生成'
            ]
          }
        ]
      }),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: プロジェクトを成功に導く能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'ProjectSuccessCapability',
      displayName: 'プロジェクトを成功に導く能力',
      description: 'コンサルティングプロジェクトを期限内・予算内で価値を提供し、クライアントの期待を超える成果を出す能力',
      definition: `# ビジネスケーパビリティ: プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]

## ケーパビリティ概要

### 定義
クライアントの経営課題を解決するコンサルティングプロジェクトを、定められた期限と予算の範囲内で確実に遂行し、期待を超える価値を提供する組織的能力。

### ビジネス価値
- **直接的価値**: プロジェクト成功率95%以上、予算達成率90%以上、スケジュール遵守率90%以上
- **間接的価値**: クライアント満足度向上（CSAT 4.5/5.0以上）、リピート受注率向上（60%以上）、コンサルタント成長機会の提供
- **戦略的価値**: 業界での評判向上、競合優位性の確保、大型案件獲得の基盤

### 成熟度レベル
- **現在**: レベル3（確立段階） - 標準化されたプロジェクト管理プロセスが定義され、主要メトリクスで測定可能
- **目標**: レベル4（予測可能段階） - 定量的な管理により成果を予測可能にする（2025年Q4）

## ビジネスオペレーション群

### プロジェクト計画グループ
- プロジェクトを的確に計画する [PlanProjectAccurately] [PLAN_PROJECT_ACCURATELY]
  - 目的: クライアントの要求を正確に把握し、実現可能で価値を最大化する計画を立案
- リスクを先読みして対処する [AnticipateAndManageRisks] [ANTICIPATE_AND_MANAGE_RISKS]
  - 目的: プロジェクトリスクを早期に特定し、影響を最小化する対策を講じる
- リソースを最適配置する [AllocateResourcesOptimally] [ALLOCATE_RESOURCES_OPTIMALLY]
  - 目的: プロジェクトに最適なスキルセットを持つメンバーを適切なタイミングで配置

### プロジェクト実行グループ
- 進捗を可視化して統制する [VisualizeAndControlProgress] [VISUALIZE_AND_CONTROL_PROGRESS]
  - 目的: プロジェクトの進行状況をリアルタイムで把握し、遅延を未然に防ぐ
- 品質を保証する [AssureQuality] [ASSURE_QUALITY]
  - 目的: 成果物が合意された品質基準を満たすことを確認する
- 課題を迅速に解決する [ResolveIssuesQuickly] [RESOLVE_ISSUES_QUICKLY]
  - 目的: プロジェクト遂行を妨げる課題を速やかに特定し解決する

### ステークホルダー管理グループ
- 期待値を適切に管理する [ManageExpectationsAppropriately] [MANAGE_EXPECTATIONS_APPROPRIATELY]
  - 目的: クライアントとの期待値ギャップを最小化し、満足度を高める
- コミュニケーションを円滑化する [FacilitateCommunication] [FACILITATE_COMMUNICATION]
  - 目的: プロジェクト関係者間の情報共有と意思疎通を円滑にする

## 関連ケーパビリティ

### 前提ケーパビリティ
- チームの生産性を最大化する能力 [TeamProductivityCapability] [TEAM_PRODUCTIVITY_CAPABILITY]
  - 依存理由: プロジェクト成功には高い生産性を発揮するチームが不可欠
- 知識を組織資産化する能力 [KnowledgeAssetCapability] [KNOWLEDGE_ASSET_CAPABILITY]
  - 依存理由: 過去のプロジェクト知見を活用することで成功確率が向上

### 連携ケーパビリティ
- 顧客関係を強化する能力 [CustomerRelationshipCapability] [CUSTOMER_RELATIONSHIP_CAPABILITY]
  - 連携価値: プロジェクト成功が顧客との長期的な信頼関係構築に繋がる
- 収益性を最適化する能力 [ProfitabilityOptimizationCapability] [PROFITABILITY_OPTIMIZATION_CAPABILITY]
  - 連携価値: 効率的なプロジェクト遂行が収益性向上に直結

## パラソルドメインモデル概要

### 中核エンティティ
- プロジェクト [Project] [PROJECT]
- タスク [Task] [TASK]
- マイルストーン [Milestone] [MILESTONE]
- 成果物 [Deliverable] [DELIVERABLE]
- プロジェクトメンバー [ProjectMember] [PROJECT_MEMBER]

### 主要な集約
- プロジェクト集約（プロジェクト、タスク、マイルストーン、リスク）
- 成果物集約（成果物、レビュー、承認、バージョン）
- プロジェクトチーム集約（プロジェクトメンバー、ロール、配分率）

## 評価指標（KPI）

1. **プロジェクト成功率**: 期限内・予算内・品質基準達成で完了したプロジェクトの割合
   - 目標値: 95%以上
   - 測定方法: (成功プロジェクト数 / 完了プロジェクト総数) × 100
   - 測定頻度: 月次

2. **スケジュール遵守率**: 計画通りに完了したマイルストーンの割合
   - 目標値: 90%以上
   - 測定方法: (期限内完了マイルストーン数 / 全マイルストーン数) × 100
   - 測定頻度: 週次

3. **予算達成率**: 予算内で完了したプロジェクトの割合
   - 目標値: 90%以上（±10%以内）
   - 測定方法: (予算内完了プロジェクト数 / 完了プロジェクト総数) × 100
   - 測定頻度: 月次

4. **顧客満足度（CSAT）**: プロジェクト完了時の顧客評価
   - 目標値: 4.5/5.0以上
   - 測定方法: プロジェクト完了時アンケート（5段階評価）の平均
   - 測定頻度: プロジェクト完了時

5. **成果物品質スコア**: 成果物レビューでの品質評価
   - 目標値: 4.0/5.0以上
   - 測定方法: 品質レビュー評価の平均値
   - 測定頻度: 成果物納品時

## 必要なリソース

### 人的リソース
- **プロジェクトマネージャー**: プロジェクト全体の責任と統制
  - 人数: プロジェクトあたり1名
  - スキル要件: PMP/PMI資格、5年以上のPM経験、リーダーシップ、問題解決能力
  
- **ビジネスアナリスト**: 要求分析と要件定義
  - 人数: プロジェクトあたり1-2名
  - スキル要件: 業界知識、要件定義経験3年以上、分析力
  
- **シニアコンサルタント**: 専門領域のリード
  - 人数: プロジェクトあたり2-3名
  - スキル要件: 専門分野の深い知識、7年以上の経験
  
- **コンサルタント**: 実務遂行
  - 人数: プロジェクトあたり3-5名
  - スキル要件: 基礎スキル、3年以上の経験

### 技術リソース
- **プロジェクト管理システム**: タスク・スケジュール・進捗管理
  - 用途: プロジェクト計画と実績の一元管理
  - 要件: ガントチャート、リソース管理、レポート機能
  
- **コラボレーションツール**: チーム内外のコミュニケーション
  - 用途: 情報共有、会議、ドキュメント管理
  - 要件: リアルタイム通信、ファイル共有、セキュリティ
  
- **品質管理ツール**: 成果物の品質チェック
  - 用途: レビュー、承認フロー、バージョン管理
  - 要件: ワークフロー、トレーサビリティ

### 情報リソース
- **プロジェクト実績データ**: 過去のプロジェクトデータ
  - 用途: 見積もり精度向上、リスク予測
  - 更新頻度: プロジェクト完了時
  
- **業界ベンチマークデータ**: 業界標準や競合情報
  - 用途: 計画の妥当性確認、品質基準設定
  - 取得方法: 業界団体、調査会社、自社調査
  
- **クライアント情報**: 顧客の事業・組織・課題
  - 用途: 要求の深い理解、最適な提案
  - 更新頻度: リアルタイム/随時

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- 標準プロジェクト管理プロセスの確立
- プロジェクト管理システムの導入と定着
- PMO（プロジェクト管理オフィス）の設置
- 基本的なKPI測定体制の構築

### Phase 2: 機能拡張（2024 Q3-Q4）
- リスク管理プロセスの強化
- 品質管理体制の高度化
- ステークホルダー管理の体系化
- 予測分析機能の追加

### Phase 3: 最適化（2025 Q1-Q2）
- AIを活用したプロジェクト成果予測
- 自動化によるPM業務の効率化
- ベストプラクティスのナレッジ化
- 継続的改善サイクルの確立`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedProjectOperationsFull } = await import('./project-operations-full')
  await seedProjectOperationsFull(service, capability)
  
  return { service, capability }
}