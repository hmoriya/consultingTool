# BC-007: メッセージングAPI [Messaging API]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03

---

## 目次

1. [概要](#overview)
2. [Channel API](#channel-api)
3. [Message API](#message-api)
4. [Direct Message API](#direct-message-api)
5. [WebSocket Events](#websocket-events)
6. [スキーマ定義](#schemas)
7. [使用例](#examples)

---

## 概要 {#overview}

Messaging APIは、リアルタイムメッセージング機能を提供します。

### 主要機能

- **Channel Management**: チャネルの作成・管理
- **Message Operations**: メッセージ送信・編集・削除
- **Thread Conversations**: スレッド会話
- **Reactions**: メッセージへのリアクション
- **Direct Messaging**: 1対1メッセージング
- **Read Receipts**: 既読管理
- **Real-time Delivery**: WebSocketによるリアルタイム配信

### エンドポイント一覧

| カテゴリ | メソッド | エンドポイント | 説明 |
|---------|---------|---------------|------|
| **Channel** | POST | `/api/v1/bc-007/channels` | チャネル作成 |
| | GET | `/api/v1/bc-007/channels/{channelId}` | チャネル取得 |
| | PUT | `/api/v1/bc-007/channels/{channelId}` | チャネル更新 |
| | DELETE | `/api/v1/bc-007/channels/{channelId}` | チャネル削除 |
| | GET | `/api/v1/bc-007/channels` | チャネルリスト取得 |
| | POST | `/api/v1/bc-007/channels/{channelId}/members` | メンバー追加 |
| | DELETE | `/api/v1/bc-007/channels/{channelId}/members/{userId}` | メンバー削除 |
| | PUT | `/api/v1/bc-007/channels/{channelId}/archive` | チャネルアーカイブ |
| | GET | `/api/v1/bc-007/channels/{channelId}/pins` | ピン留めメッセージ取得 |
| **Message** | POST | `/api/v1/bc-007/channels/{channelId}/messages` | メッセージ送信 |
| | GET | `/api/v1/bc-007/channels/{channelId}/messages` | メッセージリスト取得 |
| | GET | `/api/v1/bc-007/messages/{messageId}` | メッセージ取得 |
| | PUT | `/api/v1/bc-007/messages/{messageId}` | メッセージ編集 |
| | DELETE | `/api/v1/bc-007/messages/{messageId}` | メッセージ削除 |
| | POST | `/api/v1/bc-007/messages/{messageId}/replies` | スレッド返信 |
| | GET | `/api/v1/bc-007/messages/{messageId}/replies` | スレッド返信取得 |
| | POST | `/api/v1/bc-007/messages/{messageId}/reactions` | リアクション追加 |
| | DELETE | `/api/v1/bc-007/messages/{messageId}/reactions/{emoji}` | リアクション削除 |
| | PUT | `/api/v1/bc-007/messages/{messageId}/read` | 既読マーク |
| | POST | `/api/v1/bc-007/messages/{messageId}/pin` | ピン留め |
| | DELETE | `/api/v1/bc-007/messages/{messageId}/pin` | ピン留め解除 |
| **Direct Message** | POST | `/api/v1/bc-007/direct-messages` | DM送信 |
| | GET | `/api/v1/bc-007/direct-messages/conversations` | DM会話リスト |
| | GET | `/api/v1/bc-007/direct-messages/{conversationId}/messages` | DM取得 |
| | POST | `/api/v1/bc-007/direct-messages/group` | グループDM作成 |
| **Search** | GET | `/api/v1/bc-007/messages/search` | メッセージ検索 |

---

## Channel API {#channel-api}

### チャネル作成

チャネルを作成します。

**エンドポイント**: `POST /api/v1/bc-007/channels`

**認証**: 必須

**権限**: `channel:create`

**リクエスト**:
```json
{
  "workspaceId": "ws-uuid",
  "name": "engineering",
  "description": "Engineering team discussions",
  "type": "public",
  "initialMemberIds": ["user1-uuid", "user2-uuid"]
}
```

**リクエストパラメータ**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| workspaceId | string | ○ | ワークスペースID |
| name | string | ○ | チャネル名（3-50文字、英数字・ハイフン・アンダースコアのみ） |
| description | string | | チャネル説明（最大500文字） |
| type | string | ○ | チャネル種別（`public` または `private`） |
| initialMemberIds | string[] | | 初期メンバーID配列（プライベートチャネルの場合必須） |

**レスポンス**: `201 Created`
```json
{
  "channelId": "ch-uuid",
  "workspaceId": "ws-uuid",
  "name": "engineering",
  "description": "Engineering team discussions",
  "type": "public",
  "createdBy": "user-uuid",
  "memberCount": 3,
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

**エラー**:
- `400`: Invalid channel name format
- `403`: Insufficient permission
- `404`: Workspace not found
- `409`: Channel name already exists

---

### チャネル取得

チャネル情報を取得します。

**エンドポイント**: `GET /api/v1/bc-007/channels/{channelId}`

**認証**: 必須

**権限**: `channel:read`（メンバーのみ）

**レスポンス**: `200 OK`
```json
{
  "channelId": "ch-uuid",
  "workspaceId": "ws-uuid",
  "name": "engineering",
  "description": "Engineering team discussions",
  "type": "public",
  "createdBy": "user-uuid",
  "memberCount": 15,
  "topic": "Discussing sprint goals",
  "pinnedMessages": ["msg1-uuid", "msg2-uuid"],
  "createdAt": "2025-11-03T12:00:00.000Z",
  "archivedAt": null
}
```

---

### チャネルリスト取得

ワークスペース内のチャネルリストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/channels`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| workspaceId | string | ○ | ワークスペースID |
| type | string | | チャネル種別フィルター（`public`、`private`） |
| includeArchived | boolean | | アーカイブ済みチャネルを含むか（デフォルト: false） |
| limit | number | | 取得件数（デフォルト: 50、最大: 100） |
| cursor | string | | ページングカーソル |

**レスポンス**: `200 OK`
```json
{
  "channels": [
    {
      "channelId": "ch-uuid-1",
      "name": "general",
      "description": "General discussions",
      "type": "public",
      "memberCount": 50,
      "unreadCount": 5,
      "lastMessageAt": "2025-11-03T14:30:00.000Z"
    },
    {
      "channelId": "ch-uuid-2",
      "name": "engineering",
      "description": "Engineering team",
      "type": "private",
      "memberCount": 15,
      "unreadCount": 0,
      "lastMessageAt": "2025-11-03T13:00:00.000Z"
    }
  ],
  "pagination": {
    "nextCursor": "cursor-xyz",
    "hasMore": false
  }
}
```

---

### メンバー追加

チャネルにメンバーを追加します。

**エンドポイント**: `POST /api/v1/bc-007/channels/{channelId}/members`

**認証**: 必須

**権限**: `channel:manage`（オーナー・管理者のみ）

**リクエスト**:
```json
{
  "userIds": ["user1-uuid", "user2-uuid"],
  "role": "member"
}
```

**リクエストパラメータ**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| userIds | string[] | ○ | 追加するユーザーID配列 |
| role | string | | ロール（`member`、`admin`、デフォルト: `member`） |

**レスポンス**: `201 Created`
```json
{
  "addedMembers": [
    {
      "userId": "user1-uuid",
      "role": "member",
      "joinedAt": "2025-11-03T12:00:00.000Z"
    }
  ],
  "totalMembers": 16
}
```

---

### チャネルアーカイブ

チャネルをアーカイブします。

**エンドポイント**: `PUT /api/v1/bc-007/channels/{channelId}/archive`

**認証**: 必須

**権限**: `channel:manage`（オーナーのみ）

**レスポンス**: `200 OK`
```json
{
  "channelId": "ch-uuid",
  "archivedAt": "2025-11-03T12:00:00.000Z",
  "archivedBy": "user-uuid"
}
```

---

## Message API {#message-api}

### メッセージ送信

チャネルにメッセージを送信します。

**エンドポイント**: `POST /api/v1/bc-007/channels/{channelId}/messages`

**認証**: 必須

**権限**: `message:send`（メンバーのみ）

**リクエスト**:
```json
{
  "text": "Hello team! @john please review the PR",
  "attachments": [
    {
      "type": "file",
      "fileName": "design.pdf",
      "fileUrl": "https://storage.example.com/files/design.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf"
    }
  ],
  "metadata": {
    "clientId": "web-client-uuid"
  }
}
```

**リクエストパラメータ**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| text | string | ○ | メッセージ本文（1-10000文字） |
| attachments | object[] | | 添付ファイル配列（最大10件） |
| metadata | object | | メタデータ |

**レスポンス**: `201 Created`
```json
{
  "messageId": "msg-uuid",
  "channelId": "ch-uuid",
  "senderId": "user-uuid",
  "text": "Hello team! @john please review the PR",
  "mentions": [
    {
      "userId": "john-uuid",
      "displayName": "John Doe",
      "position": 12
    }
  ],
  "attachments": [
    {
      "id": "att-uuid",
      "type": "file",
      "fileName": "design.pdf",
      "fileUrl": "https://storage.example.com/files/design.pdf",
      "fileSize": 2048576,
      "mimeType": "application/pdf",
      "thumbnailUrl": null
    }
  ],
  "reactions": [],
  "replyCount": 0,
  "createdAt": "2025-11-03T12:00:00.000Z",
  "updatedAt": "2025-11-03T12:00:00.000Z",
  "isEdited": false
}
```

**エラー**:
- `400`: Invalid message content
- `403`: User not channel member
- `404`: Channel not found
- `413`: Attachment too large
- `429`: Rate limit exceeded

---

### メッセージリスト取得

チャネルのメッセージリストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/channels/{channelId}/messages`

**認証**: 必須

**権限**: `message:read`（メンバーのみ）

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | | 取得件数（デフォルト: 50、最大: 100） |
| cursor | string | | ページングカーソル |
| order | string | | ソート順（`asc`、`desc`、デフォルト: `desc`） |
| since | string | | 指定日時以降のメッセージのみ取得（ISO 8601） |

**レスポンス**: `200 OK`
```json
{
  "messages": [
    {
      "messageId": "msg-uuid-1",
      "senderId": "user1-uuid",
      "senderName": "Alice",
      "senderAvatarUrl": "https://cdn.example.com/avatars/alice.jpg",
      "text": "Good morning team!",
      "mentions": [],
      "attachments": [],
      "reactions": [
        {
          "emoji": "👍",
          "count": 3,
          "users": ["user2-uuid", "user3-uuid", "user4-uuid"]
        }
      ],
      "replyCount": 2,
      "createdAt": "2025-11-03T09:00:00.000Z",
      "isEdited": false
    },
    {
      "messageId": "msg-uuid-2",
      "senderId": "user2-uuid",
      "senderName": "Bob",
      "senderAvatarUrl": "https://cdn.example.com/avatars/bob.jpg",
      "text": "Let's discuss the sprint goals",
      "mentions": [],
      "attachments": [],
      "reactions": [],
      "replyCount": 0,
      "createdAt": "2025-11-03T08:30:00.000Z",
      "isEdited": false
    }
  ],
  "pagination": {
    "nextCursor": "cursor-abc",
    "prevCursor": "cursor-xyz",
    "hasMore": true
  }
}
```

---

### メッセージ編集

メッセージを編集します。

**エンドポイント**: `PUT /api/v1/bc-007/messages/{messageId}`

**認証**: 必須

**権限**: `message:edit`（送信者のみ、24時間以内）

**リクエスト**:
```json
{
  "text": "Updated message content"
}
```

**レスポンス**: `200 OK`
```json
{
  "messageId": "msg-uuid",
  "text": "Updated message content",
  "updatedAt": "2025-11-03T12:05:00.000Z",
  "isEdited": true,
  "editHistory": [
    {
      "editedAt": "2025-11-03T12:05:00.000Z",
      "editedBy": "user-uuid"
    }
  ]
}
```

**エラー**:
- `403`: Unauthorized (not message owner)
- `404`: Message not found
- `422`: Edit time expired (>24 hours)

---

### メッセージ削除

メッセージを削除します。

**エンドポイント**: `DELETE /api/v1/bc-007/messages/{messageId}`

**認証**: 必須

**権限**: `message:delete`（送信者または管理者）

**レスポンス**: `204 No Content`

**エラー**:
- `403`: Unauthorized
- `404`: Message not found
- `422`: Message already deleted

---

### スレッド返信送信

メッセージにスレッド返信を送信します。

**エンドポイント**: `POST /api/v1/bc-007/messages/{messageId}/replies`

**認証**: 必須

**権限**: `message:send`

**リクエスト**:
```json
{
  "text": "Good point! I agree with this approach."
}
```

**レスポンス**: `201 Created`
```json
{
  "messageId": "reply-uuid",
  "parentMessageId": "msg-uuid",
  "threadId": "msg-uuid",
  "senderId": "user-uuid",
  "text": "Good point! I agree with this approach.",
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### スレッド返信取得

スレッドの返信リストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/messages/{messageId}/replies`

**認証**: 必須

**権限**: `message:read`

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | | 取得件数（デフォルト: 50、最大: 100） |
| cursor | string | | ページングカーソル |

**レスポンス**: `200 OK`
```json
{
  "parentMessage": {
    "messageId": "msg-uuid",
    "senderId": "user1-uuid",
    "text": "What do you think about the new design?",
    "createdAt": "2025-11-03T10:00:00.000Z"
  },
  "replies": [
    {
      "messageId": "reply-uuid-1",
      "senderId": "user2-uuid",
      "senderName": "Bob",
      "text": "I like the color scheme!",
      "createdAt": "2025-11-03T10:05:00.000Z"
    },
    {
      "messageId": "reply-uuid-2",
      "senderId": "user3-uuid",
      "senderName": "Charlie",
      "text": "The layout needs some work",
      "createdAt": "2025-11-03T10:10:00.000Z"
    }
  ],
  "replyCount": 2,
  "participants": ["user1-uuid", "user2-uuid", "user3-uuid"],
  "pagination": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

---

### リアクション追加

メッセージにリアクションを追加します。

**エンドポイント**: `POST /api/v1/bc-007/messages/{messageId}/reactions`

**認証**: 必須

**権限**: `message:react`

**リクエスト**:
```json
{
  "emoji": "👍"
}
```

**レスポンス**: `201 Created`
```json
{
  "messageId": "msg-uuid",
  "emoji": "👍",
  "userId": "user-uuid",
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### リアクション削除

メッセージからリアクションを削除します。

**エンドポイント**: `DELETE /api/v1/bc-007/messages/{messageId}/reactions/{emoji}`

**認証**: 必須

**レスポンス**: `204 No Content`

---

### 既読マーク

メッセージを既読としてマークします。

**エンドポイント**: `PUT /api/v1/bc-007/messages/{messageId}/read`

**認証**: 必須

**レスポンス**: `200 OK`
```json
{
  "messageId": "msg-uuid",
  "userId": "user-uuid",
  "readAt": "2025-11-03T12:00:00.000Z"
}
```

---

### メッセージピン留め

メッセージをチャネルにピン留めします。

**エンドポイント**: `POST /api/v1/bc-007/messages/{messageId}/pin`

**認証**: 必須

**権限**: `channel:manage`（メンバー全員可）

**レスポンス**: `200 OK`
```json
{
  "messageId": "msg-uuid",
  "channelId": "ch-uuid",
  "pinnedBy": "user-uuid",
  "pinnedAt": "2025-11-03T12:00:00.000Z"
}
```

**エラー**:
- `422`: Pin limit exceeded (最大10件)

---

## Direct Message API {#direct-message-api}

### ダイレクトメッセージ送信

1対1のダイレクトメッセージを送信します。

**エンドポイント**: `POST /api/v1/bc-007/direct-messages`

**認証**: 必須

**リクエスト**:
```json
{
  "recipientId": "user2-uuid",
  "text": "Hey, can we discuss the project?"
}
```

**レスポンス**: `201 Created`
```json
{
  "messageId": "dm-uuid",
  "conversationId": "conv-uuid",
  "senderId": "user1-uuid",
  "recipientId": "user2-uuid",
  "text": "Hey, can we discuss the project?",
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### DM会話リスト取得

ユーザーのDM会話リストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/direct-messages/conversations`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | | 取得件数（デフォルト: 50） |
| cursor | string | | ページングカーソル |

**レスポンス**: `200 OK`
```json
{
  "conversations": [
    {
      "conversationId": "conv-uuid-1",
      "otherUser": {
        "userId": "user2-uuid",
        "name": "Bob Smith",
        "avatarUrl": "https://cdn.example.com/avatars/bob.jpg",
        "status": "online"
      },
      "lastMessage": {
        "messageId": "dm-uuid",
        "text": "Sure, let's chat tomorrow",
        "senderId": "user2-uuid",
        "createdAt": "2025-11-03T14:00:00.000Z"
      },
      "unreadCount": 2,
      "lastMessageAt": "2025-11-03T14:00:00.000Z"
    }
  ],
  "pagination": {
    "nextCursor": "cursor-xyz",
    "hasMore": false
  }
}
```

---

### DM取得

特定会話のDMを取得します。

**エンドポイント**: `GET /api/v1/bc-007/direct-messages/{conversationId}/messages`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | | 取得件数（デフォルト: 50） |
| cursor | string | | ページングカーソル |
| order | string | | ソート順（`asc`、`desc`） |

**レスポンス**: `200 OK`
```json
{
  "conversationId": "conv-uuid",
  "participants": [
    {
      "userId": "user1-uuid",
      "name": "Alice Johnson"
    },
    {
      "userId": "user2-uuid",
      "name": "Bob Smith"
    }
  ],
  "messages": [
    {
      "messageId": "dm-uuid-1",
      "senderId": "user1-uuid",
      "text": "Hey, can we discuss the project?",
      "createdAt": "2025-11-03T12:00:00.000Z",
      "isRead": true
    },
    {
      "messageId": "dm-uuid-2",
      "senderId": "user2-uuid",
      "text": "Sure, let's chat tomorrow",
      "createdAt": "2025-11-03T14:00:00.000Z",
      "isRead": false
    }
  ],
  "pagination": {
    "nextCursor": "cursor-abc",
    "hasMore": false
  }
}
```

---

### グループDM作成

複数人でのグループDMを作成します。

**エンドポイント**: `POST /api/v1/bc-007/direct-messages/group`

**認証**: 必須

**リクエスト**:
```json
{
  "recipientIds": ["user2-uuid", "user3-uuid", "user4-uuid"],
  "name": "Project Alpha Team"
}
```

**レスポンス**: `201 Created`
```json
{
  "conversationId": "group-conv-uuid",
  "name": "Project Alpha Team",
  "participantIds": ["user1-uuid", "user2-uuid", "user3-uuid", "user4-uuid"],
  "createdBy": "user1-uuid",
  "createdAt": "2025-11-03T12:00:00.000Z"
}
```

---

### メッセージ検索

メッセージを検索します。

**エンドポイント**: `GET /api/v1/bc-007/messages/search`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| q | string | ○ | 検索クエリ |
| channelId | string | | チャネルIDでフィルター |
| senderId | string | | 送信者IDでフィルター |
| from | string | | 開始日時（ISO 8601） |
| to | string | | 終了日時（ISO 8601） |
| limit | number | | 取得件数（デフォルト: 20、最大: 100） |

**レスポンス**: `200 OK`
```json
{
  "results": [
    {
      "messageId": "msg-uuid",
      "channelId": "ch-uuid",
      "channelName": "engineering",
      "senderId": "user-uuid",
      "senderName": "Alice",
      "text": "Let's discuss the API design for the new feature",
      "snippet": "...discuss the <mark>API design</mark> for the...",
      "createdAt": "2025-11-03T10:00:00.000Z",
      "score": 0.95
    }
  ],
  "totalResults": 15,
  "pagination": {
    "nextCursor": "cursor-search-123",
    "hasMore": true
  }
}
```

---

## WebSocket Events {#websocket-events}

### 接続

**URL**: `wss://api.example.com/ws/bc-007/messaging`

**認証**: JWT token via query parameter
```
wss://api.example.com/ws/bc-007/messaging?token=<JWT_TOKEN>
```

### イベント一覧

#### 1. new_message

新しいメッセージが送信されたときに配信されます。

**イベント**:
```json
{
  "event": "new_message",
  "data": {
    "messageId": "msg-uuid",
    "channelId": "ch-uuid",
    "senderId": "user-uuid",
    "senderName": "Alice",
    "text": "Hello team!",
    "mentions": [],
    "attachments": [],
    "createdAt": "2025-11-03T12:00:00.000Z"
  }
}
```

---

#### 2. message_edited

メッセージが編集されたときに配信されます。

**イベント**:
```json
{
  "event": "message_edited",
  "data": {
    "messageId": "msg-uuid",
    "channelId": "ch-uuid",
    "text": "Updated message",
    "editedBy": "user-uuid",
    "editedAt": "2025-11-03T12:05:00.000Z"
  }
}
```

---

#### 3. message_deleted

メッセージが削除されたときに配信されます。

**イベント**:
```json
{
  "event": "message_deleted",
  "data": {
    "messageId": "msg-uuid",
    "channelId": "ch-uuid",
    "deletedBy": "user-uuid",
    "deletedAt": "2025-11-03T12:10:00.000Z"
  }
}
```

---

#### 4. reaction_added

リアクションが追加されたときに配信されます。

**イベント**:
```json
{
  "event": "reaction_added",
  "data": {
    "messageId": "msg-uuid",
    "channelId": "ch-uuid",
    "userId": "user-uuid",
    "emoji": "👍",
    "createdAt": "2025-11-03T12:00:00.000Z"
  }
}
```

---

#### 5. user_typing

ユーザーが入力中のときに配信されます。

**イベント**:
```json
{
  "event": "user_typing",
  "data": {
    "channelId": "ch-uuid",
    "userId": "user-uuid",
    "userName": "Alice",
    "timestamp": "2025-11-03T12:00:00.000Z"
  }
}
```

---

#### 6. member_joined

チャネルにメンバーが参加したときに配信されます。

**イベント**:
```json
{
  "event": "member_joined",
  "data": {
    "channelId": "ch-uuid",
    "userId": "user-uuid",
    "userName": "Bob",
    "joinedAt": "2025-11-03T12:00:00.000Z"
  }
}
```

---

#### 7. member_left

チャネルからメンバーが退出したときに配信されます。

**イベント**:
```json
{
  "event": "member_left",
  "data": {
    "channelId": "ch-uuid",
    "userId": "user-uuid",
    "userName": "Charlie",
    "leftAt": "2025-11-03T12:00:00.000Z"
  }
}
```

---

## スキーマ定義 {#schemas}

### Channel

```typescript
interface Channel {
  channelId: string;
  workspaceId: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  createdBy: string;
  memberCount: number;
  topic?: string;
  pinnedMessages: string[];
  createdAt: string;
  archivedAt?: string;
}
```

---

### Message

```typescript
interface Message {
  messageId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  text: string;
  mentions: Mention[];
  attachments: Attachment[];
  reactions: Reaction[];
  replyCount: number;
  threadId?: string;
  parentMessageId?: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isPinned: boolean;
}
```

---

### Mention

```typescript
interface Mention {
  userId: string;
  displayName: string;
  position: number;
}
```

---

### Attachment

```typescript
interface Attachment {
  id: string;
  type: 'file' | 'image' | 'video';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}
```

---

### Reaction

```typescript
interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}
```

---

### DirectConversation

```typescript
interface DirectConversation {
  conversationId: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  lastMessageAt?: string;
}
```

---

## 使用例 {#examples}

### 例1: チャネル作成とメッセージ送信

```typescript
// 1. チャネル作成
const createChannelResponse = await fetch('/api/v1/bc-007/channels', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    workspaceId: 'ws-123',
    name: 'product-discussion',
    description: 'Product team discussions',
    type: 'public'
  })
});

const channel = await createChannelResponse.json();
console.log('Channel created:', channel.channelId);

// 2. メッセージ送信
const sendMessageResponse = await fetch(
  `/api/v1/bc-007/channels/${channel.channelId}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: 'Welcome to the product discussion channel!'
    })
  }
);

const message = await sendMessageResponse.json();
console.log('Message sent:', message.messageId);
```

---

### 例2: WebSocket接続とリアルタイム受信

```typescript
// WebSocket接続
const ws = new WebSocket(`wss://api.example.com/ws/bc-007/messaging?token=${token}`);

// 接続確立
ws.onopen = () => {
  console.log('WebSocket connected');

  // チャネルを購読
  ws.send(JSON.stringify({
    action: 'subscribe',
    channelId: 'ch-123'
  }));
};

// メッセージ受信
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.event) {
    case 'new_message':
      console.log('New message:', data.data);
      // UI更新処理
      break;

    case 'reaction_added':
      console.log('Reaction added:', data.data);
      // リアクション表示更新
      break;

    case 'user_typing':
      console.log('User typing:', data.data.userName);
      // 入力中インジケーター表示
      break;
  }
};

// エラーハンドリング
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// 接続終了
ws.onclose = () => {
  console.log('WebSocket disconnected');
  // 再接続ロジック
};
```

---

### 例3: スレッド会話

```typescript
// 1. 親メッセージ送信
const parentMessageResponse = await fetch(
  '/api/v1/bc-007/channels/ch-123/messages',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: 'What do you think about the new design?'
    })
  }
);

const parentMessage = await parentMessageResponse.json();

// 2. スレッド返信送信
const replyResponse = await fetch(
  `/api/v1/bc-007/messages/${parentMessage.messageId}/replies`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: 'I think it looks great!'
    })
  }
);

const reply = await replyResponse.json();
console.log('Thread reply sent:', reply.messageId);

// 3. スレッド返信取得
const threadResponse = await fetch(
  `/api/v1/bc-007/messages/${parentMessage.messageId}/replies`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const thread = await threadResponse.json();
console.log('Thread replies:', thread.replies.length);
```

---

### 例4: メッセージ検索

```typescript
// キーワード検索
const searchResponse = await fetch(
  '/api/v1/bc-007/messages/search?q=API+design&channelId=ch-123&limit=20',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const searchResults = await searchResponse.json();

console.log(`Found ${searchResults.totalResults} messages`);
searchResults.results.forEach(result => {
  console.log(`[${result.channelName}] ${result.senderName}: ${result.snippet}`);
});
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 メッセージングAPI詳細化
