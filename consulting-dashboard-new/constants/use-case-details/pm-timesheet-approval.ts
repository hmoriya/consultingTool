import type { DetailedStep } from '../use-case-details'

export const PM_TIMESHEET_APPROVAL_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'タイムシート承認画面を開く',
    details: {
      prerequisites: [
        'PMロールでログインしていること',
        'チームメンバーの工数承認権限を保有',
        '承認対象の工数が提出されていること'
      ],
      detailedInstructions: [
        '左側メニューから「工数承認」をクリック',
        'デフォルトで未承認の工数一覧が表示される',
        '承認対象期間を確認（通常は前週分）',
        '承認待ちの件数を確認',
        'フィルターで特定のメンバーやプロジェクトに絞り込み可能'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '承認待ちバッジ',
          description: '未承認件数を赤色で表示',
          location: 'メニューアイコンの右上'
        },
        {
          element: '期間選択',
          description: '承認対象週の選択',
          location: '画面上部左側'
        },
        {
          element: 'フィルターパネル',
          description: 'メンバー/プロジェクトでの絞り込み',
          location: '画面右側'
        },
        {
          element: '一括操作ボタン',
          description: '複数選択して一括承認',
          location: 'ツールバー内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '承認履歴',
          description: '過去の承認記録を確認',
          link: '/timesheet/approval-history'
        },
        {
          name: '承認ルール設定',
          description: '自動承認条件の設定',
          link: '/settings/approval-rules'
        }
      ],
      commonMistakes: [
        {
          issue: '承認期限を過ぎてしまう',
          solution: 'カレンダーに承認日をリマインダー設定し、毎週月曜日に確認'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Shift + A',
          action: '承認画面を開く',
          description: 'どの画面からでも承認画面へ'
        }
      ],
      nextActions: [
        {
          action: '未承認一覧の表示',
          description: '承認待ちの工数が一覧表示',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '未承認の工数一覧を確認',
    details: {
      prerequisites: [
        '承認画面が表示されていること',
        'メンバーが工数を提出済み'
      ],
      detailedInstructions: [
        'テーブル形式で提出された工数一覧を確認',
        'メンバー名、期間、プロジェクト、合計時間を確認',
        '承認ステータス（未承認/承認済み/差戻し）を確認',
        '提出日時と締切までの残り時間を確認',
        '異常に多い/少ない工数に注意',
        'コメント欄で特記事項を確認',
        '必要に応じてソート・フィルター機能を使用'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '工数一覧テーブル',
          description: 'メンバー別の工数サマリー',
          location: '画面中央'
        },
        {
          element: 'ステータスアイコン',
          description: '承認状態を色分け表示',
          location: '各行の左端'
        },
        {
          element: '詳細表示ボタン',
          description: '日別の詳細を展開',
          location: '各行の右端'
        },
        {
          element: '異常値ハイライト',
          description: '通常と異なる工数を強調',
          location: '該当セルが黄色/赤色表示'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '工数分析',
          description: 'メンバー別の工数傾向分析',
          link: '/analytics/timesheet'
        },
        {
          name: 'プロジェクト別集計',
          description: 'プロジェクト単位の工数集計',
          link: '/projects/timesheet-summary'
        }
      ],
      commonMistakes: [
        {
          issue: '合計時間だけで承認してしまう',
          solution: '必ず日別の内訳も確認し、不自然な入力がないかチェック'
        }
      ],
      shortcuts: [
        {
          keys: '↓/↑',
          action: '行移動',
          description: 'キーボードで一覧を移動'
        }
      ],
      nextActions: [
        {
          action: '詳細確認',
          description: '各メンバーの工数詳細をチェック',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '大量の承認が必要な場合',
          method: '条件付き一括承認',
          steps: [
            '承認ルールを事前に設定',
            '条件に合致する工数を自動抽出',
            'プレビューで確認',
            '一括承認を実行',
            '例外のみ個別確認'
          ],
          pros: ['承認作業の効率化', '一貫性のある承認'],
          cons: ['異常値を見逃すリスク', '初期設定が必要']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '工数の妥当性をチェック',
    details: {
      prerequisites: [
        '承認対象の工数を選択していること',
        'プロジェクトの作業内容を把握していること'
      ],
      detailedInstructions: [
        '詳細ボタンをクリックして日別工数を展開',
        'プロジェクト別・タスク別の内訳を確認',
        '1日の合計が適正か確認（通常8時間前後）',
        '休日出勤がある場合は事前申請と照合',
        '作業内容コメントと実際のタスクを照合',
        '他のメンバーの工数と比較して異常がないか確認',
        '前週・前月の実績と大きな乖離がないか確認',
        '必要に応じてメンバーに確認メッセージを送信'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '日別詳細ビュー',
          description: '1週間の日別工数を表示',
          location: '行を展開すると表示'
        },
        {
          element: 'タスク内訳',
          description: 'タスク別の工数配分',
          location: '詳細ビュー内'
        },
        {
          element: 'コメント表示',
          description: '作業内容の説明',
          location: '各日付セルのホバー'
        },
        {
          element: '比較グラフ',
          description: '過去実績との比較',
          location: '詳細ビュー右側'
        }
      ],
      validationRules: [
        {
          field: '1日の工数',
          rule: '24時間以下',
          errorMessage: '1日の工数が24時間を超えています'
        },
        {
          field: '週間工数',
          rule: '通常は40-50時間程度',
          errorMessage: '週間工数が異常です。確認が必要です'
        }
      ],
      relatedFeatures: [
        {
          name: 'タスク進捗確認',
          description: '関連タスクの進捗状況',
          link: '/tasks/progress'
        },
        {
          name: '勤怠データ連携',
          description: '勤怠システムとの照合',
          link: '/integration/attendance'
        }
      ],
      commonMistakes: [
        {
          issue: '形式的なチェックのみで承認',
          solution: '実際の作業内容と照らし合わせ、メンバーの状況も考慮'
        },
        {
          issue: '残業時間の見落とし',
          solution: '週40時間を大きく超える場合は、健康面も含めて確認'
        }
      ],
      shortcuts: [
        {
          action: 'クイックビュー',
          description: 'スペースキーで詳細の展開/折りたたみ',
          keys: 'Space'
        }
      ],
      nextActions: [
        {
          action: '承認/差戻しの判断',
          description: '確認結果に基づいて処理',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '承認または差戻し',
    details: {
      prerequisites: [
        '工数の内容を確認済み',
        '承認基準を満たしているか判断済み'
      ],
      detailedInstructions: [
        '問題がない場合は「承認」ボタンをクリック',
        '修正が必要な場合は「差戻し」ボタンをクリック',
        '差戻しの場合は理由を明確に記載',
        '部分承認が必要な場合は該当日のみ差戻し',
        '承認コメントで補足事項を記載（任意）',
        '承認後、メンバーに通知が自動送信される',
        '差戻しの場合は修正依頼通知が送信される',
        '承認履歴が自動的に記録される'
      ],
      fieldDescriptions: [
        {
          name: '差戻し理由',
          description: '修正が必要な理由',
          format: 'テキスト、必須',
          required: true,
          example: '○日の工数が未入力です。確認して再提出してください。'
        },
        {
          name: '承認コメント',
          description: '承認時の補足',
          format: 'テキスト、任意',
          required: false,
          example: '残業が続いているようです。体調管理に気をつけてください。'
        }
      ],
      uiElements: [
        {
          element: '承認ボタン',
          description: '工数を承認',
          location: '各行または詳細画面の右側'
        },
        {
          element: '差戻しボタン',
          description: '修正を依頼',
          location: '承認ボタンの隣'
        },
        {
          element: 'コメント入力欄',
          description: 'フィードバックを記載',
          location: 'ボタンクリック後のダイアログ'
        },
        {
          element: '一括承認',
          description: '複数選択して一括処理',
          location: 'ツールバー内'
        }
      ],
      validationRules: [
        {
          field: '差戻し理由',
          rule: '10文字以上',
          errorMessage: '差戻し理由を具体的に記載してください'
        }
      ],
      relatedFeatures: [
        {
          name: '承認テンプレート',
          description: 'よく使う差戻し理由のテンプレート',
          link: '/settings/approval-templates'
        },
        {
          name: '承認代行設定',
          description: '不在時の代理承認者設定',
          link: '/settings/approval-delegate'
        }
      ],
      commonMistakes: [
        {
          issue: '差戻し理由が不明確',
          solution: '何をどう修正すべきか具体的に記載'
        },
        {
          issue: '承認忘れによる給与計算の遅延',
          solution: '締切日にリマインダーを設定し、計画的に処理'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: '承認',
          description: '選択中の工数を承認'
        },
        {
          keys: 'Ctrl + Shift + Enter',
          action: '差戻し',
          description: '差戻しダイアログを開く'
        }
      ],
      nextActions: [
        {
          action: '承認完了通知',
          description: 'メンバーに結果を自動通知',
          automatic: true
        },
        {
          action: '月次締め処理',
          description: '月末は締め処理へ',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '月次締め処理の実行',
    details: {
      prerequisites: [
        '当月のすべての工数が承認済み',
        '月次締め権限を保有',
        '経理部門との事前調整完了'
      ],
      detailedInstructions: [
        '月次締め画面にアクセス',
        '締め対象月と対象プロジェクトを確認',
        '未承認工数がないことを確認（0件であること）',
        '締め処理前のプレビューで集計値を確認',
        'プロジェクト別工数集計を確認',
        'メンバー別稼働率を確認',
        '異常値がないか最終チェック',
        '「月次締め実行」ボタンをクリック',
        '締め処理完了後、経理部門に通知',
        '月次工数レポートをダウンロード'
      ],
      fieldDescriptions: [
        {
          name: '締め対象月',
          description: '処理する月',
          format: '年月形式',
          required: true,
          example: '2024年3月'
        }
      ],
      uiElements: [
        {
          element: '締め処理ボタン',
          description: '月次締めを実行',
          location: '画面下部中央'
        },
        {
          element: '集計プレビュー',
          description: '締め前の最終確認',
          location: '画面中央'
        },
        {
          element: '未承認件数',
          description: '残っている未承認を表示',
          location: '画面上部の警告エリア'
        },
        {
          element: '処理状況インジケーター',
          description: '締め処理の進行状況',
          location: '処理中に表示'
        }
      ],
      validationRules: [
        {
          field: '未承認件数',
          rule: '0件であること',
          errorMessage: '未承認の工数があります。すべて承認してから締め処理を行ってください'
        }
      ],
      relatedFeatures: [
        {
          name: '月次レポート',
          description: '工数分析レポートの生成',
          link: '/reports/monthly-timesheet'
        },
        {
          name: '請求データ連携',
          description: '経理システムへのデータ連携',
          link: '/integration/billing'
        }
      ],
      commonMistakes: [
        {
          issue: '締め処理後に修正依頼',
          solution: '締め前に全メンバーに最終確認を促すメールを送信'
        },
        {
          issue: '締め忘れによる経理処理の遅延',
          solution: '月末最終営業日の午前中に処理する習慣をつける'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '経理部門への通知',
          description: '締め完了を自動通知',
          automatic: true
        },
        {
          action: 'レポート配布',
          description: '月次工数レポートを関係者に送付',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '締め処理後に修正が必要になった場合',
          method: '締め処理の取り消しと再実行',
          steps: [
            '管理者権限で締め取消画面へ',
            '取消理由を記載',
            '経理部門に事前連絡',
            '締め処理を取り消し',
            '必要な修正を実施',
            '再度締め処理を実行'
          ],
          pros: ['正確なデータでの請求が可能'],
          cons: ['経理処理への影響', '履歴が残る']
        }
      ]
    }
  }
]