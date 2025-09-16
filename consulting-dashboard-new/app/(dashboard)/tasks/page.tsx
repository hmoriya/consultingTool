import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'

export default async function TasksPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // ユーザーに割り当てられたタスクを取得
  const tasks = await db.task.findMany({
    where: {
      assigneeId: user.id
    },
    include: {
      project: {
        include: {
          client: true
        }
      },
      milestone: true,
      assignee: true
    },
    orderBy: [
      { status: 'asc' },
      { dueDate: 'asc' }
    ]
  })

  const statusConfig = {
    todo: { label: '未着手', color: 'bg-gray-500', icon: Circle },
    pending: { label: '未着手', color: 'bg-gray-500', icon: Circle },
    in_progress: { label: '進行中', color: 'bg-blue-500', icon: Clock },
    review: { label: 'レビュー', color: 'bg-yellow-500', icon: Clock },
    completed: { label: '完了', color: 'bg-green-500', icon: CheckCircle2 },
    blocked: { label: 'ブロック', color: 'bg-red-500', icon: AlertCircle }
  }

  const priorityConfig = {
    low: { label: '低', color: 'default' },
    medium: { label: '中', color: 'secondary' },
    high: { label: '高', color: 'destructive' },
    urgent: { label: '緊急', color: 'destructive' }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">タスク管理</h1>
        <p className="text-muted-foreground">
          あなたに割り当てられたタスクの一覧
        </p>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Circle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                現在割り当てられているタスクはありません
              </p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => {
            const statusInfo = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo
            const StatusIcon = statusInfo.icon
            const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium
            
            return (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${statusInfo.color.replace('bg-', 'text-')}`} />
                        {task.title}
                      </CardTitle>
                      <CardDescription>
                        {task.project.client.name} - {task.project.name}
                        {task.milestone && ` / ${task.milestone.name}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={priorityInfo.color as any}>
                        優先度: {priorityInfo.label}
                      </Badge>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {task.dueDate && (
                          <span className="text-muted-foreground">
                            期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span className="text-muted-foreground">
                            見積時間: {Number(task.estimatedHours).toFixed(1)}h
                          </span>
                        )}
                        {task.actualHours !== null && (
                          <span className="text-muted-foreground">
                            実績時間: {Number(task.actualHours).toFixed(1)}h
                          </span>
                        )}
                      </div>
                      <Link href={`/tasks/${task.id}`}>
                        <Button variant="outline" size="sm">
                          詳細を見る
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}