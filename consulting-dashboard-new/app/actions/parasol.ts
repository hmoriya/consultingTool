'use server';

import { parasolDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Prismaから取得される生データの型定義
interface PrismaBusinessOperation {
  id: string;
  serviceId: string;
  capabilityId: string | null;
  name: string;
  displayName: string;
  design: string | null;
  pattern: string;
  goal: string;
  roles: string;
  operations: string;
  businessStates: string;
  useCases: string;
  uiDefinitions: string;
  testCases: string;
  robustnessModel: string | null;
  createdAt: Date;
  updatedAt: Date;
  useCaseModels: PrismaUseCase[];
}

interface PrismaUseCase {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  definition: string | null;
  operationId: string;
  order: number;
  apiUsageDefinition: string | null;
  actors: string | null;
  preconditions: string | null;
  postconditions: string | null;
  basicFlow: string | null;
  alternativeFlow: string | null;
  exceptionFlow: string | null;
  createdAt: Date;
  updatedAt: Date;
  pageDefinitions: PrismaPageDefinition[];
  robustnessDiagram?: PrismaRobustnessDiagram | null;
}

interface PrismaPageDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  useCaseId: string;
  content: string | null;
  url: string;
  layout: string | null;
  components: string | null;
  stateManagement: string | null;
  validations: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaRobustnessDiagram {
  id: string;
  useCaseId: string;
  content: string;
  boundaryObjects: string | null;
  controlObjects: string | null;
  entityObjects: string | null;
  diagram: string | null;
  interactions: string | null;
  createdAt: Date;
  updatedAt: Date;
}
import type {
  CreateServiceData,
  UpdateServiceData,
  SaveServiceData,
  CreateBusinessOperationData,
  UpdateBusinessOperationData,
  CreateBusinessCapabilityData,
  UpdateBusinessCapabilityData,
  CreateUseCaseData,
  UpdateUseCaseData,
  CreateRobustnessDiagramData,
  UpdateRobustnessDiagramData,
  ActionResponse,
  ServiceResponse,
  ServiceWithMappedRelations,
  MappedBusinessOperation,
  MappedBusinessCapability,
  MappedUseCase,
  MappedRobustnessDiagram,
  ServiceUpdateData,
  UseCaseUpdateData,
  RobustnessDiagramUpdateData } from '@/app/types/parasol-actions';

// バリデーションスキーマ
const ServiceSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  displayName: z.string().min(1, '表示名は必須です'),
  description: z.string().optional(),
  // MD形式の定義（新方式）
  serviceDescription: z.string().optional(),
  domainLanguageDefinition: z.string().optional(),
  apiSpecificationDefinition: z.string().optional(),
  databaseDesignDefinition: z.string().optional(),
  integrationSpecificationDefinition: z.string().optional(),
  // JSON形式の定義（旧方式、互換性のため保持）
  domainLanguage: z.string().optional(),
  apiSpecification: z.string().optional(),
  dbSchema: z.string().optional(),
});

const BusinessCapabilitySchema = z.object({
  serviceId: z.string(),
  name: z.string().min(1, '名前は必須です'),
  displayName: z.string().min(1, '表示名は必須です'),
  description: z.string().optional(),
  category: z.enum(['Core', 'Supporting', 'Generic']),
});

const BusinessOperationSchema = z.object({
  serviceId: z.string(),
  capabilityId: z.string().optional(),
  name: z.string().min(1, '名前は必須です'),
  displayName: z.string().min(1, '表示名は必須です'),
  pattern: z.enum(['CRUD', 'Workflow', 'Analytics', 'Communication', 'Administration']),
  goal: z.string(),
  roles: z.string(), // JSON文字列として保存
  operations: z.string(),
  businessStates: z.string(),
  useCases: z.string(),
  uiDefinitions: z.string(),
  testCases: z.string(),
  robustnessModel: z.string().optional(),
});

const UseCaseSchema = z.object({
  operationId: z.string(),
  name: z.string().min(1, '名前は必須です'),
  displayName: z.string().min(1, '表示名は必須です'),
  description: z.string().optional(),
  definition: z.string().optional(),
  order: z.number().default(0),
  actors: z.string().optional(),
  preconditions: z.string().optional(),
  postconditions: z.string().optional(),
  basicFlow: z.string().optional(),
  alternativeFlow: z.string().optional(),
  exceptionFlow: z.string().optional(),
});

const RobustnessDiagramSchema = z.object({
  useCaseId: z.string(),
  content: z.string(),
  boundaryObjects: z.string().optional(),
  controlObjects: z.string().optional(),
  entityObjects: z.string().optional(),
  diagram: z.string().optional(),
  interactions: z.string().optional(),
});

// サービス関連のアクション
export async function createService(data: CreateServiceData): Promise<ActionResponse<ServiceResponse>> {
  try {
    const result = ServiceSchema.parse(data);

    // Prepare data for Prisma with required and optional fields
    const serviceData = {
      name: result.name,
      displayName: result.displayName,
      // Required JSON fields with defaults
      domainLanguage: result.domainLanguage || '{}',
      apiSpecification: result.apiSpecification || '{}',
      dbSchema: result.dbSchema || '{}',
      // Optional fields - safely access with optional chaining
      ...(result.description !== undefined && { description: result.description }),
      ...(result.serviceDescription !== undefined && { serviceDescription: result.serviceDescription }),
      ...('domainLanguageDefinition' in result && result.domainLanguageDefinition !== undefined && { domainLanguageDefinition: result.domainLanguageDefinition }),
      ...('apiSpecificationDefinition' in result && result.apiSpecificationDefinition !== undefined && { apiSpecificationDefinition: result.apiSpecificationDefinition }),
      ...('databaseDesignDefinition' in result && result.databaseDesignDefinition !== undefined && { databaseDesignDefinition: result.databaseDesignDefinition }),
      ...('integrationSpecificationDefinition' in result && result.integrationSpecificationDefinition !== undefined && { integrationSpecificationDefinition: result.integrationSpecificationDefinition }),
    }

    const service = await parasolDb.service.create({
      data: serviceData,
      include: {
        businessOperations: true
      }
    });
    
    revalidatePath('/settings/parasol');
    
    // Construct ServiceResponse explicitly to avoid type conflicts
    const responseData: ServiceResponse = {
      id: service.id,
      name: service.name,
      displayName: service.displayName,
      description: service.description || '', // exactOptionalPropertyTypes対応: 必須フィールド
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      businessOperations: [],
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    
    return { 
      success: true, 
      data: responseData
    };
  } catch (error) {
    console.error('Failed to create service:', error);
    return { success: false, error: 'サービスの作成に失敗しました' };
  }
}

export async function getServices(): Promise<ActionResponse<ServiceWithMappedRelations[]>> {
  try {
    console.log('Fetching services from Parasol DB...');
    const services = await parasolDb.service.findMany({
      include: {
        capabilities: {
          include: {
            businessOperations: {
              include: {
                useCaseModels: {
                  include: {
                    robustnessDiagram: true,
                    pageDefinitions: true,
                  },
                  orderBy: {
                    order: 'asc'
                  }
                }
              }
            }
          }
        },
        businessOperations: {
          include: {
            useCaseModels: {
              include: {
                robustnessDiagram: true,
                pageDefinitions: true,
              },
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
      },
      orderBy: {
        displayName: 'asc',
      },
    });
    
    console.log(`Found ${services.length} services`);
    
    // デバッグ: 各サービスのケーパビリティとオペレーション数を表示
    services.forEach(service => {
      console.log(`Service: ${service.name}`);
      console.log(`  Capabilities: ${service.capabilities.length}`);
      console.log(`  domainLanguageDefinition length: ${service.domainLanguageDefinition?.length || 0}`);
      service.capabilities.forEach(cap => {
        console.log(`    ${cap.name}: ${cap.businessOperations.length} operations`);
      });
      console.log(`  Direct operations: ${service.businessOperations.length}`);
    });
    
    const mappedServices = services.map(service => ({
      ...service,
      description: service.description || '', // exactOptionalPropertyTypes対応
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      // 設計ドキュメント (MD形式)
      apiSpecificationDefinition: service.apiSpecificationDefinition || '',
      databaseDesignDefinition: service.databaseDesignDefinition || '',
      integrationSpecificationDefinition: service.integrationSpecificationDefinition || '',
      capabilities: service.capabilities.map(cap => ({
        ...cap,
        description: cap.description || '',
        category: cap.category as 'Core' | 'Supporting' | 'Generic',
        businessOperations: cap.businessOperations.filter(op => op.capabilityId !== null).map((op) => ({
          ...op,
          roles: JSON.parse(op.roles),
          operations: JSON.parse(op.operations),
          businessStates: JSON.parse(op.businessStates),
          useCases: JSON.parse(op.useCases),
          uiDefinitions: JSON.parse(op.uiDefinitions),
          testCases: JSON.parse(op.testCases),
          robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
          useCaseModels: op.useCaseModels?.map((uc) => ({
            ...uc,
            actors: uc.actors ? JSON.parse(uc.actors) : null,
            preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
            postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
            basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
            alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
            exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
            pageDefinitions: uc.pageDefinitions || [],
            // API利用仕様データを追加
            apiUsageDefinition: uc.apiUsageDefinition || '',
            robustnessDiagram: uc.robustnessDiagram ? {
              id: uc.robustnessDiagram.id,
              content: uc.robustnessDiagram.content,
              boundaryObjects: uc.robustnessDiagram.boundaryObjects ? JSON.parse(uc.robustnessDiagram.boundaryObjects) : null,
              controlObjects: uc.robustnessDiagram.controlObjects ? JSON.parse(uc.robustnessDiagram.controlObjects) : null,
              entityObjects: uc.robustnessDiagram.entityObjects ? JSON.parse(uc.robustnessDiagram.entityObjects) : null,
              interactions: uc.robustnessDiagram.interactions ? JSON.parse(uc.robustnessDiagram.interactions) : null,
              diagram: uc.robustnessDiagram.diagram || '',
            } : {
              id: '',
              content: '',
              boundaryObjects: null,
              controlObjects: null,
              entityObjects: null,
              interactions: null,
              diagram: '',
            },
          }))
        }))
      })),
      businessOperations: service.businessOperations.filter(op => op.capabilityId !== null).map((op) => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
        useCaseModels: op.useCaseModels.map((uc) => ({
          ...uc,
          actors: uc.actors ? JSON.parse(uc.actors) : null,
          preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
          postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
          basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
          alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
          exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
          pageDefinitions: uc.pageDefinitions || [],
          // API利用仕様データを追加
          apiUsageDefinition: uc.apiUsageDefinition || '',
          robustnessDiagram: uc.robustnessDiagram ? {
            id: uc.robustnessDiagram.id,
            content: uc.robustnessDiagram.content,
            boundaryObjects: uc.robustnessDiagram.boundaryObjects ? JSON.parse(uc.robustnessDiagram.boundaryObjects) : null,
            controlObjects: uc.robustnessDiagram.controlObjects ? JSON.parse(uc.robustnessDiagram.controlObjects) : null,
            entityObjects: uc.robustnessDiagram.entityObjects ? JSON.parse(uc.robustnessDiagram.entityObjects) : null,
            interactions: uc.robustnessDiagram.interactions ? JSON.parse(uc.robustnessDiagram.interactions) : null,
            diagram: uc.robustnessDiagram.diagram || '',
          } : {
            id: '',
            content: '',
            boundaryObjects: null,
            controlObjects: null,
            entityObjects: null,
            interactions: null,
            diagram: '',
          },
        }))
      }))
    }));
    
    return { success: true, data: mappedServices };
  } catch (error) {
    console.error('Failed to fetch services:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getService(id: string): Promise<ServiceResponse | null> {
  try {
    const service = await parasolDb.service.findUnique({
      where: { id },
      include: {
        businessOperations: {
          include: {
            useCaseModels: {
              include: {
                pageDefinitions: true,
                robustnessDiagram: true,
              },
            },
          },
        },
      },
    });
    
    if (!service) return null;

    // Construct ServiceResponse explicitly
    const responseData: ServiceResponse = {
      id: service.id,
      name: service.name,
      displayName: service.displayName,
      description: service.description || '', // exactOptionalPropertyTypes対応: 必須フィールド
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      businessOperations: service.businessOperations.filter(op => op.capabilityId !== null).map((op) => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
        useCaseModels: op.useCaseModels.map((uc) => ({
          ...uc,
          actors: uc.actors ? JSON.parse(uc.actors) : null,
          preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
          postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
          basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
          alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
          exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
          pageDefinitions: uc.pageDefinitions || [],
          apiUsageDefinition: uc.apiUsageDefinition || '',
          robustnessDiagram: uc.robustnessDiagram ? {
            id: uc.robustnessDiagram.id,
            content: uc.robustnessDiagram.content,
            boundaryObjects: uc.robustnessDiagram.boundaryObjects ? JSON.parse(uc.robustnessDiagram.boundaryObjects) : null,
            controlObjects: uc.robustnessDiagram.controlObjects ? JSON.parse(uc.robustnessDiagram.controlObjects) : null,
            entityObjects: uc.robustnessDiagram.entityObjects ? JSON.parse(uc.robustnessDiagram.entityObjects) : null,
            interactions: uc.robustnessDiagram.interactions ? JSON.parse(uc.robustnessDiagram.interactions) : null,
            diagram: uc.robustnessDiagram.diagram || '',
          } : {
            id: '',
            content: '',
            boundaryObjects: null,
            controlObjects: null,
            entityObjects: null,
            interactions: null,
            diagram: '',
          },
        }))
      })),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };

    return responseData;
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
}

export async function updateService(id: string, data: UpdateServiceData): Promise<ActionResponse<ServiceResponse>> {
  try {
    const result = ServiceSchema.parse(data);

    // Prepare data for Prisma with required and optional fields
    const updateData = {
      name: result.name,
      displayName: result.displayName,
      // Required JSON fields with defaults
      domainLanguage: result.domainLanguage || '{}',
      apiSpecification: result.apiSpecification || '{}',
      dbSchema: result.dbSchema || '{}',
      // Optional fields
      ...(result.description !== undefined && { description: result.description }),
      ...(result.serviceDescription !== undefined && { serviceDescription: result.serviceDescription }),
      ...(result.domainLanguageDefinition !== undefined && { domainLanguageDefinition: result.domainLanguageDefinition }),
      ...(result.apiSpecificationDefinition !== undefined && { apiSpecificationDefinition: result.apiSpecificationDefinition }),
      ...(result.databaseDesignDefinition !== undefined && { databaseDesignDefinition: result.databaseDesignDefinition }),
      ...(result.integrationSpecificationDefinition !== undefined && { integrationSpecificationDefinition: result.integrationSpecificationDefinition }),
    }

    const service = await parasolDb.service.update({
      where: { id },
      data: updateData,
      include: {
        businessOperations: {
          include: {
            useCaseModels: {
              include: {
                pageDefinitions: true,
                robustnessDiagram: true,
              },
            },
          },
        },
      },
    });
    
    revalidatePath('/settings/parasol');
    
    // Construct ServiceResponse explicitly
    const responseData: ServiceResponse = {
      id: service.id,
      name: service.name,
      displayName: service.displayName,
      description: service.description || '', // exactOptionalPropertyTypes対応: 必須フィールド
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      businessOperations: service.businessOperations.filter(op => op.capabilityId !== null).map((op) => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
        useCaseModels: op.useCaseModels.map((uc) => ({
          ...uc,
          actors: uc.actors ? JSON.parse(uc.actors) : null,
          preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
          postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
          basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
          alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
          exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
          pageDefinitions: uc.pageDefinitions || [],
          apiUsageDefinition: uc.apiUsageDefinition || '',
          robustnessDiagram: uc.robustnessDiagram ? {
            id: uc.robustnessDiagram.id,
            content: uc.robustnessDiagram.content,
            boundaryObjects: uc.robustnessDiagram.boundaryObjects ? JSON.parse(uc.robustnessDiagram.boundaryObjects) : null,
            controlObjects: uc.robustnessDiagram.controlObjects ? JSON.parse(uc.robustnessDiagram.controlObjects) : null,
            entityObjects: uc.robustnessDiagram.entityObjects ? JSON.parse(uc.robustnessDiagram.entityObjects) : null,
            interactions: uc.robustnessDiagram.interactions ? JSON.parse(uc.robustnessDiagram.interactions) : null,
            diagram: uc.robustnessDiagram.diagram || '',
          } : {
            id: '',
            content: '',
            boundaryObjects: null,
            controlObjects: null,
            entityObjects: null,
            interactions: null,
            diagram: '',
          },
        }))
      })),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    
    return { 
      success: true, 
      data: responseData
    };
  } catch (error) {
    console.error('Failed to update service:', error);
    return { success: false, error: 'サービスの更新に失敗しました' };
  }
}

export async function deleteService(id: string): Promise<ActionResponse<void>> {
  try {
    await parasolDb.service.delete({
      where: { id },
    });
    
    revalidatePath('/settings/parasol');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete service:', error);
    return { success: false, error: 'サービスの削除に失敗しました' };
  }
}

// ビジネスオペレーション関連のアクション
export async function createBusinessOperation(data: CreateBusinessOperationData): Promise<ActionResponse<MappedBusinessOperation>> {
  try {
    const result = BusinessOperationSchema.parse({
      ...data,
      roles: JSON.stringify(data.roles),
      operations: JSON.stringify(data.operations),
      businessStates: JSON.stringify(data.businessStates),
      useCases: JSON.stringify(data.useCases),
      uiDefinitions: JSON.stringify(data.uiDefinitions),
      testCases: JSON.stringify(data.testCases),
      robustnessModel: data.robustnessModel ? JSON.stringify(data.robustnessModel) : undefined,
    });

    // Prepare data for Prisma - only include defined properties
    const operationData: Record<string, unknown> = {
      serviceId: result.serviceId,
      name: result.name,
      displayName: result.displayName,
      pattern: result.pattern,
      goal: result.goal,
      roles: result.roles,
      operations: result.operations,
      businessStates: result.businessStates,
      useCases: result.useCases,
      uiDefinitions: result.uiDefinitions,
      testCases: result.testCases,
    };

    // Only include optional properties if they're defined
    if (result.capabilityId !== undefined) {
      operationData.capabilityId = result.capabilityId;
    }
    if (result.robustnessModel !== undefined) {
      operationData.robustnessModel = result.robustnessModel;
    }

    const operation = await parasolDb.businessOperation.create({
      data: operationData,
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...operation,
        roles: JSON.parse(operation.roles),
        operations: JSON.parse(operation.operations),
        businessStates: JSON.parse(operation.businessStates),
        useCases: JSON.parse(operation.useCases),
        uiDefinitions: JSON.parse(operation.uiDefinitions),
        testCases: JSON.parse(operation.testCases),
        robustnessModel: operation.robustnessModel ? JSON.parse(operation.robustnessModel) : null,
        useCaseModels: [], // Empty array for newly created operation
      }
    };
  } catch (error) {
    console.error('Failed to create business operation:', error);
    return { success: false, error: 'ビジネスオペレーションの作成に失敗しました' };
  }
}

export async function getBusinessOperations(serviceId: string): Promise<MappedBusinessOperation[]> {
  try {
    const operations = await parasolDb.businessOperation.findMany({
      where: { serviceId },
      orderBy: {
        displayName: 'asc',
      },
    });
    
    return operations.map(op => ({
      ...op,
      roles: JSON.parse(op.roles),
      operations: JSON.parse(op.operations),
      businessStates: JSON.parse(op.businessStates),
      useCases: JSON.parse(op.useCases),
      uiDefinitions: JSON.parse(op.uiDefinitions),
      testCases: JSON.parse(op.testCases),
      robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
      useCaseModels: [], // Empty array - use cases not included in this query
    }));
  } catch (error) {
    console.error('Failed to fetch business operations:', error);
    return [];
  }
}

export async function updateBusinessOperation(id: string, data: UpdateBusinessOperationData): Promise<ActionResponse<MappedBusinessOperation>> {
  try {
    const result = BusinessOperationSchema.parse({
      ...data,
      roles: JSON.stringify(data.roles),
      operations: JSON.stringify(data.operations),
      businessStates: JSON.stringify(data.businessStates),
      useCases: JSON.stringify(data.useCases),
      uiDefinitions: JSON.stringify(data.uiDefinitions),
      testCases: JSON.stringify(data.testCases),
      robustnessModel: data.robustnessModel ? JSON.stringify(data.robustnessModel) : undefined,
    });

    // Prepare data for Prisma update - only include defined properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      serviceId: result.serviceId,
      name: result.name,
      displayName: result.displayName,
      pattern: result.pattern,
      goal: result.goal,
      roles: result.roles,
      operations: result.operations,
      businessStates: result.businessStates,
      useCases: result.useCases,
      uiDefinitions: result.uiDefinitions,
      testCases: result.testCases,
    };

    // Only include optional properties if they're defined
    if (result.capabilityId !== undefined) {
      updateData.capabilityId = result.capabilityId;
    }
    if (result.robustnessModel !== undefined) {
      updateData.robustnessModel = result.robustnessModel;
    }

    const operation = await parasolDb.businessOperation.update({
      where: { id },
      data: updateData,
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...operation,
        roles: JSON.parse(operation.roles),
        operations: JSON.parse(operation.operations),
        businessStates: JSON.parse(operation.businessStates),
        useCases: JSON.parse(operation.useCases),
        uiDefinitions: JSON.parse(operation.uiDefinitions),
        testCases: JSON.parse(operation.testCases),
        robustnessModel: operation.robustnessModel ? JSON.parse(operation.robustnessModel) : null,
        useCaseModels: [], // Empty array for updated operation - use cases fetched separately
      }
    };
  } catch (error) {
    console.error('Failed to update business operation:', error);
    return { success: false, error: 'ビジネスオペレーションの更新に失敗しました' };
  }
}

export async function deleteBusinessOperation(id: string): Promise<ActionResponse<void>> {
  try {
    await parasolDb.businessOperation.delete({
      where: { id },
    });
    
    revalidatePath('/settings/parasol');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete business operation:', error);
    return { success: false, error: 'ビジネスオペレーションの削除に失敗しました' };
  }
}

// データ保存用の簡易アクション（エディタから直接使用）
export async function saveServiceData(serviceId: string, data: SaveServiceData): Promise<ActionResponse<ServiceResponse>> {
  try {
    const updateData: ServiceUpdateData = {};
    
    // MD形式のフィールド
    if (data.serviceDescription !== undefined) {
      updateData.serviceDescription = data.serviceDescription;
    }
    if (data.domainLanguageDefinition !== undefined) {
      updateData.domainLanguageDefinition = data.domainLanguageDefinition;
    }
    if (data.apiSpecificationDefinition !== undefined) {
      updateData.apiSpecificationDefinition = data.apiSpecificationDefinition;
    }
    if (data.databaseDesignDefinition !== undefined) {
      updateData.databaseDesignDefinition = data.databaseDesignDefinition;
    }
    
    // JSON形式のフィールド（既存）
    if (data.domainLanguage !== undefined) {
      updateData.domainLanguage = JSON.stringify(data.domainLanguage);
    }
    if (data.apiSpecification !== undefined) {
      updateData.apiSpecification = JSON.stringify(data.apiSpecification);
    }
    if (data.dbSchema !== undefined) {
      updateData.dbSchema = JSON.stringify(data.dbSchema);
    }

    const service = await parasolDb.service.update({
      where: { id: serviceId },
      data: updateData,
    });
    
    revalidatePath('/settings/parasol');
    const responseData = {
      id: service.id,
      name: service.name,
      displayName: service.displayName,
      ...(service.description ? { description: service.description } : {}),
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      businessOperations: [],
      createdAt: service.createdAt,
      updatedAt: service.updatedAt
    };
    
    return { 
      success: true, 
      data: responseData
    };
  } catch (error) {
    console.error('Failed to save service data:', error);
    return { success: false, error: 'データの保存に失敗しました' };
  }
}

// ビジネスケーパビリティ関連のアクション
export async function createBusinessCapability(data: CreateBusinessCapabilityData): Promise<ActionResponse<MappedBusinessCapability>> {
  try {
    const result = BusinessCapabilitySchema.parse(data);

    // Prepare data for Prisma - only include defined properties
    const capabilityData: Record<string, unknown> = {
      serviceId: result.serviceId,
      name: result.name,
      displayName: result.displayName,
      category: result.category,
    };

    // Only include description if it's defined
    if (result.description !== undefined) {
      capabilityData.description = result.description;
    }

    const capability = await parasolDb.businessCapability.create({
      data: capabilityData,
      include: {
        businessOperations: true
      }
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...capability,
        businessOperations: capability.businessOperations.map(op => ({
          ...op,
          roles: JSON.parse(op.roles),
          operations: JSON.parse(op.operations),
          businessStates: JSON.parse(op.businessStates),
          useCases: JSON.parse(op.useCases),
          uiDefinitions: JSON.parse(op.uiDefinitions),
          testCases: JSON.parse(op.testCases),
          robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
          useCaseModels: [] // TODO: Implement UseCase models mapping
        }))
      }
    };
  } catch (error) {
    console.error('Failed to create business capability:', error);
    return { success: false, error: 'ビジネスケーパビリティの作成に失敗しました' };
  }
}

export async function getBusinessCapabilities(serviceId: string): Promise<MappedBusinessCapability[]> {
  try {
    const capabilities = await parasolDb.businessCapability.findMany({
      where: { serviceId },
      include: {
        businessOperations: true
      },
      orderBy: {
        category: 'asc',
      },
    });
    
    return capabilities.map(cap => ({
      ...cap,
      description: cap.description || undefined,
      businessOperations: cap.businessOperations.map(op => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
      }))
    }));
  } catch (error) {
    console.error('Failed to fetch business capabilities:', error);
    return [];
  }
}

export async function updateBusinessCapability(id: string, data: UpdateBusinessCapabilityData): Promise<ActionResponse<MappedBusinessCapability>> {
  try {
    const capability = await parasolDb.businessCapability.update({
      where: { id },
      data: data,
      include: {
        businessOperations: true
      }
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...capability,
        businessOperations: capability.businessOperations.map(op => ({
          ...op,
          roles: JSON.parse(op.roles),
          operations: JSON.parse(op.operations),
          businessStates: JSON.parse(op.businessStates),
          useCases: JSON.parse(op.useCases),
          uiDefinitions: JSON.parse(op.uiDefinitions),
          testCases: JSON.parse(op.testCases),
          robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
          useCaseModels: [] // TODO: Implement UseCase models mapping
        }))
      }
    };
  } catch (error) {
    console.error('Failed to update business capability:', error);
    return { success: false, error: 'ビジネスケーパビリティの更新に失敗しました' };
  }
}

export async function deleteBusinessCapability(id: string): Promise<ActionResponse<void>> {
  try {
    await parasolDb.businessCapability.delete({
      where: { id },
    });

    revalidatePath('/settings/parasol');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete business capability:', error);
    return { success: false, error: 'ビジネスケーパビリティの削除に失敗しました' };
  }
}

// ========================
// UseCase CRUD Operations
// ========================

export async function createUseCase(data: CreateUseCaseData): Promise<ActionResponse<MappedUseCase>> {
  try {
    const result = UseCaseSchema.parse({
      ...data,
      actors: data.actors ? JSON.stringify(data.actors) : undefined,
      preconditions: data.preconditions ? JSON.stringify(data.preconditions) : undefined,
      postconditions: data.postconditions ? JSON.stringify(data.postconditions) : undefined,
      basicFlow: data.basicFlow ? JSON.stringify(data.basicFlow) : undefined,
      alternativeFlow: data.alternativeFlow ? JSON.stringify(data.alternativeFlow) : undefined,
      exceptionFlow: data.exceptionFlow ? JSON.stringify(data.exceptionFlow) : undefined,
    });

    // Prepare data for Prisma - only include defined properties
    const useCaseData: Record<string, unknown> = {
      operationId: result.operationId,
      name: result.name,
      displayName: result.displayName,
      order: result.order,
    };

    // Only include optional properties if they're defined
    if (result.description !== undefined) {
      useCaseData.description = result.description;
    }
    if (result.definition !== undefined) {
      useCaseData.definition = result.definition;
    }
    if (result.actors !== undefined) {
      useCaseData.actors = result.actors;
    }
    if (result.preconditions !== undefined) {
      useCaseData.preconditions = result.preconditions;
    }
    if (result.postconditions !== undefined) {
      useCaseData.postconditions = result.postconditions;
    }
    if (result.basicFlow !== undefined) {
      useCaseData.basicFlow = result.basicFlow;
    }
    if (result.alternativeFlow !== undefined) {
      useCaseData.alternativeFlow = result.alternativeFlow;
    }
    if (result.exceptionFlow !== undefined) {
      useCaseData.exceptionFlow = result.exceptionFlow;
    }

    const useCase = await parasolDb.useCase.create({
      data: useCaseData,
      include: {
        robustnessDiagram: true,
        pageDefinitions: true,
      }
    });

    revalidatePath('/settings/parasol');
    return {
      success: true,
      data: {
        ...useCase,
        actors: useCase.actors ? JSON.parse(useCase.actors) : null,
        preconditions: useCase.preconditions ? JSON.parse(useCase.preconditions) : null,
        postconditions: useCase.postconditions ? JSON.parse(useCase.postconditions) : null,
        basicFlow: useCase.basicFlow ? JSON.parse(useCase.basicFlow) : null,
        alternativeFlow: useCase.alternativeFlow ? JSON.parse(useCase.alternativeFlow) : null,
        exceptionFlow: useCase.exceptionFlow ? JSON.parse(useCase.exceptionFlow) : null,
      }
    };
  } catch (error) {
    console.error('Failed to create useCase:', error);
    return { success: false, error: 'ユースケースの作成に失敗しました' };
  }
}

export async function updateUseCase(id: string, data: UpdateUseCaseData): Promise<ActionResponse<MappedUseCase>> {
  try {
    const updateData: UseCaseUpdateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.definition !== undefined) updateData.definition = data.definition;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.actors !== undefined) updateData.actors = JSON.stringify(data.actors);
    if (data.preconditions !== undefined) updateData.preconditions = JSON.stringify(data.preconditions);
    if (data.postconditions !== undefined) updateData.postconditions = JSON.stringify(data.postconditions);
    if (data.basicFlow !== undefined) updateData.basicFlow = JSON.stringify(data.basicFlow);
    if (data.alternativeFlow !== undefined) updateData.alternativeFlow = JSON.stringify(data.alternativeFlow);
    if (data.exceptionFlow !== undefined) updateData.exceptionFlow = JSON.stringify(data.exceptionFlow);

    const useCase = await parasolDb.useCase.update({
      where: { id },
      data: updateData,
      include: {
        robustnessDiagram: true,
        pageDefinitions: true,
      }
    });

    revalidatePath('/settings/parasol');
    return {
      success: true,
      data: {
        ...useCase,
        actors: useCase.actors ? JSON.parse(useCase.actors) : null,
        preconditions: useCase.preconditions ? JSON.parse(useCase.preconditions) : null,
        postconditions: useCase.postconditions ? JSON.parse(useCase.postconditions) : null,
        basicFlow: useCase.basicFlow ? JSON.parse(useCase.basicFlow) : null,
        alternativeFlow: useCase.alternativeFlow ? JSON.parse(useCase.alternativeFlow) : null,
        exceptionFlow: useCase.exceptionFlow ? JSON.parse(useCase.exceptionFlow) : null,
      }
    };
  } catch (error) {
    console.error('Failed to update useCase:', error);
    return { success: false, error: 'ユースケースの更新に失敗しました' };
  }
}

export async function deleteUseCase(id: string): Promise<ActionResponse<void>> {
  try {
    await parasolDb.useCase.delete({
      where: { id },
    });

    revalidatePath('/settings/parasol');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete useCase:', error);
    return { success: false, error: 'ユースケースの削除に失敗しました' };
  }
}

// ==============================
// RobustnessDiagram CRUD Operations
// ==============================

export async function createRobustnessDiagram(data: CreateRobustnessDiagramData): Promise<ActionResponse<MappedRobustnessDiagram>> {
  try {
    const result = RobustnessDiagramSchema.parse({
      ...data,
      boundaryObjects: data.boundaryObjects ? JSON.stringify(data.boundaryObjects) : undefined,
      controlObjects: data.controlObjects ? JSON.stringify(data.controlObjects) : undefined,
      entityObjects: data.entityObjects ? JSON.stringify(data.entityObjects) : undefined,
      interactions: data.interactions ? JSON.stringify(data.interactions) : undefined,
    });

    // Prepare data for Prisma - only include defined properties
    const diagramData: Record<string, unknown> = {
      useCaseId: result.useCaseId,
      content: result.content,
    };

    // Only include optional properties if they're defined
    if (result.boundaryObjects !== undefined) {
      diagramData.boundaryObjects = result.boundaryObjects;
    }
    if (result.controlObjects !== undefined) {
      diagramData.controlObjects = result.controlObjects;
    }
    if (result.entityObjects !== undefined) {
      diagramData.entityObjects = result.entityObjects;
    }
    if (result.diagram !== undefined) {
      diagramData.diagram = result.diagram;
    }
    if (result.interactions !== undefined) {
      diagramData.interactions = result.interactions;
    }

    const robustnessDiagram = await parasolDb.robustnessDiagram.create({
      data: diagramData,
    });

    revalidatePath('/settings/parasol');
    return {
      success: true,
      data: {
        ...robustnessDiagram,
        boundaryObjects: robustnessDiagram.boundaryObjects ? JSON.parse(robustnessDiagram.boundaryObjects) : null,
        controlObjects: robustnessDiagram.controlObjects ? JSON.parse(robustnessDiagram.controlObjects) : null,
        entityObjects: robustnessDiagram.entityObjects ? JSON.parse(robustnessDiagram.entityObjects) : null,
        interactions: robustnessDiagram.interactions ? JSON.parse(robustnessDiagram.interactions) : null,
      }
    };
  } catch (error) {
    console.error('Failed to create robustness diagram:', error);
    return { success: false, error: 'ロバストネス図の作成に失敗しました' };
  }
}

export async function updateRobustnessDiagram(id: string, data: UpdateRobustnessDiagramData): Promise<ActionResponse<MappedRobustnessDiagram>> {
  try {
    const updateData: RobustnessDiagramUpdateData = {};

    if (data.content !== undefined) updateData.content = data.content;
    if (data.diagram !== undefined) updateData.diagram = data.diagram;
    if (data.boundaryObjects !== undefined) updateData.boundaryObjects = JSON.stringify(data.boundaryObjects);
    if (data.controlObjects !== undefined) updateData.controlObjects = JSON.stringify(data.controlObjects);
    if (data.entityObjects !== undefined) updateData.entityObjects = JSON.stringify(data.entityObjects);
    if (data.interactions !== undefined) updateData.interactions = JSON.stringify(data.interactions);

    const robustnessDiagram = await parasolDb.robustnessDiagram.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/settings/parasol');
    return {
      success: true,
      data: {
        ...robustnessDiagram,
        boundaryObjects: robustnessDiagram.boundaryObjects ? JSON.parse(robustnessDiagram.boundaryObjects) : null,
        controlObjects: robustnessDiagram.controlObjects ? JSON.parse(robustnessDiagram.controlObjects) : null,
        entityObjects: robustnessDiagram.entityObjects ? JSON.parse(robustnessDiagram.entityObjects) : null,
        interactions: robustnessDiagram.interactions ? JSON.parse(robustnessDiagram.interactions) : null,
      }
    };
  } catch (error) {
    console.error('Failed to update robustness diagram:', error);
    return { success: false, error: 'ロバストネス図の更新に失敗しました' };
  }
}

export async function deleteRobustnessDiagram(id: string): Promise<ActionResponse<void>> {
  try {
    await parasolDb.robustnessDiagram.delete({
      where: { id },
    });

    revalidatePath('/settings/parasol');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete robustness diagram:', error);
    return { success: false, error: 'ロバストネス図の削除に失敗しました' };
  }
}

// Get UseCases for a specific Business Operation
export async function getUseCasesForOperation(operationId: string): Promise<ActionResponse<MappedUseCase[]>> {
  try {
    const useCases = await parasolDb.useCase.findMany({
      where: { operationId },
      orderBy: { order: 'asc' },
      include: {
        pageDefinitions: {
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            content: true, // MD形式の内容を含める
            url: true,
            layout: true,
            components: true,
            stateManagement: true,
            validations: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return { success: true, data: useCases };
  } catch (error) {
    console.error('Failed to get usecases for operation:', error);
    return { success: false, error: 'ユースケースの取得に失敗しました' };
  }
}