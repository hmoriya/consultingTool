# OP-001: リソースを配分する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや業務に対して最適なリソース（人材）を配分する。スキル、稼働率、コストを考慮した配分により、生産性とプロジェクト成功率を最大化する。

### 実現する機能
- プロジェクトへのリソース割り当て
- スキルマッチングに基づく配分
- 稼働率と負荷の考慮
- リソース配分計画の作成

### 入力
- プロジェクト要件（必要スキル、期間、工数）
- 利用可能リソース情報
- スキルマトリックス
- 現在の稼働状況

### 出力
- リソース配分計画
- プロジェクト別アサイン情報
- 稼働率予測
- 配分承認依頼

---

## 📥 入力パラメータ

### AllocationRequest インターフェース

```typescript
interface AllocationRequest {
  // リソース情報
  resourceId: string;           // リソースID (UUID)
  resourceType: ResourceType;   // CONSULTANT | ENGINEER | DESIGNER | PROJECT_MANAGER | ANALYST
  resourceLevel: ResourceLevel; // JUNIOR | INTERMEDIATE | SENIOR | PRINCIPAL | PARTNER

  // プロジェクト情報
  projectId: string;            // プロジェクトID (UUID)
  projectPriority: number;      // プロジェクト優先度 (1-10)

  // 配分期間
  startDate: Date;              // 配分開始日
  endDate: Date;                // 配分終了日

  // 配分率
  allocationPercentage: number; // 配分率 (0.0-2.0, 200%まで兼務可)

  // スキル要件
  requiredSkills: SkillRequirement[];

  // オプション設定
  options?: {
    autoOptimize?: boolean;     // 自動最適化フラグ
    considerCost?: boolean;     // コスト考慮フラグ
    considerUtilization?: boolean; // 稼働率考慮フラグ
  };
}

interface SkillRequirement {
  skillId: string;              // スキルID
  skillName: string;            // スキル名
  minimumLevel: number;         // 最低レベル (1-5)
  weight: number;               // 重要度 (0.0-1.0)
}

interface ResourceType {
  CONSULTANT: 'CONSULTANT';
  ENGINEER: 'ENGINEER';
  DESIGNER: 'DESIGNER';
  PROJECT_MANAGER: 'PROJECT_MANAGER';
  ANALYST: 'ANALYST';
}

interface ResourceLevel {
  JUNIOR: 'JUNIOR';
  INTERMEDIATE: 'INTERMEDIATE';
  SENIOR: 'SENIOR';
  PRINCIPAL: 'PRINCIPAL';
  PARTNER: 'PARTNER';
}
```

### バリデーションルール

| パラメータ | 必須 | 検証ルール | エラーコード |
|-----------|------|-----------|-------------|
| resourceId | ○ | UUID形式 | ERR_BC005_L3001_OP001_001 |
| projectId | ○ | UUID形式 | ERR_BC005_L3001_OP001_002 |
| allocationPercentage | ○ | 0.0 ≤ value ≤ 2.0 | ERR_BC005_L3001_OP001_003 |
| startDate | ○ | ISO 8601形式、未来日付 | ERR_BC005_L3001_OP001_004 |
| endDate | ○ | startDate < endDate | ERR_BC005_L3001_OP001_005 |
| requiredSkills | × | 配列形式、最大20件 | ERR_BC005_L3001_OP001_006 |

---

## 📤 出力仕様

### AllocationResponse インターフェース

```typescript
interface AllocationResponse {
  // 配分結果
  allocationId: string;         // 配分ID (UUID)
  status: AllocationStatus;     // DRAFT | PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED

  // 配分情報
  allocation: ResourceAllocation;

  // 最適化結果
  optimization: OptimizationResult;

  // 影響分析
  impact: AllocationImpact;

  // 承認情報
  approval?: {
    requiredApprovers: string[]; // 承認者IDリスト
    approvalDeadline: Date;      // 承認期限
    approvalUrl: string;         // 承認画面URL
  };

  // メタデータ
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

interface AllocationStatus {
  DRAFT: 'DRAFT';                // 下書き
  PENDING: 'PENDING';            // 承認待ち
  APPROVED: 'APPROVED';          // 承認済み
  REJECTED: 'REJECTED';          // 却下
  ACTIVE: 'ACTIVE';              // 稼働中
  COMPLETED: 'COMPLETED';        // 完了
}

interface ResourceAllocation {
  resourceId: string;
  projectId: string;
  allocationPercentage: number;
  startDate: Date;
  endDate: Date;
  costRate: number;              // 時間単価
  totalCost: number;             // 総コスト
  totalHours: number;            // 総工数 (時間)
}

interface OptimizationResult {
  score: number;                 // 最適化スコア (0-100)
  skillMatchScore: number;       // スキルマッチ度 (0-100)
  costEfficiency: number;        // コスト効率 (0-100)
  utilizationRate: number;       // 稼働率 (0-100)
  recommendations: string[];     // 推奨事項
}

interface AllocationImpact {
  // リソースへの影響
  resourceUtilization: {
    before: number;              // 配分前稼働率
    after: number;               // 配分後稼働率
    delta: number;               // 変化量
  };

  // プロジェクトへの影響
  projectImpact: {
    skillGapFilled: number;      // スキルギャップ充足率
    capacityUtilization: number; // キャパシティ利用率
    estimatedDeliveryImpact: string; // 納期への影響
  };

  // コストへの影響
  costImpact: {
    monthlyCost: number;         // 月次コスト
    totalCost: number;           // 総コスト
    budgetImpact: number;        // 予算への影響 (%)
  };
}
```

### レスポンス例

```json
{
  "allocationId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "PENDING",
  "allocation": {
    "resourceId": "123e4567-e89b-12d3-a456-426614174000",
    "projectId": "789e0123-e45b-67c8-d901-234567890abc",
    "allocationPercentage": 0.5,
    "startDate": "2025-11-05T00:00:00Z",
    "endDate": "2026-03-31T23:59:59Z",
    "costRate": 15000,
    "totalCost": 5400000,
    "totalHours": 720
  },
  "optimization": {
    "score": 87,
    "skillMatchScore": 92,
    "costEfficiency": 85,
    "utilizationRate": 75,
    "recommendations": [
      "スキルマッチ度が高く、最適な配分です",
      "稼働率が目標範囲内（70-80%）に収まっています"
    ]
  },
  "impact": {
    "resourceUtilization": {
      "before": 0.45,
      "after": 0.75,
      "delta": 0.30
    },
    "projectImpact": {
      "skillGapFilled": 0.85,
      "capacityUtilization": 0.72,
      "estimatedDeliveryImpact": "納期への影響なし"
    },
    "costImpact": {
      "monthlyCost": 1125000,
      "totalCost": 5400000,
      "budgetImpact": 12.5
    }
  },
  "approval": {
    "requiredApprovers": ["pm-001", "finance-manager-001"],
    "approvalDeadline": "2025-11-10T23:59:59Z",
    "approvalUrl": "/approvals/allocations/550e8400-e29b-41d4-a716-446655440000"
  },
  "createdAt": "2025-11-04T10:30:00Z",
  "createdBy": "user-001",
  "updatedAt": "2025-11-04T10:30:00Z"
}
```

---

## 🛠️ 実装ガイダンス

### 1. リソース配分最適化アルゴリズム

BC-005では線形計画法（Linear Programming）を使用してリソース配分を最適化します。

#### 最適化問題の定式化

```typescript
/**
 * リソース配分最適化
 * Google OR-Tools を使用した線形計画法による最適化
 */
class ResourceAllocationOptimizer {
  /**
   * 最適なリソース配分を計算
   */
  async optimizeAllocation(
    projectDemands: ProjectDemand[],
    availableResources: Resource[]
  ): Promise<AllocationPlan> {
    // 1. 最適化モデルの構築
    const solver = new LinearProgrammingSolver();

    // 2. 決定変数の定義
    // x[i][j] = リソースiをプロジェクトjに配分する割合 (0.0-2.0)
    const variables = this.defineVariables(availableResources, projectDemands);

    // 3. 目的関数の設定（最大化）
    // maximize: Σ(skill_match[i][j] * x[i][j]) - Σ(cost[i] * x[i][j])
    const objective = this.defineObjective(variables, availableResources, projectDemands);
    solver.setObjective(objective, 'MAXIMIZE');

    // 4. 制約条件の追加
    this.addConstraints(solver, variables, availableResources, projectDemands);

    // 5. 最適解の計算
    const solution = await solver.solve();

    // 6. 結果の構築
    return this.buildAllocationPlan(solution, availableResources, projectDemands);
  }

  /**
   * 制約条件の追加
   */
  private addConstraints(
    solver: Solver,
    variables: Variable[][],
    resources: Resource[],
    demands: ProjectDemand[]
  ): void {
    // 制約1: リソースの配分合計は200%以下
    resources.forEach((resource, i) => {
      const allocationSum = demands.map((_, j) => variables[i][j]).reduce((a, b) => a + b);
      solver.addConstraint(allocationSum <= 2.0, `resource_${i}_capacity`);
    });

    // 制約2: プロジェクトの最小リソース要件を満たす
    demands.forEach((demand, j) => {
      const assignedResources = resources.map((_, i) => variables[i][j]).reduce((a, b) => a + b);
      solver.addConstraint(assignedResources >= demand.minimumResources, `project_${j}_minimum`);
    });

    // 制約3: スキル要件を満たすリソースのみ配分可能
    resources.forEach((resource, i) => {
      demands.forEach((demand, j) => {
        if (!this.meetsSkillRequirements(resource, demand)) {
          solver.addConstraint(variables[i][j] == 0, `skill_mismatch_${i}_${j}`);
        }
      });
    });

    // 制約4: 目標稼働率の範囲内（70-80%）
    resources.forEach((resource, i) => {
      const utilizationTarget = 0.75; // 75%を目標
      const tolerance = 0.05;          // ±5%の許容範囲
      const allocationSum = demands.map((_, j) => variables[i][j]).reduce((a, b) => a + b);

      solver.addConstraint(
        allocationSum >= utilizationTarget - tolerance,
        `utilization_min_${i}`
      );
      solver.addConstraint(
        allocationSum <= utilizationTarget + tolerance,
        `utilization_max_${i}`
      );
    });
  }
}
```

### 2. スキルマッチングアルゴリズム

```typescript
/**
 * スキルマッチ度計算
 * コサイン類似度を使用したスキルマッチング
 */
class SkillMatcher {
  /**
   * リソースとプロジェクトのスキルマッチ度を計算
   * @returns 0.0-1.0 の範囲でマッチ度を返す
   */
  calculateSkillMatch(
    resourceSkills: TalentSkill[],
    requiredSkills: SkillRequirement[]
  ): number {
    // スキルベクトルの構築
    const allSkills = this.getAllSkills(resourceSkills, requiredSkills);
    const resourceVector = this.buildSkillVector(resourceSkills, allSkills);
    const requirementVector = this.buildRequirementVector(requiredSkills, allSkills);

    // コサイン類似度の計算
    const dotProduct = this.dotProduct(resourceVector, requirementVector);
    const resourceNorm = this.vectorNorm(resourceVector);
    const requirementNorm = this.vectorNorm(requirementVector);

    if (resourceNorm === 0 || requirementNorm === 0) {
      return 0;
    }

    return dotProduct / (resourceNorm * requirementNorm);
  }

  /**
   * スキルベクトルの構築
   */
  private buildSkillVector(skills: TalentSkill[], allSkills: string[]): number[] {
    return allSkills.map(skillId => {
      const skill = skills.find(s => s.skillId === skillId);
      return skill ? skill.level / 5.0 : 0; // レベル1-5を0-1に正規化
    });
  }

  /**
   * 要件ベクトルの構築（重要度を考慮）
   */
  private buildRequirementVector(
    requirements: SkillRequirement[],
    allSkills: string[]
  ): number[] {
    return allSkills.map(skillId => {
      const req = requirements.find(r => r.skillId === skillId);
      if (!req) return 0;

      // 最低レベル要件 × 重要度
      return (req.minimumLevel / 5.0) * req.weight;
    });
  }

  /**
   * 内積計算
   */
  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  /**
   * ベクトルノルム計算
   */
  private vectorNorm(vector: number[]): number {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  }
}
```

### 3. 稼働率計算

```typescript
/**
 * 稼働率計算ユーティリティ
 */
class UtilizationCalculator {
  /**
   * リソースの稼働率を計算
   */
  calculateUtilizationRate(
    resource: Resource,
    period: Period
  ): number {
    // 総稼働時間の取得
    const totalWorkHours = this.getTotalWorkHours(resource, period);

    // 標準稼働時間の計算（営業日 × 8時間）
    const standardWorkHours = this.calculateStandardWorkHours(period);

    // 稼働率 = 総稼働時間 / 標準稼働時間
    return totalWorkHours / standardWorkHours;
  }

  /**
   * 標準稼働時間の計算
   */
  private calculateStandardWorkHours(period: Period): number {
    const workDays = this.getWorkDays(period.startDate, period.endDate);
    const hoursPerDay = 8;
    return workDays * hoursPerDay;
  }

  /**
   * 営業日数の計算（土日祝日を除外）
   */
  private getWorkDays(startDate: Date, endDate: Date): number {
    let workDays = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // 土曜日(6)と日曜日(0)を除外
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // 祝日チェック（日本の祝日カレンダーを使用）
        if (!this.isHoliday(currentDate)) {
          workDays++;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return workDays;
  }

  /**
   * 配分後の予測稼働率計算
   */
  calculateProjectedUtilization(
    currentAllocations: ResourceAllocation[],
    newAllocation: AllocationRequest,
    period: Period
  ): number {
    // 現在の配分率合計
    const currentTotal = currentAllocations
      .filter(a => this.isOverlapping(a, period))
      .reduce((sum, a) => sum + a.allocationPercentage, 0);

    // 新規配分を含めた合計
    return currentTotal + newAllocation.allocationPercentage;
  }
}
```

### 4. BC統合実装

#### BC-001 (Project Delivery) との連携

```typescript
/**
 * プロジェクトリソース配分サービス
 */
class ProjectResourceAllocationService {
  /**
   * プロジェクト要件に基づくリソース配分
   */
  async allocateResourcesForProject(
    projectId: string
  ): Promise<AllocationResponse[]> {
    // 1. BC-001からプロジェクト要件を取得
    const project = await this.projectService.getProject(projectId);
    const skillRequirements = project.skillRequirements;
    const timeline = project.timeline;

    // 2. 利用可能リソースの検索
    const availableResources = await this.resourceRepository.findAvailable(
      timeline.startDate,
      timeline.endDate
    );

    // 3. スキルマッチングによるリソース選定
    const matchedResources = availableResources
      .map(resource => ({
        resource,
        matchScore: this.skillMatcher.calculateSkillMatch(
          resource.skills,
          skillRequirements
        )
      }))
      .filter(r => r.matchScore >= 0.7) // 70%以上のマッチ度
      .sort((a, b) => b.matchScore - a.matchScore);

    // 4. 最適化エンジンによる配分計画
    const allocationPlan = await this.optimizer.optimizeAllocation(
      [{ projectId, skillRequirements, timeline }],
      matchedResources.map(r => r.resource)
    );

    // 5. 配分の実行と承認フロー開始
    const allocations = await Promise.all(
      allocationPlan.allocations.map(allocation =>
        this.executeAllocation(allocation)
      )
    );

    // 6. BC-007 (通知) へイベント送信
    await this.notificationService.sendAllocationNotification(allocations);

    return allocations;
  }
}
```

#### BC-002 (Financial Management) との連携

```typescript
/**
 * コスト計算とBC-002連携
 */
class AllocationCostService {
  /**
   * 配分コストの計算と財務システムへの連携
   */
  async calculateAndRecordCost(
    allocation: ResourceAllocation
  ): Promise<CostImpact> {
    // 1. リソースのコスト単価取得
    const resource = await this.resourceRepository.findById(allocation.resourceId);
    const costRate = resource.costRate; // 時間単価

    // 2. 総工数の計算
    const period = new Period(allocation.startDate, allocation.endDate);
    const standardHours = this.utilizationCalculator.calculateStandardWorkHours(period);
    const allocatedHours = standardHours * allocation.allocationPercentage;

    // 3. 総コストの計算
    const totalCost = allocatedHours * costRate;
    const monthlyCost = totalCost / this.getMonthCount(period);

    // 4. BC-002へコスト情報を登録
    await this.financeService.recordResourceCost({
      resourceId: allocation.resourceId,
      projectId: allocation.projectId,
      costType: 'RESOURCE_ALLOCATION',
      amount: totalCost,
      currency: 'JPY',
      period: period,
      breakdown: {
        hourlyRate: costRate,
        hours: allocatedHours,
        allocationPercentage: allocation.allocationPercentage
      }
    });

    return {
      monthlyCost,
      totalCost,
      budgetImpact: await this.calculateBudgetImpact(allocation.projectId, totalCost)
    };
  }
}
```

#### BC-007 (Communication) との連携

```typescript
/**
 * 配分通知サービス
 */
class AllocationNotificationService {
  /**
   * リソース配分時の通知送信
   */
  async sendAllocationNotifications(
    allocation: ResourceAllocation
  ): Promise<void> {
    const resource = await this.resourceRepository.findById(allocation.resourceId);
    const project = await this.projectService.getProject(allocation.projectId);

    // 1. リソース本人への通知
    await this.notificationService.send({
      recipientId: resource.userId,
      type: 'RESOURCE_ALLOCATED',
      title: `新しいプロジェクトへの配分: ${project.name}`,
      message: `
        プロジェクト「${project.name}」に配分されました。
        期間: ${this.formatDate(allocation.startDate)} - ${this.formatDate(allocation.endDate)}
        配分率: ${allocation.allocationPercentage * 100}%
      `,
      actions: [
        { label: '詳細を確認', url: `/allocations/${allocation.id}` },
        { label: 'カレンダーに追加', url: `/allocations/${allocation.id}/calendar` }
      ]
    });

    // 2. プロジェクトマネージャーへの通知
    await this.notificationService.send({
      recipientId: project.managerId,
      type: 'RESOURCE_ALLOCATION_CONFIRMED',
      title: `リソース配分完了: ${resource.name}`,
      message: `
        ${resource.name}さんをプロジェクトに配分しました。
        スキルマッチ度: ${allocation.skillMatchScore}%
        配分率: ${allocation.allocationPercentage * 100}%
      `
    });

    // 3. 承認者への通知（承認が必要な場合）
    if (allocation.status === 'PENDING') {
      await this.sendApprovalRequest(allocation);
    }
  }
}
```

### 5. データベース操作

```typescript
/**
 * リソース配分リポジトリ
 */
class ResourceAllocationRepository {
  /**
   * 配分の保存（楽観的ロック使用）
   */
  async save(allocation: ResourceAllocation): Promise<void> {
    await this.db.transaction(async (tx) => {
      // 1. 重複チェック
      const existing = await tx.resourceAllocation.findFirst({
        where: {
          resourceId: allocation.resourceId,
          startDate: { lte: allocation.endDate },
          endDate: { gte: allocation.startDate },
          status: { in: ['APPROVED', 'ACTIVE'] }
        }
      });

      if (existing) {
        // 配分率の合計チェック
        const totalAllocation = existing.allocationPercentage + allocation.allocationPercentage;
        if (totalAllocation > 2.0) {
          throw new ExceedAllocationLimitError(
            `Total allocation exceeds 200%: ${totalAllocation * 100}%`
          );
        }
      }

      // 2. 配分の保存
      await tx.resourceAllocation.create({
        data: {
          id: allocation.id,
          resourceId: allocation.resourceId,
          projectId: allocation.projectId,
          allocationPercentage: allocation.allocationPercentage,
          startDate: allocation.startDate,
          endDate: allocation.endDate,
          status: allocation.status,
          createdAt: new Date(),
          createdBy: allocation.createdBy
        }
      });

      // 3. イベント発行
      await this.eventBus.publish(new ResourceAllocatedEvent({
        allocationId: allocation.id,
        resourceId: allocation.resourceId,
        projectId: allocation.projectId,
        timestamp: new Date()
      }));
    });
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

BC-005のエラーコードは以下の形式を使用します：
```
ERR_BC005_L3XXX_OPYYY_ZZZ
```

- `BC005`: Business Capability 005 (Team & Resource Optimization)
- `L3XXX`: Level 3 Capability番号 (001-004)
- `OPYYY`: Operation番号 (001-006)
- `ZZZ`: 個別エラー番号 (001-999)

### エラーコード定義

| エラーコード | エラー名 | 説明 | HTTPステータス | 対処方法 |
|-------------|---------|------|---------------|---------|
| ERR_BC005_L3001_OP001_001 | INVALID_RESOURCE_ID | 無効なリソースID | 400 | 正しいUUID形式のリソースIDを指定 |
| ERR_BC005_L3001_OP001_002 | INVALID_PROJECT_ID | 無効なプロジェクトID | 400 | 正しいUUID形式のプロジェクトIDを指定 |
| ERR_BC005_L3001_OP001_003 | INVALID_ALLOCATION_PERCENTAGE | 配分率が範囲外 | 400 | 0.0-2.0の範囲で配分率を指定 |
| ERR_BC005_L3001_OP001_004 | INVALID_START_DATE | 無効な開始日 | 400 | ISO 8601形式で未来の日付を指定 |
| ERR_BC005_L3001_OP001_005 | INVALID_DATE_RANGE | 無効な期間 | 400 | 終了日を開始日より後に設定 |
| ERR_BC005_L3001_OP001_006 | TOO_MANY_SKILL_REQUIREMENTS | スキル要件が多すぎる | 400 | スキル要件を20件以下に制限 |
| ERR_BC005_L3001_OP001_101 | RESOURCE_NOT_FOUND | リソースが見つからない | 404 | 存在するリソースIDを指定 |
| ERR_BC005_L3001_OP001_102 | PROJECT_NOT_FOUND | プロジェクトが見つからない | 404 | 存在するプロジェクトIDを指定 |
| ERR_BC005_L3001_OP001_201 | RESOURCE_NOT_AVAILABLE | リソースが利用不可 | 409 | 別のリソースを選択または期間を変更 |
| ERR_BC005_L3001_OP001_202 | EXCEED_ALLOCATION_LIMIT | 配分率上限超過 | 409 | 他の配分を調整または配分率を削減 |
| ERR_BC005_L3001_OP001_203 | SKILL_MISMATCH | スキル要件不一致 | 409 | スキル要件を満たすリソースを選択 |
| ERR_BC005_L3001_OP001_204 | OVERLAPPING_ALLOCATION | 配分期間の重複 | 409 | 期間を調整または既存配分を変更 |
| ERR_BC005_L3001_OP001_301 | OPTIMIZATION_FAILED | 最適化失敗 | 500 | 制約条件を緩和して再試行 |
| ERR_BC005_L3001_OP001_302 | DATABASE_ERROR | データベースエラー | 500 | システム管理者に連絡 |
| ERR_BC005_L3001_OP001_401 | APPROVAL_REQUIRED | 承認が必要 | 403 | 承認者に承認を依頼 |
| ERR_BC005_L3001_OP001_402 | INSUFFICIENT_PERMISSION | 権限不足 | 403 | PM権限以上が必要 |

### エラーレスポンス形式

```typescript
interface ErrorResponse {
  error: {
    code: string;              // エラーコード
    message: string;           // エラーメッセージ
    details?: string;          // 詳細情報
    field?: string;            // エラーが発生したフィールド
    suggestion?: string;       // 推奨される対処方法
  };
  timestamp: string;           // エラー発生日時
  requestId: string;           // リクエストID（トレーシング用）
}
```

### エラーハンドリング実装例

```typescript
class AllocationService {
  async allocateResource(request: AllocationRequest): Promise<AllocationResponse> {
    try {
      // 1. 入力バリデーション
      this.validateRequest(request);

      // 2. リソース存在確認
      const resource = await this.resourceRepository.findById(request.resourceId);
      if (!resource) {
        throw new ResourceNotFoundError(
          'ERR_BC005_L3001_OP001_101',
          `Resource not found: ${request.resourceId}`
        );
      }

      // 3. 配分率チェック
      const currentAllocation = await this.calculateCurrentAllocation(
        request.resourceId,
        request.startDate,
        request.endDate
      );

      if (currentAllocation + request.allocationPercentage > 2.0) {
        throw new ExceedAllocationLimitError(
          'ERR_BC005_L3001_OP001_202',
          `Total allocation would exceed 200%: ${(currentAllocation + request.allocationPercentage) * 100}%`,
          {
            currentAllocation,
            requestedAllocation: request.allocationPercentage,
            totalAllocation: currentAllocation + request.allocationPercentage,
            suggestion: '他の配分を調整するか、配分率を削減してください'
          }
        );
      }

      // 4. スキルマッチ確認
      if (request.requiredSkills && request.requiredSkills.length > 0) {
        const matchScore = this.skillMatcher.calculateSkillMatch(
          resource.skills,
          request.requiredSkills
        );

        if (matchScore < 0.5) { // 50%未満のマッチ度
          throw new SkillMismatchError(
            'ERR_BC005_L3001_OP001_203',
            'Resource skills do not meet minimum requirements',
            {
              matchScore,
              requiredSkills: request.requiredSkills,
              resourceSkills: resource.skills,
              suggestion: 'より適切なスキルを持つリソースを選択してください'
            }
          );
        }
      }

      // 5. 配分の実行
      return await this.executeAllocation(request, resource);

    } catch (error) {
      // エラーログ記録
      this.logger.error('Allocation failed', {
        error,
        request,
        timestamp: new Date()
      });

      // カスタムエラーの場合はそのまま再スロー
      if (error instanceof AllocationError) {
        throw error;
      }

      // 予期しないエラーの場合は汎用エラーに変換
      throw new DatabaseError(
        'ERR_BC005_L3001_OP001_302',
        'An unexpected error occurred during allocation',
        { originalError: error.message }
      );
    }
  }
}
```

### リトライロジック

```typescript
class AllocationRetryPolicy {
  /**
   * エラー種別に応じたリトライ戦略
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2
    } = options;

    let lastError: Error;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // リトライ不可能なエラーの場合は即座に失敗
        if (!this.isRetryable(error)) {
          throw error;
        }

        // 最大リトライ回数に達した場合
        if (attempt === maxRetries) {
          break;
        }

        // バックオフ待機
        await this.sleep(delay);
        delay = Math.min(delay * backoffMultiplier, maxDelay);

        this.logger.warn(`Retrying allocation (attempt ${attempt + 1}/${maxRetries})`, {
          error: lastError.message,
          delay
        });
      }
    }

    throw lastError;
  }

  /**
   * リトライ可能なエラーかどうかを判定
   */
  private isRetryable(error: Error): boolean {
    if (error instanceof DatabaseError) return true;
    if (error instanceof OptimizationFailedError) return true;
    if (error instanceof ResourceNotAvailableError) return false; // 即座に失敗
    if (error instanceof SkillMismatchError) return false; // 即座に失敗
    return false;
  }
}
```

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
