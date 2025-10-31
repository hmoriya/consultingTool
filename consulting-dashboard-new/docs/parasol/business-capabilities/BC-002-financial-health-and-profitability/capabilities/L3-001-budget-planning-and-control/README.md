# L3-001: Budget Planning & Control

**作成日**: 2025-10-31
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: formulate-and-control-budget

---

## 📋 What: この能力の定義

### 能力の概要
プロジェクトおよび組織の予算を計画・管理する能力。予算策定、承認、監視、再配分を通じて、財務の健全性を維持します。

### 実現できること
- 精緻な予算計画の策定
- 予算承認ワークフローの実施
- リアルタイムの予算執行状況監視
- 予算超過の早期警告
- 予算の柔軟な再配分

### 必要な知識
- 予算管理手法
- 財務会計の基礎
- コスト見積もり技法
- 予算承認プロセス
- 財務レポーティング

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: BudgetAggregate ([../../domain/README.md](../../domain/README.md#budget-aggregate))
- **Entities**: Budget, BudgetLine, BudgetAllocation, BudgetRevision
- **Value Objects**: Amount, BudgetStatus, Period, Variance

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/budgets - 予算作成
  - PUT /api/budgets/{id}/approve - 予算承認
  - GET /api/budgets/{id}/monitor - 予算監視
  - PUT /api/budgets/{id}/revise - 予算見直し

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: budgets, budget_lines, budget_allocations, budget_revisions, budget_approvals

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 予算を策定する | 初期予算計画の作成 | 2-3個 | formulate-budget |
| **OP-002**: 予算を承認・確定する | 承認ワークフローの実施 | 2個 | approve-and-finalize-budget |
| **OP-003**: 予算を監視・管理する | 執行状況の追跡 | 3-4個 | monitor-and-control-budget |
| **OP-004**: 予算を見直し・再配分する | 予算の柔軟な調整 | 2-3個 | revise-and-reallocate-budget |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 4個
- **推定UseCase数**: 9-12個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/formulate-and-control-budget/](../../../../services/revenue-optimization-service/capabilities/formulate-and-control-budget/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
