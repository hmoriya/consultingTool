'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon, Clock } from 'lucide-react'
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
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { createTimeEntry, updateTimeEntry } from '@/actions/timesheet-new'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  projectId: z.string().min(1, 'プロジェクトを選択してください'),
  taskId: z.string().optional(),
  date: z.date({
    required_error: '日付を選択してください',
  }),
  hours: z.string().transform((val) => parseFloat(val)).pipe(
    z.number().min(0.5, '最小0.5時間').max(24, '最大24時間')
  ),
  description: z.string().min(1, '作業内容を入力してください'),
  billable: z.boolean().default(true),
  activityType: z.enum([
    'DEVELOPMENT',
    'MEETING',
    'DOCUMENTATION',
    'REVIEW',
    'TRAVEL',
    'TRAINING',
    'SALES',
    'ADMIN',
    'OTHER'
  ]),
})

const activityTypes = [
  { value: 'DEVELOPMENT', label: '開発・分析' },
  { value: 'MEETING', label: '会議' },
  { value: 'DOCUMENTATION', label: 'ドキュメント作成' },
  { value: 'REVIEW', label: 'レビュー' },
  { value: 'TRAVEL', label: '移動' },
  { value: 'TRAINING', label: '研修' },
  { value: 'SALES', label: '営業活動' },
  { value: 'ADMIN', label: '管理業務' },
  { value: 'OTHER', label: 'その他' },
]

interface TimesheetFormProps {
  projects: Array<{
    id: string
    name: string
    client: { name: string }
    tasks?: Array<{ id: string; title: string }>
  }>
  defaultDate?: Date
  onSuccess?: () => void
  onCancel?: () => void
  editingEntry?: {
    id: string
    projectId: string
    taskId?: string
    date: Date
    hours: number
    description: string
    billable: boolean
    activityType: string
  } | null
}

export function TimesheetForm({ projects, defaultDate, onSuccess, onCancel, editingEntry }: TimesheetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingEntry ? {
      projectId: editingEntry.projectId,
      taskId: editingEntry.taskId || undefined,
      date: new Date(editingEntry.date),
      hours: editingEntry.hours.toString(),
      description: editingEntry.description,
      billable: editingEntry.billable,
      activityType: editingEntry.activityType as any,
    } : {
      date: defaultDate || new Date(),
      hours: '1',
      description: '',
      billable: true,
      activityType: 'DEVELOPMENT',
    },
  })

  const selectedProject = projects.find(p => p.id === form.watch('projectId'))
  const tasks = selectedProject?.tasks || []

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      const result = editingEntry 
        ? await updateTimeEntry(editingEntry.id, values)
        : await createTimeEntry(values)
      
      if (result.success) {
        toast({
          title: editingEntry ? '工数を更新しました' : '工数を記録しました',
          description: `${format(values.date, 'M月d日(E)', { locale: ja })} - ${values.hours}時間`,
        })
        if (!editingEntry) {
          form.reset()
        }
        onSuccess?.()
      } else {
        toast({
          title: 'エラー',
          description: result.error || (editingEntry ? '工数の更新に失敗しました' : '工数の記録に失敗しました'),
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '予期しないエラーが発生しました',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日付</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'yyyy年M月d日(E)', { locale: ja })
                        ) : (
                          <span>日付を選択</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('2020-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作業時間</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      placeholder="1.5"
                      className="pr-12"
                    />
                    <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>
                  0.5時間単位で入力してください
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>プロジェクト</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="プロジェクトを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.client.name} - {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {tasks.length > 0 && (
          <FormField
            control={form.control}
            name="taskId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タスク（任意）</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value === 'none' ? undefined : value)
                  }} 
                  defaultValue={field.value || 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="タスクを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="activityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>活動タイプ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="活動タイプを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>作業内容</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="実施した作業の詳細を記載してください"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  請求可能
                </FormLabel>
                <FormDescription>
                  クライアントに請求可能な作業の場合はチェック
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (editingEntry ? '更新中...' : '記録中...') : (editingEntry ? '工数を更新' : '工数を記録')}
          </Button>
          {editingEntry && (
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}