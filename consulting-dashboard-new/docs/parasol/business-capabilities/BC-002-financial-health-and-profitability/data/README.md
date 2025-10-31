# BC-002: データ設計

**BC**: Financial Health & Profitability
**作成日**: 2025-10-31
**V2移行元**: services/revenue-optimization-service/database-design.md

---

## 概要

このドキュメントは、BC-002（財務健全性と収益性）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### budgets
予算マスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 予算ID |
| name | VARCHAR(200) | NOT NULL | 予算名 |
| fiscal_year | INTEGER | NOT NULL | 会計年度 |
| total_amount | DECIMAL(15,2) | NOT NULL | 総予算額 |
| currency | VARCHAR(3) | NOT NULL | 通貨コード（ISO 4217） |
| approval_status | VARCHAR(20) | NOT NULL | 承認状態（draft/pending/approved/rejected） |
| approved_by | UUID | FK → users | 承認者 |
| approved_date | DATE | | 承認日 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: fiscal_year, approval_status

---

### budget_items
予算項目

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 予算項目ID |
| budget_id | UUID | FK → budgets, NOT NULL | 予算ID |
| category | VARCHAR(100) | NOT NULL | カテゴリ |
| allocated_amount | DECIMAL(15,2) | NOT NULL | 配分額 |
| consumed_amount | DECIMAL(15,2) | DEFAULT 0 | 消化額 |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: budget_id, category

---

### costs
コスト

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | コストID |
| name | VARCHAR(200) | NOT NULL | コスト名 |
| category | VARCHAR(50) | NOT NULL | カテゴリ（labor/outsource/equipment/other） |
| amount | DECIMAL(15,2) | NOT NULL | 金額 |
| currency | VARCHAR(3) | NOT NULL | 通貨コード |
| occurred_date | DATE | NOT NULL | 発生日 |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| budget_item_id | UUID | FK → budget_items | 予算項目ID |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: category, occurred_date, project_id, budget_item_id

---

### revenues
収益

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 収益ID |
| name | VARCHAR(200) | NOT NULL | 収益名 |
| amount | DECIMAL(15,2) | NOT NULL | 金額 |
| currency | VARCHAR(3) | NOT NULL | 通貨コード |
| recognized_date | DATE | NOT NULL | 認識日 |
| revenue_type | VARCHAR(50) | NOT NULL | 収益区分（project/retainer/other） |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| invoice_id | UUID | FK → invoices | 請求書ID |
| description | TEXT | | 説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: recognized_date, revenue_type, project_id

---

### invoices
請求書

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 請求書ID |
| invoice_number | VARCHAR(50) | NOT NULL, UNIQUE | 請求書番号 |
| invoice_amount | DECIMAL(15,2) | NOT NULL | 請求金額 |
| currency | VARCHAR(3) | NOT NULL | 通貨コード |
| invoice_date | DATE | NOT NULL | 請求日 |
| payment_due | DATE | NOT NULL | 支払期限 |
| payment_status | VARCHAR(20) | NOT NULL | 支払状態（unpaid/partial/paid/overdue） |
| client_id | UUID | FK → clients | クライアントID |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: invoice_number, payment_status, payment_due, client_id

---

### payments
支払

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 支払ID |
| invoice_id | UUID | FK → invoices, NOT NULL | 請求書ID |
| payment_amount | DECIMAL(15,2) | NOT NULL | 支払金額 |
| payment_date | DATE | NOT NULL | 支払日 |
| payment_method | VARCHAR(50) | | 支払方法 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: invoice_id, payment_date

---

### profitability_metrics
収益性指標

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 指標ID |
| period_start | DATE | NOT NULL | 期間開始 |
| period_end | DATE | NOT NULL | 期間終了 |
| total_revenue | DECIMAL(15,2) | NOT NULL | 総収益 |
| total_cost | DECIMAL(15,2) | NOT NULL | 総コスト |
| gross_profit | DECIMAL(15,2) | NOT NULL | 粗利益 |
| profit_margin | DECIMAL(5,2) | NOT NULL | 利益率（%） |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID（オプション） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: period_start, period_end, project_id

---

## データフロー

### 予算作成フロー
```
1. budgets テーブルにINSERT（approval_status = draft）
2. budget_items テーブルに予算項目をINSERT
3. 承認プロセス開始（BC-007 通知連携）
4. 承認後、approval_status を approved に更新
```

### コスト記録フロー
```
1. costs テーブルにINSERT
2. 対応する budget_items.consumed_amount を更新
3. 予算超過チェック
4. 超過時、BC-007 へアラート通知
```

### 収益認識フロー
```
1. invoices テーブルに請求書作成
2. revenues テーブルに収益認識記録
3. BC-007 へ請求書発行通知
4. 支払受領時、payments テーブルにINSERT
5. invoice.payment_status を更新
```

### 収益性分析フロー
```
1. revenues と costs から集計データ取得
2. profitability_metrics 計算
3. profitability_metrics テーブルにINSERT
4. トレンド分析実行
5. BC-006 へベストプラクティス登録
```

---

## BC間データ連携

### BC-001 (Project) からのデータ連携
- プロジェクトコスト情報（costs.project_id）
- プロジェクト収益情報（revenues.project_id）

### BC-005 (Resources) からのデータ連携
- リソースコスト情報（costs.category = 'labor'）
- 人件費配分データ

### BC-007 (Communication) へのデータ連携
- 予算アラート（予算超過時）
- 請求書発行通知

---

## パフォーマンス最適化

### インデックス戦略
- 頻繁に検索されるカラムにインデックス作成
- 日付範囲検索の最適化（occurred_date, recognized_date）
- 複合インデックスの活用（period_start, period_end）

### パーティショニング
- `costs` テーブル: occurred_date (月単位) でパーティション分割
- `revenues` テーブル: recognized_date (月単位) でパーティション分割
- `profitability_metrics` テーブル: period_start (四半期単位) でパーティション分割

---

## V2からの移行

### 移行ステータス
- ✅ テーブル構造の定義
- ✅ 主要インデックスの設計
- 🟡 詳細なデータフローのドキュメント化
- 🟡 パフォーマンスチューニング指針の作成

---

## 関連ドキュメント

- [database-design.md](database-design.md) - 詳細DB設計
- [data-flow.md](data-flow.md) - データフロー詳細
- [../domain/README.md](../domain/README.md) - ドメインモデル

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: database-design.mdの詳細化
