import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAnalyzeUtilization(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 稼働率を分析する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'AnalyzeUtilization',
      displayName: '稼働率を分析する',
      design: `# ビジネスオペレーション: 稼働率を分析する [AnalyzeUtilization] [ANALYZE_UTILIZATION]

## オペレーション概要

### 目的
コンサルタントとチームの稼働状況を多角的に分析し、リソースの最適配分と収益性向上のための意思決定を支援する

### ビジネス価値
- **収益性向上**: 最適な稼働率維持により売上15%向上、機会損失30%削減
- **リソース最適化**: 過負荷・低稼働の早期発見により配置転換を50%高速化
- **予測精度向上**: 将来の稼働予測精度を85%に向上、計画的な採用・育成を実現

### 実行頻度
- **頻度**: 日次（ダッシュボード）、週次（詳細分析）、月次（経営報告）
- **トリガー**: 定期レポート、異常値検知、リソース計画策定時
- **所要時間**: 基本分析10分、詳細分析1-2時間

## ロールと責任

### 関与者
- リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]
  - 責任: 全社稼働率の監視、最適化施策の立案、異常対応
  - 権限: 全データアクセス、配置変更提案、レポート作成

- 部門長 [DepartmentHead] [DEPARTMENT_HEAD]
  - 責任: 部門稼働率の管理、収益性確保、人材育成
  - 権限: 部門データ閲覧、目標設定、施策承認

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: チーム稼働率の管理、プロジェクト計画調整
  - 権限: プロジェクトデータ閲覧、メンバー調整要請

- 経営層 [Executive] [EXECUTIVE]
  - 責任: 稼働率目標の設定、経営判断、投資決定
  - 権限: 全社データ閲覧、戦略決定

### RACI マトリクス
| ステップ | RM | 部門長 | PM | 経営層 |
|---------|-----|-------|-----|--------|
| データ収集 | R | I | C | I |
| 分析実施 | R | C | I | I |
| 問題特定 | R | A | C | I |
| 施策立案 | R | A | C | I |
| 意思決定 | C | R | I | A |
| 施策実行 | A | R | R | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：分析タイミング]
  ↓
[ステップ1：データ収集]
  ↓
[ステップ2：稼働率算出]
  ↓
[ステップ3：トレンド分析]
  ↓
[ステップ4：問題領域特定]
  ↓
[判断：改善必要？]
  ├─ Yes → [ステップ5：原因分析]
  └─ No  → [ステップ7：レポート作成]
  ↓
[ステップ6：改善施策立案]
  ↓
[ステップ7：レポート作成]
  ↓
[終了：分析完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: データ収集 [CollectUtilizationData] [COLLECT_UTILIZATION_DATA]
- **目的**: 稼働率分析に必要な各種データを収集・統合
- **入力**: 期間指定、分析対象範囲
- **活動**:
  1. 承認済み工数データを抽出
  2. プロジェクト配置情報を取得
  3. 勤務カレンダーから稼働可能時間を算出
  4. 休暇・研修等の非稼働時間を考慮
  5. 請求可能/不可の区分別に集計
- **出力**: 統合稼働データセット
- **所要時間**: 5-10分（自動化済み）

#### ステップ2: 稼働率算出 [CalculateUtilizationRates] [CALCULATE_UTILIZATION_RATES]
- **目的**: 各種稼働率指標を正確に算出
- **入力**: 統合稼働データセット
- **活動**:
  1. 個人別稼働率 = 実稼働時間 / 稼働可能時間
  2. 請求可能稼働率 = 請求可能時間 / 実稼働時間
  3. プロジェクト稼働率 = プロジェクト時間 / 実稼働時間
  4. チーム/部門/全社の平均稼働率を算出
  5. 目標稼働率との差異を計算
- **出力**: 稼働率指標一覧（多次元）
- **所要時間**: 5分（自動計算）

#### ステップ3: トレンド分析 [AnalyzeTrends] [ANALYZE_TRENDS]
- **目的**: 稼働率の時系列変化と将来予測
- **入力**: 稼働率履歴データ（過去6ヶ月以上）
- **活動**:
  1. 日次・週次・月次の推移をグラフ化
  2. 季節性やサイクルを特定
  3. 移動平均で傾向を把握
  4. 将来3ヶ月の稼働率を予測
  5. 異常なスパイクや落ち込みを検出
- **出力**: トレンドレポート、予測値
- **所要時間**: 10-15分

#### ステップ4: 問題領域特定 [IdentifyProblemAreas] [IDENTIFY_PROBLEM_AREAS]
- **目的**: 改善が必要な領域を特定
- **入力**: 稼働率指標、トレンド分析結果
- **活動**:
  1. 低稼働者（70%未満）をリストアップ
  2. 過負荷者（100%超）を特定
  3. 請求可能率が低いプロジェクトを抽出
  4. 部門間の稼働率格差を確認
  5. ベンチマークとの比較
- **出力**: 問題領域リスト（優先度付き）
- **所要時間**: 15-20分

#### ステップ5: 原因分析 [AnalyzeRootCauses] [ANALYZE_ROOT_CAUSES]
- **目的**: 稼働率問題の根本原因を特定
- **入力**: 問題領域リスト、詳細データ
- **活動**:
  1. 低稼働の原因調査（スキルミスマッチ、案件不足等）
  2. 過負荷の原因特定（人員不足、計画ミス等）
  3. プロジェクト別の詳細分析
  4. 個人別ヒアリング実施（必要に応じて）
  5. 外部要因の影響評価
- **出力**: 原因分析レポート
- **所要時間**: 1-2時間

#### ステップ6: 改善施策立案 [DevelopImprovementPlans] [DEVELOP_IMPROVEMENT_PLANS]
- **目的**: 具体的な改善アクションを策定
- **入力**: 原因分析レポート、利用可能リソース
- **活動**:
  1. 人員再配置計画の策定
  2. スキル開発プログラムの提案
  3. 新規採用計画の立案
  4. プロジェクト計画の見直し提案
  5. 実施スケジュールとKPI設定
- **出力**: 改善施策計画書
- **所要時間**: 2-3時間

#### ステップ7: レポート作成 [CreateUtilizationReport] [CREATE_UTILIZATION_REPORT]
- **目的**: 分析結果を関係者向けにレポート化
- **入力**: 全分析結果、改善施策
- **活動**:
  1. エグゼクティブサマリーの作成
  2. 詳細分析結果の可視化（グラフ・表）
  3. 問題点と改善提案のまとめ
  4. 次のアクションの明確化
  5. 配布先別にカスタマイズ
- **出力**: 稼働率分析レポート（複数版）
- **所要時間**: 30分-1時間

## 状態遷移

### 状態定義
- 未分析 [NotAnalyzed] [NOT_ANALYZED]: データは存在するが分析未実施
- 分析中 [Analyzing] [ANALYZING]: 分析処理実行中
- 分析完了 [AnalysisComplete] [ANALYSIS_COMPLETE]: 分析完了、レビュー待ち
- レビュー済み [Reviewed] [REVIEWED]: 管理層によるレビュー完了
- 施策実行中 [ActionInProgress] [ACTION_IN_PROGRESS]: 改善施策実行中
- クローズ [Closed] [CLOSED]: 分析サイクル完了

### 遷移条件
\`\`\`
未分析 --[分析開始]--> 分析中
分析中 --[処理完了]--> 分析完了
分析完了 --[レビュー実施]--> レビュー済み
レビュー済み --[施策承認]--> 施策実行中
レビュー済み --[施策不要]--> クローズ
施策実行中 --[施策完了]--> クローズ
クローズ --[次期分析]--> 未分析
\`\`\`

## ビジネスルール

### 事前条件
1. 分析対象期間の工数データが承認済み
2. 組織構造とプロジェクト情報が最新
3. 稼働率目標値が設定されている
4. 分析ツールへのアクセス権限

### 実行中の制約
1. 個人情報保護（個人別データは権限者のみ）
2. 稼働率100%超の場合は要因調査必須
3. 3ヶ月連続で目標未達の場合は改善計画必須
4. データの外部持ち出し禁止
5. 分析結果の目的外使用禁止

### 事後条件
1. 分析レポートがアーカイブされている
2. 改善施策が追跡可能な状態
3. 次回分析予定が設定されている
4. 関係者への通知完了
5. KPIダッシュボードが更新されている

## パラソルドメインモデル

### エンティティ定義
- 稼働率分析 [UtilizationAnalysis] [UTILIZATION_ANALYSIS]
  - 分析ID、分析期間、分析日、分析者、対象範囲、ステータス
- 稼働率指標 [UtilizationMetric] [UTILIZATION_METRIC]
  - 指標ID、分析ID、対象（個人/チーム/部門）、稼働率、請求可能率、期間
- 改善施策 [ImprovementAction] [IMPROVEMENT_ACTION]
  - 施策ID、分析ID、施策内容、責任者、期限、効果測定指標、ステータス

### 値オブジェクト
- 稼働率 [UtilizationRate] [UTILIZATION_RATE]
  - パーセンテージ（0-150%）、算出方法、信頼度
- 分析期間 [AnalysisPeriod] [ANALYSIS_PERIOD]
  - 開始日、終了日、営業日数、分析頻度

## KPI

1. **平均稼働率**: 組織全体の稼働率
   - 目標値: 85-90%
   - 測定方法: 全コンサルタントの稼働率の加重平均
   - 測定頻度: 日次

2. **請求可能稼働率**: 請求可能な作業の割合
   - 目標値: 75%以上
   - 測定方法: 請求可能時間 / 総稼働時間
   - 測定頻度: 週次

3. **稼働率偏差**: 個人間の稼働率のばらつき
   - 目標値: 標準偏差15%以内
   - 測定方法: 個人稼働率の標準偏差
   - 測定頻度: 月次

4. **改善効果**: 施策による稼働率改善度
   - 目標値: 施策実施後3ヶ月で10%改善
   - 測定方法: 施策前後の稼働率差分
   - 測定頻度: 四半期

5. **予測精度**: 稼働率予測の的中率
   - 目標値: 誤差±5%以内
   - 測定方法: |予測値 - 実績値| / 実績値
   - 測定頻度: 月次`,
      pattern: 'Analytics',
      goal: '稼働データを多角的に分析し、リソースの最適配分と収益性向上を実現する',
      roles: JSON.stringify([
        { name: 'ResourceManager', displayName: 'リソースマネージャー', systemName: 'RESOURCE_MANAGER' },
        { name: 'DepartmentHead', displayName: '部門長', systemName: 'DEPARTMENT_HEAD' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'Executive', displayName: '経営層', systemName: 'EXECUTIVE' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CollectUtilizationData', displayName: 'データ収集', systemName: 'COLLECT_UTILIZATION_DATA' },
          { name: 'CalculateUtilizationRates', displayName: '稼働率算出', systemName: 'CALCULATE_UTILIZATION_RATES' },
          { name: 'AnalyzeTrends', displayName: 'トレンド分析', systemName: 'ANALYZE_TRENDS' },
          { name: 'IdentifyProblemAreas', displayName: '問題領域特定', systemName: 'IDENTIFY_PROBLEM_AREAS' },
          { name: 'AnalyzeRootCauses', displayName: '原因分析', systemName: 'ANALYZE_ROOT_CAUSES' },
          { name: 'DevelopImprovementPlans', displayName: '改善施策立案', systemName: 'DEVELOP_IMPROVEMENT_PLANS' },
          { name: 'CreateUtilizationReport', displayName: 'レポート作成', systemName: 'CREATE_UTILIZATION_REPORT' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotAnalyzed', displayName: '未分析', systemName: 'NOT_ANALYZED' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'AnalysisComplete', displayName: '分析完了', systemName: 'ANALYSIS_COMPLETE' },
        { name: 'Reviewed', displayName: 'レビュー済み', systemName: 'REVIEWED' },
        { name: 'ActionInProgress', displayName: '施策実行中', systemName: 'ACTION_IN_PROGRESS' },
        { name: 'Closed', displayName: 'クローズ', systemName: 'CLOSED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}