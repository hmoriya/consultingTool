import { Metadata } from 'next'
import AppLayout from '@/components/layouts/app-layout'
import { ClientList } from '@/components/clients/client-list'
import { getClients } from '@/actions/clients'

export const metadata: Metadata = {
  title: 'クライアント管理',
  description: 'クライアント組織の管理'
}

export default async function ClientsPage() {
  const clients = await getClients()
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">クライアント管理</h1>
          <p className="text-muted-foreground">
            プロジェクトのクライアント組織を管理します
          </p>
        </div>
        
        <ClientList initialClients={clients} />
      </div>
    </AppLayout>
  )
}