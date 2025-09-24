# 通知サービス データベーススキーマ仕様

## 基本情報
- データベース: SQLite
- ファイルパス: `prisma/notification-service/data/notification.db`
- 文字エンコーディング: UTF-8
- タイムゾーン: UTC

## パラソルドメイン言語型システム
```
UUID: 36文字の一意識別子
STRING_N: 最大N文字の可変長文字列
TEXT: 長文テキスト（制限なし）
TIMESTAMP: ISO 8601形式の日時
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式のデータ
INTEGER: 32ビット整数
URL: URL形式の文字列
```

## テーブル定義

### 1. Notifications（通知）

**説明**: システム通知

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 通知ID |
| recipientId | UUID | NOT NULL | 受信者ID |
| type | ENUM | NOT NULL | 通知タイプ |
| title | STRING_200 | NOT NULL | タイトル |
| body | TEXT | NOT NULL | 本文 |
| priority | ENUM | NOT NULL DEFAULT 'Normal' | 優先度 |
| status | ENUM | NOT NULL DEFAULT 'Unread' | ステータス |
| senderId | UUID | NULL | 送信者ID |
| metadata | JSON | NULL | メタデータ |
| actionUrl | URL | NULL | アクションURL |
| actionLabel | STRING_50 | NULL | アクションラベル |
| readAt | TIMESTAMP | NULL | 既読日時 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| expiresAt | TIMESTAMP | NULL | 有効期限 |

**インデックス**:
- `idx_notifications_recipientId` (recipientId)
- `idx_notifications_status` (status)
- `idx_notifications_type` (type)
- `idx_notifications_createdAt` (createdAt)

**ENUM定義**:
- `type`: System, Project, Task, Message, Approval, Alert, Reminder
- `priority`: Low, Normal, High, Urgent
- `status`: Unread, Read, Archived

---

### 2. Messages（メッセージ）

**説明**: チャットメッセージ

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | メッセージID |
| channelId | UUID | NOT NULL | チャンネルID |
| senderId | UUID | NOT NULL | 送信者ID |
| content | TEXT | NOT NULL | メッセージ内容 |
| type | ENUM | NOT NULL DEFAULT 'Text' | メッセージタイプ |
| threadId | UUID | NULL | スレッドID（返信先） |
| attachments | JSON | NULL | 添付ファイル |
| mentions | JSON | NULL | メンション |
| reactions | JSON | NULL | リアクション |
| editedAt | TIMESTAMP | NULL | 編集日時 |
| deletedAt | TIMESTAMP | NULL | 削除日時 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_messages_channelId` (channelId)
- `idx_messages_senderId` (senderId)
- `idx_messages_threadId` (threadId)
- `idx_messages_createdAt` (createdAt)

**外部キー**:
- `channelId` → `Channels.id` (CASCADE DELETE)
- `threadId` → `Messages.id` (SET NULL)

**ENUM定義**:
- `type`: Text, Image, File, System, Code, Link

---

### 3. Channels（チャンネル）

**説明**: メッセージチャンネル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | チャンネルID |
| name | STRING_100 | NOT NULL | チャンネル名 |
| description | TEXT | NULL | 説明 |
| type | ENUM | NOT NULL | チャンネルタイプ |
| projectId | UUID | NULL | プロジェクトID |
| createdBy | UUID | NOT NULL | 作成者ID |
| isArchived | BOOLEAN | DEFAULT false | アーカイブフラグ |
| lastActivityAt | TIMESTAMP | NOT NULL | 最終活動日時 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_channels_type` (type)
- `idx_channels_projectId` (projectId)
- `idx_channels_createdBy` (createdBy)
- `idx_channels_lastActivityAt` (lastActivityAt)

**ENUM定義**:
- `type`: Public, Private, Direct, Project

---

### 4. ChannelMembers（チャンネルメンバー）

**説明**: チャンネル参加者

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | メンバーID |
| channelId | UUID | NOT NULL | チャンネルID |
| userId | UUID | NOT NULL | ユーザーID |
| role | ENUM | NOT NULL DEFAULT 'Member' | ロール |
| isMuted | BOOLEAN | DEFAULT false | ミュート状態 |
| lastReadAt | TIMESTAMP | NULL | 最終既読日時 |
| joinedAt | TIMESTAMP | NOT NULL | 参加日時 |
| leftAt | TIMESTAMP | NULL | 離脱日時 |

**インデックス**:
- `idx_channel_members_composite` (channelId, userId) - UNIQUE
- `idx_channel_members_channelId` (channelId)
- `idx_channel_members_userId` (userId)

**外部キー**:
- `channelId` → `Channels.id` (CASCADE DELETE)

**ENUM定義**:
- `role`: Owner, Admin, Member, Guest

---

### 5. NotificationSettings（通知設定）

**説明**: ユーザー別通知設定

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | 設定ID |
| userId | UUID | UNIQUE, NOT NULL | ユーザーID |
| emailEnabled | BOOLEAN | DEFAULT true | メール通知 |
| pushEnabled | BOOLEAN | DEFAULT true | プッシュ通知 |
| inAppEnabled | BOOLEAN | DEFAULT true | アプリ内通知 |
| quietHours | JSON | NULL | 通知停止時間帯 |
| notificationTypes | JSON | NOT NULL | 通知タイプ別設定 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |
| updatedAt | TIMESTAMP | NOT NULL | 更新日時 |

**インデックス**:
- `idx_notification_settings_userId` (userId) - UNIQUE

---

### 6. EmailQueue（メールキュー）

**説明**: メール送信キュー

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | キューID |
| recipientEmail | STRING_255 | NOT NULL | 送信先メール |
| subject | STRING_255 | NOT NULL | 件名 |
| body | TEXT | NOT NULL | 本文 |
| htmlBody | TEXT | NULL | HTML本文 |
| status | ENUM | NOT NULL DEFAULT 'Pending' | ステータス |
| attempts | INTEGER | DEFAULT 0 | 送信試行回数 |
| sentAt | TIMESTAMP | NULL | 送信日時 |
| failedAt | TIMESTAMP | NULL | 失敗日時 |
| failureReason | TEXT | NULL | 失敗理由 |
| scheduledFor | TIMESTAMP | NULL | 送信予定日時 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_email_queue_status` (status)
- `idx_email_queue_scheduledFor` (scheduledFor)

**ENUM定義**:
- `status`: Pending, Sending, Sent, Failed, Cancelled

---

### 7. PushNotifications（プッシュ通知）

**説明**: プッシュ通知履歴

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|-----|------|
| id | UUID | PRIMARY KEY | プッシュID |
| userId | UUID | NOT NULL | ユーザーID |
| deviceToken | STRING_255 | NOT NULL | デバイストークン |
| title | STRING_200 | NOT NULL | タイトル |
| body | TEXT | NOT NULL | 本文 |
| data | JSON | NULL | 追加データ |
| status | ENUM | NOT NULL | ステータス |
| sentAt | TIMESTAMP | NULL | 送信日時 |
| failureReason | TEXT | NULL | 失敗理由 |
| createdAt | TIMESTAMP | NOT NULL | 作成日時 |

**インデックス**:
- `idx_push_notifications_userId` (userId)
- `idx_push_notifications_status` (status)
- `idx_push_notifications_createdAt` (createdAt)

**ENUM定義**:
- `status`: Pending, Sent, Failed, Expired

---

## リレーション図

```
Channels
  ├─ Messages (1:N)
  └─ ChannelMembers (1:N)

Messages
  └─ Messages (self-reference for threads)

Notifications
  └─ Users (N:1)

NotificationSettings
  └─ Users (1:1)

EmailQueue
  └─ Users (N:1)

PushNotifications
  └─ Users (N:1)
```

## データ保持ポリシー

| テーブル | 保持期間 | 削除条件 |
|---------|---------|----------|
| Notifications | 90日 | createdAtから90日経過 |
| Messages | 1年 | createdAtから1年経過 |
| EmailQueue | 30日 | createdAtから30日経過 |
| PushNotifications | 30日 | createdAtから30日経過 |

## パフォーマンス考慮事項

1. **メッセージ検索**: 全文検索インデックスの設定を検討
2. **リアルタイム更新**: WebSocketを使用したリアルタイム通信
3. **キャッシュ**: 既読状態、未読数のRedisキャッシュ
4. **バッチ処理**: メール送信、プッシュ通知のバッチ処理