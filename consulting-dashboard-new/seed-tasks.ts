import { projectDb } from './app/lib/db/project-db'
import { authDb } from './app/lib/db/auth-db'

async function main() {
  console.log('🌱 タスクデータのシード投入を開始...')

  try {
    // プロジェクトとマイルストーンを取得
    const projects = await projectDb.project.findMany({
      include: {
        milestones: true,
        projectMembers: true
      }
    })

    console.log(`プロジェクト数: ${projects.length}`)

    // ユーザーを取得（assigneeとして使用）
    const users = await authDb.user.findMany()
    const userMap = new Map(users.map(u => [u.id, u]))

    let totalTasks = 0

    for (const project of projects) {
      console.log(`\n📋 ${project.name}のタスクを作成中...`)

      // プロジェクトメンバーのuserIdリストを取得
      const memberUserIds = project.projectMembers.map(m => m.userId)

      // 各マイルストーンにタスクを作成
      for (const milestone of project.milestones) {
        const tasksPerMilestone = 3 + Math.floor(Math.random() * 3) // 3-5タスク

        for (let i = 0; i < tasksPerMilestone; i++) {
          // ランダムにメンバーを割り当て
          const assigneeId = memberUserIds[Math.floor(Math.random() * memberUserIds.length)]
          const assignee = userMap.get(assigneeId)

          const taskTypes = [
            { title: '要件定義', description: '機能要件と非機能要件の定義' },
            { title: '設計書作成', description: 'システム設計書の作成とレビュー' },
            { title: '実装', description: '機能の実装とユニットテスト' },
            { title: 'テスト', description: '統合テストとシステムテスト' },
            { title: 'ドキュメント作成', description: 'ユーザーマニュアルと技術文書の作成' },
            { title: 'レビュー', description: 'コードレビューと品質チェック' },
            { title: 'デプロイ準備', description: '本番環境へのデプロイ準備' },
            { title: 'パフォーマンス改善', description: 'システムパフォーマンスの測定と改善' }
          ]

          const taskType = taskTypes[i % taskTypes.length]
          const statuses = ['todo', 'in_progress', 'review', 'completed']
          const priorities = ['low', 'medium', 'high', 'urgent']
          
          // マイルストーンの進捗に応じてステータスを決定
          let status: string
          if (milestone.status === 'completed') {
            status = 'completed'
          } else if (milestone.completionRate > 75) {
            status = statuses[Math.floor(Math.random() * statuses.length)]
          } else if (milestone.completionRate > 50) {
            status = Math.random() > 0.3 ? 'in_progress' : 'todo'
          } else {
            status = Math.random() > 0.7 ? 'in_progress' : 'todo'
          }

          const estimatedHours = 8 * (1 + Math.floor(Math.random() * 5)) // 8-40時間
          const actualHours = status === 'completed' 
            ? estimatedHours * (0.8 + Math.random() * 0.4) // 80%-120%
            : status === 'in_progress'
            ? estimatedHours * Math.random() * 0.5 // 0%-50%
            : null

          // 期日の計算
          const startDate = new Date(milestone.dueDate)
          startDate.setDate(startDate.getDate() - 30 + Math.floor(Math.random() * 20))
          
          const dueDate = new Date(startDate)
          dueDate.setDate(dueDate.getDate() + 7 + Math.floor(Math.random() * 14))

          const completedAt = status === 'completed' 
            ? new Date(dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000) // 期限の0-5日前
            : null

          await projectDb.task.create({
            data: {
              projectId: project.id,
              milestoneId: milestone.id,
              assigneeId,
              title: `${milestone.name} - ${taskType.title}`,
              description: taskType.description,
              status,
              priority: priorities[Math.floor(Math.random() * priorities.length)],
              estimatedHours,
              actualHours,
              startDate,
              dueDate,
              completedAt,
              tags: ['開発', 'フロントエンド', 'バックエンド', 'インフラ', 'セキュリティ']
                .sort(() => Math.random() - 0.5)
                .slice(0, 2)
                .join(',')
            }
          })

          console.log(`  ✅ タスク作成: ${milestone.name} - ${taskType.title} (担当: ${assignee?.name || 'Unknown'})`)
          totalTasks++
        }
      }

      // プロジェクト直下のタスク（マイルストーンに紐づかない）も作成
      const directTaskCount = 2 + Math.floor(Math.random() * 3) // 2-4タスク
      
      for (let i = 0; i < directTaskCount; i++) {
        const assigneeId = memberUserIds[Math.floor(Math.random() * memberUserIds.length)]
        const assignee = userMap.get(assigneeId)

        const generalTasks = [
          { title: 'プロジェクト計画書更新', description: 'プロジェクト計画書の定期更新' },
          { title: 'ステークホルダー会議', description: '週次ステークホルダー会議の準備と実施' },
          { title: 'リスク分析', description: 'プロジェクトリスクの分析と対策立案' },
          { title: '進捗報告書作成', description: '月次進捗報告書の作成' },
          { title: 'チームビルディング', description: 'チーム強化のための活動企画' }
        ]

        const task = generalTasks[i % generalTasks.length]
        const status = ['todo', 'in_progress'][Math.floor(Math.random() * 2)]
        
        await projectDb.task.create({
          data: {
            projectId: project.id,
            assigneeId,
            title: task.title,
            description: task.description,
            status,
            priority: 'medium',
            estimatedHours: 4 + Math.floor(Math.random() * 4) * 4, // 4-16時間
            startDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後
            tags: 'プロジェクト管理'
          }
        })

        console.log(`  ✅ タスク作成: ${task.title} (担当: ${assignee?.name || 'Unknown'})`)
        totalTasks++
      }
    }

    console.log(`\n✅ タスクデータの投入が完了しました！`)
    console.log(`総タスク数: ${totalTasks}`)

  } catch (error) {
    console.error('❌ エラー:', error)
  } finally {
    await projectDb.$disconnect()
    await authDb.$disconnect()
  }
}

main()