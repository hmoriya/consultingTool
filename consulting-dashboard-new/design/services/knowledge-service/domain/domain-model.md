# 知識管理サービス ドメインモデル

**更新日: 2025-01-13**

## 概要
知識管理サービスに関連するドメインモデルを定義する。ナレッジ記事、テンプレート、FAQ、エキスパート情報などの知識資産を管理する。

## エンティティ

### KnowledgeArticle（ナレッジ記事）
```
KnowledgeArticle {
  id: string
  title: string
  category: KnowledgeCategory
  tags: Tag[]
  summary: string
  content: Content
  authorId: string     // 外部参照
  relatedProjects: string[]  // 外部参照
  visibility: Visibility
  status: ArticleStatus
  version: Version
  reviewers: Reviewer[]
  metrics: ArticleMetrics
  relatedArticles: string[]
  attachments: Attachment[]
  metadata: ArticleMetadata
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt: DateTime?
  archivedAt: DateTime?
}

enum KnowledgeCategory {
  TECHNICAL          // 技術知識
  INDUSTRY           // 業界知識
  METHODOLOGY        // 方法論
  TOOL               // ツール・ソフトウェア
  PROCESS            // プロセス・手順
  BEST_PRACTICE      // ベストプラクティス
  CASE_STUDY         // 事例研究
  OTHER              // その他
}

enum ArticleStatus {
  DRAFT              // 下書き
  IN_REVIEW          // レビュー中
  APPROVED           // 承認済み
  PUBLISHED          // 公開済み
  ARCHIVED           // アーカイブ
  DEPRECATED         // 非推奨
}
```

### Content（コンテンツ）
```
Content {
  format: ContentFormat
  body: string
  sections: Section[]
  tableOfContents: TOCItem[]
  estimatedReadTime: number  // 分
}

enum ContentFormat {
  MARKDOWN
  HTML
  RICH_TEXT
}
```

### Section（セクション）
```
Section {
  id: string
  title: string
  content: string
  order: number
  level: number
}
```

### Tag（タグ）
```
Tag {
  id: string
  name: string
  category: string?
  usageCount: number
  createdAt: DateTime
}
```

### Visibility（公開範囲）
```
Visibility {
  scope: VisibilityScope
  departments: string[]?     // 外部参照
  projects: string[]?        // 外部参照
  users: string[]?           // 外部参照
}

enum VisibilityScope {
  PUBLIC             // 全体公開
  DEPARTMENT         // 部門限定
  PROJECT            // プロジェクト限定
  PRIVATE            // 非公開
  CUSTOM             // カスタム
}
```

### Version（バージョン）
```
Version {
  number: string     // "1.0", "2.1"
  changes: string[]
  previousVersionId: string?
  createdBy: string  // 外部参照
  createdAt: DateTime
}
```

### Reviewer（レビュアー）
```
Reviewer {
  userId: string     // 外部参照
  role: ReviewerRole
  status: ReviewStatus
  comments: string?
  reviewedAt: DateTime?
}

enum ReviewerRole {
  CONTENT            // 内容レビュー
  TECHNICAL          // 技術レビュー
  FINAL              // 最終レビュー
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  CONDITIONAL        // 条件付き承認
}
```

### ArticleMetrics（記事メトリクス）
```
ArticleMetrics {
  views: number
  uniqueViewers: number
  likes: number
  shares: number
  downloads: number
  ratings: Rating[]
  avgRating: number
  bookmarks: number
}
```

### Rating（評価）
```
Rating {
  userId: string     // 外部参照
  score: number      // 1-5
  comment: string?
  ratedAt: DateTime
}
```

### ArticleMetadata（記事メタデータ）
```
ArticleMetadata {
  industry: string[]
  technology: string[]
  difficulty: DifficultyLevel
  targetAudience: string[]
  prerequisites: string[]
  keywords: string[]
}

enum DifficultyLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}
```

### Template（テンプレート）
```
Template {
  id: string
  name: string
  category: TemplateCategory
  description: string
  useCase: string
  file: TemplateFile
  variables: TemplateVariable[]
  instructions: string
  examples: Example[]
  tags: Tag[]
  version: string
  status: TemplateStatus
  usage: TemplateUsage
  approval: ApprovalInfo?
  createdBy: string  // 外部参照
  createdAt: DateTime
  updatedAt: DateTime
}

enum TemplateCategory {
  PROPOSAL           // 提案書
  REPORT             // レポート
  PRESENTATION       // プレゼンテーション
  SPECIFICATION      // 仕様書
  CONTRACT           // 契約書
  PROCESS            // プロセス文書
  CHECKLIST          // チェックリスト
  OTHER              // その他
}

enum TemplateStatus {
  DRAFT
  ACTIVE
  DEPRECATED
  ARCHIVED
}
```

### TemplateFile（テンプレートファイル）
```
TemplateFile {
  name: string
  url: string
  format: string     // docx, xlsx, pptx, etc.
  size: number
  checksum: string
}
```

### TemplateVariable（テンプレート変数）
```
TemplateVariable {
  name: string
  description: string
  type: VariableType
  required: boolean
  defaultValue: any?
  options: string[]?
  validation: string?
}

enum VariableType {
  TEXT
  NUMBER
  DATE
  SELECT
  BOOLEAN
  LIST
}
```

### TemplateUsage（テンプレート利用状況）
```
TemplateUsage {
  count: number
  lastUsed: DateTime?
  rating: number
  feedback: string[]
  popularVariations: string[]
}
```

### BestPractice（ベストプラクティス）
```
BestPractice {
  id: string
  title: string
  context: Context
  implementation: Implementation
  results: Results
  successFactors: string[]
  lessonsLearned: LessonsLearned
  applicability: Applicability
  evidence: Evidence[]
  status: BestPracticeStatus
  metrics: PracticeMetrics
  createdBy: string  // 外部参照
  createdAt: DateTime
  verifiedBy: string?  // 外部参照
  verifiedAt: DateTime?
}

enum BestPracticeStatus {
  PROPOSED           // 提案中
  UNDER_REVIEW       // レビュー中
  VERIFIED           // 検証済み
  RECOMMENDED        // 推奨
  OBSOLETE           // 陳腐化
}
```

### Context（コンテキスト）
```
Context {
  background: string
  challenge: string
  constraints: string[]
  objectives: string[]
  stakeholders: string[]
}
```

### Implementation（実装）
```
Implementation {
  approach: string
  steps: Step[]
  timeline: string
  resources: Resource[]
  tools: string[]
  risks: string[]
}
```

### Step（ステップ）
```
Step {
  order: number
  action: string
  description: string
  responsible: string?
  duration: string?
  deliverables: string[]
}
```

### Results（結果）
```
Results {
  outcomes: string[]
  metrics: Metric[]
  benefits: string[]
  challenges: string[]
  clientFeedback: string?
}
```

### Metric（メトリック）
```
Metric {
  name: string
  before: string
  after: string
  improvement: string
  unit: string?
}
```

### FAQ（よくある質問）
```
FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: Tag[]
  relatedTo: RelatedEntity?
  variants: string[]   // 同じ質問の別表現
  attachments: Attachment[]
  helpful: HelpfulVote[]
  views: number
  status: FAQStatus
  createdBy: string    // 外部参照
  createdAt: DateTime
  updatedAt: DateTime
}

enum FAQStatus {
  DRAFT
  PUBLISHED
  OUTDATED
  ARCHIVED
}
```

### HelpfulVote（役立ち度投票）
```
HelpfulVote {
  userId: string       // 外部参照
  helpful: boolean
  comment: string?
  votedAt: DateTime
}
```

### Expert（エキスパート）
```
Expert {
  id: string
  userId: string       // 外部参照
  expertise: Expertise[]
  availability: ExpertAvailability
  supportTypes: SupportType[]
  languages: string[]
  timezone: string
  bio: string
  achievements: Achievement[]
  ratings: ExpertRating
  preferences: ExpertPreferences
  status: ExpertStatus
}

enum SupportType {
  CONSULTATION       // コンサルテーション
  REVIEW             // レビュー
  MENTORING          // メンタリング
  COLLABORATION      // コラボレーション
  TRAINING           // トレーニング
}

enum ExpertStatus {
  AVAILABLE          // 対応可能
  BUSY               // 多忙
  UNAVAILABLE        // 対応不可
  ON_LEAVE           // 休暇中
}
```

### Expertise（専門知識）
```
Expertise {
  skillId: string      // 外部参照
  level: ExpertiseLevel
  yearsOfExperience: number
  description: string
  certifications: string[]
  keyProjects: ProjectExperience[]
  endorsements: number
  verified: boolean
}

enum ExpertiseLevel {
  PRACTITIONER       // 実践者
  PROFICIENT         // 熟練
  EXPERT             // エキスパート
  THOUGHT_LEADER     // ソートリーダー
}
```

### ProjectExperience（プロジェクト経験）
```
ProjectExperience {
  projectName: string
  role: string
  duration: string
  achievements: string[]
  technologies: string[]
  industryDomain: string
}
```

### ExpertRating（エキスパート評価）
```
ExpertRating {
  overall: number
  technical: number
  communication: number
  responsiveness: number
  reviewCount: number
  recommendations: number
}
```

### SearchQuery（検索クエリ）
```
SearchQuery {
  id: string
  query: string
  filters: SearchFilter[]
  userId: string       // 外部参照
  results: number
  clickedResults: string[]
  searchedAt: DateTime
  searchDuration: number
}
```

### SearchFilter（検索フィルター）
```
SearchFilter {
  field: string
  operator: FilterOperator
  value: any
}

enum FilterOperator {
  EQUALS
  CONTAINS
  GREATER_THAN
  LESS_THAN
  IN
  NOT_IN
  BETWEEN
}
```

## 値オブジェクト

### ApprovalInfo（承認情報）
```
ApprovalInfo {
  required: boolean
  approvers: string[]  // 外部参照
  approvedBy: string?  // 外部参照
  approvedAt: DateTime?
}
```

### Example（例）
```
Example {
  name: string
  description: string
  url: string
  type: string
}
```

### Resource（リソース）
```
Resource {
  type: ResourceType
  name: string
  quantity: number
  cost: Money?
}

enum ResourceType {
  HUMAN
  TOOL
  INFRASTRUCTURE
  BUDGET
  TIME
}
```

### LessonsLearned（教訓）
```
LessonsLearned {
  positive: string[]   // うまくいったこと
  negative: string[]   // 改善点
  recommendations: string[]
}
```

### Applicability（適用可能性）
```
Applicability {
  projectTypes: string[]
  industries: string[]
  teamSize: string
  maturityLevel: string
  conditions: string[]
  limitations: string[]
}
```

### Evidence（証拠）
```
Evidence {
  type: EvidenceType
  title: string
  url: string
  description: string
  date: Date
}

enum EvidenceType {
  DOCUMENT
  METRIC
  TESTIMONIAL
  CASE_STUDY
  RESEARCH
}
```

### ExpertAvailability（エキスパート可用性）
```
ExpertAvailability {
  hoursPerWeek: number
  preferredTimes: TimeSlot[]
  blackoutDates: DateRange[]
  responseTime: string  // "within 24 hours"
}
```

### TimeSlot（時間枠）
```
TimeSlot {
  dayOfWeek: DayOfWeek
  startTime: string    // "HH:mm"
  endTime: string      // "HH:mm"
}
```

### ExpertPreferences（エキスパート設定）
```
ExpertPreferences {
  minEngagementHours: number
  preferredFormats: string[]
  topicPreferences: string[]
  industriesServed: string[]
}
```

### PracticeMetrics（プラクティスメトリクス）
```
PracticeMetrics {
  adoptionCount: number
  successRate: number
  avgImplementationTime: string
  roiMultiplier: number
  satisfactionScore: number
}
```

### TOCItem（目次項目）
```
TOCItem {
  title: string
  level: number
  anchor: string
  children: TOCItem[]
}
```

### RelatedEntity（関連エンティティ）
```
RelatedEntity {
  type: string
  id: string
  name: string
}
```

### Attachment（添付ファイル）
```
Attachment {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  uploadedAt: DateTime
}
```

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

## 集約ルート

- `KnowledgeArticle`: ナレッジ記事の集約ルート
- `Template`: テンプレート管理の集約ルート
- `BestPractice`: ベストプラクティスの集約ルート
- `FAQ`: FAQ管理の集約ルート
- `Expert`: エキスパート情報の集約ルート

## ドメインサービス

### KnowledgeSearchService
- 全文検索
- 意味的検索
- レコメンデーション

### TemplateService
- テンプレート適用
- 変数置換
- バージョン管理

### ExpertMatchingService
- スキルマッチング
- 可用性確認
- 最適なエキスパート提案

### KnowledgeAnalyticsService
- 利用状況分析
- ナレッジギャップ特定
- 貢献度測定

### ContentManagementService
- コンテンツ品質管理
- レビューワークフロー
- アーカイブ管理