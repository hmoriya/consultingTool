# 財務管理API

**更新日: 2025-01-13**

## 概要

プロジェクトおよび全社の財務管理機能を提供するAPI。収益・コスト管理、請求・入金処理、予実管理などの機能を含む。

## エンドポイント一覧

### 収益管理
- `createRevenue` - 収益記録の作成
- `updateRevenue` - 収益記録の更新
- `deleteRevenue` - 収益記録の削除
- `getProjectRevenues` - プロジェクト収益一覧取得
- `getRevenueDetails` - 収益詳細取得

### コスト管理
- `createCost` - コスト記録の作成
- `updateCost` - コスト記録の更新  
- `deleteCost` - コスト記録の削除
- `getProjectCosts` - プロジェクトコスト一覧取得
- `approveCosts` - コスト承認

### 財務レポート
- `getProjectFinancials` - プロジェクト財務サマリー取得
- `getMonthlyFinancialReport` - 月次財務レポート取得
- `getCompanyFinancialSummary` - 全社財務サマリー取得
- `exportFinancialReport` - 財務レポートエクスポート

### 請求・入金管理
- `createInvoice` - 請求書作成
- `getInvoices` - 請求書一覧取得
- `updateInvoiceStatus` - 請求書ステータス更新
- `recordPayment` - 入金記録
- `getReceivables` - 売掛金一覧取得

### 予実管理
- `getBudgetActualComparison` - 予実比較データ取得
- `updateProjectBudget` - プロジェクト予算更新
- `getCashFlowForecast` - キャッシュフロー予測

## API詳細

### createRevenue

収益記録を作成する。

```typescript
async function createRevenue(data: CreateRevenueInput): Promise<RevenueResponse>
```

#### リクエスト
```typescript
interface CreateRevenueInput {
  projectId: string
  date: Date
  amount: number
  type: 'monthly_fee' | 'milestone' | 'change_order' | 'other'
  description?: string
  invoiceNo?: string
  milestoneId?: string  // マイルストーン請求の場合
}
```

#### レスポンス
```typescript
interface RevenueResponse {
  success: boolean
  data?: {
    id: string
    projectId: string
    date: Date
    amount: number
    type: string
    description?: string
    invoiceNo?: string
    status: 'pending' | 'invoiced' | 'paid'
    createdAt: Date
  }
  error?: string
}
```

#### 処理フロー
1. 認証・権限チェック（PM以上）
2. 入力値バリデーション
3. プロジェクト存在確認
4. 収益記録作成
5. プロジェクトメトリクス更新

---

### createCost

コスト記録を作成する。

```typescript
async function createCost(data: CreateCostInput): Promise<CostResponse>
```

#### リクエスト
```typescript
interface CreateCostInput {
  projectId: string
  date: Date
  amount: number
  category: 'labor' | 'outsourcing' | 'expense' | 'other'
  description?: string
  userId?: string  // 人件費の場合のユーザーID
  receipts?: string[]  // 領収書ファイルパス
}
```

#### 処理フロー
1. 認証・権限チェック
2. 入力値バリデーション
3. カテゴリ別の追加チェック
   - labor: ユーザーID必須、標準単価との照合
   - expense: 領収書推奨
4. コスト記録作成
5. 承認ワークフロー起動（閾値超過時）

---

### getProjectFinancials

プロジェクトの財務情報を月次で取得する。

```typescript
async function getProjectFinancials(
  projectId: string,
  month: Date
): Promise<ProjectFinancialsResponse>
```

#### レスポンス
```typescript
interface ProjectFinancialsResponse {
  success: boolean
  data?: {
    projectId: string
    month: Date
    revenues: Revenue[]
    costs: Cost[]
    laborCosts: LaborCost[]
    summary: {
      totalRevenue: number
      totalCost: number
      totalLaborCost: number
      totalOtherCost: number
      margin: number
      marginRate: number
      revenueChange: number  // 前月比
      budgetUtilization: number  // 予算消化率
    }
    comparison: {
      budget: number
      actualRevenue: number
      actualCost: number
      variance: number
      varianceRate: number
    }
  }
  error?: string
}

interface LaborCost {
  userId: string
  userName: string
  hours: number
  rate: number
  amount: number
  date: Date
}
```

#### 処理フロー
1. 権限チェック（プロジェクトメンバー）
2. 指定月の収益データ集計
3. コストデータ集計
4. 承認済み工数から人件費計算
5. サマリー計算
6. 前月データとの比較
7. 予算との比較

---

### createInvoice

請求書を作成する。

```typescript
async function createInvoice(data: CreateInvoiceInput): Promise<InvoiceResponse>
```

#### リクエスト
```typescript
interface CreateInvoiceInput {
  revenueIds: string[]  // 請求対象の収益記録ID
  issueDate: Date
  dueDate: Date
  billingAddress?: {
    company: string
    department?: string
    address: string
    contactPerson?: string
  }
  notes?: string
  taxRate?: number  // デフォルト: 0.1 (10%)
}
```

#### レスポンス
```typescript
interface InvoiceResponse {
  success: boolean
  data?: {
    id: string
    invoiceNo: string  // 自動採番
    projectId: string
    issueDate: Date
    dueDate: Date
    items: InvoiceItem[]
    subtotal: number
    tax: number
    total: number
    status: 'draft' | 'sent' | 'paid' | 'overdue'
    pdfUrl?: string
  }
  error?: string
}

interface InvoiceItem {
  description: string
  amount: number
  quantity: number
  unitPrice: number
}
```

#### 処理フロー
1. 権限チェック（PM以上）
2. 収益記録の検証
3. 請求書番号採番
4. 請求明細作成
5. 税額計算
6. PDF生成
7. 収益記録のステータス更新

---

### recordPayment

入金を記録し、売掛金を消し込む。

```typescript
async function recordPayment(data: RecordPaymentInput): Promise<PaymentResponse>
```

#### リクエスト
```typescript
interface RecordPaymentInput {
  invoiceId: string
  paymentDate: Date
  amount: number
  paymentMethod: 'bank_transfer' | 'check' | 'other'
  reference?: string  // 振込名義など
  bankAccount?: string
}
```

#### 処理フロー
1. 権限チェック（経理権限）
2. 請求書の存在確認
3. 金額照合
4. 差額がある場合の処理
   - 振込手数料の自動判定
   - 一部入金の処理
5. 入金記録作成
6. 請求書ステータス更新
7. 収益記録のステータス更新

---

### getBudgetActualComparison

予算と実績の比較データを取得する。

```typescript
async function getBudgetActualComparison(
  projectId: string,
  period?: { start: Date, end: Date }
): Promise<BudgetActualResponse>
```

#### レスポンス
```typescript
interface BudgetActualResponse {
  success: boolean
  data?: {
    budget: {
      total: number
      monthly: MonthlyBudget[]
      categories: CategoryBudget[]
    }
    actual: {
      revenue: number
      cost: number
      margin: number
      categories: CategoryActual[]
    }
    variance: {
      revenue: number
      cost: number
      margin: number
      utilizationRate: number
    }
    forecast: {
      completionRevenue: number
      completionCost: number
      completionMargin: number
      riskFlags: string[]
    }
    timeline: {
      month: string
      budgetRevenue: number
      actualRevenue: number
      budgetCost: number
      actualCost: number
    }[]
  }
  error?: string
}
```

---

### getCompanyFinancialSummary

全社の財務サマリーを取得する（エグゼクティブ向け）。

```typescript
async function getCompanyFinancialSummary(
  month: Date
): Promise<CompanyFinancialSummaryResponse>
```

#### レスポンス
```typescript
interface CompanyFinancialSummaryResponse {
  success: boolean
  data?: {
    summary: {
      revenue: number
      cost: number
      laborCost: number
      margin: number
      marginRate: number
      revenueChange: number  // 前月比
      revenueChangeYoY: number  // 前年同月比
    }
    projectRevenues: {
      projectId: string
      projectName: string
      clientName: string
      revenue: number
      marginRate: number
    }[]
    departmentSummary: {
      department: string
      revenue: number
      cost: number
      headcount: number
      revenuePerHead: number
    }[]
    cashFlow: {
      receivables: number
      payables: number
      cash: number
      forecast30Days: number
      forecast60Days: number
    }
    kpis: {
      utilizationRate: number
      billableRate: number
      dso: number  // 売掛金回転日数
      projectMarginDistribution: {
        range: string
        count: number
      }[]
    }
  }
  error?: string
}
```

#### 処理フロー
1. エグゼクティブ権限チェック
2. 全プロジェクトの収益集計
3. コスト集計（承認済みのみ）
4. 人件費計算
5. 部門別集計
6. キャッシュフロー計算
7. KPI算出

---

### getCashFlowForecast

キャッシュフロー予測を取得する。

```typescript
async function getCashFlowForecast(
  months: number = 3
): Promise<CashFlowForecastResponse>
```

#### レスポンス
```typescript
interface CashFlowForecastResponse {
  success: boolean
  data?: {
    currentCash: number
    forecast: {
      month: string
      inflow: {
        confirmed: number  // 確定収入
        probable: number   // 見込み収入（確率加重）
        total: number
      }
      outflow: {
        fixed: number      // 固定費
        variable: number   // 変動費
        total: number
      }
      netCashFlow: number
      endingCash: number
      alerts: string[]
    }[]
    scenarios: {
      bestCase: number     // 楽観シナリオ
      expected: number     // 期待値
      worstCase: number    // 悲観シナリオ
    }
    recommendations: string[]
  }
  error?: string
}
```

## エラーハンドリング

### 共通エラー
- `UNAUTHORIZED`: 認証が必要です
- `PERMISSION_DENIED`: 権限がありません
- `PROJECT_NOT_FOUND`: プロジェクトが見つかりません
- `INVALID_AMOUNT`: 金額が不正です
- `DUPLICATE_ENTRY`: 重複する記録があります

### 財務固有エラー
- `BUDGET_EXCEEDED`: 予算を超過しています
- `INVOICE_ALREADY_PAID`: 既に支払済みです
- `INSUFFICIENT_BALANCE`: 残高不足です
- `APPROVAL_REQUIRED`: 承認が必要です

## データ整合性

### トランザクション管理
- 収益・コストの作成/更新時はトランザクション使用
- 請求書作成時は関連データも同時更新
- 入金処理は厳密な整合性チェック

### 監査証跡
- すべての財務データ変更を記録
- 承認履歴の保持
- 削除は論理削除（deletedAtフラグ）

## パフォーマンス最適化

### インデックス
- projectId, date での複合インデックス
- status でのインデックス
- 集計クエリの最適化

### キャッシュ戦略
- 月次サマリーは日次でキャッシュ
- 全社KPIは1時間キャッシュ
- リアルタイム性が必要な場合は明示的に指定