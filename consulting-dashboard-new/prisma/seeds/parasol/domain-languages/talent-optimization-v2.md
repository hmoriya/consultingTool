# パラソルドメイン言語: タレント最適化ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
コンサルティングファームの最も重要な資産である人材を最適に活用し、個人と組織の成長を実現するドメイン

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
TEXT: 長文テキスト（制限なし）
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
PERCENTAGE: パーセンテージ（0-100）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
URL: URL形式（RFC3986準拠）
```

### カスタム型定義
```
スキルレベル: 習熟度のレベル (基本型: ENUM)
  - beginner: 初級（1）
  - intermediate: 中級（2-3）
  - advanced: 上級（4）
  - expert: エキスパート（5）

スキルカテゴリ: スキルの分類 (基本型: ENUM)
  - technical: 技術スキル
  - functional: 業務スキル
  - industry: 業界知識
  - management: マネジメントスキル
  - soft: ソフトスキル

評価タイプ: 評価の種類 (基本型: ENUM)
  - self: 自己評価
  - manager: 上司評価
  - peer: 360度評価
  - client: クライアント評価

キャリアレベル: キャリアの段階 (基本型: ENUM)
  - analyst: アナリスト
  - consultant: コンサルタント
  - senior_consultant: シニアコンサルタント
  - manager: マネージャー
  - senior_manager: シニアマネージャー
  - director: ディレクター
  - partner: パートナー

チームタイプ: チームの種類 (基本型: ENUM)
  - project: プロジェクトチーム
  - practice: プラクティスチーム
  - function: 機能チーム
  - temporary: 臨時チーム

稼働ステータス: リソースの稼働状態 (基本型: ENUM)
  - available: 稼働可能
  - partially_allocated: 部分稼働
  - fully_allocated: フル稼働
  - on_leave: 休暇中
  - unavailable: 稼働不可
```

## エンティティ（Entities）

### チーム [Team] [TEAM]
説明: 組織内の業務遂行単位

属性:
- チームID [TeamId] [TEAM_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: チームの一意識別子
- チーム名 [Name] [NAME]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: チームの名称
- チームタイプ [Type] [TYPE]
  - 型: チームタイプ [TeamType] [TEAM_TYPE]
  - 説明: チームの種類
- ミッション [Mission] [MISSION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: チームの目的と役割
- 親チームリファレンス [ParentTeamRef] [PARENT_TEAM_REF]
  - 型: チームID [TeamId] [TEAM_ID]（参照）
  - 説明: 階層構造における親チーム
  - 関連: チーム [Team] → チーム [Team]（0..1）
- リーダーリファレンス [LeaderRef] [LEADER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: チームリーダー
  - 関連: ユーザー [User] → チーム [Team]（1..*）
- チームメンバー [TeamMembers] [TEAM_MEMBERS]
  - 型: チームメンバーの配列 [TeamMember[]] [TEAM_MEMBER_ARRAY]（0..*）
  - 説明: チームに所属するメンバー
  - 関連: チーム [Team] *→ チームメンバー [TeamMember]（集約内包含）
- チーム目標 [TeamGoals] [TEAM_GOALS]
  - 型: チーム目標 [TeamGoals] [TEAM_GOALS]（値オブジェクト）
  - 説明: チームの達成目標
- アクティブ期間 [ActivePeriod] [ACTIVE_PERIOD]
  - 型: 活動期間 [ActivePeriod] [ACTIVE_PERIOD]（値オブジェクト）
  - 説明: チームの活動期間

不変条件:
- チーム名は組織内で一意
- 親チームは自分自身を参照しない
- 最低1名のメンバーが必要

振る舞い:
- メンバー追加 [AddMember] [ADD_MEMBER]
  - 目的: 新しいメンバーをチームに追加
  - 入力: ユーザーID、役割
  - 出力: 追加結果
  - 事前条件: ユーザーが存在
  - 事後条件: メンバー追加済み

#### ドメインイベント
- チーム編成済み [TeamFormed] [TEAM_FORMED]：新チーム結成時
- メンバー追加済み [MemberAdded] [MEMBER_ADDED]：メンバー参加時

#### 集約ルート
このエンティティはチーム集約のルートエンティティ

### スキル [Skill] [SKILL]
説明: 業務遂行に必要な能力・知識

属性:
- スキルID [SkillId] [SKILL_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: スキルの一意識別子
- スキル名 [Name] [NAME]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: スキルの名称
- カテゴリ [Category] [CATEGORY]
  - 型: スキルカテゴリ [SkillCategory] [SKILL_CATEGORY]
  - 説明: スキルの分類
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: スキルの詳細説明
- レベル定義 [LevelDefinition] [LEVEL_DEFINITION]
  - 型: レベル定義 [LevelDefinition] [LEVEL_DEFINITION]（値オブジェクト）
  - 説明: 各レベルの判定基準
- 関連スキル [RelatedSkills] [RELATED_SKILLS]
  - 型: スキルIDの配列 [SkillId[]] [SKILL_ID_ARRAY]
  - 説明: 関連する他のスキル
- 需要トレンド [DemandTrend] [DEMAND_TREND]
  - 型: 需要トレンド [DemandTrend] [DEMAND_TREND]（値オブジェクト）
  - 説明: スキルの市場需要動向

不変条件:
- スキル名とカテゴリの組み合わせは一意
- レベル定義は5段階

### ユーザースキル [UserSkill] [USER_SKILL]
説明: 個人が保有するスキルと習熟度

属性:
- ユーザースキルID [UserSkillId] [USER_SKILL_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: ユーザースキルの一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: スキル保有者
  - 関連: ユーザー [User] → ユーザースキル [UserSkill]（1..*）
- スキルリファレンス [SkillRef] [SKILL_REF]
  - 型: スキルID [SkillId] [SKILL_ID]（参照）
  - 説明: 保有スキル
  - 関連: スキル [Skill] → ユーザースキル [UserSkill]（1..*）
- 現在レベル [CurrentLevel] [CURRENT_LEVEL]
  - 型: スキルレベル [SkillLevel] [SKILL_LEVEL]
  - 説明: 現在の習熟度
- 目標レベル [TargetLevel] [TARGET_LEVEL]
  - 型: スキルレベル [SkillLevel] [SKILL_LEVEL]
  - 説明: 目指すレベル
- スキル評価履歴 [EvaluationHistory] [EVALUATION_HISTORY]
  - 型: スキル評価の配列 [SkillEvaluation[]] [SKILL_EVALUATION_ARRAY]（0..*）
  - 説明: 過去の評価記録
  - 関連: ユーザースキル [UserSkill] *→ スキル評価 [SkillEvaluation]（集約内包含）
- 実績情報 [Achievement] [ACHIEVEMENT]
  - 型: スキル実績 [SkillAchievement] [SKILL_ACHIEVEMENT]（値オブジェクト）
  - 説明: スキル活用の実績
- 最終更新日 [LastUpdatedAt] [LAST_UPDATED_AT]
  - 型: TIMESTAMP [TIMESTAMP] [TIMESTAMP]
  - 説明: スキル情報の最終更新日時

振る舞い:
- スキル評価 [EvaluateSkill] [EVALUATE_SKILL]
  - 目的: スキルレベルを評価
  - 入力: 評価情報（評価者、レベル、コメント）
  - 出力: 評価結果
  - 事前条件: 評価者権限あり
  - 事後条件: 評価履歴追加、レベル更新

### スキル評価 [SkillEvaluation] [SKILL_EVALUATION]
説明: スキルレベルの評価記録

属性:
- 評価ID [EvaluationId] [EVALUATION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 評価の一意識別子
- 評価日 [EvaluationDate] [EVALUATION_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: 評価実施日
- 評価タイプ [Type] [TYPE]
  - 型: 評価タイプ [EvaluationType] [EVALUATION_TYPE]
  - 説明: 評価の種類
- 評価者リファレンス [EvaluatorRef] [EVALUATOR_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 評価を行った人
  - 関連: ユーザー [User] → スキル評価 [SkillEvaluation]（1..*）
- 評価レベル [Level] [LEVEL]
  - 型: スキルレベル [SkillLevel] [SKILL_LEVEL]
  - 説明: 評価されたレベル
- 評価根拠 [Evidence] [EVIDENCE]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 評価の根拠・理由
- 改善提案 [Recommendation] [RECOMMENDATION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: スキル向上のための提案

### リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]
説明: プロジェクトへの人材配分

属性:
- 配分ID [AllocationId] [ALLOCATION_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 配分の一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 配分される人材
  - 関連: ユーザー [User] → リソース配分 [ResourceAllocation]（1..*）
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 配分先プロジェクト
  - 関連: プロジェクト [Project] → リソース配分 [ResourceAllocation]（1..*）
- 配分期間 [AllocationPeriod] [ALLOCATION_PERIOD]
  - 型: 配分期間 [AllocationPeriod] [ALLOCATION_PERIOD]（値オブジェクト）
  - 説明: 配分の開始日と終了日
- 配分率 [AllocationRate] [ALLOCATION_RATE]
  - 型: PERCENTAGE [PERCENTAGE] [PERCENTAGE]
  - 説明: 稼働率（0-100%）
- 役割 [Role] [ROLE]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: プロジェクト内での役割
- 必要スキル [RequiredSkills] [REQUIRED_SKILLS]
  - 型: 必要スキル [RequiredSkills] [REQUIRED_SKILLS]（値オブジェクト）
  - 説明: この配分で必要なスキル
- ステータス [Status] [STATUS]
  - 型: 稼働ステータス [AllocationStatus] [ALLOCATION_STATUS]
  - 説明: 配分の現在の状態

不変条件:
- 同一期間の配分率合計は100%以下
- 配分期間はプロジェクト期間内

振る舞い:
- 配分率変更 [ChangeAllocationRate] [CHANGE_ALLOCATION_RATE]
  - 目的: 稼働率を調整
  - 入力: 新配分率、変更理由
  - 出力: 変更結果
  - 事前条件: 合計100%以下
  - 事後条件: 配分率更新

### チームメンバー [TeamMember] [TEAM_MEMBER]
説明: チームに所属するメンバー

属性:
- メンバーID [MemberId] [MEMBER_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: チームメンバーの一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 実際のユーザー
  - 関連: ユーザー [User] → チームメンバー [TeamMember]（1..*）
- 役割 [Role] [ROLE]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: チーム内での役割
- 参加日 [JoinedDate] [JOINED_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: チーム参加日
- 貢献度 [Contribution] [CONTRIBUTION]
  - 型: 貢献度 [Contribution] [CONTRIBUTION]（値オブジェクト）
  - 説明: チームへの貢献

### パフォーマンス評価 [PerformanceReview] [PERFORMANCE_REVIEW]
説明: 個人の業績評価

属性:
- 評価ID [ReviewId] [REVIEW_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 評価の一意識別子
- 被評価者リファレンス [RevieweeRef] [REVIEWEE_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 評価対象者
  - 関連: ユーザー [User] → パフォーマンス評価 [PerformanceReview]（1..*）
- 評価期間 [ReviewPeriod] [REVIEW_PERIOD]
  - 型: 評価期間 [ReviewPeriod] [REVIEW_PERIOD]（値オブジェクト）
  - 説明: 評価対象期間
- 総合評価 [OverallRating] [OVERALL_RATING]
  - 型: STRING_20 [STRING_20] [STRING_20]
  - 説明: 総合的な評価結果
- 評価詳細 [ReviewDetails] [REVIEW_DETAILS]
  - 型: 評価詳細 [ReviewDetails] [REVIEW_DETAILS]（値オブジェクト）
  - 説明: 詳細な評価内容
- 目標達成度 [GoalAchievement] [GOAL_ACHIEVEMENT]
  - 型: 目標達成度 [GoalAchievement] [GOAL_ACHIEVEMENT]（値オブジェクト）
  - 説明: 設定目標の達成状況
- 改善計画 [ImprovementPlan] [IMPROVEMENT_PLAN]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 今後の改善計画

## 値オブジェクト（Value Objects）

### 活動期間 [ActivePeriod] [ACTIVE_PERIOD]
- 定義: チームやプロジェクトの活動期間
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
  - アクティブ [isActive] [IS_ACTIVE]: BOOLEAN（計算値）
- 制約: 開始日は終了日より前
- 使用エンティティ: チーム [Team]

### チーム目標 [TeamGoals] [TEAM_GOALS]
- 定義: チームが達成すべき目標
- 属性:
  - 目標項目 [goals] [GOALS]: STRING_255の配列
  - 達成期限 [deadline] [DEADLINE]: DATE
  - 優先順位 [priority] [PRIORITY]: INTEGER
- 制約: 最低1つの目標項目
- 使用エンティティ: チーム [Team]

### レベル定義 [LevelDefinition] [LEVEL_DEFINITION]
- 定義: スキルレベルの判定基準
- 属性:
  - レベル1基準 [level1] [LEVEL1]: TEXT
  - レベル2基準 [level2] [LEVEL2]: TEXT
  - レベル3基準 [level3] [LEVEL3]: TEXT
  - レベル4基準 [level4] [LEVEL4]: TEXT
  - レベル5基準 [level5] [LEVEL5]: TEXT
- 制約: 各レベルに明確な基準
- 使用エンティティ: スキル [Skill]

### 需要トレンド [DemandTrend] [DEMAND_TREND]
- 定義: スキルの市場需要動向
- 属性:
  - 現在需要 [currentDemand] [CURRENT_DEMAND]: STRING_20（high/medium/low）
  - 将来予測 [futureForecast] [FUTURE_FORECAST]: STRING_20（increasing/stable/decreasing）
  - 重要度 [importance] [IMPORTANCE]: INTEGER（1-5）
- 制約: 重要度は1-5の範囲
- 使用エンティティ: スキル [Skill]

### スキル実績 [SkillAchievement] [SKILL_ACHIEVEMENT]
- 定義: スキル活用の実績情報
- 属性:
  - プロジェクト数 [projectCount] [PROJECT_COUNT]: INTEGER
  - 最終活用日 [lastUsedDate] [LAST_USED_DATE]: DATE
  - 成果事例 [achievements] [ACHIEVEMENTS]: TEXT
- 制約: プロジェクト数は0以上
- 使用エンティティ: ユーザースキル [UserSkill]

### 配分期間 [AllocationPeriod] [ALLOCATION_PERIOD]
- 定義: リソース配分の期間
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
  - 稼働日数 [workingDays] [WORKING_DAYS]: INTEGER（計算値）
- 制約: 開始日は終了日より前
- 使用エンティティ: リソース配分 [ResourceAllocation]

### 必要スキル [RequiredSkills] [REQUIRED_SKILLS]
- 定義: プロジェクトで必要なスキル
- 属性:
  - スキルリスト [skillList] [SKILL_LIST]: スキルIDの配列
  - 最低レベル [minimumLevel] [MINIMUM_LEVEL]: スキルレベル
  - 重要度 [importance] [IMPORTANCE]: STRING_20（critical/important/nice-to-have）
- 制約: 最低1つのスキル
- 使用エンティティ: リソース配分 [ResourceAllocation]

### 貢献度 [Contribution] [CONTRIBUTION]
- 定義: チームへの貢献を定量化
- 属性:
  - タスク完了数 [tasksCompleted] [TASKS_COMPLETED]: INTEGER
  - リーダーシップスコア [leadershipScore] [LEADERSHIP_SCORE]: INTEGER（1-10）
  - コラボレーションスコア [collaborationScore] [COLLABORATION_SCORE]: INTEGER（1-10）
- 制約: スコアは1-10の範囲
- 使用エンティティ: チームメンバー [TeamMember]

### 評価期間 [ReviewPeriod] [REVIEW_PERIOD]
- 定義: パフォーマンス評価の対象期間
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
  - 評価サイクル [cycle] [CYCLE]: STRING_50（annual/semi-annual/quarterly）
- 制約: 開始日は終了日より前
- 使用エンティティ: パフォーマンス評価 [PerformanceReview]

### 評価詳細 [ReviewDetails] [REVIEW_DETAILS]
- 定義: 詳細な評価内容
- 属性:
  - 技術評価 [technicalRating] [TECHNICAL_RATING]: STRING_20
  - リーダーシップ評価 [leadershipRating] [LEADERSHIP_RATING]: STRING_20
  - コミュニケーション評価 [communicationRating] [COMMUNICATION_RATING]: STRING_20
  - 総合コメント [overallComment] [OVERALL_COMMENT]: TEXT
- 制約: 各評価は必須
- 使用エンティティ: パフォーマンス評価 [PerformanceReview]

### 目標達成度 [GoalAchievement] [GOAL_ACHIEVEMENT]
- 定義: 設定目標の達成状況
- 属性:
  - 目標数 [totalGoals] [TOTAL_GOALS]: INTEGER
  - 達成数 [achievedGoals] [ACHIEVED_GOALS]: INTEGER
  - 達成率 [achievementRate] [ACHIEVEMENT_RATE]: PERCENTAGE（計算値）
- 制約: 達成数は目標数以下
- 使用エンティティ: パフォーマンス評価 [PerformanceReview]

## 集約（Aggregates）

### チーム集約 [TeamAggregate] [TEAM_AGGREGATE]
- **集約ルート**: チーム [Team]
- **含まれるエンティティ**: 
  - チームメンバー [TeamMember]：所属メンバー（0..*）
- **含まれる値オブジェクト**:
  - 活動期間 [ActivePeriod]：チームの活動期間
  - チーム目標 [TeamGoals]：達成すべき目標
  - 貢献度 [Contribution]：各メンバーの貢献
- **トランザクション境界**: チームとメンバーは同一トランザクション
- **不変条件**: 
  - チーム名は組織内で一意
  - 最低1名のメンバーが必要
  - リーダーはメンバーの1人
- **外部参照ルール**:
  - 集約外からはチームIDのみで参照
  - メンバーへの直接アクセスは禁止

### スキル集約 [SkillAggregate] [SKILL_AGGREGATE]
- **集約ルート**: スキル [Skill]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - レベル定義 [LevelDefinition]：習熟度の基準
  - 需要トレンド [DemandTrend]：市場動向
- **トランザクション境界**: スキル単独で完結
- **不変条件**: 
  - スキル名とカテゴリの組み合わせは一意
  - レベル定義は必須
- **外部参照ルール**:
  - スキルIDで参照

### ユーザースキル集約 [UserSkillAggregate] [USER_SKILL_AGGREGATE]
- **集約ルート**: ユーザースキル [UserSkill]
- **含まれるエンティティ**: 
  - スキル評価 [SkillEvaluation]：評価履歴（0..*）
- **含まれる値オブジェクト**:
  - スキル実績 [SkillAchievement]：活用実績
- **トランザクション境界**: ユーザースキルと評価履歴は同一トランザクション
- **不変条件**: 
  - ユーザーとスキルの組み合わせは一意
  - 最新評価が現在レベル
- **外部参照ルール**:
  - ユーザーIDとスキルIDを参照
  - 評価履歴への直接アクセスは禁止

### リソース配分集約 [ResourceAllocationAggregate] [RESOURCE_ALLOCATION_AGGREGATE]
- **集約ルート**: リソース配分 [ResourceAllocation]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 配分期間 [AllocationPeriod]：配分の期間
  - 必要スキル [RequiredSkills]：要求スキル
- **トランザクション境界**: リソース配分単独で完結
- **不変条件**: 
  - 同一期間の配分率合計は100%以下
  - 配分期間はプロジェクト期間内
- **外部参照ルール**:
  - ユーザーIDとプロジェクトIDを参照

### パフォーマンス評価集約 [PerformanceReviewAggregate] [PERFORMANCE_REVIEW_AGGREGATE]
- **集約ルート**: パフォーマンス評価 [PerformanceReview]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 評価期間 [ReviewPeriod]：対象期間
  - 評価詳細 [ReviewDetails]：詳細評価
  - 目標達成度 [GoalAchievement]：達成状況
- **トランザクション境界**: パフォーマンス評価単独で完結
- **不変条件**: 
  - 評価期間の重複なし
  - 評価は確定後変更不可
- **外部参照ルール**:
  - ユーザーIDを参照

## ドメインサービス

### スキルマッチングサービス [SkillMatchingService] [SKILL_MATCHING_SERVICE]
プロジェクトの要求スキルと人材のマッチングを行うサービス

#### 提供機能
- 最適人材検索 [FindOptimalResources] [FIND_OPTIMAL_RESOURCES]
  - 目的: プロジェクト要件に最適な人材を発見
  - 入力: 必要スキル、期間、配分率
  - 出力: マッチング候補リスト（適合度スコア付き）
  - 制約: 稼働可能な人材のみ対象

- スキルギャップ分析 [AnalyzeSkillGaps] [ANALYZE_SKILL_GAPS]
  - 目的: チームの保有スキルと要求スキルの差を分析
  - 入力: チームID、必要スキル
  - 出力: ギャップレポート（不足スキル、推奨研修）
  - 制約: アクティブなメンバーのみ対象

### キャパシティ管理サービス [CapacityManagementService] [CAPACITY_MANAGEMENT_SERVICE]
組織全体のリソースキャパシティを管理するサービス

#### 提供機能
- 稼働率計算 [CalculateUtilization] [CALCULATE_UTILIZATION]
  - 目的: 個人・チーム・組織の稼働率を算出
  - 入力: 対象（個人/チーム/組織）、期間
  - 出力: 稼働率レポート（現在/予測）
  - 制約: アクティブな配分のみ対象

- キャパシティ予測 [ForecastCapacity] [FORECAST_CAPACITY]
  - 目的: 将来のリソースキャパシティを予測
  - 入力: 予測期間、プロジェクトパイプライン
  - 出力: キャパシティ予測（余剰/不足）
  - 制約: 確定済みプロジェクトベース

### キャリア開発サービス [CareerDevelopmentService] [CAREER_DEVELOPMENT_SERVICE]
個人のキャリア成長を支援するサービス

#### 提供機能
- キャリアパス提案 [SuggestCareerPath] [SUGGEST_CAREER_PATH]
  - 目的: 個人の強みに基づくキャリアパスを提案
  - 入力: ユーザーID
  - 出力: キャリアパス提案（必要スキル、推奨プロジェクト）
  - 制約: 過去の評価とスキルを考慮

- 研修推奨 [RecommendTraining] [RECOMMEND_TRAINING]
  - 目的: スキルギャップに基づく研修を推奨
  - 入力: ユーザーID、目標レベル
  - 出力: 推奨研修リスト（優先度付き）
  - 制約: 現在レベルと目標レベルの差分

## ドメインイベント

### チーム編成済み [TeamFormed] [TEAM_FORMED]
- **発生タイミング**: 新しいチームが結成された時
- **ペイロード**: 
  - チームID [teamId]: UUID
  - チーム名 [teamName]: STRING_100
  - リーダーID [leaderId]: UUID
  - 編成日 [formedDate]: DATE

### メンバー追加済み [MemberAdded] [MEMBER_ADDED]
- **発生タイミング**: チームに新メンバーが参加した時
- **ペイロード**: 
  - チームID [teamId]: UUID
  - ユーザーID [userId]: UUID
  - 役割 [role]: STRING_100
  - 参加日 [joinedDate]: DATE

### スキル評価完了 [SkillEvaluated] [SKILL_EVALUATED]
- **発生タイミング**: スキル評価が完了した時
- **ペイロード**: 
  - ユーザースキルID [userSkillId]: UUID
  - 新レベル [newLevel]: スキルレベル
  - 評価日 [evaluationDate]: DATE

### リソース配分済み [ResourceAllocated] [RESOURCE_ALLOCATED]
- **発生タイミング**: プロジェクトにリソースが配分された時
- **ペイロード**: 
  - 配分ID [allocationId]: UUID
  - ユーザーID [userId]: UUID
  - プロジェクトID [projectId]: UUID
  - 配分率 [allocationRate]: PERCENTAGE

### パフォーマンス評価完了 [PerformanceReviewed] [PERFORMANCE_REVIEWED]
- **発生タイミング**: パフォーマンス評価が確定した時
- **ペイロード**: 
  - 評価ID [reviewId]: UUID
  - ユーザーID [userId]: UUID
  - 総合評価 [overallRating]: STRING_20

## ビジネスルール

### チーム編成ルール
1. **チーム規模**: 
   - 最小: 3名
   - 最大: 15名（大規模チームは分割推奨）
   - 理想: 7±2名
2. **スキルバランス**: 
   - コアスキル保有者は最低2名
   - ジュニア：シニア比率は1:1〜2:1
3. **階層制限**: 
   - チーム階層は最大3階層まで
   - 直接管理するチーム数は最大7つ

### スキル管理ルール
1. **スキル評価頻度**: 
   - 自己評価: 四半期ごと
   - 上司評価: 半期ごと
   - 360度評価: 年1回
2. **レベルアップ基準**: 
   - 2回連続で上位評価
   - 実プロジェクトでの実績必須
   - メンタリングや研修の証跡
3. **スキル陳腐化**: 
   - 2年間未使用で1レベルダウン
   - 最新化研修で維持可能

### リソース配分ルール
1. **配分率制限**: 
   - 個人の合計: 最大100%
   - 単一プロジェクト: 最小20%（管理オーバーヘッド考慮）
   - 同時プロジェクト数: 最大5つ
2. **配分変更**: 
   - 2週間前の事前通知必要
   - 10%以上の変更は承認必要
3. **スキルマッチ**: 
   - 必須スキルの70%以上保有
   - 重要スキルの50%以上保有

### パフォーマンス評価ルール
1. **評価サイクル**: 
   - 年次評価: 必須
   - 半期評価: 推奨
   - プロジェクト完了時: 任意
2. **評価基準**: 
   - 目標達成度: 40%
   - スキル向上: 30%
   - チーム貢献: 20%
   - 顧客満足度: 10%
3. **昇進基準**: 
   - 2期連続で上位評価
   - 必要スキルの習得
   - リーダーシップの実証

### エラーパターン
- 3001: リソース競合エラー
- 3002: スキル不足エラー
- 3003: 配分率超過エラー
- 3004: チーム編成ルール違反エラー
- 3005: 評価権限エラー

## リポジトリインターフェース

### チームリポジトリ [TeamRepository] [TEAM_REPOSITORY]
集約: チーム集約 [TeamAggregate]

基本操作:
- findById(id: UUID): チーム [Team]
- save(team: チーム): void
- delete(id: UUID): void

検索操作:
- findByName(name: STRING_100): チーム
- findByLeaderId(userId: UUID): チーム[]
- findByType(type: チームタイプ): チーム[]
- findActiveTeams(): チーム[]

### スキルリポジトリ [SkillRepository] [SKILL_REPOSITORY]
集約: スキル集約 [SkillAggregate]

基本操作:
- findById(id: UUID): スキル [Skill]
- save(skill: スキル): void

検索操作:
- findByCategory(category: スキルカテゴリ): スキル[]
- findByName(name: STRING_100): スキル
- findHighDemandSkills(): スキル[]

### ユーザースキルリポジトリ [UserSkillRepository] [USER_SKILL_REPOSITORY]
集約: ユーザースキル集約 [UserSkillAggregate]

基本操作:
- findById(id: UUID): ユーザースキル [UserSkill]
- save(userSkill: ユーザースキル): void

検索操作:
- findByUserId(userId: UUID): ユーザースキル[]
- findBySkillId(skillId: UUID): ユーザースキル[]
- findBySkillAndLevel(skillId: UUID, level: スキルレベル): ユーザースキル[]

### リソース配分リポジトリ [ResourceAllocationRepository] [RESOURCE_ALLOCATION_REPOSITORY]
集約: リソース配分集約 [ResourceAllocationAggregate]

基本操作:
- findById(id: UUID): リソース配分 [ResourceAllocation]
- save(allocation: リソース配分): void

検索操作:
- findByUserId(userId: UUID): リソース配分[]
- findByProjectId(projectId: UUID): リソース配分[]
- findByPeriod(startDate: DATE, endDate: DATE): リソース配分[]
- findAvailableResources(period: 配分期間, minRate: PERCENTAGE): リソース配分[]

### パフォーマンス評価リポジトリ [PerformanceReviewRepository] [PERFORMANCE_REVIEW_REPOSITORY]
集約: パフォーマンス評価集約 [PerformanceReviewAggregate]

基本操作:
- findById(id: UUID): パフォーマンス評価 [PerformanceReview]
- save(review: パフォーマンス評価): void

検索操作:
- findByUserId(userId: UUID): パフォーマンス評価[]
- findByPeriod(period: 評価期間): パフォーマンス評価[]
- findTopPerformers(period: 評価期間): パフォーマンス評価[]

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

### 集約
- [x] 集約ルートが定義されている
- [x] トランザクション境界が明確
- [x] 不変条件が定義されている
- [x] すべてのエンティティを包含している
- [x] 外部からのアクセスは集約ルート経由のみ