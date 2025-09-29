/**
 * 既存のドメイン言語定義を新仕様（v1.2.0）に更新するスクリプト
 * 
 * 更新内容:
 * 1. エンティティ属性にValue Object関連を追加
 * 2. 集約定義に含まれる値オブジェクトを明記
 * 3. リレーションシップの明示的な定義
 * 4. DDDパターンの強化
 */

import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const prisma = new ParasolPrismaClient()

/**
 * セキュアアクセスサービスのドメイン言語を新仕様に更新
 */
function generateSecureAccessDomainLanguage(): string {
  return `# パラソルドメイン言語: 認証・アクセス制御ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
組織のセキュリティを保証し、適切なアクセス制御を実現するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式（RFC5322準拠）
PASSWORD_HASH: ハッシュ化されたパスワード
TIMESTAMP: 日時（ISO8601形式）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
組織タイプ: 組織の種別 (基本型: ENUM)
  - consulting_firm: コンサルティングファーム
  - client: クライアント企業
  - partner: パートナー企業

ロールタイプ: システムロールの種別 (基本型: ENUM)
  - Executive: エグゼクティブ
  - PM: プロジェクトマネージャー
  - Consultant: コンサルタント
  - Client: クライアント
  - Admin: システム管理者
\`\`\`

## エンティティ（Entities）

### 組織 [Organization] [ORGANIZATION]
コンサルティングファームまたはクライアント企業を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 組織の一意識別子 |
| 組織名 | name | NAME | STRING_100 | ○ | 組織の正式名称 |
| 組織タイプ | type | TYPE | 組織タイプ | ○ | 組織の種別 |
| 業界 | industry | INDUSTRY | STRING_50 | - | 所属業界 |
| 説明 | description | DESCRIPTION | TEXT | - | 組織の詳細説明 |
| ウェブサイト | website | WEBSITE | URL [Url] [URL]（値オブジェクト） | - | 組織の公式サイト |
| メールアドレス | email | EMAIL | Email [Email] [EMAIL]（値オブジェクト） | ○ | 組織の代表メールアドレス |
| 電話番号 | phone | PHONE | PhoneNumber [PhoneNumber] [PHONE_NUMBER]（値オブジェクト） | - | 組織の代表電話番号 |
| 住所 | address | ADDRESS | Address [Address] [ADDRESS]（値オブジェクト） | - | 組織の所在地 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 組織名は一意である必要がある
- コンサルティングファームは複数のクライアント組織と関連を持つ
- 組織の削除時は関連するユーザーの扱いを決定する必要がある

#### ドメインイベント
- 組織登録済み [OrganizationRegistered] [ORGANIZATION_REGISTERED]：新規組織が登録された時
- 組織情報更新済み [OrganizationUpdated] [ORGANIZATION_UPDATED]：組織情報が更新された時
- 組織無効化済み [OrganizationDeactivated] [ORGANIZATION_DEACTIVATED]：組織が無効化された時

#### 集約ルート
OrganizationAggregate集約のルートエンティティ

### ユーザー [User] [USER]
システムを利用する個人を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | ユーザーの一意識別子 |
| メールアドレス | email | EMAIL | Email [Email] [EMAIL]（値オブジェクト） | ○ | ログイン用メールアドレス |
| 氏名 | name | NAME | PersonName [PersonName] [PERSON_NAME]（値オブジェクト） | ○ | ユーザーの氏名 |
| パスワード | password | PASSWORD | Password [Password] [PASSWORD]（値オブジェクト） | ○ | ハッシュ化されたパスワード |
| 組織ID | organizationId | ORGANIZATION_ID | UUID | ○ | 所属組織の参照 |
| ロールID | roleId | ROLE_ID | UUID | ○ | 割り当てられたロール |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | アカウントの有効/無効 |
| 最終ログイン日時 | lastLogin | LAST_LOGIN | TIMESTAMP | - | 最後にログインした日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- メールアドレスはシステム全体で一意
- パスワードは暗号化して保存
- 1ユーザーは1つの組織に所属
- 1ユーザーは1つのロールを持つ
- 非アクティブユーザーはログイン不可

#### ドメインイベント
- ユーザー登録済み [UserRegistered] [USER_REGISTERED]：新規ユーザーが登録された時
- ログイン成功 [UserLoggedIn] [USER_LOGGED_IN]：ユーザーがログインに成功した時
- パスワード変更済み [PasswordChanged] [PASSWORD_CHANGED]：パスワードが変更された時
- ユーザー無効化済み [UserDeactivated] [USER_DEACTIVATED]：ユーザーが無効化された時

### ロール [Role] [ROLE]
ユーザーの権限セットを定義するエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | ロールの一意識別子 |
| ロール名 | name | NAME | ロールタイプ | ○ | ロールの名称 |
| 説明 | description | DESCRIPTION | TEXT | - | ロールの詳細説明 |
| システムロールフラグ | isSystem | IS_SYSTEM | BOOLEAN | ○ | システム定義ロールかどうか |
| 権限セット | permissions | PERMISSIONS | PermissionSet [PermissionSet] [PERMISSION_SET]（値オブジェクト） | ○ | このロールが持つ権限の集合 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- システムロールは編集・削除不可
- ロール名は一意
- 最低1つの権限を持つ必要がある

### セッション [Session] [SESSION]
ユーザーのログインセッションを管理するエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | セッションの一意識別子 |
| ユーザーID | userId | USER_ID | UUID | ○ | セッションを保持するユーザー |
| トークン | token | TOKEN | SessionToken [SessionToken] [SESSION_TOKEN]（値オブジェクト） | ○ | セッショントークン |
| IPアドレス | ipAddress | IP_ADDRESS | IpAddress [IpAddress] [IP_ADDRESS]（値オブジェクト） | ○ | 接続元IPアドレス |
| ユーザーエージェント | userAgent | USER_AGENT | STRING_255 | - | ブラウザ情報 |
| 有効期限 | expiresAt | EXPIRES_AT | TIMESTAMP | ○ | セッションの有効期限 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | セッション作成日時 |

#### ビジネスルール
- 有効期限切れのセッションは無効
- 同一ユーザーの複数セッションを許可
- ログアウト時はセッションを削除

## 値オブジェクト（Value Objects）

### メールアドレス [Email] [EMAIL]
- **値** [value] [VALUE]: STRING_255
- **ビジネスルール**
  - RFC5322準拠の形式
  - 小文字に正規化して保存

### パスワード [Password] [PASSWORD]
- **ハッシュ値** [hash] [HASH]: PASSWORD_HASH
- **ビジネスルール**
  - bcryptでハッシュ化
  - 8文字以上
  - 大文字・小文字・数字を含む

### 氏名 [PersonName] [PERSON_NAME]
- **姓** [lastName] [LAST_NAME]: STRING_50
- **名** [firstName] [FIRST_NAME]: STRING_50
- **フルネーム** [fullName] [FULL_NAME]: STRING_100
- **ビジネスルール**
  - 姓・名は必須
  - フルネームは姓名を結合して生成

### 電話番号 [PhoneNumber] [PHONE_NUMBER]
- **番号** [number] [NUMBER]: STRING_20
- **ビジネスルール**
  - E.164形式に正規化
  - 国番号を含む

### 住所 [Address] [ADDRESS]
- **郵便番号** [postalCode] [POSTAL_CODE]: STRING_20
- **都道府県** [prefecture] [PREFECTURE]: STRING_50
- **市区町村** [city] [CITY]: STRING_100
- **番地** [street] [STREET]: STRING_255
- **建物名** [building] [BUILDING]: STRING_100
- **ビジネスルール**
  - 郵便番号は7桁（ハイフンなし）
  - 必須項目：郵便番号、都道府県、市区町村、番地

### URL [Url] [URL]
- **値** [value] [VALUE]: STRING_255
- **ビジネスルール**
  - RFC3986準拠
  - HTTPSを推奨

### セッショントークン [SessionToken] [SESSION_TOKEN]
- **値** [value] [VALUE]: STRING_255
- **ビジネスルール**
  - 256ビット以上のランダム値
  - Base64エンコード

### IPアドレス [IpAddress] [IP_ADDRESS]
- **値** [value] [VALUE]: STRING_50
- **ビジネスルール**
  - IPv4またはIPv6形式
  - 正規化して保存

### 権限セット [PermissionSet] [PERMISSION_SET]
- **権限リスト** [permissions] [PERMISSIONS]: JSON
- **ビジネスルール**
  - 権限コードの配列として保存
  - 重複を排除

## 集約（Aggregates）

### 組織集約 [OrganizationAggregate] [ORGANIZATION_AGGREGATE]
- **集約ルート**: 組織 [Organization]
- **含まれるエンティティ**: 
  - なし（将来的に部門、チーム等を追加予定）
- **含まれる値オブジェクト**:
  - メールアドレス [Email]：組織の代表メールアドレス
  - 電話番号 [PhoneNumber]：組織の代表電話番号
  - 住所 [Address]：組織の所在地
  - URL [Url]：組織のウェブサイト
- **トランザクション境界**: 組織情報の更新は単一トランザクションで処理
- **不変条件**: 
  - 組織名は一意である
  - 組織タイプは変更不可
- **外部参照ルール**:
  - 集約外からは組織IDのみで参照
  - 組織情報の直接参照は禁止

### ユーザー集約 [UserAggregate] [USER_AGGREGATE]
- **集約ルート**: ユーザー [User]
- **含まれるエンティティ**: 
  - セッション [Session]：ユーザーのログインセッション（0..*）
- **含まれる値オブジェクト**:
  - メールアドレス [Email]：ログイン用メールアドレス
  - パスワード [Password]：認証用パスワード
  - 氏名 [PersonName]：ユーザーの氏名
  - セッショントークン [SessionToken]：セッションで使用
  - IPアドレス [IpAddress]：セッションで使用
- **トランザクション境界**: ユーザーとセッションは同一トランザクションで処理
- **不変条件**: 
  - メールアドレスは一意である
  - アクティブなセッションは有効期限内
  - ユーザー削除時はセッションも削除
- **外部参照ルール**:
  - 集約外からはユーザーIDのみで参照
  - セッションへの直接アクセスは禁止

## ドメインサービス

### 認証サービス [AuthenticationService] [AUTHENTICATION_SERVICE]
ユーザーの認証を担当するドメインサービス

#### 提供機能
- ユーザー認証 [authenticateUser] [AUTHENTICATE_USER]
  - 目的: メールアドレスとパスワードでユーザーを認証
  - 入力: メールアドレス、パスワード
  - 出力: 認証結果、セッショントークン
  - 制約: アクティブユーザーのみ認証可能

- セッション検証 [validateSession] [VALIDATE_SESSION]
  - 目的: セッショントークンの有効性を検証
  - 入力: セッショントークン
  - 出力: 検証結果、ユーザー情報
  - 制約: 有効期限内のセッションのみ有効

### アクセス制御サービス [AccessControlService] [ACCESS_CONTROL_SERVICE]
リソースへのアクセス権限を制御するドメインサービス

#### 提供機能
- 権限チェック [checkPermission] [CHECK_PERMISSION]
  - 目的: ユーザーが特定の操作を実行できるか確認
  - 入力: ユーザーID、リソース、操作
  - 出力: 許可/拒否
  - 制約: ロールに基づく権限チェック

## ドメインイベント

### ユーザー登録済み [UserRegistered] [USER_REGISTERED]
- **発生タイミング**: 新規ユーザーが登録された時
- **ペイロード**: 
  - ユーザーID [userId] [USER_ID]: UUID
  - メールアドレス [email] [EMAIL]: Email
  - 組織ID [organizationId] [ORGANIZATION_ID]: UUID
  - 登録日時 [registeredAt] [REGISTERED_AT]: TIMESTAMP

### ログイン成功 [UserLoggedIn] [USER_LOGGED_IN]
- **発生タイミング**: ユーザーがログインに成功した時
- **ペイロード**: 
  - ユーザーID [userId] [USER_ID]: UUID
  - セッションID [sessionId] [SESSION_ID]: UUID
  - IPアドレス [ipAddress] [IP_ADDRESS]: IpAddress
  - ログイン日時 [loggedInAt] [LOGGED_IN_AT]: TIMESTAMP

## ビジネスルール

### 認証ルール
1. **パスワードポリシー**: 8文字以上、大文字・小文字・数字を含む
   - 適用エンティティ: ユーザー [User]
2. **セッション有効期限**: 最終アクセスから24時間
   - 適用エンティティ: セッション [Session]
3. **ログイン試行制限**: 5回失敗で一時的にロック
   - 適用エンティティ: ユーザー [User]

### アクセス制御ルール
1. **組織間アクセス制限**: ユーザーは所属組織のリソースのみアクセス可能
   - 適用集約: ユーザー集約 [UserAggregate]
2. **ロールベースアクセス**: 操作はロールに割り当てられた権限に基づく
   - 適用エンティティ: ロール [Role]

### エラーパターン
- 1001: 認証失敗（メールアドレスまたはパスワードが不正）
- 1002: アカウント無効（非アクティブユーザー）
- 1003: セッション期限切れ
- 2001: 必須項目未入力
- 2002: メールアドレス形式不正
- 3001: データベース接続エラー

## リポジトリインターフェース

### 組織リポジトリ [OrganizationRepository] [ORGANIZATION_REPOSITORY]
集約: 組織集約 [OrganizationAggregate]

基本操作:
- findById(id: UUID): 組織 [Organization]
- save(organization: 組織): void
- delete(id: UUID): void

検索操作:
- findByName(name: STRING_100): 組織
- findByType(type: 組織タイプ): 組織[]
- findAll(): 組織[]

### ユーザーリポジトリ [UserRepository] [USER_REPOSITORY]
集約: ユーザー集約 [UserAggregate]

基本操作:
- findById(id: UUID): ユーザー [User]
- save(user: ユーザー): void
- delete(id: UUID): void

検索操作:
- findByEmail(email: Email): ユーザー
- findByOrganizationId(organizationId: UUID): ユーザー[]
- findActiveUsers(): ユーザー[]

## リレーションシップ一覧

### エンティティ間の関連
- 組織 [Organization] → ユーザー [User]（1..*）：組織は複数のユーザーを持つ
- ユーザー [User] → セッション [Session]（1..*）：ユーザーは複数のセッションを持つ
- ユーザー [User] → ロール [Role]（*.1）：ユーザーは1つのロールを持つ
- ユーザー [User] → 組織 [Organization]（*.1）：ユーザーは1つの組織に所属

### 値オブジェクトの使用
- 組織 [Organization] 使用 Email [Email]：代表メールアドレスとして
- 組織 [Organization] 使用 PhoneNumber [PhoneNumber]：代表電話番号として
- 組織 [Organization] 使用 Address [Address]：所在地として
- 組織 [Organization] 使用 Url [URL]：ウェブサイトとして
- ユーザー [User] 使用 Email [Email]：ログイン用メールアドレスとして
- ユーザー [User] 使用 Password [Password]：認証用パスワードとして
- ユーザー [User] 使用 PersonName [PersonName]：氏名として
- セッション [Session] 使用 SessionToken [SessionToken]：認証トークンとして
- セッション [Session] 使用 IpAddress [IpAddress]：接続元情報として
- ロール [Role] 使用 PermissionSet [PermissionSet]：権限管理として

### 集約境界
- 組織集約 [OrganizationAggregate]：組織 [Organization]
- ユーザー集約 [UserAggregate]：ユーザー [User]、セッション [Session]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * プロジェクト成功支援サービスのドメイン言語を新仕様に更新
 */
function generateProjectSuccessDomainLanguage(): string {
  return `# パラソルドメイン言語: プロジェクト管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
コンサルティングプロジェクトの立ち上げから完了まで、全ライフサイクルを管理し成功に導くドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
プロジェクトステータス: プロジェクトの状態 (基本型: ENUM)
  - planning: 計画中
  - active: 進行中
  - completed: 完了
  - onhold: 保留
  - cancelled: キャンセル

タスクステータス: タスクの状態 (基本型: ENUM)
  - todo: 未着手
  - in_progress: 進行中
  - review: レビュー中
  - done: 完了
  - cancelled: キャンセル

優先度: 作業の優先度 (基本型: ENUM)
  - critical: 最重要
  - high: 高
  - medium: 中
  - low: 低

マイルストーンタイプ: マイルストーンの種類 (基本型: ENUM)
  - kickoff: キックオフ
  - phase_gate: フェーズゲート
  - deliverable: 成果物納品
  - review: レビュー
  - closure: プロジェクト完了
\`\`\`

## エンティティ（Entities）

### プロジェクト [Project] [PROJECT]
クライアントの課題解決のための活動単位を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | プロジェクトの一意識別子 |
| プロジェクトコード | code | CODE | ProjectCode [ProjectCode] [PROJECT_CODE]（値オブジェクト） | ○ | プロジェクト識別コード |
| プロジェクト名 | name | NAME | STRING_255 | ○ | プロジェクトの正式名称 |
| 説明 | description | DESCRIPTION | MARKDOWN | - | プロジェクトの詳細説明 |
| クライアント組織ID | clientId | CLIENT_ID | UUID | ○ | クライアント組織への参照 |
| ステータス | status | STATUS | プロジェクトステータス | ○ | 現在のプロジェクト状態 |
| 開始日 | startDate | START_DATE | DATE | ○ | プロジェクト開始日 |
| 終了予定日 | endDate | END_DATE | DATE | ○ | プロジェクト終了予定日 |
| 実終了日 | actualEndDate | ACTUAL_END_DATE | DATE | - | 実際の終了日 |
| 予算 | budget | BUDGET | Money [Money] [MONEY]（値オブジェクト） | ○ | プロジェクト予算 |
| 進捗率 | progress | PROGRESS | ProgressRate [ProgressRate] [PROGRESS_RATE]（値オブジェクト） | ○ | 全体の進捗率 |
| 目標 | objectives | OBJECTIVES | TEXT | ○ | プロジェクトの目標 |
| スコープ | scope | SCOPE | TEXT | ○ | プロジェクトの範囲 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- プロジェクトコードは一意である
- 終了予定日は開始日より後
- プロジェクトには最低1名のPMが必要
- ステータスがcompletedの場合、実終了日は必須
- 進捗率は配下のタスクから自動計算

#### ドメインイベント
- プロジェクト開始済み [ProjectStarted] [PROJECT_STARTED]：プロジェクトが開始された時
- マイルストーン達成済み [MilestoneAchieved] [MILESTONE_ACHIEVED]：マイルストーンが達成された時
- プロジェクト完了済み [ProjectCompleted] [PROJECT_COMPLETED]：プロジェクトが完了した時
- プロジェクト保留済み [ProjectOnHold] [PROJECT_ON_HOLD]：プロジェクトが保留になった時

#### 集約ルート
ProjectAggregate集約のルートエンティティ

### タスク [Task] [TASK]
プロジェクトを構成する作業単位を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | タスクの一意識別子 |
| タスク名 | title | TITLE | STRING_255 | ○ | タスクのタイトル |
| 説明 | description | DESCRIPTION | MARKDOWN | - | タスクの詳細説明 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 所属プロジェクトへの参照 |
| ステータス | status | STATUS | タスクステータス | ○ | 現在のタスク状態 |
| 優先度 | priority | PRIORITY | 優先度 | ○ | タスクの優先度 |
| 担当者ID | assigneeId | ASSIGNEE_ID | UUID | - | タスク担当者への参照 |
| 開始予定日 | plannedStartDate | PLANNED_START_DATE | DATE | - | タスク開始予定日 |
| 完了予定日 | plannedEndDate | PLANNED_END_DATE | DATE | ○ | タスク完了予定日 |
| 実開始日 | actualStartDate | ACTUAL_START_DATE | DATE | - | 実際の開始日 |
| 実完了日 | actualEndDate | ACTUAL_END_DATE | DATE | - | 実際の完了日 |
| 見積時間 | estimatedHours | ESTIMATED_HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | ○ | 見積作業時間 |
| 実績時間 | actualHours | ACTUAL_HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | - | 実際の作業時間 |
| 進捗率 | progress | PROGRESS | ProgressRate [ProgressRate] [PROGRESS_RATE]（値オブジェクト） | ○ | タスクの進捗率 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- タスクは必ずプロジェクトに紐づく
- 完了予定日は開始予定日より後
- ステータスがdoneの場合、実完了日は必須
- 進捗率は0-100%の範囲

#### ドメインイベント
- タスク割当済み [TaskAssigned] [TASK_ASSIGNED]：タスクが担当者に割り当てられた時
- タスク開始済み [TaskStarted] [TASK_STARTED]：タスクが開始された時
- タスク完了済み [TaskCompleted] [TASK_COMPLETED]：タスクが完了した時

### マイルストーン [Milestone] [MILESTONE]
プロジェクトの重要な節目を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | マイルストーンの一意識別子 |
| マイルストーン名 | name | NAME | STRING_255 | ○ | マイルストーンの名称 |
| 説明 | description | DESCRIPTION | TEXT | - | マイルストーンの説明 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 所属プロジェクトへの参照 |
| タイプ | type | TYPE | マイルストーンタイプ | ○ | マイルストーンの種類 |
| 予定日 | dueDate | DUE_DATE | DATE | ○ | マイルストーン予定日 |
| 達成日 | achievedDate | ACHIEVED_DATE | DATE | - | 実際の達成日 |
| 達成フラグ | isAchieved | IS_ACHIEVED | BOOLEAN | ○ | 達成済みかどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- マイルストーンは必ずプロジェクトに紐づく
- 達成済みの場合、達成日は必須
- 重要成果物はマイルストーンに関連付け

### 成果物 [Deliverable] [DELIVERABLE]
プロジェクトで作成される具体的な成果を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 成果物の一意識別子 |
| 成果物名 | name | NAME | STRING_255 | ○ | 成果物の名称 |
| 説明 | description | DESCRIPTION | TEXT | - | 成果物の説明 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 所属プロジェクトへの参照 |
| タスクID | taskId | TASK_ID | UUID | - | 関連タスクへの参照 |
| マイルストーンID | milestoneId | MILESTONE_ID | UUID | - | 関連マイルストーンへの参照 |
| ファイルパス | filePath | FILE_PATH | FilePath [FilePath] [FILE_PATH]（値オブジェクト） | - | 成果物ファイルの保存先 |
| バージョン | version | VERSION | Version [Version] [VERSION]（値オブジェクト） | ○ | 成果物のバージョン |
| ステータス | status | STATUS | DeliverableStatus [DeliverableStatus] [DELIVERABLE_STATUS]（値オブジェクト） | ○ | 成果物の状態 |
| 提出日 | submittedDate | SUBMITTED_DATE | DATE | - | クライアントへの提出日 |
| 承認日 | approvedDate | APPROVED_DATE | DATE | - | クライアントによる承認日 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 成果物は必ずプロジェクトに紐づく
- バージョン管理を行う
- 承認済みの成果物は変更不可

## 値オブジェクト（Value Objects）

### プロジェクトコード [ProjectCode] [PROJECT_CODE]
- **値** [value] [VALUE]: STRING_20
- **ビジネスルール**
  - 形式: PRJ-YYYY-NNNN（例: PRJ-2024-0001）
  - 一意性を保証

### 金額 [Money] [MONEY]
- **金額** [amount] [AMOUNT]: DECIMAL
- **通貨** [currency] [CURRENCY]: STRING_20
- **ビジネスルール**
  - 0以上の値
  - 通貨コードはISO 4217準拠

### 進捗率 [ProgressRate] [PROGRESS_RATE]
- **値** [value] [VALUE]: PERCENTAGE
- **ビジネスルール**
  - 0-100の範囲
  - 整数値で管理

### 作業時間 [WorkHours] [WORK_HOURS]
- **時間** [hours] [HOURS]: DECIMAL
- **ビジネスルール**
  - 0以上の値
  - 0.25時間（15分）単位

### ファイルパス [FilePath] [FILE_PATH]
- **パス** [path] [PATH]: STRING_255
- **ファイル名** [fileName] [FILE_NAME]: STRING_100
- **拡張子** [extension] [EXTENSION]: STRING_20
- **ビジネスルール**
  - 有効なファイルパス形式
  - 許可された拡張子のみ

### バージョン [Version] [VERSION]
- **メジャー** [major] [MAJOR]: INTEGER
- **マイナー** [minor] [MINOR]: INTEGER
- **パッチ** [patch] [PATCH]: INTEGER
- **ビジネスルール**
  - セマンティックバージョニング準拠
  - 1.0.0から開始

### 成果物ステータス [DeliverableStatus] [DELIVERABLE_STATUS]
- **状態** [status] [STATUS]: ENUM
- **ビジネスルール**
  - draft（ドラフト）
  - review（レビュー中）
  - submitted（提出済み）
  - approved（承認済み）
  - rejected（却下）

## 集約（Aggregates）

### プロジェクト集約 [ProjectAggregate] [PROJECT_AGGREGATE]
- **集約ルート**: プロジェクト [Project]
- **含まれるエンティティ**: 
  - タスク [Task]：プロジェクトのタスク（0..*）
  - マイルストーン [Milestone]：プロジェクトのマイルストーン（0..*）
  - 成果物 [Deliverable]：プロジェクトの成果物（0..*）
- **含まれる値オブジェクト**:
  - プロジェクトコード [ProjectCode]：プロジェクトの識別コード
  - 金額 [Money]：予算で使用
  - 進捗率 [ProgressRate]：プロジェクトとタスクの進捗
  - 作業時間 [WorkHours]：タスクの見積・実績時間
  - ファイルパス [FilePath]：成果物の保存先
  - バージョン [Version]：成果物のバージョン管理
  - 成果物ステータス [DeliverableStatus]：成果物の状態管理
- **トランザクション境界**: プロジェクトと関連エンティティは同一トランザクションで処理
- **不変条件**: 
  - プロジェクトコードは一意である
  - プロジェクトの進捗率は配下タスクの加重平均
  - 削除時は関連するタスク、マイルストーン、成果物も削除
- **外部参照ルール**:
  - 集約外からはプロジェクトIDのみで参照
  - タスク、マイルストーン、成果物への直接アクセスは禁止

## ドメインサービス

### プロジェクト計画サービス [ProjectPlanningService] [PROJECT_PLANNING_SERVICE]
プロジェクトの計画策定を支援するドメインサービス

#### 提供機能
- WBS作成 [createWBS] [CREATE_WBS]
  - 目的: プロジェクトのWBS（作業分解構成）を作成
  - 入力: プロジェクトID、タスクテンプレート
  - 出力: 階層化されたタスク構造
  - 制約: プロジェクトがplanning状態

- スケジュール最適化 [optimizeSchedule] [OPTIMIZE_SCHEDULE]
  - 目的: リソースと制約を考慮してスケジュールを最適化
  - 入力: プロジェクトID、リソース情報、制約条件
  - 出力: 最適化されたスケジュール
  - 制約: タスクの依存関係を考慮

### 進捗管理サービス [ProgressManagementService] [PROGRESS_MANAGEMENT_SERVICE]
プロジェクトの進捗を管理するドメインサービス

#### 提供機能
- 進捗率計算 [calculateProgress] [CALCULATE_PROGRESS]
  - 目的: プロジェクト全体の進捗率を計算
  - 入力: プロジェクトID
  - 出力: 計算された進捗率
  - 制約: タスクの重み付けを考慮

- 遅延検知 [detectDelays] [DETECT_DELAYS]
  - 目的: スケジュール遅延を検知
  - 入力: プロジェクトID、基準日
  - 出力: 遅延タスクリスト
  - 制約: 予定日と実績を比較

## ドメインイベント

### プロジェクト開始済み [ProjectStarted] [PROJECT_STARTED]
- **発生タイミング**: プロジェクトのステータスがactiveになった時
- **ペイロード**: 
  - プロジェクトID [projectId] [PROJECT_ID]: UUID
  - 開始日 [startedDate] [STARTED_DATE]: DATE
  - PM情報 [pmInfo] [PM_INFO]: JSON

### マイルストーン達成済み [MilestoneAchieved] [MILESTONE_ACHIEVED]
- **発生タイミング**: マイルストーンが達成された時
- **ペイロード**: 
  - マイルストーンID [milestoneId] [MILESTONE_ID]: UUID
  - プロジェクトID [projectId] [PROJECT_ID]: UUID
  - 達成日 [achievedDate] [ACHIEVED_DATE]: DATE
  - 関連成果物 [deliverables] [DELIVERABLES]: UUID[]

### タスク完了済み [TaskCompleted] [TASK_COMPLETED]
- **発生タイミング**: タスクのステータスがdoneになった時
- **ペイロード**: 
  - タスクID [taskId] [TASK_ID]: UUID
  - プロジェクトID [projectId] [PROJECT_ID]: UUID
  - 完了日 [completedDate] [COMPLETED_DATE]: DATE
  - 実績時間 [actualHours] [ACTUAL_HOURS]: DECIMAL

## ビジネスルール

### プロジェクト管理ルール
1. **プロジェクトコード一意性**: プロジェクトコードは全体で一意
   - 適用エンティティ: プロジェクト [Project]
2. **PM必須ルール**: アクティブなプロジェクトには最低1名のPMが必要
   - 適用集約: プロジェクト集約 [ProjectAggregate]
3. **進捗計算ルール**: 親タスクの進捗は子タスクの加重平均
   - 適用エンティティ: タスク [Task]

### スケジュール管理ルール
1. **日付整合性**: 終了日は開始日より後
   - 適用エンティティ: プロジェクト [Project]、タスク [Task]
2. **マイルストーン順序**: マイルストーンは時系列順
   - 適用エンティティ: マイルストーン [Milestone]

### 成果物管理ルール
1. **バージョン管理**: 承認済み成果物の変更は新バージョンとして作成
   - 適用エンティティ: 成果物 [Deliverable]
2. **承認プロセス**: 成果物は必ずレビュープロセスを経る
   - 適用エンティティ: 成果物 [Deliverable]

### エラーパターン
- 1101: プロジェクトコード重複
- 1102: PM未割当でのプロジェクト開始
- 1103: 日付整合性違反
- 2101: 必須項目未入力
- 2102: 進捗率範囲外（0-100%）
- 3101: ファイルアップロード失敗

## リポジトリインターフェース

### プロジェクトリポジトリ [ProjectRepository] [PROJECT_REPOSITORY]
集約: プロジェクト集約 [ProjectAggregate]

基本操作:
- findById(id: UUID): プロジェクト [Project]
- save(project: プロジェクト): void
- delete(id: UUID): void

検索操作:
- findByCode(code: ProjectCode): プロジェクト
- findByClientId(clientId: UUID): プロジェクト[]
- findByStatus(status: プロジェクトステータス): プロジェクト[]
- findActiveProjects(): プロジェクト[]

## リレーションシップ一覧

### エンティティ間の関連
- プロジェクト [Project] *→ タスク [Task]（1..*）：プロジェクトは複数のタスクを持つ（集約内包含）
- プロジェクト [Project] *→ マイルストーン [Milestone]（1..*）：プロジェクトは複数のマイルストーンを持つ（集約内包含）
- プロジェクト [Project] *→ 成果物 [Deliverable]（0..*）：プロジェクトは複数の成果物を持つ（集約内包含）
- タスク [Task] → 成果物 [Deliverable]（1..*）：タスクは複数の成果物を生成
- マイルストーン [Milestone] → 成果物 [Deliverable]（1..*）：マイルストーンに成果物が関連

### 値オブジェクトの使用
- プロジェクト [Project] 使用 ProjectCode [ProjectCode]：識別コードとして
- プロジェクト [Project] 使用 Money [Money]：予算として
- プロジェクト [Project] 使用 ProgressRate [ProgressRate]：進捗率として
- タスク [Task] 使用 WorkHours [WorkHours]：見積・実績時間として
- タスク [Task] 使用 ProgressRate [ProgressRate]：進捗率として
- 成果物 [Deliverable] 使用 FilePath [FilePath]：ファイル保存先として
- 成果物 [Deliverable] 使用 Version [Version]：バージョン管理として
- 成果物 [Deliverable] 使用 DeliverableStatus [DeliverableStatus]：状態管理として

### 集約境界
- プロジェクト集約 [ProjectAggregate]：プロジェクト [Project]、タスク [Task]、マイルストーン [Milestone]、成果物 [Deliverable]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * タレント最適化サービスのドメイン言語を新仕様に更新
 */
function generateTalentOptimizationDomainLanguage(): string {
  return `# パラソルドメイン言語: リソース管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
コンサルティングファームの人的リソースを最適に配置し、チームの生産性を最大化するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
PERCENTAGE: パーセンテージ（0-100）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
メンバーロール: チーム内での役割 (基本型: ENUM)
  - leader: リーダー
  - member: メンバー
  - advisor: アドバイザー
  
スキルレベル: スキルの習熟度 (基本型: ENUM)  
  - beginner: 初級
  - intermediate: 中級
  - advanced: 上級
  - expert: エキスパート
  - master: マスター

スキルカテゴリ: スキルの分類 (基本型: ENUM)
  - technical: 技術スキル
  - business: ビジネススキル
  - management: マネジメントスキル
  - communication: コミュニケーションスキル
  - industry: 業界知識

稼働率ステータス: リソースの稼働状況 (基本型: ENUM)
  - available: 稼働可能
  - partially_allocated: 部分稼働
  - fully_allocated: フル稼働
  - overallocated: 過負荷
\`\`\`

## エンティティ（Entities）

### メンバー [Member] [MEMBER]
組織に所属するコンサルタントを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | メンバーの一意識別子 |
| 社員番号 | employeeNumber | EMPLOYEE_NUMBER | EmployeeNumber [EmployeeNumber] [EMPLOYEE_NUMBER]（値オブジェクト） | ○ | 社員識別番号 |
| 氏名 | name | NAME | PersonName [PersonName] [PERSON_NAME]（値オブジェクト） | ○ | メンバーの氏名 |
| メールアドレス | email | EMAIL | Email [Email] [EMAIL]（値オブジェクト） | ○ | 業務用メールアドレス |
| 職位 | position | POSITION | Position [Position] [POSITION]（値オブジェクト） | ○ | 組織内での職位 |
| 部門 | department | DEPARTMENT | STRING_100 | ○ | 所属部門 |
| 入社日 | joinDate | JOIN_DATE | DATE | ○ | 入社年月日 |
| 稼働率 | utilization | UTILIZATION | UtilizationRate [UtilizationRate] [UTILIZATION_RATE]（値オブジェクト） | ○ | 現在の稼働率 |
| ステータス | status | STATUS | 稼働率ステータス | ○ | 現在の稼働状況 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 在籍中かどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 社員番号は一意である
- メールアドレスは組織内で一意
- 稼働率は0-120%の範囲（一時的な過負荷を許容）
- 非アクティブメンバーはプロジェクトに新規アサイン不可

#### ドメインイベント
- メンバー登録済み [MemberRegistered] [MEMBER_REGISTERED]：新規メンバーが登録された時
- スキル習得済み [SkillAcquired] [SKILL_ACQUIRED]：メンバーが新しいスキルを習得した時
- メンバー退職済み [MemberRetired] [MEMBER_RETIRED]：メンバーが退職した時

#### 集約ルート
MemberAggregate集約のルートエンティティ

### スキル [Skill] [SKILL]
業務遂行に必要な能力を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | スキルの一意識別子 |
| スキル名 | name | NAME | STRING_100 | ○ | スキルの名称 |
| カテゴリ | category | CATEGORY | スキルカテゴリ | ○ | スキルの分類 |
| 説明 | description | DESCRIPTION | TEXT | - | スキルの詳細説明 |
| タグ | tags | TAGS | SkillTags [SkillTags] [SKILL_TAGS]（値オブジェクト） | - | 検索用タグ |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 有効なスキルかどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- スキル名とカテゴリの組み合わせは一意
- 非アクティブスキルは新規習得不可
- スキルレベルは5段階評価

#### 集約ルート
SkillAggregate集約のルートエンティティ

### メンバースキル [MemberSkill] [MEMBER_SKILL]
メンバーが保有するスキルと習熟度を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | メンバースキルの一意識別子 |
| メンバーID | memberId | MEMBER_ID | UUID | ○ | メンバーへの参照 |
| スキルID | skillId | SKILL_ID | UUID | ○ | スキルへの参照 |
| レベル | level | LEVEL | スキルレベル | ○ | スキルの習熟度 |
| 習得日 | acquiredDate | ACQUIRED_DATE | DATE | ○ | スキル習得日 |
| 最終評価日 | lastAssessedDate | LAST_ASSESSED_DATE | DATE | ○ | 最後に評価された日 |
| 証明書 | certifications | CERTIFICATIONS | Certifications [Certifications] [CERTIFICATIONS]（値オブジェクト） | - | 関連する資格・認定 |
| 経験年数 | yearsOfExperience | YEARS_OF_EXPERIENCE | DECIMAL | ○ | スキル経験年数 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- メンバーとスキルの組み合わせは一意
- レベルアップには評価プロセスが必要
- 定期的な再評価が必要（年1回）

### チーム [Team] [TEAM]
プロジェクトやタスクを遂行する組織単位を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | チームの一意識別子 |
| チーム名 | name | NAME | STRING_100 | ○ | チームの名称 |
| 説明 | description | DESCRIPTION | TEXT | - | チームの説明 |
| プロジェクトID | projectId | PROJECT_ID | UUID | - | 関連プロジェクトへの参照 |
| リーダーID | leaderId | LEADER_ID | UUID | ○ | チームリーダーへの参照 |
| 開始日 | startDate | START_DATE | DATE | ○ | チーム編成開始日 |
| 終了日 | endDate | END_DATE | DATE | - | チーム解散予定日 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 活動中かどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- チームには最低1名のリーダーが必要
- アクティブなチームメンバーは2名以上
- チーム解散時は全メンバーのアサインを解除

### チームメンバー [TeamMember] [TEAM_MEMBER]
チームへのメンバー配属を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | チームメンバーの一意識別子 |
| チームID | teamId | TEAM_ID | UUID | ○ | 所属チームへの参照 |
| メンバーID | memberId | MEMBER_ID | UUID | ○ | メンバーへの参照 |
| ロール | role | ROLE | メンバーロール | ○ | チーム内での役割 |
| アサイン率 | allocationRate | ALLOCATION_RATE | AllocationRate [AllocationRate] [ALLOCATION_RATE]（値オブジェクト） | ○ | このチームへの稼働配分 |
| 開始日 | startDate | START_DATE | DATE | ○ | アサイン開始日 |
| 終了日 | endDate | END_DATE | DATE | - | アサイン終了予定日 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | アサイン中かどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 同一メンバーの合計アサイン率は120%以下
- チームとメンバーの組み合わせは一意（期間重複不可）
- リーダーロールは各チームに1名のみ

## 値オブジェクト（Value Objects）

### 社員番号 [EmployeeNumber] [EMPLOYEE_NUMBER]
- **値** [value] [VALUE]: STRING_20
- **ビジネスルール**
  - 形式: EMP-NNNNNN（例: EMP-000123）
  - 一意性を保証

### 氏名 [PersonName] [PERSON_NAME]
- **姓** [lastName] [LAST_NAME]: STRING_50
- **名** [firstName] [FIRST_NAME]: STRING_50
- **フルネーム** [fullName] [FULL_NAME]: STRING_100
- **ビジネスルール**
  - 姓・名は必須
  - フルネームは自動生成

### メールアドレス [Email] [EMAIL]
- **値** [value] [VALUE]: STRING_255
- **ビジネスルール**
  - 会社ドメインのメールアドレス
  - 小文字に正規化

### 職位 [Position] [POSITION]
- **グレード** [grade] [GRADE]: STRING_20
- **タイトル** [title] [TITLE]: STRING_50
- **ビジネスルール**
  - グレードは組織の職位体系に準拠
  - タイトルは日本語・英語併記

### 稼働率 [UtilizationRate] [UTILIZATION_RATE]
- **値** [value] [VALUE]: PERCENTAGE
- **ビジネスルール**
  - 0-120%の範囲
  - 5%単位で管理

### アサイン率 [AllocationRate] [ALLOCATION_RATE]
- **値** [value] [VALUE]: PERCENTAGE
- **ビジネスルール**
  - 0-100%の範囲
  - 5%単位で管理

### スキルタグ [SkillTags] [SKILL_TAGS]
- **タグリスト** [tags] [TAGS]: JSON
- **ビジネスルール**
  - 最大10個まで
  - 小文字英数字とハイフンのみ

### 資格認定 [Certifications] [CERTIFICATIONS]
- **認定リスト** [certifications] [CERTIFICATIONS]: JSON
- **ビジネスルール**
  - 認定名、発行機関、取得日を含む
  - 有効期限がある場合は期限日も管理

## 集約（Aggregates）

### メンバー集約 [MemberAggregate] [MEMBER_AGGREGATE]
- **集約ルート**: メンバー [Member]
- **含まれるエンティティ**: 
  - メンバースキル [MemberSkill]：メンバーが保有するスキル（0..*）
- **含まれる値オブジェクト**:
  - 社員番号 [EmployeeNumber]：社員の識別番号
  - 氏名 [PersonName]：メンバーの氏名
  - メールアドレス [Email]：業務用メールアドレス
  - 職位 [Position]：組織内での職位
  - 稼働率 [UtilizationRate]：現在の稼働率
  - 資格認定 [Certifications]：保有資格情報
- **トランザクション境界**: メンバーとメンバースキルは同一トランザクションで処理
- **不変条件**: 
  - 社員番号は一意である
  - メールアドレスは組織内で一意
  - 稼働率は配下のチームアサインから自動計算
- **外部参照ルール**:
  - 集約外からはメンバーIDのみで参照
  - メンバースキルへの直接アクセスは禁止

### スキル集約 [SkillAggregate] [SKILL_AGGREGATE]
- **集約ルート**: スキル [Skill]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - スキルタグ [SkillTags]：検索用タグ
- **トランザクション境界**: スキル単体で処理
- **不変条件**: 
  - スキル名とカテゴリの組み合わせは一意
  - カテゴリは定義された値のみ
- **外部参照ルール**:
  - 集約外からはスキルIDのみで参照

### チーム集約 [TeamAggregate] [TEAM_AGGREGATE]
- **集約ルート**: チーム [Team]
- **含まれるエンティティ**: 
  - チームメンバー [TeamMember]：チームに所属するメンバー（1..*）
- **含まれる値オブジェクト**:
  - アサイン率 [AllocationRate]：メンバーの稼働配分
- **トランザクション境界**: チームとチームメンバーは同一トランザクションで処理
- **不変条件**: 
  - チームには最低1名のリーダーが必要
  - アクティブなチームは2名以上のメンバーが必要
  - チーム削除時は全メンバーのアサインも削除
- **外部参照ルール**:
  - 集約外からはチームIDのみで参照
  - チームメンバーへの直接アクセスは禁止

## ドメインサービス

### スキルマッチングサービス [SkillMatchingService] [SKILL_MATCHING_SERVICE]
プロジェクトに最適なメンバーを提案するドメインサービス

#### 提供機能
- 候補者検索 [findCandidates] [FIND_CANDIDATES]
  - 目的: 要求スキルにマッチするメンバーを検索
  - 入力: 必須スキルセット、希望スキルセット、期間
  - 出力: マッチ度付き候補者リスト
  - 制約: 稼働可能なメンバーのみ対象

- マッチ度計算 [calculateMatchScore] [CALCULATE_MATCH_SCORE]
  - 目的: メンバーとプロジェクト要求のマッチ度を計算
  - 入力: メンバーID、要求スキルセット
  - 出力: マッチ度スコア（0-100）
  - 制約: スキルレベルと経験年数を考慮

### チーム編成サービス [TeamFormationService] [TEAM_FORMATION_SERVICE]
最適なチーム編成を支援するドメインサービス

#### 提供機能
- チーム提案 [proposeTeam] [PROPOSE_TEAM]
  - 目的: プロジェクト要件に基づくチーム編成案を作成
  - 入力: プロジェクト要件、必要人数、期間
  - 出力: チーム編成案
  - 制約: スキルバランスと稼働率を考慮

- 稼働率最適化 [optimizeUtilization] [OPTIMIZE_UTILIZATION]
  - 目的: チーム全体の稼働率を最適化
  - 入力: チームID、目標稼働率
  - 出力: 最適化されたアサイン案
  - 制約: 既存コミットメントを優先

## ドメインイベント

### メンバー登録済み [MemberRegistered] [MEMBER_REGISTERED]
- **発生タイミング**: 新規メンバーが組織に加入した時
- **ペイロード**: 
  - メンバーID [memberId] [MEMBER_ID]: UUID
  - 社員番号 [employeeNumber] [EMPLOYEE_NUMBER]: EmployeeNumber
  - 入社日 [joinDate] [JOIN_DATE]: DATE

### スキル習得済み [SkillAcquired] [SKILL_ACQUIRED]
- **発生タイミング**: メンバーが新しいスキルを習得した時
- **ペイロード**: 
  - メンバーID [memberId] [MEMBER_ID]: UUID
  - スキルID [skillId] [SKILL_ID]: UUID
  - レベル [level] [LEVEL]: スキルレベル
  - 習得日 [acquiredDate] [ACQUIRED_DATE]: DATE

### チーム編成済み [TeamFormed] [TEAM_FORMED]
- **発生タイミング**: 新しいチームが編成された時
- **ペイロード**: 
  - チームID [teamId] [TEAM_ID]: UUID
  - プロジェクトID [projectId] [PROJECT_ID]: UUID
  - メンバーリスト [members] [MEMBERS]: JSON

## ビジネスルール

### リソース管理ルール
1. **稼働率上限**: メンバーの稼働率は120%を超えない
   - 適用エンティティ: メンバー [Member]
2. **最小チーム人数**: アクティブなチームは2名以上
   - 適用集約: チーム集約 [TeamAggregate]
3. **リーダー必須**: 各チームには必ず1名のリーダーが必要
   - 適用エンティティ: チームメンバー [TeamMember]

### スキル管理ルール
1. **スキル評価頻度**: スキルレベルは年1回以上評価
   - 適用エンティティ: メンバースキル [MemberSkill]
2. **レベルアップ条件**: 次レベルには最低1年の経験が必要
   - 適用エンティティ: メンバースキル [MemberSkill]

### チーム編成ルール
1. **スキルバランス**: チームには複数のスキルカテゴリが必要
   - 適用集約: チーム集約 [TeamAggregate]
2. **期間整合性**: チームメンバーのアサイン期間はチーム活動期間内
   - 適用エンティティ: チームメンバー [TeamMember]

### エラーパターン
- 1201: 稼働率上限超過
- 1202: チーム最小人数違反
- 1203: リーダー不在
- 2201: 必須項目未入力
- 2202: 期間整合性違反
- 3201: メンバー重複アサイン

## リポジトリインターフェース

### メンバーリポジトリ [MemberRepository] [MEMBER_REPOSITORY]
集約: メンバー集約 [MemberAggregate]

基本操作:
- findById(id: UUID): メンバー [Member]
- save(member: メンバー): void
- delete(id: UUID): void

検索操作:
- findByEmployeeNumber(number: EmployeeNumber): メンバー
- findByEmail(email: Email): メンバー
- findAvailableMembers(date: DATE): メンバー[]
- findBySkill(skillId: UUID, minLevel: スキルレベル): メンバー[]

### スキルリポジトリ [SkillRepository] [SKILL_REPOSITORY]
集約: スキル集約 [SkillAggregate]

基本操作:
- findById(id: UUID): スキル [Skill]
- save(skill: スキル): void
- delete(id: UUID): void

検索操作:
- findByCategory(category: スキルカテゴリ): スキル[]
- findByTag(tag: STRING_50): スキル[]
- findActiveSkills(): スキル[]

### チームリポジトリ [TeamRepository] [TEAM_REPOSITORY]
集約: チーム集約 [TeamAggregate]

基本操作:
- findById(id: UUID): チーム [Team]
- save(team: チーム): void
- delete(id: UUID): void

検索操作:
- findByProjectId(projectId: UUID): チーム[]
- findByMemberId(memberId: UUID): チーム[]
- findActiveTeams(): チーム[]

## リレーションシップ一覧

### エンティティ間の関連
- メンバー [Member] *→ メンバースキル [MemberSkill]（1..*）：メンバーは複数のスキルを持つ（集約内包含）
- スキル [Skill] → メンバースキル [MemberSkill]（1..*）：スキルは複数のメンバーに保有される
- チーム [Team] *→ チームメンバー [TeamMember]（1..*）：チームは複数のメンバーを持つ（集約内包含）
- メンバー [Member] → チームメンバー [TeamMember]（1..*）：メンバーは複数のチームに所属可能

### 値オブジェクトの使用
- メンバー [Member] 使用 EmployeeNumber [EmployeeNumber]：社員番号として
- メンバー [Member] 使用 PersonName [PersonName]：氏名として
- メンバー [Member] 使用 Email [Email]：メールアドレスとして
- メンバー [Member] 使用 Position [Position]：職位として
- メンバー [Member] 使用 UtilizationRate [UtilizationRate]：稼働率として
- メンバースキル [MemberSkill] 使用 Certifications [Certifications]：資格情報として
- スキル [Skill] 使用 SkillTags [SkillTags]：タグ情報として
- チームメンバー [TeamMember] 使用 AllocationRate [AllocationRate]：アサイン率として

### 集約境界
- メンバー集約 [MemberAggregate]：メンバー [Member]、メンバースキル [MemberSkill]
- スキル集約 [SkillAggregate]：スキル [Skill]
- チーム集約 [TeamAggregate]：チーム [Team]、チームメンバー [TeamMember]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * ドメイン言語を更新する
 */
async function updateDomainLanguages() {
  console.log('🔄 Updating domain languages to v1.2.0 specification...\n')
  
  try {
    // 1. セキュアアクセスサービスの更新
    console.log('📝 Updating Secure Access Service...')
    const secureAccessService = await prisma.service.findFirst({
      where: { name: 'secure-access' }
    })
    
    if (secureAccessService) {
      await prisma.service.update({
        where: { id: secureAccessService.id },
        data: {
          domainLanguageDefinition: generateSecureAccessDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist'
            ]
          })
        }
      })
      console.log('✅ Secure Access Service updated')
    }
    
    // 2. プロジェクト成功支援サービスの更新
    console.log('📝 Updating Project Success Support Service...')
    const projectService = await prisma.service.findFirst({
      where: { name: 'project-success-support' }
    })
    
    if (projectService) {
      await prisma.service.update({
        where: { id: projectService.id },
        data: {
          domainLanguageDefinition: generateProjectSuccessDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist'
            ]
          })
        }
      })
      console.log('✅ Project Success Support Service updated')
    }
    
    // 3. タレント最適化サービスの更新
    console.log('📝 Updating Talent Optimization Service...')
    const talentService = await prisma.service.findFirst({
      where: { name: 'talent-optimization' }
    })
    
    if (talentService) {
      await prisma.service.update({
        where: { id: talentService.id },
        data: {
          domainLanguageDefinition: generateTalentOptimizationDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist'
            ]
          })
        }
      })
      console.log('✅ Talent Optimization Service updated')
    }
    
    // 他のサービスは必要に応じて追加更新
    console.log('\n✅ Domain language update completed!')
    console.log('📊 Updated features:')
    console.log('  - Explicit Value Object relationships')
    console.log('  - Aggregate boundaries with Value Objects')
    console.log('  - Complete relationship definitions')
    console.log('  - DDD pattern checklist')
    
  } catch (error) {
    console.error('❌ Error updating domain languages:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// スクリプトの実行
updateDomainLanguages()
  .then(() => {
    console.log('\n✨ Domain language v1.2.0 update completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Update failed:', error)
    process.exit(1)
  })