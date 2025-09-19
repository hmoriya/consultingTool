import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_ARTICLE_CREATE_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'ナレッジ管理画面にアクセス',
    details: {
      prerequisites: [
        'コンサルタントまたはPMロールでログインしていること',
        'ナレッジ作成権限があること',
        '共有したい知見やノウハウが整理されていること'
      ],
      detailedInstructions: [
        '左側メニューから「ナレッジ管理」をクリック',
        'ナレッジダッシュボードが表示される',
        '自分が作成した記事一覧を確認',
        '右上の「新規作成」ボタンを探す'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'ナレッジ管理メニュー',
          description: '知識共有システムへの入口',
          location: 'サイドメニュー内'
        },
        {
          element: '新規作成ボタン',
          description: '新しい記事の作成を開始',
          location: '画面右上'
        },
        {
          element: '記事フィルター',
          description: 'ステータスやカテゴリで絞り込み',
          location: '画面上部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'ナレッジ検索',
          description: '既存記事の重複確認',
          link: '/knowledge/search'
        },
        {
          name: 'テンプレート',
          description: '記事テンプレートの利用',
          link: '/knowledge/templates'
        }
      ],
      commonMistakes: [
        {
          issue: '類似記事の存在を確認せずに作成',
          solution: '事前に検索して重複を避ける'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + N',
          action: '新規記事作成',
          description: 'どの画面からでも新規作成'
        }
      ],
      nextActions: [
        {
          action: '記事作成画面への遷移',
          description: 'エディタが開く',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '新規記事の作成',
    details: {
      prerequisites: [
        '記事のテーマが明確になっていること',
        '必要な資料や参考情報を準備済み'
      ],
      detailedInstructions: [
        'タイトル欄に分かりやすい題名を入力',
        '要約欄に記事の概要を記載（100文字程度）',
        'ターゲット読者（初級/中級/上級）を選択',
        '推定読了時間を設定',
        '下書きとして保存するか確認'
      ],
      fieldDescriptions: [
        {
          name: 'タイトル',
          description: '記事の題名',
          format: 'テキスト（100文字以内）',
          required: true,
          example: 'アジャイル開発におけるスプリント計画のベストプラクティス'
        },
        {
          name: '要約',
          description: '記事の概要説明',
          format: 'テキスト（200文字以内）',
          required: false,
          example: 'スプリント計画会議を効果的に運営するための実践的なティップスと注意点をまとめました'
        },
        {
          name: '難易度',
          description: '想定読者のレベル',
          format: '選択式',
          required: true,
          example: '中級'
        }
      ],
      uiElements: [
        {
          element: '記事エディタ',
          description: 'マークダウン対応エディタ',
          location: 'メイン画面中央'
        },
        {
          element: 'プレビューペイン',
          description: 'リアルタイムプレビュー',
          location: '右側パネル'
        },
        {
          element: '自動保存インジケータ',
          description: '保存状態の表示',
          location: '画面上部'
        }
      ],
      validationRules: [
        {
          field: 'タイトル',
          rule: '5文字以上100文字以内',
          errorMessage: 'タイトルは5文字以上100文字以内で入力してください'
        }
      ],
      relatedFeatures: [
        {
          name: 'マークダウンガイド',
          description: '書式設定の参考',
          link: '/help/markdown'
        }
      ],
      commonMistakes: [
        {
          issue: 'タイトルが曖昧で検索しづらい',
          solution: '具体的なキーワードを含める'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + S',
          action: '下書き保存',
          description: '作業内容を保存'
        },
        {
          keys: 'Ctrl + P',
          action: 'プレビュー切替',
          description: 'プレビュー表示のON/OFF'
        }
      ],
      nextActions: [
        {
          action: 'カテゴリとタグの設定へ',
          description: '分類情報の入力',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'カテゴリとタグの設定',
    details: {
      prerequisites: [
        '記事の内容が決まっていること',
        'カテゴリ体系を理解していること'
      ],
      detailedInstructions: [
        'メインカテゴリをドロップダウンから選択',
        'サブカテゴリがある場合は追加選択',
        'タグ入力欄に関連キーワードを入力',
        '入力したタグがサジェストされる場合は選択',
        '新規タグの場合はEnterキーで追加',
        '最大5つまでタグを設定可能',
        'プロジェクト固有のタグも追加'
      ],
      fieldDescriptions: [
        {
          name: 'カテゴリ',
          description: '記事の分類',
          format: '階層選択',
          required: true,
          example: '技術 > アジャイル開発'
        },
        {
          name: 'タグ',
          description: '検索用キーワード',
          format: 'タグ入力（最大5個）',
          required: false,
          example: 'スクラム, スプリント計画, アジャイル'
        }
      ],
      uiElements: [
        {
          element: 'カテゴリセレクタ',
          description: '階層型カテゴリ選択',
          location: '記事設定セクション'
        },
        {
          element: 'タグ入力フィールド',
          description: 'オートコンプリート付き',
          location: 'カテゴリ下部'
        },
        {
          element: '人気タグ一覧',
          description: 'よく使われるタグの表示',
          location: '右サイドバー'
        }
      ],
      validationRules: [
        {
          field: 'タグ数',
          rule: '最大5個まで',
          errorMessage: 'タグは5個までしか設定できません'
        }
      ],
      relatedFeatures: [
        {
          name: 'タグ管理',
          description: 'タグの統合や削除',
          link: '/admin/tags'
        }
      ],
      commonMistakes: [
        {
          issue: '関連性の低いタグを大量に設定',
          solution: '本当に関連する3-5個に絞る'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '本文の執筆へ',
          description: 'マークダウンエディタで記述',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'AIによる自動タグ付け',
          method: 'AI支援機能を使用',
          steps: [
            '「AIタグ提案」ボタンをクリック',
            '記事内容から自動抽出されたタグを確認',
            '適切なタグを選択して追加',
            '不要なタグは削除'
          ],
          pros: ['時間短縮', '客観的な分類'],
          cons: ['精度は100%ではない']
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '内容の執筆（マークダウン形式）',
    details: {
      prerequisites: [
        '記事の構成が決まっていること',
        'マークダウン記法の基本を理解していること'
      ],
      detailedInstructions: [
        'エディタで記事本文を記述',
        'マークダウン記法で見出し、箇条書き、コードブロックを整形',
        '画像をドラッグ&ドロップで挿入',
        'リンクは[テキスト](URL)形式で記載',
        'コードブロックには言語を指定',
        'テーブルは|で区切って作成',
        '定期的に自動保存される',
        'プレビューで表示を確認'
      ],
      fieldDescriptions: [
        {
          name: '本文',
          description: '記事のメインコンテンツ',
          format: 'マークダウン',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'マークダウンエディタ',
          description: 'シンタックスハイライト付き',
          location: 'メイン編集エリア'
        },
        {
          element: 'ツールバー',
          description: '書式設定ボタン',
          location: 'エディタ上部'
        },
        {
          element: '画像アップロード',
          description: 'ドラッグ&ドロップ対応',
          location: 'エディタ全体'
        },
        {
          element: '文字数カウンター',
          description: '記事の長さを表示',
          location: 'エディタ下部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'テンプレート挿入',
          description: 'よく使う構成の再利用',
          link: '/templates/insert'
        },
        {
          name: 'スニペット',
          description: 'コードサンプルの管理',
          link: '/snippets'
        }
      ],
      commonMistakes: [
        {
          issue: '見出しレベルの不統一',
          solution: 'H1から順序立てて使用'
        },
        {
          issue: 'コードブロックに言語指定忘れ',
          solution: '```の後に言語名を記載'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + B',
          action: '太字',
          description: '選択テキストを太字に'
        },
        {
          keys: 'Ctrl + I',
          action: '斜体',
          description: '選択テキストを斜体に'
        },
        {
          keys: 'Ctrl + K',
          action: 'リンク',
          description: 'リンクの挿入'
        }
      ],
      nextActions: [
        {
          action: 'レビュー申請へ',
          description: '公開前の確認プロセス',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'レビュー申請と公開',
    details: {
      prerequisites: [
        '記事の執筆が完了していること',
        'カテゴリとタグが適切に設定されていること',
        'プレビューで最終確認済み'
      ],
      detailedInstructions: [
        '「レビュー申請」ボタンをクリック',
        'レビュー担当者を選択（自動推薦あり）',
        'レビュー依頼メッセージを記入',
        '公開予定日時を設定（任意）',
        'レビュー結果を待つ',
        '承認後、「公開」ボタンが有効になる',
        '公開設定（即時/予約）を選択',
        '公開ボタンをクリックして完了'
      ],
      fieldDescriptions: [
        {
          name: 'レビュー担当者',
          description: '記事を確認する人',
          format: 'ユーザー選択',
          required: true,
          example: 'シニアコンサルタント'
        },
        {
          name: 'レビュー依頼メッセージ',
          description: 'レビューのポイント',
          format: 'テキスト',
          required: false,
          example: '技術的な正確性を重点的に確認お願いします'
        },
        {
          name: '公開日時',
          description: '予約公開の設定',
          format: '日時選択',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'レビュー申請ダイアログ',
          description: '申請内容の入力',
          location: 'モーダルウィンドウ'
        },
        {
          element: 'ステータスインジケータ',
          description: '記事の状態表示',
          location: '記事タイトル横'
        },
        {
          element: '公開設定パネル',
          description: '公開オプション',
          location: '右サイドバー'
        }
      ],
      validationRules: [
        {
          field: '本文',
          rule: '最低500文字以上',
          errorMessage: '記事は500文字以上必要です'
        }
      ],
      relatedFeatures: [
        {
          name: '公開履歴',
          description: '過去の公開記録',
          link: '/knowledge/history'
        },
        {
          name: '通知設定',
          description: '公開時の通知先',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: 'レビューなしで公開しようとする',
          solution: '品質保証のため必ずレビューを受ける'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '公開完了通知',
          description: '関係者に自動通知される',
          automatic: true
        },
        {
          action: '記事の共有',
          description: 'チームやSNSで共有',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '緊急公開が必要な場合',
          method: '管理者権限での即時公開',
          steps: [
            'PM以上の権限者に依頼',
            '理由を説明して承認を得る',
            '「緊急公開」オプションを選択',
            '事後レビューを実施'
          ],
          pros: ['迅速な情報共有'],
          cons: ['品質リスク', '事後修正の可能性']
        }
      ]
    }
  }
]