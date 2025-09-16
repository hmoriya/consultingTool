# リスク管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
リスク管理サービスに関連するドメインモデルを定義する。リスク識別、評価、対応計画、イシュー管理、教訓管理などのリスク管理機能を管理する。

## エンティティ

### Risk（リスク）
```
Risk {
  id: string
  riskNumber: string   // 自動採番
  projectId: string    // 外部参照
  category: RiskCategory
  title: string
  description: string
  probability: number  // 1-5
  impact: number       // 1-5
  detectability: number // 1-5
  rpn: number          // Risk Priority Number
  level: RiskLevel
  status: RiskStatus
  expectedImpact: ExpectedImpact
  triggers: string[]
  owner: string?       // 外部参照
  relatedRisks: string[]
  mitigationPlan: MitigationPlan?
  monitoring: RiskMonitoring
  history: RiskHistory[]
  createdBy: string    // 外部参照
  createdAt: DateTime
  updatedAt: DateTime
  materializedAt: DateTime?
  closedAt: DateTime?
}

enum RiskCategory {
  TECHNICAL          // 技術リスク
  SCHEDULE           // スケジュールリスク
  BUDGET             // 予算リスク
  QUALITY            // 品質リスク
  RESOURCE           // リソースリスク
  EXTERNAL           // 外部要因リスク
  COMPLIANCE         // コンプライアンスリスク
  STAKEHOLDER        // ステークホルダーリスク
}

enum RiskLevel {
  CRITICAL           // 緊急対応必要
  HIGH               // 高
  MEDIUM             // 中
  LOW                // 低
}

enum RiskStatus {
  IDENTIFIED         // 識別済み
  ANALYZING          // 分析中
  PLANNING           // 対策計画中
  MONITORING         // 監視中
  CLOSED             // クローズ
  MATERIALIZED       // 顕在化
}
```

### ExpectedImpact（想定影響）
```
ExpectedImpact {
  schedule: ScheduleImpact?
  budget: BudgetImpact?
  quality: QualityImpact?
  scope: ScopeImpact?
  reputation: ReputationImpact?
}
```

### ScheduleImpact（スケジュール影響）
```
ScheduleImpact {
  delayDays: number
  affectedMilestones: string[]  // 外部参照
  criticalPath: boolean
}
```

### BudgetImpact（予算影響）
```
BudgetImpact {
  amount: Money
  percentage: number
  costType: string
}
```

### QualityImpact（品質影響）
```
QualityImpact {
  area: string
  severity: ImpactSeverity
  description: string
}

enum ImpactSeverity {
  CRITICAL
  MAJOR
  MINOR
  NEGLIGIBLE
}
```

### MitigationPlan（リスク対応計画）
```
MitigationPlan {
  id: string
  riskId: string
  strategy: MitigationStrategy
  actions: MitigationAction[]
  preventiveMeasures: string[]
  contingencyPlan: ContingencyPlan?
  residualRisk: ResidualRisk
  totalCost: Money
  expectedCompletion: Date
  status: PlanStatus
  approvedBy: string?  // 外部参照
  approvedAt: DateTime?
  effectiveness: Effectiveness?
}

enum MitigationStrategy {
  AVOID              // 回避
  TRANSFER           // 転嫁
  MITIGATE           // 軽減
  ACCEPT             // 受容
  EXPLOIT            // 活用（好機の場合）
  SHARE              // 共有（好機の場合）
}

enum PlanStatus {
  DRAFT
  APPROVED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}
```

### MitigationAction（対応アクション）
```
MitigationAction {
  id: string
  description: string
  responsiblePerson: string  // 外部参照
  dueDate: Date
  status: ActionStatus
  estimatedCost: Money?
  actualCost: Money?
  expectedReduction: RiskReduction?
  completedAt: DateTime?
  notes: string?
}

enum ActionStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
  OVERDUE
  CANCELLED
}
```

### RiskReduction（リスク低減）
```
RiskReduction {
  probabilityReduction: number
  impactReduction: number
  newRPN: number
}
```

### ContingencyPlan（発生時対策）
```
ContingencyPlan {
  trigger: string
  actions: string[]
  responsiblePerson: string  // 外部参照
  budget: Money?
  communicationPlan: string
}
```

### ResidualRisk（残存リスク）
```
ResidualRisk {
  probability: number
  impact: number
  rpn: number
  acceptanceReason: string?
  acceptedBy: string?  // 外部参照
  acceptedAt: DateTime?
}
```

### RiskMonitoring（リスク監視）
```
RiskMonitoring {
  frequency: MonitoringFrequency
  lastChecked: DateTime?
  nextCheck: DateTime?
  indicators: string[]
  trend: RiskTrend
  alerts: RiskAlert[]
}

enum MonitoringFrequency {
  DAILY
  WEEKLY
  BIWEEKLY
  MONTHLY
  QUARTERLY
}

enum RiskTrend {
  INCREASING         // 上昇傾向
  STABLE             // 安定
  DECREASING         // 低下傾向
  VOLATILE           // 変動
}
```

### RiskAlert（リスクアラート）
```
RiskAlert {
  id: string
  type: AlertType
  message: string
  severity: AlertSeverity
  triggeredAt: DateTime
  acknowledgedBy: string?  // 外部参照
  acknowledgedAt: DateTime?
}

enum AlertType {
  TRIGGER_APPROACHING
  LEVEL_INCREASED
  OVERDUE_ACTION
  NEW_RELATED_RISK
  ESCALATION_REQUIRED
}

enum AlertSeverity {
  INFO
  WARNING
  ERROR
  CRITICAL
}
```

### RiskHistory（リスク履歴）
```
RiskHistory {
  id: string
  riskId: string
  action: HistoryAction
  changes: JSON
  comment: string?
  performedBy: string  // 外部参照
  performedAt: DateTime
}

enum HistoryAction {
  CREATED
  UPDATED
  ASSESSED
  PLAN_CREATED
  PLAN_UPDATED
  STATUS_CHANGED
  ESCALATED
  CLOSED
}
```

### Issue（イシュー）
```
Issue {
  id: string
  issueNumber: string  // 自動採番
  projectId: string    // 外部参照
  fromRiskId: string?  // リスクからの変換
  category: IssueCategory
  title: string
  description: string
  impact: IssueImpact
  priority: IssuePriority
  status: IssueStatus
  rootCause: string?
  owner: string        // 外部参照
  escalated: boolean
  resolution: IssueResolution?
  createdBy: string    // 外部参照
  createdAt: DateTime
  targetResolution: DateTime?
  actualResolution: DateTime?
}

enum IssueCategory {
  TECHNICAL
  RESOURCE
  SCHEDULE
  QUALITY
  STAKEHOLDER
  PROCESS
  EXTERNAL
  OTHER
}

enum IssuePriority {
  CRITICAL           // 緊急
  HIGH               // 高
  MEDIUM             // 中
  LOW                // 低
}

enum IssueStatus {
  OPEN               // オープン
  INVESTIGATING      // 調査中
  IN_PROGRESS        // 対応中
  RESOLVED           // 解決済み
  CLOSED             // クローズ
  ESCALATED          // エスカレーション済み
}
```

### IssueImpact（イシュー影響）
```
IssueImpact {
  severity: ImpactSeverity
  affectedAreas: string[]
  businessImpact: string
  urgency: string
  stakeholdersAffected: string[]
}
```

### IssueResolution（イシュー解決）
```
IssueResolution {
  id: string
  issueId: string
  solution: string
  implementedActions: string[]
  preventiveMeasures: string[]
  cost: Money?
  duration: number     // 日数
  effectiveness: string
  resolvedBy: string   // 外部参照
  resolvedAt: DateTime
  verifiedBy: string?  // 外部参照
  verifiedAt: DateTime?
}
```

### Lesson（教訓）
```
Lesson {
  id: string
  projectId: string    // 外部参照
  riskId: string?
  issueId: string?
  category: LessonCategory
  title: string
  situation: string
  actions: string
  results: string
  lessons: LessonsDetail
  applicability: LessonApplicability
  keywords: string[]
  status: LessonStatus
  usefulness: Usefulness
  createdBy: string    // 外部参照
  createdAt: DateTime
  reviewedBy: string?  // 外部参照
  reviewedAt: DateTime?
}

enum LessonCategory {
  RISK_IDENTIFICATION
  ASSESSMENT
  MITIGATION
  MONITORING
  COMMUNICATION
  DECISION_MAKING
  STAKEHOLDER_MANAGEMENT
  PROCESS_IMPROVEMENT
}

enum LessonStatus {
  DRAFT
  UNDER_REVIEW
  APPROVED
  PUBLISHED
  ARCHIVED
}
```

### LessonsDetail（教訓詳細）
```
LessonsDetail {
  whatWorked: string[]
  whatDidntWork: string[]
  recommendations: string[]
  bestPractices: string[]
  pitfalls: string[]
}
```

### LessonApplicability（教訓適用性）
```
LessonApplicability {
  projectTypes: string[]
  industries: string[]
  contexts: string[]
  riskCategories: RiskCategory[]
  preconditions: string[]
}
```

### Usefulness（有用性）
```
Usefulness {
  views: number
  applications: number
  ratings: number
  averageRating: number
  feedback: Feedback[]
}
```

### Feedback（フィードバック）
```
Feedback {
  userId: string       // 外部参照
  rating: number
  comment: string?
  appliedSuccessfully: boolean?
  date: DateTime
}
```

### RiskMatrix（リスクマトリクス）
```
RiskMatrix {
  id: string
  projectId: string    // 外部参照
  period: DateRange
  cells: MatrixCell[]
  summary: MatrixSummary
  generated: DateTime
}
```

### MatrixCell（マトリクスセル）
```
MatrixCell {
  probability: number  // 1-5
  impact: number       // 1-5
  risks: RiskSummary[]
  count: number
  level: RiskLevel
}
```

### RiskSummary（リスクサマリー）
```
RiskSummary {
  id: string
  title: string
  category: RiskCategory
  owner: string?
  trend: RiskTrend
  daysOpen: number
}
```

### MatrixSummary（マトリクスサマリー）
```
MatrixSummary {
  totalRisks: number
  criticalRisks: number
  highRisks: number
  mediumRisks: number
  lowRisks: number
  unassignedRisks: number
  averageRPN: number
  trend: string
}
```

### Escalation（エスカレーション）
```
Escalation {
  id: string
  entityType: EscalationType
  entityId: string
  reason: string
  urgency: EscalationUrgency
  escalatedTo: string[]  // 外部参照
  escalatedBy: string    // 外部参照
  escalatedAt: DateTime
  status: EscalationStatus
  resolution: string?
  resolvedAt: DateTime?
}

enum EscalationType {
  RISK
  ISSUE
  DECISION
}

enum EscalationUrgency {
  IMMEDIATE
  HIGH
  NORMAL
}

enum EscalationStatus {
  PENDING
  ACKNOWLEDGED
  IN_PROGRESS
  RESOLVED
  DISMISSED
}
```

## 値オブジェクト

### Money（金額）
```
Money {
  amount: number
  currency: string
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
}
```

### Effectiveness（効果）
```
Effectiveness {
  plannedReduction: number
  actualReduction: number
  assessment: EffectivenessLevel
  verifiedAt: DateTime?
}

enum EffectivenessLevel {
  HIGHLY_EFFECTIVE
  EFFECTIVE
  PARTIALLY_EFFECTIVE
  INEFFECTIVE
  NOT_YET_MEASURED
}
```

### ScopeImpact（スコープ影響）
```
ScopeImpact {
  affectedDeliverables: string[]
  changePercentage: number
  description: string
}
```

### ReputationImpact（評判影響）
```
ReputationImpact {
  stakeholders: string[]
  severity: ImpactSeverity
  recoveryTime: string
}
```

## 集約ルート

- `Risk`: リスク管理の集約ルート
- `Issue`: イシュー管理の集約ルート
- `Lesson`: 教訓管理の集約ルート
- `MitigationPlan`: リスク対応計画の集約ルート

## ドメインサービス

### RiskAssessmentService
- リスクレベル計算
- RPN算出
- リスクマトリクス生成

### MitigationPlanningService
- 対応戦略の提案
- コスト効果分析
- 実施計画の最適化

### RiskMonitoringService
- トリガー監視
- トレンド分析
- アラート生成

### IssueManagementService
- イシュー優先順位付け
- エスカレーション判定
- 解決策の追跡

### LessonManagementService
- 教訓の分類・タグ付け
- 適用可能性の判定
- ベストプラクティス抽出