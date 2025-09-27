import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAnticipateAndManageRisks(service: any, capability: any) {
  console.log('    Creating business operation: リスクを先読みして対処する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'AnticipateAndManageRisks',
      displayName: 'リスクを先読みして対処する',
      design: `# ビジネスオペレーション: リスクを先読みして対処する [AnticipateAndManageRisks] [ANTICIPATE_AND_MANAGE_RISKS]

## オペレーション概要

### 目的
プロジェクトの遂行を妨げる可能性のあるリスクを早期に特定し、その影響度と発生確率を評価した上で、適切な対応策を講じることで、プロジェクトの目標達成を確実にする

### ビジネス価値
- **効率性向上**: リスクの早期発見により対応コストを60%削減、スケジュール遅延を50%減少
- **品質向上**: 重大リスクの顕在化を90%防止、プロジェクト成功率を20%向上
- **顧客満足度向上**: 予期せぬ問題の発生を最小化し、クライアント信頼度向上

### 実行頻度
- **頻度**: 週次（リスクレビュー）、随時（新規リスク識別時）
- **トリガー**: 定例会議、フェーズ移行、環境変化、ステークホルダーからの報告
- **所要時間**: 2-3時間（週次レビュー）、30分-1時間（個別リスク対応）

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: リスク管理プロセス全体の統括、重大リスクへの対応決定
  - 権限: リスク対応予算の承認、エスカレーション判断

- リスクオーナー [RiskOwner] [RISK_OWNER]
  - 責任: 個別リスクの監視、対応策の実行
  - 権限: リスク対応策の選択、実行リソースの要請

- プロジェクトメンバー [ProjectMember] [PROJECT_MEMBER]
  - 責任: リスクの識別、状況報告
  - 権限: リスク登録、対応策の提案

- ステークホルダー [Stakeholder] [STAKEHOLDER]
  - 責任: 重大リスクの認識、意思決定への参画
  - 権限: リスク受容レベルの決定、追加リソースの承認

### RACI マトリクス
| ステップ | PM | リスクオーナー | メンバー | ステークホルダー |
|---------|----|--------------| --------|----------------|
| リスク識別 | A | R | R | C |
| リスク分析 | R | C | C | I |
| 対応策策定 | A | R | C | C |
| 対応実行 | I | R | C | I |
| 効果測定 | R | R | I | I |
| 報告 | R | C | I | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：リスク管理サイクル]
  ↓
[ステップ1：リスク識別]
  ↓
[ステップ2：リスク分析]
  ↓
[判断：重大リスク？]
  ↓ Yes                     ↓ No
[ステップ3：対応策策定]     [リスク登録簿更新]
  ↓                         ↓
[ステップ4：対応実行]       [定期監視]
  ↓
[ステップ5：効果測定]
  ↓
[ステップ6：報告・共有]
  ↓
[終了：次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: リスク識別 [IdentifyRisks] [IDENTIFY_RISKS]
- **目的**: プロジェクトに影響を与える可能性のあるリスクを漏れなく洗い出す
- **入力**: プロジェクト計画書、過去プロジェクトの教訓、業界動向
- **活動**:
  1. ブレインストーミングセッションの実施
  2. チェックリストによる網羅的確認
  3. ステークホルダーインタビュー
  4. 外部環境分析（市場、技術、規制）
  5. リスクカテゴリー分類（技術、スケジュール、コスト、品質、外部要因）
- **出力**: リスク一覧（リスク記述、発生原因、潜在的影響）
- **所要時間**: 2-3時間

#### ステップ2: リスク分析 [AnalyzeRisks] [ANALYZE_RISKS]
- **目的**: 識別したリスクの影響度と発生確率を評価し、優先順位を決定
- **入力**: リスク一覧
- **活動**:
  1. 影響度評価（1-5スケール：軽微～致命的）
  2. 発生確率評価（1-5スケール：稀～ほぼ確実）
  3. リスクスコア算出（影響度 × 発生確率）
  4. リスクマトリクス作成
  5. 優先順位付け（高・中・低）
  6. リスク相互依存関係の分析
- **出力**: 優先順位付きリスク登録簿
- **所要時間**: 1-2時間

#### ステップ3: 対応策策定 [DevelopResponses] [DEVELOP_RESPONSES]
- **目的**: 高優先度リスクに対する効果的な対応策を立案
- **入力**: 優先順位付きリスク登録簿
- **活動**:
  1. 対応戦略の選択：
     - 回避（Avoid）: リスクの原因を取り除く
     - 転嫁（Transfer）: 第三者に移転（保険等）
     - 軽減（Mitigate）: 影響度/確率を低減
     - 受容（Accept）: リスクを受け入れる
  2. 具体的アクションの定義
  3. 必要リソースの見積もり
  4. 実施スケジュールの策定
  5. 成功指標の設定
  6. コンティンジェンシープランの作成
- **出力**: リスク対応計画書
- **所要時間**: 2-3時間

#### ステップ4: 対応実行 [ExecuteResponses] [EXECUTE_RESPONSES]
- **目的**: 策定した対応策を着実に実行し、リスクを制御
- **入力**: リスク対応計画書
- **活動**:
  1. 対応策の実施開始
  2. 進捗モニタリング
  3. リソース調整
  4. 障害への対処
  5. ステークホルダーとの調整
  6. 実施記録の作成
- **出力**: 実施状況レポート、更新されたリスク状態
- **所要時間**: 継続的（リスクにより異なる）

#### ステップ5: 効果測定 [MeasureEffectiveness] [MEASURE_EFFECTIVENESS]
- **目的**: 実施した対応策の効果を評価し、追加対応の必要性を判断
- **入力**: 実施状況レポート、リスク指標
- **活動**:
  1. リスクレベルの再評価
  2. 対応策の効果測定
  3. 残存リスクの確認
  4. 新規リスクの識別
  5. 教訓の抽出
  6. 改善点の特定
- **出力**: 効果測定レポート、改善提案
- **所要時間**: 1時間

#### ステップ6: 報告・共有 [ReportAndShare] [REPORT_AND_SHARE]
- **目的**: リスク状況を関係者と共有し、組織知として蓄積
- **入力**: 効果測定レポート、リスク登録簿
- **活動**:
  1. エグゼクティブサマリー作成
  2. リスクダッシュボード更新
  3. ステークホルダー報告会の実施
  4. リスク登録簿の公開
  5. ベストプラクティスの文書化
  6. 組織のリスクナレッジベース更新
- **出力**: リスク状況報告書、更新されたナレッジベース
- **所要時間**: 1-2時間

## 状態遷移

### 状態定義
- 未識別 [Unidentified] [UNIDENTIFIED]: リスクがまだ認識されていない
- 識別済み [Identified] [IDENTIFIED]: リスクが識別され登録された
- 分析中 [UnderAnalysis] [UNDER_ANALYSIS]: 影響度と確率を評価中
- 対応策定中 [PlanningResponse] [PLANNING_RESPONSE]: 対応策を検討中
- 対応実行中 [Responding] [RESPONDING]: 対応策を実行中
- 監視中 [Monitoring] [MONITORING]: リスクを継続的に監視中
- クローズ [Closed] [CLOSED]: リスクが解消または発生
- 顕在化 [Materialized] [MATERIALIZED]: リスクが実際に発生

### 遷移条件
\`\`\`
未識別 --[リスク発見]--> 識別済み
識別済み --[分析開始]--> 分析中
分析中 --[高リスク判定]--> 対応策定中
分析中 --[低リスク判定]--> 監視中
対応策定中 --[対応策承認]--> 対応実行中
対応実行中 --[対応完了]--> 監視中
監視中 --[リスク解消]--> クローズ
監視中 --[リスク発生]--> 顕在化
顕在化 --[対処完了]--> クローズ
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクト計画が承認されている
2. リスク管理体制が確立されている
3. リスク評価基準が定義されている
4. ステークホルダーがリスク管理の重要性を理解している

### 実行中の制約
1. 影響度×確率≥15のリスクは必ず対応策を策定
2. 重大リスクは24時間以内にエスカレーション
3. リスク対応予算はプロジェクト予算の10%以内
4. 全てのリスクにオーナーを割り当て
5. 週次でリスク状況をレビュー

### 事後条件
1. 全ての高リスクに対応策が存在
2. リスク登録簿が最新化されている
3. ステークホルダーがリスク状況を把握
4. 教訓が文書化されている
5. 次回プロジェクトで活用可能な知見が蓄積

## パラソルドメインモデル

### エンティティ定義
- リスク [Risk] [RISK]
  - リスクID、プロジェクトID、カテゴリ、説明、原因、影響
- リスク評価 [RiskAssessment] [RISK_ASSESSMENT]
  - 評価ID、リスクID、影響度、発生確率、評価日、評価者
- リスク対応策 [RiskResponse] [RISK_RESPONSE]
  - 対応策ID、リスクID、戦略、アクション、責任者、期限
- リスク履歴 [RiskHistory] [RISK_HISTORY]
  - 履歴ID、リスクID、変更日時、変更内容、変更者

### 値オブジェクト
- リスクレベル [RiskLevel] [RISK_LEVEL]
  - スコア（1-25）、優先度（高・中・低）
- リスクカテゴリ [RiskCategory] [RISK_CATEGORY]
  - 技術、スケジュール、コスト、品質、外部要因

## KPI

1. **リスク早期発見率**: プロジェクト初期に識別したリスクの割合
   - 目標値: 80%以上
   - 測定方法: (初期30%期間の識別数 / 全リスク数) × 100
   - 測定頻度: プロジェクト完了時

2. **リスク対応効果率**: 対応策により影響が軽減されたリスクの割合
   - 目標値: 75%以上
   - 測定方法: (軽減成功リスク数 / 対応実施リスク数) × 100
   - 測定頻度: 月次

3. **重大リスク顕在化率**: 高リスクが実際に発生した割合
   - 目標値: 10%以下
   - 測定方法: (顕在化高リスク数 / 識別高リスク数) × 100
   - 測定頻度: 月次

4. **リスク対応コスト率**: リスク対応に要したコストの割合
   - 目標値: プロジェクト予算の5%以内
   - 測定方法: (リスク対応コスト / プロジェクト予算) × 100
   - 測定頻度: 月次`,
      pattern: 'Prevention',
      goal: 'プロジェクトの遂行を妨げる可能性のあるリスクを早期に特定し、適切な対応策を講じる',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'RiskOwner', displayName: 'リスクオーナー', systemName: 'RISK_OWNER' },
        { name: 'ProjectMember', displayName: 'プロジェクトメンバー', systemName: 'PROJECT_MEMBER' },
        { name: 'Stakeholder', displayName: 'ステークホルダー', systemName: 'STAKEHOLDER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'IdentifyRisks', displayName: 'リスク識別', systemName: 'IDENTIFY_RISKS' },
          { name: 'AnalyzeRisks', displayName: 'リスク分析', systemName: 'ANALYZE_RISKS' },
          { name: 'DevelopResponses', displayName: '対応策策定', systemName: 'DEVELOP_RESPONSES' },
          { name: 'ExecuteResponses', displayName: '対応実行', systemName: 'EXECUTE_RESPONSES' },
          { name: 'MeasureEffectiveness', displayName: '効果測定', systemName: 'MEASURE_EFFECTIVENESS' },
          { name: 'ReportAndShare', displayName: '報告・共有', systemName: 'REPORT_AND_SHARE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Unidentified', displayName: '未識別', systemName: 'UNIDENTIFIED' },
        { name: 'Identified', displayName: '識別済み', systemName: 'IDENTIFIED' },
        { name: 'UnderAnalysis', displayName: '分析中', systemName: 'UNDER_ANALYSIS' },
        { name: 'PlanningResponse', displayName: '対応策定中', systemName: 'PLANNING_RESPONSE' },
        { name: 'Responding', displayName: '対応実行中', systemName: 'RESPONDING' },
        { name: 'Monitoring', displayName: '監視中', systemName: 'MONITORING' },
        { name: 'Closed', displayName: 'クローズ', systemName: 'CLOSED' },
        { name: 'Materialized', displayName: '顕在化', systemName: 'MATERIALIZED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}