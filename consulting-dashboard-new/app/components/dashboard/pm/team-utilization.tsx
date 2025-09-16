'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import Link from 'next/link'

interface TeamUtilizationProps {
  members: any[]
}

export function TeamUtilization({ members }: TeamUtilizationProps) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return 'text-purple-600'
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 70) return 'text-green-600'
    if (utilization >= 50) return 'text-yellow-600'
    return 'text-blue-600'
  }

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 100) return { label: '過負荷', variant: 'destructive' as const }
    if (utilization >= 90) return { label: '高稼働', variant: 'destructive' as const }
    if (utilization >= 70) return { label: '適正', variant: 'default' as const }
    if (utilization >= 50) return { label: '余裕あり', variant: 'secondary' as const }
    return { label: '低稼働', variant: 'outline' as const }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              チーム稼働状況
            </CardTitle>
            <CardDescription>
              プロジェクトメンバーの稼働率
            </CardDescription>
          </div>
          <Link href="/team/utilization">
            <Badge variant="outline" className="cursor-pointer">
              詳細を見る
            </Badge>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            チームメンバーがアサインされていません
          </p>
        ) : (
          <div className="space-y-4">
            {members.map((member) => {
              const status = getUtilizationStatus(member.allocation)
              return (
                <div key={member.user.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{member.user.name}</span>
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <span className={`text-sm font-bold ${getUtilizationColor(member.allocation)}`}>
                      {member.allocation}%
                    </span>
                  </div>
                  <Progress value={Math.min(member.allocation, 100)} className="h-2" />
                  <div className="flex flex-wrap gap-1">
                    {member.projects.map((project: any) => (
                      <Badge key={project.id} variant="outline" className="text-xs">
                        {project.name} ({project.allocation}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}