import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'
import { PROJECT_MEMBER_ROLES } from '../../constants/roles'

const projectDb = new ProjectPrismaClient()

export async function seedProjects(users?: any[], organizations?: any) {
  console.log('🌱 Seeding Project Service...')
  
  try {
    // ユーザーIDを取得
    const pmUser = users?.find(u => u.email === 'pm@example.com')
    const pm2User = users?.find(u => u.email === 'pm2@example.com')
    const consultantUser = users?.find(u => u.email === 'consultant@example.com')
    const consultant2User = users?.find(u => u.email === 'consultant2@example.com')
    const consultant3User = users?.find(u => u.email === 'consultant3@example.com')
    const consultant4User = users?.find(u => u.email === 'consultant4@example.com')
    
    // ユーザーIDが見つからない場合はエラーをthrow
    if (!pmUser?.id) {
      throw new Error('PM user not found. Please run auth service seed first.')
    }
    if (!consultantUser?.id) {
      throw new Error('Consultant user not found. Please run auth service seed first.')
    }
    if (!organizations?.clientOrg?.id) {
      throw new Error('Client organization not found. Please run auth service seed first.')
    }
    
    const pmUserId = pmUser.id
    const pm2UserId = pm2User?.id
    const consultantUserId = consultantUser.id
    const consultant2UserId = consultant2User?.id
    const consultant3UserId = consultant3User?.id
    const consultant4UserId = consultant4User?.id
    
    // クライアント組織IDを取得
    const clientOrgId = organizations.clientOrg.id
    const globalMfgId = organizations?.globalMfg?.id
    const financeCorpId = organizations?.financeCorp?.id
    const healthcareId = organizations?.healthcare?.id
    const retailId = organizations?.retail?.id
    const energyId = organizations?.energy?.id
    // サンプルプロジェクトの作成
    const projects = await Promise.all([
      projectDb.project.create({
        data: {
          name: 'デジタルトランスフォーメーション推進',
          code: 'DX001',
          clientId: clientOrgId,
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          budget: 50000000,
          description: '基幹システムのクラウド移行とデジタル化推進プロジェクト'
        }
      }),
      projectDb.project.create({
        data: {
          name: 'ビジネスオペレーション最適化',
          code: 'BPO001',
          clientId: clientOrgId,
          status: 'active',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-08-31'),
          budget: 30000000,
          description: '業務プロセスの見直しと効率化'
        }
      }),
      projectDb.project.create({
        data: {
          name: 'データ分析基盤構築',
          code: 'DAP001',
          clientId: clientOrgId,
          status: 'planning',
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-09-30'),
          budget: 25000000,
          description: 'BI導入とデータ分析基盤の構築'
        }
      })
    ])

    // 新しいクライアント向けプロジェクトも作成
    if (globalMfgId) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'スマートファクトリー導入',
          code: 'SMF001',
          clientId: globalMfgId,
          status: 'active',
          priority: 'high',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-10-31'),
          budget: 45000000,
          description: 'IoTとAIを活用した次世代製造ラインの構築'
        }
      }))
    }

    if (financeCorpId) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'デジタルバンキング戦略',
          code: 'DBS001',
          clientId: financeCorpId,
          status: 'planning',
          priority: 'high',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2025-03-31'),
          budget: 60000000,
          description: 'オンラインバンキングサービスの全面刷新'
        }
      }))
    }

    if (healthcareId) {
      projects.push(await projectDb.project.create({
        data: {
          name: '電子カルテシステム統合',
          code: 'EMR001',
          clientId: healthcareId,
          status: 'active',
          priority: 'critical',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-06-30'),
          budget: 35000000,
          description: '複数病院の電子カルテシステムの統合と標準化'
        }
      }))
    }

    if (retailId) {
      projects.push(await projectDb.project.create({
        data: {
          name: 'オムニチャネル戦略推進',
          code: 'OMN001',
          clientId: retailId,
          status: 'active',
          priority: 'medium',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-11-30'),
          budget: 28000000,
          description: '店舗とECの統合による顧客体験の向上'
        }
      }))
    }

    if (energyId) {
      projects.push(await projectDb.project.create({
        data: {
          name: '再生可能エネルギー管理システム',
          code: 'REN001',
          clientId: energyId,
          status: 'planning',
          priority: 'medium',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2025-05-31'),
          budget: 42000000,
          description: '太陽光・風力発電施設の統合管理プラットフォーム構築'
        }
      }))
    }

    // マイルストーンの作成
    for (const project of projects) {
      await projectDb.milestone.createMany({
        data: [
          {
            projectId: project.id,
            name: '要件定義完了',
            dueDate: new Date('2024-03-31'),
            status: 'completed',
            description: '要件定義書の完成と承認'
          },
          {
            projectId: project.id,
            name: '基本設計完了',
            dueDate: new Date('2024-05-31'),
            status: 'inProgress',
            description: '基本設計書の完成'
          },
          {
            projectId: project.id,
            name: 'システムリリース',
            dueDate: new Date('2024-08-31'),
            status: 'pending',
            description: '本番環境へのリリース'
          }
        ]
      })

      // タスクの作成
      const milestones = await projectDb.milestone.findMany({
        where: { projectId: project.id }
      })

      for (const milestone of milestones) {
        await projectDb.task.createMany({
          data: [
            {
              projectId: project.id,
              milestoneId: milestone.id,
              title: `${milestone.name} - レビュー準備`,
              description: 'レビュー資料の準備と関係者への展開',
              status: milestone.status === 'completed' ? 'completed' : 'inProgress',
              priority: 'high',
              dueDate: milestone.dueDate,
              estimatedHours: 40,
              actualHours: milestone.status === 'completed' ? 35 : null,
              assigneeId: pmUserId
            },
            {
              projectId: project.id,
              milestoneId: milestone.id,
              title: `${milestone.name} - ドキュメント作成`,
              description: '成果物ドキュメントの作成',
              status: milestone.status === 'completed' ? 'completed' : 'pending',
              priority: 'medium',
              dueDate: milestone.dueDate,
              estimatedHours: 80,
              actualHours: milestone.status === 'completed' ? 75 : null,
              assigneeId: consultantUserId
            }
          ]
        })
      }
    }

    // 成果物の作成
    for (const project of projects) {
      const milestones = await projectDb.milestone.findMany({
        where: { projectId: project.id }
      })

      // プロジェクト種別に応じた成果物テンプレート
      const getDeliverableTemplates = (projectName: string) => {
        if (projectName.includes('デジタルトランスフォーメーション')) {
          return [
            { name: 'DX戦略計画書', type: 'document', milestone: '要件定義完了' },
            { name: 'システム移行計画書', type: 'document', milestone: '基本設計完了' },
            { name: 'クラウド移行システム', type: 'software', milestone: 'システムリリース' },
            { name: 'DX推進ガイドライン', type: 'document', milestone: '基本設計完了' },
            { name: 'プロジェクト最終報告書', type: 'report', milestone: 'システムリリース' }
          ]
        } else if (projectName.includes('ビジネスオペレーション最適化')) {
          return [
            { name: '現状業務分析レポート', type: 'report', milestone: '要件定義完了' },
            { name: '最適化提案書', type: 'document', milestone: '基本設計完了' },
            { name: 'プロセス改善マニュアル', type: 'document', milestone: 'システムリリース' },
            { name: '効果測定システム', type: 'software', milestone: 'システムリリース' },
            { name: '業務フロー図', type: 'presentation', milestone: '基本設計完了' }
          ]
        } else if (projectName.includes('データ分析基盤構築')) {
          return [
            { name: 'データアーキテクチャ設計書', type: 'document', milestone: '要件定義完了' },
            { name: 'BI要件定義書', type: 'document', milestone: '要件定義完了' },
            { name: 'データ分析プラットフォーム', type: 'software', milestone: 'システムリリース' },
            { name: 'データ可視化ダッシュボード', type: 'software', milestone: 'システムリリース' },
            { name: 'データガバナンス規程', type: 'document', milestone: '基本設計完了' }
          ]
        } else if (projectName.includes('スマートファクトリー')) {
          return [
            { name: 'IoT導入計画書', type: 'document', milestone: '要件定義完了' },
            { name: 'スマートファクトリーシステム', type: 'software', milestone: 'システムリリース' },
            { name: 'AI予測モデル', type: 'software', milestone: 'システムリリース' },
            { name: '運用マニュアル', type: 'document', milestone: 'システムリリース' }
          ]
        } else if (projectName.includes('デジタルバンキング')) {
          return [
            { name: 'デジタルバンキング戦略書', type: 'document', milestone: '要件定義完了' },
            { name: 'モバイルアプリ仕様書', type: 'document', milestone: '基本設計完了' },
            { name: 'オンラインバンキングシステム', type: 'software', milestone: 'システムリリース' },
            { name: 'セキュリティ監査レポート', type: 'report', milestone: 'システムリリース' }
          ]
        } else if (projectName.includes('電子カルテ')) {
          return [
            { name: '電子カルテ統合設計書', type: 'document', milestone: '要件定義完了' },
            { name: 'データ移行計画書', type: 'document', milestone: '基本設計完了' },
            { name: '統合電子カルテシステム', type: 'software', milestone: 'システムリリース' },
            { name: '医療スタッフ研修資料', type: 'presentation', milestone: 'システムリリース' }
          ]
        } else if (projectName.includes('オムニチャネル')) {
          return [
            { name: 'オムニチャネル戦略書', type: 'document', milestone: '要件定義完了' },
            { name: '顧客体験設計書', type: 'document', milestone: '基本設計完了' },
            { name: '統合ECプラットフォーム', type: 'software', milestone: 'システムリリース' },
            { name: '店舗連携システム', type: 'software', milestone: 'システムリリース' }
          ]
        } else if (projectName.includes('再生可能エネルギー')) {
          return [
            { name: 'エネルギー管理システム設計書', type: 'document', milestone: '要件定義完了' },
            { name: '発電施設統合プラットフォーム', type: 'software', milestone: 'システムリリース' },
            { name: 'エネルギー効率化レポート', type: 'report', milestone: 'システムリリース' },
            { name: '運用保守マニュアル', type: 'document', milestone: 'システムリリース' }
          ]
        } else {
          return [
            { name: '要件定義書', type: 'document', milestone: '要件定義完了' },
            { name: '基本設計書', type: 'document', milestone: '基本設計完了' },
            { name: 'システム', type: 'software', milestone: 'システムリリース' },
            { name: '最終報告書', type: 'report', milestone: 'システムリリース' }
          ]
        }
      }

      const templates = getDeliverableTemplates(project.name)
      
      for (const template of templates) {
        const targetMilestone = milestones.find(m => m.name === template.milestone)
        if (!targetMilestone) continue

        // マイルストーンのステータスに基づいて成果物のステータスを決定
        let deliverableStatus = 'draft'
        if (targetMilestone.status === 'completed') {
          deliverableStatus = 'delivered'
        } else if (targetMilestone.status === 'inProgress') {
          deliverableStatus = 'review'
        }

        // 完了済みの成果物には承認情報を追加
        const approvedBy = deliverableStatus === 'delivered' ? pmUserId : null
        const approvedAt = deliverableStatus === 'delivered' ? new Date(targetMilestone.dueDate) : null
        const deliveredAt = deliverableStatus === 'delivered' ? new Date(targetMilestone.dueDate.getTime() + 24 * 60 * 60 * 1000) : null

        await projectDb.deliverable.create({
          data: {
            projectId: project.id,
            milestoneId: targetMilestone.id,
            name: template.name,
            description: `${template.name}の詳細な仕様と実装内容を含む成果物`,
            type: template.type as any,
            status: deliverableStatus as any,
            version: deliverableStatus === 'delivered' ? 'v1.0' : 'v0.1',
            fileUrl: deliverableStatus === 'delivered' ? `/files/${project.code}/${template.name.replace(/\s/g, '_')}.pdf` : null,
            approvedBy,
            approvedAt,
            deliveredAt
          }
        })
      }
    }

    // プロジェクトメンバーを追加
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      
      // PMを割り当て（交互に割り当て）
      const assignedPmId = i % 2 === 0 ? pmUserId : (pm2UserId || pmUserId)
      await projectDb.projectMember.create({
        data: {
          projectId: project.id,
          userId: assignedPmId,
          role: PROJECT_MEMBER_ROLES.PM,
          allocation: 30,
          startDate: project.startDate
        }
      })
      
      // コンサルタントを割り当て
      const consultantIds = [
        consultantUserId, 
        consultant2UserId, 
        consultant3UserId, 
        consultant4UserId
      ].filter(id => id)
      
      // 各プロジェクトに2-3人のコンサルタントを割り当て
      const consultantCount = 2 + (i % 2) // 2人または3人
      for (let j = 0; j < consultantCount && j < consultantIds.length; j++) {
        const consultantIndex = (i + j) % consultantIds.length
        await projectDb.projectMember.create({
          data: {
            projectId: project.id,
            userId: consultantIds[consultantIndex],
            role: PROJECT_MEMBER_ROLES.MEMBER,
            allocation: 40 + (j * 10), // 40%, 50%, 60%
            startDate: project.startDate
          }
        })
      }
    }

    console.log('✅ Project Service seeded successfully')
    console.log(`  - Created ${projects.length} projects`)
    console.log('  - Created milestones and tasks for each project')
    console.log('  - Created deliverables for each project')
    console.log('  - Assigned PMs and consultants to all projects')
    
    // プロジェクトデータを返す（メンバー情報を含む）
    const projectsWithMembers = await projectDb.project.findMany({
      include: {
        projectMembers: true
      }
    })
    
    return projectsWithMembers
    
  } catch (error) {
    console.error('❌ Error seeding Project Service:', error)
    throw error
  } finally {
    await projectDb.$disconnect()
  }
}

// スタンドアロン実行のサポート
if (require.main === module) {
  seedProjects()
    .then(() => {
      console.log('Project seed completed')
    })
    .catch((e) => {
      console.error('Error seeding project data:', e)
      process.exit(1)
    })
}