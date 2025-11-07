'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Hash, 
  Lock, 
  MessageCircle,
  Phone,
  Video,
  Users,
  Info,
  MoreVertical
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface ChannelHeaderProps {
  channel: {
    id: string
    name?: string | null
    description?: string | null
    type: string
    isPrivate: boolean
    members: Array<{
      userId: string
      role: string
    }>
  }
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const router = useRouter()

  const _getChannelIcon = () => {
    if (channel.type === 'DIRECT') {
      return <MessageCircle className="h-5 w-5" />
    }
    return channel.isPrivate ? <Lock className="h-5 w-5" /> : <Hash className="h-5 w-5" />
  }

  const getChannelName = () => {
    if (channel.type === 'DIRECT') {
      return 'ダイレクトメッセージ'
    }
    return channel.name || '無題のチャンネル'
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/messages')}
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3">
              {channel.type === 'DIRECT' ? (
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    DM
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className={`p-2.5 rounded-lg ${
                  channel.isPrivate 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                    : 'bg-gradient-to-br from-indigo-500 to-blue-600'
                }`}>
                  <div className="text-white">
                    {channel.isPrivate ? <Lock className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="font-semibold text-lg">{getChannelName()}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {channel.description && (
                    <p className="truncate max-w-[300px]">{channel.description}</p>
                  )}
                  {channel.type !== 'DIRECT' && (
                    <span className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400" />
                      <Users className="h-3.5 w-3.5" />
                      {channel.members.length}人
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {channel.type === 'DIRECT' && (
              <>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Video className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                メンバーを表示
              </DropdownMenuItem>
              {channel.type !== 'DIRECT' && (
                <>
                  <DropdownMenuItem>
                    メンバーを追加
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    チャンネル設定
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {channel.type === 'DIRECT' ? '会話を削除' : 'チャンネルを退出'}
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}