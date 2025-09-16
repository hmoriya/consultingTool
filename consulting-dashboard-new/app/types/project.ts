import { Organization } from '@prisma/client'

export interface ProjectWithDetails {
  id: string
  name: string
  code: string
  clientId: string
  client: Organization | null
  status: string
  priority: string | null
  startDate: Date
  endDate: Date | null
  budget: number
  description: string | null
  projectMembers: ProjectMemberWithUser[]
  tasks?: Task[]
  milestones?: Milestone[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMemberWithUser {
  id: string
  projectId: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
  }
  role: string
  allocation: number
  startDate: Date
  endDate: Date | null
  achievements: string | null
  responsibilities: string | null
  createdAt: Date
}

export interface Task {
  id: string
  projectId: string
  milestoneId: string | null
  assigneeId: string | null
  title: string
  description: string | null
  status: string
  priority: string
  estimatedHours: number | null
  actualHours: number | null
  startDate: Date | null
  dueDate: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Milestone {
  id: string
  projectId: string
  name: string
  description: string | null
  dueDate: Date
  status: string
  completionRate: number
  actualCompletedDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  name: string
  code: string
  clientId: string
  status?: string
  priority?: string
  startDate: Date
  endDate?: Date
  budget: number
  description?: string
  members?: {
    userId: string
    role: string
    allocation: number
    startDate: Date
    endDate?: Date
  }[]
}

export interface UpdateProjectInput {
  name?: string
  status?: string
  priority?: string
  endDate?: Date
  budget?: number
  description?: string
}