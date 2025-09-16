# 工数管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
工数管理サービスに関連するドメインモデルを定義する。工数入力、承認、稼働率管理などの時間追跡機能を管理する。

## エンティティ

### TimeEntry（工数記録）
```
TimeEntry {
  id: string
  consultantId: string  // 外部参照
  projectId: string     // 外部参照
  taskId: string?       // 外部参照
  date: Date
  hours: number         // 0.5時間単位
  description: string
  billable: boolean
  activityType: ActivityType
  status: TimeEntryStatus
  weekNumber: number
  createdAt: DateTime
  updatedAt: DateTime
  submittedAt: DateTime?
  approvedAt: DateTime?
  approvedById: string?  // 外部参照
}

enum ActivityType {
  DEVELOPMENT      // 開発・分析
  MEETING          // 会議
  DOCUMENTATION    // ドキュメント作成
  REVIEW           // レビュー
  TRAVEL           // 移動
  TRAINING         // 研修
  SALES            // 営業活動
  ADMIN            // 管理業務
  OTHER            // その他
}

enum TimeEntryStatus {
  DRAFT            // 下書き
  SUBMITTED        // 提出済み
  APPROVED         // 承認済み
  REJECTED         // 却下
  REVISION_REQUESTED // 修正依頼
}
```

### Timesheet（タイムシート）
```
Timesheet {
  id: string
  consultantId: string  // 外部参照
  weekStartDate: Date
  weekEndDate: Date
  totalHours: number
  billableHours: number
  nonBillableHours: number
  status: TimesheetStatus
  entries: TimeEntry[]
  submittedAt: DateTime?
  approvalHistory: ApprovalHistory[]
  comments: string?
}

enum TimesheetStatus {
  OPEN             // 入力中
  SUBMITTED        // 提出済み
  PARTIALLY_APPROVED // 一部承認
  APPROVED         // 承認済み
  REJECTED         // 却下
  LOCKED           // ロック済み
}
```

### ApprovalHistory（承認履歴）
```
ApprovalHistory {
  id: string
  timesheetId: string
  action: ApprovalAction
  actorId: string      // 外部参照
  timestamp: DateTime
  comments: string?
  entriesAffected: string[]  // TimeEntry IDs
}

enum ApprovalAction {
  SUBMIT           // 提出
  APPROVE          // 承認
  REJECT           // 却下
  REQUEST_REVISION // 修正依頼
  RECALL           // 取り戻し
}
```

### WorkingHours（労働時間設定）
```
WorkingHours {
  id: string
  consultantId: string  // 外部参照
  effectiveFrom: Date
  effectiveTo: Date?
  standardHoursPerDay: number
  standardHoursPerWeek: number
  workingDays: DayOfWeek[]
  flexTimeEnabled: boolean
  coreHours: TimeRange?
  overtimeThreshold: number
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}
```

### Holiday（休日）
```
Holiday {
  id: string
  name: string
  date: Date
  type: HolidayType
  country: string
  isNationwide: boolean
  offices: string[]    // 対象オフィス
}

enum HolidayType {
  PUBLIC           // 祝日
  COMPANY          // 会社休日
  SPECIAL          // 特別休日
}
```

### Leave（休暇）
```
Leave {
  id: string
  consultantId: string  // 外部参照
  type: LeaveType
  startDate: Date
  endDate: Date
  hours: number
  status: LeaveStatus
  reason: string?
  approvedById: string?  // 外部参照
  approvedAt: DateTime?
  attachments: Attachment[]
}

enum LeaveType {
  ANNUAL           // 年次有給休暇
  SICK             // 病気休暇
  PERSONAL         // 私用休暇
  MATERNITY        // 産休
  PATERNITY        // 育休
  BEREAVEMENT      // 忌引
  STUDY            // 研修休暇
  UNPAID           // 無給休暇
  COMPENSATORY     // 代休
}

enum LeaveStatus {
  REQUESTED        // 申請中
  APPROVED         // 承認済み
  REJECTED         // 却下
  CANCELLED        // キャンセル
  TAKEN            // 取得済み
}
```

### UtilizationTarget（稼働率目標）
```
UtilizationTarget {
  id: string
  targetType: TargetType
  targetId: string     // consultantId, teamId, departmentId
  period: DateRange
  targetUtilization: number      // 目標稼働率
  targetBillable: number         // 目標請求可能率
  minimumHours: number?
  maximumHours: number?
  notes: string?
}

enum TargetType {
  INDIVIDUAL       // 個人
  TEAM             // チーム
  DEPARTMENT       // 部門
  COMPANY          // 全社
}
```

### UtilizationMetrics（稼働率メトリクス）
```
UtilizationMetrics {
  id: string
  consultantId: string  // 外部参照
  period: DateRange
  totalAvailableHours: number
  totalWorkedHours: number
  billableHours: number
  nonBillableHours: number
  utilizationRate: number        // 稼働率
  billableRate: number           // 請求可能率
  overtime: number
  undertime: number
  leaveHours: number
  holidayHours: number
  calculatedAt: DateTime
}
```

### ProjectHours（プロジェクト工数）
```
ProjectHours {
  id: string
  projectId: string    // 外部参照
  period: DateRange
  plannedHours: number
  actualHours: number
  billableHours: number
  byConsultant: ConsultantHours[]
  byTask: TaskHours[]
  byActivity: ActivityHours[]
  variance: number
  burnRate: number
}
```

### ConsultantHours（コンサルタント別工数）
```
ConsultantHours {
  consultantId: string  // 外部参照
  hours: number
  billableHours: number
  activities: Map<ActivityType, number>
}
```

### TaskHours（タスク別工数）
```
TaskHours {
  taskId: string       // 外部参照
  plannedHours: number
  actualHours: number
  remainingHours: number
  completionRate: number
}
```

## 値オブジェクト

### TimeRange（時間範囲）
```
TimeRange {
  startTime: Time
  endTime: Time
  
  duration(): number
  overlaps(other: TimeRange): boolean
  contains(time: Time): boolean
}
```

### Time（時刻）
```
Time {
  hour: number    // 0-23
  minute: number  // 0-59
  
  toString(): string  // "HH:mm"
  addMinutes(minutes: number): Time
  isBefore(other: Time): boolean
  isAfter(other: Time): boolean
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
  
  workingDays(holidays: Holiday[]): number
  includes(date: Date): boolean
  weeks(): Week[]
}
```

### Week（週）
```
Week {
  weekNumber: number
  year: number
  startDate: Date
  endDate: Date
  
  toString(): string  // "2024-W01"
  dates(): Date[]
}
```

### ActivityHours（活動別工数）
```
ActivityHours {
  activityType: ActivityType
  hours: number
  percentage: number
}
```

### Attachment（添付ファイル）
```
Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  uploadedAt: DateTime
}
```

## 集約ルート

- `Timesheet`: 週次タイムシートの集約ルート
- `TimeEntry`: 個別の工数記録
- `Leave`: 休暇管理の集約ルート
- `UtilizationMetrics`: 稼働率分析の集約ルート

## ドメインサービス

### TimesheetService
- タイムシートの作成・提出
- 工数の妥当性検証
- 週次締め処理

### ApprovalService
- 承認ワークフローの実行
- 一括承認処理
- エスカレーション管理

### UtilizationCalculationService
- 稼働率の計算
- 請求可能率の算出
- トレンド分析

### WorkingTimeService
- 労働時間の計算
- 残業時間の検出
- 休日・祝日の考慮

### ProjectHoursService
- プロジェクト別工数集計
- 予実管理
- バーンレート計算