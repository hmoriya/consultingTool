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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter } from '@/components/ui/dialog'
import { createMilestone } from '@/actions/milestones'
import { Target, X, Save } from 'lucide-react'

const milestoneSchema = z.object({
  name: z.string().min(1, 'マイルストーン名は必須です').max(100, 'マイルストーン名は100文字以内で入力してください'),
  description: z.string().optional(),
  dueDate: z.string().min(1, '期日は必須です')
})

type MilestoneFormData = z.infer<typeof milestoneSchema>

interface MilestoneCreateFormProps {
  projectId: string
  onClose: () => void
  onMilestoneCreated: () => void
}

export function MilestoneCreateForm({ projectId, onClose, onMilestoneCreated }: MilestoneCreateFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      dueDate: new Date().toISOString().split('T')[0] // 今日の日付をデフォルトに
    }
  })

  const watchedName = watch('name')
  const watchedDescription = watch('description')
  const watchedDueDate = watch('dueDate')

  const onSubmit = async (data: MilestoneFormData) => {
    setIsLoading(true)
    try {
      await createMilestone({
        projectId,
        name: data.name,
        description: data.description,
        dueDate: data.dueDate
      })
      onMilestoneCreated()
      onClose()
    } catch (_error) {
      console.error('Failed to create milestone:', error)
      alert('マイルストーンの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            マイルストーン作成
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本情報 */}
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
          </div>

          {/* プレビュー */}
          {watchedName && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">プレビュー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium">マイルストーン:</span>
                  <p className="text-sm text-muted-foreground">{watchedName}</p>
                </div>
                {watchedDescription && (
                  <div>
                    <span className="text-sm font-medium">説明:</span>
                    <p className="text-sm text-muted-foreground">{watchedDescription}</p>
                  </div>
                )}
                {watchedDueDate && (
                  <div>
                    <span className="text-sm font-medium">期日:</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(watchedDueDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                  作成
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}