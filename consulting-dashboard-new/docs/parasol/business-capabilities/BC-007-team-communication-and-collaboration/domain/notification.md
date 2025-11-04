# BC-007: 通知システム詳細 [Notification System Details]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**Context**: Notification Context [通知コンテキスト]

---

## 目次

1. [概要](#overview)
2. [Notification Aggregate](#notification-aggregate)
3. [Priority & SLA Management](#priority-sla)
4. [Multi-Channel Delivery](#multi-channel)
5. [Retry Strategy](#retry-strategy)
6. [Notification Preferences](#preferences)
7. [Business Rules](#business-rules)
8. [Domain Events](#domain-events)
9. [Implementation Examples](#implementation-examples)

---

## 概要 {#overview}

Notification Contextは、ユーザーへの通知配信を優先度別SLAで管理し、複数チャネル（Push、Email、SMS、In-app）での確実な配信を実現します。

### 責務

- **優先度管理**: urgent/high/normal/low の4段階
- **SLA保証**: 優先度別の配信時間保証
- **マルチチャネル**: Push、Email、SMS、In-app
- **リトライ戦略**: 失敗時の自動再送
- **配信追跡**: 配信状況のトラッキング
- **ユーザー設定**: 通知設定のカスタマイズ

### SLA定義

| 優先度 | SLA | 配信チャネル | リトライ |
|-------|-----|------------|---------|
| **urgent** | 10秒以内 | Push + Email + SMS | 3回（5秒間隔） |
| **high** | 1分以内 | Push + Email | 3回（30秒間隔） |
| **normal** | 5分以内 | Push | 2回（2分間隔） |
| **low** | Best Effort | In-app のみ | なし |

---

## Notification Aggregate {#notification-aggregate}

### 概念モデル

Notification Aggregateは、通知の作成、配信、追跡を管理します。

**集約ルート**: Notification [通知] [NOTIFICATION]

**エンティティ**:
- Notification - 通知本体
- DeliveryAttempt - 配信試行記録
- DeliveryReceipt - 配信確認

**値オブジェクト**:
- NotificationId - 通知ID
- NotificationPriority - 優先度
- NotificationChannel - 配信チャネル
- NotificationPayload - 通知内容
- DeliveryStatus - 配信ステータス
- SLA - サービスレベル契約

### TypeScript実装

```typescript
// ========================================
// Value Objects
// ========================================

/**
 * NotificationId - 通知ID
 */
export class NotificationId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new InvalidNotificationIdError(value);
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: NotificationId): boolean {
    return this.value === other.value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public static generate(): NotificationId {
    return new NotificationId(crypto.randomUUID());
  }
}

/**
 * NotificationPriority - 通知優先度
 */
export enum NotificationPriority {
  URGENT = 'urgent',   // 緊急（10秒以内配信）
  HIGH = 'high',       // 高（1分以内配信）
  NORMAL = 'normal',   // 通常（5分以内配信）
  LOW = 'low'          // 低（Best Effort）
}

/**
 * NotificationChannel - 配信チャネル
 */
export enum NotificationChannel {
  PUSH = 'push',       // プッシュ通知
  EMAIL = 'email',     // メール
  SMS = 'sms',         // SMS
  IN_APP = 'in_app'    // アプリ内通知
}

/**
 * DeliveryStatus - 配信ステータス
 */
export enum DeliveryStatus {
  PENDING = 'pending',         // 配信待ち
  PROCESSING = 'processing',   // 配信処理中
  DELIVERED = 'delivered',     // 配信完了
  FAILED = 'failed',           // 配信失敗
  EXPIRED = 'expired',         // 期限切れ
  CANCELLED = 'cancelled'      // キャンセル済み
}

/**
 * SLA - サービスレベル契約
 */
export class SLA {
  public readonly deliveryTimeSeconds: number;
  public readonly channels: NotificationChannel[];
  public readonly retryCount: number;
  public readonly retryIntervalSeconds: number;

  private constructor(
    deliveryTimeSeconds: number,
    channels: NotificationChannel[],
    retryCount: number,
    retryIntervalSeconds: number
  ) {
    this.deliveryTimeSeconds = deliveryTimeSeconds;
    this.channels = channels;
    this.retryCount = retryCount;
    this.retryIntervalSeconds = retryIntervalSeconds;
  }

  /**
   * 優先度からSLAを取得
   */
  public static fromPriority(priority: NotificationPriority): SLA {
    switch (priority) {
      case NotificationPriority.URGENT:
        return new SLA(
          10,
          [NotificationChannel.PUSH, NotificationChannel.EMAIL, NotificationChannel.SMS],
          3,
          5
        );
      case NotificationPriority.HIGH:
        return new SLA(
          60,
          [NotificationChannel.PUSH, NotificationChannel.EMAIL],
          3,
          30
        );
      case NotificationPriority.NORMAL:
        return new SLA(
          300,
          [NotificationChannel.PUSH],
          2,
          120
        );
      case NotificationPriority.LOW:
        return new SLA(
          0, // Best Effort
          [NotificationChannel.IN_APP],
          0,
          0
        );
    }
  }

  public hasRetry(): boolean {
    return this.retryCount > 0;
  }

  public isSLAMet(deliveryTimeMs: number): boolean {
    if (this.deliveryTimeSeconds === 0) {
      return true; // Best Effort
    }
    return deliveryTimeMs <= this.deliveryTimeSeconds * 1000;
  }
}

/**
 * NotificationPayload - 通知内容
 */
export class NotificationPayload {
  public readonly type: NotificationType;
  public readonly title: string;
  public readonly body: string;
  public readonly data: Record<string, any>;
  public readonly actionUrl?: string;
  public readonly imageUrl?: string;

  constructor(
    type: NotificationType,
    title: string,
    body: string,
    data: Record<string, any> = {},
    actionUrl?: string,
    imageUrl?: string
  ) {
    if (!title || title.trim().length === 0) {
      throw new EmptyNotificationTitleError();
    }
    if (!body || body.trim().length === 0) {
      throw new EmptyNotificationBodyError();
    }
    if (title.length > 200) {
      throw new NotificationTitleTooLongError(title.length);
    }
    if (body.length > 1000) {
      throw new NotificationBodyTooLongError(body.length);
    }

    this.type = type;
    this.title = title;
    this.body = body;
    this.data = data;
    this.actionUrl = actionUrl;
    this.imageUrl = imageUrl;
  }

  /**
   * プッシュ通知用ペイロードを生成
   */
  public toPushPayload(): object {
    return {
      notification: {
        title: this.title,
        body: this.body,
        image: this.imageUrl
      },
      data: {
        ...this.data,
        actionUrl: this.actionUrl,
        type: this.type
      }
    };
  }

  /**
   * メール用ペイロードを生成
   */
  public toEmailPayload(): { subject: string; html: string; text: string } {
    return {
      subject: this.title,
      html: this.generateEmailHTML(),
      text: this.body
    };
  }

  /**
   * SMS用ペイロードを生成
   */
  public toSMSPayload(): string {
    // SMS is limited to 160 characters
    const message = `${this.title}: ${this.body}`;
    return message.length > 160 ? message.substring(0, 157) + '...' : message;
  }

  private generateEmailHTML(): string {
    return `
      <html>
        <body>
          <h2>${this.title}</h2>
          <p>${this.body}</p>
          ${this.actionUrl ? `<p><a href="${this.actionUrl}">アクションを実行</a></p>` : ''}
          ${this.imageUrl ? `<img src="${this.imageUrl}" style="max-width: 600px;" />` : ''}
        </body>
      </html>
    `;
  }
}

/**
 * NotificationType - 通知種別
 */
export enum NotificationType {
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

  // Project (BC-001)
  PROJECT_ASSIGNED = 'project_assigned',
  TASK_ASSIGNED = 'task_assigned',
  DEADLINE_APPROACHING = 'deadline_approaching',

  // Knowledge (BC-006)
  KNOWLEDGE_SHARED = 'knowledge_shared',
  REVIEW_REQUESTED = 'review_requested',
  COURSE_ASSIGNED = 'course_assigned',

  // System
  SYSTEM_ALERT = 'system_alert',
  SECURITY_ALERT = 'security_alert'
}

// ========================================
// Entities
// ========================================

/**
 * Notification - 通知エンティティ（集約ルート）
 */
export class Notification {
  private id: NotificationId;
  private recipientId: string;
  private priority: NotificationPriority;
  private sla: SLA;
  private payload: NotificationPayload;
  private status: DeliveryStatus;
  private deliveryAttempts: DeliveryAttempt[];
  private deliveryReceipts: Map<NotificationChannel, DeliveryReceipt>;
  private createdAt: Date;
  private scheduledAt: Date | null; // 予約配信時刻
  private firstAttemptAt: Date | null;
  private deliveredAt: Date | null;
  private expiresAt: Date;
  private cancelledAt: Date | null;
  private metadata: NotificationMetadata;

  // Domain Events
  private domainEvents: DomainEvent[] = [];

  constructor(
    id: NotificationId,
    recipientId: string,
    priority: NotificationPriority,
    payload: NotificationPayload,
    scheduledAt?: Date
  ) {
    this.id = id;
    this.recipientId = recipientId;
    this.priority = priority;
    this.sla = SLA.fromPriority(priority);
    this.payload = payload;
    this.status = DeliveryStatus.PENDING;
    this.deliveryAttempts = [];
    this.deliveryReceipts = new Map();
    this.createdAt = new Date();
    this.scheduledAt = scheduledAt || null;
    this.firstAttemptAt = null;
    this.deliveredAt = null;
    this.expiresAt = this.calculateExpiresAt();
    this.cancelledAt = null;
    this.metadata = NotificationMetadata.create();
  }

  // ========================================
  // Factory Methods
  // ========================================

  /**
   * 即時配信通知を作成
   */
  public static createImmediate(
    recipientId: string,
    priority: NotificationPriority,
    payload: NotificationPayload
  ): Notification {
    const notification = new Notification(
      NotificationId.generate(),
      recipientId,
      priority,
      payload
    );

    notification.addDomainEvent(new NotificationCreatedEvent(
      notification.id.toString(),
      recipientId,
      priority,
      payload.type,
      notification.createdAt
    ));

    return notification;
  }

  /**
   * 予約配信通知を作成
   */
  public static createScheduled(
    recipientId: string,
    priority: NotificationPriority,
    payload: NotificationPayload,
    scheduledAt: Date
  ): Notification {
    // BR-NOT-001: 予約時刻は現在時刻より未来でなければならない
    if (scheduledAt <= new Date()) {
      throw new InvalidScheduledTimeError(scheduledAt);
    }

    const notification = new Notification(
      NotificationId.generate(),
      recipientId,
      priority,
      payload,
      scheduledAt
    );

    notification.addDomainEvent(new NotificationScheduledEvent(
      notification.id.toString(),
      recipientId,
      scheduledAt
    ));

    return notification;
  }

  // ========================================
  // Business Logic - Delivery
  // ========================================

  /**
   * 配信を開始
   */
  public startDelivery(): void {
    // BR-NOT-002: ペンディング状態のみ配信開始可能
    if (this.status !== DeliveryStatus.PENDING) {
      throw new InvalidNotificationStatusForDeliveryError(this.id.toString(), this.status);
    }

    // BR-NOT-003: 予約配信の場合、予約時刻を過ぎているか確認
    if (this.scheduledAt && new Date() < this.scheduledAt) {
      throw new ScheduledTimeNotReachedError(this.id.toString(), this.scheduledAt);
    }

    // BR-NOT-004: 期限切れの場合は配信不可
    if (this.isExpired()) {
      this.status = DeliveryStatus.EXPIRED;
      this.addDomainEvent(new NotificationExpiredEvent(
        this.id.toString(),
        this.expiresAt
      ));
      throw new NotificationExpiredError(this.id.toString(), this.expiresAt);
    }

    this.status = DeliveryStatus.PROCESSING;
    this.firstAttemptAt = new Date();

    this.addDomainEvent(new NotificationDeliveryStartedEvent(
      this.id.toString(),
      this.recipientId,
      this.priority,
      this.sla.channels,
      this.firstAttemptAt
    ));
  }

  /**
   * チャネルへの配信を試行
   */
  public attemptDelivery(channel: NotificationChannel): DeliveryAttempt {
    // BR-NOT-005: 処理中ステータスのみ配信試行可能
    if (this.status !== DeliveryStatus.PROCESSING) {
      throw new InvalidNotificationStatusForAttemptError(this.id.toString(), this.status);
    }

    // BR-NOT-006: SLAで許可されたチャネルのみ配信可能
    if (!this.sla.channels.includes(channel)) {
      throw new ChannelNotAllowedByS LAError(this.id.toString(), channel, this.priority);
    }

    // BR-NOT-007: リトライ回数制限チェック
    const channelAttempts = this.getAttemptsByChannel(channel);
    if (channelAttempts.length >= this.sla.retryCount + 1) {
      throw new RetryLimitExceededError(this.id.toString(), channel, channelAttempts.length);
    }

    const attempt = new DeliveryAttempt(
      crypto.randomUUID(),
      this.id.toString(),
      channel,
      channelAttempts.length + 1,
      new Date()
    );

    this.deliveryAttempts.push(attempt);

    this.addDomainEvent(new DeliveryAttemptedEvent(
      this.id.toString(),
      channel,
      attempt.attemptNumber,
      attempt.attemptedAt
    ));

    return attempt;
  }

  /**
   * 配信成功を記録
   */
  public recordDeliverySuccess(
    channel: NotificationChannel,
    attemptId: string,
    externalId: string
  ): void {
    const attempt = this.deliveryAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new DeliveryAttemptNotFoundError(this.id.toString(), attemptId);
    }

    attempt.markAsSuccess(externalId);

    // 配信確認を記録
    const receipt = new DeliveryReceipt(
      channel,
      externalId,
      new Date(),
      this.calculateDeliveryTime()
    );
    this.deliveryReceipts.set(channel, receipt);

    // 全チャネルで配信完了したか確認
    if (this.areAllChannelsDelivered()) {
      this.status = DeliveryStatus.DELIVERED;
      this.deliveredAt = new Date();

      const deliveryTime = this.calculateDeliveryTime();
      const slaMetResult = this.sla.isSLAMet(deliveryTime);

      this.addDomainEvent(new NotificationDeliveredEvent(
        this.id.toString(),
        this.recipientId,
        this.deliveredAt,
        deliveryTime,
        slaMetResult
      ));
    }

    this.addDomainEvent(new ChannelDeliverySucceededEvent(
      this.id.toString(),
      channel,
      externalId,
      attempt.attemptedAt
    ));
  }

  /**
   * 配信失敗を記録
   */
  public recordDeliveryFailure(
    channel: NotificationChannel,
    attemptId: string,
    errorMessage: string
  ): void {
    const attempt = this.deliveryAttempts.find(a => a.id === attemptId);
    if (!attempt) {
      throw new DeliveryAttemptNotFoundError(this.id.toString(), attemptId);
    }

    attempt.markAsFailure(errorMessage);

    this.addDomainEvent(new ChannelDeliveryFailedEvent(
      this.id.toString(),
      channel,
      attempt.attemptNumber,
      errorMessage,
      new Date()
    ));

    // リトライが必要か判断
    const channelAttempts = this.getAttemptsByChannel(channel);
    if (channelAttempts.length < this.sla.retryCount + 1) {
      this.addDomainEvent(new RetryScheduledEvent(
        this.id.toString(),
        channel,
        channelAttempts.length + 1,
        this.sla.retryIntervalSeconds
      ));
    } else {
      // 全チャネルで配信失敗したか確認
      if (this.areAllChannelsFailed()) {
        this.status = DeliveryStatus.FAILED;
        this.addDomainEvent(new NotificationDeliveryFailedEvent(
          this.id.toString(),
          this.recipientId,
          'All channels failed',
          new Date()
        ));
      }
    }
  }

  /**
   * 配信をキャンセル
   */
  public cancel(cancelledBy: string, reason: string): void {
    // BR-NOT-008: 配信完了済み・失敗・キャンセル済み・期限切れの通知はキャンセル不可
    if ([DeliveryStatus.DELIVERED, DeliveryStatus.FAILED, DeliveryStatus.CANCELLED, DeliveryStatus.EXPIRED].includes(this.status)) {
      throw new CannotCancelNotificationError(this.id.toString(), this.status);
    }

    this.status = DeliveryStatus.CANCELLED;
    this.cancelledAt = new Date();

    this.addDomainEvent(new NotificationCancelledEvent(
      this.id.toString(),
      cancelledBy,
      reason,
      this.cancelledAt
    ));
  }

  // ========================================
  // Business Logic - Status Checks
  // ========================================

  /**
   * 全チャネルで配信完了したか
   */
  private areAllChannelsDelivered(): boolean {
    for (const channel of this.sla.channels) {
      if (!this.deliveryReceipts.has(channel)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 全チャネルで配信失敗したか
   */
  private areAllChannelsFailed(): boolean {
    for (const channel of this.sla.channels) {
      const channelAttempts = this.getAttemptsByChannel(channel);
      const allFailed = channelAttempts.every(a => a.isFailed());
      const reachedLimit = channelAttempts.length >= this.sla.retryCount + 1;

      if (!allFailed || !reachedLimit) {
        return false;
      }
    }
    return true;
  }

  /**
   * 期限切れか確認
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * 配信時間を計算（ミリ秒）
   */
  private calculateDeliveryTime(): number {
    if (!this.firstAttemptAt) {
      return 0;
    }
    const endTime = this.deliveredAt || new Date();
    return endTime.getTime() - this.firstAttemptAt.getTime();
  }

  /**
   * 有効期限を計算
   */
  private calculateExpiresAt(): Date {
    const now = this.scheduledAt || this.createdAt;
    const expirationHours = this.getExpirationHours();
    return new Date(now.getTime() + expirationHours * 60 * 60 * 1000);
  }

  private getExpirationHours(): number {
    switch (this.priority) {
      case NotificationPriority.URGENT:
        return 1; // 1時間
      case NotificationPriority.HIGH:
        return 6; // 6時間
      case NotificationPriority.NORMAL:
        return 24; // 24時間
      case NotificationPriority.LOW:
        return 72; // 72時間
    }
  }

  /**
   * 特定チャネルの配信試行を取得
   */
  private getAttemptsByChannel(channel: NotificationChannel): DeliveryAttempt[] {
    return this.deliveryAttempts.filter(a => a.channel === channel);
  }

  // ========================================
  // Query Methods
  // ========================================

  public getId(): NotificationId {
    return this.id;
  }

  public getRecipientId(): string {
    return this.recipientId;
  }

  public getPriority(): NotificationPriority {
    return this.priority;
  }

  public getSLA(): SLA {
    return this.sla;
  }

  public getPayload(): NotificationPayload {
    return this.payload;
  }

  public getStatus(): DeliveryStatus {
    return this.status;
  }

  public getDeliveryAttempts(): DeliveryAttempt[] {
    return [...this.deliveryAttempts];
  }

  public getDeliveryReceipts(): Map<NotificationChannel, DeliveryReceipt> {
    return new Map(this.deliveryReceipts);
  }

  public isDelivered(): boolean {
    return this.status === DeliveryStatus.DELIVERED;
  }

  public isFailed(): boolean {
    return this.status === DeliveryStatus.FAILED;
  }

  public isPending(): boolean {
    return this.status === DeliveryStatus.PENDING;
  }

  public isScheduled(): boolean {
    return this.scheduledAt !== null && new Date() < this.scheduledAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getScheduledAt(): Date | null {
    return this.scheduledAt;
  }

  public getDeliveredAt(): Date | null {
    return this.deliveredAt;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  // ========================================
  // Domain Events
  // ========================================

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}

/**
 * DeliveryAttempt - 配信試行エンティティ
 */
export class DeliveryAttempt {
  public readonly id: string;
  public readonly notificationId: string;
  public readonly channel: NotificationChannel;
  public readonly attemptNumber: number;
  public readonly attemptedAt: Date;
  public status: 'pending' | 'success' | 'failed';
  public completedAt: Date | null;
  public externalId: string | null; // Provider's tracking ID
  public errorMessage: string | null;

  constructor(
    id: string,
    notificationId: string,
    channel: NotificationChannel,
    attemptNumber: number,
    attemptedAt: Date
  ) {
    this.id = id;
    this.notificationId = notificationId;
    this.channel = channel;
    this.attemptNumber = attemptNumber;
    this.attemptedAt = attemptedAt;
    this.status = 'pending';
    this.completedAt = null;
    this.externalId = null;
    this.errorMessage = null;
  }

  public markAsSuccess(externalId: string): void {
    this.status = 'success';
    this.completedAt = new Date();
    this.externalId = externalId;
  }

  public markAsFailure(errorMessage: string): void {
    this.status = 'failed';
    this.completedAt = new Date();
    this.errorMessage = errorMessage;
  }

  public isSuccess(): boolean {
    return this.status === 'success';
  }

  public isFailed(): boolean {
    return this.status === 'failed';
  }

  public isPending(): boolean {
    return this.status === 'pending';
  }
}

/**
 * DeliveryReceipt - 配信確認
 */
export class DeliveryReceipt {
  public readonly channel: NotificationChannel;
  public readonly externalId: string;
  public readonly deliveredAt: Date;
  public readonly deliveryTimeMs: number;

  constructor(
    channel: NotificationChannel,
    externalId: string,
    deliveredAt: Date,
    deliveryTimeMs: number
  ) {
    this.channel = channel;
    this.externalId = externalId;
    this.deliveredAt = deliveredAt;
    this.deliveryTimeMs = deliveryTimeMs;
  }
}

/**
 * NotificationMetadata - メタデータ
 */
export class NotificationMetadata {
  public readonly version: number;
  public readonly source: string;

  private constructor(version: number, source: string) {
    this.version = version;
    this.source = source;
  }

  public static create(): NotificationMetadata {
    return new NotificationMetadata(1, 'system');
  }
}
```

---

## Priority & SLA Management {#priority-sla}

### SLA監視サービス

```typescript
/**
 * SLAMonitoringService - SLA監視サービス
 */
export class SLAMonitoringService {
  constructor(
    private notificationRepository: NotificationRepository,
    private alertService: AlertService
  ) {}

  /**
   * SLA違反をチェック
   */
  public async checkSLAViolations(): Promise<void> {
    const processingNotifications = await this.notificationRepository.findByStatus(
      DeliveryStatus.PROCESSING
    );

    for (const notification of processingNotifications) {
      const sla = notification.getSLA();
      const elapsedTime = Date.now() - notification.getCreatedAt().getTime();

      if (!sla.isSLAMet(elapsedTime) && !notification.isExpired()) {
        await this.handleSLAViolation(notification, elapsedTime);
      }
    }
  }

  /**
   * SLA違反を処理
   */
  private async handleSLAViolation(
    notification: Notification,
    elapsedTime: number
  ): Promise<void> {
    const sla = notification.getSLA();

    await this.alertService.sendAlert({
      type: 'sla_violation',
      severity: 'high',
      message: `Notification ${notification.getId()} SLA violated`,
      details: {
        notificationId: notification.getId().toString(),
        priority: notification.getPriority(),
        expectedTime: sla.deliveryTimeSeconds * 1000,
        actualTime: elapsedTime,
        recipientId: notification.getRecipientId()
      }
    });

    // エスカレーション: より優先度の高いチャネルを試行
    if (notification.getPriority() === NotificationPriority.URGENT) {
      // SMS未送信なら送信
      const receipts = notification.getDeliveryReceipts();
      if (!receipts.has(NotificationChannel.SMS)) {
        await this.escalateToSMS(notification);
      }
    }
  }

  /**
   * SMSにエスカレーション
   */
  private async escalateToSMS(notification: Notification): Promise<void> {
    // Implementation for SMS escalation
  }
}
```

---

## Multi-Channel Delivery {#multi-channel}

### チャネル別配信プロバイダー

```typescript
/**
 * NotificationDeliveryService - 配信サービス
 */
export class NotificationDeliveryService {
  constructor(
    private pushProvider: PushNotificationProvider,
    private emailProvider: EmailProvider,
    private smsProvider: SMSProvider,
    private inAppProvider: InAppNotificationProvider
  ) {}

  /**
   * 通知を配信
   */
  public async deliver(notification: Notification): Promise<void> {
    const channels = notification.getSLA().channels;

    // 各チャネルで並行配信
    const deliveryPromises = channels.map(channel =>
      this.deliverToChannel(notification, channel)
    );

    await Promise.allSettled(deliveryPromises);
  }

  /**
   * 特定チャネルへ配信
   */
  private async deliverToChannel(
    notification: Notification,
    channel: NotificationChannel
  ): Promise<void> {
    try {
      const attempt = notification.attemptDelivery(channel);

      let externalId: string;

      switch (channel) {
        case NotificationChannel.PUSH:
          externalId = await this.deliverPush(notification);
          break;
        case NotificationChannel.EMAIL:
          externalId = await this.deliverEmail(notification);
          break;
        case NotificationChannel.SMS:
          externalId = await this.deliverSMS(notification);
          break;
        case NotificationChannel.IN_APP:
          externalId = await this.deliverInApp(notification);
          break;
        default:
          throw new UnsupportedChannelError(channel);
      }

      notification.recordDeliverySuccess(channel, attempt.id, externalId);

    } catch (error) {
      notification.recordDeliveryFailure(
        channel,
        attempt.id,
        error.message
      );
    }
  }

  /**
   * プッシュ通知配信
   */
  private async deliverPush(notification: Notification): Promise<string> {
    const payload = notification.getPayload();
    const pushPayload = payload.toPushPayload();

    return await this.pushProvider.send(
      notification.getRecipientId(),
      pushPayload
    );
  }

  /**
   * メール配信
   */
  private async deliverEmail(notification: Notification): Promise<string> {
    const payload = notification.getPayload();
    const emailPayload = payload.toEmailPayload();

    return await this.emailProvider.send(
      notification.getRecipientId(),
      emailPayload.subject,
      emailPayload.html,
      emailPayload.text
    );
  }

  /**
   * SMS配信
   */
  private async deliverSMS(notification: Notification): Promise<string> {
    const payload = notification.getPayload();
    const smsPayload = payload.toSMSPayload();

    return await this.smsProvider.send(
      notification.getRecipientId(),
      smsPayload
    );
  }

  /**
   * アプリ内通知配信
   */
  private async deliverInApp(notification: Notification): Promise<string> {
    return await this.inAppProvider.store(
      notification.getRecipientId(),
      notification.getPayload()
    );
  }
}
```

---

## Retry Strategy {#retry-strategy}

### リトライ管理

```typescript
/**
 * RetryManager - リトライ管理
 */
export class RetryManager {
  constructor(
    private notificationRepository: NotificationRepository,
    private deliveryService: NotificationDeliveryService,
    private queue: Queue
  ) {}

  /**
   * リトライをスケジュール
   */
  public async scheduleRetry(
    notificationId: string,
    channel: NotificationChannel,
    attemptNumber: number,
    retryIntervalSeconds: number
  ): Promise<void> {
    await this.queue.enqueue(
      'notification-retry',
      {
        notificationId,
        channel,
        attemptNumber
      },
      {
        delay: retryIntervalSeconds * 1000
      }
    );
  }

  /**
   * リトライを実行
   */
  public async executeRetry(
    notificationId: string,
    channel: NotificationChannel
  ): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotificationNotFoundError(notificationId);
    }

    // ステータス確認
    if (notification.getStatus() !== DeliveryStatus.PROCESSING) {
      // Already delivered/cancelled/failed - skip retry
      return;
    }

    // 期限切れ確認
    if (notification.isExpired()) {
      notification.recordDeliveryFailure(
        channel,
        'expired',
        'Notification expired before retry'
      );
      await this.notificationRepository.save(notification);
      return;
    }

    // 再配信
    await this.deliveryService.deliverToChannel(notification, channel);
    await this.notificationRepository.save(notification);
  }
}
```

---

## Notification Preferences {#preferences}

### ユーザー通知設定

```typescript
/**
 * NotificationPreferences - 通知設定
 */
export class NotificationPreferences {
  private userId: string;
  private channelSettings: Map<NotificationChannel, boolean>;
  private typeSettings: Map<NotificationType, NotificationTypeSetting>;
  private quietHours: QuietHours | null;
  private updatedAt: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.channelSettings = new Map([
      [NotificationChannel.PUSH, true],
      [NotificationChannel.EMAIL, true],
      [NotificationChannel.SMS, false],
      [NotificationChannel.IN_APP, true]
    ]);
    this.typeSettings = new Map();
    this.quietHours = null;
    this.updatedAt = new Date();
  }

  /**
   * チャネルを有効化/無効化
   */
  public setChannelEnabled(channel: NotificationChannel, enabled: boolean): void {
    this.channelSettings.set(channel, enabled);
    this.updatedAt = new Date();
  }

  /**
   * 通知タイプ別設定
   */
  public setTypeSetting(
    type: NotificationType,
    enabled: boolean,
    channels?: NotificationChannel[]
  ): void {
    this.typeSettings.set(type, {
      enabled,
      channels: channels || Array.from(this.channelSettings.keys()).filter(
        ch => this.channelSettings.get(ch)
      )
    });
    this.updatedAt = new Date();
  }

  /**
   * サイレント時間を設定
   */
  public setQuietHours(startHour: number, endHour: number): void {
    this.quietHours = new QuietHours(startHour, endHour);
    this.updatedAt = new Date();
  }

  /**
   * 通知配信可否を判定
   */
  public canDeliver(
    type: NotificationType,
    channel: NotificationChannel,
    priority: NotificationPriority
  ): boolean {
    // BR-PREF-001: 緊急通知は常に配信
    if (priority === NotificationPriority.URGENT) {
      return true;
    }

    // BR-PREF-002: チャネルが無効の場合は配信しない
    if (!this.channelSettings.get(channel)) {
      return false;
    }

    // BR-PREF-003: 通知タイプが無効の場合は配信しない
    const typeSetting = this.typeSettings.get(type);
    if (typeSetting && !typeSetting.enabled) {
      return false;
    }

    // BR-PREF-004: 通知タイプ別チャネル設定
    if (typeSetting && typeSetting.channels && !typeSetting.channels.includes(channel)) {
      return false;
    }

    // BR-PREF-005: サイレント時間中は低優先度通知を配信しない
    if (this.quietHours && priority === NotificationPriority.LOW) {
      if (this.quietHours.isInQuietHours(new Date())) {
        return false;
      }
    }

    return true;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getChannelSettings(): Map<NotificationChannel, boolean> {
    return new Map(this.channelSettings);
  }
}

/**
 * QuietHours - サイレント時間
 */
export class QuietHours {
  public readonly startHour: number; // 0-23
  public readonly endHour: number;   // 0-23

  constructor(startHour: number, endHour: number) {
    if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
      throw new InvalidQuietHoursError(startHour, endHour);
    }
    this.startHour = startHour;
    this.endHour = endHour;
  }

  public isInQuietHours(date: Date): boolean {
    const hour = date.getHours();

    if (this.startHour < this.endHour) {
      // Same day (e.g., 22:00 - 08:00 next day)
      return hour >= this.startHour && hour < this.endHour;
    } else {
      // Cross midnight (e.g., 22:00 - 08:00)
      return hour >= this.startHour || hour < this.endHour;
    }
  }
}

interface NotificationTypeSetting {
  enabled: boolean;
  channels?: NotificationChannel[];
}
```

---

## Business Rules {#business-rules}

### 通知配信ビジネスルール

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-NOT-001 | 予約時刻は現在時刻より未来でなければならない | Notification.createScheduled() |
| BR-NOT-002 | ペンディング状態のみ配信開始可能 | Notification.startDelivery() |
| BR-NOT-003 | 予約配信の場合、予約時刻を過ぎているか確認 | Notification.startDelivery() |
| BR-NOT-004 | 期限切れの場合は配信不可 | Notification.startDelivery() |
| BR-NOT-005 | 処理中ステータスのみ配信試行可能 | Notification.attemptDelivery() |
| BR-NOT-006 | SLAで許可されたチャネルのみ配信可能 | Notification.attemptDelivery() |
| BR-NOT-007 | リトライ回数制限チェック | Notification.attemptDelivery() |
| BR-NOT-008 | 配信完了済み・失敗・キャンセル済み・期限切れの通知はキャンセル不可 | Notification.cancel() |

### ユーザー設定ビジネスルール

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-PREF-001 | 緊急通知は常に配信 | NotificationPreferences.canDeliver() |
| BR-PREF-002 | チャネルが無効の場合は配信しない | NotificationPreferences.canDeliver() |
| BR-PREF-003 | 通知タイプが無効の場合は配信しない | NotificationPreferences.canDeliver() |
| BR-PREF-004 | 通知タイプ別チャネル設定を尊重 | NotificationPreferences.canDeliver() |
| BR-PREF-005 | サイレント時間中は低優先度通知を配信しない | NotificationPreferences.canDeliver() |

---

## Domain Events {#domain-events}

```typescript
/**
 * NotificationCreatedEvent - 通知作成イベント
 */
export class NotificationCreatedEvent implements DomainEvent {
  public readonly eventType = 'NotificationCreated';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly recipientId: string,
    public readonly priority: NotificationPriority,
    public readonly type: NotificationType,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * NotificationDeliveryStartedEvent - 配信開始イベント
 */
export class NotificationDeliveryStartedEvent implements DomainEvent {
  public readonly eventType = 'NotificationDeliveryStarted';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly recipientId: string,
    public readonly priority: NotificationPriority,
    public readonly channels: NotificationChannel[],
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * DeliveryAttemptedEvent - 配信試行イベント
 */
export class DeliveryAttemptedEvent implements DomainEvent {
  public readonly eventType = 'DeliveryAttempted';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly channel: NotificationChannel,
    public readonly attemptNumber: number,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ChannelDeliverySucceededEvent - チャネル配信成功イベント
 */
export class ChannelDeliverySucceededEvent implements DomainEvent {
  public readonly eventType = 'ChannelDeliverySucceeded';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly channel: NotificationChannel,
    public readonly externalId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ChannelDeliveryFailedEvent - チャネル配信失敗イベント
 */
export class ChannelDeliveryFailedEvent implements DomainEvent {
  public readonly eventType = 'ChannelDeliveryFailed';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly channel: NotificationChannel,
    public readonly attemptNumber: number,
    public readonly errorMessage: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * NotificationDeliveredEvent - 通知配信完了イベント
 */
export class NotificationDeliveredEvent implements DomainEvent {
  public readonly eventType = 'NotificationDelivered';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly recipientId: string,
    public readonly deliveredAt: Date,
    public readonly deliveryTimeMs: number,
    public readonly slaMetResult: boolean
  ) {
    this.occurredAt = deliveredAt;
  }
}

/**
 * RetryScheduledEvent - リトライスケジュールイベント
 */
export class RetryScheduledEvent implements DomainEvent {
  public readonly eventType = 'RetryScheduled';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly channel: NotificationChannel,
    public readonly nextAttemptNumber: number,
    public readonly retryIntervalSeconds: number
  ) {
    this.occurredAt = new Date();
  }
}

/**
 * NotificationExpiredEvent - 通知期限切れイベント
 */
export class NotificationExpiredEvent implements DomainEvent {
  public readonly eventType = 'NotificationExpired';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly expiresAt: Date
  ) {
    this.occurredAt = new Date();
  }
}

/**
 * NotificationCancelledEvent - 通知キャンセルイベント
 */
export class NotificationCancelledEvent implements DomainEvent {
  public readonly eventType = 'NotificationCancelled';
  public readonly occurredAt: Date;

  constructor(
    public readonly notificationId: string,
    public readonly cancelledBy: string,
    public readonly reason: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}
```

---

## Implementation Examples {#implementation-examples}

### 使用例1: 緊急通知の送信

```typescript
// Application Service
export class NotificationApplicationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private deliveryService: NotificationDeliveryService,
    private preferencesRepository: NotificationPreferencesRepository,
    private eventBus: EventBus
  ) {}

  async sendUrgentNotification(
    recipientId: string,
    title: string,
    body: string,
    actionUrl?: string
  ): Promise<void> {
    // 通知ペイロード作成
    const payload = new NotificationPayload(
      NotificationType.SYSTEM_ALERT,
      title,
      body,
      {},
      actionUrl
    );

    // 緊急通知作成
    const notification = Notification.createImmediate(
      recipientId,
      NotificationPriority.URGENT,
      payload
    );

    // 保存
    await this.notificationRepository.save(notification);

    // イベント発行
    for (const event of notification.getDomainEvents()) {
      await this.eventBus.publish(event);
    }

    notification.clearDomainEvents();

    // 即時配信開始
    notification.startDelivery();
    await this.deliveryService.deliver(notification);
    await this.notificationRepository.save(notification);
  }
}
```

### 使用例2: ユーザー設定を考慮した配信

```typescript
async sendNotificationWithPreferences(
  recipientId: string,
  type: NotificationType,
  priority: NotificationPriority,
  payload: NotificationPayload
): Promise<void> {
  // ユーザー設定取得
  const preferences = await this.preferencesRepository.findByUserId(recipientId);

  // 通知作成
  const notification = Notification.createImmediate(
    recipientId,
    priority,
    payload
  );

  await this.notificationRepository.save(notification);

  // 配信開始
  notification.startDelivery();

  // ユーザー設定に基づいてチャネルをフィルタ
  const sla = notification.getSLA();
  const allowedChannels = sla.channels.filter(channel =>
    preferences.canDeliver(type, channel, priority)
  );

  // フィルタ後のチャネルで配信
  for (const channel of allowedChannels) {
    await this.deliveryService.deliverToChannel(notification, channel);
  }

  await this.notificationRepository.save(notification);
}
```

### 使用例3: 予約配信

```typescript
async scheduleNotification(
  recipientId: string,
  scheduledAt: Date,
  priority: NotificationPriority,
  payload: NotificationPayload
): Promise<string> {
  // 予約通知作成
  const notification = Notification.createScheduled(
    recipientId,
    priority,
    payload,
    scheduledAt
  );

  // 保存
  await this.notificationRepository.save(notification);

  // イベント発行
  for (const event of notification.getDomainEvents()) {
    await this.eventBus.publish(event);
  }

  notification.clearDomainEvents();

  // スケジューラーにジョブ登録
  await this.scheduler.scheduleJob(
    'deliver-notification',
    { notificationId: notification.getId().toString() },
    scheduledAt
  );

  return notification.getId().toString();
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 通知システム詳細化
