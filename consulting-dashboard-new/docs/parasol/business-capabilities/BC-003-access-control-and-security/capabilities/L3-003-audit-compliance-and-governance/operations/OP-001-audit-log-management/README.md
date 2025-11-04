# OP-001: 監査ログを管理する

**作成日**: 2025-10-31
**所属L3**: L3-003-audit-compliance-and-governance: Audit Compliance And Governance
**所属BC**: BC-003: Access Control & Security
**V2移行元**: services/secure-access-service/capabilities/audit-and-assure-security/operations/audit-log-management

---

## 📋 How: この操作の定義

### 操作の概要
監査ログを管理するを実行し、ビジネス価値を創出する。

### 実現する機能
- 監査ログを管理するに必要な情報の入力と検証
- 監査ログを管理するプロセスの実行と進捗管理
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

### 監査ログ記録リクエスト
**説明**: 監査イベントをログに記録

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| eventType | ENUM | ○ | イベントタイプ | BC-003イベント分類 |
| userId | UUID | ○ | アクター（実行者）ID | 有効なUUID形式 |
| targetUserId | UUID | × | 対象ユーザーID | UUID形式 |
| resourceType | ENUM | × | リソースタイプ | BC-007統合リソース型 |
| resourceId | UUID | × | リソースID | UUID形式 |
| action | STRING_50 | ○ | 実行アクション | 1-50文字 |
| result | ENUM | ○ | 実行結果 | ['SUCCESS', 'FAILURE', 'PARTIAL'] |
| severity | ENUM | × | 重要度 | ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] デフォルト: INFO |
| metadata | OBJECT | × | 追加メタデータ | JSON形式、最大10KB |
| ipAddress | STRING_45 | ○ | IPアドレス | IPv4/IPv6形式 |
| userAgent | TEXT | × | User-Agent | 最大512文字 |
| sessionId | UUID | × | セッションID | UUID形式 |

### 監査ログ検索リクエスト
**説明**: Elasticsearchから監査ログを検索・分析

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| query | STRING | × | 検索クエリ | Elasticsearch Query DSL |
| eventTypes | ARRAY<ENUM> | × | イベントタイプフィルター | イベントタイプ配列 |
| userId | UUID | × | ユーザーフィルター | UUID形式 |
| resourceId | UUID | × | リソースフィルター | UUID形式 |
| startDate | TIMESTAMP | ○ | 検索開始日時 | ISO8601形式 |
| endDate | TIMESTAMP | ○ | 検索終了日時 | ISO8601形式、startDate以降 |
| severity | ARRAY<ENUM> | × | 重要度フィルター | ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] |
| result | ARRAY<ENUM> | × | 結果フィルター | ['SUCCESS', 'FAILURE', 'PARTIAL'] |
| sortBy | STRING | × | ソートフィールド | デフォルト: timestamp |
| sortOrder | ENUM | × | ソート順 | ['ASC', 'DESC'] デフォルト: DESC |
| page | INTEGER | × | ページ番号 | デフォルト: 1 |
| limit | INTEGER | × | 取得件数 | デフォルト: 100, 最大: 1000 |

### 監査ログ集計リクエスト
**説明**: 監査ログの集計・統計分析

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| aggregationType | ENUM | ○ | 集計タイプ | ['COUNT', 'UNIQUE_USERS', 'BY_EVENT_TYPE', 'TIMELINE'] |
| startDate | TIMESTAMP | ○ | 集計開始日時 | ISO8601形式 |
| endDate | TIMESTAMP | ○ | 集計終了日時 | ISO8601形式 |
| groupBy | ENUM | × | グループ化 | ['HOUR', 'DAY', 'WEEK', 'MONTH'] |
| filters | OBJECT | × | フィルター条件 | 検索条件オブジェクト |

### 監査ログエクスポートリクエスト
**説明**: 監査ログをファイルにエクスポート

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| exportType | ENUM | ○ | エクスポートタイプ | ['FULL', 'FILTERED', 'COMPLIANCE'] |
| format | ENUM | ○ | 出力形式 | ['CSV', 'JSON', 'EXCEL'] |
| startDate | TIMESTAMP | ○ | エクスポート開始日時 | ISO8601形式 |
| endDate | TIMESTAMP | ○ | エクスポート終了日時 | ISO8601形式 |
| filters | OBJECT | × | フィルター条件 | 検索条件 |
| includeMetadata | BOOLEAN | × | メタデータ含む | デフォルト: true |
| compressionType | ENUM | × | 圧縮形式 | ['NONE', 'GZIP', 'ZIP'] デフォルト: GZIP |

### 監査ログ保持期間管理リクエスト
**説明**: 保持期間ポリシーに基づくログ削除

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|-----|------|------|--------------|
| retentionDays | INTEGER | ○ | 保持日数 | デフォルト: 90, 範囲: 30-365 |
| dryRun | BOOLEAN | × | ドライラン実行 | デフォルト: true |
| archiveBeforeDelete | BOOLEAN | × | 削除前アーカイブ | デフォルト: true |
| archiveLocation | STRING | × | アーカイブ先 | S3 bucket等 |

---

## 📤 出力仕様

### 監査ログ記録成功レスポンス
**HTTPステータス**: 201 Created

```json
{
  "success": true,
  "data": {
    "logId": "log-uuid",
    "eventType": "PERMISSION_GRANTED",
    "userId": "user-uuid",
    "userName": "田中太郎",
    "targetUserId": "target-user-uuid",
    "resourceType": "PROJECT",
    "resourceId": "project-uuid",
    "action": "GRANT_PERMISSION",
    "result": "SUCCESS",
    "severity": "INFO",
    "timestamp": "2025-11-04T10:00:00Z",
    "ipAddress": "192.168.1.100",
    "sessionId": "session-uuid",
    "elasticsearchIndex": "audit-logs-2025-11",
    "elasticsearchId": "es-doc-uuid"
  },
  "message": "監査ログが記録されました。",
  "retention": {
    "retentionPeriod": "90 days",
    "expiresAt": "2026-02-02T10:00:00Z"
  }
}
```

### 監査ログ検索結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "logId": "log-uuid-1",
        "eventType": "USER_LOGIN",
        "userId": "user-uuid",
        "userName": "田中太郎",
        "action": "LOGIN",
        "result": "SUCCESS",
        "severity": "INFO",
        "timestamp": "2025-11-04T09:00:00Z",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "sessionId": "session-uuid",
        "metadata": {
          "mfaVerified": true,
          "deviceTrusted": false
        }
      },
      {
        "logId": "log-uuid-2",
        "eventType": "PERMISSION_REVOKED",
        "userId": "admin-uuid",
        "userName": "管理者 花子",
        "targetUserId": "user-uuid",
        "resourceType": "PROJECT",
        "resourceId": "project-uuid",
        "action": "REVOKE_PERMISSION",
        "result": "SUCCESS",
        "severity": "WARNING",
        "timestamp": "2025-11-04T08:30:00Z",
        "metadata": {
          "reason": "プロジェクト終了",
          "affectedPermissions": ["READ", "WRITE"]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 15234,
      "pages": 153,
      "hasNext": true
    },
    "executionTime": 125,
    "elasticsearchQuery": {
      "index": "audit-logs-*",
      "took": 125,
      "hits": 15234
    }
  }
}
```

### 監査ログ集計結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "aggregationType": "BY_EVENT_TYPE",
    "period": {
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-11-04T23:59:59Z"
    },
    "aggregations": {
      "byEventType": [
        { "eventType": "USER_LOGIN", "count": 8523, "percentage": 35.2 },
        { "eventType": "PERMISSION_GRANTED", "count": 3421, "percentage": 14.1 },
        { "eventType": "PERMISSION_REVOKED", "count": 1234, "percentage": 5.1 },
        { "eventType": "MFA_VERIFICATION", "count": 7890, "percentage": 32.6 },
        { "eventType": "ACCESS_DENIED", "count": 567, "percentage": 2.3 }
      ],
      "bySeverity": [
        { "severity": "INFO", "count": 18234, "percentage": 75.2 },
        { "severity": "WARNING", "count": 4123, "percentage": 17.0 },
        { "severity": "ERROR", "count": 1456, "percentage": 6.0 },
        { "severity": "CRITICAL", "count": 423, "percentage": 1.8 }
      ],
      "timeline": [
        { "date": "2025-11-01", "count": 6234 },
        { "date": "2025-11-02", "count": 5987 },
        { "date": "2025-11-03", "count": 6123 },
        { "date": "2025-11-04", "count": 5892 }
      ]
    },
    "summary": {
      "totalLogs": 24236,
      "uniqueUsers": 1523,
      "failureRate": 3.2,
      "criticalEvents": 423
    }
  }
}
```

### 監査ログエクスポート成功レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "exportId": "export-uuid",
    "exportType": "FILTERED",
    "format": "CSV",
    "period": {
      "startDate": "2025-10-01T00:00:00Z",
      "endDate": "2025-10-31T23:59:59Z"
    },
    "totalRecords": 54321,
    "fileSize": 12456789,
    "fileSizeHuman": "11.9 MB",
    "compressionType": "GZIP",
    "compressedSize": 3421567,
    "compressedSizeHuman": "3.3 MB",
    "downloadUrl": "/api/audit/exports/export-uuid/download",
    "expiresAt": "2025-11-11T00:00:00Z",
    "generatedAt": "2025-11-04T11:00:00Z"
  },
  "message": "監査ログがエクスポートされました。",
  "fileInfo": {
    "fileName": "audit-logs-2025-10.csv.gz",
    "md5Hash": "abc123def456...",
    "sha256Hash": "def789ghi012..."
  }
}
```

### 監査ログ削除結果レスポンス
**HTTPステータス**: 200 OK

```json
{
  "success": true,
  "data": {
    "retentionPolicyId": "policy-uuid",
    "retentionDays": 90,
    "cutoffDate": "2025-08-06T00:00:00Z",
    "dryRun": false,
    "results": {
      "identified": 125432,
      "archived": 125432,
      "deleted": 125432,
      "failed": 0
    },
    "archiveInfo": {
      "location": "s3://audit-archive/2025/08/",
      "archiveSize": 523456789,
      "archiveSizeHuman": "499 MB"
    },
    "elasticsearchInfo": {
      "indicesDeleted": ["audit-logs-2025-05", "audit-logs-2025-06", "audit-logs-2025-07"],
      "documentsDeleted": 125432,
      "storageReclaimed": "512 MB"
    },
    "executedAt": "2025-11-04T12:00:00Z"
  }
}
```

---

## 🛠️ 実装ガイダンス

### Elasticsearch監査ログ実装

#### 1. Winston + Elasticsearch統合
```typescript
import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Client } from '@elastic/elasticsearch';

// Elasticsearchクライアント初期化
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
});

// Winston + Elasticsearchトランスポート設定
const esTransportOpts = {
  level: 'info',
  client: esClient,
  index: 'audit-logs',
  indexPrefix: 'audit-logs',
  indexSuffixPattern: 'YYYY-MM',
  messageType: 'auditLog',
  transformer: (logData) => {
    return {
      '@timestamp': new Date().toISOString(),
      severity: logData.level,
      message: logData.message,
      ...logData.meta
    };
  }
};

export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new ElasticsearchTransport(esTransportOpts),
    new winston.transports.Console({ // デバッグ用
      format: winston.format.simple()
    })
  ]
});
```

#### 2. 監査ログ記録の実装
```typescript
interface AuditLogEntry {
  eventType: string;
  userId: string;
  targetUserId?: string;
  resourceType?: string;
  resourceId?: string;
  action: string;
  result: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  metadata?: object;
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
}

async function recordAuditLog(entry: AuditLogEntry) {
  const logId = generateUUID();
  const timestamp = new Date();

  // 1. Winston経由でElasticsearchに記録
  auditLogger.info('Audit event', {
    logId,
    eventType: entry.eventType,
    userId: entry.userId,
    targetUserId: entry.targetUserId,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    action: entry.action,
    result: entry.result,
    severity: entry.severity || 'INFO',
    timestamp: timestamp.toISOString(),
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    sessionId: entry.sessionId,
    metadata: entry.metadata || {},
    retention: {
      retentionPeriod: '90 days',
      expiresAt: addDays(timestamp, 90).toISOString()
    }
  });

  // 2. Prismaにも記録（検索パフォーマンス用）
  const auditLog = await prisma.auditLog.create({
    data: {
      id: logId,
      eventType: entry.eventType,
      userId: entry.userId,
      targetUserId: entry.targetUserId,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      action: entry.action,
      result: entry.result,
      severity: entry.severity || 'INFO',
      timestamp,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      sessionId: entry.sessionId,
      metadata: entry.metadata,
      elasticsearchIndex: `audit-logs-${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}`,
      expiresAt: addDays(timestamp, 90)
    }
  });

  return auditLog;
}
```

#### 3. Elasticsearch検索の実装
```typescript
async function searchAuditLogs(request: {
  eventTypes?: string[];
  userId?: string;
  resourceId?: string;
  startDate: Date;
  endDate: Date;
  severity?: string[];
  result?: string[];
  page?: number;
  limit?: number;
}) {
  const page = request.page || 1;
  const limit = Math.min(request.limit || 100, 1000);
  const from = (page - 1) * limit;

  // Elasticsearch Query DSL構築
  const must = [
    {
      range: {
        timestamp: {
          gte: request.startDate.toISOString(),
          lte: request.endDate.toISOString()
        }
      }
    }
  ];

  if (request.eventTypes && request.eventTypes.length > 0) {
    must.push({ terms: { eventType: request.eventTypes } });
  }

  if (request.userId) {
    must.push({ term: { userId: request.userId } });
  }

  if (request.resourceId) {
    must.push({ term: { resourceId: request.resourceId } });
  }

  if (request.severity && request.severity.length > 0) {
    must.push({ terms: { severity: request.severity } });
  }

  if (request.result && request.result.length > 0) {
    must.push({ terms: { result: request.result } });
  }

  // Elasticsearch検索実行
  const esResponse = await esClient.search({
    index: 'audit-logs-*',
    from,
    size: limit,
    sort: [{ timestamp: { order: 'desc' } }],
    body: {
      query: {
        bool: { must }
      }
    }
  });

  const logs = esResponse.hits.hits.map(hit => ({
    logId: hit._source.logId,
    ...hit._source
  }));

  return {
    logs,
    pagination: {
      page,
      limit,
      total: esResponse.hits.total.value,
      pages: Math.ceil(esResponse.hits.total.value / limit),
      hasNext: from + limit < esResponse.hits.total.value
    },
    executionTime: esResponse.took
  };
}
```

#### 4. 90日保持期間管理の実装
```typescript
async function enforceRetentionPolicy(
  retentionDays: number = 90,
  dryRun: boolean = true,
  archiveBeforeDelete: boolean = true
) {
  const cutoffDate = subDays(new Date(), retentionDays);
  const results = {
    identified: 0,
    archived: 0,
    deleted: 0,
    failed: 0
  };

  // 1. 削除対象のインデックスを特定
  const indicesResponse = await esClient.cat.indices({
    index: 'audit-logs-*',
    format: 'json'
  });

  const indicesToDelete = indicesResponse
    .filter(index => {
      const indexDate = extractDateFromIndexName(index.index);
      return indexDate && indexDate < cutoffDate;
    })
    .map(index => index.index);

  results.identified = indicesToDelete.length;

  if (dryRun) {
    return {
      dryRun: true,
      cutoffDate,
      indicesToDelete,
      results
    };
  }

  // 2. アーカイブ処理（S3等へ）
  if (archiveBeforeDelete) {
    for (const indexName of indicesToDelete) {
      try {
        await archiveIndexToS3(indexName);
        results.archived++;
      } catch (error) {
        console.error(`Failed to archive index ${indexName}:`, error);
        results.failed++;
      }
    }
  }

  // 3. Elasticsearchインデックス削除
  for (const indexName of indicesToDelete) {
    try {
      await esClient.indices.delete({ index: indexName });
      results.deleted++;
    } catch (error) {
      console.error(`Failed to delete index ${indexName}:`, error);
      results.failed++;
    }
  }

  // 4. Prismaの期限切れレコード削除
  await prisma.auditLog.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });

  return {
    dryRun: false,
    cutoffDate,
    indicesToDelete,
    results
  };
}

async function archiveIndexToS3(indexName: string) {
  // Elasticsearchからデータをエクスポート
  const scrollResponse = await esClient.search({
    index: indexName,
    scroll: '5m',
    size: 1000,
    body: {
      query: { match_all: {} }
    }
  });

  const logs = [];
  let scrollId = scrollResponse._scroll_id;

  // 全データを取得
  while (scrollResponse.hits.hits.length > 0) {
    logs.push(...scrollResponse.hits.hits.map(hit => hit._source));

    const nextScrollResponse = await esClient.scroll({
      scroll_id: scrollId,
      scroll: '5m'
    });

    scrollId = nextScrollResponse._scroll_id;
    if (nextScrollResponse.hits.hits.length === 0) break;
  }

  // JSONLinesフォーマットでS3にアップロード
  const jsonlData = logs.map(log => JSON.stringify(log)).join('\n');
  const gzippedData = gzip(jsonlData);

  await s3Client.putObject({
    Bucket: 'audit-archive',
    Key: `${indexName}.jsonl.gz`,
    Body: gzippedData,
    ContentType: 'application/gzip',
    StorageClass: 'GLACIER'
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### 監査ログ記録エラー (E-AUDIT-1xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-AUDIT-1001 | 400 | Invalid event type | 不正なイベントタイプ | 有効なイベントタイプを指定 |
| E-AUDIT-1002 | 400 | Missing required fields | 必須フィールド不足 | 必須パラメータを指定 |
| E-AUDIT-1003 | 500 | Elasticsearch write failed | Elasticsearch書き込み失敗 | 再試行、Elasticsearchステータス確認 |
| E-AUDIT-1004 | 507 | Elasticsearch storage full | ストレージ容量不足 | ストレージ拡張、古いログ削除 |
| E-AUDIT-1005 | 500 | Audit log creation failed | 監査ログ作成失敗 | 再試行、失敗時はサポートに連絡 |

#### 監査ログ検索エラー (E-SEARCH-2xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-SEARCH-2001 | 400 | Invalid query syntax | 不正なクエリ構文 | クエリを修正 |
| E-SEARCH-2002 | 400 | Invalid date range | 不正な日付範囲 | 有効な日付範囲を指定 |
| E-SEARCH-2003 | 503 | Elasticsearch unavailable | Elasticsearch利用不可 | サービス復旧を待つ |
| E-SEARCH-2004 | 504 | Search timeout | 検索タイムアウト | 検索範囲を縮小 |
| E-SEARCH-2005 | 400 | Result limit exceeded | 結果件数超過 | 検索条件を絞り込む |

#### エクスポートエラー (E-EXPORT-3xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-EXPORT-3001 | 400 | Invalid export format | 不正なエクスポート形式 | 有効な形式を指定 |
| E-EXPORT-3002 | 400 | Export range too large | エクスポート範囲が大きすぎる | 範囲を分割 |
| E-EXPORT-3003 | 500 | Export generation failed | エクスポート生成失敗 | 再試行 |
| E-EXPORT-3004 | 507 | Insufficient storage | ストレージ不足 | ストレージを確保 |

#### 保持期間管理エラー (E-RETENTION-4xxx)

| エラーコード | HTTPステータス | エラーメッセージ | 原因 | 対処方法 |
|------------|---------------|----------------|------|---------|
| E-RETENTION-4001 | 400 | Invalid retention period | 不正な保持期間 | 30-365日の範囲で指定 |
| E-RETENTION-4002 | 500 | Archive failed | アーカイブ失敗 | S3接続確認、再試行 |
| E-RETENTION-4003 | 500 | Deletion failed | 削除失敗 | Elasticsearch接続確認 |
| E-RETENTION-4004 | 409 | Retention policy conflict | ポリシー競合 | ポリシーを確認 |

### 監査ログ記録

```typescript
// 監査ログ記録成功
await auditLogger.info('Audit log recorded', {
  logId: log.id,
  eventType: entry.eventType,
  userId: entry.userId,
  result: entry.result
});

// 監査ログ検索実行
await auditLogger.info('Audit log search', {
  searchId: generateUUID(),
  userId: currentUserId,
  searchCriteria: request,
  resultsCount: results.logs.length
});

// 保持期間ポリシー実行
await auditLogger.info('Retention policy executed', {
  retentionDays: 90,
  deletedIndices: results.deleted,
  archivedIndices: results.archived
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
> - [services/secure-access-service/capabilities/audit-and-assure-security/operations/audit-log-management/](../../../../../../services/secure-access-service/capabilities/audit-and-assure-security/operations/audit-log-management/)
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
