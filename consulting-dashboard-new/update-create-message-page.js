const fs = require('fs');
const { PrismaClient } = require('@prisma/parasol-client');

const parasolDb = new PrismaClient();

async function updateCreateMessagePage() {
  console.log('🔄 create-messageページ定義を更新中...');

  try {
    // 新しいページ定義ファイルを読み込み
    const pageContent = fs.readFileSync(
      'docs/parasol/services/collaboration-facilitation-service/capabilities/communication-delivery/operations/facilitate-communication/usecases/create-message/page.md',
      'utf-8'
    );

    console.log('✅ ページ定義ファイル読み込み完了');
    console.log(`📄 コンテンツ長: ${pageContent.length}文字`);

    // ページタイトルを抽出
    const titleMatch = pageContent.match(/^# ページ定義: (.+)$/m);
    const pageTitle = titleMatch ? titleMatch[1] : 'チーム連携活性化ページ（メッセージ作成）';

    console.log(`🎯 更新対象ページ: ${pageTitle}`);

    // サービスとオペレーションを取得
    const service = await parasolDb.service.findUnique({
      where: { name: 'collaboration-facilitation-service' }
    });

    if (!service) {
      console.log('❌ サービスが見つかりません: collaboration-facilitation-service');
      return;
    }

    console.log(`✅ サービス見つかりました: ${service.displayName} (ID: ${service.id})`);

    // ケーパビリティを取得
    const capability = await parasolDb.businessCapability.findFirst({
      where: {
        serviceId: service.id,
        name: 'communication-delivery'
      }
    });

    if (!capability) {
      console.log('❌ ケーパビリティが見つかりません: communication-delivery');
      return;
    }

    console.log(`✅ ケーパビリティ見つかりました: ${capability.name} (ID: ${capability.id})`);

    // オペレーションを取得
    const operation = await parasolDb.businessOperation.findFirst({
      where: {
        capabilityId: capability.id,
        name: { contains: 'facilitate-communication' }
      }
    });

    if (!operation) {
      console.log('❌ オペレーションが見つかりません: facilitate-communication');
      return;
    }

    console.log(`✅ オペレーション見つかりました: ${operation.name} (ID: ${operation.id})`);

    // create-messageユースケースを取得
    const usecase = await parasolDb.useCase.findFirst({
      where: {
        operationId: operation.id,
        name: 'create-message'
      }
    });

    if (!usecase) {
      console.log('❌ ユースケースが見つかりません: create-message');
      return;
    }

    console.log(`✅ ユースケース見つかりました: ${usecase.displayName} (ID: ${usecase.id})`);

    // 既存のページ定義を検索
    const existingPage = await parasolDb.pageDefinition.findFirst({
      where: {
        useCaseId: usecase.id,
        name: 'create-message-page'
      }
    });

    if (existingPage) {
      console.log(`🔄 既存ページ定義を更新中: ${existingPage.displayName}`);

      // ページ定義を更新
      await parasolDb.pageDefinition.update({
        where: { id: existingPage.id },
        data: {
          displayName: pageTitle,
          content: pageContent,
          updatedAt: new Date()
        }
      });

      console.log('✅ ページ定義更新完了！');
    } else {
      console.log('📝 新規ページ定義を作成中...');

      // 新規ページ定義を作成
      await parasolDb.pageDefinition.create({
        data: {
          useCaseId: usecase.id,
          name: 'create-message-page',
          displayName: pageTitle,
          content: pageContent,
          url: '/usecases/create-message'
        }
      });

      console.log('✅ 新規ページ定義作成完了！');
    }

    console.log('');
    console.log('🎯 更新内容:');
    console.log('- パラソル設計v2.0の1対1関係原則適用');
    console.log('- チーム連携活性化ページの完全定義');
    console.log('- 知見共有・専門知識流通機能の詳細化');
    console.log('- アクセシビリティ・レスポンシブ対応');
    console.log('');
    console.log('📋 確認手順:');
    console.log('1. ブラウザで http://localhost:3000/parasol を開く');
    console.log('2. collaboration-facilitation-service を選択');
    console.log('3. facilitate-communication オペレーションを選択');
    console.log('4. create-message ユースケースを選択');
    console.log('5. ページ定義タブでページ内容を確認');

  } catch (error) {
    console.error('❌ 更新エラー:', error.message);
  } finally {
    await parasolDb.$disconnect();
  }
}

updateCreateMessagePage();