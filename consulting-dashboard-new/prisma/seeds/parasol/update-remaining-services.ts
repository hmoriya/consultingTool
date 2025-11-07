/**
 * 残りのサービスのドメイン言語を更新し、集約を必須にする
 */

import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const prisma = new ParasolPrismaClient()

/**
 * 生産性可視化サービスのドメイン言語
 */
function generateProductivityVisualizationDomainLanguage(): string {
  return `# パラソルドメイン言語: 工数管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
プロジェクトの工数を正確に記録し、生産性を可視化することで改善を促進するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIME: 時間（HH:MM形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
\`\`\`

### カスタム型定義
\`\`\`
タイムシートステータス: タイムシートの状態 (基本型: ENUM)
  - draft: 下書き
  - submitted: 提出済み
  - approved: 承認済み
  - rejected: 却下
  - revised: 修正中

作業カテゴリ: 作業の分類 (基本型: ENUM)
  - development: 開発
  - design: 設計
  - meeting: 会議
  - documentation: ドキュメント作成
  - review: レビュー
  - support: サポート
  - training: 研修
  - other: その他
\`\`\`

## エンティティ（Entities）

### タイムシート [Timesheet] [TIMESHEET]
一定期間の工数記録をまとめた申請単位を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | タイムシートの一意識別子 |
| メンバーID | memberId | MEMBER_ID | UUID | ○ | タイムシートの作成者 |
| 期間開始日 | startDate | START_DATE | DATE | ○ | 記録期間の開始日 |
| 期間終了日 | endDate | END_DATE | DATE | ○ | 記録期間の終了日 |
| ステータス | status | STATUS | タイムシートステータス | ○ | タイムシートの状態 |
| 合計時間 | totalHours | TOTAL_HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | ○ | 期間内の合計作業時間 |
| 提出日 | submittedAt | SUBMITTED_AT | TIMESTAMP | - | タイムシート提出日時 |
| 承認者ID | approverId | APPROVER_ID | UUID | - | タイムシート承認者 |
| 承認日 | approvedAt | APPROVED_AT | TIMESTAMP | - | タイムシート承認日時 |
| コメント | comments | COMMENTS | TEXT | - | 申請者コメント |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- タイムシートは週単位または月単位で作成
- 承認済みタイムシートは編集不可
- 合計時間は工数エントリーの合計と一致

#### ドメインイベント
- タイムシート提出済み [TimesheetSubmitted] [TIMESHEET_SUBMITTED]：タイムシートが提出された時
- タイムシート承認済み [TimesheetApproved] [TIMESHEET_APPROVED]：タイムシートが承認された時
- タイムシート却下済み [TimesheetRejected] [TIMESHEET_REJECTED]：タイムシートが却下された時

#### 集約ルート
TimesheetAggregate集約のルートエンティティ

### 工数エントリー [TimeEntry] [TIME_ENTRY]
個別の作業時間記録を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 工数エントリーの一意識別子 |
| タイムシートID | timesheetId | TIMESHEET_ID | UUID | ○ | 所属タイムシートへの参照 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 作業対象プロジェクト |
| タスクID | taskId | TASK_ID | UUID | - | 作業対象タスク |
| 作業日 | workDate | WORK_DATE | DATE | ○ | 作業実施日 |
| 開始時刻 | startTime | START_TIME | TIME | - | 作業開始時刻 |
| 終了時刻 | endTime | END_TIME | TIME | - | 作業終了時刻 |
| 作業時間 | hours | HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | ○ | 作業時間 |
| カテゴリ | category | CATEGORY | 作業カテゴリ | ○ | 作業の分類 |
| 説明 | description | DESCRIPTION | TEXT | ○ | 作業内容の説明 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 1日の作業時間は24時間以内
- 承認済みタイムシートの工数エントリーは編集不可
- 作業日はタイムシートの期間内

### 稼働率 [UtilizationRate] [UTILIZATION_RATE_ENTITY]
メンバーの稼働率を管理するエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 稼働率記録の一意識別子 |
| メンバーID | memberId | MEMBER_ID | UUID | ○ | 対象メンバー |
| 年月 | yearMonth | YEAR_MONTH | YearMonth [YearMonth] [YEAR_MONTH]（値オブジェクト） | ○ | 対象年月 |
| 稼働可能時間 | availableHours | AVAILABLE_HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | ○ | 月間稼働可能時間 |
| 実稼働時間 | actualHours | ACTUAL_HOURS | WorkHours [WorkHours] [WORK_HOURS]（値オブジェクト） | ○ | 実際の稼働時間 |
| 稼働率 | rate | RATE | UtilizationPercentage [UtilizationPercentage] [UTILIZATION_PERCENTAGE]（値オブジェクト） | ○ | 稼働率（％） |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 稼働率は実稼働時間÷稼働可能時間×100で計算
- 稼働率は0-120%の範囲（一時的な超過を許容）

#### 集約ルート
UtilizationAggregate集約のルートエンティティ

## 値オブジェクト（Value Objects）

### 作業時間 [WorkHours] [WORK_HOURS]
- **時間** [hours] [HOURS]: DECIMAL
- **ビジネスルール**
  - 0以上24以下
  - 0.25時間（15分）単位

### 年月 [YearMonth] [YEAR_MONTH]
- **年** [year] [YEAR]: INTEGER
- **月** [month] [MONTH]: INTEGER
- **ビジネスルール**
  - 年は2000以上
  - 月は1-12の範囲

### 稼働率パーセンテージ [UtilizationPercentage] [UTILIZATION_PERCENTAGE]
- **値** [value] [VALUE]: DECIMAL
- **ビジネスルール**
  - 0-120の範囲
  - 小数点第1位まで

## 集約（Aggregates）

### タイムシート集約 [TimesheetAggregate] [TIMESHEET_AGGREGATE]
- **集約ルート**: タイムシート [Timesheet]
- **含まれるエンティティ**: 
  - 工数エントリー [TimeEntry]：タイムシートの工数記録（0..*）
- **含まれる値オブジェクト**:
  - 作業時間 [WorkHours]：合計時間と個別時間で使用
- **トランザクション境界**: タイムシートと工数エントリーは同一トランザクションで処理
- **不変条件**: 
  - タイムシートの合計時間は工数エントリーの合計と一致
  - 承認済みタイムシートは変更不可
- **外部参照ルール**:
  - 集約外からはタイムシートIDのみで参照
  - 工数エントリーへの直接アクセスは禁止

### 稼働率集約 [UtilizationAggregate] [UTILIZATION_AGGREGATE]
- **集約ルート**: 稼働率 [UtilizationRate]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - 年月 [YearMonth]：対象期間として使用
  - 作業時間 [WorkHours]：稼働可能/実稼働時間で使用
  - 稼働率パーセンテージ [UtilizationPercentage]：稼働率として使用
- **トランザクション境界**: 稼働率単体で処理
- **不変条件**: 
  - メンバーと年月の組み合わせは一意
  - 稼働率は計算値と一致
- **外部参照ルール**:
  - 集約外からは稼働率IDのみで参照

## ドメインサービス

### 工数集計サービス [TimeAggregationService] [TIME_AGGREGATION_SERVICE]
工数データの集計・分析を行うドメインサービス

#### 提供機能
- プロジェクト工数集計 [aggregateProjectTime] [AGGREGATE_PROJECT_TIME]
  - 目的: プロジェクト単位での工数を集計
  - 入力: プロジェクトID、期間
  - 出力: 集計結果
  - 制約: 承認済みタイムシートのみ対象

- 稼働率計算 [calculateUtilization] [CALCULATE_UTILIZATION]
  - 目的: メンバーの稼働率を計算
  - 入力: メンバーID、年月
  - 出力: 稼働率
  - 制約: 稼働可能時間が設定されていること

## ドメインイベント

### タイムシート提出済み [TimesheetSubmitted] [TIMESHEET_SUBMITTED]
- **発生タイミング**: タイムシートが提出された時
- **ペイロード**: 
  - タイムシートID [timesheetId] [TIMESHEET_ID]: UUID
  - メンバーID [memberId] [MEMBER_ID]: UUID
  - 期間 [period] [PERIOD]: JSON
  - 提出日時 [submittedAt] [SUBMITTED_AT]: TIMESTAMP

## ビジネスルール

### 工数記録ルール
1. **日次上限**: 1日の作業時間は24時間以内
   - 適用エンティティ: 工数エントリー [TimeEntry]
2. **期間整合性**: 工数エントリーの作業日はタイムシート期間内
   - 適用集約: タイムシート集約 [TimesheetAggregate]

### 承認ルール
1. **編集制限**: 承認済みタイムシートは編集不可
   - 適用エンティティ: タイムシート [Timesheet]
2. **承認者制限**: 自己承認は禁止
   - 適用エンティティ: タイムシート [Timesheet]

### エラーパターン
- 1301: 日次作業時間超過
- 1302: 期間外の工数エントリー
- 1303: 承認済みタイムシートの編集
- 2301: 必須項目未入力
- 3301: 外部システム連携エラー

## リポジトリインターフェース

### タイムシートリポジトリ [TimesheetRepository] [TIMESHEET_REPOSITORY]
集約: タイムシート集約 [TimesheetAggregate]

基本操作:
- findById(id: UUID): タイムシート [Timesheet]
- save(timesheet: タイムシート): void
- delete(id: UUID): void

検索操作:
- findByMemberAndPeriod(memberId: UUID, startDate: DATE, endDate: DATE): タイムシート[]
- findPendingApprovals(approverId: UUID): タイムシート[]

### 稼働率リポジトリ [UtilizationRepository] [UTILIZATION_REPOSITORY]
集約: 稼働率集約 [UtilizationAggregate]

基本操作:
- findById(id: UUID): 稼働率 [UtilizationRate]
- save(utilization: 稼働率): void

検索操作:
- findByMemberAndMonth(memberId: UUID, yearMonth: YearMonth): 稼働率
- findByMonth(yearMonth: YearMonth): 稼働率[]

## リレーションシップ一覧

### エンティティ間の関連
- タイムシート [Timesheet] *→ 工数エントリー [TimeEntry]（1..*）：タイムシートは複数の工数エントリーを持つ（集約内包含）

### 値オブジェクトの使用
- タイムシート [Timesheet] 使用 WorkHours [WorkHours]：合計時間として
- 工数エントリー [TimeEntry] 使用 WorkHours [WorkHours]：作業時間として
- 稼働率 [UtilizationRate] 使用 YearMonth [YearMonth]：対象期間として
- 稼働率 [UtilizationRate] 使用 WorkHours [WorkHours]：稼働時間として
- 稼働率 [UtilizationRate] 使用 UtilizationPercentage [UtilizationPercentage]：稼働率として

### 集約境界
- タイムシート集約 [TimesheetAggregate]：タイムシート [Timesheet]、工数エントリー [TimeEntry]
- 稼働率集約 [UtilizationAggregate]：稼働率 [UtilizationRate]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * コラボレーション促進サービスのドメイン言語
 */
function generateCollaborationFacilitationDomainLanguage(): string {
  return `# パラソルドメイン言語: 通知・コミュニケーションドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
プロジェクトチームのコミュニケーションを促進し、重要な情報を適時に届けるドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
TIMESTAMP: 日時（ISO8601形式）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
通知タイプ: 通知の種類 (基本型: ENUM)
  - system: システム通知
  - task: タスク通知
  - mention: メンション通知
  - approval: 承認依頼
  - deadline: 期限通知
  - announcement: お知らせ

メッセージタイプ: メッセージの種類 (基本型: ENUM)
  - text: テキストメッセージ
  - file: ファイル添付
  - system: システムメッセージ

優先度: メッセージの優先度 (基本型: ENUM)
  - urgent: 緊急
  - high: 高
  - normal: 通常
  - low: 低
\`\`\`

## エンティティ（Entities）

### 通知 [Notification] [NOTIFICATION]
ユーザーに送信される通知を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 通知の一意識別子 |
| 受信者ID | recipientId | RECIPIENT_ID | UUID | ○ | 通知の受信者 |
| タイプ | type | TYPE | 通知タイプ | ○ | 通知の種類 |
| タイトル | title | TITLE | NotificationTitle [NotificationTitle] [NOTIFICATION_TITLE]（値オブジェクト） | ○ | 通知のタイトル |
| 本文 | body | BODY | NotificationBody [NotificationBody] [NOTIFICATION_BODY]（値オブジェクト） | ○ | 通知の内容 |
| リンク | link | LINK | NotificationLink [NotificationLink] [NOTIFICATION_LINK]（値オブジェクト） | - | 関連リソースへのリンク |
| 既読フラグ | isRead | IS_READ | BOOLEAN | ○ | 既読状態 |
| 既読日時 | readAt | READ_AT | TIMESTAMP | - | 既読にした日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | 通知作成日時 |

#### ビジネスルール
- 通知は削除不可（既読にするのみ）
- 30日以上前の既読通知は自動アーカイブ
- 重要な通知は未読のまま7日経過で再通知

#### ドメインイベント
- 通知送信済み [NotificationSent] [NOTIFICATION_SENT]：通知が送信された時
- 通知既読済み [NotificationRead] [NOTIFICATION_READ]：通知が既読になった時

#### 集約ルート
NotificationAggregate集約のルートエンティティ

### メッセージ [Message] [MESSAGE]
チーム内でやり取りされるメッセージを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | メッセージの一意識別子 |
| チャンネルID | channelId | CHANNEL_ID | UUID | ○ | 所属チャンネル |
| 送信者ID | senderId | SENDER_ID | UUID | ○ | メッセージ送信者 |
| タイプ | type | TYPE | メッセージタイプ | ○ | メッセージの種類 |
| 内容 | content | CONTENT | MessageContent [MessageContent] [MESSAGE_CONTENT]（値オブジェクト） | ○ | メッセージ内容 |
| 優先度 | priority | PRIORITY | 優先度 | ○ | メッセージの優先度 |
| 編集済みフラグ | isEdited | IS_EDITED | BOOLEAN | ○ | 編集されたかどうか |
| 編集日時 | editedAt | EDITED_AT | TIMESTAMP | - | 最終編集日時 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | メッセージ作成日時 |

#### ビジネスルール
- メッセージは送信者のみ編集可能
- 編集は24時間以内のみ可能
- 削除はソフトデリート（表示上のみ）

### チャンネル [Channel] [CHANNEL]
メッセージをやり取りする場を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | チャンネルの一意識別子 |
| チャンネル名 | name | NAME | ChannelName [ChannelName] [CHANNEL_NAME]（値オブジェクト） | ○ | チャンネルの名称 |
| 説明 | description | DESCRIPTION | TEXT | - | チャンネルの説明 |
| プロジェクトID | projectId | PROJECT_ID | UUID | - | 関連プロジェクト |
| プライベートフラグ | isPrivate | IS_PRIVATE | BOOLEAN | ○ | プライベートチャンネルかどうか |
| アーカイブフラグ | isArchived | IS_ARCHIVED | BOOLEAN | ○ | アーカイブ済みかどうか |
| 作成者ID | createdBy | CREATED_BY | UUID | ○ | チャンネル作成者 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | チャンネル作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | チャンネル更新日時 |

#### ビジネスルール
- チャンネル名は一意（プロジェクト内）
- アーカイブ済みチャンネルは投稿不可
- プライベートチャンネルは招待制

#### 集約ルート
ChannelAggregate集約のルートエンティティ

### チャンネルメンバー [ChannelMember] [CHANNEL_MEMBER]
チャンネルへの参加者を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | メンバーシップの一意識別子 |
| チャンネルID | channelId | CHANNEL_ID | UUID | ○ | 所属チャンネル |
| メンバーID | memberId | MEMBER_ID | UUID | ○ | チャンネルメンバー |
| ロール | role | ROLE | ChannelRole [ChannelRole] [CHANNEL_ROLE]（値オブジェクト） | ○ | チャンネル内での役割 |
| 通知設定 | notificationSettings | NOTIFICATION_SETTINGS | NotificationSettings [NotificationSettings] [NOTIFICATION_SETTINGS]（値オブジェクト） | ○ | 個別通知設定 |
| 参加日時 | joinedAt | JOINED_AT | TIMESTAMP | ○ | チャンネル参加日時 |

#### ビジネスルール
- チャンネルとメンバーの組み合わせは一意
- オーナーは最低1名必要
- 最後のオーナーは退出不可

## 値オブジェクト（Value Objects）

### 通知タイトル [NotificationTitle] [NOTIFICATION_TITLE]
- **値** [value] [VALUE]: STRING_100
- **ビジネスルール**
  - 空文字不可
  - 絵文字使用可

### 通知本文 [NotificationBody] [NOTIFICATION_BODY]
- **値** [value] [VALUE]: TEXT
- **ビジネスルール**
  - Markdown形式対応
  - メンション記法対応（@username）

### 通知リンク [NotificationLink] [NOTIFICATION_LINK]
- **URL** [url] [URL]: STRING_255
- **ラベル** [label] [LABEL]: STRING_50
- **ビジネスルール**
  - 有効なURL形式
  - 内部リンクのみ許可

### メッセージ内容 [MessageContent] [MESSAGE_CONTENT]
- **テキスト** [text] [TEXT]: TEXT
- **添付ファイル** [attachments] [ATTACHMENTS]: JSON
- **ビジネスルール**
  - テキストは65536文字以内
  - 添付ファイルは10個まで

### チャンネル名 [ChannelName] [CHANNEL_NAME]
- **値** [value] [VALUE]: STRING_50
- **ビジネスルール**
  - 英数字、ハイフン、アンダースコアのみ
  - 3文字以上

### チャンネルロール [ChannelRole] [CHANNEL_ROLE]
- **ロール** [role] [ROLE]: ENUM
- **ビジネスルール**
  - owner: オーナー
  - admin: 管理者
  - member: メンバー

### 通知設定 [NotificationSettings] [NOTIFICATION_SETTINGS]
- **全通知** [all] [ALL]: BOOLEAN
- **メンションのみ** [mentionsOnly] [MENTIONS_ONLY]: BOOLEAN
- **ミュート** [muted] [MUTED]: BOOLEAN
- **ビジネスルール**
  - 設定は相互排他的

## 集約（Aggregates）

### 通知集約 [NotificationAggregate] [NOTIFICATION_AGGREGATE]
- **集約ルート**: 通知 [Notification]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - 通知タイトル [NotificationTitle]：タイトルとして使用
  - 通知本文 [NotificationBody]：本文として使用
  - 通知リンク [NotificationLink]：リンクとして使用
- **トランザクション境界**: 通知単体で処理
- **不変条件**: 
  - 通知は削除不可
  - 既読フラグは不可逆（既読→未読は不可）
- **外部参照ルール**:
  - 集約外からは通知IDのみで参照

### チャンネル集約 [ChannelAggregate] [CHANNEL_AGGREGATE]
- **集約ルート**: チャンネル [Channel]
- **含まれるエンティティ**: 
  - チャンネルメンバー [ChannelMember]：チャンネルの参加者（1..*）
  - メッセージ [Message]：チャンネル内のメッセージ（0..*）
- **含まれる値オブジェクト**:
  - チャンネル名 [ChannelName]：名称として使用
  - メッセージ内容 [MessageContent]：メッセージで使用
  - チャンネルロール [ChannelRole]：メンバーの役割として使用
  - 通知設定 [NotificationSettings]：メンバーの通知設定として使用
- **トランザクション境界**: チャンネルとメンバーシップは同一トランザクション
- **不変条件**: 
  - チャンネル名は一意
  - オーナーは最低1名
  - アーカイブ済みチャンネルは変更不可
- **外部参照ルール**:
  - 集約外からはチャンネルIDのみで参照
  - メッセージへの直接アクセスは禁止

## ドメインサービス

### 通知配信サービス [NotificationDeliveryService] [NOTIFICATION_DELIVERY_SERVICE]
通知の配信と管理を行うドメインサービス

#### 提供機能
- 通知送信 [sendNotification] [SEND_NOTIFICATION]
  - 目的: 対象ユーザーに通知を送信
  - 入力: 受信者ID、通知タイプ、内容
  - 出力: 送信結果
  - 制約: 受信者の通知設定に従う

- 一括既読 [markAllAsRead] [MARK_ALL_AS_READ]
  - 目的: ユーザーの全通知を既読にする
  - 入力: ユーザーID
  - 出力: 更新件数
  - 制約: 未読通知のみ対象

### メンション解析サービス [MentionAnalysisService] [MENTION_ANALYSIS_SERVICE]
メッセージ内のメンション記法を解析するドメインサービス

#### 提供機能
- メンション抽出 [extractMentions] [EXTRACT_MENTIONS]
  - 目的: テキストからメンションを抽出
  - 入力: メッセージテキスト
  - 出力: メンションされたユーザーIDリスト
  - 制約: @username形式のみ対応

## ドメインイベント

### 通知送信済み [NotificationSent] [NOTIFICATION_SENT]
- **発生タイミング**: 通知が送信された時
- **ペイロード**: 
  - 通知ID [notificationId] [NOTIFICATION_ID]: UUID
  - 受信者ID [recipientId] [RECIPIENT_ID]: UUID
  - 通知タイプ [type] [TYPE]: 通知タイプ
  - 送信日時 [sentAt] [SENT_AT]: TIMESTAMP

### メッセージ投稿済み [MessagePosted] [MESSAGE_POSTED]
- **発生タイミング**: メッセージが投稿された時
- **ペイロード**: 
  - メッセージID [messageId] [MESSAGE_ID]: UUID
  - チャンネルID [channelId] [CHANNEL_ID]: UUID
  - 送信者ID [senderId] [SENDER_ID]: UUID
  - 投稿日時 [postedAt] [POSTED_AT]: TIMESTAMP

## ビジネスルール

### 通知ルール
1. **自動アーカイブ**: 30日以上前の既読通知は自動アーカイブ
   - 適用エンティティ: 通知 [Notification]
2. **再通知**: 重要通知は7日未読で再通知
   - 適用エンティティ: 通知 [Notification]

### メッセージルール
1. **編集制限**: メッセージは24時間以内のみ編集可能
   - 適用エンティティ: メッセージ [Message]
2. **送信者制限**: 自分のメッセージのみ編集・削除可能
   - 適用エンティティ: メッセージ [Message]

### チャンネルルール
1. **名前一意性**: プロジェクト内でチャンネル名は一意
   - 適用集約: チャンネル集約 [ChannelAggregate]
2. **オーナー必須**: 各チャンネルには最低1名のオーナーが必要
   - 適用エンティティ: チャンネルメンバー [ChannelMember]

### エラーパターン
- 1401: チャンネル名重複
- 1402: 最後のオーナー削除
- 1403: アーカイブ済みチャンネルへの投稿
- 2401: 必須項目未入力
- 3401: 通知配信失敗

## リポジトリインターフェース

### 通知リポジトリ [NotificationRepository] [NOTIFICATION_REPOSITORY]
集約: 通知集約 [NotificationAggregate]

基本操作:
- findById(id: UUID): 通知 [Notification]
- save(notification: 通知): void
- delete(id: UUID): void

検索操作:
- findByRecipient(recipientId: UUID): 通知[]
- findUnreadByRecipient(recipientId: UUID): 通知[]

### チャンネルリポジトリ [ChannelRepository] [CHANNEL_REPOSITORY]
集約: チャンネル集約 [ChannelAggregate]

基本操作:
- findById(id: UUID): チャンネル [Channel]
- save(channel: チャンネル): void
- delete(id: UUID): void

検索操作:
- findByProject(projectId: UUID): チャンネル[]
- findByMember(memberId: UUID): チャンネル[]

## リレーションシップ一覧

### エンティティ間の関連
- チャンネル [Channel] *→ チャンネルメンバー [ChannelMember]（1..*）：チャンネルは複数のメンバーを持つ（集約内包含）
- チャンネル [Channel] *→ メッセージ [Message]（0..*）：チャンネルは複数のメッセージを持つ（集約内包含）

### 値オブジェクトの使用
- 通知 [Notification] 使用 NotificationTitle [NotificationTitle]：タイトルとして
- 通知 [Notification] 使用 NotificationBody [NotificationBody]：本文として
- 通知 [Notification] 使用 NotificationLink [NotificationLink]：リンクとして
- メッセージ [Message] 使用 MessageContent [MessageContent]：内容として
- チャンネル [Channel] 使用 ChannelName [ChannelName]：名称として
- チャンネルメンバー [ChannelMember] 使用 ChannelRole [ChannelRole]：役割として
- チャンネルメンバー [ChannelMember] 使用 NotificationSettings [NotificationSettings]：通知設定として

### 集約境界
- 通知集約 [NotificationAggregate]：通知 [Notification]
- チャンネル集約 [ChannelAggregate]：チャンネル [Channel]、チャンネルメンバー [ChannelMember]、メッセージ [Message]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * ナレッジ共創サービスのドメイン言語
 */
function generateKnowledgeCocreationDomainLanguage(): string {
  return `# パラソルドメイン言語: ナレッジ管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
プロジェクトで得られた知識・ノウハウを組織の資産として蓄積、共有、活用するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
ナレッジタイプ: ナレッジの種類 (基本型: ENUM)
  - lesson_learned: 教訓
  - best_practice: ベストプラクティス
  - case_study: 事例研究
  - template: テンプレート
  - guideline: ガイドライン
  - tips: ティップス

公開範囲: ナレッジの公開範囲 (基本型: ENUM)
  - public: 全体公開
  - organization: 組織内限定
  - project: プロジェクト限定
  - private: 非公開

承認ステータス: ナレッジの承認状態 (基本型: ENUM)
  - draft: 下書き
  - review: レビュー中
  - approved: 承認済み
  - rejected: 却下
  - archived: アーカイブ
\`\`\`

## エンティティ（Entities）

### ナレッジ記事 [KnowledgeArticle] [KNOWLEDGE_ARTICLE]
組織の知識・ノウハウを文書化したものを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | ナレッジ記事の一意識別子 |
| タイトル | title | TITLE | ArticleTitle [ArticleTitle] [ARTICLE_TITLE]（値オブジェクト） | ○ | 記事のタイトル |
| 内容 | content | CONTENT | ArticleContent [ArticleContent] [ARTICLE_CONTENT]（値オブジェクト） | ○ | 記事の本文 |
| 要約 | summary | SUMMARY | ArticleSummary [ArticleSummary] [ARTICLE_SUMMARY]（値オブジェクト） | ○ | 記事の要約 |
| タイプ | type | TYPE | ナレッジタイプ | ○ | ナレッジの種類 |
| カテゴリ | categories | CATEGORIES | CategoryList [CategoryList] [CATEGORY_LIST]（値オブジェクト） | ○ | 記事のカテゴリ |
| タグ | tags | TAGS | TagList [TagList] [TAG_LIST]（値オブジェクト） | - | 検索用タグ |
| 作成者ID | authorId | AUTHOR_ID | UUID | ○ | 記事作成者 |
| 公開範囲 | visibility | VISIBILITY | 公開範囲 | ○ | 記事の公開範囲 |
| ステータス | status | STATUS | 承認ステータス | ○ | 記事の承認状態 |
| プロジェクトID | projectId | PROJECT_ID | UUID | - | 関連プロジェクト |
| 公開日 | publishedAt | PUBLISHED_AT | TIMESTAMP | - | 記事公開日時 |
| 閲覧数 | viewCount | VIEW_COUNT | INTEGER | ○ | 累計閲覧数 |
| 評価スコア | rating | RATING | Rating [Rating] [RATING]（値オブジェクト） | ○ | 記事の評価 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- タイトルは組織内で一意
- 承認済み記事のみ公開可能
- アーカイブ済み記事は編集不可
- 公開範囲は記事のタイプに応じて制限

#### ドメインイベント
- ナレッジ公開済み [KnowledgePublished] [KNOWLEDGE_PUBLISHED]：ナレッジが公開された時
- ナレッジ更新済み [KnowledgeUpdated] [KNOWLEDGE_UPDATED]：ナレッジが更新された時
- ナレッジ評価済み [KnowledgeRated] [KNOWLEDGE_RATED]：ナレッジが評価された時

#### 集約ルート
KnowledgeAggregate集約のルートエンティティ

### レビュー [Review] [REVIEW]
ナレッジ記事に対するレビューを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | レビューの一意識別子 |
| 記事ID | articleId | ARTICLE_ID | UUID | ○ | レビュー対象の記事 |
| レビュアーID | reviewerId | REVIEWER_ID | UUID | ○ | レビュー実施者 |
| 評価 | rating | RATING | INTEGER | ○ | 5段階評価（1-5） |
| コメント | comment | COMMENT | ReviewComment [ReviewComment] [REVIEW_COMMENT]（値オブジェクト） | - | レビューコメント |
| 有用性 | usefulness | USEFULNESS | INTEGER | ○ | 有用性投票数 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レビュー作成日時 |

#### ビジネスルール
- 1記事に対して1ユーザー1レビューのみ
- 自分の記事はレビュー不可
- レビューは削除不可（更新のみ）

### ナレッジテンプレート [KnowledgeTemplate] [KNOWLEDGE_TEMPLATE]
ナレッジ作成の雛形を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | テンプレートの一意識別子 |
| テンプレート名 | name | NAME | TemplateName [TemplateName] [TEMPLATE_NAME]（値オブジェクト） | ○ | テンプレートの名称 |
| 説明 | description | DESCRIPTION | TEXT | ○ | テンプレートの説明 |
| タイプ | type | TYPE | ナレッジタイプ | ○ | 対応するナレッジタイプ |
| 構造 | structure | STRUCTURE | TemplateStructure [TemplateStructure] [TEMPLATE_STRUCTURE]（値オブジェクト） | ○ | テンプレートの構造定義 |
| サンプル | sample | SAMPLE | TEXT | - | 記入例 |
| アクティブフラグ | isActive | IS_ACTIVE | BOOLEAN | ○ | 利用可能かどうか |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- テンプレート名は一意
- 非アクティブテンプレートは選択不可
- システムテンプレートは編集不可

#### 集約ルート
TemplateAggregate集約のルートエンティティ

## 値オブジェクト（Value Objects）

### 記事タイトル [ArticleTitle] [ARTICLE_TITLE]
- **値** [value] [VALUE]: STRING_255
- **ビジネスルール**
  - 10文字以上100文字以内
  - 空白のみは不可

### 記事内容 [ArticleContent] [ARTICLE_CONTENT]
- **本文** [body] [BODY]: MARKDOWN
- **文字数** [length] [LENGTH]: INTEGER
- **ビジネスルール**
  - Markdown形式
  - 最大50000文字

### 記事要約 [ArticleSummary] [ARTICLE_SUMMARY]
- **値** [value] [VALUE]: STRING_500
- **ビジネスルール**
  - 50文字以上500文字以内
  - 本文から自動生成も可能

### カテゴリリスト [CategoryList] [CATEGORY_LIST]
- **カテゴリ** [categories] [CATEGORIES]: JSON
- **ビジネスルール**
  - 最大5個まで
  - 階層カテゴリ対応

### タグリスト [TagList] [TAG_LIST]
- **タグ** [tags] [TAGS]: JSON
- **ビジネスルール**
  - 最大20個まで
  - 小文字英数字とハイフンのみ

### 評価 [Rating] [RATING]
- **平均評価** [average] [AVERAGE]: DECIMAL
- **評価数** [count] [COUNT]: INTEGER
- **ビジネスルール**
  - 1.0-5.0の範囲
  - 小数第1位まで

### レビューコメント [ReviewComment] [REVIEW_COMMENT]
- **値** [value] [VALUE]: TEXT
- **ビジネスルール**
  - 最大1000文字
  - 建設的な内容

### テンプレート名 [TemplateName] [TEMPLATE_NAME]
- **値** [value] [VALUE]: STRING_100
- **ビジネスルール**
  - 一意性を保証
  - わかりやすい名前

### テンプレート構造 [TemplateStructure] [TEMPLATE_STRUCTURE]
- **セクション** [sections] [SECTIONS]: JSON
- **必須項目** [requiredFields] [REQUIRED_FIELDS]: JSON
- **ビジネスルール**
  - 有効なJSON構造
  - セクションは最低1個

## 集約（Aggregates）

### ナレッジ集約 [KnowledgeAggregate] [KNOWLEDGE_AGGREGATE]
- **集約ルート**: ナレッジ記事 [KnowledgeArticle]
- **含まれるエンティティ**: 
  - レビュー [Review]：記事へのレビュー（0..*）
- **含まれる値オブジェクト**:
  - 記事タイトル [ArticleTitle]：タイトルとして使用
  - 記事内容 [ArticleContent]：本文として使用
  - 記事要約 [ArticleSummary]：要約として使用
  - カテゴリリスト [CategoryList]：分類として使用
  - タグリスト [TagList]：タグとして使用
  - 評価 [Rating]：評価として使用
  - レビューコメント [ReviewComment]：レビューで使用
- **トランザクション境界**: 記事とレビューは別トランザクション（結果整合性）
- **不変条件**: 
  - タイトルは組織内で一意
  - 承認済み記事のみ公開
  - 自己レビュー禁止
- **外部参照ルール**:
  - 集約外からは記事IDのみで参照
  - レビューへの直接アクセスは禁止

### テンプレート集約 [TemplateAggregate] [TEMPLATE_AGGREGATE]
- **集約ルート**: ナレッジテンプレート [KnowledgeTemplate]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - テンプレート名 [TemplateName]：名称として使用
  - テンプレート構造 [TemplateStructure]：構造定義として使用
- **トランザクション境界**: テンプレート単体で処理
- **不変条件**: 
  - テンプレート名は一意
  - 構造定義は有効なJSON
- **外部参照ルール**:
  - 集約外からはテンプレートIDのみで参照

## ドメインサービス

### ナレッジ検索サービス [KnowledgeSearchService] [KNOWLEDGE_SEARCH_SERVICE]
ナレッジの高度な検索を提供するドメインサービス

#### 提供機能
- 全文検索 [fullTextSearch] [FULL_TEXT_SEARCH]
  - 目的: キーワードでナレッジを検索
  - 入力: 検索キーワード、フィルター条件
  - 出力: 検索結果（関連度順）
  - 制約: 公開範囲に基づくアクセス制御

- 類似記事検索 [findSimilarArticles] [FIND_SIMILAR_ARTICLES]
  - 目的: 類似したナレッジを推薦
  - 入力: 基準となる記事ID
  - 出力: 類似記事リスト
  - 制約: 同一カテゴリ優先

### ナレッジ分析サービス [KnowledgeAnalysisService] [KNOWLEDGE_ANALYSIS_SERVICE]
ナレッジの利用状況を分析するドメインサービス

#### 提供機能
- 人気記事分析 [analyzePopularArticles] [ANALYZE_POPULAR_ARTICLES]
  - 目的: よく参照される記事を特定
  - 入力: 期間、カテゴリ
  - 出力: 人気記事ランキング
  - 制約: 閲覧数と評価を考慮

## ドメインイベント

### ナレッジ公開済み [KnowledgePublished] [KNOWLEDGE_PUBLISHED]
- **発生タイミング**: ナレッジが承認され公開された時
- **ペイロード**: 
  - 記事ID [articleId] [ARTICLE_ID]: UUID
  - タイトル [title] [TITLE]: STRING_255
  - 作成者ID [authorId] [AUTHOR_ID]: UUID
  - 公開日時 [publishedAt] [PUBLISHED_AT]: TIMESTAMP

### ナレッジ評価済み [KnowledgeRated] [KNOWLEDGE_RATED]
- **発生タイミング**: ナレッジが評価された時
- **ペイロード**: 
  - 記事ID [articleId] [ARTICLE_ID]: UUID
  - 評価者ID [raterId] [RATER_ID]: UUID
  - 評価値 [rating] [RATING]: INTEGER
  - 評価日時 [ratedAt] [RATED_AT]: TIMESTAMP

## ビジネスルール

### 記事管理ルール
1. **タイトル一意性**: 組織内でタイトルは一意
   - 適用エンティティ: ナレッジ記事 [KnowledgeArticle]
2. **承認後公開**: 承認済みの記事のみ公開可能
   - 適用エンティティ: ナレッジ記事 [KnowledgeArticle]
3. **アーカイブ保護**: アーカイブ済み記事は編集不可
   - 適用エンティティ: ナレッジ記事 [KnowledgeArticle]

### レビュールール
1. **レビュー一意性**: 1記事1ユーザー1レビュー
   - 適用集約: ナレッジ集約 [KnowledgeAggregate]
2. **自己レビュー禁止**: 自分の記事はレビュー不可
   - 適用エンティティ: レビュー [Review]

### テンプレートルール
1. **テンプレート名一意性**: テンプレート名は一意
   - 適用エンティティ: ナレッジテンプレート [KnowledgeTemplate]
2. **システムテンプレート保護**: システムテンプレートは編集不可
   - 適用エンティティ: ナレッジテンプレート [KnowledgeTemplate]

### エラーパターン
- 1501: タイトル重複
- 1502: 自己レビュー
- 1503: 未承認記事の公開
- 2501: 必須項目未入力
- 3501: 検索エラー

## リポジトリインターフェース

### ナレッジリポジトリ [KnowledgeRepository] [KNOWLEDGE_REPOSITORY]
集約: ナレッジ集約 [KnowledgeAggregate]

基本操作:
- findById(id: UUID): ナレッジ記事 [KnowledgeArticle]
- save(article: ナレッジ記事): void
- delete(id: UUID): void

検索操作:
- findByTitle(title: ArticleTitle): ナレッジ記事
- findByCategory(category: STRING_50): ナレッジ記事[]
- findPublishedArticles(): ナレッジ記事[]

### テンプレートリポジトリ [TemplateRepository] [TEMPLATE_REPOSITORY]
集約: テンプレート集約 [TemplateAggregate]

基本操作:
- findById(id: UUID): ナレッジテンプレート [KnowledgeTemplate]
- save(template: ナレッジテンプレート): void
- delete(id: UUID): void

検索操作:
- findByType(type: ナレッジタイプ): ナレッジテンプレート[]
- findActiveTemplates(): ナレッジテンプレート[]

## リレーションシップ一覧

### エンティティ間の関連
- ナレッジ記事 [KnowledgeArticle] *→ レビュー [Review]（0..*）：記事は複数のレビューを持つ（集約内包含）

### 値オブジェクトの使用
- ナレッジ記事 [KnowledgeArticle] 使用 ArticleTitle [ArticleTitle]：タイトルとして
- ナレッジ記事 [KnowledgeArticle] 使用 ArticleContent [ArticleContent]：内容として
- ナレッジ記事 [KnowledgeArticle] 使用 ArticleSummary [ArticleSummary]：要約として
- ナレッジ記事 [KnowledgeArticle] 使用 CategoryList [CategoryList]：カテゴリとして
- ナレッジ記事 [KnowledgeArticle] 使用 TagList [TagList]：タグとして
- ナレッジ記事 [KnowledgeArticle] 使用 Rating [Rating]：評価として
- レビュー [Review] 使用 ReviewComment [ReviewComment]：コメントとして
- ナレッジテンプレート [KnowledgeTemplate] 使用 TemplateName [TemplateName]：名称として
- ナレッジテンプレート [KnowledgeTemplate] 使用 TemplateStructure [TemplateStructure]：構造として

### 集約境界
- ナレッジ集約 [KnowledgeAggregate]：ナレッジ記事 [KnowledgeArticle]、レビュー [Review]
- テンプレート集約 [TemplateAggregate]：ナレッジテンプレート [KnowledgeTemplate]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * 収益最適化サービスのドメイン言語
 */
function generateRevenueOptimizationDomainLanguage(): string {
  return `# パラソルドメイン言語: 財務管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
プロジェクトの収益性を追跡し、コストを管理することで利益を最大化するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
MONEY: 金額（通貨単位付き）
PERCENTAGE: パーセンテージ（0-100）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式のデータ
\`\`\`

### カスタム型定義
\`\`\`
請求ステータス: 請求書の状態 (基本型: ENUM)
  - draft: 下書き
  - sent: 送付済み
  - paid: 支払済み
  - overdue: 期限超過
  - cancelled: キャンセル

支払条件: 支払いの条件 (基本型: ENUM)
  - immediate: 即時
  - net30: 30日以内
  - net60: 60日以内
  - net90: 90日以内
  - custom: カスタム

予算タイプ: 予算の種類 (基本型: ENUM)
  - fixed: 固定予算
  - time_material: タイム&マテリアル
  - milestone: マイルストーン型
  - retainer: リテイナー

コストカテゴリ: コストの分類 (基本型: ENUM)
  - labor: 人件費
  - material: 材料費
  - outsourcing: 外注費
  - travel: 旅費交通費
  - other: その他経費
\`\`\`

## エンティティ（Entities）

### 請求書 [Invoice] [INVOICE]
クライアントへの請求を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 請求書の一意識別子 |
| 請求書番号 | invoiceNumber | INVOICE_NUMBER | InvoiceNumber [InvoiceNumber] [INVOICE_NUMBER]（値オブジェクト） | ○ | 請求書番号 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 請求対象プロジェクト |
| クライアントID | clientId | CLIENT_ID | UUID | ○ | 請求先クライアント |
| 請求日 | invoiceDate | INVOICE_DATE | DATE | ○ | 請求書発行日 |
| 支払期限 | dueDate | DUE_DATE | DATE | ○ | 支払期限日 |
| 金額 | amount | AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 請求金額（税抜） |
| 税額 | taxAmount | TAX_AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 消費税額 |
| 合計金額 | totalAmount | TOTAL_AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 請求合計額 |
| ステータス | status | STATUS | 請求ステータス | ○ | 請求書の状態 |
| 支払条件 | paymentTerms | PAYMENT_TERMS | 支払条件 | ○ | 支払いの条件 |
| 備考 | notes | NOTES | TEXT | - | 請求書備考 |
| 支払日 | paidAt | PAID_AT | DATE | - | 実際の支払日 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 請求書番号は一意
- 送付済み請求書は金額変更不可
- 支払期限は請求日より後
- キャンセル済み請求書は再利用不可

#### ドメインイベント
- 請求書送付済み [InvoiceSent] [INVOICE_SENT]：請求書が送付された時
- 支払完了 [PaymentReceived] [PAYMENT_RECEIVED]：支払いが完了した時
- 支払期限超過 [InvoiceOverdue] [INVOICE_OVERDUE]：支払期限を超過した時

#### 集約ルート
InvoiceAggregate集約のルートエンティティ

### 請求明細 [InvoiceItem] [INVOICE_ITEM]
請求書の内訳を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 請求明細の一意識別子 |
| 請求書ID | invoiceId | INVOICE_ID | UUID | ○ | 所属する請求書 |
| 項目名 | description | DESCRIPTION | STRING_255 | ○ | 明細項目の説明 |
| 数量 | quantity | QUANTITY | DECIMAL | ○ | 数量 |
| 単価 | unitPrice | UNIT_PRICE | Money [Money] [MONEY]（値オブジェクト） | ○ | 単価 |
| 金額 | amount | AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 明細金額 |
| 備考 | notes | NOTES | TEXT | - | 明細備考 |

#### ビジネスルール
- 金額 = 数量 × 単価
- 請求書の合計は明細の合計と一致

### 予算 [Budget] [BUDGET]
プロジェクトの予算を管理するエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 予算の一意識別子 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 予算名 | name | NAME | STRING_100 | ○ | 予算の名称 |
| タイプ | type | TYPE | 予算タイプ | ○ | 予算の種類 |
| 総予算額 | totalBudget | TOTAL_BUDGET | Money [Money] [MONEY]（値オブジェクト） | ○ | 承認された予算総額 |
| 使用額 | usedAmount | USED_AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 実際の使用額 |
| 残額 | remainingAmount | REMAINING_AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | 予算残額 |
| 期間開始日 | startDate | START_DATE | DATE | ○ | 予算期間開始日 |
| 期間終了日 | endDate | END_DATE | DATE | ○ | 予算期間終了日 |
| 警告閾値 | warningThreshold | WARNING_THRESHOLD | ThresholdPercentage [ThresholdPercentage] [THRESHOLD_PERCENTAGE]（値オブジェクト） | ○ | 警告を出す使用率 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 残額 = 総予算額 - 使用額
- 使用率が警告閾値を超えたらアラート
- 予算超過は承認が必要

#### ドメインイベント
- 予算警告 [BudgetWarning] [BUDGET_WARNING]：使用率が警告閾値を超えた時
- 予算超過 [BudgetExceeded] [BUDGET_EXCEEDED]：予算を超過した時

#### 集約ルート
BudgetAggregate集約のルートエンティティ

### コスト [Cost] [COST]
プロジェクトで発生したコストを表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | コストの一意識別子 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 予算ID | budgetId | BUDGET_ID | UUID | - | 関連する予算 |
| カテゴリ | category | CATEGORY | コストカテゴリ | ○ | コストの分類 |
| 項目名 | description | DESCRIPTION | STRING_255 | ○ | コスト項目の説明 |
| 金額 | amount | AMOUNT | Money [Money] [MONEY]（値オブジェクト） | ○ | コスト金額 |
| 発生日 | incurredDate | INCURRED_DATE | DATE | ○ | コスト発生日 |
| 承認者ID | approvedBy | APPROVED_BY | UUID | - | コスト承認者 |
| 承認日 | approvedAt | APPROVED_AT | TIMESTAMP | - | コスト承認日時 |
| 備考 | notes | NOTES | TEXT | - | コスト備考 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- 承認済みコストは編集不可
- コスト発生日は予算期間内
- 一定金額以上は承認必須

### 収益予測 [RevenueForecast] [REVENUE_FORECAST]
プロジェクトの収益予測を表すエンティティ

| 日本語名 | 英語名 | システム名 | 型 | 必須 | 説明 |
|----------|--------|------------|-----|------|------|
| ID | id | ID | UUID | ○ | 収益予測の一意識別子 |
| プロジェクトID | projectId | PROJECT_ID | UUID | ○ | 対象プロジェクト |
| 予測月 | forecastMonth | FORECAST_MONTH | YearMonth [YearMonth] [YEAR_MONTH]（値オブジェクト） | ○ | 予測対象月 |
| 予測収益 | forecastRevenue | FORECAST_REVENUE | Money [Money] [MONEY]（値オブジェクト） | ○ | 予測収益額 |
| 実績収益 | actualRevenue | ACTUAL_REVENUE | Money [Money] [MONEY]（値オブジェクト） | - | 実際の収益額 |
| 達成率 | achievementRate | ACHIEVEMENT_RATE | AchievementPercentage [AchievementPercentage] [ACHIEVEMENT_PERCENTAGE]（値オブジェクト） | - | 予測に対する達成率 |
| 作成日時 | createdAt | CREATED_AT | TIMESTAMP | ○ | レコード作成日時 |
| 更新日時 | updatedAt | UPDATED_AT | TIMESTAMP | ○ | レコード更新日時 |

#### ビジネスルール
- プロジェクトと予測月の組み合わせは一意
- 達成率 = 実績収益 ÷ 予測収益 × 100
- 過去月の予測は変更不可

#### 集約ルート
ForecastAggregate集約のルートエンティティ

## 値オブジェクト（Value Objects）

### 請求書番号 [InvoiceNumber] [INVOICE_NUMBER]
- **値** [value] [VALUE]: STRING_20
- **ビジネスルール**
  - 形式: INV-YYYY-NNNN（例: INV-2024-0001）
  - 一意性を保証

### 金額 [Money] [MONEY]
- **金額** [amount] [AMOUNT]: DECIMAL
- **通貨** [currency] [CURRENCY]: STRING_20
- **ビジネスルール**
  - 0以上の値
  - 通貨コードはISO 4217準拠

### 年月 [YearMonth] [YEAR_MONTH]
- **年** [year] [YEAR]: INTEGER
- **月** [month] [MONTH]: INTEGER
- **ビジネスルール**
  - 年は2000以上
  - 月は1-12の範囲

### 閾値パーセンテージ [ThresholdPercentage] [THRESHOLD_PERCENTAGE]
- **値** [value] [VALUE]: PERCENTAGE
- **ビジネスルール**
  - 0-100の範囲
  - 整数値

### 達成率パーセンテージ [AchievementPercentage] [ACHIEVEMENT_PERCENTAGE]
- **値** [value] [VALUE]: DECIMAL
- **ビジネスルール**
  - 0以上（100%超過可能）
  - 小数第1位まで

## 集約（Aggregates）

### 請求書集約 [InvoiceAggregate] [INVOICE_AGGREGATE]
- **集約ルート**: 請求書 [Invoice]
- **含まれるエンティティ**: 
  - 請求明細 [InvoiceItem]：請求書の明細（1..*）
- **含まれる値オブジェクト**:
  - 請求書番号 [InvoiceNumber]：識別番号として使用
  - 金額 [Money]：各種金額で使用
- **トランザクション境界**: 請求書と明細は同一トランザクションで処理
- **不変条件**: 
  - 請求書番号は一意
  - 請求書合計 = 明細合計
  - 送付済み請求書は金額変更不可
- **外部参照ルール**:
  - 集約外からは請求書IDのみで参照
  - 請求明細への直接アクセスは禁止

### 予算集約 [BudgetAggregate] [BUDGET_AGGREGATE]
- **集約ルート**: 予算 [Budget]
- **含まれるエンティティ**: 
  - なし（コストは別集約として参照）
- **含まれる値オブジェクト**:
  - 金額 [Money]：予算額で使用
  - 閾値パーセンテージ [ThresholdPercentage]：警告閾値として使用
- **トランザクション境界**: 予算単体で処理
- **不変条件**: 
  - 残額 = 総予算額 - 使用額
  - 期間の整合性（開始日 < 終了日）
- **外部参照ルール**:
  - 集約外からは予算IDのみで参照

### コスト集約 [CostAggregate] [COST_AGGREGATE]
- **集約ルート**: コスト [Cost]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - 金額 [Money]：コスト金額として使用
- **トランザクション境界**: コスト単体で処理
- **不変条件**: 
  - 承認済みコストは編集不可
  - コスト発生日は予算期間内
- **外部参照ルール**:
  - 集約外からはコストIDのみで参照

### 収益予測集約 [ForecastAggregate] [FORECAST_AGGREGATE]
- **集約ルート**: 収益予測 [RevenueForecast]
- **含まれるエンティティ**: 
  - なし
- **含まれる値オブジェクト**:
  - 年月 [YearMonth]：予測月として使用
  - 金額 [Money]：収益額として使用
  - 達成率パーセンテージ [AchievementPercentage]：達成率として使用
- **トランザクション境界**: 収益予測単体で処理
- **不変条件**: 
  - プロジェクトと予測月の組み合わせは一意
  - 達成率は実績から自動計算
- **外部参照ルール**:
  - 集約外からは収益予測IDのみで参照

## ドメインサービス

### 請求管理サービス [InvoiceManagementService] [INVOICE_MANAGEMENT_SERVICE]
請求書の発行と管理を行うドメインサービス

#### 提供機能
- 請求書発行 [issueInvoice] [ISSUE_INVOICE]
  - 目的: プロジェクトの作業実績から請求書を生成
  - 入力: プロジェクトID、請求対象期間
  - 出力: 生成された請求書
  - 制約: 承認済み工数のみ対象

- 支払期限監視 [monitorPaymentDeadlines] [MONITOR_PAYMENT_DEADLINES]
  - 目的: 支払期限の接近・超過を監視
  - 入力: 監視対象日
  - 出力: 警告対象の請求書リスト
  - 制約: 未払い請求書のみ対象

### 収益性分析サービス [ProfitabilityAnalysisService] [PROFITABILITY_ANALYSIS_SERVICE]
プロジェクトの収益性を分析するドメインサービス

#### 提供機能
- 利益率計算 [calculateProfitMargin] [CALCULATE_PROFIT_MARGIN]
  - 目的: プロジェクトの利益率を計算
  - 入力: プロジェクトID、期間
  - 出力: 利益率
  - 制約: 確定済みの収益・コストのみ対象

- ROI分析 [analyzeROI] [ANALYZE_ROI]
  - 目的: 投資収益率を分析
  - 入力: プロジェクトID
  - 出力: ROI指標
  - 制約: 完了プロジェクトのみ対象

## ドメインイベント

### 請求書送付済み [InvoiceSent] [INVOICE_SENT]
- **発生タイミング**: 請求書がクライアントに送付された時
- **ペイロード**: 
  - 請求書ID [invoiceId] [INVOICE_ID]: UUID
  - 請求書番号 [invoiceNumber] [INVOICE_NUMBER]: InvoiceNumber
  - クライアントID [clientId] [CLIENT_ID]: UUID
  - 送付日時 [sentAt] [SENT_AT]: TIMESTAMP

### 予算超過 [BudgetExceeded] [BUDGET_EXCEEDED]
- **発生タイミング**: コストが予算を超過した時
- **ペイロード**: 
  - 予算ID [budgetId] [BUDGET_ID]: UUID
  - プロジェクトID [projectId] [PROJECT_ID]: UUID
  - 超過額 [exceededAmount] [EXCEEDED_AMOUNT]: Money
  - 発生日時 [occurredAt] [OCCURRED_AT]: TIMESTAMP

## ビジネスルール

### 請求ルール
1. **請求書番号一意性**: 請求書番号は全体で一意
   - 適用エンティティ: 請求書 [Invoice]
2. **送付後変更禁止**: 送付済み請求書の金額は変更不可
   - 適用エンティティ: 請求書 [Invoice]
3. **支払期限順守**: 支払期限は請求日の30日後以上
   - 適用エンティティ: 請求書 [Invoice]

### 予算管理ルール
1. **予算期間整合性**: 期間開始日は終了日より前
   - 適用エンティティ: 予算 [Budget]
2. **警告閾値**: 使用率80%で警告通知
   - 適用エンティティ: 予算 [Budget]
3. **超過承認**: 予算超過は事前承認必須
   - 適用集約: 予算集約 [BudgetAggregate]

### コスト管理ルール
1. **承認後固定**: 承認済みコストは編集不可
   - 適用エンティティ: コスト [Cost]
2. **高額承認**: 100万円以上は部長承認必須
   - 適用エンティティ: コスト [Cost]

### エラーパターン
- 1601: 請求書番号重複
- 1602: 予算超過
- 1603: 支払期限違反
- 2601: 必須項目未入力
- 3601: 外部決済システムエラー

## リポジトリインターフェース

### 請求書リポジトリ [InvoiceRepository] [INVOICE_REPOSITORY]
集約: 請求書集約 [InvoiceAggregate]

基本操作:
- findById(id: UUID): 請求書 [Invoice]
- save(invoice: 請求書): void
- delete(id: UUID): void

検索操作:
- findByNumber(number: InvoiceNumber): 請求書
- findByProject(projectId: UUID): 請求書[]
- findUnpaidInvoices(): 請求書[]

### 予算リポジトリ [BudgetRepository] [BUDGET_REPOSITORY]
集約: 予算集約 [BudgetAggregate]

基本操作:
- findById(id: UUID): 予算 [Budget]
- save(budget: 予算): void
- delete(id: UUID): void

検索操作:
- findByProject(projectId: UUID): 予算[]
- findActiveBudgets(date: DATE): 予算[]

### コストリポジトリ [CostRepository] [COST_REPOSITORY]
集約: コスト集約 [CostAggregate]

基本操作:
- findById(id: UUID): コスト [Cost]
- save(cost: コスト): void
- delete(id: UUID): void

検索操作:
- findByProject(projectId: UUID): コスト[]
- findByBudget(budgetId: UUID): コスト[]
- findByDateRange(startDate: DATE, endDate: DATE): コスト[]

### 収益予測リポジトリ [ForecastRepository] [FORECAST_REPOSITORY]
集約: 収益予測集約 [ForecastAggregate]

基本操作:
- findById(id: UUID): 収益予測 [RevenueForecast]
- save(forecast: 収益予測): void
- delete(id: UUID): void

検索操作:
- findByProjectAndMonth(projectId: UUID, month: YearMonth): 収益予測
- findByProject(projectId: UUID): 収益予測[]

## リレーションシップ一覧

### エンティティ間の関連
- 請求書 [Invoice] *→ 請求明細 [InvoiceItem]（1..*）：請求書は複数の明細を持つ（集約内包含）
- 予算 [Budget] → コスト [Cost]（1..*）：予算は複数のコストから参照される
- プロジェクト → 請求書 [Invoice]（1..*）：プロジェクトは複数の請求書を持つ
- プロジェクト → 予算 [Budget]（1..*）：プロジェクトは複数の予算を持つ
- プロジェクト → コスト [Cost]（1..*）：プロジェクトは複数のコストを持つ
- プロジェクト → 収益予測 [RevenueForecast]（1..*）：プロジェクトは複数の収益予測を持つ

### 値オブジェクトの使用
- 請求書 [Invoice] 使用 InvoiceNumber [InvoiceNumber]：請求書番号として
- 請求書 [Invoice] 使用 Money [Money]：金額、税額、合計金額として
- 請求明細 [InvoiceItem] 使用 Money [Money]：単価、金額として
- 予算 [Budget] 使用 Money [Money]：予算額、使用額、残額として
- 予算 [Budget] 使用 ThresholdPercentage [ThresholdPercentage]：警告閾値として
- コスト [Cost] 使用 Money [Money]：コスト金額として
- 収益予測 [RevenueForecast] 使用 YearMonth [YearMonth]：予測月として
- 収益予測 [RevenueForecast] 使用 Money [Money]：予測・実績収益として
- 収益予測 [RevenueForecast] 使用 AchievementPercentage [AchievementPercentage]：達成率として

### 集約境界
- 請求書集約 [InvoiceAggregate]：請求書 [Invoice]、請求明細 [InvoiceItem]
- 予算集約 [BudgetAggregate]：予算 [Budget]
- コスト集約 [CostAggregate]：コスト [Cost]
- 収益予測集約 [ForecastAggregate]：収益予測 [RevenueForecast]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] 外部参照ルールが明確`
}

/**
 * ドメイン言語を更新する
 */
async function updateRemainingDomainLanguages() {
  console.log('🔄 Updating remaining services domain languages to v1.2.0 specification...\n')
  
  try {
    // 1. 生産性可視化サービスの更新
    console.log('📝 Updating Productivity Visualization Service...')
    const productivityService = await prisma.services.findFirst({
      where: { name: 'productivity-visualization' }
    })
    
    if (productivityService) {
      await prisma.services.update({
        where: { id: productivityService.id },
        data: {
          domainLanguageDefinition: generateProductivityVisualizationDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist',
              'all-entities-have-aggregates'
            ]
          })
        }
      })
      console.log('✅ Productivity Visualization Service updated')
    }
    
    // 2. コラボレーション促進サービスの更新
    console.log('📝 Updating Collaboration Facilitation Service...')
    const collaborationService = await prisma.services.findFirst({
      where: { name: 'collaboration-facilitation' }
    })
    
    if (collaborationService) {
      await prisma.services.update({
        where: { id: collaborationService.id },
        data: {
          domainLanguageDefinition: generateCollaborationFacilitationDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist',
              'all-entities-have-aggregates'
            ]
          })
        }
      })
      console.log('✅ Collaboration Facilitation Service updated')
    }
    
    // 3. ナレッジ共創サービスの更新
    console.log('📝 Updating Knowledge Co-creation Service...')
    const knowledgeService = await prisma.services.findFirst({
      where: { name: 'knowledge-cocreation' }
    })
    
    if (knowledgeService) {
      await prisma.services.update({
        where: { id: knowledgeService.id },
        data: {
          domainLanguageDefinition: generateKnowledgeCocreationDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist',
              'all-entities-have-aggregates'
            ]
          })
        }
      })
      console.log('✅ Knowledge Co-creation Service updated')
    }
    
    // 4. 収益最適化サービスの更新
    console.log('📝 Updating Revenue Optimization Service...')
    const revenueService = await prisma.services.findFirst({
      where: { name: 'revenue-optimization' }
    })
    
    if (revenueService) {
      await prisma.services.update({
        where: { id: revenueService.id },
        data: {
          domainLanguageDefinition: generateRevenueOptimizationDomainLanguage(),
          domainLanguage: JSON.stringify({
            generatedFrom: 'domain-language-v1.2.0',
            generatedAt: new Date().toISOString(),
            version: '1.2.0',
            features: [
              'explicit-value-object-relations',
              'aggregate-value-objects',
              'relationship-definitions',
              'ddd-pattern-checklist',
              'all-entities-have-aggregates'
            ]
          })
        }
      })
      console.log('✅ Revenue Optimization Service updated')
    }
    
    console.log('\n✅ All domain languages updated successfully!')
    console.log('📊 Updated features:')
    console.log('  - Explicit Value Object relationships')
    console.log('  - Aggregate boundaries with Value Objects')
    console.log('  - Complete relationship definitions')
    console.log('  - DDD pattern checklist')
    console.log('  - All entities belong to aggregates')
    
  } catch (_error) {
    console.error('❌ Error updating domain languages:', error)
    throw _error
  } finally {
    await prisma.$disconnect()
  }
}

// スクリプトの実行
updateRemainingDomainLanguages()
  .then(() => {
    console.log('\n✨ Remaining services domain language v1.2.0 update completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Update failed:', error)
    process.exit(1)
  })