'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, X, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { updateArticle } from '@/actions/knowledge'

const formSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(200, 'タイトルは200文字以内で入力してください'),
  content: z.string().min(10, '本文を10文字以上入力してください'),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
  tags: z.array(z.string()).min(1, 'タグを1つ以上追加してください').max(10, 'タグは10個以内で設定してください'),
})

interface KnowledgeEditFormProps {
  article: {
    id: string
    title: string
    content: string
    status: string
    tags?: string | null
    category?: {
      id: string
      name: string
    } | null
  }
}

const statusOptions = [
  { value: 'DRAFT', label: '下書き', description: '非公開・編集中' },
  { value: 'REVIEW', label: 'レビュー中', description: '承認待ち' },
  { value: 'PUBLISHED', label: '公開済み', description: '全員に公開' },
  { value: 'ARCHIVED', label: 'アーカイブ', description: '非公開・保存' },
]

export function KnowledgeEditForm({ article }: KnowledgeEditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  // タグをパース
  const parsedTags = article.tags ? JSON.parse(article.tags) : []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article.title,
      content: article.content,
      status: article.status as unknown,
      tags: parsedTags,
    },
  })

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const currentTags = form.getValues('tags')
      if (!currentTags.includes(tagInput.trim()) && currentTags.length < 10) {
        form.setValue('tags', [...currentTags, tagInput.trim()])
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags')
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      const result = await updateArticle(article.id, {
        title: values.title,
        content: values.content,
        status: values.status,
        tags: values.tags,
      })

      if (!result.success) {
        throw new Error(result.error || '記事の更新に失敗しました')
      }

      toast({
        title: '記事を更新しました',
        description: `ステータス: ${statusOptions.find(s => s.value === values.status)?.label}`,
      })

      router.push(`/knowledge/${article.id}`)
    } catch (_error) {
      console.error('Error updating knowledge:', error)
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '記事の更新に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ステータス選択 */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{status.label}</span>
                        <span className="text-xs text-muted-foreground">{status.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                記事の公開状態を設定します
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タイトル</FormLabel>
              <FormControl>
                <Input
                  placeholder="例: React Queryを使った効率的なデータフェッチング戦略"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タグ</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="タグを入力してEnterキーで追加"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                関連するキーワードをタグとして追加してください（最大10個）
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ナレッジの内容を入力してください。Markdown形式で記述できます。"
                  className="min-h-[400px] font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Markdown形式で記述できます。見出し、リスト、コードブロックなどが使用可能です。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                更新中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                更新する
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/knowledge/${article.id}`)}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  )
}