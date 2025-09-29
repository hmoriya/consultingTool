# パラソルドメイン言語: プロジェクト成功支援ドメイン

**バージョン**: 1.2.0  
**更新日**: 2025-01-29

## パラソルドメイン概要
コンサルティングプロジェクトを計画から完了まで成功に導き、クライアントに価値を届けるドメイン

## ユビキタス言語定義

### 基本型定義
```
UUID: 一意識別子（36文字）
STRING_20: 最大20文字の文字列
STRING_50: 最大50文字の文字列
STRING_100: 最大100文字の文字列
STRING_255: 最大255文字の文字列
STRING_500: 最大500文字の文字列
TEXT: 長文テキスト（制限なし）
MARKDOWN: Markdown形式のテキスト
DATE: 日付（YYYY-MM-DD形式）
TIMESTAMP: 日時（ISO8601形式）
INTEGER: 整数
DECIMAL: 小数点数値
PERCENTAGE: パーセンテージ（0-100）
MONEY: 金額（通貨単位付き）
BOOLEAN: 真偽値（true/false）
ENUM: 列挙型
URL: URL形式（RFC3986準拠）
```

### カスタム型定義
```
プロジェクトステータス: プロジェクトの状態 (基本型: ENUM)
  - planning: 計画中
  - active: 実行中
  - completed: 完了
  - onhold: 保留
  - cancelled: 中止

優先度: タスクやリスクの重要度 (基本型: ENUM)
  - critical: 緊急
  - high: 高
  - medium: 中
  - low: 低

タスクステータス: タスクの進行状況 (基本型: ENUM)
  - pending: 未着手
  - inProgress: 進行中
  - blocked: ブロック
  - completed: 完了
  - cancelled: 中止

成果物タイプ: 成果物の種類 (基本型: ENUM)
  - document: ドキュメント
  - presentation: プレゼンテーション
  - software: ソフトウェア
  - report: レポート
  - other: その他

成果物ステータス: 成果物の状態 (基本型: ENUM)
  - draft: ドラフト
  - review: レビュー中
  - approved: 承認済み
  - delivered: 配信済み

リスクカテゴリ: リスクの分類 (基本型: ENUM)
  - technical: 技術リスク
  - schedule: スケジュールリスク
  - cost: コストリスク
  - resource: リソースリスク
  - quality: 品質リスク
  - external: 外部リスク

リスク影響度: リスクの影響の大きさ (基本型: ENUM)
  - catastrophic: 致命的
  - major: 重大
  - moderate: 中程度
  - minor: 軽微
  - negligible: 無視可能

リスク発生可能性: リスクが発生する確率 (基本型: ENUM)
  - certain: 確実
  - likely: 高い
  - possible: あり得る
  - unlikely: 低い
  - rare: まれ
```

## エンティティ（Entities）

### プロジェクト [Project] [PROJECT]
説明: クライアントの課題解決のための活動単位

属性:
- プロジェクトID [ProjectId] [PROJECT_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: プロジェクトの一意識別子
- プロジェクトコード [Code] [CODE]
  - 型: STRING_20 [STRING_20] [STRING_20]
  - 説明: プロジェクトの管理コード
- プロジェクト名 [Name] [NAME]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: プロジェクトの正式名称
- クライアントリファレンス [ClientRef] [CLIENT_REF]
  - 型: 組織ID [OrganizationId] [ORGANIZATION_ID]（参照）
  - 説明: クライアント組織への参照
  - 関連: 組織 [Organization] → プロジェクト [Project]（1..*）
- プロジェクト期間 [ProjectPeriod] [PROJECT_PERIOD]
  - 型: プロジェクト期間 [ProjectPeriod] [PROJECT_PERIOD]（値オブジェクト）
  - 説明: プロジェクトの開始日と終了日
- 予算情報 [BudgetInfo] [BUDGET_INFO]
  - 型: 予算情報 [BudgetInfo] [BUDGET_INFO]（値オブジェクト）
  - 説明: プロジェクトの予算と実績
- ステータス [Status] [STATUS]
  - 型: プロジェクトステータス [ProjectStatus] [PROJECT_STATUS]
  - 説明: プロジェクトの現在の状態
- プロジェクトチーム [ProjectTeam] [PROJECT_TEAM]
  - 型: プロジェクトメンバーの配列 [ProjectMember[]] [PROJECT_MEMBER_ARRAY]（1..*）
  - 説明: プロジェクトに参画するメンバー
  - 関連: プロジェクト [Project] *→ プロジェクトメンバー [ProjectMember]（集約内包含）
- マイルストーン [Milestones] [MILESTONES]
  - 型: マイルストーンの配列 [Milestone[]] [MILESTONE_ARRAY]（0..*）
  - 説明: プロジェクトの重要な節目
  - 関連: プロジェクト [Project] *→ マイルストーン [Milestone]（集約内包含）

不変条件:
- プロジェクトコードは一意
- 最低1名のPMが必要
- 開始日は終了日より前
- 予算は0以上

振る舞い:
- プロジェクト開始 [StartProject] [START_PROJECT]
  - 目的: 計画段階から実行段階への移行
  - 入力: 開始承認情報
  - 出力: 開始結果
  - 事前条件: ステータス=計画中、必要な情報が揃っている
  - 事後条件: ステータス=実行中
- マイルストーン設定 [SetMilestone] [SET_MILESTONE]
  - 目的: プロジェクトの重要な節目を定義
  - 入力: マイルストーン情報
  - 出力: 設定結果
  - 事前条件: プロジェクト期間内
  - 事後条件: マイルストーン追加

#### ドメインイベント
- プロジェクト開始済み [ProjectStarted] [PROJECT_STARTED]：プロジェクト実行開始時
- マイルストーン達成 [MilestoneAchieved] [MILESTONE_ACHIEVED]：マイルストーン完了時

#### 集約ルート
このエンティティはプロジェクト集約のルートエンティティ

### タスク [Task] [TASK]
説明: プロジェクトを構成する作業単位

属性:
- タスクID [TaskId] [TASK_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: タスクの一意識別子
- タスクコード [Code] [CODE]
  - 型: STRING_20 [STRING_20] [STRING_20]
  - 説明: タスクの管理コード
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: タスクの概要
- 詳細説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: タスクの詳細な内容
- 担当者リファレンス [AssigneeRef] [ASSIGNEE_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: タスクを担当するユーザー
  - 関連: ユーザー [User] → タスク [Task]（1..*）
- タスク期間 [TaskPeriod] [TASK_PERIOD]
  - 型: タスク期間 [TaskPeriod] [TASK_PERIOD]（値オブジェクト）
  - 説明: タスクの開始日と期限
- 見積工数 [EstimatedHours] [ESTIMATED_HOURS]
  - 型: DECIMAL [DECIMAL] [DECIMAL]
  - 説明: 見積もり作業時間
- 実績工数 [ActualHours] [ACTUAL_HOURS]
  - 型: DECIMAL [DECIMAL] [DECIMAL]
  - 説明: 実際の作業時間
- ステータス [Status] [STATUS]
  - 型: タスクステータス [TaskStatus] [TASK_STATUS]
  - 説明: タスクの進行状況
- 優先度 [Priority] [PRIORITY]
  - 型: 優先度 [Priority] [PRIORITY]
  - 説明: タスクの重要度
- 進捗率 [Progress] [PROGRESS]
  - 型: PERCENTAGE [PERCENTAGE] [PERCENTAGE]
  - 説明: タスクの完了度（0-100%）

不変条件:
- 実績工数は見積工数の3倍を超えない（異常値チェック）
- 完了時は進捗率100%

振る舞い:
- タスク開始 [StartTask] [START_TASK]
  - 目的: タスクの作業を開始
  - 入力: なし
  - 出力: 開始結果
  - 事前条件: ステータス=未着手
  - 事後条件: ステータス=進行中

### マイルストーン [Milestone] [MILESTONE]
説明: プロジェクトの重要な節目

属性:
- マイルストーンID [MilestoneId] [MILESTONE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: マイルストーンの一意識別子
- 名称 [Name] [NAME]
  - 型: STRING_100 [STRING_100] [STRING_100]
  - 説明: マイルストーンの名前
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: マイルストーンの詳細
- 期日 [DueDate] [DUE_DATE]
  - 型: DATE [DATE] [DATE]
  - 説明: マイルストーンの達成期限
- 達成基準 [Criteria] [CRITERIA]
  - 型: 達成基準 [AchievementCriteria] [ACHIEVEMENT_CRITERIA]（値オブジェクト）
  - 説明: マイルストーンの完了条件
- 関連タスク [RelatedTasks] [RELATED_TASKS]
  - 型: タスクIDの配列 [TaskId[]] [TASK_ID_ARRAY]
  - 説明: このマイルストーンに関連するタスク
- 達成状況 [Achievement] [ACHIEVEMENT]
  - 型: 達成状況 [AchievementStatus] [ACHIEVEMENT_STATUS]（値オブジェクト）
  - 説明: マイルストーンの達成状態

### 成果物 [Deliverable] [DELIVERABLE]
説明: プロジェクトで作成される具体的な成果

属性:
- 成果物ID [DeliverableId] [DELIVERABLE_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: 成果物の一意識別子
- 名称 [Name] [NAME]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: 成果物の名前
- タイプ [Type] [TYPE]
  - 型: 成果物タイプ [DeliverableType] [DELIVERABLE_TYPE]
  - 説明: 成果物の種類
- 説明 [Description] [DESCRIPTION]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: 成果物の詳細説明
- バージョン [Version] [VERSION]
  - 型: STRING_20 [STRING_20] [STRING_20]
  - 説明: 成果物のバージョン
- ステータス [Status] [STATUS]
  - 型: 成果物ステータス [DeliverableStatus] [DELIVERABLE_STATUS]
  - 説明: 成果物の状態
- 承認情報 [ApprovalInfo] [APPROVAL_INFO]
  - 型: 承認情報 [ApprovalInfo] [APPROVAL_INFO]（値オブジェクト）
  - 説明: 承認に関する情報
- 配信情報 [DeliveryInfo] [DELIVERY_INFO]
  - 型: 配信情報 [DeliveryInfo] [DELIVERY_INFO]（値オブジェクト）
  - 説明: クライアントへの配信情報

### プロジェクトメンバー [ProjectMember] [PROJECT_MEMBER]
説明: プロジェクトに参画するメンバー

属性:
- メンバーID [MemberId] [MEMBER_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: メンバー割当の一意識別子
- ユーザーリファレンス [UserRef] [USER_REF]
  - 型: ユーザーID [UserId] [USER_ID]（参照）
  - 説明: 実際のユーザーへの参照
  - 関連: ユーザー [User] → プロジェクトメンバー [ProjectMember]（1..*）
- 役割 [Role] [ROLE]
  - 型: STRING_50 [STRING_50] [STRING_50]
  - 説明: プロジェクト内での役割（PM、メンバー、レビュアー等）
- 参画期間 [ParticipationPeriod] [PARTICIPATION_PERIOD]
  - 型: 参画期間 [ParticipationPeriod] [PARTICIPATION_PERIOD]（値オブジェクト）
  - 説明: プロジェクトへの参画期間
- アロケーション率 [AllocationRate] [ALLOCATION_RATE]
  - 型: PERCENTAGE [PERCENTAGE] [PERCENTAGE]
  - 説明: プロジェクトへの稼働率

### リスク [Risk] [RISK]
説明: プロジェクトの潜在的な問題

属性:
- リスクID [RiskId] [RISK_ID]
  - 型: UUID [UUID] [UUID_FORMAT]
  - 説明: リスクの一意識別子
- プロジェクトリファレンス [ProjectRef] [PROJECT_REF]
  - 型: プロジェクトID [ProjectId] [PROJECT_ID]（参照）
  - 説明: 関連するプロジェクト
  - 関連: プロジェクト [Project] → リスク [Risk]（1..*）
- タイトル [Title] [TITLE]
  - 型: STRING_255 [STRING_255] [STRING_255]
  - 説明: リスクの概要
- 詳細 [Detail] [DETAIL]
  - 型: TEXT [TEXT] [TEXT]
  - 説明: リスクの詳細説明
- カテゴリ [Category] [CATEGORY]
  - 型: リスクカテゴリ [RiskCategory] [RISK_CATEGORY]
  - 説明: リスクの分類
- リスク評価 [RiskAssessment] [RISK_ASSESSMENT]
  - 型: リスク評価 [RiskAssessment] [RISK_ASSESSMENT]（値オブジェクト）
  - 説明: 影響度と発生可能性の評価
- 対策計画 [MitigationPlan] [MITIGATION_PLAN]
  - 型: 対策計画 [MitigationPlan] [MITIGATION_PLAN]（値オブジェクト）
  - 説明: リスク軽減のための計画
- ステータス [Status] [STATUS]
  - 型: STRING_50 [STRING_50] [STRING_50]
  - 説明: リスクの現在の状態

## 値オブジェクト（Value Objects）

### プロジェクト期間 [ProjectPeriod] [PROJECT_PERIOD]
- 定義: プロジェクトの開始日と終了日
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 終了日 [endDate] [END_DATE]: DATE
  - 期間日数 [durationDays] [DURATION_DAYS]: INTEGER（計算値）
- 制約: 開始日は終了日より前
- 使用エンティティ: プロジェクト [Project]
- 例: 2024-01-01〜2024-12-31（365日間）

### 予算情報 [BudgetInfo] [BUDGET_INFO]
- 定義: プロジェクトの予算と実績
- 属性:
  - 予算額 [budgetAmount] [BUDGET_AMOUNT]: MONEY
  - 実績額 [actualAmount] [ACTUAL_AMOUNT]: MONEY
  - 残予算 [remainingAmount] [REMAINING_AMOUNT]: MONEY（計算値）
  - 消化率 [consumptionRate] [CONSUMPTION_RATE]: PERCENTAGE（計算値）
- 制約: 金額は0以上
- 使用エンティティ: プロジェクト [Project]

### タスク期間 [TaskPeriod] [TASK_PERIOD]
- 定義: タスクの開始日と期限
- 属性:
  - 開始日 [startDate] [START_DATE]: DATE
  - 期限日 [dueDate] [DUE_DATE]: DATE
  - 残日数 [remainingDays] [REMAINING_DAYS]: INTEGER（計算値）
- 制約: 開始日は期限日より前
- 使用エンティティ: タスク [Task]

### 達成基準 [AchievementCriteria] [ACHIEVEMENT_CRITERIA]
- 定義: マイルストーンの完了条件
- 属性:
  - 基準項目 [criteriaItems] [CRITERIA_ITEMS]: STRING_255の配列
  - 必須項目数 [requiredCount] [REQUIRED_COUNT]: INTEGER
- 制約: 最低1つの基準項目
- 使用エンティティ: マイルストーン [Milestone]

### 達成状況 [AchievementStatus] [ACHIEVEMENT_STATUS]
- 定義: マイルストーンの達成状態
- 属性:
  - 達成済み [isAchieved] [IS_ACHIEVED]: BOOLEAN
  - 達成日 [achievedDate] [ACHIEVED_DATE]: DATE
  - 達成率 [achievementRate] [ACHIEVEMENT_RATE]: PERCENTAGE
- 制約: 達成済みの場合は達成日必須
- 使用エンティティ: マイルストーン [Milestone]

### 承認情報 [ApprovalInfo] [APPROVAL_INFO]
- 定義: 成果物の承認に関する情報
- 属性:
  - 承認者 [approver] [APPROVER]: STRING_100
  - 承認日時 [approvedAt] [APPROVED_AT]: TIMESTAMP
  - 承認コメント [comment] [COMMENT]: TEXT
- 制約: 承認済みの場合は承認者と承認日時必須
- 使用エンティティ: 成果物 [Deliverable]

### 配信情報 [DeliveryInfo] [DELIVERY_INFO]
- 定義: クライアントへの配信情報
- 属性:
  - 配信日時 [deliveredAt] [DELIVERED_AT]: TIMESTAMP
  - 配信方法 [method] [METHOD]: STRING_50
  - 受領確認 [isConfirmed] [IS_CONFIRMED]: BOOLEAN
- 制約: 配信済みの場合は配信日時必須
- 使用エンティティ: 成果物 [Deliverable]

### 参画期間 [ParticipationPeriod] [PARTICIPATION_PERIOD]
- 定義: プロジェクトへの参画期間
- 属性:
  - 参画開始日 [startDate] [START_DATE]: DATE
  - 参画終了日 [endDate] [END_DATE]: DATE
  - アクティブ [isActive] [IS_ACTIVE]: BOOLEAN（計算値）
- 制約: 開始日は終了日より前
- 使用エンティティ: プロジェクトメンバー [ProjectMember]

### リスク評価 [RiskAssessment] [RISK_ASSESSMENT]
- 定義: リスクの影響度と発生可能性の評価
- 属性:
  - 影響度 [impact] [IMPACT]: リスク影響度
  - 発生可能性 [likelihood] [LIKELIHOOD]: リスク発生可能性
  - リスクスコア [riskScore] [RISK_SCORE]: INTEGER（計算値：1-25）
- 制約: スコアは影響度×発生可能性で計算
- 使用エンティティ: リスク [Risk]

### 対策計画 [MitigationPlan] [MITIGATION_PLAN]
- 定義: リスク軽減のための計画
- 属性:
  - 対策内容 [actions] [ACTIONS]: TEXT
  - 責任者 [owner] [OWNER]: STRING_100
  - 期限 [deadline] [DEADLINE]: DATE
  - 効果見込み [expectedEffect] [EXPECTED_EFFECT]: STRING_255
- 制約: 高リスクには必須
- 使用エンティティ: リスク [Risk]

## 集約（Aggregates）

### プロジェクト集約 [ProjectAggregate] [PROJECT_AGGREGATE]
- **集約ルート**: プロジェクト [Project]
- **含まれるエンティティ**: 
  - プロジェクトメンバー [ProjectMember]：参画メンバー（1..*）
  - マイルストーン [Milestone]：重要な節目（0..*）
- **含まれる値オブジェクト**:
  - プロジェクト期間 [ProjectPeriod]：期間情報として使用
  - 予算情報 [BudgetInfo]：予算管理として使用
  - 参画期間 [ParticipationPeriod]：メンバーの参画期間
  - 達成基準 [AchievementCriteria]：マイルストーンの基準
  - 達成状況 [AchievementStatus]：マイルストーンの状態
- **トランザクション境界**: プロジェクト、メンバー、マイルストーンは同一トランザクション
- **不変条件**: 
  - 最低1名のPMが必要
  - プロジェクト期間内にマイルストーンを設定
  - メンバーのアロケーション合計は各自100%以下
- **外部参照ルール**:
  - 集約外からはプロジェクトIDのみで参照
  - タスクと成果物は別集約として管理

### タスク集約 [TaskAggregate] [TASK_AGGREGATE]
- **集約ルート**: タスク [Task]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - タスク期間 [TaskPeriod]：期間情報として使用
- **トランザクション境界**: タスク単独で完結
- **不変条件**: 
  - プロジェクト期間内に完了
  - 担当者は1名のみ
- **外部参照ルール**:
  - プロジェクトIDとユーザーIDを参照
  - マイルストーンとの関連はIDで管理

### 成果物集約 [DeliverableAggregate] [DELIVERABLE_AGGREGATE]
- **集約ルート**: 成果物 [Deliverable]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - 承認情報 [ApprovalInfo]：承認状態として使用
  - 配信情報 [DeliveryInfo]：配信状態として使用
- **トランザクション境界**: 成果物単独で完結
- **不変条件**: 
  - 承認前に配信不可
  - バージョンは順次増加
- **外部参照ルール**:
  - プロジェクトIDとマイルストーンIDを参照

### リスク集約 [RiskAggregate] [RISK_AGGREGATE]
- **集約ルート**: リスク [Risk]
- **含まれるエンティティ**: なし
- **含まれる値オブジェクト**:
  - リスク評価 [RiskAssessment]：評価情報として使用
  - 対策計画 [MitigationPlan]：対策情報として使用
- **トランザクション境界**: リスク単独で完結
- **不変条件**: 
  - 高リスクには対策計画必須
  - 評価は定期的に更新
- **外部参照ルール**:
  - プロジェクトIDを参照

## ドメインサービス

### プロジェクト進捗計算サービス [ProjectProgressCalculationService] [PROJECT_PROGRESS_CALCULATION_SERVICE]
プロジェクト全体の進捗を計算するサービス

#### 提供機能
- 全体進捗率計算 [CalculateOverallProgress] [CALCULATE_OVERALL_PROGRESS]
  - 目的: タスクとマイルストーンから全体進捗を算出
  - 入力: プロジェクトID
  - 出力: 進捗レポート（進捗率、遅延タスク、リスク）
  - 制約: アクティブなプロジェクトのみ

- クリティカルパス分析 [AnalyzeCriticalPath] [ANALYZE_CRITICAL_PATH]
  - 目的: プロジェクトのクリティカルパスを特定
  - 入力: プロジェクトID
  - 出力: クリティカルパス上のタスクリスト
  - 制約: タスク間の依存関係を考慮

### リソース最適化サービス [ResourceOptimizationService] [RESOURCE_OPTIMIZATION_SERVICE]
プロジェクト間のリソース配分を最適化するサービス

#### 提供機能
- リソース競合検出 [DetectResourceConflicts] [DETECT_RESOURCE_CONFLICTS]
  - 目的: メンバーの過剰アロケーションを検出
  - 入力: 期間
  - 出力: 競合リスト（メンバー、プロジェクト、超過率）
  - 制約: アクティブなプロジェクトのみ対象

## ドメインイベント

### プロジェクト開始済み [ProjectStarted] [PROJECT_STARTED]
- **発生タイミング**: プロジェクトが計画から実行に移行した時
- **ペイロード**: 
  - プロジェクトID [projectId]: UUID
  - プロジェクト名 [projectName]: STRING_255
  - 開始日 [startDate]: DATE

### マイルストーン達成 [MilestoneAchieved] [MILESTONE_ACHIEVED]
- **発生タイミング**: マイルストーンが完了した時
- **ペイロード**: 
  - マイルストーンID [milestoneId]: UUID
  - プロジェクトID [projectId]: UUID
  - 達成日 [achievedDate]: DATE

### タスク完了 [TaskCompleted] [TASK_COMPLETED]
- **発生タイミング**: タスクが完了した時
- **ペイロード**: 
  - タスクID [taskId]: UUID
  - プロジェクトID [projectId]: UUID
  - 完了日時 [completedAt]: TIMESTAMP

### 成果物承認済み [DeliverableApproved] [DELIVERABLE_APPROVED]
- **発生タイミング**: 成果物が承認された時
- **ペイロード**: 
  - 成果物ID [deliverableId]: UUID
  - プロジェクトID [projectId]: UUID
  - 承認者 [approver]: STRING_100

### 高リスク検出 [HighRiskDetected] [HIGH_RISK_DETECTED]
- **発生タイミング**: リスクスコアが閾値を超えた時
- **ペイロード**: 
  - リスクID [riskId]: UUID
  - プロジェクトID [projectId]: UUID
  - リスクスコア [riskScore]: INTEGER

## ビジネスルール

### プロジェクト管理ルール
1. **プロジェクトコード体系**: 
   - 形式: [クライアントコード][年度][連番]
   - 例: ABC2024001
2. **予算管理**: 
   - 予算超過80%で警告
   - 予算超過90%で承認必要
   - 予算超過100%で追加予算承認必要
3. **進捗管理**: 
   - 週次で進捗更新必須
   - 遅延10%で黄色警告
   - 遅延20%で赤色警告

### タスク管理ルール
1. **タスク分割**: 最大40時間（1週間）単位
2. **担当者割当**: 稼働率を考慮して割当
3. **ブロック解除**: PMによる確認必要

### 成果物管理ルール
1. **レビュープロセス**: 
   - ドラフト→内部レビュー→クライアントレビュー→承認
   - 各段階で修正可能
2. **バージョン管理**: 
   - メジャー変更: 1.0→2.0
   - マイナー変更: 1.0→1.1
   - 修正: 1.0→1.0.1
3. **配信ルール**: 
   - 承認後24時間以内に配信
   - 配信確認は48時間以内

### リスク管理ルール
1. **リスク評価**: 
   - スコア15以上は高リスク
   - スコア10-14は中リスク
   - スコア9以下は低リスク
2. **対策実施**: 
   - 高リスクは即時対策必要
   - 中リスクは計画的対策
   - 低リスクは監視継続

### エラーパターン
- 2001: プロジェクト期間エラー
- 2002: 予算超過エラー
- 2003: リソース競合エラー
- 2004: タスク依存関係エラー
- 2005: 承認フローエラー

## リポジトリインターフェース

### プロジェクトリポジトリ [ProjectRepository] [PROJECT_REPOSITORY]
集約: プロジェクト集約 [ProjectAggregate]

基本操作:
- findById(id: UUID): プロジェクト [Project]
- save(project: プロジェクト): void
- delete(id: UUID): void

検索操作:
- findByCode(code: STRING_20): プロジェクト
- findByClientId(clientId: UUID): プロジェクト[]
- findByStatus(status: プロジェクトステータス): プロジェクト[]
- findByPeriod(startDate: DATE, endDate: DATE): プロジェクト[]

### タスクリポジトリ [TaskRepository] [TASK_REPOSITORY]
集約: タスク集約 [TaskAggregate]

基本操作:
- findById(id: UUID): タスク [Task]
- save(task: タスク): void

検索操作:
- findByProjectId(projectId: UUID): タスク[]
- findByAssigneeId(userId: UUID): タスク[]
- findByStatus(status: タスクステータス): タスク[]
- findOverdueTasks(): タスク[]

### 成果物リポジトリ [DeliverableRepository] [DELIVERABLE_REPOSITORY]
集約: 成果物集約 [DeliverableAggregate]

基本操作:
- findById(id: UUID): 成果物 [Deliverable]
- save(deliverable: 成果物): void

検索操作:
- findByProjectId(projectId: UUID): 成果物[]
- findByMilestoneId(milestoneId: UUID): 成果物[]
- findByStatus(status: 成果物ステータス): 成果物[]

### リスクリポジトリ [RiskRepository] [RISK_REPOSITORY]
集約: リスク集約 [RiskAggregate]

基本操作:
- findById(id: UUID): リスク [Risk]
- save(risk: リスク): void

検索操作:
- findByProjectId(projectId: UUID): リスク[]
- findByCategory(category: リスクカテゴリ): リスク[]
- findHighRisks(threshold: INTEGER): リスク[]

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