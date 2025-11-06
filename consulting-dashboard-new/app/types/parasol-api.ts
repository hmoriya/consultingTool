// Type definitions for parasol API routes

// File system error type
export interface FileSystemError extends Error {
  code?: string;
  path?: string;
  syscall?: string;
}

// Import types
export interface PageImport {
  id: string;
  name: string;
  displayName: string;
  content?: string;
  serviceId?: string;
  operationId?: string;
  useCaseId?: string;
  layer?: 'global' | 'service' | 'operation' | 'useCase';
  source?: string;
  fields?: PageField[];
  layout?: string;
  components?: string;
  stateManagement?: string;
  validations?: string;
  url?: string;
  order?: number;
}

export interface PageField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: string;
  options?: string[];
}

export interface UseCaseImport {
  id: string;
  name: string;
  displayName: string;
  operationId: string;
  description?: string;
  definition?: string;
  actors?: string;
  preconditions?: string;
  postconditions?: string;
  basicFlow?: string;
  alternativeFlow?: string;
  exceptionFlow?: string;
  apiUsageDefinition?: string;
  order?: number;
  source?: string;
}

export interface DuplicationLocation {
  serviceId?: string;
  operationId?: string;
  useCaseId?: string;
  path?: string;
}

export interface DuplicationResolutionResult {
  canonical: PageImport | UseCaseImport;
  duplicates: (PageImport | UseCaseImport)[];
  resolution: 'merge' | 'newest' | 'oldest' | 'largest';
  layer?: 'global' | 'service' | 'operation' | 'useCase' | 'shared' | 'individual';
}

export interface PageClassifier {
  classify(page: PageImport): 'global' | 'service' | 'operation' | 'useCase';
  determineBestLayer(pages: PageImport[]): 'global' | 'service' | 'operation' | 'useCase';
}

export interface UseCaseClassifier {
  classify(useCase: UseCaseImport): 'shared' | 'individual';
  determineBestLayer(useCases: UseCaseImport[]): 'shared' | 'individual';
}

export interface ImportResult {
  imported: number;
  duplicates: number;
  errors: number;
  resolutions?: DuplicationResolutionResult[];
  errorDetails?: string[];
}

export interface UseCaseLayerClassification {
  shared: UseCaseImport[];
  individual: UseCaseImport[];
}

export interface PageLayerClassification {
  global: PageImport[];
  service: PageImport[];
  operation: PageImport[];
  useCase: PageImport[];
}

// Migration types
export interface MigrationResult {
  action: string;
  file: string;
  status: 'success' | 'skip' | 'error';
  message: string;
}

export interface FileMapping {
  action: 'delete_duplicate' | 'consolidate' | 'merge';
  filePath: string;
  targetPath?: string;
  reason?: string;
}

// Design quality types
export interface DesignQualityIssue {
  type: 'missing_capability' | 'missing_operation' | 'duplicate_function' | 'inconsistent_naming' | 'missing_documentation';
  severity: 'error' | 'warning' | 'info';
  service?: string;
  capability?: string;
  operation?: string;
  details: string;
  suggestion?: string;
}

export interface ConsolidationCandidate {
  functionName: string;
  locations: DuplicationLocation[];
  strategy: string;
  targetPath?: string;
}

// File operation types
export interface FileOperationRequest {
  path: string;
  content?: string;
  type?: 'directory' | 'file';
}

export interface FileOperationResponse {
  success: boolean;
  error?: string;
  path?: string;
  content?: string;
  children?: string[];
}

// Import shared usecase types
export interface SharedUseCaseImportRequest {
  conflictResolution?: 'merge' | 'newest' | 'oldest' | 'largest';
  dryRun?: boolean;
}

export interface SharedUseCaseImportResponse {
  success: boolean;
  result?: ImportResult;
  error?: string;
}