import { test, expect } from '@playwright/test'

test.describe('Consulting Dashboard App Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('ルートページからログインページへのリダイレクト', async ({ page }) => {
    // ルートページにアクセスするとログインページにリダイレクトされる
    await expect(page).toHaveURL('http://localhost:3000/login')
    await expect(page.locator('h1')).toContainText('ログイン')
  })

  test('エグゼクティブとしてログイン', async ({ page }) => {
    // ログインフォームが表示されている
    await expect(page.locator('form')).toBeVisible()
    
    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]')
    
    // エグゼクティブダッシュボードにリダイレクトされる
    await page.waitForURL('**/dashboard/executive')
    await expect(page.locator('h1')).toContainText('エグゼクティブダッシュボード')
    
    // ポートフォリオ概要が表示されている
    await expect(page.locator('text=ポートフォリオ概要')).toBeVisible()
    await expect(page.locator('text=収益性分析')).toBeVisible()
    await expect(page.locator('text=リソース利用率')).toBeVisible()
  })

  test('PMとしてログイン', async ({ page }) => {
    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'pm@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]')
    
    // PMダッシュボードにリダイレクトされる
    await page.waitForURL('**/dashboard/pm')
    await expect(page.locator('h1')).toContainText('PMダッシュボード')
    
    // PMダッシュボードの要素が表示されている
    await expect(page.locator('text=担当プロジェクト')).toBeVisible()
    await expect(page.locator('text=タスク統計')).toBeVisible()
  })

  test('コンサルタントとしてログイン', async ({ page }) => {
    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'consultant@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]')
    
    // コンサルタントダッシュボードにリダイレクトされる
    await page.waitForURL('**/dashboard/consultant')
    await expect(page.locator('h1')).toContainText('コンサルタントダッシュボード')
    
    // タスク管理が表示されている
    await expect(page.locator('text=タスク管理')).toBeVisible()
    await expect(page.locator('text=週間カレンダー')).toBeVisible()
  })

  test('クライアントとしてログイン', async ({ page }) => {
    // メールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'client@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]')
    
    // クライアントポータルにリダイレクトされる
    await page.waitForURL('**/dashboard/client')
    await expect(page.locator('h1')).toContainText('クライアントポータル')
    
    // プロジェクト統計が表示されている
    await expect(page.locator('text=総プロジェクト数')).toBeVisible()
    await expect(page.locator('text=進行中')).toBeVisible()
  })

  test('無効な認証情報でログイン失敗', async ({ page }) => {
    // 無効なメールアドレスとパスワードを入力
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]')
    
    // エラーメッセージが表示される
    await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません')).toBeVisible()
    
    // ログインページに留まる
    await expect(page).toHaveURL('http://localhost:3000/login')
  })
})

test.describe('ナビゲーション', () => {
  test('PMダッシュボードからプロジェクト一覧へのナビゲーション', async ({ page }) => {
    // PMとしてログイン
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'pm@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // PMダッシュボードが表示される
    await page.waitForURL('**/dashboard/pm')
    
    // サイドバーのプロジェクトリンクをクリック
    await page.click('nav >> text=プロジェクト')
    
    // プロジェクト一覧ページに遷移
    await page.waitForURL('**/projects')
    await expect(page.locator('h1')).toContainText('プロジェクト一覧')
  })

  test('エグゼクティブダッシュボードからクライアント管理へのナビゲーション', async ({ page }) => {
    // エグゼクティブとしてログイン
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'exec@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // エグゼクティブダッシュボードが表示される
    await page.waitForURL('**/dashboard/executive')
    
    // サイドバーのクライアントリンクをクリック
    await page.click('nav >> text=クライアント')
    
    // クライアント一覧ページに遷移
    await page.waitForURL('**/clients')
    await expect(page.locator('h1')).toContainText('クライアント一覧')
  })
})

test.describe('ロールベースアクセス制御', () => {
  test('コンサルタントがエグゼクティブダッシュボードにアクセスできない', async ({ page }) => {
    // コンサルタントとしてログイン
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'consultant@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // コンサルタントダッシュボードが表示される
    await page.waitForURL('**/dashboard/consultant')
    
    // 直接エグゼクティブダッシュボードにアクセスしようとする
    await page.goto('http://localhost:3000/dashboard/executive')
    
    // コンサルタントダッシュボードにリダイレクトされる
    await expect(page).toHaveURL('http://localhost:3000/dashboard/consultant')
  })

  test('クライアントがPMダッシュボードにアクセスできない', async ({ page }) => {
    // クライアントとしてログイン
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'client@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // クライアントポータルが表示される
    await page.waitForURL('**/dashboard/client')
    
    // 直接PMダッシュボードにアクセスしようとする
    await page.goto('http://localhost:3000/dashboard/pm')
    
    // クライアントポータルにリダイレクトされる
    await expect(page).toHaveURL('http://localhost:3000/dashboard/client')
  })
})