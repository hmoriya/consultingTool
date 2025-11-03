# BC-007: メッセージング詳細 [Messaging Details]

**BC**: Team Communication & Collaboration [チームコミュニケーションとコラボレーション] [BC_007]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**Context**: Messaging Context [メッセージングコンテキスト]

---

## 目次

1. [概要](#overview)
2. [Message Aggregate](#message-aggregate)
3. [Channel Management](#channel-management)
4. [Thread Management](#thread-management)
5. [Read Receipt & Reaction](#read-reaction)
6. [Attachment Management](#attachment-management)
7. [Direct Messaging](#direct-messaging)
8. [Business Rules](#business-rules)
9. [Domain Events](#domain-events)
10. [Implementation Examples](#implementation-examples)

---

## 概要 {#overview}

Messaging Contextは、BC-007のコアコンテキストであり、チーム内のリアルタイムメッセージングを実現します。

### 責務

- **メッセージ送受信**: リアルタイムメッセージ配信
- **チャネル管理**: パブリック/プライベートチャネル
- **ダイレクトメッセージ**: 1対1/グループDM
- **スレッド機能**: 会話の整理
- **既読管理**: 既読・未読追跡
- **リアクション**: メッセージへの絵文字リアクション
- **添付ファイル**: ファイル共有機能

### アーキテクチャパターン

```
┌─────────────────────────────────────────────┐
│         Messaging Context                   │
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │   Message    │──┬──→│   Channel    │   │
│  │  Aggregate   │  │   │              │   │
│  └──────────────┘  │   └──────────────┘   │
│         │          │                       │
│         │          │   ┌──────────────┐   │
│         │          └──→│    Thread    │   │
│         │              │              │   │
│         ↓              └──────────────┘   │
│  ┌──────────────┐                         │
│  │ Read Receipt │                         │
│  │  & Reaction  │                         │
│  └──────────────┘                         │
│         ↓                                  │
│  ┌──────────────┐                         │
│  │  Attachment  │                         │
│  └──────────────┘                         │
└─────────────────────────────────────────────┘
```

---

## Message Aggregate {#message-aggregate}

### 概念モデル

Message Aggregateは、メッセージング機能の中心的な集約です。

**集約ルート**: Message [メッセージ] [MESSAGE]

**エンティティ**:
- Message - メッセージ本体
- Thread - スレッド（親メッセージへの返信群）
- Reaction - リアクション

**値オブジェクト**:
- MessageId - メッセージID
- MessageContent - メッセージ内容
- MessageType - メッセージ種別
- SenderId - 送信者ID
- RecipientInfo - 受信者情報
- Mention - メンション情報
- MessageMetadata - メタデータ

### TypeScript実装

```typescript
// ========================================
// Value Objects
// ========================================

/**
 * MessageId - メッセージID
 */
export class MessageId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !this.isValidUUID(value)) {
      throw new InvalidMessageIdError(value);
    }
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: MessageId): boolean {
    return this.value === other.value;
  }

  private isValidUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  public static generate(): MessageId {
    return new MessageId(crypto.randomUUID());
  }
}

/**
 * MessageContent - メッセージ内容
 */
export class MessageContent {
  private readonly text: string;
  private readonly mentions: Mention[];
  private readonly formatting: MessageFormatting;

  constructor(text: string, mentions: Mention[] = [], formatting?: MessageFormatting) {
    if (!text || text.trim().length === 0) {
      throw new EmptyMessageContentError();
    }
    if (text.length > 10000) {
      throw new MessageTooLongError(text.length);
    }

    this.text = text;
    this.mentions = mentions;
    this.formatting = formatting || MessageFormatting.plain();
  }

  public getText(): string {
    return this.text;
  }

  public getMentions(): Mention[] {
    return [...this.mentions];
  }

  public hasMention(userId: string): boolean {
    return this.mentions.some(m => m.userId === userId);
  }

  public getPlainText(): string {
    // Remove markdown/formatting for search indexing
    return this.text.replace(/[*_~`#]/g, '');
  }
}

/**
 * Mention - メンション情報
 */
export class Mention {
  public readonly userId: string;
  public readonly displayName: string;
  public readonly position: number;

  constructor(userId: string, displayName: string, position: number) {
    this.userId = userId;
    this.displayName = displayName;
    this.position = position;
  }

  public static extractFromText(text: string, userResolver: (mention: string) => User | null): Mention[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: Mention[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const username = match[1];
      const user = userResolver(username);
      if (user) {
        mentions.push(new Mention(user.id, user.displayName, match.index));
      }
    }

    return mentions;
  }
}

/**
 * MessageType - メッセージ種別
 */
export enum MessageType {
  TEXT = 'text',                    // テキストメッセージ
  FILE = 'file',                    // ファイル添付
  IMAGE = 'image',                  // 画像
  SYSTEM = 'system',                // システムメッセージ
  CODE_SNIPPET = 'code_snippet',    // コードスニペット
  POLL = 'poll',                    // 投票
  MEETING_INVITE = 'meeting_invite' // 会議招待
}

/**
 * RecipientInfo - 受信者情報
 */
export class RecipientInfo {
  public readonly type: 'channel' | 'direct' | 'group';
  public readonly channelId?: string;
  public readonly recipientIds?: string[];

  private constructor(
    type: 'channel' | 'direct' | 'group',
    channelId?: string,
    recipientIds?: string[]
  ) {
    this.type = type;
    this.channelId = channelId;
    this.recipientIds = recipientIds;
  }

  public static forChannel(channelId: string): RecipientInfo {
    return new RecipientInfo('channel', channelId);
  }

  public static forDirectMessage(recipientId: string): RecipientInfo {
    return new RecipientInfo('direct', undefined, [recipientId]);
  }

  public static forGroupMessage(recipientIds: string[]): RecipientInfo {
    if (recipientIds.length < 2) {
      throw new InvalidGroupMessageRecipientsError(recipientIds.length);
    }
    return new RecipientInfo('group', undefined, recipientIds);
  }

  public isChannel(): boolean {
    return this.type === 'channel';
  }

  public isDirect(): boolean {
    return this.type === 'direct';
  }

  public isGroup(): boolean {
    return this.type === 'group';
  }
}

// ========================================
// Entities
// ========================================

/**
 * Message - メッセージエンティティ（集約ルート）
 */
export class Message {
  private id: MessageId;
  private senderId: string;
  private recipientInfo: RecipientInfo;
  private content: MessageContent;
  private type: MessageType;
  private threadId: MessageId | null; // このメッセージがスレッドの場合、親メッセージID
  private parentMessageId: MessageId | null; // このメッセージがスレッド内の場合、親メッセージID
  private attachments: Attachment[];
  private reactions: Reaction[];
  private readReceipts: ReadReceipt[];
  private metadata: MessageMetadata;
  private createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;
  private editHistory: MessageEdit[];
  private isPinned: boolean;
  private pinnedAt: Date | null;
  private pinnedBy: string | null;

  // Domain Events
  private domainEvents: DomainEvent[] = [];

  constructor(
    id: MessageId,
    senderId: string,
    recipientInfo: RecipientInfo,
    content: MessageContent,
    type: MessageType = MessageType.TEXT
  ) {
    this.id = id;
    this.senderId = senderId;
    this.recipientInfo = recipientInfo;
    this.content = content;
    this.type = type;
    this.threadId = null;
    this.parentMessageId = null;
    this.attachments = [];
    this.reactions = [];
    this.readReceipts = [];
    this.metadata = MessageMetadata.create();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
    this.editHistory = [];
    this.isPinned = false;
    this.pinnedAt = null;
    this.pinnedBy = null;
  }

  // ========================================
  // Factory Methods
  // ========================================

  /**
   * チャネルメッセージを作成
   */
  public static createChannelMessage(
    senderId: string,
    channelId: string,
    content: MessageContent
  ): Message {
    const message = new Message(
      MessageId.generate(),
      senderId,
      RecipientInfo.forChannel(channelId),
      content
    );

    message.addDomainEvent(new MessageSentEvent(
      message.id.toString(),
      senderId,
      channelId,
      'channel',
      message.createdAt
    ));

    return message;
  }

  /**
   * ダイレクトメッセージを作成
   */
  public static createDirectMessage(
    senderId: string,
    recipientId: string,
    content: MessageContent
  ): Message {
    const message = new Message(
      MessageId.generate(),
      senderId,
      RecipientInfo.forDirectMessage(recipientId),
      content
    );

    message.addDomainEvent(new DirectMessageSentEvent(
      message.id.toString(),
      senderId,
      recipientId,
      message.createdAt
    ));

    return message;
  }

  /**
   * スレッド返信を作成
   */
  public static createThreadReply(
    senderId: string,
    parentMessage: Message,
    content: MessageContent
  ): Message {
    if (parentMessage.isDeleted()) {
      throw new CannotReplyToDeletedMessageError(parentMessage.id.toString());
    }

    const message = new Message(
      MessageId.generate(),
      senderId,
      parentMessage.recipientInfo,
      content
    );

    message.parentMessageId = parentMessage.id;
    message.threadId = parentMessage.threadId || parentMessage.id;

    message.addDomainEvent(new ThreadReplySentEvent(
      message.id.toString(),
      senderId,
      parentMessage.id.toString(),
      message.threadId.toString(),
      message.createdAt
    ));

    return message;
  }

  // ========================================
  // Business Logic - Message Operations
  // ========================================

  /**
   * メッセージを編集
   */
  public edit(editorId: string, newContent: MessageContent): void {
    // BR-MSG-001: メッセージは送信者のみ編集可能
    if (this.senderId !== editorId) {
      throw new UnauthorizedMessageEditError(this.id.toString(), editorId);
    }

    // BR-MSG-002: 削除済みメッセージは編集不可
    if (this.isDeleted()) {
      throw new CannotEditDeletedMessageError(this.id.toString());
    }

    // BR-MSG-003: 送信後24時間以内のみ編集可能
    const hoursSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      throw new MessageEditTimeExpiredError(this.id.toString(), hoursSinceCreation);
    }

    // 編集履歴を保存
    const edit = new MessageEdit(
      this.content,
      newContent,
      editorId,
      new Date()
    );
    this.editHistory.push(edit);

    this.content = newContent;
    this.updatedAt = new Date();

    this.addDomainEvent(new MessageEditedEvent(
      this.id.toString(),
      editorId,
      this.updatedAt
    ));
  }

  /**
   * メッセージを削除
   */
  public delete(deleterId: string, isAdmin: boolean = false): void {
    // BR-MSG-004: メッセージは送信者または管理者が削除可能
    if (this.senderId !== deleterId && !isAdmin) {
      throw new UnauthorizedMessageDeleteError(this.id.toString(), deleterId);
    }

    // BR-MSG-005: 既に削除済みの場合はエラー
    if (this.isDeleted()) {
      throw new MessageAlreadyDeletedError(this.id.toString());
    }

    this.deletedAt = new Date();

    this.addDomainEvent(new MessageDeletedEvent(
      this.id.toString(),
      deleterId,
      isAdmin,
      this.deletedAt
    ));
  }

  /**
   * 添付ファイルを追加
   */
  public addAttachment(attachment: Attachment): void {
    // BR-MSG-006: 削除済みメッセージには添付ファイル追加不可
    if (this.isDeleted()) {
      throw new CannotAddAttachmentToDeletedMessageError(this.id.toString());
    }

    // BR-MSG-007: 添付ファイルは最大10個まで
    if (this.attachments.length >= 10) {
      throw new AttachmentLimitExceededError(this.id.toString(), this.attachments.length);
    }

    this.attachments.push(attachment);
    this.updatedAt = new Date();

    this.addDomainEvent(new AttachmentAddedEvent(
      this.id.toString(),
      attachment.id,
      attachment.fileName,
      attachment.fileSize
    ));
  }

  // ========================================
  // Business Logic - Reactions
  // ========================================

  /**
   * リアクションを追加
   */
  public addReaction(userId: string, emoji: string): void {
    // BR-MSG-008: 削除済みメッセージにはリアクション不可
    if (this.isDeleted()) {
      throw new CannotReactToDeletedMessageError(this.id.toString());
    }

    // BR-MSG-009: 同じユーザーが同じ絵文字で複数回リアクション不可
    const existingReaction = this.reactions.find(
      r => r.userId === userId && r.emoji === emoji
    );
    if (existingReaction) {
      throw new DuplicateReactionError(this.id.toString(), userId, emoji);
    }

    const reaction = new Reaction(userId, emoji, new Date());
    this.reactions.push(reaction);

    this.addDomainEvent(new ReactionAddedEvent(
      this.id.toString(),
      userId,
      emoji,
      reaction.createdAt
    ));
  }

  /**
   * リアクションを削除
   */
  public removeReaction(userId: string, emoji: string): void {
    const reactionIndex = this.reactions.findIndex(
      r => r.userId === userId && r.emoji === emoji
    );

    if (reactionIndex === -1) {
      throw new ReactionNotFoundError(this.id.toString(), userId, emoji);
    }

    this.reactions.splice(reactionIndex, 1);

    this.addDomainEvent(new ReactionRemovedEvent(
      this.id.toString(),
      userId,
      emoji
    ));
  }

  /**
   * リアクション集計を取得
   */
  public getReactionSummary(): Map<string, number> {
    const summary = new Map<string, number>();
    for (const reaction of this.reactions) {
      const count = summary.get(reaction.emoji) || 0;
      summary.set(reaction.emoji, count + 1);
    }
    return summary;
  }

  // ========================================
  // Business Logic - Read Receipts
  // ========================================

  /**
   * 既読を記録
   */
  public markAsRead(userId: string): void {
    // BR-MSG-010: 送信者は既読記録不要
    if (this.senderId === userId) {
      return;
    }

    // BR-MSG-011: 既に既読の場合は更新のみ
    const existingReceipt = this.readReceipts.find(r => r.userId === userId);
    if (existingReceipt) {
      existingReceipt.updateReadAt(new Date());
      return;
    }

    const receipt = new ReadReceipt(userId, new Date());
    this.readReceipts.push(receipt);

    this.addDomainEvent(new MessageReadEvent(
      this.id.toString(),
      userId,
      receipt.readAt
    ));
  }

  /**
   * 未読ユーザー数を取得
   */
  public getUnreadCount(totalRecipients: number): number {
    // 送信者は除外
    return totalRecipients - this.readReceipts.length - 1;
  }

  /**
   * 特定ユーザーが既読済みか確認
   */
  public isReadBy(userId: string): boolean {
    return this.readReceipts.some(r => r.userId === userId);
  }

  // ========================================
  // Business Logic - Pin
  // ========================================

  /**
   * メッセージをピン留め
   */
  public pin(userId: string): void {
    // BR-MSG-012: 削除済みメッセージはピン留め不可
    if (this.isDeleted()) {
      throw new CannotPinDeletedMessageError(this.id.toString());
    }

    // BR-MSG-013: 既にピン留め済みの場合はエラー
    if (this.isPinned) {
      throw new MessageAlreadyPinnedError(this.id.toString());
    }

    this.isPinned = true;
    this.pinnedAt = new Date();
    this.pinnedBy = userId;

    this.addDomainEvent(new MessagePinnedEvent(
      this.id.toString(),
      userId,
      this.pinnedAt
    ));
  }

  /**
   * ピン留めを解除
   */
  public unpin(userId: string): void {
    if (!this.isPinned) {
      throw new MessageNotPinnedError(this.id.toString());
    }

    this.isPinned = false;
    this.pinnedAt = null;
    this.pinnedBy = null;

    this.addDomainEvent(new MessageUnpinnedEvent(
      this.id.toString(),
      userId
    ));
  }

  // ========================================
  // Query Methods
  // ========================================

  public getId(): MessageId {
    return this.id;
  }

  public getSenderId(): string {
    return this.senderId;
  }

  public getContent(): MessageContent {
    return this.content;
  }

  public getType(): MessageType {
    return this.type;
  }

  public getRecipientInfo(): RecipientInfo {
    return this.recipientInfo;
  }

  public getAttachments(): Attachment[] {
    return [...this.attachments];
  }

  public getReactions(): Reaction[] {
    return [...this.reactions];
  }

  public getReadReceipts(): ReadReceipt[] {
    return [...this.readReceipts];
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  public isThreadReply(): boolean {
    return this.parentMessageId !== null;
  }

  public getThreadId(): MessageId | null {
    return this.threadId;
  }

  public getParentMessageId(): MessageId | null {
    return this.parentMessageId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public isEdited(): boolean {
    return this.editHistory.length > 0;
  }

  public getEditHistory(): MessageEdit[] {
    return [...this.editHistory];
  }

  public isPinnedMessage(): boolean {
    return this.isPinned;
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
 * Reaction - リアクションエンティティ
 */
export class Reaction {
  public readonly userId: string;
  public readonly emoji: string;
  public readonly createdAt: Date;

  constructor(userId: string, emoji: string, createdAt: Date) {
    this.userId = userId;
    this.emoji = emoji;
    this.createdAt = createdAt;
  }
}

/**
 * ReadReceipt - 既読情報エンティティ
 */
export class ReadReceipt {
  public readonly userId: string;
  public readAt: Date;

  constructor(userId: string, readAt: Date) {
    this.userId = userId;
    this.readAt = readAt;
  }

  public updateReadAt(newReadAt: Date): void {
    this.readAt = newReadAt;
  }
}

/**
 * MessageEdit - メッセージ編集履歴
 */
export class MessageEdit {
  public readonly oldContent: MessageContent;
  public readonly newContent: MessageContent;
  public readonly editedBy: string;
  public readonly editedAt: Date;

  constructor(
    oldContent: MessageContent,
    newContent: MessageContent,
    editedBy: string,
    editedAt: Date
  ) {
    this.oldContent = oldContent;
    this.newContent = newContent;
    this.editedBy = editedBy;
    this.editedAt = editedAt;
  }
}

/**
 * Attachment - 添付ファイル
 */
export class Attachment {
  public readonly id: string;
  public readonly fileName: string;
  public readonly fileSize: number;
  public readonly mimeType: string;
  public readonly url: string;
  public readonly thumbnailUrl?: string;
  public readonly uploadedAt: Date;

  constructor(
    id: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    url: string,
    thumbnailUrl?: string
  ) {
    this.id = id;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.mimeType = mimeType;
    this.url = url;
    this.thumbnailUrl = thumbnailUrl;
    this.uploadedAt = new Date();
  }

  public isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  public isVideo(): boolean {
    return this.mimeType.startsWith('video/');
  }

  public isDocument(): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return documentTypes.includes(this.mimeType);
  }
}

/**
 * MessageMetadata - メッセージメタデータ
 */
export class MessageMetadata {
  public readonly version: number;
  public readonly clientId: string;
  public readonly deviceType: string;

  private constructor(version: number, clientId: string, deviceType: string) {
    this.version = version;
    this.clientId = clientId;
    this.deviceType = deviceType;
  }

  public static create(): MessageMetadata {
    return new MessageMetadata(1, 'web', 'browser');
  }
}

/**
 * MessageFormatting - メッセージフォーマット
 */
export class MessageFormatting {
  public readonly hasMarkdown: boolean;
  public readonly hasCodeBlock: boolean;
  public readonly hasLinks: boolean;

  private constructor(hasMarkdown: boolean, hasCodeBlock: boolean, hasLinks: boolean) {
    this.hasMarkdown = hasMarkdown;
    this.hasCodeBlock = hasCodeBlock;
    this.hasLinks = hasLinks;
  }

  public static plain(): MessageFormatting {
    return new MessageFormatting(false, false, false);
  }

  public static markdown(): MessageFormatting {
    return new MessageFormatting(true, false, false);
  }

  public static detectFromText(text: string): MessageFormatting {
    const hasMarkdown = /[*_~`#]/.test(text);
    const hasCodeBlock = /```/.test(text);
    const hasLinks = /https?:\/\//.test(text);
    return new MessageFormatting(hasMarkdown, hasCodeBlock, hasLinks);
  }
}
```

---

## Channel Management {#channel-management}

### Channel Entity

```typescript
/**
 * Channel - チャネルエンティティ
 */
export class Channel {
  private id: string;
  private workspaceId: string;
  private name: string;
  private description: string;
  private type: ChannelType; // public | private
  private createdBy: string;
  private members: ChannelMember[];
  private createdAt: Date;
  private archivedAt: Date | null;
  private topic: string | null;
  private pinnedMessages: string[]; // Message IDs

  private domainEvents: DomainEvent[] = [];

  constructor(
    id: string,
    workspaceId: string,
    name: string,
    description: string,
    type: ChannelType,
    createdBy: string
  ) {
    this.id = id;
    this.workspaceId = workspaceId;
    this.name = this.validateName(name);
    this.description = description;
    this.type = type;
    this.createdBy = createdBy;
    this.members = [new ChannelMember(createdBy, 'owner', new Date())];
    this.createdAt = new Date();
    this.archivedAt = null;
    this.topic = null;
    this.pinnedMessages = [];
  }

  // ========================================
  // Factory Methods
  // ========================================

  public static createPublicChannel(
    workspaceId: string,
    name: string,
    description: string,
    createdBy: string
  ): Channel {
    const channel = new Channel(
      crypto.randomUUID(),
      workspaceId,
      name,
      description,
      ChannelType.PUBLIC,
      createdBy
    );

    channel.addDomainEvent(new ChannelCreatedEvent(
      channel.id,
      workspaceId,
      name,
      ChannelType.PUBLIC,
      createdBy,
      channel.createdAt
    ));

    return channel;
  }

  public static createPrivateChannel(
    workspaceId: string,
    name: string,
    description: string,
    createdBy: string,
    initialMembers: string[]
  ): Channel {
    const channel = new Channel(
      crypto.randomUUID(),
      workspaceId,
      name,
      description,
      ChannelType.PRIVATE,
      createdBy
    );

    // Add initial members
    for (const memberId of initialMembers) {
      if (memberId !== createdBy) {
        channel.addMember(memberId, 'member', createdBy);
      }
    }

    channel.addDomainEvent(new ChannelCreatedEvent(
      channel.id,
      workspaceId,
      name,
      ChannelType.PRIVATE,
      createdBy,
      channel.createdAt
    ));

    return channel;
  }

  // ========================================
  // Business Logic - Member Management
  // ========================================

  /**
   * メンバーを追加
   */
  public addMember(userId: string, role: ChannelRole, addedBy: string): void {
    // BR-CH-001: アーカイブ済みチャネルにメンバー追加不可
    if (this.isArchived()) {
      throw new CannotAddMemberToArchivedChannelError(this.id);
    }

    // BR-CH-002: プライベートチャネルは既存メンバーのみ招待可能
    if (this.type === ChannelType.PRIVATE) {
      if (!this.isMember(addedBy)) {
        throw new UnauthorizedChannelMemberAddError(this.id, addedBy);
      }
    }

    // BR-CH-003: 既にメンバーの場合はエラー
    if (this.isMember(userId)) {
      throw new UserAlreadyChannelMemberError(this.id, userId);
    }

    const member = new ChannelMember(userId, role, new Date());
    this.members.push(member);

    this.addDomainEvent(new MemberAddedToChannelEvent(
      this.id,
      userId,
      role,
      addedBy,
      new Date()
    ));
  }

  /**
   * メンバーを削除
   */
  public removeMember(userId: string, removedBy: string): void {
    // BR-CH-004: チャネル作成者は削除不可
    if (userId === this.createdBy) {
      throw new CannotRemoveChannelOwnerError(this.id);
    }

    // BR-CH-005: オーナーまたは本人のみメンバー削除可能
    const removerMember = this.members.find(m => m.userId === removedBy);
    if (!removerMember || (removerMember.role !== 'owner' && removedBy !== userId)) {
      throw new UnauthorizedChannelMemberRemoveError(this.id, removedBy);
    }

    const memberIndex = this.members.findIndex(m => m.userId === userId);
    if (memberIndex === -1) {
      throw new UserNotChannelMemberError(this.id, userId);
    }

    this.members.splice(memberIndex, 1);

    this.addDomainEvent(new MemberRemovedFromChannelEvent(
      this.id,
      userId,
      removedBy,
      new Date()
    ));
  }

  /**
   * メンバーのロールを変更
   */
  public changeMemberRole(userId: string, newRole: ChannelRole, changedBy: string): void {
    // BR-CH-006: オーナーのみロール変更可能
    const changerMember = this.members.find(m => m.userId === changedBy);
    if (!changerMember || changerMember.role !== 'owner') {
      throw new UnauthorizedRoleChangeError(this.id, changedBy);
    }

    // BR-CH-007: チャネル作成者のロール変更不可
    if (userId === this.createdBy) {
      throw new CannotChangeOwnerRoleError(this.id);
    }

    const member = this.members.find(m => m.userId === userId);
    if (!member) {
      throw new UserNotChannelMemberError(this.id, userId);
    }

    const oldRole = member.role;
    member.changeRole(newRole);

    this.addDomainEvent(new MemberRoleChangedEvent(
      this.id,
      userId,
      oldRole,
      newRole,
      changedBy,
      new Date()
    ));
  }

  // ========================================
  // Business Logic - Channel Operations
  // ========================================

  /**
   * チャネルをアーカイブ
   */
  public archive(archivedBy: string): void {
    // BR-CH-008: オーナーのみアーカイブ可能
    const member = this.members.find(m => m.userId === archivedBy);
    if (!member || member.role !== 'owner') {
      throw new UnauthorizedChannelArchiveError(this.id, archivedBy);
    }

    // BR-CH-009: 既にアーカイブ済みの場合はエラー
    if (this.isArchived()) {
      throw new ChannelAlreadyArchivedError(this.id);
    }

    this.archivedAt = new Date();

    this.addDomainEvent(new ChannelArchivedEvent(
      this.id,
      archivedBy,
      this.archivedAt
    ));
  }

  /**
   * アーカイブを解除
   */
  public unarchive(unarchivedBy: string): void {
    // BR-CH-010: オーナーのみアーカイブ解除可能
    const member = this.members.find(m => m.userId === unarchivedBy);
    if (!member || member.role !== 'owner') {
      throw new UnauthorizedChannelUnarchiveError(this.id, unarchivedBy);
    }

    if (!this.isArchived()) {
      throw new ChannelNotArchivedError(this.id);
    }

    this.archivedAt = null;

    this.addDomainEvent(new ChannelUnarchivedEvent(
      this.id,
      unarchivedBy,
      new Date()
    ));
  }

  /**
   * トピックを設定
   */
  public setTopic(topic: string, setBy: string): void {
    // BR-CH-011: メンバーのみトピック設定可能
    if (!this.isMember(setBy)) {
      throw new UnauthorizedTopicSetError(this.id, setBy);
    }

    this.topic = topic;

    this.addDomainEvent(new ChannelTopicSetEvent(
      this.id,
      topic,
      setBy,
      new Date()
    ));
  }

  /**
   * メッセージをピン留め
   */
  public pinMessage(messageId: string, pinnedBy: string): void {
    // BR-CH-012: メンバーのみピン留め可能
    if (!this.isMember(pinnedBy)) {
      throw new UnauthorizedMessagePinError(this.id, pinnedBy);
    }

    // BR-CH-013: ピン留めは最大10件まで
    if (this.pinnedMessages.length >= 10) {
      throw new PinnedMessageLimitExceededError(this.id, this.pinnedMessages.length);
    }

    if (this.pinnedMessages.includes(messageId)) {
      throw new MessageAlreadyPinnedError(messageId);
    }

    this.pinnedMessages.push(messageId);

    this.addDomainEvent(new MessagePinnedToChannelEvent(
      this.id,
      messageId,
      pinnedBy,
      new Date()
    ));
  }

  /**
   * ピン留めを解除
   */
  public unpinMessage(messageId: string, unpinnedBy: string): void {
    if (!this.isMember(unpinnedBy)) {
      throw new UnauthorizedMessageUnpinError(this.id, unpinnedBy);
    }

    const index = this.pinnedMessages.indexOf(messageId);
    if (index === -1) {
      throw new MessageNotPinnedError(messageId);
    }

    this.pinnedMessages.splice(index, 1);

    this.addDomainEvent(new MessageUnpinnedFromChannelEvent(
      this.id,
      messageId,
      unpinnedBy,
      new Date()
    ));
  }

  // ========================================
  // Query Methods
  // ========================================

  public isMember(userId: string): boolean {
    return this.members.some(m => m.userId === userId);
  }

  public isArchived(): boolean {
    return this.archivedAt !== null;
  }

  public getMemberCount(): number {
    return this.members.length;
  }

  public getMembers(): ChannelMember[] {
    return [...this.members];
  }

  public getPinnedMessages(): string[] {
    return [...this.pinnedMessages];
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getType(): ChannelType {
    return this.type;
  }

  // ========================================
  // Validation
  // ========================================

  private validateName(name: string): string {
    // BR-CH-014: チャネル名は3-50文字
    if (name.length < 3 || name.length > 50) {
      throw new InvalidChannelNameLengthError(name.length);
    }

    // BR-CH-015: チャネル名は英数字、ハイフン、アンダースコアのみ
    if (!/^[a-z0-9-_]+$/.test(name)) {
      throw new InvalidChannelNameFormatError(name);
    }

    return name;
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
 * ChannelMember - チャネルメンバー
 */
export class ChannelMember {
  public readonly userId: string;
  public role: ChannelRole;
  public readonly joinedAt: Date;

  constructor(userId: string, role: ChannelRole, joinedAt: Date) {
    this.userId = userId;
    this.role = role;
    this.joinedAt = joinedAt;
  }

  public changeRole(newRole: ChannelRole): void {
    this.role = newRole;
  }
}

/**
 * ChannelType - チャネル種別
 */
export enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

/**
 * ChannelRole - チャネルロール
 */
export type ChannelRole = 'owner' | 'admin' | 'member';
```

---

## Thread Management {#thread-management}

### Thread Aggregation

スレッドは親メッセージに対する返信群として扱います。

```typescript
/**
 * ThreadService - スレッド管理サービス
 */
export class ThreadService {
  constructor(
    private messageRepository: MessageRepository
  ) {}

  /**
   * スレッドのすべての返信を取得
   */
  public async getThreadReplies(parentMessageId: string): Promise<Message[]> {
    return await this.messageRepository.findByThreadId(parentMessageId);
  }

  /**
   * スレッドの未読カウントを取得
   */
  public async getThreadUnreadCount(
    parentMessageId: string,
    userId: string,
    lastReadAt: Date
  ): Promise<number> {
    const replies = await this.getThreadReplies(parentMessageId);
    return replies.filter(m =>
      m.getCreatedAt() > lastReadAt &&
      m.getSenderId() !== userId
    ).length;
  }

  /**
   * スレッドの参加者を取得
   */
  public async getThreadParticipants(parentMessageId: string): Promise<string[]> {
    const replies = await this.getThreadReplies(parentMessageId);
    const parentMessage = await this.messageRepository.findById(parentMessageId);

    const participants = new Set<string>();
    participants.add(parentMessage.getSenderId());

    for (const reply of replies) {
      participants.add(reply.getSenderId());
    }

    return Array.from(participants);
  }
}
```

---

## Direct Messaging {#direct-messaging}

### DirectConversation Entity

```typescript
/**
 * DirectConversation - ダイレクト会話エンティティ
 */
export class DirectConversation {
  private id: string;
  private participant1Id: string;
  private participant2Id: string;
  private createdAt: Date;
  private lastMessageAt: Date | null;
  private participant1UnreadCount: number;
  private participant2UnreadCount: number;

  constructor(participant1Id: string, participant2Id: string) {
    this.id = this.generateConversationId(participant1Id, participant2Id);
    this.participant1Id = participant1Id;
    this.participant2Id = participant2Id;
    this.createdAt = new Date();
    this.lastMessageAt = null;
    this.participant1UnreadCount = 0;
    this.participant2UnreadCount = 0;
  }

  /**
   * 会話IDを生成（常に同じペアで同じIDになるよう）
   */
  private generateConversationId(user1Id: string, user2Id: string): string {
    const sorted = [user1Id, user2Id].sort();
    return `dm-${sorted[0]}-${sorted[1]}`;
  }

  /**
   * メッセージ送信時の更新
   */
  public onMessageSent(senderId: string): void {
    this.lastMessageAt = new Date();

    // 相手側の未読カウント増加
    if (senderId === this.participant1Id) {
      this.participant2UnreadCount++;
    } else {
      this.participant1UnreadCount++;
    }
  }

  /**
   * メッセージ既読時の更新
   */
  public markAsRead(userId: string): void {
    if (userId === this.participant1Id) {
      this.participant1UnreadCount = 0;
    } else if (userId === this.participant2Id) {
      this.participant2UnreadCount = 0;
    }
  }

  /**
   * 特定ユーザーの未読数を取得
   */
  public getUnreadCount(userId: string): number {
    if (userId === this.participant1Id) {
      return this.participant1UnreadCount;
    } else if (userId === this.participant2Id) {
      return this.participant2UnreadCount;
    }
    return 0;
  }

  public isParticipant(userId: string): boolean {
    return userId === this.participant1Id || userId === this.participant2Id;
  }

  public getOtherParticipant(userId: string): string {
    if (userId === this.participant1Id) {
      return this.participant2Id;
    } else if (userId === this.participant2Id) {
      return this.participant1Id;
    }
    throw new UserNotInConversationError(this.id, userId);
  }

  public getId(): string {
    return this.id;
  }
}
```

---

## Business Rules {#business-rules}

### メッセージ関連ビジネスルール

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-MSG-001 | メッセージは送信者のみ編集可能 | Message.edit() |
| BR-MSG-002 | 削除済みメッセージは編集不可 | Message.edit() |
| BR-MSG-003 | 送信後24時間以内のみ編集可能 | Message.edit() |
| BR-MSG-004 | メッセージは送信者または管理者が削除可能 | Message.delete() |
| BR-MSG-005 | 既に削除済みの場合はエラー | Message.delete() |
| BR-MSG-006 | 削除済みメッセージには添付ファイル追加不可 | Message.addAttachment() |
| BR-MSG-007 | 添付ファイルは最大10個まで | Message.addAttachment() |
| BR-MSG-008 | 削除済みメッセージにはリアクション不可 | Message.addReaction() |
| BR-MSG-009 | 同じユーザーが同じ絵文字で複数回リアクション不可 | Message.addReaction() |
| BR-MSG-010 | 送信者は既読記録不要 | Message.markAsRead() |
| BR-MSG-011 | 既に既読の場合は更新のみ | Message.markAsRead() |
| BR-MSG-012 | 削除済みメッセージはピン留め不可 | Message.pin() |
| BR-MSG-013 | 既にピン留め済みの場合はエラー | Message.pin() |

### チャネル関連ビジネスルール

| ルールID | ルール内容 | 実装箇所 |
|---------|----------|----------|
| BR-CH-001 | アーカイブ済みチャネルにメンバー追加不可 | Channel.addMember() |
| BR-CH-002 | プライベートチャネルは既存メンバーのみ招待可能 | Channel.addMember() |
| BR-CH-003 | 既にメンバーの場合はエラー | Channel.addMember() |
| BR-CH-004 | チャネル作成者は削除不可 | Channel.removeMember() |
| BR-CH-005 | オーナーまたは本人のみメンバー削除可能 | Channel.removeMember() |
| BR-CH-006 | オーナーのみロール変更可能 | Channel.changeMemberRole() |
| BR-CH-007 | チャネル作成者のロール変更不可 | Channel.changeMemberRole() |
| BR-CH-008 | オーナーのみアーカイブ可能 | Channel.archive() |
| BR-CH-009 | 既にアーカイブ済みの場合はエラー | Channel.archive() |
| BR-CH-010 | オーナーのみアーカイブ解除可能 | Channel.unarchive() |
| BR-CH-011 | メンバーのみトピック設定可能 | Channel.setTopic() |
| BR-CH-012 | メンバーのみピン留め可能 | Channel.pinMessage() |
| BR-CH-013 | ピン留めは最大10件まで | Channel.pinMessage() |
| BR-CH-014 | チャネル名は3-50文字 | Channel.validateName() |
| BR-CH-015 | チャネル名は英数字、ハイフン、アンダースコアのみ | Channel.validateName() |

---

## Domain Events {#domain-events}

### メッセージ関連イベント

```typescript
/**
 * MessageSentEvent - メッセージ送信イベント
 */
export class MessageSentEvent implements DomainEvent {
  public readonly eventType = 'MessageSent';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly senderId: string,
    public readonly channelId: string,
    public readonly messageType: 'channel' | 'direct' | 'group',
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * DirectMessageSentEvent - ダイレクトメッセージ送信イベント
 */
export class DirectMessageSentEvent implements DomainEvent {
  public readonly eventType = 'DirectMessageSent';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly senderId: string,
    public readonly recipientId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ThreadReplySentEvent - スレッド返信イベント
 */
export class ThreadReplySentEvent implements DomainEvent {
  public readonly eventType = 'ThreadReplySent';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly senderId: string,
    public readonly parentMessageId: string,
    public readonly threadId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MessageEditedEvent - メッセージ編集イベント
 */
export class MessageEditedEvent implements DomainEvent {
  public readonly eventType = 'MessageEdited';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly editedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MessageDeletedEvent - メッセージ削除イベント
 */
export class MessageDeletedEvent implements DomainEvent {
  public readonly eventType = 'MessageDeleted';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly deletedBy: string,
    public readonly isAdminDelete: boolean,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ReactionAddedEvent - リアクション追加イベント
 */
export class ReactionAddedEvent implements DomainEvent {
  public readonly eventType = 'ReactionAdded';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly userId: string,
    public readonly emoji: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MessageReadEvent - メッセージ既読イベント
 */
export class MessageReadEvent implements DomainEvent {
  public readonly eventType = 'MessageRead';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly userId: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MessagePinnedEvent - メッセージピン留めイベント
 */
export class MessagePinnedEvent implements DomainEvent {
  public readonly eventType = 'MessagePinned';
  public readonly occurredAt: Date;

  constructor(
    public readonly messageId: string,
    public readonly pinnedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}
```

### チャネル関連イベント

```typescript
/**
 * ChannelCreatedEvent - チャネル作成イベント
 */
export class ChannelCreatedEvent implements DomainEvent {
  public readonly eventType = 'ChannelCreated';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly workspaceId: string,
    public readonly name: string,
    public readonly type: ChannelType,
    public readonly createdBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * MemberAddedToChannelEvent - チャネルメンバー追加イベント
 */
export class MemberAddedToChannelEvent implements DomainEvent {
  public readonly eventType = 'MemberAddedToChannel';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly userId: string,
    public readonly role: ChannelRole,
    public readonly addedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}

/**
 * ChannelArchivedEvent - チャネルアーカイブイベント
 */
export class ChannelArchivedEvent implements DomainEvent {
  public readonly eventType = 'ChannelArchived';
  public readonly occurredAt: Date;

  constructor(
    public readonly channelId: string,
    public readonly archivedBy: string,
    occurredAt: Date
  ) {
    this.occurredAt = occurredAt;
  }
}
```

---

## Implementation Examples {#implementation-examples}

### 使用例1: チャネルメッセージ送信

```typescript
// Application Service
export class MessagingApplicationService {
  constructor(
    private messageRepository: MessageRepository,
    private channelRepository: ChannelRepository,
    private eventBus: EventBus
  ) {}

  async sendChannelMessage(
    senderId: string,
    channelId: string,
    text: string
  ): Promise<void> {
    // チャネル存在確認
    const channel = await this.channelRepository.findById(channelId);
    if (!channel) {
      throw new ChannelNotFoundError(channelId);
    }

    // メンバーシップ確認
    if (!channel.isMember(senderId)) {
      throw new UserNotChannelMemberError(channelId, senderId);
    }

    // メッセージ作成
    const content = new MessageContent(text);
    const message = Message.createChannelMessage(senderId, channelId, content);

    // 保存
    await this.messageRepository.save(message);

    // イベント発行
    for (const event of message.getDomainEvents()) {
      await this.eventBus.publish(event);
    }

    message.clearDomainEvents();
  }
}
```

### 使用例2: スレッド返信

```typescript
async replyToThread(
  senderId: string,
  parentMessageId: string,
  text: string
): Promise<void> {
  // 親メッセージ取得
  const parentMessage = await this.messageRepository.findById(parentMessageId);
  if (!parentMessage) {
    throw new MessageNotFoundError(parentMessageId);
  }

  // スレッド返信作成
  const content = new MessageContent(text);
  const reply = Message.createThreadReply(senderId, parentMessage, content);

  // 保存
  await this.messageRepository.save(reply);

  // イベント発行
  for (const event of reply.getDomainEvents()) {
    await this.eventBus.publish(event);
  }

  reply.clearDomainEvents();
}
```

### 使用例3: リアルタイム配信

```typescript
// Event Handler
export class MessageSentEventHandler {
  constructor(
    private webSocketGateway: WebSocketGateway,
    private channelRepository: ChannelRepository,
    private notificationService: NotificationService
  ) {}

  async handle(event: MessageSentEvent): Promise<void> {
    // チャネルメンバー取得
    const channel = await this.channelRepository.findById(event.channelId);
    const memberIds = channel.getMembers().map(m => m.userId);

    // WebSocketでリアルタイム配信
    await this.webSocketGateway.sendToUsers(memberIds, {
      type: 'new_message',
      data: {
        messageId: event.messageId,
        channelId: event.channelId,
        senderId: event.senderId
      }
    });

    // プッシュ通知（送信者以外のオフラインユーザー向け）
    const offlineUsers = await this.getOfflineUsers(memberIds, event.senderId);
    for (const userId of offlineUsers) {
      await this.notificationService.sendPushNotification(
        userId,
        'new_channel_message',
        {
          channelName: channel.getName(),
          senderName: await this.getUserName(event.senderId)
        }
      );
    }
  }
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-007 メッセージング詳細化
