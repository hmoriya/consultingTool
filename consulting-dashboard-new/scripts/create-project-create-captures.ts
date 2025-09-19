#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

const USE_CASE = 'pm-project-create'
const STEPS = [
  {
    title: 'プロジェクト作成画面',
    content: ['新規プロジェクト', '基本情報入力フォーム', 'テンプレート選択']
  },
  {
    title: '基本情報入力',
    content: ['プロジェクト名', '開始日・終了日', '予算設定', 'クライアント選択']
  },
  {
    title: 'チームメンバーアサイン',
    content: ['メンバー検索', 'ロール設定', '稼働率確認', 'アサイン確定']
  },
  {
    title: 'マイルストーン設定',
    content: ['フェーズ設定', 'マイルストーン登録', '成果物定義', 'タスク作成']
  },
  {
    title: 'キックオフ設定',
    content: ['会議日時設定', '参加者選択', 'アジェンダ作成', '通知送信']
  }
]

function createSVG(step: number, stepInfo: typeof STEPS[0]) {
  return `<svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800">
  <!-- 背景 -->
  <rect width="1280" height="800" fill="#f3f4f6"/>
  
  <!-- ヘッダー -->
  <rect width="1280" height="64" fill="#1f2937"/>
  <text x="20" y="40" font-family="Arial, sans-serif" font-size="20" fill="#f9fafb">コンサルティングダッシュボード - 新規プロジェクト作成</text>
  
  <!-- サイドバー -->
  <rect x="0" y="64" width="256" height="736" fill="#374151"/>
  <rect x="20" y="84" width="216" height="40" fill="#4b5563" rx="8"/>
  <text x="40" y="108" font-family="Arial, sans-serif" font-size="14" fill="#f9fafb">プロジェクト管理</text>
  
  <!-- メインコンテンツ -->
  <rect x="276" y="84" width="988" height="696" fill="#ffffff" rx="8"/>
  
  <!-- ステップインジケーター -->
  <g transform="translate(296, 104)">
    ${[1, 2, 3, 4, 5].map((i) => `
      <circle cx="${(i - 1) * 200 + 20}" cy="20" r="20" fill="${i <= step ? '#3b82f6' : '#e5e7eb'}" />
      <text x="${(i - 1) * 200 + 20}" y="25" text-anchor="middle" font-family="Arial" font-size="16" fill="${i <= step ? '#ffffff' : '#6b7280'}">${i}</text>
      ${i < 5 ? `<line x1="${(i - 1) * 200 + 40}" y1="20" x2="${i * 200}" y2="20" stroke="${i < step ? '#3b82f6' : '#e5e7eb'}" stroke-width="2"/>` : ''}
    `).join('')}
  </g>
  
  <!-- ステップタイトル -->
  <text x="296" y="180" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#1f2937">${stepInfo.title}</text>
  
  <!-- コンテンツエリア -->
  ${stepInfo.content.map((item, index) => `
    <g transform="translate(296, ${220 + index * 120})">
      <rect width="600" height="80" fill="#f9fafb" rx="8" stroke="#e5e7eb" stroke-width="1"/>
      <text x="20" y="45" font-family="Arial, sans-serif" font-size="16" fill="#374151">${item}</text>
    </g>
  `).join('')}
  
  <!-- アクションボタン -->
  <g transform="translate(296, 680)">
    ${step > 1 ? '<rect x="0" y="0" width="100" height="40" fill="#ffffff" stroke="#d1d5db" stroke-width="1" rx="8"/><text x="50" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#374151">戻る</text>' : ''}
    <rect x="${step === 5 ? '0' : '500'}" y="0" width="120" height="40" fill="#3b82f6" rx="8"/>
    <text x="${step === 5 ? '60' : '560'}" y="25" text-anchor="middle" font-family="Arial" font-size="14" fill="#ffffff">${step === 5 ? 'プロジェクト作成' : '次へ'}</text>
  </g>
  
  <!-- 右側のヘルプパネル -->
  <g transform="translate(950, 220)">
    <rect width="294" height="400" fill="#f3f4f6" rx="8"/>
    <text x="20" y="40" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#1f2937">ヘルプ</text>
    <text x="20" y="70" font-family="Arial, sans-serif" font-size="14" fill="#4b5563">
      ${step === 1 ? 'プロジェクトの基本情報を入力します' :
        step === 2 ? 'プロジェクト名、期間、予算を設定します' :
        step === 3 ? 'チームメンバーを選択してアサインします' :
        step === 4 ? 'プロジェクトのマイルストーンを設定します' :
        'キックオフ会議の詳細を設定します'}
    </text>
  </g>
</svg>`
}

// SVGファイルを生成
const outputDir = path.join(process.cwd(), 'public/captures/pm', USE_CASE)

STEPS.forEach((stepInfo, index) => {
  const stepNumber = index + 1
  const svg = createSVG(stepNumber, stepInfo)
  const filename = path.join(outputDir, `step-${stepNumber}.svg`)
  
  fs.writeFileSync(filename, svg)
  console.log(`Created: ${filename}`)
})

console.log(`✅ Created ${STEPS.length} placeholder images for ${USE_CASE}`)