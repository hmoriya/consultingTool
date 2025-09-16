'use client'

import { format, eachDayOfInterval } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { submitTimesheet } from '@/actions/timesheet-new'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Send } from 'lucide-react'

interface WeeklySummaryProps {
  weekStart: Date
  weekEnd: Date
  timesheet: {
    id: string
    status: string
    totalHours: number
    billableHours: number
    nonBillableHours: number
    entries: Array<{
      id: string
      date: Date
      hours: number
      projectId: string
      activityType: string
      billable: boolean
    }>
  }
}

export function WeeklySummary({ weekStart, weekEnd, timesheet }: WeeklySummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  
  // 日ごとの工数を集計
  const dailyHours = days.map(day => {
    const dayEntries = timesheet.entries.filter(
      entry => format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    )
    return {
      date: day,
      totalHours: dayEntries.reduce((sum, e) => sum + e.hours, 0),
      billableHours: dayEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)
    }
  })

  // 活動タイプ別の集計
  const activitySummary = timesheet.entries.reduce((acc, entry) => {
    if (!acc[entry.activityType]) {
      acc[entry.activityType] = 0
    }
    acc[entry.activityType] += entry.hours
    return acc
  }, {} as Record<string, number>)

  const activityTypeLabels: Record<string, string> = {
    DEVELOPMENT: '開発・分析',
    MEETING: '会議',
    DOCUMENTATION: 'ドキュメント作成',
    REVIEW: 'レビュー',
    TRAVEL: '移動',
    TRAINING: '研修',
    SALES: '営業活動',
    ADMIN: '管理業務',
    OTHER: 'その他',
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const result = await submitTimesheet(timesheet.id)
      
      if (result.success) {
        toast({
          title: 'タイムシートを提出しました',
          description: '承認者に通知が送信されました',
        })
      } else {
        toast({
          title: 'エラー',
          description: result.error || 'タイムシートの提出に失敗しました',
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

  const targetHours = 40 // 週40時間が目標
  const utilizationRate = (timesheet.totalHours / targetHours) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(weekStart, 'M月d日', { locale: ja })} - {format(weekEnd, 'M月d日', { locale: ja })}
        </h3>
        {timesheet.status === 'OPEN' && timesheet.entries.length > 0 && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? '提出中...' : 'タイムシートを提出'}
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">週間稼働状況</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>合計時間</span>
                <span className="font-medium">{timesheet.totalHours}時間</span>
              </div>
              <Progress value={utilizationRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>稼働率</span>
                <span>{Math.round(utilizationRate)}%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">請求可能率</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>請求可能時間</span>
                <span className="font-medium">{timesheet.billableHours}時間</span>
              </div>
              <Progress 
                value={timesheet.totalHours > 0 ? (timesheet.billableHours / timesheet.totalHours) * 100 : 0} 
                className="h-2" 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>非請求時間</span>
                <span>{timesheet.nonBillableHours}時間</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">日別工数</h4>
          <div className="space-y-1">
            {dailyHours.map(({ date, totalHours, billableHours }) => (
              <div key={date.toISOString()} className="flex items-center justify-between py-1">
                <span className="text-sm">
                  {format(date, 'M/d(E)', { locale: ja })}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {totalHours}時間
                  </span>
                  <div className="w-24">
                    <Progress 
                      value={totalHours > 0 ? (totalHours / 8) * 100 : 0} 
                      className="h-1.5" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">活動タイプ別</h4>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(activitySummary).map(([type, hours]) => (
            <div key={type} className="flex items-center justify-between py-1">
              <span className="text-sm">
                {activityTypeLabels[type] || type}
              </span>
              <span className="text-sm font-medium">
                {hours}時間
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}