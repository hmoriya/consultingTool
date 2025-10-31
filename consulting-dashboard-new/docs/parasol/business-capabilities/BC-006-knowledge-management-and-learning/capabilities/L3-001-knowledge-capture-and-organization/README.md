# L3-001: Knowledge Capture & Organization

**作成日**: 2025-10-31
**所属BC**: BC-006: Knowledge Management & Organizational Learning
**V2移行元**: knowledge-management (作成フェーズ)

---

## 📋 What: この能力の定義

### 能力の概要
組織の知識を捕捉し体系的に整理する能力。知識の記録、整理、検証を通じて、組織知識ベースを構築します。

### 実現できること
- 暗黙知の明示化
- 知識の体系的な整理
- 知識品質の検証
- タグ・カテゴリによる分類
- メタデータの付与

### 必要な知識
- 知識管理手法（SECI モデル）
- 分類体系設計
- メタデータ管理
- 情報アーキテクチャ
- 品質管理手法

---

## 🔗 BC設計の参照（How）

### ドメインモデル
- **Aggregates**: KnowledgeArticleAggregate ([../../domain/README.md](../../domain/README.md#knowledge-article-aggregate))
- **Entities**: KnowledgeArticle, Category, Tag, KnowledgeVersion
- **Value Objects**: KnowledgeStatus, QualityScore, ArticleType

### API
- **API仕様**: [../../api/api-specification.md](../../api/api-specification.md)
- **エンドポイント**:
  - POST /api/knowledge/articles - 知識記録
  - PUT /api/knowledge/articles/{id}/organize - 知識整理
  - POST /api/knowledge/articles/{id}/validate - 品質検証

詳細: [../../api/README.md](../../api/README.md)

### データ
- **Tables**: knowledge_articles, categories, tags, article_tags, knowledge_versions

詳細: [../../data/README.md](../../data/README.md)

---

## ⚙️ Operations: この能力を実現する操作

| Operation | 説明 | UseCases | V2移行元 |
|-----------|------|----------|---------|
| **OP-001**: 知識を記録する | 暗黙知の文書化 | 2-3個 | capture-knowledge |
| **OP-002**: 知識を整理する | 分類・タグ付け | 2個 | organize-knowledge |
| **OP-003**: 知識を検証する | 品質チェックと承認 | 2個 | validate-knowledge |

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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/](../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/) (capture/organize/validate部分)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | L3-001 README初版作成（Phase 2） | Claude |

---

**ステータス**: Phase 2 - クロスリファレンス構築中
**次のアクション**: Operationディレクトリの作成とV2からの移行
