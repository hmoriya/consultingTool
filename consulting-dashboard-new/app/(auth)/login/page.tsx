import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth'
import { LoginForm } from '@/components/auth/login-form'
import { GridPattern } from '@/components/ui/grid-pattern'

export default async function LoginPage() {
  // すでにログイン済みの場合はトップページへリダイレクト
  const user = await getCurrentUser()
  if (user) {
    redirect('/')
  }
  
  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* 左側のパネル */}
        <div className="relative hidden lg:flex flex-col p-10 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          <GridPattern
            width={30}
            height={30}
            x={0}
            y={0}
            strokeDasharray={"4 2"}
            className="absolute inset-0 fill-white/10 stroke-white/10 z-10"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            コンサルティングダッシュボード
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;このダッシュボードにより、プロジェクト管理の効率が大幅に向上しました。&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        
        {/* 右側のログインフォーム */}
        <div className="flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                アカウントにログイン
              </h1>
              <p className="text-sm text-muted-foreground">
                メールアドレスとパスワードを入力してください
              </p>
            </div>
            <LoginForm />
            
            {/* テストユーザー情報 */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">テストユーザー:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>PM: pm@example.com / password123</p>
                <p>Executive: exec@example.com / password123</p>
                <p>Consultant: consultant@example.com / password123</p>
              </div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              ログインすることで、
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                利用規約
              </a>
              と
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                プライバシーポリシー
              </a>
              に同意したものとみなされます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}