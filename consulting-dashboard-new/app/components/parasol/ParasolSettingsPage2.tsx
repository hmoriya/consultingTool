'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Search, Plus, Save, FolderTree } from 'lucide-react';
import { saveServiceData, createBusinessOperation, createBusinessCapability, updateBusinessOperation, deleteBusinessOperation } from '@/app/actions/parasol';
import { ParasolTreeView } from './ParasolTreeView';
import { UnifiedTreeView } from './UnifiedTreeView';
import { TreeNode, ParasolService } from '@/types/parasol';
import { UnifiedDesignEditor, DesignType } from './UnifiedDesignEditor';
import { ServiceForm } from './ServiceForm';
import { BusinessCapabilityEditor } from './BusinessCapabilityEditor';
import { BusinessOperationEditor } from './BusinessOperationEditor';
import { CodeGenerationPanel } from './CodeGenerationPanel';
import { DomainLanguageDefinition, APISpecification, DBSchema } from '@/types/parasol';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/app/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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

export function ParasolSettingsPage2({ initialServices }: ParasolSettingsPageProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // 初期表示時にすべてのノードを展開
  useEffect(() => {
    if (services.length > 0 && expandedNodes.size === 0) {
      const allNodeIds = new Set<string>();
      
      // すべてのノードIDを収集
      services.forEach(service => {
        allNodeIds.add(service.id);
        
        // ケーパビリティのIDを追加
        if (service.capabilities) {
          service.capabilities.forEach(capability => {
            allNodeIds.add(capability.id);
            
            // オペレーションのIDを追加
            const operations = service.businessOperations?.filter(op => op.capabilityId === capability.id) || [];
            operations.forEach(operation => {
              allNodeIds.add(operation.id);
            });
          });
        }
      });
      
      setExpandedNodes(allNodeIds);
    }
  }, [services]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  
  // オペレーション編集モーダルの状態
  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [editingOperation, setEditingOperation] = useState<any>(null);
  const [editingCapability, setEditingCapability] = useState<any>(null);

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

  // ノード選択時の処理
  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
    
    // ノードタイプに応じて詳細画面を切り替え
    if (node.type === 'service') {
      // サービスノードが選択された場合
      const service = services.find(s => s.id === node.id);
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
        dbSchema: selectedService.dbSchema
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
            <Tabs defaultValue="domain" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="domain">ドメイン言語</TabsTrigger>
                <TabsTrigger value="api">API仕様</TabsTrigger>
                <TabsTrigger value="db">DB設計</TabsTrigger>
                <TabsTrigger value="capability">ケーパビリティ</TabsTrigger>
                <TabsTrigger value="generation">生成</TabsTrigger>
              </TabsList>

              <TabsContent value="domain">
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

              <TabsContent value="api">
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

              <TabsContent value="db">
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

              <TabsContent value="generation">
                <CodeGenerationPanel
                  serviceId={selectedService.id}
                  capabilities={selectedService.capabilities || []}
                  operations={selectedService.businessOperations || []}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      );
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
              <CardDescription>ケーパビリティの詳細</CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedDesignEditor
                type="capability"
                value={JSON.stringify({ capabilities: [capability], operations: [] })}
                onChange={(value) => {
                  // ケーパビリティ変更処理
                }}
                serviceId={selectedService.id}
                capabilityId={capability.id}
              />
            </CardContent>
          </Card>
        );

      case 'operation':
        const operation = selectedService.businessOperations?.find(o => o.id === selectedNode.id);
        if (!operation) return null;

        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{selectedNode.displayName}</CardTitle>
              <CardDescription>オペレーションの詳細</CardDescription>
            </CardHeader>
            <CardContent>
              <UnifiedDesignEditor
                type="operation"
                value={JSON.stringify(operation)}
                onChange={(value) => {
                  // オペレーション変更処理
                }}
                serviceId={selectedService.id}
                capabilityId={operation.capabilityId}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] w-full">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">パラソル設計管理</h1>
          <p className="text-muted-foreground mt-1">
            階層構造でサービス設計を管理
          </p>
        </div>
      </div>

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
                    services={filteredServices.map(service => ({
                      service: service as ParasolService,
                      capabilities: service.capabilities || [],
                      operations: service.businessOperations || []
                    }))}
                    selectedNodeId={selectedNode?.id}
                    onNodeSelect={handleNodeSelect}
                    expandedNodes={expandedNodes}
                    onToggleNode={(nodeId) => {
                      if (nodeId === '__EXPAND_ALL__') {
                        // すべて展開
                        const allNodeIds = new Set<string>();
                        filteredServices.forEach(service => {
                          allNodeIds.add(service.id);
                          if (service.capabilities) {
                            service.capabilities.forEach(capability => {
                              allNodeIds.add(capability.id);
                              const operations = service.businessOperations?.filter(op => op.capabilityId === capability.id) || [];
                              operations.forEach(operation => {
                                allNodeIds.add(operation.id);
                              });
                            });
                          }
                        });
                        setExpandedNodes(allNodeIds);
                      } else if (nodeId === '__COLLAPSE_ALL__') {
                        // すべて折りたたむ
                        setExpandedNodes(new Set());
                      } else {
                        // 通常のトグル
                        const newExpanded = new Set(expandedNodes);
                        if (newExpanded.has(nodeId)) {
                          newExpanded.delete(nodeId);
                        } else {
                          newExpanded.add(nodeId);
                        }
                        setExpandedNodes(newExpanded);
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full p-4">
            {renderDetailContent()}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

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
    </div>
  );
}