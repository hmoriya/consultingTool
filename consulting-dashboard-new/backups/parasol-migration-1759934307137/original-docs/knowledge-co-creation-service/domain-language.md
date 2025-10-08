# パラソルドメイン言語: ナレッジ共創サービス

**バージョン**: 1.2.0
**更新日**: 2024-12-30

## パラソルドメイン概要
組織の知識を蓄積・共有・活用し、新たな価値を創造するためのドメインモデル。DDD原則に基づき、明確な集約境界とステレオタイプマーキングにより、ナレッジ、エキスパート、学習、Q&Aの関係を体系的に定義。すべてのエンティティは適切な集約に所属し、ID参照による疎結合を実現。

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト
URL: URL形式
EMAIL: メールアドレス形式
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
DECIMAL: 小数点数値
INTEGER: 整数
BOOLEAN: 真偽値
ENUM: 列挙型
JSON: JSON形式データ
MARKDOWN: Markdown形式テキスト
FILE: ファイルバイナリ
```

### エンティティ定義

#### Knowledge（ナレッジ）<<entity>><<aggregate root>>
**概要**: 組織で共有すべき知識・ノウハウの集約ルート
**識別性**: knowledgeIdによって一意に識別される
**ライフサイクル**: 作成→レビュー→公開→アーカイブ
**集約所属**: KnowledgeAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| title | STRING_255 | ○ | タイトル |
| summary | TEXT | ○ | 要約 |
| content | MARKDOWN | ○ | 本文（Markdown形式） |
| category | ENUM | ○ | カテゴリ（Technical/Business/Process/Tool/Domain） |
| type | ENUM | ○ | タイプ（Article/FAQ/HowTo/BestPractice/LessonLearned） |
| authorId | UUID | ○ | 作成者ID |
| projectId | UUID | × | 関連プロジェクトID |
| tags | JSON | × | タグリスト |
| keywords | JSON | × | キーワードリスト |
| status | ENUM | ○ | ステータス（Draft/Review/Published/Archived） |
| visibility | ENUM | ○ | 公開範囲（Public/Internal/Restricted） |
| version | STRING_20 | ○ | バージョン |
| previousVersionId | UUID | × | 前バージョンID |
| viewCount | INTEGER | ○ | 閲覧数 |
| likeCount | INTEGER | ○ | いいね数 |
| publishedAt | TIMESTAMP | × | 公開日時 |
| expiresAt | DATE | × | 有効期限 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

**ビジネスルール**:
- タイトルは組織内で一意性を推奨
- ステータス遷移はDraft→Review→Published
- 有効期限切れは自動アーカイブ

#### Document（ドキュメント）<<entity>>
**概要**: ナレッジに関連する文書やファイル
**識別性**: documentIdによって一意に識別される
**ライフサイクル**: アップロード→検証→公開→アクセス管理
**集約所属**: KnowledgeAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| knowledgeId | UUID | × | 関連ナレッジID |
| name | STRING_255 | ○ | ファイル名 |
| description | TEXT | × | 説明 |
| fileType | ENUM | ○ | ファイルタイプ（PDF/Word/Excel/PPT/Image/Video/Other） |
| mimeType | STRING_100 | ○ | MIMEタイプ |
| size | INTEGER | ○ | ファイルサイズ（バイト） |
| url | URL | ○ | ファイルURL |
| checksum | STRING_100 | ○ | チェックサム |
| uploadedBy | UUID | ○ | アップロード者 |
| accessLevel | ENUM | ○ | アクセスレベル（Public/Internal/Confidential） |
| downloadCount | INTEGER | ○ | ダウンロード数 |
| lastAccessedAt | TIMESTAMP | × | 最終アクセス日時 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### BestPractice（ベストプラクティス）<<entity>><<aggregate root>>
**概要**: 実証された最良の実践方法の集約ルート
**識別性**: bestPracticeIdによって一意に識別される
**ライフサイクル**: 作成→検証→承認→公開→更新
**集約所属**: BestPracticeAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| title | STRING_255 | ○ | タイトル |
| description | TEXT | ○ | 説明 |
| context | TEXT | ○ | 適用コンテキスト |
| problem | TEXT | ○ | 解決した問題 |
| solution | TEXT | ○ | 解決方法 |
| benefits | JSON | ○ | 効果・メリット |
| implementation | TEXT | ○ | 実装方法 |
| prerequisites | JSON | × | 前提条件 |
| limitations | JSON | × | 制限事項 |
| alternativeApproaches | JSON | × | 代替アプローチ |
| category | ENUM | ○ | カテゴリ |
| industryId | UUID | × | 業界ID |
| projectIds | JSON | × | 適用プロジェクトID |
| validatedBy | UUID | × | 検証者ID |
| validatedAt | DATE | × | 検証日 |
| effectivenessScore | DECIMAL | × | 有効性スコア（1-10） |
| adoptionRate | PERCENTAGE | × | 採用率 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Expert（エキスパート）<<entity>><<aggregate root>>
**概要**: 特定分野の専門知識を持つ人材の集約ルート
**識別性**: expertIdによって一意に識別される
**ライフサイクル**: 登録→認定→活動→評価→更新
**集約所属**: ExpertAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| userId | UUID | ○ | ユーザーID |
| expertiseAreas | JSON | ○ | 専門分野リスト |
| yearsOfExperience | INTEGER | ○ | 経験年数 |
| certifications | JSON | × | 資格リスト |
| publications | JSON | × | 出版物リスト |
| projects | JSON | × | 関連プロジェクトリスト |
| bio | TEXT | × | プロフィール |
| availabilityStatus | ENUM | ○ | 相談可否（Available/Busy/Unavailable） |
| consultationRate | DECIMAL | × | コンサルテーション料率 |
| rating | DECIMAL | × | 評価（1-5） |
| reviewCount | INTEGER | ○ | レビュー数 |
| languages | JSON | × | 対応言語 |
| preferredContactMethod | ENUM | × | 希望連絡方法 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Question（質問）<<entity>><<aggregate root>>
**概要**: メンバーからの質問と回答管理の集約ルート
**識別性**: questionIdによって一意に識別される
**ライフサイクル**: 投稿→回答募集→回答→解決→クローズ
**集約所属**: QuestionAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| title | STRING_255 | ○ | 質問タイトル |
| content | TEXT | ○ | 質問内容 |
| askedBy | UUID | ○ | 質問者ID |
| category | ENUM | ○ | カテゴリ |
| tags | JSON | × | タグリスト |
| status | ENUM | ○ | ステータス（Open/Answered/Closed） |
| priority | ENUM | × | 優先度（High/Medium/Low） |
| viewCount | INTEGER | ○ | 閲覧数 |
| answerCount | INTEGER | ○ | 回答数 |
| acceptedAnswerId | UUID | × | 採用回答ID |
| relatedKnowledgeIds | JSON | × | 関連ナレッジID |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### Answer（回答）<<entity>>
**概要**: 質問に対する回答エンティティ
**識別性**: answerIdによって一意に識別される
**ライフサイクル**: 投稿→評価→採用/非採用
**集約所属**: QuestionAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| questionId | UUID | ○ | 質問ID |
| content | TEXT | ○ | 回答内容 |
| answeredBy | UUID | ○ | 回答者ID |
| isAccepted | BOOLEAN | ○ | 採用フラグ |
| voteCount | INTEGER | ○ | 投票数 |
| references | JSON | × | 参考資料リスト |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### LearningPath（学習パス）<<entity>><<aggregate root>>
**概要**: スキル習得のための体系的な学習経路の集約ルート
**識別性**: learningPathIdによって一意に識別される
**ライフサイクル**: 作成→承認→公開→実行→評価→改善
**集約所属**: LearningAggregate（集約ルート）
**ステレオタイプ**: entity, aggregate root

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| title | STRING_255 | ○ | タイトル |
| description | TEXT | ○ | 説明 |
| targetRole | STRING_100 | × | 対象役割 |
| targetLevel | ENUM | × | 対象レベル |
| estimatedDuration | INTEGER | ○ | 想定期間（日） |
| prerequisites | JSON | × | 前提条件 |
| objectives | JSON | ○ | 学習目標 |
| modules | JSON | ○ | モジュールリスト |
| assessmentCriteria | JSON | × | 評価基準 |
| createdBy | UUID | ○ | 作成者 |
| endorsedBy | JSON | × | 推薦者リスト |
| completionCount | INTEGER | ○ | 完了者数 |
| averageRating | DECIMAL | × | 平均評価 |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

#### KnowledgeShare（知識共有セッション）<<entity>>
**概要**: 知識共有のための会議やワークショップ
**識別性**: knowledgeShareIdによって一意に識別される
**ライフサイクル**: 企画→募集→開催→記録→フォローアップ
**集約所属**: LearningAggregate
**ステレオタイプ**: entity

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| id | UUID | ○ | 一意識別子 |
| title | STRING_255 | ○ | タイトル |
| description | TEXT | ○ | 説明 |
| type | ENUM | ○ | タイプ（Presentation/Workshop/Seminar/Discussion） |
| presenterId | UUID | ○ | 発表者ID |
| scheduledAt | TIMESTAMP | ○ | 開催予定日時 |
| duration | INTEGER | ○ | 所要時間（分） |
| location | STRING_100 | × | 開催場所 |
| isVirtual | BOOLEAN | ○ | オンライン開催フラグ |
| meetingUrl | URL | × | 会議URL |
| maxParticipants | INTEGER | × | 最大参加者数 |
| registeredCount | INTEGER | ○ | 登録者数 |
| attendedCount | INTEGER | × | 実際の参加者数 |
| recordingUrl | URL | × | 録画URL |
| materials | JSON | × | 資料リスト |
| feedback | JSON | × | フィードバック |
| createdAt | TIMESTAMP | ○ | 作成日時 |
| updatedAt | TIMESTAMP | ○ | 更新日時 |

### 値オブジェクト定義

#### KnowledgeRating（ナレッジ評価）<<value object>>
**概要**: ナレッジの有用性評価の値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| usefulness | DECIMAL | ○ | 有用性（1-5） |
| accuracy | DECIMAL | ○ | 正確性（1-5） |
| clarity | DECIMAL | ○ | 明確性（1-5） |
| overall | DECIMAL | ○ | 総合評価 |

#### SearchQuery（検索クエリ）<<value object>>
**概要**: ナレッジ検索の条件を表す値オブジェクト
**不変性**: 作成後は変更不可
**等価性**: 全属性の値で判定
**ステレオタイプ**: value object

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| keywords | STRING_255 | × | キーワード |
| category | ENUM | × | カテゴリ |
| tags | JSON | × | タグ |
| dateRange | JSON | × | 期間 |
| author | UUID | × | 作成者 |

### 集約定義

#### KnowledgeAggregate（ナレッジ集約）<<aggregate>>
**集約ルート**: Knowledge（ナレッジ）
**集約境界**: Knowledge（ナレッジ）、Document（ドキュメント）、KnowledgeRating（ナレッジ評価）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Knowledge（集約ルート・1対1）
- Document（1対多・ナレッジに関連する文書）

**包含値オブジェクト**:
- KnowledgeRating（評価情報）

**集約境界の理由**:
- ナレッジとその関連文書は密接に関連し、トランザクション整合性が必要
- ナレッジの評価は同じ集約内で管理される必要がある

**不変条件**:
- 公開済みナレッジの削除は論理削除のみ
- バージョン管理により過去版も保持
- 評価は1ユーザー1回まで
- 機密文書のアクセス制御は厳格に管理

**他集約との関係**:
- Expert集約とはexpertIdのみで参照（IDのみ参照）
- Project集約とはprojectIdのみで参照（IDのみ参照）

#### BestPracticeAggregate（ベストプラクティス集約）<<aggregate>>
**集約ルート**: BestPractice（ベストプラクティス）
**集約境界**: BestPractice（ベストプラクティス）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- BestPractice（集約ルート・1対1）

**集約境界の理由**:
- ベストプラクティスは独立したライフサイクルを持つ
- 検証と承認プロセスが必要で、単独での整合性管理が必要

**不変条件**:
- 検証済みのベストプラクティスのみが公開可能
- 有効性スコアは実証に基づいて設定
- 適用コンテキストと前提条件が明確に定義される

**他集約との関係**:
- Expert集約とはvalidatedByのみで参照（IDのみ参照）
- Project集約とはprojectIdsのみで参照（IDのみ参照）

#### ExpertAggregate（エキスパート集約）<<aggregate>>
**集約ルート**: Expert（エキスパート）
**集約境界**: Expert（エキスパート）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Expert（集約ルート・1対1）

**集約境界の理由**:
- エキスパート情報は独立した管理が必要
- 認定と評価プロセスは他のエンティティと独立している

**不変条件**:
- エキスパート認定には一定の基準を満たす
- 評価は実際のコンサルテーション後のみ
- 専門分野は実績に基づいて認定される

**他集約との関係**:
- User集約とはuserIdのみで参照（IDのみ参照）

#### QuestionAggregate（質問回答集約）<<aggregate>>
**集約ルート**: Question（質問）
**集約境界**: Question（質問）、Answer（回答）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- Question（集約ルート・1対1）
- Answer（1対多・質問に対する回答）

**集約境界の理由**:
- 質問と回答は密接に関連し、トランザクション整合性が必要
- 回答の採用決定は質問コンテキスト内で行われる

**不変条件**:
- 採用回答は質問ごとに1つまで
- 回答は質問のオープン状態でのみ可能
- 質問者のみが回答を採用可能

**他集約との関係**:
- User集約とはaskedBy、answeredByのみで参照（IDのみ参照）
- Knowledge集約とはrelatedKnowledgeIdsのみで参照（IDのみ参照）

#### LearningAggregate（学習集約）<<aggregate>>
**集約ルート**: LearningPath（学習パス）
**集約境界**: LearningPath（学習パス）、KnowledgeShare（知識共有セッション）
**ステレオタイプ**: aggregate

**包含エンティティ**:
- LearningPath（集約ルート・1対1）
- KnowledgeShare（1対多・学習パスに関連する共有セッション）

**集約境界の理由**:
- 学習パスと知識共有セッションは学習体験の提供という共通目的を持つ
- 学習進捗と成果管理は統合された管理が必要

**不変条件**:
- 学習パスの前提条件は明確に定義される
- 知識共有セッションは適切な準備と記録が必要
- 学習成果の評価は客観的基準に基づく

**他集約との関係**:
- User集約とはcreatedBy、presenterIdのみで参照（IDのみ参照）
- Expert集約とはendorsedByのみで参照（IDのみ参照）

### ドメインサービス

#### KnowledgeSearchService <<service>>
**概要**: 複数集約をまたぐナレッジ検索と推薦サービス
**責務**: Knowledge集約、Expert集約、BestPractice集約をまたいだ検索・推薦処理
**ステレオタイプ**: service

**操作**:
- `searchKnowledge(query: SearchQuery) -> Knowledge[]`: 複合条件でのナレッジ検索
- `recommendRelatedKnowledge(knowledgeId: UUID) -> Knowledge[]`: 関連ナレッジ推薦
- `findKnowledgeByExpert(expertId: UUID) -> Knowledge[]`: エキスパート作成ナレッジ検索
- `getTrendingKnowledge() -> Knowledge[]`: アクセス数・評価によるトレンド抽出
- `searchBestPractices(context: string) -> BestPractice[]`: コンテキスト別ベストプラクティス検索

#### KnowledgeSharingCoordinator <<service>>
**概要**: 知識共有プロセスの調整を行うドメインサービス
**責務**: Knowledge集約、Expert集約、Learning集約間の知識共有調整
**ステレオタイプ**: service

**操作**:
- `facilitateKnowledgeSharing(knowledgeId: UUID, targetAudience: string[]) -> ShareResult`: 知識共有の促進
- `organizeKnowledgeSession(sessionRequest: SessionRequest) -> KnowledgeShare`: セッション企画・調整
- `connectExpertWithQuestion(questionId: UUID, expertId: UUID) -> Connection`: エキスパートと質問者の接続
- `generateProjectInsights(projectId: UUID) -> Insights`: プロジェクト横断的な知見生成
- `validateBestPractice(practiceId: UUID, expertId: UUID) -> ValidationResult`: ベストプラクティス検証

#### LearningProgressService <<service>>
**概要**: 学習進捗と能力評価を管理するドメインサービス
**責務**: Learning集約、Expert集約、Knowledge集約をまたいだ学習管理
**ステレオタイプ**: service

**操作**:
- `createPersonalizedLearningPath(userId: UUID, requirements: LearningRequirements) -> LearningPath`: 個人化学習パス生成
- `trackLearningProgress(userId: UUID, pathId: UUID) -> LearningProgress`: 学習進捗追跡・更新
- `assessCompetencyLevel(userId: UUID, skillId: UUID) -> CompetencyAssessment`: コンピテンシーレベル評価
- `recommendNextLearning(userId: UUID) -> Recommendation[]`: 次の学習コンテンツ推薦
- `evaluateKnowledgeApplication(userId: UUID, knowledgeId: UUID) -> ApplicationResult`: 知識適用度評価

### ドメインイベント

#### KnowledgePublished <<event>>
**発生条件**: ナレッジが公開された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "knowledgeId": "UUID",
  "title": "STRING",
  "authorId": "UUID",
  "category": "ENUM",
  "tags": ["STRING"]
}
```

#### QuestionAsked <<event>>
**発生条件**: 新しい質問が投稿された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "questionId": "UUID",
  "title": "STRING",
  "askedBy": "UUID",
  "category": "ENUM"
}
```

#### ExpertIdentified <<event>>
**発生条件**: 新しいエキスパートが認定された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "expertId": "UUID",
  "userId": "UUID",
  "expertiseAreas": ["STRING"]
}
```

#### KnowledgeShareScheduled <<event>>
**発生条件**: 知識共有セッションが予定された時
**ステレオタイプ**: event
**ペイロード**:
```json
{
  "eventId": "UUID",
  "occurredAt": "TIMESTAMP",
  "sessionId": "UUID",
  "title": "STRING",
  "presenterId": "UUID",
  "scheduledAt": "TIMESTAMP"
}
```

### リポジトリインターフェース

#### KnowledgeRepository <<repository>>
**責務**: Knowledge集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface KnowledgeRepository {
  // 基本操作
  findById(id: UUID): Promise<Knowledge | null>
  findAll(limit?: number, offset?: number): Promise<Knowledge[]>
  save(knowledge: Knowledge): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByCategory(category: ENUM): Promise<Knowledge[]>
  findByTags(tags: STRING[]): Promise<Knowledge[]>
  findByAuthor(authorId: UUID): Promise<Knowledge[]>
  findByStatus(status: ENUM): Promise<Knowledge[]>
  search(query: SearchQuery): Promise<Knowledge[]>

  // 集約全体の保存
  saveWithDocuments(knowledge: Knowledge, documents: Document[]): Promise<void>
}
```

#### ExpertRepository <<repository>>
**責務**: Expert集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface ExpertRepository {
  // 基本操作
  findById(id: UUID): Promise<Expert | null>
  findAll(limit?: number, offset?: number): Promise<Expert[]>
  save(expert: Expert): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByExpertiseArea(area: STRING): Promise<Expert[]>
  findByUserId(userId: UUID): Promise<Expert | null>
  findAvailable(): Promise<Expert[]>
  findByRating(minRating: DECIMAL): Promise<Expert[]>
}
```

#### QuestionRepository <<repository>>
**責務**: Question集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface QuestionRepository {
  // 基本操作
  findById(id: UUID): Promise<Question | null>
  findAll(limit?: number, offset?: number): Promise<Question[]>
  save(question: Question): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findUnanswered(): Promise<Question[]>
  findByCategory(category: ENUM): Promise<Question[]>
  findByAsker(askerId: UUID): Promise<Question[]>
  findByStatus(status: ENUM): Promise<Question[]>

  // 集約全体の保存
  saveWithAnswers(question: Question, answers: Answer[]): Promise<void>
}
```

#### BestPracticeRepository <<repository>>
**責務**: BestPractice集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface BestPracticeRepository {
  // 基本操作
  findById(id: UUID): Promise<BestPractice | null>
  findAll(limit?: number, offset?: number): Promise<BestPractice[]>
  save(bestPractice: BestPractice): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByCategory(category: ENUM): Promise<BestPractice[]>
  findByContext(context: STRING): Promise<BestPractice[]>
  findValidated(): Promise<BestPractice[]>
  findByEffectivenessScore(minScore: DECIMAL): Promise<BestPractice[]>
}
```

#### LearningPathRepository <<repository>>
**責務**: LearningPath集約の永続化層抽象化
**ステレオタイプ**: repository

```typescript
interface LearningPathRepository {
  // 基本操作
  findById(id: UUID): Promise<LearningPath | null>
  findAll(limit?: number, offset?: number): Promise<LearningPath[]>
  save(learningPath: LearningPath): Promise<void>
  delete(id: UUID): Promise<void>

  // ドメイン固有の検索
  findByTargetRole(role: STRING): Promise<LearningPath[]>
  findByTargetLevel(level: ENUM): Promise<LearningPath[]>
  findByCreator(creatorId: UUID): Promise<LearningPath[]>
  findPopular(): Promise<LearningPath[]>

  // 集約全体の保存
  saveWithSessions(learningPath: LearningPath, sessions: KnowledgeShare[]): Promise<void>
}
```

## ビジネスルール

### ナレッジ管理ルール
1. **品質保証**: 公開前にレビュー必須
2. **更新頻度**: 年1回以上の見直し
3. **アクセス制御**: 機密情報は権限管理
4. **バージョン管理**: 重要変更は新バージョン作成

### エキスパート認定ルール
1. **認定基準**: 3年以上の経験または資格保有
2. **評価維持**: 年間5件以上の貢献
3. **更新頻度**: 年次でステータス見直し

### 学習管理ルール
1. **必須学習**: 役職別の必須コース設定
2. **進捗管理**: 月次で進捗レポート
3. **評価基準**: 80%以上で修了認定

### 共有促進ルール
1. **インセンティブ**: 貢献度に応じたポイント付与
2. **定期開催**: 月1回以上の共有セッション
3. **フィードバック**: 48時間以内の回答推奨

## サービス間連携

### 依存サービス
- **セキュアアクセスサービス**: ユーザー認証、アクセス制御
- **プロジェクト成功支援サービス**: プロジェクト情報、成果物
- **タレント最適化サービス**: スキル情報、エキスパート情報

### 提供インターフェース
- **ナレッジAPI**: 知識検索、取得
- **エキスパートAPI**: エキスパート検索、マッチング
- **学習API**: 学習コンテンツ、進捗情報

### イベント連携
- **KnowledgePublished**: 関係者へ通知
- **QuestionAsked**: エキスパートへ通知
- **LearningCompleted**: スキル管理サービスへ連携