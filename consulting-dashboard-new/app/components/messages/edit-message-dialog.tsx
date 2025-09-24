'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateMessage } from '@/actions/messages'
import { toast } from 'sonner'

interface EditMessageDialogProps {
  messageId: string
  initialContent: string
  open: boolean
  onClose: () => void
  onSuccess?: (newContent: string) => void
}

export function EditMessageDialog({
  messageId,
  initialContent,
  open,
  onClose,
  onSuccess
}: EditMessageDialogProps) {
  const [content, setContent] = useState(initialContent)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('メッセージを入力してください')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateMessage(messageId, content.trim())
      if (result.success) {
        toast.success('メッセージを編集しました')
        onSuccess?.(content.trim())
        onClose()
      } else {
        toast.error(result.error || 'メッセージの編集に失敗しました')
      }
    } catch (error) {
      toast.error('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>メッセージを編集</DialogTitle>
          <DialogDescription>
            メッセージを編集できます。編集後は「編集済み」と表示されます。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
            placeholder="メッセージを入力..."
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? '保存中...' : '保存'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}