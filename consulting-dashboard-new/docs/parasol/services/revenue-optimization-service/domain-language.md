# パラソルドメイン言語: 収益最適化サービス

**バージョン**: 1.0.0
**更新日**: 2024-01-20

## パラソルドメイン概要
プロジェクトとビジネスの財務状況を可視化し、収益性を最適化するためのドメインモデル。収益、コスト、予算、請求、支払い、財務分析の関係を定義。

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト
EMAIL: メールアドレス形式
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値（精度指定可能）
MONEY: 金額（通貨単位付き、小数点以下2桁）
PERCENTAGE: パーセンテージ（0-100、小数点以下2桁）
INTEGER: 整数
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式データ
CURRENCY: 通貨コード（ISO4217）
```

### エンティティ定義

#### Revenue（収益）
**概要**: プロジェクトやサービスから得られる収入
**識別子**: revenueId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | プロジェクトID |
| clientId | UUID | ○ | クライアントID |
| contractId | UUID | × | 契約ID |
| revenueType | ENUM | ○ | 収益タイプ（Fixed/TimeAndMaterial/Milestone/Recurring） |
| amount | MONEY | ○ | 金額 |
| currency | CURRENCY | ○ | 通貨 |
| recognitionDate | DATE | ○ | 収益認識日 |
| billingPeriodStart | DATE | ○ | 請求期間開始 |
| billingPeriodEnd | DATE | ○ | 請求期間終了 |
| status | ENUM | ○ | ステータス（Planned/Recognized/Invoiced/Collected） |
| description | TEXT | × | 説明 |
| taxRate | PERCENTAGE | ○ | 税率 |
| taxAmount | MONEY | ○ | 税額 |
| netAmount | MONEY | ○ | 税引後金額 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 収益認識は会計基準に準拠
- 為替レートは認識日のレート適用
- マイルストーン型は達成時に認識

#### Cost（コスト）
**概要**: プロジェクト遂行にかかる費用
**識別子**: costId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | × | プロジェクトID |
| costType | ENUM | ○ | コストタイプ（Labor/Material/Subcontract/Travel/Other） |
| costCategory | ENUM | ○ | カテゴリ（Direct/Indirect/Overhead） |
| amount | MONEY | ○ | 金額 |
| currency | CURRENCY | ○ | 通貨 |
| incurredDate | DATE | ○ | 発生日 |
| vendorId | UUID | × | ベンダーID |
| employeeId | UUID | × | 従業員ID（人件費の場合） |
| description | TEXT | ○ | 説明 |
| quantity | DECIMAL | × | 数量 |
| unitPrice | MONEY | × | 単価 |
| isCapitalized | BOOLEAN | ○ | 資産計上フラグ |
| allocationMethod | ENUM | × | 配賦方法 |
| approvedBy | UUID | × | 承認者 |
| approvedAt | TIMESTAMP | × | 承認日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Budget（予算）
**概要**: プロジェクトや部門の予算計画
**識別子**: budgetId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | × | プロジェクトID |
| departmentId | UUID | × | 部門ID |
| fiscalYear | INTEGER | ○ | 会計年度 |
| fiscalPeriod | STRING_20 | ○ | 会計期間 |
| budgetType | ENUM | ○ | 予算タイプ（Annual/Quarterly/Monthly/Project） |
| totalBudget | MONEY | ○ | 総予算 |
| allocatedBudget | MONEY | ○ | 配分済み予算 |
| remainingBudget | MONEY | ○ | 残予算 |
| currency | CURRENCY | ○ | 通貨 |
| status | ENUM | ○ | ステータス（Draft/Approved/Revised/Closed） |
| approvedBy | UUID | × | 承認者 |
| approvedAt | TIMESTAMP | × | 承認日時 |
| revisionNumber | INTEGER | ○ | 改訂番号 |
| notes | TEXT | × | 備考 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Invoice（請求書）
**概要**: クライアントへの請求書
**識別子**: invoiceId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| invoiceNumber | STRING_50 | ○ | 請求書番号 |
| projectId | UUID | ○ | プロジェクトID |
| clientId | UUID | ○ | クライアントID |
| contractId | UUID | × | 契約ID |
| invoiceDate | DATE | ○ | 請求日 |
| dueDate | DATE | ○ | 支払期限 |
| subtotal | MONEY | ○ | 小計 |
| taxAmount | MONEY | ○ | 税額 |
| totalAmount | MONEY | ○ | 合計金額 |
| currency | CURRENCY | ○ | 通貨 |
| status | ENUM | ○ | ステータス（Draft/Sent/Paid/Overdue/Cancelled） |
| paymentTerms | STRING_100 | ○ | 支払条件 |
| billingAddress | TEXT | ○ | 請求先住所 |
| lineItems | JSON | ○ | 明細項目 |
| sentAt | TIMESTAMP | × | 送付日時 |
| paidAt | TIMESTAMP | × | 支払完了日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Payment（支払い）
**概要**: 請求書に対する支払い記録
**識別子**: paymentId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| invoiceId | UUID | ○ | 請求書ID |
| paymentDate | DATE | ○ | 支払日 |
| amount | MONEY | ○ | 支払金額 |
| currency | CURRENCY | ○ | 通貨 |
| paymentMethod | ENUM | ○ | 支払方法（BankTransfer/CreditCard/Check/Cash/Other） |
| referenceNumber | STRING_100 | × | 参照番号 |
| bankAccount | STRING_100 | × | 銀行口座 |
| notes | TEXT | × | 備考 |
| reconciledAt | TIMESTAMP | × | 照合日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Profitability（収益性）
**概要**: プロジェクトや部門の収益性分析
**識別子**: profitabilityId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | × | プロジェクトID |
| clientId | UUID | × | クライアントID |
| periodStart | DATE | ○ | 期間開始 |
| periodEnd | DATE | ○ | 期間終了 |
| totalRevenue | MONEY | ○ | 総収益 |
| totalCost | MONEY | ○ | 総コスト |
| grossProfit | MONEY | ○ | 粗利益 |
| grossMargin | PERCENTAGE | ○ | 粗利率 |
| operatingProfit | MONEY | ○ | 営業利益 |
| operatingMargin | PERCENTAGE | ○ | 営業利益率 |
| netProfit | MONEY | ○ | 純利益 |
| netMargin | PERCENTAGE | ○ | 純利益率 |
| roi | PERCENTAGE | × | ROI（投資収益率） |
| currency | CURRENCY | ○ | 通貨 |
| calculatedAt | TIMESTAMP | ○ | 計算日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |

#### Forecast（予測）
**概要**: 財務予測とシナリオ分析
**識別子**: forecastId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | × | プロジェクトID |
| forecastType | ENUM | ○ | 予測タイプ（Revenue/Cost/Cashflow/Profitability） |
| scenario | ENUM | ○ | シナリオ（Optimistic/Realistic/Pessimistic） |
| periodStart | DATE | ○ | 予測期間開始 |
| periodEnd | DATE | ○ | 予測期間終了 |
| forecastAmount | MONEY | ○ | 予測金額 |
| confidence | PERCENTAGE | ○ | 信頼度 |
| assumptions | JSON | ○ | 前提条件 |
| variables | JSON | × | 変数 |
| methodology | TEXT | × | 予測手法 |
| createdBy | UUID | ○ | 作成者 |
| approvedBy | UUID | × | 承認者 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### CashFlow（キャッシュフロー）
**概要**: 現金の流入と流出の記録
**識別子**: cashFlowId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | × | プロジェクトID |
| flowType | ENUM | ○ | フロータイプ（Inflow/Outflow） |
| category | ENUM | ○ | カテゴリ（Operating/Investing/Financing） |
| amount | MONEY | ○ | 金額 |
| currency | CURRENCY | ○ | 通貨 |
| flowDate | DATE | ○ | 発生日 |
| description | TEXT | ○ | 説明 |
| relatedEntityType | ENUM | × | 関連エンティティタイプ |
| relatedEntityId | UUID | × | 関連エンティティID |
| bankAccountId | UUID | × | 銀行口座ID |
| balance | MONEY | × | 残高 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### 値オブジェクト定義

#### Money（金額）
**概要**: 通貨と金額を表現

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| amount | DECIMAL | ○ | 金額 |
| currency | CURRENCY | ○ | 通貨コード |
| exchangeRate | DECIMAL | × | 為替レート |
| baseCurrencyAmount | DECIMAL | × | 基準通貨換算額 |

#### FinancialPeriod（会計期間）
**概要**: 会計期間を表現

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| year | INTEGER | ○ | 年度 |
| quarter | INTEGER | × | 四半期 |
| month | INTEGER | × | 月 |
| startDate | DATE | ○ | 開始日 |
| endDate | DATE | ○ | 終了日 |

### 集約定義

#### RevenueAggregate
**集約ルート**: Revenue
**境界**: Revenue, Invoice, Payment

**不変条件**:
- 請求済み収益の変更は新規調整レコード作成
- 支払い合計は請求額を超えない
- 収益認識は会計基準に準拠

#### BudgetAggregate
**集約ルート**: Budget
**境界**: Budget, BudgetAllocation, BudgetRevision

**不変条件**:
- 配分額合計は総予算を超えない
- 承認後の変更は改訂版作成
- 会計期間の重複は不可

#### ProfitabilityAggregate
**集約ルート**: Profitability
**境界**: Profitability, Revenue, Cost

**不変条件**:
- 粗利益 = 収益 - 直接コスト
- 利益率は0-100%の範囲

### ドメインサービス

#### RevenueRecognitionService
**概要**: 収益認識の計算と処理
**操作**:
- `recognizeRevenue(projectId, period) -> Revenue[]`: 収益認識
- `calculateAccrual(contractId) -> MONEY`: 未収収益計算
- `forecastRevenue(projectId, months) -> Forecast`: 収益予測
- `adjustRevenue(revenueId, adjustment) -> Revenue`: 収益調整

#### CostAllocationService
**概要**: コストの配賦と分析
**操作**:
- `allocateCost(cost, projects) -> Allocation[]`: コスト配賦
- `calculateOverhead(period) -> MONEY`: 間接費計算
- `analyzeCostVariance(budgetId) -> Variance`: コスト差異分析
- `optimizeCost(projectId) -> Suggestion[]`: コスト最適化提案

#### ProfitabilityAnalysisService
**概要**: 収益性の分析と最適化
**操作**:
- `analyzeProfitability(projectId) -> Profitability`: 収益性分析
- `compareProjects(projectIds) -> Comparison`: プロジェクト比較
- `calculateROI(projectId) -> PERCENTAGE`: ROI計算
- `identifyProfitDrivers(projectId) -> Driver[]`: 利益要因分析

#### CashFlowManagementService
**概要**: キャッシュフロー管理と予測
**操作**:
- `forecastCashFlow(period) -> CashFlow[]`: キャッシュフロー予測
- `analyzeWorkingCapital() -> Analysis`: 運転資本分析
- `optimizeCashPosition() -> Recommendation[]`: 現金最適化提案
- `calculateDSO() -> INTEGER`: 売掛金回収期間計算

### ドメインイベント

#### RevenueRecognized
**発生条件**: 収益が認識された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "revenueId": "UUID",
  "projectId": "UUID",
  "amount": "MONEY",
  "recognitionDate": "DATE"
}
```

#### InvoiceIssued
**発生条件**: 請求書が発行された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "invoiceId": "UUID",
  "clientId": "UUID",
  "amount": "MONEY",
  "dueDate": "DATE"
}
```

#### PaymentReceived
**発生条件**: 支払いを受領した時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "paymentId": "UUID",
  "invoiceId": "UUID",
  "amount": "MONEY",
  "paymentDate": "DATE"
}
```

#### BudgetExceeded
**発生条件**: 予算超過が発生した時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "budgetId": "UUID",
  "projectId": "UUID",
  "exceededAmount": "MONEY",
  "percentage": "PERCENTAGE"
}
```

### リポジトリインターフェース

#### RevenueRepository
```
interface RevenueRepository {
  findById(id: UUID): Revenue | null
  findByProjectId(projectId: UUID): Revenue[]
  findByPeriod(start: DATE, end: DATE): Revenue[]
  findUnrecognized(): Revenue[]
  save(revenue: Revenue): void
  delete(id: UUID): void
}
```

#### CostRepository
```
interface CostRepository {
  findById(id: UUID): Cost | null
  findByProjectId(projectId: UUID): Cost[]
  findByCategory(category: ENUM): Cost[]
  findUnallocated(): Cost[]
  save(cost: Cost): void
  delete(id: UUID): void
}
```

#### InvoiceRepository
```
interface InvoiceRepository {
  findById(id: UUID): Invoice | null
  findByProjectId(projectId: UUID): Invoice[]
  findOverdue(): Invoice[]
  findUnpaid(): Invoice[]
  save(invoice: Invoice): void
}
```

## ビジネスルール

### 収益認識ルール
1. **認識タイミング**: 成果物納品時または期間按分
2. **為替処理**: 認識日の為替レート適用
3. **調整処理**: 過去分は調整仕訳で対応
4. **税務処理**: 各国税制に準拠

### コスト管理ルール
1. **承認フロー**: 一定額以上は上位承認
2. **配賦基準**: プロジェクト工数比率
3. **資産計上**: 1年以上使用は資産計上
4. **経費精算**: 月次締めで処理

### 請求管理ルール
1. **請求サイクル**: 月末締め翌月末払い
2. **督促**: 期限超過は自動リマインド
3. **与信管理**: クライアント別限度額設定
4. **割引条件**: 早期支払い2%割引

### 予算管理ルール
1. **予算策定**: 年次で策定、四半期で見直し
2. **執行管理**: 80%超過でアラート
3. **承認権限**: 階層別承認限度額
4. **繰越処理**: 未使用予算は原則繰越不可

## サービス間連携

### 依存サービス
- **プロジェクト成功支援サービス**: プロジェクト情報、進捗
- **生産性可視化サービス**: 工数実績
- **セキュアアクセスサービス**: 承認者情報

### 提供インターフェース
- **財務データAPI**: 収益、コスト、利益率
- **請求API**: 請求書発行、支払状況
- **予算API**: 予算消化状況

### イベント連携
- **InvoiceIssued**: 経理システムへ連携
- **BudgetExceeded**: 管理者へアラート
- **PaymentReceived**: 売掛金消込処理