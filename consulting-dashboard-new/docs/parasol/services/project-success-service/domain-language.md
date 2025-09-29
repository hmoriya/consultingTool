# パラソルドメイン言語: プロジェクト成功支援サービス

**バージョン**: 1.0.0
**更新日**: 2024-01-20

## パラソルドメイン概要
プロジェクトの立ち上げから完了まで、全ライフサイクルを通じて成功を支援するドメインモデル。プロジェクト、タスク、マイルストーン、リスク、成果物、ステークホルダーの関係を定義。

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

#### Project（プロジェクト）
**概要**: 特定の目標を達成するための時限的な取り組み
**識別子**: projectId

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

#### Task（タスク）
**概要**: プロジェクト内の実行可能な最小作業単位
**識別子**: taskId

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

#### Milestone（マイルストーン）
**概要**: プロジェクトの重要な節目や成果物の完成時点
**識別子**: milestoneId

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

#### Risk（リスク）
**概要**: プロジェクトの成功を脅かす可能性のある事象
**識別子**: riskId

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

#### Deliverable（成果物）
**概要**: プロジェクトで作成・納品される具体的な成果
**識別子**: deliverableId

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

#### ProjectMember（プロジェクトメンバー）
**概要**: プロジェクトに参画するメンバーと役割
**識別子**: projectMemberId

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

#### ProjectStatus（プロジェクトステータス）
**概要**: プロジェクトの現在の状態を表現

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| status | ENUM | ○ | ステータス値 |
| reason | TEXT | × | 状態の理由 |
| changedAt | TIMESTAMP | ○ | 変更日時 |
| changedBy | UUID | ○ | 変更者 |

**制約**:
- ステータス遷移は定義されたルールに従う
- Cancelledからの復帰は不可

#### RiskMatrix（リスクマトリックス）
**概要**: リスクの確率と影響度から優先度を算出

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| probability | INTEGER | ○ | 確率（1-5） |
| impact | INTEGER | ○ | 影響度（1-5） |
| score | INTEGER | ○ | スコア（確率×影響度） |
| level | ENUM | ○ | レベル（Low/Medium/High/Critical） |

### 集約定義

#### ProjectAggregate
**集約ルート**: Project
**境界**: Project, Task, Milestone, Risk, Deliverable, ProjectMember

**不変条件**:
- プロジェクトの予算はタスクの合計コストを下回らない
- すべてのタスクが完了するまでプロジェクトは完了できない
- マイルストーンの日付はプロジェクト期間内
- プロジェクトメンバーのアサイン率合計は各人100%を超えない

#### TaskAggregate
**集約ルート**: Task
**境界**: Task, TaskAssignment, TaskDependency

**不変条件**:
- 親タスクの進捗は子タスクの加重平均
- 循環依存は作成不可
- タスクの工数は子タスクの合計以上

### ドメインサービス

#### ProjectSchedulingService
**概要**: プロジェクトスケジュールの計算と最適化
**操作**:
- `calculateCriticalPath(projectId) -> Task[]`: クリティカルパスの算出
- `optimizeSchedule(projectId) -> Schedule`: スケジュール最適化
- `calculateProjectCompletion(projectId) -> Date`: 完了予定日計算
- `identifyBottlenecks(projectId) -> Task[]`: ボトルネック特定

#### RiskAssessmentService
**概要**: リスクの評価と対策立案
**操作**:
- `assessRisk(risk) -> RiskScore`: リスク評価
- `prioritizeRisks(projectId) -> Risk[]`: リスク優先順位付け
- `suggestMitigation(risk) -> MitigationPlan`: 軽減策提案
- `calculateProjectRiskScore(projectId) -> Integer`: プロジェクト全体リスクスコア

#### ResourceAllocationService
**概要**: リソースの最適配分
**操作**:
- `allocateResources(projectId, members) -> Allocation[]`: リソース配分
- `checkOverallocation(userId) -> Boolean`: 過剰配分チェック
- `suggestReallocation(projectId) -> Suggestion[]`: 再配分提案
- `calculateUtilization(userId, period) -> Percentage`: 稼働率計算

### ドメインイベント

#### ProjectCreated
**発生条件**: 新規プロジェクトが作成された時
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

#### TaskCompleted
**発生条件**: タスクが完了した時
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

#### MilestoneAchieved
**発生条件**: マイルストーンが達成された時
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

#### RiskIdentified
**発生条件**: 新しいリスクが特定された時
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

#### ProjectStatusChanged
**発生条件**: プロジェクトステータスが変更された時
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

#### ProjectRepository
```
interface ProjectRepository {
  findById(id: UUID): Project | null
  findByCode(code: STRING): Project | null
  findByClientId(clientId: UUID): Project[]
  findByStatus(status: ENUM): Project[]
  findByDateRange(startDate: DATE, endDate: DATE): Project[]
  save(project: Project): void
  delete(id: UUID): void
}
```

#### TaskRepository
```
interface TaskRepository {
  findById(id: UUID): Task | null
  findByProjectId(projectId: UUID): Task[]
  findByAssigneeId(userId: UUID): Task[]
  findOverdueTasks(): Task[]
  findCriticalPath(projectId: UUID): Task[]
  save(task: Task): void
  delete(id: UUID): void
}
```

#### RiskRepository
```
interface RiskRepository {
  findById(id: UUID): Risk | null
  findByProjectId(projectId: UUID): Risk[]
  findHighPriorityRisks(threshold: INTEGER): Risk[]
  findByStatus(status: ENUM): Risk[]
  save(risk: Risk): void
  delete(id: UUID): void
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