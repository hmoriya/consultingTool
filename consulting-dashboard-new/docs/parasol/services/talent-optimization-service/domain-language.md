# パラソルドメイン言語: タレント最適化サービス

**バージョン**: 1.2.0
**更新日**: 2024-12-30

## パラソルドメイン概要
組織の人材（タレント）を最適に配置し、スキル開発を促進し、チームの生産性を最大化するためのドメインモデル。DDD原則に基づき、明確な集約境界とステレオタイプマーキングにより、メンバー、スキル、チーム、アサインメント、パフォーマンスの関係を体系的に定義。すべてのエンティティは適切な集約に所属し、ID参照による疎結合を実現。

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
EMAIL: メールアドレス形式
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
PERCENTAGE: パーセンテージ（0-100）
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式データ
URL: URL形式
```

### エンティティ定義

#### Member（メンバー）<<entity>><<aggregate root>>
**概要**: 組織に所属する個人の人材情報の集約ルート
**識別性**: memberIdによって一意に識別される
**ライフサイクル**: 入社→育成→評価→異動→退社
**集約所属**: MemberAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| employeeCode | STRING_20 | ○ | 社員番号 |
| userId | UUID | ○ | ユーザーID（認証サービス連携） |
| firstName | STRING_50 | ○ | 名 |
| lastName | STRING_50 | ○ | 姓 |
| email | EMAIL | ○ | メールアドレス |
| department | STRING_100 | ○ | 部署 |
| position | STRING_100 | ○ | 役職 |
| level | ENUM | ○ | レベル（Junior/Middle/Senior/Expert/Principal） |
| employmentType | ENUM | ○ | 雇用形態（FullTime/PartTime/Contract/Intern） |
| joinDate | DATE | ○ | 入社日 |
| location | STRING_100 | ○ | 勤務地 |
| timeZone | STRING_50 | ○ | タイムゾーン |
| costRate | DECIMAL | ○ | 時間単価 |
| availabilityRate | PERCENTAGE | ○ | 稼働可能率 |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| manager | UUID | × | 上司ID |
| profilePhotoUrl | URL | × | プロフィール写真 |
| bio | TEXT | × | 自己紹介 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 社員番号は組織内で一意
- 階層構造は循環参照不可
- コストレートは役職・レベルに応じた範囲内

#### Skill（スキル）<<entity>><<aggregate root>>
**概要**: 業務遂行に必要な技能や知識の集約ルート
**識別性**: skillIdによって一意に識別される
**ライフサイクル**: 定義→標準化→評価基準確立→廃止
**集約所属**: SkillAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| name | STRING_100 | ○ | スキル名 |
| category | ENUM | ○ | カテゴリ（Technical/Business/Soft/Language/Certification） |
| description | TEXT | × | 説明 |
| parentSkillId | UUID | × | 親スキルID（階層構造） |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| requiredForRoles | JSON | × | 必要とする役割リスト |
| relatedSkills | JSON | × | 関連スキルリスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### MemberSkill（メンバースキル）<<entity>>
**概要**: メンバーが保有するスキルと習熟度エンティティ
**識別性**: memberSkillIdによって一意に識別される
**ライフサイクル**: 取得→育成→検証→更新
**集約所属**: MemberAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| memberId | UUID | ○ | メンバーID |
| skillId | UUID | ○ | スキルID |
| proficiencyLevel | ENUM | ○ | 習熟度（Beginner/Intermediate/Advanced/Expert） |
| yearsOfExperience | DECIMAL | ○ | 経験年数 |
| lastUsedDate | DATE | × | 最終使用日 |
| certificationDate | DATE | × | 認定日 |
| certificationExpiry | DATE | × | 認定有効期限 |
| validatedBy | UUID | × | 検証者ID |
| validatedDate | DATE | × | 検証日 |
| notes | TEXT | × | 備考 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- 同一メンバー・スキルの組み合わせは一意
- 認定有効期限切れ前にアラート
- Expert認定には上位者の検証必要

#### Team（チーム）<<entity>><<aggregate root>>
**概要**: 特定の目的のために編成されたメンバーグループの集約ルート
**識別性**: teamIdによって一意に識別される
**ライフサイクル**: 編成→稼働→成果→解散
**集約所属**: TeamAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| code | STRING_20 | ○ | チームコード |
| name | STRING_100 | ○ | チーム名 |
| description | TEXT | × | 説明 |
| type | ENUM | ○ | タイプ（Project/Department/Virtual/Temporary） |
| leaderId | UUID | ○ | リーダーID |
| parentTeamId | UUID | × | 親チームID |
| purpose | TEXT | ○ | 目的 |
| startDate | DATE | ○ | 開始日 |
| endDate | DATE | × | 終了日 |
| status | ENUM | ○ | ステータス（Forming/Active/OnHold/Disbanded） |
| maxSize | INTEGER | × | 最大人数 |
| currentSize | INTEGER | ○ | 現在人数 |
| requiredSkills | JSON | × | 必要スキルリスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### TeamMember（チームメンバー）<<entity>>
**概要**: チームへのメンバー配属情報エンティティ
**識別性**: teamMemberIdによって一意に識別される
**ライフサイクル**: 参加→活動→貢献→離脱
**集約所属**: TeamAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| teamId | UUID | ○ | チームID |
| memberId | UUID | ○ | メンバーID |
| role | ENUM | ○ | 役割（Leader/CoreMember/SupportMember/Advisor） |
| allocationRate | PERCENTAGE | ○ | アサイン率 |
| startDate | DATE | ○ | 参加開始日 |
| endDate | DATE | × | 参加終了日 |
| responsibilities | TEXT | × | 責任範囲 |
| isActive | BOOLEAN | ○ | アクティブフラグ |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Assignment（アサインメント）<<entity>><<aggregate root>>
**概要**: プロジェクトやタスクへのメンバー割り当ての集約ルート
**識別性**: assignmentIdによって一意に識別される
**ライフサイクル**: 計画→承認→稼働→評価→完了
**集約所属**: AssignmentAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| memberId | UUID | ○ | メンバーID |
| projectId | UUID | ○ | プロジェクトID |
| taskId | UUID | × | タスクID |
| role | STRING_100 | ○ | プロジェクト内役割 |
| allocationRate | PERCENTAGE | ○ | アサイン率 |
| startDate | DATE | ○ | 開始日 |
| endDate | DATE | ○ | 終了予定日 |
| actualEndDate | DATE | × | 実際の終了日 |
| billable | BOOLEAN | ○ | 課金対象フラグ |
| status | ENUM | ○ | ステータス（Planned/Active/OnHold/Completed） |
| requestedBy | UUID | ○ | 依頼者ID |
| approvedBy | UUID | × | 承認者ID |
| approvedDate | DATE | × | 承認日 |
| notes | TEXT | × | 備考 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- メンバーの合計アサイン率は100%を超えない
- プロジェクト期間外のアサインは不可
- 承認なしでActiveステータスに変更不可

#### SkillDevelopment（スキル開発）<<entity>><<aggregate root>>
**概要**: メンバーのスキル開発計画と進捗の集約ルート
**識別性**: skillDevelopmentIdによって一意に識別される
**ライフサイクル**: 計画→実行→進捗管理→完了→評価
**集約所属**: SkillDevelopmentAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| memberId | UUID | ○ | メンバーID |
| skillId | UUID | ○ | 対象スキル |
| currentLevel | ENUM | ○ | 現在レベル |
| targetLevel | ENUM | ○ | 目標レベル |
| developmentPlan | TEXT | ○ | 開発計画 |
| activities | JSON | × | 学習活動リスト |
| startDate | DATE | ○ | 開始日 |
| targetDate | DATE | ○ | 目標達成予定日 |
| actualCompletionDate | DATE | × | 実際の達成日 |
| status | ENUM | ○ | ステータス（Planning/InProgress/Completed/Cancelled） |
| progress | PERCENTAGE | ○ | 進捗率 |
| mentorId | UUID | × | メンターID |
| budget | DECIMAL | × | 予算 |
| actualCost | DECIMAL | × | 実際のコスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Performance（パフォーマンス）<<entity>><<aggregate root>>
**概要**: メンバーのパフォーマンス評価記録の集約ルート
**識別性**: performanceIdによって一意に識別される
**ライフサイクル**: 計画→実施→レビュー→確定→フィードバック
**集約所属**: PerformanceAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| memberId | UUID | ○ | メンバーID |
| evaluationPeriod | STRING_20 | ○ | 評価期間（例：2024Q1） |
| evaluatorId | UUID | ○ | 評価者ID |
| overallRating | ENUM | ○ | 総合評価（Outstanding/Exceeds/Meets/NeedsImprovement） |
| projectPerformance | DECIMAL | ○ | プロジェクト成果（1-5） |
| skillGrowth | DECIMAL | ○ | スキル成長（1-5） |
| teamContribution | DECIMAL | ○ | チーム貢献（1-5） |
| clientSatisfaction | DECIMAL | × | 顧客満足度（1-5） |
| strengths | TEXT | × | 強み |
| areasForImprovement | TEXT | × | 改善点 |
| goals | JSON | × | 目標リスト |
| achievements | JSON | × | 達成事項リスト |
| evaluationDate | DATE | ○ | 評価日 |
| nextReviewDate | DATE | × | 次回評価日 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### 値オブジェクト定義

#### ProficiencyLevel（習熟度レベル）<<value object>>
**概要**: スキルの習熟度を表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| level | ENUM | ○ | レベル値 |
| description | TEXT | ○ | レベル説明 |
| minExperience | DECIMAL | ○ | 最小必要経験年数 |
| typicalTasks | JSON | ○ | 典型的なタスク |

#### AllocationStatus（アサイン状況）<<value object>>
**概要**: メンバーの現在のアサイン状況を表現する不変値オブジェクト
**不変性**: 一度作成されたら変更不可
**等価性**: すべての属性値が同じ場合に等しい
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| totalAllocation | PERCENTAGE | ○ | 合計アサイン率 |
| billableAllocation | PERCENTAGE | ○ | 課金対象率 |
| availableCapacity | PERCENTAGE | ○ | 利用可能容量 |
| isOverallocated | BOOLEAN | ○ | 過剰配分フラグ |

### 集約定義

#### MemberAggregate（メンバー集約）<<aggregate>>
**集約ルート**: Member（メンバー）
**集約境界**: Member（メンバー）、MemberSkill（メンバースキル）

**包含エンティティ**:
- Member（集約ルート・1対1）
- MemberSkill（1対多・メンバーの保有スキル）

**不変条件**:
- メンバーの総アサイン率は100%を超えない
- スキルレベルの降格には承認が必要
- Expertレベル認定には第三者検証が必須
- 同一スキルの重複登録は不可

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）
- Skill集約とはskillIdのみで参照（IDのみ参照）
- Team集約とはteamIdのみで参照（IDのみ参照）

**責務**:
- メンバー情報の一貫性保証
- スキル情報の正確性維持
- アサイン率の整合性確保

#### SkillAggregate（スキル集約）<<aggregate>>
**集約ルート**: Skill（スキル）
**集約境界**: Skill（スキル）

**包含エンティティ**:
- Skill（集約ルート・1対1）

**不変条件**:
- スキル名は組織内で一意
- 親スキルが存在する場合は循環参照を禁止
- 廃止済みスキルは新規メンバーに紐付け不可

**他集約との関係**:
- MemberSkill経由でMember集約と関連（疎結合）

**責務**:
- スキル体系の一貫性保証
- スキル階層構造の維持
- スキル評価基準の管理

#### TeamAggregate（チーム集約）<<aggregate>>
**集約ルート**: Team（チーム）
**集約境界**: Team（チーム）、TeamMember（チームメンバー）

**包含エンティティ**:
- Team（集約ルート・1対1）
- TeamMember（1対多・チーム参画メンバー）

**不変条件**:
- チームメンバー数は最大人数を超えない
- リーダーは必ずチームメンバーとして存在する
- 解散済みチームへの新規メンバー追加は不可
- アクティブメンバーの総アサイン率合計がチーム要求を満たす

**他集約との関係**:
- Member集約とはmemberIdのみで参照（IDのみ参照）
- Project集約とはprojectIdのみで参照（IDのみ参照）

**責務**:
- チーム構成の一貫性保証
- メンバー配置の最適性維持
- 必要スキルセットの充足確保

#### AssignmentAggregate（アサインメント集約）<<aggregate>>
**集約ルート**: Assignment（アサインメント）
**集約境界**: Assignment（アサインメント）

**包含エンティティ**:
- Assignment（集約ルート・1対1）

**不変条件**:
- 同一メンバーの総アサイン率は100%を超えない
- プロジェクト期間外のアサインは不可
- 承認なしでActiveステータスへの遷移は不可
- 80%以上のアサインには上位承認が必要

**他集約との関係**:
- Member集約とはmemberIdのみで参照（IDのみ参照）
- Project集約とはprojectIdのみで参照（IDのみ参照）

**責務**:
- リソース配分の一貫性保証
- アサイン率の整合性維持
- 承認フローの適切な実行

#### SkillDevelopmentAggregate（スキル開発集約）<<aggregate>>
**集約ルート**: SkillDevelopment（スキル開発）
**集約境界**: SkillDevelopment（スキル開発）

**包含エンティティ**:
- SkillDevelopment（集約ルート・1対1）

**不変条件**:
- 現在レベルより低い目標レベルは設定不可
- 開始日は目標達成日より前
- 実際のコストは予算を大幅に超えない（120%以内）
- 進捗率は0-100%の範囲内

**他集約との関係**:
- Member集約とはmemberIdのみで参照（IDのみ参照）
- Skill集約とはskillIdのみで参照（IDのみ参照）

**責務**:
- スキル開発計画の一貫性保証
- 進捗の正確な追跡
- 予算の適切な管理

#### PerformanceAggregate（パフォーマンス集約）<<aggregate>>
**集約ルート**: Performance（パフォーマンス）
**集約境界**: Performance（パフォーマンス）

**包含エンティティ**:
- Performance（集約ルート・1対1）

**不変条件**:
- 同一メンバー・同一期間の評価は1つのみ
- 評価者は被評価者と異なる
- すべての評価項目は1-5の範囲内
- NeedsImprovement評価には改善計画が必須

**他集約との関係**:
- Member集約とはmemberIdのみで参照（IDのみ参照）
- User集約とはevaluatorIdのみで参照（IDのみ参照）

**責務**:
- 評価の一貫性と公平性保証
- 評価データの正確性維持
- フィードバックプロセスの適切な実行

### ドメインサービス

#### ResourceOptimizationService<<service>>
**概要**: 複数のメンバーとプロジェクトに跨るリソース最適配置の計算
**責務**: リソース配分の最適化、稼働率の平準化、制約条件の充足
**ステレオタイプ**: service

**操作**:
```typescript
interface ResourceOptimizationService {
  // 要件に最適なメンバーを検索
  findBestMatch(
    projectRequirements: ProjectRequirements,
    constraints: AllocationConstraints
  ): Promise<MemberMatch[]>

  // プロジェクトへの最適配置計算
  optimizeAllocation(
    projectId: UUID,
    requiredSkills: SkillRequirement[],
    period: DateRange
  ): Promise<OptimizationResult>

  // ワークロードバランス提案
  balanceWorkload(
    teamId: UUID,
    targetUtilization: PERCENTAGE
  ): Promise<BalanceSuggestion[]>

  // 利用可能リソース予測
  predictAvailability(
    period: DateRange,
    requiredSkills?: SkillRequirement[]
  ): Promise<AvailabilityForecast>
}
```

#### SkillMatchingService<<service>>
**概要**: スキル要件と保有スキルのマッチング分析
**責務**: スキルギャップ分析、スキルマッチ度計算、育成計画提案
**ステレオタイプ**: service

**操作**:
```typescript
interface SkillMatchingService {
  // スキルマッチ度計算
  matchSkills(
    requiredSkills: SkillRequirement[],
    memberSkills: MemberSkill[]
  ): Promise<MatchScore>

  // スキルギャップ分析
  identifySkillGaps(
    teamId: UUID,
    requiredSkills: SkillRequirement[]
  ): Promise<SkillGap[]>

  // 研修推奨
  recommendTraining(
    memberId: UUID,
    targetSkills: SkillRequirement[]
  ): Promise<TrainingRecommendation[]>

  // メンター候補検索
  findMentors(
    skillId: UUID,
    minProficiencyLevel: ProficiencyLevel
  ): Promise<Member[]>
}
```

#### TeamFormationService<<service>>
**概要**: チーム編成の最適化とバランス評価
**責務**: チーム構成提案、役割分担最適化、チーム成果予測
**ステレオタイプ**: service

**操作**:
```typescript
interface TeamFormationService {
  // チーム編成提案
  formTeam(
    requirements: TeamRequirements,
    constraints: TeamConstraints
  ): Promise<TeamProposal>

  // チームバランス評価
  assessTeamBalance(
    teamId: UUID,
    criteria: BalanceCriteria
  ): Promise<BalanceAssessment>

  // 役割分担提案
  suggestRoleAssignment(
    teamId: UUID,
    projectRequirements: ProjectRequirements
  ): Promise<RoleAssignment[]>

  // チーム成果予測
  predictTeamPerformance(
    teamId: UUID,
    projectComplexity: ComplexityScore
  ): Promise<PerformancePrediction>
}
```

### ドメインイベント

#### MemberOnboarded<<event>>
**概要**: 新規メンバーのオンボーディング完了を通知
**発生条件**: 新規メンバーが入社し、システムに登録された時
**影響**: 他サービスへ新メンバー情報を通知し、必要な初期設定を促す
**ステレオタイプ**: event

**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "aggregateId": "UUID",
  "aggregateType": "Member",
  "eventType": "MemberOnboarded",
  "data": {
    "memberId": "UUID",
    "employeeCode": "STRING",
    "name": "STRING",
    "department": "STRING",
    "position": "STRING",
    "joinDate": "DATE"
  }
}
```

#### SkillAcquired<<event>>
**概要**: メンバーの新規スキル習得を通知
**発生条件**: メンバーが新しいスキルを習得し、検証が完了した時
**影響**: スキルマッチングサービス、リソース最適化サービスへの通知
**ステレオタイプ**: event

**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "aggregateId": "UUID",
  "aggregateType": "Member",
  "eventType": "SkillAcquired",
  "data": {
    "memberId": "UUID",
    "skillId": "UUID",
    "proficiencyLevel": "ENUM",
    "validatedBy": "UUID",
    "validatedDate": "DATE"
  }
}
```

#### TeamFormed<<event>>
**概要**: 新規チーム編成の完了を通知
**発生条件**: 新しいチームが編成され、メンバーが配置された時
**影響**: プロジェクトサービス、コラボレーションサービスへの通知
**ステレオタイプ**: event

**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "aggregateId": "UUID",
  "aggregateType": "Team",
  "eventType": "TeamFormed",
  "data": {
    "teamId": "UUID",
    "teamName": "STRING",
    "leaderId": "UUID",
    "memberIds": ["UUID"],
    "purpose": "STRING",
    "requiredSkills": ["SkillRequirement"]
  }
}
```

#### AssignmentCreated<<event>>
**概要**: 新規アサインメントの作成を通知
**発生条件**: 新しいアサインメントが承認され、確定した時
**影響**: プロジェクトサービス、生産性可視化サービスへの通知
**ステレオタイプ**: event

**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "aggregateId": "UUID",
  "aggregateType": "Assignment",
  "eventType": "AssignmentCreated",
  "data": {
    "assignmentId": "UUID",
    "memberId": "UUID",
    "projectId": "UUID",
    "allocationRate": "PERCENTAGE",
    "startDate": "DATE",
    "endDate": "DATE",
    "billable": "BOOLEAN"
  }
}
```

#### PerformanceEvaluated<<event>>
**概要**: パフォーマンス評価の完了を通知
**発生条件**: パフォーマンス評価が完了し、確定した時
**影響**: ナレッジ共創サービス、スキル開発計画への反映
**ステレオタイプ**: event

**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "aggregateId": "UUID",
  "aggregateType": "Performance",
  "eventType": "PerformanceEvaluated",
  "data": {
    "performanceId": "UUID",
    "memberId": "UUID",
    "evaluationPeriod": "STRING",
    "overallRating": "ENUM",
    "evaluatorId": "UUID",
    "evaluationDate": "DATE"
  }
}
```

### リポジトリインターフェース

#### MemberRepository<<repository>>
**概要**: Member集約の永続化を担当するリポジトリ
**責務**: メンバー情報の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface MemberRepository {
  // 基本操作
  findById(id: UUID): Promise<Member | null>
  findByEmployeeCode(code: STRING): Promise<Member | null>
  findAll(limit?: number, offset?: number): Promise<Member[]>
  save(member: Member): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findBySkills(
    skillIds: UUID[],
    minProficiency?: ProficiencyLevel
  ): Promise<Member[]>

  findAvailable(
    date: DATE,
    minRate: PERCENTAGE
  ): Promise<Member[]>

  findByDepartment(department: STRING): Promise<Member[]>

  findOverallocated(): Promise<Member[]>

  // 集約全体の保存（MemberとMemberSkillを含む）
  saveWithSkills(
    member: Member,
    skills: MemberSkill[]
  ): Promise<void>
}
```

#### SkillRepository<<repository>>
**概要**: Skill集約の永続化を担当するリポジトリ
**責務**: スキル情報の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface SkillRepository {
  // 基本操作
  findById(id: UUID): Promise<Skill | null>
  findByName(name: STRING): Promise<Skill | null>
  findAll(includeInactive?: boolean): Promise<Skill[]>
  save(skill: Skill): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByCategory(category: SkillCategory): Promise<Skill[]>
  findByParentSkill(parentSkillId: UUID): Promise<Skill[]>
  findRequiredForRole(role: STRING): Promise<Skill[]>
  findRelatedSkills(skillId: UUID): Promise<Skill[]>
}
```

#### TeamRepository<<repository>>
**概要**: Team集約の永続化を担当するリポジトリ
**責務**: チーム情報の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface TeamRepository {
  // 基本操作
  findById(id: UUID): Promise<Team | null>
  findByCode(code: STRING): Promise<Team | null>
  findAll(limit?: number, offset?: number): Promise<Team[]>
  save(team: Team): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByLeader(leaderId: UUID): Promise<Team[]>
  findActive(): Promise<Team[]>
  findByType(type: TeamType): Promise<Team[]>
  findByMember(memberId: UUID): Promise<Team[]>

  // 集約全体の保存（TeamとTeamMemberを含む）
  saveWithMembers(
    team: Team,
    members: TeamMember[]
  ): Promise<void>
}
```

#### AssignmentRepository<<repository>>
**概要**: Assignment集約の永続化を担当するリポジトリ
**責務**: アサインメント情報の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface AssignmentRepository {
  // 基本操作
  findById(id: UUID): Promise<Assignment | null>
  findAll(limit?: number, offset?: number): Promise<Assignment[]>
  save(assignment: Assignment): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByMemberId(memberId: UUID): Promise<Assignment[]>
  findByProjectId(projectId: UUID): Promise<Assignment[]>

  findConflicts(
    memberId: UUID,
    period: DateRange
  ): Promise<Assignment[]>

  findByStatus(status: AssignmentStatus): Promise<Assignment[]>

  findPendingApproval(): Promise<Assignment[]>

  // 集約計算
  calculateTotalAllocation(
    memberId: UUID,
    period: DateRange
  ): Promise<PERCENTAGE>
}
```

#### SkillDevelopmentRepository<<repository>>
**概要**: SkillDevelopment集約の永続化を担当するリポジトリ
**責務**: スキル開発計画の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface SkillDevelopmentRepository {
  // 基本操作
  findById(id: UUID): Promise<SkillDevelopment | null>
  findAll(limit?: number, offset?: number): Promise<SkillDevelopment[]>
  save(development: SkillDevelopment): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByMemberId(memberId: UUID): Promise<SkillDevelopment[]>
  findBySkillId(skillId: UUID): Promise<SkillDevelopment[]>
  findByStatus(status: DevelopmentStatus): Promise<SkillDevelopment[]>
  findOverdue(): Promise<SkillDevelopment[]>
  findByMentor(mentorId: UUID): Promise<SkillDevelopment[]>
}
```

#### PerformanceRepository<<repository>>
**概要**: Performance集約の永続化を担当するリポジトリ
**責務**: パフォーマンス評価の保存、検索、更新、削除
**ステレオタイプ**: repository

```typescript
interface PerformanceRepository {
  // 基本操作
  findById(id: UUID): Promise<Performance | null>
  findAll(limit?: number, offset?: number): Promise<Performance[]>
  save(performance: Performance): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByMemberId(memberId: UUID): Promise<Performance[]>
  findByEvaluator(evaluatorId: UUID): Promise<Performance[]>

  findByPeriod(
    evaluationPeriod: STRING
  ): Promise<Performance[]>

  findByRating(
    rating: PerformanceRating
  ): Promise<Performance[]>

  findLatestForMember(
    memberId: UUID
  ): Promise<Performance | null>
}
```

## ビジネスルール

### リソース管理ルール
1. **アサイン上限**: 個人の合計アサイン率は100%まで
2. **最小アサイン**: プロジェクトアサインは最低20%
3. **スキルマッチ**: 必須スキルを持たないメンバーはアサイン不可
4. **承認プロセス**: 80%以上のアサインは上位承認必要

### スキル管理ルール
1. **習熟度認定**: Advancedレベル以上は第三者検証必要
2. **有効期限管理**: 認定資格は期限切れ前に更新通知
3. **スキル継承**: 退職者のスキルナレッジを文書化

### チーム管理ルール
1. **チームサイズ**: 最小3名、最大15名
2. **スキルバランス**: 必要スキルの70%以上をカバー
3. **リーダーシップ**: リーダー不在時の代行者必須

### パフォーマンス管理ルール
1. **評価頻度**: 四半期ごとに実施
2. **360度評価**: 上司・同僚・部下からの多面評価
3. **改善計画**: NeedsImprovement評価は改善計画必須

## サービス間連携

### 依存サービス
- **セキュアアクセスサービス**: ユーザー情報、認証
- **プロジェクト成功支援サービス**: プロジェクト情報、タスク情報

### 提供インターフェース
- **メンバー情報API**: スキル、稼働状況を提供
- **チーム情報API**: チーム構成、パフォーマンスを提供
- **アサインメントAPI**: リソース配置情報を提供

### イベント連携
- **MemberOnboarded**: 各サービスへ新メンバー通知
- **AssignmentCreated**: プロジェクトサービスへ通知
- **SkillAcquired**: ナレッジサービスへ共有