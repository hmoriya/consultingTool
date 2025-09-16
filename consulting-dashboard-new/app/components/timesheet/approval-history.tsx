'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, XCircle, Send, Clock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface ApprovalHistoryProps {
  history: any[]
}

export function ApprovalHistory({ history }: ApprovalHistoryProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMIT':
        return <Send className="h-4 w-4" />
      case 'APPROVE':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'REJECT':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'SUBMIT':
        return '申請'
      case 'APPROVE':
        return '承認'
      case 'REJECT':
        return '差戻'
      default:
        return action
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'SUBMIT':
        return 'bg-blue-100 text-blue-800'
      case 'APPROVE':
        return 'bg-green-100 text-green-800'
      case 'REJECT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">承認履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">承認履歴はありません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">承認履歴</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={item.id} className="relative">
                {index < history.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-muted" />
                )}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {getActionIcon(item.action)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {item.actorId || 'システム'}
                      </span>
                      <Badge className={getActionColor(item.action)} variant="secondary">
                        {getActionLabel(item.action)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.timestamp), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                      </span>
                    </div>
                    {item.comments && (
                      <div className="flex items-start gap-2 mt-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">{item.comments}</p>
                      </div>
                    )}
                    {item.entriesAffected && JSON.parse(item.entriesAffected).length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {JSON.parse(item.entriesAffected).length}件の工数記録が影響を受けました
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}