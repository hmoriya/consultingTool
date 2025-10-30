'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Search, Plus, Save, FolderTree, Code } from 'lucide-react';
import { saveServiceData, createBusinessOperation, createBusinessCapability, updateBusinessOperation, deleteBusinessOperation, getUseCasesForOperation } from '@/app/actions/parasol';
import { ParasolTreeView } from './ParasolTreeView';
import { UnifiedTreeView } from './UnifiedTreeView';
import { TreeNode, ParasolService } from '@/types/parasol';
import { buildTreeFromParasolData, flattenTree } from '@/app/lib/parasol/tree-utils';
import { UnifiedDesignEditor, DesignType } from './UnifiedDesignEditor';
import { UnifiedMDEditor, MDEditorType } from './UnifiedMDEditor';
import { ServiceForm } from './ServiceForm';
import { BusinessCapabilityEditor } from './BusinessCapabilityEditor';
import { BusinessOperationEditor } from './BusinessOperationEditor';
import { UseCaseDialog } from './UseCaseDialog';
import { UseCaseListView } from './UseCaseListView';
import { CodeGenerationPanel } from './CodeGenerationPanel';
import { DomainLanguageDefinition, APISpecification, DBSchema } from '@/types/parasol';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/app/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { generateInitialDomainLanguageFromCapabilities, refineDomainLanguageFromOperations } from '@/lib/parasol/domain-language-generator';
import DuplicationAnalysisDashboard from './DuplicationAnalysisDashboard';
import DesignQualityDashboard from './DesignQualityDashboard';
import DesignRestructureDashboard from './DesignRestructureDashboard';
import APIUsageManagementPanel from './APIUsageManagementPanel';

interface Service {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  serviceDescription?: string; // MD形式のサービス説明
  domainLanguageDefinition?: string; // MD形式のドメイン言語定義
  apiSpecificationDefinition?: string; // MD形式のAPI仕様
  databaseDesignDefinition?: string; // MD形式のDB設計
  domainLanguage: any; // 既存のJSON形式（後で廃止予定）
  apiSpecification: any; // 既存のJSON形式（後で廃止予定）
  dbSchema: any; // 既存のJSON形式（後で廃止予定）
  capabilities?: any[];
  businessOperations: any[];
}

interface ParasolSettingsPageProps {
  initialServices: Service[];
}

export function ParasolSettingsPage2({ initialServices }: ParasolSettingsPageProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [mounted, setMounted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // オペレーション編集モーダルの状態
  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any>(null);
  const [editingCapability, setEditingCapability] = useState<any>(null);
  const [showUseCaseDialog, setShowUseCaseDialog] = useState(false);
  const [currentOperationForUseCase, setCurrentOperationForUseCase] = useState<string | null>(null);
  const [editingUseCase, setEditingUseCase] = useState<any>(null);
  const [operationUseCases, setOperationUseCases] = useState<any[]>([]);
  const [servicesWithUseCases, setServicesWithUseCases] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load usecases when a business operation is selected
  useEffect(() => {
    const loadUseCases = async () => {
      if (selectedNode?.type === 'operation') {
        try {
          const result = await getUseCasesForOperation(selectedNode.id);
          if (result.success) {
            setOperationUseCases(result.data || []);
          } else {
            console.error('Failed to load usecases:', result.error);
            setOperationUseCases([]);
          }
        } catch (error) {
          console.error('Error loading usecases:', error);
          setOperationUseCases([]);
        }
      } else {
        setOperationUseCases([]);
      }
    };

    loadUseCases();
  }, [selectedNode?.id, selectedNode?.type]);

  // 初期表示時にすべてのノードを展開（ユースケースデータ読み込み後）
  useEffect(() => {
    if (servicesWithUseCases.length > 0 && expandedNodes.size === 0) {
      const allNodeIds = new Set<string>();

      // すべてのノードIDを収集
      servicesWithUseCases.forEach(service => {
        allNodeIds.add(service.id);

        // ケーパビリティのIDを追加
        if (service.capabilities) {
          service.capabilities.forEach(capability => {
            allNodeIds.add(capability.id);

            // オペレーションのIDを追加
            const operations = service.businessOperations?.filter(op => op.capabilityId === capability.id) || [];
            operations.forEach(operation => {
              allNodeIds.add(operation.id);
              // ユースケースのIDも追加
              if (operation.useCaseModels) {
                operation.useCaseModels.forEach((uc: any) => {
                  allNodeIds.add(uc.id);
                });
              }
            });
          });
        }

        // ケーパビリティに属さないオペレーションも処理
        const uncategorizedOps = service.businessOperations?.filter(op => !op.capabilityId) || [];
        uncategorizedOps.forEach(operation => {
          allNodeIds.add(operation.id);
          if (operation.useCaseModels) {
            operation.useCaseModels.forEach((uc: any) => {
              allNodeIds.add(uc.id);
            });
          }
        });
      });

      setExpandedNodes(allNodeIds);
    }
  }, [servicesWithUseCases.length]); // servicesWithUseCases.lengthの変更時にのみ実行

  // 全サービスのユースケースを取得する
  useEffect(() => {
    const loadAllUseCases = async () => {
      const updatedServices = await Promise.all(
        services.map(async (service) => {
          const updatedOperations = await Promise.all(
            (service.businessOperations || []).map(async (operation) => {
              try {
                const result = await getUseCasesForOperation(operation.id);
                if (result.success) {
                  const operationWithUseCases = {
                    ...operation,
                    useCaseModels: result.data || []
                  };
                  return operationWithUseCases;
                }
              } catch (error) {
                console.error(`Error loading usecases for operation ${operation.id}:`, error);
              }
              return {
                ...operation,
                useCaseModels: []
              };
            })
          );

          return {
            ...service,
            businessOperations: updatedOperations
          };
        })
      );
      setServicesWithUseCases(updatedServices);
    };

    if (services.length > 0) {
      loadAllUseCases();
    }
  }, [services]);

  // ドメイン言語生成関数
  const handleGenerateDomainLanguageFromCapability = () => {
    if (!selectedService.capabilities || selectedService.capabilities.length === 0) {
      toast({
        title: 'エラー',
        description: 'ケーパビリティが定義されていません',
        variant: 'destructive',
      });
      return;
    }
    
    // ケーパビリティ定義から初期ドメイン言語を生成
    const domainLanguage = generateInitialDomainLanguageFromCapabilities(selectedService.capabilities);
    
    setSelectedService({
      ...selectedService,
      domainLanguageDefinition: domainLanguage
    });
    setHasChanges(true);
    
    toast({
      title: '生成完了',
      description: 'ケーパビリティ定義から初期ドメイン言語を生成しました',
    });
  };
  
  const handleRefineDomainLanguageFromOperations = () => {
    if (!selectedService.businessOperations || selectedService.businessOperations.length === 0) {
      toast({
        title: 'エラー',
        description: 'ビジネスオペレーションが定義されていません',
        variant: 'destructive',
      });
      return;
    }
    
    // 既存のドメイン言語にオペレーションから抽出した詳細を追加
    const refinedDomainLanguage = refineDomainLanguageFromOperations(
      selectedService.domainLanguageDefinition || '',
      selectedService.businessOperations,
      selectedService.capabilities || []
    );
    
    setSelectedService({
      ...selectedService,
      domainLanguageDefinition: refinedDomainLanguage
    });
    setHasChanges(true);
    
    toast({
      title: '詳細化完了',
      description: 'ビジネスオペレーションからドメイン言語を詳細化しました',
    });
  };

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

  // ファイル編集ページへのナビゲーション関数
  const navigateToFileEditor = (node: TreeNode) => {
    // ファイルノードから編集ページのURLを構築
    const buildEditingRoute = (fileNode: TreeNode) => {
      // ファイルタイプの決定
      let fileType = '';
      switch (fileNode.type) {
        case 'usecaseFile':
          fileType = 'usecase';
          break;
        case 'pageFile':
          fileType = 'page';
          break;
        case 'apiUsageFile':
          fileType = 'api-usage';
          break;
        default:
          return null;
      }

      // 階層情報の取得（親ノードを辿る）
      let currentNode = fileNode;
      let usecaseNode: TreeNode | null = null;
      let operationNode: TreeNode | null = null;
      let capabilityNode: TreeNode | null = null;
      let serviceNode: TreeNode | null = null;

      // 全サービスのツリーノードを平坦化してノード検索を可能にする
      const allNodes: TreeNode[] = [];
      const servicesToUse = servicesWithUseCases.length > 0 ? servicesWithUseCases : services;
      servicesToUse.forEach(service => {
        const serviceTreeNode = buildTreeFromParasolData(
          service as ParasolService,
          service.capabilities || [],
          service.businessOperations || []
        );
        allNodes.push(...flattenTree(serviceTreeNode));
      });

      // 親ノードを辿ってルートパスを構築
      const findParentByType = (nodeId: string, targetType: string): TreeNode | null => {
        for (const n of allNodes) {
          if (n.children?.some(child => child.id === nodeId)) {
            if (n.type === targetType) {
              return n;
            }
            // 再帰的に親を探す
            return findParentByType(n.id, targetType);
          }
        }
        return null;
      };

      // ユースケース（ディレクトリ）ノードを取得
      usecaseNode = findParentByType(fileNode.id, 'directory');
      if (!usecaseNode) return null;

      // オペレーションノードを取得
      operationNode = findParentByType(usecaseNode.id, 'operation');
      if (!operationNode) return null;

      // ケーパビリティノードを取得
      capabilityNode = findParentByType(operationNode.id, 'capability');
      if (!capabilityNode) return null;

      // サービスノードを取得
      serviceNode = findParentByType(capabilityNode.id, 'service');
      if (!serviceNode) return null;

      // ルートパスの構築
      const route = `/parasol/services/${serviceNode.name}/capabilities/${capabilityNode.name}/operations/${operationNode.name}/usecases/${usecaseNode.name}/edit/${fileType}`;
      return route;
    };

    const route = buildEditingRoute(node);
    if (route) {
      console.log('Navigating to:', route);
      router.push(route);
    } else {
      console.error('Could not build route for node:', node);
    }
  };

  // ノード選択時の処理
  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);

    // ファイルノードの場合は統合ビューで表示（フルスクリーンナビゲーションしない）
    if (node.type === 'usecaseFile' || node.type === 'pageFile' || node.type === 'apiUsageFile') {
      // ファイルノードの場合でも親サービスを見つけて設定する必要がある
      const findServiceForFileNode = (nodeId: string): Service | null => {
        // 全サービスのツリーノードを平坦化してノード検索を可能にする
        const allNodes: TreeNode[] = [];
        const servicesToUse = servicesWithUseCases.length > 0 ? servicesWithUseCases : services;
        servicesToUse.forEach(service => {
          const serviceTreeNode = buildTreeFromParasolData(
            service as ParasolService,
            service.capabilities || [],
            service.businessOperations || []
          );
          allNodes.push(...flattenTree(serviceTreeNode));
        });

        // ノードIDからサービスを特定
        for (const treeNode of allNodes) {
          if (treeNode.id === nodeId) {
            // このノードの親を辿ってサービスを見つける
            let currentNode = treeNode;
            while (currentNode) {
              if (currentNode.type === 'service') {
                return servicesToUse.find(s => s.id === currentNode.id) || null;
              }
              // 親ノードを探す
              const parentNode = allNodes.find(n => n.children?.some(child => child.id === currentNode.id));
              currentNode = parentNode || null;
            }
            break;
          }
        }
        return null;
      };

      const service = findServiceForFileNode(node.id);
      if (service) {
        setSelectedService(service);
      }

      // navigateToFileEditor(node); // この行をコメントアウトして統合表示に変更
      return;
    }

    // ノードタイプに応じて詳細画面を切り替え
    if (node.type === 'service') {
      // サービスノードが選択された場合
      const service = services.find(s => s.id === node.id);
      if (service) {
        setSelectedService(service);
      }
    } else if (node.type === 'capability' || node.type === 'operation' || node.type === 'useCase' || node.type === 'pageDefinition' || node.type === 'testDefinition') {
      // ケーパビリティ、オペレーション、ユースケース、ページ定義、テスト定義ノードが選択された場合
      // 親のサービスを見つける
      const findServiceForNode = (nodeId: string): Service | null => {
        for (const service of services) {
          // ケーパビリティをチェック
          if (service.capabilities?.some(c => c.id === nodeId)) {
            return service;
          }
          // オペレーションをチェック
          if (service.businessOperations?.some(o => o.id === nodeId)) {
            return service;
          }
          // ユースケースをチェック（オペレーション内）
          for (const op of service.businessOperations || []) {
            if (op.useCaseModels?.some((uc: any) => uc.id === nodeId)) {
              return service;
            }
            // ページ定義とテスト定義をチェック（ユースケース内）
            for (const uc of op.useCaseModels || []) {
              if (uc.pageDefinitions?.some((pd: any) => pd.id === nodeId)) {
                return service;
              }
              if (uc.testDefinitions?.some((td: any) => td.id === nodeId)) {
                return service;
              }
            }
          }
        }
        return null;
      };

      const service = findServiceForNode(node.id);
      if (service) {
        setSelectedService(service);
      }
    }
  };

  // 保存処理
  const handleSave = async () => {
    if (!selectedService || !hasChanges) return;

    try {
      const result = await saveServiceData(selectedService.id, {
        domainLanguage: selectedService.domainLanguage,
        apiSpecification: selectedService.apiSpecification,
        dbSchema: selectedService.dbSchema,
        serviceDescription: selectedService.serviceDescription,
        domainLanguageDefinition: selectedService.domainLanguageDefinition,
        apiSpecificationDefinition: selectedService.apiSpecificationDefinition,
        databaseDesignDefinition: selectedService.databaseDesignDefinition
      });

      if (result.success) {
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

  // 詳細表示コンテンツの切り替え
  const renderDetailContent = () => {
    if (!selectedService) {
      return (
        <Card className="h-full">
          <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FolderTree className="h-12 w-12 mb-4" />
            <p>サービスまたはノードを選択してください</p>
          </CardContent>
        </Card>
      );
    }

    // サービスノードまたは未選択時はサービス全体を表示
    if (!selectedNode || selectedNode.type === 'service') {
      return (
        <Card className="h-full">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedService.displayName}</CardTitle>
                <CardDescription>{selectedService.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {hasChanges && (
                  <Button onClick={handleSave} variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    変更を保存
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingService(selectedService)}
                >
                  サービス情報編集
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto">
            <Tabs defaultValue="service-overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="service-overview">サービス概要</TabsTrigger>
                <TabsTrigger value="api-what-how">API仕様（WHAT/HOW）</TabsTrigger>
                <TabsTrigger value="design-management">設計管理</TabsTrigger>
                <TabsTrigger value="analysis-tools">分析ツール</TabsTrigger>
              </TabsList>

              <TabsContent value="service-overview">
                <Tabs defaultValue="service-description" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="service-description">サービス説明</TabsTrigger>
                    <TabsTrigger value="domain-language">ドメイン言語</TabsTrigger>
                    <TabsTrigger value="db-design">DB設計</TabsTrigger>
                    <TabsTrigger value="capability">ケーパビリティ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="service-description">
                    <UnifiedMDEditor
                      type="service-description"
                      value={selectedService.serviceDescription || ''}
                      onChange={(value) => {
                        setSelectedService({
                          ...selectedService,
                          serviceDescription: value
                        });
                        setHasChanges(true);
                      }}
                      onSave={handleSave}
                      title="サービス説明"
                      description="このサービスの概要、責務、依存関係をMarkdownで記述します"
                    />
                  </TabsContent>

                  <TabsContent value="domain-language">
                    <div className="space-y-4">
                      {/* ドメイン言語生成ボタン */}
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <div>
                              <strong>段階的ドメイン言語生成</strong>
                              <p className="text-sm mt-1">
                                ケーパビリティ定義から初期ドメイン言語を生成し、ビジネスオペレーションから詳細化できます。
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateDomainLanguageFromCapability()}
                                disabled={!selectedService.capabilities || selectedService.capabilities.length === 0}
                              >
                                ケーパビリティから生成
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRefineDomainLanguageFromOperations()}
                                disabled={!selectedService.businessOperations || selectedService.businessOperations.length === 0}
                              >
                                オペレーションから詳細化
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <UnifiedMDEditor
                        type="domain-language"
                        value={selectedService.domainLanguageDefinition || ''}
                        onChange={(value) => {
                          setSelectedService({
                            ...selectedService,
                            domainLanguageDefinition: value
                          });
                          setHasChanges(true);
                        }}
                        onSave={handleSave}
                        title="ドメイン言語定義"
                        description="エンティティ、値オブジェクト、ドメインサービスをMarkdownで定義します"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="db-design">
                    <UnifiedMDEditor
                      type="database-design"
                      value={selectedService.databaseDesignDefinition || ''}
                      onChange={(value) => {
                        setSelectedService({
                          ...selectedService,
                          databaseDesignDefinition: value
                        });
                        setHasChanges(true);
                      }}
                      onSave={handleSave}
                      title="DB設計"
                      description="テーブル、カラム、リレーションをMarkdownで定義します"
                    />
                  </TabsContent>

                  <TabsContent value="capability">
                    <BusinessCapabilityEditor
                      serviceId={selectedService.id}
                      capabilities={selectedService.capabilities || []}
                      onSave={async (capabilities) => {
                        // ケーパビリティ保存処理
                        setSelectedService({
                          ...selectedService,
                          capabilities
                        });
                        setHasChanges(true);
                      }}
                      onOperationClick={(capability, operation) => {
                        // オペレーションクリック処理
                      }}
                      onAddOperation={() => {}}
                      onEditOperation={() => {}}
                      onDeleteOperation={() => {}}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="api-what-how">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      API仕様管理（WHAT/HOW分離）
                    </CardTitle>
                    <CardDescription>
                      サービス全体API（WHAT）とユースケース別利用方法（HOW）を統合管理
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="what-api-spec" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="what-api-spec">
                          <div className="flex items-center gap-1">
                            📋 WHAT - サービスAPI仕様
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="how-api-usage">
                          <div className="flex items-center gap-1">
                            🔧 HOW - API利用状況
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="what-api-spec">
                        <Alert className="mb-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>WHAT</strong>: このサービスが「何ができるか」を定義します。
                            他サービス設計者・アーキテクト向けの情報です。
                          </AlertDescription>
                        </Alert>

                        <UnifiedMDEditor
                          type="api-specification"
                          value={selectedService.apiSpecificationDefinition || ''}
                          onChange={(value) => {
                            setSelectedService({
                              ...selectedService,
                              apiSpecificationDefinition: value
                            });
                            setHasChanges(true);
                          }}
                          onSave={handleSave}
                          title="サービス統合API仕様（WHAT）"
                          description="パラソルドメイン連携・SLA・制約・エンドポイント概要を定義"
                        />
                      </TabsContent>

                      <TabsContent value="how-api-usage">
                        <Alert className="mb-4">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>HOW</strong>: 各ユースケースで「どう使うか」を定義します。
                            実装エンジニア向けの具体的な利用方法です。
                          </AlertDescription>
                        </Alert>

                        <APIUsageManagementPanel />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design-management">
                <Tabs defaultValue="generation" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="generation">コード生成</TabsTrigger>
                    <TabsTrigger value="design-restructure">設計再構築</TabsTrigger>
                  </TabsList>

                  <TabsContent value="generation">
                    <CodeGenerationPanel
                      serviceId={selectedService.id}
                      capabilities={selectedService.capabilities || []}
                      operations={selectedService.businessOperations || []}
                    />
                  </TabsContent>

                  <TabsContent value="design-restructure">
                    <DesignRestructureDashboard />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="analysis-tools">
                <Tabs defaultValue="duplication-analysis" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="duplication-analysis">重複分析</TabsTrigger>
                    <TabsTrigger value="design-quality">設計品質</TabsTrigger>
                  </TabsList>

                  <TabsContent value="duplication-analysis">
                    <DuplicationAnalysisDashboard />
                  </TabsContent>

                  <TabsContent value="design-quality">
                    <DesignQualityDashboard />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      );
    }

    // ファイルノードの場合、親ユースケースノードを取得
    let usecaseNode: TreeNode | null = null;
    if (selectedNode.type === 'usecaseFile' || selectedNode.type === 'pageFile' || selectedNode.type === 'apiUsageFile') {
      // 全サービスのツリーノードを平坦化してノード検索を可能にする
      const allNodes: TreeNode[] = [];
      const servicesToUse = servicesWithUseCases.length > 0 ? servicesWithUseCases : services;
      servicesToUse.forEach(service => {
        const serviceTreeNode = buildTreeFromParasolData(
          service as ParasolService,
          service.capabilities || [],
          service.businessOperations || []
        );
        allNodes.push(...flattenTree(serviceTreeNode));
      });

      // 親ノードを辿ってユースケースディレクトリを見つける
      const findParentByType = (nodeId: string, targetType: string): TreeNode | null => {
        for (const n of allNodes) {
          if (n.children?.some(child => child.id === nodeId)) {
            if (n.type === targetType) {
              return n;
            }
            // 再帰的に親を探す
            return findParentByType(n.id, targetType);
          }
        }
        return null;
      };

      // ユースケース（ディレクトリ）ノードを取得
      usecaseNode = findParentByType(selectedNode.id, 'directory');
    }

    // ノードタイプに応じた詳細表示
    switch (selectedNode.type) {
      case 'capability':
        const capability = selectedService.capabilities?.find(c => c.id === selectedNode.id);
        if (!capability) return null;
        
        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{selectedNode.displayName}</CardTitle>
              <CardDescription>ケーパビリティ定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <UnifiedMDEditor
                type="capability-definition"
                value={capability.definition || ''}
                onChange={(value) => {
                  // ケーパビリティ変更処理
                  const updatedCapability = { ...capability, definition: value };
                  const updatedCapabilities = selectedService.capabilities?.map(c => 
                    c.id === capability.id ? updatedCapability : c
                  );
                  setSelectedService({
                    ...selectedService,
                    capabilities: updatedCapabilities
                  });
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="ケーパビリティ定義"
                description="このケーパビリティの責務と提供価値をMarkdownで記述します"
              />
            </CardContent>
          </Card>
        );

      case 'operation':
        // オペレーションはケーパビリティの下にある可能性があるので両方を探す
        let operation = selectedService.businessOperations?.find(o => o.id === selectedNode.id);
        
        // サービス直下になければ、ケーパビリティ配下を探す
        if (!operation && selectedService.capabilities) {
          for (const cap of selectedService.capabilities) {
            operation = cap.businessOperations?.find(o => o.id === selectedNode.id);
            if (operation) break;
          }
        }
        
        if (!operation) return null;

        return (
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle>{selectedNode.displayName}</CardTitle>
                <CardDescription>ビジネスオペレーション設計</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setCurrentOperationForUseCase(operation.id);
                  setEditingUseCase(null);
                  setShowUseCaseDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                UseCase追加
              </Button>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <Tabs defaultValue="design" className="w-full flex flex-col flex-1 min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="design">オペレーション設計</TabsTrigger>
                  <TabsTrigger value="usecases">ユースケース ({operationUseCases.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="flex flex-col flex-1 min-h-0">
                  <UnifiedMDEditor
                    type="operation-design"
                    value={operation.design || ''}
                    onChange={(value) => {
                      // オペレーション変更処理
                      const updatedOperation = { ...operation, design: value };

                      // オペレーションがサービス直下にある場合
                      if (selectedService.businessOperations?.some(o => o.id === operation.id)) {
                        const updatedOperations = selectedService.businessOperations.map(o =>
                          o.id === operation.id ? updatedOperation : o
                        );
                        setSelectedService({
                          ...selectedService,
                          businessOperations: updatedOperations
                        });
                      }
                      // オペレーションがケーパビリティ配下にある場合
                      else if (selectedService.capabilities) {
                        const updatedCapabilities = selectedService.capabilities.map(cap => {
                          if (cap.businessOperations?.some(o => o.id === operation.id)) {
                            return {
                              ...cap,
                              businessOperations: cap.businessOperations.map(o =>
                                o.id === operation.id ? updatedOperation : o
                              )
                            };
                          }
                          return cap;
                        });
                        setSelectedService({
                          ...selectedService,
                          capabilities: updatedCapabilities
                        });
                      }

                      setHasChanges(true);
                    }}
                    onSave={handleSave}
                    title="ビジネスオペレーション設計"
                    description="このオペレーションの処理フローと入出力をMarkdownで記述します"
                  />
                </TabsContent>

                <TabsContent value="usecases">
                  <UseCaseListView
                    operationId={operation.id}
                    useCases={operationUseCases.map(uc => ({
                      id: uc.id,
                      name: uc.name,
                      displayName: uc.displayName,
                      description: uc.description,
                      definition: uc.definition,
                      actors: uc.actors,
                      preconditions: uc.preconditions,
                      postconditions: uc.postconditions,
                      basicFlow: uc.basicFlow,
                      alternativeFlow: uc.alternativeFlow,
                      exceptionFlow: uc.exceptionFlow,
                      order: uc.order,
                    }))}
                    pageDefinitions={operationUseCases.flatMap(uc => uc.pageDefinitions || [])}
                    testDefinitions={operationUseCases.flatMap(uc => uc.testDefinitions || [])}
                    onAddUseCase={() => {
                      setCurrentOperationForUseCase(operation.id);
                      setEditingUseCase(null);
                      setShowUseCaseDialog(true);
                    }}
                    onEditUseCase={(useCase) => {
                      setCurrentOperationForUseCase(operation.id);
                      setEditingUseCase(useCase);
                      setShowUseCaseDialog(true);
                    }}
                    onDeleteUseCase={async (useCaseId) => {
                      // Delete usecase logic can be added here
                      console.log('Delete usecase:', useCaseId);
                    }}
                    onViewUseCase={(useCase) => {
                      // View usecase details logic can be added here
                      console.log('View usecase:', useCase);
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
        
      case 'useCase':
        // ユースケースの詳細表示
        const useCaseData = selectedNode.metadata;
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{selectedNode.displayName}</CardTitle>
              <CardDescription>ユースケース詳細</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <Tabs defaultValue="definition" className="w-full flex flex-col flex-1 min-h-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="definition">ユースケース定義</TabsTrigger>
                  <TabsTrigger value="robustness">ロバストネス図</TabsTrigger>
                  <TabsTrigger value="tests">テスト定義</TabsTrigger>
                </TabsList>

                <TabsContent value="definition" className="mt-4 flex flex-col flex-1 min-h-0">
                  <UnifiedMDEditor
                    type="usecase-definition"
                    value={useCaseData?.definition || ''}
                    onChange={(value) => {
                      // ユースケース変更処理
                      // TODO: ユースケースの更新ロジックを実装
                      setHasChanges(true);
                    }}
                    onSave={handleSave}
                    title="ユースケース定義"
                    description="アクター、事前/事後条件、基本フローをMarkdownで記述します"
                  />
                </TabsContent>

                <TabsContent value="robustness" className="mt-4 flex flex-col flex-1 min-h-0">
                  <UnifiedMDEditor
                    type="robustness-diagram"
                    value={useCaseData?.robustnessDiagram?.content || ''}
                    onChange={(value) => {
                      // ロバストネス図変更処理
                      // TODO: ロバストネス図の更新ロジックを実装
                      setHasChanges(true);
                    }}
                    onSave={handleSave}
                    title="ロバストネス図"
                    description="Boundary-Control-Entity パターンでユースケースを分析します"
                  />
                </TabsContent>

                <TabsContent value="tests" className="mt-4 flex flex-col flex-1 min-h-0">
                  <div className="space-y-4 flex-1 overflow-auto">
                    {useCaseData?.testDefinitions && useCaseData.testDefinitions.length > 0 ? (
                      useCaseData.testDefinitions.map((test: any, index: number) => (
                        <Card key={test.id || index}>
                          <CardHeader>
                            <CardTitle className="text-base">{test.displayName || test.name}</CardTitle>
                            <CardDescription>{test.testType || 'テスト'}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <UnifiedMDEditor
                              type="test-definition"
                              value={test.content || ''}
                              onChange={(value) => {
                                // テスト定義変更処理
                                // TODO: テスト定義の更新ロジックを実装
                                setHasChanges(true);
                              }}
                              onSave={handleSave}
                              title={test.displayName || test.name}
                              description="テストケース、期待結果をMarkdownで記述します"
                            />
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          このユースケースにはまだテスト定義がありません。
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );
        
      case 'pageDefinition':
        // ページ定義のMD表示
        const pageDef = selectedNode.metadata;
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{selectedNode.displayName}</CardTitle>
              <CardDescription>ページ定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <UnifiedMDEditor
                type="page-definition"
                value={pageDef?.content || ''}
                onChange={(value) => {
                  // ページ定義変更処理
                  // TODO: ページ定義の更新ロジックを実装
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="ページ定義"
                description="画面構成、振る舞い、遷移をMarkdownで記述します"
              />
            </CardContent>
          </Card>
        );
        
      case 'testDefinition':
        // テスト定義のMD表示
        const testDef = selectedNode.metadata;
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{selectedNode.displayName}</CardTitle>
              <CardDescription>テスト定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <UnifiedMDEditor
                type="test-definition"
                value={testDef?.content || ''}
                onChange={(value) => {
                  // テスト定義変更処理
                  // TODO: テスト定義の更新ロジックを実装
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="テスト定義"
                description="テストケース、期待結果をMarkdownで記述します"
              />
            </CardContent>
          </Card>
        );

      case 'usecaseFile':
        // ユースケースファイルの統合表示
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>ユースケース定義：{usecaseNode?.displayName || selectedNode.displayName}</CardTitle>
              <CardDescription>アクター、事前/事後条件、基本フローを定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <UnifiedMDEditor
                type="usecase-definition"
                value={selectedNode.metadata?.content || ''}
                onChange={(value) => {
                  // ファイル変更処理（統合ビューでの編集）
                  // TODO: ファイル更新ロジックを実装
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="ユースケース定義"
                description="統合ビューでユースケース定義を編集します"
              />
            </CardContent>
          </Card>
        );

      case 'pageFile':
        // ページファイルの統合表示
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>ページ定義：{usecaseNode?.displayName || selectedNode.displayName}</CardTitle>
              <CardDescription>画面構成、振る舞い、遷移を定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <UnifiedMDEditor
                type="page-definition"
                value={selectedNode.metadata?.content || ''}
                onChange={(value) => {
                  // ファイル変更処理（統合ビューでの編集）
                  // TODO: ファイル更新ロジックを実装
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="ページ定義"
                description="統合ビューでページ定義を編集します"
              />
            </CardContent>
          </Card>
        );

      case 'apiUsageFile':
        // API利用ファイルの統合表示
        return (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>API利用仕様：{usecaseNode?.displayName || selectedNode.displayName}</CardTitle>
              <CardDescription>呼び出しシーケンス、エラー対応を定義</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto flex flex-col flex-1 min-h-0">
              <UnifiedMDEditor
                type="api-specification"
                value={selectedNode.metadata?.content || ''}
                onChange={(value) => {
                  // ファイル変更処理（統合ビューでの編集）
                  // TODO: ファイル更新ロジックを実装
                  setHasChanges(true);
                }}
                onSave={handleSave}
                title="API利用仕様"
                description="統合ビューでAPI利用仕様を編集します"
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] w-full">
      <div className="mb-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">パラソル設計管理</h1>
          <p className="text-muted-foreground mt-1">
            階層構造でサービス設計を管理
          </p>
        </div>
      </div>

      {mounted ? (
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
          <div className="h-full flex flex-col">
            {/* サービス検索 */}
            <div className="p-4 border-b">
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
            </div>

            {/* 統合されたツリービュー */}
            <div className="flex-1 overflow-auto p-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">プロジェクト階層</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <UnifiedTreeView
                    services={servicesWithUseCases.length > 0
                      ? servicesWithUseCases
                          .filter(service =>
                            searchTerm === '' ||
                            service.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.name?.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map(service => ({
                            service: service as ParasolService,
                            capabilities: service.capabilities || [],
                            operations: service.businessOperations || []
                          }))
                      : filteredServices.map(service => ({
                          service: service as ParasolService,
                          capabilities: service.capabilities || [],
                          operations: service.businessOperations || []
                        }))
                    }
                    selectedNodeId={selectedNode?.id}
                    onNodeSelect={handleNodeSelect}
                    expandedNodes={expandedNodes}
                    onToggleNode={(nodeId) => {
                      setExpandedNodes(prev => {
                        if (nodeId === '__EXPAND_ALL__') {
                          // すべて展開
                          const allNodeIds = new Set<string>();
                          const servicesToUse = servicesWithUseCases.length > 0 ? servicesWithUseCases : filteredServices;
                          servicesToUse.forEach(service => {
                            allNodeIds.add(service.id);
                            if (service.capabilities) {
                              service.capabilities.forEach(capability => {
                                allNodeIds.add(capability.id);
                                const operations = service.businessOperations?.filter(op => op.capabilityId === capability.id) || [];
                                operations.forEach(operation => {
                                  allNodeIds.add(operation.id);
                                  // ユースケースのIDも追加
                                  if (operation.useCaseModels) {
                                    operation.useCaseModels.forEach((uc: any) => {
                                      allNodeIds.add(uc.id);
                                    });
                                  }
                                });
                              });
                            }
                          });
                          return allNodeIds;
                        } else if (nodeId === '__COLLAPSE_ALL__') {
                          // すべて折りたたむ
                          return new Set();
                        } else {
                          // 通常のトグル
                          const newExpanded = new Set(prev);
                          if (newExpanded.has(nodeId)) {
                            newExpanded.delete(nodeId);
                          } else {
                            newExpanded.add(nodeId);
                          }
                          return newExpanded;
                        }
                      });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full px-4 py-2 flex flex-col">
            {renderDetailContent()}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      ) : (
        <div className="h-full rounded-lg border flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      )}

      {/* サービス作成/編集フォーム */}
      {(showServiceForm || editingService) && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          onSuccess={(service) => {
            if (editingService) {
              const updatedServices = services.map(s =>
                s.id === service.id ? service : s
              );
              setServices(updatedServices);
              setSelectedService(service);
            } else {
              setServices([...services, service]);
              setSelectedService(service);
            }
            setShowServiceForm(false);
            setEditingService(null);
          }}
        />
      )}

      {/* UseCase作成/編集ダイアログ */}
      {showUseCaseDialog && currentOperationForUseCase && (
        <UseCaseDialog
          operationId={currentOperationForUseCase}
          useCase={editingUseCase}
          isOpen={showUseCaseDialog}
          onClose={async () => {
            setShowUseCaseDialog(false);
            setCurrentOperationForUseCase(null);
            setEditingUseCase(null);

            // Refresh usecases list if we're still on the same operation
            if (selectedNode?.type === 'operation' && currentOperationForUseCase === selectedNode.id) {
              try {
                const result = await getUseCasesForOperation(selectedNode.id);
                if (result.success) {
                  setOperationUseCases(result.data || []);
                }
              } catch (error) {
                console.error('Error refreshing usecases:', error);
              }
            }
          }}
        />
      )}
    </div>
  );
}