import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_FAQ_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'FAQ管理画面にアクセス',
    details: {
      prerequisites: [
        'PMまたは管理者ロールでログインしていること',
        'FAQ管理権限があること'
      ],
      detailedInstructions: [
        '管理メニューから「FAQ管理」を選択',
        'FAQ一覧画面が表示される',
        '既存のFAQ項目を確認',
        'カテゴリ別に整理されている状態を確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'FAQ管理メニュー',
          description: 'FAQ編集機能への入口',
          location: '管理メニュー内'
        },
        {
          element: '新規作成ボタン',
          description: 'FAQ追加ボタン',
          location: '画面右上'
        },
        {
          element: 'カテゴリタブ',
          description: 'FAQ分類表示',
          location: '画面上部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'FAQ統計',
          description: '閲覧数や評価の分析',
          link: '/faq/analytics'
        }
      ],
      commonMistakes: [
        {
          issue: 'カテゴリを確認せずに作成',
          solution: '適切なカテゴリに配置'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'FAQ作成画面へ',
          description: '新規FAQ作成開始',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '新規FAQ項目の作成',
    details: {
      prerequisites: [
        'よくある質問と回答が準備されている',
        '対象ユーザーが明確'
      ],
      detailedInstructions: [
        '「新規FAQ作成」ボタンをクリック',
        '質問文を簡潔に入力',
        '疑問形で記載するよう注意',
        'ターゲットユーザーを想定',
        '検索されやすいキーワードを含める'
      ],
      fieldDescriptions: [
        {
          name: '質問',
          description: 'よくある質問の内容',
          format: 'テキスト（200文字以内）',
          required: true,
          example: 'プロジェクトの工数入力はいつまでに行う必要がありますか？'
        },
        {
          name: '対象者',
          description: '質問の想定読者',
          format: '複数選択',
          required: true,
          example: 'コンサルタント, PM'
        }
      ],
      uiElements: [
        {
          element: '質問入力フィールド',
          description: '質問文の入力欄',
          location: 'フォーム上部'
        },
        {
          element: '文字数カウンター',
          description: '残り文字数表示',
          location: '入力欄右下'
        },
        {
          element: '類似FAQ表示',
          description: '重複チェック',
          location: '右サイドパネル'
        }
      ],
      validationRules: [
        {
          field: '質問文',
          rule: '10文字以上200文字以内',
          errorMessage: '質問は10-200文字で入力してください'
        }
      ],
      relatedFeatures: [
        {
          name: '質問テンプレート',
          description: 'よくある質問パターン',
          link: '/faq/templates'
        }
      ],
      commonMistakes: [
        {
          issue: '専門用語を多用した質問',
          solution: '一般的な言葉で表現'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '回答の記入へ',
          description: '詳細な回答を作成',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '既存FAQの改善',
          method: '編集モードで更新',
          steps: [
            '既存FAQ一覧から選択',
            '編集ボタンをクリック',
            '質問文を修正',
            '更新履歴にコメント追加'
          ],
          pros: ['継続性の維持', '履歴管理'],
          cons: ['大幅な変更は難しい']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '質問と回答の記入',
    details: {
      prerequisites: [
        '質問内容が決定している',
        '正確な回答情報を持っている'
      ],
      detailedInstructions: [
        '回答欄にマークダウンで記述',
        '段階的に説明する場合は番号付きリスト使用',
        '重要な注意点は強調表示',
        '関連リンクを適切に配置',
        'スクリーンショットを必要に応じて添付',
        'コード例がある場合はコードブロックで記載',
        '回答は具体的かつ実用的に'
      ],
      fieldDescriptions: [
        {
          name: '回答',
          description: '質問に対する詳細な回答',
          format: 'マークダウン形式',
          required: true
        },
        {
          name: '参考リンク',
          description: '関連情報へのリンク',
          format: 'URL（複数可）',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'マークダウンエディタ',
          description: '回答入力エリア',
          location: 'メインフォーム'
        },
        {
          element: 'プレビュータブ',
          description: '表示確認',
          location: 'エディタ上部'
        },
        {
          element: '画像アップロード',
          description: 'スクリーンショット追加',
          location: 'ツールバー'
        }
      ],
      validationRules: [
        {
          field: '回答',
          rule: '最低50文字以上',
          errorMessage: '回答は50文字以上必要です'
        }
      ],
      relatedFeatures: [
        {
          name: '回答例文集',
          description: 'よく使う表現',
          link: '/faq/phrases'
        }
      ],
      commonMistakes: [
        {
          issue: '抽象的な回答',
          solution: '具体的な手順や例を含める'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + L',
          action: 'リンク挿入',
          description: '関連リンクの追加'
        }
      ],
      nextActions: [
        {
          action: 'カテゴリ分類へ',
          description: '適切なカテゴリを選択',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'カテゴリの分類',
    details: {
      prerequisites: [
        'FAQの内容が完成している',
        'カテゴリ体系を理解している'
      ],
      detailedInstructions: [
        'メインカテゴリを選択',
        'サブカテゴリがある場合は追加選択',
        '複数カテゴリへの登録も可能',
        '新規カテゴリが必要な場合は作成',
        'タグを3-5個程度追加',
        '関連FAQとの紐付け設定',
        '表示順序の優先度を設定'
      ],
      fieldDescriptions: [
        {
          name: 'カテゴリ',
          description: 'FAQの分類',
          format: '選択式（複数可）',
          required: true,
          example: 'プロジェクト管理 > 工数管理'
        },
        {
          name: 'タグ',
          description: '検索用キーワード',
          format: 'タグ入力',
          required: false,
          example: 'タイムシート, 締切, 承認'
        },
        {
          name: '優先度',
          description: '表示順序',
          format: '数値（1-100）',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'カテゴリセレクター',
          description: '階層選択UI',
          location: '設定セクション'
        },
        {
          element: 'タグサジェスト',
          description: '既存タグの提案',
          location: 'タグ入力欄'
        },
        {
          element: '関連FAQ選択',
          description: '関連項目の設定',
          location: '下部セクション'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'カテゴリ管理',
          description: 'カテゴリ構造の編集',
          link: '/admin/categories'
        }
      ],
      commonMistakes: [
        {
          issue: '一般的すぎるカテゴリ選択',
          solution: '具体的なサブカテゴリまで選択'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '公開設定へ',
          description: '公開範囲と日時の設定',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '公開・更新',
    details: {
      prerequisites: [
        'FAQ内容が完成している',
        'カテゴリ分類が完了している',
        '公開承認権限がある'
      ],
      detailedInstructions: [
        '公開範囲を選択（全体/特定ロール）',
        '公開日時を設定（即時/予約）',
        '更新の場合は変更履歴を記載',
        'プレビューで最終確認',
        '関係者への通知設定',
        '公開ボタンをクリック',
        '公開後のURL確認',
        'Slackやメールで周知（任意）'
      ],
      fieldDescriptions: [
        {
          name: '公開範囲',
          description: '閲覧可能なユーザー',
          format: '選択式',
          required: true,
          example: '全ユーザー'
        },
        {
          name: '公開日時',
          description: '公開タイミング',
          format: '日時選択',
          required: false
        },
        {
          name: '更新メモ',
          description: '変更内容の記録',
          format: 'テキスト',
          required: false
        }
      ],
      uiElements: [
        {
          element: '公開設定パネル',
          description: '公開オプション',
          location: '右サイドバー'
        },
        {
          element: 'プレビューボタン',
          description: '公開前の確認',
          location: 'アクションバー'
        },
        {
          element: '公開ボタン',
          description: 'FAQ公開実行',
          location: '画面下部'
        }
      ],
      validationRules: [
        {
          field: '必須項目',
          rule: 'すべて入力済み',
          errorMessage: '必須項目を確認してください'
        }
      ],
      relatedFeatures: [
        {
          name: '公開スケジュール',
          description: 'FAQ公開予定一覧',
          link: '/faq/schedule'
        },
        {
          name: '更新履歴',
          description: 'FAQ変更ログ',
          link: '/faq/history'
        }
      ],
      commonMistakes: [
        {
          issue: 'テスト環境で確認せずに公開',
          solution: 'プレビューで必ず確認'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'FAQが公開される',
          description: 'ユーザーが閲覧可能に',
          automatic: true
        },
        {
          action: '効果測定',
          description: '閲覧数や評価を監視',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '段階的な公開',
          method: 'ベータ公開機能',
          steps: [
            '「ベータ公開」オプションを選択',
            'テストユーザーグループを指定',
            'フィードバック収集期間を設定',
            'フィードバックを反映して本公開'
          ],
          pros: ['品質向上', 'リスク軽減'],
          cons: ['公開まで時間がかかる']
        }
      ]
    }
  }
]