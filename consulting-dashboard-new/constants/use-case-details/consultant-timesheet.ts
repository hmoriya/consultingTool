import type { DetailedStep } from '../use-case-details'

export const CONSULTANT_TIMESHEET_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: '工数管理画面を開く',
    details: {
      prerequisites: [
        'コンサルタントロールでログインしていること',
        '当日または過去の工数入力権限があること',
        'アサインされているプロジェクトが存在すること'
      ],
      detailedInstructions: [
        '左側メニューから「工数管理」をクリック',
        'デフォルトで今週の工数入力画面が表示される',
        '過去の週を入力する場合は、上部のカレンダーで週を選択',
        '月次ビューに切り替える場合は「月次」タブをクリック'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '週次/月次切替タブ',
          description: '表示期間の単位を切り替え',
          location: '画面上部中央'
        },
        {
          element: '週選択カレンダー',
          description: '入力対象週を選択',
          location: '画面上部左側'
        },
        {
          element: '承認ステータス',
          description: '現在の週の承認状況を表示',
          location: '画面上部右側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '工数レポート',
          description: '過去の工数入力履歴と集計',
          link: '/timesheet/reports'
        },
        {
          name: 'プロジェクト一覧',
          description: 'アサインされているプロジェクトの確認',
          link: '/projects/my'
        }
      ],
      commonMistakes: [
        {
          issue: '過去の締め切られた週が編集できない',
          solution: '承認済みの週は編集不可です。修正が必要な場合はPMに相談してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + T',
          action: '工数入力画面を開く',
          description: 'どの画面からでも工数入力へ'
        }
      ],
      nextActions: [
        {
          action: '工数入力フォーム表示',
          description: '現在週の入力フォームが自動表示',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: 'プロジェクトを選択',
    details: {
      prerequisites: [
        '工数入力画面が表示されていること',
        'アクティブなプロジェクトにアサインされていること'
      ],
      detailedInstructions: [
        '「プロジェクト追加」ボタンをクリック',
        'ドロップダウンから工数を入力するプロジェクトを選択',
        '複数プロジェクトがある場合は、それぞれ追加',
        'プロジェクトが表示されない場合は、アサイン状況を確認',
        '臨時プロジェクトの場合は「その他」を選択して詳細入力'
      ],
      fieldDescriptions: [
        {
          name: 'プロジェクト',
          description: 'アサインされているプロジェクトリスト',
          format: 'ドロップダウン選択',
          required: true,
          example: 'DXP-2024 デジタル変革プロジェクト'
        },
        {
          name: 'タスク',
          description: 'プロジェクト内の具体的なタスク',
          format: 'ドロップダウンまたは自由入力',
          required: false,
          example: '要件定義、設計レビュー、コーディング'
        }
      ],
      uiElements: [
        {
          element: 'プロジェクト選択ドロップダウン',
          description: 'アサインプロジェクトのリスト',
          location: '各行の最初のセル'
        },
        {
          element: 'プロジェクト追加ボタン',
          description: '新しい行を追加',
          location: 'テーブル下部'
        },
        {
          element: '削除ボタン',
          description: '不要な行を削除',
          location: '各行の右端'
        }
      ],
      validationRules: [
        {
          field: 'プロジェクト',
          rule: '同一プロジェクトの重複不可',
          errorMessage: 'このプロジェクトは既に追加されています'
        }
      ],
      relatedFeatures: [
        {
          name: 'プロジェクト詳細',
          description: 'プロジェクトの詳細情報確認',
          link: '/projects/[id]'
        }
      ],
      commonMistakes: [
        {
          issue: 'プロジェクトがリストに表示されない',
          solution: 'プロジェクトへのアサインが完了しているかPMに確認してください'
        },
        {
          issue: '間違ったプロジェクトを選択してしまった',
          solution: '行の削除ボタンで削除して、正しいプロジェクトを選び直してください'
        }
      ],
      shortcuts: [
        {
          action: '最近のプロジェクト',
          description: '直近で入力したプロジェクトが上位に表示',
          keys: '自動ソート'
        }
      ],
      nextActions: [
        {
          action: '日別工数入力',
          description: '各日の作業時間を入力',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '日別の工数を入力',
    details: {
      prerequisites: [
        'プロジェクトが選択されていること',
        '入力する日が稼働日であること'
      ],
      detailedInstructions: [
        '各プロジェクト行の該当日のセルをクリック',
        '作業時間を0.5時間単位で入力（例: 2.5, 8.0）',
        'Tabキーで次のセルへ移動',
        '1日の合計が24時間を超えないよう注意',
        '休暇の場合は「休暇」プロジェクトを選択',
        '残業時間は通常時間と合算して入力',
        '作業内容の詳細はコメント欄に記載'
      ],
      fieldDescriptions: [
        {
          name: '工数',
          description: '実際の作業時間',
          format: '0.5時間単位、最大24時間',
          required: false,
          example: '8.0, 2.5, 0.5'
        },
        {
          name: 'コメント',
          description: '作業内容の詳細説明',
          format: '自由テキスト、200文字以内',
          required: false,
          example: '要件定義書レビュー、クライアントミーティング'
        }
      ],
      uiElements: [
        {
          element: '工数入力セル',
          description: '日別の工数を入力',
          location: 'プロジェクト行と日付列の交差点'
        },
        {
          element: '日別合計',
          description: '各日の総工数を自動計算',
          location: 'テーブル下部の合計行'
        },
        {
          element: 'プロジェクト別合計',
          description: '週間のプロジェクト別工数',
          location: '各行の右端'
        },
        {
          element: 'コメントアイコン',
          description: 'セルにコメントを追加',
          location: '各セルの右上（ホバー時表示）'
        }
      ],
      validationRules: [
        {
          field: '工数',
          rule: '0.5時間単位、0-24時間',
          errorMessage: '工数は0.5時間単位で入力してください'
        },
        {
          field: '日別合計',
          rule: '24時間以下',
          errorMessage: '1日の合計工数が24時間を超えています'
        },
        {
          field: '週間合計',
          rule: '週間稼働時間の200%以下',
          errorMessage: '週間工数が異常に多いです。入力を確認してください'
        }
      ],
      relatedFeatures: [
        {
          name: 'カレンダー連携',
          description: '会議予定から工数を自動入力',
          link: '/settings/calendar'
        },
        {
          name: 'タイマー機能',
          description: 'リアルタイムで作業時間を記録',
          link: '/timesheet/timer'
        }
      ],
      commonMistakes: [
        {
          issue: '小数点以下の入力ができない',
          solution: '0.5時間単位で入力してください（30分=0.5、15分=0.25は入力不可）'
        },
        {
          issue: '合計が8時間にならない',
          solution: '休憩時間は除外して実作業時間のみ入力してください'
        },
        {
          issue: '前週の内容をコピーしたい',
          solution: '「前週からコピー」ボタンで一括コピー可能です'
        }
      ],
      shortcuts: [
        {
          keys: 'Tab',
          action: '次のセルへ移動',
          description: '効率的な入力が可能'
        },
        {
          keys: 'Shift + Tab',
          action: '前のセルへ移動',
          description: '入力の修正時に便利'
        },
        {
          keys: 'Ctrl + C/V',
          action: 'コピー＆ペースト',
          description: '同じ値を複数セルに入力'
        }
      ],
      nextActions: [
        {
          action: '入力内容の保存',
          description: '自動保存または手動保存',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '内容を確認して保存',
    details: {
      prerequisites: [
        '必要な工数がすべて入力されていること',
        '日別・プロジェクト別合計が正しいこと'
      ],
      detailedInstructions: [
        '入力内容全体を確認（特に合計値）',
        '未入力の日がないかチェック',
        'コメントが必要な箇所に記載されているか確認',
        '「保存」ボタンをクリック（自動保存の場合は不要）',
        '保存完了メッセージを確認',
        'エラーが出た場合は、該当箇所を修正',
        '必要に応じて「下書き保存」を選択'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '保存ボタン',
          description: '入力内容を保存',
          location: '画面下部右側'
        },
        {
          element: '下書き保存ボタン',
          description: '未完成の状態で一時保存',
          location: '保存ボタンの左側'
        },
        {
          element: '自動保存インジケーター',
          description: '自動保存の状態表示',
          location: '画面上部の通知エリア'
        },
        {
          element: 'エラーメッセージ',
          description: 'バリデーションエラーの詳細',
          location: '該当セルまたは画面上部'
        }
      ],
      validationRules: [
        {
          field: '必須入力',
          rule: '稼働日はすべて入力',
          errorMessage: '稼働日に未入力があります'
        }
      ],
      relatedFeatures: [
        {
          name: '工数テンプレート',
          description: '定型的な工数パターンを保存',
          link: '/timesheet/templates'
        }
      ],
      commonMistakes: [
        {
          issue: '保存ボタンが押せない',
          solution: 'エラーメッセージを確認し、赤色表示のセルを修正してください'
        },
        {
          issue: '保存したはずなのに消えている',
          solution: '保存完了メッセージが表示されたか確認してください。ネットワークエラーの可能性もあります'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + S',
          action: '保存',
          description: '入力内容を即座に保存'
        }
      ],
      nextActions: [
        {
          action: '承認申請',
          description: '週末に自動的に承認申請される',
          automatic: true
        },
        {
          action: '印刷/エクスポート',
          description: '工数表をPDFやExcelで出力',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: '承認申請を提出',
    details: {
      prerequisites: [
        '該当週のすべての工数が入力済み',
        '合計工数が妥当な範囲内',
        '必要なコメントが記載済み'
      ],
      detailedInstructions: [
        '週の最終日（通常は金曜日）に自動で承認申請される',
        '手動で申請する場合は「承認申請」ボタンをクリック',
        '申請前の最終確認画面で内容をチェック',
        '修正が必要な場合は「戻る」で編集画面へ',
        '問題なければ「申請する」をクリック',
        'PMに承認依頼通知が自動送信される',
        '承認状況は工数管理画面でリアルタイム確認可能'
      ],
      fieldDescriptions: [
        {
          name: '申請コメント',
          description: 'PMへの補足説明',
          format: '任意、500文字以内',
          required: false,
          example: '○日は客先トラブル対応のため残業が発生しました'
        }
      ],
      uiElements: [
        {
          element: '承認申請ボタン',
          description: '承認フローを開始',
          location: '工数入力画面の右上'
        },
        {
          element: '申請確認ダイアログ',
          description: '申請内容の最終確認',
          location: '画面中央にモーダル表示'
        },
        {
          element: '承認ステータスバッジ',
          description: '未申請/承認待ち/承認済み/差戻し',
          location: '週表示の右側'
        },
        {
          element: '差戻しコメント',
          description: 'PMからのフィードバック表示',
          location: '差戻し時に画面上部に表示'
        }
      ],
      validationRules: [
        {
          field: '週間合計',
          rule: '0時間より大きい',
          errorMessage: '工数が入力されていません'
        },
        {
          field: '承認申請',
          rule: '締切日まで',
          errorMessage: '承認申請期限を過ぎています'
        }
      ],
      relatedFeatures: [
        {
          name: '承認履歴',
          description: '過去の承認履歴を確認',
          link: '/timesheet/history'
        },
        {
          name: '承認者変更',
          description: 'PMが不在時の代理承認者設定',
          link: '/settings/approval'
        }
      ],
      commonMistakes: [
        {
          issue: '承認申請を忘れてしまった',
          solution: '締切後でも「遅延申請」として提出可能です。PMに連絡してください'
        },
        {
          issue: '差戻しされたが理由がわからない',
          solution: '差戻しコメントを確認し、不明な点はPMに直接確認してください'
        },
        {
          issue: '承認されたのに修正したい',
          solution: '承認後の修正は「修正申請」から行います。PMの再承認が必要です'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: '承認申請',
          description: '確認ダイアログを表示して申請'
        }
      ],
      nextActions: [
        {
          action: '承認待ち',
          description: 'PMによる承認を待つ',
          automatic: true
        },
        {
          action: '翌週の工数入力',
          description: '次の週の工数入力画面へ',
          automatic: false
        },
        {
          action: '月次レポート確認',
          description: '月末に月次工数集計を確認',
          automatic: false
        }
      ]
    }
  }
]