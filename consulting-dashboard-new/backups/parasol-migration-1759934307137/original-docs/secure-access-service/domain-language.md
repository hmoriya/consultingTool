# パラソルドメイン言語: セキュアアクセスサービス

**バージョン**: 1.2.0
**更新日**: 2024-12-30

## パラソルドメイン概要

組織のセキュリティを確保しながら、適切なアクセス制御と認証・認可を実現するドメインモデル。DDD原則に基づき、明確な集約境界とステレオタイプマーキングにより、組織、ユーザー、ロール、セッション、監査ログの関係を体系的に定義。ゼロトラストセキュリティ、多要素認証、きめ細かなアクセス制御、監査証跡の完全性確保を通じて、セキュアなビジネス環境を提供する。すべてのエンティティは適切な集約に所属し、ID参照による疎結合を実現。

### 主要な価値提供
- ゼロトラストセキュリティの実現
- 多要素認証による強固な保護
- きめ細かなアクセス制御
- 監査証跡の完全性確保
- コンプライアンス要件の充足

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式
PASSWORD_HASH: ハッシュ化されたパスワード
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式データ
IP: IPアドレス形式
```

### エンティティ定義

#### Organization（組織）<<entity>><<aggregate root>>
**概要**: 企業・部門・チームなどの組織単位の集約ルート
**識別性**: organizationIdによって一意に識別される
**ライフサイクル**: 作成→稼働→拡大→縮小→非活性化（物理削除は行わない）
**集約所属**: OrganizationAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 組織ID |
| name | STRING_100 | ○ | 組織名 |
| code | STRING_50 | ○ | 組織コード（ユニーク） |
| description | TEXT | - | 説明 |
| type | ENUM | ○ | 組織タイプ（company/department/team） |
| parentId | UUID | - | 親組織ID（階層構造用） |
| status | ENUM | ○ | ステータス（active/inactive） |
| settings | JSON | ○ | 組織設定 |
| metadata | JSON | - | メタデータ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |
| deletedAt | TIMESTAMP | - | 削除日時（論理削除） |

#### User（ユーザー）<<entity>><<aggregate root>>
**概要**: システム利用者の認証情報とプロフィールの集約ルート
**識別性**: userIdによって一意に識別される
**ライフサイクル**: 作成→認証設定→稼働→ロック→非活性化（物理削除は行わない）
**集約所属**: UserAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ユーザーID |
| organizationId | UUID | ○ | 組織ID（参照のみ） |
| email | EMAIL | ○ | メールアドレス（ユニーク） |
| username | STRING_50 | ○ | ユーザー名（ユニーク） |
| passwordHash | STRING_255 | ○ | パスワードハッシュ |
| salt | STRING_32 | ○ | ソルト値 |
| firstName | STRING_100 | ○ | 名 |
| lastName | STRING_100 | ○ | 姓 |
| phoneNumber | STRING_20 | - | 電話番号 |
| mfaEnabled | BOOLEAN | ○ | MFA有効フラグ |
| mfaSecret | STRING_255 | - | MFAシークレット |
| status | ENUM | ○ | ステータス（active/inactive/locked/suspended） |
| emailVerified | BOOLEAN | ○ | メール確認済みフラグ |
| lastLoginAt | TIMESTAMP | - | 最終ログイン日時 |
| failedAttempts | INTEGER | ○ | 失敗試行回数 |
| lockedUntil | TIMESTAMP | - | ロック解除日時 |
| passwordChangedAt | TIMESTAMP | ○ | パスワード変更日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |
| deletedAt | TIMESTAMP | - | 削除日時（論理削除） |

#### Role（ロール）<<entity>><<aggregate root>>
**概要**: ユーザーに割り当てる権限セットの集約ルート
**識別性**: roleIdによって一意に識別される
**ライフサイクル**: 定義→承認→稼働→更新→廃止
**集約所属**: RoleAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ロールID |
| name | STRING_50 | ○ | ロール名（ユニーク） |
| displayName | STRING_100 | ○ | 表示名 |
| description | TEXT | - | 説明 |
| type | ENUM | ○ | タイプ（system/custom） |
| level | INTEGER | ○ | 権限レベル（1-100） |
| parentId | UUID | - | 親ロールID |
| permissions | JSON | ○ | 権限リスト |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Permission（権限）<<entity>><<aggregate root>>
**概要**: リソースへのアクセス権限の集約ルート
**識別性**: permissionIdによって一意に識別される
**ライフサイクル**: システム定義は不変、カスタム権限は作成→承認→稼働→廃止
**集約所属**: PermissionAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 権限ID |
| resource | STRING_100 | ○ | リソース名 |
| action | STRING_50 | ○ | アクション（create/read/update/delete/execute） |
| scope | STRING_100 | - | スコープ（own/team/organization/all） |
| conditions | JSON | - | 条件式 |
| description | TEXT | - | 説明 |
| isSystem | BOOLEAN | ○ | システム権限フラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |

#### Session（セッション）<<entity>><<aggregate root>>
**概要**: ユーザーの認証済みセッション情報の集約ルート
**識別性**: sessionIdによって一意に識別される
**ライフサイクル**: 作成→稼働→アイドル→期限切れ/終了
**集約所属**: SessionAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | セッションID |
| userId | UUID | ○ | ユーザーID |
| token | STRING_255 | ○ | セッショントークン |
| refreshToken | STRING_255 | - | リフレッシュトークン |
| deviceInfo | JSON | ○ | デバイス情報 |
| ipAddress | IP | ○ | IPアドレス |
| location | JSON | - | 位置情報 |
| userAgent | STRING_500 | ○ | ユーザーエージェント |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| expiresAt | TIMESTAMP | ○ | 有効期限 |
| lastActivityAt | TIMESTAMP | ○ | 最終活動日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| terminatedAt | TIMESTAMP | - | 終了日時 |

#### AuditLog（監査ログ）<<entity>><<aggregate root>>
**概要**: システム操作の監査証跡の集約ルート
**識別性**: auditLogIdによって一意に識別される
**ライフサイクル**: 作成のみ（変更・削除不可、イミュータブル）
**集約所属**: AuditLogAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ログID |
| userId | UUID | - | ユーザーID |
| sessionId | UUID | - | セッションID |
| action | STRING_100 | ○ | アクション |
| resource | STRING_100 | ○ | リソース |
| resourceId | UUID | - | リソースID |
| result | ENUM | ○ | 結果（success/failure/error） |
| ipAddress | IP | ○ | IPアドレス |
| userAgent | STRING_500 | - | ユーザーエージェント |
| requestData | JSON | - | リクエストデータ |
| responseData | JSON | - | レスポンスデータ |
| errorMessage | TEXT | - | エラーメッセージ |
| duration | INTEGER | ○ | 処理時間（ミリ秒） |
| createdAt | TIMESTAMP | ○ | 作成日時 |

### サポートエンティティ

#### Policy（ポリシー）<<entity>><<aggregate root>>
**概要**: セキュリティポリシーのルールセットの集約ルート
**識別性**: policyIdによって一意に識別される
**ライフサイクル**: 定義→承認→施行→更新→廃止
**集約所属**: PolicyAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ポリシーID |
| name | STRING_100 | ○ | ポリシー名 |
| type | ENUM | ○ | タイプ（password/session/access/data） |
| rules | JSON | ○ | ルール定義 |
| priority | INTEGER | ○ | 優先度 |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| effectiveFrom | TIMESTAMP | ○ | 有効開始日 |
| effectiveUntil | TIMESTAMP | - | 有効終了日 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### ApiKey（APIキー）<<entity>><<aggregate root>>
**概要**: プログラムからのAPI認証用キーの集約ルート
**識別性**: apiKeyIdによって一意に識別される
**ライフサイクル**: 生成→稼働→更新→無効化
**集約所属**: ApiKeyAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | キーID |
| name | STRING_100 | ○ | キー名 |
| key | STRING_255 | ○ | APIキー（暗号化） |
| secret | STRING_255 | ○ | シークレット（暗号化） |
| userId | UUID | ○ | 所有者ID |
| permissions | JSON | ○ | 権限リスト |
| rateLimit | INTEGER | ○ | レート制限（req/分） |
| ipWhitelist | IP[] | - | 許可IPリスト |
| lastUsedAt | TIMESTAMP | - | 最終使用日時 |
| expiresAt | TIMESTAMP | - | 有効期限 |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| revokedAt | TIMESTAMP | - | 無効化日時 |

### 値オブジェクト定義

#### AuthenticationContext（認証コンテキスト）<<value object>>
**概要**: 認証方法と認証強度を表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

```typescript
interface AuthenticationContext {
  method: 'password' | 'oauth' | 'saml' | 'mfa' | 'apikey';
  provider?: string;
  strength: 'weak' | 'medium' | 'strong';
  factors: string[];
  timestamp: Date;
  deviceFingerprint: string;
}
```

#### AccessRequest（アクセスリクエスト）<<value object>>
**概要**: リソースへのアクセス要求情報を表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

```typescript
interface AccessRequest {
  userId: UUID;
  resource: string;
  action: string;
  context: {
    ipAddress: string;
    location?: GeoLocation;
    time: Date;
    deviceId?: string;
    sessionId: UUID;
  };
  attributes?: Record<string, any>;
}
```

#### SecurityEvent（セキュリティイベント）<<value object>>
**概要**: セキュリティ関連イベント情報を表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

```typescript
interface SecurityEvent {
  type: 'login' | 'logout' | 'permission_change' | 'suspicious_activity' | 'breach_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: UUID;
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
  actionTaken?: string;
}
```

#### PasswordPolicy（パスワードポリシー）<<value object>>
**概要**: パスワード要件ルールを表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

```typescript
interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minPasswordAge: number;  // days
  maxPasswordAge: number;  // days
  passwordHistory: number; // remember last N passwords
  maxFailedAttempts: number;
  lockoutDuration: number; // minutes
}
```

#### SessionPolicy（セッションポリシー）<<value object>>
**概要**: セッション管理ルールを表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

```typescript
interface SessionPolicy {
  maxDuration: number;      // minutes
  idleTimeout: number;      // minutes
  maxConcurrent: number;
  requireMfaForSensitive: boolean;
  allowRememberMe: boolean;
  rememberMeDuration: number; // days
  requireSecureCookie: boolean;
}
```

### 集約定義

#### OrganizationAggregate（組織集約）<<aggregate>>
**集約ルート**: Organization（組織）
**集約境界**: Organization（組織）

**包含エンティティ**:
- Organization（集約ルート・1対1）

**不変条件**:
- 組織コードは全体でユニーク
- 親組織の削除時は子組織も非活性化
- 組織階層の循環参照禁止
- 非活性組織には新規ユーザー追加不可

**他集約との関係**:
- User集約とはorganizationIdのみで参照（IDのみ参照）
- Organization集約間はparentIdのみで参照（階層構造）

**責務**:
- 組織構造の一貫性保証
- 組織階層の整合性維持
- 組織設定の一元管理

#### UserAggregate（ユーザー集約）<<aggregate>>
**集約ルート**: User（ユーザー）
**集約境界**: User（ユーザー）

**包含エンティティ**:
- User（集約ルート・1対1）

**不変条件**:
- メールアドレスは組織内でユニーク
- パスワードはポリシーに準拠（最小8文字、複雑性要件）
- MFA有効時はシークレット必須
- ロックアウト中はログイン不可（5回失敗で30分ロック）
- ユーザーは必ず組織に所属（organizationIdを持つ）
- パスワード変更は90日ごとに必須

**他集約との関係**:
- Organization集約とはorganizationIdのみで参照（IDのみ参照）
- Role集約とはroleIdのみで参照（多対多、中間テーブル経由）
- Session集約とはuserIdのみで参照（1対多）

**責務**:
- ユーザー認証情報の一貫性保証
- セキュリティポリシーの適用
- アカウントライフサイクル管理

#### RoleAggregate（ロール集約）<<aggregate>>
**集約ルート**: Role（ロール）
**集約境界**: Role（ロール）

**包含エンティティ**:
- Role（集約ルート・1対1）

**不変条件**:
- システムロールは変更・削除不可
- 権限の循環参照禁止
- 親ロールの権限を継承
- 子ロールのレベルは親より低い
- 権限レベルは1-100の範囲内

**他集約との関係**:
- Permission集約とはpermissionIdのみで参照（多対多）
- User集約とはuserIdのみで参照（多対多）
- Role集約間はparentIdのみで参照（階層構造）

**責務**:
- ロール階層の一貫性保証
- 権限セットの整合性維持
- 継承ルールの適用

#### PermissionAggregate（権限集約）<<aggregate>>
**集約ルート**: Permission（権限）
**集約境界**: Permission（権限）

**包含エンティティ**:
- Permission（集約ルート・1対1）

**不変条件**:
- システム権限は変更・削除不可
- リソースとアクションの組み合わせは一意
- スコープはown/team/organization/allのいずれか

**他集約との関係**:
- Role集約経由でUser集約と間接的に関連

**責務**:
- 権限定義の一貫性保証
- アクセス制御ルールの明確化
- リソース保護の実現

#### SessionAggregate（セッション集約）<<aggregate>>
**集約ルート**: Session（セッション）
**集約境界**: Session（セッション）

**包含エンティティ**:
- Session（集約ルート・1対1）

**不変条件**:
- 有効期限切れセッションは無効（デフォルト8時間）
- 同一ユーザーの同時セッション数は最大3つ
- アイドルタイムアウトは30分
- 異常な活動パターン（位置変更、異常リクエスト）で自動終了
- トークンは暗号化して保存

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- AuditLog集約とはsessionIdのみで参照（1対多）

**責務**:
- セッション有効性の保証
- セキュリティポリシーの適用
- 異常検知と自動対応

#### AuditLogAggregate（監査ログ集約）<<aggregate>>
**集約ルート**: AuditLog（監査ログ）
**集約境界**: AuditLog（監査ログ）

**包含エンティティ**:
- AuditLog（集約ルート・1対1）

**不変条件**:
- 一度作成されたログは変更・削除不可（イミュータブル）
- すべての操作は監査ログに記録
- ログ保持期間は最低1年間

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- Session集約とはsessionIdのみで参照（IDのみ参照）

**責務**:
- 監査証跡の完全性保証
- タンパリング防止
- コンプライアンス要件の充足

### ドメインサービス

#### OrganizationService<<service>>
**概要**: 複数の組織集約に跨る組織管理操作
**責務**: 組織階層管理、組織間移動、ユーザーと組織の関連管理
**ステレオタイプ**: service

```typescript
interface OrganizationService {
  // 組織管理
  createOrganization(params: CreateOrganizationParams): Promise<Result<Organization>>
  updateOrganization(orgId: UUID, updates: OrganizationUpdates): Promise<Result<Organization>>
  deactivateOrganization(orgId: UUID): Promise<Result<void>>

  // ユーザーと組織の関連（集約をまたぐ操作）
  getUsersByOrganization(orgId: UUID): Promise<Result<User[]>>
  assignUserToOrganization(userId: UUID, orgId: UUID): Promise<Result<void>>
  removeUserFromOrganization(userId: UUID): Promise<Result<void>>

  // 組織階層
  getChildOrganizations(parentId: UUID): Promise<Result<Organization[]>>
  moveOrganization(orgId: UUID, newParentId: UUID): Promise<Result<void>>
}
```

#### AuthenticationService<<service>>
**概要**: ユーザー認証とパスワード管理、MFA設定
**責務**: 認証処理、パスワード管理、多要素認証設定
**ステレオタイプ**: service

```typescript
interface AuthenticationService {
  // 認証
  authenticate(credentials: Credentials): Promise<Result<AuthToken>>
  verifyMfa(userId: UUID, code: string): Promise<Result<void>>
  refreshToken(refreshToken: string): Promise<Result<AuthToken>>

  // パスワード管理
  changePassword(userId: UUID, oldPassword: string, newPassword: string): Promise<Result<void>>
  resetPassword(email: string): Promise<Result<void>>
  validatePasswordStrength(password: string): Promise<PasswordStrength>

  // MFA管理
  enableMfa(userId: UUID): Promise<Result<MfaSecret>>
  disableMfa(userId: UUID, code: string): Promise<Result<void>>
  generateBackupCodes(userId: UUID): Promise<Result<string[]>>
}
```

#### AuthorizationService<<service>>
**概要**: アクセス制御とロール管理、ポリシー評価
**責務**: 権限チェック、ロール割り当て、ポリシー適用
**ステレオタイプ**: service

```typescript
interface AuthorizationService {
  // アクセス制御
  authorize(request: AccessRequest): Promise<Result<AccessDecision>>
  checkPermission(userId: UUID, resource: string, action: string): Promise<boolean>
  getUserPermissions(userId: UUID): Promise<Permission[]>

  // ロール管理
  assignRole(userId: UUID, roleId: UUID): Promise<Result<void>>
  removeRole(userId: UUID, roleId: UUID): Promise<Result<void>>
  createCustomRole(role: RoleDefinition): Promise<Result<Role>>

  // ポリシー評価
  evaluatePolicy(policy: Policy, context: Context): Promise<PolicyDecision>
  enforcePolicy(policyId: UUID, target: any): Promise<Result<void>>
}
```

#### SessionManagementService<<service>>
**概要**: セッションのライフサイクル管理と監視
**責務**: セッション作成・検証・終了、異常検知
**ステレオタイプ**: service

```typescript
interface SessionManagementService {
  // セッション管理
  createSession(userId: UUID, context: SessionContext): Promise<Result<Session>>
  validateSession(sessionId: UUID): Promise<Result<Session>>
  terminateSession(sessionId: UUID): Promise<Result<void>>
  terminateUserSessions(userId: UUID): Promise<Result<void>>

  // セッション監視
  detectAnomalies(sessionId: UUID): Promise<AnomalyReport>
  enforceSessionPolicy(session: Session): Promise<Result<void>>
  cleanupExpiredSessions(): Promise<Result<number>>
}
```

#### AuditService<<service>>
**概要**: 監査ログの記録とコンプライアンスレポート生成
**責務**: 監査証跡記録、異常検知、レポート生成
**ステレオタイプ**: service

```typescript
interface AuditService {
  // 監査ログ
  logSecurityEvent(event: SecurityEvent): Promise<Result<void>>
  logAccessAttempt(attempt: AccessAttempt): Promise<Result<void>>
  logDataAccess(access: DataAccess): Promise<Result<void>>

  // 監査レポート
  generateComplianceReport(period: DateRange): Promise<ComplianceReport>
  detectSuspiciousActivity(userId: UUID): Promise<SuspiciousActivity[]>
  exportAuditLogs(filter: AuditFilter): Promise<AuditExport>
}
```

## 6. ドメインイベント

### 認証イベント

```typescript
// ユーザーイベント
class UserCreated {
  userId: UUID;
  email: string;
  roles: UUID[];
  timestamp: Date;
}

class UserAuthenticated {
  userId: UUID;
  method: string;
  sessionId: UUID;
  ipAddress: string;
  timestamp: Date;
}

class UserLockedOut {
  userId: UUID;
  reason: string;
  failedAttempts: number;
  lockedUntil: Date;
  timestamp: Date;
}

class PasswordChanged {
  userId: UUID;
  changedBy: UUID;
  requiresRelogin: boolean;
  timestamp: Date;
}

// MFAイベント
class MfaEnabled {
  userId: UUID;
  method: string;
  timestamp: Date;
}

class MfaVerificationFailed {
  userId: UUID;
  attemptCount: number;
  timestamp: Date;
}

// セッションイベント
class SessionCreated {
  sessionId: UUID;
  userId: UUID;
  deviceInfo: DeviceInfo;
  timestamp: Date;
}

class SessionTerminated {
  sessionId: UUID;
  reason: string;
  terminatedBy: UUID;
  timestamp: Date;
}

class SuspiciousActivityDetected {
  sessionId: UUID;
  userId: UUID;
  activityType: string;
  riskScore: number;
  timestamp: Date;
}

// アクセスイベント
class AccessGranted {
  userId: UUID;
  resource: string;
  action: string;
  timestamp: Date;
}

class AccessDenied {
  userId: UUID;
  resource: string;
  action: string;
  reason: string;
  timestamp: Date;
}

class PermissionChanged {
  userId: UUID;
  changes: PermissionChange[];
  changedBy: UUID;
  timestamp: Date;
}
```

## 7. ビジネスルール

### 認証ルール
1. **パスワードポリシー**
   - 最小8文字、最大128文字
   - 大文字、小文字、数字、特殊文字を含む
   - 過去5回のパスワードと重複不可
   - 90日ごとに変更必須

2. **アカウントロックアウト**
   - 5回連続失敗で30分ロック
   - 10回失敗で管理者介入必要
   - ロック解除後は失敗カウントリセット

3. **MFA要件**
   - 管理者ロールは必須
   - 機密データアクセス時は必須
   - バックアップコードは10個生成

### セッション管理ルール
1. **セッションポリシー**
   - デフォルト有効期限8時間
   - アイドルタイムアウト30分
   - 同時セッション最大3つ

2. **デバイス管理**
   - 新規デバイスは確認必要
   - 信頼済みデバイスは30日有効
   - 異常な位置変更で再認証

3. **トークン管理**
   - アクセストークン15分
   - リフレッシュトークン7日
   - 使用済みトークンは無効化

### アクセス制御ルール
1. **最小権限の原則**
   - デフォルトは全て拒否
   - 明示的な許可のみ有効
   - 一時的な権限昇格可能

2. **職務分離**
   - 作成者は承認者になれない
   - 監査者は操作者になれない
   - 緊急時は上位者が代行

3. **データ分類**
   - 公開、内部、機密、極秘
   - 分類に応じたアクセス制御
   - 暗号化要件の適用

## 8. インターフェース仕様

### コマンドインターフェース

```typescript
// 認証コマンド
interface AuthenticationCommands {
  Login(email: string, password: string): Result<LoginResponse>;
  Logout(sessionId: UUID): Result<void>;
  RefreshToken(refreshToken: string): Result<TokenResponse>;
  RequestPasswordReset(email: string): Result<void>;
  ResetPassword(token: string, newPassword: string): Result<void>;
}

// ユーザー管理コマンド
interface UserManagementCommands {
  CreateUser(params: CreateUserParams): Result<User>;
  UpdateUser(userId: UUID, updates: UserUpdates): Result<User>;
  DeactivateUser(userId: UUID, reason: string): Result<void>;
  UnlockUser(userId: UUID): Result<void>;
}

// ロール管理コマンド
interface RoleManagementCommands {
  AssignRole(userId: UUID, roleId: UUID): Result<void>;
  RevokeRole(userId: UUID, roleId: UUID): Result<void>;
  CreateRole(params: CreateRoleParams): Result<Role>;
  UpdateRolePermissions(roleId: UUID, permissions: Permission[]): Result<void>;
}

// MFAコマンド
interface MfaCommands {
  EnableMfa(userId: UUID): Result<MfaSetup>;
  VerifyMfa(userId: UUID, code: string): Result<void>;
  DisableMfa(userId: UUID, code: string): Result<void>;
  GenerateBackupCodes(userId: UUID): Result<string[]>;
}
```

### クエリインターフェース

```typescript
// 認証クエリ
interface AuthenticationQueries {
  GetCurrentUser(sessionId: UUID): User;
  ValidateSession(sessionId: UUID): SessionInfo;
  GetUserSessions(userId: UUID): Session[];
  CheckPermission(userId: UUID, permission: string): boolean;
}

// ユーザークエリ
interface UserQueries {
  GetUser(userId: UUID): User;
  SearchUsers(criteria: SearchCriteria): User[];
  GetUserRoles(userId: UUID): Role[];
  GetUserPermissions(userId: UUID): Permission[];
  GetUserActivities(userId: UUID, period: DateRange): Activity[];
}

// 監査クエリ
interface AuditQueries {
  GetAuditLogs(filter: AuditFilter): AuditLog[];
  GetSecurityEvents(userId: UUID): SecurityEvent[];
  GetFailedLogins(period: DateRange): FailedLogin[];
  GenerateComplianceReport(type: string, period: DateRange): Report;
}

// ポリシークエリ
interface PolicyQueries {
  GetActivePolices(): Policy[];
  GetPolicyByType(type: PolicyType): Policy;
  EvaluatePolicy(policy: Policy, context: Context): PolicyResult;
  GetPolicyViolations(period: DateRange): Violation[];
}
```

## 9. 統合ポイント

### 外部システム連携

1. **LDAP/Active Directory**
   - ユーザー同期
   - グループマッピング
   - 認証委譲

2. **OAuth/SAML プロバイダー**
   - Google、Microsoft、Okta
   - シングルサインオン
   - JIT プロビジョニング

3. **SIEM システム**
   - リアルタイムログ転送
   - セキュリティアラート
   - インシデント管理

4. **暗号化サービス**
   - HSM 連携
   - 鍵管理システム
   - 証明書管理

### 他サービスとの連携

1. **通知サービス**
   - ログインアラート
   - パスワード期限通知
   - 異常検知通知

2. **プロジェクト管理サービス**
   - プロジェクトレベル権限
   - リソースアクセス制御
   - 活動ログ統合

3. **監査サービス**
   - 統合監査ログ
   - コンプライアンスレポート
   - 証跡管理

## 10. パフォーマンス要件

### レスポンスタイム
- 認証処理: < 200ms
- 権限チェック: < 50ms
- セッション検証: < 20ms
- MFA検証: < 100ms

### スループット
- 認証リクエスト: 10,000/秒
- 権限チェック: 100,000/秒
- 監査ログ書き込み: 50,000/秒

### 可用性
- システム稼働率: 99.99%
- 認証サービス: 99.999%
- 計画停止: 月1時間以内
- 災害復旧: RTO 1時間, RPO 5分

### セキュリティ要件
- 暗号化: AES-256
- ハッシュ: Argon2id
- TLS: 1.3以上
- 鍵長: RSA 4096bit / EC P-384