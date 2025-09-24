# 通知サービス API仕様書

## 基本情報
- **ベースURL**: `/api/notifications`
- **認証**: Bearer Token (JWT)
- **コンテンツタイプ**: `application/json`

## メッセージAPI

### 1. メッセージ送信
**エンドポイント**: `POST /api/messages/send`

**リクエスト**:
```json
{
  "channelId": "uuid",
  "content": "string",
  "type": "Text | File | Image",
  "attachments": [
    {
      "url": "string",
      "name": "string",
      "size": "number",
      "type": "string"
    }
  ],
  "mentions": ["userId1", "userId2"],
  "replyTo": "messageId"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "channelId": "uuid",
    "senderId": "uuid",
    "content": "string",
    "type": "Text",
    "attachments": [],
    "mentions": [],
    "replyTo": null,
    "editedAt": null,
    "deletedAt": null,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. メッセージ編集
**エンドポイント**: `PUT /api/messages/{messageId}`

**リクエスト**:
```json
{
  "content": "string",
  "mentions": ["userId1", "userId2"]
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "string",
    "editedAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**エラーレスポンス**:
- `403 Forbidden`: 編集権限がない場合
- `400 Bad Request`: 編集期限（24時間）を過ぎている場合

### 3. メッセージ削除（ソフトデリート）
**エンドポイント**: `DELETE /api/messages/{messageId}`

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "deletedAt": "2024-01-01T00:00:00Z"
  }
}
```

**エラーレスポンス**:
- `403 Forbidden`: 削除権限がない場合（送信者またはチャンネル管理者のみ）

### 4. メッセージ取得
**エンドポイント**: `GET /api/messages/channel/{channelId}`

**クエリパラメータ**:
- `limit`: 取得件数（デフォルト: 50）
- `cursor`: ページネーション用カーソル
- `includeDeleted`: 削除済みメッセージを含むか（デフォルト: true）

**レスポンス**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "channelId": "uuid",
      "senderId": "uuid",
      "senderName": "string",
      "senderAvatar": "string",
      "content": "string",
      "type": "Text",
      "editedAt": null,
      "deletedAt": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "nextCursor": "string"
}
```

## チャンネルAPI

### 1. チャンネル作成
**エンドポイント**: `POST /api/channels`

**リクエスト**:
```json
{
  "name": "string",
  "type": "Public | Private | Direct | Project",
  "description": "string",
  "projectId": "uuid",
  "members": ["userId1", "userId2"]
}
```

### 2. チャンネル更新
**エンドポイント**: `PUT /api/channels/{channelId}`

### 3. チャンネルメンバー管理
**エンドポイント**: `POST /api/channels/{channelId}/members`

## 通知API

### 1. 通知送信
**エンドポイント**: `POST /api/notifications`

**リクエスト**:
```json
{
  "recipientId": "uuid",
  "type": "System | Project | Task | Message | Approval | Alert | Reminder",
  "title": "string",
  "body": "string",
  "priority": "Low | Normal | High | Urgent",
  "actionUrl": "string",
  "actionLabel": "string",
  "metadata": {}
}
```

### 2. 通知取得
**エンドポイント**: `GET /api/notifications`

### 3. 通知既読
**エンドポイント**: `PUT /api/notifications/{notificationId}/read`

## WebSocket Events

### 接続
```javascript
const socket = io('/messages', {
  auth: { token: 'JWT_TOKEN' }
});
```

### イベント

#### 1. メッセージ送信
```javascript
socket.emit('message:send', {
  channelId: 'uuid',
  content: 'string'
});
```

#### 2. メッセージ編集
```javascript
socket.emit('message:edit', {
  messageId: 'uuid',
  content: 'string'
});
```

#### 3. メッセージ削除
```javascript
socket.emit('message:delete', {
  messageId: 'uuid'
});
```

#### 4. メッセージ受信
```javascript
socket.on('message:new', (message) => {
  // 新規メッセージ
});

socket.on('message:edited', (message) => {
  // 編集されたメッセージ
});

socket.on('message:deleted', (messageId) => {
  // 削除されたメッセージ
});
```

## エラーコード

| コード | 説明 |
|-------|------|
| 400 | リクエスト不正 |
| 401 | 認証エラー |
| 403 | アクセス権限なし |
| 404 | リソースが見つからない |
| 409 | 競合（重複など） |
| 422 | バリデーションエラー |
| 429 | レート制限超過 |
| 500 | サーバーエラー |

## レート制限
- メッセージ送信: 60回/分
- メッセージ編集: 30回/分
- メッセージ削除: 10回/分
- チャンネル作成: 10回/時

## 注意事項

### メッセージ編集
- 送信後24時間以内のみ編集可能
- 編集履歴は保持され、「編集済み」ラベルが表示される
- 編集時刻（editedAt）が記録される

### メッセージ削除
- ソフトデリートを採用（データベースには残る）
- 削除済みメッセージは「このメッセージは削除されました」と表示
- 送信者またはチャンネル管理者のみ削除可能
- 削除時刻（deletedAt）が記録される

### リアルタイム同期
- WebSocketを使用してリアルタイムでメッセージを同期
- 編集・削除も即座に他のユーザーに反映される