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
