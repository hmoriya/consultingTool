#!/usr/bin/env npx tsx
/**
 * 残りの4サービスにアグリゲート定義を追加するスクリプト
 */

import { PrismaClient } from '@prisma/parasol-client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// 各サービスのドメイン言語定義ファイルを読み込む
const domainLanguageFiles = {
  'productivity-visualization': path.join(__dirname, 'domain-languages/productivity-visualization-v2.md'),
  'collaboration-facilitation': path.join(__dirname, 'domain-languages/collaboration-facilitation-v2.md'),
  'knowledge-cocreation': path.join(__dirname, 'domain-languages/knowledge-cocreation-v2.md'),
  'revenue-optimization': path.join(__dirname, 'domain-languages/revenue-optimization-v2.md')
}

async function updateService(serviceName: string, domainLanguageContent: string) {
  try {
    console.log(`📝 Updating ${serviceName}...`)
    
    const service = await prisma.services.findFirst({
      where: { name: serviceName }
    })
    
    if (!service) {
      console.log(`⚠️  Service ${serviceName} not found, skipping...`)
      return
    }
    
    await prisma.services.update({
      where: { id: service.id },
      data: {
        domainLanguageDefinition: domainLanguageContent,
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
        }),
        updatedAt: new Date()
      }
    })
    
    console.log(`✅ ${serviceName} updated successfully`)
  } catch (error) {
    console.error(`❌ Error updating ${serviceName}:`, error)
    throw error
  }
}

async function main() {
  console.log('🔄 Adding aggregate definitions to remaining services...\n')
  
  try {
    // ディレクトリを作成
    const domainLangDir = path.join(__dirname, 'domain-languages')
    if (!fs.existsSync(domainLangDir)) {
      fs.mkdirSync(domainLangDir, { recursive: true })
    }
    
    // 1. 生産性可視化サービスのドメイン言語
    const productivityDomainLanguage = `# パラソルドメイン言語: 工数管理ドメイン

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
  - meeting: 会議
  - documentation: ドキュメント作成
  - review: レビュー
  - support: サポート
  - management: 管理
  - other: その他
\`\`\`

## エンティティ（Entities）

### タイムシート [Timesheet] [TIMESHEET]
説明: 期間単位での工数記録を管理するエンティティ

属性:
- タイムシートID [TimesheetId] [TIMESHEET_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: タイムシートの一意識別子
- 記録者リファレンス [RecorderRef] [RECORDER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: タイムシートを記録したユーザー
  - 関連: ユーザー [User] → タイムシート [Timesheet]（1..*）
- 対象週 [TargetWeek] [TARGET_WEEK]
  - 型: 週情報 [WeekInfo] [WEEK_INFO]（値オブジェクト）
  - 説明: 対象となる週の情報
- ステータス [Status] [STATUS]
  - 型: タイムシートステータス [TimesheetStatus] [TIMESHEET_STATUS]
  - 説明: タイムシートの状態
- 合計時間 [TotalHours] [TOTAL_HOURS]
  - 型: 作業時間 [WorkHours] [WORK_HOURS]（値オブジェクト）
  - 説明: 週の合計作業時間

不変条件:
- 合計時間は明細の合計と一致する
- 承認済みタイムシートは変更不可

振る舞い:
- タイムシート提出 [SubmitTimesheet] [SUBMIT_TIMESHEET]
  - 目的: タイムシートを提出する
  - 入力: なし
  - 出力: 提出結果
  - 事前条件: ステータス=下書き、エントリが1件以上
  - 事後条件: ステータス=提出済み

#### パラソルドメインイベント
- タイムシート提出済み [TimesheetSubmitted] [TIMESHEET_SUBMITTED]：タイムシート提出時

#### 集約ルート
このエンティティはタイムシート集約のルートエンティティ

### 工数エントリ [TimeEntry] [TIME_ENTRY]
説明: 個別の作業記録を管理するエンティティ

属性:
- エントリID [EntryId] [ENTRY_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: エントリの一意識別子
- タイムシートID [TimesheetId] [TIMESHEET_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 所属するタイムシート
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 作業対象プロジェクト
  - 関連: プロジェクト [Project] → 工数エントリ [TimeEntry]（1..*）
- 作業日 [WorkDate] [WORK_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: 作業実施日
- 作業時間 [WorkHours] [WORK_HOURS]
  - 型: 作業時間 [WorkHours] [WORK_HOURS]（値オブジェクト）
  - 説明: 実作業時間

## 値オブジェクト（Value Objects）

### 週情報 [WeekInfo] [WEEK_INFO]
- 定義: 特定の週を表現する情報
- 属性:
  - 年 [year] [YEAR]: INTEGER
  - 週番号 [weekNumber] [WEEK_NUMBER]: INTEGER（1-53）
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
- 制約: 週番号は1-53の範囲
- 使用エンティティ: タイムシート [Timesheet]
- 例: 2025年第5週（2025-01-27〜2025-02-02）

### 作業時間 [WorkHours] [WORK_HOURS]
- 定義: 作業時間を表現
- 属性:
  - 時間 [hours] [HOURS]: DECIMAL（0-24）
  - 分 [minutes] [MINUTES]: INTEGER（0-59）
- 制約: 1日24時間以内、0以上
- 使用エンティティ: タイムシート [Timesheet]、工数エントリ [TimeEntry]
- 例: 8時間30分

## 集約（Aggregates）

### タイムシート集約 [TimesheetAggregate] [TIMESHEET_AGGREGATE]
- **集約ルート**: タイムシート [Timesheet]
- **含まれるエンティティ**: 
  - 工数エントリ [TimeEntry]：タイムシートに含まれる作業記録（0..*）
- **含まれる値オブジェクト**:
  - 週情報 [WeekInfo]：対象週の情報として使用
  - 作業時間 [WorkHours]：合計時間、個別作業時間で使用
- **トランザクション境界**: タイムシートと工数エントリは同一トランザクション
- **不変条件**: 
  - タイムシートの合計時間は全エントリの合計と一致
  - 承認済みタイムシートは編集不可
  - 同一日に同一プロジェクトのエントリは1つまで
- **外部参照ルール**:
  - 集約外からはタイムシートIDのみで参照
  - 工数エントリへの直接アクセスは禁止

## ドメインサービス

### 稼働率計算サービス [UtilizationCalculationService] [UTILIZATION_CALCULATION_SERVICE]
稼働率の計算と分析を行うサービス

#### 提供機能
- 個人稼働率計算 [CalculatePersonalUtilization] [CALCULATE_PERSONAL_UTILIZATION]
  - 目的: 個人の稼働率を計算
  - 入力: ユーザーID、期間
  - 出力: 稼働率レポート
  - 制約: 承認済みタイムシートのみ対象

## ドメインイベント

### タイムシート提出済み [TimesheetSubmitted] [TIMESHEET_SUBMITTED]
- **発生タイミング**: タイムシートが提出された時
- **ペイロード**: 
  - タイムシートID [timesheetId]: UUID
  - 記録者ID [recorderId]: UUID
  - 対象週 [targetWeek]: WeekInfo

## ビジネスルール

### タイムシート記録ルール
1. **週締めルール**: タイムシートは週単位（月曜開始、日曜終了）で作成
2. **提出期限**: 翌週月曜日の正午まで
3. **最大時間制限**: 1日の作業時間は24時間以内

### エラーパターン
- 1001: 作業時間超過エラー
- 1002: 提出期限超過エラー

## リポジトリインターフェース

### タイムシートリポジトリ [TimesheetRepository] [TIMESHEET_REPOSITORY]
集約: タイムシート集約 [TimesheetAggregate]

基本操作:
- findById(id: UUID): タイムシート [Timesheet]
- save(timesheet: タイムシート): void

検索操作:
- findByUserAndWeek(userId: UUID, week: WeekInfo): タイムシート

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
- [x] 外部からのアクセスは集約ルート経由のみ`
    
    fs.writeFileSync(
      path.join(domainLangDir, 'productivity-visualization-v2.md'),
      productivityDomainLanguage
    )
    
    // SQLite に直接更新
    await updateService('productivity-visualization', productivityDomainLanguage)
    
    // 2. コラボレーション促進サービス
    const collaborationDomainLanguage = `# パラソルドメイン言語: 通知・コミュニケーションドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
チーム内のコミュニケーションを促進し、重要な情報をタイムリーに配信するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
TIMESTAMP: 日時（ISO8601形式）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式データ
\`\`\`

### カスタム型定義
\`\`\`
通知タイプ: 通知の種類 (基本型: ENUM)
  - task_assigned: タスク割当
  - project_update: プロジェクト更新
  - approval_request: 承認依頼
  - mention: メンション
  - announcement: お知らせ
  - reminder: リマインダー

通知優先度: 通知の重要度 (基本型: ENUM)
  - low: 低
  - medium: 中
  - high: 高
  - urgent: 緊急

配信チャネル: 配信方法 (基本型: ENUM)
  - in_app: アプリ内通知
  - email: メール
  - slack: Slack
  - teams: Microsoft Teams
\`\`\`

## エンティティ（Entities）

### 通知 [Notification] [NOTIFICATION]
説明: システム内で発生する通知を管理するエンティティ

属性:
- 通知ID [NotificationId] [NOTIFICATION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 通知の一意識別子
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 通知のタイトル
- メッセージ [Message] [MESSAGE]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 通知の本文
- 通知タイプ [Type] [TYPE]
  - 型: 通知タイプ [NotificationType] [NOTIFICATION_TYPE]
  - 説明: 通知の種類
- 優先度 [Priority] [PRIORITY]
  - 型: 通知優先度 [NotificationPriority] [NOTIFICATION_PRIORITY]
  - 説明: 通知の重要度
- 受信者リファレンス [RecipientRef] [RECIPIENT_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 通知の受信者
  - 関連: ユーザー [User] → 通知 [Notification]（1..*）
- 配信ステータス [DeliveryStatus] [DELIVERY_STATUS]
  - 型: 配信ステータス [DeliveryStatus] [DELIVERY_STATUS]（値オブジェクト）
  - 説明: 各チャネルの配信状況
- 既読フラグ [IsRead] [IS_READ]
  - 型: BOOLEAN [BOOLEAN] [BOOLEAN]
  - 説明: 既読状態
- 作成日時 [CreatedAt] [CREATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 通知作成日時

不変条件:
- 作成後は内容の変更不可
- 配信後のチャネル変更不可

#### パラソルドメインイベント
- 通知配信済み [NotificationDelivered] [NOTIFICATION_DELIVERED]：通知配信時
- 通知既読済み [NotificationRead] [NOTIFICATION_READ]：既読化時

#### 集約ルート
このエンティティは通知集約のルートエンティティ

### メッセージ [Message] [MESSAGE]
説明: ユーザー間のメッセージを管理するエンティティ

属性:
- メッセージID [MessageId] [MESSAGE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: メッセージの一意識別子
- 送信者リファレンス [SenderRef] [SENDER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: メッセージ送信者
  - 関連: ユーザー [User] → メッセージ [Message]（1..*）
- 内容 [Content] [CONTENT]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: メッセージ本文
- スレッドID [ThreadId] [THREAD_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 所属するスレッド
- 送信日時 [SentAt] [SENT_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 送信日時

## 値オブジェクト（Value Objects）

### 配信ステータス [DeliveryStatus] [DELIVERY_STATUS]
- 定義: 各チャネルの配信状況を表現
- 属性:
  - チャネル [channel] [CHANNEL]: 配信チャネル
  - ステータス [status] [STATUS]: ENUM（pending, delivered, failed）
  - 配信日時 [deliveredAt] [DELIVERED_AT]: TIMESTAMP
  - エラーメッセージ [errorMessage] [ERROR_MESSAGE]: STRING_500（任意）
- 制約: 配信済みステータスは変更不可
- 使用エンティティ: 通知 [Notification]

### メンション [Mention] [MENTION]
- 定義: ユーザーへのメンションを表現
- 属性:
  - ユーザーID [userId] [USER_ID]: UUID
  - 位置 [position] [POSITION]: INTEGER
- 制約: 同一メッセージ内で重複不可
- 使用エンティティ: メッセージ [Message]、コメント [Comment]

## 集約（Aggregates）

### 通知集約 [NotificationAggregate] [NOTIFICATION_AGGREGATE]
- **集約ルート**: 通知 [Notification]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 配信ステータス [DeliveryStatus]：各チャネルの配信状況
- **トランザクション境界**: 通知単体で完結
- **不変条件**: 
  - 配信後の内容変更不可
  - 既読後の未読化不可
- **外部参照ルール**:
  - 通知IDのみで参照

### メッセージスレッド集約 [MessageThreadAggregate] [MESSAGE_THREAD_AGGREGATE]
- **集約ルート**: メッセージスレッド [MessageThread]
- **含まれるエンティティ**: 
  - メッセージ [Message]：スレッド内のメッセージ（1..*）
- **含まれる値オブジェクト**:
  - メンション [Mention]：メッセージ内のメンション
- **トランザクション境界**: スレッドとメッセージは同一トランザクション
- **不変条件**: 
  - メッセージの時系列順序を保証
  - 削除されたメッセージは編集不可
- **外部参照ルール**:
  - スレッドIDでアクセス
  - 個別メッセージへの直接アクセス禁止

## ドメインサービス

### 通知配信サービス [NotificationDeliveryService] [NOTIFICATION_DELIVERY_SERVICE]
通知を適切なチャネルに配信するサービス

#### 提供機能
- 通知配信 [DeliverNotification] [DELIVER_NOTIFICATION]
  - 目的: 通知を指定チャネルに配信
  - 入力: 通知ID、配信チャネル
  - 出力: 配信結果
  - 制約: ユーザー設定に基づく配信

## ドメインイベント

### 通知配信済み [NotificationDelivered] [NOTIFICATION_DELIVERED]
- **発生タイミング**: 通知が配信された時
- **ペイロード**: 
  - 通知ID [notificationId]: UUID
  - 受信者ID [recipientId]: UUID
  - チャネル [channel]: 配信チャネル

### メッセージ送信済み [MessageSent] [MESSAGE_SENT]
- **発生タイミング**: メッセージが送信された時
- **ペイロード**: 
  - メッセージID [messageId]: UUID
  - 送信者ID [senderId]: UUID
  - スレッドID [threadId]: UUID

## ビジネスルール

### 通知配信ルール
1. **優先度別配信**: 緊急通知は全チャネルに即座配信
2. **営業時間考慮**: 低優先度は営業時間内に配信
3. **配信リトライ**: 失敗時は3回まで再試行

### メッセージルール
1. **編集期限**: 送信後5分以内のみ編集可能
2. **削除制限**: 自分のメッセージのみ削除可能
3. **メンション通知**: メンションされたユーザーに自動通知

### エラーパターン
- 1001: 配信チャネル未設定エラー
- 1002: 受信者不在エラー
- 2001: メッセージ編集期限超過エラー

## リポジトリインターフェース

### 通知リポジトリ [NotificationRepository] [NOTIFICATION_REPOSITORY]
集約: 通知集約 [NotificationAggregate]

基本操作:
- findById(id: UUID): 通知 [Notification]
- save(notification: 通知): void

検索操作:
- findUnreadByUser(userId: UUID): 通知[]
- findByUserAndDateRange(userId: UUID, start: Date, end: Date): 通知[]

### メッセージスレッドリポジトリ [MessageThreadRepository] [MESSAGE_THREAD_REPOSITORY]
集約: メッセージスレッド集約 [MessageThreadAggregate]

基本操作:
- findById(id: UUID): メッセージスレッド [MessageThread]
- save(thread: メッセージスレッド): void

検索操作:
- findByParticipant(userId: UUID): メッセージスレッド[]

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
- [x] 外部からのアクセスは集約ルート経由のみ`

    fs.writeFileSync(
      path.join(domainLangDir, 'collaboration-facilitation-v2.md'),
      collaborationDomainLanguage
    )
    
    await updateService('collaboration-facilitation', collaborationDomainLanguage)
    
    // 3. ナレッジ共創サービス
    const knowledgeDomainLanguage = `# パラソルドメイン言語: ナレッジ管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
組織の知識を体系的に管理し、メンバー間で効果的に共有・活用することで、組織全体の知的資産を最大化するドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式データ
\`\`\`

### カスタム型定義
\`\`\`
記事ステータス: 記事の公開状態 (基本型: ENUM)
  - draft: 下書き
  - published: 公開
  - archived: アーカイブ
  - deleted: 削除済み

知識カテゴリ: 知識の分類 (基本型: ENUM)
  - technical: 技術
  - business: ビジネス
  - process: プロセス
  - best_practice: ベストプラクティス
  - lesson_learned: 教訓
  - reference: リファレンス

評価タイプ: 評価の種類 (基本型: ENUM)
  - helpful: 役立つ
  - not_helpful: 役立たない
  - outdated: 古い情報
  - incorrect: 誤情報
\`\`\`

## エンティティ（Entities）

### 記事 [Article] [ARTICLE]
説明: ナレッジベースの記事を管理するエンティティ

属性:
- 記事ID [ArticleId] [ARTICLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 記事の一意識別子
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 記事のタイトル
- 内容 [Content] [CONTENT]
  - 型: MARKDOWN [MARKDOWN] [MARKDOWN]
  - 説明: 記事の本文（Markdown形式）
- 要約 [Summary] [SUMMARY]
  - 型: STRING_500 [STRING_500] [STRING_500]
  - 説明: 記事の要約
- カテゴリ [Category] [CATEGORY]
  - 型: 知識カテゴリ [KnowledgeCategory] [KNOWLEDGE_CATEGORY]
  - 説明: 記事の分類
- タグ [Tags] [TAGS]
  - 型: タグリスト [TagList] [TAG_LIST]（値オブジェクト）
  - 説明: 記事に付与されたタグ
- ステータス [Status] [STATUS]
  - 型: 記事ステータス [ArticleStatus] [ARTICLE_STATUS]
  - 説明: 記事の公開状態
- 著者リファレンス [AuthorRef] [AUTHOR_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 記事の著者
  - 関連: ユーザー [User] → 記事 [Article]（1..*）
- メタデータ [Metadata] [METADATA]
  - 型: 記事メタデータ [ArticleMetadata] [ARTICLE_METADATA]（値オブジェクト）
  - 説明: 記事の付加情報

不変条件:
- 公開後はタイトルとカテゴリの変更に制限
- アーカイブ済み記事は編集不可

振る舞い:
- 記事公開 [PublishArticle] [PUBLISH_ARTICLE]
  - 目的: 記事を公開状態にする
  - 入力: なし
  - 出力: 公開結果
  - 事前条件: ステータス=下書き
  - 事後条件: ステータス=公開、公開日時設定

#### パラソルドメインイベント
- 記事公開済み [ArticlePublished] [ARTICLE_PUBLISHED]：記事公開時
- 記事更新済み [ArticleUpdated] [ARTICLE_UPDATED]：記事更新時

#### 集約ルート
このエンティティは記事集約のルートエンティティ

### リビジョン [Revision] [REVISION]
説明: 記事の変更履歴を管理するエンティティ

属性:
- リビジョンID [RevisionId] [REVISION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: リビジョンの一意識別子
- 記事ID [ArticleId] [ARTICLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 所属する記事
- バージョン番号 [Version] [VERSION]
  - 型: INTEGER [INTEGER] [INTEGER]
  - 説明: バージョン番号（連番）
- 内容 [Content] [CONTENT]
  - 型: MARKDOWN [MARKDOWN] [MARKDOWN]
  - 説明: その時点の記事内容
- 変更者リファレンス [EditorRef] [EDITOR_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 変更を行ったユーザー
- 変更日時 [EditedAt] [EDITED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 変更日時

### コメント [Comment] [COMMENT]
説明: 記事へのコメントを管理するエンティティ

属性:
- コメントID [CommentId] [COMMENT_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: コメントの一意識別子
- 記事ID [ArticleId] [ARTICLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: コメント対象の記事
- 内容 [Content] [CONTENT]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: コメント本文
- 投稿者リファレンス [CommenterRef] [COMMENTER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: コメント投稿者
- 投稿日時 [PostedAt] [POSTED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 投稿日時

## 値オブジェクト（Value Objects）

### タグリスト [TagList] [TAG_LIST]
- 定義: 記事に付与されるタグの集合
- 属性:
  - タグ [tags] [TAGS]: STRING_50の配列
- 制約: 最大10個、重複不可、小文字のみ
- 使用エンティティ: 記事 [Article]
- 例: ["react", "typescript", "best-practice"]

### 記事メタデータ [ArticleMetadata] [ARTICLE_METADATA]
- 定義: 記事の付加情報
- 属性:
  - 閲覧数 [viewCount] [VIEW_COUNT]: INTEGER
  - いいね数 [likeCount] [LIKE_COUNT]: INTEGER
  - 最終更新日 [lastUpdated] [LAST_UPDATED]: TIMESTAMP
  - 公開日 [publishedAt] [PUBLISHED_AT]: TIMESTAMP
  - 推定読了時間 [readingTime] [READING_TIME]: INTEGER（分）
- 制約: すべて0以上の値
- 使用エンティティ: 記事 [Article]

### 検索クエリ [SearchQuery] [SEARCH_QUERY]
- 定義: 記事検索の条件
- 属性:
  - キーワード [keywords] [KEYWORDS]: STRING_255
  - カテゴリ [categories] [CATEGORIES]: 知識カテゴリの配列
  - タグ [tags] [TAGS]: STRING_50の配列
  - 期間 [dateRange] [DATE_RANGE]: 日付範囲
- 制約: 少なくとも1つの条件が必要
- 使用エンティティ: なし（検索サービスで使用）

## 集約（Aggregates）

### 記事集約 [ArticleAggregate] [ARTICLE_AGGREGATE]
- **集約ルート**: 記事 [Article]
- **含まれるエンティティ**: 
  - リビジョン [Revision]：記事の変更履歴（0..*）
  - コメント [Comment]：記事へのコメント（0..*）
- **含まれる値オブジェクト**:
  - タグリスト [TagList]：記事のタグ
  - 記事メタデータ [ArticleMetadata]：記事の統計情報
- **トランザクション境界**: 記事本体の更新は単独、履歴は別トランザクション
- **不変条件**: 
  - 公開記事は必ず1つ以上のリビジョンを持つ
  - リビジョンのバージョン番号は連続
  - 削除済み記事へのコメント追加不可
- **外部参照ルール**:
  - 集約外からは記事IDのみで参照
  - リビジョンとコメントへの直接アクセスは禁止

### FAQ集約 [FAQAggregate] [FAQ_AGGREGATE]
- **集約ルート**: FAQ [FAQ]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 評価統計 [RatingStats]：評価の集計情報
- **トランザクション境界**: FAQ単体で完結
- **不変条件**: 
  - 質問と回答は必須
  - 公開後の質問文変更不可
- **外部参照ルール**:
  - FAQIDのみで参照

## ドメインサービス

### 記事検索サービス [ArticleSearchService] [ARTICLE_SEARCH_SERVICE]
記事の全文検索と関連記事の推薦を行うサービス

#### 提供機能
- 全文検索 [FullTextSearch] [FULL_TEXT_SEARCH]
  - 目的: キーワードで記事を検索
  - 入力: 検索クエリ
  - 出力: 記事リスト（スコア順）
  - 制約: 公開記事のみ対象

- 関連記事推薦 [RecommendRelated] [RECOMMEND_RELATED]
  - 目的: 類似記事を推薦
  - 入力: 記事ID
  - 出力: 関連記事リスト
  - 制約: 同一カテゴリ優先

## ドメインイベント

### 記事公開済み [ArticlePublished] [ARTICLE_PUBLISHED]
- **発生タイミング**: 記事が公開された時
- **ペイロード**: 
  - 記事ID [articleId]: UUID
  - タイトル [title]: STRING_255
  - 著者ID [authorId]: UUID
  - カテゴリ [category]: 知識カテゴリ

### 記事評価済み [ArticleRated] [ARTICLE_RATED]
- **発生タイミング**: 記事が評価された時
- **ペイロード**: 
  - 記事ID [articleId]: UUID
  - 評価者ID [raterId]: UUID
  - 評価 [rating]: 評価タイプ

## ビジネスルール

### 記事管理ルール
1. **公開権限**: 下書きは著者のみ閲覧可能
2. **編集権限**: 著者と管理者のみ編集可能
3. **アーカイブ条件**: 6ヶ月間更新なしで自動アーカイブ

### コメントルール
1. **投稿制限**: 公開記事のみコメント可能
2. **編集期限**: 投稿後30分以内のみ編集可能
3. **削除権限**: 投稿者と管理者のみ削除可能

### エラーパターン
- 1001: 権限不足エラー
- 1002: 記事ステータスエラー
- 2001: タグ数超過エラー

## リポジトリインターフェース

### 記事リポジトリ [ArticleRepository] [ARTICLE_REPOSITORY]
集約: 記事集約 [ArticleAggregate]

基本操作:
- findById(id: UUID): 記事 [Article]
- save(article: 記事): void
- delete(id: UUID): void

検索操作:
- findByCategory(category: 知識カテゴリ): 記事[]
- findByTags(tags: string[]): 記事[]
- findPublishedByAuthor(authorId: UUID): 記事[]

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
- [x] 外部からのアクセスは集約ルート経由のみ`

    fs.writeFileSync(
      path.join(domainLangDir, 'knowledge-cocreation-v2.md'),
      knowledgeDomainLanguage
    )
    
    await updateService('knowledge-cocreation', knowledgeDomainLanguage)
    
    // 4. 収益最適化サービス
    const revenueDomainLanguage = `# パラソルドメイン言語: 財務管理ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
プロジェクトの収益性を追跡し、コストを最適化することで、組織の財務健全性を維持・向上させるドメイン

## ユビキタス言語定義

### 基本型定義
\`\`\`
UUID: 一意識別子（36文字）
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
MONEY: 金額（通貨単位付き）
\`\`\`

### カスタム型定義
\`\`\`
請求書ステータス: 請求書の状態 (基本型: ENUM)
  - draft: 下書き
  - sent: 送付済み
  - paid: 支払済み
  - overdue: 支払期限超過
  - cancelled: キャンセル

支払条件: 支払いの条件 (基本型: ENUM)
  - net_30: 30日以内
  - net_60: 60日以内
  - net_90: 90日以内
  - immediate: 即時
  - milestone: マイルストーン払い

費用カテゴリ: 費用の分類 (基本型: ENUM)
  - labor: 人件費
  - travel: 旅費交通費
  - equipment: 機器・設備費
  - software: ソフトウェア費
  - consulting: 外部コンサル費
  - other: その他
\`\`\`

## エンティティ（Entities）

### 請求書 [Invoice] [INVOICE]
説明: クライアントへの請求を管理するエンティティ

属性:
- 請求書ID [InvoiceId] [INVOICE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 請求書の一意識別子
- 請求書番号 [InvoiceNumber] [INVOICE_NUMBER]
  - 型: STRING_50 [STRING_50] [STRING_50]
  - 説明: 請求書の管理番号
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 請求対象プロジェクト
  - 関連: プロジェクト [Project] → 請求書 [Invoice]（1..*）
- クライアントリファレンス [ClientRef] [CLIENT_REF]
  - 型: 組織ID [OrganizationId] [ORGANIZATION_ID]（参照）
  - 説明: 請求先クライアント
  - 関連: 組織 [Organization] → 請求書 [Invoice]（1..*）
- 請求期間 [BillingPeriod] [BILLING_PERIOD]
  - 型: 期間 [Period] [PERIOD]（値オブジェクト）
  - 説明: 請求対象期間
- 請求金額 [Amount] [AMOUNT]
  - 型: 金額 [Money] [MONEY]（値オブジェクト）
  - 説明: 請求総額
- ステータス [Status] [STATUS]
  - 型: 請求書ステータス [InvoiceStatus] [INVOICE_STATUS]
  - 説明: 請求書の状態
- 支払条件 [PaymentTerms] [PAYMENT_TERMS]
  - 型: 支払条件 [PaymentTerms] [PAYMENT_TERMS]
  - 説明: 支払いの条件
- 発行日 [IssuedDate] [ISSUED_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: 請求書発行日
- 支払期限 [DueDate] [DUE_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: 支払期限日

不変条件:
- 発行後の金額変更不可
- 支払済み請求書の編集不可

振る舞い:
- 請求書発行 [IssueInvoice] [ISSUE_INVOICE]
  - 目的: 請求書を正式発行する
  - 入力: なし
  - 出力: 発行結果
  - 事前条件: ステータス=下書き
  - 事後条件: ステータス=送付済み、発行日設定

#### パラソルドメインイベント
- 請求書発行済み [InvoiceIssued] [INVOICE_ISSUED]：請求書発行時
- 支払完了 [PaymentCompleted] [PAYMENT_COMPLETED]：支払い完了時

#### 集約ルート
このエンティティは請求書集約のルートエンティティ

### 請求明細 [InvoiceItem] [INVOICE_ITEM]
説明: 請求書の明細項目を管理するエンティティ

属性:
- 明細ID [ItemId] [ITEM_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 明細の一意識別子
- 請求書ID [InvoiceId] [INVOICE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 所属する請求書
- 項目名 [ItemName] [ITEM_NAME]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 請求項目の名称
- 数量 [Quantity] [QUANTITY]
  - 型: DECIMAL [DECIMAL] [DECIMAL]
  - 説明: 数量
- 単価 [UnitPrice] [UNIT_PRICE]
  - 型: 金額 [Money] [MONEY]（値オブジェクト）
  - 説明: 単位あたり価格
- 小計 [Subtotal] [SUBTOTAL]
  - 型: 金額 [Money] [MONEY]（値オブジェクト）
  - 説明: 明細の小計

### 費用 [Expense] [EXPENSE]
説明: プロジェクト関連費用を管理するエンティティ

属性:
- 費用ID [ExpenseId] [EXPENSE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 費用の一意識別子
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 関連プロジェクト
  - 関連: プロジェクト [Project] → 費用 [Expense]（1..*）
- カテゴリ [Category] [CATEGORY]
  - 型: 費用カテゴリ [ExpenseCategory] [EXPENSE_CATEGORY]
  - 説明: 費用の分類
- 金額 [Amount] [AMOUNT]
  - 型: 金額 [Money] [MONEY]（値オブジェクト）
  - 説明: 費用金額
- 発生日 [IncurredDate] [INCURRED_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: 費用発生日
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 費用の詳細説明
- 承認状態 [ApprovalStatus] [APPROVAL_STATUS]
  - 型: 承認ステータス [ApprovalStatus] [APPROVAL_STATUS]（値オブジェクト）
  - 説明: 承認の状態

#### 集約ルート
このエンティティは費用集約のルートエンティティ

## 値オブジェクト（Value Objects）

### 金額 [Money] [MONEY]
- 定義: 通貨を含む金銭価値
- 属性:
  - 金額 [amount] [AMOUNT]: DECIMAL
  - 通貨 [currency] [CURRENCY]: STRING_3（JPY, USD等）
- 制約: 金額は0以上、通貨は有効なISO 4217コード
- 使用エンティティ: 請求書 [Invoice]、請求明細 [InvoiceItem]、費用 [Expense]
- 例: 1,000,000 JPY

### 期間 [Period] [PERIOD]
- 定義: 開始日と終了日で表される期間
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
- 制約: 開始日は終了日以前
- 使用エンティティ: 請求書 [Invoice]、収益予測 [RevenueForecast]
- 例: 2025-01-01 〜 2025-01-31

### 承認ステータス [ApprovalStatus] [APPROVAL_STATUS]
- 定義: 承認の状態と履歴
- 属性:
  - 状態 [status] [STATUS]: ENUM（pending, approved, rejected）
  - 承認者 [approver] [APPROVER]: STRING_100
  - 承認日時 [approvedAt] [APPROVED_AT]: TIMESTAMP
  - コメント [comment] [COMMENT]: STRING_500（任意）
- 制約: 承認済みは変更不可
- 使用エンティティ: 費用 [Expense]

## 集約（Aggregates）

### 請求書集約 [InvoiceAggregate] [INVOICE_AGGREGATE]
- **集約ルート**: 請求書 [Invoice]
- **含まれるエンティティ**: 
  - 請求明細 [InvoiceItem]：請求書の明細項目（1..*）
- **含まれる値オブジェクト**:
  - 金額 [Money]：請求金額、明細金額で使用
  - 期間 [Period]：請求対象期間で使用
- **トランザクション境界**: 請求書と明細は同一トランザクション
- **不変条件**: 
  - 請求書の総額は明細の合計と一致
  - 発行済み請求書は金額変更不可
  - 明細は1件以上必要
- **外部参照ルール**:
  - 集約外からは請求書IDのみで参照
  - 請求明細への直接アクセスは禁止

### 費用集約 [ExpenseAggregate] [EXPENSE_AGGREGATE]
- **集約ルート**: 費用 [Expense]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 金額 [Money]：費用金額で使用
  - 承認ステータス [ApprovalStatus]：承認状態で使用
- **トランザクション境界**: 費用単体で完結
- **不変条件**: 
  - 承認済み費用は編集不可
  - 金額は0以上
- **外部参照ルール**:
  - 費用IDのみで参照

## ドメインサービス

### 収益性分析サービス [ProfitabilityAnalysisService] [PROFITABILITY_ANALYSIS_SERVICE]
プロジェクトの収益性を分析するサービス

#### 提供機能
- 粗利益計算 [CalculateGrossProfit] [CALCULATE_GROSS_PROFIT]
  - 目的: プロジェクトの粗利益を計算
  - 入力: プロジェクトID、期間
  - 出力: 粗利益レポート
  - 制約: 確定した請求書と費用のみ対象

- 収益予測 [ForecastRevenue] [FORECAST_REVENUE]
  - 目的: 将来の収益を予測
  - 入力: プロジェクトID、予測期間
  - 出力: 収益予測レポート
  - 制約: 過去データに基づく予測

## ドメインイベント

### 請求書発行済み [InvoiceIssued] [INVOICE_ISSUED]
- **発生タイミング**: 請求書が発行された時
- **ペイロード**: 
  - 請求書ID [invoiceId]: UUID
  - プロジェクトID [projectId]: UUID
  - 金額 [amount]: Money
  - 発行日 [issuedDate]: DATE

### 支払完了 [PaymentCompleted] [PAYMENT_COMPLETED]
- **発生タイミング**: 支払いが完了した時
- **ペイロード**: 
  - 請求書ID [invoiceId]: UUID
  - 支払金額 [paidAmount]: Money
  - 支払日 [paidDate]: DATE

### 費用承認済み [ExpenseApproved] [EXPENSE_APPROVED]
- **発生タイミング**: 費用が承認された時
- **ペイロード**: 
  - 費用ID [expenseId]: UUID
  - プロジェクトID [projectId]: UUID
  - 金額 [amount]: Money

## ビジネスルール

### 請求書ルール
1. **最小請求額**: 10,000円以上から請求可能
2. **請求サイクル**: 月次請求が基本
3. **支払期限**: デフォルトは請求書発行から30日

### 費用管理ルール
1. **承認限度額**: 10万円以上は部門長承認必須
2. **経費精算期限**: 発生から1ヶ月以内
3. **領収書必須**: 5,000円以上は領収書添付必須

### エラーパターン
- 1001: 最小請求額未満エラー
- 1002: 承認権限不足エラー
- 1003: 精算期限超過エラー

## リポジトリインターフェース

### 請求書リポジトリ [InvoiceRepository] [INVOICE_REPOSITORY]
集約: 請求書集約 [InvoiceAggregate]

基本操作:
- findById(id: UUID): 請求書 [Invoice]
- save(invoice: 請求書): void

検索操作:
- findByProject(projectId: UUID): 請求書[]
- findOverdue(): 請求書[]
- findByStatus(status: 請求書ステータス): 請求書[]

### 費用リポジトリ [ExpenseRepository] [EXPENSE_REPOSITORY]
集約: 費用集約 [ExpenseAggregate]

基本操作:
- findById(id: UUID): 費用 [Expense]
- save(expense: 費用): void

検索操作:
- findByProject(projectId: UUID): 費用[]
- findPendingApproval(): 費用[]

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
- [x] 外部からのアクセスは集約ルート経由のみ`

    fs.writeFileSync(
      path.join(domainLangDir, 'revenue-optimization-v2.md'),
      revenueDomainLanguage
    )
    
    await updateService('revenue-optimization', revenueDomainLanguage)
    
    console.log('\n✨ All services updated with aggregate definitions successfully!')
    
    // 確認
    console.log('\n📊 確認中...')
    const updatedServices = await prisma.services.findMany({
      select: {
        name: true,
        domainLanguageDefinition: true
      }
    })
    
    console.log('\n✅ アグリゲート定義の状況:')
    updatedServices.forEach(service => {
      const hasAggregates = service.domainLanguageDefinition?.includes('## 集約（Aggregates）')
      console.log(`  ${service.name}: ${hasAggregates ? '✓ アグリゲート定義あり' : '✗ アグリゲート定義なし'}`)
    })
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)