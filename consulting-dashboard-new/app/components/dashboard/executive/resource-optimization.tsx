'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, TrendingUp, AlertCircle } from 'lucide-react'

interface ResourceData {
  members: {
    id: string
    name: string
    email: string
    utilization: number
    projects: number
    role: string
  }[]
  roleDistribution: {
    role: string
    count: number
    avgUtilization: number
  }[]
}

export function ResourceOptimization({ data }: { data: ResourceData }) {
  const getUtilizationColor = (utilization: number) => {
    if (utilization < 60) return 'text-yellow-600'
    if (utilization > 85) return 'text-red-600'
    return 'text-green-600'
  }

  const getUtilizationBg = (utilization: number) => {
    if (utilization < 60) return 'bg-yellow-100'
    if (utilization > 85) return 'bg-red-100'
    return 'bg-green-100'
  }

  const overutilized = data.members.filter(m => m.utilization > 85)
  const underutilized = data.members.filter(m => m.utilization < 60)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          リソース最適化
        </CardTitle>
        <CardDescription>チームメンバーの稼働状況と最適化提案</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 警告セクション */}
        {(overutilized.length > 0 || underutilized.length > 0) && (
          <div className="space-y-3">
            {overutilized.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-900">高稼働率の注意</p>
                  <p className="text-red-700 mt-1">
                    {overutilized.map(m => m.name).join('、')} は稼働率が85%を超えています。
                    バーンアウトのリスクがあります。
                  </p>
                </div>
              </div>
            )}

            {underutilized.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">稼働率改善の余地</p>
                  <p className="text-yellow-700 mt-1">
                    {underutilized.map(m => m.name).join('、')} は稼働率が60%未満です。
                    追加のプロジェクトアサインが可能です。
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ロール別稼働率 */}
        <div>
          <h4 className="text-sm font-medium mb-3">ロール別平均稼働率</h4>
          <div className="space-y-3">
            {data.roleDistribution.map((role) => (
              <div key={role.role} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{role.role}</span>
                  <span className={getUtilizationColor(role.avgUtilization)}>
                    {role.avgUtilization.toFixed(0)}% ({role.count}名)
                  </span>
                </div>
                <Progress 
                  value={role.avgUtilization} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 個人別稼働率（上位・下位） */}
        <div>
          <h4 className="text-sm font-medium mb-3">メンバー別稼働状況</h4>
          <div className="space-y-2">
            {data.members
              .sort((a, b) => b.utilization - a.utilization)
              .slice(0, 10)
              .map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {member.projects}件
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getUtilizationBg(member.utilization)} ${getUtilizationColor(member.utilization)}`}>
                      {member.utilization}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}