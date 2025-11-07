'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

interface RecentActivitiesProps {
  activities: unknown[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-blue-600" />
      case 'in_review':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了'
      case 'in_progress':
        return '進行中'
      case 'in_review':
        return 'レビュー中'
      case 'todo':
        return '未着手'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'in_review':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近の活動</CardTitle>
        <CardDescription>過去7日間のタスク更新</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            最近の活動はありません
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                {getStatusIcon(activity.status)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={getStatusColor(activity.status)} 
                      variant="secondary"
                    >
                      {getStatusLabel(activity.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.updatedAt), {
                        addSuffix: true,
                        locale: ja
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}