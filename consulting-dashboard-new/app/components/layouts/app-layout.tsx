'use client'

import { useState, useEffect } from 'react'
import Header from './header/header'
import Sidebar from './sidebar/sidebar'
import { useUser } from '@/contexts/user-context'
import { ApprovalProvider } from '@/contexts/approval-context'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useUser()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // モバイルではデフォルトで閉じる
      if (mobile) {
        setIsSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // LocalStorageからサイドバーの状態を読み込み
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar_state')
    if (savedState === 'collapsed' || savedState === 'expanded') {
      setIsSidebarCollapsed(savedState === 'collapsed')
    }
  }, [])
  
  const handleMenuToggle = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      // デスクトップでは折りたたみ
      const newCollapsed = !isSidebarCollapsed
      setIsSidebarCollapsed(newCollapsed)
      localStorage.setItem('sidebar_state', newCollapsed ? 'collapsed' : 'expanded')
    }
  }
  
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
    localStorage.setItem('sidebar_state', collapsed ? 'collapsed' : 'expanded')
  }
  
  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }
  
  return (
    <ApprovalProvider>
      <div className="min-h-screen bg-background">
        <Header onMenuToggle={handleMenuToggle} />
        
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            isCollapsed={isSidebarCollapsed}
            onCollapse={handleSidebarCollapse}
            onClose={handleSidebarClose}
          />
        )}
        
        <main
          className={cn(
            "pt-16 transition-all duration-300",
            user && !isMobile && "md:ml-64",
            user && !isMobile && isSidebarCollapsed && "md:ml-16"
          )}
        >
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </ApprovalProvider>
  )
}