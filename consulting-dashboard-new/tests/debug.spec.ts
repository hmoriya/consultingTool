import { test } from '@playwright/test';

test('デバッグ用スクリーンショット', async ({ page }) => {
  // ログイン
  await page.goto('/login');
  await page.screenshot({ path: 'test-1-login.png' });
  
  await page.locator('#email').fill('pm@example.com');
  await page.locator('#password').fill('password123');
  await page.getByRole('button', { name: 'ログイン' }).click();
  
  // ロール選択ページ
  await page.waitForURL('http://localhost:3000/');
  await page.screenshot({ path: 'test-2-role-select.png' });
  
  // PMダッシュボードへ移動
  await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
  await page.waitForURL('**/dashboard/pm');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-3-pm-dashboard.png', fullPage: true });
  
  // サイドバーの内容を確認
  console.log('HTML:', await page.locator('aside').innerHTML());
});