# BC-005: ドメイン設計

**BC**: Team & Resource Optimization
**作成日**: 2025-10-31
**V2移行元**: services/talent-optimization-service/domain-language.md + services/productivity-visualization-service/domain-language.md

---

## 概要

このドキュメントは、BC-005（チームとリソースの最適化）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Resource Aggregate
**集約ルート**: Resource [Resource] [RESOURCE]
- **責務**: リソースのライフサイクルと配分管理
- **包含エンティティ**: ResourceAllocation, ResourceSkill, Timesheet
- **不変条件**: リソース配分の合計が100%を超えない

### 2. Team Aggregate
**集約ルート**: Team [Team] [TEAM]
- **責務**: チームの編成と最適化管理
- **包含エンティティ**: TeamMember, TeamSkillProfile
- **不変条件**: チームは少なくとも1人のリーダーを持つ

### 3. Talent Aggregate
**集約ルート**: Talent [Talent] [TALENT]
- **責務**: タレントの育成とパフォーマンス管理
- **包含エンティティ**: PerformanceRecord, CareerPlan
- **不変条件**: パフォーマンス評価は承認済みのみ確定

### 4. Skill Aggregate
**集約ルート**: Skill [Skill] [SKILL]
- **責務**: スキルの定義と開発管理
- **包含エンティティ**: SkillLevel, SkillMatrix, TrainingProgram
- **不変条件**: スキルレベルは段階的に向上

---

## 主要エンティティ（Entities）

### Resource [Resource] [RESOURCE]
リソース [Resource] [RESOURCE]
├── リソースID [ResourceID] [RESOURCE_ID]: UUID
├── ユーザーID [UserID] [USER_ID]: UUID
├── リソースタイプ [ResourceType] [RESOURCE_TYPE]: ENUM（コンサルタント/エンジニア/デザイナー）
├── 稼働率 [UtilizationRate] [UTILIZATION_RATE]: PERCENTAGE
├── 状態 [Status] [STATUS]: ENUM（available/allocated/unavailable）
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Team [Team] [TEAM]
チーム [Team] [TEAM]
├── チームID [TeamID] [TEAM_ID]: UUID
├── チーム名 [TeamName] [TEAM_NAME]: STRING_200
├── プロジェクトID [ProjectID] [PROJECT_ID]: UUID（BC-001連携）
├── パフォーマンススコア [PerformanceScore] [PERFORMANCE_SCORE]: DECIMAL(5,2)
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Skill [Skill] [SKILL]
スキル [Skill] [SKILL]
├── スキルID [SkillID] [SKILL_ID]: UUID
├── スキル名 [SkillName] [SKILL_NAME]: STRING_100
├── カテゴリ [Category] [CATEGORY]: STRING_50
├── レベル定義 [LevelDefinition] [LEVEL_DEFINITION]: TEXT
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Timesheet [Timesheet] [TIMESHEET]
タイムシート [Timesheet] [TIMESHEET]
├── タイムシートID [TimesheetID] [TIMESHEET_ID]: UUID
├── リソースID [ResourceID] [RESOURCE_ID]: UUID
├── 期間開始 [PeriodStart] [PERIOD_START]: DATE
├── 期間終了 [PeriodEnd] [PERIOD_END]: DATE
├── 承認状態 [ApprovalStatus] [APPROVAL_STATUS]: ENUM（draft/submitted/approved/rejected）
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

---

## 主要値オブジェクト（Value Objects）

### ResourceAllocation [ResourceAllocation] [RESOURCE_ALLOCATION]
リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]
├── 配分率 [allocationPercentage] [ALLOCATION_PERCENTAGE]: PERCENTAGE
├── 開始日 [startDate] [START_DATE]: DATE
├── 終了日 [endDate] [END_DATE]: DATE
└── プロジェクトID [projectId] [PROJECT_ID]: UUID

### SkillLevel [SkillLevel] [SKILL_LEVEL]
スキルレベル [SkillLevel] [SKILL_LEVEL]
├── レベル [level] [LEVEL]: INTEGER（1-5）
├── レベル名 [levelName] [LEVEL_NAME]: STRING_50（初級/中級/上級/エキスパート/マスター）
└── 習得日 [acquiredDate] [ACQUIRED_DATE]: DATE

### PerformanceRating [PerformanceRating] [PERFORMANCE_RATING]
パフォーマンス評価 [PerformanceRating] [PERFORMANCE_RATING]
├── 評価スコア [ratingScore] [RATING_SCORE]: DECIMAL(3,2)
├── 評価期間 [evaluationPeriod] [EVALUATION_PERIOD]: STRING_20
└── コメント [comments] [COMMENTS]: TEXT

---

## ドメインサービス

### ResourceOptimizationService
**責務**: リソース最適化
- `optimizeResourceAllocation()`: リソース配分の最適化
- `forecastResourceDemand()`: リソース需要予測
- `maximizeUtilization()`: 稼働率の最大化

### TeamFormationService
**責務**: チーム編成最適化
- `formOptimalTeam()`: 最適なチーム編成
- `balanceTeamSkills()`: チームスキルバランス調整
- `analyzeTeamPerformance()`: チームパフォーマンス分析

### SkillDevelopmentService
**責務**: スキル開発
- `analyzeSkillGaps()`: スキルギャップ分析
- `recommendTraining()`: トレーニング推奨（→ BC-006連携）
- `trackSkillProgress()`: スキル進捗追跡

---

## V2からの移行メモ

### 移行済み
- ✅ Resource, Team, Talent, Skillエンティティの定義
- ✅ 集約境界の明確化
- ✅ productivity-visualization-serviceの統合

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
