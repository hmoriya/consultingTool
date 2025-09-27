import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedOptimizeProfitability(service: any, capability: any) {
  console.log('    Creating business operation: 収益性を最適化する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'OptimizeProfitability',
      displayName: '収益性を最適化する',
      design: `# ビジネスオペレーション: 収益性を最適化する [OptimizeProfitability] [OPTIMIZE_PROFITABILITY]

## オペレーション概要

### 目的
プロジェクトおよび組織全体の収益性を多角的に分析し、利益率を最大化するための戦略的な意思決定と継続的な改善活動を推進することで、持続可能な成長を実現する

### ビジネス価値
- **利益率向上**: プロジェクト営業利益率10-15%改善、ROI 25%向上
- **リスク軽減**: 不採算プロジェクトの早期発見と是正により損失90%削減
- **競争優位性**: データ駆動の価格戦略により競合優位性を確立

### 実行頻度
- **頻度**: 週次（簡易分析）、月次（詳細分析）、四半期（戦略見直し）
- **トリガー**: 重要プロジェクト開始/完了、利益率低下、市場変化
- **所要時間**: 週次分析1-2時間、月次分析1日、戦略見直し2-3日

## ロールと責任

### 関与者
- 収益性アナリスト [ProfitabilityAnalyst] [PROFITABILITY_ANALYST]
  - 責任: 収益性分析、改善提案、モニタリング
  - 権限: データアクセス、分析ツール利用、レポート作成

- 事業部長 [BusinessUnitHead] [BUSINESS_UNIT_HEAD]
  - 責任: 収益性目標設定、戦略決定、リソース配分
  - 権限: 戦略承認、投資判断、組織変更

- プライシングマネージャー [PricingManager] [PRICING_MANAGER]
  - 責任: 価格戦略立案、見積もり最適化、競合分析
  - 権限: 価格設定、割引承認、条件交渉

- CFO [ChiefFinancialOfficer] [CHIEF_FINANCIAL_OFFICER]
  - 責任: 全社収益性管理、投資判断、株主報告
  - 権限: 最終承認、方針決定、例外対応

### RACI マトリクス
| ステップ | アナリスト | 事業部長 | プライシング | CFO |
|---------|-----------|----------|-------------|-----|
| データ収集 | R | I | I | I |
| 収益性分析 | R | C | C | I |
| 改善策立案 | R | A | C | C |
| 戦略決定 | C | R | C | A |
| 実行管理 | C | R | C | I |
| 効果測定 | R | C | C | A |

## ビジネスプロセス

### プロセスフロー
\`\`\`
[開始:収益性最適化サイクル]
  ↓
[ステップ1:収益性データ収集・統合]
  ↓
[ステップ2:多次元収益性分析]
  ↓
[ステップ3:改善機会の特定]
  ↓
[ステップ4:最適化戦略の立案]
  ↓
[判断:大規模変更必要？]
  ├─ Yes → [ステップ5:組織的変革実施]
  └─ No  → [ステップ5:継続的改善実施]
  ↓
[ステップ6:効果測定・検証]
  ↓
[ステップ7:知見の組織展開]
  ↓
[終了:次サイクルへ]
\`\`\`

### 各ステップの詳細

#### ステップ1: 収益性データ収集・統合 [CollectProfitabilityData] [COLLECT_PROFITABILITY_DATA]
- **目的**: 収益性分析に必要な全データを収集し統合
- **入力**: 売上データ、コストデータ、リソース情報、市場データ
- **活動**:
  1. 財務データの抽出（売上、原価、販管費）
  2. 非財務データの収集（稼働率、顧客満足度）
  3. 外部データの取得（市場価格、競合情報）
  4. データクレンジング・正規化
  5. 統合データベースへの格納
  6. データ品質の検証
- **出力**: 統合収益性データセット
- **所要時間**: 2-3時間

#### ステップ2: 多次元収益性分析 [AnalyzeProfitability] [ANALYZE_PROFITABILITY]
- **目的**: 様々な切り口から収益性を詳細に分析
- **入力**: 統合データセット、分析フレームワーク
- **活動**:
  1. プロジェクト別収益性分析
  2. 顧客別・業界別収益性評価
  3. サービスライン別利益率分析
  4. リソース効率性分析
  5. 時系列トレンド分析
  6. What-ifシナリオ分析
- **出力**: 多次元収益性レポート、洞察
- **所要時間**: 4-6時間

#### ステップ3: 改善機会の特定 [IdentifyImprovementOpportunities] [IDENTIFY_IMPROVEMENT_OPPORTUNITIES]
- **目的**: 収益性向上の具体的な機会を発見し優先順位付け
- **入力**: 収益性分析結果、ベンチマーク
- **活動**:
  1. 低収益要因の根本原因分析
  2. 高収益パターンの成功要因抽出
  3. ギャップ分析とポテンシャル算出
  4. 改善施策のブレインストーミング
  5. 実現可能性と影響度の評価
  6. 優先順位マトリクスの作成
- **出力**: 改善機会リスト、優先順位
- **所要時間**: 3-4時間

#### ステップ4: 最適化戦略の立案 [DevelopOptimizationStrategy] [DEVELOP_OPTIMIZATION_STRATEGY]
- **目的**: 収益性を最大化する包括的な戦略を策定
- **入力**: 改善機会、組織能力、市場環境
- **活動**:
  1. 短期・中期・長期施策の設計
  2. 価格戦略の最適化
  3. コスト構造の再設計
  4. ポートフォリオの最適化
  5. 投資計画の策定
  6. リスク評価と対策立案
- **出力**: 収益性最適化戦略書、実行計画
- **所要時間**: 1-2日

#### ステップ5: 変革・改善の実施 [ImplementChanges] [IMPLEMENT_CHANGES]
- **目的**: 策定した戦略を着実に実行し変革を推進
- **入力**: 実行計画、変更管理プロセス
- **活動**:
  1. 実施体制の構築
  2. コミュニケーション計画の実行
  3. 段階的な施策展開
  4. 抵抗管理と動機付け
  5. 進捗モニタリング
  6. 迅速な軌道修正
- **出力**: 実施記録、中間成果
- **所要時間**: 継続的（1-3ヶ月）

#### ステップ6: 効果測定・検証 [MeasureAndValidate] [MEASURE_AND_VALIDATE]
- **目的**: 実施した施策の効果を定量的に測定し検証
- **入力**: 実施前後のデータ、KPI目標値
- **活動**:
  1. KPIの測定と目標対比
  2. 財務インパクトの算出
  3. 副次的効果の評価
  4. 投資対効果（ROI）の計算
  5. 成功要因・失敗要因の分析
  6. 次フェーズへの提言作成
- **出力**: 効果測定レポート、教訓
- **所要時間**: 1日

#### ステップ7: 知見の組織展開 [ShareInsights] [SHARE_INSIGHTS]
- **目的**: 獲得した知見を組織全体で共有し標準化
- **入力**: 成功事例、教訓、ベストプラクティス
- **活動**:
  1. 成功事例のドキュメント化
  2. ベストプラクティスの抽出
  3. 教育プログラムの開発
  4. 組織横断的な共有会の実施
  5. 標準プロセスへの組み込み
  6. 継続的改善文化の醸成
- **出力**: ナレッジ資産、改善標準
- **所要時間**: 1-2日

## 状態遷移

### 状態定義
- 分析準備中 [PreparingAnalysis] [PREPARING_ANALYSIS]: データ収集中
- 分析中 [Analyzing] [ANALYZING]: 収益性分析実施中
- 戦略策定中 [StrategizING] [STRATEGIZING]: 最適化戦略立案中
- 実施中 [Implementing] [IMPLEMENTING]: 改善施策実行中
- 効果測定中 [Measuring] [MEASURING]: 成果測定中
- 展開中 [Deploying] [DEPLOYING]: 知見を組織展開中
- 完了 [Completed] [COMPLETED]: サイクル完了

### 遷移条件
\`\`\`
分析準備中 --[データ収集完了]--> 分析中
分析中 --[分析完了]--> 戦略策定中
戦略策定中 --[戦略承認]--> 実施中
実施中 --[施策完了]--> 効果測定中
効果測定中 --[測定完了]--> 展開中
展開中 --[展開完了]--> 完了
完了 --[新サイクル]--> 分析準備中
\`\`\`

## ビジネスルール

### 事前条件
1. 収益性データへのアクセス権限
2. 分析ツールとスキル
3. 経営層のコミットメント
4. 変更実施の権限

### 実行中の制約
1. 顧客影響の最小化
2. 法規制・契約の遵守
3. 組織文化への配慮
4. リスク管理の徹底
5. 段階的実施の原則

### 事後条件
1. 収益性KPIが改善している
2. 改善施策が定着している
3. 知見が文書化されている
4. 組織学習が進んでいる
5. 継続的改善が仕組み化

## パラソルドメインモデル

### エンティティ定義
- 収益性分析 [ProfitabilityAnalysis] [PROFITABILITY_ANALYSIS]
  - 分析ID、期間、対象、収益性指標、洞察、推奨事項
- 最適化施策 [OptimizationInitiative] [OPTIMIZATION_INITIATIVE]
  - 施策ID、内容、期待効果、投資額、実施状況、成果
- 収益性指標 [ProfitabilityMetric] [PROFITABILITY_METRIC]
  - 指標ID、名称、算出式、目標値、実績値、トレンド
- ベストプラクティス [BestPractice] [BEST_PRACTICE]
  - プラクティスID、内容、適用条件、効果、事例

### 値オブジェクト
- 分析軸 [AnalysisDimension] [ANALYSIS_DIMENSION]
  - プロジェクト、顧客、業界、サービス、地域、期間
- 収益性レベル [ProfitabilityLevel] [PROFITABILITY_LEVEL]
  - 優良、標準、要改善、赤字

## KPI

1. **営業利益率**: 売上高に対する営業利益の割合
   - 目標値: 25%以上
   - 測定方法: 営業利益/売上高 × 100
   - 測定頻度: 月次

2. **EBITDA マージン**: 償却前営業利益率
   - 目標値: 30%以上
   - 測定方法: EBITDA/売上高 × 100
   - 測定頻度: 四半期

3. **顧客収益性**: 顧客別の利益貢献度
   - 目標値: 全顧客の80%が黒字
   - 測定方法: 黒字顧客数/全顧客数 × 100
   - 測定頻度: 四半期

4. **改善施策ROI**: 収益性改善投資の効果
   - 目標値: 300%以上
   - 測定方法: (改善効果-投資額)/投資額 × 100
   - 測定頻度: 施策完了時

5. **収益性予測精度**: 予測と実績の乖離
   - 目標値: ±3%以内
   - 測定方法: |予測-実績|/予測 × 100
   - 測定頻度: 月次`,
      pattern: 'ProfitabilityOptimization',
      goal: '多角的な分析により組織全体の収益性を戦略的に最大化する',
      roles: JSON.stringify([
        { name: 'ProfitabilityAnalyst', displayName: '収益性アナリスト', systemName: 'PROFITABILITY_ANALYST' },
        { name: 'BusinessUnitHead', displayName: '事業部長', systemName: 'BUSINESS_UNIT_HEAD' },
        { name: 'PricingManager', displayName: 'プライシングマネージャー', systemName: 'PRICING_MANAGER' },
        { name: 'ChiefFinancialOfficer', displayName: 'CFO', systemName: 'CHIEF_FINANCIAL_OFFICER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'CollectProfitabilityData', displayName: '収益性データ収集・統合', systemName: 'COLLECT_PROFITABILITY_DATA' },
          { name: 'AnalyzeProfitability', displayName: '多次元収益性分析', systemName: 'ANALYZE_PROFITABILITY' },
          { name: 'IdentifyImprovementOpportunities', displayName: '改善機会の特定', systemName: 'IDENTIFY_IMPROVEMENT_OPPORTUNITIES' },
          { name: 'DevelopOptimizationStrategy', displayName: '最適化戦略の立案', systemName: 'DEVELOP_OPTIMIZATION_STRATEGY' },
          { name: 'ImplementChanges', displayName: '変革・改善の実施', systemName: 'IMPLEMENT_CHANGES' },
          { name: 'MeasureAndValidate', displayName: '効果測定・検証', systemName: 'MEASURE_AND_VALIDATE' },
          { name: 'ShareInsights', displayName: '知見の組織展開', systemName: 'SHARE_INSIGHTS' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'PreparingAnalysis', displayName: '分析準備中', systemName: 'PREPARING_ANALYSIS' },
        { name: 'Analyzing', displayName: '分析中', systemName: 'ANALYZING' },
        { name: 'Strategizing', displayName: '戦略策定中', systemName: 'STRATEGIZING' },
        { name: 'Implementing', displayName: '実施中', systemName: 'IMPLEMENTING' },
        { name: 'Measuring', displayName: '効果測定中', systemName: 'MEASURING' },
        { name: 'Deploying', displayName: '展開中', systemName: 'DEPLOYING' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}