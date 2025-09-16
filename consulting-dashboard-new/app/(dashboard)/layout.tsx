import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import AppLayout from '@/components/layouts/app-layout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}