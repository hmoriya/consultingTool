import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { getUserTasks } from '@/actions/tasks'
import { TaskList } from '../../components/tasks/task-list'

export default async function TasksPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // ユーザーに割り当てられたタスクを取得（クライアント情報も含む）
  const tasksWithClient = await getUserTasks()
  
  // クライアントマップを作成
  const clientMap = new Map(
    tasksWithClient
      .filter((task: any) => task.client)
      .map((task: any) => [task.client!.id, task.client!])
  )

  // 利用可能なプロジェクトを抽出（フィルター用）
  const projects = [...new Map(
    tasksWithClient.map((task: any) => [task.project.id, {
      id: task.project.id,
      name: task.project.name
    }])
  ).values()]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">タスク管理</h1>
        <p className="text-muted-foreground">
          あなたに割り当てられたタスクの一覧
        </p>
      </div>

      <TaskList 
        tasks={tasksWithClient}
        clients={clientMap}
        projects={projects}
      />
    </div>
  )
}