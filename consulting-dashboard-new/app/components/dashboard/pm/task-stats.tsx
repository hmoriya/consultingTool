'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react'

interface TaskStatsProps {
  stats: {
    total: number
    todo: number
    in_progress: number
    in_review: number
    completed: number
  }
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  const taskCategories = [
    {
      label: '未着手',
      value: stats.todo,
      icon: Circle,
      color: 'text-gray-500'
    },
    {
      label: '進行中',
      value: stats.in_progress,
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      label: 'レビュー中',
      value: stats.in_review,
      icon: AlertCircle,
      color: 'text-yellow-500'
    },
    {
      label: '完了',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-500'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>タスク統計</CardTitle>
        <CardDescription>
          全プロジェクトのタスク状況
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 完了率 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">完了率</span>
            <span className="text-sm font-bold">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* タスク内訳 */}
        <div className="grid grid-cols-2 gap-4">
          {taskCategories.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.label} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  <span className="text-sm font-medium">{category.label}</span>
                </div>
                <p className="text-2xl font-bold">{category.value}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? Math.round((category.value / stats.total) * 100) : 0}%
                </p>
              </div>
            )
          })}
        </div>

        {/* 合計 */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">合計タスク数</span>
            <span className="text-lg font-bold">{stats.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}