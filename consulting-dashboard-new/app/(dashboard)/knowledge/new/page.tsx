import { getCurrentUser } from '@/actions/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { KnowledgeForm } from '@/components/knowledge/knowledge-form'

export default async function NewKnowledgePage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/knowledge">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ナレッジ一覧に戻る
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新規ナレッジ作成</CardTitle>
          <CardDescription>
            プロジェクトで得た知識やノウハウを共有しましょう
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KnowledgeForm />
        </CardContent>
      </Card>
    </div>
  )
}