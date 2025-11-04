# OP-002: リソース需要を予測する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand

---

## 📋 How: この操作の定義

### 操作の概要
将来のリソース需要を予測し、計画的な人材確保を支援する。パイプライン案件と既存プロジェクトの分析により、適切なリソース計画を実現する。

### 実現する機能
- 将来のリソース需要予測
- パイプライン案件の分析
- スキル別需要予測
- リソース不足の早期警告

### 入力
- パイプライン案件情報
- 既存プロジェクト計画
- 過去のリソース使用実績
- 事業計画

### 出力
- リソース需要予測レポート
- スキル別需要予測
- リソース不足警告
- 採用・育成計画への示唆

---

## 📥 入力パラメータ

### ForecastRequest インターフェース

```typescript
interface ForecastRequest {
  // 予測期間
  forecastPeriod: ForecastPeriod;
  startDate: Date;              // 予測開始日
  endDate: Date;                // 予測終了日

  // 分析対象
  targetScope: ForecastScope;   // ORGANIZATION | DEPARTMENT | SKILL | ROLE
  targetIds?: string[];         // 対象ID配列（組織、部門、スキル等）

  // パイプライン案件
  pipelineProjects?: PipelineProject[];

  // 予測モデル設定
  modelConfig: {
    algorithm: ForecastAlgorithm;  // PROPHET | ARIMA | LINEAR_REGRESSION | ENSEMBLE
    confidenceLevel: number;        // 信頼区間 (0.80-0.99)
    seasonality?: SeasonalityConfig;
    holidays?: Date[];              // 休日・営業日調整
  };

  // オプション設定
  options?: {
    includeHistorical?: boolean;   // 過去実績を含める
    includePipeline?: boolean;      // パイプライン案件を含める
    skillBreakdown?: boolean;       // スキル別分析
    costEstimation?: boolean;       // コスト推定を含める
  };
}

interface ForecastPeriod {
  MONTH: 'MONTH';           // 月次予測
  QUARTER: 'QUARTER';       // 四半期予測
  YEAR: 'YEAR';             // 年次予測
  CUSTOM: 'CUSTOM';         // カスタム期間
}

interface ForecastScope {
  ORGANIZATION: 'ORGANIZATION';
  DEPARTMENT: 'DEPARTMENT';
  SKILL: 'SKILL';
  ROLE: 'ROLE';
}

interface ForecastAlgorithm {
  PROPHET: 'PROPHET';              // Facebook Prophet
  ARIMA: 'ARIMA';                  // ARIMA統計モデル
  LINEAR_REGRESSION: 'LINEAR_REGRESSION';
  ENSEMBLE: 'ENSEMBLE';            // アンサンブル学習
}

interface PipelineProject {
  id: string;
  name: string;
  probability: number;             // 受注確度 (0.0-1.0)
  estimatedStartDate: Date;
  estimatedDuration: number;       // 想定期間（月）
  requiredSkills: SkillRequirement[];
  estimatedTeamSize: number;
}

interface SeasonalityConfig {
  yearly: boolean;                 // 年次季節性
  quarterly: boolean;              // 四半期季節性
  monthly: boolean;                // 月次季節性
  weekly: boolean;                 // 週次季節性
}
```

### バリデーションルール

| パラメータ | 必須 | 検証ルール | エラーコード |
|-----------|------|-----------|-------------|
| forecastPeriod | ○ | ENUM値 | ERR_BC005_L3001_OP002_001 |
| startDate | ○ | ISO 8601形式、未来日付 | ERR_BC005_L3001_OP002_002 |
| endDate | ○ | startDate < endDate、最大2年 | ERR_BC005_L3001_OP002_003 |
| targetScope | ○ | ENUM値 | ERR_BC005_L3001_OP002_004 |
| algorithm | ○ | ENUM値 | ERR_BC005_L3001_OP002_005 |
| confidenceLevel | ○ | 0.80 ≤ value ≤ 0.99 | ERR_BC005_L3001_OP002_006 |
| pipelineProjects | × | 配列形式、最大50件 | ERR_BC005_L3001_OP002_007 |
| probability | ○(if pipeline) | 0.0 ≤ value ≤ 1.0 | ERR_BC005_L3001_OP002_008 |

---

## 📤 出力仕様

### ForecastResponse インターフェース

```typescript
interface ForecastResponse {
  // 予測結果ID
  forecastId: string;           // 予測結果ID (UUID)
  generatedAt: Date;            // 生成日時

  // 予測概要
  summary: ForecastSummary;

  // 期間別予測
  periodForecasts: PeriodForecast[];

  // スキル別予測
  skillForecasts: SkillForecast[];

  // パイプライン影響分析
  pipelineImpact?: PipelineImpactAnalysis;

  // リスク分析
  riskAnalysis: ResourceRiskAnalysis;

  // 推奨アクション
  recommendations: ForecastRecommendation[];

  // メタデータ
  metadata: {
    algorithm: string;
    confidenceLevel: number;
    dataPoints: number;         // 使用データポイント数
    accuracy: number;           // 予測精度 (0-100)
  };
}

interface ForecastSummary {
  totalDemand: {
    current: number;            // 現在の需要（FTE）
    forecasted: number;         // 予測需要（FTE）
    change: number;             // 変化量（FTE）
    changePercentage: number;   // 変化率（%）
  };

  skillGaps: {
    critical: number;           // 深刻なギャップ数
    moderate: number;           // 中程度のギャップ数
    minor: number;              // 軽微なギャップ数
  };

  costImpact: {
    currentCost: number;        // 現在のコスト
    forecastedCost: number;     // 予測コスト
    additionalCost: number;     // 追加コスト
  };
}

interface PeriodForecast {
  period: string;               // 期間（YYYY-MM）
  startDate: Date;
  endDate: Date;

  demand: {
    expected: number;           // 期待値（FTE）
    lowerBound: number;         // 下限（FTE）
    upperBound: number;         // 上限（FTE）
    confidence: number;         // 信頼度（%）
  };

  supply: {
    available: number;          // 利用可能（FTE）
    allocated: number;          // 配分済み（FTE）
    unallocated: number;        // 未配分（FTE）
  };

  gap: {
    shortage: number;           // 不足量（FTE）
    surplus: number;            // 余剰量（FTE）
    utilizationRate: number;    // 稼働率（%）
  };
}

interface SkillForecast {
  skillId: string;
  skillName: string;
  skillLevel: number;           // 必要レベル (1-5)

  demand: {
    current: number;            // 現在の需要（人）
    forecasted: number;         // 予測需要（人）
    gap: number;                // ギャップ（人）
  };

  supply: {
    available: number;          // 利用可能（人）
    developing: number;         // 育成中（人）
    shortage: number;           // 不足（人）
  };

  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface PipelineImpactAnalysis {
  totalProjects: number;
  weightedDemand: number;       // 確度加重需要（FTE）

  projectBreakdown: {
    projectId: string;
    projectName: string;
    probability: number;
    demandImpact: number;       // 需要への影響（FTE）
    skillRequirements: SkillRequirement[];
  }[];

  scenarioAnalysis: {
    bestCase: number;           // 最良シナリオ（全案件受注）
    expectedCase: number;       // 期待シナリオ（確度加重）
    worstCase: number;          // 最悪シナリオ（全案件失注）
  };
}

interface ResourceRiskAnalysis {
  overallRisk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  risks: {
    riskType: string;           // リスク種別
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    probability: number;        // 発生確率 (0-100)
    impact: string;             // 影響説明
    mitigation: string;         // 対策案
  }[];

  criticalPeriods: {
    period: string;
    riskLevel: string;
    description: string;
  }[];
}

interface ForecastRecommendation {
  id: string;
  category: 'HIRING' | 'TRAINING' | 'ALLOCATION' | 'CONTRACT' | 'PIPELINE';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

  title: string;
  description: string;

  estimatedImpact: {
    demandReduction?: number;   // 需要削減量（FTE）
    costSaving?: number;        // コスト削減額
    timeframe: string;          // 実施期間
  };

  actions: string[];            // 具体的アクション
}
```

### レスポンス例

```json
{
  "forecastId": "fc-550e8400-e29b-41d4-a716-446655440000",
  "generatedAt": "2025-11-04T10:30:00Z",
  "summary": {
    "totalDemand": {
      "current": 45.5,
      "forecasted": 58.2,
      "change": 12.7,
      "changePercentage": 27.9
    },
    "skillGaps": {
      "critical": 3,
      "moderate": 5,
      "minor": 2
    },
    "costImpact": {
      "currentCost": 68250000,
      "forecastedCost": 87300000,
      "additionalCost": 19050000
    }
  },
  "periodForecasts": [
    {
      "period": "2025-11",
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-11-30T23:59:59Z",
      "demand": {
        "expected": 48.5,
        "lowerBound": 45.2,
        "upperBound": 51.8,
        "confidence": 95
      },
      "supply": {
        "available": 50.0,
        "allocated": 45.5,
        "unallocated": 4.5
      },
      "gap": {
        "shortage": 0,
        "surplus": 1.5,
        "utilizationRate": 97.0
      }
    }
  ],
  "skillForecasts": [
    {
      "skillId": "skill-python-001",
      "skillName": "Python (Advanced)",
      "skillLevel": 4,
      "demand": {
        "current": 8,
        "forecasted": 12,
        "gap": 4
      },
      "supply": {
        "available": 6,
        "developing": 2,
        "shortage": 4
      },
      "priority": "CRITICAL"
    }
  ],
  "riskAnalysis": {
    "overallRisk": "HIGH",
    "risks": [
      {
        "riskType": "SKILL_SHORTAGE",
        "severity": "CRITICAL",
        "probability": 85,
        "impact": "Python上級者が4名不足、プロジェクト遅延の可能性",
        "mitigation": "即座に採用活動を開始、または外部パートナーとの契約"
      }
    ],
    "criticalPeriods": [
      {
        "period": "2025-12",
        "riskLevel": "CRITICAL",
        "description": "複数プロジェクト同時立ち上げによる需要ピーク"
      }
    ]
  },
  "recommendations": [
    {
      "id": "rec-001",
      "category": "HIRING",
      "priority": "CRITICAL",
      "title": "Python上級エンジニア4名の緊急採用",
      "description": "2025年12月までにPython上級エンジニア4名の確保が必要",
      "estimatedImpact": {
        "demandReduction": 4.0,
        "timeframe": "3ヶ月"
      },
      "actions": [
        "即座に採用プロセスを開始",
        "外部リクルーターの活用",
        "リファラル採用の推進"
      ]
    }
  ],
  "metadata": {
    "algorithm": "PROPHET",
    "confidenceLevel": 0.95,
    "dataPoints": 24,
    "accuracy": 87.5
  }
}
```

---

## 🛠️ 実装ガイダンス

### 1. 時系列予測アルゴリズム（Prophet.js）

BC-005では時系列予測にFacebook Prophet（JavaScript実装）を使用します。

#### Prophet.js による需要予測

```typescript
/**
 * リソース需要予測エンジン
 * Prophet.js を使用した時系列予測
 */
class ResourceDemandForecaster {
  /**
   * 需要予測の実行
   */
  async forecastDemand(
    historicalData: HistoricalDemand[],
    config: ForecastConfig
  ): Promise<ForecastResult> {
    // 1. データ準備
    const preparedData = this.prepareDataForProphet(historicalData);

    // 2. Prophetモデルの構築
    const prophet = new Prophet({
      growth: 'linear',                    // 成長モデル（linear/logistic）
      changepoints: this.detectChangepoints(historicalData),
      seasonalityMode: 'multiplicative',   // 季節性モード
      yearlySeasonality: true,
      quarterlySeasonality: true,
      monthlySeasonality: true,
      holidays: this.getHolidays(config.startDate, config.endDate)
    });

    // 3. モデルの学習
    await prophet.fit(preparedData);

    // 4. 予測期間の生成
    const futureDates = this.generateFutureDates(
      config.startDate,
      config.endDate,
      config.forecastPeriod
    );

    // 5. 予測の実行
    const forecast = await prophet.predict(futureDates);

    // 6. 信頼区間の計算
    const confidenceIntervals = this.calculateConfidenceIntervals(
      forecast,
      config.confidenceLevel
    );

    return {
      forecast,
      confidenceIntervals,
      metrics: this.calculateAccuracyMetrics(prophet, preparedData)
    };
  }

  /**
   * Prophet用データ形式への変換
   */
  private prepareDataForProphet(
    historicalData: HistoricalDemand[]
  ): ProphetDataPoint[] {
    return historicalData.map(data => ({
      ds: data.date,           // 日付（必須フィールド名: ds）
      y: data.demand,          // 値（必須フィールド名: y）

      // 追加リグレッサー（説明変数）
      active_projects: data.activeProjects,
      team_size: data.teamSize,
      skill_level_avg: data.avgSkillLevel
    }));
  }

  /**
   * 変化点の自動検出
   */
  private detectChangepoints(data: HistoricalDemand[]): Date[] {
    // PELT (Pruned Exact Linear Time) アルゴリズムで変化点検出
    const changepoints: Date[] = [];
    const window = 6; // 6ヶ月移動窓

    for (let i = window; i < data.length - window; i++) {
      const before = data.slice(i - window, i);
      const after = data.slice(i, i + window);

      const beforeMean = this.calculateMean(before.map(d => d.demand));
      const afterMean = this.calculateMean(after.map(d => d.demand));

      // 平均値の変化が20%以上の場合、変化点と判定
      if (Math.abs(afterMean - beforeMean) / beforeMean > 0.20) {
        changepoints.push(data[i].date);
      }
    }

    return changepoints;
  }

  /**
   * 祝日・営業日カレンダーの取得
   */
  private getHolidays(startDate: Date, endDate: Date): Holiday[] {
    // 日本の祝日カレンダー
    return [
      { name: '元日', date: '2025-01-01', lowerWindow: 0, upperWindow: 0 },
      { name: '成人の日', date: '2025-01-13', lowerWindow: 0, upperWindow: 0 },
      { name: '建国記念の日', date: '2025-02-11', lowerWindow: 0, upperWindow: 0 },
      { name: '天皇誕生日', date: '2025-02-23', lowerWindow: 0, upperWindow: 0 },
      { name: '春分の日', date: '2025-03-20', lowerWindow: 0, upperWindow: 0 },
      { name: '昭和の日', date: '2025-04-29', lowerWindow: 0, upperWindow: 0 },
      { name: '憲法記念日', date: '2025-05-03', lowerWindow: 0, upperWindow: 0 },
      { name: 'みどりの日', date: '2025-05-04', lowerWindow: 0, upperWindow: 0 },
      { name: 'こどもの日', date: '2025-05-05', lowerWindow: 0, upperWindow: 0 },
      // ... その他の祝日
    ].filter(h => {
      const holidayDate = new Date(h.date);
      return holidayDate >= startDate && holidayDate <= endDate;
    });
  }
}
```

### 2. パイプライン案件の影響分析

```typescript
/**
 * パイプライン案件による需要影響分析
 */
class PipelineImpactAnalyzer {
  /**
   * パイプライン案件の需要への影響を計算
   */
  analyzePipelineImpact(
    pipelineProjects: PipelineProject[],
    baselineForecast: ForecastResult
  ): PipelineImpactAnalysis {
    // 1. 確度加重需要の計算
    const weightedDemand = pipelineProjects.reduce((total, project) => {
      const projectDemand = this.calculateProjectDemand(project);
      return total + (projectDemand * project.probability);
    }, 0);

    // 2. シナリオ分析
    const scenarios = {
      bestCase: this.calculateBestCase(pipelineProjects),      // 全案件受注
      expectedCase: weightedDemand,                             // 確度加重
      worstCase: this.calculateWorstCase(pipelineProjects)     // 全案件失注
    };

    // 3. プロジェクト別の影響分析
    const projectBreakdown = pipelineProjects.map(project => ({
      projectId: project.id,
      projectName: project.name,
      probability: project.probability,
      demandImpact: this.calculateProjectDemand(project),
      skillRequirements: project.requiredSkills,

      // 時期別影響
      periodImpacts: this.calculatePeriodImpacts(
        project,
        baselineForecast.periodForecasts
      )
    }));

    return {
      totalProjects: pipelineProjects.length,
      weightedDemand,
      projectBreakdown,
      scenarioAnalysis: scenarios
    };
  }

  /**
   * プロジェクトの需要量計算
   */
  private calculateProjectDemand(project: PipelineProject): number {
    // チームサイズ × プロジェクト期間（月） / 12
    return project.estimatedTeamSize * project.estimatedDuration / 12;
  }

  /**
   * 期間別影響の計算
   */
  private calculatePeriodImpacts(
    project: PipelineProject,
    periods: PeriodForecast[]
  ): { period: string; impact: number }[] {
    const impacts: { period: string; impact: number }[] = [];
    const projectEnd = new Date(project.estimatedStartDate);
    projectEnd.setMonth(projectEnd.getMonth() + project.estimatedDuration);

    for (const period of periods) {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);

      // プロジェクト期間と予測期間の重複を計算
      const overlap = this.calculateOverlap(
        project.estimatedStartDate,
        projectEnd,
        periodStart,
        periodEnd
      );

      if (overlap > 0) {
        const monthlyImpact = project.estimatedTeamSize * overlap;
        impacts.push({
          period: period.period,
          impact: monthlyImpact
        });
      }
    }

    return impacts;
  }
}
```

### 3. スキルギャップ分析

```typescript
/**
 * スキルギャップ分析エンジン
 */
class SkillGapAnalyzer {
  /**
   * スキル別の需給ギャップを分析
   */
  async analyzeSkillGaps(
    forecastedDemand: PeriodForecast[],
    currentSupply: ResourceSupply,
    requiredSkills: SkillRequirement[]
  ): Promise<SkillForecast[]> {
    const skillForecasts: SkillForecast[] = [];

    for (const skillReq of requiredSkills) {
      // 1. 現在の供給量
      const currentSkillSupply = await this.getSkillSupply(
        skillReq.skillId,
        skillReq.minimumLevel
      );

      // 2. 予測需要量
      const forecastedSkillDemand = this.calculateSkillDemand(
        skillReq,
        forecastedDemand
      );

      // 3. ギャップ計算
      const gap = forecastedSkillDemand - currentSkillSupply.available;

      // 4. 優先度判定
      const priority = this.determinePriority(gap, skillReq.weight);

      skillForecasts.push({
        skillId: skillReq.skillId,
        skillName: skillReq.skillName,
        skillLevel: skillReq.minimumLevel,
        demand: {
          current: currentSkillSupply.allocated,
          forecasted: forecastedSkillDemand,
          gap: gap
        },
        supply: {
          available: currentSkillSupply.available,
          developing: currentSkillSupply.developing,
          shortage: Math.max(0, gap)
        },
        priority
      });
    }

    // 優先度順にソート
    return skillForecasts.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 優先度判定ロジック
   */
  private determinePriority(
    gap: number,
    weight: number
  ): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    const weightedGap = gap * weight;

    if (weightedGap >= 4) return 'CRITICAL';  // 4人以上不足
    if (weightedGap >= 2) return 'HIGH';      // 2-4人不足
    if (weightedGap >= 1) return 'MEDIUM';    // 1-2人不足
    return 'LOW';                              // 1人未満不足
  }
}
```

### 4. BC統合実装

#### BC-001 (Project Delivery) との連携

```typescript
/**
 * プロジェクト需要予測サービス
 */
class ProjectDemandForecastService {
  /**
   * BC-001のプロジェクト計画から需要を予測
   */
  async forecastFromProjectPipeline(): Promise<ForecastResponse> {
    // 1. BC-001からパイプライン案件を取得
    const pipelineProjects = await this.projectService.getPipelineProjects({
      status: ['PLANNING', 'PROPOSED', 'APPROVED'],
      includeSkillRequirements: true
    });

    // 2. 過去のプロジェクト実績を取得
    const historicalProjects = await this.projectService.getCompletedProjects({
      period: 'LAST_24_MONTHS',
      includeResourceUsage: true
    });

    // 3. 過去実績から需要データを生成
    const historicalDemand = this.convertToHistoricalDemand(historicalProjects);

    // 4. 予測の実行
    const forecast = await this.forecaster.forecastDemand(historicalDemand, {
      forecastPeriod: 'QUARTER',
      startDate: new Date(),
      endDate: this.addMonths(new Date(), 12),
      algorithm: 'PROPHET',
      confidenceLevel: 0.95
    });

    // 5. パイプライン影響の追加
    const pipelineImpact = await this.pipelineAnalyzer.analyzePipelineImpact(
      pipelineProjects,
      forecast
    );

    return {
      ...forecast,
      pipelineImpact
    };
  }
}
```

#### BC-002 (Financial Management) との連携

```typescript
/**
 * コスト予測サービス
 */
class CostForecastService {
  /**
   * リソース需要予測からコストを推定
   */
  async estimateCostFromDemandForecast(
    demandForecast: ForecastResponse
  ): Promise<CostForecast> {
    const costForecasts: PeriodCostForecast[] = [];

    for (const periodForecast of demandForecast.periodForecasts) {
      // 1. 期間の平均コスト単価を取得（BC-002）
      const avgCostRate = await this.financeService.getAverageCostRate({
        period: periodForecast.period,
        resourceType: 'CONSULTANT'
      });

      // 2. 需要量 × コスト単価
      const expectedCost = periodForecast.demand.expected * avgCostRate.monthlyRate;
      const lowerBoundCost = periodForecast.demand.lowerBound * avgCostRate.monthlyRate;
      const upperBoundCost = periodForecast.demand.upperBound * avgCostRate.monthlyRate;

      costForecasts.push({
        period: periodForecast.period,
        expectedCost,
        lowerBoundCost,
        upperBoundCost,
        confidence: periodForecast.demand.confidence
      });

      // 3. BC-002へ予測コストを登録
      await this.financeService.recordForecastedCost({
        period: periodForecast.period,
        costType: 'RESOURCE_DEMAND',
        amount: expectedCost,
        currency: 'JPY',
        confidenceLevel: periodForecast.demand.confidence
      });
    }

    return { costForecasts };
  }
}
```

#### BC-006 (Knowledge Management) との連携

```typescript
/**
 * スキル育成計画サービス
 */
class SkillDevelopmentPlanService {
  /**
   * スキルギャップから育成計画を生成
   */
  async createDevelopmentPlansFromGaps(
    skillGaps: SkillForecast[]
  ): Promise<DevelopmentPlan[]> {
    const plans: DevelopmentPlan[] = [];

    for (const skillGap of skillGaps) {
      if (skillGap.priority === 'CRITICAL' || skillGap.priority === 'HIGH') {
        // 1. BC-006から関連トレーニングコンテンツを取得
        const trainingContent = await this.knowledgeService.findTrainingContent({
          skillId: skillGap.skillId,
          targetLevel: skillGap.skillLevel
        });

        // 2. 育成計画の作成
        const plan = {
          skillId: skillGap.skillId,
          targetCount: skillGap.supply.shortage,
          trainingDuration: this.estimateTrainingDuration(skillGap.skillLevel),
          trainingContent: trainingContent,
          estimatedCompletion: this.calculateCompletionDate(skillGap.skillLevel)
        };

        plans.push(plan);

        // 3. BC-006へ育成計画を登録
        await this.knowledgeService.createDevelopmentPlan(plan);
      }
    }

    return plans;
  }
}
```

### 5. データベース操作

```typescript
/**
 * 予測結果リポジトリ
 */
class ForecastRepository {
  /**
   * 予測結果の保存
   */
  async saveForecast(forecast: ForecastResponse): Promise<void> {
    await this.db.transaction(async (tx) => {
      // 1. 予測メタデータの保存
      await tx.resourceForecast.create({
        data: {
          id: forecast.forecastId,
          generatedAt: forecast.generatedAt,
          algorithm: forecast.metadata.algorithm,
          confidenceLevel: forecast.metadata.confidenceLevel,
          accuracy: forecast.metadata.accuracy,

          // 概要データ
          currentDemand: forecast.summary.totalDemand.current,
          forecastedDemand: forecast.summary.totalDemand.forecasted,
          demandChange: forecast.summary.totalDemand.change,

          // リスクレベル
          overallRisk: forecast.riskAnalysis.overallRisk
        }
      });

      // 2. 期間別予測の保存
      await Promise.all(
        forecast.periodForecasts.map(period =>
          tx.periodForecast.create({
            data: {
              forecastId: forecast.forecastId,
              period: period.period,
              startDate: period.startDate,
              endDate: period.endDate,
              expectedDemand: period.demand.expected,
              lowerBound: period.demand.lowerBound,
              upperBound: period.demand.upperBound,
              confidence: period.demand.confidence,
              utilizationRate: period.gap.utilizationRate
            }
          })
        )
      );

      // 3. スキル別予測の保存
      await Promise.all(
        forecast.skillForecasts.map(skill =>
          tx.skillForecast.create({
            data: {
              forecastId: forecast.forecastId,
              skillId: skill.skillId,
              skillName: skill.skillName,
              skillLevel: skill.skillLevel,
              currentDemand: skill.demand.current,
              forecastedDemand: skill.demand.forecasted,
              gap: skill.demand.gap,
              priority: skill.priority
            }
          })
        )
      );

      // 4. 推奨アクションの保存
      await Promise.all(
        forecast.recommendations.map(rec =>
          tx.forecastRecommendation.create({
            data: {
              forecastId: forecast.forecastId,
              category: rec.category,
              priority: rec.priority,
              title: rec.title,
              description: rec.description,
              actions: JSON.stringify(rec.actions)
            }
          })
        )
      );

      // 5. イベント発行
      await this.eventBus.publish(new ForecastGeneratedEvent({
        forecastId: forecast.forecastId,
        overallRisk: forecast.riskAnalysis.overallRisk,
        criticalGaps: forecast.skillForecasts.filter(s => s.priority === 'CRITICAL').length,
        timestamp: new Date()
      }));
    });
  }

  /**
   * 過去の予測精度分析
   */
  async analyzeForecastAccuracy(
    forecastId: string,
    actualDemand: PeriodActual[]
  ): Promise<AccuracyAnalysis> {
    const forecast = await this.db.resourceForecast.findUnique({
      where: { id: forecastId },
      include: { periodForecasts: true }
    });

    // MAPE (Mean Absolute Percentage Error) の計算
    let totalError = 0;
    let count = 0;

    for (const period of forecast.periodForecasts) {
      const actual = actualDemand.find(a => a.period === period.period);
      if (actual) {
        const error = Math.abs(actual.demand - period.expectedDemand) / actual.demand;
        totalError += error;
        count++;
      }
    }

    const mape = (totalError / count) * 100;
    const accuracy = 100 - mape;

    // 精度を更新
    await this.db.resourceForecast.update({
      where: { id: forecastId },
      data: { accuracy }
    });

    return { mape, accuracy };
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
| ERR_BC005_L3001_OP002_001 | INVALID_FORECAST_PERIOD | 無効な予測期間 | 400 | MONTH/QUARTER/YEAR/CUSTOMのいずれかを指定 |
| ERR_BC005_L3001_OP002_002 | INVALID_START_DATE | 無効な開始日 | 400 | ISO 8601形式で未来の日付を指定 |
| ERR_BC005_L3001_OP002_003 | INVALID_DATE_RANGE | 無効な予測期間範囲 | 400 | 終了日を開始日より後、最大2年以内に設定 |
| ERR_BC005_L3001_OP002_004 | INVALID_TARGET_SCOPE | 無効な分析対象 | 400 | ORGANIZATION/DEPARTMENT/SKILL/ROLEのいずれかを指定 |
| ERR_BC005_L3001_OP002_005 | INVALID_ALGORITHM | 無効な予測アルゴリズム | 400 | PROPHET/ARIMA/LINEAR_REGRESSION/ENSEMBLEのいずれかを指定 |
| ERR_BC005_L3001_OP002_006 | INVALID_CONFIDENCE_LEVEL | 無効な信頼区間 | 400 | 0.80-0.99の範囲で信頼区間を指定 |
| ERR_BC005_L3001_OP002_007 | TOO_MANY_PIPELINE_PROJECTS | パイプライン案件が多すぎる | 400 | パイプライン案件を50件以下に制限 |
| ERR_BC005_L3001_OP002_008 | INVALID_PROBABILITY | 無効な受注確度 | 400 | 0.0-1.0の範囲で確度を指定 |
| ERR_BC005_L3001_OP002_101 | INSUFFICIENT_HISTORICAL_DATA | 過去データ不足 | 422 | 最低12ヶ月分の過去データが必要 |
| ERR_BC005_L3001_OP002_102 | DATA_QUALITY_ISSUE | データ品質問題 | 422 | 欠損値や異常値を修正 |
| ERR_BC005_L3001_OP002_201 | FORECAST_FAILED | 予測計算失敗 | 500 | アルゴリズムパラメータを調整して再試行 |
| ERR_BC005_L3001_OP002_202 | MODEL_CONVERGENCE_FAILED | モデル収束失敗 | 500 | データ正規化またはアルゴリズム変更 |
| ERR_BC005_L3001_OP002_301 | PIPELINE_DATA_UNAVAILABLE | パイプラインデータ取得失敗 | 503 | BC-001 Project Serviceに接続確認 |
| ERR_BC005_L3001_OP002_302 | COST_DATA_UNAVAILABLE | コストデータ取得失敗 | 503 | BC-002 Finance Serviceに接続確認 |

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
class ForecastService {
  async createForecast(request: ForecastRequest): Promise<ForecastResponse> {
    try {
      // 1. 入力バリデーション
      this.validateRequest(request);

      // 2. 過去データの取得と検証
      const historicalData = await this.getHistoricalData(request);

      if (historicalData.length < 12) {
        throw new InsufficientHistoricalDataError(
          'ERR_BC005_L3001_OP002_101',
          `Insufficient historical data: ${historicalData.length} months (minimum: 12)`,
          {
            available: historicalData.length,
            required: 12,
            suggestion: 'さらに過去のデータを収集するか、予測期間を短縮してください'
          }
        );
      }

      // 3. データ品質チェック
      const qualityIssues = this.checkDataQuality(historicalData);
      if (qualityIssues.length > 0) {
        throw new DataQualityIssueError(
          'ERR_BC005_L3001_OP002_102',
          'Data quality issues detected',
          {
            issues: qualityIssues,
            suggestion: 'データの欠損値や異常値を修正してください'
          }
        );
      }

      // 4. 予測の実行
      const forecast = await this.forecaster.forecastDemand(
        historicalData,
        request.modelConfig
      );

      // 5. 収束チェック
      if (!forecast.converged) {
        throw new ModelConvergenceFailedError(
          'ERR_BC005_L3001_OP002_202',
          'Forecast model failed to converge',
          {
            iterations: forecast.iterations,
            residual: forecast.residual,
            suggestion: 'データを正規化するか、別のアルゴリズムを試してください'
          }
        );
      }

      return this.buildForecastResponse(forecast, request);

    } catch (error) {
      // エラーログ記録
      this.logger.error('Forecast failed', {
        error,
        request,
        timestamp: new Date()
      });

      // カスタムエラーの場合はそのまま再スロー
      if (error instanceof ForecastError) {
        throw error;
      }

      // 予期しないエラーの場合は汎用エラーに変換
      throw new ForecastFailedError(
        'ERR_BC005_L3001_OP002_201',
        'An unexpected error occurred during forecasting',
        { originalError: error.message }
      );
    }
  }

  /**
   * データ品質チェック
   */
  private checkDataQuality(data: HistoricalDemand[]): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];

    // 欠損値チェック
    const missingCount = data.filter(d => d.demand === null || d.demand === undefined).length;
    if (missingCount > 0) {
      issues.push({
        type: 'MISSING_VALUES',
        count: missingCount,
        percentage: (missingCount / data.length) * 100,
        severity: 'HIGH'
      });
    }

    // 異常値チェック（IQR法）
    const q1 = this.calculateQuantile(data.map(d => d.demand), 0.25);
    const q3 = this.calculateQuantile(data.map(d => d.demand), 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outliers = data.filter(d => d.demand < lowerBound || d.demand > upperBound);
    if (outliers.length > 0) {
      issues.push({
        type: 'OUTLIERS',
        count: outliers.length,
        percentage: (outliers.length / data.length) * 100,
        severity: 'MEDIUM'
      });
    }

    return issues;
  }
}
```

### リトライロジック

```typescript
class ForecastRetryPolicy {
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

        this.logger.warn(`Retrying forecast (attempt ${attempt + 1}/${maxRetries})`, {
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
    if (error instanceof ModelConvergenceFailedError) return true;
    if (error instanceof PipelineDataUnavailableError) return true;
    if (error instanceof CostDataUnavailableError) return true;
    if (error instanceof InsufficientHistoricalDataError) return false; // データ不足は即座に失敗
    if (error instanceof DataQualityIssueError) return false; // データ品質問題は即座に失敗
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
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
