# 通知サービス API仕様

## 基本情報
- ベースパス: `/api/notifications`
- 認証方式: JWT Bearer Token
- レート制限: 100リクエスト/分/IP
- バージョン: v1.0.0

## エンドポイント定義

### 1. 通知管理

#### GET /api/notifications
**説明**: 通知一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| status | ENUM | - | ステータスフィルター（unread/read/archived） |
| type | ENUM | - | 通知タイプフィルター |
| priority | ENUM | - | 優先度フィルター |
| startDate | TIMESTAMP | - | 開始日時フィルター |
| endDate | TIMESTAMP | - | 終了日時フィルター |
| page | INTEGER | - | ページ番号（デフォルト: 1） |
| limit | INTEGER | - | 件数（デフォルト: 20） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| notifications | ARRAY[NOTIFICATION] | 通知一覧 |
| unreadCount | INTEGER | 未読件数 |
| total | INTEGER | 総件数 |
| page | INTEGER | 現在のページ |
| totalPages | INTEGER | 総ページ数 |

---

#### GET /api/notifications/:id
**説明**: 通知詳細の取得

**認証**: 必要（受信者本人）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 通知ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | 通知ID |
| type | ENUM | 通知タイプ |
| title | STRING_200 | タイトル |
| body | TEXT | 本文 |
| priority | ENUM | 優先度 |
| status | ENUM | ステータス |
| senderId | UUID | 送信者ID |
| metadata | OBJECT | メタデータ |
| createdAt | TIMESTAMP | 作成日時 |
| readAt | TIMESTAMP | 既読日時 |
| actionUrl | URL | アクションURL |
| actionLabel | STRING_50 | アクションラベル |

---

#### POST /api/notifications
**説明**: 通知の作成（システム内部用）

**認証**: システム権限

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| recipientIds | ARRAY[UUID] | ✓ | 受信者ID一覧 |
| type | ENUM | ✓ | 通知タイプ |
| title | STRING_200 | ✓ | タイトル |
| body | TEXT | ✓ | 本文 |
| priority | ENUM | - | 優先度（デフォルト: Normal） |
| metadata | OBJECT | - | メタデータ |
| actionUrl | URL | - | アクションURL |
| actionLabel | STRING_50 | - | アクションラベル |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| notifications | ARRAY[UUID] | 作成された通知ID一覧 |
| sentCount | INTEGER | 送信件数 |

---

#### PATCH /api/notifications/:id/read
**説明**: 通知を既読にする

**認証**: 必要（受信者本人）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 通知ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| readAt | TIMESTAMP | 既読日時 |

---

#### POST /api/notifications/read-all
**説明**: すべての通知を既読にする

**認証**: 必要

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| updatedCount | INTEGER | 更新件数 |

---

#### DELETE /api/notifications/:id
**説明**: 通知のアーカイブ

**認証**: 必要（受信者本人）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | 通知ID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| archived | BOOLEAN | アーカイブ成功フラグ |

---

### 2. メッセージ管理

#### GET /api/messages
**説明**: メッセージ一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| channelId | UUID | - | チャンネルIDフィルター |
| userId | UUID | - | ユーザーIDフィルター |
| search | STRING | - | 検索キーワード |
| startDate | TIMESTAMP | - | 開始日時 |
| endDate | TIMESTAMP | - | 終了日時 |
| page | INTEGER | - | ページ番号 |
| limit | INTEGER | - | 件数 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| messages | ARRAY[MESSAGE] | メッセージ一覧 |
| total | INTEGER | 総件数 |

---

#### GET /api/messages/:id
**説明**: メッセージ詳細の取得

**認証**: 必要（チャンネルメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | メッセージID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | メッセージID |
| channelId | UUID | チャンネルID |
| senderId | UUID | 送信者ID |
| content | TEXT | メッセージ内容 |
| type | ENUM | メッセージタイプ |
| attachments | ARRAY[ATTACHMENT] | 添付ファイル |
| mentions | ARRAY[UUID] | メンション |
| reactions | ARRAY[REACTION] | リアクション |
| threadId | UUID | スレッドID |
| createdAt | TIMESTAMP | 作成日時 |
| updatedAt | TIMESTAMP | 更新日時 |
| editedAt | TIMESTAMP | 編集日時 |

---

#### POST /api/messages
**説明**: メッセージの送信

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| channelId | UUID | ✓ | チャンネルID |
| content | TEXT | ✓ | メッセージ内容 |
| type | ENUM | - | メッセージタイプ（デフォルト: text） |
| attachmentIds | ARRAY[UUID] | - | 添付ファイルID |
| mentions | ARRAY[UUID] | - | メンション |
| threadId | UUID | - | スレッドID（返信時） |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| message | MESSAGE_OBJECT | 送信されたメッセージ |

---

#### PUT /api/messages/:id
**説明**: メッセージの編集

**認証**: 必要（送信者本人）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | メッセージID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| content | TEXT | ✓ | 新しいメッセージ内容 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| message | MESSAGE_OBJECT | 編集されたメッセージ |

---

#### DELETE /api/messages/:id
**説明**: メッセージの削除

**認証**: 必要（送信者本人または管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | メッセージID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| deleted | BOOLEAN | 削除成功フラグ |

---

### 3. チャンネル管理

#### GET /api/channels
**説明**: チャンネル一覧の取得

**認証**: 必要

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| type | ENUM | - | チャンネルタイプ（public/private/direct） |
| projectId | UUID | - | プロジェクトIDフィルター |
| search | STRING | - | 検索キーワード |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| channels | ARRAY[CHANNEL] | チャンネル一覧 |

---

#### GET /api/channels/:id
**説明**: チャンネル詳細の取得

**認証**: 必要（チャンネルメンバー）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | チャンネルID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| id | UUID | チャンネルID |
| name | STRING_100 | チャンネル名 |
| description | TEXT | 説明 |
| type | ENUM | チャンネルタイプ |
| projectId | UUID | プロジェクトID |
| members | ARRAY[CHANNEL_MEMBER] | メンバー一覧 |
| createdBy | UUID | 作成者ID |
| createdAt | TIMESTAMP | 作成日時 |
| lastActivityAt | TIMESTAMP | 最終活動日時 |

---

#### POST /api/channels
**説明**: 新規チャンネルの作成

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| name | STRING_100 | ✓ | チャンネル名 |
| description | TEXT | - | 説明 |
| type | ENUM | ✓ | チャンネルタイプ |
| projectId | UUID | - | プロジェクトID |
| memberIds | ARRAY[UUID] | - | 初期メンバーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| channel | CHANNEL_OBJECT | 作成されたチャンネル |

---

#### POST /api/channels/:id/members
**説明**: チャンネルメンバーの追加

**認証**: 必要（チャンネル管理者）

**パスパラメータ**:
| パラメータ | 型 | 説明 |
|----------|-----|------|
| id | UUID | チャンネルID |

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| userIds | ARRAY[UUID] | ✓ | 追加するユーザーID |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| added | INTEGER | 追加件数 |

---

### 4. 通知設定

#### GET /api/notifications/settings
**説明**: 通知設定の取得

**認証**: 必要

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| email | OBJECT | メール通知設定 |
| push | OBJECT | プッシュ通知設定 |
| inApp | OBJECT | アプリ内通知設定 |
| quietHours | OBJECT | 通知停止時間帯 |
| preferences | ARRAY[PREFERENCE] | 詳細設定 |

---

#### PUT /api/notifications/settings
**説明**: 通知設定の更新

**認証**: 必要

**リクエスト**:
| フィールド | 型 | 必須 | 説明 |
|----------|-----|-----|------|
| email | OBJECT | - | メール通知設定 |
| push | OBJECT | - | プッシュ通知設定 |
| inApp | OBJECT | - | アプリ内通知設定 |
| quietHours | OBJECT | - | 通知停止時間帯 |

**レスポンス**:
| フィールド | 型 | 説明 |
|----------|-----|------|
| settings | SETTINGS_OBJECT | 更新された設定 |

---

## 型定義

### NOTIFICATION_OBJECT
```
{
  id: UUID,
  recipientId: UUID,
  type: ENUM[System|Project|Task|Message|Approval|Alert],
  title: STRING_200,
  body: TEXT,
  priority: ENUM[Low|Normal|High|Urgent],
  status: ENUM[Unread|Read|Archived],
  senderId: UUID,
  metadata: OBJECT,
  createdAt: TIMESTAMP,
  readAt: TIMESTAMP
}
```

### MESSAGE_OBJECT
```
{
  id: UUID,
  channelId: UUID,
  senderId: UUID,
  content: TEXT,
  type: ENUM[Text|Image|File|System],
  attachments: ARRAY[ATTACHMENT],
  mentions: ARRAY[UUID],
  reactions: ARRAY[REACTION],
  threadId: UUID,
  createdAt: TIMESTAMP,
  editedAt: TIMESTAMP
}
```

### CHANNEL_OBJECT
```
{
  id: UUID,
  name: STRING_100,
  description: TEXT,
  type: ENUM[Public|Private|Direct],
  projectId: UUID,
  createdBy: UUID,
  createdAt: TIMESTAMP
}
```

### ATTACHMENT
```
{
  id: UUID,
  filename: STRING_255,
  mimeType: STRING_100,
  size: INTEGER,
  url: URL
}
```

### REACTION
```
{
  emoji: STRING_10,
  userId: UUID,
  createdAt: TIMESTAMP
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| NOTIFICATION_NOT_FOUND | 404 | 通知が存在しない |
| MESSAGE_NOT_FOUND | 404 | メッセージが存在しない |
| CHANNEL_NOT_FOUND | 404 | チャンネルが存在しない |
| CHANNEL_ACCESS_DENIED | 403 | チャンネルアクセス権限なし |
| MESSAGE_EDIT_TIMEOUT | 400 | メッセージ編集時間超過 |
| INVALID_RECIPIENT | 400 | 無効な受信者 |
| RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |
| ATTACHMENT_TOO_LARGE | 400 | 添付ファイルサイズ超過 |