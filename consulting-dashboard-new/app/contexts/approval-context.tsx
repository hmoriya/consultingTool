'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from '@/contexts/user-context'

interface ApprovalContextType {
  pendingCount: number
  refreshPendingCount: () => Promise<void>
}

const ApprovalContext = createContext<ApprovalContextType>({
  pendingCount: 0,
  refreshPendingCount: async () => {}
})

export function ApprovalProvider({ children }: { children: React.ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0)
  const { user } = useUser()

  const fetchPendingCount = async () => {
    if (!user || !['pm', 'executive'].includes(user.role.name)) {
      setPendingCount(0)
      return
    }

    try {
      const response = await fetch('/api/timesheet/pending-count')
      if (response.ok) {
        const data = await response.json()
        setPendingCount(data.count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch pending count:', error)
      setPendingCount(0)
    }
  }

  useEffect(() => {
    fetchPendingCount()
    // 定期的に承認待ち数を更新（30秒ごと）
    const interval = setInterval(fetchPendingCount, 30000)
    return () => clearInterval(interval)
  }, [user])

  return (
    <ApprovalContext.Provider value={{ pendingCount, refreshPendingCount: fetchPendingCount }}>
      {children}
    </ApprovalContext.Provider>
  )
}

export function useApproval() {
  const context = useContext(ApprovalContext)
  if (!context) {
    throw new Error('useApproval must be used within ApprovalProvider')
  }
  return context
}