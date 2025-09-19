import { test, expect, Page } from '@playwright/test'

test.describe('Executive Role Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: p }) => {
    page = p
    // ログイン処理
    await page.goto('http://localhost:3000')
    await page.click('text=ログイン')
    await page.waitForLoadState('networkidle')
    
    // Executive ユーザーでログイン
    await page.fill('input[name="email"]', 'exec@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard/**', { timeout: 30000 })
  })

  test('Executive should access executive dashboard', async () => {
    // エグゼクティブダッシュボードが表示されることを確認
    await expect(page.getByRole('heading', { name: 'エグゼクティブダッシュボード' })).toBeVisible()
  })

  test('Executive should see project portfolio', async () => {
    // プロジェクトポートフォリオセクションが表示されることを確認
    await expect(page.getByText('プロジェクトポートフォリオ')).toBeVisible()
    
    // プロジェクト情報が表示されることを確認
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards).toHaveCount(3) // 3つのプロジェクトがあるはず
  })

  test('Executive should see financial metrics', async () => {
    // 財務指標が表示されることを確認
    await expect(page.getByText('収益')).toBeVisible()
    await expect(page.getByText('コスト')).toBeVisible()
    await expect(page.getByText('利益率')).toBeVisible()
  })

  test('Executive should see resource utilization', async () => {
    // リソース稼働率が表示されることを確認
    await expect(page.getByText('リソース稼働率')).toBeVisible()
  })

  test('Executive should access all projects', async () => {
    // プロジェクト一覧へ移動
    await page.click('text=プロジェクト一覧')
    await page.waitForLoadState('networkidle')
    
    // 全プロジェクトが表示されることを確認
    await expect(page.getByText('デジタルトランスフォーメーション推進')).toBeVisible()
    await expect(page.getByText('ビジネスプロセス最適化')).toBeVisible()
    await expect(page.getByText('データ分析基盤構築')).toBeVisible()
  })

  test('Executive should access reports', async () => {
    // レポートメニューへアクセス
    await page.click('text=レポート')
    await page.waitForLoadState('networkidle')
    
    // レポートページが表示されることを確認
    await expect(page.url()).toContain('/reports')
  })

  test.afterEach(async () => {
    // スクリーンショットを保存（エラー時）
    if (test.info().status !== 'passed') {
      await page.screenshot({ 
        path: `test-results/executive-${test.info().title}-failure.png`,
        fullPage: true 
      })
    }
  })
})