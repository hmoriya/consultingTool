import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAllocateResourcesOptimally(service: unknown, capability: unknown) {
  console.log('    Creating business operation: リソースを最適配置する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'AllocateResourcesOptimally',
      displayName: 'リソースを最適配置する',
      design: `# ビジネスオペレーション: リソースを最適配置する [AllocateResourcesOptimally] [ALLOCATE_RESOURCES_OPTIMALLY]

## オペレーション概要

### 目的
プロジェクトの要求スキルとコンサルタントの保有スキル・キャリア志向・稼働状況を総合的に考慮し、組織全体の生産性とメンバー満足度を最大化するリソース配置を実現する

### ビジネス価値
- **効率性向上**: スキルマッチングにより生産性30%向上、配置決定時間を従来の50%に短縮
- **品質向上**: スキルミスマッチによる品質問題を80%削減、プロジェクト成功率5%向上
- **満足度向上**: メンバーのキャリア志向を考慮した配置により従業員満足度20%向上

### 実行頻度
- **頻度**: プロジェクト開始時（必須）、プロジェクト途中の増員時（随時）
- **トリガー**: プロジェクトマネージャーからのリソース要請、既存メンバーの離脱
- **所要時間**: 1-2週間（プロジェクト規模とリソース数による）

## ロールと責任

### 関与者
- リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]
  - 責任: リソース配置の全体最適化、配置決定、調整
  - 権限: 配置決定権、優先順位決定権、稼働率管理

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: プロジェクトの要求スキル明確化、候補者評価
  - 権限: 最終的な受入可否判断

- コンサルタント [Consultant] [CONSULTANT]
  - 責任: スキル情報の最新化、キャリア志向の表明、配置承諾判断
  - 権限: 配置提案の受諾・辞退（正当な理由がある場合）

- チームリーダー [TeamLeader] [TEAM_LEADER]
  - 責任: チームメンバーの稼働状況報告、スキル評価
  - 権限: メンバーのリリース可否判断

### RACI マトリクス
| ステップ | RM | PM | コンサルタント | チームリーダー |
|---------|----|----|---------------|---------------|
| 要求収集 | A | R | I | I |
| スキルマッチング | R | C | I | C |
| 候補者選定 | R | C | I | C |
| 面談・合意形成 | A | C | R | C |
| 配置確定 | R | A | C | C |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：リソース要請] 
  ↓
[ステップ1：要求明確化] 
  ↓
[ステップ2：候補者抽出]
  ↓
[ステップ3：スキルマッチング評価]
  ↓
[ステップ4：稼働状況確認]
  ↓
[ステップ5：面談実施]
  ↓
[判断：配置可能？]
  ↓ Yes
[ステップ6：配置確定] → [終了：配置完了]
  ↓ No
[代替：条件交渉または候補者変更] → [ステップ3へ戻る]
\`\`\`

### 各ステップの詳細

#### ステップ1: 要求明確化 [ClarifyRequirements] [CLARIFY_REQUIREMENTS]
- **目的**: プロジェクトが必要とするスキル・経験・人数を明確化
- **入力**: リソース要請書、プロジェクト計画書
- **活動**:
  1. PMとのヒアリングミーティング実施
  2. 必要スキルの特定（必須/推奨/歓迎の3段階）
  3. 必要な経験年数とレベルの明確化
  4. 配置期間と稼働率の確認
  5. プロジェクト環境・文化的要件の把握
- **出力**: 詳細リソース要件定義書
- **所要時間**: 1-2日

#### ステップ2: 候補者抽出 [ExtractCandidates] [EXTRACT_CANDIDATES]
- **目的**: リソース要件に合致する可能性のあるコンサルタントをリストアップ
- **入力**: 詳細リソース要件定義書、スキルマトリクス、稼働状況データ
- **活動**:
  1. スキルマトリクスから必須スキル保有者を検索
  2. 経験年数とスキルレベルでフィルタリング
  3. 現在の稼働率を確認（80%未満を優先）
  4. 過去のプロジェクト実績を確認
  5. 地理的条件・稼働条件を考慮
- **出力**: 候補者リスト（10-20名程度）
- **所要時間**: 1日

#### ステップ3: スキルマッチング評価 [EvaluateSkillMatching] [EVALUATE_SKILL_MATCHING]
- **目的**: 各候補者とプロジェクト要件の適合度を定量評価
- **入力**: 候補者リスト、詳細リソース要件定義書
- **活動**:
  1. 必須スキルの充足度計算（0-100%）
  2. 推奨スキルのマッチング度計算
  3. 経験領域の類似度評価
  4. 過去の類似プロジェクト経験を評価
  5. 総合マッチングスコアを算出（加重平均）
- **出力**: スコア付き候補者リスト（上位5-10名）
- **所要時間**: 1-2日

#### ステップ4: 稼働状況確認 [ConfirmAvailability] [CONFIRM_AVAILABILITY]
- **目的**: 候補者の実際の稼働可能性と配置リスクを評価
- **入力**: スコア付き候補者リスト
- **活動**:
  1. 現在のプロジェクトの終了予定日確認
  2. 現チームリーダーへのリリース可否確認
  3. 候補者の休暇予定や研修予定の確認
  4. 他のプロジェクトからの要請との競合確認
  5. 配置リスク評価（配置遅延リスク、早期離脱リスク）
- **出力**: 稼働可能性レポート付き候補者リスト（上位3-5名）
- **所要時間**: 2-3日

#### ステップ5: 面談実施 [ConductInterviews] [CONDUCT_INTERVIEWS]
- **目的**: PMと候補者が相互に理解を深め、配置の合意を形成
- **入力**: 稼働可能性レポート付き候補者リスト
- **活動**:
  1. PM・候補者・リソースマネージャーの3者面談を設定
  2. プロジェクト概要と期待役割の説明
  3. 候補者のスキルと経験の確認
  4. 候補者のキャリア志向と配置意向のヒアリング
  5. 懸念事項や条件のすり合わせ
- **出力**: 面談評価レポート、候補者の配置意向
- **所要時間**: 3-5日（面談1人あたり1-2時間、複数候補を並行実施）

#### ステップ6: 配置確定 [FinalizeAllocation] [FINALIZE_ALLOCATION]
- **目的**: 配置を正式決定し、関係者に通知・手続きを実施
- **入力**: 面談評価レポート、候補者の配置意向
- **活動**:
  1. PM・候補者双方の合意を確認
  2. 現チームリーダーとリリース時期を調整
  3. リソース配分システムに配置情報を登録
  4. 候補者に正式な配置通知を送付
  5. 関係者（PM、チームリーダー、候補者）へ通知
- **出力**: 配置確定通知、リソース配分計画更新
- **所要時間**: 1-2日

## 状態遷移

### 状態定義
- 未開始 [NotStarted] [NOT_STARTED]: リソース要請が受理されたが配置作業未着手
- 要求分析中 [AnalyzingRequirements] [ANALYZING_REQUIREMENTS]: プロジェクト要件を分析中
- 候補者抽出中 [ExtractingCandidates] [EXTRACTING_CANDIDATES]: 候補者リストを作成中
- マッチング評価中 [EvaluatingMatching] [EVALUATING_MATCHING]: スキルマッチング評価実施中
- 面談調整中 [SchedulingInterviews] [SCHEDULING_INTERVIEWS]: 面談日程を調整中
- 面談中 [Interviewing] [INTERVIEWING]: 候補者面談を実施中
- 配置確定 [Allocated] [ALLOCATED]: 配置が正式に確定した
- 保留 [OnHold] [ON_HOLD]: 何らかの理由で配置が保留された

### 遷移条件
\`\`\`
未開始 --[リソース要請承認]--> 要求分析中
要求分析中 --[要件定義完了]--> 候補者抽出中
候補者抽出中 --[候補者リスト作成完了]--> マッチング評価中
マッチング評価中 --[トップ候補選定完了]--> 面談調整中
面談調整中 --[面談日程確定]--> 面談中
面談中 --[面談完了・合意形成]--> 配置確定
面談中 --[合意不成立]--> マッチング評価中
面談調整中 --[候補者全員が面談不可]--> 候補者抽出中
任意の状態 --[プロジェクト中断等]--> 保留
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクト計画が承認されリソース予算が確保されている
2. リソースマネージャーが任命されている
3. スキルマトリクスが最新状態に更新されている
4. 候補者の稼働状況が正確に記録されている

### 実行中の制約
1. コンサルタントの稼働率は100%を超えてはならない
2. 配置決定前に必ず候補者本人の意向を確認する
3. 現チームリーダーの承認なしに強制的にリリースしない
4. スキルマッチング率が70%未満の場合は配置を見送る
5. プロジェクト期間が1ヶ月未満の場合は簡易プロセスを適用可能

### 事後条件
1. 配置がリソース管理システムに正確に記録されている
2. 候補者に配置開始日までのオンボーディング計画が提供されている
3. 現プロジェクトからのリリース日程が確定している
4. 配置に関わる全関係者が通知を受け取っている
5. 配置理由とスキルマッチング評価が記録されている

## パラソルドメインモデル

### エンティティ定義
- リソース要請 [ResourceRequest] [RESOURCE_REQUEST]
  - 要請ID、プロジェクトID、要請日、必要人数、希望開始日、必要スキル、ステータス
- 候補者評価 [CandidateEvaluation] [CANDIDATE_EVALUATION]
  - 評価ID、要請ID、コンサルタントID、マッチングスコア、評価日、評価者
- リソース配分 [ResourceAllocation] [RESOURCE_ALLOCATION]
  - 配分ID、プロジェクトID、コンサルタントID、開始日、終了日、稼働率、配置理由
- 面談記録 [InterviewRecord] [INTERVIEW_RECORD]
  - 記録ID、要請ID、コンサルタントID、面談日、参加者、評価結果、候補者意向

### 値オブジェクト
- スキルマッチング評価 [SkillMatchingScore] [SKILL_MATCHING_SCORE]
  - 必須スキル充足率（%）、推奨スキルマッチ率（%）、経験類似度（1-5）、総合スコア（0-100）
- 稼働可能性 [Availability] [AVAILABILITY]
  - 現在稼働率（%）、リリース可能日、配置リスクレベル（低・中・高）

## KPI

1. **スキルマッチング率**: 配置されたコンサルタントのスキルマッチング度
   - 目標値: 90%以上
   - 測定方法: (マッチしたスキル数 / 必要スキル総数) × 100
   - 測定頻度: 配置確定時

2. **配置リードタイム**: 要請から配置確定までの日数
   - 目標値: 10営業日以内
   - 測定方法: 配置確定日 - 要請日
   - 測定頻度: 配置確定時

3. **初回提案承諾率**: 最初に提案した候補者が承諾した割合
   - 目標値: 80%以上
   - 測定方法: (初回提案で承諾された件数 / 全配置件数) × 100
   - 測定頻度: 月次

4. **配置満足度**: PM・コンサルタント双方の満足度
   - 目標値: 4.0/5.0以上
   - 測定方法: 配置後1ヶ月時点でのアンケート（5段階評価）
   - 測定頻度: 配置後1ヶ月`,
      pattern: 'Workflow',
      goal: 'プロジェクトの要求スキルとコンサルタントの保有スキル・キャリア志向を総合的に考慮し、組織全体の生産性を最大化するリソース配置を実現する',
      roles: JSON.stringify([
        { name: 'ResourceManager', displayName: 'リソースマネージャー', systemName: 'RESOURCE_MANAGER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'Consultant', displayName: 'コンサルタント', systemName: 'CONSULTANT' },
        { name: 'TeamLeader', displayName: 'チームリーダー', systemName: 'TEAM_LEADER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'ClarifyRequirements', displayName: '要求明確化', systemName: 'CLARIFY_REQUIREMENTS' },
          { name: 'ExtractCandidates', displayName: '候補者抽出', systemName: 'EXTRACT_CANDIDATES' },
          { name: 'EvaluateSkillMatching', displayName: 'スキルマッチング評価', systemName: 'EVALUATE_SKILL_MATCHING' },
          { name: 'ConfirmAvailability', displayName: '稼働状況確認', systemName: 'CONFIRM_AVAILABILITY' },
          { name: 'ConductInterviews', displayName: '面談実施', systemName: 'CONDUCT_INTERVIEWS' },
          { name: 'FinalizeAllocation', displayName: '配置確定', systemName: 'FINALIZE_ALLOCATION' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotStarted', displayName: '未開始', systemName: 'NOT_STARTED' },
        { name: 'AnalyzingRequirements', displayName: '要求分析中', systemName: 'ANALYZING_REQUIREMENTS' },
        { name: 'ExtractingCandidates', displayName: '候補者抽出中', systemName: 'EXTRACTING_CANDIDATES' },
        { name: 'EvaluatingMatching', displayName: 'マッチング評価中', systemName: 'EVALUATING_MATCHING' },
        { name: 'SchedulingInterviews', displayName: '面談調整中', systemName: 'SCHEDULING_INTERVIEWS' },
        { name: 'Interviewing', displayName: '面談中', systemName: 'INTERVIEWING' },
        { name: 'Allocated', displayName: '配置確定', systemName: 'ALLOCATED' },
        { name: 'OnHold', displayName: '保留', systemName: 'ON_HOLD' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}