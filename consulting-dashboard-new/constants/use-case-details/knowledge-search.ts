import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_SEARCH_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'ナレッジ検索画面を開く',
    details: {
      prerequisites: [
        'システムにログインしていること',
        '検索したい情報やキーワードが明確'
      ],
      detailedInstructions: [
        '左側メニューから「ナレッジ検索」をクリック',
        'または画面上部の検索バーを使用',
        '検索画面が表示される',
        '最近の人気記事が表示される'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '検索バー',
          description: 'キーワード入力エリア',
          location: '画面上部中央'
        },
        {
          element: '詳細検索リンク',
          description: '高度な検索オプション',
          location: '検索バー右側'
        },
        {
          element: '人気記事',
          description: '閲覧数の多い記事',
          location: 'メイン画面'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '検索履歴',
          description: '過去の検索を再利用',
          link: '/search/history'
        },
        {
          name: 'お気に入り',
          description: 'ブックマークした記事',
          link: '/bookmarks'
        }
      ],
      commonMistakes: [
        {
          issue: '曖昧なキーワードで検索',
          solution: '具体的な用語や技術名を使用'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + /',
          action: '検索フォーカス',
          description: '検索バーにフォーカス'
        }
      ],
      nextActions: [
        {
          action: '検索条件の入力',
          description: 'キーワードやフィルター設定',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'キーワード・カテゴリで検索',
    details: {
      prerequisites: [
        '検索したい内容が明確になっていること'
      ],
      detailedInstructions: [
        '検索バーにキーワードを入力',
        '入力中にサジェストが表示される',
        'カテゴリフィルターを選択（任意）',
        '作成者でフィルタリング（任意）',
        '日付範囲を指定（任意）',
        '難易度レベルを選択（任意）',
        '検索ボタンをクリックまたはEnterキー'
      ],
      fieldDescriptions: [
        {
          name: '検索キーワード',
          description: '探したい情報のキーワード',
          format: 'テキスト',
          required: false,
          example: 'アジャイル スプリント計画'
        },
        {
          name: 'カテゴリ',
          description: '記事の分類',
          format: '複数選択可',
          required: false
        },
        {
          name: '期間',
          description: '作成/更新日の範囲',
          format: '日付範囲',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'サジェストドロップダウン',
          description: '入力補完候補',
          location: '検索バー下'
        },
        {
          element: 'フィルターパネル',
          description: '詳細な絞り込み条件',
          location: '左サイドバー'
        },
        {
          element: '検索オプション',
          description: 'AND/OR検索の切替',
          location: '検索バー内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '保存された検索',
          description: 'よく使う検索条件の保存',
          link: '/search/saved'
        }
      ],
      commonMistakes: [
        {
          issue: 'フィルターをかけすぎて結果0件',
          solution: '段階的に条件を追加'
        }
      ],
      shortcuts: [
        {
          keys: 'Tab',
          action: 'サジェスト選択',
          description: 'サジェスト候補の選択'
        }
      ],
      nextActions: [
        {
          action: '検索実行',
          description: '結果が表示される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '自然言語での検索',
          method: 'AI検索モードを使用',
          steps: [
            '「AI検索」タブをクリック',
            '質問を自然な文章で入力',
            '例：「プロジェクトの初期段階で気を付けることは？」',
            'AIが関連記事を抽出'
          ],
          pros: ['直感的', '関連性の高い結果'],
          cons: ['処理時間がやや長い']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '検索結果の確認',
    details: {
      prerequisites: [
        '検索を実行していること'
      ],
      detailedInstructions: [
        '検索結果の件数を確認',
        '各記事のタイトル、要約、作者を確認',
        '関連度スコアで並び替え',
        '作成日や更新日でソート可能',
        '人気度（閲覧数）でもソート可能',
        'プレビュー表示で概要を確認',
        '気になる記事をクリック'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '検索結果リスト',
          description: '記事の一覧表示',
          location: 'メインエリア'
        },
        {
          element: '並び替えメニュー',
          description: 'ソート条件の選択',
          location: '結果上部'
        },
        {
          element: '関連度バー',
          description: '検索との一致度',
          location: '各記事の横'
        },
        {
          element: 'プレビューボタン',
          description: '簡易表示',
          location: '各記事の右端'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '類似記事',
          description: '関連する他の記事',
          link: '/similar'
        }
      ],
      commonMistakes: [
        {
          issue: '最初の結果だけ見て判断',
          solution: '複数の記事を比較検討'
        }
      ],
      shortcuts: [
        {
          keys: '1-9',
          action: '記事選択',
          description: '番号キーで記事を開く'
        }
      ],
      nextActions: [
        {
          action: '記事の選択',
          description: '詳細を確認したい記事を選ぶ',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '記事の詳細閲覧',
    details: {
      prerequisites: [
        '閲覧したい記事を選択済み'
      ],
      detailedInstructions: [
        '記事の全文が表示される',
        '目次から必要な箇所へジャンプ',
        'コードブロックはコピー可能',
        '画像はクリックで拡大表示',
        '関連リンクから他記事へ移動可能',
        '作成者プロフィールを確認',
        '更新履歴で変更内容を確認',
        'コメント欄で質問や議論'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '目次サイドバー',
          description: '記事構成の一覧',
          location: '左側固定'
        },
        {
          element: '記事本文',
          description: 'マークダウン形式の内容',
          location: '中央メインエリア'
        },
        {
          element: 'アクションバー',
          description: 'いいね、ブックマーク等',
          location: '記事下部'
        },
        {
          element: '関連記事',
          description: '類似トピックの記事',
          location: '右サイドバー'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'PDF出力',
          description: '記事をPDFで保存',
          link: '/export/pdf'
        },
        {
          name: '印刷プレビュー',
          description: '印刷用レイアウト',
          link: '/print'
        }
      ],
      commonMistakes: [
        {
          issue: '古い情報を鵜呑みにする',
          solution: '更新日時と履歴を確認'
        }
      ],
      shortcuts: [
        {
          keys: 'J/K',
          action: 'スクロール',
          description: '上下にスクロール'
        },
        {
          keys: 'G',
          action: '目次表示',
          description: '目次パネルを開く'
        }
      ],
      nextActions: [
        {
          action: 'フィードバックの提供',
          description: 'いいねやコメント',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'ブックマーク・いいねの追加',
    details: {
      prerequisites: [
        '記事を読み終えていること',
        '今後も参照したい記事である'
      ],
      detailedInstructions: [
        'ブックマークアイコンをクリック',
        'ブックマークフォルダを選択（任意）',
        '個人メモを追加（任意）',
        'いいねボタンで評価',
        'SNS共有ボタンでチーム共有',
        'URLをコピーして直接共有も可能',
        'コメントで感想や質問を投稿',
        '作者をフォローして新着記事を追跡'
      ],
      fieldDescriptions: [
        {
          name: 'ブックマークメモ',
          description: '後で見返す時のメモ',
          format: 'テキスト',
          required: false,
          example: 'プロジェクトXで活用予定'
        }
      ],
      uiElements: [
        {
          element: 'ブックマークボタン',
          description: '保存状態のトグル',
          location: '記事タイトル下'
        },
        {
          element: 'いいねボタン',
          description: 'ハート型のアイコン',
          location: 'ブックマークの隣'
        },
        {
          element: '共有メニュー',
          description: 'シェアオプション',
          location: 'アクションバー内'
        },
        {
          element: 'フォローボタン',
          description: '作者のフォロー',
          location: '作者情報欄'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'マイブックマーク',
          description: '保存記事の管理',
          link: '/my/bookmarks'
        },
        {
          name: 'フォロー管理',
          description: 'フォロー中の作者',
          link: '/my/following'
        }
      ],
      commonMistakes: [
        {
          issue: 'ブックマークの整理をしない',
          solution: 'フォルダ機能で分類管理'
        }
      ],
      shortcuts: [
        {
          keys: 'B',
          action: 'ブックマーク',
          description: 'ブックマークの追加/削除'
        },
        {
          keys: 'L',
          action: 'いいね',
          description: 'いいねの追加/削除'
        }
      ],
      nextActions: [
        {
          action: '次の検索',
          description: '他の情報も探す',
          automatic: false
        },
        {
          action: '学習記録',
          description: '読んだ記事が記録される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'オフラインで読みたい場合',
          method: 'ダウンロード機能を使用',
          steps: [
            '記事メニューから「ダウンロード」選択',
            '形式を選択（PDF/Markdown/HTML）',
            'ローカルに保存',
            'オフラインで閲覧'
          ],
          pros: ['ネットワーク不要', '編集可能'],
          cons: ['最新版との差異が生じる可能性']
        }
      ]
    }
  }
]