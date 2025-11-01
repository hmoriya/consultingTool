# BC-002: API設計

**BC**: Financial Health & Profitability [財務健全性と収益性] [FINANCIAL_HEALTH_PROFITABILITY]
**作成日**: 2025-10-31
**最終更新**: 2025-10-31
**V2移行元**: services/revenue-optimization-service/api/
**Issue #146対応**: WHAT層（能力定義）- API仕様のみを定義、利用方法はユースケース層に配置

---

## 目次

1. [概要](#overview)
2. [API設計原則](#api-design-principles)
3. [認証・認可](#authentication-authorization)
4. [API仕様](#api-specifications)
   - [Budget Management API](#budget-management-api)
   - [Cost Management API](#cost-management-api)
   - [Revenue Management API](#revenue-management-api)
   - [Profitability Analysis API](#profitability-analysis-api)
5. [BC間連携API](#cross-bc-integration-api)
6. [エラーハンドリング](#error-handling)
7. [レート制限とSLA](#rate-limiting-sla)
8. [V2からの移行](#v2-migration)

---

## 概要 {#overview}

このAPIドキュメントは、BC-002（財務健全性と収益性）が提供するAPI能力を定義します。

### スコープ定義（Issue #146対応）

**WHAT層（本ファイル）**: BC-002が提供するAPI能力の定義
- エンドポイント仕様
- リクエスト/レスポンススキーマ
- 認証・認可要件
- エラーコード
- レート制限とSLA

**HOW層（ユースケース層）**: 各ユースケースにおける具体的なAPI利用方法
- 配置場所: `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`
- 内容: シーケンス図、利用パターン、エラーハンドリング例

### API提供範囲

BC-002は以下4カテゴリのAPI能力を提供:

1. **Budget Management API**: 予算計画・承認・配分・監視
2. **Cost Management API**: コスト記録・分類・配賦・分析
3. **Revenue Management API**: 収益認識・請求・入金管理
4. **Profitability Analysis API**: 収益性分析・予測・改善アクション

---

## API設計原則 {#api-design-principles}

### RESTful設計

- **リソース指向**: エンドポイントは名詞で表現（budgets, costs, revenues）
- **HTTPメソッド**: GET（照会）, POST（作成）, PUT（更新）, DELETE（削除）
- **ステートレス**: 各リクエストは独立して処理可能

### データ形式

- **Content-Type**: `application/json` (デフォルト)
- **Date/Time形式**: ISO 8601（例: `2025-10-31T10:30:00Z`）
- **通貨形式**: Decimal型（例: `10000.50`）+ 通貨コード（例: `JPY`）

### バージョニング

- **URLパスバージョン**: `/api/v1/bc-002/...` （将来的な互換性確保）
- **現行バージョン**: v1（2025-10-31時点）

---

## 認証・認可 {#authentication-authorization}

### 認証方式

BC-002のすべてのAPIは**OAuth 2.0 + JWT**による認証が必須です。

#### 認証フロー

```mermaid
sequenceDiagram
    participant Client
    participant BC-003 as BC-003 (Auth)
    participant BC-002 as BC-002 API

    Client->>BC-003: POST /oauth/token
    BC-003-->>Client: JWT Token
    Client->>BC-002: GET /api/bc-002/budgets<br/>Header: Authorization: Bearer {token}
    BC-002->>BC-003: Token検証
    BC-003-->>BC-002: Token Valid + Claims
    BC-002-->>Client: 200 OK + Budgets
```

#### リクエストヘッダー

すべてのAPIリクエストに以下ヘッダーが必須:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-Request-ID: uuid-for-tracing
```

### 認可ポリシー

BC-002は**ロールベースアクセス制御（RBAC）**を採用。

#### ロール定義

| ロール | 権限スコープ | 説明 |
|-------|-------------|------|
| **financial_admin** | `finance:*` | 全財務操作（予算承認、コスト配賦、収益管理） |
| **budget_manager** | `budget:read`, `budget:write`, `budget:approve` | 予算計画・承認 |
| **accountant** | `cost:read`, `cost:write`, `revenue:read`, `revenue:write` | コスト・収益記録 |
| **project_manager** | `budget:read`, `cost:read` | 自プロジェクトの予算・コスト閲覧 |
| **executive** | `profitability:read`, `budget:read`, `cost:read`, `revenue:read` | 全体財務指標閲覧 |
| **auditor** | `*:read` | 全データ閲覧（変更不可） |

#### 権限チェック

各エンドポイントは必要な権限スコープを定義（後述の各API仕様参照）。

---

## API仕様 {#api-specifications}

---

### 1. Budget Management API {#budget-management-api}

予算計画・承認・配分・監視のためのAPI群。

---

#### POST /api/bc-002/budgets
**説明**: 新規予算を作成

**リクエスト**:
```json
{
  "name": "2025年度Q1予算",
  "fiscalYear": 2025,
  "fiscalQuarter": 1,
  "totalAmount": 50000000.00,
  "currency": "JPY",
  "items": [
    {
      "category": "PERSONNEL",
      "allocatedAmount": 30000000.00,
      "description": "人件費"
    },
    {
      "category": "INFRASTRUCTURE",
      "allocatedAmount": 15000000.00,
      "description": "インフラコスト"
    },
    {
      "category": "MARKETING",
      "allocatedAmount": 5000000.00,
      "description": "マーケティング費用"
    }
  ],
  "responsibleUserId": "uuid-of-budget-manager"
}
```

**レスポンス（201 Created）**:
```json
{
  "budgetId": "uuid-of-budget",
  "name": "2025年度Q1予算",
  "status": "draft",
  "totalAmount": 50000000.00,
  "currency": "JPY",
  "items": [
    {
      "itemId": "uuid-of-item-1",
      "category": "PERSONNEL",
      "allocatedAmount": 30000000.00,
      "consumedAmount": 0.00,
      "consumptionRate": 0.0
    }
  ],
  "createdAt": "2025-10-31T10:00:00Z",
  "createdBy": "uuid-of-creator"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_001 | 予算項目の合計が総予算額を超過 | 項目配分額を調整 |
| 400 | BC002_ERR_002 | 会計年度・四半期の組み合わせが不正 | 有効な会計期間を指定 |
| 400 | BC002_ERR_003 | totalAmountが0以下 | 正の金額を指定 |
| 409 | BC002_ERR_004 | 同一会計期間に承認済み予算が既存 | 既存予算を修正または新規期間を選択 |

**認証**: Bearer Token必須
**権限**: `budget:write`
**レート制限**: 20 req/min
**SLA**: p95 < 800ms

---

#### GET /api/bc-002/budgets/{budgetId}
**説明**: 予算詳細を取得

**パスパラメータ**:
- `budgetId` (UUID, 必須): 予算ID

**クエリパラメータ**:
- `includeItems` (boolean, オプション): 予算項目詳細を含めるか（デフォルト: true）
- `includeConsumption` (boolean, オプション): 消化状況を含めるか（デフォルト: true）

**レスポンス（200 OK）**:
```json
{
  "budgetId": "uuid-of-budget",
  "name": "2025年度Q1予算",
  "status": "approved",
  "fiscalYear": 2025,
  "fiscalQuarter": 1,
  "totalAmount": 50000000.00,
  "consumedAmount": 35000000.00,
  "consumptionRate": 0.70,
  "currency": "JPY",
  "items": [
    {
      "itemId": "uuid-of-item-1",
      "category": "PERSONNEL",
      "allocatedAmount": 30000000.00,
      "consumedAmount": 22000000.00,
      "consumptionRate": 0.733,
      "alerts": [
        {
          "type": "warning",
          "message": "消化率70%を超過",
          "triggeredAt": "2025-10-20T15:30:00Z"
        }
      ]
    }
  ],
  "approvedAt": "2025-09-15T14:00:00Z",
  "approvedBy": "uuid-of-approver",
  "responsibleUserId": "uuid-of-budget-manager",
  "createdAt": "2025-09-10T10:00:00Z",
  "updatedAt": "2025-10-31T09:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 404 | BC002_ERR_010 | 指定予算が存在しない | 有効なbudgetIdを指定 |
| 403 | BC002_ERR_011 | アクセス権限なし | 適切なロールを付与 |

**認証**: Bearer Token必須
**権限**: `budget:read`
**レート制限**: 100 req/min
**SLA**: p95 < 300ms

---

#### PUT /api/bc-002/budgets/{budgetId}
**説明**: 予算を更新（draft状態のみ可能）

**パスパラメータ**:
- `budgetId` (UUID, 必須): 予算ID

**リクエスト**:
```json
{
  "name": "2025年度Q1予算（改訂版）",
  "totalAmount": 55000000.00,
  "items": [
    {
      "itemId": "uuid-of-item-1",
      "allocatedAmount": 32000000.00
    },
    {
      "itemId": "uuid-of-item-2",
      "allocatedAmount": 18000000.00
    },
    {
      "category": "TRAINING",
      "allocatedAmount": 5000000.00,
      "description": "新規：研修費用"
    }
  ]
}
```

**レスポンス（200 OK）**: GET /budgets/{budgetId} と同形式

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_020 | 承認済み予算は変更不可 | 再承認フローを実行 |
| 400 | BC002_ERR_021 | 項目合計が総予算を超過 | 配分額を調整 |
| 404 | BC002_ERR_010 | 指定予算が存在しない | 有効なbudgetIdを指定 |

**認証**: Bearer Token必須
**権限**: `budget:write`
**レート制限**: 30 req/min
**SLA**: p95 < 600ms

---

#### DELETE /api/bc-002/budgets/{budgetId}
**説明**: 予算を削除（draft状態のみ可能）

**パスパラメータ**:
- `budgetId` (UUID, 必須): 予算ID

**レスポンス（204 No Content）**: Bodyなし

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_030 | 承認済み予算は削除不可 | ステータスを確認 |
| 404 | BC002_ERR_010 | 指定予算が存在しない | 有効なbudgetIdを指定 |

**認証**: Bearer Token必須
**権限**: `budget:delete`
**レート制限**: 10 req/min
**SLA**: p95 < 400ms

---

#### GET /api/bc-002/budgets
**説明**: 予算一覧を取得

**クエリパラメータ**:
- `fiscalYear` (integer, オプション): 会計年度フィルタ
- `fiscalQuarter` (integer, オプション): 会計四半期フィルタ（1-4）
- `status` (string, オプション): ステータスフィルタ（draft, approved, rejected）
- `minConsumptionRate` (float, オプション): 最小消化率フィルタ（0.0-1.0）
- `maxConsumptionRate` (float, オプション): 最大消化率フィルタ（0.0-1.0）
- `page` (integer, オプション): ページ番号（デフォルト: 1）
- `pageSize` (integer, オプション): ページサイズ（デフォルト: 20, 最大: 100）
- `sortBy` (string, オプション): ソートキー（fiscalYear, consumptionRate, createdAt）
- `sortOrder` (string, オプション): ソート順（asc, desc）

**レスポンス（200 OK）**:
```json
{
  "budgets": [
    {
      "budgetId": "uuid-of-budget-1",
      "name": "2025年度Q1予算",
      "status": "approved",
      "fiscalYear": 2025,
      "fiscalQuarter": 1,
      "totalAmount": 50000000.00,
      "consumedAmount": 35000000.00,
      "consumptionRate": 0.70,
      "currency": "JPY",
      "hasAlerts": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
```

**認証**: Bearer Token必須
**権限**: `budget:read`
**レート制限**: 100 req/min
**SLA**: p95 < 500ms

---

#### POST /api/bc-002/budgets/{budgetId}/approve
**説明**: 予算を承認

**パスパラメータ**:
- `budgetId` (UUID, 必須): 予算ID

**リクエスト**:
```json
{
  "approvalComment": "Q1予算計画を承認します",
  "effectiveDate": "2025-01-01"
}
```

**レスポンス（200 OK）**:
```json
{
  "budgetId": "uuid-of-budget",
  "status": "approved",
  "approvedAt": "2025-10-31T14:00:00Z",
  "approvedBy": "uuid-of-approver",
  "approvalComment": "Q1予算計画を承認します",
  "effectiveDate": "2025-01-01"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_040 | draft状態でない予算は承認不可 | ステータスを確認 |
| 409 | BC002_ERR_004 | 同一会計期間に承認済み予算が既存 | 既存予算を無効化 |
| 403 | BC002_ERR_041 | 承認権限なし | budget:approve権限を付与 |

**認証**: Bearer Token必須
**権限**: `budget:approve`
**レート制限**: 10 req/min
**SLA**: p95 < 700ms

---

#### POST /api/bc-002/budgets/{budgetId}/reallocate
**説明**: 予算を再配分（承認済み予算の項目間で金額を移動）

**パスパラメータ**:
- `budgetId` (UUID, 必須): 予算ID

**リクエスト**:
```json
{
  "reallocations": [
    {
      "fromItemId": "uuid-of-item-1",
      "toItemId": "uuid-of-item-2",
      "amount": 2000000.00
    }
  ],
  "reason": "人件費の余剰をインフラコストに再配分",
  "approvedBy": "uuid-of-approver"
}
```

**レスポンス（200 OK）**: GET /budgets/{budgetId} と同形式

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_050 | 再配分元の項目残高不足 | 配分額を削減 |
| 400 | BC002_ERR_051 | 承認済み予算でない | approved状態を確認 |

**認証**: Bearer Token必須
**権限**: `budget:reallocate`
**レート制限**: 20 req/min
**SLA**: p95 < 800ms

---

### 2. Cost Management API {#cost-management-api}

コスト記録・分類・配賦・分析のためのAPI群。

---

#### POST /api/bc-002/costs
**説明**: 新規コストを記録

**リクエスト**:
```json
{
  "projectId": "uuid-of-project",
  "category": "PERSONNEL",
  "subCategory": "DEVELOPER_SALARY",
  "amount": 800000.00,
  "currency": "JPY",
  "incurredDate": "2025-10-31",
  "description": "エンジニアA 10月分給与",
  "budgetItemId": "uuid-of-budget-item",
  "invoiceNumber": "INV-2025-10-001",
  "vendor": "社内（給与）",
  "tags": ["personnel", "development"]
}
```

**レスポンス（201 Created）**:
```json
{
  "costId": "uuid-of-cost",
  "projectId": "uuid-of-project",
  "category": "PERSONNEL",
  "subCategory": "DEVELOPER_SALARY",
  "amount": 800000.00,
  "currency": "JPY",
  "incurredDate": "2025-10-31",
  "status": "recorded",
  "budgetImpact": {
    "budgetItemId": "uuid-of-budget-item",
    "previousConsumption": 22000000.00,
    "newConsumption": 22800000.00,
    "consumptionRate": 0.76
  },
  "createdAt": "2025-10-31T15:30:00Z",
  "createdBy": "uuid-of-accountant"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_100 | amountが0以下 | 正の金額を指定 |
| 400 | BC002_ERR_101 | 無効なcategoryまたはsubCategory | 有効なカテゴリを選択 |
| 400 | BC002_ERR_102 | incurredDateが未来日付 | 過去または当日の日付を指定 |
| 404 | BC002_ERR_103 | 指定budgetItemIdが存在しない | 有効な予算項目を指定 |

**認証**: Bearer Token必須
**権限**: `cost:write`
**レート制限**: 50 req/min
**SLA**: p95 < 600ms

---

#### GET /api/bc-002/costs/{costId}
**説明**: コスト詳細を取得

**パスパラメータ**:
- `costId` (UUID, 必須): コストID

**レスポンス（200 OK）**:
```json
{
  "costId": "uuid-of-cost",
  "projectId": "uuid-of-project",
  "projectName": "Project Alpha",
  "category": "PERSONNEL",
  "subCategory": "DEVELOPER_SALARY",
  "amount": 800000.00,
  "currency": "JPY",
  "incurredDate": "2025-10-31",
  "description": "エンジニアA 10月分給与",
  "status": "allocated",
  "budgetItemId": "uuid-of-budget-item",
  "invoiceNumber": "INV-2025-10-001",
  "vendor": "社内（給与）",
  "tags": ["personnel", "development"],
  "allocationHistory": [
    {
      "allocatedAt": "2025-10-31T16:00:00Z",
      "allocatedBy": "uuid-of-accountant",
      "budgetItemId": "uuid-of-budget-item"
    }
  ],
  "createdAt": "2025-10-31T15:30:00Z",
  "createdBy": "uuid-of-accountant",
  "updatedAt": "2025-10-31T16:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 404 | BC002_ERR_110 | 指定コストが存在しない | 有効なcostIdを指定 |
| 403 | BC002_ERR_111 | アクセス権限なし | 適切なロールを付与 |

**認証**: Bearer Token必須
**権限**: `cost:read`
**レート制限**: 100 req/min
**SLA**: p95 < 300ms

---

#### PUT /api/bc-002/costs/{costId}
**説明**: コストを更新

**パスパラメータ**:
- `costId` (UUID, 必須): コストID

**リクエスト**:
```json
{
  "amount": 820000.00,
  "description": "エンジニアA 10月分給与（残業手当含む）",
  "tags": ["personnel", "development", "overtime"]
}
```

**レスポンス（200 OK）**: GET /costs/{costId} と同形式

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_120 | 確定済みコストは変更不可 | ステータスを確認 |
| 404 | BC002_ERR_110 | 指定コストが存在しない | 有効なcostIdを指定 |

**認証**: Bearer Token必須
**権限**: `cost:write`
**レート制限**: 30 req/min
**SLA**: p95 < 500ms

---

#### DELETE /api/bc-002/costs/{costId}
**説明**: コストを削除

**パスパラメータ**:
- `costId` (UUID, 必須): コストID

**レスポンス（204 No Content）**: Bodyなし

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_130 | 配賦済みコストは削除不可 | 配賦を解除してから削除 |
| 404 | BC002_ERR_110 | 指定コストが存在しない | 有効なcostIdを指定 |

**認証**: Bearer Token必須
**権限**: `cost:delete`
**レート制限**: 10 req/min
**SLA**: p95 < 400ms

---

#### GET /api/bc-002/costs
**説明**: コスト一覧を取得

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ
- `category` (string, オプション): カテゴリフィルタ
- `startDate` (date, オプション): 発生日開始フィルタ
- `endDate` (date, オプション): 発生日終了フィルタ
- `minAmount` (decimal, オプション): 最小金額フィルタ
- `maxAmount` (decimal, オプション): 最大金額フィルタ
- `status` (string, オプション): ステータスフィルタ（recorded, allocated, confirmed）
- `tags` (string, オプション): タグフィルタ（カンマ区切り）
- `page` (integer, オプション): ページ番号（デフォルト: 1）
- `pageSize` (integer, オプション): ページサイズ（デフォルト: 50, 最大: 200）
- `sortBy` (string, オプション): ソートキー（incurredDate, amount, category）
- `sortOrder` (string, オプション): ソート順（asc, desc）

**レスポンス（200 OK）**:
```json
{
  "costs": [
    {
      "costId": "uuid-of-cost",
      "projectId": "uuid-of-project",
      "projectName": "Project Alpha",
      "category": "PERSONNEL",
      "amount": 800000.00,
      "currency": "JPY",
      "incurredDate": "2025-10-31",
      "status": "allocated"
    }
  ],
  "summary": {
    "totalCosts": 25000000.00,
    "costsByCategory": {
      "PERSONNEL": 18000000.00,
      "INFRASTRUCTURE": 5000000.00,
      "MARKETING": 2000000.00
    }
  },
  "pagination": {
    "currentPage": 1,
    "pageSize": 50,
    "totalItems": 320,
    "totalPages": 7
  }
}
```

**認証**: Bearer Token必須
**権限**: `cost:read`
**レート制限**: 100 req/min
**SLA**: p95 < 800ms

---

#### GET /api/bc-002/costs/analyze-trends
**説明**: コストトレンドを分析

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ
- `category` (string, オプション): カテゴリフィルタ
- `startDate` (date, 必須): 分析期間開始
- `endDate` (date, 必須): 分析期間終了
- `granularity` (string, オプション): 粒度（daily, weekly, monthly）デフォルト: monthly

**レスポンス（200 OK）**:
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-10-31",
    "granularity": "monthly"
  },
  "trends": [
    {
      "period": "2025-01",
      "totalCosts": 4500000.00,
      "costsByCategory": {
        "PERSONNEL": 3000000.00,
        "INFRASTRUCTURE": 1200000.00,
        "MARKETING": 300000.00
      }
    },
    {
      "period": "2025-02",
      "totalCosts": 4800000.00,
      "costsByCategory": {
        "PERSONNEL": 3200000.00,
        "INFRASTRUCTURE": 1300000.00,
        "MARKETING": 300000.00
      }
    }
  ],
  "insights": {
    "averageMonthlyCost": 4650000.00,
    "highestCostMonth": "2025-10",
    "highestCostAmount": 5200000.00,
    "growthRate": 0.15,
    "forecast": {
      "nextMonth": 5400000.00,
      "confidence": 0.85
    }
  }
}
```

**認証**: Bearer Token必須
**権限**: `cost:read`, `cost:analyze`
**レート制限**: 30 req/min
**SLA**: p95 < 2000ms（分析処理のため長め）

---

#### POST /api/bc-002/costs/allocate
**説明**: コストを予算項目に配賦

**リクエスト**:
```json
{
  "costIds": [
    "uuid-of-cost-1",
    "uuid-of-cost-2",
    "uuid-of-cost-3"
  ],
  "budgetItemId": "uuid-of-budget-item",
  "allocationNote": "10月人件費の一括配賦"
}
```

**レスポンス（200 OK）**:
```json
{
  "allocatedCosts": [
    {
      "costId": "uuid-of-cost-1",
      "amount": 800000.00,
      "allocatedAt": "2025-10-31T16:00:00Z"
    },
    {
      "costId": "uuid-of-cost-2",
      "amount": 850000.00,
      "allocatedAt": "2025-10-31T16:00:00Z"
    }
  ],
  "budgetImpact": {
    "budgetItemId": "uuid-of-budget-item",
    "previousConsumption": 22000000.00,
    "newConsumption": 24500000.00,
    "allocatedAmount": 2500000.00,
    "consumptionRate": 0.817
  }
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_140 | 一部のコストが既に配賦済み | 未配賦コストのみ指定 |
| 404 | BC002_ERR_103 | 指定budgetItemIdが存在しない | 有効な予算項目を指定 |

**認証**: Bearer Token必須
**権限**: `cost:allocate`
**レート制限**: 20 req/min
**SLA**: p95 < 1000ms

---

### 3. Revenue Management API {#revenue-management-api}

収益認識・請求・入金管理のためのAPI群。

---

#### POST /api/bc-002/revenues
**説明**: 新規収益を記録

**リクエスト**:
```json
{
  "projectId": "uuid-of-project",
  "amount": 10000000.00,
  "currency": "JPY",
  "recognitionDate": "2025-10-31",
  "revenueType": "CONTRACT_COMPLETION",
  "description": "プロジェクトAlpha 第1フェーズ完了",
  "contractId": "uuid-of-contract",
  "invoiceId": "uuid-of-invoice"
}
```

**レスポンス（201 Created）**:
```json
{
  "revenueId": "uuid-of-revenue",
  "projectId": "uuid-of-project",
  "amount": 10000000.00,
  "currency": "JPY",
  "recognitionDate": "2025-10-31",
  "revenueType": "CONTRACT_COMPLETION",
  "status": "recognized",
  "profitabilityImpact": {
    "projectProfitMargin": 0.25,
    "totalRevenue": 30000000.00,
    "totalCost": 22500000.00
  },
  "createdAt": "2025-10-31T17:00:00Z",
  "createdBy": "uuid-of-accountant"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_200 | amountが0以下 | 正の金額を指定 |
| 400 | BC002_ERR_201 | 無効なrevenueType | 有効な収益タイプを選択 |
| 404 | BC002_ERR_202 | 指定projectIdが存在しない | 有効なプロジェクトを指定 |

**認証**: Bearer Token必須
**権限**: `revenue:write`
**レート制限**: 50 req/min
**SLA**: p95 < 600ms

---

#### GET /api/bc-002/revenues/{revenueId}
**説明**: 収益詳細を取得

**パスパラメータ**:
- `revenueId` (UUID, 必須): 収益ID

**レスポンス（200 OK）**:
```json
{
  "revenueId": "uuid-of-revenue",
  "projectId": "uuid-of-project",
  "projectName": "Project Alpha",
  "amount": 10000000.00,
  "currency": "JPY",
  "recognitionDate": "2025-10-31",
  "revenueType": "CONTRACT_COMPLETION",
  "status": "recognized",
  "description": "プロジェクトAlpha 第1フェーズ完了",
  "contractId": "uuid-of-contract",
  "invoiceId": "uuid-of-invoice",
  "invoice": {
    "invoiceNumber": "INV-2025-10-100",
    "issueDate": "2025-10-25",
    "dueDate": "2025-11-25",
    "status": "issued"
  },
  "createdAt": "2025-10-31T17:00:00Z",
  "createdBy": "uuid-of-accountant"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 404 | BC002_ERR_210 | 指定収益が存在しない | 有効なrevenueIdを指定 |
| 403 | BC002_ERR_211 | アクセス権限なし | 適切なロールを付与 |

**認証**: Bearer Token必須
**権限**: `revenue:read`
**レート制限**: 100 req/min
**SLA**: p95 < 300ms

---

#### PUT /api/bc-002/revenues/{revenueId}
**説明**: 収益を更新

**パスパラメータ**:
- `revenueId` (UUID, 必須): 収益ID

**リクエスト**:
```json
{
  "amount": 10500000.00,
  "description": "プロジェクトAlpha 第1フェーズ完了（追加機能含む）"
}
```

**レスポンス（200 OK）**: GET /revenues/{revenueId} と同形式

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_220 | 確定済み収益は変更不可 | ステータスを確認 |
| 404 | BC002_ERR_210 | 指定収益が存在しない | 有効なrevenueIdを指定 |

**認証**: Bearer Token必須
**権限**: `revenue:write`
**レート制限**: 30 req/min
**SLA**: p95 < 500ms

---

#### GET /api/bc-002/revenues
**説明**: 収益一覧を取得

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ
- `revenueType` (string, オプション): 収益タイプフィルタ
- `startDate` (date, オプション): 認識日開始フィルタ
- `endDate` (date, オプション): 認識日終了フィルタ
- `minAmount` (decimal, オプション): 最小金額フィルタ
- `status` (string, オプション): ステータスフィルタ
- `page` (integer, オプション): ページ番号（デフォルト: 1）
- `pageSize` (integer, オプション): ページサイズ（デフォルト: 50, 最大: 200）
- `sortBy` (string, オプション): ソートキー（recognitionDate, amount）
- `sortOrder` (string, オプション): ソート順（asc, desc）

**レスポンス（200 OK）**:
```json
{
  "revenues": [
    {
      "revenueId": "uuid-of-revenue",
      "projectId": "uuid-of-project",
      "projectName": "Project Alpha",
      "amount": 10000000.00,
      "currency": "JPY",
      "recognitionDate": "2025-10-31",
      "revenueType": "CONTRACT_COMPLETION",
      "status": "recognized"
    }
  ],
  "summary": {
    "totalRevenue": 80000000.00,
    "revenueByType": {
      "CONTRACT_COMPLETION": 50000000.00,
      "MILESTONE_ACHIEVEMENT": 30000000.00
    }
  },
  "pagination": {
    "currentPage": 1,
    "pageSize": 50,
    "totalItems": 85,
    "totalPages": 2
  }
}
```

**認証**: Bearer Token必須
**権限**: `revenue:read`
**レート制限**: 100 req/min
**SLA**: p95 < 800ms

---

#### GET /api/bc-002/revenues/forecast
**説明**: 収益予測を取得

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ
- `forecastPeriod` (integer, 必須): 予測期間（月数）
- `confidenceLevel` (float, オプション): 信頼水準（0.0-1.0）デフォルト: 0.8

**レスポンス（200 OK）**:
```json
{
  "forecastPeriod": {
    "startDate": "2025-11-01",
    "endDate": "2026-01-31",
    "months": 3
  },
  "forecast": [
    {
      "month": "2025-11",
      "predictedRevenue": 8500000.00,
      "confidenceInterval": {
        "lower": 7500000.00,
        "upper": 9500000.00
      }
    },
    {
      "month": "2025-12",
      "predictedRevenue": 9000000.00,
      "confidenceInterval": {
        "lower": 8000000.00,
        "upper": 10000000.00
      }
    }
  ],
  "assumptions": [
    "過去12ヶ月の収益トレンドに基づく",
    "契約中プロジェクトのマイルストーン予定を反映",
    "季節変動（年末の増加傾向）を考慮"
  ],
  "confidenceLevel": 0.8
}
```

**認証**: Bearer Token必須
**権限**: `revenue:read`, `revenue:forecast`
**レート制限**: 20 req/min
**SLA**: p95 < 3000ms（予測計算のため長め）

---

#### POST /api/bc-002/invoices
**説明**: 新規請求書を作成

**リクエスト**:
```json
{
  "projectId": "uuid-of-project",
  "clientId": "uuid-of-client",
  "invoiceNumber": "INV-2025-10-100",
  "issueDate": "2025-10-25",
  "dueDate": "2025-11-25",
  "items": [
    {
      "description": "プロジェクトAlpha 第1フェーズ開発費用",
      "quantity": 1,
      "unitPrice": 9000000.00,
      "taxRate": 0.10
    },
    {
      "description": "インフラ構築費用",
      "quantity": 1,
      "unitPrice": 1000000.00,
      "taxRate": 0.10
    }
  ],
  "notes": "支払期限: 請求書発行日から30日以内",
  "paymentTerms": "銀行振込"
}
```

**レスポンス（201 Created）**:
```json
{
  "invoiceId": "uuid-of-invoice",
  "invoiceNumber": "INV-2025-10-100",
  "projectId": "uuid-of-project",
  "clientId": "uuid-of-client",
  "status": "draft",
  "issueDate": "2025-10-25",
  "dueDate": "2025-11-25",
  "subtotal": 10000000.00,
  "taxAmount": 1000000.00,
  "totalAmount": 11000000.00,
  "currency": "JPY",
  "items": [
    {
      "itemId": "uuid-of-item-1",
      "description": "プロジェクトAlpha 第1フェーズ開発費用",
      "quantity": 1,
      "unitPrice": 9000000.00,
      "taxRate": 0.10,
      "amount": 9900000.00
    }
  ],
  "createdAt": "2025-10-25T10:00:00Z",
  "createdBy": "uuid-of-accountant"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_230 | invoiceNumberが重複 | 一意の請求書番号を指定 |
| 400 | BC002_ERR_231 | dueDate < issueDate | 支払期限を発行日以降に設定 |
| 404 | BC002_ERR_232 | 指定projectIdまたはclientIdが存在しない | 有効なIDを指定 |

**認証**: Bearer Token必須
**権限**: `invoice:write`
**レート制限**: 30 req/min
**SLA**: p95 < 700ms

---

#### GET /api/bc-002/invoices/{invoiceId}
**説明**: 請求書詳細を取得

**パスパラメータ**:
- `invoiceId` (UUID, 必須): 請求書ID

**レスポンス（200 OK）**:
```json
{
  "invoiceId": "uuid-of-invoice",
  "invoiceNumber": "INV-2025-10-100",
  "projectId": "uuid-of-project",
  "projectName": "Project Alpha",
  "clientId": "uuid-of-client",
  "clientName": "クライアント株式会社",
  "status": "issued",
  "issueDate": "2025-10-25",
  "dueDate": "2025-11-25",
  "subtotal": 10000000.00,
  "taxAmount": 1000000.00,
  "totalAmount": 11000000.00,
  "paidAmount": 0.00,
  "remainingAmount": 11000000.00,
  "currency": "JPY",
  "items": [
    {
      "itemId": "uuid-of-item-1",
      "description": "プロジェクトAlpha 第1フェーズ開発費用",
      "quantity": 1,
      "unitPrice": 9000000.00,
      "taxRate": 0.10,
      "amount": 9900000.00
    }
  ],
  "paymentHistory": [],
  "notes": "支払期限: 請求書発行日から30日以内",
  "createdAt": "2025-10-25T10:00:00Z",
  "issuedAt": "2025-10-25T14:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 404 | BC002_ERR_240 | 指定請求書が存在しない | 有効なinvoiceIdを指定 |
| 403 | BC002_ERR_241 | アクセス権限なし | 適切なロールを付与 |

**認証**: Bearer Token必須
**権限**: `invoice:read`
**レート制限**: 100 req/min
**SLA**: p95 < 300ms

---

#### POST /api/bc-002/invoices/{invoiceId}/issue
**説明**: 請求書を発行（draft→issuedに遷移）

**パスパラメータ**:
- `invoiceId` (UUID, 必須): 請求書ID

**リクエスト**:
```json
{
  "issueNote": "クライアントへメール送信完了"
}
```

**レスポンス（200 OK）**:
```json
{
  "invoiceId": "uuid-of-invoice",
  "status": "issued",
  "issuedAt": "2025-10-25T14:00:00Z",
  "issuedBy": "uuid-of-accountant",
  "issueNote": "クライアントへメール送信完了"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_250 | draft状態でない請求書は発行不可 | ステータスを確認 |
| 404 | BC002_ERR_240 | 指定請求書が存在しない | 有効なinvoiceIdを指定 |

**認証**: Bearer Token必須
**権限**: `invoice:issue`
**レート制限**: 20 req/min
**SLA**: p95 < 600ms

---

### 4. Profitability Analysis API {#profitability-analysis-api}

収益性分析・予測・改善アクションのためのAPI群。

---

#### GET /api/bc-002/profitability/calculate
**説明**: 収益性指標を計算

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ（指定なし=全体）
- `startDate` (date, 必須): 計算期間開始
- `endDate` (date, 必須): 計算期間終了
- `metrics` (string, オプション): 計算指標（カンマ区切り: profit_margin, roi, ebitda）デフォルト: 全指標

**レスポンス（200 OK）**:
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-10-31"
  },
  "scope": "全プロジェクト",
  "metrics": {
    "totalRevenue": 80000000.00,
    "totalCost": 60000000.00,
    "grossProfit": 20000000.00,
    "profitMargin": 0.25,
    "roi": 0.333,
    "ebitda": 22000000.00,
    "netProfit": 18000000.00
  },
  "breakdown": {
    "byProject": [
      {
        "projectId": "uuid-of-project-1",
        "projectName": "Project Alpha",
        "revenue": 30000000.00,
        "cost": 22500000.00,
        "profitMargin": 0.25,
        "contribution": 0.375
      },
      {
        "projectId": "uuid-of-project-2",
        "projectName": "Project Beta",
        "revenue": 50000000.00,
        "cost": 37500000.00,
        "profitMargin": 0.25,
        "contribution": 0.625
      }
    ],
    "byCategory": {
      "PERSONNEL": {
        "cost": 45000000.00,
        "percentage": 0.75
      },
      "INFRASTRUCTURE": {
        "cost": 12000000.00,
        "percentage": 0.20
      },
      "MARKETING": {
        "cost": 3000000.00,
        "percentage": 0.05
      }
    }
  },
  "calculatedAt": "2025-10-31T18:00:00Z"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_300 | startDate > endDate | 期間を修正 |
| 400 | BC002_ERR_301 | 無効なmetricsパラメータ | 有効な指標を指定 |

**認証**: Bearer Token必須
**権限**: `profitability:read`
**レート制限**: 50 req/min
**SLA**: p95 < 2000ms

---

#### GET /api/bc-002/profitability/trends
**説明**: 収益性トレンドを取得

**クエリパラメータ**:
- `projectId` (UUID, オプション): プロジェクトIDフィルタ
- `startDate` (date, 必須): 分析期間開始
- `endDate` (date, 必須): 分析期間終了
- `granularity` (string, オプション): 粒度（monthly, quarterly）デフォルト: monthly

**レスポンス（200 OK）**:
```json
{
  "period": {
    "startDate": "2025-01-01",
    "endDate": "2025-10-31",
    "granularity": "monthly"
  },
  "trends": [
    {
      "period": "2025-01",
      "revenue": 7000000.00,
      "cost": 5000000.00,
      "profitMargin": 0.286
    },
    {
      "period": "2025-02",
      "revenue": 7500000.00,
      "cost": 5500000.00,
      "profitMargin": 0.267
    }
  ],
  "insights": {
    "averageProfitMargin": 0.25,
    "bestMonth": {
      "period": "2025-09",
      "profitMargin": 0.32
    },
    "worstMonth": {
      "period": "2025-03",
      "profitMargin": 0.18
    },
    "trend": "improving",
    "marginImprovement": 0.07
  }
}
```

**認証**: Bearer Token必須
**権限**: `profitability:read`
**レート制限**: 30 req/min
**SLA**: p95 < 2500ms

---

#### GET /api/bc-002/profitability/cashflow-forecast
**説明**: キャッシュフロー予測を取得

**クエリパラメータ**:
- `forecastPeriod` (integer, 必須): 予測期間（月数）
- `scenario` (string, オプション): シナリオ（optimistic, realistic, pessimistic）デフォルト: realistic

**レスポンス（200 OK）**:
```json
{
  "forecastPeriod": {
    "startDate": "2025-11-01",
    "endDate": "2026-01-31",
    "months": 3
  },
  "scenario": "realistic",
  "forecast": [
    {
      "month": "2025-11",
      "expectedInflow": 9000000.00,
      "expectedOutflow": 6500000.00,
      "netCashflow": 2500000.00,
      "cumulativeCashflow": 20000000.00
    },
    {
      "month": "2025-12",
      "expectedInflow": 12000000.00,
      "expectedOutflow": 7000000.00,
      "netCashflow": 5000000.00,
      "cumulativeCashflow": 25000000.00
    }
  ],
  "assumptions": [
    "契約済みプロジェクトの請求スケジュール",
    "過去3年の支払い実績（平均回収期間: 35日）",
    "固定費: 月額500万円",
    "変動費: 売上の40%"
  ],
  "risks": [
    {
      "type": "payment_delay",
      "impact": -3000000.00,
      "probability": 0.20,
      "mitigation": "与信管理強化、早期入金インセンティブ"
    }
  ]
}
```

**認証**: Bearer Token必須
**権限**: `profitability:read`, `profitability:forecast`
**レート制限**: 20 req/min
**SLA**: p95 < 3000ms

---

#### POST /api/bc-002/profitability/improvement-actions
**説明**: 収益性改善アクションを記録

**リクエスト**:
```json
{
  "projectId": "uuid-of-project",
  "actionType": "COST_REDUCTION",
  "title": "インフラコスト最適化",
  "description": "クラウドリソースの使用量見直しによるコスト削減",
  "targetSaving": 1000000.00,
  "targetDate": "2025-12-31",
  "responsibleUserId": "uuid-of-manager",
  "status": "planned"
}
```

**レスポンス（201 Created）**:
```json
{
  "actionId": "uuid-of-action",
  "projectId": "uuid-of-project",
  "actionType": "COST_REDUCTION",
  "title": "インフラコスト最適化",
  "description": "クラウドリソースの使用量見直しによるコスト削減",
  "targetSaving": 1000000.00,
  "actualSaving": 0.00,
  "targetDate": "2025-12-31",
  "responsibleUserId": "uuid-of-manager",
  "status": "planned",
  "createdAt": "2025-10-31T19:00:00Z",
  "createdBy": "uuid-of-executive"
}
```

**エラーレスポンス**:

| HTTPステータス | エラーコード | 説明 | 対処法 |
|-------------|------------|------|--------|
| 400 | BC002_ERR_310 | 無効なactionType | 有効なアクションタイプを選択 |
| 400 | BC002_ERR_311 | targetSavingが0以下 | 正の金額を指定 |

**認証**: Bearer Token必須
**権限**: `profitability:write`
**レート制限**: 20 req/min
**SLA**: p95 < 500ms

---

## BC間連携API {#cross-bc-integration-api}

BC-002は他のBCとの連携のために以下のAPIを提供します。

### BC-001 (Project Delivery) からのコスト情報受信

#### POST /api/bc-002/integrations/project-costs
**説明**: BC-001からプロジェクトコストを受信

**リクエスト**:
```json
{
  "projectId": "uuid-of-project",
  "costCategory": "RESOURCE",
  "amount": 500000.00,
  "period": "2025-10",
  "source": "BC-001"
}
```

**レスポンス（201 Created）**:
```json
{
  "integrationId": "uuid-of-integration",
  "costId": "uuid-of-cost",
  "projectId": "uuid-of-project",
  "amount": 500000.00,
  "status": "recorded"
}
```

**認証**: Bearer Token必須（BC間サービスアカウント）
**権限**: `integration:write`
**レート制限**: 200 req/min
**SLA**: p95 < 400ms

---

### BC-005 (Team & Resource) からのリソースコスト受信

#### POST /api/bc-002/integrations/resource-costs
**説明**: BC-005からリソースコストを受信

**リクエスト**:
```json
{
  "resourceId": "uuid-of-resource",
  "costType": "SALARY",
  "amount": 800000.00,
  "period": "2025-10",
  "source": "BC-005"
}
```

**レスポンス（201 Created）**:
```json
{
  "integrationId": "uuid-of-integration",
  "costId": "uuid-of-cost",
  "resourceId": "uuid-of-resource",
  "amount": 800000.00,
  "status": "recorded"
}
```

**認証**: Bearer Token必須（BC間サービスアカウント）
**権限**: `integration:write`
**レート制限**: 200 req/min
**SLA**: p95 < 400ms

---

### BC-007 (Communication) への予算アラート送信

#### POST /api/bc-002/integrations/budget-alerts
**説明**: BC-007に予算アラートを送信

**リクエスト**:
```json
{
  "alertType": "BUDGET_THRESHOLD_EXCEEDED",
  "budgetId": "uuid-of-budget",
  "budgetItemId": "uuid-of-budget-item",
  "severity": "warning",
  "message": "予算消化率70%を超過しました",
  "recipients": ["uuid-of-manager", "uuid-of-approver"],
  "targetBC": "BC-007"
}
```

**レスポンス（200 OK）**:
```json
{
  "integrationId": "uuid-of-integration",
  "notificationId": "uuid-of-notification",
  "status": "sent",
  "sentAt": "2025-10-31T20:00:00Z"
}
```

**認証**: Bearer Token必須（BC間サービスアカウント）
**権限**: `integration:notify`
**レート制限**: 100 req/min
**SLA**: p95 < 500ms

---

## エラーハンドリング {#error-handling}

### エラーレスポンス形式

すべてのエラーレスポンスは統一形式で返却されます。

```json
{
  "error": {
    "code": "BC002_ERR_001",
    "message": "予算項目の合計が総予算額を超過しています",
    "details": {
      "totalAmount": 50000000.00,
      "itemsSum": 52000000.00,
      "excess": 2000000.00
    },
    "timestamp": "2025-10-31T10:05:00Z",
    "requestId": "uuid-of-request"
  }
}
```

### エラーコード体系

BC-002のエラーコードは以下の体系で定義されます:

**フォーマット**: `BC002_ERR_XXX`

#### エラーコード範囲

| 範囲 | カテゴリ | 説明 |
|------|---------|------|
| 001-099 | Budget Management | 予算管理関連エラー |
| 100-199 | Cost Management | コスト管理関連エラー |
| 200-299 | Revenue Management | 収益管理関連エラー |
| 300-399 | Profitability Analysis | 収益性分析関連エラー |
| 400-499 | Integration | BC間連携関連エラー |
| 500-599 | System | システムエラー |

#### 主要エラーコード一覧

| エラーコード | HTTPステータス | 説明 | 対処法 |
|------------|--------------|------|--------|
| BC002_ERR_001 | 400 | 予算項目の合計が総予算額を超過 | 項目配分額を調整 |
| BC002_ERR_004 | 409 | 同一会計期間に承認済み予算が既存 | 既存予算を修正 |
| BC002_ERR_010 | 404 | 指定予算が存在しない | 有効なbudgetIdを指定 |
| BC002_ERR_040 | 400 | draft状態でない予算は承認不可 | ステータスを確認 |
| BC002_ERR_100 | 400 | コスト金額が0以下 | 正の金額を指定 |
| BC002_ERR_110 | 404 | 指定コストが存在しない | 有効なcostIdを指定 |
| BC002_ERR_200 | 400 | 収益金額が0以下 | 正の金額を指定 |
| BC002_ERR_210 | 404 | 指定収益が存在しない | 有効なrevenueIdを指定 |
| BC002_ERR_230 | 400 | 請求書番号が重複 | 一意の請求書番号を指定 |
| BC002_ERR_300 | 400 | 期間指定が不正 | 日付範囲を修正 |
| BC002_ERR_500 | 500 | 内部サーバーエラー | 運営チームに連絡 |

### エラーハンドリング推奨パターン

クライアント側でのエラーハンドリング推奨パターン:

```typescript
try {
  const response = await fetch('/api/bc-002/budgets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(budgetData)
  });

  if (!response.ok) {
    const errorData = await response.json();

    switch (errorData.error.code) {
      case 'BC002_ERR_001':
        // 予算超過エラー: UIで項目配分を修正
        showBudgetExcessError(errorData.error.details);
        break;
      case 'BC002_ERR_004':
        // 重複エラー: 既存予算を表示
        showDuplicateBudgetWarning();
        break;
      default:
        // 一般エラー: 汎用メッセージ表示
        showGenericError(errorData.error.message);
    }
  }
} catch (error) {
  // ネットワークエラー等
  showNetworkError();
}
```

---

## レート制限とSLA {#rate-limiting-sla}

### レート制限

BC-002のAPIは**sliding window**方式のレート制限を採用。

#### レート制限ヘッダー

すべてのレスポンスに以下ヘッダーが含まれます:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698750000
```

#### レート制限超過時のレスポンス

```json
{
  "error": {
    "code": "BC002_ERR_429",
    "message": "レート制限を超過しました",
    "details": {
      "limit": 100,
      "retryAfter": 60
    },
    "timestamp": "2025-10-31T21:00:00Z"
  }
}
```

**HTTPステータス**: 429 Too Many Requests
**Retry-After**: 60秒

#### エンドポイント別レート制限

| エンドポイントカテゴリ | レート制限 | 備考 |
|------------------|----------|------|
| GET（一覧取得） | 100 req/min | 照会系は比較的緩い |
| GET（詳細取得） | 100 req/min | 同上 |
| POST（作成） | 50 req/min | 作成系は中程度 |
| PUT（更新） | 30 req/min | 更新系は厳しめ |
| DELETE（削除） | 10 req/min | 削除系は最も厳しい |
| 承認・承認系 | 10-20 req/min | 重要操作のため厳しい |
| 分析・予測系 | 20-30 req/min | 計算負荷が高いため制限 |
| BC間連携 | 200 req/min | システム間通信のため緩い |

### SLA（Service Level Agreement）

BC-002のAPIは以下のSLAを保証します。

#### 可用性

- **目標**: 99.9% (年間ダウンタイム: 8.76時間以内)
- **メンテナンスウィンドウ**: 毎週日曜 2:00-4:00 JST（計画メンテナンス）

#### レスポンスタイム

| エンドポイントカテゴリ | p50 | p95 | p99 |
|------------------|-----|-----|-----|
| GET（詳細取得） | < 150ms | < 300ms | < 500ms |
| GET（一覧取得） | < 300ms | < 800ms | < 1500ms |
| POST/PUT（作成・更新） | < 300ms | < 600ms | < 1000ms |
| 分析・予測系 | < 1000ms | < 3000ms | < 5000ms |

#### データ整合性

- **RPO (Recovery Point Objective)**: 1時間（データ損失許容時間）
- **RTO (Recovery Time Objective)**: 4時間（復旧目標時間）
- **バックアップ頻度**: 1時間ごと（増分）、1日ごと（フル）

#### モニタリング

SLA監視は以下の指標で実施:

- **ヘルスチェックエンドポイント**: `GET /api/bc-002/health`
- **メトリクス収集**: Prometheus + Grafana
- **アラート通知**: BC-007 (Communication) 経由

---

## V2からの移行 {#v2-migration}

### V2構造（移行元）

```
services/revenue-optimization-service/api/
├── api-specification.md（サービスレベルAPI仕様 - 廃止）
├── endpoints/
└── schemas/
```

### V3構造（移行先）

```
BC-002/api/
├── README.md（本ファイル - WHAT層の概要）
├── api-specification.md（WHAT層 - 詳細仕様）※今後作成予定
├── endpoints/（WHAT層 - エンドポイント個別仕様）
└── schemas/（WHAT層 - スキーマ定義）

UseCase層（HOW層）:
capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/
└── api-usage.md（HOW層 - API利用方法）
```

### 移行ステータス

| 項目 | V2 | V3 | ステータス |
|-----|----|----|---------|
| API仕様 | services/revenue-optimization-service/api/ | BC-002/api/ | ✅ 移行完了（Issue #146対応） |
| エンドポイント構造 | 混在 | 4カテゴリに整理 | ✅ 整理完了 |
| 認証・認可 | 独自実装 | BC-003連携 | ✅ 移行完了 |
| エラーコード | サービス固有 | BC002_ERR_XXX体系 | ✅ 統一完了 |
| レート制限 | なし | 実装済み | ✅ 追加完了 |
| SLA定義 | なし | 定義済み | ✅ 定義完了 |
| BC間連携 | 個別実装 | 統一API | ✅ 移行完了 |
| ドキュメント詳細化 | 基本のみ | 詳細化完了 | ✅ 本ファイル完成 |

### Issue #146対応状況

| 要件 | 対応内容 | ステータス |
|-----|---------|----------|
| WHAT/HOW分離 | 本ファイル=WHAT, UseCase層=HOW | ✅ 完了 |
| WHAT層の役割明記 | 「API能力の定義のみ」と明記 | ✅ 完了 |
| HOW層の配置説明 | UseCaseディレクトリに配置と記載 | ✅ 完了 |
| クロスリファレンス | HOW層からWHAT層への参照を記載 | ✅ 完了 |

---

## 関連ドキュメント

- [../domain/README.md](../domain/README.md) - BC-002 ドメインモデル
- [../data/README.md](../data/README.md) - BC-002 データモデル
- Issue #146: API WHAT/HOW分離ガイド
- Issue #192: V3構造ドキュメント整備プロジェクト
- BC-003/api/README.md - 認証・認可基盤（依存）
- BC-007/api/README.md - 通知機能（連携）

---

**ステータス**: Phase 2.1 - BC-002 API詳細化完了
**最終更新**: 2025-10-31
**次のアクション**: BC-002 data/README.md の詳細化

---

**変更履歴**:
- 2025-10-31: Phase 2.1 - BC-002 API仕様を詳細化（Issue #192）
  - 4カテゴリ全APIエンドポイント詳細仕様を追加
  - エラーコード体系（BC002_ERR_XXX）を定義
  - 認証・認可・レート制限・SLAを詳細化
  - BC間連携APIを追加
  - Issue #146（WHAT/HOW分離）に完全準拠
- 2025-10-31: Phase 0 - 基本構造作成（BC-001からのテンプレート適用）
