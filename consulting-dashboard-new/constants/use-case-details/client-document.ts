import type { DetailedStep } from '../use-case-details'

export const CLIENT_DOCUMENT_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: '成果物一覧にアクセス',
    details: {
      prerequisites: [
        'クライアントロールでログインしていること',
        '成果物へのアクセス権限があること',
        'プロジェクトが選択されていること'
      ],
      detailedInstructions: [
        'プロジェクトダッシュボードから「成果物」メニューをクリック',
        '成果物一覧画面が表示される',
        'フィルターで未確認/承認待ちの成果物を絞り込み',
        '成果物のステータスを確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '成果物フィルター',
          description: 'ステータスやカテゴリで絞り込み',
          location: '画面上部'
        },
        {
          element: 'ステータスバッジ',
          description: '各成果物の状態表示',
          location: '成果物名の横'
        },
        {
          element: '新着マーク',
          description: '未確認の成果物を強調',
          location: '成果物リストの左端'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '成果物カレンダー',
          description: '提出予定の確認',
          link: '/deliverables/calendar'
        }
      ],
      commonMistakes: [
        {
          issue: '承認期限を過ぎてしまう',
          solution: '新着通知を有効にし、定期的に確認'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '成果物の選択',
          description: '確認したい成果物を選択',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '提出された成果物を確認',
    details: {
      prerequisites: [
        '確認したい成果物を選択済み',
        'ファイルへのアクセス権限がある'
      ],
      detailedInstructions: [
        '成果物の詳細情報（タイトル、説明、バージョン）を確認',
        'ファイル形式とサイズを確認',
        '提出者と提出日時を確認',
        'プレビューボタンでオンライン閲覧',
        'またはダウンロードしてローカルで確認',
        '関連資料があれば併せて確認',
        '前バージョンとの差分を確認（必要に応じて）'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '成果物詳細パネル',
          description: 'メタ情報の表示',
          location: '画面右側'
        },
        {
          element: 'プレビューエリア',
          description: 'ドキュメントの内容表示',
          location: '画面中央'
        },
        {
          element: '差分表示ボタン',
          description: '前バージョンとの比較',
          location: 'ツールバー内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'バージョン比較',
          description: '変更箇所の確認',
          link: '/documents/compare'
        }
      ],
      commonMistakes: [
        {
          issue: '詳細を確認せずに承認',
          solution: '必ず内容を精査し、要件を満たしているか確認'
        }
      ],
      shortcuts: [
        {
          keys: 'Space',
          action: 'ページ送り',
          description: 'プレビューの次ページへ'
        }
      ],
      nextActions: [
        {
          action: 'ドキュメントのダウンロード',
          description: '詳細確認のためローカル保存',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'ドキュメントのダウンロード',
    details: {
      prerequisites: [
        'ダウンロード権限があること',
        'ローカルストレージに空き容量がある'
      ],
      detailedInstructions: [
        'ダウンロードボタンをクリック',
        'ファイル形式を選択（PDF/元形式）',
        'セキュリティオプションを確認（透かし、パスワード等）',
        'ダウンロード開始',
        '完了後、ローカルで開いて確認',
        '印刷が必要な場合は印刷設定を確認',
        'オフラインレビュー用に保存'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'ダウンロードオプション',
          description: '形式とセキュリティ設定',
          location: 'ダウンロードダイアログ'
        },
        {
          element: '進捗表示',
          description: 'ダウンロード進行状況',
          location: '画面下部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'セキュアダウンロード',
          description: '機密文書の保護設定',
          link: '/security/download'
        }
      ],
      commonMistakes: [
        {
          issue: '機密文書の不適切な保管',
          solution: '社内規定に従い、適切に管理'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'レビューコメント記載',
          description: 'フィードバックの準備',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '複数人でレビューする場合',
          method: '共同レビュー機能',
          steps: [
            'レビュー参加者を招待',
            'オンラインで同時閲覧',
            'リアルタイムでコメント交換',
            '合意形成後に承認'
          ],
          pros: ['効率的な合意形成', '議論の記録が残る'],
          cons: ['スケジュール調整が必要']
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'レビューコメントの記載',
    details: {
      prerequisites: [
        '成果物の内容を確認済み',
        'フィードバック内容が整理されている'
      ],
      detailedInstructions: [
        'レビュー画面で該当箇所を選択',
        'コメントアイコンをクリック',
        'コメントの種類を選択（質問/修正依頼/承認/提案）',
        '具体的な内容を記載',
        'ページ番号や行番号を明記',
        '重要度を設定',
        'スクリーンショットを添付（必要に応じて）',
        'コメントを保存',
        '全体的なフィードバックは総評欄に記載'
      ],
      fieldDescriptions: [
        {
          name: 'コメントタイプ',
          description: 'フィードバックの分類',
          format: '選択式',
          required: true,
          example: '質問、修正依頼、承認、提案'
        },
        {
          name: 'コメント内容',
          description: '具体的なフィードバック',
          format: 'テキスト',
          required: true
        },
        {
          name: '該当箇所',
          description: 'ページや段落の指定',
          format: 'テキスト',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'コメントパネル',
          description: 'コメント入力エリア',
          location: '画面右側'
        },
        {
          element: 'ハイライトツール',
          description: '該当箇所をマーキング',
          location: 'ツールバー'
        },
        {
          element: 'コメントスレッド',
          description: '議論の履歴表示',
          location: '各コメント下部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'レビューテンプレート',
          description: 'よく使うコメントの定型文',
          link: '/templates/review'
        }
      ],
      commonMistakes: [
        {
          issue: '抽象的なフィードバック',
          solution: '具体的な修正案と理由を明記'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + M',
          action: 'コメント追加',
          description: '新規コメントを作成'
        }
      ],
      nextActions: [
        {
          action: '承認/修正依頼の決定',
          description: '最終判断を行う',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '承認または修正依頼',
    details: {
      prerequisites: [
        'レビューが完了していること',
        '承認権限を有していること',
        '判断基準が明確であること'
      ],
      detailedInstructions: [
        '全てのコメントを確認',
        '承認基準を満たしているか最終確認',
        '「承認」または「修正依頼」を選択',
        '修正依頼の場合は必須修正項目を明示',
        '承認の場合は条件付き承認も可能',
        '期限を設定（修正依頼の場合）',
        '決定理由を記載',
        '関係者への通知設定を確認',
        '「送信」ボタンで確定'
      ],
      fieldDescriptions: [
        {
          name: '判定',
          description: '承認/修正依頼/条件付き承認',
          format: '選択式',
          required: true
        },
        {
          name: '理由',
          description: '判定の根拠',
          format: 'テキスト',
          required: true
        },
        {
          name: '修正期限',
          description: '修正依頼時の期限',
          format: '日付',
          required: false
        }
      ],
      uiElements: [
        {
          element: '承認ボタン',
          description: '成果物を承認',
          location: '画面下部中央'
        },
        {
          element: '修正依頼ボタン',
          description: '修正を要求',
          location: '承認ボタンの隣'
        },
        {
          element: '判定確認ダイアログ',
          description: '最終確認画面',
          location: 'ボタンクリック後'
        }
      ],
      validationRules: [
        {
          field: '理由',
          rule: '20文字以上',
          errorMessage: '判定理由を具体的に記載してください'
        }
      ],
      relatedFeatures: [
        {
          name: '承認履歴',
          description: '過去の承認記録',
          link: '/approval/history'
        },
        {
          name: '承認ワークフロー',
          description: '多段階承認の設定',
          link: '/workflow/approval'
        }
      ],
      commonMistakes: [
        {
          issue: '条件が不明確な修正依頼',
          solution: '修正すべき点を箇条書きで明確に指示'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '承認通知の送信',
          description: 'PMと作成者に自動通知',
          automatic: true
        },
        {
          action: '次の成果物確認',
          description: '他の承認待ち成果物へ',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '判断に迷う場合',
          method: '関係者との協議',
          steps: [
            'PMに相談を依頼',
            '必要に応じて会議を設定',
            '技術的な観点から議論',
            '合意後に判定'
          ],
          pros: ['適切な判断が可能', 'リスクの低減'],
          cons: ['時間がかかる', '決定の遅延']
        }
      ]
    }
  }
]