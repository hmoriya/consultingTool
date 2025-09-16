// スキルタイプの定義
export const skillCategories = {
  technical: '技術スキル',
  industry: '業界知識',
  management: 'マネジメント',
  language: '語学'
} as const

export const skills = {
  technical: ['AI/ML', 'クラウド', 'データ分析', 'システム設計', 'セキュリティ'],
  industry: ['製造業', '金融', '小売', 'ヘルスケア', 'エネルギー'],
  management: ['プロジェクト管理', 'チームリーダー', '戦略立案', '変革管理'],
  language: ['英語', '中国語', '韓国語', 'スペイン語']
} as const