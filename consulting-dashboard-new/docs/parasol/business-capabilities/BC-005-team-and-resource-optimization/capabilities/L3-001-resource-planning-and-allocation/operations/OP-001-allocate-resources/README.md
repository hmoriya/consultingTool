# OP-001: リソースを配分する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや業務に対して最適なリソース（人材）を配分する。スキル、稼働率、コストを考慮した配分により、生産性とプロジェクト成功率を最大化する。

### 実現する機能
- プロジェクトへのリソース割り当て
- スキルマッチングに基づく配分
- 稼働率と負荷の考慮
- リソース配分計画の作成

### 入力
- プロジェクト要件（必要スキル、期間、工数）
- 利用可能リソース情報
- スキルマトリックス
- 現在の稼働状況

### 出力
- リソース配分計画
- プロジェクト別アサイン情報
- 稼働率予測
- 配分承認依頼

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
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/allocate-resources/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
