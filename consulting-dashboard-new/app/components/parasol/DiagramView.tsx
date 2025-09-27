'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Maximize2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';

interface DiagramViewProps {
  type: 'mermaid' | 'plantuml';
  code: string;
  title?: string;
  onError?: (error: string) => void;
}

export function DiagramView({ type, code, title, onError }: DiagramViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');
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
      if (!containerRef.current || !code) {
        console.log('DiagramView: No container or code', { hasContainer: !!containerRef.current, hasCode: !!code });
        return;
      }

      try {
        setError('');
        console.log('DiagramView: Rendering diagram', { type, code });
        
        if (type === 'mermaid') {
          // Mermaidレンダリング
          const id = `mermaid-${Date.now()}`;
          console.log('DiagramView: Calling mermaid.render with:', { id, code });
          const { svg } = await mermaid.render(id, code);
          setSvgContent(svg);
          containerRef.current.innerHTML = svg;
          console.log('DiagramView: Mermaid render successful');
        } else if (type === 'plantuml') {
          // PlantUMLサーバーへのリクエスト
          const encodedCode = encodeURIComponent(code);
          const plantumlUrl = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;
          
          const response = await fetch(plantumlUrl);
          if (!response.ok) throw new Error('PlantUMLサーバーエラー');
          
          const svg = await response.text();
          setSvgContent(svg);
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('DiagramView: Error rendering diagram', err);
        const errorMessage = err instanceof Error ? err.message : 'ダイアグラムの描画に失敗しました';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    renderDiagram();
  }, [code, type, onError]);

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

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-destructive text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end gap-2">
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
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div
            ref={containerRef}
            className="w-full overflow-x-auto"
            style={{ minHeight: '200px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}