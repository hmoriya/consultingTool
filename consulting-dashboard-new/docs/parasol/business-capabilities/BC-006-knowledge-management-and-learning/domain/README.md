# BC-006: ドメイン設計

**BC**: Knowledge Management & Organizational Learning
**作成日**: 2025-10-31
**V2移行元**: services/knowledge-co-creation-service/domain-language.md

---

## 概要

このドキュメントは、BC-006（ナレッジ管理と組織学習）のドメインモデルを定義します。

## 主要集約（Aggregates）

### 1. Knowledge Aggregate
**集約ルート**: KnowledgeArticle [KnowledgeArticle] [KNOWLEDGE_ARTICLE]
- **責務**: ナレッジのライフサイクル管理
- **包含エンティティ**: ArticleVersion, ArticleTag, QualityReview
- **不変条件**: 検証済みナレッジのみ公開可能

### 2. KnowledgeCategory Aggregate
**集約ルート**: Category [Category] [CATEGORY]
- **責務**: ナレッジ分類体系の管理
- **包含エンティティ**: Subcategory, CategoryTag
- **不変条件**: カテゴリ階層に循環参照が存在しない

---

## 主要エンティティ（Entities）

### KnowledgeArticle [KnowledgeArticle] [KNOWLEDGE_ARTICLE]
ナレッジ記事 [KnowledgeArticle] [KNOWLEDGE_ARTICLE]
├── 記事ID [ArticleID] [ARTICLE_ID]: UUID
├── タイトル [Title] [TITLE]: STRING_200
├── 内容 [Content] [CONTENT]: TEXT
├── 状態 [Status] [STATUS]: ENUM（draft/review/published/archived）
├── 品質スコア [QualityScore] [QUALITY_SCORE]: DECIMAL(3,2)
├── 閲覧数 [ViewCount] [VIEW_COUNT]: INTEGER
├── 作成者 [AuthorID] [AUTHOR_ID]: UUID
└── 作成日時 [CreatedAt] [CREATED_AT]: TIMESTAMP

### Tag [Tag] [TAG]
タグ [Tag] [TAG]
├── タグID [TagID] [TAG_ID]: UUID
├── タグ名 [TagName] [TAG_NAME]: STRING_50
└── 使用頻度 [UsageCount] [USAGE_COUNT]: INTEGER

### Category [Category] [CATEGORY]
カテゴリ [Category] [CATEGORY]
├── カテゴリID [CategoryID] [CATEGORY_ID]: UUID
├── カテゴリ名 [CategoryName] [CATEGORY_NAME]: STRING_100
├── 親カテゴリID [ParentCategoryID] [PARENT_CATEGORY_ID]: UUID
└── 階層レベル [HierarchyLevel] [HIERARCHY_LEVEL]: INTEGER

### BestPractice [BestPractice] [BEST_PRACTICE]
ベストプラクティス [BestPractice] [BEST_PRACTICE]
├── プラクティスID [PracticeID] [PRACTICE_ID]: UUID
├── プラクティス名 [PracticeName] [PRACTICE_NAME]: STRING_200
├── 説明 [Description] [DESCRIPTION]: TEXT
├── 成功事例 [SuccessStory] [SUCCESS_STORY]: TEXT
└── 適用回数 [ApplicationCount] [APPLICATION_COUNT]: INTEGER

---

## 主要値オブジェクト（Value Objects）

### KnowledgeMetadata [KnowledgeMetadata] [KNOWLEDGE_METADATA]
ナレッジメタデータ [KnowledgeMetadata] [KNOWLEDGE_METADATA]
├── 作成者 [author] [AUTHOR]: STRING_100
├── 作成日 [createdDate] [CREATED_DATE]: DATE
├── 更新日 [updatedDate] [UPDATED_DATE]: DATE
└── バージョン [version] [VERSION]: STRING_20

### KnowledgeQuality [KnowledgeQuality] [KNOWLEDGE_QUALITY]
ナレッジ品質 [KnowledgeQuality] [KNOWLEDGE_QUALITY]
├── 正確性スコア [accuracyScore] [ACCURACY_SCORE]: DECIMAL(3,2)
├── 完全性スコア [completenessScore] [COMPLETENESS_SCORE]: DECIMAL(3,2)
├── 有用性スコア [usefulnessScore] [USEFULNESS_SCORE]: DECIMAL(3,2)
└── 総合品質スコア [overallScore] [OVERALL_SCORE]: DECIMAL(3,2)

---

## ドメインサービス

### KnowledgeCaptureService
**責務**: ナレッジ捕捉
- `extractKnowledge()`: プロジェクトからナレッジ抽出（→ BC-001連携）
- `validateQuality()`: ナレッジ品質検証
- `categorizeKnowledge()`: ナレッジ分類

### KnowledgeDiscoveryService
**責務**: ナレッジ発見
- `searchKnowledge()`: ナレッジ検索
- `recommendKnowledge()`: ナレッジ推奨
- `analyzeKnowledgeGaps()`: ナレッジギャップ分析

---

## V2からの移行メモ

### 移行済み
- ✅ KnowledgeArticle, Tag, Categoryエンティティの定義
- ✅ 集約境界の明確化
- ✅ 作成フェーズと活用フェーズの分離

### 移行中
- 🟡 詳細なドメインルールのドキュメント化
- 🟡 aggregates.md, entities.md, value-objects.mdへの分割

---

**ステータス**: Phase 0 - 基本構造作成完了
**次のアクション**: 詳細ドメインモデルの文書化
