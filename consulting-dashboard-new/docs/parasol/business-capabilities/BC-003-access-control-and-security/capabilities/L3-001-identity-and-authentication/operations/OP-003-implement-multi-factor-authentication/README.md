# OP-003: 多要素認証を実装する

**作成日**: 2025-10-31
**所属L3**: L3-001-identity-and-authentication: Identity And Authentication
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/authenticate-and-manage-users/operations/implement-multi-factor-authentication

---

## 📋 How: この操作の定義

### 操作の概要
多要素認証を実装するを実行し、ビジネス価値を創出する。

### 実現する機能
- 多要素認証を実装するに必要な情報の入力と検証
- 多要素認証を実装するプロセスの実行と進捗管理
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

### MFA設定リクエスト
**説明**: ユーザーがMFAを有効化する際に必要な入力パラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| userId | UUID | ○ | 対象ユーザーID | 有効なUUID形式 |
| mfaMethod | ENUM | ○ | MFA方式 (TOTP, SMS, Email) | ['TOTP', 'SMS', 'Email'] |
| deviceName | STRING_100 | ○ | デバイス識別名 | 1-100文字 |
| phoneNumber | STRING_20 | △ | 電話番号（SMS選択時必須） | E.164形式 (+81...) |
| email | EMAIL | △ | メールアドレス（Email選択時必須） | RFC5322準拠 |
| backupCodesCount | INTEGER | × | バックアップコード生成数 | デフォルト: 10, 範囲: 5-20 |

### MFA検証リクエスト
**説明**: ログイン時にMFAコードを検証する際のパラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| userId | UUID | ○ | 対象ユーザーID | 有効なUUID形式 |
| mfaCode | STRING_6-8 | ○ | MFAコード（6-8桁） | 数値のみ、6-8桁 |
| deviceFingerprint | STRING_256 | × | デバイスフィンガープリント | SHA-256ハッシュ |
| trustDevice | BOOLEAN | × | デバイス信頼設定 | デフォルト: false |
| backupCode | STRING_12 | △ | バックアップコード（通常コード失敗時） | 英数字12文字 |

### MFA無効化リクエスト
**説明**: ユーザーがMFAを無効化する際のパラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| userId | UUID | ○ | 対象ユーザーID | 有効なUUID形式 |
| currentPassword | PASSWORD | ○ | 現在のパスワード | 最小8文字 |
| mfaCode | STRING_6-8 | ○ | 現在有効なMFAコード | 数値のみ、6-8桁 |
| reason | TEXT | × | 無効化理由 | 最大500文字 |

### MFAポリシー設定（管理者用）
**説明**: 組織のMFAポリシーを設定するパラメータ

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| organizationId | UUID | ○ | 組織ID | 有効なUUID形式 |
| enforcementLevel | ENUM | ○ | 強制レベル | ['OPTIONAL', 'RECOMMENDED', 'REQUIRED', 'REQUIRED_FOR_ADMIN'] |
| allowedMethods | ARRAY<ENUM> | ○ | 許可されるMFA方式 | ['TOTP', 'SMS', 'Email']の配列 |
| gracePeriodDays | INTEGER | × | 猶予期間（日数） | 0-90日、デフォルト: 14 |
| exemptUsers | ARRAY<UUID> | × | 適用除外ユーザーID配列 | UUID配列 |
| requireForSensitiveOperations | BOOLEAN | ○ | 機密操作時の必須化 | デフォルト: true |

---

## 📤 出力仕様

### MFA設定成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "mfaConfigId": "uuid-v4",
    "userId": "uuid-v4",
    "mfaMethod": "TOTP",
    "secretKey": "BASE32_ENCODED_SECRET",
    "qrCodeDataUrl": "data:image/png;base64,iVBORw0KG...",
    "qrCodeUrl": "otpauth://totp/ConsultingTool:user@example.com?secret=SECRET&issuer=ConsultingTool",
    "backupCodes": [
      "A1B2-C3D4-E5F6",
      "G7H8-I9J0-K1L2",
      "...8 more codes..."
    ],
    "deviceName": "iPhone 15 Pro",
    "enrolledAt": "2025-11-04T10:30:00Z",
    "expiresAt": null,
    "status": "PENDING_VERIFICATION"
  },
  "message": "MFA設定が完了しました。QRコードをスキャンして初回検証を実施してください。",
  "nextAction": {
    "action": "VERIFY_MFA_CODE",
    "endpoint": "/api/auth/mfa/verify",
    "timeoutMinutes": 10
  }
}
```

### MFA検証成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "verified": true,
    "userId": "uuid-v4",
    "sessionToken": "jwt-token-with-mfa-claim",
    "mfaVerifiedAt": "2025-11-04T10:35:00Z",
    "trustedDevice": false,
    "nextMfaRequiredAt": "2025-11-04T22:35:00Z",
    "remainingBackupCodes": 10
  },
  "message": "MFA検証が成功しました。",
  "sessionInfo": {
    "sessionId": "uuid-v4",
    "expiresAt": "2025-11-04T22:35:00Z",
    "mfaVerified": true
  }
}
```

### MFA無効化成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "userId": "uuid-v4",
    "mfaDisabled": true,
    "disabledAt": "2025-11-04T10:40:00Z",
    "disabledBy": "user",
    "reason": "デバイス変更のため一時的に無効化",
    "backupCodesInvalidated": 10
  },
  "message": "MFAが無効化されました。",
  "warning": "アカウントのセキュリティレベルが低下しています。再度MFAを有効化することを強く推奨します。"
}
```

### MFAポリシー設定成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "policyId": "uuid-v4",
    "organizationId": "uuid-v4",
    "enforcementLevel": "REQUIRED_FOR_ADMIN",
    "allowedMethods": ["TOTP", "SMS"],
    "gracePeriodDays": 14,
    "exemptUsers": ["uuid-1", "uuid-2"],
    "requireForSensitiveOperations": true,
    "affectedUsers": 127,
    "updatedAt": "2025-11-04T10:45:00Z",
    "effectiveDate": "2025-11-18T00:00:00Z"
  },
  "message": "MFAポリシーが更新されました。",
  "notifications": {
    "emailsSent": 127,
    "notificationsSent": 127
  }
}
```

### エンティティ状態変更
**操作対象エンティティ**: User, MFAConfiguration, Session

#### User エンティティ状態変更
```typescript
{
  mfaEnabled: false → true,
  mfaMethod: null → "TOTP",
  mfaEnrolledAt: null → "2025-11-04T10:30:00Z",
  mfaVerified: false → true,
  lastMfaVerificationAt: null → "2025-11-04T10:35:00Z"
}
```

#### MFAConfiguration エンティティ作成
```typescript
{
  id: "uuid-v4",
  userId: "uuid-v4",
  mfaMethod: "TOTP",
  secretKey: "ENCRYPTED_BASE32_SECRET",
  backupCodes: ["HASHED_CODE_1", "HASHED_CODE_2", ...],
  status: "ACTIVE",
  deviceName: "iPhone 15 Pro",
  createdAt: "2025-11-04T10:30:00Z",
  verifiedAt: "2025-11-04T10:35:00Z"
}
```

#### Session エンティティ状態変更
```typescript
{
  mfaVerified: false → true,
  mfaVerifiedAt: null → "2025-11-04T10:35:00Z",
  securityLevel: "STANDARD" → "HIGH",
  allowedOperations: ["READ"] → ["READ", "WRITE", "DELETE", "ADMIN"]
}
```

---

## 🛠️ 実装ガイダンス

### TOTP (RFC 6238) 実装

#### 1. シークレットキー生成
```typescript
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

// シークレットキー生成（Base32エンコード）
const secret = speakeasy.generateSecret({
  name: `ConsultingTool:${user.email}`,
  issuer: 'ConsultingTool',
  length: 32 // 256ビット
});

// QRコード生成
const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

// 結果
{
  secretKey: secret.base32, // "JBSWY3DPEHPK3PXP"
  qrCodeUrl: secret.otpauth_url, // "otpauth://totp/..."
  qrCodeDataUrl: qrCodeDataUrl // "data:image/png;base64,..."
}
```

#### 2. TOTP検証
```typescript
// 6桁TOTPコード検証（±1ウィンドウ許容）
const verified = speakeasy.totp.verify({
  secret: mfaConfig.secretKey,
  encoding: 'base32',
  token: userInputCode,
  window: 1 // 前後30秒許容
});

if (verified) {
  // MFA検証成功
  await updateSessionMfaStatus(session.id, true);
  await updateUserLastMfaVerification(user.id);
}
```

#### 3. バックアップコード生成
```typescript
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

// 10個のバックアップコード生成
const backupCodes = Array.from({ length: 10 }, () => {
  const code = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}`;
});

// ハッシュ化して保存
const hashedCodes = await Promise.all(
  backupCodes.map(code => bcrypt.hash(code, 10))
);

// ユーザーに表示（1回限り）
return {
  backupCodes: backupCodes, // ["A1B2-C3D4-E5F6", ...]
  hashedCodes: hashedCodes // データベース保存用
};
```

### QRコード生成実装

#### QRコード仕様
- **形式**: PNG画像（Base64エンコード）
- **サイズ**: 200x200 ピクセル
- **エラー訂正レベル**: M（15%復元）
- **URI形式**: `otpauth://totp/Issuer:Account?secret=SECRET&issuer=Issuer`

```typescript
import * as qrcode from 'qrcode';

const qrCodeOptions = {
  errorCorrectionLevel: 'M',
  type: 'image/png',
  width: 200,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

const qrCodeDataUrl = await qrcode.toDataURL(
  secret.otpauth_url,
  qrCodeOptions
);
```

### MFA強制ポリシー実装

#### ポリシーレベル別の実装
```typescript
enum MfaEnforcementLevel {
  OPTIONAL = 'OPTIONAL',           // 任意（推奨）
  RECOMMENDED = 'RECOMMENDED',     // 推奨（リマインダー表示）
  REQUIRED = 'REQUIRED',           // 必須（全ユーザー）
  REQUIRED_FOR_ADMIN = 'REQUIRED_FOR_ADMIN' // 管理者のみ必須
}

// ポリシーチェック実装
async function checkMfaEnforcement(user: User, org: Organization): Promise<MfaCheckResult> {
  const policy = await getMfaPolicy(org.id);

  switch (policy.enforcementLevel) {
    case MfaEnforcementLevel.OPTIONAL:
      return { required: false, allowBypass: true };

    case MfaEnforcementLevel.RECOMMENDED:
      return {
        required: false,
        allowBypass: true,
        showReminder: !user.mfaEnabled
      };

    case MfaEnforcementLevel.REQUIRED:
      if (!user.mfaEnabled) {
        const enrolledDate = user.createdAt;
        const gracePeriodEnd = addDays(enrolledDate, policy.gracePeriodDays);

        if (new Date() > gracePeriodEnd) {
          return { required: true, allowBypass: false };
        } else {
          return {
            required: false,
            allowBypass: true,
            gracePeriodEnds: gracePeriodEnd
          };
        }
      }
      return { required: true, allowBypass: false };

    case MfaEnforcementLevel.REQUIRED_FOR_ADMIN:
      const isAdmin = user.roles.includes('Admin');
      return {
        required: isAdmin && !user.mfaEnabled,
        allowBypass: !isAdmin
      };
  }
}
```

### セッション管理とMFA検証

#### MFA検証済みセッションの管理
```typescript
interface SessionMfaState {
  sessionId: string;
  userId: string;
  mfaVerified: boolean;
  mfaVerifiedAt: Date | null;
  mfaMethod: MfaMethod | null;
  deviceTrusted: boolean;
  nextMfaRequiredAt: Date | null;
}

// セッション作成時（ログイン後）
async function createSession(user: User, mfaVerified: boolean): Promise<Session> {
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      mfaVerified: mfaVerified,
      mfaVerifiedAt: mfaVerified ? new Date() : null,
      mfaMethod: user.mfaMethod,
      deviceTrusted: false, // 初回は常にfalse
      nextMfaRequiredAt: mfaVerified
        ? addHours(new Date(), 12) // 12時間後に再検証
        : null,
      expiresAt: addHours(new Date(), 24)
    }
  });

  return session;
}

// 機密操作前のMFA再検証チェック
async function requireMfaReVerification(session: Session): Promise<boolean> {
  if (!session.mfaVerified) return true;

  const now = new Date();
  if (now > session.nextMfaRequiredAt) {
    // 12時間経過、再検証必要
    return true;
  }

  return false; // 再検証不要
}
```

### バックアップコード検証実装

```typescript
import * as bcrypt from 'bcrypt';

async function verifyBackupCode(userId: string, inputCode: string): Promise<boolean> {
  const mfaConfig = await prisma.mfaConfiguration.findUnique({
    where: { userId },
    include: { backupCodes: true }
  });

  if (!mfaConfig || !mfaConfig.backupCodes) {
    return false;
  }

  // 各バックアップコードと照合
  for (const hashedCode of mfaConfig.backupCodes) {
    const match = await bcrypt.compare(inputCode, hashedCode.hash);

    if (match && !hashedCode.used) {
      // バックアップコード使用済みにマーク
      await prisma.backupCode.update({
        where: { id: hashedCode.id },
        data: {
          used: true,
          usedAt: new Date()
        }
      });

      // 監査ログ記録
      await logAuditEvent({
        userId,
        action: 'MFA_BACKUP_CODE_USED',
        details: { backupCodeId: hashedCode.id }
      });

      // 残りバックアップコードが少ない場合は警告
      const remainingCodes = mfaConfig.backupCodes.filter(c => !c.used).length - 1;
      if (remainingCodes <= 2) {
        await sendBackupCodeWarning(userId, remainingCodes);
      }

      return true;
    }
  }

  return false;
}
```

### デバイス信頼機能の実装

```typescript
// デバイスフィンガープリント生成（クライアント側）
function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage
  ];

  const fingerprint = components.join('|');
  return sha256(fingerprint);
}

// 信頼済みデバイスの検証（サーバー側）
async function checkTrustedDevice(
  userId: string,
  deviceFingerprint: string
): Promise<boolean> {
  const trustedDevice = await prisma.trustedDevice.findFirst({
    where: {
      userId,
      fingerprint: deviceFingerprint,
      expiresAt: { gt: new Date() }
    }
  });

  return !!trustedDevice;
}

// デバイスを信頼済みとしてマーク
async function trustDevice(
  userId: string,
  deviceFingerprint: string,
  deviceName: string
): Promise<void> {
  await prisma.trustedDevice.create({
    data: {
      userId,
      fingerprint: deviceFingerprint,
      deviceName,
      trustedAt: new Date(),
      expiresAt: addDays(new Date(), 30) // 30日間信頼
    }
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### MFA設定エラー (E-MFA-1xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-MFA-1001 | 400 | MFA already enabled | ユーザーは既にMFAを有効化済み | 既存のMFA設定を無効化してから再設定 |
| E-MFA-1002 | 400 | Invalid MFA method | 指定されたMFA方式が無効 | 'TOTP', 'SMS', 'Email'のいずれかを指定 |
| E-MFA-1003 | 400 | Phone number required for SMS | SMS方式で電話番号未指定 | phoneNumberパラメータを指定 |
| E-MFA-1004 | 400 | Email required for Email method | Email方式でメールアドレス未指定 | emailパラメータを指定 |
| E-MFA-1005 | 403 | MFA method not allowed by policy | 組織ポリシーで許可されていない方式 | 許可された方式を使用 |
| E-MFA-1006 | 500 | Failed to generate secret key | シークレットキー生成失敗 | 再試行、失敗時はサポートに連絡 |
| E-MFA-1007 | 500 | Failed to generate QR code | QRコード生成失敗 | 再試行、テキストベースのシークレットキーを使用 |
| E-MFA-1008 | 500 | Failed to generate backup codes | バックアップコード生成失敗 | 再試行、失敗時はサポートに連絡 |

#### MFA検証エラー (E-MFA-2xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-MFA-2001 | 400 | MFA not enabled | ユーザーがMFAを有効化していない | MFA設定を先に実施 |
| E-MFA-2002 | 401 | Invalid MFA code | MFAコードが不正 | 正しいコードを再入力、時刻同期確認 |
| E-MFA-2003 | 401 | Expired MFA code | MFAコードが期限切れ | 新しいコードを生成して入力 |
| E-MFA-2004 | 429 | Too many failed attempts | 連続失敗回数超過（5回） | 5分間待機後に再試行、またはバックアップコード使用 |
| E-MFA-2005 | 401 | Invalid backup code | バックアップコードが不正 | 正しいバックアップコードを入力 |
| E-MFA-2006 | 410 | Backup code already used | 使用済みバックアップコード | 別のバックアップコードを使用 |
| E-MFA-2007 | 500 | MFA verification failed | 検証処理内部エラー | 再試行、失敗時はサポートに連絡 |
| E-MFA-2008 | 403 | MFA verification required | セッションのMFA検証が必須 | MFA検証を実施してから操作を再実行 |

#### MFA無効化エラー (E-MFA-3xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-MFA-3001 | 400 | MFA not enabled | MFAが有効化されていない | 無効化不要 |
| E-MFA-3002 | 401 | Invalid password | パスワードが不正 | 正しいパスワードを入力 |
| E-MFA-3003 | 401 | Invalid MFA code for disable | MFAコードが不正 | 正しいMFAコードを入力 |
| E-MFA-3004 | 403 | MFA disable not allowed by policy | ポリシーでMFA無効化が禁止 | 管理者に連絡してポリシー変更を依頼 |
| E-MFA-3005 | 500 | Failed to disable MFA | MFA無効化処理失敗 | 再試行、失敗時はサポートに連絡 |

#### MFAポリシーエラー (E-MFA-4xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-MFA-4001 | 400 | Invalid enforcement level | 不正な強制レベル | 有効な強制レベルを指定 |
| E-MFA-4002 | 400 | Invalid MFA methods array | 許可方式配列が不正 | 有効なMFA方式の配列を指定 |
| E-MFA-4003 | 400 | Grace period out of range | 猶予期間が範囲外 | 0-90日の範囲で指定 |
| E-MFA-4004 | 403 | Insufficient permissions | ポリシー変更権限なし | 組織管理者権限が必要 |
| E-MFA-4005 | 500 | Failed to update policy | ポリシー更新失敗 | 再試行、失敗時はサポートに連絡 |

### エラーレスポンス形式

#### 標準エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "E-MFA-2002",
    "message": "Invalid MFA code",
    "details": "入力されたMFAコードが不正です。正しいコードを再入力してください。",
    "timestamp": "2025-11-04T10:50:00Z",
    "requestId": "uuid-v4"
  },
  "troubleshooting": {
    "possibleCauses": [
      "MFAコードの入力ミス",
      "デバイスの時刻が同期されていない",
      "コードの有効期限切れ（30秒）"
    ],
    "suggestedActions": [
      "MFAアプリで新しいコードを生成",
      "デバイスの時刻設定を確認",
      "バックアップコードの使用を検討"
    ],
    "supportContact": "support@example.com"
  }
}
```

#### 詳細エラーレスポンス（開発環境）
```json
{
  "success": false,
  "error": {
    "code": "E-MFA-2004",
    "message": "Too many failed attempts",
    "details": "MFA検証に5回連続で失敗しました。5分間待機してから再試行してください。",
    "timestamp": "2025-11-04T10:50:00Z",
    "requestId": "uuid-v4",
    "userId": "uuid-v4",
    "attemptCount": 5,
    "lockoutUntil": "2025-11-04T10:55:00Z"
  },
  "troubleshooting": {
    "possibleCauses": [
      "不正なログイン試行の可能性",
      "時刻同期の問題",
      "間違ったシークレットキーの使用"
    ],
    "suggestedActions": [
      "5分間待機してから再試行",
      "バックアップコードを使用",
      "パスワードリセットとMFA再設定"
    ],
    "supportContact": "support@example.com"
  },
  "debug": {
    "stackTrace": "Error: MFA verification failed...",
    "requestHeaders": { "User-Agent": "..." },
    "serverTime": "2025-11-04T10:50:00Z"
  }
}
```

### エラー処理フロー

#### MFA検証失敗時の処理フロー
```typescript
async function handleMfaVerificationError(
  error: MfaVerificationError,
  user: User,
  attempt: number
): Promise<ErrorResponse> {

  // 1. 失敗回数の記録
  await recordFailedAttempt(user.id, 'MFA_VERIFICATION');

  // 2. ロックアウトチェック
  if (attempt >= 5) {
    const lockoutUntil = addMinutes(new Date(), 5);
    await lockoutUser(user.id, lockoutUntil);

    // セキュリティアラート送信
    await sendSecurityAlert(user.id, {
      type: 'MFA_LOCKOUT',
      attemptCount: attempt,
      lockoutUntil
    });

    return {
      code: 'E-MFA-2004',
      message: 'Too many failed attempts',
      lockoutUntil
    };
  }

  // 3. 通常のエラーレスポンス
  return {
    code: 'E-MFA-2002',
    message: 'Invalid MFA code',
    remainingAttempts: 5 - attempt
  };
}
```

#### バックアップコードフォールバック
```typescript
async function verifyMfaWithFallback(
  userId: string,
  primaryCode: string,
  backupCode?: string
): Promise<MfaVerificationResult> {

  try {
    // 1. プライマリコード検証
    const verified = await verifyTotpCode(userId, primaryCode);
    if (verified) {
      return { success: true, method: 'TOTP' };
    }

    // 2. バックアップコードフォールバック
    if (backupCode) {
      const backupVerified = await verifyBackupCode(userId, backupCode);
      if (backupVerified) {
        return {
          success: true,
          method: 'BACKUP_CODE',
          warning: 'バックアップコードを使用しました。新しいバックアップコードを生成してください。'
        };
      }
    }

    return { success: false, error: 'E-MFA-2002' };

  } catch (error) {
    // 3. システムエラー処理
    await logError('MFA_VERIFICATION_ERROR', error);
    throw new MfaSystemError('E-MFA-2007', 'MFA verification failed');
  }
}
```

### リトライポリシー

#### 自動リトライ設定
```typescript
const MFA_RETRY_POLICY = {
  maxAttempts: 3,
  backoffMultiplier: 2,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  retryableErrors: [
    'E-MFA-1006', // シークレットキー生成失敗
    'E-MFA-1007', // QRコード生成失敗
    'E-MFA-1008', // バックアップコード生成失敗
    'E-MFA-2007', // 検証処理内部エラー
    'E-MFA-3005', // MFA無効化処理失敗
    'E-MFA-4005'  // ポリシー更新失敗
  ]
};

async function retryMfaOperation<T>(
  operation: () => Promise<T>,
  errorCode: string
): Promise<T> {
  let attempt = 0;
  let delay = MFA_RETRY_POLICY.initialDelayMs;

  while (attempt < MFA_RETRY_POLICY.maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempt++;

      if (!MFA_RETRY_POLICY.retryableErrors.includes(errorCode)) {
        throw error; // リトライ不可エラー
      }

      if (attempt >= MFA_RETRY_POLICY.maxAttempts) {
        throw new MfaMaxRetriesError(errorCode);
      }

      await sleep(delay);
      delay = Math.min(delay * MFA_RETRY_POLICY.backoffMultiplier, MFA_RETRY_POLICY.maxDelayMs);
    }
  }
}
```

### 監査ログ記録

#### MFA関連イベントの監査ログ
```typescript
// MFA設定成功
await auditLog.record({
  eventType: 'MFA_ENABLED',
  userId: user.id,
  mfaMethod: 'TOTP',
  deviceName: 'iPhone 15 Pro',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date()
});

// MFA検証成功
await auditLog.record({
  eventType: 'MFA_VERIFICATION_SUCCESS',
  userId: user.id,
  sessionId: session.id,
  deviceTrusted: false,
  ipAddress: req.ip,
  timestamp: new Date()
});

// MFA検証失敗
await auditLog.record({
  eventType: 'MFA_VERIFICATION_FAILED',
  userId: user.id,
  attemptCount: 3,
  errorCode: 'E-MFA-2002',
  ipAddress: req.ip,
  timestamp: new Date()
});

// バックアップコード使用
await auditLog.record({
  eventType: 'MFA_BACKUP_CODE_USED',
  userId: user.id,
  remainingBackupCodes: 7,
  ipAddress: req.ip,
  timestamp: new Date()
});

// MFA無効化
await auditLog.record({
  eventType: 'MFA_DISABLED',
  userId: user.id,
  disabledBy: 'user',
  reason: 'デバイス変更',
  ipAddress: req.ip,
  timestamp: new Date()
});
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
> - [services/secure-access-service/capabilities/authenticate-and-manage-users/operations/implement-multi-factor-authentication/](../../../../../../services/secure-access-service/capabilities/authenticate-and-manage-users/operations/implement-multi-factor-authentication/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Migration Script |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
