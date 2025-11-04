# BC-006: API層設計 [API Layer Design]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/api/

---

## 目次

1. [概要](#overview)
2. [APIアーキテクチャ](#architecture)
3. [API一覧](#api-list)
4. [認証・認可](#authentication)
5. [エラーハンドリング](#error-handling)
6. [レート制限](#rate-limiting)
7. [BC間連携](#inter-bc-integration)
8. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-006のAPI層は、ナレッジ管理と組織学習機能をRESTful APIとして提供します。全てのAPIはJSON形式でデータをやり取りし、標準的なHTTPメソッドとステータスコードを使用します。

### 設計原則

- **RESTful設計**: リソース指向の設計
- **統一インターフェース**: 一貫したAPI規約
- **ステートレス**: サーバー側でセッション状態を持たない
- **キャッシュ可能**: 適切なキャッシュヘッダーの設定
- **階層化**: API Gateway → Application Services → Domain Services
- **セキュリティファースト**: 全てのエンドポイントで認証・認可を実施

### API仕様標準

- **フォーマット**: OpenAPI 3.0準拠
- **データ形式**: JSON (application/json)
- **文字エンコーディング**: UTF-8
- **日時形式**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- **ページング**: Offset-based pagination
- **フィルタリング**: Query parameters
- **ソート**: `?sort=field:asc|desc`

---

## APIアーキテクチャ {#architecture}

### レイヤー構成

```
┌─────────────────────────────────────────────┐
│         API Gateway (Kong/AWS API GW)       │
│  - Authentication & Authorization           │
│  - Rate Limiting & Throttling               │
│  - Request/Response Logging                 │
│  - CORS Handling                            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        BC-006 API Controllers               │
│  - Knowledge API Controllers                │
│  - Learning API Controllers                 │
│  - Search & Discovery Controllers           │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        Application Services                 │
│  - Knowledge Application Service            │
│  - Learning Application Service             │
│  - Integration Orchestration                │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        Domain Services                      │
│  - Knowledge Capture Service                │
│  - Knowledge Discovery Service              │
│  - Learning Path Designer                   │
│  - Quality Assessor                         │
└─────────────────────────────────────────────┘
```

### APIバージョニング

BC-006は複数のバージョンを同時にサポートします：

```
/api/v1/bc-006/knowledge/articles      # Version 1 (Current)
/api/v2/bc-006/knowledge/articles      # Version 2 (Future)
```

**バージョン管理ポリシー**:
- メジャーバージョン: 破壊的変更
- マイナーバージョン: 後方互換性のある機能追加
- パッチバージョン: バグフィックス
- 旧バージョンは最低6ヶ月サポート

---

## API一覧 {#api-list}

BC-006は3つの主要APIグループで構成されます：

### 1. Knowledge Management API [ナレッジ管理API]

ナレッジ記事、カテゴリ、ベストプラクティスの管理

**エンドポイント数**: 28
**詳細**: [knowledge-api.md](knowledge-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-006/knowledge/articles
GET    /api/v1/bc-006/knowledge/articles/{articleId}
PUT    /api/v1/bc-006/knowledge/articles/{articleId}
DELETE /api/v1/bc-006/knowledge/articles/{articleId}
GET    /api/v1/bc-006/knowledge/articles
POST   /api/v1/bc-006/knowledge/articles/{articleId}/publish
POST   /api/v1/bc-006/knowledge/articles/{articleId}/reviews
GET    /api/v1/bc-006/knowledge/categories
POST   /api/v1/bc-006/knowledge/categories
GET    /api/v1/bc-006/knowledge/best-practices
POST   /api/v1/bc-006/knowledge/best-practices
```

---

### 2. Learning System API [学習システムAPI]

学習コース、進捗管理、証明書発行

**エンドポイント数**: 24
**詳細**: [learning-api.md](learning-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-006/learning/courses
GET    /api/v1/bc-006/learning/courses/{courseId}
POST   /api/v1/bc-006/learning/courses/{courseId}/enroll
GET    /api/v1/bc-006/learning/progress/{progressId}
POST   /api/v1/bc-006/learning/progress/{progressId}/modules/{moduleId}/complete
POST   /api/v1/bc-006/learning/progress/{progressId}/assessments/{assessmentId}/submit
GET    /api/v1/bc-006/learning/certifications/{certificationId}
POST   /api/v1/bc-006/learning/paths
GET    /api/v1/bc-006/learning/paths/{pathId}
```

---

### 3. Search & Discovery API [検索・発見API]

ナレッジ検索、推奨、ギャップ分析

**エンドポイント数**: 12
**詳細**: [search-discovery-api.md](search-discovery-api.md)

**主要エンドポイント**:
```
GET    /api/v1/bc-006/search/knowledge?q={query}
GET    /api/v1/bc-006/search/related/{articleId}
GET    /api/v1/bc-006/recommend/knowledge
GET    /api/v1/bc-006/recommend/courses
POST   /api/v1/bc-006/analyze/knowledge-gaps
POST   /api/v1/bc-006/track/usage
```

---

## 認証・認可 {#authentication}

### 認証方式

BC-006は**JWT (JSON Web Token)** ベースの認証を使用します（BC-003経由）：

```http
Authorization: Bearer <JWT_TOKEN>
```

**トークン構造**:
```json
{
  "sub": "user-uuid",                             // UUID
  "email": "user@example.com",                    // EMAIL
  "roles": ["knowledge_author", "learner"],       // ARRAY<STRING_50>
  "permissions": ["knowledge:read", "knowledge:write", "learning:enroll"],  // ARRAY<STRING_50>
  "iat": 1699000000,                              // INTEGER (Unix timestamp)
  "exp": 1699003600                               // INTEGER (Unix timestamp)
}
```

### 認可モデル

BC-006は**RBAC (Role-Based Access Control)** を実装：

| ロール | 説明 | 主要権限 |
|--------|------|----------|
| **knowledge_admin** | ナレッジ管理者 | 全ナレッジ操作、カテゴリ管理、レビュー承認 |
| **knowledge_author** | ナレッジ著者 | 記事作成・編集・公開申請 |
| **knowledge_reviewer** | レビュワー | 記事レビュー、承認・却下 |
| **learner** | 学習者 | コース閲覧・登録、進捗記録 |
| **course_instructor** | コース講師 | コース作成・管理、評価設定 |
| **learning_admin** | 学習管理者 | 全コース操作、証明書発行 |

**権限チェック例**:
```typescript
// Knowledge article publication
@RequirePermissions(['knowledge:publish'])
async publishArticle(articleId: string): Promise<void> {
  // Implementation
}

// Course enrollment
@RequirePermissions(['learning:enroll'])
async enrollCourse(courseId: string): Promise<void> {
  // Implementation
}
```

---

## エラーハンドリング {#error-handling}

### 標準エラーレスポンス

全てのエラーは統一フォーマットで返却：

```json
{
  "error": {
    "code": "KNOWLEDGE_001",
    "message": "Article not found",
    "details": "Article with ID 'abc123' does not exist",
    "timestamp": "2025-11-03T12:00:00.000Z",
    "path": "/api/v1/bc-006/knowledge/articles/abc123",
    "requestId": "req-xyz789"
  }
}
```

### HTTPステータスコード

| コード | 説明 | 使用例 |
|--------|------|--------|
| 200 | OK | 成功（GET, PUT） |
| 201 | Created | リソース作成成功（POST） |
| 204 | No Content | 成功、レスポンスボディなし（DELETE） |
| 400 | Bad Request | リクエストパラメータ不正 |
| 401 | Unauthorized | 認証失敗 |
| 403 | Forbidden | 権限不足 |
| 404 | Not Found | リソースが存在しない |
| 409 | Conflict | リソース競合（重複作成など） |
| 422 | Unprocessable Entity | ビジネスルール違反 |
| 429 | Too Many Requests | レート制限超過 |
| 500 | Internal Server Error | サーバーエラー |
| 503 | Service Unavailable | サービス一時停止 |

### BC-006固有エラーコード

| コード | メッセージ | HTTPステータス |
|--------|-----------|---------------|
| KNOWLEDGE_001 | Article not found | 404 |
| KNOWLEDGE_002 | Article already published | 409 |
| KNOWLEDGE_003 | No approved reviews | 422 |
| KNOWLEDGE_004 | Insufficient quality score | 422 |
| LEARNING_001 | Course not found | 404 |
| LEARNING_002 | Already enrolled | 409 |
| LEARNING_003 | Prerequisites not met | 422 |
| LEARNING_004 | Assessment attempts exceeded | 422 |
| LEARNING_005 | Course not completed | 422 |

---

## レート制限 {#rate-limiting}

### 制限ポリシー

BC-006は以下のレート制限を適用：

| API種別 | 制限 | ウィンドウ |
|---------|------|-----------|
| 検索API | 100 requests | 1分 |
| 記事作成・更新 | 20 requests | 1分 |
| コース登録 | 10 requests | 1分 |
| 評価提出 | 5 requests | 1分 |
| その他 | 60 requests | 1分 |

### レスポンスヘッダー

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699000060
```

### レート制限超過時のレスポンス

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": "You have exceeded the rate limit. Please try again later.",
    "retryAfter": 30
  }
}
```

---

## BC間連携 {#inter-bc-integration}

### BC-001 (Project Delivery) との連携

**プロジェクトからのナレッジ抽出**:
```
POST /api/v1/bc-006/integration/extract-from-project
```

**リクエスト**:
```json
{
  "projectId": "proj-uuid",                       // UUID
  "includeDocuments": true,                       // BOOLEAN
  "includeDeliverables": true,                    // BOOLEAN
  "includeMeetings": true                         // BOOLEAN
}
```

**レスポンス**:
```json
{
  "extractedKnowledge": [
    {
      "title": "Extracted knowledge title",      // STRING_200
      "content": "...",                           // TEXT
      "importance": 0.85,                         // DECIMAL
      "suggestedCategory": "category-uuid"        // UUID
    }
  ],
  "bestPractices": [
    {
      "title": "Best practice title",             // STRING_200
      "description": "...",                       // TEXT
      "impact": 0.92                              // DECIMAL
    }
  ]
}
```

---

### BC-003 (Access Control) との連携

**ユーザー認証・認可**: BC-003のJWTトークンを使用

**権限検証エンドポイント**:
```
POST /api/v1/bc-003/auth/verify-permissions
Body: { userId, resource: "knowledge:article:123", action: "publish" }
```

---

### BC-005 (Team & Resource) との連携

**スキルプロファイル取得**:
```
GET /api/v1/bc-005/team/members/{userId}/skills
```

**学習推奨への活用**: スキルギャップ分析でBC-005のスキルデータを使用

---

### BC-007 (Communication) との連携

**通知送信**:
```
POST /api/v1/bc-007/notifications/send
Body: {
  "userId": "user-uuid",
  "type": "knowledge_published",
  "data": { "articleId": "article-uuid", "title": "..." }
}
```

---

## 詳細ドキュメント {#detailed-docs}

BC-006 API層の詳細は以下のドキュメントを参照してください：

1. **[knowledge-api.md](knowledge-api.md)** - ナレッジ管理API
   - Knowledge Article API (CRUD, Publish, Review)
   - Category API
   - Tag API
   - Best Practice API
   - リクエスト・レスポンススキーマ
   - 使用例

2. **[learning-api.md](learning-api.md)** - 学習システムAPI
   - Learning Course API (CRUD, Publish)
   - Enrollment API
   - Progress Tracking API
   - Assessment API
   - Certification API
   - Learning Path API
   - リクエスト・レスポンススキーマ
   - 使用例

3. **[search-discovery-api.md](search-discovery-api.md)** - 検索・発見API
   - Knowledge Search API
   - Related Knowledge API
   - Recommendation API
   - Knowledge Gap Analysis API
   - Usage Tracking API
   - リクエスト・レスポンススキーマ
   - 使用例

---

## パフォーマンス要件

### レスポンスタイム目標

| API種別 | P50 | P95 | P99 |
|---------|-----|-----|-----|
| 検索API | <200ms | <500ms | <1s |
| CRUD操作 | <100ms | <300ms | <500ms |
| 推奨API | <300ms | <800ms | <2s |
| 分析API | <500ms | <2s | <5s |

### スループット

- 検索API: 1000 req/s
- CRUD操作: 500 req/s
- 推奨API: 200 req/s

### キャッシュ戦略

```
# キャッシュ可能なリソース
GET /api/v1/bc-006/knowledge/articles/{id}
Cache-Control: public, max-age=300

GET /api/v1/bc-006/knowledge/categories
Cache-Control: public, max-age=3600

GET /api/v1/bc-006/learning/courses/{id}
Cache-Control: public, max-age=600

# キャッシュ不可
POST /api/v1/bc-006/knowledge/articles
Cache-Control: no-store

GET /api/v1/bc-006/search/knowledge
Cache-Control: private, max-age=60
```

---

## セキュリティ

### HTTPS必須

全てのAPIエンドポイントはHTTPS経由のみアクセス可能：
```
https://api.example.com/api/v1/bc-006/...
```

### CORS設定

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

### 入力検証

- 全てのリクエストパラメータをバリデーション
- SQLインジェクション対策
- XSS対策（サニタイズ）
- CSRF対策（トークン検証）

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 API層詳細化
