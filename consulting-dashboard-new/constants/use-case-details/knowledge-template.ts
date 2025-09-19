import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_TEMPLATE_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'テンプレート一覧にアクセス',
    details: {
      prerequisites: [
        'システムにログインしていること',
        'テンプレートの利用目的が明確'
      ],
      detailedInstructions: [
        'ナレッジ管理から「テンプレート」を選択',
        'テンプレート一覧が表示される',
        'カテゴリ別にテンプレートが整理されている',
        '最近使用したテンプレートが上部に表示'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'テンプレートギャラリー',
          description: 'テンプレート一覧表示',
          location: 'メインエリア'
        },
        {
          element: 'カテゴリフィルター',
          description: 'テンプレートの分類',
          location: '左サイドバー'
        },
        {
          element: '検索バー',
          description: 'テンプレート検索',
          location: '画面上部'
        },
        {
          element: '新規登録ボタン',
          description: 'テンプレート追加',
          location: '画面右上'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'お気に入りテンプレート',
          description: 'よく使うテンプレート',
          link: '/templates/favorites'
        }
      ],
      commonMistakes: [
        {
          issue: '目的に合わないテンプレート選択',
          solution: '用途説明をよく読んで選択'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'テンプレートの検索・選択',
          description: '目的のテンプレートを探す',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'テンプレートの選択・ダウンロード',
    details: {
      prerequisites: [
        'テンプレート一覧を表示していること',
        '必要なテンプレートの種類が明確'
      ],
      detailedInstructions: [
        'カテゴリまたは検索でテンプレートを探す',
        'テンプレートカードをクリックして詳細表示',
        'テンプレートの説明と使用例を確認',
        'プレビューで内容を確認',
        'ダウンロード形式を選択',
        'ダウンロードボタンをクリック',
        '使用回数が自動的にカウントされる'
      ],
      fieldDescriptions: [
        {
          name: 'ダウンロード形式',
          description: 'ファイルフォーマット',
          format: '選択式',
          required: true,
          example: 'Word, Excel, PowerPoint, Markdown'
        }
      ],
      uiElements: [
        {
          element: 'テンプレート詳細',
          description: '使用方法や注意点',
          location: 'モーダルウィンドウ'
        },
        {
          element: 'プレビューエリア',
          description: 'テンプレート内容確認',
          location: '詳細画面内'
        },
        {
          element: 'ダウンロードボタン',
          description: '形式選択とダウンロード',
          location: '詳細画面下部'
        },
        {
          element: '評価表示',
          description: '他ユーザーの評価',
          location: 'テンプレート情報欄'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'カスタマイズガイド',
          description: 'テンプレートの編集方法',
          link: '/templates/customize'
        }
      ],
      commonMistakes: [
        {
          issue: '古いバージョンの利用',
          solution: '更新日を確認して最新版を使用'
        }
      ],
      shortcuts: [
        {
          keys: 'D',
          action: 'ダウンロード',
          description: 'クイックダウンロード'
        }
      ],
      nextActions: [
        {
          action: 'ファイルの保存',
          description: 'ローカルに保存される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'オンラインで直接編集',
          method: 'クラウド編集機能',
          steps: [
            '「オンライン編集」ボタンをクリック',
            'ブラウザ上でテンプレートが開く',
            '必要箇所を編集',
            'クラウドに保存またはダウンロード'
          ],
          pros: ['ソフト不要', '自動保存'],
          cons: ['機能制限あり']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '新規テンプレートの登録',
    details: {
      prerequisites: [
        'PMまたはコンサルタントロールであること',
        '共有したいテンプレートファイルがある'
      ],
      detailedInstructions: [
        '「新規テンプレート登録」ボタンをクリック',
        'テンプレートの基本情報を入力',
        'テンプレート名を分かりやすく記載',
        '用途や使用シーンを詳しく説明',
        '対象者（初級/中級/上級）を選択',
        'カテゴリを選択',
        'ファイルをアップロード',
        'サンプル画像を追加（推奨）'
      ],
      fieldDescriptions: [
        {
          name: 'テンプレート名',
          description: 'テンプレートの名称',
          format: 'テキスト（50文字以内）',
          required: true,
          example: 'プロジェクト提案書テンプレート_2025年版'
        },
        {
          name: '説明',
          description: '用途と特徴',
          format: 'テキスト（500文字以内）',
          required: true
        },
        {
          name: 'ファイル',
          description: 'テンプレートファイル',
          format: '各種ドキュメント形式',
          required: true
        },
        {
          name: 'タイプ',
          description: 'テンプレートの種類',
          format: '選択式',
          required: true,
          example: '提案書、報告書、チェックリスト等'
        }
      ],
      uiElements: [
        {
          element: '登録フォーム',
          description: 'テンプレート情報入力',
          location: 'メインエリア'
        },
        {
          element: 'ファイルアップロード',
          description: 'ドラッグ&ドロップ対応',
          location: 'フォーム内'
        },
        {
          element: 'プレビュー生成',
          description: 'サムネイル自動作成',
          location: 'アップロード後'
        }
      ],
      validationRules: [
        {
          field: 'ファイルサイズ',
          rule: '50MB以下',
          errorMessage: 'ファイルサイズは50MB以下にしてください'
        }
      ],
      relatedFeatures: [
        {
          name: 'テンプレート変換',
          description: '形式変換ツール',
          link: '/templates/convert'
        }
      ],
      commonMistakes: [
        {
          issue: '機密情報を含んだまま登録',
          solution: 'サンプルデータに置き換えて登録'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'レビュー・承認',
          description: '管理者による確認',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'テンプレートの編集・更新',
    details: {
      prerequisites: [
        'テンプレートの作成者または管理者であること',
        '更新内容が明確'
      ],
      detailedInstructions: [
        '自分が登録したテンプレート一覧を表示',
        '編集したいテンプレートの「編集」ボタンをクリック',
        '変更内容を説明欄に記載',
        'ファイルを差し替える場合は新規アップロード',
        'バージョン番号を更新',
        '変更履歴にコメントを追加',
        '更新内容をプレビューで確認',
        '更新ボタンで保存'
      ],
      fieldDescriptions: [
        {
          name: '変更内容',
          description: '更新の詳細',
          format: 'テキスト',
          required: true,
          example: '2025年度の組織変更を反映'
        },
        {
          name: 'バージョン',
          description: 'テンプレートのバージョン',
          format: 'テキスト',
          required: true,
          example: 'v2.1'
        }
      ],
      uiElements: [
        {
          element: '編集モード',
          description: '情報編集画面',
          location: 'メインエリア'
        },
        {
          element: 'バージョン管理',
          description: '変更履歴の記録',
          location: '編集画面下部'
        },
        {
          element: '差分表示',
          description: '変更箇所の確認',
          location: 'プレビュー時'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'バージョン比較',
          description: '過去版との比較',
          link: '/templates/compare'
        }
      ],
      commonMistakes: [
        {
          issue: 'バージョン管理を怠る',
          solution: '更新時は必ずバージョンを上げる'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '更新完了',
          description: '利用者に通知される',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '使用履歴の確認',
    details: {
      prerequisites: [
        'テンプレートを利用または提供していること'
      ],
      detailedInstructions: [
        'テンプレート管理画面の「使用履歴」タブを選択',
        '自分が使用したテンプレート一覧を確認',
        '提供したテンプレートの利用状況を確認',
        'ダウンロード数や評価を確認',
        'フィードバックコメントを読む',
        '人気のテンプレートを分析',
        '改善点を把握',
        '次回更新の参考にする'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '使用履歴タブ',
          description: '履歴表示切替',
          location: 'テンプレート管理画面上部'
        },
        {
          element: '統計ダッシュボード',
          description: '利用状況の可視化',
          location: 'メインエリア'
        },
        {
          element: 'フィードバック一覧',
          description: 'ユーザーからの評価',
          location: '画面下部'
        },
        {
          element: 'ダウンロード履歴',
          description: '詳細なログ',
          location: 'リスト形式'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'テンプレート分析',
          description: '利用傾向の詳細分析',
          link: '/templates/analytics'
        },
        {
          name: 'レポート出力',
          description: '利用状況レポート',
          link: '/templates/report'
        }
      ],
      commonMistakes: [
        {
          issue: 'フィードバックを無視',
          solution: '改善要望は積極的に取り入れる'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'テンプレートの改善',
          description: 'フィードバックを基に更新',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '利用者と直接コミュニケーション',
          method: 'フィードバック機能',
          steps: [
            'フィードバックコメントに返信',
            '詳細な要望をヒアリング',
            '改善版を作成',
            '要望者に通知'
          ],
          pros: ['ニーズの正確な把握', '満足度向上'],
          cons: ['時間がかかる']
        }
      ]
    }
  }
]