import { Suspense } from 'react'
import AppLayout from '@/components/layouts/app-layout'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectListHeader } from '@/components/projects/project-list-header'
import { ProjectFilterProvider } from '@/contexts/project-filter-context'
import { getProjects } from '@/actions/projects'

export default async function ProjectsPage() {
  return (
    <AppLayout>
      <ProjectFilterProvider>
        <div className="space-y-6">
          <ProjectListHeader />
          <Suspense fallback={<ProjectListSkeleton />}>
            <ProjectListContent />
          </Suspense>
        </div>
      </ProjectFilterProvider>
    </AppLayout>
  )
}

async function ProjectListContent() {
  const projects = await getProjects()
  return <ProjectList projects={projects} />
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
  )
}