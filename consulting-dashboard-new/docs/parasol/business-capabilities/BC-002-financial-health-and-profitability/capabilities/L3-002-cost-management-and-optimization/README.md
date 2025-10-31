# L3-002: Cost Management & Optimization

**作成日**: 2025-10-31
**所属BC**: BC-002: Financial Health & Profitability
**V2移行元**: control-and-optimize-costs

---

## 📋 What: この能力の定義

### 能力の概要
コストを記録・分析し、最適化する能力。コストの可視化、トレンド分析、最適化施策の実施を通じて、収益性を向上させます。

### 実現できること
- 全コストの正確な記録と分類
- コストトレンドの分析
- コスト超過の早期発見
- コスト最適化機会の特定
- コスト削減施策の実施と効果測定

### 必要な知識
- コスト会計
- ABC（活動基準原価計算）
- コスト削減手法
- ベンチマーキング
- コスト分析技法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: CostManagementAggregate ([../../domain/README.md](../../domain/README.md#cost-management-aggregate))
- **Entities**: Cost, CostCategory, CostAllocation, CostTrend
- **Value Objects**: CostAmount, CostType, Period, CostVariance

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/costs - コスト記録
  - POST /api/costs/categorize - コスト分類
  - GET /api/costs/trends - トレンド分析
  - POST /api/costs/optimize - 最適化施策

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: costs, cost_categories, cost_allocations, cost_trends, optimization_actions

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: コストを記録・分類する | 全コストの捕捉と分類 | 2-3個 | record-and-categorize-costs |
| **OP-002**: コストトレンドを分析する | パターン分析と予測 | 2-3個 | analyze-cost-trends |
| **OP-003**: コストを配分・最適化する | 効率的なコスト管理 | 3-4個 | allocate-and-optimize-costs |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 7-10個
- **V2からの移行**: そのまま移行

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/capabilities/control-and-optimize-costs/](../../../../services/revenue-optimization-service/capabilities/control-and-optimize-costs/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
