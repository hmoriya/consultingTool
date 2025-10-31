# BC-001: ドメイン設計

**BC**: Project Delivery & Quality Management
**作成日**: 2025-10-31
**V2移行元**: services/project-success-service/domain-language.md

---

## 概要

このドキュメントは、BC-001（プロジェクト配信と品質管理）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Project Aggregate
**集約ルート**: Project [Project] [PROJECT]
- **責務**: プロジェクトのライフサイクル全体を管理
- **包含エンティティ**: Milestone, ProjectSchedule
- **不変条件**: 全マイルストーン完了時のみプロジェクト完了可能

### 2. Task Aggregate
**集約ルート**: Task [Task] [TASK]
- **責務**: タスクの実行と進捗管理
- **包含エンティティ**: SubTask, TaskDependency
- **不変条件**: 依存タスク完了前は開始不可

### 3. Deliverable Aggregate
**集約ルート**: Deliverable [Deliverable] [DELIVERABLE]
- **責務**: 成果物の品質保証とバージョン管理
- **包含エンティティ**: DeliverableVersion, QualityReview
- **不変条件**: レビュー承認済みのみ確定可能

### 4. Risk Aggregate
**集約ルート**: Risk [Risk] [RISK]
- **責務**: リスクのライフサイクル管理
- **包含エンティティ**: RiskMitigation, Issue
- **不変条件**: 重大リスクは対応策必須

---

## 主要エンティティ（Entities）

### Project [Project] [PROJECT]
プロジェクト [Project] [PROJECT]
├── プロジェクトID [ProjectID] [PROJECT_ID]: UUID
├── プロジェクト名 [ProjectName] [PROJECT_NAME]: STRING_200
├── 状態 [Status] [STATUS]: ENUM（計画中/実行中/完了/中止）
├── 開始日 [StartDate] [START_DATE]: DATE
├── 終了日 [EndDate] [END_DATE]: DATE
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Task [Task] [TASK]
タスク [Task] [TASK]
├── タスクID [TaskID] [TASK_ID]: UUID
├── タスク名 [TaskName] [TASK_NAME]: STRING_200
├── 状態 [Status] [STATUS]: ENUM（未着手/進行中/完了/保留）
├── 優先度 [Priority] [PRIORITY]: ENUM（高/中/低）
├── 見積工数 [EstimatedHours] [ESTIMATED_HOURS]: DECIMAL
└── 実績工数 [ActualHours] [ACTUAL_HOURS]: DECIMAL

### Deliverable [Deliverable] [DELIVERABLE]
成果物 [Deliverable] [DELIVERABLE]
├── 成果物ID [DeliverableID] [DELIVERABLE_ID]: UUID
├── 成果物名 [DeliverableName] [DELIVERABLE_NAME]: STRING_200
├── 品質状態 [QualityStatus] [QUALITY_STATUS]: ENUM（未レビュー/レビュー中/承認済み/差戻し）
├── バージョン [Version] [VERSION]: STRING_20
└── レビュー期限 [ReviewDeadline] [REVIEW_DEADLINE]: DATE

### Risk [Risk] [RISK]
リスク [Risk] [RISK]
├── リスクID [RiskID] [RISK_ID]: UUID
├── リスク名 [RiskName] [RISK_NAME]: STRING_200
├── 影響度 [Impact] [IMPACT]: ENUM（高/中/低）
├── 発生確率 [Probability] [PROBABILITY]: ENUM（高/中/低）
└── 状態 [Status] [STATUS]: ENUM（識別/評価/対応中/解決/発現）

---

## 主要値オブジェクト（Value Objects）

### ProjectSchedule [ProjectSchedule] [PROJECT_SCHEDULE]
プロジェクトスケジュール [ProjectSchedule] [PROJECT_SCHEDULE]
├── 開始日 [startDate] [START_DATE]: DATE
├── 終了日 [endDate] [END_DATE]: DATE
└── 期間日数 [durationDays] [DURATION_DAYS]: INTEGER

### TaskDependency [TaskDependency] [TASK_DEPENDENCY]
タスク依存関係 [TaskDependency] [TASK_DEPENDENCY]
├── 先行タスクID [predecessorTaskId] [PREDECESSOR_TASK_ID]: UUID
├── 後続タスクID [successorTaskId] [SUCCESSOR_TASK_ID]: UUID
└── 依存タイプ [dependencyType] [DEPENDENCY_TYPE]: ENUM（FS/SS/FF/SF）

### QualityCriteria [QualityCriteria] [QUALITY_CRITERIA]
品質基準 [QualityCriteria] [QUALITY_CRITERIA]
├── 基準名 [criteriaName] [CRITERIA_NAME]: STRING_100
├── 基準値 [criteriaValue] [CRITERIA_VALUE]: STRING_200
└── 必須フラグ [isMandatory] [IS_MANDATORY]: BOOLEAN

---

## ドメインサービス

### ProjectPlanningService
**責務**: プロジェクト計画の最適化
- `optimizeProjectSchedule()`: スケジュール最適化
- `validateTaskDependencies()`: タスク依存関係検証
- `calculateCriticalPath()`: クリティカルパス算出

### QualityAssuranceService
**責務**: 品質保証プロセスの統括
- `enforceQualityStandards()`: 品質基準の適用
- `coordinateReviewProcess()`: レビュープロセスの調整（→ BC-007連携）
- `validateDeliverableQuality()`: 成果物品質検証

### RiskManagementService
**責務**: リスク管理の高度化
- `assessOverallRisk()`: 全体リスク評価
- `prioritizeMitigationActions()`: 対応優先順位付け
- `escalateCriticalRisks()`: 重大リスクのエスカレーション（→ BC-007連携）

---

## V2からの移行メモ

### 移行済み
- ✅ Project, Task, Deliverable, Riskエンティティの定義
- ✅ 集約境界の明確化
- ✅ 値オブジェクトの抽出

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 1 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
