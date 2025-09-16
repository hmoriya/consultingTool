'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createProject } from '@/actions/projects'
import { Save, ArrowLeft, Plus, X, Building2 } from 'lucide-react'
import { ClientSelectDialog } from '@/components/clients/client-select-dialog'

const projectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です'),
  description: z.string().min(1, '説明は必須です'),
  clientId: z.string().min(1, 'クライアントを選択してください'),
  budget: z.string().min(1, '予算は必須です'),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().min(1, '終了日は必須です'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'critical'])
})

type ProjectFormData = z.infer<typeof projectSchema>

const statusLabels = {
  planning: '計画中',
  active: 'アクティブ',
  'on-hold': '保留',
  completed: '完了',
  cancelled: 'キャンセル'
}

const priorityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '緊急'
}

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
}

export function ProjectCreateForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [showClientDialog, setShowClientDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planning',
      priority: 'medium'
    }
  })

  const watchedStatus = watch('status')
  const watchedPriority = watch('priority')

  const handleClientSelect = (client: { id: string; name: string }) => {
    setSelectedClient(client)
    setValue('clientId', client.id)
    setShowClientDialog(false)
  }

  const onSubmit = async (data: ProjectFormData) => {
    setIsLoading(true)
    try {
      const projectData = {
        ...data,
        budget: parseInt(data.budget),
        tags: tags
      }
      
      const project = await createProject(projectData)
      router.push(`/projects/${project.id}`)
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">プロジェクト名 *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="プロジェクト名を入力"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>クライアント *</Label>
              <div className="flex gap-2">
                <div 
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setShowClientDialog(true)}
                >
                  {selectedClient ? (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedClient.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">クライアントを選択してください</span>
                  )}
                </div>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowClientDialog(true)}
                >
                  選択
                </Button>
              </div>
              {errors.clientId && (
                <p className="text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明 *</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="プロジェクトの説明を入力"
              className="w-full min-h-[100px] p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="budget">予算 (円) *</Label>
              <Input
                id="budget"
                type="number"
                {...register('budget')}
                placeholder="10000000"
              />
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget.message}</p>
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
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">優先度 *</Label>
              <Select value={watchedPriority} onValueChange={(value) => setValue('priority', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 期間設定 */}
      <Card>
        <CardHeader>
          <CardTitle>期間設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">開始日 *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">終了日 *</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* タグ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>タグ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">プロジェクトタグ</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="タグを入力してEnterキーを押してください"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 hover:bg-gray-200 rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* プレビュー */}
      <Card>
        <CardHeader>
          <CardTitle>プレビュー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">現在の設定</h3>
              <p className="text-sm text-muted-foreground">作成前の確認</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {statusLabels[watchedStatus]}
              </Badge>
              <Badge className={priorityColors[watchedPriority]}>
                {priorityLabels[watchedPriority]}
              </Badge>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <span className="text-sm font-medium">プロジェクト進捗:</span>
                <p className="text-sm text-muted-foreground">0% (新規作成時)</p>
                <Progress value={0} className="mt-2" />
              </div>
              <div>
                <span className="text-sm font-medium">予想期間:</span>
                <p className="text-sm text-muted-foreground">開始日から終了日まで</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
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
              プロジェクト作成
            </>
          )}
        </Button>
      </div>
      </form>

      {/* クライアント選択ダイアログ */}
      {showClientDialog && (
        <ClientSelectDialog
          selectedClientId={selectedClient?.id}
          onSelect={handleClientSelect}
          onClose={() => setShowClientDialog(false)}
        />
      )}
    </>
  )
}