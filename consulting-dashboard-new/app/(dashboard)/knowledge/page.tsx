import { getCurrentUser } from '@/actions/auth'
import { getArticles } from '@/actions/knowledge'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, BookOpen, Lightbulb, Search, Plus } from 'lucide-react'
import Link from 'next/link'

// ユーザー名を取得するダミー関数
function getUserName(authorId: string): string {
  const userMap: Record<string, string> = {
    'consultant-user-id': '山田太郎',
    'pm-user-id': '佐藤花子',
    'exec-user-id': '鈴木一郎'
  }
  return userMap[authorId] || '不明なユーザー'
}

export default async function KnowledgePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // データベースから記事を取得
  const articlesResult = await getArticles()
  const articles = articlesResult.success ? articlesResult.data || [] : []

  // 記事データをUI表示用に変換
  const knowledgeItems = articles.map((article) => {
    const tags = article.tags ? JSON.parse(article.tags as string) : []

    return {
      id: article.id,
      title: article.title,
      category: article.category?.name || 'その他',
      type: 'article',
      author: getUserName(article.authorId),
      createdAt: new Date(article.publishedAt || article.createdAt),
      tags: tags
    }
  })

  const categoryColors = {
    'プロジェクト管理': 'bg-blue-500',
    'テンプレート': 'bg-green-500',
    'ケーススタディ': 'bg-purple-500',
    '技術': 'bg-orange-500'
  }

  const typeIcons = {
    'article': BookOpen,
    'template': FileText,
    'case-study': Lightbulb
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ナレッジベース</h1>
          <p className="text-muted-foreground">
            社内の知識・ノウハウを共有
          </p>
        </div>
        <Link href="/knowledge/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="キーワードで検索..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          カテゴリで絞る
        </Button>
        <Button variant="outline">
          タグで絞る
        </Button>
      </div>

      <div className="grid gap-4">
        {knowledgeItems.map((item) => {
          const Icon = typeIcons[item.type as keyof typeof typeIcons] || FileText
          const categoryColor = categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-500'
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${categoryColor} bg-opacity-10`}>
                      <Icon className={`h-5 w-5 ${categoryColor.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {item.title}
                      </CardTitle>
                      <CardDescription>
                        {item.author} • {item.createdAt.toLocaleDateString('ja-JP')}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={categoryColor}>
                    {item.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/knowledge/${item.id}`}>
                    <Button variant="ghost" size="sm">
                      詳細を見る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">
            知識を共有することで、チーム全体の生産性が向上します
          </p>
          <Link href="/knowledge/new">
            <Button className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              ナレッジを投稿する
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}