# OP-004: 改善アクションを提案する

**作成日**: 2025-10-31
**所属L3**: L3-004-profitability-analysis-and-optimization: Profitability Analysis And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/propose-improvement-actions

---

## 📋 How: この操作の定義

### 操作の概要
収益性分析の結果に基づき、具体的な改善アクションを提案する。データドリブンな施策提案により、収益性の継続的向上を実現する。

### 実現する機能
- 収益性改善機会の特定
- 改善アクションの優先順位付け
- 改善効果のシミュレーション
- アクション実施計画の作成

### 入力
- 収益性分析結果
- 収益性トレンドデータ
- ベンチマークデータ
- 改善目標

### 出力
- 改善アクション提案リスト
- 優先順位付け結果
- 改善効果シミュレーション
- アクション実施計画

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| profitabilityAnalysisId | UUID | ○ | 収益性分析ID | OP-001の分析結果 |
| trendAnalysisId | UUID | △ | トレンド分析ID | OP-002の分析結果 |
| improvementGoals | ImprovementGoal[] | ○ | 改善目標 | 粗利益率目標等 |
| constraintConditions | ConstraintCondition[] | △ | 制約条件 | 投資上限、期間制約等 |
| benchmarkData | BenchmarkData[] | △ | ベンチマークデータ | 業界平均、競合比較 |
| optimizationFocus | OptimizationFocus[] | ○ | 最適化焦点 | COST_REDUCTION/REVENUE_ENHANCEMENT/EFFICIENCY_IMPROVEMENT |
| scenarioParameters | ScenarioParameters | △ | シナリオパラメータ | 楽観・悲観シナリオ条件 |
| riskTolerance | RiskTolerance | △ | リスク許容度 | CONSERVATIVE/MODERATE/AGGRESSIVE |
| implementationTimeframe | Timeframe | △ | 実施期間 | SHORT_TERM/MEDIUM_TERM/LONG_TERM |
| budgetConstraint | Money | △ | 予算制約 | 改善施策投資上限 |

### 入力例（JSON）
```json
{
  "profitabilityAnalysisId": "profanal-98765",
  "trendAnalysisId": "trend-12345",
  "improvementGoals": [
    {
      "metric": "GROSS_MARGIN",
      "currentValue": 35.0,
      "targetValue": 40.0,
      "targetDate": "2025-12-31",
      "priority": "HIGH"
    },
    {
      "metric": "OPERATING_MARGIN",
      "currentValue": 22.0,
      "targetValue": 28.0,
      "targetDate": "2025-12-31",
      "priority": "MEDIUM"
    }
  ],
  "constraintConditions": [
    {
      "type": "BUDGET_LIMIT",
      "value": "50000000.00",
      "description": "改善施策投資上限"
    },
    {
      "type": "IMPLEMENTATION_PERIOD",
      "value": "12",
      "unit": "MONTHS",
      "description": "実施期間制約"
    }
  ],
  "optimizationFocus": [
    "COST_REDUCTION",
    "REVENUE_ENHANCEMENT"
  ],
  "riskTolerance": "MODERATE",
  "implementationTimeframe": "MEDIUM_TERM",
  "budgetConstraint": {
    "value": "50000000.00",
    "currency": "JPY"
  }
}
```

### バリデーションルール

1. **分析結果存在確認**
   - profitabilityAnalysisId: OP-001分析結果の存在確認必須
   - trendAnalysisId: OP-002分析結果の存在確認（任意）

2. **改善目標整合性検証**
   - 目標値 > 現在値（改善方向の確認）
   - 目標日 > 現在日（将来日付の確認）
   - 目標値の実現可能性検証（ベンチマーク比較）

3. **制約条件整合性**
   - 予算制約: 正の値
   - 実施期間: 1-36ヶ月
   - 複数制約の整合性確認

4. **最適化焦点検証**
   - 最低1つの焦点選択必須
   - 焦点間の優先順位明確化

5. **BC連携検証**
   - 収益性分析データ完全性確認
   - トレンド分析データ整合性確認（指定時）

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "improvementProposalId": "improvement-54321",
    "analysisInput": {
      "profitabilityAnalysisId": "profanal-98765",
      "trendAnalysisId": "trend-12345",
      "improvementGoals": [
        {
          "metric": "GROSS_MARGIN",
          "currentValue": 35.0,
          "targetValue": 40.0,
          "gap": 5.0
        }
      ]
    },
    "improvementOpportunities": {
      "costReduction": [
        {
          "opportunityId": "cost-opp-001",
          "category": "DIRECT_COST_OPTIMIZATION",
          "description": "調達プロセス最適化による材料コスト削減",
          "currentState": {
            "annualCost": "180000000.00",
            "costRatio": 36.0
          },
          "targetState": {
            "annualCost": "162000000.00",
            "costRatio": 32.4
          },
          "potentialSavings": "18000000.00",
          "savingsPercentage": 10.0,
          "implementationCost": "3000000.00",
          "roi": 6.0,
          "paybackPeriod": 2,
          "riskLevel": "LOW",
          "priority": "HIGH"
        },
        {
          "opportunityId": "cost-opp-002",
          "category": "INDIRECT_COST_REDUCTION",
          "description": "業務プロセス自動化による間接費削減",
          "potentialSavings": "12000000.00",
          "implementationCost": "8000000.00",
          "roi": 1.5,
          "paybackPeriod": 8,
          "riskLevel": "MEDIUM",
          "priority": "MEDIUM"
        }
      ],
      "revenueEnhancement": [
        {
          "opportunityId": "revenue-opp-001",
          "category": "PRICING_OPTIMIZATION",
          "description": "価値ベース価格設定による単価向上",
          "currentState": {
            "averageUnitPrice": "5000000.00",
            "salesVolume": 100
          },
          "targetState": {
            "averageUnitPrice": "5500000.00",
            "salesVolume": 95
          },
          "potentialIncrease": "22500000.00",
          "increasePercentage": 4.5,
          "implementationCost": "2000000.00",
          "roi": 11.25,
          "customerChurnRisk": 0.05,
          "riskLevel": "MEDIUM",
          "priority": "HIGH"
        },
        {
          "opportunityId": "revenue-opp-002",
          "category": "UPSELL_CROSSSELL",
          "description": "既存顧客向けアップセル・クロスセル強化",
          "potentialIncrease": "30000000.00",
          "implementationCost": "5000000.00",
          "roi": 6.0,
          "riskLevel": "LOW",
          "priority": "HIGH"
        }
      ],
      "efficiencyImprovement": [
        {
          "opportunityId": "efficiency-opp-001",
          "category": "PROCESS_OPTIMIZATION",
          "description": "プロジェクト管理プロセス効率化",
          "currentMetric": {
            "deliveryTimeAvg": 180,
            "overheadRatio": 25.0
          },
          "targetMetric": {
            "deliveryTimeAvg": 150,
            "overheadRatio": 20.0
          },
          "potentialBenefit": "15000000.00",
          "implementationCost": "4000000.00",
          "roi": 3.75,
          "riskLevel": "LOW",
          "priority": "MEDIUM"
        }
      ]
    },
    "scenarioAnalysis": {
      "pessimisticScenario": {
        "description": "保守的施策実施シナリオ",
        "selectedActions": [
          "cost-opp-001"
        ],
        "totalInvestment": "3000000.00",
        "expectedReturn": "18000000.00",
        "grossMarginImprovement": 3.6,
        "targetGrossMargin": 38.6,
        "riskLevel": "LOW",
        "successProbability": 0.85
      },
      "moderateScenario": {
        "description": "バランス型施策実施シナリオ",
        "selectedActions": [
          "cost-opp-001",
          "cost-opp-002",
          "revenue-opp-002"
        ],
        "totalInvestment": "16000000.00",
        "expectedReturn": "60000000.00",
        "grossMarginImprovement": 12.0,
        "targetGrossMargin": 47.0,
        "riskLevel": "MEDIUM",
        "successProbability": 0.70
      },
      "aggressiveScenario": {
        "description": "積極的施策実施シナリオ",
        "selectedActions": [
          "cost-opp-001",
          "cost-opp-002",
          "revenue-opp-001",
          "revenue-opp-002",
          "efficiency-opp-001"
        ],
        "totalInvestment": "22000000.00",
        "expectedReturn": "97500000.00",
        "grossMarginImprovement": 19.5,
        "targetGrossMargin": 54.5,
        "riskLevel": "HIGH",
        "successProbability": 0.55
      }
    },
    "recommendedActionPlan": {
      "planName": "収益性改善総合プラン（中期）",
      "scenario": "MODERATE",
      "prioritizedActions": [
        {
          "actionId": "cost-opp-001",
          "actionName": "調達プロセス最適化",
          "implementation": {
            "phase": "PHASE_1",
            "startMonth": 1,
            "durationMonths": 3,
            "milestones": [
              "サプライヤー選定基準見直し（1ヶ月）",
              "新規調達プロセス設計（2ヶ月）",
              "システム導入・移行（3ヶ月）"
            ]
          },
          "resourceRequirements": {
            "budget": "3000000.00",
            "headcount": 2,
            "specialistSkills": ["調達管理", "システム導入"]
          },
          "expectedOutcomes": {
            "cost Savings": "18000000.00",
            "impactOnGrossMargin": 3.6,
            "realizationTimeframe": "6ヶ月"
          },
          "risks": [
            {
              "risk": "サプライヤー切替による品質低下",
              "probability": 0.20,
              "impact": "MEDIUM",
              "mitigation": "品質基準強化と定期監査"
            }
          ]
        },
        {
          "actionId": "revenue-opp-002",
          "actionName": "アップセル・クロスセル強化",
          "implementation": {
            "phase": "PHASE_2",
            "startMonth": 4,
            "durationMonths": 6
          },
          "expectedOutcomes": {
            "revenueIncrease": "30000000.00",
            "impactOnGrossMargin": 6.0
          }
        },
        {
          "actionId": "cost-opp-002",
          "actionName": "業務プロセス自動化",
          "implementation": {
            "phase": "PHASE_2",
            "startMonth": 4,
            "durationMonths": 8
          },
          "expectedOutcomes": {
            "costSavings": "12000000.00",
            "impactOnGrossMargin": 2.4
          }
        }
      ],
      "totalInvestment": "16000000.00",
      "expectedTotalReturn": "60000000.00",
      "aggregateROI": 3.75,
      "timeToBreakeven": "5ヶ月",
      "targetGrossMargin": 47.0,
      "targetOperatingMargin": 30.0,
      "implementationPeriod": "12ヶ月"
    },
    "sensitivityAnalysis": {
      "keyAssumptions": [
        {
          "assumption": "コスト削減効果",
          "baseCase": 10.0,
          "pessimisticCase": 7.0,
          "optimisticCase": 13.0,
          "impactOnROI": {
            "pessimistic": 2.63,
            "optimistic": 4.88
          }
        },
        {
          "assumption": "売上増加率",
          "baseCase": 6.0,
          "pessimisticCase": 3.0,
          "optimisticCase": 9.0,
          "impactOnROI": {
            "pessimistic": 2.81,
            "optimistic": 4.69
          }
        }
      ],
      "tornadoDiagram": {
        "mostSensitiveFactors": [
          {
            "factor": "売上増加率",
            "impactRange": 1.88
          },
          {
            "factor": "コスト削減効果",
            "impactRange": 2.25
          }
        ]
      }
    },
    "monitoringKPIs": [
      {
        "kpi": "粗利益率",
        "baseline": 35.0,
        "target": 47.0,
        "milestones": [
          { "month": 3, "target": 37.0 },
          { "month": 6, "target": 40.0 },
          { "month": 9, "target": 43.0 },
          { "month": 12, "target": 47.0 }
        ],
        "trackingFrequency": "MONTHLY"
      },
      {
        "kpi": "営業利益率",
        "baseline": 22.0,
        "target": 30.0,
        "trackingFrequency": "MONTHLY"
      },
      {
        "kpi": "コスト削減額",
        "baseline": 0,
        "target": "30000000.00",
        "trackingFrequency": "MONTHLY"
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "createdBy": "user-999"
  },
  "message": "改善アクション提案が正常に完了しました。"
}
```

### エラーレスポンス

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3004_OP004_001",
    "message": "収益性分析結果が見つかりません",
    "details": {
      "profitabilityAnalysisId": "profanal-98765",
      "required": true
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3004_OP004_001 | 400 | 分析結果不在 | OP-001実行後に再実行 |
| ERR_BC002_L3004_OP004_002 | 422 | 目標値不整合 | 実現可能な目標値に調整 |
| ERR_BC002_L3004_OP004_003 | 422 | 制約条件違反 | 制約条件の緩和または見直し |
| ERR_BC002_L3004_OP004_004 | 422 | 最適化失敗 | パラメータ調整または焦点変更 |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: ImprovementProposal Aggregate

```typescript
import Decimal from 'decimal.js';

// ImprovementProposal Aggregate Root
class ImprovementProposal {
  constructor(
    public id: string,
    public profitabilityAnalysis: ProfitabilityAnalysis,
    public trendAnalysis: ProfitabilityTrendAnalysis | null,
    public improvementGoals: ImprovementGoal[],
    public opportunities: ImprovementOpportunity[],
    public scenarios: Scenario[]
  ) {}

  // 改善機会識別
  identifyOpportunities(
    focus: OptimizationFocus[],
    constraints: ConstraintCondition[]
  ): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];

    for (const focusArea of focus) {
      switch (focusArea) {
        case 'COST_REDUCTION':
          opportunities.push(...this.identifyCostReductionOpportunities());
          break;
        case 'REVENUE_ENHANCEMENT':
          opportunities.push(...this.identifyRevenueEnhancementOpportunities());
          break;
        case 'EFFICIENCY_IMPROVEMENT':
          opportunities.push(...this.identifyEfficiencyImprovementOpportunities());
          break;
      }
    }

    // 制約条件でフィルタリング
    return this.filterByConstraints(opportunities, constraints);
  }

  // コスト削減機会の識別
  private identifyCostReductionOpportunities(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];

    // 1. 直接費削減機会
    const directCostOpps = this.analyzeDirectCostReduction();
    opportunities.push(...directCostOpps);

    // 2. 間接費削減機会
    const indirectCostOpps = this.analyzeIndirectCostReduction();
    opportunities.push(...indirectCostOpps);

    // 3. 変動費最適化機会
    const variableCostOpps = this.analyzeVariableCostOptimization();
    opportunities.push(...variableCostOpps);

    return opportunities;
  }

  private analyzeDirectCostReduction(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];
    const currentCosts = this.profitabilityAnalysis.totalCosts;

    // ベンチマーク比較
    const industryAvgCostRatio = new Decimal(32); // 業界平均32%
    const currentCostRatio = currentCosts.value
      .div(this.profitabilityAnalysis.totalRevenue.value)
      .mul(100);

    if (currentCostRatio.greaterThan(industryAvgCostRatio)) {
      // 削減ポテンシャル計算
      const potentialSavings = this.profitabilityAnalysis.totalRevenue.value
        .mul(currentCostRatio.minus(industryAvgCostRatio))
        .div(100);

      const opportunity = new ImprovementOpportunity(
        generateId('cost-opp-'),
        'COST_REDUCTION',
        'DIRECT_COST_OPTIMIZATION',
        '調達プロセス最適化による材料コスト削減',
        {
          annualCost: currentCosts.value,
          costRatio: currentCostRatio
        },
        {
          annualCost: currentCosts.value.minus(potentialSavings),
          costRatio: industryAvgCostRatio
        },
        potentialSavings,
        potentialSavings.div(currentCosts.value).mul(100),
        this.estimateImplementationCost('PROCUREMENT_OPTIMIZATION'),
        null, // 後で計算
        this.estimatePaybackPeriod(potentialSavings, null),
        'LOW',
        'HIGH'
      );

      // ROI計算
      opportunity.roi = opportunity.potentialSavings.div(opportunity.implementationCost);

      opportunities.push(opportunity);
    }

    return opportunities;
  }

  // 収益向上機会の識別
  private identifyRevenueEnhancementOpportunities(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];

    // 1. 価格最適化機会
    const pricingOpps = this.analyzePricingOptimization();
    opportunities.push(...pricingOpps);

    // 2. アップセル・クロスセル機会
    const upsellOpps = this.analyzeUpsellCrosssellOpportunities();
    opportunities.push(...upsellOpps);

    // 3. 新規顧客獲得機会
    const newCustomerOpps = this.analyzeNewCustomerAcquisition();
    opportunities.push(...newCustomerOpps);

    return opportunities;
  }

  private analyzePricingOptimization(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];

    // 価格弾力性分析（トレンドデータから）
    if (!this.trendAnalysis) return opportunities;

    const currentAveragePrice = this.calculateAverageUnitPrice();
    const priceElasticity = this.estimatePriceElasticity();

    // 価格10%上昇シミュレーション
    const priceIncrease = new Decimal(0.10); // 10%
    const demandDecrease = priceElasticity.mul(priceIncrease);

    const newPrice = currentAveragePrice.mul(new Decimal(1).plus(priceIncrease));
    const newVolume = this.getCurrentSalesVolume().mul(
      new Decimal(1).minus(demandDecrease)
    );

    const currentRevenue = currentAveragePrice.mul(this.getCurrentSalesVolume());
    const newRevenue = newPrice.mul(newVolume);
    const potentialIncrease = newRevenue.minus(currentRevenue);

    if (potentialIncrease.greaterThan(0)) {
      const opportunity = new ImprovementOpportunity(
        generateId('revenue-opp-'),
        'REVENUE_ENHANCEMENT',
        'PRICING_OPTIMIZATION',
        '価値ベース価格設定による単価向上',
        {
          averageUnitPrice: currentAveragePrice,
          salesVolume: this.getCurrentSalesVolume()
        },
        {
          averageUnitPrice: newPrice,
          salesVolume: newVolume
        },
        potentialIncrease,
        potentialIncrease.div(currentRevenue).mul(100),
        this.estimateImplementationCost('PRICING_STRATEGY'),
        null,
        this.estimatePaybackPeriod(potentialIncrease, null),
        'MEDIUM',
        'HIGH'
      );

      opportunity.roi = opportunity.potentialSavings.div(opportunity.implementationCost);
      opportunities.push(opportunity);
    }

    return opportunities;
  }

  // 効率改善機会の識別
  private identifyEfficiencyImprovementOpportunities(): ImprovementOpportunity[] {
    const opportunities: ImprovementOpportunity[] = [];

    // 1. プロセス最適化
    const processOpps = this.analyzeProcessOptimization();
    opportunities.push(...processOpps);

    // 2. 自動化機会
    const automationOpps = this.analyzeAutomationOpportunities();
    opportunities.push(...automationOpps);

    // 3. リソース最適化
    const resourceOpps = this.analyzeResourceOptimization();
    opportunities.push(...resourceOpps);

    return opportunities;
  }

  // シナリオ分析
  analyzeScenarios(
    opportunities: ImprovementOpportunity[],
    riskTolerance: RiskTolerance
  ): Scenario[] {
    const scenarios: Scenario[] = [];

    // 1. 悲観的シナリオ（低リスク施策のみ）
    const pessimisticScenario = this.buildScenario(
      'PESSIMISTIC',
      opportunities.filter(opp => opp.riskLevel === 'LOW'),
      0.85
    );
    scenarios.push(pessimisticScenario);

    // 2. 中立的シナリオ（バランス型）
    const moderateScenario = this.buildScenario(
      'MODERATE',
      opportunities.filter(opp =>
        opp.riskLevel === 'LOW' || opp.riskLevel === 'MEDIUM'
      ),
      0.70
    );
    scenarios.push(moderateScenario);

    // 3. 楽観的シナリオ（全施策実施）
    const aggressiveScenario = this.buildScenario(
      'AGGRESSIVE',
      opportunities,
      0.55
    );
    scenarios.push(aggressiveScenario);

    // リスク許容度に基づく推奨シナリオ選択
    const recommendedScenario = this.selectRecommendedScenario(
      scenarios,
      riskTolerance
    );
    recommendedScenario.isRecommended = true;

    return scenarios;
  }

  private buildScenario(
    type: string,
    opportunities: ImprovementOpportunity[],
    successProbability: number
  ): Scenario {
    // ROI順にソート
    const sortedOpps = opportunities.sort((a, b) =>
      b.roi.minus(a.roi).toNumber()
    );

    // 予算制約内で最大ROIを達成する組み合わせ選択（ナップサック問題）
    const selectedActions = this.solveKnapsackProblem(
      sortedOpps,
      this.budgetConstraint
    );

    const totalInvestment = selectedActions.reduce(
      (sum, opp) => sum.plus(opp.implementationCost),
      new Decimal(0)
    );

    const expectedReturn = selectedActions.reduce(
      (sum, opp) => sum.plus(opp.potentialSavings),
      new Decimal(0)
    );

    // 粗利益率改善計算
    const grossMarginImprovement = expectedReturn
      .div(this.profitabilityAnalysis.totalRevenue.value)
      .mul(100);

    const currentGrossMargin = this.profitabilityAnalysis.calculateGrossMargin();
    const targetGrossMargin = currentGrossMargin.plus(grossMarginImprovement);

    return new Scenario(
      generateId(`scenario-${type.toLowerCase()}-`),
      type,
      this.getScenarioDescription(type),
      selectedActions.map(opp => opp.id),
      totalInvestment,
      expectedReturn,
      grossMarginImprovement,
      targetGrossMargin,
      this.assessRiskLevel(selectedActions),
      successProbability,
      false
    );
  }

  // ナップサック問題解決（動的計画法）
  private solveKnapsackProblem(
    opportunities: ImprovementOpportunity[],
    budgetLimit: Decimal
  ): ImprovementOpportunity[] {
    // 簡略化: 貪欲法（ROI順に選択）
    const selected: ImprovementOpportunity[] = [];
    let remainingBudget = budgetLimit;

    for (const opp of opportunities) {
      if (opp.implementationCost.lessThanOrEqualTo(remainingBudget)) {
        selected.push(opp);
        remainingBudget = remainingBudget.minus(opp.implementationCost);
      }
    }

    return selected;
  }

  // 推奨アクションプラン生成
  generateRecommendedActionPlan(
    scenario: Scenario
  ): RecommendedActionPlan {
    const prioritizedActions = this.prioritizeActions(
      scenario.selectedActions.map(id =>
        this.opportunities.find(opp => opp.id === id)!
      )
    );

    // フェーズ分け（短期・中期・長期）
    const phasedActions = this.phaseActions(prioritizedActions);

    // リソース要件計算
    const totalResourceRequirements = this.calculateTotalResourceRequirements(
      phasedActions
    );

    // 期待成果集計
    const aggregatedOutcomes = this.aggregateExpectedOutcomes(phasedActions);

    return new RecommendedActionPlan(
      generateId('action-plan-'),
      '収益性改善総合プラン（中期）',
      scenario.type,
      phasedActions,
      scenario.totalInvestment,
      scenario.expectedReturn,
      scenario.expectedReturn.div(scenario.totalInvestment),
      this.calculateTimeToBreakeven(phasedActions),
      scenario.targetGrossMargin,
      this.estimateTargetOperatingMargin(scenario),
      this.estimateImplementationPeriod(phasedActions)
    );
  }

  // 感度分析
  performSensitivityAnalysis(
    actionPlan: RecommendedActionPlan
  ): SensitivityAnalysis {
    const keyAssumptions = this.identifyKeyAssumptions(actionPlan);
    const sensitivityResults: SensitivityResult[] = [];

    for (const assumption of keyAssumptions) {
      // 悲観ケース・楽観ケースでROI再計算
      const pessimisticROI = this.recalculateROI(
        actionPlan,
        assumption.name,
        assumption.pessimisticValue
      );

      const optimisticROI = this.recalculateROI(
        actionPlan,
        assumption.name,
        assumption.optimisticValue
      );

      sensitivityResults.push(
        new SensitivityResult(
          assumption.name,
          assumption.baseCase,
          assumption.pessimisticCase,
          assumption.optimisticCase,
          {
            pessimistic: pessimisticROI,
            optimistic: optimisticROI
          }
        )
      );
    }

    // トルネード図用データ（影響度順にソート）
    const tornadoDiagram = this.generateTornadoDiagram(sensitivityResults);

    return new SensitivityAnalysis(
      keyAssumptions,
      tornadoDiagram
    );
  }

  // モニタリングKPI設定
  defineMonitoringKPIs(
    actionPlan: RecommendedActionPlan
  ): MonitoringKPI[] {
    const kpis: MonitoringKPI[] = [];

    // 1. 粗利益率KPI
    kpis.push(
      new MonitoringKPI(
        '粗利益率',
        this.profitabilityAnalysis.calculateGrossMargin(),
        actionPlan.targetGrossMargin,
        this.generateMilestones(
          this.profitabilityAnalysis.calculateGrossMargin(),
          actionPlan.targetGrossMargin,
          actionPlan.implementationPeriod
        ),
        'MONTHLY'
      )
    );

    // 2. 営業利益率KPI
    kpis.push(
      new MonitoringKPI(
        '営業利益率',
        this.profitabilityAnalysis.calculateOperatingMargin(null),
        actionPlan.targetOperatingMargin,
        this.generateMilestones(
          this.profitabilityAnalysis.calculateOperatingMargin(null),
          actionPlan.targetOperatingMargin,
          actionPlan.implementationPeriod
        ),
        'MONTHLY'
      )
    );

    // 3. コスト削減額KPI
    const totalCostSavings = actionPlan.prioritizedActions
      .filter(action => action.category.includes('COST'))
      .reduce(
        (sum, action) => sum.plus(action.potentialSavings),
        new Decimal(0)
      );

    kpis.push(
      new MonitoringKPI(
        'コスト削減額',
        new Decimal(0),
        totalCostSavings,
        this.generateCumulativeMilestones(totalCostSavings, actionPlan.implementationPeriod),
        'MONTHLY'
      )
    );

    // 4. 売上増加額KPI
    const totalRevenueIncrease = actionPlan.prioritizedActions
      .filter(action => action.category.includes('REVENUE'))
      .reduce(
        (sum, action) => sum.plus(action.potentialSavings),
        new Decimal(0)
      );

    if (totalRevenueIncrease.greaterThan(0)) {
      kpis.push(
        new MonitoringKPI(
          '売上増加額',
          new Decimal(0),
          totalRevenueIncrease,
          this.generateCumulativeMilestones(totalRevenueIncrease, actionPlan.implementationPeriod),
          'MONTHLY'
        )
      );
    }

    return kpis;
  }

  private generateMilestones(
    baseline: Decimal,
    target: Decimal,
    periodMonths: number
  ): Milestone[] {
    const milestones: Milestone[] = [];
    const totalImprovement = target.minus(baseline);
    const quarterlyImprovement = totalImprovement.div(periodMonths / 3);

    for (let month = 3; month <= periodMonths; month += 3) {
      const milestoneTarget = baseline.plus(
        quarterlyImprovement.mul(month / 3)
      );
      milestones.push(new Milestone(month, milestoneTarget));
    }

    return milestones;
  }

  private estimateImplementationCost(category: string): Decimal {
    // カテゴリ別の実装コスト見積もり
    const costEstimates: Record<string, number> = {
      'PROCUREMENT_OPTIMIZATION': 3000000,
      'PROCESS_AUTOMATION': 8000000,
      'PRICING_STRATEGY': 2000000,
      'UPSELL_PROGRAM': 5000000,
      'PROCESS_REDESIGN': 4000000
    };

    return new Decimal(costEstimates[category] ?? 5000000);
  }

  private estimatePaybackPeriod(
    savings: Decimal,
    implementationCost: Decimal | null
  ): number {
    if (!implementationCost) return 0;

    const monthlySavings = savings.div(12);
    const paybackMonths = implementationCost.div(monthlySavings);

    return Math.ceil(paybackMonths.toNumber());
  }
}

// Domain Service: Improvement Proposal Service
class ImprovementProposalService {
  async proposeImprovementActions(
    input: ProposeImprovementInput,
    userId: string
  ): Promise<ImprovementProposal> {
    // 1. 収益性分析結果取得
    const profitabilityAnalysis = await this.profitabilityRepository.findById(
      input.profitabilityAnalysisId
    );

    if (!profitabilityAnalysis) {
      throw new DomainError('収益性分析結果が見つかりません');
    }

    // 2. トレンド分析結果取得（任意）
    let trendAnalysis: ProfitabilityTrendAnalysis | null = null;
    if (input.trendAnalysisId) {
      trendAnalysis = await this.trendRepository.findById(input.trendAnalysisId);
    }

    // 3. ImprovementProposal集約生成
    const proposal = new ImprovementProposal(
      generateId('improvement-'),
      profitabilityAnalysis,
      trendAnalysis,
      input.improvementGoals,
      [],
      []
    );

    // 4. 改善機会識別
    const opportunities = proposal.identifyOpportunities(
      input.optimizationFocus,
      input.constraintConditions ?? []
    );
    proposal.opportunities = opportunities;

    // 5. シナリオ分析
    const scenarios = proposal.analyzeScenarios(
      opportunities,
      input.riskTolerance ?? 'MODERATE'
    );
    proposal.scenarios = scenarios;

    // 6. 推奨アクションプラン生成
    const recommendedScenario = scenarios.find(s => s.isRecommended)!;
    const actionPlan = proposal.generateRecommendedActionPlan(recommendedScenario);

    // 7. 感度分析
    const sensitivityAnalysis = proposal.performSensitivityAnalysis(actionPlan);

    // 8. モニタリングKPI設定
    const monitoringKPIs = proposal.defineMonitoringKPIs(actionPlan);

    // 9. 永続化
    await this.proposalRepository.save({
      proposal,
      actionPlan,
      sensitivityAnalysis,
      monitoringKPIs
    });

    return proposal;
  }
}
```

### BC統合連携

#### BC-002 L3-001/L3-002/L3-003: Profitability Data連携
```typescript
// 収益性分析結果取得
const profitabilityAnalysis = await profitabilityService.getAnalysis(
  input.profitabilityAnalysisId
);

// トレンド分析結果取得
const trendAnalysis = await trendService.getTrendAnalysis(
  input.trendAnalysisId
);
```

#### BC-001: Project Management連携
```typescript
// プロジェクトパフォーマンスデータ取得
const projectPerformance = await projectService.getProjectPerformance(
  profitabilityAnalysis.targetIds
);
```

### トランザクション境界

```typescript
async proposeImprovementTransaction(
  input: ProposeImprovementInput,
  userId: string
): Promise<ImprovementProposal> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Proposal作成
    const proposal = await tx.improvementProposal.create({ data: proposalData });

    // 2. Opportunities作成
    await tx.improvementOpportunity.createMany({
      data: opportunities
    });

    // 3. Scenarios作成
    await tx.scenario.createMany({
      data: scenarios
    });

    // 4. ActionPlan作成
    await tx.recommendedActionPlan.create({
      data: {
        proposalId: proposal.id,
        ...actionPlanData
      }
    });

    // 5. MonitoringKPIs作成
    await tx.monitoringKPI.createMany({
      data: monitoringKPIs
    });

    // 6. 監査ログ
    await tx.auditLog.create({
      data: {
        action: 'IMPROVEMENT_PROPOSED',
        entityType: 'ImprovementProposal',
        entityId: proposal.id,
        userId
      }
    });

    return proposal;
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

| コード | 分類 | 重大度 | リトライ | 説明 |
|--------|------|--------|---------|------|
| ERR_BC002_L3004_OP004_001 | データ不在 | ERROR | × | 分析結果不在 |
| ERR_BC002_L3004_OP004_002 | パラメータエラー | ERROR | × | 目標値不整合 |
| ERR_BC002_L3004_OP004_003 | 制約違反 | ERROR | × | 制約条件違反 |
| ERR_BC002_L3004_OP004_004 | 最適化エラー | ERROR | ○ | 最適化失敗 |
| ERR_BC002_L3004_OP004_005 | 計算エラー | WARNING | ○ | 一部指標計算失敗 |

### リトライ戦略

最適化エラー（ERR_004）は、パラメータ調整後に1回リトライ可能。その他のエラーは基本的にリトライ不要。

### 提案品質基準

1. **改善機会識別品質**
   - 最低3つの機会識別必須
   - ROI > 1.5の機会を優先
   - リスク評価の妥当性確認

2. **シナリオ分析品質**
   - 3シナリオ（悲観/中立/楽観）必須
   - 成功確率の妥当性検証
   - 制約条件遵守確認

3. **アクションプラン実現可能性**
   - 実施期間の妥当性
   - リソース要件の現実性
   - マイルストーンの達成可能性

### 財務提案コンプライアンス

1. **提案の透明性**
   - 前提条件の明示
   - 計算ロジックの開示
   - リスクの明確な説明

2. **実施責任**
   - 提案は助言であり保証ではない旨明記
   - 実施判断は経営層の責任
   - モニタリング結果に基づく調整推奨

3. **データ保管期間**
   - 改善提案: 7年間保管
   - 実施結果: 7年間保管
   - モニタリングデータ: 5年間保管

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
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/propose-improvement-actions/](../../../../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/propose-improvement-actions/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-004 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
