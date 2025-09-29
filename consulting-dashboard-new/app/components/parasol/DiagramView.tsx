'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Maximize2, ZoomIn, ZoomOut, RotateCcw, Filter, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DiagramViewProps {
  type: 'mermaid' | 'plantuml';
  code: string;
  title?: string;
  onError?: (error: string) => void;
}

export function DiagramView({ type, code, title, onError }: DiagramViewProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [stereotypeFilters, setStereotypeFilters] = useState<Record<string, boolean>>({
    entity: true,
    'value-object': true,
    aggregate: true,
    service: true,
    repository: true,
    factory: true,
    event: true,
    specification: true
  });
  const { toast } = useToast();

  // Mermaid初期化
  useEffect(() => {
    if (type === 'mermaid') {
      mermaid.initialize({
        theme: 'neutral',
        themeVariables: {
          primaryColor: '#f3f4f6',
          primaryTextColor: '#111827',
          primaryBorderColor: '#d1d5db',
          lineColor: '#6b7280',
          secondaryColor: '#e5e7eb',
          tertiaryColor: '#f9fafb',
          background: '#ffffff',
          mainBkg: '#f3f4f6',
          secondBkg: '#e5e7eb',
          classText: '#111827',
          fontSize: '14px',
        },
        startOnLoad: false,
        flowchart: {
          htmlLabels: true,
          curve: 'basis',
        },
        er: {
          fontSize: '14',
          layoutDirection: 'TB',
        },
        classDiagram: {
          fontSize: '14',
        },
      });
    }
  }, [type]);

  // ダイアグラム描画
  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) {
        console.log('DiagramView: No code to render');
        return;
      }

      try {
        setError('');
        console.log('DiagramView: Rendering diagram', { type, code: code.substring(0, 200) });

        if (type === 'mermaid') {
          // Mermaidレンダリング
          const id = `mermaid-${Date.now()}`;
          console.log('DiagramView: Calling mermaid.render with:', { id });

          try {
            const { svg } = await mermaid.render(id, code);
            console.log('DiagramView: Mermaid render successful, SVG length:', svg.length);
            setSvgContent(svg);
            console.log('DiagramView: SVG content set in React state');
          } catch (mermaidErr) {
            console.error('DiagramView: Mermaid render error:', mermaidErr);
            const mermaidErrorMsg = mermaidErr instanceof Error ? mermaidErr.message : String(mermaidErr);
            throw new Error(`Mermaid描画エラー: ${mermaidErrorMsg}`);
          }
        } else if (type === 'plantuml') {
          // PlantUMLサーバーへのリクエスト
          const encodedCode = encodeURIComponent(code);
          const plantumlUrl = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;

          const response = await fetch(plantumlUrl);
          if (!response.ok) throw new Error('PlantUMLサーバーエラー');

          const svg = await response.text();
          setSvgContent(svg);
          console.log('DiagramView: PlantUML SVG content set in React state');
        }
      } catch (err) {
        console.error('DiagramView: Error rendering diagram', err);
        const errorMessage = err instanceof Error ? err.message : 'ダイアグラムの描画に失敗しました';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    // レンダリングを少し遅延させて重複実行を防ぐ
    const timeoutId = setTimeout(renderDiagram, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [code, type, onError]);

  // ズームとフィルター適用のための別のuseEffect
  useEffect(() => {
    if (svgContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      if (svgElement) {
        // ズーム適用
        if (zoom !== 100) {
          svgElement.style.transform = `scale(${zoom / 100})`;
          svgElement.style.transformOrigin = 'top left';
        }

        // ステレオタイプフィルター適用
        const allGroups = doc.querySelectorAll('g');
        allGroups.forEach((group) => {
          const textElements = group.querySelectorAll('text');
          let shouldHide = false;

          textElements.forEach((text) => {
            const content = text.textContent || '';
            // ステレオタイプのパターンマッチング
            if (content.includes('<<entity>>') && !stereotypeFilters.entity) {
              shouldHide = true;
            } else if (content.includes('<<value object>>') && !stereotypeFilters['value-object']) {
              shouldHide = true;
            } else if (content.includes('<<aggregate root>>') && !stereotypeFilters.aggregate) {
              shouldHide = true;
            } else if (content.includes('<<service>>') && !stereotypeFilters.service) {
              shouldHide = true;
            } else if (content.includes('<<repository>>') && !stereotypeFilters.repository) {
              shouldHide = true;
            } else if (content.includes('<<factory>>') && !stereotypeFilters.factory) {
              shouldHide = true;
            } else if (content.includes('<<event>>') && !stereotypeFilters.event) {
              shouldHide = true;
            } else if (content.includes('<<specification>>') && !stereotypeFilters.specification) {
              shouldHide = true;
            }
          });

          // グループの表示/非表示を設定
          if (shouldHide) {
            (group as SVGGElement).style.opacity = '0.2';
            (group as SVGGElement).style.pointerEvents = 'none';
          } else {
            (group as SVGGElement).style.opacity = '1';
            (group as SVGGElement).style.pointerEvents = 'auto';
          }
        });

        const updatedSvg = new XMLSerializer().serializeToString(doc);
        setSvgContent(updatedSvg);
        console.log('DiagramView: Zoom and filters applied to SVG content', { zoom, stereotypeFilters });
      }
    }
  }, [zoom, stereotypeFilters]);

  // SVGダウンロード
  const handleDownload = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'diagram'}-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'ダウンロード完了',
      description: 'ダイアグラムをダウンロードしました',
    });
  };

  // コードコピー
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'コピー完了',
      description: 'ダイアグラムコードをクリップボードにコピーしました',
    });
  };

  // ズーム操作
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  // ズーム適用は renderDiagram 内で実行されるため、ここでは不要

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const DiagramContent = () => (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="ズームアウト"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">{zoom}%</span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="ズームイン"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetZoom}
            title="ズームリセット"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            title="コードをコピー"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!svgContent}
            title="SVGダウンロード"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(true)}
            title="フルスクリーン表示"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">ステレオタイプフィルター</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  フィルター
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>ステレオタイプを表示/非表示</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.entity}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, entity: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-sm mr-2" />
                    Entity
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters['value-object']}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, 'value-object': checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-sm mr-2" />
                    Value Object
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.aggregate}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, aggregate: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-sm mr-2" />
                    Aggregate
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.service}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, service: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-sm mr-2" />
                    Service
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.repository}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, repository: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-sm mr-2" />
                    Repository
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.factory}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, factory: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-indigo-500 rounded-sm mr-2" />
                    Factory
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.event}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, event: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-sm mr-2" />
                    Event
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={stereotypeFilters.specification}
                  onCheckedChange={(checked) =>
                    setStereotypeFilters(prev => ({ ...prev, specification: checked }))
                  }
                >
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-gray-500 rounded-sm mr-2" />
                    Specification
                  </span>
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setStereotypeFilters({
                    entity: true,
                    'value-object': true,
                    aggregate: true,
                    service: true,
                    repository: true,
                    factory: true,
                    event: true,
                    specification: true
                  })}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  すべて表示
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStereotypeFilters({
                    entity: false,
                    'value-object': false,
                    aggregate: false,
                    service: false,
                    repository: false,
                    factory: false,
                    event: false,
                    specification: false
                  })}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  すべて非表示
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className="w-full overflow-auto"
            style={{
              minHeight: '400px',
              maxHeight: isFullscreen ? 'calc(80vh - 100px)' : '600px'
            }}
            dangerouslySetInnerHTML={{ __html: svgContent || '' }}
          />
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-2">
      {!isFullscreen && <DiagramContent />}

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle>{title || 'ダイアグラム'}</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto">
            <DiagramContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}