'use client';

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { Printer, Download, ExternalLink, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface GuideContentProps {
  guidePath: string | null;
}

interface FileData {
  content: string;
  metadata: {
    title: string;
    description: string;
    version: string;
    lastModified: Date;
    author: string;
    tags: string[];
    category: string;
  };
  exists: boolean;
  lastModified: Date;
}

export default function GuideContent({ guidePath }: GuideContentProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ガイドの読み込み
  useEffect(() => {
    if (!guidePath) {
      setHtmlContent('');
      setFileData(null);
      return;
    }

    const loadGuide = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // APIからファイルを読み込み
        const response = await fetch(`/api/parasol/files?path=${encodeURIComponent(guidePath)}`);
        if (!response.ok) {
          throw new Error('ガイドの読み込みに失敗しました');
        }

        const data: FileData = await response.json();
        setFileData(data);

        if (!data.exists) {
          setError('ガイドファイルが見つかりません');
          return;
        }

        // Markdownを HTMLに変換
        const processor = remark()
          .use(remarkGfm) // GitHub Flavored Markdown
          .use(remarkHtml, { sanitize: false });

        const result = await processor.process(data.content);
        setHtmlContent(result.toString());
      } catch (err) {
        console.error('Error loading guide:', err);
        setError('ガイドの読み込み中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuide();
  }, [guidePath]);

  // Mermaid図表のレンダリング
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: '"Hiragino Sans", "Yu Gothic UI", sans-serif',
        });

        const elements = document.querySelectorAll('.mermaid');
        if (elements.length > 0) {
          await mermaid.run();
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    if (!isLoading && htmlContent) {
      setTimeout(renderMermaid, 100);
    }
  }, [htmlContent, isLoading]);

  // プリント機能
  const handlePrint = () => {
    if (!fileData) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${fileData.metadata.title}</title>
            <style>${getPrintStyles()}</style>
          </head>
          <body>
            <div class="print-header">
              <h1>${fileData.metadata.title}</h1>
              <p class="file-path">${guidePath}</p>
              <p class="print-date">印刷日: ${new Date().toLocaleDateString('ja-JP')}</p>
            </div>
            <div class="content">${htmlContent}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // PDFエクスポート
  const handleExportPDF = async () => {
    if (!fileData) return;

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.querySelector('.guide-content');
      if (element) {
        const options = {
          margin: 1,
          filename: `${getFileName(guidePath!)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().set(options).from(element).save();
      }
    } catch (error) {
      console.error('PDF export error:', error);
    }
  };

  // HTMLエクスポート
  const handleExportHTML = () => {
    if (!fileData) return;

    const htmlDocument = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${fileData.metadata.title}</title>
          <style>${getExportStyles()}</style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>${fileData.metadata.title}</h1>
              <p class="file-path">${guidePath}</p>
              <p class="export-date">エクスポート日: ${new Date().toLocaleDateString('ja-JP')}</p>
            </header>
            <main>${htmlContent}</main>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getFileName(guidePath!)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 初期状態
  if (!guidePath) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <div>
            <h3 className="text-lg font-medium text-muted-foreground">
              ガイドを選択してください
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              左側のナビゲーションからガイドを選択すると、ここに表示されます
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ローディング状態
  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b bg-background px-4 py-2">
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-4xl">⚠️</div>
          <div>
            <h3 className="text-lg font-medium text-red-600">{error}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              ガイドパス: {guidePath}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // メインコンテンツ
  return (
    <div className="h-full flex flex-col">
      {/* ツールバー */}
      <div className="border-b bg-background px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {fileData?.metadata.title}
          </Badge>
          {fileData?.metadata.version && (
            <Badge variant="secondary" className="text-xs">
              v{fileData.metadata.version}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            印刷
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportHTML}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            HTML
          </Button>
        </div>
      </div>

      {/* メタデータ表示 */}
      {fileData && (
        <div className="border-b bg-muted/30 px-8 py-3">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  最終更新: {new Date(fileData.lastModified).toLocaleDateString('ja-JP')}
                </span>
              </div>
              {fileData.metadata.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {fileData.metadata.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ガイドコンテンツ */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div
            className="guide-content prose prose-gray max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              lineHeight: '1.7',
              fontFamily: '"Hiragino Sans", "Yu Gothic UI", sans-serif',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ファイル名の生成
function getFileName(filePath: string): string {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace('.md', '');
  return fileName;
}

// プリント用スタイル
function getPrintStyles(): string {
  return `
    @media print {
      body {
        font-family: "Hiragino Sans", "Yu Gothic UI", sans-serif;
        line-height: 1.6;
        color: #000;
        background: #fff;
      }
      .print-header {
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .print-header h1 {
        margin: 0 0 10px 0;
        font-size: 24px;
        font-weight: bold;
      }
      .file-path, .print-date {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
      }
      .content {
        font-size: 12px;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
      }
      table th, table td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
      }
      table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
    }
  `;
}

// エクスポート用スタイル
function getExportStyles(): string {
  return `
    body {
      font-family: "Hiragino Sans", "Yu Gothic UI", sans-serif;
      line-height: 1.7;
      color: #333;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    header {
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .file-path {
      font-size: 14px;
      color: #666;
      margin: 5px 0;
      font-family: monospace;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      border: 1px solid #ddd;
    }
    table th, table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    pre {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 16px;
      font-family: monospace;
      font-size: 14px;
      overflow-x: auto;
    }
  `;
}
