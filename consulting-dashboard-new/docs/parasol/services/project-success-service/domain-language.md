# パラソルドメイン言語: プロジェクト成功支援サービス

**バージョン**: 1.2.0
**更新日**: 2024-12-30

## パラソルドメイン概要
プロジェクトの立ち上げから完了まで、全ライフサイクルを通じて成功を支援するドメインモデル。DDD原則に基づき、明確な集約境界とステレオタイプマーキングにより、プロジェクト、タスク、マイルストーン、リスク、成果物、ステークホルダーの関係を体系的に定義。すべてのエンティティは適切な集約に所属し、ID参照による疎結合を実現。

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式（RFC5322準拠）
URL: URL形式
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
JSON: JSON形式データ
```

### エンティティ定義

#### Project（プロジェクト）<<entity>><<aggregate root>>
**概要**: 特定の目標を達成するための時限的な取り組みの集約ルート
**識別性**: projectIdによって一意に識別される
**ライフサイクル**: 計画→実行→監視→完了→評価
**集約所属**: ProjectAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| code | STRING_20 | ○ | プロジェクトコード（例：DX001） |
| name | STRING_100 | ○ | プロジェクト名 |
| description | TEXT | × | プロジェクト概要 |
| clientId | UUID | ○ | クライアント識別子 |
| status | ENUM | ○ | ステータス（Planning/Active/OnHold/Completed/Cancelled） |
| priority | ENUM | ○ | 優先度（Critical/High/Medium/Low） |
| startDate | DATE | ○ | 開始日 |
| endDate | DATE | ○ | 終了予定日 |
| actualEndDate | DATE | × | 実際の終了日 |
| budget | MONEY | ○ | 予算 |
| actualCost | MONEY | × | 実際のコスト |
| projectManagerId | UUID | ○ | プロジェクトマネージャーID |
| sponsorId | UUID | ○ | スポンサーID |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- プロジェクトコードは組織内で一意
- 終了日は開始日より後
- ステータス遷移は定義されたフローに従う
- 予算超過時はアラート発生

#### Task（タスク）<<entity>><<aggregate root>>
**概要**: プロジェクト内の実行可能な最小作業単位の集約ルート
**識別性**: taskIdによって一意に識別される
**ライフサイクル**: 計画→アサイン→実行→レビュー→完了
**集約所属**: TaskAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | 所属プロジェクト |
| parentTaskId | UUID | × | 親タスクID（階層構造） |
| code | STRING_20 | ○ | タスクコード |
| name | STRING_100 | ○ | タスク名 |
| description | TEXT | × | 詳細説明 |
| assigneeId | UUID | × | 担当者ID |
| status | ENUM | ○ | ステータス（NotStarted/InProgress/Review/Completed/Blocked） |
| priority | ENUM | ○ | 優先度（Critical/High/Medium/Low） |
| estimatedHours | DECIMAL | ○ | 見積工数 |
| actualHours | DECIMAL | × | 実績工数 |
| startDate | DATE | ○ | 開始予定日 |
| dueDate | DATE | ○ | 期限 |
| completedDate | DATE | × | 完了日 |
| progress | PERCENTAGE | ○ | 進捗率（0-100） |
| dependencies | JSON | × | 依存タスクリスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 子タスクの進捗は親タスクに反映
- 依存タスクが完了するまで開始不可
- 期限超過時は自動的にアラート

#### Milestone（マイルストーン）<<entity>>
**概要**: プロジェクトの重要な節目や成果物の完成時点エンティティ
**識別性**: milestoneIdによって一意に識別される
**ライフサイクル**: 計画→設定→監視→達成/未達
**集約所属**: ProjectAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | 所属プロジェクト |
| name | STRING_100 | ○ | マイルストーン名 |
| description | TEXT | × | 説明 |
| targetDate | DATE | ○ | 目標日 |
| actualDate | DATE | × | 実際の達成日 |
| status | ENUM | ○ | ステータス（Pending/Achieved/Missed） |
| deliverables | JSON | × | 成果物リスト |
| criteria | TEXT | × | 達成条件 |
| isKeyMilestone | BOOLEAN | ○ | 重要マイルストーンフラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Risk（リスク）<<entity>><<aggregate root>>
**概要**: プロジェクトの成功を脅かす可能性のある事象の集約ルート
**識別性**: riskIdによって一意に識別される
**ライフサイクル**: 特定→分析→軽減→監視→終結
**集約所属**: RiskAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | 所属プロジェクト |
| code | STRING_20 | ○ | リスクコード |
| title | STRING_100 | ○ | リスクタイトル |
| description | TEXT | ○ | 詳細説明 |
| category | ENUM | ○ | カテゴリ（Technical/Schedule/Cost/Quality/External） |
| probability | ENUM | ○ | 発生確率（VeryLow/Low/Medium/High/VeryHigh） |
| impact | ENUM | ○ | 影響度（VeryLow/Low/Medium/High/VeryHigh） |
| riskScore | INTEGER | ○ | リスクスコア（確率×影響度） |
| status | ENUM | ○ | ステータス（Identified/Analyzing/Mitigating/Monitoring/Closed） |
| owner | UUID | ○ | リスクオーナー |
| mitigationPlan | TEXT | × | 軽減計画 |
| contingencyPlan | TEXT | × | 代替計画 |
| identifiedDate | DATE | ○ | 特定日 |
| targetResolutionDate | DATE | × | 解決目標日 |
| actualResolutionDate | DATE | × | 実際の解決日 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Deliverable（成果物）<<entity>><<aggregate root>>
**概要**: プロジェクトで作成・納品される具体的な成果の集約ルート
**識別性**: deliverableIdによって一意に識別される
**ライフサイクル**: 計画→作成→レビュー→承認→納品
**集約所属**: DeliverableAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | 所属プロジェクト |
| milestoneId | UUID | × | 関連マイルストーン |
| name | STRING_100 | ○ | 成果物名 |
| description | TEXT | × | 説明 |
| type | ENUM | ○ | 種類（Document/Software/Report/Presentation/Other） |
| status | ENUM | ○ | ステータス（Draft/Review/Approved/Delivered） |
| version | STRING_20 | ○ | バージョン |
| fileUrl | URL | × | ファイルURL |
| size | INTEGER | × | ファイルサイズ（バイト） |
| checksum | STRING_100 | × | チェックサム |
| dueDate | DATE | ○ | 納期 |
| deliveredDate | DATE | × | 納品日 |
| approvedBy | UUID | × | 承認者 |
| approvedDate | DATE | × | 承認日 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### ProjectMember（プロジェクトメンバー）<<entity>>
**概要**: プロジェクトに参画するメンバーと役割エンティティ
**識別性**: projectMemberIdによって一意に識別される
**ライフサイクル**: アサイン→稼働→評価→終了
**集約所属**: ProjectAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| projectId | UUID | ○ | プロジェクトID |
| userId | UUID | ○ | ユーザーID |
| role | ENUM | ○ | 役割（PM/Leader/Member/Observer） |
| allocationRate | PERCENTAGE | ○ | アサイン率（0-100%） |
| startDate | DATE | ○ | 参画開始日 |
| endDate | DATE | × | 参画終了日 |
| responsibilities | TEXT | × | 責任範囲 |
| skills | JSON | × | 必要スキルリスト |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### 値オブジェクト定義

#### ProjectStatus（プロジェクトステータス）<<value object>>
**概要**: プロジェクトの現在の状態を表現する値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| status | ENUM | ○ | ステータス値 |
| reason | TEXT | × | 状態の理由 |
| changedAt | TIMESTAMP | ○ | 変更日時 |
| changedBy | UUID | ○ | 変更者 |

**制約**:
- ステータス遷移は定義されたルールに従う
- Cancelledからの復帰は不可

#### RiskMatrix（リスクマトリックス）<<value object>>
**概要**: リスクの確率と影響度から優先度を算出する値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| probability | INTEGER | ○ | 確率（1-5） |
| impact | INTEGER | ○ | 影響度（1-5） |
| score | INTEGER | ○ | スコア（確率×影響度） |
| level | ENUM | ○ | レベル（Low/Medium/High/Critical） |

### 集約定義

#### ProjectAggregate（プロジェクト集約）<<aggregate>>
**集約ルート**: Project（プロジェクト）
**集約境界**: Project（プロジェクト）、Milestone（マイルストーン）、ProjectMember（プロジェクトメンバー）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Project（集約ルート・1対1）
- Milestone（1対多・プロジェクトの主要節目）
- ProjectMember（1対多・プロジェクト参画メンバー）

**包含値オブジェクト**:
- ProjectStatus（プロジェクト状態）

**集約境界の理由**:
- プロジェクトとマイルストーン、メンバーは密接に関連し、トランザクション整合性が必要
- プロジェクト計画変更時にマイルストーンとメンバー配置を同時に調整する必要がある
- プロジェクトのステータスとメンバーのアサイン状態の整合性を保つ必要がある

**不変条件**:
- プロジェクトの予算はタスクの合計コストを下回らない
- すべてのタスクが完了するまでプロジェクトは完了できない
- マイルストーンの日付はプロジェクト期間内
- プロジェクトメンバーのアサイン率合計は各人100%を超えない
- 同一プロジェクト内でプロジェクトコードは一意

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- Client集約とはclientIdのみで参照（IDのみ参照）
- Task集約とはprojectIdのみで参照（IDのみ参照）
- Risk集約とはprojectIdのみで参照（IDのみ参照）
- Deliverable集約とはprojectIdのみで参照（IDのみ参照）

#### TaskAggregate（タスク集約）<<aggregate>>
**集約ルート**: Task（タスク）
**集約境界**: Task（タスク）、TaskDependency（タスク依存関係）、TaskAssignment（タスク割り当て）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Task（集約ルート・1対1）
- TaskDependency（1対多・タスク間の依存関係）
- TaskAssignment（1対多・タスクへのアサイン情報）

**集約境界の理由**:
- タスクとその依存関係、割り当ては密接に関連し、トランザクション整合性が必要
- タスクステータス変更時に依存関係と割り当てを検証する必要がある
- タスク階層構造の整合性を保つ必要がある

**不変条件**:
- 親タスクの進捗は子タスクの加重平均
- 循環依存は作成不可
- タスクの工数は子タスクの合計以上
- 依存タスクが完了するまで後続タスクは開始不可
- タスクの期間はプロジェクト期間内

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- User集約とはassigneeIdのみで参照（IDのみ参照）

#### RiskAggregate（リスク集約）<<aggregate>>
**集約ルート**: Risk（リスク）
**集約境界**: Risk（リスク）、MitigationAction（軽減アクション）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Risk（集約ルート・1対1）
- MitigationAction（1対多・リスク軽減策）

**包含値オブジェクト**:
- RiskMatrix（リスクマトリックス）

**集約境界の理由**:
- リスクとその軽減策は密接に関連し、同時に管理される
- リスク評価変更時に軽減策の妥当性を再検証する必要がある

**不変条件**:
- リスクスコア = 発生確率 × 影響度
- リスクステータスは定義されたフローに従う
- 軽減策の実施期限はリスクの解決目標日以前
- Critical/Highリスクは必ず軽減策を持つ

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- User集約とはownerIdのみで参照（IDのみ参照）

#### DeliverableAggregate（成果物集約）<<aggregate>>
**集約ルート**: Deliverable（成果物）
**集約境界**: Deliverable（成果物）、DeliverableVersion（成果物バージョン）、DeliverableApproval（成果物承認）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Deliverable（集約ルート・1対1）
- DeliverableVersion（1対多・成果物のバージョン履歴）
- DeliverableApproval（1対多・成果物の承認記録）

**集約境界の理由**:
- 成果物とそのバージョン、承認は密接に関連し、トランザクション整合性が必要
- バージョン管理と承認フローの整合性を保つ必要がある

**不変条件**:
- バージョンは昇順で管理される
- 承認済み成果物の直接編集は不可（新バージョン作成）
- Deliveredステータスは承認後のみ可能
- 納品日は承認日以降

**他集約との関係**:
- Project集約とはprojectIdのみで参照（IDのみ参照）
- Milestone集約とはmilestoneIdのみで参照（IDのみ参照）
- User集約とはapprovedByのみで参照（IDのみ参照）

### ドメインサービス

#### ProjectSchedulingService <<service>>
**概要**: Project集約とTask集約をまたぐスケジュール計算と最適化サービス
**責務**: プロジェクト全体のスケジュール調整、クリティカルパス計算
**ステレオタイプ**: service

**操作**:
- `calculateCriticalPath(projectId: UUID) -> Task[]`: クリティカルパスの算出と可視化
- `optimizeSchedule(projectId: UUID) -> Schedule`: リソース制約を考慮したスケジュール最適化
- `calculateProjectCompletion(projectId: UUID) -> DATE`: 現在進捗に基づく完了予定日計算
- `identifyBottlenecks(projectId: UUID) -> Task[]`: スケジュールボトルネックの特定と改善提案
- `adjustSchedule(projectId: UUID, adjustments: ScheduleChange[]) -> Schedule`: スケジュール調整と影響分析

#### RiskAssessmentService <<service>>
**概要**: Risk集約とProject集約をまたぐリスク評価と対策立案サービス
**責務**: プロジェクトリスクの総合評価、軽減策の提案
**ステレオタイプ**: service

**操作**:
- `assessRisk(risk: Risk) -> RiskScore`: 発生確率と影響度からリスクスコア評価
- `prioritizeRisks(projectId: UUID) -> Risk[]`: プロジェクト全体のリスク優先順位付け
- `suggestMitigation(risk: Risk) -> MitigationPlan`: AIベースの軽減策提案
- `calculateProjectRiskScore(projectId: UUID) -> INTEGER`: プロジェクト全体リスクスコアの計算
- `monitorRiskTrends(projectId: UUID, period: DateRange) -> RiskTrend[]`: リスク傾向の監視と予測

#### ResourceAllocationService <<service>>
**概要**: Project集約、Task集約、User集約をまたぐリソース最適配分サービス
**責務**: メンバーの最適なアサイン、稼働率管理、再配分提案
**ステレオタイプ**: service

**操作**:
- `allocateResources(projectId: UUID, members: ProjectMember[]) -> Allocation[]`: スキルとキャパシティに基づくリソース配分
- `checkOverallocation(userId: UUID) -> BOOLEAN`: 複数プロジェクトをまたいだ過剰配分チェック
- `suggestReallocation(projectId: UUID) -> Suggestion[]`: 現状分析に基づく再配分提案
- `calculateUtilization(userId: UUID, period: DateRange) -> PERCENTAGE`: 期間別稼働率計算
- `optimizeTeamComposition(projectId: UUID) -> TeamSuggestion`: プロジェクト成功に向けた最適チーム編成提案

### ドメインイベント

#### ProjectCreated <<event>>
**発生条件**: 新規プロジェクトが作成された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "projectId": "UUID",
  "projectCode": "STRING",
  "projectName": "STRING",
  "clientId": "UUID",
  "projectManagerId": "UUID",
  "startDate": "DATE",
  "endDate": "DATE",
  "budget": "MONEY"
}
```

#### TaskCompleted <<event>>
**発生条件**: タスクが完了した時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "taskId": "UUID",
  "projectId": "UUID",
  "completedBy": "UUID",
  "actualHours": "DECIMAL",
  "completedDate": "DATE"
}
```

#### MilestoneAchieved <<event>>
**発生条件**: マイルストーンが達成された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "milestoneId": "UUID",
  "projectId": "UUID",
  "achievedDate": "DATE",
  "deliverables": ["UUID"]
}
```

#### RiskIdentified <<event>>
**発生条件**: 新しいリスクが特定された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "riskId": "UUID",
  "projectId": "UUID",
  "riskLevel": "ENUM",
  "identifiedBy": "UUID"
}
```

#### ProjectStatusChanged <<event>>
**発生条件**: プロジェクトステータスが変更された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "projectId": "UUID",
  "oldStatus": "ENUM",
  "newStatus": "ENUM",
  "reason": "STRING",
  "changedBy": "UUID"
}
```

### リポジトリインターフェース

#### ProjectRepository <<repository>>
**責務**: Project集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface ProjectRepository {
  // 基本操作
  findById(id: UUID): Promise<Project | null>
  findByCode(code: STRING_20): Promise<Project | null>
  findAll(limit?: number, offset?: number): Promise<Project[]>
  save(project: Project): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByClientId(clientId: UUID): Promise<Project[]>
  findByStatus(status: ENUM): Promise<Project[]>
  findByDateRange(startDate: DATE, endDate: DATE): Promise<Project[]>
  findByProjectManager(pmId: UUID): Promise<Project[]>
  findActiveProjects(): Promise<Project[]>

  // 集約全体の保存
  saveWithMilestones(project: Project, milestones: Milestone[]): Promise<void>
  saveWithMembers(project: Project, members: ProjectMember[]): Promise<void>
}
```

#### TaskRepository <<repository>>
**責務**: Task集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface TaskRepository {
  // 基本操作
  findById(id: UUID): Promise<Task | null>
  findAll(limit?: number, offset?: number): Promise<Task[]>
  save(task: Task): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Task[]>
  findByAssigneeId(userId: UUID): Promise<Task[]>
  findOverdueTasks(): Promise<Task[]>
  findCriticalPath(projectId: UUID): Promise<Task[]>
  findByStatus(status: ENUM): Promise<Task[]>
  findBlockedTasks(projectId: UUID): Promise<Task[]>

  // 集約全体の保存
  saveWithDependencies(task: Task, dependencies: TaskDependency[]): Promise<void>
  saveWithAssignments(task: Task, assignments: TaskAssignment[]): Promise<void>
}
```

#### RiskRepository <<repository>>
**責務**: Risk集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface RiskRepository {
  // 基本操作
  findById(id: UUID): Promise<Risk | null>
  findAll(limit?: number, offset?: number): Promise<Risk[]>
  save(risk: Risk): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Risk[]>
  findHighPriorityRisks(threshold: INTEGER): Promise<Risk[]>
  findByStatus(status: ENUM): Promise<Risk[]>
  findByOwner(ownerId: UUID): Promise<Risk[]>
  findActiveRisks(projectId: UUID): Promise<Risk[]>

  // 集約全体の保存
  saveWithMitigations(risk: Risk, mitigations: MitigationAction[]): Promise<void>
}
```

#### DeliverableRepository <<repository>>
**責務**: Deliverable集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface DeliverableRepository {
  // 基本操作
  findById(id: UUID): Promise<Deliverable | null>
  findAll(limit?: number, offset?: number): Promise<Deliverable[]>
  save(deliverable: Deliverable): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByProjectId(projectId: UUID): Promise<Deliverable[]>
  findByMilestoneId(milestoneId: UUID): Promise<Deliverable[]>
  findByStatus(status: ENUM): Promise<Deliverable[]>
  findOverdueDeliverables(): Promise<Deliverable[]>
  findPendingApproval(): Promise<Deliverable[]>

  // 集約全体の保存
  saveWithVersions(deliverable: Deliverable, versions: DeliverableVersion[]): Promise<void>
  saveWithApprovals(deliverable: Deliverable, approvals: DeliverableApproval[]): Promise<void>
}
```

## ビジネスルール

### プロジェクト管理ルール
1. **プロジェクトコード一意性**: 組織内で重複不可
2. **予算制約**: タスクコストの合計は予算を超えない
3. **期間制約**: タスクはプロジェクト期間内に収まる
4. **ステータス遷移**: Planning → Active → Completed（逆行不可）
5. **承認フロー**: 予算超過10%以上は上位承認必要

### タスク管理ルール
1. **依存関係**: 循環依存の禁止
2. **進捗計算**: 子タスクの加重平均で親タスク進捗を算出
3. **工数制約**: 実績工数は見積の200%を超えたらアラート
4. **期限管理**: 期限3日前に未完了なら通知

### リスク管理ルール
1. **エスカレーション**: Critical/Highリスクは24時間以内に対策立案
2. **レビュー頻度**: 週次でリスク状況レビュー
3. **オーナー責任**: リスクオーナーは対策実行に責任を持つ

### 成果物管理ルール
1. **バージョン管理**: 承認後の変更は新バージョン作成
2. **承認プロセス**: Draftから直接Deliveredへの遷移は禁止
3. **納期管理**: 納期遅延は即座にPMへ通知

## サービス間連携

### 依存サービス
- **セキュアアクセスサービス**: ユーザー認証、権限管理
- **タレント最適化サービス**: メンバースキル、稼働状況
- **生産性可視化サービス**: 実績工数データ

### 提供インターフェース
- **プロジェクト情報API**: 他サービスへプロジェクト基本情報を提供
- **タスク状況API**: タスクの進捗、期限情報を提供
- **リスク情報API**: リスク状況を関係者へ通知

### イベント連携
- **ProjectCreated**: 関連サービスへプロジェクト作成を通知
- **TaskCompleted**: 工数管理サービスへ完了を通知
- **RiskIdentified**: 通知サービスへアラート依頼