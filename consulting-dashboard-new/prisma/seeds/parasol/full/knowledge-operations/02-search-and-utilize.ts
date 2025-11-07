import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedSearchAndUtilize(service: unknown, capability: unknown) {
  console.log('    Creating business operation: 知識を検索・活用する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'SearchAndUtilizeKnowledge',
      displayName: '知識を検索・活用する',
      design: `# ビジネスオペレーション: 知識を検索・活用する [SearchAndUtilizeKnowledge] [SEARCH_AND_UTILIZE_KNOWLEDGE]

## オペレーション概要

### 目的
蓄積された組織の知識資産から必要な情報を迅速に発見し、現在のプロジェクトや課題解決に効果的に適用することで、業務効率と成果品質を大幅に向上させる

### ビジネス価値
- **時間短縮**: 情報探索時間80%削減、プロジェクト立ち上げ期間50%短縮
- **品質向上**: 過去の成功事例活用により初回品質40%向上、手戻り60%削減
- **イノベーション促進**: 異分野知識の組み合わせによる新提案20%増加

### 実行頻度
- **頻度**: プロジェクト開始時、課題発生時、提案書作成時、日常業務中（随時）
- **トリガー**: 新規案件着手、類似案件の参照必要性、問題解決、スキル習得
- **所要時間**: クイック検索5-10分、詳細調査30分-2時間

## ロールと責任

### 関与者
- 知識利用者 [KnowledgeUser] [KNOWLEDGE_USER]
  - 責任: 適切な検索実施、知識の理解・応用、フィードバック提供
  - 権限: 検索実行、閲覧、ダウンロード、評価

- ナレッジマネージャー [KnowledgeManager] [KNOWLEDGE_MANAGER]
  - 責任: 検索精度向上、利用支援、活用促進
  - 権限: 検索ログ分析、レコメンド設定、利用統計閲覧

- エキスパート [Expert] [EXPERT]
  - 責任: 高度な質問への回答、知識の解釈支援、追加情報提供
  - 権限: 専門知識の補足、直接指導

- システム管理者 [SystemAdministrator] [SYSTEM_ADMINISTRATOR]
  - 責任: 検索システムの最適化、パフォーマンス管理
  - 権限: システム設定、インデックス管理

### RACI マトリクス
| ステップ | 利用者 | KM | エキスパート | システム管理者 |
|---------|-------|-----|------------|---------------|
| ニーズ定義 | R | C | I | I |
| 検索実行 | R | I | I | I |
| 結果評価 | R | C | C | I |
| 知識適用 | R | I | C | I |
| 効果測定 | R | A | C | I |
| 改善提案 | C | R | C | I |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始:知識ニーズ発生]
  ↓
[ステップ1:検索要件定義]
  ↓
[ステップ2:検索実行]
  ↓
[ステップ3:結果評価・選別]
  ↓
[判断:適切な知識発見？]
  ├─ Yes → [ステップ4:知識の理解・解釈]
  └─ No  → [詳細検索/エキスパート相談]
  ↓
[ステップ5:知識の適用・応用]
  ↓
[ステップ6:活用効果の記録]
  ↓
[ステップ7:フィードバック提供]
  ↓
[終了:知識活用完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 検索要件定義 [DefineSearchRequirements] [DEFINE_SEARCH_REQUIREMENTS]
- **目的**: 必要な知識を明確化し効果的な検索戦略を立案
- **入力**: 業務課題、プロジェクト要件、解決したい問題
- **活動**:
  1. 解決したい課題・目的の明確化
  2. 必要な知識タイプの特定（事例/方法論/ツール）
  3. 関連キーワード・概念の洗い出し
  4. 類似プロジェクト・業界の特定
  5. 希望する詳細度・専門性レベルの決定
  6. 時間的制約の確認
- **出力**: 検索要件書、キーワードリスト
- **所要時間**: 5-15分

#### ステップ2: 検索実行 [ExecuteSearch] [EXECUTE_SEARCH]
- **目的**: 効率的に関連知識を発見し候補を絞り込む
- **入力**: 検索要件、キーワード、フィルター条件
- **活動**:
  1. キーワード検索の実行
  2. カテゴリ・タグによる絞り込み
  3. 詳細フィルター適用（期間、作成者、評価等）
  4. 関連度順でのソート
  5. 要約・プレビューでの概要確認
  6. 検索履歴の保存
- **出力**: 検索結果リスト、関連度スコア
- **所要時間**: 5-20分

#### ステップ3: 結果評価・選別 [EvaluateAndSelectResults] [EVALUATE_AND_SELECT_RESULTS]
- **目的**: 検索結果から最適な知識を選定
- **入力**: 検索結果リスト、評価基準
- **活動**:
  1. 各結果の詳細確認
  2. 課題との適合性評価
  3. 信頼性・最新性の確認
  4. 適用可能性の判断
  5. 優先順位付け
  6. 選定理由の記録
- **出力**: 選定知識リスト、評価メモ
- **所要時間**: 10-30分

#### ステップ4: 知識の理解・解釈 [UnderstandAndInterpret] [UNDERSTAND_AND_INTERPRET]
- **目的**: 選定した知識を深く理解し自組織への適用方法を検討
- **入力**: 選定知識、プロジェクトコンテキスト
- **活動**:
  1. 詳細内容の熟読・理解
  2. 前提条件・制約の確認
  3. 自プロジェクトとの差異分析
  4. 適用時の調整点の特定
  5. 不明点のリストアップ
  6. 必要に応じてエキスパートへ質問
- **出力**: 理解した知識、適用計画案
- **所要時間**: 30分-2時間

#### ステップ5: 知識の適用・応用 [ApplyKnowledge] [APPLY_KNOWLEDGE]
- **目的**: 獲得した知識を実際の業務に適用し価値を創出
- **入力**: 理解した知識、適用計画、プロジェクト要件
- **活動**:
  1. 知識のカスタマイズ・ローカライズ
  2. プロジェクトへの組み込み
  3. チームメンバーへの共有・説明
  4. 実施時の工夫・改良
  5. 適用過程の記録
  6. 予期せぬ課題への対処
- **出力**: 適用成果物、実施記録
- **所要時間**: プロジェクトにより変動

#### ステップ6: 活用効果の記録 [RecordUtilizationEffects] [RECORD_UTILIZATION_EFFECTS]
- **目的**: 知識活用による具体的効果を定量的に把握
- **入力**: 適用前後の状況、成果指標
- **活動**:
  1. 工数削減効果の測定
  2. 品質向上度の評価
  3. 顧客満足度の確認
  4. チーム学習効果の記録
  5. 想定外の効果の発見
  6. 改善提案の抽出
- **出力**: 効果測定レポート
- **所要時間**: 30分-1時間

#### ステップ7: フィードバック提供 [ProvideFeedback] [PROVIDE_FEEDBACK]
- **目的**: 知識の改善と検索システムの最適化に貢献
- **入力**: 活用経験、効果測定結果
- **活動**:
  1. ナレッジの評価・レーティング
  2. 活用事例の共有
  3. 改善提案の記載
  4. 追加情報の提供
  5. 関連知識の推薦
  6. システム改善要望の提出
- **出力**: フィードバック記録、改善提案
- **所要時間**: 10-20分

## 状態遷移

### 状態定義
- 検索中 [Searching] [SEARCHING]: 知識を探索中
- 評価中 [Evaluating] [EVALUATING]: 検索結果を評価中
- 学習中 [Learning] [LEARNING]: 知識を理解・解釈中
- 適用中 [Applying] [APPLYING]: 実務に適用中
- 効果測定中 [MeasuringEffect] [MEASURING_EFFECT]: 活用効果を測定中
- 完了 [Completed] [COMPLETED]: 活用サイクル完了
- 再検索中 [ReSearching] [RE_SEARCHING]: 追加知識を探索中

### 遷移条件
\`\`\`
検索中 --[検索完了]--> 評価中
評価中 --[適切な知識発見]--> 学習中
評価中 --[知識不足]--> 再検索中
再検索中 --[追加発見]--> 評価中
学習中 --[理解完了]--> 適用中
適用中 --[適用完了]--> 効果測定中
効果測定中 --[測定完了]--> 完了
適用中 --[追加知識必要]--> 再検索中
\`\`\`

## ビジネスルール

### 事前条件
1. 検索システムへのアクセス権限を保有
2. 基本的な検索スキルを習得済み
3. 業務上の正当な目的が存在
4. 知識活用のガイドラインを理解

### 実行中の制約
1. アクセス権限の範囲内でのみ検索・閲覧
2. 機密区分に従った情報の取り扱い
3. 知的財産権の尊重
4. 出典の明記と著作者への敬意
5. 営業時間外のシステム負荷への配慮

### 事後条件
1. 検索・活用履歴が記録されている
2. 該当ナレッジの利用回数が更新されている
3. フィードバックが登録されている
4. 活用効果が測定可能な状態
5. 次回検索の精度向上に寄与

## パラソルドメインモデル

### エンティティ定義
- 検索セッション [SearchSession] [SEARCH_SESSION]
  - セッションID、利用者ID、開始時刻、検索条件、結果数、選択知識
- 知識活用記録 [KnowledgeUtilization] [KNOWLEDGE_UTILIZATION]
  - 活用ID、ナレッジID、利用者ID、プロジェクトID、活用日、効果
- 検索履歴 [SearchHistory] [SEARCH_HISTORY]
  - 履歴ID、利用者ID、検索キーワード、フィルター、実行時刻、ヒット数
- フィードバック [Feedback] [FEEDBACK]
  - フィードバックID、ナレッジID、提供者ID、内容、評価、提供日

### 値オブジェクト
- 検索条件 [SearchCriteria] [SEARCH_CRITERIA]
  - キーワード、カテゴリ、タグ、期間、作成者
- 活用効果 [UtilizationEffect] [UTILIZATION_EFFECT]
  - 工数削減時間、品質向上度、満足度スコア、ROI

## KPI

1. **検索成功率**: 有用な知識を発見できた検索の割合
   - 目標値: 85%以上
   - 測定方法: (成功検索数 / 全検索数) × 100
   - 測定頻度: 週次

2. **平均検索時間**: 必要な知識発見までの所要時間
   - 目標値: 10分以内
   - 測定方法: 検索開始から選択までの時間の平均
   - 測定頻度: 月次

3. **知識活用による工数削減率**: 知識活用による作業時間短縮
   - 目標値: 30%以上
   - 測定方法: (削減工数 / 通常工数) × 100
   - 測定頻度: プロジェクト毎

4. **ナレッジ再利用率**: 投稿知識の活用頻度
   - 目標値: 各ナレッジ年3回以上
   - 測定方法: 年間活用回数 / ナレッジ数
   - 測定頻度: 四半期

5. **利用者満足度**: 検索システムと知識品質への満足度
   - 目標値: 4.2/5.0以上
   - 測定方法: 利用後アンケートの平均スコア
   - 測定頻度: 月次`,
      pattern: 'SearchAndRetrieve',
      goal: '蓄積された知識から必要な情報を迅速に発見し、業務に効果的に活用する',
      roles: JSON.stringify([
        { name: 'KnowledgeUser', displayName: '知識利用者', systemName: 'KNOWLEDGE_USER' },
        { name: 'KnowledgeManager', displayName: 'ナレッジマネージャー', systemName: 'KNOWLEDGE_MANAGER' },
        { name: 'Expert', displayName: 'エキスパート', systemName: 'EXPERT' },
        { name: 'SystemAdministrator', displayName: 'システム管理者', systemName: 'SYSTEM_ADMINISTRATOR' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'DefineSearchRequirements', displayName: '検索要件定義', systemName: 'DEFINE_SEARCH_REQUIREMENTS' },
          { name: 'ExecuteSearch', displayName: '検索実行', systemName: 'EXECUTE_SEARCH' },
          { name: 'EvaluateAndSelectResults', displayName: '結果評価・選別', systemName: 'EVALUATE_AND_SELECT_RESULTS' },
          { name: 'UnderstandAndInterpret', displayName: '知識の理解・解釈', systemName: 'UNDERSTAND_AND_INTERPRET' },
          { name: 'ApplyKnowledge', displayName: '知識の適用・応用', systemName: 'APPLY_KNOWLEDGE' },
          { name: 'RecordUtilizationEffects', displayName: '活用効果の記録', systemName: 'RECORD_UTILIZATION_EFFECTS' },
          { name: 'ProvideFeedback', displayName: 'フィードバック提供', systemName: 'PROVIDE_FEEDBACK' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Searching', displayName: '検索中', systemName: 'SEARCHING' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' },
        { name: 'Learning', displayName: '学習中', systemName: 'LEARNING' },
        { name: 'Applying', displayName: '適用中', systemName: 'APPLYING' },
        { name: 'MeasuringEffect', displayName: '効果測定中', systemName: 'MEASURING_EFFECT' },
        { name: 'Completed', displayName: '完了', systemName: 'COMPLETED' },
        { name: 'ReSearching', displayName: '再検索中', systemName: 'RE_SEARCHING' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}