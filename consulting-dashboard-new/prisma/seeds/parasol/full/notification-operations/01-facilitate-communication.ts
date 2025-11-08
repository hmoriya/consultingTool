import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedFacilitateCommunication(service: unknown, capability: unknown) {
  console.log('    Creating business operation: コミュニケーションを円滑化する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'FacilitateCommunication',
      displayName: 'コミュニケーションを円滑化する',
      design: `# ビジネスオペレーション: コミュニケーションを円滑化する [FacilitateCommunication] [FACILITATE_COMMUNICATION]

## オペレーション概要

### 目的
プロジェクト関係者間の情報共有と意思疎通を効果的に促進し、誤解や情報の遅延を防ぐことで、チームの生産性向上とプロジェクトの成功を実現する

### ビジネス価値
- **効率性向上**: 情報伝達時間60%短縮、会議時間40%削減、意思決定速度50%向上
- **品質向上**: 誤解による手戻り70%削減、情報の正確性95%達成、合意形成率向上
- **関係性強化**: チーム満足度30%向上、ステークホルダー信頼度40%向上、協働効率25%改善

### 実行頻度
- **頻度**: 日次（チーム内）、週次（ステークホルダー）、随時（重要事項）、月次（全体共有）
- **トリガー**: 定例会議、意思決定ポイント、課題発生、フェーズ移行、変更発生
- **所要時間**: 日次スタンドアップ（15分）、週次会議（1時間）、月次報告（2時間）

## ロールと責任

### 関与者
- コミュニケーションマネージャー [CommunicationManager] [COMMUNICATION_MANAGER]
  - 責任: コミュニケーション戦略策定、チャネル管理、情報フロー最適化
  - 権限: コミュニケーション方針決定、ツール選定、プロセス改善

- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 重要情報の発信、ステークホルダー調整、コミュニケーション品質確保
  - 権限: 情報開示レベル決定、エスカレーション、会議体設定

- チームメンバー [TeamMember] [TEAM_MEMBER]
  - 責任: 積極的な情報共有、フィードバック提供、ナレッジ貢献
  - 権限: 情報アクセス、改善提案、質問・確認

- ステークホルダー [Stakeholder] [STAKEHOLDER]
  - 責任: 情報提供、フィードバック、意思決定への参画
  - 権限: 情報要求、コミュニケーション頻度調整

### RACI マトリクス
| ステップ | CM | PM | メンバー | ステークホルダー |
|---------|----|----|---------|----------------|
| 戦略策定 | R | A | C | C |
| チャネル構築 | R | C | I | I |
| 情報収集 | C | C | R | C |
| 情報共有 | R | R | C | I |
| 双方向対話 | A | R | C | C |
| 効果測定 | R | C | I | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：コミュニケーションサイクル]
  ↓
[ステップ1：コミュニケーション戦略策定]
  ↓
[ステップ2：チャネル・ツール構築]
  ↓
[ステップ3：情報収集・整理]
  ↓
[ステップ4：情報共有・発信]
  ↓
[ステップ5：双方向対話促進]
  ↓
[ステップ6：フィードバック収集]
  ↓
[ステップ7：効果測定・改善]
  ↓
[終了：次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: コミュニケーション戦略策定 [DevelopCommunicationStrategy] [DEVELOP_COMMUNICATION_STRATEGY]
- **目的**: プロジェクトに最適なコミュニケーション方針と計画を策定
- **入力**: プロジェクト計画、ステークホルダー分析、組織文化
- **活動**:
  1. ステークホルダー別コミュニケーションニーズ分析
  2. 情報の種類と重要度の分類
  3. コミュニケーション頻度とタイミングの設計
  4. 使用言語とトーンの決定（公式/非公式）
  5. エスカレーションパスの定義
  6. 成功指標の設定
- **出力**: コミュニケーション計画書、マトリクス、ガイドライン
- **所要時間**: 4-8時間

#### ステップ2: チャネル・ツール構築 [EstablishChannelsAndTools] [ESTABLISH_CHANNELS_AND_TOOLS]
- **目的**: 効果的な情報共有のためのインフラを整備
- **入力**: コミュニケーション計画、利用可能ツール、予算
- **活動**:
  1. コミュニケーションチャネルの選定（対面/オンライン/文書）
  2. コラボレーションツールの導入・設定
  3. 情報リポジトリの構築（Wiki、共有フォルダ）
  4. 会議体系の設計（定例/臨時）
  5. テンプレート・フォーマットの作成
  6. アクセス権限の設定
- **出力**: 設定済みツール環境、利用ガイド、テンプレート集
- **所要時間**: 1-2日

#### ステップ3: 情報収集・整理 [CollectAndOrganizeInformation] [COLLECT_AND_ORGANIZE_INFORMATION]
- **目的**: 共有すべき情報を効率的に収集し、構造化
- **入力**: プロジェクトデータ、チーム報告、外部情報
- **活動**:
  1. 定期的な情報収集プロセスの実行
  2. 情報の分類とタグ付け
  3. 重要度と緊急度による優先順位付け
  4. 情報の正確性検証
  5. 文脈情報の付加
  6. アーカイブと検索性の確保
- **出力**: 整理された情報セット、優先度リスト
- **所要時間**: 日次30分-1時間

#### ステップ4: 情報共有・発信 [ShareAndDisseminateInformation] [SHARE_AND_DISSEMINATE_INFORMATION]
- **目的**: 適切な情報を適切なタイミングで適切な相手に伝達
- **入力**: 整理された情報、配信先リスト、スケジュール
- **活動**:
  1. ターゲット別メッセージの作成
  2. 配信チャネルの選択
  3. タイミングの最適化（時差考慮）
  4. プッシュ型/プル型の使い分け
  5. 重要情報のハイライト
  6. 配信確認とフォローアップ
- **出力**: 配信済みメッセージ、配信記録、既読確認
- **所要時間**: 案件による（15分-2時間）

#### ステップ5: 双方向対話促進 [FacilitateTwoWayDialogue] [FACILITATE_TWO_WAY_DIALOGUE]
- **目的**: 一方向でなく、対話による深い理解と合意形成を実現
- **入力**: 議題、参加者リスト、背景情報
- **活動**:
  1. 対話の場の設計（会議、ワークショップ）
  2. ファシリテーション実施
  3. 積極的な質問と確認
  4. 異なる視点の統合
  5. 合意事項の明確化
  6. アクションアイテムの確認
- **出力**: 議事録、合意事項、アクションリスト
- **所要時間**: 30分-2時間/セッション

#### ステップ6: フィードバック収集 [CollectFeedback] [COLLECT_FEEDBACK]
- **目的**: コミュニケーションの効果を把握し、改善点を特定
- **入力**: コミュニケーション実績、参加者リスト
- **活動**:
  1. フィードバック収集方法の選定（アンケート、面談）
  2. 定量的・定性的フィードバックの収集
  3. コミュニケーション満足度の測定
  4. 問題点と改善要望の整理
  5. ベストプラクティスの抽出
  6. 改善優先順位の決定
- **出力**: フィードバックレポート、改善提案リスト
- **所要時間**: 2-3時間

#### ステップ7: 効果測定・改善 [MeasureEffectivenessAndImprove] [MEASURE_EFFECTIVENESS_AND_IMPROVE]
- **目的**: コミュニケーション活動の効果を測定し、継続的に改善
- **入力**: フィードバック、KPI実績、プロジェクト成果
- **活動**:
  1. KPI測定（情報到達率、理解度、満足度）
  2. コミュニケーション課題の根本原因分析
  3. 改善施策の立案と実施
  4. プロセス・ツールの最適化
  5. 成功事例の標準化
  6. チーム教育の実施
- **出力**: 効果測定レポート、改善計画、更新されたプロセス
- **所要時間**: 月次2-3時間

## 状態遷移

### 状態定義
- 計画中 [Planning] [PLANNING]: 戦略を策定中
- 準備完了 [Ready] [READY]: インフラが整備された
- 活動中 [Active] [ACTIVE]: 日常的にコミュニケーション実施中
- 課題あり [IssuesIdentified] [ISSUES_IDENTIFIED]: 問題が発生
- 改善中 [Improving] [IMPROVING]: 改善施策を実施中
- 最適化済み [Optimized] [OPTIMIZED]: 効果的に機能している
- 停滞 [Stagnant] [STAGNANT]: コミュニケーションが停滞

### 遷移条件
\`\`\`
計画中 --[戦略確定]--> 準備完了
準備完了 --[運用開始]--> 活動中
活動中 --[問題発生]--> 課題あり
活動中 --[定期レビュー]--> 改善中
課題あり --[対策実施]--> 改善中
改善中 --[改善完了]--> 活動中
活動中 --[高評価継続]--> 最適化済み
活動中 --[活動低下]--> 停滞
停滞 --[再活性化]--> 改善中
\`\`\`

## ビジネスルール

### 事前条件
1. プロジェクトのコミュニケーション方針が定義されている
2. 主要ステークホルダーが特定されている
3. 基本的なコミュニケーションツールが利用可能
4. チームメンバーがコミュニケーションの重要性を理解

### 実行中の制約
1. 機密情報は適切なセキュリティレベルで管理
2. 重要決定事項は24時間以内に全員に共有
3. 会議は目的とアジェンダを事前共有
4. 非同期コミュニケーションを基本とし、同期は必要時のみ
5. 文化的多様性とタイムゾーンを考慮

### 事後条件
1. すべての関係者が必要な情報にアクセス可能
2. コミュニケーション履歴が記録・検索可能
3. 合意事項が文書化されている
4. フィードバックループが機能している
5. コミュニケーション品質が継続的に向上

## パラソルドメインモデル

### エンティティ定義
- コミュニケーション計画 [CommunicationPlan] [COMMUNICATION_PLAN]
  - 計画ID、プロジェクトID、戦略、チャネル定義、更新日
- メッセージ [Message] [MESSAGE]
  - メッセージID、送信者、受信者、内容、チャネル、送信日時
- 会議記録 [MeetingRecord] [MEETING_RECORD]
  - 記録ID、会議日時、参加者、議題、決定事項、アクション
- フィードバック [Feedback] [FEEDBACK]
  - フィードバックID、提供者、内容、カテゴリ、対応状況

### 値オブジェクト
- コミュニケーションチャネル [CommunicationChannel] [COMMUNICATION_CHANNEL]
  - Email、Slack、Teams、対面、電話、文書
- 情報優先度 [InformationPriority] [INFORMATION_PRIORITY]
  - 緊急、重要、通常、参考

## KPI

1. **情報到達率**: 発信情報が対象者に到達した割合
   - 目標値: 98%以上
   - 測定方法: (既読・確認数 / 配信数) × 100
   - 測定頻度: 週次

2. **コミュニケーション満足度**: チームメンバーの満足度
   - 目標値: 4.0/5.0以上
   - 測定方法: 定期サーベイの平均スコア
   - 測定頻度: 月次

3. **会議効率性**: 会議時間に対する決定事項の割合
   - 目標値: 1決定/30分
   - 測定方法: 決定事項数 / 総会議時間
   - 測定頻度: 月次

4. **情報検索成功率**: 必要な情報を見つけられた割合
   - 目標値: 90%以上
   - 測定方法: (成功検索数 / 総検索数) × 100
   - 測定頻度: 月次

5. **コミュニケーション起因の問題発生率**: 誤解や情報不足による問題
   - 目標値: 5%以下
   - 測定方法: (コミュニケーション起因問題数 / 全問題数) × 100
   - 測定頻度: 月次`,
      pattern: 'Collaboration',
      goal: 'プロジェクト関係者間の情報共有と意思疎通を効果的に促進し、チームの生産性向上を実現する',
      roles: JSON.stringify([
        { name: 'CommunicationManager', displayName: 'コミュニケーションマネージャー', systemName: 'COMMUNICATION_MANAGER' },
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'TeamMember', displayName: 'チームメンバー', systemName: 'TEAM_MEMBER' },
        { name: 'Stakeholder', displayName: 'ステークホルダー', systemName: 'STAKEHOLDER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'DevelopCommunicationStrategy', displayName: 'コミュニケーション戦略策定', systemName: 'DEVELOP_COMMUNICATION_STRATEGY' },
          { name: 'EstablishChannelsAndTools', displayName: 'チャネル・ツール構築', systemName: 'ESTABLISH_CHANNELS_AND_TOOLS' },
          { name: 'CollectAndOrganizeInformation', displayName: '情報収集・整理', systemName: 'COLLECT_AND_ORGANIZE_INFORMATION' },
          { name: 'ShareAndDisseminateInformation', displayName: '情報共有・発信', systemName: 'SHARE_AND_DISSEMINATE_INFORMATION' },
          { name: 'FacilitateTwoWayDialogue', displayName: '双方向対話促進', systemName: 'FACILITATE_TWO_WAY_DIALOGUE' },
          { name: 'CollectFeedback', displayName: 'フィードバック収集', systemName: 'COLLECT_FEEDBACK' },
          { name: 'MeasureEffectivenessAndImprove', displayName: '効果測定・改善', systemName: 'MEASURE_EFFECTIVENESS_AND_IMPROVE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Ready', displayName: '準備完了', systemName: 'READY' },
        { name: 'Active', displayName: '活動中', systemName: 'ACTIVE' },
        { name: 'IssuesIdentified', displayName: '課題あり', systemName: 'ISSUES_IDENTIFIED' },
        { name: 'Improving', displayName: '改善中', systemName: 'IMPROVING' },
        { name: 'Optimized', displayName: '最適化済み', systemName: 'OPTIMIZED' },
        { name: 'Stagnant', displayName: '停滞', systemName: 'STAGNANT' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}