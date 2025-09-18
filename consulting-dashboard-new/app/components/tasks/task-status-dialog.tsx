'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { updateTaskStatus } from '@/actions/tasks'
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2 } from 'lucide-react'

interface TaskStatusDialogProps {
  taskId: string
  currentStatus: string
  isOpen: boolean
  onClose: () => void
}

const statusOptions = [
  { value: 'todo', label: '未着手', icon: Circle, color: 'text-gray-500' },
  { value: 'in_progress', label: '進行中', icon: Clock, color: 'text-blue-500' },
  { value: 'review', label: 'レビュー', icon: Clock, color: 'text-yellow-500' },
  { value: 'completed', label: '完了', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'blocked', label: 'ブロック', icon: AlertCircle, color: 'text-red-500' },
]

export function TaskStatusDialog({ taskId, currentStatus, isOpen, onClose }: TaskStatusDialogProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const [comment, setComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await updateTaskStatus(taskId, selectedStatus, comment)
      router.refresh()
      onClose()
    } catch (error) {
      console.error('Failed to update task status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>タスクステータスを更新</DialogTitle>
          <DialogDescription>
            タスクの現在の進行状況を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            {statusOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedStatus === option.value
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  className="flex items-center justify-start gap-3 h-12"
                  onClick={() => setSelectedStatus(option.value)}
                >
                  <Icon className={`h-4 w-4 ${option.color}`} />
                  {option.label}
                </Button>
              )
            })}
          </div>

          {selectedStatus === 'blocked' && (
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                ブロック理由
              </label>
              <Textarea
                id="comment"
                placeholder="ブロックされている理由を入力してください..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          {selectedStatus === 'completed' && (
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                完了コメント（任意）
              </label>
              <Textarea
                id="comment"
                placeholder="完了時のコメントがあれば入力してください..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}