# BC-007: ドメイン層設計 [Domain Layer Design]

**BC**: Team Communication & Collaboration [チームコミュニケーション・コラボレーション] [BC_007]
**作成日**: 2025-10-31
**最終更新**: 2025-11-04
**V2移行元**: services/collaboration-facilitation-service/domain-language.md

---

## 目次

1. [概要](#overview)
2. [ドメインアーキテクチャ](#architecture)
3. [主要集約](#aggregates)
4. [BC間連携](#inter-bc-integration)
5. [ドメインイベント](#domain-events)
6. [ビジネスルール](#business-rules)
7. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-007は、チームの円滑なコミュニケーションとコラボレーションを促進するためのドメインです。リアルタイムメッセージング、優先度ベースの通知配信、会議管理、共同作業スペースの機能を提供します。

### ドメインの責務

- **メッセージング**: チャット、メール、SMSによる多様なコミュニケーション
- **通知配信**: 優先度とSLAに基づく確実な通知配信
- **会議管理**: スケジューリング、オンライン会議、議事録管理
- **コラボレーション**: 共同作業スペース、ドキュメント共有、活動追跡

### 設計原則

- **リアルタイム性**: WebSocketによる即時配信
- **信頼性**: メッセージ配信保証、リトライ機構
- **スケーラビリティ**: メッセージキューによる非同期処理
- **マルチチャネル**: 複数の配信チャネルに対応
- **ユーザー中心**: 通知設定のカスタマイズ可能

---

## ドメインアーキテクチャ {#architecture}

### サブドメイン構成

```
BC-007: Team Communication & Collaboration
├── Messaging Context [メッセージングコンテキスト]
│   ├── Direct Messaging [ダイレクトメッセージング]
│   ├── Channel Messaging [チャネルメッセージング]
│   ├── Thread Management [スレッド管理]
│   └── Message Search [メッセージ検索]
│
├── Notification Context [通知コンテキスト]
│   ├── Notification Delivery [通知配信]
│   ├── Priority Management [優先度管理]
│   ├── Delivery Tracking [配信追跡]
│   └── User Preferences [ユーザー設定]
│
├── Meeting Context [会議コンテキスト]
│   ├── Meeting Scheduling [会議スケジューリング]
│   ├── Online Meeting [オンライン会議]
│   ├── Meeting Notes [議事録]
│   └── Action Items [アクションアイテム]
│
└── Collaboration Context [コラボレーションコンテキスト]
    ├── Workspace Management [ワークスペース管理]
    ├── Document Sharing [ドキュメント共有]
    ├── Real-time Editing [リアルタイム編集]
    └── Activity Tracking [活動追跡]
```

### BC間連携

```
BC-007の依存関係:
├── BC-001 (Project Delivery): プロジェクトチャネル、タスク通知
├── BC-003 (Access Control): 認証、権限管理
├── BC-005 (Team & Resource): チームメンバー情報
├── BC-006 (Knowledge Management): ナレッジ共有通知
└── 外部システム: メールサーバー(SMTP)、SMSゲートウェイ、WebRTC
```

---

## 主要集約 {#aggregates}

BC-007は4つの主要集約で構成されます：

### 1. Message Aggregate [メッセージ集約]

**集約ルート**: Message [メッセージ] [MESSAGE]

**責務**: メッセージのライフサイクル管理、配信、既読管理

**主要エンティティ**:
- Message [メッセージ]
- MessageThread [メッセージスレッド]
- MessageReaction [リアクション]
- MessageAttachment [添付ファイル]

**主要値オブジェクト**:
- MessageContent [メッセージ内容]
- MessageRecipient [受信者]
- ReadStatus [既読状態]

**不変条件**:
- 送信済みメッセージは削除不可（論理削除のみ）
- スレッド内のメッセージは時系列順序を保つ
- 添付ファイルは最大10個、合計100MB以内

**詳細**: [messaging.md](messaging.md)

---

### 2. Notification Aggregate [通知集約]

**集約ルート**: Notification [通知] [NOTIFICATION]

**責務**: 通知の生成、優先度管理、配信保証

**主要エンティティ**:
- Notification [通知]
- NotificationRecipient [通知受信者]
- NotificationDeliveryLog [配信ログ]

**主要値オブジェクト**:
- NotificationPriority [通知優先度]
- DeliveryChannel [配信チャネル]
- DeliveryStatus [配信状態]

**不変条件**:
- 緊急通知(urgent)は10秒以内に配信開始（SLA）
- 高優先度(high)は1分以内に配信開始
- 配信失敗時は最大3回までリトライ

**詳細**: [notification.md](notification.md)

---

### 3. Meeting Aggregate [会議集約]

**集約ルート**: Meeting [会議] [MEETING]

**責務**: 会議のスケジューリング、参加者管理、議事録管理

**主要エンティティ**:
- Meeting [会議]
- MeetingParticipant [参加者]
- MeetingAgenda [議題]
- MeetingMinutes [議事録]
- ActionItem [アクションアイテム]

**主要値オブジェクト**:
- MeetingSchedule [会議スケジュール]
- MeetingLocation [会議場所]
- ParticipantStatus [参加状態]

**不変条件**:
- 会議は最低1人のオーガナイザーを持つ
- 開始時刻 < 終了時刻
- 定期会議は最大2年先まで作成可能

**詳細**: [meeting.md](meeting.md)

---

### 4. Workspace Aggregate [ワークスペース集約]

**集約ルート**: Workspace [ワークスペース] [WORKSPACE]

**責務**: コラボレーションスペース管理、メンバー管理、活動追跡

**主要エンティティ**:
- Workspace [ワークスペース]
- WorkspaceMember [メンバー]
- SharedDocument [共有ドキュメント]
- WorkspaceChannel [チャネル]
- WorkspaceActivity [活動記録]

**主要値オブジェクト**:
- MemberRole [メンバーロール]
- AccessPermission [アクセス権限]
- ActivityType [活動タイプ]

**不変条件**:
- ワークスペースは最低1人のオーナーを持つ
- プライベートワークスペースは招待制のみ
- 共有ドキュメントは最大1000件

**詳細**: [collaboration.md](collaboration.md)

---

## BC間連携 {#inter-bc-integration}

### BC-001 (Project Delivery) との連携

**プロジェクトチャネル自動作成**:
```typescript
// プロジェクト作成時にチャネル自動生成
class ProjectCreatedEventHandler {
  async handle(event: ProjectCreatedEvent): Promise<void> {
    const workspace = await this.workspaceService.createForProject(
      event.projectId,
      event.projectName,
      event.teamMembers
    );

    // デフォルトチャネル作成
    await workspace.createChannel('general', '全般');
    await workspace.createChannel('tech', '技術');
    await workspace.createChannel('delivery', '納品');
  }
}
```

**タスク完了通知**:
```typescript
// タスク完了時に担当者と関係者に通知
class TaskCompletedEventHandler {
  async handle(event: TaskCompletedEvent): Promise<void> {
    const notification = new Notification(
      'タスク完了',
      `${event.taskTitle}が完了しました`,
      NotificationPriority.normal(),
      'task_completed'
    );

    // 担当者、レビュワー、PMに通知
    await this.notificationService.send(notification, [
      event.assigneeId,
      ...event.reviewerIds,
      event.projectManagerId
    ]);
  }
}
```

---

### BC-003 (Access Control) との連携

**メッセージ・ワークスペースのアクセス制御**:
```typescript
class WorkspaceAccessControl {
  async canAccessWorkspace(
    userId: UserId,
    workspaceId: WorkspaceId
  ): Promise<boolean> {
    // BC-003の権限チェック
    const hasPermission = await this.accessControlService.checkPermission(
      userId,
      `workspace:${workspaceId}`,
      'read'
    );

    if (!hasPermission) {
      throw new WorkspaceAccessDeniedError(userId, workspaceId);
    }

    return true;
  }
}
```

---

### BC-005 (Team & Resource) との連携

**チームメンバー情報の参照**:
```typescript
class NotificationRecipientResolver {
  async resolveRecipients(
    recipientType: 'user' | 'team' | 'role',
    recipientIds: string[]
  ): Promise<UserId[]> {
    if (recipientType === 'team') {
      // BC-005からチームメンバー取得
      const members = await this.teamService.getTeamMembers(recipientIds);
      return members.map(m => m.userId);
    }

    if (recipientType === 'role') {
      // BC-003からロール保持者取得
      const users = await this.accessControlService.getUsersByRole(recipientIds);
      return users.map(u => u.userId);
    }

    return recipientIds.map(id => new UserId(id));
  }
}
```

---

### BC-006 (Knowledge Management) との連携

**ナレッジ公開通知**:
```typescript
class KnowledgePublishedEventHandler {
  async handle(event: KnowledgePublishedEvent): Promise<void> {
    // 購読者に通知
    const subscribers = await this.getSubscribers(event.categoryId);

    const notification = new Notification(
      '新しいナレッジが公開されました',
      `${event.articleTitle}が公開されました`,
      NotificationPriority.normal(),
      'knowledge_published'
    );

    notification.setData({
      articleId: event.articleId,
      articleUrl: `/knowledge/${event.articleId}`
    });

    await this.notificationService.send(notification, subscribers);
  }
}
```

---

## ドメインイベント {#domain-events}

BC-007が発行・処理するドメインイベント：

### 発行イベント

#### メッセージング関連

```typescript
class MessageSentEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly senderId: UserId,
    public readonly recipientIds: UserId[],
    public readonly channelType: ChannelType,
    public readonly sentAt: Date
  ) {}
}

class MessageReadEvent {
  constructor(
    public readonly messageId: MessageId,
    public readonly readerId: UserId,
    public readonly readAt: Date
  ) {}
}

class MessageThreadCreatedEvent {
  constructor(
    public readonly threadId: ThreadId,
    public readonly parentMessageId: MessageId,
    public readonly creatorId: UserId
  ) {}
}
```

#### 通知関連

```typescript
class NotificationSentEvent {
  constructor(
    public readonly notificationId: NotificationId,
    public readonly recipientIds: UserId[],
    public readonly priority: NotificationPriority,
    public readonly sentAt: Date
  ) {}
}

class NotificationDeliveredEvent {
  constructor(
    public readonly notificationId: NotificationId,
    public readonly recipientId: UserId,
    public readonly channel: DeliveryChannel,
    public readonly deliveredAt: Date
  ) {}
}

class NotificationReadEvent {
  constructor(
    public readonly notificationId: NotificationId,
    public readonly userId: UserId,
    public readonly readAt: Date
  ) {}
}
```

#### 会議関連

```typescript
class MeetingScheduledEvent {
  constructor(
    public readonly meetingId: MeetingId,
    public readonly organizerId: UserId,
    public readonly participantIds: UserId[],
    public readonly startTime: Date,
    public readonly endTime: Date
  ) {}
}

class MeetingStartedEvent {
  constructor(
    public readonly meetingId: MeetingId,
    public readonly startedAt: Date,
    public readonly participantCount: number
  ) {}
}

class MeetingCompletedEvent {
  constructor(
    public readonly meetingId: MeetingId,
    public readonly completedAt: Date,
    public readonly minutesId: MinutesId,
    public readonly actionItemCount: number
  ) {}
}
```

#### ワークスペース関連

```typescript
class WorkspaceCreatedEvent {
  constructor(
    public readonly workspaceId: WorkspaceId,
    public readonly name: string,
    public readonly creatorId: UserId,
    public readonly projectId?: ProjectId
  ) {}
}

class WorkspaceMemberAddedEvent {
  constructor(
    public readonly workspaceId: WorkspaceId,
    public readonly memberId: UserId,
    public readonly role: MemberRole,
    public readonly addedBy: UserId
  ) {}
}
```

---

### 処理イベント（他BCからの受信）

```typescript
// BC-001: Project Delivery
- ProjectCreatedEvent → ワークスペース自動作成
- TaskAssignedEvent → 担当者通知
- TaskCompletedEvent → 完了通知
- DeadlineApproachingEvent → リマインダー通知

// BC-003: Access Control
- UserDeactivatedEvent → メッセージアクセス無効化
- RoleChangedEvent → ワークスペース権限更新

// BC-005: Team & Resource
- TeamMemberAddedEvent → ワークスペースメンバー追加
- TeamMemberRemovedEvent → ワークスペースメンバー削除

// BC-006: Knowledge Management
- KnowledgePublishedEvent → 購読者通知
- CourseCompletedEvent → 修了おめでとう通知
```

---

## ビジネスルール {#business-rules}

### 1. メッセージング規則

**送信制限**:
- 1ユーザーあたり1分間に最大100メッセージ（スパム防止）
- 添付ファイルは1メッセージあたり最大10個、合計100MB
- メンション数は1メッセージあたり最大20人

**既読管理**:
- ダイレクトメッセージ: 全受信者の既読状態を追跡
- チャネルメッセージ: 個別の既読は追跡しない（最終既読位置のみ）

**編集・削除**:
- メッセージは送信後5分以内のみ編集可能
- 削除は論理削除（編集履歴は保持）
- スレッドの親メッセージは削除不可

---

### 2. 通知配信規則

**優先度別SLA**:

| 優先度 | SLA | 配信方法 | リトライ |
|-------|-----|---------|---------|
| urgent | 10秒以内 | Push + Email + SMS | 3回（5秒間隔） |
| high | 1分以内 | Push + Email | 3回（30秒間隔） |
| normal | 5分以内 | Push | 2回（2分間隔） |
| low | Best Effort | アプリ内のみ | なし |

**配信チャネル優先順位**:
```
1. Push通知（アプリ起動中）
2. WebSocket（リアルタイム）
3. Email（Pushが失敗時）
4. SMS（urgentかつEmail失敗時）
```

**ユーザー設定の尊重**:
- ユーザーが設定した通知OFFの時間帯は配信しない
- 特定カテゴリの通知OFFも尊重
- ただし、urgent通知は常に配信（システムアラート等）

---

### 3. 会議管理規則

**スケジューリング制約**:
- 会議は最低15分、最大8時間
- 同時刻に複数の会議に参加不可（ダブルブッキング防止）
- 開始24時間前までキャンセル・変更可能（それ以降は要承認）

**定期会議**:
- 繰り返しパターン: 毎日、毎週、毎月、カスタム
- 最大2年先まで作成可能
- 全体変更 or 個別変更の選択可能

**議事録とアクションアイテム**:
- 会議終了後、オーガナイザーが議事録を作成
- アクションアイテムは担当者と期限必須
- 期限3日前にリマインダー通知

---

### 4. ワークスペース規則

**メンバー管理**:
- ワークスペースは最低1人のオーナー必須
- オーナーは他のオーナーを追加可能
- 最後のオーナーは退出不可（譲渡が必要）

**アクセス制御**:
- Public: 全メンバーがアクセス可能
- Private: 招待されたメンバーのみ
- Restricted: 特定ロールのみ（BC-003連携）

**ドキュメント共有**:
- 共有ドキュメントは最大1000件/ワークスペース
- バージョン履歴は最大100世代
- 同時編集は最大10人まで

---

## 詳細ドキュメント {#detailed-docs}

BC-007ドメイン層の詳細は以下のドキュメントを参照してください：

1. **[messaging.md](messaging.md)** - メッセージング詳細
   - Message Aggregate実装
   - チャネル・スレッド管理
   - 既読・リアクション機能
   - 添付ファイル管理
   - TypeScript実装例

2. **[notification.md](notification.md)** - 通知システム詳細
   - Notification Aggregate実装
   - 優先度管理とSLA
   - 配信チャネル戦略
   - リトライ機構
   - ユーザー設定管理

3. **[meeting.md](meeting.md)** - 会議管理詳細
   - Meeting Aggregate実装
   - スケジューリングロジック
   - 定期会議管理
   - 議事録・アクションアイテム
   - オンライン会議統合

4. **[collaboration.md](collaboration.md)** - コラボレーション詳細
   - Workspace Aggregate実装
   - メンバー・権限管理
   - ドキュメント共有
   - リアルタイム編集
   - 活動追跡

5. **[domain-services.md](domain-services.md)** - ドメインサービス詳細
   - Communication Facilitation Service
   - Notification Delivery Service
   - Collaboration Management Service
   - 統合シナリオ

---

## パフォーマンス考慮事項

### メッセージング

- **WebSocket接続管理**: 最大10,000同時接続/インスタンス
- **メッセージスループット**: 10,000メッセージ/秒
- **検索レスポンス**: <500ms (Elasticsearchインデックス)

### 通知配信

- **配信レイテンシ**: urgent=10s、high=1min、normal=5min
- **同時配信数**: 100,000通知/分（Kafka + Redis Queue）
- **リトライバッファ**: 最大1M通知

### 会議管理

- **スケジュール検索**: <100ms（インデックス最適化）
- **定期会議生成**: <1s (バックグラウンドジョブ)

### ワークスペース

- **リアルタイム更新**: <100ms（WebSocket + Redis Pub/Sub）
- **ドキュメント同期**: Operational Transformation (OT)

---

**最終更新**: 2025-11-04
**ステータス**: Phase 2.4 - BC-007 ドメイン層詳細化
