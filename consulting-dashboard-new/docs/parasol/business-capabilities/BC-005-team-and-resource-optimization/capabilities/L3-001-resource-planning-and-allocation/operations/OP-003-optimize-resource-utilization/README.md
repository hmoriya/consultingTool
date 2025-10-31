# OP-003: リソース稼働率を最適化する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization

---

## 📋 How: この操作の定義

### 操作の概要
リソースの稼働率を分析し、最適化を実現する。適切な稼働率管理により、生産性向上とバーンアウト防止のバランスを実現する。

### 実現する機能
- リソース稼働率の分析
- 稼働率の最適化提案
- 過負荷・低稼働の検知
- 稼働率レポートの生成

### 入力
- 工数実績データ
- プロジェクト配分データ
- 目標稼働率
- 分析期間

### 出力
- 稼働率分析レポート
- 最適化提案
- 過負荷・低稼働アラート
- リバランス計画

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
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/optimize-resource-utilization/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
