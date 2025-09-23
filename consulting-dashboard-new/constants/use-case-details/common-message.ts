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
        '未読メッセージがある場合は上部に表示',
        '未読メンション数が赤いバッジで表示される'
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
    basicDescription: 'チャンネルまたは相手を選択',
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
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'テキストメッセージを入力して送信',
    details: {
      prerequisites: [
        '送信先が選択されていること',
        'メッセージ内容が明確'
      ],
      detailedInstructions: [
        'メッセージ入力欄にカーソルを置く',
        'メッセージを入力（マークダウン対応）',
        '必要に応じて書式設定（太字、リスト等）',
        'Enterキーまたは送信ボタンで送信',
        'Shift+Enterで改行'
      ],
      fieldDescriptions: [
        {
          name: 'メッセージ',
          description: '送信する内容',
          format: 'テキスト/マークダウン',
          required: true,
          example: 'プロジェクトの進捗について報告します。'
        }
      ],
      uiElements: [
        {
          element: 'メッセージ入力欄',
          description: 'テキスト入力エリア（プレースホルダー: メッセージを入力... (@でメンション)）',
          location: '画面下部'
        },
        {
          element: '送信ボタン',
          description: '青い丸形の送信ボタン',
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
          keys: 'Enter',
          action: '送信',
          description: 'メッセージを送信'
        },
        {
          keys: 'Shift + Enter',
          action: '改行',
          description: 'メッセージ内で改行'
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
    basicDescription: '絵文字ボタンで絵文字を追加',
    details: {
      prerequisites: [
        'メッセージ入力欄が表示されていること',
        '絵文字を使いたい位置にカーソルがあること'
      ],
      detailedInstructions: [
        'メッセージ入力欄右側の絵文字ボタン（😊）をクリック',
        '絵文字ピッカーが表示される',
        '12個のよく使う絵文字から選択',
        '絵文字をクリックすると入力欄に追加される',
        '絵文字ピッカーは自動的に閉じる',
        '続けて文字入力も可能'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '絵文字ボタン',
          description: 'スマイルアイコン',
          location: 'メッセージ入力欄内右側'
        },
        {
          element: '絵文字ピッカー',
          description: '12個の絵文字グリッド',
          location: '入力欄上部にポップアップ'
        },
        {
          element: '絵文字一覧',
          description: '😊👍❤️🎉😂🙏👏🔥✨💪🚀💯',
          location: 'ピッカー内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'リアクション機能',
          description: '既存メッセージへの絵文字リアクション',
          link: '/messages/reactions'
        }
      ],
      commonMistakes: [
        {
          issue: '絵文字の過度な使用',
          solution: 'ビジネスコミュニケーションでは適度に使用'
        }
      ],
      shortcuts: [
        {
          keys: 'Win + . (Windows) / Cmd + Ctrl + Space (Mac)',
          action: 'OS絵文字パネル',
          description: 'システムの絵文字入力を使用'
        }
      ],
      nextActions: [
        {
          action: 'メッセージ送信',
          description: '絵文字を含めて送信',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'より多くの絵文字を使いたい場合',
          method: 'OSの絵文字パネルを使用',
          steps: [
            'Windowsの場合: Win + . キー',
            'Macの場合: Cmd + Ctrl + Space キー',
            'システムの絵文字パネルから選択',
            'メッセージ入力欄に直接入力される'
          ],
          pros: ['豊富な絵文字選択肢', '最新の絵文字にも対応'],
          cons: ['OS依存の機能', '表示が異なる場合がある']
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '@でメンバーをメンション',
    details: {
      prerequisites: [
        'メッセージ入力欄にフォーカスがあること',
        'メンションしたいユーザーを把握していること'
      ],
      detailedInstructions: [
        'メッセージ入力中に「@」を入力',
        'ユーザーリストが自動的に表示される',
        '名前またはメールアドレスの一部を入力して絞り込み',
        '矢印キー（↑↓）でリスト内を移動',
        'Enterキーまたはクリックでユーザーを選択',
        '「@[名前]」形式でメッセージに挿入される',
        'Escapeキーでメンションリストを閉じる'
      ],
      fieldDescriptions: [
        {
          name: 'メンション',
          description: 'ユーザーへの通知付きメッセージ',
          format: '@[ユーザー名]',
          required: false,
          example: '@[山田 太郎] プロジェクトについて相談があります'
        }
      ],
      uiElements: [
        {
          element: 'メンションリスト',
          description: 'ユーザー候補のドロップダウン',
          location: 'メッセージ入力欄上部'
        },
        {
          element: 'ユーザーアバター',
          description: 'ユーザーの頭文字アイコン',
          location: 'リスト内各項目左側'
        },
        {
          element: 'ユーザー情報',
          description: '名前とメールアドレス',
          location: 'リスト内各項目'
        },
        {
          element: '選択インジケーター',
          description: '選択中の項目のハイライト',
          location: '現在選択中の項目'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'メンション通知',
          description: 'メンションされた時の特別な通知',
          link: '/notifications/mentions'
        },
        {
          name: '@all / @here',
          description: 'チャンネル全員への通知',
          link: '/messages/broadcast'
        }
      ],
      commonMistakes: [
        {
          issue: '誤った相手をメンション',
          solution: '同姓同名に注意、メールアドレスで確認'
        },
        {
          issue: '@allの濫用',
          solution: '本当に全員に通知が必要な場合のみ使用'
        }
      ],
      shortcuts: [
        {
          keys: '@',
          action: 'メンションリスト表示',
          description: 'ユーザー選択画面を開く'
        },
        {
          keys: '↑↓',
          action: 'リスト内移動',
          description: 'ユーザーリスト内を移動'
        },
        {
          keys: 'Enter',
          action: '選択',
          description: '選択中のユーザーを確定'
        },
        {
          keys: 'Escape',
          action: 'キャンセル',
          description: 'メンションリストを閉じる'
        }
      ],
      nextActions: [
        {
          action: 'メッセージ送信',
          description: 'メンション付きメッセージが送信される',
          automatic: false
        },
        {
          action: 'メンション通知',
          description: '対象ユーザーに通知が送られる',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'チーム全員に通知したい場合',
          method: '@all または @here を使用',
          steps: [
            'メッセージ入力欄で @all または @here と入力',
            '@all: オフラインメンバーを含む全員',
            '@here: 現在オンラインのメンバーのみ',
            '重要度に応じて使い分け'
          ],
          pros: ['一度に全員に通知', '重要な連絡に効果的'],
          cons: ['通知疲れの原因', '頻繁な使用は避けるべき']
        }
      ]
    }
  },
  {
    stepNumber: 6,
    basicDescription: 'ペーパークリップボタンでファイルを共有',
    details: {
      prerequisites: [
        'チャンネルまたは相手を選択済み',
        '共有するファイルを準備済み',
        'ファイルサイズが10MB以下'
      ],
      detailedInstructions: [
        'メッセージ入力欄左側のペーパークリップボタン（📎）をクリック',
        'ファイル選択ダイアログが開く',
        'ファイルを選択（複数選択も可能）',
        '選択したファイルのプレビューが表示される',
        'ファイル名とサイズが表示される',
        '削除したい場合は×ボタンをクリック',
        'アップロード進捗バーが表示される',
        '送信ボタンでファイルを共有'
      ],
      fieldDescriptions: [
        {
          name: 'ファイル',
          description: '共有するファイル',
          format: 'PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF, TXT, ZIP',
          required: true,
          example: 'project-report.pdf'
        },
        {
          name: 'ファイルサイズ',
          description: '最大ファイルサイズ',
          format: '10MB以下',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'ペーパークリップボタン',
          description: 'ファイル選択アイコン',
          location: 'メッセージ入力欄左側'
        },
        {
          element: 'ファイルプレビュー',
          description: '選択したファイルの情報',
          location: '入力欄上部'
        },
        {
          element: 'ファイルアイコン',
          description: 'ファイルタイプ別のアイコン',
          location: 'プレビュー左側'
        },
        {
          element: '削除ボタン',
          description: '×マークのボタン',
          location: 'プレビュー右側'
        },
        {
          element: 'アップロード進捗',
          description: '進行状況バー',
          location: 'ファイルプレビュー下部'
        }
      ],
      validationRules: [
        {
          field: 'ファイルサイズ',
          rule: '10MB以下',
          errorMessage: 'ファイルサイズが大きすぎます（10MB以下にしてください）'
        },
        {
          field: 'ファイル形式',
          rule: '許可された形式のみ',
          errorMessage: 'サポートされていないファイル形式です'
        }
      ],
      relatedFeatures: [
        {
          name: 'ファイル管理',
          description: '共有ファイルの一覧',
          link: '/files/shared'
        },
        {
          name: 'ファイルプレビュー',
          description: '画像やPDFのプレビュー',
          link: '/files/preview'
        }
      ],
      commonMistakes: [
        {
          issue: '大きなファイルのアップロード失敗',
          solution: 'ファイルサイズを確認し、必要に応じて圧縮'
        },
        {
          issue: '機密ファイルの誤共有',
          solution: '送信前に共有範囲と内容を必ず確認'
        }
      ],
      shortcuts: [
        {
          action: 'ドラッグ&ドロップ',
          description: 'ファイルを直接メッセージエリアにドロップ',
          keys: 'マウス操作'
        },
        {
          keys: 'Ctrl + V',
          action: 'ペースト',
          description: 'クリップボードから画像を貼り付け'
        }
      ],
      nextActions: [
        {
          action: 'ファイル送信',
          description: 'ファイルがアップロードされメッセージとして送信',
          automatic: false
        },
        {
          action: 'ダウンロード可能',
          description: 'メンバーがファイルをダウンロード可能に',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '10MBを超える大容量ファイルを共有したい場合',
          method: '外部ストレージサービスのリンクを共有',
          steps: [
            'Google Drive, Dropbox等にファイルをアップロード',
            '共有リンクを生成',
            'リンクをメッセージとして送信',
            'アクセス権限を適切に設定'
          ],
          pros: ['大容量ファイル対応', 'バージョン管理可能'],
          cons: ['外部サービスが必要', '追加の権限管理が必要']
        }
      ]
    }
  },
  {
    stepNumber: 7,
    basicDescription: 'メッセージにリアクションを追加',
    details: {
      prerequisites: [
        'メッセージが表示されていること',
        'リアクションを追加したいメッセージが明確'
      ],
      detailedInstructions: [
        'リアクションを追加したいメッセージにマウスをホバー',
        'メッセージ下部に「+」ボタンが表示される',
        '既存のリアクションがある場合は一緒に表示される',
        '「+」ボタンをクリックすると絵文字ピッカーが開く',
        '6個のよく使う絵文字から選択（👍❤️😊🎉👏😮）',
        '絵文字をクリックするとリアクションが追加される',
        '同じ絵文字を再度クリックで削除（トグル動作）',
        '複数の絵文字でリアクション可能',
        'リアクション数は絵文字の横に表示される'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'リアクション追加ボタン',
          description: '「+」マークのボタン',
          location: 'メッセージホバー時に表示'
        },
        {
          element: '絵文字ピッカー',
          description: '6個の絵文字選択パネル',
          location: 'ボタンクリック時にポップアップ'
        },
        {
          element: 'リアクション表示',
          description: '絵文字と数字のバッジ',
          location: 'メッセージ下部'
        },
        {
          element: 'リアクションカウント',
          description: '同じ絵文字の使用数',
          location: '絵文字の右側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '絵文字入力',
          description: 'メッセージ内で絵文字を使用',
          link: '/messages/emoji'
        },
        {
          name: 'リアクション通知',
          description: 'リアクションを受けた時の通知',
          link: '/notifications/reactions'
        }
      ],
      commonMistakes: [
        {
          issue: '誤ったリアクションの追加',
          solution: '同じ絵文字をクリックして削除'
        },
        {
          issue: 'リアクションボタンが見えない',
          solution: 'メッセージにマウスをホバーする'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'リアクション追加完了',
          description: '絵文字がメッセージに表示される',
          automatic: true
        },
        {
          action: '送信者への通知',
          description: 'メッセージ送信者に通知される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'より多くの絵文字を使いたい場合',
          method: '将来のアップデートで対応予定',
          steps: [
            '現在は6個の基本絵文字のみ',
            '今後、絵文字検索機能を追加予定',
            'カスタム絵文字機能も検討中'
          ],
          pros: ['シンプルで使いやすい', '素早いリアクション'],
          cons: ['選択肢が限定的', 'カスタマイズ不可']
        }
      ]
    }
  },
  {
    stepNumber: 8,
    basicDescription: 'スレッドで返信する',
    details: {
      prerequisites: [
        'メッセージが表示されていること',
        '返信したいメッセージが明確'
      ],
      detailedInstructions: [
        '返信したいメッセージにマウスをホバー',
        'メッセージ下部の「返信する」リンクが表示される',
        '既にスレッドがある場合は「○件の返信」と表示',
        'リンクをクリックすると右側にスレッドパネルが開く',
        'スレッドパネル上部に元のメッセージが表示される',
        '下部の入力欄に返信を入力',
        'Enterキーまたは送信ボタンで送信',
        'スレッド内でも@メンションが可能',
        'パネル右上の×ボタンでスレッドを閉じる'
      ],
      fieldDescriptions: [
        {
          name: '返信内容',
          description: 'スレッドへの返信メッセージ',
          format: 'テキスト',
          required: true,
          example: 'その件について詳しく説明します。'
        }
      ],
      uiElements: [
        {
          element: 'スレッドリンク',
          description: '「返信する」または「○件の返信」',
          location: 'メッセージ下部'
        },
        {
          element: 'スレッドパネル',
          description: '右側に開くパネル',
          location: '画面右側（幅396px）'
        },
        {
          element: '元メッセージ',
          description: '返信元のメッセージ',
          location: 'スレッドパネル上部'
        },
        {
          element: 'スレッド返信一覧',
          description: 'スレッド内の返信',
          location: 'パネル中央部'
        },
        {
          element: '返信入力欄',
          description: '返信を入力するエリア',
          location: 'パネル下部'
        },
        {
          element: '閉じるボタン',
          description: '×マーク',
          location: 'パネル右上'
        }
      ],
      validationRules: [
        {
          field: '返信長さ',
          rule: '10000文字以内',
          errorMessage: '返信が長すぎます'
        }
      ],
      relatedFeatures: [
        {
          name: 'スレッド一覧',
          description: 'アクティブなスレッドの表示',
          link: '/messages/threads'
        },
        {
          name: 'スレッド通知',
          description: 'スレッドへの返信通知',
          link: '/notifications/threads'
        }
      ],
      commonMistakes: [
        {
          issue: '新規メッセージとスレッド返信の混同',
          solution: 'スレッドパネル内で返信することを確認'
        },
        {
          issue: 'スレッドの見逃し',
          solution: '返信数を定期的にチェック'
        }
      ],
      shortcuts: [
        {
          keys: 'T',
          action: 'スレッド開く',
          description: 'メッセージ選択中にTキー'
        },
        {
          keys: 'Escape',
          action: 'スレッド閉じる',
          description: 'スレッドパネルを閉じる'
        }
      ],
      nextActions: [
        {
          action: 'スレッド返信送信',
          description: 'スレッドに返信が追加される',
          automatic: false
        },
        {
          action: '参加者への通知',
          description: 'スレッド参加者に通知',
          automatic: true
        },
        {
          action: '返信数の更新',
          description: 'メッセージの返信数が増える',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '複数人での議論を整理したい場合',
          method: 'スレッドを活用した話題の分離',
          steps: [
            '主要なメッセージごとにスレッドを作成',
            '関連する議論はスレッド内で展開',
            'メインチャンネルをクリーンに保つ',
            '決定事項はメインチャンネルに要約を投稿'
          ],
          pros: ['話題が整理される', '後から追いやすい', 'ノイズが減る'],
          cons: ['スレッドの確認が必要', '見逃しの可能性']
        }
      ]
    }
  },
  {
    stepNumber: 9,
    basicDescription: '通知・メンションの確認',
    details: {
      prerequisites: [
        '通知を受信していること',
        '通知設定が有効'
      ],
      detailedInstructions: [
        'サイドバーのメッセージアイコンでバッジを確認',
        '赤いバッジ: 未読メンション数',
        '青いバッジ: 新着メッセージ数',
        'メッセージ画面を開いて詳細を確認',
        'メンションされたメッセージは優先表示',
        '該当メッセージにジャンプして内容確認',
        '必要に応じて返信や対応',
        '確認済みの通知は自動的に既読になる'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'メンションバッジ',
          description: '赤い丸形の数字バッジ',
          location: 'メッセージアイコン右上'
        },
        {
          element: '新着バッジ',
          description: '青い丸形の数字バッジ',
          location: 'メッセージアイコン右上'
        },
        {
          element: 'メンションハイライト',
          description: 'メンションメッセージの強調表示',
          location: 'メッセージリスト内'
        },
        {
          element: '未読インジケーター',
          description: '未読メッセージの青い線',
          location: 'メッセージリスト左側'
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
        },
        {
          name: 'サマリー通知',
          description: '定期的な未読まとめ',
          link: '/notifications/summary'
        }
      ],
      commonMistakes: [
        {
          issue: 'メンションの見逃し',
          solution: '赤いバッジを定期的にチェック、通知音を有効に'
        },
        {
          issue: '通知過多による疲れ',
          solution: '通知設定で重要度を調整、時間帯設定を活用'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Shift + E',
          action: '全て既読',
          description: '全通知を既読にする'
        },
        {
          keys: 'Alt + Shift + M',
          action: 'メンションのみ表示',
          description: 'メンションフィルター'
        }
      ],
      nextActions: [
        {
          action: '返信または対応',
          description: '必要なアクションを実行',
          automatic: false
        },
        {
          action: '既読マーク',
          description: 'メッセージが既読になる',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '通知を一時的に停止したい場合',
          method: 'Do Not Disturb（おやすみモード）を設定',
          steps: [
            'プロフィール設定を開く',
            '通知設定から「おやすみモード」を選択',
            '時間帯を設定（例: 19:00-9:00）',
            '緊急メンションのみ通知する設定も可能'
          ],
          pros: ['集中時間の確保', 'プライベート時間の確保'],
          cons: ['重要な連絡を見逃す可能性', '定期的な確認が必要']
        }
      ]
    }
  }
]