# BC-007: 会議管理詳細 [Meeting Management Details]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**Context**: Meeting Context [会議コンテキスト]

---

## 目次

1. [概要](#overview)
2. [Meeting Aggregate](#meeting-aggregate)
3. [Participant Management](#participant-management)
4. [Online Meeting Integration](#online-meeting)
5. [Meeting Minutes](#meeting-minutes)
6. [Reminder System](#reminder-system)
7. [Business Rules](#business-rules)
8. [Domain Events](#domain-events)
9. [Implementation Examples](#implementation-examples)

---

## 概要 {#overview}

Meeting Contextは、会議のスケジューリング、オンライン会議統合、参加者管理、議事録管理を提供します。

### 責務

- **会議スケジューリング**: 日時・場所の予約
- **参加者管理**: 招待・出欠確認
- **オンライン会議**: Zoom/Teams/Meet統合
- **議事録管理**: 会議メモ・アクションアイテム
- **リマインダー**: 会議前通知
- **会議室予約**: 物理会議室の予約

### 会議種別

- **One-on-One**: 1対1ミーティング
- **Team Meeting**: チームミーティング
- **Project Meeting**: プロジェクトミーティング
- **Client Meeting**: クライアントミーティング
- **All Hands**: 全社会議

---

## Meeting Aggregate {#meeting-aggregate}

### 概念モデル

Meeting Aggregateは、会議のライフサイクル全体を管理します。

**集約ルート**: Meeting [会議] [MEETING]

**エンティティ**:
- Meeting - 会議本体
- Participant - 参加者
- MeetingMinutes - 議事録
- ActionItem - アクションアイテム

**値オブジェクト**:
- MeetingId - 会議ID
- MeetingSchedule - スケジュール情報
- MeetingLocation - 会議場所
- OnlineMeetingInfo - オンライン会議情報
- AttendanceStatus - 出席ステータス
- RecurrenceRule - 繰り返しルール

### TypeScript実装

```typescript
// ========================================
// Value Objects
// ========================================

/**
 * MeetingId - 会議ID
 */
export class MeetingId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new InvalidMeetingIdError(value);
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: MeetingId): boolean {
    return this.value === other.value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public static generate(): MeetingId {
    return new MeetingId(crypto.randomUUID());
  }
}

/**
 * MeetingSchedule - スケジュール情報
 */
export class MeetingSchedule {
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly timezone: string;
  public readonly durationMinutes: number;

  constructor(startTime: Date, endTime: Date, timezone: string = 'UTC') {
    // BR-MEET-001: 開始時刻は終了時刻より前でなければならない
    if (startTime >= endTime) {
      throw new InvalidMeetingScheduleError('Start time must be before end time');
    }

    // BR-MEET-002: 会議時間は5分以上でなければならない
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    if (durationMinutes < 5) {
      throw new MeetingTooShortError(durationMinutes);
    }

    // BR-MEET-003: 会議時間は24時間以内でなければならない
    if (durationMinutes > 1440) {
      throw new MeetingTooLongError(durationMinutes);
    }

    this.startTime = startTime;
    this.endTime = endTime;
    this.timezone = timezone;
    this.durationMinutes = durationMinutes;
  }

  public isInProgress(currentTime: Date = new Date()): boolean {
    return currentTime >= this.startTime && currentTime <= this.endTime;
  }

  public isUpcoming(currentTime: Date = new Date()): boolean {
    return currentTime < this.startTime;
  }

  public isPast(currentTime: Date = new Date()): boolean {
    return currentTime > this.endTime;
  }

  public getTimeUntilStart(currentTime: Date = new Date()): number {
    return this.startTime.getTime() - currentTime.getTime();
  }

  public overlaps(other: MeetingSchedule): boolean {
    return (
      (this.startTime < other.endTime && this.endTime > other.startTime) ||
      (other.startTime < this.endTime && other.endTime > this.startTime)
    );
  }
}

/**
 * MeetingLocation - 会議場所
 */
export class MeetingLocation {
  public readonly type: 'physical' | 'online' | 'hybrid';
  public readonly physicalLocation?: string;
  public readonly roomId?: string;
  public readonly onlineMeetingUrl?: string;

  private constructor(
    type: 'physical' | 'online' | 'hybrid',
    physicalLocation?: string,
    roomId?: string,
    onlineMeetingUrl?: string
  ) {
    this.type = type;
    this.physicalLocation = physicalLocation;
    this.roomId = roomId;
    this.onlineMeetingUrl = onlineMeetingUrl;
  }

  public static physical(location: string, roomId?: string): MeetingLocation {
    return new MeetingLocation('physical', location, roomId);
  }

  public static online(url: string): MeetingLocation {
    return new MeetingLocation('online', undefined, undefined, url);
  }

  public static hybrid(location: string, url: string, roomId?: string): MeetingLocation {
    return new MeetingLocation('hybrid', location, roomId, url);
  }

  public isPhysical(): boolean {
    return this.type === 'physical';
  }

  public isOnline(): boolean {
    return this.type === 'online';
  }

  public isHybrid(): boolean {
    return this.type === 'hybrid';
  }
}

/**
 * OnlineMeetingInfo - オンライン会議情報
 */
export class OnlineMeetingInfo {
  public readonly provider: OnlineMeetingProvider;
  public readonly meetingUrl: string;
  public readonly meetingId: string;
  public readonly password?: string;
  public readonly dialInNumbers?: string[];

  constructor(
    provider: OnlineMeetingProvider,
    meetingUrl: string,
    meetingId: string,
    password?: string,
    dialInNumbers?: string[]
  ) {
    this.provider = provider;
    this.meetingUrl = meetingUrl;
    this.meetingId = meetingId;
    this.password = password;
    this.dialInNumbers = dialInNumbers;
  }

  public getJoinInstructions(): string {
    let instructions = `Join ${this.provider} Meeting:\n`;
    instructions += `Meeting URL: ${this.meetingUrl}\n`;
    instructions += `Meeting ID: ${this.meetingId}\n`;

    if (this.password) {
      instructions += `Password: ${this.password}\n`;
    }

    if (this.dialInNumbers && this.dialInNumbers.length > 0) {
      instructions += `\nDial-in Numbers:\n`;
      this.dialInNumbers.forEach(number => {
        instructions += `  ${number}\n`;
      });
    }

    return instructions;
  }
}

/**
 * OnlineMeetingProvider - オンライン会議プロバイダー
 */
export enum OnlineMeetingProvider {
  ZOOM = 'zoom',
  MICROSOFT_TEAMS = 'microsoft_teams',
  GOOGLE_MEET = 'google_meet',
  WEBEX = 'webex'
}

/**
 * AttendanceStatus - 出席ステータス
 */
export enum AttendanceStatus {
  PENDING = 'pending',       // 未回答
  ACCEPTED = 'accepted',     // 参加
  DECLINED = 'declined',     // 不参加
  TENTATIVE = 'tentative',   // 仮参加
  ATTENDED = 'attended',     // 出席済み
  NO_SHOW = 'no_show'        // 欠席
}

/**
 * RecurrenceRule - 繰り返しルール
 */
export class RecurrenceRule {
  public readonly frequency: RecurrenceFrequency;
  public readonly interval: number;
  public readonly endDate?: Date;
  public readonly count?: number;
  public readonly daysOfWeek?: number[]; // 0=Sunday, 6=Saturday

  constructor(
    frequency: RecurrenceFrequency,
    interval: number = 1,
    endDate?: Date,
    count?: number,
    daysOfWeek?: number[]
  ) {
    // BR-MEET-004: 繰り返し間隔は1以上
    if (interval < 1) {
      throw new InvalidRecurrenceIntervalError(interval);
    }

    this.frequency = frequency;
    this.interval = interval;
    this.endDate = endDate;
    this.count = count;
    this.daysOfWeek = daysOfWeek;
  }

  public static daily(interval: number = 1, endDate?: Date): RecurrenceRule {
    return new RecurrenceRule(RecurrenceFrequency.DAILY, interval, endDate);
  }

  public static weekly(daysOfWeek: number[], interval: number = 1, endDate?: Date): RecurrenceRule {
    return new RecurrenceRule(RecurrenceFrequency.WEEKLY, interval, endDate, undefined, daysOfWeek);
  }

  public static monthly(interval: number = 1, count?: number): RecurrenceRule {
    return new RecurrenceRule(RecurrenceFrequency.MONTHLY, interval, undefined, count);
  }

  public getNextOccurrence(currentDate: Date): Date {
    const next = new Date(currentDate);

    switch (this.frequency) {
      case RecurrenceFrequency.DAILY:
        next.setDate(next.getDate() + this.interval);
        break;
      case RecurrenceFrequency.WEEKLY:
        next.setDate(next.getDate() + (7 * this.interval));
        break;
      case RecurrenceFrequency.MONTHLY:
        next.setMonth(next.getMonth() + this.interval);
        break;
    }

    return next;
  }

  public shouldRecur(currentOccurrence: number, currentDate: Date): boolean {
    if (this.count && currentOccurrence >= this.count) {
      return false;
    }

    if (this.endDate && currentDate > this.endDate) {
      return false;
    }

    return true;
  }
}

/**
 * RecurrenceFrequency - 繰り返し頻度
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

/**
 * MeetingType - 会議種別
 */
export enum MeetingType {
  ONE_ON_ONE = 'one_on_one',
  TEAM_MEETING = 'team_meeting',
  PROJECT_MEETING = 'project_meeting',
  CLIENT_MEETING = 'client_meeting',
  ALL_HANDS = 'all_hands',
  TRAINING = 'training',
  INTERVIEW = 'interview'
}

/**
 * MeetingStatus - 会議ステータス
 */
export enum MeetingStatus {
  SCHEDULED = 'scheduled',   // スケジュール済み
  IN_PROGRESS = 'in_progress', // 進行中
  COMPLETED = 'completed',   // 完了
  CANCELLED = 'cancelled'    // キャンセル
}

// ========================================
// Entities
// ========================================

/**
 * Meeting - 会議エンティティ（集約ルート）
 */
export class Meeting {
  private id: MeetingId;
  private title: string;
  private description: string;
  private type: MeetingType;
  private status: MeetingStatus;
  private organizerId: string;
  private schedule: MeetingSchedule;
  private location: MeetingLocation;
  private onlineMeetingInfo: OnlineMeetingInfo | null;
  private participants: Participant[];
  private agenda: string[];
  private minutes: MeetingMinutes | null;
  private recurrenceRule: RecurrenceRule | null;
  private parentMeetingId: MeetingId | null; // For recurring meetings
  private recordingUrl: string | null;
  private createdAt: Date;
  private updatedAt: Date;
  private cancelledAt: Date | null;
  private cancellationReason: string | null;

  // Domain Events
  private domainEvents: DomainEvent[] = [];

  constructor(
    id: MeetingId,
    title: string,
    description: string,
    type: MeetingType,
    organizerId: string,
    schedule: MeetingSchedule,
    location: MeetingLocation
  ) {
    this.id = id;
    this.title = this.validateTitle(title);
    this.description = description;
    this.type = type;
    this.status = MeetingStatus.SCHEDULED;
    this.organizerId = organizerId;
    this.schedule = schedule;
    this.location = location;
    this.onlineMeetingInfo = null;
    this.participants = [new Participant(organizerId, 'organizer', AttendanceStatus.ACCEPTED)];
    this.agenda = [];
    this.minutes = null;
    this.recurrenceRule = null;
    this.parentMeetingId = null;
    this.recordingUrl = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.cancelledAt = null;
    this.cancellationReason = null;
  }

  // ========================================
  // Factory Methods
  // ========================================

  /**
   * 1回限りの会議を作成
   */
  public static createOneTime(
    title: string,
    description: string,
    type: MeetingType,
    organizerId: string,
    schedule: MeetingSchedule,
    location: MeetingLocation
  ): Meeting {
    const meeting = new Meeting(
      MeetingId.generate(),
      title,
      description,
      type,
      organizerId,
      schedule,
      location
    );

    meeting.addDomainEvent(new MeetingScheduledEvent(
      meeting.id.toString(),
      organizerId,
      title,
      schedule.startTime,
      schedule.endTime,
      meeting.createdAt
    ));

    return meeting;
  }

  /**
   * 繰り返し会議を作成
   */
  public static createRecurring(
    title: string,
    description: string,
    type: MeetingType,
    organizerId: string,
    schedule: MeetingSchedule,
    location: MeetingLocation,
    recurrenceRule: RecurrenceRule
  ): Meeting {
    const meeting = new Meeting(
      MeetingId.generate(),
      title,
      description,
      type,
      organizerId,
      schedule,
      location
    );

    meeting.recurrenceRule = recurrenceRule;

    meeting.addDomainEvent(new RecurringMeetingScheduledEvent(
      meeting.id.toString(),
      organizerId,
      title,
      schedule.startTime,
      recurrenceRule.frequency,
      meeting.createdAt
    ));

    return meeting;
  }

  // ========================================
  // Business Logic - Participant Management
  // ========================================

  /**
   * 参加者を招待
   */
  public inviteParticipant(userId: string, role: ParticipantRole = 'attendee'): void {
    // BR-MEET-005: キャンセル済み会議には参加者追加不可
    if (this.status === MeetingStatus.CANCELLED) {
      throw new CannotInviteToCancel ledMeetingError(this.id.toString());
    }

    // BR-MEET-006: 既に参加者の場合はエラー
    if (this.isParticipant(userId)) {
      throw new UserAlreadyParticipantError(this.id.toString(), userId);
    }

    const participant = new Participant(userId, role, AttendanceStatus.PENDING);
    this.participants.push(participant);
    this.updatedAt = new Date();

    this.addDomainEvent(new ParticipantInvitedEvent(
      this.id.toString(),
      userId,
      role,
      this.organizerId,
      new Date()
    ));
  }

  /**
   * 複数の参加者を招待
   */
  public inviteParticipants(userIds: string[], role: ParticipantRole = 'attendee'): void {
    for (const userId of userIds) {
      this.inviteParticipant(userId, role);
    }
  }

  /**
   * 招待を承諾
   */
  public acceptInvitation(userId: string): void {
    const participant = this.getParticipant(userId);

    // BR-MEET-007: 参加者のみ招待承諾可能
    if (!participant) {
      throw new UserNotParticipantError(this.id.toString(), userId);
    }

    participant.accept();
    this.updatedAt = new Date();

    this.addDomainEvent(new InvitationAcceptedEvent(
      this.id.toString(),
      userId,
      new Date()
    ));
  }

  /**
   * 招待を辞退
   */
  public declineInvitation(userId: string): void {
    const participant = this.getParticipant(userId);

    if (!participant) {
      throw new UserNotParticipantError(this.id.toString(), userId);
    }

    participant.decline();
    this.updatedAt = new Date();

    this.addDomainEvent(new InvitationDeclinedEvent(
      this.id.toString(),
      userId,
      new Date()
    ));
  }

  /**
   * 仮承諾
   */
  public tentativelyAccept(userId: string): void {
    const participant = this.getParticipant(userId);

    if (!participant) {
      throw new UserNotParticipantError(this.id.toString(), userId);
    }

    participant.tentative();
    this.updatedAt = new Date();

    this.addDomainEvent(new InvitationTentativeEvent(
      this.id.toString(),
      userId,
      new Date()
    ));
  }

  /**
   * 出席を記録
   */
  public recordAttendance(userId: string): void {
    const participant = this.getParticipant(userId);

    if (!participant) {
      throw new UserNotParticipantError(this.id.toString(), userId);
    }

    participant.markAsAttended();
    this.updatedAt = new Date();

    this.addDomainEvent(new AttendanceRecordedEvent(
      this.id.toString(),
      userId,
      new Date()
    ));
  }

  /**
   * 欠席を記録
   */
  public recordNoShow(userId: string): void {
    const participant = this.getParticipant(userId);

    if (!participant) {
      throw new UserNotParticipantError(this.id.toString(), userId);
    }

    participant.markAsNoShow();
    this.updatedAt = new Date();
  }

  // ========================================
  // Business Logic - Meeting Lifecycle
  // ========================================

  /**
   * 会議を開始
   */
  public start(): void {
    // BR-MEET-008: スケジュール済みステータスのみ開始可能
    if (this.status !== MeetingStatus.SCHEDULED) {
      throw new InvalidMeetingStatusForStartError(this.id.toString(), this.status);
    }

    // BR-MEET-009: 開始時刻の30分前から開始可能
    const timeUntilStart = this.schedule.getTimeUntilStart();
    const thirtyMinutes = 30 * 60 * 1000;
    if (timeUntilStart > thirtyMinutes) {
      throw new MeetingStartTooEarlyError(this.id.toString(), timeUntilStart);
    }

    this.status = MeetingStatus.IN_PROGRESS;
    this.updatedAt = new Date();

    this.addDomainEvent(new MeetingStartedEvent(
      this.id.toString(),
      this.organizerId,
      new Date()
    ));
  }

  /**
   * 会議を終了
   */
  public complete(): void {
    // BR-MEET-010: 進行中ステータスのみ完了可能
    if (this.status !== MeetingStatus.IN_PROGRESS) {
      throw new InvalidMeetingStatusForCompleteError(this.id.toString(), this.status);
    }

    this.status = MeetingStatus.COMPLETED;
    this.updatedAt = new Date();

    this.addDomainEvent(new MeetingCompletedEvent(
      this.id.toString(),
      this.organizerId,
      new Date()
    ));
  }

  /**
   * 会議をキャンセル
   */
  public cancel(cancelledBy: string, reason: string): void {
    // BR-MEET-011: 主催者のみキャンセル可能
    if (cancelledBy !== this.organizerId) {
      throw new UnauthorizedMeetingCancellationError(this.id.toString(), cancelledBy);
    }

    // BR-MEET-012: 完了済み・キャンセル済み会議はキャンセル不可
    if ([MeetingStatus.COMPLETED, MeetingStatus.CANCELLED].includes(this.status)) {
      throw new CannotCancelMeetingError(this.id.toString(), this.status);
    }

    this.status = MeetingStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.updatedAt = new Date();

    this.addDomainEvent(new MeetingCancelledEvent(
      this.id.toString(),
      cancelledBy,
      reason,
      this.cancelledAt
    ));
  }

  /**
   * スケジュールを変更
   */
  public reschedule(newSchedule: MeetingSchedule, rescheduledBy: string): void {
    // BR-MEET-013: 主催者のみスケジュール変更可能
    if (rescheduledBy !== this.organizerId) {
      throw new UnauthorizedMeetingRescheduleError(this.id.toString(), rescheduledBy);
    }

    // BR-MEET-014: 完了済み・キャンセル済み会議はスケジュール変更不可
    if ([MeetingStatus.COMPLETED, MeetingStatus.CANCELLED].includes(this.status)) {
      throw new CannotRescheduleMeetingError(this.id.toString(), this.status);
    }

    const oldSchedule = this.schedule;
    this.schedule = newSchedule;
    this.updatedAt = new Date();

    this.addDomainEvent(new MeetingRescheduledEvent(
      this.id.toString(),
      rescheduledBy,
      oldSchedule.startTime,
      newSchedule.startTime,
      new Date()
    ));
  }

  // ========================================
  // Business Logic - Online Meeting
  // ========================================

  /**
   * オンライン会議情報を設定
   */
  public setOnlineMeetingInfo(info: OnlineMeetingInfo): void {
    this.onlineMeetingInfo = info;
    this.updatedAt = new Date();

    this.addDomainEvent(new OnlineMeetingInfoSetEvent(
      this.id.toString(),
      info.provider,
      info.meetingUrl,
      new Date()
    ));
  }

  /**
   * 録画URLを設定
   */
  public setRecordingUrl(url: string, setBy: string): void {
    // BR-MEET-015: 主催者のみ録画URL設定可能
    if (setBy !== this.organizerId) {
      throw new UnauthorizedRecordingUrlSetError(this.id.toString(), setBy);
    }

    this.recordingUrl = url;
    this.updatedAt = new Date();

    this.addDomainEvent(new RecordingUrlSetEvent(
      this.id.toString(),
      url,
      setBy,
      new Date()
    ));
  }

  // ========================================
  // Business Logic - Agenda & Minutes
  // ========================================

  /**
   * アジェンダを追加
   */
  public addAgendaItem(item: string): void {
    // BR-MEET-016: 空のアジェンダアイテムは追加不可
    if (!item || item.trim().length === 0) {
      throw new EmptyAgendaItemError(this.id.toString());
    }

    this.agenda.push(item);
    this.updatedAt = new Date();
  }

  /**
   * アジェンダを設定
   */
  public setAgenda(agenda: string[]): void {
    this.agenda = agenda.filter(item => item && item.trim().length > 0);
    this.updatedAt = new Date();
  }

  /**
   * 議事録を作成
   */
  public createMinutes(content: string, createdBy: string): void {
    // BR-MEET-017: 参加者のみ議事録作成可能
    if (!this.isParticipant(createdBy)) {
      throw new UnauthorizedMinutesCreationError(this.id.toString(), createdBy);
    }

    this.minutes = new MeetingMinutes(
      crypto.randomUUID(),
      this.id.toString(),
      content,
      createdBy,
      new Date()
    );
    this.updatedAt = new Date();

    this.addDomainEvent(new MinutesCreatedEvent(
      this.id.toString(),
      this.minutes.id,
      createdBy,
      new Date()
    ));
  }

  /**
   * 議事録を更新
   */
  public updateMinutes(content: string, updatedBy: string): void {
    if (!this.minutes) {
      throw new MinutesNotFoundError(this.id.toString());
    }

    // BR-MEET-018: 議事録作成者または主催者のみ更新可能
    if (updatedBy !== this.minutes.createdBy && updatedBy !== this.organizerId) {
      throw new UnauthorizedMinutesUpdateError(this.id.toString(), updatedBy);
    }

    this.minutes.update(content, updatedBy);
    this.updatedAt = new Date();

    this.addDomainEvent(new MinutesUpdatedEvent(
      this.id.toString(),
      this.minutes.id,
      updatedBy,
      new Date()
    ));
  }

  // ========================================
  // Query Methods
  // ========================================

  public getId(): MeetingId {
    return this.id;
  }

  public getTitle(): string {
    return this.title;
  }

  public getStatus(): MeetingStatus {
    return this.status;
  }

  public getOrganizerId(): string {
    return this.organizerId;
  }

  public getSchedule(): MeetingSchedule {
    return this.schedule;
  }

  public getLocation(): MeetingLocation {
    return this.location;
  }

  public getOnlineMeetingInfo(): OnlineMeetingInfo | null {
    return this.onlineMeetingInfo;
  }

  public getParticipants(): Participant[] {
    return [...this.participants];
  }

  public getParticipant(userId: string): Participant | undefined {
    return this.participants.find(p => p.userId === userId);
  }

  public isParticipant(userId: string): boolean {
    return this.participants.some(p => p.userId === userId);
  }

  public getAgenda(): string[] {
    return [...this.agenda];
  }

  public getMinutes(): MeetingMinutes | null {
    return this.minutes;
  }

  public getRecordingUrl(): string | null {
    return this.recordingUrl;
  }

  public isRecurring(): boolean {
    return this.recurrenceRule !== null;
  }

  public getRecurrenceRule(): RecurrenceRule | null {
    return this.recurrenceRule;
  }

  public isScheduled(): boolean {
    return this.status === MeetingStatus.SCHEDULED;
  }

  public isInProgress(): boolean {
    return this.status === MeetingStatus.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.status === MeetingStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.status === MeetingStatus.CANCELLED;
  }

  public getAcceptedParticipantsCount(): number {
    return this.participants.filter(p => p.status === AttendanceStatus.ACCEPTED).length;
  }

  public getAttendedParticipantsCount(): number {
    return this.participants.filter(p => p.status === AttendanceStatus.ATTENDED).length;
  }

  // ========================================
  // Validation
  // ========================================

  private validateTitle(title: string): string {
    // BR-MEET-019: タイトルは3-200文字
    if (title.length < 3 || title.length > 200) {
      throw new InvalidMeetingTitleLengthError(title.length);
    }
    return title;
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
 * Participant - 参加者エンティティ
 */
export class Participant {
  public readonly userId: string;
  public role: ParticipantRole;
  public status: AttendanceStatus;
  public readonly invitedAt: Date;
  public respondedAt: Date | null;

  constructor(userId: string, role: ParticipantRole, status: AttendanceStatus) {
    this.userId = userId;
    this.role = role;
    this.status = status;
    this.invitedAt = new Date();
    this.respondedAt = null;
  }

  public accept(): void {
    this.status = AttendanceStatus.ACCEPTED;
    this.respondedAt = new Date();
  }

  public decline(): void {
    this.status = AttendanceStatus.DECLINED;
    this.respondedAt = new Date();
  }

  public tentative(): void {
    this.status = AttendanceStatus.TENTATIVE;
    this.respondedAt = new Date();
  }

  public markAsAttended(): void {
    this.status = AttendanceStatus.ATTENDED;
  }

  public markAsNoShow(): void {
    this.status = AttendanceStatus.NO_SHOW;
  }

  public hasResponded(): boolean {
    return this.respondedAt !== null;
  }
}

/**
 * ParticipantRole - 参加者ロール
 */
export type ParticipantRole = 'organizer' | 'required' | 'optional' | 'attendee';

/**
 * MeetingMinutes - 議事録エンティティ
 */
export class MeetingMinutes {
  public readonly id: string;
  public readonly meetingId: string;
  public content: string;
  public readonly createdBy: string;
  public readonly createdAt: Date;
  public updatedBy: string | null;
  public updatedAt: Date | null;
  public actionItems: ActionItem[];

  constructor(
    id: string,
    meetingId: string,
    content: string,
    createdBy: string,
    createdAt: Date
  ) {
    this.id = id;
    this.meetingId = meetingId;
    this.content = content;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedBy = null;
    this.updatedAt = null;
    this.actionItems = [];
  }

  public update(content: string, updatedBy: string): void {
    this.content = content;
    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  public addActionItem(description: string, assigneeId: string, dueDate?: Date): void {
    const actionItem = new ActionItem(
      crypto.randomUUID(),
      this.meetingId,
      description,
      assigneeId,
      dueDate
    );
    this.actionItems.push(actionItem);
  }

  public getActionItems(): ActionItem[] {
    return [...this.actionItems];
  }

  public getPendingActionItems(): ActionItem[] {
    return this.actionItems.filter(item => !item.isCompleted);
  }
}

/**
 * ActionItem - アクションアイテムエンティティ
 */
export class ActionItem {
  public readonly id: string;
  public readonly meetingId: string;
  public description: string;
  public assigneeId: string;
  public dueDate: Date | null;
  public isCompleted: boolean;
  public completedAt: Date | null;
  public readonly createdAt: Date;

  constructor(
    id: string,
    meetingId: string,
    description: string,
    assigneeId: string,
    dueDate?: Date
  ) {
    this.id = id;
    this.meetingId = meetingId;
    this.description = description;
    this.assigneeId = assigneeId;
    this.dueDate = dueDate || null;
    this.isCompleted = false;
    this.completedAt = null;
    this.createdAt = new Date();
  }

  public complete(): void {
    this.isCompleted = true;
    this.completedAt = new Date();
  }

  public isOverdue(): boolean {
    if (!this.dueDate || this.isCompleted) {
      return false;
    }
    return new Date() > this.dueDate;
  }
}
```

---

## Online Meeting Integration {#online-meeting}

### オンライン会議プロバイダー統合

```typescript
/**
 * OnlineMeetingService - オンライン会議サービス
 */
export class OnlineMeetingService {
  constructor(
    private zoomProvider: ZoomMeetingProvider,
    private teamsProvider: TeamsMeetingProvider,
    private meetProvider: GoogleMeetProvider
  ) {}

  /**
   * オンライン会議を作成
   */
  public async createOnlineMeeting(
    meeting: Meeting,
    provider: OnlineMeetingProvider
  ): Promise<OnlineMeetingInfo> {
    let info: OnlineMeetingInfo;

    switch (provider) {
      case OnlineMeetingProvider.ZOOM:
        info = await this.createZoomMeeting(meeting);
        break;
      case OnlineMeetingProvider.MICROSOFT_TEAMS:
        info = await this.createTeamsMeeting(meeting);
        break;
      case OnlineMeetingProvider.GOOGLE_MEET:
        info = await this.createGoogleMeet(meeting);
        break;
      default:
        throw new UnsupportedMeetingProviderError(provider);
    }

    meeting.setOnlineMeetingInfo(info);
    return info;
  }

  /**
   * Zoom会議を作成
   */
  private async createZoomMeeting(meeting: Meeting): Promise<OnlineMeetingInfo> {
    const response = await this.zoomProvider.createMeeting({
      topic: meeting.getTitle(),
      type: 2, // Scheduled meeting
      start_time: meeting.getSchedule().startTime.toISOString(),
      duration: meeting.getSchedule().durationMinutes,
      timezone: meeting.getSchedule().timezone,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true
      }
    });

    return new OnlineMeetingInfo(
      OnlineMeetingProvider.ZOOM,
      response.join_url,
      response.id.toString(),
      response.password,
      response.settings.global_dial_in_numbers?.map(n => n.number)
    );
  }

  /**
   * Teams会議を作成
   */
  private async createTeamsMeeting(meeting: Meeting): Promise<OnlineMeetingInfo> {
    const response = await this.teamsProvider.createOnlineMeeting({
      subject: meeting.getTitle(),
      startDateTime: meeting.getSchedule().startTime.toISOString(),
      endDateTime: meeting.getSchedule().endTime.toISOString()
    });

    return new OnlineMeetingInfo(
      OnlineMeetingProvider.MICROSOFT_TEAMS,
      response.joinWebUrl,
      response.id,
      undefined, // Teams doesn't use passwords
      response.audioConferencing?.dialinUrl ? [response.audioConferencing.dialinUrl] : undefined
    );
  }

  /**
   * Google Meet を作成
   */
  private async createGoogleMeet(meeting: Meeting): Promise<OnlineMeetingInfo> {
    const response = await this.meetProvider.createConference({
      summary: meeting.getTitle(),
      start: {
        dateTime: meeting.getSchedule().startTime.toISOString(),
        timeZone: meeting.getSchedule().timezone
      },
      end: {
        dateTime: meeting.getSchedule().endTime.toISOString(),
        timeZone: meeting.getSchedule().timezone
      },
      conferenceData: {
        createRequest: {
          requestId: meeting.getId().toString()
        }
      }
    });

    return new OnlineMeetingInfo(
      OnlineMeetingProvider.GOOGLE_MEET,
      response.hangoutLink,
      response.id,
      undefined,
      response.conferenceData?.entryPoints?.filter(e => e.entryPointType === 'phone')
        .map(e => e.uri)
    );
  }
}
```

---

## Reminder System {#reminder-system}

### リマインダー管理

```typescript
/**
 * MeetingReminderService - 会議リマインダーサービス
 */
export class MeetingReminderService {
  constructor(
    private meetingRepository: MeetingRepository,
    private notificationService: NotificationService,
    private scheduler: Scheduler
  ) {}

  /**
   * リマインダーをスケジュール
   */
  public async scheduleReminders(meeting: Meeting): Promise<void> {
    const schedule = meeting.getSchedule();
    const participants = meeting.getParticipants()
      .filter(p => p.status === AttendanceStatus.ACCEPTED || p.status === AttendanceStatus.TENTATIVE);

    // リマインダータイミング: 24時間前、1時間前、15分前
    const reminderTimings = [
      { minutes: 24 * 60, label: '24時間前' },
      { minutes: 60, label: '1時間前' },
      { minutes: 15, label: '15分前' }
    ];

    for (const timing of reminderTimings) {
      const reminderTime = new Date(
        schedule.startTime.getTime() - (timing.minutes * 60 * 1000)
      );

      // 過去の時刻はスキップ
      if (reminderTime < new Date()) {
        continue;
      }

      await this.scheduler.scheduleJob(
        'meeting-reminder',
        {
          meetingId: meeting.getId().toString(),
          timing: timing.label,
          participants: participants.map(p => p.userId)
        },
        reminderTime
      );
    }
  }

  /**
   * リマインダーを送信
   */
  public async sendReminder(
    meetingId: string,
    timing: string,
    participantIds: string[]
  ): Promise<void> {
    const meeting = await this.meetingRepository.findById(meetingId);
    if (!meeting || meeting.isCancelled()) {
      return; // キャンセル済み会議はリマインダー不要
    }

    const schedule = meeting.getSchedule();
    const title = `会議リマインダー: ${meeting.getTitle()}`;
    const body = `${timing}に開始される会議のリマインダーです。\n開始時刻: ${schedule.startTime.toLocaleString()}`;

    for (const participantId of participantIds) {
      await this.notificationService.send(
        participantId,
        NotificationPriority.HIGH,
        new NotificationPayload(
          NotificationType.MEETING_REMINDER,
          title,
          body,
          {
            meetingId: meeting.getId().toString(),
            startTime: schedule.startTime.toISOString()
          },
          this.getMeetingJoinUrl(meeting)
        )
      );
    }
  }

  private getMeetingJoinUrl(meeting: Meeting): string | undefined {
    const onlineInfo = meeting.getOnlineMeetingInfo();
    if (onlineInfo) {
      return onlineInfo.meetingUrl;
    }

    // Physical meeting - link to meeting details
    return `/meetings/${meeting.getId().toString()}`;
  }
}
```

---

## Business Rules {#business-rules}

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-MEET-001 | 開始時刻は終了時刻より前でなければならない | MeetingSchedule constructor |
| BR-MEET-002 | 会議時間は5分以上でなければならない | MeetingSchedule constructor |
| BR-MEET-003 | 会議時間は24時間以内でなければならない | MeetingSchedule constructor |
| BR-MEET-004 | 繰り返し間隔は1以上 | RecurrenceRule constructor |
| BR-MEET-005 | キャンセル済み会議には参加者追加不可 | Meeting.inviteParticipant() |
| BR-MEET-006 | 既に参加者の場合はエラー | Meeting.inviteParticipant() |
| BR-MEET-007 | 参加者のみ招待承諾可能 | Meeting.acceptInvitation() |
| BR-MEET-008 | スケジュール済みステータスのみ開始可能 | Meeting.start() |
| BR-MEET-009 | 開始時刻の30分前から開始可能 | Meeting.start() |
| BR-MEET-010 | 進行中ステータスのみ完了可能 | Meeting.complete() |
| BR-MEET-011 | 主催者のみキャンセル可能 | Meeting.cancel() |
| BR-MEET-012 | 完了済み・キャンセル済み会議はキャンセル不可 | Meeting.cancel() |
| BR-MEET-013 | 主催者のみスケジュール変更可能 | Meeting.reschedule() |
| BR-MEET-014 | 完了済み・キャンセル済み会議はスケジュール変更不可 | Meeting.reschedule() |
| BR-MEET-015 | 主催者のみ録画URL設定可能 | Meeting.setRecordingUrl() |
| BR-MEET-016 | 空のアジェンダアイテムは追加不可 | Meeting.addAgendaItem() |
| BR-MEET-017 | 参加者のみ議事録作成可能 | Meeting.createMinutes() |
| BR-MEET-018 | 議事録作成者または主催者のみ更新可能 | Meeting.updateMinutes() |
| BR-MEET-019 | タイトルは3-200文字 | Meeting.validateTitle() |

---

## Domain Events {#domain-events}

```typescript
/**
 * MeetingScheduledEvent - 会議スケジュールイベント
 */
export class MeetingScheduledEvent implements DomainEvent {
  public readonly eventType = 'MeetingScheduled';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly organizerId: string,
    public readonly title: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ParticipantInvitedEvent - 参加者招待イベント
 */
export class ParticipantInvitedEvent implements DomainEvent {
  public readonly eventType = 'ParticipantInvited';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly userId: string,
    public readonly role: ParticipantRole,
    public readonly invitedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * InvitationAcceptedEvent - 招待承諾イベント
 */
export class InvitationAcceptedEvent implements DomainEvent {
  public readonly eventType = 'InvitationAccepted';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly userId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MeetingStartedEvent - 会議開始イベント
 */
export class MeetingStartedEvent implements DomainEvent {
  public readonly eventType = 'MeetingStarted';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly organizerId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MeetingCompletedEvent - 会議完了イベント
 */
export class MeetingCompletedEvent implements DomainEvent {
  public readonly eventType = 'MeetingCompleted';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly organizerId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MeetingCancelledEvent - 会議キャンセルイベント
 */
export class MeetingCancelledEvent implements DomainEvent {
  public readonly eventType = 'MeetingCancelled';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly cancelledBy: string,
    public readonly reason: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MeetingRescheduledEvent - 会議再スケジュールイベント
 */
export class MeetingRescheduledEvent implements DomainEvent {
  public readonly eventType = 'MeetingRescheduled';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly rescheduledBy: string,
    public readonly oldStartTime: Date,
    public readonly newStartTime: Date,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * OnlineMeetingInfoSetEvent - オンライン会議情報設定イベント
 */
export class OnlineMeetingInfoSetEvent implements DomainEvent {
  public readonly eventType = 'OnlineMeetingInfoSet';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly provider: OnlineMeetingProvider,
    public readonly meetingUrl: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MinutesCreatedEvent - 議事録作成イベント
 */
export class MinutesCreatedEvent implements DomainEvent {
  public readonly eventType = 'MinutesCreated';
  public readonly occurredAt: Date;

  constructor(
    public readonly meetingId: string,
    public readonly minutesId: string,
    public readonly createdBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}
```

---

## Implementation Examples {#implementation-examples}

### 使用例1: 会議作成とオンライン会議統合

```typescript
// Application Service
export class MeetingApplicationService {
  constructor(
    private meetingRepository: MeetingRepository,
    private onlineMeetingService: OnlineMeetingService,
    private reminderService: MeetingReminderService,
    private eventBus: EventBus
  ) {}

  async createMeeting(
    title: string,
    description: string,
    organizerId: string,
    startTime: Date,
    endTime: Date,
    participantIds: string[],
    onlineProvider?: OnlineMeetingProvider
  ): Promise<string> {
    // スケジュール作成
    const schedule = new MeetingSchedule(startTime, endTime);

    // 場所設定（オンライン会議の場合は仮URL）
    const location = onlineProvider
      ? MeetingLocation.online('pending')
      : MeetingLocation.physical('Office');

    // 会議作成
    const meeting = Meeting.createOneTime(
      title,
      description,
      MeetingType.TEAM_MEETING,
      organizerId,
      schedule,
      location
    );

    // 参加者招待
    meeting.inviteParticipants(participantIds);

    // オンライン会議作成
    if (onlineProvider) {
      const onlineInfo = await this.onlineMeetingService.createOnlineMeeting(
        meeting,
        onlineProvider
      );
      meeting.setOnlineMeetingInfo(onlineInfo);
    }

    // 保存
    await this.meetingRepository.save(meeting);

    // イベント発行
    for (const event of meeting.getDomainEvents()) {
      await this.eventBus.publish(event);
    }

    meeting.clearDomainEvents();

    // リマインダースケジュール
    await this.reminderService.scheduleReminders(meeting);

    return meeting.getId().toString();
  }
}
```

### 使用例2: 繰り返し会議

```typescript
async createRecurringMeeting(
  title: string,
  organizerId: string,
  startTime: Date,
  endTime: Date,
  frequency: RecurrenceFrequency,
  daysOfWeek?: number[],
  endDate?: Date
): Promise<string> {
  const schedule = new MeetingSchedule(startTime, endTime);
  const location = MeetingLocation.online('pending');

  // 繰り返しルール
  const recurrence = frequency === RecurrenceFrequency.WEEKLY && daysOfWeek
    ? RecurrenceRule.weekly(daysOfWeek, 1, endDate)
    : RecurrenceRule.daily(1, endDate);

  // 繰り返し会議作成
  const meeting = Meeting.createRecurring(
    title,
    '',
    MeetingType.TEAM_MEETING,
    organizerId,
    schedule,
    location,
    recurrence
  );

  await this.meetingRepository.save(meeting);

  // イベント発行
  for (const event of meeting.getDomainEvents()) {
    await this.eventBus.publish(event);
  }

  return meeting.getId().toString();
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 会議管理詳細化
