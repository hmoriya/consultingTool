import { test, expect, Page } from '@playwright/test'

test.describe('Consultant Role Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: p }) => {
    page = p
    // ログイン処理
    await page.goto('http://localhost:3000')
    await page.click('text=ログイン')
    await page.waitForLoadState('networkidle')
    
    // Consultant ユーザーでログイン
    await page.fill('input[name="email"]', 'consultant@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard/**', { timeout: 30000 })
  })

  test('Consultant should access consultant dashboard', async () => {
    // コンサルタントダッシュボードが表示されることを確認
    await expect(page.getByRole('heading', { name: 'コンサルタントダッシュボード' })).toBeVisible()
  })

  test('Consultant should see assigned tasks', async () => {
    // 担当タスクセクションが表示されることを確認
    await expect(page.getByText('担当タスク')).toBeVisible()
  })

  test('Consultant should see timesheet summary', async () => {
    // 工数サマリーが表示されることを確認
    await expect(page.getByText('今週の工数')).toBeVisible()
  })

  test('Consultant should see project participation', async () => {
    // 参加プロジェクトが表示されることを確認
    await expect(page.getByText('参加プロジェクト')).toBeVisible()
  })

  test('Consultant should access timesheet', async () => {
    // 工数管理へアクセス
    await page.click('text=工数管理')
    await page.waitForLoadState('networkidle')
    
    // 工数管理ページが表示されることを確認
    await expect(page.url()).toContain('/timesheet')
  })

  test('Consultant should see limited project access', async () => {
    // プロジェクト一覧へ移動
    await page.click('text=プロジェクト一覧')
    await page.waitForLoadState('networkidle')
    
    // 参加しているプロジェクトのみ表示されることを確認
    const projectCards = page.locator('[data-testid="project-card"]')
    const count = await projectCards.count()
    expect(count).toBeGreaterThan(0) // 少なくとも1つのプロジェクトに参加
  })

  test('Consultant should not see client management', async () => {
    // クライアント管理メニューが表示されないことを確認
    const clientMenu = page.locator('text=クライアント管理')
    await expect(clientMenu).not.toBeVisible()
  })

  test('Consultant should access messages', async () => {
    // メッセージへアクセス
    await page.click('text=メッセージ')
    await page.waitForLoadState('networkidle')
    
    // メッセージページが表示されることを確認
    await expect(page.url()).toContain('/messages')
  })

  test('Consultant should see skills', async () => {
    // スキル管理へアクセス
    await page.click('text=スキル管理')
    await page.waitForLoadState('networkidle')
    
    // スキル管理ページが表示されることを確認
    await expect(page.url()).toContain('/team/skills')
  })

  test.afterEach(async () => {
    // スクリーンショットを保存（エラー時）
    if (test.info().status !== 'passed') {
      await page.screenshot({ 
        path: `test-results/consultant-${test.info().title}-failure.png`,
        fullPage: true 
      })
    }
  })
})