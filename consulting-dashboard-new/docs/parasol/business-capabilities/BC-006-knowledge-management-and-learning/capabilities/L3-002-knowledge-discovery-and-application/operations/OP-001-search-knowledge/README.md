# OP-001: 知識を検索する

**作成日**: 2025-10-31
**所属L3**: L3-002-knowledge-discovery-and-application: Knowledge Discovery And Application
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/search-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
必要な知識を効率的に検索し、発見する。強力な検索機能により、適切なタイミングで適切な知識へのアクセスを実現する。

### 実現する機能
- 全文検索とキーワード検索
- カテゴリ・タグによるフィルタリング
- 関連知識の推薦
- 検索履歴と人気知識の表示

### 入力
- 検索キーワード
- フィルタ条件（カテゴリ、タグ、日付等）
- ユーザーのコンテキスト
- 検索対象範囲

### 出力
- 検索結果リスト
- 関連知識の推薦
- 検索結果のランキング
- 検索履歴

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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/search-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/search-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
