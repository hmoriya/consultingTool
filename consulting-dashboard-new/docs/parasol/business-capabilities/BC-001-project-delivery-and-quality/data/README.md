# BC-001: データ設計

**BC**: Project Delivery & Quality Management
**作成日**: 2025-10-31
**V2移行元**: services/project-success-service/database-design.md

---

## 概要

このドキュメントは、BC-001（プロジェクト配信と品質管理）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### projects
プロジェクトマスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | プロジェクトID |
| name | VARCHAR(200) | NOT NULL | プロジェクト名 |
| description | TEXT | | プロジェクト説明 |
| status | VARCHAR(20) | NOT NULL | 状態（planning/executing/completed/cancelled） |
| start_date | DATE | NOT NULL | 開始日 |
| end_date | DATE | NOT NULL | 終了日 |
| budget | DECIMAL(15,2) | | 予算 |
| owner_id | UUID | FK → users | プロジェクトオーナー |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: status, owner_id, start_date

---

### tasks
タスク

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | タスクID |
| project_id | UUID | FK → projects, NOT NULL | プロジェクトID |
| parent_task_id | UUID | FK → tasks | 親タスクID（WBS階層） |
| name | VARCHAR(200) | NOT NULL | タスク名 |
| description | TEXT | | タスク説明 |
| status | VARCHAR(20) | NOT NULL | 状態（not_started/in_progress/completed/on_hold） |
| priority | VARCHAR(10) | NOT NULL | 優先度（high/medium/low） |
| estimated_hours | DECIMAL(8,2) | | 見積工数 |
| actual_hours | DECIMAL(8,2) | | 実績工数 |
| assignee_id | UUID | FK → users | 担当者 |
| start_date | DATE | | 開始日 |
| due_date | DATE | | 期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: project_id, status, assignee_id, due_date

---

### task_dependencies
タスク依存関係

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 依存関係ID |
| predecessor_task_id | UUID | FK → tasks, NOT NULL | 先行タスク |
| successor_task_id | UUID | FK → tasks, NOT NULL | 後続タスク |
| dependency_type | VARCHAR(10) | NOT NULL | 依存タイプ（FS/SS/FF/SF） |
| lag_days | INTEGER | DEFAULT 0 | ラグ日数 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**ユニーク制約**: (predecessor_task_id, successor_task_id)

---

### deliverables
成果物

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 成果物ID |
| project_id | UUID | FK → projects, NOT NULL | プロジェクトID |
| task_id | UUID | FK → tasks | 関連タスク |
| name | VARCHAR(200) | NOT NULL | 成果物名 |
| description | TEXT | | 説明 |
| quality_status | VARCHAR(20) | NOT NULL | 品質状態（not_reviewed/in_review/approved/rejected） |
| version | VARCHAR(20) | NOT NULL | バージョン |
| file_path | VARCHAR(500) | | ファイルパス |
| review_deadline | DATE | | レビュー期限 |
| created_by | UUID | FK → users | 作成者 |
| reviewed_by | UUID | FK → users | レビュー者 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: project_id, quality_status, review_deadline

---

### deliverable_reviews
成果物レビュー履歴

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | レビューID |
| deliverable_id | UUID | FK → deliverables, NOT NULL | 成果物ID |
| reviewer_id | UUID | FK → users, NOT NULL | レビュー者 |
| review_result | VARCHAR(20) | NOT NULL | 結果（approved/rejected/needs_revision） |
| comments | TEXT | | コメント |
| reviewed_at | TIMESTAMP | NOT NULL | レビュー日時 |

**インデックス**: deliverable_id, reviewer_id

---

### risks
リスク

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | リスクID |
| project_id | UUID | FK → projects, NOT NULL | プロジェクトID |
| name | VARCHAR(200) | NOT NULL | リスク名 |
| description | TEXT | | 説明 |
| impact | VARCHAR(10) | NOT NULL | 影響度（high/medium/low） |
| probability | VARCHAR(10) | NOT NULL | 発生確率（high/medium/low） |
| status | VARCHAR(20) | NOT NULL | 状態（identified/assessed/mitigating/resolved/occurred） |
| owner_id | UUID | FK → users | リスクオーナー |
| identified_at | TIMESTAMP | NOT NULL | 識別日時 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: project_id, status, impact, probability

---

### risk_mitigations
リスク対応策

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | 対応策ID |
| risk_id | UUID | FK → risks, NOT NULL | リスクID |
| strategy | VARCHAR(20) | NOT NULL | 戦略（avoid/mitigate/transfer/accept） |
| action_plan | TEXT | NOT NULL | 対応計画 |
| responsible_id | UUID | FK → users | 責任者 |
| status | VARCHAR(20) | NOT NULL | 状態（planned/in_progress/completed） |
| due_date | DATE | | 期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: risk_id, status

---

## データフロー

### プロジェクト作成フロー
```
1. projects テーブルにINSERT
2. 初期タスク（WBS）をtasks テーブルにINSERT
3. タスク依存関係をtask_dependencies テーブルにINSERT
4. BC-002 (Financial) へコスト配分イベント発行
```

### タスク実行フロー
```
1. tasks.status を更新（not_started → in_progress）
2. tasks.actual_hours を蓄積
3. 完了時、tasks.status を completed に更新
4. 後続タスクの開始可能性をチェック
```

### 成果物レビューフロー
```
1. deliverables テーブルにINSERT（quality_status = not_reviewed）
2. BC-007 (Communication) へレビュー依頼通知
3. deliverable_reviews テーブルにレビュー結果INSERT
4. deliverables.quality_status を更新
```

---

## BC間データ連携

### BC-002 (Financial) へのデータ連携
- プロジェクトコスト情報（projects.budget）
- 実績工数データ（tasks.actual_hours）

### BC-005 (Resources) へのデータ連携
- リソース割当情報（tasks.assignee_id）
- 工数実績データ（tasks.actual_hours）

### BC-006 (Knowledge) へのデータ連携
- プロジェクト完了情報（projects.status = completed）
- ベストプラクティス（成功したタスク実行パターン）

---

## パフォーマンス最適化

### インデックス戦略
- 頻繁に検索されるカラムにインデックス作成
- 複合インデックスの活用（project_id + status など）

### パーティショニング
- `tasks` テーブル: project_id でパーティション分割
- `deliverables` テーブル: created_at (月単位) でパーティション分割

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

**ステータス**: Phase 1 - 基本構造作成完了
**次のアクション**: database-design.mdの詳細化
