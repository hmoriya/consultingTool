# OP-001: チームを編成する

**作成日**: 2025-10-31
**所属L3**: L3-002-team-formation-and-composition: Team Formation And Composition
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/form-and-optimize-teams/operations/form-teams

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや業務目的に応じて最適なチームを編成する。スキル、経験、相性を考慮したチーム編成により、高いパフォーマンスを実現する。

### 実現する機能
- プロジェクト要件に基づくチーム編成
- スキルバランスの最適化
- チームメンバーの選定と配置
- チーム編成計画の作成

### 入力
- プロジェクト要件
- 利用可能メンバー情報
- スキルマトリックス
- チーム編成基準

### 出力
- チーム編成計画
- チームメンバーリスト
- ロール割り当て
- チーム編成の承認依頼

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
> - [services/talent-optimization-service/capabilities/form-and-optimize-teams/operations/form-teams/](../../../../../../../services/talent-optimization-service/capabilities/form-and-optimize-teams/operations/form-teams/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
