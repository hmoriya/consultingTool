# BC-006: 学習システム詳細 [Learning System Details]

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-11-03
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/domain-language.md

---

## 目次

1. [概要](#overview)
2. [Learning Course Aggregate](#learning-course-aggregate)
3. [Learning Progress Aggregate](#learning-progress-aggregate)
4. [Learning Path Aggregate](#learning-path-aggregate)
5. [Certification Aggregate](#certification-aggregate)
6. [値オブジェクト](#value-objects)
7. [ビジネスルール](#business-rules)

---

## 概要 {#overview}

このドキュメントでは、BC-006の学習システムコンテキストの詳細を説明します。学習システムは、組織のメンバーが体系的にスキルを習得し、成長するための構造化された学習プログラムを提供します。

### 主要機能

- **コース管理**: 学習コースの作成、構成、公開
- **学習経路設計**: 個人のスキルギャップに基づく最適な学習パス
- **進捗追跡**: 学習者の進捗状況の可視化と管理
- **評価システム**: 理解度チェックと習熟度評価
- **修了証明**: コース修了の証明と認定

### 設計原則

- **適応型学習**: 個人のレベルと進捗に応じた調整
- **測定可能性**: 学習効果の定量的評価
- **モジュール性**: 再利用可能な学習モジュール
- **品質保証**: 教材の品質とアクセシビリティ確保

---

## Learning Course Aggregate {#learning-course-aggregate}

### 集約ルート: LearningCourse [学習コース]

学習コースのライフサイクルと構成を管理します。

#### TypeScript実装

```typescript
class LearningCourse {
  private id: CourseId;
  private title: string;
  private description: string;
  private overview: string;
  private status: CourseStatus; // draft | review | published | archived
  private level: SkillLevel; // beginner | intermediate | advanced | expert
  private category: CourseCategory;
  private modules: CourseModule[];
  private assessments: CourseAssessment[];
  private prerequisites: CourseId[];
  private learningObjectives: LearningObjective[];
  private estimatedDuration: Duration; // 推定学習時間
  private instructorId: UserId;
  private tags: string[];
  private enrollmentCount: number;
  private completionRate: number;
  private averageRating: number;
  private createdAt: Date;
  private publishedAt: Date | null;
  private updatedAt: Date;

  constructor(
    id: CourseId,
    title: string,
    description: string,
    level: SkillLevel,
    category: CourseCategory,
    instructorId: UserId
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.level = level;
    this.category = category;
    this.instructorId = instructorId;
    this.status = CourseStatus.DRAFT;
    this.modules = [];
    this.assessments = [];
    this.prerequisites = [];
    this.learningObjectives = [];
    this.tags = [];
    this.enrollmentCount = 0;
    this.completionRate = 0;
    this.averageRating = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // --- コース構成管理 ---

  public addModule(module: CourseModule): void {
    // ビジネスルール: モジュール順序は重複なし
    const existingOrder = this.modules.find(m => m.order === module.order);
    if (existingOrder) {
      throw new DuplicateModuleOrderError(module.order);
    }

    this.modules.push(module);
    this.updateEstimatedDuration();
    this.updatedAt = new Date();
  }

  public removeModule(moduleId: ModuleId): void {
    // ビジネスルール: 公開済みコースからモジュール削除不可
    if (this.status === CourseStatus.PUBLISHED) {
      throw new CannotModifyPublishedCourseError(this.id);
    }

    this.modules = this.modules.filter(m => !m.id.equals(moduleId));
    this.reorderModules();
    this.updateEstimatedDuration();
  }

  public reorderModules(): void {
    // モジュール順序を正規化（1, 2, 3, ...）
    this.modules
      .sort((a, b) => a.order - b.order)
      .forEach((module, index) => {
        module.updateOrder(index + 1);
      });
  }

  // --- 学習目標管理 ---

  public addLearningObjective(objective: LearningObjective): void {
    // ビジネスルール: 最大10個の学習目標
    if (this.learningObjectives.length >= 10) {
      throw new TooManyLearningObjectivesError(this.id);
    }

    this.learningObjectives.push(objective);
    this.updatedAt = new Date();
  }

  // --- 前提条件管理 ---

  public addPrerequisite(courseId: CourseId): void {
    // ビジネスルール: 循環参照チェック
    if (this.hasCircularPrerequisite(courseId)) {
      throw new CircularPrerequisiteError(this.id, courseId);
    }

    this.prerequisites.push(courseId);
  }

  private hasCircularPrerequisite(courseId: CourseId): boolean {
    // 循環参照検出ロジック（別途実装）
    // TODO: DomainServiceで他のコース情報も含めて検証
    return false;
  }

  // --- 評価管理 ---

  public addAssessment(assessment: CourseAssessment): void {
    // ビジネスルール: 評価は各モジュールまたはコース全体に紐づく
    if (assessment.moduleId && !this.hasModule(assessment.moduleId)) {
      throw new ModuleNotFoundError(assessment.moduleId);
    }

    this.assessments.push(assessment);
    this.updatedAt = new Date();
  }

  private hasModule(moduleId: ModuleId): boolean {
    return this.modules.some(m => m.id.equals(moduleId));
  }

  // --- コース公開 ---

  public publish(): void {
    // ビジネスルール: 公開前検証
    this.validateForPublication();

    this.status = CourseStatus.PUBLISHED;
    this.publishedAt = new Date();

    this.emit(new CoursePublishedEvent(this.id, this.instructorId));
  }

  private validateForPublication(): void {
    // 最低1つのモジュール必要
    if (this.modules.length === 0) {
      throw new NoModulesError(this.id);
    }

    // 学習目標が設定されている
    if (this.learningObjectives.length === 0) {
      throw new NoLearningObjectivesError(this.id);
    }

    // 評価基準が設定されている
    if (this.assessments.length === 0) {
      throw new NoAssessmentsError(this.id);
    }

    // レビュー済み（draft/reviewステータスのみ公開可能）
    if (this.status !== CourseStatus.REVIEW && this.status !== CourseStatus.DRAFT) {
      throw new InvalidCourseStatusError(this.status, 'publish');
    }
  }

  // --- 統計更新 ---

  public updateStatistics(
    enrollmentCount: number,
    completionRate: number,
    averageRating: number
  ): void {
    this.enrollmentCount = enrollmentCount;
    this.completionRate = completionRate;
    this.averageRating = averageRating;
  }

  private updateEstimatedDuration(): void {
    // 全モジュールの推定時間を合計
    const totalMinutes = this.modules.reduce(
      (sum, module) => sum + module.estimatedDuration.minutes,
      0
    );
    this.estimatedDuration = Duration.fromMinutes(totalMinutes);
  }

  // --- アーカイブ ---

  public archive(): void {
    // ビジネスルール: 公開済みコースのみアーカイブ可能
    if (this.status !== CourseStatus.PUBLISHED) {
      throw new CannotArchiveUnpublishedCourseError(this.id);
    }

    this.status = CourseStatus.ARCHIVED;
    this.emit(new CourseArchivedEvent(this.id));
  }
}
```

---

### 包含エンティティ: CourseModule [コースモジュール]

コース内の学習単位を表します。

```typescript
class CourseModule {
  private id: ModuleId;
  private courseId: CourseId;
  private title: string;
  private description: string;
  private order: number;
  private materials: CourseMaterial[];
  private estimatedDuration: Duration;
  private learningObjectives: string[];
  private completionCriteria: CompletionCriteria;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: ModuleId,
    courseId: CourseId,
    title: string,
    order: number
  ) {
    this.id = id;
    this.courseId = courseId;
    this.title = title;
    this.order = order;
    this.materials = [];
    this.learningObjectives = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public addMaterial(material: CourseMaterial): void {
    this.materials.push(material);
    this.updatedAt = new Date();
  }

  public updateOrder(newOrder: number): void {
    this.order = newOrder;
    this.updatedAt = new Date();
  }

  public setCompletionCriteria(criteria: CompletionCriteria): void {
    this.completionCriteria = criteria;
  }

  public isCompleted(userProgress: ModuleProgress): boolean {
    return this.completionCriteria.isMet(userProgress);
  }
}
```

---

### 包含エンティティ: CourseMaterial [教材]

モジュール内の学習教材を表します。

```typescript
enum MaterialType {
  VIDEO = 'video',
  DOCUMENT = 'document',
  SLIDE = 'slide',
  CODE_EXAMPLE = 'code_example',
  INTERACTIVE_EXERCISE = 'interactive_exercise',
  EXTERNAL_LINK = 'external_link',
  KNOWLEDGE_ARTICLE = 'knowledge_article', // BC-006内部連携
}

class CourseMaterial {
  private id: MaterialId;
  private moduleId: ModuleId;
  private title: string;
  private type: MaterialType;
  private content: string | null;
  private url: string | null;
  private fileReference: FileReference | null;
  private knowledgeArticleId: ArticleId | null; // ナレッジ記事参照
  private order: number;
  private duration: Duration | null; // 動画・演習などの場合
  private isRequired: boolean;
  private createdAt: Date;

  constructor(
    id: MaterialId,
    moduleId: ModuleId,
    title: string,
    type: MaterialType,
    order: number,
    isRequired: boolean = true
  ) {
    this.id = id;
    this.moduleId = moduleId;
    this.title = title;
    this.type = type;
    this.order = order;
    this.isRequired = isRequired;
    this.createdAt = new Date();
  }

  public setKnowledgeArticleReference(articleId: ArticleId): void {
    // ナレッジ記事との連携
    this.knowledgeArticleId = articleId;
    this.type = MaterialType.KNOWLEDGE_ARTICLE;
  }

  public setExternalLink(url: string): void {
    this.url = url;
  }

  public setFileReference(fileRef: FileReference): void {
    this.fileReference = fileRef;
  }
}
```

---

### 包含エンティティ: CourseAssessment [評価・テスト]

学習理解度を測定する評価を表します。

```typescript
enum AssessmentType {
  QUIZ = 'quiz',
  EXAM = 'exam',
  ASSIGNMENT = 'assignment',
  PROJECT = 'project',
  PEER_REVIEW = 'peer_review',
}

class CourseAssessment {
  private id: AssessmentId;
  private courseId: CourseId;
  private moduleId: ModuleId | null; // nullの場合はコース全体評価
  private title: string;
  private type: AssessmentType;
  private questions: AssessmentQuestion[];
  private passingScore: number;
  private maxScore: number;
  private timeLimit: Duration | null;
  private attemptsAllowed: number;
  private weight: number; // コース全体スコアへの重み（0.0-1.0）
  private isRequired: boolean;
  private createdAt: Date;

  constructor(
    id: AssessmentId,
    courseId: CourseId,
    title: string,
    type: AssessmentType,
    passingScore: number,
    maxScore: number
  ) {
    this.id = id;
    this.courseId = courseId;
    this.title = title;
    this.type = type;
    this.passingScore = passingScore;
    this.maxScore = maxScore;
    this.questions = [];
    this.attemptsAllowed = 3; // デフォルト3回
    this.weight = 1.0;
    this.isRequired = true;
    this.createdAt = new Date();
  }

  public addQuestion(question: AssessmentQuestion): void {
    this.questions.push(question);
  }

  public isPassed(score: number): boolean {
    return score >= this.passingScore;
  }

  public calculateScore(answers: Map<QuestionId, Answer>): number {
    let totalScore = 0;
    for (const question of this.questions) {
      const answer = answers.get(question.id);
      if (answer && question.isCorrect(answer)) {
        totalScore += question.points;
      }
    }
    return totalScore;
  }
}
```

---

## Learning Progress Aggregate {#learning-progress-aggregate}

### 集約ルート: LearningProgress [学習進捗]

学習者の進捗状況を追跡・管理します。

#### TypeScript実装

```typescript
enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

class LearningProgress {
  private id: ProgressId;
  private userId: UserId;
  private courseId: CourseId;
  private status: ProgressStatus;
  private enrolledAt: Date;
  private startedAt: Date | null;
  private completedAt: Date | null;
  private lastAccessedAt: Date;
  private moduleCompletions: ModuleCompletion[];
  private assessmentResults: AssessmentResult[];
  private progressRate: ProgressRate;
  private totalScore: number;
  private certificateId: CertificationId | null;
  private expiresAt: Date | null;

  constructor(userId: UserId, courseId: CourseId) {
    this.id = ProgressId.generate();
    this.userId = userId;
    this.courseId = courseId;
    this.status = ProgressStatus.NOT_STARTED;
    this.enrolledAt = new Date();
    this.lastAccessedAt = new Date();
    this.moduleCompletions = [];
    this.assessmentResults = [];
    this.progressRate = ProgressRate.zero();
    this.totalScore = 0;

    this.emit(new CourseEnrolledEvent(userId, courseId));
  }

  // --- 学習開始 ---

  public startCourse(): void {
    if (this.status !== ProgressStatus.NOT_STARTED) {
      throw new CourseAlreadyStartedError(this.id);
    }

    this.status = ProgressStatus.IN_PROGRESS;
    this.startedAt = new Date();
    this.lastAccessedAt = new Date();

    this.emit(new CourseStartedEvent(this.userId, this.courseId));
  }

  // --- モジュール完了 ---

  public completeModule(
    moduleId: ModuleId,
    timeSpent: Duration,
    materialsViewed: MaterialId[]
  ): void {
    // ビジネスルール: 既に完了済みのモジュールは再完了不可
    if (this.isModuleCompleted(moduleId)) {
      throw new ModuleAlreadyCompletedError(moduleId);
    }

    const completion = new ModuleCompletion(
      this.id,
      moduleId,
      timeSpent,
      materialsViewed,
      new Date()
    );

    this.moduleCompletions.push(completion);
    this.updateProgressRate();
    this.lastAccessedAt = new Date();

    this.emit(new ModuleCompletedEvent(this.userId, this.courseId, moduleId));
  }

  private isModuleCompleted(moduleId: ModuleId): boolean {
    return this.moduleCompletions.some(mc => mc.moduleId.equals(moduleId));
  }

  // --- 評価受験 ---

  public recordAssessmentResult(
    assessmentId: AssessmentId,
    score: number,
    maxScore: number,
    answers: Map<QuestionId, Answer>,
    attemptNumber: number
  ): void {
    const result = new AssessmentResult(
      this.id,
      assessmentId,
      score,
      maxScore,
      answers,
      attemptNumber,
      new Date()
    );

    this.assessmentResults.push(result);
    this.calculateTotalScore();
    this.lastAccessedAt = new Date();

    if (result.isPassed()) {
      this.emit(new AssessmentPassedEvent(
        this.userId,
        this.courseId,
        assessmentId,
        score
      ));
    } else {
      this.emit(new AssessmentFailedEvent(
        this.userId,
        this.courseId,
        assessmentId,
        score,
        attemptNumber
      ));
    }
  }

  // --- 進捗率更新 ---

  private updateProgressRate(): void {
    // 全モジュール数を取得（Domain Serviceから）
    // ここでは簡易的に実装
    const totalModules = this.getTotalModules(); // TODO: from course
    const completedModules = this.moduleCompletions.length;

    this.progressRate = ProgressRate.calculate(completedModules, totalModules);
  }

  private getTotalModules(): number {
    // TODO: Courseからモジュール数を取得
    return 10; // 仮
  }

  // --- 総合スコア計算 ---

  private calculateTotalScore(): void {
    // 各評価の最高スコアを加重平均で計算
    const assessmentScores = new Map<AssessmentId, number>();

    // 各評価の最高得点を取得
    for (const result of this.assessmentResults) {
      const current = assessmentScores.get(result.assessmentId) || 0;
      const newScore = result.normalizedScore(); // 100点満点に正規化
      if (newScore > current) {
        assessmentScores.set(result.assessmentId, newScore);
      }
    }

    // 加重平均計算（TODO: 評価のweightを考慮）
    const scores = Array.from(assessmentScores.values());
    this.totalScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  // --- コース修了判定 ---

  public checkCompletion(course: LearningCourse): void {
    // ビジネスルール: 修了条件
    // 1. 全モジュール完了
    // 2. 全必須評価で合格点以上

    if (!this.areAllModulesCompleted(course)) {
      return;
    }

    if (!this.areAllAssessmentsPassed(course)) {
      this.status = ProgressStatus.FAILED;
      return;
    }

    // 修了
    this.status = ProgressStatus.COMPLETED;
    this.completedAt = new Date();

    this.emit(new CourseCompletedEvent(
      this.userId,
      this.courseId,
      this.totalScore,
      this.completedAt
    ));
  }

  private areAllModulesCompleted(course: LearningCourse): boolean {
    const courseModuleIds = course.getModuleIds();
    const completedModuleIds = this.moduleCompletions.map(mc => mc.moduleId);

    return courseModuleIds.every(id =>
      completedModuleIds.some(cid => cid.equals(id))
    );
  }

  private areAllAssessmentsPassed(course: LearningCourse): boolean {
    const requiredAssessments = course.getRequiredAssessments();

    for (const assessment of requiredAssessments) {
      const results = this.assessmentResults.filter(r =>
        r.assessmentId.equals(assessment.id)
      );

      if (results.length === 0) {
        return false; // 未受験
      }

      const bestResult = results.reduce((best, current) =>
        current.score > best.score ? current : best
      );

      if (!assessment.isPassed(bestResult.score)) {
        return false; // 不合格
      }
    }

    return true;
  }

  // --- 有効期限チェック ---

  public checkExpiration(): void {
    if (this.expiresAt && new Date() > this.expiresAt) {
      this.status = ProgressStatus.EXPIRED;
      this.emit(new ProgressExpiredEvent(this.userId, this.courseId));
    }
  }

  // --- アクセス記録 ---

  public recordAccess(): void {
    this.lastAccessedAt = new Date();
  }
}
```

---

### 包含エンティティ: ModuleCompletion [モジュール完了記録]

```typescript
class ModuleCompletion {
  private progressId: ProgressId;
  private moduleId: ModuleId;
  private timeSpent: Duration;
  private materialsViewed: MaterialId[];
  private completedAt: Date;

  constructor(
    progressId: ProgressId,
    moduleId: ModuleId,
    timeSpent: Duration,
    materialsViewed: MaterialId[],
    completedAt: Date
  ) {
    this.progressId = progressId;
    this.moduleId = moduleId;
    this.timeSpent = timeSpent;
    this.materialsViewed = materialsViewed;
    this.completedAt = completedAt;
  }

  public hasViewedAllMaterials(requiredMaterials: MaterialId[]): boolean {
    return requiredMaterials.every(required =>
      this.materialsViewed.some(viewed => viewed.equals(required))
    );
  }
}
```

---

### 包含エンティティ: AssessmentResult [評価結果]

```typescript
class AssessmentResult {
  private progressId: ProgressId;
  private assessmentId: AssessmentId;
  private score: number;
  private maxScore: number;
  private answers: Map<QuestionId, Answer>;
  private attemptNumber: number;
  private submittedAt: Date;
  private feedback: string | null;

  constructor(
    progressId: ProgressId,
    assessmentId: AssessmentId,
    score: number,
    maxScore: number,
    answers: Map<QuestionId, Answer>,
    attemptNumber: number,
    submittedAt: Date
  ) {
    this.progressId = progressId;
    this.assessmentId = assessmentId;
    this.score = score;
    this.maxScore = maxScore;
    this.answers = answers;
    this.attemptNumber = attemptNumber;
    this.submittedAt = submittedAt;
  }

  public normalizedScore(): number {
    // 100点満点に正規化
    return (this.score / this.maxScore) * 100;
  }

  public isPassed(passingScore: number = 60): boolean {
    return this.normalizedScore() >= passingScore;
  }

  public addFeedback(feedback: string): void {
    this.feedback = feedback;
  }
}
```

---

## Learning Path Aggregate {#learning-path-aggregate}

### 集約ルート: LearningPath [学習経路]

個人に最適化された学習経路を管理します。

```typescript
class LearningPath {
  private id: PathId;
  private userId: UserId;
  private title: string;
  private targetSkills: SkillId[];
  private currentSkillLevel: SkillProfile;
  private targetSkillLevel: SkillProfile;
  private recommendedCourses: CourseRecommendation[];
  private completedCourses: CourseId[];
  private estimatedDuration: Duration;
  private progressPercentage: number;
  private createdAt: Date;
  private updatedAt: Date;
  private completedAt: Date | null;

  constructor(
    userId: UserId,
    targetSkills: SkillId[],
    currentLevel: SkillProfile,
    targetLevel: SkillProfile
  ) {
    this.id = PathId.generate();
    this.userId = userId;
    this.targetSkills = targetSkills;
    this.currentSkillLevel = currentLevel;
    this.targetSkillLevel = targetLevel;
    this.recommendedCourses = [];
    this.completedCourses = [];
    this.progressPercentage = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public addCourseRecommendation(
    courseId: CourseId,
    priority: number,
    reason: string
  ): void {
    const recommendation = new CourseRecommendation(
      courseId,
      priority,
      reason,
      this.recommendedCourses.length + 1
    );

    this.recommendedCourses.push(recommendation);
    this.updateEstimatedDuration();
  }

  public markCourseCompleted(courseId: CourseId): void {
    this.completedCourses.push(courseId);
    this.updateProgress();

    if (this.isPathCompleted()) {
      this.completedAt = new Date();
      this.emit(new LearningPathCompletedEvent(this.userId, this.id));
    }
  }

  private updateProgress(): void {
    const totalCourses = this.recommendedCourses.length;
    const completed = this.completedCourses.length;

    this.progressPercentage = (completed / totalCourses) * 100;
  }

  private isPathCompleted(): boolean {
    return this.progressPercentage >= 100;
  }

  private updateEstimatedDuration(): void {
    // Domain Serviceからコース情報取得して合計時間計算
    // TODO: implement
  }

  public getNextRecommendedCourse(): CourseId | null {
    const nextCourse = this.recommendedCourses
      .filter(rec => !this.completedCourses.includes(rec.courseId))
      .sort((a, b) => a.priority - b.priority)[0];

    return nextCourse ? nextCourse.courseId : null;
  }
}

class CourseRecommendation {
  constructor(
    public readonly courseId: CourseId,
    public readonly priority: number,
    public readonly reason: string,
    public readonly order: number
  ) {}
}
```

---

## Certification Aggregate {#certification-aggregate}

### 集約ルート: Certification [修了証明]

コース修了の証明書を管理します。

```typescript
class Certification {
  private id: CertificationId;
  private userId: UserId;
  private courseId: CourseId;
  private progressId: ProgressId;
  private certificateNumber: string;
  private issueDate: Date;
  private expiryDate: Date | null;
  private score: number;
  private credentialUrl: string;
  private verificationCode: string;
  private status: CertificationStatus; // active | expired | revoked
  private metadata: CertificationMetadata;

  constructor(
    userId: UserId,
    courseId: CourseId,
    progressId: ProgressId,
    score: number,
    expiryDate: Date | null = null
  ) {
    this.id = CertificationId.generate();
    this.userId = userId;
    this.courseId = courseId;
    this.progressId = progressId;
    this.score = score;
    this.expiryDate = expiryDate;
    this.issueDate = new Date();
    this.status = CertificationStatus.ACTIVE;
    this.certificateNumber = this.generateCertificateNumber();
    this.verificationCode = this.generateVerificationCode();
    this.credentialUrl = this.generateCredentialUrl();

    this.emit(new CertificationIssuedEvent(
      userId,
      courseId,
      this.certificateNumber
    ));
  }

  private generateCertificateNumber(): string {
    // フォーマット: CERT-YYYYMMDD-XXXXXX
    const date = this.issueDate.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${date}-${random}`;
  }

  private generateVerificationCode(): string {
    // SHA-256ハッシュ生成（ユーザーID + コースID + 発行日）
    const data = `${this.userId}-${this.courseId}-${this.issueDate.getTime()}`;
    // TODO: 実際のハッシュ生成実装
    return `VER-${data.substring(0, 16)}`;
  }

  private generateCredentialUrl(): string {
    return `/certificates/${this.certificateNumber}/verify`;
  }

  public verify(code: string): boolean {
    return this.verificationCode === code && this.status === CertificationStatus.ACTIVE;
  }

  public checkExpiration(): void {
    if (this.expiryDate && new Date() > this.expiryDate) {
      this.status = CertificationStatus.EXPIRED;
      this.emit(new CertificationExpiredEvent(this.id, this.userId));
    }
  }

  public revoke(reason: string): void {
    this.status = CertificationStatus.REVOKED;
    this.metadata = { ...this.metadata, revocationReason: reason };
    this.emit(new CertificationRevokedEvent(this.id, reason));
  }
}

enum CertificationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

interface CertificationMetadata {
  instructorName?: string;
  courseName?: string;
  revocationReason?: string;
}
```

---

## 値オブジェクト {#value-objects}

### LearningObjective [学習目標]

```typescript
enum ObjectiveLevel {
  REMEMBER = 'remember',       // 記憶
  UNDERSTAND = 'understand',   // 理解
  APPLY = 'apply',             // 応用
  ANALYZE = 'analyze',         // 分析
  EVALUATE = 'evaluate',       // 評価
  CREATE = 'create',           // 創造
}

class LearningObjective {
  constructor(
    public readonly description: string,
    public readonly measurableOutcome: string,
    public readonly level: ObjectiveLevel
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.description || this.description.length === 0) {
      throw new Error('Learning objective description is required');
    }
    if (!this.measurableOutcome || this.measurableOutcome.length === 0) {
      throw new Error('Measurable outcome is required');
    }
  }

  public toString(): string {
    return `[${this.level}] ${this.description} - ${this.measurableOutcome}`;
  }
}
```

---

### ProgressRate [進捗率]

```typescript
class ProgressRate {
  constructor(
    public readonly completedCount: number,
    public readonly totalCount: number,
    public readonly percentage: number
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.completedCount < 0 || this.totalCount < 0) {
      throw new Error('Counts cannot be negative');
    }
    if (this.completedCount > this.totalCount) {
      throw new Error('Completed count cannot exceed total count');
    }
    if (this.percentage < 0 || this.percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }

  public static calculate(completed: number, total: number): ProgressRate {
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    return new ProgressRate(completed, total, percentage);
  }

  public static zero(): ProgressRate {
    return new ProgressRate(0, 0, 0);
  }

  public isComplete(): boolean {
    return this.percentage === 100;
  }
}
```

---

### AssessmentCriteria [評価基準]

```typescript
class AssessmentCriteria {
  constructor(
    public readonly passingScore: number,
    public readonly maxScore: number,
    public readonly weight: number // 0.0 - 1.0
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.passingScore < 0 || this.passingScore > this.maxScore) {
      throw new Error('Invalid passing score');
    }
    if (this.maxScore <= 0) {
      throw new Error('Max score must be positive');
    }
    if (this.weight < 0 || this.weight > 1) {
      throw new Error('Weight must be between 0 and 1');
    }
  }

  public isPassed(score: number): boolean {
    return score >= this.passingScore;
  }

  public normalizeScore(score: number): number {
    return (score / this.maxScore) * 100;
  }
}
```

---

### Duration [期間]

```typescript
class Duration {
  constructor(public readonly minutes: number) {
    if (minutes < 0) {
      throw new Error('Duration cannot be negative');
    }
  }

  public static fromMinutes(minutes: number): Duration {
    return new Duration(minutes);
  }

  public static fromHours(hours: number): Duration {
    return new Duration(hours * 60);
  }

  public toHours(): number {
    return this.minutes / 60;
  }

  public toString(): string {
    const hours = Math.floor(this.minutes / 60);
    const mins = this.minutes % 60;

    if (hours === 0) {
      return `${mins}分`;
    } else if (mins === 0) {
      return `${hours}時間`;
    } else {
      return `${hours}時間${mins}分`;
    }
  }

  public add(other: Duration): Duration {
    return new Duration(this.minutes + other.minutes);
  }
}
```

---

### CompletionCriteria [完了基準]

```typescript
enum CriteriaType {
  VIEW_ALL_MATERIALS = 'view_all_materials',
  PASS_ASSESSMENT = 'pass_assessment',
  COMPLETE_EXERCISE = 'complete_exercise',
  SPEND_MINIMUM_TIME = 'spend_minimum_time',
}

class CompletionCriteria {
  constructor(
    public readonly type: CriteriaType,
    public readonly requiredMaterials?: MaterialId[],
    public readonly minimumTime?: Duration,
    public readonly requiredAssessment?: AssessmentId
  ) {}

  public isMet(progress: ModuleProgress): boolean {
    switch (this.type) {
      case CriteriaType.VIEW_ALL_MATERIALS:
        return this.requiredMaterials
          ? progress.hasViewedAll(this.requiredMaterials)
          : false;

      case CriteriaType.SPEND_MINIMUM_TIME:
        return this.minimumTime
          ? progress.timeSpent.minutes >= this.minimumTime.minutes
          : false;

      case CriteriaType.PASS_ASSESSMENT:
        return this.requiredAssessment
          ? progress.hasPassedAssessment(this.requiredAssessment)
          : false;

      default:
        return false;
    }
  }
}
```

---

## ビジネスルール {#business-rules}

### 1. コース公開ルール

**条件**:
- 最低1つのモジュールが存在
- 学習目標が設定されている（最低1つ）
- 評価基準が設定されている（最低1つ）
- レビュー済みステータス（draft/review → published）

**制約**:
- 公開済みコースのモジュール削除不可
- 公開済みコースの評価基準変更不可（バージョニングで対応）

---

### 2. 学習進捗ルール

**進捗計算**:
```
進捗率 = (完了モジュール数 / 全モジュール数) × 100%
```

**モジュール完了条件**:
- 全必須教材の閲覧
- 最低学習時間の経過（設定がある場合）
- モジュール評価の合格（設定がある場合）

**コース修了条件**:
- 全モジュール完了（100%）
- 全必須評価で合格点以上
- 必須課題の提出（設定がある場合）

---

### 3. 評価受験ルール

**受験回数制限**:
- デフォルト: 3回まで
- コース設定で変更可能（1〜10回）

**再受験待機期間**:
- 不合格の場合、24時間後に再受験可能
- 最終試行で不合格の場合、1週間後に再受験可能

**不正行為検出**:
- 異常な回答時間（短すぎる）の検出
- 連続した同一回答パターンの検出

---

### 4. 証明書発行ルール

**発行条件**:
- コース修了（status = COMPLETED）
- 総合スコアが基準以上（デフォルト70%）
- 有効期限内に完了（設定がある場合）
- 不正行為なし

**有効期限**:
- コースによって設定（無期限 or 1年/2年/3年）
- 有効期限付きコースは再受講で更新可能

**失効条件**:
- 有効期限切れ
- 不正行為の発覚
- 管理者による取り消し

---

### 5. 学習経路設計ルール

**推奨コース選定基準**:
1. 現在のスキルレベルとのギャップ分析
2. 前提条件コースの完了状況
3. 目標スキルレベルへの最短経路
4. 個人の学習履歴と得意分野

**優先順位決定**:
```
Priority = (SkillGapScore × 0.4) + (PrerequisiteMatch × 0.3) + (LearningHistoryMatch × 0.3)
```

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 学習システム詳細化
