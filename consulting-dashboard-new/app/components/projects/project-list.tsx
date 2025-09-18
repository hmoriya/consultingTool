'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  DollarSign, 
  Users, 
  ChevronRight,
  MoreVertical,
  Edit,
  Archive,
  FileText
} from 'lucide-react'
import { ProjectListItem, ProjectStatus } from '@/actions/projects'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useProjectFilters } from '@/contexts/project-filter-context'

interface ProjectListProps {
  projects: ProjectListItem[]
}

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  planning: { label: '計画中', variant: 'outline', color: 'text-blue-600' },
  active: { label: '進行中', variant: 'default', color: 'text-green-600' },
  completed: { label: '完了', variant: 'secondary', color: 'text-gray-600' },
  onhold: { label: '保留', variant: 'destructive', color: 'text-red-600' },
}

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const { filters } = useProjectFilters()

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = initialProjects

    // 検索フィルター
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.code.toLowerCase().includes(query) ||
        (project.client?.name || '').toLowerCase().includes(query) ||
        project.pmName.toLowerCase().includes(query)
      )
    }

    // ステータスフィルター
    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === filters.statusFilter)
    }

    // ソート
    filtered.sort((a, b) => {
      let compareValue = 0
      
      switch (filters.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name)
          break
        case 'startDate':
          compareValue = new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          break
        case 'budget':
          compareValue = a.budget - b.budget
          break
        case 'progress':
          compareValue = a.progress - b.progress
          break
        default:
          compareValue = a.name.localeCompare(b.name)
      }
      
      return filters.sortOrder === 'desc' ? -compareValue : compareValue
    })

    return filtered
  }, [initialProjects, filters])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  if (filteredAndSortedProjects.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          {filters.searchQuery || filters.statusFilter !== 'all' 
            ? '条件に一致するプロジェクトがありません' 
            : 'プロジェクトがまだありません'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {filteredAndSortedProjects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/projects/${project.id}`}
                    className="text-xl font-semibold hover:text-primary transition-colors"
                  >
                    {project.name}
                  </Link>
                  <Badge variant={statusConfig[project.status].variant}>
                    {statusConfig[project.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{project.code}</span>
                  <span>•</span>
                  <span>{project.client?.name || 'クライアント未設定'}</span>
                  <span>•</span>
                  <span>PM: {project.pmName}</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    レポート生成
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Archive className="mr-2 h-4 w-4" />
                    アーカイブ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 進捗バー */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">進捗率</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            {/* プロジェクト情報 */}
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">期間</p>
                  <p className="font-medium">
                    {format(new Date(project.startDate), 'yyyy/MM/dd', { locale: ja })}
                    {project.endDate && (
                      <>
                        <span className="mx-1">-</span>
                        {format(new Date(project.endDate), 'yyyy/MM/dd', { locale: ja })}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">予算</p>
                  <p className="font-medium">{formatCurrency(project.budget)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">チーム</p>
                  <p className="font-medium">{project.teamSize}名</p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href={`/projects/${project.id}`}>
                  <Button variant="ghost" size="sm">
                    詳細を見る
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}