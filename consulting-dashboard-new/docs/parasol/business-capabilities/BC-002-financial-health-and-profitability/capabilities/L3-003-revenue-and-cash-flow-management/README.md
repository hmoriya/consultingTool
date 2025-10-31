# L3-003: Revenue & Cash Flow Management

**作成日**: 2025-10-31
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: recognize-and-maximize-revenue

---

## 📋 What: この能力の定義

### 能力の概要
収益を認識・記録し、キャッシュフローを最大化する能力。収益認識、請求管理、回収管理を通じて、健全なキャッシュフローを維持します。

### 実現できること
- 正確な収益認識と記録
- 収益予測とフォーキャスト
- 請求書発行と回収管理
- キャッシュフロー最適化
- 収益最大化施策の実施

### 必要な知識
- 収益認識基準（IFRS15、ASC606）
- 請求管理プロセス
- 与信管理
- キャッシュフロー管理
- 収益予測手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: RevenueAggregate ([../../domain/README.md](../../domain/README.md#revenue-aggregate))
- **Entities**: Revenue, Invoice, Payment, CashFlow, RevenueRecognition
- **Value Objects**: Amount, InvoiceStatus, PaymentTerm, CashFlowStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/revenues - 収益認識
  - POST /api/revenues/forecast - 収益予測
  - POST /api/invoices - 請求書発行
  - PUT /api/invoices/{id}/collect - 回収管理

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: revenues, invoices, payments, cash_flows, revenue_forecasts, collections

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 収益を認識・記録する | 収益の正確な捕捉 | 2-3個 | recognize-and-record-revenue, track-revenue |
| **OP-002**: 収益を予測・最大化する | 将来収益の予測と施策 | 2-3個 | forecast-and-maximize-revenue |
| **OP-003**: 請求・回収を管理する | 請求書発行と入金管理 | 3-4個 | issue-invoice-and-manage-collection |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-10個
- **V2からの移行**: track-revenue を統合

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/](../../../../services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/)
> - [services/revenue-optimization-service/capabilities/optimize-profitability/](../../../../services/revenue-optimization-service/capabilities/optimize-profitability/) (track-revenue部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
