'use client';

import { useEffect, useState } from 'react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { Printer, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type FileType = 'usecase' | 'page' | 'api-usage';

interface MarkdownPreviewProps {
  content: string;
  filePath: string;
  fileType: FileType;
}

export default function MarkdownPreview({
  content,
  filePath,
  fileType,
}: MarkdownPreviewProps) {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Markdownを HTMLに変換
  useEffect(() => {
    const processMarkdown = async () => {
      try {
        setIsLoading(true);

        let processor = remark()
          .use(remarkGfm) // GitHub Flavored Markdown
          .use(remarkHtml, { sanitize: false }); // HTMLに変換

        // Mermaidブロックを通常のコードブロックとして表示（remark-mermaidは使用しない）
        const contentWithMermaidFallback = content.replace(
          /```mermaid\n([\s\S]*?)\n```/g,
          '```\n$1\n```\n\n*Note: Mermaid diagrams will be rendered after page load*'
        );

        const result = await processor.process(contentWithMermaidFallback);
        setHtmlContent(result.toString());
      } catch (error) {
        console.error('Markdown processing error:', error);
        // フォールバック: 基本的なMarkdownプロセッサーのみ使用
        try {
          const basicProcessor = remark()
            .use(remarkGfm)
            .use(remarkHtml, { sanitize: false });
          const result = await basicProcessor.process(content);
          setHtmlContent(result.toString() + '<p><em>Note: Some advanced features may not be available</em></p>');
        } catch (basicError) {
          setHtmlContent('<div class="error-message"><h3>Markdown Processing Error</h3><pre>' + content.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre></div>');
        }
      } finally {
        setIsLoading(false);
      }
    };

    processMarkdown();
  }, [content]);

  // Mermaid図表のレンダリング
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        // 動的にMermaidをインポート
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: '"Hiragino Sans", "Yu Gothic UI", sans-serif',
        });

        // Mermaidブロックを検索してレンダリング
        const elements = document.querySelectorAll('.mermaid');
        if (elements.length > 0) {
          mermaid.run();
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
      }
    };

    if (!isLoading && htmlContent) {
      // DOM更新後にMermaidをレンダリング
      setTimeout(renderMermaid, 100);
    }
  }, [htmlContent, isLoading]);

  // プリント機能
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${getDocumentTitle(fileType)} - ${filePath}</title>
            <style>
              ${getPrintStyles()}
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>${getDocumentTitle(fileType)}</h1>
              <p class="file-path">${filePath}</p>
              <p class="print-date">印刷日: ${new Date().toLocaleDateString('ja-JP')}</p>
            </div>
            <div class="content">
              ${htmlContent}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // PDFエクスポート
  const handleExportPDF = async () => {
    try {
      // PDF生成ライブラリを動的インポート
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.querySelector('.markdown-preview-content');
      if (element) {
        const options = {
          margin: 1,
          filename: `${getFileName(filePath, fileType)}.pdf`,
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
    const htmlDocument = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${getDocumentTitle(fileType)} - ${filePath}</title>
          <style>
            ${getExportStyles()}
          </style>
        </head>
        <body>
          <div class="container">
            <header>
              <h1>${getDocumentTitle(fileType)}</h1>
              <p class="file-path">${filePath}</p>
              <p class="export-date">エクスポート日: ${new Date().toLocaleDateString('ja-JP')}</p>
            </header>
            <main>
              ${htmlContent}
            </main>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getFileName(filePath, fileType)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">プレビューを生成中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* ツールバー */}
      <div className="border-b bg-background px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {getDocumentTitle(fileType)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            プレビュー
          </Badge>
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

      {/* プレビューコンテンツ */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div
            className="markdown-preview-content prose prose-gray max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              lineHeight: '1.7',
              fontFamily: '"Hiragino Sans", "Yu Gothic UI", sans-serif',
            }}
          />
          <style jsx>{`
            .error-message {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 16px;
              margin: 16px 0;
            }
            .error-message h3 {
              color: #dc2626;
              margin: 0 0 8px 0;
              font-size: 16px;
            }
            .error-message pre {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 4px;
              padding: 12px;
              margin: 8px 0 0 0;
              font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
              font-size: 12px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

// ドキュメントタイトルの取得
function getDocumentTitle(fileType: FileType): string {
  switch (fileType) {
    case 'usecase':
      return 'ユースケース定義';
    case 'page':
      return 'ページ定義';
    case 'api-usage':
      return 'API利用仕様';
    default:
      return 'パラソル設計ドキュメント';
  }
}

// ファイル名の生成
function getFileName(filePath: string, fileType: FileType): string {
  const parts = filePath.split('/');
  const usecaseName = parts[parts.length - 2];
  const prefix = getDocumentTitle(fileType).replace(/\s+/g, '_');
  return `${prefix}_${usecaseName}`;
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

      .file-path {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
      }

      .print-date {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
      }

      .content {
        font-size: 12px;
      }

      .content h1 { font-size: 18px; }
      .content h2 { font-size: 16px; }
      .content h3 { font-size: 14px; }
      .content h4 { font-size: 13px; }

      table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
      }

      table th,
      table td {
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
      }

      table th {
        background-color: #f0f0f0;
        font-weight: bold;
      }

      pre {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        font-family: monospace;
        font-size: 10px;
        overflow: auto;
      }
    }
  `;
}

// エクスポート用スタイル
function getExportStyles(): string {
  return `
    body {
      font-family: "Hiragino Sans", "Yu Gothic UI", -apple-system, BlinkMacSystemFont, sans-serif;
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

    .export-date {
      font-size: 12px;
      color: #999;
      margin: 10px 0 0 0;
    }

    main {
      font-size: 16px;
    }

    h1 { font-size: 24px; margin-top: 32px; margin-bottom: 16px; }
    h2 { font-size: 20px; margin-top: 24px; margin-bottom: 12px; }
    h3 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
    h4 { font-size: 16px; margin-top: 16px; margin-bottom: 8px; }

    p { margin-bottom: 16px; }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      border: 1px solid #ddd;
    }

    table th,
    table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }

    table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    table tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    pre {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
      padding: 16px;
      font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 14px;
      overflow-x: auto;
      margin: 16px 0;
    }

    code {
      background-color: #f6f8fa;
      border-radius: 3px;
      font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
      padding: 2px 4px;
    }

    pre code {
      background-color: transparent;
      padding: 0;
    }

    blockquote {
      border-left: 4px solid #dfe2e5;
      padding: 0 16px;
      color: #6a737d;
      margin: 16px 0;
    }

    ul, ol {
      margin-bottom: 16px;
      padding-left: 30px;
    }

    li {
      margin-bottom: 4px;
    }

    /* Mermaid図表のスタイル */
    .mermaid {
      text-align: center;
      margin: 20px 0;
    }
  `;
}