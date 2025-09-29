# パラソルドメイン言語定義: 収益最適化サービス v1.2.0

## エンティティ（Entities）

### 請求書 [Invoice] [INVOICE]
クライアントへの請求書を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
| 請求書ID | id | id | UUID | ○ | 請求書の一意識別子 |
| 請求書番号 | invoiceNumber | invoice_number | 請求書番号 [InvoiceNumber] | ○ | 請求書の管理番号 |
| プロジェクトID | projectId | project_id | UUID | ○ | 対象プロジェクトの識別子 |
| クライアントID | clientId | client_id | UUID | ○ | 請求先クライアントの識別子 |
| 請求日 | billingDate | billing_date | 請求日 [BillingDate] | ○ | 請求書の発行日 |
| 支払期限 | dueDate | due_date | 支払期限 [DueDate] | ○ | 支払期限日 |
| 請求金額 | amount | amount | 金額 [Money] | ○ | 税抜き請求金額 |
| 税額 | tax | tax | 金額 [Money] | ○ | 消費税額 |
| 合計金額 | totalAmount | total_amount | 金額 [Money] | ○ | 税込み合計金額 |
| 通貨 | currency | currency | 通貨コード [CurrencyCode] | ○ | 通貨（JPY, USD等） |
| ステータス | status | status | 請求書ステータス [InvoiceStatus] | ○ | 請求書の状態 |
| 支払日 | paymentDate | payment_date | DATE | × | 実際の支払日 |
| 備考 | notes | notes | TEXT | × | 請求書に関する備考 |
| 作成日時 | createdAt | created_at | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | updated_at | TIMESTAMP | ○ | レコード更新日時 |

#### ドメインロジック
- 請求金額と税額の合計が合計金額と一致すること
- 支払期限は請求日より後であること
- 支払日は請求日以降であること

### 収益 [Revenue] [REVENUE]
プロジェクトの収益を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
| 収益ID | id | id | UUID | ○ | 収益レコードの一意識別子 |
| プロジェクトID | projectId | project_id | UUID | ○ | 対象プロジェクトの識別子 |
| 計上期間 | period | period | 会計期間 [AccountingPeriod] | ○ | 収益計上期間（YYYY-MM） |
| 収益タイプ | revenueType | revenue_type | 収益タイプ [RevenueType] | ○ | 収益の種類 |
| 計画収益 | plannedRevenue | planned_revenue | 金額 [Money] | ○ | 計画収益額 |
| 実績収益 | actualRevenue | actual_revenue | 金額 [Money] | × | 実績収益額 |
| 認識率 | recognitionRate | recognition_rate | パーセンテージ [Percentage] | ○ | 進行基準での認識率 |
| 通貨 | currency | currency | 通貨コード [CurrencyCode] | ○ | 通貨（JPY, USD等） |
| 備考 | notes | notes | TEXT | × | 収益に関する備考 |
| 作成日時 | createdAt | created_at | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | updated_at | TIMESTAMP | ○ | レコード更新日時 |

#### ドメインロジック
- 認識率は0%から100%の範囲
- 実績収益は計画収益に認識率を乗じた値に近似すること

### コスト [Cost] [COST]
プロジェクトのコストを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
| コストID | id | id | UUID | ○ | コストレコードの一意識別子 |
| プロジェクトID | projectId | project_id | UUID | ○ | 対象プロジェクトの識別子 |
| コストタイプ | costType | cost_type | コストタイプ [CostType] | ○ | コストの種類 |
| 計上期間 | period | period | 会計期間 [AccountingPeriod] | ○ | コスト計上期間（YYYY-MM） |
| 計画コスト | plannedCost | planned_cost | 金額 [Money] | ○ | 計画コスト額 |
| 実績コスト | actualCost | actual_cost | 金額 [Money] | × | 実績コスト額 |
| 通貨 | currency | currency | 通貨コード [CurrencyCode] | ○ | 通貨（JPY, USD等） |
| 承認者ID | approvedBy | approved_by | UUID | × | 承認者のユーザーID |
| 承認日 | approvedAt | approved_at | TIMESTAMP | × | 承認日時 |
| 備考 | notes | notes | TEXT | × | コストに関する備考 |
| 作成日時 | createdAt | created_at | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | updated_at | TIMESTAMP | ○ | レコード更新日時 |

#### ドメインロジック
- 実績コストは承認後のみ確定
- 計画コストと実績コストの乖離が一定以上の場合はアラート

### 予算 [Budget] [BUDGET]
プロジェクトの予算を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
| 予算ID | id | id | UUID | ○ | 予算レコードの一意識別子 |
| プロジェクトID | projectId | project_id | UUID | ○ | 対象プロジェクトの識別子 |
| 予算名 | name | name | 予算名 [BudgetName] | ○ | 予算の名称 |
| 予算タイプ | budgetType | budget_type | 予算タイプ [BudgetType] | ○ | 予算の種類 |
| 予算期間開始 | periodStart | period_start | DATE | ○ | 予算期間の開始日 |
| 予算期間終了 | periodEnd | period_end | DATE | ○ | 予算期間の終了日 |
| 予算額 | amount | amount | 金額 [Money] | ○ | 予算総額 |
| 通貨 | currency | currency | 通貨コード [CurrencyCode] | ○ | 通貨（JPY, USD等） |
| 警告閾値 | warningThreshold | warning_threshold | パーセンテージ [Percentage] | ○ | 警告を出す消化率 |
| ステータス | status | status | 予算ステータス [BudgetStatus] | ○ | 予算の状態 |
| 備考 | notes | notes | TEXT | × | 予算に関する備考 |
| 作成日時 | createdAt | created_at | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | updated_at | TIMESTAMP | ○ | レコード更新日時 |

#### 集約ルート
- 予算は収益とコストの集約ルートとして機能

#### ドメインロジック
- 予算期間終了は開始より後
- 警告閾値は0%から100%の範囲
- 予算消化率が警告閾値を超えたらアラート

### 財務レポート [FinancialReport] [FINANCIAL_REPORT]
財務分析レポートを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|---------|--------|-----------|-----|------|------|
| レポートID | id | id | UUID | ○ | レポートの一意識別子 |
| プロジェクトID | projectId | project_id | UUID | ○ | 対象プロジェクトの識別子 |
| レポート期間 | period | period | 会計期間 [AccountingPeriod] | ○ | レポート対象期間 |
| レポートタイプ | reportType | report_type | レポートタイプ [ReportType] | ○ | レポートの種類 |
| 売上総利益 | grossProfit | gross_profit | 金額 [Money] | ○ | 売上総利益 |
| 営業利益 | operatingProfit | operating_profit | 金額 [Money] | ○ | 営業利益 |
| 利益率 | profitMargin | profit_margin | パーセンテージ [Percentage] | ○ | 利益率 |
| ROI | roi | roi | パーセンテージ [Percentage] | ○ | 投資収益率 |
| 作成者ID | createdBy | created_by | UUID | ○ | レポート作成者 |
| 承認者ID | approvedBy | approved_by | UUID | × | レポート承認者 |
| ステータス | status | status | レポートステータス [ReportStatus] | ○ | レポートの状態 |
| 作成日時 | createdAt | created_at | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | updated_at | TIMESTAMP | ○ | レコード更新日時 |

## 値オブジェクト（Value Objects）

### 金額 [Money] [MONEY]
金銭的価値を表す値オブジェクト

- **値** [value] [VALUE]: DECIMAL(15,2)
- **通貨コード** [currency] [CURRENCY]: 通貨コード [CurrencyCode]

#### ビジネスルール
- 値は0以上
- 通貨コードと合わせて金額を表現

### 通貨コード [CurrencyCode] [CURRENCY_CODE]
ISO 4217準拠の通貨コード

- **コード** [code] [CODE]: STRING_3

#### ビジネスルール
- JPY, USD, EUR等の有効なISO通貨コード

### 請求書番号 [InvoiceNumber] [INVOICE_NUMBER]
請求書の管理番号

- **番号** [number] [NUMBER]: STRING_20

#### ビジネスルール
- フォーマット: INV-YYYYMM-NNNN
- 年月とシーケンス番号の組み合わせ

### 請求日 [BillingDate] [BILLING_DATE]
請求書の発行日

- **日付** [date] [DATE]: DATE

#### ビジネスルール
- 過去日または当日のみ有効

### 支払期限 [DueDate] [DUE_DATE]
請求書の支払期限

- **日付** [date] [DATE]: DATE

#### ビジネスルール
- 請求日より後の日付

### 請求書ステータス [InvoiceStatus] [INVOICE_STATUS]
請求書の状態

- **状態** [status] [STATUS]: ENUM

#### 許可値
- draft: 下書き
- issued: 発行済み
- sent: 送付済み
- paid: 支払済み
- overdue: 期限超過
- cancelled: キャンセル

### 会計期間 [AccountingPeriod] [ACCOUNTING_PERIOD]
会計上の期間（年月）

- **期間** [period] [PERIOD]: STRING_7

#### ビジネスルール
- フォーマット: YYYY-MM
- 有効な年月の組み合わせ

### 収益タイプ [RevenueType] [REVENUE_TYPE]
収益の種類

- **タイプ** [type] [TYPE]: ENUM

#### 許可値
- fixed_fee: 固定報酬
- time_and_materials: 時間精算
- milestone: マイルストーン報酬
- success_fee: 成功報酬
- recurring: 継続報酬

### コストタイプ [CostType] [COST_TYPE]
コストの種類

- **タイプ** [type] [TYPE]: ENUM

#### 許可値
- labor: 人件費
- travel: 旅費交通費
- material: 材料費
- subcontract: 外注費
- other: その他経費

### パーセンテージ [Percentage] [PERCENTAGE]
百分率を表す値オブジェクト

- **値** [value] [VALUE]: DECIMAL(5,2)

#### ビジネスルール
- 0.00から100.00の範囲

### 予算名 [BudgetName] [BUDGET_NAME]
予算の名称

- **名称** [name] [NAME]: STRING_100

### 予算タイプ [BudgetType] [BUDGET_TYPE]
予算の種類

- **タイプ** [type] [TYPE]: ENUM

#### 許可値
- project: プロジェクト予算
- department: 部門予算
- cost_center: コストセンター予算

### 予算ステータス [BudgetStatus] [BUDGET_STATUS]
予算の状態

- **状態** [status] [STATUS]: ENUM

#### 許可値
- draft: 計画中
- approved: 承認済み
- active: 実行中
- closed: 終了
- overrun: 超過

### レポートタイプ [ReportType] [REPORT_TYPE]
財務レポートの種類

- **タイプ** [type] [TYPE]: ENUM

#### 許可値
- monthly: 月次レポート
- quarterly: 四半期レポート
- project: プロジェクト完了レポート
- forecast: 予測レポート

### レポートステータス [ReportStatus] [REPORT_STATUS]
レポートの状態

- **状態** [status] [STATUS]: ENUM

#### 許可値
- draft: 作成中
- review: レビュー中
- approved: 承認済み
- published: 公開済み

## 集約（Aggregates）

### 請求書集約 [InvoiceAggregate] [INVOICE_AGGREGATE]
請求書に関連する情報をまとめた集約

#### 集約ルート
- Invoice（請求書）

#### 含まれるエンティティ
- Invoice（請求書）

#### 不変条件
- 請求書発行後は金額の変更不可
- 支払済み請求書はキャンセル不可

### 予算集約 [BudgetAggregate] [BUDGET_AGGREGATE]
予算と実績を管理する集約

#### 集約ルート
- Budget（予算）

#### 含まれるエンティティ
- Budget（予算）
- Revenue（収益）
- Cost（コスト）

#### 不変条件
- 予算期間内の収益・コストのみ含む
- 予算額を超過した場合は警告

### 財務レポート集約 [FinancialReportAggregate] [FINANCIAL_REPORT_AGGREGATE]
財務分析レポートの集約

#### 集約ルート
- FinancialReport（財務レポート）

#### 含まれるエンティティ
- FinancialReport（財務レポート）

#### 不変条件
- 承認後のレポートは編集不可
- レポート期間のデータが確定後に作成

## ドメインサービス（Domain Services）

### 収益認識サービス [RevenueRecognitionService] [REVENUE_RECOGNITION_SERVICE]
収益認識基準に従った収益計上を行うサービス

#### 責務
- 進行基準での収益認識計算
- 完成基準での収益認識判定
- 収益認識率の更新

### 請求書発行サービス [InvoiceIssuanceService] [INVOICE_ISSUANCE_SERVICE]
請求書の発行プロセスを管理するサービス

#### 責務
- 請求書番号の採番
- PDF生成と送付
- 支払期限のリマインダー

### 予算監視サービス [BudgetMonitoringService] [BUDGET_MONITORING_SERVICE]
予算の消化状況を監視するサービス

#### 責務
- 予算消化率の計算
- 閾値超過時のアラート
- 予算予測の更新

### 財務分析サービス [FinancialAnalysisService] [FINANCIAL_ANALYSIS_SERVICE]
財務指標の計算と分析を行うサービス

#### 責務
- 利益率の計算
- ROIの算出
- トレンド分析

## ドメインイベント（Domain Events）

### 請求書発行イベント [InvoiceIssuedEvent] [INVOICE_ISSUED_EVENT]
請求書が発行されたときに発生するイベント

#### ペイロード
- invoiceId: 請求書ID
- projectId: プロジェクトID
- amount: 請求金額
- issuedAt: 発行日時

### 支払完了イベント [PaymentCompletedEvent] [PAYMENT_COMPLETED_EVENT]
請求書の支払いが完了したときに発生するイベント

#### ペイロード
- invoiceId: 請求書ID
- paymentDate: 支払日
- amount: 支払金額

### 予算超過イベント [BudgetExceededEvent] [BUDGET_EXCEEDED_EVENT]
予算が超過したときに発生するイベント

#### ペイロード
- budgetId: 予算ID
- projectId: プロジェクトID
- exceedAmount: 超過金額
- exceedRate: 超過率

### 財務レポート承認イベント [FinancialReportApprovedEvent] [FINANCIAL_REPORT_APPROVED_EVENT]
財務レポートが承認されたときに発生するイベント

#### ペイロード
- reportId: レポートID
- projectId: プロジェクトID
- approvedBy: 承認者ID
- approvedAt: 承認日時

## リポジトリインターフェース（Repository Interfaces）

### 請求書リポジトリ [InvoiceRepository] [INVOICE_REPOSITORY]
請求書の永続化を担当するリポジトリ

#### 主要メソッド
- findByProjectId(projectId): プロジェクトの請求書一覧
- findUnpaidInvoices(): 未払い請求書一覧
- findOverdueInvoices(): 期限超過請求書一覧

### 収益リポジトリ [RevenueRepository] [REVENUE_REPOSITORY]
収益の永続化を担当するリポジトリ

#### 主要メソッド
- findByPeriod(period): 期間別収益
- findByProject(projectId): プロジェクト別収益
- calculateTotalRevenue(projectId): 収益合計

### コストリポジトリ [CostRepository] [COST_REPOSITORY]
コストの永続化を担当するリポジトリ

#### 主要メソッド
- findByPeriod(period): 期間別コスト
- findByProject(projectId): プロジェクト別コスト
- calculateTotalCost(projectId): コスト合計

### 予算リポジトリ [BudgetRepository] [BUDGET_REPOSITORY]
予算の永続化を担当するリポジトリ

#### 主要メソッド
- findActiveByProject(projectId): アクティブな予算
- findExceededBudgets(): 超過予算一覧

### 財務レポートリポジトリ [FinancialReportRepository] [FINANCIAL_REPORT_REPOSITORY]
財務レポートの永続化を担当するリポジトリ

#### 主要メソッド
- findByPeriod(period): 期間別レポート
- findApprovedReports(projectId): 承認済みレポート