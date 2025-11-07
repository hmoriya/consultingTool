'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle } from '@/components/ui/alert-dialog'
import { deleteMessage } from '@/actions/messages'
import { toast } from 'sonner'
import { useState } from 'react'

interface DeleteMessageDialogProps {
  messageId: string
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DeleteMessageDialog({
  messageId,
  open,
  onClose,
  onSuccess
}: DeleteMessageDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteMessage(messageId)
      if (result.success) {
        toast.success('メッセージを削除しました')
        onSuccess?.()
        onClose()
      } else {
        toast.error(result.error || 'メッセージの削除に失敗しました')
      }
    } catch {
      toast.error('エラーが発生しました')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>メッセージを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消すことができません。メッセージは完全に削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            キャンセル
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? '削除中...' : '削除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}