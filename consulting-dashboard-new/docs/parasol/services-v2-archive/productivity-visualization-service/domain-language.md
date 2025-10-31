# パラソルドメイン言語: 生産性可視化サービス

**バージョン**: 2.0.0
**更新日**: 2025-10-28
**パラソル設計仕様**: v2.0準拠

## パラソルドメイン概要
工数の正確な記録・承認・分析を通じて組織の生産性を多角的に可視化し、AI駆動の戦略的インサイト生成による競争優位性を確立するドメインモデル。DDD原則とパラソル設計v2.0仕様に基づき、明確な集約境界とユースケース利用型マイクロサービス設計により、タイムシート管理、承認ワークフロー、稼働率分析、生産性最適化の関係を体系的に定義。すべてのエンティティは適切な集約に所属し、他サービスとのユースケース利用型連携による疎結合を実現。

## ユビキタス言語定義

### 基本型定義
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

#### Timesheet（タイムシート）<<entity>><<aggregate root>>
**概要**: 一定期間の工数記録をまとめた申請単位の集約ルート
**識別性**: timesheetIdによって一意に識別される
**ライフサイクル**: 作成→記録→提出→承認/却下→確定
**集約所属**: TimesheetAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### TimeEntry（工数記録）<<entity>>
**概要**: 個別の作業時間記録エンティティ
**識別性**: timeEntryIdによって一意に識別される
**ライフサイクル**: 作成→編集→確定→集計
**集約所属**: TimesheetAggregate
**ステレオタイプ**: entity

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

#### WorkPattern（勤務パターン）<<entity>><<aggregate root>>
**概要**: 個人の標準的な勤務パターン定義の集約ルート
**識別性**: workPatternIdによって一意に識別される
**ライフサイクル**: 作成→設定→適用→更新→無効化
**集約所属**: WorkPatternAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### UtilizationRate（稼働率）<<entity>><<aggregate root>>
**概要**: 期間別の稼働率記録の集約ルート
**識別性**: utilizationRateIdによって一意に識別される
**ライフサイクル**: 計算→記録→分析→レポート
**集約所属**: UtilizationAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

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

#### ProductivityMetric（生産性指標）<<entity>>
**概要**: 生産性を測定する各種指標エンティティ
**識別性**: productivityMetricIdによって一意に識別される
**ライフサイクル**: 測定→計算→記録→比較分析
**集約所属**: UtilizationAggregate
**ステレオタイプ**: entity

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

#### ApprovalWorkflow（承認ワークフロー）<<entity>>
**概要**: タイムシート承認のワークフロー定義エンティティ
**識別性**: approvalWorkflowIdによって一意に識別される
**ライフサイクル**: 開始→進行→完了/中止
**集約所属**: TimesheetAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| timesheetId | UUID | ○ | タイムシートID |
| currentStep | INTEGER | ○ | 現在のステップ |
| totalSteps | INTEGER | ○ | 総ステップ数 |
| status | ENUM | ○ | ステータス（Pending/InProgress/Completed/Cancelled） |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### ApprovalStep（承認ステップ）<<entity>>
**概要**: 承認ワークフローの各ステップエンティティ
**識別性**: approvalStepIdによって一意に識別される
**ライフサイクル**: 待機→処理→承認/却下
**集約所属**: TimesheetAggregate
**ステレオタイプ**: entity

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

#### TimeRange（時間範囲）<<value object>>
**概要**: 開始と終了を持つ時間範囲の値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| startTime | TIME | ○ | 開始時刻 |
| endTime | TIME | ○ | 終了時刻 |
| duration | DURATION | ○ | 期間 |
| includesBreak | BOOLEAN | ○ | 休憩含むフラグ |

#### ProductivityScore（生産性スコア）<<value object>>
**概要**: 複合的な生産性評価の値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| efficiency | DECIMAL | ○ | 効率性（1-10） |
| quality | DECIMAL | ○ | 品質（1-10） |
| timeliness | DECIMAL | ○ | 適時性（1-10） |
| overall | DECIMAL | ○ | 総合スコア |

### 集約定義

#### TimesheetAggregate（タイムシート集約）<<aggregate>>
**集約ルート**: Timesheet（タイムシート）
**集約境界**: Timesheet（タイムシート）、TimeEntry（工数記録）、ApprovalWorkflow（承認ワークフロー）、ApprovalStep（承認ステップ）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Timesheet（集約ルート・1対1）
- TimeEntry（1対多・タイムシートに含まれる工数記録）
- ApprovalWorkflow（1対1・タイムシートの承認フロー）
- ApprovalStep（1対多・承認ワークフローのステップ）

**包含値オブジェクト**:
- TimeRange（時間範囲情報）

**集約境界の理由**:
- タイムシートとその工数記録は密接に関連し、トランザクション整合性が必要
- 承認ワークフローはタイムシートと同じライフサイクルを持つ
- 工数計算と承認状態の整合性を保つ必要がある

**不変条件**:
- タイムシートの合計工数 = 全TimeEntryの合計
- 承認済みタイムシートの工数変更は不可
- 期間の重複は許可しない
- 承認ワークフローの完了後はタイムシートステータスが確定する

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- Project集約とはprojectIdのみで参照（IDのみ参照）
- WorkPattern集約とはworkPatternIdのみで参照（IDのみ参照）

#### WorkPatternAggregate（勤務パターン集約）<<aggregate>>
**集約ルート**: WorkPattern（勤務パターン）
**集約境界**: WorkPattern（勤務パターン）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- WorkPattern（集約ルート・1対1）

**集約境界の理由**:
- 勤務パターンは独立したライフサイクルを持つ
- 個人の勤務設定は他のエンティティと独立して管理される

**不変条件**:
- デフォルトパターンは1ユーザーに1つまで
- 週労働時間は法定基準内（週40時間基準）
- コアタイムは勤務時間内に設定される
- 適用期間に重複がない

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）

#### UtilizationAggregate（稼働率集約）<<aggregate>>
**集約ルート**: UtilizationRate（稼働率）
**集約境界**: UtilizationRate（稼働率）、ProductivityMetric（生産性指標）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- UtilizationRate（集約ルート・1対1）
- ProductivityMetric（1対多・稼働率に関連する生産性指標）

**包含値オブジェクト**:
- ProductivityScore（生産性スコア）

**集約境界の理由**:
- 稼働率と生産性指標は密接に関連し、同時に計算・更新される
- 分析レポートの整合性を保つために統合管理が必要

**不変条件**:
- 稼働率は0-100%の範囲
- 実績工数は利用可能時間を超えない（残業除く）
- 生産性指標は同一期間の稼働率と整合性を持つ
- 課金率 = (課金工数 / 実績工数) × 100

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- Team集約とはteamIdのみで参照（IDのみ参照）
- Project集約とはprojectIdのみで参照（IDのみ参照）

### ドメインサービス

#### TimesheetCalculationService <<service>>
**概要**: タイムシート集約内の計算処理を行うドメインサービス
**責務**: Timesheet集約内の工数計算、験証、集計処理
**ステレオタイプ**: service

**操作**:
- `calculateTotalHours(timesheetId: UUID) -> DECIMAL`: タイムシートの合計工数計算
- `calculateBillableRate(timesheetId: UUID) -> PERCENTAGE`: 課金率計算と検証
- `calculateOvertime(timesheetId: UUID) -> DECIMAL`: 残業時間計算とアラート
- `validateTimeEntries(entries: TimeEntry[]) -> ValidationResult`: 工数記録の整合性検証
- `processTimesheetSubmission(timesheetId: UUID) -> SubmissionResult`: 提出時の総合検証

#### UtilizationAnalysisService <<service>>
**概要**: 複数集約をまたぐ稼働率分析と予測サービス
**責務**: Utilization集約、Timesheet集約、WorkPattern集約をまたいだ稼働率分析
**ステレオタイプ**: service

**操作**:
- `calculateUtilization(userId: UUID, period: DateRange) -> UtilizationRate`: 個人稼働率の計算と記録
- `analyzeTeamUtilization(teamId: UUID, period: DateRange) -> TeamUtilization`: チーム稼働率の分析とレポート
- `predictUtilization(userId: UUID, futurePeriod: DateRange) -> UtilizationForecast`: 過去データに基づく稼働率予測
- `identifyUtilizationAnomalies(threshold: PERCENTAGE) -> UtilizationAlert[]`: 異常稼働率の特定とアラート
- `generateUtilizationReport(organizationId: UUID, period: DateRange) -> UtilizationReport`: 組織全体の稼働率レポート生成

#### ProductivityMeasurementService <<service>>
**概要**: 生産性の測定、評価、改善提案を行うドメインサービス
**責務**: Utilization集約、Timesheet集約、Project集約をまたいだ生産性測定
**ステレオタイプ**: service

**操作**:
- `measureProductivity(userId: UUID, period: DateRange) -> ProductivityScore`: 個人生産性の総合測定とスコア計算
- `compareProductivity(userIds: UUID[], period: DateRange) -> ProductivityComparison`: メンバー間の生産性比較分析
- `calculateProjectROI(projectId: UUID) -> ROIAnalysis`: プロジェクトROIとコスト効率の計算
- `identifyImprovementOpportunities(userId: UUID) -> ImprovementSuggestion[]`: 生産性向上の改善領域特定
- `benchmarkProductivity(userId: UUID, benchmarkGroup: string) -> BenchmarkResult`: 業界標準や組織内基準との比較

### ドメインイベント

#### TimesheetSubmitted <<event>>
**発生条件**: タイムシートが提出された時
**ステレオタイプ**: event
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

#### TimesheetApproved <<event>>
**発生条件**: タイムシートが承認された時
**ステレオタイプ**: event
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

#### OvertimeDetected <<event>>
**発生条件**: 規定時間を超える残業が記録された時
**ステレオタイプ**: event
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

#### LowUtilizationAlert <<event>>
**発生条件**: 稼働率が閾値を下回った時
**ステレオタイプ**: event
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

#### TimesheetRepository <<repository>>
**責務**: Timesheet集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface TimesheetRepository {
  // 基本操作
  findById(id: UUID): Promise<Timesheet | null>
  findAll(limit?: number, offset?: number): Promise<Timesheet[]>
  save(timesheet: Timesheet): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByUserAndPeriod(userId: UUID, period: DateRange): Promise<Timesheet[]>
  findPendingApproval(approverId: UUID): Promise<Timesheet[]>
  findByStatus(status: ENUM): Promise<Timesheet[]>
  findOverdueSubmissions(): Promise<Timesheet[]>

  // 集約全体の保存
  saveWithEntries(timesheet: Timesheet, entries: TimeEntry[]): Promise<void>
  saveWithWorkflow(timesheet: Timesheet, workflow: ApprovalWorkflow): Promise<void>
}
```

#### WorkPatternRepository <<repository>>
**責務**: WorkPattern集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface WorkPatternRepository {
  // 基本操作
  findById(id: UUID): Promise<WorkPattern | null>
  findAll(limit?: number, offset?: number): Promise<WorkPattern[]>
  save(workPattern: WorkPattern): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByUserId(userId: UUID): Promise<WorkPattern[]>
  findDefaultByUser(userId: UUID): Promise<WorkPattern | null>
  findActivePattern(userId: UUID, date: DATE): Promise<WorkPattern | null>
  findByFlexTimeEnabled(): Promise<WorkPattern[]>
}
```

#### UtilizationRateRepository <<repository>>
**責務**: UtilizationRate集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface UtilizationRateRepository {
  // 基本操作
  findById(id: UUID): Promise<UtilizationRate | null>
  findAll(limit?: number, offset?: number): Promise<UtilizationRate[]>
  save(utilizationRate: UtilizationRate): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByUserAndPeriod(userId: UUID, period: DateRange): Promise<UtilizationRate[]>
  findByTeam(teamId: UUID, period: DateRange): Promise<UtilizationRate[]>
  findLowUtilization(threshold: PERCENTAGE): Promise<UtilizationRate[]>
  findByPeriodType(periodType: ENUM): Promise<UtilizationRate[]>

  // 集約全体の保存
  saveWithMetrics(utilizationRate: UtilizationRate, metrics: ProductivityMetric[]): Promise<void>
}
```

## ビジネスルール

### タイムシート管理ルール
1. **提出期限**: 週末から3営業日以内に提出
2. **最小単位**: 15分単位で記録
3. **上限時間**: 1日12時間、週60時間まで
4. **修正期限**: 承認後の修正は1週間以内

### 承認ルール
1. **承認者**: 直属上司またはプロジェクトマネージャー
2. **承認期限**: 提出から2営業日以内
3. **自動承認**: 期限超過時は自動承認（設定可能）
4. **却下時**: 理由を明記し再提出要求

### 稼働率管理ルール
1. **目標稼働率**: 80-85%を維持
2. **アラート閾値**: 70%未満または95%以上
3. **計算方法**: (課金工数 / 標準勤務時間) × 100

### 生産性評価ルール
1. **評価頻度**: 月次で自動計算
2. **評価指標**: 品質、効率、適時性の3軸
3. **改善提案**: スコア低下時に自動提案

## サービス間連携

### 依存サービス
- **セキュアアクセスサービス**: ユーザー認証、権限
- **プロジェクト成功支援サービス**: プロジェクト、タスク情報
- **タレント最適化サービス**: メンバー情報、スキル

### 提供インターフェース
- **工数データAPI**: 実績工数情報を提供
- **稼働率API**: 個人・チーム稼働率を提供
- **生産性API**: 生産性指標を提供

### イベント連携
- **TimesheetApproved**: 財務サービスへ課金情報連携
- **OvertimeDetected**: 管理者へアラート通知
- **LowUtilizationAlert**: リソース管理サービスへ通知