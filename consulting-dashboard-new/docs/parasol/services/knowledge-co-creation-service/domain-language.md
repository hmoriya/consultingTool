# パラソルドメイン言語: ナレッジ共創サービス

**バージョン**: 1.0.0
**更新日**: 2024-01-20

## パラソルドメイン概要
組織の知識を蓄積・共有・活用し、新たな価値を創造するためのドメインモデル。ナレッジ、ドキュメント、ベストプラクティス、エキスパート、学習の関係を定義。

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

#### Knowledge（ナレッジ）
**概要**: 組織で共有すべき知識・ノウハウ
**識別子**: knowledgeId

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

#### Document（ドキュメント）
**概要**: ナレッジに関連する文書やファイル
**識別子**: documentId

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

#### BestPractice（ベストプラクティス）
**概要**: 実証された最良の実践方法
**識別子**: bestPracticeId

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

#### Expert（エキスパート）
**概要**: 特定分野の専門知識を持つ人材
**識別子**: expertId

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

#### Question（質問）
**概要**: メンバーからの質問と回答
**識別子**: questionId

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

#### Answer（回答）
**概要**: 質問に対する回答
**識別子**: answerId

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

#### LearningPath（学習パス）
**概要**: スキル習得のための体系的な学習経路
**識別子**: learningPathId

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

#### KnowledgeShare（知識共有セッション）
**概要**: 知識共有のための会議やワークショップ
**識別子**: knowledgeShareId

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

#### KnowledgeRating（ナレッジ評価）
**概要**: ナレッジの有用性評価

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| usefulness | DECIMAL | ○ | 有用性（1-5） |
| accuracy | DECIMAL | ○ | 正確性（1-5） |
| clarity | DECIMAL | ○ | 明確性（1-5） |
| overall | DECIMAL | ○ | 総合評価 |

#### SearchQuery（検索クエリ）
**概要**: ナレッジ検索の条件

| 属性名 | 型 | 必須 | 説明 |
|--------|----|----|------|
| keywords | STRING_255 | × | キーワード |
| category | ENUM | × | カテゴリ |
| tags | JSON | × | タグ |
| dateRange | JSON | × | 期間 |
| author | UUID | × | 作成者 |

### 集約定義

#### KnowledgeAggregate
**集約ルート**: Knowledge
**境界**: Knowledge, Document, KnowledgeRating

**不変条件**:
- 公開済みナレッジの削除は論理削除のみ
- バージョン管理により過去版も保持
- 評価は1ユーザー1回まで

#### ExpertiseAggregate
**集約ルート**: Expert
**境界**: Expert, ExpertiseArea, Consultation

**不変条件**:
- エキスパート認定には一定の基準を満たす
- 評価は実際のコンサルテーション後のみ

### ドメインサービス

#### KnowledgeSearchService
**概要**: ナレッジの検索と推薦
**操作**:
- `search(query) -> Knowledge[]`: キーワード検索
- `recommendRelated(knowledgeId) -> Knowledge[]`: 関連ナレッジ推薦
- `findByExpert(expertId) -> Knowledge[]`: エキスパート別検索
- `getTrending() -> Knowledge[]`: トレンドナレッジ取得

#### KnowledgeSharingService
**概要**: 知識共有の促進
**操作**:
- `shareKnowledge(knowledge, targetAudience) -> ShareResult`: 知識共有
- `organizeSession(session) -> KnowledgeShare`: セッション企画
- `connectWithExpert(questionId, expertId) -> Connection`: エキスパート接続
- `generateInsights(projectId) -> Insights`: プロジェクト知見生成

#### LearningManagementService
**概要**: 学習管理と進捗追跡
**操作**:
- `createLearningPath(requirements) -> LearningPath`: 学習パス生成
- `trackProgress(userId, pathId) -> Progress`: 進捗追跡
- `assessCompetency(userId, skillId) -> Assessment`: コンピテンシー評価
- `recommendLearning(userId) -> Recommendation[]`: 学習推奨

### ドメインイベント

#### KnowledgePublished
**発生条件**: ナレッジが公開された時
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

#### QuestionAsked
**発生条件**: 新しい質問が投稿された時
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

#### ExpertIdentified
**発生条件**: 新しいエキスパートが認定された時
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

#### KnowledgeShareScheduled
**発生条件**: 知識共有セッションが予定された時
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

#### KnowledgeRepository
```
interface KnowledgeRepository {
  findById(id: UUID): Knowledge | null
  findByCategory(category: ENUM): Knowledge[]
  findByTags(tags: STRING[]): Knowledge[]
  findByAuthor(authorId: UUID): Knowledge[]
  search(query: SearchQuery): Knowledge[]
  save(knowledge: Knowledge): void
  delete(id: UUID): void
}
```

#### ExpertRepository
```
interface ExpertRepository {
  findById(id: UUID): Expert | null
  findByExpertiseArea(area: STRING): Expert[]
  findAvailable(): Expert[]
  save(expert: Expert): void
}
```

#### QuestionRepository
```
interface QuestionRepository {
  findById(id: UUID): Question | null
  findUnanswered(): Question[]
  findByCategory(category: ENUM): Question[]
  save(question: Question): void
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