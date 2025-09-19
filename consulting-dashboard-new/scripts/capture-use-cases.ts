import { chromium, Browser, Page } from 'playwright'
import { USE_CASES } from '../constants/use-cases'
import * as fs from 'fs'
import * as path from 'path'

// テストユーザーの認証情報
const TEST_USERS = {
  Executive: { email: 'exec@example.com', password: 'password123' },
  PM: { email: 'pm@example.com', password: 'password123' },
  Consultant: { email: 'consultant@example.com', password: 'password123' },
  Client: { email: 'client@example.com', password: 'password123' }
}

// キャプチャ設定
const CAPTURE_CONFIG = {
  viewport: { width: 1280, height: 800 },
  baseUrl: 'http://localhost:3000',
  outputDir: 'public/captures'
}

// ステップとURLのマッピング
const STEP_URL_MAPPING: Record<string, Record<number, string>> = {
  'exec-portfolio': {
    0: '/dashboard/executive',
    1: '/projects',
    2: '/dashboard/executive',
    3: '/dashboard/executive',
    4: '/reports'
  },
  'exec-financial': {
    0: '/dashboard/executive',
    1: '/dashboard/executive',
    2: '/dashboard/executive',
    3: '/dashboard/executive',
    4: '/dashboard/executive'
  },
  'pm-project-mgmt': {
    0: '/dashboard/pm',
    1: '/projects',
    2: '/tasks',
    3: '/projects',
    4: '/team/utilization'
  },
  'pm-timesheet-approval': {
    0: '/timesheet/approval',
    1: '/timesheet/approval',
    2: '/timesheet/approval',
    3: '/timesheet/approval',
    4: '/timesheet/approval'
  },
  'consultant-task': {
    0: '/dashboard/consultant',
    1: '/tasks',
    2: '/tasks',
    3: '/timesheet',
    4: '/deliverables'
  },
  'consultant-timesheet': {
    0: '/timesheet',
    1: '/timesheet',
    2: '/timesheet',
    3: '/timesheet',
    4: '/timesheet'
  },
  'consultant-skill': {
    0: '/team/skills',
    1: '/team/skills',
    2: '/team/skills',
    3: '/team/skills',
    4: '/team/skills'
  },
  'client-progress': {
    0: '/dashboard/client',
    1: '/dashboard/client',
    2: '/dashboard/client',
    3: '/deliverables',
    4: '/messages'
  },
  'client-document': {
    0: '/deliverables',
    1: '/deliverables',
    2: '/deliverables',
    3: '/deliverables',
    4: '/deliverables'
  },
  'common-message': {
    0: '/messages',
    1: '/messages',
    2: '/messages',
    3: '/messages',
    4: '/messages'
  },
  'common-notification': {
    0: '/', // 通知アイコンはどのページでも表示
    1: '/',
    2: '/',
    3: '/',
    4: '/'
  }
}

async function login(page: Page, role: string) {
  const user = TEST_USERS[role as keyof typeof TEST_USERS] || TEST_USERS.Consultant
  
  await page.goto(`${CAPTURE_CONFIG.baseUrl}/login`)
  await page.fill('input[type="email"]', user.email)
  await page.fill('input[type="password"]', user.password)
  await page.click('button[type="submit"]')
  
  // ログイン完了を待つ
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 })
  await page.waitForLoadState('networkidle')
}

async function captureUseCase(browser: Browser, useCase: typeof USE_CASES[0]) {
  const context = await browser.newContext({
    viewport: CAPTURE_CONFIG.viewport,
    deviceScaleFactor: 2 // 高解像度キャプチャ
  })
  const page = await context.newPage()
  
  try {
    // ログイン
    const mainActor = useCase.actors[0] === 'All' ? 'Consultant' : useCase.actors[0]
    await login(page, mainActor)
    
    // 各ステップのキャプチャ
    const urlMapping = STEP_URL_MAPPING[useCase.id] || {}
    
    for (let i = 0; i < useCase.steps.length; i++) {
      const stepUrl = urlMapping[i]
      if (stepUrl) {
        await page.goto(`${CAPTURE_CONFIG.baseUrl}${stepUrl}`)
        await page.waitForLoadState('networkidle')
        
        // UIが安定するまで少し待機
        await page.waitForTimeout(1000)
      }
      
      // キャプチャ保存
      const outputPath = path.join(
        CAPTURE_CONFIG.outputDir,
        useCase.category,
        useCase.id,
        `step-${i + 1}.png`
      )
      
      // ディレクトリ作成
      const dir = path.dirname(outputPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      // スクリーンショット取得
      await page.screenshot({
        path: outputPath,
        fullPage: false,
        animations: 'disabled'
      })
      
      console.log(`Captured: ${useCase.title} - Step ${i + 1}`)
    }
    
  } catch (error) {
    console.error(`Error capturing ${useCase.id}:`, error)
  } finally {
    await context.close()
  }
}

async function captureAllUseCases() {
  const browser = await chromium.launch({
    headless: false // デバッグ用に画面を表示
  })
  
  try {
    // 各ユースケースのキャプチャを生成
    for (const useCase of USE_CASES) {
      console.log(`\nCapturing use case: ${useCase.title}`)
      await captureUseCase(browser, useCase)
    }
    
    console.log('\nAll captures completed!')
    
  } finally {
    await browser.close()
  }
}

// メイン実行
if (require.main === module) {
  captureAllUseCases().catch(console.error)
}