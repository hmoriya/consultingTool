# OP-002: スキルマトリックスを作成する

**作成日**: 2025-10-31
**所属L3**: L3-004-capability-and-skill-development: Capability And Skill Development
**所属BC**: BC-005: Team & Resource Optimization
**V2移行元**: services/talent-optimization-service/capabilities/visualize-and-develop-skills/operations/create-skill-matrix

---

## 📋 How: この操作の定義

### 操作の概要
組織全体のスキル保有状況を可視化するスキルマトリックスを作成する。スキルの見える化により、最適なリソース配分とスキル開発を促進する。

### 実現する機能
- スキルマトリックスの作成と更新
- メンバー別スキルレベルの登録
- スキルカテゴリの定義と管理
- スキルマトリックスの可視化

### 入力
- スキル定義とカテゴリ
- メンバーのスキル情報
- スキルレベル基準
- 認定・資格情報

### 出力
- スキルマトリックス
- スキル保有状況レポート
- スキル分布グラフ
- スキルインベントリ

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
> - [services/talent-optimization-service/capabilities/visualize-and-develop-skills/operations/create-skill-matrix/](../../../../../../../services/talent-optimization-service/capabilities/visualize-and-develop-skills/operations/create-skill-matrix/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
