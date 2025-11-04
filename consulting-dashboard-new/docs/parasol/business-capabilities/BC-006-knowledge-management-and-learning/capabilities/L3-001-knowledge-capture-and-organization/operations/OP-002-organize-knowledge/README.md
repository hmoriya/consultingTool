# OP-002: 知識を整理する

**作成日**: 2025-10-31
**所属L3**: L3-001-knowledge-capture-and-organization: Knowledge Capture And Organization
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/organize-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
捕捉した知識を体系的に整理し、検索可能な状態にする。タグ付けとカテゴリ化により、知識の発見性と再利用性を高める。

### 実現する機能
- 知識のカテゴリ分類
- タグ付けとキーワード設定
- 関連知識のリンク
- 知識の構造化と体系化

### 入力
- 捕捉された知識
- カテゴリ・タグ体系
- 関連知識情報
- 検索キーワード

### 出力
- 整理された知識
- カテゴリ・タグ情報
- 関連知識マップ
- 検索インデックス

---

## 📥 入力パラメータ

### 必須パラメータ

#### 知識整理基本情報
```typescript
interface KnowledgeOrganizationInput {
  // 対象知識
  articleId: UUID;                    // 整理対象の知識記事ID

  // カテゴリ分類
  categoryId: UUID;                   // 配置先カテゴリID
  categoryPath: string[];             // カテゴリパス（階層表現）

  // タグ情報
  tags: string[];                     // タグリスト（1-20個）
  primaryTags: string[];              // 主要タグ（1-5個）
  secondaryTags?: string[];           // 副次タグ（任意）

  // 関連付け
  relatedArticleIds?: UUID[];         // 関連記事ID（最大50件）
  relatedTopics?: string[];           // 関連トピック

  // メタデータ
  organizerId: UUID;                  // 整理実施者ID
  organizationNote?: string;          // 整理時のメモ
}
```

#### カテゴリ階層情報
```typescript
interface CategoryHierarchyInput {
  // カテゴリ構造
  categoryId: UUID;                   // カテゴリID
  parentCategoryId?: UUID;            // 親カテゴリID（ルートの場合null）
  categoryName: string;               // カテゴリ名（3-100文字）
  categoryLevel: number;              // 階層レベル（1-5）

  // カテゴリ属性
  categoryType: CategoryType;         // カテゴリタイプ
  sortOrder: number;                  // 表示順序
  isActive: boolean;                  // 有効/無効

  // アクセス制御
  visibility: 'public' | 'internal' | 'private';  // 公開範囲
  allowedRoles?: string[];            // アクセス可能ロール
}

enum CategoryType {
  FUNCTIONAL = 'functional',          // 機能別（例: 開発、設計）
  TOPICAL = 'topical',                // トピック別（例: AI、セキュリティ）
  INDUSTRY = 'industry',              // 業界別（例: 金融、製造）
  SKILL_LEVEL = 'skill_level',        // スキルレベル別
  PROJECT_BASED = 'project_based'     // プロジェクト別
}
```

#### タグ管理情報
```typescript
interface TagManagementInput {
  // タグ基本情報
  tagName: string;                    // タグ名（2-50文字）
  tagType: TagType;                   // タグタイプ

  // タグ属性
  tagGroup?: string;                  // タググループ（カテゴリ化）
  synonyms?: string[];                // 同義語タグ
  relatedTags?: string[];             // 関連タグ

  // 使用頻度
  usageCount: number;                 // 使用回数
  popularity: number;                 // 人気度スコア（0-100）

  // 品質管理
  isVerified: boolean;                // 検証済みフラグ
  suggestedBy?: UUID;                 // 提案者ID
}

enum TagType {
  TECHNOLOGY = 'technology',          // 技術タグ（例: Python, React）
  METHODOLOGY = 'methodology',        // 手法タグ（例: Agile, DDD）
  DOMAIN = 'domain',                  // ドメインタグ（例: Finance, Healthcare）
  SKILL = 'skill',                    // スキルタグ
  CUSTOM = 'custom'                   // カスタムタグ
}
```

### 任意パラメータ

#### 自動分類設定
```typescript
interface AutoCategorizationOptions {
  // ML自動分類
  enableAutoCategorization: boolean;  // 自動分類有効化（デフォルト: true）
  confidenceThreshold: number;        // 信頼度閾値（デフォルト: 0.7）

  // 分類手法
  classificationMethod: 'ml' | 'rule-based' | 'hybrid';  // 分類手法
  modelVersion: string;               // 使用モデルバージョン

  // 分類候補
  suggestMultipleCategories: boolean; // 複数候補提示（デフォルト: true）
  maxSuggestions: number;             // 最大候補数（デフォルト: 3）
}
```

#### 知識グラフ構築設定
```typescript
interface KnowledgeGraphOptions {
  // グラフ構築
  buildKnowledgeGraph: boolean;       // 知識グラフ構築（デフォルト: true）
  graphType: 'tree' | 'dag' | 'network';  // グラフタイプ

  // 関連性分析
  relationshipStrength: 'weak' | 'medium' | 'strong';  // 関係強度
  semanticSimilarityThreshold: number;  // セマンティック類似度閾値

  // グラフ深度
  maxRelationshipDepth: number;       // 最大関係深度（デフォルト: 3）
  includeIndirectLinks: boolean;      // 間接リンク含む（デフォルト: true）
}
```

### バリデーションルール

#### 入力検証
```typescript
const validationRules = {
  categoryPath: {
    minDepth: 1,
    maxDepth: 5,
    required: true
  },

  tags: {
    minItems: 1,
    maxItems: 20,
    itemPattern: /^[a-zA-Z0-9\-_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]{2,50}$/,
    required: true
  },

  primaryTags: {
    minItems: 1,
    maxItems: 5,
    mustBeSubsetOfTags: true,
    required: true
  },

  relatedArticleIds: {
    maxItems: 50,
    noDuplicates: true,
    mustExist: true
  },

  categoryHierarchy: {
    noCircularReferences: true,
    maxSiblings: 100,
    uniqueNamePerLevel: true
  }
};
```

#### ビジネスルール検証
```typescript
interface BusinessRuleValidation {
  // カテゴリ検証
  categoryExists: boolean;            // カテゴリ存在確認
  categoryActive: boolean;            // カテゴリ有効性確認
  userHasPermission: boolean;         // カテゴリアクセス権限

  // タグ検証
  tagsExist: boolean;                 // タグ存在確認（新規作成可）
  tagsConsistent: boolean;            // タグ一貫性（同義語チェック）

  // 関連性検証
  relatedArticlesAccessible: boolean; // 関連記事アクセス可能性
  noSelfReference: boolean;           // 自己参照禁止

  // 品質検証
  minimumOrganizationQuality: boolean;  // 最低品質基準
  tagDiversityCheck: boolean;         // タグ多様性（偏り防止）
}
```

---

## 📤 出力仕様

### 成功レスポンス

#### 知識整理完了
```typescript
interface KnowledgeOrganizedResponse {
  // ステータス
  success: true;
  statusCode: 200;
  message: '知識の整理が正常に完了しました';

  // 整理結果
  data: {
    article: {
      // 基本情報
      id: UUID;
      title: string;

      // カテゴリ情報
      category: {
        id: UUID;
        name: string;
        path: string;                 // カテゴリパス（例: "技術/開発/フロントエンド"）
        level: number;                // 階層レベル
        fullPath: Array<{
          id: UUID;
          name: string;
        }>;
      };

      // タグ情報
      tags: {
        primary: Array<{
          id: UUID;
          name: string;
          type: TagType;
          usageCount: number;
        }>;

        secondary: Array<{
          id: UUID;
          name: string;
          type: TagType;
        }>;

        auto: Array<{               // ML自動抽出タグ
          id: UUID;
          name: string;
          confidence: number;         // 信頼度（0-1）
          method: 'ml';
        }>;
      };

      // 関連知識マップ
      relatedKnowledge: {
        // 直接関連
        direct: Array<{
          id: UUID;
          title: string;
          relationship: 'similar' | 'prerequisite' | 'extension' | 'related';
          strength: number;           // 関係強度（0-1）
        }>;

        // 間接関連（知識グラフベース）
        indirect: Array<{
          id: UUID;
          title: string;
          path: string[];             // 関係経路
          distance: number;           // グラフ距離
        }>;

        // カテゴリ内関連
        inCategory: Array<{
          id: UUID;
          title: string;
          similarity: number;
        }>;
      };

      // 知識グラフ情報
      knowledgeGraph: {
        nodeId: string;               // グラフノードID
        connections: number;          // 接続数
        centrality: number;           // 中心性スコア
        clusters: string[];           // 所属クラスタ
      };

      // 整理メタデータ
      organization: {
        organizedBy: {
          id: UUID;
          name: string;
        };
        organizedAt: ISO8601DateTime;
        previousCategory?: string;    // 変更前カテゴリ
        changes: Array<{
          field: string;
          oldValue: any;
          newValue: any;
        }>;
      };
    };

    // 自動分類結果
    autoClassification?: {
      // 推薦カテゴリ
      suggestedCategories: Array<{
        categoryId: UUID;
        categoryName: string;
        categoryPath: string;
        confidence: number;
        reason: string;
      }>;

      // 推薦タグ
      suggestedTags: Array<{
        tagName: string;
        confidence: number;
        source: 'ml' | 'rule' | 'collaborative';
      }>;
    };

    // 検索インデックス更新
    searchIndex: {
      updated: boolean;
      indexName: string;
      category_facets: string[];      // カテゴリファセット
      tag_facets: string[];           // タグファセット
    };
  };

  // 次のアクション
  nextActions: {
    viewInCategory: string;           // カテゴリビューURL
    exploreRelated: string;           // 関連知識探索URL
    editOrganization: string;         // 整理編集URL
  };

  // メタ情報
  meta: {
    processingTime: number;           // 処理時間（ms）
    graphUpdateTime?: number;         // グラフ更新時間（ms）
  };
}
```

#### カテゴリ階層取得
```typescript
interface CategoryHierarchyResponse {
  success: true;
  statusCode: 200;
  message: 'カテゴリ階層を取得しました';

  data: {
    // ツリー構造
    tree: CategoryNode[];

    // フラットリスト
    categories: Array<{
      id: UUID;
      name: string;
      path: string;
      level: number;
      parentId?: UUID;
      childCount: number;
      articleCount: number;
    }>;

    // 統計情報
    statistics: {
      totalCategories: number;
      maxDepth: number;
      avgArticlesPerCategory: number;
    };
  };
}

interface CategoryNode {
  id: UUID;
  name: string;
  path: string;
  level: number;
  articleCount: number;
  children: CategoryNode[];
}
```

### エラーレスポンス構造

```typescript
interface ErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: any;

    // バリデーションエラー
    validationErrors?: Array<{
      field: string;
      value?: any;
      message: string;
      constraint: string;
    }>;

    requestId: string;
  };

  timestamp: ISO8601DateTime;
}
```

---

## 🛠️ 実装ガイダンス

### アーキテクチャパターン

#### レイヤー構造
```
API Layer (REST)
    ↓
Application Service Layer
    ↓
Domain Service Layer
    ├─→ Knowledge Organization Service
    ├─→ Category Management Service
    ├─→ Tag Management Service
    ├─→ Knowledge Graph Service
    └─→ ML Classification Service
    ↓
Domain Model Layer
    ├─→ KnowledgeArticle Aggregate
    ├─→ Category Aggregate
    ├─→ Tag Aggregate
    └─→ KnowledgeGraph Aggregate
    ↓
Infrastructure Layer
    ├─→ PostgreSQL (カテゴリ・タグデータ)
    ├─→ Neo4j / Graph DB (知識グラフ)
    ├─→ Elasticsearch (検索インデックス)
    └─→ ML Service (自動分類)
```

### 実装コンポーネント

#### 1. API Controller実装
```typescript
// PUT /api/knowledge/articles/{id}/organize
@Controller('knowledge/articles')
@UseGuards(AuthGuard)
export class KnowledgeOrganizationController {
  constructor(
    private readonly organizationService: KnowledgeOrganizationService,
    private readonly categoryService: CategoryManagementService,
    private readonly tagService: TagManagementService,
    private readonly graphService: KnowledgeGraphService,
    private readonly mlService: MLClassificationService
  ) {}

  @Put(':id/organize')
  async organizeKnowledge(
    @Param('id') articleId: UUID,
    @Body() input: KnowledgeOrganizationInput,
    @CurrentUser() user: User
  ): Promise<KnowledgeOrganizedResponse> {

    // 1. 入力検証
    await this.validateOrganizationInput(input);

    // 2. 記事取得
    const article = await this.organizationService.getArticle(articleId);
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    // 3. カテゴリ配置
    await this.categoryService.assignCategory(
      articleId,
      input.categoryId,
      user.id
    );

    // 4. タグ付け
    await this.tagService.assignTags(
      articleId,
      input.tags,
      input.primaryTags
    );

    // 5. 関連知識リンク
    if (input.relatedArticleIds) {
      await this.organizationService.linkRelatedArticles(
        articleId,
        input.relatedArticleIds
      );
    }

    // 6. 知識グラフ更新
    await this.graphService.updateKnowledgeGraph(article);

    // 7. ML推薦取得（非同期）
    const suggestions = await this.mlService.getSuggestions(article);

    // 8. 検索インデックス更新
    await this.updateSearchIndex(article);

    // 9. レスポンス構築
    return this.buildOrganizedResponse(article, suggestions);
  }
}
```

#### 2. Knowledge Organization Domain Service
```typescript
@Injectable()
export class KnowledgeOrganizationService {
  constructor(
    private readonly articleRepo: KnowledgeArticleRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly tagRepo: TagRepository,
    private readonly graphRepo: KnowledgeGraphRepository
  ) {}

  async organizeArticle(
    articleId: UUID,
    input: KnowledgeOrganizationInput
  ): Promise<KnowledgeArticle> {

    // 記事取得
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    // カテゴリ検証と設定
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundException(input.categoryId);
    }
    article.setCategory(category);

    // タグ解決と設定
    const tags = await this.resolveTags(input.tags);
    article.setTags(tags, input.primaryTags);

    // 関連記事リンク
    if (input.relatedArticleIds) {
      await this.linkRelatedArticles(article, input.relatedArticleIds);
    }

    // 永続化
    await this.articleRepo.save(article);

    // ドメインイベント発行
    article.addDomainEvent(
      new KnowledgeOrganizedEvent(article, input.categoryId)
    );

    return article;
  }

  private async resolveTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const tagName of tagNames) {
      let tag = await this.tagRepo.findByName(tagName);

      if (!tag) {
        // 新規タグ作成
        tag = Tag.create({ name: tagName });
        await this.tagRepo.save(tag);
      } else {
        // 使用カウント更新
        tag.incrementUsage();
        await this.tagRepo.save(tag);
      }

      tags.push(tag);
    }

    return tags;
  }

  private async linkRelatedArticles(
    article: KnowledgeArticle,
    relatedIds: UUID[]
  ): Promise<void> {
    for (const relatedId of relatedIds) {
      const relatedArticle = await this.articleRepo.findById(relatedId);
      if (relatedArticle) {
        article.linkRelatedArticle(relatedArticle);
      }
    }
  }
}
```

#### 3. Category Management Service
```typescript
@Injectable()
export class CategoryManagementService {
  constructor(
    private readonly categoryRepo: CategoryRepository
  ) {}

  async getCategoryHierarchy(): Promise<CategoryNode[]> {
    // 全カテゴリ取得
    const categories = await this.categoryRepo.findAll();

    // ツリー構造構築
    return this.buildCategoryTree(categories);
  }

  private buildCategoryTree(categories: Category[]): CategoryNode[] {
    const categoryMap = new Map<UUID, Category>();
    const rootNodes: CategoryNode[] = [];

    // マップ構築
    categories.forEach(cat => categoryMap.set(cat.id, cat));

    // ツリー構築
    categories.forEach(cat => {
      const node: CategoryNode = {
        id: cat.id,
        name: cat.name,
        path: cat.path,
        level: cat.level,
        articleCount: cat.articleCount,
        children: []
      };

      if (!cat.parentId) {
        // ルートノード
        rootNodes.push(node);
      } else {
        // 親に追加
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          const parentNode = this.findNodeById(rootNodes, parent.id);
          parentNode?.children.push(node);
        }
      }
    });

    return rootNodes;
  }

  async assignCategory(
    articleId: UUID,
    categoryId: UUID,
    userId: UUID
  ): Promise<void> {
    const article = await this.articleRepo.findById(articleId);
    const category = await this.categoryRepo.findById(categoryId);

    if (!article || !category) {
      throw new Error('Article or Category not found');
    }

    // カテゴリ配置
    article.setCategory(category);

    // 統計更新
    category.incrementArticleCount();

    await this.articleRepo.save(article);
    await this.categoryRepo.save(category);
  }
}
```

#### 4. Tag Management Service
```typescript
@Injectable()
export class TagManagementService {
  constructor(
    private readonly tagRepo: TagRepository
  ) {}

  async assignTags(
    articleId: UUID,
    tagNames: string[],
    primaryTagNames: string[]
  ): Promise<void> {
    const article = await this.articleRepo.findById(articleId);
    if (!article) {
      throw new ArticleNotFoundException(articleId);
    }

    // タグ解決
    const tags = await this.resolveTags(tagNames);
    const primaryTags = tags.filter(t => primaryTagNames.includes(t.name));

    // タグ設定
    article.setTags(tags);
    article.setPrimaryTags(primaryTags);

    // 使用カウント更新
    for (const tag of tags) {
      tag.incrementUsage();
      await this.tagRepo.save(tag);
    }

    await this.articleRepo.save(article);
  }

  async getPopularTags(limit: number = 20): Promise<Tag[]> {
    return this.tagRepo.findMostUsed(limit);
  }

  async suggestTags(content: string): Promise<string[]> {
    // コンテンツベースのタグ推薦
    // TF-IDF、キーワード抽出などを使用
    const keywords = this.extractKeywords(content);
    const existingTags = await this.tagRepo.findByNames(keywords);

    return existingTags.map(t => t.name);
  }
}
```

#### 5. Knowledge Graph Service（Neo4j）
```typescript
@Injectable()
export class KnowledgeGraphService {
  constructor(
    @InjectNeo4jDriver()
    private readonly neo4j: Driver
  ) {}

  async updateKnowledgeGraph(article: KnowledgeArticle): Promise<void> {
    const session = this.neo4j.session();

    try {
      // ノード作成/更新
      await session.run(
        `
        MERGE (a:Article {id: $id})
        SET a.title = $title,
            a.categoryId = $categoryId,
            a.tags = $tags,
            a.updatedAt = datetime()
        `,
        {
          id: article.id,
          title: article.title,
          categoryId: article.categoryId,
          tags: article.tags.map(t => t.name)
        }
      );

      // カテゴリリレーション
      await session.run(
        `
        MATCH (a:Article {id: $articleId})
        MATCH (c:Category {id: $categoryId})
        MERGE (a)-[:BELONGS_TO]->(c)
        `,
        {
          articleId: article.id,
          categoryId: article.categoryId
        }
      );

      // 関連記事リレーション
      if (article.relatedArticleIds) {
        for (const relatedId of article.relatedArticleIds) {
          await session.run(
            `
            MATCH (a:Article {id: $articleId})
            MATCH (r:Article {id: $relatedId})
            MERGE (a)-[:RELATED_TO {strength: $strength}]->(r)
            `,
            {
              articleId: article.id,
              relatedId,
              strength: 0.8  // デフォルト強度
            }
          );
        }
      }

      // タグベースの関連性
      await this.createTagBasedRelationships(session, article);

    } finally {
      await session.close();
    }
  }

  private async createTagBasedRelationships(
    session: Session,
    article: KnowledgeArticle
  ): Promise<void> {
    // 共通タグを持つ記事を関連付け
    await session.run(
      `
      MATCH (a:Article {id: $articleId})
      MATCH (other:Article)
      WHERE other.id <> $articleId
      AND any(tag IN a.tags WHERE tag IN other.tags)
      WITH a, other,
           size([tag IN a.tags WHERE tag IN other.tags]) AS commonTags,
           size(a.tags + other.tags) AS totalTags
      WHERE commonTags >= 2
      MERGE (a)-[:SIMILAR_TO {
        commonTags: commonTags,
        similarity: toFloat(commonTags) / toFloat(totalTags)
      }]->(other)
      `,
      { articleId: article.id }
    );
  }

  async getRelatedArticles(
    articleId: UUID,
    maxDepth: number = 2
  ): Promise<RelatedArticle[]> {
    const session = this.neo4j.session();

    try {
      const result = await session.run(
        `
        MATCH path = (a:Article {id: $articleId})-[:RELATED_TO|SIMILAR_TO*1..$maxDepth]-(related:Article)
        WITH related, length(path) AS distance,
             avg([r IN relationships(path) | r.strength]) AS avgStrength
        RETURN DISTINCT related.id AS id,
               related.title AS title,
               distance,
               avgStrength
        ORDER BY distance ASC, avgStrength DESC
        LIMIT 20
        `,
        { articleId, maxDepth }
      );

      return result.records.map(record => ({
        id: record.get('id'),
        title: record.get('title'),
        distance: record.get('distance'),
        strength: record.get('avgStrength')
      }));

    } finally {
      await session.close();
    }
  }
}
```

#### 6. ML Classification Service
```typescript
@Injectable()
export class MLClassificationService {
  constructor(
    private readonly mlClient: MLServiceClient
  ) {}

  async suggestCategories(
    article: KnowledgeArticle
  ): Promise<CategorySuggestion[]> {
    // 記事コンテンツをベクトル化
    const embedding = await this.mlClient.generateEmbedding(
      article.content
    );

    // カテゴリ分類モデル実行
    const predictions = await this.mlClient.classifyCategory(
      embedding,
      { topK: 3 }
    );

    return predictions.map(pred => ({
      categoryId: pred.categoryId,
      categoryName: pred.categoryName,
      categoryPath: pred.categoryPath,
      confidence: pred.confidence,
      reason: this.explainPrediction(pred)
    }));
  }

  async suggestTags(
    article: KnowledgeArticle
  ): Promise<TagSuggestion[]> {
    // キーワード抽出
    const keywords = await this.mlClient.extractKeywords(
      article.content,
      { maxKeywords: 20 }
    );

    // 既存タグとマッチング
    const matchedTags = await this.matchWithExistingTags(keywords);

    return matchedTags.map(tag => ({
      tagName: tag.name,
      confidence: tag.matchScore,
      source: tag.source
    }));
  }

  private explainPrediction(prediction: any): string {
    // 予測理由の説明生成
    return `キーワード「${prediction.topKeywords.join(', ')}」に基づく分類`;
  }
}
```

### データベーススキーマ（PostgreSQL）

```sql
-- カテゴリテーブル
CREATE TABLE knowledge_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  parent_id UUID REFERENCES knowledge_categories(id) ON DELETE CASCADE,

  -- 階層情報
  path VARCHAR(500) NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  sort_order INTEGER DEFAULT 0,

  -- メタデータ
  category_type VARCHAR(50) NOT NULL,
  visibility VARCHAR(20) NOT NULL DEFAULT 'public',
  is_active BOOLEAN DEFAULT true,

  -- 統計
  article_count INTEGER DEFAULT 0,

  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  -- インデックス
  CONSTRAINT check_no_self_reference CHECK (id <> parent_id)
);

-- タグテーブル
CREATE TABLE knowledge_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(60) UNIQUE NOT NULL,

  -- タグ属性
  tag_type VARCHAR(50) NOT NULL,
  tag_group VARCHAR(100),

  -- 品質管理
  is_verified BOOLEAN DEFAULT false,
  suggested_by UUID REFERENCES users(id),

  -- 統計
  usage_count INTEGER DEFAULT 0,
  popularity INTEGER DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- タグ同義語テーブル
CREATE TABLE tag_synonyms (
  tag_id UUID NOT NULL REFERENCES knowledge_tags(id) ON DELETE CASCADE,
  synonym VARCHAR(50) NOT NULL,

  PRIMARY KEY (tag_id, synonym)
);

-- 記事タグ関連テーブル
CREATE TABLE article_tags (
  article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES knowledge_tags(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (article_id, tag_id)
);

-- 記事関連リンクテーブル
CREATE TABLE article_relationships (
  source_article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  target_article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL,
  strength DECIMAL(3,2) DEFAULT 0.5,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  PRIMARY KEY (source_article_id, target_article_id),
  CONSTRAINT check_no_self_link CHECK (source_article_id <> target_article_id)
);

-- カテゴリ階層クエリ用のCTE
CREATE INDEX idx_categories_parent ON knowledge_categories(parent_id);
CREATE INDEX idx_categories_path ON knowledge_categories USING gin(to_tsvector('simple', path));
CREATE INDEX idx_tags_name ON knowledge_tags(name);
CREATE INDEX idx_tags_usage ON knowledge_tags(usage_count DESC);
CREATE INDEX idx_article_tags_tag ON article_tags(tag_id);
```

### Neo4jスキーマ（知識グラフ）

```cypher
// ノード制約
CREATE CONSTRAINT article_id_unique IF NOT EXISTS
FOR (a:Article) REQUIRE a.id IS UNIQUE;

CREATE CONSTRAINT category_id_unique IF NOT EXISTS
FOR (c:Category) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT tag_name_unique IF NOT EXISTS
FOR (t:Tag) REQUIRE t.name IS UNIQUE;

// インデックス
CREATE INDEX article_title IF NOT EXISTS
FOR (a:Article) ON (a.title);

CREATE INDEX article_tags IF NOT EXISTS
FOR (a:Article) ON (a.tags);

// サンプルクエリ: カテゴリ内の関連記事検索
MATCH (a:Article)-[:BELONGS_TO]->(c:Category {id: $categoryId})
MATCH (a)-[:SIMILAR_TO]-(related:Article)
WHERE related.id <> a.id
RETURN a, related, c
ORDER BY related.similarity DESC
LIMIT 10;

// サンプルクエリ: タグベースのクラスタリング
MATCH (a:Article)
WITH a, a.tags AS tags
UNWIND tags AS tag
WITH tag, collect(a) AS articles
WHERE size(articles) >= 3
RETURN tag, articles;
```

### パフォーマンス最適化

#### 1. カテゴリツリー最適化（Materialized Path）
```typescript
@Injectable()
export class CategoryTreeOptimizer {
  // Materialized Pathパターン使用
  async findSubcategories(categoryId: UUID): Promise<Category[]> {
    const parent = await this.categoryRepo.findById(categoryId);

    // パス前方一致で子孫カテゴリ取得（高速）
    return this.categoryRepo.findByPathPrefix(parent.path);
  }

  // 階層深度制限によるパフォーマンス保証
  async validateCategoryDepth(categoryId: UUID): Promise<boolean> {
    const category = await this.categoryRepo.findById(categoryId);
    return category.level <= 5;  // 最大5階層
  }
}
```

#### 2. タグ正規化キャッシュ
```typescript
@Injectable()
export class TagNormalizationCache {
  constructor(
    @InjectRedis() private readonly redis: Redis
  ) {}

  async getNormalizedTag(rawTag: string): Promise<string> {
    const cacheKey = `tag:normalize:${rawTag.toLowerCase()}`;

    // キャッシュチェック
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    // 正規化処理（同義語解決など）
    const normalized = await this.normalizeTag(rawTag);

    // キャッシュ保存（24時間）
    await this.redis.setex(cacheKey, 86400, normalized);

    return normalized;
  }
}
```

#### 3. 知識グラフクエリ最適化
```typescript
// Neo4jクエリプロファイリング
PROFILE
MATCH path = (a:Article {id: $articleId})-[:RELATED_TO*1..2]-(related:Article)
RETURN related;

// インデックス活用
CREATE INDEX article_category IF NOT EXISTS
FOR (a:Article) ON (a.categoryId);

// クエリヒント使用
MATCH (a:Article {id: $articleId})
USING INDEX a:Article(id)
MATCH (a)-[:RELATED_TO]-(related)
RETURN related;
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### フォーマット
```
ERR_BC006_L3001_OP002_XXX
└─┬─┘ └─┬─┘ └─┬──┘ └─┬─┘ └┬┘
  │     │      │      │    └─ 連番（001-999）
  │     │      │      └────── Operation番号
  │     │      └───────────── L3 Capability番号
  │     └──────────────────── BC番号
  └────────────────────────── プレフィックス
```

### エラーカテゴリ

#### 1. バリデーションエラー (400 Bad Request)

```typescript
// ERR_BC006_L3001_OP002_001: カテゴリ未指定
{
  code: 'ERR_BC006_L3001_OP002_001',
  message: 'カテゴリを選択してください。',
  field: 'categoryId',
  constraint: 'required'
}

// ERR_BC006_L3001_OP002_002: タグ不足
{
  code: 'ERR_BC006_L3001_OP002_002',
  message: 'タグは1個以上20個以内で指定してください。',
  field: 'tags',
  constraint: 'minItems: 1, maxItems: 20',
  currentCount: 0
}

// ERR_BC006_L3001_OP002_003: 主要タグ不正
{
  code: 'ERR_BC006_L3001_OP002_003',
  message: '主要タグは全タグの中から選択してください。',
  field: 'primaryTags',
  details: {
    invalidTags: ['tag-not-in-list'],
    validTags: ['tag1', 'tag2']
  }
}

// ERR_BC006_L3001_OP002_004: カテゴリ階層深度超過
{
  code: 'ERR_BC006_L3001_OP002_004',
  message: 'カテゴリの階層は最大5階層までです。',
  field: 'categoryPath',
  constraint: 'maxDepth: 5',
  currentDepth: 6
}

// ERR_BC006_L3001_OP002_005: 関連記事数超過
{
  code: 'ERR_BC006_L3001_OP002_005',
  message: '関連記事は最大50件まで指定できます。',
  field: 'relatedArticleIds',
  constraint: 'maxItems: 50',
  currentCount: 75
}
```

#### 2. ビジネスルールエラー (422 Unprocessable Entity)

```typescript
// ERR_BC006_L3001_OP002_101: カテゴリ未存在
{
  code: 'ERR_BC006_L3001_OP002_101',
  message: '指定されたカテゴリが見つかりません。',
  details: {
    categoryId: 'uuid-xxxxx',
    suggestion: '有効なカテゴリを選択してください。'
  }
}

// ERR_BC006_L3001_OP002_102: カテゴリ無効
{
  code: 'ERR_BC006_L3001_OP002_102',
  message: 'このカテゴリは無効化されています。',
  details: {
    categoryId: 'uuid-xxxxx',
    categoryName: 'Deprecated Category',
    deactivatedAt: '2024-01-01T00:00:00Z'
  }
}

// ERR_BC006_L3001_OP002_103: カテゴリアクセス権限なし
{
  code: 'ERR_BC006_L3001_OP002_103',
  message: 'このカテゴリへのアクセス権限がありません。',
  details: {
    categoryId: 'uuid-xxxxx',
    categoryName: 'Private Category',
    requiredRole: 'ADMIN'
  }
}

// ERR_BC006_L3001_OP002_104: 関連記事アクセス不可
{
  code: 'ERR_BC006_L3001_OP002_104',
  message: '一部の関連記事にアクセスできません。',
  details: {
    inaccessibleArticles: [
      { id: 'uuid-aaaa', reason: 'archived' },
      { id: 'uuid-bbbb', reason: 'permission_denied' }
    ]
  }
}

// ERR_BC006_L3001_OP002_105: 自己参照リンク
{
  code: 'ERR_BC006_L3001_OP002_105',
  message: '記事自身を関連記事として指定できません。',
  field: 'relatedArticleIds',
  details: {
    selfReferenceId: 'uuid-self'
  }
}

// ERR_BC006_L3001_OP002_106: 循環カテゴリ参照
{
  code: 'ERR_BC006_L3001_OP002_106',
  message: 'カテゴリの循環参照が検出されました。',
  details: {
    cycle: ['cat-A', 'cat-B', 'cat-C', 'cat-A'],
    suggestion: 'カテゴリ階層を見直してください。'
  }
}
```

#### 3. 認証・認可エラー (401/403)

```typescript
// ERR_BC006_L3001_OP002_201: 未認証
{
  code: 'ERR_BC006_L3001_OP002_201',
  message: '認証が必要です。ログインしてください。',
  statusCode: 401
}

// ERR_BC006_L3001_OP002_202: 整理権限なし
{
  code: 'ERR_BC006_L3001_OP002_202',
  message: '知識を整理する権限がありません。',
  statusCode: 403,
  details: {
    requiredRoles: ['CONSULTANT', 'PM', 'KNOWLEDGE_MANAGER'],
    currentRole: 'CLIENT'
  }
}
```

#### 4. 外部サービスエラー (502/503)

```typescript
// ERR_BC006_L3001_OP002_401: 知識グラフ更新失敗
{
  code: 'ERR_BC006_L3001_OP002_401',
  message: '知識グラフの更新に失敗しました。',
  statusCode: 503,
  details: {
    service: 'Neo4j',
    error: 'Connection timeout',
    impact: '記事は整理されましたが、関連性分析は後で実行されます。',
    recovery: '自動的に再試行されます。'
  }
}

// ERR_BC006_L3001_OP002_402: ML分類サービス障害
{
  code: 'ERR_BC006_L3001_OP002_402',
  message: '自動分類サービスが利用できません。',
  statusCode: 503,
  details: {
    service: 'ML Classification',
    error: 'Model unavailable',
    impact: 'カテゴリ・タグの自動推薦が実行されませんでした。',
    recovery: '手動で分類してください。'
  }
}

// ERR_BC006_L3001_OP002_403: Elasticsearch更新失敗
{
  code: 'ERR_BC006_L3001_OP002_403',
  message: '検索インデックスの更新に失敗しました。',
  statusCode: 503,
  details: {
    service: 'Elasticsearch',
    error: 'Index update failed',
    impact: '記事は整理されましたが、検索結果に反映されません。',
    recovery: '後でバッチ処理により更新されます。'
  }
}
```

#### 5. システムエラー (500)

```typescript
// ERR_BC006_L3001_OP002_501: データベースエラー
{
  code: 'ERR_BC006_L3001_OP002_501',
  message: 'データベースエラーが発生しました。',
  statusCode: 500,
  details: {
    error: 'Transaction failed',
    requestId: 'req-xxxxx',
    timestamp: '2024-11-04T11:30:00Z'
  }
}

// ERR_BC006_L3001_OP002_502: グラフ構築失敗
{
  code: 'ERR_BC006_L3001_OP002_502',
  message: '知識グラフの構築に失敗しました。',
  statusCode: 500,
  details: {
    error: 'Graph query execution failed',
    retryable: true,
    suggestion: '再試行してください。'
  }
}
```

### エラーハンドリング実装

#### 1. Global Exception Filter
```typescript
@Catch()
export class KnowledgeOrganizationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let errorResponse: ErrorResponse;

    if (exception instanceof ValidationException) {
      errorResponse = this.handleValidationError(exception);
    } else if (exception instanceof CategoryNotFoundException) {
      errorResponse = this.handleCategoryNotFound(exception);
    } else if (exception instanceof GraphServiceException) {
      errorResponse = this.handleGraphServiceError(exception);
    } else {
      errorResponse = this.handleUnexpectedError(exception);
    }

    // エラーログ記録
    this.logError(exception, request, errorResponse);

    // クライアントへのレスポンス
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleCategoryNotFound(
    exception: CategoryNotFoundException
  ): ErrorResponse {
    return {
      success: false,
      statusCode: 422,
      error: {
        code: 'ERR_BC006_L3001_OP002_101',
        message: '指定されたカテゴリが見つかりません。',
        details: {
          categoryId: exception.categoryId,
          suggestion: '有効なカテゴリを選択してください。'
        },
        requestId: generateRequestId()
      },
      timestamp: new Date().toISOString()
    };
  }
}
```

#### 2. Fallback処理
```typescript
@Injectable()
export class KnowledgeOrganizationFallbackService {
  async organizeWithFallback(
    input: KnowledgeOrganizationInput
  ): Promise<KnowledgeOrganizedResponse> {

    try {
      // メイン処理
      return await this.mainOrganize(input);

    } catch (error) {
      if (this.isGraphServiceError(error)) {
        // グラフサービス障害時: グラフ更新をスキップ
        return await this.organizeWithoutGraph(input);

      } else if (this.isMLServiceError(error)) {
        // ML障害時: 自動推薦なしで処理
        return await this.organizeWithoutML(input);

      } else {
        throw error;  // その他のエラーは上位へ
      }
    }
  }

  private async organizeWithoutGraph(
    input: KnowledgeOrganizationInput
  ): Promise<KnowledgeOrganizedResponse> {
    // グラフ更新をスキップして基本整理のみ実行
    const article = await this.basicOrganize(input);

    // 後でバッチ処理でグラフ更新
    await this.queueGraphUpdate(article.id);

    return this.buildResponse(article, {
      graphUpdated: false,
      warning: '知識グラフの更新は後で実行されます。'
    });
  }
}
```

#### 3. リトライ戦略
```typescript
@Injectable()
export class RetryService {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      delay = 1000,
      backoff = 'exponential'
    } = options;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries || !this.isRetryable(error)) {
          throw error;
        }

        const waitTime = this.calculateDelay(attempt, delay, backoff);
        await this.sleep(waitTime);
      }
    }
  }

  private isRetryable(error: any): boolean {
    return (
      error.code === 'ERR_BC006_L3001_OP002_401' ||  // Graph service
      error.code === 'ERR_BC006_L3001_OP002_403' ||  // Elasticsearch
      error.statusCode === 503                        // Service Unavailable
    );
  }
}
```

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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/organize-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/organize-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
