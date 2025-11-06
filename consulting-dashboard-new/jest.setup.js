import '@testing-library/jest-dom'

// Prismaモックのセットアップ
jest.mock('@/lib/db', () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  db: require('./app/__mocks__/db').prismaMock
}))

// セッション関連のモック
jest.mock('@/lib/auth/session', () => ({
  createSession: jest.fn(),
  getSession: jest.fn(),
  deleteSession: jest.fn()
}))

// グローバルモック
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Next.js のナビゲーションモック
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  redirect: jest.fn(),
}))

// Cookieモック
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })
}))