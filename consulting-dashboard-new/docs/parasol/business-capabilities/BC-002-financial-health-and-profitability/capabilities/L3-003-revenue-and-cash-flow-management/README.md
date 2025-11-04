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

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **収益認識**: IFRS15/ASC606準拠の収益認識基準アルゴリズム
- **キャッシュフロー予測**: モンテカルロシミュレーションによる不確実性考慮
- **請求管理**: 請求スケジューリングアルゴリズム（支払条件・回収期限最適化）
- **未回収債権管理**: エージング分析（30/60/90日超過の階層分類）
- **デザインパターン**:
  - State Pattern（請求書ステータス遷移: unpaid → partially_paid → fully_paid → overdue）
  - Strategy Pattern（異なる収益認識方式: 発生主義/現金主義）
  - Observer Pattern（支払期限アラート、延滞通知）

#### 実装要件
- **財務計算**: 高精度数値計算エンジン（高精度収益・キャッシュフロー計算）
- **予測分析**: 予測エンジン（機械学習による収益予測）
- **収益可視化**: 可視化機能（収益トレンド、キャッシュフローウォーターフォール）
- **請求書生成**: PDF生成機能（請求書PDF自動生成）
- **支払処理**: 決済処理機能（オンライン決済統合・オプション）

### パフォーマンス考慮事項

#### スケーラビリティ
- **収益記録数上限**: 1会計年度あたり最大50万レコード
- **請求書発行**: 1日あたり最大10,000請求書
- **未回収債権**: 最大100,000件の同時管理

#### キャッシュ戦略
- **収益サマリー**: キャッシュ機構（TTL: 15分、収益記録時に無効化）
- **キャッシュフロー予測**: 日次計算、メモリキャッシュ（24時間保持）
- **延滞請求書リスト**: 5分間隔でキャッシュ更新

#### 最適化ポイント
- **集計クエリ最適化**: Materialized View（月次収益集計、未回収債権集計）
- **バッチ処理**: 請求書の一括発行（月次/週次バッチ）
- **インデックス活用**: `revenues(recognized_date, revenue_type)`, `invoices(payment_due, payment_status)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-001: Project Delivery & Quality** - プロジェクト収益の連携
  - 使用API: `GET /api/bc-001/projects/{projectId}/completion-status` - プロジェクト完了確認
  - 使用API: `POST /api/bc-001/projects/{projectId}/revenue-recognition` - 収益認識トリガー
- **BC-007: Team Communication & Collaboration** - 請求・督促通知
  - 使用API: `POST /api/bc-007/notifications` - 請求書発行通知
  - 使用API: `POST /api/bc-007/alerts` - 支払期限リマインダー、延滞督促

#### 提供API（他BCから利用）
- **BC-001, BC-004**: プロジェクト別収益参照、収益性分析用収益データ提供

### データ整合性要件

#### トランザクション境界
- **収益認識**: 収益記録 + 請求書生成 + プロジェクト紐付け + 通知送信（BC-007）
- **入金処理**: 入金記録 + 請求書ステータス更新 + 未回収債権更新 + キャッシュフロー再計算
- **整合性レベル**: 強整合性（収益・入金金額）、結果整合性（キャッシュフロー予測）

#### データ制約
- 収益金額 > 0
- 収益認識日は契約条件に準拠
- 請求金額 = 関連収益の合計
- 入金総額 ≤ 請求金額
- 延滞閾値: 支払期限超過30日で延滞ステータスに自動遷移

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003発行）
- **必要権限**:
  - 収益認識: `revenue:recognize` + 財務担当者権限
  - 請求書発行: `invoice:issue` + 経理担当者権限
  - 入金記録: `payment:record` + 経理担当者権限

#### データ保護
- **機密度**: 収益・請求情報はConfidential（財務担当・経営層のみ）
- **監査ログ**: 収益認識・請求書発行・入金記録は全て記録
- **暗号化**: 請求書番号・支払情報は保存時暗号化（AES-256）
- **PCI DSS準拠**: クレジットカード情報は外部決済サービスに委託

### スケーラビリティ制約

#### 最大同時処理
- **収益認識**: 同時50認識/秒
- **請求書発行**: 同時100発行/秒
- **入金処理**: 同時30処理/秒

#### データ量上限
- **収益履歴**: 10年間保持（会計法準拠）
- **請求書**: 10年間保持（証憑保存義務）
- **キャッシュフロー予測**: 過去5年実績 + 未来3年予測保持

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Revenue Aggregate** ([../../domain/README.md#revenue-aggregate](../../domain/README.md#revenue-aggregate))
  - Revenue（集約ルート）: 収益認識とキャッシュフロー管理
  - Invoice: 請求書
  - Payment: 入金記録
  - RevenueStream: 収益源
  - CashFlowProjection: キャッシュフロー予測

#### Value Objects
- **Amount**: 金額（通貨単位付き）
- **InvoiceStatus**: 請求書ステータス（unpaid, partially_paid, fully_paid, overdue）
- **PaymentTerm**: 支払条件（Net 30, Net 45等）
- **CashFlowStatus**: キャッシュフロー状態（positive, neutral, negative）
- **RevenueType**: 収益区分（project, retainer, other）

#### Domain Events
- **RevenueRecognized**: 収益認識イベント → BC-001プロジェクト収益更新
- **InvoiceIssued**: 請求書発行イベント → BC-007クライアント通知
- **PaymentReceived**: 入金確認イベント → キャッシュフロー更新
- **InvoiceOverdue**: 請求書延滞イベント → BC-007督促通知
- **RevenueForecasted**: 収益予測更新イベント

### 呼び出すAPI例

#### 収益認識
```http
POST /api/v1/bc-002/revenues
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "新製品開発プロジェクト収益",
  "amount": 15000000,
  "currency": "JPY",
  "recognizedDate": "2025-11-10",
  "revenueType": "project",
  "projectId": "project-uuid-123",
  "contractId": "contract-uuid-456",
  "description": "Phase 1 完了による収益認識（IFRS15準拠）"
}
```

#### 請求書発行
```http
POST /api/v1/bc-002/invoices
Content-Type: application/json

{
  "invoiceNumber": "INV-2025-001234",
  "invoiceAmount": 15000000,
  "currency": "JPY",
  "invoiceDate": "2025-11-10",
  "paymentDue": "2025-12-10",
  "clientId": "client-uuid-789",
  "lineItems": [
    {
      "description": "Phase 1 開発費用",
      "amount": 12000000
    },
    {
      "description": "追加コンサルティング",
      "amount": 3000000
    }
  ],
  "paymentTerms": "Net 30",
  "notes": "お振込手数料はご負担ください"
}
```

#### キャッシュフロー予測
```http
GET /api/v1/bc-002/revenues/cash-flow-forecast?period=2025-Q4&confidenceLevel=0.95
```

#### BC連携: 請求書発行通知（BC-007）
```http
POST /api/v1/bc-007/notifications
Content-Type: application/json

{
  "type": "invoice_issued",
  "recipientId": "client-uuid-789",
  "priority": "normal",
  "content": {
    "invoiceId": "invoice-uuid",
    "invoiceNumber": "INV-2025-001234",
    "amount": 15000000,
    "paymentDue": "2025-12-10",
    "paymentTerms": "Net 30",
    "projectName": "新製品開発"
  }
}
```

#### BC連携: 延滞督促（BC-007）
```http
POST /api/v1/bc-007/alerts
Content-Type: application/json

{
  "type": "invoice_overdue",
  "recipientId": "client-uuid-789",
  "priority": "high",
  "content": {
    "invoiceId": "invoice-uuid",
    "invoiceNumber": "INV-2025-001234",
    "overdueAmount": 15000000,
    "daysPastDue": 35,
    "originalDueDate": "2025-12-10",
    "actionRequired": "至急お支払いください"
  }
}
```

### データアクセスパターン

#### 読み取り
- **revenues テーブル**:
  - インデックス: `idx_revenues_recognized_date`（期間別収益取得）
  - インデックス: `idx_revenues_revenue_type`（収益区分別集計）
  - インデックス: `idx_revenues_project_id`（プロジェクト別収益）
  - 集計クエリ: 月次収益集計（GROUP BY MONTH(recognized_date), revenue_type）
- **invoices テーブル**:
  - インデックス: `idx_invoices_payment_due`（支払期限順ソート）
  - インデックス: `idx_invoices_payment_status`（未払・延滞請求書検索）
  - クエリ: 延滞請求書抽出（payment_status = 'overdue' OR (payment_status = 'unpaid' AND payment_due < NOW())）
- **payments テーブル**:
  - インデックス: `idx_payments_paid_date`（入金日時系列取得）
  - インデックス: `idx_payments_invoice_id`（請求書別入金履歴）

#### 書き込み
- **収益認識トランザクション**:
  ```sql
  BEGIN;
  INSERT INTO revenues (name, amount, recognized_date, revenue_type, project_id)
  VALUES (?, ?, ?, ?, ?);

  -- 請求書自動生成（収益認識時に請求書も発行）
  INSERT INTO invoices (invoice_number, invoice_amount, invoice_date, payment_due, client_id)
  VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), ?);

  -- イベント発行: RevenueRecognized, InvoiceIssued
  COMMIT;
  ```
- **入金処理**:
  ```sql
  BEGIN;
  INSERT INTO payments (invoice_id, payment_amount, paid_date, payment_method)
  VALUES (?, ?, NOW(), ?);

  -- 請求書ステータス更新
  UPDATE invoices SET payment_status =
    CASE
      WHEN (SELECT SUM(payment_amount) FROM payments WHERE invoice_id = ?) >= invoice_amount
      THEN 'fully_paid'
      ELSE 'partially_paid'
    END
  WHERE id = ?;

  -- イベント発行: PaymentReceived
  COMMIT;
  ```

#### キャッシュアクセス
- **収益サマリー**:
  ```
  Key: `revenue:summary:period:{period}`
  Value: { totalRevenue: 50000000, projectRevenue: 40000000, retainerRevenue: 10000000 }
  TTL: 900秒（15分）
  Invalidation: 収益認識時
  ```
- **未回収債権**:
  ```
  Key: `revenue:ar:summary`
  Value: { total: 25000000, current: 15000000, overdue30: 5000000, overdue60: 3000000, overdue90: 2000000 }
  TTL: 300秒（5分）
  Invalidation: 入金処理時、請求書ステータス変更時
  ```
- **キャッシュフロー予測**:
  ```
  Key: `revenue:cashflow:forecast:{period}`
  Value: { inflow: 48000000, outflow: 35000000, netCashFlow: 13000000, confidence: 0.95 }
  TTL: 86400秒（24時間）
  Invalidation: 日次バッチ再計算時
  ```

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
