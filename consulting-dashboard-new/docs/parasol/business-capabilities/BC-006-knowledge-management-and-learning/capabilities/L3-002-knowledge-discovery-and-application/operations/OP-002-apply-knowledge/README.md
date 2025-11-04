# OP-002: 知識を適用する

**作成日**: 2025-10-31
**所属L3**: L3-002-knowledge-discovery-and-application: Knowledge Discovery And Application
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/apply-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
発見した知識を実務に適用し、価値を創出する。知識の実践的活用により、業務品質の向上と問題解決を実現する。

### 実現する機能
- 知識の閲覧と理解
- 知識の実務への適用支援
- 適用結果のフィードバック
- 知識活用の追跡

### 入力
- 発見された知識
- 適用対象の業務・プロジェクト
- ユーザーのコンテキスト
- 適用ガイドライン

### 出力
- 知識の詳細表示
- 適用ガイダンス
- 適用記録
- フィードバックと評価

---

## 📥 入力パラメータ

### 必須パラメータ

#### 推薦リクエスト
```typescript
interface KnowledgeRecommendationInput {
  // ユーザーコンテキスト
  userId: UUID;                         // ユーザーID（必須）

  // 推薦タイプ
  recommendationType: RecommendationType;  // 推薦タイプ

  // 推薦数
  count?: number;                       // 推薦記事数（デフォルト: 10、最大: 50）

  // コンテキスト情報
  context?: UserContext;                // ユーザーコンテキスト

  // フィルター（推薦対象の制限）
  filters?: RecommendationFilters;      // フィルター
}

enum RecommendationType {
  PERSONALIZED = 'personalized',        // パーソナライズド推薦（協調フィルタリング）
  SIMILAR_CONTENT = 'similar_content',  // 類似コンテンツ推薦（コンテンツベース）
  POPULAR = 'popular',                  // 人気記事推薦
  TRENDING = 'trending',                // トレンド推薦
  CONTEXT_AWARE = 'context_aware',      // コンテキスト考慮推薦
  HYBRID = 'hybrid'                     // ハイブリッド推薦（全手法統合）
}
```

#### ユーザーコンテキスト
```typescript
interface UserContext {
  // 現在のアクティビティ
  currentActivity?: {
    projectId?: UUID;                   // 現在のプロジェクト
    taskId?: UUID;                      // 現在のタスク
    problemDomain?: string;             // 問題領域
  };

  // ユーザープロファイル
  userProfile?: {
    role?: string;                      // ロール
    department?: string;                // 部門
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    skills?: string[];                  // スキルタグ
    interests?: string[];               // 興味タグ
  };

  // セッション情報
  session?: {
    recentlyViewedArticles?: UUID[];    // 最近閲覧した記事（最大20件）
    recentSearchQueries?: string[];     // 最近の検索クエリ
    sessionDuration?: number;           // セッション時間（分）
  };

  // デバイス情報
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    preferredContentLength?: 'short' | 'medium' | 'long';
  };
}
```

#### フィルター設定
```typescript
interface RecommendationFilters {
  // 除外設定
  excludeArticleIds?: UUID[];           // 除外記事ID配列
  excludeCategories?: UUID[];           // 除外カテゴリ

  // 対象範囲
  categoryIds?: UUID[];                 // 対象カテゴリID配列
  knowledgeTypes?: KnowledgeType[];     // 対象知識タイプ
  difficultyLevels?: DifficultyLevel[]; // 対象難易度

  // 鮮度制限
  maxAgeInDays?: number;                // 最大経過日数
  minRating?: number;                   // 最低評価
}
```

### 任意パラメータ

#### 推薦アルゴリズムオプション
```typescript
interface RecommendationAlgorithmOptions {
  // 協調フィルタリング設定
  collaborativeFiltering?: {
    method: 'user_based' | 'item_based' | 'matrix_factorization';
    minCommonItems?: number;            // 最小共通アイテム数
    similarityThreshold?: number;       // 類似度閾値（0-1）
  };

  // コンテンツベースフィルタリング設定
  contentBased?: {
    features: string[];                 // 特徴量（tags, keywords, category, etc.）
    similarityMetric: 'cosine' | 'jaccard' | 'euclidean';
    vectorWeights?: Record<string, number>;  // 特徴量の重み
  };

  // ハイブリッド設定
  hybrid?: {
    collaborativeWeight?: number;       // 協調フィルタリング重み（0-1）
    contentBasedWeight?: number;        // コンテンツベース重み（0-1）
    popularityWeight?: number;          // 人気度重み（0-1）
    contextWeight?: number;             // コンテキスト重み（0-1）
  };

  // 多様性設定
  diversification?: {
    enableDiversification: boolean;     // 多様性確保
    diversityScore?: number;            // 多様性スコア目標（0-1）
    maxSimilarItems?: number;           // 類似アイテム最大数
  };
}
```

---

## 📤 出力仕様

### 成功レスポンス

#### 推薦結果レスポンス
```typescript
interface KnowledgeRecommendationResponse {
  success: true;
  statusCode: 200;
  message: '推薦が完了しました';

  data: {
    // 推薦メタ情報
    recommendation: {
      userId: UUID;
      recommendationType: RecommendationType;
      generatedAt: ISO8601DateTime;
      expiresAt: ISO8601DateTime;       // 推薦の有効期限
      totalRecommendations: number;
    };

    // 推薦記事リスト
    recommendations: Array<{
      // 記事情報
      id: UUID;
      title: string;
      summary: string;
      category: {
        id: UUID;
        name: string;
      };
      tags: string[];
      knowledgeType: KnowledgeType;
      difficulty: DifficultyLevel;

      // 著者情報
      author: {
        id: UUID;
        name: string;
      };

      // 統計情報
      viewCount: number;
      rating: number;
      commentCount: number;
      estimatedReadTime: number;        // 分

      // 推薦スコア
      recommendationScore: number;      // 総合推薦スコア（0-100）
      scoreBreakdown: {
        relevanceScore?: number;        // 関連性スコア
        popularityScore?: number;       // 人気度スコア
        freshnessScore?: number;        // 鮮度スコア
        diversityScore?: number;        // 多様性スコア
        contextMatchScore?: number;     // コンテキスト適合度
      };

      // 推薦理由
      reasonForRecommendation: {
        primaryReason: string;          // 主な推薦理由
        factors: Array<{
          factor: string;               // 要因（例: "類似ユーザーが閲覧"）
          weight: number;               // 重み
        }>;
      };

      // 適用ガイダンス
      applicationGuidance?: {
        useCases: string[];             // 活用シーン
        prerequisites?: string[];       // 前提知識
        relatedArticles?: UUID[];       // 関連記事
      };

      // タイムスタンプ
      publishedAt: ISO8601DateTime;
      updatedAt: ISO8601DateTime;
    }>;

    // 推薦品質
    recommendationQuality: {
      confidence: number;               // 推薦信頼度（0-100）
      coverage: number;                 // カバレッジ（0-100）
      diversity: number;                // 多様性（0-100）
      novelty: number;                  // 新規性（0-100）
    };

    // パーソナライゼーション情報
    personalizationInsights?: {
      userPreferences: {
        topCategories: string[];        // 上位カテゴリ
        topTags: string[];              // 上位タグ
        preferredDifficulty: DifficultyLevel;
      };
      behaviorPattern: {
        avgReadTime: number;            // 平均読了時間
        preferredTime: string;          // 好み時間帯
        engagementRate: number;         // エンゲージメント率
      };
    };
  };

  meta: {
    algorithm: string;                  // 使用アルゴリズム
    modelVersion: string;               // モデルバージョン
    computationTime: number;            // 計算時間（ms）
  };
}
```

#### 使用状況追跡レスポンス
```typescript
interface UsageTrackingResponse {
  success: true;
  statusCode: 201;
  message: '使用状況が記録されました';

  data: {
    usageId: UUID;
    articleId: UUID;
    userId: UUID;
    action: UsageAction;
    timestamp: ISO8601DateTime;

    // 効果測定
    effectivenessMetrics?: {
      problemSolved: boolean;           // 問題解決
      timeToSolution?: number;          // 解決までの時間（分）
      satisfactionScore?: number;       // 満足度（1-5）
      appliedSuccessfully: boolean;     // 適用成功
    };
  };
}

enum UsageAction {
  VIEWED = 'viewed',                    // 閲覧
  READ_COMPLETE = 'read_complete',      // 読了
  BOOKMARKED = 'bookmarked',            // ブックマーク
  SHARED = 'shared',                    // 共有
  APPLIED = 'applied',                  // 適用
  RATED = 'rated',                      // 評価
  COMMENTED = 'commented'               // コメント
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
    ├─→ Recommendation Engine Service
    ├─→ Usage Tracking Service
    ├─→ Effectiveness Analysis Service
    └─→ Personalization Service
    ↓
ML/Analytics Layer
    ├─→ Collaborative Filtering (Spark MLlib)
    ├─→ Content-Based Filtering
    ├─→ Matrix Factorization (ALS)
    └─→ Cosine Similarity
    ↓
Data Layer
    ├─→ PostgreSQL (使用履歴)
    ├─→ Redis (リアルタイム推薦キャッシュ)
    └─→ Elasticsearch (コンテンツベクトル)
```

### 核心実装コンポーネント

#### 1. Recommendation Engine Service
```typescript
@Injectable()
export class RecommendationEngineService {
  constructor(
    private readonly collaborativeService: CollaborativeFilteringService,
    private readonly contentBasedService: ContentBasedFilteringService,
    private readonly popularityService: PopularityBasedService,
    private readonly contextService: ContextAwareService,
    private readonly usageTracker: UsageTrackingService
  ) {}

  async generateRecommendations(
    input: KnowledgeRecommendationInput,
    options?: RecommendationAlgorithmOptions
  ): Promise<Recommendation[]> {

    // 1. ユーザー履歴取得
    const userHistory = await this.usageTracker.getUserHistory(input.userId);

    // 2. 推薦タイプに応じた処理
    let recommendations: Recommendation[] = [];

    switch (input.recommendationType) {
      case 'personalized':
        recommendations = await this.collaborativeService.recommend(
          input.userId,
          userHistory,
          input.count
        );
        break;

      case 'similar_content':
        recommendations = await this.contentBasedService.recommend(
          userHistory.recentlyViewed,
          input.count
        );
        break;

      case 'hybrid':
        recommendations = await this.hybridRecommend(
          input,
          userHistory,
          options
        );
        break;
    }

    // 3. フィルター適用
    recommendations = this.applyFilters(recommendations, input.filters);

    // 4. 多様性確保
    if (options?.diversification?.enableDiversification) {
      recommendations = this.diversify(
        recommendations,
        options.diversification
      );
    }

    // 5. スコア正規化とソート
    recommendations = this.normalizeAndSort(recommendations);

    return recommendations.slice(0, input.count || 10);
  }

  private async hybridRecommend(
    input: KnowledgeRecommendationInput,
    userHistory: UserHistory,
    options?: RecommendationAlgorithmOptions
  ): Promise<Recommendation[]> {

    const weights = options?.hybrid || {
      collaborativeWeight: 0.4,
      contentBasedWeight: 0.3,
      popularityWeight: 0.2,
      contextWeight: 0.1
    };

    // 並列推薦生成
    const [collaborative, contentBased, popular, contextual] = await Promise.all([
      this.collaborativeService.recommend(input.userId, userHistory, input.count * 2),
      this.contentBasedService.recommend(userHistory.recentlyViewed, input.count * 2),
      this.popularityService.getPopular(input.count),
      this.contextService.recommend(input.context, input.count)
    ]);

    // スコア統合
    const merged = this.mergeRecommendations([
      { recommendations: collaborative, weight: weights.collaborativeWeight },
      { recommendations: contentBased, weight: weights.contentBasedWeight },
      { recommendations: popular, weight: weights.popularityWeight },
      { recommendations: contextual, weight: weights.contextWeight }
    ]);

    return merged;
  }
}
```

#### 2. Collaborative Filtering Service
```typescript
@Injectable()
export class CollaborativeFilteringService {
  constructor(
    private readonly usageRepo: UsageHistoryRepository,
    private readonly matrixService: MatrixFactorizationService
  ) {}

  async recommend(
    userId: UUID,
    userHistory: UserHistory,
    count: number
  ): Promise<Recommendation[]> {

    // 1. 類似ユーザー検出
    const similarUsers = await this.findSimilarUsers(userId);

    // 2. 類似ユーザーの閲覧記事取得
    const candidateArticles = await this.getCandidateArticles(similarUsers);

    // 3. 予測評価値計算（行列分解）
    const predictions = await this.matrixService.predictRatings(
      userId,
      candidateArticles
    );

    // 4. スコアリングと推薦理由生成
    const recommendations = predictions.map(pred => ({
      articleId: pred.articleId,
      score: pred.predictedRating,
      reason: {
        primaryReason: `${similarUsers.length}人の類似ユーザーが高評価`,
        factors: [
          {
            factor: 'collaborative_filtering',
            weight: 1.0
          }
        ]
      }
    }));

    return recommendations.sort((a, b) => b.score - a.score).slice(0, count);
  }

  private async findSimilarUsers(userId: UUID): Promise<SimilarUser[]> {
    // ユーザー-アイテム行列から類似ユーザーを検索
    // コサイン類似度またはピアソン相関係数を使用

    const userItemMatrix = await this.buildUserItemMatrix();
    const targetVector = userItemMatrix.getRow(userId);

    const similarities: SimilarUser[] = [];

    for (const [otherUserId, otherVector] of userItemMatrix.entries()) {
      if (otherUserId === userId) continue;

      const similarity = this.cosineSimilarity(targetVector, otherVector);

      if (similarity > 0.5) {  // 閾値
        similarities.push({
          userId: otherUserId,
          similarity
        });
      }
    }

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 20);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] ** 2;
      normB += vecB[i] ** 2;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
```

#### 3. Content-Based Filtering Service
```typescript
@Injectable()
export class ContentBasedFilteringService {
  constructor(
    private readonly articleRepo: KnowledgeArticleRepository,
    private readonly vectorService: VectorEmbeddingService
  ) {}

  async recommend(
    recentlyViewedArticles: UUID[],
    count: number
  ): Promise<Recommendation[]> {

    // 1. 最近閲覧した記事の取得
    const viewedArticles = await this.articleRepo.findByIds(recentlyViewedArticles);

    // 2. ユーザープロファイルベクトル構築
    const userProfileVector = this.buildUserProfile(viewedArticles);

    // 3. 全記事とのコサイン類似度計算
    const allArticles = await this.articleRepo.findAll();
    const similarities: Array<{ articleId: UUID; similarity: number }> = [];

    for (const article of allArticles) {
      // 既閲覧記事はスキップ
      if (recentlyViewedArticles.includes(article.id)) continue;

      const articleVector = this.buildArticleVector(article);
      const similarity = this.cosineSimilarity(userProfileVector, articleVector);

      similarities.push({
        articleId: article.id,
        similarity
      });
    }

    // 4. 上位N件を推薦
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, count)
      .map(s => ({
        articleId: s.articleId,
        score: s.similarity * 100,
        reason: {
          primaryReason: '閲覧履歴と類似するコンテンツ',
          factors: [{ factor: 'content_similarity', weight: 1.0 }]
        }
      }));
  }

  private buildUserProfile(articles: KnowledgeArticle[]): number[] {
    // TF-IDF重み付き平均でユーザープロファイル構築
    const tfidf = this.calculateTFIDF(articles);
    const profileVector = this.averageVectors(articles.map(a => a.contentVector), tfidf);
    return profileVector;
  }

  private buildArticleVector(article: KnowledgeArticle): number[] {
    // タグ、キーワード、カテゴリを特徴量としてベクトル化
    const features = [
      ...article.tags,
      ...article.keywords,
      article.category.name,
      article.knowledgeType,
      article.difficulty
    ];

    return this.vectorService.featuresToVector(features);
  }
}
```

#### 4. Usage Tracking Service
```typescript
@Injectable()
export class UsageTrackingService {
  constructor(
    private readonly usageRepo: UsageHistoryRepository,
    private readonly effectivenessRepo: EffectivenessMetricsRepository
  ) {}

  async trackUsage(
    userId: UUID,
    articleId: UUID,
    action: UsageAction,
    metadata?: any
  ): Promise<UsageRecord> {

    const usage = UsageRecord.create({
      userId,
      articleId,
      action,
      timestamp: new Date(),
      metadata
    });

    await this.usageRepo.save(usage);

    // リアルタイム分析更新
    await this.updateRealtimeAnalytics(usage);

    return usage;
  }

  async trackEffectiveness(
    usageId: UUID,
    effectiveness: EffectivenessMetrics
  ): Promise<void> {

    const metrics = EffectivenessRecord.create({
      usageId,
      problemSolved: effectiveness.problemSolved,
      timeToSolution: effectiveness.timeToSolution,
      satisfactionScore: effectiveness.satisfactionScore,
      appliedSuccessfully: effectiveness.appliedSuccessfully,
      feedback: effectiveness.feedback
    });

    await this.effectivenessRepo.save(metrics);

    // 推薦モデル更新（非同期）
    await this.updateRecommendationModel(metrics);
  }

  async getUserHistory(userId: UUID): Promise<UserHistory> {
    const recentUsage = await this.usageRepo.findByUser(userId, {
      limit: 100,
      orderBy: 'timestamp_desc'
    });

    return {
      recentlyViewed: recentUsage
        .filter(u => u.action === 'viewed')
        .map(u => u.articleId)
        .slice(0, 20),
      recentlyApplied: recentUsage
        .filter(u => u.action === 'applied')
        .map(u => u.articleId),
      ratings: recentUsage
        .filter(u => u.action === 'rated')
        .map(u => ({ articleId: u.articleId, rating: u.metadata.rating }))
    };
  }
}
```

### データベーススキーマ

```sql
-- 使用履歴テーブル
CREATE TABLE usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  action VARCHAR(50) NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_action CHECK (action IN ('viewed', 'read_complete', 'bookmarked', 'shared', 'applied', 'rated', 'commented'))
);

-- 効果測定テーブル
CREATE TABLE effectiveness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usage_id UUID NOT NULL REFERENCES usage_history(id),
  problem_solved BOOLEAN NOT NULL,
  time_to_solution INTEGER,
  satisfaction_score INTEGER,
  applied_successfully BOOLEAN,
  feedback TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_satisfaction CHECK (satisfaction_score BETWEEN 1 AND 5)
);

-- 推薦履歴テーブル
CREATE TABLE recommendation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  recommendation_type VARCHAR(50) NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  rank INTEGER NOT NULL,
  algorithm_version VARCHAR(50),
  generated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMP
);

-- インデックス
CREATE INDEX idx_usage_history_user ON usage_history(user_id, timestamp DESC);
CREATE INDEX idx_usage_history_article ON usage_history(article_id, timestamp DESC);
CREATE INDEX idx_effectiveness_usage ON effectiveness_metrics(usage_id);
CREATE INDEX idx_recommendation_history_user ON recommendation_history(user_id, generated_at DESC);
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

```
ERR_BC006_L3002_OP002_XXX
```

### エラーカテゴリ

#### 1. バリデーションエラー (400)
```typescript
// ERR_BC006_L3002_OP002_001: ユーザーID未指定
{
  code: 'ERR_BC006_L3002_OP002_001',
  message: 'ユーザーIDは必須です。',
  field: 'userId'
}

// ERR_BC006_L3002_OP002_002: 推薦数上限超過
{
  code: 'ERR_BC006_L3002_OP002_002',
  message: '推薦数は50以下である必要があります。',
  field: 'count',
  currentValue: 100,
  maxValue: 50
}
```

#### 2. システムエラー (500/503)
```typescript
// ERR_BC006_L3002_OP002_401: 推薦エンジン障害
{
  code: 'ERR_BC006_L3002_OP002_401',
  message: '推薦エンジンが利用できません。',
  statusCode: 503,
  details: {
    service: 'Recommendation Engine',
    recovery: '人気記事を代替表示しています。'
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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/apply-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/apply-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-002 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
