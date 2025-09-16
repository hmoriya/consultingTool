# ドメインモデル定義

**更新日: 2025-01-09**

## コアドメイン

### User（ユーザー）
```
User {
  id: string
  email: string
  password: string (hashed)
  name: string
  role: Role
  organizationId: string
  isActive: boolean
  lastLogin: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Role（ロール）
```
Role {
  id: string
  name: string (executive|pm|consultant|client|admin)
  description: string
  permissions: Permission[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Permission（権限）
```
Permission {
  id: string
  resource: string (projects|users|reports|etc)
  action: string (create|read|update|delete)
  description: string
}
```

### Organization（組織）
```
Organization {
  id: string
  name: string
  type: string (consultingFirm|client)
  users: User[]
  projects: Project[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

## プロジェクトドメイン

### Project（プロジェクト）
```
Project {
  id: string
  name: string
  description: string
  organizationId: string
  clientId: string
  status: ProjectStatus
  startDate: Date
  endDate: Date
  budget: Money
  actualCost: Money
  workstreams: Workstream[]
  consultants: ProjectConsultant[]
  deliverables: Deliverable[]
  createdAt: DateTime
  updatedAt: DateTime
}

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}
```

### Workstream（ワークストリーム）
```
Workstream {
  id: string
  projectId: string
  name: string
  description: string
  lead: User
  status: WorkstreamStatus
  tasks: Task[]
  milestones: Milestone[]
}

enum WorkstreamStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}
```

### Task（タスク）
```
Task {
  id: string
  workstreamId: string
  title: string
  description: string
  assignee: User
  status: TaskStatus
  priority: Priority
  dueDate: Date
  completedDate: Date?
  estimatedHours: number
  actualHours: number
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### Milestone（マイルストーン）
```
Milestone {
  id: string
  workstreamId: string
  name: string
  description: string
  dueDate: Date
  status: MilestoneStatus
  deliverables: Deliverable[]
}

enum MilestoneStatus {
  UPCOMING
  IN_PROGRESS
  ACHIEVED
  DELAYED
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
  version: number
}

enum DeliverableType {
  DOCUMENT
  PRESENTATION
  REPORT
  PROTOTYPE
  OTHER
}

enum DeliverableStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  REJECTED
}
```

## リソース管理ドメイン

### Consultant（コンサルタント）
```
Consultant {
  id: string
  userId: string
  level: ConsultantLevel
  skills: Skill[]
  department: string
  utilization: number (percentage)
  allocations: ProjectConsultant[]
  timeEntries: TimeEntry[]
}

enum ConsultantLevel {
  JUNIOR
  SENIOR
  MANAGER
  SENIOR_MANAGER
  PARTNER
}
```

### ProjectConsultant（プロジェクト配置）
```
ProjectConsultant {
  id: string
  projectId: string
  consultantId: string
  role: string
  allocationPercentage: number
  startDate: Date
  endDate: Date?
  status: AllocationStatus
}

enum AllocationStatus {
  PLANNED
  ACTIVE
  COMPLETED
  CANCELLED
}
```

### TimeEntry（工数入力）
```
TimeEntry {
  id: string
  consultantId: string
  projectId: string
  taskId: string?
  date: Date
  hours: number
  description: string
  status: TimeEntryStatus
  createdAt: DateTime
  approvedAt: DateTime?
  approvedBy: User?
}

enum TimeEntryStatus {
  DRAFT
  SUBMITTED
  APPROVED
  REJECTED
}
```

## セッション管理

### Session（セッション）
```
Session {
  id: string
  userId: string
  token: string
  ipAddress: string?
  userAgent: string?
  expiresAt: DateTime
  createdAt: DateTime
}
```

### AuditLog（監査ログ）
```
AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string?
  details: JSON?
  ipAddress: string?
  createdAt: DateTime
}
```

## 値オブジェクト

### Money（金額）
```
Money {
  amount: number
  currency: string (JPY|USD|EUR)
}
```

### DateRange（期間）
```
DateRange {
  startDate: Date
  endDate: Date
}
```

### Email（メールアドレス）
```
Email {
  value: string
  validate(): boolean
}
```