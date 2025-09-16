const { chromium } = require('playwright');

(async () => {
  // ブラウザを起動
  const browser = await chromium.launch({
    headless: false, // GUIブラウザを表示
    slowMo: 500 // 操作を見やすくするため少し遅くする
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('1. ログインページにアクセス...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');

    // スクリーンショットを撮影
    await page.screenshot({ path: 'login-page-accessed.png', fullPage: true });
    console.log('✓ ログインページにアクセスしました');

    // ログインフォームの確認
    const emailInput = await page.locator('input[type="email"]');
    const passwordInput = await page.locator('input[type="password"]');
    const submitButton = await page.locator('button[type="submit"]');

    console.log('2. エグゼクティブユーザーでログイン...');
    
    // フォームに入力
    await emailInput.fill('exec@example.com');
    await passwordInput.fill('password123');
    
    // スクリーンショット（入力後）
    await page.screenshot({ path: 'login-form-filled.png', fullPage: true });
    
    // ログインボタンをクリック
    await submitButton.click();
    
    // ログイン処理を待つ
    console.log('3. ログイン処理中...');
    
    // リダイレクトまたはエラーメッセージを待つ
    await Promise.race([
      page.waitForURL('http://localhost:3000/dashboard/**', { timeout: 10000 }),
      page.waitForSelector('.text-destructive', { timeout: 10000 }) // エラーメッセージ
    ]).catch(() => {});

    // 現在のURLを確認
    const currentUrl = page.url();
    console.log('現在のURL:', currentUrl);

    if (currentUrl.includes('/dashboard')) {
      console.log('✓ ログイン成功！ダッシュボードにリダイレクトされました');
      await page.screenshot({ path: 'dashboard-accessed.png', fullPage: true });
    } else {
      console.log('⚠️ ログインできませんでした。ログインページのままです。');
      
      // エラーメッセージを確認
      const errorMessage = await page.locator('.text-destructive').textContent().catch(() => null);
      if (errorMessage) {
        console.log('エラーメッセージ:', errorMessage);
      }
    }

    console.log('\n4. 他のユーザーでもテスト...');
    
    // PMユーザーでログインテスト
    await page.goto('http://localhost:3000/login');
    await emailInput.fill('pm@example.com');
    await passwordInput.fill('password123');
    await submitButton.click();
    
    await page.waitForTimeout(2000);
    console.log('PMユーザー - 現在のURL:', page.url());

    // ブラウザは開いたままにする（10秒間）
    console.log('\n✓ ブラウザを10秒間開いたままにします...');
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error('エラーが発生しました:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
    console.log('ブラウザを閉じました');
  }
})();