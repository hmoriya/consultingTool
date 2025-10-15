# 知識管理CRUD API

## 📋 概要
knowledge-co-creation-service の基本的な知識管理操作（作成・読み取り・更新・削除・検索）を提供するAPI群です。

## 🔧 基本CRUD操作

### 1. 知識作成API

```http
POST /api/knowledge-co-creation/knowledge
Content-Type: application/json
Authorization: Bearer {token}
```

#### リクエスト仕様
```json
{
  "title": "システム設計ベストプラクティス",
  "description": "実践的なシステム設計手法とパターン集",
  "content": {
    "format": "markdown", // "markdown" | "html" | "docx" | "pdf"
    "body": "# システム設計の基本原則\n\n## 1. 単一責任の原則...",
    "attachments": [
      {
        "type": "image",
        "url": "/uploads/architecture-diagram.png",
        "description": "システムアーキテクチャ図"
      }
    ]
  },
  "metadata": {
    "category": "技術ドキュメント",
    "tags": ["設計パターン", "アーキテクチャ", "ベストプラクティス"],
    "language": "ja",
    "sourceType": "original", // "original" | "extracted" | "imported"
    "confidentialityLevel": "internal" // "public" | "internal" | "confidential" | "secret"
  },
  "authorInfo": {
    "primaryAuthor": "user-123",
    "contributors": ["user-456", "user-789"],
    "reviewers": ["user-lead-001"],
    "department": "engineering",
    "project": "project-alpha-001"
  }
}
```

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "knowledgeId": "knowledge-uuid-12345",
    "status": "draft", // "draft" | "review" | "published" | "archived"
    "version": "1.0.0",
    "createdAt": "2025-10-10T14:00:00Z",
    "lastModified": "2025-10-10T14:00:00Z",
    "accessUrl": "/knowledge/system-design-best-practices",
    "estimatedReadTime": "15分",
    "wordCount": 2340
  },
  "externalServiceCalls": [
    {
      "service": "secure-access-service",
      "usecase": "UC-AUTH-02",
      "endpoint": "POST /api/auth/usecases/validate-permission",
      "purpose": "知識作成権限の検証"
    }
  ],
  "timestamp": "2025-10-10T14:00:00Z"
}
```

### 2. 知識詳細取得API

```http
GET /api/knowledge-co-creation/knowledge/{knowledgeId}
Authorization: Bearer {token}
```

#### パスパラメータ
- `knowledgeId`: 知識の一意識別子

#### クエリパラメータ
- `includeContent`: コンテンツ本文を含むか（default: true）
- `includeHistory`: 変更履歴を含むか（default: false）
- `includeMetrics`: アクセス統計を含むか（default: false）

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "knowledgeId": "knowledge-uuid-12345",
    "title": "システム設計ベストプラクティス",
    "description": "実践的なシステム設計手法とパターン集",
    "content": {
      "format": "markdown",
      "body": "# システム設計の基本原則...",
      "attachments": [
        {
          "attachmentId": "att-001",
          "type": "image",
          "url": "/uploads/architecture-diagram.png",
          "description": "システムアーキテクチャ図",
          "fileSize": 245760,
          "uploadedAt": "2025-10-10T14:05:00Z"
        }
      ]
    },
    "metadata": {
      "category": "技術ドキュメント",
      "tags": ["設計パターン", "アーキテクチャ", "ベストプラクティス"],
      "language": "ja",
      "confidentialityLevel": "internal",
      "estimatedReadTime": "15分",
      "wordCount": 2340,
      "lastQualityScore": 0.89
    },
    "versionInfo": {
      "currentVersion": "1.2.0",
      "totalVersions": 5,
      "lastModified": "2025-10-10T16:30:00Z",
      "lastModifiedBy": "user-456"
    },
    "authorInfo": {
      "primaryAuthor": {
        "userId": "user-123",
        "name": "田中エンジニア",
        "department": "engineering"
      },
      "contributors": [
        {
          "userId": "user-456",
          "name": "佐藤アーキテクト",
          "contributionType": "technical_review"
        }
      ]
    },
    "accessMetrics": {
      "viewCount": 1234,
      "uniqueViewers": 456,
      "shareCount": 89,
      "averageRating": 4.3,
      "lastAccessed": "2025-10-10T15:45:00Z"
    }
  },
  "timestamp": "2025-10-10T16:45:00Z"
}
```

### 3. 知識更新API

```http
PUT /api/knowledge-co-creation/knowledge/{knowledgeId}
Content-Type: application/json
Authorization: Bearer {token}
```

#### リクエスト仕様
```json
{
  "title": "システム設計ベストプラクティス v2.0",
  "description": "最新の設計手法を追加した改訂版",
  "content": {
    "format": "markdown",
    "body": "# システム設計の基本原則（改訂版）...",
    "attachments": [
      {
        "action": "add", // "add" | "update" | "remove"
        "type": "image",
        "url": "/uploads/new-architecture-diagram.png",
        "description": "更新されたアーキテクチャ図"
      },
      {
        "action": "remove",
        "attachmentId": "att-old-001"
      }
    ]
  },
  "updateInfo": {
    "versionType": "minor", // "major" | "minor" | "patch"
    "changeDescription": "マイクロサービス設計パターンを追加",
    "reviewRequired": true
  },
  "metadata": {
    "tags": ["設計パターン", "アーキテクチャ", "マイクロサービス"],
    "lastUpdatedSection": "section-3"
  }
}
```

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "knowledgeId": "knowledge-uuid-12345",
    "previousVersion": "1.2.0",
    "newVersion": "1.3.0",
    "status": "review_required", // "draft" | "review_required" | "published"
    "changesSummary": {
      "sectionsModified": 2,
      "contentAdded": "1,234 characters",
      "attachmentsAdded": 1,
      "attachmentsRemoved": 1
    },
    "lastModified": "2025-10-10T17:00:00Z",
    "reviewDeadline": "2025-10-12T17:00:00Z"
  },
  "externalServiceCalls": [
    {
      "service": "collaboration-facilitation-service",
      "usecase": "UC-COLLAB-04",
      "endpoint": "POST /api/collaboration/usecases/send-notification",
      "purpose": "レビュー依頼通知の配信"
    }
  ],
  "timestamp": "2025-10-10T17:00:00Z"
}
```

### 4. 知識削除API

```http
DELETE /api/knowledge-co-creation/knowledge/{knowledgeId}
Authorization: Bearer {token}
```

#### クエリパラメータ
- `softDelete`: 論理削除するか（default: true）
- `reason`: 削除理由（required）

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "knowledgeId": "knowledge-uuid-12345",
    "deletionType": "soft_delete", // "soft_delete" | "hard_delete"
    "deletedAt": "2025-10-10T17:30:00Z",
    "retentionPeriod": "90 days",
    "recoveryDeadline": "2025-01-08T17:30:00Z",
    "affectedReferences": {
      "projectLinks": 2,
      "knowledgeReferences": 5,
      "userBookmarks": 12
    }
  },
  "externalServiceCalls": [
    {
      "service": "secure-access-service",
      "usecase": "UC-AUTH-03",
      "endpoint": "POST /api/auth/usecases/log-access",
      "purpose": "削除操作の監査ログ記録"
    }
  ],
  "timestamp": "2025-10-10T17:30:00Z"
}
```

## 🔍 検索・一覧取得

### 5. 知識一覧・検索API

```http
GET /api/knowledge-co-creation/knowledge
Authorization: Bearer {token}
```

#### クエリパラメータ
- `q`: 検索キーワード
- `category`: カテゴリフィルタ
- `tags`: タグフィルタ（カンマ区切り）
- `author`: 作成者フィルタ
- `dateFrom`: 作成日時範囲（開始）
- `dateTo`: 作成日時範囲（終了）
- `status`: ステータスフィルタ
- `confidentialityLevel`: 機密レベルフィルタ
- `sort`: ソート順（`created_asc`, `created_desc`, `modified_desc`, `popularity_desc`, `quality_desc`）
- `page`: ページ番号（default: 1）
- `limit`: 件数（default: 20, max: 100）

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "knowledgeId": "knowledge-uuid-12345",
        "title": "システム設計ベストプラクティス",
        "description": "実践的なシステム設計手法とパターン集",
        "category": "技術ドキュメント",
        "tags": ["設計パターン", "アーキテクチャ"],
        "authorInfo": {
          "primaryAuthor": "田中エンジニア",
          "department": "engineering"
        },
        "metadata": {
          "status": "published",
          "version": "1.3.0",
          "createdAt": "2025-10-10T14:00:00Z",
          "lastModified": "2025-10-10T17:00:00Z",
          "estimatedReadTime": "15分",
          "qualityScore": 0.89,
          "confidentialityLevel": "internal"
        },
        "metrics": {
          "viewCount": 1234,
          "shareCount": 89,
          "averageRating": 4.3
        },
        "relevanceScore": 0.94 // 検索クエリとの関連度
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalItems": 486,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrevious": false
    },
    "searchMetadata": {
      "query": "システム設計",
      "searchTime": 0.125, // 秒
      "resultsFound": 486,
      "appliedFilters": {
        "category": "技術ドキュメント",
        "tags": ["設計パターン"]
      },
      "suggestedTags": ["アーキテクチャ", "ベストプラクティス", "パフォーマンス"]
    }
  },
  "timestamp": "2025-10-10T18:00:00Z"
}
```

## 📁 ファイル管理

### 6. ファイルアップロードAPI

```http
POST /api/knowledge-co-creation/knowledge/{knowledgeId}/attachments
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

#### リクエスト仕様
```
file: (binary data)
description: "システムアーキテクチャ図"
type: "image" // "image" | "document" | "video" | "code"
```

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "attachmentId": "att-uuid-789",
    "filename": "architecture-diagram.png",
    "fileSize": 245760,
    "mimeType": "image/png",
    "url": "/uploads/att-uuid-789/architecture-diagram.png",
    "thumbnailUrl": "/uploads/att-uuid-789/thumb_architecture-diagram.png",
    "uploadedAt": "2025-10-10T18:15:00Z",
    "processingStatus": "completed" // "uploading" | "processing" | "completed" | "failed"
  },
  "timestamp": "2025-10-10T18:15:00Z"
}
```

### 7. ファイル削除API

```http
DELETE /api/knowledge-co-creation/knowledge/{knowledgeId}/attachments/{attachmentId}
Authorization: Bearer {token}
```

#### レスポンス仕様
```json
{
  "success": true,
  "data": {
    "attachmentId": "att-uuid-789",
    "deletedAt": "2025-10-10T18:30:00Z",
    "storageFreed": 245760 // bytes
  },
  "timestamp": "2025-10-10T18:30:00Z"
}
```

## 🔒 セキュリティ・権限

### アクセス制御
- **作成権限**: `knowledge:create`
- **読み取り権限**: `knowledge:read` + 機密レベル適合
- **更新権限**: `knowledge:update` + 作成者または承認者
- **削除権限**: `knowledge:delete` + 作成者または管理者

### バリデーション
- **ファイルサイズ**: 最大100MB/ファイル
- **ファイル形式**: 安全なMIMEタイプのみ許可
- **内容検証**: マルウェア・有害コンテンツのスキャン
- **権限チェック**: 各操作前の権限検証

---

**この基本CRUD APIにより、知識の効率的な管理と安全なアクセス制御が実現されます。**