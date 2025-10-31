# BC-002: Financial Health & Profitability

**作成日**: 2025-10-31
**バージョン**: 1.0.0 (v3.0)
**移行元**: revenue-optimization-service (V2)

---

## 🎯 Why: ビジネス価値

このBCが解決するビジネス課題:
- 予算管理の不透明性による計画外支出の発生
- コスト構造の把握不足による収益性の低下
- 収益認識の遅延による資金繰りの悪化
- 収益性分析の不足による改善機会の損失
- 財務データの分散による経営判断の遅延

提供するビジネス価値:
- **予算統制**: 体系的な予算管理により、計画外支出を防止
- **コスト最適化**: 詳細なコスト分析により、無駄なコストを削減
- **収益最大化**: タイムリーな収益認識とキャッシュフロー管理により、資金効率を向上
- **収益性向上**: 多角的な収益性分析により、利益率を改善
- **経営判断支援**: リアルタイムな財務情報により、迅速な意思決定を実現

---

## 📋 What: 機能（L3能力）

このBCが提供する能力:

### L3-001: Budget Planning & Control
**能力**: 予算を計画し、厳格に統制する
- 予算の策定と承認
- 予算執行のモニタリング
- 予算の再配分と修正
- 予算実績差異分析
- 詳細: [capabilities/L3-001-budget-planning-and-control/](capabilities/L3-001-budget-planning-and-control/)

### L3-002: Cost Management & Optimization
**能力**: コストを記録し、最適化する
- コストの記録と分類
- コストトレンド分析
- コスト配分の最適化
- 詳細: [capabilities/L3-002-cost-management-and-optimization/](capabilities/L3-002-cost-management-and-optimization/)

### L3-003: Revenue & Cash Flow Management
**能力**: 収益を認識し、キャッシュフローを管理する
- 収益の認識と記録
- 収益予測と最大化
- 請求書発行と回収管理
- 詳細: [capabilities/L3-003-revenue-and-cash-flow-management/](capabilities/L3-003-revenue-and-cash-flow-management/)

### L3-004: Profitability Analysis & Optimization
**能力**: 収益性を分析し、最適化する
- 収益性の計算と測定
- 収益性トレンド分析
- キャッシュフロー予測
- 改善アクションの提案
- 詳細: [capabilities/L3-004-profitability-analysis-and-optimization/](capabilities/L3-004-profitability-analysis-and-optimization/)

---

## 🏗️ How: 設計方針

### ドメイン設計
- [domain/README.md](domain/README.md)
- **主要集約**: Budget Aggregate, Cost Aggregate, Revenue Aggregate, Profitability Aggregate
- **主要エンティティ**: Budget, BudgetItem, Cost, Revenue, Invoice, ProfitabilityMetric
- **主要値オブジェクト**: MoneyAmount, CostCategory, RevenueStream, ProfitMargin

**V2からの移行**:
- `services/revenue-optimization-service/domain-language.md` → `domain/`へ分割整理

### API設計
- [api/README.md](api/README.md)
- **API仕様**: [api/api-specification.md](api/api-specification.md) ← Issue #146対応済み
- **エンドポイント**: [api/endpoints/](api/endpoints/)
- **スキーマ**: [api/schemas/](api/schemas/)

**V2からの移行**:
- `services/revenue-optimization-service/api/api-specification.md` → `api/api-specification.md`
- Issue #146のWHAT/HOW分離構造を維持

### データ設計
- [data/README.md](data/README.md)
- **データベース設計**: [data/database-design.md](data/database-design.md)
- **主要テーブル**: budgets, budget_items, costs, revenues, invoices, profitability_metrics
- **データフロー**: [data/data-flow.md](data/data-flow.md)

**V2からの移行**:
- `services/revenue-optimization-service/database-design.md` → `data/database-design.md`

---

## 📦 BC境界

### トランザクション境界
- **BC内のL3/Operation間**: 強整合性
  - Budget → BudgetItem の一貫性保証
  - Cost → CostAllocation の整合性維持
  - Revenue → Invoice の状態遷移整合性
- **BC間**: 結果整合性（イベント駆動）
  - Project BC (BC-001) からのコスト発生イベント受信
  - Resource BC (BC-005) からのリソースコストイベント受信

### 他BCとの連携

#### BC-001: Project Delivery & Quality Management
- **連携内容**: プロジェクトコスト配分、予算消化情報
- **連携方向**: BC-001 → BC-002（コスト発生イベント）
- **連携方式**: イベント駆動（ProjectCostIncurred, BudgetConsumed）

#### BC-005: Team & Resource Optimization
- **連携内容**: リソースコスト情報、人件費配分
- **連携方向**: BC-005 → BC-002（リソースコストイベント）
- **連携方式**: イベント駆動（ResourceCostAllocated）

#### BC-006: Knowledge Management & Organizational Learning
- **連携内容**: 財務ベストプラクティス、コスト削減ノウハウ
- **連携方向**: BC-002 ⇄ BC-006（双方向）
- **連携方式**: ユースケース呼び出し型（知識検索・登録API）

#### BC-007: Team Communication & Collaboration
- **連携内容**: 予算アラート、承認通知
- **連携方向**: BC-002 → BC-007（通知イベント）
- **連携方式**: イベント駆動（BudgetThresholdExceeded, ApprovalRequired）

---

## 📊 統計情報

### V2からの移行統計
- **V2 Capabilities**: 5個
- **V3 L3 Capabilities**: 4個（統合により-1）
- **Operations数**: 13-14個（重複削除済み）
- **統合アクション**:
  - ✅ 「optimize-profitability」を「analyze-and-improve-profitability」に統合
  - ✅ 「track-revenue」を「recognize-and-maximize-revenue」に統合

### 規模
- **L3 Capabilities**: 4個（ガイドライン準拠）
- **1 L3あたりOperation数**: 3.3-3.5個（ガイドライン準拠）
- **推定UseCase数**: 16-20個

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このBCはV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/revenue-optimization-service/](../../services/revenue-optimization-service/)
>
> V2構造は2026年1月まで参照可能です（読み取り専用）。

### V2 Capabilityマッピング

| V2 Capability | V3 L3 Capability | 備考 |
|--------------|------------------|------|
| formulate-and-control-budget | L3-001: Budget Planning & Control | 移行完了 |
| control-and-optimize-costs | L3-002: Cost Management & Optimization | 移行完了 |
| recognize-and-maximize-revenue | L3-003: Revenue & Cash Flow Management | track-revenue統合済み |
| analyze-and-improve-profitability | L3-004: Profitability Analysis & Optimization | optimize統合済み |
| optimize-profitability | L3-003, L3-004に分散統合 | 統合済み |

---

## ✅ 品質基準

### 成功指標
- [ ] 予算遵守率 ≥ 90%
- [ ] コスト削減目標達成率 ≥ 80%
- [ ] 収益認識適時性 ≤ 3日以内
- [ ] 収益性改善率 ≥ 10% YoY
- [ ] キャッシュフロー予測精度 ≥ 95%

### アーキテクチャ品質
- [x] L3 Capability数が3-5個の範囲（4個）
- [x] 各L3のOperation数が2-4個の範囲
- [x] BC間依存が適切に定義されている
- [x] Issue #146（API WHAT/HOW分離）に準拠

---

## 📚 関連ドキュメント

### 必須参照
- [V2_V3_MAPPING.md](../../V2_V3_MAPPING.md) - V2→V3詳細マッピング
- [MIGRATION_STATUS.md](../../MIGRATION_STATUS.md) - 移行ステータス
- [V2_V3_COEXISTENCE_STRATEGY.md](../../V2_V3_COEXISTENCE_STRATEGY.md) - 共存戦略

### 設計ガイド
- [parasol-design-process-guide.md](../../parasol-design-process-guide.md) - v3.0対応プロセス

### Issue #146関連
- API WHAT/HOW分離ガイド（Issue #146対応）

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | BC-002 README初版作成（Phase 0） | Claude |

---

**ステータス**: Phase 0 - アーキテクチャレビュー準備完了
**次のアクション**: L3 Capabilityディレクトリとドキュメントの作成
