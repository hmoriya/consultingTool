import type { DetailedStep } from '../use-case-details'

export const KNOWLEDGE_EXPERT_DETAILS: DetailedStep[] = [
  {
    stepNumber: 1,
    basicDescription: 'エキスパート検索画面を開く',
    details: {
      prerequisites: [
        'システムにログインしていること',
        '相談したい分野や課題が明確'
      ],
      detailedInstructions: [
        'ナレッジ管理から「エキスパート検索」を選択',
        'エキスパート検索画面が表示される',
        '専門分野別にエキスパートが分類されている',
        'オンライン状態のエキスパートが優先表示'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'エキスパート検索メニュー',
          description: '専門家検索への入口',
          location: 'ナレッジ管理内'
        },
        {
          element: '専門分野カテゴリ',
          description: '分野別の分類',
          location: '左サイドバー'
        },
        {
          element: 'オンラインステータス',
          description: '対応可能状態の表示',
          location: 'プロフィールカード内'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'エキスパート登録',
          description: '自分の専門性を登録',
          link: '/expert/register'
        }
      ],
      commonMistakes: [
        {
          issue: '専門分野を絞りすぎて該当者なし',
          solution: '関連分野も含めて検索'
        }
      ],
      shortcuts: [
        {
          keys: 'Ctrl + E',
          action: 'エキスパート検索',
          description: 'クイック検索を開く'
        }
      ],
      nextActions: [
        {
          action: '検索条件の入力',
          description: '専門分野やスキルで絞り込み',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 2,
    basicDescription: '専門分野・スキルで検索',
    details: {
      prerequisites: [
        '相談したい内容が明確になっている'
      ],
      detailedInstructions: [
        '検索バーにキーワードを入力',
        '専門分野のタグから選択も可能',
        'スキルレベル（初級〜エキスパート）で絞り込み',
        '経験年数でフィルタリング',
        '資格・認定でも検索可能',
        '言語や地域で絞り込み（グローバル対応）',
        '評価レートでソート'
      ],
      fieldDescriptions: [
        {
          name: '検索キーワード',
          description: '専門分野やスキル',
          format: 'テキスト',
          required: false,
          example: 'アジャイル開発、AWS、データ分析'
        },
        {
          name: 'レベルフィルター',
          description: '専門性のレベル',
          format: '選択式',
          required: false
        },
        {
          name: '対応可能時間',
          description: '相談可能な時間帯',
          format: '時間範囲',
          required: false
        }
      ],
      uiElements: [
        {
          element: '詳細検索パネル',
          description: '高度な絞り込み',
          location: '検索バー下部'
        },
        {
          element: 'スキルタグクラウド',
          description: '人気スキルの表示',
          location: '右サイドバー'
        },
        {
          element: 'フィルターチップ',
          description: '適用中の条件表示',
          location: '検索結果上部'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: 'スキルマップ',
          description: '組織のスキル分布',
          link: '/skills/map'
        }
      ],
      commonMistakes: [
        {
          issue: '一般的すぎるキーワード',
          solution: '具体的な技術名や手法を使用'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '検索結果の表示',
          description: '該当するエキスパート一覧',
          automatic: true
        }
      ],
      alternatives: [
        {
          scenario: 'AIによるマッチング',
          method: 'スマート推薦機能',
          steps: [
            '「AIマッチング」ボタンをクリック',
            '相談内容を自然文で入力',
            'AIが最適なエキスパートを推薦',
            '推薦理由も表示される'
          ],
          pros: ['最適な人材の発見', '時間短縮'],
          cons: ['完全一致は保証されない']
        }
      ]
    }
  },
  {
    stepNumber: 3,
    basicDescription: 'エキスパートプロフィール確認',
    details: {
      prerequisites: [
        '候補となるエキスパートを発見済み'
      ],
      detailedInstructions: [
        'エキスパートカードをクリック',
        '詳細プロフィールが表示される',
        '専門分野と経験年数を確認',
        '過去のプロジェクト実績を確認',
        '保有資格・認定を確認',
        '他のユーザーからの評価を確認',
        '対応可能な時間帯を確認',
        '相談料金（社内ポイント）を確認'
      ],
      fieldDescriptions: [],
      uiElements: [
        {
          element: 'プロフィールモーダル',
          description: '詳細情報の表示',
          location: 'オーバーレイ表示'
        },
        {
          element: '実績タイムライン',
          description: '経歴と実績の時系列表示',
          location: 'プロフィール内'
        },
        {
          element: '評価・レビュー',
          description: '過去の相談者からの評価',
          location: 'プロフィール下部'
        },
        {
          element: 'カレンダー表示',
          description: '対応可能時間の可視化',
          location: '右側パネル'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '類似エキスパート',
          description: '同じ分野の他の専門家',
          link: '/expert/similar'
        }
      ],
      commonMistakes: [
        {
          issue: '評価だけで判断',
          solution: '実績と専門分野も総合的に確認'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '相談リクエストの準備',
          description: '連絡を取る準備',
          automatic: false
        }
      ]
    }
  },
  {
    stepNumber: 4,
    basicDescription: '相談リクエストの送信',
    details: {
      prerequisites: [
        '相談したいエキスパートを選択済み',
        '相談内容を整理済み'
      ],
      detailedInstructions: [
        '「相談リクエスト」ボタンをクリック',
        '相談の概要を簡潔に記載',
        '希望する相談形式を選択（チャット/音声/対面）',
        '希望日時を第3希望まで入力',
        '予想所要時間を選択',
        '添付資料があればアップロード',
        '緊急度を設定',
        '送信ボタンでリクエスト送信'
      ],
      fieldDescriptions: [
        {
          name: '相談概要',
          description: '相談したい内容の要約',
          format: 'テキスト（500文字以内）',
          required: true,
          example: 'AWSでの大規模データ処理アーキテクチャについて相談したい'
        },
        {
          name: '相談形式',
          description: '希望するコミュニケーション方法',
          format: '選択式',
          required: true,
          example: 'オンライン会議（30分）'
        },
        {
          name: '希望日時',
          description: '相談可能な日時候補',
          format: '日時選択（3つまで）',
          required: true
        },
        {
          name: '背景資料',
          description: '参考資料の添付',
          format: 'ファイル',
          required: false
        }
      ],
      uiElements: [
        {
          element: 'リクエストフォーム',
          description: '相談依頼の入力',
          location: 'モーダルウィンドウ'
        },
        {
          element: '日時ピッカー',
          description: 'エキスパートの空き時間表示',
          location: 'フォーム内'
        },
        {
          element: 'テンプレート選択',
          description: 'よくある相談パターン',
          location: 'フォーム上部'
        }
      ],
      validationRules: [
        {
          field: '相談概要',
          rule: '50文字以上500文字以内',
          errorMessage: '相談内容は具体的に記載してください'
        }
      ],
      relatedFeatures: [
        {
          name: '相談履歴',
          description: '過去の相談記録',
          link: '/consultations/history'
        }
      ],
      commonMistakes: [
        {
          issue: '曖昧な相談内容',
          solution: '具体的な課題と期待する成果を明記'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: 'リクエスト送信完了',
          description: 'エキスパートに通知される',
          automatic: true
        }
      ]
    }
  },
  {
    stepNumber: 5,
    basicDescription: 'レビュー・評価の投稿',
    details: {
      prerequisites: [
        '相談が完了していること',
        'エキスパートからのサポートを受けた'
      ],
      detailedInstructions: [
        '相談履歴から該当の相談を選択',
        '「評価する」ボタンをクリック',
        '5段階評価で総合評価を選択',
        '個別項目（知識、対応、分かりやすさ）も評価',
        'コメントで具体的なフィードバックを記載',
        '今後の相談意向を選択',
        '匿名投稿のオプション確認',
        '投稿ボタンで評価を送信'
      ],
      fieldDescriptions: [
        {
          name: '総合評価',
          description: '5段階の全体評価',
          format: '星評価',
          required: true
        },
        {
          name: '評価コメント',
          description: '具体的なフィードバック',
          format: 'テキスト',
          required: false,
          example: '技術的な質問に的確に回答いただき、実装方針が明確になりました'
        },
        {
          name: '推薦度',
          description: '他の人への推薦意向',
          format: '10段階',
          required: true
        }
      ],
      uiElements: [
        {
          element: '評価フォーム',
          description: 'レビュー入力画面',
          location: 'モーダルウィンドウ'
        },
        {
          element: '星評価ウィジェット',
          description: 'クリックで評価',
          location: 'フォーム上部'
        },
        {
          element: '評価項目スライダー',
          description: '詳細評価の入力',
          location: 'フォーム中央'
        }
      ],
      validationRules: [],
      relatedFeatures: [
        {
          name: '評価ガイドライン',
          description: '公正な評価のための指針',
          link: '/guidelines/review'
        }
      ],
      commonMistakes: [
        {
          issue: '感情的な評価',
          solution: '客観的事実に基づいて評価'
        }
      ],
      shortcuts: [],
      nextActions: [
        {
          action: '評価の反映',
          description: 'エキスパートの評価に反映',
          automatic: true
        },
        {
          action: 'お礼メッセージ',
          description: '任意でお礼を送信',
          automatic: false
        }
      ],
      alternatives: [
        {
          scenario: '継続的なメンタリング希望',
          method: 'メンター登録申請',
          steps: [
            '「メンター希望」ボタンをクリック',
            'メンタリング計画を相談',
            '定期的な相談スケジュール設定',
            'メンタリング契約の締結'
          ],
          pros: ['継続的な成長支援', '深い関係構築'],
          cons: ['時間的コミットメント必要']
        }
      ]
    }
  }
]