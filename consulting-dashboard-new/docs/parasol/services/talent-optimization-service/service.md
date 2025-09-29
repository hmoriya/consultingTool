# タレント最適化サービス

## サービス概要
**名前**: talent-optimization-service
**表示名**: タレント最適化サービス
**説明**: チームメンバーの能力を最大化し、最適な配置を実現

## ビジネス価値
- **効率化**: 業務プロセスの自動化と最適化
- **品質向上**: サービス品質の継続的改善
- **リスク低減**: 潜在的リスクの早期発見と対処

## ドメイン言語

## パラソルドメイン概要
組織の人材（タレント）を最適に配置し、スキル開発を促進し、チームの生産性を最大化するためのドメインモデル。メンバー、スキル、チーム、アサインメント、パフォーマンスの関係を定義。

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

#### Member（メンバー）
**概要**: 組織に所属する個人の人材情報
**識別子**: memberId

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

#### Skill（スキル）
**概要**: 業務遂行に必要な技能や知識
**識別子**: skillId

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

#### MemberSkill（メンバースキル）
**概要**: メンバーが保有するスキルと習熟度
**識別子**: memberSkillId

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

#### Team（チーム）
**概要**: 特定の目的のために編成されたメンバーグループ
**識別子**: teamId

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

#### TeamMember（チームメンバー）
**概要**: チームへのメンバー配属情報
**識別子**: teamMemberId

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

#### Assignment（アサインメント）
**概要**: プロジェクトやタスクへのメンバー割り当て
**識別子**: assignmentId

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

#### SkillDevelopment（スキル開発）
**概要**: メンバーのスキル開発計画と進捗
**識別子**: skillDevelopmentId

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

#### Performance（パフォーマンス）
**概要**: メンバーのパフォーマンス評価記録
**識別子**: performanceId

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

#### ProficiencyLevel（習熟度レベル）
**概要**: スキルの習熟度を表現

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| level | ENUM | ○ | レベル値 |
| description | TEXT | ○ | レベル説明 |
| minExperience | DECIMAL | ○ | 最小必要経験年数 |
| typicalTasks | JSON | ○ | 典型的なタスク |

#### AllocationStatus（アサイン状況）
**概要**: メンバーの現在のアサイン状況

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| totalAllocation | PERCENTAGE | ○ | 合計アサイン率 |
| billableAllocation | PERCENTAGE | ○ | 課金対象率 |
| availableCapacity | PERCENTAGE | ○ | 利用可能容量 |
| isOverallocated | BOOLEAN | ○ | 過剰配分フラグ |

### 集約定義

#### MemberAggregate
**集約ルート**: Member
**境界**: Member, MemberSkill, Assignment, Performance

**不変条件**:
- メンバーの総アサイン率は100%を超えない
- スキルレベルの降格には承認が必要
- パフォーマンス評価は期間内に1つのみ

#### TeamAggregate
**集約ルート**: Team
**境界**: Team, TeamMember

**不変条件**:
- チームメンバー数は最大人数を超えない
- リーダーは必ずチームメンバーである
- 解散済みチームへの新規メンバー追加は不可

### ドメインサービス

#### ResourceOptimizationService
**概要**: リソースの最適配置を計算
**操作**:
- `findBestMatch(projectRequirements) -> Member[]`: 要件に最適なメンバーを検索
- `optimizeAllocation(projectId) -> Assignment[]`: プロジェクトへの最適配置
- `balanceWorkload(teamId) -> Suggestion[]`: ワークロードバランス提案
- `predictAvailability(period) -> Forecast`: 利用可能リソース予測

#### SkillMatchingService
**概要**: スキルマッチングと分析
**操作**:
- `matchSkills(required, available) -> MatchScore`: スキルマッチ度計算
- `identifySkillGaps(teamId) -> SkillGap[]`: スキルギャップ分析
- `recommendTraining(memberId) -> Training[]`: 研修推奨
- `findMentors(skillId) -> Member[]`: メンター候補検索

#### TeamFormationService
**概要**: チーム編成の最適化
**操作**:
- `formTeam(requirements) -> Team`: チーム編成提案
- `assessTeamBalance(teamId) -> Balance`: チームバランス評価
- `suggestRoleAssignment(teamId) -> RoleAssignment[]`: 役割分担提案
- `predictTeamPerformance(teamId) -> Score`: チーム成果予測

### ドメインイベント

#### MemberOnboarded
**発生条件**: 新規メンバーが入社した時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "memberId": "UUID",
  "employeeCode": "STRING",
  "name": "STRING",
  "department": "STRING",
  "position": "STRING",
  "joinDate": "DATE"
}
```

#### SkillAcquired
**発生条件**: メンバーが新しいスキルを習得した時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "memberId": "UUID",
  "skillId": "UUID",
  "proficiencyLevel": "ENUM",
  "validatedBy": "UUID"
}
```

#### TeamFormed
**発生条件**: 新しいチームが編成された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "teamId": "UUID",
  "teamName": "STRING",
  "leaderId": "UUID",
  "memberIds": ["UUID"],
  "purpose": "STRING"
}
```

#### AssignmentCreated
**発生条件**: 新しいアサインメントが作成された時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "assignmentId": "UUID",
  "memberId": "UUID",
  "projectId": "UUID",
  "allocationRate": "PERCENTAGE",
  "startDate": "DATE",
  "endDate": "DATE"
}
```

#### PerformanceEvaluated
**発生条件**: パフォーマンス評価が完了した時
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "performanceId": "UUID",
  "memberId": "UUID",
  "evaluationPeriod": "STRING",
  "overallRating": "ENUM",
  "evaluatorId": "UUID"
}
```

### リポジトリインターフェース

#### MemberRepository
```
interface MemberRepository {
  findById(id: UUID): Member | null
  findByEmployeeCode(code: STRING): Member | null
  findBySkills(skillIds: UUID[]): Member[]
  findAvailable(date: DATE, minRate: PERCENTAGE): Member[]
  save(member: Member): void
  delete(id: UUID): void
}
```

#### TeamRepository
```
interface TeamRepository {
  findById(id: UUID): Team | null
  findByCode(code: STRING): Team | null
  findByLeader(leaderId: UUID): Team[]
  findActive(): Team[]
  save(team: Team): void
  delete(id: UUID): void
}
```

#### AssignmentRepository
```
interface AssignmentRepository {
  findById(id: UUID): Assignment | null
  findByMemberId(memberId: UUID): Assignment[]
  findByProjectId(projectId: UUID): Assignment[]
  findConflicts(memberId: UUID, period: DateRange): Assignment[]
  save(assignment: Assignment): void
  delete(id: UUID): void
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

## API仕様概要
- RESTful API設計
- JWT認証
- Rate Limiting実装
- OpenAPI仕様準拠

## データベース設計概要
- PostgreSQL/SQLite対応
- マイクロサービス対応
- 監査ログテーブル
- パフォーマンス最適化

## 提供ケーパビリティ
- チームの生産性を最大化する能力
