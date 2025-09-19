import type { DetailedStep } from '../use-case-details'

export const PM_PROJECT_MGMT_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'PMダッシュボードにアクセス',
    details: {
      prerequisites: [
        'PMロールでログインしていること',
        '担当プロジェクトが割り当てられていること',
        'プロジェクトがアクティブ状態であること'
      ],
      detailedInstructions: [
        'ログイン後、左側メニューから「PMダッシュボード」をクリック',
        'デフォルトで担当プロジェクトの一覧が表示される',
        '管理したいプロジェクトを選択',
        'プロジェクト詳細ビューが表示されることを確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'プロジェクト選択ドロップダウン',
          description: '担当プロジェクトの切り替え',
          location: '画面上部左側'
        },
        {
          element: 'ダッシュボードビュー切替',
          description: 'カンバン/ガント/リストビューの切り替え',
          location: '画面上部右側'
        },
        {
          element: 'フィルターボタン',
          description: 'タスクやメンバーでフィルタリング',
          location: 'ビュー切替の左側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'プロジェクト設定',
          description: 'プロジェクトの基本設定変更',
          link: '/projects/settings'
        },
        {
          name: 'チームカレンダー',
          description: 'チーム全体のスケジュール確認',
          link: '/calendar/team'
        }
      ],
      commonMistakes: [
        {
          issue: '複数プロジェクトを管理していて混乱',
          solution: 'プロジェクト選択ドロップダウンで正しいプロジェクトを選択しているか確認'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + P',
          action: 'プロジェクト切替',
          description: 'プロジェクト選択ダイアログを開く'
        }
      ],
      nextActions: [
        {
          action: '進捗サマリー表示',
          description: 'プロジェクトの全体進捗が自動表示',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'プロジェクトの進捗状況確認',
    details: {
      prerequisites: [
        'プロジェクトが選択されていること',
        '最新のタスク情報が反映されていること'
      ],
      detailedInstructions: [
        'ダッシュボード上部の進捗サマリーカードを確認',
        '全体進捗率とマイルストーン達成状況を把握',
        'ガントチャートビューで遅延タスクを確認（赤色表示）',
        'バーンダウンチャートで実績と計画の乖離を確認',
        '重要なKPI（予算消化率、リソース稼働率）をチェック',
        'アラート通知があれば内容を確認',
        '週次進捗レポートのプレビュー'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '進捗率ゲージ',
          description: 'プロジェクト全体の完了率',
          location: 'ダッシュボード上部中央'
        },
        {
          element: 'マイルストーンタイムライン',
          description: '重要な節目の達成状況',
          location: '進捗率ゲージの下'
        },
        {
          element: '遅延タスクアラート',
          description: '期限超過タスクの警告表示',
          location: '画面右上の通知エリア'
        },
        {
          element: 'バーンダウンチャート',
          description: '計画vs実績の進捗推移',
          location: 'ダッシュボード中央左'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '進捗レポート生成',
          description: '定型レポートの自動作成',
          link: '/reports/progress'
        },
        {
          name: '進捗履歴',
          description: '過去の進捗推移を確認',
          link: '/projects/history'
        }
      ],
      commonMistakes: [
        {
          issue: '表面的な進捗率だけで判断',
          solution: 'クリティカルパス上のタスクの進捗を重点的に確認'
        },
        {
          issue: '遅延の兆候を見逃す',
          solution: 'バーンダウンチャートの傾きが計画線から乖離し始めたら要注意'
        }
      ],
      shortcuts: [
        {
          action: 'ドリルダウン分析',
          description: 'KPIカードをクリックで詳細表示',
          keys: 'クリック操作'
        }
      ],
      nextActions: [
        {
          action: 'タスク管理画面へ',
          description: '詳細なタスク管理を行う',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'より詳細な進捗分析が必要な場合',
          method: 'アーンドバリュー分析（EVM）',
          steps: [
            'EVM分析画面にアクセス',
            'コスト効率指数（CPI）を確認',
            'スケジュール効率指数（SPI）を確認',
            '完了時総コスト予測（EAC）を算出',
            '対策が必要な領域を特定'
          ],
          pros: ['定量的な分析が可能', '将来予測ができる'],
          cons: ['理解に専門知識が必要', '正確な工数入力が前提']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'タスクの割当・優先度設定',
    details: {
      prerequisites: [
        'タスクが作成されていること',
        'チームメンバーがアサインされていること',
        'タスクの依存関係が定義済み'
      ],
      detailedInstructions: [
        'タスク管理ビュー（カンバンまたはリスト）を開く',
        '未割当タスクを確認',
        'メンバーの現在の負荷状況を確認',
        'タスクにメンバーをドラッグ&ドロップで割当',
        '優先度（緊急/高/中/低）を設定',
        '期限日を設定または調整',
        'タスクの見積もり工数を入力',
        '必要に応じてサブタスクに分解',
        'タスク説明に詳細な作業内容を記載'
      ],
      fieldDescriptions: [
        {
          name: '担当者',
          description: 'タスク実行責任者',
          format: 'チームメンバーから選択',
          required: true
        },
        {
          name: '優先度',
          description: 'タスクの重要度',
          format: '緊急/高/中/低',
          required: true
        },
        {
          name: '見積もり工数',
          description: '作業完了までの予想時間',
          format: '時間単位（0.5h刻み）',
          required: false,
          example: '8.0（1人日相当）'
        },
        {
          name: '期限',
          description: 'タスク完了期限',
          format: '日時',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'メンバー負荷グラフ',
          description: '各メンバーの現在の作業負荷',
          location: '画面右側のサイドパネル'
        },
        {
          element: 'タスクカード',
          description: 'ドラッグ可能なタスク表示',
          location: 'カンバンボード内'
        },
        {
          element: '優先度フラグ',
          description: 'タスクの優先度を色分け表示',
          location: 'タスクカード左上'
        },
        {
          element: '一括操作ボタン',
          description: '複数タスクを選択して一括変更',
          location: 'ツールバー内'
        }
      ],
      validationRules: [
        {
          field: '期限',
          rule: 'プロジェクト期間内かつ依存タスク完了後',
          errorMessage: '依存タスクの完了予定日より前には設定できません'
        },
        {
          field: '担当者',
          rule: 'メンバーの稼働率100%以下',
          errorMessage: 'このメンバーは既に稼働率が100%を超えています'
        }
      ],
      relatedFeatures: [
        {
          name: 'スキルマッチング',
          description: 'タスクに最適なメンバーを推奨',
          link: '/tasks/skill-match'
        },
        {
          name: '自動スケジューリング',
          description: 'AIによる最適なタスク配分',
          link: '/tasks/auto-schedule'
        }
      ],
      commonMistakes: [
        {
          issue: '特定メンバーにタスクが集中',
          solution: 'メンバー負荷グラフを確認し、均等に配分'
        },
        {
          issue: '優先度設定が曖昧',
          solution: 'ビジネスインパクトとクリティカルパスを考慮して設定'
        }
      ],
      shortcuts: [
        {
          keys: 'Shift + クリック',
          action: '複数選択',
          description: '複数タスクを選択して一括操作'
        },
        {
          keys: 'D',
          action: '複製',
          description: '選択したタスクを複製'
        }
      ],
      nextActions: [
        {
          action: 'タスク通知送信',
          description: '割当メンバーに自動通知',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'リスクの識別と対策立案',
    details: {
      prerequisites: [
        'プロジェクトが実行フェーズにあること',
        'リスク管理権限を有していること',
        'リスク評価基準が定義済み'
      ],
      detailedInstructions: [
        'リスク管理タブを開く',
        '新規リスクの登録または既存リスクの更新',
        'リスクの影響度（高/中/低）を評価',
        'リスクの発生確率（高/中/低）を評価',
        'リスクマトリクスで優先度を確認',
        '対策案を複数検討して記載',
        '対策の実施責任者を指定',
        'リスクの監視頻度を設定',
        'エスカレーション条件を定義'
      ],
      fieldDescriptions: [
        {
          name: 'リスク名',
          description: 'リスクの簡潔な説明',
          format: '50文字以内',
          required: true,
          example: 'キーメンバーの離脱リスク'
        },
        {
          name: '影響度',
          description: '発生時のプロジェクトへの影響',
          format: '高/中/低',
          required: true
        },
        {
          name: '発生確率',
          description: 'リスクが現実化する可能性',
          format: '高/中/低',
          required: true
        },
        {
          name: '対策',
          description: '予防策と発生時対応策',
          format: '自由記述',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'リスクマトリクス',
          description: '影響度×発生確率の2軸マップ',
          location: 'リスク管理画面上部'
        },
        {
          element: 'リスク一覧',
          description: '登録されたリスクのリスト',
          location: '画面中央'
        },
        {
          element: 'リスクスコア',
          description: '自動計算されたリスク値',
          location: '各リスク行の右側'
        },
        {
          element: 'アクション履歴',
          description: 'リスク対応の実施履歴',
          location: 'リスク詳細画面下部'
        }
      ],
      validationRules: [
        {
          field: 'リスク対策',
          rule: '高リスクには必須',
          errorMessage: '高リスクには対策の記入が必須です'
        }
      ],
      relatedFeatures: [
        {
          name: 'リスクレポート',
          description: '経営層向けリスクサマリー',
          link: '/reports/risk'
        },
        {
          name: 'イシュー管理',
          description: '顕在化したリスクの管理',
          link: '/issues'
        }
      ],
      commonMistakes: [
        {
          issue: 'リスクの過小評価',
          solution: '客観的な評価基準を用い、第三者レビューを実施'
        },
        {
          issue: '対策が具体的でない',
          solution: 'いつ、誰が、何をするかを明確に記載'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + R',
          action: '新規リスク登録',
          description: 'リスク登録フォームを開く'
        }
      ],
      nextActions: [
        {
          action: 'リスクレビュー会議設定',
          description: '定期的なリスク評価会議を設定',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'プロジェクトが大規模で複雑な場合',
          method: 'モンテカルロシミュレーション',
          steps: [
            'リスク分析ツールにアクセス',
            '各タスクの楽観・最可能・悲観的見積もりを入力',
            'シミュレーションを実行（1000回以上）',
            '完了確率分布を確認',
            '許容可能な完了確率となる期限を設定'
          ],
          pros: ['統計的な裏付けがある', '経営層への説明力が高い'],
          cons: ['準備に時間がかかる', '専門知識が必要']
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'チームメンバーの稼働状況確認',
    details: {
      prerequisites: [
        'チームメンバーが工数入力していること',
        'リソース管理の権限を有していること',
        '稼働計画が設定済み'
      ],
      detailedInstructions: [
        'リソース管理ビューを開く',
        'チーム全体の稼働率サマリーを確認',
        '個人別の週次/月次稼働率を確認',
        '計画稼働率との差異を分析',
        'オーバーアロケーションの警告を確認',
        '他プロジェクトとの競合を確認',
        '必要に応じてタスクの再割当を実施',
        '長期的なリソース計画を調整',
        'メンバーと1on1で負荷状況を確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'リソースヒートマップ',
          description: 'メンバー×期間の稼働率を色分け表示',
          location: '画面中央'
        },
        {
          element: '稼働率グラフ',
          description: '時系列での稼働率推移',
          location: 'ヒートマップ下部'
        },
        {
          element: 'アラートインジケーター',
          description: '100%超過を赤色で警告',
          location: 'メンバー名の横'
        },
        {
          element: 'タスク調整パネル',
          description: 'ドラッグでタスクを再配分',
          location: '画面右側'
        }
      ],
      validationRules: [
        {
          field: '稼働率',
          rule: '100%を超えないよう調整',
          errorMessage: '稼働率が100%を超えています。タスクの再配分が必要です'
        }
      ],
      relatedFeatures: [
        {
          name: 'スキル管理',
          description: 'メンバーのスキル情報',
          link: '/team/skills'
        },
        {
          name: '休暇カレンダー',
          description: 'メンバーの休暇予定',
          link: '/calendar/leave'
        },
        {
          name: '稼働実績分析',
          description: '過去の稼働実績レポート',
          link: '/reports/utilization'
        }
      ],
      commonMistakes: [
        {
          issue: '表面的な数字だけで判断',
          solution: 'メンバーと直接対話し、実際の負荷感を確認'
        },
        {
          issue: '突発的なタスクを考慮しない',
          solution: '稼働率は80-85%程度に抑え、バッファーを確保'
        }
      ],
      shortcuts: [
        {
          action: 'ビュー切替',
          description: '日/週/月表示を切り替え',
          keys: 'D/W/M'
        }
      ],
      nextActions: [
        {
          action: '週次チームミーティング',
          description: '進捗確認と課題共有',
          automatic: false
        },
        {
          action: 'ステークホルダー報告',
          description: '進捗レポートの作成と送付',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'リソース不足が深刻な場合',
          method: '外部リソースの活用',
          steps: [
            '必要なスキルセットを明確化',
            '外部ベンダー候補をリストアップ',
            '見積もりを取得',
            '契約交渉と承認取得',
            'オンボーディングとタスク割当'
          ],
          pros: ['専門スキルの即座な確保', '固定費増加を回避'],
          cons: ['コスト増加', 'ナレッジが社内に蓄積されない']
        }
      ]
    }
  }
]