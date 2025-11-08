'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon, Clock, Plus } from 'lucide-react'
import { createTimeEntry } from '@/actions/timesheet-new'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

interface Project {
  id: string
  name: string
  client: {
    name: string
  }
}

interface QuickEntryProps {
  projects: Project[]
  onSuccess?: () => void
}

export function QuickEntry({ projects, onSuccess }: QuickEntryProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [projectId, setProjectId] = useState<string>('')
  const [hours, setHours] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!projectId || !hours || !description) {
      toast.error('必須項目を入力してください')
      return
    }

    const hoursFloat = parseFloat(hours)
    if (isNaN(hoursFloat) || hoursFloat <= 0 || hoursFloat > 24) {
      toast.error('有効な時間を入力してください（0.5〜24時間）')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createTimeEntry({
        projectId,
        date,
        hours: hoursFloat,
        description,
        billable: true,
        activityType: 'DEVELOPMENT'
      })

      if (result.success) {
        toast.success('工数を記録しました')
        // フォームをリセット
        setHours('')
        setDescription('')
        onSuccess?.()
      } else {
        toast.error(result.error || '工数の記録に失敗しました')
      }
    } catch (_error) {
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-4 w-4" />
          クイック入力
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* 日付選択 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'MM/dd(E)', { locale: ja }) : '日付を選択'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={ja}
                />
              </PopoverContent>
            </Popover>

            {/* プロジェクト選択 */}
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="プロジェクト" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {project.client?.name || 'クライアント未設定'}
                      </span>
                      <span className="text-sm">{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 時間入力 */}
            <Input
              type="number"
              placeholder="時間"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              step="0.5"
              min="0.5"
              max="24"
              className="text-center"
            />

            {/* 送信ボタン */}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !projectId || !hours || !description}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              {isSubmitting ? '記録中...' : '記録'}
            </Button>
          </div>

          {/* 作業内容 */}
          <Textarea
            placeholder="作業内容を入力（例：要件定義会議、設計書作成）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}