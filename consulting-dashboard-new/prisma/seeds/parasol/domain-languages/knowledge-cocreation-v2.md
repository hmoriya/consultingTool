# パラソルドメイン言語: ナレッジ共創ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
組織の知的資産を体系的に蓄積・共有し、新たな知識を創造することで競争優位性を確立するドメイン

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING: 文字列（長さ制限なし）
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
PERCENTAGE: パーセンテージ（0-100）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
URL: URL形式（RFC3986準拠）
JSON: JSON形式のデータ
```

### カスタム型定義
```
記事ステータス: 記事の公開状態 (基本型: ENUM)
  - draft: 下書き
  - review: レビュー中
  - approved: 承認済み
  - published: 公開済み
  - archived: アーカイブ済み

記事カテゴリ: 記事の分類 (基本型: ENUM)
  - best_practice: ベストプラクティス
  - lesson_learned: 教訓・失敗事例
  - methodology: 方法論・フレームワーク
  - case_study: 事例研究
  - technical: 技術情報
  - industry: 業界知識

テンプレートタイプ: テンプレートの種類 (基本型: ENUM)
  - document: ドキュメント
  - presentation: プレゼンテーション
  - analysis: 分析フォーマット
  - proposal: 提案書
  - report: レポート

知識成熟度: 知識の確立度合い (基本型: ENUM)
  - experimental: 実験的
  - emerging: 新興
  - established: 確立済み
  - mature: 成熟
  - legacy: レガシー

共有範囲: 知識の公開範囲 (基本型: ENUM)
  - private: 個人限定
  - team: チーム内
  - project: プロジェクト内
  - organization: 組織全体
  - public: 一般公開

評価レート: 5段階評価 (基本型: ENUM)
  - one: 1（低い）
  - two: 2
  - three: 3
  - four: 4
  - five: 5（高い）
```

## エンティティ（Entities）

### ナレッジ記事 [Article] [ARTICLE]
説明: 知識やノウハウを記録した記事

属性:
- 記事ID [ArticleId] [ARTICLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 記事の一意識別子
- タイトル [Title] [TITLE]
  - 型: 記事タイトル [ArticleTitle] [ARTICLE_TITLE]（値オブジェクト）
  - 説明: 記事のタイトル
- 本文 [Content] [CONTENT]
  - 型: 記事本文 [ArticleContent] [ARTICLE_CONTENT]（値オブジェクト）
  - 説明: 記事の内容（Markdown形式）
- 著者リファレンス [AuthorRef] [AUTHOR_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 記事の著者
  - 関連: ユーザー [User] → ナレッジ記事 [Article]（1..*）
- カテゴリ [Category] [CATEGORY]
  - 型: 記事カテゴリ [ArticleCategory] [ARTICLE_CATEGORY]
  - 説明: 記事の分類
- タグ [Tags] [TAGS]
  - 型: タグセット [TagSet] [TAG_SET]（値オブジェクト）
  - 説明: 記事に付与されたタグ
- ステータス [Status] [STATUS]
  - 型: 記事ステータス [ArticleStatus] [ARTICLE_STATUS]
  - 説明: 記事の公開状態
- 共有範囲 [SharingScope] [SHARING_SCOPE]
  - 型: 共有範囲 [SharingScope] [SHARING_SCOPE]
  - 説明: 記事の公開範囲
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 関連プロジェクト（プロジェクト固有知識の場合）
  - 関連: プロジェクト [Project] → ナレッジ記事 [Article]（1..*）
- メタ情報 [MetaInfo] [META_INFO]
  - 型: 記事メタ情報 [ArticleMetaInfo] [ARTICLE_META_INFO]（値オブジェクト）
  - 説明: 記事のメタデータ
- 知識成熟度 [Maturity] [MATURITY]
  - 型: 知識成熟度 [KnowledgeMaturity] [KNOWLEDGE_MATURITY]
  - 説明: 知識の確立度合い
- レビュー履歴 [ReviewHistory] [REVIEW_HISTORY]
  - 型: レビュー履歴の配列 [ReviewRecord[]] [REVIEW_RECORD_ARRAY]（0..*）
  - 説明: 記事のレビュー記録
  - 関連: ナレッジ記事 [Article] *→ レビュー記録 [ReviewRecord]（集約内包含）
- 評価サマリー [RatingSummary] [RATING_SUMMARY]
  - 型: 評価サマリー [RatingSummary] [RATING_SUMMARY]（値オブジェクト）
  - 説明: 記事の評価統計
- 参照情報 [References] [REFERENCES]
  - 型: 参照情報 [References] [REFERENCES]（値オブジェクト）
  - 説明: 参考文献や関連リンク

不変条件:
- タイトルは組織内で一意
- 公開済み記事は削除不可（アーカイブのみ）
- レビュー承認後のみ公開可能

振る舞い:
- 記事公開 [PublishArticle] [PUBLISH_ARTICLE]
  - 目的: 記事を公開状態にする
  - 入力: なし
  - 出力: 公開結果
  - 事前条件: ステータス=承認済み
  - 事後条件: ステータス=公開済み、公開日時設定

#### ドメインイベント
- 記事作成済み [ArticleCreated] [ARTICLE_CREATED]：新規記事作成時
- 記事公開済み [ArticlePublished] [ARTICLE_PUBLISHED]：記事公開時

#### 集約ルート
このエンティティはナレッジ記事集約のルートエンティティ

### レビュー記録 [ReviewRecord] [REVIEW_RECORD]
説明: 記事のレビュー履歴

属性:
- レビューID [ReviewId] [REVIEW_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: レビューの一意識別子
- レビュアーリファレンス [ReviewerRef] [REVIEWER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: レビュー実施者
  - 関連: ユーザー [User] → レビュー記録 [ReviewRecord]（1..*）
- レビュー日時 [ReviewedAt] [REVIEWED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: レビュー実施日時
- 判定 [Decision] [DECISION]
  - 型: レビュー判定 [ReviewDecision] [REVIEW_DECISION]（値オブジェクト）
  - 説明: レビューの判定結果
- コメント [Comments] [COMMENTS]
  - 型: レビューコメント [ReviewComments] [REVIEW_COMMENTS]（値オブジェクト）
  - 説明: レビューコメント

### テンプレート [Template] [TEMPLATE]
説明: 再利用可能なドキュメントテンプレート

属性:
- テンプレートID [TemplateId] [TEMPLATE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: テンプレートの一意識別子
- 名称 [Name] [NAME]
  - 型: テンプレート名 [TemplateName] [TEMPLATE_NAME]（値オブジェクト）
  - 説明: テンプレートの名前
- 説明 [Description] [DESCRIPTION]
  - 型: テンプレート説明 [TemplateDescription] [TEMPLATE_DESCRIPTION]（値オブジェクト）
  - 説明: テンプレートの用途説明
- タイプ [Type] [TYPE]
  - 型: テンプレートタイプ [TemplateType] [TEMPLATE_TYPE]
  - 説明: テンプレートの種類
- テンプレート本体 [TemplateBody] [TEMPLATE_BODY]
  - 型: テンプレート内容 [TemplateContent] [TEMPLATE_CONTENT]（値オブジェクト）
  - 説明: テンプレートの実際の内容
- バージョン [Version] [VERSION]
  - 型: バージョン番号 [VersionNumber] [VERSION_NUMBER]（値オブジェクト）
  - 説明: テンプレートのバージョン
- カテゴリ [Category] [CATEGORY]
  - 型: テンプレートカテゴリ [TemplateCategory] [TEMPLATE_CATEGORY]（値オブジェクト）
  - 説明: テンプレートの分類
- 利用ガイド [UsageGuide] [USAGE_GUIDE]
  - 型: 利用ガイド [UsageGuide] [USAGE_GUIDE]（値オブジェクト）
  - 説明: テンプレートの使い方
- 利用統計 [UsageStats] [USAGE_STATS]
  - 型: 利用統計 [UsageStatistics] [USAGE_STATISTICS]（値オブジェクト）
  - 説明: テンプレートの利用状況
- メンテナーリファレンス [MaintainerRef] [MAINTAINER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: テンプレート管理者
  - 関連: ユーザー [User] → テンプレート [Template]（1..*）

不変条件:
- テンプレート名は一意
- 公開テンプレートは削除不可
- バージョンは順次増加

振る舞い:
- バージョンアップ [UpgradeVersion] [UPGRADE_VERSION]
  - 目的: 新しいバージョンを作成
  - 入力: 更新内容、変更理由
  - 出力: 新バージョン
  - 事前条件: メンテナー権限
  - 事後条件: 新バージョン作成、旧バージョン保持

### FAQ [FAQ] [FAQ]
説明: よくある質問と回答

属性:
- FAQ_ID [FaqId] [FAQ_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: FAQの一意識別子
- 質問 [Question] [QUESTION]
  - 型: FAQ質問 [FaqQuestion] [FAQ_QUESTION]（値オブジェクト）
  - 説明: 質問内容
- 回答 [Answer] [ANSWER]
  - 型: FAQ回答 [FaqAnswer] [FAQ_ANSWER]（値オブジェクト）
  - 説明: 回答内容
- カテゴリ [Category] [CATEGORY]
  - 型: FAQカテゴリ [FaqCategory] [FAQ_CATEGORY]（値オブジェクト）
  - 説明: FAQの分類
- タグ [Tags] [TAGS]
  - 型: タグセット [TagSet] [TAG_SET]（値オブジェクト）
  - 説明: 検索用タグ
- 参照回数 [ViewCount] [VIEW_COUNT]
  - 型: INTEGER [INTEGER] [INTEGER]
  - 説明: 参照された回数
- 有用性評価 [Usefulness] [USEFULNESS]
  - 型: 有用性評価 [UsefulnessRating] [USEFULNESS_RATING]（値オブジェクト）
  - 説明: ユーザーによる有用性評価
- 最終更新者リファレンス [LastUpdaterRef] [LAST_UPDATER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 最後に更新した人
  - 関連: ユーザー [User] → FAQ [FAQ]（1..*）
- 更新履歴 [UpdateHistory] [UPDATE_HISTORY]
  - 型: 更新履歴 [UpdateHistory] [UPDATE_HISTORY]（値オブジェクト）
  - 説明: FAQの変更履歴

### エキスパート [Expert] [EXPERT]
説明: 特定分野の専門家情報

属性:
- エキスパートID [ExpertId] [EXPERT_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: エキスパートの一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: エキスパートのユーザー
  - 関連: ユーザー [User] → エキスパート [Expert]（1..1）
- 専門分野 [Specialties] [SPECIALTIES]
  - 型: 専門分野リスト [SpecialtyList] [SPECIALTY_LIST]（値オブジェクト）
  - 説明: 専門とする分野のリスト
- 経歴サマリー [Biography] [BIOGRAPHY]
  - 型: 経歴情報 [BiographyInfo] [BIOGRAPHY_INFO]（値オブジェクト）
  - 説明: 専門家としての経歴
- 貢献実績 [Contributions] [CONTRIBUTIONS]
  - 型: 貢献実績 [ContributionRecord] [CONTRIBUTION_RECORD]（値オブジェクト）
  - 説明: ナレッジ貢献の実績
- 相談可能状態 [Availability] [AVAILABILITY]
  - 型: 相談可能状態 [AvailabilityStatus] [AVAILABILITY_STATUS]（値オブジェクト）
  - 説明: 相談受付の可否
- 評価 [Rating] [RATING]
  - 型: エキスパート評価 [ExpertRating] [EXPERT_RATING]（値オブジェクト）
  - 説明: 他のユーザーからの評価

### 記事評価 [ArticleRating] [ARTICLE_RATING]
説明: 記事に対するユーザー評価

属性:
- 評価ID [RatingId] [RATING_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 評価の一意識別子
- 記事リファレンス [ArticleRef] [ARTICLE_REF]
  - 型: 記事ID [ArticleId] [ARTICLE_ID]（参照）
  - 説明: 評価対象の記事
  - 関連: ナレッジ記事 [Article] → 記事評価 [ArticleRating]（1..*）
- 評価者リファレンス [RaterRef] [RATER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 評価したユーザー
  - 関連: ユーザー [User] → 記事評価 [ArticleRating]（1..*）
- 評価値 [Rating] [RATING]
  - 型: 評価レート [RatingRate] [RATING_RATE]
  - 説明: 5段階評価
- 評価コメント [Comment] [COMMENT]
  - 型: 評価コメント [RatingComment] [RATING_COMMENT]（値オブジェクト）
  - 説明: 評価の理由やフィードバック
- 評価日時 [RatedAt] [RATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: 評価した日時

### 記事コメント [ArticleComment] [ARTICLE_COMMENT]
説明: 記事へのコメントや議論

属性:
- コメントID [CommentId] [COMMENT_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: コメントの一意識別子
- 記事リファレンス [ArticleRef] [ARTICLE_REF]
  - 型: 記事ID [ArticleId] [ARTICLE_ID]（参照）
  - 説明: コメント対象の記事
  - 関連: ナレッジ記事 [Article] → 記事コメント [ArticleComment]（1..*）
- コメント者リファレンス [CommenterRef] [COMMENTER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: コメントしたユーザー
  - 関連: ユーザー [User] → 記事コメント [ArticleComment]（1..*）
- コメント内容 [Content] [CONTENT]
  - 型: コメント内容 [CommentContent] [COMMENT_CONTENT]（値オブジェクト）
  - 説明: コメントの内容
- 返信先リファレンス [ReplyToRef] [REPLY_TO_REF]
  - 型: コメントID [CommentId] [COMMENT_ID]（参照）
  - 説明: スレッド返信の場合の親コメント
  - 関連: 記事コメント [ArticleComment] → 記事コメント [ArticleComment]（0..1）
- 投稿日時 [PostedAt] [POSTED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: コメント投稿日時

## 値オブジェクト（Value Objects）

### 記事タイトル [ArticleTitle] [ARTICLE_TITLE]
- 定義: 記事の題名
- 属性:
  - タイトル [title] [TITLE]: STRING（3-200文字）
- 制約: 
  - 最小3文字、最大200文字
  - 特殊文字は使用不可
  - 空白のみは不可
- 使用エンティティ: ナレッジ記事 [Article]
- 例: 「プロジェクト成功のための10の鉄則」

### 記事本文 [ArticleContent] [ARTICLE_CONTENT]
- 定義: 記事の内容
- 属性:
  - 本文 [content] [CONTENT]: MARKDOWN
  - 文字数 [wordCount] [WORD_COUNT]: INTEGER（計算値）
  - 推定読了時間 [estimatedReadTime] [ESTIMATED_READ_TIME]: INTEGER（計算値、分）
- 制約: 
  - 最小100文字
  - 有効なMarkdown形式
- 使用エンティティ: ナレッジ記事 [Article]

### タグセット [TagSet] [TAG_SET]
- 定義: 記事やFAQに付与されるタグの集合
- 属性:
  - タグ [tags] [TAGS]: STRINGの配列（各タグ1-30文字）
- 制約: 
  - 最大10個
  - 各タグは英数字とハイフンのみ
  - 重複不可
- 使用エンティティ: ナレッジ記事 [Article]、FAQ [FAQ]
- 例: ["project-management", "agile", "best-practice"]

### 記事メタ情報 [ArticleMetaInfo] [ARTICLE_META_INFO]
- 定義: 記事のメタデータ
- 属性:
  - 作成日時 [createdAt] [CREATED_AT]: TIMESTAMP
  - 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
  - 公開日時 [publishedAt] [PUBLISHED_AT]: TIMESTAMP
  - 参照回数 [viewCount] [VIEW_COUNT]: INTEGER
  - 更新回数 [editCount] [EDIT_COUNT]: INTEGER
- 制約: 更新日時は作成日時より後
- 使用エンティティ: ナレッジ記事 [Article]

### レビュー判定 [ReviewDecision] [REVIEW_DECISION]
- 定義: レビューの判定結果
- 属性:
  - 判定 [decision] [DECISION]: STRING（approved/rejected/revision）
  - 理由 [reason] [REASON]: TEXT
- 制約: 判定は必須、却下時は理由必須
- 使用エンティティ: レビュー記録 [ReviewRecord]

### レビューコメント [ReviewComments] [REVIEW_COMMENTS]
- 定義: レビュー時のフィードバック
- 属性:
  - 全体コメント [overallComment] [OVERALL_COMMENT]: TEXT
  - 改善提案 [suggestions] [SUGGESTIONS]: TEXTの配列
  - 良い点 [strengths] [STRENGTHS]: TEXTの配列
- 制約: 最低1つのコメント必須
- 使用エンティティ: レビュー記録 [ReviewRecord]

### 評価サマリー [RatingSummary] [RATING_SUMMARY]
- 定義: 記事の評価統計
- 属性:
  - 平均評価 [averageRating] [AVERAGE_RATING]: DECIMAL（1.0-5.0）
  - 評価件数 [ratingCount] [RATING_COUNT]: INTEGER
  - 評価分布 [distribution] [DISTRIBUTION]: INTEGERの配列（1-5の件数）
- 制約: 評価がない場合はnull
- 使用エンティティ: ナレッジ記事 [Article]

### 参照情報 [References] [REFERENCES]
- 定義: 参考文献や関連リンク
- 属性:
  - 内部リンク [internalLinks] [INTERNAL_LINKS]: 記事IDの配列
  - 外部リンク [externalLinks] [EXTERNAL_LINKS]: URLの配列
  - 参考文献 [bibliography] [BIBLIOGRAPHY]: TEXTの配列
- 制約: 合計50件まで
- 使用エンティティ: ナレッジ記事 [Article]

### テンプレート名 [TemplateName] [TEMPLATE_NAME]
- 定義: テンプレートの名称
- 属性:
  - 名前 [name] [NAME]: STRING（3-100文字）
- 制約: 
  - 組織内で一意
  - 英数字、日本語、ハイフン、アンダースコアのみ
- 使用エンティティ: テンプレート [Template]
- 例: 「プロジェクト提案書_標準版」

### テンプレート説明 [TemplateDescription] [TEMPLATE_DESCRIPTION]
- 定義: テンプレートの用途説明
- 属性:
  - 説明 [description] [DESCRIPTION]: TEXT（10-1000文字）
  - 用途 [usage] [USAGE]: TEXTの配列
  - 対象者 [targetUsers] [TARGET_USERS]: STRINGの配列
- 制約: 説明は必須
- 使用エンティティ: テンプレート [Template]

### テンプレート内容 [TemplateContent] [TEMPLATE_CONTENT]
- 定義: テンプレートの実際の内容
- 属性:
  - 構造 [structure] [STRUCTURE]: JSON（セクション構成）
  - プレースホルダー [placeholders] [PLACEHOLDERS]: JSON（置換可能な変数）
  - サンプルデータ [sampleData] [SAMPLE_DATA]: JSON
- 制約: 有効なJSON形式
- 使用エンティティ: テンプレート [Template]

### バージョン番号 [VersionNumber] [VERSION_NUMBER]
- 定義: セマンティックバージョニング
- 属性:
  - メジャー [major] [MAJOR]: INTEGER
  - マイナー [minor] [MINOR]: INTEGER
  - パッチ [patch] [PATCH]: INTEGER
- 制約: 各値は0以上
- 使用エンティティ: テンプレート [Template]
- 例: 2.1.0

### テンプレートカテゴリ [TemplateCategory] [TEMPLATE_CATEGORY]
- 定義: テンプレートの分類
- 属性:
  - メインカテゴリ [mainCategory] [MAIN_CATEGORY]: STRING
  - サブカテゴリ [subCategory] [SUB_CATEGORY]: STRING
- 制約: メインカテゴリは必須
- 使用エンティティ: テンプレート [Template]

### 利用ガイド [UsageGuide] [USAGE_GUIDE]
- 定義: テンプレートの使い方説明
- 属性:
  - 概要 [overview] [OVERVIEW]: TEXT
  - 手順 [steps] [STEPS]: TEXTの配列
  - 注意事項 [cautions] [CAUTIONS]: TEXTの配列
  - サンプル [examples] [EXAMPLES]: TEXTの配列
- 制約: 概要と手順は必須
- 使用エンティティ: テンプレート [Template]

### 利用統計 [UsageStatistics] [USAGE_STATISTICS]
- 定義: テンプレートの利用状況
- 属性:
  - 利用回数 [usageCount] [USAGE_COUNT]: INTEGER
  - 最終利用日 [lastUsedAt] [LAST_USED_AT]: DATE
  - 利用者数 [userCount] [USER_COUNT]: INTEGER
  - 満足度 [satisfactionRate] [SATISFACTION_RATE]: PERCENTAGE
- 制約: 各値は0以上
- 使用エンティティ: テンプレート [Template]

### FAQ質問 [FaqQuestion] [FAQ_QUESTION]
- 定義: よくある質問
- 属性:
  - 質問文 [question] [QUESTION]: TEXT（10-500文字）
  - キーワード [keywords] [KEYWORDS]: STRINGの配列
- 制約: 質問文は疑問形
- 使用エンティティ: FAQ [FAQ]

### FAQ回答 [FaqAnswer] [FAQ_ANSWER]
- 定義: FAQへの回答
- 属性:
  - 回答文 [answer] [ANSWER]: MARKDOWN
  - 関連リンク [relatedLinks] [RELATED_LINKS]: URLの配列
  - 更新日 [updatedAt] [UPDATED_AT]: DATE
- 制約: 回答は100文字以上
- 使用エンティティ: FAQ [FAQ]

### FAQカテゴリ [FaqCategory] [FAQ_CATEGORY]
- 定義: FAQの分類
- 属性:
  - カテゴリ名 [categoryName] [CATEGORY_NAME]: STRING（階層構造）
  - 表示順序 [displayOrder] [DISPLAY_ORDER]: INTEGER
- 制約: カテゴリ名は階層を/で区切る
- 使用エンティティ: FAQ [FAQ]
- 例: 「プロジェクト管理/スケジュール」

### 有用性評価 [UsefulnessRating] [USEFULNESS_RATING]
- 定義: FAQの有用性評価
- 属性:
  - 役立った数 [helpfulCount] [HELPFUL_COUNT]: INTEGER
  - 役立たなかった数 [notHelpfulCount] [NOT_HELPFUL_COUNT]: INTEGER
  - 有用性スコア [usefulnessScore] [USEFULNESS_SCORE]: PERCENTAGE（計算値）
- 制約: 各カウントは0以上
- 使用エンティティ: FAQ [FAQ]

### 更新履歴 [UpdateHistory] [UPDATE_HISTORY]
- 定義: FAQの変更履歴
- 属性:
  - 更新日時 [updatedAt] [UPDATED_AT]: TIMESTAMP
  - 更新者 [updater] [UPDATER]: STRING
  - 変更内容 [changes] [CHANGES]: TEXT
- 制約: 最新10件を保持
- 使用エンティティ: FAQ [FAQ]

### 専門分野リスト [SpecialtyList] [SPECIALTY_LIST]
- 定義: エキスパートの専門分野
- 属性:
  - 専門分野 [specialties] [SPECIALTIES]: STRINGの配列
  - 主要分野 [primarySpecialty] [PRIMARY_SPECIALTY]: STRING
  - 経験年数 [yearsOfExperience] [YEARS_OF_EXPERIENCE]: INTEGER（分野別）
- 制約: 最低1つ、最大5つの専門分野
- 使用エンティティ: エキスパート [Expert]

### 経歴情報 [BiographyInfo] [BIOGRAPHY_INFO]
- 定義: エキスパートの経歴
- 属性:
  - 概要 [summary] [SUMMARY]: TEXT（100-1000文字）
  - 主要実績 [achievements] [ACHIEVEMENTS]: TEXTの配列
  - 資格認定 [certifications] [CERTIFICATIONS]: STRINGの配列
- 制約: 概要は必須
- 使用エンティティ: エキスパート [Expert]

### 貢献実績 [ContributionRecord] [CONTRIBUTION_RECORD]
- 定義: ナレッジ貢献の実績
- 属性:
  - 記事数 [articleCount] [ARTICLE_COUNT]: INTEGER
  - 総評価 [totalRating] [TOTAL_RATING]: DECIMAL
  - 回答数 [answerCount] [ANSWER_COUNT]: INTEGER
  - 採用率 [adoptionRate] [ADOPTION_RATE]: PERCENTAGE
- 制約: 各値は0以上
- 使用エンティティ: エキスパート [Expert]

### 相談可能状態 [AvailabilityStatus] [AVAILABILITY_STATUS]
- 定義: エキスパートの相談受付状態
- 属性:
  - 受付可能 [isAvailable] [IS_AVAILABLE]: BOOLEAN
  - 対応可能時間 [availableHours] [AVAILABLE_HOURS]: STRINGの配列
  - 休止期間 [unavailablePeriod] [UNAVAILABLE_PERIOD]: DATE範囲
- 制約: 対応可能時間は営業時間内
- 使用エンティティ: エキスパート [Expert]

### エキスパート評価 [ExpertRating] [EXPERT_RATING]
- 定義: エキスパートへの評価
- 属性:
  - 平均評価 [averageRating] [AVERAGE_RATING]: DECIMAL（1.0-5.0）
  - 評価件数 [ratingCount] [RATING_COUNT]: INTEGER
  - 専門性評価 [expertiseRating] [EXPERTISE_RATING]: DECIMAL
  - 対応評価 [responsivenessRating] [RESPONSIVENESS_RATING]: DECIMAL
- 制約: 評価は1.0-5.0の範囲
- 使用エンティティ: エキスパート [Expert]

### 評価コメント [RatingComment] [RATING_COMMENT]
- 定義: 記事評価時のコメント
- 属性:
  - コメント [comment] [COMMENT]: TEXT（0-1000文字）
- 制約: 評価が3以下の場合はコメント必須
- 使用エンティティ: 記事評価 [ArticleRating]

### コメント内容 [CommentContent] [COMMENT_CONTENT]
- 定義: 記事へのコメント
- 属性:
  - 本文 [content] [CONTENT]: MARKDOWN（1-2000文字）
  - 編集済み [isEdited] [IS_EDITED]: BOOLEAN
  - 編集日時 [editedAt] [EDITED_AT]: TIMESTAMP
- 制約: 最低1文字、編集は投稿から24時間以内
- 使用エンティティ: 記事コメント [ArticleComment]

## 集約（Aggregates）

### ナレッジ記事集約 [ArticleAggregate] [ARTICLE_AGGREGATE]
- **集約ルート**: ナレッジ記事 [Article]
- **含まれるエンティティ**: 
  - レビュー記録 [ReviewRecord]：レビュー履歴（0..*）
- **含まれる値オブジェクト**:
  - 記事タイトル [ArticleTitle]：タイトルとして使用
  - 記事本文 [ArticleContent]：本文として使用
  - タグセット [TagSet]：タグとして使用
  - 記事メタ情報 [ArticleMetaInfo]：メタデータとして使用
  - 評価サマリー [RatingSummary]：評価統計として使用
  - 参照情報 [References]：参考情報として使用
  - レビュー判定 [ReviewDecision]：レビュー結果として使用
  - レビューコメント [ReviewComments]：レビューフィードバックとして使用
- **トランザクション境界**: 記事とレビュー記録は同一トランザクション
- **不変条件**: 
  - 公開済み記事は削除不可
  - レビュー承認後のみ公開可能
  - タイトルは組織内で一意
- **外部参照ルール**:
  - 集約外からは記事IDのみで参照
  - レビュー記録への直接アクセスは禁止

### テンプレート集約 [TemplateAggregate] [TEMPLATE_AGGREGATE]
- **集約ルート**: テンプレート [Template]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - テンプレート名 [TemplateName]：名称として使用
  - テンプレート説明 [TemplateDescription]：説明として使用
  - テンプレート内容 [TemplateContent]：本体として使用
  - バージョン番号 [VersionNumber]：バージョン管理
  - テンプレートカテゴリ [TemplateCategory]：分類として使用
  - 利用ガイド [UsageGuide]：使い方として使用
  - 利用統計 [UsageStatistics]：利用状況として使用
- **トランザクション境界**: テンプレート単独で完結
- **不変条件**: 
  - テンプレート名は一意
  - バージョンは順次増加
  - 公開テンプレートは削除不可
- **外部参照ルール**:
  - テンプレートIDで参照

### FAQ集約 [FaqAggregate] [FAQ_AGGREGATE]
- **集約ルート**: FAQ [FAQ]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - FAQ質問 [FaqQuestion]：質問として使用
  - FAQ回答 [FaqAnswer]：回答として使用
  - FAQカテゴリ [FaqCategory]：分類として使用
  - タグセット [TagSet]：検索用タグとして使用
  - 有用性評価 [UsefulnessRating]：評価として使用
  - 更新履歴 [UpdateHistory]：変更履歴として使用
- **トランザクション境界**: FAQ単独で完結
- **不変条件**: 
  - 質問は一意
  - 回答は必須
- **外部参照ルール**:
  - FAQのIDで参照

### エキスパート集約 [ExpertAggregate] [EXPERT_AGGREGATE]
- **集約ルート**: エキスパート [Expert]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 専門分野リスト [SpecialtyList]：専門分野として使用
  - 経歴情報 [BiographyInfo]：経歴として使用
  - 貢献実績 [ContributionRecord]：実績として使用
  - 相談可能状態 [AvailabilityStatus]：受付状態として使用
  - エキスパート評価 [ExpertRating]：評価として使用
- **トランザクション境界**: エキスパート単独で完結
- **不変条件**: 
  - ユーザーとエキスパートは1対1
  - 最低1つの専門分野必須
- **外部参照ルール**:
  - エキスパートIDまたはユーザーIDで参照

### 記事評価集約 [ArticleRatingAggregate] [ARTICLE_RATING_AGGREGATE]
- **集約ルート**: 記事評価 [ArticleRating]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 評価コメント [RatingComment]：コメントとして使用
- **トランザクション境界**: 記事評価単独で完結
- **不変条件**: 
  - 1ユーザー1記事1評価
  - 評価後の変更は24時間以内
- **外部参照ルール**:
  - 記事IDとユーザーIDを参照

### 記事コメント集約 [ArticleCommentAggregate] [ARTICLE_COMMENT_AGGREGATE]
- **集約ルート**: 記事コメント [ArticleComment]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - コメント内容 [CommentContent]：内容として使用
- **トランザクション境界**: コメント単独で完結
- **不変条件**: 
  - スレッドは1階層まで
  - 編集は24時間以内
- **外部参照ルール**:
  - 記事IDとユーザーIDを参照
  - 返信の場合は親コメントIDも参照

## ドメインサービス

### ナレッジ検索サービス [KnowledgeSearchService] [KNOWLEDGE_SEARCH_SERVICE]
ナレッジを高度に検索するサービス

#### 提供機能
- 全文検索 [FullTextSearch] [FULL_TEXT_SEARCH]
  - 目的: キーワードから関連ナレッジを検索
  - 入力: 検索キーワード、フィルター条件
  - 出力: ナレッジリスト（関連度順）
  - 制約: アクセス権限のあるものみ

- 類似記事検索 [FindSimilarArticles] [FIND_SIMILAR_ARTICLES]
  - 目的: 内容が類似した記事を発見
  - 入力: 基準記事ID
  - 出力: 類似記事リスト（類似度順）
  - 制約: 同一カテゴリ優先

- エキスパート検索 [FindExperts] [FIND_EXPERTS]
  - 目的: 特定分野のエキスパートを発見
  - 入力: 専門分野、キーワード
  - 出力: エキスパートリスト（マッチ度順）
  - 制約: 相談可能な人を優先

### ナレッジ推薦サービス [KnowledgeRecommendationService] [KNOWLEDGE_RECOMMENDATION_SERVICE]
パーソナライズされたナレッジを推薦するサービス

#### 提供機能
- 個人推薦 [PersonalRecommendation] [PERSONAL_RECOMMENDATION]
  - 目的: ユーザーの興味に基づく推薦
  - 入力: ユーザーID
  - 出力: 推薦記事リスト
  - 制約: 未読優先、最新情報重視

- プロジェクト推薦 [ProjectRecommendation] [PROJECT_RECOMMENDATION]
  - 目的: プロジェクトに有用なナレッジ推薦
  - 入力: プロジェクトID
  - 出力: 関連ナレッジリスト
  - 制約: プロジェクト特性を考慮

### ナレッジ分析サービス [KnowledgeAnalyticsService] [KNOWLEDGE_ANALYTICS_SERVICE]
ナレッジの利用状況を分析するサービス

#### 提供機能
- 利用分析 [AnalyzeUsage] [ANALYZE_USAGE]
  - 目的: ナレッジの利用状況を分析
  - 入力: 期間、対象範囲
  - 出力: 利用統計レポート
  - 制約: 月次・四半期・年次

- ギャップ分析 [AnalyzeGaps] [ANALYZE_GAPS]
  - 目的: 不足している知識領域を特定
  - 入力: カテゴリ、検索ログ
  - 出力: ギャップレポート
  - 制約: 検索失敗率を考慮

## ドメインイベント

### 記事作成済み [ArticleCreated] [ARTICLE_CREATED]
- **発生タイミング**: 新しい記事が作成された時
- **ペイロード**: 
  - 記事ID [articleId]: UUID
  - タイトル [title]: STRING
  - 著者ID [authorId]: UUID
  - カテゴリ [category]: 記事カテゴリ

### 記事公開済み [ArticlePublished] [ARTICLE_PUBLISHED]
- **発生タイミング**: 記事が公開された時
- **ペイロード**: 
  - 記事ID [articleId]: UUID
  - 公開日時 [publishedAt]: TIMESTAMP
  - 共有範囲 [sharingScope]: 共有範囲

### テンプレート作成済み [TemplateCreated] [TEMPLATE_CREATED]
- **発生タイミング**: 新しいテンプレートが作成された時
- **ペイロード**: 
  - テンプレートID [templateId]: UUID
  - 名称 [name]: STRING
  - タイプ [type]: テンプレートタイプ

### FAQ更新済み [FaqUpdated] [FAQ_UPDATED]
- **発生タイミング**: FAQが更新された時
- **ペイロード**: 
  - FAQ_ID [faqId]: UUID
  - 更新者ID [updaterId]: UUID
  - 更新内容 [changes]: STRING

### エキスパート登録済み [ExpertRegistered] [EXPERT_REGISTERED]
- **発生タイミング**: エキスパートが登録された時
- **ペイロード**: 
  - エキスパートID [expertId]: UUID
  - 専門分野 [specialties]: STRINGの配列

### 高評価記事 [HighlyRatedArticle] [HIGHLY_RATED_ARTICLE]
- **発生タイミング**: 記事が高評価（平均4.5以上）を獲得した時
- **ペイロード**: 
  - 記事ID [articleId]: UUID
  - 平均評価 [averageRating]: DECIMAL
  - 評価件数 [ratingCount]: INTEGER

## ビジネスルール

### 記事管理ルール
1. **記事の品質基準**: 
   - 最低1000文字
   - 構造化された見出し
   - 実例・図表の推奨
2. **レビュープロセス**: 
   - 新規記事は必ずレビュー
   - 2名以上のレビュアー
   - 72時間以内にレビュー完了
3. **公開ルール**: 
   - 承認後24時間以内に公開
   - 公開後の大幅変更は再レビュー
   - 年1回の定期見直し

### テンプレート管理ルール
1. **バージョニング**: 
   - セマンティックバージョニング準拠
   - 後方互換性の維持
   - 変更履歴の記録
2. **品質保証**: 
   - サンプルデータ必須
   - 利用ガイド必須
   - ユーザーテスト実施
3. **ライフサイクル**: 
   - 6ヶ月未使用で見直し
   - 1年未使用でアーカイブ検討

### FAQ管理ルール
1. **重複チェック**: 
   - 類似質問の統合
   - カテゴリ内での一意性
2. **更新頻度**: 
   - 四半期ごとの見直し
   - 有用性評価に基づく改善
3. **エスカレーション**: 
   - 解決率50%未満はエキスパート相談

### エキスパート認定ルール
1. **認定基準**: 
   - 3年以上の実務経験
   - 5件以上の記事執筆
   - 平均評価4.0以上
2. **維持条件**: 
   - 年5件以上の貢献
   - 評価4.0以上維持
   - 定期的な知識更新
3. **相談対応**: 
   - 48時間以内の初回返答
   - 月10件まで

### エラーパターン
- 5001: 記事重複エラー
- 5002: レビュー権限エラー
- 5003: テンプレートバージョンエラー
- 5004: FAQ重複エラー
- 5005: エキスパート認定基準エラー

## リポジトリインターフェース

### ナレッジ記事リポジトリ [ArticleRepository] [ARTICLE_REPOSITORY]
集約: ナレッジ記事集約 [ArticleAggregate]

基本操作:
- findById(id: UUID): ナレッジ記事 [Article]
- save(article: ナレッジ記事): void
- delete(id: UUID): void

検索操作:
- findByTitle(title: STRING): ナレッジ記事
- findByCategory(category: 記事カテゴリ): ナレッジ記事[]
- findByAuthor(authorId: UUID): ナレッジ記事[]
- findPublishedArticles(): ナレッジ記事[]
- searchByKeyword(keyword: STRING): ナレッジ記事[]

### テンプレートリポジトリ [TemplateRepository] [TEMPLATE_REPOSITORY]
集約: テンプレート集約 [TemplateAggregate]

基本操作:
- findById(id: UUID): テンプレート [Template]
- save(template: テンプレート): void

検索操作:
- findByName(name: STRING): テンプレート
- findByType(type: テンプレートタイプ): テンプレート[]
- findByCategory(category: STRING): テンプレート[]
- findMostUsed(limit: INTEGER): テンプレート[]

### FAQリポジトリ [FaqRepository] [FAQ_REPOSITORY]
集約: FAQ集約 [FaqAggregate]

基本操作:
- findById(id: UUID): FAQ [FAQ]
- save(faq: FAQ): void

検索操作:
- searchByQuestion(keyword: STRING): FAQ[]
- findByCategory(category: STRING): FAQ[]
- findMostViewed(limit: INTEGER): FAQ[]
- findLeastHelpful(threshold: PERCENTAGE): FAQ[]

### エキスパートリポジトリ [ExpertRepository] [EXPERT_REPOSITORY]
集約: エキスパート集約 [ExpertAggregate]

基本操作:
- findById(id: UUID): エキスパート [Expert]
- save(expert: エキスパート): void

検索操作:
- findByUserId(userId: UUID): エキスパート
- findBySpecialty(specialty: STRING): エキスパート[]
- findAvailableExperts(): エキスパート[]
- findTopRated(limit: INTEGER): エキスパート[]

### 記事評価リポジトリ [ArticleRatingRepository] [ARTICLE_RATING_REPOSITORY]
集約: 記事評価集約 [ArticleRatingAggregate]

基本操作:
- findById(id: UUID): 記事評価 [ArticleRating]
- save(rating: 記事評価): void

検索操作:
- findByArticleId(articleId: UUID): 記事評価[]
- findByUserId(userId: UUID): 記事評価[]
- findByArticleAndUser(articleId: UUID, userId: UUID): 記事評価

### 記事コメントリポジトリ [ArticleCommentRepository] [ARTICLE_COMMENT_REPOSITORY]
集約: 記事コメント集約 [ArticleCommentAggregate]

基本操作:
- findById(id: UUID): 記事コメント [ArticleComment]
- save(comment: 記事コメント): void

検索操作:
- findByArticleId(articleId: UUID): 記事コメント[]
- findByUserId(userId: UUID): 記事コメント[]
- findThreadComments(parentId: UUID): 記事コメント[]

## DDDパターンチェックリスト

### エンティティ
- [x] 一意識別子を持つ
- [x] ライフサイクルを持つ
- [x] ビジネスロジックを含む
- [x] 必ず何らかの集約に属している

### 値オブジェクト
- [x] 不変性を保つ
- [x] 識別子を持たない
- [x] 等価性で比較される
- [x] 使用エンティティが明確
- [x] ビジネス的な意味を持つ（STRING_100などの技術的な型ではない）

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] すべてのエンティティを包含している
- [x] 外部からのアクセスは集約ルート経由のみ