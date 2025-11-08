import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedVisualizeAndControlProgress(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 進捗を可視化して統制する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'VisualizeAndControlProgress',
      displayName: '進捗を可視化して統制する',
      design: `# ビジネスオペレーション: 進捗を可視化して統制する [VisualizeAndControlProgress] [VISUALIZE_AND_CONTROL_PROGRESS]

## オペレーション概要

### 目的
プロジェクトの進行状況をリアルタイムで可視化し、計画との差異を早期に発見して適切な是正措置を講じることで、プロジェクトを計画通りに完遂する

### ビジネス価値
- **効率性向上**: 進捗報告作成時間を60%削減、問題発見の早期化により手戻り40%削減
- **品質向上**: スケジュール遵守率85%達成、成果物納期遵守率95%向上
- **透明性向上**: ステークホルダー満足度30%向上、信頼関係の強化

### 実行頻度
- **頻度**: 日次（チーム内）、週次（ステークホルダー向け）、マイルストーン毎
- **トリガー**: 定例進捗会議、計画からの逸脱検知、ステークホルダー要請
- **所要時間**: 日次（30分）、週次（2時間）、月次（4時間）

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 進捗管理全体の統括、是正措置の決定、ステークホルダー報告
  - 権限: プロジェクト計画の調整、リソース再配置、エスカレーション

- チームリーダー [TeamLeader] [TEAM_LEADER]
  - 責任: チーム進捗の収集・分析、日次進捗管理、問題の早期発見
  - 権限: タスク優先順位調整、チーム内リソース調整

- プロジェクトメンバー [ProjectMember] [PROJECT_MEMBER]
  - 責任: タスク進捗の報告、課題の報告、実績工数の入力
  - 権限: タスク状況の更新、課題の登録

- ステークホルダー [Stakeholder] [STAKEHOLDER]
  - 責任: 進捗の確認、重要な意思決定、追加リソースの承認
  - 権限: 計画変更の承認、優先順位の最終決定

### RACI マトリクス
| ステップ | PM | TL | メンバー | ステークホルダー |
|---------|----|----|---------|----------------|
| 進捗収集 | I | R | C | I |
| 進捗分析 | R | C | I | I |
| 差異評価 | R | C | I | I |
| 是正策定 | R | C | C | I |
| 進捗報告 | R | C | I | A |
| 是正実行 | A | R | C | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：進捗管理サイクル]
  ↓
[ステップ1：進捗データ収集]
  ↓
[ステップ2：進捗分析・可視化]
  ↓
[ステップ3：計画差異評価]
  ↓
[判断：重大な遅延？]
  ↓ Yes                     ↓ No
[ステップ4：是正措置策定]     [ステップ5へ]
  ↓
[ステップ5：進捗報告]
  ↓
[ステップ6：是正措置実行]
  ↓
[ステップ7：効果モニタリング]
  ↓
[終了：次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: 進捗データ収集 [CollectProgressData] [COLLECT_PROGRESS_DATA]
- **目的**: プロジェクトの最新進捗情報を正確に収集
- **入力**: タスク一覧、前回進捗報告
- **活動**:
  1. タスク完了状況の確認（完了率、残作業）
  2. 実績工数の収集（日次工数入力）
  3. 成果物の完成度確認
  4. 課題・リスクの更新情報収集
  5. メンバーからの定性的フィードバック収集
- **出力**: 進捗生データ（タスク別進捗、工数実績、課題一覧）
- **所要時間**: 30分-1時間

#### ステップ2: 進捗分析・可視化 [AnalyzeAndVisualizeProgress] [ANALYZE_AND_VISUALIZE_PROGRESS]
- **目的**: 収集データを分析し直感的に理解できる形で可視化
- **入力**: 進捗生データ、プロジェクト計画
- **活動**:
  1. 進捗率の算出（EV法：計画価値vs実績価値）
  2. バーンダウンチャートの更新
  3. ガントチャートへの実績反映
  4. クリティカルパスの再評価
  5. リソース稼働状況の可視化
  6. KPIダッシュボードの更新
- **出力**: 進捗ダッシュボード、各種チャート、KPI実績値
- **所要時間**: 1-2時間

#### ステップ3: 計画差異評価 [EvaluatePlanVariance] [EVALUATE_PLAN_VARIANCE]
- **目的**: 計画と実績の差異を定量的に評価し問題を特定
- **入力**: 進捗ダッシュボード、ベースライン計画
- **活動**:
  1. スケジュール差異分析（SV: Schedule Variance）
  2. コスト差異分析（CV: Cost Variance）
  3. 品質差異分析（欠陥密度、レビュー指摘数）
  4. スコープ差異分析（要求変更の影響）
  5. 差異の根本原因分析
  6. 将来予測（完了時期、最終コスト）
- **出力**: 差異分析レポート、問題リスト、予測値
- **所要時間**: 1-2時間

#### ステップ4: 是正措置策定 [DevelopCorrectiveActions] [DEVELOP_CORRECTIVE_ACTIONS]
- **目的**: 特定された問題に対する効果的な是正措置を立案
- **入力**: 差異分析レポート、利用可能リソース
- **活動**:
  1. 是正オプションの洗い出し
  2. 各オプションの影響分析（期間、コスト、品質）
  3. リソース追加投入の検討
  4. スケジュール圧縮技法の適用（クラッシング、ファストトラック）
  5. スコープ調整の検討
  6. 推奨是正措置の選定
- **出力**: 是正措置計画（アクション、責任者、期限）
- **所要時間**: 2-3時間

#### ステップ5: 進捗報告 [ReportProgress] [REPORT_PROGRESS]
- **目的**: ステークホルダーに進捗状況を正確に伝達
- **入力**: 進捗ダッシュボード、差異分析、是正措置計画
- **活動**:
  1. 報告資料の作成（エグゼクティブサマリー）
  2. 主要KPIのハイライト
  3. 重要な成果と課題の整理
  4. 推奨アクションの説明
  5. ステークホルダー会議の実施
  6. フィードバックの収集と記録
- **出力**: 進捗報告書、会議議事録、承認されたアクション
- **所要時間**: 1-2時間

#### ステップ6: 是正措置実行 [ExecuteCorrectiveActions] [EXECUTE_CORRECTIVE_ACTIONS]
- **目的**: 承認された是正措置を迅速に実行
- **入力**: 承認された是正措置計画
- **活動**:
  1. 実行チームへの指示展開
  2. リソースの再配置実施
  3. 計画の更新と再ベースライン化
  4. 関係者への変更通知
  5. 実行進捗のトラッキング開始
  6. 早期の問題兆候監視
- **出力**: 更新された計画、実行状況記録
- **所要時間**: 継続的

#### ステップ7: 効果モニタリング [MonitorEffectiveness] [MONITOR_EFFECTIVENESS]
- **目的**: 是正措置の効果を継続的に監視し改善
- **入力**: 是正措置実行記録、新規進捗データ
- **活動**:
  1. 是正措置の効果測定
  2. 新たな進捗トレンド分析
  3. 追加調整の必要性評価
  4. ベストプラクティスの抽出
  5. プロセス改善提案
- **出力**: 効果測定レポート、改善提案
- **所要時間**: 1時間

## 状態遷移

### 状態定義
- 計画通り [OnTrack] [ON_TRACK]: 許容範囲内で進行中
- 軽微遅延 [MinorDelay] [MINOR_DELAY]: 5%未満の遅延
- 遅延警告 [DelayWarning] [DELAY_WARNING]: 5-10%の遅延
- 重大遅延 [CriticalDelay] [CRITICAL_DELAY]: 10%以上の遅延
- 是正中 [Correcting] [CORRECTING]: 是正措置実行中
- 回復中 [Recovering] [RECOVERING]: 遅延を取り戻し中
- 完了 [Completed] [COMPLETED]: フェーズ/プロジェクト完了

### 遷移条件
\`\`\`
計画通り --[遅延発生]--> 軽微遅延
軽微遅延 --[遅延拡大]--> 遅延警告
遅延警告 --[さらに悪化]--> 重大遅延
重大遅延 --[是正開始]--> 是正中
是正中 --[改善傾向]--> 回復中
回復中 --[計画復帰]--> 計画通り
任意状態 --[完了条件達成]--> 完了
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクト計画とベースラインが確定している
2. 進捗報告の体制とツールが整備されている
3. KPIと許容値が定義されている
4. エスカレーションパスが明確である

### 実行中の制約
1. 進捗率は客観的な指標（EV法等）で測定する
2. 5%以上の遅延は24時間以内にエスカレーション
3. 是正措置は必ずコスト・品質への影響を評価
4. ステークホルダー報告は事実に基づき透明性を保つ
5. 計画変更は正式な変更管理プロセスに従う

### 事後条件
1. 全てのタスク進捗が最新状態に更新されている
2. ステークホルダーが現状を正確に把握している
3. 必要な是正措置が実行されている
4. 次回報告までのアクションが明確である
5. 教訓が記録され共有されている

## パラソルドメインモデル

### エンティティ定義
- 進捗報告 [ProgressReport] [PROGRESS_REPORT]
  - 報告ID、プロジェクトID、報告日、進捗率、状態、サマリー
- 進捗指標 [ProgressMetric] [PROGRESS_METRIC]
  - 指標ID、報告ID、KPI種別、計画値、実績値、差異
- 是正措置 [CorrectiveAction] [CORRECTIVE_ACTION]
  - 措置ID、報告ID、内容、責任者、期限、状態
- 進捗履歴 [ProgressHistory] [PROGRESS_HISTORY]
  - 履歴ID、プロジェクトID、記録日時、進捗率推移

### 値オブジェクト
- 進捗差異 [ProgressVariance] [PROGRESS_VARIANCE]
  - スケジュール差異（SV）、コスト差異（CV）、差異率
- KPI実績 [KPIActual] [KPI_ACTUAL]
  - 計画値（PV）、実績値（EV）、実コスト（AC）

## KPI

1. **スケジュール遵守率**: マイルストーンの期限内達成率
   - 目標値: 90%以上
   - 測定方法: (期限内完了マイルストーン数 / 全マイルストーン数) × 100
   - 測定頻度: 月次

2. **進捗報告精度**: 報告進捗率と実際の完成度の乖離
   - 目標値: ±5%以内
   - 測定方法: |報告進捗率 - 実際完成度| の平均
   - 測定頻度: 週次

3. **是正措置効果率**: 是正措置により改善した遅延の割合
   - 目標値: 80%以上
   - 測定方法: (改善された遅延数 / 全是正措置数) × 100
   - 測定頻度: 月次

4. **早期問題発見率**: 重大化前に発見された問題の割合
   - 目標値: 85%以上
   - 測定方法: (早期発見問題数 / 全問題数) × 100
   - 測定頻度: 週次`,
      pattern: 'Monitoring',
      goal: 'プロジェクトの進行状況をリアルタイムで可視化し、計画との差異を早期発見して適切な是正措置を講じる',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'TeamLeader', displayName: 'チームリーダー', systemName: 'TEAM_LEADER' },
        { name: 'ProjectMember', displayName: 'プロジェクトメンバー', systemName: 'PROJECT_MEMBER' },
        { name: 'Stakeholder', displayName: 'ステークホルダー', systemName: 'STAKEHOLDER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CollectProgressData', displayName: '進捗データ収集', systemName: 'COLLECT_PROGRESS_DATA' },
          { name: 'AnalyzeAndVisualizeProgress', displayName: '進捗分析・可視化', systemName: 'ANALYZE_AND_VISUALIZE_PROGRESS' },
          { name: 'EvaluatePlanVariance', displayName: '計画差異評価', systemName: 'EVALUATE_PLAN_VARIANCE' },
          { name: 'DevelopCorrectiveActions', displayName: '是正措置策定', systemName: 'DEVELOP_CORRECTIVE_ACTIONS' },
          { name: 'ReportProgress', displayName: '進捗報告', systemName: 'REPORT_PROGRESS' },
          { name: 'ExecuteCorrectiveActions', displayName: '是正措置実行', systemName: 'EXECUTE_CORRECTIVE_ACTIONS' },
          { name: 'MonitorEffectiveness', displayName: '効果モニタリング', systemName: 'MONITOR_EFFECTIVENESS' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'OnTrack', displayName: '計画通り', systemName: 'ON_TRACK' },
        { name: 'MinorDelay', displayName: '軽微遅延', systemName: 'MINOR_DELAY' },
        { name: 'DelayWarning', displayName: '遅延警告', systemName: 'DELAY_WARNING' },
        { name: 'CriticalDelay', displayName: '重大遅延', systemName: 'CRITICAL_DELAY' },
        { name: 'Correcting', displayName: '是正中', systemName: 'CORRECTING' },
        { name: 'Recovering', displayName: '回復中', systemName: 'RECOVERING' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}