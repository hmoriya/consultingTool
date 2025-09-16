export interface ResourceAllocation {
  id: string
  userId: string
  projectId: string
  allocationRate: number
  startDate: Date
  endDate: Date | null
  actualRate: number | null
  role: string
  billableRate: number | null
  cost: number | null
  status: string
  approvedBy: string | null
  approvedAt: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SkillWithLevel {
  id: string
  name: string
  categoryId: string
  category: {
    id: string
    name: string
    order: number
  }
  description: string | null
  userLevel: number
  experienceYears: number | null
  lastUsedDate: Date | null
}

export interface TeamWithMembers {
  id: string
  name: string
  description: string | null
  leaderId: string | null
  parentTeamId: string | null
  isActive: boolean
  members: TeamMemberWithUser[]
  childTeams?: TeamWithMembers[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMemberWithUser {
  id: string
  teamId: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
  }
  role: string
  startDate: Date
  endDate: Date | null
  createdAt: Date
}

export interface CapacityPlan {
  teamId: string
  totalMembers: number
  totalAvailableCapacity: number
  memberCapacities: {
    userId: string
    availableCapacity: number
    allocations: ResourceAllocation[]
  }[]
}

export interface SkillGap {
  skillId: string
  requiredLevel: number
  availableCount: number
  averageLevel: number
  gap: number
}