# パラソルドメイン言語: 収益最適化サービス

**バージョン**: 1.2.0
**更新日**: 2024-12-30

## パラソルドメイン概要
プロジェクトとビジネスの財務状況を可視化し、収益性を最適化するためのドメインモデル。DDD原則に基づき、明確な集約境界とステレオタイプマーキングにより、収益、コスト、予算、請求、支払い、財務分析の関係を体系的に定義。すべてのエンティティは適切な集約に所属し、ID参照による疎結合を実現。

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

#### Revenue（収益）<<entity>><<aggregate root>>
**概要**: プロジェクトやサービスから得られる収入の集約ルート
**識別性**: revenueIdによって一意に識別される
**ライフサイクル**: 計画→認識→請求→入金→確定
**集約所属**: RevenueAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### Cost（コスト）<<entity>><<aggregate root>>
**概要**: プロジェクト遂行にかかる費用の集約ルート
**識別性**: costIdによって一意に識別される
**ライフサイクル**: 発生→記録→配賦→承認→確定
**集約所属**: CostAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### Budget（予算）<<entity>><<aggregate root>>
**概要**: プロジェクトや部門の予算計画の集約ルート
**識別性**: budgetIdによって一意に識別される
**ライフサイクル**: 策定→承認→執行→改訂→締め
**集約所属**: BudgetAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### Invoice（請求書）<<entity>>
**概要**: クライアントへの請求書エンティティ
**識別性**: invoiceIdによって一意に識別される
**ライフサイクル**: 作成→送付→支払待ち→入金→完了
**集約所属**: RevenueAggregate
**ステレオタイプ**: entity

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

#### Payment（支払い）<<entity>>
**概要**: 請求書に対する支払い記録エンティティ
**識別性**: paymentIdによって一意に識別される
**ライフサイクル**: 受領→記録→照合→確定
**集約所属**: RevenueAggregate
**ステレオタイプ**: entity

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

#### Profitability（収益性）<<entity>><<aggregate root>>
**概要**: プロジェクトや部門の収益性分析の集約ルート
**識別性**: profitabilityIdによって一意に識別される
**ライフサイクル**: 計算→分析→報告→保存
**集約所属**: ProfitabilityAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### Forecast（予測）<<entity>>
**概要**: 財務予測とシナリオ分析エンティティ
**識別性**: forecastIdによって一意に識別される
**ライフサイクル**: 作成→承認→監視→更新
**集約所属**: ProfitabilityAggregate
**ステレオタイプ**: entity

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

#### CashFlow（キャッシュフロー）<<entity>><<aggregate root>>
**概要**: 現金の流入と流出の記録の集約ルート
**識別性**: cashFlowIdによって一意に識別される
**ライフサイクル**: 発生→記録→分類→集計
**集約所属**: CashFlowAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### Money（金額）<<value object>>
**概要**: 通貨と金額を表現する値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| amount | DECIMAL | ○ | 金額 |
| currency | CURRENCY | ○ | 通貨コード |
| exchangeRate | DECIMAL | × | 為替レート |
| baseCurrencyAmount | DECIMAL | × | 基準通貨換算額 |

**制約**:
- 金額は小数点以下2桁
- 通貨コードはISO4217準拠
- 為替レートは正の数

#### FinancialPeriod（会計期間）<<value object>>
**概要**: 会計期間を表現する値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| year | INTEGER | ○ | 年度 |
| quarter | INTEGER | × | 四半期 |
| month | INTEGER | × | 月 |
| startDate | DATE | ○ | 開始日 |
| endDate | DATE | ○ | 終了日 |

**制約**:
- 終了日は開始日より後
- 四半期は1-4の範囲
- 月は1-12の範囲

### 集約定義

#### RevenueAggregate（収益集約）<<aggregate>>
**集約ルート**: Revenue（収益）
**集約境界**: Revenue（収益）、Invoice（請求書）、Payment（支払い）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Revenue（集約ルート・1対1）
- Invoice（1対多・収益に対する請求書）
- Payment（1対多・請求書に対する支払い）

**包含値オブジェクト**:
- Money（金額情報）

**集約境界の理由**:
- 収益と請求書、支払いは密接に関連し、トランザクション整合性が必要
- 収益認識と請求、入金のライフサイクルを一貫して管理する必要がある
- 支払総額と請求額の整合性を保つ必要がある

**不変条件**:
- 請求済み収益の変更は新規調整レコード作成
- 支払い合計は請求額を超えない
- 収益認識は会計基準に準拠
- Invoice.totalAmount = Revenue.amount + Revenue.taxAmount
- Sum(Payment.amount) <= Invoice.totalAmount

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Client集約とはclientIdのみで参照（IDのみ参照）

#### CostAggregate（コスト集約）<<aggregate>>
**集約ルート**: Cost（コスト）
**集約境界**: Cost（コスト）、CostAllocation（コスト配賦）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Cost（集約ルート・1対1）
- CostAllocation（1対多・コストの配賦記録）

**包含値オブジェクト**:
- Money（金額情報）

**集約境界の理由**:
- コストとその配賦は密接に関連し、トランザクション整合性が必要
- コスト記録と配賦処理のライフサイクルを一貫して管理する必要がある

**不変条件**:
- 承認済みコストの変更は不可
- 配賦率の合計は100%
- コストタイプに応じた配賦方法を適用

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Employee集約とはemployeeIdのみで参照（IDのみ参照）
- Vendor集約とはvendorIdのみで参照（IDのみ参照）

#### BudgetAggregate（予算集約）<<aggregate>>
**集約ルート**: Budget（予算）
**集約境界**: Budget（予算）、BudgetAllocation（予算配分）、BudgetRevision（予算改訂）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Budget（集約ルート・1対1）
- BudgetAllocation（1対多・予算の配分）
- BudgetRevision（1対多・予算の改訂履歴）

**包含値オブジェクト**:
- FinancialPeriod（会計期間）

**集約境界の理由**:
- 予算とその配分、改訂は密接に関連し、トランザクション整合性が必要
- 予算管理のライフサイクル全体を一貫して管理する必要がある

**不変条件**:
- 配分額合計は総予算を超えない
- 承認後の変更は改訂版作成
- 会計期間の重複は不可
- Sum(BudgetAllocation.amount) <= Budget.totalBudget
- Budget.remainingBudget = Budget.totalBudget - Budget.allocatedBudget

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Department集約とはdepartmentIdのみで参照（IDのみ参照）

#### ProfitabilityAggregate（収益性集約）<<aggregate>>
**集約ルート**: Profitability（収益性）
**集約境界**: Profitability（収益性）、Forecast（予測）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Profitability（集約ルート・1対1）
- Forecast（1対多・将来予測）

**集約境界の理由**:
- 収益性分析と予測は密接に関連し、同時に管理される
- 実績データと予測データの整合性を保つ必要がある

**不変条件**:
- 粗利益 = 総収益 - 総コスト
- 利益率は0-100%の範囲
- grossProfit = totalRevenue - totalCost
- grossMargin = (grossProfit / totalRevenue) × 100
- 予測は実績データに基づく

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Client集約とはclientIdのみで参照（IDのみ参照）
- Revenue集約とは計算時のみ参照（疎結合）
- Cost集約とは計算時のみ参照（疎結合）

#### CashFlowAggregate（キャッシュフロー集約）<<aggregate>>
**集約ルート**: CashFlow（キャッシュフロー）
**集約境界**: CashFlow（キャッシュフロー）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- CashFlow（集約ルート・1対1）

**集約境界の理由**:
- キャッシュフローは独立したライフサイクルを持つ
- 現金の流入・流出は単独で記録・管理される

**不変条件**:
- 残高の整合性を保つ
- 流入・流出の分類が正しい
- balance(n) = balance(n-1) + inflow - outflow

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Invoice集約/Payment集約と関連（IDのみ参照）

### ドメインサービス

#### RevenueRecognitionService <<service>>
**概要**: Revenue集約をまたぐ収益認識の計算と処理サービス
**責務**: 収益認識基準の適用、未収収益の計算、収益予測
**ステレオタイプ**: service

**操作**:
- `recognizeRevenue(projectId: UUID, period: FinancialPeriod) -> Revenue[]`: 会計基準に基づく収益認識処理
- `calculateAccrual(contractId: UUID) -> MONEY`: 契約に基づく未収収益計算
- `forecastRevenue(projectId: UUID, months: INTEGER) -> Forecast`: 過去実績に基づく収益予測
- `adjustRevenue(revenueId: UUID, adjustment: MONEY) -> Revenue`: 収益調整レコードの作成

#### CostAllocationService <<service>>
**概要**: Cost集約とProject集約をまたぐコスト配賦と分析サービス
**責務**: コストの適切な配賦、間接費計算、コスト最適化
**ステレオタイプ**: service

**操作**:
- `allocateCost(cost: Cost, projects: Project[]) -> CostAllocation[]`: 配賦基準に基づくコスト配賦
- `calculateOverhead(period: FinancialPeriod) -> MONEY`: 期間別間接費の計算と配賦
- `analyzeCostVariance(budgetId: UUID) -> Variance`: 予算と実績のコスト差異分析
- `optimizeCost(projectId: UUID) -> Suggestion[]`: コスト削減の提案と最適化案

#### ProfitabilityAnalysisService <<service>>
**概要**: Revenue集約、Cost集約、Budget集約をまたぐ収益性分析サービス
**責務**: プロジェクト収益性の総合分析、ROI計算、利益要因分析
**ステレオタイプ**: service

**操作**:
- `analyzeProfitability(projectId: UUID) -> Profitability`: プロジェクト収益性の総合分析と計算
- `compareProjects(projectIds: UUID[]) -> Comparison`: 複数プロジェクトの収益性比較
- `calculateROI(projectId: UUID) -> PERCENTAGE`: 投資収益率の計算と評価
- `identifyProfitDrivers(projectId: UUID) -> Driver[]`: 利益を生み出す要因の特定と分析

#### CashFlowManagementService <<service>>
**概要**: CashFlow集約、Revenue集約、Cost集約をまたぐキャッシュフロー管理サービス
**責務**: キャッシュフローの予測、運転資本管理、現金最適化
**ステレオタイプ**: service

**操作**:
- `forecastCashFlow(period: FinancialPeriod) -> CashFlow[]`: 将来のキャッシュフロー予測
- `analyzeWorkingCapital() -> Analysis`: 運転資本の分析と最適化提案
- `optimizeCashPosition() -> Recommendation[]`: 現金ポジションの最適化提案
- `calculateDSO() -> INTEGER`: 売掛金回収期間（Days Sales Outstanding）の計算

### ドメインイベント

#### RevenueRecognized <<event>>
**発生条件**: 収益が認識された時
**ステレオタイプ**: event
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

#### InvoiceIssued <<event>>
**発生条件**: 請求書が発行された時
**ステレオタイプ**: event
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

#### PaymentReceived <<event>>
**発生条件**: 支払いを受領した時
**ステレオタイプ**: event
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

#### BudgetExceeded <<event>>
**発生条件**: 予算超過が発生した時
**ステレオタイプ**: event
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

#### RevenueRepository <<repository>>
**責務**: Revenue集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface RevenueRepository {
  // 基本操作
  findById(id: UUID): Promise<Revenue | null>
  findAll(limit?: number, offset?: number): Promise<Revenue[]>
  save(revenue: Revenue): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Revenue[]>
  findByPeriod(start: DATE, end: DATE): Promise<Revenue[]>
  findUnrecognized(): Promise<Revenue[]>
  findByStatus(status: ENUM): Promise<Revenue[]>
  findByClient(clientId: UUID): Promise<Revenue[]>

  // 集約全体の保存
  saveWithInvoices(revenue: Revenue, invoices: Invoice[]): Promise<void>
  saveWithPayments(revenue: Revenue, payments: Payment[]): Promise<void>
}
```

#### CostRepository <<repository>>
**責務**: Cost集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface CostRepository {
  // 基本操作
  findById(id: UUID): Promise<Cost | null>
  findAll(limit?: number, offset?: number): Promise<Cost[]>
  save(cost: Cost): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Cost[]>
  findByCategory(category: ENUM): Promise<Cost[]>
  findUnallocated(): Promise<Cost[]>
  findByPeriod(start: DATE, end: DATE): Promise<Cost[]>
  findUnapproved(): Promise<Cost[]>

  // 集約全体の保存
  saveWithAllocations(cost: Cost, allocations: CostAllocation[]): Promise<void>
}
```

#### BudgetRepository <<repository>>
**責務**: Budget集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface BudgetRepository {
  // 基本操作
  findById(id: UUID): Promise<Budget | null>
  findAll(limit?: number, offset?: number): Promise<Budget[]>
  save(budget: Budget): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Budget[]>
  findByFiscalYear(year: INTEGER): Promise<Budget[]>
  findByStatus(status: ENUM): Promise<Budget[]>
  findExceeded(): Promise<Budget[]>

  // 集約全体の保存
  saveWithAllocations(budget: Budget, allocations: BudgetAllocation[]): Promise<void>
  saveWithRevisions(budget: Budget, revisions: BudgetRevision[]): Promise<void>
}
```

#### ProfitabilityRepository <<repository>>
**責務**: Profitability集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface ProfitabilityRepository {
  // 基本操作
  findById(id: UUID): Promise<Profitability | null>
  findAll(limit?: number, offset?: number): Promise<Profitability[]>
  save(profitability: Profitability): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Profitability[]>
  findByPeriod(start: DATE, end: DATE): Promise<Profitability[]>
  findByClient(clientId: UUID): Promise<Profitability[]>
  findLowMargin(threshold: PERCENTAGE): Promise<Profitability[]>

  // 集約全体の保存
  saveWithForecasts(profitability: Profitability, forecasts: Forecast[]): Promise<void>
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