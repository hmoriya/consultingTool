import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 組織の作成
  const consultingFirm = await prisma.organization.create({
    data: {
      name: 'コンサルティング会社A',
      type: 'consultingFirm',
    },
  })

  const clientOrgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: '株式会社テックイノベーション',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'グローバル製造株式会社',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: '金融ホールディングス',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'リテール商事株式会社',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'ヘルスケアソリューションズ',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: 'エネルギー開発株式会社',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: '物流ネットワーク株式会社',
        type: 'client',
      },
    }),
    prisma.organization.create({
      data: {
        name: '教育システム株式会社',
        type: 'client',
      },
    }),
  ])

  // メインで使用するクライアント
  const clientOrg = clientOrgs[0]

  // ロールの作成
  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: 'executive',
        description: 'エグゼクティブ',
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'pm',
        description: 'プロジェクトマネージャー',
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'consultant',
        description: 'コンサルタント',
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'client',
        description: 'クライアント',
        isSystem: true,
      },
    }),
    prisma.role.create({
      data: {
        name: 'admin',
        description: 'システム管理者',
        isSystem: true,
      },
    }),
  ])

  // 権限の作成
  const permissions = await Promise.all([
    prisma.permission.create({
      data: {
        resource: 'projects',
        action: 'read',
        description: 'プロジェクト閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'projects',
        action: 'write',
        description: 'プロジェクト編集',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'users',
        action: 'read',
        description: 'ユーザー閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'users',
        action: 'write',
        description: 'ユーザー編集',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'reports',
        action: 'read',
        description: 'レポート閲覧',
      },
    }),
    prisma.permission.create({
      data: {
        resource: 'reports',
        action: 'write',
        description: 'レポート作成',
      },
    }),
  ])

  // ロールと権限の関連付け
  const executiveRole = roles.find(r => r.name === 'executive')!
  const pmRole = roles.find(r => r.name === 'pm')!
  const consultantRole = roles.find(r => r.name === 'consultant')!
  const clientRole = roles.find(r => r.name === 'client')!
  const adminRole = roles.find(r => r.name === 'admin')!

  // エグゼクティブ: 全て読み取り可能
  for (const permission of permissions) {
    if (permission.action === 'read') {
      await prisma.rolePermission.create({
        data: {
          roleId: executiveRole.id,
          permissionId: permission.id,
        },
      })
    }
  }

  // PM: プロジェクトの読み書き、ユーザーとレポートの読み取り
  await prisma.rolePermission.createMany({
    data: [
      { roleId: pmRole.id, permissionId: permissions.find(p => p.resource === 'projects' && p.action === 'read')!.id },
      { roleId: pmRole.id, permissionId: permissions.find(p => p.resource === 'projects' && p.action === 'write')!.id },
      { roleId: pmRole.id, permissionId: permissions.find(p => p.resource === 'users' && p.action === 'read')!.id },
      { roleId: pmRole.id, permissionId: permissions.find(p => p.resource === 'reports' && p.action === 'read')!.id },
    ],
  })

  // テストユーザーの作成
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      email: 'exec@example.com',
      password: hashedPassword,
      name: '山田太郎',
      roleId: executiveRole.id,
      organizationId: consultingFirm.id,
    },
  })

  const pmUser = await prisma.user.create({
    data: {
      email: 'pm@example.com',
      password: hashedPassword,
      name: '鈴木花子',
      roleId: pmRole.id,
      organizationId: consultingFirm.id,
    },
  })

  const consultantUser = await prisma.user.create({
    data: {
      email: 'consultant@example.com',
      password: hashedPassword,
      name: '田中一郎',
      roleId: consultantRole.id,
      organizationId: consultingFirm.id,
    },
  })

  await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      name: '佐藤次郎',
      roleId: clientRole.id,
      organizationId: clientOrg.id,
    },
  })

  // 各クライアント組織にもユーザーを作成
  await Promise.all(
    clientOrgs.slice(1, 4).map((org, index) =>
      prisma.user.create({
        data: {
          email: `client${index + 2}@example.com`,
          password: hashedPassword,
          name: `クライアント担当者${index + 2}`,
          roleId: clientRole.id,
          organizationId: org.id,
        },
      })
    )
  )

  // サンプルプロジェクトの作成
  const now = new Date()
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'デジタルトランスフォーメーション戦略策定',
        code: 'DX001',
        clientId: clientOrgs[0].id, // テックイノベーション
        status: 'active',
        startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        budget: 50000000,
        description: 'デジタル技術を活用した業務改革とイノベーション創出',
        projectMembers: {
          create: [
            {
              userId: pmUser.id,
              role: 'pm',
              allocation: 0.5,
              startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
            },
            {
              userId: consultantUser.id,
              role: 'consultant',
              allocation: 1.0,
              startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
            },
          ],
        },
        milestones: {
          create: [
            {
              name: '現状分析完了',
              dueDate: new Date(now.getFullYear(), now.getMonth() - 2, 15),
              status: 'completed',
            },
            {
              name: '戦略策定',
              dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
              status: 'pending',
            },
          ],
        },
        tasks: {
          create: [
            {
              title: '現状業務プロセス分析',
              description: '既存の業務プロセスを詳細に分析し、デジタル化の機会を特定する',
              status: 'completed',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth() - 2, 20),
              assigneeId: consultantUser.id,
            },
            {
              title: 'ステークホルダーインタビュー実施',
              description: '主要ステークホルダーへのインタビューを実施し、要求事項を収集',
              status: 'completed',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth() - 2, 25),
              assigneeId: consultantUser.id,
            },
            {
              title: 'DX戦略ロードマップ作成',
              description: '3年間のDX戦略実行ロードマップを作成',
              status: 'in_progress',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth(), 10),
              assigneeId: pmUser.id,
            },
            {
              title: '技術スタック選定',
              description: 'DX推進に適した技術スタックの選定と評価',
              status: 'in_progress',
              priority: 'medium',
              dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
              assigneeId: consultantUser.id,
            },
            {
              title: 'POCシステム要件定義',
              description: 'パイロットプロジェクトのシステム要件定義書作成',
              status: 'todo',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
              assigneeId: consultantUser.id,
            },
            {
              title: '変更管理計画策定',
              description: '組織変更管理計画の策定と実行準備',
              status: 'todo',
              priority: 'medium',
              dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
              assigneeId: pmUser.id,
            },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: 'グローバル展開支援',
        code: 'GL002',
        clientId: clientOrgs[1].id, // グローバル製造
        status: 'active',
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        budget: 30000000,
        description: '海外市場進出に向けた戦略立案と実行支援',
        projectMembers: {
          create: [
            {
              userId: pmUser.id,
              role: 'pm',
              allocation: 0.3,
              startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: 'コスト削減プログラム',
        code: 'CS003',
        clientId: clientOrgs[3].id, // リテール商事
        status: 'completed',
        startDate: new Date(now.getFullYear() - 1, now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() - 6, 0),
        budget: 20000000,
        description: '業務効率化によるコスト削減施策の実施',
      },
    }),
    prisma.project.create({
      data: {
        name: 'デジタル金融サービス開発',
        code: 'FIN004',
        clientId: clientOrgs[2].id, // 金融ホールディングス
        status: 'active',
        startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 4, 0),
        budget: 80000000,
        description: '次世代金融サービスプラットフォームの構築',
        projectMembers: {
          create: [
            {
              userId: pmUser.id,
              role: 'pm',
              allocation: 0.7,
              startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
            },
            {
              userId: consultantUser.id,
              role: 'consultant',
              allocation: 0.8,
              startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
            },
          ],
        },
        milestones: {
          create: [
            {
              name: '要件定義完了',
              dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 15),
              status: 'completed',
            },
            {
              name: 'プロトタイプ開発',
              dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 15),
              status: 'pending',
            },
          ],
        },
        tasks: {
          create: [
            {
              title: '既存システム分析',
              description: '現行金融システムの詳細分析とギャップ分析',
              status: 'completed',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth() - 1, 10),
              assigneeId: consultantUser.id,
            },
            {
              title: 'APIアーキテクチャ設計',
              description: 'マイクロサービスベースのAPI設計書作成',
              status: 'in_progress',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
              assigneeId: consultantUser.id,
            },
            {
              title: 'セキュリティ要件定義',
              description: '金融規制に準拠したセキュリティ要件の定義',
              status: 'in_progress',
              priority: 'high',
              dueDate: new Date(now.getFullYear(), now.getMonth(), 20),
              assigneeId: pmUser.id,
            },
            {
              title: 'UI/UXデザインレビュー',
              description: 'ユーザビリティテストとデザイン改善',
              status: 'todo',
              priority: 'medium',
              dueDate: new Date(now.getFullYear(), now.getMonth() + 1, 5),
              assigneeId: pmUser.id,
            },
          ],
        },
      },
    }),
    prisma.project.create({
      data: {
        name: 'サプライチェーン最適化',
        code: 'SCM005',
        clientId: clientOrgs[6].id, // 物流ネットワーク
        status: 'active',
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 6, 0),
        budget: 45000000,
        description: 'AIを活用したサプライチェーン全体の最適化',
      },
    }),
  ])

  // プロジェクトメトリクスのサンプルデータ
  const metricsData = []
  const activeProjects = projects.filter(p => p.status === 'active')
  for (const project of activeProjects) {
    for (let i = 3; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const revenue = project.budget / 6 * (1 + Math.random() * 0.2 - 0.1)
      const cost = revenue * 0.7 * (1 + Math.random() * 0.1)
      
      metricsData.push({
        projectId: project.id,
        date: date,
        revenue: revenue,
        cost: cost,
        margin: revenue - cost,
        utilization: 0.7 + Math.random() * 0.2,
        progressRate: (3 - i) / 6,
      })
    }
  }
  
  await prisma.projectMetric.createMany({
    data: metricsData,
  })

  // スキルカテゴリとスキルのサンプルデータ
  const skillCategories = await Promise.all([
    prisma.skillCategory.create({
      data: {
        name: 'プログラミング言語',
        order: 1,
        skills: {
          create: [
            { name: 'JavaScript' },
            { name: 'TypeScript' },
            { name: 'Python' },
            { name: 'Java' },
            { name: 'Go' },
            { name: 'C#' },
            { name: 'Ruby' },
            { name: 'PHP' },
          ],
        },
      },
    }),
    prisma.skillCategory.create({
      data: {
        name: 'フレームワーク・ライブラリ',
        order: 2,
        skills: {
          create: [
            { name: 'React' },
            { name: 'Next.js' },
            { name: 'Vue.js' },
            { name: 'Angular' },
            { name: 'Express' },
            { name: 'Django' },
            { name: 'Spring Boot' },
            { name: 'Rails' },
          ],
        },
      },
    }),
    prisma.skillCategory.create({
      data: {
        name: 'クラウド・インフラ',
        order: 3,
        skills: {
          create: [
            { name: 'AWS' },
            { name: 'Azure' },
            { name: 'GCP' },
            { name: 'Docker' },
            { name: 'Kubernetes' },
            { name: 'Terraform' },
          ],
        },
      },
    }),
    prisma.skillCategory.create({
      data: {
        name: 'データベース',
        order: 4,
        skills: {
          create: [
            { name: 'MySQL' },
            { name: 'PostgreSQL' },
            { name: 'MongoDB' },
            { name: 'Redis' },
            { name: 'Oracle' },
            { name: 'SQL Server' },
          ],
        },
      },
    }),
    prisma.skillCategory.create({
      data: {
        name: 'ビジネススキル',
        order: 5,
        skills: {
          create: [
            { name: 'プロジェクト管理' },
            { name: '要件定義' },
            { name: 'プレゼンテーション' },
            { name: 'ファシリテーション' },
            { name: '提案書作成' },
            { name: 'データ分析' },
          ],
        },
      },
    }),
    prisma.skillCategory.create({
      data: {
        name: '業界知識',
        order: 6,
        skills: {
          create: [
            { name: '金融・銀行' },
            { name: '製造業' },
            { name: 'ヘルスケア' },
            { name: '小売・EC' },
            { name: '物流・SCM' },
            { name: 'エネルギー' },
          ],
        },
      },
    }),
  ])

  // PMユーザーのスキル
  const pmSkills = await prisma.skill.findMany({
    where: {
      name: {
        in: ['プロジェクト管理', 'React', 'Next.js', 'TypeScript', 'AWS', 'プレゼンテーション'],
      },
    },
  })

  for (const skill of pmSkills) {
    await prisma.userSkill.create({
      data: {
        userId: pmUser.id,
        skillId: skill.id,
        level: skill.name === 'プロジェクト管理' ? 5 : 
               skill.name === 'プレゼンテーション' ? 4 :
               skill.name === 'React' ? 4 :
               skill.name === 'Next.js' ? 4 :
               skill.name === 'TypeScript' ? 3 :
               skill.name === 'AWS' ? 3 : 3,
        experienceYears: skill.name === 'プロジェクト管理' ? 10 :
                         skill.name === 'React' ? 5 :
                         skill.name === 'AWS' ? 4 : 3,
        certifications: skill.name === 'AWS' ? JSON.stringify(['AWS Solutions Architect Associate']) :
                        skill.name === 'プロジェクト管理' ? JSON.stringify(['PMP', 'スクラムマスター']) :
                        null,
      },
    })
  }

  // コンサルタントユーザーのスキル
  const consultantSkills = await prisma.skill.findMany({
    where: {
      name: {
        in: ['JavaScript', 'TypeScript', 'React', 'Python', 'データ分析', '金融・銀行'],
      },
    },
  })

  for (const skill of consultantSkills) {
    await prisma.userSkill.create({
      data: {
        userId: consultantUser.id,
        skillId: skill.id,
        level: skill.name === 'JavaScript' ? 4 :
               skill.name === 'TypeScript' ? 3 :
               skill.name === 'React' ? 3 :
               skill.name === 'Python' ? 5 :
               skill.name === 'データ分析' ? 4 :
               skill.name === '金融・銀行' ? 3 : 3,
        experienceYears: skill.name === 'Python' ? 7 :
                         skill.name === 'JavaScript' ? 5 :
                         skill.name === 'データ分析' ? 4 : 2,
        certifications: skill.name === 'Python' ? JSON.stringify(['Python3 エンジニア認定基礎試験']) : null,
      },
    })
  }

  // 収益・コスト・工数の初期データを作成
  console.log('Creating financial and timesheet data...')
  
  for (const project of activeProjects) {
    // 過去3ヶ月分の収益データを作成
    for (let i = 2; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 15)
      
      // 月次収益（プロジェクト予算の1/6を月次収益として設定）
      await prisma.revenue.create({
        data: {
          projectId: project.id,
          date,
          amount: project.budget / 6,
          type: 'monthly_fee',
          description: `${date.getFullYear()}年${date.getMonth() + 1}月分月次フィー`,
          status: i === 0 ? 'invoiced' : 'paid', // 今月分は請求済み、過去分は入金済み
          paidAt: i === 0 ? null : new Date(date.getFullYear(), date.getMonth() + 1, 5),
        },
      })
      
      // 外注費（月によってランダム）
      if (Math.random() > 0.5) {
        await prisma.cost.create({
          data: {
            projectId: project.id,
            date,
            amount: project.budget / 6 * 0.1 * (Math.random() + 0.5), // 収益の5-15%
            category: 'outsourcing',
            description: '外部コンサルタント費用',
            approved: true,
          },
        })
      }
      
      // 経費
      await prisma.cost.create({
        data: {
          projectId: project.id,
          date: new Date(date.getFullYear(), date.getMonth(), 25),
          amount: project.budget / 6 * 0.05, // 収益の5%
          category: 'expense',
          description: '交通費・会議費等',
          approved: true,
        },
      })
    }
    
    // プロジェクトメンバーの工数データを作成（過去1ヶ月分）
    const projectMembers = await prisma.projectMember.findMany({
      where: { projectId: project.id },
      include: { user: true },
    })
    
    for (const member of projectMembers) {
      // 週5日、1日の稼働時間は割当率に応じて設定
      const dailyHours = member.allocation * 0.08 // 100%稼働で8時間
      
      for (let day = 30; day >= 0; day--) {
        const workDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day)
        
        // 土日は除外
        if (workDate.getDay() === 0 || workDate.getDay() === 6) continue
        
        // プロジェクトのタスクを取得
        const projectTasks = await prisma.task.findMany({
          where: { 
            projectId: project.id,
            assigneeId: member.userId,
          },
          take: 1,
        })
        
        await prisma.timeEntry.create({
          data: {
            userId: member.userId,
            projectId: project.id,
            taskId: projectTasks[0]?.id,
            date: workDate,
            hours: dailyHours + (Math.random() * 2 - 1), // ±1時間の変動
            description: projectTasks[0] ? `${projectTasks[0].title}の作業` : 'プロジェクト関連作業',
            billable: true,
            approved: day > 7, // 1週間以前のものは承認済み
            approvedBy: day > 7 ? pmUser.id : null,
            approvedAt: day > 7 ? new Date(workDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null,
          },
        })
      }
    }
  }
  
  // 初回のKPI計算を実行
  console.log('Calculating initial KPIs...')
  const { calculateAndSaveKPIs } = await import('../app/actions/kpi')
  
  // 過去3ヶ月分の月次KPIを計算
  for (let i = 2; i >= 0; i--) {
    const kpiDate = new Date(now.getFullYear(), now.getMonth() - i, 15)
    await calculateAndSaveKPIs(kpiDate, 'monthly')
  }
  
  // 今週の週次KPIを計算
  await calculateAndSaveKPIs(now, 'weekly')
  
  // 今日の日次KPIを計算
  await calculateAndSaveKPIs(now, 'daily')

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })