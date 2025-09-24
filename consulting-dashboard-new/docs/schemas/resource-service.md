# リソースサービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/resource-service/data/resource.db`
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
MONEY: 金額
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式のデータ
```

## テーブル定義

### 1. Resources（リソース）

**説明**: リソース（人材）基本情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | リソースID |
| userId | UUID | UNIQUE, NOT NULL | ユーザーID |
| employeeCode | STRING_20 | UNIQUE, NOT NULL | 社員番号 |
| department | STRING_100 | NOT NULL | 部署 |
| position | STRING_100 | NOT NULL | 役職 |
| level | ENUM | NOT NULL | レベル |
| baseRate | MONEY | NULL | 基本単価 |
| location | STRING_100 | NULL | 勤務地 |
| availability | PERCENTAGE | DEFAULT 100 | 稼働可能率 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_resources_userId` (userId) - UNIQUE
- `idx_resources_employeeCode` (employeeCode) - UNIQUE
- `idx_resources_department` (department)
- `idx_resources_level` (level)

**ENUM定義**:
- `level`: Junior, Middle, Senior, Expert, Principal

---

### 2. Teams（チーム）

**説明**: チーム情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | チームID |
| name | STRING_100 | NOT NULL | チーム名 |
| description | TEXT | NULL | 説明 |
| leaderId | UUID | NOT NULL | リーダーID |
| specialization | STRING_100 | NULL | 専門分野 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_teams_leaderId` (leaderId)

**外部キー**:
- `leaderId` → `Resources.id`

---

### 3. TeamMembers（チームメンバー）

**説明**: チーム所属情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | メンバーID |
| teamId | UUID | NOT NULL | チームID |
| resourceId | UUID | NOT NULL | リソースID |
| role | ENUM | NOT NULL | チーム内ロール |
| joinDate | DATE | NOT NULL | 参加日 |
| leaveDate | DATE | NULL | 離脱日 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_team_members_composite` (teamId, resourceId) - UNIQUE
- `idx_team_members_teamId` (teamId)
- `idx_team_members_resourceId` (resourceId)

**外部キー**:
- `teamId` → `Teams.id` (CASCADE DELETE)
- `resourceId` → `Resources.id` (CASCADE DELETE)

**ENUM定義**:
- `role`: Leader, Member, Advisor

---

### 4. Skills（スキル）

**説明**: スキルマスタ

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | スキルID |
| name | STRING_100 | UNIQUE, NOT NULL | スキル名 |
| category | STRING_50 | NOT NULL | カテゴリ |
| description | TEXT | NULL | 説明 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_skills_name` (name) - UNIQUE
- `idx_skills_category` (category)

---

### 5. ResourceSkills（リソーススキル）

**説明**: リソースのスキル情報

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | ID |
| resourceId | UUID | NOT NULL | リソースID |
| skillId | UUID | NOT NULL | スキルID |
| level | ENUM | NOT NULL | スキルレベル |
| yearsOfExperience | DECIMAL | NULL | 経験年数 |
| certificationDate | DATE | NULL | 認定日 |
| lastUsedDate | DATE | NULL | 最終使用日 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_resource_skills_composite` (resourceId, skillId) - UNIQUE
- `idx_resource_skills_resourceId` (resourceId)
- `idx_resource_skills_skillId` (skillId)
- `idx_resource_skills_level` (level)

**外部キー**:
- `resourceId` → `Resources.id` (CASCADE DELETE)
- `skillId` → `Skills.id` (CASCADE DELETE)

**ENUM定義**:
- `level`: Beginner, Intermediate, Advanced, Expert

---

### 6. Assignments（アサインメント）

**説明**: プロジェクトへのリソースアサイン

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | アサインメントID |
| resourceId | UUID | NOT NULL | リソースID |
| projectId | UUID | NOT NULL | プロジェクトID |
| role | ENUM | NOT NULL | プロジェクト内ロール |
| allocationRate | PERCENTAGE | NOT NULL | 稼働率 |
| startDate | DATE | NOT NULL | 開始日 |
| endDate | DATE | NOT NULL | 終了予定日 |
| actualEndDate | DATE | NULL | 実終了日 |
| billableRate | MONEY | NULL | 請求単価 |
| status | ENUM | NOT NULL | ステータス |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_assignments_resourceId` (resourceId)
- `idx_assignments_projectId` (projectId)
- `idx_assignments_status` (status)
- `idx_assignments_dates` (startDate, endDate)

**外部キー**:
- `resourceId` → `Resources.id` (CASCADE DELETE)

**ENUM定義**:
- `role`: Lead, Developer, Designer, Analyst, Tester, Support
- `status`: Planned, Active, Completed, Cancelled

---

## リレーション図

```
Resources
  ├─ TeamMembers (1:N)
  ├─ ResourceSkills (1:N)
  └─ Assignments (1:N)

Teams
  ├─ TeamMembers (1:N)
  └─ Resources (N:1) [via leaderId]

Skills
  └─ ResourceSkills (1:N)
```

## データ整合性ルール

1. **稼働率制約**: 同時期の全アサインメントの合計稼働率 <= 100%
2. **チーム重複**: 同一リソースは同時期に複数チームに所属可能
3. **スキルレベル**: 同一スキルに対して1つのレベルのみ
4. **アサインメント期間**: `endDate` >= `startDate`
5. **リーダー制約**: チームリーダーは必ずResourcesに存在