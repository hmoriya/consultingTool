# レポートAPI

**更新日: 2025-01-13**

## 概要

プロジェクトおよび全社の各種レポート機能を提供するAPI。ダッシュボード表示、定期レポート生成、カスタムレポート作成などの機能を含む。

## エンドポイント一覧

### ダッシュボードレポート
- `getExecutiveDashboard` - エグゼクティブダッシュボードデータ取得
- `getProjectDashboard` - プロジェクトダッシュボードデータ取得
- `getPersonalDashboard` - 個人ダッシュボードデータ取得
- `getClientDashboard` - クライアント向けダッシュボードデータ取得

### プロジェクトレポート
- `getProjectStatusReport` - プロジェクトステータスレポート取得
- `getProjectFinancialReport` - プロジェクト財務レポート取得
- `getProjectResourceReport` - プロジェクトリソースレポート取得
- `getProjectRiskReport` - プロジェクトリスクレポート取得

### 経営レポート
- `getMonthlyManagementReport` - 月次経営レポート取得
- `getQuarterlyBusinessReport` - 四半期ビジネスレポート取得
- `getAnnualReport` - 年次レポート取得
- `getKPIReport` - KPIレポート取得

### 分析レポート
- `getUtilizationAnalysis` - 稼働率分析レポート取得
- `getProfitabilityAnalysis` - 収益性分析レポート取得
- `getClientAnalysis` - クライアント分析レポート取得
- `getSkillAnalysis` - スキル分析レポート取得

### カスタムレポート
- `createCustomReport` - カスタムレポート作成
- `getCustomReportTemplates` - レポートテンプレート一覧取得
- `saveReportTemplate` - レポートテンプレート保存
- `scheduleReport` - レポート定期実行設定

## API詳細

### getExecutiveDashboard

エグゼクティブ向けの総合ダッシュボードデータを取得する。

```typescript
async function getExecutiveDashboard(
  params?: DashboardParams
): Promise<ExecutiveDashboardResponse>
```

#### リクエスト
```typescript
interface DashboardParams {
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  date?: Date  // 基準日（デフォルト：当日）
  compareWithPrevious?: boolean  // 前期比較を含むか
}
```

#### レスポンス
```typescript
interface ExecutiveDashboardResponse {
  success: boolean
  data?: {
    summary: {
      activeProjects: number
      totalRevenue: number
      totalCost: number
      grossMargin: number
      marginRate: number
      headcount: number
      utilizationRate: number
      revenuePerHead: number
    }
    trends: {
      revenue: TrendData[]
      margin: TrendData[]
      utilization: TrendData[]
      headcount: TrendData[]
    }
    projectsOverview: {
      byStatus: {
        status: string
        count: number
        revenue: number
      }[]
      byClient: {
        client: string
        projects: number
        revenue: number
        margin: number
      }[]
      atRisk: {
        projectId: string
        projectName: string
        client: string
        riskLevel: 'high' | 'medium' | 'low'
        issues: string[]
      }[]
    }
    financialHighlights: {
      topRevenue: ProjectSummary[]
      topMargin: ProjectSummary[]
      bottomMargin: ProjectSummary[]
      overdueReceivables: {
        amount: number
        count: number
        aging: AgingData[]
      }
    }
    resourceHighlights: {
      utilization: {
        overutilized: ResourceSummary[]
        underutilized: ResourceSummary[]
        optimal: number  // 最適稼働率の人数
      }
      skills: {
        inDemand: SkillDemand[]
        shortage: SkillShortage[]
      }
    }
    alerts: Alert[]
  }
  error?: string
}

interface TrendData {
  period: string
  value: number
  change?: number
  changeRate?: number
}
```

---

### getProjectDashboard

プロジェクト詳細ダッシュボードデータを取得する。

```typescript
async function getProjectDashboard(
  projectId: string
): Promise<ProjectDashboardResponse>
```

#### レスポンス
```typescript
interface ProjectDashboardResponse {
  success: boolean
  data?: {
    overview: {
      projectName: string
      client: string
      status: string
      health: 'good' | 'warning' | 'critical'
      startDate: Date
      endDate?: Date
      completionRate: number
      daysRemaining?: number
    }
    schedule: {
      milestones: {
        id: string
        name: string
        dueDate: Date
        status: string
        completionRate: number
        dependencies: string[]
      }[]
      criticalPath: string[]
      delays: {
        taskId: string
        taskName: string
        delayDays: number
        impact: string
      }[]
    }
    financial: {
      budget: number
      actualRevenue: number
      actualCost: number
      margin: number
      marginRate: number
      budgetUtilization: number
      forecast: {
        revenue: number
        cost: number
        margin: number
      }
    }
    resources: {
      teamSize: number
      allocation: {
        userId: string
        name: string
        role: string
        allocation: number
        hours: number
      }[]
      utilization: {
        average: number
        byWeek: {
          week: string
          utilization: number
        }[]
      }
    }
    deliverables: {
      total: number
      completed: number
      inProgress: number
      upcoming: number
      overdue: number
      recent: {
        id: string
        name: string
        status: string
        dueDate: Date
        assignee: string
      }[]
    }
    risks: {
      total: number
      byLevel: {
        high: number
        medium: number
        low: number
      }
      active: {
        id: string
        description: string
        level: string
        mitigation: string
        owner: string
      }[]
    }
    communication: {
      recentUpdates: {
        date: Date
        type: string
        message: string
        author: string
      }[]
      upcomingMeetings: {
        date: Date
        title: string
        participants: string[]
      }[]
    }
  }
  error?: string
}
```

---

### getMonthlyManagementReport

月次経営レポートを生成する。

```typescript
async function getMonthlyManagementReport(
  month: Date
): Promise<MonthlyManagementReportResponse>
```

#### レスポンス
```typescript
interface MonthlyManagementReportResponse {
  success: boolean
  data?: {
    period: {
      month: string
      year: number
      workingDays: number
    }
    executive_summary: {
      highlights: string[]
      lowlights: string[]
      actions_required: string[]
    }
    financial_performance: {
      revenue: {
        actual: number
        budget: number
        variance: number
        yoy_growth: number
      }
      cost: {
        actual: number
        budget: number
        variance: number
        breakdown: {
          labor: number
          outsourcing: number
          expenses: number
          overhead: number
        }
      }
      profitability: {
        gross_margin: number
        operating_margin: number
        ebitda: number
      }
    }
    project_portfolio: {
      active_projects: number
      new_projects: number
      completed_projects: number
      pipeline: {
        count: number
        value: number
        weighted_value: number
      }
      by_industry: IndustryBreakdown[]
      by_service: ServiceBreakdown[]
    }
    resource_metrics: {
      headcount: {
        total: number
        billable: number
        bench: number
        changes: {
          joined: number
          left: number
          net: number
        }
      }
      utilization: {
        overall: number
        billable: number
        by_level: {
          level: string
          rate: number
          headcount: number
        }[]
      }
      productivity: {
        revenue_per_head: number
        billable_hours_per_head: number
      }
    }
    client_metrics: {
      active_clients: number
      new_clients: number
      client_concentration: {
        top_10_percent: number
        top_20_percent: number
      }
      satisfaction: {
        nps_score?: number
        csat_score?: number
      }
    }
    cash_flow: {
      beginning_balance: number
      inflows: {
        collections: number
        other: number
        total: number
      }
      outflows: {
        payroll: number
        vendors: number
        expenses: number
        total: number
      }
      ending_balance: number
      dso: number  // Days Sales Outstanding
    }
    kpi_dashboard: {
      revenue_growth: KPIMetric
      margin_improvement: KPIMetric
      utilization_target: KPIMetric
      client_satisfaction: KPIMetric
      employee_retention: KPIMetric
    }
  }
  error?: string
}

interface KPIMetric {
  actual: number
  target: number
  variance: number
  trend: 'up' | 'down' | 'stable'
  rag_status: 'red' | 'amber' | 'green'
}
```

---

### getProfitabilityAnalysis

収益性分析レポートを取得する。

```typescript
async function getProfitabilityAnalysis(
  params: ProfitabilityAnalysisParams
): Promise<ProfitabilityAnalysisResponse>
```

#### リクエスト
```typescript
interface ProfitabilityAnalysisParams {
  startDate: Date
  endDate: Date
  groupBy: 'project' | 'client' | 'service' | 'industry' | 'pm'
  includeDetails?: boolean
  minRevenue?: number  // 最小収益でフィルタ
}
```

#### レスポンス
```typescript
interface ProfitabilityAnalysisResponse {
  success: boolean
  data?: {
    summary: {
      totalRevenue: number
      totalCost: number
      totalMargin: number
      averageMarginRate: number
      medianMarginRate: number
    }
    breakdown: {
      id: string
      name: string
      revenue: number
      directCost: number
      indirectCost: number
      totalCost: number
      margin: number
      marginRate: number
      rank: number
      details?: {
        laborCost: number
        outsourcingCost: number
        expenseCost: number
        overheadAllocation: number
        hoursSpent: number
        effectiveRate: number
      }
    }[]
    distribution: {
      range: string  // "-10% to 0%", "0% to 10%", etc.
      count: number
      revenue: number
      percentage: number
    }[]
    trends: {
      period: string
      revenue: number
      cost: number
      margin: number
      marginRate: number
    }[]
    insights: {
      highPerformers: {
        id: string
        name: string
        marginRate: number
        successFactors: string[]
      }[]
      improvementTargets: {
        id: string
        name: string
        currentMargin: number
        potentialMargin: number
        recommendations: string[]
      }[]
      anomalies: {
        id: string
        name: string
        issue: string
        impact: number
      }[]
    }
    benchmarks?: {
      industry_average: number
      top_quartile: number
      company_position: 'below' | 'average' | 'above'
    }
  }
  error?: string
}
```

---

### getUtilizationAnalysis

稼働率分析レポートを取得する。

```typescript
async function getUtilizationAnalysis(
  params: UtilizationAnalysisParams
): Promise<UtilizationAnalysisResponse>
```

#### リクエスト
```typescript
interface UtilizationAnalysisParams {
  startDate: Date
  endDate: Date
  groupBy: 'individual' | 'team' | 'department' | 'level' | 'skill'
  targetRate?: number  // 目標稼働率（デフォルト: 80%）
  includeForecst?: boolean
}
```

#### レスポンス
```typescript
interface UtilizationAnalysisResponse {
  success: boolean
  data?: {
    period: {
      start: Date
      end: Date
      workingDays: number
      holidays: number
    }
    summary: {
      averageUtilization: number
      averageBillable: number
      totalCapacity: number  // 総利用可能時間
      totalUtilized: number  // 総稼働時間
      totalBillable: number  // 総請求可能時間
    }
    breakdown: {
      id: string
      name: string
      category?: string  // team/department/level/skill
      utilization: number
      billableRate: number
      totalHours: number
      billableHours: number
      nonBillableHours: number
      benchHours: number
      overtime: number
      variance: number  // 目標との差異
      trend: 'improving' | 'stable' | 'declining'
    }[]
    distribution: {
      utilizationRange: string
      headcount: number
      percentage: number
      names?: string[]
    }[]
    patterns: {
      weekly: {
        week: number
        utilization: number
        billable: number
      }[]
      monthly: {
        month: string
        utilization: number
        billable: number
        forecast?: number
      }[]
    }
    alerts: {
      overutilized: {
        id: string
        name: string
        utilization: number
        consecutiveWeeks: number
        burnoutRisk: 'low' | 'medium' | 'high'
      }[]
      underutilized: {
        id: string
        name: string
        utilization: number
        benchDays: number
        recommendations: string[]
      }[]
    }
    forecast?: {
      next30Days: {
        projected: number
        confidence: number
        assumptions: string[]
      }
      next90Days: {
        projected: number
        confidence: number
        risks: string[]
      }
    }
  }
  error?: string
}
```

---

### createCustomReport

カスタムレポートを作成する。

```typescript
async function createCustomReport(
  data: CreateCustomReportInput
): Promise<CustomReportResponse>
```

#### リクエスト
```typescript
interface CreateCustomReportInput {
  name: string
  description?: string
  type: 'dashboard' | 'tabular' | 'analytical'
  dataSource: {
    entities: string[]  // 'projects', 'resources', 'finances', etc.
    filters?: {
      field: string
      operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains'
      value: any
    }[]
    dateRange?: {
      field: string
      start: Date
      end: Date
    }
  }
  metrics: {
    field: string
    aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max'
    label: string
  }[]
  dimensions?: {
    field: string
    label: string
  }[]
  visualization?: {
    type: 'table' | 'bar' | 'line' | 'pie' | 'heatmap'
    options?: any
  }
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string  // HH:mm
    recipients: string[]
    format: 'pdf' | 'excel' | 'csv'
  }
}
```

#### レスポンス
```typescript
interface CustomReportResponse {
  success: boolean
  data?: {
    reportId: string
    name: string
    createdAt: Date
    results: {
      metadata: {
        rowCount: number
        executionTime: number
        dataPeriod: {
          start: Date
          end: Date
        }
      }
      data: any[]  // レポートタイプによって異なる
      summary?: {
        [key: string]: number
      }
      visualization?: {
        type: string
        config: any
        data: any
      }
    }
    shareUrl?: string
    exportUrl?: string
  }
  error?: string
}
```

---

### scheduleReport

レポートの定期実行を設定する。

```typescript
async function scheduleReport(
  data: ScheduleReportInput
): Promise<ScheduleReportResponse>
```

#### リクエスト
```typescript
interface ScheduleReportInput {
  reportId: string  // 既存レポートID or テンプレートID
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    dayOfWeek?: number  // 0-6 (weekly)
    dayOfMonth?: number  // 1-31 (monthly)
    time: string  // HH:mm
    timezone?: string
  }
  distribution: {
    recipients: {
      email: string
      role?: string
    }[]
    format: 'pdf' | 'excel' | 'csv' | 'inline'
    includeLink?: boolean
    customMessage?: string
  }
  conditions?: {
    onlyIfDataChanged?: boolean
    alertThresholds?: {
      metric: string
      condition: 'above' | 'below'
      value: number
    }[]
  }
}
```

## 共通インターフェース

### フィルタリング
```typescript
interface ReportFilters {
  projects?: string[]
  clients?: string[]
  departments?: string[]
  users?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  customFields?: {
    [key: string]: any
  }
}
```

### ページネーション
```typescript
interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
```

### エクスポート
```typescript
interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json'
  filename?: string
  includeCharts?: boolean
  paperSize?: 'A4' | 'Letter' | 'Legal'
  orientation?: 'portrait' | 'landscape'
}
```

## エラーハンドリング

### 共通エラー
- `REPORT_NOT_FOUND`: レポートが見つかりません
- `INSUFFICIENT_DATA`: レポート生成に必要なデータが不足しています
- `INVALID_PARAMETERS`: 無効なパラメータです
- `EXPORT_FAILED`: エクスポートに失敗しました

### レポート固有エラー
- `TEMPLATE_NOT_FOUND`: テンプレートが見つかりません
- `SCHEDULE_CONFLICT`: スケジュール設定が重複しています
- `RECIPIENT_INVALID`: 無効な受信者です

## パフォーマンス最適化

### キャッシュ戦略
- ダッシュボードデータ: 5分キャッシュ
- 月次レポート: 日次更新
- カスタムレポート: オンデマンド

### 非同期処理
- 大規模レポートはジョブキューで処理
- 進捗状況のリアルタイム通知
- 完了後のメール通知

### データ集計
- 事前集計テーブルの活用
- インクリメンタル更新
- パーティショニングによる高速化