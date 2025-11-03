# BC-006: ドメインサービス詳細 [Domain Services Details]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/domain-language.md

---

## 目次

1. [概要](#overview)
2. [Knowledge Capture Service](#knowledge-capture-service)
3. [Knowledge Discovery Service](#knowledge-discovery-service)
4. [Learning Path Designer](#learning-path-designer)
5. [Knowledge Quality Assessor](#knowledge-quality-assessor)
6. [Domain Events](#domain-events)
7. [統合シナリオ](#integration-scenarios)

---

## 概要 {#overview}

BC-006のドメインサービスは、複数の集約にまたがる複雑なビジネスロジックを実装します。これらのサービスは、ステートレスで、ドメインモデルの整合性を保ちながら高度な機能を提供します。

### ドメインサービスの特徴

- **集約横断処理**: 複数の集約を協調させる
- **ステートレス**: サービス自体は状態を持たない
- **ドメインロジックの集約**: エンティティに属さない純粋なビジネスロジック
- **外部システム連携**: AI/ML、検索エンジンなどとの統合ポイント

### 外部システム依存

```
BC-006 Domain Services
├── 全文検索エンジン (Elasticsearch/OpenSearch)
├── AI/ML推奨エンジン (TensorFlow/PyTorch)
├── 自然言語処理 (NLP) サービス
├── ベクトル検索 (Embeddings)
└── 通知サービス (BC-007経由)
```

---

## Knowledge Capture Service {#knowledge-capture-service}

### 責務

プロジェクトからのナレッジ抽出、品質保証、自動分類を行います。

### インターフェース

```typescript
interface IKnowledgeCaptureService {
  extractFromProject(projectId: ProjectId): Promise<KnowledgeCandidate[]>;
  validateQuality(article: KnowledgeArticle): QualityValidationResult;
  categorizeAutomatically(article: KnowledgeArticle): CategorySuggestion[];
  suggestTags(content: string): TagSuggestion[];
  extractBestPractices(projectId: ProjectId): BestPracticeCandidate[];
}
```

---

### 実装

```typescript
class KnowledgeCaptureService implements IKnowledgeCaptureService {
  constructor(
    private projectRepository: IProjectRepository,
    private knowledgeRepository: IKnowledgeRepository,
    private categoryRepository: ICategoryRepository,
    private nlpService: INLPService,
    private aiRecommendationEngine: IAIRecommendationEngine
  ) {}

  // --- プロジェクトからのナレッジ抽出 ---

  public async extractFromProject(
    projectId: ProjectId
  ): Promise<KnowledgeCandidate[]> {
    // 1. プロジェクト情報取得
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    const candidates: KnowledgeCandidate[] = [];

    // 2. プロジェクトドキュメントから抽出
    const documents = await this.projectRepository.getDocuments(projectId);
    for (const doc of documents) {
      const extracted = await this.extractFromDocument(doc);
      candidates.push(...extracted);
    }

    // 3. プロジェクト成果物から抽出
    const deliverables = await this.projectRepository.getDeliverables(projectId);
    for (const deliverable of deliverables) {
      const extracted = await this.extractFromDeliverable(deliverable);
      candidates.push(...extracted);
    }

    // 4. 議事録・会議記録から抽出
    const meetings = await this.projectRepository.getMeetings(projectId);
    for (const meeting of meetings) {
      const extracted = await this.extractFromMeeting(meeting);
      candidates.push(...extracted);
    }

    // 5. 重複排除と優先順位付け
    return this.deduplicateAndPrioritize(candidates);
  }

  private async extractFromDocument(
    document: ProjectDocument
  ): Promise<KnowledgeCandidate[]> {
    // NLPサービスで重要セクション抽出
    const sections = await this.nlpService.extractKeySection(document.content);

    const candidates: KnowledgeCandidate[] = [];
    for (const section of sections) {
      // 重要度スコア計算
      const importance = this.calculateImportanceScore(section);

      if (importance > 0.6) {
        candidates.push(
          new KnowledgeCandidate(
            section.title,
            section.content,
            KnowledgeType.DOCUMENT,
            importance,
            document.id
          )
        );
      }
    }

    return candidates;
  }

  private async extractFromDeliverable(
    deliverable: Deliverable
  ): Promise<KnowledgeCandidate[]> {
    // 成果物の種類に応じた抽出ロジック
    switch (deliverable.type) {
      case DeliverableType.ARCHITECTURE_DESIGN:
        return this.extractArchitectureKnowledge(deliverable);

      case DeliverableType.CODE_REVIEW:
        return this.extractCodeKnowledge(deliverable);

      case DeliverableType.TEST_REPORT:
        return this.extractTestingKnowledge(deliverable);

      default:
        return [];
    }
  }

  private async extractFromMeeting(
    meeting: Meeting
  ): Promise<KnowledgeCandidate[]> {
    // 議事録から決定事項・学びを抽出
    const decisions = await this.nlpService.extractDecisions(meeting.minutes);
    const learnings = await this.nlpService.extractLearnings(meeting.minutes);

    const candidates: KnowledgeCandidate[] = [];

    for (const decision of decisions) {
      candidates.push(
        new KnowledgeCandidate(
          decision.title,
          decision.content,
          KnowledgeType.DECISION,
          0.8,
          meeting.id
        )
      );
    }

    for (const learning of learnings) {
      candidates.push(
        new KnowledgeCandidate(
          learning.title,
          learning.content,
          KnowledgeType.LESSON_LEARNED,
          0.7,
          meeting.id
        )
      );
    }

    return candidates;
  }

  private calculateImportanceScore(section: DocumentSection): number {
    // 重要度スコアの計算
    let score = 0;

    // キーワードマッチング
    const keywordScore = this.calculateKeywordScore(section.content);
    score += keywordScore * 0.3;

    // セクションの位置（導入・結論は重要）
    const positionScore = this.calculatePositionScore(section.position);
    score += positionScore * 0.2;

    // 長さ（適度な長さが良い）
    const lengthScore = this.calculateLengthScore(section.content.length);
    score += lengthScore * 0.2;

    // 構造化度（図表・リストの有無）
    const structureScore = this.calculateStructureScore(section);
    score += structureScore * 0.3;

    return Math.min(score, 1.0);
  }

  private deduplicateAndPrioritize(
    candidates: KnowledgeCandidate[]
  ): KnowledgeCandidate[] {
    // 1. 類似度計算による重複排除
    const unique: KnowledgeCandidate[] = [];
    for (const candidate of candidates) {
      const isDuplicate = unique.some(
        u => this.calculateSimilarity(u, candidate) > 0.85
      );

      if (!isDuplicate) {
        unique.push(candidate);
      }
    }

    // 2. 重要度スコアでソート
    return unique.sort((a, b) => b.importance - a.importance);
  }

  private calculateSimilarity(
    a: KnowledgeCandidate,
    b: KnowledgeCandidate
  ): number {
    // コサイン類似度計算（NLPサービス経由）
    return this.nlpService.calculateCosineSimilarity(a.content, b.content);
  }

  // --- 品質検証 ---

  public validateQuality(
    article: KnowledgeArticle
  ): QualityValidationResult {
    const issues: QualityIssue[] = [];

    // 1. 必須項目チェック
    if (!article.title || article.title.length < 10) {
      issues.push(
        new QualityIssue(
          'title',
          QualityIssueSeverity.ERROR,
          'タイトルは10文字以上必要です'
        )
      );
    }

    if (!article.content || article.content.length < 100) {
      issues.push(
        new QualityIssue(
          'content',
          QualityIssueSeverity.ERROR,
          '本文は100文字以上必要です'
        )
      );
    }

    if (!article.summary || article.summary.length < 20) {
      issues.push(
        new QualityIssue(
          'summary',
          QualityIssueSeverity.WARNING,
          '要約は20文字以上推奨です'
        )
      );
    }

    // 2. カテゴリ設定チェック
    if (!article.categoryId) {
      issues.push(
        new QualityIssue(
          'category',
          QualityIssueSeverity.ERROR,
          'カテゴリは必須です'
        )
      );
    }

    // 3. タグ設定チェック
    if (article.tags.length === 0) {
      issues.push(
        new QualityIssue(
          'tags',
          QualityIssueSeverity.WARNING,
          'タグを設定すると検索性が向上します'
        )
      );
    }

    // 4. コンテンツ品質チェック
    const contentQuality = this.assessContentQuality(article.content);
    if (contentQuality.score < 0.5) {
      issues.push(
        new QualityIssue(
          'content_quality',
          QualityIssueSeverity.WARNING,
          `コンテンツ品質が低いです: ${contentQuality.reason}`
        )
      );
    }

    // 5. 可読性チェック
    const readability = this.assessReadability(article.content);
    if (readability.score < 0.6) {
      issues.push(
        new QualityIssue(
          'readability',
          QualityIssueSeverity.INFO,
          `可読性を改善できます: ${readability.suggestions.join(', ')}`
        )
      );
    }

    const hasErrors = issues.some(i => i.severity === QualityIssueSeverity.ERROR);

    return new QualityValidationResult(!hasErrors, issues);
  }

  private assessContentQuality(content: string): ContentQualityResult {
    // コンテンツ品質評価
    const metrics = {
      hasHeadings: /^#+\s/m.test(content),
      hasLists: /^[-*]\s/m.test(content),
      hasCodeBlocks: /```/m.test(content),
      hasLinks: /\[.*\]\(.*\)/m.test(content),
      paragraphCount: content.split('\n\n').length,
    };

    let score = 0;
    const reasons: string[] = [];

    if (metrics.hasHeadings) score += 0.2;
    else reasons.push('見出しがありません');

    if (metrics.hasLists) score += 0.2;
    else reasons.push('リストがありません');

    if (metrics.hasCodeBlocks) score += 0.2;

    if (metrics.hasLinks) score += 0.2;

    if (metrics.paragraphCount >= 3) score += 0.2;
    else reasons.push('段落が少なすぎます');

    return {
      score,
      reason: reasons.join(', '),
    };
  }

  private assessReadability(content: string): ReadabilityResult {
    // 可読性評価（日本語）
    const sentences = content.split(/[。！？]/);
    const avgSentenceLength =
      content.length / Math.max(sentences.length, 1);

    const suggestions: string[] = [];
    let score = 1.0;

    // 文の長さチェック
    if (avgSentenceLength > 100) {
      score -= 0.2;
      suggestions.push('文を短くしましょう');
    }

    // 専門用語の説明チェック（簡易版）
    const technicalTerms = this.extractTechnicalTerms(content);
    if (technicalTerms.length > 10) {
      score -= 0.2;
      suggestions.push('専門用語の説明を追加しましょう');
    }

    return { score, suggestions };
  }

  private extractTechnicalTerms(content: string): string[] {
    // 簡易的な専門用語抽出（実際はNLPサービス使用）
    const terms: string[] = [];
    // TODO: implement
    return terms;
  }

  // --- 自動カテゴリ分類 ---

  public async categorizeAutomatically(
    article: KnowledgeArticle
  ): Promise<CategorySuggestion[]> {
    // 1. 全カテゴリ取得
    const categories = await this.categoryRepository.findAll();

    // 2. AI推奨エンジンでカテゴリマッチング
    const suggestions = await this.aiRecommendationEngine.suggestCategories(
      article.title,
      article.content,
      categories
    );

    // 3. スコアでソートして上位5件
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  // --- タグ提案 ---

  public async suggestTags(content: string): Promise<TagSuggestion[]> {
    // 1. NLPでキーワード抽出
    const keywords = await this.nlpService.extractKeywords(content);

    // 2. 既存タグとのマッチング
    const existingTags = await this.knowledgeRepository.getAllTags();
    const suggestions: TagSuggestion[] = [];

    for (const keyword of keywords) {
      // 完全一致
      const exactMatch = existingTags.find(t => t.name === keyword.text);
      if (exactMatch) {
        suggestions.push(
          new TagSuggestion(exactMatch.name, keyword.score, true)
        );
        continue;
      }

      // 部分一致
      const partialMatch = existingTags.find(t =>
        t.name.includes(keyword.text) || keyword.text.includes(t.name)
      );
      if (partialMatch) {
        suggestions.push(
          new TagSuggestion(partialMatch.name, keyword.score * 0.8, true)
        );
      } else {
        // 新規タグ提案
        suggestions.push(
          new TagSuggestion(keyword.text, keyword.score, false)
        );
      }
    }

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  // --- ベストプラクティス抽出 ---

  public async extractBestPractices(
    projectId: ProjectId
  ): Promise<BestPracticeCandidate[]> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    // プロジェクトが成功している必要がある
    if (project.status !== ProjectStatus.COMPLETED_SUCCESS) {
      return [];
    }

    const candidates: BestPracticeCandidate[] = [];

    // 1. 成功要因分析
    const successFactors = await this.analyzeSuccessFactors(project);
    for (const factor of successFactors) {
      if (factor.impact > 0.7) {
        candidates.push(
          new BestPracticeCandidate(
            factor.title,
            factor.description,
            factor.evidence,
            factor.impact
          )
        );
      }
    }

    // 2. 効果的な手法の特定
    const effectivePractices = await this.identifyEffectivePractices(project);
    candidates.push(...effectivePractices);

    return candidates;
  }

  private async analyzeSuccessFactors(
    project: Project
  ): Promise<SuccessFactor[]> {
    // TODO: implement success factor analysis
    return [];
  }

  private async identifyEffectivePractices(
    project: Project
  ): Promise<BestPracticeCandidate[]> {
    // TODO: implement effective practice identification
    return [];
  }

  // --- ヘルパーメソッド ---

  private calculateKeywordScore(content: string): number {
    // TODO: implement keyword scoring
    return 0.5;
  }

  private calculatePositionScore(position: number): number {
    // 最初と最後のセクションは重要
    if (position <= 1 || position >= 0.9) {
      return 1.0;
    }
    return 0.5;
  }

  private calculateLengthScore(length: number): number {
    // 適度な長さ: 200-2000文字
    if (length >= 200 && length <= 2000) {
      return 1.0;
    } else if (length < 200) {
      return length / 200;
    } else {
      return Math.max(0, 1.0 - (length - 2000) / 5000);
    }
  }

  private calculateStructureScore(section: DocumentSection): number {
    let score = 0;
    if (section.hasImages) score += 0.3;
    if (section.hasLists) score += 0.3;
    if (section.hasTables) score += 0.2;
    if (section.hasCodeBlocks) score += 0.2;
    return score;
  }
}
```

---

## Knowledge Discovery Service {#knowledge-discovery-service}

### 責務

ナレッジの検索、推奨、関連性分析を行います。

### インターフェース

```typescript
interface IKnowledgeDiscoveryService {
  searchKnowledge(query: SearchQuery): Promise<SearchResult>;
  recommendKnowledge(userId: UserId, context: RecommendationContext): Promise<KnowledgeRecommendation[]>;
  findRelatedKnowledge(articleId: ArticleId): Promise<RelatedKnowledge[]>;
  analyzeKnowledgeGaps(skillProfile: SkillProfile): Promise<KnowledgeGap[]>;
  trackKnowledgeUsage(userId: UserId, articleId: ArticleId, context: UsageContext): Promise<void>;
}
```

---

### 実装

```typescript
class KnowledgeDiscoveryService implements IKnowledgeDiscoveryService {
  constructor(
    private knowledgeRepository: IKnowledgeRepository,
    private searchEngine: ISearchEngine,
    private recommendationEngine: IAIRecommendationEngine,
    private userRepository: IUserRepository,
    private usageTracker: IUsageTracker
  ) {}

  // --- ナレッジ検索 ---

  public async searchKnowledge(query: SearchQuery): Promise<SearchResult> {
    // 1. 全文検索
    const textResults = await this.searchEngine.fullTextSearch(
      query.text,
      query.filters
    );

    // 2. タグ検索
    const tagResults = query.tags
      ? await this.knowledgeRepository.findByTags(query.tags)
      : [];

    // 3. カテゴリフィルタ
    let results = this.mergeResults(textResults, tagResults);
    if (query.categoryId) {
      results = results.filter(r => r.categoryId === query.categoryId);
    }

    // 4. ランキング調整
    results = this.rankResults(results, query);

    // 5. ページング
    const total = results.length;
    const paged = results.slice(
      query.offset,
      query.offset + query.limit
    );

    return new SearchResult(paged, total, query);
  }

  private mergeResults(
    textResults: KnowledgeArticle[],
    tagResults: KnowledgeArticle[]
  ): KnowledgeArticle[] {
    const merged = new Map<string, KnowledgeArticle>();

    for (const article of textResults) {
      merged.set(article.id.value, article);
    }

    for (const article of tagResults) {
      merged.set(article.id.value, article);
    }

    return Array.from(merged.values());
  }

  private rankResults(
    results: KnowledgeArticle[],
    query: SearchQuery
  ): KnowledgeArticle[] {
    return results.sort((a, b) => {
      // ランキングスコア計算
      const scoreA = this.calculateRankingScore(a, query);
      const scoreB = this.calculateRankingScore(b, query);
      return scoreB - scoreA;
    });
  }

  private calculateRankingScore(
    article: KnowledgeArticle,
    query: SearchQuery
  ): number {
    let score = 0;

    // テキストマッチスコア (40%)
    score += this.calculateTextMatchScore(article, query.text) * 0.4;

    // 品質スコア (20%)
    score += article.qualityScore.overall * 0.04; // 5点満点を0-1に正規化

    // 人気度 (20%)
    score += this.calculatePopularityScore(article) * 0.2;

    // 鮮度 (20%)
    score += this.calculateFreshnessScore(article) * 0.2;

    return score;
  }

  private calculateTextMatchScore(article: KnowledgeArticle, text: string): number {
    // TODO: implement text matching score
    return 0.5;
  }

  private calculatePopularityScore(article: KnowledgeArticle): number {
    // 閲覧数といいね数から計算
    const viewScore = Math.min(article.viewCount / 1000, 1.0);
    const likeScore = Math.min(article.likeCount / 100, 1.0);
    return (viewScore * 0.6 + likeScore * 0.4);
  }

  private calculateFreshnessScore(article: KnowledgeArticle): number {
    // 公開日からの経過日数
    const daysSincePublish = this.daysSince(article.publishedAt);

    // 30日以内: 1.0, 365日以降: 0.2
    if (daysSincePublish <= 30) return 1.0;
    if (daysSincePublish >= 365) return 0.2;

    return 1.0 - (daysSincePublish - 30) / (365 - 30) * 0.8;
  }

  private daysSince(date: Date): number {
    return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  }

  // --- パーソナライズド推奨 ---

  public async recommendKnowledge(
    userId: UserId,
    context: RecommendationContext
  ): Promise<KnowledgeRecommendation[]> {
    // 1. ユーザープロファイル取得
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // 2. スキルプロファイル取得
    const skillProfile = await this.userRepository.getSkillProfile(userId);

    // 3. 閲覧履歴取得
    const viewHistory = await this.usageTracker.getViewHistory(userId);

    // 4. AI推奨エンジンで候補生成
    const candidates = await this.recommendationEngine.generateRecommendations(
      skillProfile,
      viewHistory,
      context
    );

    // 5. コンテキストフィルタリング
    const filtered = this.filterByContext(candidates, context);

    // 6. 多様性確保
    const diversified = this.ensureDiversity(filtered);

    return diversified.slice(0, 10);
  }

  private filterByContext(
    candidates: KnowledgeRecommendation[],
    context: RecommendationContext
  ): KnowledgeRecommendation[] {
    if (context.currentProjectId) {
      // プロジェクトコンテキストに関連するナレッジを優先
      return candidates.filter(c =>
        c.relevanceToProject(context.currentProjectId) > 0.5
      );
    }

    if (context.currentTask) {
      // タスクコンテキストに関連するナレッジを優先
      return candidates.filter(c =>
        c.relevanceToTask(context.currentTask) > 0.5
      );
    }

    return candidates;
  }

  private ensureDiversity(
    recommendations: KnowledgeRecommendation[]
  ): KnowledgeRecommendation[] {
    // カテゴリの多様性を確保
    const diverse: KnowledgeRecommendation[] = [];
    const categoryCount = new Map<string, number>();

    for (const rec of recommendations) {
      const count = categoryCount.get(rec.categoryId) || 0;

      // 同じカテゴリから3件まで
      if (count < 3) {
        diverse.push(rec);
        categoryCount.set(rec.categoryId, count + 1);
      }
    }

    return diverse;
  }

  // --- 関連ナレッジ検索 ---

  public async findRelatedKnowledge(
    articleId: ArticleId
  ): Promise<RelatedKnowledge[]> {
    const article = await this.knowledgeRepository.findById(articleId);
    if (!article) {
      throw new ArticleNotFoundError(articleId);
    }

    const related: RelatedKnowledge[] = [];

    // 1. 同じカテゴリの記事
    const sameCategory = await this.knowledgeRepository.findByCategory(
      article.categoryId,
      { limit: 5 }
    );
    for (const item of sameCategory) {
      if (!item.id.equals(articleId)) {
        related.push(
          new RelatedKnowledge(
            item,
            RelationType.SAME_CATEGORY,
            0.6
          )
        );
      }
    }

    // 2. 類似タグの記事
    const similarTags = await this.knowledgeRepository.findBySimilarTags(
      article.tags,
      { limit: 5 }
    );
    for (const item of similarTags) {
      if (!item.id.equals(articleId)) {
        related.push(
          new RelatedKnowledge(
            item,
            RelationType.SIMILAR_TAGS,
            0.7
          )
        );
      }
    }

    // 3. 内容の類似記事（ベクトル検索）
    const semanticSimilar = await this.searchEngine.findSimilarByEmbedding(
      article.content,
      { limit: 5 }
    );
    for (const item of semanticSimilar) {
      if (!item.id.equals(articleId)) {
        related.push(
          new RelatedKnowledge(
            item,
            RelationType.CONTENT_SIMILAR,
            0.8
          )
        );
      }
    }

    // 4. 重複排除してスコアでソート
    return this.deduplicateRelated(related)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  private deduplicateRelated(
    related: RelatedKnowledge[]
  ): RelatedKnowledge[] {
    const seen = new Map<string, RelatedKnowledge>();

    for (const item of related) {
      const id = item.article.id.value;
      const existing = seen.get(id);

      if (!existing || item.relevanceScore > existing.relevanceScore) {
        seen.set(id, item);
      }
    }

    return Array.from(seen.values());
  }

  // --- ナレッジギャップ分析 ---

  public async analyzeKnowledgeGaps(
    skillProfile: SkillProfile
  ): Promise<KnowledgeGap[]> {
    const gaps: KnowledgeGap[] = [];

    // 1. 各スキルの現在レベルと目標レベルを比較
    for (const skill of skillProfile.skills) {
      if (skill.currentLevel < skill.targetLevel) {
        const gap = new KnowledgeGap(
          skill.id,
          skill.currentLevel,
          skill.targetLevel,
          skill.targetLevel - skill.currentLevel
        );

        // 2. ギャップを埋めるナレッジを検索
        const knowledge = await this.findKnowledgeForSkillGap(gap);
        gap.recommendedKnowledge = knowledge;

        gaps.push(gap);
      }
    }

    // 3. ギャップの大きい順にソート
    return gaps.sort((a, b) => b.gapSize - a.gapSize);
  }

  private async findKnowledgeForSkillGap(
    gap: KnowledgeGap
  ): Promise<KnowledgeArticle[]> {
    // スキルレベルに応じたナレッジを検索
    const query = new SearchQuery(
      gap.skillId.name,
      {
        skillLevel: gap.targetLevel,
        minQualityScore: 3.5,
      }
    );

    const result = await this.searchKnowledge(query);
    return result.items.slice(0, 5);
  }

  // --- 使用状況追跡 ---

  public async trackKnowledgeUsage(
    userId: UserId,
    articleId: ArticleId,
    context: UsageContext
  ): Promise<void> {
    await this.usageTracker.track({
      userId,
      articleId,
      action: UsageAction.VIEW,
      context,
      timestamp: new Date(),
    });

    // ドメインイベント発行
    const event = new KnowledgeViewedEvent(userId, articleId, context);
    // TODO: emit event
  }
}
```

---

## Learning Path Designer {#learning-path-designer}

### 責務

個人のスキルギャップに基づく最適な学習経路の設計を行います。

### インターフェース

```typescript
interface ILearningPathDesigner {
  designLearningPath(userId: UserId, targetSkills: SkillId[]): Promise<LearningPath>;
  recommendNextCourse(userId: UserId): Promise<CourseRecommendation>;
  adjustPathBasedOnProgress(userId: UserId, progressId: ProgressId): Promise<LearningPath>;
  estimateCompletionTime(pathId: PathId): Promise<Duration>;
}
```

---

### 実装

```typescript
class LearningPathDesigner implements ILearningPathDesigner {
  constructor(
    private userRepository: IUserRepository,
    private courseRepository: ICourseRepository,
    private progressRepository: IProgressRepository,
    private skillRepository: ISkillRepository,
    private aiEngine: IAIRecommendationEngine
  ) {}

  // --- 学習経路設計 ---

  public async designLearningPath(
    userId: UserId,
    targetSkills: SkillId[]
  ): Promise<LearningPath> {
    // 1. 現在のスキルプロファイル取得
    const currentSkills = await this.userRepository.getSkillProfile(userId);

    // 2. 目標スキルレベル設定
    const targetSkillLevels = await this.defineTargetLevels(
      targetSkills,
      currentSkills
    );

    // 3. スキルギャップ分析
    const gaps = this.analyzeSkillGaps(currentSkills, targetSkillLevels);

    // 4. 学習経路生成
    const path = new LearningPath(
      userId,
      targetSkills,
      currentSkills,
      targetSkillLevels
    );

    // 5. コース推奨
    for (const gap of gaps) {
      const courses = await this.findCoursesForSkillGap(gap);
      for (const course of courses) {
        path.addCourseRecommendation(
          course.id,
          this.calculateCoursePriority(course, gap),
          `Skill gap: ${gap.skillId.name}`
        );
      }
    }

    // 6. 前提条件の考慮
    await this.adjustForPrerequisites(path);

    // 7. 学習経路最適化
    await this.optimizePath(path);

    return path;
  }

  private async defineTargetLevels(
    targetSkills: SkillId[],
    currentSkills: SkillProfile
  ): Promise<SkillProfile> {
    const targetLevels = new SkillProfile();

    for (const skillId of targetSkills) {
      const current = currentSkills.getLevel(skillId) || SkillLevel.BEGINNER;

      // デフォルト: 現在レベル + 1
      const target = this.incrementSkillLevel(current);

      targetLevels.setSkill(skillId, target);
    }

    return targetLevels;
  }

  private incrementSkillLevel(level: SkillLevel): SkillLevel {
    const levels = [
      SkillLevel.BEGINNER,
      SkillLevel.INTERMEDIATE,
      SkillLevel.ADVANCED,
      SkillLevel.EXPERT,
    ];

    const currentIndex = levels.indexOf(level);
    return levels[Math.min(currentIndex + 1, levels.length - 1)];
  }

  private analyzeSkillGaps(
    current: SkillProfile,
    target: SkillProfile
  ): SkillGap[] {
    const gaps: SkillGap[] = [];

    for (const [skillId, targetLevel] of target.skills) {
      const currentLevel = current.getLevel(skillId) || SkillLevel.BEGINNER;

      if (this.levelValue(currentLevel) < this.levelValue(targetLevel)) {
        gaps.push(
          new SkillGap(skillId, currentLevel, targetLevel)
        );
      }
    }

    // ギャップサイズでソート
    return gaps.sort((a, b) =>
      this.gapSize(b) - this.gapSize(a)
    );
  }

  private levelValue(level: SkillLevel): number {
    const values = {
      [SkillLevel.BEGINNER]: 1,
      [SkillLevel.INTERMEDIATE]: 2,
      [SkillLevel.ADVANCED]: 3,
      [SkillLevel.EXPERT]: 4,
    };
    return values[level];
  }

  private gapSize(gap: SkillGap): number {
    return this.levelValue(gap.targetLevel) - this.levelValue(gap.currentLevel);
  }

  private async findCoursesForSkillGap(gap: SkillGap): Promise<LearningCourse[]> {
    // スキルギャップに適したコース検索
    return await this.courseRepository.findBySkillAndLevel(
      gap.skillId,
      gap.targetLevel
    );
  }

  private calculateCoursePriority(
    course: LearningCourse,
    gap: SkillGap
  ): number {
    let priority = 0;

    // スキルレベルマッチ (40%)
    if (course.level === gap.targetLevel) {
      priority += 40;
    } else if (this.levelValue(course.level) === this.levelValue(gap.targetLevel) - 1) {
      priority += 30;
    }

    // コース品質 (30%)
    priority += course.averageRating * 6; // 5点満点 → 30点

    // 人気度 (20%)
    priority += Math.min(course.enrollmentCount / 100, 20);

    // 完了率 (10%)
    priority += course.completionRate / 10;

    return priority;
  }

  private async adjustForPrerequisites(path: LearningPath): Promise<void> {
    const recommendations = path.recommendedCourses;

    for (const rec of recommendations) {
      const course = await this.courseRepository.findById(rec.courseId);
      if (!course) continue;

      // 前提条件コースを経路に追加
      for (const prereqId of course.prerequisites) {
        const hasPrereq = recommendations.some(r => r.courseId.equals(prereqId));
        if (!hasPrereq) {
          path.addCourseRecommendation(
            prereqId,
            rec.priority + 10, // より高い優先度
            `Prerequisite for ${course.title}`
          );
        }
      }
    }
  }

  private async optimizePath(path: LearningPath): Promise<void> {
    // トポロジカルソートで前提条件を考慮した順序に並べ替え
    const sorted = await this.topologicalSort(path.recommendedCourses);
    path.recommendedCourses = sorted;
  }

  private async topologicalSort(
    recommendations: CourseRecommendation[]
  ): Promise<CourseRecommendation[]> {
    // TODO: implement topological sort considering prerequisites
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // --- 次コース推奨 ---

  public async recommendNextCourse(
    userId: UserId
  ): Promise<CourseRecommendation> {
    // 1. 学習経路取得
    const paths = await this.progressRepository.getLearningPaths(userId);

    if (paths.length === 0) {
      // 経路がない場合、スキルプロファイルから生成
      const skillProfile = await this.userRepository.getSkillProfile(userId);
      const targetSkills = skillProfile.getTopSkillGaps(3);
      const path = await this.designLearningPath(userId, targetSkills);
      paths.push(path);
    }

    // 2. 最優先経路の次コースを取得
    const primaryPath = paths[0];
    const nextCourseId = primaryPath.getNextRecommendedCourse();

    if (!nextCourseId) {
      throw new NoRecommendedCourseError(userId);
    }

    const course = await this.courseRepository.findById(nextCourseId);
    if (!course) {
      throw new CourseNotFoundError(nextCourseId);
    }

    return new CourseRecommendation(
      course,
      'Next in your learning path',
      0.9
    );
  }

  // --- 進捗に基づく経路調整 ---

  public async adjustPathBasedOnProgress(
    userId: UserId,
    progressId: ProgressId
  ): Promise<LearningPath> {
    // 1. 進捗情報取得
    const progress = await this.progressRepository.findById(progressId);
    if (!progress) {
      throw new ProgressNotFoundError(progressId);
    }

    // 2. 学習経路取得
    const paths = await this.progressRepository.getLearningPaths(userId);
    const path = paths.find(p => p.recommendedCourses.some(c =>
      c.courseId.equals(progress.courseId)
    ));

    if (!path) {
      throw new LearningPathNotFoundError(userId);
    }

    // 3. 完了したコースをマーク
    if (progress.status === ProgressStatus.COMPLETED) {
      path.markCourseCompleted(progress.courseId);
    }

    // 4. 評価結果に基づく調整
    if (progress.totalScore < 70) {
      // スコアが低い場合、補強コースを追加
      await this.addReinforcementCourses(path, progress.courseId);
    }

    // 5. スキルプロファイル更新
    await this.updateSkillProfile(userId, progress);

    return path;
  }

  private async addReinforcementCourses(
    path: LearningPath,
    courseId: CourseId
  ): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) return;

    // 同じカテゴリの基礎コースを探す
    const reinforcement = await this.courseRepository.findByCategory(
      course.category,
      { level: SkillLevel.BEGINNER }
    );

    for (const rec of reinforcement) {
      path.addCourseRecommendation(
        rec.id,
        50, // 中程度の優先度
        'Reinforcement course'
      );
    }
  }

  private async updateSkillProfile(
    userId: UserId,
    progress: LearningProgress
  ): Promise<void> {
    // コース完了でスキルレベル更新
    if (progress.status === ProgressStatus.COMPLETED) {
      const course = await this.courseRepository.findById(progress.courseId);
      if (course) {
        await this.userRepository.incrementSkillLevel(
          userId,
          course.category.skillId
        );
      }
    }
  }

  // --- 完了時間見積もり ---

  public async estimateCompletionTime(pathId: PathId): Promise<Duration> {
    const path = await this.progressRepository.findLearningPathById(pathId);
    if (!path) {
      throw new LearningPathNotFoundError(pathId);
    }

    let totalMinutes = 0;

    for (const rec of path.recommendedCourses) {
      const course = await this.courseRepository.findById(rec.courseId);
      if (course) {
        totalMinutes += course.estimatedDuration.minutes;
      }
    }

    // 余裕を見て1.2倍
    return Duration.fromMinutes(Math.ceil(totalMinutes * 1.2));
  }
}
```

---

## Knowledge Quality Assessor {#knowledge-quality-assessor}

### 責務

ナレッジの品質評価、スコア計算、改善提案を行います。

### インターフェース

```typescript
interface IKnowledgeQualityAssessor {
  assessQuality(article: KnowledgeArticle): QualityAssessment;
  calculateQualityScore(reviews: ArticleReview[], usage: UsageMetrics): QualityScore;
  suggestImprovements(article: KnowledgeArticle): Improvement[];
  compareQuality(articleId1: ArticleId, articleId2: ArticleId): QualityComparison;
}
```

---

### 実装

```typescript
class KnowledgeQualityAssessor implements IKnowledgeQualityAssessor {
  constructor(
    private knowledgeRepository: IKnowledgeRepository,
    private reviewRepository: IReviewRepository,
    private usageTracker: IUsageTracker
  ) {}

  // --- 品質評価 ---

  public assessQuality(article: KnowledgeArticle): QualityAssessment {
    const dimensions: QualityDimension[] = [];

    // 1. 正確性評価
    dimensions.push(this.assessAccuracy(article));

    // 2. 完全性評価
    dimensions.push(this.assessCompleteness(article));

    // 3. 有用性評価
    dimensions.push(this.assessUsefulness(article));

    // 4. 明確性評価
    dimensions.push(this.assessClarity(article));

    // 5. 総合スコア計算
    const overall = this.calculateOverallScore(dimensions);

    return new QualityAssessment(dimensions, overall);
  }

  private assessAccuracy(article: KnowledgeArticle): QualityDimension {
    let score = 5.0;
    const issues: string[] = [];

    // レビュワーの正確性評価
    const reviews = article.reviews.filter(r => r.isApproved());
    if (reviews.length > 0) {
      const avgAccuracy = reviews.reduce((sum, r) => sum + r.accuracyRating, 0) / reviews.length;
      score = avgAccuracy;
    } else {
      score = 3.0; // デフォルト
      issues.push('レビューがありません');
    }

    // 最終更新からの経過時間
    const daysSinceUpdate = this.daysSince(article.metadata.updatedAt);
    if (daysSinceUpdate > 365) {
      score -= 1.0;
      issues.push('1年以上更新されていません');
    } else if (daysSinceUpdate > 180) {
      score -= 0.5;
      issues.push('6ヶ月以上更新されていません');
    }

    return new QualityDimension('accuracy', Math.max(score, 0), issues);
  }

  private assessCompleteness(article: KnowledgeArticle): QualityDimension {
    let score = 5.0;
    const issues: string[] = [];

    // 必須セクションチェック
    const content = article.content;

    if (!this.hasIntroduction(content)) {
      score -= 1.0;
      issues.push('導入セクションがありません');
    }

    if (!this.hasExamples(content)) {
      score -= 0.5;
      issues.push('具体例がありません');
    }

    if (!this.hasConclusion(content)) {
      score -= 0.5;
      issues.push('まとめセクションがありません');
    }

    // 添付ファイル
    if (article.attachments.length === 0) {
      score -= 0.5;
      issues.push('補足資料がありません');
    }

    // 最低文字数
    if (content.length < 500) {
      score -= 1.0;
      issues.push('内容が不足しています');
    }

    return new QualityDimension('completeness', Math.max(score, 0), issues);
  }

  private assessUsefulness(article: KnowledgeArticle): QualityDimension {
    let score = 3.0; // デフォルト
    const issues: string[] = [];

    // 閲覧数
    if (article.viewCount > 100) {
      score += 1.0;
    } else if (article.viewCount < 10) {
      issues.push('閲覧数が少ないです');
    }

    // いいね数
    if (article.likeCount > 20) {
      score += 1.0;
    } else if (article.likeCount < 5) {
      issues.push('評価が少ないです');
    }

    // いいね率
    const likeRate = article.viewCount > 0 ? article.likeCount / article.viewCount : 0;
    if (likeRate > 0.2) {
      score += 0.5;
    }

    return new QualityDimension('usefulness', Math.min(score, 5.0), issues);
  }

  private assessClarity(article: KnowledgeArticle): QualityDimension {
    let score = 5.0;
    const issues: string[] = [];

    const content = article.content;

    // 見出し構造
    if (!this.hasProperHeadings(content)) {
      score -= 1.0;
      issues.push('見出し構造が不適切です');
    }

    // 文の長さ
    const avgSentenceLength = this.calculateAverageSentenceLength(content);
    if (avgSentenceLength > 100) {
      score -= 1.0;
      issues.push('文が長すぎます');
    }

    // 専門用語の説明
    if (!this.hasGlossary(content)) {
      score -= 0.5;
      issues.push('専門用語の説明がありません');
    }

    // コード例の説明
    if (this.hasCodeBlocks(content) && !this.hasCodeExplanations(content)) {
      score -= 0.5;
      issues.push('コード例の説明が不足しています');
    }

    return new QualityDimension('clarity', Math.max(score, 0), issues);
  }

  private calculateOverallScore(dimensions: QualityDimension[]): number {
    // 加重平均
    const weights = {
      accuracy: 0.3,
      completeness: 0.2,
      usefulness: 0.3,
      clarity: 0.2,
    };

    let overall = 0;
    for (const dim of dimensions) {
      overall += dim.score * weights[dim.name];
    }

    return overall;
  }

  // --- スコア計算 ---

  public calculateQualityScore(
    reviews: ArticleReview[],
    usage: UsageMetrics
  ): QualityScore {
    // レビューからのスコア
    const reviewScores = this.calculateReviewScores(reviews);

    // 使用状況からのスコア
    const usageScores = this.calculateUsageScores(usage);

    // 統合
    return QualityScore.calculate(
      reviewScores.accuracy * 0.7 + usageScores.accuracy * 0.3,
      reviewScores.completeness * 0.7 + usageScores.completeness * 0.3,
      reviewScores.usefulness * 0.3 + usageScores.usefulness * 0.7,
      reviewScores.clarity * 0.7 + usageScores.clarity * 0.3
    );
  }

  private calculateReviewScores(reviews: ArticleReview[]): QualityScoreComponents {
    if (reviews.length === 0) {
      return {
        accuracy: 3.0,
        completeness: 3.0,
        usefulness: 3.0,
        clarity: 3.0,
      };
    }

    return {
      accuracy: this.average(reviews.map(r => r.accuracyRating)),
      completeness: this.average(reviews.map(r => r.completenessRating)),
      usefulness: this.average(reviews.map(r => r.usefulnessRating)),
      clarity: this.average(reviews.map(r => r.clarityRating)),
    };
  }

  private calculateUsageScores(usage: UsageMetrics): QualityScoreComponents {
    // 使用状況から暗黙的な品質スコア推定
    const viewScore = Math.min(usage.viewCount / 100, 1.0) * 5;
    const likeScore = Math.min(usage.likeCount / 50, 1.0) * 5;
    const likeRate = usage.viewCount > 0 ? usage.likeCount / usage.viewCount : 0;

    return {
      accuracy: 3.0, // 使用状況からは推定困難
      completeness: 3.0, // 使用状況からは推定困難
      usefulness: likeScore,
      clarity: viewScore * likeRate * 5,
    };
  }

  // --- 改善提案 ---

  public suggestImprovements(article: KnowledgeArticle): Improvement[] {
    const improvements: Improvement[] = [];

    // 品質評価実施
    const assessment = this.assessQuality(article);

    // 各次元の問題から改善提案生成
    for (const dim of assessment.dimensions) {
      for (const issue of dim.issues) {
        const improvement = this.createImprovement(dim.name, issue);
        if (improvement) {
          improvements.push(improvement);
        }
      }
    }

    // 優先度でソート
    return improvements.sort((a, b) => b.priority - a.priority);
  }

  private createImprovement(
    dimension: string,
    issue: string
  ): Improvement | null {
    // 問題に応じた改善提案を生成
    const improvementMap: Record<string, Improvement> = {
      'レビューがありません': new Improvement(
        'レビューを依頼する',
        'レビュワーを追加して品質を検証してください',
        ImprovementPriority.HIGH
      ),
      '1年以上更新されていません': new Improvement(
        '内容を更新する',
        '最新情報を反映してください',
        ImprovementPriority.HIGH
      ),
      '導入セクションがありません': new Improvement(
        '導入セクションを追加する',
        '読者が内容を理解しやすくなります',
        ImprovementPriority.MEDIUM
      ),
      '具体例がありません': new Improvement(
        '具体例を追加する',
        '実践的な例を示すと理解が深まります',
        ImprovementPriority.MEDIUM
      ),
      '閲覧数が少ないです': new Improvement(
        'タグとカテゴリを見直す',
        '検索性を向上させましょう',
        ImprovementPriority.LOW
      ),
    };

    return improvementMap[issue] || null;
  }

  // --- 品質比較 ---

  public async compareQuality(
    articleId1: ArticleId,
    articleId2: ArticleId
  ): Promise<QualityComparison> {
    const article1 = await this.knowledgeRepository.findById(articleId1);
    const article2 = await this.knowledgeRepository.findById(articleId2);

    if (!article1 || !article2) {
      throw new ArticleNotFoundError(articleId1);
    }

    const assessment1 = this.assessQuality(article1);
    const assessment2 = this.assessQuality(article2);

    return new QualityComparison(assessment1, assessment2);
  }

  // --- ヘルパーメソッド ---

  private daysSince(date: Date): number {
    return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  }

  private hasIntroduction(content: string): boolean {
    return /^##?\s*(概要|はじめに|Introduction|Overview)/im.test(content);
  }

  private hasExamples(content: string): boolean {
    return /^##?\s*(例|サンプル|Example)/im.test(content) || /```/.test(content);
  }

  private hasConclusion(content: string): boolean {
    return /^##?\s*(まとめ|結論|Conclusion|Summary)/im.test(content);
  }

  private hasProperHeadings(content: string): boolean {
    const headings = content.match(/^#+\s/gm);
    return headings !== null && headings.length >= 2;
  }

  private calculateAverageSentenceLength(content: string): number {
    const sentences = content.split(/[。！？]/);
    return content.length / Math.max(sentences.length, 1);
  }

  private hasGlossary(content: string): boolean {
    return /^##?\s*(用語|Glossary)/im.test(content);
  }

  private hasCodeBlocks(content: string): boolean {
    return /```/.test(content);
  }

  private hasCodeExplanations(content: string): boolean {
    // コードブロックの前後に説明文があるかチェック（簡易版）
    return true; // TODO: implement properly
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }
}
```

---

## Domain Events {#domain-events}

BC-006のドメインサービスが発行する主要なイベント:

### ナレッジキャプチャイベント

```typescript
class KnowledgeCapturedEvent {
  constructor(
    public readonly projectId: ProjectId,
    public readonly candidateCount: number,
    public readonly timestamp: Date
  ) {}
}

class BestPracticeExtractedEvent {
  constructor(
    public readonly projectId: ProjectId,
    public readonly practiceId: BestPracticeId,
    public readonly timestamp: Date
  ) {}
}
```

### 発見・推奨イベント

```typescript
class KnowledgeRecommendedEvent {
  constructor(
    public readonly userId: UserId,
    public readonly articleIds: ArticleId[],
    public readonly context: RecommendationContext,
    public readonly timestamp: Date
  ) {}
}

class KnowledgeGapIdentifiedEvent {
  constructor(
    public readonly userId: UserId,
    public readonly gaps: KnowledgeGap[],
    public readonly timestamp: Date
  ) {}
}
```

### 学習経路イベント

```typescript
class LearningPathCreatedEvent {
  constructor(
    public readonly userId: UserId,
    public readonly pathId: PathId,
    public readonly targetSkills: SkillId[],
    public readonly timestamp: Date
  ) {}
}

class LearningPathAdjustedEvent {
  constructor(
    public readonly userId: UserId,
    public readonly pathId: PathId,
    public readonly reason: string,
    public readonly timestamp: Date
  ) {}
}
```

---

## 統合シナリオ {#integration-scenarios}

### シナリオ1: プロジェクト完了時のナレッジ捕捉

```typescript
// プロジェクト完了イベントハンドラ
class ProjectCompletedHandler {
  constructor(
    private knowledgeCaptureService: IKnowledgeCaptureService,
    private knowledgeRepository: IKnowledgeRepository
  ) {}

  async handle(event: ProjectCompletedEvent): Promise<void> {
    // 1. ナレッジ抽出
    const candidates = await this.knowledgeCaptureService.extractFromProject(
      event.projectId
    );

    // 2. 各候補を記事として作成
    for (const candidate of candidates.slice(0, 10)) { // 上位10件
      const article = KnowledgeArticle.createDraft(
        candidate.title,
        candidate.content,
        event.projectManagerId
      );

      // 3. 自動カテゴリ分類
      const categories = await this.knowledgeCaptureService.categorizeAutomatically(article);
      if (categories.length > 0) {
        article.categoryId = categories[0].categoryId;
      }

      // 4. タグ提案
      const tags = await this.knowledgeCaptureService.suggestTags(candidate.content);
      for (const tag of tags.slice(0, 5)) {
        article.addTag(tag.name);
      }

      // 5. 保存
      await this.knowledgeRepository.save(article);
    }

    // 6. ベストプラクティス抽出
    if (event.wasSuccessful) {
      const practices = await this.knowledgeCaptureService.extractBestPractices(
        event.projectId
      );

      for (const practice of practices) {
        // TODO: create BestPractice entities
      }
    }
  }
}
```

---

### シナリオ2: 新入社員のオンボーディング

```typescript
class OnboardingService {
  constructor(
    private learningPathDesigner: ILearningPathDesigner,
    private knowledgeDiscovery: IKnowledgeDiscoveryService,
    private courseRepository: ICourseRepository
  ) {}

  async onboardNewEmployee(
    userId: UserId,
    role: string,
    department: string
  ): Promise<OnboardingPlan> {
    // 1. ロールに必要なスキル特定
    const requiredSkills = await this.getRequiredSkillsForRole(role);

    // 2. 学習経路設計
    const learningPath = await this.learningPathDesigner.designLearningPath(
      userId,
      requiredSkills
    );

    // 3. 初日の推奨ナレッジ
    const initialKnowledge = await this.knowledgeDiscovery.recommendKnowledge(
      userId,
      new RecommendationContext({
        scenario: 'onboarding',
        department,
        role,
      })
    );

    // 4. オンボーディングプラン作成
    return new OnboardingPlan(
      userId,
      learningPath,
      initialKnowledge,
      department,
      role
    );
  }

  private async getRequiredSkillsForRole(role: string): Promise<SkillId[]> {
    // TODO: implement role-skill mapping
    return [];
  }
}
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 ドメインサービス詳細化
