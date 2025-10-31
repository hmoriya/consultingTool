# OP-004: 工数を記録する

**作成日**: 2025-10-31
**所属L3**: L3-001-resource-planning-and-allocation: Resource Planning And Allocation
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/productivity-visualization-service/capabilities/workload-tracking/operations/record-time

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトやタスクに費やした工数を記録する。正確な工数データにより、プロジェクト管理と稼働率分析の基盤を構築する。

### 実現する機能
- 日次・週次工数の記録
- プロジェクト・タスク別工数入力
- 工数入力のバリデーション
- 工数記録の一時保存と提出

### 入力
- 作業日
- プロジェクト・タスク情報
- 作業時間（時間数）
- 作業内容の説明

### 出力
- 記録された工数データ
- タイムシート（未提出/提出済）
- 工数サマリー
- 承認待ちステータス

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
> - [services/productivity-visualization-service/capabilities/workload-tracking/operations/record-time/](../../../../../../../services/productivity-visualization-service/capabilities/workload-tracking/operations/record-time/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-004 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
