'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Edit,
  Check,
  X,
  Trash2
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { deleteTimeEntry } from '@/actions/timesheet-new'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TimesheetTimeEntry {
  id: string
  date: Date
  hours: number
  description: string
  billable: boolean
  activityType: string
  status: string
  projectId: string
  taskId?: string
  project?: {
    name: string
    client: { name: string }
  }
  task?: {
    name: string
  }
}

interface TimesheetListProps {
  entries: TimesheetTimeEntry[]
  onEdit?: (entry: TimesheetTimeEntry) => void
  onDelete?: (id: string) => void
  editable?: boolean
}

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

const statusLabels: Record<string, string> = {
  OPEN: '入力中',
  DRAFT: '下書き',
  SUBMITTED: '提出済み',
  APPROVED: '承認済み',
  REJECTED: '却下',
  REVISION_REQUESTED: '修正依頼',
}

const statusConfig: Record<string, { variant: string; className?: string }> = {
  OPEN: { variant: 'secondary', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  DRAFT: { variant: 'secondary', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  SUBMITTED: { variant: 'default', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  APPROVED: { variant: 'success', className: 'bg-green-100 text-green-700 border-green-200' },
  REJECTED: { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-200' },
  REVISION_REQUESTED: { variant: 'warning', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
}

export function TimesheetList({ 
  entries, 
  onEdit, 
  onDelete,
  editable = true 
}: TimesheetListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      const result = await deleteTimeEntry(id)
      
      if (result.success) {
        toast({
          title: '削除しました',
          description: '工数記録を削除しました',
        })
        onDelete?.(id)
      } else {
        toast({
          title: 'エラー',
          description: result.error || '削除に失敗しました',
          variant: 'destructive',
        })
      }
    } catch (_error) {
      toast({
        title: 'エラー',
        description: '予期しないエラーが発生しました',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  // 日付でグループ化
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateKey = format(new Date(entry.date), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(entry)
    return acc
  }, {} as Record<string, TimesheetTimeEntry[]>)

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a))

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dateEntries = groupedEntries[dateKey]
        const totalHours = dateEntries.reduce((sum, e) => sum + e.hours, 0)
        const billableHours = dateEntries.filter(e => e.billable).reduce((sum, e) => sum + e.hours, 0)

        return (
          <div key={dateKey} className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                {format(new Date(dateKey), 'M月d日(E)', { locale: ja })}
              </h3>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-1 rounded">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium">{totalHours}時間</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 dark:bg-green-900/20 p-1 rounded">
                    <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-green-600 dark:text-green-400">{billableHours}時間</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">プロジェクト</TableHead>
                    <TableHead className="font-semibold">タスク</TableHead>
                    <TableHead className="font-semibold">活動</TableHead>
                    <TableHead className="font-semibold">作業内容</TableHead>
                    <TableHead className="text-right font-semibold">時間</TableHead>
                    <TableHead className="font-semibold">請求</TableHead>
                    <TableHead className="font-semibold">状態</TableHead>
                    {editable && <TableHead className="text-right font-semibold">操作</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                {dateEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {entry.project ? (
                        <div className="space-y-0.5">
                          <div className="text-xs text-muted-foreground font-medium">
                            {entry.project.client.name}
                          </div>
                          <div className="text-sm font-medium">
                            {entry.project.name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.task?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {activityTypeLabels[entry.activityType] || entry.activityType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={entry.description}>
                        {entry.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-base">{entry.hours}</span>
                      <span className="text-sm text-muted-foreground ml-1">時間</span>
                    </TableCell>
                    <TableCell>
                      {entry.billable ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={statusConfig[entry.status]?.variant as unknown || 'default'}
                        className={cn(
                          "text-xs font-medium",
                          statusConfig[entry.status]?.className
                        )}
                      >
                        {statusLabels[entry.status] || entry.status}
                      </Badge>
                    </TableCell>
                    {editable && (
                      <TableCell className="text-right">
                        {(entry.status === 'DRAFT' || entry.status === 'OPEN') && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit?.(entry)}
                              disabled={deletingId === entry.id}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={deletingId === entry.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">削除</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>工数記録を削除</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    この工数記録を削除してもよろしいですか？
                                    この操作は取り消せません。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(entry.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    削除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        )
      })}
    </div>
  )
}