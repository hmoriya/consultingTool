import { getCurrentUser } from '@/actions/auth'
import { getArticle } from '@/actions/knowledge'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Calendar, User, Tag, ArrowLeft, Edit, Trash2, Share2, FileText, Link as LinkIcon, Eye, Heart } from 'lucide-react'
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

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // データベースから記事を取得
  const articleResult = await getArticle(id)

  if (!articleResult.success || !articleResult.data) {
    notFound()
  }

  const article = articleResult.data
  const tags = article.tags ? JSON.parse(article.tags as string) : []

  const categoryColors: Record<string, string> = {
    'フロントエンド開発': 'bg-blue-100 text-blue-800',
    'バックエンド開発': 'bg-green-100 text-green-800',
    'アーキテクチャ': 'bg-purple-100 text-purple-800',
    'プロジェクト管理': 'bg-yellow-100 text-yellow-800',
    'ベストプラクティス': 'bg-orange-100 text-orange-800',
    '技術': 'bg-indigo-100 text-indigo-800',
    'ナレッジ': 'bg-purple-100 text-purple-800',
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
                  <CardTitle className="text-2xl">{article.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {getUserName(article.authorId)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {user.id === article.authorId && (
                    <>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {/* Markdownコンテンツの表示（簡易的な改行処理） */}
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
              </div>
            </CardContent>
          </Card>

          {/* 添付ファイル */}
          {article.attachments && article.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">添付ファイル</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {article.attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.originalName}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)}KB</p>
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

          {/* コメントセクション */}
          {article.comments && article.comments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">コメント ({article.comments.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {getUserName(comment.authorId).substring(0, 1)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{getUserName(comment.authorId)}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                    {comment.replies && comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-11 flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {getUserName(reply.authorId).substring(0, 1)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{getUserName(reply.authorId)}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{reply.content}</p>
                        </div>
                      </div>
                    ))}
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
                <Badge className={categoryColors[article.category?.name || ''] || 'bg-gray-100 text-gray-800'}>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {article.category?.name || 'その他'}
                </Badge>
              </div>
              {tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">タグ</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  <Eye className="inline h-3 w-3 mr-1" />
                  閲覧数
                </span>
                <span className="text-sm font-medium">{article.viewCount}回</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  <Heart className="inline h-3 w-3 mr-1" />
                  いいね
                </span>
                <span className="text-sm font-medium">{article.likeCount}件</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">作成日</span>
                  <span className="text-xs">{new Date(article.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">最終更新</span>
                  <span className="text-xs">{new Date(article.updatedAt).toLocaleDateString('ja-JP')}</span>
                </div>
                {article.publishedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">公開日</span>
                    <span className="text-xs">{new Date(article.publishedAt).toLocaleDateString('ja-JP')}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ステータス */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ステータス</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}
                className="w-full justify-center"
              >
                {article.status === 'PUBLISHED' && '公開済み'}
                {article.status === 'DRAFT' && '下書き'}
                {article.status === 'REVIEW' && 'レビュー中'}
                {article.status === 'APPROVED' && '承認済み'}
                {article.status === 'ARCHIVED' && 'アーカイブ'}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}