# セキュアアクセスサービス

## サービス概要
**名前**: secure-access-service
**表示名**: セキュアアクセスサービス
**説明**: 認証・認可・監査を通じて、システムへの安全なアクセスを保証

## ビジネス価値
- **効率化**: 業務プロセスの自動化と最適化
- **品質向上**: サービス品質の継続的改善
- **リスク低減**: 潜在的リスクの早期発見と対処

## ドメイン言語

## 1. ドメイン概要

### サービスの目的
組織のセキュリティを確保しながら、適切なアクセス制御と認証・認可を実現する。データ保護とコンプライアンス要件を満たし、セキュアなビジネス環境を提供する。

### 主要な価値提供
- ゼロトラストセキュリティの実現
- 多要素認証による強固な保護
- きめ細かなアクセス制御
- 監査証跡の完全性確保
- コンプライアンス要件の充足

## 2. エンティティ定義

### コアエンティティ

#### User（ユーザー）
**識別性**: ユーザーIDによって一意に識別される
**ライフサイクル**: 作成から非活性化まで（物理削除は行わない）

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ユーザーID |
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

#### Role（ロール）
**識別性**: ロールIDによって一意に識別される
**ライフサイクル**: 作成から削除まで

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

#### Permission（権限）
**識別性**: 権限IDによって一意に識別される
**ライフサイクル**: システム定義は不変、カスタム権限は作成から削除まで

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

#### Session（セッション）
**識別性**: セッションIDによって一意に識別される
**ライフサイクル**: 作成から期限切れまで

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

#### AuditLog（監査ログ）
**識別性**: ログIDによって一意に識別される
**ライフサイクル**: 作成のみ（変更・削除不可）

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

#### Policy（ポリシー）
**識別性**: ポリシーIDによって一意に識別される

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

#### ApiKey（APIキー）
**識別性**: キーIDによって一意に識別される

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

## 3. 値オブジェクト定義

### AuthenticationContext（認証コンテキスト）
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

### AccessRequest（アクセスリクエスト）
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

### SecurityEvent（セキュリティイベント）
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

### PasswordPolicy（パスワードポリシー）
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

### SessionPolicy（セッションポリシー）
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

## 4. 集約定義

### UserAggregate（ユーザー集約）
**集約ルート**: User
**包含エンティティ**:
- UserRole
- UserSession
- UserDevice
- UserPreference

**不変条件**:
- メールアドレスは組織内でユニーク
- パスワードはポリシーに準拠
- MFA有効時はシークレット必須
- ロックアウト中はログイン不可

### RoleAggregate（ロール集約）
**集約ルート**: Role
**包含エンティティ**:
- RolePermission
- RoleHierarchy

**不変条件**:
- システムロールは変更不可
- 権限の循環参照禁止
- 親ロールの権限を継承
- レベルは親より低い

### SessionAggregate（セッション集約）
**集約ルート**: Session
**包含エンティティ**:
- SessionActivity
- SessionToken

**不変条件**:
- 有効期限切れセッションは無効
- 同一ユーザーの同時セッション数制限
- 異常な活動パターンで自動終了

## 5. ドメインサービス

### AuthenticationService
```typescript
interface AuthenticationService {
  // 認証
  authenticate(credentials: Credentials): Result<AuthToken>;
  verifyMfa(userId: UUID, code: string): Result<void>;
  refreshToken(refreshToken: string): Result<AuthToken>;

  // パスワード管理
  changePassword(userId: UUID, oldPassword: string, newPassword: string): Result<void>;
  resetPassword(email: string): Result<void>;
  validatePasswordStrength(password: string): PasswordStrength;

  // MFA管理
  enableMfa(userId: UUID): Result<MfaSecret>;
  disableMfa(userId: UUID, code: string): Result<void>;
  generateBackupCodes(userId: UUID): Result<string[]>;
}
```

### AuthorizationService
```typescript
interface AuthorizationService {
  // アクセス制御
  authorize(request: AccessRequest): Result<AccessDecision>;
  checkPermission(userId: UUID, resource: string, action: string): boolean;
  getUserPermissions(userId: UUID): Permission[];

  // ロール管理
  assignRole(userId: UUID, roleId: UUID): Result<void>;
  removeRole(userId: UUID, roleId: UUID): Result<void>;
  createCustomRole(role: RoleDefinition): Result<Role>;

  // ポリシー評価
  evaluatePolicy(policy: Policy, context: Context): PolicyDecision;
  enforcePolicy(policyId: UUID, target: any): Result<void>;
}
```

### SessionManagementService
```typescript
interface SessionManagementService {
  // セッション管理
  createSession(userId: UUID, context: SessionContext): Result<Session>;
  validateSession(sessionId: UUID): Result<Session>;
  terminateSession(sessionId: UUID): Result<void>;
  terminateUserSessions(userId: UUID): Result<void>;

  // セッション監視
  detectAnomalies(sessionId: UUID): AnomalyReport;
  enforceSessionPolicy(session: Session): Result<void>;
  cleanupExpiredSessions(): Result<number>;
}
```

### AuditService
```typescript
interface AuditService {
  // 監査ログ
  logSecurityEvent(event: SecurityEvent): Result<void>;
  logAccessAttempt(attempt: AccessAttempt): Result<void>;
  logDataAccess(access: DataAccess): Result<void>;

  // 監査レポート
  generateComplianceReport(period: DateRange): ComplianceReport;
  detectSuspiciousActivity(userId: UUID): SuspiciousActivity[];
  exportAuditLogs(filter: AuditFilter): AuditExport;
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

## API仕様概要
- RESTful API設計
- JWT認証
- Rate Limiting実装
- OpenAPI仕様準拠

## データベース設計概要
- PostgreSQL/SQLite対応
- マイクロサービス対応
- 監査ログテーブル
- パフォーマンス最適化

## 提供ケーパビリティ
- アクセスを安全に管理する能力
