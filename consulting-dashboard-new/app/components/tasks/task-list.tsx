'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'
import { TaskFilters, TaskFilterState } from './task-filters'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: Date | null
  estimatedHours: number | null
  actualHours: number | null
  project: {
    id: string
    name: string
    clientId: string
  }
  milestone?: {
    id: string
    name: string
  } | null
}

interface TaskListProps {
  tasks: Task[]
  clients: Map<string, { name: string }>
  projects: Array<{ id: string; name: string }>
}

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

export function TaskList({ tasks, clients, projects }: TaskListProps) {
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: 'active', // デフォルトで未実施のタスクを表示
    priority: 'all',
    projectId: 'all'
  })

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 検索フィルター
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // ステータスフィルター
      if (filters.status !== 'all') {
        if (filters.status === 'active') {
          // 未実施 = 未着手、進行中、レビュー、ブロック
          if (!['todo', 'pending', 'in_progress', 'review', 'blocked'].includes(task.status)) {
            return false
          }
        } else if (filters.status !== task.status) {
          return false
        }
      }

      // 優先度フィルター
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false
      }

      // プロジェクトフィルター
      if (filters.projectId !== 'all' && task.project.id !== filters.projectId) {
        return false
      }

      return true
    })
  }, [tasks, filters])

  // 期限が近い順、優先度が高い順でソート
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // 完了タスクは最後に
      if (a.status === 'completed' && b.status !== 'completed') return 1
      if (a.status !== 'completed' && b.status === 'completed') return -1
      
      // 期限でソート
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      
      // 優先度でソート
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
    })
  }, [filteredTasks])

  return (
    <div className="space-y-6">
      <TaskFilters
        onFiltersChange={setFilters}
        projects={projects}
        initialStatus="active"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length}件のタスク
        </p>
      </div>

      <div className="grid gap-4">
        {sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Circle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                条件に一致するタスクがありません
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => {
            const statusInfo = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo
            const StatusIcon = statusInfo.icon
            const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'
            
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
                        {clients.get(task.project.clientId)?.name || 'Unknown'} - {task.project.name}
                        {task.milestone && ` / ${task.milestone.name}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={priorityInfo.color as 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined}>
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
                          <span className={`text-muted-foreground ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                            期限: {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                            {isOverdue && ' (期限超過)'}
                          </span>
                        )}
                        {task.estimatedHours && (
                          <span className="text-muted-foreground">
                            見積: {Number(task.estimatedHours).toFixed(1)}h
                          </span>
                        )}
                        {task.actualHours !== null && task.actualHours > 0 && (
                          <span className="text-muted-foreground">
                            実績: {Number(task.actualHours).toFixed(1)}h
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