'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, User } from 'lucide-react'
import Link from 'next/link'

interface RiskyTasksProps {
  tasks: any[]
}

export function RiskyTasks({ tasks }: RiskyTasksProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '緊急'
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return priority
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysOverdue = (date: Date | string) => {
    const due = new Date(date)
    const today = new Date()
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
    if (diff > 0) return `${diff}日超過`
    if (diff === 0) return '今日期限'
    return `あと${Math.abs(diff)}日`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          要注意タスク
        </CardTitle>
        <CardDescription>
          期限切れ・期限間近のタスク
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            期限が迫っているタスクはありません
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date()
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg transition-colors ${
                    isOverdue ? 'border-red-200 bg-red-50/50' : 'hover:bg-accent/50'
                  }`}
                >
                  <Clock className={`h-4 w-4 mt-0.5 ${
                    isOverdue ? 'text-red-500' : 'text-muted-foreground'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Link
                          href={`/projects/${task.projectId}/tasks/${task.id}`}
                          className="font-medium text-sm hover:underline"
                        >
                          {task.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {task.project.client?.name || 'クライアント未設定'} - {task.project.name}
                        </p>
                      </div>
                      <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        期限: {formatDate(task.dueDate)}
                      </span>
                      <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                        {getDaysOverdue(task.dueDate)}
                      </span>
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assignee.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}