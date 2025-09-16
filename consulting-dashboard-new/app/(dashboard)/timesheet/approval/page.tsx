import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import { getPendingApprovals } from '@/actions/timesheet-approval'
import { ApprovalList } from '@/components/timesheet/approval-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-react'

export default async function TimesheetApprovalPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // PM/Executiveロールのみアクセス可能
  const userRole = user.role.name.toLowerCase()
  if (!['pm', 'executive'].includes(userRole)) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">このページへのアクセス権限がありません</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const result = await getPendingApprovals()
  
  if (!result.success) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive">エラー: {result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">工数承認管理</h1>
        <p className="text-muted-foreground mt-2">
          提出された工数記録の承認・差戻しを行います
        </p>
      </div>

      <ApprovalList timesheets={result.data || []} />
    </div>
  )
}