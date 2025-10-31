# L3-003: Task & Work Management

**作成日**: 2025-10-31
**所属BC**: BC-001: Project Delivery & Quality Management
**V2移行元**: manage-and-complete-tasks

---

## 📋 What: この能力の定義

### 能力の概要
日々のタスクとワークアイテムを効率的に管理する能力。タスクのアサイン、実行追跡、進捗管理を通じて、チームの生産性を最大化します。

### 実現できること
- タスクの効率的なアサインメント
- タスク実行状況の可視化
- タスク間の依存関係管理
- ワークアイテムの進捗追跡
- タスクブロッカーの識別と解消

### 必要な知識
- タスク管理手法（カンバン、スクラム）
- アジャイル開発プラクティス
- チームキャパシティ管理
- 依存関係分析
- ボトルネック解消技法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: TaskManagementAggregate ([../../domain/README.md](../../domain/README.md#task-management-aggregate))
- **Entities**: Task, WorkItem, TaskAssignment, TaskDependency
- **Value Objects**: TaskStatus, Priority, EstimatedEffort, ActualEffort

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/tasks - タスク作成
  - PUT /api/tasks/{id}/assign - タスクアサイン
  - PUT /api/tasks/{id}/execute - タスク実行更新
  - GET /api/tasks/progress - 進捗追跡

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: tasks, task_assignments, task_dependencies, work_items, task_progress

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: タスクをアサイン・実行する | タスクの割り当てと実行管理 | 3-4個 | assign-and-execute-tasks |
| **OP-002**: タスク進捗を追跡する | 進捗状況の可視化と管理 | 2-3個 | track-task-progress |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 2個
- **推定UseCase数**: 5-7個
- **V2からの移行**: タスク分解操作をL3-001から参照する形に統合

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/project-success-service/capabilities/manage-and-complete-tasks/](../../../../services/project-success-service/capabilities/manage-and-complete-tasks/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-003 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
