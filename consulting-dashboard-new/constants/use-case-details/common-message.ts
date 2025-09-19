import type { DetailedStep } from '../use-case-details'

export const COMMON_MESSAGE_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'メッセージ画面を開く',
    details: {
      prerequisites: [
        'システムにログインしていること',
        'メッセージ機能へのアクセス権限があること',
        'プロジェクトメンバーとして登録されていること'
      ],
      detailedInstructions: [
        '左側メニューから「メッセージ」アイコンをクリック',
        'メッセージ画面が新しいタブまたはパネルで開く',
        '最近のメッセージ一覧が表示される',
        '未読メッセージがある場合は上部に表示'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'メッセージアイコン',
          description: '未読件数バッジ付き',
          location: 'メニューバー内'
        },
        {
          element: 'チャンネルリスト',
          description: '参加中のチャンネル一覧',
          location: '画面左側'
        },
        {
          element: 'ダイレクトメッセージ',
          description: '個人間のメッセージ',
          location: 'チャンネルリストの下'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'メッセージ検索',
          description: '過去のメッセージを検索',
          link: '/messages/search'
        },
        {
          name: '通知設定',
          description: 'メッセージ通知のカスタマイズ',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: '重要なメッセージを見逃す',
          solution: '通知設定を適切に設定し、定期的にチェック'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Shift + M',
          action: 'メッセージを開く',
          description: 'どの画面からでもメッセージへ'
        }
      ],
      nextActions: [
        {
          action: 'チャンネル/相手の選択',
          description: 'メッセージを送る対象を選ぶ',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'チャンネル・相手を選択',
    details: {
      prerequisites: [
        'メッセージ画面が開いていること',
        '送信したい相手/チャンネルが明確'
      ],
      detailedInstructions: [
        'プロジェクトチャンネルまたは個人を選択',
        'チャンネルの場合は一覧から該当チャンネルをクリック',
        '個人の場合は「ダイレクトメッセージ」から相手を検索',
        '新規メッセージの場合は「+」ボタンで作成',
        'グループメッセージを作成する場合は複数人を選択',
        '選択後、メッセージ履歴が表示される'
      ],
      fieldDescriptions: [
        {
          name: '検索',
          description: 'ユーザーやチャンネルを検索',
          format: '部分一致',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'チャンネル一覧',
          description: '参加可能なチャンネル',
          location: '左サイドバー上部'
        },
        {
          element: 'メンバー検索',
          description: 'ユーザー検索フィールド',
          location: 'ダイレクトメッセージセクション'
        },
        {
          element: 'お気に入り',
          description: 'よく使うチャンネル/相手',
          location: 'リスト最上部'
        },
        {
          element: 'オンライン状態',
          description: 'ユーザーの状態表示',
          location: 'ユーザー名の横'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'チャンネル管理',
          description: 'チャンネルの作成/参加/退出',
          link: '/channels/manage'
        }
      ],
      commonMistakes: [
        {
          issue: '間違ったチャンネルに投稿',
          solution: '送信前に宛先を必ず確認'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + K',
          action: 'クイック検索',
          description: 'チャンネルや人を素早く検索'
        }
      ],
      nextActions: [
        {
          action: 'メッセージ入力',
          description: '送信内容を作成',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '複数のプロジェクトメンバーに一斉連絡したい場合',
          method: '@メンション機能を使用',
          steps: [
            'プロジェクトチャンネルを選択',
            '@allまたは@hereを使用',
            'または個別に@ユーザー名でメンション',
            '重要度に応じて使い分け'
          ],
          pros: ['確実に通知が届く', '返信率が高い'],
          cons: ['頻繁な使用は避ける', '通知疲れの原因']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'メッセージの送信',
    details: {
      prerequisites: [
        '送信先が選択されていること',
        'メッセージ内容が明確'
      ],
      detailedInstructions: [
        'メッセージ入力欄にカーソルを置く',
        'メッセージを入力（マークダウン対応）',
        '必要に応じて書式設定（太字、リスト等）',
        '@メンションで特定の人に通知',
        '絵文字でリアクションを追加',
        'コードブロックでコードを共有',
        'プレビューで表示を確認',
        'Enterキーまたは送信ボタンで送信'
      ],
      fieldDescriptions: [
        {
          name: 'メッセージ',
          description: '送信する内容',
          format: 'テキスト/マークダウン',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'メッセージ入力欄',
          description: 'テキスト入力エリア',
          location: '画面下部'
        },
        {
          element: '書式設定ツール',
          description: 'テキスト装飾ボタン',
          location: '入力欄上部'
        },
        {
          element: '絵文字ピッカー',
          description: '絵文字選択パネル',
          location: '入力欄右側'
        },
        {
          element: '送信ボタン',
          description: 'メッセージ送信',
          location: '入力欄右端'
        }
      ],
      validationRules: [
        {
          field: 'メッセージ長',
          rule: '10000文字以内',
          errorMessage: 'メッセージが長すぎます'
        }
      ],
      relatedFeatures: [
        {
          name: 'メッセージ編集',
          description: '送信後の編集機能',
          link: '/messages/edit'
        },
        {
          name: 'スレッド返信',
          description: '特定メッセージへの返信',
          link: '/messages/thread'
        }
      ],
      commonMistakes: [
        {
          issue: 'Enter送信の誤操作',
          solution: 'Shift+Enterで改行、設定で送信方法を変更可能'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: '送信',
          description: 'メッセージを送信'
        },
        {
          keys: 'Ctrl + B',
          action: '太字',
          description: '選択テキストを太字に'
        }
      ],
      nextActions: [
        {
          action: 'メッセージ送信完了',
          description: '相手に通知される',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '通知の確認',
    details: {
      prerequisites: [
        '通知を受信していること',
        '通知設定が有効'
      ],
      detailedInstructions: [
        '新着通知アイコンの数字を確認',
        '通知をクリックして詳細表示',
        'メンション通知は優先的に確認',
        '通知の種類を識別（メッセージ/ファイル/リアクション）',
        '該当メッセージにジャンプ',
        '必要に応じて返信や対応',
        '確認済みの通知は既読にする'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '通知バッジ',
          description: '未読数を表示',
          location: 'メッセージアイコン上'
        },
        {
          element: '通知パネル',
          description: '通知一覧',
          location: 'アイコンクリックで表示'
        },
        {
          element: '通知タイプ',
          description: 'アイコンで種類を区別',
          location: '各通知の左側'
        },
        {
          element: '既読管理',
          description: '一括既読ボタン',
          location: 'パネル上部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '通知フィルター',
          description: '重要な通知のみ表示',
          link: '/notifications/filter'
        },
        {
          name: 'デスクトップ通知',
          description: 'ブラウザ通知の設定',
          link: '/settings/desktop-notifications'
        }
      ],
      commonMistakes: [
        {
          issue: '通知の見逃し',
          solution: '定期的に通知パネルを確認、重要な通知は音を有効に'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Shift + E',
          action: '全て既読',
          description: '全通知を既読にする'
        }
      ],
      nextActions: [
        {
          action: '返信または対応',
          description: '必要なアクションを実行',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'ファイルの共有',
    details: {
      prerequisites: [
        'チャンネルまたは相手を選択済み',
        '共有するファイルを準備済み'
      ],
      detailedInstructions: [
        'メッセージ入力欄の添付アイコンをクリック',
        'ファイルを選択またはドラッグ&ドロップ',
        '複数ファイルの同時アップロード可能',
        'アップロード進捗を確認',
        'ファイルの説明を追加（任意）',
        'プレビューで確認',
        '共有範囲を確認（チャンネル全体/特定メンバー）',
        'メッセージと一緒に送信'
      ],
      fieldDescriptions: [
        {
          name: 'ファイル',
          description: '共有するファイル',
          format: '最大100MB',
          required: true
        },
        {
          name: '説明',
          description: 'ファイルの説明文',
          format: 'テキスト',
          required: false
        }
      ],
      uiElements: [
        {
          element: '添付ボタン',
          description: 'ファイル選択ダイアログ',
          location: 'メッセージ入力欄左側'
        },
        {
          element: 'ドロップゾーン',
          description: 'ファイルドラッグエリア',
          location: 'メッセージ画面全体'
        },
        {
          element: 'アップロード進捗',
          description: '進行状況バー',
          location: '入力欄上部'
        },
        {
          element: 'ファイルプレビュー',
          description: '共有前の確認',
          location: 'メッセージ内'
        }
      ],
      validationRules: [
        {
          field: 'ファイルサイズ',
          rule: '100MB以下',
          errorMessage: 'ファイルが大きすぎます'
        },
        {
          field: 'ファイル形式',
          rule: '実行ファイル不可',
          errorMessage: 'このファイル形式は共有できません'
        }
      ],
      relatedFeatures: [
        {
          name: 'ファイル管理',
          description: '共有ファイルの一覧',
          link: '/files/shared'
        },
        {
          name: '外部共有',
          description: 'リンクでの共有機能',
          link: '/files/external-share'
        }
      ],
      commonMistakes: [
        {
          issue: '機密ファイルの誤共有',
          solution: '送信前に共有範囲と内容を必ず確認'
        }
      ],
      shortcuts: [
        {
          action: 'ドラッグ&ドロップ',
          description: 'ファイルを直接ドロップ',
          keys: 'マウス操作'
        }
      ],
      nextActions: [
        {
          action: 'ファイル共有完了',
          description: 'メンバーがダウンロード可能に',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '大容量ファイルを共有したい場合',
          method: '外部ストレージ連携',
          steps: [
            'クラウドストレージにアップロード',
            '共有リンクを生成',
            'リンクをメッセージで共有',
            'アクセス権限を適切に設定'
          ],
          pros: ['大容量対応', 'バージョン管理可能'],
          cons: ['外部サービス依存', '追加の権限管理']
        }
      ]
    }
  }
]