import type { DetailedStep } from '../use-case-details'

export const CONSULTANT_SKILL_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'スキル管理画面にアクセス',
    details: {
      prerequisites: [
        'コンサルタントロールでログインしていること',
        'プロファイル編集権限があること',
        'スキルマスターが設定されていること'
      ],
      detailedInstructions: [
        '左側メニューから「マイプロファイル」をクリック',
        'プロファイル画面の「スキル」タブを選択',
        '現在登録されているスキル一覧が表示される',
        'スキルレベルのレーダーチャートを確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'スキルタブ',
          description: 'スキル情報の表示切替',
          location: 'プロファイル画面上部'
        },
        {
          element: 'スキル検索バー',
          description: '新しいスキルを検索',
          location: '画面上部中央'
        },
        {
          element: 'スキルレーダーチャート',
          description: 'スキルレベルを視覚化',
          location: '画面右側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'スキルカタログ',
          description: '全社で定義されたスキル一覧',
          link: '/skills/catalog'
        },
        {
          name: '推奨スキル',
          description: 'キャリアパスに応じた推奨スキル',
          link: '/skills/recommendations'
        }
      ],
      commonMistakes: [
        {
          issue: 'スキル管理を長期間更新しない',
          solution: '四半期ごとに見直し、新しく習得したスキルを追加'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + K',
          action: 'スキル検索',
          description: 'スキル検索にフォーカス'
        }
      ],
      nextActions: [
        {
          action: '現在のスキル確認',
          description: '登録済みスキルとレベルが表示',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '上司がスキルを評価・更新する場合',
          method: '360度評価機能を使用',
          steps: [
            '上司が部下のプロファイルにアクセス',
            'スキル評価モードに切り替え',
            '各スキルのレベルを評価',
            'フィードバックコメントを追加',
            '本人に通知される'
          ],
          pros: ['客観的な評価', 'ギャップの可視化'],
          cons: ['評価に時間がかかる', '認識の相違が生じる可能性']
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '保有スキルの検索・追加',
    details: {
      prerequisites: [
        'スキル管理画面が表示されていること',
        '追加したいスキルを把握していること'
      ],
      detailedInstructions: [
        '検索バーに追加したいスキル名を入力',
        'サジェストされる候補から選択または検索実行',
        'スキルカテゴリ（技術/ビジネス/業界知識等）でフィルタリング',
        '該当スキルの「追加」ボタンをクリック',
        'スキルが一覧に追加される',
        '複数スキルを追加する場合は繰り返し',
        'カスタムスキルが必要な場合は「新規スキル申請」'
      ],
      fieldDescriptions: [
        {
          name: 'スキル名',
          description: '検索するスキルの名称',
          format: '部分一致検索可能',
          required: false,
          example: 'Python, プロジェクトマネジメント, 財務分析'
        }
      ],
      uiElements: [
        {
          element: '検索サジェスト',
          description: '入力に応じてスキル候補を表示',
          location: '検索バー下'
        },
        {
          element: 'カテゴリフィルター',
          description: 'スキル分類での絞り込み',
          location: '検索バー右側'
        },
        {
          element: '人気スキル',
          description: '社内で多く登録されているスキル',
          location: '画面下部'
        },
        {
          element: '追加ボタン',
          description: 'スキルをプロファイルに追加',
          location: '各スキル項目の右端'
        }
      ],
      validationRules: [
        {
          field: 'スキル数',
          rule: '最大50個まで',
          errorMessage: 'スキル登録数が上限に達しました'
        }
      ],
      relatedFeatures: [
        {
          name: 'スキルマッチング',
          description: '必要スキルを持つメンバー検索',
          link: '/search/skills'
        },
        {
          name: 'スキルギャップ分析',
          description: '目標とのギャップを可視化',
          link: '/skills/gap-analysis'
        }
      ],
      commonMistakes: [
        {
          issue: '関連性の低いスキルを大量に追加',
          solution: '専門領域に関連する重要なスキルに絞って登録'
        },
        {
          issue: 'スキル名の重複登録',
          solution: '類似スキルがないか検索してから追加'
        }
      ],
      shortcuts: [
        {
          action: 'タグ選択',
          description: '関連スキルをまとめて追加',
          keys: 'クリックで複数選択'
        }
      ],
      nextActions: [
        {
          action: 'スキルレベル設定',
          description: '追加したスキルのレベルを評価',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'スキルレベルの自己評価',
    details: {
      prerequisites: [
        'スキルが追加されていること',
        'スキルレベルの基準を理解していること'
      ],
      detailedInstructions: [
        '各スキルの右側にあるレベル設定をクリック',
        'レベル1-5の5段階から選択（1:初級、5:エキスパート）',
        'レベル選択時にガイドラインが表示される',
        '経験年数と実績を考慮して適切に評価',
        '必要に応じて詳細説明を追加',
        '関連する実績やプロジェクトを紐付け',
        '証明となる資格・認定があれば登録',
        'すべてのスキルのレベル設定後「保存」'
      ],
      fieldDescriptions: [
        {
          name: 'スキルレベル',
          description: '習熟度を5段階で評価',
          format: '1-5の数値',
          required: true,
          example: '1:初心者、3:実務レベル、5:エキスパート'
        },
        {
          name: '経験年数',
          description: 'そのスキルの実務経験',
          format: '年数',
          required: false,
          example: '3年、6ヶ月'
        },
        {
          name: '詳細説明',
          description: 'スキルの具体的な内容',
          format: 'テキスト',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'レベルスライダー',
          description: '1-5のレベルを選択',
          location: '各スキルの右側'
        },
        {
          element: 'レベルガイド',
          description: '各レベルの基準説明',
          location: 'スライダーホバー時'
        },
        {
          element: '実績リンク',
          description: 'プロジェクトとの紐付け',
          location: 'スキル詳細エリア'
        },
        {
          element: '保存ボタン',
          description: '変更を保存',
          location: '画面下部'
        }
      ],
      validationRules: [
        {
          field: 'スキルレベル',
          rule: '1-5の範囲',
          errorMessage: 'レベルは1から5で設定してください'
        }
      ],
      relatedFeatures: [
        {
          name: 'スキル証明',
          description: '実績による裏付け',
          link: '/skills/verification'
        },
        {
          name: 'レベル基準',
          description: '社内統一のレベル定義',
          link: '/skills/level-criteria'
        }
      ],
      commonMistakes: [
        {
          issue: '過大評価または過小評価',
          solution: 'レベル基準ガイドを参照し、同僚と相対的に評価'
        },
        {
          issue: '証明なしで高レベル設定',
          solution: '実績やプロジェクト経験を必ず紐付ける'
        }
      ],
      shortcuts: [
        {
          keys: '1-5',
          action: 'レベル選択',
          description: '数字キーで直接レベル設定'
        }
      ],
      nextActions: [
        {
          action: '資格・認定の登録へ',
          description: '関連する資格情報を追加',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'チームでスキル評価を標準化したい場合',
          method: 'スキル評価会の実施',
          steps: [
            'チームメンバーが集まる',
            '各自のスキルを発表',
            '相互にレベルを評価',
            '合意形成して登録',
            'マネージャーが承認'
          ],
          pros: ['客観性の向上', 'チーム内の認識統一'],
          cons: ['時間がかかる', '調整が必要']
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '資格・認定の登録',
    details: {
      prerequisites: [
        'スキルレベルを設定済み',
        '資格証明書等を準備済み'
      ],
      detailedInstructions: [
        '「資格・認定」セクションに移動',
        '「新規追加」ボタンをクリック',
        '資格名を入力または選択',
        '取得日を入力',
        '有効期限がある場合は期限日を入力',
        '発行機関を選択または入力',
        '資格番号・IDを入力',
        '証明書のスキャンファイルをアップロード',
        '関連するスキルと紐付け',
        '公開範囲を設定（社内/プロジェクトメンバーのみ等）'
      ],
      fieldDescriptions: [
        {
          name: '資格名',
          description: '取得した資格の正式名称',
          format: 'テキスト',
          required: true,
          example: 'PMP、AWS認定ソリューションアーキテクト'
        },
        {
          name: '取得日',
          description: '資格を取得した日付',
          format: '年月日',
          required: true
        },
        {
          name: '有効期限',
          description: '更新が必要な場合の期限',
          format: '年月日',
          required: false
        },
        {
          name: '証明書',
          description: '資格証明書のファイル',
          format: 'PDF/画像',
          required: false
        }
      ],
      uiElements: [
        {
          element: '資格追加フォーム',
          description: '資格情報の入力画面',
          location: 'モーダルウィンドウ'
        },
        {
          element: 'ファイルアップロード',
          description: '証明書のアップロード',
          location: 'フォーム下部'
        },
        {
          element: '有効期限アラート',
          description: '期限切れ間近を警告',
          location: '資格リストに表示'
        },
        {
          element: 'スキル紐付け',
          description: '関連スキルとのリンク',
          location: 'フォーム内選択'
        }
      ],
      validationRules: [
        {
          field: '取得日',
          rule: '未来日は不可',
          errorMessage: '取得日は過去の日付を入力してください'
        },
        {
          field: 'ファイルサイズ',
          rule: '10MB以下',
          errorMessage: 'ファイルサイズは10MB以下にしてください'
        }
      ],
      relatedFeatures: [
        {
          name: '資格更新リマインド',
          description: '有効期限前の通知設定',
          link: '/settings/reminders'
        },
        {
          name: '資格取得支援',
          description: '会社の資格取得支援制度',
          link: '/benefits/certification'
        }
      ],
      commonMistakes: [
        {
          issue: '有効期限の登録忘れ',
          solution: '更新が必要な資格は必ず期限を登録'
        },
        {
          issue: '証明書の未アップロード',
          solution: 'スキャン or 写真を撮ってアップロード'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'プロファイル更新完了',
          description: '変更が保存される',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'プロファイルの更新',
    details: {
      prerequisites: [
        'すべての必要情報を入力済み',
        '変更内容を確認済み'
      ],
      detailedInstructions: [
        'すべての変更内容を確認',
        'プレビューで他者からの見え方を確認',
        '公開設定を最終確認（全社公開/限定公開）',
        '「プロファイルを更新」ボタンをクリック',
        '更新完了通知を確認',
        'スキルマッチングシステムに反映されることを確認',
        '必要に応じてマネージャーに更新を通知',
        'キャリア面談の資料として活用'
      ],
      fieldDescriptions: [
        {
          name: '公開範囲',
          description: 'プロファイルの閲覧可能範囲',
          format: '選択式',
          required: true,
          example: '全社公開、部門内のみ、非公開'
        }
      ],
      uiElements: [
        {
          element: 'プレビューボタン',
          description: '他者からの見え方を確認',
          location: '画面上部'
        },
        {
          element: '更新ボタン',
          description: '変更を保存',
          location: '画面下部中央'
        },
        {
          element: '変更履歴',
          description: '過去の更新記録',
          location: 'プロファイル設定内'
        },
        {
          element: '通知設定',
          description: 'マネージャーへの通知',
          location: '更新時のオプション'
        }
      ],
      validationRules: [
        {
          field: '必須スキル',
          rule: '職種に応じた必須スキルの登録',
          errorMessage: 'あなたの職種では○○スキルの登録が必須です'
        }
      ],
      relatedFeatures: [
        {
          name: 'キャリアパス',
          description: '目標設定とスキル開発計画',
          link: '/career/path'
        },
        {
          name: 'スキル検索',
          description: '更新したスキルでの検索確認',
          link: '/search/people'
        }
      ],
      commonMistakes: [
        {
          issue: '更新ボタンを押し忘れる',
          solution: '編集後は必ず保存を実行'
        },
        {
          issue: '公開範囲の設定ミス',
          solution: 'デフォルトは全社公開なので、必要に応じて制限'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + S',
          action: '保存',
          description: 'プロファイルを更新'
        }
      ],
      nextActions: [
        {
          action: 'スキルマッチングへの反映',
          description: 'プロジェクトアサインの候補になる',
          automatic: true
        },
        {
          action: '1on1での活用',
          description: 'マネージャーとのキャリア面談で参照',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'LinkedInなど外部プロファイルと連携したい場合',
          method: 'プロファイルインポート機能',
          steps: [
            'LinkedInプロファイルのURLを入力',
            '連携認証を実施',
            'インポート内容をプレビュー',
            '必要な情報を選択',
            '社内フォーマットに変換して取り込み'
          ],
          pros: ['入力の手間削減', '最新情報の維持'],
          cons: ['すべての情報は取り込めない', 'プライバシー設定注意']
        }
      ]
    }
  }
]