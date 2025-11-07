'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  Clock,
  User,
  Edit,
  CheckCircle2,
  Play,
  Pause,
  Eye,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { TaskItem, TaskStatus, TaskPriority, updateTaskStatus, deleteTask } from '@/actions/tasks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface TaskCardProps {
  task: TaskItem
  onStatusChange: (taskId: string, status: TaskStatus) => void
  onTaskUpdate: () => void
}

const statusLabels: Record<TaskStatus, string> = {
  todo: '未着手',
  in_progress: '進行中',
  review: 'レビュー',
  completed: '完了'
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700'
}

const priorityLabels: Record<TaskPriority, string> = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急'
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

export function TaskCard({ task, onStatusChange, onTaskUpdate }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task.id, newStatus)
  }

  const handleDelete = async () => {
    if (!confirm('このタスクを削除しますか？')) return
    
    try {
      setIsDeleting(true)
      await deleteTask(task.id)
      onTaskUpdate()
    } catch (_error) {
      console.error('Failed to delete task:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getProgressPercent = () => {
    if (task.status === 'completed') return 100
    if (task.status === 'review') return 90
    if (task.status === 'in_progress') return 50
    return 0
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  return (
    <Card className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{task.title}</h4>
              <Badge className={priorityColors[task.priority]}>
                {priorityLabels[task.priority]}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">遅延</Badge>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              value={task.status}
              onValueChange={(value: TaskStatus) => handleStatusChange(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  詳細
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  削除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 進捗バー */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>進捗</span>
            <span>{getProgressPercent()}%</span>
          </div>
          <Progress value={getProgressPercent()} className="h-2" />
        </div>

        {/* メタデータ */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            {task.assignee && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {task.assignee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {task.assignee.name}
                  </span>
                </div>
              </div>
            )}

            {task.milestone && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {task.milestone.name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                  {format(new Date(task.dueDate), 'M/d', { locale: ja })}
                </span>
              </div>
            )}

            {task.estimatedHours && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  予定: {Number(task.estimatedHours).toFixed(1)}h
                  {task.actualHours && (
                    <span className="ml-1">
                      / 実績: {Number(task.actualHours).toFixed(1)}h
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* クイックアクション */}
        <div className="flex gap-2 pt-2">
          {task.status === 'todo' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('in_progress')}
            >
              <Play className="h-4 w-4 mr-1" />
              開始
            </Button>
          )}
          
          {task.status === 'in_progress' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange('review')}
              >
                <Eye className="h-4 w-4 mr-1" />
                レビュー依頼
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange('todo')}
              >
                <Pause className="h-4 w-4 mr-1" />
                一時停止
              </Button>
            </>
          )}
          
          {task.status === 'review' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('completed')}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              完了
            </Button>
          )}

          {task.status !== 'completed' && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handleStatusChange('completed')}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              完了にする
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}