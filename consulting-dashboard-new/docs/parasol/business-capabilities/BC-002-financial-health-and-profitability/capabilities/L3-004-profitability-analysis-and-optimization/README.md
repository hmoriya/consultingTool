# L3-004: Profitability Analysis & Optimization

**作成日**: 2025-10-31
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: analyze-and-improve-profitability, optimize-profitability

---

## 📋 What: この能力の定義

### 能力の概要
収益性を分析し、最適化施策を実施する能力。収益性指標の計算、トレンド分析、キャッシュフロー予測、改善アクションの実施を通じて、事業の収益性を最大化します。

### 実現できること
- 収益性指標（利益率、ROI、EVA）の計算
- 収益性トレンドの分析
- キャッシュフロー予測と最適化
- 収益性改善施策の立案と実施
- 事業ポートフォリオの最適化

### 必要な知識
- 財務分析手法
- 収益性指標の理解
- キャッシュフロー分析
- 事業評価手法
- 最適化戦略の策定

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: ProfitabilityAggregate ([../../domain/README.md](../../domain/README.md#profitability-aggregate))
- **Entities**: ProfitabilityMetric, ProfitabilityTrend, CashFlowForecast, ImprovementAction
- **Value Objects**: ProfitMargin, ROI, EVA, CashFlowProjection

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - GET /api/profitability/calculate - 収益性計算
  - GET /api/profitability/trends - トレンド分析
  - POST /api/profitability/forecast - キャッシュフロー予測
  - POST /api/profitability/improve - 改善アクション

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: profitability_metrics, profitability_trends, cash_flow_forecasts, improvement_actions

詳細: [../../data/README.md](../../data/README.md)

---

## 🛠️ 実装アプローチ

### 技術的実現方法

#### アルゴリズム・パターン
- **利益率計算**: 粗利率・営業利益率・純利益率の多段階計算
- **ROI/IRR計算**: 正味現在価値（NPV）、内部収益率（IRR）アルゴリズム
- **EVA計算**: 経済的付加価値（Economic Value Added）算出
- **ポートフォリオ最適化**: 現代ポートフォリオ理論（MPT）による事業配分最適化
- **トレンド分析**: 時系列回帰分析による収益性予測
- **デザインパターン**:
  - Strategy Pattern（異なる収益性指標計算方式）
  - Template Method（共通の財務分析フレームワーク）
  - Observer Pattern（収益性低下アラート通知）

#### 推奨ライブラリ・フレームワーク
- **財務計算**: Decimal.js - 高精度利益率・ROI計算
- **統計分析**: Simple-statistics.js - 回帰分析、相関分析
- **最適化計算**: Optimize.js - ポートフォリオ最適化シミュレーション
- **財務可視化**: Recharts - 利益率トレンド、ウォーターフォールチャート、ROI比較
- **予測分析**: Prophet.js - 時系列予測（収益性将来予測）
- **データ分析**: D3.js - サンキーダイアグラム（収益・コスト・利益フロー）

### パフォーマンス考慮事項

#### スケーラビリティ
- **分析対象期間**: 過去10年 + 未来5年のデータ処理
- **事業単位**: 最大1,000事業単位（プロジェクト/製品/部門）の同時分析
- **シナリオ分析**: 最大100パターンの同時シミュレーション

#### キャッシュ戦略
- **収益性サマリー**: Redis cache（TTL: 30分、収益・コスト更新時に無効化）
- **トレンド分析結果**: 日次計算、メモリキャッシュ（24時間保持）
- **ROI計算結果**: 15分間隔でキャッシュ更新

#### 最適化ポイント
- **集計クエリ最適化**: Materialized View（期間別利益率集計、事業別ROI）
- **バッチ処理**: 収益性指標の日次バッチ計算
- **並列計算**: 複数事業単位のROI/IRR並列計算（WebWorker活用）
- **インデックス活用**: `profitability_metrics(fiscal_period, metric_type)`, `cash_flow_forecasts(projection_date)`

---

## ⚠️ 前提条件と制約

### BC間連携

#### 依存BC
- **BC-001: Project Delivery & Quality** - プロジェクト別収益性の分析
  - 使用API: `GET /api/bc-001/projects/{projectId}/financials` - プロジェクト財務データ取得
  - 使用API: `GET /api/bc-001/projects/{projectId}/performance` - プロジェクトパフォーマンス指標
- **BC-002 L3-002: Cost Management** - コストデータの連携
  - 使用API: `GET /api/bc-002/costs/summary?period={period}` - 期間別コスト集計
- **BC-002 L3-003: Revenue Management** - 収益データの連携
  - 使用API: `GET /api/bc-002/revenues/summary?period={period}` - 期間別収益集計
- **BC-005: Team & Resource Optimization** - リソース稼働コストの分析
  - 使用API: `GET /api/bc-005/resources/utilization-costs` - リソース稼働コスト
- **BC-007: Team Communication & Collaboration** - 収益性低下アラート
  - 使用API: `POST /api/bc-007/notifications` - 経営層アラート通知
  - 使用API: `POST /api/bc-007/alerts` - 収益性改善アクション提案通知

#### 提供API（他BCから利用）
- **BC-001**: プロジェクト収益性評価、改善提案の参照

### データ整合性要件

#### トランザクション境界
- **収益性計算**: 収益集計 + コスト集計 + 利益率計算 + 指標保存
- **改善アクション**: アクション提案 + 期待効果算出 + 実施計画記録 + 通知送信（BC-007）
- **整合性レベル**: 結果整合性（収益・コストデータは非同期集計、最終的に整合）

#### データ制約
- 計算整合性: 収益性指標は収益・コストデータと整合
- 時系列連続性: 指標は会計期間単位で連続的に記録
- 計算式正確性: 利益率 = (収益 - コスト) / 収益 × 100
- キャッシュフロー予測範囲: 予測期間は最大12ヶ月
- 改善アクション期限: 全改善アクションに実施期限設定必須

### セキュリティ要件

#### 認証・認可
- **認証**: JWT Bearer Token（BC-003発行）
- **必要権限**:
  - 収益性計算: `profitability:calculate` + 財務担当者権限
  - 収益性分析: `profitability:analyze` + 経営層・財務担当者権限
  - 改善アクション提案: `profitability:improve` + 経営層権限

#### データ保護
- **機密度**: 収益性情報はHighly Confidential（経営層のみ）
- **監査ログ**: 収益性計算・分析・改善アクションは全て記録
- **暗号化**: 収益性指標は保存時暗号化（AES-256）
- **アクセス制限**: 事業単位別のアクセス制御（部門別収益性は部門長のみ参照可）

### スケーラビリティ制約

#### 最大同時処理
- **収益性計算**: 同時30計算/秒
- **トレンド分析**: 同時10分析/秒
- **シナリオシミュレーション**: 同時5シミュレーション/秒

#### データ量上限
- **収益性履歴**: 10年間保持（会計法準拠）
- **キャッシュフロー予測**: 過去5年実績 + 未来5年予測保持
- **改善アクション**: アクションあたり最大50ステップ、5年間保持

---

## 🔗 BC設計との統合

### 使用ドメインオブジェクト

#### Aggregates
- **Profitability Aggregate** ([../../domain/README.md#profitability-aggregate](../../domain/README.md#profitability-aggregate))
  - ProfitabilityMetric（集約ルート）: 収益性指標の計算と追跡
  - ProfitMargin: 利益率指標
  - CashFlowProjection: キャッシュフロー予測
  - ImprovementAction: 収益性改善アクション

#### Value Objects
- **ProfitMargin**: 利益率（粗利率・営業利益率・純利益率）
- **ROI**: 投資収益率（Return on Investment）
- **IRR**: 内部収益率（Internal Rate of Return）
- **NPV**: 正味現在価値（Net Present Value）
- **EVA**: 経済的付加価値（Economic Value Added）
- **CashFlowProjection**: キャッシュフロー予測値

#### Domain Events
- **ProfitabilityCalculated**: 収益性指標計算イベント
- **ProfitMarginDeclined**: 利益率低下イベント → BC-007経営層アラート
- **CashFlowProjectionUpdated**: キャッシュフロー予測更新イベント
- **NegativeCashFlowPredicted**: マイナスキャッシュフロー予測イベント → BC-007緊急通知
- **ImprovementActionPlanned**: 収益性改善アクション計画イベント

### 呼び出すAPI例

#### 収益性計算
```http
POST /api/v1/bc-002/profitability/calculate
Content-Type: application/json
Authorization: Bearer {token}

{
  "period": "2025-Q3",
  "businessUnit": "全社",
  "includeMetrics": ["grossMargin", "operatingMargin", "netMargin", "roi", "eva"]
}
```

#### 収益性トレンド分析
```http
GET /api/v1/bc-002/profitability/trends?period=2024-01-01:2025-12-31&metric=grossMargin&analysisType=regression
```

#### キャッシュフロー予測
```http
POST /api/v1/bc-002/profitability/forecast-cashflow
Content-Type: application/json

{
  "forecastPeriod": 12,
  "confidenceLevel": 0.95,
  "scenarios": ["optimistic", "base", "pessimistic"],
  "assumptions": {
    "revenueGrowthRate": 0.15,
    "costReductionTarget": 0.10,
    "marketConditions": "stable"
  }
}
```

#### 改善アクション提案
```http
POST /api/v1/bc-002/profitability/improvement-actions
Content-Type: application/json

{
  "targetMetric": "operatingMargin",
  "currentValue": 0.12,
  "targetValue": 0.18,
  "timeframe": "6months",
  "constraints": {
    "maintainQuality": true,
    "maxHeadcountReduction": 0.05,
    "criticalProjects": ["project-uuid-1", "project-uuid-2"]
  }
}
```

#### BC連携: 収益性低下アラート（BC-007）
```http
POST /api/v1/bc-007/alerts
Content-Type: application/json

{
  "type": "profit_margin_declined",
  "recipientId": "executive-team-group",
  "priority": "critical",
  "content": {
    "metricId": "profitability-metric-uuid",
    "period": "2025-Q3",
    "metric": "grossMargin",
    "previousValue": 0.42,
    "currentValue": 0.35,
    "decline": -0.07,
    "threshold": 0.40,
    "actionRequired": "緊急収益性改善会議の開催",
    "suggestedActions": [
      "コスト削減プラン策定",
      "価格戦略見直し",
      "低収益プロジェクトの見直し"
    ]
  }
}
```

### データアクセスパターン

#### 読み取り
- **profitability_metrics テーブル**:
  - インデックス: `idx_profitability_fiscal_period`（期間別指標取得）
  - インデックス: `idx_profitability_metric_type`（指標種別取得）
  - 集計クエリ: 四半期別利益率トレンド（GROUP BY fiscal_quarter, metric_type）
- **cash_flow_forecasts テーブル**:
  - インデックス: `idx_cashflow_projection_date`（予測日時系列取得）
  - クエリ: 未来12ヶ月のキャッシュフロー予測（projection_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 12 MONTH)）
- **improvement_actions テーブル**:
  - インデックス: `idx_improvement_deadline`（期限順ソート）
  - インデックス: `idx_improvement_status`（実施状況フィルタ）

#### 書き込み
- **収益性計算トランザクション**:
  ```sql
  BEGIN;
  -- 収益・コスト集計（他L3からデータ取得）
  SELECT SUM(amount) INTO @total_revenue FROM revenues WHERE fiscal_period = ?;
  SELECT SUM(amount) INTO @total_cost FROM costs WHERE fiscal_period = ?;

  -- 利益率計算
  SET @gross_profit = @total_revenue - @total_cost;
  SET @profit_margin = (@gross_profit / @total_revenue) * 100;

  -- 収益性指標保存
  INSERT INTO profitability_metrics (fiscal_period, gross_profit, net_profit, profit_margin, calculated_at)
  VALUES (?, ?, ?, ?, NOW());

  -- 閾値チェック: profit_margin < 35%
  -- イベント発行: ProfitabilityCalculated, ProfitMarginDeclined（条件満たす場合）
  COMMIT;
  ```
- **改善アクション計画**:
  ```sql
  INSERT INTO improvement_actions (action_type, target_metric, expected_impact, deadline, status)
  VALUES (?, ?, ?, ?, 'planned');

  -- イベント発行: ImprovementActionPlanned
  ```

#### キャッシュアクセス
- **収益性サマリー**:
  ```
  Key: `profitability:summary:period:{period}`
  Value: { grossMargin: 0.42, operatingMargin: 0.18, netMargin: 0.12, roi: 0.25, eva: 5000000 }
  TTL: 1800秒（30分）
  Invalidation: 収益・コスト更新時
  ```
- **収益性トレンド**:
  ```
  Key: `profitability:trend:{metric}:range:{startDate}:{endDate}`
  Value: { trend: [Q1: 0.40, Q2: 0.42, Q3: 0.38, Q4: 0.41], forecast: [Q1: 0.43, Q2: 0.45] }
  TTL: 86400秒（24時間）
  Invalidation: 日次バッチ再計算時
  ```
- **キャッシュフロー予測**:
  ```
  Key: `profitability:cashflow:forecast:{scenarioType}`
  Value: {
    optimistic: { months: [12M, 13M, 14M, ...], netCashFlow: [15M, 18M, 22M, ...] },
    base: { months: [12M, 13M, 14M, ...], netCashFlow: [13M, 14M, 15M, ...] },
    pessimistic: { months: [12M, 13M, 14M, ...], netCashFlow: [10M, 11M, 12M, ...] }
  }
  TTL: 86400秒（24時間）
  Invalidation: 日次バッチ再計算時
  ```

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 収益性を計算する | 各種収益性指標の算出 | 2-3個 | calculate-profitability, optimize-profitability |
| **OP-002**: 収益性トレンドを分析する | 時系列分析とパターン発見 | 2-3個 | analyze-profitability-trends |
| **OP-003**: キャッシュフローを予測・最適化する | 将来予測と最適化 | 2-3個 | forecast-and-optimize-cashflow |
| **OP-004**: 改善アクションを提案・実施する | 収益性向上施策の実行 | 2-3個 | propose-improvement-actions |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 4個
- **推定UseCase数**: 8-12個
- **V2からの移行**: optimize-profitability を統合

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/](../../../../services/revenue-optimization-service/capabilities/analyze-and-improve-profitability/)
> - [services/revenue-optimization-service/capabilities/optimize-profitability/](../../../../services/revenue-optimization-service/capabilities/optimize-profitability/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-004 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
