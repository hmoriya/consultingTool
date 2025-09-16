# 通知・コミュニケーションサービス ドメインモデル

**更新日: 2025-01-13**

## 概要
通知・コミュニケーションサービスに関連するドメインモデルを定義する。通知、コメント、承認フロー、会議管理などのコミュニケーション機能を管理する。

## エンティティ

### Notification（通知）
```
Notification {
  id: string
  type: NotificationType
  recipientId: string    // 外部参照
  title: string
  message: string
  priority: Priority
  category: string?
  relatedEntity: RelatedEntity?
  status: NotificationStatus
  channels: NotificationChannel[]
  scheduledAt: DateTime?
  sentAt: DateTime?
  readAt: DateTime?
  expiresAt: DateTime?
  actions: NotificationAction[]
  metadata: JSON?
  createdAt: DateTime
}

enum NotificationType {
  PROJECT_UPDATE     // プロジェクト更新
  TASK_ASSIGNED      // タスク割り当て
  TASK_DUE           // タスク期限
  APPROVAL_REQUIRED  // 承認依頼
  APPROVAL_RESULT    // 承認結果
  DEADLINE_REMINDER  // 期限リマインダー
  RISK_ALERT         // リスクアラート
  MENTION            // メンション
  SYSTEM             // システム通知
  ANNOUNCEMENT       // お知らせ
}

enum NotificationStatus {
  PENDING            // 送信待ち
  SENT               // 送信済み
  DELIVERED          // 配信済み
  READ               // 既読
  FAILED             // 失敗
  EXPIRED            // 期限切れ
}

enum NotificationChannel {
  IN_APP             // アプリ内
  EMAIL              // メール
  SMS                // SMS
  SLACK              // Slack
  TEAMS              // Teams
  PUSH               // プッシュ通知
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

### RelatedEntity（関連エンティティ）
```
RelatedEntity {
  type: EntityType
  id: string
  name: string
  url: string?
}

enum EntityType {
  PROJECT
  TASK
  RISK
  DOCUMENT
  MILESTONE
  USER
  COMMENT
}
```

### NotificationAction（通知アクション）
```
NotificationAction {
  label: string
  url: string
  type: ActionType
  completed: boolean
}

enum ActionType {
  PRIMARY
  SECONDARY
  DANGER
}
```

### NotificationPreference（通知設定）
```
NotificationPreference {
  id: string
  userId: string       // 外部参照
  category: string
  enabled: boolean
  channels: NotificationChannel[]
  frequency: NotificationFrequency
  workingHoursOnly: boolean
  timezone: string
  quietHours: TimeRange?
  language: string
  updatedAt: DateTime
}

enum NotificationFrequency {
  IMMEDIATE          // 即時
  HOURLY             // 1時間ごと
  DAILY              // 日次
  WEEKLY             // 週次
  NEVER              // 通知しない
}
```

### Comment（コメント）
```
Comment {
  id: string
  entityType: EntityType
  entityId: string
  authorId: string     // 外部参照
  content: string
  mentions: Mention[]
  attachments: Attachment[]
  parentCommentId: string?
  isDecision: boolean
  isEdited: boolean
  reactions: Reaction[]
  status: CommentStatus
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime?
}

enum CommentStatus {
  ACTIVE             // アクティブ
  EDITED             // 編集済み
  DELETED            // 削除済み
  HIDDEN             // 非表示
}
```

### Mention（メンション）
```
Mention {
  id: string
  userId: string       // 外部参照
  notified: boolean
  acknowledgedAt: DateTime?
}
```

### Reaction（リアクション）
```
Reaction {
  userId: string       // 外部参照
  type: ReactionType
  createdAt: DateTime
}

enum ReactionType {
  LIKE               // いいね
  LOVE               // ハート
  CELEBRATE          // 祝い
  INSIGHTFUL         // 洞察的
  CURIOUS            // 興味深い
}
```

### ApprovalRequest（承認依頼）
```
ApprovalRequest {
  id: string
  requestNumber: string
  type: ApprovalType
  title: string
  description: string
  entityId: string     // 承認対象
  requesterId: string  // 外部参照
  urgency: Urgency
  flow: ApprovalFlow
  currentStep: number
  status: ApprovalStatus
  deadline: DateTime?
  attachments: Attachment[]
  createdAt: DateTime
  completedAt: DateTime?
}

enum ApprovalType {
  TIMESHEET          // 工数承認
  EXPENSE            // 経費承認
  DOCUMENT           // ドキュメント承認
  CHANGE_REQUEST     // 変更依頼承認
  RISK_MITIGATION    // リスク対策承認
  BUDGET             // 予算承認
  CONTRACT           // 契約承認
}

enum ApprovalStatus {
  PENDING            // 承認待ち
  IN_PROGRESS        // 承認中
  APPROVED           // 承認済み
  REJECTED           // 却下
  CANCELLED          // キャンセル
  EXPIRED            // 期限切れ
}

enum Urgency {
  LOW
  NORMAL
  HIGH
  CRITICAL
}
```

### ApprovalFlow（承認フロー）
```
ApprovalFlow {
  id: string
  name: string
  steps: ApprovalStep[]
  escalation: EscalationRule?
}
```

### ApprovalStep（承認ステップ）
```
ApprovalStep {
  order: number
  approvers: Approver[]
  type: StepType
  deadline: number?    // 時間（時間単位）
  status: StepStatus
}

enum StepType {
  ALL                // 全員承認必要
  ANY                // 誰か一人承認
  WEIGHTED           // 重み付き承認
}

enum StepStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  SKIPPED
}
```

### Approver（承認者）
```
Approver {
  userId: string       // 外部参照
  status: ApproverStatus
  weight: number?      // 重み付き承認の場合
  delegatedTo: string? // 代理承認者
  respondedAt: DateTime?
  comments: string?
}

enum ApproverStatus {
  PENDING
  APPROVED
  REJECTED
  DELEGATED
  ABSTAINED
}
```

### Meeting（会議）
```
Meeting {
  id: string
  title: string
  projectId: string?   // 外部参照
  purpose: string
  agenda: string[]
  organizer: string    // 外部参照
  startTime: DateTime
  endTime: DateTime
  location: Location
  participants: Participant[]
  status: MeetingStatus
  recurrence: RecurrenceRule?
  reminders: Reminder[]
  attachments: Attachment[]
  minutes: MeetingMinutes?
  createdAt: DateTime
  updatedAt: DateTime
}

enum MeetingStatus {
  SCHEDULED          // 予定済み
  IN_PROGRESS        // 進行中
  COMPLETED          // 完了
  CANCELLED          // キャンセル
  POSTPONED          // 延期
}
```

### Participant（参加者）
```
Participant {
  userId: string       // 外部参照
  required: boolean
  status: ParticipantStatus
  responseTime: DateTime?
  notes: string?
}

enum ParticipantStatus {
  NO_RESPONSE        // 未回答
  ACCEPTED           // 参加
  DECLINED           // 不参加
  TENTATIVE          // 仮参加
}
```

### MeetingMinutes（議事録）
```
MeetingMinutes {
  id: string
  meetingId: string
  recordedBy: string   // 外部参照
  attendees: string[]
  absentees: string[]
  discussions: Discussion[]
  decisions: Decision[]
  actionItems: ActionItem[]
  nextMeeting: NextMeeting?
  attachments: Attachment[]
  status: MinutesStatus
  distributedAt: DateTime?
  createdAt: DateTime
}

enum MinutesStatus {
  DRAFT              // 下書き
  FINAL              // 確定
  DISTRIBUTED        // 配信済み
}
```

### Discussion（議論内容）
```
Discussion {
  topic: string
  summary: string
  speaker: string?     // 外部参照
  duration: number?
  keyPoints: string[]
}
```

### Decision（決定事項）
```
Decision {
  item: string
  decision: string
  rationale: string?
  owner: string?       // 外部参照
  deadline: Date?
}
```

### ActionItem（アクションアイテム）
```
ActionItem {
  id: string
  task: string
  assignee: string     // 外部参照
  dueDate: Date
  priority: Priority
  status: ActionItemStatus
  createdTaskId: string?  // 外部参照
}

enum ActionItemStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### Message（メッセージ）
```
Message {
  id: string
  type: MessageType
  senderId: string     // 外部参照
  recipients: string[] // 外部参照
  subject: string?
  content: string
  priority: Priority
  attachments: Attachment[]
  thread: MessageThread?
  status: MessageStatus
  sentAt: DateTime
  readBy: ReadReceipt[]
  expiresAt: DateTime?
}

enum MessageType {
  DIRECT             // ダイレクトメッセージ
  GROUP              // グループメッセージ
  BROADCAST          // ブロードキャスト
  ANNOUNCEMENT       // アナウンス
}

enum MessageStatus {
  DRAFT
  SENT
  DELIVERED
  FAILED
  EXPIRED
}
```

### ReadReceipt（既読情報）
```
ReadReceipt {
  userId: string       // 外部参照
  readAt: DateTime
}
```

## 値オブジェクト

### Location（場所）
```
Location {
  type: LocationType
  name: string
  address: string?
  room: string?
  onlineUrl: string?
  dialInNumber: string?
  accessCode: string?
}

enum LocationType {
  PHYSICAL           // 物理的な場所
  ONLINE             // オンライン
  HYBRID             // ハイブリッド
}
```

### RecurrenceRule（繰り返しルール）
```
RecurrenceRule {
  pattern: RecurrencePattern
  interval: number
  daysOfWeek: DayOfWeek[]?
  dayOfMonth: number?
  endDate: Date?
  occurrences: number?
}

enum RecurrencePattern {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}
```

### Reminder（リマインダー）
```
Reminder {
  minutes: number      // 何分前
  channels: NotificationChannel[]
}
```

### TimeRange（時間範囲）
```
TimeRange {
  startTime: string    // "HH:mm"
  endTime: string      // "HH:mm"
}
```

### MessageThread（メッセージスレッド）
```
MessageThread {
  id: string
  subject: string
  messageCount: number
  lastMessageAt: DateTime
}
```

### Attachment（添付ファイル）
```
Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  uploadedBy: string   // 外部参照
  uploadedAt: DateTime
}
```

### EscalationRule（エスカレーションルール）
```
EscalationRule {
  afterHours: number
  escalateTo: string[] // 外部参照
  maxEscalations: number
}
```

## 集約ルート

- `Notification`: 通知管理の集約ルート
- `Comment`: コメント・ディスカッションの集約ルート
- `ApprovalRequest`: 承認フローの集約ルート
- `Meeting`: 会議管理の集約ルート
- `Message`: メッセージングの集約ルート

## ドメインサービス

### NotificationService
- 通知の生成・配信
- チャネル別配信制御
- 配信スケジューリング

### ApprovalWorkflowService
- 承認フローの実行
- エスカレーション処理
- 代理承認管理

### MeetingService
- 会議スケジューリング
- 参加者調整
- リマインダー送信

### CommentService
- コメントスレッド管理
- メンション処理
- リアクション集計

### MessageService
- メッセージ配信
- 既読管理
- スレッド管理