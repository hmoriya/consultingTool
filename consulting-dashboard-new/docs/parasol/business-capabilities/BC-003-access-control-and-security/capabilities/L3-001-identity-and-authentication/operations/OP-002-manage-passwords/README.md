# OP-002: パスワードを管理する

**作成日**: 2025-10-31
**所属L3**: L3-001-identity-and-authentication: Identity And Authentication
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/authenticate-and-manage-users/operations/manage-passwords

---
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
---
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
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
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
---
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
---
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
---
## 📥 入力パラメータ

### パスワード変更パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| userId | UUID | ○ | 認証済みユーザーのみ | 対象ユーザーID |
| currentPassword | STRING_128 | ○ | タイミング攻撃対策 | 現在のパスワード（本人確認） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード（最小12文字、複雑性要件） |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |
| reason | ENUM | × | MANUAL / EXPIRED / POLICY_CHANGE | 変更理由 |

### パスワードリセットパラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| email | EMAIL | ○ | RFC5322準拠 | リセット対象ユーザーのメールアドレス |
| resetToken | STRING_256 | ○ | 有効期限1時間、1回限り | リセットトークン（メールで送信） |
| newPassword | STRING_128 | ○ | パスワードポリシー準拠 | 新パスワード |
| newPasswordConfirm | STRING_128 | ○ | newPasswordと一致必須 | 新パスワード確認 |

### パスワードポリシー取得パラメータ

| パラメータ名 | 型 | 必須 | セキュリティ制約 | 説明 |
|------------|----|----|---------------|------|
| organizationId | UUID | × | 組織別ポリシー取得 | 組織ID（省略時はシステムデフォルト） |

---

## 📤 出力仕様

### 成功レスポンス（パスワード変更）

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "passwordChangedAt": "2025-11-04T10:00:00Z",
    "passwordExpiresAt": "2026-02-02T10:00:00Z",
    "sessionInvalidated": true,
    "newSessionRequired": true
  },
  "message": "パスワードを変更しました。すべてのセッションが無効化されました。",
  "nextActions": [
    "新しいパスワードで再ログイン",
    "パスワードマネージャーへの保存推奨"
  ]
}
```

### 成功レスポンス（パスワードリセット要求）

```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "resetEmailSent": true,
    "resetTokenExpiresAt": "2025-11-04T11:00:00Z",
    "resetLinkValidFor": "1時間"
  },
  "message": "パスワードリセット用のメールを送信しました",
  "nextActions": [
    "メール内のリンクをクリックしてパスワードをリセット"
  ]
}
```

### 成功レスポンス（パスワードポリシー取得）

```json
{
  "success": true,
  "data": {
    "policy": {
      "minLength": 12,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireDigit": true,
      "requireSpecialChar": true,
      "expirationDays": 90,
      "preventReuseLast": 3,
      "maxFailedAttempts": 5,
      "lockoutDurationMinutes": 30
    },
    "examples": {
      "valid": "MyP@ssw0rd2025!",
      "invalid": [
        "password123 (記号なし)",
        "PASSWORD123! (小文字なし)",
        "Pass@123 (12文字未満)"
      ]
    }
  }
}
```

### エラーレスポンス

| HTTPステータス | エラーコード | 説明 | 対処方法 | リトライ可否 |
|--------------|-----------|------|---------|-----------|
| 400 | ERR_BC003_L3001_OP002_001 | 新パスワードがポリシー違反 | パスワードポリシーに従って再入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_002 | 新パスワード確認不一致 | パスワード確認欄を正しく入力 | ○（即座） |
| 400 | ERR_BC003_L3001_OP002_003 | 過去パスワード再利用 | 過去3回と異なるパスワード入力 | ○（即座） |
| 401 | ERR_BC003_L3001_OP002_004 | 現在パスワード不正 | 正しい現在パスワード入力 | ○（3回まで） |
| 401 | ERR_BC003_L3001_OP002_005 | リセットトークン無効/期限切れ | リセット要求を再実行 | × |
| 404 | ERR_BC003_L3001_OP002_006 | ユーザーが存在しない | 正しいメールアドレス入力 | × |
| 429 | ERR_BC003_L3001_OP002_007 | リセット要求レート制限（1時間に3回） | 1時間待機後再試行 | ○（1時間後） |
| 500 | ERR_BC003_L3001_OP002_008 | パスワードハッシュ生成失敗 | 管理者に連絡 | ○（指数バックオフ） |

```json
{
  "success": false,
  "error": {
    "code": "ERR_BC003_L3001_OP002_001",
    "message": "新しいパスワードがポリシー要件を満たしていません",
    "details": {
      "violations": [
        "最小12文字必要（現在: 8文字）",
        "記号が含まれていません"
      ],
      "policyRequirements": {
        "minLength": 12,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireDigit": true,
        "requireSpecialChar": true,
        "expirationDays": 90,
        "preventReuseLast": 3
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

#### 1. User Aggregate（パスワードライフサイクル）

**集約ルート**: `User`

**責務**:
- パスワード変更の実行と検証
- パスワード履歴の管理
- パスワード有効期限の管理

**主要メソッド**:
```typescript
class UserAggregate {
  // パスワード変更
  changePassword(
    currentPassword: string,
    newPassword: string,
    reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE'
  ): void {
    // 1. 現在パスワード検証
    if (!this.credential.verify(currentPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_004');
    }

    // 2. 新パスワードポリシー検証
    const validation = this.passwordPolicyService.validatePassword(
      newPassword,
      this.id
    );
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', validation.errors);
    }

    // 3. 過去パスワード再利用チェック
    if (this.isPasswordReused(newPassword)) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_003');
    }

    // 4. パスワード更新
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    this.credential = newCredential;
    this.passwordChangedAt = new Date();
    this.passwordExpiresAt = this.calculateExpirationDate();

    // 5. パスワード履歴に追加
    this.passwordHistory.push(new PasswordHistory(this.credential, new Date()));
    if (this.passwordHistory.length > 3) {
      this.passwordHistory.shift();  // 最古削除（最新3世代保持）
    }

    // 6. すべてのセッション無効化（セキュリティ強化）
    this.invalidateAllSessions();

    // 7. イベント発行
    this.addDomainEvent(new PasswordChanged(this.id, reason, new Date()));
  }

  // パスワード有効期限チェック
  isPasswordExpired(): boolean {
    return this.passwordExpiresAt < new Date();
  }

  // パスワード再利用チェック
  private isPasswordReused(newPassword: string): boolean {
    for (const history of this.passwordHistory) {
      if (history.credential.verify(newPassword)) {
        return true;
      }
    }
    return false;
  }

  // 有効期限計算（ポリシーベース）
  private calculateExpirationDate(): Date {
    const policy = this.passwordPolicyService.getPolicy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + policy.expirationDays);
    return expiresAt;
  }

  // セッション全無効化
  private invalidateAllSessions(): void {
    this.sessions.forEach(session => session.revoke());
  }
}
```

#### 2. PasswordResetToken Value Object

**責務**:
- リセットトークン生成と検証
- トークン有効期限管理
- 1回限り使用の保証

**実装**:
```typescript
class PasswordResetToken {
  constructor(
    private readonly tokenValue: string,  // crypto.randomBytes(32)
    private readonly userId: UUID,
    private readonly email: string,
    private readonly expiresAt: Date,     // 1時間後
    private used: boolean = false
  ) {}

  // トークン検証
  validate(): { valid: boolean; reason?: string } {
    if (this.used) {
      return { valid: false, reason: 'TOKEN_ALREADY_USED' };
    }
    if (this.expiresAt < new Date()) {
      return { valid: false, reason: 'TOKEN_EXPIRED' };
    }
    return { valid: true };
  }

  // トークン使用マーク
  markAsUsed(): void {
    if (this.used) {
      throw new Error('Token already used');
    }
    this.used = true;
  }

  // トークン生成（静的メソッド）
  static generate(userId: UUID, email: string): PasswordResetToken {
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);  // 1時間後
    return new PasswordResetToken(tokenValue, userId, email, expiresAt, false);
  }
}
```

#### 3. PasswordPolicy Value Object

**責務**:
- パスワードポリシー定義
- パスワードバリデーション
- ポリシー変更履歴管理

**実装**:
```typescript
class PasswordPolicy {
  constructor(
    readonly minLength: number = 12,
    readonly requireUppercase: boolean = true,
    readonly requireLowercase: boolean = true,
    readonly requireDigit: boolean = true,
    readonly requireSpecialChar: boolean = true,
    readonly expirationDays: number = 90,
    readonly preventReuseLast: number = 3,
    readonly maxFailedAttempts: number = 5,
    readonly lockoutDurationMinutes: number = 30
  ) {}

  // パスワード検証
  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`最小${this.minLength}文字必要（現在: ${password.length}文字）`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('大文字が含まれていません');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('小文字が含まれていません');
    }

    if (this.requireDigit && !/[0-9]/.test(password)) {
      errors.push('数字が含まれていません');
    }

    if (this.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('記号が含まれていません');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // パスワード強度スコア（0-100）
  calculateStrength(password: string): number {
    let score = 0;

    // 長さスコア（最大40点）
    score += Math.min(password.length * 2, 40);

    // 文字種スコア（各15点、最大60点）
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    return Math.min(score, 100);
  }
}
```

#### 4. AuditLog Aggregate（パスワード変更監査）

**責務**:
- パスワード変更イベントの記録
- パスワードリセット要求の記録
- 不審なパスワード変更パターン検知

**記録項目**:
```typescript
interface PasswordChangeAuditLog {
  logId: UUID;
  userId: UUID;
  action: 'PASSWORD_CHANGE' | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_COMPLETE';
  reason: 'MANUAL' | 'EXPIRED' | 'POLICY_CHANGE' | 'SECURITY_INCIDENT';
  success: boolean;
  ipAddress: string;
  userAgent: string;
  metadata: {
    passwordStrength?: number;
    policyViolations?: string[];
    sessionInvalidated?: boolean;
    resetTokenUsed?: boolean;
  };
  recordedAt: Timestamp;
}
```

### ドメインサービス連携

#### 1. PasswordManagementService（パスワード管理統括）

**責務**: パスワードライフサイクルの全体フロー統括

**実装フロー**:
```typescript
class PasswordManagementService {
  async changePassword(
    userId: UUID,
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string,
    context: SecurityContext
  ): Promise<PasswordChangeResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. ユーザー取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_006');
    }

    // 3. パスワード変更実行
    try {
      user.changePassword(currentPassword, newPassword, 'MANUAL');
      await this.userRepository.save(user);
    } catch (error) {
      // 監査ログ記録（失敗）
      await this.auditLogService.record({
        userId,
        action: 'PASSWORD_CHANGE',
        success: false,
        ipAddress: context.ipAddress,
        metadata: { reason: error.code }
      });
      throw error;
    }

    // 4. 監査ログ記録（成功）
    await this.auditLogService.record({
      userId,
      action: 'PASSWORD_CHANGE',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: {
        reason: 'MANUAL',
        sessionInvalidated: true,
        passwordStrength: this.passwordPolicy.calculateStrength(newPassword)
      }
    });

    // 5. ドメインイベント発行（BC-007通知）
    await this.eventBus.publish(
      new PasswordChanged(userId, 'MANUAL', new Date())
    );

    return {
      success: true,
      passwordChangedAt: user.passwordChangedAt,
      passwordExpiresAt: user.passwordExpiresAt,
      sessionInvalidated: true
    };
  }

  async requestPasswordReset(
    email: string,
    context: SecurityContext
  ): Promise<PasswordResetRequestResult> {
    // 1. レート制限チェック（1時間に3回まで）
    const recentRequests = await this.passwordResetRepository.countRecentRequests(
      email,
      60  // 60分
    );
    if (recentRequests >= 3) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_007');
    }

    // 2. ユーザー存在確認
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // セキュリティ: ユーザー不在でも同じレスポンス（情報漏洩防止）
      return {
        success: true,
        email,
        resetEmailSent: false,  // 実際は送信していない
        message: 'パスワードリセット用のメールを送信しました'
      };
    }

    // 3. リセットトークン生成
    const resetToken = PasswordResetToken.generate(user.id, email);
    await this.passwordResetRepository.save(resetToken);

    // 4. リセットメール送信（BC-007連携）
    await this.eventBus.publish(
      new PasswordResetRequested(user.id, email, resetToken.tokenValue)
    );

    // 5. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUEST',
      success: true,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent
    });

    return {
      success: true,
      email,
      resetEmailSent: true,
      resetTokenExpiresAt: resetToken.expiresAt
    };
  }

  async executePasswordReset(
    resetToken: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<PasswordResetResult> {
    // 1. パスワード確認一致チェック
    if (newPassword !== newPasswordConfirm) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_002');
    }

    // 2. リセットトークン検証
    const token = await this.passwordResetRepository.findByToken(resetToken);
    if (!token) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005');
    }

    const validation = token.validate();
    if (!validation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_005', {
        reason: validation.reason
      });
    }

    // 3. ユーザー取得
    const user = await this.userRepository.findById(token.userId);

    // 4. 新パスワードポリシー検証
    const policyValidation = this.passwordPolicy.validate(newPassword);
    if (!policyValidation.valid) {
      throw new PasswordChangeError('ERR_BC003_L3001_OP002_001', policyValidation.errors);
    }

    // 5. パスワード更新（現在パスワード不要）
    const newCredential = this.passwordPolicyService.hashPassword(newPassword);
    user.credential = newCredential;
    user.passwordChangedAt = new Date();
    user.passwordExpiresAt = user.calculateExpirationDate();
    user.invalidateAllSessions();

    // 6. トークン使用マーク
    token.markAsUsed();
    await this.passwordResetRepository.save(token);
    await this.userRepository.save(user);

    // 7. 監査ログ記録
    await this.auditLogService.record({
      userId: user.id,
      action: 'PASSWORD_RESET_COMPLETE',
      success: true,
      metadata: {
        resetTokenUsed: true,
        sessionInvalidated: true
      }
    });

    // 8. ドメインイベント発行
    await this.eventBus.publish(
      new PasswordChanged(user.id, 'PASSWORD_RESET', new Date())
    );

    return {
      success: true,
      userId: user.id,
      passwordChangedAt: user.passwordChangedAt,
      newSessionRequired: true
    };
  }
}
```

#### 2. PasswordExpirationService（パスワード有効期限管理）

**責務**: パスワード有効期限の監視と通知

**実装**:
```typescript
class PasswordExpirationService {
  // 定期実行バッチ（1日1回）
  async checkExpiringPasswords(): Promise<void> {
    // 7日以内に期限切れのユーザーを取得
    const expiringUsers = await this.userRepository.findUsersWithPasswordExpiringWithin(7);

    for (const user of expiringUsers) {
      const daysUntilExpiration = this.calculateDaysUntilExpiration(user.passwordExpiresAt);

      // 通知イベント発行（BC-007）
      await this.eventBus.publish(
        new PasswordExpirationWarning(
          user.id,
          user.email,
          daysUntilExpiration,
          user.passwordExpiresAt
        )
      );
    }

    // 期限切れユーザーの処理
    const expiredUsers = await this.userRepository.findUsersWithExpiredPassword();
    for (const user of expiredUsers) {
      // 強制パスワード変更フラグ
      user.forcePasswordChange = true;
      await this.userRepository.save(user);

      // 通知イベント発行
      await this.eventBus.publish(
        new PasswordExpired(user.id, user.email)
      );
    }
  }

  private calculateDaysUntilExpiration(expiresAt: Date): number {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### BC間連携

#### BC-007 (Communication) へのパスワード変更通知

**イベント駆動（非同期）**:

```typescript
// パスワード変更通知
class PasswordChangedNotificationHandler {
  async handle(event: PasswordChanged): Promise<void> {
    const user = await this.userRepository.findById(event.userId);

    await this.communicationService.sendEmail({
      to: user.email,
      template: 'password_changed',
      data: {
        username: user.username,
        changedAt: event.changedAt,
        reason: event.reason,
        ipAddress: event.ipAddress,
        supportLink: 'https://support.example.com'
      }
    });
  }
}

// パスワードリセット要求通知
class PasswordResetRequestedNotificationHandler {
  async handle(event: PasswordResetRequested): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_reset',
      data: {
        resetLink: this.generateResetLink(event.resetToken),
        expiresIn: '1時間',
        ipAddress: event.ipAddress
      }
    });
  }

  private generateResetLink(token: string): string {
    return `https://app.example.com/auth/reset-password?token=${token}`;
  }
}

// パスワード有効期限警告通知
class PasswordExpirationWarningHandler {
  async handle(event: PasswordExpirationWarning): Promise<void> {
    await this.communicationService.sendEmail({
      to: event.email,
      template: 'password_expiration_warning',
      data: {
        daysUntilExpiration: event.daysUntilExpiration,
        expiresAt: event.expiresAt,
        changePasswordLink: 'https://app.example.com/settings/password'
      }
    });
  }
}
```

### セキュリティ実装チェックリスト

- [ ] **パスワードハッシュ**: bcrypt ワークファクター 12
- [ ] **過去パスワード再利用防止**: 最新3世代チェック
- [ ] **パスワード有効期限**: 90日（ポリシー設定可能）
- [ ] **リセットトークン**: crypto.randomBytes(32)、1時間有効、1回限り使用
- [ ] **レート制限**: リセット要求は1時間に3回まで
- [ ] **セッション無効化**: パスワード変更時に全セッション無効化
- [ ] **監査ログ**: すべてのパスワード変更イベントを記録
- [ ] **情報漏洩防止**: ユーザー不在でもリセット成功レスポンス
- [ ] **パスワード強度表示**: リアルタイム強度スコア表示
- [ ] **有効期限警告**: 7日前、3日前、当日に警告メール送信

---

## ⚠️ エラー処理プロトコル

### エラー分類と対処戦略

#### 1. クライアントエラー（4xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | ユーザー対応 |
|-----------|------|------------|-----------|
| ERR_BC003_L3001_OP002_001 | バリデーション | 即座リトライ可 | パスワードポリシーに従って再入力 |
| ERR_BC003_L3001_OP002_002 | バリデーション | 即座リトライ可 | パスワード確認欄を正しく入力 |
| ERR_BC003_L3001_OP002_003 | ビジネスルール | 即座リトライ可 | 過去と異なるパスワード入力 |
| ERR_BC003_L3001_OP002_004 | 認証失敗 | 3回までリトライ可 | 正しい現在パスワード入力 |
| ERR_BC003_L3001_OP002_005 | トークン無効 | リトライ不可 | リセット要求を再実行 |
| ERR_BC003_L3001_OP002_006 | ユーザー不在 | リトライ不可 | メールアドレス確認 |
| ERR_BC003_L3001_OP002_007 | レート制限 | 1時間後リトライ | 待機後再試行 |

#### 2. サーバーエラー（5xx）- リトライ戦略

| エラーコード | 分類 | リトライ戦略 | バックオフ設定 |
|-----------|------|------------|--------------|
| ERR_BC003_L3001_OP002_008 | ハッシュ生成失敗 | 指数バックオフ | 初回: 1秒、2回目: 2秒、3回目: 4秒、最大3回 |

### パスワード変更フロー監視

#### Prometheus メトリクス

```prometheus
# パスワード変更カウンタ
bc003_password_changes_total{reason="manual|expired|policy_change|reset"} 1234

# パスワードリセット要求カウンタ
bc003_password_reset_requests_total{result="success|failure"} 567

# パスワード有効期限切れカウンタ
bc003_password_expirations_total 23

# パスワード強度分布
bc003_password_strength_score{bucket="0-20|21-40|41-60|61-80|81-100"} 456

# パスワード変更レスポンス時間
bc003_password_change_duration_seconds{quantile="0.5|0.9|0.99"} 0.234
```

#### アラートルール

```yaml
groups:
  - name: bc003_password_alerts
    rules:
      # パスワード有効期限切れユーザーが100人超
      - alert: HighPasswordExpirations
        expr: bc003_password_expirations_total > 100
        for: 1h
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワード有効期限切れユーザーが多い"
          description: "{{ $value }}人のユーザーパスワードが期限切れ"

      # パスワードリセット要求が急増
      - alert: PasswordResetSpike
        expr: rate(bc003_password_reset_requests_total[5m]) > 10
        for: 5m
        labels:
          severity: warning
          bc: BC-003
        annotations:
          summary: "パスワードリセット要求が急増"
          description: "過去5分間に {{ $value }}件/秒のリセット要求"
```
