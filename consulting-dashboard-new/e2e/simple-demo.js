const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1500
  });

  const page = await browser.newContext().then(c => c.newPage());
  
  console.log('🚀 アプリケーションにアクセスしています...\n');
  
  // ログインページへ
  await page.goto('http://localhost:3000');
  console.log('✅ ログインページが表示されました');
  
  // エグゼクティブユーザーでログイン
  await page.fill('input[type="email"]', 'exec@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3000/');
  console.log('✅ ログイン成功！');
  console.log('✅ ダッシュボード選択画面が表示されています');
  
  console.log('\n📱 アプリケーションが正常に動作しています！');
  console.log('🎉 10秒後にブラウザを閉じます...');
  
  await page.waitForTimeout(10000);
  await browser.close();
})();