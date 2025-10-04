# API仕様: 収益最適化サービス

## API概要
**目的**: プロジェクトとビジネスの財務状況を可視化し、収益性を最適化するRESTful API
**バージョン**: v1.0.0
**ベースURL**: `https://api.example.com/v1/revenue-optimization`

## 認証
**認証方式**: JWT (JSON Web Token)
**ヘッダー**: `Authorization: Bearer {token}`

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
```

### レスポンス形式
```json
{
  "success": boolean,
  "data": object,
  "message": string,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## エンドポイント定義

### Revenue API

#### GET /revenues
**概要**: 収益一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/revenues`
- **Parameters**:
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)
  - `projectId` (query, optional): プロジェクトIDフィルタ
  - `clientId` (query, optional): クライアントIDフィルタ
  - `status` (query, optional): ステータスフィルタ (Planned/Recognized/Invoiced/Collected)
  - `startDate` (query, optional): 期間開始日
  - `endDate` (query, optional): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "clientId": "uuid",
        "revenueType": "TimeAndMaterial",
        "amount": 10000000,
        "currency": "JPY",
        "recognitionDate": "2024-01-31",
        "billingPeriodStart": "2024-01-01",
        "billingPeriodEnd": "2024-01-31",
        "status": "Recognized",
        "taxRate": 10,
        "taxAmount": 1000000,
        "netAmount": 11000000
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

#### POST /revenues
**概要**: 新規収益を記録

**リクエスト**:
```json
{
  "projectId": "uuid",
  "clientId": "uuid",
  "contractId": "uuid",
  "revenueType": "TimeAndMaterial",
  "amount": 10000000,
  "currency": "JPY",
  "recognitionDate": "2024-01-31",
  "billingPeriodStart": "2024-01-01",
  "billingPeriodEnd": "2024-01-31",
  "description": "1月分の収益計上",
  "taxRate": 10
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "amount": 10000000,
    "status": "Recognized",
    "createdAt": "2024-02-01T00:00:00Z"
  }
}
```

#### GET /revenues/{id}
**概要**: 収益詳細を取得

#### PUT /revenues/{id}
**概要**: 収益情報を更新

### Cost API

#### GET /costs
**概要**: コスト一覧を取得

**Parameters**:
- `projectId` (query, optional): プロジェクトIDフィルタ
- `costType` (query, optional): コストタイプフィルタ (Labor/Material/Subcontract/Travel/Other)
- `costCategory` (query, optional): カテゴリフィルタ (Direct/Indirect/Overhead)
- `startDate` (query, optional): 期間開始日
- `endDate` (query, optional): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "costType": "Labor",
        "costCategory": "Direct",
        "amount": 8000000,
        "currency": "JPY",
        "incurredDate": "2024-01-31",
        "description": "1月分の人件費",
        "employeeId": "uuid"
      }
    ]
  }
}
```

#### POST /costs
**概要**: 新規コストを記録

**リクエスト**:
```json
{
  "projectId": "uuid",
  "costType": "Labor",
  "costCategory": "Direct",
  "amount": 8000000,
  "currency": "JPY",
  "incurredDate": "2024-01-31",
  "description": "1月分の人件費",
  "employeeId": "uuid",
  "quantity": 160,
  "unitPrice": 50000
}
```

#### GET /costs/{id}
**概要**: コスト詳細を取得

#### PUT /costs/{id}
**概要**: コスト情報を更新

#### PUT /costs/{id}/approve
**概要**: コストを承認

**リクエスト**:
```json
{
  "approvedBy": "uuid",
  "comment": "承認します"
}
```

### Budget API

#### GET /budgets
**概要**: 予算一覧を取得

**Parameters**:
- `projectId` (query, optional): プロジェクトIDフィルタ
- `departmentId` (query, optional): 部門IDフィルタ
- `fiscalYear` (query, optional): 会計年度フィルタ
- `status` (query, optional): ステータスフィルタ (Draft/Approved/Revised/Closed)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "fiscalYear": 2024,
        "fiscalPeriod": "Q1",
        "budgetType": "Quarterly",
        "totalBudget": 50000000,
        "allocatedBudget": 30000000,
        "remainingBudget": 20000000,
        "currency": "JPY",
        "status": "Approved"
      }
    ]
  }
}
```

#### POST /budgets
**概要**: 新規予算を作成

**リクエスト**:
```json
{
  "projectId": "uuid",
  "fiscalYear": 2024,
  "fiscalPeriod": "Q1",
  "budgetType": "Quarterly",
  "totalBudget": 50000000,
  "currency": "JPY",
  "notes": "Q1予算計画"
}
```

#### GET /budgets/{id}
**概要**: 予算詳細を取得

#### PUT /budgets/{id}
**概要**: 予算情報を更新

#### PUT /budgets/{id}/approve
**概要**: 予算を承認

### Invoice API

#### GET /invoices
**概要**: 請求書一覧を取得

**Parameters**:
- `projectId` (query, optional): プロジェクトIDフィルタ
- `clientId` (query, optional): クライアントIDフィルタ
- `status` (query, optional): ステータスフィルタ (Draft/Sent/Paid/Overdue/Cancelled)
- `startDate` (query, optional): 請求日開始
- `endDate` (query, optional): 請求日終了

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "invoiceNumber": "INV-2024-001",
        "projectId": "uuid",
        "clientId": "uuid",
        "invoiceDate": "2024-01-31",
        "dueDate": "2024-02-28",
        "subtotal": 10000000,
        "taxAmount": 1000000,
        "totalAmount": 11000000,
        "currency": "JPY",
        "status": "Sent"
      }
    ]
  }
}
```

#### POST /invoices
**概要**: 新規請求書を発行

**リクエスト**:
```json
{
  "projectId": "uuid",
  "clientId": "uuid",
  "invoiceDate": "2024-01-31",
  "dueDate": "2024-02-28",
  "paymentTerms": "月末締め翌月末払い",
  "billingAddress": "東京都...",
  "lineItems": [
    {
      "description": "コンサルティングサービス",
      "quantity": 160,
      "unitPrice": 62500,
      "amount": 10000000
    }
  ]
}
```

#### GET /invoices/{id}
**概要**: 請求書詳細を取得

#### PUT /invoices/{id}/send
**概要**: 請求書を送付

#### POST /invoices/{id}/payments
**概要**: 請求書への支払いを記録

**リクエスト**:
```json
{
  "paymentDate": "2024-02-28",
  "amount": 11000000,
  "currency": "JPY",
  "paymentMethod": "BankTransfer",
  "referenceNumber": "TRN-12345",
  "notes": "2月末入金"
}
```

### Profitability API

#### GET /profitability/projects/{projectId}
**概要**: プロジェクトの収益性を取得

**Parameters**:
- `startDate` (query, optional): 期間開始日
- `endDate` (query, optional): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "periodStart": "2024-01-01",
    "periodEnd": "2024-01-31",
    "totalRevenue": 10000000,
    "totalCost": 8000000,
    "grossProfit": 2000000,
    "grossMargin": 20.0,
    "operatingProfit": 1800000,
    "operatingMargin": 18.0,
    "netProfit": 1500000,
    "netMargin": 15.0,
    "roi": 18.75,
    "currency": "JPY"
  }
}
```

#### GET /profitability/clients/{clientId}
**概要**: クライアント別収益性を取得

#### POST /profitability/analyze
**概要**: 収益性分析を実行

**リクエスト**:
```json
{
  "projectIds": ["uuid1", "uuid2"],
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-03-31"
  },
  "analysisType": "Comparative"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "projects": [
        {
          "projectId": "uuid1",
          "grossMargin": 20.0,
          "ranking": 1
        },
        {
          "projectId": "uuid2",
          "grossMargin": 15.0,
          "ranking": 2
        }
      ],
      "averageMargin": 17.5,
      "recommendations": [
        "プロジェクト2のコスト削減を検討"
      ]
    }
  }
}
```

### Forecast API

#### GET /forecasts
**概要**: 財務予測一覧を取得

**Parameters**:
- `projectId` (query, optional): プロジェクトIDフィルタ
- `forecastType` (query, optional): 予測タイプ (Revenue/Cost/Cashflow/Profitability)
- `scenario` (query, optional): シナリオ (Optimistic/Realistic/Pessimistic)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "forecastType": "Revenue",
        "scenario": "Realistic",
        "periodStart": "2024-04-01",
        "periodEnd": "2024-06-30",
        "forecastAmount": 30000000,
        "confidence": 80,
        "assumptions": {
          "utilizationRate": 85,
          "billableRate": 90,
          "averageRate": 62500
        }
      }
    ]
  }
}
```

#### POST /forecasts
**概要**: 新規予測を作成

**リクエスト**:
```json
{
  "projectId": "uuid",
  "forecastType": "Revenue",
  "scenario": "Realistic",
  "periodStart": "2024-04-01",
  "periodEnd": "2024-06-30",
  "methodology": "時系列分析",
  "assumptions": {
    "utilizationRate": 85,
    "billableRate": 90
  }
}
```

#### GET /forecasts/{id}
**概要**: 予測詳細を取得

#### PUT /forecasts/{id}
**概要**: 予測情報を更新

### CashFlow API

#### GET /cashflows
**概要**: キャッシュフロー一覧を取得

**Parameters**:
- `projectId` (query, optional): プロジェクトIDフィルタ
- `flowType` (query, optional): フロータイプ (Inflow/Outflow)
- `category` (query, optional): カテゴリ (Operating/Investing/Financing)
- `startDate` (query, required): 期間開始日
- `endDate` (query, required): 期間終了日

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "flowType": "Inflow",
        "category": "Operating",
        "amount": 11000000,
        "currency": "JPY",
        "flowDate": "2024-02-28",
        "description": "請求書入金",
        "balance": 11000000
      }
    ],
    "summary": {
      "totalInflow": 11000000,
      "totalOutflow": 8000000,
      "netCashFlow": 3000000,
      "closingBalance": 3000000
    }
  }
}
```

#### POST /cashflows
**概要**: キャッシュフロー記録を作成

**リクエスト**:
```json
{
  "projectId": "uuid",
  "flowType": "Inflow",
  "category": "Operating",
  "amount": 11000000,
  "currency": "JPY",
  "flowDate": "2024-02-28",
  "description": "請求書入金",
  "relatedEntityType": "Invoice",
  "relatedEntityId": "uuid"
}
```

### ドメインサービスAPI

#### POST /revenue-recognition/recognize
**概要**: 収益認識処理を実行

**リクエスト**:
```json
{
  "projectId": "uuid",
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "recognitionMethod": "PercentageOfCompletion"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "revenues": [
      {
        "id": "uuid",
        "amount": 10000000,
        "recognitionDate": "2024-01-31",
        "completionPercentage": 50
      }
    ],
    "totalRecognized": 10000000
  }
}
```

#### POST /cost-allocation/allocate
**概要**: コスト配賦処理を実行

**リクエスト**:
```json
{
  "costId": "uuid",
  "allocationMethod": "TimeProportional",
  "targetProjects": ["uuid1", "uuid2"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "allocations": [
      {
        "projectId": "uuid1",
        "allocatedAmount": 5000000,
        "allocationRate": 62.5
      },
      {
        "projectId": "uuid2",
        "allocatedAmount": 3000000,
        "allocationRate": 37.5
      }
    ]
  }
}
```

#### POST /profitability-analysis/analyze
**概要**: プロジェクト収益性を分析

**リクエスト**:
```json
{
  "projectId": "uuid",
  "analysisDepth": "Detailed",
  "includeForecasts": true
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "profitability": {
      "grossMargin": 20.0,
      "trend": "Improving",
      "drivers": [
        {
          "factor": "Utilization Rate",
          "impact": "High",
          "currentValue": 85
        }
      ]
    },
    "recommendations": [
      "稼働率を90%まで向上させることで粗利率25%達成可能"
    ]
  }
}
```

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_REQUEST | 400 | リクエストが不正 |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CONFLICT | 409 | リソースの競合 |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| BUSINESS_RULE_VIOLATION | 422 | ビジネスルール違反 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### ビジネスルール違反の詳細エラーコード

| コード | 説明 |
|--------|------|
| INVOICE_NUMBER_DUPLICATE | 請求書番号が重複 |
| BUDGET_EXCEEDED | 予算超過 |
| INVALID_REVENUE_RECOGNITION | 不正な収益認識 |
| ALLOCATION_EXCEEDS_100 | 配賦率が100%超過 |
| NEGATIVE_BALANCE | マイナス残高 |
| INVOICE_ALREADY_PAID | 請求書は既に支払済み |

## レート制限
- **一般API**: 1000リクエスト/時間
- **重い処理（分析、予測）**: 100リクエスト/時間
- **制限時のレスポンス**: 429 Too Many Requests

## バージョン管理
- **現在**: v1.0.0
- **サポート**: v1.x系をサポート
- **廃止予定**: なし

## Webhooks

### 対応イベント
- `revenue.recognized`: 収益認識時
- `invoice.issued`: 請求書発行時
- `payment.received`: 支払受領時
- `budget.exceeded`: 予算超過時

### Webhook設定
```json
POST /webhooks
{
  "url": "https://client.example.com/webhook",
  "events": ["revenue.recognized", "budget.exceeded"],
  "secret": "webhook_secret"
}
```

### Webhookペイロード例
```json
{
  "event": "budget.exceeded",
  "timestamp": "2024-01-15T00:00:00Z",
  "data": {
    "budgetId": "uuid",
    "projectId": "uuid",
    "exceededAmount": 5000000,
    "percentage": 110
  }
}
```
