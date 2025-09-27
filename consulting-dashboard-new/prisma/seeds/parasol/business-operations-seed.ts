import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ビジネスオペレーションのMD形式設計
export const businessOperationDesigns = {
  // プロジェクトを成功に導く能力
  projectPlanning: `# ビジネスオペレーション: プロジェクトを的確に計画する [ProjectPlanning] [PROJECT_PLANNING]

## 基本情報
### 目的
クライアントの要求を正確に把握し、実現可能で価値を最大化するプロジェクト計画を立案する

### ビジネスパターン
Workflow（ワークフロー）- 複数のステップを経て計画を策定する業務フロー

### ビジネスゴール
- 要求の完全な理解と文書化
- 実現可能な計画の立案
- ステークホルダーの合意形成
- リスクの早期特定と対策立案

## 関係者とロール
- **プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]**: 計画全体の責任者
- **ビジネスアナリスト [BusinessAnalyst] [BUSINESS_ANALYST]**: 要求分析と要件定義
- **ソリューションアーキテクト [SolutionArchitect] [SOLUTION_ARCHITECT]**: 技術的実現性の検証
- **クライアントステークホルダー [ClientStakeholder] [CLIENT_STAKEHOLDER]**: 要求の提供と承認

## ビジネスプロセス
### 1. 要求収集 [RequirementGathering] [REQUIREMENT_GATHERING]
- クライアントインタビューの実施
- 現状分析（AS-IS）の実施
- 課題と機会の特定
- 期待成果の明確化

### 2. 要件定義 [RequirementDefinition] [REQUIREMENT_DEFINITION]
- ビジネス要件の文書化
- 機能要件の定義
- 非機能要件の定義
- 制約条件の整理

### 3. 計画策定 [PlanFormulation] [PLAN_FORMULATION]
- スコープ定義
- WBS（作業分解構造）作成
- スケジュール作成
- リソース計画
- 予算計画

### 4. リスク分析 [RiskAnalysis] [RISK_ANALYSIS]
- リスクの識別
- リスクの評価（影響度×発生確率）
- リスク対応策の立案
- コンティンジェンシー計画

### 5. 承認取得 [ApprovalObtaining] [APPROVAL_OBTAINING]
- 計画レビューの実施
- ステークホルダーへの説明
- フィードバックの反映
- 正式承認の取得

## ビジネス状態
- **計画中 [Planning] [PLANNING]**: 計画策定作業中
- **レビュー中 [UnderReview] [UNDER_REVIEW]**: ステークホルダーレビュー中
- **承認済み [Approved] [APPROVED]**: 計画が正式承認された
- **却下 [Rejected] [REJECTED]**: 計画が却下され再検討が必要

## KPI（重要業績評価指標）
- 要求カバレッジ率: 95%以上
- 計画承認期間: 2週間以内
- 初回承認率: 80%以上
- ステークホルダー満足度: 4.0以上`,

  projectProgress: `# ビジネスオペレーション: プロジェクト進捗を可視化する [ProjectProgress] [PROJECT_PROGRESS]

## 基本情報
### 目的
プロジェクトの進行状況をリアルタイムに把握し、ステークホルダーに正確な情報を提供することで、適切な意思決定を支援する

### ビジネスパターン
Analytics（分析）- データ収集・分析・可視化による洞察提供

### ビジネスゴール
- リアルタイムな進捗把握
- 問題の早期発見
- 透明性の高い情報共有
- データに基づく意思決定支援

## 関係者とロール
- **プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]**: 進捗管理の責任者
- **チームメンバー [TeamMember] [TEAM_MEMBER]**: 進捗情報の提供者
- **エグゼクティブ [Executive] [EXECUTIVE]**: 経営判断の実施者
- **クライアント [Client] [CLIENT]**: 進捗情報の受領者

## ビジネスプロセス
### 1. 進捗情報収集 [ProgressCollection] [PROGRESS_COLLECTION]
- タスク完了状況の更新
- 工数実績の記録
- 成果物の完成度確認
- 課題・リスクの更新

### 2. 進捗分析 [ProgressAnalysis] [PROGRESS_ANALYSIS]
- 計画対実績の比較
- 進捗率の算出
- 遅延要因の分析
- 傾向分析

### 3. レポート作成 [ReportCreation] [REPORT_CREATION]
- 進捗サマリーの作成
- KPIダッシュボード更新
- 課題・リスクレポート
- アクションアイテム整理

### 4. 情報共有 [InformationSharing] [INFORMATION_SHARING]
- ステークホルダー別レポート配信
- ダッシュボード公開
- 進捗会議の実施
- Q&A対応

## ビジネス状態
- **収集中 [Collecting] [COLLECTING]**: 進捗情報を収集中
- **分析中 [Analyzing] [ANALYZING]**: 収集データを分析中
- **共有済み [Shared] [SHARED]**: 情報が共有された
- **対応中 [Responding] [RESPONDING]**: 課題への対応実施中

## KPI（重要業績評価指標）
- 情報更新頻度: 日次
- レポート作成時間: 2時間以内
- 情報精度: 95%以上
- ステークホルダー理解度: 90%以上`,

  // チームの生産性を最大化する能力
  resourceOptimization: `# ビジネスオペレーション: リソースを最適配置する [ResourceOptimization] [RESOURCE_OPTIMIZATION]

## 基本情報
### 目的
プロジェクトのニーズとコンサルタントのスキル・稼働状況を考慮し、最適なリソース配置を実現して生産性を最大化する

### ビジネスパターン
Analytics（分析）- スキルマッチングと稼働分析による最適化

### ビジネスゴール
- スキルと要求の最適マッチング
- 稼働率の最適化（過負荷・遊休の回避）
- チームの士気向上
- プロジェクト成功率の向上

## 関係者とロール
- **リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]**: 配置の最終決定者
- **プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]**: リソース要求者
- **コンサルタント [Consultant] [CONSULTANT]**: 配置対象者
- **スキル管理者 [SkillManager] [SKILL_MANAGER]**: スキル情報の管理者

## ビジネスプロセス
### 1. 要求分析 [DemandAnalysis] [DEMAND_ANALYSIS]
- プロジェクト要求の収集
- 必要スキルの特定
- 期間と工数の確認
- 優先度の設定

### 2. 供給分析 [SupplyAnalysis] [SUPPLY_ANALYSIS]
- コンサルタントのスキル確認
- 稼働状況の把握
- 今後の予定確認
- 成長意向の考慮

### 3. マッチング [Matching] [MATCHING]
- スキルマッチング分析
- 稼働率シミュレーション
- チーム相性の考慮
- 複数案の作成

### 4. 配置実行 [AllocationExecution] [ALLOCATION_EXECUTION]
- 配置案の承認取得
- 本人への通知
- プロジェクトへの参画
- 引き継ぎ調整

## ビジネス状態
- **要求受付中 [RequestReceiving] [REQUEST_RECEIVING]**: リソース要求を受付中
- **分析中 [Analyzing] [ANALYZING]**: 最適配置を分析中
- **承認待ち [PendingApproval] [PENDING_APPROVAL]**: 配置案の承認待ち
- **配置済み [Allocated] [ALLOCATED]**: リソースが配置された

## KPI（重要業績評価指標）
- スキルマッチング率: 85%以上
- 平均稼働率: 80-85%
- 配置リードタイム: 3日以内
- 満足度スコア: 4.0以上`,

  // 知識を組織資産化する能力
  knowledgeCapture: `# ビジネスオペレーション: プロジェクト知識を保全する [KnowledgeCapture] [KNOWLEDGE_CAPTURE]

## 基本情報
### 目的
プロジェクトで得られた貴重な知識・経験を確実に記録し、組織の知的資産として保全することで、将来の価値創造に繋げる

### ビジネスパターン
CRUD（作成・読取・更新・削除）- 知識の体系的な管理

### ビジネスゴール
- プロジェクト知識の完全な記録
- 暗黙知の形式知化
- 知識の品質保証
- 将来の活用可能性確保

## 関係者とロール
- **コンサルタント [Consultant] [CONSULTANT]**: 知識の提供者
- **ナレッジマネージャー [KnowledgeManager] [KNOWLEDGE_MANAGER]**: 知識の管理者
- **レビュアー [Reviewer] [REVIEWER]**: 品質確認者
- **プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]**: 承認者

## ビジネスプロセス
### 1. 知識抽出 [KnowledgeExtraction] [KNOWLEDGE_EXTRACTION]
- プロジェクト振り返り実施
- 成功要因の分析
- 失敗要因の分析
- ベストプラクティスの特定

### 2. 文書化 [Documentation] [DOCUMENTATION]
- ナレッジ記事の作成
- 図表・フローの作成
- タグ・カテゴリ設定
- 関連情報のリンク

### 3. 品質確認 [QualityAssurance] [QUALITY_ASSURANCE]
- 内容の正確性確認
- 機密情報の確認
- 可読性の向上
- 再利用性の検証

### 4. 承認・公開 [ApprovalPublication] [APPROVAL_PUBLICATION]
- レビュー実施
- フィードバック反映
- 最終承認取得
- 公開設定

## ビジネス状態
- **下書き [Draft] [DRAFT]**: 知識を記録中
- **レビュー中 [UnderReview] [UNDER_REVIEW]**: 品質確認中
- **承認済み [Approved] [APPROVED]**: 公開承認済み
- **公開済み [Published] [PUBLISHED]**: 組織内に公開済み

## KPI（重要業績評価指標）
- プロジェクト知識記録率: 100%
- 記録リードタイム: プロジェクト終了後1週間以内
- 品質スコア: 4.0以上
- 再利用件数: 月10件以上`
}

// ビジネスオペレーションの作成
export async function createBusinessOperations(capabilities: any[]) {
  console.log('  Creating business operations...')

  const operations = []

  // プロジェクトを成功に導く能力のオペレーション
  const projectCapability = capabilities.find(c => c.name === 'ProjectSuccess')
  if (projectCapability) {
    operations.push({
      serviceId: projectCapability.serviceId,
      capabilityId: projectCapability.id,
      name: 'ProjectPlanning',
      displayName: 'プロジェクトを的確に計画する',
      design: businessOperationDesigns.projectPlanning,
      pattern: 'Workflow',
      goal: 'クライアントの要求を正確に把握し、実現可能で価値を最大化するプロジェクト計画を立案する',
      roles: JSON.stringify(['ProjectManager', 'BusinessAnalyst', 'SolutionArchitect', 'ClientStakeholder']),
      operations: JSON.stringify({
        steps: ['RequirementGathering', 'RequirementDefinition', 'PlanFormulation', 'RiskAnalysis', 'ApprovalObtaining']
      }),
      businessStates: JSON.stringify(['Planning', 'UnderReview', 'Approved', 'Rejected']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    })

    operations.push({
      serviceId: projectCapability.serviceId,
      capabilityId: projectCapability.id,
      name: 'ProjectProgress',
      displayName: 'プロジェクト進捗を可視化する',
      design: businessOperationDesigns.projectProgress,
      pattern: 'Analytics',
      goal: 'プロジェクトの進行状況をリアルタイムに把握し、ステークホルダーに正確な情報を提供する',
      roles: JSON.stringify(['ProjectManager', 'TeamMember', 'Executive', 'Client']),
      operations: JSON.stringify({
        steps: ['ProgressCollection', 'ProgressAnalysis', 'ReportCreation', 'InformationSharing']
      }),
      businessStates: JSON.stringify(['Collecting', 'Analyzing', 'Shared', 'Responding']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    })
  }

  // チームの生産性を最大化する能力のオペレーション
  const teamCapability = capabilities.find(c => c.name === 'TeamProductivity')
  if (teamCapability) {
    operations.push({
      serviceId: teamCapability.serviceId,
      capabilityId: teamCapability.id,
      name: 'ResourceOptimization',
      displayName: 'リソースを最適配置する',
      design: businessOperationDesigns.resourceOptimization,
      pattern: 'Analytics',
      goal: 'プロジェクトのニーズとコンサルタントのスキル・稼働状況を考慮した最適配置',
      roles: JSON.stringify(['ResourceManager', 'ProjectManager', 'Consultant', 'SkillManager']),
      operations: JSON.stringify({
        steps: ['DemandAnalysis', 'SupplyAnalysis', 'Matching', 'AllocationExecution']
      }),
      businessStates: JSON.stringify(['RequestReceiving', 'Analyzing', 'PendingApproval', 'Allocated']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    })
  }

  // 知識を組織資産化する能力のオペレーション
  const knowledgeCapability = capabilities.find(c => c.name === 'KnowledgeAsset')
  if (knowledgeCapability) {
    operations.push({
      serviceId: knowledgeCapability.serviceId,
      capabilityId: knowledgeCapability.id,
      name: 'KnowledgeCapture',
      displayName: 'プロジェクト知識を保全する',
      design: businessOperationDesigns.knowledgeCapture,
      pattern: 'CRUD',
      goal: 'プロジェクトで得られた知識を確実に記録し組織の知的資産として保全する',
      roles: JSON.stringify(['Consultant', 'KnowledgeManager', 'Reviewer', 'ProjectManager']),
      operations: JSON.stringify({
        steps: ['KnowledgeExtraction', 'Documentation', 'QualityAssurance', 'ApprovalPublication']
      }),
      businessStates: JSON.stringify(['Draft', 'UnderReview', 'Approved', 'Published']),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    })
  }

  const createdOperations = []
  for (const operation of operations) {
    const created = await parasolDb.businessOperation.create({
      data: operation
    })
    createdOperations.push(created)
  }

  return createdOperations
}