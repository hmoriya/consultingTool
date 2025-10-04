# API仕様: コラボレーション促進サービス

**バージョン**: v1.0.0
**更新日**: 2025-10-01
**ベースURL**: `https://api.example.com/v1/collaboration`

## API概要

**目的**: チーム内外のコラボレーションを促進し、リアルタイムコミュニケーション、ドキュメント共有、会議管理を実現するためのRESTful APIおよびWebSocket APIを提供する。

**主要機能**:
- ワークスペース・チャネル管理
- リアルタイムメッセージング
- ドキュメント共同編集
- 会議スケジューリング・実施
- 通知配信

## 認証

**認証方式**: JWT Bearer Token
**ヘッダー**: `Authorization: Bearer {jwt_token}`

### 認証フロー
1. セキュアアクセスサービスの認証APIでJWTトークンを取得
2. 全てのAPIリクエストのAuthorizationヘッダーに含める
3. トークンの有効期限は24時間

## 共通仕様

### リクエストヘッダー
```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
X-Request-ID: {uuid} (optional - リクエストトレーシング用)
```

### レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-10-01T00:00:00Z"
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  },
  "timestamp": "2025-10-01T00:00:00Z"
}
```

### ページネーション形式
```json
{
  "items": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## エンドポイント定義

---

## 1. Workspace（ワークスペース）API

### GET /workspaces
**概要**: ワークスペース一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/workspaces`
- **Parameters**:
  - `organizationId` (query, optional): 組織IDでフィルタ
  - `status` (query, optional): ステータスでフィルタ (active/inactive/deleted)
  - `page` (query, optional): ページ番号 (default: 1)
  - `limit` (query, optional): 件数 (default: 20, max: 100)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "プロジェクトAワークスペース",
        "organizationId": "uuid",
        "description": "プロジェクトAの情報共有スペース",
        "ownerId": "uuid",
        "plan": "premium",
        "storageUsed": 5368709120,
        "storageLimit": 107374182400,
        "status": "active",
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-15T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### POST /workspaces
**概要**: 新規ワークスペースを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/workspaces`
- **Body**:
```json
{
  "name": "プロジェクトBワークスペース",
  "organizationId": "uuid",
  "description": "プロジェクトBの情報共有スペース",
  "ownerId": "uuid",
  "plan": "standard",
  "settings": {
    "allowGuestAccess": false,
    "maxChannels": 50,
    "maxMembersPerChannel": 100,
    "retentionPeriod": 365,
    "allowFileUploads": true,
    "maxFileSize": 104857600,
    "allowedFileTypes": ["pdf", "docx", "xlsx", "png", "jpg"],
    "defaultChannelType": "private"
  }
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "プロジェクトBワークスペース",
    "organizationId": "uuid",
    "description": "プロジェクトBの情報共有スペース",
    "ownerId": "uuid",
    "plan": "standard",
    "storageUsed": 0,
    "storageLimit": 53687091200,
    "status": "active",
    "createdAt": "2025-10-01T00:00:00Z",
    "updatedAt": "2025-10-01T00:00:00Z"
  }
}
```

---

### GET /workspaces/{id}
**概要**: ワークスペース詳細を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/workspaces/{id}`
- **Path Parameters**:
  - `id` (required): ワークスペースID (UUID形式)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "プロジェクトAワークスペース",
    "organizationId": "uuid",
    "description": "プロジェクトAの情報共有スペース",
    "ownerId": "uuid",
    "plan": "premium",
    "storageUsed": 5368709120,
    "storageLimit": 107374182400,
    "status": "active",
    "settings": {
      "allowGuestAccess": true,
      "maxChannels": 100,
      "maxMembersPerChannel": 200
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-15T00:00:00Z"
  }
}
```

---

### PUT /workspaces/{id}
**概要**: ワークスペースを更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/workspaces/{id}`
- **Path Parameters**:
  - `id` (required): ワークスペースID
- **Body**:
```json
{
  "name": "更新後のワークスペース名",
  "description": "更新後の説明",
  "plan": "premium"
}
```

**レスポンス**: 更新後のワークスペース情報（GET /workspaces/{id}と同じ形式）

---

### DELETE /workspaces/{id}
**概要**: ワークスペースを削除（論理削除）

**リクエスト**:
- **Method**: DELETE
- **URL**: `/workspaces/{id}`
- **Path Parameters**:
  - `id` (required): ワークスペースID

**レスポンス**:
```json
{
  "success": true,
  "message": "Workspace deleted successfully",
  "timestamp": "2025-10-01T00:00:00Z"
}
```

---

## 2. Channel（チャネル）API

### GET /workspaces/{workspaceId}/channels
**概要**: ワークスペース内のチャネル一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/workspaces/{workspaceId}/channels`
- **Path Parameters**:
  - `workspaceId` (required): ワークスペースID
- **Query Parameters**:
  - `type` (optional): チャネルタイプ (public/private/direct)
  - `includeArchived` (optional): アーカイブ済みを含む (default: false)
  - `page` (optional): ページ番号
  - `limit` (optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "name": "general",
        "type": "public",
        "purpose": "一般的な議論",
        "topic": "プロジェクト全体の情報共有",
        "ownerId": "uuid",
        "isArchived": false,
        "lastActivityAt": "2025-10-01T10:30:00Z",
        "memberCount": 25,
        "unreadCount": 3,
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-10-01T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "pages": 1
    }
  }
}
```

---

### POST /workspaces/{workspaceId}/channels
**概要**: 新規チャネルを作成

**リクエスト**:
- **Method**: POST
- **URL**: `/workspaces/{workspaceId}/channels`
- **Path Parameters**:
  - `workspaceId` (required): ワークスペースID
- **Body**:
```json
{
  "name": "design-discussion",
  "type": "private",
  "purpose": "デザインレビュー",
  "topic": "UI/UX設計について",
  "ownerId": "uuid",
  "initialMembers": ["uuid1", "uuid2", "uuid3"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "name": "design-discussion",
    "type": "private",
    "purpose": "デザインレビュー",
    "topic": "UI/UX設計について",
    "ownerId": "uuid",
    "isArchived": false,
    "lastActivityAt": "2025-10-01T11:00:00Z",
    "createdAt": "2025-10-01T11:00:00Z",
    "updatedAt": "2025-10-01T11:00:00Z"
  }
}
```

---

### GET /channels/{id}
**概要**: チャネル詳細を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/channels/{id}`
- **Path Parameters**:
  - `id` (required): チャネルID

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "name": "general",
    "type": "public",
    "purpose": "一般的な議論",
    "topic": "プロジェクト全体の情報共有",
    "ownerId": "uuid",
    "isArchived": false,
    "lastActivityAt": "2025-10-01T10:30:00Z",
    "members": [
      {
        "userId": "uuid",
        "role": "owner",
        "joinedAt": "2025-01-01T00:00:00Z",
        "lastReadAt": "2025-10-01T10:25:00Z",
        "notificationEnabled": true
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-10-01T10:30:00Z"
  }
}
```

---

### PUT /channels/{id}
**概要**: チャネル情報を更新

**リクエスト**:
- **Method**: PUT
- **URL**: `/channels/{id}`
- **Body**:
```json
{
  "name": "updated-channel-name",
  "purpose": "更新後の目的",
  "topic": "更新後のトピック"
}
```

---

### DELETE /channels/{id}
**概要**: チャネルを削除

---

### PUT /channels/{id}/archive
**概要**: チャネルをアーカイブ

**リクエスト**:
- **Method**: PUT
- **URL**: `/channels/{id}/archive`

**レスポンス**:
```json
{
  "success": true,
  "message": "Channel archived successfully",
  "timestamp": "2025-10-01T00:00:00Z"
}
```

---

### PUT /channels/{id}/unarchive
**概要**: チャネルをアーカイブ解除

---

### POST /channels/{id}/members
**概要**: チャネルにメンバーを追加

**リクエスト**:
- **Method**: POST
- **URL**: `/channels/{id}/members`
- **Body**:
```json
{
  "userIds": ["uuid1", "uuid2"],
  "role": "member"
}
```

---

### DELETE /channels/{id}/members/{userId}
**概要**: チャネルからメンバーを削除

---

## 3. Message（メッセージ）API

### GET /channels/{channelId}/messages
**概要**: チャネル内のメッセージ一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/channels/{channelId}/messages`
- **Path Parameters**:
  - `channelId` (required): チャネルID
- **Query Parameters**:
  - `before` (optional): この日時より前のメッセージを取得 (ISO8601形式)
  - `after` (optional): この日時より後のメッセージを取得
  - `limit` (optional): 件数 (default: 50, max: 100)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "channelId": "uuid",
        "authorId": "uuid",
        "content": "プロジェクトの進捗について共有します。",
        "type": "text",
        "threadId": null,
        "attachments": [],
        "mentions": ["uuid1"],
        "reactions": [
          {
            "emoji": "👍",
            "count": 3,
            "userIds": ["uuid1", "uuid2", "uuid3"]
          }
        ],
        "editedAt": null,
        "deletedAt": null,
        "createdAt": "2025-10-01T10:30:00Z"
      }
    ],
    "hasMore": true,
    "oldest": "2025-10-01T09:00:00Z",
    "latest": "2025-10-01T10:30:00Z"
  }
}
```

---

### POST /channels/{channelId}/messages
**概要**: メッセージを投稿

**リクエスト**:
- **Method**: POST
- **URL**: `/channels/{channelId}/messages`
- **Path Parameters**:
  - `channelId` (required): チャネルID
- **Body**:
```json
{
  "content": "新しいメッセージです @user1",
  "type": "text",
  "threadId": "uuid",
  "attachments": [
    {
      "filename": "document.pdf",
      "filesize": 1024000,
      "mimetype": "application/pdf",
      "url": "https://storage.example.com/files/document.pdf"
    }
  ],
  "mentions": ["uuid1"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "channelId": "uuid",
    "authorId": "uuid",
    "content": "新しいメッセージです @user1",
    "type": "text",
    "threadId": "uuid",
    "attachments": [...],
    "mentions": ["uuid1"],
    "createdAt": "2025-10-01T11:00:00Z"
  }
}
```

---

### PUT /messages/{id}
**概要**: メッセージを編集

**リクエスト**:
- **Method**: PUT
- **URL**: `/messages/{id}`
- **Body**:
```json
{
  "content": "編集後のメッセージ内容"
}
```

**制約**: 投稿後24時間以内のみ編集可能

---

### DELETE /messages/{id}
**概要**: メッセージを削除（論理削除）

---

### POST /messages/{id}/reactions
**概要**: メッセージにリアクションを追加

**リクエスト**:
- **Method**: POST
- **URL**: `/messages/{id}/reactions`
- **Body**:
```json
{
  "emoji": "👍"
}
```

---

### DELETE /messages/{id}/reactions/{emoji}
**概要**: リアクションを削除

---

## 4. Thread（スレッド）API

### GET /messages/{messageId}/thread
**概要**: メッセージのスレッドを取得

**リクエスト**:
- **Method**: GET
- **URL**: `/messages/{messageId}/thread`

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "parentMessageId": "uuid",
    "replyCount": 5,
    "lastReplyAt": "2025-10-01T11:30:00Z",
    "isResolved": false,
    "replies": [
      {
        "id": "uuid",
        "authorId": "uuid",
        "content": "スレッド内の返信",
        "createdAt": "2025-10-01T11:00:00Z"
      }
    ],
    "createdAt": "2025-10-01T10:30:00Z"
  }
}
```

---

### PUT /threads/{id}/resolve
**概要**: スレッドを解決済みにする

---

## 5. Document（ドキュメント）API

### GET /workspaces/{workspaceId}/documents
**概要**: ワークスペース内のドキュメント一覧を取得

**リクエスト**:
- **Method**: GET
- **URL**: `/workspaces/{workspaceId}/documents`
- **Query Parameters**:
  - `status` (optional): ステータス (draft/published/archived)
  - `type` (optional): タイプ (markdown/wiki/note)
  - `authorId` (optional): 作成者ID
  - `search` (optional): 検索キーワード
  - `page` (optional): ページ番号
  - `limit` (optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "title": "プロジェクト設計ドキュメント",
        "type": "markdown",
        "authorId": "uuid",
        "parentId": null,
        "version": 3,
        "status": "published",
        "publishedAt": "2025-09-15T00:00:00Z",
        "lastEditedBy": "uuid",
        "collaborators": ["uuid1", "uuid2"],
        "createdAt": "2025-09-01T00:00:00Z",
        "updatedAt": "2025-09-20T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### POST /workspaces/{workspaceId}/documents
**概要**: 新規ドキュメントを作成

**リクエスト**:
- **Body**:
```json
{
  "title": "新規ドキュメント",
  "content": "# ドキュメントの内容\n\n本文...",
  "type": "markdown",
  "authorId": "uuid",
  "parentId": "uuid",
  "status": "draft"
}
```

---

### GET /documents/{id}
**概要**: ドキュメント詳細を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "title": "プロジェクト設計ドキュメント",
    "content": "# 設計ドキュメント\n\n## 概要\n...",
    "type": "markdown",
    "authorId": "uuid",
    "parentId": null,
    "version": 3,
    "status": "published",
    "publishedAt": "2025-09-15T00:00:00Z",
    "createdAt": "2025-09-01T00:00:00Z",
    "updatedAt": "2025-09-20T00:00:00Z"
  }
}
```

---

### PUT /documents/{id}
**概要**: ドキュメントを更新

**リクエスト**:
- **Body**:
```json
{
  "title": "更新後のタイトル",
  "content": "更新後の内容",
  "changeNote": "セクション3を追加"
}
```

**制約**: バージョン番号が自動的にインクリメントされる

---

### DELETE /documents/{id}
**概要**: ドキュメントを削除（論理削除）

---

### PUT /documents/{id}/publish
**概要**: ドキュメントを公開

**リクエスト**:
- **Method**: PUT
- **URL**: `/documents/{id}/publish`

**制約**: draft状態のドキュメントのみ公開可能

---

### PUT /documents/{id}/archive
**概要**: ドキュメントをアーカイブ

---

### GET /documents/{id}/versions
**概要**: ドキュメントのバージョン履歴を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "documentId": "uuid",
        "version": 3,
        "authorId": "uuid",
        "changeNote": "セクション3を追加",
        "createdAt": "2025-09-20T00:00:00Z"
      },
      {
        "documentId": "uuid",
        "version": 2,
        "authorId": "uuid",
        "changeNote": "タイポ修正",
        "createdAt": "2025-09-10T00:00:00Z"
      }
    ]
  }
}
```

---

### GET /documents/{id}/versions/{version}
**概要**: 特定バージョンのドキュメントを取得

---

## 6. Meeting（会議）API

### GET /workspaces/{workspaceId}/meetings
**概要**: ワークスペース内の会議一覧を取得

**リクエスト**:
- **Query Parameters**:
  - `status` (optional): ステータス (scheduled/in_progress/completed/cancelled)
  - `from` (optional): 開始日時 (ISO8601)
  - `to` (optional): 終了日時
  - `hostId` (optional): ホストID
  - `page` (optional): ページ番号
  - `limit` (optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "title": "週次進捗会議",
        "description": "プロジェクトの週次進捗確認",
        "type": "video",
        "hostId": "uuid",
        "scheduledStart": "2025-10-05T14:00:00Z",
        "scheduledEnd": "2025-10-05T15:00:00Z",
        "actualStart": null,
        "actualEnd": null,
        "meetingUrl": "https://meet.example.com/abc123",
        "status": "scheduled",
        "participantCount": 8,
        "createdAt": "2025-09-30T00:00:00Z",
        "updatedAt": "2025-09-30T00:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

### POST /workspaces/{workspaceId}/meetings
**概要**: 新規会議を作成

**リクエスト**:
- **Body**:
```json
{
  "title": "デザインレビュー会議",
  "description": "UI/UXデザインの最終レビュー",
  "type": "video",
  "hostId": "uuid",
  "scheduledStart": "2025-10-10T10:00:00Z",
  "scheduledEnd": "2025-10-10T11:30:00Z",
  "participants": [
    {
      "userId": "uuid1",
      "role": "presenter"
    },
    {
      "userId": "uuid2",
      "role": "participant"
    }
  ],
  "agenda": {
    "items": [
      {
        "title": "デザインコンセプトの確認",
        "duration": 30,
        "presenter": "uuid1",
        "description": "全体のデザインコンセプトを共有",
        "order": 1
      }
    ],
    "estimatedDuration": 90,
    "objectives": ["デザイン承認", "改善点の洗い出し"],
    "requiredDocuments": ["uuid-doc1", "uuid-doc2"]
  }
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "title": "デザインレビュー会議",
    "description": "UI/UXデザインの最終レビュー",
    "type": "video",
    "hostId": "uuid",
    "scheduledStart": "2025-10-10T10:00:00Z",
    "scheduledEnd": "2025-10-10T11:30:00Z",
    "meetingUrl": "https://meet.example.com/xyz789",
    "status": "scheduled",
    "createdAt": "2025-10-01T00:00:00Z",
    "updatedAt": "2025-10-01T00:00:00Z"
  }
}
```

---

### GET /meetings/{id}
**概要**: 会議詳細を取得

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "title": "週次進捗会議",
    "description": "プロジェクトの週次進捗確認",
    "type": "video",
    "hostId": "uuid",
    "scheduledStart": "2025-10-05T14:00:00Z",
    "scheduledEnd": "2025-10-05T15:00:00Z",
    "actualStart": "2025-10-05T14:02:00Z",
    "actualEnd": "2025-10-05T14:58:00Z",
    "meetingUrl": "https://meet.example.com/abc123",
    "status": "completed",
    "participants": [
      {
        "userId": "uuid",
        "role": "host",
        "joinedAt": "2025-10-05T14:00:00Z",
        "leftAt": "2025-10-05T14:58:00Z",
        "status": "attended"
      }
    ],
    "recordingAvailable": true,
    "recordingUrl": "https://storage.example.com/recordings/abc123.mp4",
    "createdAt": "2025-09-30T00:00:00Z",
    "updatedAt": "2025-10-05T15:00:00Z"
  }
}
```

---

### PUT /meetings/{id}
**概要**: 会議情報を更新

---

### DELETE /meetings/{id}
**概要**: 会議を削除（キャンセル）

---

### PUT /meetings/{id}/start
**概要**: 会議を開始

**リクエスト**:
- **Method**: PUT
- **URL**: `/meetings/{id}/start`

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "in_progress",
    "actualStart": "2025-10-05T14:02:00Z",
    "meetingUrl": "https://meet.example.com/abc123"
  }
}
```

---

### PUT /meetings/{id}/end
**概要**: 会議を終了

---

### POST /meetings/{id}/participants
**概要**: 会議に参加者を追加

---

### PUT /meetings/{id}/participants/{userId}
**概要**: 参加者のステータスを更新（承諾/辞退）

**リクエスト**:
- **Body**:
```json
{
  "status": "accepted"
}
```

---

## 7. Notification（通知）API

### GET /notifications
**概要**: 自分宛の通知一覧を取得

**リクエスト**:
- **Query Parameters**:
  - `isRead` (optional): 既読フィルタ (true/false)
  - `type` (optional): 通知タイプ (mention/reply/meeting/document)
  - `workspaceId` (optional): ワークスペースID
  - `page` (optional): ページ番号
  - `limit` (optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "workspaceId": "uuid",
        "recipientId": "uuid",
        "type": "mention",
        "title": "メッセージでメンションされました",
        "message": "@you が design-discussion チャネルでメンションしました",
        "sourceType": "message",
        "sourceId": "uuid",
        "isRead": false,
        "readAt": null,
        "createdAt": "2025-10-01T10:30:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {...}
  }
}
```

---

### PUT /notifications/{id}/read
**概要**: 通知を既読にする

**リクエスト**:
- **Method**: PUT
- **URL**: `/notifications/{id}/read`

**レスポンス**:
```json
{
  "success": true,
  "message": "Notification marked as read",
  "timestamp": "2025-10-01T11:00:00Z"
}
```

---

### PUT /notifications/read-all
**概要**: 全ての通知を既読にする

**リクエスト**:
- **Query Parameters**:
  - `workspaceId` (optional): 特定ワークスペースの通知のみ

---

### DELETE /notifications/{id}
**概要**: 通知を削除

---

## 8. Search（検索）API

### GET /search
**概要**: ワークスペース横断検索

**リクエスト**:
- **Query Parameters**:
  - `q` (required): 検索キーワード
  - `workspaceId` (optional): ワークスペースID
  - `type` (optional): 検索対象タイプ (messages/documents/all)
  - `channelId` (optional): チャネル指定
  - `authorId` (optional): 作成者指定
  - `from` (optional): 日付範囲（開始）
  - `to` (optional): 日付範囲（終了）
  - `page` (optional): ページ番号
  - `limit` (optional): 件数

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "channelId": "uuid",
        "content": "検索キーワードを含むメッセージ",
        "authorId": "uuid",
        "createdAt": "2025-10-01T10:00:00Z",
        "highlight": "...検索キーワード..."
      }
    ],
    "documents": [
      {
        "id": "uuid",
        "title": "検索キーワードを含むドキュメント",
        "content": "...",
        "authorId": "uuid",
        "createdAt": "2025-09-01T00:00:00Z",
        "highlight": "...検索キーワード..."
      }
    ],
    "totalResults": 25,
    "pagination": {...}
  }
}
```

---

## WebSocket API

### 接続エンドポイント
**URL**: `wss://api.example.com/v1/collaboration/ws`

### 認証
接続時にJWTトークンをクエリパラメータまたはメッセージで送信：
```
wss://api.example.com/v1/collaboration/ws?token={jwt_token}
```

### メッセージフォーマット

#### クライアント → サーバー

##### チャネルに参加
```json
{
  "type": "subscribe",
  "channelId": "uuid"
}
```

##### チャネルから退出
```json
{
  "type": "unsubscribe",
  "channelId": "uuid"
}
```

##### メッセージ送信
```json
{
  "type": "message",
  "channelId": "uuid",
  "content": "リアルタイムメッセージ",
  "mentions": []
}
```

##### タイピング通知
```json
{
  "type": "typing",
  "channelId": "uuid",
  "isTyping": true
}
```

#### サーバー → クライアント

##### 新規メッセージ
```json
{
  "type": "message",
  "data": {
    "id": "uuid",
    "channelId": "uuid",
    "authorId": "uuid",
    "content": "メッセージ内容",
    "createdAt": "2025-10-01T11:00:00Z"
  }
}
```

##### メッセージ編集
```json
{
  "type": "message_updated",
  "data": {
    "id": "uuid",
    "content": "編集後の内容",
    "editedAt": "2025-10-01T11:05:00Z"
  }
}
```

##### メッセージ削除
```json
{
  "type": "message_deleted",
  "data": {
    "id": "uuid",
    "channelId": "uuid"
  }
}
```

##### タイピング通知
```json
{
  "type": "user_typing",
  "data": {
    "userId": "uuid",
    "channelId": "uuid",
    "isTyping": true
  }
}
```

##### プレゼンス更新
```json
{
  "type": "presence",
  "data": {
    "userId": "uuid",
    "status": "online",
    "lastSeen": "2025-10-01T11:00:00Z"
  }
}
```

---

## エラーコード

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| INVALID_REQUEST | 400 | リクエストが不正 |
| VALIDATION_ERROR | 422 | バリデーションエラー |
| UNAUTHORIZED | 401 | 認証が必要 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが見つからない |
| CHANNEL_ARCHIVED | 409 | チャネルがアーカイブ済み |
| WORKSPACE_LIMIT_EXCEEDED | 409 | ワークスペースの制限超過 |
| EDIT_TIME_EXPIRED | 409 | メッセージの編集期限切れ |
| DUPLICATE_CHANNEL_NAME | 409 | チャネル名の重複 |
| STORAGE_LIMIT_EXCEEDED | 413 | ストレージ容量超過 |
| RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |
| SERVICE_UNAVAILABLE | 503 | サービス利用不可 |

### エラーレスポンス例
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "バリデーションエラーが発生しました",
    "details": {
      "fields": [
        {
          "field": "name",
          "message": "チャネル名は1文字以上100文字以下である必要があります"
        }
      ]
    }
  },
  "timestamp": "2025-10-01T11:00:00Z"
}
```

---

## レート制限

### 制限値
- **一般API**: 1000リクエスト/時間/ユーザー
- **メッセージ投稿**: 100リクエスト/分/ユーザー
- **検索API**: 50リクエスト/分/ユーザー
- **ドキュメント作成**: 20リクエスト/時間/ユーザー

### レスポンスヘッダー
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1696147200
```

### 制限超過時
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "レート制限を超過しました。しばらく待ってから再試行してください。",
    "details": {
      "retryAfter": 3600
    }
  },
  "timestamp": "2025-10-01T11:00:00Z"
}
```

---

## バージョン管理

### 現在のバージョン
- **v1.0.0**: 初版リリース (2025-10-01)

### バージョニングポリシー
- **メジャーバージョン**: 互換性のない変更
- **マイナーバージョン**: 後方互換性のある機能追加
- **パッチバージョン**: バグフィックス

### サポートポリシー
- 最新バージョン含む2世代をサポート
- 廃止予定APIは6ヶ月前に告知
- 廃止後も3ヶ月はエラーメッセージで案内

---

## セキュリティ

### HTTPS必須
全てのAPIはHTTPS経由でのみアクセス可能

### CORS設定
```
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### データ暗号化
- **保存時**: AES-256暗号化（メッセージ内容、ドキュメント）
- **通信時**: TLS 1.3

### 監査ログ
以下の操作は監査ログに記録：
- ワークスペース作成・削除
- チャネル作成・削除
- ドキュメント公開・削除
- 会議作成・実施
- メンバー追加・削除

---

## パフォーマンス要件

### レスポンスタイム目標
- **メッセージ投稿**: < 100ms (95パーセンタイル)
- **チャネル切り替え**: < 200ms (95パーセンタイル)
- **ドキュメント保存**: < 500ms (95パーセンタイル)
- **検索**: < 1000ms (95パーセンタイル)

### スループット
- **同時接続数**: 10,000
- **メッセージ/秒**: 1,000
- **同時編集ドキュメント**: 100

### キャッシュ戦略
- **チャネル情報**: Redis, TTL 5分
- **ユーザープロファイル**: Redis, TTL 15分
- **メッセージ履歴**: Redis, 直近50件

---

## サンプルコード

### JavaScript/TypeScript (Fetch API)

#### メッセージ投稿
```typescript
async function postMessage(channelId: string, content: string) {
  const response = await fetch(
    `https://api.example.com/v1/collaboration/channels/${channelId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        content,
        type: 'text'
      })
    }
  );

  if (!response.ok) {
    throw new Error('Failed to post message');
  }

  return await response.json();
}
```

#### WebSocket接続
```typescript
const ws = new WebSocket(
  `wss://api.example.com/v1/collaboration/ws?token=${jwtToken}`
);

ws.onopen = () => {
  // チャネルに参加
  ws.send(JSON.stringify({
    type: 'subscribe',
    channelId: 'uuid'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'message':
      console.log('New message:', data.data);
      break;
    case 'user_typing':
      console.log('User typing:', data.data);
      break;
  }
};
```

---

## 付録

### ワークスペースプラン別制限

| 項目 | Free | Standard | Premium |
|------|------|----------|---------|
| ストレージ | 5GB | 50GB | 100GB |
| チャネル数 | 10 | 50 | 無制限 |
| チャネル当たりメンバー | 20 | 100 | 200 |
| 会議時間 | 40分 | 無制限 | 無制限 |
| ドキュメントバージョン保持 | 10 | 50 | 100 |
| 検索履歴 | 90日 | 1年 | 無制限 |

### サポートされているファイルタイプ

#### ドキュメント
- `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`

#### 画像
- `jpg`, `jpeg`, `png`, `gif`, `svg`, `webp`

#### その他
- `zip`, `txt`, `csv`, `md`, `json`

**最大ファイルサイズ**: 100MB（Premiumプランは500MB）
