// パラソルドメイン言語の型定義

// 階層構造のノード型（ツリービュー用）
export interface TreeNode {
  id: string;
  name: string;
  displayName: string;
  type: 'service' | 'capability' | 'operation' | 'useCase' | 'robustness' | 'page' | 'pageDefinition' | 'testDefinition' | 'directory' | 'usecaseFile' | 'pageFile' | 'apiUsageFile';
  parentId?: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isSelected?: boolean;
  metadata?: Record<string, any>;
}

// サービス定義（最上位）
export interface ParasolService {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  domainLanguage?: DomainLanguageDefinition;
  apiSpec?: ApiSpecification;
  dbDesign?: DbDesign;
  capabilities?: BusinessCapability[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DomainEntity {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  attributes: DomainAttribute[];
  description?: string;
}

export interface DomainAttribute {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  type: DomainType;
  required: boolean;
  unique?: boolean;
  description?: string;
  validation?: string;
}

export interface ValueObject {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  components: ValueObjectComponent[];
  description?: string;
}

export interface ValueObjectComponent {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  type: DomainType;
  validation?: string;
}

export interface DomainService {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  operations: DomainServiceOperation[];
  description?: string;
}

export interface DomainServiceOperation {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  inputs: OperationParameter[];
  outputs: OperationParameter[];
  description?: string;
}

export interface OperationParameter {
  name: string;
  type: string;
  description?: string;
}

export type DomainType =
  | 'UUID'
  | 'STRING_20'
  | 'STRING_50'
  | 'STRING_100'
  | 'STRING_255'
  | 'TEXT'
  | 'EMAIL'
  | 'PASSWORD_HASH'
  | 'DATE'
  | 'TIMESTAMP'
  | 'DECIMAL'
  | 'INTEGER'
  | 'PERCENTAGE'
  | 'MONEY'
  | 'BOOLEAN'
  | 'ENUM';

export interface DomainLanguageDefinition {
  entities: DomainEntity[];
  valueObjects: ValueObject[];
  domainServices: DomainService[];
  aggregates?: AggregateDefinition[];
  version: string;
  lastModified: string;
}

export interface AggregateDefinition {
  rootEntity: string;
  includedEntities: string[];
  valueObjects: string[];
  invariants: string[];
}

export interface APISpecification {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
  };
}

export interface DBSchema {
  tables: DBTable[];
  relations: DBRelation[];
  indexes: DBIndex[];
}

export interface DBTable {
  name: string;
  columns: DBColumn[];
  primaryKey: string[];
}

export interface DBColumn {
  name: string;
  type: string;
  nullable: boolean;
  unique?: boolean;
  defaultValue?: any;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface DBRelation {
  from: {
    table: string;
    column: string;
  };
  to: {
    table: string;
    column: string;
  };
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface DBIndex {
  table: string;
  columns: string[];
  unique?: boolean;
  type?: 'btree' | 'hash';
}

// ビジネスオペレーションパターン
export type OperationPattern = 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';

export interface BusinessOperationDefinition {
  name: string;
  operationId: string;
  pattern: OperationPattern;
  subPattern?: OperationPattern;
  businessContext: BusinessContext;
  roles: OperationRole[];
  stateSequence: StateSequence;
}

export interface BusinessContext {
  goal: string;
  valueProposition: string;
  targetUsers: string[];
  frequency: 'high' | 'medium' | 'low';
  importance: 'high' | 'medium' | 'low';
  expectedOutcomes: ExpectedOutcome[];
}

export interface ExpectedOutcome {
  type: 'efficiency' | 'cost' | 'quality' | 'satisfaction';
  metric: string;
  target: string;
}

export interface OperationRole {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  type: 'executor' | 'approver' | 'auditor';
  permissions: string[];
  responsibilities: string[];
}

export interface StateSequence {
  initialState: State;
  finalState: State;
  transitions: StateTransition[];
}

export interface State {
  name: string;
  japaneseNotation: string;
  englishNotation: string;
  constantNotation: string;
  description?: string;
  allowedActions: string[];
}

export interface StateTransition {
  from: string;
  to: string;
  event: string;
  condition?: string;
  actions: string[];
}

// ビジネスケーパビリティ
export interface BusinessCapability {
  id: string;
  serviceId: string;
  name: string;
  displayName: string;
  category: 'Core' | 'Supporting' | 'Generic';
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ビジネスオペレーション
export interface BusinessOperation {
  id: string;
  serviceId: string;
  capabilityId: string;
  name: string;
  displayName: string;
  pattern: string;
  goal?: string;
  roles: string[] | string;
  operations: string[] | string;
  businessStates: string[] | string;
  useCases?: UseCase[] | string;
  uiDefinitions?: PageDefinition[] | string;
  testCases?: TestDefinition[] | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ユースケース定義
export interface UseCase {
  id: string;
  operationId: string;
  name: string;
  displayName: string;
  description?: string | null;
  definition?: string | null;
  actors?: string[] | string | null;
  preconditions?: string[] | string | null;
  postconditions?: string[] | string | null;
  basicFlow?: string[] | string | null;
  alternativeFlow?: string[] | string | null;
  exceptionFlow?: string[] | string | null;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ページ定義
export interface PageDefinition {
  id: string;
  operationId?: string;
  useCaseId?: string;
  name: string;
  displayName: string;
  content?: string | null;
  fields?: PageField[] | null;
  layout?: string | null;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ページフィールド定義
export interface PageField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: string;
  options?: string[];
}

// テスト定義
export interface TestDefinition {
  id: string;
  operationId?: string;
  useCaseId?: string;
  name: string;
  displayName: string;
  content?: string | null;
  type?: 'unit' | 'integration' | 'acceptance' | null;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 改善されたAPI仕様型
export interface ApiSpecification {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
  };
}

// 改善されたDB設計型
export interface DbDesign {
  description?: string;
  tables: DbTable[];
  relations: DbRelation[];
}

export interface DbTable {
  name: string;
  displayName: string;
  description?: string;
  columns: DbColumn[];
  indexes?: DbIndex[];
  constraints?: DbConstraint[];
}

export interface DbColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: boolean;
  defaultValue?: any;
  description?: string;
}

export interface DbRelation {
  fromTable: string;
  toTable: string;
  type: string;
  foreignKey: string;
  description?: string;
}

export interface DbIndex {
  name: string;
  columns: string[] | string;
  type: string;
  description?: string;
}

export interface DbConstraint {
  type: string;
  definition: string;
  description?: string;
}

// API route response types
export interface FileMapping {
  action: 'delete_duplicate' | 'consolidate' | 'merge';
  filePath: string;
  targetPath?: string;
  reason?: string;
}

export interface RestructureResult {
  action: string;
  file: string;
  status: 'success' | 'skip' | 'error';
  message: string;
}

// Parser types
export interface ParsedContent {
  content: string;
  metadata?: Record<string, any>;
}

export interface APIEndpoint {
  path: string;
  method: string;
  description?: string;
  parameters?: APIParameter[];
  requestBody?: {
    schema: any;
  };
  responses?: Record<string, {
    schema?: any;
  }>;
}

export interface APIParameter {
  name: string;
  in: 'path' | 'query' | 'header';
  required?: boolean;
  schema: {
    type: string;
    format?: string;
  };
  description?: string;
}

// Domain event types
export interface DomainEvent {
  name: string;
  payload: Record<string, any>;
  aggregateId?: string;
  timestamp?: Date;
}

// Seed data types
export interface SeedService {
  name: string;
  displayName: string;
  description?: string;
  capabilities?: SeedCapability[];
}

export interface SeedCapability {
  name: string;
  displayName: string;
  category: 'Core' | 'Supporting' | 'Generic';
  description?: string;
  businessOperations?: SeedOperation[];
}

export interface SeedOperation {
  name: string;
  displayName: string;
  pattern: string;
  goal?: string;
  roles?: string[];
  operations?: string[];
  businessStates?: string[];
}

// Service with relations
export interface ServiceWithRelations extends ParasolService {
  capabilities?: BusinessCapabilityWithRelations[];
  businessOperations?: BusinessOperationWithRelations[];
}

export interface BusinessCapabilityWithRelations extends BusinessCapability {
  service?: ParasolService;
  businessOperations?: BusinessOperationWithRelations[];
}

export interface BusinessOperationWithRelations extends BusinessOperation {
  service?: ParasolService;
  capability?: BusinessCapability;
  useCaseModels?: UseCase[];
  pageDefinitions?: PageDefinition[];
  testDefinitions?: TestDefinition[];
}