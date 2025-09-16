import { test, expect } from '@playwright/test';

test.describe('認証テスト', () => {
  test('PMユーザーでログイン', async ({ page }) => {
    await page.goto('/login');
    
    // IDで要素を特定して入力
    await page.locator('#email').fill('pm@example.com');
    await page.locator('#password').fill('password123');
    
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // ロール選択ページにリダイレクトされることを確認
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    
    // ダッシュボードが表示されていることを確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('コンサルティングダッシュボード');
    
    // PMダッシュボードへのリンクをクリック
    await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
    
    // PMダッシュボードが表示されていることを確認
    await page.waitForURL('**/dashboard/pm');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('プロジェクトマネージャーダッシュボード');
  });
  
  test('エグゼクティブユーザーでログイン', async ({ page }) => {
    await page.goto('/login');
    
    // IDで要素を特定して入力
    await page.locator('#email').fill('exec@example.com');
    await page.locator('#password').fill('password123');
    
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // ロール選択ページにリダイレクトされることを確認
    await page.waitForURL('http://localhost:3000/', { timeout: 10000 });
    
    // エグゼクティブダッシュボードへのリンクをクリック
    await page.getByRole('link', { name: /エグゼクティブ/ }).click();
    
    // エグゼクティブダッシュボードが表示されていることを確認
    await page.waitForURL('**/dashboard/executive');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('エグゼクティブダッシュボード');
  });
});