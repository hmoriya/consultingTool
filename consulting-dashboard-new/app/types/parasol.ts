// パラソルドメイン言語の型定義

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