import { test, expect } from '@playwright/test';

test.describe('統合テスト', () => {
  test('ログインからプロジェクト管理までのフロー', async ({ page }) => {
    // 1. ログインページへアクセス
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('アカウントにログイン');
    
    // 2. PMユーザーでログイン
    await page.locator('#email').fill('pm@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // 3. ロール選択ページが表示される
    await page.waitForURL('http://localhost:3000/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('コンサルティングダッシュボード');
    
    // 4. PMダッシュボードへ移動
    await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
    await page.waitForURL('**/dashboard/pm');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('プロジェクトマネージャーダッシュボード');
    
    // 5. プロジェクト一覧へ移動
    await page.getByRole('link', { name: 'プロジェクト一覧' }).click();
    await page.waitForURL('**/projects');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('プロジェクト一覧');
    
    // 6. プロジェクトが表示されていることを確認
    await expect(page.getByText('デジタルトランスフォーメーション戦略策定')).toBeVisible();
    
    // 7. 新規プロジェクトボタンが表示される
    await expect(page.getByRole('button', { name: '新規プロジェクト' })).toBeVisible();
    
    // 8. 検索機能のテスト
    await page.getByPlaceholder('プロジェクト名、コード、クライアント名で検索...').fill('デジタル');
    await page.waitForTimeout(500);
    await expect(page.getByText('デジタルトランスフォーメーション戦略策定')).toBeVisible();
  });

  test('プロジェクト詳細ページの表示', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.locator('#email').fill('pm@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // PMダッシュボードへ
    await page.waitForURL('http://localhost:3000/');
    await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
    await page.waitForURL('**/dashboard/pm');
    
    // プロジェクト一覧へ
    await page.getByRole('link', { name: 'プロジェクト一覧' }).click();
    await page.waitForURL('**/projects');
    
    // プロジェクトをクリック
    await page.getByRole('link', { name: 'デジタルトランスフォーメーション戦略策定' }).click();
    
    // プロジェクト詳細ページの確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('デジタルトランスフォーメーション戦略策定');
    await expect(page.getByRole('tab', { name: '概要' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'タスク' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'チーム' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'マイルストーン' })).toBeVisible();
  });

  test('チーム管理ページへのアクセス', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.locator('#email').fill('pm@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // PMダッシュボードへ
    await page.waitForURL('http://localhost:3000/');
    await page.getByRole('link', { name: /プロジェクトマネージャー/ }).click();
    await page.waitForURL('**/dashboard/pm');
    
    // チーム管理へ
    await page.getByRole('link', { name: 'チーム管理' }).click();
    await page.waitForURL('**/team');
    
    // チーム管理ページの確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('チーム管理');
    await expect(page.getByRole('button', { name: '新規メンバー追加' })).toBeVisible();
  });
});

test.describe('エグゼクティブ向け機能', () => {
  test('エグゼクティブダッシュボードとクライアント管理', async ({ page }) => {
    // ログイン
    await page.goto('/login');
    await page.locator('#email').fill('exec@example.com');
    await page.locator('#password').fill('password123');
    await page.getByRole('button', { name: 'ログイン' }).click();
    
    // エグゼクティブダッシュボードへ
    await page.waitForURL('http://localhost:3000/');
    await page.getByRole('link', { name: /エグゼクティブ/ }).click();
    await page.waitForURL('**/dashboard/executive');
    
    // ダッシュボードの確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('エグゼクティブダッシュボード');
    await expect(page.getByText('アクティブプロジェクト')).toBeVisible();
    await expect(page.getByText('総収益')).toBeVisible();
    
    // クライアント管理へ
    await page.getByRole('link', { name: 'クライアント管理' }).click();
    await page.waitForURL('**/clients');
    
    // クライアント管理ページの確認
    await expect(page.getByRole('heading', { level: 1 })).toContainText('クライアント管理');
    await expect(page.getByRole('button', { name: '新規クライアント' })).toBeVisible();
  });
});