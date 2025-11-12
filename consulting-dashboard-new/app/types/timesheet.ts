// 共通のTimesheet型定義

export interface Project {
  id: string
  name: string
  client: { name: string }
  color?: string
}

export interface Task {
  id: string
  title: string
  status: string
}

export interface TimeEntry {
  id: string
  date: Date
  hours: number
  description: string
  billable: boolean
  activityType: string
  status: string
  projectId: string
  taskId?: string
  project?: {
    id: string
    name: string
    client: { name: string }
    color?: string
  }
  task?: {
    id: string
    name: string
  }
}