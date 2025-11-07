'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

interface ProjectStatsProps {
  projects: unknown[]
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  // アクティブなプロジェクトの統計を計算
  const activeProjects = projects.filter(p => p.status === 'active')
  
  // 平均進捗率
  const averageProgress = activeProjects.length > 0
    ? Math.round(activeProjects.reduce((sum, p) => sum + p.progress, 0) / activeProjects.length)
    : 0
  
  // リスクの高いプロジェクト（進捗が30%未満）
  const riskyProjects = activeProjects.filter(p => p.progress < 30)
  
  // 今月完了予定のプロジェクト
  const thisMonth = new Date()
  const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0)
  const projectsEndingThisMonth = activeProjects.filter(p => {
    if (!p.endDate) return false
    const endDate = new Date(p.endDate)
    return endDate <= nextMonth && endDate >= thisMonth
  })
  
  // 進捗トレンド（仮のデータ）
  const progressTrend = averageProgress > 50 ? 'up' : averageProgress > 30 ? 'stable' : 'down'
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>プロジェクト統計</CardTitle>
        <CardDescription>アクティブプロジェクトの概要</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 平均進捗率 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">平均進捗率</span>
            <div className="flex items-center gap-1">
              {progressTrend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
              {progressTrend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
              <span className="font-medium">{averageProgress}%</span>
            </div>
          </div>
          <Progress value={averageProgress} className="h-2" />
        </div>
        
        {/* リスクのあるプロジェクト */}
        {riskyProjects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-muted-foreground">要注意プロジェクト</span>
            </div>
            <div className="space-y-1">
              {riskyProjects.map((project) => (
                <div key={project.id} className="rounded-md bg-amber-50 p-2">
                  <p className="text-sm font-medium text-amber-900">{project.name}</p>
                  <p className="text-xs text-amber-700">進捗: {project.progress}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 今月完了予定 */}
        {projectsEndingThisMonth.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">今月完了予定</p>
            <div className="space-y-1">
              {projectsEndingThisMonth.map((project) => (
                <div key={project.id} className="rounded-md bg-blue-50 p-2">
                  <p className="text-sm font-medium text-blue-900">{project.name}</p>
                  <p className="text-xs text-blue-700">
                    期限: {new Date(project.endDate).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* プロジェクト別予算消化率 */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">予算消化状況</p>
          <div className="space-y-2">
            {activeProjects.slice(0, 3).map((project) => {
              const budgetUsage = project.budgetUsed || Math.round(project.progress * 0.8 + Math.random() * 20)
              return (
                <div key={project.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="truncate">{project.name}</span>
                    <span className={budgetUsage > 80 ? 'text-amber-600' : ''}>{budgetUsage}%</span>
                  </div>
                  <Progress value={budgetUsage} className="h-1.5" />
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}