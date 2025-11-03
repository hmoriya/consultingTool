# BC-004: ドメイン設計

**BC**: Organizational Structure & Governance [組織構造とガバナンス] [ORGANIZATIONAL_STRUCTURE_GOVERNANCE]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/secure-access-service/domain-language.md（組織管理部分のみ）

---

## 目次

1. [概要](#overview)
2. [ドメインの責務](#domain-responsibility)
3. [主要集約（Aggregates）](#aggregates)
4. [エンティティ（Entities）](#entities)
5. [値オブジェクト（Value Objects）](#value-objects)
6. [ドメインイベント（Domain Events）](#domain-events)
7. [ドメインサービス（Domain Services）](#domain-services)
8. [ビジネスルール](#business-rules)
9. [他BCとの関係](#bc-relationships)

---

## 概要 {#overview}

BC-004は、組織構造とガバナンスを管理するBounded Contextです。

### ドメインの責務 {#domain-responsibility}

1. **組織階層管理**
   - 組織構造の定義と維持
   - 階層関係の管理（閉包テーブルパターン）
   - 組織再編の実行

2. **組織単位管理**
   - 部門、事業部、チームの管理
   - 親子関係の維持
   - メンバー配置

3. **チーム管理**
   - プロジェクトチーム、機能チームの管理
   - チームメンバーの割り当て
   - チームロール管理

4. **ガバナンス**
   - 組織ポリシーの定義
   - 承認フローの管理
   - コンプライアンスルールの適用

### ユビキタス言語

| 日本語 | English | CONSTANT_CASE | 説明 |
|--------|---------|---------------|------|
| 組織 | Organization | ORGANIZATION | 法人または事業体全体 |
| 組織単位 | Organization Unit | ORGANIZATION_UNIT | 部門、事業部、課などの組織構成要素 |
| 階層 | Hierarchy | HIERARCHY | 組織の上下関係 |
| チーム | Team | TEAM | プロジェクトや機能単位のグループ |
| メンバー | Member | MEMBER | 組織またはチームに所属する人 |
| ガバナンス | Governance | GOVERNANCE | 組織運営の方針と統制 |
| ポリシー | Policy | POLICY | 組織の規則や方針 |
| 承認フロー | Approval Flow | APPROVAL_FLOW | 意思決定プロセス |
| 組織再編 | Restructuring | RESTRUCTURING | 組織構造の変更 |

---

## 主要集約（Aggregates） {#aggregates}

### 1. Organization Aggregate

**集約ルート**: Organization [組織] [ORGANIZATION]

**責務**:
- 組織全体のライフサイクル管理
- 組織メタデータの維持
- ルート組織単位の管理

**包含エンティティ**:
- Organization（集約ルート）

**不変条件**:
1. 組織コードは一意である
2. 組織は必ず1つのルート組織単位を持つ
3. 組織が削除される場合、全ての組織単位とメンバーが削除される

**主要メソッド**:
```typescript
class Organization {
  // 組織作成
  static create(
    name: OrganizationName,
    code: OrganizationCode,
    type: OrganizationType
  ): Organization

  // 組織情報更新
  updateInfo(
    name: OrganizationName,
    description?: string
  ): void

  // 組織アーカイブ（論理削除）
  archive(archivedBy: UserId): void

  // 組織再開
  restore(): void
}
```

**ドメインイベント**:
- `OrganizationCreated`
- `OrganizationInfoUpdated`
- `OrganizationArchived`
- `OrganizationRestored`

---

### 2. OrganizationUnit Aggregate

**集約ルート**: OrganizationUnit [組織単位] [ORGANIZATION_UNIT]

**責務**:
- 組織単位（部門、事業部、課）の管理
- 階層関係の維持
- メンバー配置管理

**包含エンティティ**:
- OrganizationUnit（集約ルート）
- OrganizationMember（エンティティ）

**不変条件**:
1. 組織単位は必ず1つの組織に属する
2. 親子関係に循環参照は存在しない
3. 階層レベルは親の階層レベル + 1である
4. ルート単位は親を持たない（parent_unit_id = NULL）
5. メンバーは同一組織単位内で一意である

**主要メソッド**:
```typescript
class OrganizationUnit {
  // 組織単位作成
  static create(
    organizationId: OrganizationId,
    name: UnitName,
    parentUnitId: UnitId | null,
    unitType: UnitType
  ): OrganizationUnit

  // 親単位変更（組織再編）
  changeParent(
    newParentUnitId: UnitId,
    hierarchyService: OrganizationHierarchyService
  ): void

  // メンバー追加
  addMember(
    userId: UserId,
    roleInUnit: RoleInUnit,
    joinedAt: Date
  ): OrganizationMember

  // メンバー削除
  removeMember(memberId: MemberId): void

  // 組織単位名変更
  rename(newName: UnitName): void

  // 組織単位タイプ変更
  changeType(newType: UnitType): void

  // サブ単位の取得（直接の子のみ）
  getDirectChildren(): OrganizationUnit[]

  // 全ての祖先を取得
  getAncestors(hierarchyService: OrganizationHierarchyService): OrganizationUnit[]

  // 全ての子孫を取得
  getDescendants(hierarchyService: OrganizationHierarchyService): OrganizationUnit[]
}
```

**ドメインイベント**:
- `OrganizationUnitCreated`
- `OrganizationUnitRenamed`
- `OrganizationUnitTypeChanged`
- `OrganizationUnitParentChanged`（組織再編）
- `MemberAddedToUnit`
- `MemberRemovedFromUnit`
- `MemberRoleInUnitChanged`

---

### 3. Team Aggregate

**集約ルート**: Team [チーム] [TEAM]

**責務**:
- プロジェクトチーム、機能チームの管理
- チームメンバーの割り当て
- チームロール管理

**包含エンティティ**:
- Team（集約ルート）
- TeamMember（エンティティ）

**不変条件**:
1. チームは必ず1つの組織に属する
2. チームには最低1人のリーダーが必要
3. チームメンバーは同一チーム内で一意である
4. チームメンバーは組織のメンバーである必要がある

**主要メソッド**:
```typescript
class Team {
  // チーム作成
  static create(
    organizationId: OrganizationId,
    name: TeamName,
    type: TeamType,
    leaderId: UserId
  ): Team

  // チームメンバー追加
  addMember(
    userId: UserId,
    role: TeamRole,
    allocationRate: AllocationRate
  ): TeamMember

  // チームメンバー削除
  removeMember(memberId: MemberId): void

  // チームリーダー変更
  changeLeader(newLeaderId: UserId): void

  // メンバーのロール変更
  changeMemberRole(
    memberId: MemberId,
    newRole: TeamRole
  ): void

  // メンバーのアサイン率変更
  changeMemberAllocation(
    memberId: MemberId,
    newAllocationRate: AllocationRate
  ): void

  // チーム解散
  disband(reason: string): void

  // チームリーダーの確認
  hasLeader(): boolean

  // チームメンバー数取得
  getMemberCount(): number
}
```

**ドメインイベント**:
- `TeamCreated`
- `TeamRenamed`
- `TeamLeaderChanged`
- `TeamMemberAdded`
- `TeamMemberRemoved`
- `TeamMemberRoleChanged`
- `TeamMemberAllocationChanged`
- `TeamDisbanded`

---

### 4. GovernancePolicy Aggregate

**集約ルート**: GovernancePolicy [ガバナンスポリシー] [GOVERNANCE_POLICY]

**責務**:
- 組織のガバナンスルール定義
- ポリシーの適用スコープ管理
- コンプライアンスルールの強制

**包含エンティティ**:
- GovernancePolicy（集約ルート）
- PolicyRule（エンティティ）

**不変条件**:
1. 有効なポリシーは、同一カテゴリ・スコープで一意である
2. ポリシーには最低1つのルールが必要
3. ポリシーの優先度は1-1000の範囲内である

**主要メソッド**:
```typescript
class GovernancePolicy {
  // ポリシー作成
  static create(
    organizationId: OrganizationId,
    name: PolicyName,
    category: PolicyCategory,
    scope: PolicyScope
  ): GovernancePolicy

  // ルール追加
  addRule(
    ruleName: string,
    ruleType: RuleType,
    condition: RuleCondition,
    action: RuleAction
  ): PolicyRule

  // ルール削除
  removeRule(ruleId: RuleId): void

  // ポリシー有効化
  activate(): void

  // ポリシー無効化
  deactivate(): void

  // ポリシー適用可能性チェック
  isApplicableTo(scopeId: string): boolean

  // ポリシー評価
  evaluate(context: PolicyContext): PolicyEvaluationResult
}
```

**ドメインイベント**:
- `GovernancePolicyCreated`
- `PolicyRuleAdded`
- `PolicyRuleRemoved`
- `GovernancePolicyActivated`
- `GovernancePolicyDeactivated`
- `PolicyViolationDetected`

---

## エンティティ（Entities） {#entities}

### Organization [組織] [ORGANIZATION]

```
組織 [Organization] [ORGANIZATION]
├── 組織ID [id] [ORGANIZATION_ID]: UUID
├── 組織名 [name] [ORGANIZATION_NAME]: STRING_200
├── 組織コード [code] [ORGANIZATION_CODE]: STRING_50（UNIQUE）
├── 組織タイプ [type] [ORGANIZATION_TYPE]: ENUM
│   └── headquarters | branch | division | subsidiary
├── 説明 [description] [DESCRIPTION]: TEXT
├── ステータス [status] [STATUS]: ENUM
│   └── active | archived
├── ルート単位ID [rootUnitId] [ROOT_UNIT_ID]: UUID
├── 作成者 [createdBy] [CREATED_BY]: UUID
├── 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
├── 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
├── アーカイブ日時 [archivedAt] [ARCHIVED_AT]: TIMESTAMP（オプション）
└── アーカイブ者 [archivedBy] [ARCHIVED_BY]: UUID（オプション）
```

**ビジネスルール**:
- 組織コードは3-50文字、英数字とハイフンのみ
- 組織名は1-200文字
- 組織作成時、自動的にルート組織単位が作成される

---

### OrganizationUnit [組織単位] [ORGANIZATION_UNIT]

```
組織単位 [OrganizationUnit] [ORGANIZATION_UNIT]
├── 単位ID [id] [UNIT_ID]: UUID
├── 組織ID [organizationId] [ORGANIZATION_ID]: UUID
├── 単位名 [name] [UNIT_NAME]: STRING_200
├── 単位コード [code] [UNIT_CODE]: STRING_50（オプション）
├── 単位タイプ [unitType] [UNIT_TYPE]: ENUM
│   └── root | division | department | section | team
├── 親単位ID [parentUnitId] [PARENT_UNIT_ID]: UUID（オプション）
├── 階層レベル [hierarchyLevel] [HIERARCHY_LEVEL]: INTEGER（0-10）
├── 組織パス [path] [PATH]: STRING_500
│   └── 例: /本社/営業本部/第一営業部
├── 説明 [description] [DESCRIPTION]: TEXT
├── メンバー数 [memberCount] [MEMBER_COUNT]: INTEGER
├── 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
├── 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
└── メンバー一覧 [members] [MEMBERS]: LIST<OrganizationMember>
```

**ビジネスルール**:
- ルート単位は階層レベル0、親単位IDはNULL
- 子単位の階層レベルは親単位 + 1
- 組織パスは自動計算される（/親/親の親/.../現在の単位）
- 階層レベルの最大値は10（深すぎる階層を防止）

---

### OrganizationMember [組織メンバー] [ORGANIZATION_MEMBER]

```
組織メンバー [OrganizationMember] [ORGANIZATION_MEMBER]
├── メンバーID [id] [MEMBER_ID]: UUID
├── 組織ID [organizationId] [ORGANIZATION_ID]: UUID
├── 単位ID [unitId] [UNIT_ID]: UUID
├── ユーザーID [userId] [USER_ID]: UUID（BC-003参照）
├── 単位内ロール [roleInUnit] [ROLE_IN_UNIT]: STRING_100
│   └── 例: manager | member | lead
├── 参加日時 [joinedAt] [JOINED_AT]: TIMESTAMP
├── 離脱日時 [leftAt] [LEFT_AT]: TIMESTAMP（オプション）
└── ステータス [status] [STATUS]: ENUM
    └── active | inactive | transferred
```

**ビジネスルール**:
- ユーザーは複数の組織単位に所属可能
- 同一組織単位内での重複登録は不可
- 離脱後は`status = inactive`、`leftAt`が記録される

---

### Team [チーム] [TEAM]

```
チーム [Team] [TEAM]
├── チームID [id] [TEAM_ID]: UUID
├── 組織ID [organizationId] [ORGANIZATION_ID]: UUID
├── チーム名 [name] [TEAM_NAME]: STRING_200
├── チームコード [code] [TEAM_CODE]: STRING_50（オプション）
├── チームタイプ [teamType] [TEAM_TYPE]: ENUM
│   └── project_team | functional_team | cross_functional_team
├── 説明 [description] [DESCRIPTION]: TEXT
├── リーダーID [leaderId] [LEADER_ID]: UUID
├── ステータス [status] [STATUS]: ENUM
│   └── active | inactive | disbanded
├── 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
├── 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
├── 解散日時 [disbandedAt] [DISBANDED_AT]: TIMESTAMP（オプション）
└── メンバー一覧 [members] [MEMBERS]: LIST<TeamMember>
```

**ビジネスルール**:
- チームには必ず1人のリーダーが必要
- リーダーはチームメンバーである必要がある
- プロジェクトチームは期間限定、機能チームは恒久的

---

### TeamMember [チームメンバー] [TEAM_MEMBER]

```
チームメンバー [TeamMember] [TEAM_MEMBER]
├── メンバーID [id] [MEMBER_ID]: UUID
├── チームID [teamId] [TEAM_ID]: UUID
├── ユーザーID [userId] [USER_ID]: UUID
├── チームロール [role] [TEAM_ROLE]: ENUM
│   └── leader | member | contributor
├── アサイン率 [allocationRate] [ALLOCATION_RATE]: DECIMAL（0.0-1.0）
│   └── 例: 0.5 = 50%アサイン
├── 参加日時 [joinedAt] [JOINED_AT]: TIMESTAMP
├── 離脱日時 [leftAt] [LEFT_AT]: TIMESTAMP（オプション）
└── ステータス [status] [STATUS]: ENUM
    └── active | inactive
```

**ビジネスルール**:
- アサイン率は0.0-1.0の範囲（0% - 100%）
- 1人のユーザーの全チームでのアサイン率合計は1.0を超えても良い（過配置検知のため）
- リーダーロールは1チームに1人のみ

---

### GovernancePolicy [ガバナンスポリシー] [GOVERNANCE_POLICY]

```
ガバナンスポリシー [GovernancePolicy] [GOVERNANCE_POLICY]
├── ポリシーID [id] [POLICY_ID]: UUID
├── 組織ID [organizationId] [ORGANIZATION_ID]: UUID
├── ポリシー名 [name] [POLICY_NAME]: STRING_200
├── カテゴリ [category] [CATEGORY]: ENUM
│   └── approval | access_control | compliance | data_governance
├── スコープタイプ [scopeType] [SCOPE_TYPE]: ENUM
│   └── global | organization_unit | team
├── スコープID [scopeId] [SCOPE_ID]: UUID（オプション）
├── 説明 [description] [DESCRIPTION]: TEXT
├── 有効フラグ [enabled] [ENABLED]: BOOLEAN
├── 優先度 [priority] [PRIORITY]: INTEGER（1-1000）
├── 有効期限 [expiresAt] [EXPIRES_AT]: TIMESTAMP（オプション）
├── 作成者 [createdBy] [CREATED_BY]: UUID
├── 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
├── 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
└── ルール一覧 [rules] [RULES]: LIST<PolicyRule>
```

**ビジネスルール**:
- 優先度の低い値（1）が高優先度
- スコープが狭いポリシーが広いポリシーより優先される
- 有効期限を過ぎたポリシーは自動的に無効化

---

### PolicyRule [ポリシールール] [POLICY_RULE]

```
ポリシールール [PolicyRule] [POLICY_RULE]
├── ルールID [id] [RULE_ID]: UUID
├── ポリシーID [policyId] [POLICY_ID]: UUID
├── ルール名 [name] [RULE_NAME]: STRING_200
├── ルールタイプ [ruleType] [RULE_TYPE]: ENUM
│   └── approval_required | access_restricted | data_retention | notification
├── 条件 [condition] [CONDITION]: JSONB
│   └── 例: {"amount": {"$gte": 1000000}}
├── アクション [action] [ACTION]: JSONB
│   └── 例: {"type": "require_approval", "approvers": ["manager"]}
├── 説明 [description] [DESCRIPTION]: TEXT
└── 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
```

**ビジネスルール**:
- 条件とアクションはJSON形式で柔軟に定義
- ルールタイプに応じて異なる評価エンジンで処理

---

## 値オブジェクト（Value Objects） {#value-objects}

### OrganizationPath [組織パス] [ORGANIZATION_PATH]

```typescript
class OrganizationPath {
  private readonly pathString: string;
  private readonly pathElements: string[];
  private readonly depth: number;

  constructor(pathString: string) {
    this.pathString = pathString;
    this.pathElements = pathString.split('/').filter(e => e.length > 0);
    this.depth = this.pathElements.length;
  }

  // パス文字列取得
  toString(): string {
    return this.pathString;
  }

  // 親パス取得
  getParentPath(): OrganizationPath | null {
    if (this.depth === 0) return null;
    const parentElements = this.pathElements.slice(0, -1);
    return new OrganizationPath('/' + parentElements.join('/'));
  }

  // 子パス生成
  appendChild(childName: string): OrganizationPath {
    return new OrganizationPath(this.pathString + '/' + childName);
  }

  // 深度取得
  getDepth(): number {
    return this.depth;
  }

  // ルートか判定
  isRoot(): boolean {
    return this.depth === 0;
  }
}
```

**不変条件**:
- パス文字列は`/`で始まる
- パス要素に空文字列は含まれない
- 深度は0以上

---

### UnitType [単位タイプ] [UNIT_TYPE]

```typescript
class UnitType {
  private readonly typeName: string;
  private readonly hierarchyLevel: number;
  private readonly displayName: string;

  static readonly ROOT = new UnitType('root', 0, 'ルート');
  static readonly DIVISION = new UnitType('division', 1, '事業部');
  static readonly DEPARTMENT = new UnitType('department', 2, '部');
  static readonly SECTION = new UnitType('section', 3, '課');
  static readonly TEAM = new UnitType('team', 4, 'チーム');

  private constructor(
    typeName: string,
    hierarchyLevel: number,
    displayName: string
  ) {
    this.typeName = typeName;
    this.hierarchyLevel = hierarchyLevel;
    this.displayName = displayName;
  }

  getHierarchyLevel(): number {
    return this.hierarchyLevel;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  equals(other: UnitType): boolean {
    return this.typeName === other.typeName;
  }
}
```

---

### AllocationRate [アサイン率] [ALLOCATION_RATE]

```typescript
class AllocationRate {
  private readonly rate: number; // 0.0 - 1.0

  constructor(rate: number) {
    if (rate < 0.0 || rate > 1.0) {
      throw new Error('Allocation rate must be between 0.0 and 1.0');
    }
    this.rate = rate;
  }

  toPercentage(): number {
    return this.rate * 100;
  }

  toDecimal(): number {
    return this.rate;
  }

  add(other: AllocationRate): AllocationRate {
    return new AllocationRate(this.rate + other.rate);
  }

  isFullTime(): boolean {
    return this.rate === 1.0;
  }

  isOverAllocated(): boolean {
    return this.rate > 1.0;
  }
}
```

---

## ドメインイベント（Domain Events） {#domain-events}

### Organization関連イベント

```typescript
// 組織作成
class OrganizationCreated extends DomainEvent {
  organizationId: OrganizationId;
  name: string;
  code: string;
  type: string;
  rootUnitId: UnitId;
  createdBy: UserId;
  createdAt: Date;
}

// 組織情報更新
class OrganizationInfoUpdated extends DomainEvent {
  organizationId: OrganizationId;
  previousName: string;
  newName: string;
  updatedBy: UserId;
  updatedAt: Date;
}

// 組織アーカイブ
class OrganizationArchived extends DomainEvent {
  organizationId: OrganizationId;
  archivedBy: UserId;
  archivedAt: Date;
  reason: string;
}
```

### OrganizationUnit関連イベント

```typescript
// 組織単位作成
class OrganizationUnitCreated extends DomainEvent {
  unitId: UnitId;
  organizationId: OrganizationId;
  name: string;
  parentUnitId: UnitId | null;
  hierarchyLevel: number;
  path: string;
  createdAt: Date;
}

// 組織再編（親変更）
class OrganizationUnitParentChanged extends DomainEvent {
  unitId: UnitId;
  previousParentId: UnitId | null;
  newParentId: UnitId | null;
  previousPath: string;
  newPath: string;
  affectedDescendantCount: number;
  changedAt: Date;
}

// メンバー追加
class MemberAddedToUnit extends DomainEvent {
  memberId: MemberId;
  unitId: UnitId;
  userId: UserId;
  roleInUnit: string;
  joinedAt: Date;
}

// メンバー削除
class MemberRemovedFromUnit extends DomainEvent {
  memberId: MemberId;
  unitId: UnitId;
  userId: UserId;
  leftAt: Date;
  reason: string;
}
```

### Team関連イベント

```typescript
// チーム作成
class TeamCreated extends DomainEvent {
  teamId: TeamId;
  organizationId: OrganizationId;
  name: string;
  teamType: string;
  leaderId: UserId;
  createdAt: Date;
}

// チームリーダー変更
class TeamLeaderChanged extends DomainEvent {
  teamId: TeamId;
  previousLeaderId: UserId;
  newLeaderId: UserId;
  changedAt: Date;
}

// チームメンバー追加
class TeamMemberAdded extends DomainEvent {
  memberId: MemberId;
  teamId: TeamId;
  userId: UserId;
  role: string;
  allocationRate: number;
  joinedAt: Date;
}

// チームメンバーのアサイン率変更
class TeamMemberAllocationChanged extends DomainEvent {
  memberId: MemberId;
  teamId: TeamId;
  userId: UserId;
  previousAllocationRate: number;
  newAllocationRate: number;
  changedAt: Date;
}
```

### GovernancePolicy関連イベント

```typescript
// ポリシー作成
class GovernancePolicyCreated extends DomainEvent {
  policyId: PolicyId;
  organizationId: OrganizationId;
  name: string;
  category: string;
  scopeType: string;
  scopeId: string | null;
  createdBy: UserId;
  createdAt: Date;
}

// ポリシー違反検知
class PolicyViolationDetected extends DomainEvent {
  policyId: PolicyId;
  ruleId: RuleId;
  violationType: string;
  context: any;
  detectedAt: Date;
  severity: string; // low | medium | high | critical
}
```

---

## ドメインサービス（Domain Services） {#domain-services}

### OrganizationHierarchyService

**責務**: 組織階層の管理と整合性維持

```typescript
class OrganizationHierarchyService {
  // 階層関係の構築（閉包テーブルパターン）
  buildHierarchy(
    unitId: UnitId,
    parentUnitId: UnitId | null
  ): OrganizationHierarchy[]

  // 階層の再構築（組織再編時）
  rebuildHierarchy(
    unitId: UnitId,
    newParentUnitId: UnitId
  ): void

  // 循環参照チェック
  hasCircularReference(
    unitId: UnitId,
    parentUnitId: UnitId
  ): boolean

  // 祖先取得
  getAncestors(unitId: UnitId): OrganizationUnit[]

  // 子孫取得
  getDescendants(unitId: UnitId): OrganizationUnit[]

  // 深度計算
  calculateDepth(unitId: UnitId): number

  // パス計算
  calculatePath(unitId: UnitId): OrganizationPath
}
```

**ビジネスルール**:
- 親変更時、全ての子孫の階層情報も更新
- 循環参照は禁止（A → B → C → A は不可）
- 最大深度は10レベル

---

### TeamAllocationService

**責務**: チームメンバーのアサイン率管理

```typescript
class TeamAllocationService {
  // ユーザーの総アサイン率計算
  calculateTotalAllocation(userId: UserId): AllocationRate

  // 過配置チェック
  checkOverAllocation(userId: UserId): boolean

  // アサイン可能率計算
  calculateAvailableAllocation(userId: UserId): AllocationRate

  // チームへのアサイン可能性チェック
  canAllocateToTeam(
    userId: UserId,
    requestedRate: AllocationRate
  ): boolean

  // 推奨アサイン率提案
  suggestAllocationRate(
    userId: UserId,
    teamId: TeamId
  ): AllocationRate
}
```

**ビジネスルール**:
- 100%超のアサインは警告だが許可（一時的な過配置を検知）
- 複数チームへの分散アサインをサポート

---

### GovernancePolicyEvaluationService

**責務**: ガバナンスポリシーの評価と適用

```typescript
class GovernancePolicyEvaluationService {
  // ポリシー評価
  evaluatePolicy(
    policyId: PolicyId,
    context: PolicyContext
  ): PolicyEvaluationResult

  // 適用可能なポリシー取得
  getApplicablePolicies(
    scopeType: string,
    scopeId: string
  ): GovernancePolicy[]

  // ポリシー違反チェック
  checkViolations(
    context: PolicyContext
  ): PolicyViolation[]

  // 承認者リスト取得
  getApprovers(
    policyId: PolicyId,
    context: PolicyContext
  ): UserId[]
}
```

---

## ビジネスルール {#business-rules}

### 組織階層ルール

1. **階層レベルの制限**
   - 最大10レベルまで
   - ルート単位は階層レベル0

2. **循環参照の禁止**
   - A → B → C → A のような循環は不可
   - 親変更時に循環参照チェックを実施

3. **組織パスの一意性**
   - 同一組織内で組織パスは一意
   - パスは自動計算される

### チーム管理ルール

1. **チームリーダー**
   - 必ず1人のリーダーが必要
   - リーダーはチームメンバーである必要がある

2. **アサイン率**
   - 0% - 100%の範囲（0.0 - 1.0）
   - 100%超の過配置は警告だが許可

3. **チーム解散**
   - 解散時、全メンバーは`status = inactive`
   - 解散日時と理由を記録

### ガバナンスルール

1. **ポリシー優先度**
   - 優先度の低い値（1）が高優先度
   - スコープが狭いポリシーが広いポリシーより優先

2. **ポリシー適用スコープ**
   - global: 全組織に適用
   - organization_unit: 特定組織単位に適用
   - team: 特定チームに適用

---

## 他BCとの関係 {#bc-relationships}

### BC-003 (Access Control & Security) との関係

**依存方向**: BC-004 → BC-003

- **参照データ**:
  - users テーブル（OrganizationMember.userId, TeamMember.userId）
  - 認証・認可情報

- **統合パターン**:
  - BC-004は組織構造を管理
  - BC-003はユーザー認証と権限を管理
  - BC-003のロールに組織単位スコープを設定可能

### BC-001 (Project Portfolio) との関係

**依存方向**: BC-001 → BC-004

- **参照データ**:
  - organization_units テーブル（プロジェクトの所属組織単位）
  - teams テーブル（プロジェクトチーム）

- **統合パターン**:
  - プロジェクトは組織単位に紐づく
  - プロジェクトチームはBC-004のTeamとして管理

### BC-005 (Resources) との関係

**依存方向**: BC-005 → BC-004

- **参照データ**:
  - organization_units テーブル（リソースの配置先）
  - teams テーブル（リソースのチーム配置）

- **統合パターン**:
  - リソースは組織単位に配置
  - リソースはチームにアサイン

---

## V2からの移行

### 移行ステータス

| 項目 | V2 | V3 | ステータス |
|-----|----|----|---------|
| ドメインモデル | 基本エンティティのみ | 4 Aggregates詳細定義 | ✅ 拡張完了 |
| ユビキタス言語 | 未定義 | Parasol言語適用 | ✅ 定義完了 |
| ドメインイベント | 未定義 | 15+イベント定義 | ✅ 定義完了 |
| ドメインサービス | 未定義 | 3サービス定義 | ✅ 定義完了 |
| ビジネスルール | 散在 | 体系化・文書化 | ✅ 整理完了 |
| BC間関係 | 不明確 | 明確化 | ✅ 定義完了 |

---

## 関連ドキュメント

- [../api/README.md](../api/README.md) - BC-004 API仕様
- [../data/README.md](../data/README.md) - BC-004 データ設計
- Issue #192: V3構造ドキュメント整備プロジェクト
- Issue #146: WHAT/HOW分離原則

---

**ステータス**: Phase 2.3 - BC-004 ドメイン詳細化完了
**最終更新**: 2025-11-03
**次のアクション**: BC-004 API設計の詳細化

---

**変更履歴**:
- 2025-11-03: Phase 2.3 - BC-004 ドメインモデルを詳細化（Issue #192）
  - 4 Aggregates詳細定義（Organization, OrganizationUnit, Team, GovernancePolicy）
  - 9 Entities詳細定義
  - 3 Value Objects定義
  - 15+ Domain Events定義
  - 3 Domain Services定義
  - ビジネスルール体系化
  - BC間関係明確化
  - BC-001テンプレートに基づく詳細化
- 2025-10-31: Phase 0 - 基本構造作成
