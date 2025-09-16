# 財務管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
財務管理サービスに関連するドメインモデルを定義する。収益、コスト、請求、予算などの財務データを管理する。

## エンティティ

### Revenue（収益）
```
Revenue {
  id: string
  projectId: string  // 外部参照
  date: Date
  amount: Money
  type: RevenueType
  status: RevenueStatus
  description: string?
  invoiceId: string?
  milestoneId: string?  // 外部参照
  recognitionMethod: RecognitionMethod
  createdById: string  // 外部参照
  createdAt: DateTime
  updatedAt: DateTime
}

enum RevenueType {
  MONTHLY_FEE      // 月次フィー
  MILESTONE        // マイルストーン達成
  CHANGE_ORDER     // 変更依頼
  EXPENSE_REIMBURSEMENT // 経費精算
  OTHER            // その他
}

enum RevenueStatus {
  PLANNED          // 予定
  CONFIRMED        // 確定
  INVOICED         // 請求済み
  COLLECTED        // 回収済み
  WRITTEN_OFF      // 貸倒
}

enum RecognitionMethod {
  CASH_BASIS       // 現金主義
  ACCRUAL_BASIS    // 発生主義
  PERCENTAGE_COMPLETION // 進行基準
}
```

### Cost（コスト）
```
Cost {
  id: string
  projectId: string  // 外部参照
  date: Date
  amount: Money
  category: CostCategory
  subcategory: string?
  description: string
  status: CostStatus
  relatedUserId: string?  // 外部参照（人件費の場合）
  vendorId: string?
  receipts: Receipt[]
  approvedById: string?  // 外部参照
  approvedAt: DateTime?
  createdById: string  // 外部参照
  createdAt: DateTime
}

enum CostCategory {
  LABOR            // 人件費
  OUTSOURCING      // 外注費
  TRAVEL           // 旅費交通費
  ENTERTAINMENT    // 交際費
  SUPPLIES         // 消耗品費
  SOFTWARE         // ソフトウェア費
  OTHER            // その他
}

enum CostStatus {
  DRAFT            // 下書き
  SUBMITTED        // 申請中
  APPROVED         // 承認済み
  REJECTED         // 却下
  PAID             // 支払済み
  CANCELLED        // キャンセル
}
```

### LaborCost（人件費）
```
LaborCost {
  id: string
  projectId: string  // 外部参照
  userId: string     // 外部参照
  period: DateRange
  hours: number
  hourlyRate: Money
  totalAmount: Money
  overhead: Money    // 間接費
  status: CostStatus
  timesheetIds: string[]  // 外部参照
  calculatedAt: DateTime
}
```

### Budget（予算）
```
Budget {
  id: string
  projectId: string  // 外部参照
  version: number
  totalAmount: Money
  period: DateRange
  categories: BudgetCategory[]
  status: BudgetStatus
  approvedById: string?  // 外部参照
  approvedAt: DateTime?
  notes: string?
  createdAt: DateTime
  effectiveFrom: Date
}

enum BudgetStatus {
  DRAFT            // 下書き
  SUBMITTED        // 申請中
  APPROVED         // 承認済み
  REVISED          // 改訂中
  ARCHIVED         // アーカイブ
}
```

### BudgetCategory（予算カテゴリ）
```
BudgetCategory {
  id: string
  budgetId: string
  category: CostCategory
  amount: Money
  percentage: number
  monthlyBreakdown: MonthlyBudget[]
  notes: string?
}
```

### MonthlyBudget（月次予算）
```
MonthlyBudget {
  id: string
  budgetCategoryId: string
  month: Date
  amount: Money
  adjustedAmount: Money?
  notes: string?
}
```

### Invoice（請求書）
```
Invoice {
  id: string
  invoiceNumber: string
  projectId: string  // 外部参照
  clientId: string   // 外部参照
  issueDate: Date
  dueDate: Date
  items: InvoiceItem[]
  subtotal: Money
  tax: TaxInfo
  total: Money
  status: InvoiceStatus
  billingAddress: Address
  notes: string?
  attachments: Attachment[]
  createdById: string  // 外部参照
  createdAt: DateTime
  sentAt: DateTime?
  paidAt: DateTime?
}

enum InvoiceStatus {
  DRAFT            // 下書き
  SENT             // 送付済み
  VIEWED           // 閲覧済み
  PARTIALLY_PAID   // 一部入金
  PAID             // 入金済み
  OVERDUE          // 期限超過
  CANCELLED        // キャンセル
  WRITTEN_OFF      // 貸倒
}
```

### InvoiceItem（請求明細）
```
InvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: Money
  amount: Money
  revenueId: string?
  order: number
}
```

### Payment（入金）
```
Payment {
  id: string
  invoiceId: string
  paymentDate: Date
  amount: Money
  paymentMethod: PaymentMethod
  reference: string?
  bankAccount: string?
  processingFee: Money?
  netAmount: Money
  status: PaymentStatus
  reconciledById: string?  // 外部参照
  reconciledAt: DateTime?
  notes: string?
}

enum PaymentMethod {
  BANK_TRANSFER    // 銀行振込
  CHECK            // 小切手
  CREDIT_CARD      // クレジットカード
  CASH             // 現金
  OTHER            // その他
}

enum PaymentStatus {
  PENDING          // 処理中
  COMPLETED        // 完了
  FAILED           // 失敗
  REFUNDED         // 返金済み
}
```

### Receivable（売掛金）
```
Receivable {
  id: string
  invoiceId: string
  originalAmount: Money
  outstandingAmount: Money
  daysOutstanding: number
  agingCategory: AgingCategory
  collectionStatus: CollectionStatus
  lastContactDate: Date?
  nextActionDate: Date?
  notes: string?
}

enum AgingCategory {
  CURRENT          // 期限内
  OVERDUE_30       // 30日超過
  OVERDUE_60       // 60日超過
  OVERDUE_90       // 90日超過
  OVERDUE_120_PLUS // 120日以上
}

enum CollectionStatus {
  NORMAL           // 通常
  FOLLOW_UP        // フォローアップ中
  DISPUTE          // 係争中
  COLLECTION_AGENCY // 回収業者委託
  LEGAL_ACTION     // 法的措置
  WRITTEN_OFF      // 貸倒
}
```

### FinancialReport（財務レポート）
```
FinancialReport {
  id: string
  type: ReportType
  period: DateRange
  projectId: string?  // 外部参照
  generatedAt: DateTime
  generatedById: string  // 外部参照
  data: JSON
  summary: FinancialSummary
  attachments: Attachment[]
}

enum ReportType {
  PROJECT_PL       // プロジェクト損益
  COMPANY_PL       // 全社損益
  CASH_FLOW        // キャッシュフロー
  BUDGET_VARIANCE  // 予実差異
  RECEIVABLES      // 売掛金
  PROFITABILITY    // 収益性分析
}
```

### FinancialSummary（財務サマリー）
```
FinancialSummary {
  totalRevenue: Money
  totalCost: Money
  grossProfit: Money
  grossMargin: number
  netProfit: Money
  netMargin: number
  cashFlow: Money
  outstandingReceivables: Money
}
```

## 値オブジェクト

### Money（金額）
```
Money {
  amount: number
  currency: Currency
  
  add(money: Money): Money
  subtract(money: Money): Money
  multiply(factor: number): Money
  divide(divisor: number): Money
  convert(toCurrency: Currency, rate: number): Money
  format(): string
}

enum Currency {
  JPY
  USD
  EUR
  GBP
  CNY
}
```

### TaxInfo（税情報）
```
TaxInfo {
  rate: number
  amount: Money
  type: TaxType
  inclusive: boolean
}

enum TaxType {
  CONSUMPTION_TAX  // 消費税
  VAT              // 付加価値税
  SALES_TAX        // 売上税
  WITHHOLDING_TAX  // 源泉徴収税
}
```

### Address（住所）
```
Address {
  company: string
  department: string?
  street1: string
  street2: string?
  city: string
  state: string?
  postalCode: string
  country: string
  contactPerson: string?
  phone: string?
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
  
  months(): number
  contains(date: Date): boolean
  overlaps(other: DateRange): boolean
}
```

### Receipt（領収書）
```
Receipt {
  id: string
  filename: string
  url: string
  uploadedAt: DateTime
  amount: Money?
  vendor: string?
}
```

### Attachment（添付ファイル）
```
Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  uploadedAt: DateTime
}
```

## 集約ルート

- `Revenue`: 収益管理の集約ルート
- `Cost`: コスト管理の集約ルート
- `Budget`: 予算管理の集約ルート
- `Invoice`: 請求管理の集約ルート
- `Payment`: 入金管理の集約ルート

## ドメインサービス

### RevenueRecognitionService
- 収益認識基準の適用
- 進行基準での収益計算
- 収益予測

### CostAllocationService
- コストの配賦計算
- 間接費の按分
- プロジェクト原価計算

### BudgetManagementService
- 予算消化率の計算
- 予実差異分析
- 予算超過アラート

### InvoicingService
- 請求書の自動生成
- 請求サイクル管理
- 督促プロセス

### CashFlowService
- キャッシュフロー予測
- 運転資金分析
- 資金繰り計画