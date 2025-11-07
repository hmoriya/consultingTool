'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { approveOrRejectTimesheet } from '@/actions/timesheet-approval'
import { toast } from 'sonner'
import { useApproval } from '@/contexts/approval-context'

interface ApprovalListProps {
  timesheets: unknown[]
  onUpdate?: () => void
}

export function ApprovalList({ timesheets, onUpdate }: ApprovalListProps) {
  const [selectedTimesheet, setSelectedTimesheet] = useState<unknown>(null)
  const [action, setAction] = useState<'APPROVE' | 'REJECT' | null>(null)
  const [comments, setComments] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { refreshPendingCount } = useApproval()

  const handleAction = (timesheet: unknown, actionType: 'APPROVE' | 'REJECT') => {
    setSelectedTimesheet(timesheet)
    setAction(actionType)
    setComments('')
  }

  const handleConfirm = async () => {
    if (!selectedTimesheet || !action) return

    setIsProcessing(true)
    try {
      const result = await approveOrRejectTimesheet(
        selectedTimesheet.id,
        action,
        comments
      )

      if (result.success) {
        toast.success(
          action === 'APPROVE' 
            ? 'タイムシートを承認しました' 
            : 'タイムシートを差戻しました'
        )
        setSelectedTimesheet(null)
        setAction(null)
        setComments('')
        onUpdate?.()
        // 承認数を更新
        await refreshPendingCount()
      } else {
        toast.error(result.error || '処理に失敗しました')
      }
    } catch (_error) {
      toast.error('エラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }

  const getProjectSummary = (entries: unknown[]) => {
    const projectHours = entries.reduce((acc, entry) => {
      const projectId = entry.projectId || '不明なプロジェクト'
      acc[projectId] = (acc[projectId] || 0) + entry.hours
      return acc
    }, {} as Record<string, number>)

    return Object.entries(projectHours)
      .map(([project, hours]) => `${project}: ${hours}h`)
      .join(', ')
  }

  if (timesheets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">承認待ちのタイムシートはありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {timesheets.map((timesheet) => (
          <Card key={timesheet.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {timesheet.consultant?.name || timesheet.consultantId}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-4">
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(timesheet.weekStartDate), 'yyyy年MM月dd日', { locale: ja })}
                      〜
                      {format(new Date(timesheet.weekEndDate), 'yyyy年MM月dd日', { locale: ja })}
                    </CardDescription>
                    <Badge variant="secondary">
                      合計: {timesheet.totalHours}時間
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleAction(timesheet, 'APPROVE')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    承認
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleAction(timesheet, 'REJECT')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    差戻
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <strong>プロジェクト別工数:</strong>
                  <div className="mt-1">{getProjectSummary(timesheet.entries)}</div>
                </div>
                {timesheet.approvalHistory?.[0] && (
                  <div className="text-sm text-muted-foreground">
                    <strong>申請日時:</strong>{' '}
                    {format(new Date(timesheet.approvalHistory[0].timestamp), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  <strong>稼働/非稼働:</strong>{' '}
                  {timesheet.billableHours}h / {timesheet.nonBillableHours}h
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTimesheet && !!action} onOpenChange={() => {
        setSelectedTimesheet(null)
        setAction(null)
        setComments('')
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'APPROVE' ? 'タイムシート承認' : 'タイムシート差戻'}
            </DialogTitle>
            <DialogDescription>
              {selectedTimesheet?.consultant?.name || selectedTimesheet?.consultantId}の
              {selectedTimesheet && format(new Date(selectedTimesheet.weekStartDate), 'yyyy年MM月dd日', { locale: ja })}
              週のタイムシート（{selectedTimesheet?.totalHours}時間）を
              {action === 'APPROVE' ? '承認' : '差戻'}します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                コメント {action === 'REJECT' && <span className="text-red-500">*</span>}
              </label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={
                  action === 'APPROVE' 
                    ? 'コメント（任意）' 
                    : '差戻し理由を入力してください（必須）'
                }
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTimesheet(null)
                setAction(null)
                setComments('')
              }}
              disabled={isProcessing}
            >
              キャンセル
            </Button>
            <Button
              variant={action === 'APPROVE' ? 'default' : 'destructive'}
              onClick={handleConfirm}
              disabled={
                isProcessing || 
                (action === 'REJECT' && !comments.trim())
              }
            >
              {isProcessing ? '処理中...' : (action === 'APPROVE' ? '承認する' : '差戻す')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}