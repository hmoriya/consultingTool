// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require('playwright');

(async () => {
  // ブラウザを起動（GUIモード）
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // 操作を見やすくする
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();

  console.log('📱 アプリケーションを起動してログインします...\n');
  
  try {
    // ログインページへアクセス
    console.log('1️⃣ ログインページへアクセス中...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ ログインページが表示されました');
    await page.waitForTimeout(1000);
    
    // ログインフォームの入力
    console.log('\n2️⃣ エグゼクティブユーザーでログイン中...');
    await page.fill('input[type="email"]', 'exec@example.com');
    await page.waitForTimeout(500);
    
    await page.fill('input[type="password"]', 'password123');
    await page.waitForTimeout(500);
    
    // ログインボタンをクリック
    await page.click('button[type="submit"]');
    console.log('⏳ ログイン処理中...');
    
    // ダッシュボードへのリダイレクトを待つ
    try {
      await page.waitForURL('**/dashboard/**', { timeout: 5000 });
      console.log('✅ ログイン成功！ダッシュボードへリダイレクトされました');
      console.log(`📍 現在のURL: ${page.url()}`);
    } catch (_error) {
      // リダイレクトしなかった場合、トップページへのリダイレクトを確認
      const currentUrl = page.url();
      if (currentUrl === 'http://localhost:3000/') {
        console.log('✅ ログイン成功！トップページへリダイレクトされました');
        console.log('📍 ロール選択画面が表示されているはずです');
      } else {
        console.log('⚠️ 予期しないページにリダイレクトされました:', currentUrl);
      }
    }
    
    await page.waitForTimeout(2000);
    
    // ダッシュボードリンクをクリックしてみる
    const dashboardLink = await page.locator('a[href*="/dashboard"]').first();
    if (await dashboardLink.isVisible()) {
      console.log('\n3️⃣ ダッシュボードリンクをクリック...');
      await dashboardLink.click();
      await page.waitForTimeout(2000);
      console.log(`✅ ダッシュボードへ移動しました: ${page.url()}`);
    }
    
    console.log('\n🎉 デモ完了！ブラウザは10秒後に閉じます...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    await page.screenshot({ path: 'error-demo.png' });
  } finally {
    await browser.close();
    console.log('👋 ブラウザを閉じました');
  }
})();