# OP-001: 知識を捕捉する

**作成日**: 2025-10-31
**所属L3**: L3-001-knowledge-capture-and-organization: Knowledge Capture And Organization
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
プロジェクトや業務で得られた知識・ノウハウを捕捉し、記録する。暗黙知の形式知化により、組織の知的資産を構築する。

### 実現する機能
- 知識の記録と入力
- テンプレートベースの知識作成
- 知識のカテゴリ化
- 知識の一時保存と下書き管理

### 入力
- プロジェクト経験・教訓
- ベストプラクティス
- トラブルシューティング事例
- 専門知識

### 出力
- 記録された知識
- 知識記事（下書き）
- 添付ファイル・参考資料
- 知識メタデータ

---

## 📥 入力パラメータ

### 必須パラメータ

#### 知識記事基本情報
```typescript
interface KnowledgeArticleInput {
  // 基本情報
  title: string;                    // タイトル（3-200文字）
  content: string;                  // 本文（Markdown形式、100文字以上）
  summary: string;                  // 要約（10-500文字）

  // 分類情報
  categoryId: UUID;                 // カテゴリID（必須）
  tags: string[];                   // タグリスト（1-10個）
  keywords: string[];               // キーワード（1-20個）

  // メタデータ
  authorId: UUID;                   // 著者ID（ログインユーザー）
  projectId?: UUID;                 // 関連プロジェクトID（任意）
  language: 'ja' | 'en';            // 言語（デフォルト: ja）

  // 知識タイプ
  knowledgeType: KnowledgeType;     // 知識タイプ（必須）
  difficulty: DifficultyLevel;      // 難易度（必須）
  estimatedReadTime?: number;       // 推定読了時間（分）
}

enum KnowledgeType {
  BEST_PRACTICE = 'best_practice',          // ベストプラクティス
  TROUBLESHOOTING = 'troubleshooting',      // トラブルシューティング
  LESSON_LEARNED = 'lesson_learned',        // 教訓
  TECHNICAL_GUIDE = 'technical_guide',      // 技術ガイド
  PROCESS_DOCUMENTATION = 'process_doc',    // プロセス文書
  FAQ = 'faq',                              // よくある質問
  CASE_STUDY = 'case_study'                 // ケーススタディ
}

enum DifficultyLevel {
  BEGINNER = 'beginner',        // 初級（評価: 1-2）
  INTERMEDIATE = 'intermediate', // 中級（評価: 3-4）
  ADVANCED = 'advanced',        // 上級（評価: 5-6）
  EXPERT = 'expert'             // エキスパート（評価: 7-10）
}
```

#### 添付ファイル情報
```typescript
interface AttachmentInput {
  file: File;                       // ファイルオブジェクト
  fileName: string;                 // ファイル名（元の名前）
  fileType: string;                 // MIMEタイプ
  fileSize: number;                 // ファイルサイズ（bytes）
  description?: string;             // ファイル説明（任意）
}

// サポート形式
const SUPPORTED_FILE_TYPES = [
  'application/pdf',                // PDF
  'image/png', 'image/jpeg',        // 画像
  'application/vnd.ms-excel',       // Excel
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',             // Word
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain', 'text/markdown'     // テキスト
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;  // 50MB
const MAX_ATTACHMENTS = 10;               // 最大10ファイル
```

#### 関連情報
```typescript
interface RelatedInfoInput {
  // 関連エンティティ
  relatedArticleIds?: UUID[];       // 関連記事ID（最大20件）
  relatedProjectIds?: UUID[];       // 関連プロジェクトID（最大10件）
  relatedDocumentUrls?: string[];   // 外部文書URL（最大10件）

  // 参照情報
  references?: Reference[];         // 参考文献（最大20件）
  externalLinks?: ExternalLink[];   // 外部リンク（最大10件）
}

interface Reference {
  title: string;                    // 文献タイトル
  authors?: string[];               // 著者（任意）
  url?: string;                     // URL（任意）
  publishedDate?: Date;             // 発行日（任意）
  note?: string;                    // 備考（任意）
}

interface ExternalLink {
  url: string;                      // URL（必須、検証済み）
  title: string;                    // リンクタイトル
  description?: string;             // 説明（任意）
}
```

### 任意パラメータ

#### NLP自動抽出設定
```typescript
interface NLPExtractionOptions {
  // キーワード抽出
  autoExtractKeywords: boolean;     // 自動キーワード抽出（デフォルト: true）
  keywordExtractionMethod: 'tfidf' | 'yake' | 'combined';  // 抽出手法
  maxKeywords: number;              // 最大キーワード数（デフォルト: 20）

  // エンティティ抽出
  extractNamedEntities: boolean;    // 固有表現抽出（デフォルト: true）
  entityTypes: string[];            // 抽出対象エンティティタイプ

  // 要約生成
  autoGenerateSummary: boolean;     // 自動要約生成（デフォルト: false）
  summaryLength: number;            // 要約文字数（デフォルト: 200）

  // 関連記事推薦
  suggestRelatedArticles: boolean;  // 関連記事推薦（デフォルト: true）
  similarityThreshold: number;      // 類似度閾値（デフォルト: 0.7）
}
```

#### ベクトル埋め込み設定
```typescript
interface VectorEmbeddingOptions {
  generateEmbedding: boolean;       // ベクトル生成（デフォルト: true）
  embeddingModel: string;           // モデル名（デフォルト: 'all-MiniLM-L6-v2'）
  embeddingDimension: number;       // 次元数（デフォルト: 384）

  // セマンティック検索
  enableSemanticSearch: boolean;    // セマンティック検索有効化
  indexToElasticsearch: boolean;    // Elasticsearch登録
}
```

### バリデーションルール

#### 入力検証
```typescript
const validationRules = {
  title: {
    minLength: 3,
    maxLength: 200,
    pattern: /^[^\n\r]+$/,          // 改行禁止
    required: true
  },

  content: {
    minLength: 100,
    maxLength: 100000,              // 100KB相当
    format: 'markdown',
    required: true,

    // 内容品質チェック
    checks: {
      hasCodeBlocks: false,         // コードブロックの検証（任意）
      hasImages: false,             // 画像の検証（任意）
      hasLinks: false,              // リンクの検証（任意）
      minParagraphs: 2              // 最低段落数
    }
  },

  summary: {
    minLength: 10,
    maxLength: 500,
    required: true
  },

  tags: {
    minItems: 1,
    maxItems: 10,
    itemPattern: /^[a-zA-Z0-9\-_]{2,30}$/,  // 英数字とハイフン
    required: true
  },

  keywords: {
    minItems: 1,
    maxItems: 20,
    itemMaxLength: 50,
    required: true
  },

  attachments: {
    maxCount: 10,
    maxSizePerFile: 50 * 1024 * 1024,       // 50MB
    totalMaxSize: 200 * 1024 * 1024,        // 200MB
    allowedTypes: SUPPORTED_FILE_TYPES
  }
};
```

#### ビジネスルール検証
```typescript
interface BusinessRuleValidation {
  // カテゴリ検証
  categoryExists: boolean;          // カテゴリ存在確認
  categoryAccessible: boolean;      // カテゴリアクセス権限確認

  // タグ検証
  tagsExist: boolean;               // タグ存在確認（新規作成可能）
  tagsValid: boolean;               // タグ命名規則確認

  // 重複検証
  titleUnique: boolean;             // タイトル重複確認（同一カテゴリ内）
  contentSimilarity: number;        // 内容類似度チェック（閾値: 0.85）

  // プロジェクト連携
  projectAccessible?: boolean;      // プロジェクトアクセス権限
  projectActive?: boolean;          // プロジェクト活性状態
}
```

---

## 📤 出力仕様

### 成功レスポンス

#### 知識記事作成完了
```typescript
interface KnowledgeArticleCreatedResponse {
  // ステータス
  success: true;
  statusCode: 201;
  message: '知識記事が正常に作成されました';

  // 作成された記事
  data: {
    article: {
      // 基本情報
      id: UUID;                           // 記事ID
      title: string;                      // タイトル
      slug: string;                       // URL用スラッグ
      content: string;                    // 本文
      summary: string;                    // 要約

      // 分類
      category: {
        id: UUID;
        name: string;
        path: string;                     // カテゴリパス
      };

      tags: Array<{
        id: UUID;
        name: string;
      }>;

      keywords: string[];

      // メタデータ
      author: {
        id: UUID;
        name: string;
        email: string;
      };

      knowledgeType: KnowledgeType;
      difficulty: DifficultyLevel;
      language: string;
      estimatedReadTime: number;          // 分

      // ステータス
      status: 'draft';                    // 初期状態は下書き
      version: 1;                         // バージョン番号

      // タイムスタンプ
      createdAt: ISO8601DateTime;
      updatedAt: ISO8601DateTime;

      // 添付ファイル
      attachments: Array<{
        id: UUID;
        fileName: string;
        fileType: string;
        fileSize: number;
        url: string;                      // ダウンロードURL
        thumbnailUrl?: string;            // サムネイル（画像の場合）
      }>;

      // 関連情報
      relatedArticles?: Array<{
        id: UUID;
        title: string;
        similarity?: number;              // 類似度スコア
      }>;

      references?: Reference[];
      externalLinks?: ExternalLink[];
    };

    // NLP処理結果
    nlpProcessing?: {
      // 自動抽出キーワード
      extractedKeywords: Array<{
        keyword: string;
        score: number;                    // 重要度スコア
        method: 'tfidf' | 'yake';
      }>;

      // 固有表現抽出
      namedEntities: Array<{
        entity: string;
        type: 'PERSON' | 'ORG' | 'LOCATION' | 'TECHNOLOGY' | 'CONCEPT';
        confidence: number;
      }>;

      // ベクトル埋め込み
      vectorEmbedding?: {
        model: string;
        dimension: number;
        generated: boolean;
      };

      // 推薦関連記事
      recommendedArticles?: Array<{
        id: UUID;
        title: string;
        similarityScore: number;
        reason: string;                   // 推薦理由
      }>;
    };

    // 検索インデックス
    searchIndex: {
      indexed: boolean;                   // Elasticsearch登録済み
      indexName: string;                  // インデックス名
      documentId: string;                 // ドキュメントID
    };
  };

  // 次のアクション
  nextActions: {
    editUrl: string;                      // 編集URL
    previewUrl: string;                   // プレビューURL
    requestReviewUrl: string;             // レビュー依頼URL
    publishUrl?: string;                  // 公開URL（権限がある場合）
  };

  // メタ情報
  meta: {
    processingTime: number;               // 処理時間（ms）
    nlpProcessingTime?: number;           // NLP処理時間（ms）
    indexingTime?: number;                // インデックス登録時間（ms）
  };
}
```

#### 検証結果（検証専用エンドポイント）
```typescript
interface ValidationResponse {
  success: true;
  statusCode: 200;
  message: '入力内容の検証が完了しました';

  data: {
    // 検証結果
    valid: boolean;

    // 警告（処理は可能）
    warnings: Array<{
      field: string;
      code: string;
      message: string;
      suggestion?: string;
    }>;

    // 品質スコア
    qualityScore: {
      overall: number;                    // 総合スコア（0-100）

      breakdown: {
        contentQuality: number;           // 内容品質
        structureQuality: number;         // 構造品質
        metadataCompleteness: number;     // メタデータ完全性
        readability: number;              // 可読性
      };

      recommendations: string[];          // 改善推奨事項
    };

    // 重複チェック
    duplicateCheck: {
      hasDuplicates: boolean;

      similarArticles: Array<{
        id: UUID;
        title: string;
        similarity: number;               // 類似度（0-1）
        reason: string;
      }>;
    };
  };
}
```

### エラーレスポンス構造

```typescript
interface ErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;                         // エラーコード
    message: string;                      // ユーザー向けメッセージ
    details?: any;                        // 詳細情報

    // バリデーションエラー
    validationErrors?: Array<{
      field: string;
      value?: any;
      message: string;
      constraint: string;
    }>;

    // トレース情報（開発環境のみ）
    stack?: string;
    requestId: string;                    // リクエストID
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
    ├─→ Knowledge Capture Service
    ├─→ NLP Processing Service
    ├─→ Vector Embedding Service
    └─→ Search Indexing Service
    ↓
Domain Model Layer
    ├─→ KnowledgeArticle Aggregate
    ├─→ KnowledgeCategory Aggregate
    └─→ Tag Aggregate
    ↓
Infrastructure Layer
    ├─→ PostgreSQL (記事データ)
    ├─→ Elasticsearch (全文検索)
    ├─→ S3/Blob Storage (添付ファイル)
    └─→ Redis (キャッシュ)
```

### 実装コンポーネント

#### 1. API Controller実装
```typescript
// POST /api/knowledge/articles
@Controller('knowledge/articles')
@UseGuards(AuthGuard)
export class KnowledgeArticleController {
  constructor(
    private readonly captureService: KnowledgeCaptureService,
    private readonly nlpService: NLPProcessingService,
    private readonly searchService: SearchIndexingService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachments', {
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: fileTypeFilter
  }))
  async captureKnowledge(
    @Body() input: KnowledgeArticleInput,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: User
  ): Promise<KnowledgeArticleCreatedResponse> {

    // 1. 入力検証
    await this.validateInput(input, files);

    // 2. ドメインモデル構築
    const article = await this.captureService.captureKnowledge(
      input,
      files,
      user.id
    );

    // 3. NLP処理（非同期）
    const nlpResults = await this.nlpService.processArticle(article);

    // 4. ベクトル埋め込み生成（非同期）
    const embedding = await this.nlpService.generateEmbedding(article.content);

    // 5. 検索インデックス登録
    await this.searchService.indexArticle(article, embedding);

    // 6. レスポンス構築
    return this.buildResponse(article, nlpResults);
  }
}
```

#### 2. Knowledge Capture Domain Service
```typescript
@Injectable()
export class KnowledgeCaptureService {
  constructor(
    private readonly articleRepo: KnowledgeArticleRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly tagRepo: TagRepository,
    private readonly storageService: FileStorageService
  ) {}

  async captureKnowledge(
    input: KnowledgeArticleInput,
    files: File[],
    authorId: UUID
  ): Promise<KnowledgeArticle> {

    // カテゴリ検証
    const category = await this.categoryRepo.findById(input.categoryId);
    if (!category) {
      throw new CategoryNotFoundException(input.categoryId);
    }

    // タグ解決（存在しないタグは自動作成）
    const tags = await this.resolveTags(input.tags);

    // 添付ファイル処理
    const attachments = await this.processAttachments(files);

    // Knowledge Article Aggregate 作成
    const article = KnowledgeArticle.create({
      title: input.title,
      content: input.content,
      summary: input.summary,
      category,
      tags,
      keywords: input.keywords,
      authorId,
      knowledgeType: input.knowledgeType,
      difficulty: input.difficulty,
      language: input.language,
      attachments
    });

    // 永続化
    await this.articleRepo.save(article);

    // ドメインイベント発行
    article.addDomainEvent(new KnowledgeArticleCapturedEvent(article));

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
      }

      tags.push(tag);
    }

    return tags;
  }

  private async processAttachments(
    files: File[]
  ): Promise<ArticleAttachment[]> {
    const attachments: ArticleAttachment[] = [];

    for (const file of files) {
      // S3/Blob Storageにアップロード
      const uploadResult = await this.storageService.upload(
        file,
        'knowledge-articles'
      );

      const attachment = ArticleAttachment.create({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storageUrl: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl
      });

      attachments.push(attachment);
    }

    return attachments;
  }
}
```

#### 3. NLP Processing Service
```typescript
@Injectable()
export class NLPProcessingService {
  constructor(
    private readonly natural: NaturalLibrary,      // Node NLP
    private readonly compromise: CompromiseLibrary, // NLP library
    private readonly sentenceTransformer: SentenceTransformerClient
  ) {}

  async processArticle(article: KnowledgeArticle): Promise<NLPResults> {
    const results: NLPResults = {};

    // 1. キーワード抽出（TF-IDF + YAKE）
    results.extractedKeywords = await this.extractKeywords(article.content);

    // 2. 固有表現抽出
    results.namedEntities = await this.extractNamedEntities(article.content);

    // 3. 関連記事推薦
    results.recommendedArticles = await this.recommendRelatedArticles(article);

    return results;
  }

  private async extractKeywords(content: string): Promise<Keyword[]> {
    // TF-IDF抽出
    const tfidfKeywords = this.natural.TfIdf.extract(content, 10);

    // YAKE抽出
    const yakeKeywords = await this.yakeExtract(content, 10);

    // 結果マージとスコアリング
    return this.mergeKeywords(tfidfKeywords, yakeKeywords);
  }

  private async extractNamedEntities(content: string): Promise<Entity[]> {
    const doc = this.compromise(content);

    // 人名
    const people = doc.people().out('array');

    // 組織
    const organizations = doc.organizations().out('array');

    // 場所
    const places = doc.places().out('array');

    // カスタムエンティティ（技術用語など）
    const techTerms = this.extractTechnicalTerms(content);

    return [
      ...people.map(e => ({ entity: e, type: 'PERSON' })),
      ...organizations.map(e => ({ entity: e, type: 'ORG' })),
      ...places.map(e => ({ entity: e, type: 'LOCATION' })),
      ...techTerms.map(e => ({ entity: e, type: 'TECHNOLOGY' }))
    ];
  }

  async generateEmbedding(content: string): Promise<number[]> {
    // Sentence Transformerでベクトル埋め込み生成
    const embedding = await this.sentenceTransformer.encode(content, {
      model: 'all-MiniLM-L6-v2',
      normalize: true
    });

    return embedding;
  }
}
```

#### 4. Search Indexing Service (Elasticsearch)
```typescript
@Injectable()
export class SearchIndexingService {
  constructor(
    @InjectElasticsearchClient()
    private readonly esClient: Client
  ) {}

  async indexArticle(
    article: KnowledgeArticle,
    embedding?: number[]
  ): Promise<void> {

    const document = {
      // 基本情報
      id: article.id,
      title: article.title,
      content: article.content,
      summary: article.summary,

      // 検索用フィールド
      title_keyword: article.title.toLowerCase(),
      content_stemmed: this.stemContent(article.content),

      // ベクトル検索用
      content_vector: embedding,

      // フィルタリング用
      category_id: article.category.id,
      category_path: article.category.path,
      tags: article.tags.map(t => t.name),
      keywords: article.keywords,
      knowledge_type: article.knowledgeType,
      difficulty: article.difficulty,
      language: article.language,

      // メタデータ
      author_id: article.authorId,
      created_at: article.createdAt,
      updated_at: article.updatedAt,
      status: article.status,

      // 統計情報
      view_count: 0,
      rating_avg: 0,
      comment_count: 0
    };

    await this.esClient.index({
      index: 'knowledge_articles',
      id: article.id,
      document,
      refresh: true  // 即座に検索可能に
    });
  }

  private stemContent(content: string): string {
    // 日本語形態素解析 + ステミング
    // 実装: kuromoji.js等を使用
    return content; // 簡略化
  }
}
```

### データベーススキーマ（PostgreSQL）

```sql
-- 知識記事テーブル
CREATE TABLE knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500) NOT NULL,

  -- 分類
  category_id UUID NOT NULL REFERENCES knowledge_categories(id),
  knowledge_type VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  language VARCHAR(5) NOT NULL DEFAULT 'ja',

  -- メタデータ
  author_id UUID NOT NULL REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  estimated_read_time INTEGER,

  -- ステータス
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,

  -- 統計
  view_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,

  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  archived_at TIMESTAMP,

  -- インデックス
  CONSTRAINT check_title_length CHECK (char_length(title) >= 3),
  CONSTRAINT check_content_length CHECK (char_length(content) >= 100),
  CONSTRAINT check_version_positive CHECK (version > 0)
);

-- キーワードテーブル
CREATE TABLE article_keywords (
  article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  keyword VARCHAR(50) NOT NULL,
  score DECIMAL(5,4),
  extraction_method VARCHAR(20),

  PRIMARY KEY (article_id, keyword)
);

-- 添付ファイルテーブル
CREATE TABLE article_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_file_size CHECK (file_size > 0 AND file_size <= 52428800)
);

-- インデックス
CREATE INDEX idx_articles_category ON knowledge_articles(category_id);
CREATE INDEX idx_articles_author ON knowledge_articles(author_id);
CREATE INDEX idx_articles_status ON knowledge_articles(status);
CREATE INDEX idx_articles_created ON knowledge_articles(created_at DESC);
CREATE INDEX idx_keywords_keyword ON article_keywords(keyword);
```

### Elasticsearchマッピング

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": {
        "type": "text",
        "analyzer": "kuromoji",
        "fields": {
          "keyword": { "type": "keyword" },
          "completion": { "type": "completion" }
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
      "summary": {
        "type": "text",
        "analyzer": "kuromoji"
      },
      "category_path": { "type": "keyword" },
      "tags": { "type": "keyword" },
      "keywords": { "type": "keyword" },
      "knowledge_type": { "type": "keyword" },
      "difficulty": { "type": "keyword" },
      "language": { "type": "keyword" },
      "author_id": { "type": "keyword" },
      "status": { "type": "keyword" },
      "created_at": { "type": "date" },
      "view_count": { "type": "integer" },
      "rating_avg": { "type": "float" }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "kuromoji": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer",
          "filter": ["kuromoji_baseform", "ja_stop", "kuromoji_stemmer"]
        }
      }
    }
  }
}
```

### パフォーマンス最適化

#### 1. キャッシュ戦略（Redis）
```typescript
@Injectable()
export class KnowledgeCacheService {
  constructor(
    @InjectRedis() private readonly redis: Redis
  ) {}

  async cacheArticle(article: KnowledgeArticle): Promise<void> {
    const key = `article:${article.id}`;
    const ttl = 3600; // 1時間

    await this.redis.setex(
      key,
      ttl,
      JSON.stringify(article)
    );
  }

  async getCachedArticle(id: UUID): Promise<KnowledgeArticle | null> {
    const key = `article:${id}`;
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }
}
```

#### 2. バッチ処理（非同期）
```typescript
@Processor('knowledge-processing')
export class KnowledgeProcessingConsumer {
  @Process('nlp-processing')
  async processNLP(job: Job<{ articleId: UUID }>) {
    const { articleId } = job.data;

    // 重い処理を非同期実行
    await this.nlpService.processArticle(articleId);
    await this.searchService.indexArticle(articleId);

    return { success: true };
  }
}
```

### セキュリティ実装

#### 1. 入力サニタイゼーション
```typescript
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

export class ContentSanitizer {
  sanitizeMarkdown(content: string): string {
    // Markdownをパース
    const html = marked(content);

    // XSS対策
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre', 'h1', 'h2', 'h3'],
      ALLOWED_ATTR: ['href', 'class']
    });

    return clean;
  }
}
```

#### 2. アクセス制御
```typescript
@Injectable()
export class KnowledgeAccessControl {
  async canCaptureKnowledge(userId: UUID): Promise<boolean> {
    // ロール確認
    const user = await this.userRepo.findById(userId);

    return user.hasRole(['CONSULTANT', 'PM', 'ADMIN']);
  }

  async canAccessCategory(
    userId: UUID,
    categoryId: UUID
  ): Promise<boolean> {
    const category = await this.categoryRepo.findById(categoryId);

    // プライベートカテゴリのアクセス制御
    if (category.isPrivate) {
      return category.authorizedUserIds.includes(userId);
    }

    return true;
  }
}
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### フォーマット
```
ERR_BC006_L3001_OP001_XXX
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
// ERR_BC006_L3001_OP001_001: タイトル不正
{
  code: 'ERR_BC006_L3001_OP001_001',
  message: 'タイトルが不正です。3文字以上200文字以内で入力してください。',
  field: 'title',
  constraint: 'minLength: 3, maxLength: 200',
  currentValue: 'AB'  // 2文字
}

// ERR_BC006_L3001_OP001_002: 本文不正
{
  code: 'ERR_BC006_L3001_OP001_002',
  message: '本文が短すぎます。100文字以上入力してください。',
  field: 'content',
  constraint: 'minLength: 100',
  currentLength: 45
}

// ERR_BC006_L3001_OP001_003: カテゴリ未指定
{
  code: 'ERR_BC006_L3001_OP001_003',
  message: 'カテゴリを選択してください。',
  field: 'categoryId',
  constraint: 'required'
}

// ERR_BC006_L3001_OP001_004: タグ不正
{
  code: 'ERR_BC006_L3001_OP001_004',
  message: 'タグは1個以上10個以内で指定してください。',
  field: 'tags',
  constraint: 'minItems: 1, maxItems: 10',
  currentCount: 0
}

// ERR_BC006_L3001_OP001_005: ファイルサイズ超過
{
  code: 'ERR_BC006_L3001_OP001_005',
  message: '添付ファイルのサイズが上限を超えています。',
  field: 'attachments[2]',
  constraint: 'maxSize: 50MB',
  currentSize: '75MB',
  fileName: 'large-document.pdf'
}

// ERR_BC006_L3001_OP001_006: ファイル形式不正
{
  code: 'ERR_BC006_L3001_OP001_006',
  message: 'サポートされていないファイル形式です。',
  field: 'attachments[0]',
  constraint: 'allowedTypes: PDF, Image, Office',
  currentType: 'application/x-executable',
  fileName: 'program.exe'
}

// ERR_BC006_L3001_OP001_007: キーワード不正
{
  code: 'ERR_BC006_L3001_OP001_007',
  message: 'キーワードが多すぎます。20個以内にしてください。',
  field: 'keywords',
  constraint: 'maxItems: 20',
  currentCount: 25
}
```

#### 2. ビジネスルールエラー (422 Unprocessable Entity)

```typescript
// ERR_BC006_L3001_OP001_101: カテゴリ未存在
{
  code: 'ERR_BC006_L3001_OP001_101',
  message: '指定されたカテゴリが見つかりません。',
  details: {
    categoryId: 'uuid-xxxxx',
    suggestion: '有効なカテゴリを選択してください。'
  }
}

// ERR_BC006_L3001_OP001_102: カテゴリアクセス不可
{
  code: 'ERR_BC006_L3001_OP001_102',
  message: 'このカテゴリへの投稿権限がありません。',
  details: {
    categoryId: 'uuid-xxxxx',
    categoryName: 'Executive Only',
    requiredRole: 'EXECUTIVE'
  }
}

// ERR_BC006_L3001_OP001_103: タイトル重複
{
  code: 'ERR_BC006_L3001_OP001_103',
  message: '同一カテゴリ内に同じタイトルの記事が既に存在します。',
  details: {
    existingArticleId: 'uuid-yyyyy',
    existingArticleTitle: '同じタイトル',
    suggestion: 'タイトルを変更してください。'
  }
}

// ERR_BC006_L3001_OP001_104: 内容類似度高
{
  code: 'ERR_BC006_L3001_OP001_104',
  message: '類似した内容の記事が既に存在します。',
  details: {
    similarArticles: [
      {
        id: 'uuid-zzzzz',
        title: '類似記事タイトル',
        similarity: 0.92  // 92%類似
      }
    ],
    threshold: 0.85,
    suggestion: '既存記事の更新を検討してください。'
  }
}

// ERR_BC006_L3001_OP001_105: プロジェクトアクセス不可
{
  code: 'ERR_BC006_L3001_OP001_105',
  message: '指定されたプロジェクトへのアクセス権限がありません。',
  details: {
    projectId: 'uuid-ppppp',
    projectName: 'Confidential Project'
  }
}

// ERR_BC006_L3001_OP001_106: プロジェクト非活性
{
  code: 'ERR_BC006_L3001_OP001_106',
  message: '指定されたプロジェクトはアーカイブ済みです。',
  details: {
    projectId: 'uuid-ppppp',
    projectStatus: 'archived',
    archivedAt: '2024-10-01T00:00:00Z'
  }
}
```

#### 3. 認証・認可エラー (401/403)

```typescript
// ERR_BC006_L3001_OP001_201: 未認証
{
  code: 'ERR_BC006_L3001_OP001_201',
  message: '認証が必要です。ログインしてください。',
  statusCode: 401
}

// ERR_BC006_L3001_OP001_202: 権限不足
{
  code: 'ERR_BC006_L3001_OP001_202',
  message: '知識記事を作成する権限がありません。',
  statusCode: 403,
  details: {
    requiredRoles: ['CONSULTANT', 'PM', 'ADMIN'],
    currentRole: 'CLIENT'
  }
}

// ERR_BC006_L3001_OP001_203: トークン期限切れ
{
  code: 'ERR_BC006_L3001_OP001_203',
  message: '認証トークンが期限切れです。再ログインしてください。',
  statusCode: 401,
  details: {
    expiredAt: '2024-11-04T10:00:00Z'
  }
}
```

#### 4. リソース不足エラー (429/507)

```typescript
// ERR_BC006_L3001_OP001_301: レート制限超過
{
  code: 'ERR_BC006_L3001_OP001_301',
  message: '記事作成のレート制限を超過しました。',
  statusCode: 429,
  details: {
    limit: 10,                    // 10記事/時間
    current: 10,
    resetAt: '2024-11-04T12:00:00Z',
    retryAfter: 1800              // 1800秒後
  }
}

// ERR_BC006_L3001_OP001_302: ストレージ容量不足
{
  code: 'ERR_BC006_L3001_OP001_302',
  message: 'ストレージ容量が不足しています。',
  statusCode: 507,
  details: {
    totalQuota: '10GB',
    used: '9.8GB',
    available: '200MB',
    requestedSize: '500MB'
  }
}

// ERR_BC006_L3001_OP001_303: 同時実行制限
{
  code: 'ERR_BC006_L3001_OP001_303',
  message: '同時に処理できる記事作成数の上限に達しています。',
  statusCode: 429,
  details: {
    maxConcurrent: 5,
    current: 5,
    suggestion: 'しばらく待ってから再試行してください。'
  }
}
```

#### 5. 外部サービスエラー (502/503)

```typescript
// ERR_BC006_L3001_OP001_401: Elasticsearch障害
{
  code: 'ERR_BC006_L3001_OP001_401',
  message: '検索インデックスへの登録に失敗しました。',
  statusCode: 503,
  details: {
    service: 'Elasticsearch',
    error: 'Connection timeout',
    impact: '記事は保存されましたが、検索には反映されていません。',
    recovery: '自動的に再試行されます。'
  }
}

// ERR_BC006_L3001_OP001_402: NLP処理失敗
{
  code: 'ERR_BC006_L3001_OP001_402',
  message: 'NLP処理に失敗しました。',
  statusCode: 503,
  details: {
    service: 'NLP Service',
    error: 'Model loading failed',
    impact: 'キーワード自動抽出が実行されませんでした。',
    recovery: '手動でキーワードを設定してください。'
  }
}

// ERR_BC006_L3001_OP001_403: ストレージアップロード失敗
{
  code: 'ERR_BC006_L3001_OP001_403',
  message: 'ファイルのアップロードに失敗しました。',
  statusCode: 502,
  details: {
    service: 'S3/Blob Storage',
    fileName: 'attachment.pdf',
    error: 'Network error',
    recovery: 'ファイルを再度アップロードしてください。'
  }
}

// ERR_BC006_L3001_OP001_404: ベクトル埋め込み生成失敗
{
  code: 'ERR_BC006_L3001_OP001_404',
  message: 'ベクトル埋め込みの生成に失敗しました。',
  statusCode: 503,
  details: {
    service: 'Sentence Transformer',
    error: 'Model unavailable',
    impact: 'セマンティック検索は利用できません。',
    recovery: 'キーワード検索は正常に動作します。'
  }
}
```

#### 6. システムエラー (500)

```typescript
// ERR_BC006_L3001_OP001_501: データベースエラー
{
  code: 'ERR_BC006_L3001_OP001_501',
  message: 'データベースエラーが発生しました。',
  statusCode: 500,
  details: {
    error: 'Connection pool exhausted',
    requestId: 'req-xxxxx',
    timestamp: '2024-11-04T11:30:00Z'
  }
}

// ERR_BC006_L3001_OP001_502: トランザクション失敗
{
  code: 'ERR_BC006_L3001_OP001_502',
  message: 'トランザクション処理に失敗しました。',
  statusCode: 500,
  details: {
    error: 'Deadlock detected',
    retryable: true,
    suggestion: '再試行してください。'
  }
}

// ERR_BC006_L3001_OP001_503: 予期しないエラー
{
  code: 'ERR_BC006_L3001_OP001_503',
  message: '予期しないエラーが発生しました。',
  statusCode: 500,
  details: {
    requestId: 'req-yyyyy',
    timestamp: '2024-11-04T11:30:00Z',
    support: 'サポートチームに連絡してください。'
  }
}
```

### エラーハンドリング実装

#### 1. Global Exception Filter
```typescript
@Catch()
export class KnowledgeCaptureExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let errorResponse: ErrorResponse;

    if (exception instanceof ValidationException) {
      errorResponse = this.handleValidationError(exception);
    } else if (exception instanceof BusinessRuleException) {
      errorResponse = this.handleBusinessRuleError(exception);
    } else if (exception instanceof ExternalServiceException) {
      errorResponse = this.handleExternalServiceError(exception);
    } else {
      errorResponse = this.handleUnexpectedError(exception);
    }

    // エラーログ記録
    this.logError(exception, request, errorResponse);

    // クライアントへのレスポンス
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private handleValidationError(
    exception: ValidationException
  ): ErrorResponse {
    return {
      success: false,
      statusCode: 400,
      error: {
        code: exception.code,
        message: exception.message,
        validationErrors: exception.errors,
        requestId: generateRequestId()
      },
      timestamp: new Date().toISOString()
    };
  }
}
```

#### 2. リトライ戦略
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
    // リトライ可能なエラーの判定
    return (
      error.code === 'ERR_BC006_L3001_OP001_401' ||  // Elasticsearch
      error.code === 'ERR_BC006_L3001_OP001_502' ||  // トランザクション
      error.statusCode === 503 ||                     // Service Unavailable
      error.statusCode === 429                        // Rate Limit
    );
  }
}
```

#### 3. Fallback処理
```typescript
@Injectable()
export class KnowledgeCaptureFallbackService {
  async captureWithFallback(
    input: KnowledgeArticleInput
  ): Promise<KnowledgeArticleCreatedResponse> {

    try {
      // メイン処理
      return await this.mainCapture(input);

    } catch (error) {
      if (this.isElasticsearchError(error)) {
        // Elasticsearch障害時: データベースのみ保存
        return await this.captureWithoutSearch(input);

      } else if (this.isNLPError(error)) {
        // NLP障害時: 手動キーワードのみ使用
        return await this.captureWithManualKeywords(input);

      } else if (this.isStorageError(error)) {
        // ストレージ障害時: 添付ファイル除外
        return await this.captureWithoutAttachments(input);

      } else {
        throw error;  // その他のエラーは上位へ
      }
    }
  }

  private async captureWithoutSearch(
    input: KnowledgeArticleInput
  ): Promise<KnowledgeArticleCreatedResponse> {
    // Elasticsearch登録をスキップ
    const article = await this.articleRepo.save(input);

    // 後でバッチ処理で再試行
    await this.queueForReindex(article.id);

    return this.buildResponse(article, {
      searchIndexed: false,
      warning: '検索インデックスへの登録は後で実行されます。'
    });
  }
}
```

### モニタリングとアラート

#### 1. エラーメトリクス収集
```typescript
@Injectable()
export class ErrorMetricsService {
  constructor(
    @InjectMetricsRegistry()
    private readonly metrics: MetricsRegistry
  ) {
    this.registerMetrics();
  }

  private registerMetrics() {
    // エラー発生カウンター
    this.errorCounter = this.metrics.counter({
      name: 'knowledge_capture_errors_total',
      help: 'Total number of knowledge capture errors',
      labelNames: ['error_code', 'error_category', 'severity']
    });

    // エラー処理時間ヒストグラム
    this.errorDuration = this.metrics.histogram({
      name: 'knowledge_capture_error_duration_seconds',
      help: 'Duration of error handling',
      buckets: [0.1, 0.5, 1, 2, 5]
    });
  }

  recordError(error: KnowledgeError) {
    this.errorCounter.inc({
      error_code: error.code,
      error_category: this.categorizeError(error),
      severity: error.severity
    });
  }
}
```

#### 2. アラート定義
```yaml
# Prometheus Alert Rules
groups:
  - name: knowledge_capture_alerts
    rules:
      - alert: HighErrorRate
        expr: |
          rate(knowledge_capture_errors_total[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate in knowledge capture"
          description: "Error rate is {{ $value }} errors/sec"

      - alert: ElasticsearchDown
        expr: |
          sum(knowledge_capture_errors_total{error_code="ERR_BC006_L3001_OP001_401"}) > 5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Elasticsearch is unavailable"
          description: "Multiple failures detected"

      - alert: StorageQuotaLow
        expr: |
          sum(knowledge_capture_errors_total{error_code="ERR_BC006_L3001_OP001_302"}) > 0
        labels:
          severity: warning
        annotations:
          summary: "Storage quota is low"
          description: "Consider increasing storage capacity"
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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/capture-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-001 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
