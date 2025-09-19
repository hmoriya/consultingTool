import type { DetailedStep } from '../use-case-details'

export const CLIENT_PROGRESS_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'クライアントダッシュボードにアクセス',
    details: {
      prerequisites: [
        'クライアントロールでログインしていること',
        'プロジェクトへのアクセス権限があること',
        'プロジェクトコードまたは名称を把握していること'
      ],
      detailedInstructions: [
        'ログイン後、クライアント専用ダッシュボードが表示',
        '複数プロジェクトがある場合はプロジェクト選択画面が表示',
        '確認したいプロジェクトを選択',
        'プロジェクトダッシュボードが表示される'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'プロジェクト選択カード',
          description: '契約中のプロジェクト一覧',
          location: '初期画面中央'
        },
        {
          element: 'プロジェクトステータス',
          description: '各プロジェクトの状態表示',
          location: 'カード内'
        },
        {
          element: '最終更新日時',
          description: 'データの最終更新時刻',
          location: '画面右上'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '契約情報',
          description: 'プロジェクトの契約詳細',
          link: '/contracts'
        },
        {
          name: '請求情報',
          description: '請求書と支払い状況',
          link: '/billing'
        }
      ],
      commonMistakes: [
        {
          issue: 'プロジェクトが表示されない',
          solution: 'アクセス権限が付与されているか、PMに確認してください'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'プロジェクト概要の表示',
          description: '選択したプロジェクトの情報が表示',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'プロジェクト概要の確認',
    details: {
      prerequisites: [
        'プロジェクトを選択済み',
        'ダッシュボードが表示されている'
      ],
      detailedInstructions: [
        'プロジェクト基本情報（名称、期間、予算）を確認',
        'プロジェクトの目的と成果物を確認',
        'プロジェクトマネージャーと主要メンバーを確認',
        '現在のフェーズを確認',
        '全体スケジュールを確認',
        '重要なお知らせや更新情報を確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'プロジェクトサマリーカード',
          description: '基本情報の概要表示',
          location: 'ダッシュボード上部'
        },
        {
          element: 'チームメンバーリスト',
          description: '担当コンサルタントの一覧',
          location: '画面右側'
        },
        {
          element: 'フェーズインジケーター',
          description: '現在の進行フェーズ',
          location: 'タイムライン上'
        },
        {
          element: 'お知らせパネル',
          description: '重要な更新情報',
          location: '画面上部の帯状エリア'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'プロジェクト憲章',
          description: 'プロジェクトの詳細定義書',
          link: '/documents/charter'
        },
        {
          name: 'コミュニケーション計画',
          description: '報告・連絡体制',
          link: '/documents/communication-plan'
        }
      ],
      commonMistakes: [
        {
          issue: '古い情報を見ている',
          solution: '最終更新日時を確認し、必要に応じてリフレッシュ'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '進捗状況の詳細確認',
          description: 'より詳細な進捗情報へ',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '定期報告書で確認したい場合',
          method: '月次/週次レポートをダウンロード',
          steps: [
            'レポートメニューにアクセス',
            '期間と形式を選択',
            'PDFまたはPowerPointでダウンロード',
            'オフラインで確認'
          ],
          pros: ['詳細な情報を含む', 'オフラインで閲覧可能'],
          cons: ['リアルタイムではない', '過去の時点の情報']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '進捗率・マイルストーン達成状況',
    details: {
      prerequisites: [
        'プロジェクト概要を確認済み',
        '進捗詳細画面にアクセス可能'
      ],
      detailedInstructions: [
        '全体進捗率のゲージを確認',
        'フェーズ別の進捗状況を確認',
        'マイルストーン一覧と達成状況を確認',
        '遅延しているマイルストーンがないか確認',
        '今後のマイルストーン予定を確認',
        '進捗に関するコメントや説明を読む',
        '前回報告からの変化を確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '進捗率ゲージ',
          description: '全体進捗をパーセント表示',
          location: '画面上部中央'
        },
        {
          element: 'マイルストーンタイムライン',
          description: '時系列でマイルストーンを表示',
          location: '画面中央'
        },
        {
          element: '達成/未達成アイコン',
          description: '各マイルストーンの状態',
          location: 'タイムライン上の各点'
        },
        {
          element: '遅延警告',
          description: '予定から遅れている項目',
          location: '該当項目に赤色表示'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '詳細スケジュール',
          description: 'ガントチャートで詳細確認',
          link: '/schedule/gantt'
        },
        {
          name: '変更履歴',
          description: 'スケジュール変更の記録',
          link: '/history/schedule'
        }
      ],
      commonMistakes: [
        {
          issue: '表面的な進捗率だけで判断',
          solution: '重要なマイルストーンの達成状況も必ず確認'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '成果物の確認',
          description: '完成した成果物をレビュー',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '成果物のレビュー',
    details: {
      prerequisites: [
        '成果物が提出されていること',
        'ダウンロード権限があること'
      ],
      detailedInstructions: [
        '成果物一覧画面にアクセス',
        'フェーズやカテゴリでフィルタリング',
        '確認したい成果物を選択',
        'オンラインプレビューまたはダウンロード',
        '成果物の内容を確認',
        'バージョン履歴を確認',
        'レビューコメントを確認',
        '必要に応じてフィードバックを記載'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '成果物リスト',
          description: '提出された成果物の一覧',
          location: '画面中央'
        },
        {
          element: 'プレビューボタン',
          description: 'ブラウザ内で内容確認',
          location: '各成果物の右側'
        },
        {
          element: 'ダウンロードボタン',
          description: 'ローカルに保存',
          location: 'プレビューボタンの隣'
        },
        {
          element: 'バージョン履歴',
          description: '過去のバージョン一覧',
          location: '成果物詳細画面'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'レビュー機能',
          description: 'オンラインでコメント付与',
          link: '/review/documents'
        },
        {
          name: '承認ワークフロー',
          description: '成果物の承認プロセス',
          link: '/approval/deliverables'
        }
      ],
      commonMistakes: [
        {
          issue: '最新版でない成果物を確認',
          solution: 'バージョン番号と更新日時を必ず確認'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'フィードバック送信',
          description: 'レビュー結果をPMに送信',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'フィードバックの送信',
    details: {
      prerequisites: [
        '成果物を確認済み',
        'フィードバック内容が明確'
      ],
      detailedInstructions: [
        'フィードバック送信フォームを開く',
        'フィードバックの種類を選択（承認/修正依頼/質問）',
        '具体的な内容を記載',
        '該当箇所がある場合はページ番号等を明記',
        '優先度を設定（緊急/高/中/低）',
        '必要に応じてファイルを添付',
        '送信先（PM/担当者）を確認',
        '送信ボタンをクリック',
        '送信完了通知を確認'
      ],
      fieldDescriptions: [
        {
          name: 'フィードバックタイプ',
          description: 'フィードバックの分類',
          format: '選択式',
          required: true,
          example: '承認、修正依頼、質問、提案'
        },
        {
          name: '内容',
          description: '具体的なフィードバック',
          format: 'テキスト',
          required: true
        },
        {
          name: '優先度',
          description: '対応の緊急度',
          format: '選択式',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'フィードバックフォーム',
          description: '入力画面',
          location: 'モーダルまたは別画面'
        },
        {
          element: 'テンプレート選択',
          description: 'よく使う文言のテンプレート',
          location: 'フォーム上部'
        },
        {
          element: '送信確認',
          description: '送信前の最終確認',
          location: '送信ボタンクリック後'
        },
        {
          element: '履歴表示',
          description: '過去のフィードバック',
          location: '画面下部'
        }
      ],
      validationRules: [
        {
          field: '内容',
          rule: '10文字以上',
          errorMessage: 'フィードバック内容を具体的に記載してください'
        }
      ],
      relatedFeatures: [
        {
          name: 'フィードバック履歴',
          description: '過去のやり取りを確認',
          link: '/feedback/history'
        },
        {
          name: 'エスカレーション',
          description: '重要事項の上申',
          link: '/escalation'
        }
      ],
      commonMistakes: [
        {
          issue: '曖昧なフィードバック',
          solution: '具体的な箇所と改善案を明記'
        },
        {
          issue: '優先度の設定ミス',
          solution: 'プロジェクトへの影響度で判断'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: '送信',
          description: 'フィードバックを送信'
        }
      ],
      nextActions: [
        {
          action: 'PMからの返答待ち',
          description: '通知またはメールで返答',
          automatic: true
        },
        {
          action: '次回ミーティング',
          description: '詳細な議論が必要な場合',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '緊急の場合や詳細な議論が必要な場合',
          method: 'Web会議での直接相談',
          steps: [
            'PMにメールまたは電話で連絡',
            'Web会議の日程調整',
            '画面共有しながら説明',
            '議事録の作成と共有'
          ],
          pros: ['迅速な意思疎通', '詳細な議論が可能'],
          cons: ['スケジュール調整が必要', '記録が残りにくい']
        }
      ]
    }
  }
]