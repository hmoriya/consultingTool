'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Briefcase, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { logout } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { user } = useUser()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const handleLogout = async () => {
    try {
      await logout()
      // logout() already handles redirect, no need for router.push
    } catch (error) {
      console.error('Logout failed:', error)
      // Fallback redirect if server action fails
      router.push('/login')
    }
  }
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* 左側セクション */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            data-testid="hamburger-menu"
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="hidden md:block text-base font-medium">
              コンサルティングダッシュボード
            </span>
            <span className="md:hidden text-base font-medium">
              Dashboard
            </span>
          </Link>
        </div>
        
        {/* 右側セクション */}
        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                data-testid="profile-icon"
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.organization.name}</p>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-500 transition-transform",
                  isDropdownOpen && "rotate-180"
                )} />
              </button>
              
              {/* ドロップダウンメニュー */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border py-2"
                    data-testid="profile-dropdown"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.role.name}</p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      プロファイル編集
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      設定
                    </Link>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      data-testid="logout-button"
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 transition-colors w-full text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      ログアウト
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}