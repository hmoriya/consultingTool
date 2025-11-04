# BC-004: バックアップと運用

**ドキュメント**: データ層 - バックアップと運用
**最終更新**: 2025-11-03

このドキュメントでは、BC-004のバックアップ戦略、リストア手順、運用手順を記載します。

---

## 目次

1. [バックアップ戦略](#backup-strategy)
2. [リストア手順](#restore-procedures)
3. [パーティション管理](#partition-management)
4. [マテリアライズドビュー管理](#materialized-view-management)
5. [データ保持ポリシー](#data-retention)
6. [災害復旧](#disaster-recovery)

---

## バックアップ戦略 {#backup-strategy}

### 1. 日次フルバックアップ

**対象**: 全テーブル
**頻度**: 毎日深夜2:00（JST）
**保持期間**: 30日

```bash
#!/bin/bash
# BC-004 日次フルバックアップ
# /opt/backup/bc-004/daily-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-004/daily"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"

echo "Starting BC-004 daily backup at ${TIMESTAMP}"

# ディレクトリ作成
mkdir -p "${BACKUP_DIR}"

# フルバックアップ（カスタムフォーマット）
pg_dump -Fc -v \
  --schema=public \
  -t organizations \
  -t organization_units \
  -t organization_hierarchies \
  -t organization_members \
  -t teams \
  -t team_members \
  -t team_leaders \
  -t governance_policies \
  -t governance_rules \
  -t policy_scopes \
  -t policy_violations \
  -f "${BACKUP_DIR}/bc-004_full_${TIMESTAMP}.dump" \
  ${DB_NAME}

# 圧縮
gzip "${BACKUP_DIR}/bc-004_full_${TIMESTAMP}.dump"

# S3にアップロード
aws s3 cp "${BACKUP_DIR}/bc-004_full_${TIMESTAMP}.dump.gz" \
  s3://consulting-tool-backups/bc-004/daily/ \
  --storage-class STANDARD_IA

# 古いバックアップ削除（30日以上）
find "${BACKUP_DIR}" -name "bc-004_full_*.dump.gz" -mtime +30 -delete

echo "BC-004 daily backup completed successfully"
```

**cron設定**:
```cron
0 2 * * * /opt/backup/bc-004/daily-backup.sh >> /var/log/backup/bc-004-daily.log 2>&1
```

---

### 2. 時間別差分バックアップ

**対象**: 更新頻度の高いテーブル
**頻度**: 4時間毎
**保持期間**: 7日

```bash
#!/bin/bash
# BC-004 時間別差分バックアップ
# /opt/backup/bc-004/hourly-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-004/hourly"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"

# 前回バックアップ時刻を取得
LAST_BACKUP_TIME=$(cat /var/lib/backup/bc-004-last-backup-time.txt)

echo "Starting BC-004 hourly backup from ${LAST_BACKUP_TIME}"

mkdir -p "${BACKUP_DIR}"

# 更新されたデータのみバックアップ
for table in organization_members team_members team_leaders policy_violations; do
  pg_dump -Fc -v \
    --table=${table} \
    --where="updated_at > '${LAST_BACKUP_TIME}' OR created_at > '${LAST_BACKUP_TIME}'" \
    -f "${BACKUP_DIR}/bc-004_${table}_${TIMESTAMP}.dump" \
    ${DB_NAME}

  gzip "${BACKUP_DIR}/bc-004_${table}_${TIMESTAMP}.dump"
done

# 最終バックアップ時刻更新
echo "${TIMESTAMP}" > /var/lib/backup/bc-004-last-backup-time.txt

# 古いバックアップ削除（7日以上）
find "${BACKUP_DIR}" -name "bc-004_*_*.dump.gz" -mtime +7 -delete

echo "BC-004 hourly backup completed successfully"
```

**cron設定**:
```cron
0 */4 * * * /opt/backup/bc-004/hourly-backup.sh >> /var/log/backup/bc-004-hourly.log 2>&1
```

---

### 3. ポリシー違反記録の長期保存

**対象**: policy_violations
**頻度**: 毎月1日
**保持期間**: 3年

```bash
#!/bin/bash
# BC-004 ポリシー違反記録長期バックアップ
# /opt/backup/bc-004/monthly-violations-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-004/monthly"
YEAR=$(date +%Y)
MONTH=$(date +%m)
DB_NAME="consulting_tool"

echo "Starting BC-004 monthly violations backup for ${YEAR}-${MONTH}"

mkdir -p "${BACKUP_DIR}/${YEAR}"

# ポリシー違反記録バックアップ
pg_dump -Fc -v \
  -t policy_violations \
  -f "${BACKUP_DIR}/${YEAR}/policy_violations_${YEAR}_${MONTH}.dump" \
  ${DB_NAME}

gzip "${BACKUP_DIR}/${YEAR}/policy_violations_${YEAR}_${MONTH}.dump"

# S3 Glacierにアップロード（低コスト長期保存）
aws s3 cp "${BACKUP_DIR}/${YEAR}/policy_violations_${YEAR}_${MONTH}.dump.gz" \
  s3://consulting-tool-backups/bc-004/violations/${YEAR}/ \
  --storage-class GLACIER

# 3年以上前のローカルバックアップ削除
find "${BACKUP_DIR}" -name "policy_violations_*.dump.gz" -mtime +1095 -delete

echo "BC-004 monthly violations backup completed successfully"
```

**cron設定**:
```cron
0 3 1 * * /opt/backup/bc-004/monthly-violations-backup.sh >> /var/log/backup/bc-004-monthly.log 2>&1
```

---

## リストア手順 {#restore-procedures}

### 1. フルリストア

全テーブルを復元する手順。

```bash
#!/bin/bash
# BC-004 フルリストア
# /opt/restore/bc-004/full-restore.sh

set -euo pipefail

BACKUP_FILE=$1
DB_NAME="consulting_tool"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <backup_file.dump.gz>"
  exit 1
fi

echo "Starting BC-004 full restore from ${BACKUP_FILE}"

# バックアップファイル解凍
gunzip -c "${BACKUP_FILE}" > /tmp/bc-004-restore.dump

# トリガー無効化（高速化）
psql -d ${DB_NAME} -c "ALTER TABLE organizations DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_units DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_hierarchies DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_members DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE teams DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE team_members DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE team_leaders DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE governance_policies DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE governance_rules DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE policy_scopes DISABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE policy_violations DISABLE TRIGGER ALL;"

# リストア実行
pg_restore -d ${DB_NAME} \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  /tmp/bc-004-restore.dump

# トリガー再有効化
psql -d ${DB_NAME} -c "ALTER TABLE organizations ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_units ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_hierarchies ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE organization_members ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE teams ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE team_members ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE team_leaders ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE governance_policies ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE governance_rules ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE policy_scopes ENABLE TRIGGER ALL;"
psql -d ${DB_NAME} -c "ALTER TABLE policy_violations ENABLE TRIGGER ALL;"

# 整合性チェック
psql -d ${DB_NAME} -c "ANALYZE organizations;"
psql -d ${DB_NAME} -c "ANALYZE organization_units;"
psql -d ${DB_NAME} -c "ANALYZE organization_hierarchies;"
psql -d ${DB_NAME} -c "ANALYZE organization_members;"
psql -d ${DB_NAME} -c "ANALYZE teams;"
psql -d ${DB_NAME} -c "ANALYZE team_members;"
psql -d ${DB_NAME} -c "ANALYZE team_leaders;"
psql -d ${DB_NAME} -c "ANALYZE governance_policies;"
psql -d ${DB_NAME} -c "ANALYZE governance_rules;"
psql -d ${DB_NAME} -c "ANALYZE policy_scopes;"
psql -d ${DB_NAME} -c "ANALYZE policy_violations;"

# 一時ファイル削除
rm /tmp/bc-004-restore.dump

echo "BC-004 full restore completed successfully"
```

---

### 2. テーブル単位リストア

特定テーブルのみを復元する手順。

```bash
#!/bin/bash
# BC-004 テーブル単位リストア
# /opt/restore/bc-004/table-restore.sh

set -euo pipefail

BACKUP_FILE=$1
TABLE_NAME=$2
DB_NAME="consulting_tool"

if [ -z "${BACKUP_FILE}" ] || [ -z "${TABLE_NAME}" ]; then
  echo "Usage: $0 <backup_file.dump.gz> <table_name>"
  exit 1
fi

echo "Starting BC-004 table restore: ${TABLE_NAME} from ${BACKUP_FILE}"

# バックアップファイル解凍
gunzip -c "${BACKUP_FILE}" > /tmp/bc-004-restore.dump

# トリガー無効化
psql -d ${DB_NAME} -c "ALTER TABLE ${TABLE_NAME} DISABLE TRIGGER ALL;"

# リストア実行（特定テーブルのみ）
pg_restore -d ${DB_NAME} \
  --table=${TABLE_NAME} \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  /tmp/bc-004-restore.dump

# トリガー再有効化
psql -d ${DB_NAME} -c "ALTER TABLE ${TABLE_NAME} ENABLE TRIGGER ALL;"

# 統計情報更新
psql -d ${DB_NAME} -c "ANALYZE ${TABLE_NAME};"

# 一時ファイル削除
rm /tmp/bc-004-restore.dump

echo "BC-004 table restore completed successfully"
```

---

## パーティション管理 {#partition-management}

### policy_violations テーブルのパーティショニング

**戦略**: detected_at カラムで年次パーティション

#### パーティション作成（手動）

```sql
-- 2025年パーティション作成
CREATE TABLE policy_violations_2025 PARTITION OF policy_violations
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- インデックス作成
CREATE INDEX idx_policy_violations_2025_detected_at
  ON policy_violations_2025(detected_at DESC);

CREATE INDEX idx_policy_violations_2025_policy_status
  ON policy_violations_2025(policy_id, status);
```

#### 自動パーティション作成スクリプト

```bash
#!/bin/bash
# BC-004 パーティション自動作成
# /opt/maintenance/bc-004/create-partitions.sh

set -euo pipefail

DB_NAME="consulting_tool"
NEXT_YEAR=$(date -d "next year" +%Y)
YEAR_AFTER_NEXT=$(date -d "2 years" +%Y)

echo "Creating partitions for ${NEXT_YEAR}"

# パーティション作成SQL生成
psql -d ${DB_NAME} <<EOF
-- ${NEXT_YEAR}年パーティション
CREATE TABLE IF NOT EXISTS policy_violations_${NEXT_YEAR}
PARTITION OF policy_violations
FOR VALUES FROM ('${NEXT_YEAR}-01-01') TO ('${YEAR_AFTER_NEXT}-01-01');

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_policy_violations_${NEXT_YEAR}_detected_at
  ON policy_violations_${NEXT_YEAR}(detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_policy_violations_${NEXT_YEAR}_policy_status
  ON policy_violations_${NEXT_YEAR}(policy_id, status);

CREATE INDEX IF NOT EXISTS idx_policy_violations_${NEXT_YEAR}_target
  ON policy_violations_${NEXT_YEAR}(target_type, target_id);

CREATE INDEX IF NOT EXISTS idx_policy_violations_${NEXT_YEAR}_context
  ON policy_violations_${NEXT_YEAR} USING GIN(context);
EOF

echo "Partition creation completed successfully"
```

**cron設定** （毎年12月1日実行）:
```cron
0 4 1 12 * /opt/maintenance/bc-004/create-partitions.sh >> /var/log/maintenance/bc-004-partitions.log 2>&1
```

---

### 古いパーティションのアーカイブ

3年以上前のパーティションをデタッチしてアーカイブ。

```bash
#!/bin/bash
# BC-004 古いパーティションアーカイブ
# /opt/maintenance/bc-004/archive-old-partitions.sh

set -euo pipefail

DB_NAME="consulting_tool"
ARCHIVE_YEAR=$(date -d "3 years ago" +%Y)

echo "Archiving partition for ${ARCHIVE_YEAR}"

# パーティションをデタッチ
psql -d ${DB_NAME} <<EOF
ALTER TABLE policy_violations
DETACH PARTITION policy_violations_${ARCHIVE_YEAR};
EOF

# デタッチしたテーブルをバックアップ
pg_dump -Fc -v \
  -t policy_violations_${ARCHIVE_YEAR} \
  -f "/backup/bc-004/archive/policy_violations_${ARCHIVE_YEAR}.dump" \
  ${DB_NAME}

gzip "/backup/bc-004/archive/policy_violations_${ARCHIVE_YEAR}.dump"

# S3 Glacierにアップロード
aws s3 cp "/backup/bc-004/archive/policy_violations_${ARCHIVE_YEAR}.dump.gz" \
  s3://consulting-tool-backups/bc-004/archive/ \
  --storage-class GLACIER

# デタッチしたテーブルを削除
psql -d ${DB_NAME} -c "DROP TABLE policy_violations_${ARCHIVE_YEAR};"

echo "Partition archive completed successfully"
```

**cron設定** （毎年1月15日実行）:
```cron
0 5 15 1 * /opt/maintenance/bc-004/archive-old-partitions.sh >> /var/log/maintenance/bc-004-archive.log 2>&1
```

---

## マテリアライズドビュー管理 {#materialized-view-management}

### 1. mv_user_allocation_summary リフレッシュ

**頻度**: 1時間毎

```bash
#!/bin/bash
# BC-004 ユーザーアロケーションビューリフレッシュ
# /opt/maintenance/bc-004/refresh-user-allocation-mv.sh

set -euo pipefail

DB_NAME="consulting_tool"

echo "Refreshing mv_user_allocation_summary"

psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_allocation_summary;"

echo "Refresh completed successfully"
```

**cron設定**:
```cron
0 * * * * /opt/maintenance/bc-004/refresh-user-allocation-mv.sh >> /var/log/maintenance/bc-004-mv-user-allocation.log 2>&1
```

---

### 2. mv_team_statistics リフレッシュ

**頻度**: 1時間毎

```bash
#!/bin/bash
# BC-004 チーム統計ビューリフレッシュ
# /opt/maintenance/bc-004/refresh-team-statistics-mv.sh

set -euo pipefail

DB_NAME="consulting_tool"

echo "Refreshing mv_team_statistics"

psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_team_statistics;"

echo "Refresh completed successfully"
```

**cron設定**:
```cron
15 * * * * /opt/maintenance/bc-004/refresh-team-statistics-mv.sh >> /var/log/maintenance/bc-004-mv-team-statistics.log 2>&1
```

---

### 3. mv_unit_statistics リフレッシュ

**頻度**: 1日1回

```bash
#!/bin/bash
# BC-004 組織単位統計ビューリフレッシュ
# /opt/maintenance/bc-004/refresh-unit-statistics-mv.sh

set -euo pipefail

DB_NAME="consulting_tool"

echo "Refreshing mv_unit_statistics"

psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_unit_statistics;"

echo "Refresh completed successfully"
```

**cron設定**:
```cron
0 1 * * * /opt/maintenance/bc-004/refresh-unit-statistics-mv.sh >> /var/log/maintenance/bc-004-mv-unit-statistics.log 2>&1
```

---

## データ保持ポリシー {#data-retention}

### テーブル別保持期間

| テーブル | 保持期間 | 論理削除 | アーカイブ |
|---------|---------|---------|-----------|
| organizations | 無期限 | あり | なし |
| organization_units | 無期限 | あり | なし |
| organization_hierarchies | 無期限 | なし | なし |
| organization_members | 3年 | なし | あり |
| teams | 3年 | あり | あり |
| team_members | 3年 | なし | あり |
| team_leaders | 3年 | なし | あり |
| governance_policies | 無期限 | あり | なし |
| governance_rules | 無期限 | なし | なし |
| policy_scopes | 無期限 | なし | なし |
| policy_violations | 3年 | なし | あり |

---

### 古いデータの削除スクリプト

```bash
#!/bin/bash
# BC-004 古いデータ削除
# /opt/maintenance/bc-004/cleanup-old-data.sh

set -euo pipefail

DB_NAME="consulting_tool"
RETENTION_DATE=$(date -d "3 years ago" +%Y-%m-%d)

echo "Deleting data older than ${RETENTION_DATE}"

# organization_members（退職済み）
psql -d ${DB_NAME} <<EOF
DELETE FROM organization_members
WHERE status = 'inactive'
  AND left_at < '${RETENTION_DATE}';
EOF

# team_members（離脱済み）
psql -d ${DB_NAME} <<EOF
DELETE FROM team_members
WHERE status = 'inactive'
  AND left_at < '${RETENTION_DATE}';
EOF

# team_leaders（解任済み）
psql -d ${DB_NAME} <<EOF
DELETE FROM team_leaders
WHERE status = 'inactive'
  AND removed_at < '${RETENTION_DATE}';
EOF

# policy_violations（解決済み、3年以上前）
# パーティション削除で処理されるため個別削除は不要

# VACUUM実行
psql -d ${DB_NAME} -c "VACUUM ANALYZE organization_members;"
psql -d ${DB_NAME} -c "VACUUM ANALYZE team_members;"
psql -d ${DB_NAME} -c "VACUUM ANALYZE team_leaders;"

echo "Cleanup completed successfully"
```

**cron設定** （毎月1日深夜実行）:
```cron
0 3 1 * * /opt/maintenance/bc-004/cleanup-old-data.sh >> /var/log/maintenance/bc-004-cleanup.log 2>&1
```

---

## 災害復旧 {#disaster-recovery}

### RTO/RPO目標

| 項目 | 目標 |
|-----|------|
| RTO (Recovery Time Objective) | 4時間 |
| RPO (Recovery Point Objective) | 4時間 |

---

### 災害復旧手順

#### 1. 緊急時連絡先

- **DBA責任者**: [連絡先]
- **アプリケーション責任者**: [連絡先]
- **インフラ責任者**: [連絡先]

#### 2. 復旧手順

```bash
#!/bin/bash
# BC-004 災害復旧
# /opt/dr/bc-004/disaster-recovery.sh

set -euo pipefail

DB_NAME="consulting_tool"
DR_BACKUP_PATH=$1

if [ -z "${DR_BACKUP_PATH}" ]; then
  echo "Usage: $0 <dr_backup_path>"
  echo "Example: $0 s3://consulting-tool-backups/bc-004/daily/bc-004_full_20251103_020000.dump.gz"
  exit 1
fi

echo "=== BC-004 Disaster Recovery Started ==="
echo "Backup Path: ${DR_BACKUP_PATH}"

# S3からバックアップダウンロード
echo "Downloading backup from S3..."
aws s3 cp "${DR_BACKUP_PATH}" /tmp/bc-004-dr-backup.dump.gz

# フルリストア実行
echo "Executing full restore..."
/opt/restore/bc-004/full-restore.sh /tmp/bc-004-dr-backup.dump.gz

# マテリアライズドビューリフレッシュ
echo "Refreshing materialized views..."
psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW mv_user_allocation_summary;"
psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW mv_team_statistics;"
psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW mv_unit_statistics;"

# 整合性チェック
echo "Performing integrity checks..."
psql -d ${DB_NAME} -f /opt/dr/bc-004/integrity-check.sql

# 一時ファイル削除
rm /tmp/bc-004-dr-backup.dump.gz

echo "=== BC-004 Disaster Recovery Completed ==="
```

#### 3. 整合性チェックSQL

```sql
-- /opt/dr/bc-004/integrity-check.sql

-- 孤立レコードチェック
SELECT 'organization_units orphans' AS check_name, COUNT(*) AS count
FROM organization_units
WHERE parent_unit_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM organization_units p
    WHERE p.id = organization_units.parent_unit_id
  );

SELECT 'organization_hierarchies orphans' AS check_name, COUNT(*) AS count
FROM organization_hierarchies
WHERE NOT EXISTS (
  SELECT 1 FROM organization_units
  WHERE id = organization_hierarchies.ancestor_unit_id
)
OR NOT EXISTS (
  SELECT 1 FROM organization_units
  WHERE id = organization_hierarchies.descendant_unit_id
);

-- メンバー数整合性チェック
SELECT 'organization_units member_count mismatch' AS check_name, COUNT(*) AS count
FROM organization_units u
WHERE u.member_count != (
  SELECT COUNT(*) FROM organization_members
  WHERE unit_id = u.id AND status = 'active'
);

SELECT 'teams member_count mismatch' AS check_name, COUNT(*) AS count
FROM teams t
WHERE t.member_count != (
  SELECT COUNT(*) FROM team_members
  WHERE team_id = t.id AND status = 'active'
);

-- アロケーション制約チェック
SELECT 'over-allocated users' AS check_name, COUNT(*) AS count
FROM (
  SELECT user_id, SUM(allocation_rate) AS total
  FROM team_members
  WHERE status = 'active'
  GROUP BY user_id
  HAVING SUM(allocation_rate) > 2.0
) violations;

-- リーダー制約チェック
SELECT 'teams without leaders' AS check_name, COUNT(*) AS count
FROM teams t
WHERE t.status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM team_leaders
    WHERE team_id = t.id AND status = 'active'
  );
```

---

## 関連ドキュメント

- [README.md](README.md) - データ層概要
- [tables.md](tables.md) - テーブル定義詳細
- [indexes-constraints.md](indexes-constraints.md) - インデックスと制約
- [query-patterns.md](query-patterns.md) - クエリパターン集

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.3 - BC-004 データ層詳細化
