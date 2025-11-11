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
import { createDeliverable, getAccessibleProjects, getProjectMilestones } from '@/actions/deliverables'
import { toast } from 'sonner'
import { FileIcon, XIcon } from 'lucide-react'

const deliverableSchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  milestoneId: z.string().optional(),
  name: z.string().min(1, '成果物名を入力してください'),
  description: z.string().optional(),
  type: z.enum(['document', 'software', 'report', 'presentation', 'other']),
  version: z.string().optional(),
  fileUrl: z.string().optional()
})

type FormData = z.infer<typeof deliverableSchema>

interface CreateDeliverableDialogProps {
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

export function CreateDeliverableDialog({ open, onOpenChange }: CreateDeliverableDialogProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    url: string
    size: number
  } | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: {
      projectId: '',
      milestoneId: '',
      name: '',
      description: '',
      type: 'document',
      version: '',
      fileUrl: ''
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
      // プロジェクト変更時にマイルストーンをリセット
      form.setValue('milestoneId', '')
    } else {
      setMilestones([])
    }
  }, [projectId, form])

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setUploadedFile({
          name: result.fileName,
          url: result.fileUrl,
          size: result.fileSize
        })
        form.setValue('fileUrl', result.fileUrl)
        toast.success('ファイルをアップロードしました')
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('ファイルのアップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileRemove = () => {
    setUploadedFile(null)
    form.setValue('fileUrl', '')
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const result = await createDeliverable({
        ...data,
        status: 'draft' as const
      })
      if (result.success) {
        toast.success('成果物を作成しました')
        form.reset()
        setUploadedFile(null)
        onOpenChange(false)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('成果物の作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>新しい成果物の作成</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>プロジェクト *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="プロジェクトを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} ({project.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="milestoneId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>マイルストーン</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="マイルストーンを選択（任意）" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {milestones.map((milestone) => (
                          <SelectItem key={milestone.id} value={milestone.id}>
                            {milestone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
            </div>

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ファイル</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {!uploadedFile ? (
                        <div>
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file)
                              }
                            }}
                            disabled={isUploading}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                          />
                          {isUploading && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              アップロード中...
                            </div>
                          )}
                          <p className="mt-1 text-xs text-muted-foreground">
                            PDF、Word、Excel、PowerPoint、画像、テキスト、ZIPファイル対応（最大10MB）
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted">
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleFileRemove}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        または
                      </div>
                      <Input
                        placeholder="ファイルのURLを直接入力してください（任意）"
                        type="url"
                        {...field}
                        disabled={!!uploadedFile}
                      />
                    </div>
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
                {isLoading ? '作成中...' : '作成'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}