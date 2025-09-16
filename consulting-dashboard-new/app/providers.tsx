'use client'

import { UserProvider } from '@/contexts/user-context'
import type { User } from '@/types/user'
import { SessionKeeper } from '@/components/auth/session-keeper'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
  user: User | null
}

export function Providers({ children, user }: ProvidersProps) {
  return (
    <UserProvider user={user}>
      {user && <SessionKeeper />}
      {children}
      <Toaster />
    </UserProvider>
  )
}