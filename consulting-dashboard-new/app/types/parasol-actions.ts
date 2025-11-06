// Type definitions for parasol action parameters and responses

import type {
  BusinessOperation,
  BusinessCapability,
  UseCase,
  PageDefinition,
  ParasolService,
  DomainLanguageDefinition,
  ApiSpecification,
  DbDesign,
  OperationPattern,
} from './parasol';

// Service action types
export interface CreateServiceData {
  name: string;
  displayName: string;
  description?: string;
  domainLanguage: DomainLanguageDefinition;
  apiSpecification: ApiSpecification;
  dbSchema: DbDesign;
}

export interface UpdateServiceData extends CreateServiceData {}

export interface SaveServiceData {
  domainLanguage?: DomainLanguageDefinition;
  apiSpecification?: ApiSpecification;
  dbSchema?: DbDesign;
  serviceDescription?: string;
  domainLanguageDefinition?: string;
  apiSpecificationDefinition?: string;
  databaseDesignDefinition?: string;
}

// Business operation action types
export interface BusinessOperationRole {
  name: string;
  type: 'executor' | 'approver' | 'auditor';
  permissions: string[];
  responsibilities: string[];
}

export interface BusinessOperationState {
  name: string;
  description?: string;
  allowedActions: string[];
}

export interface CreateBusinessOperationData {
  serviceId: string;
  capabilityId?: string;
  name: string;
  displayName: string;
  pattern: OperationPattern;
  goal: string;
  roles: BusinessOperationRole[];
  operations: string[];
  businessStates: BusinessOperationState[];
  useCases: string[];
  uiDefinitions: PageDefinition[];
  testCases: string[];
  robustnessModel?: RobustnessModel;
}

export interface UpdateBusinessOperationData extends CreateBusinessOperationData {}

// Business capability action types
export interface CreateBusinessCapabilityData {
  serviceId: string;
  name: string;
  displayName: string;
  description?: string;
  category: 'Core' | 'Supporting' | 'Generic';
}

export interface UpdateBusinessCapabilityData {
  name: string;
  displayName: string;
  description?: string;
  category: 'Core' | 'Supporting' | 'Generic';
}

// UseCase action types
export interface UseCaseActor {
  name: string;
  type: 'primary' | 'secondary' | 'system';
  description?: string;
}

export interface UseCaseFlow {
  step: number;
  description: string;
  actor?: string;
  system?: string;
  alternativeCondition?: string;
}

export interface CreateUseCaseData {
  operationId: string;
  name: string;
  displayName: string;
  description?: string;
  definition?: string;
  order?: number;
  actors?: UseCaseActor[];
  preconditions?: string[];
  postconditions?: string[];
  basicFlow?: UseCaseFlow[];
  alternativeFlow?: UseCaseFlow[];
  exceptionFlow?: UseCaseFlow[];
}

export interface UpdateUseCaseData {
  name?: string;
  displayName?: string;
  description?: string;
  definition?: string;
  order?: number;
  actors?: UseCaseActor[];
  preconditions?: string[];
  postconditions?: string[];
  basicFlow?: UseCaseFlow[];
  alternativeFlow?: UseCaseFlow[];
  exceptionFlow?: UseCaseFlow[];
}

// Robustness diagram types
export interface RobustnessObject {
  id: string;
  name: string;
  type: 'boundary' | 'control' | 'entity';
  description?: string;
}

export interface RobustnessInteraction {
  from: string;
  to: string;
  type: 'uses' | 'creates' | 'reads' | 'updates' | 'deletes';
  description?: string;
}

export interface RobustnessModel {
  boundaryObjects: RobustnessObject[];
  controlObjects: RobustnessObject[];
  entityObjects: RobustnessObject[];
  interactions: RobustnessInteraction[];
}

export interface CreateRobustnessDiagramData {
  useCaseId: string;
  content: string;
  boundaryObjects?: RobustnessObject[];
  controlObjects?: RobustnessObject[];
  entityObjects?: RobustnessObject[];
  diagram?: string;
  interactions?: RobustnessInteraction[];
}

export interface UpdateRobustnessDiagramData {
  content?: string;
  boundaryObjects?: RobustnessObject[];
  controlObjects?: RobustnessObject[];
  entityObjects?: RobustnessObject[];
  diagram?: string;
  interactions?: RobustnessInteraction[];
}

// Common response types
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ServiceResponse extends ParasolService {
  domainLanguage: DomainLanguageDefinition;
  apiSpecification: ApiSpecification;
  dbSchema: DbDesign;
  businessOperations: MappedBusinessOperation[];
}

export interface MappedBusinessOperation extends Omit<BusinessOperation, 'roles' | 'operations' | 'businessStates' | 'useCases' | 'uiDefinitions' | 'testCases'> {
  roles: BusinessOperationRole[];
  operations: string[];
  businessStates: BusinessOperationState[];
  useCases: string[];
  uiDefinitions: PageDefinition[];
  testCases: string[];
  robustnessModel: RobustnessModel | null;
  useCaseModels: MappedUseCase[];
}

export interface MappedUseCase extends Omit<UseCase, 'actors' | 'preconditions' | 'postconditions' | 'basicFlow' | 'alternativeFlow' | 'exceptionFlow'> {
  actors: UseCaseActor[] | null;
  preconditions: string[] | null;
  postconditions: string[] | null;
  basicFlow: UseCaseFlow[] | null;
  alternativeFlow: UseCaseFlow[] | null;
  exceptionFlow: UseCaseFlow[] | null;
  pageDefinitions: PageDefinition[];
  apiUsageDefinition: string;
  robustnessDiagram?: MappedRobustnessDiagram;
}

export interface MappedRobustnessDiagram {
  id: string;
  content: string;
  boundaryObjects: RobustnessObject[] | null;
  controlObjects: RobustnessObject[] | null;
  entityObjects: RobustnessObject[] | null;
  interactions: RobustnessInteraction[] | null;
  diagram?: string;
}

export interface MappedBusinessCapability extends BusinessCapability {
  businessOperations: MappedBusinessOperation[];
}

export interface ServiceWithMappedRelations extends ServiceResponse {
  capabilities: MappedBusinessCapability[];
  apiSpecificationDefinition: string;
  databaseDesignDefinition: string;
  integrationSpecificationDefinition: string;
}

// Database update types
export interface ServiceUpdateData {
  domainLanguage?: string;
  apiSpecification?: string;
  dbSchema?: string;
  serviceDescription?: string;
  domainLanguageDefinition?: string;
  apiSpecificationDefinition?: string;
  databaseDesignDefinition?: string;
}

export interface UseCaseUpdateData {
  name?: string;
  displayName?: string;
  description?: string;
  definition?: string;
  order?: number;
  actors?: string;
  preconditions?: string;
  postconditions?: string;
  basicFlow?: string;
  alternativeFlow?: string;
  exceptionFlow?: string;
}

export interface RobustnessDiagramUpdateData {
  content?: string;
  diagram?: string;
  boundaryObjects?: string;
  controlObjects?: string;
  entityObjects?: string;
  interactions?: string;
}