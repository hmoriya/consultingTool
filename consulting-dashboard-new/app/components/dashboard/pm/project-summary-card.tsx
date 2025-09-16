'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Briefcase, Users, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProjectProgress } from '@/actions/pm-dashboard'
import { cn } from '@/lib/utils'

interface ProjectSummaryCardProps {
  project: any
}

export function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const [progress, setProgress] = useState<any>(null)
  
  useEffect(() => {
    getProjectProgress(project.id).then(setProgress).catch(console.error)
  }, [project.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500'
      case 'in_progress': return 'bg-yellow-500'
      case 'on_hold': return 'bg-red-500'
      case 'completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return '計画中'
      case 'in_progress': return '進行中'
      case 'on_hold': return '保留中'
      case 'completed': return '完了'
      default: return status
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/projects/${project.id}`} className="hover:underline">
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </Link>
            <CardDescription className="mt-1">
              {project.client.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn('ml-2', getStatusColor(project.status), 'text-white')}>
            {getStatusLabel(project.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 進捗 */}
        {progress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>タスク進捗</span>
              <span className="font-medium">{progress.taskProgress}%</span>
            </div>
            <Progress value={progress.taskProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {progress.completedTasks}/{progress.totalTasks} タスク完了
            </p>
          </div>
        )}

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-muted-foreground" />
            <span>{project._count.tasks} タスク</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{project._count.milestones} MS</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{project._count.projectMembers} 名</span>
          </div>
        </div>

        {/* 期限 */}
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            開始: {new Date(project.startDate).toLocaleDateString('ja-JP')}
          </p>
          <p className="text-sm text-muted-foreground">
            終了: {new Date(project.endDate).toLocaleDateString('ja-JP')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}