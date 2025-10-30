import { test, expect, Page } from '@playwright/test'

test.describe('PM Role Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: p }) => {
    page = p
    // ログイン処理
    await page.goto('http://localhost:3000')
    await page.click('text=ログイン')
    await page.waitForLoadState('networkidle')
    
    // PM ユーザーでログイン
    await page.fill('input[name="email"]', 'pm@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard/**', { timeout: 30000 })
  })

  test('PM should access PM dashboard', async () => {
    // PMダッシュボードが表示されることを確認
    await expect(page.getByRole('heading', { name: 'PMダッシュボード' })).toBeVisible()
  })

  test('PM should see assigned projects', async () => {
    // 担当プロジェクトが表示されることを確認
    await expect(page.getByText('担当プロジェクト')).toBeVisible()
    
    // 3つのプロジェクトが表示されることを確認
    const projectElements = page.locator('[data-testid="project-overview-item"]')
    await expect(projectElements).toHaveCount(3)
  })

  test('PM should see upcoming milestones', async () => {
    // 直近のマイルストーンセクションが表示されることを確認
    await expect(page.getByText('直近のマイルストーン')).toBeVisible()
  })

  test('PM should see task summary', async () => {
    // タスクサマリーが表示されることを確認
    await expect(page.getByText('タスクサマリー')).toBeVisible()
  })

  test('PM should access project list', async () => {
    // プロジェクト一覧へ移動
    await page.click('text=プロジェクト一覧')
    await page.waitForLoadState('networkidle')
    
    // 自分が担当するプロジェクトが表示されることを確認
    await expect(page.getByText('デジタルトランスフォーメーション推進')).toBeVisible()
    await expect(page.getByText('ビジネスオペレーション最適化')).toBeVisible()
    await expect(page.getByText('データ分析基盤構築')).toBeVisible()
    
    // PMの名前が表示されることを確認
    const pmTexts = await page.locator('text=PM: ').all()
    expect(pmTexts.length).toBeGreaterThan(0)
  })

  test('PM should access team management', async () => {
    // チーム管理へアクセス
    await page.click('text=チーム管理')
    await page.waitForLoadState('networkidle')
    
    // チーム管理ページが表示されることを確認
    await expect(page.url()).toContain('/team')
  })

  test('PM should access timesheet approval', async () => {
    // 工数承認へアクセス
    await page.click('text=工数承認')
    await page.waitForLoadState('networkidle')
    
    // 工数承認ページが表示されることを確認
    await expect(page.url()).toContain('/timesheet/approval')
  })

  test('PM should see project details', async () => {
    // プロジェクト一覧へ移動
    await page.click('text=プロジェクト一覧')
    await page.waitForLoadState('networkidle')
    
    // プロジェクト詳細へアクセス
    await page.click('text=詳細を見る')
    await page.waitForLoadState('networkidle')
    
    // プロジェクト詳細ページが表示されることを確認
    await expect(page.url()).toMatch(/\/projects\/[^/]+$/)
  })

  test.afterEach(async () => {
    // スクリーンショットを保存（エラー時）
    if (test.info().status !== 'passed') {
      await page.screenshot({ 
        path: `test-results/pm-${test.info().title}-failure.png`,
        fullPage: true 
      })
    }
  })
})