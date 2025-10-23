'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface GuideItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: GuideItem[];
}

interface GuideNavigatorProps {
  selectedPath: string | null;
  onSelectGuide: (path: string) => void;
}

// パラソル開発ガイドの構造定義
const GUIDE_STRUCTURE: GuideItem[] = [
  {
    name: 'パラソル開発ガイド',
    path: 'docs/parasol/PARASOL_DEVELOPMENT_GUIDE.md',
    type: 'file',
  },
  {
    name: 'パラソルガイドサマリー',
    path: 'docs/parasol/PARASOL_GUIDE_SUMMARY.md',
    type: 'file',
  },
  {
    name: '設計プロセスガイド',
    path: 'docs/parasol/parasol-design-process-guide.md',
    type: 'file',
  },
  {
    name: '品質保証ガイド',
    path: 'docs/parasol/parasol-quality-assurance-guide.md',
    type: 'file',
  },
  {
    name: 'API利用重複排除ガイドライン',
    path: 'docs/parasol/api-usage-deduplication-guidelines.md',
    type: 'file',
  },
  {
    name: 'ディレクトリ構造標準 v2',
    path: 'docs/parasol/directory-structure-standard-v2.md',
    type: 'file',
  },
  {
    name: 'Mermaid変換仕様',
    path: 'docs/parasol/mermaid-conversion-spec.md',
    type: 'file',
  },
  {
    name: 'パラソル構造',
    path: 'docs/parasol/PARASOL_STRUCTURE.md',
    type: 'file',
  },
  {
    name: 'MDファイル構造',
    path: 'docs/parasol/ACTUAL_MD_FILE_STRUCTURE.md',
    type: 'file',
  },
  {
    name: 'v2仕様適用状況レポート',
    path: 'docs/parasol/v2-specification-application-status-report.md',
    type: 'file',
  },
  {
    name: 'テンプレート一覧レポート',
    path: 'docs/parasol/parasol-template-inventory-report.md',
    type: 'file',
  },
  {
    name: 'サービス設計',
    path: 'docs/parasol/services',
    type: 'folder',
    children: [
      {
        name: 'プロジェクト成功化サービス',
        path: 'docs/parasol/services/project-success-service',
        type: 'folder',
      },
      {
        name: '知識共創サービス',
        path: 'docs/parasol/services/knowledge-co-creation-service',
        type: 'folder',
      },
      {
        name: 'スキル能力開発サービス',
        path: 'docs/parasol/services/skill-capability-development-service',
        type: 'folder',
      },
      {
        name: '生産性向上サービス',
        path: 'docs/parasol/services/productivity-service',
        type: 'folder',
      },
      {
        name: 'ビジネス価値創出サービス',
        path: 'docs/parasol/services/business-value-service',
        type: 'folder',
      },
      {
        name: '戦略的人材配置サービス',
        path: 'docs/parasol/services/strategic-personnel-placement-service',
        type: 'folder',
      },
      {
        name: 'クライアントビジネス推進サービス',
        path: 'docs/parasol/services/client-business-promotion-service',
        type: 'folder',
      },
    ],
  },
];

export default function GuideNavigator({
  selectedPath,
  onSelectGuide,
}: GuideNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [filteredGuides, setFilteredGuides] = useState<GuideItem[]>(GUIDE_STRUCTURE);

  // 検索フィルター
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGuides(GUIDE_STRUCTURE);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filterItems = (items: GuideItem[]): GuideItem[] => {
      return items.reduce<GuideItem[]>((acc, item) => {
        const matchesName = item.name.toLowerCase().includes(query);

        if (item.type === 'folder' && item.children) {
          const filteredChildren = filterItems(item.children);
          if (filteredChildren.length > 0 || matchesName) {
            acc.push({
              ...item,
              children: filteredChildren,
            });
            // 検索にマッチしたフォルダは自動展開
            setExpandedFolders((prev: Set<string>) => new Set([...prev, item.path]));
          }
        } else if (matchesName) {
          acc.push(item);
        }

        return acc;
      }, []);
    };

    setFilteredGuides(filterItems(GUIDE_STRUCTURE));
  }, [searchQuery]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderGuideItem = (item: GuideItem, level: number = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = selectedPath === item.path;

    if (item.type === 'folder') {
      return (
        <div key={item.path}>
          <button
            onClick={() => toggleFolder(item.path)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors',
              'text-left'
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
            <Folder className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="truncate">{item.name}</span>
          </button>
          {isExpanded && item.children && (
            <div>
              {item.children.map(child => renderGuideItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.path}
        onClick={() => onSelectGuide(item.path)}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-md transition-colors',
          'text-left',
          isSelected && 'bg-accent font-medium'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-gray-500" />
        <span className="truncate">{item.name}</span>
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      {/* ヘッダー */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">パラソル開発ガイド</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ガイドを検索..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* ガイド一覧 */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredGuides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              該当するガイドが見つかりません
            </div>
          ) : (
            filteredGuides.map((item: GuideItem) => renderGuideItem(item))
          )}
        </div>
      </ScrollArea>

      {/* フッター */}
      <div className="p-4 border-t text-xs text-muted-foreground">
        {filteredGuides.length} 件のガイド
      </div>
    </div>
  );
}
