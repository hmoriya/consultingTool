'use server';

import { parasolDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// バリデーションスキーマ
const ServiceSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  displayName: z.string().min(1, '表示名は必須です'),
  description: z.string().optional(),
  domainLanguage: z.string(), // JSON文字列として保存
  apiSpecification: z.string(),
  dbSchema: z.string(),
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

// サービス関連のアクション
export async function createService(data: {
  name: string;
  displayName: string;
  description?: string;
  domainLanguage: any;
  apiSpecification: any;
  dbSchema: any;
}) {
  try {
    const result = ServiceSchema.parse({
      ...data,
      domainLanguage: JSON.stringify(data.domainLanguage),
      apiSpecification: JSON.stringify(data.apiSpecification),
      dbSchema: JSON.stringify(data.dbSchema),
    });

    const service = await parasolDb.service.create({
      data: result,
      include: {
        businessOperations: true
      }
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...service,
        domainLanguage: JSON.parse(service.domainLanguage),
        apiSpecification: JSON.parse(service.apiSpecification),
        dbSchema: JSON.parse(service.dbSchema),
        businessOperations: []
      }
    };
  } catch (error) {
    console.error('Failed to create service:', error);
    return { success: false, error: 'サービスの作成に失敗しました' };
  }
}

export async function getServices() {
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
                    pageDefinitions: true,
                    testDefinitions: true
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
                pageDefinitions: true,
                testDefinitions: true
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
    
    const mappedServices = services.map(service => ({
      ...service,
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      capabilities: service.capabilities.map(cap => ({
        ...cap,
        businessOperations: cap.businessOperations.map(op => ({
          ...op,
          roles: JSON.parse(op.roles),
          operations: JSON.parse(op.operations),
          businessStates: JSON.parse(op.businessStates),
          useCases: JSON.parse(op.useCases),
          uiDefinitions: JSON.parse(op.uiDefinitions),
          testCases: JSON.parse(op.testCases),
          robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
          useCaseModels: op.useCaseModels.map(uc => ({
            ...uc,
            actors: uc.actors ? JSON.parse(uc.actors) : null,
            preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
            postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
            basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
            alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
            exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
            pageDefinitions: uc.pageDefinitions || [],
            testDefinitions: uc.testDefinitions || [],
          }))
        }))
      })),
      businessOperations: service.businessOperations.map(op => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
        useCaseModels: op.useCaseModels.map(uc => ({
          ...uc,
          actors: uc.actors ? JSON.parse(uc.actors) : null,
          preconditions: uc.preconditions ? JSON.parse(uc.preconditions) : null,
          postconditions: uc.postconditions ? JSON.parse(uc.postconditions) : null,
          basicFlow: uc.basicFlow ? JSON.parse(uc.basicFlow) : null,
          alternativeFlow: uc.alternativeFlow ? JSON.parse(uc.alternativeFlow) : null,
          exceptionFlow: uc.exceptionFlow ? JSON.parse(uc.exceptionFlow) : null,
          pageDefinitions: uc.pageDefinitions || [],
          testDefinitions: uc.testDefinitions || [],
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
    return { success: false, data: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getService(id: string) {
  try {
    const service = await parasolDb.service.findUnique({
      where: { id },
      include: {
        businessOperations: true,
      },
    });
    
    if (!service) return null;

    return {
      ...service,
      domainLanguage: JSON.parse(service.domainLanguage),
      apiSpecification: JSON.parse(service.apiSpecification),
      dbSchema: JSON.parse(service.dbSchema),
      businessOperations: service.businessOperations.map(op => ({
        ...op,
        roles: JSON.parse(op.roles),
        operations: JSON.parse(op.operations),
        businessStates: JSON.parse(op.businessStates),
        useCases: JSON.parse(op.useCases),
        uiDefinitions: JSON.parse(op.uiDefinitions),
        testCases: JSON.parse(op.testCases),
        robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
      }))
    };
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return null;
  }
}

export async function updateService(id: string, data: {
  name: string;
  displayName: string;
  description?: string;
  domainLanguage: any;
  apiSpecification: any;
  dbSchema: any;
}) {
  try {
    const result = ServiceSchema.parse({
      ...data,
      domainLanguage: JSON.stringify(data.domainLanguage),
      apiSpecification: JSON.stringify(data.apiSpecification),
      dbSchema: JSON.stringify(data.dbSchema),
    });

    const service = await parasolDb.service.update({
      where: { id },
      data: result,
      include: {
        businessOperations: true
      }
    });
    
    revalidatePath('/settings/parasol');
    return { 
      success: true, 
      data: {
        ...service,
        domainLanguage: JSON.parse(service.domainLanguage),
        apiSpecification: JSON.parse(service.apiSpecification),
        dbSchema: JSON.parse(service.dbSchema),
        businessOperations: service.businessOperations.map(op => ({
          ...op,
          roles: JSON.parse(op.roles),
          operations: JSON.parse(op.operations),
          businessStates: JSON.parse(op.businessStates),
          useCases: JSON.parse(op.useCases),
          uiDefinitions: JSON.parse(op.uiDefinitions),
          testCases: JSON.parse(op.testCases),
          robustnessModel: op.robustnessModel ? JSON.parse(op.robustnessModel) : null,
        }))
      }
    };
  } catch (error) {
    console.error('Failed to update service:', error);
    return { success: false, error: 'サービスの更新に失敗しました' };
  }
}

export async function deleteService(id: string) {
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
export async function createBusinessOperation(data: {
  serviceId: string;
  capabilityId?: string;
  name: string;
  displayName: string;
  pattern: 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';
  goal: string;
  roles: any;
  operations: any;
  businessStates: any;
  useCases: any;
  uiDefinitions: any;
  testCases: any;
  robustnessModel?: any;
}) {
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

    const operation = await parasolDb.businessOperation.create({
      data: result,
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
      }
    };
  } catch (error) {
    console.error('Failed to create business operation:', error);
    return { success: false, error: 'ビジネスオペレーションの作成に失敗しました' };
  }
}

export async function getBusinessOperations(serviceId: string) {
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
    }));
  } catch (error) {
    console.error('Failed to fetch business operations:', error);
    return [];
  }
}

export async function updateBusinessOperation(id: string, data: {
  serviceId: string;
  capabilityId?: string;
  name: string;
  displayName: string;
  pattern: 'CRUD' | 'Workflow' | 'Analytics' | 'Communication' | 'Administration';
  goal: string;
  roles: any;
  operations: any;
  businessStates: any;
  useCases: any;
  uiDefinitions: any;
  testCases: any;
  robustnessModel?: any;
}) {
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

    const operation = await parasolDb.businessOperation.update({
      where: { id },
      data: result,
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
      }
    };
  } catch (error) {
    console.error('Failed to update business operation:', error);
    return { success: false, error: 'ビジネスオペレーションの更新に失敗しました' };
  }
}

export async function deleteBusinessOperation(id: string) {
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
export async function saveServiceData(serviceId: string, data: {
  domainLanguage?: any;
  apiSpecification?: any;
  dbSchema?: any;
}) {
  try {
    const updateData: any = {};
    
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
    return { 
      success: true, 
      data: {
        ...service,
        domainLanguage: JSON.parse(service.domainLanguage),
        apiSpecification: JSON.parse(service.apiSpecification),
        dbSchema: JSON.parse(service.dbSchema),
      }
    };
  } catch (error) {
    console.error('Failed to save service data:', error);
    return { success: false, error: 'データの保存に失敗しました' };
  }
}

// ビジネスケーパビリティ関連のアクション
export async function createBusinessCapability(data: {
  serviceId: string;
  name: string;
  displayName: string;
  description?: string;
  category: 'Core' | 'Supporting' | 'Generic';
}) {
  try {
    const result = BusinessCapabilitySchema.parse(data);

    const capability = await parasolDb.businessCapability.create({
      data: result,
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
        }))
      }
    };
  } catch (error) {
    console.error('Failed to create business capability:', error);
    return { success: false, error: 'ビジネスケーパビリティの作成に失敗しました' };
  }
}

export async function getBusinessCapabilities(serviceId: string) {
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

export async function updateBusinessCapability(id: string, data: {
  name: string;
  displayName: string;
  description?: string;
  category: 'Core' | 'Supporting' | 'Generic';
}) {
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
        }))
      }
    };
  } catch (error) {
    console.error('Failed to update business capability:', error);
    return { success: false, error: 'ビジネスケーパビリティの更新に失敗しました' };
  }
}

export async function deleteBusinessCapability(id: string) {
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