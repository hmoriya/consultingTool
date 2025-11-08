// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/parasol-client');

const parasolDb = new PrismaClient();

// 全7サービスの完全な定義
const serviceDefinitions = [
  {
    name: 'secure-access',
    displayName: 'セキュアアクセスサービス',
    description: 'ユーザー認証、組織管理、アクセス制御を担当するサービス',
    serviceDescription: `# セキュアアクセスサービス

## サービス概要
システムへのセキュアなアクセスを提供し、組織とユーザーの基本情報を管理する

## 提供価値
- **セキュリティ**: 安全な認証・認可機能
- **統制**: 組織全体のアクセス制御
- **効率**: シングルサインオン対応

## 主要機能
- ユーザー認証（ログイン/ログアウト）
- パスワード管理
- ロールベースアクセス制御
- 組織・ユーザー情報管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 認証ドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### 組織 [Organization] [ORGANIZATION]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 組織名 | name | NAME | STRING_100 | ○ | 組織名称 |
| 組織タイプ | type | TYPE | OrganizationType | ○ | 組織分類 |
| 業界 | industry | INDUSTRY | STRING_50 |  | 業界分類 |
| 説明 | description | DESCRIPTION | STRING_500 |  | 組織説明 |
| ウェブサイト | website | WEBSITE | STRING_255 |  | 公式サイト |
| 従業員数 | employeeCount | EMPLOYEE_COUNT | INTEGER |  | 従業員数 |
| 設立年 | foundedYear | FOUNDED_YEAR | INTEGER |  | 設立年 |
| 住所 | address | ADDRESS | Address | ○ | 所在地 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- 組織が集約ルート

### ユーザー [User] [USER]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| メールアドレス | email | EMAIL | EMAIL | ○ | ログインID |
| 名前 | name | NAME | STRING_100 | ○ | ユーザー名 |
| パスワード | password | PASSWORD | PASSWORD_HASH | ○ | 暗号化パスワード |
| 組織ID | organizationId | ORGANIZATION_ID | UUID | ○ | 所属組織 |
| ロールID | roleId | ROLE_ID | UUID | ○ | 権限ロール |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 有効/無効 |
| 最終ログイン | lastLogin | LAST_LOGIN | TIMESTAMP |  | 最終ログイン日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### ロール [Role] [ROLE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| ロール名 | name | NAME | STRING_50 | ○ | ロール名称 |
| 説明 | description | DESCRIPTION | STRING_200 |  | ロール説明 |
| システムロール | isSystem | IS_SYSTEM | BOOLEAN | ○ | システム定義ロール |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 組織タイプ [OrganizationType] [ORGANIZATION_TYPE]

- **タイプ** [type] [TYPE]: ENUM('consulting', 'client', 'partner')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 住所 [Address] [ADDRESS]

- **郵便番号** [postalCode] [POSTAL_CODE]: STRING_10
- **都道府県** [prefecture] [PREFECTURE]: STRING_20
- **市区町村** [city] [CITY]: STRING_50
- **町名番地** [street] [STREET]: STRING_100

## 集約（Aggregates）

### 組織集約 [OrganizationAggregate] [ORGANIZATION_AGGREGATE]

#### 集約ルート
- Organization

#### 含まれるエンティティ
- Organization
- User
- Role

#### ビジネスルール
- 1ユーザーは1つの組織に所属
- ロールは組織に関係なく共通
- 組織削除時は所属ユーザーも削除`
  },
  
  {
    name: 'project-success-support',
    displayName: 'プロジェクト成功支援サービス',
    description: 'プロジェクトのライフサイクル全体を管理するサービス',
    serviceDescription: `# プロジェクト成功支援サービス

## サービス概要
コンサルティングプロジェクトの計画から完了までを一元管理

## 提供価値
- **可視性**: プロジェクト状況のリアルタイム把握
- **効率**: タスク・成果物の体系的管理
- **品質**: マイルストーン管理による進捗統制

## 主要機能
- プロジェクト計画・実行管理
- タスク管理
- マイルストーン管理
- 成果物管理
- プロジェクトメンバー管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: プロジェクトドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### プロジェクト [Project] [PROJECT]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| プロジェクト名 | name | NAME | STRING_200 | ○ | プロジェクト名 |
| プロジェクトコード | code | CODE | STRING_20 | ○ | プロジェクトコード |
| 説明 | description | DESCRIPTION | TEXT |  | プロジェクト詳細 |
| ステータス | status | STATUS | ProjectStatus | ○ | 進捗状態 |
| 開始日 | startDate | START_DATE | DATE | ○ | 開始予定日 |
| 終了日 | endDate | END_DATE | DATE | ○ | 終了予定日 |
| 予算 | budget | BUDGET | MONEY |  | プロジェクト予算 |
| クライアントID | clientId | CLIENT_ID | UUID | ○ | クライアント |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- プロジェクトが集約ルート

### タスク [Task] [TASK]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| タスク名 | name | NAME | STRING_200 | ○ | タスク名 |
| 説明 | description | DESCRIPTION | TEXT |  | タスク詳細 |
| ステータス | status | STATUS | TaskStatus | ○ | 進捗状態 |
| 優先度 | priority | PRIORITY | Priority | ○ | 優先度 |
| 開始日 | startDate | START_DATE | DATE |  | 開始予定日 |
| 終了日 | endDate | END_DATE | DATE |  | 終了予定日 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 所属プロジェクト |
| 担当者ID | assigneeId | ASSIGNEE_ID | UUID |  | 担当者 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### マイルストーン [Milestone] [MILESTONE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| マイルストーン名 | name | NAME | STRING_200 | ○ | マイルストーン名 |
| 説明 | description | DESCRIPTION | TEXT |  | 詳細説明 |
| 期日 | dueDate | DUE_DATE | DATE | ○ | 期限日 |
| ステータス | status | STATUS | MilestoneStatus | ○ | 達成状況 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 所属プロジェクト |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### プロジェクトステータス [ProjectStatus] [PROJECT_STATUS]

- **ステータス** [status] [STATUS]: ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### タスクステータス [TaskStatus] [TASK_STATUS]

- **ステータス** [status] [STATUS]: ENUM('todo', 'in_progress', 'review', 'done')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 優先度 [Priority] [PRIORITY]

- **レベル** [level] [LEVEL]: ENUM('low', 'medium', 'high', 'urgent')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### マイルストーンステータス [MilestoneStatus] [MILESTONE_STATUS]

- **ステータス** [status] [STATUS]: ENUM('pending', 'achieved', 'missed')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

## 集約（Aggregates）

### プロジェクト集約 [ProjectAggregate] [PROJECT_AGGREGATE]

#### 集約ルート
- Project

#### 含まれるエンティティ
- Project
- Task
- Milestone

#### ビジネスルール
- タスクは必ずプロジェクトに紐づく
- マイルストーンはプロジェクトのチェックポイント
- プロジェクト削除時は関連タスク・マイルストーンも削除`
  },
  
  {
    name: 'talent-optimization',
    displayName: 'タレント最適化サービス',
    description: 'チーム編成、スキル管理、リソース配分を担当するサービス',
    serviceDescription: `# タレント最適化サービス

## サービス概要
人材のスキルと配置を最適化し、組織の生産性を最大化

## 提供価値
- **最適化**: スキルマッチングによる適材適所
- **透明性**: リソース稼働状況の可視化
- **成長**: スキル開発の促進

## 主要機能
- チーム管理
- スキル管理
- リソース配分計画
- 稼働率管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: リソースドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### チーム [Team] [TEAM]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| チーム名 | name | NAME | STRING_100 | ○ | チーム名 |
| 説明 | description | DESCRIPTION | STRING_500 |  | チーム説明 |
| リーダーID | leaderId | LEADER_ID | UUID |  | チームリーダー |
| 親チームID | parentTeamId | PARENT_TEAM_ID | UUID |  | 親チーム |
| 組織ID | organizationId | ORGANIZATION_ID | UUID | ○ | 所属組織 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 有効/無効 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- チームが集約ルート

### スキル [Skill] [SKILL]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| スキル名 | name | NAME | STRING_100 | ○ | スキル名 |
| 説明 | description | DESCRIPTION | STRING_500 |  | スキル説明 |
| カテゴリ | category | CATEGORY | SkillCategory | ○ | スキル分類 |
| レベル定義 | levelDefinitions | LEVEL_DEFINITIONS | SkillLevel | ○ | レベル定義 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| ユーザーID | userId | USER_ID | UUID | ○ | 配分対象者 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 配分先プロジェクト |
| 配分率 | allocationPercentage | ALLOCATION_PERCENTAGE | PERCENTAGE | ○ | 配分率（%） |
| 開始日 | startDate | START_DATE | DATE | ○ | 配分開始日 |
| 終了日 | endDate | END_DATE | DATE | ○ | 配分終了日 |
| ロール | role | ROLE | ProjectRole | ○ | プロジェクト内役割 |
| ステータス | status | STATUS | AllocationStatus | ○ | 配分状況 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### スキルカテゴリ [SkillCategory] [SKILL_CATEGORY]

- **カテゴリ** [category] [CATEGORY]: ENUM('technical', 'business', 'management', 'domain')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### スキルレベル [SkillLevel] [SKILL_LEVEL]

- **レベル** [level] [LEVEL]: INTEGER
- **レベル名** [levelName] [LEVEL_NAME]: STRING_20
- **説明** [description] [DESCRIPTION]: STRING_200

### プロジェクトロール [ProjectRole] [PROJECT_ROLE]

- **ロール** [role] [ROLE]: ENUM('pm', 'lead', 'senior', 'junior', 'specialist')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 配分ステータス [AllocationStatus] [ALLOCATION_STATUS]

- **ステータス** [status] [STATUS]: ENUM('planned', 'active', 'completed', 'cancelled')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

## 集約（Aggregates）

### チーム集約 [TeamAggregate] [TEAM_AGGREGATE]

#### 集約ルート
- Team

#### 含まれるエンティティ
- Team
- Skill
- ResourceAllocation

#### ビジネスルール
- リソースの合計配分率は100%を超えない
- スキルレベルは1-5の5段階
- チームは階層構造を持てる`
  },
  
  {
    name: 'productivity-visualization',
    displayName: '生産性可視化サービス',
    description: '工数入力、承認、集計を担当するサービス',
    serviceDescription: `# 生産性可視化サービス

## サービス概要
コンサルタントの作業時間を正確に記録・管理し、プロジェクト収益性を分析

## 提供価値
- **正確性**: 日次の詳細な工数記録
- **効率**: 承認フローの自動化
- **分析**: プロジェクト収益性の可視化

## 主要機能
- 工数入力
- 承認フロー
- 工数集計・分析
- 請求可能時間の管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 工数ドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### 工数エントリ [TimeEntry] [TIME_ENTRY]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| ユーザーID | userId | USER_ID | UUID | ○ | 作業者 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 作業日 | workDate | WORK_DATE | DATE | ○ | 作業実施日 |
| 作業時間 | hours | HOURS | DECIMAL | ○ | 作業時間（時間） |
| 作業内容 | description | DESCRIPTION | STRING_500 | ○ | 作業内容の説明 |
| カテゴリ | category | CATEGORY | WorkCategory | ○ | 作業分類 |
| ステータス | status | STATUS | TimeEntryStatus | ○ | 承認状態 |
| 請求可能フラグ | billable | BILLABLE | BOOLEAN | ○ | 請求対象可否 |
| 承認者ID | approverId | APPROVER_ID | UUID |  | 承認者 |
| 承認日時 | approvedAt | APPROVED_AT | TIMESTAMP |  | 承認日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- 工数エントリが集約ルート

### 承認ワークフロー [ApprovalWorkflow] [APPROVAL_WORKFLOW]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 名称 | name | NAME | STRING_100 | ○ | ワークフロー名 |
| 承認ステップ | steps | STEPS | ApprovalStep | ○ | 承認手順 |
| 対象範囲 | scope | SCOPE | STRING_100 | ○ | 適用範囲 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 有効/無効 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 作業分類 [WorkCategory] [WORK_CATEGORY]

- **分類コード** [code] [CODE]: STRING_20
- **分類名** [name] [NAME]: STRING_50
- **説明** [description] [DESCRIPTION]: STRING_200

### 工数ステータス [TimeEntryStatus] [TIME_ENTRY_STATUS]

- **ステータス** [status] [STATUS]: ENUM('draft', 'submitted', 'approved', 'rejected')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 承認ステップ [ApprovalStep] [APPROVAL_STEP]

- **ステップ番号** [stepNumber] [STEP_NUMBER]: INTEGER
- **承認者ロール** [approverRole] [APPROVER_ROLE]: STRING_50
- **必須フラグ** [required] [REQUIRED]: BOOLEAN

## 集約（Aggregates）

### 工数管理集約 [TimeManagementAggregate] [TIME_MANAGEMENT_AGGREGATE]

#### 集約ルート
- TimeEntry

#### 含まれるエンティティ
- TimeEntry
- ApprovalWorkflow

#### ビジネスルール
- 工数エントリの承認は設定されたワークフローに従う
- 承認済み工数の変更は禁止
- 1日の工数合計は24時間を超えない`
  },
  
  {
    name: 'collaboration-facilitation',
    displayName: 'コラボレーション促進サービス',
    description: 'システム通知、メッセージング、チャンネル管理を担当するサービス',
    serviceDescription: `# コラボレーション促進サービス

## サービス概要
リアルタイムな情報共有とコミュニケーションを実現

## 提供価値
- **即時性**: リアルタイム通知
- **文脈**: プロジェクト単位のコミュニケーション
- **透明性**: 情報の一元管理

## 主要機能
- システム通知
- チャンネル管理
- メッセージング
- 通知設定管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 通知ドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### 通知 [Notification] [NOTIFICATION]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| タイトル | title | TITLE | STRING_200 | ○ | 通知タイトル |
| メッセージ | message | MESSAGE | TEXT | ○ | 通知内容 |
| タイプ | type | TYPE | NotificationType | ○ | 通知種別 |
| 重要度 | priority | PRIORITY | NotificationPriority | ○ | 重要度 |
| 受信者ID | recipientId | RECIPIENT_ID | UUID | ○ | 受信者 |
| 送信者ID | senderId | SENDER_ID | UUID |  | 送信者 |
| 関連ID | relatedId | RELATED_ID | UUID |  | 関連オブジェクトID |
| 関連タイプ | relatedType | RELATED_TYPE | STRING_50 |  | 関連オブジェクト種別 |
| 読取フラグ | isRead | IS_READ | BOOLEAN | ○ | 既読/未読 |
| 送信日時 | sentAt | SENT_AT | TIMESTAMP | ○ | 送信日時 |
| 読取日時 | readAt | READ_AT | TIMESTAMP |  | 読取日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- 通知が集約ルート

### チャンネル [Channel] [CHANNEL]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| チャンネル名 | name | NAME | STRING_100 | ○ | チャンネル名 |
| 説明 | description | DESCRIPTION | STRING_500 |  | チャンネル説明 |
| タイプ | type | TYPE | ChannelType | ○ | チャンネル種別 |
| プライベートフラグ | isPrivate | IS_PRIVATE | BOOLEAN | ○ | 公開/非公開 |
| プロジェクトID | projectId | PROJECT_ID | UUID |  | 関連プロジェクト |
| 作成者ID | creatorId | CREATOR_ID | UUID | ○ | 作成者 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### メッセージ [Message] [MESSAGE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 内容 | content | CONTENT | TEXT | ○ | メッセージ内容 |
| チャンネルID | channelId | CHANNEL_ID | UUID | ○ | 投稿先チャンネル |
| 送信者ID | senderId | SENDER_ID | UUID | ○ | 送信者 |
| 返信先ID | replyToId | REPLY_TO_ID | UUID |  | 返信先メッセージ |
| 編集フラグ | isEdited | IS_EDITED | BOOLEAN | ○ | 編集済みフラグ |
| 削除フラグ | isDeleted | IS_DELETED | BOOLEAN | ○ | 削除フラグ |
| 投稿日時 | postedAt | POSTED_AT | TIMESTAMP | ○ | 投稿日時 |
| 編集日時 | editedAt | EDITED_AT | TIMESTAMP |  | 編集日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 通知タイプ [NotificationType] [NOTIFICATION_TYPE]

- **タイプ** [type] [TYPE]: ENUM('system', 'project', 'task', 'approval', 'mention')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 通知重要度 [NotificationPriority] [NOTIFICATION_PRIORITY]

- **重要度** [priority] [PRIORITY]: ENUM('low', 'normal', 'high', 'urgent')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### チャンネルタイプ [ChannelType] [CHANNEL_TYPE]

- **タイプ** [type] [TYPE]: ENUM('general', 'project', 'team', 'announcement')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

## 集約（Aggregates）

### 通知集約 [NotificationAggregate] [NOTIFICATION_AGGREGATE]

#### 集約ルート
- Notification

#### 含まれるエンティティ
- Notification

#### ビジネスルール
- 通知は既読/未読を管理
- 重要度により表示順序を制御

### チャンネル集約 [ChannelAggregate] [CHANNEL_AGGREGATE]

#### 集約ルート
- Channel

#### 含まれるエンティティ
- Channel
- Message

#### ビジネスルール
- メッセージは編集・削除可能
- プライベートチャンネルはメンバーのみアクセス可`
  },
  
  {
    name: 'knowledge-cocreation',
    displayName: 'ナレッジ共創サービス',
    description: 'ナレッジ記事、テンプレート、FAQの管理を担当するサービス',
    serviceDescription: `# ナレッジ共創サービス

## サービス概要
プロジェクトで得られた知識を体系化し、組織の知的資産として蓄積

## 提供価値
- **再利用**: 過去の知見の活用
- **標準化**: ベストプラクティスの共有
- **効率化**: テンプレートによる作業削減

## 主要機能
- ナレッジ記事管理
- テンプレート管理
- FAQ管理
- エキスパート情報管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: ナレッジドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### ナレッジ記事 [Article] [ARTICLE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| タイトル | title | TITLE | STRING_200 | ○ | 記事タイトル |
| 内容 | content | CONTENT | TEXT | ○ | 記事本文 |
| 要約 | summary | SUMMARY | STRING_500 |  | 記事要約 |
| カテゴリID | categoryId | CATEGORY_ID | UUID | ○ | カテゴリ |
| タグ | tags | TAGS | ArticleTag | ○ | タグ |
| 作成者ID | authorId | AUTHOR_ID | UUID | ○ | 作成者 |
| ステータス | status | STATUS | ArticleStatus | ○ | 公開状態 |
| 閲覧数 | viewCount | VIEW_COUNT | INTEGER | ○ | 閲覧回数 |
| 評価 | rating | RATING | DECIMAL |  | 評価平均 |
| 公開日 | publishedAt | PUBLISHED_AT | TIMESTAMP |  | 公開日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- ナレッジ記事が集約ルート

### テンプレート [Template] [TEMPLATE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| テンプレート名 | name | NAME | STRING_200 | ○ | テンプレート名 |
| 説明 | description | DESCRIPTION | STRING_500 |  | テンプレート説明 |
| 内容 | content | CONTENT | TEXT | ○ | テンプレート内容 |
| カテゴリID | categoryId | CATEGORY_ID | UUID | ○ | カテゴリ |
| バージョン | version | VERSION | STRING_20 | ○ | バージョン |
| 作成者ID | authorId | AUTHOR_ID | UUID | ○ | 作成者 |
| 利用回数 | usageCount | USAGE_COUNT | INTEGER | ○ | 利用回数 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### FAQ [FAQ] [FAQ]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 質問 | question | QUESTION | STRING_500 | ○ | よくある質問 |
| 回答 | answer | ANSWER | TEXT | ○ | 回答内容 |
| カテゴリID | categoryId | CATEGORY_ID | UUID | ○ | カテゴリ |
| 重要度 | priority | PRIORITY | FaqPriority | ○ | 重要度 |
| 閲覧数 | viewCount | VIEW_COUNT | INTEGER | ○ | 閲覧回数 |
| 評価 | helpfulCount | HELPFUL_COUNT | INTEGER | ○ | 有用カウント |
| 作成者ID | authorId | AUTHOR_ID | UUID | ○ | 作成者 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 記事タグ [ArticleTag] [ARTICLE_TAG]

- **タグ名** [name] [NAME]: STRING_50
- **色** [color] [COLOR]: STRING_10

### 記事ステータス [ArticleStatus] [ARTICLE_STATUS]

- **ステータス** [status] [STATUS]: ENUM('draft', 'review', 'published', 'archived')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### FAQ重要度 [FaqPriority] [FAQ_PRIORITY]

- **重要度** [priority] [PRIORITY]: ENUM('low', 'medium', 'high')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

## 集約（Aggregates）

### ナレッジ集約 [KnowledgeAggregate] [KNOWLEDGE_AGGREGATE]

#### 集約ルート
- Article

#### 含まれるエンティティ
- Article
- Template
- FAQ

#### ビジネスルール
- 記事は公開前にレビュー必須
- カテゴリは階層構造
- 記事には評価とコメントが可能`
  },
  
  {
    name: 'revenue-optimization',
    displayName: '収益最適化サービス',
    description: '収益、コスト、請求の管理を担当するサービス',
    serviceDescription: `# 収益最適化サービス

## サービス概要
プロジェクトの収益性を管理し、財務健全性を維持

## 提供価値
- **可視性**: リアルタイムな収益状況
- **予測**: 財務予測と分析
- **統制**: コスト管理

## 主要機能
- 収益管理
- コスト管理
- 請求管理
- 予算管理`,
    
    domainLanguageDefinition: `# パラソルドメイン言語: 財務ドメイン v1.2.0

更新日: 2024-12-28

## エンティティ（Entities）

### 収益 [Revenue] [REVENUE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 収益タイプ | type | TYPE | RevenueType | ○ | 収益種別 |
| 金額 | amount | AMOUNT | MONEY | ○ | 収益金額 |
| 通貨 | currency | CURRENCY | Currency | ○ | 通貨種別 |
| 発生日 | incurredDate | INCURRED_DATE | DATE | ○ | 収益発生日 |
| 請求日 | billingDate | BILLING_DATE | DATE |  | 請求予定日 |
| ステータス | status | STATUS | RevenueStatus | ○ | 収益状態 |
| 説明 | description | DESCRIPTION | STRING_500 |  | 収益説明 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

#### 集約ルート
- 収益が集約ルート

### コスト [Cost] [COST]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| コストタイプ | type | TYPE | CostType | ○ | コスト種別 |
| 金額 | amount | AMOUNT | MONEY | ○ | コスト金額 |
| 通貨 | currency | CURRENCY | Currency | ○ | 通貨種別 |
| 発生日 | incurredDate | INCURRED_DATE | DATE | ○ | コスト発生日 |
| カテゴリ | category | CATEGORY | CostCategory | ○ | コスト分類 |
| 説明 | description | DESCRIPTION | STRING_500 |  | コスト説明 |
| 承認者ID | approvedById | APPROVED_BY_ID | UUID |  | 承認者 |
| 承認日 | approvedAt | APPROVED_AT | TIMESTAMP |  | 承認日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

### 請求 [Invoice] [INVOICE]

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|----|----- |------|
| ID | id | ID | UUID | ○ | 一意識別子 |
| 請求番号 | invoiceNumber | INVOICE_NUMBER | STRING_50 | ○ | 請求書番号 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| クライアントID | clientId | CLIENT_ID | UUID | ○ | 請求先クライアント |
| 請求金額 | amount | AMOUNT | MONEY | ○ | 請求金額 |
| 通貨 | currency | CURRENCY | Currency | ○ | 通貨種別 |
| 請求日 | invoiceDate | INVOICE_DATE | DATE | ○ | 請求日 |
| 支払期限 | dueDate | DUE_DATE | DATE | ○ | 支払期限 |
| ステータス | status | STATUS | InvoiceStatus | ○ | 請求状態 |
| 支払日 | paidAt | PAID_AT | TIMESTAMP |  | 支払日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | 更新日時 |

## 値オブジェクト（Value Objects）

### 収益タイプ [RevenueType] [REVENUE_TYPE]

- **タイプ** [type] [TYPE]: ENUM('service', 'product', 'license', 'support')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 収益ステータス [RevenueStatus] [REVENUE_STATUS]

- **ステータス** [status] [STATUS]: ENUM('projected', 'confirmed', 'invoiced', 'collected')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### コストタイプ [CostType] [COST_TYPE]

- **タイプ** [type] [TYPE]: ENUM('labor', 'material', 'travel', 'overhead')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### コストカテゴリ [CostCategory] [COST_CATEGORY]

- **カテゴリ** [category] [CATEGORY]: ENUM('direct', 'indirect', 'administrative')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

### 通貨 [Currency] [CURRENCY]

- **通貨コード** [code] [CODE]: STRING_3
- **通貨名** [name] [NAME]: STRING_50
- **記号** [symbol] [SYMBOL]: STRING_5

### 請求ステータス [InvoiceStatus] [INVOICE_STATUS]

- **ステータス** [status] [STATUS]: ENUM('draft', 'sent', 'overdue', 'paid', 'cancelled')
- **表示名** [displayName] [DISPLAY_NAME]: STRING_20

## 集約（Aggregates）

### 財務集約 [FinanceAggregate] [FINANCE_AGGREGATE]

#### 集約ルート
- Revenue

#### 含まれるエンティティ
- Revenue
- Cost
- Invoice

#### ビジネスルール
- 収益は発生主義で計上
- コストは実績ベースで管理
- 請求は月次または成果物単位`
  }
];

async function createAllServices() {
  console.log('Creating all 7 services...');
  
  try {
    // Clear existing services
    await parasolDb.service.deleteMany({});
    console.log('Cleared existing services');
    
    const services = [];
    for (const serviceDef of serviceDefinitions) {
      const service = await parasolDb.service.create({
        data: {
          name: serviceDef.name,
          displayName: serviceDef.displayName,
          description: serviceDef.description,
          serviceDescription: serviceDef.serviceDescription,
          domainLanguageDefinition: serviceDef.domainLanguageDefinition,
          apiSpecificationDefinition: '# API仕様\n\n実装時に定義',
          databaseDesignDefinition: '# DB設計\n\n既存スキーマ参照',
          // 旧形式（後方互換性のため）
          domainLanguage: JSON.stringify({}),
          apiSpecification: JSON.stringify({}),
          dbSchema: JSON.stringify({})
        }
      });
      services.push(service);
      console.log(`✓ Created service: ${service.displayName}`);
    }
    
    console.log(`\n🎉 Successfully created all ${services.length} services!`);
    
    // Show summary
    console.log('\n📋 Created services:');
    services.forEach((service, index) => {
      console.log(`  ${index + 1}. ${service.displayName} (${service.name})`);
    });
    
    return services;
  } catch (error) {
    console.error('❌ Error creating services:', error);
    throw error;
  } finally {
    await parasolDb.$disconnect();
  }
}

// Run the function
createAllServices()
  .then(() => {
    console.log('\n✨ Complete services seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Complete services seed failed:', error);
    process.exit(1);
  });