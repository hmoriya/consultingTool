import { PrismaClient as ParasolPrismaClient } from '@prisma/parasol-client';

const parasolDb = new ParasolPrismaClient({
  datasources: {
    db: {
      url: process.env.PARASOL_DATABASE_URL || 'file:./prisma/parasol-service/data/parasol.db'
    }
  }
});

export async function seedParasol() {
  console.log('🌱 Seeding Parasol service...');

  try {
    // 既存データをクリア
    await parasolDb.businessOperation.deleteMany({});
    await parasolDb.businessCapability.deleteMany({});
    await parasolDb.service.deleteMany({});

    // サービスの作成
    const services = await Promise.all([
      // プロジェクト管理サービス
      parasolDb.service.create({
        data: {
          name: 'project-service',
          displayName: 'プロジェクト管理サービス',
          description: 'プロジェクトの計画、実行、監視、完了までのライフサイクル全体を管理',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Project Management API',
              version: '1.0.0',
              description: 'プロジェクト管理サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      }),

      // リソース管理サービス
      parasolDb.service.create({
        data: {
          name: 'resource-service',
          displayName: 'リソース管理サービス',
          description: 'チームメンバー、スキル、稼働率などのリソース情報を一元管理',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Resource Management API',
              version: '1.0.0',
              description: 'リソース管理サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      }),

      // 財務管理サービス
      parasolDb.service.create({
        data: {
          name: 'finance-service',
          displayName: '財務管理サービス',
          description: 'プロジェクトの収益、コスト、予算、請求などの財務情報を管理',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Finance Management API',
              version: '1.0.0',
              description: '財務管理サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      }),

      // タイムシート管理サービス
      parasolDb.service.create({
        data: {
          name: 'timesheet-service',
          displayName: 'タイムシート管理サービス',
          description: '工数入力、承認、集計などの勤怠管理機能を提供',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Timesheet Management API',
              version: '1.0.0',
              description: 'タイムシート管理サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      }),

      // 通知サービス
      parasolDb.service.create({
        data: {
          name: 'notification-service',
          displayName: '通知サービス',
          description: 'システム内の各種通知、メッセージ、アラートを管理・配信',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Notification Service API',
              version: '1.0.0',
              description: '通知サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      }),

      // ナレッジ管理サービス
      parasolDb.service.create({
        data: {
          name: 'knowledge-service',
          displayName: 'ナレッジ管理サービス',
          description: 'プロジェクトの知識、ドキュメント、ベストプラクティスを蓄積・共有',
          domainLanguage: JSON.stringify({
            entities: [],
            valueObjects: [],
            domainServices: [],
            version: '1.0.0',
            lastModified: new Date().toISOString()
          }),
          apiSpecification: JSON.stringify({
            openapi: '3.0.0',
            info: {
              title: 'Knowledge Management API',
              version: '1.0.0',
              description: 'ナレッジ管理サービスのAPI'
            },
            paths: {}
          }),
          dbSchema: JSON.stringify({
            tables: [],
            relations: [],
            indexes: []
          })
        }
      })
    ]);

    console.log(`✅ Created ${services.length} services`);

    // ビジネスケーパビリティの作成
    const capabilities = [];

    // プロジェクト管理サービスのケーパビリティ
    const projectService = services.find(s => s.name === 'project-service')!;
    const projectCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: projectService.id,
          name: 'ProjectLifecycleManagement',
          displayName: 'プロジェクトライフサイクル管理',
          description: 'プロジェクトの開始から終了までの全フェーズを管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: projectService.id,
          name: 'TaskManagement',
          displayName: 'タスク管理',
          description: 'プロジェクト内のタスクの作成、割り当て、追跡',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: projectService.id,
          name: 'RiskManagement',
          displayName: 'リスク管理',
          description: 'プロジェクトリスクの識別、評価、対応策の管理',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...projectCaps);

    // リソース管理サービスのケーパビリティ
    const resourceService = services.find(s => s.name === 'resource-service')!;
    const resourceCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: resourceService.id,
          name: 'TeamManagement',
          displayName: 'チーム管理',
          description: 'チーム構成とメンバーの管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: resourceService.id,
          name: 'SkillManagement',
          displayName: 'スキル管理',
          description: 'メンバーのスキルセットと専門性の管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: resourceService.id,
          name: 'UtilizationManagement',
          displayName: '稼働率管理',
          description: 'リソースの稼働状況と可用性の管理',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...resourceCaps);

    // 財務管理サービスのケーパビリティ
    const financeService = services.find(s => s.name === 'finance-service')!;
    const financeCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: financeService.id,
          name: 'BudgetManagement',
          displayName: '予算管理',
          description: 'プロジェクト予算の計画、追跡、管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: financeService.id,
          name: 'CostTracking',
          displayName: 'コスト追跡',
          description: 'プロジェクトコストの記録と分析',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: financeService.id,
          name: 'BillingManagement',
          displayName: '請求管理',
          description: 'クライアントへの請求処理と管理',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...financeCaps);

    console.log(`✅ Created ${capabilities.length} business capabilities`);

    // ビジネスオペレーションの作成
    const operations = [];

    // プロジェクトライフサイクル管理のオペレーション
    const projectLifecycleCap = projectCaps.find(c => c.name === 'ProjectLifecycleManagement')!;
    const projectOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: projectService.id,
          capabilityId: projectLifecycleCap.id,
          name: 'createProject',
          displayName: 'プロジェクト作成',
          pattern: 'CRUD',
          goal: '新規プロジェクトを作成し、基本情報を設定する',
          roles: JSON.stringify(['PM', 'Executive']),
          operations: JSON.stringify(['create', 'validate', 'notify']),
          businessStates: JSON.stringify(['draft', 'active']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: projectService.id,
          capabilityId: projectLifecycleCap.id,
          name: 'approveProject',
          displayName: 'プロジェクト承認',
          pattern: 'Workflow',
          goal: 'プロジェクトの開始を承認する',
          roles: JSON.stringify(['Executive']),
          operations: JSON.stringify(['review', 'approve', 'notify']),
          businessStates: JSON.stringify(['pending', 'approved', 'rejected']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: projectService.id,
          capabilityId: projectLifecycleCap.id,
          name: 'closeProject',
          displayName: 'プロジェクト完了',
          pattern: 'Workflow',
          goal: 'プロジェクトを正式に完了させる',
          roles: JSON.stringify(['PM']),
          operations: JSON.stringify(['validate', 'archive', 'notify']),
          businessStates: JSON.stringify(['active', 'closing', 'closed']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...projectOps);

    // タスク管理のオペレーション
    const taskCap = projectCaps.find(c => c.name === 'TaskManagement')!;
    const taskOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: projectService.id,
          capabilityId: taskCap.id,
          name: 'createTask',
          displayName: 'タスク作成',
          pattern: 'CRUD',
          goal: '新規タスクを作成し、チームメンバーに割り当てる',
          roles: JSON.stringify(['PM', 'Consultant']),
          operations: JSON.stringify(['create', 'assign', 'notify']),
          businessStates: JSON.stringify(['todo', 'assigned']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: projectService.id,
          capabilityId: taskCap.id,
          name: 'updateTaskStatus',
          displayName: 'タスクステータス更新',
          pattern: 'CRUD',
          goal: 'タスクの進捗状況を更新する',
          roles: JSON.stringify(['Consultant']),
          operations: JSON.stringify(['validate', 'update', 'notify']),
          businessStates: JSON.stringify(['todo', 'in_progress', 'done']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...taskOps);

    // 予算管理のオペレーション
    const budgetCap = financeCaps.find(c => c.name === 'BudgetManagement')!;
    const budgetOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: financeService.id,
          capabilityId: budgetCap.id,
          name: 'createBudget',
          displayName: '予算作成',
          pattern: 'CRUD',
          goal: 'プロジェクトの予算計画を作成する',
          roles: JSON.stringify(['PM', 'Executive']),
          operations: JSON.stringify(['create', 'calculate', 'validate']),
          businessStates: JSON.stringify(['draft', 'submitted']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: financeService.id,
          capabilityId: budgetCap.id,
          name: 'approveBudget',
          displayName: '予算承認',
          pattern: 'Workflow',
          goal: 'プロジェクト予算を承認する',
          roles: JSON.stringify(['Executive']),
          operations: JSON.stringify(['review', 'approve', 'notify']),
          businessStates: JSON.stringify(['submitted', 'approved', 'rejected']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: financeService.id,
          capabilityId: budgetCap.id,
          name: 'trackBudgetUtilization',
          displayName: '予算消化追跡',
          pattern: 'Analytics',
          goal: '予算の使用状況を追跡・分析する',
          roles: JSON.stringify(['PM', 'Executive']),
          operations: JSON.stringify(['calculate', 'analyze', 'report']),
          businessStates: JSON.stringify(['active']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...budgetOps);

    console.log(`✅ Created ${operations.length} business operations`);
    
    console.log('✅ Parasol service seeding completed');

  } catch (error) {
    console.error('❌ Error seeding Parasol service:', error);
    throw error;
  } finally {
    await parasolDb.$disconnect();
  }
}

// 単独実行用
if (require.main === module) {
  seedParasol()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}