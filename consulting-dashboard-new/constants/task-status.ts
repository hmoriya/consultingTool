// Task status constants
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed'
} as const

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]

// Helper function to ensure type safety
export function ensureTaskStatus(status: string): TaskStatus {
  if (Object.values(TASK_STATUS).includes(status as TaskStatus)) {
    return status as TaskStatus
  }
  throw new Error(`Invalid task status: ${status}`)
}

// Type guard
export function isValidTaskStatus(status: string): status is TaskStatus {
  return Object.values(TASK_STATUS).includes(status as TaskStatus)
}