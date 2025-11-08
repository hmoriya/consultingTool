import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AppLayout from '@/components/layouts/app-layout'
import { ContactList } from '@/components/clients/contact-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { db } from '@/lib/db'
import { getOrganizationContacts } from '@/actions/organization-contacts'
import { 
  Building2, 
  Globe, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft,
  Users
} from 'lucide-react'
import Link from 'next/link'

interface ClientDetailPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ClientDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const client = await db.organization.findFirst({
    where: {
      id: id,
      type: 'client'
    }
  })

  return {
    title: client ? `${client.name} - クライアント詳細` : 'クライアント詳細',
    description: client ? `${client.name}の詳細情報と担当者一覧` : 'クライアントの詳細情報'
  }
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params
  const client = await db.organization.findFirst({
    where: {
      id: id,
      type: 'client'
    }
  })

  if (!client) {
    notFound()
  }

  const contacts = await getOrganizationContacts(client.id)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              {client.name}
            </h1>
            <p className="text-muted-foreground">クライアント詳細情報</p>
          </div>
        </div>

        {/* 基本情報カード */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {client.industry && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">業界</p>
                  <p className="text-sm">{client.industry}</p>
                </div>
              )}
              
              {client.employeeCount && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    従業員数
                  </p>
                  <p className="text-sm">{client.employeeCount.toLocaleString()}名</p>
                </div>
              )}
              
              {client.foundedYear && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    設立年
                  </p>
                  <p className="text-sm">{client.foundedYear}年</p>
                </div>
              )}
              
              {client.website && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    ウェブサイト
                  </p>
                  <a 
                    href={client.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {client.website}
                  </a>
                </div>
              )}
              
              {client.phone && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    電話番号
                  </p>
                  <a 
                    href={`tel:${client.phone}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              )}
              
              {client.email && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    メールアドレス
                  </p>
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              )}
              
              {client.address && (
                <div className="space-y-1 md:col-span-2 lg:col-span-3">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    住所
                  </p>
                  <p className="text-sm">{client.address}</p>
                </div>
              )}
            </div>
            
            {client.description && (
              <div className="mt-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground">企業概要</p>
                <p className="text-sm leading-relaxed">{client.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* タブコンテンツ */}
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList>
            <TabsTrigger value="contacts">担当者</TabsTrigger>
            <TabsTrigger value="projects">プロジェクト</TabsTrigger>
            <TabsTrigger value="documents">ドキュメント</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts" className="space-y-4">
            <ContactList
              organizationId={client.id}
              organizationName={client.name}
              initialContacts={contacts}
            />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>関連プロジェクト</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  プロジェクト一覧機能は今後実装予定です
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ドキュメント</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  ドキュメント管理機能は今後実装予定です
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}