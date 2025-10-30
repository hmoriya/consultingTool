import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedDevelopSkills(service: any, capability: any) {
  console.log('    Creating business operation: スキルを開発する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'DevelopSkills',
      displayName: 'スキルを開発する',
      design: `# ビジネスオペレーション: スキルを開発する [DevelopSkills] [DEVELOP_SKILLS]

## オペレーション概要

### 目的
コンサルタントの現在のスキルレベルと市場ニーズ・キャリア目標のギャップを分析し、体系的な学習計画と実践機会を提供することで、組織の競争力強化と個人の成長を実現する

### ビジネス価値
- **競争力向上**: 最新スキル保有者30%増加、案件受注率15%向上、単価10%向上
- **生産性向上**: スキル向上による作業効率20%改善、品質問題30%削減
- **従業員満足度**: キャリア成長実感により離職率40%減少、エンゲージメント25%向上

### 実行頻度
- **頻度**: 年次（スキル開発計画策定）、四半期（進捗レビュー）、月次（学習活動）
- **トリガー**: 年次評価、新技術導入、プロジェクト完了後、本人希望
- **所要時間**: 計画策定（1週間）、学習活動（継続的）

## ロールと責任

### 関与者
- スキル開発マネージャー [SkillDevelopmentManager] [SKILL_DEVELOPMENT_MANAGER]
  - 責任: スキル開発戦略策定、プログラム設計、効果測定
  - 権限: 予算配分、外部研修承認、講師アサイン

- コンサルタント [Consultant] [CONSULTANT]
  - 責任: 学習計画実行、スキル習得、知識共有
  - 権限: 学習コンテンツ選択、時間配分調整

- 上司 [Supervisor] [SUPERVISOR]
  - 責任: 部下の成長支援、実践機会提供、進捗確認
  - 権限: 業務時間配分、OJT機会提供

- メンター [Mentor] [MENTOR]
  - 責任: 技術指導、キャリアアドバイス、モチベーション支援
  - 権限: 指導方法選択、フィードバック提供

### RACI マトリクス
| ステップ | SDM | コンサルタント | 上司 | メンター |
|---------|-----|--------------|------|----------|
| ニーズ分析 | R | C | C | I |
| 計画策定 | A | R | C | C |
| 学習実施 | I | R | C | C |
| 実践適用 | I | R | A | C |
| 効果測定 | R | C | C | I |
| 認定・評価 | A | C | R | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：スキル開発サイクル]
  ↓
[ステップ1：スキルギャップ分析]
  ↓
[ステップ2：学習計画策定]
  ↓
[ステップ3：学習リソース準備]
  ↓
[ステップ4：学習実施]
  ↓
[ステップ5：実践適用]
  ↓
[ステップ6：スキル評価・認定]
  ↓
[判断：目標達成？]
  ↓ Yes                 ↓ No
[ステップ7：知識共有]   [ステップ4へ戻る]
  ↓
[終了：スキル開発完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: スキルギャップ分析 [AnalyzeSkillGap] [ANALYZE_SKILL_GAP]
- **目的**: 現在のスキルレベルと目標レベルのギャップを明確化
- **入力**: スキル評価結果、市場動向、キャリア目標
- **活動**:
  1. 現在のスキルレベルの棚卸し（自己評価・360度評価）
  2. 市場で求められるスキルの調査
  3. 組織戦略に必要なスキルの特定
  4. キャリア目標に必要なスキルの明確化
  5. ギャップの定量化と優先順位付け
  6. 学習可能性と投資対効果の評価
- **出力**: スキルギャップ分析レポート、優先開発スキルリスト
- **所要時間**: 3-5日

#### ステップ2: 学習計画策定 [CreateLearningPlan] [CREATE_LEARNING_PLAN]
- **目的**: 効果的かつ実現可能な個別学習計画を作成
- **入力**: スキルギャップ分析レポート、利用可能リソース、業務スケジュール
- **活動**:
  1. 学習目標の具体化（SMART目標設定）
  2. 学習方法の選定（研修、自習、OJT、メンタリング）
  3. 学習スケジュールの作成（マイルストーン設定）
  4. 必要リソースの特定（時間、予算、教材）
  5. 実践機会の計画（プロジェクトアサイン）
  6. 成功指標の定義
- **出力**: 個別学習計画書、学習ロードマップ
- **所要時間**: 2-3日

#### ステップ3: 学習リソース準備 [PrepareLearningResources] [PREPARE_LEARNING_RESOURCES]
- **目的**: 学習に必要な教材・環境・支援体制を整備
- **入力**: 個別学習計画書、予算、利用可能リソース
- **活動**:
  1. 教材・コースの選定と購入
  2. 学習環境の整備（ツール、ソフトウェア）
  3. メンター・講師のアサイン
  4. 学習コミュニティへの参加手続き
  5. 学習時間の確保（業務調整）
  6. 学習支援システムの設定
- **出力**: 学習環境、教材一式、支援体制
- **所要時間**: 1週間

#### ステップ4: 学習実施 [ExecuteLearning] [EXECUTE_LEARNING]
- **目的**: 計画に基づいて体系的に知識・スキルを習得
- **入力**: 学習計画、教材、学習環境
- **活動**:
  1. 座学・オンライン学習の実施
  2. ハンズオン演習の実施
  3. メンターセッションへの参加
  4. 学習コミュニティでの議論
  5. 学習進捗の記録と振り返り
  6. 疑問点の解消と理解度確認
- **出力**: 学習記録、習得知識、演習成果物
- **所要時間**: 継続的（週5-10時間×数ヶ月）

#### ステップ5: 実践適用 [ApplyInPractice] [APPLY_IN_PRACTICE]
- **目的**: 習得した知識・スキルを実際のプロジェクトで活用
- **入力**: 習得知識、実践機会（プロジェクト）
- **活動**:
  1. 適切な実践機会の選定
  2. 小規模タスクでの試行
  3. メンター監督下での実践
  4. 独立してのスキル適用
  5. 実践結果の記録と分析
  6. 改善点の特定と対策
- **出力**: 実践成果、適用事例、改善提案
- **所要時間**: 1-3ヶ月

#### ステップ6: スキル評価・認定 [EvaluateAndCertify] [EVALUATE_AND_CERTIFY]
- **目的**: 習得したスキルレベルを客観的に評価し認定
- **入力**: 学習記録、実践成果、評価基準
- **活動**:
  1. スキル評価テストの実施
  2. 実践成果のレビュー
  3. 360度フィードバックの収集
  4. スキルレベルの判定
  5. 認定証の発行（該当する場合）
  6. スキルマトリクスの更新
- **出力**: スキル評価結果、認定証、更新されたスキルプロファイル
- **所要時間**: 1週間

#### ステップ7: 知識共有 [ShareKnowledge] [SHARE_KNOWLEDGE]
- **目的**: 習得した知識を組織に還元し全体のレベル向上に貢献
- **入力**: 習得知識、実践経験、成功事例
- **活動**:
  1. ナレッジ記事の作成
  2. 社内勉強会の開催
  3. メンターとしての後進指導
  4. ベストプラクティスの文書化
  5. CoE（Center of Excellence）への参加
  6. 外部発表・執筆活動
- **出力**: ナレッジベース、勉強会資料、指導実績
- **所要時間**: 継続的

## 状態遷移

### 状態定義
- 未開始 [NotStarted] [NOT_STARTED]: スキル開発の必要性は認識されたが未着手
- 分析中 [Analyzing] [ANALYZING]: スキルギャップを分析中
- 計画中 [Planning] [PLANNING]: 学習計画を策定中
- 準備中 [Preparing] [PREPARING]: 学習リソースを準備中
- 学習中 [Learning] [LEARNING]: 積極的に学習活動を実施中
- 実践中 [Practicing] [PRACTICING]: 実務でスキルを適用中
- 評価中 [Evaluating] [EVALUATING]: スキルレベルを評価中
- 完了 [Completed] [COMPLETED]: 目標スキルレベルに到達

### 遷移条件
\`\`\`
未開始 --[開発承認]--> 分析中
分析中 --[ギャップ特定]--> 計画中
計画中 --[計画承認]--> 準備中
準備中 --[リソース確保]--> 学習中
学習中 --[知識習得完了]--> 実践中
実践中 --[実践期間終了]--> 評価中
評価中 --[目標達成]--> 完了
評価中 --[目標未達]--> 学習中
学習中 --[中断]--> 未開始
\`\`\`

## ビジネスルール

### 事前条件
1. スキル開発の目的と目標が明確である
2. 学習に必要な時間が確保されている
3. 予算が承認されている
4. 本人の学習意欲が確認されている

### 実行中の制約
1. 業務時間の20%を上限として学習時間に充当可能
2. 外部研修は年間予算枠内で実施
3. 実践適用は実プロジェクトへの影響を最小化
4. 機密情報を含む学習内容は社内に限定
5. 認定試験は2回まで会社負担で受験可能

### 事後条件
1. スキルレベルがスキルマトリクスに反映されている
2. 学習成果がナレッジベースに蓄積されている
3. ROI（投資対効果）が測定されている
4. 次の学習計画が検討されている
5. 組織の専門性が向上している

## パラソルドメインモデル

### エンティティ定義
- スキル開発計画 [SkillDevelopmentPlan] [SKILL_DEVELOPMENT_PLAN]
  - 計画ID、コンサルタントID、対象スキル、目標レベル、期限、状態
- 学習活動 [LearningActivity] [LEARNING_ACTIVITY]
  - 活動ID、計画ID、活動種別、内容、実施日、時間、成果
- スキル評価 [SkillAssessment] [SKILL_ASSESSMENT]
  - 評価ID、コンサルタントID、スキルID、評価日、レベル、評価者
- 学習リソース [LearningResource] [LEARNING_RESOURCE]
  - リソースID、種別、名称、提供者、費用、利用可能期間

### 値オブジェクト
- スキルレベル [SkillLevel] [SKILL_LEVEL]
  - 初級、中級、上級、エキスパート、マスター
- 学習方法 [LearningMethod] [LEARNING_METHOD]
  - 座学、eラーニング、OJT、メンタリング、自己学習

## KPI

1. **スキル習得率**: 計画したスキルの習得達成率
   - 目標値: 85%以上
   - 測定方法: (習得完了スキル数 / 計画スキル数) × 100
   - 測定頻度: 四半期

2. **学習ROI**: スキル開発投資に対する収益貢献
   - 目標値: 300%以上
   - 測定方法: (スキル向上による収益増加 / 学習投資額) × 100
   - 測定頻度: 年次

3. **実践適用率**: 学習したスキルの実務適用割合
   - 目標値: 70%以上
   - 測定方法: (実務で活用されたスキル数 / 学習完了スキル数) × 100
   - 測定頻度: 半期

4. **知識共有貢献度**: 習得知識の組織還元レベル
   - 目標値: 平均3.5以上（5段階）
   - 測定方法: 知識共有活動の質と量の総合評価
   - 測定頻度: 年次

5. **スキル充足率**: 必要スキルに対する保有率
   - 目標値: 90%以上
   - 測定方法: (保有スキル数 / 必要スキル数) × 100
   - 測定頻度: 四半期`,
      pattern: 'Development',
      goal: 'コンサルタントのスキルギャップを分析し、体系的な学習と実践を通じて組織の競争力を強化する',
      roles: JSON.stringify([
        { name: 'SkillDevelopmentManager', displayName: 'スキル開発マネージャー', systemName: 'SKILL_DEVELOPMENT_MANAGER' },
        { name: 'Consultant', displayName: 'コンサルタント', systemName: 'CONSULTANT' },
        { name: 'Supervisor', displayName: '上司', systemName: 'SUPERVISOR' },
        { name: 'Mentor', displayName: 'メンター', systemName: 'MENTOR' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'AnalyzeSkillGap', displayName: 'スキルギャップ分析', systemName: 'ANALYZE_SKILL_GAP' },
          { name: 'CreateLearningPlan', displayName: '学習計画策定', systemName: 'CREATE_LEARNING_PLAN' },
          { name: 'PrepareLearningResources', displayName: '学習リソース準備', systemName: 'PREPARE_LEARNING_RESOURCES' },
          { name: 'ExecuteLearning', displayName: '学習実施', systemName: 'EXECUTE_LEARNING' },
          { name: 'ApplyInPractice', displayName: '実践適用', systemName: 'APPLY_IN_PRACTICE' },
          { name: 'EvaluateAndCertify', displayName: 'スキル評価・認定', systemName: 'EVALUATE_AND_CERTIFY' },
          { name: 'ShareKnowledge', displayName: '知識共有', systemName: 'SHARE_KNOWLEDGE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotStarted', displayName: '未開始', systemName: 'NOT_STARTED' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Preparing', displayName: '準備中', systemName: 'PREPARING' },
        { name: 'Learning', displayName: '学習中', systemName: 'LEARNING' },
        { name: 'Practicing', displayName: '実践中', systemName: 'PRACTICING' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}