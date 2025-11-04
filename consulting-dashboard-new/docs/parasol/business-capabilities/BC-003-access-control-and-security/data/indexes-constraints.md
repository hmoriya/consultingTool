# BC-003: インデックス・制約・トリガー

**BC**: Access Control & Security
**ドキュメント**: データ層 - インデックス戦略、制約、トリガー関数
**最終更新**: 2025-11-03

このドキュメントでは、BC-003のインデックス戦略、制約定義、トリガー関数を記載します。

---

## 目次

1. [インデックス戦略](#index-strategy)
2. [制約定義](#constraints)
3. [トリガー関数](#triggers)
4. [パフォーマンス最適化](#performance)

---

## インデックス戦略 {#index-strategy}

### インデックスの種類と使い分け

#### 1. B-treeインデックス（デフォルト）
- **用途**: 等価検索、範囲検索、ソート
- **例**: email検索、日付範囲検索

#### 2. GINインデックス（配列・JSONB）
- **用途**: 配列要素検索、JSONB検索
- **例**: `mfa_backup_codes` 配列、`details` JSONB

#### 3. 部分インデックス（条件付き）
- **用途**: 特定条件のデータのみインデックス化
- **例**: アクティブユーザーのみ、有効セッションのみ

#### 4. 複合インデックス
- **用途**: 複数カラムの組み合わせ検索
- **例**: `(user_id, created_at)`, `(ip_address, attempted_at)`

---

### テーブル別インデックス定義

---

#### users テーブル

```sql
-- 主キー（自動生成）
CREATE UNIQUE INDEX pk_users ON users(id);

-- ログイン認証用（頻繁に使用）
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- ステータス検索（部分インデックス）
CREATE INDEX idx_users_status_active ON users(status)
  WHERE status IN ('active', 'inactive', 'suspended');

-- メール確認待ちユーザー検索
CREATE INDEX idx_users_email_unverified ON users(id)
  WHERE email_verified = FALSE AND status = 'inactive';

-- アカウントロック中ユーザー検索
CREATE INDEX idx_users_locked ON users(id, locked_until)
  WHERE locked_until IS NOT NULL AND locked_until > NOW();

-- 最終ログイン検索（レポート用）
CREATE INDEX idx_users_last_login_at ON users(last_login_at DESC)
  WHERE last_login_at IS NOT NULL;

-- 作成日検索
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 削除済みユーザー検索（GDPR対応）
CREATE INDEX idx_users_deleted ON users(id, deleted_at)
  WHERE deleted_at IS NOT NULL;

-- MFA有効ユーザー検索（統計用）
CREATE INDEX idx_users_mfa_enabled ON users(id)
  WHERE mfa_enabled = TRUE;
```

**インデックス数**: 10個
**最も重要**: `idx_users_email`（ログイン時に毎回使用、p95 < 10ms）

---

#### roles テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_roles ON roles(id);

-- ロール名検索（UNIQUE）
CREATE UNIQUE INDEX idx_roles_name ON roles(name);

-- システムロール検索
CREATE INDEX idx_roles_system ON roles(id)
  WHERE is_system_role = TRUE;

-- 階層構造検索
CREATE INDEX idx_roles_parent ON roles(parent_role_id)
  WHERE parent_role_id IS NOT NULL;

-- 階層レベル検索
CREATE INDEX idx_roles_level ON roles(level);

-- GINインデックス（permissions_json高速検索）
CREATE INDEX idx_roles_permissions_gin ON roles USING gin(permissions_json);
```

**インデックス数**: 6個

---

#### permissions テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_permissions ON permissions(id);

-- 権限名検索（UNIQUE）
CREATE UNIQUE INDEX idx_permissions_name ON permissions(name);

-- リソース検索
CREATE INDEX idx_permissions_resource ON permissions(resource);

-- アクション検索
CREATE INDEX idx_permissions_action ON permissions(action);

-- 複合インデックス（resource + action、UNIQUE）
CREATE UNIQUE INDEX idx_permissions_resource_action ON permissions(resource, action);

-- システム権限検索
CREATE INDEX idx_permissions_system ON permissions(id)
  WHERE is_system_permission = TRUE;
```

**インデックス数**: 6個

---

#### user_roles テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_user_roles ON user_roles(id);

-- ユーザーID検索（頻繁に使用）
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id)
  WHERE revoked = FALSE;

-- ロールID検索
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id)
  WHERE revoked = FALSE;

-- 複合インデックス（user_id + role_id、UNIQUE）
CREATE UNIQUE INDEX idx_user_roles_user_role ON user_roles(user_id, role_id)
  WHERE revoked = FALSE AND (expires_at IS NULL OR expires_at > NOW());

-- スコープ検索
CREATE INDEX idx_user_roles_scope ON user_roles(scope_type, scope_id)
  WHERE scope_type IS NOT NULL AND revoked = FALSE;

-- 有効期限検索（期限切れロール削除用）
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at)
  WHERE expires_at IS NOT NULL AND expires_at <= NOW() AND revoked = FALSE;

-- 付与者検索（監査用）
CREATE INDEX idx_user_roles_granted_by ON user_roles(granted_by, granted_at DESC);

-- 取り消し検索（監査用）
CREATE INDEX idx_user_roles_revoked ON user_roles(revoked_by, revoked_at DESC)
  WHERE revoked = TRUE;
```

**インデックス数**: 8個
**最も重要**: `idx_user_roles_user_id`（権限チェック時に使用、p95 < 50ms）

---

#### role_permissions テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_role_permissions ON role_permissions(id);

-- ロールID検索
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);

-- 権限ID検索
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- 複合インデックス（role_id + permission_id、UNIQUE）
CREATE UNIQUE INDEX idx_role_permissions_role_permission ON role_permissions(role_id, permission_id);
```

**インデックス数**: 4個

---

#### sessions テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_sessions ON sessions(id);

-- アクセストークンハッシュ検索（UNIQUE、頻繁に使用）
CREATE UNIQUE INDEX idx_sessions_access_token ON sessions(access_token_hash)
  WHERE revoked = FALSE AND expires_at > NOW();

-- リフレッシュトークンハッシュ検索（UNIQUE）
CREATE UNIQUE INDEX idx_sessions_refresh_token ON sessions(refresh_token_hash)
  WHERE revoked = FALSE AND refresh_expires_at > NOW();

-- ユーザーID検索（セッション一覧取得用）
CREATE INDEX idx_sessions_user_id ON sessions(user_id, last_activity_at DESC)
  WHERE revoked = FALSE;

-- 有効期限検索（期限切れセッション削除用）
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at)
  WHERE expires_at <= NOW() AND revoked = FALSE;

-- リフレッシュ有効期限検索
CREATE INDEX idx_sessions_refresh_expires_at ON sessions(refresh_expires_at)
  WHERE refresh_expires_at <= NOW() AND revoked = FALSE;

-- 無効化セッション検索（監査用）
CREATE INDEX idx_sessions_revoked ON sessions(user_id, revoked_at DESC)
  WHERE revoked = TRUE;

-- IPアドレス検索（セキュリティ分析用）
CREATE INDEX idx_sessions_ip_address ON sessions(ip_address, created_at DESC);

-- 位置情報検索（GINインデックス）
CREATE INDEX idx_sessions_geolocation_gin ON sessions USING gin(geolocation);
```

**インデックス数**: 9個
**最も重要**: `idx_sessions_access_token`（トークン検証時に毎回使用、p95 < 20ms）

---

#### password_history テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_password_history ON password_history(id);

-- ユーザーID + 作成日時（直近3件取得用）
CREATE INDEX idx_password_history_user_created ON password_history(user_id, created_at DESC);
```

**インデックス数**: 2個

---

#### login_attempts テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_login_attempts ON login_attempts(id);

-- ユーザーID + 試行日時（ユーザー履歴検索）
CREATE INDEX idx_login_attempts_user_attempted ON login_attempts(user_id, attempted_at DESC)
  WHERE user_id IS NOT NULL;

-- メール + 試行日時（brute-force検知）
CREATE INDEX idx_login_attempts_email_attempted ON login_attempts(email, attempted_at DESC);

-- IPアドレス + 試行日時（brute-force検知）
CREATE INDEX idx_login_attempts_ip_attempted ON login_attempts(ip_address, attempted_at DESC);

-- 失敗試行検索（セキュリティ分析）
CREATE INDEX idx_login_attempts_failures ON login_attempts(email, ip_address, attempted_at DESC)
  WHERE success = FALSE;

-- 試行日時検索（パーティション削除用）
CREATE INDEX idx_login_attempts_attempted_at ON login_attempts(attempted_at DESC);

-- 位置情報検索（GINインデックス）
CREATE INDEX idx_login_attempts_geolocation_gin ON login_attempts USING gin(geolocation);
```

**インデックス数**: 7個

---

#### audit_logs テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_audit_logs ON audit_logs(id);

-- ユーザーID + 記録日時（ユーザー監査ログ検索）
CREATE INDEX idx_audit_logs_user_recorded ON audit_logs(user_id, recorded_at DESC)
  WHERE user_id IS NOT NULL;

-- アクション検索
CREATE INDEX idx_audit_logs_action ON audit_logs(action, recorded_at DESC);

-- リソース検索
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id, recorded_at DESC)
  WHERE resource IS NOT NULL;

-- セッションID検索
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id, recorded_at DESC)
  WHERE session_id IS NOT NULL;

-- 成功・失敗検索
CREATE INDEX idx_audit_logs_success ON audit_logs(success, recorded_at DESC);

-- 記録日時検索（パーティション用）
CREATE INDEX idx_audit_logs_recorded_at ON audit_logs(recorded_at DESC);

-- ハッシュチェーン検証用（previous_hash検索）
CREATE INDEX idx_audit_logs_previous_hash ON audit_logs(previous_hash)
  WHERE previous_hash IS NOT NULL;

-- 詳細情報検索（GINインデックス）
CREATE INDEX idx_audit_logs_details_gin ON audit_logs USING gin(details);

-- 複合インデックス（ユーザー + アクション + 日時）
CREATE INDEX idx_audit_logs_user_action_time ON audit_logs(user_id, action, recorded_at DESC)
  WHERE user_id IS NOT NULL;
```

**インデックス数**: 10個

---

#### security_events テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_security_events ON security_events(id);

-- イベントタイプ + 検知日時
CREATE INDEX idx_security_events_type_detected ON security_events(event_type, detected_at DESC);

-- 重要度検索
CREATE INDEX idx_security_events_severity ON security_events(severity, detected_at DESC);

-- ユーザーID検索
CREATE INDEX idx_security_events_user_id ON security_events(user_id, detected_at DESC)
  WHERE user_id IS NOT NULL;

-- IPアドレス検索
CREATE INDEX idx_security_events_ip_address ON security_events(ip_address, detected_at DESC);

-- リスクスコア検索（高リスクイベント抽出）
CREATE INDEX idx_security_events_risk_score ON security_events(risk_score DESC, detected_at DESC)
  WHERE risk_score >= 50;

-- 未解決イベント検索
CREATE INDEX idx_security_events_unresolved ON security_events(severity, detected_at DESC)
  WHERE resolved = FALSE;

-- 解決済みイベント検索
CREATE INDEX idx_security_events_resolved ON security_events(resolved_by, resolved_at DESC)
  WHERE resolved = TRUE;

-- ポリシーID検索
CREATE INDEX idx_security_events_policy_id ON security_events(policy_id, detected_at DESC)
  WHERE policy_id IS NOT NULL;

-- GINインデックス（risk_indicators, automated_actions）
CREATE INDEX idx_security_events_risk_indicators_gin ON security_events USING gin(risk_indicators);
CREATE INDEX idx_security_events_geolocation_gin ON security_events USING gin(geolocation);
```

**インデックス数**: 11個

---

#### security_policies テーブル

```sql
-- 主キー
CREATE UNIQUE INDEX pk_security_policies ON security_policies(id);

-- ポリシー名検索（UNIQUE）
CREATE UNIQUE INDEX idx_security_policies_name ON security_policies(name);

-- ポリシータイプ検索
CREATE INDEX idx_security_policies_type ON security_policies(policy_type)
  WHERE enabled = TRUE;

-- スコープ検索
CREATE INDEX idx_security_policies_scope ON security_policies(scope_type, scope_id)
  WHERE scope_type IS NOT NULL AND enabled = TRUE;

-- 優先度検索
CREATE INDEX idx_security_policies_priority ON security_policies(priority, policy_type)
  WHERE enabled = TRUE;

-- GINインデックス（config JSON検索）
CREATE INDEX idx_security_policies_config_gin ON security_policies USING gin(config);
```

**インデックス数**: 6個

---

### インデックス総数

| テーブル | インデックス数 | 備考 |
|---------|--------------|------|
| users | 10 | ログイン認証、ステータス検索重視 |
| roles | 6 | 階層構造、permissions_json |
| permissions | 6 | resource:action検索 |
| user_roles | 8 | 権限チェック最適化 |
| role_permissions | 4 | シンプルな関連テーブル |
| sessions | 9 | トークン検証、セッション管理 |
| password_history | 2 | 直近3件取得のみ |
| login_attempts | 7 | brute-force検知 |
| audit_logs | 10 | 監査ログ検索、ハッシュチェーン |
| security_events | 11 | リスクスコア、未解決イベント |
| security_policies | 6 | ポリシー適用最適化 |
| **合計** | **79個** | 部分インデックス、GINインデックス含む |

---

## 制約定義 {#constraints}

### CHECK制約

```sql
-- users: ステータス制約
ALTER TABLE users ADD CONSTRAINT chk_users_status
  CHECK (status IN ('inactive', 'active', 'suspended', 'deleted'));

-- users: MFA設定整合性
ALTER TABLE users ADD CONSTRAINT chk_users_mfa
  CHECK (
    (mfa_enabled = TRUE AND mfa_method IS NOT NULL AND mfa_secret IS NOT NULL)
    OR mfa_enabled = FALSE
  );

-- users: ロック時刻整合性
ALTER TABLE users ADD CONSTRAINT chk_users_locked_until
  CHECK (locked_until IS NULL OR locked_until > created_at);

-- users: メール確認整合性
ALTER TABLE users ADD CONSTRAINT chk_users_email_verified
  CHECK (
    (email_verified = TRUE AND email_verified_at IS NOT NULL)
    OR email_verified = FALSE
  );

-- roles: レベル範囲
ALTER TABLE roles ADD CONSTRAINT chk_roles_level
  CHECK (level >= 0 AND level <= 10);

-- permissions: アクション制約
ALTER TABLE permissions ADD CONSTRAINT chk_permissions_action
  CHECK (action IN ('read', 'write', 'delete', 'execute', '*'));

-- user_roles: 有効期限整合性
ALTER TABLE user_roles ADD CONSTRAINT chk_user_roles_expires_at
  CHECK (expires_at IS NULL OR expires_at > granted_at);

-- user_roles: 取り消し整合性
ALTER TABLE user_roles ADD CONSTRAINT chk_user_roles_revoked
  CHECK (
    (revoked = TRUE AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL)
    OR revoked = FALSE
  );

-- sessions: 有効期限整合性
ALTER TABLE sessions ADD CONSTRAINT chk_sessions_expires_at
  CHECK (
    expires_at > created_at AND
    refresh_expires_at > expires_at
  );

-- sessions: 無効化整合性
ALTER TABLE sessions ADD CONSTRAINT chk_sessions_revoked
  CHECK (
    (revoked = TRUE AND revoked_at IS NOT NULL AND revoked_reason IS NOT NULL)
    OR revoked = FALSE
  );

-- login_attempts: MFA整合性
ALTER TABLE login_attempts ADD CONSTRAINT chk_login_attempts_mfa
  CHECK (
    (mfa_required = TRUE AND mfa_success IS NOT NULL)
    OR mfa_required = FALSE
  );

-- security_events: 重要度制約
ALTER TABLE security_events ADD CONSTRAINT chk_security_events_severity
  CHECK (severity IN ('low', 'medium', 'high', 'critical'));

-- security_events: リスクスコア範囲
ALTER TABLE security_events ADD CONSTRAINT chk_security_events_risk_score
  CHECK (risk_score >= 0 AND risk_score <= 100);

-- security_events: 解決整合性
ALTER TABLE security_events ADD CONSTRAINT chk_security_events_resolved
  CHECK (
    (resolved = TRUE AND resolved_by IS NOT NULL AND resolved_at IS NOT NULL)
    OR resolved = FALSE
  );

-- security_policies: ポリシータイプ制約
ALTER TABLE security_policies ADD CONSTRAINT chk_security_policies_type
  CHECK (policy_type IN ('ACCOUNT_LOCK', 'PASSWORD', 'SESSION', 'MFA', 'CUSTOM'));

-- security_policies: 優先度範囲
ALTER TABLE security_policies ADD CONSTRAINT chk_security_policies_priority
  CHECK (priority > 0 AND priority <= 1000);
```

### UNIQUE制約

```sql
-- users
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT uq_users_username UNIQUE (username);

-- roles
ALTER TABLE roles ADD CONSTRAINT uq_roles_name UNIQUE (name);

-- permissions
ALTER TABLE permissions ADD CONSTRAINT uq_permissions_name UNIQUE (name);
ALTER TABLE permissions ADD CONSTRAINT uq_permissions_resource_action UNIQUE (resource, action);

-- user_roles: 同一ユーザー・ロール・スコープの組み合わせは一意
CREATE UNIQUE INDEX uq_user_roles_user_role_scope ON user_roles(user_id, role_id, scope_type, scope_id)
  WHERE revoked = FALSE;

-- role_permissions
ALTER TABLE role_permissions ADD CONSTRAINT uq_role_permissions_role_permission UNIQUE (role_id, permission_id);

-- sessions
ALTER TABLE sessions ADD CONSTRAINT uq_sessions_access_token UNIQUE (access_token_hash);
ALTER TABLE sessions ADD CONSTRAINT uq_sessions_refresh_token UNIQUE (refresh_token_hash);

-- security_policies
ALTER TABLE security_policies ADD CONSTRAINT uq_security_policies_name UNIQUE (name);
```

### 外部キー制約

```sql
-- users
ALTER TABLE users ADD CONSTRAINT fk_users_created_by
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_suspended_by
  FOREIGN KEY (suspended_by) REFERENCES users(id) ON DELETE SET NULL;

-- roles
ALTER TABLE roles ADD CONSTRAINT fk_roles_parent_role
  FOREIGN KEY (parent_role_id) REFERENCES roles(id) ON DELETE SET NULL;
ALTER TABLE roles ADD CONSTRAINT fk_roles_created_by
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- user_roles
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_role
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_granted_by
  FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_revoked_by
  FOREIGN KEY (revoked_by) REFERENCES users(id) ON DELETE SET NULL;

-- role_permissions
ALTER TABLE role_permissions ADD CONSTRAINT fk_role_permissions_role
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;
ALTER TABLE role_permissions ADD CONSTRAINT fk_role_permissions_permission
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

-- sessions
ALTER TABLE sessions ADD CONSTRAINT fk_sessions_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- password_history
ALTER TABLE password_history ADD CONSTRAINT fk_password_history_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- login_attempts
ALTER TABLE login_attempts ADD CONSTRAINT fk_login_attempts_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE login_attempts ADD CONSTRAINT fk_login_attempts_session
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

-- audit_logs
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_session
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL;

-- security_events
ALTER TABLE security_events ADD CONSTRAINT fk_security_events_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE security_events ADD CONSTRAINT fk_security_events_detected_by
  FOREIGN KEY (detected_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE security_events ADD CONSTRAINT fk_security_events_resolved_by
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE security_events ADD CONSTRAINT fk_security_events_policy
  FOREIGN KEY (policy_id) REFERENCES security_policies(id) ON DELETE SET NULL;

-- security_policies
ALTER TABLE security_policies ADD CONSTRAINT fk_security_policies_created_by
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
```

---

## トリガー関数 {#triggers}

### 1. 更新日時自動更新

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 適用テーブル
CREATE TRIGGER trg_users_update_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_roles_update_timestamp
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_security_policies_update_timestamp
  BEFORE UPDATE ON security_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. パスワード変更時の履歴保存

```sql
CREATE OR REPLACE FUNCTION save_password_history()
RETURNS TRIGGER AS $$
BEGIN
  -- パスワードが変更された場合
  IF NEW.password_hash != OLD.password_hash THEN
    -- 古いパスワードを履歴に保存
    INSERT INTO password_history (user_id, password_hash)
    VALUES (OLD.id, OLD.password_hash);

    -- 直近3件のみ保持（古いものを削除）
    DELETE FROM password_history
    WHERE user_id = OLD.id
      AND id NOT IN (
        SELECT id FROM password_history
        WHERE user_id = OLD.id
        ORDER BY created_at DESC
        LIMIT 3
      );

    -- password_changed_at更新
    NEW.password_changed_at = CURRENT_TIMESTAMP;

    -- 全セッション無効化（セキュリティ）
    UPDATE sessions
    SET revoked = TRUE,
        revoked_at = CURRENT_TIMESTAMP,
        revoked_reason = 'password_change'
    WHERE user_id = OLD.id AND revoked = FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_password_change
  BEFORE UPDATE OF password_hash ON users
  FOR EACH ROW
  WHEN (NEW.password_hash IS DISTINCT FROM OLD.password_hash)
  EXECUTE FUNCTION save_password_history();
```

### 3. セッション数制限（最大5個）

```sql
CREATE OR REPLACE FUNCTION enforce_session_limit()
RETURNS TRIGGER AS $$
DECLARE
  session_count INTEGER;
  oldest_session_id UUID;
BEGIN
  -- 現在のアクティブセッション数を取得
  SELECT COUNT(*) INTO session_count
  FROM sessions
  WHERE user_id = NEW.user_id
    AND revoked = FALSE
    AND expires_at > NOW();

  -- 5個を超える場合、最古のセッションを削除
  IF session_count >= 5 THEN
    SELECT id INTO oldest_session_id
    FROM sessions
    WHERE user_id = NEW.user_id
      AND revoked = FALSE
      AND expires_at > NOW()
    ORDER BY created_at ASC
    LIMIT 1;

    UPDATE sessions
    SET revoked = TRUE,
        revoked_at = CURRENT_TIMESTAMP,
        revoked_reason = 'session_limit_exceeded'
    WHERE id = oldest_session_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sessions_enforce_limit
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION enforce_session_limit();
```

### 4. 監査ログハッシュチェーン

```sql
CREATE OR REPLACE FUNCTION calculate_audit_log_hash()
RETURNS TRIGGER AS $$
DECLARE
  last_hash VARCHAR(64);
  hash_input TEXT;
BEGIN
  -- 直前のログのハッシュを取得
  SELECT hash INTO last_hash
  FROM audit_logs
  ORDER BY recorded_at DESC, id DESC
  LIMIT 1;

  -- ハッシュ入力文字列を生成
  hash_input := CONCAT(
    COALESCE(NEW.id::TEXT, ''),
    '|',
    COALESCE(NEW.user_id::TEXT, ''),
    '|',
    COALESCE(NEW.action, ''),
    '|',
    COALESCE(NEW.resource, ''),
    '|',
    COALESCE(NEW.resource_id, ''),
    '|',
    COALESCE(NEW.recorded_at::TEXT, ''),
    '|',
    COALESCE(last_hash, '')
  );

  -- SHA-256ハッシュ計算
  NEW.hash := encode(digest(hash_input, 'sha256'), 'hex');
  NEW.previous_hash := last_hash;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_logs_hash_chain
  BEFORE INSERT ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION calculate_audit_log_hash();
```

### 5. ログイン失敗カウント・アカウントロック

```sql
CREATE OR REPLACE FUNCTION handle_login_failure()
RETURNS TRIGGER AS $$
DECLARE
  failure_count INTEGER;
  lock_policy JSONB;
BEGIN
  -- ログイン失敗の場合のみ処理
  IF NEW.success = FALSE AND NEW.user_id IS NOT NULL THEN
    -- 失敗カウントをインクリメント
    UPDATE users
    SET login_failure_count = login_failure_count + 1
    WHERE id = NEW.user_id;

    -- 現在の失敗カウントを取得
    SELECT login_failure_count INTO failure_count
    FROM users
    WHERE id = NEW.user_id;

    -- ポリシー取得（デフォルト: 5回失敗で30分ロック）
    SELECT config INTO lock_policy
    FROM security_policies
    WHERE policy_type = 'ACCOUNT_LOCK'
      AND enabled = TRUE
      AND (scope_type IS NULL OR (scope_type = 'user' AND scope_id = NEW.user_id))
    ORDER BY priority ASC
    LIMIT 1;

    -- アカウントロック判定
    IF failure_count >= COALESCE((lock_policy->>'max_failures')::INTEGER, 5) THEN
      UPDATE users
      SET locked_until = NOW() + INTERVAL '1 minute' * COALESCE((lock_policy->>'lock_duration_minutes')::INTEGER, 30),
          status = 'suspended'
      WHERE id = NEW.user_id;

      -- セキュリティイベント記録
      INSERT INTO security_events (
        event_type, severity, user_id, ip_address, description,
        risk_score, risk_indicators, detected_at
      ) VALUES (
        'ACCOUNT_LOCKED',
        'high',
        NEW.user_id,
        NEW.ip_address,
        'Account locked due to multiple login failures',
        80,
        jsonb_build_array(
          jsonb_build_object('type', 'MULTIPLE_LOGIN_FAILURES', 'score', 80, 'details', failure_count || ' failures')
        ),
        NOW()
      );
    END IF;
  END IF;

  -- ログイン成功の場合、失敗カウントリセット
  IF NEW.success = TRUE AND NEW.user_id IS NOT NULL THEN
    UPDATE users
    SET login_failure_count = 0,
        last_login_at = NEW.attempted_at,
        last_login_ip = NEW.ip_address
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_login_attempts_handle_failure
  AFTER INSERT ON login_attempts
  FOR EACH ROW
  EXECUTE FUNCTION handle_login_failure();
```

### 6. セキュリティイベント自動対応

```sql
CREATE OR REPLACE FUNCTION auto_respond_security_event()
RETURNS TRIGGER AS $$
BEGIN
  -- リスクスコア >= 75: アカウント自動ロック
  IF NEW.risk_score >= 75 AND NEW.user_id IS NOT NULL THEN
    UPDATE users
    SET locked_until = NOW() + INTERVAL '1 hour',
        status = 'suspended'
    WHERE id = NEW.user_id;

    -- 自動対応アクション記録
    NEW.automated_actions := jsonb_build_array(
      jsonb_build_object(
        'action', 'ACCOUNT_LOCKED',
        'duration_minutes', 60,
        'timestamp', NOW()
      )
    );

    -- BC-007にアラート送信（pg_notify）
    PERFORM pg_notify('security_alert', json_build_object(
      'event_id', NEW.id,
      'severity', NEW.severity,
      'user_id', NEW.user_id,
      'risk_score', NEW.risk_score,
      'event_type', NEW.event_type
    )::text);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_security_events_auto_respond
  BEFORE INSERT ON security_events
  FOR EACH ROW
  WHEN (NEW.risk_score >= 75)
  EXECUTE FUNCTION auto_respond_security_event();
```

### 7. ロール階層レベル自動計算

```sql
CREATE OR REPLACE FUNCTION calculate_role_level()
RETURNS TRIGGER AS $$
DECLARE
  parent_level INTEGER;
BEGIN
  IF NEW.parent_role_id IS NULL THEN
    NEW.level := 0;
  ELSE
    SELECT level INTO parent_level
    FROM roles
    WHERE id = NEW.parent_role_id;

    NEW.level := COALESCE(parent_level, 0) + 1;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_roles_calculate_level
  BEFORE INSERT OR UPDATE OF parent_role_id ON roles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_role_level();
```

### 8. 権限JSONキャッシュ更新

```sql
CREATE OR REPLACE FUNCTION update_role_permissions_json()
RETURNS TRIGGER AS $$
DECLARE
  role_id_to_update UUID;
  permissions_array JSONB;
BEGIN
  -- 更新対象のrole_idを取得
  IF TG_OP = 'DELETE' THEN
    role_id_to_update := OLD.role_id;
  ELSE
    role_id_to_update := NEW.role_id;
  END IF;

  -- role_permissionsから権限を集約
  SELECT jsonb_agg(p.name) INTO permissions_array
  FROM role_permissions rp
  JOIN permissions p ON rp.permission_id = p.id
  WHERE rp.role_id = role_id_to_update;

  -- roles.permissions_json更新
  UPDATE roles
  SET permissions_json = COALESCE(permissions_array, '[]'::jsonb)
  WHERE id = role_id_to_update;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_role_permissions_update_json
  AFTER INSERT OR UPDATE OR DELETE ON role_permissions
  FOR EACH ROW
  EXECUTE FUNCTION update_role_permissions_json();
```

---

## パフォーマンス最適化 {#performance}

### 1. インデックスメンテナンス

```sql
-- 定期的なインデックス再構築（週次）
REINDEX TABLE users;
REINDEX TABLE sessions;
REINDEX TABLE audit_logs;

-- 未使用インデックスの確認
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
ORDER BY tablename, indexname;
```

### 2. 統計情報更新

```sql
-- 重要テーブルの統計情報更新（日次）
ANALYZE users;
ANALYZE sessions;
ANALYZE user_roles;
ANALYZE audit_logs;
ANALYZE security_events;
```

### 3. VACUUMスケジュール

```sql
-- postgresql.conf設定
autovacuum = on
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_scale_factor = 0.05

-- 手動VACUUM（必要に応じて）
VACUUM ANALYZE users;
VACUUM ANALYZE sessions;
```

### 4. クエリパフォーマンスモニタリング

```sql
-- 実行時間の長いクエリを特定
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time,
  stddev_time
FROM pg_stat_statements
WHERE query LIKE '%users%' OR query LIKE '%sessions%'
ORDER BY mean_time DESC
LIMIT 20;

-- テーブルサイズ確認
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 関連ドキュメント

- [README.md](README.md) - データ設計概要
- [tables.md](tables.md) - テーブル詳細定義
- [query-patterns.md](query-patterns.md) - クエリパターン
- [backup-security.md](backup-security.md) - バックアップ・復旧戦略

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.2 - BC-003 データ設計詳細化
