# BC-005: データ設計

**BC**: Team & Resource Optimization
**作成日**: 2025-10-31
**V2移行元**: services/talent-optimization-service/database-design.md + services/productivity-visualization-service/database-design.md

---

## 概要

このドキュメントは、BC-005（チームとリソースの最適化）のデータモデルとデータベース設計を定義します。

---

## 主要テーブル

### resources
リソースマスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | リソースID |
| user_id | UUID | FK → users（BC-003）, NOT NULL | ユーザーID |
| resource_type | VARCHAR(50) | NOT NULL | リソースタイプ |
| utilization_rate | DECIMAL(5,2) | DEFAULT 0 | 稼働率（%） |
| status | VARCHAR(20) | NOT NULL | 状態（available/allocated/unavailable） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: user_id, status

---

### teams
チーム

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | チームID |
| name | VARCHAR(200) | NOT NULL | チーム名 |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| performance_score | DECIMAL(5,2) | | パフォーマンススコア |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: project_id

---

### team_members
チームメンバー

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | メンバーID |
| team_id | UUID | FK → teams, NOT NULL | チームID |
| resource_id | UUID | FK → resources, NOT NULL | リソースID |
| role | VARCHAR(50) | NOT NULL | ロール（leader/member） |
| joined_at | TIMESTAMP | NOT NULL | 参加日時 |

**インデックス**: team_id, resource_id

---

### skills
スキルマスタ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | スキルID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | スキル名 |
| category | VARCHAR(50) | NOT NULL | カテゴリ |
| level_definition | TEXT | | レベル定義 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: name, category

---

### resource_skills
リソーススキル

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | ID |
| resource_id | UUID | FK → resources, NOT NULL | リソースID |
| skill_id | UUID | FK → skills, NOT NULL | スキルID |
| level | INTEGER | NOT NULL | レベル（1-5） |
| acquired_date | DATE | | 習得日 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: resource_id, skill_id

---

### timesheets
タイムシート

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | タイムシートID |
| resource_id | UUID | FK → resources, NOT NULL | リソースID |
| period_start | DATE | NOT NULL | 期間開始 |
| period_end | DATE | NOT NULL | 期間終了 |
| approval_status | VARCHAR(20) | NOT NULL | 承認状態 |
| approved_by | UUID | FK → users | 承認者 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**: resource_id, period_start, approval_status

---

### timesheet_entries
タイムシートエントリ

| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | UUID | PK | エントリID |
| timesheet_id | UUID | FK → timesheets, NOT NULL | タイムシートID |
| project_id | UUID | FK → projects（BC-001） | プロジェクトID |
| work_date | DATE | NOT NULL | 作業日 |
| hours | DECIMAL(4,2) | NOT NULL | 時間 |
| description | TEXT | | 作業内容 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**: timesheet_id, project_id, work_date

---

## データフロー

### リソース配分フロー
```
1. resources テーブルから利用可能なリソース検索
2. スキルマッチング（resource_skills）
3. 配分実行、utilization_rate 更新
4. BC-001 へリソース割当通知
```

### タイムシート承認フロー
```
1. timesheets テーブルにINSERT（approval_status = draft）
2. timesheet_entries テーブルにエントリINSERT
3. submit時、approval_status = submitted に更新
4. 承認時、approval_status = approved に更新
5. resources.utilization_rate を更新
6. BC-002 へコスト情報送信
```

---

**ステータス**: Phase 0 - 基本構造作成完了
