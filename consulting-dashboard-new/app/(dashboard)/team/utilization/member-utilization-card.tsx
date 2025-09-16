'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { MemberUtilization } from '../../../actions/utilization'

interface MemberUtilizationCardProps {
  member: MemberUtilization
}

export function MemberUtilizationCard({ member }: MemberUtilizationCardProps) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return 'bg-purple-500'
    if (utilization >= 90) return 'bg-red-500'
    if (utilization >= 70) return 'bg-green-500'
    if (utilization >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 100) return { label: '過負荷', variant: 'destructive' as const }
    if (utilization >= 90) return { label: '高稼働', variant: 'destructive' as const }
    if (utilization >= 70) return { label: '適正', variant: 'default' as const }
    if (utilization >= 50) return { label: '余裕あり', variant: 'secondary' as const }
    return { label: '低稼働', variant: 'outline' as const }
  }

  const status = getUtilizationStatus(member.currentAllocation)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {member.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </div>
          </div>
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 現在の稼働率 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">現在の稼働率</span>
            <span className="text-sm font-bold">{member.currentAllocation}%</span>
          </div>
          <Progress 
            value={Math.min(member.currentAllocation, 100)} 
            className="h-2"
            // カスタムカラークラスを適用
            style={{
              '--progress-color': member.currentAllocation >= 100 ? '#8b5cf6' :
                                  member.currentAllocation >= 90 ? '#ef4444' :
                                  member.currentAllocation >= 70 ? '#22c55e' :
                                  member.currentAllocation >= 50 ? '#f59e0b' :
                                  '#3b82f6'
            } as any}
          />
        </div>

        {/* プロジェクト一覧 */}
        {member.projects.length > 0 ? (
          <div>
            <p className="text-sm font-medium mb-2">アサインプロジェクト</p>
            <div className="space-y-2">
              {member.projects.map((project) => (
                <div key={project.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{project.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {project.allocation}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {project.clientName} - {project.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            現在アサインされているプロジェクトはありません
          </div>
        )}

        {/* 月次トレンド */}
        <div>
          <p className="text-sm font-medium mb-2">月次稼働率</p>
          <div className="flex gap-2 justify-between">
            {member.monthlyUtilization.map((month, index) => (
              <div key={month.month} className="text-center flex-1">
                <p className="text-xs text-muted-foreground mb-1">
                  {new Date(month.month).toLocaleDateString('ja-JP', { month: 'short' })}
                </p>
                <div className="text-sm font-medium">
                  {month.utilization}%
                </div>
                <div className="w-full h-1 bg-secondary rounded-full mt-1">
                  <div 
                    className={`h-full rounded-full ${getUtilizationColor(month.utilization)}`}
                    style={{ width: `${Math.min(month.utilization, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}