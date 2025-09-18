'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { updateTaskStatus } from '@/actions/consultant-dashboard'
import { useRouter } from 'next/navigation'

interface TaskListProps {
  tasks: any[]
}

const statusConfig = {
  todo: { label: '未着手', color: 'bg-gray-500', icon: Clock },
  in_progress: { label: '進行中', color: 'bg-blue-500', icon: PlayCircle },
  in_review: { label: 'レビュー待ち', color: 'bg-yellow-500', icon: AlertCircle },
  completed: { label: '完了', color: 'bg-green-500', icon: CheckCircle }
} as const

export function TaskList({ tasks }: TaskListProps) {
  const router = useRouter()
  const [updatingTask, setUpdatingTask] = useState<string | null>(null)

  const handleStatusChange = async (taskId: string, status: string) => {
    setUpdatingTask(taskId)
    try {
      await updateTaskStatus(taskId, status as any)
      router.refresh()
    } catch (error) {
      console.error('Failed to update task status:', error)
    } finally {
      setUpdatingTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return '期限なし'
    const d = new Date(date)
    return d.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }

  const isOverdue = (date: Date | string | null) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>マイタスク</CardTitle>
            <CardDescription>担当タスクの一覧と進捗管理</CardDescription>
          </div>
          <Link href="/projects">
            <Button variant="ghost" size="sm">
              すべて見る
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
            <p>担当タスクはありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link 
                        href={`/projects/${task.projectId}`}
                        className="font-medium hover:underline"
                      >
                        {task.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{task.project.name}</span>
                      </div>
                    </div>
                    <Badge 
                      className={getPriorityColor(task.priority || 'medium')}
                      variant="secondary"
                    >
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <div className={`flex items-center gap-1 text-sm ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-muted-foreground'}`}>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                      disabled={updatingTask === task.id}
                    >
                      <SelectTrigger className="h-7 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([value, config]) => {
                          const Icon = config.icon
                          return (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-3 w-3" />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}