import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// タイムシート管理サービスの完全なパラソルデータ
export async function seedTimesheetServiceFullParasol() {
  console.log('  Seeding timesheet-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'timesheet-management' }
  })
  
  if (existingService) {
    console.log('  タイムシート管理サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'timesheet-management',
      displayName: 'タイムシート管理サービス',
      description: '工数の記録、承認、分析を通じて稼働状況を可視化',

      domainLanguage: JSON.stringify({}),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: 工数を正確に把握する能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'TimeTrackingAccuracyCapability',
      displayName: '工数を正確に把握する能力',
      description: 'コンサルタントの作業時間を正確に記録・承認・分析し、プロジェクト収益性の可視化と請求の適正化を実現する能力',
      definition: `# ビジネスケーパビリティ: 工数を正確に把握する能力 [TimeTrackingAccuracyCapability] [TIME_TRACKING_ACCURACY_CAPABILITY]

## ケーパビリティ概要

### 定義
コンサルタントが実施した作業時間を正確かつタイムリーに記録し、適切な承認プロセスを経て確定することで、プロジェクトの実績工数を可視化し、収益性分析と適正な請求を実現する組織的能力。

### ビジネス価値
- **直接的価値**: 請求漏れ削減による売上5%向上、工数記録時間50%削減、請求処理時間70%短縮
- **間接的価値**: プロジェクト収益性の可視化、リソース配分の最適化、予実差異の早期検出
- **戦略的価値**: データドリブンな意思決定の基盤、コスト構造の透明化、プロジェクト見積もり精度向上

### 成熟度レベル
- **現在**: レベル2（管理段階） - 基本的な工数入力と承認プロセスが存在
- **目標**: レベル4（予測可能段階） - 工数データに基づく予測分析と自動化を実現（2025年Q4）

## ビジネスオペレーション群

### 工数記録グループ
- 工数を記録する [RecordTimeEntries] [RECORD_TIME_ENTRIES]
  - 目的: コンサルタントが日々の作業時間を正確かつ容易に記録
- 工数を修正する [CorrectTimeEntries] [CORRECT_TIME_ENTRIES]
  - 目的: 誤入力や変更を適切なプロセスで修正

### 承認管理グループ
- 工数を承認する [ApproveTimeEntries] [APPROVE_TIME_ENTRIES]
  - 目的: PMやマネージャーが工数の妥当性を確認し承認
- 工数を差し戻す [RejectTimeEntries] [REJECT_TIME_ENTRIES]
  - 目的: 不適切な工数を適切な理由とともに差し戻し修正を促す
- 工数を確定する [FinalizeTimeEntries] [FINALIZE_TIME_ENTRIES]
  - 目的: 承認済み工数を確定し請求・分析に利用可能にする

### 分析・レポートグループ
- 工数を分析する [AnalyzeTimeUtilization] [ANALYZE_TIME_UTILIZATION]
  - 目的: プロジェクト別・メンバー別の工数実績を分析し洞察を得る
- 工数レポートを生成する [GenerateTimeReports] [GENERATE_TIME_REPORTS]
  - 目的: ステークホルダー向けの工数レポートを自動生成
- 予実差異を検出する [DetectVariances] [DETECT_VARIANCES]
  - 目的: 計画工数と実績工数の乖離を早期に検出しアラート

## 関連ケーパビリティ

### 前提ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 依存理由: プロジェクトとタスクの構造が明確である必要がある
- リソースを最適配置する能力 [TeamProductivityCapability] [TEAM_PRODUCTIVITY_CAPABILITY]
  - 依存理由: コンサルタントのプロジェクト配置情報が前提

### 連携ケーパビリティ
- 収益性を最適化する能力 [ProfitabilityOptimizationCapability] [PROFITABILITY_OPTIMIZATION_CAPABILITY]
  - 連携価値: 工数データが収益性分析の基礎となる
- クライアントに請求する能力 [BillingCapability] [BILLING_CAPABILITY]
  - 連携価値: 承認済み工数が請求の根拠となる

## パラソルドメインモデル概要

### 中核エンティティ
- 工数エントリ [TimeEntry] [TIME_ENTRY]
- 承認ワークフロー [ApprovalWorkflow] [APPROVAL_WORKFLOW]
- 工数期間 [TimesheetPeriod] [TIMESHEET_PERIOD]
- 工数カテゴリ [TimeCategory] [TIME_CATEGORY]

### 主要な集約
- 工数エントリ集約（工数エントリ、承認履歴、修正履歴）
- 承認ワークフロー集約（承認ステップ、承認者、承認期限）
- 期間集約（期間、締め状態、確定日）

## 評価指標（KPI）

1. **工数記録率**: 工数入力が期限内に完了した割合
   - 目標値: 95%以上
   - 測定方法: (期限内記録日数 / 営業日数) × 100
   - 測定頻度: 週次

2. **工数承認リードタイム**: 入力から承認までの平均日数
   - 目標値: 3営業日以内
   - 測定方法: 承認日 - 入力日の平均
   - 測定頻度: 週次

3. **工数差し戻し率**: 差し戻された工数の割合
   - 目標値: 5%未満
   - 測定方法: (差し戻し件数 / 全工数エントリ数) × 100
   - 測定頻度: 月次

4. **請求可能工数率**: 全工数に占める請求可能工数の割合
   - 目標値: 75%以上
   - 測定方法: (請求可能工数 / 全工数) × 100
   - 測定頻度: 月次

5. **予実差異率**: 計画工数と実績工数の乖離度
   - 目標値: ±10%以内
   - 測定方法: |(実績工数 - 計画工数) / 計画工数| × 100
   - 測定頻度: 週次

## 必要なリソース

### 人的リソース
- **コンサルタント**: 日々の工数入力
  - 人数: 全コンサルタント
  - スキル要件: 工数入力の正確性、時間管理意識

- **プロジェクトマネージャー**: 工数承認
  - 人数: 全PM
  - スキル要件: 工数妥当性判断、プロジェクト状況把握

- **タイムシート管理者**: 工数管理全体の統制
  - 人数: 組織全体で1-2名
  - スキル要件: プロセス管理、データ分析、システム運用

### 技術リソース
- **工数管理システム**: 工数入力・承認・分析の一元管理
  - 用途: 工数記録、承認ワークフロー、レポート生成
  - 要件: モバイル対応、直感的UI、リアルタイム集計

- **承認ワークフローエンジン**: 柔軟な承認プロセス
  - 用途: 多段階承認、自動エスカレーション、通知
  - 要件: 組織階層対応、期限管理、監査ログ

- **分析ダッシュボード**: 工数データの可視化
  - 用途: リアルタイム工数状況、予実比較、異常検知
  - 要件: ドリルダウン、カスタマイズ可能

### 情報リソース
- **プロジェクトWBS**: 工数入力対象のタスク体系
  - 用途: 工数入力先の特定
  - 更新頻度: プロジェクト計画更新時

- **承認ルール定義**: 組織の承認フロー
  - 用途: 自動ルーティング
  - 更新頻度: 組織変更時

- **請求区分マスタ**: 請求可否の分類
  - 用途: 請求可能工数の自動判定
  - 更新頻度: 契約形態変更時

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- 工数管理システムの導入と定着
- 標準承認プロセスの確立
- 基本レポート機能の実装
- モバイルアプリの提供

### Phase 2: 機能拡張（2024 Q3-Q4）
- AI活用による工数入力支援（パターン学習）
- リアルタイム予実差異アラート
- プロジェクト収益性ダッシュボード
- 自動承認ルールの導入

### Phase 3: 最適化（2025 Q1-Q2）
- 予測分析による工数予測
- 異常工数の自動検出
- 工数最適化の推奨機能
- 外部システム連携（給与・請求）`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedTimesheetOperationsFull } = await import('./timesheet-operations-full')
  await seedTimesheetOperationsFull(service, capability)
  
  return { service, capability }
}