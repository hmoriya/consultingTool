import { Metadata } from 'next'
import AppLayout from '@/components/layouts/app-layout'
import { TeamList } from '@/components/team/team-list'
import { getTeamMembers } from '@/actions/team'
import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { USER_ROLES } from '@/constants/roles'

export const metadata: Metadata = {
  title: 'チーム管理',
  description: 'コンサルティングファームのチームメンバー管理'
}

export default async function TeamPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // クライアント以外はアクセス可能（コンサルタントは閲覧のみ）
  if (user.role.name === USER_ROLES.CLIENT) {
    redirect('/dashboard/client')
  }

  const members = await getTeamMembers()
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">チーム管理</h1>
          <p className="text-muted-foreground">
            コンサルティングファームのメンバーを管理し、稼働状況を把握します
          </p>
        </div>
        
        <TeamList 
          initialMembers={members} 
          currentUserRole={user.role.name}
        />
      </div>
    </AppLayout>
  )
}