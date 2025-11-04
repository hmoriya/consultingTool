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

## 📥 入力パラメータ

### 必須パラメータ

#### 検索クエリ
```typescript
interface KnowledgeSearchInput {
  // 検索クエリ
  query: string;                        // 検索キーワード/フレーズ（必須）
  searchMode: SearchMode;               // 検索モード

  // ページネーション
  page?: number;                        // ページ番号（デフォルト: 1）
  limit?: number;                       // 1ページあたり件数（デフォルト: 20、最大: 100）

  // フィルター条件
  filters?: SearchFilters;              // フィルター

  // ソート順
  sortBy?: SortOption;                  // ソート基準（デフォルト: relevance）
  sortOrder?: 'asc' | 'desc';           // ソート順序（デフォルト: desc）
}

enum SearchMode {
  KEYWORD = 'keyword',                  // キーワード検索（BM25）
  SEMANTIC = 'semantic',                // セマンティック検索（ベクトル）
  HYBRID = 'hybrid',                    // ハイブリッド（BM25 + ベクトル）
  FACETED = 'faceted',                  // ファセット検索
  AUTOCOMPLETE = 'autocomplete'         // オートコンプリート
}

enum SortOption {
  RELEVANCE = 'relevance',              // 関連度
  CREATED_DATE = 'created_date',        // 作成日
  UPDATED_DATE = 'updated_date',        // 更新日
  VIEW_COUNT = 'view_count',            // 閲覧数
  RATING = 'rating'                     // 評価
}
```

#### 検索フィルター
```typescript
interface SearchFilters {
  // カテゴリフィルター
  categoryIds?: UUID[];                 // カテゴリID配列
  categoryPaths?: string[];             // カテゴリパス配列

  // タグフィルター
  tags?: string[];                      // タグ配列（AND条件）
  tagMode?: 'any' | 'all';              // タグ条件（OR/AND）

  // 知識タイプフィルター
  knowledgeTypes?: KnowledgeType[];     // 知識タイプ配列

  // 難易度フィルター
  difficultyLevels?: DifficultyLevel[]; // 難易度配列

  // 日付範囲フィルター
  dateRange?: {
    field: 'created' | 'updated' | 'published';
    from?: ISO8601DateTime;
    to?: ISO8601DateTime;
  };

  // 著者フィルター
  authorIds?: UUID[];                   // 著者ID配列

  // プロジェクトフィルター
  projectIds?: UUID[];                  // プロジェクトID配列

  // ステータスフィルター
  statuses?: ArticleStatus[];           // ステータス配列

  // 評価フィルター
  minRating?: number;                   // 最低評価（1-5）

  // 言語フィルター
  languages?: string[];                 // 言語コード配列（例: ['ja', 'en']）
}
```

### 任意パラメータ

#### ハイブリッド検索オプション
```typescript
interface HybridSearchOptions {
  // BM25とベクトル検索の重み
  keywordWeight?: number;               // BM25重み（0-1、デフォルト: 0.5）
  semanticWeight?: number;              // ベクトル重み（0-1、デフォルト: 0.5）

  // ベクトル検索設定
  embeddingModel?: string;              // 埋め込みモデル（デフォルト: 'all-MiniLM-L6-v2'）
  vectorSimilarityThreshold?: number;   // 類似度閾値（0-1、デフォルト: 0.7）

  // リランキング
  enableReranking?: boolean;            // リランキング有効化
  rerankingModel?: string;              // リランキングモデル
}
```

#### ファセット設定
```typescript
interface FacetOptions {
  // ファセット有効化
  enableFacets: boolean;                // ファセット有効化

  // ファセット対象フィールド
  facetFields?: Array<{
    field: string;                      // フィールド名
    size?: number;                      // 最大ファセット数（デフォルト: 10）
    minDocCount?: number;               // 最小ドキュメント数（デフォルト: 1）
  }>;

  // デフォルトファセット
  defaultFacets?: boolean;              // デフォルトファセット使用
}
```

#### オートコンプリート設定
```typescript
interface AutocompleteOptions {
  // サジェスション数
  maxSuggestions?: number;              // 最大サジェスション数（デフォルト: 5）

  // サジェスション最小長
  minPrefixLength?: number;             // 最小プレフィックス長（デフォルト: 2）

  // ファジネス
  fuzziness?: 'AUTO' | 0 | 1 | 2;       // あいまい検索レベル

  // スコープ
  suggestionScope?: 'title' | 'content' | 'both';  // サジェスション対象
}
```

---

## 📤 出力仕様

### 成功レスポンス

#### 検索結果レスポンス
```typescript
interface KnowledgeSearchResponse {
  success: true;
  statusCode: 200;
  message: '検索が完了しました';

  data: {
    // 検索メタ情報
    search: {
      query: string;                    // 検索クエリ
      searchMode: SearchMode;           // 検索モード
      executionTime: number;            // 実行時間（ms）
      totalResults: number;             // 総件数
      returnedResults: number;          // 返却件数
    };

    // 検索結果
    results: Array<{
      // 記事情報
      id: UUID;
      title: string;
      summary: string;
      content?: string;                 // プレビュー用（最初500文字）

      // ハイライト
      highlights?: {
        title?: string[];               // タイトルハイライト
        content?: string[];             // コンテンツハイライト
        summary?: string[];             // 要約ハイライト
      };

      // メタデータ
      category: {
        id: UUID;
        name: string;
        path: string;
      };
      tags: string[];
      knowledgeType: KnowledgeType;
      difficulty: DifficultyLevel;
      language: string;

      // 著者情報
      author: {
        id: UUID;
        name: string;
      };

      // 統計情報
      viewCount: number;
      rating: number;
      commentCount: number;

      // スコアリング
      score: number;                    // 関連度スコア（0-100）
      scoreBreakdown?: {
        bm25Score?: number;             // BM25スコア
        vectorScore?: number;           // ベクトルスコア
        popularityScore?: number;       // 人気度スコア
      };

      // タイムスタンプ
      createdAt: ISO8601DateTime;
      updatedAt: ISO8601DateTime;
      publishedAt?: ISO8601DateTime;
    }>;

    // ページネーション
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };

    // ファセット（faceted searchの場合）
    facets?: {
      categories: Array<{
        categoryId: UUID;
        categoryName: string;
        count: number;
      }>;
      tags: Array<{
        tag: string;
        count: number;
      }>;
      knowledgeTypes: Array<{
        type: KnowledgeType;
        count: number;
      }>;
      difficulties: Array<{
        level: DifficultyLevel;
        count: number;
      }>;
      authors: Array<{
        authorId: UUID;
        authorName: string;
        count: number;
      }>;
    };

    // 関連検索
    relatedQueries?: string[];          // 関連検索キーワード

    // 検索品質
    searchQuality?: {
      confidence: number;               // 検索信頼度（0-100）
      alternativeQueries?: string[];    // 代替クエリ提案
      didYouMean?: string;              // スペル訂正提案
    };
  };

  meta: {
    searchEngine: 'Elasticsearch';
    indexName: string;
    shardInfo?: object;
  };
}
```

#### オートコンプリートレスポンス
```typescript
interface AutocompleteResponse {
  success: true;
  statusCode: 200;
  message: 'サジェスションが取得されました';

  data: {
    query: string;                      // 入力クエリ
    suggestions: Array<{
      text: string;                     // サジェストテキスト
      score: number;                    // スコア
      type: 'article' | 'tag' | 'category' | 'keyword';
      metadata?: {
        articleId?: UUID;
        categoryId?: UUID;
        hitCount?: number;
      };
    }>;
  };
}
```

---

## 🛠️ 実装ガイダンス

### アーキテクチャパターン

```
API Layer
    ↓
Application Service Layer
    ↓
Domain Service Layer
    ├─→ Keyword Search Service (BM25)
    ├─→ Semantic Search Service (Vector)
    ├─→ Hybrid Search Service
    └─→ Faceted Search Service
    ↓
Infrastructure Layer
    ├─→ Elasticsearch (全文検索・ベクトル検索)
    └─→ Redis (検索結果キャッシュ)
```

### 核心実装コンポーネント

#### 1. Hybrid Search Service
```typescript
@Injectable()
export class HybridSearchService {
  constructor(
    @InjectElasticsearchClient()
    private readonly esClient: Client,
    private readonly vectorService: VectorEmbeddingService
  ) {}

  async search(
    input: KnowledgeSearchInput,
    options: HybridSearchOptions
  ): Promise<SearchResults> {

    // 1. クエリベクトル生成
    const queryVector = await this.vectorService.generateEmbedding(input.query);

    // 2. Elasticsearchハイブリッドクエリ構築
    const esQuery = {
      index: 'knowledge_articles',
      body: {
        query: {
          bool: {
            should: [
              // BM25キーワード検索
              {
                multi_match: {
                  query: input.query,
                  fields: ['title^3', 'content', 'summary^2', 'keywords^2'],
                  type: 'best_fields',
                  fuzziness: 'AUTO',
                  boost: options.keywordWeight || 0.5
                }
              },
              // ベクトル類似度検索
              {
                script_score: {
                  query: { match_all: {} },
                  script: {
                    source: "cosineSimilarity(params.queryVector, 'content_vector') + 1.0",
                    params: { queryVector }
                  },
                  boost: options.semanticWeight || 0.5
                }
              }
            ],
            // フィルター適用
            filter: this.buildFilters(input.filters)
          }
        },
        // ハイライト
        highlight: {
          fields: {
            title: { number_of_fragments: 0 },
            content: { fragment_size: 150, number_of_fragments: 3 },
            summary: { number_of_fragments: 0 }
          },
          pre_tags: ['<mark>'],
          post_tags: ['</mark>']
        },
        // ページネーション
        from: (input.page - 1) * input.limit,
        size: input.limit,
        // ソート
        sort: this.buildSort(input.sortBy)
      }
    };

    // 3. Elasticsearch実行
    const response = await this.esClient.search(esQuery);

    // 4. 結果整形
    return this.formatSearchResults(response, input);
  }

  private buildFilters(filters?: SearchFilters): any[] {
    if (!filters) return [];

    const esFilters: any[] = [];

    // カテゴリフィルター
    if (filters.categoryIds?.length > 0) {
      esFilters.push({
        terms: { 'category_id': filters.categoryIds }
      });
    }

    // タグフィルター
    if (filters.tags?.length > 0) {
      if (filters.tagMode === 'all') {
        // AND条件
        filters.tags.forEach(tag => {
          esFilters.push({ term: { 'tags': tag } });
        });
      } else {
        // OR条件（デフォルト）
        esFilters.push({
          terms: { 'tags': filters.tags }
        });
      }
    }

    // 日付範囲フィルター
    if (filters.dateRange) {
      const rangeFilter: any = {
        range: {
          [filters.dateRange.field + '_at']: {}
        }
      };

      if (filters.dateRange.from) {
        rangeFilter.range[filters.dateRange.field + '_at'].gte = filters.dateRange.from;
      }

      if (filters.dateRange.to) {
        rangeFilter.range[filters.dateRange.field + '_at'].lte = filters.dateRange.to;
      }

      esFilters.push(rangeFilter);
    }

    // 評価フィルター
    if (filters.minRating) {
      esFilters.push({
        range: {
          'rating_avg': {
            gte: filters.minRating
          }
        }
      });
    }

    return esFilters;
  }
}
```

#### 2. Faceted Search Service
```typescript
@Injectable()
export class FacetedSearchService {
  async searchWithFacets(
    input: KnowledgeSearchInput,
    facetOptions: FacetOptions
  ): Promise<FacetedSearchResults> {

    const esQuery = {
      index: 'knowledge_articles',
      body: {
        query: this.buildQuery(input),
        // 集約（ファセット）
        aggs: {
          categories: {
            terms: {
              field: 'category_id',
              size: 20
            },
            aggs: {
              category_name: {
                terms: { field: 'category_name.keyword' }
              }
            }
          },
          tags: {
            terms: {
              field: 'tags',
              size: 50
            }
          },
          knowledge_types: {
            terms: {
              field: 'knowledge_type',
              size: 10
            }
          },
          difficulties: {
            terms: {
              field: 'difficulty',
              size: 10
            }
          },
          authors: {
            terms: {
              field: 'author_id',
              size: 20
            },
            aggs: {
              author_name: {
                terms: { field: 'author_name.keyword' }
              }
            }
          }
        },
        from: (input.page - 1) * input.limit,
        size: input.limit
      }
    };

    const response = await this.esClient.search(esQuery);

    return {
      results: this.formatResults(response.hits.hits),
      facets: this.formatFacets(response.aggregations),
      pagination: this.buildPagination(response, input)
    };
  }

  private formatFacets(aggregations: any): Facets {
    return {
      categories: aggregations.categories.buckets.map(b => ({
        categoryId: b.key,
        categoryName: b.category_name.buckets[0]?.key || '',
        count: b.doc_count
      })),
      tags: aggregations.tags.buckets.map(b => ({
        tag: b.key,
        count: b.doc_count
      })),
      knowledgeTypes: aggregations.knowledge_types.buckets.map(b => ({
        type: b.key,
        count: b.doc_count
      })),
      difficulties: aggregations.difficulties.buckets.map(b => ({
        level: b.key,
        count: b.doc_count
      })),
      authors: aggregations.authors.buckets.map(b => ({
        authorId: b.key,
        authorName: b.author_name.buckets[0]?.key || '',
        count: b.doc_count
      }))
    };
  }
}
```

#### 3. Autocomplete Service
```typescript
@Injectable()
export class AutocompleteService {
  async suggest(
    prefix: string,
    options: AutocompleteOptions
  ): Promise<Suggestion[]> {

    const esQuery = {
      index: 'knowledge_articles',
      body: {
        suggest: {
          // タイトルサジェスト
          title_suggestion: {
            prefix,
            completion: {
              field: 'title.completion',
              size: options.maxSuggestions || 5,
              skip_duplicates: true,
              fuzzy: {
                fuzziness: options.fuzziness || 'AUTO'
              }
            }
          },
          // タグサジェスト
          tag_suggestion: {
            prefix,
            completion: {
              field: 'tags.completion',
              size: options.maxSuggestions || 5
            }
          }
        }
      }
    };

    const response = await this.esClient.search(esQuery);

    // サジェスション結合とスコアリング
    const suggestions: Suggestion[] = [];

    // タイトルサジェスト
    response.suggest.title_suggestion[0].options.forEach(opt => {
      suggestions.push({
        text: opt.text,
        score: opt._score,
        type: 'article',
        metadata: { articleId: opt._source.id }
      });
    });

    // タグサジェスト
    response.suggest.tag_suggestion[0].options.forEach(opt => {
      suggestions.push({
        text: opt.text,
        score: opt._score,
        type: 'tag'
      });
    });

    // スコアでソート
    return suggestions.sort((a, b) => b.score - a.score)
                     .slice(0, options.maxSuggestions || 5);
  }
}
```

#### 4. Search Result Caching (Redis)
```typescript
@Injectable()
export class SearchCacheService {
  constructor(
    @InjectRedis() private readonly redis: Redis
  ) {}

  async getCached(cacheKey: string): Promise<SearchResults | null> {
    const cached = await this.redis.get(cacheKey);
    return cached ? JSON.parse(cached) : null;
  }

  async setCached(
    cacheKey: string,
    results: SearchResults,
    ttl: number = 300  // 5分
  ): Promise<void> {
    await this.redis.setex(
      cacheKey,
      ttl,
      JSON.stringify(results)
    );
  }

  private generateCacheKey(input: KnowledgeSearchInput): string {
    return `search:${hashObject(input)}`;
  }
}
```

### Elasticsearchマッピング（検索最適化）

```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "kuromoji",
        "fields": {
          "keyword": { "type": "keyword" },
          "completion": {
            "type": "completion",
            "analyzer": "kuromoji"
          }
        }
      },
      "content": {
        "type": "text",
        "analyzer": "kuromoji",
        "term_vector": "with_positions_offsets"
      },
      "content_vector": {
        "type": "dense_vector",
        "dims": 384,
        "index": true,
        "similarity": "cosine"
      },
      "tags": {
        "type": "keyword",
        "fields": {
          "completion": {
            "type": "completion"
          }
        }
      },
      "category_id": { "type": "keyword" },
      "knowledge_type": { "type": "keyword" },
      "difficulty": { "type": "keyword" },
      "rating_avg": { "type": "float" },
      "view_count": { "type": "integer" },
      "created_at": { "type": "date" },
      "updated_at": { "type": "date" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "kuromoji": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_baseform", "kuromoji_part_of_speech", "ja_stop", "kuromoji_stemmer"]
        }
      }
    },
    "number_of_shards": 3,
    "number_of_replicas": 1
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

```
ERR_BC006_L3002_OP001_XXX
└─┬─┘ └─┬─┘ └─┬──┘ └─┬─┘ └┬┘
  │     │      │      │    └─ 連番
  │     │      │      └────── Operation番号（OP-001）
  │     │      └───────────── L3 Capability番号（L3-002）
  │     └──────────────────── BC番号
  └────────────────────────── プレフィックス
```

### エラーカテゴリ

#### 1. バリデーションエラー (400)
```typescript
// ERR_BC006_L3002_OP001_001: クエリ未指定
{
  code: 'ERR_BC006_L3002_OP001_001',
  message: '検索クエリは必須です。',
  field: 'query',
  constraint: 'required'
}

// ERR_BC006_L3002_OP001_002: ページ番号不正
{
  code: 'ERR_BC006_L3002_OP001_002',
  message: 'ページ番号は1以上の整数である必要があります。',
  field: 'page',
  currentValue: 0,
  minValue: 1
}

// ERR_BC006_L3002_OP001_003: 件数上限超過
{
  code: 'ERR_BC006_L3002_OP001_003',
  message: '1ページあたりの件数は100以下である必要があります。',
  field: 'limit',
  currentValue: 150,
  maxValue: 100
}
```

#### 2. システムエラー (500/503)
```typescript
// ERR_BC006_L3002_OP001_401: Elasticsearch障害
{
  code: 'ERR_BC006_L3002_OP001_401',
  message: '検索サービスが利用できません。',
  statusCode: 503,
  details: {
    service: 'Elasticsearch',
    error: 'Connection timeout',
    recovery: 'しばらく待ってから再試行してください。'
  }
}

// ERR_BC006_L3002_OP001_402: ベクトル生成失敗
{
  code: 'ERR_BC006_L3002_OP001_402',
  message: 'セマンティック検索の処理に失敗しました。',
  statusCode: 503,
  details: {
    service: 'Vector Embedding Service',
    impact: 'キーワード検索のみ実行されました。'
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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/search-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/search-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
