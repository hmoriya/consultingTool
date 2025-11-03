# BC-006: ナレッジ管理API詳細 [Knowledge Management API Details]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/api/

---

## 目次

1. [概要](#overview)
2. [Knowledge Article API](#knowledge-article-api)
3. [Category API](#category-api)
4. [Tag API](#tag-api)
5. [Best Practice API](#best-practice-api)
6. [Review API](#review-api)
7. [データスキーマ](#data-schemas)
8. [使用例](#usage-examples)

---

## 概要 {#overview}

ナレッジ管理APIは、記事のライフサイクル管理、カテゴリ分類、タグ付け、ベストプラクティス管理、品質レビューの機能を提供します。

### エンドポイント概要

| グループ | エンドポイント数 | 説明 |
|---------|---------------|------|
| Article API | 12 | 記事CRUD、公開、バージョン管理 |
| Category API | 6 | カテゴリ階層管理 |
| Tag API | 4 | タグ管理、提案 |
| Best Practice API | 8 | ベストプラクティス管理、適用追跡 |
| Review API | 6 | レビュー、承認・却下 |

**合計**: 36エンドポイント

---

## Knowledge Article API {#knowledge-article-api}

### 1. 記事作成 [Create Article]

ナレッジ記事を下書きとして作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "title": "TypeScriptでのエラーハンドリングベストプラクティス",
  "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン",
  "content": "# エラーハンドリングの重要性\n\n...",
  "categoryId": "cat-uuid-001",
  "tags": ["typescript", "error-handling", "best-practices"],
  "relatedProjectId": "proj-uuid-001",
  "attachments": [
    {
      "name": "error-hierarchy.png",
      "url": "https://storage.example.com/attachments/error-hierarchy.png",
      "type": "image/png",
      "size": 125000
    }
  ]
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "art-uuid-001",
  "title": "TypeScriptでのエラーハンドリングベストプラクティス",
  "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン",
  "content": "# エラーハンドリングの重要性\n\n...",
  "status": "draft",
  "categoryId": "cat-uuid-001",
  "authorId": "user-uuid-001",
  "tags": ["typescript", "error-handling", "best-practices"],
  "qualityScore": {
    "accuracy": 3.0,
    "completeness": 3.0,
    "usefulness": 3.0,
    "clarity": 3.0,
    "overall": 3.0
  },
  "viewCount": 0,
  "likeCount": 0,
  "metadata": {
    "createdAt": "2025-11-03T10:00:00.000Z",
    "updatedAt": "2025-11-03T10:00:00.000Z",
    "version": "0.1.0"
  }
}
```

---

### 2. 記事取得 [Get Article]

指定IDの記事を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/articles/{articleId}
```

**権限**: `knowledge:read` (公開記事) / `knowledge:write` (下書き・自分の記事)

**パスパラメータ**:
- `articleId` (string, required): 記事ID

**クエリパラメータ**:
- `includeVersions` (boolean, optional): バージョン履歴を含むか (default: false)
- `includeReviews` (boolean, optional): レビュー情報を含むか (default: false)

**レスポンス**: `200 OK`
```json
{
  "id": "art-uuid-001",
  "title": "TypeScriptでのエラーハンドリングベストプラクティス",
  "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン",
  "content": "# エラーハンドリングの重要性\n\n...",
  "status": "published",
  "categoryId": "cat-uuid-001",
  "category": {
    "id": "cat-uuid-001",
    "name": "プログラミング",
    "path": "技術 > プログラミング"
  },
  "authorId": "user-uuid-001",
  "author": {
    "id": "user-uuid-001",
    "name": "山田太郎",
    "email": "yamada@example.com"
  },
  "tags": ["typescript", "error-handling", "best-practices"],
  "attachments": [
    {
      "id": "att-uuid-001",
      "name": "error-hierarchy.png",
      "url": "https://storage.example.com/attachments/error-hierarchy.png",
      "type": "image/png",
      "size": 125000
    }
  ],
  "qualityScore": {
    "accuracy": 4.5,
    "completeness": 4.2,
    "usefulness": 4.7,
    "clarity": 4.3,
    "overall": 4.4
  },
  "viewCount": 1523,
  "likeCount": 89,
  "metadata": {
    "createdAt": "2025-11-03T10:00:00.000Z",
    "updatedAt": "2025-11-03T12:30:00.000Z",
    "publishedAt": "2025-11-03T11:00:00.000Z",
    "version": "1.0.0"
  }
}
```

**エラーレスポンス**:
```json
{
  "error": {
    "code": "KNOWLEDGE_001",
    "message": "Article not found",
    "details": "Article with ID 'art-uuid-999' does not exist"
  }
}
```

---

### 3. 記事一覧取得 [List Articles]

記事の一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/articles
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `status` (string, optional): フィルタ (`draft`, `review`, `published`, `archived`)
- `categoryId` (string, optional): カテゴリID
- `authorId` (string, optional): 著者ID
- `tags` (string[], optional): タグ (カンマ区切り)
- `sort` (string, optional): ソート (`createdAt:desc`, `viewCount:desc`, `qualityScore:desc`)
- `limit` (number, optional): 取得件数 (default: 20, max: 100)
- `offset` (number, optional): オフセット (default: 0)

**レスポンス**: `200 OK`
```json
{
  "items": [
    {
      "id": "art-uuid-001",
      "title": "TypeScriptでのエラーハンドリングベストプラクティス",
      "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン",
      "status": "published",
      "categoryId": "cat-uuid-001",
      "authorId": "user-uuid-001",
      "tags": ["typescript", "error-handling"],
      "qualityScore": {
        "overall": 4.4
      },
      "viewCount": 1523,
      "likeCount": 89,
      "metadata": {
        "publishedAt": "2025-11-03T11:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 4. 記事更新 [Update Article]

記事を更新します。公開済み記事の場合は新しいバージョンとして保存されます。

**エンドポイント**:
```
PUT /api/v1/bc-006/knowledge/articles/{articleId}
```

**権限**: `knowledge:write` (自分の記事のみ) / `knowledge:admin` (全て)

**リクエストボディ**:
```json
{
  "title": "TypeScriptでのエラーハンドリングベストプラクティス (更新版)",
  "summary": "TypeScriptプロジェクトにおける効果的なエラーハンドリングパターン（2025年版）",
  "content": "# エラーハンドリングの重要性\n\n更新された内容...",
  "categoryId": "cat-uuid-001",
  "tags": ["typescript", "error-handling", "best-practices", "2025"],
  "versionComment": "最新のTypeScript 5.x系の機能を追加"
}
```

**レスポンス**: `200 OK`
```json
{
  "id": "art-uuid-001",
  "title": "TypeScriptでのエラーハンドリングベストプラクティス (更新版)",
  "status": "draft",
  "metadata": {
    "version": "1.1.0",
    "updatedAt": "2025-11-03T14:00:00.000Z"
  },
  "versionHistory": [
    {
      "version": "1.0.0",
      "publishedAt": "2025-11-03T11:00:00.000Z",
      "comment": "Initial publication"
    },
    {
      "version": "1.1.0",
      "createdAt": "2025-11-03T14:00:00.000Z",
      "comment": "最新のTypeScript 5.x系の機能を追加"
    }
  ]
}
```

---

### 5. 記事削除 [Delete Article]

記事を削除（論理削除）します。公開済み記事はアーカイブ状態になります。

**エンドポイント**:
```
DELETE /api/v1/bc-006/knowledge/articles/{articleId}
```

**権限**: `knowledge:delete` (自分の記事) / `knowledge:admin` (全て)

**レスポンス**: `204 No Content`

---

### 6. 記事公開申請 [Request Publication]

記事をレビュー待ち状態にします。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/request-publication
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "reviewers": ["user-uuid-002", "user-uuid-003"],
  "message": "レビューをお願いします"
}
```

**レスポンス**: `200 OK`
```json
{
  "id": "art-uuid-001",
  "status": "review",
  "reviews": [
    {
      "id": "rev-uuid-001",
      "reviewerId": "user-uuid-002",
      "status": "pending",
      "requestedAt": "2025-11-03T15:00:00.000Z"
    }
  ]
}
```

---

### 7. 記事公開 [Publish Article]

レビュー承認済みの記事を公開します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/publish
```

**権限**: `knowledge:publish`

**レスポンス**: `200 OK`
```json
{
  "id": "art-uuid-001",
  "status": "published",
  "metadata": {
    "publishedAt": "2025-11-03T16:00:00.000Z",
    "version": "1.0.0"
  }
}
```

**エラーレスポンス** (品質スコア不足):
```json
{
  "error": {
    "code": "KNOWLEDGE_004",
    "message": "Insufficient quality score",
    "details": "Quality score 2.8 is below the required minimum of 3.0",
    "httpStatus": 422
  }
}
```

**エラーレスポンス** (レビュー未承認):
```json
{
  "error": {
    "code": "KNOWLEDGE_003",
    "message": "No approved reviews",
    "details": "At least one approved review is required for publication",
    "httpStatus": 422
  }
}
```

---

### 8. 記事アーカイブ [Archive Article]

公開済み記事をアーカイブします。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/archive
```

**権限**: `knowledge:admin`

**リクエストボディ**:
```json
{
  "reason": "情報が古くなったため"
}
```

**レスポンス**: `200 OK`
```json
{
  "id": "art-uuid-001",
  "status": "archived",
  "metadata": {
    "archivedAt": "2025-11-03T17:00:00.000Z",
    "archiveReason": "情報が古くなったため"
  }
}
```

---

### 9. 記事バージョン履歴取得 [Get Version History]

記事のバージョン履歴を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/articles/{articleId}/versions
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK`
```json
{
  "articleId": "art-uuid-001",
  "versions": [
    {
      "version": "1.0.0",
      "title": "TypeScriptでのエラーハンドリングベストプラクティス",
      "author": "山田太郎",
      "publishedAt": "2025-11-03T11:00:00.000Z",
      "comment": "Initial publication"
    },
    {
      "version": "1.1.0",
      "title": "TypeScriptでのエラーハンドリングベストプラクティス (更新版)",
      "author": "山田太郎",
      "publishedAt": "2025-11-04T10:00:00.000Z",
      "comment": "最新のTypeScript 5.x系の機能を追加"
    }
  ]
}
```

---

### 10. 特定バージョン取得 [Get Specific Version]

記事の特定バージョンを取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/articles/{articleId}/versions/{version}
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK` (記事データと同じ構造)

---

### 11. 記事に「いいね」[Like Article]

記事に「いいね」を追加します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/like
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK`
```json
{
  "articleId": "art-uuid-001",
  "likeCount": 90,
  "liked": true
}
```

---

### 12. 記事の「いいね」解除 [Unlike Article]

記事の「いいね」を解除します。

**エンドポイント**:
```
DELETE /api/v1/bc-006/knowledge/articles/{articleId}/like
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK`
```json
{
  "articleId": "art-uuid-001",
  "likeCount": 89,
  "liked": false
}
```

---

## Category API {#category-api}

### 1. カテゴリ一覧取得 [List Categories]

カテゴリの階層構造を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/categories
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `includeHierarchy` (boolean, optional): 階層構造を含むか (default: true)
- `parentId` (string, optional): 親カテゴリID (指定された親の子カテゴリのみ取得)

**レスポンス**: `200 OK`
```json
{
  "categories": [
    {
      "id": "cat-uuid-001",
      "name": "技術",
      "description": "技術関連のナレッジ",
      "parentId": null,
      "level": 1,
      "order": 1,
      "articleCount": 245,
      "children": [
        {
          "id": "cat-uuid-002",
          "name": "プログラミング",
          "description": "プログラミング言語、フレームワーク",
          "parentId": "cat-uuid-001",
          "level": 2,
          "order": 1,
          "articleCount": 123,
          "children": [
            {
              "id": "cat-uuid-003",
              "name": "TypeScript",
              "description": "TypeScript関連",
              "parentId": "cat-uuid-002",
              "level": 3,
              "order": 1,
              "articleCount": 45,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

---

### 2. カテゴリ作成 [Create Category]

新しいカテゴリを作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/categories
```

**権限**: `knowledge:admin`

**リクエストボディ**:
```json
{
  "name": "React",
  "description": "React.js関連のナレッジ",
  "parentId": "cat-uuid-002",
  "order": 2
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "cat-uuid-004",
  "name": "React",
  "description": "React.js関連のナレッジ",
  "parentId": "cat-uuid-002",
  "level": 3,
  "order": 2,
  "path": "技術 > プログラミング > React",
  "createdAt": "2025-11-03T18:00:00.000Z"
}
```

---

### 3. カテゴリ更新 [Update Category]

カテゴリ情報を更新します。

**エンドポイント**:
```
PUT /api/v1/bc-006/knowledge/categories/{categoryId}
```

**権限**: `knowledge:admin`

**リクエストボディ**:
```json
{
  "name": "React & React Native",
  "description": "React.js および React Native関連のナレッジ",
  "order": 2
}
```

**レスポンス**: `200 OK`

---

### 4. カテゴリ削除 [Delete Category]

カテゴリを削除します。子カテゴリや記事が存在する場合はエラー。

**エンドポイント**:
```
DELETE /api/v1/bc-006/knowledge/categories/{categoryId}
```

**権限**: `knowledge:admin`

**レスポンス**: `204 No Content`

**エラーレスポンス** (子カテゴリ・記事が存在):
```json
{
  "error": {
    "code": "CATEGORY_001",
    "message": "Category has children or articles",
    "details": "Cannot delete category with 3 child categories and 45 articles"
  }
}
```

---

### 5. カテゴリの記事一覧 [List Articles in Category]

特定カテゴリの記事一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/categories/{categoryId}/articles
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `includeSubcategories` (boolean, optional): サブカテゴリの記事も含むか (default: false)
- `sort` (string, optional): ソート順
- `limit` (number, optional): 取得件数
- `offset` (number, optional): オフセット

**レスポンス**: `200 OK` (記事一覧と同じ構造)

---

### 6. カテゴリ階層移動 [Move Category]

カテゴリを別の親の下に移動します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/categories/{categoryId}/move
```

**権限**: `knowledge:admin`

**リクエストボディ**:
```json
{
  "newParentId": "cat-uuid-005",
  "newOrder": 3
}
```

**レスポンス**: `200 OK`

---

## Tag API {#tag-api}

### 1. タグ一覧取得 [List Tags]

全タグの一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/tags
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `sort` (string, optional): ソート (`name:asc`, `usageCount:desc`)
- `limit` (number, optional): 取得件数

**レスポンス**: `200 OK`
```json
{
  "tags": [
    {
      "id": "tag-uuid-001",
      "name": "typescript",
      "usageCount": 125,
      "createdAt": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": "tag-uuid-002",
      "name": "error-handling",
      "usageCount": 67,
      "createdAt": "2025-02-20T14:30:00.000Z"
    }
  ]
}
```

---

### 2. タグ作成 [Create Tag]

新しいタグを作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/tags
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "name": "react-hooks"
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "tag-uuid-003",
  "name": "react-hooks",
  "usageCount": 0,
  "createdAt": "2025-11-03T19:00:00.000Z"
}
```

---

### 3. タグ提案 [Suggest Tags]

記事内容からタグを提案します（AI/NLP使用）。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/tags/suggest
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "content": "TypeScriptでのエラーハンドリング...",
  "existingTags": ["typescript"]
}
```

**レスポンス**: `200 OK`
```json
{
  "suggestions": [
    {
      "name": "error-handling",
      "confidence": 0.92,
      "isExisting": true
    },
    {
      "name": "best-practices",
      "confidence": 0.87,
      "isExisting": true
    },
    {
      "name": "exception-management",
      "confidence": 0.65,
      "isExisting": false
    }
  ]
}
```

---

### 4. タグ削除 [Delete Tag]

タグを削除します（使用されていない場合のみ）。

**エンドポイント**:
```
DELETE /api/v1/bc-006/knowledge/tags/{tagId}
```

**権限**: `knowledge:admin`

**レスポンス**: `204 No Content`

---

## Best Practice API {#best-practice-api}

### 1. ベストプラクティス作成 [Create Best Practice]

新しいベストプラクティスを登録します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/best-practices
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "title": "マイクロサービス間の非同期通信パターン",
  "description": "イベント駆動アーキテクチャによる疎結合な設計",
  "context": {
    "industry": "金融",
    "projectType": "システム開発",
    "teamSize": "medium",
    "complexity": "high"
  },
  "applicableScenarios": [
    "大規模分散システム",
    "高可用性が要求されるシステム",
    "マイクロサービスアーキテクチャ"
  ],
  "evidences": [
    {
      "projectId": "proj-uuid-001",
      "metric": "システム稼働率",
      "before": "98.5%",
      "after": "99.9%",
      "improvement": "+1.4%"
    }
  ],
  "relatedArticles": ["art-uuid-010", "art-uuid-020"]
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "bp-uuid-001",
  "title": "マイクロサービス間の非同期通信パターン",
  "status": "draft",
  "authorId": "user-uuid-001",
  "createdAt": "2025-11-03T20:00:00.000Z"
}
```

---

### 2. ベストプラクティス取得 [Get Best Practice]

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/best-practices/{practiceId}
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK`
```json
{
  "id": "bp-uuid-001",
  "title": "マイクロサービス間の非同期通信パターン",
  "description": "イベント駆動アーキテクチャによる疎結合な設計",
  "status": "certified",
  "context": {
    "industry": "金融",
    "projectType": "システム開発",
    "teamSize": "medium",
    "complexity": "high"
  },
  "applicableScenarios": [
    "大規模分散システム",
    "高可用性が要求されるシステム",
    "マイクロサービスアーキテクチャ"
  ],
  "evidences": [
    {
      "projectId": "proj-uuid-001",
      "projectName": "次世代コアバンキング",
      "metric": "システム稼働率",
      "before": "98.5%",
      "after": "99.9%",
      "improvement": "+1.4%",
      "measuredAt": "2025-10-15T00:00:00.000Z"
    }
  ],
  "applicationCount": 15,
  "successRate": 0.93,
  "averageImpact": 0.85,
  "authorId": "user-uuid-001",
  "certifiedAt": "2025-11-01T10:00:00.000Z",
  "relatedArticles": [
    {
      "id": "art-uuid-010",
      "title": "イベント駆動アーキテクチャ入門"
    }
  ]
}
```

---

### 3. ベストプラクティス一覧取得 [List Best Practices]

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/best-practices
```

**権限**: `knowledge:read`

**クエリパラメータ**:
- `status` (string, optional): `draft`, `certified`, `deprecated`
- `industry` (string, optional): 業界フィルタ
- `complexity` (string, optional): 複雑度フィルタ
- `sort` (string, optional): ソート (`successRate:desc`, `applicationCount:desc`)

**レスポンス**: `200 OK` (一覧形式)

---

### 4. ベストプラクティス適用記録 [Record Application]

プロジェクトでベストプラクティスを適用したことを記録します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/best-practices/{practiceId}/applications
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "projectId": "proj-uuid-002",
  "appliedAt": "2025-11-01T00:00:00.000Z",
  "context": {
    "teamSize": "small",
    "duration": "3 months"
  },
  "notes": "適用時の工夫や変更点"
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "app-uuid-001",
  "practiceId": "bp-uuid-001",
  "projectId": "proj-uuid-002",
  "appliedBy": "user-uuid-001",
  "appliedAt": "2025-11-01T00:00:00.000Z",
  "status": "in_progress"
}
```

---

### 5. 適用結果報告 [Report Result]

ベストプラクティス適用の結果を報告します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/best-practices/{practiceId}/applications/{applicationId}/result
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "success": true,
  "metrics": [
    {
      "name": "開発速度",
      "before": "10 story points/sprint",
      "after": "15 story points/sprint",
      "improvement": "+50%"
    }
  ],
  "lessons": "チームの習熟期間が必要だった",
  "recommendations": "段階的な導入を推奨"
}
```

**レスポンス**: `200 OK`

---

### 6. ベストプラクティス認定申請 [Request Certification]

ベストプラクティスの認定を申請します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/best-practices/{practiceId}/request-certification
```

**権限**: `knowledge:write`

**リクエストボディ**:
```json
{
  "reviewers": ["user-uuid-005", "user-uuid-006"],
  "message": "3件の成功事例と効果測定データを添付しました"
}
```

**レスポンス**: `200 OK`

---

### 7. ベストプラクティス検索 [Search Best Practices]

コンテキストに合ったベストプラクティスを検索します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/best-practices/search
```

**権限**: `knowledge:read`

**リクエストボディ**:
```json
{
  "context": {
    "industry": "金融",
    "projectType": "システム開発",
    "teamSize": "medium",
    "complexity": "high"
  },
  "scenario": "マイクロサービスアーキテクチャ"
}
```

**レスポンス**: `200 OK`
```json
{
  "results": [
    {
      "id": "bp-uuid-001",
      "title": "マイクロサービス間の非同期通信パターン",
      "matchScore": 0.95,
      "relevanceReason": "業界、プロジェクト種別、複雑度が完全一致"
    }
  ]
}
```

---

### 8. ベストプラクティス更新 [Update Best Practice]

**エンドポイント**:
```
PUT /api/v1/bc-006/knowledge/best-practices/{practiceId}
```

**権限**: `knowledge:write` (自分のもの) / `knowledge:admin`

**レスポンス**: `200 OK`

---

## Review API {#review-api}

### 1. レビュー作成 [Create Review]

記事のレビューを作成します。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/reviews
```

**権限**: `knowledge:review`

**リクエストボディ**:
```json
{
  "accuracyRating": 4.5,
  "completenessRating": 4.0,
  "usefulnessRating": 4.8,
  "clarityRating": 4.3,
  "decision": "approved",
  "comments": "非常に有用な内容です。いくつかの補足を追加することをお勧めします。",
  "suggestions": [
    "具体的なコード例をもう1つ追加",
    "参考文献のリンクを追加"
  ]
}
```

**レスポンス**: `201 Created`
```json
{
  "id": "rev-uuid-001",
  "articleId": "art-uuid-001",
  "reviewerId": "user-uuid-002",
  "reviewerName": "佐藤花子",
  "decision": "approved",
  "ratings": {
    "accuracy": 4.5,
    "completeness": 4.0,
    "usefulness": 4.8,
    "clarity": 4.3,
    "overall": 4.4
  },
  "comments": "非常に有用な内容です。いくつかの補足を追加することをお勧めします。",
  "suggestions": [
    "具体的なコード例をもう1つ追加",
    "参考文献のリンクを追加"
  ],
  "createdAt": "2025-11-03T21:00:00.000Z"
}
```

---

### 2. レビュー更新 [Update Review]

自分のレビューを更新します。

**エンドポイント**:
```
PUT /api/v1/bc-006/knowledge/articles/{articleId}/reviews/{reviewId}
```

**権限**: `knowledge:review` (自分のレビューのみ)

**レスポンス**: `200 OK`

---

### 3. レビュー一覧取得 [List Reviews]

記事のレビュー一覧を取得します。

**エンドポイント**:
```
GET /api/v1/bc-006/knowledge/articles/{articleId}/reviews
```

**権限**: `knowledge:read`

**レスポンス**: `200 OK`
```json
{
  "reviews": [
    {
      "id": "rev-uuid-001",
      "reviewerId": "user-uuid-002",
      "reviewerName": "佐藤花子",
      "decision": "approved",
      "ratings": {
        "overall": 4.4
      },
      "createdAt": "2025-11-03T21:00:00.000Z"
    }
  ],
  "summary": {
    "totalReviews": 3,
    "approvedCount": 2,
    "rejectedCount": 0,
    "pendingCount": 1,
    "averageRating": 4.3
  }
}
```

---

### 4. レビュー承認 [Approve Review]

レビューを承認します (管理者のみ)。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/reviews/{reviewId}/approve
```

**権限**: `knowledge:admin`

**レスポンス**: `200 OK`

---

### 5. レビュー却下 [Reject Review]

レビューを却下します (管理者のみ)。

**エンドポイント**:
```
POST /api/v1/bc-006/knowledge/articles/{articleId}/reviews/{reviewId}/reject
```

**権限**: `knowledge:admin`

**リクエストボディ**:
```json
{
  "reason": "基準を満たしていません"
}
```

**レスポンス**: `200 OK`

---

### 6. レビュー削除 [Delete Review]

レビューを削除します。

**エンドポイント**:
```
DELETE /api/v1/bc-006/knowledge/articles/{articleId}/reviews/{reviewId}
```

**権限**: `knowledge:review` (自分のレビュー) / `knowledge:admin`

**レスポンス**: `204 No Content`

---

## データスキーマ {#data-schemas}

### KnowledgeArticle Schema

```typescript
interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown format
  status: 'draft' | 'review' | 'published' | 'archived';
  categoryId: string;
  category?: Category;
  authorId: string;
  author?: User;
  tags: string[];
  attachments: Attachment[];
  qualityScore: QualityScore;
  viewCount: number;
  likeCount: number;
  metadata: ArticleMetadata;
  versions?: ArticleVersion[];
  reviews?: Review[];
}

interface QualityScore {
  accuracy: number; // 0.0 - 5.0
  completeness: number; // 0.0 - 5.0
  usefulness: number; // 0.0 - 5.0
  clarity: number; // 0.0 - 5.0
  overall: number; // 0.0 - 5.0
}

interface ArticleMetadata {
  createdAt: string; // ISO 8601
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
  version: string; // Semantic versioning
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number; // bytes
}
```

---

### Category Schema

```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  level: number; // 1-5
  order: number;
  path: string; // e.g., "技術 > プログラミング > TypeScript"
  articleCount: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}
```

---

### BestPractice Schema

```typescript
interface BestPractice {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'certified' | 'deprecated';
  context: PracticeContext;
  applicableScenarios: string[];
  evidences: Evidence[];
  applicationCount: number;
  successRate: number; // 0.0 - 1.0
  averageImpact: number; // 0.0 - 1.0
  authorId: string;
  certifiedAt?: string;
  relatedArticles: string[];
  createdAt: string;
  updatedAt: string;
}

interface PracticeContext {
  industry: string;
  projectType: string;
  teamSize: 'small' | 'medium' | 'large';
  complexity: 'low' | 'medium' | 'high';
}

interface Evidence {
  projectId: string;
  projectName?: string;
  metric: string;
  before: string;
  after: string;
  improvement: string;
  measuredAt: string;
}
```

---

### Review Schema

```typescript
interface Review {
  id: string;
  articleId: string;
  reviewerId: string;
  reviewerName?: string;
  decision: 'pending' | 'approved' | 'rejected';
  ratings: {
    accuracy: number;
    completeness: number;
    usefulness: number;
    clarity: number;
    overall: number;
  };
  comments: string;
  suggestions: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 使用例 {#usage-examples}

### 例1: 記事作成から公開までのフロー

```typescript
// 1. 下書き作成
const createResponse = await fetch('/api/v1/bc-006/knowledge/articles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'React Hooks実践ガイド',
    summary: 'React Hooksの効果的な使い方',
    content: '# React Hooks\n\n...',
    categoryId: 'cat-uuid-002',
    tags: ['react', 'hooks', 'frontend']
  })
});

const article = await createResponse.json();
const articleId = article.id;

// 2. レビュー申請
await fetch(`/api/v1/bc-006/knowledge/articles/${articleId}/request-publication`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reviewers: ['reviewer-uuid-001'],
    message: 'レビューをお願いします'
  })
});

// 3. レビュワーがレビュー作成
await fetch(`/api/v1/bc-006/knowledge/articles/${articleId}/reviews`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${reviewerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    accuracyRating: 4.5,
    completenessRating: 4.0,
    usefulnessRating: 4.5,
    clarityRating: 4.2,
    decision: 'approved',
    comments: 'Good article!'
  })
});

// 4. 公開
await fetch(`/api/v1/bc-006/knowledge/articles/${articleId}/publish`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 例2: カテゴリ階層構築

```typescript
// ルートカテゴリ作成
const techCategory = await createCategory({
  name: '技術',
  description: '技術関連のナレッジ'
});

// サブカテゴリ作成
const programmingCategory = await createCategory({
  name: 'プログラミング',
  parentId: techCategory.id
});

const typescriptCategory = await createCategory({
  name: 'TypeScript',
  parentId: programmingCategory.id
});

async function createCategory(data: any) {
  const response = await fetch('/api/v1/bc-006/knowledge/categories', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

---

### 例3: ベストプラクティス適用と結果報告

```typescript
// ベストプラクティス適用記録
const applicationResponse = await fetch(
  `/api/v1/bc-006/knowledge/best-practices/${practiceId}/applications`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      projectId: 'proj-uuid-002',
      appliedAt: new Date().toISOString(),
      notes: 'チーム規模に合わせて調整'
    })
  }
);

const application = await applicationResponse.json();

// プロジェクト完了後、結果報告
await fetch(
  `/api/v1/bc-006/knowledge/best-practices/${practiceId}/applications/${application.id}/result`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      metrics: [
        {
          name: '開発速度',
          before: '10 SP/sprint',
          after: '15 SP/sprint',
          improvement: '+50%'
        }
      ],
      lessons: 'チームの習熟に2週間必要だった'
    })
  }
);
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 ナレッジ管理API詳細化
