# OP-003: リソース稼働率を最適化する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization

---

## 📋 How: この操作の定義

### 操作の概要
リソースの稼働率を分析し、最適化を実現する。適切な稼働率管理により、生産性向上とバーンアウト防止のバランスを実現する。

### 実現する機能
- リソース稼働率の分析
- 稼働率の最適化提案
- 過負荷・低稼働の検知
- 稼働率レポートの生成

### 入力
- 工数実績データ
- プロジェクト配分データ
- 目標稼働率
- 分析期間

### 出力
- 稼働率分析レポート
- 最適化提案
- 過負荷・低稼働アラート
- リバランス計画

---

## 📥 入力パラメータ

### 必須パラメータ

#### 工数実績データ
```typescript
interface UtilizationInput {
  resourceId: UUID           // リソースID
  period: {
    startDate: DATE         // 分析開始日
    endDate: DATE           // 分析終了日
    granularity: 'daily' | 'weekly' | 'monthly'  // 集計粒度
  }
  timeEntries: TimeEntry[]  // 工数実績
  targetUtilization: {
    min: PERCENTAGE         // 最小目標稼働率（例: 70%）
    max: PERCENTAGE         // 最大目標稼働率（例: 90%）
    optimal: PERCENTAGE     // 最適稼働率（例: 80%）
  }
}

interface TimeEntry {
  resourceId: UUID
  projectId: UUID
  taskId: UUID
  date: DATE
  hours: DECIMAL
  isBillable: BOOLEAN
  status: 'draft' | 'submitted' | 'approved'
}
```

#### プロジェクト配分データ
```typescript
interface ProjectAllocation {
  resourceId: UUID
  projectId: UUID
  allocatedHours: DECIMAL    // 割当時間/週
  startDate: DATE
  endDate: DATE
  role: STRING_50
  priority: INTEGER          // 1-5（1が最高優先度）
}
```

#### 稼働可能時間
```typescript
interface AvailableCapacity {
  resourceId: UUID
  date: DATE
  availableHours: DECIMAL    // 稼働可能時間（休暇・会議除く）
  workingHours: DECIMAL      // 標準勤務時間
  holidays: DATE[]           // 休日リスト
  plannedLeave: LeaveRecord[] // 予定休暇
}
```

### オプションパラメータ

#### 最適化制約条件
```typescript
interface OptimizationConstraints {
  respectProjectPriority: BOOLEAN      // プロジェクト優先度遵守
  allowReallocation: BOOLEAN           // リソース再配分許可
  maxConsecutiveOverload: INTEGER      // 連続過負荷許容日数
  minRestPeriod: INTEGER               // 最小休息期間（時間）
  skillMatchingWeight: DECIMAL         // スキルマッチング重み（0-1）
  costOptimizationWeight: DECIMAL      // コスト最適化重み（0-1）
}
```

#### ベンチマークデータ
```typescript
interface BenchmarkData {
  industryAverage: PERCENTAGE          // 業界平均稼働率
  organizationAverage: PERCENTAGE      // 組織平均稼働率
  topPerformerThreshold: PERCENTAGE    // トップパフォーマー閾値
  historicalTrend: TrendData[]         // 過去トレンド
}
```

### バリデーションルール

1. **期間バリデーション**
   - `startDate <= endDate`
   - 分析期間は最大365日以内
   - 未来日付の場合は警告表示

2. **稼働率バリデーション**
   - `0 <= min < optimal < max <= 100`
   - `optimal - min >= 5%`（最小マージン）
   - `max - optimal >= 5%`（最小マージン）

3. **工数データバリデーション**
   - 日次工数は0-24時間以内
   - 週次合計工数は標準勤務時間の150%以下
   - 承認済み工数のみを集計対象とする

4. **配分データバリデーション**
   - プロジェクト配分合計 <= 稼働可能時間
   - 重複配分チェック（同一リソース・同一時間帯）
   - スキル要件との整合性確認

---

## 📤 出力仕様

### 主要出力

#### 稼働率分析レポート
```typescript
interface UtilizationAnalysisReport {
  summary: {
    overallUtilization: PERCENTAGE      // 全体稼働率
    billableUtilization: PERCENTAGE     // 課金稼働率
    nonBillableUtilization: PERCENTAGE  // 非課金稼働率
    idealUtilization: PERCENTAGE        // 理想稼働率
    variance: PERCENTAGE                // 目標との乖離
    status: 'optimal' | 'overloaded' | 'underutilized'
  }

  resourceMetrics: ResourceMetric[]     // リソース別指標
  periodMetrics: PeriodMetric[]         // 期間別指標
  projectMetrics: ProjectMetric[]       // プロジェクト別指標

  trends: {
    historicalComparison: TrendData[]   // 過去比較
    forecastedTrend: ForecastData[]     // 予測トレンド
    seasonalPattern: PatternData[]      // 季節パターン
  }

  generatedAt: TIMESTAMP
  reportId: UUID
}

interface ResourceMetric {
  resourceId: UUID
  resourceName: STRING_100
  currentUtilization: PERCENTAGE
  targetUtilization: PERCENTAGE
  variance: PERCENTAGE
  trend: 'improving' | 'declining' | 'stable'
  riskLevel: 'high' | 'medium' | 'low'
  billableHours: DECIMAL
  nonBillableHours: DECIMAL
  totalHours: DECIMAL
}
```

#### 最適化提案
```typescript
interface OptimizationRecommendations {
  proposalId: UUID
  priority: 'critical' | 'high' | 'medium' | 'low'

  reallocationProposals: ReallocationProposal[]
  capacityAdjustments: CapacityAdjustment[]
  workloadBalancing: WorkloadBalance[]

  expectedImpact: {
    utilizationImprovement: PERCENTAGE
    costSaving: MONEY
    productivityGain: PERCENTAGE
    riskReduction: PERCENTAGE
  }

  implementationPlan: {
    steps: ActionStep[]
    estimatedEffort: INTEGER           // 実装工数（時間）
    timeline: INTEGER                  // 実装期間（日）
    dependencies: STRING[]
  }
}

interface ReallocationProposal {
  resourceId: UUID
  fromProject: UUID
  toProject: UUID
  hours: DECIMAL
  rationale: TEXT
  expectedBenefit: TEXT
}
```

#### 過負荷・低稼働アラート
```typescript
interface UtilizationAlerts {
  overloadAlerts: Alert[]
  underutilizationAlerts: Alert[]
  trendAlerts: Alert[]

  summary: {
    criticalCount: INTEGER
    highCount: INTEGER
    mediumCount: INTEGER
    totalAffectedResources: INTEGER
  }
}

interface Alert {
  alertId: UUID
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'overload' | 'underutilized' | 'trend_deterioration'

  resourceId: UUID
  resourceName: STRING_100
  currentValue: PERCENTAGE
  thresholdValue: PERCENTAGE
  variance: PERCENTAGE

  duration: INTEGER                    // アラート持続期間（日）
  trend: 'worsening' | 'improving'

  recommendations: STRING[]
  requiredActions: STRING[]

  detectedAt: TIMESTAMP
  estimatedResolution: DATE
}
```

#### リバランス計画
```typescript
interface RebalancePlan {
  planId: UUID
  planName: STRING_100
  objective: TEXT

  currentState: {
    averageUtilization: PERCENTAGE
    overloadedResources: INTEGER
    underutilizedResources: INTEGER
    imbalanceScore: DECIMAL            // 不均衡スコア（0-100）
  }

  targetState: {
    targetUtilization: PERCENTAGE
    expectedBalance: DECIMAL
    improvementRate: PERCENTAGE
  }

  actions: RebalanceAction[]

  timeline: {
    startDate: DATE
    endDate: DATE
    milestones: Milestone[]
  }

  riskAssessment: {
    risks: Risk[]
    mitigationStrategies: STRING[]
  }

  approvalStatus: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  createdBy: UUID
  createdAt: TIMESTAMP
}

interface RebalanceAction {
  actionId: UUID
  type: 'reallocation' | 'capacity_increase' | 'capacity_decrease' | 'project_delay'
  description: TEXT
  affectedResources: UUID[]
  affectedProjects: UUID[]
  expectedImpact: TEXT
  priority: INTEGER
  scheduledDate: DATE
}
```

### 出力フォーマット

#### JSON レスポンス
```json
{
  "success": true,
  "data": {
    "report": { /* UtilizationAnalysisReport */ },
    "recommendations": { /* OptimizationRecommendations */ },
    "alerts": { /* UtilizationAlerts */ },
    "rebalancePlan": { /* RebalancePlan */ }
  },
  "metadata": {
    "executionTime": 1250,
    "dataPoints": 15420,
    "algorithmsUsed": ["genetic_algorithm", "linear_programming"],
    "confidenceLevel": 0.87
  },
  "timestamp": "2025-11-04T10:30:00Z"
}
```

#### PDF レポート
- エグゼクティブサマリー（1ページ）
- 詳細分析チャート（2-3ページ）
- リソース別詳細表（1-2ページ）
- 推奨アクション（1ページ）

#### CSV エクスポート
- リソース別稼働率データ
- 日次/週次/月次集計
- プロジェクト別配分データ

---

## 🛠️ 実装ガイダンス

### アーキテクチャ概要

```typescript
/**
 * リソース稼働率最適化エンジン
 * 遺伝的アルゴリズムを用いた多目的最適化
 */
class ResourceUtilizationOptimizer {
  private geneticAlgorithm: GeneticAlgorithmEngine
  private linearProgramming: LinearProgrammingSolver
  private constraintValidator: ConstraintValidator
  private trendAnalyzer: TrendAnalyzer

  constructor(
    config: OptimizerConfig,
    constraints: OptimizationConstraints
  ) {
    this.geneticAlgorithm = new GeneticAlgorithmEngine({
      populationSize: config.populationSize || 100,
      mutationRate: config.mutationRate || 0.1,
      crossoverRate: config.crossoverRate || 0.7,
      maxGenerations: config.maxGenerations || 1000,
      convergenceThreshold: config.convergenceThreshold || 0.001
    })

    this.linearProgramming = new LinearProgrammingSolver()
    this.constraintValidator = new ConstraintValidator(constraints)
    this.trendAnalyzer = new TrendAnalyzer()
  }

  async optimize(input: UtilizationInput): Promise<UtilizationAnalysisReport> {
    // 1. データ検証
    await this.validateInput(input)

    // 2. 現状分析
    const currentState = await this.analyzeCurrentState(input)

    // 3. 遺伝的アルゴリズムによる最適化
    const optimizedSolution = await this.runGeneticOptimization(
      currentState,
      input.targetUtilization
    )

    // 4. 線形計画法による制約充足確認
    const feasibleSolution = await this.validateFeasibility(optimizedSolution)

    // 5. レポート生成
    return await this.generateReport(feasibleSolution, currentState)
  }
}
```

### 遺伝的アルゴリズム実装

#### 個体エンコーディング
```typescript
/**
 * 遺伝子型: リソース配分を染色体として表現
 */
interface Chromosome {
  genes: Gene[]              // 遺伝子配列
  fitness: DECIMAL          // 適応度
  generation: INTEGER       // 世代番号
}

interface Gene {
  resourceId: UUID
  projectId: UUID
  allocationPercentage: PERCENTAGE  // 0-100
  timeSlot: TimeSlot
}

class GeneticAlgorithmEngine {
  /**
   * 初期個体群生成
   */
  private generateInitialPopulation(
    resources: Resource[],
    projects: Project[],
    size: INTEGER
  ): Chromosome[] {
    const population: Chromosome[] = []

    for (let i = 0; i < size; i++) {
      const chromosome: Chromosome = {
        genes: this.randomAllocation(resources, projects),
        fitness: 0,
        generation: 0
      }

      // 制約違反の修復
      this.repairChromosome(chromosome)

      // 適応度計算
      chromosome.fitness = this.calculateFitness(chromosome)

      population.push(chromosome)
    }

    return population
  }

  /**
   * 適応度関数（多目的最適化）
   */
  private calculateFitness(chromosome: Chromosome): DECIMAL {
    const weights = {
      utilization: 0.4,      // 稼働率最適化
      balance: 0.3,          // 負荷分散
      skillMatch: 0.2,       // スキルマッチング
      cost: 0.1              // コスト最適化
    }

    const metrics = {
      utilization: this.evaluateUtilization(chromosome),
      balance: this.evaluateBalance(chromosome),
      skillMatch: this.evaluateSkillMatch(chromosome),
      cost: this.evaluateCost(chromosome)
    }

    // 重み付き合計
    return Object.keys(weights).reduce((sum, key) => {
      return sum + weights[key] * metrics[key]
    }, 0)
  }

  /**
   * 選択（トーナメント選択）
   */
  private selection(
    population: Chromosome[],
    tournamentSize: INTEGER = 5
  ): Chromosome {
    const tournament = this.randomSample(population, tournamentSize)
    return tournament.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    )
  }

  /**
   * 交叉（二点交叉）
   */
  private crossover(
    parent1: Chromosome,
    parent2: Chromosome
  ): [Chromosome, Chromosome] {
    const point1 = Math.floor(Math.random() * parent1.genes.length)
    const point2 = Math.floor(Math.random() * parent1.genes.length)
    const [start, end] = [Math.min(point1, point2), Math.max(point1, point2)]

    const child1Genes = [
      ...parent1.genes.slice(0, start),
      ...parent2.genes.slice(start, end),
      ...parent1.genes.slice(end)
    ]

    const child2Genes = [
      ...parent2.genes.slice(0, start),
      ...parent1.genes.slice(start, end),
      ...parent2.genes.slice(end)
    ]

    return [
      { genes: child1Genes, fitness: 0, generation: parent1.generation + 1 },
      { genes: child2Genes, fitness: 0, generation: parent2.generation + 1 }
    ]
  }

  /**
   * 突然変異（ランダム遺伝子変更）
   */
  private mutate(chromosome: Chromosome, rate: DECIMAL): void {
    for (let i = 0; i < chromosome.genes.length; i++) {
      if (Math.random() < rate) {
        // 配分率をランダムに変更（±10%）
        const gene = chromosome.genes[i]
        const delta = (Math.random() - 0.5) * 20  // -10% ~ +10%
        gene.allocationPercentage = Math.max(0, Math.min(100,
          gene.allocationPercentage + delta
        ))
      }
    }

    // 制約違反の修復
    this.repairChromosome(chromosome)
  }

  /**
   * 世代交代（エリート保存戦略）
   */
  private nextGeneration(
    population: Chromosome[],
    eliteSize: INTEGER = 10
  ): Chromosome[] {
    // エリート保存
    const sorted = population.sort((a, b) => b.fitness - a.fitness)
    const nextGen: Chromosome[] = sorted.slice(0, eliteSize)

    // 残りを交叉と突然変異で生成
    while (nextGen.length < population.length) {
      const parent1 = this.selection(population)
      const parent2 = this.selection(population)

      const [child1, child2] = this.crossover(parent1, parent2)

      this.mutate(child1, this.mutationRate)
      this.mutate(child2, this.mutationRate)

      child1.fitness = this.calculateFitness(child1)
      child2.fitness = this.calculateFitness(child2)

      nextGen.push(child1)
      if (nextGen.length < population.length) {
        nextGen.push(child2)
      }
    }

    return nextGen
  }

  /**
   * 最適化実行
   */
  async run(
    resources: Resource[],
    projects: Project[],
    constraints: OptimizationConstraints
  ): Promise<Chromosome> {
    let population = this.generateInitialPopulation(
      resources,
      projects,
      this.populationSize
    )

    let bestFitness = 0
    let generationsWithoutImprovement = 0

    for (let generation = 0; generation < this.maxGenerations; generation++) {
      population = this.nextGeneration(population)

      const currentBest = population[0].fitness

      if (currentBest > bestFitness) {
        bestFitness = currentBest
        generationsWithoutImprovement = 0
      } else {
        generationsWithoutImprovement++
      }

      // 収束判定
      if (generationsWithoutImprovement > 50) {
        console.log(`Converged at generation ${generation}`)
        break
      }

      // 進捗ログ
      if (generation % 100 === 0) {
        console.log(`Generation ${generation}: Best fitness = ${bestFitness}`)
      }
    }

    return population[0]  // 最良解を返す
  }
}
```

### 稼働率分析エンジン

```typescript
class UtilizationAnalyzer {
  /**
   * 現状分析
   */
  async analyzeCurrentState(input: UtilizationInput): Promise<CurrentState> {
    // 1. 基本稼働率計算
    const basicMetrics = this.calculateBasicMetrics(input.timeEntries)

    // 2. トレンド分析
    const trend = await this.analyzeTrend(input.timeEntries, input.period)

    // 3. 異常検知
    const anomalies = this.detectAnomalies(input.timeEntries)

    // 4. ベンチマーク比較
    const comparison = await this.compareToBenchmark(basicMetrics)

    return {
      metrics: basicMetrics,
      trend,
      anomalies,
      benchmarkComparison: comparison
    }
  }

  /**
   * 基本メトリクス計算
   */
  private calculateBasicMetrics(timeEntries: TimeEntry[]): BasicMetrics {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
    const billableHours = timeEntries
      .filter(entry => entry.isBillable)
      .reduce((sum, entry) => sum + entry.hours, 0)

    const workingDays = this.calculateWorkingDays(timeEntries)
    const averageHoursPerDay = totalHours / workingDays

    return {
      totalHours,
      billableHours,
      nonBillableHours: totalHours - billableHours,
      billableUtilization: (billableHours / totalHours) * 100,
      averageHoursPerDay,
      workingDays
    }
  }

  /**
   * 異常検知（統計的手法）
   */
  private detectAnomalies(timeEntries: TimeEntry[]): Anomaly[] {
    const dailyHours = this.aggregateByDay(timeEntries)
    const mean = this.calculateMean(dailyHours)
    const stdDev = this.calculateStdDev(dailyHours, mean)

    const anomalies: Anomaly[] = []

    // 3σ法による異常値検出
    dailyHours.forEach((hours, date) => {
      const zScore = Math.abs((hours - mean) / stdDev)

      if (zScore > 3) {
        anomalies.push({
          date,
          hours,
          expectedHours: mean,
          variance: hours - mean,
          zScore,
          severity: zScore > 4 ? 'critical' : 'high',
          type: hours > mean ? 'overload' : 'underutilized'
        })
      }
    })

    return anomalies
  }
}
```

### 推奨アクション生成

```typescript
class RecommendationEngine {
  /**
   * 最適化推奨生成
   */
  generateRecommendations(
    currentState: CurrentState,
    optimizedSolution: Chromosome,
    constraints: OptimizationConstraints
  ): OptimizationRecommendations {
    // 1. リソース再配分提案
    const reallocationProposals = this.generateReallocationProposals(
      currentState,
      optimizedSolution
    )

    // 2. キャパシティ調整提案
    const capacityAdjustments = this.generateCapacityAdjustments(
      currentState,
      optimizedSolution
    )

    // 3. ワークロードバランシング提案
    const workloadBalancing = this.generateWorkloadBalancing(
      currentState,
      optimizedSolution
    )

    // 4. 影響度評価
    const expectedImpact = this.evaluateImpact(
      currentState,
      optimizedSolution
    )

    // 5. 実装計画策定
    const implementationPlan = this.createImplementationPlan(
      reallocationProposals,
      capacityAdjustments,
      workloadBalancing
    )

    return {
      proposalId: generateUUID(),
      priority: this.determinePriority(expectedImpact),
      reallocationProposals,
      capacityAdjustments,
      workloadBalancing,
      expectedImpact,
      implementationPlan
    }
  }

  /**
   * リソース再配分提案生成
   */
  private generateReallocationProposals(
    currentState: CurrentState,
    optimizedSolution: Chromosome
  ): ReallocationProposal[] {
    const proposals: ReallocationProposal[] = []

    // 現状と最適解の差分を分析
    optimizedSolution.genes.forEach(gene => {
      const currentAllocation = this.findCurrentAllocation(
        currentState,
        gene.resourceId,
        gene.projectId
      )

      const delta = gene.allocationPercentage - currentAllocation

      // 10%以上の変更がある場合のみ提案
      if (Math.abs(delta) >= 10) {
        proposals.push({
          resourceId: gene.resourceId,
          fromProject: currentAllocation > gene.allocationPercentage
            ? gene.projectId
            : null,
          toProject: currentAllocation < gene.allocationPercentage
            ? gene.projectId
            : null,
          hours: this.calculateHoursDelta(delta),
          rationale: this.generateRationale(gene, currentAllocation, delta),
          expectedBenefit: this.describeExpectedBenefit(delta)
        })
      }
    })

    // 優先度でソート
    return proposals.sort((a, b) =>
      this.calculateProposalPriority(b) - this.calculateProposalPriority(a)
    )
  }
}
```

### BC統合ポイント

```typescript
/**
 * BC-001（プロジェクト管理）統合
 */
class ProjectServiceIntegration {
  async getProjectAllocations(resourceId: UUID): Promise<ProjectAllocation[]> {
    const response = await fetch(
      `/api/v1/project-success-service/usecases/get-resource-allocation`,
      {
        method: 'POST',
        body: JSON.stringify({ resourceId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return response.json()
  }

  async getProjectTasks(projectId: UUID): Promise<Task[]> {
    const response = await fetch(
      `/api/v1/project-success-service/usecases/list-tasks`,
      {
        method: 'POST',
        body: JSON.stringify({ projectId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return response.json()
  }
}

/**
 * BC-002（財務管理）統合
 */
class FinanceServiceIntegration {
  async getResourceCosts(resourceId: UUID): Promise<ResourceCost> {
    const response = await fetch(
      `/api/v1/revenue-optimization-service/usecases/get-resource-cost`,
      {
        method: 'POST',
        body: JSON.stringify({ resourceId }),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return response.json()
  }

  async calculateOptimizationROI(
    currentState: CurrentState,
    optimizedState: OptimizedState
  ): Promise<ROIAnalysis> {
    const response = await fetch(
      `/api/v1/revenue-optimization-service/usecases/calculate-roi`,
      {
        method: 'POST',
        body: JSON.stringify({ currentState, optimizedState }),
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return response.json()
  }
}

/**
 * BC-007（通知）統合
 */
class NotificationServiceIntegration {
  async sendUtilizationAlert(alert: Alert): Promise<void> {
    await fetch(
      `/api/v1/collaboration-facilitation-service/usecases/send-notification`,
      {
        method: 'POST',
        body: JSON.stringify({
          recipientId: alert.resourceId,
          type: 'utilization_alert',
          severity: alert.severity,
          title: `稼働率アラート: ${alert.type}`,
          message: this.formatAlertMessage(alert),
          actionUrl: `/utilization/details/${alert.resourceId}`
        }),
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
```

### パフォーマンス最適化

```typescript
/**
 * キャッシュ戦略
 */
class OptimizationCache {
  private cache: Map<string, CachedResult> = new Map()
  private readonly TTL = 3600000  // 1時間

  getCached(key: string): CachedResult | null {
    const cached = this.cache.get(key)

    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached
    }

    this.cache.delete(key)
    return null
  }

  setCached(key: string, result: any): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    })
  }

  generateKey(input: UtilizationInput): string {
    return `${input.resourceId}-${input.period.startDate}-${input.period.endDate}`
  }
}

/**
 * バッチ処理
 */
class BatchOptimizer {
  async optimizeBatch(
    resources: UUID[],
    period: Period
  ): Promise<Map<UUID, UtilizationAnalysisReport>> {
    const results = new Map()

    // 並列処理（最大10並列）
    const chunks = this.chunkArray(resources, 10)

    for (const chunk of chunks) {
      const promises = chunk.map(resourceId =>
        this.optimizer.optimize({
          resourceId,
          period,
          // ... その他のパラメータ
        })
      )

      const chunkResults = await Promise.all(promises)

      chunk.forEach((resourceId, index) => {
        results.set(resourceId, chunkResults[index])
      })
    }

    return results
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラー分類

#### 1. バリデーションエラー（400系）

```typescript
enum ValidationErrorCode {
  INVALID_DATE_RANGE = 'E4001',
  INVALID_UTILIZATION_TARGET = 'E4002',
  INVALID_TIME_ENTRY = 'E4003',
  DUPLICATE_ALLOCATION = 'E4004',
  INSUFFICIENT_DATA = 'E4005'
}

interface ValidationError extends Error {
  code: ValidationErrorCode
  field: string
  value: any
  constraint: string
  message: string
}
```

**対処方法:**
```typescript
try {
  await optimizer.optimize(input)
} catch (error) {
  if (error instanceof ValidationError) {
    switch (error.code) {
      case ValidationErrorCode.INVALID_DATE_RANGE:
        return {
          success: false,
          error: {
            code: error.code,
            message: '無効な日付範囲です',
            details: `開始日（${input.period.startDate}）は終了日（${input.period.endDate}）より前である必要があります`,
            suggestion: '日付範囲を確認してください'
          }
        }

      case ValidationErrorCode.INSUFFICIENT_DATA:
        return {
          success: false,
          error: {
            code: error.code,
            message: '工数データが不足しています',
            details: `最低${MINIMUM_DATA_POINTS}件のデータが必要ですが、${input.timeEntries.length}件しかありません`,
            suggestion: '分析期間を延長するか、データ入力を促してください'
          }
        }

      default:
        throw error
    }
  }
}
```

#### 2. ビジネスルール違反（422）

```typescript
enum BusinessRuleErrorCode {
  OVERALLOCATION_DETECTED = 'E4221',
  SKILL_MISMATCH = 'E4222',
  PROJECT_CONFLICT = 'E4223',
  CAPACITY_EXCEEDED = 'E4224'
}

interface BusinessRuleError extends Error {
  code: BusinessRuleErrorCode
  resourceId: UUID
  conflictingProjects: UUID[]
  suggestedAction: string
}
```

**対処方法:**
```typescript
class ConstraintValidator {
  validate(chromosome: Chromosome): ValidationResult {
    const errors: BusinessRuleError[] = []

    // オーバーアロケーションチェック
    const overallocations = this.checkOverallocation(chromosome)
    if (overallocations.length > 0) {
      errors.push({
        code: BusinessRuleErrorCode.OVERALLOCATION_DETECTED,
        resourceId: overallocations[0].resourceId,
        conflictingProjects: overallocations[0].projects,
        suggestedAction: 'プロジェクト配分を調整してください',
        message: `リソース ${overallocations[0].resourceName} が過剰配分されています（${overallocations[0].totalAllocation}%）`
      })
    }

    // スキルマッチングチェック
    const mismatches = this.checkSkillMatch(chromosome)
    if (mismatches.length > 0) {
      errors.push({
        code: BusinessRuleErrorCode.SKILL_MISMATCH,
        resourceId: mismatches[0].resourceId,
        conflictingProjects: [mismatches[0].projectId],
        suggestedAction: '適切なスキルを持つリソースに再配分してください',
        message: `必要スキル（${mismatches[0].requiredSkills.join(', ')}）が不足しています`
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
```

#### 3. 最適化失敗（500系）

```typescript
enum OptimizationErrorCode {
  CONVERGENCE_FAILURE = 'E5001',
  INFEASIBLE_SOLUTION = 'E5002',
  TIMEOUT = 'E5003',
  ALGORITHM_ERROR = 'E5004'
}

interface OptimizationError extends Error {
  code: OptimizationErrorCode
  generation: INTEGER
  bestFitness: DECIMAL
  executionTime: INTEGER
}
```

**対処方法:**
```typescript
class GeneticAlgorithmEngine {
  async run(...): Promise<Chromosome> {
    try {
      const startTime = Date.now()
      let population = this.generateInitialPopulation(...)

      for (let generation = 0; generation < this.maxGenerations; generation++) {
        // タイムアウトチェック
        if (Date.now() - startTime > this.timeout) {
          throw new OptimizationError({
            code: OptimizationErrorCode.TIMEOUT,
            message: '最適化がタイムアウトしました',
            generation,
            bestFitness: population[0].fitness,
            executionTime: Date.now() - startTime
          })
        }

        population = this.nextGeneration(population)

        // 収束チェック
        if (this.hasConverged(population)) {
          break
        }
      }

      // 実行可能解チェック
      const bestSolution = population[0]
      if (!this.isFeasible(bestSolution)) {
        throw new OptimizationError({
          code: OptimizationErrorCode.INFEASIBLE_SOLUTION,
          message: '実行可能な解が見つかりませんでした',
          generation: this.maxGenerations,
          bestFitness: bestSolution.fitness,
          executionTime: Date.now() - startTime
        })
      }

      return bestSolution

    } catch (error) {
      if (error instanceof OptimizationError) {
        // 部分解を返す
        return this.getBestPartialSolution(error)
      }
      throw error
    }
  }

  /**
   * 部分解取得（最適化失敗時のフォールバック）
   */
  private getBestPartialSolution(error: OptimizationError): Chromosome {
    console.warn(`Optimization failed: ${error.message}`)
    console.warn(`Returning best partial solution (fitness: ${error.bestFitness})`)

    // 現状維持の解を生成
    return this.generateCurrentStateChromosome()
  }
}
```

#### 4. データ整合性エラー

```typescript
enum DataIntegrityErrorCode {
  MISSING_RESOURCE_DATA = 'E5101',
  MISSING_PROJECT_DATA = 'E5102',
  INCONSISTENT_TIME_ENTRIES = 'E5103',
  STALE_DATA = 'E5104'
}
```

**対処方法:**
```typescript
class DataIntegrityChecker {
  async checkIntegrity(input: UtilizationInput): Promise<IntegrityReport> {
    const issues: DataIntegrityIssue[] = []

    // リソースデータ存在確認
    for (const resourceId of this.extractResourceIds(input)) {
      const exists = await this.resourceService.exists(resourceId)
      if (!exists) {
        issues.push({
          severity: 'critical',
          code: DataIntegrityErrorCode.MISSING_RESOURCE_DATA,
          message: `リソース ${resourceId} が見つかりません`,
          affectedEntities: [resourceId],
          suggestedAction: 'リソースマスタを確認してください'
        })
      }
    }

    // 工数データ整合性チェック
    const inconsistencies = this.checkTimeEntryConsistency(input.timeEntries)
    if (inconsistencies.length > 0) {
      issues.push({
        severity: 'high',
        code: DataIntegrityErrorCode.INCONSISTENT_TIME_ENTRIES,
        message: '工数データに不整合があります',
        affectedEntities: inconsistencies.map(i => i.entryId),
        suggestedAction: '工数データを再確認してください',
        details: inconsistencies
      })
    }

    // データ鮮度チェック
    const staleness = this.checkDataStaleness(input.timeEntries)
    if (staleness.isStale) {
      issues.push({
        severity: 'medium',
        code: DataIntegrityErrorCode.STALE_DATA,
        message: `データが古くなっています（最終更新: ${staleness.lastUpdate}）`,
        affectedEntities: [],
        suggestedAction: '最新データを再取得してください'
      })
    }

    return {
      isHealthy: issues.filter(i => i.severity === 'critical').length === 0,
      issues,
      checkedAt: new Date()
    }
  }
}
```

### リトライ戦略

```typescript
class RetryManager {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3
    const baseDelay = options.baseDelay || 1000
    const maxDelay = options.maxDelay || 10000

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation()

      } catch (error) {
        // 最後の試行で失敗した場合はエラーをスロー
        if (attempt === maxRetries) {
          throw error
        }

        // リトライ可能なエラーかチェック
        if (!this.isRetryable(error)) {
          throw error
        }

        // エクスポネンシャルバックオフ
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)

        console.warn(
          `Operation failed (attempt ${attempt + 1}/${maxRetries}). ` +
          `Retrying in ${delay}ms...`,
          error
        )

        await this.sleep(delay)
      }
    }

    throw new Error('Unexpected: All retries exhausted')
  }

  private isRetryable(error: any): boolean {
    // タイムアウト、ネットワークエラーはリトライ可
    if (error instanceof OptimizationError) {
      return error.code === OptimizationErrorCode.TIMEOUT
    }

    // バリデーションエラー、ビジネスルール違反はリトライ不可
    if (error instanceof ValidationError || error instanceof BusinessRuleError) {
      return false
    }

    return true
  }
}
```

### ロギング・監視

```typescript
class OptimizationLogger {
  logOptimizationStart(input: UtilizationInput): void {
    logger.info('Optimization started', {
      resourceId: input.resourceId,
      period: input.period,
      targetUtilization: input.targetUtilization,
      timestamp: new Date().toISOString()
    })
  }

  logOptimizationProgress(generation: INTEGER, fitness: DECIMAL): void {
    if (generation % 100 === 0) {
      logger.debug('Optimization progress', {
        generation,
        fitness,
        timestamp: new Date().toISOString()
      })
    }
  }

  logOptimizationComplete(result: UtilizationAnalysisReport, executionTime: INTEGER): void {
    logger.info('Optimization completed', {
      reportId: result.reportId,
      overallUtilization: result.summary.overallUtilization,
      status: result.summary.status,
      executionTime,
      timestamp: new Date().toISOString()
    })
  }

  logOptimizationError(error: Error, context: any): void {
    logger.error('Optimization failed', {
      error: error.message,
      code: (error as any).code,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }
}
```

### アラート通知

```typescript
class AlertManager {
  async notifyOnCriticalError(error: Error, context: any): Promise<void> {
    // クリティカルエラーの場合は即座に通知
    if (this.isCritical(error)) {
      await this.notificationService.sendImmediate({
        recipientIds: await this.getAdminIds(),
        type: 'critical_error',
        title: '稼働率最適化エラー',
        message: `${error.message}\n\nContext: ${JSON.stringify(context, null, 2)}`,
        actionUrl: `/admin/errors/${context.requestId}`
      })
    }
  }

  async notifyOnDataQualityIssue(issues: DataIntegrityIssue[]): Promise<void> {
    const criticalIssues = issues.filter(i => i.severity === 'critical')

    if (criticalIssues.length > 0) {
      await this.notificationService.sendImmediate({
        recipientIds: await this.getDataAdminIds(),
        type: 'data_quality_alert',
        title: 'データ品質問題検出',
        message: `${criticalIssues.length}件のクリティカルな問題が検出されました`,
        actionUrl: '/admin/data-quality'
      })
    }
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
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
