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
            entities: [
              {
                name: 'Project',
                displayName: 'プロジェクト',
                description: 'プロジェクトの基本情報と状態を管理する集約ルート',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'name', type: 'STRING_100', required: true, description: 'プロジェクト名' },
                  { name: 'code', type: 'STRING_20', required: true, description: 'プロジェクトコード' },
                  { name: 'clientId', type: 'UUID', required: true, description: 'クライアントID' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'active', 'closed'] },
                  { name: 'startDate', type: 'DATE', required: true, description: '開始日' },
                  { name: 'endDate', type: 'DATE', required: true, description: '終了日' },
                  { name: 'budget', type: 'MONEY', required: false, description: '予算' },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' },
                  { name: 'updatedAt', type: 'TIMESTAMP', required: true, description: '更新日時' }
                ],
                businessRules: [
                  '終了日は開始日より後でなければならない',
                  'ステータスがclosedの場合、変更不可',
                  'プロジェクトコードは一意である必要がある'
                ],
                domainEvents: [
                  { name: 'ProjectCreated', displayName: 'プロジェクト作成済み', properties: ['id', 'name', 'code', 'clientId'] },
                  { name: 'ProjectApproved', displayName: 'プロジェクト承認済み', properties: ['id', 'approvedBy', 'approvedAt'] },
                  { name: 'ProjectClosed', displayName: 'プロジェクト完了済み', properties: ['id', 'closedAt', 'finalReport'] }
                ],
                isAggregate: true
              },
              {
                name: 'Task',
                displayName: 'タスク',
                description: 'プロジェクト内の作業単位',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'タスクID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'title', type: 'STRING_100', required: true, description: 'タスクタイトル' },
                  { name: 'description', type: 'TEXT', required: false, description: 'タスク詳細' },
                  { name: 'assigneeId', type: 'UUID', required: false, description: '担当者ID' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['todo', 'in_progress', 'done'] },
                  { name: 'priority', type: 'ENUM', required: true, description: '優先度', enumValues: ['low', 'medium', 'high'] },
                  { name: 'dueDate', type: 'DATE', required: false, description: '期限' },
                  { name: 'estimatedHours', type: 'DECIMAL', required: false, description: '見積工数' },
                  { name: 'actualHours', type: 'DECIMAL', required: false, description: '実績工数' }
                ],
                businessRules: [
                  '完了済みタスクの見積工数は変更不可',
                  'タスクの削除は作成者またはPMのみ可能'
                ],
                domainEvents: [
                  { name: 'TaskCreated', displayName: 'タスク作成済み', properties: ['id', 'title', 'projectId'] },
                  { name: 'TaskCompleted', displayName: 'タスク完了済み', properties: ['id', 'completedBy', 'completedAt'] }
                ],
                isAggregate: false
              },
              {
                name: 'Risk',
                displayName: 'リスク',
                description: 'プロジェクトリスクの管理',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'リスクID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'description', type: 'TEXT', required: true, description: 'リスク内容' },
                  { name: 'probability', type: 'ENUM', required: true, description: '発生確率', enumValues: ['low', 'medium', 'high'] },
                  { name: 'impact', type: 'ENUM', required: true, description: '影響度', enumValues: ['low', 'medium', 'high'] },
                  { name: 'mitigation', type: 'TEXT', required: false, description: '軽減策' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['identified', 'mitigated', 'realized', 'closed'] },
                  { name: 'identifiedBy', type: 'UUID', required: true, description: '識別者' },
                  { name: 'identifiedAt', type: 'TIMESTAMP', required: true, description: '識別日時' }
                ],
                businessRules: [
                  '高影響度のリスクはPMの承認が必要',
                  'リスクステータスは後戻り不可'
                ],
                domainEvents: [
                  { name: 'RiskIdentified', displayName: 'リスク識別済み', properties: ['id', 'projectId', 'probability', 'impact'] }
                ],
                isAggregate: false
              }
            ],
            valueObjects: [
              {
                name: 'ProjectCode',
                displayName: 'プロジェクトコード',
                description: 'プロジェクトを一意に識別するコード',
                properties: [
                  { name: 'value', type: 'STRING_20', required: true, description: 'コード値' }
                ],
                validationRules: [
                  '英数字とハイフンのみ使用可能',
                  '3文字以上20文字以下'
                ]
              },
              {
                name: 'Money',
                displayName: '金額',
                description: '通貨単位を含む金額',
                properties: [
                  { name: 'amount', type: 'DECIMAL', required: true, description: '金額' },
                  { name: 'currency', type: 'STRING_3', required: true, description: '通貨コード' }
                ],
                validationRules: [
                  '金額は0以上',
                  '通貨コードはISO 4217準拠'
                ]
              }
            ],
            domainServices: [
              {
                name: 'ProjectLifecycleService',
                displayName: 'プロジェクトライフサイクルサービス',
                description: 'プロジェクトのライフサイクル管理に関するビジネスロジック',
                methods: [
                  {
                    name: 'approveProject',
                    displayName: 'プロジェクト承認',
                    description: 'プロジェクトを承認し、アクティブ状態にする',
                    parameters: [
                      { name: 'projectId', type: 'UUID' },
                      { name: 'approvedBy', type: 'UUID' }
                    ],
                    returnType: 'Project'
                  },
                  {
                    name: 'closeProject',
                    displayName: 'プロジェクト完了',
                    description: 'プロジェクトを正式に完了させる',
                    parameters: [
                      { name: 'projectId', type: 'UUID' },
                      { name: 'finalReport', type: 'TEXT' }
                    ],
                    returnType: 'Project'
                  }
                ]
              }
            ],
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
            paths: {
              '/projects': {
                get: {
                  summary: 'プロジェクト一覧取得',
                  tags: ['Projects'],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: 'プロジェクト作成',
                  tags: ['Projects'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/CreateProjectRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '作成成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Project' }
                        }
                      }
                    }
                  }
                }
              },
              '/projects/{projectId}/approve': {
                post: {
                  summary: 'プロジェクト承認',
                  tags: ['Projects'],
                  parameters: [
                    {
                      name: 'projectId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '承認成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Project' }
                        }
                      }
                    }
                  }
                }
              },
              '/projects/{projectId}/tasks': {
                get: {
                  summary: 'プロジェクトのタスク一覧取得',
                  tags: ['Tasks'],
                  parameters: [
                    {
                      name: 'projectId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Task' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'projects',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'name', type: 'VARCHAR(100)', nullable: false },
                  { name: 'code', type: 'VARCHAR(20)', nullable: false, unique: true },
                  { name: 'client_id', type: 'UUID', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'start_date', type: 'DATE', nullable: false },
                  { name: 'end_date', type: 'DATE', nullable: false },
                  { name: 'budget_amount', type: 'DECIMAL(15,2)', nullable: true },
                  { name: 'budget_currency', type: 'VARCHAR(3)', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'tasks',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'title', type: 'VARCHAR(100)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: true },
                  { name: 'assignee_id', type: 'UUID', nullable: true },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'priority', type: 'VARCHAR(10)', nullable: false },
                  { name: 'due_date', type: 'DATE', nullable: true },
                  { name: 'estimated_hours', type: 'DECIMAL(8,2)', nullable: true },
                  { name: 'actual_hours', type: 'DECIMAL(8,2)', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'risks',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: false },
                  { name: 'probability', type: 'VARCHAR(10)', nullable: false },
                  { name: 'impact', type: 'VARCHAR(10)', nullable: false },
                  { name: 'mitigation', type: 'TEXT', nullable: true },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'identified_by', type: 'UUID', nullable: false },
                  { name: 'identified_at', type: 'TIMESTAMP', nullable: false }
                ]
              }
            ],
            relations: [
              {
                name: 'project_tasks',
                from: 'tasks.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              },
              {
                name: 'project_risks',
                from: 'risks.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'projects', columns: ['code'], unique: true },
              { table: 'projects', columns: ['status'] },
              { table: 'tasks', columns: ['project_id', 'status'] },
              { table: 'risks', columns: ['project_id', 'status'] }
            ]
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
            entities: [
              {
                name: 'TeamMember',
                displayName: 'チームメンバー',
                description: 'プロジェクトチームのメンバー情報',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'メンバーID' },
                  { name: 'userId', type: 'UUID', required: true, description: 'ユーザーID' },
                  { name: 'name', type: 'STRING_50', required: true, description: '氏名' },
                  { name: 'email', type: 'EMAIL', required: true, description: 'メールアドレス' },
                  { name: 'role', type: 'ENUM', required: true, description: '役割', enumValues: ['PM', 'consultant', 'analyst', 'developer'] },
                  { name: 'level', type: 'ENUM', required: true, description: 'レベル', enumValues: ['junior', 'middle', 'senior', 'expert'] },
                  { name: 'department', type: 'STRING_50', required: true, description: '部門' },
                  { name: 'joinedAt', type: 'DATE', required: true, description: '入社日' },
                  { name: 'isActive', type: 'BOOLEAN', required: true, description: 'アクティブフラグ' }
                ],
                businessRules: [
                  '稼働中のプロジェクトがある場合は非アクティブ化不可',
                  'PM権限の付与は承認が必要'
                ],
                domainEvents: [
                  { name: 'MemberJoined', displayName: 'メンバー参画', properties: ['id', 'name', 'role'] },
                  { name: 'MemberLeft', displayName: 'メンバー離脱', properties: ['id', 'leftAt'] }
                ],
                isAggregate: true
              },
              {
                name: 'Skill',
                displayName: 'スキル',
                description: 'メンバーが保有するスキル',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'スキルID' },
                  { name: 'memberId', type: 'UUID', required: true, description: 'メンバーID' },
                  { name: 'category', type: 'STRING_50', required: true, description: 'カテゴリー' },
                  { name: 'name', type: 'STRING_50', required: true, description: 'スキル名' },
                  { name: 'level', type: 'INTEGER', required: true, description: 'スキルレベル(1-5)' },
                  { name: 'yearsOfExperience', type: 'DECIMAL', required: false, description: '経験年数' },
                  { name: 'certifications', type: 'TEXT', required: false, description: '資格・認定' },
                  { name: 'lastUsedAt', type: 'DATE', required: false, description: '最終使用日' }
                ],
                businessRules: [
                  'スキルレベルは1-5の範囲',
                  '同一メンバーで同じスキルの重複登録不可'
                ],
                domainEvents: [
                  { name: 'SkillAcquired', displayName: 'スキル習得', properties: ['id', 'memberId', 'name', 'level'] }
                ],
                isAggregate: false
              },
              {
                name: 'ResourceAllocation',
                displayName: 'リソース配分',
                description: 'プロジェクトへのリソース割り当て',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '配分ID' },
                  { name: 'memberId', type: 'UUID', required: true, description: 'メンバーID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'allocationRate', type: 'PERCENTAGE', required: true, description: '配分率' },
                  { name: 'startDate', type: 'DATE', required: true, description: '開始日' },
                  { name: 'endDate', type: 'DATE', required: true, description: '終了日' },
                  { name: 'role', type: 'STRING_50', required: true, description: 'プロジェクト内役割' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['planned', 'active', 'completed'] }
                ],
                businessRules: [
                  '同一期間の配分率合計は100%を超えない',
                  '終了日は開始日より後'
                ],
                domainEvents: [
                  { name: 'ResourceAllocated', displayName: 'リソース配分', properties: ['id', 'memberId', 'projectId', 'allocationRate'] }
                ],
                isAggregate: false
              }
            ],
            valueObjects: [
              {
                name: 'SkillLevel',
                displayName: 'スキルレベル',
                description: 'スキルの習熟度を表す値',
                properties: [
                  { name: 'value', type: 'INTEGER', required: true, description: 'レベル値' }
                ],
                validationRules: [
                  '1から5の整数値',
                  '1:初級、2:基礎、3:中級、4:上級、5:専門家'
                ]
              },
              {
                name: 'AllocationRate',
                displayName: '配分率',
                description: 'リソースの配分割合',
                properties: [
                  { name: 'value', type: 'PERCENTAGE', required: true, description: 'パーセンテージ' }
                ],
                validationRules: [
                  '0から100の範囲',
                  '5%単位での設定'
                ]
              }
            ],
            domainServices: [
              {
                name: 'UtilizationService',
                displayName: '稼働率サービス',
                description: 'リソースの稼働率計算と最適化',
                methods: [
                  {
                    name: 'calculateUtilization',
                    displayName: '稼働率計算',
                    description: 'メンバーの稼働率を計算する',
                    parameters: [
                      { name: 'memberId', type: 'UUID' },
                      { name: 'period', type: 'DateRange' }
                    ],
                    returnType: 'UtilizationReport'
                  },
                  {
                    name: 'findAvailableResources',
                    displayName: '利用可能リソース検索',
                    description: '条件に合う利用可能なリソースを検索',
                    parameters: [
                      { name: 'skills', type: 'SkillRequirement[]' },
                      { name: 'period', type: 'DateRange' }
                    ],
                    returnType: 'TeamMember[]'
                  }
                ]
              }
            ],
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
            paths: {
              '/members': {
                get: {
                  summary: 'チームメンバー一覧取得',
                  tags: ['Members'],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TeamMember' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '/members/{memberId}/skills': {
                get: {
                  summary: 'メンバーのスキル一覧取得',
                  tags: ['Skills'],
                  parameters: [
                    {
                      name: 'memberId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Skill' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '/utilization/{memberId}': {
                get: {
                  summary: 'メンバーの稼働率取得',
                  tags: ['Utilization'],
                  parameters: [
                    {
                      name: 'memberId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/UtilizationReport' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'team_members',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'user_id', type: 'UUID', nullable: false, unique: true },
                  { name: 'name', type: 'VARCHAR(50)', nullable: false },
                  { name: 'email', type: 'VARCHAR(100)', nullable: false },
                  { name: 'role', type: 'VARCHAR(20)', nullable: false },
                  { name: 'level', type: 'VARCHAR(20)', nullable: false },
                  { name: 'department', type: 'VARCHAR(50)', nullable: false },
                  { name: 'joined_at', type: 'DATE', nullable: false },
                  { name: 'is_active', type: 'BOOLEAN', nullable: false }
                ]
              },
              {
                name: 'skills',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'member_id', type: 'UUID', nullable: false },
                  { name: 'category', type: 'VARCHAR(50)', nullable: false },
                  { name: 'name', type: 'VARCHAR(50)', nullable: false },
                  { name: 'level', type: 'INTEGER', nullable: false },
                  { name: 'years_of_experience', type: 'DECIMAL(4,1)', nullable: true },
                  { name: 'certifications', type: 'TEXT', nullable: true },
                  { name: 'last_used_at', type: 'DATE', nullable: true }
                ]
              },
              {
                name: 'resource_allocations',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'member_id', type: 'UUID', nullable: false },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'allocation_rate', type: 'INTEGER', nullable: false },
                  { name: 'start_date', type: 'DATE', nullable: false },
                  { name: 'end_date', type: 'DATE', nullable: false },
                  { name: 'role', type: 'VARCHAR(50)', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false }
                ]
              }
            ],
            relations: [
              {
                name: 'member_skills',
                from: 'skills.member_id',
                to: 'team_members.id',
                type: 'many-to-one'
              },
              {
                name: 'member_allocations',
                from: 'resource_allocations.member_id',
                to: 'team_members.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'team_members', columns: ['user_id'], unique: true },
              { table: 'team_members', columns: ['is_active'] },
              { table: 'skills', columns: ['member_id', 'name'], unique: true },
              { table: 'resource_allocations', columns: ['member_id', 'start_date', 'end_date'] }
            ]
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
            entities: [
              {
                name: 'Budget',
                displayName: '予算',
                description: 'プロジェクトの予算計画と管理',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '予算ID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'fiscalYear', type: 'INTEGER', required: true, description: '会計年度' },
                  { name: 'totalAmount', type: 'MONEY', required: true, description: '総予算額' },
                  { name: 'allocatedAmount', type: 'MONEY', required: true, description: '配分済み金額' },
                  { name: 'spentAmount', type: 'MONEY', required: true, description: '消化金額' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'submitted', 'approved', 'active', 'closed'] },
                  { name: 'approvedBy', type: 'UUID', required: false, description: '承認者ID' },
                  { name: 'approvedAt', type: 'TIMESTAMP', required: false, description: '承認日時' },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' },
                  { name: 'updatedAt', type: 'TIMESTAMP', required: true, description: '更新日時' }
                ],
                businessRules: [
                  '配分済み金額は総予算額を超えてはならない',
                  '承認済み予算の総額変更はエグゼクティブ権限が必要',
                  '会計年度終了後の予算は変更不可'
                ],
                domainEvents: [
                  { name: 'BudgetCreated', displayName: '予算作成済み', properties: ['id', 'projectId', 'totalAmount'] },
                  { name: 'BudgetApproved', displayName: '予算承認済み', properties: ['id', 'approvedBy', 'approvedAt'] },
                  { name: 'BudgetOverrun', displayName: '予算超過', properties: ['id', 'spentAmount', 'totalAmount'] }
                ],
                isAggregate: true
              },
              {
                name: 'Cost',
                displayName: 'コスト',
                description: 'プロジェクトで発生した実際のコスト',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'コストID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'budgetId', type: 'UUID', required: false, description: '予算ID' },
                  { name: 'category', type: 'ENUM', required: true, description: 'コストカテゴリ', enumValues: ['labor', 'material', 'travel', 'equipment', 'other'] },
                  { name: 'description', type: 'TEXT', required: true, description: '説明' },
                  { name: 'amount', type: 'MONEY', required: true, description: '金額' },
                  { name: 'incurredDate', type: 'DATE', required: true, description: '発生日' },
                  { name: 'recordedBy', type: 'UUID', required: true, description: '記録者ID' },
                  { name: 'approvalStatus', type: 'ENUM', required: true, description: '承認状態', enumValues: ['pending', 'approved', 'rejected'] },
                  { name: 'receipt', type: 'TEXT', required: false, description: '領収書URL' }
                ],
                businessRules: [
                  '労務費は工数データと連動',
                  '一定額以上の支出は承認必要',
                  '領収書の添付は必須'
                ],
                domainEvents: [
                  { name: 'CostRecorded', displayName: 'コスト記録済み', properties: ['id', 'projectId', 'amount', 'category'] },
                  { name: 'CostApproved', displayName: 'コスト承認済み', properties: ['id', 'approvedBy', 'approvedAt'] }
                ],
                isAggregate: false
              },
              {
                name: 'Invoice',
                displayName: '請求書',
                description: 'クライアントへの請求書管理',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '請求書ID' },
                  { name: 'invoiceNumber', type: 'STRING_20', required: true, description: '請求書番号' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'clientId', type: 'UUID', required: true, description: 'クライアントID' },
                  { name: 'issuedDate', type: 'DATE', required: true, description: '発行日' },
                  { name: 'dueDate', type: 'DATE', required: true, description: '支払期限' },
                  { name: 'amount', type: 'MONEY', required: true, description: '請求金額' },
                  { name: 'taxAmount', type: 'MONEY', required: true, description: '税額' },
                  { name: 'totalAmount', type: 'MONEY', required: true, description: '総額' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'sent', 'overdue', 'paid', 'cancelled'] },
                  { name: 'paidAt', type: 'TIMESTAMP', required: false, description: '支払済み日時' }
                ],
                businessRules: [
                  '支払期限は発行日より後',
                  '請求書番号は一意',
                  'キャンセル済み請求書は編集不可'
                ],
                domainEvents: [
                  { name: 'InvoiceIssued', displayName: '請求書発行済み', properties: ['id', 'invoiceNumber', 'clientId', 'totalAmount'] },
                  { name: 'PaymentReceived', displayName: '支払受領済み', properties: ['id', 'paidAt', 'amount'] }
                ],
                isAggregate: true
              }
            ],
            valueObjects: [
              {
                name: 'FiscalPeriod',
                displayName: '会計期間',
                description: '会計年度と四半期を表す',
                properties: [
                  { name: 'year', type: 'INTEGER', required: true, description: '年度' },
                  { name: 'quarter', type: 'INTEGER', required: false, description: '四半期' }
                ],
                validationRules: [
                  '年度は2000年以降',
                  '四半期は1-4の範囲'
                ]
              },
              {
                name: 'CostCategory',
                displayName: 'コストカテゴリ',
                description: '支出の分類',
                properties: [
                  { name: 'code', type: 'STRING_10', required: true, description: 'カテゴリコード' },
                  { name: 'name', type: 'STRING_50', required: true, description: 'カテゴリ名' }
                ],
                validationRules: [
                  'コードは英数字のみ',
                  '予め定義されたカテゴリから選択'
                ]
              }
            ],
            domainServices: [
              {
                name: 'BudgetCalculationService',
                displayName: '予算計算サービス',
                description: '予算の計算と分析を行う',
                methods: [
                  {
                    name: 'calculateUtilization',
                    displayName: '予算消化率計算',
                    description: '予算の消化率を計算する',
                    parameters: [
                      { name: 'budgetId', type: 'UUID' }
                    ],
                    returnType: 'UtilizationReport'
                  },
                  {
                    name: 'forecastOverrun',
                    displayName: '予算超過予測',
                    description: '現在の支出ペースから予算超過を予測',
                    parameters: [
                      { name: 'budgetId', type: 'UUID' },
                      { name: 'currentSpending', type: 'Money' }
                    ],
                    returnType: 'OverrunForecast'
                  }
                ]
              },
              {
                name: 'InvoicingService',
                displayName: '請求サービス',
                description: '請求書の生成と管理',
                methods: [
                  {
                    name: 'generateInvoice',
                    displayName: '請求書生成',
                    description: 'プロジェクトの作業内容から請求書を生成',
                    parameters: [
                      { name: 'projectId', type: 'UUID' },
                      { name: 'billingPeriod', type: 'DateRange' }
                    ],
                    returnType: 'Invoice'
                  }
                ]
              }
            ],
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
            paths: {
              '/budgets': {
                get: {
                  summary: '予算一覧取得',
                  tags: ['Budgets'],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Budget' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: '予算作成',
                  tags: ['Budgets'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/CreateBudgetRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '作成成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Budget' }
                        }
                      }
                    }
                  }
                }
              },
              '/budgets/{budgetId}/approve': {
                post: {
                  summary: '予算承認',
                  tags: ['Budgets'],
                  parameters: [
                    {
                      name: 'budgetId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '承認成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Budget' }
                        }
                      }
                    }
                  }
                }
              },
              '/costs': {
                get: {
                  summary: 'コスト一覧取得',
                  tags: ['Costs'],
                  parameters: [
                    {
                      name: 'projectId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Cost' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '/invoices': {
                get: {
                  summary: '請求書一覧取得',
                  tags: ['Invoices'],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Invoice' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'budgets',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'fiscal_year', type: 'INTEGER', nullable: false },
                  { name: 'total_amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'total_currency', type: 'VARCHAR(3)', nullable: false },
                  { name: 'allocated_amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'spent_amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'approved_by', type: 'UUID', nullable: true },
                  { name: 'approved_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'costs',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'budget_id', type: 'UUID', nullable: true },
                  { name: 'category', type: 'VARCHAR(20)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: false },
                  { name: 'amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'currency', type: 'VARCHAR(3)', nullable: false },
                  { name: 'incurred_date', type: 'DATE', nullable: false },
                  { name: 'recorded_by', type: 'UUID', nullable: false },
                  { name: 'approval_status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'receipt_url', type: 'TEXT', nullable: true }
                ]
              },
              {
                name: 'invoices',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'invoice_number', type: 'VARCHAR(20)', nullable: false, unique: true },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'client_id', type: 'UUID', nullable: false },
                  { name: 'issued_date', type: 'DATE', nullable: false },
                  { name: 'due_date', type: 'DATE', nullable: false },
                  { name: 'amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'tax_amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'total_amount', type: 'DECIMAL(15,2)', nullable: false },
                  { name: 'currency', type: 'VARCHAR(3)', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'paid_at', type: 'TIMESTAMP', nullable: true }
                ]
              }
            ],
            relations: [
              {
                name: 'budget_costs',
                from: 'costs.budget_id',
                to: 'budgets.id',
                type: 'many-to-one'
              },
              {
                name: 'project_budgets',
                from: 'budgets.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              },
              {
                name: 'project_invoices',
                from: 'invoices.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'budgets', columns: ['project_id', 'fiscal_year'], unique: true },
              { table: 'costs', columns: ['project_id', 'incurred_date'] },
              { table: 'invoices', columns: ['invoice_number'], unique: true },
              { table: 'invoices', columns: ['status', 'due_date'] }
            ]
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
            entities: [
              {
                name: 'TimeEntry',
                displayName: '工数エントリ',
                description: '日々の作業時間の記録',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '工数エントリID' },
                  { name: 'userId', type: 'UUID', required: true, description: 'ユーザーID' },
                  { name: 'projectId', type: 'UUID', required: true, description: 'プロジェクトID' },
                  { name: 'taskId', type: 'UUID', required: false, description: 'タスクID' },
                  { name: 'date', type: 'DATE', required: true, description: '作業日' },
                  { name: 'hours', type: 'DECIMAL', required: true, description: '作業時間' },
                  { name: 'description', type: 'TEXT', required: true, description: '作業内容' },
                  { name: 'category', type: 'ENUM', required: true, description: '作業カテゴリ', enumValues: ['development', 'meeting', 'documentation', 'review', 'other'] },
                  { name: 'billable', type: 'BOOLEAN', required: true, description: '請求可能フラグ' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'submitted', 'approved', 'rejected'] },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' },
                  { name: 'updatedAt', type: 'TIMESTAMP', required: true, description: '更新日時' }
                ],
                businessRules: [
                  '1日の工数は24時間を超えない',
                  '過去日の工数は一定期間後に編集不可',
                  '承認済み工数の編集はPM権限が必要'
                ],
                domainEvents: [
                  { name: 'TimeEntryCreated', displayName: '工数記録済み', properties: ['id', 'userId', 'projectId', 'hours'] },
                  { name: 'TimeEntrySubmitted', displayName: '工数提出済み', properties: ['id', 'userId', 'submittedAt'] }
                ],
                isAggregate: false
              },
              {
                name: 'Timesheet',
                displayName: 'タイムシート',
                description: '週次または月次の工数集計',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'タイムシートID' },
                  { name: 'userId', type: 'UUID', required: true, description: 'ユーザーID' },
                  { name: 'period', type: 'STRING_20', required: true, description: '期間(YYYY-WWまたはYYYY-MM)' },
                  { name: 'startDate', type: 'DATE', required: true, description: '開始日' },
                  { name: 'endDate', type: 'DATE', required: true, description: '終了日' },
                  { name: 'totalHours', type: 'DECIMAL', required: true, description: '総工数' },
                  { name: 'billableHours', type: 'DECIMAL', required: true, description: '請求可能時間' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'submitted', 'approved', 'rejected'] },
                  { name: 'submittedAt', type: 'TIMESTAMP', required: false, description: '提出日時' },
                  { name: 'approvedBy', type: 'UUID', required: false, description: '承認者ID' },
                  { name: 'approvedAt', type: 'TIMESTAMP', required: false, description: '承認日時' },
                  { name: 'comments', type: 'TEXT', required: false, description: 'コメント' }
                ],
                businessRules: [
                  'タイムシートは週次または月次で提出',
                  '期限を過ぎたタイムシートは自動でロック',
                  '承認はPMまたは上司のみ可能'
                ],
                domainEvents: [
                  { name: 'TimesheetSubmitted', displayName: 'タイムシート提出済み', properties: ['id', 'userId', 'period', 'totalHours'] },
                  { name: 'TimesheetApproved', displayName: 'タイムシート承認済み', properties: ['id', 'approvedBy', 'approvedAt'] },
                  { name: 'TimesheetRejected', displayName: 'タイムシート却下', properties: ['id', 'rejectedBy', 'rejectedAt', 'reason'] }
                ],
                isAggregate: true
              },
              {
                name: 'WorkingHourRule',
                displayName: '勤務時間ルール',
                description: 'プロジェクトやチームごとの勤務ルール',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'ルールID' },
                  { name: 'projectId', type: 'UUID', required: false, description: 'プロジェクトID' },
                  { name: 'teamId', type: 'UUID', required: false, description: 'チームID' },
                  { name: 'standardHoursPerDay', type: 'DECIMAL', required: true, description: '標準勤務時間/日' },
                  { name: 'maxHoursPerDay', type: 'DECIMAL', required: true, description: '最大勤務時間/日' },
                  { name: 'overtimeAllowed', type: 'BOOLEAN', required: true, description: '残業許可フラグ' },
                  { name: 'weekendWorkAllowed', type: 'BOOLEAN', required: true, description: '休日勤務許可フラグ' },
                  { name: 'approvalRequired', type: 'BOOLEAN', required: true, description: '承認必須フラグ' },
                  { name: 'effectiveFrom', type: 'DATE', required: true, description: '適用開始日' },
                  { name: 'effectiveTo', type: 'DATE', required: false, description: '適用終了日' }
                ],
                businessRules: [
                  '標準時間は最大時間以下',
                  'プロジェクトルールがチームルールより優先',
                  '有効期間の重複不可'
                ],
                domainEvents: [
                  { name: 'WorkingHourRuleCreated', displayName: '勤務ルール作成済み', properties: ['id', 'projectId', 'effectiveFrom'] }
                ],
                isAggregate: false
              }
            ],
            valueObjects: [
              {
                name: 'TimesheetPeriod',
                displayName: 'タイムシート期間',
                description: 'タイムシートの集計期間',
                properties: [
                  { name: 'type', type: 'ENUM', required: true, description: '期間タイプ', enumValues: ['weekly', 'monthly'] },
                  { name: 'year', type: 'INTEGER', required: true, description: '年' },
                  { name: 'week', type: 'INTEGER', required: false, description: '週番号' },
                  { name: 'month', type: 'INTEGER', required: false, description: '月' }
                ],
                validationRules: [
                  '週番号は1-53の範囲',
                  '月は1-12の範囲',
                  'タイプがweeklyならweek必須、monthlyならmonth必須'
                ]
              },
              {
                name: 'WorkingHours',
                displayName: '勤務時間',
                description: '日次または総計の勤務時間',
                properties: [
                  { name: 'regular', type: 'DECIMAL', required: true, description: '通常勤務時間' },
                  { name: 'overtime', type: 'DECIMAL', required: false, description: '残業時間' },
                  { name: 'holiday', type: 'DECIMAL', required: false, description: '休日勤務時間' }
                ],
                validationRules: [
                  '各時間は0以上',
                  '合計が24時間/日を超えない'
                ]
              }
            ],
            domainServices: [
              {
                name: 'TimesheetCalculationService',
                displayName: 'タイムシート計算サービス',
                description: '工数の集計と計算を行う',
                methods: [
                  {
                    name: 'aggregateTimeEntries',
                    displayName: '工数集計',
                    description: '期間内の工数エントリを集計',
                    parameters: [
                      { name: 'userId', type: 'UUID' },
                      { name: 'period', type: 'TimesheetPeriod' }
                    ],
                    returnType: 'Timesheet'
                  },
                  {
                    name: 'calculateUtilization',
                    displayName: '稼働率計算',
                    description: 'プロジェクト標準時間に対する稼働率を計算',
                    parameters: [
                      { name: 'userId', type: 'UUID' },
                      { name: 'projectId', type: 'UUID' },
                      { name: 'period', type: 'DateRange' }
                    ],
                    returnType: 'UtilizationRate'
                  }
                ]
              },
              {
                name: 'TimesheetApprovalService',
                displayName: 'タイムシート承認サービス',
                description: 'タイムシートの承認ワークフロー',
                methods: [
                  {
                    name: 'submitTimesheet',
                    displayName: 'タイムシート提出',
                    description: 'タイムシートを承認のため提出',
                    parameters: [
                      { name: 'timesheetId', type: 'UUID' }
                    ],
                    returnType: 'Timesheet'
                  },
                  {
                    name: 'approveTimesheet',
                    displayName: 'タイムシート承認',
                    description: '提出されたタイムシートを承認',
                    parameters: [
                      { name: 'timesheetId', type: 'UUID' },
                      { name: 'approverId', type: 'UUID' },
                      { name: 'comments', type: 'string' }
                    ],
                    returnType: 'Timesheet'
                  }
                ]
              }
            ],
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
            paths: {
              '/time-entries': {
                get: {
                  summary: '工数エントリ一覧取得',
                  tags: ['TimeEntries'],
                  parameters: [
                    {
                      name: 'userId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    },
                    {
                      name: 'projectId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    },
                    {
                      name: 'date',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'date' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TimeEntry' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: '工数エントリ作成',
                  tags: ['TimeEntries'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/CreateTimeEntryRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '作成成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/TimeEntry' }
                        }
                      }
                    }
                  }
                }
              },
              '/timesheets': {
                get: {
                  summary: 'タイムシート一覧取得',
                  tags: ['Timesheets'],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Timesheet' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '/timesheets/{timesheetId}/submit': {
                post: {
                  summary: 'タイムシート提出',
                  tags: ['Timesheets'],
                  parameters: [
                    {
                      name: 'timesheetId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '提出成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Timesheet' }
                        }
                      }
                    }
                  }
                }
              },
              '/timesheets/{timesheetId}/approve': {
                post: {
                  summary: 'タイムシート承認',
                  tags: ['Timesheets'],
                  parameters: [
                    {
                      name: 'timesheetId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  requestBody: {
                    required: false,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            comments: { type: 'string' }
                          }
                        }
                      }
                    }
                  },
                  responses: {
                    '200': {
                      description: '承認成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Timesheet' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'time_entries',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'user_id', type: 'UUID', nullable: false },
                  { name: 'project_id', type: 'UUID', nullable: false },
                  { name: 'task_id', type: 'UUID', nullable: true },
                  { name: 'date', type: 'DATE', nullable: false },
                  { name: 'hours', type: 'DECIMAL(4,2)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: false },
                  { name: 'category', type: 'VARCHAR(20)', nullable: false },
                  { name: 'billable', type: 'BOOLEAN', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'timesheets',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'user_id', type: 'UUID', nullable: false },
                  { name: 'period', type: 'VARCHAR(20)', nullable: false },
                  { name: 'start_date', type: 'DATE', nullable: false },
                  { name: 'end_date', type: 'DATE', nullable: false },
                  { name: 'total_hours', type: 'DECIMAL(6,2)', nullable: false },
                  { name: 'billable_hours', type: 'DECIMAL(6,2)', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'submitted_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'approved_by', type: 'UUID', nullable: true },
                  { name: 'approved_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'comments', type: 'TEXT', nullable: true }
                ]
              },
              {
                name: 'working_hour_rules',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: true },
                  { name: 'team_id', type: 'UUID', nullable: true },
                  { name: 'standard_hours_per_day', type: 'DECIMAL(3,1)', nullable: false },
                  { name: 'max_hours_per_day', type: 'DECIMAL(3,1)', nullable: false },
                  { name: 'overtime_allowed', type: 'BOOLEAN', nullable: false },
                  { name: 'weekend_work_allowed', type: 'BOOLEAN', nullable: false },
                  { name: 'approval_required', type: 'BOOLEAN', nullable: false },
                  { name: 'effective_from', type: 'DATE', nullable: false },
                  { name: 'effective_to', type: 'DATE', nullable: true }
                ]
              }
            ],
            relations: [
              {
                name: 'user_time_entries',
                from: 'time_entries.user_id',
                to: 'users.id',
                type: 'many-to-one'
              },
              {
                name: 'project_time_entries',
                from: 'time_entries.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              },
              {
                name: 'user_timesheets',
                from: 'timesheets.user_id',
                to: 'users.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'time_entries', columns: ['user_id', 'date'] },
              { table: 'time_entries', columns: ['project_id', 'date'] },
              { table: 'timesheets', columns: ['user_id', 'period'], unique: true },
              { table: 'working_hour_rules', columns: ['project_id', 'effective_from'] }
            ]
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
            entities: [
              {
                name: 'Notification',
                displayName: '通知',
                description: 'システムからユーザーへの通知',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '通知ID' },
                  { name: 'recipientId', type: 'UUID', required: true, description: '受信者ID' },
                  { name: 'type', type: 'ENUM', required: true, description: '通知タイプ', enumValues: ['info', 'warning', 'error', 'success', 'task'] },
                  { name: 'category', type: 'ENUM', required: true, description: 'カテゴリ', enumValues: ['project', 'task', 'timesheet', 'budget', 'system'] },
                  { name: 'title', type: 'STRING_100', required: true, description: 'タイトル' },
                  { name: 'content', type: 'TEXT', required: true, description: '内容' },
                  { name: 'priority', type: 'ENUM', required: true, description: '優先度', enumValues: ['low', 'medium', 'high', 'urgent'] },
                  { name: 'relatedEntityType', type: 'STRING_50', required: false, description: '関連エンティティタイプ' },
                  { name: 'relatedEntityId', type: 'UUID', required: false, description: '関連エンティティID' },
                  { name: 'actionUrl', type: 'TEXT', required: false, description: 'アクションURL' },
                  { name: 'isRead', type: 'BOOLEAN', required: true, description: '既読フラグ' },
                  { name: 'readAt', type: 'TIMESTAMP', required: false, description: '既読日時' },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' },
                  { name: 'expiresAt', type: 'TIMESTAMP', required: false, description: '有効期限' }
                ],
                businessRules: [
                  '高優先度の通知は即座に配信',
                  '期限切れの通知は自動的に削除',
                  '既読済み通知は編集不可'
                ],
                domainEvents: [
                  { name: 'NotificationCreated', displayName: '通知作成済み', properties: ['id', 'recipientId', 'type', 'priority'] },
                  { name: 'NotificationRead', displayName: '通知既読済み', properties: ['id', 'readAt'] },
                  { name: 'NotificationExpired', displayName: '通知期限切れ', properties: ['id', 'expiresAt'] }
                ],
                isAggregate: true
              },
              {
                name: 'Message',
                displayName: 'メッセージ',
                description: 'ユーザー間のメッセージ',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'メッセージID' },
                  { name: 'senderId', type: 'UUID', required: true, description: '送信者ID' },
                  { name: 'recipientId', type: 'UUID', required: false, description: '受信者ID（個人宛）' },
                  { name: 'channelId', type: 'UUID', required: false, description: 'チャンネルID（グループ宛）' },
                  { name: 'threadId', type: 'UUID', required: false, description: 'スレッドID' },
                  { name: 'content', type: 'TEXT', required: true, description: 'メッセージ内容' },
                  { name: 'attachments', type: 'TEXT', required: false, description: '添付ファイル情報（JSON）' },
                  { name: 'mentions', type: 'TEXT', required: false, description: 'メンション情報（JSON）' },
                  { name: 'isEdited', type: 'BOOLEAN', required: true, description: '編集済みフラグ' },
                  { name: 'editedAt', type: 'TIMESTAMP', required: false, description: '編集日時' },
                  { name: 'isDeleted', type: 'BOOLEAN', required: true, description: '削除済みフラグ' },
                  { name: 'deletedAt', type: 'TIMESTAMP', required: false, description: '削除日時' },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' }
                ],
                businessRules: [
                  'メッセージの編集は送信者のみ可能',
                  '削除後24時間は復元可能',
                  'チャンネルメッセージはチャンネルメンバーのみ閲覧可能'
                ],
                domainEvents: [
                  { name: 'MessageSent', displayName: 'メッセージ送信済み', properties: ['id', 'senderId', 'recipientId', 'channelId'] },
                  { name: 'MessageEdited', displayName: 'メッセージ編集済み', properties: ['id', 'editedAt'] },
                  { name: 'MessageDeleted', displayName: 'メッセージ削除済み', properties: ['id', 'deletedAt'] }
                ],
                isAggregate: false
              },
              {
                name: 'Alert',
                displayName: 'アラート',
                description: '重要なイベントや異常に関するアラート',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'アラートID' },
                  { name: 'type', type: 'ENUM', required: true, description: 'アラートタイプ', enumValues: ['budget_overrun', 'deadline_approaching', 'resource_conflict', 'system_error'] },
                  { name: 'severity', type: 'ENUM', required: true, description: '重要度', enumValues: ['info', 'warning', 'critical'] },
                  { name: 'source', type: 'STRING_50', required: true, description: '発生元' },
                  { name: 'title', type: 'STRING_100', required: true, description: 'タイトル' },
                  { name: 'description', type: 'TEXT', required: true, description: '詳細説明' },
                  { name: 'affectedEntities', type: 'TEXT', required: false, description: '影響を受けるエンティティ（JSON）' },
                  { name: 'suggestedActions', type: 'TEXT', required: false, description: '推奨アクション（JSON）' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['active', 'acknowledged', 'resolved', 'ignored'] },
                  { name: 'acknowledgedBy', type: 'UUID', required: false, description: '確認者ID' },
                  { name: 'acknowledgedAt', type: 'TIMESTAMP', required: false, description: '確認日時' },
                  { name: 'resolvedBy', type: 'UUID', required: false, description: '解決者ID' },
                  { name: 'resolvedAt', type: 'TIMESTAMP', required: false, description: '解決日時' },
                  { name: 'triggeredAt', type: 'TIMESTAMP', required: true, description: '発生日時' }
                ],
                businessRules: [
                  'クリティカルアラートは即座にエスカレーション',
                  '未確認アラートは定期的に再通知',
                  '解決済みアラートは再発生時に新規作成'
                ],
                domainEvents: [
                  { name: 'AlertTriggered', displayName: 'アラート発生', properties: ['id', 'type', 'severity', 'triggeredAt'] },
                  { name: 'AlertAcknowledged', displayName: 'アラート確認済み', properties: ['id', 'acknowledgedBy', 'acknowledgedAt'] },
                  { name: 'AlertResolved', displayName: 'アラート解決済み', properties: ['id', 'resolvedBy', 'resolvedAt'] }
                ],
                isAggregate: true
              }
            ],
            valueObjects: [
              {
                name: 'NotificationPriority',
                displayName: '通知優先度',
                description: '通知の優先度レベル',
                properties: [
                  { name: 'level', type: 'ENUM', required: true, description: '優先度レベル', enumValues: ['low', 'medium', 'high', 'urgent'] },
                  { name: 'deliveryMethod', type: 'STRING_20', required: true, description: '配信方法' }
                ],
                validationRules: [
                  'urgent優先度は即時配信必須',
                  'low優先度は一括配信可能'
                ]
              },
              {
                name: 'MessageChannel',
                displayName: 'メッセージチャンネル',
                description: 'グループメッセージ用のチャンネル',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'チャンネルID' },
                  { name: 'name', type: 'STRING_50', required: true, description: 'チャンネル名' },
                  { name: 'type', type: 'ENUM', required: true, description: 'チャンネルタイプ', enumValues: ['project', 'team', 'private'] }
                ],
                validationRules: [
                  'チャンネル名は一意',
                  'privateチャンネルは招待制'
                ]
              }
            ],
            domainServices: [
              {
                name: 'NotificationDeliveryService',
                displayName: '通知配信サービス',
                description: '通知の配信と管理を行う',
                methods: [
                  {
                    name: 'sendNotification',
                    displayName: '通知送信',
                    description: '指定された受信者に通知を送信',
                    parameters: [
                      { name: 'recipientId', type: 'UUID' },
                      { name: 'notification', type: 'Notification' }
                    ],
                    returnType: 'DeliveryStatus'
                  },
                  {
                    name: 'batchNotify',
                    displayName: '一括通知',
                    description: '複数の受信者に一括で通知を送信',
                    parameters: [
                      { name: 'recipientIds', type: 'UUID[]' },
                      { name: 'notification', type: 'Notification' }
                    ],
                    returnType: 'BatchDeliveryResult'
                  }
                ]
              },
              {
                name: 'AlertEscalationService',
                displayName: 'アラートエスカレーションサービス',
                description: 'アラートのエスカレーションルールを管理',
                methods: [
                  {
                    name: 'escalateAlert',
                    displayName: 'アラートエスカレーション',
                    description: '未対応アラートを上位レベルにエスカレート',
                    parameters: [
                      { name: 'alertId', type: 'UUID' },
                      { name: 'escalationLevel', type: 'integer' }
                    ],
                    returnType: 'EscalationResult'
                  },
                  {
                    name: 'autoResolve',
                    displayName: '自動解決',
                    description: '条件を満たしたアラートを自動的に解決',
                    parameters: [
                      { name: 'alertId', type: 'UUID' },
                      { name: 'resolutionCriteria', type: 'ResolutionCriteria' }
                    ],
                    returnType: 'Alert'
                  }
                ]
              }
            ],
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
            paths: {
              '/notifications': {
                get: {
                  summary: '通知一覧取得',
                  tags: ['Notifications'],
                  parameters: [
                    {
                      name: 'recipientId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    },
                    {
                      name: 'isRead',
                      in: 'query',
                      required: false,
                      schema: { type: 'boolean' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Notification' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: '通知作成',
                  tags: ['Notifications'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/CreateNotificationRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '作成成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Notification' }
                        }
                      }
                    }
                  }
                }
              },
              '/notifications/{notificationId}/read': {
                put: {
                  summary: '通知を既読にする',
                  tags: ['Notifications'],
                  parameters: [
                    {
                      name: 'notificationId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Notification' }
                        }
                      }
                    }
                  }
                }
              },
              '/messages': {
                get: {
                  summary: 'メッセージ一覧取得',
                  tags: ['Messages'],
                  parameters: [
                    {
                      name: 'channelId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Message' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: 'メッセージ送信',
                  tags: ['Messages'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/SendMessageRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '送信成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Message' }
                        }
                      }
                    }
                  }
                }
              },
              '/alerts': {
                get: {
                  summary: 'アラート一覧取得',
                  tags: ['Alerts'],
                  parameters: [
                    {
                      name: 'status',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', enum: ['active', 'acknowledged', 'resolved'] }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Alert' }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '/alerts/{alertId}/acknowledge': {
                put: {
                  summary: 'アラート確認',
                  tags: ['Alerts'],
                  parameters: [
                    {
                      name: 'alertId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '確認成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Alert' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'notifications',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'recipient_id', type: 'UUID', nullable: false },
                  { name: 'type', type: 'VARCHAR(20)', nullable: false },
                  { name: 'category', type: 'VARCHAR(20)', nullable: false },
                  { name: 'title', type: 'VARCHAR(100)', nullable: false },
                  { name: 'content', type: 'TEXT', nullable: false },
                  { name: 'priority', type: 'VARCHAR(10)', nullable: false },
                  { name: 'related_entity_type', type: 'VARCHAR(50)', nullable: true },
                  { name: 'related_entity_id', type: 'UUID', nullable: true },
                  { name: 'action_url', type: 'TEXT', nullable: true },
                  { name: 'is_read', type: 'BOOLEAN', nullable: false },
                  { name: 'read_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'expires_at', type: 'TIMESTAMP', nullable: true }
                ]
              },
              {
                name: 'messages',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'sender_id', type: 'UUID', nullable: false },
                  { name: 'recipient_id', type: 'UUID', nullable: true },
                  { name: 'channel_id', type: 'UUID', nullable: true },
                  { name: 'thread_id', type: 'UUID', nullable: true },
                  { name: 'content', type: 'TEXT', nullable: false },
                  { name: 'attachments', type: 'TEXT', nullable: true },
                  { name: 'mentions', type: 'TEXT', nullable: true },
                  { name: 'is_edited', type: 'BOOLEAN', nullable: false },
                  { name: 'edited_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'is_deleted', type: 'BOOLEAN', nullable: false },
                  { name: 'deleted_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'alerts',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'type', type: 'VARCHAR(50)', nullable: false },
                  { name: 'severity', type: 'VARCHAR(20)', nullable: false },
                  { name: 'source', type: 'VARCHAR(50)', nullable: false },
                  { name: 'title', type: 'VARCHAR(100)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: false },
                  { name: 'affected_entities', type: 'TEXT', nullable: true },
                  { name: 'suggested_actions', type: 'TEXT', nullable: true },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'acknowledged_by', type: 'UUID', nullable: true },
                  { name: 'acknowledged_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'resolved_by', type: 'UUID', nullable: true },
                  { name: 'resolved_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'triggered_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'message_channels',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'name', type: 'VARCHAR(50)', nullable: false },
                  { name: 'type', type: 'VARCHAR(20)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: true },
                  { name: 'created_by', type: 'UUID', nullable: false },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false }
                ]
              }
            ],
            relations: [
              {
                name: 'recipient_notifications',
                from: 'notifications.recipient_id',
                to: 'users.id',
                type: 'many-to-one'
              },
              {
                name: 'sender_messages',
                from: 'messages.sender_id',
                to: 'users.id',
                type: 'many-to-one'
              },
              {
                name: 'channel_messages',
                from: 'messages.channel_id',
                to: 'message_channels.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'notifications', columns: ['recipient_id', 'is_read'] },
              { table: 'notifications', columns: ['created_at'] },
              { table: 'messages', columns: ['channel_id', 'created_at'] },
              { table: 'alerts', columns: ['status', 'severity'] }
            ]
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
            entities: [
              {
                name: 'Document',
                displayName: 'ドキュメント',
                description: 'プロジェクト関連のドキュメント管理',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'ドキュメントID' },
                  { name: 'projectId', type: 'UUID', required: false, description: 'プロジェクトID' },
                  { name: 'title', type: 'STRING_100', required: true, description: 'タイトル' },
                  { name: 'description', type: 'TEXT', required: false, description: '説明' },
                  { name: 'type', type: 'ENUM', required: true, description: 'ドキュメントタイプ', enumValues: ['proposal', 'report', 'presentation', 'specification', 'manual', 'other'] },
                  { name: 'filePath', type: 'TEXT', required: true, description: 'ファイルパス' },
                  { name: 'fileSize', type: 'INTEGER', required: true, description: 'ファイルサイズ（バイト）' },
                  { name: 'mimeType', type: 'STRING_50', required: true, description: 'MIMEタイプ' },
                  { name: 'version', type: 'STRING_20', required: true, description: 'バージョン' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'review', 'approved', 'published', 'archived'] },
                  { name: 'uploadedBy', type: 'UUID', required: true, description: 'アップロード者ID' },
                  { name: 'uploadedAt', type: 'TIMESTAMP', required: true, description: 'アップロード日時' },
                  { name: 'tags', type: 'TEXT', required: false, description: 'タグ（JSON配列）' },
                  { name: 'accessLevel', type: 'ENUM', required: true, description: 'アクセスレベル', enumValues: ['private', 'team', 'project', 'public'] }
                ],
                businessRules: [
                  '承認済みドキュメントの削除は管理者権限が必要',
                  'バージョンアップは新規ドキュメントとして作成',
                  'アーカイブ済みドキュメントは編集不可'
                ],
                domainEvents: [
                  { name: 'DocumentUploaded', displayName: 'ドキュメントアップロード済み', properties: ['id', 'title', 'type', 'uploadedBy'] },
                  { name: 'DocumentApproved', displayName: 'ドキュメント承認済み', properties: ['id', 'approvedBy', 'approvedAt'] },
                  { name: 'DocumentArchived', displayName: 'ドキュメントアーカイブ済み', properties: ['id', 'archivedAt'] }
                ],
                isAggregate: true
              },
              {
                name: 'KnowledgeArticle',
                displayName: 'ナレッジ記事',
                description: 'ベストプラクティスやノウハウの蓄積',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: '記事ID' },
                  { name: 'title', type: 'STRING_100', required: true, description: 'タイトル' },
                  { name: 'content', type: 'TEXT', required: true, description: '本文' },
                  { name: 'category', type: 'ENUM', required: true, description: 'カテゴリ', enumValues: ['process', 'technology', 'methodology', 'case_study', 'lesson_learned'] },
                  { name: 'authorId', type: 'UUID', required: true, description: '著者ID' },
                  { name: 'projectId', type: 'UUID', required: false, description: '関連プロジェクトID' },
                  { name: 'tags', type: 'TEXT', required: false, description: 'タグ（JSON配列）' },
                  { name: 'viewCount', type: 'INTEGER', required: true, description: '閲覧数' },
                  { name: 'likeCount', type: 'INTEGER', required: true, description: 'いいね数' },
                  { name: 'status', type: 'ENUM', required: true, description: 'ステータス', enumValues: ['draft', 'published', 'archived'] },
                  { name: 'publishedAt', type: 'TIMESTAMP', required: false, description: '公開日時' },
                  { name: 'createdAt', type: 'TIMESTAMP', required: true, description: '作成日時' },
                  { name: 'updatedAt', type: 'TIMESTAMP', required: true, description: '更新日時' }
                ],
                businessRules: [
                  '公開記事の削除は著者または管理者のみ',
                  'アーカイブ済み記事は編集不可',
                  'タグは最大10個まで'
                ],
                domainEvents: [
                  { name: 'ArticlePublished', displayName: '記事公開済み', properties: ['id', 'title', 'authorId', 'publishedAt'] },
                  { name: 'ArticleViewed', displayName: '記事閲覧済み', properties: ['id', 'viewerId', 'viewedAt'] },
                  { name: 'ArticleLiked', displayName: '記事いいね済み', properties: ['id', 'likedBy', 'likedAt'] }
                ],
                isAggregate: false
              },
              {
                name: 'SearchIndex',
                displayName: '検索インデックス',
                description: 'ドキュメントと記事の全文検索用インデックス',
                properties: [
                  { name: 'id', type: 'UUID', required: true, description: 'インデックスID' },
                  { name: 'entityType', type: 'ENUM', required: true, description: 'エンティティタイプ', enumValues: ['document', 'article'] },
                  { name: 'entityId', type: 'UUID', required: true, description: 'エンティティID' },
                  { name: 'title', type: 'TEXT', required: true, description: 'タイトル' },
                  { name: 'content', type: 'TEXT', required: true, description: '検索用コンテンツ' },
                  { name: 'tags', type: 'TEXT', required: false, description: 'タグ' },
                  { name: 'metadata', type: 'TEXT', required: false, description: 'メタデータ（JSON）' },
                  { name: 'relevanceScore', type: 'DECIMAL', required: false, description: '関連性スコア' },
                  { name: 'indexedAt', type: 'TIMESTAMP', required: true, description: 'インデックス作成日時' }
                ],
                businessRules: [
                  '公開コンテンツのみインデックス化',
                  'コンテンツ更新時は再インデックス',
                  '削除時はインデックスからも削除'
                ],
                domainEvents: [
                  { name: 'ContentIndexed', displayName: 'コンテンツインデックス済み', properties: ['id', 'entityType', 'entityId'] }
                ],
                isAggregate: false
              }
            ],
            valueObjects: [
              {
                name: 'Tag',
                displayName: 'タグ',
                description: 'コンテンツ分類用タグ',
                properties: [
                  { name: 'name', type: 'STRING_30', required: true, description: 'タグ名' },
                  { name: 'color', type: 'STRING_7', required: false, description: 'カラーコード' }
                ],
                validationRules: [
                  'タグ名は英数字とハイフンのみ',
                  'カラーコードは#で始まる16進数'
                ]
              },
              {
                name: 'SearchQuery',
                displayName: '検索クエリ',
                description: '検索条件を表す値オブジェクト',
                properties: [
                  { name: 'keywords', type: 'STRING_100', required: true, description: '検索キーワード' },
                  { name: 'filters', type: 'TEXT', required: false, description: 'フィルタ条件（JSON）' },
                  { name: 'sortBy', type: 'STRING_20', required: false, description: 'ソート順' }
                ],
                validationRules: [
                  'キーワードは最低1文字以上',
                  'ソート順は事前定義された値のみ'
                ]
              }
            ],
            domainServices: [
              {
                name: 'DocumentManagementService',
                displayName: 'ドキュメント管理サービス',
                description: 'ドキュメントのアップロード、バージョン管理、共有',
                methods: [
                  {
                    name: 'uploadDocument',
                    displayName: 'ドキュメントアップロード',
                    description: '新しいドキュメントをアップロード',
                    parameters: [
                      { name: 'file', type: 'File' },
                      { name: 'metadata', type: 'DocumentMetadata' }
                    ],
                    returnType: 'Document'
                  },
                  {
                    name: 'shareDocument',
                    displayName: 'ドキュメント共有',
                    description: 'ドキュメントを他のユーザーと共有',
                    parameters: [
                      { name: 'documentId', type: 'UUID' },
                      { name: 'recipients', type: 'UUID[]' },
                      { name: 'accessLevel', type: 'string' }
                    ],
                    returnType: 'ShareResult'
                  }
                ]
              },
              {
                name: 'KnowledgeSearchService',
                displayName: 'ナレッジ検索サービス',
                description: 'ドキュメントや記事の検索と推薦',
                methods: [
                  {
                    name: 'searchKnowledge',
                    displayName: 'ナレッジ検索',
                    description: 'キーワードでナレッジを検索',
                    parameters: [
                      { name: 'query', type: 'SearchQuery' },
                      { name: 'limit', type: 'integer' }
                    ],
                    returnType: 'SearchResult[]'
                  },
                  {
                    name: 'recommendRelated',
                    displayName: '関連コンテンツ推薦',
                    description: '指定されたコンテンツに関連する情報を推薦',
                    parameters: [
                      { name: 'contentId', type: 'UUID' },
                      { name: 'contentType', type: 'string' },
                      { name: 'limit', type: 'integer' }
                    ],
                    returnType: 'RecommendationResult[]'
                  }
                ]
              }
            ],
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
            paths: {
              '/documents': {
                get: {
                  summary: 'ドキュメント一覧取得',
                  tags: ['Documents'],
                  parameters: [
                    {
                      name: 'projectId',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', format: 'uuid' }
                    },
                    {
                      name: 'type',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', enum: ['proposal', 'report', 'presentation', 'specification', 'manual'] }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Document' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: 'ドキュメントアップロード',
                  tags: ['Documents'],
                  requestBody: {
                    required: true,
                    content: {
                      'multipart/form-data': {
                        schema: {
                          type: 'object',
                          properties: {
                            file: {
                              type: 'string',
                              format: 'binary'
                            },
                            metadata: {
                              type: 'object'
                            }
                          }
                        }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: 'アップロード成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/Document' }
                        }
                      }
                    }
                  }
                }
              },
              '/documents/{documentId}/share': {
                post: {
                  summary: 'ドキュメント共有',
                  tags: ['Documents'],
                  parameters: [
                    {
                      name: 'documentId',
                      in: 'path',
                      required: true,
                      schema: { type: 'string', format: 'uuid' }
                    }
                  ],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: {
                          type: 'object',
                          properties: {
                            recipients: {
                              type: 'array',
                              items: { type: 'string', format: 'uuid' }
                            }
                          }
                        }
                      }
                    }
                  },
                  responses: {
                    '200': {
                      description: '共有成功'
                    }
                  }
                }
              },
              '/knowledge-articles': {
                get: {
                  summary: 'ナレッジ記事一覧取得',
                  tags: ['Knowledge'],
                  parameters: [
                    {
                      name: 'category',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', enum: ['process', 'technology', 'methodology', 'case_study', 'lesson_learned'] }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/KnowledgeArticle' }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  summary: 'ナレッジ記事作成',
                  tags: ['Knowledge'],
                  requestBody: {
                    required: true,
                    content: {
                      'application/json': {
                        schema: { $ref: '#/components/schemas/CreateKnowledgeArticleRequest' }
                      }
                    }
                  },
                  responses: {
                    '201': {
                      description: '作成成功',
                      content: {
                        'application/json': {
                          schema: { $ref: '#/components/schemas/KnowledgeArticle' }
                        }
                      }
                    }
                  }
                }
              },
              '/search': {
                get: {
                  summary: 'ナレッジ検索',
                  tags: ['Search'],
                  parameters: [
                    {
                      name: 'q',
                      in: 'query',
                      required: true,
                      schema: { type: 'string' }
                    },
                    {
                      name: 'type',
                      in: 'query',
                      required: false,
                      schema: { type: 'string', enum: ['document', 'article', 'all'] }
                    }
                  ],
                  responses: {
                    '200': {
                      description: '検索成功',
                      content: {
                        'application/json': {
                          schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/SearchResult' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }),
          dbSchema: JSON.stringify({
            tables: [
              {
                name: 'documents',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'project_id', type: 'UUID', nullable: true },
                  { name: 'title', type: 'VARCHAR(100)', nullable: false },
                  { name: 'description', type: 'TEXT', nullable: true },
                  { name: 'type', type: 'VARCHAR(20)', nullable: false },
                  { name: 'file_path', type: 'TEXT', nullable: false },
                  { name: 'file_size', type: 'INTEGER', nullable: false },
                  { name: 'mime_type', type: 'VARCHAR(50)', nullable: false },
                  { name: 'version', type: 'VARCHAR(20)', nullable: false },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'uploaded_by', type: 'UUID', nullable: false },
                  { name: 'uploaded_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'tags', type: 'TEXT', nullable: true },
                  { name: 'access_level', type: 'VARCHAR(20)', nullable: false }
                ]
              },
              {
                name: 'knowledge_articles',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'title', type: 'VARCHAR(100)', nullable: false },
                  { name: 'content', type: 'TEXT', nullable: false },
                  { name: 'category', type: 'VARCHAR(30)', nullable: false },
                  { name: 'author_id', type: 'UUID', nullable: false },
                  { name: 'project_id', type: 'UUID', nullable: true },
                  { name: 'tags', type: 'TEXT', nullable: true },
                  { name: 'view_count', type: 'INTEGER', nullable: false, default: 0 },
                  { name: 'like_count', type: 'INTEGER', nullable: false, default: 0 },
                  { name: 'status', type: 'VARCHAR(20)', nullable: false },
                  { name: 'published_at', type: 'TIMESTAMP', nullable: true },
                  { name: 'created_at', type: 'TIMESTAMP', nullable: false },
                  { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'search_index',
                columns: [
                  { name: 'id', type: 'UUID', primaryKey: true },
                  { name: 'entity_type', type: 'VARCHAR(20)', nullable: false },
                  { name: 'entity_id', type: 'UUID', nullable: false },
                  { name: 'title', type: 'TEXT', nullable: false },
                  { name: 'content', type: 'TEXT', nullable: false },
                  { name: 'tags', type: 'TEXT', nullable: true },
                  { name: 'metadata', type: 'TEXT', nullable: true },
                  { name: 'relevance_score', type: 'DECIMAL(5,2)', nullable: true },
                  { name: 'indexed_at', type: 'TIMESTAMP', nullable: false }
                ]
              },
              {
                name: 'article_likes',
                columns: [
                  { name: 'article_id', type: 'UUID', nullable: false },
                  { name: 'user_id', type: 'UUID', nullable: false },
                  { name: 'liked_at', type: 'TIMESTAMP', nullable: false }
                ]
              }
            ],
            relations: [
              {
                name: 'project_documents',
                from: 'documents.project_id',
                to: 'projects.id',
                type: 'many-to-one'
              },
              {
                name: 'author_articles',
                from: 'knowledge_articles.author_id',
                to: 'users.id',
                type: 'many-to-one'
              },
              {
                name: 'article_user_likes',
                from: 'article_likes.article_id',
                to: 'knowledge_articles.id',
                type: 'many-to-one'
              }
            ],
            indexes: [
              { table: 'documents', columns: ['project_id', 'type'] },
              { table: 'documents', columns: ['status', 'uploaded_at'] },
              { table: 'knowledge_articles', columns: ['category', 'status'] },
              { table: 'knowledge_articles', columns: ['author_id', 'published_at'] },
              { table: 'search_index', columns: ['entity_type', 'entity_id'], unique: true },
              { table: 'article_likes', columns: ['article_id', 'user_id'], unique: true }
            ]
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

    // タイムシート管理サービスのケーパビリティ
    const timesheetService = services.find(s => s.name === 'timesheet-service')!;
    const timesheetCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: timesheetService.id,
          name: 'TimeEntryManagement',
          displayName: '工数入力管理',
          description: '日々の作業時間の記録と管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: timesheetService.id,
          name: 'TimesheetApproval',
          displayName: '工数承認',
          description: '提出された工数の承認プロセス',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: timesheetService.id,
          name: 'TimesheetReporting',
          displayName: '工数レポート',
          description: '工数データの集計とレポート生成',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...timesheetCaps);

    // 通知サービスのケーパビリティ
    const notificationService = services.find(s => s.name === 'notification-service')!;
    const notificationCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: notificationService.id,
          name: 'NotificationManagement',
          displayName: '通知管理',
          description: 'システム通知の生成と配信',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: notificationService.id,
          name: 'MessageManagement',
          displayName: 'メッセージ管理',
          description: 'ユーザー間メッセージの送受信',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: notificationService.id,
          name: 'AlertManagement',
          displayName: 'アラート管理',
          description: '重要なイベントのアラート配信',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...notificationCaps);

    // ナレッジ管理サービスのケーパビリティ
    const knowledgeService = services.find(s => s.name === 'knowledge-service')!;
    const knowledgeCaps = await Promise.all([
      parasolDb.businessCapability.create({
        data: {
          serviceId: knowledgeService.id,
          name: 'DocumentManagement',
          displayName: 'ドキュメント管理',
          description: 'プロジェクト文書の保存と管理',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: knowledgeService.id,
          name: 'KnowledgeSharing',
          displayName: 'ナレッジ共有',
          description: '知識とベストプラクティスの共有',
          category: 'Core'
        }
      }),
      parasolDb.businessCapability.create({
        data: {
          serviceId: knowledgeService.id,
          name: 'SearchAndDiscovery',
          displayName: '検索・発見',
          description: 'ナレッジの検索と関連情報の発見',
          category: 'Supporting'
        }
      })
    ]);
    capabilities.push(...knowledgeCaps);

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

    // リスク管理のオペレーション
    const riskCap = projectCaps.find(c => c.name === 'RiskManagement')!;
    const riskOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: projectService.id,
        capabilityId: riskCap.id,
        name: 'identifyRisk',
        displayName: 'リスク識別',
        pattern: 'CRUD',
        goal: 'プロジェクトリスクを識別し、登録する',
        roles: JSON.stringify(['PM', 'Consultant']),
        operations: JSON.stringify(['create', 'assess', 'categorize']),
        businessStates: JSON.stringify(['identified', 'assessed']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(riskOps);

    // チーム管理のオペレーション
    const teamCap = resourceCaps.find(c => c.name === 'TeamManagement')!;
    const teamOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: resourceService.id,
          capabilityId: teamCap.id,
          name: 'assignMember',
          displayName: 'メンバーアサイン',
          pattern: 'CRUD',
          goal: 'プロジェクトにチームメンバーを割り当てる',
          roles: JSON.stringify(['PM']),
          operations: JSON.stringify(['validate', 'assign', 'notify']),
          businessStates: JSON.stringify(['available', 'assigned']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: resourceService.id,
          capabilityId: teamCap.id,
          name: 'updateMemberRole',
          displayName: 'ロール更新',
          pattern: 'CRUD',
          goal: 'プロジェクトメンバーの役割を更新する',
          roles: JSON.stringify(['PM']),
          operations: JSON.stringify(['validate', 'update', 'notify']),
          businessStates: JSON.stringify(['active']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...teamOps);

    // 工数入力管理のオペレーション
    const timeEntryCap = timesheetCaps.find(c => c.name === 'TimeEntryManagement')!;
    const timeEntryOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: timesheetService.id,
          capabilityId: timeEntryCap.id,
          name: 'recordTime',
          displayName: '工数記録',
          pattern: 'CRUD',
          goal: '作業時間を記録する',
          roles: JSON.stringify(['Consultant']),
          operations: JSON.stringify(['create', 'validate', 'save']),
          businessStates: JSON.stringify(['draft', 'submitted']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: timesheetService.id,
          capabilityId: timeEntryCap.id,
          name: 'submitTimesheet',
          displayName: '工数提出',
          pattern: 'Workflow',
          goal: '週次タイムシートを提出する',
          roles: JSON.stringify(['Consultant']),
          operations: JSON.stringify(['validate', 'submit', 'notify']),
          businessStates: JSON.stringify(['draft', 'submitted']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...timeEntryOps);

    // 通知管理のオペレーション
    const notificationCap = notificationCaps.find(c => c.name === 'NotificationManagement')!;
    const notificationOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: notificationService.id,
          capabilityId: notificationCap.id,
          name: 'sendNotification',
          displayName: '通知送信',
          pattern: 'Communication',
          goal: 'ユーザーに通知を送信する',
          roles: JSON.stringify(['System']),
          operations: JSON.stringify(['create', 'send', 'log']),
          businessStates: JSON.stringify(['pending', 'sent']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: notificationService.id,
          capabilityId: notificationCap.id,
          name: 'markAsRead',
          displayName: '既読にする',
          pattern: 'CRUD',
          goal: '通知を既読状態にする',
          roles: JSON.stringify(['All']),
          operations: JSON.stringify(['update', 'timestamp']),
          businessStates: JSON.stringify(['unread', 'read']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...notificationOps);

    // ドキュメント管理のオペレーション
    const documentCap = knowledgeCaps.find(c => c.name === 'DocumentManagement')!;
    const documentOps = await Promise.all([
      parasolDb.businessOperation.create({
        data: {
          serviceId: knowledgeService.id,
          capabilityId: documentCap.id,
          name: 'uploadDocument',
          displayName: 'ドキュメントアップロード',
          pattern: 'CRUD',
          goal: 'ドキュメントをアップロードし、保存する',
          roles: JSON.stringify(['PM', 'Consultant']),
          operations: JSON.stringify(['upload', 'validate', 'save']),
          businessStates: JSON.stringify(['uploading', 'available']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      }),
      parasolDb.businessOperation.create({
        data: {
          serviceId: knowledgeService.id,
          capabilityId: documentCap.id,
          name: 'shareDocument',
          displayName: 'ドキュメント共有',
          pattern: 'Communication',
          goal: 'ドキュメントをチームメンバーと共有する',
          roles: JSON.stringify(['PM', 'Consultant']),
          operations: JSON.stringify(['share', 'notify', 'log']),
          businessStates: JSON.stringify(['private', 'shared']),
          useCases: JSON.stringify([]),
          uiDefinitions: JSON.stringify([]),
          testCases: JSON.stringify([])
        }
      })
    ]);
    operations.push(...documentOps);

    // スキル管理のオペレーション
    const skillCap = resourceCaps.find(c => c.name === 'SkillManagement')!;
    const skillOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: resourceService.id,
        capabilityId: skillCap.id,
        name: 'updateSkillProfile',
        displayName: 'スキルプロフィール更新',
        pattern: 'CRUD',
        goal: 'メンバーのスキルセットを更新する',
        roles: JSON.stringify(['Consultant', 'PM']),
        operations: JSON.stringify(['update', 'validate', 'save']),
        businessStates: JSON.stringify(['current']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(skillOps);

    // 稼働率管理のオペレーション
    const utilizationCap = resourceCaps.find(c => c.name === 'UtilizationManagement')!;
    const utilizationOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: resourceService.id,
        capabilityId: utilizationCap.id,
        name: 'calculateUtilization',
        displayName: '稼働率計算',
        pattern: 'Analytics',
        goal: 'リソースの稼働率を計算・分析する',
        roles: JSON.stringify(['PM', 'Executive']),
        operations: JSON.stringify(['calculate', 'analyze', 'report']),
        businessStates: JSON.stringify(['calculated']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(utilizationOps);

    // コスト追跡のオペレーション
    const costCap = financeCaps.find(c => c.name === 'CostTracking')!;
    const costOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: financeService.id,
        capabilityId: costCap.id,
        name: 'recordCost',
        displayName: 'コスト記録',
        pattern: 'CRUD',
        goal: 'プロジェクトコストを記録する',
        roles: JSON.stringify(['PM', 'Executive']),
        operations: JSON.stringify(['create', 'calculate', 'save']),
        businessStates: JSON.stringify(['recorded']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(costOps);

    // 請求管理のオペレーション
    const billingCap = financeCaps.find(c => c.name === 'BillingManagement')!;
    const billingOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: financeService.id,
        capabilityId: billingCap.id,
        name: 'generateInvoice',
        displayName: '請求書生成',
        pattern: 'CRUD',
        goal: 'クライアント向け請求書を生成する',
        roles: JSON.stringify(['Executive']),
        operations: JSON.stringify(['generate', 'validate', 'send']),
        businessStates: JSON.stringify(['draft', 'sent']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(billingOps);

    // 工数承認のオペレーション
    const timesheetApprovalCap = timesheetCaps.find(c => c.name === 'TimesheetApproval')!;
    const approvalOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: timesheetService.id,
        capabilityId: timesheetApprovalCap.id,
        name: 'approveTimesheet',
        displayName: '工数承認',
        pattern: 'Workflow',
        goal: '提出された工数を承認する',
        roles: JSON.stringify(['PM']),
        operations: JSON.stringify(['review', 'approve', 'notify']),
        businessStates: JSON.stringify(['submitted', 'approved', 'rejected']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(approvalOps);

    // 工数レポートのオペレーション
    const timesheetReportingCap = timesheetCaps.find(c => c.name === 'TimesheetReporting')!;
    const reportOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: timesheetService.id,
        capabilityId: timesheetReportingCap.id,
        name: 'generateTimesheetReport',
        displayName: '工数レポート生成',
        pattern: 'Analytics',
        goal: '工数データの集計レポートを生成する',
        roles: JSON.stringify(['PM', 'Executive']),
        operations: JSON.stringify(['aggregate', 'analyze', 'generate']),
        businessStates: JSON.stringify(['generated']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(reportOps);

    // メッセージ管理のオペレーション
    const messageCap = notificationCaps.find(c => c.name === 'MessageManagement')!;
    const messageOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: notificationService.id,
        capabilityId: messageCap.id,
        name: 'sendMessage',
        displayName: 'メッセージ送信',
        pattern: 'Communication',
        goal: 'ユーザー間でメッセージを送信する',
        roles: JSON.stringify(['All']),
        operations: JSON.stringify(['create', 'send', 'notify']),
        businessStates: JSON.stringify(['sent', 'delivered']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(messageOps);

    // アラート管理のオペレーション
    const alertCap = notificationCaps.find(c => c.name === 'AlertManagement')!;
    const alertOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: notificationService.id,
        capabilityId: alertCap.id,
        name: 'triggerAlert',
        displayName: 'アラート発行',
        pattern: 'Communication',
        goal: '重要イベントのアラートを発行する',
        roles: JSON.stringify(['System']),
        operations: JSON.stringify(['detect', 'trigger', 'escalate']),
        businessStates: JSON.stringify(['triggered', 'acknowledged']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(alertOps);

    // ナレッジ共有のオペレーション
    const knowledgeSharingCap = knowledgeCaps.find(c => c.name === 'KnowledgeSharing')!;
    const knowledgeOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: knowledgeService.id,
        capabilityId: knowledgeSharingCap.id,
        name: 'publishKnowledge',
        displayName: 'ナレッジ公開',
        pattern: 'CRUD',
        goal: 'ナレッジ記事を公開する',
        roles: JSON.stringify(['PM', 'Consultant']),
        operations: JSON.stringify(['create', 'review', 'publish']),
        businessStates: JSON.stringify(['draft', 'published']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(knowledgeOps);

    // 検索・発見のオペレーション
    const searchCap = knowledgeCaps.find(c => c.name === 'SearchAndDiscovery')!;
    const searchOps = await parasolDb.businessOperation.create({
      data: {
        serviceId: knowledgeService.id,
        capabilityId: searchCap.id,
        name: 'searchKnowledge',
        displayName: 'ナレッジ検索',
        pattern: 'Analytics',
        goal: 'ナレッジベースから関連情報を検索する',
        roles: JSON.stringify(['All']),
        operations: JSON.stringify(['query', 'search', 'rank']),
        businessStates: JSON.stringify(['searching', 'found']),
        useCases: JSON.stringify([]),
        uiDefinitions: JSON.stringify([]),
        testCases: JSON.stringify([])
      }
    });
    operations.push(searchOps);

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