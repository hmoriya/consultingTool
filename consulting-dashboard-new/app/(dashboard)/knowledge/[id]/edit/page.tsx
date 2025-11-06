import { getCurrentUser } from '@/actions/auth'
import { getArticle } from '@/actions/knowledge'
import { redirect, notFound } from 'next/navigation'
import { KnowledgeEditForm } from '@/components/knowledge/knowledge-edit-form'

export default async function KnowledgeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  // 記事を取得
  const articleResult = await getArticle(id)

  if (!articleResult.success || !articleResult.data) {
    notFound()
  }

  const article = articleResult.data

  // 作成者またはエグゼクティブのみ編集可能
  const userRole = typeof user.role === 'object' ? (user.role as { name: string }).name : user.role
  if (article.authorId !== user.id && userRole !== 'Executive') {
    redirect(`/knowledge/${id}`)
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">記事を編集</h1>
      <KnowledgeEditForm article={article} />
    </div>
  )
}