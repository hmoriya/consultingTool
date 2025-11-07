'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FolderTree, RefreshCw } from 'lucide-react';
import { TreeView } from './TreeView';
import { TreeNode, ParasolService, BusinessCapability, BusinessOperation } from '@/types/parasol';
import { buildTreeFromParasolData, searchNodes, updateNodeCounts } from '@/lib/parasol/tree-utils';
import { cn } from '@/lib/utils';

interface ParasolTreeViewProps {
  service: ParasolService;
  capabilities: BusinessCapability[];
  operations: BusinessOperation[];
  selectedNodeId?: string;
  onNodeSelect?: (node: TreeNode) => void;
  className?: string;
}

export function ParasolTreeView({
  service,
  capabilities,
  operations,
  selectedNodeId,
  onNodeSelect,
  className,
}: ParasolTreeViewProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredNodes, setFilteredNodes] = useState<TreeNode[]>([]);

  // ツリー構造の構築
  const treeRoot = useMemo(() => {
    const tree = buildTreeFromParasolData(service, capabilities, operations);
    return updateNodeCounts(tree);
  }, [service, capabilities, operations]);

  // 検索処理
  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setFilteredNodes([treeRoot]);
    } else {
      const results = searchNodes([treeRoot], searchKeyword);
      setFilteredNodes(results);
    }
  }, [searchKeyword, treeRoot]);

  // カテゴリ別の統計情報
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {
      Core: 0,
      Supporting: 0,
      Generic: 0,
    };
    capabilities.forEach(cap => {
      if (cap.category in stats) {
        stats[cap.category]++;
      }
    });
    return stats;
  }, [capabilities]);

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5" />
          <CardTitle>階層ナビゲーション</CardTitle>
        </div>
        <CardDescription>
          サービス、ケーパビリティ、オペレーションの階層構造
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* 検索バー */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="検索..."
              className="pl-9"
            />
          </div>
        </div>

        {/* カテゴリ統計 */}
        <div className="px-4 pb-3 flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            Core: {categoryStats.Core}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Supporting: {categoryStats.Supporting}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Generic: {categoryStats.Generic}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Total: {operations.length} operations
          </Badge>
        </div>

        {/* ツリービュー */}
        <ScrollArea className="flex-1 px-2">
          <TreeView
            nodes={searchKeyword ? filteredNodes : [treeRoot]}
            selectedNodeId={selectedNodeId}
            onNodeSelect={onNodeSelect}
          />
        </ScrollArea>

        {/* フッター */}
        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{service.displayName}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => setSearchKeyword('')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              リセット
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}