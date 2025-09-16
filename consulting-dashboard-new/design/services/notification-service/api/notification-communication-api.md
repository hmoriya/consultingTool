# 通知・コミュニケーションAPI

**更新日: 2025-01-13**

## 概要

プロジェクト内外のコミュニケーション、通知配信、承認フロー、コメント・ディスカッション機能を提供するAPI。

## エンドポイント一覧

### 通知管理
- `sendNotification` - 通知送信
- `getNotifications` - 通知一覧取得
- `markAsRead` - 既読マーク
- `updateNotificationSettings` - 通知設定更新
- `getNotificationHistory` - 通知履歴取得

### コメント・ディスカッション
- `createComment` - コメント作成
- `updateComment` - コメント更新
- `deleteComment` - コメント削除
- `getComments` - コメント一覧取得
- `createThread` - ディスカッションスレッド作成

### 承認フロー
- `createApprovalRequest` - 承認依頼作成
- `processApproval` - 承認処理
- `delegateApproval` - 承認委譲
- `getApprovalQueue` - 承認待ち一覧取得
- `getApprovalHistory` - 承認履歴取得

### 会議・コミュニケーション
- `scheduleMeeting` - 会議設定
- `updateMeeting` - 会議更新
- `createMeetingMinutes` - 議事録作成
- `distributeMinutes` - 議事録配信

### メッセージング
- `sendMessage` - メッセージ送信
- `createAnnouncement` - お知らせ作成
- `distributeReport` - レポート配信

## API詳細

### sendNotification

各種通知を送信する。

```typescript
async function sendNotification(
  data: SendNotificationInput
): Promise<NotificationResponse>
```

#### リクエスト
```typescript
interface SendNotificationInput {
  type: 'project_update' | 'task_assigned' | 'approval_required' | 
        'deadline_reminder' | 'risk_alert' | 'mention' | 'system'
  recipients: {
    users?: string[]
    roles?: string[]
    teams?: string[]
    channels?: string[]  // Slack, Teams等
  }
  content: {
    title: string
    message: string
    priority: 'high' | 'normal' | 'low'
    category?: string
    relatedEntity?: {
      type: 'project' | 'task' | 'risk' | 'document'
      id: string
      name: string
    }
    actions?: {
      label: string
      url: string
      type: 'primary' | 'secondary'
    }[]
  }
  delivery: {
    immediate?: boolean
    scheduleAt?: Date
    channels: ('in_app' | 'email' | 'slack' | 'teams' | 'sms')[]
    grouping?: 'none' | 'daily' | 'weekly'
  }
}
```

#### レスポンス
```typescript
interface NotificationResponse {
  success: boolean
  data?: {
    notificationId: string
    deliveryStatus: {
      total: number
      sent: number
      failed: number
      pending: number
    }
    failedRecipients?: {
      userId: string
      reason: string
      channel: string
    }[]
    scheduledAt?: Date
  }
  error?: string
}
```

---

### getNotifications

ユーザーの通知一覧を取得する。

```typescript
async function getNotifications(
  params?: GetNotificationsParams
): Promise<NotificationsListResponse>
```

#### リクエスト
```typescript
interface GetNotificationsParams {
  status?: 'unread' | 'read' | 'all'
  type?: string[]
  priority?: string[]
  dateRange?: {
    from: Date
    to: Date
  }
  limit?: number
  offset?: number
}
```

#### レスポンス
```typescript
interface NotificationsListResponse {
  success: boolean
  data?: {
    notifications: Notification[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
    summary: {
      unreadCount: number
      highPriorityCount: number
    }
  }
  error?: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  priority: string
  status: 'unread' | 'read'
  createdAt: Date
  readAt?: Date
  relatedEntity?: {
    type: string
    id: string
    name: string
    url: string
  }
  actions?: {
    label: string
    url: string
    completed: boolean
  }[]
}
```

---

### createComment

エンティティに対するコメントを作成する。

```typescript
async function createComment(
  data: CreateCommentInput
): Promise<CommentResponse>
```

#### リクエスト
```typescript
interface CreateCommentInput {
  entityType: 'project' | 'task' | 'risk' | 'document' | 'milestone'
  entityId: string
  content: string
  mentions?: string[]  // @ユーザーID
  attachments?: {
    name: string
    url: string
    type: string
    size: number
  }[]
  parentCommentId?: string  // 返信の場合
  isDecision?: boolean  // 決定事項としてマーク
}
```

#### レスポンス
```typescript
interface CommentResponse {
  success: boolean
  data?: {
    id: string
    entityType: string
    entityId: string
    content: string
    author: {
      id: string
      name: string
      avatar?: string
    }
    createdAt: Date
    updatedAt?: Date
    mentions: {
      id: string
      name: string
      notified: boolean
    }[]
    attachments?: Attachment[]
    reactions?: {
      type: string
      count: number
      users: string[]
    }[]
    threadInfo?: {
      parentId: string
      replyCount: number
      participants: string[]
    }
  }
  error?: string
}
```

---

### createApprovalRequest

承認依頼を作成する。

```typescript
async function createApprovalRequest(
  data: CreateApprovalRequestInput
): Promise<ApprovalRequestResponse>
```

#### リクエスト
```typescript
interface CreateApprovalRequestInput {
  type: 'timesheet' | 'expense' | 'document' | 'change_request' | 'risk_mitigation'
  title: string
  description: string
  entityId: string  // 承認対象のID
  approvalFlow: {
    steps: {
      order: number
      approvers: string[]  // ユーザーID
      type: 'all' | 'any'  // 全員承認 or 誰か一人
      deadline?: Date
    }[]
    escalation?: {
      afterDays: number
      escalateTo: string[]
    }
  }
  attachments?: Attachment[]
  urgency?: 'high' | 'normal' | 'low'
}
```

#### レスポンス
```typescript
interface ApprovalRequestResponse {
  success: boolean
  data?: {
    id: string
    requestNumber: string
    type: string
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
    currentStep: number
    totalSteps: number
    createdBy: {
      id: string
      name: string
    }
    createdAt: Date
    deadline?: Date
    approvalSteps: {
      order: number
      status: 'pending' | 'approved' | 'rejected'
      approvers: {
        id: string
        name: string
        status: 'pending' | 'approved' | 'rejected'
        respondedAt?: Date
        comments?: string
      }[]
    }[]
  }
  error?: string
}
```

---

### processApproval

承認処理を実行する。

```typescript
async function processApproval(
  approvalId: string,
  data: ProcessApprovalInput
): Promise<ProcessApprovalResponse>
```

#### リクエスト
```typescript
interface ProcessApprovalInput {
  action: 'approve' | 'reject' | 'request_info'
  comments?: string
  conditions?: string[]  // 条件付き承認
  attachments?: Attachment[]
}
```

#### レスポンス
```typescript
interface ProcessApprovalResponse {
  success: boolean
  data?: {
    approvalId: string
    action: string
    processedAt: Date
    processedBy: {
      id: string
      name: string
    }
    nextStep?: {
      order: number
      approvers: string[]
      notified: boolean
    }
    finalStatus?: 'approved' | 'rejected'
    postActions?: {
      type: string
      status: 'pending' | 'completed'
      description: string
    }[]
  }
  error?: string
}
```

---

### scheduleMeeting

会議を設定する。

```typescript
async function scheduleMeeting(
  data: ScheduleMeetingInput
): Promise<MeetingResponse>
```

#### リクエスト
```typescript
interface ScheduleMeetingInput {
  title: string
  projectId?: string
  purpose: string
  agenda: string[]
  startTime: Date
  endTime: Date
  location?: {
    type: 'physical' | 'online' | 'hybrid'
    details: string
    onlineUrl?: string
  }
  participants: {
    required: string[]
    optional: string[]
  }
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: Date
  }
  reminders?: {
    minutes: number
    channels: string[]
  }[]
}
```

#### レスポンス
```typescript
interface MeetingResponse {
  success: boolean
  data?: {
    id: string
    title: string
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    organizer: {
      id: string
      name: string
    }
    startTime: Date
    endTime: Date
    location: Location
    participants: {
      user: {
        id: string
        name: string
      }
      status: 'accepted' | 'declined' | 'tentative' | 'no_response'
      required: boolean
    }[]
    meetingUrl?: string
    calendarEvent?: {
      provider: string
      eventId: string
    }
  }
  error?: string
}
```

---

### createMeetingMinutes

議事録を作成する。

```typescript
async function createMeetingMinutes(
  meetingId: string,
  data: CreateMinutesInput
): Promise<MinutesResponse>
```

#### リクエスト
```typescript
interface CreateMinutesInput {
  attendees: string[]
  absentees?: string[]
  discussions: {
    topic: string
    summary: string
    speaker?: string
  }[]
  decisions: {
    item: string
    decision: string
    rationale?: string
  }[]
  actionItems: {
    task: string
    assignee: string
    dueDate: Date
    priority: 'high' | 'medium' | 'low'
  }[]
  nextMeeting?: {
    proposedDate: Date
    topics: string[]
  }
  attachments?: Attachment[]
}
```

#### レスポンス
```typescript
interface MinutesResponse {
  success: boolean
  data?: {
    id: string
    meetingId: string
    createdBy: {
      id: string
      name: string
    }
    createdAt: Date
    status: 'draft' | 'final' | 'distributed'
    summary: {
      attendeeCount: number
      decisionCount: number
      actionItemCount: number
    }
    distributionList?: string[]
    tasksCreated?: {
      id: string
      title: string
      assignee: string
    }[]
  }
  error?: string
}
```

---

### updateNotificationSettings

ユーザーの通知設定を更新する。

```typescript
async function updateNotificationSettings(
  data: UpdateNotificationSettingsInput
): Promise<NotificationSettingsResponse>
```

#### リクエスト
```typescript
interface UpdateNotificationSettingsInput {
  categories: {
    category: string
    enabled: boolean
    channels: string[]
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly'
  }[]
  workingHours?: {
    enabled: boolean
    timezone: string
    start: string  // "09:00"
    end: string    // "18:00"
    days: number[] // 0-6 (日-土)
  }
  quietHours?: {
    enabled: boolean
    start: string
    end: string
  }
  language?: string
  emailDigest?: {
    enabled: boolean
    frequency: 'daily' | 'weekly'
    time: string
  }
}
```

---

### sendMessage

ダイレクトメッセージまたはグループメッセージを送信する。

```typescript
async function sendMessage(
  data: SendMessageInput
): Promise<MessageResponse>
```

#### リクエスト
```typescript
interface SendMessageInput {
  recipients: string[]  // ユーザーIDまたはグループID
  subject?: string
  content: string
  type: 'direct' | 'group' | 'broadcast'
  priority?: 'high' | 'normal' | 'low'
  attachments?: Attachment[]
  replyTo?: string  // 返信の場合の元メッセージID
  expiresAt?: Date  // メッセージの有効期限
}
```

## 共通インターフェース

### 添付ファイル
```typescript
interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedBy?: string
  uploadedAt?: Date
}
```

### 通知チャネル設定
```typescript
interface ChannelConfig {
  channel: 'email' | 'in_app' | 'slack' | 'teams' | 'sms'
  enabled: boolean
  settings?: {
    webhookUrl?: string
    channelId?: string
    template?: string
  }
}
```

## エラーハンドリング

### 共通エラー
- `RECIPIENT_NOT_FOUND`: 受信者が見つかりません
- `INVALID_NOTIFICATION_TYPE`: 無効な通知タイプです
- `DELIVERY_FAILED`: 配信に失敗しました
- `RATE_LIMIT_EXCEEDED`: レート制限を超えました

### 承認固有エラー
- `APPROVAL_NOT_FOUND`: 承認依頼が見つかりません
- `NOT_AUTHORIZED_TO_APPROVE`: 承認権限がありません
- `APPROVAL_ALREADY_PROCESSED`: 既に処理済みです
- `APPROVAL_EXPIRED`: 承認期限が切れています

## パフォーマンス最適化

### バッチ処理
- 大量通知は非同期バッチ処理
- 配信ステータスの非同期更新
- 失敗時の自動リトライ

### 通知グルーピング
- 同一ユーザーへの通知を集約
- ダイジェスト形式での配信
- 重要度に応じた即時/遅延配信

### キャッシュ
- 通知テンプレート: 1時間キャッシュ
- ユーザー設定: セッション中キャッシュ
- 承認フロー定義: 24時間キャッシュ