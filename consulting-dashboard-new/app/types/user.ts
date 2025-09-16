import { User, Role, Organization, Permission } from '@prisma/client'

export interface UserWithRole extends User {
  role: Role
}

export interface UserProfile extends User {
  role: Role & {
    permissions: {
      permission: Permission
    }[]
  }
  organization: Organization
  skills: {
    id: string
    name: string
    categoryId: string
    category: {
      id: string
      name: string
      order: number
    }
    level: number
    experienceYears: number | null
  }[]
  teams: {
    id: string
    name: string
    description: string | null
  }[]
  currentProjects: {
    id: string
    name: string
    code: string
    status: string
    role: string
    allocation: number
  }[]
  permissions: Permission[]
}

export interface UserUtilizationSummary {
  currentAllocation: number
  availableCapacity: number
  activeProjects: number
  assignedTasks: number
  urgentTasks: number
}