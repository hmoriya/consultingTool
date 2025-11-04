# OP-003: キャッシュフローを予測し最適化する

**作成日**: 2025-10-31
**所属L3**: L3-004-profitability-analysis-and-optimization: Profitability Analysis And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/forecast-and-optimize-cashflow

---

## 📋 How: この操作の定義

### 操作の概要
将来のキャッシュフローを予測し、資金繰りを最適化する。入出金のタイミング管理により、健全なキャッシュポジションを維持する。

### 実現する機能
- キャッシュフロー予測の作成
- 入出金タイミングの分析
- 資金ショート警告の発生
- キャッシュフロー最適化施策の提案

### 入力
- 過去のキャッシュフローデータ
- 請求・支払予定データ
- プロジェクト計画
- 資金ニーズ

### 出力
- キャッシュフロー予測レポート
- 資金ショート警告
- キャッシュポジション推移
- 最適化施策提案

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| analysisScope | AnalysisScope | ○ | 分析範囲 | PROJECT/DEPARTMENT/COMPANY |
| targetIds | UUID[] | △ | 対象ID配列 | スコープ=PROJECT時必須 |
| forecastPeriod | DateRange | ○ | 予測期間 | 開始日≤終了日、最大24ヶ月 |
| forecastGranularity | ForecastGranularity | ○ | 予測粒度 | WEEKLY/MONTHLY/QUARTERLY |
| simulationMethod | SimulationMethod | △ | シミュレーション手法 | DETERMINISTIC/MONTE_CARLO/SCENARIO |
| monteCarloIterations | INTEGER | △ | モンテカルロ反復回数 | 1000/5000/10000 (default: 5000) |
| confidenceLevel | DECIMAL | △ | 信頼区間レベル | 0.90/0.95/0.99 (default: 0.95) |
| historicalPeriod | DateRange | ○ | 過去データ期間 | 最低12ヶ月 |
| liquidityTargets | LiquidityTargets | △ | 流動性目標 | 最低現金残高、流動比率等 |
| workingCapitalPolicy | WorkingCapitalPolicy | △ | 運転資金方針 | CONSERVATIVE/MODERATE/AGGRESSIVE |
| seasonalityAdjustment | BOOLEAN | △ | 季節性調整 | true/false (default: true) |
| optimizationConstraints | OptimizationConstraint[] | △ | 最適化制約条件 | 支払期限、回収条件等 |

### 入力例（JSON）
```json
{
  "analysisScope": "COMPANY",
  "forecastPeriod": {
    "startDate": "2025-01-01",
    "endDate": "2026-12-31"
  },
  "forecastGranularity": "MONTHLY",
  "simulationMethod": "MONTE_CARLO",
  "monteCarloIterations": 5000,
  "confidenceLevel": 0.95,
  "historicalPeriod": {
    "startDate": "2023-01-01",
    "endDate": "2024-12-31"
  },
  "liquidityTargets": {
    "minimumCashBalance": "50000000.00",
    "currentRatio": 1.5,
    "quickRatio": 1.0
  },
  "workingCapitalPolicy": "MODERATE",
  "seasonalityAdjustment": true,
  "optimizationConstraints": [
    {
      "type": "PAYMENT_TERM",
      "minDays": 30,
      "maxDays": 60
    },
    {
      "type": "COLLECTION_PERIOD",
      "targetDays": 45
    }
  ]
}
```

### バリデーションルール

1. **期間整合性検証**
   - 予測期間.開始日 ≤ 予測期間.終了日
   - 予測期間 ≤ 24ヶ月（長期予測の精度低下防止）
   - 過去データ期間 ≥ 12ヶ月（統計的信頼性確保）
   - forecastGranularity = WEEKLY: 予測期間 ≤ 6ヶ月

2. **シミュレーション方法別検証**
   - DETERMINISTIC: 過去平均値使用、最速
   - MONTE_CARLO: monteCarloIterations必須（1000-10000）
   - SCENARIO: シナリオ定義必須（楽観/中立/悲観）

3. **流動性目標検証**
   - minimumCashBalance: 正の値
   - currentRatio: ≥ 1.0（流動性の基準）
   - quickRatio: ≥ 0.5（厳格な流動性基準）

4. **運転資金方針検証**
   - CONSERVATIVE: 高い現金保有、低リスク
   - MODERATE: バランス型、標準リスク
   - AGGRESSIVE: 最小現金保有、高リスク

5. **BC連携検証**
   - 過去キャッシュフローデータ存在確認
   - 請求予定データ存在確認（AR）
   - 支払予定データ存在確認（AP）

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "forecastId": "cashflow-forecast-12345",
    "analysisScope": "COMPANY",
    "forecastPeriod": {
      "startDate": "2025-01-01",
      "endDate": "2026-12-31"
    },
    "forecastGranularity": "MONTHLY",
    "simulationMethod": "MONTE_CARLO",
    "cashFlowForecast": {
      "monthlySummary": [
        {
          "period": "2025-01",
          "inflowForecast": {
            "expected": "120000000.00",
            "pessimistic": "95000000.00",
            "optimistic": "145000000.00",
            "confidenceInterval": {
              "lower": "105000000.00",
              "upper": "135000000.00",
              "level": 0.95
            }
          },
          "outflowForecast": {
            "expected": "95000000.00",
            "pessimistic": "110000000.00",
            "optimistic": "80000000.00",
            "confidenceInterval": {
              "lower": "88000000.00",
              "upper": "102000000.00",
              "level": 0.95
            }
          },
          "netCashFlow": {
            "expected": "25000000.00",
            "pessimistic": "-15000000.00",
            "optimistic": "65000000.00"
          },
          "cumulativeCash": {
            "expected": "75000000.00",
            "pessimistic": "35000000.00",
            "optimistic": "115000000.00"
          }
        }
      ],
      "totalPeriods": 24
    },
    "monteCarloResults": {
      "iterations": 5000,
      "distributionAnalysis": {
        "mean": "25000000.00",
        "median": "24500000.00",
        "stdDev": "8500000.00",
        "skewness": 0.15,
        "kurtosis": 2.8,
        "percentiles": {
          "p5": "10000000.00",
          "p25": "18000000.00",
          "p50": "24500000.00",
          "p75": "32000000.00",
          "p95": "45000000.00"
        }
      },
      "riskMetrics": {
        "valueAtRisk": {
          "var95": "-12000000.00",
          "var99": "-25000000.00"
        },
        "conditionalVaR": {
          "cvar95": "-18000000.00",
          "cvar99": "-32000000.00"
        },
        "probabilityOfNegativeCashFlow": 0.08,
        "probabilityOfLiquidityCrisis": 0.02
      }
    },
    "liquidityAnalysis": {
      "currentPosition": {
        "cashBalance": "50000000.00",
        "currentRatio": 1.5,
        "quickRatio": 1.2,
        "workingCapital": "75000000.00"
      },
      "forecastedPosition": {
        "endingCashBalance": {
          "expected": "125000000.00",
          "minimum": "35000000.00",
          "maximum": "215000000.00"
        },
        "projectedCurrentRatio": 1.8,
        "projectedQuickRatio": 1.4,
        "projectedWorkingCapital": "105000000.00"
      },
      "liquidityWarnings": [
        {
          "period": "2025-08",
          "warningType": "LOW_CASH_BALANCE",
          "projectedBalance": "42000000.00",
          "minimumTarget": "50000000.00",
          "shortfall": "8000000.00",
          "severity": "MEDIUM"
        }
      ],
      "cashShortfallRisk": {
        "periodsAtRisk": 2,
        "totalRiskAmount": "15000000.00",
        "maxSinglePeriodShortfall": "8000000.00"
      }
    },
    "workingCapitalOptimization": {
      "currentMetrics": {
        "daysPayableOutstanding": 45,
        "daysInventoryOutstanding": 30,
        "daysSalesOutstanding": 60,
        "cashConversionCycle": 45
      },
      "optimizedMetrics": {
        "daysPayableOutstanding": 50,
        "daysInventoryOutstanding": 25,
        "daysSalesOutstanding": 45,
        "cashConversionCycle": 20,
        "improvementDays": 25
      },
      "optimizationImpact": {
        "cashFlowImprovement": "28000000.00",
        "workingCapitalReduction": "35000000.00",
        "annualizedBenefit": "42000000.00"
      },
      "recommendations": [
        {
          "category": "ACCOUNTS_RECEIVABLE",
          "action": "売掛金回収期間を60日から45日に短縮",
          "impact": "15000000.00",
          "priority": "HIGH",
          "implementationComplexity": "MEDIUM"
        },
        {
          "category": "ACCOUNTS_PAYABLE",
          "action": "買掛金支払条件を45日から50日に延長交渉",
          "impact": "8000000.00",
          "priority": "MEDIUM",
          "implementationComplexity": "LOW"
        },
        {
          "category": "INVENTORY",
          "action": "在庫回転率向上（30日→25日）",
          "impact": "5000000.00",
          "priority": "MEDIUM",
          "implementationComplexity": "HIGH"
        }
      ]
    },
    "scenarioAnalysis": {
      "baseCase": {
        "description": "通常想定シナリオ",
        "avgMonthlyCashFlow": "25000000.00",
        "endingCashBalance": "125000000.00"
      },
      "pessimisticCase": {
        "description": "経済減速シナリオ",
        "assumptions": [
          "売上15%減少",
          "回収期間20%延長",
          "コスト10%増加"
        ],
        "avgMonthlyCashFlow": "5000000.00",
        "endingCashBalance": "60000000.00",
        "probability": 0.15
      },
      "optimisticCase": {
        "description": "市場拡大シナリオ",
        "assumptions": [
          "売上20%増加",
          "回収期間10%短縮",
          "効率改善によるコスト5%削減"
        ],
        "avgMonthlyCashFlow": "45000000.00",
        "endingCashBalance": "190000000.00",
        "probability": 0.25
      }
    },
    "optimizationStrategies": [
      {
        "strategy": "ACCELERATE_COLLECTION",
        "description": "売掛金回収加速施策",
        "actions": [
          "早期支払割引の導入（2/10 net 45）",
          "オンライン決済オプション追加",
          "請求プロセス自動化"
        ],
        "expectedImpact": "15000000.00",
        "implementationCost": "2000000.00",
        "roi": 7.5,
        "timeframe": "3ヶ月"
      },
      {
        "strategy": "EXTEND_PAYMENT_TERMS",
        "description": "支払条件最適化",
        "actions": [
          "サプライヤーとの支払条件再交渉",
          "戦略的サプライヤーとの関係強化",
          "まとめ支払いによる交渉力向上"
        ],
        "expectedImpact": "8000000.00",
        "implementationCost": "500000.00",
        "roi": 16.0,
        "timeframe": "2ヶ月"
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "createdBy": "user-999"
  },
  "message": "キャッシュフロー予測と最適化が正常に完了しました。"
}
```

### エラーレスポンス

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3004_OP003_001",
    "message": "過去データが不足しています",
    "details": {
      "requiredMonths": 12,
      "availableMonths": 8,
      "shortfall": 4
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3004_OP003_001 | 400 | 過去データ不足 | 過去データ期間の延長 |
| ERR_BC002_L3004_OP003_002 | 422 | シミュレーション失敗 | パラメータ調整または手法変更 |
| ERR_BC002_L3004_OP003_003 | 422 | 流動性制約違反 | 目標値の調整または追加資金調達 |
| ERR_BC002_L3004_OP003_004 | 400 | 最適化制約不整合 | 制約条件の見直し |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: CashFlow Aggregate

```typescript
import Decimal from 'decimal.js';
import * as jStat from 'jstat'; // 統計ライブラリ

// CashFlow Aggregate Root
class CashFlowForecast {
  constructor(
    public id: string,
    public scope: AnalysisScope,
    public forecastPeriod: DateRange,
    public granularity: ForecastGranularity,
    public historicalData: HistoricalCashFlowData[],
    public forecastedData: ForecastedCashFlowDataPoint[]
  ) {}

  // 決定論的予測（過去平均ベース）
  deterministicForecast(): ForecastedCashFlowDataPoint[] {
    const avgInflow = this.calculateHistoricalAverage('inflow');
    const avgOutflow = this.calculateHistoricalAverage('outflow');

    // 季節性調整
    const seasonalFactors = this.calculateSeasonalFactors();

    const forecasted: ForecastedCashFlowDataPoint[] = [];
    let cumulativeCash = this.getCurrentCashBalance();

    for (const period of this.generateForecastPeriods()) {
      const monthIndex = new Date(period).getMonth();
      const seasonalFactor = seasonalFactors[monthIndex];

      const inflow = avgInflow.mul(seasonalFactor);
      const outflow = avgOutflow.mul(seasonalFactor);
      const netCashFlow = inflow.minus(outflow);
      cumulativeCash = cumulativeCash.plus(netCashFlow);

      forecasted.push(
        new ForecastedCashFlowDataPoint(
          period,
          new CashFlowEstimate(inflow, inflow, inflow, null),
          new CashFlowEstimate(outflow, outflow, outflow, null),
          netCashFlow,
          cumulativeCash
        )
      );
    }

    return forecasted;
  }

  // モンテカルロシミュレーション
  monteCarloSimulation(iterations: number = 5000): MonteCarloResults {
    const inflowDistribution = this.fitDistribution('inflow');
    const outflowDistribution = this.fitDistribution('outflow');

    const allSimulations: Decimal[][] = [];

    for (let i = 0; i < iterations; i++) {
      const simulation = this.runSingleSimulation(
        inflowDistribution,
        outflowDistribution
      );
      allSimulations.push(simulation);
    }

    // 統計分析
    const distributionAnalysis = this.analyzeDistribution(allSimulations);
    const riskMetrics = this.calculateRiskMetrics(allSimulations);

    return new MonteCarloResults(
      iterations,
      distributionAnalysis,
      riskMetrics,
      allSimulations
    );
  }

  private runSingleSimulation(
    inflowDist: Distribution,
    outflowDist: Distribution
  ): Decimal[] {
    const cashFlows: Decimal[] = [];
    let cumulativeCash = this.getCurrentCashBalance();

    for (const period of this.generateForecastPeriods()) {
      // 確率分布からランダムサンプリング
      const inflow = new Decimal(
        inflowDist.sample() * this.getSeasonalFactor(period, 'inflow')
      );
      const outflow = new Decimal(
        outflowDist.sample() * this.getSeasonalFactor(period, 'outflow')
      );

      const netCashFlow = inflow.minus(outflow);
      cumulativeCash = cumulativeCash.plus(netCashFlow);

      cashFlows.push(cumulativeCash);
    }

    return cashFlows;
  }

  private analyzeDistribution(
    simulations: Decimal[][]
  ): DistributionAnalysis {
    // 最終期のキャッシュフロー分布を分析
    const finalCashFlows = simulations.map(sim => sim[sim.length - 1].toNumber());

    const mean = jStat.mean(finalCashFlows);
    const median = jStat.median(finalCashFlows);
    const stdDev = jStat.stdev(finalCashFlows);
    const skewness = jStat.skewness(finalCashFlows);
    const kurtosis = jStat.kurtosis(finalCashFlows);

    const percentiles = {
      p5: jStat.percentile(finalCashFlows, 0.05),
      p25: jStat.percentile(finalCashFlows, 0.25),
      p50: jStat.percentile(finalCashFlows, 0.50),
      p75: jStat.percentile(finalCashFlows, 0.75),
      p95: jStat.percentile(finalCashFlows, 0.95)
    };

    return new DistributionAnalysis(
      new Decimal(mean),
      new Decimal(median),
      new Decimal(stdDev),
      skewness,
      kurtosis,
      percentiles
    );
  }

  private calculateRiskMetrics(
    simulations: Decimal[][]
  ): RiskMetrics {
    const finalCashFlows = simulations.map(sim => sim[sim.length - 1].toNumber());

    // VaR (Value at Risk) 計算
    const var95 = new Decimal(jStat.percentile(finalCashFlows, 0.05));
    const var99 = new Decimal(jStat.percentile(finalCashFlows, 0.01));

    // CVaR (Conditional VaR) 計算
    const below5Percent = finalCashFlows.filter(cf => cf <= var95.toNumber());
    const cvar95 = new Decimal(jStat.mean(below5Percent));

    const below1Percent = finalCashFlows.filter(cf => cf <= var99.toNumber());
    const cvar99 = new Decimal(jStat.mean(below1Percent));

    // ネガティブキャッシュフロー確率
    const negativeCases = finalCashFlows.filter(cf => cf < 0).length;
    const probabilityOfNegativeCashFlow = negativeCases / finalCashFlows.length;

    // 流動性危機確率（現金残高が最低目標を下回る）
    const minimumTarget = this.liquidityTargets?.minimumCashBalance ?? new Decimal(0);
    const crisisCases = finalCashFlows.filter(cf => cf < minimumTarget.toNumber()).length;
    const probabilityOfLiquidityCrisis = crisisCases / finalCashFlows.length;

    return new RiskMetrics(
      { var95, var99 },
      { cvar95, cvar99 },
      probabilityOfNegativeCashFlow,
      probabilityOfLiquidityCrisis
    );
  }

  // 流動性分析
  analyzeLiquidity(): LiquidityAnalysis {
    const currentPosition = this.calculateCurrentLiquidityPosition();
    const forecastedPosition = this.calculateForecastedLiquidityPosition();

    // 流動性警告検出
    const warnings = this.detectLiquidityWarnings();

    // キャッシュ不足リスク評価
    const shortfallRisk = this.assessCashShortfallRisk();

    return new LiquidityAnalysis(
      currentPosition,
      forecastedPosition,
      warnings,
      shortfallRisk
    );
  }

  private detectLiquidityWarnings(): LiquidityWarning[] {
    const warnings: LiquidityWarning[] = [];
    const minimumTarget = this.liquidityTargets?.minimumCashBalance ?? new Decimal(0);

    for (const dataPoint of this.forecastedData) {
      if (dataPoint.cumulativeCash.lessThan(minimumTarget)) {
        const shortfall = minimumTarget.minus(dataPoint.cumulativeCash);

        warnings.push(
          new LiquidityWarning(
            dataPoint.period,
            'LOW_CASH_BALANCE',
            dataPoint.cumulativeCash,
            minimumTarget,
            shortfall,
            this.determineSeverity(shortfall, minimumTarget)
          )
        );
      }
    }

    return warnings;
  }

  // 運転資金最適化
  optimizeWorkingCapital(): WorkingCapitalOptimization {
    const currentMetrics = this.calculateCurrentWorkingCapitalMetrics();

    // 最適化アルゴリズム（線形計画法）
    const optimizedMetrics = this.solveOptimizationProblem(
      currentMetrics,
      this.optimizationConstraints
    );

    // 最適化インパクト計算
    const impact = this.calculateOptimizationImpact(
      currentMetrics,
      optimizedMetrics
    );

    // 推奨アクション生成
    const recommendations = this.generateRecommendations(
      currentMetrics,
      optimizedMetrics
    );

    return new WorkingCapitalOptimization(
      currentMetrics,
      optimizedMetrics,
      impact,
      recommendations
    );
  }

  private solveOptimizationProblem(
    current: WorkingCapitalMetrics,
    constraints: OptimizationConstraint[]
  ): WorkingCapitalMetrics {
    // 線形計画法による最適化
    // 目的関数: キャッシュコンバージョンサイクル最小化
    // 制約条件: 支払期限、回収条件、在庫水準等

    // 簡略化された例（実際はoptimization libraryを使用）
    const targetDPO = this.calculateOptimalDPO(constraints);
    const targetDIO = this.calculateOptimalDIO(constraints);
    const targetDSO = this.calculateOptimalDSO(constraints);

    const optimizedCCC = targetDIO.plus(targetDSO).minus(targetDPO);

    return new WorkingCapitalMetrics(
      targetDPO,
      targetDIO,
      targetDSO,
      optimizedCCC
    );
  }

  private calculateOptimizationImpact(
    current: WorkingCapitalMetrics,
    optimized: WorkingCapitalMetrics
  ): OptimizationImpact {
    // CCCの改善日数
    const improvementDays = current.cashConversionCycle.minus(
      optimized.cashConversionCycle
    );

    // 年間売上から1日あたり売上計算
    const annualRevenue = this.getAnnualRevenue();
    const dailyRevenue = annualRevenue.div(365);

    // キャッシュフロー改善額
    const cashFlowImprovement = dailyRevenue.mul(improvementDays);

    // 運転資金削減額
    const workingCapitalReduction = this.calculateWorkingCapitalReduction(
      current,
      optimized
    );

    // 年間化便益
    const annualizedBenefit = cashFlowImprovement.mul(1.2); // 資金コスト考慮

    return new OptimizationImpact(
      cashFlowImprovement,
      workingCapitalReduction,
      annualizedBenefit
    );
  }

  // シナリオ分析
  scenarioAnalysis(): ScenarioAnalysisResults {
    const baseCase = this.runScenario('BASE', {});

    const pessimisticCase = this.runScenario('PESSIMISTIC', {
      revenueChange: -0.15,
      collectionPeriodChange: 0.20,
      costChange: 0.10
    });

    const optimisticCase = this.runScenario('OPTIMISTIC', {
      revenueChange: 0.20,
      collectionPeriodChange: -0.10,
      costChange: -0.05
    });

    return new ScenarioAnalysisResults(
      baseCase,
      pessimisticCase,
      optimisticCase
    );
  }

  private runScenario(
    scenarioType: string,
    assumptions: ScenarioAssumptions
  ): ScenarioResult {
    // シナリオ想定を反映したキャッシュフロー予測
    const adjustedHistoricalData = this.applyScenarioAssumptions(
      this.historicalData,
      assumptions
    );

    const tempForecast = new CashFlowForecast(
      `${this.id}-${scenarioType}`,
      this.scope,
      this.forecastPeriod,
      this.granularity,
      adjustedHistoricalData,
      []
    );

    const forecasted = tempForecast.deterministicForecast();

    const avgMonthlyCashFlow = forecasted.reduce(
      (sum, point) => sum.plus(point.netCashFlow),
      new Decimal(0)
    ).div(forecasted.length);

    const endingCashBalance = forecasted[forecasted.length - 1].cumulativeCash;

    return new ScenarioResult(
      scenarioType,
      this.getScenarioDescription(scenarioType),
      assumptions,
      avgMonthlyCashFlow,
      endingCashBalance,
      this.estimateScenarioProbability(scenarioType)
    );
  }

  // 最適化戦略生成
  generateOptimizationStrategies(): OptimizationStrategy[] {
    const strategies: OptimizationStrategy[] = [];

    // 1. 売掛金回収加速戦略
    const accelerateCollection = this.evaluateCollectionStrategy();
    if (accelerateCollection.roi.greaterThan(3)) {
      strategies.push(accelerateCollection);
    }

    // 2. 支払条件最適化戦略
    const extendPaymentTerms = this.evaluatePaymentTermsStrategy();
    if (extendPaymentTerms.roi.greaterThan(3)) {
      strategies.push(extendPaymentTerms);
    }

    // 3. 在庫最適化戦略
    const optimizeInventory = this.evaluateInventoryStrategy();
    if (optimizeInventory.roi.greaterThan(2)) {
      strategies.push(optimizeInventory);
    }

    // ROI順にソート
    return strategies.sort((a, b) => b.roi.minus(a.roi).toNumber());
  }

  private evaluateCollectionStrategy(): OptimizationStrategy {
    const currentDSO = this.calculateCurrentWorkingCapitalMetrics().daysSalesOutstanding;
    const targetDSO = currentDSO.mul(0.75); // 25%短縮目標

    const dailyRevenue = this.getAnnualRevenue().div(365);
    const dsoImprovement = currentDSO.minus(targetDSO);
    const expectedImpact = dailyRevenue.mul(dsoImprovement);

    const implementationCost = this.estimateImplementationCost('COLLECTION');

    const roi = expectedImpact.div(implementationCost);

    return new OptimizationStrategy(
      'ACCELERATE_COLLECTION',
      '売掛金回収加速施策',
      [
        '早期支払割引の導入（2/10 net 45）',
        'オンライン決済オプション追加',
        '請求プロセス自動化'
      ],
      expectedImpact,
      implementationCost,
      roi,
      '3ヶ月'
    );
  }

  private fitDistribution(type: 'inflow' | 'outflow'): Distribution {
    const data = this.historicalData.map(d =>
      type === 'inflow' ? d.inflow.toNumber() : d.outflow.toNumber()
    );

    // 正規分布フィッティング
    const mean = jStat.mean(data);
    const stdDev = jStat.stdev(data);

    return new NormalDistribution(mean, stdDev);
  }

  private calculateSeasonalFactors(): number[] {
    // 月次季節性指数計算（12ヶ月）
    const monthlyAverages = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);

    for (const data of this.historicalData) {
      const month = new Date(data.period).getMonth();
      monthlyAverages[month] += data.inflow.toNumber();
      monthlyCounts[month]++;
    }

    const overallAverage = monthlyAverages.reduce((sum, val, i) =>
      sum + (val / monthlyCounts[i])
    , 0) / 12;

    return monthlyAverages.map((val, i) =>
      (val / monthlyCounts[i]) / overallAverage
    );
  }

  private getCurrentCashBalance(): Decimal {
    // 最新の現金残高取得
    return this.historicalData[this.historicalData.length - 1].endingBalance;
  }

  private calculateHistoricalAverage(type: 'inflow' | 'outflow'): Decimal {
    const total = this.historicalData.reduce(
      (sum, data) => sum.plus(type === 'inflow' ? data.inflow : data.outflow),
      new Decimal(0)
    );

    return total.div(this.historicalData.length);
  }
}

// Distribution Classes
class NormalDistribution {
  constructor(
    private mean: number,
    private stdDev: number
  ) {}

  sample(): number {
    // Box-Muller変換による正規分布サンプリング
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return this.mean + z0 * this.stdDev;
  }
}

// Domain Service: CashFlow Forecast Service
class CashFlowForecastService {
  async forecastAndOptimizeCashFlow(
    input: ForecastCashFlowInput,
    userId: string
  ): Promise<CashFlowForecast> {
    // 1. 過去キャッシュフローデータ取得
    const historicalData = await this.cashFlowRepository.findHistoricalData(
      input.targetIds,
      input.historicalPeriod
    );

    // 2. CashFlowForecast集約生成
    const forecast = new CashFlowForecast(
      generateId('cashflow-forecast-'),
      input.analysisScope,
      input.forecastPeriod,
      input.forecastGranularity,
      historicalData,
      []
    );

    // 3. 予測実行
    let forecastedData: ForecastedCashFlowDataPoint[];
    let monteCarloResults: MonteCarloResults | null = null;

    switch (input.simulationMethod) {
      case 'DETERMINISTIC':
        forecastedData = forecast.deterministicForecast();
        break;
      case 'MONTE_CARLO':
        monteCarloResults = forecast.monteCarloSimulation(
          input.monteCarloIterations ?? 5000
        );
        forecastedData = this.extractForecastFromMonteCarlo(monteCarloResults);
        break;
      case 'SCENARIO':
        const scenarioResults = forecast.scenarioAnalysis();
        forecastedData = this.extractForecastFromScenario(scenarioResults);
        break;
      default:
        forecastedData = forecast.deterministicForecast();
    }

    forecast.forecastedData = forecastedData;

    // 4. 流動性分析
    const liquidityAnalysis = forecast.analyzeLiquidity();

    // 5. 運転資金最適化
    const wcOptimization = forecast.optimizeWorkingCapital();

    // 6. シナリオ分析
    const scenarioAnalysis = forecast.scenarioAnalysis();

    // 7. 最適化戦略生成
    const optimizationStrategies = forecast.generateOptimizationStrategies();

    // 8. 永続化
    await this.forecastRepository.save({
      forecast,
      monteCarloResults,
      liquidityAnalysis,
      wcOptimization,
      scenarioAnalysis,
      optimizationStrategies
    });

    return forecast;
  }
}
```

### BC統合連携

#### BC-002 L3-003: Revenue Management連携
```typescript
// 売掛金・請求予定データ取得
const receivables = await revenueService.getAccountsReceivable({
  projectIds: input.targetIds,
  forecastPeriod: input.forecastPeriod
});
```

#### BC-002 L3-002: Cost Management連携
```typescript
// 買掛金・支払予定データ取得
const payables = await costService.getAccountsPayable({
  projectIds: input.targetIds,
  forecastPeriod: input.forecastPeriod
});
```

#### BC-001: Project Management連携
```typescript
// プロジェクト計画データ取得（将来収益予測）
const projectPlans = await projectService.getProjectPlans(input.targetIds);
```

### トランザクション境界

```typescript
async forecastCashFlowTransaction(
  input: ForecastCashFlowInput,
  userId: string
): Promise<CashFlowForecast> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Forecast作成
    const forecast = await tx.cashFlowForecast.create({ data: forecastData });

    // 2. ForecastedDataPoints作成
    await tx.forecastedCashFlowDataPoint.createMany({
      data: forecastedData
    });

    // 3. MonteCarloResults作成
    if (monteCarloResults) {
      await tx.monteCarloResults.create({
        data: {
          forecastId: forecast.id,
          ...monteCarloResults
        }
      });
    }

    // 4. LiquidityWarnings作成
    if (liquidityWarnings.length > 0) {
      await tx.liquidityWarning.createMany({
        data: liquidityWarnings
      });
    }

    // 5. OptimizationStrategies作成
    await tx.optimizationStrategy.createMany({
      data: optimizationStrategies
    });

    // 6. 監査ログ
    await tx.auditLog.create({
      data: {
        action: 'CASHFLOW_FORECASTED',
        entityType: 'CashFlowForecast',
        entityId: forecast.id,
        userId
      }
    });

    return forecast;
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

| コード | 分類 | 重大度 | リトライ | 説明 |
|--------|------|--------|---------|------|
| ERR_BC002_L3004_OP003_001 | データ不足 | ERROR | × | 過去データ不足 |
| ERR_BC002_L3004_OP003_002 | シミュレーションエラー | ERROR | ○ | モンテカルロ失敗 |
| ERR_BC002_L3004_OP003_003 | 制約違反 | ERROR | × | 流動性制約違反 |
| ERR_BC002_L3004_OP003_004 | パラメータエラー | ERROR | × | 最適化制約不整合 |
| ERR_BC002_L3004_OP003_005 | 計算エラー | WARNING | ○ | 一部期間予測失敗 |

### リトライ戦略

モンテカルロシミュレーションエラー（ERR_002）は、反復回数を減らして1回リトライ可能。その他のエラーは基本的にリトライ不要。

### モンテカルロシミュレーション品質基準

1. **反復回数検証**
   - 最小1,000回（基本精度）
   - 推奨5,000回（標準精度）
   - 最大10,000回（高精度、計算時間増）

2. **収束確認**
   - 平均値の変動係数 < 1%
   - 標準偏差の安定性確認
   - 分布形状の妥当性検証

3. **統計的妥当性**
   - 正規性検定（Shapiro-Wilk検定）
   - 外れ値検出と除外
   - 信頼区間の適切性確認

### 流動性リスク管理

1. **早期警告システム**
   - 最低現金残高を下回る3ヶ月前に警告
   - 流動比率1.0未満の予測時に即座警告
   - キャッシュ不足リスク10%超で注意喚起

2. **緊急時対応計画**
   - 短期借入枠の確保
   - 資産売却オプションの準備
   - 支払優先順位の事前定義

3. **データ保管期間**
   - 予測結果: 7年間保管
   - シミュレーションデータ: 5年間保管
   - 最適化履歴: 5年間保管

---

## 🔗 設計参照

### ドメインモデル
参照: [../../../../domain/README.md](../../../../domain/README.md)

この操作に関連するドメインエンティティ、値オブジェクト、集約の詳細定義は、上記ドメインモデルドキュメントを参照してください。

### API仕様
参照: [../../../../api/README.md](../../../../api/README.md)

この操作を実現するAPIエンドポイント、リクエスト/レスポンス形式、認証・認可要件は、上記API仕様ドキュメントを参照してください。

### データモデル
参照: [../../../../data/README.md](../../../../data/README.md)

この操作が扱うデータ構造、永続化要件、データ整合性制約は、上記データモデルドキュメントを参照してください。

---

## 🎬 UseCases: この操作を実装するユースケース

| UseCase | 説明 | Page | V2移行元 |
|---------|------|------|---------|
| (Phase 4で作成) | - | - | - |

詳細: [usecases/](usecases/)

> **注記**: ユースケースは Phase 4 の実装フェーズで、V2構造から段階的に移行・作成されます。
>
> **Phase 3 (現在)**: Operation構造とREADME作成
> **Phase 4 (次)**: UseCase定義とページ定義の移行
> **Phase 5**: API実装とテストコード

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: この操作はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/forecast-and-optimize-cashflow/](../../../../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/forecast-and-optimize-cashflow/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
