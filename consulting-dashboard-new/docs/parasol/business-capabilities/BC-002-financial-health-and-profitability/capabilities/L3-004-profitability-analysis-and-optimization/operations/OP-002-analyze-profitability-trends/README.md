# OP-002: 収益性トレンドを分析する

**作成日**: 2025-10-31
**所属L3**: L3-004-profitability-analysis-and-optimization: Profitability Analysis And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/analyze-profitability-trends

---

## 📋 How: この操作の定義

### 操作の概要
時系列での収益性変化を分析し、トレンドを可視化する。収益性の改善・悪化要因を特定し、戦略的意思決定を支援する。

### 実現する機能
- 時系列収益性分析とトレンド可視化
- 収益性変動要因の特定
- プロジェクトタイプ別収益性比較
- ベンチマーク分析

### 入力
- 過去の収益性データ
- 分析期間の指定
- 比較軸（プロジェクトタイプ、部門等）
- ベンチマークデータ

### 出力
- 収益性トレンドレポート
- 変動要因分析結果
- プロジェクトタイプ別比較
- ベンチマーク比較レポート

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| analysisScope | AnalysisScope | ○ | 分析範囲 | PROJECT/DEPARTMENT/COMPANY |
| targetIds | UUID[] | △ | 対象ID配列 | スコープ=PROJECT時必須 |
| analysisPeriod | DateRange | ○ | 分析期間 | 開始日≤終了日、最大36ヶ月 |
| trendGranularity | TrendGranularity | ○ | トレンド粒度 | DAILY/WEEKLY/MONTHLY/QUARTERLY |
| profitabilityMetrics | ProfitabilityMetric[] | ○ | 分析指標 | GROSS_MARGIN/OPERATING_MARGIN/NET_MARGIN/ROI/EBITDA |
| comparisonPeriods | DateRange[] | △ | 比較期間配列 | 前年同期、前四半期等 |
| regressionModel | RegressionModel | △ | 回帰モデル | LINEAR/POLYNOMIAL/EXPONENTIAL |
| confidenceLevel | DECIMAL | △ | 信頼区間レベル | 0.90/0.95/0.99 (default: 0.95) |
| benchmarkData | BenchmarkData[] | △ | ベンチマークデータ | 業界平均、競合比較等 |
| detectionSensitivity | Sensitivity | △ | 異常検知感度 | LOW/MEDIUM/HIGH (default: MEDIUM) |

### 入力例（JSON）
```json
{
  "analysisScope": "PROJECT",
  "targetIds": ["proj-12345", "proj-67890"],
  "analysisPeriod": {
    "startDate": "2022-01-01",
    "endDate": "2024-12-31"
  },
  "trendGranularity": "MONTHLY",
  "profitabilityMetrics": [
    "GROSS_MARGIN",
    "OPERATING_MARGIN",
    "EBITDA",
    "ROI"
  ],
  "comparisonPeriods": [
    {
      "startDate": "2021-01-01",
      "endDate": "2021-12-31"
    }
  ],
  "regressionModel": "LINEAR",
  "confidenceLevel": 0.95,
  "detectionSensitivity": "MEDIUM"
}
```

### バリデーションルール

1. **期間整合性検証**
   - 分析期間.開始日 ≤ 分析期間.終了日
   - 分析期間 ≤ 36ヶ月（トレンド分析の有意性確保）
   - 比較期間配列: 各期間長が分析期間と同一またはそれ以下
   - trendGranularity = DAILY: 分析期間 ≤ 3ヶ月
   - trendGranularity = WEEKLY: 分析期間 ≤ 12ヶ月

2. **スコープ別必須パラメータ**
   - PROJECT: targetIds必須（1件以上100件以下）
   - DEPARTMENT: targetIds必須（部門ID、1件以上）
   - COMPANY: targetIds不要（全社集計）

3. **トレンド分析要件**
   - regressionModel指定時: 最小データポイント数確認
     - LINEAR: 最低12ポイント
     - POLYNOMIAL: 最低24ポイント
     - EXPONENTIAL: 最低36ポイント
   - confidenceLevel: 統計的有意性確保（サンプル数依存）

4. **指標計算可能性**
   - 全指標: 連続した収益・コストデータ存在確認
   - EBITDA: 減価償却費データ存在確認
   - ROI: 投資額データの時系列存在確認
   - 欠損データ: 最大20%まで補間許容

5. **BC連携検証**
   - Project存在確認（スコープ=PROJECT時）
   - 時系列収益データ完全性確認（L3-003連携）
   - 時系列コストデータ完全性確認（L3-002連携）

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "trendAnalysisId": "trend-98765",
    "analysisScope": "PROJECT",
    "analysisPeriod": {
      "startDate": "2022-01-01",
      "endDate": "2024-12-31"
    },
    "trendGranularity": "MONTHLY",
    "timeSeriesData": {
      "dataPoints": [
        {
          "period": "2024-01",
          "grossMargin": {
            "value": 35.5,
            "trend": "INCREASING",
            "changeFromPrevious": 2.3
          },
          "operatingMargin": {
            "value": 22.8,
            "trend": "STABLE",
            "changeFromPrevious": 0.5
          },
          "ebitda": {
            "value": "45000000.00",
            "trend": "INCREASING",
            "changeFromPrevious": 8.2
          },
          "roi": {
            "value": 28.5,
            "trend": "INCREASING",
            "changeFromPrevious": 3.1
          }
        }
      ],
      "totalDataPoints": 36
    },
    "regressionAnalysis": {
      "model": "LINEAR",
      "grossMarginTrend": {
        "equation": "y = 0.35x + 30.2",
        "rSquared": 0.87,
        "slope": 0.35,
        "intercept": 30.2,
        "pValue": 0.001,
        "significance": "HIGH",
        "forecast": {
          "nextQuarter": 37.8,
          "nextYear": 42.5
        },
        "confidenceInterval": {
          "lower": 36.2,
          "upper": 39.4,
          "level": 0.95
        }
      },
      "operatingMarginTrend": {
        "equation": "y = 0.18x + 20.5",
        "rSquared": 0.76,
        "slope": 0.18,
        "intercept": 20.5,
        "pValue": 0.005,
        "significance": "MEDIUM"
      }
    },
    "periodOverPeriodComparison": {
      "currentPeriod": {
        "avgGrossMargin": 36.2,
        "avgOperatingMargin": 23.5,
        "avgEbitda": "47000000.00",
        "avgRoi": 29.8
      },
      "previousPeriod": {
        "avgGrossMargin": 33.8,
        "avgOperatingMargin": 21.2,
        "avgEbitda": "42000000.00",
        "avgRoi": 26.1
      },
      "growth": {
        "grossMarginGrowth": 7.1,
        "operatingMarginGrowth": 10.8,
        "ebitdaGrowth": 11.9,
        "roiGrowth": 14.2
      },
      "trendDirection": "POSITIVE",
      "acceleration": "INCREASING"
    },
    "anomalyDetection": {
      "anomaliesDetected": [
        {
          "period": "2024-03",
          "metric": "GROSS_MARGIN",
          "actualValue": 42.5,
          "expectedValue": 36.2,
          "deviation": 6.3,
          "significance": "HIGH",
          "possibleCauses": [
            "大型プロジェクト完了",
            "コスト削減施策効果"
          ]
        }
      ],
      "totalAnomalies": 3
    },
    "benchmarkComparison": {
      "industryBenchmark": {
        "grossMargin": 32.0,
        "operatingMargin": 18.5,
        "ebitda": "38000000.00"
      },
      "performance": {
        "grossMarginVsBenchmark": 4.2,
        "operatingMarginVsBenchmark": 5.0,
        "ebitdaVsBenchmark": 23.7,
        "overallRanking": "TOP_QUARTILE"
      }
    },
    "variationFactors": {
      "topGrowthDrivers": [
        {
          "factor": "プロジェクト単価向上",
          "contribution": 45.2,
          "impactScore": "HIGH"
        },
        {
          "factor": "コスト最適化施策",
          "contribution": 32.8,
          "impactScore": "MEDIUM"
        }
      ],
      "topDeclineFactors": [
        {
          "factor": "間接費増加",
          "contribution": -15.3,
          "impactScore": "MEDIUM"
        }
      ]
    },
    "insights": [
      {
        "type": "POSITIVE_TREND",
        "message": "粗利益率が36ヶ月連続で改善傾向",
        "confidence": 0.95,
        "actionable": true,
        "recommendation": "現在の収益性改善施策を継続"
      },
      {
        "type": "ACCELERATION",
        "message": "営業利益率の改善速度が加速",
        "confidence": 0.89,
        "actionable": true,
        "recommendation": "効果的な施策の他部門展開を検討"
      }
    ],
    "createdAt": "2024-12-31T18:00:00Z",
    "createdBy": "user-999"
  },
  "message": "収益性トレンド分析が正常に完了しました。"
}
```

### エラーレスポンス

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3004_OP002_001",
    "message": "時系列データが不足しています",
    "details": {
      "projectId": "proj-12345",
      "missingMonths": ["2023-05", "2023-07", "2023-08"],
      "dataCompleteness": 72.0
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3004_OP002_001 | 400 | 時系列データ不足 | データポイントの補完 |
| ERR_BC002_L3004_OP002_002 | 400 | データ粒度不整合 | 粒度の統一または調整 |
| ERR_BC002_L3004_OP002_003 | 422 | 回帰分析失敗 | モデル変更またはデータ確認 |
| ERR_BC002_L3004_OP002_004 | 422 | 統計的有意性不足 | 分析期間の延長 |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: ProfitabilityTrend Aggregate

```typescript
import Decimal from 'decimal.js';
import * as ss from 'simple-statistics'; // 統計ライブラリ

// ProfitabilityTrend Aggregate Root
class ProfitabilityTrendAnalysis {
  constructor(
    public id: string,
    public scope: AnalysisScope,
    public period: DateRange,
    public granularity: TrendGranularity,
    public timeSeriesData: TimeSeriesDataPoint[],
    public regressionResults: Map<ProfitabilityMetric, RegressionResult>
  ) {}

  // 時系列トレンド分析（線形回帰）
  analyzeLinearTrend(metric: ProfitabilityMetric): RegressionResult {
    const data = this.timeSeriesData
      .map((point, index) => [index + 1, point.metrics.get(metric)!.value.toNumber()])
      .filter(([_, value]) => value !== null && !isNaN(value));

    if (data.length < 12) {
      throw new DomainError('トレンド分析には最低12データポイントが必要です');
    }

    // 線形回帰分析
    const regressionLine = ss.linearRegression(data);
    const rSquared = ss.rSquared(data, regressionLine);
    const { slope, intercept } = ss.linearRegressionLine(regressionLine);

    // p値計算（統計的有意性）
    const pValue = this.calculatePValue(data, regressionLine);

    // 予測値算出
    const nextQuarter = slope * (data.length + 3) + intercept;
    const nextYear = slope * (data.length + 12) + intercept;

    // 信頼区間計算（95%）
    const confidenceInterval = this.calculateConfidenceInterval(
      data,
      regressionLine,
      0.95
    );

    return new RegressionResult(
      `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
      new Decimal(rSquared),
      new Decimal(slope),
      new Decimal(intercept),
      new Decimal(pValue),
      this.determineSignificance(pValue),
      {
        nextQuarter: new Decimal(nextQuarter),
        nextYear: new Decimal(nextYear)
      },
      confidenceInterval
    );
  }

  // 多項式回帰分析（高次トレンド検出）
  analyzePolynomialTrend(
    metric: ProfitabilityMetric,
    degree: number = 2
  ): RegressionResult {
    const data = this.extractMetricData(metric);

    if (data.length < 24) {
      throw new DomainError('多項式回帰には最低24データポイントが必要です');
    }

    // polynomial-regression ライブラリ使用
    const model = new PolynomialRegression(data, degree);
    const rSquared = model.rSquared;

    return new RegressionResult(
      model.equation,
      new Decimal(rSquared),
      null, // 多項式では slope は複数
      null,
      null,
      'COMPLEX',
      model.forecast(12),
      null
    );
  }

  // 指数回帰分析（指数的成長検出）
  analyzeExponentialTrend(metric: ProfitabilityMetric): RegressionResult {
    const data = this.extractMetricData(metric);

    if (data.length < 36) {
      throw new DomainError('指数回帰には最低36データポイントが必要です');
    }

    // 対数変換して線形回帰
    const logData = data.map(([x, y]) => [x, Math.log(y)]);
    const logRegression = ss.linearRegression(logData);
    const { slope: logSlope, intercept: logIntercept } = ss.linearRegressionLine(logRegression);

    // 元の指数関数形式に変換: y = a * e^(bx)
    const a = Math.exp(logIntercept);
    const b = logSlope;

    return new RegressionResult(
      `y = ${a.toFixed(2)} * e^(${b.toFixed(4)}x)`,
      new Decimal(ss.rSquared(logData, logRegression)),
      new Decimal(b),
      new Decimal(a),
      null,
      'EXPONENTIAL',
      this.forecastExponential(a, b, data.length),
      null
    );
  }

  // Period-over-Period比較
  comparePeriods(
    currentPeriod: DateRange,
    previousPeriod: DateRange
  ): PeriodComparison {
    const currentData = this.filterByPeriod(currentPeriod);
    const previousData = this.filterByPeriod(previousPeriod);

    const currentAvg = this.calculateAverageMetrics(currentData);
    const previousAvg = this.calculateAverageMetrics(previousData);

    const growth = new Map<ProfitabilityMetric, Decimal>();
    for (const [metric, currentVal] of currentAvg) {
      const previousVal = previousAvg.get(metric)!;
      const growthRate = currentVal
        .minus(previousVal)
        .div(previousVal)
        .mul(100);
      growth.set(metric, growthRate);
    }

    // トレンド方向判定
    const avgGrowth = Array.from(growth.values()).reduce(
      (sum, g) => sum.plus(g),
      new Decimal(0)
    ).div(growth.size);

    const trendDirection = avgGrowth.greaterThan(5)
      ? 'POSITIVE'
      : avgGrowth.lessThan(-5)
      ? 'NEGATIVE'
      : 'STABLE';

    // 加速度判定（前々期との比較）
    const acceleration = this.calculateAcceleration(growth);

    return new PeriodComparison(
      currentAvg,
      previousAvg,
      growth,
      trendDirection,
      acceleration
    );
  }

  // 異常検知（外れ値検出）
  detectAnomalies(sensitivity: Sensitivity = 'MEDIUM'): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const zScoreThreshold = this.getZScoreThreshold(sensitivity);

    for (const metric of this.regressionResults.keys()) {
      const data = this.extractMetricData(metric);
      const mean = ss.mean(data.map(([_, y]) => y));
      const stdDev = ss.standardDeviation(data.map(([_, y]) => y));

      for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
        const zScore = Math.abs((y - mean) / stdDev);

        if (zScore > zScoreThreshold) {
          const regression = this.regressionResults.get(metric)!;
          const expectedValue = regression.slope.mul(x).plus(regression.intercept);
          const deviation = new Decimal(y).minus(expectedValue);

          anomalies.push(
            new Anomaly(
              this.timeSeriesData[i].period,
              metric,
              new Decimal(y),
              expectedValue,
              deviation,
              this.determineAnomalySignificance(zScore),
              this.identifyPossibleCauses(metric, deviation)
            )
          );
        }
      }
    }

    return anomalies;
  }

  // ベンチマーク比較
  compareWithBenchmark(benchmark: BenchmarkData): BenchmarkComparison {
    const currentMetrics = this.calculateAverageMetrics(this.timeSeriesData);

    const comparison = new Map<ProfitabilityMetric, BenchmarkDiff>();
    for (const [metric, currentVal] of currentMetrics) {
      const benchmarkVal = benchmark.metrics.get(metric);
      if (benchmarkVal) {
        const diff = currentVal.minus(benchmarkVal);
        const percentage = diff.div(benchmarkVal).mul(100);
        comparison.set(
          metric,
          new BenchmarkDiff(currentVal, benchmarkVal, diff, percentage)
        );
      }
    }

    // 総合ランキング判定
    const avgPerformance = Array.from(comparison.values()).reduce(
      (sum, diff) => sum.plus(diff.percentage),
      new Decimal(0)
    ).div(comparison.size);

    const ranking = avgPerformance.greaterThan(10)
      ? 'TOP_QUARTILE'
      : avgPerformance.greaterThan(0)
      ? 'ABOVE_AVERAGE'
      : avgPerformance.greaterThan(-10)
      ? 'BELOW_AVERAGE'
      : 'BOTTOM_QUARTILE';

    return new BenchmarkComparison(comparison, ranking);
  }

  // 変動要因分析
  analyzeVariationFactors(): VariationFactors {
    // 各指標の寄与度分析（分散分析）
    const factors = this.identifyContributionFactors();

    // 成長ドライバーの特定（寄与度上位）
    const growthDrivers = factors
      .filter(f => f.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 5);

    // 下落要因の特定（寄与度下位）
    const declineFactors = factors
      .filter(f => f.contribution < 0)
      .sort((a, b) => a.contribution - b.contribution)
      .slice(0, 3);

    return new VariationFactors(growthDrivers, declineFactors);
  }

  // インサイト生成
  generateInsights(): TrendInsight[] {
    const insights: TrendInsight[] = [];

    // 継続的改善トレンド検出
    const continuousImprovement = this.detectContinuousImprovement();
    if (continuousImprovement) {
      insights.push(continuousImprovement);
    }

    // 加速トレンド検出
    const acceleration = this.detectAcceleration();
    if (acceleration) {
      insights.push(acceleration);
    }

    // 季節性検出
    const seasonality = this.detectSeasonality();
    if (seasonality) {
      insights.push(seasonality);
    }

    // 転換点検出
    const turningPoints = this.detectTurningPoints();
    insights.push(...turningPoints);

    return insights;
  }

  private calculatePValue(
    data: number[][],
    regression: ReturnType<typeof ss.linearRegression>
  ): number {
    // t統計量計算
    const n = data.length;
    const residuals = data.map(([x, y]) => {
      const predicted = regression.m * x + regression.b;
      return y - predicted;
    });

    const sse = residuals.reduce((sum, r) => sum + r * r, 0);
    const mse = sse / (n - 2);
    const sxx = data.reduce((sum, [x]) => {
      const xMean = data.reduce((s, [xi]) => s + xi, 0) / n;
      return sum + (x - xMean) ** 2;
    }, 0);

    const seBeta = Math.sqrt(mse / sxx);
    const tStat = Math.abs(regression.m / seBeta);

    // 自由度 n-2 のt分布からp値計算
    return this.tTestPValue(tStat, n - 2);
  }

  private calculateConfidenceInterval(
    data: number[][],
    regression: ReturnType<typeof ss.linearRegression>,
    level: number
  ): ConfidenceInterval {
    const n = data.length;
    const alpha = 1 - level;
    const tValue = this.tDistribution(alpha / 2, n - 2);

    const residuals = data.map(([x, y]) => {
      const predicted = regression.m * x + regression.b;
      return y - predicted;
    });

    const sse = residuals.reduce((sum, r) => sum + r * r, 0);
    const mse = sse / (n - 2);
    const standardError = Math.sqrt(mse);

    const marginOfError = tValue * standardError;

    return new ConfidenceInterval(
      new Decimal(regression.m - marginOfError),
      new Decimal(regression.m + marginOfError),
      level
    );
  }

  private determineSignificance(pValue: number): string {
    if (pValue < 0.001) return 'VERY_HIGH';
    if (pValue < 0.01) return 'HIGH';
    if (pValue < 0.05) return 'MEDIUM';
    if (pValue < 0.10) return 'LOW';
    return 'NOT_SIGNIFICANT';
  }

  private getZScoreThreshold(sensitivity: Sensitivity): number {
    switch (sensitivity) {
      case 'LOW': return 3.0; // 99.7%信頼区間
      case 'MEDIUM': return 2.0; // 95%信頼区間
      case 'HIGH': return 1.5; // 86%信頼区間
      default: return 2.0;
    }
  }

  private extractMetricData(metric: ProfitabilityMetric): number[][] {
    return this.timeSeriesData
      .map((point, index) => [
        index + 1,
        point.metrics.get(metric)?.value.toNumber() ?? 0
      ])
      .filter(([_, value]) => value !== null && !isNaN(value));
  }
}

// Domain Service: ProfitabilityTrend Analysis Service
class ProfitabilityTrendAnalysisService {
  async analyzeProfitabilityTrends(
    input: AnalyzeTrendsInput,
    userId: string
  ): Promise<ProfitabilityTrendAnalysis> {
    // 1. 時系列収益性データ取得
    const historicalData = await this.profitabilityRepository.findTimeSeriesData(
      input.targetIds,
      input.analysisPeriod,
      input.trendGranularity
    );

    // 2. データ補間（欠損値処理）
    const interpolatedData = this.interpolateMissingData(historicalData);

    // 3. TimeSeriesDataPoint生成
    const timeSeriesPoints = interpolatedData.map(data =>
      this.createTimeSeriesDataPoint(data, input.profitabilityMetrics)
    );

    // 4. ProfitabilityTrendAnalysis集約生成
    const trendAnalysis = new ProfitabilityTrendAnalysis(
      generateId('trend-'),
      input.analysisScope,
      input.analysisPeriod,
      input.trendGranularity,
      timeSeriesPoints,
      new Map()
    );

    // 5. 回帰分析実行
    for (const metric of input.profitabilityMetrics) {
      let regressionResult: RegressionResult;

      switch (input.regressionModel) {
        case 'LINEAR':
          regressionResult = trendAnalysis.analyzeLinearTrend(metric);
          break;
        case 'POLYNOMIAL':
          regressionResult = trendAnalysis.analyzePolynomialTrend(metric, 2);
          break;
        case 'EXPONENTIAL':
          regressionResult = trendAnalysis.analyzeExponentialTrend(metric);
          break;
        default:
          regressionResult = trendAnalysis.analyzeLinearTrend(metric);
      }

      trendAnalysis.regressionResults.set(metric, regressionResult);
    }

    // 6. Period-over-Period比較
    let periodComparison: PeriodComparison | null = null;
    if (input.comparisonPeriods && input.comparisonPeriods.length > 0) {
      periodComparison = trendAnalysis.comparePeriods(
        input.analysisPeriod,
        input.comparisonPeriods[0]
      );
    }

    // 7. 異常検知
    const anomalies = trendAnalysis.detectAnomalies(
      input.detectionSensitivity ?? 'MEDIUM'
    );

    // 8. ベンチマーク比較
    let benchmarkComparison: BenchmarkComparison | null = null;
    if (input.benchmarkData && input.benchmarkData.length > 0) {
      benchmarkComparison = trendAnalysis.compareWithBenchmark(
        input.benchmarkData[0]
      );
    }

    // 9. 変動要因分析
    const variationFactors = trendAnalysis.analyzeVariationFactors();

    // 10. インサイト生成
    const insights = trendAnalysis.generateInsights();

    // 11. 永続化
    await this.trendRepository.save({
      trendAnalysis,
      periodComparison,
      anomalies,
      benchmarkComparison,
      variationFactors,
      insights
    });

    return trendAnalysis;
  }

  // データ補間（線形補間）
  private interpolateMissingData(
    data: HistoricalProfitabilityData[]
  ): HistoricalProfitabilityData[] {
    // simple-statistics の linearInterpolateArray を使用
    // 欠損率が20%を超える場合はエラー
    const missingRate = this.calculateMissingRate(data);
    if (missingRate > 0.20) {
      throw new DomainError(
        `データ欠損率が${(missingRate * 100).toFixed(1)}%で許容値(20%)を超えています`
      );
    }

    return this.performLinearInterpolation(data);
  }
}
```

### BC統合連携

#### BC-002 L3-003: Revenue Management連携
```typescript
// 時系列収益データ取得
const revenues = await revenueService.getTimeSeriesRevenues({
  projectIds: input.targetIds,
  period: input.analysisPeriod,
  granularity: input.trendGranularity
});
```

#### BC-002 L3-002: Cost Management連携
```typescript
// 時系列コストデータ取得
const costs = await costService.getTimeSeriesCosts({
  projectIds: input.targetIds,
  period: input.analysisPeriod,
  granularity: input.trendGranularity
});
```

#### BC-001: Project Management連携
```typescript
// プロジェクト情報とマイルストーン取得
const projects = await projectService.getProjectsWithMilestones(input.targetIds);
```

### トランザクション境界

```typescript
async analyzeTrendsTransaction(
  input: AnalyzeTrendsInput,
  userId: string
): Promise<ProfitabilityTrendAnalysis> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. TrendAnalysis作成
    const analysis = await tx.profitabilityTrendAnalysis.create({
      data: analysisData
    });

    // 2. TimeSeriesDataPoints作成
    await tx.timeSeriesDataPoint.createMany({
      data: timeSeriesPoints.map(p => ({
        analysisId: analysis.id,
        period: p.period,
        metrics: p.metrics
      }))
    });

    // 3. RegressionResults作成
    await tx.regressionResult.createMany({
      data: regressionResults
    });

    // 4. Anomalies作成
    if (anomalies.length > 0) {
      await tx.anomaly.createMany({
        data: anomalies
      });
    }

    // 5. Insights作成
    await tx.trendInsight.createMany({
      data: insights
    });

    // 6. 監査ログ
    await tx.auditLog.create({
      data: {
        action: 'PROFITABILITY_TREND_ANALYZED',
        entityType: 'ProfitabilityTrendAnalysis',
        entityId: analysis.id,
        userId
      }
    });

    return analysis;
  });
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

| コード | 分類 | 重大度 | リトライ | 説明 |
|--------|------|--------|---------|------|
| ERR_BC002_L3004_OP002_001 | データ不足 | ERROR | × | 時系列データ不足 |
| ERR_BC002_L3004_OP002_002 | データ不整合 | ERROR | × | データ粒度不整合 |
| ERR_BC002_L3004_OP002_003 | 計算エラー | ERROR | × | 回帰分析失敗 |
| ERR_BC002_L3004_OP002_004 | 統計エラー | ERROR | × | 統計的有意性不足 |
| ERR_BC002_L3004_OP002_005 | データ品質 | WARNING | ○ | データ欠損率高 |

### リトライ戦略

トレンド分析は確定的な計算処理であり、基本的にリトライ不要。ただし、データ品質エラー（ERR_005）については、データ補完後に1回のみリトライ可能。

### 統計的妥当性検証

1. **サンプルサイズ検証**
   - 線形回帰: 最小12データポイント
   - 多項式回帰: 最小24データポイント
   - 指数回帰: 最小36データポイント

2. **統計的有意性検証**
   - p値 < 0.05: 統計的に有意
   - p値 < 0.01: 高度に有意
   - p値 ≥ 0.05: 有意性なし（警告）

3. **決定係数（R²）検証**
   - R² ≥ 0.7: 良好なフィット
   - 0.5 ≤ R² < 0.7: 中程度のフィット
   - R² < 0.5: フィット不良（警告）

### データ品質要件

1. **データ完全性**
   - 欠損率: 最大20%まで許容
   - 連続性: 3ヶ月以上の欠損は不可

2. **データ一貫性**
   - 粒度統一: 全データポイントで粒度一致
   - 通貨統一: 全データで通貨コード一致

3. **異常値処理**
   - Z-score > 3.0: 自動除外または補正
   - 外れ値率: 最大5%まで許容

### 財務分析コンプライアンス

1. **統計手法の透明性**
   - 回帰モデルの選択根拠明示
   - 統計的仮定の明記
   - 制約事項の開示

2. **予測の免責事項**
   - 過去実績に基づく予測である旨明記
   - 将来の保証ではない旨開示
   - 統計的信頼区間の提示

3. **データ保管期間**
   - トレンド分析結果: 10年間保管
   - 元データ: 10年間保管
   - 計算ログ: 7年間保管

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
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/analyze-profitability-trends/](../../../../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/analyze-profitability-trends/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
