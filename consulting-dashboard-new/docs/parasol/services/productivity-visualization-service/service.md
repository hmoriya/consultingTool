# 生産性可視化サービス

## サービス概要
**名前**: productivity-visualization-service
**表示名**: 生産性可視化サービス
**説明**: 工数の正確な記録と分析により生産性を可視化

## ビジネス価値
- **効率化**: 業務プロセスの自動化と最適化
- **品質向上**: サービス品質の継続的改善
- **リスク低減**: 潜在的リスクの早期発見と対処

## ドメイン言語

**バージョン**: 1.0.0
**更新日**: 2024-01-20

### パラソルドメイン概要
工数の正確な記録と分析により、個人とチームの生産性を可視化し、改善機会を特定するドメインモデル。タイムシート、工数実績、稼働率、生産性指標の関係を定義。

### ユビキタス言語定義

#### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
TEXT: 長文テキスト
DATE: 日付（YYYY-MM-DD形式）
TIME: 時刻（HH:MM:SS形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式データ
DURATION: 期間（ISO8601形式）
```

### エンティティ定義

#### Timesheet（タイムシート）
**概要**: 一定期間の工数記録をまとめた申請単位
**識別子**: timesheetId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| userId | UUID | ○ | ユーザーID |
| periodStart | DATE | ○ | 期間開始日（通常週初） |
| periodEnd | DATE | ○ | 期間終了日（通常週末） |
| totalHours | DECIMAL | ○ | 合計工数 |
| billableHours | DECIMAL | ○ | 課金対象工数 |
| nonBillableHours | DECIMAL | ○ | 非課金工数 |
| overtimeHours | DECIMAL | ○ | 残業時間 |
| status | ENUM | ○ | ステータス（Draft/Submitted/Approved/Rejected/Revised） |
| submittedAt | TIMESTAMP | × | 提出日時 |
| submittedBy | UUID | × | 提出者ID |
| approvedAt | TIMESTAMP | × | 承認日時 |
| approvedBy | UUID | × | 承認者ID |
| rejectionReason | TEXT | × | 却下理由 |
| comments | TEXT | × | コメント |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 期間は重複不可
- 承認後の編集は不可（要再提出）
- 週40時間を超える場合は理由必須

#### TimeEntry（工数記録）
**概要**: 個別の作業時間記録
**識別子**: timeEntryId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| timesheetId | UUID | ○ | タイムシートID |
| userId | UUID | ○ | ユーザーID |
| projectId | UUID | ○ | プロジェクトID |
| taskId | UUID | × | タスクID |
| activityType | ENUM | ○ | 活動タイプ（Development/Meeting/Review/Documentation/Support/Other） |
| date | DATE | ○ | 作業日 |
| startTime | TIME | × | 開始時刻 |
| endTime | TIME | × | 終了時刻 |
| hours | DECIMAL | ○ | 工数（時間） |
| billable | BOOLEAN | ○ | 課金対象フラグ |
| description | TEXT | ○ | 作業内容説明 |
| location | ENUM | × | 作業場所（Office/Remote/Client/Other） |
| tags | JSON | × | タグリスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 同一日の合計は24時間以内
- 最小単位は0.25時間（15分）
- 過去2週間以上前の記録は編集不可

#### WorkPattern（勤務パターン）
**概要**: 個人の標準的な勤務パターン定義
**識別子**: workPatternId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| userId | UUID | ○ | ユーザーID |
| name | STRING_100 | ○ | パターン名 |
| isDefault | BOOLEAN | ○ | デフォルトフラグ |
| weeklyHours | DECIMAL | ○ | 週標準工数 |
| dailyHours | DECIMAL | ○ | 日標準工数 |
| workDays | JSON | ○ | 勤務曜日リスト |
| startTime | TIME | ○ | 標準開始時刻 |
| endTime | TIME | ○ | 標準終了時刻 |
| breakDuration | DURATION | ○ | 休憩時間 |
| flexTime | BOOLEAN | ○ | フレックスタイム適用 |
| coreTimeStart | TIME | × | コアタイム開始 |
| coreTimeEnd | TIME | × | コアタイム終了 |
| effectiveFrom | DATE | ○ | 適用開始日 |
| effectiveTo | DATE | × | 適用終了日 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### UtilizationRate（稼働率）
**概要**: 期間別の稼働率記録
**識別子**: utilizationRateId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| userId | UUID | × | ユーザーID（個人稼働率） |
| teamId | UUID | × | チームID（チーム稼働率） |
| periodType | ENUM | ○ | 期間タイプ（Daily/Weekly/Monthly/Quarterly） |
| periodStart | DATE | ○ | 期間開始日 |
| periodEnd | DATE | ○ | 期間終了日 |
| availableHours | DECIMAL | ○ | 利用可能時間 |
| plannedHours | DECIMAL | ○ | 計画工数 |
| actualHours | DECIMAL | ○ | 実績工数 |
| billableHours | DECIMAL | ○ | 課金工数 |
| utilizationRate | PERCENTAGE | ○ | 稼働率（実績/利用可能） |
| billableRate | PERCENTAGE | ○ | 課金率（課金/実績） |
| productivityIndex | DECIMAL | × | 生産性指標 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 稼働率 = (実績工数 / 利用可能時間) × 100
- 課金率 = (課金工数 / 実績工数) × 100
- 目標稼働率は80-85%

#### ProductivityMetric（生産性指標）
**概要**: 生産性を測定する各種指標
**識別子**: productivityMetricId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| userId | UUID | × | ユーザーID |
| teamId | UUID | × | チームID |
| projectId | UUID | × | プロジェクトID |
| metricType | ENUM | ○ | 指標タイプ（Velocity/Efficiency/Quality/Output） |
| periodStart | DATE | ○ | 測定期間開始 |
| periodEnd | DATE | ○ | 測定期間終了 |
| metricValue | DECIMAL | ○ | 指標値 |
| targetValue | DECIMAL | × | 目標値 |
| unit | STRING_20 | ○ | 単位 |
| trend | ENUM | × | トレンド（Improving/Stable/Declining） |
| calculationMethod | TEXT | × | 計算方法 |
| dataSource | JSON | × | データソース |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### ApprovalWorkflow（承認ワークフロー）
**概要**: タイムシート承認のワークフロー定義
**識別子**: approvalWorkflowId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| timesheetId | UUID | ○ | タイムシートID |
| currentStep | INTEGER | ○ | 現在のステップ |
| totalSteps | INTEGER | ○ | 総ステップ数 |
| status | ENUM | ○ | ステータス（Pending/InProgress/Completed/Cancelled） |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### ApprovalStep（承認ステップ）
**概要**: 承認ワークフローの各ステップ
**識別子**: approvalStepId

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| workflowId | UUID | ○ | ワークフローID |
| stepNumber | INTEGER | ○ | ステップ番号 |
| approverId | UUID | ○ | 承認者ID |
| approvalType | ENUM | ○ | 承認タイプ（Sequential/Parallel） |
| status | ENUM | ○ | ステータス（Pending/Approved/Rejected/Skipped） |
| approvedAt | TIMESTAMP | × | 承認日時 |
| comments | TEXT | × | コメント |
| delegatedTo | UUID | × | 代理承認者ID |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### 値オブジェクト定義

#### TimeRange（時間範囲）
**概要**: 開始と終了を持つ時間範囲

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| startTime | TIME | ○ | 開始時刻 |
| endTime | TIME | ○ | 終了時刻 |
| duration | DURATION | ○ | 期間 |
| includesBreak | BOOLEAN | ○ | 休憩含むフラグ |

#### ProductivityScore（生産性スコア）
**概要**: 複合的な生産性評価

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| efficiency | DECIMAL | ○ | 効率性（1-10） |
| quality | DECIMAL | ○ | 品質（1-10） |
| timeliness | DECIMAL | ○ | 適時性（1-10） |
| overall | DECIMAL | ○ | 総合スコア |

### 集約定義

#### TimesheetAggregate
**集約ルート**: Timesheet
**境界**: Timesheet, TimeEntry, ApprovalWorkflow, ApprovalStep

**不変条件**:
- タイムシートの合計工数 = 全TimeEntryの合計
- 承認済みタイムシートの工数変更は不可
- 期間の重複は許可しない

#### UtilizationAggregate
**集約ルート**: UtilizationRate
**境界**: UtilizationRate, ProductivityMetric

**不変条件**:
- 稼働率は0-100%の範囲
- 実績工数は利用可能時間を超えない（残業除く）

### ドメインサービス

#### TimesheetCalculationService
**概要**: タイムシート関連の計算処理
**操作**:
- `calculateTotalHours(timesheetId) -> DECIMAL`: 合計工数計算
- `calculateBillableRate(timesheetId) -> PERCENTAGE`: 課金率計算
- `calculateOvertime(timesheetId) -> DECIMAL`: 残業時間計算
- `validateTimeEntries(entries) -> ValidationResult`: 工数記録検証

#### UtilizationAnalysisService
**概要**: 稼働率の分析と予測
**操作**:
- `calculateUtilization(userId, period) -> UtilizationRate`: 稼働率計算
- `analyzeTeamUtilization(teamId) -> TeamUtilization`: チーム稼働分析
- `predictUtilization(userId, futurePeriod) -> Forecast`: 稼働率予測
- `identifyUnderutilized(threshold) -> User[]`: 低稼働メンバー特定

#### ProductivityMeasurementService
**概要**: 生産性の測定と評価
**操作**:
- `measureProductivity(userId, period) -> ProductivityScore`: 生産性測定
- `compareProductivity(userIds, period) -> Comparison`: 生産性比較
- `calculateROI(projectId) -> DECIMAL`: ROI計算
- `identifyImprovementAreas(userId) -> Suggestion[]`: 改善領域特定

### ドメインイベント

#### TimesheetSubmitted
**発生条件**: タイムシートが提出された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "timesheetId": "UUID",
  "userId": "UUID",
  "periodStart": "DATE",
  "periodEnd": "DATE",
  "totalHours": "DECIMAL",
  "submittedAt": "TIMESTAMP"
}
```

#### TimesheetApproved
**発生条件**: タイムシートが承認された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "timesheetId": "UUID",
  "approvedBy": "UUID",
  "approvedAt": "TIMESTAMP",
  "billableHours": "DECIMAL"
}
```

#### OvertimeDetected
**発生条件**: 規定時間を超える残業が記録された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "userId": "UUID",
  "date": "DATE",
  "overtimeHours": "DECIMAL",
  "totalHours": "DECIMAL"
}
```

#### LowUtilizationAlert
**発生条件**: 稼働率が閾値を下回った時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "userId": "UUID",
  "period": "STRING",
  "utilizationRate": "PERCENTAGE",
  "threshold": "PERCENTAGE"
}
```

### リポジトリインターフェース

#### TimesheetRepository
```
interface TimesheetRepository {
  findById(id: UUID): Timesheet | null
  findByUserAndPeriod(userId: UUID, period: DateRange): Timesheet[]
  findPendingApproval(approverId: UUID): Timesheet[]
  save(timesheet: Timesheet): void
  delete(id: UUID): void
}
```

#### TimeEntryRepository
```
interface TimeEntryRepository {
  findById(id: UUID): TimeEntry | null
  findByTimesheetId(timesheetId: UUID): TimeEntry[]
  findByProjectId(projectId: UUID): TimeEntry[]
  findByDateRange(userId: UUID, range: DateRange): TimeEntry[]
  save(entry: TimeEntry): void
  delete(id: UUID): void
}
```

#### UtilizationRateRepository
```
interface UtilizationRateRepository {
  findById(id: UUID): UtilizationRate | null
  findByUserAndPeriod(userId: UUID, period: DateRange): UtilizationRate[]
  findByTeam(teamId: UUID): UtilizationRate[]
  save(rate: UtilizationRate): void
}
```

### ビジネスルール

#### タイムシート管理ルール
1. **提出期限**: 週末から3営業日以内に提出
2. **最小単位**: 15分単位で記録
3. **上限時間**: 1日12時間、週60時間まで
4. **修正期限**: 承認後の修正は1週間以内

#### 承認ルール
1. **承認者**: 直属上司またはプロジェクトマネージャー
2. **承認期限**: 提出から2営業日以内
3. **自動承認**: 期限超過時は自動承認（設定可能）
4. **却下時**: 理由を明記し再提出要求

#### 稼働率管理ルール
1. **目標稼働率**: 80-85%を維持
2. **アラート閾値**: 70%未満または95%以上
3. **計算方法**: (課金工数 / 標準勤務時間) × 100

#### 生産性評価ルール
1. **評価頻度**: 月次で自動計算
2. **評価指標**: 品質、効率、適時性の3軸
3. **改善提案**: スコア低下時に自動提案

### サービス間連携

#### 依存サービス
- **セキュアアクセスサービス**: ユーザー認証、権限
- **プロジェクト成功支援サービス**: プロジェクト、タスク情報
- **タレント最適化サービス**: メンバー情報、スキル

#### 提供インターフェース
- **工数データAPI**: 実績工数情報を提供
- **稼働率API**: 個人・チーム稼働率を提供
- **生産性API**: 生産性指標を提供

#### イベント連携
- **TimesheetApproved**: 財務サービスへ課金情報連携
- **OvertimeDetected**: 管理者へアラート通知
- **LowUtilizationAlert**: リソース管理サービスへ通知

## API仕様概要
- RESTful API設計
- JWT認証
- Rate Limiting実装
- OpenAPI仕様準拠

## データベース設計概要
- PostgreSQL/SQLite対応
- マイクロサービス対応
- 監査ログテーブル
- パフォーマンス最適化

## 提供ケーパビリティ
- 工数を正確に把握する能力
