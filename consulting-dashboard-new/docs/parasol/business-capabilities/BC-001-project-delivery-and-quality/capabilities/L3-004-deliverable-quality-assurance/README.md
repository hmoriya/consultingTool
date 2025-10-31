# L3-004: Deliverable Quality Assurance

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: manage-and-ensure-deliverable-quality

---

## 📋 What: この能力の定義

### 能力の概要
成果物の品質を定義・確保し、クライアント要件を満たす成果物を提供する能力。成果物定義、レビュー、承認、バージョン管理を通じて、高品質な成果物を保証します。

### 実現できること
- 成果物品質基準の定義
- 成果物の作成とレビュープロセス管理
- 品質承認ワークフローの実施
- 成果物バージョン管理
- 成果物配信とトレーサビリティ確保

### 必要な知識
- 品質管理手法（ISO9001、TQM）
- レビュー技法（インスペクション、ウォークスルー）
- バージョン管理システム
- 成果物管理プロセス
- クライアント要件分析

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: DeliverableQualityAggregate ([../../domain/README.md](../../domain/README.md#deliverable-quality-aggregate))
- **Entities**: Deliverable, DeliverableTemplate, QualityCriteria, ReviewComment, ApprovalRecord
- **Value Objects**: QualityScore, ReviewStatus, Version, ApprovalStatus

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/deliverables - 成果物作成
  - POST /api/deliverables/{id}/review - レビュー実施
  - PUT /api/deliverables/{id}/approve - 承認処理
  - GET /api/deliverables/{id}/versions - バージョン管理

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: deliverables, deliverable_templates, quality_criteria, reviews, review_comments, approvals, versions

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 成果物を定義・作成する | 成果物の定義と初期作成 | 2-3個 | define-and-create-deliverables |
| **OP-002**: 成果物をレビュー・承認する | 品質レビューと承認フロー | 3-4個 | review-and-approve-deliverables |
| **OP-003**: 成果物をバージョン管理する | バージョン管理と履歴追跡 | 2個 | version-control-deliverables |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-9個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/manage-and-ensure-deliverable-quality/](../../../../services/project-success-service/capabilities/manage-and-ensure-deliverable-quality/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-004 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
