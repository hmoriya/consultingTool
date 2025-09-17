'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Folder,
  BarChart,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckSquare,
  Clock,
  BookOpen,
  FileText,
  Building2,
  Award,
  BarChart3,
  Briefcase,
  MessageCircle
} from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { useApproval } from '@/contexts/approval-context'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { UserRole } from '@/types/user'

interface MenuItem {
  id: string
  label: string
  path: string
  icon: React.ElementType
  roles?: UserRole[]
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'ダッシュボード', path: '/dashboard', icon: Home },
  { id: 'projects', label: 'プロジェクト一覧', path: '/projects', icon: Folder, roles: ['executive', 'pm'] },
  { id: 'clients', label: 'クライアント管理', path: '/clients', icon: Building2, roles: ['executive', 'pm'] },
  { id: 'team', label: 'チーム管理', path: '/team', icon: Users, roles: ['executive', 'pm'] },
  { id: 'skills', label: 'スキル管理', path: '/team/skills', icon: Award, roles: ['executive', 'pm', 'consultant'] },
  { id: 'experience', label: 'プロジェクト経験', path: '/team/experience', icon: Briefcase, roles: ['executive', 'pm', 'consultant'] },
  { id: 'utilization', label: '稼働率管理', path: '/team/utilization', icon: BarChart3, roles: ['executive', 'pm'] },
  { id: 'tasks', label: 'タスク', path: '/tasks', icon: CheckSquare, roles: ['consultant'] },
  { id: 'timesheet', label: '工数管理', path: '/timesheet', icon: Clock, roles: ['executive', 'pm', 'consultant'] },
  { id: 'timesheet-approval', label: '工数承認', path: '/timesheet/approval', icon: CheckSquare, roles: ['executive', 'pm'] },
  { id: 'knowledge', label: 'ナレッジ', path: '/knowledge', icon: BookOpen, roles: ['consultant'] },
  { id: 'messages', label: 'メッセージ', path: '/messages', icon: MessageCircle },
  { id: 'deliverables', label: '成果物', path: '/deliverables', icon: FileText, roles: ['client'] },
  { id: 'reports', label: 'レポート', path: '/reports', icon: BarChart, roles: ['executive', 'pm'] },
  { id: 'settings', label: '設定', path: '/settings', icon: Settings },
  { id: 'help', label: 'ヘルプ', path: '/help', icon: HelpCircle }
]

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onCollapse: (collapsed: boolean) => void
  onClose?: () => void
}

export default function Sidebar({ isOpen, isCollapsed, onCollapse, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const { pendingCount } = useApproval()
  const [isMobile, setIsMobile] = useState(false)

  // デバッグ用ログ
  console.log('Sidebar render:', { isOpen, isCollapsed, user: !!user, isMobile })
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // ロールベースでメニューアイテムをフィルタリング（一時的に全て表示）
  const filteredMenuItems = menuItems
  // const filteredMenuItems = menuItems.filter(
  //   item => !item.roles || (user && item.roles.includes(user.role.name as UserRole))
  // )
  
  const getDashboardPath = () => {
    if (!user) return '/dashboard'
    const roleMap: Record<string, string> = {
      'Executive': 'executive',
      'PM': 'pm',
      'Consultant': 'consultant',
      'Client': 'client',
      'Admin': 'admin'
    }
    const rolePath = roleMap[user.role.name] || user.role.name.toLowerCase()
    return `/dashboard/${rolePath}`
  }
  
  return (
    <>
      {/* モバイル用オーバーレイ */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* サイドバー */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r shadow-sm transition-all duration-300 z-40",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          !isMobile && "translate-x-0",
          // 強制的に展開状態にする
          "w-64"
          // isCollapsed && !isMobile ? "w-16" : "w-64"
        )}
        data-testid="sidebar"
        data-state="expanded"
        style={{ width: '256px' }} // 強制的に幅を設定
      >
        {/* 折りたたみボタン */}
        {!isMobile && (
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className="absolute -right-3 top-4 w-6 h-6 bg-white border rounded-full shadow-sm hover:shadow-md transition-shadow"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 mx-auto" />
            ) : (
              <ChevronLeft className="w-4 h-4 mx-auto" />
            )}
          </button>
        )}
        
        {/* ナビゲーションメニュー */}
        <nav className="flex flex-col h-full">
          <ul className="flex-1 px-3 py-4 space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const path = item.id === 'dashboard' ? getDashboardPath() : item.path
              const isActive = pathname === path || pathname.startsWith(path + '/')
              
              return (
                <li key={item.id}>
                  <Link
                    href={path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100",
                      isCollapsed && !isMobile && "justify-center"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className="w-5 h-5 flex-shrink-0"
                      data-testid={`${item.id}-icon`}
                    />
                    {/* 常に表示（強制的に展開状態） */}
                    <span className="flex items-center gap-2 flex-1">
                      {item.label}
                      {item.id === 'timesheet-approval' && pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-auto px-2 py-0 text-xs">
                          {pendingCount}
                        </Badge>
                      )}
                    </span>
                    {isCollapsed && !isMobile && item.id === 'timesheet-approval' && pendingCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          
          {/* ユーザー情報（常に表示） */}
          <div className="border-t p-4">
            <div className="text-sm">
              <p className="font-medium">{user?.name || 'テストユーザー'}</p>
              <p className="text-gray-500 text-xs capitalize">{user?.role?.name || 'PM'}</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}