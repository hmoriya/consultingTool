# パラソルドメイン言語: セキュアアクセスドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
システムへの安全なアクセスを管理し、組織とユーザーの認証・認可を制御するドメイン

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式（RFC5322準拠）
PASSWORD_HASH: ハッシュ化されたパスワード
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
URL: URL形式（RFC3986準拠）
```

### カスタム型定義
```
アカウントステータス: アカウントの状態 (基本型: ENUM)
  - active: アクティブ
  - suspended: 一時停止
  - locked: ロック済み
  - deleted: 削除済み

組織種別: 組織のタイプ (基本型: ENUM)
  - consulting_firm: コンサルティングファーム
  - client: クライアント企業
  - partner: パートナー企業

ロールタイプ: 役割の種類 (基本型: ENUM)
  - Executive: エグゼクティブ
  - PM: プロジェクトマネージャー
  - Consultant: コンサルタント
  - Client: クライアント
  - Admin: 管理者

認証方式: 認証の方法 (基本型: ENUM)
  - password: パスワード認証
  - oauth: OAuth認証
  - saml: SAML認証
  - mfa: 多要素認証
```

## エンティティ（Entities）

### 組織 [Organization] [ORGANIZATION]
説明: コンサルティングファームやクライアント企業を表すエンティティ

属性:
- 組織ID [OrganizationId] [ORGANIZATION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 組織の一意識別子
- 組織名 [Name] [NAME]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: 組織の正式名称
- 組織種別 [Type] [TYPE]
  - 型: 組織種別 [OrganizationType] [ORGANIZATION_TYPE]
  - 説明: 組織の分類
- 契約情報 [ContractInfo] [CONTRACT_INFO]
  - 型: 契約情報 [ContractInfo] [CONTRACT_INFO]（値オブジェクト）
  - 説明: 契約に関する詳細情報
- 作成日時 [CreatedAt] [CREATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 組織の作成日時

不変条件:
- 組織名は一意である
- 削除された組織のユーザーはログインできない

振る舞い:
- 組織停止 [SuspendOrganization] [SUSPEND_ORGANIZATION]
  - 目的: セキュリティインシデント時に組織を一時停止
  - 入力: 停止理由
  - 出力: 停止結果
  - 事前条件: アクティブ状態
  - 事後条件: 停止状態、全ユーザーアクセス不可

#### ドメインイベント
- 組織作成済み [OrganizationCreated] [ORGANIZATION_CREATED]：新規組織登録時
- 組織停止済み [OrganizationSuspended] [ORGANIZATION_SUSPENDED]：セキュリティ対応時

#### 集約ルート
このエンティティは組織集約のルートエンティティ

### ユーザー [User] [USER]
説明: システムを利用する個人を表すエンティティ

属性:
- ユーザーID [UserId] [USER_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: ユーザーの一意識別子
- 組織リファレンス [OrganizationRef] [ORGANIZATION_REF]
  - 型: 組織ID [OrganizationId] [ORGANIZATION_ID]（参照）
  - 説明: 所属組織への参照
  - 関連: 組織 [Organization] → ユーザー [User]（1..*）
- メールアドレス [Email] [EMAIL]
  - 型: EMAIL [EMAIL] [EMAIL]
  - 説明: ログイン用メールアドレス
- 認証情報 [AuthInfo] [AUTH_INFO]
  - 型: 認証情報 [AuthenticationInfo] [AUTHENTICATION_INFO]（値オブジェクト）
  - 説明: 認証に必要な情報
- プロファイル [Profile] [PROFILE]
  - 型: ユーザープロファイル [UserProfile] [USER_PROFILE]（値オブジェクト）
  - 説明: ユーザーの詳細情報
- ロール [Roles] [ROLES]
  - 型: ロールの配列 [Role[]] [ROLE_ARRAY]（1..*）
  - 説明: ユーザーが持つ役割
- アカウントステータス [Status] [STATUS]
  - 型: アカウントステータス [AccountStatus] [ACCOUNT_STATUS]
  - 説明: アカウントの状態
- 最終ログイン [LastLoginAt] [LAST_LOGIN_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 最後にログインした日時

不変条件:
- メールアドレスはシステム全体で一意
- 1つ以上のロールを持つ
- 削除されたユーザーは再作成できない

振る舞い:
- パスワード変更 [ChangePassword] [CHANGE_PASSWORD]
  - 目的: セキュリティ向上のためパスワードを更新
  - 入力: 現在のパスワード、新しいパスワード
  - 出力: 変更結果
  - 事前条件: アクティブ状態、現パスワード一致
  - 事後条件: パスワード更新済み
- ロール割当 [AssignRole] [ASSIGN_ROLE]
  - 目的: ユーザーに新しいロールを付与
  - 入力: ロール情報
  - 出力: 割当結果
  - 事前条件: 有効なロール
  - 事後条件: ロール追加済み

### ロール [Role] [ROLE]
説明: ユーザーの権限と責任を定義するエンティティ

属性:
- ロールID [RoleId] [ROLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: ロールの一意識別子
- ロールタイプ [Type] [TYPE]
  - 型: ロールタイプ [RoleType] [ROLE_TYPE]
  - 説明: ロールの種類
- 権限セット [Permissions] [PERMISSIONS]
  - 型: 権限セット [PermissionSet] [PERMISSION_SET]（値オブジェクト）
  - 説明: このロールが持つ権限の集合
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: ロールの詳細説明

## 値オブジェクト（Value Objects）

### 契約情報 [ContractInfo] [CONTRACT_INFO]
- 定義: 組織の契約に関する情報
- 属性:
  - 契約開始日 [startDate] [START_DATE]: DATE
  - 契約終了日 [endDate] [END_DATE]: DATE
  - 契約プラン [plan] [PLAN]: STRING_50
  - ユーザー数上限 [maxUsers] [MAX_USERS]: INTEGER
- 制約: 開始日は終了日より前
- 使用エンティティ: 組織 [Organization]
- 例: 2024-01-01〜2024-12-31、Enterpriseプラン、100ユーザー

### 認証情報 [AuthenticationInfo] [AUTHENTICATION_INFO]
- 定義: ユーザーの認証に必要な情報
- 属性:
  - パスワードハッシュ [passwordHash] [PASSWORD_HASH]: PASSWORD_HASH
  - 認証方式 [authMethod] [AUTH_METHOD]: 認証方式
  - 多要素認証有効 [mfaEnabled] [MFA_ENABLED]: BOOLEAN
  - パスワード更新日 [passwordUpdatedAt] [PASSWORD_UPDATED_AT]: TIMESTAMP
- 制約: パスワードは最低8文字、90日ごとに更新推奨
- 使用エンティティ: ユーザー [User]

### ユーザープロファイル [UserProfile] [USER_PROFILE]
- 定義: ユーザーの詳細情報
- 属性:
  - 氏名 [name] [NAME]: STRING_100
  - 役職 [title] [TITLE]: STRING_100
  - 部署 [department] [DEPARTMENT]: STRING_100
  - 電話番号 [phone] [PHONE]: STRING_20
  - プロフィール画像URL [avatarUrl] [AVATAR_URL]: URL
- 制約: 氏名は必須
- 使用エンティティ: ユーザー [User]

### 権限セット [PermissionSet] [PERMISSION_SET]
- 定義: ロールが持つ権限の集合
- 属性:
  - 権限リスト [permissions] [PERMISSIONS]: STRING_50の配列
  - スコープ [scope] [SCOPE]: STRING_50（organization/project/global）
- 制約: 最低1つの権限を含む
- 使用エンティティ: ロール [Role]
- 例: ["project.read", "project.write", "report.read"]

## 集約（Aggregates）

### 組織集約 [OrganizationAggregate] [ORGANIZATION_AGGREGATE]
- **集約ルート**: 組織 [Organization]
- **含まれるエンティティ**: なし（ユーザーは別集約）
- **含まれる値オブジェクト**:
  - 契約情報 [ContractInfo]：契約の詳細情報として使用
- **トランザクション境界**: 組織情報の更新は単独で完結
- **不変条件**: 
  - アクティブな契約期間内のみ有効
  - 組織削除時は論理削除のみ
- **外部参照ルール**:
  - 他の集約からは組織IDのみで参照
  - ユーザー集約から組織を参照

### ユーザー集約 [UserAggregate] [USER_AGGREGATE]
- **集約ルート**: ユーザー [User]
- **含まれるエンティティ**: 
  - ロール [Role]：ユーザーが持つ権限（1..*）
- **含まれる値オブジェクト**:
  - 認証情報 [AuthenticationInfo]：ログイン情報として使用
  - ユーザープロファイル [UserProfile]：個人情報として使用
  - 権限セット [PermissionSet]：各ロールの権限として使用
- **トランザクション境界**: ユーザーとロールは同一トランザクション
- **不変条件**: 
  - ユーザーは必ず1つの組織に所属
  - 最低1つのロールを持つ
  - メールアドレスは変更時も一意性を保つ
- **外部参照ルール**:
  - 集約外からはユーザーIDのみで参照
  - ロールへの直接アクセスは禁止

## ドメインサービス

### 認証サービス [AuthenticationService] [AUTHENTICATION_SERVICE]
ユーザーの認証と認可を管理するサービス

#### 提供機能
- ユーザー認証 [AuthenticateUser] [AUTHENTICATE_USER]
  - 目的: ログイン情報の検証
  - 入力: メールアドレス、パスワード
  - 出力: 認証トークン、ユーザー情報
  - 制約: 5回連続失敗でアカウントロック

- 権限検証 [CheckPermission] [CHECK_PERMISSION]
  - 目的: 特定のアクションに対する権限確認
  - 入力: ユーザーID、必要な権限
  - 出力: 許可/拒否
  - 制約: ロールの組み合わせを考慮

### 監査ログサービス [AuditLogService] [AUDIT_LOG_SERVICE]
セキュリティ監査のためのログ記録サービス

#### 提供機能
- ログイン記録 [RecordLogin] [RECORD_LOGIN]
  - 目的: ログイン試行の記録
  - 入力: ユーザーID、IPアドレス、成功/失敗
  - 出力: ログID
  - 制約: 全ての試行を記録、90日間保持

## ドメインイベント

### 組織作成済み [OrganizationCreated] [ORGANIZATION_CREATED]
- **発生タイミング**: 新しい組織が登録された時
- **ペイロード**: 
  - 組織ID [organizationId]: UUID
  - 組織名 [organizationName]: STRING_100
  - 組織種別 [organizationType]: 組織種別

### ユーザー作成済み [UserCreated] [USER_CREATED]
- **発生タイミング**: 新しいユーザーが登録された時
- **ペイロード**: 
  - ユーザーID [userId]: UUID
  - 組織ID [organizationId]: UUID
  - メールアドレス [email]: EMAIL
  - ロール [roles]: ロールタイプの配列

### ログイン成功 [LoginSucceeded] [LOGIN_SUCCEEDED]
- **発生タイミング**: ユーザーが正常にログインした時
- **ペイロード**: 
  - ユーザーID [userId]: UUID
  - ログイン日時 [loginAt]: TIMESTAMP
  - IPアドレス [ipAddress]: STRING_50

### アカウントロック [AccountLocked] [ACCOUNT_LOCKED]
- **発生タイミング**: セキュリティ違反でアカウントがロックされた時
- **ペイロード**: 
  - ユーザーID [userId]: UUID
  - ロック理由 [reason]: STRING_255
  - ロック日時 [lockedAt]: TIMESTAMP

## ビジネスルール

### 認証ルール
1. **パスワードポリシー**: 
   - 最低8文字、大文字・小文字・数字・特殊文字を含む
   - 過去3回のパスワードは再利用不可
   - 90日ごとの変更推奨
2. **ログイン試行制限**: 
   - 5回連続失敗で30分間アカウントロック
   - 管理者による手動解除可能
3. **セッション管理**: 
   - 30分間の無操作でセッションタイムアウト
   - 同時ログインは3セッションまで

### 組織管理ルール
1. **ユーザー数制限**: 契約プランに応じた上限を設定
2. **組織削除**: 論理削除のみ、物理削除は不可
3. **組織間移動**: ユーザーの組織間移動は新規作成扱い

### エラーパターン
- 1001: 認証失敗エラー
- 1002: 権限不足エラー
- 1003: アカウントロックエラー
- 1004: セッションタイムアウトエラー
- 1005: パスワードポリシー違反エラー

## リポジトリインターフェース

### 組織リポジトリ [OrganizationRepository] [ORGANIZATION_REPOSITORY]
集約: 組織集約 [OrganizationAggregate]

基本操作:
- findById(id: UUID): 組織 [Organization]
- save(organization: 組織): void
- delete(id: UUID): void

検索操作:
- findByName(name: STRING_100): 組織
- findByType(type: 組織種別): 組織[]

### ユーザーリポジトリ [UserRepository] [USER_REPOSITORY]
集約: ユーザー集約 [UserAggregate]

基本操作:
- findById(id: UUID): ユーザー [User]
- save(user: ユーザー): void

検索操作:
- findByEmail(email: EMAIL): ユーザー
- findByOrganizationId(organizationId: UUID): ユーザー[]
- findByRole(role: ロールタイプ): ユーザー[]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む
- [x] 必ず何らかの集約に属している

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] すべてのエンティティを包含している
- [x] 外部からのアクセスは集約ルート経由のみ