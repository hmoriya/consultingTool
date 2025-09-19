import { createCanvas } from 'canvas'
import * as fs from 'fs'
import * as path from 'path'
import { USE_CASES } from '../constants/use-cases'

// デモ用キャプチャを生成
function createDemoCapture(width: number, height: number, title: string, stepNum: number): Buffer {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)

  // ヘッダー
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, 80)
  ctx.fillStyle = '#e9ecef'
  ctx.fillRect(0, 80, width, 1)

  // タイトル
  ctx.fillStyle = '#212529'
  ctx.font = 'bold 24px Arial'
  ctx.fillText(title, 30, 50)

  // ステップ番号
  ctx.fillStyle = '#6c757d'
  ctx.font = '18px Arial'
  ctx.fillText(`ステップ ${stepNum}`, width - 150, 50)

  // コンテンツエリア
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(30, 110, width - 60, height - 140)
  
  // コンテンツのプレースホルダー
  ctx.fillStyle = '#e9ecef'
  for (let i = 0; i < 5; i++) {
    const y = 150 + i * 80
    ctx.fillRect(60, y, Math.random() * 300 + 200, 20)
    ctx.fillRect(60, y + 30, Math.random() * 400 + 100, 15)
  }

  return canvas.toBuffer('image/png')
}

// 全ユースケースのデモキャプチャを生成
async function generateAllDemoCaptures() {
  for (const useCase of USE_CASES) {
    const dir = path.join('public/captures', useCase.category, useCase.id)
    
    // ディレクトリ作成
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 各ステップのキャプチャを生成
    for (let i = 0; i < useCase.steps.length; i++) {
      const buffer = createDemoCapture(1280, 800, useCase.title, i + 1)
      const filePath = path.join(dir, `step-${i + 1}.png`)
      fs.writeFileSync(filePath, buffer)
      console.log(`Created: ${filePath}`)
    }
  }
}

generateAllDemoCaptures().catch(console.error)