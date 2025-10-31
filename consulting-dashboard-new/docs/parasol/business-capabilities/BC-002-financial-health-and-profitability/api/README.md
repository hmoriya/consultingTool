# BC-002: API設計

**BC**: Financial Health & Profitability
**作成日**: 2025-10-31
**V2移行元**: services/revenue-optimization-service/api/

---

## 概要

このディレクトリは、BC-002（財務健全性と収益性）のAPI設計を定義します。

**重要**: Issue #146対応により、API設計はWHAT（能力定義）とHOW（利用方法）に分離されています。

---

## API設計構成

### 📄 api-specification.md（WHAT: 能力定義）
**役割**: BC-002が提供するAPI能力の定義
- エンドポイント一覧
- リクエスト/レスポンススキーマ
- 認証・認可要件
- エラーハンドリング

**Issue #146対応**: WHATレイヤー（能力の定義）

### 📁 endpoints/（WHAT詳細）
個別エンドポイントの詳細定義
- RESTful APIエンドポイント仕様
- GraphQL スキーマ（該当する場合）

### 📁 schemas/（WHAT詳細）
データスキーマ定義
- リクエストスキーマ
- レスポンススキーマ
- 共通データ型

---

## 主要APIエンドポイント

### Budget Management API
```
POST   /api/bc-002/budgets
GET    /api/bc-002/budgets/{budgetId}
PUT    /api/bc-002/budgets/{budgetId}
DELETE /api/bc-002/budgets/{budgetId}
GET    /api/bc-002/budgets
POST   /api/bc-002/budgets/{budgetId}/approve
POST   /api/bc-002/budgets/{budgetId}/reallocate
```

### Cost Management API
```
POST   /api/bc-002/costs
GET    /api/bc-002/costs/{costId}
PUT    /api/bc-002/costs/{costId}
DELETE /api/bc-002/costs/{costId}
GET    /api/bc-002/costs
GET    /api/bc-002/costs/analyze-trends
POST   /api/bc-002/costs/allocate
```

### Revenue Management API
```
POST   /api/bc-002/revenues
GET    /api/bc-002/revenues/{revenueId}
PUT    /api/bc-002/revenues/{revenueId}
GET    /api/bc-002/revenues
GET    /api/bc-002/revenues/forecast
POST   /api/bc-002/invoices
GET    /api/bc-002/invoices/{invoiceId}
POST   /api/bc-002/invoices/{invoiceId}/issue
```

### Profitability Analysis API
```
GET    /api/bc-002/profitability/calculate
GET    /api/bc-002/profitability/trends
GET    /api/bc-002/profitability/cashflow-forecast
POST   /api/bc-002/profitability/improvement-actions
```

---

## UseCase API（HOW: 利用方法）

各ユースケースの具体的なAPI利用方法は、L3 Capabilityのユースケース層で定義されます:

- `capabilities/L3-XXX/operations/OP-XXX/usecases/{usecase-name}/api-usage.md`

**Issue #146対応**: HOWレイヤー（利用方法）は各ユースケースに配置

---

## BC間連携API

### BC-001 (Project) からのコスト情報受信
```
POST /api/bc-002/cost-allocations
Body: { projectId, costCategory, amount, date }
```

### BC-005 (Resources) からのリソースコスト受信
```
POST /api/bc-002/resource-costs
Body: { resourceId, costType, amount, period }
```

### BC-007 (Communication) への予算アラート送信
```
POST /api/bc-007/notifications
Body: { type: 'budget_alert', recipients, message, priority }
```

---

## 認証・認可

### 認証方式
- OAuth 2.0 + JWT
- BC-003 (Access Control & Security) による認証基盤

### 認可ポリシー
- 財務管理者: 全権限
- プロジェクトマネージャー: 自プロジェクトの予算・コスト閲覧
- エグゼクティブ: 全体の収益性・財務指標閲覧

---

## V2からの移行

### V2構造（移行元）
```
services/revenue-optimization-service/api/
├── api-specification.md（サービスレベル - 廃止）
└── api-specification.md（Issue #146対応版）
```

### V3構造（移行先）
```
BC-002/api/
├── README.md（本ファイル）
├── api-specification.md（WHAT - Issue #146対応）
├── endpoints/（WHAT詳細）
└── schemas/（WHAT詳細）
```

### 移行ステータス
- ✅ API仕様の移行完了（Issue #146対応版）
- ✅ エンドポイント構造の整理
- 🟡 詳細ドキュメントの作成中

---

## 関連ドキュメント

- [api-specification.md](api-specification.md) - API仕様（WHAT）
- Issue #146: API WHAT/HOW分離ガイド
- [../domain/README.md](../domain/README.md) - ドメインモデル

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: api-specification.mdの詳細化
