import { test, expect } from '@playwright/test'

test.describe('Working Login Tests', () => {
  test('ログインページの基本機能確認', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // ページタイトル確認
    await expect(page.locator('h1')).toContainText('アカウントにログイン')
    
    // フォーム要素の確認
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('無効な認証情報でのエラーメッセージ', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // 無効な認証情報を入力
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // フォーム送信
    await page.click('button[type="submit"]')
    
    // エラーメッセージが表示されるまで待つ
    const errorMessage = page.locator('.text-destructive').filter({ hasText: 'メールアドレスまたはパスワードが正しくありません' })
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
  })

  test('エグゼクティブとして正常にログイン', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // 正しい認証情報を入力
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // デバッグ用: 現在のURL
    console.log('Before submit:', page.url())
    
    // フォーム送信とナビゲーション待機
    await Promise.all([
      page.waitForNavigation({ timeout: 15000 }),
      page.click('button[type="submit"]')
    ])
    
    // デバッグ用: 送信後のURL
    console.log('After submit:', page.url())
    
    // ダッシュボードへのリダイレクトを確認
    await expect(page).toHaveURL(/\/dashboard\/executive/, { timeout: 5000 })
    
    // ダッシュボードコンテンツの確認
    await expect(page.locator('h1')).toContainText('エグゼクティブダッシュボード')
  })

  test('各ロールでのログインとリダイレクト', async ({ page }) => {
    const testCases = [
      { email: 'pm@example.com', password: 'password123', expectedUrl: '/dashboard/pm', title: 'PMダッシュボード' },
      { email: 'consultant@example.com', password: 'password123', expectedUrl: '/dashboard/consultant', title: 'コンサルタントダッシュボード' },
      { email: 'client@example.com', password: 'password123', expectedUrl: '/dashboard/client', title: 'クライアントポータル' }
    ]

    for (const testCase of testCases) {
      // 新しいページコンテキストでテスト
      await page.goto('http://localhost:3000/login')
      
      await page.fill('input[type="email"]', testCase.email)
      await page.fill('input[type="password"]', testCase.password)
      
      await Promise.all([
        page.waitForNavigation({ timeout: 15000 }),
        page.click('button[type="submit"]')
      ])
      
      // URLとタイトルを確認
      await expect(page).toHaveURL(new RegExp(testCase.expectedUrl))
      await expect(page.locator('h1')).toContainText(testCase.title)
      
      // ログアウト（次のテストのため）
      await page.goto('http://localhost:3000/login')
    }
  })
})

test.describe('アクセス制御テスト', () => {
  test('未認証ユーザーはダッシュボードにアクセスできない', async ({ page }) => {
    // 直接ダッシュボードにアクセス
    await page.goto('http://localhost:3000/dashboard/executive')
    
    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('http://localhost:3000/login')
  })

  test('異なるロール間のアクセス制御', async ({ page }) => {
    // コンサルタントとしてログイン
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'consultant@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ])
    
    // コンサルタントダッシュボードにいることを確認
    await expect(page).toHaveURL(/\/dashboard\/consultant/)
    
    // エグゼクティブダッシュボードにアクセスを試みる
    await page.goto('http://localhost:3000/dashboard/executive')
    
    // コンサルタントダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL(/\/dashboard\/consultant/)
  })
})