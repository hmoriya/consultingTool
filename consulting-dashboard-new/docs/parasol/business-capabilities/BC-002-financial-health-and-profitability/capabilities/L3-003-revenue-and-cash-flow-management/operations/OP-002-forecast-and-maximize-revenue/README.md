# OP-002: 収益を予測し最大化する

**作成日**: 2025-10-31
**所属L3**: L3-003-revenue-and-cash-flow-management: Revenue And Cash Flow Management
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/forecast-and-maximize-revenue

---

## 📋 How: この操作の定義

### 操作の概要
将来の収益を予測し、収益最大化のための施策を実行する。パイプライン分析と収益機会の特定により、持続的な収益成長を実現する。

### 実現する機能
- 収益予測モデルの構築と実行
- パイプライン案件の収益見込み分析
- 収益最大化施策の提案
- 収益成長シナリオのシミュレーション

### 入力
- 過去の収益実績データ
- パイプライン案件情報
- 市場動向データ
- 収益目標

### 出力
- 収益予測レポート
- パイプライン収益見込み
- 収益最大化施策提案
- 収益シナリオ分析

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| forecastPeriod | DateRange | ○ | 予測期間 | 開始日≤終了日、最大24ヶ月 |
| historicalDataPeriod | DateRange | ○ | 過去実績期間 | 最低12ヶ月、最大60ヶ月 |
| targetRevenue | Money | △ | 目標収益 | Decimal.js、≥0 |
| currency | Currency | ○ | 通貨コード | ISO 4217 (JPY/USD/EUR) |
| projectIds | UUID[] | △ | 対象プロジェクトID | BC-001 Project存在確認 |
| pipelineIncluded | BOOLEAN | ○ | パイプライン含む | true/false |
| pipelineConfidenceThreshold | DECIMAL | △ | パイプライン信頼度閾値 | 0-100、パイプライン含む場合必須 |
| forecastModel | ForecastModel | ○ | 予測モデル | LINEAR/EXPONENTIAL/SEASONAL/ML |
| seasonalityFactors | SeasonalityFactor[] | △ | 季節性要因 | ML/SEASONALモデル時必須 |
| growthRate | DECIMAL | △ | 成長率仮定 | -100～+500、LINEARモデル時 |
| confidenceLevel | DECIMAL | ○ | 信頼区間 | 90/95/99 |
| scenarioCount | INTEGER | △ | シナリオ数 | 1-10、デフォルト3 |
| optimizationGoals | OptimizationGoal[] | ○ | 最適化目標 | MAXIMIZE_REVENUE/MINIMIZE_RISK/BALANCE |

### 入力例（JSON）
```json
{
  "forecastPeriod": {
    "startDate": "2025-04-01",
    "endDate": "2026-03-31"
  },
  "historicalDataPeriod": {
    "startDate": "2022-04-01",
    "endDate": "2025-03-31"
  },
  "targetRevenue": {
    "value": "500000000.00",
    "currency": "JPY"
  },
  "currency": "JPY",
  "pipelineIncluded": true,
  "pipelineConfidenceThreshold": 70.0,
  "forecastModel": "SEASONAL",
  "seasonalityFactors": [
    {
      "period": "QUARTERLY",
      "pattern": "Q1_LOW_Q4_HIGH"
    }
  ],
  "confidenceLevel": 95,
  "scenarioCount": 3,
  "optimizationGoals": ["MAXIMIZE_REVENUE", "MINIMIZE_RISK"]
}
```

### バリデーションルール

1. **期間整合性検証**
   - 予測期間.開始日 > 本日
   - 過去実績期間.終了日 ≤ 本日
   - 過去実績期間 ≥ 12ヶ月
   - 予測期間 ≤ 24ヶ月

2. **モデル別必須パラメータ**
   - LINEAR: growthRate必須
   - EXPONENTIAL: growthRate必須
   - SEASONAL: seasonalityFactors必須
   - ML: historicalDataPeriod ≥ 24ヶ月

3. **パイプライン分析条件**
   - pipelineIncluded = true: pipelineConfidenceThreshold必須
   - 信頼度閾値: 0-100の範囲
   - パイプライン案件 ≥ 1件存在

4. **財務目標整合性**
   - targetRevenue指定時: 現実的な成長率範囲（-20% ～ +100%/年）
   - 複数シナリオ: 最低3シナリオ推奨（楽観・標準・悲観）

5. **BC-001連携検証**
   - projectIds指定時: 全Project存在確認
   - Project状態: ACTIVE または PIPELINE

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "forecastId": "fcst-98765",
    "forecastPeriod": {
      "startDate": "2025-04-01",
      "endDate": "2026-03-31"
    },
    "baselineRevenue": {
      "value": "450000000.00",
      "currency": "JPY"
    },
    "forecastedRevenue": {
      "value": "520000000.00",
      "currency": "JPY",
      "confidenceInterval": {
        "lower": "485000000.00",
        "upper": "555000000.00",
        "level": 95
      }
    },
    "monthlyForecast": [
      {
        "month": "2025-04",
        "forecastedRevenue": "40000000.00",
        "confidenceInterval": { "lower": "37000000.00", "upper": "43000000.00" }
      },
      {
        "month": "2025-05",
        "forecastedRevenue": "42000000.00",
        "confidenceInterval": { "lower": "39000000.00", "upper": "45000000.00" }
      }
    ],
    "pipelineAnalysis": {
      "totalPipelineValue": {
        "value": "280000000.00",
        "currency": "JPY"
      },
      "weightedPipelineValue": {
        "value": "196000000.00",
        "currency": "JPY"
      },
      "pipelineByStage": [
        {
          "stage": "PROPOSAL",
          "count": 15,
          "totalValue": "120000000.00",
          "averageConfidence": 45.0
        },
        {
          "stage": "NEGOTIATION",
          "count": 8,
          "totalValue": "100000000.00",
          "averageConfidence": 75.0
        },
        {
          "stage": "CLOSING",
          "count": 3,
          "totalValue": "60000000.00",
          "averageConfidence": 90.0
        }
      ]
    },
    "revenueMaXimizationStrategies": [
      {
        "strategy": "ACCELERATE_PIPELINE_CONVERSION",
        "expectedImpact": {
          "value": "35000000.00",
          "currency": "JPY"
        },
        "probability": 70.0,
        "timeframe": "3_MONTHS",
        "requiredActions": [
          "営業リソース20%増強",
          "提案クオリティ向上施策"
        ]
      },
      {
        "strategy": "EXPAND_EXISTING_PROJECTS",
        "expectedImpact": {
          "value": "28000000.00",
          "currency": "JPY"
        },
        "probability": 85.0,
        "timeframe": "6_MONTHS",
        "requiredActions": [
          "既存顧客への追加提案",
          "スコープ拡大交渉"
        ]
      }
    ],
    "scenarios": [
      {
        "name": "楽観シナリオ",
        "assumptions": "パイプライン転換率+20%、既存案件拡大+15%",
        "forecastedRevenue": "595000000.00",
        "probability": 25.0
      },
      {
        "name": "標準シナリオ",
        "assumptions": "現状トレンド継続",
        "forecastedRevenue": "520000000.00",
        "probability": 50.0
      },
      {
        "name": "悲観シナリオ",
        "assumptions": "パイプライン転換率-15%、既存案件縮小-10%",
        "forecastedRevenue": "445000000.00",
        "probability": 25.0
      }
    ],
    "modelPerformance": {
      "modelType": "SEASONAL",
      "historicalAccuracy": 92.5,
      "meanAbsolutePercentageError": 7.5,
      "r2Score": 0.89
    },
    "createdAt": "2025-03-31T16:00:00Z",
    "createdBy": "user-789"
  },
  "message": "収益予測が正常に完了しました。"
}
```

### エラーレスポンス

#### 400 Bad Request - バリデーションエラー
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP002_001",
    "message": "過去実績期間が不足しています",
    "details": {
      "requiredMonths": 12,
      "providedMonths": 8,
      "forecastModel": "LINEAR"
    }
  }
}
```

#### 422 Unprocessable Entity - ビジネスルール違反
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3003_OP002_002",
    "message": "予測モデルの精度が基準を下回ります",
    "details": {
      "minimumAccuracy": 75.0,
      "actualAccuracy": 62.3,
      "suggestion": "過去実績期間を延長してください"
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3003_OP002_001 | 400 | 過去実績期間不足 | 過去12ヶ月以上のデータ用意 |
| ERR_BC002_L3003_OP002_002 | 422 | 予測精度不足 | 過去実績期間延長 |
| ERR_BC002_L3003_OP002_003 | 422 | パイプラインデータ不足 | パイプライン案件登録 |
| ERR_BC002_L3003_OP002_004 | 422 | 非現実的な目標設定 | 目標収益の見直し |
| ERR_BC002_L3003_OP002_005 | 500 | 予測モデル実行失敗 | リトライまたはモデル変更 |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: Revenue Forecast Aggregate

```typescript
import Decimal from 'decimal.js';

// Revenue Forecast Aggregate Root
class RevenueForecast {
  constructor(
    public id: string,
    public forecastPeriod: DateRange,
    public baselineRevenue: Money,
    public forecastedRevenue: Money,
    public confidenceInterval: ConfidenceInterval,
    public forecastModel: ForecastModel,
    public monthlyForecast: MonthlyForecast[]
  ) {}

  // 予測精度計算（Decimal.js使用）
  calculateAccuracy(actualRevenue: Money[]): Decimal {
    const errors = this.monthlyForecast.map((forecast, index) => {
      const actual = actualRevenue[index];
      if (!actual) return new Decimal(0);

      const error = forecast.forecastedRevenue.value
        .minus(actual.value)
        .abs()
        .div(actual.value);

      return error;
    });

    const mape = errors
      .reduce((sum, err) => sum.plus(err), new Decimal(0))
      .div(errors.length)
      .mul(100);

    return new Decimal(100).minus(mape); // 精度% = 100% - MAPE
  }

  // 目標達成確率計算
  calculateTargetAchievementProbability(targetRevenue: Money): Decimal {
    const zScore = targetRevenue.value
      .minus(this.forecastedRevenue.value)
      .div(this.calculateStandardDeviation());

    // 正規分布の累積分布関数から確率計算
    return this.normalCDF(zScore).mul(100);
  }

  // 収益ギャップ分析
  analyzeRevenueGap(targetRevenue: Money): RevenueGapAnalysis {
    const gap = targetRevenue.value.minus(this.forecastedRevenue.value);
    const gapPercentage = gap.div(targetRevenue.value).mul(100);

    return new RevenueGapAnalysis(
      new Money(gap, this.forecastedRevenue.currency),
      gapPercentage,
      this.suggestMaximizationStrategies(gap)
    );
  }

  private suggestMaximizationStrategies(gap: Decimal): MaximizationStrategy[] {
    const strategies: MaximizationStrategy[] = [];

    // パイプライン加速戦略
    if (gap.gt(new Decimal(0))) {
      strategies.push({
        type: 'ACCELERATE_PIPELINE_CONVERSION',
        expectedImpact: gap.mul(0.4), // ギャップの40%をカバー
        probability: new Decimal(70),
        timeframe: '3_MONTHS'
      });

      // 既存案件拡大戦略
      strategies.push({
        type: 'EXPAND_EXISTING_PROJECTS',
        expectedImpact: gap.mul(0.35), // ギャップの35%をカバー
        probability: new Decimal(85),
        timeframe: '6_MONTHS'
      });

      // 新規市場開拓戦略
      strategies.push({
        type: 'NEW_MARKET_ENTRY',
        expectedImpact: gap.mul(0.25), // ギャップの25%をカバー
        probability: new Decimal(50),
        timeframe: '12_MONTHS'
      });
    }

    return strategies;
  }
}

// Domain Service: Revenue Forecast Service
class RevenueForecastService {
  async generateForecast(
    input: ForecastInput,
    userId: string
  ): Promise<RevenueForecast> {
    // 1. 過去実績データ取得
    const historicalData = await this.revenueRepository
      .findByPeriod(input.historicalDataPeriod);

    // 2. データ品質検証
    this.validateDataQuality(historicalData, input.forecastModel);

    // 3. 予測モデル実行
    const forecastEngine = this.selectForecastEngine(input.forecastModel);
    const monthlyForecast = await forecastEngine.forecast({
      historicalData,
      forecastPeriod: input.forecastPeriod,
      seasonalityFactors: input.seasonalityFactors,
      confidenceLevel: input.confidenceLevel
    });

    // 4. 信頼区間計算
    const confidenceInterval = this.calculateConfidenceInterval(
      monthlyForecast,
      input.confidenceLevel
    );

    // 5. パイプライン分析（オプション）
    let pipelineAnalysis: PipelineAnalysis | undefined;
    if (input.pipelineIncluded) {
      pipelineAnalysis = await this.analyzePipeline(
        input.pipelineConfidenceThreshold
      );
    }

    // 6. 総予測収益計算
    const totalForecast = monthlyForecast.reduce(
      (sum, m) => sum.plus(m.forecastedRevenue.value),
      new Decimal(0)
    );

    // 7. 収益最大化戦略提案
    const maximizationStrategies = input.targetRevenue
      ? this.suggestMaximizationStrategies(
          new Money(totalForecast, input.currency),
          input.targetRevenue
        )
      : [];

    // 8. シナリオ分析
    const scenarios = await this.generateScenarios(
      monthlyForecast,
      input.scenarioCount,
      pipelineAnalysis
    );

    // 9. RevenueForecast集約生成
    const forecast = new RevenueForecast(
      generateId('fcst-'),
      input.forecastPeriod,
      this.calculateBaselineRevenue(historicalData),
      new Money(totalForecast, input.currency),
      confidenceInterval,
      input.forecastModel,
      monthlyForecast
    );

    // 10. 永続化
    await this.forecastRepository.save(forecast);

    return forecast;
  }

  // 線形予測モデル
  private linearForecast(
    historicalData: Revenue[],
    forecastPeriod: DateRange,
    growthRate: Decimal
  ): MonthlyForecast[] {
    const lastRevenue = historicalData[historicalData.length - 1];
    const monthlyGrowth = growthRate.div(12).div(100); // 年率から月率へ

    const forecasts: MonthlyForecast[] = [];
    let currentValue = lastRevenue.amount.value;

    for (let i = 0; i < forecastPeriod.months; i++) {
      currentValue = currentValue.mul(new Decimal(1).plus(monthlyGrowth));
      forecasts.push({
        month: forecastPeriod.getMonth(i),
        forecastedRevenue: new Money(currentValue, lastRevenue.amount.currency),
        confidenceInterval: this.calculateMonthlyConfidenceInterval(currentValue, i)
      });
    }

    return forecasts;
  }

  // 季節性予測モデル
  private seasonalForecast(
    historicalData: Revenue[],
    forecastPeriod: DateRange,
    seasonalityFactors: SeasonalityFactor[]
  ): MonthlyForecast[] {
    // 季節性パターン分析
    const seasonalIndices = this.calculateSeasonalIndices(
      historicalData,
      seasonalityFactors
    );

    // トレンド成分計算
    const trendComponent = this.calculateTrend(historicalData);

    // 予測実行
    const forecasts: MonthlyForecast[] = [];
    for (let i = 0; i < forecastPeriod.months; i++) {
      const month = forecastPeriod.getMonth(i);
      const trendValue = trendComponent.getValue(month);
      const seasonalIndex = seasonalIndices[month.getMonth()];
      const forecastedValue = trendValue.mul(seasonalIndex);

      forecasts.push({
        month,
        forecastedRevenue: new Money(forecastedValue, historicalData[0].amount.currency),
        confidenceInterval: this.calculateMonthlyConfidenceInterval(forecastedValue, i)
      });
    }

    return forecasts;
  }
}

// Pipeline Analysis
class PipelineAnalysisService {
  async analyzePipeline(
    confidenceThreshold: Decimal
  ): Promise<PipelineAnalysis> {
    // BC-001連携: パイプライン案件取得
    const pipelineProjects = await this.projectRepository
      .findByStatus('PIPELINE');

    // 信頼度閾値以上の案件のみ分析
    const qualifiedProjects = pipelineProjects.filter(
      p => p.winProbability.gte(confidenceThreshold)
    );

    // ステージ別集計
    const pipelineByStage = this.aggregateByStage(qualifiedProjects);

    // 加重パイプライン価値計算（Decimal.js使用）
    const weightedValue = qualifiedProjects.reduce(
      (sum, project) => {
        const weighted = project.estimatedRevenue.value
          .mul(project.winProbability.div(100));
        return sum.plus(weighted);
      },
      new Decimal(0)
    );

    return new PipelineAnalysis(
      this.sumTotalValue(qualifiedProjects),
      new Money(weightedValue, qualifiedProjects[0].currency),
      pipelineByStage
    );
  }
}
```

### BC統合連携

#### BC-001: Project Management連携
```typescript
// プロジェクト収益実績取得
const projectRevenues = await projectService.getRevenueHistory(
  projectIds,
  historicalDataPeriod
);

// パイプライン案件取得
const pipelineProjects = await projectService.getPipelineProjects({
  minConfidence: pipelineConfidenceThreshold
});
```

#### BC-003: Access Control連携
```typescript
// 収益予測権限検証
const hasPermission = await accessControlService.checkPermission(
  userId,
  'FORECAST_REVENUE',
  { sensitivityLevel: 'CONFIDENTIAL' }
);

if (!hasPermission) {
  throw new ForbiddenError('ERR_BC002_L3003_OP002_006');
}
```

#### BC-007: Notification連携
```typescript
// 目標未達リスク通知
if (achievementProbability.lt(new Decimal(70))) {
  await notificationService.send({
    type: 'REVENUE_TARGET_AT_RISK',
    recipients: ['cfo@example.com', 'sales-director@example.com'],
    data: {
      targetRevenue,
      forecastedRevenue,
      achievementProbability,
      gap: targetRevenue.value.minus(forecastedRevenue.value)
    }
  });
}
```

### トランザクション境界

```typescript
async generateForecastTransaction(
  input: ForecastInput,
  userId: string
): Promise<RevenueForecast> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Forecast作成
    const forecast = await tx.revenueForecast.create({ data: forecastData });

    // 2. 月次予測詳細作成
    await tx.monthlyForecast.createMany({
      data: monthlyForecasts.map(m => ({
        forecastId: forecast.id,
        month: m.month,
        forecastedRevenue: m.forecastedRevenue.value,
        lowerBound: m.confidenceInterval.lower,
        upperBound: m.confidenceInterval.upper
      }))
    });

    // 3. 最大化戦略提案作成
    await tx.maximizationStrategy.createMany({
      data: strategies.map(s => ({
        forecastId: forecast.id,
        strategyType: s.type,
        expectedImpact: s.expectedImpact,
        probability: s.probability,
        timeframe: s.timeframe
      }))
    });

    // 4. 監査ログ記録
    await tx.auditLog.create({
      data: {
        action: 'REVENUE_FORECAST_GENERATED',
        entityType: 'RevenueForecast',
        entityId: forecast.id,
        userId,
        changes: { forecastPeriod: input.forecastPeriod }
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
| ERR_BC002_L3003_OP002_001 | バリデーション | ERROR | × | 過去実績期間不足 |
| ERR_BC002_L3003_OP002_002 | ビジネスルール | WARNING | × | 予測精度不足 |
| ERR_BC002_L3003_OP002_003 | バリデーション | ERROR | × | パイプラインデータ不足 |
| ERR_BC002_L3003_OP002_004 | ビジネスルール | WARNING | × | 非現実的な目標設定 |
| ERR_BC002_L3003_OP002_005 | システム | CRITICAL | ○ | 予測モデル実行失敗 |
| ERR_BC002_L3003_OP002_006 | 権限 | ERROR | × | 収益予測権限不足 |

### リトライ戦略

#### システムエラー（リトライ対象）
```typescript
const retryConfig = {
  maxRetries: 3,
  backoff: 'exponential', // 1s, 2s, 4s
  retryableErrors: [
    'ERR_BC002_L3003_OP002_005', // 予測モデル実行失敗
    'MODEL_TIMEOUT',
    'ECONNRESET'
  ]
};

async function generateForecastWithRetry(
  input: ForecastInput,
  userId: string
): Promise<RevenueForecast> {
  let lastError: Error;

  for (let attempt = 0; attempt < retryConfig.maxRetries; attempt++) {
    try {
      return await forecastService.generateForecast(input, userId);
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }

      // モデルタイプ変更（フォールバック）
      if (attempt === 1 && input.forecastModel === 'ML') {
        input.forecastModel = 'SEASONAL'; // MLからSEASONALへフォールバック
        logger.info('予測モデルをSEASONALへフォールバック');
      }

      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);

      logger.warn(`収益予測リトライ ${attempt + 1}/${retryConfig.maxRetries}`, {
        forecastId: input.forecastPeriod,
        error: error.message,
        model: input.forecastModel
      });
    }
  }

  throw lastError;
}
```

### モデル精度モニタリング

```typescript
// 予測精度の継続的モニタリング
async function monitorForecastAccuracy(
  forecast: RevenueForecast
): Promise<void> {
  const actualRevenues = await revenueRepository.findActuals(
    forecast.forecastPeriod
  );

  if (actualRevenues.length === 0) {
    return; // まだ実績がない
  }

  const accuracy = forecast.calculateAccuracy(actualRevenues);

  // 精度基準: 75%以上
  if (accuracy.lt(new Decimal(75))) {
    logger.warn('収益予測の精度が基準を下回りました', {
      forecastId: forecast.id,
      accuracy: accuracy.toNumber(),
      threshold: 75
    });

    // CFOへ通知
    await notificationService.send({
      type: 'FORECAST_ACCURACY_LOW',
      recipients: ['cfo@example.com'],
      data: {
        forecastId: forecast.id,
        accuracy,
        suggestion: 'モデルの再調整が必要です'
      }
    });
  }
}
```

### 財務コンプライアンス注意事項

1. **予測開示規制準拠**
   - 上場企業: 業績予想開示ガイドライン準拠
   - 重要な前提条件の明記必須
   - 予測の不確実性の説明必須

2. **データ保管期間**
   - 収益予測記録: 5年間保管
   - 予測根拠資料: 5年間保管
   - 精度検証ログ: 5年間保管

3. **内部情報管理**
   - 未公開の業績予想: 厳格なアクセス制御
   - インサイダー取引防止: アクセスログ完全記録
   - 情報開示タイミング管理

4. **モデル透明性**
   - 使用モデルの詳細記録
   - 前提条件の文書化
   - 外部監査への説明可能性確保

5. **目標設定の合理性**
   - 非現実的な目標の警告表示
   - 過去実績との整合性確認
   - 市場環境との整合性確認

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
> - [services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/forecast-and-maximize-revenue/](../../../../../../../services/revenue-optimization-service/capabilities/recognize-and-maximize-revenue/operations/forecast-and-maximize-revenue/)
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
