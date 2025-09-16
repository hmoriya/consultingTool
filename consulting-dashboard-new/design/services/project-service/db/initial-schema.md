# データベーススキーマ定義

**更新日: 2025-01-09**

## 基本設計方針
- データベース: SQLite
- ORM: Prisma
- 命名規則: camelCase (Prisma標準)
- 主キー: cuid
- タイムスタンプ: createdAt, updatedAt
- インデックス: 検索・参照頻度の高いカラムに設定

## スキーマ定義

### Organization テーブル
組織情報を管理（コンサルティングファームとクライアント企業）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| name | String | NOT NULL | 組織名 |
| type | String | NOT NULL | 組織タイプ（consultingFirm, client） |
| users | User[] | - | 所属ユーザー |
| projects | Project[] | - | クライアントとしてのプロジェクト |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### User テーブル
ユーザー情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| email | String | @unique | メールアドレス |
| password | String | NOT NULL | ハッシュ化されたパスワード |
| name | String | NOT NULL | ユーザー名 |
| roleId | String | FK | ロールID |
| organizationId | String | FK | 組織ID |
| isActive | Boolean | @default(true) | アクティブフラグ |
| lastLogin | DateTime? | NULL | 最終ログイン日時 |
| sessions | Session[] | - | セッション |
| projectMembers | ProjectMember[] | - | プロジェクト参加情報 |
| assignedTasks | Task[] | - | アサインされたタスク |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Role テーブル
ロール（権限グループ）を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| name | String | @unique | ロール名（executive, pm, consultant, client） |
| description | String? | NULL | 説明 |
| isSystem | Boolean | @default(false) | システム定義フラグ |
| permissions | RolePermission[] | - | 権限 |
| users | User[] | - | ユーザー |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Project テーブル
プロジェクト情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| name | String | NOT NULL | プロジェクト名 |
| code | String | @unique | プロジェクトコード |
| clientId | String | FK | クライアント組織ID |
| status | String | NOT NULL | ステータス（planning, active, completed, onhold） |
| priority | String? | NULL | 優先度（low, medium, high, critical） |
| startDate | DateTime | NOT NULL | 開始日 |
| endDate | DateTime? | NULL | 終了日 |
| budget | Float | NOT NULL | 予算 |
| description | String? | NULL | 説明 |
| projectMembers | ProjectMember[] | - | プロジェクトメンバー |
| milestones | Milestone[] | - | マイルストーン |
| tasks | Task[] | - | タスク |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### ProjectMember テーブル
プロジェクトメンバー（プロジェクトとユーザーの中間テーブル）

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| projectId | String | FK | プロジェクトID |
| userId | String | FK | ユーザーID |
| role | String | NOT NULL | プロジェクト内ロール（pm, lead, senior, consultant, analyst） |
| allocation | Int | NOT NULL | 稼働率（1-100%） |
| startDate | DateTime | NOT NULL | 参画開始日 |
| endDate | DateTime? | NULL | 参画終了日 |
| createdAt | DateTime | @default(now()) | 作成日時 |

### Milestone テーブル
マイルストーン情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| projectId | String | FK | プロジェクトID |
| name | String | NOT NULL | マイルストーン名 |
| description | String? | NULL | 説明 |
| dueDate | DateTime | NOT NULL | 期日 |
| status | String | NOT NULL | ステータス（pending, completed, delayed） |
| tasks | Task[] | - | 関連タスク |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Task テーブル
タスク情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| projectId | String | FK | プロジェクトID |
| milestoneId | String? | FK NULL | マイルストーンID |
| assigneeId | String? | FK NULL | 担当者ID |
| title | String | NOT NULL | タスクタイトル |
| description | String? | NULL | 説明 |
| status | String | NOT NULL | ステータス（todo, in_progress, review, completed） |
| priority | String | NOT NULL | 優先度（low, medium, high, urgent） |
| estimatedHours | Float? | NULL | 見積時間 |
| actualHours | Float? | NULL | 実績時間 |
| startDate | DateTime? | NULL | 開始日 |
| dueDate | DateTime? | NULL | 期限 |
| completedAt | DateTime? | NULL | 完了日時 |
| createdAt | DateTime | @default(now()) | 作成日時 |
| updatedAt | DateTime | @updatedAt | 更新日時 |

### Session テーブル
ユーザーセッションを管理

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| userId | String | FK | ユーザーID |
| token | String | @unique | セッショントークン |
| ipAddress | String? | NULL | IPアドレス |
| userAgent | String? | NULL | ユーザーエージェント |
| expiresAt | DateTime | NOT NULL | 有効期限 |
| createdAt | DateTime | @default(now()) | 作成日時 |

### AuditLog テーブル
監査ログを記録

| カラム名 | 型 | 制約 | 説明 |
|---------|------|------|------|
| id | String | @id @default(cuid()) | 一意識別子 |
| userId | String | FK | ユーザーID |
| action | String | NOT NULL | アクション |
| resource | String | NOT NULL | リソース |
| resourceId | String? | NULL | リソースID |
| details | String? | NULL | 詳細（JSON） |
| ipAddress | String? | NULL | IPアドレス |
| createdAt | DateTime | @default(now()) | 作成日時 |

### その他のテーブル

#### Permission テーブル
権限を定義

#### RolePermission テーブル
ロールと権限の中間テーブル

#### ProjectMetric テーブル
プロジェクトのメトリクス（収益、コスト、進捗率など）を記録

#### ResourceAllocation テーブル
リソース配分（ユーザーの稼働時間）を記録

## インデックス

主要なインデックス：
- User: email, organizationId, roleId
- Session: userId, expiresAt
- AuditLog: userId, createdAt, resource
- Project: clientId, status
- ProjectMember: userId
- Milestone: projectId, dueDate
- Task: projectId, assigneeId, status, priority, dueDate

## 初期データ

### ロール
- executive: エグゼクティブ
- pm: プロジェクトマネージャー
- consultant: コンサルタント
- client: クライアント

### 組織タイプ
- consultingFirm: コンサルティングファーム
- client: クライアント企業

## 関連性

1. **Organization** は複数の **User** と **Project**（クライアントとして）を持つ
2. **User** は一つの **Role** と **Organization** に所属
3. **Project** は一つの **Organization**（クライアント）に紐づく
4. **ProjectMember** を介して **User** と **Project** が多対多の関係
5. **Task** は **Project** と **Milestone** に紐づき、**User**（assignee）に割り当て可能
6. **Session** と **AuditLog** は **User** の活動を記録