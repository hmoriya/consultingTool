# BC-005: ドメイン層設計

**BC**: Team & Resource Optimization [チームとリソースの最適化] [BC_005]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/talent-optimization-service/domain-language.md + services/productivity-visualization-service/domain-language.md

---

## 目次

1. [概要](#overview)
2. [主要集約](#aggregates)
3. [エンティティ](#entities)
4. [値オブジェクト](#value-objects)
5. [ドメインイベント](#domain-events)
6. [ドメインサービス](#domain-services)
7. [ユースケース例](#use-cases)
8. [BC間連携](#bc-integration)

---

## 概要 {#overview}

BC-005は、コンサルティングファームにおけるリソース配分最適化、チーム編成、タレント育成、スキル開発を担当します。

### ビジネス価値

- **リソース最適化**: プロジェクトへのリソース配分を最適化し、稼働率を最大化
- **チーム編成**: スキルバランスとパフォーマンスを考慮した最適なチーム編成
- **タレント育成**: メンバーのキャリア開発とパフォーマンス向上支援
- **スキル開発**: 組織全体のスキルマトリックス管理とギャップ分析

### ドメインの範囲

**含まれる機能**:
- リソース配分計画と実績管理
- タイムシート記録と承認
- チーム編成とパフォーマンス監視
- タレント評価とキャリア開発
- スキル定義とレベル管理
- 稼働率分析とリソース需要予測

**含まれない機能**:
- プロジェクト管理（BC-001が担当）
- 組織構造管理（BC-004が担当）
- 学習コンテンツ管理（BC-006が担当）

---

## 主要集約 {#aggregates}

### 1. Resource Aggregate [リソース集約]

**集約ルート**: Resource [Resource] [RESOURCE]

**責務**: リソースのライフサイクル、配分、稼働管理

**包含エンティティ**:
- Resource（ルート）
- ResourceAllocation（リソース配分）
- ResourceAvailability（稼働可能性）
- Timesheet（タイムシート）
- TimesheetEntry（タイムシート明細）

**不変条件**:
1. リソース配分の合計は200%以下（兼務考慮）
2. タイムシートの合計時間は1日24時間以下
3. 承認済みタイムシートは変更不可
4. リソースの稼働率は0-100%の範囲

**主要ビジネスルール**:
```typescript
class Resource {
  private allocations: ResourceAllocation[];
  private timesheets: Timesheet[];

  // リソース配分追加
  allocateToProject(
    projectId: ProjectId,
    allocationPercentage: Percentage,
    startDate: Date,
    endDate: Date
  ): ResourceAllocation {
    // ビジネスルール: 配分率の合計チェック
    const totalAllocation = this.calculateTotalAllocation(startDate, endDate);
    if (totalAllocation + allocationPercentage > 2.0) {
      throw new ExceedAllocationLimitError(
        `Total allocation exceeds 200%: ${(totalAllocation + allocationPercentage) * 100}%`
      );
    }

    const allocation = new ResourceAllocation(
      projectId,
      allocationPercentage,
      startDate,
      endDate
    );

    this.allocations.push(allocation);
    this.emitEvent(new ResourceAllocatedEvent(this.id, projectId, allocation));
    return allocation;
  }

  // 稼働率計算
  calculateUtilizationRate(period: Period): Percentage {
    const totalWorkHours = this.getTotalWorkHours(period);
    const standardWorkHours = period.getStandardWorkHours();
    return totalWorkHours / standardWorkHours;
  }

  // タイムシート提出
  submitTimesheet(timesheet: Timesheet): void {
    if (!timesheet.isValid()) {
      throw new InvalidTimesheetError('Timesheet validation failed');
    }

    timesheet.submit();
    this.emitEvent(new TimesheetSubmittedEvent(this.id, timesheet.id));
  }
}
```

---

### 2. Team Aggregate [チーム集約]

**集約ルート**: Team [Team] [TEAM]

**責務**: チームの編成、構成最適化、パフォーマンス管理

**包含エンティティ**:
- Team（ルート）
- TeamMember（チームメンバー）
- TeamSkillProfile（チームスキルプロファイル）
- TeamPerformanceMetrics（チームパフォーマンス指標）

**不変条件**:
1. チームは最低1名のリーダーを持つ
2. メンバーの配分率合計は妥当な範囲内（プロジェクト要件を満たす）
3. チームの総スキルレベルは最小要件を満たす

**主要ビジネスルール**:
```typescript
class Team {
  private members: TeamMember[];
  private skillProfile: TeamSkillProfile;
  private performanceMetrics: TeamPerformanceMetrics;

  // メンバー追加
  addMember(
    resourceId: ResourceId,
    role: TeamRole,
    allocationPercentage: Percentage
  ): TeamMember {
    // ビジネスルール: リーダーが存在しない場合は最初のメンバーをリーダーに
    if (this.members.length === 0 && role !== TeamRole.LEADER) {
      throw new TeamRequiresLeaderError('Team must have at least one leader');
    }

    const member = new TeamMember(resourceId, role, allocationPercentage);
    this.members.push(member);

    // チームスキルプロファイル更新
    this.skillProfile.updateWithMember(member);

    this.emitEvent(new TeamMemberAddedEvent(this.id, member));
    return member;
  }

  // チームパフォーマンス計算
  calculatePerformanceScore(): PerformanceScore {
    // 各メンバーのパフォーマンス、スキル適合度、稼働率を総合評価
    const metrics = {
      avgSkillMatch: this.skillProfile.calculateSkillMatch(),
      avgUtilization: this.calculateAvgUtilization(),
      deliveryQuality: this.performanceMetrics.deliveryQuality,
      teamSynergy: this.performanceMetrics.teamSynergy
    };

    return PerformanceScore.calculate(metrics);
  }

  // 最後のリーダー削除阻止
  removeMember(memberId: MemberId): void {
    const member = this.findMember(memberId);

    if (member.isLeader() && this.getLeaderCount() === 1) {
      throw new CannotRemoveLastLeaderError('Cannot remove the last leader');
    }

    this.members = this.members.filter(m => m.id !== memberId);
    this.emitEvent(new TeamMemberRemovedEvent(this.id, memberId));
  }
}
```

---

### 3. Talent Aggregate [タレント集約]

**集約ルート**: Talent [Talent] [TALENT]

**責務**: タレントの育成、パフォーマンス評価、キャリア開発

**包含エンティティ**:
- Talent（ルート）
- PerformanceRecord（パフォーマンス記録）
- CareerPlan（キャリア計画）
- DevelopmentGoal（育成目標）
- Feedback（フィードバック）

**不変条件**:
1. パフォーマンス評価は承認者によって承認された場合のみ確定
2. キャリア計画は年度ごとに1つ
3. 育成目標は測定可能（SMART原則）

**主要ビジネスルール**:
```typescript
class Talent {
  private performanceRecords: PerformanceRecord[];
  private careerPlans: CareerPlan[];
  private developmentGoals: DevelopmentGoal[];

  // パフォーマンス評価記録
  recordPerformance(
    evaluationPeriod: Period,
    rating: PerformanceRating,
    evaluatorId: UserId,
    feedback: string
  ): PerformanceRecord {
    // ビジネスルール: 同一期間の評価は1つのみ
    if (this.hasPerformanceRecord(evaluationPeriod)) {
      throw new DuplicatePerformanceRecordError(
        `Performance record already exists for period: ${evaluationPeriod}`
      );
    }

    const record = new PerformanceRecord(
      evaluationPeriod,
      rating,
      evaluatorId,
      feedback,
      PerformanceStatus.DRAFT
    );

    this.performanceRecords.push(record);
    this.emitEvent(new PerformanceRecordedEvent(this.id, record));
    return record;
  }

  // パフォーマンス評価承認
  approvePerformance(
    recordId: RecordId,
    approverId: UserId
  ): void {
    const record = this.findPerformanceRecord(recordId);

    if (record.status !== PerformanceStatus.DRAFT) {
      throw new InvalidPerformanceStatusError(
        'Only draft performance records can be approved'
      );
    }

    record.approve(approverId);
    this.emitEvent(new PerformanceApprovedEvent(this.id, recordId, approverId));
  }

  // キャリア計画作成
  createCareerPlan(
    fiscalYear: FiscalYear,
    targetRole: Role,
    developmentGoals: DevelopmentGoal[]
  ): CareerPlan {
    // ビジネスルール: 年度ごとに1つのキャリア計画
    if (this.hasCareerPlan(fiscalYear)) {
      throw new DuplicateCareerPlanError(
        `Career plan already exists for FY${fiscalYear}`
      );
    }

    const plan = new CareerPlan(fiscalYear, targetRole, developmentGoals);
    this.careerPlans.push(plan);
    this.emitEvent(new CareerPlanCreatedEvent(this.id, plan));
    return plan;
  }
}
```

---

### 4. Skill Aggregate [スキル集約]

**集約ルート**: Skill [Skill] [SKILL]

**責務**: スキルの定義、レベル管理、スキルマトリックス

**包含エンティティ**:
- Skill（ルート）
- SkillCategory（スキルカテゴリ）
- SkillLevel（スキルレベル）
- SkillMatrix（スキルマトリックス）
- SkillGap（スキルギャップ）

**不変条件**:
1. スキルレベルは1-5の範囲（初級→マスター）
2. スキルレベルは段階的に向上（レベルスキップ不可）
3. スキル習得には前提スキルが必要な場合がある

**主要ビジネスルール**:
```typescript
class Skill {
  private category: SkillCategory;
  private levels: SkillLevel[];
  private prerequisites: Skill[];

  // スキルレベル定義
  defineLevel(
    level: number,
    levelName: string,
    description: string,
    criteria: string[]
  ): SkillLevel {
    // ビジネスルール: レベルは1-5の範囲
    if (level < 1 || level > 5) {
      throw new InvalidSkillLevelError('Skill level must be between 1 and 5');
    }

    const skillLevel = new SkillLevel(level, levelName, description, criteria);
    this.levels.push(skillLevel);
    return skillLevel;
  }

  // 前提スキルチェック
  checkPrerequisites(talentSkills: Map<SkillId, SkillLevel>): boolean {
    for (const prerequisite of this.prerequisites) {
      const talentLevel = talentSkills.get(prerequisite.id);
      if (!talentLevel || talentLevel.level < prerequisite.minimumLevel) {
        return false;
      }
    }
    return true;
  }
}

class TalentSkill {
  private talent: Talent;
  private skill: Skill;
  private currentLevel: SkillLevel;
  private acquiredDate: Date;

  // スキルレベルアップ
  levelUp(newLevel: number, evidence: string): void {
    // ビジネスルール: 段階的レベルアップのみ
    if (newLevel !== this.currentLevel.level + 1) {
      throw new SkillLevelSkipError(
        `Cannot skip levels: current=${this.currentLevel.level}, new=${newLevel}`
      );
    }

    // ビジネスルール: 最大レベルは5
    if (newLevel > 5) {
      throw new MaxSkillLevelReachedError('Maximum skill level is 5');
    }

    this.currentLevel = this.skill.getLevel(newLevel);
    this.acquiredDate = new Date();

    this.emitEvent(new SkillLevelUpEvent(
      this.talent.id,
      this.skill.id,
      newLevel,
      evidence
    ));
  }
}
```

---

## エンティティ {#entities}

### 主要エンティティ詳細

#### 1. Resource [Resource] [RESOURCE]

リソース [Resource] [RESOURCE]

```
├── id: ResourceId [リソースID] [RESOURCE_ID]
├── userId: UserId [ユーザーID] [USER_ID] (→ BC-003)
├── resourceType: ResourceType [リソースタイプ] [RESOURCE_TYPE]
│   ├── CONSULTANT [コンサルタント]
│   ├── ENGINEER [エンジニア]
│   ├── DESIGNER [デザイナー]
│   ├── PROJECT_MANAGER [プロジェクトマネージャー]
│   └── ANALYST [アナリスト]
├── level: ResourceLevel [レベル] [RESOURCE_LEVEL]
│   ├── JUNIOR [ジュニア]
│   ├── INTERMEDIATE [中級]
│   ├── SENIOR [シニア]
│   ├── PRINCIPAL [プリンシパル]
│   └── PARTNER [パートナー]
├── costRate: Money [コスト単価] [COST_RATE] (時間あたり)
├── status: ResourceStatus [状態] [RESOURCE_STATUS]
│   ├── AVAILABLE [稼働可能]
│   ├── ALLOCATED [配分済み]
│   ├── UNAVAILABLE [稼働不可]
│   └── ON_LEAVE [休暇中]
├── allocations: ResourceAllocation[] [配分リスト]
├── timesheets: Timesheet[] [タイムシートリスト]
├── createdAt: Timestamp [作成日時] [CREATED_AT]
└── updatedAt: Timestamp [更新日時] [UPDATED_AT]
```

**主要メソッド**:
- `allocateToProject()`: プロジェクトへの配分
- `updateAvailability()`: 稼働可能性更新
- `calculateUtilizationRate()`: 稼働率計算
- `submitTimesheet()`: タイムシート提出
- `approveTimesheet()`: タイムシート承認

---

#### 2. Team [Team] [TEAM]

チーム [Team] [TEAM]

```
├── id: TeamId [チームID] [TEAM_ID]
├── name: string [チーム名] [TEAM_NAME]
├── projectId: ProjectId [プロジェクトID] [PROJECT_ID] (→ BC-001)
├── organizationUnitId: UnitId [組織単位ID] [UNIT_ID] (→ BC-004)
├── teamType: TeamType [チームタイプ] [TEAM_TYPE]
│   ├── DELIVERY [デリバリーチーム]
│   ├── SUPPORT [サポートチーム]
│   ├── INNOVATION [イノベーションチーム]
│   └── TRAINING [トレーニングチーム]
├── status: TeamStatus [状態] [TEAM_STATUS]
│   ├── FORMING [編成中]
│   ├── ACTIVE [稼働中]
│   ├── SUSPENDED [一時停止]
│   └── DISBANDED [解散]
├── members: TeamMember[] [メンバーリスト]
├── skillProfile: TeamSkillProfile [スキルプロファイル]
├── performanceScore: PerformanceScore [パフォーマンススコア]
├── createdAt: Timestamp [作成日時] [CREATED_AT]
└── updatedAt: Timestamp [更新日時] [UPDATED_AT]
```

**主要メソッド**:
- `addMember()`: メンバー追加
- `removeMember()`: メンバー削除
- `assignLeader()`: リーダー任命
- `calculatePerformanceScore()`: パフォーマンス計算
- `analyzeSkillBalance()`: スキルバランス分析

---

#### 3. Talent [Talent] [TALENT]

タレント [Talent] [TALENT]

```
├── id: TalentId [タレントID] [TALENT_ID]
├── userId: UserId [ユーザーID] [USER_ID] (→ BC-003)
├── hireDate: Date [入社日] [HIRE_DATE]
├── currentLevel: ResourceLevel [現在のレベル] [CURRENT_LEVEL]
├── performanceRecords: PerformanceRecord[] [パフォーマンス記録]
├── careerPlans: CareerPlan[] [キャリア計画]
├── developmentGoals: DevelopmentGoal[] [育成目標]
├── skills: TalentSkill[] [保有スキル]
├── certifications: Certification[] [資格]
├── createdAt: Timestamp [作成日時] [CREATED_AT]
└── updatedAt: Timestamp [更新日時] [UPDATED_AT]
```

**主要メソッド**:
- `recordPerformance()`: パフォーマンス記録
- `approvePerformance()`: パフォーマンス承認
- `createCareerPlan()`: キャリア計画作成
- `setDevelopmentGoals()`: 育成目標設定
- `acquireSkill()`: スキル習得

---

#### 4. Skill [Skill] [SKILL]

スキル [Skill] [SKILL]

```
├── id: SkillId [スキルID] [SKILL_ID]
├── name: string [スキル名] [SKILL_NAME]
├── category: SkillCategory [カテゴリ] [SKILL_CATEGORY]
│   ├── TECHNICAL [技術]
│   ├── BUSINESS [ビジネス]
│   ├── INDUSTRY [業界知識]
│   ├── SOFT_SKILL [ソフトスキル]
│   └── LANGUAGE [言語]
├── description: string [説明] [DESCRIPTION]
├── levels: SkillLevel[] [レベル定義（1-5）]
├── prerequisites: Skill[] [前提スキル]
├── relatedSkills: Skill[] [関連スキル]
├── createdAt: Timestamp [作成日時] [CREATED_AT]
└── updatedAt: Timestamp [更新日時] [UPDATED_AT]
```

**主要メソッド**:
- `defineLevel()`: レベル定義
- `addPrerequisite()`: 前提スキル追加
- `checkPrerequisites()`: 前提スキル確認

---

#### 5. Timesheet [Timesheet] [TIMESHEET]

タイムシート [Timesheet] [TIMESHEET]

```
├── id: TimesheetId [タイムシートID] [TIMESHEET_ID]
├── resourceId: ResourceId [リソースID] [RESOURCE_ID]
├── periodStart: Date [期間開始] [PERIOD_START]
├── periodEnd: Date [期間終了] [PERIOD_END]
├── entries: TimesheetEntry[] [明細]
├── totalHours: number [合計時間] [TOTAL_HOURS]
├── status: TimesheetStatus [承認状態] [TIMESHEET_STATUS]
│   ├── DRAFT [下書き]
│   ├── SUBMITTED [提出済み]
│   ├── APPROVED [承認済み]
│   └── REJECTED [却下]
├── submittedAt: Timestamp [提出日時] [SUBMITTED_AT]
├── approvedBy: UserId [承認者ID] [APPROVED_BY]
├── approvedAt: Timestamp [承認日時] [APPROVED_AT]
├── createdAt: Timestamp [作成日時] [CREATED_AT]
└── updatedAt: Timestamp [更新日時] [UPDATED_AT]
```

**主要メソッド**:
- `addEntry()`: 明細追加
- `submit()`: 提出
- `approve()`: 承認
- `reject()`: 却下
- `validate()`: 妥当性検証

---

## 値オブジェクト {#value-objects}

### 1. ResourceAllocation [リソース配分]

```typescript
class ResourceAllocation {
  constructor(
    public readonly projectId: ProjectId,
    public readonly allocationPercentage: Percentage, // 0.0-2.0
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.allocationPercentage < 0 || this.allocationPercentage > 2.0) {
      throw new InvalidAllocationError('Allocation must be 0-200%');
    }
    if (this.endDate < this.startDate) {
      throw new InvalidDateRangeError('End date must be after start date');
    }
  }

  isOverlapping(other: ResourceAllocation): boolean {
    return (
      this.startDate <= other.endDate &&
      this.endDate >= other.startDate
    );
  }
}
```

---

### 2. SkillLevel [スキルレベル]

```typescript
class SkillLevel {
  constructor(
    public readonly level: number, // 1-5
    public readonly levelName: string,
    public readonly description: string,
    public readonly criteria: string[],
    public readonly acquiredDate?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.level < 1 || this.level > 5) {
      throw new InvalidSkillLevelError('Level must be 1-5');
    }
  }

  canLevelUpTo(newLevel: number): boolean {
    return newLevel === this.level + 1 && newLevel <= 5;
  }
}

// レベル定義例
const SKILL_LEVELS = {
  1: 'BEGINNER',    // 初級
  2: 'INTERMEDIATE', // 中級
  3: 'ADVANCED',     // 上級
  4: 'EXPERT',       // エキスパート
  5: 'MASTER'        // マスター
};
```

---

### 3. PerformanceRating [パフォーマンス評価]

```typescript
class PerformanceRating {
  constructor(
    public readonly ratingScore: number, // 1.0-5.0
    public readonly evaluationPeriod: Period,
    public readonly dimensions: Map<string, number>, // 評価次元
    public readonly comments: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.ratingScore < 1.0 || this.ratingScore > 5.0) {
      throw new InvalidRatingError('Rating must be 1.0-5.0');
    }
  }

  getRatingCategory(): RatingCategory {
    if (this.ratingScore >= 4.5) return RatingCategory.EXCEPTIONAL;
    if (this.ratingScore >= 3.5) return RatingCategory.EXCEEDS_EXPECTATIONS;
    if (this.ratingScore >= 2.5) return RatingCategory.MEETS_EXPECTATIONS;
    if (this.ratingScore >= 1.5) return RatingCategory.NEEDS_IMPROVEMENT;
    return RatingCategory.UNSATISFACTORY;
  }
}
```

---

### 4. Period [期間]

```typescript
class Period {
  constructor(
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {
    if (endDate < startDate) {
      throw new InvalidPeriodError('End date must be after start date');
    }
  }

  getDays(): number {
    return Math.ceil(
      (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getStandardWorkHours(): number {
    // 営業日のみカウント（土日祝除く）
    const workDays = this.getWorkDays();
    return workDays * 8; // 1日8時間
  }

  contains(date: Date): boolean {
    return date >= this.startDate && date <= this.endDate;
  }

  overlaps(other: Period): boolean {
    return (
      this.startDate <= other.endDate &&
      this.endDate >= other.startDate
    );
  }
}
```

---

## ドメインイベント {#domain-events}

### リソース関連イベント

1. **ResourceAllocatedEvent** - リソース配分時
   ```typescript
   {
     resourceId: ResourceId,
     projectId: ProjectId,
     allocation: ResourceAllocation,
     timestamp: Timestamp
   }
   ```

2. **TimesheetSubmittedEvent** - タイムシート提出時
   ```typescript
   {
     timesheetId: TimesheetId,
     resourceId: ResourceId,
     period: Period,
     totalHours: number,
     timestamp: Timestamp
   }
   ```

3. **TimesheetApprovedEvent** - タイムシート承認時
   ```typescript
   {
     timesheetId: TimesheetId,
     approvedBy: UserId,
     timestamp: Timestamp
   }
   ```

### チーム関連イベント

4. **TeamFormedEvent** - チーム編成時
5. **TeamMemberAddedEvent** - メンバー追加時
6. **TeamLeaderAssignedEvent** - リーダー任命時
7. **TeamDisbandedEvent** - チーム解散時

### タレント関連イベント

8. **PerformanceRecordedEvent** - パフォーマンス記録時
9. **PerformanceApprovedEvent** - パフォーマンス承認時
10. **CareerPlanCreatedEvent** - キャリア計画作成時
11. **DevelopmentGoalSetEvent** - 育成目標設定時

### スキル関連イベント

12. **SkillAcquiredEvent** - スキル習得時
13. **SkillLevelUpEvent** - スキルレベルアップ時
14. **CertificationObtainedEvent** - 資格取得時

---

## ドメインサービス {#domain-services}

### 1. ResourceOptimizationService [リソース最適化サービス]

**責務**: リソース配分の最適化とutilization management

```typescript
class ResourceOptimizationService {
  // リソース配分最適化
  optimizeResourceAllocation(
    projectDemands: ProjectDemand[],
    availableResources: Resource[]
  ): AllocationPlan {
    // アルゴリズム:
    // 1. プロジェクトの優先度とスキル要件を分析
    // 2. リソースのスキルマッチとavailabilityを評価
    // 3. 最適化制約（配分率、コストなど）を考慮
    // 4. 最適な配分計画を生成
  }

  // リソース需要予測
  forecastResourceDemand(
    historicalData: ResourceUsageHistory,
    upcomingProjects: Project[]
  ): ResourceForecast {
    // 過去のリソース使用パターンと今後のプロジェクトから需要予測
  }

  // 稼働率最大化提案
  maximizeUtilization(
    resources: Resource[],
    targetUtilization: Percentage
  ): UtilizationPlan {
    // 目標稼働率を達成するための配分調整提案
  }
}
```

---

### 2. TeamFormationService [チーム編成サービス]

**責務**: チーム編成最適化

```typescript
class TeamFormationService {
  // 最適チーム編成
  formOptimalTeam(
    projectRequirements: ProjectRequirement,
    availableResources: Resource[]
  ): Team {
    // アルゴリズム:
    // 1. プロジェクトに必要なスキルセット特定
    // 2. スキルマッチング
    // 3. チームシナジー考慮
    // 4. 過去のパフォーマンス実績評価
  }

  // チームスキルバランス調整
  balanceTeamSkills(
    team: Team,
    targetSkillProfile: SkillProfile
  ): TeamAdjustmentPlan {
    // 現在のスキルプロファイルと目標とのギャップを分析し調整案を提示
  }

  // チームパフォーマンス分析
  analyzeTeamPerformance(
    team: Team,
    metrics: PerformanceMetrics
  ): PerformanceAnalysis {
    // チームの生産性、品質、協働性などを多面的に分析
  }
}
```

---

### 3. SkillDevelopmentService [スキル開発サービス]

**責務**: スキルギャップ分析と開発計画

```typescript
class SkillDevelopmentService {
  // スキルギャップ分析
  analyzeSkillGaps(
    currentSkills: TalentSkill[],
    requiredSkills: Skill[]
  ): SkillGapAnalysis {
    // 現在のスキルと必要スキルのギャップを特定
  }

  // トレーニング推奨
  recommendTraining(
    talent: Talent,
    skillGaps: SkillGap[]
  ): TrainingRecommendation[] {
    // BC-006（知識管理）と連携してトレーニングプログラムを推奨
  }

  // スキル進捗追跡
  trackSkillProgress(
    talent: Talent,
    developmentPlan: DevelopmentPlan
  ): SkillProgressReport {
    // スキル開発の進捗状況を追跡
  }
}
```

---

## ユースケース例 {#use-cases}

### ユースケース1: リソース配分

```typescript
// アクター: プロジェクトマネージャー
// 目的: プロジェクトにリソースを配分する

const resource = await resourceRepository.findById(resourceId);
const project = await projectRepository.findById(projectId);

// リソースの現在の配分状況確認
const currentAllocations = resource.getAllocations(period);
const totalAllocation = resource.calculateTotalAllocation(period);

if (totalAllocation + 0.5 > 2.0) {
  throw new ExceedAllocationLimitError('Resource is over-allocated');
}

// プロジェクトに50%配分
const allocation = resource.allocateToProject(
  projectId,
  0.5, // 50%
  new Date('2025-11-01'),
  new Date('2026-03-31')
);

await resourceRepository.save(resource);

// イベント発行 → BC-007（通知）へ
eventBus.publish(new ResourceAllocatedEvent(resource.id, project.id, allocation));
```

---

### ユースケース2: チーム編成

```typescript
// アクター: プロジェクトマネージャー
// 目的: プロジェクトに最適なチームを編成する

const project = await projectRepository.findById(projectId);
const requirements = project.getSkillRequirements();

// リソース最適化サービスで最適なメンバーを選定
const availableResources = await resourceRepository.findAvailable(period);
const optimalTeam = await teamFormationService.formOptimalTeam(
  requirements,
  availableResources
);

// チーム作成
const team = new Team(projectId, 'Project Alpha Team');

// メンバー追加
for (const member of optimalTeam.members) {
  team.addMember(member.resourceId, member.role, member.allocationPercentage);
}

await teamRepository.save(team);

// イベント発行
eventBus.publish(new TeamFormedEvent(team.id, projectId));
```

---

### ユースケース3: パフォーマンス評価

```typescript
// アクター: マネージャー
// 目的: タレントのパフォーマンスを評価する

const talent = await talentRepository.findById(talentId);
const evaluationPeriod = new Period(
  new Date('2025-01-01'),
  new Date('2025-06-30')
);

// パフォーマンス評価記録
const rating = new PerformanceRating(
  4.2,
  evaluationPeriod,
  new Map([
    ['technical_skills', 4.5],
    ['communication', 4.0],
    ['leadership', 4.0],
    ['delivery_quality', 4.3]
  ]),
  'Excellent performance with strong technical delivery'
);

const record = talent.recordPerformance(
  evaluationPeriod,
  rating,
  managerId,
  'Detailed feedback...'
);

await talentRepository.save(talent);

// 承認フロー
talent.approvePerformance(record.id, hrManagerId);

// イベント発行
eventBus.publish(new PerformanceApprovedEvent(talent.id, record.id));
```

---

## BC間連携 {#bc-integration}

### BC-001 (Project Delivery) との連携

- プロジェクトへのリソース配分
- プロジェクト要件に基づくチーム編成
- プロジェクトパフォーマンスデータの共有

### BC-003 (Access Control) との連携

- ユーザー情報の参照
- 承認権限の確認
- 監査ログの記録

### BC-004 (Organizational Structure) との連携

- 組織単位からのリソース取得
- チームと組織単位の紐付け
- 組織階層を考慮したリソース配分

### BC-006 (Knowledge Management) との連携

- トレーニングプログラムの推奨
- 学習履歴とスキル習得の連携
- 資格取得支援

### BC-007 (Communication) との連携

- パフォーマンス評価通知
- タイムシート承認通知
- チーム編成通知

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-005 ドメイン層詳細化
