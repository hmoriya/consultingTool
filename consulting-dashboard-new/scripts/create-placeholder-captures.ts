import * as fs from 'fs'
import * as path from 'path'
import { USE_CASES } from '../constants/use-cases'

// SVGプレースホルダー画像を生成
function createPlaceholderSVG(title: string, stepNum: number, stepText: string): string {
  return `<svg width="1280" height="800" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景 -->
  <rect width="1280" height="800" fill="#f8f9fa"/>
  
  <!-- ヘッダー -->
  <rect width="1280" height="80" fill="#ffffff"/>
  <line x1="0" y1="80" x2="1280" y2="80" stroke="#e9ecef" stroke-width="1"/>
  
  <!-- タイトル -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#212529">${title}</text>
  
  <!-- ステップ番号 -->
  <text x="1130" y="50" font-family="Arial, sans-serif" font-size="18" fill="#6c757d">ステップ ${stepNum}</text>
  
  <!-- サイドバー -->
  <rect x="0" y="80" width="250" height="720" fill="#ffffff"/>
  <line x1="250" y1="80" x2="250" y2="800" stroke="#e9ecef" stroke-width="1"/>
  
  <!-- メインコンテンツエリア -->
  <rect x="280" y="110" width="970" height="660" rx="8" fill="#ffffff" stroke="#e9ecef" stroke-width="1"/>
  
  <!-- ステップ説明 -->
  <text x="310" y="150" font-family="Arial, sans-serif" font-size="16" fill="#495057" width="900">
    <tspan>${stepText}</tspan>
  </text>
  
  <!-- コンテンツプレースホルダー -->
  ${Array.from({ length: 3 }, (_, i) => `
    <rect x="${330 + (i % 3) * 300}" y="${200 + Math.floor(i / 3) * 200}" width="280" height="160" rx="4" fill="#f8f9fa" stroke="#e9ecef"/>
    <rect x="${340 + (i % 3) * 300}" y="${210 + Math.floor(i / 3) * 200}" width="260" height="20" rx="3" fill="#e9ecef"/>
    <rect x="${340 + (i % 3) * 300}" y="${240 + Math.floor(i / 3) * 200}" width="180" height="15" rx="3" fill="#e9ecef"/>
    <rect x="${340 + (i % 3) * 300}" y="${265 + Math.floor(i / 3) * 200}" width="220" height="15" rx="3" fill="#e9ecef"/>
  `).join('')}
  
  <!-- ボタンのサンプル -->
  <rect x="1100" y="710" width="120" height="40" rx="4" fill="#0d6efd"/>
  <text x="1160" y="735" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">次へ</text>
</svg>`
}

// 全ユースケースのプレースホルダーを生成
async function generateAllPlaceholders() {
  for (const useCase of USE_CASES) {
    const dir = path.join('public/captures', useCase.category, useCase.id)
    
    // ディレクトリ作成
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 各ステップのプレースホルダーを生成（最初の3ステップのみ）
    for (let i = 0; i < Math.min(useCase.steps.length, 3); i++) {
      const svg = createPlaceholderSVG(useCase.title, i + 1, useCase.steps[i])
      const filePath = path.join(dir, `step-${i + 1}.svg`)
      fs.writeFileSync(filePath, svg)
      console.log(`Created: ${filePath}`)
    }
  }
}

generateAllPlaceholders().catch(console.error)