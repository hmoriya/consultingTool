#!/usr/bin/env node

/**
 * ユースケース定義復旧スクリプト
 *
 * MDファイルからAPI経由でユースケース定義をデータベースに投入します。
 */

import fs from 'fs/promises';
import path from 'path';

const BASE_DOCS_PATH = 'docs/parasol/services';

// 日本語表示名マッピング
const SERVICE_DISPLAY_NAMES = {
  'secure-access-service': 'セキュアアクセスサービス',
  'project-success-service': 'プロジェクト成功支援サービス',
  'talent-optimization-service': 'タレント最適化サービス',
  'productivity-visualization-service': '生産性可視化サービス',
  'knowledge-co-creation-service': 'ナレッジ共創サービス',
  'revenue-optimization-service': '収益最適化サービス',
  'collaboration-facilitation-service': 'コラボレーション促進サービス'
};

const CAPABILITY_DISPLAY_NAMES = {
  'audit-and-assure-security': 'セキュリティを監査・保証する能力',
  'authenticate-and-manage-users': 'ユーザーを認証・管理する能力',
  'control-access-permissions': 'アクセス権限を制御する能力',
  'manage-organizational-structure': '組織構造を管理する能力',
  'foresee-and-handle-risks': 'リスクを予見・対処する能力',
  'manage-and-complete-tasks': 'タスクを管理・完遂する能力',
  'manage-and-ensure-deliverable-quality': '成果物品質を管理・保証する能力',
  'plan-and-execute-project': 'プロジェクトを計画・実行する能力',
  'form-and-optimize-teams': 'チームを編成・最適化する能力',
  'manage-and-develop-members': 'メンバーを管理・育成する能力',
  'optimally-allocate-resources': 'リソースを最適配分する能力',
  'visualize-and-develop-skills': 'スキルを可視化・育成する能力',
  'workload-tracking': '作業負荷を追跡する能力',
  'knowledge-management': 'ナレッジを管理する能力',
  'analyze-and-improve-profitability': '収益性を分析・改善する能力',
  'control-and-optimize-costs': 'コストを制御・最適化する能力',
  'formulate-and-control-budget': '予算を策定・統制する能力',
  'recognize-and-maximize-revenue': '収益を認識・最大化する能力',
  'communication-delivery': 'コミュニケーションを配信する能力'
};

async function uploadParasolData(data) {
  const url = `http://localhost:3000/api/parasol/import`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js-Usecase-Restore-Script'
      },
      body: JSON.stringify(data),
      keepalive: false
    });

    if (response.ok) {
      await response.json();
      console.log(`✅ インポート成功: ${data.length}件のサービス`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ インポート失敗 (${response.status}): ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`💥 API呼び出しエラー: ${error.message}`);
    return false;
  }
}

async function readUsecaseFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.trim();
  } catch (error) {
    console.log(`⚠️  ファイル読み込みエラー: ${filePath} - ${error.message}`);
    return null;
  }
}

async function collectServiceData(serviceName) {
  const servicePath = path.join(BASE_DOCS_PATH, serviceName);

  // サービス基本情報
  const serviceFilePath = path.join(servicePath, 'service.md');
  const serviceContent = await readUsecaseFile(serviceFilePath);

  if (!serviceContent) {
    console.log(`⚠️  サービス定義が見つかりません: ${serviceName}`);
    return null;
  }

  const operations = [];

  try {
    // capabilitiesディレクトリを探索
    const capabilitiesPath = path.join(servicePath, 'capabilities');
    const capabilities = await fs.readdir(capabilitiesPath);

    for (const capabilityName of capabilities) {
      const capabilityPath = path.join(capabilitiesPath, capabilityName);
      const stat = await fs.stat(capabilityPath);

      if (!stat.isDirectory()) continue;

      // operationsディレクトリを探索
      const operationsPath = path.join(capabilityPath, 'operations');
      try {
        const operationNames = await fs.readdir(operationsPath);

        for (const operationName of operationNames) {
          const operationPath = path.join(operationsPath, operationName);
          const operationStat = await fs.stat(operationPath);

          if (!operationStat.isDirectory()) continue;

          // operation.mdファイルを読み込み
          const operationFilePath = path.join(operationPath, 'operation.md');
          const operationContent = await readUsecaseFile(operationFilePath);

          if (!operationContent) continue;

          // ユースケースファイルを収集
          const usecases = [];
          const usecasesPath = path.join(operationPath, 'usecases');

          try {
            const usecaseFiles = await fs.readdir(usecasesPath);

            for (const usecaseFile of usecaseFiles) {
              if (!usecaseFile.endsWith('.md')) continue;

              const usecaseFilePath = path.join(usecasesPath, usecaseFile);
              const usecaseContent = await readUsecaseFile(usecaseFilePath);

              if (usecaseContent) {
                // MDファイルのタイトルから日本語表示名を抽出（半角・全角コロン両対応）
                const titleMatch = usecaseContent.match(/^#\s*ユースケース[：:]\s*(.+)$/m);
                const displayName = titleMatch ? titleMatch[1].trim() : usecaseFile.replace('.md', '');


                usecases.push({
                  name: usecaseFile.replace('.md', ''),
                  displayName: displayName,
                  content: usecaseContent
                });
              }
            }
          } catch (error) {
            // usecasesディレクトリがない場合はスキップ
          }

          // ページ定義を収集
          const pages = [];
          const pagesPath = path.join(operationPath, 'pages');

          try {
            const pageFiles = await fs.readdir(pagesPath);

            for (const pageFile of pageFiles) {
              if (!pageFile.endsWith('.md')) continue;

              const pageFilePath = path.join(pagesPath, pageFile);
              const pageContent = await readUsecaseFile(pageFilePath);

              if (pageContent) {
                // MDファイルのタイトルから日本語表示名を抽出（全角コロン対応）
                const titleMatch = pageContent.match(/^#\s*ページ定義：\s*(.+)$/m);
                const displayName = titleMatch ? titleMatch[1].trim() : pageFile.replace('.md', '');

                pages.push({
                  name: pageFile.replace('.md', ''),
                  displayName: displayName,
                  content: pageContent
                });
              }
            }
          } catch (error) {
            // pagesディレクトリがない場合はスキップ
          }

          // テスト定義を収集
          const tests = [];
          const testsPath = path.join(operationPath, 'tests');

          try {
            const testFiles = await fs.readdir(testsPath);

            for (const testFile of testFiles) {
              if (!testFile.endsWith('.md')) continue;

              const testFilePath = path.join(testsPath, testFile);
              const testContent = await readUsecaseFile(testFilePath);

              if (testContent) {
                // MDファイルのタイトルから日本語表示名を抽出（全角コロン対応）
                const titleMatch = testContent.match(/^#\s*テスト定義：\s*(.+)$/m);
                const displayName = titleMatch ? titleMatch[1].trim() : testFile.replace('.md', '');

                tests.push({
                  name: testFile.replace('.md', ''),
                  displayName: displayName,
                  content: testContent
                });
              }
            }
          } catch (error) {
            // testsディレクトリがない場合はスキップ
          }

          operations.push({
            name: operationName,
            capability: capabilityName,
            content: operationContent,
            usecases,
            pages,
            tests
          });

          console.log(`📋 収集: ${serviceName}/${capabilityName}/${operationName} - ユースケース:${usecases.length}件, ページ:${pages.length}件, テスト:${tests.length}件`);
        }
      } catch (error) {
        // operationsディレクトリがない場合はスキップ
      }
    }
  } catch (error) {
    console.log(`⚠️  ケーパビリティディレクトリが見つかりません: ${serviceName}`);
  }

  // APIが期待する形式に変換
  const capabilityMap = new Map();

  // オペレーションをケーパビリティ別にグループ化
  for (const operation of operations) {
    const capabilityName = operation.capability;
    if (!capabilityMap.has(capabilityName)) {
      capabilityMap.set(capabilityName, {
        name: capabilityName,
        displayName: CAPABILITY_DISPLAY_NAMES[capabilityName] || capabilityName,
        content: '',
        operations: []
      });
    }

    // ユースケースをAPIが期待する形式に変換
    const formattedUsecases = operation.usecases.map(uc => ({
      name: uc.name,
      displayName: uc.displayName,
      content: uc.content
    }));

    capabilityMap.get(capabilityName).operations.push({
      name: operation.name,
      displayName: operation.content.split('\n')[0].replace('# ', '').replace(/^ビジネスオペレーション:\s*/, ''),
      pattern: 'Workflow',
      content: operation.content,
      usecases: formattedUsecases,
      pages: operation.pages.map(page => ({
        name: page.name,
        displayName: page.displayName,
        content: page.content
      })),
      tests: operation.tests.map(test => ({
        name: test.name,
        displayName: test.displayName,
        content: test.content
      }))
    });
  }

  return {
    name: serviceName,
    displayName: SERVICE_DISPLAY_NAMES[serviceName] || serviceName,
    description: `${SERVICE_DISPLAY_NAMES[serviceName] || serviceName}の詳細機能`,
    content: serviceContent,
    domainLanguage: '',
    apiSpecification: '',
    databaseDesign: '',
    integrationSpecification: '',
    capabilities: Array.from(capabilityMap.values())
  };
}

async function main() {
  console.log('🚀 ユースケース定義復旧開始');

  const services = [
    'secure-access-service',
    'project-success-service',
    'talent-optimization-service',
    'productivity-visualization-service',
    'knowledge-co-creation-service',
    'revenue-optimization-service',
    'collaboration-facilitation-service'
  ];

  let totalUsecases = 0;
  let totalPages = 0;
  let totalTests = 0;
  const allServices = [];

  // 全サービスのデータを収集
  for (const serviceName of services) {
    console.log(`\n🔄 ${serviceName} 処理中...`);

    const serviceData = await collectServiceData(serviceName);

    if (!serviceData) {
      console.log(`❌ ${serviceName}: データ収集失敗`);
      continue;
    }

    // 統計情報を計算（新しい構造に対応）
    const serviceUsecases = serviceData.capabilities.reduce((sum, cap) =>
      sum + cap.operations.reduce((opSum, op) => opSum + op.usecases.length, 0), 0);
    const servicePages = serviceData.capabilities.reduce((sum, cap) =>
      sum + cap.operations.reduce((opSum, op) => opSum + op.pages.length, 0), 0);
    const serviceTests = serviceData.capabilities.reduce((sum, cap) =>
      sum + cap.operations.reduce((opSum, op) => opSum + op.tests.length, 0), 0);

    totalUsecases += serviceUsecases;
    totalPages += servicePages;
    totalTests += serviceTests;

    console.log(`📊 ${serviceName}: ケーパビリティ:${serviceData.capabilities.length}件, ユースケース:${serviceUsecases}件, ページ:${servicePages}件, テスト:${serviceTests}件`);

    allServices.push(serviceData);
  }

  // 全サービスを一括でAPI送信
  console.log(`\n🚀 全${allServices.length}サービスを一括送信中...`);
  const success = await uploadParasolData(allServices);

  if (success) {
    console.log(`✅ 全${allServices.length}サービスのインポート成功`);
  } else {
    console.log(`❌ 一括インポート失敗`);
  }

  console.log('\n📊 復旧結果:');
  console.log(`   📋 総ユースケース: ${totalUsecases}件`);
  console.log(`   📄 総ページ定義: ${totalPages}件`);
  console.log(`   🧪 総テスト定義: ${totalTests}件`);
  console.log('\n🎉 ユースケース定義復旧完了！');
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 スクリプトエラー:', error);
    process.exit(1);
  });
}

module.exports = { collectServiceData, uploadParasolData };