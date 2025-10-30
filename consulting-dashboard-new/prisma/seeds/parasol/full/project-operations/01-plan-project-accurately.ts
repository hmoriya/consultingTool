import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedPlanProjectAccurately(service: any, capability: any) {
  console.log('    Creating business operation: プロジェクトを的確に計画する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'PlanProjectAccurately',
      displayName: 'プロジェクトを的確に計画する',
      design: `# ビジネスオペレーション: プロジェクトを的確に計画する [PlanProjectAccurately] [PLAN_PROJECT_ACCURATELY]

## オペレーション概要

### 目的
クライアントの経営課題と要求を正確に把握し、実現可能で価値を最大化するプロジェクト計画を立案する

### ビジネス価値
- **効率性向上**: 明確な計画により手戻りを50%削減、計画時間を30%短縮
- **品質向上**: 要求漏れを90%削減、ステークホルダー合意形成率95%達成
- **リスク低減**: 計画段階でのリスク特定率80%向上、プロジェクト失敗率を30%削減

### 実行頻度
- **頻度**: プロジェクト開始時（必須）、大きなスコープ変更時（随時）
- **トリガー**: 新規プロジェクト受注確定、クライアントからの正式依頼
- **所要時間**: 2-4週間（プロジェクト規模による）

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 計画全体の統括、ステークホルダー調整、最終承認取得
  - 権限: プロジェクトスコープ決定、リソース配分決定、計画承認申請

- ビジネスアナリスト [BusinessAnalyst] [BUSINESS_ANALYST]
  - 責任: 要求収集、要件定義、ビジネスオペレーション分析
  - 権限: 要件の優先順位提案、実現性評価

- ソリューションアーキテクト [SolutionArchitect] [SOLUTION_ARCHITECT]
  - 責任: 技術的実現性評価、アーキテクチャ設計、技術リスク評価
  - 権限: 技術方式決定、技術的制約の明示

- クライアントステークホルダー [ClientStakeholder] [CLIENT_STAKEHOLDER]
  - 責任: 要求提供、要件確認、計画承認
  - 権限: 最終意思決定、予算承認

### RACI マトリクス
| ステップ | PM | BA | SA | クライアント |
|---------|----|----|----| ------------|
| 要求収集 | A | R | C | C |
| 要件定義 | A | R | C | C |
| 計画策定 | R | C | C | I |
| リスク分析 | R | C | R | I |
| 承認取得 | R | C | I | A |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：プロジェクト受注] 
  ↓
[ステップ1：要求収集] 
  ↓
[ステップ2：要件定義]
  ↓
[ステップ3：WBS作成]
  ↓
[ステップ4：スケジュール策定]
  ↓
[ステップ5：リソース計画]
  ↓
[ステップ6：リスク分析]
  ↓
[判断：計画承認可能？]
  ↓ Yes
[ステップ7：承認取得] → [終了：計画承認]
  ↓ No
[代替：計画見直し] → [ステップ3へ戻る]
\`\`\`

### 各ステップの詳細

#### ステップ1: 要求収集 [RequirementGathering] [REQUIREMENT_GATHERING]
- **目的**: クライアントの経営課題、ビジネスゴール、期待を明確化
- **入力**: 提案書、契約書、クライアント組織情報
- **活動**:
  1. キーステークホルダーとのキックオフミーティング実施
  2. 現状分析（AS-IS）のためのヒアリング・観察
  3. 経営課題と解決の方向性の確認
  4. 期待される成果と成功基準の明確化
  5. 制約条件（予算・期限・リソース）の確認
- **出力**: 要求一覧、ステークホルダーマップ、初期スコープ定義書
- **所要時間**: 1-2週間

#### ステップ2: 要件定義 [RequirementDefinition] [REQUIREMENT_DEFINITION]
- **目的**: 要求を実現可能な要件として具体化・文書化
- **入力**: 要求一覧、ステークホルダーマップ
- **活動**:
  1. ビジネス要件の明確化（何を達成するか）
  2. 機能要件の定義（どのような機能が必要か）
  3. 非機能要件の定義（性能・セキュリティ等）
  4. 要件の優先順位付け（MoSCoW法等）
  5. 要件トレーサビリティマトリクスの作成
- **出力**: 要件定義書、要件トレーサビリティマトリクス
- **所要時間**: 1-2週間

#### ステップ3: WBS作成 [CreateWBS] [CREATE_WBS]
- **目的**: プロジェクトを管理可能な作業単位に分解
- **入力**: 要件定義書、過去の類似プロジェクトデータ
- **活動**:
  1. プロジェクトフェーズの定義
  2. 成果物の特定とリスト化
  3. 作業パッケージへの分解（レベル3-4まで）
  4. タスク間の依存関係の定義
  5. 各タスクの工数見積もり（三点見積法）
- **出力**: WBS（Work Breakdown Structure）、タスク一覧
- **所要時間**: 3-5日

#### ステップ4: スケジュール策定 [DevelopSchedule] [DEVELOP_SCHEDULE]
- **目的**: 実行可能なプロジェクトスケジュールを作成
- **入力**: WBS、タスク工数見積もり、リソース情報
- **活動**:
  1. クリティカルパスの特定（CPM法）
  2. マイルストーンの設定
  3. バッファーの設定（クリティカルチェーン法）
  4. ガントチャートの作成
  5. リソースレベリングの実施
- **出力**: プロジェクトスケジュール、ガントチャート、マイルストーン一覧
- **所要時間**: 2-3日

#### ステップ5: リソース計画 [PlanResources] [PLAN_RESOURCES]
- **目的**: 必要なリソースを特定し配置計画を立てる
- **入力**: WBS、スケジュール、組織のスキルマトリクス
- **活動**:
  1. 必要なスキルセットの特定
  2. 各タスクへの人員配置計画
  3. リソースヒストグラムの作成
  4. 外部リソース調達計画（必要に応じて）
  5. リソース配分の最適化
- **出力**: リソース配分計画、リソースヒストグラム
- **所要時間**: 2-3日

#### ステップ6: リスク分析 [AnalyzeRisks] [ANALYZE_RISKS]
- **目的**: プロジェクトリスクを特定し対応策を立案
- **入力**: プロジェクト計画全体、過去のリスクデータ
- **活動**:
  1. リスクブレインストーミングの実施
  2. リスクの分類（技術・組織・外部等）
  3. 発生確率と影響度の評価（リスクマトリクス）
  4. 対応策の立案（回避・軽減・転嫁・受容）
  5. コンティンジェンシー予算の設定
- **出力**: リスク登録簿、リスク対応計画
- **所要時間**: 2-3日

#### ステップ7: 承認取得 [ObtainApproval] [OBTAIN_APPROVAL]
- **目的**: ステークホルダーから正式な計画承認を取得
- **入力**: 完成したプロジェクト計画書一式
- **活動**:
  1. 計画レビュー会議の開催
  2. ステークホルダーへのプレゼンテーション
  3. 質疑応答とフィードバック収集
  4. 必要に応じた計画の微調整
  5. 正式承認の文書化
- **出力**: 承認済みプロジェクト計画書、承認記録
- **所要時間**: 1週間

## 状態遷移

### 状態定義
- 未開始 [NotStarted] [NOT_STARTED]: プロジェクトが受注されたが計画作業未着手
- 要求収集中 [GatheringRequirements] [GATHERING_REQUIREMENTS]: クライアント要求を収集中
- 要件定義中 [DefiningRequirements] [DEFINING_REQUIREMENTS]: 要求を要件として具体化中
- 計画策定中 [DevelopingPlan] [DEVELOPING_PLAN]: WBS・スケジュール等を作成中
- レビュー中 [UnderReview] [UNDER_REVIEW]: ステークホルダーレビュー中
- 承認済み [Approved] [APPROVED]: 計画が正式に承認された
- 差し戻し [Rejected] [REJECTED]: 計画が差し戻され修正が必要

### 遷移条件
\`\`\`
未開始 --[受注確定・PM任命]--> 要求収集中
要求収集中 --[要求一覧完成]--> 要件定義中
要件定義中 --[要件定義書完成]--> 計画策定中
計画策定中 --[計画書完成]--> レビュー中
レビュー中 --[ステークホルダー承認]--> 承認済み
レビュー中 --[修正要求]--> 差し戻し
差し戻し --[修正完了]--> レビュー中
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクト受注が正式に確定している
2. プロジェクトマネージャーが任命されている
3. クライアントの主要ステークホルダーが特定されている
4. 基本的な予算・期限の枠組みが合意されている

### 実行中の制約
1. すべての要求は必ずステークホルダーに確認を取る
2. 技術的実現性が不明な要件は必ずアーキテクトの評価を受ける
3. 予算制約を超える計画は上位承認が必要
4. リスクは必ず定量評価（発生確率×影響度）を行う
5. 計画変更は変更管理プロセスに従う

### 事後条件
1. 要件定義書がステークホルダー承認済みである
2. WBSがレベル3以上まで分解されている
3. クリティカルパスが特定されている
4. 主要リスクが特定され対応策が定義されている
5. 正式な承認文書が取得されている

## パラソルドメインモデル

### エンティティ定義
- プロジェクト計画 [ProjectPlan] [PROJECT_PLAN]
  - 計画ID、プロジェクトID、バージョン、ステータス、承認日
- 要求 [Requirement] [REQUIREMENT]
  - 要求ID、カテゴリ、優先度、ソース、ステータス
- 要件 [Specification] [SPECIFICATION]
  - 要件ID、タイプ、詳細、受け入れ基準
- タスク [Task] [TASK]
  - タスクID、WBS番号、工数見積、開始日、終了日
- リスク [Risk] [RISK]
  - リスクID、カテゴリ、発生確率、影響度、対応策

### 値オブジェクト
- 工数見積 [EffortEstimate] [EFFORT_ESTIMATE]
  - 楽観値、最頻値、悲観値、期待値
- リスク評価 [RiskAssessment] [RISK_ASSESSMENT]
  - 発生確率（%）、影響度（1-5）、リスクスコア

## KPI

1. **要求カバレッジ率**: 収集した要求が要件として定義された割合
   - 目標値: 95%以上
   - 測定方法: (定義済み要件数 / 収集要求数) × 100
   - 測定頻度: 計画完了時

2. **計画承認リードタイム**: 受注から計画承認までの日数
   - 目標値: 4週間以内
   - 測定方法: 承認日 - 受注日
   - 測定頻度: プロジェクト開始時

3. **初回承認率**: 1回目のレビューで承認された計画の割合
   - 目標値: 80%以上
   - 測定方法: (初回承認数 / 全計画数) × 100
   - 測定頻度: 月次`,
      pattern: 'Workflow',
      goal: 'クライアントの要求を正確に把握し、実現可能で価値を最大化するプロジェクト計画を立案する',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'BusinessAnalyst', displayName: 'ビジネスアナリスト', systemName: 'BUSINESS_ANALYST' },
        { name: 'SolutionArchitect', displayName: 'ソリューションアーキテクト', systemName: 'SOLUTION_ARCHITECT' },
        { name: 'ClientStakeholder', displayName: 'クライアントステークホルダー', systemName: 'CLIENT_STAKEHOLDER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'RequirementGathering', displayName: '要求収集', systemName: 'REQUIREMENT_GATHERING' },
          { name: 'RequirementDefinition', displayName: '要件定義', systemName: 'REQUIREMENT_DEFINITION' },
          { name: 'CreateWBS', displayName: 'WBS作成', systemName: 'CREATE_WBS' },
          { name: 'DevelopSchedule', displayName: 'スケジュール策定', systemName: 'DEVELOP_SCHEDULE' },
          { name: 'PlanResources', displayName: 'リソース計画', systemName: 'PLAN_RESOURCES' },
          { name: 'AnalyzeRisks', displayName: 'リスク分析', systemName: 'ANALYZE_RISKS' },
          { name: 'ObtainApproval', displayName: '承認取得', systemName: 'OBTAIN_APPROVAL' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotStarted', displayName: '未開始', systemName: 'NOT_STARTED' },
        { name: 'GatheringRequirements', displayName: '要求収集中', systemName: 'GATHERING_REQUIREMENTS' },
        { name: 'DefiningRequirements', displayName: '要件定義中', systemName: 'DEFINING_REQUIREMENTS' },
        { name: 'DevelopingPlan', displayName: '計画策定中', systemName: 'DEVELOPING_PLAN' },
        { name: 'UnderReview', displayName: 'レビュー中', systemName: 'UNDER_REVIEW' },
        { name: 'Approved', displayName: '承認済み', systemName: 'APPROVED' },
        { name: 'Rejected', displayName: '差し戻し', systemName: 'REJECTED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}