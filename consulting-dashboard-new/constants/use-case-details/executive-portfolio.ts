import type { DetailedStep } from '../use-case-details'

export const EXECUTIVE_PORTFOLIO_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'エグゼクティブダッシュボードにアクセス',
    details: {
      prerequisites: [
        'Executiveロールでログインしていること',
        '全社プロジェクト閲覧権限を保有していること',
        '最新のブラウザ（Chrome/Edge/Safari）を使用していること'
      ],
      detailedInstructions: [
        'ログイン後、左側メニューから「ダッシュボード」をクリック',
        'ロールがExecutiveの場合、自動的にエグゼクティブビューが表示される',
        '初回アクセス時はデータ読み込みに10-20秒かかる場合があります',
        'カスタマイズが必要な場合は右上の「ビュー設定」から調整'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'メインダッシュボード',
          description: '全社プロジェクトの俯瞰ビュー',
          location: '画面中央の大部分を占める領域'
        },
        {
          element: '期間フィルター',
          description: '表示期間を切り替え（今月/今四半期/今年度）',
          location: '画面右上のドロップダウン'
        },
        {
          element: 'リフレッシュボタン',
          description: 'データを最新状態に更新',
          location: '期間フィルターの左側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'ダッシュボードカスタマイズ',
          description: 'ウィジェットの配置や表示項目をカスタマイズ',
          link: '/dashboard/customize'
        }
      ],
      commonMistakes: [
        {
          issue: '権限エラーが表示される',
          solution: 'Executiveロールが正しく付与されているか管理者に確認してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + D',
          action: 'ダッシュボードへ直接移動',
          description: 'どの画面からでもダッシュボードに戻る'
        }
      ],
      nextActions: [
        {
          action: 'KPIサマリー確認',
          description: '重要指標の概要が自動的に表示されます',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'KPIサマリーで全体状況を把握',
    details: {
      prerequisites: [
        'ダッシュボードが正常に表示されていること',
        'データの集計が完了していること'
      ],
      detailedInstructions: [
        '画面上部のKPIカードエリアを確認',
        '各KPIカードの数値と前期比を確認',
        '異常値（赤色表示）がある場合は詳細を確認',
        'トレンドアイコンで改善/悪化傾向を把握',
        'カードをクリックすると詳細画面へ遷移'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'KPIカード',
          description: '重要指標を表示する矩形カード',
          location: 'ダッシュボード上部に横並び'
        },
        {
          element: 'トレンドインジケーター',
          description: '上昇/下降/横ばいを示す矢印',
          location: '各KPIカードの右側'
        },
        {
          element: '警告アイコン',
          description: '閾値を超えた場合に表示',
          location: 'KPI数値の右上'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'KPI詳細分析',
          description: 'KPIの詳細な推移と要因分析',
          link: '/analytics/kpi'
        },
        {
          name: 'アラート設定',
          description: 'KPIの閾値設定と通知',
          link: '/settings/alerts'
        }
      ],
      commonMistakes: [
        {
          issue: 'KPIの数値が更新されない',
          solution: 'リフレッシュボタンをクリックするか、F5キーでページを更新してください'
        }
      ],
      shortcuts: [
        {
          action: 'ドリルダウン',
          description: 'KPIカードをクリックで詳細分析へ',
          keys: 'クリック操作'
        }
      ],
      nextActions: [
        {
          action: 'プロジェクト一覧の確認',
          description: '個別プロジェクトの状況を確認',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'プロジェクト一覧から問題プロジェクトを特定',
    details: {
      prerequisites: [
        'KPIサマリーで全体傾向を把握済み',
        'プロジェクト一覧の表示権限があること'
      ],
      detailedInstructions: [
        'ダッシュボード中央のプロジェクト一覧テーブルを確認',
        'ステータス列で「要注意」「遅延」のプロジェクトを特定',
        '予算消化率が計画を大きく超えているプロジェクトを確認',
        'ソート機能を使って問題プロジェクトを上位に表示',
        'フィルター機能で特定条件のプロジェクトのみ表示',
        '各プロジェクトの「詳細」ボタンで個別分析画面へ'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'プロジェクトテーブル',
          description: 'プロジェクト一覧を表形式で表示',
          location: 'ダッシュボード中央'
        },
        {
          element: 'ステータスバッジ',
          description: '進行中/要注意/遅延/完了を色分け表示',
          location: '各行のステータス列'
        },
        {
          element: '進捗バー',
          description: 'プロジェクト進捗を視覚的に表示',
          location: '各行の進捗列'
        },
        {
          element: 'フィルターパネル',
          description: '表示条件を設定するサイドパネル',
          location: 'テーブル右上のフィルターボタンから展開'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'プロジェクト詳細',
          description: '個別プロジェクトの詳細分析',
          link: '/projects/[id]'
        },
        {
          name: 'リスク管理',
          description: 'プロジェクトリスクの一覧と対策',
          link: '/risks'
        }
      ],
      commonMistakes: [
        {
          issue: 'フィルター適用後にデータが表示されない',
          solution: 'フィルター条件が厳しすぎる可能性があります。「リセット」ボタンで初期化してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + F',
          action: 'クイック検索',
          description: 'プロジェクト名で素早く検索'
        }
      ],
      nextActions: [
        {
          action: '問題プロジェクトの詳細確認',
          description: '要注意プロジェクトをクリックして詳細分析',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'リソース配分の最適化検討',
    details: {
      prerequisites: [
        '問題プロジェクトを特定済み',
        'リソース管理権限を保有していること'
      ],
      detailedInstructions: [
        'ダッシュボード下部の「リソース配分」セクションを確認',
        '部門別・スキル別の稼働率グラフを分析',
        '稼働率が100%を超えている（赤色）リソースを特定',
        '稼働率が低い（青色）リソースを特定',
        'リソースシミュレーション機能でWhat-if分析を実行',
        '最適化案を作成して保存',
        '必要に応じてPMに再配分を指示'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'リソースヒートマップ',
          description: '稼働率を色の濃淡で可視化',
          location: 'ダッシュボード下部'
        },
        {
          element: 'スキルマトリックス',
          description: 'スキル別のリソース配置状況',
          location: 'ヒートマップの右側'
        },
        {
          element: 'シミュレーションボタン',
          description: 'What-if分析ツールを起動',
          location: 'リソースセクション右上'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'リソースシミュレーター',
          description: 'リソース再配分のシミュレーション',
          link: '/resources/simulator'
        },
        {
          name: 'スキル管理',
          description: 'メンバーのスキル情報管理',
          link: '/skills'
        }
      ],
      commonMistakes: [
        {
          issue: 'シミュレーション結果が現実的でない',
          solution: 'メンバーのスキルレベルや稼働可能時間の制約を考慮してください'
        }
      ],
      shortcuts: [
        {
          action: 'ドラッグ&ドロップ',
          description: 'リソースを直接移動してシミュレーション',
          keys: 'マウス操作'
        }
      ],
      nextActions: [
        {
          action: '再配分指示',
          description: 'PMへリソース調整を依頼',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'アクションプランの実行',
    details: {
      prerequisites: [
        '問題点と対策を明確化済み',
        '関係者との調整完了'
      ],
      detailedInstructions: [
        'ダッシュボード右側の「アクション」パネルを開く',
        '実行すべきアクションをリストアップ',
        '各アクションに担当者と期限を設定',
        '優先度を設定（高/中/低）',
        'アクションを関係者に通知',
        'Slackやメールでの自動通知を設定',
        'アクションの進捗を定期的にモニタリング',
        '週次レポートに含めるアクションを選択'
      ],
      fieldDescriptions: [
        {
          name: 'アクション名',
          description: '実行すべき具体的な行動',
          format: '50文字以内',
          required: true,
          example: '○○プロジェクトへのシニアエンジニア追加配置'
        },
        {
          name: '担当者',
          description: 'アクション実行責任者',
          format: 'ユーザー選択',
          required: true
        },
        {
          name: '期限',
          description: 'アクション完了期限',
          format: '日付選択',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'アクションパネル',
          description: 'アクション管理用サイドパネル',
          location: '画面右側（折りたたみ可能）'
        },
        {
          element: '通知設定',
          description: '自動リマインダーの設定',
          location: '各アクションの設定メニュー'
        },
        {
          element: 'ステータストラッカー',
          description: 'アクションの進捗状況表示',
          location: 'アクションリスト内'
        }
      ],
      validationRules: [
        {
          field: '期限',
          rule: '本日以降の日付',
          errorMessage: '過去の日付は設定できません'
        }
      ],
      relatedFeatures: [
        {
          name: 'タスク管理',
          description: '詳細なタスク管理システム',
          link: '/tasks'
        },
        {
          name: '通知設定',
          description: '通知方法とタイミングの詳細設定',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: 'アクションが実行されない',
          solution: '担当者に通知が届いているか確認し、必要に応じて直接連絡してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: 'アクション保存',
          description: '編集中のアクションを即座に保存'
        }
      ],
      nextActions: [
        {
          action: '定期レビュー設定',
          description: '週次/月次レビューミーティングを設定',
          automatic: false
        },
        {
          action: 'ダッシュボードへ戻る',
          description: '全体状況の確認に戻る',
          automatic: false
        }
      ]
    }
  }
]