import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedExtractBestPractices(service: any, capability: any) {
  console.log('    Creating business operation: ベストプラクティスを抽出する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ExtractBestPractices',
      displayName: 'ベストプラクティスを抽出する',
      design: `# ビジネスオペレーション: ベストプラクティスを抽出する [ExtractBestPractices] [EXTRACT_BEST_PRACTICES]

## オペレーション概要

### 目的
複数のプロジェクトやチームの成功事例を分析し、再現可能な形でベストプラクティスとして体系化することで、組織全体のパフォーマンスを持続的に向上させる

### ビジネス価値
- **品質向上**: ベストプラクティス適用によりプロジェクト成功率45%向上、初回品質30%改善
- **効率化**: 標準化により新規プロジェクト立ち上げ時間50%短縮、手戻り工数60%削減
- **競争優位**: 独自方法論の確立により差別化強化、提案勝率25%向上

### 実行頻度
- **頻度**: 四半期レビュー（定期）、大型プロジェクト完了時（随時）、組織変革時
- **トリガー**: 優秀なプロジェクト成果、繰り返し成功パターンの発見、外部評価獲得
- **所要時間**: 分析2-3日、体系化1-2日、検証1週間

## ロールと責任

### 関与者
- プラクティスアナリスト [PracticeAnalyst] [PRACTICE_ANALYST]
  - 責任: 成功パターンの分析、ベストプラクティスの抽出・体系化
  - 権限: プロジェクトデータアクセス、インタビュー実施、分析ツール利用

- エキスパートレビュアー [ExpertReviewer] [EXPERT_REVIEWER]
  - 責任: 抽出されたプラクティスの妥当性検証、改善提案
  - 権限: レビュー承認、修正要求、推奨度設定

- プラクティスオーナー [PracticeOwner] [PRACTICE_OWNER]
  - 責任: ベストプラクティスの維持・更新、適用支援
  - 権限: 公式化承認、更新権限、廃止決定

- メソドロジスト [Methodologist] [METHODOLOGIST]
  - 責任: 組織全体の方法論体系への統合、標準化推進
  - 権限: 体系化方針決定、テンプレート作成

### RACI マトリクス
| ステップ | アナリスト | レビュアー | オーナー | メソドロジスト |
|---------|-----------|-----------|---------|---------------|
| 候補特定 | R | C | I | I |
| データ分析 | R | I | C | I |
| パターン抽出 | R | C | I | A |
| 体系化 | R | A | C | C |
| 検証 | C | R | A | I |
| 標準化 | I | C | R | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始:ベストプラクティス候補の発見]
  ↓
[ステップ1:成功事例の特定と収集]
  ↓
[ステップ2:データ分析と比較]
  ↓
[ステップ3:成功パターンの抽出]
  ↓
[ステップ4:ベストプラクティスの体系化]
  ↓
[ステップ5:実証検証]
  ↓
[判断:汎用性確認？]
  ├─ Yes → [ステップ6:組織標準への統合]
  └─ No  → [改良・再検証]
  ↓
[ステップ7:展開と定着化]
  ↓
[終了:ベストプラクティス確立]
\`\`\`

### 各ステップの詳細

#### ステップ1: 成功事例の特定と収集 [IdentifySuccessCases] [IDENTIFY_SUCCESS_CASES]
- **目的**: 分析対象となる優れた成果を上げたプロジェクトやチームを特定
- **入力**: プロジェクト成果データ、顧客評価、内部評価
- **活動**:
  1. 成功指標の定義（品質、効率、顧客満足度等）
  2. 高パフォーマンスプロジェクトの抽出
  3. 成功要因仮説の設定
  4. 関係者へのインタビュー準備
  5. 関連ドキュメントの収集
  6. 比較対象（通常プロジェクト）の選定
- **出力**: 分析対象リスト、成功要因仮説
- **所要時間**: 1-2日

#### ステップ2: データ分析と比較 [AnalyzeAndCompare] [ANALYZE_AND_COMPARE]
- **目的**: 成功事例と通常事例を詳細に比較分析し差異を明確化
- **入力**: プロジェクトデータ、インタビュー記録、成果物
- **活動**:
  1. 定量データの統計分析
  2. プロセス・手法の比較分析
  3. チーム構成・役割分担の分析
  4. 使用ツール・テンプレートの調査
  5. コミュニケーションパターンの分析
  6. 意思決定プロセスの比較
- **出力**: 比較分析レポート、差異マトリクス
- **所要時間**: 2-3日

#### ステップ3: 成功パターンの抽出 [ExtractSuccessPatterns] [EXTRACT_SUCCESS_PATTERNS]
- **目的**: 分析結果から再現可能な成功パターンを識別
- **入力**: 比較分析結果、インタビュー洞察
- **活動**:
  1. 共通成功要因の特定
  2. 因果関係の分析
  3. 再現性の評価
  4. 適用条件の明確化
  5. リスク・制約事項の特定
  6. パターンの優先順位付け
- **出力**: 成功パターンカタログ、適用条件書
- **所要時間**: 1-2日

#### ステップ4: ベストプラクティスの体系化 [SystematizeBestPractices] [SYSTEMATIZE_BEST_PRACTICES]
- **目的**: 抽出したパターンを実践可能な形式に体系化
- **入力**: 成功パターン、既存方法論
- **活動**:
  1. プラクティスの構造化設計
  2. 実施手順の詳細化
  3. 必要ツール・テンプレートの整備
  4. チェックリスト・ガイドの作成
  5. 成功指標・KPIの設定
  6. トレーニング教材の開発
- **出力**: ベストプラクティスガイド、実施ツールキット
- **所要時間**: 2-3日

#### ステップ5: 実証検証 [ValidatePractices] [VALIDATE_PRACTICES]
- **目的**: 体系化したプラクティスの有効性を実プロジェクトで検証
- **入力**: ベストプラクティスガイド、パイロットプロジェクト
- **活動**:
  1. パイロットプロジェクトの選定
  2. 適用計画の策定
  3. プラクティスの試行実施
  4. 効果測定とモニタリング
  5. フィードバックの収集
  6. 改善点の特定
- **出力**: 検証結果レポート、改善提案
- **所要時間**: 2-4週間

#### ステップ6: 組織標準への統合 [IntegrateToStandards] [INTEGRATE_TO_STANDARDS]
- **目的**: 検証済みプラクティスを組織の標準方法論に組み込む
- **入力**: 検証済みベストプラクティス、既存標準
- **活動**:
  1. 既存標準との整合性確認
  2. 統合方針の決定
  3. 標準ドキュメントの更新
  4. 承認プロセスの実施
  5. 変更管理計画の策定
  6. 公式リリースの準備
- **出力**: 更新された組織標準、変更通知
- **所要時間**: 1週間

#### ステップ7: 展開と定着化 [DeployAndInstitutionalize] [DEPLOY_AND_INSTITUTIONALIZE]
- **目的**: ベストプラクティスを組織全体に展開し文化として定着
- **入力**: 標準化されたプラクティス、展開計画
- **活動**:
  1. 展開ロードマップの実行
  2. トレーニングの実施
  3. コーチング・メンタリング提供
  4. 適用状況のモニタリング
  5. 成功事例の共有
  6. 継続的改善の仕組み構築
- **出力**: 展開実績、定着度評価
- **所要時間**: 継続的活動

## 状態遷移

### 状態定義
- 候補段階 [Candidate] [CANDIDATE]: プラクティス候補として識別
- 分析中 [Analyzing] [ANALYZING]: データ分析実施中
- パターン化 [Patterned] [PATTERNED]: 成功パターンとして抽出済
- 体系化済 [Systematized] [SYSTEMATIZED]: 実践形式に体系化完了
- 検証中 [Validating] [VALIDATING]: 実証検証実施中
- 標準化済 [Standardized] [STANDARDIZED]: 組織標準として承認
- 定着済 [Institutionalized] [INSTITUTIONALIZED]: 組織文化として定着

### 遷移条件
\`\`\`
候補段階 --[分析開始]--> 分析中
分析中 --[パターン発見]--> パターン化
パターン化 --[体系化完了]--> 体系化済
体系化済 --[検証開始]--> 検証中
検証中 --[有効性確認]--> 標準化済
検証中 --[改善必要]--> 体系化済
標準化済 --[展開成功]--> 定着済
\`\`\`

## ビジネスルール

### 事前条件
1. 十分な成功事例データが存在する
2. 分析に必要なアクセス権限がある
3. ステークホルダーの協力が得られる
4. 組織として標準化の意思がある

### 実行中の制約
1. 機密情報・顧客情報の適切な取り扱い
2. 知的財産権の尊重
3. 文化的多様性への配慮
4. 過度な一般化の回避
5. 実証的アプローチの堅持

### 事後条件
1. ベストプラクティスが文書化されている
2. 実証検証で有効性が確認されている
3. 組織標準に統合されている
4. トレーニング体制が整備されている
5. 継続的改善プロセスが確立されている

## パラソルドメインモデル

### エンティティ定義
- ベストプラクティス [BestPractice] [BEST_PRACTICE]
  - プラクティスID、名称、カテゴリ、説明、適用条件、効果指標、状態
- 成功事例 [SuccessCase] [SUCCESS_CASE]
  - 事例ID、プロジェクトID、成功要因、成果指標、分析状態
- 検証記録 [ValidationRecord] [VALIDATION_RECORD]
  - 記録ID、プラクティスID、プロジェクトID、適用結果、改善提案
- 展開実績 [DeploymentRecord] [DEPLOYMENT_RECORD]
  - 実績ID、プラクティスID、展開先、展開日、定着度、効果

### 値オブジェクト
- プラクティスカテゴリ [PracticeCategory] [PRACTICE_CATEGORY]
  - プロジェクト管理、品質管理、コミュニケーション、技術手法、チーム運営
- 成熟度レベル [MaturityLevel] [MATURITY_LEVEL]
  - 初期段階、発展段階、確立段階、最適化段階、革新段階

## KPI

1. **ベストプラクティス抽出数**: 四半期毎の新規プラクティス数
   - 目標値: 5件以上/四半期
   - 測定方法: 標準化されたプラクティス数
   - 測定頻度: 四半期

2. **プラクティス適用率**: 対象プロジェクトでの適用割合
   - 目標値: 80%以上
   - 測定方法: (適用プロジェクト数 / 対象プロジェクト数) × 100
   - 測定頻度: 月次

3. **効果実現率**: ベストプラクティスによる改善効果
   - 目標値: 期待効果の85%以上達成
   - 測定方法: (実現効果 / 期待効果) × 100
   - 測定頻度: プロジェクト毎

4. **プラクティス更新頻度**: 継続的改善の実施度
   - 目標値: 年2回以上/プラクティス
   - 測定方法: 更新回数の平均
   - 測定頻度: 年次

5. **組織浸透度**: ベストプラクティスの認知・活用度
   - 目標値: 認知度90%、活用度70%以上
   - 測定方法: サーベイによる測定
   - 測定頻度: 半期`,
      pattern: 'BestPracticeExtraction',
      goal: '成功事例を分析しベストプラクティスとして体系化・標準化する',
      roles: JSON.stringify([
        { name: 'PracticeAnalyst', displayName: 'プラクティスアナリスト', systemName: 'PRACTICE_ANALYST' },
        { name: 'ExpertReviewer', displayName: 'エキスパートレビュアー', systemName: 'EXPERT_REVIEWER' },
        { name: 'PracticeOwner', displayName: 'プラクティスオーナー', systemName: 'PRACTICE_OWNER' },
        { name: 'Methodologist', displayName: 'メソドロジスト', systemName: 'METHODOLOGIST' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'IdentifySuccessCases', displayName: '成功事例の特定と収集', systemName: 'IDENTIFY_SUCCESS_CASES' },
          { name: 'AnalyzeAndCompare', displayName: 'データ分析と比較', systemName: 'ANALYZE_AND_COMPARE' },
          { name: 'ExtractSuccessPatterns', displayName: '成功パターンの抽出', systemName: 'EXTRACT_SUCCESS_PATTERNS' },
          { name: 'SystematizeBestPractices', displayName: 'ベストプラクティスの体系化', systemName: 'SYSTEMATIZE_BEST_PRACTICES' },
          { name: 'ValidatePractices', displayName: '実証検証', systemName: 'VALIDATE_PRACTICES' },
          { name: 'IntegrateToStandards', displayName: '組織標準への統合', systemName: 'INTEGRATE_TO_STANDARDS' },
          { name: 'DeployAndInstitutionalize', displayName: '展開と定着化', systemName: 'DEPLOY_AND_INSTITUTIONALIZE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Candidate', displayName: '候補段階', systemName: 'CANDIDATE' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'Patterned', displayName: 'パターン化', systemName: 'PATTERNED' },
        { name: 'Systematized', displayName: '体系化済', systemName: 'SYSTEMATIZED' },
        { name: 'Validating', displayName: '検証中', systemName: 'VALIDATING' },
        { name: 'Standardized', displayName: '標準化済', systemName: 'STANDARDIZED' },
        { name: 'Institutionalized', displayName: '定着済', systemName: 'INSTITUTIONALIZED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}