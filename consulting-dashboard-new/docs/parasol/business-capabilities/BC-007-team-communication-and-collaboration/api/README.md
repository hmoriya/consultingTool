# BC-007: API層設計 [API Layer Design]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/collaboration-facilitation-service/api/

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

BC-007のAPI層は、チームコミュニケーションとコラボレーション機能をRESTful APIおよびWebSocket APIとして提供します。

### 設計原則

- **RESTful設計**: リソース指向の設計
- **リアルタイム対応**: WebSocketによるリアルタイム通信
- **統一インターフェース**: 一貫したAPI規約
- **ステートレス**: サーバー側でセッション状態を持たない
- **階層化**: API Gateway → Application Services → Domain Services
- **セキュリティファースト**: 全てのエンドポイントで認証・認可を実施

### API仕様標準

- **フォーマット**: OpenAPI 3.0準拠
- **データ形式**: JSON (application/json)
- **文字エンコーディング**: UTF-8
- **日時形式**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
- **ページング**: Cursor-based pagination（リアルタイムデータ）
- **フィルタリング**: Query parameters
- **ソート**: `?sort=field:asc|desc`
- **WebSocket**: Socket.IO / native WebSocket

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
│        BC-007 API Controllers               │
│  - Messaging API Controllers                │
│  - Notification API Controllers             │
│  - Meeting API Controllers                  │
│  - Collaboration API Controllers            │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        Application Services                 │
│  - Messaging Application Service            │
│  - Notification Application Service         │
│  - Meeting Application Service              │
│  - Collaboration Application Service        │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│        Domain Services                      │
│  - Message Routing Service                  │
│  - Notification Delivery Service            │
│  - Meeting Scheduling Service               │
│  - Workspace Integration Service            │
└─────────────────────────────────────────────┘
```

### リアルタイム通信アーキテクチャ

```
┌─────────────┐        WebSocket        ┌─────────────┐
│   Client    │ ←─────────────────────→ │  WebSocket  │
│  (Browser)  │                          │   Gateway   │
└─────────────┘                          └─────────────┘
                                                ↓
                                         ┌─────────────┐
                                         │    Redis    │
                                         │   Pub/Sub   │
                                         └─────────────┘
                                                ↓
                                         ┌─────────────┐
                                         │  Backend    │
                                         │  Services   │
                                         └─────────────┘
```

### APIバージョニング

BC-007は複数のバージョンを同時にサポートします：

```
/api/v1/bc-007/messages              # Version 1 (Current)
/api/v2/bc-007/messages              # Version 2 (Future)
```

**バージョン管理ポリシー**:
- メジャーバージョン: 破壊的変更
- マイナーバージョン: 後方互換性のある機能追加
- パッチバージョン: バグフィックス
- 旧バージョンは最低6ヶ月サポート

---

## API一覧 {#api-list}

BC-007は4つの主要APIグループで構成されます：

### 1. Messaging API [メッセージングAPI]

リアルタイムメッセージング、チャネル管理、スレッド機能

**エンドポイント数**: 32
**詳細**: [messaging-api.md](messaging-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-007/channels
GET    /api/v1/bc-007/channels/{channelId}
POST   /api/v1/bc-007/channels/{channelId}/messages
GET    /api/v1/bc-007/channels/{channelId}/messages
POST   /api/v1/bc-007/messages/{messageId}/replies
PUT    /api/v1/bc-007/messages/{messageId}
DELETE /api/v1/bc-007/messages/{messageId}
POST   /api/v1/bc-007/messages/{messageId}/reactions
POST   /api/v1/bc-007/direct-messages
GET    /api/v1/bc-007/direct-messages/{conversationId}/messages
```

---

### 2. Notification API [通知API]

優先度別通知配信、マルチチャネル通知、通知設定

**エンドポイント数**: 18
**詳細**: [notification-api.md](notification-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-007/notifications
GET    /api/v1/bc-007/notifications/{notificationId}
GET    /api/v1/bc-007/notifications/unread
PUT    /api/v1/bc-007/notifications/{notificationId}/read
PUT    /api/v1/bc-007/notifications/mark-all-read
POST   /api/v1/bc-007/notifications/urgent
GET    /api/v1/bc-007/notification-preferences
PUT    /api/v1/bc-007/notification-preferences
POST   /api/v1/bc-007/notifications/scheduled
```

---

### 3. Meeting API [会議管理API]

会議スケジューリング、オンライン会議統合、議事録管理

**エンドポイント数**: 26
**詳細**: [meeting-api.md](meeting-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-007/meetings
GET    /api/v1/bc-007/meetings/{meetingId}
PUT    /api/v1/bc-007/meetings/{meetingId}
DELETE /api/v1/bc-007/meetings/{meetingId}
POST   /api/v1/bc-007/meetings/{meetingId}/invite
POST   /api/v1/bc-007/meetings/{meetingId}/accept
POST   /api/v1/bc-007/meetings/{meetingId}/start
POST   /api/v1/bc-007/meetings/{meetingId}/complete
POST   /api/v1/bc-007/meetings/{meetingId}/minutes
GET    /api/v1/bc-007/meetings/available-slots
```

---

### 4. Collaboration API [コラボレーションAPI]

ワークスペース管理、ドキュメント共有、リアルタイム共同編集

**エンドポイント数**: 24
**詳細**: [collaboration-api.md](collaboration-api.md)

**主要エンドポイント**:
```
POST   /api/v1/bc-007/workspaces
GET    /api/v1/bc-007/workspaces/{workspaceId}
POST   /api/v1/bc-007/workspaces/{workspaceId}/members
POST   /api/v1/bc-007/workspaces/{workspaceId}/documents
GET    /api/v1/bc-007/workspaces/{workspaceId}/documents/{documentId}
PUT    /api/v1/bc-007/documents/{documentId}
DELETE /api/v1/bc-007/documents/{documentId}
POST   /api/v1/bc-007/documents/{documentId}/comments
GET    /api/v1/bc-007/workspaces/{workspaceId}/activity
```

---

## 認証・認可 {#authentication}

### 認証方式

BC-007は**JWT (JSON Web Token)** ベースの認証を使用します（BC-003経由）：

```http
Authorization: Bearer <JWT_TOKEN>
```

**トークン構造**:
```json
{
  "sub": "user-uuid",                             // UUID
  "email": "user@example.com",                    // EMAIL
  "roles": ["team_member", "workspace_admin"],    // ARRAY<STRING_50>
  "permissions": ["message:send", "workspace:manage", "meeting:schedule"],  // ARRAY<STRING_50>
  "iat": 1699000000,                              // INTEGER (Unix timestamp)
  "exp": 1699003600                               // INTEGER (Unix timestamp)
}
```

### 認可モデル

BC-007は**RBAC (Role-Based Access Control)** を実装：

| ロール | 説明 | 主要権限 |
|--------|------|------------|
| **workspace_owner** | ワークスペース所有者 | 全ワークスペース操作、メンバー管理 |
| **workspace_admin** | ワークスペース管理者 | メンバー追加・削除、ドキュメント管理 |
| **workspace_editor** | 編集者 | ドキュメント編集、メッセージ送信 |
| **workspace_viewer** | 閲覧者 | コンテンツ閲覧のみ |
| **meeting_organizer** | 会議主催者 | 会議作成・編集・キャンセル |
| **channel_owner** | チャネルオーナー | チャネル管理、メンバー管理 |

**権限チェック例**:
```typescript
// Message send permission
@RequirePermissions(['message:send'])
async sendMessage(channelId: string, content: string): Promise<void> {
  // Implementation
}

// Meeting schedule permission
@RequirePermissions(['meeting:schedule'])
async scheduleMeeting(details: MeetingDetails): Promise<void> {
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
    "code": "COLLAB_001",
    "message": "Message not found",
    "details": "Message with ID 'abc123' does not exist",
    "timestamp": "2025-11-03T12:00:00.000Z",
    "path": "/api/v1/bc-007/messages/abc123",
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
| 409 | Conflict | リソース競合 |
| 422 | Unprocessable Entity | ビジネスルール違反 |
| 429 | Too Many Requests | レート制限超過 |
| 500 | Internal Server Error | サーバーエラー |
| 503 | Service Unavailable | サービス一時停止 |

### BC-007固有エラーコード

| コード | メッセージ | HTTPステータス |
|--------|-----------|---------------|
| COLLAB_001 | Message not found | 404 |
| COLLAB_002 | Channel not found | 404 |
| COLLAB_003 | User not channel member | 403 |
| COLLAB_004 | Cannot edit deleted message | 422 |
| COLLAB_005 | Meeting not found | 404 |
| COLLAB_006 | Meeting time conflict | 409 |
| COLLAB_007 | Workspace not found | 404 |
| COLLAB_008 | Document not found | 404 |
| COLLAB_009 | Insufficient permission | 403 |
| COLLAB_010 | Notification delivery failed | 500 |

---

## レート制限 {#rate-limiting}

### 制限ポリシー

BC-007は以下のレート制限を適用：

| API種別 | 制限 | ウィンドウ |
|---------|------|-----------|
| メッセージ送信 | 30 requests | 1分 |
| 通知送信 | 100 requests | 1分 |
| 会議作成 | 10 requests | 1分 |
| ドキュメントアップロード | 20 requests | 1分 |
| WebSocket接続 | 5 connections | per user |
| その他 | 60 requests | 1分 |

### レスポンスヘッダー

```http
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
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

**プロジェクトワークスペース自動作成**:
```
POST /api/v1/bc-007/integration/create-workspace-from-project
```

**リクエスト**:
```json
{
  "projectId": "proj-uuid",                       // UUID
  "projectName": "Project Alpha",                 // STRING_200
  "managerId": "user-uuid",                       // UUID
  "teamMemberIds": ["user1-uuid", "user2-uuid"]   // ARRAY<UUID>
}
```

**レスポンス**:
```json
{
  "workspaceId": "ws-uuid",                       // UUID
  "name": "Project Alpha Workspace",              // STRING_200
  "defaultChannels": [
    {"id": "ch1-uuid", "name": "general"},        // id: UUID, name: STRING_100
    {"id": "ch2-uuid", "name": "tech"}            // id: UUID, name: STRING_100
  ]
}
```

---

### BC-003 (Access Control) との連携

**ユーザー認証・認可**: BC-003のJWTトークンを使用

**権限検証エンドポイント**:
```
POST /api/v1/bc-003/auth/verify-permissions
Body: { userId, resource: "workspace:ws-123", action: "manage" }
```

---

### BC-005 (Team & Resource) との連携

**チームメンバー情報取得**:
```
GET /api/v1/bc-005/teams/{teamId}/members
```

**チームからのワークスペース作成**: チーム情報でワークスペース自動生成

---

### BC-006 (Knowledge Management) との連携

**ナレッジ共有通知**:
```
POST /api/v1/bc-007/notifications
Body: {
  type: "knowledge_shared",
  priority: "normal",
  recipients: ["user1-uuid"],
  data: { articleId: "article-uuid", title: "..." }
}
```

---

## 詳細ドキュメント {#detailed-docs}

BC-007 API層の詳細は以下のドキュメントを参照してください：

1. **[messaging-api.md](messaging-api.md)** - メッセージングAPI
   - Channel API (CRUD, Member Management)
   - Message API (Send, Edit, Delete, Thread, Reaction)
   - Direct Message API
   - リクエスト・レスポンススキーマ
   - WebSocket Events
   - 使用例

2. **[notification-api.md](notification-api.md)** - 通知API
   - Notification API (Create, Read, Mark as Read)
   - Notification Preferences API
   - Scheduled Notification API
   - リクエスト・レスポンススキーマ
   - 使用例

3. **[meeting-api.md](meeting-api.md)** - 会議管理API
   - Meeting API (CRUD, Schedule, Cancel)
   - Participant API (Invite, Accept, Decline)
   - Meeting Minutes API
   - Available Slots API
   - リクエスト・レスポンススキーマ
   - 使用例

4. **[collaboration-api.md](collaboration-api.md)** - コラボレーションAPI
   - Workspace API (CRUD, Member Management)
   - Document API (Upload, Share, Edit, Delete)
   - Comment API
   - Activity Feed API
   - リクエスト・レスポンススキーマ
   - 使用例

---

## パフォーマンス要件

### レスポンスタイム目標

| API種別 | P50 | P95 | P99 |
|---------|-----|-----|-----|
| メッセージ送信 | <100ms | <300ms | <500ms |
| 通知配信 | <200ms | <500ms | <1s |
| 会議作成 | <300ms | <800ms | <2s |
| ドキュメントアップロード | <500ms | <2s | <5s |
| WebSocket配信 | <50ms | <100ms | <200ms |

### スループット

- メッセージ送信: 1000 msg/s
- 通知配信: 5000 notifications/s
- WebSocket接続: 10000 concurrent connections

### キャッシュ戦略

```
# キャッシュ可能なリソース
GET /api/v1/bc-007/channels/{id}
Cache-Control: private, max-age=60

GET /api/v1/bc-007/workspaces/{id}
Cache-Control: private, max-age=300

# キャッシュ不可
POST /api/v1/bc-007/messages
Cache-Control: no-store

WebSocket messages
Cache-Control: no-store
```

---

## セキュリティ

### HTTPS必須

全てのAPIエンドポイントはHTTPS経由のみアクセス可能：
```
https://api.example.com/api/v1/bc-007/...
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
- ファイルアップロード制限（サイズ・形式）

### WebSocketセキュリティ

- JWT認証必須
- Origin検証
- メッセージサイズ制限
- 接続数制限

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 API層詳細化
