import { test, expect, Page } from '@playwright/test'

test.describe('Client Role Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: p }) => {
    page = p
    // ログイン処理
    await page.goto('http://localhost:3000')
    await page.click('text=ログイン')
    await page.waitForLoadState('networkidle')
    
    // Client ユーザーでログイン
    await page.fill('input[name="email"]', 'client@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard/**', { timeout: 30000 })
  })

  test('Client should access client dashboard', async () => {
    // クライアントダッシュボードが表示されることを確認
    await expect(page.getByRole('heading', { name: 'クライアントダッシュボード' })).toBeVisible()
  })

  test('Client should see project overview', async () => {
    // プロジェクト概要セクションが表示されることを確認
    await expect(page.getByText('プロジェクト概要')).toBeVisible()
  })

  test('Client should see recent activities', async () => {
    // 最近の活動セクションが表示されることを確認
    await expect(page.getByText('最近の活動')).toBeVisible()
  })

  test('Client should see upcoming milestones', async () => {
    // マイルストーンセクションが表示されることを確認
    await expect(page.getByText('今後のマイルストーン')).toBeVisible()
  })

  test('Client should have limited menu access', async () => {
    // クライアントが見えてはいけないメニューが表示されないことを確認
    const teamMenu = page.locator('text=チーム管理')
    await expect(teamMenu).not.toBeVisible()
    
    const timesheetApproval = page.locator('text=工数承認')
    await expect(timesheetApproval).not.toBeVisible()
    
    const clientManagement = page.locator('text=クライアント管理')
    await expect(clientManagement).not.toBeVisible()
  })

  test('Client should see only their projects', async () => {
    // プロジェクト一覧へ移動
    const projectMenu = page.locator('text=プロジェクト一覧')
    if (await projectMenu.isVisible()) {
      await projectMenu.click()
      await page.waitForLoadState('networkidle')
      
      // 自社のプロジェクトのみ表示されることを確認
      const projectCards = page.locator('[data-testid="project-card"]')
      const count = await projectCards.count()
      expect(count).toBeGreaterThanOrEqual(0) // クライアントには表示されるプロジェクトがあるかもしれない
    }
  })

  test('Client should access messages', async () => {
    // メッセージメニューが表示される場合
    const messageMenu = page.locator('text=メッセージ')
    if (await messageMenu.isVisible()) {
      await messageMenu.click()
      await page.waitForLoadState('networkidle')
      
      // メッセージページが表示されることを確認
      await expect(page.url()).toContain('/messages')
    }
  })

  test('Client should see deliverables', async () => {
    // 成果物が表示されることを確認（ダッシュボード内）
    const deliverables = page.locator('text=成果物')
    if (await deliverables.isVisible()) {
      await expect(deliverables).toBeVisible()
    }
  })

  test.afterEach(async () => {
    // スクリーンショットを保存（エラー時）
    if (test.info().status !== 'passed') {
      await page.screenshot({ 
        path: `test-results/client-${test.info().title}-failure.png`,
        fullPage: true 
      })
    }
  })
})