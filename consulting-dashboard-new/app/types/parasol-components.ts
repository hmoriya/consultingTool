// Type definitions for parasol components

import type {
  ParasolService,
  BusinessCapability,
  BusinessOperation,
  UseCase,
  PageDefinition,
  DomainLanguageDefinition,
  ApiSpecification,
  DbDesign,
  TreeNode,
} from './parasol';

import type {
  ServiceResponse,
  ServiceWithMappedRelations,
  MappedBusinessOperation,
  MappedBusinessCapability,
  MappedUseCase,
} from './parasol-actions';

// Service Form Component Types
export interface ServiceFormProps {
  service?: ServiceWithMappedRelations | null;
  onClose: () => void;
  onSuccess: (service: ServiceResponse) => void;
}

export interface ServiceFormData {
  name: string;
  displayName: string;
  description?: string;
}

// Business Operation Editor Types
export interface BusinessOperationEditorProps {
  operation?: MappedBusinessOperation | null;
  serviceId: string;
  capabilityId?: string;
  onClose: () => void;
  onSuccess: (operation: MappedBusinessOperation) => void;
}

export interface OperationFormData {
  name: string;
  displayName: string;
  pattern: 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';
  goal: string;
}

// Settings Panel Types
export interface SettingsPanelProps {
  service: ServiceWithMappedRelations;
  activeTab?: string;
  onUpdate: (updatedService: ServiceWithMappedRelations) => void;
}

// API Specification Editor Types
export interface APISpecificationEditorProps {
  service: ServiceWithMappedRelations;
  onSave: (apiSpec: ApiSpecification) => Promise<void>;
}

// Unified Design Editor Types
export interface UnifiedDesignEditorProps {
  initialService?: ServiceWithMappedRelations;
  initialTreeData?: TreeNode[];
}

// Parasol File Editor Types
export interface ParasolFileEditorProps {
  service: ServiceWithMappedRelations;
  useCaseId?: string;
  fileType: 'usecase' | 'page' | 'api-usage';
}

// Dashboard Component Types
export interface ProjectOverviewProps {
  projects: ProjectWithDetails[];
}

export interface ProjectWithDetails {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;
  endDate: Date;
  client: {
    name: string;
    industry: string;
  };
  budget: number;
  spent: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  allocation: number;
  avatar?: string;
}

export interface TaskListProps {
  tasks: TaskWithDetails[];
  onTaskUpdate?: (taskId: string, updates: Partial<TaskWithDetails>) => void;
}

export interface TaskWithDetails {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  assignedTo?: TeamMember;
  project?: {
    id: string;
    name: string;
  };
  progress?: number;
  tags?: string[];
}

// Client Component Types
export interface ClientFormData {
  name: string;
  industry: string;
  size?: 'small' | 'medium' | 'large' | 'enterprise';
  description?: string;
  website?: string;
}

export interface ContactFormData {
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  isPrimary?: boolean;
}

// Message Component Types
export interface MessageItemProps {
  message: MessageWithUser;
  currentUserId: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

export interface MessageWithUser {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  createdAt: Date;
  updatedAt?: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
}

// Chart Component Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
}

// Team Component Types
export interface TeamListProps {
  members: TeamMemberWithDetails[];
  onMemberSelect?: (memberId: string) => void;
  showAllocation?: boolean;
}

export interface TeamMemberWithDetails extends TeamMember {
  skills: string[];
  department: string;
  joinDate: Date;
  projects: {
    current: number;
    completed: number;
  };
  performance?: {
    rating: number;
    lastReview: Date;
  };
}

// Common Dialog Props
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface FormDialogProps<T> extends DialogProps {
  data?: T;
  onSubmit: (data: T) => Promise<void>;
}