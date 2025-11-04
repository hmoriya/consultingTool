# OP-001: ユーザーを登録し認証する

**作成日**: 2025-10-31
**所属L3**: L3-001-identity-and-authentication: Identity And Authentication
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users

---

## 📋 How: この操作の定義

### 操作の概要
ユーザーを登録し認証するを実行し、ビジネス価値を創出する。

### 実現する機能
- ユーザーを登録し認証するに必要な情報の入力と検証
- ユーザーを登録し認証するプロセスの実行と進捗管理
- 結果の記録と関係者への通知
- 監査証跡の記録

### 入力
- 操作実行に必要なビジネス情報
- 実行者の認証情報と権限
- 関連エンティティの参照情報

### 出力
- 操作結果（成功/失敗）
- 更新されたエンティティ情報
- 監査ログと履歴情報
- 次のアクションへのガイダンス

---

## 📥 入力パラメータ

### ユーザー登録パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠、ドメイン検証 | ユーザーメールアドレス（一意） |
| username | STRING_50 | ○ | 英数字・ハイフン・アンダースコアのみ | ユーザー名（一意、3-50文字） |
| password | STRING_128 | ○ | パスワードポリシー準拠必須 | 初期パスワード（最小12文字、大小英数記号各1文字以上） |
| firstName | STRING_50 | ○ | XSS防止エスケープ | 名 |
| lastName | STRING_50 | ○ | XSS防止エスケープ | 姓 |
| phone | STRING_20 | × | E.164形式推奨 | 電話番号（MFA用） |
| organizationId | UUID | × | 組織存在確認 | 所属組織ID（BC-004連携） |
| initialRole | STRING_50 | × | 許可ロールリスト検証 | 初期ロール（デフォルト: TEAM_MEMBER） |

### 認証パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| identifier | STRING_255 | ○ | email or username | ログイン識別子（emailまたはusername） |
| password | STRING_128 | ○ | タイミング攻撃対策（固定時間比較） | パスワード |
| mfaCode | STRING_6 | △ | MFA有効時必須、6桁数字、30秒有効 | 多要素認証コード（TOTP） |
| ipAddress | IP_ADDRESS | ○ | IPv4/IPv6、地理情報取得 | クライアントIPアドレス |
| userAgent | STRING_500 | ○ | パターン分析 | ユーザーエージェント文字列 |
| rememberMe | BOOLEAN | × | デフォルトfalse | セッション延長フラグ（7日→30日） |

### セキュリティコンテキスト

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| requestId | UUID | ○ | トレーシング用 | リクエスト一意識別子 |
| timestamp | TIMESTAMP | ○ | リプレイ攻撃防止（5分以内） | リクエストタイムスタンプ |
| deviceFingerprint | STRING_256 | × | デバイス識別 | デバイスフィンガープリント |
| geoLocation | JSON | × | 不審アクティビティ検知 | クライアント地理情報 |

---

## 📤 出力仕様

### 成功レスポンス（登録）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "username": "john_doe",
    "status": "inactive",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+81-90-1234-5678"
    },
    "createdAt": "2025-11-04T10:00:00Z",
    "verificationRequired": true,
    "verificationEmail": {
      "sent": true,
      "expiresAt": "2025-11-04T22:00:00Z"
    }
  },
  "message": "ユーザー登録成功。確認メールを送信しました。",
  "nextActions": [
    "メール確認によるアカウント有効化",
    "MFA設定（推奨）"
  ]
}
```

### 成功レスポンス（認証）

```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "username": "john_doe",
      "status": "active",
      "roles": ["TEAM_MEMBER"],
      "mfaEnabled": false,
      "lastLoginAt": "2025-11-04T10:00:00Z"
    },
    "session": {
      "sessionId": "uuid",
      "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresIn": 3600,
      "expiresAt": "2025-11-04T11:00:00Z"
    },
    "permissions": [
      "project:read",
      "task:write",
      "timesheet:write"
    ]
  },
  "message": "認証成功",
  "securityAlerts": []
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP001_001 | パスワードポリシー違反 | パスワード再入力（12文字以上、複雑性要件満たす） | ○（即座） |
| 400 | ERR_BC003_L3001_OP001_002 | メールアドレス形式不正 | 正しいメール形式で再入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP001_003 | 認証情報不正（ユーザー名/パスワード誤り） | 正しい認証情報で再入力 | ○（5回まで） |
| 401 | ERR_BC003_L3001_OP001_004 | MFAコード不正/期限切れ | 新しいMFAコードで再認証 | ○（3回まで） |
| 403 | ERR_BC003_L3001_OP001_005 | アカウントロック中 | 30分待機またはパスワードリセット | ×（時間経過必要） |
| 403 | ERR_BC003_L3001_OP001_006 | アカウント停止中（管理者による） | 管理者に連絡 | × |
| 403 | ERR_BC003_L3001_OP001_007 | メール未確認（inactive状態） | 確認メール再送信してアカウント有効化 | × |
| 409 | ERR_BC003_L3001_OP001_008 | メールアドレス重複 | 別のメールアドレスで登録 | × |
| 409 | ERR_BC003_L3001_OP001_009 | ユーザー名重複 | 別のユーザー名で登録 | × |
| 429 | ERR_BC003_L3001_OP001_010 | レート制限超過（5分間に10回） | 待機後再試行 | ○（5分後） |
| 500 | ERR_BC003_L3001_OP001_011 | JWT生成失敗 | 管理者に連絡 | ○（指数バックオフ） |
| 503 | ERR_BC003_L3001_OP001_012 | メール送信サービス障害 | 後で確認メール再送信 | ○（後で） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP001_001",
    "message": "パスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "大文字が含まれていません",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true
      }
    },
    "timestamp": "2025-11-04T10:00:00Z",
    "requestId": "uuid",
    "retryable": true
  }
}
```

---

## 🛠️ 実装ガイダンス

### 利用する集約とエンティティ

#### 1. User Aggregate（認証ドメイン）

**集約ルート**: `User`

**責務**:
- ユーザー登録時のバリデーションと作成
- 認証情報検証（パスワードハッシュ比較）
- セッション作成とトークン発行
- ログイン失敗カウントとアカウントロック管理

**主要メソッド**:
```typescript
class UserAggregate {
  // 登録
  static create(email, username, password, profile): User
  validatePasswordPolicy(password): ValidationResult

  // 認証
  authenticate(password, mfaCode?): AuthenticationResult
  verifyPassword(plainPassword): boolean
  verifyMfaCode(code): boolean

  // セッション管理
  createSession(ipAddress, userAgent): Session
  enforceMaxSessions(maxCount: 5): void

  // セキュリティ
  recordLoginFailure(): void  // 5回で自動ロック
  isLocked(): boolean
  unlock(): void

  // 状態管理
  activate(): void  // inactive → active
  suspend(reason): void  // active → suspended
}
```

#### 2. Credential Value Object（認証情報）

**責務**:
- パスワードハッシュの生成と検証
- bcrypt ワークファクター 12
- タイミング攻撃対策（固定時間比較）

**実装**:
```typescript
class Credential {
  constructor(
    private readonly passwordHash: string,  // bcrypt hash
    private readonly salt: string,
    private readonly algorithm: 'bcrypt',
    private readonly lastChangedAt: Date
  ) {}

  verify(plainPassword: string): boolean {
    // 固定時間比較でタイミング攻撃防止
    const hash = bcrypt.hashSync(plainPassword, this.salt);
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(this.passwordHash)
    );
  }

  isExpired(policyExpirationDays: 90): boolean {
    const daysSinceChange = (Date.now() - this.lastChangedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceChange > policyExpirationDays;
  }
}
```

#### 3. Session Aggregate（セッション管理）

**集約ルート**: `Session`

**責務**:
- JWTトークン生成（RS256アルゴリズム）
- アクセストークン（1時間）とリフレッシュトークン（7日）
- セッション有効性検証
- アクティビティ追跡

**JWT構造**:
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id-2025"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "roles": ["TEAM_MEMBER"],
    "permissions": ["project:read", "task:write"],
    "iat": 1730707200,
    "exp": 1730710800,
    "jti": "session-uuid",
    "iss": "bc-003-auth-service",
    "aud": "consulting-dashboard"
  }
}
```

#### 4. AuditLog Aggregate（監査ログ）

**責務**:
- すべての認証試行を記録（成功/失敗）
- 不変性保証（作成後変更不可）
- セキュリティイベントの記録

**記録項目**:
```typescript
interface AuditLog {
  logId: UUID;
  userId: UUID;
  action: 'USER_REGISTRATION' | 'USER_LOGIN' | 'MFA_VERIFICATION';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  geoLocation?: { country: string; city: string };
  failureReason?: string;
  recordedAt: Timestamp;
  metadata: {
    mfaEnabled?: boolean;
    sessionId?: UUID;
    deviceFingerprint?: string;
  };
}
```

### ドメインサービス連携

#### 1. AuthenticationService（認証統括）

**責務**: ユーザー認証の全体フロー統括

**実装フロー**:
```typescript
class AuthenticationService {
  async authenticateUser(
    identifier: string,
    password: string,
    mfaCode?: string,
    context: SecurityContext
  ): Promise<AuthenticationResult> {
    // 1. ユーザー取得（email or username）
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user) {
      await this.recordFailure(null, 'USER_NOT_FOUND', context);
      throw new AuthenticationError('ERR_BC003_L3001_OP001_003');
    }

    // 2. ユーザー状態チェック
    if (user.status === 'inactive') {
      throw new AuthenticationError('ERR_BC003_L3001_OP001_007');
    }
    if (user.status === 'suspended') {
      throw new AuthenticationError('ERR_BC003_L3001_OP001_006');
    }

    // 3. アカウントロックチェック
    if (user.isLocked()) {
      throw new AuthenticationError('ERR_BC003_L3001_OP001_005');
    }

    // 4. 不審なアクティビティ検知
    const suspiciousCheck = await this.securityMonitoring.detectSuspicious(
      user.id,
      context.ipAddress
    );
    if (suspiciousCheck.suspicious && suspiciousCheck.riskScore > 75) {
      // MFA強制
      if (!user.mfaEnabled || !mfaCode) {
        throw new AuthenticationError('ERR_BC003_L3001_OP001_004', {
          message: '不審なアクティビティを検知。MFA認証が必要です'
        });
      }
    }

    // 5. パスワード検証（タイミング攻撃対策）
    if (!user.credential.verify(password)) {
      user.recordLoginFailure();  // 失敗カウント増加（5回でロック）
      await this.userRepository.save(user);
      await this.recordFailure(user.id, 'INVALID_PASSWORD', context);
      throw new AuthenticationError('ERR_BC003_L3001_OP001_003');
    }

    // 6. MFA検証（有効な場合）
    if (user.mfaEnabled) {
      if (!mfaCode) {
        throw new AuthenticationError('ERR_BC003_L3001_OP001_004', {
          message: 'MFAコードが必要です'
        });
      }
      if (!this.totpService.verify(user.mfaSecret, mfaCode)) {
        await this.recordFailure(user.id, 'INVALID_MFA_CODE', context);
        throw new AuthenticationError('ERR_BC003_L3001_OP001_004');
      }
    }

    // 7. セッション作成
    const session = user.createSession(context.ipAddress, context.userAgent);
    await this.sessionRepository.save(session);

    // 8. ログイン成功記録
    user.resetLoginFailures();
    user.updateLastLoginAt();
    await this.userRepository.save(user);

    // 9. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'USER_LOGIN',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: { sessionId: session.id, mfaVerified: user.mfaEnabled }
    });

    // 10. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(new UserAuthenticated(user.id, session.id, context));

    return {
      success: true,
      user,
      session,
      securityAlerts: suspiciousCheck.suspicious ? suspiciousCheck.reasons : []
    };
  }
}
```

#### 2. PasswordPolicyService（パスワードポリシー）

**責務**: パスワード要件の検証とハッシュ生成

**実装**:
```typescript
class PasswordPolicyService {
  validatePassword(password: string, userId?: string): ValidationResult {
    const policy = this.securityPolicyRepository.getPasswordPolicy();
    const errors: string[] = [];

    // 最小文字数
    if (password.length < policy.minLength) {
      errors.push(`最小${policy.minLength}文字必要（現在: ${password.length}文字）`);
    }

    // 複雑性要件
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }
    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }
    if (policy.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }
    if (policy.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    // 過去パスワード再利用チェック（登録時は不要）
    if (userId) {
      const history = this.passwordHistoryRepository.findRecent(userId, 3);
      for (const hist of history) {
        if (hist.verify(password)) {
          errors.push('過去3回のパスワードは使用できません');
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      policyRequirements: policy
    };
  }

  hashPassword(plainPassword: string): Credential {
    const salt = bcrypt.genSaltSync(12);  // ワークファクター12
    const hash = bcrypt.hashSync(plainPassword, salt);
    return new Credential(hash, salt, 'bcrypt', new Date());
  }
}
```

#### 3. SecurityMonitoringService（セキュリティ監視）

**責務**: 不審なアクティビティの検知とリスク評価

**実装**:
```typescript
class SecurityMonitoringService {
  async detectSuspicious(
    userId: string,
    ipAddress: string,
    context: SecurityContext
  ): Promise<SuspiciousActivityResult> {
    const reasons: string[] = [];
    let riskScore = 0;

    // 1. 地理的異常
    const location = await this.geoLocationService.lookup(ipAddress);
    const normalLocations = await this.getUserNormalLocations(userId);
    if (!normalLocations.includes(location.country)) {
      reasons.push('UNUSUAL_LOGIN_LOCATION');
      riskScore += 30;
    }

    // 2. 短時間での大量ログイン失敗
    const recentFailures = await this.auditLogRepository.countRecentFailures(
      userId,
      10  // 10分以内
    );
    if (recentFailures >= 3) {
      reasons.push('MULTIPLE_LOGIN_FAILURES');
      riskScore += 40;
    }

    // 3. 異常な時間帯（深夜0-5時）
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour <= 5) {
      const midnightRate = await this.calculateMidnightAccessRate(userId);
      if (midnightRate < 0.05) {  // 通常5%未満
        reasons.push('UNUSUAL_ACCESS_TIME');
        riskScore += 20;
      }
    }

    // 4. デバイスフィンガープリント異常
    if (context.deviceFingerprint) {
      const knownDevices = await this.getKnownDevices(userId);
      if (!knownDevices.includes(context.deviceFingerprint)) {
        reasons.push('UNKNOWN_DEVICE');
        riskScore += 25;
      }
    }

    // 5. リスクスコアによるアクション
    if (riskScore >= 100) {
      // criticalレベル: アカウント一時停止
      await this.eventBus.publish(
        new SecurityViolationDetected(userId, 'HIGH_RISK_LOGIN', 'critical')
      );
    } else if (riskScore >= 75) {
      // highレベル: MFA強制
      await this.eventBus.publish(
        new SuspiciousActivityDetected(userId, reasons, riskScore)
      );
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
      riskScore
    };
  }
}
```

### BC間連携

#### BC-007 (Communication) への通知

**イベント駆動（非同期）**:

1. **UserCreated** → ウェルカムメール送信
2. **UserAuthenticated** → ログイン通知（オプション）
3. **SuspiciousActivityDetected** → セキュリティアラート

```typescript
// BC-007イベントサブスクライバ
class UserCreatedNotificationHandler {
  async handle(event: UserCreated): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'welcome_email',
      data: {
        username: event.username,
        verificationLink: this.generateVerificationLink(event.userId),
        expiresIn: '12時間'
      }
    });
  }
}
```

#### BC-004 (Organizational Structure) への組織割り当て

**イベント駆動（非同期）**:

```typescript
class UserCreatedOrgAssignmentHandler {
  async handle(event: UserCreated): Promise<void> {
    if (event.organizationId) {
      await this.organizationService.assignUserToOrganization(
        event.userId,
        event.organizationId,
        'MEMBER'  // デフォルトロール
      );
    } else {
      // デフォルト組織に割り当て
      const defaultOrg = await this.organizationService.getDefaultOrganization();
      await this.organizationService.assignUserToOrganization(
        event.userId,
        defaultOrg.id,
        'MEMBER'
      );
    }
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **タイミング攻撃対策**: crypto.timingSafeEqual() 使用
- [ ] **JWT署名**: RS256アルゴリズム（非対称鍵）
- [ ] **トークン有効期限**: アクセストークン 1時間、リフレッシュトークン 7日
- [ ] **セッション数制限**: 最大5セッション、超過時は古いセッション無効化
- [ ] **ログイン失敗制限**: 5回失敗で30分ロック
- [ ] **MFA実装**: TOTP（RFC 6238）、6桁コード、30秒ウィンドウ
- [ ] **監査ログ**: すべての認証試行を不変ログとして記録
- [ ] **レート制限**: 5分間に10リクエストまで
- [ ] **CORS設定**: 許可オリジンの厳格な制限
- [ ] **CSRFトークン**: 状態変更操作に必須
- [ ] **XSS対策**: 入力値のサニタイズとエスケープ
- [ ] **SQLインジェクション対策**: パラメータ化クエリ使用

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP001_001 | バリデーション | 即座リトライ可 | パスワード修正して再送信 |
| ERR_BC003_L3001_OP001_002 | バリデーション | 即座リトライ可 | メールアドレス修正 |
| ERR_BC003_L3001_OP001_003 | 認証失敗 | 5回までリトライ可 | 正しい認証情報入力、5回失敗でロック |
| ERR_BC003_L3001_OP001_004 | MFA失敗 | 3回までリトライ可 | 新しいMFAコード生成して再入力 |
| ERR_BC003_L3001_OP001_005 | アカウントロック | リトライ不可 | 30分待機またはパスワードリセット |
| ERR_BC003_L3001_OP001_006 | アカウント停止 | リトライ不可 | 管理者に問い合わせ |
| ERR_BC003_L3001_OP001_007 | メール未確認 | リトライ不可 | 確認メール再送信 |
| ERR_BC003_L3001_OP001_008 | メール重複 | リトライ不可 | 別メールアドレスで登録 |
| ERR_BC003_L3001_OP001_009 | ユーザー名重複 | リトライ不可 | 別ユーザー名で登録 |
| ERR_BC003_L3001_OP001_010 | レート制限 | 5分後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP001_011 | JWT生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |
| ERR_BC003_L3001_OP001_012 | メール送信失敗 | 遅延リトライ | 5分後、15分後、1時間後 |

### 指数バックオフ実装

```typescript
class ExponentialBackoffRetry {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: {
      maxRetries: number;
      initialDelayMs: number;
      maxDelayMs: number;
      retryableErrors: string[];
    }
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // リトライ可能エラーかチェック
        if (!config.retryableErrors.includes(error.code)) {
          throw error;
        }

        // 最大リトライ回数チェック
        if (attempt === config.maxRetries) {
          throw error;
        }

        // 指数バックオフ計算
        const delayMs = Math.min(
          config.initialDelayMs * Math.pow(2, attempt),
          config.maxDelayMs
        );

        // ジッター追加（ランダム ±20%）
        const jitterMs = delayMs * (0.8 + Math.random() * 0.4);

        await this.delay(jitterMs);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 使用例
const result = await retryService.executeWithRetry(
  () => jwtService.generateAccessToken(user),
  {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    retryableErrors: ['ERR_BC003_L3001_OP001_011']
  }
);
```

### セキュリティロギング

#### 1. 認証成功ログ

```typescript
{
  "level": "info",
  "eventType": "USER_LOGIN_SUCCESS",
  "userId": "uuid",
  "username": "john_doe",
  "ipAddress": "203.0.113.45",
  "userAgent": "Mozilla/5.0...",
  "geoLocation": { "country": "Japan", "city": "Tokyo" },
  "mfaVerified": false,
  "sessionId": "uuid",
  "timestamp": "2025-11-04T10:00:00Z",
  "requestId": "uuid"
}
```

#### 2. 認証失敗ログ

```typescript
{
  "level": "warning",
  "eventType": "USER_LOGIN_FAILURE",
  "userId": "uuid",
  "username": "john_doe",
  "failureReason": "INVALID_PASSWORD",
  "ipAddress": "203.0.113.45",
  "userAgent": "Mozilla/5.0...",
  "failedAttempts": 3,
  "accountLocked": false,
  "timestamp": "2025-11-04T10:00:00Z",
  "requestId": "uuid"
}
```

#### 3. セキュリティアラートログ

```typescript
{
  "level": "critical",
  "eventType": "SUSPICIOUS_ACTIVITY_DETECTED",
  "userId": "uuid",
  "reasons": [
    "UNUSUAL_LOGIN_LOCATION",
    "MULTIPLE_LOGIN_FAILURES"
  ],
  "riskScore": 70,
  "ipAddress": "198.51.100.23",
  "geoLocation": { "country": "Unknown", "city": "Unknown" },
  "actionTaken": "MFA_ENFORCEMENT",
  "timestamp": "2025-11-04T10:00:00Z",
  "requestId": "uuid"
}
```

### モニタリングとアラート

#### Prometheus メトリクス

```prometheus
# 認証試行カウンタ
bc003_authentication_attempts_total{result="success|failure",mfa="true|false"} 12345

# 認証失敗率
bc003_authentication_failure_rate 0.05

# アカウントロック数
bc003_account_locks_total 23

# セッション作成カウンタ
bc003_sessions_created_total 10234

# 不審なアクティビティ検知数
bc003_suspicious_activity_detected_total{risk_level="low|medium|high|critical"} 156

# 平均認証レスポンス時間
bc003_authentication_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_authentication_alerts
    rules:
      # 認証失敗率が10%を超えたらアラート
      - alert: HighAuthenticationFailureRate
        expr: bc003_authentication_failure_rate > 0.1
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "認証失敗率が高い"
          description: "過去5分間の認証失敗率が {{ $value }}%"

      # 1時間に10件以上のアカウントロックでアラート
      - alert: FrequentAccountLocks
        expr: rate(bc003_account_locks_total[1h]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "頻繁なアカウントロック"
          description: "過去1時間に {{ $value }}件のアカウントロック"

      # criticalレベルのセキュリティイベントで即座アラート
      - alert: CriticalSecurityEvent
        expr: increase(bc003_suspicious_activity_detected_total{risk_level="critical"}[5m]) > 0
        labels:
          severity: critical
          bc: BC-003
        annotations:
          summary: "重大なセキュリティイベント検知"
          description: "critical レベルのセキュリティイベントが {{ $value }}件発生"
```

### サーキットブレーカーパターン

外部依存サービス（メール送信、地理情報取得）の障害を検知してフォールバック：

```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: Date;

  constructor(
    private readonly threshold: number = 5,  // 5回失敗でOPEN
    private readonly timeout: number = 60000  // 60秒後にHALF_OPENへ
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    fallback: () => T
  ): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        // サーキット開放中: フォールバック実行
        return fallback();
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// 使用例: メール送信のサーキットブレーカー
const emailCircuitBreaker = new CircuitBreaker(5, 60000);

await emailCircuitBreaker.execute(
  () => emailService.sendVerificationEmail(user.email),
  () => {
    // フォールバック: 後でメール送信キューに追加
    messageQueue.enqueue({
      type: 'VERIFICATION_EMAIL',
      userId: user.id,
      email: user.email,
      retryAt: Date.now() + 300000  // 5分後
    });
    return { sent: false, queued: true };
  }
);
```

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
> 
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/](../../../../../../services/secure-access-service/capabilities/authenticate-and-manage-users/operations/register-and-authenticate-users/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
