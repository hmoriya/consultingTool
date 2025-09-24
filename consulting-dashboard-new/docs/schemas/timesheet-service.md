# タイムシートサービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/timesheet-service/data/timesheet.db`
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
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式のデータ
```

## テーブル定義

### 1. Timesheets（タイムシート）

**説明**: 週単位のタイムシート

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | タイムシートID |
| userId | UUID | NOT NULL | ユーザーID |
| weekStartDate | DATE | NOT NULL | 週開始日（月曜） |
| weekEndDate | DATE | NOT NULL | 週終了日（日曜） |
| totalHours | DECIMAL | DEFAULT 0 | 合計工数 |
| billableHours | DECIMAL | DEFAULT 0 | 請求可能工数 |
| status | ENUM | NOT NULL | ステータス |
| submittedAt | TIMESTAMP | NULL | 提出日時 |
| approvedAt | TIMESTAMP | NULL | 承認日時 |
| approvedBy | UUID | NULL | 承認者ID |
| rejectedAt | TIMESTAMP | NULL | 差戻し日時 |
| rejectedBy | UUID | NULL | 差戻し者ID |
| rejectionReason | TEXT | NULL | 差戻し理由 |
| comments | TEXT | NULL | コメント |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_timesheets_userId` (userId)
- `idx_timesheets_weekStartDate` (weekStartDate)
- `idx_timesheets_status` (status)
- `idx_timesheets_composite` (userId, weekStartDate) - UNIQUE

**ENUM定義**:
- `status`: Draft, Submitted, Approved, Rejected

---

### 2. TimesheetEntries（タイムシートエントリー）

**説明**: 日別・タスク別の工数入力

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | エントリーID |
| timesheetId | UUID | NOT NULL | タイムシートID |
| projectId | UUID | NOT NULL | プロジェクトID |
| taskId | UUID | NULL | タスクID |
| date | DATE | NOT NULL | 作業日 |
| hours | DECIMAL | NOT NULL | 工数 |
| billable | BOOLEAN | DEFAULT true | 請求可能フラグ |
| category | ENUM | NOT NULL | カテゴリ |
| description | TEXT | NULL | 作業内容 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_entries_timesheetId` (timesheetId)
- `idx_entries_date` (date)
- `idx_entries_projectId` (projectId)
- `idx_entries_composite` (timesheetId, date, projectId, taskId) - UNIQUE

**外部キー**:
- `timesheetId` → `Timesheets.id` (CASCADE DELETE)

**ENUM定義**:
- `category`: Development, Design, Meeting, Documentation, Testing, Support, Training, Other

---

### 3. ApprovalFlow（承認フロー）

**説明**: 承認フロー定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | フローID |
| userId | UUID | NOT NULL | 対象ユーザーID |
| approverId | UUID | NOT NULL | 承認者ID |
| level | INTEGER | NOT NULL | 承認レベル |
| isActive | BOOLEAN | DEFAULT true | 有効フラグ |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_approval_flow_userId` (userId)
- `idx_approval_flow_approverId` (approverId)
- `idx_approval_flow_composite` (userId, level) - UNIQUE

---

### 4. ApprovalHistory（承認履歴）

**説明**: 承認アクション履歴

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 履歴ID |
| timesheetId | UUID | NOT NULL | タイムシートID |
| action | ENUM | NOT NULL | アクション |
| actorId | UUID | NOT NULL | 実行者ID |
| comments | TEXT | NULL | コメント |
| previousStatus | ENUM | NOT NULL | 変更前ステータス |
| newStatus | ENUM | NOT NULL | 変更後ステータス |
| createdAt | TIMESTAMP | NOT NULL | 実行日時 |

**インデックス**:
- `idx_approval_history_timesheetId` (timesheetId)
- `idx_approval_history_actorId` (actorId)
- `idx_approval_history_createdAt` (createdAt)

**外部キー**:
- `timesheetId` → `Timesheets.id` (CASCADE DELETE)

**ENUM定義**:
- `action`: Submit, Approve, Reject, Recall, Edit
- `previousStatus`: Draft, Submitted, Approved, Rejected
- `newStatus`: Draft, Submitted, Approved, Rejected

---

### 5. WorkingHours（勤務時間設定）

**説明**: 標準勤務時間設定

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 設定ID |
| userId | UUID | NULL | ユーザーID（NULLの場合デフォルト） |
| standardHoursPerDay | DECIMAL | NOT NULL | 標準勤務時間/日 |
| standardHoursPerWeek | DECIMAL | NOT NULL | 標準勤務時間/週 |
| overtimeThreshold | DECIMAL | NULL | 残業閾値 |
| effectiveFrom | DATE | NOT NULL | 有効開始日 |
| effectiveTo | DATE | NULL | 有効終了日 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_working_hours_userId` (userId)
- `idx_working_hours_dates` (effectiveFrom, effectiveTo)

---

### 6. Holidays（祝日）

**説明**: 祝日マスタ

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 祝日ID |
| date | DATE | UNIQUE, NOT NULL | 祝日日付 |
| name | STRING_100 | NOT NULL | 祝日名 |
| country | STRING_2 | NOT NULL | 国コード |
| isNationalHoliday | BOOLEAN | DEFAULT true | 国民の祝日フラグ |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_holidays_date` (date) - UNIQUE
- `idx_holidays_country` (country)

---

## リレーション図

```
Timesheets
  ├─ TimesheetEntries (1:N)
  └─ ApprovalHistory (1:N)

ApprovalFlow
  └─ Users (N:1) [via userId, approverId]

WorkingHours
  └─ Users (N:1) [via userId]
```

## データ整合性ルール

1. **週範囲制約**: `weekEndDate` = `weekStartDate` + 6日
2. **工数制約**: 1日あたりの工数は0～24時間
3. **提出制約**: Submittedステータス以降は編集不可
4. **承認制約**: 承認者のみがApprove/Reject可能
5. **日付制約**: 過去の締め切り済み期間は編集不可
6. **合計計算**: totalHours = SUM(TimesheetEntries.hours)
7. **請求可能計算**: billableHours = SUM(TimesheetEntries.hours WHERE billable = true)