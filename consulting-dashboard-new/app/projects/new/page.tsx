import AppLayout from '@/components/layouts/app-layout'
import { ProjectCreateForm } from '@/components/projects/create/project-create-form'

export default function ProjectCreatePage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">新規プロジェクト作成</h1>
          <p className="text-muted-foreground">
            新しいプロジェクトの基本情報を入力してください。
          </p>
        </div>
        <ProjectCreateForm />
      </div>
    </AppLayout>
  )
}