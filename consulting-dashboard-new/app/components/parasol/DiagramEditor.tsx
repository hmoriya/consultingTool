'use client';

import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  GitBranch,
  BarChart3,
  Network,
  PenTool,
  Copy,
  Download,
  Plus,
  Trash2,
  Eye,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

type DiagramTool = 'mermaid' | 'drawio' | 'excalidraw' | 'plantuml';
type FileType = 'usecase' | 'page' | 'api-usage';

interface DiagramEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fileType: FileType;
}

interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  tool: DiagramTool;
}

export default function DiagramEditor({
  content,
  onContentChange,
  fileType,
}: DiagramEditorProps) {
  const [selectedTool, setSelectedTool] = useState<DiagramTool>('mermaid');
  const [diagramCode, setDiagramCode] = useState('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const mermaidRef = useRef<HTMLDivElement>(null);

  // 図表テンプレート
  const templates: DiagramTemplate[] = [
    {
      id: 'mermaid-flowchart',
      name: 'フローチャート',
      description: '業務フローやプロセスの可視化',
      tool: 'mermaid',
      code: `flowchart TD
    A[開始] --> B{条件判定}
    B -->|Yes| C[処理A]
    B -->|No| D[処理B]
    C --> E[終了]
    D --> E`,
    },
    {
      id: 'mermaid-sequence',
      name: 'シーケンス図',
      description: 'システム間の相互作用',
      tool: 'mermaid',
      code: `sequenceDiagram
    participant U as ユーザー
    participant S as システム
    participant D as データベース

    U->>S: リクエスト送信
    S->>D: データ取得
    D-->>S: データ返却
    S-->>U: レスポンス返却`,
    },
    {
      id: 'mermaid-er',
      name: 'ER図',
      description: 'データベースの関係図',
      tool: 'mermaid',
      code: `erDiagram
    User {
        UUID id PK
        string name
        string email
        timestamp created_at
    }

    Project {
        UUID id PK
        string title
        text description
        UUID owner_id FK
    }

    User ||--o{ Project : "owns"`,
    },
    {
      id: 'mermaid-state',
      name: '状態遷移図',
      description: 'ステートマシンの可視化',
      tool: 'mermaid',
      code: `stateDiagram-v2
    [*] --> Draft
    Draft --> Review : 申請
    Review --> Approved : 承認
    Review --> Rejected : 却下
    Rejected --> Draft : 修正
    Approved --> [*]`,
    },
    {
      id: 'mermaid-gantt',
      name: 'ガントチャート',
      description: 'プロジェクトスケジュール',
      tool: 'mermaid',
      code: `gantt
    title プロジェクトスケジュール
    dateFormat  YYYY-MM-DD
    section 設計フェーズ
    要件定義    :done, req, 2024-01-01, 2024-01-15
    基本設計    :active, design, 2024-01-16, 2024-02-15
    section 開発フェーズ
    実装        :impl, after design, 30d
    テスト      :test, after impl, 15d`,
    },
    {
      id: 'mermaid-class',
      name: 'クラス図',
      description: 'システム構造の可視化',
      tool: 'mermaid',
      code: `classDiagram
    class User {
        +UUID id
        +String name
        +String email
        +login()
        +logout()
    }

    class Project {
        +UUID id
        +String title
        +Date created_at
        +create()
        +update()
    }

    User "1" --> "*" Project : creates`,
    },
  ];

  // ファイルタイプ別推奨テンプレート
  const getRecommendedTemplates = () => {
    switch (fileType) {
      case 'usecase':
        return templates.filter(t =>
          ['mermaid-sequence', 'mermaid-flowchart', 'mermaid-state'].includes(t.id)
        );
      case 'page':
        return templates.filter(t =>
          ['mermaid-flowchart', 'mermaid-state'].includes(t.id)
        );
      case 'api-usage':
        return templates.filter(t =>
          ['mermaid-sequence', 'mermaid-flowchart'].includes(t.id)
        );
      default:
        return templates;
    }
  };

  // Mermaidレンダリング
  useEffect(() => {
    const renderMermaid = async () => {
      if (selectedTool === 'mermaid' && diagramCode && previewMode === 'preview') {
        try {
          const mermaid = (await import('mermaid')).default;

          mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: '"Hiragino Sans", "Yu Gothic UI", sans-serif',
          });

          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = diagramCode;
            mermaid.run();
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = '<p class="text-red-500">図表の描画中にエラーが発生しました。</p>';
          }
        }
      }
    };

    renderMermaid();
  }, [selectedTool, diagramCode, previewMode]);

  // テンプレートの適用
  const applyTemplate = (template: DiagramTemplate) => {
    setSelectedTool(template.tool);
    setDiagramCode(template.code);
    setPreviewMode('edit');
    toast.success(`${template.name}のテンプレートを適用しました`);
  };

  // 図表をマークダウンに挿入
  const insertDiagram = () => {
    if (!diagramCode.trim()) {
      toast.error('図表コードが入力されていません');
      return;
    }

    let markdownCode = '';
    switch (selectedTool) {
      case 'mermaid':
        markdownCode = `\`\`\`mermaid\n${diagramCode}\n\`\`\``;
        break;
      case 'plantuml':
        markdownCode = `\`\`\`plantuml\n${diagramCode}\n\`\`\``;
        break;
      default:
        markdownCode = `\`\`\`\n${diagramCode}\n\`\`\``;
    }

    // 現在のコンテンツに図表を追加
    const newContent = content + '\n\n' + markdownCode + '\n\n';
    onContentChange(newContent);
    toast.success('図表をマークダウンに挿入しました');
  };

  // 図表コードをクリップボードにコピー
  const copyDiagramCode = async () => {
    try {
      await navigator.clipboard.writeText(diagramCode);
      toast.success('図表コードをコピーしました');
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  // 図表をPNGとしてダウンロード
  const downloadAsPNG = async () => {
    if (selectedTool === 'mermaid' && mermaidRef.current) {
      try {
        const svg = mermaidRef.current.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diagram.png';
                a.click();
                URL.revokeObjectURL(url);
              }
            });
          };

          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        }
      } catch (error) {
        toast.error('画像のダウンロードに失敗しました');
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* ツールバー */}
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              <Network className="h-3 w-3" />
              図表エディタ
            </Badge>

            {/* ツール選択 */}
            <Tabs value={selectedTool} onValueChange={(value) => setSelectedTool(value as DiagramTool)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="mermaid" className="gap-2">
                  <GitBranch className="h-4 w-4" />
                  Mermaid
                </TabsTrigger>
                <TabsTrigger value="drawio" disabled className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Draw.io
                </TabsTrigger>
                <TabsTrigger value="excalidraw" disabled className="gap-2">
                  <PenTool className="h-4 w-4" />
                  Excalidraw
                </TabsTrigger>
                <TabsTrigger value="plantuml" disabled className="gap-2">
                  <Network className="h-4 w-4" />
                  PlantUML
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
              className="gap-2"
            >
              {previewMode === 'edit' ? (
                <>
                  <Eye className="h-4 w-4" />
                  プレビュー
                </>
              ) : (
                <>
                  <Code className="h-4 w-4" />
                  編集
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyDiagramCode}
              disabled={!diagramCode.trim()}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              コピー
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={downloadAsPNG}
              disabled={!diagramCode.trim() || selectedTool !== 'mermaid'}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              PNG
            </Button>

            <Button
              onClick={insertDiagram}
              disabled={!diagramCode.trim()}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              挿入
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* サイドバー: テンプレート */}
        <div className="w-80 border-r bg-muted/30 overflow-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">図表テンプレート</h3>

            {/* 推奨テンプレート */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {fileType === 'usecase' && '推奨（ユースケース）'}
                {fileType === 'page' && '推奨（ページ定義）'}
                {fileType === 'api-usage' && '推奨（API利用仕様）'}
              </h4>
              <div className="space-y-2">
                {getRecommendedTemplates().map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50" onClick={() => applyTemplate(template)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 全テンプレート */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">全テンプレート</h4>
              <div className="space-y-2">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50" onClick={() => applyTemplate(template)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* メインエリア */}
        <div className="flex-1 flex flex-col">
          {previewMode === 'edit' ? (
            /* エディタモード */
            <div className="flex-1 p-4">
              <div className="h-full">
                <Textarea
                  value={diagramCode}
                  onChange={(e) => setDiagramCode(e.target.value)}
                  placeholder={`${selectedTool}の図表コードを入力してください...`}
                  className="h-full font-mono text-sm resize-none"
                />
              </div>
            </div>
          ) : (
            /* プレビューモード */
            <div className="flex-1 p-4 bg-white">
              {selectedTool === 'mermaid' ? (
                <div className="h-full flex items-center justify-center">
                  <div ref={mermaidRef} className="mermaid">
                    {diagramCode || 'コードを入力してプレビューを表示'}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>{selectedTool}は近日対応予定です</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}