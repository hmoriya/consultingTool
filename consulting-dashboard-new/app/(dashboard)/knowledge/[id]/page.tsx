import { getCurrentUser } from '@/actions/auth'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Calendar, User, Tag, ArrowLeft, Edit, Trash2, Share2, FileText, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

// 仮のナレッジデータ（実際はデータベースから取得）
const mockKnowledgeData = {
  '1': {
    id: '1',
    title: 'React Query を使った効率的なデータフェッチング戦略',
    category: 'フロントエンド開発',
    tags: ['React', 'React Query', 'パフォーマンス', 'キャッシュ'],
    author: '田中 太郎',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    views: 234,
    likes: 15,
    content: `
# React Query を使った効率的なデータフェッチング戦略

## 概要
React Queryは、Reactアプリケーションにおけるサーバー状態の管理を簡単にするライブラリです。
データフェッチング、キャッシング、同期、更新などの複雑な処理を簡潔に実装できます。

## 主な利点

### 1. 自動的なキャッシング
React Queryは取得したデータを自動的にキャッシュし、同じデータへの重複リクエストを防ぎます。

### 2. バックグラウンドでの再取得
ウィンドウにフォーカスが戻った時やネットワークが再接続された時に、自動的にデータを最新化します。

### 3. 楽観的更新
ユーザーの操作に対して即座にUIを更新し、バックグラウンドでサーバーと同期を取ることができます。

## 実装例

\`\`\`typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// データ取得の例
function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5分間はデータを新鮮とみなす
  })
}

// データ更新の例
function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
\`\`\`

## ベストプラクティス

1. **適切なキャッシュ時間の設定**: データの性質に応じてstaleTimeとcacheTimeを調整する
2. **エラーハンドリング**: onErrorコールバックを使用してエラーを適切に処理する
3. **楽観的更新の活用**: ユーザー体験を向上させるため、可能な限り楽観的更新を使用する

## まとめ
React Queryを使用することで、複雑なデータ管理ロジックを簡潔に実装でき、
アプリケーションのパフォーマンスとユーザー体験を大幅に向上させることができます。
`,
    relatedArticles: [
      { id: '2', title: 'SWRとReact Queryの比較' },
      { id: '3', title: 'Next.js 13のServer Componentsとデータフェッチング' }
    ],
    attachments: [
      { name: 'react-query-examples.zip', size: '234KB', type: 'zip' },
      { name: 'performance-comparison.pdf', size: '1.2MB', type: 'pdf' }
    ]
  }
}

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // 実際はデータベースから取得
  const knowledge = mockKnowledgeData[id as keyof typeof mockKnowledgeData]

  if (!knowledge) {
    notFound()
  }

  const categoryColors: Record<string, string> = {
    'フロントエンド開発': 'bg-blue-100 text-blue-800',
    'バックエンド開発': 'bg-green-100 text-green-800',
    'アーキテクチャ': 'bg-purple-100 text-purple-800',
    'プロジェクト管理': 'bg-yellow-100 text-yellow-800',
    'ベストプラクティス': 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/knowledge">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ナレッジ一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{knowledge.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {knowledge.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {knowledge.createdAt.toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: knowledge.content.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
          </Card>

          {/* 添付ファイル */}
          {knowledge.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">添付ファイル</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {knowledge.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      ダウンロード
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* カテゴリとタグ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">分類</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">カテゴリ</p>
                <Badge className={categoryColors[knowledge.category] || 'bg-gray-100 text-gray-800'}>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {knowledge.category}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">タグ</p>
                <div className="flex flex-wrap gap-2">
                  {knowledge.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">閲覧数</span>
                <span className="text-sm font-medium">{knowledge.views}回</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">いいね</span>
                <span className="text-sm font-medium">{knowledge.likes}件</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">最終更新</span>
                <span className="text-sm font-medium">{knowledge.updatedAt.toLocaleDateString('ja-JP')}</span>
              </div>
            </CardContent>
          </Card>

          {/* 関連記事 */}
          {knowledge.relatedArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">関連記事</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {knowledge.relatedArticles.map((article) => (
                  <Link key={article.id} href={`/knowledge/${article.id}`}>
                    <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm hover:underline">{article.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}