import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedOptimizeCosts(service: any, capability: any) {
  console.log('    Creating business operation: コストを最適化する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'OptimizeCosts',
      displayName: 'コストを最適化する',
      design: `# ビジネスオペレーション: コストを最適化する [OptimizeCosts] [OPTIMIZE_COSTS]

## オペレーション概要

### 目的
プロジェクトに関連するすべてのコストを詳細に把握・管理し、予算統制を行うことで、プロジェクト収益性を最大化し、組織全体のコスト効率を継続的に改善する

### ビジネス価値
- **収益性向上**: プロジェクト利益率5-10%改善、コスト削減機会の発見
- **予算統制強化**: 予算超過リスク80%削減、早期アラートによる是正措置
- **意思決定支援**: コスト構造の可視化により投資判断精度向上

### 実行頻度
- **頻度**: 日次（工数入力）、週次（コスト集計）、月次（分析・報告）
- **トリガー**: 経費発生、外注発注、予算変更、異常値検知
- **所要時間**: 日次処理15分、週次集計1時間、月次分析2-3時間

## ロールと責任

### 関与者
- コストコントローラー [CostController] [COST_CONTROLLER]
  - 責任: コスト収集、分析、予算管理、レポート作成
  - 権限: コストデータ入力、予算設定、差異分析

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 予算策定、コスト承認、削減施策実行
  - 権限: 予算承認、支出承認、是正指示

- 調達担当者 [ProcurementOfficer] [PROCUREMENT_OFFICER]
  - 責任: 外注管理、購買交渉、コスト最適化
  - 権限: 発注承認、ベンダー選定、価格交渉

- 財務マネージャー [FinanceManager] [FINANCE_MANAGER]
  - 責任: コスト方針策定、全社最適化、監査対応
  - 権限: 方針決定、予算配分、例外承認

### RACI マトリクス
| ステップ | コントローラー | PM | 調達 | 財務マネージャー |
|---------|--------------|-----|------|----------------|
| 予算策定 | C | R | I | A |
| コスト収集 | R | I | C | I |
| 差異分析 | R | C | I | I |
| 是正措置 | C | R | C | A |
| コスト最適化 | R | C | C | A |
| 報告作成 | R | C | I | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始:コスト管理サイクル]
  ↓
[ステップ1:予算策定・配分]
  ↓
[ステップ2:コストデータ収集]
  ↓
[ステップ3:コスト集計・分類]
  ↓
[ステップ4:予実差異分析]
  ↓
[判断:予算超過リスク？]
  ├─ Yes → [ステップ5:是正措置実施]
  └─ No  → [ステップ6:コスト最適化検討]
  ↓
[ステップ7:コストレポート作成]
  ↓
[終了:次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: 予算策定・配分 [CreateAndAllocateBudget] [CREATE_AND_ALLOCATE_BUDGET]
- **目的**: プロジェクトの適正予算を策定し各費目に配分
- **入力**: プロジェクト計画、過去実績、市場相場
- **活動**:
  1. プロジェクトスコープの確認
  2. 必要リソースの洗い出し
  3. コスト項目別の積算
  4. リスクバッファーの設定
  5. 月次予算への展開
  6. 承認プロセスの実施
- **出力**: 承認済み予算、配分計画
- **所要時間**: 2-4時間

#### ステップ2: コストデータ収集 [CollectCostData] [COLLECT_COST_DATA]
- **目的**: 発生したすべてのコストを漏れなく正確に収集
- **入力**: 工数データ、経費精算、外注請求書
- **活動**:
  1. 人件費の算出（工数×単価）
  2. 直接経費の入力
  3. 外注費の記録
  4. 間接費の配賦
  5. 証憑の確認・保管
  6. データの妥当性チェック
- **出力**: コスト明細データ
- **所要時間**: 日次15-30分

#### ステップ3: コスト集計・分類 [AggregateAndCategorize] [AGGREGATE_AND_CATEGORIZE]
- **目的**: 収集したコストを管理可能な単位で集計・分類
- **入力**: コスト明細、勘定科目体系
- **活動**:
  1. プロジェクト別集計
  2. 費目別分類
  3. 部門別集計
  4. 期間別累計算出
  5. 原価計算の実施
  6. 異常値の検出
- **出力**: コスト集計表、分析用データ
- **所要時間**: 週次1時間

#### ステップ4: 予実差異分析 [AnalyzeBudgetVariance] [ANALYZE_BUDGET_VARIANCE]
- **目的**: 予算と実績の差異を分析し原因を特定
- **入力**: 予算データ、実績データ、プロジェクト進捗
- **活動**:
  1. 項目別差異の算出
  2. 差異要因の分析
  3. トレンド分析
  4. 将来予測の更新
  5. リスクの評価
  6. 改善機会の特定
- **出力**: 差異分析レポート、リスク評価
- **所要時間**: 2-3時間

#### ステップ5: 是正措置実施 [ImplementCorrectiveActions] [IMPLEMENT_CORRECTIVE_ACTIONS]
- **目的**: 予算超過を防ぐための具体的措置を実行
- **入力**: 差異分析結果、リスク評価
- **活動**:
  1. 是正オプションの検討
  2. 影響度の評価
  3. 実施計画の策定
  4. ステークホルダー調整
  5. 措置の実行
  6. 効果のモニタリング
- **出力**: 是正措置計画、実施記録
- **所要時間**: 1-2日

#### ステップ6: コスト最適化検討 [OptimizeCosts] [OPTIMIZE_COSTS]
- **目的**: 継続的なコスト削減機会を発見し実現
- **入力**: コスト構造分析、ベンチマーク
- **活動**:
  1. コスト構造の詳細分析
  2. 削減可能領域の特定
  3. 最適化施策の立案
  4. 費用対効果の試算
  5. 実施優先度の決定
  6. 改善施策の実行
- **出力**: 最適化提案、実施結果
- **所要時間**: 月次2-3時間

#### ステップ7: コストレポート作成 [GenerateCostReport] [GENERATE_COST_REPORT]
- **目的**: 経営層向けにコスト状況を可視化し報告
- **入力**: 集計データ、分析結果、改善施策
- **活動**:
  1. エグゼクティブサマリー作成
  2. コストトレンドの可視化
  3. 主要KPIの算出
  4. 問題点と対策の整理
  5. 次期見通しの作成
  6. プレゼンテーション準備
- **出力**: コスト管理レポート、ダッシュボード
- **所要時間**: 2-3時間

## 状態遷移

### 状態定義
- 予算策定中 [BudgetPlanning] [BUDGET_PLANNING]: 予算を計画中
- 予算承認済 [BudgetApproved] [BUDGET_APPROVED]: 予算が承認された
- 実行中 [Executing] [EXECUTING]: コスト発生・記録中
- 分析中 [Analyzing] [ANALYZING]: 差異分析実施中
- 是正中 [Correcting] [CORRECTING]: 是正措置実行中
- 最適化中 [Optimizing] [OPTIMIZING]: コスト最適化実施中
- 報告済 [Reported] [REPORTED]: 月次報告完了

### 遷移条件
\`\`\`
予算策定中 --[承認取得]--> 予算承認済
予算承認済 --[プロジェクト開始]--> 実行中
実行中 --[集計タイミング]--> 分析中
分析中 --[超過リスクあり]--> 是正中
分析中 --[正常範囲内]--> 最適化中
是正中 --[措置完了]--> 実行中
最適化中 --[月次締め]--> 報告済
報告済 --[新月度]--> 実行中
\`\`\`

## ビジネスルール

### 事前条件
1. 承認された予算が存在する
2. コスト収集プロセスが確立
3. 勘定科目体系が定義済み
4. 承認権限が明確

### 実行中の制約
1. 予算超過には事前承認必須
2. 証憑なき支出は計上不可
3. 職務分離原則の遵守
4. 調達規程の遵守
5. 為替・税務ルールの適用

### 事後条件
1. すべてのコストが記録されている
2. 予実差異が説明されている
3. 監査証跡が保管されている
4. 改善施策が実行されている
5. 次期予算に反映されている

## パラソルドメインモデル

### エンティティ定義
- 予算 [Budget] [BUDGET]
  - 予算ID、プロジェクトID、期間、総額、費目別内訳、承認状態
- コスト実績 [ActualCost] [ACTUAL_COST]
  - コストID、プロジェクトID、発生日、金額、費目、承認状態
- コスト差異 [CostVariance] [COST_VARIANCE]
  - 差異ID、予算ID、期間、差異額、要因、対策
- 最適化施策 [OptimizationInitiative] [OPTIMIZATION_INITIATIVE]
  - 施策ID、内容、期待効果、実施状況、実績効果

### 値オブジェクト
- コスト費目 [CostCategory] [COST_CATEGORY]
  - 人件費、外注費、経費、間接費、予備費
- 承認ステータス [ApprovalStatus] [APPROVAL_STATUS]
  - 申請中、承認済、却下、条件付承認

## KPI

1. **予算遵守率**: 予算内でプロジェクトを完了した割合
   - 目標値: 90%以上
   - 測定方法: 予算内完了PJ数/全PJ数 × 100
   - 測定頻度: 月次

2. **コスト予測精度**: 月初予測と実績の乖離
   - 目標値: ±5%以内
   - 測定方法: |予測-実績|/予測 × 100
   - 測定頻度: 月次

3. **コスト削減率**: 最適化によるコスト削減効果
   - 目標値: 年間5%以上
   - 測定方法: 削減額/当初コスト × 100
   - 測定頻度: 四半期

4. **間接費比率**: 売上高に対する間接費の割合
   - 目標値: 15%以下
   - 測定方法: 間接費/売上高 × 100
   - 測定頻度: 月次

5. **コスト把握リードタイム**: 発生から記録までの日数
   - 目標値: 3営業日以内
   - 測定方法: 記録日-発生日の平均
   - 測定頻度: 週次`,
      pattern: 'CostManagement',
      goal: 'プロジェクトコストを詳細に管理し収益性を最大化する',
      roles: JSON.stringify([
        { name: 'CostController', displayName: 'コストコントローラー', systemName: 'COST_CONTROLLER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'ProcurementOfficer', displayName: '調達担当者', systemName: 'PROCUREMENT_OFFICER' },
        { name: 'FinanceManager', displayName: '財務マネージャー', systemName: 'FINANCE_MANAGER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CreateAndAllocateBudget', displayName: '予算策定・配分', systemName: 'CREATE_AND_ALLOCATE_BUDGET' },
          { name: 'CollectCostData', displayName: 'コストデータ収集', systemName: 'COLLECT_COST_DATA' },
          { name: 'AggregateAndCategorize', displayName: 'コスト集計・分類', systemName: 'AGGREGATE_AND_CATEGORIZE' },
          { name: 'AnalyzeBudgetVariance', displayName: '予実差異分析', systemName: 'ANALYZE_BUDGET_VARIANCE' },
          { name: 'ImplementCorrectiveActions', displayName: '是正措置実施', systemName: 'IMPLEMENT_CORRECTIVE_ACTIONS' },
          { name: 'OptimizeCosts', displayName: 'コスト最適化検討', systemName: 'OPTIMIZE_COSTS' },
          { name: 'GenerateCostReport', displayName: 'コストレポート作成', systemName: 'GENERATE_COST_REPORT' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'BudgetPlanning', displayName: '予算策定中', systemName: 'BUDGET_PLANNING' },
        { name: 'BudgetApproved', displayName: '予算承認済', systemName: 'BUDGET_APPROVED' },
        { name: 'Executing', displayName: '実行中', systemName: 'EXECUTING' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'Correcting', displayName: '是正中', systemName: 'CORRECTING' },
        { name: 'Optimizing', displayName: '最適化中', systemName: 'OPTIMIZING' },
        { name: 'Reported', displayName: '報告済', systemName: 'REPORTED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}