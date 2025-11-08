'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

interface PendingTimesheetApprovalsProps {
  timesheets: unknown[]
}

export function PendingTimesheetApprovals({ timesheets }: PendingTimesheetApprovalsProps) {
  if (timesheets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                承認待ち工数記録
              </CardTitle>
              <CardDescription>承認が必要な工数記録はありません</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              承認待ち工数記録
            </CardTitle>
            <CardDescription>承認が必要な工数記録</CardDescription>
          </div>
          <Link href="/timesheet/approval">
            <Button variant="ghost" size="sm">
              すべて見る
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timesheets.slice(0, 3).map((timesheet) => (
            <div key={timesheet.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    {timesheet.consultant?.name || timesheet.consultantId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(timesheet.weekStartDate), 'MM/dd', { locale: ja })}
                  〜
                  {format(new Date(timesheet.weekEndDate), 'MM/dd', { locale: ja })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {timesheet.totalHours}時間
                </Badge>
                <Link href="/timesheet/approval">
                  <Button size="sm" variant="outline">
                    確認
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}