# BC-005: バックアップと運用

**ドキュメント**: データ層 - バックアップと運用
**最終更新**: 2025-11-03

このドキュメントでは、BC-005のバックアップ戦略、リストア手順、運用手順を記載します。

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

**対象**: 全16テーブル
**頻度**: 毎日深夜3:00（JST）
**保持期間**: 30日

```bash
#!/bin/bash
# BC-005 日次フルバックアップ
# /opt/backup/bc-005/daily-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-005/daily"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"

echo "Starting BC-005 daily backup at ${TIMESTAMP}"

# ディレクトリ作成
mkdir -p "${BACKUP_DIR}"

# フルバックアップ（カスタムフォーマット）
pg_dump -Fc -v \
  --schema=public \
  -t resources \
  -t resource_allocations \
  -t resource_utilization_history \
  -t talents \
  -t performance_records \
  -t career_plans \
  -t talent_skills \
  -t skills \
  -t skill_categories \
  -t skill_prerequisites \
  -t teams \
  -t team_members \
  -t team_performance_history \
  -t timesheets \
  -t timesheet_entries \
  -t timesheet_approvals \
  -f "${BACKUP_DIR}/bc-005_full_${TIMESTAMP}.dump" \
  ${DB_NAME}

# 圧縮
gzip "${BACKUP_DIR}/bc-005_full_${TIMESTAMP}.dump"

# S3にアップロード
aws s3 cp "${BACKUP_DIR}/bc-005_full_${TIMESTAMP}.dump.gz" \
  s3://consulting-tool-backups/bc-005/daily/ \
  --storage-class STANDARD_IA

# 古いバックアップ削除（30日以上）
find "${BACKUP_DIR}" -name "bc-005_full_*.dump.gz" -mtime +30 -delete

echo "BC-005 daily backup completed successfully"
```

**cron設定**:
```cron
0 3 * * * /opt/backup/bc-005/daily-backup.sh >> /var/log/backup/bc-005-daily.log 2>&1
```

---

### 2. 時間別差分バックアップ

**対象**: 更新頻度の高いテーブル
**頻度**: 4時間毎
**保持期間**: 7日

```bash
#!/bin/bash
# BC-005 時間別差分バックアップ
# /opt/backup/bc-005/hourly-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-005/hourly"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="consulting_tool"

# 前回バックアップ時刻を取得
LAST_BACKUP_TIME=$(cat /var/lib/backup/bc-005-last-backup-time.txt 2>/dev/null || echo "1970-01-01 00:00:00")

echo "Starting BC-005 hourly backup from ${LAST_BACKUP_TIME}"

mkdir -p "${BACKUP_DIR}"

# 更新されたデータのみバックアップ
for table in resource_allocations talents performance_records career_plans talent_skills team_members timesheet_entries timesheet_approvals; do
  echo "Backing up ${table}..."

  pg_dump -Fc -v \
    --table=${table} \
    --where="updated_at > '${LAST_BACKUP_TIME}' OR created_at > '${LAST_BACKUP_TIME}'" \
    -f "${BACKUP_DIR}/bc-005_${table}_${TIMESTAMP}.dump" \
    ${DB_NAME} 2>/dev/null || echo "No changes in ${table}"

  if [ -f "${BACKUP_DIR}/bc-005_${table}_${TIMESTAMP}.dump" ]; then
    gzip "${BACKUP_DIR}/bc-005_${table}_${TIMESTAMP}.dump"
  fi
done

# 最終バックアップ時刻更新
date '+%Y-%m-%d %H:%M:%S' > /var/lib/backup/bc-005-last-backup-time.txt

# 古いバックアップ削除（7日以上）
find "${BACKUP_DIR}" -name "bc-005_*_*.dump.gz" -mtime +7 -delete

echo "BC-005 hourly backup completed successfully"
```

**cron設定**:
```cron
0 */4 * * * /opt/backup/bc-005/hourly-backup.sh >> /var/log/backup/bc-005-hourly.log 2>&1
```

---

### 3. タイムシートデータの長期保存

**対象**: timesheets, timesheet_entries, timesheet_approvals
**頻度**: 毎月1日
**保持期間**: 7年（法定保存期間）

```bash
#!/bin/bash
# BC-005 タイムシートデータ長期バックアップ
# /opt/backup/bc-005/monthly-timesheet-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-005/monthly"
YEAR=$(date +%Y)
MONTH=$(date +%m)
DB_NAME="consulting_tool"

echo "Starting BC-005 monthly timesheet backup for ${YEAR}-${MONTH}"

mkdir -p "${BACKUP_DIR}/${YEAR}"

# タイムシート関連テーブルバックアップ
for table in timesheets timesheet_entries timesheet_approvals; do
  pg_dump -Fc -v \
    -t ${table} \
    -f "${BACKUP_DIR}/${YEAR}/${table}_${YEAR}_${MONTH}.dump" \
    ${DB_NAME}

  gzip "${BACKUP_DIR}/${YEAR}/${table}_${YEAR}_${MONTH}.dump"
done

# resource_utilization_history もバックアップ
pg_dump -Fc -v \
  -t resource_utilization_history \
  -f "${BACKUP_DIR}/${YEAR}/resource_utilization_history_${YEAR}_${MONTH}.dump" \
  ${DB_NAME}

gzip "${BACKUP_DIR}/${YEAR}/resource_utilization_history_${YEAR}_${MONTH}.dump"

# S3 Glacierにアップロード（低コスト長期保存）
for file in ${BACKUP_DIR}/${YEAR}/*_${YEAR}_${MONTH}.dump.gz; do
  aws s3 cp "${file}" \
    s3://consulting-tool-backups/bc-005/timesheets/${YEAR}/ \
    --storage-class GLACIER
done

# 7年以上前のローカルバックアップ削除
find "${BACKUP_DIR}" -name "*_*.dump.gz" -mtime +2555 -delete  # 7年 = 2555日

echo "BC-005 monthly timesheet backup completed successfully"
```

**cron設定**:
```cron
0 4 1 * * /opt/backup/bc-005/monthly-timesheet-backup.sh >> /var/log/backup/bc-005-monthly.log 2>&1
```

---

### 4. パフォーマンス評価データの長期保存

**対象**: performance_records
**頻度**: 毎月1日
**保持期間**: 10年（人事記録）

```bash
#!/bin/bash
# BC-005 パフォーマンス評価長期バックアップ
# /opt/backup/bc-005/monthly-performance-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/bc-005/monthly"
YEAR=$(date +%Y)
MONTH=$(date +%m)
DB_NAME="consulting_tool"

echo "Starting BC-005 monthly performance backup for ${YEAR}-${MONTH}"

mkdir -p "${BACKUP_DIR}/${YEAR}"

# パフォーマンス評価バックアップ
pg_dump -Fc -v \
  -t performance_records \
  -f "${BACKUP_DIR}/${YEAR}/performance_records_${YEAR}_${MONTH}.dump" \
  ${DB_NAME}

gzip "${BACKUP_DIR}/${YEAR}/performance_records_${YEAR}_${MONTH}.dump"

# S3 Glacierにアップロード
aws s3 cp "${BACKUP_DIR}/${YEAR}/performance_records_${YEAR}_${MONTH}.dump.gz" \
  s3://consulting-tool-backups/bc-005/performance/${YEAR}/ \
  --storage-class GLACIER

# 10年以上前のローカルバックアップ削除
find "${BACKUP_DIR}" -name "performance_records_*.dump.gz" -mtime +3650 -delete

echo "BC-005 monthly performance backup completed successfully"
```

**cron設定**:
```cron
0 5 1 * * /opt/backup/bc-005/monthly-performance-backup.sh >> /var/log/backup/bc-005-monthly.log 2>&1
```

---

## リストア手順 {#restore-procedures}

### 1. フルリストア

全テーブルを復元する手順。

```bash
#!/bin/bash
# BC-005 フルリストア
# /opt/restore/bc-005/full-restore.sh

set -euo pipefail

BACKUP_FILE=$1
DB_NAME="consulting_tool"

if [ -z "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <backup_file.dump.gz>"
  exit 1
fi

echo "Starting BC-005 full restore from ${BACKUP_FILE}"

# バックアップファイル解凍
gunzip -c "${BACKUP_FILE}" > /tmp/bc-005-restore.dump

# トリガー無効化（高速化）
for table in resources resource_allocations resource_utilization_history \
             talents performance_records career_plans talent_skills \
             skills skill_categories skill_prerequisites \
             teams team_members team_performance_history \
             timesheets timesheet_entries timesheet_approvals; do
  psql -d ${DB_NAME} -c "ALTER TABLE ${table} DISABLE TRIGGER ALL;"
done

# リストア実行
pg_restore -d ${DB_NAME} \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  /tmp/bc-005-restore.dump

# トリガー再有効化
for table in resources resource_allocations resource_utilization_history \
             talents performance_records career_plans talent_skills \
             skills skill_categories skill_prerequisites \
             teams team_members team_performance_history \
             timesheets timesheet_entries timesheet_approvals; do
  psql -d ${DB_NAME} -c "ALTER TABLE ${table} ENABLE TRIGGER ALL;"
done

# 統計情報更新
for table in resources resource_allocations resource_utilization_history \
             talents performance_records career_plans talent_skills \
             skills skill_categories skill_prerequisites \
             teams team_members team_performance_history \
             timesheets timesheet_entries timesheet_approvals; do
  echo "Analyzing ${table}..."
  psql -d ${DB_NAME} -c "ANALYZE ${table};"
done

# マテリアライズドビュー再構築
echo "Refreshing materialized views..."
psql -d ${DB_NAME} <<EOF
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_resource_utilization_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_talent_performance_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_team_statistics;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_skill_distribution;
EOF

# 一時ファイル削除
rm /tmp/bc-005-restore.dump

echo "BC-005 full restore completed successfully"
echo "Please verify data integrity and application functionality"
```

---

### 2. テーブル単位リストア

特定テーブルのみを復元する手順。

```bash
#!/bin/bash
# BC-005 テーブル単位リストア
# /opt/restore/bc-005/table-restore.sh

set -euo pipefail

BACKUP_FILE=$1
TABLE_NAME=$2
DB_NAME="consulting_tool"

if [ -z "${BACKUP_FILE}" ] || [ -z "${TABLE_NAME}" ]; then
  echo "Usage: $0 <backup_file.dump.gz> <table_name>"
  exit 1
fi

echo "Starting BC-005 table restore: ${TABLE_NAME} from ${BACKUP_FILE}"

# バックアップファイル解凍
gunzip -c "${BACKUP_FILE}" > /tmp/bc-005-restore.dump

# トリガー無効化
psql -d ${DB_NAME} -c "ALTER TABLE ${TABLE_NAME} DISABLE TRIGGER ALL;"

# リストア実行（特定テーブルのみ）
pg_restore -d ${DB_NAME} \
  --table=${TABLE_NAME} \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  /tmp/bc-005-restore.dump

# トリガー再有効化
psql -d ${DB_NAME} -c "ALTER TABLE ${TABLE_NAME} ENABLE TRIGGER ALL;"

# 統計情報更新
psql -d ${DB_NAME} -c "ANALYZE ${TABLE_NAME};"

# 関連マテリアライズドビュー更新
case "${TABLE_NAME}" in
  "resources"|"resource_allocations"|"resource_utilization_history")
    echo "Refreshing mv_resource_utilization_summary..."
    psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_resource_utilization_summary;"
    ;;
  "talents"|"performance_records"|"talent_skills")
    echo "Refreshing mv_talent_performance_summary..."
    psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_talent_performance_summary;"
    ;;
  "teams"|"team_members"|"team_performance_history")
    echo "Refreshing mv_team_statistics..."
    psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_team_statistics;"
    ;;
  "skills"|"talent_skills")
    echo "Refreshing mv_skill_distribution..."
    psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY mv_skill_distribution;"
    ;;
esac

# 一時ファイル削除
rm /tmp/bc-005-restore.dump

echo "BC-005 table restore completed successfully"
```

---

### 3. ポイントインタイムリカバリ（PITR）

特定時点までデータを復元する手順。

```bash
#!/bin/bash
# BC-005 ポイントインタイムリカバリ
# /opt/restore/bc-005/pitr-restore.sh

set -euo pipefail

TARGET_TIME=$1  # 例: "2025-11-03 14:30:00"
BASE_BACKUP=$2
WAL_ARCHIVE_DIR="/backup/wal-archive"
RESTORE_DIR="/var/lib/postgresql/restore"
DB_NAME="consulting_tool"

if [ -z "${TARGET_TIME}" ] || [ -z "${BASE_BACKUP}" ]; then
  echo "Usage: $0 <target_time> <base_backup>"
  echo "Example: $0 '2025-11-03 14:30:00' /backup/base_backup.tar.gz"
  exit 1
fi

echo "Starting PITR to ${TARGET_TIME}"

# PostgreSQLサービス停止
systemctl stop postgresql

# ベースバックアップ展開
mkdir -p "${RESTORE_DIR}"
tar -xzf "${BASE_BACKUP}" -C "${RESTORE_DIR}"

# recovery.conf 作成（PostgreSQL 12+では postgresql.auto.conf）
cat > "${RESTORE_DIR}/postgresql.auto.conf" <<EOF
restore_command = 'cp ${WAL_ARCHIVE_DIR}/%f %p'
recovery_target_time = '${TARGET_TIME}'
recovery_target_action = 'promote'
EOF

# データディレクトリ置き換え
mv /var/lib/postgresql/14/main /var/lib/postgresql/14/main.backup
mv "${RESTORE_DIR}" /var/lib/postgresql/14/main
chown -R postgres:postgres /var/lib/postgresql/14/main

# PostgreSQL起動（リカバリ実行）
systemctl start postgresql

# リカバリ完了待機
echo "Waiting for recovery to complete..."
while psql -d ${DB_NAME} -c "SELECT pg_is_in_recovery();" 2>/dev/null | grep -q "t"; do
  sleep 5
done

echo "PITR restore completed successfully to ${TARGET_TIME}"
```

---

## パーティション管理 {#partition-management}

### パーティション対象テーブル

BC-005では以下の4テーブルが年次パーティション対象:

1. **resource_utilization_history**: period_year_month（年月）
2. **timesheets**: period_start（期間開始日）
3. **timesheet_entries**: work_date（作業日）
4. **timesheet_approvals**: approved_at（承認日時）

---

### 自動パーティション作成スクリプト

```bash
#!/bin/bash
# BC-005 パーティション自動作成
# /opt/maintenance/bc-005/create-partitions.sh

set -euo pipefail

DB_NAME="consulting_tool"
NEXT_YEAR=$(date -d "next year" +%Y)
YEAR_AFTER_NEXT=$(date -d "2 years" +%Y)

echo "Creating partitions for ${NEXT_YEAR}"

# resource_utilization_history パーティション作成
psql -d ${DB_NAME} <<EOF
-- resource_utilization_history （年月ベース、12パーティション）
$(for month in {01..12}; do
  next_month=$(printf "%02d" $((10#$month + 1)))
  if [ "$next_month" = "13" ]; then
    next_month="01"
    year_end=$YEAR_AFTER_NEXT
  else
    year_end=$NEXT_YEAR
  fi
  echo "CREATE TABLE IF NOT EXISTS resource_utilization_history_${NEXT_YEAR}_${month}
PARTITION OF resource_utilization_history
FOR VALUES FROM ('${NEXT_YEAR}-${month}') TO ('${year_end}-${next_month}');"
done)

-- timesheets パーティション作成
CREATE TABLE IF NOT EXISTS timesheets_${NEXT_YEAR}
PARTITION OF timesheets
FOR VALUES FROM ('${NEXT_YEAR}-01-01') TO ('${YEAR_AFTER_NEXT}-01-01');

-- timesheet_entries パーティション作成
CREATE TABLE IF NOT EXISTS timesheet_entries_${NEXT_YEAR}
PARTITION OF timesheet_entries
FOR VALUES FROM ('${NEXT_YEAR}-01-01') TO ('${YEAR_AFTER_NEXT}-01-01');

-- timesheet_approvals パーティション作成
CREATE TABLE IF NOT EXISTS timesheet_approvals_${NEXT_YEAR}
PARTITION OF timesheet_approvals
FOR VALUES FROM ('${NEXT_YEAR}-01-01') TO ('${YEAR_AFTER_NEXT}-01-01');
EOF

# インデックス作成
echo "Creating indexes on partitions..."
psql -d ${DB_NAME} <<EOF
-- resource_utilization_history インデックス
$(for month in {01..12}; do
  echo "CREATE INDEX IF NOT EXISTS idx_resource_utilization_history_${NEXT_YEAR}_${month}_resource
  ON resource_utilization_history_${NEXT_YEAR}_${month}(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_utilization_history_${NEXT_YEAR}_${month}_period
  ON resource_utilization_history_${NEXT_YEAR}_${month}(period_year_month);"
done)

-- timesheets インデックス
CREATE INDEX IF NOT EXISTS idx_timesheets_${NEXT_YEAR}_resource_id
  ON timesheets_${NEXT_YEAR}(resource_id);
CREATE INDEX IF NOT EXISTS idx_timesheets_${NEXT_YEAR}_status
  ON timesheets_${NEXT_YEAR}(status);
CREATE INDEX IF NOT EXISTS idx_timesheets_${NEXT_YEAR}_period
  ON timesheets_${NEXT_YEAR}(period_start, period_end);

-- timesheet_entries インデックス
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_${NEXT_YEAR}_timesheet_id
  ON timesheet_entries_${NEXT_YEAR}(timesheet_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_${NEXT_YEAR}_project_id
  ON timesheet_entries_${NEXT_YEAR}(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_entries_${NEXT_YEAR}_work_date
  ON timesheet_entries_${NEXT_YEAR}(work_date);

-- timesheet_approvals インデックス
CREATE INDEX IF NOT EXISTS idx_timesheet_approvals_${NEXT_YEAR}_timesheet_id
  ON timesheet_approvals_${NEXT_YEAR}(timesheet_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_approvals_${NEXT_YEAR}_approver_id
  ON timesheet_approvals_${NEXT_YEAR}(approver_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_approvals_${NEXT_YEAR}_approved_at
  ON timesheet_approvals_${NEXT_YEAR}(approved_at DESC);
EOF

echo "Partition creation completed successfully"
```

**cron設定** （毎年12月1日実行）:
```cron
0 5 1 12 * /opt/maintenance/bc-005/create-partitions.sh >> /var/log/maintenance/bc-005-partitions.log 2>&1
```

---

### 古いパーティションのアーカイブ

7年以上前のタイムシートパーティションをデタッチしてアーカイブ。

```bash
#!/bin/bash
# BC-005 古いパーティションアーカイブ
# /opt/maintenance/bc-005/archive-old-partitions.sh

set -euo pipefail

DB_NAME="consulting_tool"
ARCHIVE_YEAR=$(date -d "7 years ago" +%Y)
ARCHIVE_DIR="/backup/bc-005/archived-partitions"

echo "Archiving partitions for ${ARCHIVE_YEAR}"

mkdir -p "${ARCHIVE_DIR}/${ARCHIVE_YEAR}"

# パーティションをデタッチ
psql -d ${DB_NAME} <<EOF
-- timesheets デタッチ
ALTER TABLE timesheets
DETACH PARTITION timesheets_${ARCHIVE_YEAR};

-- timesheet_entries デタッチ
ALTER TABLE timesheet_entries
DETACH PARTITION timesheet_entries_${ARCHIVE_YEAR};

-- timesheet_approvals デタッチ
ALTER TABLE timesheet_approvals
DETACH PARTITION timesheet_approvals_${ARCHIVE_YEAR};

-- resource_utilization_history デタッチ（全12ヶ月）
$(for month in {01..12}; do
  echo "ALTER TABLE resource_utilization_history
DETACH PARTITION resource_utilization_history_${ARCHIVE_YEAR}_${month};"
done)
EOF

# デタッチしたパーティションをバックアップ
for table in timesheets timesheet_entries timesheet_approvals; do
  pg_dump -Fc -v \
    -t ${table}_${ARCHIVE_YEAR} \
    -f "${ARCHIVE_DIR}/${ARCHIVE_YEAR}/${table}_${ARCHIVE_YEAR}.dump" \
    ${DB_NAME}

  gzip "${ARCHIVE_DIR}/${ARCHIVE_YEAR}/${table}_${ARCHIVE_YEAR}.dump"
done

# resource_utilization_history 月別バックアップ
for month in {01..12}; do
  pg_dump -Fc -v \
    -t resource_utilization_history_${ARCHIVE_YEAR}_${month} \
    -f "${ARCHIVE_DIR}/${ARCHIVE_YEAR}/resource_utilization_history_${ARCHIVE_YEAR}_${month}.dump" \
    ${DB_NAME}

  gzip "${ARCHIVE_DIR}/${ARCHIVE_YEAR}/resource_utilization_history_${ARCHIVE_YEAR}_${month}.dump"
done

# S3 Glacierにアップロード
aws s3 sync "${ARCHIVE_DIR}/${ARCHIVE_YEAR}/" \
  s3://consulting-tool-backups/bc-005/archived-partitions/${ARCHIVE_YEAR}/ \
  --storage-class GLACIER

# デタッチしたパーティションテーブルを削除
psql -d ${DB_NAME} <<EOF
DROP TABLE IF EXISTS timesheets_${ARCHIVE_YEAR};
DROP TABLE IF EXISTS timesheet_entries_${ARCHIVE_YEAR};
DROP TABLE IF EXISTS timesheet_approvals_${ARCHIVE_YEAR};
$(for month in {01..12}; do
  echo "DROP TABLE IF EXISTS resource_utilization_history_${ARCHIVE_YEAR}_${month};"
done)
EOF

echo "Partition archiving completed successfully"
```

**cron設定** （毎年1月1日実行）:
```cron
0 6 1 1 * /opt/maintenance/bc-005/archive-old-partitions.sh >> /var/log/maintenance/bc-005-archive.log 2>&1
```

---

## マテリアライズドビュー管理 {#materialized-view-management}

### マテリアライズドビュー一覧

BC-005には以下の4つのマテリアライズドビューがあります:

1. **mv_resource_utilization_summary** - リソース稼働率集計（更新: 1時間毎）
2. **mv_talent_performance_summary** - タレントパフォーマンス集計（更新: 1日1回）
3. **mv_team_statistics** - チーム統計（更新: 1時間毎）
4. **mv_skill_distribution** - スキル分布（更新: 1日1回）

---

### 自動リフレッシュスクリプト

```bash
#!/bin/bash
# BC-005 マテリアライズドビュー自動リフレッシュ
# /opt/maintenance/bc-005/refresh-mv.sh

set -euo pipefail

DB_NAME="consulting_tool"
VIEW_NAME=$1
REFRESH_MODE=${2:-"CONCURRENTLY"}

if [ -z "${VIEW_NAME}" ]; then
  echo "Usage: $0 <view_name> [refresh_mode]"
  echo "Views: mv_resource_utilization_summary, mv_talent_performance_summary, mv_team_statistics, mv_skill_distribution"
  echo "Modes: CONCURRENTLY (default), FULL"
  exit 1
fi

echo "Refreshing ${VIEW_NAME} with mode ${REFRESH_MODE}..."

START_TIME=$(date +%s)

if [ "${REFRESH_MODE}" = "CONCURRENTLY" ]; then
  psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW CONCURRENTLY ${VIEW_NAME};"
else
  psql -d ${DB_NAME} -c "REFRESH MATERIALIZED VIEW ${VIEW_NAME};"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "${VIEW_NAME} refreshed successfully in ${DURATION} seconds"

# リフレッシュ統計をログ
echo "$(date '+%Y-%m-%d %H:%M:%S'),${VIEW_NAME},${DURATION}" \
  >> /var/log/maintenance/bc-005-mv-refresh.csv
```

---

### リフレッシュスケジュール

```bash
# 1時間毎リフレッシュ（稼働率系）
0 * * * * /opt/maintenance/bc-005/refresh-mv.sh mv_resource_utilization_summary >> /var/log/maintenance/bc-005-mv.log 2>&1
0 * * * * /opt/maintenance/bc-005/refresh-mv.sh mv_team_statistics >> /var/log/maintenance/bc-005-mv.log 2>&1

# 1日1回リフレッシュ（分析系、深夜4時）
0 4 * * * /opt/maintenance/bc-005/refresh-mv.sh mv_talent_performance_summary >> /var/log/maintenance/bc-005-mv.log 2>&1
0 4 * * * /opt/maintenance/bc-005/refresh-mv.sh mv_skill_distribution >> /var/log/maintenance/bc-005-mv.log 2>&1
```

---

### インデックス再構築

```bash
#!/bin/bash
# BC-005 インデックス再構築
# /opt/maintenance/bc-005/reindex.sh

set -euo pipefail

DB_NAME="consulting_tool"
TABLE_NAME=$1

if [ -z "${TABLE_NAME}" ]; then
  echo "Usage: $0 <table_name|all>"
  exit 1
fi

echo "Reindexing ${TABLE_NAME}..."

if [ "${TABLE_NAME}" = "all" ]; then
  # 全BC-005テーブルを再構築
  for table in resources resource_allocations resource_utilization_history \
               talents performance_records career_plans talent_skills \
               skills skill_categories skill_prerequisites \
               teams team_members team_performance_history \
               timesheets timesheet_entries timesheet_approvals; do
    echo "Reindexing ${table}..."
    psql -d ${DB_NAME} -c "REINDEX TABLE CONCURRENTLY ${table};" || echo "Failed to reindex ${table}"
  done
else
  psql -d ${DB_NAME} -c "REINDEX TABLE CONCURRENTLY ${TABLE_NAME};"
fi

echo "Reindex completed successfully"
```

**cron設定** （毎週日曜深夜実行）:
```cron
0 2 * * 0 /opt/maintenance/bc-005/reindex.sh all >> /var/log/maintenance/bc-005-reindex.log 2>&1
```

---

## データ保持ポリシー {#data-retention}

### テーブル別保持期間

| テーブル | 保持期間 | 削除基準 | 理由 |
|---------|---------|---------|------|
| resources | 無期限 | 退職後10年 | 人事記録 |
| resource_allocations | 5年 | end_date | プロジェクト履歴 |
| resource_utilization_history | 7年 | period_year_month | 労務記録 |
| talents | 無期限 | 退職後10年 | 人事記録 |
| performance_records | 10年 | period_end | 評価記録 |
| career_plans | 5年 | fiscal_year | キャリア記録 |
| talent_skills | 無期限 | - | スキル履歴 |
| skills | 無期限 | - | マスタデータ |
| skill_categories | 無期限 | - | マスタデータ |
| skill_prerequisites | 無期限 | - | マスタデータ |
| teams | 3年 | end_date | チーム履歴 |
| team_members | 3年 | left_at | メンバー履歴 |
| team_performance_history | 3年 | recorded_at | パフォーマンス履歴 |
| timesheets | 7年 | period_end | 労務記録（法定） |
| timesheet_entries | 7年 | work_date | 労務記録（法定） |
| timesheet_approvals | 7年 | approved_at | 承認履歴 |

---

### 古いデータの削除スクリプト

```bash
#!/bin/bash
# BC-005 古いデータ削除
# /opt/maintenance/bc-005/purge-old-data.sh

set -euo pipefail

DB_NAME="consulting_tool"
DRY_RUN=${1:-"false"}

echo "Starting BC-005 data purge (dry_run=${DRY_RUN})"

# 削除SQL生成
if [ "${DRY_RUN}" = "true" ]; then
  SELECT_OR_DELETE="SELECT COUNT(*)"
  echo "DRY RUN MODE - No data will be deleted"
else
  SELECT_OR_DELETE="DELETE"
  echo "LIVE MODE - Data will be deleted"
fi

# resource_allocations （5年以上前）
echo "Purging old resource_allocations..."
psql -d ${DB_NAME} <<EOF
${SELECT_OR_DELETE} FROM resource_allocations
WHERE end_date < CURRENT_DATE - INTERVAL '5 years';
EOF

# career_plans （5年以上前）
echo "Purging old career_plans..."
psql -d ${DB_NAME} <<EOF
${SELECT_OR_DELETE} FROM career_plans
WHERE fiscal_year < EXTRACT(YEAR FROM CURRENT_DATE) - 5;
EOF

# teams （3年以上前、解散済み）
echo "Purging old teams..."
psql -d ${DB_NAME} <<EOF
${SELECT_OR_DELETE} FROM teams
WHERE status = 'disbanded'
  AND (end_date < CURRENT_DATE - INTERVAL '3 years'
       OR updated_at < CURRENT_TIMESTAMP - INTERVAL '3 years');
EOF

# team_members （3年以上前、退職済み）
echo "Purging old team_members..."
psql -d ${DB_NAME} <<EOF
${SELECT_OR_DELETE} FROM team_members
WHERE status = 'inactive'
  AND left_at < CURRENT_TIMESTAMP - INTERVAL '3 years';
EOF

# team_performance_history （3年以上前）
echo "Purging old team_performance_history..."
psql -d ${DB_NAME} <<EOF
${SELECT_OR_DELETE} FROM team_performance_history
WHERE recorded_at < CURRENT_TIMESTAMP - INTERVAL '3 years';
EOF

if [ "${DRY_RUN}" = "false" ]; then
  # VACUUM ANALYZE
  echo "Running VACUUM ANALYZE..."
  psql -d ${DB_NAME} <<EOF
VACUUM ANALYZE resource_allocations;
VACUUM ANALYZE career_plans;
VACUUM ANALYZE teams;
VACUUM ANALYZE team_members;
VACUUM ANALYZE team_performance_history;
EOF
fi

echo "BC-005 data purge completed successfully"
```

**cron設定** （毎月1日実行）:
```cron
# ドライラン（毎週日曜）
0 7 * * 0 /opt/maintenance/bc-005/purge-old-data.sh true >> /var/log/maintenance/bc-005-purge-dry.log 2>&1

# 本番実行（毎月1日）
0 8 1 * * /opt/maintenance/bc-005/purge-old-data.sh false >> /var/log/maintenance/bc-005-purge.log 2>&1
```

---

## 災害復旧 {#disaster-recovery}

### RTO / RPO 目標

| 優先度 | データ | RTO | RPO | 復旧方法 |
|-------|-------|-----|-----|---------|
| P0 | リソース配分 | 2時間 | 4時間 | 時間別差分バックアップ |
| P0 | タイムシート | 2時間 | 4時間 | 時間別差分バックアップ |
| P1 | パフォーマンス評価 | 4時間 | 24時間 | 日次フルバックアップ |
| P1 | スキルデータ | 4時間 | 24時間 | 日次フルバックアップ |
| P2 | 履歴データ | 24時間 | 24時間 | 日次フルバックアップ |

---

### 災害復旧手順

```bash
#!/bin/bash
# BC-005 災害復旧
# /opt/restore/bc-005/disaster-recovery.sh

set -euo pipefail

RECOVERY_SCENARIO=$1  # "full" or "partial"
BACKUP_DATE=$2        # YYYYMMDD

if [ -z "${RECOVERY_SCENARIO}" ] || [ -z "${BACKUP_DATE}" ]; then
  echo "Usage: $0 <full|partial> <backup_date>"
  echo "Example: $0 full 20251103"
  exit 1
fi

echo "Starting BC-005 disaster recovery: ${RECOVERY_SCENARIO} from ${BACKUP_DATE}"

DB_NAME="consulting_tool"
BACKUP_DIR="/backup/bc-005/daily"

if [ "${RECOVERY_SCENARIO}" = "full" ]; then
  # フル復旧
  echo "Performing full recovery..."

  # S3から最新バックアップダウンロード
  aws s3 cp s3://consulting-tool-backups/bc-005/daily/bc-005_full_${BACKUP_DATE}_*.dump.gz \
    ${BACKUP_DIR}/recovery.dump.gz

  # フルリストア実行
  /opt/restore/bc-005/full-restore.sh ${BACKUP_DIR}/recovery.dump.gz

elif [ "${RECOVERY_SCENARIO}" = "partial" ]; then
  # 部分復旧（P0データのみ）
  echo "Performing partial recovery (P0 data only)..."

  # 時間別差分バックアップから復旧
  for table in resource_allocations timesheets timesheet_entries timesheet_approvals; do
    echo "Recovering ${table}..."

    # 最新の差分バックアップ検索
    LATEST_BACKUP=$(ls -t ${BACKUP_DIR}/../hourly/bc-005_${table}_*.dump.gz | head -n1)

    if [ -n "${LATEST_BACKUP}" ]; then
      /opt/restore/bc-005/table-restore.sh ${LATEST_BACKUP} ${table}
    else
      echo "Warning: No backup found for ${table}"
    fi
  done
fi

echo "BC-005 disaster recovery completed successfully"
echo "Verifying data integrity..."

# データ整合性チェック
psql -d ${DB_NAME} <<EOF
-- リソース配分率チェック
SELECT COUNT(*) AS over_allocated_resources
FROM (
  SELECT resource_id, SUM(allocation_percentage) AS total
  FROM resource_allocations
  WHERE status = 'active'
  GROUP BY resource_id
  HAVING SUM(allocation_percentage) > 2.0
) violations;

-- タイムシート日次工数チェック
SELECT COUNT(*) AS invalid_timesheets
FROM (
  SELECT timesheet_id, work_date, SUM(hours) AS daily_total
  FROM timesheet_entries
  GROUP BY timesheet_id, work_date
  HAVING SUM(hours) > 24.0
) violations;

-- スキルレベルチェック
SELECT COUNT(*) AS invalid_skill_levels
FROM talent_skills
WHERE level < 1 OR level > 5;
EOF

echo "Data integrity check completed"
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 データ層詳細化
