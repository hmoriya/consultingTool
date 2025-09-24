# 認証サービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/auth-service/data/auth.db`
- 文字エンコーディング: UTF-8
- タイムゾーン: UTC

## パラソルドメイン言語型システム
```
UUID: 36文字の一意識別子（RFC 4122準拠）
EMAIL: メールアドレス形式（RFC 5322準拠）
STRING_N: 最大N文字の可変長文字列
TEXT: 長文テキスト（制限なし）
PASSWORD_HASH: bcryptハッシュ化されたパスワード（60文字）
TIMESTAMP: ISO 8601形式の日時
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型（定義された値のいずれか）
INTEGER: 32ビット整数
IP_ADDRESS: IPv4/IPv6アドレス
JSON: JSON形式のデータ
```

## テーブル定義

### 1. Users（ユーザー）

**説明**: システムユーザーの基本情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | ユーザーID |
| email | EMAIL | UNIQUE, NOT NULL | メールアドレス |
| password | PASSWORD_HASH | NOT NULL | ハッシュ化パスワード |
| name | STRING_100 | NOT NULL | 氏名 |
| role | ENUM | NOT NULL | ロール |
| organization | STRING_200 | NULL | 組織名 |
| status | ENUM | NOT NULL DEFAULT 'Active' | アカウント状態 |
| emailVerified | BOOLEAN | NOT NULL DEFAULT false | メール認証済み |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_users_email` (email) - UNIQUE
- `idx_users_role` (role)
- `idx_users_status` (status)

**ENUM定義**:
- `role`: Executive, PM, Consultant, Client, Admin
- `status`: Active, Inactive, Locked, Suspended

---

### 2. Sessions（セッション）

**説明**: ユーザーセッション管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | セッションID |
| userId | UUID | NOT NULL | ユーザーID |
| token | STRING_500 | UNIQUE, NOT NULL | セッショントークン |
| ipAddress | IP_ADDRESS | NOT NULL | IPアドレス |
| userAgent | TEXT | NULL | ユーザーエージェント |
| deviceInfo | JSON | NULL | デバイス情報 |
| expiresAt | TIMESTAMP | NOT NULL | 有効期限 |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| lastActivityAt | TIMESTAMP | NOT NULL | 最終アクティビティ |

**インデックス**:
- `idx_sessions_token` (token) - UNIQUE
- `idx_sessions_userId` (userId)
- `idx_sessions_expiresAt` (expiresAt)

**外部キー**:
- `userId` → `Users.id` (CASCADE DELETE)

---

### 3. RefreshTokens（リフレッシュトークン）

**説明**: リフレッシュトークン管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | トークンID |
| userId | UUID | NOT NULL | ユーザーID |
| token | STRING_500 | UNIQUE, NOT NULL | リフレッシュトークン |
| sessionId | UUID | NOT NULL | セッションID |
| expiresAt | TIMESTAMP | NOT NULL | 有効期限 |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| revokedAt | TIMESTAMP | NULL | 無効化日時 |

**インデックス**:
- `idx_refresh_tokens_token` (token) - UNIQUE
- `idx_refresh_tokens_userId` (userId)
- `idx_refresh_tokens_sessionId` (sessionId)

**外部キー**:
- `userId` → `Users.id` (CASCADE DELETE)
- `sessionId` → `Sessions.id` (CASCADE DELETE)

---

### 4. PasswordResets（パスワードリセット）

**説明**: パスワードリセットトークン管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | リセットID |
| userId | UUID | NOT NULL | ユーザーID |
| token | STRING_200 | UNIQUE, NOT NULL | リセットトークン |
| expiresAt | TIMESTAMP | NOT NULL | 有効期限 |
| usedAt | TIMESTAMP | NULL | 使用日時 |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**:
- `idx_password_resets_token` (token) - UNIQUE
- `idx_password_resets_userId` (userId)

**外部キー**:
- `userId` → `Users.id` (CASCADE DELETE)

---

### 5. EmailVerifications（メール認証）

**説明**: メールアドレス認証トークン管理

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 認証ID |
| userId | UUID | NOT NULL | ユーザーID |
| email | EMAIL | NOT NULL | 認証対象メール |
| token | STRING_200 | UNIQUE, NOT NULL | 認証トークン |
| expiresAt | TIMESTAMP | NOT NULL | 有効期限 |
| verifiedAt | TIMESTAMP | NULL | 認証完了日時 |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |

**インデックス**:
- `idx_email_verifications_token` (token) - UNIQUE
- `idx_email_verifications_userId` (userId)

**外部キー**:
- `userId` → `Users.id` (CASCADE DELETE)

---

### 6. LoginAttempts（ログイン試行）

**説明**: ログイン試行記録（セキュリティ監査用）

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 試行ID |
| email | EMAIL | NOT NULL | 試行メールアドレス |
| ipAddress | IP_ADDRESS | NOT NULL | IPアドレス |
| userAgent | TEXT | NULL | ユーザーエージェント |
| success | BOOLEAN | NOT NULL | 成功フラグ |
| failureReason | STRING_100 | NULL | 失敗理由 |
| attemptedAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 試行日時 |

**インデックス**:
- `idx_login_attempts_email` (email)
- `idx_login_attempts_ipAddress` (ipAddress)
- `idx_login_attempts_attemptedAt` (attemptedAt)

---

### 7. AuditLogs（監査ログ）

**説明**: 認証関連操作の監査ログ

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | ログID |
| userId | UUID | NULL | ユーザーID |
| action | ENUM | NOT NULL | アクション |
| targetId | UUID | NULL | 対象ID |
| targetType | STRING_50 | NULL | 対象タイプ |
| metadata | JSON | NULL | メタデータ |
| ipAddress | IP_ADDRESS | NULL | IPアドレス |
| userAgent | TEXT | NULL | ユーザーエージェント |
| createdAt | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 記録日時 |

**インデックス**:
- `idx_audit_logs_userId` (userId)
- `idx_audit_logs_action` (action)
- `idx_audit_logs_createdAt` (createdAt)

**ENUM定義**:
- `action`: Login, Logout, PasswordChange, PasswordReset, EmailVerification, AccountLocked, AccountUnlocked, RoleChanged, ProfileUpdated

---

## リレーション図

```
Users
  ├─ Sessions (1:N)
  ├─ RefreshTokens (1:N)
  ├─ PasswordResets (1:N)
  ├─ EmailVerifications (1:N)
  └─ AuditLogs (1:N)

Sessions
  └─ RefreshTokens (1:N)
```

## データ保持ポリシー

| テーブル | 保持期間 | 削除条件 |
|---------|---------|---------|
| Sessions | 7日間 | expiresAt超過 |
| RefreshTokens | 30日間 | expiresAt超過 |
| PasswordResets | 24時間 | expiresAt超過 |
| EmailVerifications | 7日間 | expiresAt超過 |
| LoginAttempts | 30日間 | attemptedAtから30日経過 |
| AuditLogs | 1年間 | createdAtから1年経過 |

## セキュリティ考慮事項

1. **パスワード保存**
   - bcryptアルゴリズム使用（コストファクター: 10）
   - 平文パスワードは保存しない

2. **トークン生成**
   - 暗号学的に安全な乱数生成器を使用
   - 最小長: 32文字

3. **アカウントロック**
   - 5回連続ログイン失敗で15分間ロック
   - LoginAttemptsテーブルで追跡

4. **監査**
   - すべての認証関連操作をAuditLogsに記録
   - 定期的な監査レポート生成

5. **データ暗号化**
   - データベースファイル暗号化（本番環境）
   - 通信はHTTPS必須