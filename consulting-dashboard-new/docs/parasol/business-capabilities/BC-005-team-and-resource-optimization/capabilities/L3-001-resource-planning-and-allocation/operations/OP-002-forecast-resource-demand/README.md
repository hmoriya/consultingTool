# OP-002: リソース需要を予測する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand

---

## 📋 How: この操作の定義

### 操作の概要
将来のリソース需要を予測し、計画的な人材確保を支援する。パイプライン案件と既存プロジェクトの分析により、適切なリソース計画を実現する。

### 実現する機能
- 将来のリソース需要予測
- パイプライン案件の分析
- スキル別需要予測
- リソース不足の早期警告

### 入力
- パイプライン案件情報
- 既存プロジェクト計画
- 過去のリソース使用実績
- 事業計画

### 出力
- リソース需要予測レポート
- スキル別需要予測
- リソース不足警告
- 採用・育成計画への示唆

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
> - [services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand/](../../../../../../../services/talent-optimization-service/capabilities/optimally-allocate-resources/operations/forecast-resource-demand/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
