# BC-002: ドメイン設計

**BC**: Financial Health & Profitability
**作成日**: 2025-10-31
**V2移行元**: services/revenue-optimization-service/domain-language.md

---

## 概要

このドキュメントは、BC-002（財務健全性と収益性）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Budget Aggregate
**集約ルート**: Budget [Budget] [BUDGET]
- **責務**: 予算のライフサイクル全体を管理
- **包含エンティティ**: BudgetItem, BudgetAllocation
- **不変条件**: 予算項目の合計が総予算を超えない

### 2. Cost Aggregate
**集約ルート**: Cost [Cost] [COST]
- **責務**: コストの記録と分類管理
- **包含エンティティ**: CostItem, CostAllocation
- **不変条件**: コストは必ず承認済み予算項目に紐づく

### 3. Revenue Aggregate
**集約ルート**: Revenue [Revenue] [REVENUE]
- **責務**: 収益認識とキャッシュフロー管理
- **包含エンティティ**: Invoice, Payment, RevenueStream
- **不変条件**: 収益認識は契約条件に準拠

### 4. Profitability Aggregate
**集約ルート**: ProfitabilityMetric [ProfitabilityMetric] [PROFITABILITY_METRIC]
- **責務**: 収益性指標の計算と追跡
- **包含エンティティ**: ProfitMargin, CashFlowProjection
- **不変条件**: 収益性計算は収益・コストデータと整合

---

## 主要エンティティ（Entities）

### Budget [Budget] [BUDGET]
予算 [Budget] [BUDGET]
├── 予算ID [BudgetID] [BUDGET_ID]: UUID
├── 予算名 [BudgetName] [BUDGET_NAME]: STRING_200
├── 会計年度 [FiscalYear] [FISCAL_YEAR]: INTEGER
├── 総予算額 [TotalAmount] [TOTAL_AMOUNT]: MONEY
├── 承認状態 [ApprovalStatus] [APPROVAL_STATUS]: ENUM（draft/pending/approved/rejected）
├── 承認日 [ApprovedDate] [APPROVED_DATE]: DATE
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Cost [Cost] [COST]
コスト [Cost] [COST]
├── コストID [CostID] [COST_ID]: UUID
├── コスト名 [CostName] [COST_NAME]: STRING_200
├── カテゴリ [Category] [CATEGORY]: ENUM（人件費/外注費/設備費/その他）
├── 金額 [Amount] [AMOUNT]: MONEY
├── 発生日 [OccurredDate] [OCCURRED_DATE]: DATE
├── プロジェクトID [ProjectID] [PROJECT_ID]: UUID（BC-001連携）
└── 予算項目ID [BudgetItemID] [BUDGET_ITEM_ID]: UUID

### Revenue [Revenue] [REVENUE]
収益 [Revenue] [REVENUE]
├── 収益ID [RevenueID] [REVENUE_ID]: UUID
├── 収益名 [RevenueName] [REVENUE_NAME]: STRING_200
├── 金額 [Amount] [AMOUNT]: MONEY
├── 認識日 [RecognizedDate] [RECOGNIZED_DATE]: DATE
├── 収益区分 [RevenueType] [REVENUE_TYPE]: ENUM（プロジェクト/リテイナー/その他）
├── プロジェクトID [ProjectID] [PROJECT_ID]: UUID（BC-001連携）
└── 請求書ID [InvoiceID] [INVOICE_ID]: UUID

### Invoice [Invoice] [INVOICE]
請求書 [Invoice] [INVOICE]
├── 請求書ID [InvoiceID] [INVOICE_ID]: UUID
├── 請求書番号 [InvoiceNumber] [INVOICE_NUMBER]: STRING_50
├── 請求金額 [InvoiceAmount] [INVOICE_AMOUNT]: MONEY
├── 請求日 [InvoiceDate] [INVOICE_DATE]: DATE
├── 支払期限 [PaymentDue] [PAYMENT_DUE]: DATE
├── 支払状態 [PaymentStatus] [PAYMENT_STATUS]: ENUM（未払/一部払/全額払/延滞）
└── クライアントID [ClientID] [CLIENT_ID]: UUID

---

## 主要値オブジェクト（Value Objects）

### MoneyAmount [MoneyAmount] [MONEY_AMOUNT]
金額 [MoneyAmount] [MONEY_AMOUNT]
├── 金額 [amount] [AMOUNT]: DECIMAL(15,2)
├── 通貨 [currency] [CURRENCY]: STRING_3（ISO 4217）
└── 為替レート [exchangeRate] [EXCHANGE_RATE]: DECIMAL(10,6)（オプション）

### CostCategory [CostCategory] [COST_CATEGORY]
コストカテゴリ [CostCategory] [COST_CATEGORY]
├── カテゴリ名 [categoryName] [CATEGORY_NAME]: STRING_100
├── カテゴリコード [categoryCode] [CATEGORY_CODE]: STRING_20
└── 親カテゴリID [parentCategoryId] [PARENT_CATEGORY_ID]: UUID（オプション）

### ProfitMargin [ProfitMargin] [PROFIT_MARGIN]
利益率 [ProfitMargin] [PROFIT_MARGIN]
├── 売上高 [revenue] [REVENUE]: MONEY
├── コスト [cost] [COST]: MONEY
├── 粗利益 [grossProfit] [GROSS_PROFIT]: MONEY
└── 利益率 [marginPercentage] [MARGIN_PERCENTAGE]: PERCENTAGE

---

## ドメインサービス

### BudgetManagementService
**責務**: 予算管理の高度化
- `allocateBudget()`: 予算配分の最適化
- `monitorBudgetConsumption()`: 予算消化状況のモニタリング
- `reallocateBudget()`: 予算再配分の実行

### CostOptimizationService
**責務**: コスト最適化
- `analyzeCostTrends()`: コストトレンド分析
- `identifyCostSavingOpportunities()`: コスト削減機会の特定
- `optimizeCostAllocation()`: コスト配分の最適化（→ BC-001, BC-005連携）

### RevenueMaximizationService
**責務**: 収益最大化
- `forecastRevenue()`: 収益予測
- `optimizePricing()`: 価格最適化
- `accelerateCollection()`: 回収促進（→ BC-007連携）

### ProfitabilityAnalysisService
**責務**: 収益性分析
- `calculateProfitability()`: 収益性計算
- `analyzeProfitabilityTrends()`: 収益性トレンド分析
- `projectCashFlow()`: キャッシュフロー予測

---

## V2からの移行メモ

### 移行済み
- ✅ Budget, Cost, Revenue, Invoiceエンティティの定義
- ✅ 集約境界の明確化
- ✅ 値オブジェクトの抽出

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
