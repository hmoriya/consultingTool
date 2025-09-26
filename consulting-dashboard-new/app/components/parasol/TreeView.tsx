'use client';

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown, Package, Code, FileText, Layout, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TreeNode } from '@/types/parasol';

interface TreeViewProps {
  nodes: TreeNode[];
  selectedNodeId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  className?: string;
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedNodeId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  onToggleExpand: (nodeId: string) => void;
}

// ノードタイプに対応するアイコン
const nodeIcons = {
  service: Folder,
  capability: Package,
  operation: Code,
  useCase: FileText,
  page: Layout,
};

// ノードタイプに対応する色
const nodeColors = {
  service: 'text-blue-600',
  capability: 'text-purple-600',
  operation: 'text-green-600',
  useCase: 'text-orange-600',
  page: 'text-pink-600',
};

function TreeNodeComponent({
  node,
  level,
  selectedNodeId,
  onNodeSelect,
  onToggleExpand,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedNodeId;
  const Icon = nodeIcons[node.type];

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect?.(node);
  }, [node, onNodeSelect]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(node.id);
  }, [node.id, onToggleExpand]);

  return (
    <div>
      <div
        className={cn(
          'group flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors',
          isSelected
            ? 'bg-primary/10 text-primary font-medium'
            : 'hover:bg-muted',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="mr-1 p-0.5 hover:bg-muted-foreground/10 rounded"
          >
            {node.isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        
        <Icon className={cn('h-4 w-4 mr-2 flex-shrink-0', nodeColors[node.type])} />
        
        <span className="truncate flex-1">{node.displayName}</span>
        
        {node.metadata?.count && (
          <span className="ml-auto text-xs text-muted-foreground">
            ({node.metadata.count})
          </span>
        )}
      </div>

      {hasChildren && node.isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({
  nodes,
  selectedNodeId,
  onNodeSelect,
  className,
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // ノードの展開状態を更新
  const nodesWithExpanded = React.useMemo(() => {
    const updateExpanded = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => ({
        ...node,
        isExpanded: expandedNodes.has(node.id),
        children: node.children ? updateExpanded(node.children) : undefined,
      }));
    };
    return updateExpanded(nodes);
  }, [nodes, expandedNodes]);

  return (
    <div className={cn('py-2', className)}>
      {nodesWithExpanded.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          level={0}
          selectedNodeId={selectedNodeId}
          onNodeSelect={onNodeSelect}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </div>
  );
}