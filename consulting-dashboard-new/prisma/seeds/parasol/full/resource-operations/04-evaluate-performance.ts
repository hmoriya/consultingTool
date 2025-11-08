import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedEvaluatePerformance(service: unknown, capability: unknown) {
  console.log('    Creating business operation: パフォーマンスを評価する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'EvaluatePerformance',
      displayName: 'パフォーマンスを評価する',
      design: `# ビジネスオペレーション: パフォーマンスを評価する [EvaluatePerformance] [EVALUATE_PERFORMANCE]

## オペレーション概要

### 目的
コンサルタントの成果・能力・行動を多角的かつ公正に評価し、適切なフィードバックと報酬を提供することで、個人の成長促進と組織目標の達成を両立させる

### ビジネス価値
- **成長促進**: パフォーマンス向上率年間15%、スキル成長速度30%向上、キャリア満足度40%向上
- **公正性確保**: 評価納得度85%達成、評価プロセス透明性90%、バイアス削減60%
- **組織力強化**: ハイパフォーマー定着率90%、タレントパイプライン充実度50%向上

### 実行頻度
- **頻度**: 年次評価（必須）、中間評価（半期）、プロジェクト完了時評価
- **トリガー**: 評価サイクル、プロジェクト完了、昇進検討、問題発生時
- **所要時間**: 年次評価（2週間）、中間評価（1週間）

## ロールと責任

### 関与者
- 評価者（上司） [Evaluator] [EVALUATOR]
  - 責任: 公正な評価実施、フィードバック提供、成長支援
  - 権限: 評価決定、昇進推薦、報酬提案

- 被評価者 [Evaluatee] [EVALUATEE]
  - 責任: 自己評価実施、成果報告、改善実行
  - 権限: 評価への異議申し立て、キャリア希望表明

- 二次評価者 [SecondaryEvaluator] [SECONDARY_EVALUATOR]
  - 責任: 評価の妥当性確認、調整、承認
  - 権限: 評価修正要請、最終承認

- HR担当者 [HRRepresentative] [HR_REPRESENTATIVE]
  - 責任: プロセス管理、公正性確保、データ分析
  - 権限: プロセス改善、ガイドライン策定

### RACI マトリクス
| ステップ | 評価者 | 被評価者 | 二次評価者 | HR |
|---------|-------|----------|-----------|-----|
| 目標設定 | A | R | C | C |
| 実績収集 | C | R | I | I |
| 自己評価 | I | R | I | C |
| 一次評価 | R | I | C | C |
| 校正会議 | R | I | A | C |
| FB実施 | R | A | I | I |
| 改善計画 | C | R | I | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：評価サイクル]
  ↓
[ステップ1：評価基準・目標確認]
  ↓
[ステップ2：実績データ収集]
  ↓
[ステップ3：自己評価実施]
  ↓
[ステップ4：360度フィードバック収集]
  ↓
[ステップ5：評価実施]
  ↓
[ステップ6：評価校正会議]
  ↓
[ステップ7：フィードバック面談]
  ↓
[判断：合意形成？]
  ↓ Yes                    ↓ No
[終了：評価確定]          [再検討・調整]
\`\`\`

### 各ステップの詳細

#### ステップ1: 評価基準・目標確認 [ConfirmCriteriaAndGoals] [CONFIRM_CRITERIA_AND_GOALS]
- **目的**: 評価の基準と個人目標を明確化し共通認識を形成
- **入力**: 組織目標、職位要件、前期評価結果
- **活動**:
  1. 組織目標からの個人目標展開
  2. SMART目標の設定と合意
  3. 評価基準・ウェイトの確認
  4. ストレッチ目標の設定
  5. キャリア目標の確認
  6. 期待値のすり合わせ
- **出力**: 個人目標シート、評価基準、期待値合意書
- **所要時間**: 2-3時間

#### ステップ2: 実績データ収集 [CollectPerformanceData] [COLLECT_PERFORMANCE_DATA]
- **目的**: 客観的かつ包括的な実績情報を収集
- **入力**: プロジェクト記録、成果物、各種メトリクス
- **活動**:
  1. 定量的成果の集計（売上、生産性等）
  2. 定性的成果の記録（顧客評価等）
  3. プロジェクト貢献度の確認
  4. スキル発揮事例の収集
  5. 改善・イノベーション事例の記録
  6. 勤怠・稼働率データの確認
- **出力**: 実績サマリー、エビデンス集、成果一覧
- **所要時間**: 3-5日

#### ステップ3: 自己評価実施 [ConductSelfAssessment] [CONDUCT_SELF_ASSESSMENT]
- **目的**: 被評価者自身による振り返りと自己認識の促進
- **入力**: 実績データ、目標シート、評価フォーム
- **活動**:
  1. 目標達成度の自己評価
  2. 強み・改善点の自己分析
  3. 困難克服事例の記述
  4. 学習・成長の振り返り
  5. 次期への抱負記載
  6. キャリア希望の更新
- **出力**: 自己評価シート、振り返り文書
- **所要時間**: 1日

#### ステップ4: 360度フィードバック収集 [Collect360Feedback] [COLLECT_360_FEEDBACK]
- **目的**: 多角的な視点から行動・能力を評価
- **入力**: 評価対象者リスト、フィードバック依頼
- **活動**:
  1. フィードバック提供者の選定
  2. 匿名フィードバックの収集
  3. 上司・部下・同僚からの評価
  4. 顧客からのフィードバック（可能な場合）
  5. フィードバックの集計・分析
  6. 行動パターンの抽出
- **出力**: 360度フィードバックレポート、行動分析
- **所要時間**: 1週間

#### ステップ5: 評価実施 [ConductEvaluation] [CONDUCT_EVALUATION]
- **目的**: 収集情報を基に総合的な評価を実施
- **入力**: 実績データ、自己評価、360度フィードバック
- **活動**:
  1. 目標達成度の評価（定量・定性）
  2. コンピテンシー評価の実施
  3. 成長度・ポテンシャルの評価
  4. 総合評価ランクの決定
  5. 強み・改善領域の特定
  6. 評価コメントの作成
- **出力**: 評価シート、評価根拠文書、改善提案
- **所要時間**: 1-2日

#### ステップ6: 評価校正会議 [ConductCalibrationMeeting] [CONDUCT_CALIBRATION_MEETING]
- **目的**: 組織全体での評価の公正性・一貫性を確保
- **入力**: 個別評価結果、評価分布、ガイドライン
- **活動**:
  1. 評価分布の確認と調整
  2. 相対評価の実施（必要に応じて）
  3. 評価基準の適用一貫性確認
  4. 異常値・バイアスの検出
  5. 昇進・昇給候補者の検討
  6. 最終評価の確定
- **出力**: 校正済み評価、昇進リスト、報酬提案
- **所要時間**: 4-8時間

#### ステップ7: フィードバック面談 [ConductFeedbackSession] [CONDUCT_FEEDBACK_SESSION]
- **目的**: 評価結果を伝え、今後の成長に向けた対話を実施
- **入力**: 確定評価、フィードバック資料
- **活動**:
  1. 評価結果の説明（根拠含む）
  2. 強みの認識と活用方法議論
  3. 改善領域の具体的対策検討
  4. キャリア開発の相談
  5. 次期目標の方向性確認
  6. 質疑応答と合意形成
- **出力**: 面談記録、改善計画、次期目標案
- **所要時間**: 1.5-2時間

## 状態遷移

### 状態定義
- 準備中 [Preparing] [PREPARING]: 評価プロセス開始準備
- データ収集中 [CollectingData] [COLLECTING_DATA]: 実績情報収集中
- 評価中 [Evaluating] [EVALUATING]: 評価実施中
- 校正中 [Calibrating] [CALIBRATING]: 評価調整中
- フィードバック中 [Feedbacking] [FEEDBACKING]: 面談実施中
- 確定 [Finalized] [FINALIZED]: 評価確定・記録完了
- 異議申立中 [Appealing] [APPEALING]: 評価への異議対応中
- 完了 [Completed] [COMPLETED]: 全プロセス完了

### 遷移条件
\`\`\`
準備中 --[基準確定]--> データ収集中
データ収集中 --[データ収集完了]--> 評価中
評価中 --[一次評価完了]--> 校正中
校正中 --[校正完了]--> フィードバック中
フィードバック中 --[合意形成]--> 確定
フィードバック中 --[異議申立]--> 異議申立中
異議申立中 --[再評価]--> 校正中
異議申立中 --[却下]--> 確定
確定 --[記録完了]--> 完了
\`\`\`

## ビジネスルール

### 事前条件
1. 評価基準が明確に定義されている
2. 評価者が評価トレーニングを受けている
3. 評価期間の実績データが利用可能
4. 評価プロセスが周知されている

### 実行中の制約
1. 評価は複数の情報源に基づいて実施
2. 評価者の主観的バイアスを最小化する仕組みを適用
3. 相対評価を行う場合は分布ガイドラインに従う
4. フィードバックは具体的事例に基づいて実施
5. 評価結果は機密情報として取り扱う

### 事後条件
1. 全対象者の評価が完了している
2. 評価結果が人事システムに記録されている
3. 報酬・昇進への反映が決定している
4. 次期の目標設定の準備が整っている
5. 評価プロセスの改善点が特定されている

## パラソルドメインモデル

### エンティティ定義
- 評価記録 [EvaluationRecord] [EVALUATION_RECORD]
  - 評価ID、被評価者ID、評価者ID、期間、総合評価、状態
- 目標設定 [GoalSetting] [GOAL_SETTING]
  - 目標ID、評価ID、内容、ウェイト、達成基準、実績
- フィードバック [Feedback] [FEEDBACK]
  - フィードバックID、評価ID、提供者、内容、カテゴリ
- 評価面談 [EvaluationMeeting] [EVALUATION_MEETING]
  - 面談ID、評価ID、実施日、参加者、議事録、合意事項

### 値オブジェクト
- 評価ランク [EvaluationRank] [EVALUATION_RANK]
  - S（卓越）、A（優秀）、B（標準）、C（要改善）、D（不適格）
- 評価カテゴリ [EvaluationCategory] [EVALUATION_CATEGORY]
  - 成果、能力、行動、成長性、チーム貢献

## KPI

1. **評価納得度**: 被評価者の評価プロセス・結果への納得度
   - 目標値: 85%以上
   - 測定方法: 評価後アンケートの納得度スコア
   - 測定頻度: 評価サイクル毎

2. **評価完了率**: 期限内に評価プロセスを完了した割合
   - 目標値: 100%
   - 測定方法: (完了評価数 / 対象者数) × 100
   - 測定頻度: 評価サイクル毎

3. **フィードバック効果**: 評価後のパフォーマンス改善度
   - 目標値: 70%以上が改善
   - 測定方法: 次期評価での改善項目の達成率
   - 測定頻度: 年次

4. **評価の公正性**: 評価分布の適切性とバイアスの少なさ
   - 目標値: 正規分布との乖離10%以内
   - 測定方法: 統計的分析による偏り検出
   - 測定頻度: 評価サイクル毎

5. **成長実現率**: 評価を通じた能力向上の実現度
   - 目標値: 80%以上
   - 測定方法: 設定した成長目標の達成率
   - 測定頻度: 年次`,
      pattern: 'Evaluation',
      goal: 'コンサルタントの成果と能力を公正に評価し、成長促進と組織目標達成を実現する',
      roles: JSON.stringify([
        { name: 'Evaluator', displayName: '評価者（上司）', systemName: 'EVALUATOR' },
        { name: 'Evaluatee', displayName: '被評価者', systemName: 'EVALUATEE' },
        { name: 'SecondaryEvaluator', displayName: '二次評価者', systemName: 'SECONDARY_EVALUATOR' },
        { name: 'HRRepresentative', displayName: 'HR担当者', systemName: 'HR_REPRESENTATIVE' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'ConfirmCriteriaAndGoals', displayName: '評価基準・目標確認', systemName: 'CONFIRM_CRITERIA_AND_GOALS' },
          { name: 'CollectPerformanceData', displayName: '実績データ収集', systemName: 'COLLECT_PERFORMANCE_DATA' },
          { name: 'ConductSelfAssessment', displayName: '自己評価実施', systemName: 'CONDUCT_SELF_ASSESSMENT' },
          { name: 'Collect360Feedback', displayName: '360度フィードバック収集', systemName: 'COLLECT_360_FEEDBACK' },
          { name: 'ConductEvaluation', displayName: '評価実施', systemName: 'CONDUCT_EVALUATION' },
          { name: 'ConductCalibrationMeeting', displayName: '評価校正会議', systemName: 'CONDUCT_CALIBRATION_MEETING' },
          { name: 'ConductFeedbackSession', displayName: 'フィードバック面談', systemName: 'CONDUCT_FEEDBACK_SESSION' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Preparing', displayName: '準備中', systemName: 'PREPARING' },
        { name: 'CollectingData', displayName: 'データ収集中', systemName: 'COLLECTING_DATA' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' },
        { name: 'Calibrating', displayName: '校正中', systemName: 'CALIBRATING' },
        { name: 'Feedbacking', displayName: 'フィードバック中', systemName: 'FEEDBACKING' },
        { name: 'Finalized', displayName: '確定', systemName: 'FINALIZED' },
        { name: 'Appealing', displayName: '異議申立中', systemName: 'APPEALING' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}