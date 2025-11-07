'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Send, CheckCircle, XCircle, AlertCircle, History, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { submitTimesheetForApproval } from '@/actions/timesheet-approval'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle } from '@/components/ui/dialog'
import { ApprovalHistory } from './approval-history'

interface TimesheetData {
  id: string
  weekStartDate: Date
  weekEndDate: Date
  totalHours: number
  billableHours: number
  nonBillableHours: number
  status: string
  submittedAt?: Date
  approvedAt?: Date
  entries: { id: string }[]
  approvalHistory: unknown[]
}

interface MyTimesheetsProps {
  timesheets: TimesheetData[]
  onUpdate?: () => void
}

export function MyTimesheets({ timesheets, onUpdate }: MyTimesheetsProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [selectedHistory, setSelectedHistory] = useState<unknown[] | null>(null)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'OPEN':
        return { 
          label: '入力中', 
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="h-4 w-4" />
        }
      case 'DRAFT':
        return { 
          label: '下書き', 
          color: 'bg-gray-100 text-gray-800',
          icon: <FileText className="h-4 w-4" />
        }
      case 'SUBMITTED':
        return { 
          label: '承認待ち', 
          color: 'bg-blue-100 text-blue-800',
          icon: <Clock className="h-4 w-4" />
        }
      case 'APPROVED':
        return { 
          label: '承認済み', 
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4" />
        }
      case 'REJECTED':
        return { 
          label: '差戻し', 
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4" />
        }
      default:
        return { 
          label: status, 
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="h-4 w-4" />
        }
    }
  }

  const handleSubmit = async (timesheetId: string) => {
    setSubmittingId(timesheetId)
    try {
      const result = await submitTimesheetForApproval(timesheetId)
      
      if (result.success) {
        toast.success('承認申請を提出しました')
        onUpdate?.()
      } else {
        toast.error(result.error || '承認申請に失敗しました')
      }
    } catch (_error) {
      toast.error('エラーが発生しました')
    } finally {
      setSubmittingId(null)
    }
  }

  if (timesheets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">タイムシートがありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {timesheets.map((timesheet) => {
          const status = getStatusConfig(timesheet.status)
          const lastAction = timesheet.approvalHistory?.[0]
          
          return (
            <Card key={timesheet.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(timesheet.weekStartDate), 'yyyy年MM月dd日', { locale: ja })}
                      〜
                      {format(new Date(timesheet.weekEndDate), 'MM月dd日', { locale: ja })}
                    </CardTitle>
                    <CardDescription className="mt-2 space-y-1">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          合計: {timesheet.totalHours}時間
                        </span>
                        <span className="text-sm">
                          稼働: {timesheet.billableHours}h / 非稼働: {timesheet.nonBillableHours}h
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={status.color} variant="secondary">
                          <span className="flex items-center gap-1">
                            {status.icon}
                            {status.label}
                          </span>
                        </Badge>
                        {lastAction && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(lastAction.timestamp), 'yyyy/MM/dd HH:mm')}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {timesheet.approvalHistory.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedHistory(timesheet.approvalHistory)}
                      >
                        <History className="h-4 w-4 mr-1" />
                        履歴
                      </Button>
                    )}
                    {timesheet.status === 'OPEN' && timesheet.entries.length > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmit(timesheet.id)}
                        disabled={submittingId === timesheet.id}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {submittingId === timesheet.id ? '送信中...' : '承認申請'}
                      </Button>
                    )}
                    {timesheet.status === 'REJECTED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSubmit(timesheet.id)}
                        disabled={submittingId === timesheet.id}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {submittingId === timesheet.id ? '送信中...' : '再申請'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {timesheet.status === 'REJECTED' && lastAction?.comments && (
                <CardContent>
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-sm text-red-800">
                      <strong>差戻し理由:</strong> {lastAction.comments}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <Dialog open={!!selectedHistory} onOpenChange={() => setSelectedHistory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>承認履歴</DialogTitle>
          </DialogHeader>
          {selectedHistory && <ApprovalHistory history={selectedHistory} />}
        </DialogContent>
      </Dialog>
    </>
  )
}