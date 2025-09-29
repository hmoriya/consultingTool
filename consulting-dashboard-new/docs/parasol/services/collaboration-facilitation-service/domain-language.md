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

## 2. エンティティ定義

### コアエンティティ

#### Message（メッセージ）
**識別性**: メッセージIDによって一意に識別される
**ライフサイクル**: 作成から永続的に保存（削除は論理削除）

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | メッセージID |
| channelId | UUID | ○ | 所属チャネル |
| authorId | UUID | ○ | 送信者ID |
| content | TEXT | ○ | メッセージ内容 |
| type | ENUM | ○ | メッセージタイプ（text/file/system） |
| threadId | UUID | - | スレッドID（返信の場合） |
| attachments | JSON | - | 添付ファイル情報 |
| mentions | UUID[] | - | メンション対象者リスト |
| reactions | JSON | - | リアクション情報 |
| editedAt | TIMESTAMP | - | 編集日時 |
| deletedAt | TIMESTAMP | - | 削除日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| metadata | JSON | - | メタデータ |

#### Channel（チャネル）
**識別性**: チャネルIDによって一意に識別される
**ライフサイクル**: 作成からアーカイブまで

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | チャネルID |
| workspaceId | UUID | ○ | 所属ワークスペース |
| name | STRING_100 | ○ | チャネル名 |
| type | ENUM | ○ | チャネルタイプ（public/private/direct） |
| purpose | TEXT | - | チャネルの目的 |
| topic | STRING_200 | - | 現在のトピック |
| memberIds | UUID[] | ○ | メンバーリスト |
| ownerId | UUID | ○ | オーナーID |
| isArchived | BOOLEAN | ○ | アーカイブ状態 |
| settings | JSON | ○ | チャネル設定 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| lastActivityAt | TIMESTAMP | ○ | 最終活動日時 |

#### Document（ドキュメント）
**識別性**: ドキュメントIDによって一意に識別される
**ライフサイクル**: 作成から削除まで（バージョン管理あり）

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ドキュメントID |
| workspaceId | UUID | ○ | 所属ワークスペース |
| title | STRING_200 | ○ | タイトル |
| content | TEXT | ○ | 内容（Markdown/HTML） |
| type | ENUM | ○ | ドキュメントタイプ |
| authorId | UUID | ○ | 作成者ID |
| editorIds | UUID[] | ○ | 編集者リスト |
| viewerIds | UUID[] | - | 閲覧者リスト |
| parentId | UUID | - | 親ドキュメントID |
| tags | STRING[] | - | タグリスト |
| version | INTEGER | ○ | バージョン番号 |
| isPublished | BOOLEAN | ○ | 公開状態 |
| publishedAt | TIMESTAMP | - | 公開日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Meeting（会議）
**識別性**: 会議IDによって一意に識別される
**ライフサイクル**: スケジュールから完了まで

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 会議ID |
| title | STRING_200 | ○ | 会議タイトル |
| description | TEXT | - | 会議の説明 |
| type | ENUM | ○ | 会議タイプ（video/audio/chat） |
| hostId | UUID | ○ | ホストID |
| participantIds | UUID[] | ○ | 参加者リスト |
| scheduledStart | TIMESTAMP | ○ | 開始予定時刻 |
| scheduledEnd | TIMESTAMP | ○ | 終了予定時刻 |
| actualStart | TIMESTAMP | - | 実際の開始時刻 |
| actualEnd | TIMESTAMP | - | 実際の終了時刻 |
| meetingUrl | URL | - | 会議URL |
| agenda | TEXT | - | アジェンダ |
| minutes | TEXT | - | 議事録 |
| recordings | JSON | - | 録画情報 |
| status | ENUM | ○ | ステータス |
| createdAt | TIMESTAMP | ○ | 作成日時 |

#### Workspace（ワークスペース）
**識別性**: ワークスペースIDによって一意に識別される
**ライフサイクル**: 作成から削除まで

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | ワークスペースID |
| name | STRING_100 | ○ | ワークスペース名 |
| organizationId | UUID | ○ | 所属組織ID |
| description | TEXT | - | 説明 |
| ownerId | UUID | ○ | オーナーID |
| adminIds | UUID[] | ○ | 管理者リスト |
| memberIds | UUID[] | ○ | メンバーリスト |
| settings | JSON | ○ | ワークスペース設定 |
| plan | ENUM | ○ | 利用プラン |
| storageUsed | BIGINT | ○ | 使用ストレージ量 |
| storageLimit | BIGINT | ○ | ストレージ上限 |
| isActive | BOOLEAN | ○ | アクティブ状態 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### サポートエンティティ

#### Thread（スレッド）
**識別性**: スレッドIDによって一意に識別される

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | スレッドID |
| parentMessageId | UUID | ○ | 親メッセージID |
| replyCount | INTEGER | ○ | 返信数 |
| participantIds | UUID[] | ○ | 参加者リスト |
| lastReplyAt | TIMESTAMP | - | 最終返信日時 |
| isResolved | BOOLEAN | ○ | 解決済みフラグ |

#### Notification（通知）
**識別性**: 通知IDによって一意に識別される

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 通知ID |
| recipientId | UUID | ○ | 受信者ID |
| type | ENUM | ○ | 通知タイプ |
| title | STRING_200 | ○ | タイトル |
| message | TEXT | ○ | メッセージ |
| sourceType | ENUM | ○ | ソースタイプ |
| sourceId | UUID | ○ | ソースID |
| isRead | BOOLEAN | ○ | 既読フラグ |
| readAt | TIMESTAMP | - | 既読日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |

## 3. 値オブジェクト定義

### CollaborationMetrics（コラボレーション指標）
```typescript
interface CollaborationMetrics {
  messageCount: number;           // メッセージ数
  activeUsers: number;            // アクティブユーザー数
  responseTime: number;           // 平均応答時間（分）
  engagementRate: number;         // エンゲージメント率
  documentContributions: number;  // ドキュメント貢献数
  meetingParticipation: number;   // 会議参加率
}
```

### MentionContext（メンション文脈）
```typescript
interface MentionContext {
  userId: UUID;
  position: number;      // テキスト内の位置
  type: 'user' | 'team' | 'channel';
  notified: boolean;
}
```

### FileAttachment（ファイル添付）
```typescript
interface FileAttachment {
  id: UUID;
  filename: string;
  filesize: number;
  mimetype: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: UUID;
  uploadedAt: Date;
}
```

### MeetingAgenda（会議アジェンダ）
```typescript
interface MeetingAgenda {
  items: AgendaItem[];
  estimatedDuration: number;
  objectives: string[];
  requiredDocuments: UUID[];
}

interface AgendaItem {
  title: string;
  duration: number;
  presenter: UUID;
  description: string;
  order: number;
}
```

## 4. 集約定義

### ChannelAggregate（チャネル集約）
**集約ルート**: Channel
**包含エンティティ**: 
- Message
- Thread
- ChannelMember

**不変条件**:
- プライベートチャネルのメンバーは招待制
- ダイレクトメッセージは2名のみ
- アーカイブ後は新規メッセージ投稿不可

### DocumentAggregate（ドキュメント集約）
**集約ルート**: Document
**包含エンティティ**:
- DocumentVersion
- DocumentComment
- DocumentCollaborator

**不変条件**:
- 公開ドキュメントは編集権限者のみ変更可能
- バージョン番号は単調増加
- 削除は論理削除のみ

### MeetingAggregate（会議集約）
**集約ルート**: Meeting
**包含エンティティ**:
- MeetingParticipant
- MeetingMinutes
- MeetingAction

**不変条件**:
- 開始時刻は終了時刻より前
- 参加者にはホストが必須
- 完了後の会議は変更不可

## 5. ドメインサービス

### CollaborationCoordinator
```typescript
interface CollaborationCoordinator {
  // チャネル管理
  createChannel(workspace: Workspace, params: ChannelParams): Channel;
  inviteToChannel(channel: Channel, users: User[]): void;
  archiveChannel(channel: Channel): void;
  
  // メッセージング
  postMessage(channel: Channel, message: MessageParams): Message;
  createThread(message: Message): Thread;
  addReaction(message: Message, emoji: string): void;
  
  // 通知制御
  notifyMentions(message: Message): void;
  broadcastToChannel(channel: Channel, notification: Notification): void;
}
```

### DocumentCollaborationService
```typescript
interface DocumentCollaborationService {
  // 共同編集
  enableRealTimeEditing(document: Document): void;
  resolveConflicts(document: Document, changes: Change[]): Document;
  createVersion(document: Document): DocumentVersion;
  
  // アクセス制御
  shareDocument(document: Document, users: User[], permission: Permission): void;
  publishDocument(document: Document): void;
  restrictAccess(document: Document, users: User[]): void;
}
```

### MeetingOrchestrator
```typescript
interface MeetingOrchestrator {
  // 会議管理
  scheduleMeeting(params: MeetingParams): Meeting;
  startMeeting(meeting: Meeting): void;
  recordMeeting(meeting: Meeting): Recording;
  
  // 議事録作成
  generateMinutes(meeting: Meeting): Minutes;
  assignActionItems(meeting: Meeting, items: ActionItem[]): void;
  distributeMeetingNotes(meeting: Meeting): void;
}
```

## 6. ドメインイベント

### コラボレーションイベント

```typescript
// メッセージイベント
class MessagePosted {
  messageId: UUID;
  channelId: UUID;
  authorId: UUID;
  content: string;
  mentions: UUID[];
  timestamp: Date;
}

class ThreadCreated {
  threadId: UUID;
  parentMessageId: UUID;
  creatorId: UUID;
  timestamp: Date;
}

// チャネルイベント
class ChannelCreated {
  channelId: UUID;
  workspaceId: UUID;
  creatorId: UUID;
  type: ChannelType;
  timestamp: Date;
}

class MemberJoinedChannel {
  channelId: UUID;
  userId: UUID;
  invitedBy: UUID;
  timestamp: Date;
}

// ドキュメントイベント
class DocumentShared {
  documentId: UUID;
  sharedBy: UUID;
  sharedWith: UUID[];
  permission: Permission;
  timestamp: Date;
}

class DocumentPublished {
  documentId: UUID;
  publisherId: UUID;
  version: number;
  timestamp: Date;
}

// 会議イベント
class MeetingScheduled {
  meetingId: UUID;
  scheduledBy: UUID;
  participants: UUID[];
  scheduledTime: Date;
  timestamp: Date;
}

class MeetingCompleted {
  meetingId: UUID;
  duration: number;
  participantCount: number;
  recordingAvailable: boolean;
  timestamp: Date;
}
```

## 7. ビジネスルール

### チャネル運用ルール
1. **メンバー管理**
   - プライベートチャネルは招待制
   - パブリックチャネルは自由参加
   - 最低1名の管理者が必要

2. **メッセージ制限**
   - 1メッセージ最大10,000文字
   - 添付ファイルは最大10個
   - 編集は投稿後24時間以内

3. **アーカイブポリシー**
   - 90日間活動なしで自動アーカイブ提案
   - アーカイブ後は読み取り専用

### ドキュメント管理ルール
1. **バージョン管理**
   - 自動保存は5分ごと
   - 最大100バージョン保持
   - 30日以上前のバージョンは圧縮

2. **アクセス制御**
   - 編集権限は最大10名
   - 公開ドキュメントは組織内のみ
   - 外部共有は管理者承認必要

### 会議運営ルール
1. **スケジューリング**
   - 最短15分、最長8時間
   - 参加者上限100名
   - 24時間前までキャンセル可能

2. **録画ポリシー**
   - 参加者全員の同意必要
   - 保存期間は90日
   - 議事録は自動生成

## 8. インターフェース仕様

### コマンドインターフェース

```typescript
// チャネルコマンド
interface ChannelCommands {
  CreateChannel(params: CreateChannelParams): Result<Channel>;
  InviteMembers(channelId: UUID, userIds: UUID[]): Result<void>;
  PostMessage(channelId: UUID, content: string, attachments?: File[]): Result<Message>;
  ArchiveChannel(channelId: UUID): Result<void>;
}

// ドキュメントコマンド
interface DocumentCommands {
  CreateDocument(params: CreateDocumentParams): Result<Document>;
  UpdateDocument(id: UUID, content: string): Result<Document>;
  ShareDocument(id: UUID, users: UUID[], permission: Permission): Result<void>;
  PublishDocument(id: UUID): Result<void>;
}

// 会議コマンド
interface MeetingCommands {
  ScheduleMeeting(params: ScheduleMeetingParams): Result<Meeting>;
  StartMeeting(id: UUID): Result<MeetingSession>;
  EndMeeting(id: UUID): Result<void>;
  SaveMinutes(id: UUID, minutes: string): Result<void>;
}
```

### クエリインターフェース

```typescript
// チャネルクエリ
interface ChannelQueries {
  GetChannelMessages(channelId: UUID, limit: number, before?: Date): Message[];
  SearchMessages(query: string, filters: SearchFilters): Message[];
  GetUserChannels(userId: UUID): Channel[];
  GetChannelMembers(channelId: UUID): User[];
}

// ドキュメントクエリ
interface DocumentQueries {
  GetDocument(id: UUID): Document;
  GetDocumentVersions(id: UUID): DocumentVersion[];
  SearchDocuments(query: string, tags?: string[]): Document[];
  GetSharedDocuments(userId: UUID): Document[];
}

// 会議クエリ
interface MeetingQueries {
  GetUpcomingMeetings(userId: UUID): Meeting[];
  GetMeetingDetails(id: UUID): Meeting;
  GetMeetingMinutes(id: UUID): Minutes;
  GetMeetingRecording(id: UUID): Recording;
}
```

## 9. 統合ポイント

### 他サービスとの連携

1. **プロジェクト管理サービス**
   - プロジェクトチャネルの自動作成
   - タスク更新の通知
   - ドキュメントのプロジェクト紐付け

2. **リソース管理サービス**
   - チームメンバーの自動追加
   - スキル情報の表示
   - 稼働状況の共有

3. **ナレッジ管理サービス**
   - ドキュメントのナレッジベース化
   - FAQ自動生成
   - ベストプラクティス共有

4. **通知サービス**
   - メンション通知
   - 会議リマインダー
   - 更新通知

## 10. パフォーマンス要件

### レスポンスタイム
- メッセージ投稿: < 100ms
- チャネル切り替え: < 200ms
- ドキュメント保存: < 500ms
- 検索結果表示: < 1s

### スループット
- 同時接続ユーザー: 10,000
- メッセージ/秒: 1,000
- 同時編集ドキュメント: 100

### 可用性
- システム稼働率: 99.9%
- データ耐久性: 99.999%
- バックアップ: 日次
- 災害復旧: RTO 4時間, RPO 1時間