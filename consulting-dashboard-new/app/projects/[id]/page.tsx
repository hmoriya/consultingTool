import AppLayout from '@/components/layouts/app-layout'
import { getProjectDetails } from '@/actions/projects'
import { ProjectHeader } from '@/components/projects/detail/project-header'
import { ProjectTabs } from '@/components/projects/detail/project-tabs'
import { notFound } from 'next/navigation'

interface ProjectDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  let project
  const { id } = await params
  
  try {
    project = await getProjectDetails(id)
  } catch (_error) {
    console.error('Failed to get project details:', _error)
    notFound()
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProjectHeader project={project} />
        <ProjectTabs project={project} />
      </div>
    </AppLayout>
  )
}