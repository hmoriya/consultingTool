import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client'

const parasolDb = new ParasolPrismaClient()

// ページ定義のMD形式（自然言語設計）
export const pageDefinitionContents = {
  requirementForm: `# ページ定義：要求収集フォーム

## 画面の目的
クライアントからの要求を体系的に収集し、プロジェクトの基礎情報として記録する

## 利用者
- 主要利用者：プロジェクトマネージャー、ビジネスアナリスト
- 副次利用者：ソリューションアーキテクト

## 画面構成
### ヘッダーエリア
- プロジェクト名とクライアント名の表示
- 現在のステップ表示（要求収集フェーズ）
- 保存状態の表示

### 基本情報入力エリア
- インタビュー日時の記録
- 対象ステークホルダーの選択
- インタビュー形式の選択（対面、オンライン、書面）

### 要求内容記録エリア
- ビジネスゴールの記入欄
- 現状の課題の記入欄
- 期待される成果の記入欄
- 制約条件の記入欄
- 優先順位の設定

### 添付資料エリア
- 関連ドキュメントのアップロード
- 参考資料へのリンク登録

### アクションエリア
- 下書き保存ボタン
- 内容確認画面への遷移ボタン
- キャンセルボタン

## 画面の振る舞い
- 必須項目が未入力の場合は、該当項目を強調表示
- 自動保存機能により、5分ごとに入力内容を保存
- ステークホルダーの追加・削除が可能
- テキスト入力欄は、十分な文字数の入力に対応

## 画面遷移
- プロジェクト一覧画面から遷移
- 保存後は要求一覧画面へ遷移
- 確認画面を経由してステークホルダーへの確認依頼画面へ`,

  projectPlanEdit: `# ページ定義：プロジェクト計画編集画面

## 画面の目的
収集した要求を基に、実行可能なプロジェクト計画を作成・編集する

## 利用者
- 主要利用者：プロジェクトマネージャー
- 副次利用者：ソリューションアーキテクト、リソースマネージャー

## 画面構成
### プロジェクト概要エリア
- プロジェクト基本情報の表示
- スコープサマリーの表示・編集
- 主要成果物の定義

### WBS（作業分解構造）エリア
- 階層的なタスク構造の表示
- タスクの追加・編集・削除機能
- 依存関係の設定
- 工数見積もりの入力

### スケジュールエリア
- ガントチャート形式でのスケジュール表示
- マイルストーンの設定
- クリティカルパスの強調表示
- バッファーの可視化

### リソース計画エリア
- 必要なスキルセットの定義
- 役割別の必要人数
- 期間ごとの負荷状況

### 予算計画エリア
- コスト見積もりの入力
- 費用項目別の内訳
- 予実比較の準備

## 画面の振る舞い
- WBSの変更は即座にスケジュールに反映
- リソースの過負荷を警告表示
- 予算超過の場合はアラート表示
- 変更履歴の自動記録

## 画面遷移
- 要求一覧画面から遷移
- 保存後は計画レビュー画面へ遷移
- 承認後はプロジェクト実行画面へ`,

  progressDashboard: `# ページ定義：進捗ダッシュボード

## 画面の目的
プロジェクトの進捗状況を一目で把握し、意思決定に必要な情報を提供する

## 利用者
- 主要利用者：プロジェクトマネージャー、エグゼクティブ
- 副次利用者：チームメンバー、クライアント

## 画面構成
### サマリーエリア
- 全体進捗率の大きな表示
- 予定対実績の比較グラフ
- 主要KPIの表示（コスト、品質、納期）

### マイルストーン進捗エリア
- 各マイルストーンの達成状況
- 遅延しているマイルストーンの強調
- 次の重要マイルストーンまでの日数

### タスク進捗詳細エリア
- タスク一覧と各タスクの進捗バー
- 担当者別の進捗状況
- 遅延タスクのフィルタリング機能

### 課題・リスクエリア
- アクティブな課題の一覧
- リスクレベル別の表示
- 対応状況のステータス

### トレンドエリア
- 進捗率の推移グラフ
- バーンダウンチャート
- 予測完了日の表示

## 画面の振る舞い
- リアルタイムでデータを更新
- ドリルダウンで詳細情報を表示
- 異常値は色を変えて警告
- エクスポート機能でレポート作成支援

## 画面遷移
- プロジェクト一覧から選択して遷移
- 各要素をクリックで詳細画面へ
- レポート作成画面への遷移`,

  resourceRequestForm: `# ページ定義：リソース要求登録画面

## 画面の目的
プロジェクトに必要な人材の要求を詳細に登録し、最適な配置を依頼する

## 利用者
- 主要利用者：プロジェクトマネージャー
- 副次利用者：リソースマネージャー

## 画面構成
### プロジェクト情報エリア
- プロジェクトの選択
- プロジェクト概要の表示
- 現在のチーム構成の表示

### 要求詳細入力エリア
- 必要な役割の選択
- 求められるスキルセットの指定
- スキルレベルの要求水準
- 業界知識の要否
- 必要な期間の設定
- 稼働率の指定

### 優先度・制約エリア
- 要求の優先度設定
- 希望する人材の指名（任意）
- 制約条件の記入
- 代替案の可否

### 要求理由エリア
- なぜこのリソースが必要かの説明
- 期待される貢献の記述
- 配置による効果の説明

## 画面の振る舞い
- スキル選択は複数選択可能
- 期間設定時にカレンダーから選択
- 必須項目の入力チェック
- 類似要求の参考表示

## 画面遷移
- プロジェクト詳細画面から遷移
- 送信後は要求一覧画面へ
- リソースマネージャーへ通知`,

  knowledgeEditor: `# ページ定義：ナレッジ記録エディター

## 画面の目的
プロジェクトで得られた知識や教訓を構造化して記録し、将来の活用に備える

## 利用者
- 主要利用者：コンサルタント
- 副次利用者：ナレッジマネージャー、プロジェクトマネージャー

## 画面構成
### 記事情報エリア
- タイトルの入力欄
- カテゴリの選択
- タグの設定
- 公開範囲の設定

### コンテンツ編集エリア
- リッチテキストエディター
- 見出し構造の設定
- 画像・図表の挿入
- コードブロックの記述
- マークダウン記法のサポート

### メタ情報エリア
- プロジェクトとの関連付け
- 関連ナレッジへのリンク
- 参考文献の追加
- キーワードの設定

### プレビューエリア
- 記事の見た目を確認
- モバイル表示の確認
- 印刷プレビュー

### アクションエリア
- 下書き保存
- レビュー依頼
- 公開設定
- バージョン管理

## 画面の振る舞い
- 自動保存機能で編集内容を保護
- テンプレートからの作成支援
- 類似記事の重複チェック
- 共同編集時の競合防止

## 画面遷移
- ナレッジ一覧から新規作成
- プロジェクト完了画面から誘導
- 保存後はレビュー画面へ
- 公開後は記事詳細画面へ`
}

// ページ定義の作成
export async function createPageDefinitions(useCases: unknown[]) {
  console.log('  Creating page definitions...')

  const pageDefinitions = []

  // 要求を収集するユースケースのページ定義
  const gatherReqUC = useCases.find(uc => uc.name === 'GatherRequirements')
  if (gatherReqUC) {
    pageDefinitions.push({
      useCaseId: gatherReqUC.id,
      name: 'RequirementForm',
      displayName: '要求収集フォーム',
      description: 'クライアントからの要求を体系的に収集するための入力画面',
      url: '/projects/requirements/new'
    })
  }

  // プロジェクト計画を作成するユースケースのページ定義
  const createPlanUC = useCases.find(uc => uc.name === 'CreateProjectPlan')
  if (createPlanUC) {
    pageDefinitions.push({
      useCaseId: createPlanUC.id,
      name: 'ProjectPlanEdit',
      displayName: 'プロジェクト計画編集画面',
      description: 'プロジェクト計画を作成・編集するための画面',
      url: '/projects/plans/edit'
    })
  }

  // 進捗情報を収集するユースケースのページ定義
  const collectProgUC = useCases.find(uc => uc.name === 'CollectProgress')
  if (collectProgUC) {
    pageDefinitions.push({
      useCaseId: collectProgUC.id,
      name: 'ProgressDashboard',
      displayName: '進捗ダッシュボード',
      description: 'プロジェクトの進捗状況を可視化するダッシュボード',
      url: '/projects/progress'
    })
  }

  // リソース要求を登録するユースケースのページ定義
  const reqResourceUC = useCases.find(uc => uc.name === 'RequestResource')
  if (reqResourceUC) {
    pageDefinitions.push({
      useCaseId: reqResourceUC.id,
      name: 'ResourceRequestForm',
      displayName: 'リソース要求登録画面',
      description: 'プロジェクトに必要なリソースを要求する画面',
      url: '/resources/requests/new'
    })
  }

  // 知識を記録するユースケースのページ定義
  const recordKnowUC = useCases.find(uc => uc.name === 'RecordKnowledge')
  if (recordKnowUC) {
    pageDefinitions.push({
      useCaseId: recordKnowUC.id,
      name: 'KnowledgeEditor',
      displayName: 'ナレッジ記録エディター',
      description: 'プロジェクトの知識や教訓を記録するエディター',
      url: '/knowledge/articles/new'
    })
  }

  const createdPageDefs = []
  for (const pageDef of pageDefinitions) {
    // レイアウトやコンポーネントはデフォルト値を設定
    const created = await parasolDb.pageDefinition.create({
      data: {
        ...pageDef,
        layout: JSON.stringify({}),
        components: JSON.stringify({}),
        stateManagement: JSON.stringify({}),
        validations: JSON.stringify({})
      }
    })
    createdPageDefs.push(created)
  }

  return createdPageDefs
}