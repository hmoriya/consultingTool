'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import { startOfWeek, addDays, format, isSameDay } from 'date-fns'
import { ja } from 'date-fns/locale'

interface WeeklyCalendarProps {
  tasks: any[]
}

export function WeeklyCalendar({ tasks }: WeeklyCalendarProps) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      return isSameDay(new Date(task.dueDate), day)
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>今週のスケジュール</CardTitle>
            <CardDescription>今週のタスク期限一覧</CardDescription>
          </div>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weekDays.map((day, index) => {
            const dayTasks = getTasksForDay(day)
            const isToday = isSameDay(day, today)
            
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  isToday ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">
                    {format(day, 'M月d日', { locale: ja })}
                    <span className="text-muted-foreground ml-2">
                      ({format(day, 'E', { locale: ja })})
                    </span>
                  </div>
                  {isToday && (
                    <Badge variant="outline" className="text-xs">
                      今日
                    </Badge>
                  )}
                </div>
                
                {dayTasks.length > 0 ? (
                  <div className="space-y-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-2 rounded border ${getPriorityColor(task.priority || 'medium')}`}
                      >
                        <div className="font-medium line-clamp-1">{task.title}</div>
                        <div className="text-muted-foreground mt-0.5">
                          {task.project.client.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    タスクなし
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}