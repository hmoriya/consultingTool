export interface UseCase {
  id: string
  title: string
  description: string
  actors: string[]
  category: 'executive' | 'pm' | 'consultant' | 'client' | 'common'
  steps: string[]
}

export const USE_CASES: UseCase[] = [
  // エグゼクティブ向け
  {
    id: 'exec-portfolio',
    title: 'プロジェクトポートフォリオ管理',
    description: '全社のプロジェクトを俯瞰し、リソース配分と収益性を最適化',
    actors: ['Executive'],
    category: 'executive',
    steps: [
      'エグゼクティブダッシュボードにアクセス',
      'プロジェクト一覧で全体状況を把握',
      '収益性・稼働率のKPIを確認',
      'リソース再配分の意思決定',
      '月次レポートの確認'
    ]
  },
  {
    id: 'exec-financial',
    title: '財務分析・予実管理',
    description: '収益・コストを分析し、事業の健全性を評価',
    actors: ['Executive'],
    category: 'executive',
    steps: [
      '財務ダッシュボードを開く',
      '月次収益・利益率を確認',
      '前月比・前年比の分析',
      '予算対実績の差異確認',
      'アクションプランの策定'
    ]
  },

  // PM向け
  {
    id: 'pm-project-create',
    title: '新規プロジェクト作成・セットアップ',
    description: '新規プロジェクトの基本情報登録、チーム編成、初期計画の策定',
    actors: ['PM', 'Executive'],
    category: 'pm',
    steps: [
      'プロジェクト作成画面にアクセス',
      '基本情報（プロジェクト名、期間、予算）を入力',
      'チームメンバーをアサイン',
      'マイルストーンとタスクを設定',
      'キックオフ会議の設定'
    ]
  },
  {
    id: 'pm-project-mgmt',
    title: 'プロジェクト進捗管理',
    description: 'タスク・マイルストーンを管理し、プロジェクトを成功に導く',
    actors: ['PM'],
    category: 'pm',
    steps: [
      'PMダッシュボードにアクセス',
      'プロジェクトの進捗状況確認',
      'タスクの割当・優先度設定',
      'リスクの識別と対策立案',
      'チームメンバーの稼働状況確認'
    ]
  },
  {
    id: 'pm-timesheet-approval',
    title: '工数承認',
    description: 'チームメンバーの工数を確認・承認',
    actors: ['PM'],
    category: 'pm',
    steps: [
      'タイムシート承認画面を開く',
      '未承認の工数一覧を確認',
      '工数の妥当性をチェック',
      '承認または差戻し',
      '月次締め処理の実行'
    ]
  },

  // コンサルタント向け
  {
    id: 'consultant-task',
    title: '個人タスク管理',
    description: '割り当てられたタスクを効率的に管理・実行',
    actors: ['Consultant'],
    category: 'consultant',
    steps: [
      'コンサルタントダッシュボードにアクセス',
      '今日のタスク一覧を確認',
      'タスクのステータス更新',
      '作業時間の記録',
      '成果物のアップロード'
    ]
  },
  {
    id: 'consultant-timesheet',
    title: '工数入力',
    description: '日々の作業時間を正確に記録',
    actors: ['Consultant'],
    category: 'consultant',
    steps: [
      'タイムシート画面を開く',
      'プロジェクト・タスクを選択',
      '作業時間を入力',
      '作業内容を記載',
      'PMへ承認申請'
    ]
  },
  {
    id: 'consultant-skill',
    title: 'スキル管理',
    description: '自身のスキルを登録・更新し、適切なアサインを受ける',
    actors: ['Consultant'],
    category: 'consultant',
    steps: [
      'スキル管理画面にアクセス',
      '保有スキルの検索・追加',
      'スキルレベルの自己評価',
      '資格・認定の登録',
      'プロファイルの更新'
    ]
  },

  // クライアント向け
  {
    id: 'client-progress',
    title: 'プロジェクト進捗確認',
    description: '委託プロジェクトの状況を把握',
    actors: ['Client'],
    category: 'client',
    steps: [
      'クライアントダッシュボードにアクセス',
      'プロジェクト概要の確認',
      '進捗率・マイルストーン達成状況',
      '成果物のレビュー',
      'フィードバックの送信'
    ]
  },
  {
    id: 'client-document',
    title: '成果物確認・承認',
    description: 'プロジェクトの成果物をレビューし承認',
    actors: ['Client'],
    category: 'client',
    steps: [
      '成果物一覧にアクセス',
      '提出された成果物を確認',
      'ドキュメントのダウンロード',
      'レビューコメントの記載',
      '承認または修正依頼'
    ]
  },

  // 共通
  {
    id: 'common-message',
    title: 'メッセージ・コミュニケーション',
    description: 'プロジェクトメンバーとコミュニケーション、ファイル共有、メンション機能',
    actors: ['All'],
    category: 'common',
    steps: [
      'メッセージ画面を開く',
      'チャンネルまたは相手を選択',
      'テキストメッセージを入力して送信',
      '絵文字ボタンで絵文字を追加',
      '@でメンバーをメンション',
      'ペーパークリップボタンでファイルを共有',
      'メッセージにリアクションを追加',
      'スレッドで返信する',
      '通知・メンションの確認'
    ]
  },
  {
    id: 'common-notification',
    title: '通知確認',
    description: '重要な更新や承認依頼を確認',
    actors: ['All'],
    category: 'common',
    steps: [
      '通知アイコンをクリック',
      '未読通知の一覧確認',
      '詳細画面への遷移',
      '必要なアクション実行',
      '通知の既読処理'
    ]
  },

  // ナレッジ管理
  {
    id: 'knowledge-article-create',
    title: 'ナレッジ記事の作成・公開',
    description: 'プロジェクトの教訓、技術的知見、業界情報を文書化し共有',
    actors: ['Consultant', 'PM'],
    category: 'common',
    steps: [
      'ナレッジ管理画面にアクセス',
      '新規記事の作成',
      'カテゴリとタグの設定',
      '内容の執筆（マークダウン形式）',
      'レビュー申請と公開'
    ]
  },
  {
    id: 'knowledge-search',
    title: 'ナレッジ検索・活用',
    description: '過去の知見やベストプラクティスを検索し、プロジェクトに活用',
    actors: ['All'],
    category: 'common',
    steps: [
      'ナレッジ検索画面を開く',
      'キーワード・カテゴリで検索',
      '検索結果の確認',
      '記事の詳細閲覧',
      'ブックマーク・いいねの追加'
    ]
  },
  {
    id: 'knowledge-faq',
    title: 'FAQ管理',
    description: 'よくある質問と回答を管理し、問題解決を効率化',
    actors: ['PM', 'Admin'],
    category: 'common',
    steps: [
      'FAQ管理画面にアクセス',
      '新規FAQ項目の作成',
      '質問と回答の記入',
      'カテゴリの分類',
      '公開・更新'
    ]
  },
  {
    id: 'knowledge-template',
    title: 'テンプレート管理',
    description: '提案書やレポートのテンプレートを管理・共有',
    actors: ['PM', 'Consultant'],
    category: 'common',
    steps: [
      'テンプレート一覧にアクセス',
      'テンプレートの選択・ダウンロード',
      '新規テンプレートの登録',
      'テンプレートの編集・更新',
      '使用履歴の確認'
    ]
  },
  {
    id: 'knowledge-expert',
    title: 'エキスパート検索・相談',
    description: '社内の専門家を検索し、知見を共有',
    actors: ['All'],
    category: 'common',
    steps: [
      'エキスパート検索画面を開く',
      '専門分野・スキルで検索',
      'エキスパートプロフィール確認',
      '相談リクエストの送信',
      'レビュー・評価の投稿'
    ]
  }
]

export const USE_CASE_CATEGORIES = {
  executive: {
    label: 'エグゼクティブ向け',
    description: '経営層の意思決定を支援'
  },
  pm: {
    label: 'プロジェクトマネージャー向け',
    description: 'プロジェクト管理と品質保証'
  },
  consultant: {
    label: 'コンサルタント向け',
    description: '日々の業務遂行を支援'
  },
  client: {
    label: 'クライアント向け',
    description: 'プロジェクトの透明性確保'
  },
  common: {
    label: '共通機能',
    description: '全ユーザー共通の機能'
  }
}