import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getCurrentUser } from '@/actions/auth'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'コンサルティングダッシュボード',
  description: 'プロジェクト管理とリソース最適化のための統合ダッシュボード',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers user={user}>
          {children}
        </Providers>
      </body>
    </html>
  )
}