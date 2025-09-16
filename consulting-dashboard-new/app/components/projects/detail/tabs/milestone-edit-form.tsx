'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { MilestoneItem, MilestoneStatus, updateMilestone } from '@/actions/milestones'
import { X, Save, Target, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

const milestoneSchema = z.object({
  name: z.string().min(1, 'マイルストーン名は必須です').max(100, 'マイルストーン名は100文字以内で入力してください'),
  description: z.string().optional(),
  dueDate: z.string().min(1, '期日は必須です'),
  status: z.enum(['pending', 'completed', 'delayed'])
})

type MilestoneFormData = z.infer<typeof milestoneSchema>

interface MilestoneEditFormProps {
  milestone: MilestoneItem
  onClose: () => void
  onMilestoneUpdated: () => void
}

const statusLabels: Record<MilestoneStatus, string> = {
  pending: '進行中',
  completed: '完了',
  delayed: '遅延'
}

const statusColors: Record<MilestoneStatus, string> = {
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  delayed: 'bg-red-100 text-red-700'
}

const statusIcons: Record<MilestoneStatus, any> = {
  pending: Clock,
  completed: CheckCircle2,
  delayed: AlertCircle
}

export function MilestoneEditForm({ milestone, onClose, onMilestoneUpdated }: MilestoneEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      name: milestone.name,
      description: milestone.description || '',
      dueDate: format(new Date(milestone.dueDate), 'yyyy-MM-dd'),
      status: milestone.status
    }
  })

  const watchedStatus = watch('status')
  const watchedName = watch('name')
  const watchedDueDate = watch('dueDate')

  const onSubmit = async (data: MilestoneFormData) => {
    setIsLoading(true)
    try {
      await updateMilestone(milestone.id, {
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        status: data.status as MilestoneStatus
      })
      onMilestoneUpdated()
      onClose()
    } catch (error) {
      console.error('Failed to update milestone:', error)
      alert('マイルストーンの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: MilestoneStatus) => {
    const Icon = statusIcons[status]
    return <Icon className="h-4 w-4" />
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            マイルストーン編集
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 現在のマイルストーン情報 */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">編集対象マイルストーン</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{milestone.name}</span>
                  <Badge className={statusColors[milestone.status]}>
                    <span className="mr-1">{getStatusIcon(milestone.status)}</span>
                    {statusLabels[milestone.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  期日: {format(new Date(milestone.dueDate), 'yyyy/MM/dd')}
                </p>
                <p className="text-sm text-muted-foreground">
                  進捗: {milestone.completedTaskCount}/{milestone.taskCount} タスク完了 ({milestone.progressRate}%)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 編集フォーム */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">マイルストーン名 *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="例：要件定義完了、設計レビュー完了"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="マイルストーンの詳細や達成条件を記入してください"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dueDate">期日 *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス *</Label>
                <Select value={watchedStatus} onValueChange={(value) => setValue('status', value as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[key as MilestoneStatus]}>
                            <span className="mr-1">{getStatusIcon(key as MilestoneStatus)}</span>
                            {label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 変更プレビュー */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm">変更プレビュー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium">変更前:</span>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">{milestone.name}</p>
                    <Badge className={statusColors[milestone.status]}>
                      <span className="mr-1">{getStatusIcon(milestone.status)}</span>
                      {statusLabels[milestone.status]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(milestone.dueDate), 'yyyy/MM/dd')}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">変更後:</span>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">{watchedName}</p>
                    <Badge className={statusColors[watchedStatus as MilestoneStatus]}>
                      <span className="mr-1">{getStatusIcon(watchedStatus as MilestoneStatus)}</span>
                      {statusLabels[watchedStatus as MilestoneStatus]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {watchedDueDate && new Date(watchedDueDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
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
                  更新中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  更新
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}