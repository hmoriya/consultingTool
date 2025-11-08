import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// キャプチャ設定
const captures = [
  // エグゼクティブ
  {
    role: 'executive',
    email: 'exec@example.com',
    password: 'password123',
    captures: [
      {
        useCase: 'exec-portfolio',
        steps: [
          { nav: '/dashboard/executive', wait: 2000, filename: 'step-1.png', desc: 'ダッシュボード' },
          { nav: '/projects', wait: 1500, filename: 'step-2.png', desc: 'プロジェクト一覧' },
          { nav: '/dashboard/executive', wait: 1500, filename: 'step-3.png', desc: 'KPI確認' },
          { nav: '/team/utilization', wait: 1500, filename: 'step-4.png', desc: 'リソース最適化' },
          { nav: '/reports', wait: 1500, filename: 'step-5.png', desc: 'レポート' }
        ]
      },
      {
        useCase: 'exec-financial',
        steps: [
          { nav: '/dashboard/executive', wait: 2000, filename: 'step-1.png', desc: '財務ダッシュボード' },
          { nav: '/dashboard/executive', wait: 1000, filename: 'step-2.png', desc: '月次収益確認' },
          { nav: '/dashboard/executive', wait: 1000, filename: 'step-3.png', desc: '前月比分析' },
          { nav: '/dashboard/executive', wait: 1000, filename: 'step-4.png', desc: '予実差異' },
          { nav: '/dashboard/executive', wait: 1000, filename: 'step-5.png', desc: 'アクションプラン' }
        ]
      }
    ]
  },
  // PM
  {
    role: 'pm',
    email: 'pm@example.com',
    password: 'password123',
    captures: [
      {
        useCase: 'pm-project-mgmt',
        steps: [
          { nav: '/dashboard/pm', wait: 2000, filename: 'step-1.png', desc: 'PMダッシュボード' },
          { nav: '/projects', wait: 1500, filename: 'step-2.png', desc: 'プロジェクト進捗' },
          { nav: '/tasks', wait: 1500, filename: 'step-3.png', desc: 'タスク管理' },
          { nav: '/projects', wait: 1500, filename: 'step-4.png', desc: 'リスク管理' },
          { nav: '/team/utilization', wait: 1500, filename: 'step-5.png', desc: 'チーム稼働状況' }
        ]
      },
      {
        useCase: 'pm-timesheet-approval',
        steps: [
          { nav: '/timesheet/approval', wait: 2000, filename: 'step-1.png', desc: '承認画面' },
          { nav: '/timesheet/approval', wait: 1000, filename: 'step-2.png', desc: '未承認一覧' },
          { nav: '/timesheet/approval', wait: 1000, filename: 'step-3.png', desc: '工数確認' },
          { nav: '/timesheet/approval', wait: 1000, filename: 'step-4.png', desc: '承認処理' },
          { nav: '/timesheet/approval', wait: 1000, filename: 'step-5.png', desc: '月次締め' }
        ]
      }
    ]
  },
  // コンサルタント
  {
    role: 'consultant',
    email: 'consultant@example.com',
    password: 'password123',
    captures: [
      {
        useCase: 'consultant-task',
        steps: [
          { nav: '/dashboard/consultant', wait: 2000, filename: 'step-1.png', desc: 'ダッシュボード' },
          { nav: '/tasks', wait: 1500, filename: 'step-2.png', desc: 'タスク一覧' },
          { nav: '/tasks', wait: 1000, filename: 'step-3.png', desc: 'ステータス更新' },
          { nav: '/timesheet', wait: 1500, filename: 'step-4.png', desc: '作業時間記録' },
          { nav: '/deliverables', wait: 1500, filename: 'step-5.png', desc: '成果物アップ' }
        ]
      },
      {
        useCase: 'consultant-timesheet',
        steps: [
          { nav: '/timesheet', wait: 2000, filename: 'step-1.png', desc: 'タイムシート' },
          { nav: '/timesheet', wait: 1000, filename: 'step-2.png', desc: 'プロジェクト選択' },
          { nav: '/timesheet', wait: 1000, filename: 'step-3.png', desc: '時間入力' },
          { nav: '/timesheet', wait: 1000, filename: 'step-4.png', desc: '作業内容記載' },
          { nav: '/timesheet', wait: 1000, filename: 'step-5.png', desc: '承認申請' }
        ]
      },
      {
        useCase: 'consultant-skill',
        steps: [
          { nav: '/team/skills', wait: 2000, filename: 'step-1.png', desc: 'スキル管理' },
          { nav: '/team/skills', wait: 1000, filename: 'step-2.png', desc: 'スキル検索' },
          { nav: '/team/skills', wait: 1000, filename: 'step-3.png', desc: 'レベル評価' },
          { nav: '/team/skills', wait: 1000, filename: 'step-4.png', desc: '資格登録' },
          { nav: '/team/skills', wait: 1000, filename: 'step-5.png', desc: 'プロファイル更新' }
        ]
      }
    ]
  },
  // クライアント
  {
    role: 'client',
    email: 'client@example.com',
    password: 'password123',
    captures: [
      {
        useCase: 'client-progress',
        steps: [
          { nav: '/dashboard/client', wait: 2000, filename: 'step-1.png', desc: 'クライアントダッシュボード' },
          { nav: '/dashboard/client', wait: 1000, filename: 'step-2.png', desc: 'プロジェクト概要' },
          { nav: '/dashboard/client', wait: 1000, filename: 'step-3.png', desc: '進捗率確認' },
          { nav: '/deliverables', wait: 1500, filename: 'step-4.png', desc: '成果物レビュー' },
          { nav: '/messages', wait: 1500, filename: 'step-5.png', desc: 'フィードバック' }
        ]
      },
      {
        useCase: 'client-document',
        steps: [
          { nav: '/deliverables', wait: 2000, filename: 'step-1.png', desc: '成果物一覧' },
          { nav: '/deliverables', wait: 1000, filename: 'step-2.png', desc: '成果物確認' },
          { nav: '/deliverables', wait: 1000, filename: 'step-3.png', desc: 'ダウンロード' },
          { nav: '/deliverables', wait: 1000, filename: 'step-4.png', desc: 'コメント記載' },
          { nav: '/deliverables', wait: 1000, filename: 'step-5.png', desc: '承認/修正依頼' }
        ]
      }
    ]
  }
];

// 共通機能のキャプチャ
const commonCaptures = [
  {
    useCase: 'common-message',
    steps: [
      { nav: '/messages', wait: 2000, filename: 'step-1.png', desc: 'メッセージ画面' },
      { nav: '/messages', wait: 1000, filename: 'step-2.png', desc: 'チャンネル選択' },
      { nav: '/messages', wait: 1000, filename: 'step-3.png', desc: 'メッセージ送信' },
      { nav: '/messages', wait: 1000, filename: 'step-4.png', desc: '通知確認' },
      { nav: '/messages', wait: 1000, filename: 'step-5.png', desc: 'ファイル共有' }
    ]
  },
  {
    useCase: 'common-notification',
    steps: [
      { nav: '/', wait: 2000, filename: 'step-1.png', desc: '通知アイコン' },
      { nav: '/', wait: 1000, filename: 'step-2.png', desc: '通知一覧' },
      { nav: '/', wait: 1000, filename: 'step-3.png', desc: '詳細確認' },
      { nav: '/', wait: 1000, filename: 'step-4.png', desc: 'アクション実行' },
      { nav: '/', wait: 1000, filename: 'step-5.png', desc: '既読処理' }
    ]
  }
];

async function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureScreenshots() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // 操作を見やすくするため
  });

  try {
    // 各ロールでキャプチャ
    for (const roleData of captures) {
      console.log(`\n📸 Capturing ${roleData.role.toUpperCase()} role...`);
      
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 1.5,
      });
      const page = await context.newPage();

      // ログイン
      await page.goto('http://localhost:3000/login');
      await page.waitForLoadState('networkidle');
      await page.fill('input[type="email"]', roleData.email);
      await page.fill('input[type="password"]', roleData.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard/**', { timeout: 5000 }).catch(() => {});
      
      // 各ユースケースのキャプチャ
      for (const useCase of roleData.captures) {
        const dir = path.join('public/captures', roleData.role, useCase.useCase);
        await ensureDirectory(dir);
        
        console.log(`  📁 ${useCase.useCase}`);
        
        for (const step of useCase.steps) {
          await page.goto(`http://localhost:3000${step.nav}`);
          await page.waitForTimeout(step.wait);
          
          const filepath = path.join(dir, step.filename);
          await page.screenshot({ 
            path: filepath,
            fullPage: false 
          });
          console.log(`    ✅ ${step.desc} -> ${step.filename}`);
        }
      }
      
      // 共通機能のキャプチャ（最初のロールでのみ）
      if (roleData.role === 'executive') {
        for (const common of commonCaptures) {
          const dir = path.join('public/captures/common', common.useCase);
          await ensureDirectory(dir);
          
          console.log(`  📁 ${common.useCase}`);
          
          for (const step of common.steps) {
            await page.goto(`http://localhost:3000${step.nav}`);
            await page.waitForTimeout(step.wait);
            
            const filepath = path.join(dir, step.filename);
            await page.screenshot({ 
              path: filepath,
              fullPage: false 
            });
            console.log(`    ✅ ${step.desc} -> ${step.filename}`);
          }
        }
      }
      
      await context.close();
    }
    
    console.log('\n✨ All captures completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

// 実行
captureScreenshots();