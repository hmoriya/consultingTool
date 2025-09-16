const { chromium } = require('playwright');

(async () => {
  // ブラウザを起動（ヘッドレスモードを無効にして画面表示）
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();

  console.log('🚀 Playwright MCPでアプリケーションを起動します...\n');
  
  try {
    // ログインページへアクセス
    console.log('1. ログインページへアクセス中...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    console.log('✅ ログインページが表示されました\n');
    
    // ログイン情報を入力
    console.log('2. ログイン情報を入力中...');
    await page.fill('input[type="email"]', 'exec@example.com');
    await page.fill('input[type="password"]', 'password123');
    console.log('✅ メールアドレスとパスワードを入力しました\n');
    
    // ログインボタンをクリック
    console.log('3. ログインボタンをクリック...');
    await page.click('button[type="submit"]');
    
    // ログイン後のページへのリダイレクトを待つ
    await page.waitForURL('http://localhost:3000/', { timeout: 5000 });
    console.log('✅ ログイン成功！ダッシュボード選択画面が表示されています\n');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ ログインが完了しました！');
    console.log('📌 現在のユーザー: エグゼクティブ (exec@example.com)');
    console.log('📍 現在のURL: ' + page.url());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('👉 ブラウザは開いたままです。自由に操作してください。');
    console.log('🔄 終了する場合は、このターミナルでCtrl+Cを押してください。\n');
    
    // ブラウザを開いたままにする（ユーザーが操作できるように）
    await new Promise(() => {}); // 無限に待機
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    await page.screenshot({ path: 'login-error.png' });
    console.log('📸 エラー時のスクリーンショットを保存しました: login-error.png');
  }
})();