'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  Archive,
  Pause,
  Play,
  MoreVertical,
  Users
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useUser } from '@/contexts/user-context'
import type { ProjectWithRelations } from '@/types/project'

interface ProjectHeaderProps {
  project: ProjectWithRelations
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: unknown }> = {
  planning: { label: '計画中', variant: 'outline', icon: null },
  active: { label: '進行中', variant: 'default', icon: Play },
  completed: { label: '完了', variant: 'secondary', icon: CheckCircle },
  onhold: { label: '保留', variant: 'destructive', icon: Pause },
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const router = useRouter()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const canEdit = user?.role.name === 'executive' || 
    project.projectMembers.some((m: unknown) => m.userId === user?.id && m.role === 'pm')

  const handleBack = () => {
    router.push('/projects')
  }

  const handleEdit = () => {
    router.push(`/projects/${project.id}/edit`)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const StatusIcon = statusConfig[project.status]?.icon

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge variant={statusConfig[project.status]?.variant}>
                  {StatusIcon && <StatusIcon className="w-3 h-3 mr-1" />}
                  {statusConfig[project.status]?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span>{project.id}</span>
                <span>•</span>
                <span>{project.client?.name || 'クライアント未設定'}</span>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex items-center gap-2">
                <Button onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  編集
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>ステータス変更</DropdownMenuItem>
                    <DropdownMenuItem>レポート生成</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Archive className="mr-2 h-4 w-4" />
                      アーカイブ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">プロジェクト期間</p>
                <p className="font-medium">
                  {format(new Date(project.startDate), 'yyyy年MM月dd日', { locale: ja })}
                  {project.endDate && (
                    <>
                      <span className="mx-1">〜</span>
                      {format(new Date(project.endDate), 'yyyy年MM月dd日', { locale: ja })}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">予算</p>
                <p className="font-medium">{project.budget ? formatCurrency(project.budget) : '未設定'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">チームメンバー</p>
                <p className="font-medium">{project.projectMembers.length}名</p>
              </div>
            </div>
          </div>

          {project.description && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">プロジェクト概要</p>
              <p className="text-sm">{project.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}