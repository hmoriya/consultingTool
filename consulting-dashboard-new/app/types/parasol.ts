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
  useCases?: any[] | string;
  uiDefinitions?: any[] | string;
  testCases?: any[] | string;
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