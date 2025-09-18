'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFilterState) => void
  projects: Array<{ id: string; name: string }>
  initialStatus?: string
}

export interface TaskFilterState {
  search: string
  status: string
  priority: string
  projectId: string
}

export function TaskFilters({ onFiltersChange, projects, initialStatus = 'active' }: TaskFiltersProps) {
  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: initialStatus,
    priority: 'all',
    projectId: 'all'
  })

  const updateFilter = (key: keyof TaskFilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="タスク名で検索..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select
          value={filters.priority}
          onValueChange={(value) => updateFilter('priority', value)}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="優先度" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての優先度</SelectItem>
            <SelectItem value="urgent">緊急</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="low">低</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.projectId}
          onValueChange={(value) => updateFilter('projectId', value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="プロジェクト" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのプロジェクト</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={filters.status}
        onValueChange={(value) => updateFilter('status', value)}
        className="w-full"
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="active">未実施</TabsTrigger>
          <TabsTrigger value="in_progress">進行中</TabsTrigger>
          <TabsTrigger value="todo">未着手</TabsTrigger>
          <TabsTrigger value="review">レビュー</TabsTrigger>
          <TabsTrigger value="completed">完了</TabsTrigger>
          <TabsTrigger value="all">すべて</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}