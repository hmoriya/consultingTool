import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

export async function seedShareKnowledge(service: any, capability: any) {
  console.log('    Creating business operation: 知識を共有・伝承する...')
  
  const operation = await parasolDb.businessOperation.create({
    data: {
      serviceId: service.id,
      capabilityId: capability.id,
      name: 'ShareKnowledge',
      displayName: '知識を共有・伝承する',
      design: `# ビジネスオペレーション: 知識を共有・伝承する [ShareKnowledge] [SHARE_KNOWLEDGE]

## オペレーション概要

### 目的
組織内の貴重な知識・ノウハウを部門やチームを超えて効果的に共有し、世代間での知識伝承を確実に行うことで、組織全体の能力向上と持続的成長を実現する

### ビジネス価値
- **効率性向上**: 他部門の知見活用により問題解決時間60%短縮、重複作業80%削減
- **品質向上**: ベストプラクティス共有により全体品質25%向上、ミス発生率40%低減
- **組織力強化**: 部門間シナジー効果30%向上、イノベーション創出頻度2倍増加

### 実行頻度
- **頻度**: 定期共有会（月次）、ナレッジセッション（週次）、メンタリング（随時）
- **トリガー**: 重要プロジェクト完了、新入社員参画、組織変更、技術革新
- **所要時間**: セッション準備1-2時間、実施1-2時間、フォローアップ30分

## ロールと責任

### 関与者
- ナレッジホルダー [KnowledgeHolder] [KNOWLEDGE_HOLDER]
  - 責任: 知識の共有、質問への回答、実践指導
  - 権限: 共有内容の決定、メンター指名

- ナレッジシーカー [KnowledgeSeeker] [KNOWLEDGE_SEEKER]
  - 責任: 積極的な学習、実践、フィードバック
  - 権限: 質問、追加情報要求、実践報告

- ファシリテーター [Facilitator] [FACILITATOR]
  - 責任: 共有セッションの企画・運営、効果測定
  - 権限: セッション設定、参加者調整、形式決定

- ナレッジマネージャー [KnowledgeManager] [KNOWLEDGE_MANAGER]
  - 責任: 共有プロセスの設計、品質管理、文化醸成
  - 権限: ポリシー策定、ツール選定、表彰制度

### RACI マトリクス
| ステップ | ホルダー | シーカー | ファシリテーター | KM |
|---------|---------|---------|----------------|-----|
| 共有計画 | C | I | R | A |
| 内容準備 | R | I | C | C |
| セッション実施 | R | C | A | I |
| 実践支援 | R | C | I | I |
| 効果測定 | C | C | R | A |
| 改善活動 | C | C | R | A |

## ビジネスオペレーション

### プロセスフロー
\`\`\`
[開始:知識共有ニーズ発生]
  ↓
[ステップ1:共有計画立案]
  ↓
[ステップ2:共有内容準備]
  ↓
[ステップ3:共有セッション実施]
  ↓
[ステップ4:実践サポート]
  ↓
[ステップ5:効果測定・評価]
  ↓
[判断:追加支援必要？]
  ├─ Yes → [追加セッション/メンタリング]
  └─ No  → [ステップ6:知識の内面化確認]
  ↓
[ステップ7:共有文化の強化]
  ↓
[終了:知識伝承完了]
\`\`\`

### 各ステップの詳細

#### ステップ1: 共有計画立案 [PlanKnowledgeSharing] [PLAN_KNOWLEDGE_SHARING]
- **目的**: 効果的な知識共有のための戦略的計画を策定
- **入力**: 共有ニーズ、対象知識、参加者情報
- **活動**:
  1. 共有目的・目標の明確化
  2. 対象者の特性・ニーズ分析
  3. 最適な共有方式の選択（講義/ワークショップ/OJT）
  4. スケジュール・場所の調整
  5. 必要リソースの確保
  6. 成功指標の設定
- **出力**: 共有計画書、実施スケジュール
- **所要時間**: 30分-1時間

#### ステップ2: 共有内容準備 [PrepareShareContent] [PREPARE_SHARE_CONTENT]
- **目的**: 参加者が理解しやすく実践可能な内容を準備
- **入力**: 共有計画、既存ナレッジ、事例
- **活動**:
  1. コンテンツの構造化・体系化
  2. 実例・ケーススタディの選定
  3. 演習・ワークの設計
  4. 資料・教材の作成
  5. デモ環境の準備
  6. 事前課題の設定
- **出力**: 共有資料、演習教材、事前課題
- **所要時間**: 2-4時間

#### ステップ3: 共有セッション実施 [ConductSharingSession] [CONDUCT_SHARING_SESSION]
- **目的**: 双方向の対話を通じて深い理解と洞察を提供
- **入力**: 準備済みコンテンツ、参加者リスト
- **活動**:
  1. アイスブレイクと目的共有
  2. 知識・経験の説明と実演
  3. 質疑応答とディスカッション
  4. グループワーク・演習の実施
  5. 実践のポイント解説
  6. 次のステップの提示
- **出力**: セッション記録、参加者フィードバック
- **所要時間**: 1-2時間

#### ステップ4: 実践サポート [SupportPractice] [SUPPORT_PRACTICE]
- **目的**: 学んだ知識を実務で確実に活用できるよう支援
- **入力**: セッション内容、参加者の実践計画
- **活動**:
  1. 実践計画のレビュー・助言
  2. 初期実践の観察・指導
  3. 困難・疑問への対応
  4. 追加リソースの提供
  5. ピアラーニングの促進
  6. 成功体験の共有促進
- **出力**: 実践記録、改善提案
- **所要時間**: 継続的（2-4週間）

#### ステップ5: 効果測定・評価 [MeasureEffectiveness] [MEASURE_EFFECTIVENESS]
- **目的**: 知識共有の効果を定量的に把握し改善につなげる
- **入力**: 実践結果、パフォーマンスデータ
- **活動**:
  1. 知識習得度の評価
  2. 実践適用率の測定
  3. 業務改善効果の算出
  4. 参加者満足度調査
  5. 波及効果の確認
  6. 改善点の抽出
- **出力**: 効果測定レポート、改善提案
- **所要時間**: 1時間

#### ステップ6: 知識の内面化確認 [ConfirmInternalization] [CONFIRM_INTERNALIZATION]
- **目的**: 共有された知識が個人に定着し自律的に活用されることを確認
- **入力**: 効果測定結果、実践継続状況
- **活動**:
  1. 自律的実践の確認
  2. 応用・発展事例の収集
  3. 他者への指導能力評価
  4. 知識の更新・拡張確認
  5. 新たな知見の創出確認
  6. 次世代への伝承準備
- **出力**: 内面化評価、伝承準備状況
- **所要時間**: 30分

#### ステップ7: 共有文化の強化 [StrengthenSharingCulture] [STRENGTHEN_SHARING_CULTURE]
- **目的**: 組織全体で知識共有が当然となる文化を醸成
- **入力**: 共有実績、成功事例
- **活動**:
  1. 成功事例の組織展開
  2. 知識共有貢献者の表彰
  3. 共有プロセスの標準化
  4. インセンティブ設計
  5. 阻害要因の除去
  6. 次期計画への反映
- **出力**: 文化強化施策、表彰記録
- **所要時間**: 継続的活動

## 状態遷移

### 状態定義
- 計画中 [Planning] [PLANNING]: 共有計画を策定中
- 準備中 [Preparing] [PREPARING]: コンテンツを準備中
- 実施中 [Conducting] [CONDUCTING]: セッション実施中
- 実践支援中 [Supporting] [SUPPORTING]: 参加者の実践をサポート中
- 評価中 [Evaluating] [EVALUATING]: 効果を測定・評価中
- 内面化済み [Internalized] [INTERNALIZED]: 知識が定着し自律活用中
- 文化定着 [CultureEmbedded] [CULTURE_EMBEDDED]: 組織文化として定着

### 遷移条件
\`\`\`
計画中 --[計画承認]--> 準備中
準備中 --[準備完了]--> 実施中
実施中 --[セッション終了]--> 実践支援中
実践支援中 --[実践開始]--> 評価中
評価中 --[効果確認]--> 内面化済み
評価中 --[追加支援必要]--> 実践支援中
内面化済み --[組織展開]--> 文化定着
\`\`\`

## ビジネスルール

### 事前条件
1. 共有すべき価値ある知識が特定されている
2. 知識保有者が共有意欲を持っている
3. 受け手に学習意欲と時間がある
4. 適切な共有環境・ツールが利用可能

### 実行中の制約
1. 機密情報は適切に保護しつつ共有
2. 参加者の理解度に応じたペース調整
3. 実践的・具体的な内容を重視
4. 双方向コミュニケーションを確保
5. 心理的安全性の維持

### 事後条件
1. 知識が複数人に伝達されている
2. 受け手が実践可能なレベルに到達
3. 共有記録が保存されている
4. フィードバックが収集されている
5. 次回改善点が明確になっている

## パラソルドメインモデル

### エンティティ定義
- 共有セッション [SharingSession] [SHARING_SESSION]
  - セッションID、タイプ、日時、場所、ホルダーID、参加者リスト、状態
- 共有コンテンツ [SharedContent] [SHARED_CONTENT]
  - コンテンツID、セッションID、タイトル、形式、資料、録画URL
- 実践記録 [PracticeRecord] [PRACTICE_RECORD]
  - 記録ID、参加者ID、実践内容、成果、課題、支援履歴
- 効果測定 [EffectMeasurement] [EFFECT_MEASUREMENT]
  - 測定ID、セッションID、指標、測定値、評価、改善提案

### 値オブジェクト
- 共有方式 [SharingMethod] [SHARING_METHOD]
  - 講義、ワークショップ、OJT、メンタリング、ペアワーク
- 効果指標 [EffectIndicator] [EFFECT_INDICATOR]
  - 理解度、実践率、改善効果、満足度、波及度

## KPI

1. **知識共有参加率**: 対象者の共有セッション参加割合
   - 目標値: 90%以上
   - 測定方法: (参加者数 / 招待者数) × 100
   - 測定頻度: 月次

2. **知識実践適用率**: 学んだ知識を実務で活用した割合
   - 目標値: 80%以上
   - 測定方法: (実践者数 / 参加者数) × 100
   - 測定頻度: セッション後1ヶ月

3. **知識伝播率**: 受け手が他者に知識を伝えた割合
   - 目標値: 50%以上
   - 測定方法: (伝播者数 / 参加者数) × 100
   - 測定頻度: 四半期

4. **業務改善効果**: 知識活用による生産性向上度
   - 目標値: 20%以上
   - 測定方法: (改善後指標 - 改善前指標) / 改善前指標 × 100
   - 測定頻度: 四半期

5. **共有文化成熟度**: 自発的な知識共有の頻度
   - 目標値: 月5件以上/チーム
   - 測定方法: 自発的共有イベント数
   - 測定頻度: 月次`,
      pattern: 'KnowledgeTransfer',
      goal: '組織内の知識を効果的に共有・伝承し、全体の能力向上を実現する',
      roles: JSON.stringify([
        { name: 'KnowledgeHolder', displayName: 'ナレッジホルダー', systemName: 'KNOWLEDGE_HOLDER' },
        { name: 'KnowledgeSeeker', displayName: 'ナレッジシーカー', systemName: 'KNOWLEDGE_SEEKER' },
        { name: 'Facilitator', displayName: 'ファシリテーター', systemName: 'FACILITATOR' },
        { name: 'KnowledgeManager', displayName: 'ナレッジマネージャー', systemName: 'KNOWLEDGE_MANAGER' }
      ]),
      operations: JSON.stringify({
        steps: [
          { name: 'PlanKnowledgeSharing', displayName: '共有計画立案', systemName: 'PLAN_KNOWLEDGE_SHARING' },
          { name: 'PrepareShareContent', displayName: '共有内容準備', systemName: 'PREPARE_SHARE_CONTENT' },
          { name: 'ConductSharingSession', displayName: '共有セッション実施', systemName: 'CONDUCT_SHARING_SESSION' },
          { name: 'SupportPractice', displayName: '実践サポート', systemName: 'SUPPORT_PRACTICE' },
          { name: 'MeasureEffectiveness', displayName: '効果測定・評価', systemName: 'MEASURE_EFFECTIVENESS' },
          { name: 'ConfirmInternalization', displayName: '知識の内面化確認', systemName: 'CONFIRM_INTERNALIZATION' },
          { name: 'StrengthenSharingCulture', displayName: '共有文化の強化', systemName: 'STRENGTHEN_SHARING_CULTURE' }
        ]
      }),
      businessStates: JSON.stringify([
        { name: 'Planning', displayName: '計画中', systemName: 'PLANNING' },
        { name: 'Preparing', displayName: '準備中', systemName: 'PREPARING' },
        { name: 'Conducting', displayName: '実施中', systemName: 'CONDUCTING' },
        { name: 'Supporting', displayName: '実践支援中', systemName: 'SUPPORTING' },
        { name: 'Evaluating', displayName: '評価中', systemName: 'EVALUATING' },
        { name: 'Internalized', displayName: '内面化済み', systemName: 'INTERNALIZED' },
        { name: 'CultureEmbedded', displayName: '文化定着', systemName: 'CULTURE_EMBEDDED' }
      ]),
      useCases: JSON.stringify([]),
      uiDefinitions: JSON.stringify({}),
      testCases: JSON.stringify([])
    }
  })
  
  return { operation }
}