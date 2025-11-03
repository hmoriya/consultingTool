# BC-003: バックアップ・セキュリティ・パーティショニング

**BC**: Access Control & Security
**ドキュメント**: データ層 - バックアップ・復旧・パーティショニング
**最終更新**: 2025-11-03

このドキュメントでは、BC-003のバックアップ・復旧戦略、パーティショニング、V2移行を記載します。

---

## 目次

1. [バックアップ戦略](#backup-strategy)
2. [復旧手順](#recovery)
3. [パーティショニング](#partitioning)
4. [セキュリティ対策](#security)
5. [V2からの移行](#v2-migration)

---

## バックアップ戦略 {#backup-strategy}

### 目標値

- **RPO (Recovery Point Objective)**: 1時間（WALアーカイビング間隔）
- **RTO (Recovery Time Objective)**: 4時間（全体復旧の場合）
- **バックアップ保持期間**:
  - 通常データ: 30日間
  - 監査ログ: 3年間（コンプライアンス要件）
- **検証頻度**: 月次（テスト環境での復元テスト）

---

### 1. フルバックアップ（日次）

```bash
#!/bin/bash
# BC-003 日次フルバックアップスクリプト

BACKUP_DIR="/var/backups/postgresql/bc-003"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"
RETENTION_DAYS=30

# フルバックアップ（BC-003テーブルのみ）
pg_dump -Fc -v \
  -t users \
  -t roles \
  -t permissions \
  -t user_roles \
  -t role_permissions \
  -t sessions \
  -t password_history \
  -t audit_logs \
  -t security_events \
  -t security_policies \
  -t login_attempts \
  -f "${BACKUP_DIR}/bc003_full_${TIMESTAMP}.dump" \
  ${DB_NAME}

# バックアップ圧縮（gzip）
gzip "${BACKUP_DIR}/bc003_full_${TIMESTAMP}.dump"

# チェックサム生成（改ざん検知）
sha256sum "${BACKUP_DIR}/bc003_full_${TIMESTAMP}.dump.gz" > \
  "${BACKUP_DIR}/bc003_full_${TIMESTAMP}.dump.gz.sha256"

# S3にアップロード（オフサイトバックアップ）
aws s3 cp "${BACKUP_DIR}/bc003_full_${TIMESTAMP}.dump.gz" \
  s3://consulting-tool-backups/bc-003/full/

# ${RETENTION_DAYS}日以上古いバックアップを削除
find ${BACKUP_DIR} -name "bc003_full_*.dump.gz" -mtime +${RETENTION_DAYS} -delete

# バックアップログ記録
echo "[$(date)] Full backup completed: bc003_full_${TIMESTAMP}.dump.gz" >> \
  /var/log/bc003_backup.log
```

**実行タイミング**: 毎日 午前3:00（UTC）

**重要**: 監査ログは3年保持のため、別途長期保存スクリプトを実行

---

### 2. 監査ログ長期バックアップ（週次）

```bash
#!/bin/bash
# 監査ログのみを長期保存（3年保持）

AUDIT_BACKUP_DIR="/var/backups/postgresql/bc-003/audit_logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"

# 監査ログのみバックアップ
pg_dump -Fc -v \
  -t audit_logs \
  -f "${AUDIT_BACKUP_DIR}/audit_logs_${TIMESTAMP}.dump" \
  ${DB_NAME}

# 圧縮
gzip "${AUDIT_BACKUP_DIR}/audit_logs_${TIMESTAMP}.dump"

# S3 Glacier（低コスト長期保存）にアップロード
aws s3 cp "${AUDIT_BACKUP_DIR}/audit_logs_${TIMESTAMP}.dump.gz" \
  s3://consulting-tool-backups/bc-003/audit_logs/ \
  --storage-class GLACIER

# ローカルは90日保持（Glacierから取り出すのに時間がかかるため）
find ${AUDIT_BACKUP_DIR} -name "audit_logs_*.dump.gz" -mtime +90 -delete
```

**実行タイミング**: 毎週日曜日 午前4:00（UTC）

**保持ポリシー**:
- S3 Glacier: 3年保持（コンプライアンス要件）
- ローカル: 90日保持（即時復旧用）

---

### 3. WALアーカイビング（継続的）

```bash
# postgresql.conf設定
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /var/lib/postgresql/wal_archive/%f && cp %p /var/lib/postgresql/wal_archive/%f'
archive_timeout = 3600  # 1時間ごと

# WALファイルをS3にも同期（オフサイト）
# cron: */10 * * * *（10分ごと）
aws s3 sync /var/lib/postgresql/wal_archive/ \
  s3://consulting-tool-backups/bc-003/wal/ \
  --delete
```

**効果**:
- ポイントインタイムリカバリ（PITR）が可能
- RPO: 1時間（archive_timeout）

---

### 4. 差分バックアップ（1時間ごと）

```bash
#!/bin/bash
# 時間ごと差分バックアップ（最近1時間の変更のみ）

INCR_BACKUP_DIR="/var/backups/postgresql/bc-003/incremental"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 変更されたデータのみバックアップ（updated_at/created_at基準）
pg_dump -Fc -v \
  --table="users" \
  --where="updated_at >= NOW() - INTERVAL '1 hour'" \
  -f "${INCR_BACKUP_DIR}/users_incr_${TIMESTAMP}.dump" \
  consulting_tool

pg_dump -Fc -v \
  --table="sessions" \
  --where="created_at >= NOW() - INTERVAL '1 hour'" \
  -f "${INCR_BACKUP_DIR}/sessions_incr_${TIMESTAMP}.dump" \
  consulting_tool

pg_dump -Fc -v \
  --table="audit_logs" \
  --where="recorded_at >= NOW() - INTERVAL '1 hour'" \
  -f "${INCR_BACKUP_DIR}/audit_logs_incr_${TIMESTAMP}.dump" \
  consulting_tool

# 24時間以上古い差分バックアップを削除
find ${INCR_BACKUP_DIR} -name "*_incr_*.dump" -mtime +1 -delete
```

**実行タイミング**: 毎時0分

---

## 復旧手順 {#recovery}

### シナリオ1: テーブル単位の復旧

```bash
# 特定テーブルを最新バックアップから復旧
# 例: usersテーブルが破損した場合

# 1. 最新のフルバックアップファイルを特定
LATEST_BACKUP=$(ls -t /var/backups/postgresql/bc-003/bc003_full_*.dump.gz | head -1)

# 2. 解凍
gunzip -c ${LATEST_BACKUP} > /tmp/bc003_restore.dump

# 3. テーブル復元（既存データを削除してから復元）
pg_restore -d consulting_tool \
  -t users \
  --clean \
  --if-exists \
  /tmp/bc003_restore.dump

# 4. インデックス再構築
psql -d consulting_tool -c "REINDEX TABLE users;"

# 5. 統計情報更新
psql -d consulting_tool -c "ANALYZE users;"
```

---

### シナリオ2: 監査ログのポイントインタイムリカバリ

```bash
# 特定時刻の監査ログを復旧（例: 2025-11-03 14:30:00）

# 1. PostgreSQLを停止
systemctl stop postgresql

# 2. データディレクトリをバックアップ
mv /var/lib/postgresql/14/main /var/lib/postgresql/14/main.old

# 3. 最新のベースバックアップから復元
tar -xzf /var/backups/postgresql/base/base_backup.tar.gz \
  -C /var/lib/postgresql/14/main

# 4. recovery.confを作成（PostgreSQL 12+ではpostgresql.auto.conf）
cat > /var/lib/postgresql/14/main/recovery.signal
cat >> /var/lib/postgresql/14/main/postgresql.auto.conf <<EOF
restore_command = 'cp /var/lib/postgresql/wal_archive/%f %p'
recovery_target_time = '2025-11-03 14:30:00'
recovery_target_action = 'promote'
EOF

# 5. PostgreSQLを起動（リカバリモード）
systemctl start postgresql

# 6. リカバリ完了確認
psql -c "SELECT pg_is_in_recovery();"
# f（falseの場合、リカバリ完了）

# 7. 監査ログのハッシュチェーン検証
psql -d consulting_tool -f /path/to/verify_audit_log_chain.sql
```

---

### シナリオ3: 全体復旧（災害復旧）

```bash
# データベース全体の復旧

# 1. 新しいデータベースを作成
createdb consulting_tool_restored

# 2. 最新のフルバックアップから復元
LATEST_BACKUP=$(ls -t /var/backups/postgresql/bc-003/bc003_full_*.dump.gz | head -1)
gunzip -c ${LATEST_BACKUP} | pg_restore -d consulting_tool_restored

# 3. WALリカバリ（ポイントインタイムリカバリが必要な場合）
# （上記シナリオ2を参照）

# 4. データ整合性チェック
psql -d consulting_tool_restored <<EOF
-- レコード数確認
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions;

-- 監査ログハッシュチェーン検証
-- （query-patterns.mdのハッシュチェーン検証クエリを実行）
EOF

# 5. アプリケーション接続先を切り替え
# （データベース名変更またはDNS更新）
```

---

## パーティショニング {#partitioning}

### 1. audit_logs テーブル（月次パーティション）

```sql
-- パーティションテーブルとして再作成
CREATE TABLE audit_logs (
  id UUID NOT NULL,
  user_id UUID,
  session_id UUID,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(200),
  resource_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(500),
  success BOOLEAN NOT NULL,
  error_code VARCHAR(50),
  error_message TEXT,
  hash VARCHAR(64) NOT NULL,
  previous_hash VARCHAR(64),
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, recorded_at)
) PARTITION BY RANGE (recorded_at);

-- 月次パーティション作成（例: 2025年各月）
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE audit_logs_2025_02 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE audit_logs_2025_03 PARTITION OF audit_logs
  FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- 以降、月ごとにパーティション作成
-- または pg_partman 拡張機能で自動パーティション管理

-- 古いパーティション削除（3年保持）
-- 例: 2022年1月のパーティション削除（2025年2月実行）
DROP TABLE IF EXISTS audit_logs_2022_01;
```

**効果**:
- 範囲検索のパフォーマンス向上（月単位のクエリで不要なパーティションをスキャンしない）
- 古いデータの削除が高速（パーティション単位でDROP可能）
- 3年保持のコンプライアンス対応が容易

---

### 2. security_events テーブル（月次パーティション）

```sql
CREATE TABLE security_events (
  -- カラム定義は同じ
  PRIMARY KEY (id, detected_at)
) PARTITION BY RANGE (detected_at);

-- 月次パーティション作成
CREATE TABLE security_events_2025_01 PARTITION OF security_events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 古いパーティション削除（1年保持）
DROP TABLE IF EXISTS security_events_2024_01;
```

---

### 3. login_attempts テーブル（月次パーティション）

```sql
CREATE TABLE login_attempts (
  -- カラム定義は同じ
  PRIMARY KEY (id, attempted_at)
) PARTITION BY RANGE (attempted_at);

-- 月次パーティション作成
CREATE TABLE login_attempts_2025_01 PARTITION OF login_attempts
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 古いパーティション削除（6ヶ月保持）
DROP TABLE IF EXISTS login_attempts_2024_07;
```

---

### パーティション自動管理（pg_partman）

```sql
-- pg_partman拡張機能のインストール
CREATE EXTENSION pg_partman;

-- audit_logs の自動パーティション管理設定
SELECT partman.create_parent(
  p_parent_table := 'public.audit_logs',
  p_control := 'recorded_at',
  p_type := 'native',
  p_interval := '1 month',
  p_premake := 3  -- 3ヶ月先までパーティション作成
);

-- 保持ポリシー設定（3年 = 36ヶ月）
UPDATE partman.part_config
SET retention = '36 months',
    retention_keep_table = false
WHERE parent_table = 'public.audit_logs';

-- 定期実行（cron: 毎日午前1:00）
-- SELECT partman.run_maintenance();
```

---

## セキュリティ対策 {#security}

### 1. データベース権限設定

```sql
-- アプリケーション用ユーザー作成
CREATE USER bc003_app WITH PASSWORD 'secure_password_here';

-- 読み取り・書き込み権限
GRANT SELECT, INSERT ON users, roles, permissions, user_roles, role_permissions,
  sessions, password_history, login_attempts, security_events, security_policies
  TO bc003_app;

-- 監査ログはINSERTのみ（UPDATE/DELETE禁止）
GRANT SELECT, INSERT ON audit_logs TO bc003_app;
REVOKE UPDATE, DELETE ON audit_logs FROM bc003_app;

-- シーケンス権限
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bc003_app;
```

---

### 2. データ暗号化

```sql
-- pgcrypto拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- MFAシークレットの暗号化保存
-- アプリケーション層で実装
-- users.mfa_secret = pgp_sym_encrypt(secret, encryption_key)

-- 復号化
-- SELECT pgp_sym_decrypt(mfa_secret::bytea, encryption_key) FROM users WHERE id = ?;
```

**暗号化キー管理**:
- 環境変数または AWS KMS, HashiCorp Vault等で管理
- キーローテーション: 90日ごと

---

### 3. SSL/TLS接続強制

```bash
# postgresql.conf
ssl = on
ssl_cert_file = '/etc/postgresql/14/main/server.crt'
ssl_key_file = '/etc/postgresql/14/main/server.key'
ssl_ca_file = '/etc/postgresql/14/main/root.crt'

# pg_hba.conf（パスワード認証 + SSL必須）
hostssl all bc003_app 0.0.0.0/0 md5
hostnossl all all 0.0.0.0/0 reject  # SSL以外拒否
```

---

### 4. 監査ログの改ざん検知

```sql
-- 定期的なハッシュチェーン検証（日次バッチ）
-- query-patterns.mdのハッシュチェーン検証クエリを使用

-- 改ざん検知時のアラート
CREATE OR REPLACE FUNCTION alert_audit_log_tampering()
RETURNS void AS $$
BEGIN
  -- BC-007にアラート送信
  PERFORM pg_notify('audit_tampering_detected', json_build_object(
    'severity', 'critical',
    'message', 'Audit log hash chain verification failed',
    'timestamp', NOW()
  )::text);
END;
$$ LANGUAGE plpgsql;
```

---

### 5. バックアップの暗号化

```bash
# バックアップファイルをGPGで暗号化
gpg --encrypt --recipient backup@example.com \
  /var/backups/postgresql/bc-003/bc003_full_20251103_030000.dump.gz

# S3にアップロード時はサーバーサイド暗号化（SSE-KMS）
aws s3 cp bc003_full_20251103_030000.dump.gz.gpg \
  s3://consulting-tool-backups/bc-003/full/ \
  --server-side-encryption aws:kms \
  --ssekms-key-id arn:aws:kms:region:account:key/key-id
```

---

## V2からの移行 {#v2-migration}

### V2構造（移行元）

```
services/secure-access-service/
├── database-design.md（基本設計のみ）
└── migrations/
    ├── 001_create_users.sql
    ├── 002_create_roles.sql
    └── 003_create_audit_logs.sql
```

### V3構造（移行先）

```
BC-003/data/
├── README.md（包括的なデータ設計）
├── tables.md（11テーブル詳細定義）
├── indexes-constraints.md（79インデックス、8トリガー関数）
├── query-patterns.md（14クエリパターン）
├── backup-security.md（本ファイル）
└── migrations/（マイグレーションスクリプト）
    ├── 001_create_users_and_auth.sql
    ├── 002_create_roles_and_permissions.sql
    ├── 003_create_user_roles_and_role_permissions.sql
    ├── 004_create_sessions.sql
    ├── 005_create_password_history.sql
    ├── 006_create_audit_logs.sql
    ├── 007_create_security_events.sql
    ├── 008_create_security_policies.sql
    ├── 009_create_login_attempts.sql
    ├── 010_create_indexes.sql
    └── 011_create_triggers.sql
```

---

### 移行ステータス

| 項目 | V2 | V3 | ステータス |
|-----|----|----|---------|
| テーブル定義 | 基本8テーブル | 拡張11テーブル | ✅ 拡張完了 |
| インデックス | 基本インデックスのみ | 79最適化インデックス | ✅ 最適化完了 |
| 制約 | 基本FK制約のみ | CHECK制約、トリガー追加 | ✅ 強化完了 |
| パーティショニング | なし | 月次パーティション（3テーブル） | ✅ 実装完了 |
| バックアップ戦略 | 日次フルバックアップ | WAL+差分+監査ログ長期保存 | ✅ 強化完了 |
| 監査ログ | 基本ログ | ハッシュチェーン、3年保持 | ✅ 実装完了 |
| セキュリティ | パスワードハッシュのみ | MFA、暗号化、SSL強制 | ✅ 実装完了 |
| トリガー関数 | 2つ | 8つ（自動ロック、ハッシュチェーン等） | ✅ 拡張完了 |
| クエリパターン | 未定義 | 14パターン定義 | ✅ 定義完了 |
| ドキュメント | 基本のみ | 包括的（5ファイル分割） | ✅ 詳細化完了 |

---

### 移行時の注意点

1. **データ移行**:
   - V2の既存ユーザーデータをV3テーブル構造に移行
   - パスワードハッシュはそのまま移行（bcrypt互換）
   - デフォルトロール（viewer）を全ユーザーに付与

2. **監査ログ移行**:
   - V2の監査ログをV3に移行
   - ハッシュチェーン生成（移行時に全ログのhash, previous_hash計算）

3. **パーティショニング移行**:
   - 既存データをパーティションテーブルに移行
   ```sql
   -- 既存audit_logsをaudit_logs_oldにリネーム
   ALTER TABLE audit_logs RENAME TO audit_logs_old;

   -- パーティションテーブル作成
   CREATE TABLE audit_logs (...) PARTITION BY RANGE (recorded_at);

   -- パーティション作成
   CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs ...;

   -- データ移行
   INSERT INTO audit_logs SELECT * FROM audit_logs_old;

   -- 確認後、旧テーブル削除
   DROP TABLE audit_logs_old;
   ```

4. **インデックス再構築**:
   - 移行後は`REINDEX`でインデックスを最適化
   - 統計情報更新（`ANALYZE`）を実行

5. **トリガー有効化**:
   - 移行中はトリガーを無効化（`ALTER TABLE ... DISABLE TRIGGER ALL`）
   - 移行完了後に有効化（`ALTER TABLE ... ENABLE TRIGGER ALL`）

6. **バックアップ**:
   - V2からV3移行前に必ずフルバックアップ
   - ロールバック可能な状態を維持

---

## 関連ドキュメント

- [README.md](README.md) - データ設計概要
- [tables.md](tables.md) - テーブル詳細定義
- [indexes-constraints.md](indexes-constraints.md) - インデックス・制約・トリガー
- [query-patterns.md](query-patterns.md) - クエリパターン

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.2 - BC-003 データ設計詳細化完了
