# BC-003: クエリパターン

**BC**: Access Control & Security
**ドキュメント**: データ層 - クエリパターン
**最終更新**: 2025-11-03

このドキュメントでは、BC-003の主要クエリパターンとパフォーマンスメトリクスを記載します。

---

## 目次

1. [認証クエリ](#auth-queries)
2. [認可・権限チェッククエリ](#authz-queries)
3. [監査ログクエリ](#audit-queries)
4. [セキュリティイベントクエリ](#security-queries)
5. [ユーザー管理クエリ](#user-queries)
6. [レポート・分析クエリ](#report-queries)

---

## 認証クエリ {#auth-queries}

### 1. ユーザーログイン（メール + パスワード）

```sql
-- Step 1: ユーザー検索とアカウントステータス確認
SELECT
  id,
  email,
  username,
  password_hash,
  status,
  mfa_enabled,
  mfa_method,
  mfa_secret,
  login_failure_count,
  locked_until,
  email_verified
FROM users
WHERE email = $1
  AND status IN ('active', 'inactive')
  AND (locked_until IS NULL OR locked_until < NOW())
  AND deleted_at IS NULL;

-- パフォーマンス: p95 < 10ms
-- インデックス: idx_users_email
```

```sql
-- Step 2: パスワード検証（アプリケーション層でbcrypt）
-- bcrypt.compare(input_password, user.password_hash)

-- Step 3a: ログイン成功時 - セッション作成
INSERT INTO sessions (
  id,
  user_id,
  access_token_hash,
  refresh_token_hash,
  ip_address,
  user_agent,
  device_type,
  geolocation,
  expires_at,
  refresh_expires_at
) VALUES (
  $1, -- session_id (JWT jti)
  $2, -- user_id
  $3, -- SHA256(access_token)
  $4, -- SHA256(refresh_token)
  $5, -- ip_address
  $6, -- user_agent
  $7, -- device_type
  $8, -- geolocation JSON
  NOW() + INTERVAL '30 minutes', -- access_token expires
  NOW() + INTERVAL '7 days' -- refresh_token expires
)
RETURNING id, expires_at, refresh_expires_at;

-- パフォーマンス: p95 < 20ms
-- トリガー: trg_sessions_enforce_limit (最大5セッション制限)
```

```sql
-- Step 3b: ログイン失敗時 - 失敗カウント更新
INSERT INTO login_attempts (
  user_id,
  email,
  ip_address,
  user_agent,
  geolocation,
  success,
  failure_reason,
  attempted_at
) VALUES (
  $1, $2, $3, $4, $5, FALSE, 'invalid_password', NOW()
);

-- トリガー: trg_login_attempts_handle_failure
-- - login_failure_count インクリメント
-- - 5回失敗でアカウントロック（locked_until設定）
-- - security_events記録

-- パフォーマンス: p95 < 30ms
```

**総合パフォーマンス目標**:
- 成功時: p95 < 100ms（セッション作成含む）
- 失敗時: p95 < 50ms

---

### 2. トークン検証（BC間統合用）

```sql
-- アクセストークン検証
SELECT
  s.id AS session_id,
  s.user_id,
  s.expires_at,
  s.revoked,
  u.email,
  u.username,
  u.status
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.access_token_hash = $1 -- SHA256(access_token)
  AND s.revoked = FALSE
  AND s.expires_at > NOW()
  AND u.status = 'active'
  AND u.deleted_at IS NULL;

-- パフォーマンス: p95 < 20ms
-- インデックス: idx_sessions_access_token (UNIQUE, 部分インデックス)
-- レート制限: 500 req/min（BC間統合用）
```

```sql
-- リフレッシュトークン検証
SELECT
  id AS session_id,
  user_id,
  refresh_expires_at
FROM sessions
WHERE refresh_token_hash = $1
  AND revoked = FALSE
  AND refresh_expires_at > NOW();

-- 成功時の処理:
-- 1. 新しいaccess_tokenを生成
-- 2. sessions.access_token_hash, expires_at 更新
-- 3. sessions.last_activity_at 更新

-- パフォーマンス: p95 < 30ms
-- インデックス: idx_sessions_refresh_token
```

---

### 3. MFA検証

```sql
-- MFAシークレット取得
SELECT
  id,
  mfa_enabled,
  mfa_method,
  pgp_sym_decrypt(mfa_secret::bytea, $2) AS decrypted_secret -- $2 = encryption_key
FROM users
WHERE id = $1
  AND mfa_enabled = TRUE;

-- アプリケーション層でTOTP検証（6桁コード、30秒ウィンドウ）

-- パフォーマンス: p95 < 50ms
```

---

## 認可・権限チェッククエリ {#authz-queries}

### 4. ユーザー権限チェック（BC間統合用）

```sql
-- 権限チェック（permission名指定）
WITH user_effective_permissions AS (
  SELECT DISTINCT p.name AS permission_name
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  JOIN role_permissions rp ON r.id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = $1 -- user_id
    AND ur.revoked = FALSE
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND (ur.scope_type IS NULL OR ur.scope_type = $2) -- scope_type (optional)
    AND (ur.scope_id IS NULL OR ur.scope_id = $3) -- scope_id (optional)
)
SELECT EXISTS (
  SELECT 1 FROM user_effective_permissions
  WHERE permission_name = $4 -- required permission (例: 'project:write')
) AS granted;

-- パフォーマンス: p95 < 50ms
-- インデックス: idx_user_roles_user_id, idx_role_permissions_role_id
-- レート制限: 500 req/min（BC間統合用）
```

```sql
-- 階層的権限チェック（親ロールの権限も含む）
WITH RECURSIVE role_hierarchy AS (
  -- ユーザーの直接ロール
  SELECT r.id, r.name, r.parent_role_id, r.level
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = $1
    AND ur.revoked = FALSE
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())

  UNION ALL

  -- 親ロールを再帰的に取得
  SELECT r.id, r.name, r.parent_role_id, r.level
  FROM roles r
  JOIN role_hierarchy rh ON r.id = rh.parent_role_id
),
user_all_permissions AS (
  SELECT DISTINCT p.name AS permission_name
  FROM role_hierarchy rh
  JOIN role_permissions rp ON rh.id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
)
SELECT permission_name
FROM user_all_permissions
ORDER BY permission_name;

-- パフォーマンス: p95 < 100ms（再帰クエリ）
-- キャッシュ推奨（Redis, TTL=5分）
```

---

### 5. ユーザーロール・権限一覧取得

```sql
-- ユーザーのロールと権限を一括取得（プロフィールページ用）
SELECT
  r.id AS role_id,
  r.name AS role_name,
  r.display_name,
  r.level,
  ur.scope_type,
  ur.scope_id,
  ur.granted_at,
  ur.expires_at,
  r.permissions_json -- キャッシュされた権限JSON
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
WHERE ur.user_id = $1
  AND ur.revoked = FALSE
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
ORDER BY r.level ASC, ur.granted_at DESC;

-- パフォーマンス: p95 < 80ms
-- インデックス: idx_user_roles_user_id
```

---

## 監査ログクエリ {#audit-queries}

### 6. ユーザー監査ログ検索

```sql
-- 特定ユーザーの監査ログ（日付範囲指定）
SELECT
  id,
  action,
  resource,
  resource_id,
  details,
  ip_address,
  success,
  error_code,
  recorded_at
FROM audit_logs
WHERE user_id = $1 -- user_id
  AND recorded_at BETWEEN $2 AND $3 -- date range
ORDER BY recorded_at DESC
LIMIT 100 OFFSET $4; -- pagination

-- パフォーマンス: p95 < 300ms
-- インデックス: idx_audit_logs_user_recorded
-- パーティション: 月次（recorded_at）
```

```sql
-- アクション別監査ログ集計
SELECT
  action,
  COUNT(*) AS total_count,
  SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS success_count,
  SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) AS failure_count,
  DATE_TRUNC('day', recorded_at) AS date
FROM audit_logs
WHERE recorded_at >= NOW() - INTERVAL '30 days'
GROUP BY action, DATE_TRUNC('day', recorded_at)
ORDER BY date DESC, total_count DESC;

-- パフォーマンス: p95 < 800ms
-- 最適化: マテリアライズドビュー推奨
```

---

### 7. 監査ログハッシュチェーン検証

```sql
-- ハッシュチェーン検証（改ざん検知）
WITH log_chain AS (
  SELECT
    id,
    hash,
    previous_hash,
    LAG(hash) OVER (ORDER BY recorded_at, id) AS expected_previous_hash
  FROM audit_logs
  WHERE recorded_at BETWEEN $1 AND $2
  ORDER BY recorded_at, id
)
SELECT
  id,
  hash,
  previous_hash,
  expected_previous_hash,
  CASE
    WHEN previous_hash IS NULL AND expected_previous_hash IS NULL THEN TRUE
    WHEN previous_hash = expected_previous_hash THEN TRUE
    ELSE FALSE
  END AS chain_valid
FROM log_chain
WHERE previous_hash IS DISTINCT FROM expected_previous_hash;

-- 不整合が見つかった場合、セキュリティアラート
-- パフォーマンス: p95 < 1000ms（大量データの場合）
```

---

## セキュリティイベントクエリ {#security-queries}

### 8. 未解決セキュリティイベント一覧

```sql
-- 重要度別未解決イベント
SELECT
  id,
  event_type,
  severity,
  user_id,
  ip_address,
  description,
  risk_score,
  risk_indicators,
  automated_actions,
  detected_at
FROM security_events
WHERE resolved = FALSE
ORDER BY
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  risk_score DESC,
  detected_at ASC
LIMIT 50;

-- パフォーマンス: p95 < 200ms
-- インデックス: idx_security_events_unresolved
```

---

### 9. セキュリティイベント相関分析

```sql
-- 同一IPアドレスからの複数イベント検出
SELECT
  ip_address,
  COUNT(*) AS event_count,
  ARRAY_AGG(DISTINCT event_type) AS event_types,
  MAX(risk_score) AS max_risk_score,
  MIN(detected_at) AS first_detected,
  MAX(detected_at) AS last_detected
FROM security_events
WHERE detected_at >= NOW() - INTERVAL '24 hours'
  AND resolved = FALSE
GROUP BY ip_address
HAVING COUNT(*) >= 3 -- 3件以上のイベント
ORDER BY event_count DESC, max_risk_score DESC
LIMIT 20;

-- パフォーマンス: p95 < 500ms
-- インデックス: idx_security_events_ip_address
```

```sql
-- 特定ユーザーのリスクプロファイル
WITH user_events AS (
  SELECT
    user_id,
    COUNT(*) AS total_events,
    SUM(risk_score) AS total_risk_score,
    AVG(risk_score) AS avg_risk_score,
    MAX(risk_score) AS max_risk_score,
    COUNT(CASE WHEN severity IN ('high', 'critical') THEN 1 END) AS high_severity_count,
    ARRAY_AGG(DISTINCT event_type) AS event_types
  FROM security_events
  WHERE user_id = $1 -- user_id
    AND detected_at >= NOW() - INTERVAL '90 days'
  GROUP BY user_id
),
user_logins AS (
  SELECT
    user_id,
    COUNT(*) AS total_attempts,
    SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) AS successful_logins,
    SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) AS failed_logins
  FROM login_attempts
  WHERE user_id = $1
    AND attempted_at >= NOW() - INTERVAL '90 days'
  GROUP BY user_id
)
SELECT
  u.id,
  u.email,
  u.username,
  u.status,
  u.mfa_enabled,
  COALESCE(ue.total_events, 0) AS security_events_count,
  COALESCE(ue.avg_risk_score, 0) AS avg_risk_score,
  COALESCE(ue.max_risk_score, 0) AS max_risk_score,
  COALESCE(ue.high_severity_count, 0) AS high_severity_events,
  COALESCE(ul.failed_logins, 0) AS failed_login_count,
  COALESCE(ul.total_attempts, 0) AS total_login_attempts
FROM users u
LEFT JOIN user_events ue ON u.id = ue.user_id
LEFT JOIN user_logins ul ON u.id = ul.user_id
WHERE u.id = $1;

-- パフォーマンス: p95 < 400ms
```

---

## ユーザー管理クエリ {#user-queries}

### 10. ユーザー検索（管理画面用）

```sql
-- 高度なフィルタリング
SELECT
  u.id,
  u.email,
  u.username,
  u.status,
  u.mfa_enabled,
  u.last_login_at,
  u.created_at,
  ARRAY_AGG(DISTINCT r.name) AS roles,
  COUNT(DISTINCT s.id) AS active_sessions
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
  AND ur.revoked = FALSE
  AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN sessions s ON u.id = s.user_id
  AND s.revoked = FALSE
  AND s.expires_at > NOW()
WHERE u.deleted_at IS NULL
  AND ($1::VARCHAR IS NULL OR u.email ILIKE '%' || $1 || '%') -- email filter
  AND ($2::VARCHAR IS NULL OR u.username ILIKE '%' || $2 || '%') -- username filter
  AND ($3::VARCHAR IS NULL OR u.status = $3) -- status filter
  AND ($4::BOOLEAN IS NULL OR u.mfa_enabled = $4) -- mfa filter
GROUP BY u.id
ORDER BY u.created_at DESC
LIMIT 50 OFFSET $5; -- pagination

-- パフォーマンス: p95 < 600ms
-- インデックス: idx_users_email, idx_users_username, idx_users_status_active
```

---

### 11. アカウントロック中ユーザー一覧

```sql
-- 自動解除予定時刻付き
SELECT
  u.id,
  u.email,
  u.username,
  u.login_failure_count,
  u.locked_until,
  EXTRACT(EPOCH FROM (u.locked_until - NOW())) / 60 AS minutes_until_unlock,
  (SELECT ip_address FROM login_attempts
   WHERE user_id = u.id AND success = FALSE
   ORDER BY attempted_at DESC LIMIT 1) AS last_failed_ip
FROM users u
WHERE u.locked_until IS NOT NULL
  AND u.locked_until > NOW()
ORDER BY u.locked_until ASC;

-- パフォーマンス: p95 < 150ms
-- インデックス: idx_users_locked
```

---

## レポート・分析クエリ {#report-queries}

### 12. セキュリティダッシュボード統計

```sql
-- 過去30日間のセキュリティメトリクス
WITH metrics AS (
  SELECT
    COUNT(DISTINCT CASE WHEN la.attempted_at >= NOW() - INTERVAL '30 days' THEN la.id END) AS total_login_attempts,
    COUNT(DISTINCT CASE WHEN la.attempted_at >= NOW() - INTERVAL '30 days' AND la.success = TRUE THEN la.id END) AS successful_logins,
    COUNT(DISTINCT CASE WHEN la.attempted_at >= NOW() - INTERVAL '30 days' AND la.success = FALSE THEN la.id END) AS failed_logins,
    COUNT(DISTINCT CASE WHEN se.detected_at >= NOW() - INTERVAL '30 days' THEN se.id END) AS security_events,
    COUNT(DISTINCT CASE WHEN se.detected_at >= NOW() - INTERVAL '30 days' AND se.severity = 'critical' THEN se.id END) AS critical_events,
    COUNT(DISTINCT CASE WHEN u.created_at >= NOW() - INTERVAL '30 days' THEN u.id END) AS new_users,
    COUNT(DISTINCT CASE WHEN u.status = 'active' AND u.mfa_enabled = TRUE THEN u.id END) AS mfa_enabled_users,
    COUNT(DISTINCT CASE WHEN u.status = 'active' THEN u.id END) AS active_users,
    COUNT(DISTINCT CASE WHEN s.created_at >= NOW() - INTERVAL '24 hours' AND s.revoked = FALSE THEN s.user_id END) AS active_users_24h
  FROM users u
  LEFT JOIN login_attempts la ON TRUE
  LEFT JOIN security_events se ON TRUE
  LEFT JOIN sessions s ON TRUE
)
SELECT * FROM metrics;

-- パフォーマンス: p95 < 1000ms
-- 最適化: マテリアライズドビュー推奨（1時間ごとリフレッシュ）
```

---

### 13. brute-force攻撃検知

```sql
-- 過去1時間の異常ログイン試行パターン
SELECT
  email,
  ip_address,
  COUNT(*) AS attempt_count,
  SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) AS failure_count,
  MIN(attempted_at) AS first_attempt,
  MAX(attempted_at) AS last_attempt,
  ARRAY_AGG(DISTINCT user_agent) AS user_agents
FROM login_attempts
WHERE attempted_at >= NOW() - INTERVAL '1 hour'
GROUP BY email, ip_address
HAVING COUNT(*) >= 10 -- 10回以上の試行
  OR SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) >= 5 -- 5回以上の失敗
ORDER BY attempt_count DESC, failure_count DESC
LIMIT 50;

-- パフォーマンス: p95 < 400ms
-- インデックス: idx_login_attempts_ip_attempted, idx_login_attempts_email_attempted
-- 自動アラート: リアルタイム検知はトリガー関数で実装
```

---

### 14. 監査ログエクスポート（コンプライアンス対応）

```sql
-- 特定期間の全監査ログをCSV形式で取得
SELECT
  al.id,
  al.user_id,
  u.email AS user_email,
  al.action,
  al.resource,
  al.resource_id,
  al.ip_address,
  al.user_agent,
  al.success,
  al.error_code,
  al.error_message,
  al.recorded_at,
  al.hash,
  al.previous_hash
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.recorded_at BETWEEN $1 AND $2 -- date range
ORDER BY al.recorded_at ASC;

-- パフォーマンス: p95 < 2000ms（大量データの場合）
-- バッチ処理推奨（ページネーション使用）
-- 3年保持要件のため、パーティション管理必須
```

---

## パフォーマンスメトリクス

### 目標値

| クエリパターン | p50 | p95 | p99 | 備考 |
|--------------|-----|-----|-----|------|
| ユーザーログイン | 30ms | 100ms | 200ms | 最も頻繁に使用 |
| トークン検証 | 10ms | 20ms | 50ms | BC間統合、高頻度 |
| 権限チェック | 20ms | 50ms | 100ms | BC間統合、高頻度 |
| 監査ログ検索 | 100ms | 300ms | 800ms | パーティション最適化 |
| セキュリティイベント一覧 | 50ms | 200ms | 500ms | 部分インデックス活用 |
| ユーザー検索 | 200ms | 600ms | 1000ms | 複雑なJOIN |
| ダッシュボード統計 | 300ms | 1000ms | 2000ms | マテリアライズドビュー推奨 |

### 最適化手法

1. **インデックス活用**: 79個の最適化されたインデックス
2. **部分インデックス**: アクティブデータのみインデックス化
3. **パーティショニング**: audit_logs（月次）、security_events（月次）、login_attempts（月次）
4. **マテリアライズドビュー**: ダッシュボード統計、監査ログサマリー
5. **キャッシュ**: 権限チェック結果（Redis, TTL=5分）
6. **接続プール**: 最大100接続、最小10接続

---

## 関連ドキュメント

- [README.md](README.md) - データ設計概要
- [tables.md](tables.md) - テーブル詳細定義
- [indexes-constraints.md](indexes-constraints.md) - インデックス・制約・トリガー
- [backup-security.md](backup-security.md) - バックアップ・復旧戦略

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.2 - BC-003 データ設計詳細化
