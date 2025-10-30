import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedResolveIssuesQuickly(service: any, capability: any) {
  console.log('    Creating business operation: 課題を迅速に解決する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ResolveIssuesQuickly',
      displayName: '課題を迅速に解決する',
      design: `# ビジネスオペレーション: 課題を迅速に解決する [ResolveIssuesQuickly] [RESOLVE_ISSUES_QUICKLY]

## オペレーション概要

### 目的
プロジェクト遂行中に発生する課題を早期に発見し、適切な解決策を迅速に実行することで、プロジェクトへの影響を最小化し、計画通りの成果達成を支援する

### ビジネス価値
- **効率性向上**: 課題解決時間を50%短縮、手戻り工数40%削減、プロジェクト遅延30%減少
- **品質向上**: 課題の再発率60%削減、根本原因解決率85%達成、顧客満足度20%向上
- **リスク低減**: 課題のエスカレーション率40%削減、重大課題への発展を80%防止

### 実行頻度
- **頻度**: 随時（課題発生時）、定期レビュー（週次）、振り返り（月次）
- **トリガー**: 課題の報告、定例会議での発見、メトリクス異常検知、顧客からの指摘
- **所要時間**: 初期対応（30分-2時間）、根本解決（4時間-数日）

## ロールと責任

### 関与者
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]
  - 責任: 課題管理プロセス統括、優先順位決定、エスカレーション判断
  - 権限: リソース配分、解決方針承認、ステークホルダー調整

- 課題オーナー [IssueOwner] [ISSUE_OWNER]
  - 責任: 課題の詳細分析、解決策立案、実行管理、効果確認
  - 権限: 解決チーム編成、タスク割当、進捗管理

- 関係者 [Stakeholder] [STAKEHOLDER]
  - 責任: 情報提供、解決策レビュー、影響評価への協力
  - 権限: 解決策への意見、リソース提供承認

- 専門家 [SubjectMatterExpert] [SUBJECT_MATTER_EXPERT]
  - 責任: 技術的助言、解決策の実現可能性評価、知見提供
  - 権限: 技術的判断、代替案提示

### RACI マトリクス
| ステップ | PM | 課題オーナー | 関係者 | 専門家 |
|---------|----|--------------| ------|--------|
| 課題記録 | I | R | C | I |
| 影響分析 | C | R | C | C |
| 解決策立案 | A | R | C | C |
| 実行計画 | A | R | I | C |
| 解決実行 | I | R | C | C |
| 効果確認 | C | R | I | I |
| 知識共有 | I | R | I | C |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始：課題発生]
  ↓
[ステップ1：課題記録・分類]
  ↓
[ステップ2：影響分析・優先度設定]
  ↓
[判断：緊急対応必要？]
  ↓ Yes                     ↓ No
[暫定対処実施]              [ステップ3へ]
  ↓
[ステップ3：根本原因分析]
  ↓
[ステップ4：解決策立案・評価]
  ↓
[ステップ5：解決実行]
  ↓
[ステップ6：効果確認・クローズ]
  ↓
[ステップ7：知識化・再発防止]
  ↓
[終了：課題解決完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 課題記録・分類 [RecordAndClassifyIssue] [RECORD_AND_CLASSIFY_ISSUE]
- **目的**: 発生した課題を正確に記録し、適切に分類して管理可能にする
- **入力**: 課題報告、インシデント情報、関連データ
- **活動**:
  1. 課題の詳細情報収集（5W1H）
  2. 課題カテゴリの分類（技術、プロセス、人的、外部要因）
  3. 影響範囲の初期評価
  4. 関連課題の確認（重複、関連性）
  5. 課題管理システムへの登録
  6. 初期通知の送信
- **出力**: 課題票、分類タグ、初期影響評価
- **所要時間**: 30分-1時間

#### ステップ2: 影響分析・優先度設定 [AnalyzeImpactAndPrioritize] [ANALYZE_IMPACT_AND_PRIORITIZE]
- **目的**: 課題の影響度を正確に評価し、対応優先順位を決定
- **入力**: 課題票、プロジェクト計画、関連情報
- **活動**:
  1. ビジネスへの影響評価（顧客、収益、評判）
  2. プロジェクトへの影響評価（スケジュール、コスト、品質）
  3. 影響を受けるステークホルダーの特定
  4. 緊急度と重要度のマトリクス評価
  5. 対応優先順位の決定（Critical/High/Medium/Low）
  6. エスカレーション要否の判断
- **出力**: 影響分析書、優先度設定、エスカレーション判断
- **所要時間**: 1-2時間

#### ステップ3: 根本原因分析 [AnalyzeRootCause] [ANALYZE_ROOT_CAUSE]
- **目的**: 表面的な症状ではなく、課題の真の原因を特定
- **入力**: 課題詳細、関連データ、過去の類似事例
- **活動**:
  1. なぜなぜ分析（5 Whys）の実施
  2. 特性要因図（魚骨図）の作成
  3. データ分析による原因の裏付け
  4. 関係者へのヒアリング
  5. 仮説の検証
  6. 根本原因の特定と文書化
- **出力**: 根本原因分析報告書、エビデンス
- **所要時間**: 2-4時間

#### ステップ4: 解決策立案・評価 [DevelopAndEvaluateSolutions] [DEVELOP_AND_EVALUATE_SOLUTIONS]
- **目的**: 効果的で実現可能な解決策を立案し、最適案を選定
- **入力**: 根本原因分析結果、制約条件、利用可能リソース
- **活動**:
  1. ブレインストーミングによる解決案創出
  2. 各案の実現可能性評価
  3. コスト・効果分析
  4. リスクと副作用の評価
  5. ステークホルダーとの協議
  6. 最適解決策の選定と承認取得
- **出力**: 解決策提案書、評価マトリクス、実施計画案
- **所要時間**: 2-3時間

#### ステップ5: 解決実行 [ExecuteSolution] [EXECUTE_SOLUTION]
- **目的**: 選定された解決策を計画的に実行
- **入力**: 承認済み解決策、実施計画、必要リソース
- **活動**:
  1. 実行チームの編成と役割分担
  2. 詳細な実行計画の作成
  3. 必要な環境・ツールの準備
  4. 段階的な実行（パイロット→本格展開）
  5. 進捗モニタリングと調整
  6. コミュニケーション管理
- **出力**: 実行記録、進捗レポート、中間成果
- **所要時間**: 数時間-数日（課題規模による）

#### ステップ6: 効果確認・クローズ [VerifyEffectivenessAndClose] [VERIFY_EFFECTIVENESS_AND_CLOSE]
- **目的**: 解決策の効果を確認し、課題を正式にクローズ
- **入力**: 実行結果、成功基準、測定データ
- **活動**:
  1. 解決効果の測定（定量的・定性的）
  2. 成功基準との照合
  3. 副作用や新たな問題の確認
  4. ステークホルダーからのフィードバック収集
  5. 残課題の洗い出し
  6. 正式なクローズ承認取得
- **出力**: 効果測定レポート、クローズ承認書、残課題リスト
- **所要時間**: 1-2時間

#### ステップ7: 知識化・再発防止 [DocumentKnowledgeAndPreventRecurrence] [DOCUMENT_KNOWLEDGE_AND_PREVENT_RECURRENCE]
- **目的**: 得られた知見を組織知として蓄積し、再発を防止
- **入力**: 課題解決の全記録、教訓、ベストプラクティス
- **活動**:
  1. 解決プロセスの振り返り
  2. 教訓とベストプラクティスの抽出
  3. 標準プロセスへの反映検討
  4. ナレッジベースへの登録
  5. チーム内での共有会実施
  6. 予防措置の実装
- **出力**: 教訓記録、更新されたプロセス、予防措置計画
- **所要時間**: 2-3時間

## 状態遷移

### 状態定義
- 新規 [New] [NEW]: 課題が報告されたが未着手
- 分析中 [Analyzing] [ANALYZING]: 影響分析・原因分析中
- 解決策検討中 [DesigningSolution] [DESIGNING_SOLUTION]: 解決策を立案中
- 実行中 [Implementing] [IMPLEMENTING]: 解決策を実行中
- 検証中 [Verifying] [VERIFYING]: 効果を確認中
- 解決済み [Resolved] [RESOLVED]: 課題が解決された
- クローズ [Closed] [CLOSED]: 正式にクローズされた
- 再オープン [Reopened] [REOPENED]: 再発または未解決で再開

### 遷移条件
\`\`\`
新規 --[分析開始]--> 分析中
分析中 --[原因特定]--> 解決策検討中
解決策検討中 --[策定完了]--> 実行中
実行中 --[実行完了]--> 検証中
検証中 --[効果確認]--> 解決済み
解決済み --[承認]--> クローズ
解決済み --[問題再発]--> 再オープン
再オープン --[再分析]--> 分析中
\`\`\`

## ビジネスルール

### 事前条件
1. 課題管理プロセスが確立されている
2. エスカレーションパスが明確である
3. 課題管理ツールが利用可能である
4. チームメンバーが課題報告の重要性を理解している

### 実行中の制約
1. Critical課題は4時間以内に初期対応開始
2. 全ての課題に必ずオーナーを割り当て
3. 根本原因分析なしに恒久対策は実施しない
4. 顧客影響のある課題は24時間以内に報告
5. 解決策実行前に必ず影響分析を実施

### 事後条件
1. 課題が解決され、効果が確認されている
2. 根本原因が特定され文書化されている
3. 再発防止策が実装されている
4. 教訓が組織知として共有されている
5. 関係者全員が解決を認識している

## パラソルドメインモデル

### エンティティ定義
- 課題 [Issue] [ISSUE]
  - 課題ID、プロジェクトID、タイトル、詳細、カテゴリ、優先度、状態
- 影響分析 [ImpactAnalysis] [IMPACT_ANALYSIS]
  - 分析ID、課題ID、影響範囲、影響度、緊急度
- 解決策 [Solution] [SOLUTION]
  - 解決策ID、課題ID、内容、コスト、期間、リスク
- 課題履歴 [IssueHistory] [ISSUE_HISTORY]
  - 履歴ID、課題ID、変更日時、変更内容、変更者

### 値オブジェクト
- 優先度 [Priority] [PRIORITY]
  - Critical、High、Medium、Low
- 課題カテゴリ [IssueCategory] [ISSUE_CATEGORY]
  - 技術、プロセス、人的、外部要因、その他

## KPI

1. **平均解決時間**: 課題発生から解決までの平均時間
   - 目標値: Critical 24時間以内、High 3日以内
   - 測定方法: 解決日時 - 発生日時 の平均
   - 測定頻度: 月次

2. **初回解決率**: 一度の対応で解決した課題の割合
   - 目標値: 80%以上
   - 測定方法: (初回解決数 / 全課題数) × 100
   - 測定頻度: 月次

3. **課題再発率**: 同一原因による課題の再発生率
   - 目標値: 10%以下
   - 測定方法: (再発課題数 / 解決済み課題数) × 100
   - 測定頻度: 四半期

4. **エスカレーション率**: 上位階層へエスカレーションされた課題の割合
   - 目標値: 20%以下
   - 測定方法: (エスカレーション数 / 全課題数) × 100
   - 測定頻度: 月次

5. **予防措置実施率**: 再発防止策が実装された割合
   - 目標値: 90%以上
   - 測定方法: (予防措置実施数 / 重大課題数) × 100
   - 測定頻度: 四半期`,
      pattern: 'ProblemSolving',
      goal: 'プロジェクト遂行中の課題を早期発見し、迅速に解決してプロジェクトへの影響を最小化する',
      roles: JSON.stringify([
        { name: 'ProjectManager', displayName: 'プロジェクトマネージャー', systemName: 'PROJECT_MANAGER' },
        { name: 'IssueOwner', displayName: '課題オーナー', systemName: 'ISSUE_OWNER' },
        { name: 'Stakeholder', displayName: '関係者', systemName: 'STAKEHOLDER' },
        { name: 'SubjectMatterExpert', displayName: '専門家', systemName: 'SUBJECT_MATTER_EXPERT' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'RecordAndClassifyIssue', displayName: '課題記録・分類', systemName: 'RECORD_AND_CLASSIFY_ISSUE' },
          { name: 'AnalyzeImpactAndPrioritize', displayName: '影響分析・優先度設定', systemName: 'ANALYZE_IMPACT_AND_PRIORITIZE' },
          { name: 'AnalyzeRootCause', displayName: '根本原因分析', systemName: 'ANALYZE_ROOT_CAUSE' },
          { name: 'DevelopAndEvaluateSolutions', displayName: '解決策立案・評価', systemName: 'DEVELOP_AND_EVALUATE_SOLUTIONS' },
          { name: 'ExecuteSolution', displayName: '解決実行', systemName: 'EXECUTE_SOLUTION' },
          { name: 'VerifyEffectivenessAndClose', displayName: '効果確認・クローズ', systemName: 'VERIFY_EFFECTIVENESS_AND_CLOSE' },
          { name: 'DocumentKnowledgeAndPreventRecurrence', displayName: '知識化・再発防止', systemName: 'DOCUMENT_KNOWLEDGE_AND_PREVENT_RECURRENCE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'New', displayName: '新規', systemName: 'NEW' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'DesigningSolution', displayName: '解決策検討中', systemName: 'DESIGNING_SOLUTION' },
        { name: 'Implementing', displayName: '実行中', systemName: 'IMPLEMENTING' },
        { name: 'Verifying', displayName: '検証中', systemName: 'VERIFYING' },
        { name: 'Resolved', displayName: '解決済み', systemName: 'RESOLVED' },
        { name: 'Closed', displayName: 'クローズ', systemName: 'CLOSED' },
        { name: 'Reopened', displayName: '再オープン', systemName: 'REOPENED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}