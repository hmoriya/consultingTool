import type { DetailedStep } from '../use-case-details'

export const EXEC_FINANCIAL_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: '財務ダッシュボードを開く',
    details: {
      prerequisites: [
        'Executiveロールでログインしていること',
        '財務データへのアクセス権限を保有していること',
        '前月の月次締めが完了していること'
      ],
      detailedInstructions: [
        'ログイン後、左側メニューから「財務分析」をクリック',
        'デフォルトで当月の財務サマリーが表示される',
        '必要に応じて表示期間を変更（月次/四半期/年度）',
        'データ更新が必要な場合は右上の「更新」ボタンをクリック'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '期間セレクター',
          description: '表示する財務データの期間を選択',
          location: '画面上部右側'
        },
        {
          element: '通貨切替',
          description: '表示通貨の切り替え（円/ドル）',
          location: '期間セレクターの左側'
        },
        {
          element: 'データ更新ボタン',
          description: '最新データに更新',
          location: '画面右上'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '財務レポート',
          description: '詳細な財務レポートのダウンロード',
          link: '/reports/financial'
        },
        {
          name: '予算設定',
          description: '年度・部門別予算の設定',
          link: '/budget/settings'
        }
      ],
      commonMistakes: [
        {
          issue: 'データが古いまま分析してしまう',
          solution: '画面右上の最終更新時刻を確認し、必要に応じて更新ボタンをクリック'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + R',
          action: 'データ更新',
          description: '表示中のデータを最新に更新'
        }
      ],
      nextActions: [
        {
          action: '財務KPI確認',
          description: '重要な財務指標が表示される',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: '財務ダッシュボードへのアクセス権限がない場合',
          method: '財務レポートの申請',
          steps: [
            'レポート申請画面へアクセス',
            '必要な財務レポートを選択',
            '閲覧理由を記載して申請',
            'CFO承認後にレポートを受領'
          ],
          pros: ['機密データへの限定的アクセス', '監査証跡が残る'],
          cons: ['リアルタイムでない', '承認に時間がかかる']
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '月次収益・利益率を確認',
    details: {
      prerequisites: [
        '財務ダッシュボードが表示されていること',
        '分析対象期間が正しく設定されていること'
      ],
      detailedInstructions: [
        '画面上部の「収益サマリー」セクションを確認',
        '売上高、営業利益、純利益の数値を確認',
        '利益率（営業利益率、純利益率）の推移を確認',
        'プロジェクト別収益の内訳を確認',
        '部門別収益貢献度を分析',
        '異常値がある場合は詳細ドリルダウン'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '収益サマリーカード',
          description: '主要な収益指標を表示',
          location: 'ダッシュボード上部'
        },
        {
          element: '収益トレンドグラフ',
          description: '月次収益の推移を視覚化',
          location: '収益サマリーの下'
        },
        {
          element: 'ドリルダウンボタン',
          description: '詳細分析画面への遷移',
          location: '各指標カードの右上'
        },
        {
          element: '部門別円グラフ',
          description: '部門別の収益構成比',
          location: '画面右側'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'プロジェクト別収益分析',
          description: '個別プロジェクトの収益性を詳細分析',
          link: '/analytics/project-revenue'
        },
        {
          name: '顧客別収益分析',
          description: 'クライアント別の収益貢献度',
          link: '/analytics/client-revenue'
        }
      ],
      commonMistakes: [
        {
          issue: '一時的な収益を恒常的なものと誤解',
          solution: '収益の内訳を確認し、一時的な要因（特別利益等）を除外して分析'
        },
        {
          issue: '利益率の低下を見逃す',
          solution: '売上高だけでなく、利益率のトレンドも必ず確認'
        }
      ],
      shortcuts: [
        {
          action: 'ホバーで詳細表示',
          description: 'グラフ上でマウスホバーすると詳細数値を表示',
          keys: 'マウス操作'
        }
      ],
      nextActions: [
        {
          action: '前月比・前年比の分析へ',
          description: '比較分析画面へ遷移',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: 'より詳細な収益分析が必要な場合',
          method: 'BIツールでの分析',
          steps: [
            'BIツール（Tableau等）にアクセス',
            '財務データソースに接続',
            'カスタムダッシュボードを作成',
            '多次元分析を実行'
          ],
          pros: ['高度な分析が可能', 'カスタマイズ性が高い'],
          cons: ['習熟が必要', '別ツールへのアクセス権限が必要']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: '前月比・前年比の分析',
    details: {
      prerequisites: [
        '当月の収益データを確認済み',
        '比較対象期間のデータが存在すること'
      ],
      detailedInstructions: [
        '「比較分析」タブをクリック',
        '比較対象を選択（前月/前四半期/前年同月）',
        '主要指標の増減率を確認',
        '増減要因の内訳を分析',
        '特異な変動がある項目を特定',
        '要因分析レポートを確認',
        '必要に応じて担当部門に詳細確認'
      ],
      fieldDescriptions: [
        {
          name: '比較対象期間',
          description: '分析の基準となる比較期間',
          format: 'ドロップダウン選択',
          required: true,
          example: '前月、前四半期、前年同月、前年同期'
        }
      ],
      uiElements: [
        {
          element: '比較分析タブ',
          description: '比較分析モードへの切り替え',
          location: '画面上部のタブメニュー'
        },
        {
          element: 'ウォーターフォールチャート',
          description: '増減要因を段階的に表示',
          location: '画面中央'
        },
        {
          element: '変化率インジケーター',
          description: '前期比の増減を％表示',
          location: '各指標の右側'
        },
        {
          element: '要因分析パネル',
          description: '増減の主要因を表示',
          location: '画面下部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'トレンド分析',
          description: '長期的なトレンドを分析',
          link: '/analytics/trends'
        },
        {
          name: '要因分析詳細',
          description: '変動要因の詳細レポート',
          link: '/reports/variance-analysis'
        }
      ],
      commonMistakes: [
        {
          issue: '季節要因を考慮せずに比較',
          solution: '前年同月比も併せて確認し、季節性を考慮した分析を行う'
        },
        {
          issue: '一時的要因と恒常的要因の混同',
          solution: '要因分析レポートで、一時的/恒常的要因を区別して確認'
        }
      ],
      shortcuts: [
        {
          keys: '←/→',
          action: '期間切替',
          description: '矢印キーで比較期間を素早く切り替え'
        }
      ],
      nextActions: [
        {
          action: '予実対比分析',
          description: '予算との差異分析へ進む',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '予算対実績の差異確認',
    details: {
      prerequisites: [
        '当期の予算が設定されていること',
        '実績データが最新であること',
        '予実管理の権限を有していること'
      ],
      detailedInstructions: [
        '「予実管理」タブを選択',
        '予算達成率の全体サマリーを確認',
        '部門別・プロジェクト別の予実対比を確認',
        '大きな乖離がある項目を特定（±10%以上）',
        '差異の要因を分析（計画差異/実行差異）',
        '修正予算の必要性を検討',
        '必要に応じて予算修正申請を開始'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: '予算達成率ゲージ',
          description: '全社予算の達成状況を視覚化',
          location: '画面上部中央'
        },
        {
          element: '予実対比テーブル',
          description: '詳細な予実データを表形式で表示',
          location: '画面中央'
        },
        {
          element: '差異ハイライト',
          description: '大きな乖離を色分けで強調',
          location: 'テーブル内（赤：マイナス、青：プラス）'
        },
        {
          element: '要因コメント',
          description: '各部門からの差異説明',
          location: 'テーブルの備考欄'
        }
      ],
      validationRules: [
        {
          field: '差異率',
          rule: '±10%を超える場合は要因説明必須',
          errorMessage: '大きな差異には説明が必要です'
        }
      ],
      relatedFeatures: [
        {
          name: '予算修正申請',
          description: '期中での予算見直し申請',
          link: '/budget/revision'
        },
        {
          name: '差異分析レポート',
          description: '詳細な差異分析レポートの作成',
          link: '/reports/variance'
        }
      ],
      commonMistakes: [
        {
          issue: '小さな差異の積み重ねを軽視',
          solution: '個別には小さくても、累積すると大きな影響になる可能性を考慮'
        },
        {
          issue: '予算の妥当性を検証しない',
          solution: '大きな差異が続く場合は、予算自体の見直しも検討'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + E',
          action: 'Excel出力',
          description: '予実対比データをExcel形式でダウンロード'
        }
      ],
      nextActions: [
        {
          action: 'アクションプラン策定',
          description: '差異への対応策を検討',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '詳細な予算シミュレーションが必要な場合',
          method: '予算シミュレーションツールを使用',
          steps: [
            '予算シミュレーション画面へアクセス',
            '変動要因（売上、コスト等）を入力',
            'What-if分析を実行',
            '複数シナリオでの影響を確認',
            '最適なアクションを決定'
          ],
          pros: ['複数シナリオの比較が可能', '影響度を定量的に把握'],
          cons: ['シミュレーション設定に時間がかかる']
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'アクションプランの策定',
    details: {
      prerequisites: [
        '予実差異の要因を特定済み',
        '関係部門との事前調整完了',
        'アクションプランの承認権限保有'
      ],
      detailedInstructions: [
        '「アクションプラン」セクションに移動',
        '対応が必要な項目をリストアップ',
        '各項目の優先度を設定（高/中/低）',
        '具体的な改善施策を入力',
        '実施期限と責任者を設定',
        '期待効果（金額）を試算',
        '関係者にレビュー依頼',
        'プラン承認後、実行を指示'
      ],
      fieldDescriptions: [
        {
          name: 'アクション名',
          description: '実施する施策の名称',
          format: '50文字以内',
          required: true,
          example: 'コスト削減プロジェクト、売上向上キャンペーン'
        },
        {
          name: '期待効果',
          description: '施策による財務インパクト',
          format: '金額（万円単位）',
          required: true,
          example: '500（500万円のコスト削減）'
        },
        {
          name: '実施期限',
          description: 'アクション完了期限',
          format: '日付形式',
          required: true
        },
        {
          name: '責任者',
          description: '実行責任者',
          format: 'ユーザー選択',
          required: true
        }
      ],
      uiElements: [
        {
          element: 'アクションプラン作成ボタン',
          description: '新規アクションの追加',
          location: 'セクション右上'
        },
        {
          element: 'プライオリティ設定',
          description: '優先度の設定インターフェース',
          location: '各アクション行'
        },
        {
          element: '進捗ステータス',
          description: 'アクションの実行状況',
          location: 'アクション一覧の右側'
        },
        {
          element: '承認ワークフロー',
          description: 'プラン承認のフロー表示',
          location: '画面下部'
        }
      ],
      validationRules: [
        {
          field: '期待効果',
          rule: '数値で入力、マイナスも可',
          errorMessage: '期待効果は数値で入力してください'
        },
        {
          field: '実施期限',
          rule: '本日以降の日付',
          errorMessage: '過去の日付は設定できません'
        }
      ],
      relatedFeatures: [
        {
          name: 'タスク管理',
          description: 'アクションを詳細タスクに分解',
          link: '/tasks'
        },
        {
          name: '効果測定',
          description: 'アクションの実際の効果を測定',
          link: '/analytics/impact'
        }
      ],
      commonMistakes: [
        {
          issue: '楽観的すぎる効果試算',
          solution: '過去の類似施策の実績を参考に、保守的に見積もる'
        },
        {
          issue: 'アクションの具体性不足',
          solution: '「売上向上」ではなく「○○地域での販促キャンペーン」など具体的に'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + A',
          action: '新規アクション追加',
          description: 'アクション追加フォームを開く'
        }
      ],
      nextActions: [
        {
          action: 'アクション実行モニタリング',
          description: '設定したアクションの進捗管理画面へ',
          automatic: false
        },
        {
          action: '月次財務会議の準備',
          description: '分析結果とアクションプランを報告資料にまとめる',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '緊急対応が必要な場合',
          method: '緊急対策会議の開催',
          steps: [
            '関係役員に緊急会議を要請',
            '財務状況と課題を簡潔に説明',
            '複数の対応オプションを提示',
            '即座に意思決定',
            '実行チームを編成して対応開始'
          ],
          pros: ['迅速な対応が可能', 'トップダウンでの推進力'],
          cons: ['十分な分析時間がない', '一時的な対処になりがち']
        }
      ]
    }
  }
]