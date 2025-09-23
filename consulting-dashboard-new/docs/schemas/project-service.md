# プロジェクトサービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/project-service/data/project.db`
- 文字エンコーディング: UTF-8
- タイムゾーン: UTC

## パラソルドメイン言語型システム
```
UUID: 36文字の一意識別子
STRING_N: 最大N文字の可変長文字列  
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: ISO 8601形式の日時
DECIMAL: 小数点数値
INTEGER: 32ビット整数
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式のデータ
```

## テーブル定義

### 1. Projects（プロジェクト）

**説明**: プロジェクト基本情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | プロジェクトID |
| code | STRING_20 | UNIQUE, NOT NULL | プロジェクトコード |
| name | STRING_200 | NOT NULL | プロジェクト名 |
| clientId | UUID | NOT NULL | クライアントID |
| startDate | DATE | NOT NULL | 開始日 |
| endDate | DATE | NOT NULL | 終了予定日 |
| actualEndDate | DATE | NULL | 実終了日 |
| budget | MONEY | NOT NULL | 予算 |
| status | ENUM | NOT NULL | ステータス |
| priority | ENUM | NOT NULL | 優先度 |
| description | TEXT | NULL | 説明 |
| pmId | UUID | NOT NULL | PMのユーザーID |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_projects_code` (code) - UNIQUE
- `idx_projects_clientId` (clientId)
- `idx_projects_status` (status)
- `idx_projects_pmId` (pmId)

**ENUM定義**:
- `status`: Planning, InProgress, OnHold, Completed, Cancelled
- `priority`: Low, Medium, High, Critical

---

### 2. Tasks（タスク）

**説明**: プロジェクト内のタスク

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | タスクID |
| projectId | UUID | NOT NULL | プロジェクトID |
| parentTaskId | UUID | NULL | 親タスクID |
| name | STRING_200 | NOT NULL | タスク名 |
| description | TEXT | NULL | 説明 |
| assigneeId | UUID | NULL | 担当者ID |
| startDate | DATE | NOT NULL | 開始日 |
| dueDate | DATE | NOT NULL | 期限 |
| completedDate | DATE | NULL | 完了日 |
| status | ENUM | NOT NULL | ステータス |
| priority | ENUM | NOT NULL | 優先度 |
| estimatedHours | DECIMAL | NULL | 見積工数 |
| actualHours | DECIMAL | NULL | 実績工数 |
| progress | PERCENTAGE | DEFAULT 0 | 進捗率 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_tasks_projectId` (projectId)
- `idx_tasks_assigneeId` (assigneeId)
- `idx_tasks_status` (status)
- `idx_tasks_parentTaskId` (parentTaskId)

**外部キー**:
- `projectId` → `Projects.id` (CASCADE DELETE)
- `parentTaskId` → `Tasks.id` (CASCADE DELETE)

**ENUM定義**:
- `status`: Todo, InProgress, InReview, Done, Cancelled
- `priority`: Low, Medium, High, Urgent

---

### 3. Milestones（マイルストーン）

**説明**: プロジェクトマイルストーン

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | マイルストーンID |
| projectId | UUID | NOT NULL | プロジェクトID |
| name | STRING_200 | NOT NULL | マイルストーン名 |
| description | TEXT | NULL | 説明 |
| dueDate | DATE | NOT NULL | 期限 |
| completedDate | DATE | NULL | 完了日 |
| status | ENUM | NOT NULL | ステータス |
| deliverables | JSON | NULL | 成果物リスト |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_milestones_projectId` (projectId)
- `idx_milestones_dueDate` (dueDate)

**外部キー**:
- `projectId` → `Projects.id` (CASCADE DELETE)

**ENUM定義**:
- `status`: Planned, InProgress, Achieved, Missed

---

### 4. ProjectMembers（プロジェクトメンバー）

**説明**: プロジェクト参加メンバー

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | メンバーID |
| projectId | UUID | NOT NULL | プロジェクトID |
| userId | UUID | NOT NULL | ユーザーID |
| role | ENUM | NOT NULL | プロジェクト内ロール |
| joinDate | DATE | NOT NULL | 参加日 |
| leaveDate | DATE | NULL | 離脱日 |
| allocationRate | PERCENTAGE | NOT NULL | 稼働率 |
| billableRate | MONEY | NULL | 請求レート |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_project_members_projectId` (projectId)
- `idx_project_members_userId` (userId)
- `idx_project_members_composite` (projectId, userId) - UNIQUE

**外部キー**:
- `projectId` → `Projects.id` (CASCADE DELETE)

**ENUM定義**:
- `role`: pm, lead, member, reviewer, observer

---

### 5. Risks（リスク）

**説明**: プロジェクトリスク管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | リスクID |
| projectId | UUID | NOT NULL | プロジェクトID |
| title | STRING_200 | NOT NULL | リスクタイトル |
| description | TEXT | NOT NULL | リスク内容 |
| category | ENUM | NOT NULL | カテゴリ |
| probability | ENUM | NOT NULL | 発生確率 |
| impact | ENUM | NOT NULL | 影響度 |
| status | ENUM | NOT NULL | ステータス |
| mitigation | TEXT | NULL | 軽減策 |
| owner | UUID | NOT NULL | 責任者ID |
| identifiedDate | DATE | NOT NULL | 特定日 |
| resolvedDate | DATE | NULL | 解決日 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_risks_projectId` (projectId)
- `idx_risks_status` (status)
- `idx_risks_owner` (owner)

**外部キー**:
- `projectId` → `Projects.id` (CASCADE DELETE)

**ENUM定義**:
- `category`: Technical, Resource, Schedule, Budget, Quality, External
- `probability`: Low, Medium, High, VeryHigh
- `impact`: Low, Medium, High, Critical
- `status`: Open, Mitigating, Resolved, Accepted

---

### 6. Deliverables（成果物）

**説明**: プロジェクト成果物

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 成果物ID |
| projectId | UUID | NOT NULL | プロジェクトID |
| milestoneId | UUID | NULL | マイルストーンID |
| name | STRING_200 | NOT NULL | 成果物名 |
| type | ENUM | NOT NULL | 成果物タイプ |
| description | TEXT | NULL | 説明 |
| status | ENUM | NOT NULL | ステータス |
| version | STRING_20 | NULL | バージョン |
| fileUrl | TEXT | NULL | ファイルURL |
| reviewStatus | ENUM | NULL | レビュー状態 |
| submittedDate | DATE | NULL | 提出日 |
| approvedDate | DATE | NULL | 承認日 |
| approvedBy | UUID | NULL | 承認者ID |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_deliverables_projectId` (projectId)
- `idx_deliverables_milestoneId` (milestoneId)
- `idx_deliverables_status` (status)

**外部キー**:
- `projectId` → `Projects.id` (CASCADE DELETE)
- `milestoneId` → `Milestones.id` (SET NULL)

**ENUM定義**:
- `type`: Document, Presentation, Code, Design, Report, Other
- `status`: Draft, InProgress, Submitted, Approved, Rejected
- `reviewStatus`: Pending, Reviewing, Approved, RequiresRevision

---

## リレーション図

```
Projects
  ├─ Tasks (1:N)
  │   └─ Tasks (self-reference for subtasks)
  ├─ Milestones (1:N)
  ├─ ProjectMembers (1:N)
  ├─ Risks (1:N)
  └─ Deliverables (1:N)
      └─ Milestones (N:1)
```

## データ整合性ルール

1. **プロジェクト期間**: `endDate` >= `startDate`
2. **タスク期間**: `dueDate` >= `startDate`
3. **タスク階層**: 最大深度は5レベルまで
4. **メンバー重複**: 同一プロジェクトに同一ユーザーは1レコードのみ
5. **稼働率**: 0 <= `allocationRate` <= 100
6. **進捗率**: 0 <= `progress` <= 100