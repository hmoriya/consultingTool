# BC-003: ドメイン設計

**BC**: Access Control & Security
**作成日**: 2025-10-31
**V2移行元**: services/secure-access-service/domain-language.md（セキュリティ機能のみ）

---

## 概要

このドキュメントは、BC-003（アクセス制御とセキュリティ）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. User Aggregate
**集約ルート**: User [User] [USER]
- **責務**: ユーザーのライフサイクル全体を管理
- **包含エンティティ**: Credential, UserProfile, Session
- **不変条件**: アクティブなユーザーのみセッション作成可能

### 2. Permission Aggregate
**集約ルート**: Role [Role] [ROLE]
- **責務**: ロールと権限の関連管理
- **包含エンティティ**: Permission, RolePermission
- **不変条件**: ロールは少なくとも1つの権限を持つ

### 3. AuditLog Aggregate
**集約ルート**: AuditLog [AuditLog] [AUDIT_LOG]
- **責務**: 監査ログの不変性保証
- **包含エンティティ**: SecurityEvent, AccessLog
- **不変条件**: 作成後の変更・削除不可（Immutable）

---

## 主要エンティティ（Entities）

### User [User] [USER]
ユーザー [User] [USER]
├── ユーザーID [UserID] [USER_ID]: UUID
├── メールアドレス [Email] [EMAIL]: EMAIL
├── ユーザー名 [Username] [USERNAME]: STRING_100
├── 状態 [Status] [STATUS]: ENUM（active/inactive/suspended/deleted）
├── MFA有効フラグ [MfaEnabled] [MFA_ENABLED]: BOOLEAN
├── 最終ログイン日時 [LastLoginAt] [LAST_LOGIN_AT]: TIMESTAMP
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Role [Role] [ROLE]
ロール [Role] [ROLE]
├── ロールID [RoleID] [ROLE_ID]: UUID
├── ロール名 [RoleName] [ROLE_NAME]: STRING_100
├── 説明 [Description] [DESCRIPTION]: TEXT
├── システムロールフラグ [IsSystemRole] [IS_SYSTEM_ROLE]: BOOLEAN
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Permission [Permission] [PERMISSION]
権限 [Permission] [PERMISSION]
├── 権限ID [PermissionID] [PERMISSION_ID]: UUID
├── 権限名 [PermissionName] [PERMISSION_NAME]: STRING_100
├── リソース [Resource] [RESOURCE]: STRING_100
├── アクション [Action] [ACTION]: ENUM（read/write/delete/execute）
└── 説明 [Description] [DESCRIPTION]: TEXT

### Session [Session] [SESSION]
セッション [Session] [SESSION]
├── セッションID [SessionID] [SESSION_ID]: UUID
├── ユーザーID [UserID] [USER_ID]: UUID
├── アクセストークン [AccessToken] [ACCESS_TOKEN]: STRING_500
├── リフレッシュトークン [RefreshToken] [REFRESH_TOKEN]: STRING_500
├── 有効期限 [ExpiresAt] [EXPIRES_AT]: TIMESTAMP
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### AuditLog [AuditLog] [AUDIT_LOG]
監査ログ [AuditLog] [AUDIT_LOG]
├── ログID [LogID] [LOG_ID]: UUID
├── ユーザーID [UserID] [USER_ID]: UUID
├── アクション [Action] [ACTION]: STRING_100
├── リソース [Resource] [RESOURCE]: STRING_200
├── IPアドレス [IpAddress] [IP_ADDRESS]: STRING_45
├── ユーザーエージェント [UserAgent] [USER_AGENT]: STRING_500
├── 成功フラグ [Success] [SUCCESS]: BOOLEAN
└── 記録日時 [RecordedAt] [RECORDED_AT]: TIMESTAMP

---

## 主要値オブジェクト（Value Objects）

### Credential [Credential] [CREDENTIAL]
認証情報 [Credential] [CREDENTIAL]
├── パスワードハッシュ [passwordHash] [PASSWORD_HASH]: STRING_255
├── ソルト [salt] [SALT]: STRING_255
├── ハッシュアルゴリズム [algorithm] [ALGORITHM]: STRING_50
└── 最終変更日 [lastChangedAt] [LAST_CHANGED_AT]: TIMESTAMP

### AccessToken [AccessToken] [ACCESS_TOKEN]
アクセストークン [AccessToken] [ACCESS_TOKEN]
├── トークン値 [tokenValue] [TOKEN_VALUE]: STRING_500
├── トークンタイプ [tokenType] [TOKEN_TYPE]: STRING_20（例: Bearer）
├── 発行日時 [issuedAt] [ISSUED_AT]: TIMESTAMP
└── 有効期限 [expiresAt] [EXPIRES_AT]: TIMESTAMP

### SecurityPolicy [SecurityPolicy] [SECURITY_POLICY]
セキュリティポリシー [SecurityPolicy] [SECURITY_POLICY]
├── パスワード最小文字数 [minPasswordLength] [MIN_PASSWORD_LENGTH]: INTEGER
├── パスワード複雑性要件 [passwordComplexity] [PASSWORD_COMPLEXITY]: STRING_100
├── MFA強制フラグ [mfaRequired] [MFA_REQUIRED]: BOOLEAN
└── セッションタイムアウト [sessionTimeout] [SESSION_TIMEOUT]: INTEGER（分）

---

## ドメインサービス

### AuthenticationService
**責務**: 認証処理の統括
- `authenticateUser()`: ユーザー認証の実行
- `validateMfa()`: 多要素認証の検証
- `createSession()`: セッションの作成（→ Session生成）

### AuthorizationService
**責務**: 認可処理の統括
- `checkPermission()`: 権限チェック
- `grantPermission()`: 権限付与
- `revokePermission()`: 権限削除

### SecurityMonitoringService
**責務**: セキュリティ監視
- `detectSuspiciousActivity()`: 不審なアクティビティ検知
- `recordAuditLog()`: 監査ログ記録
- `raiseSecurityAlert()`: セキュリティアラート発行（→ BC-007連携）

---

## V2からの移行メモ

### 移行済み
- ✅ User, Role, Permission, Session, AuditLogエンティティの定義
- ✅ 集約境界の明確化
- ✅ 値オブジェクトの抽出

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

### BC-004への分離
- ✅ Organization, OrganizationUnit エンティティはBC-004へ移行

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
