import type { DetailedStep } from '../use-case-details'

export const COMMON_NOTIFICATION_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: '通知アイコンをクリック',
    details: {
      prerequisites: [
        'システムにログインしていること',
        '通知を受信していること',
        '通知機能が有効になっていること'
      ],
      detailedInstructions: [
        'ヘッダー右上の通知アイコンを確認',
        '赤い数字バッジで未読件数を確認',
        'アイコンをクリックして通知パネルを開く',
        '通知パネルが画面右側にスライド表示される'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '通知アイコン',
          description: 'ベルのアイコンで未読数表示',
          location: 'ヘッダー右上'
        },
        {
          element: '未読バッジ',
          description: '赤色の円形で数字表示',
          location: '通知アイコンの右上'
        },
        {
          element: '通知パネル',
          description: 'スライド式の通知一覧',
          location: '画面右側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '通知設定',
          description: '通知の種類と頻度を管理',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: '通知を無効化して重要な情報を見逃す',
          solution: '最低限の重要通知は有効にしておく'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + N',
          action: '通知パネル表示',
          description: '通知パネルをトグル'
        }
      ],
      nextActions: [
        {
          action: '通知一覧の表示',
          description: '最新の通知が時系列で表示',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '未読通知の一覧確認',
    details: {
      prerequisites: [
        '通知パネルが開いていること',
        '未読通知が存在すること'
      ],
      detailedInstructions: [
        '通知は新しい順に上から表示される',
        '各通知のタイプアイコンを確認',
        '通知の概要テキストを読む',
        '重要度（緊急/高/中/低）を確認',
        '発信元（システム/ユーザー名）を確認',
        '受信時刻を確認',
        'カテゴリでフィルタリング（承認待ち/メンション等）'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '通知カード',
          description: '個別の通知情報',
          location: 'パネル内リスト'
        },
        {
          element: 'タイプアイコン',
          description: '通知の種類を示すアイコン',
          location: '各通知の左端'
        },
        {
          element: '重要度インジケーター',
          description: '色で重要度を表示',
          location: '通知カードの枠線'
        },
        {
          element: 'フィルタータブ',
          description: '通知の種類で絞り込み',
          location: 'パネル上部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '通知履歴',
          description: '過去の通知を検索',
          link: '/notifications/history'
        }
      ],
      commonMistakes: [
        {
          issue: '重要度の低い通知に気を取られる',
          solution: 'フィルターで重要な通知を優先的に確認'
        }
      ],
      shortcuts: [
        {
          keys: '↑/↓',
          action: '通知間移動',
          description: 'キーボードで通知を選択'
        }
      ],
      nextActions: [
        {
          action: '個別通知の選択',
          description: '詳細を確認したい通知を選ぶ',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '大量の通知を効率的に処理したい場合',
          method: 'バッチ処理機能',
          steps: [
            '「すべて選択」をクリック',
            'または特定カテゴリを選択',
            '一括既読または一括アーカイブ',
            '重要な通知のみ個別確認'
          ],
          pros: ['時間短縮', '効率的な処理'],
          cons: ['重要な通知を見逃すリスク']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '詳細画面への遷移',
    details: {
      prerequisites: [
        '確認したい通知を選択済み',
        '該当ページへのアクセス権限がある'
      ],
      detailedInstructions: [
        '通知カードをクリック',
        '該当する画面へ自動的に遷移',
        '遷移先は通知の種類により異なる',
        '承認通知→承認画面',
        'タスク通知→タスク詳細',
        'メッセージ通知→該当メッセージ',
        '遷移後、自動的に該当箇所がハイライトされる'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '遷移リンク',
          description: '通知カード全体がクリック可能',
          location: '通知カード'
        },
        {
          element: '詳細表示ボタン',
          description: '別の方法で詳細へ',
          location: '通知カード右端'
        },
        {
          element: 'ハイライト表示',
          description: '遷移先で該当箇所を強調',
          location: '遷移先画面'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'ブレッドクラム',
          description: '通知から来た経路を表示',
          link: '/navigation/breadcrumb'
        }
      ],
      commonMistakes: [
        {
          issue: '詳細を確認せずに既読にする',
          solution: '必ず遷移して内容を確認してから既読に'
        }
      ],
      shortcuts: [
        {
          keys: 'Enter',
          action: '詳細へ遷移',
          description: '選択中の通知の詳細へ'
        }
      ],
      nextActions: [
        {
          action: '必要なアクション実行',
          description: '承認や返信など',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '必要なアクション実行',
    details: {
      prerequisites: [
        '通知内容を確認済み',
        'アクションの内容を理解している'
      ],
      detailedInstructions: [
        '通知の種類に応じたアクションを実行',
        '承認依頼→承認/却下の判断',
        'タスク割当→タスクの確認と着手',
        'メンション→返信や対応',
        'リマインド→期限内の対応',
        'システム通知→設定変更等',
        'アクション完了後、通知が自動的に既読になる'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'アクションボタン',
          description: '承認/却下等のボタン',
          location: '詳細画面内'
        },
        {
          element: '返信フォーム',
          description: 'コメントや返信入力',
          location: '画面下部'
        },
        {
          element: '完了確認',
          description: 'アクション完了の通知',
          location: '画面上部に一時表示'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'アクション履歴',
          description: '実行したアクションの記録',
          link: '/history/actions'
        }
      ],
      commonMistakes: [
        {
          issue: 'アクションを後回しにして忘れる',
          solution: 'すぐに対応できない場合はリマインダー設定'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '通知の既読処理',
          description: '対応済み通知を整理',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '即座に対応できない場合',
          method: 'スヌーズ機能を使用',
          steps: [
            '通知の「･･･」メニューをクリック',
            '「スヌーズ」を選択',
            'リマインド時間を設定',
            '指定時間後に再通知'
          ],
          pros: ['忘れ防止', '優先度管理'],
          cons: ['通知が溜まる可能性']
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '通知の既読処理',
    details: {
      prerequisites: [
        '通知内容を確認済み',
        '必要なアクションを完了済み'
      ],
      detailedInstructions: [
        '個別通知を既読にする場合はチェックマークをクリック',
        '複数選択して一括既読も可能',
        'カテゴリ単位で一括既読',
        'すべて既読にする場合は「すべて既読」ボタン',
        '重要な通知はアーカイブで保存',
        '不要な通知は削除（30日後自動削除）',
        '既読後も通知履歴から検索可能'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '既読ボタン',
          description: '個別の既読処理',
          location: '各通知の右端'
        },
        {
          element: '一括選択',
          description: '複数通知を選択',
          location: 'パネル上部'
        },
        {
          element: 'すべて既読',
          description: '全通知を一括既読',
          location: 'パネル上部右端'
        },
        {
          element: 'アーカイブ',
          description: '重要通知の保存',
          location: '通知メニュー内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '通知アーカイブ',
          description: '重要通知の長期保存',
          link: '/notifications/archive'
        },
        {
          name: '通知検索',
          description: '過去の通知を検索',
          link: '/notifications/search'
        }
      ],
      commonMistakes: [
        {
          issue: '一括既読で重要通知を見逃す',
          solution: '重要度フィルターで確認後に一括処理'
        }
      ],
      shortcuts: [
        {
          keys: 'R',
          action: '既読にする',
          description: '選択中の通知を既読に'
        },
        {
          keys: 'Ctrl + Shift + R',
          action: 'すべて既読',
          description: '全通知を既読にする'
        }
      ],
      nextActions: [
        {
          action: '通知設定の見直し',
          description: '必要に応じて通知設定を調整',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'メール通知も併用したい場合',
          method: 'メール通知設定',
          steps: [
            '設定画面の通知タブへ',
            'メール通知を有効化',
            '通知の種類と頻度を設定',
            '重要通知のみメール送信'
          ],
          pros: ['見逃し防止', 'オフラインでも確認可能'],
          cons: ['メールボックスが混雑', '重複通知']
        }
      ]
    }
  }
]