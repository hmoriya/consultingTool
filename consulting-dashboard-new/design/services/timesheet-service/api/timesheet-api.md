# 工数管理API

**更新日: 2025-01-13**

## 概要

コンサルタントの工数入力、承認、分析機能を提供するAPI。日々の作業時間記録から、プロジェクト原価計算、稼働率分析まで幅広い機能をカバー。

## エンドポイント一覧

### 工数入力
- `createTimeEntry` - 工数記録の作成
- `updateTimeEntry` - 工数記録の更新
- `deleteTimeEntry` - 工数記録の削除
- `submitTimesheet` - 週次工数の提出
- `copyTimeEntries` - 工数のコピー（日次/週次）

### 工数照会
- `getWeeklyTimesheet` - 週次工数表の取得
- `getMonthlyTimesheet` - 月次工数サマリーの取得
- `getTimeEntryDetails` - 工数詳細の取得
- `getProjectTimeEntries` - プロジェクト別工数の取得

### 工数承認
- `getApprovalQueue` - 承認待ち工数の取得
- `approveTimeEntries` - 工数の承認
- `rejectTimeEntries` - 工数の差戻し
- `bulkApproveTimeEntries` - 工数の一括承認

### 稼働率分析
- `getUtilizationReport` - 稼働率レポートの取得
- `getUtilizationTrends` - 稼働率トレンドの取得
- `getTeamUtilization` - チーム稼働率の取得
- `getBillableAnalysis` - 請求可能率分析

### 工数予実管理
- `getProjectHoursBudget` - プロジェクト工数予実の取得
- `getTaskHoursAnalysis` - タスク別工数分析
- `getHoursVarianceReport` - 工数差異レポート

## API詳細

### createTimeEntry

工数記録を作成する。

```typescript
async function createTimeEntry(data: CreateTimeEntryInput): Promise<TimeEntryResponse>
```

#### リクエスト
```typescript
interface CreateTimeEntryInput {
  projectId: string
  taskId?: string
  date: Date
  hours: number  // 0.5刻み、最大24
  description?: string
  billable: boolean
  activityType?: 'development' | 'meeting' | 'documentation' | 'review' | 'other'
}
```

#### レスポンス
```typescript
interface TimeEntryResponse {
  success: boolean
  data?: {
    id: string
    userId: string
    projectId: string
    taskId?: string
    date: Date
    hours: number
    description?: string
    billable: boolean
    status: 'draft' | 'submitted' | 'approved' | 'rejected'
    createdAt: Date
    updatedAt: Date
  }
  error?: string
}
```

#### バリデーション
- 1日の合計工数が24時間を超えない
- 同じプロジェクト・タスク・日付の重複を防ぐ
- 締切日以前の工数は入力不可
- 未来日付は入力不可
- 0.5時間単位での入力

---

### submitTimesheet

週次工数を提出する。

```typescript
async function submitTimesheet(
  weekStartDate: Date
): Promise<TimesheetSubmissionResponse>
```

#### リクエスト
```typescript
interface TimesheetSubmissionInput {
  weekStartDate: Date
  comments?: string
}
```

#### レスポンス
```typescript
interface TimesheetSubmissionResponse {
  success: boolean
  data?: {
    weekStartDate: Date
    weekEndDate: Date
    totalHours: number
    billableHours: number
    projectBreakdown: {
      projectId: string
      projectName: string
      hours: number
      billableHours: number
    }[]
    status: 'submitted'
    submittedAt: Date
  }
  error?: string
  warnings?: string[]  // 入力漏れの警告など
}
```

#### 処理フロー
1. 対象週の全工数を取得
2. 未入力日の確認（土日除く）
3. 工数の整合性チェック
4. ステータスを「submitted」に更新
5. PMへの通知送信

---

### getWeeklyTimesheet

週次工数表を取得する。

```typescript
async function getWeeklyTimesheet(
  date: Date,
  userId?: string
): Promise<WeeklyTimesheetResponse>
```

#### レスポンス
```typescript
interface WeeklyTimesheetResponse {
  success: boolean
  data?: {
    userId: string
    userName: string
    weekStart: Date
    weekEnd: Date
    entries: TimeEntry[]
    dailySummary: {
      date: Date
      totalHours: number
      billableHours: number
      isHoliday: boolean
      isWeekend: boolean
    }[]
    projectSummary: {
      project: {
        id: string
        name: string
        client: string
      }
      totalHours: number
      billableHours: number
      entries: TimeEntry[]
    }[]
    summary: {
      totalHours: number
      billableHours: number
      billableRate: number
      averageDaily: number
      status: 'draft' | 'submitted' | 'approved' | 'partially_approved'
    }
  }
  error?: string
}
```

---

### approveTimeEntries

工数を承認する。

```typescript
async function approveTimeEntries(
  data: ApproveTimeEntriesInput
): Promise<ApprovalResponse>
```

#### リクエスト
```typescript
interface ApproveTimeEntriesInput {
  entryIds: string[]
  comments?: string
}
```

#### レスポンス
```typescript
interface ApprovalResponse {
  success: boolean
  data?: {
    approvedCount: number
    approvedEntries: {
      id: string
      userId: string
      hours: number
      approvedAt: Date
    }[]
  }
  error?: string
}
```

#### 処理フロー
1. PM権限チェック
2. 対象工数がPMのプロジェクトか確認
3. ステータスが「submitted」か確認
4. 承認処理実行
5. 承認履歴記録
6. 通知送信
7. 人件費計算トリガー

---

### rejectTimeEntries

工数を差し戻す。

```typescript
async function rejectTimeEntries(
  data: RejectTimeEntriesInput
): Promise<RejectionResponse>
```

#### リクエスト
```typescript
interface RejectTimeEntriesInput {
  entryIds: string[]
  reason: string  // 必須
  requiredActions?: string[]
}
```

---

### getUtilizationReport

稼働率レポートを取得する。

```typescript
async function getUtilizationReport(
  params: UtilizationReportParams
): Promise<UtilizationReportResponse>
```

#### リクエスト
```typescript
interface UtilizationReportParams {
  startDate: Date
  endDate: Date
  groupBy: 'user' | 'team' | 'department' | 'project'
  userIds?: string[]
  includeDetails?: boolean
}
```

#### レスポンス
```typescript
interface UtilizationReportResponse {
  success: boolean
  data?: {
    period: {
      start: Date
      end: Date
      workingDays: number
      workingHours: number  // 標準労働時間
    }
    summary: {
      averageUtilization: number
      averageBillable: number
      totalHours: number
      totalBillableHours: number
    }
    breakdown: {
      id: string
      name: string
      totalHours: number
      billableHours: number
      nonBillableHours: number
      utilization: number  // 稼働率
      billableRate: number  // 請求可能率
      overtime: number  // 残業時間
      projects: {
        projectId: string
        projectName: string
        hours: number
        allocation: number
      }[]
    }[]
    distribution: {
      range: string  // "0-20%", "21-40%", etc.
      count: number
      users?: string[]
    }[]
    alerts: {
      overutilized: {  // 85%以上
        userId: string
        name: string
        utilization: number
      }[]
      underutilized: {  // 60%未満
        userId: string
        name: string
        utilization: number
      }[]
    }
  }
  error?: string
}
```

---

### getProjectHoursBudget

プロジェクトの工数予実を取得する。

```typescript
async function getProjectHoursBudget(
  projectId: string
): Promise<ProjectHoursBudgetResponse>
```

#### レスポンス
```typescript
interface ProjectHoursBudgetResponse {
  success: boolean
  data?: {
    project: {
      id: string
      name: string
      startDate: Date
      endDate?: Date
    }
    budget: {
      totalHours: number
      byPhase?: {
        phase: string
        hours: number
      }[]
      byRole?: {
        role: string
        hours: number
        rate: number
      }[]
    }
    actual: {
      totalHours: number
      billableHours: number
      byPhase?: {
        phase: string
        hours: number
      }[]
      byRole?: {
        role: string
        hours: number
        users: {
          userId: string
          name: string
          hours: number
        }[]
      }[]
    }
    variance: {
      hours: number
      percentage: number
      cost: number
      byPhase?: {
        phase: string
        variance: number
      }[]
    }
    forecast: {
      estimatedTotalHours: number
      estimatedCompletionDate?: Date
      confidenceLevel: 'high' | 'medium' | 'low'
      risks: string[]
    }
    timeline: {
      week: string
      plannedHours: number
      actualHours: number
      cumulativePlanned: number
      cumulativeActual: number
    }[]
  }
  error?: string
}
```

---

### getBillableAnalysis

請求可能率の分析データを取得する。

```typescript
async function getBillableAnalysis(
  params: BillableAnalysisParams
): Promise<BillableAnalysisResponse>
```

#### リクエスト
```typescript
interface BillableAnalysisParams {
  startDate: Date
  endDate: Date
  groupBy: 'user' | 'project' | 'client' | 'department'
}
```

#### レスポンス
```typescript
interface BillableAnalysisResponse {
  success: boolean
  data?: {
    summary: {
      totalHours: number
      billableHours: number
      nonBillableHours: number
      billableRate: number
      revenue: number  // 請求可能工数 × 標準レート
    }
    breakdown: {
      id: string
      name: string
      billableHours: number
      nonBillableHours: number
      billableRate: number
      nonBillableBreakdown: {
        category: string  // 'internal', 'training', 'sales', 'admin'
        hours: number
        percentage: number
      }[]
    }[]
    trends: {
      period: string  // "2024-01", "2024-02", etc.
      billableRate: number
      billableHours: number
    }[]
    insights: {
      topPerformers: {
        id: string
        name: string
        billableRate: number
      }[]
      improvementAreas: {
        id: string
        name: string
        billableRate: number
        suggestion: string
      }[]
    }
  }
  error?: string
}
```

## バリデーションルール

### 工数入力ルール
1. **時間制約**
   - 最小: 0.5時間
   - 最大: 24時間/日
   - 刻み: 0.5時間単位

2. **期間制約**
   - 過去: 前月の締日まで
   - 未来: 当日まで
   - 承認後: 編集不可

3. **プロジェクト制約**
   - アサインされたプロジェクトのみ
   - アクティブなプロジェクトのみ
   - 期間内のアサインのみ

### 承認ルール
1. **権限**
   - PM: 自プロジェクトのメンバー工数
   - エグゼクティブ: 全工数
   - マネージャー: 部下の工数

2. **タイミング**
   - 提出後のみ承認可能
   - 月次締切後の特別承認

## エラーハンドリング

### 共通エラー
- `TIME_ENTRY_NOT_FOUND`: 工数記録が見つかりません
- `DUPLICATE_ENTRY`: 同じ日付・プロジェクトの記録が既存
- `INVALID_HOURS`: 工数が不正です
- `PERIOD_LOCKED`: 対象期間は締切済みです

### 承認関連エラー
- `NOT_SUBMITTED`: 未提出の工数は承認できません
- `ALREADY_APPROVED`: 既に承認済みです
- `NO_APPROVAL_PERMISSION`: 承認権限がありません

## パフォーマンス最適化

### インデックス
- userId, date での複合インデックス
- projectId, date での複合インデックス
- status でのインデックス

### 集計の最適化
- 日次集計の事前計算
- 週次・月次サマリーのキャッシュ
- 稼働率の定期バッチ計算