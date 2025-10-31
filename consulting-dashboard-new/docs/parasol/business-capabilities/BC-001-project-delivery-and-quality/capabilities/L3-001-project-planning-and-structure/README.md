# L3-001: Project Planning & Structure

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: plan-and-structure-project

---

## 📋 What: この能力の定義

### 能力の概要
プロジェクトの構造を設計し、実行可能な計画に落とし込む能力。WBS作成、タスク分解、リソース見積もり、スケジュール策定を通じて、プロジェクトの成功基盤を構築します。

### 実現できること
- プロジェクトスコープの明確な定義
- 作業構造分解図（WBS）の作成
- タスク間の依存関係の定義
- リソース見積もりとスケジュール策定
- プロジェクト計画書の作成と承認

### 必要な知識
- プロジェクトマネジメント手法（PMBOK、アジャイル）
- WBS作成技法
- タスク分解・見積もり手法
- スケジューリング技法（クリティカルパス分析）
- リスク識別手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: ProjectPlanAggregate ([../../domain/README.md](../../domain/README.md#project-plan-aggregate))
- **Entities**: Project, WorkBreakdownStructure, Task, Milestone, Resource
- **Value Objects**: Duration, EstimatedEffort, SkillRequirement

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/projects - プロジェクト作成
  - POST /api/projects/{id}/wbs - WBS作成
  - POST /api/projects/{id}/tasks - タスク定義
  - POST /api/projects/{id}/schedule - スケジュール策定

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: projects, wbs_structures, tasks, task_dependencies, milestones, resource_allocations

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: プロジェクト構造を定義する | スコープとWBSを定義 | 2-3個 | decompose-and-define-tasks |
| **OP-002**: リソースを計画する | 必要リソースの見積もりと配分計画 | 2個 | optimally-allocate-resources |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 2個
- **推定UseCase数**: 4-5個
- **V2からの移行**: タスク分解操作を統合（重複解消）

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/plan-and-structure-project/](../../../../services/project-success-service/capabilities/plan-and-structure-project/)
> - [services/project-success-service/capabilities/manage-and-complete-tasks/](../../../../services/project-success-service/capabilities/manage-and-complete-tasks/) (タスク分解部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
