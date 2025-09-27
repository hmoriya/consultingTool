import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAllocateResourcesOptimally(service: any, capability: any) {
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
プロジェクトの成功に必要なスキルと経験を持つメンバーを適切なタイミングで適切な配分で配置し、チームの生産性を最大化しながらメンバーの成長機会も実現する

### ビジネス価値
- **効率性向上**: リソース稼働率を85%に最適化、プロジェクト間の重複を30%削減
- **品質向上**: スキルマッチング精度90%達成、デリバリー品質20%向上
- **人材育成**: メンバー満足度向上、スキル開発機会50%増加、離職率20%削減

### 実行頻度
- **頻度**: プロジェクト開始時、月次リソース調整、メンバー変更時
- **トリガー**: 新規プロジェクト開始、リソース不足検知、スキルギャップ発生
- **所要時間**: 初期配置（1-2日）、月次調整（2-3時間）

## ロールと責任

### 関与者
- リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]
  - 責任: 全社リソースプールの管理、配置最適化、競合解決
  - 権限: リソース配置決定、優先順位調整、外部調達承認

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: リソース要求定義、チーム編成、配分率調整
  - 権限: プロジェクトリソース要求、メンバー評価

- チームリーダー [TeamLeader] [TEAM_LEADER]
  - 責任: チームスキル評価、育成計画、パフォーマンス管理
  - 権限: チーム内配置、タスク割当、育成機会提供

- メンバー [Member] [MEMBER]
  - 責任: スキル情報更新、稼働状況報告、成長目標設定
  - 権限: 配置希望表明、スキル開発要望

### RACI マトリクス
| ステップ | RM | PM | TL | メンバー |
|---------|----|----|----| --------|
| リソース要求収集 | A | R | C | I |
| スキルマッチング | R | C | C | I |
| 配置計画策定 | R | C | C | C |
| 競合調整 | R | C | I | I |
| 配置実行 | R | I | C | A |
| 効果測定 | R | C | C | I |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：リソース配置要求]
  ↓
[ステップ1：リソース要求収集]
  ↓
[ステップ2：スキルマッチング分析]
  ↓
[ステップ3：配置シナリオ策定]
  ↓
[判断：競合あり？]
  ↓ Yes                     ↓ No
[ステップ4：競合調整]       [ステップ5へ]
  ↓
[ステップ5：配置実行]
  ↓
[ステップ6：配置効果測定]
  ↓
[終了：最適配置完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: リソース要求収集 [CollectResourceRequests] [COLLECT_RESOURCE_REQUESTS]
- **目的**: プロジェクトに必要なリソースの質と量を明確化
- **入力**: プロジェクト計画、WBS、スキル要件定義
- **活動**:
  1. 必要スキルセットの詳細化（技術、業務知識、ソフトスキル）
  2. 必要期間と配分率の定義（フェーズ別）
  3. 優先度と制約条件の明確化
  4. チーム構成の理想形定義
  5. 代替要件の設定（スキルレベル、経験年数）
- **出力**: リソース要求書（スキル、期間、配分率、優先度）
- **所要時間**: 4-8時間

#### ステップ2: スキルマッチング分析 [AnalyzeSkillMatching] [ANALYZE_SKILL_MATCHING]
- **目的**: 要求に最適なメンバーを特定し適合度を評価
- **入力**: リソース要求書、メンバースキルDB、稼働状況
- **活動**:
  1. スキルインベントリとの照合
  2. 稼働可能性の確認（現在・将来）
  3. 適合度スコアリング（技術70%、経験20%、志向10%）
  4. 育成機会の観点での評価
  5. チーム相性の考慮
- **出力**: 候補者リスト（適合度スコア、稼働可能性、推奨理由）
- **所要時間**: 2-4時間

#### ステップ3: 配置シナリオ策定 [DevelopAllocationScenarios] [DEVELOP_ALLOCATION_SCENARIOS]
- **目的**: 複数の配置案を作成し最適解を見つける
- **入力**: 候補者リスト、プロジェクト優先度、制約条件
- **活動**:
  1. ベストケースシナリオ作成（理想的配置）
  2. 現実的シナリオ作成（制約考慮）
  3. 育成重視シナリオ作成（成長機会最大化）
  4. 各シナリオの影響分析
  5. リスクと機会の評価
- **出力**: 配置シナリオ比較表（メリット、デメリット、リスク）
- **所要時間**: 3-4時間

#### ステップ4: 競合調整 [ResolveConflicts] [RESOLVE_CONFLICTS]
- **目的**: 複数プロジェクト間のリソース競合を解決
- **入力**: 競合リスト、プロジェクト優先度、ビジネス影響
- **活動**:
  1. 競合の影響度評価（各プロジェクトへの影響）
  2. 調整オプションの検討（配分率調整、期間調整、代替要員）
  3. ステークホルダー協議
  4. Win-Win解の探索
  5. 最終調整案の合意形成
- **出力**: 調整済み配置計画、合意文書
- **所要時間**: 2-4時間

#### ステップ5: 配置実行 [ExecuteAllocation] [EXECUTE_ALLOCATION]
- **目的**: 決定した配置を実際に実行し関係者に周知
- **入力**: 承認済み配置計画
- **活動**:
  1. 配置通知の作成と送付
  2. 引き継ぎ計画の策定（現プロジェクトからの離任）
  3. オンボーディング計画の作成
  4. システムへの配置情報反映
  5. キックオフミーティングの設定
- **出力**: 配置完了通知、引き継ぎ・オンボーディング計画
- **所要時間**: 1-2日

#### ステップ6: 配置効果測定 [MeasureAllocationEffectiveness] [MEASURE_ALLOCATION_EFFECTIVENESS]
- **目的**: 配置の効果を測定し継続的な最適化を実現
- **入力**: 配置実績、パフォーマンスデータ
- **活動**:
  1. 稼働率の測定（計画vs実績）
  2. 生産性指標の測定
  3. スキルマッチング精度の評価
  4. メンバー満足度の調査
  5. 改善機会の特定
- **出力**: 効果測定レポート、改善提案
- **所要時間**: 2-3時間

## 状態遷移

### 状態定義
- 要求受付 [RequestReceived] [REQUEST_RECEIVED]: リソース要求を受け付けた
- 分析中 [Analyzing] [ANALYZING]: スキルマッチング分析中
- 計画中 [Planning] [PLANNING]: 配置シナリオ策定中
- 調整中 [Adjusting] [ADJUSTING]: 競合調整中
- 承認待ち [PendingApproval] [PENDING_APPROVAL]: 配置計画の承認待ち
- 実行中 [Executing] [EXECUTING]: 配置を実行中
- 配置完了 [Allocated] [ALLOCATED]: 配置が完了した
- 評価中 [Evaluating] [EVALUATING]: 効果を評価中

### 遷移条件
\`\`\`
要求受付 --[要求確定]--> 分析中
分析中 --[候補者特定]--> 計画中
計画中 --[競合なし]--> 承認待ち
計画中 --[競合あり]--> 調整中
調整中 --[調整完了]--> 承認待ち
承認待ち --[承認]--> 実行中
承認待ち --[却下]--> 計画中
実行中 --[配置完了]--> 配置完了
配置完了 --[評価開始]--> 評価中
評価中 --[評価完了]--> [終了]
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクトの要員計画が承認されている
2. メンバーのスキル情報が最新化されている
3. 稼働状況が正確に把握されている
4. リソース配置の権限が明確化されている

### 実行中の制約
1. 稼働率は100%を超えない（最大95%を推奨）
2. 重要プロジェクトには必ずシニアメンバーを配置
3. 単一プロジェクトへの配分は最低20%以上
4. 育成枠として各プロジェクトに1名以上のジュニアを配置
5. 同一メンバーの同時プロジェクト数は3つまで

### 事後条件
1. 全ての要求に対して配置または代替案が提示されている
2. 配置情報がシステムに反映されている
3. 関係者全員に配置が通知されている
4. 引き継ぎ計画が作成されている
5. 配置の効果測定計画が設定されている

## パラソルドメインモデル

### エンティティ定義
- リソース要求 [ResourceRequest] [RESOURCE_REQUEST]
  - 要求ID、プロジェクトID、スキル要件、期間、配分率、優先度
- リソース配置 [ResourceAllocation] [RESOURCE_ALLOCATION]
  - 配置ID、要求ID、メンバーID、開始日、終了日、配分率
- スキルプロファイル [SkillProfile] [SKILL_PROFILE]
  - プロファイルID、メンバーID、スキルリスト、経験レベル
- 配置履歴 [AllocationHistory] [ALLOCATION_HISTORY]
  - 履歴ID、配置ID、変更日時、変更内容、変更理由

### 値オブジェクト
- スキル適合度 [SkillFitScore] [SKILL_FIT_SCORE]
  - 技術スコア、経験スコア、総合スコア（0-100）
- 稼働率 [UtilizationRate] [UTILIZATION_RATE]
  - 現在稼働率、予定稼働率、推奨上限

## KPI

1. **リソース稼働率**: 全メンバーの平均稼働率
   - 目標値: 80-85%
   - 測定方法: (実稼働時間 / 利用可能時間) × 100
   - 測定頻度: 月次

2. **スキルマッチング精度**: 要求スキルと配置メンバースキルの適合度
   - 目標値: 85%以上
   - 測定方法: 平均スキル適合度スコア
   - 測定頻度: プロジェクト開始時

3. **配置リードタイム**: 要求から配置完了までの日数
   - 目標値: 5営業日以内
   - 測定方法: 配置完了日 - 要求受付日
   - 測定頻度: 配置毎

4. **メンバー満足度**: 配置に対するメンバーの満足度
   - 目標値: 4.0/5.0以上
   - 測定方法: 配置後アンケート（5段階評価）
   - 測定頻度: 四半期

5. **育成機会提供率**: 成長機会を含む配置の割合
   - 目標値: 30%以上
   - 測定方法: (育成要素含む配置数 / 全配置数) × 100
   - 測定頻度: 四半期`,
      pattern: 'Optimization',
      goal: '必要なスキルと経験を持つメンバーを適切なタイミングで配置し、チーム生産性を最大化する',
      roles: JSON.stringify([
        { name: 'ResourceManager', displayName: 'リソースマネージャー', systemName: 'RESOURCE_MANAGER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'TeamLeader', displayName: 'チームリーダー', systemName: 'TEAM_LEADER' },
        { name: 'Member', displayName: 'メンバー', systemName: 'MEMBER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CollectResourceRequests', displayName: 'リソース要求収集', systemName: 'COLLECT_RESOURCE_REQUESTS' },
          { name: 'AnalyzeSkillMatching', displayName: 'スキルマッチング分析', systemName: 'ANALYZE_SKILL_MATCHING' },
          { name: 'DevelopAllocationScenarios', displayName: '配置シナリオ策定', systemName: 'DEVELOP_ALLOCATION_SCENARIOS' },
          { name: 'ResolveConflicts', displayName: '競合調整', systemName: 'RESOLVE_CONFLICTS' },
          { name: 'ExecuteAllocation', displayName: '配置実行', systemName: 'EXECUTE_ALLOCATION' },
          { name: 'MeasureAllocationEffectiveness', displayName: '配置効果測定', systemName: 'MEASURE_ALLOCATION_EFFECTIVENESS' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'RequestReceived', displayName: '要求受付', systemName: 'REQUEST_RECEIVED' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Adjusting', displayName: '調整中', systemName: 'ADJUSTING' },
        { name: 'PendingApproval', displayName: '承認待ち', systemName: 'PENDING_APPROVAL' },
        { name: 'Executing', displayName: '実行中', systemName: 'EXECUTING' },
        { name: 'Allocated', displayName: '配置完了', systemName: 'ALLOCATED' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}