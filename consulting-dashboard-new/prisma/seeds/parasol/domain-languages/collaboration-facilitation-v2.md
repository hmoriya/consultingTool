# パラソルドメイン言語: コラボレーション促進ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
チーム間のコミュニケーションを活性化し、情報共有とコラボレーションを促進するドメイン

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
EMAIL: メールアドレス形式（RFC5322準拠）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
URL: URL形式（RFC3986準拠）
JSON: JSON形式のデータ
```

### カスタム型定義
```
通知タイプ: 通知の種類 (基本型: ENUM)
  - system: システム通知
  - task: タスク関連
  - project: プロジェクト関連
  - message: メッセージ
  - reminder: リマインダー
  - alert: アラート
  - announcement: お知らせ

通知優先度: 通知の重要度 (基本型: ENUM)
  - urgent: 緊急
  - high: 高
  - normal: 通常
  - low: 低

通知ステータス: 通知の状態 (基本型: ENUM)
  - unread: 未読
  - read: 既読
  - archived: アーカイブ済み

チャンネルタイプ: チャンネルの種類 (基本型: ENUM)
  - public: パブリック
  - private: プライベート
  - project: プロジェクト
  - direct: ダイレクト
  - announcement: アナウンス

メッセージステータス: メッセージの状態 (基本型: ENUM)
  - sent: 送信済み
  - delivered: 配信済み
  - read: 既読
  - edited: 編集済み
  - deleted: 削除済み

配信方法: 通知の配信方法 (基本型: ENUM)
  - in_app: アプリ内
  - email: メール
  - sms: SMS
  - push: プッシュ通知
  - webhook: Webhook

リアクションタイプ: リアクションの種類 (基本型: ENUM)
  - like: いいね
  - thumbsup: 👍
  - clap: 拍手
  - heart: ハート
  - question: 疑問
  - check: 完了
```

## エンティティ（Entities）

### 通知 [Notification] [NOTIFICATION]
説明: システムからユーザーへの通知

属性:
- 通知ID [NotificationId] [NOTIFICATION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 通知の一意識別子
- 受信者リファレンス [RecipientRef] [RECIPIENT_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 通知の受信者
  - 関連: ユーザー [User] → 通知 [Notification]（1..*）
- 通知タイプ [Type] [TYPE]
  - 型: 通知タイプ [NotificationType] [NOTIFICATION_TYPE]
  - 説明: 通知の種類
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 通知のタイトル
- 本文 [Body] [BODY]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 通知の詳細内容
- 優先度 [Priority] [PRIORITY]
  - 型: 通知優先度 [NotificationPriority] [NOTIFICATION_PRIORITY]
  - 説明: 通知の重要度
- ステータス [Status] [STATUS]
  - 型: 通知ステータス [NotificationStatus] [NOTIFICATION_STATUS]
  - 説明: 通知の状態
- 送信日時 [SentAt] [SENT_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 通知が送信された日時
- 既読日時 [ReadAt] [READ_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 通知が既読になった日時
- 有効期限 [ExpiresAt] [EXPIRES_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 通知の有効期限
- 関連情報 [RelatedInfo] [RELATED_INFO]
  - 型: 関連情報 [RelatedInfo] [RELATED_INFO]（値オブジェクト）
  - 説明: 通知に関連するリソース情報
- 配信設定 [DeliverySettings] [DELIVERY_SETTINGS]
  - 型: 配信設定 [DeliverySettings] [DELIVERY_SETTINGS]（値オブジェクト）
  - 説明: 通知の配信方法と設定

不変条件:
- 既読日時は送信日時より後
- 有効期限は送信日時より後
- 優先度がurgentの場合は即座に配信

振る舞い:
- 既読にする [MarkAsRead] [MARK_AS_READ]
  - 目的: 通知を既読状態にする
  - 入力: なし
  - 出力: 更新結果
  - 事前条件: ステータス=未読
  - 事後条件: ステータス=既読、既読日時設定

#### ドメインイベント
- 通知送信済み [NotificationSent] [NOTIFICATION_SENT]：通知送信時
- 通知既読済み [NotificationRead] [NOTIFICATION_READ]：既読時

#### 集約ルート
このエンティティは通知集約のルートエンティティ

### チャンネル [Channel] [CHANNEL]
説明: コミュニケーションの場

属性:
- チャンネルID [ChannelId] [CHANNEL_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: チャンネルの一意識別子
- チャンネル名 [Name] [NAME]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: チャンネルの名前
- チャンネルタイプ [Type] [TYPE]
  - 型: チャンネルタイプ [ChannelType] [CHANNEL_TYPE]
  - 説明: チャンネルの種類
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: チャンネルの説明
- 作成者リファレンス [CreatorRef] [CREATOR_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: チャンネル作成者
  - 関連: ユーザー [User] → チャンネル [Channel]（1..*）
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 関連プロジェクト（プロジェクトチャンネルの場合）
  - 関連: プロジェクト [Project] → チャンネル [Channel]（1..1）
- チャンネルメンバー [ChannelMembers] [CHANNEL_MEMBERS]
  - 型: チャンネルメンバーの配列 [ChannelMember[]] [CHANNEL_MEMBER_ARRAY]（1..*）
  - 説明: チャンネルに参加するメンバー
  - 関連: チャンネル [Channel] *→ チャンネルメンバー [ChannelMember]（集約内包含）
- チャンネル設定 [Settings] [SETTINGS]
  - 型: チャンネル設定 [ChannelSettings] [CHANNEL_SETTINGS]（値オブジェクト）
  - 説明: チャンネルの各種設定
- 作成日時 [CreatedAt] [CREATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: チャンネル作成日時
- 最終活動日時 [LastActivityAt] [LAST_ACTIVITY_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 最後にメッセージが投稿された日時

不変条件:
- チャンネル名は一意（同一タイプ内）
- 最低1名のメンバーが必要
- プライベートチャンネルは招待制

振る舞い:
- メンバー追加 [AddMember] [ADD_MEMBER]
  - 目的: 新しいメンバーをチャンネルに追加
  - 入力: ユーザーID、役割
  - 出力: 追加結果
  - 事前条件: ユーザーが存在、権限あり
  - 事後条件: メンバー追加済み

### メッセージ [Message] [MESSAGE]
説明: チャンネル内でやり取りされるメッセージ

属性:
- メッセージID [MessageId] [MESSAGE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: メッセージの一意識別子
- チャンネルリファレンス [ChannelRef] [CHANNEL_REF]
  - 型: チャンネルID [ChannelId] [CHANNEL_ID]（参照）
  - 説明: 投稿先チャンネル
  - 関連: チャンネル [Channel] → メッセージ [Message]（1..*）
- 送信者リファレンス [SenderRef] [SENDER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: メッセージ送信者
  - 関連: ユーザー [User] → メッセージ [Message]（1..*）
- 本文 [Content] [CONTENT]
  - 型: MARKDOWN [MARKDOWN] [MARKDOWN]
  - 説明: メッセージ本文（Markdown形式）
- ステータス [Status] [STATUS]
  - 型: メッセージステータス [MessageStatus] [MESSAGE_STATUS]
  - 説明: メッセージの状態
- 返信先リファレンス [ReplyToRef] [REPLY_TO_REF]
  - 型: メッセージID [MessageId] [MESSAGE_ID]（参照）
  - 説明: スレッド返信の場合の親メッセージ
  - 関連: メッセージ [Message] → メッセージ [Message]（0..1）
- 添付ファイル [Attachments] [ATTACHMENTS]
  - 型: 添付ファイルの配列 [Attachment[]] [ATTACHMENT_ARRAY]（0..*）
  - 説明: メッセージに添付されたファイル
  - 関連: メッセージ [Message] *→ 添付ファイル [Attachment]（集約内包含）
- リアクション [Reactions] [REACTIONS]
  - 型: リアクションの配列 [Reaction[]] [REACTION_ARRAY]（0..*）
  - 説明: メッセージへのリアクション
  - 関連: メッセージ [Message] *→ リアクション [Reaction]（集約内包含）
- メンション情報 [MentionInfo] [MENTION_INFO]
  - 型: メンション情報 [MentionInfo] [MENTION_INFO]（値オブジェクト）
  - 説明: メンションされたユーザー情報
- 送信日時 [SentAt] [SENT_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: メッセージ送信日時
- 編集日時 [EditedAt] [EDITED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: メッセージ編集日時

不変条件:
- 編集は送信から24時間以内
- 削除されたメッセージは編集不可
- スレッド返信は同一チャンネル内のみ

振る舞い:
- メッセージ編集 [EditMessage] [EDIT_MESSAGE]
  - 目的: メッセージ内容を修正
  - 入力: 新しい本文
  - 出力: 編集結果
  - 事前条件: 送信者本人、24時間以内
  - 事後条件: 内容更新、編集日時設定

### チャンネルメンバー [ChannelMember] [CHANNEL_MEMBER]
説明: チャンネルに参加するメンバー

属性:
- メンバーID [MemberId] [MEMBER_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: チャンネルメンバーの一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 実際のユーザー
  - 関連: ユーザー [User] → チャンネルメンバー [ChannelMember]（1..*）
- 役割 [Role] [ROLE]
  - 型: STRING_50 [STRING_50] [STRING_50]
  - 説明: チャンネル内での役割（owner/admin/member）
- 参加日時 [JoinedAt] [JOINED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: チャンネル参加日時
- 通知設定 [NotificationPreference] [NOTIFICATION_PREFERENCE]
  - 型: 通知設定 [NotificationPreference] [NOTIFICATION_PREFERENCE]（値オブジェクト）
  - 説明: 個人の通知設定
- 最終既読日時 [LastReadAt] [LAST_READ_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 最後にメッセージを読んだ日時

### 添付ファイル [Attachment] [ATTACHMENT]
説明: メッセージに添付されるファイル

属性:
- 添付ファイルID [AttachmentId] [ATTACHMENT_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 添付ファイルの一意識別子
- ファイル名 [FileName] [FILE_NAME]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: ファイル名
- ファイルタイプ [FileType] [FILE_TYPE]
  - 型: STRING_50 [STRING_50] [STRING_50]
  - 説明: MIMEタイプ
- ファイルサイズ [FileSize] [FILE_SIZE]
  - 型: INTEGER [INTEGER] [INTEGER]
  - 説明: ファイルサイズ（バイト）
- ファイルURL [FileUrl] [FILE_URL]
  - 型: URL [URL] [URL]
  - 説明: ファイルの保存場所
- アップロード日時 [UploadedAt] [UPLOADED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: アップロード日時

### リアクション [Reaction] [REACTION]
説明: メッセージへのリアクション

属性:
- リアクションID [ReactionId] [REACTION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: リアクションの一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: リアクションしたユーザー
  - 関連: ユーザー [User] → リアクション [Reaction]（1..*）
- リアクションタイプ [Type] [TYPE]
  - 型: リアクションタイプ [ReactionType] [REACTION_TYPE]
  - 説明: リアクションの種類
- 作成日時 [CreatedAt] [CREATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: リアクションした日時

### 会議 [Meeting] [MEETING]
説明: オンライン会議やミーティング

属性:
- 会議ID [MeetingId] [MEETING_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 会議の一意識別子
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 会議のタイトル
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 会議の説明
- 主催者リファレンス [OrganizerRef] [ORGANIZER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 会議主催者
  - 関連: ユーザー [User] → 会議 [Meeting]（1..*）
- 会議日時 [MeetingTime] [MEETING_TIME]
  - 型: 会議時間 [MeetingTime] [MEETING_TIME]（値オブジェクト）
  - 説明: 会議の開始・終了時間
- 会議URL [MeetingUrl] [MEETING_URL]
  - 型: URL [URL] [URL]
  - 説明: オンライン会議のURL
- 参加者リスト [Participants] [PARTICIPANTS]
  - 型: 参加者情報 [ParticipantInfo] [PARTICIPANT_INFO]（値オブジェクト）
  - 説明: 会議参加者の情報
- 録画URL [RecordingUrl] [RECORDING_URL]
  - 型: URL [URL] [URL]
  - 説明: 会議録画のURL
- 議事録 [Minutes] [MINUTES]
  - 型: MARKDOWN [MARKDOWN] [MARKDOWN]
  - 説明: 会議の議事録

## 値オブジェクト（Value Objects）

### 関連情報 [RelatedInfo] [RELATED_INFO]
- 定義: 通知に関連するリソース情報
- 属性:
  - リソースタイプ [resourceType] [RESOURCE_TYPE]: STRING_50（project/task/message等）
  - リソースID [resourceId] [RESOURCE_ID]: UUID
  - リソースURL [resourceUrl] [RESOURCE_URL]: URL
- 制約: リソースタイプとIDは必須
- 使用エンティティ: 通知 [Notification]

### 配信設定 [DeliverySettings] [DELIVERY_SETTINGS]
- 定義: 通知の配信方法と設定
- 属性:
  - 配信方法 [methods] [METHODS]: 配信方法の配列
  - 即時配信 [immediate] [IMMEDIATE]: BOOLEAN
  - スケジュール [schedule] [SCHEDULE]: STRING_50
- 制約: 最低1つの配信方法
- 使用エンティティ: 通知 [Notification]

### チャンネル設定 [ChannelSettings] [CHANNEL_SETTINGS]
- 定義: チャンネルの各種設定
- 属性:
  - 通知設定 [notificationEnabled] [NOTIFICATION_ENABLED]: BOOLEAN
  - メンバー追加権限 [memberAddPermission] [MEMBER_ADD_PERMISSION]: STRING_50（owner/admin/member）
  - メッセージ削除権限 [messageDeletePermission] [MESSAGE_DELETE_PERMISSION]: STRING_50
  - アーカイブ済み [isArchived] [IS_ARCHIVED]: BOOLEAN
- 制約: 権限は役割に基づく
- 使用エンティティ: チャンネル [Channel]

### メンション情報 [MentionInfo] [MENTION_INFO]
- 定義: メッセージ内のメンション情報
- 属性:
  - メンションユーザー [mentionedUsers] [MENTIONED_USERS]: ユーザーIDの配列
  - 全員メンション [mentionAll] [MENTION_ALL]: BOOLEAN
  - チャンネルメンション [mentionChannel] [MENTION_CHANNEL]: BOOLEAN
- 制約: メンションは同一チャンネルメンバーのみ
- 使用エンティティ: メッセージ [Message]

### 通知設定 [NotificationPreference] [NOTIFICATION_PREFERENCE]
- 定義: 個人の通知設定
- 属性:
  - 全メッセージ通知 [allMessages] [ALL_MESSAGES]: BOOLEAN
  - メンション通知 [mentions] [MENTIONS]: BOOLEAN
  - スレッド通知 [threads] [THREADS]: BOOLEAN
  - ミュート [muted] [MUTED]: BOOLEAN
- 制約: ミュート時は全通知オフ
- 使用エンティティ: チャンネルメンバー [ChannelMember]

### 会議時間 [MeetingTime] [MEETING_TIME]
- 定義: 会議の時間情報
- 属性:
  - 開始日時 [startTime] [START_TIME]: TIMESTAMP
  - 終了日時 [endTime] [END_TIME]: TIMESTAMP
  - タイムゾーン [timezone] [TIMEZONE]: STRING_50
  - 繰り返し [recurrence] [RECURRENCE]: STRING_100
- 制約: 開始日時は終了日時より前
- 使用エンティティ: 会議 [Meeting]

### 参加者情報 [ParticipantInfo] [PARTICIPANT_INFO]
- 定義: 会議参加者の情報
- 属性:
  - 必須参加者 [required] [REQUIRED]: ユーザーIDの配列
  - 任意参加者 [optional] [OPTIONAL]: ユーザーIDの配列
  - 出席者 [attended] [ATTENDED]: ユーザーIDの配列
  - 欠席者 [absent] [ABSENT]: ユーザーIDの配列
- 制約: 必須参加者は最低1名
- 使用エンティティ: 会議 [Meeting]

## 集約（Aggregates）

### 通知集約 [NotificationAggregate] [NOTIFICATION_AGGREGATE]
- **集約ルート**: 通知 [Notification]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 関連情報 [RelatedInfo]：関連リソース情報
  - 配信設定 [DeliverySettings]：配信方法の設定
- **トランザクション境界**: 通知単独で完結
- **不変条件**: 
  - 既読後は内容変更不可
  - 有効期限切れは自動アーカイブ
- **外部参照ルール**:
  - 通知IDのみで参照
  - ユーザーIDを参照

### チャンネル集約 [ChannelAggregate] [CHANNEL_AGGREGATE]
- **集約ルート**: チャンネル [Channel]
- **含まれるエンティティ**: 
  - チャンネルメンバー [ChannelMember]：参加メンバー（1..*）
- **含まれる値オブジェクト**:
  - チャンネル設定 [ChannelSettings]：各種設定
  - 通知設定 [NotificationPreference]：個人の通知設定
- **トランザクション境界**: チャンネルとメンバーは同一トランザクション
- **不変条件**: 
  - チャンネル名は一意（同一タイプ内）
  - 最低1名のメンバー必要
  - ownerは最低1名必要
- **外部参照ルール**:
  - 集約外からはチャンネルIDのみで参照
  - メンバーへの直接アクセスは禁止

### メッセージ集約 [MessageAggregate] [MESSAGE_AGGREGATE]
- **集約ルート**: メッセージ [Message]
- **含まれるエンティティ**: 
  - 添付ファイル [Attachment]：添付ファイル（0..*）
  - リアクション [Reaction]：リアクション（0..*）
- **含まれる値オブジェクト**:
  - メンション情報 [MentionInfo]：メンション情報
- **トランザクション境界**: メッセージ、添付ファイル、リアクションは同一トランザクション
- **不変条件**: 
  - 削除後は編集不可
  - リアクションは1ユーザー1タイプ
  - 添付ファイルは10個まで
- **外部参照ルール**:
  - 集約外からはメッセージIDのみで参照
  - チャンネルIDとユーザーIDを参照

### 会議集約 [MeetingAggregate] [MEETING_AGGREGATE]
- **集約ルート**: 会議 [Meeting]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 会議時間 [MeetingTime]：時間情報
  - 参加者情報 [ParticipantInfo]：参加者リスト
- **トランザクション境界**: 会議単独で完結
- **不変条件**: 
  - 主催者は必須参加者
  - 開始時刻は将来
  - 会議時間は最大8時間
- **外部参照ルール**:
  - 会議IDで参照
  - ユーザーIDを参照

## ドメインサービス

### 通知配信サービス [NotificationDeliveryService] [NOTIFICATION_DELIVERY_SERVICE]
通知を適切な方法で配信するサービス

#### 提供機能
- 通知配信 [DeliverNotification] [DELIVER_NOTIFICATION]
  - 目的: ユーザー設定に基づいて通知を配信
  - 入力: 通知ID
  - 出力: 配信結果（成功/失敗、配信方法）
  - 制約: ユーザーの通知設定を尊重

- 一括通知 [BroadcastNotification] [BROADCAST_NOTIFICATION]
  - 目的: 複数ユーザーに同時通知
  - 入力: ユーザーIDリスト、通知内容
  - 出力: 配信結果リスト
  - 制約: 最大1000件まで

### メッセージ検索サービス [MessageSearchService] [MESSAGE_SEARCH_SERVICE]
メッセージを高速に検索するサービス

#### 提供機能
- 全文検索 [FullTextSearch] [FULL_TEXT_SEARCH]
  - 目的: メッセージ内容から関連メッセージを検索
  - 入力: 検索キーワード、チャンネルID（オプション）
  - 出力: メッセージリスト（関連度順）
  - 制約: アクセス権限のあるチャンネルのみ

- メンション検索 [FindMentions] [FIND_MENTIONS]
  - 目的: 自分宛のメンションを検索
  - 入力: ユーザーID、期間
  - 出力: メンション含むメッセージリスト
  - 制約: 本人のメンションのみ

### 会議スケジュールサービス [MeetingScheduleService] [MEETING_SCHEDULE_SERVICE]
会議のスケジューリングを支援するサービス

#### 提供機能
- 空き時間検索 [FindAvailableSlots] [FIND_AVAILABLE_SLOTS]
  - 目的: 参加者全員の空き時間を発見
  - 入力: 参加者リスト、希望期間、会議時間
  - 出力: 利用可能な時間枠リスト
  - 制約: 営業時間内のみ

- リマインダー送信 [SendReminders] [SEND_REMINDERS]
  - 目的: 会議開始前にリマインダーを送信
  - 入力: 会議ID、リマインダー時間
  - 出力: 送信結果
  - 制約: 会議開始24時間前から

## ドメインイベント

### 通知送信済み [NotificationSent] [NOTIFICATION_SENT]
- **発生タイミング**: 通知が送信された時
- **ペイロード**: 
  - 通知ID [notificationId]: UUID
  - 受信者ID [recipientId]: UUID
  - 通知タイプ [notificationType]: 通知タイプ
  - 送信日時 [sentAt]: TIMESTAMP

### 通知既読済み [NotificationRead] [NOTIFICATION_READ]
- **発生タイミング**: 通知が既読になった時
- **ペイロード**: 
  - 通知ID [notificationId]: UUID
  - 既読日時 [readAt]: TIMESTAMP

### チャンネル作成済み [ChannelCreated] [CHANNEL_CREATED]
- **発生タイミング**: 新しいチャンネルが作成された時
- **ペイロード**: 
  - チャンネルID [channelId]: UUID
  - チャンネル名 [channelName]: STRING_100
  - 作成者ID [creatorId]: UUID

### メッセージ投稿済み [MessagePosted] [MESSAGE_POSTED]
- **発生タイミング**: メッセージが投稿された時
- **ペイロード**: 
  - メッセージID [messageId]: UUID
  - チャンネルID [channelId]: UUID
  - 送信者ID [senderId]: UUID
  - メンションユーザー [mentionedUsers]: UUIDの配列

### メンバー参加済み [MemberJoined] [MEMBER_JOINED]
- **発生タイミング**: チャンネルに新メンバーが参加した時
- **ペイロード**: 
  - チャンネルID [channelId]: UUID
  - ユーザーID [userId]: UUID
  - 参加日時 [joinedAt]: TIMESTAMP

### 会議予定済み [MeetingScheduled] [MEETING_SCHEDULED]
- **発生タイミング**: 会議が予定された時
- **ペイロード**: 
  - 会議ID [meetingId]: UUID
  - 主催者ID [organizerId]: UUID
  - 開始日時 [startTime]: TIMESTAMP
  - 参加者 [participants]: UUIDの配列

## ビジネスルール

### 通知管理ルール
1. **通知の優先度**: 
   - urgent: 即座に全配信方法で通知
   - high: 5分以内に配信
   - normal: 次回アプリ起動時
   - low: ダイジェストに含める
2. **通知の集約**: 
   - 同一タイプは5分間で集約
   - 最大10件まで集約
3. **有効期限**: 
   - システム通知: 30日
   - タスク通知: タスク期限まで
   - お知らせ: 90日

### チャンネル管理ルール
1. **チャンネル名**: 
   - 長さ: 3-100文字
   - 特殊文字: 使用不可
   - 重複: 同一タイプ内で禁止
2. **メンバー管理**: 
   - 最大メンバー数: 1000名
   - 最小メンバー数: 1名（owner）
   - 招待権限: owner/adminのみ
3. **アーカイブ**: 
   - 90日間活動なしで自動提案
   - アーカイブ後も履歴は保持
   - 復元は30日以内

### メッセージ管理ルール
1. **メッセージサイズ**: 
   - 本文: 最大10,000文字
   - 添付ファイル: 1個最大100MB
   - 添付ファイル数: 最大10個
2. **編集・削除**: 
   - 編集: 送信から24時間以内
   - 削除: いつでも可（履歴は保持）
   - 編集履歴: 全て記録
3. **スレッド**: 
   - 最大深度: 1（返信のみ）
   - スレッド内返信数: 無制限

### 会議管理ルール
1. **会議時間**: 
   - 最短: 15分
   - 最長: 8時間
   - バッファ: 前後5分
2. **参加者**: 
   - 最大: 100名
   - 必須参加者: 最低1名
3. **録画**: 
   - 保存期間: 90日
   - アクセス: 参加者のみ

### エラーパターン
- 4001: 通知配信失敗エラー
- 4002: チャンネル権限エラー
- 4003: メッセージサイズ超過エラー
- 4004: メンバー数上限エラー
- 4005: 会議時間競合エラー

## リポジトリインターフェース

### 通知リポジトリ [NotificationRepository] [NOTIFICATION_REPOSITORY]
集約: 通知集約 [NotificationAggregate]

基本操作:
- findById(id: UUID): 通知 [Notification]
- save(notification: 通知): void
- delete(id: UUID): void

検索操作:
- findByUserId(userId: UUID): 通知[]
- findUnreadByUserId(userId: UUID): 通知[]
- findByDateRange(userId: UUID, from: DATE, to: DATE): 通知[]

### チャンネルリポジトリ [ChannelRepository] [CHANNEL_REPOSITORY]
集約: チャンネル集約 [ChannelAggregate]

基本操作:
- findById(id: UUID): チャンネル [Channel]
- save(channel: チャンネル): void
- delete(id: UUID): void

検索操作:
- findByName(name: STRING_100): チャンネル
- findByUserId(userId: UUID): チャンネル[]
- findByProjectId(projectId: UUID): チャンネル[]
- findActiveChannels(): チャンネル[]

### メッセージリポジトリ [MessageRepository] [MESSAGE_REPOSITORY]
集約: メッセージ集約 [MessageAggregate]

基本操作:
- findById(id: UUID): メッセージ [Message]
- save(message: メッセージ): void

検索操作:
- findByChannelId(channelId: UUID): メッセージ[]
- findByUserId(userId: UUID): メッセージ[]
- searchByKeyword(keyword: STRING_255): メッセージ[]
- findThreadMessages(parentId: UUID): メッセージ[]

### 会議リポジトリ [MeetingRepository] [MEETING_REPOSITORY]
集約: 会議集約 [MeetingAggregate]

基本操作:
- findById(id: UUID): 会議 [Meeting]
- save(meeting: 会議): void
- delete(id: UUID): void

検索操作:
- findByOrganizerId(userId: UUID): 会議[]
- findByParticipantId(userId: UUID): 会議[]
- findByDateRange(from: TIMESTAMP, to: TIMESTAMP): 会議[]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む
- [x] 必ず何らかの集約に属している

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] すべてのエンティティを包含している
- [x] 外部からのアクセスは集約ルート経由のみ