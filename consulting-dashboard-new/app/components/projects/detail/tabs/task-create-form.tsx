'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTask, TaskPriority } from '@/actions/tasks'
import { X, Save } from 'lucide-react'

const taskSchema = z.object({
  title: z.string().min(1, 'タスク名は必須です'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  estimatedHours: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
  milestoneId: z.string().optional()
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskCreateFormProps {
  projectId: string
  projectMembers: unknown[]
  milestones: unknown[]
  onClose: () => void
  onTaskCreated: () => void
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  urgent: '緊急'
}

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
}

export function TaskCreateForm({ 
  projectId, 
  projectMembers, 
  milestones, 
  onClose, 
  onTaskCreated 
}: TaskCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'medium'
    }
  })

  const watchedPriority = watch('priority')

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)
    try {
      const taskData = {
        ...data,
        projectId,
        priority: data.priority as TaskPriority,
        estimatedHours: data.estimatedHours ? parseFloat(data.estimatedHours) : undefined,
        assigneeId: data.assigneeId === 'unassigned' ? undefined : data.assigneeId,
        milestoneId: data.milestoneId === 'none' ? undefined : data.milestoneId
      }
      
      await createTask(taskData)
      onTaskCreated()
      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新規タスク作成</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タスク名 *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="タスク名を入力"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="タスクの詳細説明を入力（任意）"
                className="w-full min-h-[100px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">優先度 *</Label>
                <Select value={watchedPriority} onValueChange={(value) => setValue('priority', value as unknown)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge className={priorityColors[key as keyof typeof priorityColors]}>
                            {label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">予想工数（時間）</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('estimatedHours')}
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          {/* 担当者・マイルストーン */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assigneeId">担当者</Label>
                <Select onValueChange={(value) => setValue('assigneeId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="担当者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">未割当</SelectItem>
                    {projectMembers.map(member => (
                      <SelectItem key={member.userId} value={member.userId}>
                        {member.user.name} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="milestoneId">マイルストーン</Label>
                <Select onValueChange={(value) => setValue('milestoneId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="マイルストーンを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {milestones?.map(milestone => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 期間設定 */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">開始日</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">期限</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                />
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">プレビュー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">優先度:</span>
                <Badge className={priorityColors[watchedPriority as keyof typeof priorityColors]}>
                  {priorityLabels[watchedPriority as keyof typeof priorityLabels]}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                初期ステータス: 未着手
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  作成中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  タスク作成
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}