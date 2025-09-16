import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証が不要なパス
const publicPaths = ['/login', '/', '/api/login']

// 静的ファイルやAPIパス
const staticPaths = ['/favicon.ico', '/_next', '/api']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // 静的ファイルはそのまま通す
  if (staticPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }
  
  // publicパスはそのまま通す
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }
  
  // セッションチェック
  const sessionCookie = request.cookies.get('session')
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // セッションIDの存在確認のみ行う
  // 実際のセッション検証とロールベースアクセス制御は各ページのServer Componentで実施
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}