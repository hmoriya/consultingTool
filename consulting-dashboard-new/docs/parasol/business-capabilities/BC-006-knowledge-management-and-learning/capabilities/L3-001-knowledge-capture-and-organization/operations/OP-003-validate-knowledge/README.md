# OP-003: 知識を検証する

**作成日**: 2025-10-31
**所属L3**: L3-001-knowledge-capture-and-organization: Knowledge Capture And Organization
**所属BC**: BC-006: Knowledge Management & Learning
**V2移行元**: services/knowledge-co-creation-service/capabilities/knowledge-management/operations/validate-knowledge

---

## 📋 How: この操作の定義

### 操作の概要
記録・整理された知識の正確性と有用性を検証する。品質保証プロセスにより、信頼できる知識ベースを構築する。

### 実現する機能
- 知識内容の正確性チェック
- 専門家によるレビュー
- 知識の承認ワークフロー
- 品質基準の適用

### 入力
- 整理された知識
- 検証基準
- レビュアー情報
- 関連する参考情報

### 出力
- 検証済み知識
- レビューコメント
- 承認/差し戻しステータス
- 品質評価スコア

---

## 📥 入力パラメータ

### 必須パラメータ

#### 検証対象知識
```typescript
interface KnowledgeValidationInput {
  // 対象記事
  articleId: UUID;                  // 検証対象記事ID（必須）
  version?: number;                 // バージョン番号（省略時は最新版）

  // 検証タイプ
  validationType: ValidationType;   // 検証タイプ（必須）
  validationDepth: 'quick' | 'standard' | 'thorough';  // 検証深度

  // レビュアー指定（peer/expert reviewの場合）
  reviewerIds?: UUID[];             // レビュアーID配列
  reviewDeadline?: ISO8601DateTime; // レビュー期限

  // 検証基準
  qualityCriteria?: QualityCriteria; // 品質基準（カスタマイズ）
  complianceRules?: ComplianceRule[]; // コンプライアンスルール
}

enum ValidationType {
  AUTOMATED_QUALITY = 'automated_quality',       // 自動品質チェック
  PEER_REVIEW = 'peer_review',                   // ピアレビュー
  EXPERT_REVIEW = 'expert_review',               // エキスパートレビュー
  COMPLIANCE_CHECK = 'compliance_check',         // コンプライアンスチェック
  FRESHNESS_CHECK = 'freshness_check',           // 鮮度チェック
  COMPREHENSIVE = 'comprehensive'                // 包括検証（全チェック）
}
```

#### 品質基準設定
```typescript
interface QualityCriteria {
  // 可読性基準
  readability: {
    minFleschReadingEase?: number;      // Flesch Reading Ease最小値（0-100）
    maxFleschKincaidGrade?: number;     // Flesch-Kincaid Grade最大値
    targetAudience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };

  // 完全性基準
  completeness: {
    minContentLength?: number;          // 最小文字数
    requiredSections?: string[];        // 必須セクション配列
    minExamples?: number;               // 最小例数
    minReferences?: number;             // 最小参考文献数
  };

  // 正確性基準
  accuracy: {
    requireSourceVerification: boolean; // 出典検証必須
    requireFactChecking: boolean;       // ファクトチェック必須
    technicalAccuracyLevel: 1 | 2 | 3;  // 技術的正確性レベル
  };

  // 鮮度基準
  freshness: {
    maxAgeInDays?: number;              // 最大経過日数
    requireVersionControl: boolean;     // バージョン管理必須
    requireLastUpdatedDate: boolean;    // 最終更新日必須
  };

  // 構造基準
  structure: {
    requireTableOfContents: boolean;    // 目次必須
    minHeadingLevels: number;           // 最小見出しレベル数
    maxNestingDepth: number;            // 最大ネスト深度
  };
}
```

#### コンプライアンスルール
```typescript
interface ComplianceRule {
  ruleId: string;                       // ルールID
  ruleName: string;                     // ルール名
  ruleType: 'security' | 'legal' | 'corporate' | 'technical';
  severity: 'critical' | 'high' | 'medium' | 'low';

  // ルール定義
  pattern?: RegExp;                     // パターンマッチング
  keywords?: string[];                  // 禁止キーワード
  validator?: (content: string) => boolean;  // カスタムバリデータ

  // ルール説明
  description: string;
  remediation: string;                  // 修正方法
}
```

### 任意パラメータ

#### AI支援検証オプション
```typescript
interface AIAssistedValidationOptions {
  // AI品質分析
  enableAIQualityAnalysis: boolean;     // AI品質分析有効化
  aiModel: 'gpt-4' | 'claude-3' | 'palm-2';  // 使用AIモデル

  // 自動改善提案
  generateImprovementSuggestions: boolean;   // 改善提案生成
  suggestionCategories: string[];       // 提案カテゴリ

  // 類似記事比較
  compareSimilarArticles: boolean;      // 類似記事比較
  similarityThreshold: number;          // 類似度閾値（0-1）

  // 自動修正
  autoFixTypos: boolean;                // 誤字脱字自動修正
  autoFormatCode: boolean;              // コード自動整形
}
```

#### 差分検証オプション
```typescript
interface VersionDiffOptions {
  // 差分比較
  compareWithVersion?: number;          // 比較対象バージョン
  highlightChanges: boolean;            // 変更箇所ハイライト

  // 変更影響分析
  analyzeChangeImpact: boolean;         // 変更影響分析
  impactMetrics: string[];              // 影響メトリクス

  // 承認ワークフロー
  requireApprovalOnChanges: boolean;    // 変更時承認必須
  autoNotifyStakeholders: boolean;      // 関係者自動通知
}
```

### バリデーションルール

```typescript
const validationRules = {
  articleId: {
    required: true,
    format: 'uuid'
  },

  validationType: {
    required: true,
    enum: Object.values(ValidationType)
  },

  validationDepth: {
    required: true,
    enum: ['quick', 'standard', 'thorough'],
    default: 'standard'
  },

  reviewerIds: {
    required: false,
    minItems: 1,
    maxItems: 10,
    itemFormat: 'uuid',
    // peer_review/expert_reviewの場合は必須
    requiredIf: (input) => ['peer_review', 'expert_review'].includes(input.validationType)
  },

  reviewDeadline: {
    required: false,
    format: 'iso8601',
    minValue: () => new Date(),  // 現在時刻以降
    // レビュアー指定時は必須
    requiredIf: (input) => input.reviewerIds && input.reviewerIds.length > 0
  },

  qualityCriteria: {
    required: false,
    nested: {
      'readability.minFleschReadingEase': {
        min: 0,
        max: 100
      },
      'completeness.minContentLength': {
        min: 100,
        max: 100000
      }
    }
  }
};
```

---

## 📤 出力仕様

### 成功レスポンス

#### 自動品質検証結果
```typescript
interface AutomatedQualityValidationResponse {
  success: true;
  statusCode: 200;
  message: '品質検証が完了しました';

  data: {
    // 検証概要
    validation: {
      validationId: UUID;
      articleId: UUID;
      articleTitle: string;
      version: number;
      validationType: ValidationType;
      validationDepth: string;

      // 検証実施情報
      validatedAt: ISO8601DateTime;
      validatedBy: 'system' | UUID;      // システム自動 or ユーザーID
      processingTime: number;             // 処理時間（ms）
    };

    // 総合品質スコア
    overallQuality: {
      score: number;                      // 総合スコア（0-100）
      grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
      passed: boolean;                    // 基準クリア判定

      // カテゴリ別スコア
      breakdown: {
        readability: QualityScore;        // 可読性
        completeness: QualityScore;       // 完全性
        accuracy: QualityScore;           // 正確性
        freshness: QualityScore;          // 鮮度
        structure: QualityScore;          // 構造
      };
    };

    // 詳細検証結果
    detailedResults: {
      // 可読性分析
      readabilityAnalysis: {
        fleschReadingEase: number;        // Flesch Reading Ease（0-100）
        fleschKincaidGrade: number;       // Flesch-Kincaid Grade Level
        automatedReadabilityIndex: number; // ARI
        colemanLiauIndex: number;         // Coleman-Liau Index

        // 解釈
        interpretation: {
          readingLevel: string;           // 読解レベル
          targetAudience: string;         // 対象読者
          estimatedReadTime: number;      // 推定読了時間（分）
        };

        // 詳細指標
        metrics: {
          avgSentenceLength: number;      // 平均文長
          avgWordLength: number;          // 平均語長
          syllablesPerWord: number;       // 語あたり音節数
          complexWords: number;           // 複雑語数
          passiveVoicePercentage: number; // 受動態割合
        };
      };

      // 完全性チェック
      completenessCheck: {
        contentLength: number;            // 文字数
        requiredSectionsCovered: {
          total: number;
          covered: number;
          missing: string[];
        };
        examplesCount: number;
        referencesCount: number;
        imagesCount: number;
        codeBlocksCount: number;

        // 完全性スコア
        completenessPercentage: number;   // 完全性（%）
        gaps: Array<{
          category: string;
          description: string;
          severity: 'critical' | 'high' | 'medium' | 'low';
          suggestion: string;
        }>;
      };

      // 正確性検証
      accuracyVerification: {
        sourcesVerified: boolean;
        factCheckingStatus: 'passed' | 'failed' | 'pending';
        technicalAccuracyScore: number;   // 技術的正確性（0-100）

        // 検出された問題
        issues: Array<{
          type: 'broken_link' | 'outdated_info' | 'inaccuracy' | 'inconsistency';
          location: string;               // 問題箇所
          description: string;
          severity: 'critical' | 'high' | 'medium' | 'low';
          suggestedFix?: string;
        }>;
      };

      // 鮮度チェック
      freshnessCheck: {
        lastUpdated: ISO8601DateTime;
        ageInDays: number;
        freshnessStatus: 'current' | 'aging' | 'stale' | 'outdated';
        versionCount: number;
        updateFrequency: string;          // 更新頻度

        // 鮮度推奨
        recommendations: Array<{
          action: 'update' | 'review' | 'archive';
          reason: string;
          priority: 'high' | 'medium' | 'low';
        }>;
      };

      // 構造分析
      structureAnalysis: {
        hasTableOfContents: boolean;
        headingLevels: number[];
        maxNestingDepth: number;
        organizationScore: number;        // 構造スコア（0-100）

        // 構造改善提案
        structureIssues: Array<{
          issue: string;
          location?: string;
          suggestion: string;
        }>;
      };
    };

    // AI生成改善提案
    improvementSuggestions?: Array<{
      category: 'readability' | 'completeness' | 'accuracy' | 'structure';
      priority: 'high' | 'medium' | 'low';
      suggestion: string;
      rationale: string;
      estimatedImpact: string;
      autoFixable: boolean;
    }>;

    // コンプライアンス結果
    complianceResults?: Array<{
      ruleId: string;
      ruleName: string;
      passed: boolean;
      violations?: Array<{
        location: string;
        description: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        remediation: string;
      }>;
    }>;

    // 次のアクション
    nextActions: {
      canPublish: boolean;                // 公開可否
      requiresRevision: boolean;          // 修正必要
      requiresReview: boolean;            // レビュー必要
      suggestedWorkflow: string;          // 推奨ワークフロー
    };
  };

  meta: {
    processingTime: number;
    validationEngine: string;             // 検証エンジン情報
    criteriaUsed: QualityCriteria;
  };
}

interface QualityScore {
  score: number;                          // スコア（0-100）
  grade: string;                          // グレード
  passed: boolean;                        // 合格/不合格
  weight: number;                         // 重み（総合スコア計算用）
}
```

#### レビュー開始レスポンス
```typescript
interface ReviewInitiatedResponse {
  success: true;
  statusCode: 201;
  message: 'レビュープロセスが開始されました';

  data: {
    review: {
      reviewId: UUID;
      articleId: UUID;
      reviewType: 'peer_review' | 'expert_review';
      status: 'pending';

      // レビュアー情報
      reviewers: Array<{
        userId: UUID;
        name: string;
        email: string;
        role: string;
        assignedAt: ISO8601DateTime;
        deadline: ISO8601DateTime;
        status: 'assigned' | 'in_progress' | 'completed';
      }>;

      // レビュー設定
      criteria: QualityCriteria;
      reviewDeadline: ISO8601DateTime;

      // 通知情報
      notifications: {
        reviewersNotified: boolean;
        authorNotified: boolean;
        stakeholdersNotified: boolean;
      };
    };

    // 自動品質チェック結果（参考情報）
    preliminaryQualityCheck?: {
      score: number;
      majorIssues: string[];
      recommendations: string[];
    };

    nextActions: {
      monitorReviewUrl: string;
      reviewDashboardUrl: string;
    };
  };
}
```

#### バージョン差分レスポンス
```typescript
interface VersionDiffResponse {
  success: true;
  statusCode: 200;
  message: 'バージョン差分分析が完了しました';

  data: {
    comparison: {
      oldVersion: number;
      newVersion: number;

      // 差分統計
      statistics: {
        addedLines: number;
        deletedLines: number;
        modifiedLines: number;
        unchangedLines: number;
        totalChanges: number;
        changePercentage: number;        // 変更率（%）
      };

      // 詳細差分
      diff: Array<{
        section: string;
        changeType: 'added' | 'deleted' | 'modified' | 'unchanged';
        oldContent?: string;
        newContent?: string;
        lineNumber: number;
      }>;

      // 影響分析
      impactAnalysis: {
        contentQualityChange: number;    // 品質変化（-100 to +100）
        readabilityChange: number;
        completenessChange: number;

        // 主要変更点
        majorChanges: Array<{
          category: string;
          description: string;
          impact: 'positive' | 'negative' | 'neutral';
          severity: 'high' | 'medium' | 'low';
        }>;

        // 影響を受けるユーザー
        affectedUsers: {
          viewersCount: number;
          subscribersCount: number;
          referencingArticlesCount: number;
        };
      };

      // 承認ステータス
      approvalStatus: {
        requiresApproval: boolean;
        approverIds?: UUID[];
        approvalDeadline?: ISO8601DateTime;
      };
    };
  };
}
```

### エラーレスポンス

```typescript
interface ValidationErrorResponse {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
    details?: any;
    validationErrors?: Array<{
      field: string;
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

```
API Layer
    ↓
Application Service Layer
    ↓
Domain Service Layer
    ├─→ Quality Assessment Service
    ├─→ Review Workflow Service
    ├─→ Compliance Validation Service
    └─→ Version Diff Service
    ↓
Domain Model Layer
    ├─→ KnowledgeArticle Aggregate
    ├─→ ValidationReport Value Object
    └─→ ReviewProcess Aggregate
    ↓
Infrastructure Layer
    ├─→ PostgreSQL (検証結果)
    ├─→ NLP Libraries (可読性分析)
    └─→ BC-007 (レビュー通知)
```

### 核心実装コンポーネント

#### 1. Quality Assessment Service
```typescript
@Injectable()
export class QualityAssessmentService {
  constructor(
    private readonly readabilityAnalyzer: ReadabilityAnalyzer,
    private readonly completenessChecker: CompletenessChecker,
    private readonly accuracyVerifier: AccuracyVerifier,
    private readonly freshnessChecker: FreshnessChecker
  ) {}

  async assessQuality(
    article: KnowledgeArticle,
    criteria: QualityCriteria
  ): Promise<QualityAssessmentReport> {

    // 1. 可読性分析
    const readability = await this.readabilityAnalyzer.analyze(
      article.content,
      criteria.readability
    );

    // 2. 完全性チェック
    const completeness = await this.completenessChecker.check(
      article,
      criteria.completeness
    );

    // 3. 正確性検証
    const accuracy = await this.accuracyVerifier.verify(
      article,
      criteria.accuracy
    );

    // 4. 鮮度チェック
    const freshness = await this.freshnessChecker.check(
      article,
      criteria.freshness
    );

    // 5. 総合スコア計算
    const overallScore = this.calculateOverallScore({
      readability,
      completeness,
      accuracy,
      freshness
    });

    return {
      overallScore,
      readability,
      completeness,
      accuracy,
      freshness
    };
  }

  private calculateOverallScore(scores: {
    readability: QualityScore;
    completeness: QualityScore;
    accuracy: QualityScore;
    freshness: QualityScore;
  }): number {
    // 重み付き平均
    const weights = {
      readability: 0.25,
      completeness: 0.30,
      accuracy: 0.30,
      freshness: 0.15
    };

    return (
      scores.readability.score * weights.readability +
      scores.completeness.score * weights.completeness +
      scores.accuracy.score * weights.accuracy +
      scores.freshness.score * weights.freshness
    );
  }
}
```

#### 2. Readability Analyzer（可読性分析）
```typescript
@Injectable()
export class ReadabilityAnalyzer {
  // Flesch Reading Ease スコア計算
  calculateFleschReadingEase(text: string): number {
    const sentences = this.countSentences(text);
    const words = this.countWords(text);
    const syllables = this.countSyllables(text);

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // FRE = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const fre = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

    return Math.max(0, Math.min(100, fre));
  }

  // Flesch-Kincaid Grade Level 計算
  calculateFleschKincaidGrade(text: string): number {
    const sentences = this.countSentences(text);
    const words = this.countWords(text);
    const syllables = this.countSyllables(text);

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // FKGL = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    const fkgl = 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59;

    return Math.max(0, fkgl);
  }

  // 日本語対応: 文のカウント
  private countSentences(text: string): number {
    // 句点（。！？）でカウント
    const sentences = text.match(/[。！？]/g);
    return sentences ? sentences.length : 1;
  }

  // 日本語対応: 単語のカウント
  private countWords(text: string): number {
    // 形態素解析ライブラリ（kuromoji.js）を使用
    return this.tokenize(text).length;
  }

  // 日本語対応: 音節のカウント（ひらがな・カタカナ文字数）
  private countSyllables(text: string): number {
    const hiragana = text.match(/[\u3040-\u309F]/g);
    const katakana = text.match(/[\u30A0-\u30FF]/g);

    return (hiragana?.length || 0) + (katakana?.length || 0);
  }

  // 総合可読性分析
  async analyze(text: string, criteria: any): Promise<ReadabilityReport> {
    const fre = this.calculateFleschReadingEase(text);
    const fkgl = this.calculateFleschKincaidGrade(text);
    const ari = this.calculateAutomatedReadabilityIndex(text);

    // 可読性スコア（0-100）
    const score = this.normalizeReadabilityScore(fre);

    // 解釈
    const interpretation = this.interpretReadabilityScore(fre);

    // 詳細メトリクス
    const metrics = {
      avgSentenceLength: this.calculateAvgSentenceLength(text),
      avgWordLength: this.calculateAvgWordLength(text),
      complexWords: this.countComplexWords(text),
      passiveVoicePercentage: this.calculatePassiveVoicePercentage(text)
    };

    return {
      fleschReadingEase: fre,
      fleschKincaidGrade: fkgl,
      automatedReadabilityIndex: ari,
      score,
      interpretation,
      metrics,
      passed: score >= (criteria.minFleschReadingEase || 60)
    };
  }
}
```

#### 3. Completeness Checker（完全性チェック）
```typescript
@Injectable()
export class CompletenessChecker {
  async check(
    article: KnowledgeArticle,
    criteria: CompletenessCriteria
  ): Promise<CompletenessReport> {

    // 1. 必須セクションチェック
    const sectionsCoverage = this.checkRequiredSections(
      article.content,
      criteria.requiredSections
    );

    // 2. コンテンツ長チェック
    const contentLength = article.content.length;
    const lengthSufficient = contentLength >= criteria.minContentLength;

    // 3. 例・参考文献のチェック
    const examplesCount = this.countExamples(article.content);
    const referencesCount = article.references?.length || 0;

    // 4. ビジュアルコンテンツチェック
    const imagesCount = this.countImages(article.content);
    const codeBlocksCount = this.countCodeBlocks(article.content);

    // 5. 完全性スコア計算
    const score = this.calculateCompletenessScore({
      sectionsCoverage,
      lengthSufficient,
      examplesCount,
      referencesCount,
      imagesCount,
      criteria
    });

    // 6. ギャップ分析
    const gaps = this.identifyGaps(article, criteria, {
      sectionsCoverage,
      examplesCount,
      referencesCount
    });

    return {
      score,
      contentLength,
      sectionsCoverage,
      examplesCount,
      referencesCount,
      imagesCount,
      codeBlocksCount,
      gaps,
      passed: score >= 70  // 70%以上で合格
    };
  }

  private checkRequiredSections(
    content: string,
    requiredSections: string[]
  ): { total: number; covered: number; missing: string[] } {
    if (!requiredSections || requiredSections.length === 0) {
      return { total: 0, covered: 0, missing: [] };
    }

    const missing: string[] = [];
    let covered = 0;

    for (const section of requiredSections) {
      // セクション見出しの検索（Markdown形式）
      const regex = new RegExp(`^#+\\s+${section}`, 'mi');
      if (regex.test(content)) {
        covered++;
      } else {
        missing.push(section);
      }
    }

    return {
      total: requiredSections.length,
      covered,
      missing
    };
  }

  private identifyGaps(
    article: KnowledgeArticle,
    criteria: CompletenessCriteria,
    results: any
  ): Gap[] {
    const gaps: Gap[] = [];

    // 必須セクション不足
    if (results.sectionsCoverage.missing.length > 0) {
      gaps.push({
        category: 'required_sections',
        description: `必須セクションが不足しています: ${results.sectionsCoverage.missing.join(', ')}`,
        severity: 'high',
        suggestion: '不足しているセクションを追加してください。'
      });
    }

    // 例が少ない
    if (criteria.minExamples && results.examplesCount < criteria.minExamples) {
      gaps.push({
        category: 'examples',
        description: `例が不足しています（現在: ${results.examplesCount}、必要: ${criteria.minExamples}）`,
        severity: 'medium',
        suggestion: `実践的な例を${criteria.minExamples - results.examplesCount}個以上追加してください。`
      });
    }

    // 参考文献が少ない
    if (criteria.minReferences && results.referencesCount < criteria.minReferences) {
      gaps.push({
        category: 'references',
        description: `参考文献が不足しています（現在: ${results.referencesCount}、必要: ${criteria.minReferences}）`,
        severity: 'medium',
        suggestion: `信頼できる参考文献を${criteria.minReferences - results.referencesCount}個以上追加してください。`
      });
    }

    return gaps;
  }
}
```

#### 4. Review Workflow Service
```typescript
@Injectable()
export class ReviewWorkflowService {
  constructor(
    private readonly reviewRepo: ReviewProcessRepository,
    private readonly notificationService: BC007NotificationService  // BC-007連携
  ) {}

  async initiateReview(
    articleId: UUID,
    reviewerIds: UUID[],
    deadline: Date,
    reviewType: 'peer_review' | 'expert_review'
  ): Promise<ReviewProcess> {

    // 1. ReviewProcess Aggregate作成
    const review = ReviewProcess.create({
      articleId,
      reviewType,
      deadline,
      status: 'pending'
    });

    // 2. レビュアー割り当て
    for (const reviewerId of reviewerIds) {
      review.assignReviewer(reviewerId, deadline);
    }

    // 3. 永続化
    await this.reviewRepo.save(review);

    // 4. BC-007通知配信
    await this.notifyReviewers(review);

    return review;
  }

  private async notifyReviewers(review: ReviewProcess): Promise<void> {
    // BC-007のOP-001 (send-notification)を利用
    for (const reviewer of review.reviewers) {
      await this.notificationService.sendNotification({
        recipientId: reviewer.userId,
        type: 'review_assignment',
        priority: 'high',
        title: 'レビュー依頼が届きました',
        content: `記事「${review.articleTitle}」のレビューをお願いします。`,
        actionUrl: `/knowledge/reviews/${review.id}`,
        deadline: reviewer.deadline
      });
    }
  }

  async submitReviewComment(
    reviewId: UUID,
    reviewerId: UUID,
    comment: ReviewComment
  ): Promise<void> {
    const review = await this.reviewRepo.findById(reviewId);

    // レビューコメント追加
    review.addComment(reviewerId, comment);

    await this.reviewRepo.save(review);

    // 著者に通知（BC-007）
    await this.notifyAuthor(review, comment);
  }
}
```

#### 5. Version Diff Service
```typescript
@Injectable()
export class VersionDiffService {
  async analyzeDiff(
    articleId: UUID,
    oldVersion: number,
    newVersion: number
  ): Promise<VersionDiffReport> {

    // 1. 両バージョン取得
    const oldArticle = await this.articleRepo.findByVersion(articleId, oldVersion);
    const newArticle = await this.articleRepo.findByVersion(articleId, newVersion);

    // 2. 差分計算（diff-match-patch使用）
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(oldArticle.content, newArticle.content);
    dmp.diff_cleanupSemantic(diffs);

    // 3. 統計情報算出
    const statistics = this.calculateDiffStatistics(diffs);

    // 4. 影響分析
    const impactAnalysis = await this.analyzeImpact(oldArticle, newArticle, statistics);

    return {
      oldVersion,
      newVersion,
      diff: this.formatDiff(diffs),
      statistics,
      impactAnalysis
    };
  }

  private calculateDiffStatistics(diffs: Diff[]): DiffStatistics {
    let addedLines = 0;
    let deletedLines = 0;
    let modifiedLines = 0;

    for (const [op, text] of diffs) {
      const lines = text.split('\n').length - 1;

      if (op === DiffOp.INSERT) {
        addedLines += lines;
      } else if (op === DiffOp.DELETE) {
        deletedLines += lines;
      }
    }

    modifiedLines = Math.min(addedLines, deletedLines);
    addedLines -= modifiedLines;
    deletedLines -= modifiedLines;

    const totalChanges = addedLines + deletedLines + modifiedLines;

    return {
      addedLines,
      deletedLines,
      modifiedLines,
      totalChanges,
      changePercentage: (totalChanges / (addedLines + deletedLines + modifiedLines + 1)) * 100
    };
  }
}
```

### データベーススキーマ

```sql
-- 検証報告テーブル
CREATE TABLE validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  version INTEGER NOT NULL,
  validation_type VARCHAR(50) NOT NULL,
  validation_depth VARCHAR(20) NOT NULL,

  -- 総合品質
  overall_score DECIMAL(5,2) NOT NULL,
  overall_grade VARCHAR(5) NOT NULL,
  passed BOOLEAN NOT NULL,

  -- カテゴリ別スコア（JSONB）
  readability_score JSONB NOT NULL,
  completeness_score JSONB NOT NULL,
  accuracy_score JSONB NOT NULL,
  freshness_score JSONB NOT NULL,
  structure_score JSONB NOT NULL,

  -- 詳細結果（JSONB）
  detailed_results JSONB,
  improvement_suggestions JSONB,
  compliance_results JSONB,

  -- メタデータ
  validated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  validated_by UUID REFERENCES users(id),
  processing_time_ms INTEGER,

  CONSTRAINT check_overall_score CHECK (overall_score BETWEEN 0 AND 100)
);

-- レビュープロセステーブル
CREATE TABLE review_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES knowledge_articles(id),
  review_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,

  -- レビュー期限
  deadline TIMESTAMP NOT NULL,

  -- レビュアー情報（JSONB配列）
  reviewers JSONB NOT NULL,

  -- 検証基準
  quality_criteria JSONB,

  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,

  CONSTRAINT check_review_type CHECK (review_type IN ('peer_review', 'expert_review')),
  CONSTRAINT check_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

-- レビューコメントテーブル
CREATE TABLE review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES review_processes(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id),

  -- コメント内容
  comment TEXT NOT NULL,
  rating INTEGER,
  category VARCHAR(50),

  -- 位置情報
  line_number INTEGER,
  section VARCHAR(200),

  -- ステータス
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  resolved_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT check_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT check_comment_status CHECK (status IN ('open', 'addressed', 'resolved', 'dismissed'))
);

-- インデックス
CREATE INDEX idx_validation_reports_article ON validation_reports(article_id);
CREATE INDEX idx_validation_reports_validated_at ON validation_reports(validated_at DESC);
CREATE INDEX idx_review_processes_article ON review_processes(article_id);
CREATE INDEX idx_review_processes_status ON review_processes(status);
CREATE INDEX idx_review_comments_review ON review_comments(review_id);
```

---

## ⚠️ エラー処理プロトコル

### エラーコード体系

#### フォーマット
```
ERR_BC006_L3001_OP003_XXX
└─┬─┘ └─┬─┘ └─┬──┘ └─┬─┘ └┬┘
  │     │      │      │    └─ 連番（001-999）
  │     │      │      └────── Operation番号（OP-003）
  │     │      └───────────── L3 Capability番号
  │     └──────────────────── BC番号
  └────────────────────────── プレフィックス
```

### エラーカテゴリ

#### 1. バリデーションエラー (400)
```typescript
// ERR_BC006_L3001_OP003_001: 記事未存在
{
  code: 'ERR_BC006_L3001_OP003_001',
  message: '指定された記事が見つかりません。',
  details: {
    articleId: 'uuid-xxxxx',
    suggestion: '有効な記事IDを指定してください。'
  }
}

// ERR_BC006_L3001_OP003_002: バージョン不正
{
  code: 'ERR_BC006_L3001_OP003_002',
  message: '指定されたバージョンが存在しません。',
  details: {
    articleId: 'uuid-xxxxx',
    requestedVersion: 5,
    latestVersion: 3
  }
}

// ERR_BC006_L3001_OP003_003: レビュアー未指定
{
  code: 'ERR_BC006_L3001_OP003_003',
  message: 'レビュータイプにはレビュアーの指定が必須です。',
  field: 'reviewerIds',
  constraint: 'required for peer_review/expert_review'
}

// ERR_BC006_L3001_OP003_004: 期限不正
{
  code: 'ERR_BC006_L3001_OP003_004',
  message: 'レビュー期限は現在時刻より後に設定してください。',
  field: 'reviewDeadline',
  currentValue: '2024-11-01T00:00:00Z',
  minValue: '2024-11-04T12:00:00Z'
}
```

#### 2. ビジネスルールエラー (422)
```typescript
// ERR_BC006_L3001_OP003_101: 検証権限なし
{
  code: 'ERR_BC006_L3001_OP003_101',
  message: 'この記事を検証する権限がありません。',
  details: {
    articleId: 'uuid-xxxxx',
    requiredRole: ['EXPERT', 'REVIEWER', 'ADMIN'],
    currentRole: 'CONSULTANT'
  }
}

// ERR_BC006_L3001_OP003_102: レビュアー不適格
{
  code: 'ERR_BC006_L3001_OP003_102',
  message: '指定されたユーザーはレビュアー資格を持っていません。',
  details: {
    invalidReviewers: [
      { userId: 'uuid-aaaa', name: 'User A', reason: '経験不足' }
    ]
  }
}

// ERR_BC006_L3001_OP003_103: 既存レビュー進行中
{
  code: 'ERR_BC006_L3001_OP003_103',
  message: 'この記事は既にレビュー中です。',
  details: {
    existingReviewId: 'uuid-rrrrr',
    status: 'in_progress',
    deadline: '2024-11-10T00:00:00Z'
  }
}

// ERR_BC006_L3001_OP003_104: 下書き状態
{
  code: 'ERR_BC006_L3001_OP003_104',
  message: '下書き状態の記事は検証できません。',
  details: {
    articleStatus: 'draft',
    requiredStatus: 'published',
    suggestion: '記事を公開してから検証を実行してください。'
  }
}
```

#### 3. 外部サービスエラー (502/503)
```typescript
// ERR_BC006_L3001_OP003_401: NLP処理失敗
{
  code: 'ERR_BC006_L3001_OP003_401',
  message: '可読性分析に失敗しました。',
  statusCode: 503,
  details: {
    service: 'NLP Service',
    error: 'Timeout',
    impact: '可読性スコアは計算されていません。',
    recovery: '手動で可読性を確認してください。'
  }
}

// ERR_BC006_L3001_OP003_402: BC-007通知失敗
{
  code: 'ERR_BC006_L3001_OP003_402',
  message: 'レビュアーへの通知送信に失敗しました。',
  statusCode: 502,
  details: {
    service: 'BC-007 Notification Service',
    failedNotifications: ['uuid-reviewer1', 'uuid-reviewer2'],
    impact: 'レビュープロセスは開始されましたが、通知は送信されていません。',
    recovery: '手動でレビュアーに連絡してください。'
  }
}
```

#### 4. システムエラー (500)
```typescript
// ERR_BC006_L3001_OP003_501: 検証エンジン障害
{
  code: 'ERR_BC006_L3001_OP003_501',
  message: '検証処理中にエラーが発生しました。',
  statusCode: 500,
  details: {
    error: 'Validation engine crash',
    requestId: 'req-xxxxx',
    timestamp: '2024-11-04T12:00:00Z'
  }
}
```

### エラーハンドリング実装

```typescript
@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let errorResponse: ValidationErrorResponse;

    if (exception instanceof ArticleNotFoundException) {
      errorResponse = {
        success: false,
        statusCode: 400,
        error: {
          code: 'ERR_BC006_L3001_OP003_001',
          message: exception.message,
          details: exception.details,
          requestId: generateRequestId()
        },
        timestamp: new Date().toISOString()
      };
    }
    // ... 他のエラーハンドリング

    response.status(errorResponse.statusCode).json(errorResponse);
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
> - [services/knowledge-co-creation-service/capabilities/knowledge-management/operations/validate-knowledge/](../../../../../../../services/knowledge-co-creation-service/capabilities/knowledge-management/operations/validate-knowledge/)

---

## 📝 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-10-31 | OP-003 README初版作成（Phase 3） | Claude |

---

**ステータス**: Phase 3 - Operation構造作成完了
**次のアクション**: UseCaseディレクトリの作成と移行（Phase 4）
