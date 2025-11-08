'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Edit2,
  Pin,
  Copy,
  Reply,
  Flag,
  BookmarkPlus,
  MoreVertical,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'

interface MessageActionsProps {
  messageId: string
  isOwn: boolean
  isFlagged?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onPin?: () => void
  onReply?: () => void
  onFlag?: () => void
}

export function MessageActions({
  messageId,
  isOwn,
  isFlagged = false,
  onEdit,
  onDelete,
  onPin,
  onReply,
  onFlag
}: MessageActionsProps) {
  const handleCopy = () => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)
    if (messageElement) {
      const text = messageElement.textContent || ''
      navigator.clipboard.writeText(text).then(() => {
        toast.success('メッセージをコピーしました')
      })
    }
  }

  const handleBookmark = () => {
    // TODO: ブックマーク機能の実装
    toast.info('ブックマーク機能は準備中です')
  }

  const handleFlag = () => {
    if (onFlag) {
      onFlag()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onReply && (
          <DropdownMenuItem onClick={onReply}>
            <Reply className="mr-2 h-4 w-4" />
            返信する
          </DropdownMenuItem>
        )}

        {isOwn && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            編集
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          コピー
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onPin}>
          <Pin className="mr-2 h-4 w-4" />
          固定する
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleBookmark}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          ブックマーク
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFlag}>
          <Flag className={`mr-2 h-4 w-4 ${isFlagged ? 'fill-orange-500 text-orange-500' : ''}`} />
          {isFlagged ? 'フラグを外す' : 'フラグを立てる'}
        </DropdownMenuItem>

        {isOwn && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}