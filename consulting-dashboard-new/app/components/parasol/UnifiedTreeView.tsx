'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, Package, Code, FileText, Layout, Maximize2, Minimize2 } from 'lucide-react';
import { TreeNode, ParasolService, BusinessCapability, BusinessOperation } from '@/types/parasol';
import { buildUnifiedTreeFromServices, searchNodes, flattenTree } from '@/lib/parasol/tree-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UnifiedTreeViewProps {
  services: Array<{
    service: ParasolService;
    capabilities: BusinessCapability[];
    operations: BusinessOperation[];
  }>;
  selectedNodeId?: string;
  onNodeSelect: (node: TreeNode) => void;
  expandedNodes: Set<string>;
  onToggleNode: (nodeId: string) => void;
  className?: string;
}

const nodeIcons = {
  service: Folder,
  capability: Package,
  operation: Code,
  useCase: FileText,
  page: Layout,
};

const nodeColors = {
  service: 'text-blue-600',
  capability: 'text-green-600',
  operation: 'text-purple-600',
  useCase: 'text-orange-600',
  page: 'text-pink-600',
};

export function UnifiedTreeView({
  services,
  selectedNodeId,
  onNodeSelect,
  expandedNodes,
  onToggleNode,
  className
}: UnifiedTreeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNodes, setFilteredNodes] = useState<Set<string>>(new Set());
  
  // 統合されたツリー構造を構築
  const treeNodes = buildUnifiedTreeFromServices(services);
  
  // 検索処理
  useEffect(() => {
    if (!searchTerm) {
      setFilteredNodes(new Set());
      return;
    }
    
    const matchedNodes = searchNodes(treeNodes, searchTerm);
    const nodeIds = new Set<string>();
    
    // マッチしたノードとその親を含める
    matchedNodes.forEach(node => {
      nodeIds.add(node.id);
      // 親ノードも展開対象に追加
      if (node.parentId) {
        nodeIds.add(node.parentId);
      }
    });
    
    setFilteredNodes(nodeIds);
  }, [searchTerm, treeNodes]);
  
  // ノードの再帰的レンダリング
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const Icon = nodeIcons[node.type] || Folder;
    const colorClass = nodeColors[node.type] || 'text-gray-600';
    
    // 検索フィルタリング
    const isVisible = !searchTerm || filteredNodes.has(node.id) || 
      (node.children?.some(child => filteredNodes.has(child.id)));
    
    if (!isVisible) return null;
    
    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-md cursor-pointer transition-colors",
            isSelected && "bg-muted border-l-2 border-primary",
            "group"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            onNodeSelect(node);
            if (hasChildren) {
              onToggleNode(node.id);
            }
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleNode(node.id);
              }}
              className="p-0.5 hover:bg-muted-foreground/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          
          <Icon className={cn("h-4 w-4", colorClass)} />
          
          <span className={cn(
            "flex-1 text-sm truncate",
            isSelected && "font-medium"
          )}>
            {node.displayName}
          </span>
          
          {/* ノード数の表示 */}
          {hasChildren && (
            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              ({node.children.length})
            </span>
          )}
        </div>
        
        {/* 子ノードの表示 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // 全展開/全折りたたみ処理
  const handleExpandAll = () => {
    const allNodeIds = new Set<string>();
    treeNodes.forEach(node => {
      flattenTree(node).forEach(n => allNodeIds.add(n.id));
    });
    onToggleNode('__EXPAND_ALL__'); // 特殊なIDを送信して親コンポーネントに通知
    expandedNodes.clear();
    allNodeIds.forEach(id => expandedNodes.add(id));
  };

  const handleCollapseAll = () => {
    onToggleNode('__COLLAPSE_ALL__'); // 特殊なIDを送信して親コンポーネントに通知
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* 検索フィールドと操作ボタン */}
      <div className="p-2 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExpandAll}
            className="flex-1"
          >
            <Maximize2 className="h-3 w-3 mr-1" />
            すべて展開
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCollapseAll}
            className="flex-1"
          >
            <Minimize2 className="h-3 w-3 mr-1" />
            すべて閉じる
          </Button>
        </div>
      </div>
      
      {/* ツリー表示エリア */}
      <div className="flex-1 overflow-auto">
        {treeNodes.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            サービスが登録されていません
          </div>
        ) : (
          <div className="py-1">
            {treeNodes.map(node => renderNode(node))}
          </div>
        )}
      </div>
      
      {/* カテゴリ統計 */}
      {services.length > 0 && (
        <div className="p-2 border-t text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>サービス: {services.length}</span>
            <span>
              ケーパビリティ: {services.reduce((sum, s) => sum + s.capabilities.length, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}