'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { updateDeliverable, getAccessibleProjects, getProjectMilestones } from '@/actions/deliverables'
import { toast } from 'sonner'

const deliverableSchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  milestoneId: z.string().optional(),
  name: z.string().min(1, '成果物名を入力してください'),
  description: z.string().optional(),
  type: z.enum(['document', 'software', 'report', 'presentation', 'other']),
  status: z.enum(['draft', 'review', 'approved', 'delivered']),
  version: z.string().optional(),
  fileUrl: z.string().optional()
})

type FormData = z.infer<typeof deliverableSchema>

interface Deliverable {
  id: string
  name: string
  description?: string | null
  type: string
  status: string
  version?: string | null
  fileUrl?: string | null
  project: {
    name: string
    code: string
  }
  milestone?: {
    name: string
  } | null
}

interface EditDeliverableDialogProps {
  deliverable: Deliverable
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Project {
  id: string
  name: string
  code: string
  status: string
}

interface Milestone {
  id: string
  name: string
  dueDate: Date | null
  status: string
}

export function EditDeliverableDialog({ deliverable, open, onOpenChange }: EditDeliverableDialogProps) {
  const [, setProjects] = useState<Project[]>([])
  const [, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      projectId: '',
      milestoneId: '',
      name: deliverable.name,
      description: deliverable.description || '',
      type: deliverable.type as FormData['type'],
      status: deliverable.status as FormData['status'],
      version: deliverable.version || '',
      fileUrl: deliverable.fileUrl || ''
    }
  })

  const projectId = form.watch('projectId')

  // プロジェクト一覧を取得
  useEffect(() => {
    if (open) {
      getAccessibleProjects().then((result) => {
        if (result.success) {
          setProjects(result.data)
        }
      })
    }
  }, [open])

  // プロジェクト変更時にマイルストーンを取得
  useEffect(() => {
    if (projectId) {
      getProjectMilestones(projectId).then((result) => {
        if (result.success) {
          setMilestones(result.data)
        } else {
          setMilestones([])
        }
      })
    } else {
      setMilestones([])
    }
  }, [projectId])

  // 編集する成果物が変更された時にフォームを更新
  useEffect(() => {
    if (deliverable && open) {
      form.reset({
        projectId: '',
        milestoneId: '',
        name: deliverable.name,
        description: deliverable.description || '',
        type: deliverable.type as FormData['type'],
        status: deliverable.status as FormData['status'],
        version: deliverable.version || '',
        fileUrl: deliverable.fileUrl || ''
      })
    }
  }, [deliverable, open, form])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const { ...updateData } = data
      const result = await updateDeliverable(deliverable.id, updateData)
      if (result.success) {
        toast.success('成果物を更新しました')
        onOpenChange(false)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('成果物の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>成果物の編集</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p><strong>プロジェクト:</strong> {deliverable.project.name} ({deliverable.project.code})</p>
              {deliverable.milestone && (
                <p><strong>マイルストーン:</strong> {deliverable.milestone.name}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>成果物名 *</FormLabel>
                  <FormControl>
                    <Input placeholder="成果物名を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="成果物の詳細説明を入力してください"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>種別 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="種別を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="document">文書</SelectItem>
                        <SelectItem value="software">ソフトウェア</SelectItem>
                        <SelectItem value="report">レポート</SelectItem>
                        <SelectItem value="presentation">プレゼンテーション</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="review">レビュー中</SelectItem>
                        <SelectItem value="approved">承認済み</SelectItem>
                        <SelectItem value="delivered">納品済み</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>バージョン</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ファイルURL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ファイルのURLを入力してください（任意）"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '更新中...' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}