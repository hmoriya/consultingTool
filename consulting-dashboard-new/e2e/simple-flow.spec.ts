import { test, expect } from '@playwright/test'

test.describe('Simple Flow Test', () => {
  test('ログインページの表示確認', async ({ page }) => {
    // ログインページに直接アクセス
    await page.goto('http://localhost:3000/login')
    
    // ページタイトルを確認
    await expect(page.locator('h1')).toContainText('ログイン')
    
    // フォーム要素の存在を確認
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(submitButton).toBeVisible()
    
    // プレースホルダーテキストを確認
    await expect(emailInput).toHaveAttribute('placeholder', 'example@company.com')
    
    // 入力フィールドに値を入力
    await emailInput.fill('exec@example.com')
    await passwordInput.fill('password123')
    
    // 入力値を確認
    await expect(emailInput).toHaveValue('exec@example.com')
    await expect(passwordInput).toHaveValue('password123')
  })

  test('ログインエラーメッセージの確認', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    // 無効な認証情報を入力
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // フォーム送信
    await page.click('button[type="submit"]')
    
    // エラーメッセージを待つ（最大5秒）
    await page.waitForSelector('text=メールアドレスまたはパスワードが正しくありません', { timeout: 5000 })
    
    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=メールアドレスまたはパスワードが正しくありません')).toBeVisible()
  })

  test('エグゼクティブログイン（デバッグ版）', async ({ page }) => {
    // ログインページに直接アクセス
    await page.goto('http://localhost:3000/login')
    
    // ページが完全にロードされるまで待つ
    await page.waitForLoadState('networkidle')
    
    // フォーム要素を取得
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    // 入力フィールドが表示されるまで待つ
    await emailInput.waitFor({ state: 'visible' })
    await passwordInput.waitFor({ state: 'visible' })
    
    // 値を入力
    await emailInput.fill('exec@example.com')
    await passwordInput.fill('password123')
    
    // 送信ボタンが有効になるまで待つ
    await expect(submitButton).toBeEnabled()
    
    // フォームを送信
    await submitButton.click()
    
    // リダイレクトを待つ（最大10秒）
    await page.waitForURL('**/dashboard/executive', { timeout: 10000 })
    
    // ダッシュボードページの要素を確認
    await expect(page.locator('h1')).toContainText('エグゼクティブダッシュボード')
  })
})