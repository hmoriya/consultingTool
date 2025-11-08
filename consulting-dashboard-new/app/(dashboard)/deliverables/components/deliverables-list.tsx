'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontalIcon, FileTextIcon, ExternalLinkIcon, EditIcon, TrashIcon, PaperclipIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { updateDeliverable, deleteDeliverable } from '@/actions/deliverables'
import { toast } from 'sonner'
import { EditDeliverableDialog } from './edit-deliverable-dialog'

interface Deliverable {
  id: string
  name: string
  description?: string | null
  type: string
  status: string
  version?: string | null
  fileUrl?: string | null
  approvedBy?: string | null
  approvedAt?: Date | null
  deliveredAt?: Date | null
  createdAt: Date
  project: {
    name: string
    code: string
  }
  milestone?: {
    name: string
  } | null
}

interface DeliverablesListProps {
  deliverables: Deliverable[]
}

const statusConfig = {
  draft: { label: '下書き', variant: 'secondary' as const },
  review: { label: 'レビュー中', variant: 'default' as const },
  approved: { label: '承認済み', variant: 'default' as const },
  delivered: { label: '納品済み', variant: 'default' as const }
}

const typeConfig = {
  document: { label: '文書', icon: FileTextIcon },
  software: { label: 'ソフトウェア', icon: FileTextIcon },
  report: { label: 'レポート', icon: FileTextIcon },
  presentation: { label: 'プレゼンテーション', icon: FileTextIcon },
  other: { label: 'その他', icon: FileTextIcon }
}

export function DeliverablesList({ deliverables }: DeliverablesListProps) {
  const [editingDeliverable, setEditingDeliverable] = useState<Deliverable | null>(null)

  const handleStatusUpdate = async (id: string, status: 'draft' | 'review' | 'approved' | 'delivered') => {
    const result = await updateDeliverable(id, { status })
    if (result.success) {
      toast.success('ステータスを更新しました')
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('この成果物を削除しますか？')) return

    const result = await deleteDeliverable(id)
    if (result.success) {
      toast.success('成果物を削除しました')
    } else {
      toast.error(result.error)
    }
  }

  if (deliverables.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">成果物がありません</h3>
          <p className="text-muted-foreground mb-4">
            最初の成果物を作成してプロジェクトの進捗を追跡しましょう
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4">
        {deliverables.map((deliverable) => {
          const TypeIcon = typeConfig[deliverable.type as keyof typeof typeConfig]?.icon || FileTextIcon
          const statusInfo = statusConfig[deliverable.status as keyof typeof statusConfig]

          return (
            <Card key={deliverable.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-muted rounded-lg">
                      <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{deliverable.name}</h3>
                        <div className="flex items-center gap-1">
                          {deliverable.fileUrl && (
                            <span title="ファイル添付あり">
                              <PaperclipIcon className="h-4 w-4 text-blue-500" />
                            </span>
                          )}
                          {deliverable.version && (
                            <Badge variant="outline" className="text-xs">
                              v{deliverable.version}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {deliverable.project.name} ({deliverable.project.code})
                        {deliverable.milestone && ` • ${deliverable.milestone.name}`}
                      </p>
                      {deliverable.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {deliverable.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={statusInfo?.variant || 'secondary'}
                      className={cn(
                        deliverable.status === 'delivered' && 'bg-green-100 text-green-800',
                        deliverable.status === 'approved' && 'bg-blue-100 text-blue-800',
                        deliverable.status === 'review' && 'bg-yellow-100 text-yellow-800'
                      )}
                    >
                      {statusInfo?.label || deliverable.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingDeliverable(deliverable)}>
                          <EditIcon className="h-4 w-4 mr-2" />
                          編集
                        </DropdownMenuItem>
                        {deliverable.fileUrl && (
                          <DropdownMenuItem
                            onClick={() => window.open(deliverable.fileUrl!, '_blank')}
                          >
                            <ExternalLinkIcon className="h-4 w-4 mr-2" />
                            ファイルを開く
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(deliverable.id, 'review')}
                          disabled={deliverable.status === 'review'}
                        >
                          レビュー中にする
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(deliverable.id, 'approved')}
                          disabled={deliverable.status === 'approved' || deliverable.status === 'delivered'}
                        >
                          承認する
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(deliverable.id, 'delivered')}
                          disabled={deliverable.status === 'delivered'}
                        >
                          納品済みにする
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(deliverable.id)}
                          className="text-red-600"
                        >
                          <TrashIcon className="h-4 w-4 mr-2" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>
                      種別: {typeConfig[deliverable.type as keyof typeof typeConfig]?.label || deliverable.type}
                    </span>
                    <span>
                      作成: {format(new Date(deliverable.createdAt), 'yyyy/MM/dd', { locale: ja })}
                    </span>
                  </div>
                  {deliverable.deliveredAt && (
                    <span>
                      納品: {format(new Date(deliverable.deliveredAt), 'yyyy/MM/dd', { locale: ja })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingDeliverable && (
        <EditDeliverableDialog
          deliverable={editingDeliverable}
          open={!!editingDeliverable}
          onOpenChange={(open) => !open && setEditingDeliverable(null)}
        />
      )}
    </>
  )
}