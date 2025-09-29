/**
 * シンプルなアグリゲート更新スクリプト
 */

import { PrismaClient } from '@prisma/parasol-client'

const prisma = new PrismaClient()

// 生産性可視化サービスのドメイン言語（アグリゲート追加版）
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
- 作成日時 [CreatedAt] [CREATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: タイムシート作成日時
- 更新日時 [UpdatedAt] [UPDATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 最終更新日時

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
- カテゴリ [Category] [CATEGORY]
  - 型: 作業カテゴリ [WorkCategory] [WORK_CATEGORY]
  - 説明: 作業の分類
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 作業内容の詳細

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

### 承認コメント [ApprovalComment] [APPROVAL_COMMENT]
- 定義: 承認/却下時のコメント
- 属性:
  - コメント [comment] [COMMENT]: STRING_500
  - 記録者 [recordedBy] [RECORDED_BY]: STRING_100
  - 記録日時 [recordedAt] [RECORDED_AT]: TIMESTAMP
- 制約: 却下時はコメント必須
- 使用エンティティ: タイムシート承認 [TimesheetApproval]

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

### タイムシート承認集約 [TimesheetApprovalAggregate] [TIMESHEET_APPROVAL_AGGREGATE]
- **集約ルート**: タイムシート承認 [TimesheetApproval]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 承認コメント [ApprovalComment]：承認/却下理由として使用
- **トランザクション境界**: 承認記録は独立したトランザクション
- **不変条件**: 
  - 一度決定した承認は変更不可
  - 承認者は記録者と異なる必要がある
- **外部参照ルール**:
  - タイムシートIDで関連付け
  - 承認履歴は参照のみ

## ドメインサービス

### 稼働率計算サービス [UtilizationCalculationService] [UTILIZATION_CALCULATION_SERVICE]
稼働率の計算と分析を行うサービス

#### 提供機能
- 個人稼働率計算 [CalculatePersonalUtilization] [CALCULATE_PERSONAL_UTILIZATION]
  - 目的: 個人の稼働率を計算
  - 入力: ユーザーID、期間
  - 出力: 稼働率レポート
  - 制約: 承認済みタイムシートのみ対象

- チーム稼働率計算 [CalculateTeamUtilization] [CALCULATE_TEAM_UTILIZATION]
  - 目的: チーム全体の稼働率を計算
  - 入力: チームID、期間
  - 出力: チーム稼働率レポート
  - 制約: アクティブメンバーのみ対象

## ドメインイベント

### タイムシート提出済み [TimesheetSubmitted] [TIMESHEET_SUBMITTED]
- **発生タイミング**: タイムシートが提出された時
- **ペイロード**: 
  - タイムシートID [timesheetId]: UUID
  - 記録者ID [recorderId]: UUID
  - 対象週 [targetWeek]: WeekInfo

### タイムシート承認済み [TimesheetApproved] [TIMESHEET_APPROVED]
- **発生タイミング**: タイムシートが承認された時
- **ペイロード**: 
  - タイムシートID [timesheetId]: UUID
  - 承認者ID [approverId]: UUID
  - 承認日時 [approvedAt]: TIMESTAMP

### タイムシート却下済み [TimesheetRejected] [TIMESHEET_REJECTED]
- **発生タイミング**: タイムシートが却下された時
- **ペイロード**: 
  - タイムシートID [timesheetId]: UUID
  - 承認者ID [approverId]: UUID
  - 却下理由 [reason]: STRING_500

## ビジネスルール

### タイムシート記録ルール
1. **週締めルール**: タイムシートは週単位（月曜開始、日曜終了）で作成
2. **提出期限**: 翌週月曜日の正午まで
3. **最大時間制限**: 1日の作業時間は24時間以内
4. **最小単位**: 15分単位で記録

### 承認ルール
1. **承認権限**: 直属の上司またはPMが承認
2. **自己承認禁止**: 自分のタイムシートは承認不可
3. **却下時コメント必須**: 却下時は理由の記載が必須

### エラーパターン
- 1xxx: ドメインエラー
  - 1001: 作業時間超過エラー
  - 1002: 提出期限超過エラー
  - 1003: 承認権限なしエラー
- 2xxx: アプリケーションエラー
  - 2001: 必須項目未入力エラー
  - 2002: 不正な日付形式エラー
- 3xxx: システムエラー
  - 3001: データベース接続エラー

## リポジトリインターフェース

### タイムシートリポジトリ [TimesheetRepository] [TIMESHEET_REPOSITORY]
集約: タイムシート集約 [TimesheetAggregate]

基本操作:
- findById(id: UUID): タイムシート [Timesheet]
- save(timesheet: タイムシート): void
- delete(id: UUID): void

検索操作:
- findByUserAndWeek(userId: UUID, week: WeekInfo): タイムシート
- findPendingApprovals(approverId: UUID): タイムシート[]

### タイムシート承認リポジトリ [TimesheetApprovalRepository] [TIMESHEET_APPROVAL_REPOSITORY]
集約: タイムシート承認集約 [TimesheetApprovalAggregate]

基本操作:
- findById(id: UUID): タイムシート承認 [TimesheetApproval]
- save(approval: タイムシート承認): void

検索操作:
- findByTimesheetId(timesheetId: UUID): タイムシート承認[]

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

async function main() {
  try {
    console.log('🔄 Updating Productivity Visualization Service...')
    await prisma.services.update({
      where: { id: 'cmg3s7nqc0003ymso4g26o0uj' },
      data: {
        domainLanguageDefinition: productivityDomainLanguage,
        updatedAt: new Date()
      }
    })
    console.log('✅ Updated successfully')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()