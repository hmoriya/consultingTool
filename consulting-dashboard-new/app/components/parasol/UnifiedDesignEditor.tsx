'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Check, FileText, Eye, Book, Code, Database, Package, FileCode } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// Markdown変換関数をインポート
import { 
  domainLanguageToMarkdown, 
  markdownToDomainLanguage, 
  validateDomainLanguageMarkdown 
} from '@/lib/parasol/markdown-converter';
import {
  capabilitiesToMarkdown,
  markdownToCapabilities,
  validateCapabilityMarkdown
} from '@/lib/parasol/capability-markdown-converter';
import {
  operationToMarkdown,
  markdownToOperation,
  validateOperationMarkdown
} from '@/lib/parasol/operation-markdown-converter';
import {
  apiSpecToMarkdown,
  markdownToApiSpec,
  validateApiSpecMarkdown
} from '@/lib/parasol/api-markdown-converter';
import {
  dbDesignToMarkdown,
  markdownToDbDesign,
  validateDbDesignMarkdown
} from '@/lib/parasol/db-markdown-converter';

export type DesignType = 'domain' | 'capability' | 'operation' | 'api' | 'db' | 'markdown' | 'useCase';

interface UnifiedDesignEditorProps {
  type: DesignType;
  value: string;
  onChange: (value: string) => void;
  serviceId?: string;
  capabilityId?: string;
  className?: string;
  readOnly?: boolean;
}

const designTypeConfig = {
  domain: {
    title: 'ドメイン言語',
    description: 'エンティティ、値オブジェクト、ドメインサービスを定義',
    icon: Book,
    toMarkdown: (data: any) => domainLanguageToMarkdown(JSON.parse(data)),
    fromMarkdown: (md: string) => JSON.stringify(markdownToDomainLanguage(md), null, 2),
    validate: validateDomainLanguageMarkdown
  },
  capability: {
    title: 'ビジネスケーパビリティ',
    description: '業務能力とオペレーションを定義',
    icon: Package,
    toMarkdown: (data: any) => {
      const parsed = JSON.parse(data);
      return capabilitiesToMarkdown(parsed.capabilities || [], parsed.operations || []);
    },
    fromMarkdown: (md: string, serviceId?: string) => {
      const result = markdownToCapabilities(md, serviceId || '');
      return JSON.stringify(result, null, 2);
    },
    validate: validateCapabilityMarkdown
  },
  operation: {
    title: 'ビジネスオペレーション',
    description: 'オペレーションの詳細定義',
    icon: Code,
    toMarkdown: (data: any) => operationToMarkdown(JSON.parse(data)),
    fromMarkdown: (md: string, serviceId?: string, capabilityId?: string) => {
      const result = markdownToOperation(md, serviceId || '', capabilityId || '');
      return JSON.stringify(result, null, 2);
    },
    validate: validateOperationMarkdown
  },
  api: {
    title: 'API仕様',
    description: 'RESTful APIのエンドポイント定義',
    icon: FileCode,
    toMarkdown: (data: any) => apiSpecToMarkdown(JSON.parse(data)),
    fromMarkdown: (md: string) => JSON.stringify(markdownToApiSpec(md), null, 2),
    validate: validateApiSpecMarkdown
  },
  db: {
    title: 'DB設計',
    description: 'テーブル、カラム、リレーションの定義',
    icon: Database,
    toMarkdown: (data: any) => dbDesignToMarkdown(JSON.parse(data)),
    fromMarkdown: (md: string) => JSON.stringify(markdownToDbDesign(md), null, 2),
    validate: validateDbDesignMarkdown
  },
  markdown: {
    title: 'Markdown',
    description: '自然言語での記述',
    icon: FileText,
    toMarkdown: (data: any) => data,  // そのまま返す
    fromMarkdown: (md: string) => md, // そのまま返す
    validate: () => ({ isValid: true, errors: [] }) // 常に有効
  },
  useCase: {
    title: 'ユースケース',
    description: 'ユースケースの詳細定義',
    icon: FileText,
    toMarkdown: (data: any) => {
      const useCase = JSON.parse(data);
      return `# ユースケース: ${useCase.displayName || useCase.name || 'ユースケース'}

## 概要
${useCase.description || ''}

## アクター
${useCase.actors ? useCase.actors.map((a: any) => `- ${a}`).join('\n') : ''}

## 事前条件
${useCase.preconditions ? useCase.preconditions.map((p: any) => `- ${p}`).join('\n') : ''}

## 事後条件
${useCase.postconditions ? useCase.postconditions.map((p: any) => `- ${p}`).join('\n') : ''}

## 基本フロー
${useCase.basicFlow ? useCase.basicFlow.map((s: any, i: number) => `${i + 1}. ${s}`).join('\n') : ''}

## 代替フロー
${useCase.alternativeFlow ? useCase.alternativeFlow.map((f: any) => `- ${f}`).join('\n') : ''}

## 例外フロー
${useCase.exceptionFlow ? useCase.exceptionFlow.map((f: any) => `- ${f}`).join('\n') : ''}`;
    },
    fromMarkdown: (md: string) => md, // 変換しない
    validate: () => ({ isValid: true, errors: [] })
  }
};

export function UnifiedDesignEditor({
  type,
  value,
  onChange,
  serviceId,
  capabilityId,
  className,
  readOnly = false
}: UnifiedDesignEditorProps) {
  const config = designTypeConfig[type];
  const Icon = config.icon;
  
  const [activeTab, setActiveTab] = useState<'markdown' | 'preview'>('preview');
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // JSONからMarkdownに変換
  const convertToMarkdown = useCallback(() => {
    try {
      const md = config.toMarkdown(value);
      setMarkdown(md);
      setError(null);
      return md;
    } catch (err) {
      setError('JSONからMarkdownへの変換に失敗しました: ' + (err as Error).message);
      return '';
    }
  }, [value, config]);

  // MarkdownからJSONに変換
  const convertFromMarkdown = useCallback((md: string) => {
    try {
      const json = config.fromMarkdown(md, serviceId, capabilityId);
      onChange(json);
      setError(null);
      
      // バリデーション実行
      const validation = config.validate(md);
      setValidationErrors(validation.errors);
    } catch (err) {
      setError('MarkdownからJSONへの変換に失敗しました: ' + (err as Error).message);
    }
  }, [config, onChange, serviceId, capabilityId]);

  // 初回マウント時とタブ切り替え時の処理
  useEffect(() => {
    convertToMarkdown();
  }, [convertToMarkdown]);

  // Markdownエディタの変更ハンドラ
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);
    
    // リアルタイムでJSONに変換
    convertFromMarkdown(newMarkdown);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <CardTitle>{config.title}エディタ</CardTitle>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="markdown" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Markdown
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              プレビュー
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <Alert variant="default" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>検証エラー</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="markdown" className="mt-4">
            <Textarea
              value={markdown}
              onChange={handleMarkdownChange}
              className="font-mono text-sm h-[600px]"
              placeholder={`${config.title}のMarkdown定義を入力...`}
              readOnly={readOnly}
              disabled={readOnly}
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[600px] border rounded-md p-4 bg-background">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-table:text-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border mb-4">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50">{children}</thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-border">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => (
                      <th className="px-3 py-2 text-left text-xs font-medium text-foreground uppercase tracking-wider border-b border-border">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-sm text-foreground whitespace-nowrap border-b border-border">
                        {children}
                      </td>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-foreground">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 mb-4 text-foreground">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-5 mb-4 text-foreground">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1 text-foreground">{children}</li>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="px-1 py-0.5 text-sm font-mono bg-muted text-foreground rounded">
                          {children}
                        </code>
                      ) : (
                        <code className="block p-3 text-sm font-mono bg-muted text-foreground rounded-md overflow-x-auto">
                          {children}
                        </code>
                      ),
                    pre: ({ children }) => (
                      <pre className="overflow-x-auto mb-4">{children}</pre>
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {validationErrors.length === 0 && markdown && (
          <Alert className="mt-4" variant="default">
            <Check className="h-4 w-4" />
            <AlertTitle>検証成功</AlertTitle>
            <AlertDescription>Markdown形式が正しく記述されています</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}