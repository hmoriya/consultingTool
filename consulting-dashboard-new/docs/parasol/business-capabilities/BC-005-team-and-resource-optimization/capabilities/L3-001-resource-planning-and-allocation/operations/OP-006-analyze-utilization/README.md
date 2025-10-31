# OP-006: 稼働率を分析する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/productivity-visualization-service/capabilities/workload-tracking/operations/analyze-utilization

---

## 📋 How: この操作の定義

### 操作の概要
承認済み工数データから稼働率を分析し、リソース活用状況を可視化する。データドリブンな稼働率管理により、生産性の最適化を実現する。

### 実現する機能
- 稼働率の計算と集計
- 個人・チーム・プロジェクト別分析
- 稼働率トレンドの可視化
- ベンチマーク比較

### 入力
- 承認済み工数データ
- 稼働可能時間
- 分析期間と粒度
- ベンチマークデータ

### 出力
- 稼働率レポート
- 稼働率ダッシュボード
- トレンド分析結果
- 改善提案

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
> - [services/productivity-visualization-service/capabilities/workload-tracking/operations/analyze-utilization/](../../../../../../../services/productivity-visualization-service/capabilities/workload-tracking/operations/analyze-utilization/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-006 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
