# L3-002: Knowledge Discovery & Application

**作成日**: 2025-10-31
**所属BC**: BC-006: Knowledge Management & Organizational Learning
**V2移行元**: knowledge-management (活用フェーズ)

---

## 📋 What: この能力の定義

### 能力の概要
組織の知識を発見し実務に活用する能力。知識検索、活用促進、共有を通じて、組織学習を加速します。

### 実現できること
- 効率的な知識検索
- 関連知識の推薦
- 知識の実務適用
- 知識共有の促進
- 知識活用状況の可視化

### 必要な知識
- 情報検索技術
- レコメンデーションシステム
- ナレッジマネジメント
- 組織学習理論
- 活用促進手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: KnowledgeDiscoveryAggregate ([../../domain/README.md](../../domain/README.md#knowledge-discovery-aggregate))
- **Entities**: SearchQuery, KnowledgeRecommendation, KnowledgeUsage, SharedKnowledge
- **Value Objects**: RelevanceScore, UsageFrequency, ShareScope

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - GET /api/knowledge/search - 知識検索
  - POST /api/knowledge/apply - 知識活用
  - POST /api/knowledge/share - 知識共有

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: search_queries, knowledge_recommendations, knowledge_usage, shared_knowledge

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 知識を検索する | 全文検索・フィルタリング | 2-3個 | search-knowledge |
| **OP-002**: 知識を活用する | 実務への適用 | 2個 | apply-knowledge |
| **OP-003**: 知識を共有する | チーム・組織への展開 | 2個 | share-knowledge |

詳細: [operations/](operations/)

---

## 📊 統計情報

- **Operations数**: 3個
- **推定UseCase数**: 6個
- **V2からの移行**: 単一capabilityを作成フェーズと活用フェーズに分割

---

## 🔗 V2構造への参照

> ⚠️ **移行のお知らせ**: このL3はV2構造から移行中です。
>
> **V2参照先（参照のみ）**:
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/](../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/) (search/apply/share部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-002 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
