# BC-007: ドメインサービス詳細 [Domain Services Details]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03

---

## 目次

1. [概要](#overview)
2. [Message Routing Service](#message-routing)
3. [Notification Delivery Service](#notification-delivery)
4. [Meeting Scheduling Service](#meeting-scheduling)
5. [Workspace Integration Service](#workspace-integration)
6. [Activity Feed Service](#activity-feed)
7. [Search & Discovery Service](#search-discovery)
8. [Implementation Examples](#implementation-examples)

---

## 概要 {#overview}

BC-007のドメインサービスは、複数の集約にまたがる複雑なビジネスロジックを実装します。

### ドメインサービスの責務

- **集約横断ロジック**: 複数の集約を協調させる処理
- **外部システム統合**: BC間連携の調整
- **複雑な計算**: ビジネスルール適用
- **ワークフロー**: 複数ステップの処理フロー

### ドメインサービス一覧

| サービス名 | 責務 | 主要メソッド |
|----------|------|------------|
| **MessageRoutingService** | メッセージルーティング | routeMessage(), broadcastToChannel() |
| **NotificationDeliveryService** | 通知配信 | deliver(), scheduleDelivery() |
| **MeetingSchedulingService** | 会議スケジューリング | findAvailableSlots(), scheduleOptimal() |
| **WorkspaceIntegrationService** | ワークスペース統合 | createFromProject(), syncMembers() |
| **ActivityFeedService** | アクティビティフィード | generateFeed(), aggregateActivities() |
| **SearchService** | 検索 | searchMessages(), searchDocuments() |

---

## Message Routing Service {#message-routing}

### 責務

メッセージを適切な配信先へルーティングし、リアルタイム配信とオフライン通知を管理します。

### TypeScript実装

```typescript
/**
 * MessageRoutingService - メッセージルーティングサービス
 */
export class MessageRoutingService {
  constructor(
    private messageRepository: MessageRepository,
    private channelRepository: ChannelRepository,
    private directConversationRepository: DirectConversationRepository,
    private webSocketGateway: WebSocketGateway,
    private notificationService: NotificationService,
    private presenceService: PresenceService
  ) {}

  /**
   * メッセージをルーティング
   */
  public async routeMessage(message: Message): Promise<void> {
    const recipientInfo = message.getRecipientInfo();

    if (recipientInfo.isChannel()) {
      await this.routeToChannel(message, recipientInfo.channelId!);
    } else if (recipientInfo.isDirect()) {
      await this.routeToDirect(message, recipientInfo.recipientIds![0]);
    } else if (recipientInfo.isGroup()) {
      await this.routeToGroup(message, recipientInfo.recipientIds!);
    }
  }

  /**
   * チャネルへルーティング
   */
  private async routeToChannel(message: Message, channelId: string): Promise<void> {
    // チャネルメンバー取得
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new ChannelNotFoundError(channelId);
    }

    const members = channel.getMembers();
    const memberIds = members.map(m => m.userId);

    // オンライン/オフライン分類
    const onlineUsers = await this.presenceService.getOnlineUsers(memberIds);
    const offlineUsers = memberIds.filter(id => !onlineUsers.includes(id));

    // オンラインユーザーにリアルタイム配信
    await this.deliverRealtime(message, onlineUsers);

    // オフラインユーザーに通知
    await this.sendOfflineNotifications(message, offlineUsers, channel.getName());
  }

  /**
   * ダイレクトメッセージへルーティング
   */
  private async routeToDirect(message: Message, recipientId: string): Promise<void> {
    // 会話を取得または作成
    const senderId = message.getSenderId();
    let conversation = await this.directConversationRepository.findByParticipants(
      senderId,
      recipientId
    );

    if (!conversation) {
      conversation = new DirectConversation(senderId, recipientId);
      await this.directConversationRepository.save(conversation);
    }

    // 会話を更新
    conversation.onMessageSent(senderId);
    await this.directConversationRepository.save(conversation);

    // 受信者がオンラインかチェック
    const isOnline = await this.presenceService.isOnline(recipientId);

    if (isOnline) {
      // リアルタイム配信
      await this.deliverRealtime(message, [recipientId]);
    } else {
      // オフライン通知
      const senderName = await this.getUserDisplayName(senderId);
      await this.sendDirectMessageNotification(message, recipientId, senderName);
    }
  }

  /**
   * グループメッセージへルーティング
   */
  private async routeToGroup(message: Message, recipientIds: string[]): Promise<void> {
    // 送信者を除外
    const recipients = recipientIds.filter(id => id !== message.getSenderId());

    // オンライン/オフライン分類
    const onlineUsers = await this.presenceService.getOnlineUsers(recipients);
    const offlineUsers = recipients.filter(id => !onlineUsers.includes(id));

    // リアルタイム配信
    await this.deliverRealtime(message, onlineUsers);

    // オフライン通知
    const senderName = await this.getUserDisplayName(message.getSenderId());
    await this.sendGroupMessageNotifications(message, offlineUsers, senderName);
  }

  /**
   * リアルタイム配信
   */
  private async deliverRealtime(message: Message, userIds: string[]): Promise<void> {
    await this.webSocketGateway.sendToUsers(userIds, {
      type: 'new_message',
      data: {
        messageId: message.getId().toString(),
        senderId: message.getSenderId(),
        content: message.getContent().getText(),
        recipientInfo: message.getRecipientInfo(),
        createdAt: message.getCreatedAt()
      }
    });
  }

  /**
   * オフライン通知送信
   */
  private async sendOfflineNotifications(
    message: Message,
    userIds: string[],
    channelName: string
  ): Promise<void> {
    const senderName = await this.getUserDisplayName(message.getSenderId());
    const content = message.getContent();

    for (const userId of userIds) {
      // メンションされている場合は高優先度
      const priority = content.hasMention(userId)
        ? NotificationPriority.HIGH
        : NotificationPriority.NORMAL;

      const title = content.hasMention(userId)
        ? `${senderName} mentioned you in #${channelName}`
        : `New message in #${channelName}`;

      const payload = new NotificationPayload(
        NotificationType.NEW_MESSAGE,
        title,
        this.truncateText(content.getText(), 100),
        {
          messageId: message.getId().toString(),
          channelId: message.getRecipientInfo().channelId,
          senderId: message.getSenderId()
        },
        this.getMessageUrl(message)
      );

      await this.notificationService.send(userId, priority, payload);
    }
  }

  /**
   * ダイレクトメッセージ通知送信
   */
  private async sendDirectMessageNotification(
    message: Message,
    recipientId: string,
    senderName: string
  ): Promise<void> {
    const payload = new NotificationPayload(
      NotificationType.NEW_DIRECT_MESSAGE,
      `Message from ${senderName}`,
      this.truncateText(message.getContent().getText(), 100),
      {
        messageId: message.getId().toString(),
        senderId: message.getSenderId()
      },
      this.getMessageUrl(message)
    );

    await this.notificationService.send(
      recipientId,
      NotificationPriority.HIGH,
      payload
    );
  }

  /**
   * スレッド返信のルーティング
   */
  public async routeThreadReply(reply: Message, parentMessage: Message): Promise<void> {
    // 親メッセージの送信者に通知
    const parentSenderId = parentMessage.getSenderId();
    if (parentSenderId !== reply.getSenderId()) {
      await this.notifyThreadReply(reply, parentSenderId);
    }

    // スレッド参加者に通知
    const threadParticipants = await this.getThreadParticipants(
      parentMessage.getId().toString()
    );

    for (const participantId of threadParticipants) {
      if (participantId !== reply.getSenderId()) {
        await this.notifyThreadReply(reply, participantId);
      }
    }

    // 通常のルーティング
    await this.routeMessage(reply);
  }

  /**
   * スレッド返信通知
   */
  private async notifyThreadReply(reply: Message, userId: string): Promise<void> {
    const senderName = await this.getUserDisplayName(reply.getSenderId());

    const payload = new NotificationPayload(
      NotificationType.THREAD_REPLY,
      `${senderName} replied to a thread`,
      this.truncateText(reply.getContent().getText(), 100),
      {
        messageId: reply.getId().toString(),
        parentMessageId: reply.getParentMessageId()?.toString(),
        senderId: reply.getSenderId()
      },
      this.getMessageUrl(reply)
    );

    await this.notificationService.send(userId, NotificationPriority.NORMAL, payload);
  }

  /**
   * メンション通知
   */
  public async notifyMentions(message: Message): Promise<void> {
    const mentions = message.getContent().getMentions();

    for (const mention of mentions) {
      const senderName = await this.getUserDisplayName(message.getSenderId());

      const payload = new NotificationPayload(
        NotificationType.MENTION,
        `${senderName} mentioned you`,
        this.truncateText(message.getContent().getText(), 100),
        {
          messageId: message.getId().toString(),
          senderId: message.getSenderId()
        },
        this.getMessageUrl(message)
      );

      await this.notificationService.send(
        mention.userId,
        NotificationPriority.HIGH,
        payload
      );
    }
  }

  /**
   * チャネルへブロードキャスト
   */
  public async broadcastToChannel(channelId: string, event: any): Promise<void> {
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      return;
    }

    const memberIds = channel.getMembers().map(m => m.userId);
    await this.webSocketGateway.sendToUsers(memberIds, event);
  }

  // ========================================
  // Helper Methods
  // ========================================

  private async getThreadParticipants(parentMessageId: string): Promise<string[]> {
    const replies = await this.messageRepository.findByThreadId(parentMessageId);
    const participants = new Set<string>();

    for (const reply of replies) {
      participants.add(reply.getSenderId());
    }

    return Array.from(participants);
  }

  private async getUserDisplayName(userId: string): Promise<string> {
    // BC-005 (Team & Resource) integration
    // Implementation omitted for brevity
    return userId;
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  private getMessageUrl(message: Message): string {
    const recipientInfo = message.getRecipientInfo();
    if (recipientInfo.isChannel()) {
      return `/channels/${recipientInfo.channelId}?message=${message.getId()}`;
    } else {
      return `/direct-messages?message=${message.getId()}`;
    }
  }

  private async sendGroupMessageNotifications(
    message: Message,
    userIds: string[],
    senderName: string
  ): Promise<void> {
    for (const userId of userIds) {
      const payload = new NotificationPayload(
        NotificationType.NEW_MESSAGE,
        `Message from ${senderName} in group`,
        this.truncateText(message.getContent().getText(), 100),
        {
          messageId: message.getId().toString(),
          senderId: message.getSenderId()
        }
      );

      await this.notificationService.send(userId, NotificationPriority.NORMAL, payload);
    }
  }
}

/**
 * PresenceService - プレゼンス管理サービス
 */
export class PresenceService {
  constructor(private cache: Cache) {}

  /**
   * ユーザーがオンラインか確認
   */
  public async isOnline(userId: string): Promise<boolean> {
    const presence = await this.cache.get(`presence:${userId}`);
    return presence === 'online';
  }

  /**
   * オンラインユーザーを取得
   */
  public async getOnlineUsers(userIds: string[]): Promise<string[]> {
    const onlineUsers: string[] = [];

    for (const userId of userIds) {
      if (await this.isOnline(userId)) {
        onlineUsers.push(userId);
      }
    }

    return onlineUsers;
  }

  /**
   * ユーザーをオンラインに設定
   */
  public async setOnline(userId: string): Promise<void> {
    await this.cache.set(`presence:${userId}`, 'online', 300); // 5 minutes TTL
  }

  /**
   * ユーザーをオフラインに設定
   */
  public async setOffline(userId: string): Promise<void> {
    await this.cache.delete(`presence:${userId}`);
  }
}
```

---

## Meeting Scheduling Service {#meeting-scheduling}

### 責務

会議の最適スケジューリング、参加者の空き時間検索、会議室予約を管理します。

### TypeScript実装

```typescript
/**
 * MeetingSchedulingService - 会議スケジューリングサービス
 */
export class MeetingSchedulingService {
  constructor(
    private meetingRepository: MeetingRepository,
    private calendarService: CalendarService,
    private roomBookingService: RoomBookingService
  ) {}

  /**
   * 空き時間を検索
   */
  public async findAvailableSlots(
    participantIds: string[],
    durationMinutes: number,
    preferredDates: Date[],
    timezone: string = 'UTC'
  ): Promise<TimeSlot[]> {
    const availableSlots: TimeSlot[] = [];

    for (const date of preferredDates) {
      // その日の営業時間スロットを生成（9:00-18:00）
      const daySlots = this.generateDaySlots(date, durationMinutes);

      for (const slot of daySlots) {
        // 全参加者が空いているかチェック
        const isAvailable = await this.checkAvailability(
          participantIds,
          slot.startTime,
          slot.endTime
        );

        if (isAvailable) {
          availableSlots.push(slot);
        }
      }
    }

    return availableSlots;
  }

  /**
   * 最適な時間帯をスケジュール
   */
  public async scheduleOptimal(
    title: string,
    participantIds: string[],
    durationMinutes: number,
    preferredDates: Date[],
    options: SchedulingOptions = {}
  ): Promise<Meeting> {
    // 空き時間を検索
    const availableSlots = await this.findAvailableSlots(
      participantIds,
      durationMinutes,
      preferredDates,
      options.timezone
    );

    if (availableSlots.length === 0) {
      throw new NoAvailableTimeSlotError(participantIds.length, preferredDates);
    }

    // 最適なスロットを選択（最も早い時間）
    const optimalSlot = this.selectOptimalSlot(availableSlots, options);

    // 会議室が必要な場合は予約
    let location: MeetingLocation;
    if (options.requiresRoom) {
      const room = await this.roomBookingService.bookRoom(
        optimalSlot.startTime,
        optimalSlot.endTime,
        participantIds.length
      );
      location = MeetingLocation.physical(room.location, room.id);
    } else {
      location = MeetingLocation.online('pending');
    }

    // スケジュール作成
    const schedule = new MeetingSchedule(
      optimalSlot.startTime,
      optimalSlot.endTime,
      options.timezone || 'UTC'
    );

    // 会議作成
    const meeting = Meeting.createOneTime(
      title,
      options.description || '',
      MeetingType.TEAM_MEETING,
      participantIds[0], // First participant as organizer
      schedule,
      location
    );

    // 他の参加者を招待
    for (let i = 1; i < participantIds.length; i++) {
      meeting.inviteParticipant(participantIds[i], 'required');
    }

    // 保存
    await this.meetingRepository.save(meeting);

    return meeting;
  }

  /**
   * 会議の再スケジュール提案
   */
  public async suggestReschedule(
    meetingId: string,
    reason: string
  ): Promise<TimeSlot[]> {
    const meeting = await this.meetingRepository.findById(meetingId);
    if (!meeting) {
      throw new MeetingNotFoundError(meetingId);
    }

    // 参加者リスト取得
    const participantIds = meeting.getParticipants()
      .filter(p => p.status === AttendanceStatus.ACCEPTED || p.status === AttendanceStatus.TENTATIVE)
      .map(p => p.userId);

    // 元の会議の1週間後から検索
    const currentSchedule = meeting.getSchedule();
    const searchDates = this.generateSearchDates(
      new Date(currentSchedule.startTime.getTime() + 7 * 24 * 60 * 60 * 1000),
      7
    );

    // 空き時間検索
    return await this.findAvailableSlots(
      participantIds,
      currentSchedule.durationMinutes,
      searchDates,
      currentSchedule.timezone
    );
  }

  /**
   * 繰り返し会議の次回発生を生成
   */
  public async generateNextOccurrence(recurringMeetingId: string): Promise<Meeting> {
    const parentMeeting = await this.meetingRepository.findById(recurringMeetingId);
    if (!parentMeeting) {
      throw new MeetingNotFoundError(recurringMeetingId);
    }

    const recurrenceRule = parentMeeting.getRecurrenceRule();
    if (!recurrenceRule) {
      throw new MeetingNotRecurringError(recurringMeetingId);
    }

    // 次回の日時を計算
    const currentSchedule = parentMeeting.getSchedule();
    const nextStartTime = recurrenceRule.getNextOccurrence(currentSchedule.startTime);
    const duration = currentSchedule.durationMinutes;
    const nextEndTime = new Date(nextStartTime.getTime() + duration * 60 * 1000);

    // 新しいスケジュール作成
    const nextSchedule = new MeetingSchedule(
      nextStartTime,
      nextEndTime,
      currentSchedule.timezone
    );

    // 次回会議作成
    const nextMeeting = Meeting.createOneTime(
      parentMeeting.getTitle(),
      '',
      MeetingType.TEAM_MEETING,
      parentMeeting.getOrganizerId(),
      nextSchedule,
      parentMeeting.getLocation()
    );

    // 参加者をコピー
    for (const participant of parentMeeting.getParticipants()) {
      if (participant.userId !== parentMeeting.getOrganizerId()) {
        nextMeeting.inviteParticipant(participant.userId, participant.role);
      }
    }

    await this.meetingRepository.save(nextMeeting);

    return nextMeeting;
  }

  // ========================================
  // Helper Methods
  // ========================================

  /**
   * 空き状況をチェック
   */
  private async checkAvailability(
    participantIds: string[],
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    for (const userId of participantIds) {
      // ユーザーの既存会議を取得
      const existingMeetings = await this.meetingRepository.findByUserAndTimeRange(
        userId,
        startTime,
        endTime
      );

      // 既にスケジュール済み会議がある場合は空いていない
      const hasConflict = existingMeetings.some(m =>
        m.getStatus() === MeetingStatus.SCHEDULED &&
        m.getSchedule().overlaps(new MeetingSchedule(startTime, endTime))
      );

      if (hasConflict) {
        return false;
      }

      // カレンダーサービスでも確認（外部カレンダー統合）
      const isBusy = await this.calendarService.isBusy(userId, startTime, endTime);
      if (isBusy) {
        return false;
      }
    }

    return true;
  }

  /**
   * 1日のスロットを生成
   */
  private generateDaySlots(date: Date, durationMinutes: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const workStartHour = 9;
    const workEndHour = 18;

    // 営業時間内で30分刻みのスロットを生成
    for (let hour = workStartHour; hour < workEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(date);
        startTime.setHours(hour, minute, 0, 0);

        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

        // 営業時間内に収まるかチェック
        if (endTime.getHours() <= workEndHour) {
          slots.push({ startTime, endTime });
        }
      }
    }

    return slots;
  }

  /**
   * 最適なスロットを選択
   */
  private selectOptimalSlot(slots: TimeSlot[], options: SchedulingOptions): TimeSlot {
    if (options.preferredTime) {
      // 希望時刻に最も近いスロットを選択
      return slots.reduce((closest, slot) => {
        const slotDiff = Math.abs(slot.startTime.getTime() - options.preferredTime!.getTime());
        const closestDiff = Math.abs(closest.startTime.getTime() - options.preferredTime!.getTime());
        return slotDiff < closestDiff ? slot : closest;
      });
    }

    // デフォルト: 最も早いスロット
    return slots[0];
  }

  /**
   * 検索日を生成
   */
  private generateSearchDates(startDate: Date, days: number): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }
}

/**
 * TimeSlot - 時間帯
 */
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

/**
 * SchedulingOptions - スケジューリングオプション
 */
export interface SchedulingOptions {
  timezone?: string;
  description?: string;
  requiresRoom?: boolean;
  preferredTime?: Date;
}

/**
 * RoomBookingService - 会議室予約サービス
 */
export class RoomBookingService {
  constructor(private roomRepository: RoomRepository) {}

  /**
   * 会議室を予約
   */
  public async bookRoom(
    startTime: Date,
    endTime: Date,
    capacity: number
  ): Promise<Room> {
    // 条件に合う空き会議室を検索
    const availableRooms = await this.roomRepository.findAvailable(
      startTime,
      endTime,
      capacity
    );

    if (availableRooms.length === 0) {
      throw new NoAvailableRoomError(startTime, endTime, capacity);
    }

    // 最小の部屋を選択（無駄を省く）
    const room = availableRooms.reduce((smallest, room) =>
      room.capacity < smallest.capacity ? room : smallest
    );

    // 予約
    await this.roomRepository.book(room.id, startTime, endTime);

    return room;
  }
}

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
}
```

---

## Workspace Integration Service {#workspace-integration}

### 責務

プロジェクトやチームからワークスペースを自動生成し、メンバーシップを同期します。

### TypeScript実装

```typescript
/**
 * WorkspaceIntegrationService - ワークスペース統合サービス
 */
export class WorkspaceIntegrationService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private channelRepository: ChannelRepository,
    private projectService: ProjectService, // BC-001
    private teamService: TeamService        // BC-005
  ) {}

  /**
   * プロジェクトからワークスペースを作成
   */
  public async createFromProject(projectId: string): Promise<Workspace> {
    // プロジェクト情報を取得（BC-001連携）
    const project = await this.projectService.getProject(projectId);

    // ワークスペース作成
    const workspace = Workspace.createForProject(
      projectId,
      project.name,
      project.managerId
    );

    // プロジェクトメンバーを追加
    for (const member of project.members) {
      const permission = this.mapProjectRoleToPermission(member.role);
      workspace.addMember(member.userId, permission, project.managerId);
    }

    // デフォルトチャネルを作成
    await this.createDefaultChannels(workspace);

    // 保存
    await this.workspaceRepository.save(workspace);

    return workspace;
  }

  /**
   * チームからワークスペースを作成
   */
  public async createFromTeam(teamId: string): Promise<Workspace> {
    // チーム情報を取得（BC-005連携）
    const team = await this.teamService.getTeam(teamId);

    // ワークスペース作成
    const workspace = Workspace.createForTeam(
      team.name,
      team.leaderId
    );

    // チームメンバーを追加
    for (const member of team.members) {
      workspace.addMember(member.userId, AccessPermission.EDITOR, team.leaderId);
    }

    // デフォルトチャネルを作成
    await this.createDefaultChannels(workspace);

    // 保存
    await this.workspaceRepository.save(workspace);

    return workspace;
  }

  /**
   * メンバーシップを同期
   */
  public async syncMembers(workspaceId: string): Promise<void> {
    const workspace = await this.workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new WorkspaceNotFoundError(workspaceId);
    }

    if (workspace.getType() === WorkspaceType.PROJECT) {
      await this.syncProjectMembers(workspace);
    } else if (workspace.getType() === WorkspaceType.TEAM) {
      await this.syncTeamMembers(workspace);
    }
  }

  /**
   * プロジェクトメンバーを同期
   */
  private async syncProjectMembers(workspace: Workspace): Promise<void> {
    // プロジェクトの最新メンバー情報を取得
    const project = await this.projectService.getProject(workspace.getId().toString());
    const projectMemberIds = project.members.map(m => m.userId);

    const currentMembers = workspace.getMembers();
    const currentMemberIds = currentMembers.map(m => m.userId);

    // 追加されたメンバー
    const addedMembers = projectMemberIds.filter(id => !currentMemberIds.includes(id));
    for (const memberId of addedMembers) {
      const projectMember = project.members.find(m => m.userId === memberId)!;
      const permission = this.mapProjectRoleToPermission(projectMember.role);
      workspace.addMember(memberId, permission, workspace.getOwnerId());
    }

    // 削除されたメンバー（オーナーは除く）
    const removedMembers = currentMemberIds.filter(
      id => !projectMemberIds.includes(id) && id !== workspace.getOwnerId()
    );
    for (const memberId of removedMembers) {
      workspace.removeMember(memberId, workspace.getOwnerId());
    }

    await this.workspaceRepository.save(workspace);
  }

  /**
   * チームメンバーを同期
   */
  private async syncTeamMembers(workspace: Workspace): Promise<void> {
    // チームの最新メンバー情報を取得
    const team = await this.teamService.getTeam(workspace.getId().toString());
    const teamMemberIds = team.members.map(m => m.userId);

    const currentMembers = workspace.getMembers();
    const currentMemberIds = currentMembers.map(m => m.userId);

    // 追加されたメンバー
    const addedMembers = teamMemberIds.filter(id => !currentMemberIds.includes(id));
    for (const memberId of addedMembers) {
      workspace.addMember(memberId, AccessPermission.EDITOR, workspace.getOwnerId());
    }

    // 削除されたメンバー
    const removedMembers = currentMemberIds.filter(
      id => !teamMemberIds.includes(id) && id !== workspace.getOwnerId()
    );
    for (const memberId of removedMembers) {
      workspace.removeMember(memberId, workspace.getOwnerId());
    }

    await this.workspaceRepository.save(workspace);
  }

  /**
   * デフォルトチャネルを作成
   */
  private async createDefaultChannels(workspace: Workspace): Promise<void> {
    const defaultChannels = [
      { name: 'general', description: 'General discussion' },
      { name: 'announcements', description: 'Team announcements' },
      { name: 'random', description: 'Random chat' }
    ];

    for (const channelInfo of defaultChannels) {
      const channel = Channel.createPublicChannel(
        workspace.getId().toString(),
        channelInfo.name,
        channelInfo.description,
        workspace.getOwnerId()
      );

      await this.channelRepository.save(channel);
    }
  }

  /**
   * プロジェクトロールを権限にマッピング
   */
  private mapProjectRoleToPermission(projectRole: string): AccessPermission {
    switch (projectRole) {
      case 'manager':
        return AccessPermission.ADMIN;
      case 'lead':
        return AccessPermission.EDITOR;
      case 'member':
        return AccessPermission.EDITOR;
      case 'observer':
        return AccessPermission.VIEWER;
      default:
        return AccessPermission.VIEWER;
    }
  }
}
```

---

## Activity Feed Service {#activity-feed}

### 責務

ユーザーやワークスペースのアクティビティフィードを生成・集約します。

### TypeScript実装

```typescript
/**
 * ActivityFeedService - アクティビティフィードサービス
 */
export class ActivityFeedService {
  constructor(
    private activityRepository: ActivityRepository,
    private workspaceRepository: WorkspaceRepository,
    private messageRepository: MessageRepository,
    private meetingRepository: MeetingRepository
  ) {}

  /**
   * ユーザーのアクティビティフィードを生成
   */
  public async generateUserFeed(
    userId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    // ユーザーが参加しているワークスペースを取得
    const workspaces = await this.workspaceRepository.findByMember(userId);
    const workspaceIds = workspaces.map(w => w.getId().toString());

    // アクティビティを取得
    const activities = await this.activityRepository.findByWorkspaces(
      workspaceIds,
      limit
    );

    // フィルタリング・ソート
    return this.filterAndSortActivities(activities, userId);
  }

  /**
   * ワークスペースのアクティビティフィードを生成
   */
  public async generateWorkspaceFeed(
    workspaceId: string,
    limit: number = 100
  ): Promise<Activity[]> {
    const activities = await this.activityRepository.findByWorkspace(
      workspaceId,
      limit
    );

    return activities.sort((a, b) =>
      b.occurredAt.getTime() - a.occurredAt.getTime()
    );
  }

  /**
   * アクティビティを記録
   */
  public async recordActivity(
    workspaceId: string,
    actorId: string,
    type: ActivityType,
    entityType: string,
    entityId: string,
    metadata: Record<string, any> = {}
  ): Promise<Activity> {
    const activity = new Activity(
      crypto.randomUUID(),
      workspaceId,
      actorId,
      type,
      entityType,
      entityId,
      metadata,
      new Date()
    );

    await this.activityRepository.save(activity);

    return activity;
  }

  /**
   * アクティビティを集約
   */
  public async aggregateActivities(
    activities: Activity[],
    windowMinutes: number = 60
  ): Promise<AggregatedActivity[]> {
    const aggregated: AggregatedActivity[] = [];
    const groups = new Map<string, Activity[]>();

    // 同じ種類のアクティビティをグループ化
    for (const activity of activities) {
      const key = this.getAggregationKey(activity);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(activity);
    }

    // 時間窓内のアクティビティを集約
    for (const [key, group] of groups.entries()) {
      if (group.length === 1) {
        // 単一アクティビティ
        aggregated.push({
          type: 'single',
          activities: [group[0]],
          summary: this.generateActivitySummary(group[0])
        });
      } else {
        // 複数アクティビティを集約
        const timeWindows = this.groupByTimeWindow(group, windowMinutes);
        for (const window of timeWindows) {
          aggregated.push({
            type: 'aggregated',
            activities: window,
            summary: this.generateAggregatedSummary(window)
          });
        }
      }
    }

    return aggregated.sort((a, b) =>
      b.activities[0].occurredAt.getTime() - a.activities[0].occurredAt.getTime()
    );
  }

  // ========================================
  // Helper Methods
  // ========================================

  /**
   * アクティビティをフィルタリング・ソート
   */
  private filterAndSortActivities(activities: Activity[], userId: string): Activity[] {
    // 自分自身のアクティビティは除外（オプション）
    // const filtered = activities.filter(a => a.actorId !== userId);

    // 新しい順にソート
    return activities.sort((a, b) =>
      b.occurredAt.getTime() - a.occurredAt.getTime()
    );
  }

  /**
   * 集約キーを生成
   */
  private getAggregationKey(activity: Activity): string {
    return `${activity.type}-${activity.entityType}`;
  }

  /**
   * 時間窓でグループ化
   */
  private groupByTimeWindow(activities: Activity[], windowMinutes: number): Activity[][] {
    const windows: Activity[][] = [];
    let currentWindow: Activity[] = [];

    const sorted = [...activities].sort((a, b) =>
      a.occurredAt.getTime() - b.occurredAt.getTime()
    );

    for (const activity of sorted) {
      if (currentWindow.length === 0) {
        currentWindow.push(activity);
      } else {
        const timeDiff = activity.occurredAt.getTime() -
          currentWindow[currentWindow.length - 1].occurredAt.getTime();
        const windowMs = windowMinutes * 60 * 1000;

        if (timeDiff <= windowMs) {
          currentWindow.push(activity);
        } else {
          windows.push(currentWindow);
          currentWindow = [activity];
        }
      }
    }

    if (currentWindow.length > 0) {
      windows.push(currentWindow);
    }

    return windows;
  }

  /**
   * アクティビティサマリーを生成
   */
  private generateActivitySummary(activity: Activity): string {
    switch (activity.type) {
      case ActivityType.MESSAGE_SENT:
        return `sent a message`;
      case ActivityType.DOCUMENT_SHARED:
        return `shared a document: ${activity.metadata.title}`;
      case ActivityType.MEETING_SCHEDULED:
        return `scheduled a meeting: ${activity.metadata.title}`;
      case ActivityType.MEMBER_JOINED:
        return `joined the workspace`;
      default:
        return `performed an action`;
    }
  }

  /**
   * 集約サマリーを生成
   */
  private generateAggregatedSummary(activities: Activity[]): string {
    const count = activities.length;
    const type = activities[0].type;

    switch (type) {
      case ActivityType.MESSAGE_SENT:
        return `sent ${count} messages`;
      case ActivityType.DOCUMENT_SHARED:
        return `shared ${count} documents`;
      case ActivityType.MEETING_SCHEDULED:
        return `scheduled ${count} meetings`;
      default:
        return `performed ${count} actions`;
    }
  }
}

/**
 * Activity - アクティビティエンティティ
 */
export class Activity {
  constructor(
    public readonly id: string,
    public readonly workspaceId: string,
    public readonly actorId: string,
    public readonly type: ActivityType,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly metadata: Record<string, any>,
    public readonly occurredAt: Date
  ) {}
}

/**
 * ActivityType - アクティビティ種別
 */
export enum ActivityType {
  MESSAGE_SENT = 'message_sent',
  DOCUMENT_SHARED = 'document_shared',
  DOCUMENT_UPDATED = 'document_updated',
  MEETING_SCHEDULED = 'meeting_scheduled',
  MEETING_STARTED = 'meeting_started',
  MEMBER_JOINED = 'member_joined',
  MEMBER_LEFT = 'member_left',
  CHANNEL_CREATED = 'channel_created'
}

/**
 * AggregatedActivity - 集約アクティビティ
 */
export interface AggregatedActivity {
  type: 'single' | 'aggregated';
  activities: Activity[];
  summary: string;
}
```

---

## Search & Discovery Service {#search-discovery}

### 責務

メッセージ、ドキュメント、会議を横断的に検索します。

### TypeScript実装

```typescript
/**
 * SearchService - 検索サービス
 */
export class SearchService {
  constructor(
    private searchEngine: SearchEngine, // Elasticsearch
    private messageRepository: MessageRepository,
    private documentRepository: DocumentRepository,
    private meetingRepository: MeetingRepository
  ) {}

  /**
   * 統合検索
   */
  public async searchAll(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResults> {
    const [messages, documents, meetings] = await Promise.all([
      this.searchMessages(query, userId, options),
      this.searchDocuments(query, userId, options),
      this.searchMeetings(query, userId, options)
    ]);

    return {
      messages,
      documents,
      meetings,
      totalResults: messages.length + documents.length + meetings.length
    };
  }

  /**
   * メッセージ検索
   */
  public async searchMessages(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const results = await this.searchEngine.search({
      index: 'messages',
      query: {
        bool: {
          must: [
            { match: { content: query } }
          ],
          filter: [
            // ユーザーがアクセス可能なチャネルのメッセージのみ
            { terms: { channelId: await this.getUserChannelIds(userId) } }
          ]
        }
      },
      size: options.limit || 20,
      from: options.offset || 0
    });

    return results.hits.map(hit => ({
      type: 'message',
      id: hit._id,
      title: this.extractMessageTitle(hit._source),
      snippet: this.highlightSnippet(hit._source.content, query),
      score: hit._score,
      metadata: hit._source
    }));
  }

  /**
   * ドキュメント検索
   */
  public async searchDocuments(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const results = await this.searchEngine.search({
      index: 'documents',
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^2', 'content']
              }
            }
          ],
          filter: [
            // ユーザーがアクセス可能なワークスペースのドキュメントのみ
            { terms: { workspaceId: await this.getUserWorkspaceIds(userId) } }
          ]
        }
      },
      size: options.limit || 20,
      from: options.offset || 0
    });

    return results.hits.map(hit => ({
      type: 'document',
      id: hit._id,
      title: hit._source.title,
      snippet: this.highlightSnippet(hit._source.content, query),
      score: hit._score,
      metadata: hit._source
    }));
  }

  /**
   * 会議検索
   */
  public async searchMeetings(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    const results = await this.searchEngine.search({
      index: 'meetings',
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^2', 'description', 'minutes.content']
              }
            }
          ],
          filter: [
            // ユーザーが参加者の会議のみ
            { term: { 'participants.userId': userId } }
          ]
        }
      },
      size: options.limit || 20,
      from: options.offset || 0
    });

    return results.hits.map(hit => ({
      type: 'meeting',
      id: hit._id,
      title: hit._source.title,
      snippet: this.highlightSnippet(hit._source.description, query),
      score: hit._score,
      metadata: hit._source
    }));
  }

  // ========================================
  // Helper Methods
  // ========================================

  private async getUserChannelIds(userId: string): Promise<string[]> {
    // Implementation omitted
    return [];
  }

  private async getUserWorkspaceIds(userId: string): Promise<string[]> {
    // Implementation omitted
    return [];
  }

  private extractMessageTitle(source: any): string {
    return source.content.substring(0, 50) + '...';
  }

  private highlightSnippet(text: string, query: string): string {
    // Simple highlighting implementation
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

/**
 * SearchOptions - 検索オプション
 */
export interface SearchOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * SearchResults - 検索結果
 */
export interface SearchResults {
  messages: SearchResult[];
  documents: SearchResult[];
  meetings: SearchResult[];
  totalResults: number;
}

/**
 * SearchResult - 検索結果項目
 */
export interface SearchResult {
  type: 'message' | 'document' | 'meeting';
  id: string;
  title: string;
  snippet: string;
  score: number;
  metadata: any;
}
```

---

## Implementation Examples {#implementation-examples}

### 使用例1: メッセージ送信フロー

```typescript
// Application Service
export class MessagingApplicationService {
  constructor(
    private messageRepository: MessageRepository,
    private routingService: MessageRoutingService,
    private eventBus: EventBus
  ) {}

  async sendMessage(
    senderId: string,
    channelId: string,
    text: string
  ): Promise<void> {
    // メッセージ作成
    const content = new MessageContent(text);
    const message = Message.createChannelMessage(senderId, channelId, content);

    // 保存
    await this.messageRepository.save(message);

    // ドメインイベント発行
    for (const event of message.getDomainEvents()) {
      await this.eventBus.publish(event);
    }

    message.clearDomainEvents();

    // ルーティング（リアルタイム配信・通知）
    await this.routingService.routeMessage(message);

    // メンション通知
    if (content.getMentions().length > 0) {
      await this.routingService.notifyMentions(message);
    }
  }
}
```

### 使用例2: 会議の最適スケジューリング

```typescript
async scheduleTeamMeeting(
  teamId: string,
  title: string,
  durationMinutes: number
): Promise<Meeting> {
  // チームメンバーを取得
  const team = await this.teamService.getTeam(teamId);
  const memberIds = team.members.map(m => m.userId);

  // 次の2週間で検索
  const today = new Date();
  const preferredDates: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    preferredDates.push(date);
  }

  // 最適スケジュール
  const meeting = await this.schedulingService.scheduleOptimal(
    title,
    memberIds,
    durationMinutes,
    preferredDates,
    {
      requiresRoom: true,
      timezone: 'Asia/Tokyo'
    }
  );

  return meeting;
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 ドメインサービス詳細化
