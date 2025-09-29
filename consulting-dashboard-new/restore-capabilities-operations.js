const { PrismaClient } = require('@prisma/parasol-client');

const parasolDb = new PrismaClient();

async function restoreCapabilitiesAndOperations() {
  console.log('🔄 Restoring business capabilities and operations...');
  
  try {
    // Get all services
    const services = await parasolDb.service.findMany();
    console.log(`Found ${services.length} services`);
    
    if (services.length === 0) {
      console.log('❌ No services found. Please run services seed first.');
      return;
    }
    
    // Clear existing data
    await parasolDb.businessOperation.deleteMany({});
    await parasolDb.businessCapability.deleteMany({});
    console.log('Cleared existing capabilities and operations');
    
    // Create capabilities for each service
    const capabilityData = [
      {
        serviceName: 'secure-access',
        capabilities: [
          {
            name: 'access-management',
            displayName: 'アクセスを安全に管理する能力',
            description: 'システムへのセキュアなアクセスを制御し、適切な権限管理を実現する',
            businessValue: 'セキュリティリスクの最小化、コンプライアンス遵守、業務効率の向上',
            keyMetrics: 'セキュリティインシデント件数、ログイン成功率、権限管理精度',
            requiredResources: 'セキュリティエンジニア、認証システム、監査ツール'
          }
        ]
      },
      {
        serviceName: 'project-success-support',
        capabilities: [
          {
            name: 'project-success',
            displayName: 'プロジェクトを成功に導く能力',
            description: 'コンサルティングプロジェクトを期限内・予算内で価値を提供し、クライアントの期待を超える成果を出す',
            businessValue: 'プロジェクト成功率95%以上、顧客満足度4.5以上、計画乖離率±10%以内',
            keyMetrics: 'プロジェクト成功率、顧客満足度、スケジュール遵守率、予算遵守率',
            requiredResources: 'プロジェクトマネージャー、品質管理スペシャリスト、リスク管理エキスパート'
          }
        ]
      },
      {
        serviceName: 'talent-optimization',
        capabilities: [
          {
            name: 'team-productivity',
            displayName: 'チームの生産性を最大化する能力',
            description: 'コンサルタントの能力を最大限に引き出し、チーム全体の生産性と成果を最大化する',
            businessValue: '稼働率85%以上、スキル成長率20%向上、離職率10%以下',
            keyMetrics: '稼働率、スキル評価、生産性指標、チーム満足度',
            requiredResources: 'タレントマネージャー、スキル評価システム、トレーニングプログラム'
          }
        ]
      },
      {
        serviceName: 'productivity-visualization',
        capabilities: [
          {
            name: 'time-tracking',
            displayName: '工数を正確に把握する能力',
            description: 'コンサルタントの作業時間を正確に記録・分析し、プロジェクト収益性を可視化する',
            businessValue: '請求精度99%以上、工数入力効率50%向上、収益可視化100%',
            keyMetrics: '工数入力精度、承認処理時間、収益分析精度',
            requiredResources: '工数管理システム、承認ワークフロー、分析ツール'
          }
        ]
      },
      {
        serviceName: 'collaboration-facilitation',
        capabilities: [
          {
            name: 'information-delivery',
            displayName: '情報を即座に届ける能力',
            description: 'リアルタイムな情報共有とコミュニケーションを実現し、チーム連携を促進する',
            businessValue: '情報伝達速度50%向上、意思決定時間30%短縮、コラボレーション効率向上',
            keyMetrics: '通知配信率、応答時間、コミュニケーション頻度',
            requiredResources: '通知システム、チャットプラットフォーム、リアルタイム機能'
          }
        ]
      },
      {
        serviceName: 'knowledge-cocreation',
        capabilities: [
          {
            name: 'knowledge-asset',
            displayName: '知識を組織資産化する能力',
            description: 'プロジェクトで得られた知識を体系化し、組織の知的資産として蓄積・活用する',
            businessValue: '知識再利用率70%以上、新人育成期間30%短縮、品質向上20%',
            keyMetrics: '記事投稿数、閲覧数、再利用率、評価スコア',
            requiredResources: 'ナレッジマネージャー、検索システム、コンテンツ管理システム'
          }
        ]
      },
      {
        serviceName: 'revenue-optimization',
        capabilities: [
          {
            name: 'revenue-maximization',
            displayName: '収益性を最適化する能力',
            description: 'プロジェクトの収益性を管理し、財務健全性を維持・向上させる',
            businessValue: '収益率15%向上、コスト削減10%、予算精度95%以上',
            keyMetrics: '収益率、コスト効率、予算精度、キャッシュフロー',
            requiredResources: '財務アナリスト、管理会計システム、予算管理ツール'
          }
        ]
      }
    ];
    
    // Create business operations
    const operationData = [
      {
        serviceName: 'secure-access',
        operations: [
          {
            name: 'user-management',
            displayName: 'ユーザーを登録・管理する',
            description: '新規ユーザーの登録から退職者の処理まで、ユーザーのライフサイクル全体を管理する',
            businessValue: 'セキュリティ向上、管理効率化、コンプライアンス対応',
            stakeholders: 'システム管理者、人事担当者、セキュリティ担当者',
            keySteps: '1.ユーザー登録申請、2.身元確認、3.アカウント作成、4.権限設定、5.アカウント有効化',
            successCriteria: 'アカウント作成時間24時間以内、セキュリティ要件100%遵守'
          },
          {
            name: 'access-control',
            displayName: 'アクセス権限を制御する',
            description: 'ユーザーの役割に応じた適切なアクセス権限を設定・管理する',
            businessValue: 'セキュリティリスク軽減、業務効率向上、監査対応',
            stakeholders: 'セキュリティ管理者、部門長、システム管理者',
            keySteps: '1.権限要求、2.承認プロセス、3.権限設定、4.定期レビュー、5.権限調整',
            successCriteria: '権限設定精度99%以上、承認処理時間48時間以内'
          }
        ]
      },
      {
        serviceName: 'project-success-support',
        operations: [
          {
            name: 'project-planning',
            displayName: 'プロジェクトを正確に計画する',
            description: '確実な成果達成に向けた詳細な計画を策定し、リスクを事前に識別・対策する',
            businessValue: 'プロジェクト成功率向上、リスク軽減、効率的な資源配分',
            stakeholders: 'プロジェクトマネージャー、クライアント、チームメンバー',
            keySteps: '1.要件定義、2.WBS作成、3.スケジュール策定、4.リスク分析、5.計画承認',
            successCriteria: '計画精度95%以上、リスク識別率90%以上'
          },
          {
            name: 'progress-control',
            displayName: '進捗を可視化し統制する',
            description: 'プロジェクトの進捗状況をリアルタイムで把握し、適切な統制を行う',
            businessValue: '納期遵守、品質確保、早期課題発見・対応',
            stakeholders: 'プロジェクトマネージャー、チームリーダー、クライアント',
            keySteps: '1.進捗測定、2.状況分析、3.課題識別、4.対策実施、5.報告・共有',
            successCriteria: '進捗可視化100%、課題対応時間24時間以内'
          }
        ]
      },
      {
        serviceName: 'talent-optimization',
        operations: [
          {
            name: 'resource-allocation',
            displayName: 'リソースを最適配分する',
            description: 'プロジェクトの要求に対してスキルと稼働状況を考慮した最適な人員配置を行う',
            businessValue: '生産性20%向上、スキルマッチング精度95%、稼働率85%達成',
            stakeholders: 'リソースマネージャー、プロジェクトマネージャー、コンサルタント',
            keySteps: '1.要求分析、2.スキルマッチング、3.稼働調整、4.配置決定、5.モニタリング',
            successCriteria: '配置精度95%以上、稼働率最適化、スキル活用率90%'
          },
          {
            name: 'skill-development',
            displayName: 'スキルを育成する',
            description: '個人のキャリア目標と組織のニーズを合わせたスキル開発を促進する',
            businessValue: 'スキル向上率30%、社内昇進率20%向上、人材定着率95%',
            stakeholders: 'タレントマネージャー、コンサルタント、トレーナー',
            keySteps: '1.スキル評価、2.開発計画策定、3.トレーニング実施、4.成果測定、5.フィードバック',
            successCriteria: 'スキル向上測定可能、目標達成率80%以上'
          }
        ]
      },
      {
        serviceName: 'productivity-visualization',
        operations: [
          {
            name: 'time-recording',
            displayName: '工数を記録する',
            description: 'コンサルタントの日々の作業時間を正確かつ効率的に記録する',
            businessValue: '請求精度向上、業務分析精度向上、生産性可視化',
            stakeholders: 'コンサルタント、プロジェクトマネージャー、経理担当者',
            keySteps: '1.作業開始記録、2.作業内容入力、3.時間計測、4.カテゴリ分類、5.データ保存',
            successCriteria: '入力精度99%、リアルタイム記録、承認率95%'
          },
          {
            name: 'timesheet-approval',
            displayName: 'タイムシートを承認する',
            description: '工数データの正確性を確保し、承認プロセスを効率化する',
            businessValue: 'データ品質確保、承認効率50%向上、監査対応',
            stakeholders: '承認者、コンサルタント、経理担当者',
            keySteps: '1.申請受付、2.内容確認、3.妥当性検証、4.承認判断、5.フィードバック',
            successCriteria: '承認処理時間24時間以内、データ精度99%以上'
          }
        ]
      },
      {
        serviceName: 'collaboration-facilitation',
        operations: [
          {
            name: 'notification-delivery',
            displayName: '通知を配信する',
            description: 'システムイベントや重要な情報を適切なタイミングで関係者に通知する',
            businessValue: '情報伝達効率向上、意思決定迅速化、見落としリスク軽減',
            stakeholders: 'システム管理者、プロジェクトメンバー、マネージャー',
            keySteps: '1.イベント検知、2.通知対象特定、3.メッセージ生成、4.配信実行、5.配信確認',
            successCriteria: '配信成功率99%以上、配信時間1分以内'
          },
          {
            name: 'communication-facilitation',
            displayName: 'コミュニケーションを促進する',
            description: 'チーム間・プロジェクト間の効果的なコミュニケーションを実現する',
            businessValue: 'コラボレーション効率30%向上、情報共有精度向上',
            stakeholders: 'チームメンバー、プロジェクトマネージャー、クライアント',
            keySteps: '1.チャンネル作成、2.メンバー招待、3.議論促進、4.情報整理、5.アーカイブ',
            successCriteria: 'アクティブ参加率80%以上、情報共有精度95%'
          }
        ]
      },
      {
        serviceName: 'knowledge-cocreation',
        operations: [
          {
            name: 'knowledge-accumulation',
            displayName: '知識を蓄積する',
            description: 'プロジェクトで得られた貴重な知識やノウハウを体系的に蓄積する',
            businessValue: '知識資産価値向上、再利用率70%向上、品質向上',
            stakeholders: 'ナレッジマネージャー、コンサルタント、品質管理者',
            keySteps: '1.知識特定、2.内容整理、3.分類・タグ付け、4.品質確認、5.公開・共有',
            successCriteria: '知識登録数月20件以上、品質スコア4.0以上'
          },
          {
            name: 'knowledge-utilization',
            displayName: '知識を検索・活用する',
            description: '蓄積された知識を効果的に検索・活用し、プロジェクトの品質向上を図る',
            businessValue: '作業効率30%向上、品質向上、学習時間短縮',
            stakeholders: 'コンサルタント、プロジェクトマネージャー、新入社員',
            keySteps: '1.検索実行、2.内容確認、3.適用検討、4.活用実施、5.フィードバック',
            successCriteria: '検索精度90%以上、活用率60%以上'
          }
        ]
      },
      {
        serviceName: 'revenue-optimization',
        operations: [
          {
            name: 'revenue-tracking',
            displayName: '収益を追跡する',
            description: 'プロジェクト毎の収益をリアルタイムで追跡し、収益性を可視化する',
            businessValue: '収益可視化100%、意思決定迅速化、収益性15%向上',
            stakeholders: '財務担当者、プロジェクトマネージャー、経営陣',
            keySteps: '1.収益データ収集、2.集計・分析、3.可視化、4.報告、5.改善提案',
            successCriteria: 'データ精度99%以上、リアルタイム更新、予測精度90%'
          },
          {
            name: 'cost-management',
            displayName: 'コストを管理する',
            description: 'プロジェクト関連コストを適切に管理し、収益性を最適化する',
            businessValue: 'コスト削減10%、予算精度95%向上、利益率改善',
            stakeholders: '経理担当者、プロジェクトマネージャー、調達担当者',
            keySteps: '1.コスト計画、2.実績収集、3.差異分析、4.最適化提案、5.実行管理',
            successCriteria: 'コスト精度95%以上、削減目標達成、予算遵守率90%'
          }
        ]
      }
    ];
    
    // Create capabilities and operations
    let totalCapabilities = 0;
    let totalOperations = 0;
    
    for (const serviceData of capabilityData) {
      const service = services.find(s => s.name === serviceData.serviceName);
      if (!service) {
        console.log(`⚠️  Service ${serviceData.serviceName} not found, skipping...`);
        continue;
      }
      
      // Create capabilities
      for (const capData of serviceData.capabilities) {
        const capability = await parasolDb.businessCapability.create({
          data: {
            name: capData.name,
            displayName: capData.displayName,
            description: capData.description,
            definition: `# ${capData.displayName}\n\n${capData.description}\n\n## ビジネス価値\n${capData.businessValue}\n\n## 主要指標\n${capData.keyMetrics}\n\n## 必要リソース\n${capData.requiredResources}`,
            category: 'core', // デフォルトカテゴリを設定
            serviceId: service.id
          }
        });
        totalCapabilities++;
        console.log(`✓ Created capability: ${capability.displayName}`);
        
        // Create operations for this capability
        const serviceOperations = operationData.find(od => od.serviceName === serviceData.serviceName);
        if (serviceOperations) {
          for (const opData of serviceOperations.operations) {
            const operation = await parasolDb.businessOperation.create({
              data: {
                name: opData.name,
                displayName: opData.displayName,
                design: `# ${opData.displayName}\n\n${opData.description}\n\n## ビジネス価値\n${opData.businessValue}\n\n## ステークホルダー\n${opData.stakeholders}\n\n## 主要ステップ\n${opData.keySteps}\n\n## 成功基準\n${opData.successCriteria}`,
                pattern: 'Workflow', // デフォルトパターン
                goal: opData.businessValue,
                roles: JSON.stringify([opData.stakeholders]),
                operations: JSON.stringify({ steps: opData.keySteps }),
                businessStates: JSON.stringify({ initial: 'start', final: 'complete' }),
                useCases: JSON.stringify([{ name: opData.displayName, description: opData.description }]),
                uiDefinitions: JSON.stringify({ pages: [] }),
                testCases: JSON.stringify({ criteria: opData.successCriteria }),
                capabilityId: capability.id,
                serviceId: service.id
              }
            });
            totalOperations++;
            console.log(`  ✓ Created operation: ${operation.displayName}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Successfully restored:`)
    console.log(`  📊 Business Capabilities: ${totalCapabilities}`)
    console.log(`  ⚙️  Business Operations: ${totalOperations}`)
    
  } catch (error) {
    console.error('❌ Error restoring capabilities and operations:', error);
    throw error;
  } finally {
    await parasolDb.$disconnect();
  }
}

// Run the function
restoreCapabilitiesAndOperations()
  .then(() => {
    console.log('\n✨ Capabilities and operations restore completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Capabilities and operations restore failed:', error);
    process.exit(1);
  });