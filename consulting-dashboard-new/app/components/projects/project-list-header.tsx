'use client'

import { Plus, Search, Filter, SortAsc, SortDesc, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/user-context'
import { useProjectFilters } from '@/contexts/project-filter-context'
import { USER_ROLES } from '@/constants/roles'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@/components/ui/select'

export function ProjectListHeader() {
  const router = useRouter()
  const { user } = useUser()
  const { filters, updateFilter, resetFilters } = useProjectFilters()
  
  const canCreateProject = user?.role.name === USER_ROLES.PM || user?.role.name === USER_ROLES.EXECUTIVE

  const handleCreateProject = () => {
    router.push('/projects/new')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">プロジェクト一覧</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role.name === 'executive' 
              ? '全社のプロジェクトを管理・監視します'
              : '担当プロジェクトを管理します'}
          </p>
        </div>
        {canCreateProject && (
          <Button onClick={handleCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            新規プロジェクト
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="プロジェクト名、コード、クライアント名で検索..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filters.statusFilter} onValueChange={(value) => updateFilter('statusFilter', value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="planning">計画中</SelectItem>
              <SelectItem value="active">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
              <SelectItem value="onhold">保留</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="w-[150px]">
              {filters.sortOrder === 'asc' ? (
                <SortAsc className="w-4 h-4 mr-2" />
              ) : (
                <SortDesc className="w-4 h-4 mr-2" />
              )}
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">プロジェクト名</SelectItem>
              <SelectItem value="startDate">開始日</SelectItem>
              <SelectItem value="budget">予算</SelectItem>
              <SelectItem value="progress">進捗率</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            size="icon"
          >
            {filters.sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={resetFilters}
            size="icon"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* アクティブフィルター表示 */}
        {(filters.searchQuery || filters.statusFilter !== 'all') && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>フィルター:</span>
            {filters.searchQuery && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                検索: &quot;{filters.searchQuery}&quot;
              </span>
            )}
            {filters.statusFilter !== 'all' && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
                ステータス: {
                  filters.statusFilter === 'planning' ? '計画中' :
                  filters.statusFilter === 'active' ? '進行中' :
                  filters.statusFilter === 'completed' ? '完了' :
                  filters.statusFilter === 'onhold' ? '保留' : filters.statusFilter
                }
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}