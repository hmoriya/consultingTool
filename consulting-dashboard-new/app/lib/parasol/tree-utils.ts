/**
 * パラソル設計の階層構造をツリーノードに変換するユーティリティ
 */

import { TreeNode, ParasolService, BusinessCapability, BusinessOperation } from '@/types/parasol';

// Path utility functions defined inline to avoid import issues
function buildApiUsageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/api-usage.md`;
}

function buildUsecaseFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/usecase.md`;
}

function buildPageFilePath(serviceName: string, capabilityName: string, operationName: string, usecaseName: string): string {
  return `docs/parasol/services/${serviceName}/capabilities/${capabilityName}/operations/${operationName}/usecases/${usecaseName}/page.md`;
}

/**
 * サービス、ケーパビリティ、オペレーションからツリー構造を構築（同期版・後方互換）
 */
export function buildTreeFromParasolData(
  service: ParasolService,
  capabilities: BusinessCapability[],
  operations: BusinessOperation[]
): TreeNode {
  // 同期版では空のコンテンツを使用
  return buildTreeFromParasolDataSync(service, capabilities, operations);
}

/**
 * サービス、ケーパビリティ、オペレーションからツリー構造を構築（非同期版・ファイル読み込み対応）
 */
export async function buildTreeFromParasolDataAsync(
  service: ParasolService,
  capabilities: BusinessCapability[],
  operations: BusinessOperation[]
): Promise<TreeNode> {
  // サービスノード（ルート）
  const serviceNode: TreeNode = {
    id: service.id,
    name: service.name,
    displayName: service.displayName,
    type: 'service',
    children: [],
    metadata: {
      description: service.description,
      capabilityCount: capabilities.length,
    },
  };

  // ケーパビリティをカテゴリ別にグループ化
  const capabilityGroups = groupCapabilitiesByCategory(capabilities);

  // カテゴリ別にケーパビリティノードを作成（非同期処理対応）
  for (const [category, caps] of Object.entries(capabilityGroups)) {
    for (const capability of caps) {
      const capabilityNode: TreeNode = {
        id: capability.id,
        name: capability.name,
        displayName: capability.displayName,
        type: 'capability',
        parentId: service.id,
        children: [],
        metadata: {
          category,
          description: capability.description,
        },
      };

      // オペレーションノードを追加
      const capOperations = operations.filter(op => op.capabilityId === capability.id);
      for (const operation of capOperations) {
        const operationNode: TreeNode = {
          id: operation.id,
          name: operation.name,
          displayName: operation.displayName,
          type: 'operation',
          parentId: capability.id,
          children: [],
          metadata: {
            pattern: operation.pattern,
            goal: operation.goal,
          },
        };

        // ユースケースモデルを追加（v2.0 ディレクトリ・ファイル構造）
        if ((operation as any).useCases && Array.isArray((operation as any).useCases)) {
          for (const useCase of (operation as any).useCases) {
            // ユースケースディレクトリノード
            const useCaseDirectoryNode: TreeNode = {
              id: useCase.id,
              name: useCase.name,
              displayName: useCase.displayName,
              type: 'directory',
              parentId: operation.id,
              children: [],
              metadata: {
                directoryType: 'usecase',
                description: useCase.description,
              },
            };

            // 1. usecase.md ファイルノード
            const useCaseFileNode: TreeNode = {
              id: `${useCase.id}-usecase-file`,
              name: 'usecase.md',
              displayName: 'ユースケース定義',
              type: 'usecaseFile',
              parentId: useCase.id,
              children: [],
              metadata: {
                fileName: 'usecase.md',
                fileType: 'markdown',
                content: useCase.definition || '',
                actors: useCase.actors,
                preconditions: useCase.preconditions,
                postconditions: useCase.postconditions,
                basicFlow: useCase.basicFlow,
                alternativeFlow: useCase.alternativeFlow,
                exceptionFlow: useCase.exceptionFlow,
                robustnessDiagram: useCase.robustnessDiagram,
              },
            };
            useCaseDirectoryNode.children?.push(useCaseFileNode);

            // 2. page.md ファイルノード
            if (useCase.pageDefinitions && Array.isArray(useCase.pageDefinitions) && useCase.pageDefinitions.length > 0) {
              const pageDef = useCase.pageDefinitions[0]; // v2.0では1対1関係
              const pageFileNode: TreeNode = {
                id: `${useCase.id}-page-file`,
                name: 'page.md',
                displayName: 'ページ定義',
                type: 'pageFile',
                parentId: useCase.id,
                children: [],
                metadata: {
                  fileName: 'page.md',
                  fileType: 'markdown',
                  content: pageDef.content || '',
                  description: pageDef.description,
                  url: pageDef.url,
                  layout: pageDef.layout,
                },
              };
              useCaseDirectoryNode.children?.push(pageFileNode);
            }

            // 3. api-usage.md ファイルノード（v2.0仕様）- DBからコンテンツ取得
            const apiUsageFileNode: TreeNode = {
              id: `${useCase.id}-api-usage-file`,
              name: 'api-usage.md',
              displayName: 'API利用仕様',
              type: 'apiUsageFile',
              parentId: useCase.id,
              children: [],
              metadata: {
                fileName: 'api-usage.md',
                fileType: 'markdown',
                content: useCase.apiUsageDefinition || '', // DBからAPI利用仕様を取得
                description: 'このユースケースでのAPI利用方法',
                useCaseId: useCase.id, // デバッグ用
              },
            };
            useCaseDirectoryNode.children?.push(apiUsageFileNode);

            operationNode.children?.push(useCaseDirectoryNode);
          }
        }
        // 従来のuseCasesプロパティも後方互換性のため残す
        else if (operation.useCases && Array.isArray(operation.useCases)) {
          operation.useCases.forEach((useCase, index) => {
            const useCaseNode: TreeNode = {
              id: `${operation.id}-usecase-${index}`,
              name: useCase.name || `UseCase${index + 1}`,
              displayName: useCase.displayName || `ユースケース ${index + 1}`,
              type: 'useCase',
              parentId: operation.id,
              children: [],
              metadata: useCase,
            };
            operationNode.children?.push(useCaseNode);
          });
        }

        if (operation.uiDefinitions && Array.isArray(operation.uiDefinitions)) {
          operation.uiDefinitions.forEach((page, index) => {
            const pageNode: TreeNode = {
              id: `${operation.id}-page-${index}`,
              name: page.name || `Page${index + 1}`,
              displayName: page.displayName || `ページ ${index + 1}`,
              type: 'page',
              parentId: operation.id,
              metadata: page,
            };
            operationNode.children?.push(pageNode);
          });
        }

        capabilityNode.children?.push(operationNode);
      }

      serviceNode.children?.push(capabilityNode);
    }
  }

  return serviceNode;
}

/**
 * サービス、ケーパビリティ、オペレーションからツリー構造を構築（同期版）
 */
function buildTreeFromParasolDataSync(
  service: ParasolService,
  capabilities: BusinessCapability[],
  operations: BusinessOperation[]
): TreeNode {
  // サービスノード（ルート）
  const serviceNode: TreeNode = {
    id: service.id,
    name: service.name,
    displayName: service.displayName,
    type: 'service',
    children: [],
    metadata: {
      description: service.description,
      capabilityCount: capabilities.length,
    },
  };

  // ケーパビリティをカテゴリ別にグループ化
  const capabilityGroups = groupCapabilitiesByCategory(capabilities);

  // カテゴリ別にケーパビリティノードを作成
  Object.entries(capabilityGroups).forEach(([category, caps]) => {
    caps.forEach((capability) => {
      const capabilityNode: TreeNode = {
        id: capability.id,
        name: capability.name,
        displayName: capability.displayName,
        type: 'capability',
        parentId: service.id,
        children: [],
        metadata: {
          category,
          description: capability.description,
        },
      };

      // オペレーションノードを追加
      const capOperations = operations.filter(op => op.capabilityId === capability.id);
      capOperations.forEach((operation) => {
        const operationNode: TreeNode = {
          id: operation.id,
          name: operation.name,
          displayName: operation.displayName,
          type: 'operation',
          parentId: capability.id,
          children: [],
          metadata: {
            pattern: operation.pattern,
            goal: operation.goal,
          },
        };

        // ユースケースモデルを追加（v2.0 ディレクトリ・ファイル構造）
        if ((operation as any).useCases && Array.isArray((operation as any).useCases)) {
          (operation as any).useCases.forEach((useCase: any) => {
            // ユースケースディレクトリノード
            const useCaseDirectoryNode: TreeNode = {
              id: useCase.id,
              name: useCase.name,
              displayName: useCase.displayName,
              type: 'directory',
              parentId: operation.id,
              children: [],
              metadata: {
                directoryType: 'usecase',
                description: useCase.description,
              },
            };

            // 1. usecase.md ファイルノード
            const useCaseFileNode: TreeNode = {
              id: `${useCase.id}-usecase-file`,
              name: 'usecase.md',
              displayName: 'ユースケース定義',
              type: 'usecaseFile',
              parentId: useCase.id,
              children: [],
              metadata: {
                fileName: 'usecase.md',
                fileType: 'markdown',
                content: useCase.definition || '',
                actors: useCase.actors,
                preconditions: useCase.preconditions,
                postconditions: useCase.postconditions,
                basicFlow: useCase.basicFlow,
                alternativeFlow: useCase.alternativeFlow,
                exceptionFlow: useCase.exceptionFlow,
                robustnessDiagram: useCase.robustnessDiagram,
              },
            };
            useCaseDirectoryNode.children?.push(useCaseFileNode);

            // 2. page.md ファイルノード
            if (useCase.pageDefinitions && Array.isArray(useCase.pageDefinitions) && useCase.pageDefinitions.length > 0) {
              const pageDef = useCase.pageDefinitions[0]; // v2.0では1対1関係
              const pageFileNode: TreeNode = {
                id: `${useCase.id}-page-file`,
                name: 'page.md',
                displayName: 'ページ定義',
                type: 'pageFile',
                parentId: useCase.id,
                children: [],
                metadata: {
                  fileName: 'page.md',
                  fileType: 'markdown',
                  content: pageDef.content || '',
                  description: pageDef.description,
                  url: pageDef.url,
                  layout: pageDef.layout,
                },
              };
              useCaseDirectoryNode.children?.push(pageFileNode);
            }

            // 3. api-usage.md ファイルノード（v2.0仕様）- DBからコンテンツ取得
            const apiUsageFileNode: TreeNode = {
              id: `${useCase.id}-api-usage-file`,
              name: 'api-usage.md',
              displayName: 'API利用仕様',
              type: 'apiUsageFile',
              parentId: useCase.id,
              children: [],
              metadata: {
                fileName: 'api-usage.md',
                fileType: 'markdown',
                content: useCase.apiUsageDefinition || '', // DBからAPI利用仕様を取得
                description: 'このユースケースでのAPI利用方法',
                useCaseId: useCase.id, // デバッグ用
              },
            };
            useCaseDirectoryNode.children?.push(apiUsageFileNode);

            operationNode.children?.push(useCaseDirectoryNode);
          });
        }
        // 従来のuseCasesプロパティも後方互換性のため残す
        else if (operation.useCases && Array.isArray(operation.useCases)) {
          operation.useCases.forEach((useCase, index) => {
            const useCaseNode: TreeNode = {
              id: `${operation.id}-usecase-${index}`,
              name: useCase.name || `UseCase${index + 1}`,
              displayName: useCase.displayName || `ユースケース ${index + 1}`,
              type: 'useCase',
              parentId: operation.id,
              children: [],
              metadata: useCase,
            };
            operationNode.children?.push(useCaseNode);
          });
        }

        if (operation.uiDefinitions && Array.isArray(operation.uiDefinitions)) {
          operation.uiDefinitions.forEach((page, index) => {
            const pageNode: TreeNode = {
              id: `${operation.id}-page-${index}`,
              name: page.name || `Page${index + 1}`,
              displayName: page.displayName || `ページ ${index + 1}`,
              type: 'page',
              parentId: operation.id,
              metadata: page,
            };
            operationNode.children?.push(pageNode);
          });
        }

        capabilityNode.children?.push(operationNode);
      });

      serviceNode.children?.push(capabilityNode);
    });
  });

  return serviceNode;
}

/**
 * 複数のサービスから統合されたツリー構造を構築（同期版）
 */
export function buildUnifiedTreeFromServices(
  services: Array<{
    service: ParasolService;
    capabilities: BusinessCapability[];
    operations: BusinessOperation[];
  }>
): TreeNode[] {
  return services.map(({ service, capabilities, operations }) =>
    buildTreeFromParasolData(service, capabilities, operations)
  );
}

/**
 * 複数のサービスから統合されたツリー構造を構築（非同期版・ファイル読み込み対応）
 */
export async function buildUnifiedTreeFromServicesAsync(
  services: Array<{
    service: ParasolService;
    capabilities: BusinessCapability[];
    operations: BusinessOperation[];
  }>
): Promise<TreeNode[]> {
  const results = [];
  for (const { service, capabilities, operations } of services) {
    const serviceTree = await buildTreeFromParasolDataAsync(service, capabilities, operations);
    results.push(serviceTree);
  }
  return results;
}

/**
 * ケーパビリティをカテゴリ別にグループ化
 */
function groupCapabilitiesByCategory(capabilities: BusinessCapability[]): Record<string, BusinessCapability[]> {
  return capabilities.reduce((groups, capability) => {
    const category = capability.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(capability);
    return groups;
  }, {} as Record<string, BusinessCapability[]>);
}

/**
 * ノードIDからパスを取得
 */
export function getNodePath(nodeId: string, rootNode: TreeNode): TreeNode[] {
  const path: TreeNode[] = [];
  
  const findPath = (node: TreeNode, targetId: string, currentPath: TreeNode[]): boolean => {
    currentPath.push(node);
    
    if (node.id === targetId) {
      path.push(...currentPath);
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findPath(child, targetId, [...currentPath])) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findPath(rootNode, nodeId, []);
  return path;
}

/**
 * ノードIDからノードを検索
 */
export function findNodeById(nodeId: string, nodes: TreeNode[]): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(nodeId, node.children);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * 親ノードを取得
 */
export function getParentNode(nodeId: string, rootNode: TreeNode): TreeNode | undefined {
  const path = getNodePath(nodeId, rootNode);
  return path.length > 1 ? path[path.length - 2] : undefined;
}

/**
 * ツリー内の全ノードを平坦化
 */
export function flattenTree(node: TreeNode): TreeNode[] {
  const result: TreeNode[] = [node];
  if (node.children) {
    node.children.forEach(child => {
      result.push(...flattenTree(child));
    });
  }
  return result;
}

/**
 * ノードの検索（キーワードマッチング）
 */
export function searchNodes(nodes: TreeNode[], keyword: string): TreeNode[] {
  const lowerKeyword = keyword.toLowerCase();
  const results: TreeNode[] = [];
  
  const searchInNode = (node: TreeNode) => {
    const nameMatch = node.name.toLowerCase().includes(lowerKeyword);
    const displayNameMatch = node.displayName.toLowerCase().includes(lowerKeyword);
    const descriptionMatch = node.metadata?.description?.toLowerCase().includes(lowerKeyword);
    
    if (nameMatch || displayNameMatch || descriptionMatch) {
      results.push(node);
    }
    
    if (node.children) {
      node.children.forEach(searchInNode);
    }
  };
  
  nodes.forEach(searchInNode);
  return results;
}

/**
 * ノードのカウント情報を更新
 */
export function updateNodeCounts(node: TreeNode): TreeNode {
  if (!node.children || node.children.length === 0) {
    return node;
  }
  
  const updatedChildren = node.children.map(updateNodeCounts);
  const totalCount = updatedChildren.reduce((sum, child) => {
    const childCount = child.metadata?.count || (child.children?.length || 0);
    return sum + childCount;
  }, 0);
  
  return {
    ...node,
    children: updatedChildren,
    metadata: {
      ...node.metadata,
      count: totalCount,
    },
  };
}