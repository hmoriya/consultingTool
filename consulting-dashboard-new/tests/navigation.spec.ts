import { test, expect } from '@playwright/test';

test('PMユーザーのナビゲーションフロー', async ({ page }) => {
  // ログイン
  await page.goto('/login');
  await page.locator('#email').fill('pm@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: 'ログイン' }).click();
  
  // ロール選択ページが表示される
  await page.waitForURL('http://localhost:3000/');
  
  // PMダッシュボードへ移動
  await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
  await page.waitForURL('**/dashboard/pm');
  
  // サイドバーが表示されることを確認
  await page.waitForTimeout(1000); // サイドバーの読み込みを待つ
  
  // サイドバーから プロジェクト一覧へ移動
  const projectLink = page.locator('a', { hasText: 'プロジェクト一覧' });
  await expect(projectLink).toBeVisible();
  await projectLink.click();
  
  // プロジェクト一覧ページが表示される
  await page.waitForURL('**/projects');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('プロジェクト一覧');
});