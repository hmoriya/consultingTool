/**
 * パラソル設計の階層構造をツリーノードに変換するユーティリティ
 */

import { TreeNode, ParasolService, BusinessCapability, BusinessOperation } from '@/types/parasol';

/**
 * サービス、ケーパビリティ、オペレーションからツリー構造を構築
 */
export function buildTreeFromParasolData(
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

        // ユースケースとページ定義を追加（今後の拡張用）
        if (operation.useCases && Array.isArray(operation.useCases)) {
          operation.useCases.forEach((useCase, index) => {
            const useCaseNode: TreeNode = {
              id: `${operation.id}-usecase-${index}`,
              name: useCase.name || `UseCase${index + 1}`,
              displayName: useCase.displayName || `ユースケース ${index + 1}`,
              type: 'useCase',
              parentId: operation.id,
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
 * 複数のサービスから統合されたツリー構造を構築
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