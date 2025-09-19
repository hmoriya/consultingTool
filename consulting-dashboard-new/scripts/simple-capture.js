const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // ログインページ
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // エグゼクティブとしてログイン
    await page.fill('input[type="email"]', 'exec@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // ログイン前のスクリーンショット（ログインフォーム）
    await page.screenshot({ 
      path: 'public/captures/common/login-form.png',
      fullPage: false 
    });
    
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // エグゼクティブダッシュボード
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'public/captures/executive/exec-portfolio/step-1.png',
      fullPage: false 
    });
    console.log('Captured: Executive Dashboard');
    
    // プロジェクト一覧
    await page.click('a[href="/projects"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'public/captures/executive/exec-portfolio/step-2.png',
      fullPage: false 
    });
    console.log('Captured: Project List');
    
    // ログアウトしてコンサルタントでログイン
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'consultant@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    // コンサルタントダッシュボード
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'public/captures/consultant/consultant-task/step-1.png',
      fullPage: false 
    });
    console.log('Captured: Consultant Dashboard');
    
    // タスク管理
    await page.click('a[href="/tasks"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'public/captures/consultant/consultant-task/step-2.png',
      fullPage: false 
    });
    console.log('Captured: Task Management');
    
    // タイムシート
    await page.click('a[href="/timesheet"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'public/captures/consultant/consultant-timesheet/step-1.png',
      fullPage: false 
    });
    console.log('Captured: Timesheet');
    
    console.log('All captures completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureScreenshots();