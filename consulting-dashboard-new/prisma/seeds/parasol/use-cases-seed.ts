import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ユースケースのMD形式定義
export const useCaseDefinitions = {
  // プロジェクトを的確に計画する
  gatherRequirements: `# ユースケース: 要求を収集する [GatherRequirements] [GATHER_REQUIREMENTS]

## 概要
クライアントから要求を体系的に収集し、プロジェクトの基礎となる情報を整理する

## アクター
### 主アクター
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]

### 副アクター
- ビジネスアナリスト [BusinessAnalyst] [BUSINESS_ANALYST]
- クライアントステークホルダー [ClientStakeholder] [CLIENT_STAKEHOLDER]

## 事前条件
- プロジェクト開始が承認されている
- ステークホルダーが特定されている
- インタビュースケジュールが調整済み

## 事後条件
- 要求一覧が文書化されている
- ステークホルダーマップが作成されている
- 初期スコープが定義されている

## 基本フロー
1. ステークホルダーリストを確認する
2. インタビューガイドを準備する
3. キーステークホルダーとのインタビューを実施する
4. 現状の課題と要望をヒアリングする
5. ビジネスゴールを明確化する
6. 期待される成果を確認する
7. 制約条件を確認する
8. インタビュー結果を文書化する
9. 要求一覧を作成する
10. ステークホルダーに確認を取る

## 代替フロー
### A1: リモートインタビュー
3a. オンラインでインタビューを実施する場合
  1. Web会議ツールを準備する
  2. 画面共有で資料を提示する
  3. 録画の許可を得る
  4. 通常フローの4に戻る

### A2: アンケート形式
3b. 大人数の場合はアンケートを活用
  1. アンケートフォームを作成する
  2. 対象者に配布する
  3. 回答を収集・分析する
  4. 追加インタビューの対象を選定する
  5. 通常フローの4に戻る

## 例外フロー
### E1: ステークホルダー不在
- キーステークホルダーが不在の場合は、代理人を立てるか日程を再調整する

### E2: 要求の矛盾
- ステークホルダー間で要求が矛盾する場合は、優先順位付けのための追加セッションを設定する`,

  createProjectPlan: `# ユースケース: プロジェクト計画を作成する [CreateProjectPlan] [CREATE_PROJECT_PLAN]

## 概要
収集した要求を基に、実行可能なプロジェクト計画を作成する

## アクター
### 主アクター
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]

### 副アクター
- ソリューションアーキテクト [SolutionArchitect] [SOLUTION_ARCHITECT]
- リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]

## 事前条件
- 要求が収集・整理されている
- プロジェクトスコープが合意されている
- 利用可能なリソースが確認されている

## 事後条件
- プロジェクト計画書が作成されている
- WBSが定義されている
- スケジュールが作成されている
- リソース計画が完成している

## 基本フロー
1. プロジェクトスコープを確認する
2. 成果物一覧を定義する
3. WBS（作業分解構造）を作成する
4. タスクの依存関係を定義する
5. 各タスクの工数を見積もる
6. クリティカルパスを特定する
7. リソース要件を定義する
8. スケジュールを作成する
9. 予算を算出する
10. リスク一覧を作成する
11. プロジェクト計画書にまとめる
12. 内部レビューを実施する

## 代替フロー
### A1: アジャイル計画
5a. アジャイル手法を採用する場合
  1. エピック・ユーザーストーリーを定義する
  2. プロダクトバックログを作成する
  3. スプリント計画を立てる
  4. リリース計画を作成する
  5. 通常フローの7に戻る

## 例外フロー
### E1: リソース不足
- 必要なリソースが確保できない場合は、スコープ調整または外部調達を検討する

### E2: 予算超過
- 見積もりが予算を超過する場合は、段階的実施やスコープ削減を検討する`,

  // プロジェクト進捗を可視化する
  collectProgress: `# ユースケース: 進捗情報を収集する [CollectProgress] [COLLECT_PROGRESS]

## 概要
プロジェクトメンバーから最新の進捗情報を収集し、統合する

## アクター
### 主アクター
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]

### 副アクター
- チームメンバー [TeamMember] [TEAM_MEMBER]
- タスク担当者 [TaskOwner] [TASK_OWNER]

## 事前条件
- プロジェクトが実行フェーズにある
- タスクが割り当てられている
- 進捗報告のルールが定められている

## 事後条件
- 全タスクの最新進捗が記録されている
- 工数実績が更新されている
- 課題・リスクが更新されている

## 基本フロー
1. 進捗収集の通知を送信する
2. タスク一覧を表示する
3. 各タスクの進捗率を入力する
4. 実績工数を記録する
5. 完了したタスクをマークする
6. 新たに発生した課題を記録する
7. リスク状況を更新する
8. 進捗コメントを追加する
9. 進捗情報を保存する
10. 進捗サマリーを生成する

## 代替フロー
### A1: 自動収集
3a. ツールから自動的に進捗を取得
  1. 開発ツールと連携する
  2. コミット情報から進捗を推定する
  3. 自動計算された進捗を確認する
  4. 必要に応じて手動調整する
  5. 通常フローの5に戻る

## 例外フロー
### E1: 進捗報告遅延
- メンバーからの報告が遅れている場合は、リマインダーを送信し、必要に応じて直接確認する

### E2: 矛盾する情報
- 報告内容に矛盾がある場合は、該当メンバーに確認を取り、正しい情報を確定する`,

  // リソースを最適配置する
  requestResource: `# ユースケース: リソース要求を登録する [RequestResource] [REQUEST_RESOURCE]

## 概要
プロジェクトに必要なリソース要求を登録し、最適な人材の配置を依頼する

## アクター
### 主アクター
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]

### 副アクター
- リソースマネージャー [ResourceManager] [RESOURCE_MANAGER]

## 事前条件
- プロジェクトが承認されている
- 必要なスキルセットが定義されている
- 期間と工数が見積もられている

## 事後条件
- リソース要求が登録されている
- 要求の優先度が設定されている
- リソースマネージャーに通知されている

## 基本フロー
1. リソース要求フォームを開く
2. プロジェクト情報を選択する
3. 必要なスキルセットを指定する
4. 役割と責任範囲を定義する
5. 必要な期間を入力する
6. 想定工数を入力する
7. 優先度を設定する
8. 希望する人材があれば指定する
9. 要求理由を記載する
10. リソース要求を送信する
11. 確認通知を受け取る

## 代替フロー
### A1: 複数リソース要求
3a. 複数の役割が必要な場合
  1. 役割ごとに要求を分割する
  2. 各役割の要求を作成する
  3. 役割間の関係性を明記する
  4. 通常フローの4に戻る

## 例外フロー
### E1: スキル未定義
- 必要なスキルが選択肢にない場合は、新規スキルの追加をリクエストする

### E2: 期間重複
- 既存プロジェクトと期間が重複する場合は、調整案を提示する`,

  // プロジェクト知識を保全する
  recordKnowledge: `# ユースケース: 知識を記録する [RecordKnowledge] [RECORD_KNOWLEDGE]

## 概要
プロジェクトで得られた知識や経験を記録し、組織の資産として保存する

## アクター
### 主アクター
- コンサルタント [Consultant] [CONSULTANT]

### 副アクター
- ナレッジマネージャー [KnowledgeManager] [KNOWLEDGE_MANAGER]
- プロジェクトマネージャー [ProjectManager] [PROJECT_MANAGER]

## 事前条件
- 記録すべき知識が特定されている
- ナレッジ記録のテンプレートがある
- 記録の承認プロセスが定義されている

## 事後条件
- 知識が文書化されている
- 適切なカテゴリに分類されている
- レビューのために提出されている

## 基本フロー
1. ナレッジ記録画面を開く
2. 記事タイトルを入力する
3. カテゴリを選択する
4. 背景・コンテキストを記載する
5. 問題・課題を記述する
6. 解決策・アプローチを詳述する
7. 得られた成果を記載する
8. 学んだ教訓を整理する
9. 関連資料を添付する
10. タグを設定する
11. 下書きを保存する
12. レビューに提出する

## 代替フロー
### A1: テンプレート利用
3a. 既存テンプレートを使用する場合
  1. テンプレート一覧から選択する
  2. テンプレートを読み込む
  3. 必要な項目を埋める
  4. 通常フローの9に戻る

### A2: 共同執筆
5a. 複数人で執筆する場合
  1. 共同執筆者を指定する
  2. 編集権限を設定する
  3. 各自の担当部分を決める
  4. 並行して執筆を進める
  5. 統合版を作成する
  6. 通常フローの9に戻る

## 例外フロー
### E1: 機密情報の扱い
- 機密情報が含まれる場合は、公開範囲を制限し、機密レベルを設定する

### E2: 類似記事の存在
- 類似の記事が既に存在する場合は、既存記事の更新か新規作成かを選択する`
}

// ユースケースの作成
interface OperationType {
  id: string
  name: string
  description: string
  serviceId: string
  useCases?: Array<{
    id: string
    name: string
    description: string
    actors: string[]
    preconditions: string[]
    postconditions: string[]
    mainFlow: string[]
    alternativeFlows: string[]
    exceptions: string[]
  }>
}

export async function createUseCases(operations: OperationType[]) {
  console.log('  Creating use cases...')

  const useCases = []

  // プロジェクトを的確に計画するのユースケース
  const planningOp = operations.find(op => op.name === 'ProjectPlanning')
  if (planningOp) {
    useCases.push({
      operationId: planningOp.id,
      name: 'GatherRequirements',
      displayName: '要求を収集する',
      description: 'クライアントから要求を体系的に収集し、プロジェクトの基礎となる情報を整理する',
      definition: useCaseDefinitions.gatherRequirements,
      order: 1,
      actors: JSON.stringify({ primary: 'ProjectManager', secondary: ['BusinessAnalyst', 'ClientStakeholder'] }),
      preconditions: JSON.stringify(['プロジェクト開始が承認されている', 'ステークホルダーが特定されている']),
      postconditions: JSON.stringify(['要求一覧が文書化されている', 'ステークホルダーマップが作成されている']),
      basicFlow: JSON.stringify([
        'ステークホルダーリストを確認する',
        'インタビューガイドを準備する',
        'キーステークホルダーとのインタビューを実施する'
      ]),
      alternativeFlow: JSON.stringify(['リモートインタビュー', 'アンケート形式']),
      exceptionFlow: JSON.stringify(['ステークホルダー不在', '要求の矛盾'])
    })

    useCases.push({
      operationId: planningOp.id,
      name: 'CreateProjectPlan',
      displayName: 'プロジェクト計画を作成する',
      description: '収集した要求を基に、実行可能なプロジェクト計画を作成する',
      definition: useCaseDefinitions.createProjectPlan,
      order: 2,
      actors: JSON.stringify({ primary: 'ProjectManager', secondary: ['SolutionArchitect', 'ResourceManager'] }),
      preconditions: JSON.stringify(['要求が収集・整理されている', 'プロジェクトスコープが合意されている']),
      postconditions: JSON.stringify(['プロジェクト計画書が作成されている', 'WBSが定義されている']),
      basicFlow: JSON.stringify([
        'プロジェクトスコープを確認する',
        'WBSを作成する',
        'スケジュールを作成する'
      ]),
      alternativeFlow: JSON.stringify(['アジャイル計画']),
      exceptionFlow: JSON.stringify(['リソース不足', '予算超過'])
    })
  }

  // プロジェクト進捗を可視化するのユースケース
  const progressOp = operations.find(op => op.name === 'ProjectProgress')
  if (progressOp) {
    useCases.push({
      operationId: progressOp.id,
      name: 'CollectProgress',
      displayName: '進捗情報を収集する',
      description: 'プロジェクトメンバーから最新の進捗情報を収集し、統合する',
      definition: useCaseDefinitions.collectProgress,
      order: 1,
      actors: JSON.stringify({ primary: 'ProjectManager', secondary: ['TeamMember', 'TaskOwner'] }),
      preconditions: JSON.stringify(['プロジェクトが実行フェーズにある', 'タスクが割り当てられている']),
      postconditions: JSON.stringify(['全タスクの最新進捗が記録されている', '工数実績が更新されている']),
      basicFlow: JSON.stringify([
        '進捗収集の通知を送信する',
        'タスク一覧を表示する',
        '各タスクの進捗率を入力する'
      ]),
      alternativeFlow: JSON.stringify(['自動収集']),
      exceptionFlow: JSON.stringify(['進捗報告遅延', '矛盾する情報'])
    })
  }

  // リソースを最適配置するのユースケース
  const resourceOp = operations.find(op => op.name === 'ResourceOptimization')
  if (resourceOp) {
    useCases.push({
      operationId: resourceOp.id,
      name: 'RequestResource',
      displayName: 'リソース要求を登録する',
      description: 'プロジェクトに必要なリソース要求を登録し、最適な人材の配置を依頼する',
      definition: useCaseDefinitions.requestResource,
      order: 1,
      actors: JSON.stringify({ primary: 'ProjectManager', secondary: ['ResourceManager'] }),
      preconditions: JSON.stringify(['プロジェクトが承認されている', '必要なスキルセットが定義されている']),
      postconditions: JSON.stringify(['リソース要求が登録されている', 'リソースマネージャーに通知されている']),
      basicFlow: JSON.stringify([
        'リソース要求フォームを開く',
        '必要なスキルセットを指定する',
        'リソース要求を送信する'
      ]),
      alternativeFlow: JSON.stringify(['複数リソース要求']),
      exceptionFlow: JSON.stringify(['スキル未定義', '期間重複'])
    })
  }

  // プロジェクト知識を保全するのユースケース
  const knowledgeOp = operations.find(op => op.name === 'KnowledgeCapture')
  if (knowledgeOp) {
    useCases.push({
      operationId: knowledgeOp.id,
      name: 'RecordKnowledge',
      displayName: '知識を記録する',
      description: 'プロジェクトで得られた知識や経験を記録し、組織の資産として保存する',
      definition: useCaseDefinitions.recordKnowledge,
      order: 1,
      actors: JSON.stringify({ primary: 'Consultant', secondary: ['KnowledgeManager', 'ProjectManager'] }),
      preconditions: JSON.stringify(['記録すべき知識が特定されている', 'ナレッジ記録のテンプレートがある']),
      postconditions: JSON.stringify(['知識が文書化されている', '適切なカテゴリに分類されている']),
      basicFlow: JSON.stringify([
        'ナレッジ記録画面を開く',
        '記事タイトルを入力する',
        '解決策・アプローチを詳述する'
      ]),
      alternativeFlow: JSON.stringify(['テンプレート利用', '共同執筆']),
      exceptionFlow: JSON.stringify(['機密情報の扱い', '類似記事の存在'])
    })
  }

  const createdUseCases = []
  for (const useCase of useCases) {
    const created = await parasolDb.useCase.create({
      data: useCase
    })
    createdUseCases.push(created)
  }

  return createdUseCases
}