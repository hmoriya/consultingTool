import { getCurrentUser } from '@/actions/auth'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, Timer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { projectDb } from '@/lib/db/project-db'
import { PrismaClient as TimesheetPrismaClient } from '@prisma/timesheet-service'
import { TaskActions } from '@/components/tasks/task-actions'

const timesheetDb = new TimesheetPrismaClient()

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const task = await projectDb.task.findUnique({
    where: {
      id,
      assigneeId: user.id // ユーザーに割り当てられたタスクのみ表示
    },
    include: {
      project: true,
      milestone: true
    }
  })

  if (!task) {
    notFound()
  }

  // クライアント情報を取得
  const client = await db.organization.findUnique({
    where: { id: task.project.clientId }
  })

  // timesheet-serviceから工数エントリを取得
  const timeEntries = await timesheetDb.timeEntry.findMany({
    where: {
      consultantId: user.id,
      taskId: task.id
    },
    orderBy: {
      date: 'desc'
    },
    take: 10
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

  const statusInfo = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo
  const StatusIcon = statusInfo.icon
  const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium

  // 実績時間の計算
  const totalActualHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            タスク一覧に戻る
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl flex items-center gap-3">
                <StatusIcon className={`h-6 w-6 ${statusInfo.color.replace('bg-', 'text-')}`} />
                {task.title}
              </CardTitle>
              <CardDescription className="text-base">
                {client?.name || 'Unknown'} - {task.project.name}
                {task.milestone && ` / ${task.milestone.name}`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={priorityInfo.color as 'default' | 'secondary' | 'destructive'}>
                優先度: {priorityInfo.label}
              </Badge>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">説明</h3>
            <p className="text-sm whitespace-pre-wrap">{task.description || '説明はありません'}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">開始日</span>
              </div>
              <p className="text-sm font-medium">
                {task.startDate ? new Date(task.startDate).toLocaleDateString('ja-JP') : '未設定'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">期限</span>
              </div>
              <p className="text-sm font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ja-JP') : '未設定'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span className="text-sm">見積時間</span>
              </div>
              <p className="text-sm font-medium">
                {task.estimatedHours ? `${Number(task.estimatedHours).toFixed(1)}時間` : '未設定'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span className="text-sm">実績時間</span>
              </div>
              <p className="text-sm font-medium">
                {totalActualHours > 0 ? `${totalActualHours.toFixed(1)}時間` : '0時間'}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">最近の工数記録</h3>
            {timeEntries.length > 0 ? (
              <div className="space-y-2">
                {timeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {new Date(entry.date).toLocaleDateString('ja-JP')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.description || '作業内容未記入'}
                      </div>
                    </div>
                    <Badge variant="secondary">{entry.hours.toFixed(1)}h</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">まだ工数記録がありません</p>
            )}
          </div>

          <Separator />
          <TaskActions taskId={task.id} taskStatus={task.status} />
        </CardContent>
      </Card>
    </div>
  )
}