# BC-007: ドメイン設計

**BC**: Team Communication & Collaboration
**作成日**: 2025-10-31
**V2移行元**: services/collaboration-facilitation-service/domain-language.md

---

## 概要

このドキュメントは、BC-007（チームコミュニケーションとコラボレーション）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Message Aggregate
**集約ルート**: Message [Message] [MESSAGE]
- **責務**: メッセージのライフサイクル管理
- **包含エンティティ**: MessageContent, MessageRecipient
- **不変条件**: 送信済みメッセージは編集不可

### 2. Notification Aggregate
**集約ルート**: Notification [Notification] [NOTIFICATION]
- **責務**: 通知の配信と管理
- **包含エンティティ**: NotificationRecipient, NotificationDeliveryStatus
- **不変条件**: 緊急通知は即座配信必須

### 3. Workspace Aggregate
**集約ルート**: Workspace [Workspace] [WORKSPACE]
- **責務**: コラボレーションスペース管理
- **包含エンティティ**: WorkspaceMember, SharedDocument
- **不変条件**: ワークスペースは少なくとも1人のオーナーを持つ

---

## 主要エンティティ（Entities）

### Message [Message] [MESSAGE]
メッセージ [Message] [MESSAGE]
├── メッセージID [MessageID] [MESSAGE_ID]: UUID
├── 内容 [Content] [CONTENT]: TEXT
├── 送信者ID [SenderID] [SENDER_ID]: UUID
├── チャネル [Channel] [CHANNEL]: ENUM（chat/email/sms）
├── 状態 [Status] [STATUS]: ENUM（draft/sent/delivered/read）
└── 送信日時 [SentAt] [SENT_AT]: TIMESTAMP

### Notification [Notification] [NOTIFICATION]
通知 [Notification] [NOTIFICATION]
├── 通知ID [NotificationID] [NOTIFICATION_ID]: UUID
├── タイトル [Title] [TITLE]: STRING_200
├── メッセージ [Message] [MESSAGE]: TEXT
├── 優先度 [Priority] [PRIORITY]: ENUM（low/normal/high/urgent）
├── タイプ [Type] [TYPE]: STRING_50
├── 状態 [Status] [STATUS]: ENUM（pending/sent/delivered/read）
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Meeting [Meeting] [MEETING]
会議 [Meeting] [MEETING]
├── 会議ID [MeetingID] [MEETING_ID]: UUID
├── タイトル [Title] [TITLE]: STRING_200
├── 開始時刻 [StartTime] [START_TIME]: TIMESTAMP
├── 終了時刻 [EndTime] [END_TIME]: TIMESTAMP
├── 場所 [Location] [LOCATION]: STRING_200
├── オンラインURL [OnlineURL] [ONLINE_URL]: STRING_500
└── 状態 [Status] [STATUS]: ENUM（scheduled/in_progress/completed/cancelled）

### Workspace [Workspace] [WORKSPACE]
ワークスペース [Workspace] [WORKSPACE]
├── ワークスペースID [WorkspaceID] [WORKSPACE_ID]: UUID
├── 名前 [Name] [NAME]: STRING_200
├── 説明 [Description] [DESCRIPTION]: TEXT
├── プロジェクトID [ProjectID] [PROJECT_ID]: UUID（BC-001連携）
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

---

## 主要値オブジェクト（Value Objects）

### NotificationPriority [NotificationPriority] [NOTIFICATION_PRIORITY]
通知優先度 [NotificationPriority] [NOTIFICATION_PRIORITY]
├── 優先度レベル [priorityLevel] [PRIORITY_LEVEL]: ENUM（low/normal/high/urgent）
├── SLA [sla] [SLA]: INTEGER（秒）
└── 配信方式 [deliveryMethod] [DELIVERY_METHOD]: ENUM（push/email/sms/all）

### MessageContent [MessageContent] [MESSAGE_CONTENT]
メッセージ内容 [MessageContent] [MESSAGE_CONTENT]
├── プレーンテキスト [plainText] [PLAIN_TEXT]: TEXT
├── リッチテキスト [richText] [RICH_TEXT]: TEXT（HTML形式）
├── 添付ファイル [attachments] [ATTACHMENTS]: ARRAY<STRING>
└── メンション [mentions] [MENTIONS]: ARRAY<UUID>

---

## ドメインサービス

### CommunicationFacilitationService
**責務**: コミュニケーション促進
- `facilitateRealTimeCommunication()`: リアルタイム通信促進
- `manageMeeting()`: 会議管理
- `broadcastMessage()`: メッセージ一斉配信

### NotificationDeliveryService
**責務**: 通知配信
- `sendNotification()`: 通知配信（優先度ベース）
- `sendUrgentNotification()`: 緊急通知配信（SLA: 10秒）
- `retryFailedNotifications()`: 失敗通知の再送

### CollaborationManagementService
**責務**: コラボレーション管理
- `createWorkspace()`: ワークスペース作成
- `manageWorkspaceAccess()`: アクセス管理（→ BC-003連携）
- `trackCollaborationActivity()`: コラボレーション活動追跡

---

## V2からの移行メモ

### 移行済み
- ✅ Message, Notification, Meeting, Workspaceエンティティの定義
- ✅ 集約境界の明確化
- ✅ 通知機能の統合（deliver-immediate-information統合）

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
