# コラボレーション促進サービス - パラソルドメイン言語定義

## 1. ドメイン概要

### サービスの目的
チーム内外のコラボレーションを促進し、知識共有とコミュニケーションの効率化を実現する。プロジェクトの透明性を高め、チームの生産性と創造性を最大化する。

### 主要な価値提供
- リアルタイムコラボレーションの実現
- ナレッジの蓄積と活用
- チーム間の情報格差解消
- 意思決定の迅速化
- イノベーションの創発

### ドメインコンテキスト境界
- **上流コンテキスト**: セキュアアクセスサービス（認証・認可）、プロジェクト成功支援サービス（プロジェクト情報）
- **下流コンテキスト**: ナレッジ共創サービス（ドキュメント活用）、生産性可視化サービス（活動分析）
- **共有カーネル**: ユーザーID、組織ID、プロジェクトID

## 2. エンティティ定義

### コアエンティティ

#### Workspace（ワークスペース）<<entity>><<aggregate root>>
**識別性**: ワークスペースIDによって一意に識別される
**ライフサイクル**: 作成→活性→非活性→削除
**ステレオタイプ**: entity, aggregate-root

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | ワークスペースID | - |
| name | STRING_100 | ○ | ワークスペース名 | 1文字以上 |
| organizationId | UUID | ○ | 所属組織ID（IDのみ参照） | 外部キー |
| description | TEXT | - | 説明 | - |
| ownerId | UUID | ○ | オーナーID（IDのみ参照） | 外部キー |
| plan | ENUM | ○ | 利用プラン(free/standard/premium) | - |
| storageUsed | BIGINT | ○ | 使用ストレージ量 | 0以上 |
| storageLimit | BIGINT | ○ | ストレージ上限 | 0より大きい |
| status | ENUM | ○ | ステータス(active/inactive/deleted) | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |
| updatedAt | TIMESTAMP | ○ | 更新日時 | - |

#### Channel（チャネル）<<entity>><<aggregate root>>
**識別性**: チャネルIDによって一意に識別される
**ライフサイクル**: 作成→活性→アーカイブ→削除
**ステレオタイプ**: entity, aggregate-root

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | チャネルID | - |
| workspaceId | UUID | ○ | 所属ワークスペースID（IDのみ参照） | 外部キー |
| name | STRING_100 | ○ | チャネル名 | 1文字以上 |
| type | ENUM | ○ | チャネルタイプ(public/private/direct) | - |
| purpose | TEXT | - | チャネルの目的 | - |
| topic | STRING_200 | - | 現在のトピック | - |
| ownerId | UUID | ○ | オーナーID（IDのみ参照） | 外部キー |
| isArchived | BOOLEAN | ○ | アーカイブ状態 | - |
| lastActivityAt | TIMESTAMP | ○ | 最終活動日時 | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |
| updatedAt | TIMESTAMP | ○ | 更新日時 | - |

#### Document（ドキュメント）<<entity>><<aggregate root>>
**識別性**: ドキュメントIDによって一意に識別される
**ライフサイクル**: 作成→下書き→公開→アーカイブ→削除
**ステレオタイプ**: entity, aggregate-root

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | ドキュメントID | - |
| workspaceId | UUID | ○ | 所属ワークスペースID（IDのみ参照） | 外部キー |
| title | STRING_200 | ○ | タイトル | 1文字以上 |
| content | TEXT | ○ | 内容（Markdown/HTML） | - |
| type | ENUM | ○ | ドキュメントタイプ(markdown/wiki/note) | - |
| authorId | UUID | ○ | 作成者ID（IDのみ参照） | 外部キー |
| parentId | UUID | - | 親ドキュメントID（IDのみ参照） | 外部キー |
| version | INTEGER | ○ | バージョン番号 | 1以上 |
| status | ENUM | ○ | ステータス(draft/published/archived) | - |
| publishedAt | TIMESTAMP | - | 公開日時 | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |
| updatedAt | TIMESTAMP | ○ | 更新日時 | - |

#### Meeting（会議）<<entity>><<aggregate root>>
**識別性**: 会議IDによって一意に識別される
**ライフサイクル**: スケジュール→開始→進行中→完了→アーカイブ
**ステレオタイプ**: entity, aggregate-root

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | 会議ID | - |
| workspaceId | UUID | ○ | 所属ワークスペースID（IDのみ参照） | 外部キー |
| title | STRING_200 | ○ | 会議タイトル | 1文字以上 |
| description | TEXT | - | 会議の説明 | - |
| type | ENUM | ○ | 会議タイプ(video/audio/chat) | - |
| hostId | UUID | ○ | ホストID（IDのみ参照） | 外部キー |
| scheduledStart | TIMESTAMP | ○ | 開始予定時刻 | - |
| scheduledEnd | TIMESTAMP | ○ | 終了予定時刻 | 開始時刻より後 |
| actualStart | TIMESTAMP | - | 実際の開始時刻 | - |
| actualEnd | TIMESTAMP | - | 実際の終了時刻 | - |
| meetingUrl | URL | - | 会議URL | - |
| status | ENUM | ○ | ステータス(scheduled/in_progress/completed/cancelled) | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |
| updatedAt | TIMESTAMP | ○ | 更新日時 | - |

### サポートエンティティ

#### Message（メッセージ）<<entity>>
**識別性**: メッセージIDによって一意に識別される
**集約への所属**: ChannelAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | メッセージID | - |
| channelId | UUID | ○ | 所属チャネルID | 外部キー |
| authorId | UUID | ○ | 送信者ID（IDのみ参照） | 外部キー |
| content | TEXT | ○ | メッセージ内容 | 1文字以上 |
| type | ENUM | ○ | メッセージタイプ(text/file/system) | - |
| threadId | UUID | - | スレッドID | 外部キー |
| editedAt | TIMESTAMP | - | 編集日時 | - |
| deletedAt | TIMESTAMP | - | 削除日時（論理削除） | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |

#### Thread（スレッド）<<entity>>
**識別性**: スレッドIDによって一意に識別される
**集約への所属**: ChannelAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | スレッドID | - |
| parentMessageId | UUID | ○ | 親メッセージID | 外部キー |
| replyCount | INTEGER | ○ | 返信数 | 0以上 |
| lastReplyAt | TIMESTAMP | - | 最終返信日時 | - |
| isResolved | BOOLEAN | ○ | 解決済みフラグ | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |

#### ChannelMember（チャネルメンバー）<<entity>>
**識別性**: チャネルIDとユーザーIDの組み合わせで識別
**集約への所属**: ChannelAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| channelId | UUID | ○ | チャネルID | 外部キー |
| userId | UUID | ○ | ユーザーID（IDのみ参照） | 外部キー |
| role | ENUM | ○ | ロール(owner/admin/member) | - |
| joinedAt | TIMESTAMP | ○ | 参加日時 | - |
| lastReadAt | TIMESTAMP | - | 最終既読日時 | - |
| notificationEnabled | BOOLEAN | ○ | 通知有効フラグ | - |

#### DocumentVersion（ドキュメントバージョン）<<entity>>
**識別性**: ドキュメントIDとバージョン番号で識別
**集約への所属**: DocumentAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| documentId | UUID | ○ | ドキュメントID | 外部キー |
| version | INTEGER | ○ | バージョン番号 | 1以上 |
| content | TEXT | ○ | 内容 | - |
| authorId | UUID | ○ | 編集者ID（IDのみ参照） | 外部キー |
| changeNote | STRING_500 | - | 変更内容メモ | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |

#### MeetingParticipant（会議参加者）<<entity>>
**識別性**: 会議IDとユーザーIDの組み合わせで識別
**集約への所属**: MeetingAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| meetingId | UUID | ○ | 会議ID | 外部キー |
| userId | UUID | ○ | ユーザーID（IDのみ参照） | 外部キー |
| role | ENUM | ○ | ロール(host/presenter/participant) | - |
| joinedAt | TIMESTAMP | - | 参加時刻 | - |
| leftAt | TIMESTAMP | - | 退出時刻 | - |
| status | ENUM | ○ | ステータス(invited/accepted/declined/attended) | - |

#### Notification（通知）<<entity>>
**識別性**: 通知IDによって一意に識別される
**集約への所属**: WorkspaceAggregateに属する
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 | 制約 |
|--------|----|----|------|------|
| id | UUID | ○ | 通知ID | - |
| workspaceId | UUID | ○ | ワークスペースID | 外部キー |
| recipientId | UUID | ○ | 受信者ID（IDのみ参照） | 外部キー |
| type | ENUM | ○ | 通知タイプ(mention/reply/meeting/document) | - |
| title | STRING_200 | ○ | タイトル | 1文字以上 |
| message | TEXT | ○ | メッセージ | - |
| sourceType | ENUM | ○ | ソースタイプ(message/document/meeting) | - |
| sourceId | UUID | ○ | ソースID | 外部キー |
| isRead | BOOLEAN | ○ | 既読フラグ | - |
| readAt | TIMESTAMP | - | 既読日時 | - |
| createdAt | TIMESTAMP | ○ | 作成日時 | - |

## 3. 値オブジェクト定義

### CollaborationMetrics（コラボレーション指標）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value-object

```typescript
interface CollaborationMetrics {
  messageCount: number;           // メッセージ数
  activeUsers: number;            // アクティブユーザー数
  responseTime: number;           // 平均応答時間（分）
  engagementRate: number;         // エンゲージメント率（0-1）
  documentContributions: number;  // ドキュメント貢献数
  meetingParticipation: number;   // 会議参加率（0-1）

  // 値オブジェクトの振る舞い
  equals(other: CollaborationMetrics): boolean;
  validate(): boolean;
  calculateScore(): number;
}
```

### MentionContext（メンション文脈）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: userId、position、typeで判定
**ステレオタイプ**: value-object

```typescript
interface MentionContext {
  userId: UUID;                  // メンション対象ユーザー
  position: number;              // テキスト内の位置
  type: 'user' | 'team' | 'channel';  // メンションタイプ
  notified: boolean;             // 通知済みフラグ

  equals(other: MentionContext): boolean;
  validate(): boolean;
}
```

### FileAttachment（ファイル添付）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: idで判定
**ステレオタイプ**: value-object

```typescript
interface FileAttachment {
  id: UUID;
  filename: string;
  filesize: number;              // バイト数
  mimetype: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: UUID;
  uploadedAt: Date;

  equals(other: FileAttachment): boolean;
  validate(): boolean;
  isImage(): boolean;
  isDocument(): boolean;
}
```

### MeetingAgenda（会議アジェンダ）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value-object

```typescript
interface MeetingAgenda {
  items: AgendaItem[];
  estimatedDuration: number;     // 分
  objectives: string[];
  requiredDocuments: UUID[];

  equals(other: MeetingAgenda): boolean;
  validate(): boolean;
  getTotalDuration(): number;
}

interface AgendaItem {
  title: string;
  duration: number;               // 分
  presenter: UUID;
  description: string;
  order: number;
}
```

### WorkspaceSettings（ワークスペース設定）<<value object>>
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value-object

```typescript
interface WorkspaceSettings {
  allowGuestAccess: boolean;
  maxChannels: number;
  maxMembersPerChannel: number;
  retentionPeriod: number;        // 日数
  allowFileUploads: boolean;
  maxFileSize: number;            // バイト
  allowedFileTypes: string[];
  defaultChannelType: 'public' | 'private';

  equals(other: WorkspaceSettings): boolean;
  validate(): boolean;
}
```

### 列挙型定義

```typescript
enum ChannelType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  DIRECT = 'direct'
}

enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  SYSTEM = 'system'
}

enum MeetingType {
  VIDEO = 'video',
  AUDIO = 'audio',
  CHAT = 'chat'
}

enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

enum NotificationType {
  MENTION = 'mention',
  REPLY = 'reply',
  MEETING = 'meeting',
  DOCUMENT = 'document'
}
```

## 4. 集約定義

### WorkspaceAggregate（ワークスペース集約）<<aggregate>>
**集約ルート**: Workspace
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Notification（複数）

**集約境界の理由**:
- ワークスペース全体の設定と通知を一元管理
- ストレージ使用量の整合性を保証
- プラン制限の適用

**不変条件**:
- ストレージ使用量はストレージ上限を超えない
- オーナーは常に1名存在する
- 削除されたワークスペースは復元不可

**他集約との関係**:
- ChannelAggregateとはworkspaceIdで参照（IDのみ）
- DocumentAggregateとはworkspaceIdで参照（IDのみ）
- MeetingAggregateとはworkspaceIdで参照（IDのみ）

### ChannelAggregate（チャネル集約）<<aggregate>>
**集約ルート**: Channel
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Message（複数）
- Thread（複数）
- ChannelMember（複数）

**集約境界の理由**:
- チャネル内のメッセージとスレッドの整合性管理
- メンバー権限の一元管理
- メッセージの順序性保証

**不変条件**:
- プライベートチャネルのメンバーは招待制
- ダイレクトメッセージは2名のみ
- アーカイブ後は新規メッセージ投稿不可
- チャネルには最低1名のオーナーが必要
- メッセージの編集は投稿後24時間以内

**他集約との関係**:
- WorkspaceAggregateとはworkspaceIdで参照（IDのみ）
- UserとはuserIdで参照（IDのみ）

### DocumentAggregate（ドキュメント集約）<<aggregate>>
**集約ルート**: Document
**ステレオタイプ**: aggregate

**包含エンティティ**:
- DocumentVersion（複数）

**集約境界の理由**:
- ドキュメントのバージョン管理
- 編集の同時実行制御
- 公開状態の一元管理

**不変条件**:
- 公開ドキュメントは編集権限者のみ変更可能
- バージョン番号は単調増加
- 削除は論理削除のみ
- 最大100バージョン保持

**他集約との関係**:
- WorkspaceAggregateとはworkspaceIdで参照（IDのみ）
- UserとはauthorIdで参照（IDのみ）
- 親DocumentとはparentIdで参照（IDのみ）

### MeetingAggregate（会議集約）<<aggregate>>
**集約ルート**: Meeting
**ステレオタイプ**: aggregate

**包含エンティティ**:
- MeetingParticipant（複数）

**集約境界の理由**:
- 会議参加者の管理
- 会議状態の整合性保証
- スケジュールの競合防止

**不変条件**:
- 開始時刻は終了時刻より前
- 参加者にはホストが必須
- 完了後の会議は変更不可
- 参加者上限は100名
- 最短15分、最長8時間

**他集約との関係**:
- WorkspaceAggregateとはworkspaceIdで参照（IDのみ）
- UserとはuserIdで参照（IDのみ）

## 5. ドメインサービス

### CollaborationCoordinator <<service>>
**責務**: チャネル間の連携とメッセージング調整
**ステレオタイプ**: service

```typescript
interface CollaborationCoordinator {
  // ワークスペースとチャネルの連携
  createChannelInWorkspace(
    workspaceId: UUID,
    channelParams: ChannelParams
  ): Result<Channel>;

  // チャネル間のメンバー移動
  moveMembers(
    fromChannelId: UUID,
    toChannelId: UUID,
    memberIds: UUID[]
  ): Result<void>;

  // ワークスペース全体への通知
  broadcastToWorkspace(
    workspaceId: UUID,
    notification: NotificationParams
  ): Result<void>;

  // クロスチャネル検索
  searchAcrossChannels(
    workspaceId: UUID,
    query: SearchQuery
  ): Result<SearchResult[]>;
}
```

### DocumentCollaborationService <<service>>
**責務**: ドキュメントの共同編集と競合解決
**ステレオタイプ**: service

```typescript
interface DocumentCollaborationService {
  // リアルタイム共同編集セッション管理
  startCollaborationSession(
    documentId: UUID,
    participantIds: UUID[]
  ): Result<CollaborationSession>;

  // 編集の競合解決
  resolveEditConflicts(
    documentId: UUID,
    changes: Change[]
  ): Result<Document>;

  // ドキュメント間のリンク管理
  linkDocuments(
    sourceDocId: UUID,
    targetDocId: UUID,
    linkType: LinkType
  ): Result<void>;

  // ワークスペース間でのドキュメント共有
  shareAcrossWorkspaces(
    documentId: UUID,
    targetWorkspaceIds: UUID[],
    permission: Permission
  ): Result<void>;
}
```

### MeetingOrchestrator <<service>>
**責務**: 会議の調整と関連リソースの統合
**ステレオタイプ**: service

```typescript
interface MeetingOrchestrator {
  // 会議とチャネルの連携
  createMeetingFromChannel(
    channelId: UUID,
    meetingParams: MeetingParams
  ): Result<Meeting>;

  // 会議録とドキュメントの連携
  generateMeetingDocument(
    meetingId: UUID,
    templateId?: UUID
  ): Result<Document>;

  // 参加者のスケジュール調整
  findOptimalTimeSlot(
    participantIds: UUID[],
    duration: number,
    constraints: TimeConstraints
  ): Result<TimeSlot[]>;

  // フォローアップアクションの生成
  createFollowUpActions(
    meetingId: UUID,
    actions: ActionItem[]
  ): Result<void>;
}
```

### NotificationOrchestrator <<service>>
**責務**: 通知の配信と優先度管理
**ステレオタイプ**: service

```typescript
interface NotificationOrchestrator {
  // メンション通知の処理
  processMentions(
    messageId: UUID,
    mentions: MentionContext[]
  ): Result<void>;

  // 通知の集約と配信
  aggregateAndDeliver(
    recipientId: UUID,
    notifications: Notification[]
  ): Result<void>;

  // 通知設定の適用
  applyNotificationRules(
    userId: UUID,
    workspaceId: UUID,
    rules: NotificationRule[]
  ): Result<void>;
}
```

## 6. リポジトリインターフェース

### WorkspaceRepository <<repository>>
**責務**: ワークスペース集約の永続化
**ステレオタイプ**: repository

```typescript
interface WorkspaceRepository {
  // 基本操作
  findById(id: UUID): Promise<WorkspaceAggregate | null>;
  findByOrganizationId(orgId: UUID): Promise<WorkspaceAggregate[]>;
  save(workspace: WorkspaceAggregate): Promise<void>;
  delete(id: UUID): Promise<void>;

  // ドメイン固有の検索
  findActiveWorkspaces(): Promise<WorkspaceAggregate[]>;
  findByOwner(ownerId: UUID): Promise<WorkspaceAggregate[]>;

  // 統計情報
  getStorageUsage(id: UUID): Promise<number>;
}
```

### ChannelRepository <<repository>>
**責務**: チャネル集約の永続化
**ステレオタイプ**: repository

```typescript
interface ChannelRepository {
  // 基本操作
  findById(id: UUID): Promise<ChannelAggregate | null>;
  findByWorkspaceId(workspaceId: UUID): Promise<ChannelAggregate[]>;
  save(channel: ChannelAggregate): Promise<void>;
  delete(id: UUID): Promise<void>;

  // メッセージ関連
  findMessagesInChannel(
    channelId: UUID,
    limit: number,
    before?: Date
  ): Promise<Message[]>;

  // メンバー関連
  findMemberChannels(userId: UUID): Promise<ChannelAggregate[]>;
}
```

### DocumentRepository <<repository>>
**責務**: ドキュメント集約の永続化
**ステレオタイプ**: repository

```typescript
interface DocumentRepository {
  // 基本操作
  findById(id: UUID): Promise<DocumentAggregate | null>;
  findByWorkspaceId(workspaceId: UUID): Promise<DocumentAggregate[]>;
  save(document: DocumentAggregate): Promise<void>;
  delete(id: UUID): Promise<void>;

  // バージョン管理
  findVersions(documentId: UUID): Promise<DocumentVersion[]>;
  saveVersion(version: DocumentVersion): Promise<void>;

  // 検索
  searchDocuments(query: string, workspaceId: UUID): Promise<DocumentAggregate[]>;
}
```

### MeetingRepository <<repository>>
**責務**: 会議集約の永続化
**ステレオタイプ**: repository

```typescript
interface MeetingRepository {
  // 基本操作
  findById(id: UUID): Promise<MeetingAggregate | null>;
  findByWorkspaceId(workspaceId: UUID): Promise<MeetingAggregate[]>;
  save(meeting: MeetingAggregate): Promise<void>;
  delete(id: UUID): Promise<void>;

  // スケジュール関連
  findUpcoming(userId: UUID, limit: number): Promise<MeetingAggregate[]>;
  findByDateRange(
    workspaceId: UUID,
    start: Date,
    end: Date
  ): Promise<MeetingAggregate[]>;
}
```

## 7. ファクトリ

### ChannelFactory <<factory>>
**責務**: チャネルの生成と初期化
**ステレオタイプ**: factory

```typescript
class ChannelFactory {
  // 新規チャネル作成
  static createNew(params: CreateChannelParams): ChannelAggregate {
    // バリデーション
    validateChannelName(params.name);
    validateChannelType(params.type);

    // デフォルト値設定
    const channel = new Channel({
      id: generateUUID(),
      name: params.name,
      type: params.type,
      isArchived: false,
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // オーナーをメンバーとして追加
    const ownerMember = new ChannelMember({
      channelId: channel.id,
      userId: params.ownerId,
      role: MemberRole.OWNER,
      joinedAt: new Date()
    });

    return new ChannelAggregate(channel, [ownerMember], [], []);
  }

  // 既存データからの復元
  static reconstitute(data: ChannelPersistenceData): ChannelAggregate {
    // データ変換とバリデーション
    const channel = new Channel(data.channel);
    const messages = data.messages.map(m => new Message(m));
    const threads = data.threads.map(t => new Thread(t));
    const members = data.members.map(m => new ChannelMember(m));

    return new ChannelAggregate(channel, members, messages, threads);
  }
}
```

### DocumentFactory <<factory>>
**責務**: ドキュメントの生成と初期化
**ステレオタイプ**: factory

```typescript
class DocumentFactory {
  // 新規ドキュメント作成
  static createNew(params: CreateDocumentParams): DocumentAggregate {
    const document = new Document({
      id: generateUUID(),
      title: params.title,
      content: params.content || '',
      type: params.type || 'markdown',
      version: 1,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 初期バージョンを作成
    const initialVersion = new DocumentVersion({
      documentId: document.id,
      version: 1,
      content: document.content,
      authorId: params.authorId,
      changeNote: 'Initial version',
      createdAt: new Date()
    });

    return new DocumentAggregate(document, [initialVersion]);
  }
}
```

## 8. ドメインイベント

### ChannelCreated <<event>>
**発生タイミング**: チャネルが作成された時
**ステレオタイプ**: event

```typescript
class ChannelCreated implements DomainEvent {
  readonly eventId: UUID;
  readonly aggregateId: UUID;
  readonly occurredAt: Date;
  readonly eventType: string = 'ChannelCreated';

  readonly payload: {
    channelId: UUID;
    workspaceId: UUID;
    name: string;
    type: ChannelType;
    creatorId: UUID;
  };

  constructor(aggregateId: UUID, payload: Payload) {
    this.eventId = generateUUID();
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
    this.payload = payload;
  }
}
```

### MessagePosted <<event>>
**発生タイミング**: メッセージが投稿された時
**ステレオタイプ**: event

```typescript
class MessagePosted implements DomainEvent {
  readonly eventId: UUID;
  readonly aggregateId: UUID;
  readonly occurredAt: Date;
  readonly eventType: string = 'MessagePosted';

  readonly payload: {
    messageId: UUID;
    channelId: UUID;
    authorId: UUID;
    content: string;
    mentions: UUID[];
  };
}
```

### DocumentPublished <<event>>
**発生タイミング**: ドキュメントが公開された時
**ステレオタイプ**: event

```typescript
class DocumentPublished implements DomainEvent {
  readonly eventId: UUID;
  readonly aggregateId: UUID;
  readonly occurredAt: Date;
  readonly eventType: string = 'DocumentPublished';

  readonly payload: {
    documentId: UUID;
    workspaceId: UUID;
    publisherId: UUID;
    version: number;
  };
}
```

### MeetingCompleted <<event>>
**発生タイミング**: 会議が完了した時
**ステレオタイプ**: event

```typescript
class MeetingCompleted implements DomainEvent {
  readonly eventId: UUID;
  readonly aggregateId: UUID;
  readonly occurredAt: Date;
  readonly eventType: string = 'MeetingCompleted';

  readonly payload: {
    meetingId: UUID;
    duration: number;
    participantCount: number;
    recordingAvailable: boolean;
  };
}
```

### イベントハンドラー

```typescript
interface EventHandler {
  handle(event: DomainEvent): Promise<void>;
  canHandle(event: DomainEvent): boolean;
}

class MentionNotificationHandler implements EventHandler {
  canHandle(event: DomainEvent): boolean {
    return event.eventType === 'MessagePosted';
  }

  async handle(event: MessagePosted): Promise<void> {
    // メンション通知を生成
    for (const userId of event.payload.mentions) {
      await this.notificationService.notify(userId, {
        type: 'mention',
        sourceId: event.payload.messageId
      });
    }
  }
}
```

## 9. 仕様オブジェクト

### ActiveChannelSpecification <<specification>>
**目的**: アクティブなチャネルを判定
**ステレオタイプ**: specification

```typescript
class ActiveChannelSpecification implements Specification<Channel> {
  isSatisfiedBy(channel: Channel): boolean {
    return !channel.isArchived &&
           channel.lastActivityAt > this.thirtyDaysAgo();
  }

  and(other: Specification<Channel>): Specification<Channel> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<Channel>): Specification<Channel> {
    return new OrSpecification(this, other);
  }

  private thirtyDaysAgo(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }
}
```

### PublishableDocumentSpecification <<specification>>
**目的**: 公開可能なドキュメントを判定
**ステレオタイプ**: specification

```typescript
class PublishableDocumentSpecification implements Specification<Document> {
  isSatisfiedBy(document: Document): boolean {
    return document.status === 'draft' &&
           document.content.length > 0 &&
           document.title.length > 0 &&
           this.hasValidStructure(document);
  }

  private hasValidStructure(document: Document): boolean {
    // ドキュメント構造のバリデーション
    return true;
  }
}
```

## 10. ビジネスルール

### 基本ルール
1. **一意性制約**: ワークスペース内でチャネル名は一意
2. **必須項目**: すべてのエンティティにはIDと作成日時が必須
3. **状態遷移**:
   - チャネル: active → archived（不可逆）
   - ドキュメント: draft → published → archived
   - 会議: scheduled → in_progress → completed

### 整合性ルール
- **集約内整合性**: 各集約内でトランザクション整合性を保証
- **結果整合性**: 集約間の整合性は非同期で保証
- **参照整合性**: ID参照による疎結合を維持

### バリデーションルール
| ルール名 | 対象 | 条件 | エラーメッセージ |
|---------|------|------|----------------|
| チャネル名必須 | Channel.name | 1文字以上100文字以下 | チャネル名は必須です |
| メッセージ長制限 | Message.content | 最大10,000文字 | メッセージが長すぎます |
| 会議時間制限 | Meeting | 15分以上8時間以下 | 会議時間が範囲外です |
| ファイルサイズ | FileAttachment | 最大100MB | ファイルサイズが大きすぎます |

## 11. インターフェース仕様

### コマンドインターフェース

```typescript
// ワークスペースコマンド
interface CreateWorkspaceCommand {
  name: string;
  organizationId: UUID;
  ownerId: UUID;
  plan: 'free' | 'standard' | 'premium';
  settings?: WorkspaceSettings;
}

// チャネルコマンド
interface CreateChannelCommand {
  workspaceId: UUID;
  name: string;
  type: ChannelType;
  ownerId: UUID;
  purpose?: string;
}

// メッセージコマンド
interface PostMessageCommand {
  channelId: UUID;
  authorId: UUID;
  content: string;
  attachments?: FileAttachment[];
  mentions?: UUID[];
}

// コマンドハンドラー
interface CommandHandler {
  execute(command: Command): Promise<Result<void>>;
}
```

### クエリインターフェース

```typescript
// チャネル検索クエリ
interface SearchChannelsQuery {
  workspaceId: UUID;
  name?: string;
  type?: ChannelType;
  includeArchived?: boolean;
  limit?: number;
  offset?: number;
}

// メッセージ検索クエリ
interface SearchMessagesQuery {
  workspaceId?: UUID;
  channelId?: UUID;
  authorId?: UUID;
  content?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

// クエリハンドラー
interface QueryHandler {
  execute(query: Query): Promise<Result<any>>;
}
```

## 12. 統合ポイント

### 他サービスとの連携

1. **セキュアアクセスサービス連携**
   - 連携方法: REST API
   - データ形式: JSON
   - 認証: JWT
   - 同期/非同期: 同期
   - 連携内容: ユーザー認証、権限確認

2. **プロジェクト成功支援サービス連携**
   - 連携方法: イベント駆動
   - データ形式: Domain Events
   - 認証: Service Token
   - 同期/非同期: 非同期
   - 連携内容: プロジェクトチャネル作成、タスク通知

3. **ナレッジ共創サービス連携**
   - 連携方法: REST API
   - データ形式: JSON
   - 認証: Service Token
   - 同期/非同期: 非同期
   - 連携内容: ドキュメントのナレッジ化

### 外部システム連携

- **外部API**: Slack, Microsoft Teams, Zoom
- **データ同期**: 1時間ごとの差分同期
- **エラーハンドリング**: 3回リトライ、指数バックオフ

## 13. パフォーマンス要件

### レスポンスタイム
- メッセージ投稿: < 100ms (95パーセンタイル)
- チャネル切り替え: < 200ms (95パーセンタイル)
- ドキュメント保存: < 500ms (95パーセンタイル)
- 検索: < 1000ms (95パーセンタイル)

### スループット
- 同時接続数: 10,000
- メッセージ/秒: 1,000
- 同時編集ドキュメント: 100

### スケーラビリティ
- 水平スケーリング対応
- ステートレス設計
- キャッシュ戦略: Redis（メッセージ、チャネル情報）

## 14. セキュリティ要件

### 認証・認可
- 認証方式: JWT
- 認可: ロールベース（Owner, Admin, Member）
- セッション管理: 24時間有効

### データ保護
- 暗号化: 保存時（AES-256）、通信時（TLS 1.3）
- 個人情報: メッセージ内容の暗号化
- 監査ログ: 全操作を記録

## 15. データ型定義

### 基本型
```typescript
type UUID = string;           // UUID v4形式
type EMAIL = string;          // RFC5322準拠
type URL = string;            // RFC3986準拠
type DATE = string;           // YYYY-MM-DD形式
type TIMESTAMP = string;      // ISO8601形式
type MONEY = {
  amount: number;
  currency: string;
};

// 文字列型（長さ制限付き）
type STRING_20 = string;      // 最大20文字
type STRING_50 = string;      // 最大50文字
type STRING_100 = string;     // 最大100文字
type STRING_200 = string;     // 最大200文字
type STRING_255 = string;     // 最大255文字
type STRING_500 = string;     // 最大500文字
type TEXT = string;           // 長文（制限なし）

// 数値型
type INTEGER = number;        // 整数
type BIGINT = number;         // 大きな整数
type DECIMAL = number;        // 小数
type PERCENTAGE = number;     // 0-100

// その他
type BOOLEAN = boolean;       // 真偽値
type JSON = object;           // JSON形式
type ENUM = string;           // 列挙型
```

## 16. Result型定義

```typescript
// 成功/失敗を表現する型
type Result<T> =
  | { success: true; value: T }
  | { success: false; error: Error };

// エラー型
interface Error {
  code: string;
  message: string;
  details?: any;
}
```