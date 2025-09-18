import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { TaskList } from '../../components/tasks/task-list'

export default async function TasksPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // ユーザーに割り当てられたタスクを取得
  const tasks = await projectDb.task.findMany({
    where: {
      assigneeId: user.id
    },
    include: {
      project: true,
      milestone: true
    },
    orderBy: [
      { status: 'asc' },
      { dueDate: 'asc' }
    ]
  })

  // クライアント情報を取得
  const clientIds = [...new Set(tasks.map(t => t.project.clientId))]
  const clients = await db.organization.findMany({
    where: { id: { in: clientIds } }
  })
  const clientMap = new Map(clients.map(c => [c.id, c]))

  // 利用可能なプロジェクトを取得（フィルター用）
  const projects = await projectDb.project.findMany({
    where: {
      id: { in: [...new Set(tasks.map(t => t.project.id))] }
    },
    select: {
      id: true,
      name: true
    }
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">タスク管理</h1>
        <p className="text-muted-foreground">
          あなたに割り当てられたタスクの一覧
        </p>
      </div>

      <TaskList 
        tasks={tasks}
        clients={clientMap}
        projects={projects}
      />
    </div>
  )
}