#!/usr/bin/env node

/**
 * Issue #121: 全サービスのAPI仕様とDB設計データ復旧スクリプト
 *
 * 全7サービスのAPI仕様とDB設計MDファイルをAPI経由でデータベースに投入します。
 */

const fs = require('fs').promises;
const path = require('path');

// 対象サービス一覧
const SERVICES = [
  'secure-access-service',
  'project-success-service',
  'talent-optimization-service',
  'productivity-visualization-service',
  'knowledge-co-creation-service',
  'revenue-optimization-service',
  'collaboration-facilitation-service'
];

// 対象ドキュメント種別
const DOC_TYPES = [
  'api-specification',
  'database-design'
];

// サービスIDマッピング
const SERVICE_ID_MAP = {
  'secure-access-service': 'secure-access-service',
  'project-success-service': 'project-success-service',
  'talent-optimization-service': 'talent-optimization-service',
  'productivity-visualization-service': 'productivity-visualization-service',
  'knowledge-co-creation-service': 'knowledge-co-creation-service',
  'revenue-optimization-service': 'revenue-optimization-service',
  'collaboration-facilitation-service': 'collaboration-facilitation-service'
};

async function uploadDocument(serviceId, docType, content) {
  const url = `http://localhost:3000/api/parasol/services/${serviceId}/${docType}`;

  try {
    // Global fetch (Node.js 18+) with explicit keepAlive disabled
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js-Restore-Script'
      },
      body: JSON.stringify({ content }),
      keepalive: false
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ ${serviceId}/${docType}: 成功 (${response.status})`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ ${serviceId}/${docType}: 失敗 (${response.status}) - ${errorText}`);
      return false;
    }
  } catch (error) {
    console.log(`💥 ${serviceId}/${docType}: エラー - ${error.message}`);
    console.log(`   URL: ${url}`);
    console.log(`   Content length: ${content.length} bytes`);
    return false;
  }
}

async function main() {
  console.log('🚀 API仕様・DB設計データ復旧開始');
  console.log(`📂 対象サービス: ${SERVICES.length}個`);
  console.log(`📄 対象ドキュメント: ${DOC_TYPES.length}種類`);
  console.log(`📊 総作業数: ${SERVICES.length * DOC_TYPES.length}件\n`);

  let successCount = 0;
  let totalCount = 0;

  for (const service of SERVICES) {
    console.log(`\n🔄 ${service} 処理中...`);

    for (const docType of DOC_TYPES) {
      totalCount++;

      const filePath = path.join(
        'docs', 'parasol', 'services', service, `${docType}.md`
      );

      try {
        // ファイル存在確認
        await fs.access(filePath);

        // ファイル読み込み
        const content = await fs.readFile(filePath, 'utf-8');

        if (content.trim().length === 0) {
          console.log(`⚠️  ${service}/${docType}: 空ファイル - スキップ`);
          continue;
        }

        // API経由でアップロード
        const serviceId = SERVICE_ID_MAP[service];
        const success = await uploadDocument(serviceId, docType, content);

        if (success) {
          successCount++;
        }

        // レート制限対策で少し待機
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`❌ ${service}/${docType}: ファイル読み込みエラー - ${error.message}`);
      }
    }
  }

  console.log('\n📊 復旧結果:');
  console.log(`   ✅ 成功: ${successCount}件`);
  console.log(`   ❌ 失敗: ${totalCount - successCount}件`);
  console.log(`   📁 総件数: ${totalCount}件`);

  if (successCount === totalCount) {
    console.log('\n🎉 全てのデータ復旧が完了しました！');
  } else {
    console.log('\n⚠️  一部のデータ復旧に失敗しました。手動確認が必要です。');
  }
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 スクリプトエラー:', error);
    process.exit(1);
  });
}

module.exports = { uploadDocument };