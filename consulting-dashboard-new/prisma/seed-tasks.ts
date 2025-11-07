import { config } from 'dotenv'
import { PrismaClient as ProjectPrismaClient } from '@prisma/project-client'

// Load environment variables
config()

const projectDb = new ProjectPrismaClient({
  log: ['error', 'warn']
})

async function main() {
  try {
    console.log('Seeding task data...')

    // Get all projects
    const projects = await projectDb.project.findMany()
    console.log(`Found ${projects.length} projects`)

    if (projects.length === 0) {
      console.log('No projects found. Please seed projects first.')
      return
    }

    // PMユーザーのIDを取得（シードデータで固定）
    const pmUserId = 'cln8abc120001qs01example2' // 鈴木 花子のID
    
    // タスクデータの定義（一部のタスクにPMを割り当て）
    const taskTemplates = [
      // 分析・設計フェーズ
      {
        title: '現状分析・要件定義',
        description: '現行システムの分析と新システムの要件定義を行う',
        status: 'completed',
        priority: 'high',
        estimatedHours: 80,
        actualHours: 85,
        progress: 100,
        phase: '要件定義',
        daysFromStart: 0,
        duration: 14,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'アーキテクチャ設計',
        description: 'システムアーキテクチャの設計と技術選定',
        status: 'completed',
        priority: 'high',
        estimatedHours: 60,
        actualHours: 65,
        progress: 100,
        phase: '基本設計',
        daysFromStart: 14,
        duration: 10
      },
      {
        title: 'データベース設計',
        description: 'データモデルの設計とER図の作成',
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 40,
        actualHours: 25,
        progress: 70,
        phase: '基本設計',
        daysFromStart: 20,
        duration: 7,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'API仕様書作成',
        description: 'REST API仕様書の作成とレビュー',
        status: 'in_progress',
        priority: 'medium',
        estimatedHours: 30,
        actualHours: 20,
        progress: 60,
        phase: '基本設計',
        daysFromStart: 25,
        duration: 5
      },
      {
        title: 'UI/UXデザイン',
        description: 'ユーザーインターフェースのデザインとプロトタイプ作成',
        status: 'in_progress',
        priority: 'medium',
        estimatedHours: 50,
        actualHours: 30,
        progress: 50,
        phase: '基本設計',
        daysFromStart: 20,
        duration: 10,
        assignToPM: true // PMに割り当て
      },
      // 開発フェーズ
      {
        title: '認証機能実装',
        description: 'ログイン/ログアウト、ユーザー管理機能の実装',
        status: 'in_progress',
        priority: 'high',
        estimatedHours: 40,
        actualHours: 15,
        progress: 30,
        phase: '開発',
        daysFromStart: 30,
        duration: 7,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'ダッシュボード画面開発',
        description: 'メインダッシュボードの実装とグラフ表示機能',
        status: 'todo',
        priority: 'high',
        estimatedHours: 60,
        actualHours: 0,
        progress: 0,
        phase: '開発',
        daysFromStart: 35,
        duration: 10,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'レポート機能開発',
        description: 'レポート生成・出力機能の実装',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 45,
        actualHours: 0,
        progress: 0,
        phase: '開発',
        daysFromStart: 40,
        duration: 8
      },
      {
        title: '通知機能実装',
        description: 'メール通知、アプリ内通知機能の実装',
        status: 'todo',
        priority: 'low',
        estimatedHours: 30,
        actualHours: 0,
        progress: 0,
        phase: '開発',
        daysFromStart: 45,
        duration: 5
      },
      // テスト・移行フェーズ
      {
        title: '単体テスト実施',
        description: '各機能の単体テスト実施とバグ修正',
        status: 'todo',
        priority: 'high',
        estimatedHours: 40,
        actualHours: 0,
        progress: 0,
        phase: 'テスト',
        daysFromStart: 50,
        duration: 10
      },
      {
        title: '結合テスト実施',
        description: 'システム全体の結合テストとパフォーマンステスト',
        status: 'todo',
        priority: 'high',
        estimatedHours: 50,
        actualHours: 0,
        progress: 0,
        phase: 'テスト',
        daysFromStart: 55,
        duration: 10,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'ユーザー受入テスト',
        description: 'クライアントによる受入テストのサポート',
        status: 'todo',
        priority: 'high',
        estimatedHours: 30,
        actualHours: 0,
        progress: 0,
        phase: 'テスト',
        daysFromStart: 60,
        duration: 5,
        assignToPM: true // PMに割り当て
      },
      {
        title: 'データ移行準備',
        description: '既存システムからのデータ移行計画と準備',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 25,
        actualHours: 0,
        progress: 0,
        phase: '移行',
        daysFromStart: 55,
        duration: 5
      },
      {
        title: '本番環境構築',
        description: '本番環境の構築とデプロイメント準備',
        status: 'todo',
        priority: 'high',
        estimatedHours: 20,
        actualHours: 0,
        progress: 0,
        phase: '移行',
        daysFromStart: 60,
        duration: 3
      },
      {
        title: 'ユーザートレーニング',
        description: 'エンドユーザー向けトレーニングの実施',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 15,
        actualHours: 0,
        progress: 0,
        phase: '移行',
        daysFromStart: 65,
        duration: 3
      }
    ]

    // 各プロジェクトに対してタスクを作成
    for (const project of projects) {
      console.log(`\nCreating tasks for project: ${project.name}`)
      
      const projectStartDate = new Date(project.startDate)
      let createdCount = 0
      
      // 各タスクテンプレートをベースにタスクを作成
      for (let i = 0; i < taskTemplates.length; i++) {
        const template = taskTemplates[i]
        
        // タスクの開始日と終了日を計算
        const taskStartDate = new Date(projectStartDate)
        taskStartDate.setDate(taskStartDate.getDate() + template.daysFromStart)
        
        const taskDueDate = new Date(taskStartDate)
        taskDueDate.setDate(taskDueDate.getDate() + template.duration)
        
        // 既存のタスクをチェック
        const existingTask = await projectDb.task.findFirst({
          where: {
            projectId: project.id,
            title: `${project.name} - ${template.title}`
          }
        })
        
        if (!existingTask) {
          await projectDb.task.create({
            data: {
              title: `${project.name} - ${template.title}`,
              description: template.description,
              projectId: project.id,
              status: template.status,
              priority: template.priority,
              startDate: taskStartDate,
              dueDate: taskDueDate,
              estimatedHours: template.estimatedHours,
              actualHours: template.actualHours,
              tags: template.phase,
              // 一部のタスクをPMに割り当て
              assigneeId: template.assignToPM ? pmUserId : undefined
            }
          })
          createdCount++
        }
      }
      
      console.log(`Created ${createdCount} tasks for ${project.name}`)
    }


    console.log('\n✅ Task data seeding completed')

  } catch (_error) {
    console.error('Error seeding task data:', error)
    throw error
  } finally {
    await projectDb.$disconnect()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))