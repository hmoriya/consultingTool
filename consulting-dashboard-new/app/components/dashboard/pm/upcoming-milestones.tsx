'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target } from 'lucide-react'
import Link from 'next/link'

interface UpcomingMilestonesProps {
  milestones: unknown[]
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success'

export function UpcomingMilestones({ milestones }: UpcomingMilestonesProps) {
  const getStatusColor = (status: string): BadgeVariant => {
    switch (status) {
      case 'planned': return 'secondary'
      case 'in_progress': return 'default'
      case 'delayed': return 'destructive'
      case 'completed': return 'success'
      default: return 'outline'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planned': return '予定'
      case 'in_progress': return '進行中'
      case 'delayed': return '遅延'
      case 'completed': return '完了'
      default: return status
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getDaysUntil = (date: Date | string) => {
    const target = new Date(date)
    const today = new Date()
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return '今日'
    if (diff === 1) return '明日'
    if (diff < 0) return `${Math.abs(diff)}日前`
    return `${diff}日後`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          今週のマイルストーン
        </CardTitle>
        <CardDescription>
          期限が近いマイルストーン
        </CardDescription>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            今週期限のマイルストーンはありません
          </p>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <Link
                        href={`/projects/${milestone.projectId}?tab=milestones`}
                        className="font-medium text-sm hover:underline"
                      >
                        {milestone.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestone.project.client?.name || 'クライアント未設定'} - {milestone.project.name}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(milestone.status)} className="text-xs">
                      {getStatusLabel(milestone.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(milestone.targetDate)}</span>
                    <span className="font-medium">{getDaysUntil(milestone.targetDate)}</span>
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