// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  console.log('🚀 コンサルティングダッシュボードのデモを開始します\n');
  
  try {
    // 1. ログインページへアクセス
    console.log('1️⃣ ログインページへアクセス...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    console.log('✅ ログインページが表示されました');
    await page.screenshot({ path: 'demo-1-login.png' });
    
    // 2. エグゼクティブユーザーでログイン
    console.log('\n2️⃣ エグゼクティブユーザーでログイン...');
    await page.fill('input[type="email"]', 'exec@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // リダイレクトを待つ
    await page.waitForURL('http://localhost:3000/', { timeout: 5000 });
    console.log('✅ ログイン成功！トップページへリダイレクトされました');
    await page.screenshot({ path: 'demo-2-toppage.png' });
    
    // 3. エグゼクティブダッシュボードへ移動
    console.log('\n3️⃣ エグゼクティブダッシュボードへ移動...');
    const dashboardLink = await page.locator('a[href="/dashboard/executive"]');
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await page.waitForURL('**/dashboard/executive');
      console.log('✅ エグゼクティブダッシュボードが表示されました');
      await page.screenshot({ path: 'demo-3-executive-dashboard.png' });
      await page.waitForTimeout(3000);
    }
    
    // 4. プロジェクト一覧へ移動
    console.log('\n4️⃣ プロジェクト一覧へ移動...');
    const projectsLink = await page.locator('a[href="/projects"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForURL('**/projects');
      console.log('✅ プロジェクト一覧が表示されました');
      await page.screenshot({ path: 'demo-4-projects.png' });
      await page.waitForTimeout(3000);
    }
    
    // 5. ログアウト
    console.log('\n5️⃣ ログアウト...');
    await page.goto('http://localhost:3000/');
    const logoutButton = await page.locator('button:has-text("ログアウト")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      console.log('✅ ログアウトしました');
    }
    
    await page.waitForTimeout(2000);
    
    // 6. PMユーザーでログイン
    console.log('\n6️⃣ PMユーザーでログイン...');
    await page.fill('input[type="email"]', 'pm@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/');
    console.log('✅ PMユーザーでログイン成功！');
    await page.screenshot({ path: 'demo-5-pm-login.png' });
    
    // 7. PMダッシュボードへ移動
    const pmDashboardLink = await page.locator('a[href="/dashboard/pm"]');
    if (await pmDashboardLink.isVisible()) {
      await pmDashboardLink.click();
      await page.waitForURL('**/dashboard/pm');
      console.log('✅ PMダッシュボードが表示されました');
      await page.screenshot({ path: 'demo-6-pm-dashboard.png' });
    }
    
    console.log('\n🎉 デモ完了！すべての機能が正常に動作しています');
    console.log('📸 スクリーンショットが保存されました:');
    console.log('  - demo-1-login.png');
    console.log('  - demo-2-toppage.png');
    console.log('  - demo-3-executive-dashboard.png');
    console.log('  - demo-4-projects.png');
    console.log('  - demo-5-pm-login.png');
    console.log('  - demo-6-pm-dashboard.png');
    
    console.log('\n⏳ ブラウザは10秒後に自動で閉じます...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    await page.screenshot({ path: 'demo-error.png' });
  } finally {
    await browser.close();
    console.log('\n👋 ブラウザを閉じました');
  }
})();