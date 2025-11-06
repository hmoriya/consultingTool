// Type definitions for seed data

// User types for seeding
export interface SeedUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  department?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeedUserWithDetails extends SeedUser {
  pmUser?: SeedUser;
  consultantUser?: SeedUser;
  execUser?: SeedUser;
  allUsers?: SeedUser[];
}

// Organization types
export interface SeedOrganization {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Project types for seeding
export interface SeedProject {
  id: string;
  name: string;
  code: string;
  clientId?: string;
  organizationId?: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  budget?: number;
  projectMembers?: SeedProjectMember[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SeedProjectMember {
  userId: string;
  projectId: string;
  role: 'pm' | 'lead' | 'member' | 'advisor';
  allocation: number;
  startDate: Date;
  endDate?: Date;
}

// Skill types
export interface SeedSkill {
  id: string;
  name: string;
  category: string;
  level?: number;
  description?: string;
}

// Timesheet types
export interface SeedTimesheet {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  totalHours: number;
  entries?: SeedTimesheetEntry[];
  approvedBy?: string;
  approvedAt?: Date;
}

export interface SeedTimesheetEntry {
  projectId: string;
  taskId?: string;
  date: Date;
  hours: number;
  description?: string;
  billable: boolean;
  category: string;
}

// Knowledge types
export interface SeedKnowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedAt?: Date;
  views?: number;
  helpful?: number;
}

// Notification types
export interface SeedNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// Parasol seed types
export interface SeedService {
  name: string;
  displayName: string;
  description?: string;
  domainLanguage: Record<string, any>;
  apiSpecification: Record<string, any>;
  dbSchema: Record<string, any>;
}

export interface SeedCapability {
  name: string;
  displayName: string;
  category: 'Core' | 'Supporting' | 'Generic';
  description?: string;
}

export interface SeedOperation {
  name: string;
  displayName: string;
  pattern: string;
  goal: string;
  roles: string[];
  operations: string[];
  businessStates: string[];
  useCases: string[];
  uiDefinitions: any[];
  testCases: any[];
}

// Function parameter types
export interface ResourceSeedParams {
  users?: SeedUserWithDetails;
  skills?: SeedSkill[];
}

export interface TimesheetSeedParams {
  users?: SeedUserWithDetails;
  projects?: SeedProject[];
}

export interface NotificationSeedParams {
  users?: SeedUserWithDetails;
  projects?: SeedProject[];
}

export interface ProjectSeedParams {
  users?: SeedUser[];
  organizations?: SeedOrganization;
}