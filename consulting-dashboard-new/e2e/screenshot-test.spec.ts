import { test, expect } from '@playwright/test'

test.describe('スクリーンショット確認', () => {
  test('ログインページのデザイン確認', async ({ page }) => {
    // ログインページにアクセス
    await page.goto('http://localhost:3000/login')
    
    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle')
    
    // ビューポートサイズを設定（デスクトップサイズ）
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // スクリーンショットを撮影
    await page.screenshot({ 
      path: 'login-page-desktop.png',
      fullPage: true 
    })
    
    // モバイルサイズでも確認
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ 
      path: 'login-page-mobile.png',
      fullPage: true 
    })
    
    // ページ構造を確認
    const bodyClasses = await page.locator('body').getAttribute('class')
    console.log('Body classes:', bodyClasses)
    
    // スタイルシートが読み込まれているか確認
    const stylesheets = await page.locator('link[rel="stylesheet"]').count()
    console.log('Stylesheets count:', stylesheets)
    
    // Tailwind CSSクラスが適用されているか確認
    const mainContainer = page.locator('main')
    const hasClasses = await mainContainer.count() > 0
    console.log('Main container exists:', hasClasses)
    
    if (hasClasses) {
      const mainClasses = await mainContainer.getAttribute('class')
      console.log('Main container classes:', mainClasses)
    }
  })
})