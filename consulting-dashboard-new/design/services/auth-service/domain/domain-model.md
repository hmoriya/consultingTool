# 認証サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
認証サービスに関連するドメインモデルを定義する。認証、認可、セッション管理、監査ログなどのセキュリティ機能を管理する。

## エンティティ

### AuthUser（認証ユーザー）
```
AuthUser {
  id: string
  email: string
  hashedPassword: string
  passwordSalt: string
  isEmailVerified: boolean
  isActive: boolean
  isMFAEnabled: boolean
  mfaSecret: string?
  loginAttempts: number
  lastLoginAt: DateTime?
  lastPasswordChange: DateTime
  passwordExpiry: DateTime?
  lockedUntil: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Session（セッション）
```
Session {
  id: string
  token: string
  userId: string
  deviceInfo: DeviceInfo
  ipAddress: string
  location: Location?
  isActive: boolean
  createdAt: DateTime
  lastActivityAt: DateTime
  expiresAt: DateTime
  refreshToken: string?
  refreshTokenExpiresAt: DateTime?
}
```

### DeviceInfo（デバイス情報）
```
DeviceInfo {
  userAgent: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  device: string
  deviceId: string?
}
```

### Location（位置情報）
```
Location {
  country: string
  region: string?
  city: string?
  latitude: number?
  longitude: number?
}
```

### AuthToken（認証トークン）
```
AuthToken {
  id: string
  type: TokenType
  token: string
  userId: string
  purpose: string
  used: boolean
  usedAt: DateTime?
  expiresAt: DateTime
  createdAt: DateTime
  metadata: JSON?
}

enum TokenType {
  PASSWORD_RESET     // パスワードリセット
  EMAIL_VERIFICATION // メール確認
  MFA_SETUP         // MFA設定
  API_KEY           // APIキー
  INVITE            // 招待
}
```

### MFAMethod（多要素認証方法）
```
MFAMethod {
  id: string
  userId: string
  method: MFAType
  isEnabled: boolean
  isPrimary: boolean
  verifiedAt: DateTime?
  configuration: MFAConfiguration
  backupCodes: BackupCode[]?
  createdAt: DateTime
  updatedAt: DateTime
}

enum MFAType {
  TOTP              // Time-based One-Time Password
  SMS               // SMS認証
  EMAIL             // メール認証
  BIOMETRIC         // 生体認証
  HARDWARE_KEY      // ハードウェアキー
}
```

### MFAConfiguration（MFA設定）
```
MFAConfiguration {
  secret: string?
  phoneNumber: string?
  email: string?
  publicKey: string?
  algorithm: string?
}
```

### BackupCode（バックアップコード）
```
BackupCode {
  code: string
  used: boolean
  usedAt: DateTime?
}
```

### LoginAttempt（ログイン試行）
```
LoginAttempt {
  id: string
  email: string
  userId: string?
  success: boolean
  failureReason: LoginFailureReason?
  ipAddress: string
  deviceInfo: DeviceInfo
  location: Location?
  attemptedAt: DateTime
  suspiciousFlags: string[]
}

enum LoginFailureReason {
  INVALID_CREDENTIALS
  ACCOUNT_LOCKED
  ACCOUNT_INACTIVE
  MFA_REQUIRED
  MFA_FAILED
  SESSION_EXPIRED
  SUSPICIOUS_ACTIVITY
}
```

### PasswordHistory（パスワード履歴）
```
PasswordHistory {
  id: string
  userId: string
  hashedPassword: string
  passwordSalt: string
  createdAt: DateTime
}
```

### Permission（権限）
```
Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
  scope: PermissionScope?
  conditions: PermissionCondition[]
  createdAt: DateTime
}

enum PermissionScope {
  GLOBAL            // 全体
  ORGANIZATION      // 組織内
  DEPARTMENT        // 部門内
  PROJECT           // プロジェクト内
  SELF              // 自分のみ
}
```

### PermissionCondition（権限条件）
```
PermissionCondition {
  field: string
  operator: ConditionOperator
  value: any
}

enum ConditionOperator {
  EQUALS
  NOT_EQUALS
  CONTAINS
  IN
  NOT_IN
  GREATER_THAN
  LESS_THAN
}
```

### Role（ロール）
```
Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: RolePermission[]
  isSystem: boolean
  priority: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

### RolePermission（ロール権限）
```
RolePermission {
  roleId: string
  permissionId: string
  grantedBy: string
  grantedAt: DateTime
}
```

### UserRole（ユーザーロール）
```
UserRole {
  id: string
  userId: string
  roleId: string
  scope: RoleScope
  scopeId: string?     // プロジェクトID、部門IDなど
  validFrom: DateTime
  validUntil: DateTime?
  grantedBy: string
  grantedAt: DateTime
}
```

### RoleScope（ロールスコープ）
```
RoleScope {
  type: ScopeType
  constraints: JSON?
}

enum ScopeType {
  GLOBAL
  ORGANIZATION
  DEPARTMENT
  PROJECT
  CUSTOM
}
```

### AuditLog（監査ログ）
```
AuditLog {
  id: string
  userId: string?
  sessionId: string?
  action: string
  resource: string
  resourceId: string?
  result: ActionResult
  details: JSON?
  changes: ChangeLog?
  ipAddress: string
  userAgent: string?
  duration: number?    // ミリ秒
  errorMessage: string?
  createdAt: DateTime
}

enum ActionResult {
  SUCCESS
  FAILURE
  PARTIAL
}
```

### ChangeLog（変更ログ）
```
ChangeLog {
  before: JSON?
  after: JSON?
  fields: string[]
}
```

### SecurityPolicy（セキュリティポリシー）
```
SecurityPolicy {
  id: string
  name: string
  type: PolicyType
  rules: PolicyRule[]
  isActive: boolean
  priority: number
  appliesTo: PolicyScope[]
  createdBy: string
  createdAt: DateTime
  updatedAt: DateTime
}

enum PolicyType {
  PASSWORD          // パスワードポリシー
  SESSION           // セッションポリシー
  MFA               // MFAポリシー
  ACCESS_CONTROL    // アクセス制御ポリシー
  DATA_RETENTION    // データ保持ポリシー
}
```

### PolicyRule（ポリシールール）
```
PolicyRule {
  name: string
  condition: string
  value: any
  enforcement: EnforcementLevel
}

enum EnforcementLevel {
  REQUIRED          // 必須
  RECOMMENDED       // 推奨
  OPTIONAL          // オプション
}
```

### PolicyScope（ポリシー適用範囲）
```
PolicyScope {
  type: string       // "role", "organization", "user"
  id: string?
  exceptions: string[]
}
```

### APIKey（APIキー）
```
APIKey {
  id: string
  name: string
  key: string        // ハッシュ化
  prefix: string     // 表示用プレフィックス
  userId: string
  permissions: string[]
  rateLimit: RateLimit?
  ipWhitelist: string[]
  validFrom: DateTime
  validUntil: DateTime?
  lastUsedAt: DateTime?
  usageCount: number
  isActive: boolean
  createdAt: DateTime
}
```

### RateLimit（レート制限）
```
RateLimit {
  requests: number
  period: string     // "1h", "1d", etc.
  burst: number?
}
```

### SecurityEvent（セキュリティイベント）
```
SecurityEvent {
  id: string
  type: SecurityEventType
  severity: EventSeverity
  userId: string?
  description: string
  metadata: JSON
  ipAddress: string?
  resolved: boolean
  resolvedBy: string?
  resolvedAt: DateTime?
  createdAt: DateTime
}

enum SecurityEventType {
  BRUTE_FORCE_ATTEMPT
  SUSPICIOUS_LOGIN
  PRIVILEGE_ESCALATION
  DATA_BREACH_ATTEMPT
  POLICY_VIOLATION
  CONFIGURATION_CHANGE
}

enum EventSeverity {
  INFO
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

## 値オブジェクト

### Email（メールアドレス）
```
Email {
  value: string
  
  validate(): boolean
  normalize(): string
  domain(): string
}
```

### Password（パスワード）
```
Password {
  value: string
  
  validate(policy: PasswordPolicy): boolean
  strength(): PasswordStrength
  hash(salt: string): string
}

enum PasswordStrength {
  VERY_WEAK
  WEAK
  FAIR
  STRONG
  VERY_STRONG
}
```

### PasswordPolicy（パスワードポリシー）
```
PasswordPolicy {
  minLength: number
  maxLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventCommonPasswords: boolean
  preventUserInfo: boolean
  historyCount: number
  expiryDays: number?
}
```

### IPAddress（IPアドレス）
```
IPAddress {
  value: string
  version: number    // 4 or 6
  
  validate(): boolean
  isPrivate(): boolean
  isReserved(): boolean
  toNumber(): number
}
```

### UserAgent（ユーザーエージェント）
```
UserAgent {
  raw: string
  browser: BrowserInfo
  os: OSInfo
  device: DeviceInfo
  
  parse(): void
  isBot(): boolean
  isMobile(): boolean
}
```

### TokenClaims（トークンクレーム）
```
TokenClaims {
  sub: string        // Subject (user ID)
  iat: number        // Issued at
  exp: number        // Expiration
  iss: string        // Issuer
  aud: string[]      // Audience
  scope: string[]    // Permissions
  sessionId: string?
  deviceId: string?
}
```

## 集約ルート

- `AuthUser`: 認証ユーザーの集約ルート
- `Session`: セッション管理の集約ルート
- `Role`: ロール管理の集約ルート
- `SecurityPolicy`: セキュリティポリシーの集約ルート

## ドメインサービス

### AuthenticationService
- ユーザー認証
- パスワード検証
- MFA処理
- セッション作成

### AuthorizationService
- 権限チェック
- ロール評価
- スコープ検証
- 条件評価

### SessionManagementService
- セッション作成・更新
- セッション無効化
- 同時セッション管理
- セッション分析

### SecurityService
- セキュリティポリシー適用
- 脅威検知
- 監査ログ記録
- セキュリティイベント処理

### TokenService
- トークン生成・検証
- リフレッシュトークン管理
- APIキー管理
- トークン無効化