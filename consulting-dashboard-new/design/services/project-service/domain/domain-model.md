# プロジェクト管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
プロジェクト管理サービスに関連するドメインモデルを定義する。プロジェクト、タスク、マイルストーン、成果物などのエンティティを管理する。

## エンティティ

### Project（プロジェクト）
```
Project {
  id: string
  name: string
  description: string
  clientId: string  // 外部参照
  status: ProjectStatus
  startDate: Date
  endDate: Date
  budget: Money
  actualCost: Money
  projectManagerId: string  // 外部参照
  workstreams: Workstream[]
  deliverables: Deliverable[]
  metadata: {
    industry: string
    projectType: string
    methodology: string
  }
  createdAt: DateTime
  updatedAt: DateTime
}

enum ProjectStatus {
  PLANNING      // 計画中
  ACTIVE        // 進行中
  ON_HOLD       // 一時停止
  COMPLETED     // 完了
  CANCELLED     // キャンセル
}
```

### Workstream（ワークストリーム）
```
Workstream {
  id: string
  projectId: string
  name: string
  description: string
  leadId: string  // 外部参照
  status: WorkstreamStatus
  startDate: Date
  endDate: Date
  tasks: Task[]
  milestones: Milestone[]
  order: number  // 表示順序
}

enum WorkstreamStatus {
  NOT_STARTED   // 未開始
  IN_PROGRESS   // 進行中
  COMPLETED     // 完了
  BLOCKED       // ブロック中
}
```

### Task（タスク）
```
Task {
  id: string
  workstreamId: string
  title: string
  description: string
  assigneeId: string  // 外部参照
  status: TaskStatus
  priority: Priority
  dueDate: Date
  completedDate: Date?
  estimatedHours: number
  actualHours: number
  dependencies: TaskDependency[]
  tags: string[]
  attachments: Attachment[]
  createdAt: DateTime
  updatedAt: DateTime
}

enum TaskStatus {
  TODO          // 未着手
  IN_PROGRESS   // 進行中
  IN_REVIEW     // レビュー中
  COMPLETED     // 完了
  CANCELLED     // キャンセル
}

enum Priority {
  LOW           // 低
  MEDIUM        // 中
  HIGH          // 高
  CRITICAL      // 緊急
}
```

### TaskDependency（タスク依存関係）
```
TaskDependency {
  id: string
  taskId: string
  dependsOnTaskId: string
  type: DependencyType
}

enum DependencyType {
  FINISH_TO_START    // FS: 前タスク完了後に開始
  START_TO_START     // SS: 同時開始
  FINISH_TO_FINISH   // FF: 同時完了
  START_TO_FINISH    // SF: 前タスク開始後に完了
}
```

### Milestone（マイルストーン）
```
Milestone {
  id: string
  workstreamId: string
  projectId: string
  name: string
  description: string
  dueDate: Date
  completedDate: Date?
  status: MilestoneStatus
  deliverables: Deliverable[]
  criteria: string[]  // 達成基準
  importance: Importance
}

enum MilestoneStatus {
  UPCOMING      // 予定
  IN_PROGRESS   // 進行中
  ACHIEVED      // 達成
  DELAYED       // 遅延
  AT_RISK       // リスクあり
}

enum Importance {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### Deliverable（成果物）
```
Deliverable {
  id: string
  projectId: string
  milestoneId: string?
  name: string
  description: string
  type: DeliverableType
  status: DeliverableStatus
  dueDate: Date
  submittedDate: Date?
  approvedDate: Date?
  approvedById: string?  // 外部参照
  version: number
  fileUrl: string?
  reviewComments: ReviewComment[]
  tags: string[]
}

enum DeliverableType {
  DOCUMENT      // ドキュメント
  PRESENTATION  // プレゼンテーション
  REPORT        // レポート
  PROTOTYPE     // プロトタイプ
  CODE          // ソースコード
  DATA          // データ
  OTHER         // その他
}

enum DeliverableStatus {
  DRAFT         // 下書き
  IN_REVIEW     // レビュー中
  APPROVED      // 承認済み
  REJECTED      // 却下
  REVISED       // 修正中
}
```

### ReviewComment（レビューコメント）
```
ReviewComment {
  id: string
  deliverableId: string
  reviewerId: string  // 外部参照
  comment: string
  status: CommentStatus
  createdAt: DateTime
  resolvedAt: DateTime?
}

enum CommentStatus {
  OPEN          // 未解決
  RESOLVED      // 解決済み
  WONT_FIX      // 対応しない
}
```

### ProjectChange（プロジェクト変更）
```
ProjectChange {
  id: string
  projectId: string
  type: ChangeType
  description: string
  reason: string
  impact: {
    schedule?: number  // 日数
    budget?: Money
    scope?: string
  }
  requestedById: string  // 外部参照
  approvedById: string?  // 外部参照
  status: ChangeStatus
  createdAt: DateTime
  decidedAt: DateTime?
}

enum ChangeType {
  SCOPE         // スコープ変更
  SCHEDULE      // スケジュール変更
  BUDGET        // 予算変更
  RESOURCE      // リソース変更
  OTHER         // その他
}

enum ChangeStatus {
  REQUESTED     // 申請中
  APPROVED      // 承認
  REJECTED      // 却下
  IMPLEMENTED   // 実装済み
}
```

## 値オブジェクト

### Money（金額）
```
Money {
  amount: number
  currency: string (JPY|USD|EUR)
  
  add(money: Money): Money
  subtract(money: Money): Money
  multiply(factor: number): Money
  equals(money: Money): boolean
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
  
  duration(): number  // 日数
  includes(date: Date): boolean
  overlaps(range: DateRange): boolean
}
```

### Progress（進捗）
```
Progress {
  completed: number
  total: number
  
  percentage(): number
  isComplete(): boolean
  remaining(): number
}
```

### Attachment（添付ファイル）
```
Attachment {
  id: string
  name: string
  url: string
  size: number
  mimeType: string
  uploadedById: string  // 外部参照
  uploadedAt: DateTime
}
```

## 集約ルート

- `Project`: プロジェクト集約のルート
- `Workstream`: ワークストリーム内のタスクとマイルストーンを管理
- `Deliverable`: 成果物とそのレビューを管理

## ドメインサービス

### ProjectSchedulingService
- プロジェクトのスケジュール計算
- クリティカルパスの特定
- リソース競合の検出

### TaskAllocationService
- タスクの自動割り当て
- 負荷分散の最適化
- スキルマッチング（リソースサービスと連携）

### DeliverableReviewService
- レビューワークフローの管理
- 承認プロセスの実行
- バージョン管理