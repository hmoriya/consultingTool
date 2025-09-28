import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedAlignExpectations(service: any, capability: any) {
  console.log('    Creating business operation: 期待値をすり合わせる...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'AlignExpectations',
      displayName: '期待値をすり合わせる',
      design: `# ビジネスオペレーション: 期待値をすり合わせる [AlignExpectations] [ALIGN_EXPECTATIONS]

## オペレーション概要

### 目的
ステークホルダーの期待値を正確に把握し、実現可能な範囲で調整しながら、継続的にコミュニケーションを行うことで、期待と成果のギャップを最小化し、高い満足度を実現する

### ビジネス価値
- **満足度向上**: クライアント満足度スコア30%向上、期待値ギャップ70%削減、信頼関係強化
- **効率性向上**: スコープ変更要求50%削減、手戻り工数40%削減、合意形成時間60%短縮
- **関係強化**: リピート案件率40%向上、追加案件獲得率30%増加、推奨意向80%達成

### 実行頻度
- **頻度**: プロジェクト開始時（必須）、マイルストーン毎、変更発生時、定期レビュー（月次）
- **トリガー**: 契約締結、フェーズ移行、要求変更、ステークホルダー交代、重要な意思決定
- **所要時間**: 初期調整（1-2日）、定期調整（2-4時間）、変更調整（4-8時間）

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 期待値管理プロセス全体の統括、主要ステークホルダーとの調整
  - 権限: スコープ調整、コミットメント承認、エスカレーション

- アカウントマネージャー [AccountManager] [ACCOUNT_MANAGER]
  - 責任: クライアント関係管理、長期的な期待値調整、契約管理
  - 権限: 契約条件調整、追加提案、関係構築投資

- ビジネスアナリスト [BusinessAnalyst] [BUSINESS_ANALYST]
  - 責任: 期待値の具体化、要求分析、実現可能性評価
  - 権限: 要求優先順位提案、代替案提示

- クライアントステークホルダー [ClientStakeholder] [CLIENT_STAKEHOLDER]
  - 責任: 期待事項の明確化、優先順位決定、成果承認
  - 権限: 最終意思決定、スコープ承認、満足度評価

### RACI マトリクス
| ステップ | PM | AM | BA | クライアント |
|---------|----|----|----| ------------|
| 期待値把握 | R | C | C | C |
| ギャップ分析 | R | I | C | I |
| 調整計画 | A | C | R | I |
| 合意形成 | R | C | I | A |
| 継続的確認 | R | C | I | C |
| 満足度評価 | C | R | I | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始：期待値管理サイクル]
  ↓
[ステップ1：期待値把握・明文化]
  ↓
[ステップ2：実現可能性評価]
  ↓
[ステップ3：ギャップ分析]
  ↓
[判断：調整必要？]
  ↓ Yes                     ↓ No
[ステップ4：期待値調整]      [ステップ5へ]
  ↓
[ステップ5：合意形成・文書化]
  ↓
[ステップ6：継続的モニタリング]
  ↓
[ステップ7：満足度評価・改善]
  ↓
[終了：次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: 期待値把握・明文化 [CaptureAndDocumentExpectations] [CAPTURE_AND_DOCUMENT_EXPECTATIONS]
- **目的**: ステークホルダーの期待値を包括的に把握し、明確に文書化
- **入力**: 契約書、提案書、キックオフ資料、過去の議事録
- **活動**:
  1. ステークホルダーマッピング（影響力×関心度）
  2. 個別インタビューの実施（構造化面談）
  3. 期待値の分類（必須/希望/理想）
  4. 成功基準の具体化（定量的・定性的指標）
  5. 暗黙の期待の明確化
  6. 期待値マトリクスの作成
- **出力**: 期待値一覧、成功基準定義書、ステークホルダーマップ
- **所要時間**: 1-2日

#### ステップ2: 実現可能性評価 [AssessFeasibility] [ASSESS_FEASIBILITY]
- **目的**: 把握した期待値の実現可能性を技術・リソース・時間の観点で評価
- **入力**: 期待値一覧、プロジェクト制約、利用可能リソース
- **活動**:
  1. 技術的実現可能性の評価
  2. リソース制約との照合
  3. スケジュール制約の確認
  4. コスト影響の分析
  5. リスク評価（実現時・非実現時）
  6. 実現可能性スコアリング
- **出力**: 実現可能性評価書、制約事項リスト、リスク分析
- **所要時間**: 4-8時間

#### ステップ3: ギャップ分析 [AnalyzeGaps] [ANALYZE_GAPS]
- **目的**: 期待値と実現可能な範囲のギャップを特定し、影響を評価
- **入力**: 期待値一覧、実現可能性評価書
- **活動**:
  1. ギャップの特定と分類
  2. ギャップの重要度評価
  3. ステークホルダーへの影響分析
  4. ビジネスインパクトの評価
  5. 調整優先順位の決定
  6. 代替案の検討
- **出力**: ギャップ分析報告書、調整必要項目リスト、代替案
- **所要時間**: 2-4時間

#### ステップ4: 期待値調整 [AdjustExpectations] [ADJUST_EXPECTATIONS]
- **目的**: 特定されたギャップを解消するため、期待値を現実的に調整
- **入力**: ギャップ分析報告書、代替案、ステークホルダー情報
- **活動**:
  1. 調整戦略の策定（スコープ/品質/時間/コスト）
  2. Win-Winシナリオの構築
  3. 代替価値提案の作成
  4. 段階的実現アプローチの設計
  5. トレードオフの明確化
  6. 調整案のシミュレーション
- **出力**: 調整提案書、トレードオフ分析、段階的実現計画
- **所要時間**: 4-6時間

#### ステップ5: 合意形成・文書化 [FormAgreementAndDocument] [FORM_AGREEMENT_AND_DOCUMENT]
- **目的**: 調整された期待値について正式な合意を形成し、文書化
- **入力**: 調整提案書、ステークホルダーフィードバック
- **活動**:
  1. ステークホルダー会議の実施
  2. 調整案のプレゼンテーション
  3. 懸念事項の解消
  4. 最終合意の取得
  5. 合意内容の文書化
  6. サインオフプロセスの実行
- **出力**: 合意文書、更新されたスコープ定義、承認記録
- **所要時間**: 2-4時間

#### ステップ6: 継続的モニタリング [ContinuouslyMonitor] [CONTINUOUSLY_MONITOR]
- **目的**: 合意された期待値の実現状況を継続的に監視し、逸脱を早期発見
- **入力**: 合意文書、プロジェクト進捗情報、成果物
- **活動**:
  1. 定期的な期待値レビュー
  2. 成果と期待値の照合
  3. 新たな期待の発生監視
  4. 環境変化の影響評価
  5. コミュニケーション頻度の調整
  6. 早期警告指標の更新
- **出力**: モニタリングレポート、調整アラート、更新された期待値
- **所要時間**: 2-3時間/月

#### ステップ7: 満足度評価・改善 [EvaluateSatisfactionAndImprove] [EVALUATE_SATISFACTION_AND_IMPROVE]
- **目的**: ステークホルダーの満足度を測定し、継続的な改善を実施
- **入力**: 成果物、フィードバック、満足度調査結果
- **活動**:
  1. 満足度調査の実施
  2. 期待値達成度の評価
  3. ギャップ要因の分析
  4. 改善機会の特定
  5. 次回への教訓抽出
  6. 関係強化施策の実施
- **出力**: 満足度評価報告書、改善計画、教訓記録
- **所要時間**: 3-4時間

## 状態遷移

### 状態定義
- 未把握 [NotCaptured] [NOT_CAPTURED]: 期待値が明確化されていない
- 把握済み [Captured] [CAPTURED]: 期待値が文書化された
- 評価中 [Evaluating] [EVALUATING]: 実現可能性を評価中
- ギャップあり [GapIdentified] [GAP_IDENTIFIED]: 調整が必要
- 調整中 [Adjusting] [ADJUSTING]: 期待値を調整中
- 合意済み [Agreed] [AGREED]: 正式に合意された
- モニタリング中 [Monitoring] [MONITORING]: 継続的に監視中
- 達成 [Achieved] [ACHIEVED]: 期待値が達成された

### 遷移条件
\`\`\`
未把握 --[把握活動開始]--> 把握済み
把握済み --[評価開始]--> 評価中
評価中 --[ギャップ発見]--> ギャップあり
評価中 --[ギャップなし]--> 合意済み
ギャップあり --[調整開始]--> 調整中
調整中 --[調整完了]--> 合意済み
合意済み --[監視開始]--> モニタリング中
モニタリング中 --[期待値達成]--> 達成
モニタリング中 --[新たなギャップ]--> ギャップあり
\`\`\`

## ビジネスルール

### 事前条件
1. 主要ステークホルダーが特定されている
2. コミュニケーションチャネルが確立されている
3. プロジェクトの制約条件が明確である
4. 変更管理プロセスが定義されている

### 実行中の制約
1. すべての期待値は文書化し、曖昧さを排除
2. 重要な期待値変更は48時間以内に関係者に通知
3. 合意なき期待値変更は受け入れない
4. 月次での期待値レビューを必須とする
5. クライアントの暗黙の期待も明示化する

### 事後条件
1. すべての期待値が明文化され合意されている
2. ステークホルダー満足度が測定されている
3. 期待値の変更履歴が管理されている
4. 次プロジェクトへの教訓が抽出されている
5. 信頼関係が維持・強化されている

## パラソルドメインモデル

### エンティティ定義
- 期待値 [Expectation] [EXPECTATION]
  - 期待値ID、ステークホルダーID、内容、優先度、カテゴリ、状態
- 期待値調整 [ExpectationAdjustment] [EXPECTATION_ADJUSTMENT]
  - 調整ID、期待値ID、調整前、調整後、理由、合意日
- 満足度評価 [SatisfactionAssessment] [SATISFACTION_ASSESSMENT]
  - 評価ID、プロジェクトID、評価日、スコア、フィードバック
- 合意記録 [AgreementRecord] [AGREEMENT_RECORD]
  - 記録ID、内容、合意者、合意日、有効期限

### 値オブジェクト
- 期待値レベル [ExpectationLevel] [EXPECTATION_LEVEL]
  - 必須（Must）、希望（Should）、あれば良い（Nice to have）
- 満足度スコア [SatisfactionScore] [SATISFACTION_SCORE]
  - 数値（1-5）、定性評価、改善提案

## KPI

1. **期待値ギャップ率**: 初期期待値と最終合意のギャップ
   - 目標値: 20%以内
   - 測定方法: |初期期待値 - 最終合意| / 初期期待値 × 100
   - 測定頻度: プロジェクト完了時

2. **クライアント満足度スコア**: 期待値管理に対する満足度
   - 目標値: 4.5/5.0以上
   - 測定方法: 定期満足度調査の平均スコア
   - 測定頻度: 月次

3. **スコープ変更率**: 合意後のスコープ変更要求の発生率
   - 目標値: 10%以下
   - 測定方法: (変更要求数 / 初期要求数) × 100
   - 測定頻度: 月次

4. **期待値達成率**: 合意した期待値の達成割合
   - 目標値: 95%以上
   - 測定方法: (達成期待値数 / 合意期待値数) × 100
   - 測定頻度: マイルストーン毎

5. **リピート率**: 期待値管理が良好だったクライアントのリピート率
   - 目標値: 60%以上
   - 測定方法: (リピート顧客数 / 完了プロジェクト顧客数) × 100
   - 測定頻度: 年次`,
      pattern: 'StakeholderManagement',
      goal: 'ステークホルダーの期待値を把握・調整し、期待と成果のギャップを最小化して高い満足度を実現する',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'AccountManager', displayName: 'アカウントマネージャー', systemName: 'ACCOUNT_MANAGER' },
        { name: 'BusinessAnalyst', displayName: 'ビジネスアナリスト', systemName: 'BUSINESS_ANALYST' },
        { name: 'ClientStakeholder', displayName: 'クライアントステークホルダー', systemName: 'CLIENT_STAKEHOLDER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CaptureAndDocumentExpectations', displayName: '期待値把握・明文化', systemName: 'CAPTURE_AND_DOCUMENT_EXPECTATIONS' },
          { name: 'AssessFeasibility', displayName: '実現可能性評価', systemName: 'ASSESS_FEASIBILITY' },
          { name: 'AnalyzeGaps', displayName: 'ギャップ分析', systemName: 'ANALYZE_GAPS' },
          { name: 'AdjustExpectations', displayName: '期待値調整', systemName: 'ADJUST_EXPECTATIONS' },
          { name: 'FormAgreementAndDocument', displayName: '合意形成・文書化', systemName: 'FORM_AGREEMENT_AND_DOCUMENT' },
          { name: 'ContinuouslyMonitor', displayName: '継続的モニタリング', systemName: 'CONTINUOUSLY_MONITOR' },
          { name: 'EvaluateSatisfactionAndImprove', displayName: '満足度評価・改善', systemName: 'EVALUATE_SATISFACTION_AND_IMPROVE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'NotCaptured', displayName: '未把握', systemName: 'NOT_CAPTURED' },
        { name: 'Captured', displayName: '把握済み', systemName: 'CAPTURED' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' },
        { name: 'GapIdentified', displayName: 'ギャップあり', systemName: 'GAP_IDENTIFIED' },
        { name: 'Adjusting', displayName: '調整中', systemName: 'ADJUSTING' },
        { name: 'Agreed', displayName: '合意済み', systemName: 'AGREED' },
        { name: 'Monitoring', displayName: 'モニタリング中', systemName: 'MONITORING' },
        { name: 'Achieved', displayName: '達成', systemName: 'ACHIEVED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}