/**
 * パラソルコード生成サービス
 * ケーパビリティ・サービス単位でコードを生成
 */

import { 
  GenerationConfig, 
  GenerationScope,
  GenerationTarget,
  filterCapabilitiesByScope,
  validateGenerationConfig
} from './generation-config';
import { 
  BusinessCapability, 
  BusinessOperation,
  DomainLanguageDefinition,
  ApiSpecification,
  DbDesign
} from '@/types/parasol';
import { inferEntities, InferredEntity } from './entity-inference';

export interface GenerationResult {
  success: boolean;
  generatedFiles: GeneratedFile[];
  errors: string[];
  warnings: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'domain' | 'api' | 'db' | 'test' | 'doc';
}

/**
 * メインの生成関数
 */
export async function generateCode(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GenerationResult> {
  // 設定の検証
  const validation = validateGenerationConfig(config);
  if (!validation.isValid) {
    return {
      success: false,
      generatedFiles: [],
      errors: validation.errors,
      warnings: []
    };
  }
  
  const generatedFiles: GeneratedFile[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // スコープに基づいてケーパビリティをフィルタリング
    const targetCapabilities = filterCapabilitiesByScope(capabilities, config);
    
    if (targetCapabilities.length === 0) {
      errors.push('生成対象のケーパビリティが見つかりません');
      return { success: false, generatedFiles, errors, warnings };
    }
    
    // ターゲットに基づいて生成
    if (config.target === 'domain' || config.target === 'all') {
      const domainFiles = await generateDomainCode(targetCapabilities, operations, config);
      generatedFiles.push(...domainFiles);
    }
    
    if (config.target === 'api' || config.target === 'all') {
      const apiFiles = await generateApiCode(targetCapabilities, operations, config);
      generatedFiles.push(...apiFiles);
    }
    
    if (config.target === 'db' || config.target === 'all') {
      const dbFiles = await generateDbCode(targetCapabilities, operations, config);
      generatedFiles.push(...dbFiles);
    }
    
    // テスト生成
    if (config.options.generateTests) {
      const testFiles = await generateTests(targetCapabilities, operations, config);
      generatedFiles.push(...testFiles);
    }
    
    // ドキュメント生成
    if (config.options.generateDocs) {
      const docFiles = await generateDocs(targetCapabilities, operations, config);
      generatedFiles.push(...docFiles);
    }
    
    return {
      success: true,
      generatedFiles,
      errors,
      warnings
    };
    
  } catch (_error) {
    errors.push(`生成中にエラーが発生しました: ${error}`);
    return { success: false, generatedFiles, errors, warnings };
  }
}

/**
 * ドメインコードの生成
 */
async function generateDomainCode(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  for (const capability of capabilities) {
    const capOperations = operations.filter(op => op.capabilityId === capability.id);
    
    // エンティティの生成
    const entityCode = generateEntity(capability, capOperations, config);
    files.push({
      path: `domain/${capability.name}/entities/${capability.name}.ts`,
      content: entityCode,
      type: 'domain'
    });
    
    // 値オブジェクトの生成
    if (config.options.domain?.includeValueObjects) {
      const valueObjects = generateValueObjects(capability, capOperations);
      files.push(...valueObjects);
    }
    
    // ドメインサービスの生成
    if (config.options.domain?.includeDomainServices) {
      const domainService = generateDomainService(capability, capOperations);
      files.push({
        path: `domain/${capability.name}/services/${capability.name}Service.ts`,
        content: domainService,
        type: 'domain'
      });
    }
    
    // リポジトリインターフェースの生成
    if (config.options.domain?.includeRepositories) {
      const repository = generateRepository(capability);
      files.push({
        path: `domain/${capability.name}/repositories/${capability.name}Repository.ts`,
        content: repository,
        type: 'domain'
      });
    }
    
    // ドメインイベントの生成
    if (config.options.domain?.includeEvents) {
      const events = generateDomainEvents(capability, capOperations);
      files.push(...events);
    }
  }
  
  return files;
}

/**
 * エンティティコードの生成（改善版）
 */
function generateEntity(
  capability: BusinessCapability,
  operations: BusinessOperation[],
  config: GenerationConfig
): string {
  // エンティティ推論エンジンを使用
  const inferredEntities = inferEntities([capability], operations);
  const primaryEntity = inferredEntities.find(e => e.name === capability.name) || inferredEntities[0];
  
  if (!primaryEntity) {
    // フォールバック：従来の方法
    return generateEntityFallback(capability, operations, config);
  }
  
  let code = `/**
 * ${primaryEntity.displayName}エンティティ
 * ${capability.description || ''}
 * 
 * 推論信頼度: ${(primaryEntity.confidence * 100).toFixed(0)}%
 * @generated by Parasol with Entity Inference Engine
 */

export interface ${primaryEntity.name} {
`;
  
  // 推論されたプロパティを追加
  if (primaryEntity.suggestedProperties) {
    primaryEntity.suggestedProperties.forEach(prop => {
      const optional = prop.required ? '' : '?';
      code += `  ${prop.name}${optional}: ${mapTypeToTSType(prop.type)};\n`;
    });
  }
  
  code += `}

/**
 * ${primaryEntity.displayName}の集約ルート
 */
export class ${primaryEntity.name}Aggregate implements ${primaryEntity.name} {
`;
  
  // コンストラクタ引数を生成
  const constructorArgs: string[] = [];
  if (primaryEntity.suggestedProperties) {
    primaryEntity.suggestedProperties.forEach(prop => {
      const optional = prop.required ? '' : '?';
      const modifier = ['id', 'createdAt', 'updatedAt'].includes(prop.name) ? 'readonly ' : '';
      constructorArgs.push(`    public ${modifier}${prop.name}${optional}: ${mapTypeToTSType(prop.type)}`);
    });
  }
  
  code += `  constructor(
${constructorArgs.join(',\n')}
  ) {}
  
  // ビジネスメソッド
`;
  
  // オペレーションからビジネスメソッドを生成
  operations.forEach(op => {
    const methodName = op.name.replace(capability.name, '');
    code += `
  /**
   * ${op.displayName}
   * ${op.goal || ''}
   */
  ${methodName}(): void {
    // TODO: ビジネスロジックを実装
    this.updatedAt = new Date();
  }
`;
  });
  
  code += `}
`;
  
  // ステータス列挙型（ENUMプロパティがある場合）
  const statusProp = primaryEntity.suggestedProperties?.find(p => p.name === 'status' && p.type === 'ENUM');
  if (statusProp) {
    code += `
/**
 * ${primaryEntity.displayName}のステータス
 */
export enum ${primaryEntity.name}Status {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Completed = 'completed'
}
`;
  }
  
  // 関連エンティティがある場合は型定義を追加
  if (primaryEntity.relatedEntities && primaryEntity.relatedEntities.length > 0) {
    code += `
/**
 * 関連エンティティ
 */
`;
    primaryEntity.relatedEntities.forEach(entityName => {
      code += `// TODO: ${entityName}エンティティを定義\n`;
    });
  }
  
  return code;
}

/**
 * フォールバック：従来のエンティティ生成方法
 */
function generateEntityFallback(
  capability: BusinessCapability,
  operations: BusinessOperation[],
  config: GenerationConfig
): string {
  const hasWorkflow = operations.some(op => op.pattern === 'Workflow');
  const hasCRUD = operations.some(op => op.pattern === 'CRUD');
  
  let code = `/**
 * ${capability.displayName}エンティティ
 * ${capability.description || ''}
 * 
 * @generated by Parasol (Fallback Mode)
 */

export interface ${capability.name} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
`;
  
  if (hasWorkflow) {
    code += `  status: ${capability.name}Status;\n`;
    code += `  approvedBy?: string;\n`;
    code += `  approvedAt?: Date;\n`;
  }
  
  if (hasCRUD) {
    code += `  name: string;\n`;
    code += `  description?: string;\n`;
    code += `  isActive: boolean;\n`;
  }
  
  code += `}

export class ${capability.name}Aggregate implements ${capability.name} {
  constructor(
    public readonly id: string,
    public createdAt: Date,
    public updatedAt: Date,
`;
  
  if (hasWorkflow) {
    code += `    public status: ${capability.name}Status,\n`;
  }
  
  if (hasCRUD) {
    code += `    public name: string,\n`;
    code += `    public description?: string,\n`;
    code += `    public isActive: boolean = true,\n`;
  }
  
  code += `  ) {}
}
`;
  
  if (hasWorkflow) {
    code += `
export enum ${capability.name}Status {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  Completed = 'completed'
}
`;
  }
  
  return code;
}

/**
 * ドメインタイプをTypeScriptの型にマッピング
 */
function mapTypeToTSType(domainType: string): string {
  const typeMap: Record<string, string> = {
    'UUID': 'string',
    'STRING_20': 'string',
    'STRING_50': 'string',
    'STRING_100': 'string',
    'STRING_255': 'string',
    'STRING_3': 'string',
    'TEXT': 'string',
    'EMAIL': 'string',
    'PASSWORD_HASH': 'string',
    'DATE': 'Date',
    'TIMESTAMP': 'Date',
    'DECIMAL': 'number',
    'INTEGER': 'number',
    'PERCENTAGE': 'number',
    'MONEY': 'number',
    'BOOLEAN': 'boolean',
    'ENUM': 'string',
    'JSON': 'any'
  };
  
  return typeMap[domainType] || 'any';
}

/**
 * 値オブジェクトの生成
 */
function generateValueObjects(
  capability: BusinessCapability,
  operations: BusinessOperation[]
): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // 基本的な値オブジェクト
  const basicValueObjects = [
    {
      name: `${capability.name}Id`,
      displayName: `${capability.displayName}ID`,
      type: 'string'
    },
    {
      name: `${capability.name}Name`,
      displayName: `${capability.displayName}名`,
      type: 'string',
      validation: 'maxLength: 255'
    }
  ];
  
  basicValueObjects.forEach(vo => {
    const code = `/**
 * ${vo.displayName}値オブジェクト
 * 
 * @generated by Parasol
 */
export class ${vo.name} {
  constructor(
    public readonly value: ${vo.type}
  ) {
    this.validate();
  }
  
  private validate(): void {
    if (!this.value) {
      throw new Error('${vo.displayName}は必須です');
    }
    ${vo.validation ? `// ${vo.validation}` : ''}
  }
  
  equals(other: ${vo.name}): boolean {
    return this.value === other.value;
  }
  
  toString(): string {
    return this.value${vo.type === 'string' ? '' : '.toString()'};
  }
}
`;
    
    files.push({
      path: `domain/${capability.name}/value-objects/${vo.name}.ts`,
      content: code,
      type: 'domain'
    });
  });
  
  return files;
}

/**
 * ドメインサービスの生成
 */
function generateDomainService(
  capability: BusinessCapability,
  operations: BusinessOperation[]
): string {
  let code = `/**
 * ${capability.displayName}ドメインサービス
 * ${capability.description || ''}
 * 
 * @generated by Parasol
 */

import { ${capability.name} } from '../entities/${capability.name}';
import { ${capability.name}Repository } from '../repositories/${capability.name}Repository';

export class ${capability.name}Service {
  constructor(
    private readonly repository: ${capability.name}Repository
  ) {}
`;
  
  // オペレーションごとにメソッドを生成
  operations.forEach(op => {
    const methodName = op.name.charAt(0).toLowerCase() + op.name.slice(1);
    code += `
  /**
   * ${op.displayName}
   * ${op.goal || ''}
   */
  async ${methodName}(params: unknown): Promise<void> {
    // TODO: ビジネスロジックを実装
    throw new Error('Not implemented');
  }
`;
  });
  
  code += `}
`;
  
  return code;
}

/**
 * リポジトリインターフェースの生成
 */
function generateRepository(capability: BusinessCapability): string {
  return `/**
 * ${capability.displayName}リポジトリインターフェース
 * 
 * @generated by Parasol
 */

import { ${capability.name} } from '../entities/${capability.name}';

export interface ${capability.name}Repository {
  findById(id: string): Promise<${capability.name} | null>;
  findAll(): Promise<${capability.name}[]>;
  save(entity: ${capability.name}): Promise<void>;
  delete(id: string): Promise<void>;
  
  // カスタムクエリメソッド
  findByStatus?(status: string): Promise<${capability.name}[]>;
  findByName?(name: string): Promise<${capability.name} | null>;
}
`;
}

/**
 * ドメインイベントの生成
 */
function generateDomainEvents(
  capability: BusinessCapability,
  operations: BusinessOperation[]
): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const events: string[] = [];
  
  // オペレーションからイベントを推論
  operations.forEach(op => {
    if (op.pattern === 'CRUD' && op.name.includes('create')) {
      events.push(`${capability.name}Created`);
    }
    if (op.pattern === 'Workflow' && op.name.includes('approve')) {
      events.push(`${capability.name}Approved`);
    }
    if (op.name.includes('update')) {
      events.push(`${capability.name}Updated`);
    }
    if (op.name.includes('delete')) {
      events.push(`${capability.name}Deleted`);
    }
  });
  
  // イベントファイルの生成
  events.forEach(eventName => {
    const code = `/**
 * ${eventName}イベント
 * 
 * @generated by Parasol
 */

export interface ${eventName} {
  eventId: string;
  aggregateId: string;
  occurredAt: Date;
  payload: {
    // TODO: イベントペイロードを定義
  };
}

export class ${eventName}Event implements ${eventName} {
  constructor(
    public readonly eventId: string,
    public readonly aggregateId: string,
    public readonly occurredAt: Date,
    public readonly payload: unknown
  ) {}
}
`;
    
    files.push({
      path: `domain/${capability.name}/events/${eventName}.ts`,
      content: code,
      type: 'domain'
    });
  });
  
  return files;
}

/**
 * API仕様の生成
 */
async function generateApiCode(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  // OpenAPI仕様の生成
  const openApiSpec = generateOpenApiSpec(capabilities, operations, config);
  files.push({
    path: 'api/openapi.yaml',
    content: openApiSpec,
    type: 'api'
  });
  
  // 各ケーパビリティのAPIハンドラー生成
  for (const capability of capabilities) {
    const capOperations = operations.filter(op => op.capabilityId === capability.id);
    const apiHandler = generateApiHandler(capability, capOperations);
    files.push({
      path: `api/${capability.name}/${capability.name}Handler.ts`,
      content: apiHandler,
      type: 'api'
    });
  }
  
  return files;
}

/**
 * OpenAPI仕様の生成
 */
function generateOpenApiSpec(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): string {
  const spec: unknown = {
    openapi: '3.0.0',
    info: {
      title: 'Generated API',
      version: '1.0.0',
      description: 'Parasol generated API specification'
    },
    paths: {}
  };
  
  // 各ケーパビリティのパスを生成
  capabilities.forEach(capability => {
    const basePath = `/api/${capability.name.toLowerCase()}`;
    const capOperations = operations.filter(op => op.capabilityId === capability.id);
    
    // CRUD操作のパス
    if (capOperations.some(op => op.pattern === 'CRUD')) {
      spec.paths[basePath] = {
        get: {
          summary: `List ${capability.displayName}`,
          operationId: `list${capability.name}`,
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: `#/components/schemas/${capability.name}` }
                  }
                }
              }
            }
          }
        },
        post: {
          summary: `Create ${capability.displayName}`,
          operationId: `create${capability.name}`,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: `#/components/schemas/Create${capability.name}Request` }
              }
            }
          },
          responses: {
            '201': {
              description: 'Created',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${capability.name}` }
                }
              }
            }
          }
        }
      };
      
      spec.paths[`${basePath}/{id}`] = {
        get: {
          summary: `Get ${capability.displayName} by ID`,
          operationId: `get${capability.name}ById`,
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': {
              description: 'Success',
              content: {
                'application/json': {
                  schema: { $ref: `#/components/schemas/${capability.name}` }
                }
              }
            }
          }
        }
      };
    }
  });
  
  // YAMLに変換
  return JSON.stringify(spec, null, 2); // TODO: 実際のYAML変換を実装
}

/**
 * APIハンドラーの生成
 */
function generateApiHandler(
  capability: BusinessCapability,
  operations: BusinessOperation[]
): string {
  return `/**
 * ${capability.displayName} APIハンドラー
 * 
 * @generated by Parasol
 */

import { NextRequest, NextResponse } from 'next/server';
import { ${capability.name}Service } from '@/domain/${capability.name}/services/${capability.name}Service';

const service = new ${capability.name}Service();

export async function GET(request: NextRequest) {
  try {
    // TODO: 実装
    return NextResponse.json({ message: 'Not implemented' });
  } catch (_error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: 実装
    return NextResponse.json({ message: 'Not implemented' }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
`;
}

/**
 * データベースコードの生成
 */
async function generateDbCode(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  // Prismaスキーマの生成
  const prismaSchema = generatePrismaSchema(capabilities, operations, config);
  files.push({
    path: 'prisma/generated/schema.prisma',
    content: prismaSchema,
    type: 'db'
  });
  
  // マイグレーションSQL生成
  if (config.options.db?.databaseType === 'postgresql') {
    const migrationSql = generateMigrationSql(capabilities, operations);
    files.push({
      path: 'migrations/001_initial.sql',
      content: migrationSql,
      type: 'db'
    });
  }
  
  return files;
}

/**
 * Prismaスキーマの生成（改善版）
 */
function generatePrismaSchema(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): string {
  // エンティティ推論エンジンを使用
  const inferredEntities = inferEntities(capabilities, operations);
  
  let schema = `// Generated by Parasol with Entity Inference Engine
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${config.options.db?.databaseType || 'sqlite'}"
  url      = env("DATABASE_URL")
}

`;
  
  // 推論されたエンティティごとにモデルを生成
  inferredEntities.forEach(entity => {
    schema += `// 推論信頼度: ${(entity.confidence * 100).toFixed(0)}%\n`;
    schema += `model ${entity.name} {\n`;
    
    if (entity.suggestedProperties) {
      entity.suggestedProperties.forEach(prop => {
        const dbType = mapTypeToPrismaType(prop.type, config.options.db?.databaseType || 'sqlite');
        const nullable = prop.required ? '' : '?';
        
        schema += `  ${prop.name}  ${dbType}${nullable}`;
        
        // 特別な属性の追加
        if (prop.name === 'id') {
          schema += ` @id @default(uuid())`;
        } else if (prop.name === 'createdAt') {
          schema += ` @default(now())`;
        } else if (prop.name === 'updatedAt') {
          schema += ` @updatedAt`;
        } else if (prop.type === 'ENUM') {
          schema += ` @default("draft")`;
        } else if (prop.type === 'BOOLEAN' && prop.name === 'isActive') {
          schema += ` @default(true)`;
        }
        
        schema += '\n';
      });
    }
    
    // インデックスの生成
    if (config.options.db?.includeIndexes) {
      schema += '\n';
      
      // 基本インデックス
      schema += `  @@index([createdAt])\n`;
      
      // ステータスフィールドがある場合
      const hasStatus = entity.suggestedProperties?.some(p => p.name === 'status');
      if (hasStatus) {
        schema += `  @@index([status])\n`;
      }
      
      // 外部キーフィールドのインデックス
      entity.suggestedProperties?.forEach(prop => {
        if (prop.name.endsWith('Id') && prop.name !== 'id') {
          schema += `  @@index([${prop.name}])\n`;
        }
      });
    }
    
    schema += `}\n\n`;
  });
  
  // 関連エンティティ間のリレーションを生成
  if (config.options.db?.includeConstraints) {
    schema += generateRelations(inferredEntities);
  }
  
  return schema;
}

/**
 * ドメインタイプをPrismaタイプにマッピング
 */
function mapTypeToPrismaType(domainType: string, dbType: string): string {
  const typeMap: Record<string, Record<string, string>> = {
    sqlite: {
      'UUID': 'String',
      'STRING_20': 'String',
      'STRING_50': 'String',
      'STRING_100': 'String',
      'STRING_255': 'String',
      'STRING_3': 'String',
      'TEXT': 'String',
      'EMAIL': 'String',
      'PASSWORD_HASH': 'String',
      'DATE': 'DateTime',
      'TIMESTAMP': 'DateTime',
      'DECIMAL': 'Float',
      'INTEGER': 'Int',
      'PERCENTAGE': 'Float',
      'MONEY': 'Float',
      'BOOLEAN': 'Boolean',
      'ENUM': 'String',
      'JSON': 'Json'
    },
    postgresql: {
      'UUID': 'String @db.Uuid',
      'STRING_20': 'String @db.VarChar(20)',
      'STRING_50': 'String @db.VarChar(50)',
      'STRING_100': 'String @db.VarChar(100)',
      'STRING_255': 'String @db.VarChar(255)',
      'STRING_3': 'String @db.VarChar(3)',
      'TEXT': 'String @db.Text',
      'EMAIL': 'String @db.VarChar(255)',
      'PASSWORD_HASH': 'String @db.VarChar(255)',
      'DATE': 'DateTime @db.Date',
      'TIMESTAMP': 'DateTime @db.Timestamp',
      'DECIMAL': 'Decimal @db.Decimal(10, 2)',
      'INTEGER': 'Int',
      'PERCENTAGE': 'Float',
      'MONEY': 'Decimal @db.Money',
      'BOOLEAN': 'Boolean',
      'ENUM': 'String',
      'JSON': 'Json @db.JsonB'
    },
    mysql: {
      'UUID': 'String @db.VarChar(36)',
      'STRING_20': 'String @db.VarChar(20)',
      'STRING_50': 'String @db.VarChar(50)',
      'STRING_100': 'String @db.VarChar(100)',
      'STRING_255': 'String @db.VarChar(255)',
      'STRING_3': 'String @db.VarChar(3)',
      'TEXT': 'String @db.Text',
      'EMAIL': 'String @db.VarChar(255)',
      'PASSWORD_HASH': 'String @db.VarChar(255)',
      'DATE': 'DateTime @db.Date',
      'TIMESTAMP': 'DateTime @db.Timestamp(3)',
      'DECIMAL': 'Decimal @db.Decimal(10, 2)',
      'INTEGER': 'Int',
      'PERCENTAGE': 'Float',
      'MONEY': 'Decimal @db.Decimal(15, 2)',
      'BOOLEAN': 'Boolean',
      'ENUM': 'String',
      'JSON': 'Json'
    }
  };
  
  const mapping = typeMap[dbType] || typeMap.sqlite;
  return mapping[domainType] || 'String';
}

/**
 * エンティティ間のリレーションを生成
 */
function generateRelations(entities: InferredEntity[]): string {
  let relations = '// リレーション定義\n';
  
  entities.forEach(entity => {
    if (entity.suggestedProperties) {
      // 外部キーフィールドを検出
      const foreignKeys = entity.suggestedProperties.filter(prop => 
        prop.name.endsWith('Id') && prop.name !== 'id'
      );
      
      if (foreignKeys.length > 0) {
        relations += `// ${entity.name}のリレーション\n`;
        
        foreignKeys.forEach(fk => {
          const relatedEntityName = fk.name.replace(/Id$/, '');
          const capitalizedName = relatedEntityName.charAt(0).toUpperCase() + relatedEntityName.slice(1);
          
          // 関連エンティティが存在する場合のみリレーションを追加
          if (entities.some(e => e.name.toLowerCase() === capitalizedName.toLowerCase())) {
            relations += `// TODO: ${entity.name}モデルに以下のリレーションを追加:\n`;
            relations += `//   ${relatedEntityName} ${capitalizedName} @relation(fields: [${fk.name}], references: [id])\n`;
            relations += `// TODO: ${capitalizedName}モデルに以下のリレーションを追加:\n`;
            relations += `//   ${entity.name.toLowerCase()}s ${entity.name}[]\n\n`;
          }
        });
      }
    }
  });
  
  return relations;
}

/**
 * マイグレーションSQLの生成
 */
function generateMigrationSql(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[]
): string {
  let sql = `-- Generated by Parasol
-- Initial migration

`;
  
  capabilities.forEach(capability => {
    sql += `-- ${capability.displayName} テーブル
CREATE TABLE IF NOT EXISTS ${capability.name.toLowerCase()} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

`;
  });
  
  return sql;
}

/**
 * テストコードの生成
 */
async function generateTests(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  // 各ケーパビリティのテストを生成
  capabilities.forEach(capability => {
    const testCode = `/**
 * ${capability.displayName} テスト
 * 
 * @generated by Parasol
 */

import { describe, it, expect } from 'vitest';
import { ${capability.name} } from '@/domain/${capability.name}/entities/${capability.name}';

describe('${capability.name}', () => {
  it('should create instance', () => {
    const entity = new ${capability.name}({
      id: '123',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    expect(entity).toBeDefined();
    expect(entity.id).toBe('123');
  });
  
  // TODO: 追加のテストケースを実装
});
`;
    
    files.push({
      path: `tests/${capability.name}/${capability.name}.test.ts`,
      content: testCode,
      type: 'test'
    });
  });
  
  return files;
}

/**
 * ドキュメントの生成
 */
async function generateDocs(
  capabilities: BusinessCapability[],
  operations: BusinessOperation[],
  config: GenerationConfig
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];
  
  // 概要ドキュメント
  let overviewDoc = `# 生成されたコード概要

生成日時: ${new Date().toISOString()}
生成スコープ: ${config.scope}
生成ターゲット: ${config.target}

## ケーパビリティ一覧

`;
  
  capabilities.forEach(capability => {
    overviewDoc += `### ${capability.displayName} (${capability.name})

- カテゴリ: ${capability.category}
- 説明: ${capability.description || 'なし'}
- オペレーション数: ${operations.filter(op => op.capabilityId === capability.id).length}

`;
  });
  
  files.push({
    path: 'docs/generated/overview.md',
    content: overviewDoc,
    type: 'doc'
  });
  
  // 各ケーパビリティの詳細ドキュメント
  capabilities.forEach(capability => {
    const capOperations = operations.filter(op => op.capabilityId === capability.id);
    let doc = `# ${capability.displayName}

## 概要

${capability.description || '説明なし'}

## オペレーション一覧

`;
    
    capOperations.forEach(op => {
      doc += `### ${op.displayName}

- パターン: ${op.pattern}
- 目的: ${op.goal || 'なし'}

`;
    });
    
    files.push({
      path: `docs/generated/${capability.name}.md`,
      content: doc,
      type: 'doc'
    });
  });
  
  return files;
}