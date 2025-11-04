# BC-006: ドメイン層設計

**BC**: Knowledge Management & Organizational Learning [ナレッジ管理と組織学習] [BC_006]
**作成日**: 2025-10-31
**最終更新**: 2025-11-03
**V2移行元**: services/knowledge-co-creation-service/domain-language.md

---

## 目次

1. [概要](#overview)
2. [ドメインアーキテクチャ](#architecture)
3. [集約一覧](#aggregates)
4. [エンティティ一覧](#entities)
5. [値オブジェクト一覧](#value-objects)
6. [ドメインイベント](#domain-events)
7. [ドメインサービス](#domain-services)
8. [ビジネスルール](#business-rules)
9. [詳細ドキュメント](#detailed-docs)

---

## 概要 {#overview}

BC-006は、組織のナレッジ管理と継続的な学習を支援するドメインです。プロジェクトから得られた知見の体系化、ベストプラクティスの共有、効果的な学習プログラムの提供を通じて、組織の知的資本を最大化します。

### 主要機能

- **ナレッジ管理**: 記事作成、品質管理、バージョン管理、カテゴリ分類
- **ナレッジ検索・発見**: 全文検索、タグ検索、AI推奨、関連ナレッジ提示
- **学習システム**: コース作成、学習経路設計、進捗追跡、修了証明
- **ベストプラクティス**: 成功事例の蓄積、適用支援、効果測定
- **コミュニティ**: Q&A、レビュー、評価、コメント

### ドメイン特性

- **知識の明示化**: 暗黙知を形式知に変換
- **品質保証**: レビュープロセスによる信頼性確保
- **継続的更新**: バージョン管理による鮮度維持
- **パーソナライゼーション**: 個人のスキルレベルに応じた推奨
- **測定可能性**: 学習効果と知識活用度の可視化

---

## ドメインアーキテクチャ {#architecture}

### 境界づけられたコンテキスト

BC-006は以下の2つのサブドメインで構成されます：

```
BC-006: Knowledge Management & Organizational Learning
├── Knowledge Management Context [ナレッジ管理コンテキスト]
│   ├── Article Management [記事管理]
│   ├── Quality Assurance [品質保証]
│   ├── Categorization [分類管理]
│   └── Search & Discovery [検索・発見]
│
└── Learning System Context [学習システムコンテキスト]
    ├── Course Management [コース管理]
    ├── Learning Path [学習経路]
    ├── Progress Tracking [進捗追跡]
    └── Certification [認定・修了証]
```

### BC間連携

```
BC-006の依存関係:
├── BC-001 (Project Delivery): プロジェクトからナレッジ抽出
├── BC-003 (Access Control): ユーザー認証、権限管理
├── BC-005 (Team & Resource): スキルギャップ分析、トレーニング推奨
├── BC-007 (Communication): ナレッジ共有、Q&A、通知
└── 外部システム: AI/ML推奨エンジン、全文検索エンジン
```

---

## 集約一覧 {#aggregates}

BC-006は5つの主要集約で構成されます：

### 1. Knowledge Article Aggregate [ナレッジ記事集約]

**集約ルート**: KnowledgeArticle [KnowledgeArticle] [KNOWLEDGE_ARTICLE]

**責務**: ナレッジ記事のライフサイクル管理

**包含エンティティ**:
- ArticleVersion [ArticleVersion] [ARTICLE_VERSION]: バージョン履歴
- ArticleAttachment [ArticleAttachment] [ARTICLE_ATTACHMENT]: 添付ファイル
- ArticleReview [ArticleReview] [ARTICLE_REVIEW]: レビュー記録
- ArticleTag [ArticleTag] [ARTICLE_TAG]: タグ付け

**不変条件**:
- 記事は下書き → レビュー → 公開 の順で状態遷移
- 公開済み記事の編集は新バージョンとして保存
- レビュー承認なしでは公開不可
- アーカイブ済み記事は編集不可

**詳細**: [knowledge-management.md](knowledge-management.md#knowledge-article-aggregate)

---

### 2. Knowledge Category Aggregate [ナレッジカテゴリ集約]

**集約ルート**: KnowledgeCategory [KnowledgeCategory] [KNOWLEDGE_CATEGORY]

**責務**: ナレッジ分類体系の管理

**包含エンティティ**:
- CategoryHierarchy [CategoryHierarchy] [CATEGORY_HIERARCHY]: 階層構造

**不変条件**:
- カテゴリ階層に循環参照なし
- 最大階層深度は5階層
- ルートカテゴリは親を持たない

**詳細**: [knowledge-management.md](knowledge-management.md#knowledge-category-aggregate)

---

### 3. Learning Course Aggregate [学習コース集約]

**集約ルート**: LearningCourse [LearningCourse] [LEARNING_COURSE]

**責務**: 学習コースの構成と提供

**包含エンティティ**:
- CourseModule [CourseModule] [COURSE_MODULE]: コースモジュール
- CourseMaterial [CourseMaterial] [COURSE_MATERIAL]: 教材
- CourseAssessment [CourseAssessment] [COURSE_ASSESSMENT]: 評価・テスト

**不変条件**:
- コースは1つ以上のモジュールを持つ
- 評価基準が設定されている
- 前提条件コースは循環参照なし

**詳細**: [learning-system.md](learning-system.md#learning-course-aggregate)

---

### 4. Learning Progress Aggregate [学習進捗集約]

**集約ルート**: LearningProgress [LearningProgress] [LEARNING_PROGRESS]

**責務**: 学習者の進捗管理と修了判定

**包含エンティティ**:
- ModuleCompletion [ModuleCompletion] [MODULE_COMPLETION]: モジュール完了記録
- AssessmentResult [AssessmentResult] [ASSESSMENT_RESULT]: 評価結果

**不変条件**:
- 進捗は0%から100%の範囲
- 全モジュール完了で100%
- 評価基準クリアで修了

**詳細**: [learning-system.md](learning-system.md#learning-progress-aggregate)

---

### 5. Best Practice Aggregate [ベストプラクティス集約]

**集約ルート**: BestPractice [BestPractice] [BEST_PRACTICE]

**責務**: 成功事例の管理と適用支援

**包含エンティティ**:
- PracticeApplication [PracticeApplication] [PRACTICE_APPLICATION]: 適用記録
- PracticeEvidence [PracticeEvidence] [PRACTICE_EVIDENCE]: エビデンス

**不変条件**:
- ベストプラクティスは検証済みの成功事例
- 適用コンテキストが明確
- 効果測定指標が定義されている

**詳細**: [knowledge-management.md](knowledge-management.md#best-practice-aggregate)

---

## エンティティ一覧 {#entities}

### ナレッジ管理コンテキスト

| エンティティ | 説明 | 識別子 |
|------------|------|--------|
| KnowledgeArticle | ナレッジ記事 | article_id (UUID) |
| ArticleVersion | 記事バージョン | version_id (UUID) |
| KnowledgeCategory | カテゴリ | category_id (UUID) |
| Tag | タグ | tag_id (UUID) |
| BestPractice | ベストプラクティス | practice_id (UUID) |

### 学習システムコンテキスト

| エンティティ | 説明 | 識別子 |
|------------|------|--------|
| LearningCourse | 学習コース | course_id (UUID) |
| CourseModule | コースモジュール | module_id (UUID) |
| LearningProgress | 学習進捗 | progress_id (UUID) |
| Certification | 修了証明 | certification_id (UUID) |
| LearningPath | 学習経路 | path_id (UUID) |

**詳細**: [knowledge-management.md](knowledge-management.md), [learning-system.md](learning-system.md)

---

## 値オブジェクト一覧 {#value-objects}

### ナレッジ管理系

| 値オブジェクト | 説明 | 構成要素 |
|--------------|------|---------|
| ArticleMetadata | 記事メタデータ | author, created_at, updated_at, version |
| QualityScore | 品質スコア | accuracy, completeness, usefulness, overall |
| ContentFormat | コンテンツ形式 | format_type, mime_type, encoding |

### 学習システム系

| 値オブジェクト | 説明 | 構成要素 |
|--------------|------|---------|
| LearningObjective | 学習目標 | description, measurable_outcome, level |
| ProgressRate | 進捗率 | completed_count, total_count, percentage |
| AssessmentCriteria | 評価基準 | passing_score, max_score, weight |

**詳細**: [knowledge-management.md](knowledge-management.md#value-objects), [learning-system.md](learning-system.md#value-objects)

---

## ドメインイベント {#domain-events}

### ナレッジライフサイクルイベント

| イベント | 説明 | トリガー条件 |
|---------|------|------------|
| ArticleCreated | 記事作成 | 新規記事保存 |
| ArticlePublished | 記事公開 | レビュー承認後の公開 |
| ArticleUpdated | 記事更新 | 新バージョン作成 |
| ArticleArchived | 記事アーカイブ | 記事の無効化 |
| ReviewRequested | レビュー依頼 | レビュー申請 |
| ReviewCompleted | レビュー完了 | レビュー承認/却下 |

### 学習システムイベント

| イベント | 説明 | トリガー条件 |
|---------|------|------------|
| CourseEnrolled | コース登録 | 学習者の登録 |
| ModuleCompleted | モジュール完了 | モジュール完了 |
| AssessmentPassed | 評価合格 | 評価基準クリア |
| CourseCompleted | コース修了 | 全モジュール完了 |
| CertificationIssued | 証明書発行 | 修了判定 |

### 活用イベント

| イベント | 説明 | トリガー条件 |
|---------|------|------------|
| KnowledgeViewed | ナレッジ閲覧 | 記事アクセス |
| KnowledgeApplied | ナレッジ適用 | プロジェクトでの適用 |
| KnowledgeShared | ナレッジ共有 | 他者への共有 |
| BestPracticeAdopted | BP採用 | ベストプラクティス適用 |

**詳細**: [domain-services.md](domain-services.md#domain-events)

---

## ドメインサービス {#domain-services}

### 1. Knowledge Capture Service [ナレッジ捕捉サービス]

**責務**: プロジェクトからのナレッジ抽出と品質保証

**主要メソッド**:
- `extractFromProject(projectId)`: プロジェクトからナレッジ抽出
- `validateQuality(article)`: 品質検証
- `categorizeAutomatically(article)`: 自動分類

**詳細**: [domain-services.md](domain-services.md#knowledge-capture-service)

---

### 2. Knowledge Discovery Service [ナレッジ発見サービス]

**責務**: ナレッジ検索と推奨

**主要メソッド**:
- `searchKnowledge(query, filters)`: 全文検索
- `recommendKnowledge(userId, context)`: パーソナライズド推奨
- `findRelatedKnowledge(articleId)`: 関連ナレッジ検索
- `analyzeKnowledgeGaps(skillProfile)`: ナレッジギャップ分析

**詳細**: [domain-services.md](domain-services.md#knowledge-discovery-service)

---

### 3. Learning Path Designer [学習経路設計サービス]

**責務**: 個人別最適学習経路の設計

**主要メソッド**:
- `designLearningPath(userId, targetSkills)`: 学習経路設計
- `recommendNextCourse(userId)`: 次コース推奨
- `adjustPathBasedOnProgress(userId)`: 進捗に応じた経路調整

**詳細**: [domain-services.md](domain-services.md#learning-path-designer)

---

### 4. Knowledge Quality Assessor [ナレッジ品質評価サービス]

**責務**: ナレッジの品質評価と改善提案

**主要メソッド**:
- `assessQuality(article)`: 品質評価
- `calculateQualityScore(reviews, usage)`: 品質スコア計算
- `suggestImprovements(article)`: 改善提案

**詳細**: [domain-services.md](domain-services.md#knowledge-quality-assessor)

---

## ビジネスルール {#business-rules}

### ナレッジ公開ルール

1. **品質基準**:
   - 品質スコア3.0以上
   - 最低1名のレビュー承認
   - 必須項目（タイトル、カテゴリ、本文）入力済み

2. **バージョン管理**:
   - 公開済み記事の編集は新バージョンとして作成
   - 過去バージョンは保持（履歴追跡）
   - メジャー変更時はバージョン番号をインクリメント

3. **アクセス制御**:
   - 下書き: 作成者のみ閲覧・編集可能
   - レビュー中: レビュワーも閲覧可能
   - 公開: 全ユーザー閲覧可能（権限設定による制限可）

### 学習コース修了ルール

1. **修了条件**:
   - 全モジュール完了（100%）
   - 全評価で合格点（passing_score）以上
   - 必須課題の提出

2. **証明書発行条件**:
   - コース修了
   - 有効期限内（コースによって異なる）
   - 不正行為なし

3. **再受講ルール**:
   - 不合格の場合、1週間後に再受講可能
   - 証明書有効期限切れの場合、再受講必須
   - 進捗は新規受講時にリセット

### ベストプラクティス認定ルール

1. **認定基準**:
   - 最低3件の成功事例
   - 効果測定データあり
   - 専門家レビュー承認

2. **適用追跡**:
   - 適用時の記録必須
   - 効果測定の報告推奨
   - 失敗事例も記録（学習材料）

---

## 詳細ドキュメント {#detailed-docs}

BC-006ドメイン層の詳細は以下のドキュメントを参照してください:

1. **[knowledge-management.md](knowledge-management.md)** - ナレッジ管理の詳細
   - Knowledge Article Aggregate
   - Knowledge Category Aggregate
   - Best Practice Aggregate
   - 品質管理プロセス

2. **[learning-system.md](learning-system.md)** - 学習システムの詳細
   - Learning Course Aggregate
   - Learning Progress Aggregate
   - 学習経路設計
   - 修了証明システム

3. **[domain-services.md](domain-services.md)** - ドメインサービスの詳細
   - Knowledge Capture Service
   - Knowledge Discovery Service
   - Learning Path Designer
   - Quality Assessor

---

**最終更新**: 2025-11-03
**ステータス**: Phase 2.4 - BC-006 ドメイン層詳細化
