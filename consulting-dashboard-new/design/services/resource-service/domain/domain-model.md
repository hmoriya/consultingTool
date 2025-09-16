# リソース管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
リソース管理サービスに関連するドメインモデルを定義する。ユーザー、チーム、スキル、アサインメントなどの人的リソースを管理する。

## エンティティ

### User（ユーザー）
```
User {
  id: string
  email: string
  hashedPassword: string
  name: string
  employeeId: string
  roleId: string
  organizationId: string
  department: Department
  isActive: boolean
  joinedDate: Date
  leftDate: Date?
  profile: UserProfile
  lastLogin: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### UserProfile（ユーザープロフィール）
```
UserProfile {
  id: string
  userId: string
  avatar: string?
  phone: string?
  location: string?
  timezone: string
  language: string
  bio: string?
  linkedinUrl: string?
}
```

### Role（ロール）
```
Role {
  id: string
  name: RoleName
  description: string
  permissions: Permission[]
  level: number  // 階層レベル
  createdAt: DateTime
  updatedAt: DateTime
}

enum RoleName {
  ADMIN         // システム管理者
  EXECUTIVE     // エグゼクティブ
  PM            // プロジェクトマネージャー
  CONSULTANT    // コンサルタント
  CLIENT        // クライアント
}
```

### Permission（権限）
```
Permission {
  id: string
  resource: string
  action: string
  description: string
  constraints: JSON?  // 条件付き権限
}
```

### Organization（組織）
```
Organization {
  id: string
  name: string
  type: OrganizationType
  industry: string
  size: string
  website: string?
  departments: Department[]
  teams: Team[]
  createdAt: DateTime
  updatedAt: DateTime
}

enum OrganizationType {
  CONSULTING_FIRM   // コンサルティングファーム
  CLIENT           // クライアント企業
  PARTNER          // パートナー企業
}
```

### Department（部門）
```
Department {
  id: string
  organizationId: string
  name: string
  code: string
  managerId: string  // 部門長
  parentDepartmentId: string?
  members: User[]
  teams: Team[]
}
```

### Team（チーム）
```
Team {
  id: string
  departmentId: string
  name: string
  description: string
  leadId: string  // チームリーダー
  members: TeamMember[]
  skills: Skill[]  // チームが持つスキルセット
  status: TeamStatus
  createdAt: DateTime
}

enum TeamStatus {
  ACTIVE        // アクティブ
  INACTIVE      // 非アクティブ
  DISSOLVED     // 解散
}
```

### TeamMember（チームメンバー）
```
TeamMember {
  id: string
  teamId: string
  userId: string
  role: string  // チーム内での役割
  joinedAt: DateTime
  leftAt: DateTime?
  isActive: boolean
}
```

### Consultant（コンサルタント）
```
Consultant {
  id: string
  userId: string
  level: ConsultantLevel
  title: string  // 役職
  specialization: string[]
  skills: ConsultantSkill[]
  certifications: Certification[]
  languages: Language[]
  availability: Availability
  costRate: Money  // 時間単価
  billableTarget: number  // 目標稼働率
}

enum ConsultantLevel {
  ANALYST       // アナリスト
  CONSULTANT    // コンサルタント
  SENIOR        // シニアコンサルタント
  MANAGER       // マネージャー
  SENIOR_MANAGER // シニアマネージャー
  PRINCIPAL     // プリンシパル
  PARTNER       // パートナー
}
```

### Skill（スキル）
```
Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  parentSkillId: string?  // 階層構造
  relatedSkills: string[]
  demandLevel: DemandLevel  // 需要レベル
}

enum SkillCategory {
  TECHNICAL     // 技術スキル
  FUNCTIONAL    // 機能スキル
  INDUSTRY      // 業界知識
  LANGUAGE      // 言語スキル
  SOFT_SKILL    // ソフトスキル
  TOOL          // ツール・ソフトウェア
}

enum DemandLevel {
  LOW           // 低
  MEDIUM        // 中
  HIGH          // 高
  CRITICAL      // 重要
}
```

### ConsultantSkill（コンサルタントスキル）
```
ConsultantSkill {
  id: string
  consultantId: string
  skillId: string
  level: SkillLevel
  yearsOfExperience: number
  lastUsedDate: Date?
  verifiedBy: string?  // 検証者
  verifiedAt: DateTime?
  endorsements: Endorsement[]
}

enum SkillLevel {
  BEGINNER      // 初級
  INTERMEDIATE  // 中級
  ADVANCED      // 上級
  EXPERT        // エキスパート
}
```

### ProjectAssignment（プロジェクトアサインメント）
```
ProjectAssignment {
  id: string
  consultantId: string
  projectId: string  // 外部参照
  role: string
  allocationPercentage: number
  startDate: Date
  endDate: Date?
  status: AssignmentStatus
  actualStartDate: Date?
  actualEndDate: Date?
  performanceRating: number?
  notes: string?
  approvedBy: string
  approvedAt: DateTime
}

enum AssignmentStatus {
  PROPOSED      // 提案中
  CONFIRMED     // 確定
  ACTIVE        // アクティブ
  COMPLETED     // 完了
  CANCELLED     // キャンセル
}
```

### Availability（稼働可能状況）
```
Availability {
  id: string
  consultantId: string
  date: Date
  availablePercentage: number
  bookedPercentage: number
  tentativePercentage: number
  vacationFlag: boolean
  notes: string?
}
```

### SkillDemand（スキル需要）
```
SkillDemand {
  id: string
  skillId: string
  projectId: string?  // 外部参照
  requiredLevel: SkillLevel
  requiredCount: number
  urgency: Urgency
  startDate: Date
  endDate: Date?
  status: DemandStatus
  notes: string?
}

enum Urgency {
  LOW           // 低
  MEDIUM        // 中
  HIGH          // 高
  CRITICAL      // 緊急
}

enum DemandStatus {
  OPEN          // 未充足
  PARTIALLY_FILLED // 部分充足
  FILLED        // 充足
  CANCELLED     // キャンセル
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

### Language（言語）
```
Language {
  code: string  // ISO 639-1
  name: string
  proficiency: LanguageProficiency
}

enum LanguageProficiency {
  BASIC         // 基礎
  CONVERSATIONAL // 会話可能
  BUSINESS      // ビジネスレベル
  FLUENT        // 流暢
  NATIVE        // ネイティブ
}
```

### Certification（資格）
```
Certification {
  id: string
  name: string
  issuer: string
  issuedDate: Date
  expiryDate: Date?
  credentialId: string?
  verificationUrl: string?
}
```

### Endorsement（推薦）
```
Endorsement {
  id: string
  endorserId: string
  endorsedAt: DateTime
  comment: string?
}
```

## 集約ルート

- `User`: ユーザー情報の集約ルート
- `Organization`: 組織構造の集約ルート
- `Consultant`: コンサルタント情報の集約ルート
- `ProjectAssignment`: アサインメント管理の集約ルート

## ドメインサービス

### SkillMatchingService
- プロジェクト要件とコンサルタントスキルのマッチング
- スキルギャップ分析
- 推奨コンサルタントの提案

### AvailabilityService
- 稼働率計算
- 空き状況の検索
- 最適なリソース配分の提案

### TeamFormationService
- チーム編成の最適化
- スキルバランスの評価
- チームパフォーマンス予測