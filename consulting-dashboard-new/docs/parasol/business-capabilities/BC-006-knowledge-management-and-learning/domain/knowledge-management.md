# BC-006: ナレッジ管理ドメイン詳細

**ドキュメント**: Domain層 - ナレッジ管理
**最終更新**: 2025-11-03

このドキュメントでは、BC-006のナレッジ管理に関する集約、エンティティ、値オブジェクトの詳細を記載します。

---

## 目次

1. [Knowledge Article Aggregate](#knowledge-article-aggregate)
2. [Knowledge Category Aggregate](#knowledge-category-aggregate)
3. [Best Practice Aggregate](#best-practice-aggregate)
4. [値オブジェクト](#value-objects)
5. [ビジネスルール](#business-rules)

---

## Knowledge Article Aggregate {#knowledge-article-aggregate}

### 集約ルート: KnowledgeArticle

**責務**: ナレッジ記事のライフサイクル管理（作成、レビュー、公開、更新、アーカイブ）

**属性**:
```typescript
class KnowledgeArticle {
  private id: ArticleId;
  private title: string;
  private content: string;
  private summary: string;
  private status: ArticleStatus; // draft | review | published | archived
  private categoryId: CategoryId;
  private authorId: UserId;
  private versions: ArticleVersion[];
  private tags: ArticleTag[];
  private reviews: ArticleReview[];
  private attachments: ArticleAttachment[];
  private qualityScore: QualityScore;
  private viewCount: number;
  private likeCount: number;
  private metadata: ArticleMetadata;
  private createdAt: Date;
  private publishedAt: Date | null;
  private archivedAt: Date | null;
}
```

### 主要メソッド

#### 記事作成
```typescript
public static createDraft(
  title: string,
  content: string,
  categoryId: CategoryId,
  authorId: UserId
): KnowledgeArticle {
  // ビジネスルール: タイトルは必須、3-200文字
  if (title.length < 3 || title.length > 200) {
    throw new InvalidTitleLengthError(title.length);
  }

  // ビジネスルール: 本文は必須、最低50文字
  if (content.length < 50) {
    throw new ContentTooShortError(content.length);
  }

  const article = new KnowledgeArticle();
  article.id = ArticleId.generate();
  article.title = title;
  article.content = content;
  article.status = ArticleStatus.DRAFT;
  article.categoryId = categoryId;
  article.authorId = authorId;
  article.versions = [];
  article.qualityScore = QualityScore.initial();
  article.metadata = ArticleMetadata.create(authorId);
  article.createdAt = new Date();

  article.emit(new ArticleCreatedEvent(article.id, authorId));
  return article;
}
```

#### レビュー依頼
```typescript
public requestReview(reviewerIds: UserId[]): void {
  // ビジネスルール: 下書き状態からのみレビュー依頼可能
  if (this.status !== ArticleStatus.DRAFT) {
    throw new InvalidArticleStatusError(this.status, 'review request');
  }

  // ビジネスルール: 必須項目チェック
  this.validateRequiredFields();

  // ビジネスルール: 最低1名のレビュワー必要
  if (reviewerIds.length === 0) {
    throw new NoReviewersSpecifiedError();
  }

  this.status = ArticleStatus.REVIEW;

  reviewerIds.forEach(reviewerId => {
    const review = ArticleReview.create(this.id, reviewerId);
    this.reviews.push(review);
    this.emit(new ReviewRequestedEvent(this.id, reviewerId));
  });
}
```

#### 記事公開
```typescript
public publish(): void {
  // ビジネスルール: レビュー状態からのみ公開可能
  if (this.status !== ArticleStatus.REVIEW) {
    throw new InvalidArticleStatusError(this.status, 'publish');
  }

  // ビジネスルール: 最低1件の承認済みレビュー必要
  const approvedReviews = this.reviews.filter(r => r.isApproved());
  if (approvedReviews.length === 0) {
    throw new NoApprovedReviewsError(this.id);
  }

  // ビジネスルール: 品質スコア3.0以上
  if (this.qualityScore.overall < 3.0) {
    throw new InsufficientQualityScoreError(this.qualityScore.overall);
  }

  this.status = ArticleStatus.PUBLISHED;
  this.publishedAt = new Date();

  // 初版として保存
  const version = ArticleVersion.createFromCurrent(
    this,
    '1.0.0',
    'Initial publication'
  );
  this.versions.push(version);

  this.emit(new ArticlePublishedEvent(this.id, this.authorId));
}
```

#### 記事更新（新バージョン作成）
```typescript
public update(
  newContent: string,
  newTitle: string | null,
  changeDescription: string,
  editorId: UserId
): void {
  // ビジネスルール: 公開済み記事のみ更新可能
  if (this.status !== ArticleStatus.PUBLISHED) {
    throw new InvalidArticleStatusError(this.status, 'update');
  }

  // 現在のバージョンを保存
  const currentVersion = this.versions[this.versions.length - 1];
  const newVersionNumber = this.calculateNextVersion(newContent, newTitle);

  const version = new ArticleVersion(
    VersionId.generate(),
    this.id,
    currentVersion.versionNumber,
    this.title,
    this.content,
    this.metadata.clone(),
    new Date()
  );
  this.versions.push(version);

  // 新しい内容に更新
  this.content = newContent;
  if (newTitle) {
    this.title = newTitle;
  }
  this.metadata = this.metadata.updateVersion(newVersionNumber, editorId);

  // 品質スコアをリセット（再評価必要）
  this.qualityScore = this.qualityScore.resetForUpdate();

  this.emit(new ArticleUpdatedEvent(
    this.id,
    newVersionNumber,
    editorId,
    changeDescription
  ));
}
```

---

## Knowledge Category Aggregate {#knowledge-category-aggregate}

### 集約ルート: KnowledgeCategory

**責務**: ナレッジのカテゴリ分類体系の管理

**属性**:
```typescript
class KnowledgeCategory {
  private id: CategoryId;
  private name: string;
  private description: string;
  private parentCategoryId: CategoryId | null;
  private hierarchyLevel: number;
  private path: string; // 例: /技術/プログラミング/Java
  private articleCount: number;
  private icon: string;
  private displayOrder: number;
  private metadata: CategoryMetadata;
  private createdAt: Date;
}
```

### 主要メソッド

#### カテゴリ作成
```typescript
public static createRootCategory(
  name: string,
  description: string
): KnowledgeCategory {
  const category = new KnowledgeCategory();
  category.id = CategoryId.generate();
  category.name = name;
  category.description = description;
  category.parentCategoryId = null;
  category.hierarchyLevel = 0;
  category.path = `/${name}`;
  category.articleCount = 0;
  category.createdAt = new Date();

  return category;
}

public createSubcategory(
  name: string,
  description: string
): KnowledgeCategory {
  // ビジネスルール: 最大階層深度は5
  if (this.hierarchyLevel >= 4) { // 0-indexed, so 4 = 5th level
    throw new MaxHierarchyDepthExceededError(this.hierarchyLevel + 1);
  }

  const subcategory = new KnowledgeCategory();
  subcategory.id = CategoryId.generate();
  subcategory.name = name;
  subcategory.description = description;
  subcategory.parentCategoryId = this.id;
  subcategory.hierarchyLevel = this.hierarchyLevel + 1;
  subcategory.path = `${this.path}/${name}`;
  subcategory.articleCount = 0;
  subcategory.createdAt = new Date();

  return subcategory;
}
```

---

## Best Practice Aggregate {#best-practice-aggregate}

### 集約ルート: BestPractice

**責務**: 組織のベストプラクティスの管理と適用支援

**属性**:
```typescript
class BestPractice {
  private id: PracticeId;
  private name: string;
  private description: string;
  private context: PracticeContext; // 適用コンテキスト
  private successStories: SuccessStory[]; // 成功事例
  private evidences: PracticeEvidence[]; // エビデンス
  private applications: PracticeApplication[]; // 適用記録
  private relatedArticleIds: ArticleId[];
  private categoryId: CategoryId;
  private status: PracticeStatus; // proposed | validated | certified | deprecated
  private effectiveness: EffectivenessMetrics;
  private applicabilityScore: number; // 適用可能性スコア（0.0-1.0）
  private adoptionCount: number;
  private createdBy: UserId;
  private validatedBy: UserId | null;
  private createdAt: Date;
}
```

### 主要メソッド

#### ベストプラクティス提案
```typescript
public static propose(
  name: string,
  description: string,
  context: PracticeContext,
  initialStory: SuccessStory,
  proposerId: UserId
): BestPractice {
  // ビジネスルール: 最低1件の成功事例必要
  if (!initialStory) {
    throw new NoSuccessStoryProvidedError();
  }

  const practice = new BestPractice();
  practice.id = PracticeId.generate();
  practice.name = name;
  practice.description = description;
  practice.context = context;
  practice.successStories = [initialStory];
  practice.status = PracticeStatus.PROPOSED;
  practice.createdBy = proposerId;
  practice.createdAt = new Date();

  practice.emit(new BestPracticeProposedEvent(practice.id, proposerId));
  return practice;
}
```

#### ベストプラクティス認証
```typescript
public certify(
  validatorId: UserId,
  additionalEvidences: PracticeEvidence[]
): void {
  // ビジネスルール: 検証済み状態からのみ認証可能
  if (this.status !== PracticeStatus.VALIDATED) {
    throw new InvalidPracticeStatusError(this.status, 'certification');
  }

  // ビジネスルール: 最低3件の成功事例必要
  if (this.successStories.length < 3) {
    throw new InsufficientSuccessStoriesError(this.successStories.length);
  }

  // ビジネスルール: 効果測定データ必要
  if (!this.effectiveness.hasMeasurableResults()) {
    throw new NoEffectivenessMeasurementError(this.id);
  }

  this.status = PracticeStatus.CERTIFIED;
  this.validatedBy = validatorId;
  additionalEvidences.forEach(e => this.evidences.push(e));

  this.emit(new BestPracticeCertifiedEvent(this.id, validatorId));
}
```

#### 適用記録
```typescript
public recordApplication(
  projectId: ProjectId,
  appliedBy: UserId,
  outcome: ApplicationOutcome,
  notes: string
): void {
  const application = new PracticeApplication(
    ApplicationId.generate(),
    this.id,
    projectId,
    appliedBy,
    outcome,
    notes,
    new Date()
  );

  this.applications.push(application);
  this.adoptionCount++;

  // 効果測定の更新
  this.effectiveness.recordOutcome(outcome);

  this.emit(new BestPracticeAppliedEvent(
    this.id,
    projectId,
    appliedBy,
    outcome
  ));
}
```

---

## 値オブジェクト {#value-objects}

### ArticleMetadata

記事のメタデータを表す値オブジェクト。

```typescript
class ArticleMetadata {
  constructor(
    public readonly author: string,
    public readonly createdDate: Date,
    public readonly updatedDate: Date,
    public readonly version: string,
    public readonly editor: string | null
  ) {}

  public static create(authorId: UserId): ArticleMetadata {
    return new ArticleMetadata(
      authorId.toString(),
      new Date(),
      new Date(),
      '0.0.1',
      null
    );
  }

  public updateVersion(newVersion: string, editorId: UserId): ArticleMetadata {
    return new ArticleMetadata(
      this.author,
      this.createdDate,
      new Date(),
      newVersion,
      editorId.toString()
    );
  }

  public clone(): ArticleMetadata {
    return new ArticleMetadata(
      this.author,
      this.createdDate,
      this.updatedDate,
      this.version,
      this.editor
    );
  }
}
```

---

### QualityScore

ナレッジの品質を表す値オブジェクト。

```typescript
class QualityScore {
  constructor(
    public readonly accuracy: number,      // 正確性 (0.0-5.0)
    public readonly completeness: number,  // 完全性 (0.0-5.0)
    public readonly usefulness: number,    // 有用性 (0.0-5.0)
    public readonly clarity: number,       // 明確性 (0.0-5.0)
    public readonly overall: number        // 総合 (0.0-5.0)
  ) {
    // ビジネスルール: スコアは0.0-5.0の範囲
    this.validate();
  }

  private validate(): void {
    const scores = [this.accuracy, this.completeness, this.usefulness, this.clarity];
    scores.forEach(score => {
      if (score < 0.0 || score > 5.0) {
        throw new InvalidQualityScoreError(score);
      }
    });
  }

  public static initial(): QualityScore {
    return new QualityScore(3.0, 3.0, 3.0, 3.0, 3.0);
  }

  public static calculate(
    accuracy: number,
    completeness: number,
    usefulness: number,
    clarity: number
  ): QualityScore {
    // 加重平均で総合スコア計算
    const overall = (
      accuracy * 0.3 +
      completeness * 0.2 +
      usefulness * 0.3 +
      clarity * 0.2
    );

    return new QualityScore(accuracy, completeness, usefulness, clarity, overall);
  }

  public resetForUpdate(): QualityScore {
    // 更新時は品質スコアをリセット（再評価必要）
    return QualityScore.initial();
  }
}
```

---

### PracticeContext

ベストプラクティスの適用コンテキストを表す値オブジェクト。

```typescript
class PracticeContext {
  constructor(
    public readonly industry: string,           // 業界（例: 金融、製造）
    public readonly projectType: string,        // プロジェクト種別
    public readonly teamSize: TeamSizeRange,    // チーム規模
    public readonly complexity: ComplexityLevel, // 複雑度
    public readonly applicableScenarios: string[] // 適用シナリオ
  ) {}

  public matches(targetContext: PracticeContext): number {
    // コンテキストマッチングスコア（0.0-1.0）を計算
    let score = 0.0;
    let factors = 0;

    if (this.industry === targetContext.industry) {
      score += 0.3;
    }
    factors++;

    if (this.projectType === targetContext.projectType) {
      score += 0.3;
    }
    factors++;

    if (this.teamSize.overlaps(targetContext.teamSize)) {
      score += 0.2;
    }
    factors++;

    if (this.complexity === targetContext.complexity) {
      score += 0.2;
    }
    factors++;

    return score;
  }
}
```

---

## ビジネスルール {#business-rules}

### 記事ライフサイクルルール

1. **状態遷移規則**:
   - draft → review: `requestReview()` メソッド経由のみ
   - review → published: `publish()` メソッド経由のみ（承認済みレビュー必要）
   - published → published: `update()` メソッドで新バージョン作成
   - published → archived: `archive()` メソッド経由のみ

2. **レビュー規則**:
   - 最低1名のレビュワー必要
   - レビュワーは作成者と異なる必要あり
   - 承認率50%以上で公開可能
   - レビュー期限: 依頼から7日以内

3. **バージョン管理規則**:
   - 公開後の編集は必ず新バージョン
   - バージョン番号: セマンティックバージョニング（major.minor.patch）
   - メジャー変更: 構造や主旨の大幅変更
   - マイナー変更: 内容の追加や改善
   - パッチ: 誤字修正や軽微な修正

### カテゴリ管理ルール

1. **階層構造規則**:
   - 最大階層深度: 5階層
   - 循環参照禁止
   - ルートカテゴリは parent_category_id = NULL

2. **カテゴリ削除規則**:
   - 記事が存在するカテゴリは削除不可
   - サブカテゴリが存在するカテゴリは削除不可
   - 削除前に記事を移動またはアーカイブ

### ベストプラクティス認証ルール

1. **認証基準**:
   - 最低3件の成功事例
   - 効果測定データ（定量的指標）
   - 専門家レビュー承認
   - 適用コンテキストの明確化

2. **適用追跡ルール**:
   - 適用時の記録必須
   - 効果測定の報告推奨
   - 失敗事例も記録（学習材料として）

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 ドメイン層詳細化
