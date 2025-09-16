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
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const formSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(200, 'タイトルは200文字以内で入力してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  content: z.string().min(10, '本文を10文字以上入力してください'),
  tags: z.array(z.string()).min(1, 'タグを1つ以上追加してください').max(10, 'タグは10個以内で設定してください'),
  attachments: z.array(z.object({
    name: z.string(),
    size: z.string(),
    type: z.string(),
  })).optional(),
})

const categories = [
  { value: 'frontend', label: 'フロントエンド開発' },
  { value: 'backend', label: 'バックエンド開発' },
  { value: 'architecture', label: 'アーキテクチャ' },
  { value: 'project-management', label: 'プロジェクト管理' },
  { value: 'best-practices', label: 'ベストプラクティス' },
  { value: 'tools', label: 'ツール・環境' },
  { value: 'security', label: 'セキュリティ' },
  { value: 'performance', label: 'パフォーマンス' },
  { value: 'other', label: 'その他' },
]

export function KnowledgeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: '',
      content: '',
      tags: [],
      attachments: [],
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
      
      // 実際はここでAPIを呼び出してデータベースに保存
      console.log('Submitting knowledge:', values)
      
      // 仮の成功処理
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'ナレッジを作成しました',
        description: 'ナレッジが正常に保存されました',
      })
      
      router.push('/knowledge')
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ナレッジの作成に失敗しました',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>カテゴリ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="カテゴリを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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
                作成中...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                ナレッジを作成
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/knowledge')}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  )
}