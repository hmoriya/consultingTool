'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TaskStatusDialog } from './task-status-dialog'

interface TaskActionsProps {
  taskId: string
  taskStatus: string
}

export function TaskActions({ taskId, taskStatus }: TaskActionsProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => setIsStatusDialogOpen(true)}
          disabled={taskStatus === 'completed'}
        >
          ステータスを更新
        </Button>
        <Button disabled={taskStatus === 'completed'}>
          工数を記録
        </Button>
      </div>

      <TaskStatusDialog
        taskId={taskId}
        currentStatus={taskStatus}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
      />
    </>
  )
}