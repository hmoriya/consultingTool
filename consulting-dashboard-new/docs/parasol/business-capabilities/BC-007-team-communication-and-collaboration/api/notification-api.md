# BC-007: 通知API [Notification API]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03

---

## 目次

1. [概要](#overview)
2. [Notification API](#notification-api)
3. [Notification Preferences API](#preferences-api)
4. [Scheduled Notification API](#scheduled-api)
5. [スキーマ定義](#schemas)
6. [使用例](#examples)

---

## 概要 {#overview}

Notification APIは、優先度別通知配信、マルチチャネル配信、ユーザー設定管理を提供します。

### 主要機能

- **優先度別配信**: urgent/high/normal/low の4段階
- **マルチチャネル**: Push、Email、SMS、In-app
- **SLA保証**: 優先度別配信時間保証
- **リトライ戦略**: 失敗時の自動再送
- **ユーザー設定**: 通知設定のカスタマイズ
- **予約配信**: スケジュールされた通知

### エンドポイント一覧

| カテゴリ | メソッド | エンドポイント | 説明 |
|---------|---------|---------------|------|
| **Notification** | POST | `/api/v1/bc-007/notifications` | 通知送信 |
| | GET | `/api/v1/bc-007/notifications/{notificationId}` | 通知取得 |
| | GET | `/api/v1/bc-007/notifications` | 通知リスト取得 |
| | GET | `/api/v1/bc-007/notifications/unread` | 未読通知取得 |
| | PUT | `/api/v1/bc-007/notifications/{notificationId}/read` | 既読マーク |
| | PUT | `/api/v1/bc-007/notifications/mark-all-read` | 全既読マーク |
| | DELETE | `/api/v1/bc-007/notifications/{notificationId}` | 通知削除 |
| | POST | `/api/v1/bc-007/notifications/urgent` | 緊急通知送信 |
| | POST | `/api/v1/bc-007/notifications/batch` | 一括通知送信 |
| **Preferences** | GET | `/api/v1/bc-007/notification-preferences` | 設定取得 |
| | PUT | `/api/v1/bc-007/notification-preferences` | 設定更新 |
| | PUT | `/api/v1/bc-007/notification-preferences/channels` | チャネル設定 |
| | PUT | `/api/v1/bc-007/notification-preferences/quiet-hours` | サイレント時間設定 |
| **Scheduled** | POST | `/api/v1/bc-007/notifications/scheduled` | 予約通知作成 |
| | GET | `/api/v1/bc-007/notifications/scheduled` | 予約通知リスト |
| | DELETE | `/api/v1/bc-007/notifications/scheduled/{notificationId}` | 予約通知キャンセル |
| **Stats** | GET | `/api/v1/bc-007/notifications/stats` | 統計情報取得 |
| | GET | `/api/v1/bc-007/notifications/delivery-status` | 配信状況取得 |

---

## Notification API {#notification-api}

### 通知送信

通知を送信します。

**エンドポイント**: `POST /api/v1/bc-007/notifications`

**認証**: 必須

**権限**: `notification:send`

**リクエスト**:
```json
{
  "recipientIds": ["user1-uuid", "user2-uuid"],
  "priority": "high",
  "type": "meeting_reminder",
  "title": "会議リマインダー: プロジェクトレビュー",
  "body": "15分後に開始されます",
  "data": {
    "meetingId": "meeting-uuid",
    "meetingTitle": "Project Review",
    "startTime": "2025-11-03T14:00:00.000Z"
  },
  "actionUrl": "/meetings/meeting-uuid",
  "imageUrl": "https://cdn.example.com/images/meeting.png"
}
```

**リクエストパラメータ**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| recipientIds | string[] | ○ | 受信者ID配列 |
| priority | string | ○ | 優先度（`urgent`、`high`、`normal`、`low`） |
| type | string | ○ | 通知種別（`meeting_reminder`、`new_message`等） |
| title | string | ○ | タイトル（最大200文字） |
| body | string | ○ | 本文（最大1000文字） |
| data | object | | カスタムデータ |
| actionUrl | string | | アクション先URL |
| imageUrl | string | | 画像URL |

**レスポンス**: `201 Created`
```json
{
  "notificationIds": ["notif-uuid-1", "notif-uuid-2"],
  "recipientCount": 2,
  "estimatedDeliveryTime": "2025-11-03T12:01:00.000Z",
  "sla": {
    "deliveryTimeSeconds": 60,
    "channels": ["push", "email"]
  }
}
```

**エラー**:
- `400`: Invalid notification data
- `403`: Insufficient permission
- `422`: Recipient limit exceeded (max 1000)

---

### 通知取得

通知詳細を取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications/{notificationId}`

**認証**: 必須

**レスポンス**: `200 OK`
```json
{
  "notificationId": "notif-uuid",
  "recipientId": "user-uuid",
  "priority": "high",
  "type": "meeting_reminder",
  "title": "会議リマインダー: プロジェクトレビュー",
  "body": "15分後に開始されます",
  "data": {
    "meetingId": "meeting-uuid",
    "meetingTitle": "Project Review",
    "startTime": "2025-11-03T14:00:00.000Z"
  },
  "actionUrl": "/meetings/meeting-uuid",
  "imageUrl": "https://cdn.example.com/images/meeting.png",
  "status": "delivered",
  "deliveryChannels": [
    {
      "channel": "push",
      "status": "delivered",
      "deliveredAt": "2025-11-03T12:00:45.000Z"
    },
    {
      "channel": "email",
      "status": "delivered",
      "deliveredAt": "2025-11-03T12:00:52.000Z"
    }
  ],
  "readAt": null,
  "createdAt": "2025-11-03T12:00:00.000Z",
  "deliveredAt": "2025-11-03T12:00:45.000Z"
}
```

---

### 通知リスト取得

ユーザーの通知リストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| status | string | | ステータスフィルター（`delivered`、`failed`等） |
| type | string | | 通知種別フィルター |
| priority | string | | 優先度フィルター |
| from | string | | 開始日時（ISO 8601） |
| to | string | | 終了日時（ISO 8601） |
| limit | number | | 取得件数（デフォルト: 50、最大: 100） |
| cursor | string | | ページングカーソル |

**レスポンス**: `200 OK`
```json
{
  "notifications": [
    {
      "notificationId": "notif-uuid-1",
      "priority": "high",
      "type": "meeting_reminder",
      "title": "会議リマインダー: プロジェクトレビュー",
      "body": "15分後に開始されます",
      "actionUrl": "/meetings/meeting-uuid",
      "imageUrl": "https://cdn.example.com/images/meeting.png",
      "isRead": false,
      "createdAt": "2025-11-03T12:00:00.000Z"
    },
    {
      "notificationId": "notif-uuid-2",
      "priority": "normal",
      "type": "new_message",
      "title": "New message in #engineering",
      "body": "Alice: Let's discuss the API design",
      "actionUrl": "/channels/ch-uuid?message=msg-uuid",
      "isRead": true,
      "readAt": "2025-11-03T11:00:00.000Z",
      "createdAt": "2025-11-03T10:30:00.000Z"
    }
  ],
  "unreadCount": 12,
  "pagination": {
    "nextCursor": "cursor-xyz",
    "hasMore": true
  }
}
```

---

### 未読通知取得

未読通知のみを取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications/unread`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | | 取得件数（デフォルト: 50） |

**レスポンス**: `200 OK`
```json
{
  "notifications": [
    {
      "notificationId": "notif-uuid",
      "priority": "urgent",
      "type": "system_alert",
      "title": "System Maintenance Alert",
      "body": "Scheduled maintenance in 1 hour",
      "createdAt": "2025-11-03T12:00:00.000Z"
    }
  ],
  "unreadCount": 12
}
```

---

### 既読マーク

通知を既読としてマークします。

**エンドポイント**: `PUT /api/v1/bc-007/notifications/{notificationId}/read`

**認証**: 必須

**レスポンス**: `200 OK`
```json
{
  "notificationId": "notif-uuid",
  "readAt": "2025-11-03T12:05:00.000Z"
}
```

---

### 全既読マーク

全ての通知を既読としてマークします。

**エンドポイント**: `PUT /api/v1/bc-007/notifications/mark-all-read`

**認証**: 必須

**レスポンス**: `200 OK`
```json
{
  "markedCount": 25,
  "markedAt": "2025-11-03T12:10:00.000Z"
}
```

---

### 通知削除

通知を削除します。

**エンドポイント**: `DELETE /api/v1/bc-007/notifications/{notificationId}`

**認証**: 必須

**レスポンス**: `204 No Content`

---

### 緊急通知送信

緊急通知を送信します（SLA: 10秒以内配信）。

**エンドポイント**: `POST /api/v1/bc-007/notifications/urgent`

**認証**: 必須

**権限**: `notification:send:urgent`（管理者のみ）

**リクエスト**:
```json
{
  "recipientIds": ["user1-uuid", "user2-uuid"],
  "type": "security_alert",
  "title": "セキュリティアラート",
  "body": "不正なアクセスが検出されました",
  "data": {
    "alertId": "alert-uuid",
    "severity": "critical"
  },
  "actionUrl": "/security/alerts/alert-uuid"
}
```

**レスポンス**: `201 Created`
```json
{
  "notificationIds": ["notif-uuid-1", "notif-uuid-2"],
  "priority": "urgent",
  "sla": {
    "deliveryTimeSeconds": 10,
    "channels": ["push", "email", "sms"]
  },
  "estimatedDeliveryTime": "2025-11-03T12:00:10.000Z"
}
```

---

### 一括通知送信

複数の受信者に異なる通知を一括送信します。

**エンドポイント**: `POST /api/v1/bc-007/notifications/batch`

**認証**: 必須

**権限**: `notification:send:batch`

**リクエスト**:
```json
{
  "notifications": [
    {
      "recipientId": "user1-uuid",
      "priority": "normal",
      "type": "task_assigned",
      "title": "新しいタスクが割り当てられました",
      "body": "「API設計レビュー」が割り当てられました",
      "data": {
        "taskId": "task-uuid-1"
      }
    },
    {
      "recipientId": "user2-uuid",
      "priority": "high",
      "type": "deadline_approaching",
      "title": "期限が迫っています",
      "body": "「ドキュメント作成」の期限まであと1日",
      "data": {
        "taskId": "task-uuid-2"
      }
    }
  ]
}
```

**レスポンス**: `202 Accepted`
```json
{
  "batchId": "batch-uuid",
  "totalCount": 2,
  "acceptedCount": 2,
  "status": "processing"
}
```

---

### 配信状況取得

通知の配信状況を取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications/delivery-status`

**認証**: 必須

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| notificationIds | string | ○ | 通知IDのカンマ区切り |

**レスポンス**: `200 OK`
```json
{
  "statuses": [
    {
      "notificationId": "notif-uuid-1",
      "status": "delivered",
      "channels": [
        {
          "channel": "push",
          "status": "delivered",
          "attemptCount": 1,
          "deliveredAt": "2025-11-03T12:00:45.000Z",
          "deliveryTimeMs": 450
        },
        {
          "channel": "email",
          "status": "delivered",
          "attemptCount": 1,
          "deliveredAt": "2025-11-03T12:00:52.000Z",
          "deliveryTimeMs": 520
        }
      ],
      "slaMetResult": true
    },
    {
      "notificationId": "notif-uuid-2",
      "status": "failed",
      "channels": [
        {
          "channel": "push",
          "status": "failed",
          "attemptCount": 3,
          "lastAttemptAt": "2025-11-03T12:05:00.000Z",
          "errorMessage": "Device token invalid"
        }
      ],
      "slaMetResult": false
    }
  ]
}
```

---

## Notification Preferences API {#preferences-api}

### 設定取得

ユーザーの通知設定を取得します。

**エンドポイント**: `GET /api/v1/bc-007/notification-preferences`

**認証**: 必須

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid",
  "channels": {
    "push": true,
    "email": true,
    "sms": false,
    "in_app": true
  },
  "typeSettings": {
    "meeting_reminder": {
      "enabled": true,
      "channels": ["push", "email"]
    },
    "new_message": {
      "enabled": true,
      "channels": ["push", "in_app"]
    },
    "mention": {
      "enabled": true,
      "channels": ["push", "email"]
    },
    "task_assigned": {
      "enabled": true,
      "channels": ["push", "email"]
    }
  },
  "quietHours": {
    "enabled": true,
    "startHour": 22,
    "endHour": 8
  },
  "updatedAt": "2025-11-03T10:00:00.000Z"
}
```

---

### 設定更新

通知設定を更新します。

**エンドポイント**: `PUT /api/v1/bc-007/notification-preferences`

**認証**: 必須

**リクエスト**:
```json
{
  "channels": {
    "push": true,
    "email": true,
    "sms": false,
    "in_app": true
  },
  "typeSettings": {
    "meeting_reminder": {
      "enabled": true,
      "channels": ["push", "email"]
    },
    "new_message": {
      "enabled": false
    }
  }
}
```

**レスポンス**: `200 OK`
```json
{
  "userId": "user-uuid",
  "channels": {
    "push": true,
    "email": true,
    "sms": false,
    "in_app": true
  },
  "typeSettings": {
    "meeting_reminder": {
      "enabled": true,
      "channels": ["push", "email"]
    },
    "new_message": {
      "enabled": false
    }
  },
  "updatedAt": "2025-11-03T12:15:00.000Z"
}
```

---

### チャネル設定

特定チャネルの有効/無効を切り替えます。

**エンドポイント**: `PUT /api/v1/bc-007/notification-preferences/channels`

**認証**: 必須

**リクエスト**:
```json
{
  "push": true,
  "email": false,
  "sms": false
}
```

**レスポンス**: `200 OK`
```json
{
  "channels": {
    "push": true,
    "email": false,
    "sms": false,
    "in_app": true
  },
  "updatedAt": "2025-11-03T12:20:00.000Z"
}
```

---

### サイレント時間設定

サイレント時間を設定します。

**エンドポイント**: `PUT /api/v1/bc-007/notification-preferences/quiet-hours`

**認証**: 必須

**リクエスト**:
```json
{
  "enabled": true,
  "startHour": 22,
  "endHour": 8
}
```

**レスポンス**: `200 OK`
```json
{
  "quietHours": {
    "enabled": true,
    "startHour": 22,
    "endHour": 8
  },
  "updatedAt": "2025-11-03T12:25:00.000Z"
}
```

---

## Scheduled Notification API {#scheduled-api}

### 予約通知作成

予約通知を作成します。

**エンドポイント**: `POST /api/v1/bc-007/notifications/scheduled`

**認証**: 必須

**権限**: `notification:schedule`

**リクエスト**:
```json
{
  "recipientIds": ["user1-uuid", "user2-uuid"],
  "scheduledAt": "2025-11-04T09:00:00.000Z",
  "priority": "normal",
  "type": "project_deadline_reminder",
  "title": "プロジェクト期限リマインダー",
  "body": "「Project Alpha」の期限まであと3日です",
  "data": {
    "projectId": "project-uuid",
    "deadlineDate": "2025-11-07"
  }
}
```

**リクエストパラメータ**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| recipientIds | string[] | ○ | 受信者ID配列 |
| scheduledAt | string | ○ | 配信予定日時（ISO 8601、現在時刻より未来） |
| priority | string | ○ | 優先度 |
| type | string | ○ | 通知種別 |
| title | string | ○ | タイトル |
| body | string | ○ | 本文 |
| data | object | | カスタムデータ |

**レスポンス**: `201 Created`
```json
{
  "notificationId": "scheduled-notif-uuid",
  "scheduledAt": "2025-11-04T09:00:00.000Z",
  "recipientCount": 2,
  "status": "scheduled"
}
```

**エラー**:
- `400`: Invalid scheduled time (must be in future)

---

### 予約通知リスト取得

予約されている通知のリストを取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications/scheduled`

**認証**: 必須

**権限**: `notification:schedule:read`

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| from | string | | 開始日時 |
| to | string | | 終了日時 |
| limit | number | | 取得件数 |

**レスポンス**: `200 OK`
```json
{
  "scheduledNotifications": [
    {
      "notificationId": "scheduled-notif-uuid",
      "scheduledAt": "2025-11-04T09:00:00.000Z",
      "priority": "normal",
      "type": "project_deadline_reminder",
      "title": "プロジェクト期限リマインダー",
      "recipientCount": 2,
      "status": "scheduled",
      "createdAt": "2025-11-03T12:00:00.000Z"
    }
  ],
  "totalCount": 5
}
```

---

### 予約通知キャンセル

予約通知をキャンセルします。

**エンドポイント**: `DELETE /api/v1/bc-007/notifications/scheduled/{notificationId}`

**認証**: 必須

**権限**: `notification:schedule:cancel`

**レスポンス**: `200 OK`
```json
{
  "notificationId": "scheduled-notif-uuid",
  "status": "cancelled",
  "cancelledAt": "2025-11-03T12:30:00.000Z"
}
```

**エラー**:
- `422`: Cannot cancel (already sent)

---

### 統計情報取得

通知の統計情報を取得します。

**エンドポイント**: `GET /api/v1/bc-007/notifications/stats`

**認証**: 必須

**権限**: `notification:stats:read`（管理者のみ）

**クエリパラメータ**:
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| from | string | ○ | 開始日時（ISO 8601） |
| to | string | ○ | 終了日時（ISO 8601） |
| groupBy | string | | グループ化（`day`、`hour`、`priority`、`type`） |

**レスポンス**: `200 OK`
```json
{
  "period": {
    "from": "2025-11-01T00:00:00.000Z",
    "to": "2025-11-03T23:59:59.999Z"
  },
  "summary": {
    "totalSent": 15420,
    "delivered": 14850,
    "failed": 570,
    "deliveryRate": 0.963,
    "avgDeliveryTimeMs": 458
  },
  "byPriority": {
    "urgent": {
      "sent": 125,
      "delivered": 124,
      "failed": 1,
      "avgDeliveryTimeMs": 95,
      "slaMetRate": 0.992
    },
    "high": {
      "sent": 2340,
      "delivered": 2285,
      "failed": 55,
      "avgDeliveryTimeMs": 350,
      "slaMetRate": 0.976
    },
    "normal": {
      "sent": 10500,
      "delivered": 10120,
      "failed": 380,
      "avgDeliveryTimeMs": 520,
      "slaMetRate": 0.964
    },
    "low": {
      "sent": 2455,
      "delivered": 2321,
      "failed": 134,
      "avgDeliveryTimeMs": 1250,
      "slaMetRate": 0.945
    }
  },
  "byChannel": {
    "push": {
      "sent": 15420,
      "delivered": 14200,
      "failed": 1220,
      "deliveryRate": 0.921
    },
    "email": {
      "sent": 5680,
      "delivered": 5580,
      "failed": 100,
      "deliveryRate": 0.982
    },
    "sms": {
      "sent": 125,
      "delivered": 120,
      "failed": 5,
      "deliveryRate": 0.960
    },
    "in_app": {
      "sent": 15420,
      "delivered": 15420,
      "failed": 0,
      "deliveryRate": 1.000
    }
  },
  "byType": {
    "meeting_reminder": 2340,
    "new_message": 8500,
    "mention": 1280,
    "task_assigned": 1850,
    "deadline_approaching": 950,
    "other": 500
  }
}
```

---

## スキーマ定義 {#schemas}

### Notification

```typescript
interface Notification {
  notificationId: string;
  recipientId: string;
  priority: NotificationPriority;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  actionUrl?: string;
  imageUrl?: string;
  status: DeliveryStatus;
  deliveryChannels: DeliveryChannel[];
  readAt?: string;
  createdAt: string;
  deliveredAt?: string;
  expiresAt: string;
}
```

---

### NotificationPriority

```typescript
enum NotificationPriority {
  URGENT = 'urgent',   // 10秒以内
  HIGH = 'high',       // 1分以内
  NORMAL = 'normal',   // 5分以内
  LOW = 'low'          // Best Effort
}
```

---

### NotificationType

```typescript
enum NotificationType {
  // Messaging
  NEW_MESSAGE = 'new_message',
  NEW_DIRECT_MESSAGE = 'new_direct_message',
  MENTION = 'mention',
  THREAD_REPLY = 'thread_reply',
  REACTION_ADDED = 'reaction_added',

  // Meeting
  MEETING_INVITATION = 'meeting_invitation',
  MEETING_REMINDER = 'meeting_reminder',
  MEETING_STARTED = 'meeting_started',
  MEETING_CANCELLED = 'meeting_cancelled',

  // Project
  PROJECT_ASSIGNED = 'project_assigned',
  TASK_ASSIGNED = 'task_assigned',
  DEADLINE_APPROACHING = 'deadline_approaching',

  // Knowledge
  KNOWLEDGE_SHARED = 'knowledge_shared',
  REVIEW_REQUESTED = 'review_requested',
  COURSE_ASSIGNED = 'course_assigned',

  // System
  SYSTEM_ALERT = 'system_alert',
  SECURITY_ALERT = 'security_alert'
}
```

---

### DeliveryChannel

```typescript
interface DeliveryChannel {
  channel: 'push' | 'email' | 'sms' | 'in_app';
  status: 'pending' | 'delivered' | 'failed';
  attemptCount: number;
  deliveredAt?: string;
  deliveryTimeMs?: number;
  errorMessage?: string;
}
```

---

### NotificationPreferences

```typescript
interface NotificationPreferences {
  userId: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    in_app: boolean;
  };
  typeSettings: Record<NotificationType, TypeSetting>;
  quietHours?: QuietHours;
  updatedAt: string;
}

interface TypeSetting {
  enabled: boolean;
  channels?: ('push' | 'email' | 'sms' | 'in_app')[];
}

interface QuietHours {
  enabled: boolean;
  startHour: number; // 0-23
  endHour: number;   // 0-23
}
```

---

## 使用例 {#examples}

### 例1: 会議リマインダー送信

```typescript
// 会議の15分前にリマインダーを送信
const sendMeetingReminder = async (meetingId: string, participantIds: string[]) => {
  const response = await fetch('/api/v1/bc-007/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientIds: participantIds,
      priority: 'high',
      type: 'meeting_reminder',
      title: '会議リマインダー: プロジェクトレビュー',
      body: '15分後に開始されます',
      data: {
        meetingId,
        startTime: '2025-11-03T14:00:00.000Z'
      },
      actionUrl: `/meetings/${meetingId}`
    })
  });

  const result = await response.json();
  console.log(`Sent reminders to ${result.recipientCount} participants`);
};
```

---

### 例2: 緊急システムアラート

```typescript
// システム障害の緊急通知
const sendUrgentAlert = async (message: string, adminIds: string[]) => {
  const response = await fetch('/api/v1/bc-007/notifications/urgent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientIds: adminIds,
      type: 'system_alert',
      title: 'システム障害発生',
      body: message,
      data: {
        severity: 'critical',
        timestamp: new Date().toISOString()
      },
      actionUrl: '/admin/system-status'
    })
  });

  const result = await response.json();
  console.log(`Urgent alert sent, SLA: ${result.sla.deliveryTimeSeconds}s`);
};
```

---

### 例3: 通知設定カスタマイズ

```typescript
// ユーザーの通知設定を更新
const updateNotificationPreferences = async () => {
  const response = await fetch('/api/v1/bc-007/notification-preferences', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channels: {
        push: true,
        email: true,
        sms: false,
        in_app: true
      },
      typeSettings: {
        meeting_reminder: {
          enabled: true,
          channels: ['push', 'email']
        },
        new_message: {
          enabled: true,
          channels: ['push']
        },
        mention: {
          enabled: true,
          channels: ['push', 'email']
        }
      },
      quietHours: {
        enabled: true,
        startHour: 22,
        endHour: 8
      }
    })
  });

  const preferences = await response.json();
  console.log('Preferences updated:', preferences.updatedAt);
};
```

---

### 例4: 予約通知

```typescript
// 3日後にプロジェクト期限リマインダーを予約
const scheduleDeadlineReminder = async (
  projectId: string,
  teamMemberIds: string[],
  deadlineDate: Date
) => {
  // 期限の3日前に通知
  const reminderDate = new Date(deadlineDate);
  reminderDate.setDate(reminderDate.getDate() - 3);
  reminderDate.setHours(9, 0, 0, 0); // 9:00 AM

  const response = await fetch('/api/v1/bc-007/notifications/scheduled', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientIds: teamMemberIds,
      scheduledAt: reminderDate.toISOString(),
      priority: 'normal',
      type: 'deadline_approaching',
      title: 'プロジェクト期限リマインダー',
      body: `「Project Alpha」の期限まであと3日です`,
      data: {
        projectId,
        deadlineDate: deadlineDate.toISOString()
      },
      actionUrl: `/projects/${projectId}`
    })
  });

  const scheduled = await response.json();
  console.log(`Scheduled notification for ${scheduled.scheduledAt}`);
};
```

---

### 例5: 配信状況確認

```typescript
// 通知の配信状況を確認
const checkDeliveryStatus = async (notificationIds: string[]) => {
  const response = await fetch(
    `/api/v1/bc-007/notifications/delivery-status?notificationIds=${notificationIds.join(',')}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  const result = await response.json();

  result.statuses.forEach((status: any) => {
    console.log(`Notification ${status.notificationId}:`);
    console.log(`  Status: ${status.status}`);
    console.log(`  SLA Met: ${status.slaMetResult ? 'Yes' : 'No'}`);

    status.channels.forEach((channel: any) => {
      console.log(`  ${channel.channel}: ${channel.status} (${channel.deliveryTimeMs}ms)`);
    });
  });
};
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 通知API詳細化
