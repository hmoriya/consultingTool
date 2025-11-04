# BC-003: テーブル詳細定義

**BC**: Access Control & Security
**ドキュメント**: データ層 - テーブル定義
**最終更新**: 2025-11-03

このドキュメントでは、BC-003の全11テーブルの詳細定義を記載します。

---

## 目次

1. [認証・ユーザー管理](#auth-user)
   - [users](#table-users)
   - [password_history](#table-password-history)
   - [sessions](#table-sessions)
   - [login_attempts](#table-login-attempts)
2. [認可・RBAC](#authz-rbac)
   - [roles](#table-roles)
   - [permissions](#table-permissions)
   - [user_roles](#table-user-roles)
   - [role_permissions](#table-role-permissions)
3. [監査・セキュリティ](#audit-security)
   - [audit_logs](#table-audit-logs)
   - [security_events](#table-security-events)
   - [security_policies](#table-security-policies)

---

## 認証・ユーザー管理 {#auth-user}

---

### 1. users {#table-users}

ユーザーマスタ - 認証情報、MFA設定、アカウントステータスを管理

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ユーザーID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | | メールアドレス（ログインID） |
| username | VARCHAR(100) | NOT NULL, UNIQUE | | ユーザー名（表示名） |
| password_hash | VARCHAR(255) | NOT NULL | | パスワードハッシュ（bcrypt, cost=12） |
| status | VARCHAR(20) | NOT NULL | 'inactive' | ステータス（inactive/active/suspended/deleted） |
| first_name | VARCHAR(100) | NULL | | 名 |
| last_name | VARCHAR(100) | NULL | | 姓 |
| phone_number | VARCHAR(20) | NULL | | 電話番号 |
| avatar_url | VARCHAR(500) | NULL | | アバターURL |
| timezone | VARCHAR(50) | NOT NULL | 'UTC' | タイムゾーン（例: Asia/Tokyo） |
| locale | VARCHAR(10) | NOT NULL | 'en' | ロケール（例: ja, en） |
| mfa_enabled | BOOLEAN | NOT NULL | FALSE | MFA有効フラグ |
| mfa_method | VARCHAR(20) | NULL | | MFA方式（totp/sms/backup_code） |
| mfa_secret | BYTEA | NULL | | MFAシークレット（暗号化保存） |
| mfa_backup_codes | TEXT[] | NULL | | MFAバックアップコード配列（暗号化） |
| login_failure_count | INTEGER | NOT NULL | 0 | ログイン失敗回数（連続） |
| locked_until | TIMESTAMP | NULL | | アカウントロック解除時刻 |
| last_login_at | TIMESTAMP | NULL | | 最終ログイン日時 |
| last_login_ip | VARCHAR(45) | NULL | | 最終ログインIPアドレス（IPv6対応） |
| email_verified | BOOLEAN | NOT NULL | FALSE | メール確認済みフラグ |
| email_verified_at | TIMESTAMP | NULL | | メール確認日時 |
| password_changed_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | パスワード変更日時 |
| created_by | UUID | FK → users, NULL | | 作成者ユーザーID（自己登録の場合NULL） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |
| suspended_by | UUID | FK → users, NULL | | 停止処理者ユーザーID |
| suspended_at | TIMESTAMP | NULL | | 停止日時 |
| suspended_reason | TEXT | NULL | | 停止理由 |
| deleted_at | TIMESTAMP | NULL | | 削除日時（論理削除） |

#### ビジネスルール

1. **ユーザー登録**:
   - 初期ステータスは`inactive`（メール確認待ち）
   - メール確認後、`email_verified=TRUE`, `status='active'`
   - デフォルトロール`viewer`を自動付与

2. **アカウントロック**:
   - ログイン失敗5回で`locked_until = NOW() + INTERVAL '30 minutes'`
   - `locked_until < NOW()`で自動解除
   - 手動解除はセキュリティ管理者のみ可能

3. **パスワードポリシー**:
   - 最小12文字、大文字・小文字・数字・記号を含む
   - 過去3回のパスワード再利用不可（`password_history`テーブルで管理）
   - 90日ごとのパスワード変更推奨（強制はオプション）

4. **MFA**:
   - TOTP（Google Authenticator等）、SMS、バックアップコードをサポート
   - `mfa_secret`、`mfa_backup_codes`はAES-256-GCMで暗号化保存

5. **GDPR対応**:
   - 削除時は`status='deleted'`, `deleted_at=NOW()`
   - 個人情報を匿名化（`email='deleted_<id>@deleted.local'`）
   - 監査ログは保持（コンプライアンス要件）

---

### 2. password_history {#table-password-history}

パスワード履歴 - 過去のパスワードハッシュを記録し、再利用を防止

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 履歴ID |
| user_id | UUID | FK → users, NOT NULL | | ユーザーID |
| password_hash | VARCHAR(255) | NOT NULL | | パスワードハッシュ（bcrypt） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時（パスワード変更日時） |

#### ビジネスルール

1. **履歴保存**:
   - パスワード変更時、古いハッシュを`password_history`に保存
   - 直近3件のハッシュを保持（古いものは削除）

2. **再利用チェック**:
   - 新しいパスワードが直近3件のハッシュと一致しないか検証
   - bcryptの`crypt()`関数で比較

3. **保持期間**:
   - 基本的には直近3件のみ保持
   - コンプライアンス要件で1年間保持も可能

---

### 3. sessions {#table-sessions}

セッションマスタ - JWTトークン、リフレッシュトークン、セッション管理

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | セッションID（JWT jti） |
| user_id | UUID | FK → users, NOT NULL | | ユーザーID |
| access_token_hash | VARCHAR(255) | NOT NULL, UNIQUE | | アクセストークンのSHA-256ハッシュ |
| refresh_token_hash | VARCHAR(255) | NOT NULL, UNIQUE | | リフレッシュトークンのSHA-256ハッシュ |
| ip_address | VARCHAR(45) | NOT NULL | | ログイン元IPアドレス（IPv6対応） |
| user_agent | VARCHAR(500) | NULL | | ユーザーエージェント |
| device_type | VARCHAR(50) | NULL | | デバイスタイプ（desktop/mobile/tablet） |
| device_name | VARCHAR(100) | NULL | | デバイス名（例: Chrome on MacOS） |
| geolocation | JSONB | NULL | | 位置情報（country, city, lat, lon） |
| expires_at | TIMESTAMP | NOT NULL | | アクセストークン有効期限（30分） |
| refresh_expires_at | TIMESTAMP | NOT NULL | | リフレッシュトークン有効期限（7日） |
| last_activity_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 最終アクティビティ日時 |
| revoked | BOOLEAN | NOT NULL | FALSE | 無効化フラグ |
| revoked_at | TIMESTAMP | NULL | | 無効化日時 |
| revoked_reason | VARCHAR(100) | NULL | | 無効化理由（logout/password_change/manual） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時（ログイン日時） |

#### ビジネスルール

1. **トークン管理**:
   - アクセストークン: JWT（RS256署名）、30分有効
   - リフレッシュトークン: ランダム文字列、7日有効
   - トークン本体はDBに保存せず、SHA-256ハッシュのみ保存

2. **セッション制限**:
   - 最大5個の同時セッション/ユーザー
   - 6個目のセッション作成時、最古のセッションを自動削除

3. **セッション無効化**:
   - ログアウト時: 対象セッションのみ`revoked=TRUE`
   - パスワード変更時: 全セッションを`revoked=TRUE`
   - セキュリティ管理者による手動無効化も可能

4. **有効期限チェック**:
   - `expires_at < NOW()`: アクセストークン期限切れ（リフレッシュ必要）
   - `refresh_expires_at < NOW()`: 再ログイン必要

---

### 4. login_attempts {#table-login-attempts}

ログイン試行履歴 - brute-force攻撃検知、異常ログイン分析

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 試行ID |
| user_id | UUID | FK → users, NULL | | ユーザーID（成功時のみ） |
| email | VARCHAR(255) | NOT NULL | | ログイン試行メールアドレス |
| ip_address | VARCHAR(45) | NOT NULL | | ログイン元IPアドレス |
| user_agent | VARCHAR(500) | NULL | | ユーザーエージェント |
| geolocation | JSONB | NULL | | 位置情報 |
| success | BOOLEAN | NOT NULL | | 成功フラグ |
| failure_reason | VARCHAR(100) | NULL | | 失敗理由（invalid_password/account_locked/user_not_found） |
| mfa_required | BOOLEAN | NOT NULL | FALSE | MFA検証要求フラグ |
| mfa_success | BOOLEAN | NULL | | MFA検証成功フラグ |
| session_id | UUID | FK → sessions, NULL | | 作成されたセッションID（成功時） |
| attempted_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 試行日時 |

#### ビジネスルール

1. **全試行記録**:
   - 成功・失敗問わず全てのログイン試行を記録
   - `user_id`は成功時のみ設定（失敗時はNULL）

2. **brute-force検知**:
   - 同一IP、同一メールで5分間に10回以上失敗 → IPブロック（`security_events`に記録）
   - 異なるIPで同一メールに対して1時間に20回以上失敗 → アカウント保護モード

3. **異常ログイン分析**:
   - 過去のログイン位置と異なる国からのログイン → `security_events`に記録
   - 短時間での複数デバイスログイン → `security_events`に記録

---

## 認可・RBAC {#authz-rbac}

---

### 5. roles {#table-roles}

ロールマスタ - RBAC（Role-Based Access Control）のロール定義

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ロールID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | | ロール名（例: system_admin, project_manager） |
| display_name | VARCHAR(100) | NOT NULL | | 表示名（例: システム管理者） |
| description | TEXT | NULL | | 説明 |
| is_system_role | BOOLEAN | NOT NULL | FALSE | システムロールフラグ（削除不可） |
| parent_role_id | UUID | FK → roles, NULL | | 親ロールID（階層構造サポート） |
| level | INTEGER | NOT NULL | 0 | 階層レベル（0=最上位） |
| permissions_json | JSONB | NULL | | 権限JSON（キャッシュ用、role_permissionsから生成） |
| created_by | UUID | FK → users, NOT NULL | | 作成者ユーザーID |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

#### ビジネスルール

1. **システムロール**:
   - `is_system_role=TRUE`: 削除・名前変更不可
   - システムロール例: `system_admin`, `security_admin`, `viewer`

2. **階層構造**:
   ```
   system_admin (level=0, parent=NULL)
   ├── security_admin (level=1, parent=system_admin)
   │   └── auditor (level=2, parent=security_admin)
   └── org_admin (level=1, parent=system_admin)
       └── project_manager (level=2, parent=org_admin)
           └── developer (level=3, parent=project_manager)
               └── viewer (level=4, parent=developer)
   ```

3. **権限継承**:
   - 子ロールは親ロールの全権限を継承
   - `system_admin`は全権限を持つ

4. **permissions_json**:
   - `role_permissions`から自動生成（マテリアライズドビューまたはトリガー）
   - パフォーマンス最適化のためのキャッシュ

---

### 6. permissions {#table-permissions}

権限マスタ - リソースとアクションの組み合わせで権限を定義

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 権限ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | | 権限名（例: project:write） |
| resource | VARCHAR(100) | NOT NULL | | リソース（例: project, user, budget） |
| action | VARCHAR(20) | NOT NULL | | アクション（read/write/delete/execute） |
| description | TEXT | NULL | | 説明 |
| is_system_permission | BOOLEAN | NOT NULL | FALSE | システム権限フラグ（削除不可） |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

#### ビジネスルール

1. **権限命名規則**:
   - フォーマット: `<resource>:<action>`
   - 例: `project:read`, `user:write`, `budget:delete`

2. **標準アクション**:
   - `read`: 読み取り
   - `write`: 作成・更新
   - `delete`: 削除
   - `execute`: 実行（特殊操作）

3. **ワイルドカード**:
   - `*:read`: 全リソースの読み取り
   - `project:*`: プロジェクトの全操作

4. **システム権限**:
   - `is_system_permission=TRUE`: 削除不可
   - BC標準権限はシステム権限として登録

---

### 7. user_roles {#table-user-roles}

ユーザー・ロール関連 - ユーザーに対するロール付与を管理

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 関連ID |
| user_id | UUID | FK → users, NOT NULL | | ユーザーID |
| role_id | UUID | FK → roles, NOT NULL | | ロールID |
| scope_type | VARCHAR(50) | NULL | | スコープタイプ（organization/project/team） |
| scope_id | UUID | NULL | | スコープID（BC-004のorganization_id等） |
| granted_by | UUID | FK → users, NOT NULL | | 付与者ユーザーID |
| granted_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 付与日時 |
| expires_at | TIMESTAMP | NULL | | 有効期限（NULL=無期限） |
| revoked | BOOLEAN | NOT NULL | FALSE | 取り消しフラグ |
| revoked_by | UUID | FK → users, NULL | | 取り消し者ユーザーID |
| revoked_at | TIMESTAMP | NULL | | 取り消し日時 |
| revoked_reason | TEXT | NULL | | 取り消し理由 |

#### ビジネスルール

1. **スコープ管理**:
   - グローバルロール: `scope_type=NULL`, `scope_id=NULL`
   - 組織スコープ: `scope_type='organization'`, `scope_id=<org_id>`
   - プロジェクトスコープ: `scope_type='project'`, `scope_id=<project_id>`

2. **有効期限**:
   - `expires_at=NULL`: 無期限
   - `expires_at < NOW()`: 期限切れ（権限チェック時に除外）

3. **取り消し**:
   - `revoked=TRUE`: ロール無効化
   - 履歴保持のため削除はしない

---

### 8. role_permissions {#table-role-permissions}

ロール・権限関連 - ロールに対する権限付与を管理

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | 関連ID |
| role_id | UUID | FK → roles, NOT NULL | | ロールID |
| permission_id | UUID | FK → permissions, NOT NULL | | 権限ID |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |

#### ビジネスルール

1. **一意性制約**:
   - `(role_id, permission_id)` の組み合わせは一意

2. **権限集約**:
   - ロールに付与された権限は`roles.permissions_json`に集約
   - 親ロールの権限も継承

3. **権限チェック高速化**:
   - `user_roles` JOIN `role_permissions` JOIN `permissions`
   - または`roles.permissions_json`を直接参照

---

## 監査・セキュリティ {#audit-security}

---

### 9. audit_logs {#table-audit-logs}

監査ログ - 全ての重要アクションを記録（改ざん防止ハッシュチェーン）

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ログID |
| user_id | UUID | FK → users, NULL | | アクターユーザーID（システム操作の場合NULL） |
| session_id | UUID | FK → sessions, NULL | | セッションID |
| action | VARCHAR(100) | NOT NULL | | アクション（USER_LOGIN/PERMISSION_GRANTED等） |
| resource | VARCHAR(200) | NULL | | リソース（users/roles/projects等） |
| resource_id | VARCHAR(100) | NULL | | リソースID |
| details | JSONB | NULL | | 詳細情報（変更前後の値等） |
| ip_address | VARCHAR(45) | NOT NULL | | IPアドレス |
| user_agent | VARCHAR(500) | NULL | | ユーザーエージェント |
| success | BOOLEAN | NOT NULL | | 成功フラグ |
| error_code | VARCHAR(50) | NULL | | エラーコード（失敗時） |
| error_message | TEXT | NULL | | エラーメッセージ（失敗時） |
| hash | VARCHAR(64) | NOT NULL | | SHA-256ハッシュ（改ざん検知用） |
| previous_hash | VARCHAR(64) | NULL | | 直前のログのハッシュ（ハッシュチェーン） |
| recorded_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 記録日時 |

#### ビジネスルール

1. **INSERT ONLYテーブル**:
   - 監査ログは追記のみ、更新・削除は禁止
   - データベース権限で強制（`REVOKE UPDATE, DELETE ON audit_logs FROM app_user`）

2. **ハッシュチェーン**:
   ```sql
   hash = SHA256(
     id || user_id || action || resource || resource_id ||
     recorded_at || previous_hash
   )
   ```
   - トリガー関数で自動計算
   - チェーン検証で改ざん検知

3. **記録対象アクション**:
   - 認証: `USER_LOGIN`, `USER_LOGOUT`, `MFA_ENABLED`, `PASSWORD_CHANGED`
   - 認可: `ROLE_GRANTED`, `ROLE_REVOKED`, `PERMISSION_GRANTED`
   - ユーザー管理: `USER_CREATED`, `USER_SUSPENDED`, `USER_DELETED`
   - セキュリティ: `ACCOUNT_LOCKED`, `SESSION_INVALIDATED`

4. **保持期間**:
   - 3年間保持（コンプライアンス要件）
   - パーティショニング（月次）で管理

---

### 10. security_events {#table-security-events}

セキュリティイベント - 不審なアクティビティ、リスクスコアリング

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | イベントID |
| event_type | VARCHAR(50) | NOT NULL | | イベントタイプ（SUSPICIOUS_LOGIN/BRUTE_FORCE等） |
| severity | VARCHAR(20) | NOT NULL | | 重要度（low/medium/high/critical） |
| user_id | UUID | FK → users, NULL | | 対象ユーザーID |
| ip_address | VARCHAR(45) | NOT NULL | | IPアドレス |
| geolocation | JSONB | NULL | | 位置情報 |
| description | TEXT | NOT NULL | | 説明 |
| risk_score | INTEGER | NOT NULL | 0 | リスクスコア（0-100） |
| risk_indicators | JSONB | NOT NULL | | リスク指標JSON配列 |
| automated_actions | JSONB | NULL | | 自動対応アクションJSON配列 |
| policy_id | UUID | FK → security_policies, NULL | | トリガーとなったポリシーID |
| detected_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 検知日時 |
| detected_by | UUID | FK → users, NULL | | 検知者（システム検知の場合NULL） |
| resolved | BOOLEAN | NOT NULL | FALSE | 解決済みフラグ |
| resolved_at | TIMESTAMP | NULL | | 解決日時 |
| resolved_by | UUID | FK → users, NULL | | 解決者ユーザーID |
| resolution_note | TEXT | NULL | | 解決メモ |

#### ビジネスルール

1. **イベントタイプ**:
   - `SUSPICIOUS_LOGIN`: 異常な場所からのログイン
   - `BRUTE_FORCE`: brute-force攻撃試行
   - `MULTIPLE_FAILURES`: 連続ログイン失敗
   - `UNUSUAL_ACTIVITY`: 通常と異なるアクティビティ
   - `ACCOUNT_TAKEOVER`: アカウント乗っ取りの可能性

2. **リスクスコア計算**:
   ```typescript
   risk_indicators: [
     {type: "UNUSUAL_LOCATION", score: 40, details: "Login from China"},
     {type: "MULTIPLE_FAILURES", score: 20, details: "3 failures in 5 min"},
     {type: "UNUSUAL_TIME", score: 15, details: "Login at 3 AM"}
   ]
   risk_score = SUM(indicator.score) = 75
   ```

3. **自動対応**:
   - `risk_score >= 75`: アカウントロック、アラート送信
   - `risk_score >= 50`: 追加MFA要求
   - `risk_score >= 30`: 監視強化

4. **アラート通知**:
   - `severity='high'` or `severity='critical'`: BC-007経由でセキュリティチームに通知

---

### 11. security_policies {#table-security-policies}

セキュリティポリシー - アカウントロック、パスワードポリシー等の設定

#### カラム定義

| カラム | 型 | 制約 | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | UUID | PK, NOT NULL | uuid_generate_v4() | ポリシーID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | | ポリシー名 |
| policy_type | VARCHAR(50) | NOT NULL | | ポリシータイプ（ACCOUNT_LOCK/PASSWORD/SESSION） |
| description | TEXT | NULL | | 説明 |
| enabled | BOOLEAN | NOT NULL | TRUE | 有効フラグ |
| config | JSONB | NOT NULL | | ポリシー設定JSON |
| scope_type | VARCHAR(50) | NULL | | スコープタイプ（global/organization/user） |
| scope_id | UUID | NULL | | スコープID |
| priority | INTEGER | NOT NULL | 100 | 優先度（低い値ほど高優先） |
| created_by | UUID | FK → users, NOT NULL | | 作成者ユーザーID |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | 更新日時 |

#### ビジネスルール

1. **ポリシータイプ**:
   - `ACCOUNT_LOCK`: アカウントロック設定
   - `PASSWORD`: パスワードポリシー
   - `SESSION`: セッション管理ポリシー
   - `MFA`: MFA要求ポリシー

2. **config JSON例**:
   ```json
   // ACCOUNT_LOCK
   {
     "max_failures": 5,
     "lock_duration_minutes": 30,
     "reset_period_minutes": 60
   }

   // PASSWORD
   {
     "min_length": 12,
     "require_uppercase": true,
     "require_lowercase": true,
     "require_numbers": true,
     "require_symbols": true,
     "max_age_days": 90,
     "history_count": 3
   }

   // SESSION
   {
     "max_concurrent_sessions": 5,
     "access_token_lifetime_minutes": 30,
     "refresh_token_lifetime_days": 7,
     "idle_timeout_minutes": 60
   }
   ```

3. **スコープ**:
   - グローバル: `scope_type='global'`, `scope_id=NULL`（全ユーザーに適用）
   - 組織: `scope_type='organization'`, `scope_id=<org_id>`
   - 個別ユーザー: `scope_type='user'`, `scope_id=<user_id>`

4. **優先度**:
   - 複数ポリシーが適用される場合、`priority`の低い値を優先
   - 例: ユーザー固有ポリシー（priority=1） > 組織ポリシー（priority=50） > グローバルポリシー（priority=100）

---

## 関連ドキュメント

- [README.md](README.md) - データ設計概要
- [indexes-constraints.md](indexes-constraints.md) - インデックス・制約・トリガー
- [query-patterns.md](query-patterns.md) - クエリパターン
- [backup-security.md](backup-security.md) - バックアップ・復旧戦略

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.2 - BC-003 データ設計詳細化
