import { test, expect } from '@playwright/test'

test.describe('Playwright MCP Verification', () => {
  test('MCP接続と基本動作確認', async ({ page }) => {
    // ホームページにアクセス
    await page.goto('http://localhost:3000')
    
    // ページが正常に読み込まれることを確認
    await expect(page).toHaveTitle(/Consulting Dashboard/)
    
    // スクリーンショットを撮影（MCP動作確認用）
    await page.screenshot({ 
      path: '.playwright-mcp/homepage-mcp-test.png',
      fullPage: true 
    })
    
    console.log('✅ MCP基本動作確認完了')
  })

  test('ログインページMCP動作確認', async ({ page }) => {
    // ログインページにアクセス
    await page.goto('http://localhost:3000/login')
    
    // ページ要素の確認
    await expect(page.locator('h1')).toContainText('アカウントにログイン')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // スクリーンショット撮影
    await page.screenshot({ 
      path: '.playwright-mcp/login-page-mcp-test.png',
      fullPage: true 
    })
    
    console.log('✅ ログインページMCP動作確認完了')
  })

  test('テストユーザーでのログイン動作確認', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // エグゼクティブユーザーでログイン
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // ログイン実行
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }),
      page.click('button[type="submit"]')
    ])
    
    // ダッシュボードに正常にリダイレクトされることを確認
    await expect(page).toHaveURL(/\/dashboard\/executive/)
    await expect(page.locator('h1')).toContainText('エグゼクティブダッシュボード')
    
    // ダッシュボードのスクリーンショット
    await page.screenshot({ 
      path: '.playwright-mcp/executive-dashboard-mcp-test.png',
      fullPage: true 
    })
    
    console.log('✅ ログイン機能MCP動作確認完了')
  })
})