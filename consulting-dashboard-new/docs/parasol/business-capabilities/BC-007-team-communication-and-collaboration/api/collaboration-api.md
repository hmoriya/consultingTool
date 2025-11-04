# BC-007: コラボレーションAPI [Collaboration API]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03

---

## 概要

Collaboration APIは、ワークスペース管理、ドキュメント共有、リアルタイム共同編集を提供します。

### エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/api/v1/bc-007/workspaces` | ワークスペース作成 |
| GET | `/api/v1/bc-007/workspaces/{workspaceId}` | ワークスペース取得 |
| PUT | `/api/v1/bc-007/workspaces/{workspaceId}` | ワークスペース更新 |
| DELETE | `/api/v1/bc-007/workspaces/{workspaceId}` | ワークスペース削除 |
| GET | `/api/v1/bc-007/workspaces` | ワークスペースリスト |
| POST | `/api/v1/bc-007/workspaces/{workspaceId}/members` | メンバー追加 |
| DELETE | `/api/v1/bc-007/workspaces/{workspaceId}/members/{userId}` | メンバー削除 |
| POST | `/api/v1/bc-007/workspaces/{workspaceId}/documents` | ドキュメント共有 |
| GET | `/api/v1/bc-007/documents/{documentId}` | ドキュメント取得 |
| PUT | `/api/v1/bc-007/documents/{documentId}` | ドキュメント更新 |
| DELETE | `/api/v1/bc-007/documents/{documentId}` | ドキュメント削除 |
| POST | `/api/v1/bc-007/documents/{documentId}/comments` | コメント追加 |
| GET | `/api/v1/bc-007/workspaces/{workspaceId}/activity` | アクティビティ取得 |

---

## Workspace API

### ワークスペース作成

**エンドポイント**: `POST /api/v1/bc-007/workspaces`

**リクエスト**:
```json
{
  "name": "Project Alpha Workspace",
  "description": "Collaboration space for Project Alpha",
  "type": "project",
  "memberIds": ["user1-uuid", "user2-uuid"]
}
```

**レスポンス**: `201 Created`
```json
{
  "workspaceId": "ws-uuid",
  "name": "Project Alpha Workspace",
  "type": "project",
  "ownerId": "user-uuid",
  "memberCount": 3,
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

## Document API

### ドキュメント共有

**エンドポイント**: `POST /api/v1/bc-007/workspaces/{workspaceId}/documents`

**リクエスト**:
```json
{
  "title": "Project Requirements",
  "fileName": "requirements.pdf",
  "fileUrl": "https://storage.example.com/files/requirements.pdf",
  "fileSize": 2048576,
  "mimeType": "application/pdf"
}
```

**レスポンス**: `201 Created`
```json
{
  "documentId": "doc-uuid",
  "workspaceId": "ws-uuid",
  "title": "Project Requirements",
  "fileName": "requirements.pdf",
  "fileUrl": "https://storage.example.com/files/requirements.pdf",
  "ownerId": "user-uuid",
  "versionNumber": 1,
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### コメント追加

**エンドポイント**: `POST /api/v1/bc-007/documents/{documentId}/comments`

**リクエスト**:
```json
{
  "content": "Please review section 3.2",
  "position": {
    "page": 5,
    "line": 12
  }
}
```

**レスポンス**: `201 Created`
```json
{
  "commentId": "comment-uuid",
  "documentId": "doc-uuid",
  "userId": "user-uuid",
  "content": "Please review section 3.2",
  "position": {
    "page": 5,
    "line": 12
  },
  "resolved": false,
  "createdAt": "2025-11-03T12:05:00.000Z"
}
```

---

### アクティビティ取得

**エンドポイント**: `GET /api/v1/bc-007/workspaces/{workspaceId}/activity`

**クエリパラメータ**:
```
limit=50
&cursor=cursor-xyz
```

**レスポンス**: `200 OK`
```json
{
  "activities": [
    {
      "activityId": "activity-uuid-1",
      "type": "document_shared",
      "actorId": "user1-uuid",
      "actorName": "Alice",
      "entityType": "document",
      "entityId": "doc-uuid",
      "summary": "shared a document: Project Requirements",
      "occurredAt": "2025-11-03T12:00:00.000Z"
    },
    {
      "activityId": "activity-uuid-2",
      "type": "member_joined",
      "actorId": "user2-uuid",
      "actorName": "Bob",
      "entityType": "workspace",
      "entityId": "ws-uuid",
      "summary": "joined the workspace",
      "occurredAt": "2025-11-03T11:30:00.000Z"
    }
  ],
  "pagination": {
    "nextCursor": "cursor-abc",
    "hasMore": false
  }
}
```

---

**最終更新**: 2025-11-03
