import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 財務管理サービスの完全なパラソルデータ
export async function seedFinanceServiceFullParasol() {
  console.log('  Seeding finance-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'finance-management' }
  })
  
  if (existingService) {
    console.log('  財務管理サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'finance-management',
      displayName: '財務管理サービス',
      description: 'プロジェクト収支、コスト管理、収益性分析を支援',

      domainLanguage: JSON.stringify({}),
      apiSpecification: JSON.stringify({}),
      dbSchema: JSON.stringify({})
    }
  })
  
  // ビジネスケーパビリティ: 収益性を最適化する能力
  const capability = await parasolDb.businessCapability.create({
    data: {
      serviceId: service.id,
      name: 'ProfitabilityOptimizationCapability',
      displayName: '収益性を最適化する能力',
      description: 'プロジェクトの収益・コスト・請求を正確に管理し、収益性を可視化して経営判断を支援する能力',
      definition: `# ビジネスケーパビリティ: 収益性を最適化する能力 [ProfitabilityOptimizationCapability] [PROFITABILITY_OPTIMIZATION_CAPABILITY]

## ケーパビリティ概要

### 定義
プロジェクトごとの収益、コスト、請求を正確に記録・分析し、リアルタイムで収益性を可視化することで、経営層・PMの意思決定を支援し、組織全体の収益性を最大化する組織的能力。

### ビジネス価値
- **直接的価値**: 収益性の可視化による利益率5%向上、請求漏れ削減により売上3%増、コスト超過の早期検知
- **間接的価値**: データドリブンな意思決定、赤字プロジェクトの早期発見と対処、見積もり精度向上
- **戦略的価値**: 財務健全性の維持、投資判断の最適化、ステークホルダーへの透明性確保

### 成熟度レベル
- **現在**: レベル2（管理段階） - 基本的な収益とコストの記録が存在
- **目標**: レベル4（予測可能段階） - AIによる収益予測と最適化推奨の実現（2025年Q4）

## ビジネスオペレーション群

### 収益管理グループ
- 収益を計上する [RecognizeRevenue] [RECOGNIZE_REVENUE]
  - 目的: プロジェクトの売上を正確に計上
- 請求可能額を算出する [CalculateBillableAmount] [CALCULATE_BILLABLE_AMOUNT]
  - 目的: 工数と契約に基づき請求金額を計算
- 請求書を発行する [IssueInvoices] [ISSUE_INVOICES]
  - 目的: クライアントへ請求書を発行し入金を管理

### コスト管理グループ
- コストを記録する [RecordCosts] [RECORD_COSTS]
  - 目的: プロジェクトに発生したコストを記録
- 人件費を配賦する [AllocateLaborCosts] [ALLOCATE_LABOR_COSTS]
  - 目的: 工数に基づき人件費をプロジェクトに配賦
- 経費を精算する [SettleExpenses] [SETTLE_EXPENSES]
  - 目的: 交通費・経費を精算しプロジェクトコストに計上

### 収益性分析グループ
- 収益性を分析する [AnalyzeProfitability] [ANALYZE_PROFITABILITY]
  - 目的: プロジェクト別・期間別の収益性を分析
- 予実管理をする [ManageBudgetVsActual] [MANAGE_BUDGET_VS_ACTUAL]
  - 目的: 予算と実績の差異を監視し早期対処
- 収益を予測する [ForecastRevenue] [FORECAST_REVENUE]
  - 目的: 今後の収益とキャッシュフローを予測

## 関連ケーパビリティ

### 前提ケーパビリティ
- プロジェクトを成功に導く能力 [ProjectSuccessCapability] [PROJECT_SUCCESS_CAPABILITY]
  - 依存理由: プロジェクト情報が財務データの基盤
- 工数を正確に把握する能力 [TimeTrackingAccuracyCapability] [TIME_TRACKING_ACCURACY_CAPABILITY]
  - 依存理由: 工数データが人件費計算と請求の根拠

### 連携ケーパビリティ
- リソースを最適配置する能力 [TeamProductivityCapability] [TEAM_PRODUCTIVITY_CAPABILITY]
  - 連携価値: リソース配置の最適化がコスト削減に直結
- 契約を管理する能力 [ContractManagementCapability] [CONTRACT_MANAGEMENT_CAPABILITY]
  - 連携価値: 契約条件が請求と収益計上の基準

## パラソルドメインモデル概要

### 中核エンティティ
- 収益 [Revenue] [REVENUE]
- コスト [Cost] [COST]
- 請求書 [Invoice] [INVOICE]
- 予算 [Budget] [BUDGET]
- 経費 [Expense] [EXPENSE]

### 主要な集約
- 収益集約（収益、請求、入金）
- コスト集約（コスト、経費、配賦）
- 予算集約（予算、実績、差異）

## 評価指標（KPI）

1. **全社営業利益率**: 全プロジェクトの営業利益率
   - 目標値: 25%以上
   - 測定方法: (営業利益 / 売上高) × 100
   - 測定頻度: 月次

2. **プロジェクト収益性達成率**: 目標利益率を達成したプロジェクトの割合
   - 目標値: 80%以上
   - 測定方法: (目標達成プロジェクト数 / 全プロジェクト数) × 100
   - 測定頻度: 月次

3. **請求サイクルタイム**: 作業完了から請求書発行までの日数
   - 目標値: 5営業日以内
   - 測定方法: 請求書発行日 - 作業完了日
   - 測定頻度: 月次

4. **予実差異率**: 予算と実績の乖離度
   - 目標値: ±10%以内
   - 測定方法: |(実績 - 予算) / 予算| × 100
   - 測定頻度: 月次

5. **入金遅延率**: 支払期限を超過した請求の割合
   - 目標値: 5%未満
   - 測定方法: (遅延請求数 / 全請求数) × 100
   - 測定頻度: 月次

## 必要なリソース

### 人的リソース
- **経理担当者**: 財務データの記録と管理
  - 人数: 2-3名
  - スキル要件: 会計知識、簿記資格、システム操作

- **財務アナリスト**: 収益性分析とレポート作成
  - 人数: 1-2名
  - スキル要件: 財務分析、データ分析、レポーティング

- **プロジェクトマネージャー**: プロジェクト財務の管理
  - 人数: 全PM
  - スキル要件: 予算管理、コスト意識、財務理解

### 技術リソース
- **会計システム**: 収益・コストの記録と管理
  - 用途: 仕訳入力、総勘定元帳、財務諸表
  - 要件: 会計基準準拠、監査対応

- **財務分析ダッシュボード**: 収益性の可視化
  - 用途: プロジェクト別損益、予実管理、予測
  - 要件: リアルタイム更新、ドリルダウン

- **請求管理システム**: 請求書発行と入金管理
  - 用途: 請求書作成、送付、入金確認、督促
  - 要件: テンプレート、PDF生成、電子送付

### 情報リソース
- **会計基準**: 収益認識基準等の会計ルール
  - 用途: 正確な財務処理
  - 更新頻度: 法改正時

- **契約情報**: 請求条件や支払条件
  - 用途: 請求タイミングと金額の決定
  - 更新頻度: 契約締結・変更時

- **標準単価**: 人件費単価やコスト単価
  - 用途: コスト配賦の基準
  - 更新頻度: 年次

## 実現ロードマップ

### Phase 1: 基盤構築（2024 Q1-Q2）
- 会計システムの導入
- プロジェクト会計の確立
- 基本的な収益性レポートの実装
- 請求管理プロセスの標準化

### Phase 2: 機能拡張（2024 Q3-Q4）
- リアルタイム財務ダッシュボード
- 予実管理の自動化
- 工数システムとの連携強化
- 経費精算の自動化

### Phase 3: 最適化（2025 Q1-Q2）
- AI活用による収益予測
- 異常値検知と自動アラート
- 収益性最適化の推奨機能
- 外部会計システムとの連携`,
      category: 'Core'
    }
  })
  
  // ビジネスオペレーションを作成
  const { seedFinanceOperationsFull } = await import('./finance-operations-full')
  await seedFinanceOperationsFull(service, capability)
  
  return { service, capability }
}