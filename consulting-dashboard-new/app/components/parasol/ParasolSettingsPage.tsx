'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Search, Save } from 'lucide-react';
import { saveServiceData, createBusinessOperation, createBusinessCapability, updateBusinessOperation, deleteBusinessOperation } from '@/app/actions/parasol';
import { DomainLanguageEditor } from './DomainLanguageEditor';
import { DomainLanguageMarkdownEditor } from './DomainLanguageMarkdownEditor';
import { APISpecificationEditor } from './APISpecificationEditor';
import { DBSchemaEditor } from './DBSchemaEditor';
import { UnifiedDesignEditor, DesignType } from './UnifiedDesignEditor';
import { ServiceForm } from './ServiceForm';
import { BusinessCapabilityEditor } from './BusinessCapabilityEditor';
import { BusinessOperationEditor } from './BusinessOperationEditor';
import { CodeGenerationPanel } from './CodeGenerationPanel';
import { useToast } from '@/hooks/use-toast';
import { DomainLanguageDefinition, APISpecification, DBSchema } from '@/types/parasol';

interface Service {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  domainLanguage: any;
  apiSpecification: any;
  dbSchema: any;
  capabilities?: any[];
  businessOperations: any[];
}

interface ParasolSettingsPageProps {
  initialServices: Service[];
}

export function ParasolSettingsPage({ initialServices }: ParasolSettingsPageProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  // オペレーション編集モーダルの状態
  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any>(null);
  const [editingCapability, setEditingCapability] = useState<any>(null);
  
  // デバッグ用ログ
  useEffect(() => {
    if (selectedService) {
      console.log('Selected service capabilities:', selectedService.capabilities);
    }
  }, [selectedService]);

  // サービス一覧のフィルタリング
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 初期ドメイン言語定義
  const getInitialDomainLanguage = (): DomainLanguageDefinition => ({
    entities: [],
    valueObjects: [],
    domainServices: [],
    version: '1.0.0',
    lastModified: new Date().toISOString()
  });

  // 初期API仕様
  const getInitialAPISpec = (): APISpecification => ({
    openapi: '3.0.0',
    info: {
      title: 'API Specification',
      version: '1.0.0',
      description: ''
    },
    paths: {}
  });

  // 初期DB設計
  const getInitialDBSchema = (): DBSchema => ({
    tables: [],
    relations: [],
    indexes: []
  });

  // サービスデータの変更ハンドラ
  const handleDomainLanguageChange = (domainLanguage: DomainLanguageDefinition) => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        domainLanguage
      });
      setHasChanges(true);
    }
  };

  const handleAPISpecChange = (apiSpecification: APISpecification) => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        apiSpecification
      });
      setHasChanges(true);
    }
  };

  const handleDBSchemaChange = (dbSchema: DBSchema) => {
    if (selectedService) {
      setSelectedService({
        ...selectedService,
        dbSchema
      });
      setHasChanges(true);
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!selectedService || !hasChanges) return;

    try {
      const result = await saveServiceData(selectedService.id, {
        domainLanguage: selectedService.domainLanguage,
        apiSpecification: selectedService.apiSpecification,
        dbSchema: selectedService.dbSchema
      });

      if (result.success) {
        // サービス一覧を更新
        const updatedServices = services.map(s =>
          s.id === selectedService.id ? selectedService : s
        );
        setServices(updatedServices);
        setHasChanges(false);
        
        toast({
          title: '保存完了',
          description: 'サービスの設定を保存しました',
        });
      } else {
        toast({
          title: 'エラー',
          description: result.error || '保存に失敗しました',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '保存中にエラーが発生しました',
        variant: 'destructive',
      });
    }
  };

  // サービス作成後の処理
  const handleServiceCreated = (newService: Service) => {
    setServices([...services, newService]);
    setSelectedService(newService);
    setShowServiceForm(false);
  };

  // サービス更新後の処理
  const handleServiceUpdated = (updatedService: Service) => {
    const updatedServices = services.map(s =>
      s.id === updatedService.id ? updatedService : s
    );
    setServices(updatedServices);
    setSelectedService(updatedService);
    setEditingService(null);
  };

  // オペレーション操作のハンドラー
  const handleAddOperation = (capability: any) => {
    setEditingCapability(capability);
    setEditingOperation(null);
    setOperationModalOpen(true);
  };

  const handleEditOperation = (capability: any, operation: any) => {
    setEditingCapability(capability);
    setEditingOperation(operation);
    setOperationModalOpen(true);
  };

  const handleDeleteOperation = async (capability: any, operation: any) => {
    if (!operation.id) return;

    try {
      const result = await deleteBusinessOperation(operation.id);
      
      if (result.success) {
        // UIから削除
        const updatedCapabilities = selectedService?.capabilities?.map(cap => 
          cap.id === capability.id 
            ? { 
                ...cap, 
                businessOperations: cap.businessOperations?.filter(op => op.id !== operation.id) || []
              }
            : cap
        ) || [];
        
        setSelectedService({
          ...selectedService!,
          capabilities: updatedCapabilities
        });
        
        toast({
          title: '削除完了',
          description: 'オペレーションを削除しました',
        });
      } else {
        toast({
          title: 'エラー',
          description: result.error || '削除に失敗しました',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '削除中にエラーが発生しました',
        variant: 'destructive',
      });
    }
  };

  const handleOperationSave = async (operation: any) => {
    try {
      if (editingOperation?.id) {
        // 更新
        const result = await updateBusinessOperation(editingOperation.id, {
          ...operation,
          serviceId: selectedService!.id,
          capabilityId: editingCapability.id
        });
        
        if (result.success && result.data) {
          // UIを更新
          const updatedCapabilities = selectedService?.capabilities?.map(cap => 
            cap.id === editingCapability.id 
              ? { 
                  ...cap, 
                  businessOperations: cap.businessOperations?.map(op => 
                    op.id === editingOperation.id ? result.data : op
                  ) || []
                }
              : cap
          ) || [];
          
          setSelectedService({
            ...selectedService!,
            capabilities: updatedCapabilities
          });
          
          toast({
            title: '更新完了',
            description: 'オペレーションを更新しました',
          });
        }
      } else {
        // 新規作成
        const result = await createBusinessOperation({
          ...operation,
          serviceId: selectedService!.id,
          capabilityId: editingCapability.id,
          roles: operation.roles || [],
          operations: operation.operations || [],
          businessStates: operation.businessStates || [],
          useCases: [],
          uiDefinitions: [],
          testCases: []
        });
        
        if (result.success && result.data) {
          // UIに追加
          const updatedCapabilities = selectedService?.capabilities?.map(cap => 
            cap.id === editingCapability.id 
              ? { 
                  ...cap, 
                  businessOperations: [...(cap.businessOperations || []), result.data]
                }
              : cap
          ) || [];
          
          setSelectedService({
            ...selectedService!,
            capabilities: updatedCapabilities
          });
          
          toast({
            title: '作成完了',
            description: 'オペレーションを作成しました',
          });
        }
      }
      
      setOperationModalOpen(false);
    } catch (error) {
      toast({
        title: 'エラー',
        description: '保存中にエラーが発生しました',
        variant: 'destructive',
      });
    }
  };

  // ケーパビリティとオペレーションからドメイン言語を自動生成
  const generateDomainLanguageFromCapabilities = (capabilities: any[]) => {
    if (!selectedService) return;
    
    const domainLanguage: DomainLanguageDefinition = {
      entities: [],
      valueObjects: [],
      domainServices: [],
      version: '1.0.0',
      lastModified: new Date().toISOString()
    };
    
    // ケーパビリティごとにエンティティを生成
    capabilities.forEach(capability => {
      const entity = {
        name: capability.name,
        displayName: capability.displayName,
        description: capability.description || '',
        properties: [
          {
            name: 'id',
            type: 'UUID',
            required: true,
            description: 'ユニークID'
          },
          {
            name: 'createdAt',
            type: 'TIMESTAMP',
            required: true,
            description: '作成日時'
          },
          {
            name: 'updatedAt',
            type: 'TIMESTAMP',
            required: true,
            description: '更新日時'
          }
        ],
        businessRules: [],
        domainEvents: [],
        isAggregate: true
      };
      
      // オペレーションパターンに基づいてプロパティを追加
      if (capability.businessOperations) {
        const hasWorkflow = capability.businessOperations.some((op: any) => op.pattern === 'Workflow');
        const hasCRUD = capability.businessOperations.some((op: any) => op.pattern === 'CRUD');
        
        if (hasWorkflow) {
          entity.properties.push({
            name: 'status',
            type: 'ENUM',
            required: true,
            description: 'ステータス',
            enumValues: ['draft', 'pending', 'approved', 'rejected', 'completed']
          });
        }
        
        if (hasCRUD) {
          entity.properties.push({
            name: 'name',
            type: 'STRING_50',
            required: true,
            description: '名称'
          });
          entity.properties.push({
            name: 'description',
            type: 'TEXT',
            required: false,
            description: '説明'
          });
        }
        
        // オペレーションからドメインイベントを生成
        capability.businessOperations.forEach((op: any) => {
          if (op.pattern === 'CRUD' && op.name.startsWith('create')) {
            entity.domainEvents.push({
              name: `${capability.name}Created`,
              displayName: `${capability.displayName}作成済み`,
              properties: ['id', 'name', 'createdAt']
            });
          }
          if (op.pattern === 'Workflow' && op.name.includes('approve')) {
            entity.domainEvents.push({
              name: `${capability.name}Approved`,
              displayName: `${capability.displayName}承認済み`,
              properties: ['id', 'approvedBy', 'approvedAt']
            });
          }
        });
      }
      
      domainLanguage.entities.push(entity);
      
      // コアケーパビリティの場合はドメインサービスも生成
      if (capability.category === 'Core') {
        domainLanguage.domainServices.push({
          name: `${capability.name}Service`,
          displayName: `${capability.displayName}サービス`,
          description: `${capability.displayName}に関するビジネスロジックを提供`,
          methods: capability.businessOperations?.map((op: any) => ({
            name: op.name,
            displayName: op.displayName,
            parameters: [],
            returnType: 'void',
            description: op.goal
          })) || []
        });
      }
    });
    
    // 共通の値オブジェクトを追加
    domainLanguage.valueObjects = [
      {
        name: 'UserId',
        displayName: 'ユーザーID',
        description: 'ユーザーを識別するID',
        properties: [
          {
            name: 'value',
            type: 'UUID',
            required: true,
            description: 'UUID値'
          }
        ],
        validationRules: ['UUID形式であること']
      },
      {
        name: 'Timestamp',
        displayName: 'タイムスタンプ',
        description: '日時を表す値オブジェクト',
        properties: [
          {
            name: 'value',
            type: 'TIMESTAMP',
            required: true,
            description: 'ISO8601形式の日時'
          }
        ],
        validationRules: ['有効な日時形式であること']
      }
    ];
    
    handleDomainLanguageChange(domainLanguage);
    
    toast({
      title: 'ドメイン言語生成完了',
      description: 'ケーパビリティとオペレーションからドメイン言語を生成しました',
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">パラソルドメイン言語設定</h1>
          <p className="text-muted-foreground mt-1">
            ドメイン駆動設計に基づくサービス定義と管理
          </p>
        </div>
        {hasChanges && selectedService && (
          <Button onClick={handleSave} variant="default">
            <Save className="h-4 w-4 mr-2" />
            変更を保存
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* サービス一覧（左サイドバー） */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>サービス一覧</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="サービスを検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button size="icon" onClick={() => setShowServiceForm(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-2">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedService?.id === service.id
                          ? 'bg-primary/10 border-primary'
                          : 'bg-secondary hover:bg-secondary/80'
                      } border`}
                      onClick={() => {
                        if (hasChanges) {
                          if (confirm('保存されていない変更があります。破棄しますか？')) {
                            setSelectedService(service);
                            setHasChanges(false);
                          }
                        } else {
                          setSelectedService(service);
                        }
                      }}
                    >
                      <div className="font-medium">{service.displayName}</div>
                      <div className="text-sm text-muted-foreground">{service.name}</div>
                      {service.businessOperations.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {service.businessOperations.length}個のオペレーション
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツエリア */}
        <div className="col-span-9">
          {selectedService ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedService.displayName}</CardTitle>
                    <CardDescription>{selectedService.description}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingService(selectedService)}
                  >
                    サービス情報編集
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="capability" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="capability">ケーパビリティ</TabsTrigger>
                    <TabsTrigger value="foundation">ドメイン言語</TabsTrigger>
                    <TabsTrigger value="api">API仕様</TabsTrigger>
                    <TabsTrigger value="db">DB設計</TabsTrigger>
                    <TabsTrigger value="generation">生成</TabsTrigger>
                  </TabsList>

                  <TabsContent value="capability" className="space-y-4">
                    <BusinessCapabilityEditor
                      serviceId={selectedService.id}
                      capabilities={selectedService.capabilities || []}
                      onSave={async (capabilities) => {
                        // 新規ケーパビリティをサーバーに保存
                        for (const cap of capabilities) {
                          if (!cap.id) {
                            // 新規ケーパビリティの場合
                            const result = await createBusinessCapability({
                              serviceId: selectedService.id,
                              name: cap.name,
                              displayName: cap.displayName,
                              description: cap.description,
                              category: cap.category
                            });
                            
                            if (result.success && result.data) {
                              cap.id = result.data.id;
                            }
                          }
                        }
                        
                        setSelectedService({
                          ...selectedService,
                          capabilities
                        });
                        setHasChanges(true);
                      }}
                      onOperationClick={(capability, operation) => {
                        handleEditOperation(capability, operation);
                      }}
                      onAddOperation={handleAddOperation}
                      onEditOperation={handleEditOperation}
                      onDeleteOperation={handleDeleteOperation}
                      onGenerateOperations={async (capability, operations) => {
                        // オペレーションを生成して保存
                        try {
                          console.log('Generating operations for capability:', capability);
                          console.log('Generated operations:', operations);
                          
                          const createdOps = [];
                          
                          for (const op of operations) {
                            const result = await createBusinessOperation({
                              serviceId: selectedService.id,
                              capabilityId: capability.id,
                              name: op.name,
                              displayName: op.displayName,
                              pattern: op.pattern,
                              goal: op.goal,
                              roles: [],
                              operations: [],
                              businessStates: [],
                              useCases: [],
                              uiDefinitions: [],
                              testCases: []
                            });
                            
                            console.log('Create operation result:', result);
                            
                            if (result.success && result.data) {
                              createdOps.push(result.data);
                            } else {
                              console.error('Failed to create operation:', result.error);
                            }
                          }
                          
                          console.log('Created operations:', createdOps);
                          
                          // ケーパビリティのオペレーションリストを更新
                          const updatedCapabilities = selectedService.capabilities?.map(cap => 
                            cap.id === capability.id 
                              ? { ...cap, businessOperations: createdOps }
                              : cap
                          ) || [];
                          
                          setSelectedService({
                            ...selectedService,
                            capabilities: updatedCapabilities
                          });
                          
                          toast({
                            title: 'オペレーション生成完了',
                            description: `${createdOps.length}件のオペレーションを生成しました`,
                          });
                          
                          // ドメイン言語を自動生成
                          generateDomainLanguageFromCapabilities(updatedCapabilities);
                        } catch (error) {
                          console.error('Error generating operations:', error);
                          toast({
                            title: 'エラー',
                            description: 'オペレーションの生成に失敗しました',
                            variant: 'destructive',
                          });
                        }
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="foundation" className="space-y-4">
                    <UnifiedDesignEditor
                      type="domain"
                      value={JSON.stringify(selectedService.domainLanguage || getInitialDomainLanguage())}
                      onChange={(value) => {
                        try {
                          const parsed = JSON.parse(value);
                          handleDomainLanguageChange(parsed);
                        } catch (e) {
                          console.error('Invalid JSON:', e);
                        }
                      }}
                      serviceId={selectedService.id}
                    />
                  </TabsContent>

                  <TabsContent value="api" className="space-y-4">
                    <UnifiedDesignEditor
                      type="api"
                      value={JSON.stringify(selectedService.apiSpecification || getInitialAPISpec())}
                      onChange={(value) => {
                        try {
                          const parsed = JSON.parse(value);
                          handleAPISpecChange(parsed);
                        } catch (e) {
                          console.error('Invalid JSON:', e);
                        }
                      }}
                      serviceId={selectedService.id}
                    />
                  </TabsContent>

                  <TabsContent value="db" className="space-y-4">
                    <UnifiedDesignEditor
                      type="db"
                      value={JSON.stringify(selectedService.dbSchema || getInitialDBSchema())}
                      onChange={(value) => {
                        try {
                          const parsed = JSON.parse(value);
                          handleDBSchemaChange(parsed);
                        } catch (e) {
                          console.error('Invalid JSON:', e);
                        }
                      }}
                      serviceId={selectedService.id}
                    />
                  </TabsContent>
                  
                  <TabsContent value="generation" className="space-y-4">
                    <CodeGenerationPanel
                      serviceId={selectedService.id}
                      capabilities={selectedService.capabilities || []}
                      operations={selectedService.businessOperations || []}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-[600px] text-muted-foreground">
                <p>サービスを選択してください</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* サービス作成/編集フォーム */}
      {(showServiceForm || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          onSuccess={editingService ? handleServiceUpdated : handleServiceCreated}
        />
      )}
      
      {/* オペレーション編集モーダル */}
      <BusinessOperationEditor
        operation={editingOperation}
        isOpen={operationModalOpen}
        onClose={() => {
          setOperationModalOpen(false);
          setEditingOperation(null);
          setEditingCapability(null);
        }}
        onSave={handleOperationSave}
        onDelete={editingOperation?.id ? async (id) => {
          await handleDeleteOperation(editingCapability, editingOperation);
          setOperationModalOpen(false);
        } : undefined}
      />
    </div>
  );
}