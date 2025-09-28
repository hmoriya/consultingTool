import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// 財務管理サービスの完全なパラソルデータ
export async function seedFinanceServiceFullParasol() {
  console.log('  Seeding finance-service full parasol data...')
  
  // 既存のサービスをチェック
  const existingService = await parasolDb.service.findFirst({
    where: { name: 'revenue-optimization' }
  })
  
  if (existingService) {
    console.log('  収益最適化サービス already exists, skipping...')
    return
  }
  
  // サービスを作成
  const service = await parasolDb.service.create({
    data: {
      name: 'revenue-optimization',
      displayName: '収益最適化サービス',
      description: 'プロジェクトの収益性を最大化し、財務健全性を確保',

      domainLanguage: JSON.stringify({
        entities: [
          {
            name: '収益 [Revenue] [REVENUE]',
            attributes: [
              { name: 'ID [id] [REVENUE_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '収益種別 [type] [TYPE]', type: 'ENUM' },
              { name: '金額 [amount] [AMOUNT]', type: 'MONEY' },
              { name: '記録日 [recordedDate] [RECORDED_DATE]', type: 'DATE' },
              { name: '認識期間 [recognitionPeriod] [RECOGNITION_PERIOD]', type: 'STRING_20' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: '承認者ID [approvedBy] [APPROVED_BY]', type: 'UUID' },
              { name: '承認日 [approvedDate] [APPROVED_DATE]', type: 'DATE' }
            ],
            businessRules: [
              '収益認識基準に従って計上',
              'プロジェクト完了時またはマイルストーン達成時に認識',
              '承認後の修正は原則不可'
            ]
          },
          {
            name: 'コスト [Cost] [COST]',
            attributes: [
              { name: 'ID [id] [COST_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'コスト種別 [type] [TYPE]', type: 'ENUM' },
              { name: '金額 [amount] [AMOUNT]', type: 'MONEY' },
              { name: '発生日 [incurredDate] [INCURRED_DATE]', type: 'DATE' },
              { name: 'メンバーID [memberId] [MEMBER_ID]', type: 'UUID' },
              { name: '工数 [hours] [HOURS]', type: 'DECIMAL' },
              { name: '単価 [rate] [RATE]', type: 'MONEY' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' }
            ],
            businessRules: [
              '人件費は工数×単価で自動計算',
              '経費は領収書と紐付け必須',
              '承認フロー完了後に確定'
            ]
          },
          {
            name: '請求書 [Invoice] [INVOICE]',
            attributes: [
              { name: 'ID [id] [INVOICE_ID]', type: 'UUID' },
              { name: '請求書番号 [invoiceNumber] [INVOICE_NUMBER]', type: 'STRING_20' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: 'クライアントID [clientId] [CLIENT_ID]', type: 'UUID' },
              { name: '請求日 [invoiceDate] [INVOICE_DATE]', type: 'DATE' },
              { name: '支払期限 [dueDate] [DUE_DATE]', type: 'DATE' },
              { name: '請求額 [amount] [AMOUNT]', type: 'MONEY' },
              { name: '税額 [taxAmount] [TAX_AMOUNT]', type: 'MONEY' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '入金日 [paidDate] [PAID_DATE]', type: 'DATE' }
            ],
            businessRules: [
              '請求書番号は全社で一意',
              '支払期限は請求日から30日後が標準',
              '入金確認後にステータスを「入金済」に変更'
            ]
          },
          {
            name: '予算 [Budget] [BUDGET]',
            attributes: [
              { name: 'ID [id] [BUDGET_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '予算種別 [type] [TYPE]', type: 'ENUM' },
              { name: '予算額 [plannedAmount] [PLANNED_AMOUNT]', type: 'MONEY' },
              { name: '実績額 [actualAmount] [ACTUAL_AMOUNT]', type: 'MONEY' },
              { name: '期間 [period] [PERIOD]', type: 'STRING_20' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '承認日 [approvedDate] [APPROVED_DATE]', type: 'DATE' }
            ],
            businessRules: [
              '予算はPMの承認が必須',
              '実績が予算の90%を超えたらアラート',
              '予算超過には追加承認が必要'
            ]
          },
          {
            name: '経費 [Expense] [EXPENSE]',
            attributes: [
              { name: 'ID [id] [EXPENSE_ID]', type: 'UUID' },
              { name: 'メンバーID [memberId] [MEMBER_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '経費種別 [type] [TYPE]', type: 'ENUM' },
              { name: '金額 [amount] [AMOUNT]', type: 'MONEY' },
              { name: '発生日 [expenseDate] [EXPENSE_DATE]', type: 'DATE' },
              { name: '説明 [description] [DESCRIPTION]', type: 'TEXT' },
              { name: '領収書URL [receiptUrl] [RECEIPT_URL]', type: 'STRING_500' },
              { name: 'ステータス [status] [STATUS]', type: 'ENUM' },
              { name: '承認者ID [approvedBy] [APPROVED_BY]', type: 'UUID' }
            ],
            businessRules: [
              '領収書の添付が必須（5000円以上）',
              '交通費は最安ルートが原則',
              '経費精算は月次で実施'
            ]
          },
          {
            name: '収益性分析 [ProfitabilityAnalysis] [PROFITABILITY_ANALYSIS]',
            attributes: [
              { name: 'ID [id] [PROFITABILITY_ANALYSIS_ID]', type: 'UUID' },
              { name: 'プロジェクトID [projectId] [PROJECT_ID]', type: 'UUID' },
              { name: '分析期間 [analysisPeriod] [ANALYSIS_PERIOD]', type: 'STRING_20' },
              { name: '収益 [revenue] [REVENUE]', type: 'MONEY' },
              { name: 'コスト [cost] [COST]', type: 'MONEY' },
              { name: '利益 [profit] [PROFIT]', type: 'MONEY' },
              { name: '利益率 [profitRate] [PROFIT_RATE]', type: 'PERCENTAGE' },
              { name: 'ROI [roi] [ROI]', type: 'PERCENTAGE' },
              { name: '分析日 [analyzedDate] [ANALYZED_DATE]', type: 'DATE' }
            ],
            businessRules: [
              '利益 = 収益 - コスト',
              '利益率 = 利益 / 収益 × 100',
              '月次で自動集計'
            ]
          }
        ],
        valueObjects: [
          {
            name: '金額 [Money] [MONEY]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'DECIMAL' }],
            businessRules: [
              '通貨はJPY（日本円）',
              '最小単位は1円',
              'マイナス値は不可（コストの場合）'
            ]
          },
          {
            name: '利益率 [ProfitRate] [PROFIT_RATE]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'PERCENTAGE' }],
            businessRules: [
              '-100%から100%の範囲',
              '小数点2位まで表示',
              '目標値: 25%以上'
            ]
          },
          {
            name: '請求書番号 [InvoiceNumber] [INVOICE_NUMBER]',
            attributes: [{ name: '値 [value] [VALUE]', type: 'STRING_20' }],
            businessRules: [
              'フォーマット: INV-YYYY-NNNNN',
              '年度内で連番',
              '一度発番されたら変更不可'
            ]
          },
          {
            name: '予実差異 [Variance] [VARIANCE]',
            attributes: [
              { name: '予算 [budget] [BUDGET]', type: 'MONEY' },
              { name: '実績 [actual] [ACTUAL]', type: 'MONEY' },
              { name: '差異額 [variance] [VARIANCE]', type: 'MONEY' },
              { name: '差異率 [varianceRate] [VARIANCE_RATE]', type: 'PERCENTAGE' }
            ],
            businessRules: [
              '差異額 = 実績 - 予算',
              '差異率 = 差異額 / 予算 × 100',
              '±10%以内が許容範囲'
            ]
          }
        ],
        domainServices: [
          {
            name: '収益認識サービス [RevenueRecognitionService] [REVENUE_RECOGNITION_SERVICE]',
            operations: [
              '収益認識タイミングの判定',
              '進行基準での計上',
              '完成基準での計上',
              '収益の配分計算'
            ]
          },
          {
            name: 'コスト配賦サービス [CostAllocationService] [COST_ALLOCATION_SERVICE]',
            operations: [
              '人件費の自動配賦',
              '共通費の按分',
              'プロジェクト別コスト集計',
              'コスト予測'
            ]
          },
          {
            name: '請求管理サービス [InvoiceManagementService] [INVOICE_MANAGEMENT_SERVICE]',
            operations: [
              '請求書番号の発番',
              '請求書PDF生成',
              '入金確認処理',
              '督促アラート'
            ]
          },
          {
            name: '収益性分析サービス [ProfitabilityAnalysisService] [PROFITABILITY_ANALYSIS_SERVICE]',
            operations: [
              'プロジェクト別収益性計算',
              '期間別分析',
              'トレンド分析',
              '予測モデル構築'
            ]
          }
        ]
      }),
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