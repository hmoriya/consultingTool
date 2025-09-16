import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import AppLayout from '@/components/layouts/app-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react'

const roleCards = [
  {
    role: 'executive',
    title: 'エグゼクティブ',
    description: '全社のプロジェクトポートフォリオと経営指標を俯瞰',
    icon: TrendingUp,
    path: '/dashboard/executive',
    color: 'text-blue-600'
  },
  {
    role: 'pm',
    title: 'プロジェクトマネージャー',
    description: 'プロジェクトの進捗、チーム、リスク、成果物を管理',
    icon: Briefcase,
    path: '/dashboard/pm',
    color: 'text-green-600'
  },
  {
    role: 'consultant',
    title: 'コンサルタント',
    description: '個人タスク、工数入力、ナレッジ共有',
    icon: Users,
    path: '/dashboard/consultant',
    color: 'text-purple-600'
  },
  {
    role: 'client',
    title: 'クライアント',
    description: 'プロジェクト進捗確認、成果物レビュー',
    icon: FileText,
    path: '/dashboard/client',
    color: 'text-orange-600'
  }
]

export default async function HomePage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // ユーザーのロールに基づいて該当するカードを見つける
  const userRoleCard = roleCards.find(card => card.role === user.role.name)
  
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">コンサルティングダッシュボード</h1>
        <p className="text-gray-600 mb-8">
          {userRoleCard ? 'あなたのダッシュボードを選択してください' : '役割に応じたダッシュボードを選択してください'}
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {roleCards.map((card) => {
            const Icon = card.icon
            const isUserRole = card.role === user.role.name
            const isAccessible = isUserRole || user.role.name === 'admin'
            
            return (
              <div key={card.role} className={!isAccessible ? 'opacity-50' : ''}>
                {isAccessible ? (
                  <Link href={card.path}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`w-8 h-8 ${card.color}`} />
                            <div>
                              <CardTitle className="text-xl">
                                {card.title}
                                {isUserRole && (
                                  <span className="ml-2 text-sm font-normal text-primary">
                                    （あなたのロール）
                                  </span>
                                )}
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {card.description}
                        </CardDescription>
                        <div className="mt-4 text-sm text-primary font-medium">
                          ダッシュボードへ →
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ) : (
                  <Card className="h-full cursor-not-allowed">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`w-8 h-8 ${card.color} opacity-50`} />
                          <CardTitle className="text-xl text-gray-400">
                            {card.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-gray-400">
                        {card.description}
                      </CardDescription>
                      <div className="mt-4 text-sm text-gray-400">
                        アクセス権限がありません
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>現在のログイン情報:</strong> {user.name} ({user.role.name}) - {user.organization.name}
          </p>
        </div>
      </div>
    </AppLayout>
  )
}