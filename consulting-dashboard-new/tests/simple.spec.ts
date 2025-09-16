import { test, expect } from '@playwright/test';

test('基本的な動作確認', async ({ page }) => {
  await page.goto('/');
  
  // スクリーンショットを撮る
  await page.screenshot({ path: 'test-screenshot.png' });
  
  // ページの内容を出力
  console.log('タイトル:', await page.title());
  console.log('URL:', page.url());
  
  // ボディの内容が存在することを確認
  await expect(page.locator('body')).toBeVisible();
});