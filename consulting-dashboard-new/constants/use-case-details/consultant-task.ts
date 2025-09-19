import type { DetailedStep } from '../use-case-details'

export const CONSULTANT_TASK_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'コンサルタントダッシュボードにアクセス',
    details: {
      prerequisites: [
        'コンサルタントロールでログインしていること',
        'プロジェクトにアサインされていること',
        'タスクが割り当てられていること'
      ],
      detailedInstructions: [
        'ログイン後、自動的にコンサルタントダッシュボードが表示',
        'もし表示されない場合は左側メニューから「マイダッシュボード」をクリック',
        '本日の予定とタスク一覧が表示される',
        '通知があれば画面上部に表示される'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '今日のタスクウィジェット',
          description: '本日期限のタスクを表示',
          location: 'ダッシュボード上部左側'
        },
        {
          element: 'カレンダーウィジェット',
          description: '今週の予定を表示',
          location: 'ダッシュボード上部右側'
        },
        {
          element: '進行中タスクリスト',
          description: '自分が作業中のタスク一覧',
          location: 'ダッシュボード中央'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'タスクフィルター',
          description: 'プロジェクトや優先度でフィルタリング',
          link: '/tasks/filter'
        },
        {
          name: '個人設定',
          description: 'ダッシュボードのカスタマイズ',
          link: '/settings/dashboard'
        }
      ],
      commonMistakes: [
        {
          issue: 'ダッシュボードが他のロールで表示される',
          solution: 'ロール設定を確認し、必要に応じて管理者に変更を依頼'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + D',
          action: 'ダッシュボードへ',
          description: 'どの画面からでもダッシュボードに戻る'
        }
      ],
      nextActions: [
        {
          action: 'タスク一覧の確認',
          description: '割り当てられたタスクが表示される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'モバイルデバイスから確認したい場合',
          method: 'モバイルアプリを使用',
          steps: [
            'スマートフォンでアプリをダウンロード',
            '同じアカウントでログイン',
            'モバイル最適化されたビューで確認',
            'プッシュ通知を有効化'
          ],
          pros: ['どこからでもアクセス可能', 'プッシュ通知でリマインド'],
          cons: ['一部機能が制限される', '画面が小さい']
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '今日のタスク一覧を確認',
    details: {
      prerequisites: [
        'ダッシュボードが表示されていること',
        'タスクが割り当てられていること'
      ],
      detailedInstructions: [
        '「今日のタスク」セクションで本日期限のタスクを確認',
        'タスクの優先度を確認（緊急/高/中/低）',
        '各タスクの期限時刻を確認',
        '依存関係があるタスクを確認',
        'ブロックされているタスクがないか確認',
        'タスクの見積もり時間と実際の進捗を比較',
        '必要に応じてタスクの詳細を開いて内容確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'タスクカード',
          description: 'タスクの概要情報を表示',
          location: 'リスト内の各項目'
        },
        {
          element: '優先度インジケーター',
          description: '色とアイコンで優先度を表示',
          location: 'タスクカード左側'
        },
        {
          element: '進捗バー',
          description: 'タスクの完了度を視覚化',
          location: 'タスクカード下部'
        },
        {
          element: '期限タイマー',
          description: '残り時間をカウントダウン',
          location: '期限が近いタスクに表示'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'タスクの並び替え',
          description: '優先度や期限でソート',
          link: '/tasks/sort'
        },
        {
          name: 'タスクテンプレート',
          description: '定型タスクの登録',
          link: '/tasks/templates'
        }
      ],
      commonMistakes: [
        {
          issue: '優先度を考慮せずに作業開始',
          solution: '必ず高優先度のタスクから着手し、期限も確認'
        },
        {
          issue: '依存タスクの完了待ちを忘れる',
          solution: '依存関係アイコンを確認し、前提タスクの状況を把握'
        }
      ],
      shortcuts: [
        {
          keys: 'T',
          action: 'タスク作成',
          description: '新規タスクを素早く作成'
        }
      ],
      nextActions: [
        {
          action: 'タスクの開始',
          description: '優先度の高いタスクから作業開始',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'タスクのステータス更新',
    details: {
      prerequisites: [
        'タスクを選択していること',
        '作業を開始または進行していること'
      ],
      detailedInstructions: [
        'タスクカードをクリックして詳細画面を開く',
        'ステータスを「未着手」から「進行中」に変更',
        'タスクを開始した時刻が自動記録される',
        '進捗率をスライダーで更新（0-100%）',
        '作業内容をコメントに記載',
        '問題や課題があれば記録',
        '完了したら「完了」ステータスに変更',
        '必要に応じて次のタスクの作成や関連付け'
      ],
      fieldDescriptions: [
        {
          name: 'ステータス',
          description: 'タスクの現在の状態',
          format: '未着手/進行中/レビュー待ち/完了/保留',
          required: true
        },
        {
          name: '進捗率',
          description: 'タスクの完了度合い',
          format: '0-100%（10%刻み）',
          required: false
        },
        {
          name: '作業メモ',
          description: '作業内容や気づきの記録',
          format: 'テキスト',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'ステータスドロップダウン',
          description: 'タスク状態の選択',
          location: 'タスク詳細画面上部'
        },
        {
          element: '進捗スライダー',
          description: 'ドラッグで進捗を更新',
          location: 'ステータスの下'
        },
        {
          element: 'タイムトラッカー',
          description: '作業時間を自動計測',
          location: '画面右側'
        },
        {
          element: '活動ログ',
          description: 'ステータス変更履歴',
          location: '画面下部'
        }
      ],
      validationRules: [
        {
          field: '進捗率',
          rule: 'ステータスと整合性を保つ',
          errorMessage: '完了ステータスの場合、進捗率は100%である必要があります'
        }
      ],
      relatedFeatures: [
        {
          name: 'タイムトラッキング',
          description: '詳細な作業時間記録',
          link: '/tasks/time-tracking'
        },
        {
          name: 'ステータス通知',
          description: 'PMへの自動通知設定',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: '進捗更新を忘れる',
          solution: '作業の区切りごとに更新する習慣をつける（ポモドーロテクニック活用）'
        },
        {
          issue: 'ステータスと進捗率の不整合',
          solution: 'ステータス変更時は必ず進捗率も確認'
        }
      ],
      shortcuts: [
        {
          keys: 'S',
          action: 'ステータス変更',
          description: 'ステータスメニューを開く'
        },
        {
          keys: 'P',
          action: '進捗更新',
          description: '進捗入力にフォーカス'
        }
      ],
      nextActions: [
        {
          action: '作業時間の記録',
          description: 'タイムトラッカーで時間を記録',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'カンバンビューで管理したい場合',
          method: 'カンバンボードでドラッグ&ドロップ',
          steps: [
            'ビューをカンバンに切り替え',
            'タスクカードをドラッグ',
            '該当するステータス列にドロップ',
            '自動的にステータスが更新される'
          ],
          pros: ['視覚的で直感的', '全体の流れが把握しやすい'],
          cons: ['詳細情報の更新には不向き']
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '作業時間の記録',
    details: {
      prerequisites: [
        'タスクが進行中ステータスであること',
        'タイムトラッキングが有効化されていること'
      ],
      detailedInstructions: [
        'タスク開始時に「タイマー開始」ボタンをクリック',
        '作業中はタイマーが自動的にカウントアップ',
        '休憩や中断時は「一時停止」をクリック',
        '作業再開時は「再開」をクリック',
        'タスク完了時は「タイマー停止」をクリック',
        '記録された時間を確認し、必要に応じて手動調整',
        '作業内容の詳細をメモ欄に記載',
        '工数入力画面に自動的に反映されることを確認'
      ],
      fieldDescriptions: [
        {
          name: '実績時間',
          description: '実際にかかった作業時間',
          format: '時間:分（自動計測）',
          required: true
        },
        {
          name: '作業内容',
          description: '具体的な作業の説明',
          format: 'テキスト',
          required: false,
          example: 'ドキュメント作成、コードレビュー実施'
        }
      ],
      uiElements: [
        {
          element: 'タイマーウィジェット',
          description: '現在の計測時間を表示',
          location: 'タスク詳細画面右上'
        },
        {
          element: 'スタート/ストップボタン',
          description: 'タイマーの制御',
          location: 'タイマーウィジェット内'
        },
        {
          element: '作業履歴',
          description: '過去の作業セッション',
          location: 'タイマー下部'
        },
        {
          element: '手動調整',
          description: '時間の手動編集',
          location: '履歴の編集ボタン'
        }
      ],
      validationRules: [
        {
          field: '作業時間',
          rule: '1日24時間以内',
          errorMessage: '1日の作業時間が24時間を超えています'
        }
      ],
      relatedFeatures: [
        {
          name: 'ポモドーロタイマー',
          description: '25分作業+5分休憩のサイクル',
          link: '/tools/pomodoro'
        },
        {
          name: '作業分析',
          description: '時間の使い方を分析',
          link: '/analytics/time-usage'
        }
      ],
      commonMistakes: [
        {
          issue: 'タイマーの停止忘れ',
          solution: 'ブラウザ通知で一定時間ごとにリマインド設定'
        },
        {
          issue: '実際の作業時間との乖離',
          solution: '作業終了時に必ず実績を確認し、必要なら調整'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Space',
          action: 'タイマー開始/停止',
          description: 'タイマーをトグル'
        }
      ],
      nextActions: [
        {
          action: '工数への自動反映',
          description: '記録時間が工数入力に連携',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '成果物のアップロード',
    details: {
      prerequisites: [
        'タスクが完了間近または完了済み',
        '成果物ファイルが準備できていること',
        'アップロード権限があること'
      ],
      detailedInstructions: [
        'タスク詳細画面の「成果物」タブをクリック',
        '「ファイルをアップロード」ボタンをクリック',
        'ファイルをドラッグ&ドロップまたは選択',
        'ファイルの種類を選択（ドキュメント/コード/デザイン等）',
        'バージョン番号を入力（v1.0等）',
        '変更内容の説明を記載',
        'アクセス権限を設定（プロジェクトメンバー/クライアント閲覧可等）',
        'アップロード完了を確認',
        '必要に応じてレビュー依頼を送信',
        'タスクのステータスを「レビュー待ち」に更新'
      ],
      fieldDescriptions: [
        {
          name: 'ファイル',
          description: 'アップロードする成果物',
          format: '最大100MB、複数可',
          required: true
        },
        {
          name: 'バージョン',
          description: '成果物のバージョン番号',
          format: 'v1.0形式推奨',
          required: true,
          example: 'v1.0, v2.1-draft'
        },
        {
          name: '説明',
          description: '成果物の内容や変更点',
          format: 'テキスト',
          required: true
        },
        {
          name: '公開範囲',
          description: 'アクセス可能な範囲',
          format: '選択式',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'ドロップゾーン',
          description: 'ファイルをドラッグ&ドロップ',
          location: '成果物タブ中央'
        },
        {
          element: 'アップロード進捗',
          description: 'アップロードの進行状況',
          location: 'ファイル選択後に表示'
        },
        {
          element: 'バージョン履歴',
          description: '過去のバージョン一覧',
          location: '成果物リスト'
        },
        {
          element: 'プレビュー',
          description: 'ファイルの内容確認',
          location: '各ファイルの表示ボタン'
        }
      ],
      validationRules: [
        {
          field: 'ファイルサイズ',
          rule: '100MB以下',
          errorMessage: 'ファイルサイズが大きすぎます。圧縮してください'
        },
        {
          field: 'ファイル形式',
          rule: '許可された形式のみ',
          errorMessage: 'このファイル形式はサポートされていません'
        }
      ],
      relatedFeatures: [
        {
          name: 'バージョン管理',
          description: '成果物の変更履歴管理',
          link: '/documents/versions'
        },
        {
          name: 'レビュー機能',
          description: 'オンラインでのレビューとフィードバック',
          link: '/review'
        }
      ],
      commonMistakes: [
        {
          issue: '大きなファイルのアップロード失敗',
          solution: 'ファイルを分割または圧縮してアップロード'
        },
        {
          issue: 'バージョン管理の混乱',
          solution: '明確な命名規則（v1.0, v1.1等）を守る'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + U',
          action: 'アップロード',
          description: 'アップロードダイアログを開く'
        }
      ],
      nextActions: [
        {
          action: 'レビュー依頼',
          description: 'PMまたはレビュアーに通知',
          automatic: false
        },
        {
          action: 'タスク完了',
          description: 'レビュー後にタスクをクローズ',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '大容量ファイルの共有が必要な場合',
          method: '外部ストレージサービス連携',
          steps: [
            'Google Drive/OneDriveなどにアップロード',
            '共有リンクを生成',
            'タスクにリンクを記載',
            'アクセス権限を適切に設定',
            'ダウンロード期限を設定'
          ],
          pros: ['大容量対応', '共同編集可能'],
          cons: ['セキュリティ管理が複雑', '外部サービス依存']
        }
      ]
    }
  }
]