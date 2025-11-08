import { chromium } from 'playwright';

async function captureConsultant() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    // ログインページから開始
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    // コンサルタントとしてログイン
    await page.fill('input[type="email"]', 'consultant@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // ダッシュボードが表示されるまで待機
    await page.waitForURL('**/dashboard/**');
    await page.waitForTimeout(2000);
    
    // コンサルタントダッシュボード
    await page.screenshot({ 
      path: 'public/captures/consultant/consultant-task/step-1.png',
      fullPage: false 
    });
    console.log('Captured: Consultant Dashboard');
    
    // タスク画面
    const tasksLink = page.locator('a[href="/tasks"]');
    if (await tasksLink.isVisible()) {
      await tasksLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: 'public/captures/consultant/consultant-task/step-2.png',
        fullPage: false 
      });
      console.log('Captured: Task Management');
    }
    
    // 工数管理画面
    const timesheetLink = page.locator('a[href="/timesheet"]');
    if (await timesheetLink.isVisible()) {
      await timesheetLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: 'public/captures/consultant/consultant-timesheet/step-1.png',
        fullPage: false 
      });
      console.log('Captured: Timesheet');
    }
    
    // スキル管理画面
    const skillsLink = page.locator('a[href="/team/skills"]');
    if (await skillsLink.isVisible()) {
      await skillsLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      await page.screenshot({ 
        path: 'public/captures/consultant/consultant-skill/step-1.png',
        fullPage: false 
      });
      console.log('Captured: Skills Management');
    }
    
    console.log('All consultant captures completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

captureConsultant();