'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { User } from '@/types/user'

interface UserContextType {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true
})

export function UserProvider({ 
  children, 
  user 
}: { 
  children: ReactNode
  user: User | null 
}) {
  return (
    <UserContext.Provider value={{ user, isLoading: false }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}