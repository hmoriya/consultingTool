// ユースケースの詳細情報を定義
export interface DetailedStep {
  stepNumber: number
  basicDescription: string
  details: {
    prerequisites: string[]           // 前提条件
    detailedInstructions: string[]   // 具体的な操作手順
    fieldDescriptions: {             // 入力項目の詳細
      name: string
      description: string
      format?: string
      required: boolean
      example?: string
    }[]
    uiElements: {                    // 画面要素の説明
      element: string
      description: string
      location: string
    }[]
    validationRules: {               // バリデーションルール
      field: string
      rule: string
      errorMessage: string
    }[]
    relatedFeatures: {               // 関連機能
      name: string
      description: string
      link?: string
    }[]
    commonMistakes: {                // よくある間違い
      issue: string
      solution: string
    }[]
    shortcuts: {                     // ショートカット
      keys?: string
      action: string
      description: string
    }[]
    nextActions: {                   // 次のアクション
      action: string
      description: string
      automatic?: boolean
    }[]
    alternatives?: {                 // 代替手段
      scenario: string               // どんな場合に使うか
      method: string                 // 代替方法
      steps: string[]               // 代替手順
      pros?: string[]               // メリット
      cons?: string[]               // デメリット
    }[]
  }
}

// プロジェクト作成ユースケースの詳細例
export const PROJECT_CREATE_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'プロジェクト作成画面にアクセス',
    details: {
      prerequisites: [
        'PMまたはExecutiveロールでログインしていること',
        '組織の予算承認権限を保有していること',
        '新規プロジェクトの事前承認が完了していること'
      ],
      detailedInstructions: [
        '画面左側のメインメニューから「プロジェクト管理」をクリック',
        'プロジェクト一覧画面の右上にある青色の「新規プロジェクト作成」ボタンをクリック',
        'ポップアップメニューから「ゼロから作成」または「テンプレートから作成」を選択',
        'テンプレートを選択した場合は、類似プロジェクトを検索して選択'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '新規プロジェクト作成ボタン',
          description: '青色の目立つボタン。プラスアイコン付き',
          location: '画面右上、検索バーの右側'
        },
        {
          element: 'テンプレート選択モーダル',
          description: '過去のプロジェクトから選択可能なリスト表示',
          location: '画面中央にオーバーレイ表示'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'プロジェクトテンプレート',
          description: '過去の成功プロジェクトをテンプレートとして保存・再利用',
          link: '/templates'
        },
        {
          name: 'プロジェクト一覧',
          description: '既存プロジェクトの確認と検索',
          link: '/projects'
        }
      ],
      commonMistakes: [
        {
          issue: 'プロジェクト管理メニューが表示されない',
          solution: 'ConsultantロールではPM権限が必要です。管理者に権限付与を依頼してください'
        },
        {
          issue: '新規作成ボタンが無効化されている',
          solution: '組織の同時実行プロジェクト数上限に達している可能性があります'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + Shift + N',
          action: '新規プロジェクト作成',
          description: 'どの画面からでも新規プロジェクト作成画面を開く'
        }
      ],
      nextActions: [
        {
          action: '基本情報入力画面へ遷移',
          description: 'プロジェクトの基本情報を入力する画面が自動的に開きます',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'プロジェクト管理権限がない場合',
          method: 'プロジェクト作成依頼フォームを使用',
          steps: [
            'ヘルプデスクから「プロジェクト作成依頼」を選択',
            '必要事項を入力してPM部門に申請',
            'PM部門で承認後、プロジェクトが作成される'
          ],
          pros: ['権限がなくても申請可能', '承認プロセスが明確'],
          cons: ['作成まで時間がかかる', '自分で直接編集できない']
        },
        {
          scenario: '類似プロジェクトが既に存在する場合',
          method: '既存プロジェクトを複製',
          steps: [
            'プロジェクト一覧から類似プロジェクトを検索',
            '「複製」ボタンをクリック',
            'プロジェクト名と期間を変更して保存'
          ],
          pros: ['設定をそのまま引き継げる', '作成時間を短縮'],
          cons: ['不要な設定も複製される', '後から修正が必要']
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '基本情報（プロジェクト名、期間、予算）を入力',
    details: {
      prerequisites: [
        'プロジェクトコードの採番ルールを理解していること',
        '予算の承認範囲を把握していること',
        'クライアント情報が事前登録されていること'
      ],
      detailedInstructions: [
        'プロジェクトコード欄に組織の命名規則に従ったコードを入力',
        'プロジェクト名は正式名称を日本語で入力（50文字以内）',
        'プロジェクト概要欄に目的と成果物を簡潔に記載（200文字以内）',
        'カレンダーアイコンをクリックして開始日と終了日を選択',
        '予算金額を半角数字で入力（単位：万円）',
        'クライアント選択ドロップダウンから該当クライアントを選択',
        'プロジェクトカテゴリを選択（戦略策定/業務改善/システム導入など）',
        '必要に応じて備考欄に補足情報を入力'
      ],
      fieldDescriptions: [
        {
          name: 'プロジェクトコード',
          description: '一意のプロジェクト識別子',
          format: '英大文字3文字 + ハイフン + 4桁数字（例：DXP-2024）',
          required: true,
          example: 'DXP-2024, BPO-2025, SYS-2024'
        },
        {
          name: 'プロジェクト名',
          description: 'プロジェクトの正式名称',
          format: '全角50文字以内、特殊文字不可',
          required: true,
          example: '○○商事デジタルトランスフォーメーション推進プロジェクト'
        },
        {
          name: '予算',
          description: 'プロジェクト総予算',
          format: '半角数字、単位：万円、上限10億円',
          required: true,
          example: '5000（5千万円の場合）'
        },
        {
          name: '期間',
          description: 'プロジェクト実施期間',
          format: '開始日は本日以降、終了日は開始日の1ヶ月後以降3年以内',
          required: true,
          example: '2024/04/01 〜 2024/12/31'
        }
      ],
      uiElements: [
        {
          element: 'カレンダーピッカー',
          description: '日付選択用のカレンダーUI',
          location: '日付入力欄の右側アイコンをクリックで表示'
        },
        {
          element: '予算警告アイコン',
          description: '予算が5000万円を超えると黄色い警告マーク表示',
          location: '予算入力欄の右側'
        },
        {
          element: 'クライアント検索',
          description: '増分検索対応のドロップダウン',
          location: 'クライアント選択欄'
        }
      ],
      validationRules: [
        {
          field: 'プロジェクトコード',
          rule: '既存コードとの重複不可、指定フォーマット準拠',
          errorMessage: 'このプロジェクトコードは既に使用されています'
        },
        {
          field: '期間',
          rule: '最短1ヶ月、最長3年、開始日は本日以降',
          errorMessage: 'プロジェクト期間は1ヶ月以上3年以内で設定してください'
        },
        {
          field: '予算',
          rule: '1万円以上10億円以下、PMの承認権限範囲内',
          errorMessage: '予算金額が承認権限を超えています。上位承認者の承認が必要です'
        }
      ],
      relatedFeatures: [
        {
          name: 'クライアントマスタ',
          description: '新規クライアントの登録や既存クライアント情報の確認',
          link: '/clients'
        },
        {
          name: '予算承認ワークフロー',
          description: '大規模予算プロジェクトの承認申請',
          link: '/approval/budget'
        }
      ],
      commonMistakes: [
        {
          issue: '予算の単位を間違えて入力（円で入力してしまう）',
          solution: '単位は「万円」です。5000万円の場合は「5000」と入力'
        },
        {
          issue: 'プロジェクトコードが重複エラーになる',
          solution: 'コード採番台帳で最新の番号を確認してください'
        },
        {
          issue: '終了日が選択できない',
          solution: '開始日を先に選択してください。終了日は開始日以降のみ選択可能です'
        }
      ],
      shortcuts: [
        {
          keys: 'Tab',
          action: '次の入力欄へ移動',
          description: '効率的に入力を進められます'
        },
        {
          keys: 'Ctrl + S',
          action: '下書き保存',
          description: '入力途中の内容を一時保存'
        },
        {
          action: 'テンプレート適用',
          description: '類似プロジェクトの情報を一括コピー',
          keys: 'Ctrl + T'
        }
      ],
      nextActions: [
        {
          action: '次へボタンでチーム編成画面へ',
          description: 'プロジェクトチームのメンバーアサイン画面に遷移',
          automatic: false
        },
        {
          action: '下書き保存して後で再開',
          description: '入力内容を保存して、後から編集を再開可能',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '予算が承認権限を超える場合',
          method: 'エスカレーション申請',
          steps: [
            '「承認申請」ボタンをクリック',
            '上位承認者を選択',
            '申請理由を詳細に記載',
            '添付資料（見積書等）をアップロード',
            '承認を待つ'
          ],
          pros: ['大規模プロジェクトも実施可能', '承認履歴が残る'],
          cons: ['承認まで時間がかかる', '却下される可能性がある']
        },
        {
          scenario: 'クライアントがリストにない場合',
          method: '新規クライアント登録',
          steps: [
            '「新規クライアント追加」リンクをクリック',
            'クライアント情報を入力',
            '管理者承認を申請',
            '承認後、プロジェクト作成画面に戻る'
          ],
          pros: ['新規クライアントにも対応可能'],
          cons: ['プロジェクト作成が一時中断する']
        },
        {
          scenario: 'Excel/Wordで管理していた情報を移行する場合',
          method: 'インポート機能を使用',
          steps: [
            '「データインポート」ボタンをクリック',
            'テンプレートファイルをダウンロード',
            'Excelデータをテンプレートに転記',
            'ファイルをアップロードして自動入力'
          ],
          pros: ['大量データの入力が効率的', '入力ミスを削減'],
          cons: ['データ形式の調整が必要', 'インポートエラーの対応が必要']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'チームメンバーをアサイン',
    details: {
      prerequisites: [
        'アサイン予定メンバーの稼働状況を事前確認済み',
        'プロジェクトに必要なスキルセットを明確化済み',
        'メンバーの所属部門マネージャーから内諾取得済み'
      ],
      detailedInstructions: [
        'メンバー検索バーに名前、スキル、部門名を入力して検索',
        '検索結果から適切なメンバーの「追加」ボタンをクリック',
        'アサインしたメンバーのロールをドロップダウンから選択（PM/メンバー/レビュアー/オブザーバー）',
        '稼働率（%）を10%単位で設定（10%〜100%）',
        'アサイン期間が全期間でない場合は、カスタム期間を設定',
        '必要に応じてメンバーごとに役割説明を記載',
        'スキルマッチング機能を使って推奨メンバーを確認',
        '全メンバーの追加が完了したら「確定」ボタンをクリック'
      ],
      fieldDescriptions: [
        {
          name: 'メンバー検索',
          description: '名前、スキル、部門、資格で検索可能',
          format: '部分一致検索対応、複数キーワード可',
          required: false,
          example: 'Python 機械学習, 山田 営業'
        },
        {
          name: 'ロール',
          description: 'プロジェクト内での役割',
          format: 'PM/メンバー/レビュアー/オブザーバーから選択',
          required: true,
          example: 'PM（プロジェクトマネージャー）は1名のみ'
        },
        {
          name: '稼働率',
          description: 'このプロジェクトへの工数配分割合',
          format: '10%単位、10%〜100%',
          required: true,
          example: '80%（週5日中4日相当）'
        },
        {
          name: 'アサイン期間',
          description: 'メンバーの参画期間',
          format: 'プロジェクト期間内で設定',
          required: false,
          example: '要件定義フェーズのみ（2024/04/01〜2024/05/31）'
        }
      ],
      uiElements: [
        {
          element: 'スキルマッチングボタン',
          description: 'AIが最適なメンバーを推奨',
          location: '検索バーの右側、魔法の杖アイコン'
        },
        {
          element: '稼働状況グラフ',
          description: 'メンバーの他プロジェクト含む稼働率を可視化',
          location: '各メンバー行の右側に横棒グラフ表示'
        },
        {
          element: 'コンフリクト警告',
          description: '稼働率が100%を超える場合に赤色表示',
          location: 'メンバー名の左側に警告アイコン'
        }
      ],
      validationRules: [
        {
          field: 'PM人数',
          rule: 'PMロールは必ず1名のみ',
          errorMessage: 'PMは1名のみ設定可能です'
        },
        {
          field: '合計稼働率',
          rule: 'メンバーの全プロジェクト合計稼働率は100%以下',
          errorMessage: 'このメンバーの稼働率が100%を超えています'
        },
        {
          field: '最小メンバー数',
          rule: 'PM含めて2名以上',
          errorMessage: 'プロジェクトには最低2名以上のメンバーが必要です'
        }
      ],
      relatedFeatures: [
        {
          name: 'スキル管理',
          description: 'メンバーのスキル情報の確認と更新',
          link: '/skills'
        },
        {
          name: '稼働率レポート',
          description: '全社員の稼働状況を俯瞰',
          link: '/reports/utilization'
        },
        {
          name: 'チーム編成履歴',
          description: '過去の類似プロジェクトのチーム構成を参照',
          link: '/projects/team-history'
        }
      ],
      commonMistakes: [
        {
          issue: '優秀なメンバーが検索結果に表示されない',
          solution: '既に他プロジェクトで100%稼働の可能性があります。稼働率フィルターを調整してください'
        },
        {
          issue: 'アサイン申請が却下される',
          solution: '事前に所属部門マネージャーと調整が必要です'
        },
        {
          issue: 'スキルマッチングの推奨が的外れ',
          solution: 'プロジェクトに必要なスキルタグを詳細に設定してください'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + K',
          action: 'クイック検索',
          description: 'メンバー検索に素早くフォーカス'
        },
        {
          action: '一括インポート',
          description: 'CSVファイルから複数メンバーを一括登録',
          keys: 'Ctrl + I'
        },
        {
          action: 'チームテンプレート',
          description: '定番のチーム構成をテンプレートから選択',
          keys: 'Ctrl + Shift + T'
        }
      ],
      nextActions: [
        {
          action: 'マイルストーン設定画面へ',
          description: 'プロジェクトの主要な節目と成果物を定義',
          automatic: true
        },
        {
          action: 'アサイン承認申請',
          description: '高稼働率メンバーは自動的に承認フローへ',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: 'マイルストーンとタスクを設定',
    details: {
      prerequisites: [
        'プロジェクトのフェーズ分けが決定済み',
        '主要成果物のリストが準備済み',
        'クライアントとの合意事項が明確化済み'
      ],
      detailedInstructions: [
        'フェーズ追加ボタンでプロジェクトフェーズを作成（要件定義/設計/開発/テスト等）',
        '各フェーズにマイルストーンを設定（キックオフ/要件定義完了/設計レビュー等）',
        'マイルストーンごとに期限日を設定',
        '各マイルストーンに成果物を関連付け（要件定義書/設計書/テスト仕様書等）',
        'マイルストーン達成条件を明文化して入力',
        'タスク追加ボタンで詳細タスクを作成',
        'タスクの依存関係を設定（前提タスクを選択）',
        'ガントチャートビューで全体スケジュールを確認',
        'クリティカルパスを確認して、ボトルネックを特定'
      ],
      fieldDescriptions: [
        {
          name: 'フェーズ名',
          description: 'プロジェクトの大区分',
          format: '20文字以内',
          required: true,
          example: '要件定義フェーズ、設計フェーズ、実装フェーズ'
        },
        {
          name: 'マイルストーン名',
          description: '重要な通過点・成果物完成時点',
          format: '30文字以内',
          required: true,
          example: '要件定義書承認、基本設計完了、結合テスト完了'
        },
        {
          name: '成果物',
          description: 'マイルストーンで完成すべき成果物',
          format: 'ドキュメント名、システム名など',
          required: true,
          example: '要件定義書v1.0、画面設計書、テスト結果報告書'
        },
        {
          name: '達成条件',
          description: 'マイルストーン完了の判定基準',
          format: '具体的な条件を箇条書き',
          required: true,
          example: 'クライアントレビュー完了、全テストケース合格率95%以上'
        }
      ],
      uiElements: [
        {
          element: 'ガントチャートビュー',
          description: 'タイムライン形式でスケジュール全体を俯瞰',
          location: '画面上部のビュー切替タブ'
        },
        {
          element: 'クリティカルパス表示',
          description: '遅延が許されない重要タスクを赤色でハイライト',
          location: 'ガントチャート内'
        },
        {
          element: '依存関係線',
          description: 'タスク間の前後関係を矢印で表示',
          location: 'ガントチャート内のタスク間'
        },
        {
          element: 'マイルストーン菱形',
          description: '重要な節目を菱形アイコンで表示',
          location: 'ガントチャート内の該当日付'
        }
      ],
      validationRules: [
        {
          field: '期限日',
          rule: 'プロジェクト期間内かつ論理的な順序',
          errorMessage: 'このマイルストーンの期限が前のマイルストーンより早くなっています'
        },
        {
          field: 'タスク工数',
          rule: 'アサインメンバーの稼働時間内',
          errorMessage: 'タスクの総工数がメンバーの稼働可能時間を超えています'
        },
        {
          field: '依存関係',
          rule: '循環参照の禁止',
          errorMessage: 'タスクの依存関係に循環が発生しています'
        }
      ],
      relatedFeatures: [
        {
          name: 'WBSテンプレート',
          description: '標準的な作業分解構成図から選択',
          link: '/templates/wbs'
        },
        {
          name: '工数見積もり支援',
          description: '過去実績から工数を自動算出',
          link: '/estimation'
        },
        {
          name: 'リスク管理',
          description: '各マイルストーンのリスクを登録',
          link: '/risks'
        }
      ],
      commonMistakes: [
        {
          issue: 'マイルストーンが多すぎて管理が煩雑',
          solution: '主要な成果物完成時点のみに絞り、5〜7個程度が適切です'
        },
        {
          issue: 'バッファーなしでスケジュールを組んでしまう',
          solution: '各フェーズに10-20%のバッファーを設けてください'
        },
        {
          issue: 'タスクの粒度がバラバラ',
          solution: '1タスクは0.5〜5人日程度に統一することを推奨します'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + M',
          action: '新規マイルストーン',
          description: '素早くマイルストーンを追加'
        },
        {
          keys: 'Ctrl + G',
          action: 'ガントチャート表示',
          description: 'ビューを即座に切り替え'
        },
        {
          action: 'ドラッグ&ドロップ',
          description: 'タスクの日程を直感的に調整',
          keys: 'マウス操作'
        }
      ],
      nextActions: [
        {
          action: 'キックオフ会議設定へ',
          description: 'プロジェクト開始の会議をスケジュール',
          automatic: true
        },
        {
          action: 'タスクアサイン',
          description: '作成したタスクをチームメンバーに割り当て',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'キックオフ会議の設定',
    details: {
      prerequisites: [
        '主要ステークホルダーの特定完了',
        'プロジェクト憲章の作成完了',
        '会議室またはWeb会議の手配可能'
      ],
      detailedInstructions: [
        '会議タイトルに「[プロジェクト名]キックオフ会議」を入力',
        'カレンダーから開催日時を選択（プロジェクト開始から1週間以内推奨）',
        '会議時間を設定（通常1.5〜2時間）',
        '参加必須者にチェック（PM、主要メンバー、クライアント代表者）',
        '任意参加者を選択（ステークホルダー、関連部門）',
        '会議形式を選択（対面/Web/ハイブリッド）',
        '会議室予約または Web会議URLを設定',
        'アジェンダテンプレートから選択して編集',
        '事前配布資料をアップロード',
        '参加者への通知メールをプレビュー確認後、送信'
      ],
      fieldDescriptions: [
        {
          name: '会議タイトル',
          description: 'カレンダーに表示される会議名',
          format: '50文字以内、プロジェクト名を含む',
          required: true,
          example: 'DX推進プロジェクト キックオフ会議'
        },
        {
          name: '開催日時',
          description: '会議の開催日時',
          format: 'プロジェクト開始から1週間以内',
          required: true,
          example: '2024/04/05 10:00-12:00'
        },
        {
          name: 'アジェンダ',
          description: '会議の議題と時間配分',
          format: 'markdown形式で記載可能',
          required: true,
          example: '1. プロジェクト概要説明(30分)\n2. チーム紹介(20分)\n3. スケジュール確認(30分)'
        },
        {
          name: '会議URL',
          description: 'Web会議のアクセス情報',
          format: 'Teams/Zoom/WebEx等のURL',
          required: false,
          example: 'https://teams.microsoft.com/meet/...'
        }
      ],
      uiElements: [
        {
          element: 'カレンダービュー',
          description: '参加者の空き時間を確認',
          location: '日時選択欄の「空き時間を確認」リンク'
        },
        {
          element: 'テンプレート選択',
          description: 'アジェンダの定型フォーマット',
          location: 'アジェンダ欄の右上ボタン'
        },
        {
          element: 'ファイルアップロード',
          description: '事前配布資料の添付',
          location: '画面下部のドラッグ&ドロップエリア'
        },
        {
          element: '送信プレビュー',
          description: '招待メールの事前確認',
          location: '送信ボタンの左側「プレビュー」リンク'
        }
      ],
      validationRules: [
        {
          field: '参加者',
          rule: '必須参加者は最低2名以上',
          errorMessage: 'PMとクライアント代表者は必須です'
        },
        {
          field: '開催日時',
          rule: '営業時間内（9:00-18:00）',
          errorMessage: '営業時間外の設定です。本当に設定しますか？'
        },
        {
          field: '会議時間',
          rule: '30分以上4時間以内',
          errorMessage: '会議時間は30分〜4時間で設定してください'
        }
      ],
      relatedFeatures: [
        {
          name: '会議議事録',
          description: '会議後の議事録作成と共有',
          link: '/meetings/minutes'
        },
        {
          name: 'アクションアイテム管理',
          description: '会議で決定したタスクの追跡',
          link: '/tasks/action-items'
        },
        {
          name: '録画管理',
          description: 'Web会議の録画保存と共有',
          link: '/meetings/recordings'
        }
      ],
      commonMistakes: [
        {
          issue: 'クライアント側の参加者を招待し忘れる',
          solution: 'クライアント組織から最低2名（決裁者と実務担当者）を招待してください'
        },
        {
          issue: 'アジェンダが抽象的すぎる',
          solution: '具体的な成果物、決定事項、次のアクションを明記してください'
        },
        {
          issue: '資料の事前共有を忘れる',
          solution: '遅くとも2営業日前までに共有し、事前確認を依頼してください'
        }
      ],
      shortcuts: [
        {
          action: 'テンプレート適用',
          description: '標準アジェンダを一括適用',
          keys: 'Ctrl + Shift + A'
        },
        {
          action: '参加者一括選択',
          description: 'プロジェクトメンバー全員を選択',
          keys: 'Ctrl + A'
        },
        {
          action: 'カレンダー同期',
          description: 'Outlook/Googleカレンダーと連携',
          keys: '同期ボタンクリック'
        }
      ],
      nextActions: [
        {
          action: 'プロジェクト開始',
          description: 'ステータスが「計画中」から「実行中」に変更',
          automatic: true
        },
        {
          action: '初回進捗レポート設定',
          description: '定期進捗報告のスケジュール設定画面へ',
          automatic: false
        },
        {
          action: 'ダッシュボード確認',
          description: 'プロジェクトダッシュボードで全体を確認',
          automatic: false
        }
      ]
    }
  }
]

// 他のユースケースの詳細をインポート
import { EXECUTIVE_PORTFOLIO_DETAILS } from './use-case-details/executive-portfolio'
import { EXEC_FINANCIAL_DETAILS } from './use-case-details/exec-financial'
import { PM_PROJECT_MGMT_DETAILS } from './use-case-details/pm-project-mgmt'
import { PM_TIMESHEET_APPROVAL_DETAILS } from './use-case-details/pm-timesheet-approval'
import { CONSULTANT_TIMESHEET_DETAILS } from './use-case-details/consultant-timesheet'
import { CONSULTANT_TASK_DETAILS } from './use-case-details/consultant-task'
import { CONSULTANT_SKILL_DETAILS } from './use-case-details/consultant-skill'
import { CLIENT_PROGRESS_DETAILS } from './use-case-details/client-progress'
import { CLIENT_DOCUMENT_DETAILS } from './use-case-details/client-document'
import { COMMON_MESSAGE_DETAILS } from './use-case-details/common-message'
import { COMMON_NOTIFICATION_DETAILS } from './use-case-details/common-notification'

// 詳細情報の取得関数
export function getUseCaseDetails(useCaseId: string, stepNumber: number): DetailedStep | undefined {
  // useCaseIdに基づいて適切な詳細情報を返す
  switch (useCaseId) {
    // PM向け
    case 'pm-project-create':
      return PROJECT_CREATE_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'pm-project-mgmt':
      return PM_PROJECT_MGMT_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'pm-timesheet-approval':
      return PM_TIMESHEET_APPROVAL_DETAILS.find(detail => detail.stepNumber === stepNumber)
    
    // エグゼクティブ向け
    case 'exec-portfolio':
      return EXECUTIVE_PORTFOLIO_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'exec-financial':
      return EXEC_FINANCIAL_DETAILS.find(detail => detail.stepNumber === stepNumber)
    
    // コンサルタント向け
    case 'consultant-timesheet':
      return CONSULTANT_TIMESHEET_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'consultant-task':
      return CONSULTANT_TASK_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'consultant-skill':
      return CONSULTANT_SKILL_DETAILS.find(detail => detail.stepNumber === stepNumber)
    
    // クライアント向け
    case 'client-progress':
      return CLIENT_PROGRESS_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'client-document':
      return CLIENT_DOCUMENT_DETAILS.find(detail => detail.stepNumber === stepNumber)
    
    // 共通
    case 'common-message':
      return COMMON_MESSAGE_DETAILS.find(detail => detail.stepNumber === stepNumber)
    case 'common-notification':
      return COMMON_NOTIFICATION_DETAILS.find(detail => detail.stepNumber === stepNumber)
    
    default:
      return undefined
  }
}