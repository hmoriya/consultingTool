import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_EDIT_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'ナレッジ記事詳細画面で編集ボタンをクリック',
    details: {
      prerequisites: [
        'ログインしていること',
        '記事の作成者であるか、Executiveロールを持っていること',
        '編集対象の記事が存在すること'
      ],
      detailedInstructions: [
        'ナレッジ管理画面から編集したい記事を検索または一覧から選択',
        '記事の詳細画面を開く',
        '画面右上の「編集」ボタンを確認',
        '「編集」ボタンをクリックして編集画面に移動'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '編集ボタン',
          description: '記事の編集権限がある場合のみ表示される青色ボタン',
          location: '記事詳細画面の右上、タイトル横のアクションボタン群'
        },
        {
          element: '記事情報表示',
          description: 'タイトル、作成者、作成日、ステータスなどの基本情報',
          location: '記事詳細画面の上部'
        },
        {
          element: 'アクセス権限表示',
          description: '現在のユーザーが編集可能かどうかの表示',
          location: '記事タイトル下部'
        }
      ],
      validationRules: [
        {
          field: '編集権限',
          rule: '記事作成者またはExecutiveロールが必要',
          errorMessage: 'この記事を編集する権限がありません'
        }
      ],
      relatedFeatures: [
        {
          name: 'ナレッジ記事作成',
          description: '新規記事の作成',
          link: '/knowledge/new'
        },
        {
          name: 'ナレッジ検索',
          description: '記事の検索と閲覧',
          link: '/knowledge'
        }
      ],
      commonMistakes: [
        {
          issue: '編集ボタンが表示されない',
          solution: '記事の作成者でない場合、Executiveロールが必要です。権限を確認してください'
        },
        {
          issue: '編集画面に遷移できない',
          solution: '記事が削除されているか、アクセス権限が変更された可能性があります'
        }
      ],
      shortcuts: [
        {
          keys: 'E',
          action: '編集モード',
          description: '記事詳細画面で「E」キーを押すと編集画面に移動'
        }
      ],
      nextActions: [
        {
          action: '編集画面への遷移',
          description: '記事編集フォームが表示される',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '記事編集フォームで各項目を修正',
    details: {
      prerequisites: [
        '編集画面が正常に表示されていること',
        '編集したい内容が明確になっていること'
      ],
      detailedInstructions: [
        'ステータス欄で記事の公開状態を変更（必要に応じて）',
        'タイトル欄で記事のタイトルを修正',
        'タグ欄で関連キーワードを追加・削除',
        '本文欄でMarkdown形式の内容を編集',
        '各フィールドの変更内容をプレビューで確認',
        '自動保存機能により途中経過が保存される'
      ],
      fieldDescriptions: [
        {
          name: 'ステータス',
          description: '記事の公開状態',
          format: 'ドロップダウン選択（下書き/レビュー中/公開済み/アーカイブ）',
          required: true,
          example: '公開済み（全員に公開）'
        },
        {
          name: 'タイトル',
          description: '記事のタイトル',
          format: 'テキスト（5文字以上100文字以内）',
          required: true,
          example: 'Next.js アプリケーションのパフォーマンス最適化手法'
        },
        {
          name: 'タグ',
          description: '記事に関連するキーワード',
          format: 'タグ入力（最大10個）',
          required: false,
          example: 'Next.js, パフォーマンス, React, フロントエンド'
        },
        {
          name: '本文',
          description: '記事のメインコンテンツ',
          format: 'Markdown形式テキスト',
          required: true,
          example: '## 概要\n最適化手法について説明します...'
        }
      ],
      uiElements: [
        {
          element: 'ステータスドロップダウン',
          description: '記事の公開状態を選択するドロップダウンメニュー',
          location: '編集フォームの最上部'
        },
        {
          element: 'タイトル入力欄',
          description: '記事タイトルを入力するテキストフィールド',
          location: 'ステータス欄の下部'
        },
        {
          element: 'タグ入力エリア',
          description: 'タグを追加・削除できる入力エリア',
          location: 'タイトル欄の下部'
        },
        {
          element: '本文エディタ',
          description: 'Markdown対応の大きなテキストエリア',
          location: 'フォームのメイン部分'
        },
        {
          element: '自動保存インジケータ',
          description: '変更内容の保存状況を表示',
          location: '画面上部に表示される通知'
        }
      ],
      validationRules: [
        {
          field: 'タイトル',
          rule: '5文字以上100文字以内',
          errorMessage: 'タイトルは5文字以上100文字以内で入力してください'
        },
        {
          field: 'タグ数',
          rule: '最大10個まで',
          errorMessage: 'タグは10個までしか設定できません'
        },
        {
          field: '本文',
          rule: '空でないこと',
          errorMessage: '本文は必須入力項目です'
        }
      ],
      relatedFeatures: [
        {
          name: 'Markdownプレビュー',
          description: '編集内容のリアルタイムプレビュー',
          link: '/help/markdown'
        },
        {
          name: 'タグ管理',
          description: 'タグの統合と管理',
          link: '/admin/tags'
        }
      ],
      commonMistakes: [
        {
          issue: 'ステータスを間違えて変更してしまう',
          solution: 'ステータス変更前に現在の状態を確認し、意図しない変更は避けてください'
        },
        {
          issue: 'タグが重複して追加される',
          solution: '既存タグと同じ名前のタグは自動的に統合されます'
        },
        {
          issue: 'Markdown記法が正しく表示されない',
          solution: 'プレビュー機能で確認しながら編集してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + S',
          action: '手動保存',
          description: '現在の編集内容を手動で保存'
        },
        {
          keys: 'Ctrl + P',
          action: 'プレビュー',
          description: 'Markdownプレビューの表示切替'
        },
        {
          keys: 'Tab',
          action: '次のフィールド',
          description: '入力フィールド間の移動'
        }
      ],
      nextActions: [
        {
          action: 'ステータス選択画面の表示',
          description: 'ステータスドロップダウンを確認',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'ステータスドロップダウンで公開状態を変更',
    details: {
      prerequisites: [
        '編集フォームが表示されていること',
        'ステータス変更の権限があること'
      ],
      detailedInstructions: [
        'ステータス欄のドロップダウンをクリック',
        '利用可能なステータスオプションを確認',
        '適切なステータスを選択',
        '各ステータスの意味を理解した上で選択'
      ],
      fieldDescriptions: [
        {
          name: '下書き',
          description: '非公開・編集中の状態',
          format: 'ステータス選択',
          required: false,
          example: '記事作成途中や大幅な修正中に使用'
        },
        {
          name: 'レビュー中',
          description: '承認待ちの状態',
          format: 'ステータス選択',
          required: false,
          example: '公開前の内容確認が必要な場合'
        },
        {
          name: '公開済み',
          description: '全員に公開されている状態',
          format: 'ステータス選択',
          required: false,
          example: '内容が確定し、全メンバーが閲覧可能'
        },
        {
          name: 'アーカイブ',
          description: '非公開・保存の状態',
          format: 'ステータス選択',
          required: false,
          example: '古い情報だが参考のため保存しておく場合'
        }
      ],
      uiElements: [
        {
          element: 'ステータスドロップダウン',
          description: '4つのステータスオプションを選択可能',
          location: '編集フォーム最上部'
        },
        {
          element: 'ステータス説明',
          description: '各ステータスの詳細説明テキスト',
          location: 'ドロップダウンの下部'
        },
        {
          element: '現在のステータス表示',
          description: '選択中のステータスがハイライト表示',
          location: 'ドロップダウン内'
        }
      ],
      validationRules: [
        {
          field: 'ステータス変更',
          rule: '適切な権限が必要',
          errorMessage: 'このステータスに変更する権限がありません'
        }
      ],
      relatedFeatures: [
        {
          name: 'レビューワークフロー',
          description: 'レビュー承認プロセスの管理',
          link: '/knowledge/review'
        },
        {
          name: '公開履歴',
          description: 'ステータス変更の履歴確認',
          link: '/knowledge/history'
        }
      ],
      commonMistakes: [
        {
          issue: 'アーカイブから公開済みに戻せない',
          solution: 'アーカイブされた記事は管理者権限が必要な場合があります'
        },
        {
          issue: 'ステータス変更の影響を理解していない',
          solution: '公開済みにすると全員が閲覧可能になることを理解してください'
        }
      ],
      shortcuts: [
        {
          keys: '矢印キー',
          action: 'ステータス選択',
          description: 'ドロップダウン内での選択移動'
        },
        {
          keys: 'Enter',
          action: 'ステータス確定',
          description: '選択したステータスを確定'
        }
      ],
      nextActions: [
        {
          action: '更新ボタンクリック',
          description: '変更内容を保存するためのボタン操作',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '承認が必要な場合',
          method: 'レビュー中ステータスを使用',
          steps: [
            'ステータスを「レビュー中」に設定',
            'レビュアーを指定',
            '承認後に「公開済み」に変更される'
          ],
          pros: ['品質保証', '組織的な承認プロセス'],
          cons: ['公開まで時間がかかる']
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '「更新する」ボタンをクリックして変更を保存',
    details: {
      prerequisites: [
        '必要な編集作業が完了していること',
        'すべての必須フィールドが入力されていること',
        'バリデーションエラーがないこと'
      ],
      detailedInstructions: [
        '編集内容を最終確認',
        'バリデーションエラーがないことを確認',
        '画面下部の「更新する」ボタンをクリック',
        '保存処理の完了を待つ',
        '成功メッセージの確認',
        '記事詳細画面への自動リダイレクト'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '更新するボタン',
          description: '変更内容を保存する青色のボタン',
          location: '編集フォーム下部の左側'
        },
        {
          element: 'キャンセルボタン',
          description: '編集をキャンセルして戻るボタン',
          location: '更新ボタンの右側'
        },
        {
          element: '保存中インジケータ',
          description: '保存処理中のローディング表示',
          location: '更新ボタン上に一時表示'
        },
        {
          element: '成功通知',
          description: '保存完了を知らせる緑色の通知',
          location: '画面上部に一時表示'
        }
      ],
      validationRules: [
        {
          field: '全フィールド',
          rule: '必須項目がすべて入力済み',
          errorMessage: '必須項目が未入力です'
        },
        {
          field: 'ネットワーク',
          rule: 'インターネット接続が必要',
          errorMessage: 'ネットワークエラーが発生しました'
        }
      ],
      relatedFeatures: [
        {
          name: '変更履歴',
          description: '記事の編集履歴を確認',
          link: '/knowledge/history'
        },
        {
          name: '通知設定',
          description: '更新通知の設定',
          link: '/settings/notifications'
        }
      ],
      commonMistakes: [
        {
          issue: '保存ボタンを複数回クリックしてしまう',
          solution: '処理中は再クリックを避け、完了まで待ってください'
        },
        {
          issue: '保存前にブラウザを閉じてしまう',
          solution: '自動保存機能により大部分は保存されますが、明示的な保存を推奨します'
        },
        {
          issue: 'ネットワークエラーで保存できない',
          solution: 'ネットワーク接続を確認し、再度保存を試してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Enter',
          action: '更新実行',
          description: 'フォーム内のどこからでも更新を実行'
        },
        {
          keys: 'Esc',
          action: 'キャンセル',
          description: '編集をキャンセルして前の画面に戻る'
        }
      ],
      nextActions: [
        {
          action: '保存成功通知の表示',
          description: '「記事を更新しました」のメッセージ表示',
          automatic: true
        },
        {
          action: '記事詳細画面への遷移',
          description: '更新後の記事内容が表示される',
          automatic: true
        },
        {
          action: '関係者への通知送信',
          description: 'フォロワーや関係者に更新通知が送信される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '一時的に保存したい場合',
          method: '下書き保存機能を使用',
          steps: [
            'Ctrl + S で下書き保存',
            '後で編集を再開',
            '完成時に正式保存'
          ],
          pros: ['作業の中断・再開が可能', 'データ紛失を防げる'],
          cons: ['下書き状態では他者に見えない']
        },
        {
          scenario: 'エラーが発生した場合',
          method: 'エラー修正後に再保存',
          steps: [
            'エラーメッセージを確認',
            '指摘された項目を修正',
            '再度更新ボタンをクリック'
          ],
          pros: ['確実に保存できる', '品質が保たれる'],
          cons: ['修正作業が必要']
        }
      ]
    }
  }
]