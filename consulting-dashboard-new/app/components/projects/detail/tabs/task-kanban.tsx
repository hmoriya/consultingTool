'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Plus
} from 'lucide-react'
import { TaskItem, TaskStatus, TaskPriority } from '@/actions/tasks'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface TaskKanbanProps {
  tasks: TaskItem[]
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onTaskUpdate: () => void
}

const _statusLabels: Record<TaskStatus, string> = {
  todo: '未着手',
  in_progress: '進行中',
  review: 'レビュー',
  completed: '完了'
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-50 border-gray-200',
  in_progress: 'bg-blue-50 border-blue-200',
  review: 'bg-yellow-50 border-yellow-200',
  completed: 'bg-green-50 border-green-200'
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

const priorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急'
}

export function TaskKanban({ tasks, onStatusChange, onTaskUpdate: _onTaskUpdate }: TaskKanbanProps) {
  const [draggedTask, setDraggedTask] = useState<TaskItem | null>(null)

  const columns: { status: TaskStatus; label: string }[] = [
    { status: 'todo', label: '未着手' },
    { status: 'in_progress', label: '進行中' },
    { status: 'review', label: 'レビュー' },
    { status: 'completed', label: '完了' }
  ]

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, task: TaskItem) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== targetStatus) {
      onStatusChange(draggedTask.id, targetStatus)
    }
    setDraggedTask(null)
  }

  const TaskCard = ({ task }: { task: TaskItem }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

    return (
      <Card
        className={`cursor-move hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
              <Badge className={`${priorityColors[task.priority]} text-xs`}>
                {priorityLabels[task.priority]}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {task.assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">
                  {task.assignee.name}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {format(new Date(task.dueDate), 'M/d', { locale: ja })}
                  </span>
                </div>
              )}

              {task.estimatedHours && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{task.estimatedHours}h</span>
                </div>
              )}
            </div>

            {task.milestone && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground truncate">
                  {task.milestone.name}
                </span>
              </div>
            )}
          </div>

          {isOverdue && (
            <Badge variant="destructive" className="text-xs">
              遅延
            </Badge>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.status)
        
        return (
          <div key={column.status} className="space-y-4">
            <Card className={statusColors[column.status]}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {column.label}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent 
                className="space-y-3 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      タスクなし
                    </p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}