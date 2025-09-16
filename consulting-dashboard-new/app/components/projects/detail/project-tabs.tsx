'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectOverview } from './tabs/project-overview'
import { ProjectTasks } from './tabs/project-tasks'
import { ProjectTeam } from './tabs/project-team'
import { ProjectMilestones } from './tabs/project-milestones'
import { ProjectMetrics } from './tabs/project-metrics'
import { ProjectDocuments } from './tabs/project-documents'
import type { ProjectWithRelations } from '@/types/project'

interface ProjectTabsProps {
  project: ProjectWithRelations
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">概要</TabsTrigger>
        <TabsTrigger value="tasks">タスク</TabsTrigger>
        <TabsTrigger value="team">チーム</TabsTrigger>
        <TabsTrigger value="milestones">マイルストーン</TabsTrigger>
        <TabsTrigger value="metrics">メトリクス</TabsTrigger>
        <TabsTrigger value="documents">ドキュメント</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProjectOverview project={project} />
      </TabsContent>

      <TabsContent value="tasks">
        <ProjectTasks project={project} />
      </TabsContent>

      <TabsContent value="team">
        <ProjectTeam project={project} />
      </TabsContent>

      <TabsContent value="milestones">
        <ProjectMilestones project={project} />
      </TabsContent>

      <TabsContent value="metrics">
        <ProjectMetrics project={project} />
      </TabsContent>

      <TabsContent value="documents">
        <ProjectDocuments project={project} />
      </TabsContent>
    </Tabs>
  )
}