'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [originalSvgContent, setOriginalSvgContent] = useState<string>('');
  const [displaySvgContent, setDisplaySvgContent] = useState<string>('');
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
  
  // code が undefined の場合の早期リターン
  if (!code) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-muted-foreground text-center">
            図表データがありません
          </div>
        </CardContent>
      </Card>
    );
  }

  // コンポーネントマウント時にズームをリセット
  useEffect(() => {
    setZoom(100);
  }, []); // 空の依存配列で初回マウント時のみ実行

  // Mermaid初期化（動的インポート）
  useEffect(() => {
    const initializeMermaid = async () => {
      // ブラウザ環境でのみ実行
      if (typeof window === 'undefined' || type !== 'mermaid') {
        return;
      }

      try {
        console.log('DiagramView: Initializing Mermaid in browser environment');
        const mermaid = (await import('mermaid')).default;

        // ブラウザ環境を確認してから初期化
        if (typeof document !== 'undefined') {
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
          console.log('DiagramView: Mermaid initialization successful');
        }
      } catch (err) {
        console.error('Mermaidの読み込みに失敗しました:', err);
        setError('Mermaidライブラリが利用できません。代替表示を使用しています。');
      }
    };

    initializeMermaid();
  }, [type]);

  // ダイアグラム描画
  useEffect(() => {
    const renderDiagram = async () => {
      // ブラウザ環境とコードの存在を確認
      if (typeof window === 'undefined' || !code) {
        console.log('DiagramView: No code to render or not in browser environment');
        return;
      }

      try {
        setError('');
        console.log('DiagramView: Rendering diagram', { type, code: code.substring(0, 200) });

        if (type === 'mermaid') {
          try {
            // ブラウザ環境でのみMermaidを動的インポート
            if (typeof document === 'undefined') {
              throw new Error('Document not available');
            }

            const mermaid = (await import('mermaid')).default;

            // Mermaidレンダリング
            const id = `mermaid-${Date.now()}`;
            console.log('DiagramView: Calling mermaid.render with:', { id });

            const { svg } = await mermaid.render(id, code);
            console.log('DiagramView: Mermaid render successful, SVG length:', svg.length);
            setOriginalSvgContent(svg);
            setDisplaySvgContent(svg);
            console.log('DiagramView: SVG content set in React state');
          } catch (mermaidErr) {
            console.error('DiagramView: Mermaid render error:', mermaidErr);

            // Mermaidが利用できない場合のフォールバック
            const fallbackSvg = `
              <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="380" height="180" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2" rx="5"/>
                <text x="200" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
                  Mermaidライブラリが利用できません
                </text>
                <text x="200" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">
                  コード内容:
                </text>
                <foreignObject x="20" y="100" width="360" height="80">
                  <div style="font-family: monospace; font-size: 10px; color: #374151; white-space: pre-wrap; overflow: auto; height: 80px; padding: 5px;">
                    ${code.substring(0, 200)}${code.length > 200 ? '...' : ''}
                  </div>
                </foreignObject>
              </svg>
            `;
            setOriginalSvgContent(fallbackSvg);
            setDisplaySvgContent(fallbackSvg);
            setError('Mermaidライブラリでエラーが発生しました。代替表示を使用しています。');
            console.log('DiagramView: Fallback SVG content set');
          }
        } else if (type === 'plantuml') {
          // PlantUMLサーバーへのリクエスト
          const encodedCode = encodeURIComponent(code);
          const plantumlUrl = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;

          const response = await fetch(plantumlUrl);
          if (!response.ok) throw new Error('PlantUMLサーバーエラー');

          const svg = await response.text();
          setOriginalSvgContent(svg);
          setDisplaySvgContent(svg);
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
    if (originalSvgContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(originalSvgContent, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      if (svgElement) {
        // ズーム適用
        if (zoom !== 100) {
          svgElement.style.transform = `scale(${zoom / 100})`;
          svgElement.style.transformOrigin = 'top left';
        }

        // ステレオタイプフィルター適用
        // デバッグ用：フィルターの状態をログ出力
        console.log('DiagramView: Applying filters', stereotypeFilters);

        // MermaidのクラスダイアグラムのSVG構造を探索
        // パターン1: g.nodes内の各ノード
        let allNodes = doc.querySelectorAll('g.nodes g.node');
        if (allNodes.length === 0) {
          // パターン2: g[id*="entity"]のような直接的なノード
          allNodes = doc.querySelectorAll('g[id*="entity"], g[id*="aggregate"], g[id*="value"], g[id*="service"], g[id*="repository"]');
        }
        if (allNodes.length === 0) {
          // パターン3: クラス名を持つg要素
          allNodes = doc.querySelectorAll('g[class*="classGroup"]');
        }
        if (allNodes.length === 0) {
          // パターン4: 全てのg要素から絞り込み
          allNodes = doc.querySelectorAll('g');
        }

        console.log(`DiagramView: Found ${allNodes.length} potential nodes`);

        allNodes.forEach((node, index) => {
          const nodeElement = node as SVGGElement;

          // idやclassからノードタイプを推測
          const nodeId = nodeElement.getAttribute('id') || '';
          const nodeClass = nodeElement.getAttribute('class') || '';

          // ノード内のすべてのテキストを取得
          const textElements = nodeElement.querySelectorAll('text, tspan');
          let nodeText = '';
          textElements.forEach(text => {
            nodeText += (text.textContent || '') + ' ';
          });
          nodeText = nodeText.toLowerCase().trim();

          // デバッグ：最初の5ノードの情報を出力
          if (index < 5) {
            console.log(`Node ${index}: id="${nodeId}", class="${nodeClass}", text="${nodeText.substring(0, 50)}..."`);
          }

          // ステレオタイプの判定
          let shouldHide = false;

          // エンティティクラスの名前からステレオタイプを判定
          if ((nodeId.includes('entity') || nodeId.includes('Entity') ||
               nodeText.includes('<<entity>>') || nodeText.includes('entity') ||
               nodeClass.includes('entity')) && !stereotypeFilters.entity) {
            shouldHide = true;
            console.log(`Hiding Entity node: ${nodeId}`);
          } else if ((nodeId.includes('value') || nodeId.includes('Value') ||
                     nodeText.includes('<<value') || nodeText.includes('value object') ||
                     nodeClass.includes('value')) && !stereotypeFilters['value-object']) {
            shouldHide = true;
            console.log(`Hiding Value Object node: ${nodeId}`);
          } else if ((nodeId.includes('aggregate') || nodeId.includes('Aggregate') ||
                     nodeText.includes('<<aggregate') || nodeText.includes('aggregate') ||
                     nodeClass.includes('aggregate')) && !stereotypeFilters.aggregate) {
            shouldHide = true;
            console.log(`Hiding Aggregate node: ${nodeId}`);
          } else if ((nodeId.includes('service') || nodeId.includes('Service') ||
                     nodeText.includes('<<service>>') || nodeText.includes('service') ||
                     nodeClass.includes('service')) && !stereotypeFilters.service) {
            shouldHide = true;
            console.log(`Hiding Service node: ${nodeId}`);
          } else if ((nodeId.includes('repository') || nodeId.includes('Repository') ||
                     nodeText.includes('<<repository>>') || nodeText.includes('repository') ||
                     nodeClass.includes('repository')) && !stereotypeFilters.repository) {
            shouldHide = true;
            console.log(`Hiding Repository node: ${nodeId}`);
          } else if ((nodeId.includes('factory') || nodeId.includes('Factory') ||
                     nodeText.includes('<<factory>>') || nodeText.includes('factory') ||
                     nodeClass.includes('factory')) && !stereotypeFilters.factory) {
            shouldHide = true;
            console.log(`Hiding Factory node: ${nodeId}`);
          } else if ((nodeId.includes('event') || nodeId.includes('Event') ||
                     nodeText.includes('<<event>>') || nodeText.includes('event') ||
                     nodeClass.includes('event')) && !stereotypeFilters.event) {
            shouldHide = true;
            console.log(`Hiding Event node: ${nodeId}`);
          } else if ((nodeId.includes('specification') || nodeId.includes('Specification') ||
                     nodeText.includes('<<specification>>') || nodeText.includes('specification') ||
                     nodeClass.includes('specification')) && !stereotypeFilters.specification) {
            shouldHide = true;
            console.log(`Hiding Specification node: ${nodeId}`);
          }

          // ノードの表示/非表示を設定
          if (shouldHide) {
            nodeElement.style.opacity = '0.2';
            nodeElement.style.pointerEvents = 'none';
          } else {
            nodeElement.style.opacity = '1';
            nodeElement.style.pointerEvents = 'auto';
          }
        });

        const updatedSvg = new XMLSerializer().serializeToString(doc);
        setDisplaySvgContent(updatedSvg);
        console.log('DiagramView: Zoom and filters applied to SVG content', { zoom, stereotypeFilters });
      }
    }
  }, [originalSvgContent, zoom, stereotypeFilters]);

  // SVGダウンロード
  const handleDownload = () => {
    if (!displaySvgContent) return;

    const blob = new Blob([displaySvgContent], { type: 'image/svg+xml' });
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
            disabled={!displaySvgContent}
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

      <Card className="overflow-hidden flex flex-col flex-1">
        <CardContent className="p-4 flex flex-col flex-1">
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
            className="w-full overflow-auto border rounded-md flex-1"
            style={{
              minHeight: '600px',
              maxHeight: isFullscreen ? 'calc(90vh - 50px)' : '98vh',
              height: isFullscreen ? 'calc(90vh - 50px)' : '98vh'
            }}
            dangerouslySetInnerHTML={{ __html: displaySvgContent || '' }}
          />
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-2 h-full">
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