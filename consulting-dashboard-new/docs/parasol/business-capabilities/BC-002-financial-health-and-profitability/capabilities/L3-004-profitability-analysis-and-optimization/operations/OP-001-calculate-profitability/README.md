# OP-001: 収益性を計算する

**作成日**: 2025-10-31
**所属L3**: L3-004-profitability-analysis-and-optimization: Profitability Analysis And Optimization
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや部門の収益性を計算し、財務パフォーマンスを定量化する。粗利益率、営業利益率などの指標により、収益性の現状を可視化する。

### 実現する機能
- 収益性指標の計算（粗利益率、営業利益率等）
- プロジェクト別・部門別収益性分析
- 収益性レポートの生成
- 収益性ダッシュボードの表示

### 入力
- 収益データ
- コストデータ
- 計算期間の指定
- 計算対象（プロジェクト、部門等）

### 出力
- 収益性指標（粗利益率、営業利益率等）
- プロジェクト別収益性レポート
- 部門別収益性比較
- 収益性ダッシュボード

---

## 📥 入力パラメータ

### パラメータ一覧

| パラメータ名 | 型 | 必須 | 説明 | バリデーション |
|------------|----|----|------|--------------|
| analysisScope | AnalysisScope | ○ | 分析範囲 | PROJECT/DEPARTMENT/COMPANY |
| targetIds | UUID[] | △ | 対象ID配列 | スコープ=PROJECT時必須 |
| analysisPeriod | DateRange | ○ | 分析期間 | 開始日≤終了日、最大24ヶ月 |
| currency | Currency | ○ | 通貨コード | ISO 4217 (JPY/USD/EUR) |
| includeIndirectCosts | BOOLEAN | ○ | 間接費含む | true/false |
| costAllocationMethod | CostAllocationMethod | △ | 間接費配賦方法 | HEADCOUNT/REVENUE/CUSTOM |
| profitabilityMetrics | ProfitabilityMetric[] | ○ | 計算指標 | GROSS_MARGIN/OPERATING_MARGIN/NET_MARGIN/ROI/ROE |
| comparisonPeriod | DateRange | △ | 比較期間 | 前年同期比較等 |
| benchmarkData | BenchmarkData | △ | ベンチマーク | 業界平均等 |

### 入力例（JSON）
```json
{
  "analysisScope": "PROJECT",
  "targetIds": ["proj-12345", "proj-67890"],
  "analysisPeriod": {
    "startDate": "2024-04-01",
    "endDate": "2025-03-31"
  },
  "currency": "JPY",
  "includeIndirectCosts": true,
  "costAllocationMethod": "REVENUE",
  "profitabilityMetrics": [
    "GROSS_MARGIN",
    "OPERATING_MARGIN",
    "NET_MARGIN",
    "ROI"
  ],
  "comparisonPeriod": {
    "startDate": "2023-04-01",
    "endDate": "2024-03-31"
  }
}
```

### バリデーションルール

1. **期間整合性検証**
   - 分析期間.開始日 ≤ 分析期間.終了日
   - 分析期間 ≤ 24ヶ月
   - 比較期間指定時: 期間長が分析期間と同一

2. **スコープ別必須パラメータ**
   - PROJECT: targetIds必須（1件以上）
   - DEPARTMENT: targetIds必須（部門ID）
   - COMPANY: targetIds不要

3. **間接費配賦方法**
   - includeIndirectCosts = true: costAllocationMethod必須
   - HEADCOUNT: 人員数による配賦
   - REVENUE: 収益規模による配賦
   - CUSTOM: カスタム配賦ルール適用

4. **指標計算可能性**
   - 全指標: 収益・コストデータ存在確認
   - ROI/ROE: 投資額データ存在確認

5. **BC-001/BC-002連携検証**
   - Project存在確認（スコープ=PROJECT時）
   - 収益・コストデータ完全性確認

---

## 📤 出力仕様

### 成功レスポンス (200 OK)

```json
{
  "success": true,
  "data": {
    "analysisId": "profanal-98765",
    "analysisScope": "PROJECT",
    "analysisPeriod": {
      "startDate": "2024-04-01",
      "endDate": "2025-03-31"
    },
    "overallProfitability": {
      "totalRevenue": {
        "value": "500000000.00",
        "currency": "JPY"
      },
      "totalCosts": {
        "value": "380000000.00",
        "currency": "JPY",
        "breakdown": {
          "directCosts": "320000000.00",
          "indirectCosts": "60000000.00"
        }
      },
      "grossProfit": {
        "value": "180000000.00",
        "currency": "JPY"
      },
      "operatingProfit": {
        "value": "120000000.00",
        "currency": "JPY"
      },
      "netProfit": {
        "value": "85000000.00",
        "currency": "JPY"
      },
      "profitabilityMetrics": {
        "grossMargin": {
          "percentage": 36.0,
          "benchmark": 35.0,
          "variance": 1.0
        },
        "operatingMargin": {
          "percentage": 24.0,
          "benchmark": 22.0,
          "variance": 2.0
        },
        "netMargin": {
          "percentage": 17.0,
          "benchmark": 15.0,
          "variance": 2.0
        },
        "roi": {
          "percentage": 28.3,
          "investment": "300000000.00",
          "return": "85000000.00"
        }
      }
    },
    "projectProfitability": [
      {
        "projectId": "proj-12345",
        "projectName": "DXコンサルティング案件A",
        "revenue": "300000000.00",
        "costs": "210000000.00",
        "grossProfit": "90000000.00",
        "grossMargin": 30.0,
        "operatingMargin": 18.0,
        "netMargin": 12.0,
        "status": "PROFITABLE"
      },
      {
        "projectId": "proj-67890",
        "projectName": "データ分析基盤構築B",
        "revenue": "200000000.00",
        "costs": "170000000.00",
        "grossProfit": "30000000.00",
        "grossMargin": 15.0,
        "operatingMargin": 8.0,
        "netMargin": 5.0,
        "status": "MARGINAL"
      }
    ],
    "periodComparison": {
      "currentPeriod": {
        "revenue": "500000000.00",
        "grossMargin": 36.0,
        "netMargin": 17.0
      },
      "previousPeriod": {
        "revenue": "450000000.00",
        "grossMargin": 34.0,
        "netMargin": 15.0
      },
      "growth": {
        "revenueGrowth": 11.1,
        "marginImprovement": 2.0
      }
    },
    "createdAt": "2025-03-31T18:00:00Z",
    "createdBy": "user-999"
  },
  "message": "収益性分析が正常に完了しました。"
}
```

### エラーレスポンス

#### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "ERR_BC002_L3004_OP001_001",
    "message": "収益データが不足しています",
    "details": {
      "projectId": "proj-12345",
      "missingPeriod": "2024-10-01 to 2024-12-31"
    }
  }
}
```

### エラーコード一覧

| エラーコード | HTTP | 説明 | 対処方法 |
|------------|------|------|---------|
| ERR_BC002_L3004_OP001_001 | 400 | 収益データ不足 | 収益データの補完 |
| ERR_BC002_L3004_OP001_002 | 400 | コストデータ不足 | コストデータの補完 |
| ERR_BC002_L3004_OP001_003 | 422 | 投資額データ不足 | ROI計算用データ追加 |
| ERR_BC002_L3004_OP001_004 | 422 | ゼロ除算エラー | 収益またはコストがゼロ |

---

## 🛠️ 実装ガイダンス

### ドメイン集約: Profitability Aggregate

```typescript
import Decimal from 'decimal.js';

// Profitability Aggregate Root
class ProfitabilityAnalysis {
  constructor(
    public id: string,
    public scope: AnalysisScope,
    public period: DateRange,
    public totalRevenue: Money,
    public totalCosts: Money,
    public profitabilityMetrics: Map<ProfitabilityMetric, Decimal>
  ) {}

  // 粗利益率計算（Decimal.js使用）
  calculateGrossMargin(): Decimal {
    if (this.totalRevenue.value.eq(new Decimal(0))) {
      throw new DomainError('収益がゼロのため粗利益率を計算できません');
    }

    const grossProfit = this.totalRevenue.value.minus(this.totalCosts.value);
    const grossMargin = grossProfit
      .div(this.totalRevenue.value)
      .mul(100)
      .toDecimalPlaces(2);

    return grossMargin;
  }

  // 営業利益率計算
  calculateOperatingMargin(operatingExpenses: Money): Decimal {
    const grossProfit = this.totalRevenue.value.minus(this.totalCosts.value);
    const operatingProfit = grossProfit.minus(operatingExpenses.value);
    const operatingMargin = operatingProfit
      .div(this.totalRevenue.value)
      .mul(100)
      .toDecimalPlaces(2);

    return operatingMargin;
  }

  // ROI計算（投資収益率）
  calculateROI(investment: Money): Decimal {
    if (investment.value.eq(new Decimal(0))) {
      throw new DomainError('投資額がゼロのためROIを計算できません');
    }

    const netProfit = this.calculateNetProfit();
    const roi = netProfit.value
      .div(investment.value)
      .mul(100)
      .toDecimalPlaces(2);

    return roi;
  }

  // 収益性ステータス判定
  assessProfitabilityStatus(): ProfitabilityStatus {
    const grossMargin = this.calculateGrossMargin();

    if (grossMargin.gte(new Decimal(30))) {
      return 'HIGHLY_PROFITABLE';
    } else if (grossMargin.gte(new Decimal(20))) {
      return 'PROFITABLE';
    } else if (grossMargin.gte(new Decimal(10))) {
      return 'MARGINAL';
    } else if (grossMargin.gt(new Decimal(0))) {
      return 'LOW_PROFIT';
    } else {
      return 'UNPROFITABLE';
    }
  }

  // ベンチマーク比較
  compareWithBenchmark(benchmark: BenchmarkData): BenchmarkComparison {
    const grossMargin = this.calculateGrossMargin();
    const variance = grossMargin.minus(benchmark.grossMargin);

    return new BenchmarkComparison(
      grossMargin,
      benchmark.grossMargin,
      variance,
      variance.gte(new Decimal(0)) ? 'ABOVE' : 'BELOW'
    );
  }

  private calculateNetProfit(): Money {
    // 簡略化: 粗利益 - 営業費用 - 税金
    const netProfit = this.totalRevenue.value
      .minus(this.totalCosts.value)
      .mul(new Decimal(0.7)); // 仮定: 営業費用・税金控除後70%

    return new Money(netProfit, this.totalRevenue.currency);
  }
}

// Domain Service: Profitability Calculation Service
class ProfitabilityCalculationService {
  async calculateProfitability(
    input: CalculateProfitabilityInput,
    userId: string
  ): Promise<ProfitabilityAnalysis> {
    // 1. 収益データ取得（BC-002連携）
    const revenues = await this.revenueRepository.findByPeriod(
      input.targetIds,
      input.analysisPeriod
    );

    // 2. コストデータ取得（BC-002連携）
    const costs = await this.costRepository.findByPeriod(
      input.targetIds,
      input.analysisPeriod
    );

    // 3. 間接費配賦（オプション）
    let totalCosts = this.sumCosts(costs);
    if (input.includeIndirectCosts) {
      const indirectCosts = await this.allocateIndirectCosts(
        input.targetIds,
        input.costAllocationMethod,
        input.analysisPeriod
      );
      totalCosts = totalCosts.value.plus(indirectCosts.value);
    }

    // 4. 総収益計算（Decimal.js使用）
    const totalRevenue = revenues.reduce(
      (sum, r) => sum.plus(r.amount.value),
      new Decimal(0)
    );

    // 5. Profitability集約生成
    const profitability = new ProfitabilityAnalysis(
      generateId('profanal-'),
      input.analysisScope,
      input.analysisPeriod,
      new Money(totalRevenue, input.currency),
      new Money(totalCosts, input.currency),
      new Map()
    );

    // 6. 指標計算
    for (const metric of input.profitabilityMetrics) {
      let value: Decimal;
      switch (metric) {
        case 'GROSS_MARGIN':
          value = profitability.calculateGrossMargin();
          break;
        case 'OPERATING_MARGIN':
          const opEx = await this.getOperatingExpenses(input.analysisPeriod);
          value = profitability.calculateOperatingMargin(opEx);
          break;
        case 'ROI':
          const investment = await this.getInvestment(input.targetIds);
          value = profitability.calculateROI(investment);
          break;
        // 他の指標...
      }
      profitability.profitabilityMetrics.set(metric, value);
    }

    // 7. プロジェクト別収益性計算（スコープ=PROJECT時）
    let projectProfitability: ProjectProfitability[] = [];
    if (input.analysisScope === 'PROJECT') {
      projectProfitability = await this.calculateProjectProfitability(
        input.targetIds,
        input.analysisPeriod
      );
    }

    // 8. 永続化
    await this.profitabilityRepository.save(profitability);

    return profitability;
  }

  // 間接費配賦計算
  private async allocateIndirectCosts(
    targetIds: string[],
    method: CostAllocationMethod,
    period: DateRange
  ): Promise<Money> {
    const indirectCosts = await this.costRepository.findIndirectCosts(period);
    const totalIndirect = indirectCosts.reduce(
      (sum, c) => sum.plus(c.amount.value),
      new Decimal(0)
    );

    let allocationRatios: Map<string, Decimal>;

    switch (method) {
      case 'REVENUE':
        // 収益規模による配賦
        const revenues = await this.revenueRepository.findByPeriod(targetIds, period);
        const totalRevenue = revenues.reduce(
          (sum, r) => sum.plus(r.amount.value),
          new Decimal(0)
        );
        allocationRatios = revenues.reduce((map, r) => {
          map.set(r.projectId, r.amount.value.div(totalRevenue));
          return map;
        }, new Map());
        break;

      case 'HEADCOUNT':
        // 人員数による配賦
        const headcounts = await this.getProjectHeadcounts(targetIds, period);
        const totalHeadcount = Array.from(headcounts.values()).reduce(
          (sum, h) => sum.plus(h),
          new Decimal(0)
        );
        allocationRatios = new Map(
          Array.from(headcounts.entries()).map(([id, count]) => [
            id,
            count.div(totalHeadcount)
          ])
        );
        break;
    }

    // 配賦額計算
    const allocatedCosts = Array.from(allocationRatios.values()).reduce(
      (sum, ratio) => sum.plus(totalIndirect.mul(ratio)),
      new Decimal(0)
    );

    return new Money(allocatedCosts, indirectCosts[0].amount.currency);
  }
}
```

### BC統合連携

#### BC-001: Project Management連携
```typescript
// プロジェクト情報取得
const projects = await projectService.getProjects(targetIds);

// プロジェクトステータス確認
const activeProjects = projects.filter(p => p.status === 'ACTIVE');
```

#### BC-002: Revenue & Cost連携
```typescript
// 収益データ取得
const revenues = await revenueService.getRevenues({
  projectIds: targetIds,
  period: analysisPeriod
});

// コストデータ取得
const costs = await costService.getCosts({
  projectIds: targetIds,
  period: analysisPeriod
});
```

### トランザクション境界

```typescript
async calculateProfitabilityTransaction(
  input: CalculateProfitabilityInput,
  userId: string
): Promise<ProfitabilityAnalysis> {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Profitability Analysis作成
    const analysis = await tx.profitabilityAnalysis.create({ data: analysisData });

    // 2. 指標詳細作成
    await tx.profitabilityMetric.createMany({
      data: metrics.map(m => ({
        analysisId: analysis.id,
        metricType: m.type,
        value: m.value
      }))
    });

    // 3. プロジェクト別収益性作成
    if (projectProfitability.length > 0) {
      await tx.projectProfitability.createMany({
        data: projectProfitability
      });
    }

    // 4. 監査ログ
    await tx.auditLog.create({
      data: {
        action: 'PROFITABILITY_CALCULATED',
        entityType: 'ProfitabilityAnalysis',
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
| ERR_BC002_L3004_OP001_001 | データ不足 | ERROR | × | 収益データ不足 |
| ERR_BC002_L3004_OP001_002 | データ不足 | ERROR | × | コストデータ不足 |
| ERR_BC002_L3004_OP001_003 | データ不足 | ERROR | × | 投資額データ不足 |
| ERR_BC002_L3004_OP001_004 | 計算エラー | ERROR | × | ゼロ除算エラー |

### リトライ戦略

収益性計算は確定的な処理であり、システムエラー以外はリトライ不要。データ不足エラーは利用者によるデータ補完が必要。

### 財務コンプライアンス注意事項

1. **会計基準準拠**
   - 粗利益率: 売上総利益率の正確な計算
   - 営業利益率: 販売費及び一般管理費の適切な控除
   - 純利益率: 税引後利益の正確な算出

2. **間接費配賦の透明性**
   - 配賦方法の明示
   - 配賦計算ロジックの監査可能性
   - 配賦基準の定期的な見直し

3. **データ保管期間**
   - 収益性分析結果: 10年間保管
   - 計算根拠データ: 10年間保管

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
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability/](../../../../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/operations/calculate-profitability/)
>
> **移行方針**:
> - V2ディレクトリは読み取り専用として保持
> - 新規開発・更新はすべてV3構造で実施
> - V2への変更は禁止（参照のみ許可）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
**管理**: [MIGRATION_STATUS.md](../../../../MIGRATION_STATUS.md)
